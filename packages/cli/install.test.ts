import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { THE_INVOCATION, renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import { A_NAME_THE_CATALOGUE_DOES_NOT_HOLD } from '../registry/imagined-addresses.js'
import { clamp, pad, sign } from '../registry/imagined-graph.js'
import type { ImplementationRecord, Lockfile } from '../registry/implementation-record.js'
import { servedSnapshot } from '../registry/response.js'
import type { Snapshot } from '../registry/snapshot.js'
import { digestOfSnapshot, implementationSnapshot } from '../registry/snapshot.js'
import { deciding } from './fixpoint.js'
import { imaginedSource, sourceWithTwoVersionsOfPad } from './imagined-source.js'
import type { Installation, InstallOutcome } from './install.js'
import { lockfileAfter, prepareInstallation } from './install.js'
import { A_REGISTRY_PUBLISHING_BETWEEN_TWO_REQUESTS } from './resolve.js'
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

const installing = async (
  source: RegistrySource,
  project: TemporaryProject,
  contract: string,
  lockfile: Lockfile = EMPTY_LOCKFILE,
): Promise<InstallOutcome> =>
  (
    await deciding(source, (held) =>
      prepareInstallation(held, {
        root: project.root,
        configuration: project.configuration,
        lockfile,
        contract,
        implementation: null,
        at: A_PINNED_INSTANT,
      }),
    )
  ).answer

const mustInstall = (outcome: InstallOutcome): Installation => {
  if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))
  if ('unchanged' in outcome) throw new Error('nothing was installed')

  return outcome.installation
}

const digestOf = (record: ImplementationRecord): string =>
  digestOfSnapshot(implementationSnapshot(record))

/**
 * A registry whose `carrier` was published with its edge to `imagined-string/pad@1` carrying `instead`'s digest.
 *
 * Everything else it answers is honest, and the corrupted snapshot hashes to the address it is served
 * at - because it *is* the artefact the registry published. What a wire adds over a local source is not
 * a damaged body, which `servedSnapshotFaults` already catches; it is a whole, self-consistent answer
 * that is simply not the one that was asked for.
 *
 * Shared by the two guards below because they differ only in which edge lies, which is exactly what
 * separates *the walk follows it* from *the walk has already resolved that address*.
 */
const publishedWithALyingEdge = (
  carrier: string,
  instead: ImplementationRecord,
): RegistrySource => {
  const honest = imaginedSource()
  const edgeToPad = clamp.dependsOn[0]
  if (edgeToPad === undefined) throw new Error('the imagined graph no longer has clamp import pad')

  return {
    ...honest,
    snapshot: async (digest) => {
      const answer = await honest.snapshot(digest)
      if (answer === null) return null

      const parsed = JSON.parse(answer.canonicalText) as Snapshot
      if (parsed.unit !== 'implementation' || parsed.frozen.contract.name !== carrier) return answer

      return servedSnapshot({
        ...parsed,
        frozen: {
          ...parsed.frozen,
          dependsOn: [{ implementation: edgeToPad.implementation, digest: digestOf(instead) }],
        },
      })
    },
  }
}

/** `return await`, because the `finally` would otherwise remove the project under an async callback. */
const withTheGraph = async <T>(
  use: (project: TemporaryProject, done: Installation) => T | Promise<T>,
): Promise<T> => {
  const project = aProject()
  try {
    const installation = mustInstall(await installing(imaginedSource(), project, 'imagined-number/round'))
    committing(project, installation)

    return await use(project, installation)
  } finally {
    project.remove()
  }
}

