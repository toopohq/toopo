import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'
import { THE_UNPUBLISHED_REVISION } from '../registry/revision.js'
import { deciding } from './fixpoint.js'
import { GIT_WAS_NOT_ASKED } from './ignored.js'
import {
  imaginedSource,
  sourceWithIndependentCarriers,
  updatedImaginedSource,
} from './imagined-source.js'
import { prepareInstallation } from './install.js'
import { renderUpToDate, renderUpdate } from './report.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'
import type { FileOutcome, Reconciliation } from './reconcile.js'
import { nothingMoved } from './reconcile.js'
import { prepareUpdate } from './update.js'
import { commit } from './write.js'

/**
 * `toopo update` against the graph the catalogue cannot produce, one publication later.
 *
 * The second publication is not two edited files: `string/pad` changes its body, `number/round` changes
 * its body *and* stops importing `number/sign`, and `number/clamp` changes nothing at all while being
 * republished against a dependency that moved. Those are the four things an update has to be able to
 * tell apart, and a fixture where everything changes could not tell any of them.
 */

const AT = '2026-08-04T00:00:00.000Z'

/** A project holding `number/round` and everything it imports, as `toopo add` left it. */
const installed = async (): Promise<{
  readonly project: TemporaryProject
  readonly lockfile: Lockfile
}> => {
  const project = aProject()
  const { answer: outcome } = await deciding(imaginedSource(), (held) =>
    prepareInstallation(held, {
      root: project.root,
      configuration: project.configuration,
      lockfile: EMPTY_LOCKFILE,
      contract: 'number/round',
      implementation: null,
      at: A_PINNED_INSTANT,
    }),
  )

  if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))

  return { project, lockfile: committing(project, outcome.installation) }
}

const updating = async (
  project: TemporaryProject,
  lockfile: Lockfile,
  source: RegistrySource = updatedImaginedSource(),
): Promise<Reconciliation> => {
  const { answer: outcome } = await deciding(source, (held) =>
    prepareUpdate(held, {
      root: project.root,
      configuration: project.configuration,
      lockfile,
      at: AT,
    }),
  )

  if (!('reconciliation' in outcome)) throw new Error(outcome.faults.join('\n'))

  return outcome.reconciliation
}

/**
 * `return await` rather than `return`, and it is a correctness fix rather than a style.
 *
 * The callback is asynchronous now, so `return use(...)` hands back a pending promise and the `finally`
 * removes the project **before** the guard inside it has finished reading the disk. Nothing about that
 * fails to compile, and it fails at run time as a file that vanished mid-assertion.
 */
const inProject = async <T>(
  use: (project: TemporaryProject, lockfile: Lockfile) => T | Promise<T>,
): Promise<T> => {
  const { project, lockfile } = await installed()
  try {
    return await use(project, lockfile)
  } finally {
    project.remove()
  }
}

/** Every file the update has an opinion about, as `path -> verdict`. */
const verdicts = (update: Reconciliation): Readonly<Record<string, string>> =>
  Object.fromEntries(
    update.features.flatMap((feature) =>
      feature.files
        .filter((file: FileOutcome) => file.verdict !== 'unchanged')
        .map((file) => [file.path, file.verdict]),
    ),
  )

const heldBack = (update: Reconciliation): readonly string[] =>
  update.features
    .filter((feature) => feature.heldBack !== null)
    .map((feature) => renderContract(feature.contract))

