import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'
import { imaginedSource, updatedImaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import { renderUpdate } from './report.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'
import type { FileOutcome, Update } from './update.js'
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
const installed = (): { readonly project: TemporaryProject; readonly lockfile: Lockfile } => {
  const project = aProject()
  const outcome = prepareInstallation(imaginedSource(), {
    root: project.root,
    configuration: project.configuration,
    lockfile: EMPTY_LOCKFILE,
    contract: 'number/round',
    implementation: null,
    at: A_PINNED_INSTANT,
  })

  if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))

  return { project, lockfile: committing(project, outcome.installation) }
}

const updating = (
  project: TemporaryProject,
  lockfile: Lockfile,
  source: RegistrySource = updatedImaginedSource(),
): Update => {
  const outcome = prepareUpdate(source, {
    root: project.root,
    configuration: project.configuration,
    lockfile,
    at: AT,
  })

  if (!('update' in outcome)) throw new Error(outcome.faults.join('\n'))

  return outcome.update
}

const inProject = <T>(
  use: (project: TemporaryProject, lockfile: Lockfile) => T,
): T => {
  const { project, lockfile } = installed()
  try {
    return use(project, lockfile)
  } finally {
    project.remove()
  }
}

/** Every file the update has an opinion about, as `path -> verdict`. */
const verdicts = (update: Update): Readonly<Record<string, string>> =>
  Object.fromEntries(
    update.features.flatMap((feature) =>
      feature.files
        .filter((file: FileOutcome) => file.verdict !== 'unchanged')
        .map((file) => [file.path, file.verdict]),
    ),
  )

const heldBack = (update: Update): readonly string[] =>
  update.features
    .filter((feature) => feature.heldBack !== null)
    .map((feature) => renderContract(feature.contract))

