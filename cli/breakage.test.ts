import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { WHAT_BREAKS } from './breakage.js'
import { CONFIGURATION_FILE } from './configuration.js'
import { UnusableLockfile, lockfileFaults, readLockfile } from './lockfile.js'
import { imaginedSource } from './imagined-source.js'
import { filesToWrite, prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import { EMPTY_LOCKFILE, A_PINNED_INSTANT, aProject, committing } from './temporary-project.js'
import type { Installation, InstallOutcome } from './install.js'
import type { Lockfile } from '../registry/implementation-record.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'

/**
 * What happens to a real project, rather than what happens in a fixture.
 *
 * Every situation `breakage.ts` classifies as a clean refusal is here, under the identifier that entry
 * names. The ones classified as breaking badly are not: they are declared, deliberately, with the
 * reason each was left open - and the one guard over the list is that nothing sits in between.
 */

const HERE = import.meta.dirname
const ENTRY = join(HERE, 'toopo.ts')

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

/**
 * **The two refusals below assert the refusal and nothing after it, and that is a repair.**
 *
 * Each used to end with `expect(project.installed(...))` naming the bytes the user had put there -
 * which reads as "and their file survived" and is structurally incapable of failing: everything
 * `prepareInstallation` does is arithmetic over values and reads of the disk, so a run that answered
 * faults could not have written anything to survive. Seeing `an-edited-file-is-never-replaced` red on
 * its real condition is what exposed it: the refusal is what fails, and the line under it never got
 * the chance. A guard that cannot fail is recorded as inapplicable rather than left green.
 */
const mustInstall = (outcome: InstallOutcome): Installation => {
  if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))
  if ('unchanged' in outcome) throw new Error('nothing was installed')

  return outcome.installation
}

/** One install, committed, with its lockfile - the state every guard below starts from. */
const alreadyInstalled = (
  project: TemporaryProject,
  contract = 'string/slugify',
): Lockfile => committing(project, mustInstall(installing(localSource(), project, contract)))

