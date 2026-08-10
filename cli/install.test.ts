import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { imaginedSource, sourceWithTwoVersionsOfPad } from './imagined-source.js'
import type { Installation, InstallOutcome } from './install.js'
import { lockfileAfter, prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import { renderUnchanged } from './report.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'

/**
 * `toopo add`, end to end, against the graph the catalogue cannot produce and against the catalogue.
 *
 * The two are not the same measurement. The five exercise a real contract, a real digest and a real
 * file landing in a real folder; none of them exercises a dependency, because none of them has one.
 * The imagined graph exercises the recursion, the deduplication and the repointing, on bytes that are
 * hashed exactly as a server's would be.
 */

const installing = (
  source: RegistrySource,
  project: TemporaryProject,
  contract: string,
  lockfile: Lockfile = EMPTY_LOCKFILE,
): InstallOutcome =>
  prepareInstallation(source, {
    root: project.root,
    configuration: project.configuration,
    lockfile,
    contract,
    implementation: null,
    at: A_PINNED_INSTANT,
  })

const mustInstall = (outcome: InstallOutcome): Installation => {
  if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))
  if ('unchanged' in outcome) throw new Error('nothing was installed')

  return outcome.installation
}

const withTheGraph = <T>(use: (project: TemporaryProject, done: Installation) => T): T => {
  const project = aProject()
  try {
    const installation = mustInstall(installing(imaginedSource(), project, 'number/round'))
    committing(project, installation)

    return use(project, installation)
  } finally {
    project.remove()
  }
}