describe('comparing a project with what the registry serves now', () => {
  /** The whole shape of a nominal update, in one assertion. */
  it('an-update-writes-the-bytes-the-registry-now-serves', () => {
    inProject((project, lockfile) => {
      const update = updating(project, lockfile)

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
  it('a-version-that-moved-with-no-byte-changing-is-recorded-anyway', () => {
    inProject((project, lockfile) => {
      const update = updating(project, lockfile)
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
    })
  })

  /**
   * A dependency the new graph no longer reaches goes, and its lockfile entry goes with it. Left
   * behind it would be a folder the lockfile claims and nothing imports, which is the accumulation
   * that makes a tool stop being trusted.
   */
  it('a-dependency-that-left-the-closure-is-removed', () => {
    inProject((project, lockfile) => {
      const update = updating(project, lockfile)

      expect(update.removals).toEqual(['number/sign/sign.ts'])
      expect(update.lockfile.features.map((feature) => feature.contract.name)).toEqual([
        'number/clamp',
        'number/round',
        'string/pad',
      ])
    })
  })

  /** Both sides moved, which is the only case where refusing to overwrite means anything. */
  it('a-file-changed-on-both-sides-is-a-conflict', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = updating(project, lockfile)

      expect(verdicts(update)['number/round/round.ts']).toBe('conflict')
      expect(update.writes.map((write) => write.path)).toEqual(['string/pad/pad.ts'])
    })
  })

  /**
   * And the whole feature is held back, not the file. A feature half at one version and half at
   * another is a combination nobody published, and worse than not updating at all.
   */
  it('a-conflicted-feature-is-held-back-whole', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = updating(project, lockfile)
      const round = update.features.find((feature) => feature.contract.name === 'number/round')

      expect(round?.heldBack).toBe('you edited a file the registry changed too')
      expect(update.writes.some((write) => write.path.startsWith('number/round/'))).toBe(false)
    })
  })

  /**
   * The propagation, measured on the feature everything imports. Editing `string/pad`'s own file holds
   * `string/pad`, and `number/clamp` imports it, and `number/round` imports that.
   */
  it('a-feature-that-imports-a-held-back-one-is-held-back-too', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/string/pad/pad.ts', 'export const pad = "mine"\n')

      const update = updating(project, lockfile)

      expect([...heldBack(update)].sort()).toEqual([
        'number/clamp@1',
        'number/round@1',
        'number/sign@1',
        'string/pad@1',
      ])
      expect(
        update.features.find((feature) => feature.contract.name === 'number/round')?.heldBack,
      ).toBe('it imports number/clamp@1, which is held back')
      expect(update.writes).toEqual([])
    })
  })

  /**
   * The rule found by reading the report rather than the code. `number/sign` leaves because the *new*
   * `number/round` stopped importing it - and a held-back `number/round` is running the *old* code,
   * which imports it still. Removing it would break a build in order to tidy a folder.
   */
  it('nothing-is-removed-while-a-feature-is-held-back', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = updating(project, lockfile)
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
  it('a-file-the-registry-did-not-change-keeps-your-version', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/string/pad/digits.ts', 'export const DIGITS = /^[01]+$/\n')

      const update = updating(project, lockfile)

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
  it('a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk', () => {
    inProject((project, lockfile) => {
      const mine = 'export const DIGITS = /^[01]+$/\n'
      project.write('src/lib/toopo/string/pad/digits.ts', mine)

      const update = updating(project, lockfile)
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
  it('a-file-already-equal-to-what-we-would-write-is-not-a-conflict', () => {
    inProject((project, lockfile) => {
      const first = updating(project, lockfile)
      const bytes = first.writes.find((write) => write.path === 'number/round/round.ts')?.bytes

      writeFileSync(
        join(project.root, project.configuration.directory, 'number/round/round.ts'),
        bytes as Buffer,
      )

      const again = updating(project, lockfile)

      expect(verdicts(again)['number/round/round.ts']).toBe('already-written')
      expect(heldBack(again)).toEqual([])
    })
  })

  it('a-file-that-was-deleted-is-put-back', () => {
    inProject((project, lockfile) => {
      rmSync(join(project.root, project.configuration.directory, 'number/clamp/clamp.ts'))

      const update = updating(project, lockfile)

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
  it('an-update-keeps-the-implementation-the-lockfile-names', () => {
    inProject((project, lockfile) => {
      const honest = updatedImaginedSource()
      const withANewDefault: RegistrySource = {
        ...honest,
        implementationBindings: (address) => [
          ...honest.implementationBindings(address).map((binding) => ({
            ...binding,
            status: 'listed' as const,
          })),
          {
            ...(honest.implementationBindings(address)[0] as ReturnType<
              RegistrySource['implementationBindings']
            >[number]),
            address: { contract: address, id: 'faster', version: '2.0.0' },
            digest: 'f'.repeat(64),
            status: 'default' as const,
          },
        ],
      }

      const update = updating(project, lockfile, withANewDefault)

      expect(
        update.features.every((feature) => feature.now === null || feature.now.id === 'reference'),
      ).toBe(true)
    })
  })

  it('a-lockfile-with-no-root-has-nowhere-to-start', () => {
    inProject((project, lockfile) => {
      const rootless: Lockfile = {
        version: LOCKFILE_VERSION,
        features: lockfile.features.map((feature) => ({ ...feature, askedFor: false })),
      }

      const outcome = prepareUpdate(updatedImaginedSource(), {
        root: project.root,
        configuration: project.configuration,
        lockfile: rootless,
        at: AT,
      })

      expect('faults' in outcome && outcome.faults[0]).toContain('nothing in it is a root')
    })
  })

  it('a-registry-that-has-not-moved-changes-nothing', () => {
    inProject((project, lockfile) => {
      const update = updating(project, lockfile, imaginedSource())

      expect(update.writes).toEqual([])
      expect(update.removals).toEqual([])
      expect(update.lockfile).toEqual(lockfile)
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
  it('applying-an-update-twice-changes-nothing-the-second-time', () => {
    inProject((project, lockfile) => {
      const first = updating(project, lockfile)
      const written = commit(project.root, project.configuration.directory, {
        writes: first.writes,
        removals: first.removals,
        lockfile: first.lockfile,
      })
      expect('written' in written).toBe(true)

      const later = prepareUpdate(updatedImaginedSource(), {
        root: project.root,
        configuration: project.configuration,
        lockfile: first.lockfile,
        at: '2027-01-01T00:00:00.000Z',
      })
      if (!('update' in later)) throw new Error(later.faults.join('\n'))
      const again = later.update

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
  it('the-ways-out-are-offered-only-where-the-reader-put-something', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const rendered = renderUpdate(updating(project, lockfile), project.configuration, false)
      const blocks = rendered.split(/\n(?=  \S)/)
      const blockOf = (contract: string): string =>
        blocks.find((block) => block.startsWith(`  ${contract} `)) ?? ''

      // Both held back, and only the one the reader put something into is offered a way out.
      expect(blockOf('number/round@1')).toContain('held back')
      expect(blockOf('number/sign@1')).toContain('held back')
      expect(blockOf('number/round@1')).toContain('Two ways out')
      expect(blockOf('number/sign@1')).not.toContain('Two ways out')
    })
  })

  /** A held-back feature's entry is the one that was there, byte for byte. */
  it('a-held-back-feature-keeps-its-lockfile-entry-exactly', () => {
    inProject((project, lockfile) => {
      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')

      const update = updating(project, lockfile)

      expect(update.lockfile.features.find((feature) => feature.contract.name === 'number/round')).toEqual(
        lockfile.features.find((feature) => feature.contract.name === 'number/round'),
      )
    })
  })

  /** The two digests, on the other side of the round trip they were invented for. */
  it('the-updated-lockfile-holds-what-was-served-and-what-was-written', () => {
    inProject((project, lockfile) => {
      const update = updating(project, lockfile)
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
  it('a-file-toopo-did-not-write-is-never-overwritten-by-an-update', () => {
    inProject((project, lockfile) => {
      const disowned: Lockfile = {
        version: LOCKFILE_VERSION,
        features: lockfile.features.filter((feature) => feature.contract.name !== 'string/pad'),
      }

      const outcome = prepareUpdate(updatedImaginedSource(), {
        root: project.root,
        configuration: project.configuration,
        lockfile: disowned,
        at: AT,
      })

      expect('faults' in outcome && outcome.faults).toContain(
        'src/lib/toopo/string/pad/pad.ts is already there and toopo.lock does not claim it, so it ' +
          'is not ours to overwrite',
      )
    })
  })
})