describe('what breaks for somebody', () => {
  it('every-breakage-is-classified :: a clean refusal names its guard and a bad break says why', () => {
    expect(
      WHAT_BREAKS.filter(
        (entry) =>
          (entry.verdict === 'refused-cleanly') !== (entry.guard !== undefined) ||
          entry.detail.trim() === '',
      ).map((entry) => entry.situation),
    ).toEqual([])
  })

  it('a-file-we-did-not-write-is-never-overwritten', () => {
    const project = aProject()
    try {
      project.write('src/lib/toopo/string/slugify/slugify.ts', 'export const slugify = "mine"\n')

      const outcome = installing(localSource(), project, 'string/slugify')

      expect('faults' in outcome && outcome.faults).toEqual([
        'src/lib/toopo/string/slugify/slugify.ts is already there, toopo.lock does not claim it, ' +
          'and its bytes are not the ones toopo would write - so it is not ours to overwrite',
      ])
    } finally {
      project.remove()
    }
  })

  /** Permanent rule 4, decided on the user's own machine from what it already holds. */
  it('an-edited-file-is-never-replaced', () => {
    const project = aProject()
    try {
      const lockfile = alreadyInstalled(project)
      project.write('src/lib/toopo/string/slugify/slugify.ts', 'export const slugify = "edited"\n')

      const outcome = installing(localSource(), project, 'string/slugify', lockfile)

      expect('faults' in outcome && outcome.faults).toEqual([
        'src/lib/toopo/string/slugify/slugify.ts was edited after it was installed. Toopo never ' +
          'replaces your changes: move them aside, or keep them and skip this install.',
      ])
    } finally {
      project.remove()
    }
  })

  /**
   * The other side of the guard above, and the pair is the whole rule: what decides whether a file
   * nothing claims may be written is its *bytes*, and never the absence of a claim.
   *
   * The state is reached by installing, committing, and then deleting only the lockfile - which is
   * what a version-1 lockfile leaves behind, and equally what a project that gitignores `toopo.lock`
   * hands to the next person who checks it out.
   */
  it('a-file-already-holding-our-bytes-is-claimed-and-not-rewritten', () => {
    const project = aProject()
    try {
      alreadyInstalled(project)
      const before = project.installed('string/slugify/slugify.ts')

      const installation = mustInstall(installing(localSource(), project, 'string/slugify'))

      expect(installation.writes.map((write) => [write.path, write.alreadyOnDisk])).toEqual(
        installation.writes.map((write) => [write.path, true]),
      )
      expect(filesToWrite(installation)).toEqual([])
      expect(project.installed('string/slugify/slugify.ts')).toBe(before)
    } finally {
      project.remove()
    }
  })

  /**
   * A lockfile written before `askedFor` existed, refused rather than migrated, with the remedy the
   * guard above is what makes true.
   *
   * Both shapes went out carrying `"version": 1`, so the number discriminated nothing on the one file
   * this tool writes into somebody else's project. What is asserted here is the pair a reader needs:
   * that it is refused, and that the refusal names the feature to type back.
   */
  it('a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run', () => {
    const project = aProject()
    try {
      const lockfile = alreadyInstalled(project)
      const asVersionOne = {
        version: 1,
        features: lockfile.features.map(({ askedFor: _askedFor, ...rest }) => rest),
      }

      project.write('toopo.lock', JSON.stringify(asVersionOne))
      expect(() => readLockfile(project.root)).toThrow(UnusableLockfile)

      const faults = lockfileFaults(asVersionOne).join('\n')
      expect(faults).toContain('Version 1 did not record which features you asked for')
      expect(faults).toContain('toopo add string/slugify')
    } finally {
      project.remove()
    }
  })

  it('an-unreadable-lockfile-stops-the-install', () => {
    const project = aProject()
    try {
      project.write('toopo.lock', '{ "version": 1, "features": [ { "contract": {} } ] }')

      expect(() => readLockfile(project.root)).toThrow(UnusableLockfile)

      project.write('toopo.lock', 'not json at all')

      expect(() => readLockfile(project.root)).toThrow(UnusableLockfile)
    } finally {
      project.remove()
    }
  })

  /**
   * A project is a folder with a `toopo.json` in it. Nothing an install does needs a package manager to
   * have been used, and a monorepo package, a Deno project or a plain folder is a project like any
   * other.
   */
  it('a-project-with-no-package-json-installs-normally', () => {
    const project = aProject()
    try {
      committing(project, mustInstall(installing(localSource(), project, 'string/slugify')))

      expect(existsSync(join(project.root, 'package.json'))).toBe(false)
      expect(readdirSync(join(project.root, 'src/lib/toopo/string/slugify'))).toEqual(['slugify.ts'])
    } finally {
      project.remove()
    }
  })

  /** No shell ever sees a path, which is what makes this uninteresting - and worth proving once. */
  it('a-path-with-a-space-installs-normally', () => {
    const project = aProject('src/my code/toopo')
    try {
      committing(project, mustInstall(installing(imaginedSource(), project, 'number/round')))

      expect(project.installed('number/clamp/clamp.ts')).toContain(
        `from '../../string/pad/pad.js'`,
      )
    } finally {
      project.remove()
    }
  })

  /**
   * The user's own configuration is not read, so it cannot be wrong. Measured by putting a
   * `tsconfig.json` in the project that would refuse everything, and installing anyway.
   */
  it('the-users-tsconfig-is-never-read', () => {
    const project = aProject()
    try {
      project.write('tsconfig.json', '{ "this": is not even json }')

      const installation = mustInstall(installing(imaginedSource(), project, 'number/round'))
      committing(project, installation)

      expect(installation.writes).toHaveLength(5)
    } finally {
      project.remove()
    }
  })

  /**
   * The one guard that runs the command as a person runs it, because everything above tests a function
   * and a person types a line. It is also the only place the text a user reads is checked at all.
   */
  it('add-before-init-says-what-to-run', () => {
    const project = aProject()
    try {
      const refusal = execFileSync(process.execPath, [ENTRY, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
      })

      expect(refusal).toContain('Refused, and nothing was written.')
      expect(refusal).toContain(`this folder has no ${CONFIGURATION_FILE}`)
      expect(refusal).toContain('Run `toopo init` first')
      expect(readdirSync(project.root)).toEqual([])
    } catch (error) {
      // `toopo` exits non-zero on a refusal, which `execFileSync` throws for.
      const thrown = error as { readonly stdout?: string }
      expect(thrown.stdout ?? '').toContain(`this folder has no ${CONFIGURATION_FILE}`)
      expect(readdirSync(project.root)).toEqual([])
    } finally {
      project.remove()
    }
  })
})