describe('installing a feature and what it imports', () => {
  /**
   * The whole shape of an install, in one assertion: dependencies before dependents, a folder per
   * feature, an entry file named after its feature, and the shared file written once.
   */
  it('the-graph-lands-as-a-tree-of-features', () => {
    withTheGraph((_project, installation) => {
      expect(installation.writes.map((write) => write.path)).toEqual([
        'string/pad/pad.ts',
        'string/pad/digits.ts',
        'number/clamp/clamp.ts',
        'number/sign/sign.ts',
        'number/round/round.ts',
      ])
    })
  })

  it('the-cost-is-the-files-the-bytes-and-the-depth', () => {
    withTheGraph((_project, installation) => {
      expect(installation.cost.files).toBe(5)
      expect(installation.cost.depth).toBe(2)
      expect(installation.cost.bytes).toBe(
        installation.writes.reduce((total, write) => total + write.bytes.byteLength, 0),
      )
    })
  })

  /**
   * What the user's project actually holds afterwards. Both reasons a specifier moves are in this one
   * file: `digits.ts` was written in somebody else's folder, and `reference.ts` landed as `pad.ts`.
   */
  it('an-installed-file-imports-what-was-installed', () => {
    withTheGraph((project) => {
      expect(project.installed('number/clamp/clamp.ts')).toBe(
        `import { DIGITS } from '../../string/pad/digits.js'
import { pad } from '../../string/pad/pad.js'

export const clamp = (value: number, low: number, high: number): number =>
  DIGITS.test(pad(String(value), 1)) ? Math.min(Math.max(value, low), high) : low
`,
      )
      expect(project.installed('number/round/round.ts')).toContain(
        `import { clamp } from '../clamp/clamp.js'`,
      )
    })
  })

  /**
   * The finding this unit made about the lockfile, guarded. A file whose import was repointed is not
   * the file the registry served, so the lockfile has to hold both digests - one to compare with the
   * registry, one to answer "did you edit this" offline. A single digest would have marked every
   * repointed file as locally modified from the instant it was written.
   */
  it('the-lockfile-holds-what-was-served-and-what-was-written', () => {
    withTheGraph((project, installation) => {
      const files = installation.features.flatMap((feature) => feature.files)

      expect(files.filter((file) => file.sha256 !== file.served.sha256).map((file) => file.path)).toEqual([
        'number/clamp/clamp.ts',
        'number/sign/sign.ts',
        'number/round/round.ts',
      ])
      expect(files.filter((file) => file.sha256 === file.served.sha256).map((file) => file.path)).toEqual([
        'string/pad/pad.ts',
        'string/pad/digits.ts',
      ])
      expect(
        files.every(
          (file) =>
            digestOfBytes(servedBytes(Buffer.from(project.installed(file.path), 'utf8'))) ===
            file.sha256,
        ),
      ).toBe(true)
    })
  })

  /**
   * One lockfile entry per feature, and every one of them names the file the catalogue served it as.
   * A single entry claiming all five would leave `string/pad` installed and unrecorded, so a later
   * `toopo add string/pad` would meet a file it did not write and refuse.
   */
  it('every-feature-the-install-writes-gets-its-own-lockfile-entry', () => {
    withTheGraph((_project, installation) => {
      expect(installation.features.map((feature) => renderContract(feature.contract))).toEqual([
        'typescript/string/pad@1',
        'typescript/number/clamp@1',
        'typescript/number/sign@1',
        'typescript/number/round@1',
      ])
      expect(installation.features.map((feature) => feature.files.map((file) => file.served.path))).toEqual([
        ['reference.ts', 'digits.ts'],
        ['reference.ts'],
        ['reference.ts'],
        ['reference.ts'],
      ])
    })
  })

  /**
   * The feature the user typed is a root and the ones it pulled in are not, which is the fact
   * `toopo update` cannot derive and would produce an unpublished combination without.
   */
  it('only-the-feature-that-was-asked-for-is-a-root', () => {
    withTheGraph((_project, installation) => {
      expect(
        installation.features.map((feature) => [renderContract(feature.contract), feature.askedFor]),
      ).toEqual([
        ['typescript/string/pad@1', false],
        ['typescript/number/clamp@1', false],
        ['typescript/number/sign@1', false],
        ['typescript/number/round@1', true],
      ])
    })
  })

  /**
   * And it is sticky towards true, in both directions - which is two claims and needs two scenarios.
   *
   * A feature that arrived as a dependency and is later installed by name becomes a root. And a
   * feature installed by name that later arrives as somebody else's dependency **stays** one, which is
   * the direction stickiness is actually for: the second install records it as pulled in, and an
   * upstream graph gaining an edge does not unask what the user asked for. Measured by U-29, which the
   * first scenario alone could not see.
   */
  it('a-root-stays-one-when-something-else-pulls-it-in', () => {
    const project = aProject()
    try {
      const asked = mustInstall(installing(imaginedSource(), project, 'string/pad'))
      const first = committing(project, asked)

      expect(first.features.find((feature) => feature.contract.name === 'string/pad')?.askedFor).toBe(
        true,
      )

      const graph = mustInstall(installing(imaginedSource(), project, 'number/round', first))
      const after = lockfileAfter(first, graph.features)

      expect(
        graph.features.find((feature) => feature.contract.name === 'string/pad')?.askedFor,
      ).toBe(false)
      expect(after.features.find((feature) => feature.contract.name === 'string/pad')?.askedFor).toBe(
        true,
      )
    } finally {
      project.remove()
    }
  })

  it('a-feature-pulled-in-and-then-asked-for-becomes-a-root', () => {
    const project = aProject()
    try {
      const graph = mustInstall(installing(imaginedSource(), project, 'number/round'))
      const lockfile = committing(project, graph)

      expect(
        lockfile.features.find((feature) => feature.contract.name === 'string/pad')?.askedFor,
      ).toBe(false)

      // Not one byte moves - it is already there - and the lockfile still has to. Answering
      // "nothing to do" and stopping is how a feature the user asked for stays a dependency, and
      // gets removed by a later update the day nothing imports it.
      const directly = installing(imaginedSource(), project, 'string/pad', lockfile)
      if (!('unchanged' in directly)) throw new Error('string/pad was not already there')

      const after = lockfileAfter(lockfile, directly.features)

      expect(after.features.find((feature) => feature.contract.name === 'string/pad')?.askedFor).toBe(
        true,
      )
      expect(after.features.find((feature) => feature.contract.name === 'number/round')?.askedFor).toBe(
        true,
      )

      // The screen says it, and it is the only run on which it may.
      expect(directly.promoted).toBe(true)
      expect(
        renderUnchanged('typescript/string/pad@1', directly.entry, project.configuration, directly.promoted),
      ).toContain('It was there as a dependency')
    } finally {
      project.remove()
    }
  })

  /**
   * Re-adding something the user asked for changes nothing and claims nothing.
   *
   * **This is the defect a walk through a real project caught and no guard did.** `toopo add` on a
   * feature installed directly answered *It was there as a dependency*, which is an assertion about
   * the reader's own project contradicted by `toopo.lock`, by `toopo list`, and by the `add` that had
   * put it there. It came from one boolean answering two questions: the screen was reading *did the
   * lockfile change at all* to decide whether a promotion had happened.
   *
   * And the lockfile *did* change, on every run, which is the second half. The entry was stamped with
   * the run's own clock, so a file describing exactly the same install came out one line different -
   * a diff in a committed file for nothing. `reconcile.ts` states the rule this path did not honour:
   * the instant moves only when something did.
   *
   * **The second call is at a later instant on purpose.** Both halves are invisible under one pinned
   * moment, which is what the helper pins - so this guard passes its own, and a version of it that did
   * not would go green on the defect it exists for.
   */
  it('re-adding-what-you-asked-for-changes-nothing-and-claims-nothing', () => {
    const project = aProject()
    try {
      const first = mustInstall(installing(imaginedSource(), project, 'string/pad'))
      const lockfile = committing(project, first)

      const again = prepareInstallation(imaginedSource(), {
        root: project.root,
        configuration: project.configuration,
        lockfile,
        contract: 'string/pad',
        implementation: null,
        at: '2027-01-01T00:00:00.000Z',
      })

      if (!('unchanged' in again)) throw new Error('string/pad was not already there')

      expect(again.promoted).toBe(false)
      expect(
        renderUnchanged('typescript/string/pad@1', again.entry, project.configuration, again.promoted),
      ).not.toContain('It was there as a dependency')

      // Byte for byte the file that was already there, the instant included.
      expect(lockfileAfter(lockfile, again.features)).toEqual(lockfile)
    } finally {
      project.remove()
    }
  })

  /** Every one of the five installs its reference, whole, under the name of the feature. */
  it('each-of-the-five-installs-one-file-named-after-itself', () => {
    const source = localSource()
    const project = aProject()
    try {
      const installed = ['number/parse', 'date/add', 'string/levenshtein', 'string/slugify'].map(
        (contract) => {
          const installation = mustInstall(installing(source, project, contract))
          committing(project, installation)

          return installation.writes.map((write) => write.path)
        },
      )

      expect(installed).toEqual([
        ['number/parse/parse.ts'],
        ['date/add/add.ts'],
        ['string/levenshtein/levenshtein.ts'],
        ['string/slugify/slugify.ts'],
      ])
    } finally {
      project.remove()
    }
  })

  /**
   * A file with no dependency has nothing to repoint, so what lands is the bytes the registry served,
   * byte for byte. This is the guard that would redden if the installer ever "tidied" what it copies.
   */
  it('a-feature-with-no-dependency-lands-exactly-as-it-was-served', () => {
    const project = aProject()
    try {
      const installation = mustInstall(installing(localSource(), project, 'string/slugify'))

      const files = installation.features.flatMap((feature) => feature.files)

      expect(installation.writes.map((write) => write.repointed)).toEqual([false])
      expect(files.map((file) => file.sha256)).toEqual(files.map((file) => file.served.sha256))
    } finally {
      project.remove()
    }
  })

  it('a-contract-the-catalogue-refused-is-not-installable', () => {
    const project = aProject()
    try {
      const outcome = installing(localSource(), project, 'array/group-by')

      expect('faults' in outcome && outcome.faults).toEqual([
        'typescript/array/group-by@1 is in the catalogue and the registry publishes no implementation of it, ' +
          'so there is nothing to install. `toopo search array/group-by` shows what the catalogue ' +
          'says about it.',
      ])
    } finally {
      project.remove()
    }
  })

  it('a-name-the-catalogue-does-not-hold-is-refused', () => {
    const project = aProject()
    try {
      expect(installing(localSource(), project, 'string/titlecase')).toEqual({
        faults: ['the registry holds no contract called `string/titlecase`'],
      })
    } finally {
      project.remove()
    }
  })

  /**
   * Two dependents published against two versions of one feature. Both addresses resolve because both
   * artefacts exist; what is refused is both landing, since one feature is one folder.
   */
  it('two-versions-of-one-feature-are-refused-before-anything-is-written', () => {
    const project = aProject()
    try {
      const outcome = installing(sourceWithTwoVersionsOfPad(), project, 'number/round')

      expect('faults' in outcome).toBe(true)
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /**
   * The check `response.ts` refused to describe rather than provide, called on every blob. A registry
   * answering bytes that are not the ones its address names is the failure content addressing exists
   * to make detectable, and an installer that skipped this would make the whole scheme decorative.
   */
  it('a-blob-that-is-not-what-its-address-names-is-refused', () => {
    const honest = imaginedSource()
    const tampered: RegistrySource = {
      ...honest,
      blob: (sha256) => {
        const answer = honest.blob(sha256)

        return answer === null ? null : { ...answer, bytes: Buffer.from('not what was asked for') }
      },
    }
    const project = aProject()
    try {
      const outcome = installing(tampered, project, 'number/round')

      expect('faults' in outcome && outcome.faults.every((fault) => fault.includes('hash to'))).toBe(true)
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /** The same check one level up: a snapshot whose body is not what its digest was taken over. */
  it('a-snapshot-that-is-not-what-its-digest-names-is-refused', () => {
    const honest = imaginedSource()
    const tampered: RegistrySource = {
      ...honest,
      snapshot: (digest) => {
        const answer = honest.snapshot(digest)

        return answer === null
          ? null
          : { ...answer, canonicalText: answer.canonicalText.replace('"toopo"', '"someone-else"') }
      },
    }
    const project = aProject()
    try {
      const outcome = installing(tampered, project, 'number/round')

      expect('faults' in outcome && outcome.faults[0]).toContain('canonicalises to')
    } finally {
      project.remove()
    }
  })

  /** An edge the registry does not hold stops the install rather than installing part of a graph. */
  it('an-edge-the-registry-does-not-hold-is-refused', () => {
    const project = aProject()
    try {
      const outcome = installing(
        imaginedSource(['typescript/string/pad@1/reference@1.0.0']),
        project,
        'number/round',
      )

      expect('faults' in outcome && outcome.faults).toEqual([
        'typescript/string/pad@1/reference@1.0.0 is named by an edge and the registry holds no such published ' +
          'implementation',
      ])
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /**
   * Installing the same thing twice is a no-op that says so, rather than a rewrite of files that are
   * already right. What makes it safe to answer is that both halves are checked: the lockfile records
   * this implementation, and every file still hashes to what was written.
   */
  it('reinstalling-what-is-already-there-changes-nothing', () => {
    const project = aProject()
    try {
      const first = mustInstall(installing(localSource(), project, 'string/slugify'))
      const lockfile = committing(project, first)

      const again = installing(localSource(), project, 'string/slugify', lockfile)

      expect('unchanged' in again && renderContract(again.unchanged.contract)).toBe('typescript/string/slugify@1')
    } finally {
      project.remove()
    }
  })

  /**
   * Nothing is written until everything is decided. Measured by refusing at the last possible moment -
   * a file already on disk that the lockfile does not claim - and asking what the folder holds.
   */
  it('a-refusal-leaves-the-project-exactly-as-it-was', () => {
    const project = aProject()
    try {
      project.write('src/lib/toopo/string/pad/pad.ts', 'export const pad = "mine"\n')

      const outcome = installing(imaginedSource(), project, 'number/round')

      expect('faults' in outcome).toBe(true)
      expect(readdirSync(join(project.root, project.configuration.directory, 'string/pad'))).toEqual([
        'pad.ts',
      ])
      expect(project.installed('string/pad/pad.ts')).toBe('export const pad = "mine"\n')
    } finally {
      project.remove()
    }
  })
})