describe('installing a feature and what it imports', () => {
  /**
   * The whole shape of an install, in one assertion: dependencies before dependents, a folder per
   * feature, an entry file named after its feature, and the shared file written once.
   */
  it('the-graph-lands-as-a-tree-of-features', async () => {
    await withTheGraph((_project, installation) => {
      expect(installation.writes.map((write) => write.path)).toEqual([
        'imagined-string/pad.ts',
        'imagined-string/pad/digits.ts',
        'imagined-number/clamp.ts',
        'imagined-number/sign.ts',
        'imagined-number/round.ts',
      ])
    })
  })

  it('the-cost-is-the-files-the-bytes-and-the-depth', async () => {
    await withTheGraph((_project, installation) => {
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
  it('an-installed-file-imports-what-was-installed', async () => {
    await withTheGraph((project) => {
      expect(project.installed('imagined-number/clamp.ts')).toBe(
        `import { DIGITS } from '../imagined-string/pad/digits.js'
import { pad } from '../imagined-string/pad.js'

export const clamp = (value: number, low: number, high: number): number =>
  DIGITS.test(pad(String(value), 1)) ? Math.min(Math.max(value, low), high) : low
`,
      )
      expect(project.installed('imagined-number/round.ts')).toContain(
        `import { clamp } from './clamp.js'`,
      )
    })
  })

  /**
   * The finding this unit made about the lockfile, guarded. A file whose import was repointed is not
   * the file the registry served, so the lockfile has to hold both digests - one to compare with the
   * registry, one to answer "did you edit this" offline. A single digest would have marked every
   * repointed file as locally modified from the instant it was written.
   */
  it('the-lockfile-holds-what-was-served-and-what-was-written', async () => {
    await withTheGraph((project, installation) => {
      const files = installation.features.flatMap((feature) => feature.files)

      // Four of the five, because ADR-0110 puts an entry file a level above the folder its own files
      // land in: `imagined-string/pad.ts` is repointed at `./pad/digits.js` although it depends on nothing.
      // What the registry served untouched is the folder's own file, and only that.
      expect(files.filter((file) => file.sha256 !== file.served.sha256).map((file) => file.path)).toEqual([
        'imagined-string/pad.ts',
        'imagined-number/clamp.ts',
        'imagined-number/sign.ts',
        'imagined-number/round.ts',
      ])
      expect(files.filter((file) => file.sha256 === file.served.sha256).map((file) => file.path)).toEqual([
        'imagined-string/pad/digits.ts',
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
   * A single entry claiming all five would leave `imagined-string/pad` installed and unrecorded, so a later
   * `toopo add imagined-string/pad` would meet a file it did not write and refuse.
   */
  it('every-feature-the-install-writes-gets-its-own-lockfile-entry', async () => {
    await withTheGraph((_project, installation) => {
      expect(installation.features.map((feature) => renderContract(feature.contract))).toEqual([
        'typescript/imagined-string/pad@1',
        'typescript/imagined-number/clamp@1',
        'typescript/imagined-number/sign@1',
        'typescript/imagined-number/round@1',
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
  it('only-the-feature-that-was-asked-for-is-a-root', async () => {
    await withTheGraph((_project, installation) => {
      expect(
        installation.features.map((feature) => [renderContract(feature.contract), feature.askedFor]),
      ).toEqual([
        ['typescript/imagined-string/pad@1', false],
        ['typescript/imagined-number/clamp@1', false],
        ['typescript/imagined-number/sign@1', false],
        ['typescript/imagined-number/round@1', true],
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
  it('a-root-stays-one-when-something-else-pulls-it-in', async () => {
    const project = aProject()
    try {
      const asked = mustInstall(await installing(imaginedSource(), project, 'imagined-string/pad'))
      const first = committing(project, asked)

      expect(first.features.find((feature) => feature.contract.name === 'imagined-string/pad')?.askedFor).toBe(
        true,
      )

      const graph = mustInstall(await installing(imaginedSource(), project, 'imagined-number/round', first))
      const after = lockfileAfter(first, graph.features)

      expect(
        graph.features.find((feature) => feature.contract.name === 'imagined-string/pad')?.askedFor,
      ).toBe(false)
      expect(after.features.find((feature) => feature.contract.name === 'imagined-string/pad')?.askedFor).toBe(
        true,
      )
    } finally {
      project.remove()
    }
  })

  it('a-feature-pulled-in-and-then-asked-for-becomes-a-root', async () => {
    const project = aProject()
    try {
      const graph = mustInstall(await installing(imaginedSource(), project, 'imagined-number/round'))
      const lockfile = committing(project, graph)

      expect(
        lockfile.features.find((feature) => feature.contract.name === 'imagined-string/pad')?.askedFor,
      ).toBe(false)

      // Not one byte moves - it is already there - and the lockfile still has to. Answering
      // "nothing to do" and stopping is how a feature the user asked for stays a dependency, and
      // gets removed by a later update the day nothing imports it.
      const directly = await installing(imaginedSource(), project, 'imagined-string/pad', lockfile)
      if (!('unchanged' in directly)) throw new Error('imagined-string/pad was not already there')

      const after = lockfileAfter(lockfile, directly.features)

      expect(after.features.find((feature) => feature.contract.name === 'imagined-string/pad')?.askedFor).toBe(
        true,
      )
      expect(after.features.find((feature) => feature.contract.name === 'imagined-number/round')?.askedFor).toBe(
        true,
      )

      // The screen says it, and it is the only run on which it may.
      expect(directly.promoted).toBe(true)
      expect(
        renderUnchanged('typescript/imagined-string/pad@1', directly.entry, project.configuration, directly.promoted),
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
  it('re-adding-what-you-asked-for-changes-nothing-and-claims-nothing', async () => {
    const project = aProject()
    try {
      const first = mustInstall(await installing(imaginedSource(), project, 'imagined-string/pad'))
      const lockfile = committing(project, first)

      const { answer: again } = await deciding(imaginedSource(), (held) =>
        prepareInstallation(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile,
          contract: 'imagined-string/pad',
          implementation: null,
          at: '2027-01-01T00:00:00.000Z',
        }),
      )

      if (!('unchanged' in again)) throw new Error('imagined-string/pad was not already there')

      expect(again.promoted).toBe(false)
      expect(
        renderUnchanged('typescript/imagined-string/pad@1', again.entry, project.configuration, again.promoted),
      ).not.toContain('It was there as a dependency')

      // Byte for byte the file that was already there, the instant included.
      expect(lockfileAfter(lockfile, again.features)).toEqual(lockfile)
    } finally {
      project.remove()
    }
  })

  /** Every one of the five installs its reference, whole, under the name of the feature. */
  it('each-of-the-five-installs-one-file-named-after-itself', async () => {
    const source = localSource()
    const project = aProject()
    try {
      // Sequential rather than gathered, because each install is committed before the next one is
      // planned - the fourth is planned against a project already holding the first three.
      const installed: string[][] = []
      for (const contract of ['number/parse', 'date/add', 'string/levenshtein', 'string/slugify']) {
        const installation = mustInstall(await installing(source, project, contract))
        committing(project, installation)

        installed.push(installation.writes.map((write) => write.path))
      }

      expect(installed).toEqual([
        ['number/parse.ts'],
        ['date/add.ts'],
        ['string/levenshtein.ts'],
        ['string/slugify.ts'],
      ])
    } finally {
      project.remove()
    }
  })

  /**
   * A file with no dependency has nothing to repoint, so what lands is the bytes the registry served,
   * byte for byte. This is the guard that would redden if the installer ever "tidied" what it copies.
   */
  it('a-feature-with-no-dependency-lands-exactly-as-it-was-served', async () => {
    const project = aProject()
    try {
      const installation = mustInstall(await installing(localSource(), project, 'string/slugify'))

      const files = installation.features.flatMap((feature) => feature.files)

      expect(installation.writes.map((write) => write.repointed)).toEqual([false])
      expect(files.map((file) => file.sha256)).toEqual(files.map((file) => file.served.sha256))
    } finally {
      project.remove()
    }
  })

  it('a-contract-the-catalogue-refused-is-not-installable', async () => {
    const project = aProject()
    try {
      const outcome = await installing(localSource(), project, 'array/group-by')

      expect('faults' in outcome && outcome.faults).toEqual([
        'typescript/array/group-by@1 is in the catalogue and the registry publishes no implementation of it, ' +
          `so there is nothing to install. \`${THE_INVOCATION} search array/group-by\` shows what the catalogue ` +
          'says about it.',
      ])
    } finally {
      project.remove()
    }
  })

  /**
   * The name is `imagined-addresses.ts`'s rather than a literal, and that is the whole of ADR-0142
   * arriving from the far side: this guard asserts that the catalogue holds *no* contract at a name,
   * so a name the catalogue could one day hold is a guard that quietly becomes false. It used to read
   * `string/titlecase`.
   */
  it('a-name-the-catalogue-does-not-hold-is-refused', async () => {
    const project = aProject()
    const name = A_NAME_THE_CATALOGUE_DOES_NOT_HOLD.name
    try {
      expect(await installing(localSource(), project, name)).toEqual({
        faults: [`the registry holds no contract called \`${name}\``],
      })
    } finally {
      project.remove()
    }
  })

  /**
   * Two dependents published against two versions of one feature. Both addresses resolve because both
   * artefacts exist; what is refused is both landing, since one feature lands in one place.
   */
  it('two-versions-of-one-feature-are-refused-before-anything-is-written', async () => {
    const project = aProject()
    try {
      const outcome = await installing(sourceWithTwoVersionsOfPad(), project, 'imagined-number/round')

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
  it('a-blob-that-is-not-what-its-address-names-is-refused', async () => {
    const honest = imaginedSource()
    const tampered: RegistrySource = {
      ...honest,
      blob: async (sha256) => {
        const answer = await honest.blob(sha256)

        return answer === null ? null : { ...answer, bytes: Buffer.from('not what was asked for') }
      },
    }
    const project = aProject()
    try {
      const outcome = await installing(tampered, project, 'imagined-number/round')

      expect('faults' in outcome && outcome.faults.every((fault) => fault.includes('hash to'))).toBe(true)
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /** The same check one level up: a snapshot whose body is not what its digest was taken over. */
  it('a-snapshot-that-is-not-what-its-digest-names-is-refused', async () => {
    const honest = imaginedSource()
    const tampered: RegistrySource = {
      ...honest,
      snapshot: async (digest) => {
        const answer = await honest.snapshot(digest)

        return answer === null
          ? null
          : { ...answer, canonicalText: answer.canonicalText.replace('"toopo"', '"someone-else"') }
      },
    }
    const project = aProject()
    try {
      const outcome = await installing(tampered, project, 'imagined-number/round')

      expect('faults' in outcome && outcome.faults[0]).toContain('canonicalises to')
    } finally {
      project.remove()
    }
  })

  /**
   * An edge the registry does not hold stops the install rather than installing part of a graph.
   *
   * The refusal names the digest since edges began carrying one, and that is a gain rather than a
   * change of wording: the client no longer asks which digest an edge resolves to, so what is missing
   * is a content address rather than an answer about a name, and the sentence says the address that
   * went unanswered.
   */
  it('an-edge-the-registry-does-not-hold-is-refused', async () => {
    const project = aProject()
    try {
      const outcome = await installing(
        imaginedSource(['typescript/imagined-string/pad@1/reference@1.0.0']),
        project,
        'imagined-number/round',
      )

      expect('faults' in outcome && outcome.faults).toEqual([
        'the registry serves no snapshot at ' +
          '32dc2b46be62aa96cecea37f31048ca6ef71a8bb66bc97e5768534a5bad76c89, which ' +
          'typescript/imagined-string/pad@1/reference@1.0.0 names',
      ])
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /**
   * An edge that names one artefact and carries another's digest is refused, naming both.
   *
   * Every other check passes: the registry answers honestly, the body at that digest is a whole
   * self-consistent snapshot, and `servedSnapshotFaults` recanonicalises it to exactly the address it
   * was fetched by. Nothing about the bytes is wrong. What is wrong is that they are the wrong
   * artefact - and until edges carried a digest, `gatherHoldings` could not be told so, because it
   * found the digest by looking `id` and `version` up in the bindings and the identity fell out of
   * that lookup.
   *
   * **What this guard buys was measured rather than assumed, and it is not what it was written
   * believing.** Over the six substitutions the imagined graph can express - three at a root binding,
   * three at an edge - taking this check out leaves five of them refused anyway, downstream, under
   * *typescript/imagined-string/pad@1/reference@1.0.0 cannot be resolved, and the registry holds no such
   * published implementation* and *typescript/imagined-number/sign@1 publishes no reference.ts*. Both name a
   * cause no measurement establishes: the registry publishes and serves both. So the repair is a
   * refusal that names the fact instead of one that sends its reader hunting for a problem that does
   * not exist, which is the class this repository calls its worst. The sixth is
   * `two-edges-naming-one-address-at-two-digests-are-refused` below.
   *
   * `sign` is put in `pad`'s place because they are the two ends of the graph a plan treats
   * differently: `pad` carries the shared `digits.ts` and `sign` does not.
   *
   * The edge is written as a literal here, and this is the only place in the repository where one can
   * be: `edgeTo` reads the digest off the artefact it points at, so no production path can build this
   * value. What a test reproduces is what a registry can publish and a wire can deliver.
   */
  it('an-edge-whose-digest-names-another-artefact-is-refused', async () => {
    const project = aProject()
    try {
      const outcome = await installing(publishedWithALyingEdge('imagined-number/clamp', sign), project, 'imagined-number/round')

      expect('faults' in outcome && outcome.faults).toEqual([
        `the snapshot served at ${digestOf(sign)}: it declares itself ` +
          'typescript/imagined-number/sign@1/reference@1.0.0, where ' +
          'typescript/imagined-string/pad@1/reference@1.0.0 is what was asked for. A snapshot says which ' +
          'artefact it is, so this is the wrong artefact rather than a damaged one.',
      ])
      expect(existsSync(join(project.root, project.configuration.directory))).toBe(false)
    } finally {
      project.remove()
    }
  })

  /**
   * Two dependents naming one address at two digests are refused, rather than one of them being
   * believed because the walk reached it first.
   *
   * **The one substitution the guard above does not reach, and it was found by measuring the six
   * rather than by reading the loop.** `gatherHoldings` fetches an address once, so an edge naming
   * something already resolved needs no request - and skipping it outright threw its digest away. With
   * `imagined-number/sign@1` published naming `imagined-string/pad@1` at `imagined-number/clamp@1`'s digest, the honest edge from
   * `imagined-number/clamp@1` arrives first, the lying one is skipped, and the install answers five correct
   * files. **The right artefact lands because of the order the walk happens to take**, and the same
   * corrupt registry refuses when the two arrive the other way round.
   *
   * It is not registry hygiene. `imagined-number/sign@1` was published against `imagined-number/clamp@1`'s code and the
   * project is getting `imagined-string/pad@1`'s - a combination nobody published, which is the thing
   * `reconcile.ts` already refuses to assemble one version at a time.
   */
  it('two-edges-naming-one-address-at-two-digests-are-refused', async () => {
    const project = aProject()
    try {
      const outcome = await installing(publishedWithALyingEdge('imagined-number/sign', clamp), project, 'imagined-number/round')

      expect('faults' in outcome && outcome.faults).toEqual([
        'typescript/imagined-string/pad@1/reference@1.0.0 is named by two edges at two digests, ' +
          `${digestOf(pad)} and ${digestOf(clamp)}. One of the features being installed was ` +
          'published against an artefact the other is not getting, which is a combination nobody ' +
          'published.',
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
  it('reinstalling-what-is-already-there-changes-nothing', async () => {
    const project = aProject()
    try {
      const first = mustInstall(await installing(localSource(), project, 'string/slugify'))
      const lockfile = committing(project, first)

      const again = await installing(localSource(), project, 'string/slugify', lockfile)

      expect('unchanged' in again && renderContract(again.unchanged.contract)).toBe('typescript/string/slugify@1')
    } finally {
      project.remove()
    }
  })

  /**
   * Nothing is written until everything is decided. Measured by refusing at the last possible moment -
   * a file already on disk that the lockfile does not claim - and asking what the folder holds.
   */
  it('a-refusal-leaves-the-project-exactly-as-it-was', async () => {
    const project = aProject()
    try {
      project.write('src/lib/toopo/imagined-string/pad.ts', 'export const pad = "mine"\n')

      const outcome = await installing(imaginedSource(), project, 'imagined-number/round')

      expect('faults' in outcome).toBe(true)
      expect(readdirSync(join(project.root, project.configuration.directory, 'imagined-string'))).toEqual([
        'pad.ts',
      ])
      expect(project.installed('imagined-string/pad.ts')).toBe('export const pad = "mine"\n')
    } finally {
      project.remove()
    }
  })

  /**
   * An installation reads two named answers, and a lockfile stamped with one of them while the other
   * came from somewhere else would record a state that never served this install.
   *
   * **It is an ordinary event rather than a hostile one** - a deployment publishing between two
   * requests - which is why the refusal says to run the command again and accuses nobody. What it must
   * not do is pick one and carry on, because the whole value of the field is that a reader can go back
   * to it. ADR-0091.
   *
   * The second assertion is what stops this from being a guard about a wrapper: the same source, with
   * its two answers agreeing, installs.
   */
  it('two-named-answers-from-two-revisions-refuse-the-install', async () => {
    const project = aProject()
    try {
      const honest = imaginedSource()
      const midDeployment: RegistrySource = {
        ...honest,
        contractIndex: async () => ({
          ...(await honest.contractIndex()),
          servedFrom: 'a'.repeat(40),
        }),
      }

      const outcome = await installing(midDeployment, project, 'imagined-number/round')
      if (!('faults' in outcome)) throw new Error('a mid-deployment install was not refused')

      expect(outcome.faults.join('\n')).toContain(A_REGISTRY_PUBLISHING_BETWEEN_TWO_REQUESTS)
      expect(outcome.faults.join('\n')).toContain('Run the command again')
      expect(existsSync(join(project.root, 'toopo.lock'))).toBe(false)

      expect(mustInstall(await installing(honest, project, 'imagined-number/round')).features.length)
        .toBeGreaterThan(0)
    } finally {
      project.remove()
    }
  })
})