describe('comparing a project with what the registry serves now', () => {
  /** The whole shape of a nominal update, in one assertion. */
  it('an-update-writes-the-bytes-the-registry-now-serves', async () => {
    await inProject(async (project, lockfile) => {
      const update = await updating(project, lockfile)

      expect(verdicts(update)).toEqual({
        'string/pad/pad.ts': 'updated',
        'number/round/round.ts': 'updated',
        'number/sign/sign.ts': 'removed',
      })
      expect(update.writes.map((write) => write.path)).toEqual([
        'string/pad/pad.ts',
        'number/round/round.ts',
      ])
      expect(update.removals).toEqual(['number/sign/sign.ts'])
      expect(
        update.writes.find((write) => write.path === 'number/round/round.ts')?.bytes.toString('utf8'),
      ).toContain('return clamp(value, -places, places)')
    })
  })

  /**
   * A version that moved with no byte changing is still a change to the lockfile, and the user is told
   * about it. `number/clamp@1` is republished against a `string/pad` that moved, and its own source is
   * identical between the two publications.
   */
  it('a-version-that-moved-with-no-byte-changing-is-recorded-anyway', async () => {
    await inProject(async (project, lockfile) => {
      const update = await updating(project, lockfile)
      const clamp = update.features.find((feature) => feature.contract.name === 'number/clamp')

      expect(clamp?.files.every((file) => file.verdict === 'unchanged')).toBe(true)
      expect({ was: clamp?.was?.version, now: clamp?.now?.version }).toEqual({
        was: '1.0.0',
        now: '1.0.1',
      })
      expect(
        update.lockfile.features.find((feature) => feature.contract.name === 'number/clamp')
          ?.implementation.version,
      ).toBe('1.0.1')

      /**
       * And the line under it says what is known rather than why.
       *
       * It read *republished against a dependency that moved*, which is a cause this run cannot
       * establish: a publisher may republish identical bytes for any reason at all. What the run does
       * know is that the version moved and no byte of this feature did, and that is what it says.
       */
      const block = renderUpdate(update, lockfile, project.configuration, false, GIT_WAS_NOT_ASKED)
      expect(block).toContain('the same bytes, at a version the registry moved')
      expect(block).not.toContain('republished against a dependency')
    })
  })

  /**
   * A dependency the new graph no longer reaches goes, and its lockfile entry goes with it. Left
   * behind it would be a folder the lockfile claims and nothing imports, which is the accumulation
   * that makes a tool stop being trusted.
   */
  it('a-dependency-that-left-the-closure-is-removed', async () => {
    await inProject(async (project, lockfile) => {
      const update = await updating(project, lockfile)

      expect(update.removals).toEqual(['number/sign/sign.ts'])
      expect(update.lockfile.features.map((feature) => feature.contract.name)).toEqual([
        'number/clamp',
        'number/round',
        'string/pad',
      ])
    })
  })

  /** Both sides moved, which is the only case where refusing to overwrite means anything. */
  it('a-file-changed-on-both-sides-is-a-conflict', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = await updating(project, lockfile)

      expect(verdicts(update)['number/round/round.ts']).toBe('conflict')
      expect(update.writes.map((write) => write.path)).toEqual(['string/pad/pad.ts'])
    })
  })

  /**
   * And the whole feature is held back, not the file. A feature half at one version and half at
   * another is a combination nobody published, and worse than not updating at all.
   */
  it('a-conflicted-feature-is-held-back-whole', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = await updating(project, lockfile)
      const round = update.features.find((feature) => feature.contract.name === 'number/round')

      expect(round?.heldBack).toBe('a file of it changed here and in the registry')
      expect(update.writes.some((write) => write.path.startsWith('number/round/'))).toBe(false)
    })
  })

  /**
   * The propagation, measured on the feature everything imports. Editing `string/pad`'s own file holds
   * `string/pad`, and `number/clamp` imports it, and `number/round` imports that.
   */
  it('a-feature-that-imports-a-held-back-one-is-held-back-too', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/string/pad/pad.ts', 'export const pad = "mine"\n')

      const update = await updating(project, lockfile)

      expect([...heldBack(update)].sort()).toEqual([
        'typescript/number/clamp@1',
        'typescript/number/round@1',
        'typescript/number/sign@1',
        'typescript/string/pad@1',
      ])
      expect(
        update.features.find((feature) => feature.contract.name === 'number/round')?.heldBack,
      ).toBe('it imports typescript/number/clamp@1, which is held back')
      expect(update.writes).toEqual([])
    })
  })

  /**
   * The rule found by reading the report rather than the code. `number/sign` leaves because the *new*
   * `number/round` stopped importing it - and a held-back `number/round` is running the *old* code,
   * which imports it still. Removing it would break a build in order to tidy a folder.
   */
  it('nothing-is-removed-while-a-feature-is-held-back', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = await updating(project, lockfile)
      const sign = update.features.find((feature) => feature.contract.name === 'number/sign')

      expect(update.removals).toEqual([])
      expect(sign?.heldBack).toContain('may still import this')
      expect(
        update.lockfile.features.map((feature) => feature.contract.name).includes('number/sign'),
      ).toBe(true)
    })
  })

  /**
   * A file the user edited that the registry did not touch is left exactly where it is, and the feature
   * around it still updates. `digits.ts` is byte-identical in both publications.
   */
  it('a-file-the-registry-did-not-change-keeps-your-version', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/string/pad/digits.ts', 'export const DIGITS = /^[01]+$/\n')

      const update = await updating(project, lockfile)

      expect(verdicts(update)['string/pad/digits.ts']).toBe('kept')
      expect(heldBack(update)).toEqual([])
      expect(update.writes.map((write) => write.path)).toContain('string/pad/pad.ts')
      expect(update.writes.map((write) => write.path)).not.toContain('string/pad/digits.ts')
    })
  })

  /**
   * The lockfile keeps recording what *we* wrote for a kept file, and not what is on disk. Recording
   * the disk would write the user's own edit into the lockfile as though we had put it there - after
   * which their change is invisible and the next run overwrites it without a word.
   */
  it('a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk', async () => {
    await inProject(async (project, lockfile) => {
      const mine = 'export const DIGITS = /^[01]+$/\n'
      project.write('src/lib/toopo/string/pad/digits.ts', mine)

      const update = await updating(project, lockfile)
      const digits = update.lockfile.features
        .find((feature) => feature.contract.name === 'string/pad')
        ?.files.find((file) => file.path === 'string/pad/digits.ts')
      const before = lockfile.features
        .find((feature) => feature.contract.name === 'string/pad')
        ?.files.find((file) => file.path === 'string/pad/digits.ts')

      expect(digits?.sha256).toBe(before?.sha256)
      expect(digits?.sha256).not.toBe(digestOfBytes(servedBytes(Buffer.from(mine, 'utf8'))))
      expect(
        update.lockfile.features.find((feature) => feature.contract.name === 'string/pad')
          ?.locallyModified,
      ).toBe(true)
    })
  })

  /**
   * The window `write.ts` leaves open, closed without a journal. A run killed between two renames
   * leaves files carrying the new bytes under a lockfile that still describes the old install, and the
   * next run has to read those as its own work rather than as somebody's edit.
   */
  it('a-file-already-equal-to-what-we-would-write-is-not-a-conflict', async () => {
    await inProject(async (project, lockfile) => {
      const first = await updating(project, lockfile)
      const bytes = first.writes.find((write) => write.path === 'number/round/round.ts')?.bytes

      writeFileSync(
        join(project.root, project.configuration.directory, 'number/round/round.ts'),
        bytes as Buffer,
      )

      const again = await updating(project, lockfile)

      expect(verdicts(again)['number/round/round.ts']).toBe('already-written')
      expect(heldBack(again)).toEqual([])
    })
  })

  it('a-file-that-was-deleted-is-put-back', async () => {
    await inProject(async (project, lockfile) => {
      rmSync(join(project.root, project.configuration.directory, 'number/clamp/clamp.ts'))

      const update = await updating(project, lockfile)

      expect(verdicts(update)['number/clamp/clamp.ts']).toBe('restored')
      expect(update.writes.map((write) => write.path)).toContain('number/clamp/clamp.ts')
    })
  })

  /**
   * An update follows the implementation the lockfile names and never the registry's current default.
   * Switching somebody from the implementation they chose is a larger change than a version bump, and
   * permanent rule 4 is about making neither of them quietly.
   *
   * Measured by making the default an implementation this source cannot serve: an update that followed
   * it would ask for a snapshot that is not there.
   */
  it('an-update-keeps-the-implementation-the-lockfile-names', async () => {
    await inProject(async (project, lockfile) => {
      const honest = updatedImaginedSource()
      const withANewDefault: RegistrySource = {
        ...honest,
        implementationBindings: async (address) => {
          const bindings = await honest.implementationBindings(address)
          const first = bindings[0]
          if (first === undefined) return bindings

          return [
            ...bindings.map((binding) => ({ ...binding, status: 'listed' as const })),
            {
              ...first,
              address: { contract: address, id: 'faster', version: '2.0.0' },
              digest: 'f'.repeat(64),
              status: 'default' as const,
            },
          ]
        },
      }

      const update = await updating(project, lockfile, withANewDefault)

      expect(
        update.features.every((feature) => feature.now === null || feature.now.id === 'reference'),
      ).toBe(true)
    })
  })

  it('a-lockfile-with-no-root-has-nowhere-to-start', async () => {
    await inProject(async (project, lockfile) => {
      const rootless: Lockfile = {
        version: LOCKFILE_VERSION,
        features: lockfile.features.map((feature) => ({ ...feature, askedFor: false })),
      }

      const { answer: outcome } = await deciding(updatedImaginedSource(), (held) =>
        prepareUpdate(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile: rootless,
          at: AT,
        }),
      )

      expect('faults' in outcome && outcome.faults[0]).toContain('nothing in it is a root')
    })
  })

  /**
   * A registry that has not moved changes nothing - and says what it found while saying so.
   *
   * The screen used to be three sentences and no name: *every feature is at the version the registry
   * serves*, with the features left to the reader's memory. That is an answer nobody can check, from
   * the one command that knows what the project holds, and R-14 is the mutant that empties it: the
   * value assertions above pass on a screen that names nothing at all.
   */
  it('a-registry-that-has-not-moved-changes-nothing', async () => {
    await inProject(async (project, lockfile) => {
      const update = await updating(project, lockfile, imaginedSource())

      expect(update.writes).toEqual([])
      expect(update.removals).toEqual([])
      expect(update.lockfile).toEqual(lockfile)

      const screen = renderUpToDate(update)
      expect(screen).toContain('Nothing to do.')
      expect(
        update.features.filter(
          (feature) => !screen.includes(renderContract(feature.contract)),
        ),
      ).toEqual([])
      expect(screen).toContain('reference@1.0.0')
    })
  })

  /**
   * Applied twice, the second run has nothing to do and leaves the lockfile it found - the instant
   * included, which is what stops a no-op run from rewriting a committed file.
   *
   * The second run is at a *different* instant, and that is the whole guard: measured by U-23, which
   * stamps every feature with the run's own instant. With both runs pinned to one moment the defect is
   * invisible, and a guard that cannot see it is a guard that would let every project acquire a diff
   * nobody made.
   */
  it('applying-an-update-twice-changes-nothing-the-second-time', async () => {
    await inProject(async (project, lockfile) => {
      const first = await updating(project, lockfile)
      const written = commit(project.root, project.configuration.directory, {
        writes: first.writes,
        removals: first.removals,
        leaving: null,
        lockfile: first.lockfile,
        configuration: null,
      })
      expect('written' in written).toBe(true)

      const { answer: later } = await deciding(updatedImaginedSource(), (held) =>
        prepareUpdate(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile: first.lockfile,
          at: '2027-01-01T00:00:00.000Z',
        }),
      )
      if (!('reconciliation' in later)) throw new Error(later.faults.join('\n'))
      const again = later.reconciliation

      expect(again.writes).toEqual([])
      expect(again.removals).toEqual([])
      expect(again.lockfile).toEqual(first.lockfile)
      expect(existsSync(join(project.root, project.configuration.directory, 'number/sign'))).toBe(false)
    })
  })

  /**
   * The two ways out are offered under a feature the reader can do something about, and under no other.
   *
   * A feature held back because something else is has nothing for them to resolve, and the advice that
   * fits a conflict - delete the file and run this again - is exactly wrong there: they never touched
   * it. Found by reading the report rather than the code, on the run where `number/sign@1` leaves the
   * project and is held back by somebody else's conflict.
   */
  it('the-ways-out-are-offered-only-where-the-reader-put-something', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const rendered = renderUpdate(await updating(project, lockfile), lockfile, project.configuration, false, GIT_WAS_NOT_ASKED)
      const blocks = rendered.split(/\n(?=  \S)/)
      const blockOf = (contract: string): string =>
        blocks.find((block) => block.startsWith(`  ${contract} `)) ?? ''

      // Both held back, and only the one the reader put something into is offered a way out.
      expect(blockOf('typescript/number/round@1')).toContain('held back')
      expect(blockOf('typescript/number/sign@1')).toContain('held back')
      expect(blockOf('typescript/number/round@1')).toContain('Two ways out')
      expect(blockOf('typescript/number/sign@1')).not.toContain('Two ways out')
    })
  })

  /**
   * A held-back feature says what happened to it before it says anything else.
   *
   * The header read `number/sign@1 · leaves the project · nothing imports it any more · held back` -
   * four segments of equal weight where the fourth reverses the second. What the reader acts on is
   * that nothing happened, and it cannot be the last thing on a line they are scanning: they build an
   * expectation from *leaves the project* and have it overturned at the end, if they reach the end.
   */
  it('a-held-back-feature-says-so-before-it-says-anything-else', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      // A feature's header and not the tally, which also sits at this indent and also carries
      // `held back` - the count of them.
      const headers = renderUpdate(await updating(project, lockfile), lockfile, project.configuration, false, GIT_WAS_NOT_ASKED)
        .split('\n')
        .filter((line) => /^ {2}\S+@\d+ · /.test(line))

      const held = headers.filter((line) => line.includes('held back'))
      expect(held.length).toBeGreaterThan(0)
      expect(held.every((line) => line.endsWith(' · held back, nothing changed'))).toBe(true)
      expect(held.some((line) => line.includes('leaves the project') || line.includes(' -> '))).toBe(
        false,
      )
    })
  })

  /** A held-back feature's entry is the one that was there, byte for byte. */
  it('a-held-back-feature-keeps-its-lockfile-entry-exactly', async () => {
    await inProject(async (project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = await updating(project, lockfile)

      expect(update.lockfile.features.find((feature) => feature.contract.name === 'number/round')).toEqual(
        lockfile.features.find((feature) => feature.contract.name === 'number/round'),
      )
    })
  })

  /** The two digests, on the other side of the round trip they were invented for. */
  it('the-updated-lockfile-holds-what-was-served-and-what-was-written', async () => {
    await inProject(async (project, lockfile) => {
      const update = await updating(project, lockfile)
      const round = update.lockfile.features
        .find((feature) => feature.contract.name === 'number/round')
        ?.files.find((file) => file.path === 'number/round/round.ts')
      const bytes = update.writes.find((write) => write.path === 'number/round/round.ts')?.bytes

      expect(round?.sha256).toBe(digestOfBytes(bytes as Buffer))
      expect(round?.sha256).not.toBe(round?.served.sha256)
      expect(round?.served.path).toBe('reference.ts')
    })
  })

  /** The refusal `add` already makes, made again by the command that writes far more files. */
  it('a-file-toopo-did-not-write-is-never-overwritten-by-an-update', async () => {
    await inProject(async (project, lockfile) => {
      const disowned: Lockfile = {
        version: LOCKFILE_VERSION,
        features: lockfile.features.filter((feature) => feature.contract.name !== 'string/pad'),
      }

      const { answer: outcome } = await deciding(updatedImaginedSource(), (held) =>
        prepareUpdate(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile: disowned,
          at: AT,
        }),
      )

      expect('faults' in outcome && outcome.faults).toContain(
        'src/lib/toopo/string/pad/pad.ts is already there and toopo.lock does not claim it, so it ' +
          'is not ours to overwrite',
      )
    })
  })

  /**
   * A copy deduplicated away is taken with the entry that stops claiming it.
   *
   * **Measured rather than reasoned, and it was a hole.** `add` plans one root at a time, so two
   * features that carry the same file are written twice, each claimed by its own entry; the first
   * update afterwards is the first plan that sees both, and it repoints one at the other and drops the
   * file from that entry. It used to leave the copy on disk claimed by nothing - which is the state the
   * next command refuses to write into, with a sentence about a file this tool had written itself.
   *
   * The bytes are not at risk: deduplication is by digest, so what goes is a copy of what the carrier
   * holds and the import has already been repointed. An edited copy is a different matter and stays,
   * which is the same answer a leaving feature's edited file gets.
   */
  it('a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it', async () => {
    const source = sourceWithIndependentCarriers()
    const project = aProject()

    try {
      let lockfile = EMPTY_LOCKFILE
      for (const contract of ['text/left', 'text/right']) {
        const { answer: outcome } = await deciding(source, (held) =>
          prepareInstallation(held, {
            root: project.root,
            configuration: project.configuration,
            lockfile,
            contract,
            implementation: null,
            at: A_PINNED_INSTANT,
          }),
        )
        if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))
        lockfile = committing(project, outcome.installation, lockfile)
      }

      expect(existsSync(join(project.root, 'src/lib/toopo/text/right/trim.ts'))).toBe(true)

      const update = await updating(project, lockfile, source)

      expect(update.removals).toEqual(['text/right/trim.ts'])
      expect(
        update.features
          .find((feature) => feature.contract.name === 'text/right')
          ?.files.map((file) => [file.path, file.verdict]),
      ).toEqual([
        ['text/right/right.ts', 'updated'],
        ['text/right/trim.ts', 'removed'],
      ])

      const written = commit(project.root, project.configuration.directory, {
        writes: update.writes,
        removals: update.removals,
        leaving: null,
        lockfile: update.lockfile,
        configuration: null,
      })
      expect('written' in written).toBe(true)

      expect(existsSync(join(project.root, 'src/lib/toopo/text/right/trim.ts'))).toBe(false)
      expect(project.installed('text/right/right.ts')).toContain("from '../left/trim.js'")
    } finally {
      project.remove()
    }
  })

  /**
   * The other half, and R-07 is why it is written: a copy the user edited is never taken.
   *
   * The half above deletes a file because another folder holds the same bytes - which is safe exactly
   * while the bytes are the same. Edit the copy and it is somebody's work sitting under a path this
   * command had decided was redundant, and deleting it would be the one thing permanent rule 4 forbids,
   * arriving through the one door that does not look like an overwrite.
   */
  it('a-deduplicated-copy-the-user-edited-is-kept-rather-than-taken', async () => {
    const source = sourceWithIndependentCarriers()
    const project = aProject()

    try {
      let lockfile = EMPTY_LOCKFILE
      for (const contract of ['text/left', 'text/right']) {
        const { answer: outcome } = await deciding(source, (held) =>
          prepareInstallation(held, {
            root: project.root,
            configuration: project.configuration,
            lockfile,
            contract,
            implementation: null,
            at: A_PINNED_INSTANT,
          }),
        )
        if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))
        lockfile = committing(project, outcome.installation, lockfile)
      }

      project.write('src/lib/toopo/text/right/trim.ts', 'export const TRIM = /mine/\n')

      const update = await updating(project, lockfile, source)

      expect(update.removals).toEqual([])
      expect(
        update.features
          .find((feature) => feature.contract.name === 'text/right')
          ?.files.find((file) => file.path === 'text/right/trim.ts')?.verdict,
      ).toBe('kept-orphan')

      const written = commit(project.root, project.configuration.directory, {
        writes: update.writes,
        removals: update.removals,
        leaving: null,
        lockfile: update.lockfile,
        configuration: null,
      })
      expect('written' in written).toBe(true)
      expect(project.installed('text/right/trim.ts')).toBe('export const TRIM = /mine/\n')
    } finally {
      project.remove()
    }
  })

  /**
   * Every file gone at once is a checkout that never received the folder, and it is said rather than
   * silently repaired.
   *
   * The repair is right - the files come back - and it is exactly what hides the cause: the build goes
   * green, nobody learns that the installed folder is not committed, and the next person to clone meets
   * the same thing. One file missing is somebody deleting a file, so the sentence is asked of *all* of
   * them, which is the only shape a fresh checkout produces.
   */
  it('every-file-missing-at-once-says-the-folder-is-not-committed', async () => {
    await inProject(async (project, lockfile) => {
      rmSync(join(project.root, project.configuration.directory), { recursive: true, force: true })

      const update = await updating(project, lockfile)

      expect(update.everyClaimedFileIsMissing).toBe(true)
      expect(renderUpdate(update, lockfile, project.configuration, true, GIT_WAS_NOT_ASKED)).toContain(
        'installed folder is not committed',
      )
    })
  })

  /**
   * `Nothing to do.` is said only when the lockfile does not move either.
   *
   * **Found by re-reading every conditional sentence the renderer prints and asking what makes it
   * true.** The command decided it had nothing to do from two of the three things a run changes - no
   * byte written, nothing held back - and the third is the lockfile. A project claiming a feature no
   * root reaches, whose files are already gone, writes nothing, holds nothing back, and drops the
   * entry: the screen said *every file is as it was written*, listed the feature as leaving, and
   * closed with *Nothing to do.*
   *
   * The state is what a hand-edited lockfile leaves, and it is not exotic enough to be left printing
   * a contradiction about somebody's project on three consecutive lines.
   */
  it('nothing-to-do-is-said-only-when-the-lockfile-does-not-move', async () => {
    const project = aProject()
    try {
      const { answer: outcome } = await deciding(imaginedSource(), (held) =>
        prepareInstallation(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile: EMPTY_LOCKFILE,
          contract: 'string/pad',
          implementation: null,
          at: A_PINNED_INSTANT,
        }),
      )
      if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))
      const lockfile = committing(project, outcome.installation)

      expect(nothingMoved(lockfile, await updating(project, lockfile, imaginedSource()))).toBe(true)

      // A feature no root reaches, whose files are already gone. `string/pad` depends on nothing, so
      // this entry is outside the closure and the plan simply stops holding it.
      const orphaned: Lockfile = {
        version: LOCKFILE_VERSION,
        features: [
          ...lockfile.features,
          {
            contract: { language: 'typescript', name: 'number/sign', major: 1 },
            implementation: { id: 'reference', version: '1.0.0' },
            files: [],
            installedAt: A_PINNED_INSTANT,
            locallyModified: false,
            askedFor: false,
            servedFrom: THE_UNPUBLISHED_REVISION,
          },
        ],
      }

      const update = await updating(project, orphaned, imaginedSource())

      expect(update.writes).toEqual([])
      expect(update.removals).toEqual([])
      expect(update.features.every((feature) => feature.heldBack === null)).toBe(true)
      expect(update.lockfile.features).toHaveLength(1)
      expect(nothingMoved(orphaned, update)).toBe(false)
    } finally {
      project.remove()
    }
  })

  /** One file gone is somebody deleting a file, and it is put back without a word about git. */
  it('one-file-missing-is-not-a-folder-nobody-committed', async () => {
    await inProject(async (project, lockfile) => {
      rmSync(join(project.root, 'src/lib/toopo/string/pad/digits.ts'))

      const update = await updating(project, lockfile)

      expect(update.features.flatMap((feature) => feature.files).map((file) => file.verdict)).toContain(
        'restored',
      )
      expect(update.everyClaimedFileIsMissing).toBe(false)
      expect(renderUpdate(update, lockfile, project.configuration, true, GIT_WAS_NOT_ASKED)).not.toContain(
        'installed folder is not committed',
      )
    })
  })
})
