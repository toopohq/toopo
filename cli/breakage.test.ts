import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { guardIdOf } from '../catalogue/identifier.js'
import { WHAT_BREAKS } from './breakage.js'
import { CONFIGURATION_FILE, readConfiguration } from './configuration.js'
import { UnusableLockfile, lockfileFaults, readLockfile } from './lockfile.js'
import { imaginedSource } from './imagined-source.js'
import { filesToWrite, prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import {
  EMPTY_LOCKFILE,
  A_PINNED_INSTANT,
  THE_ENTRY_POINT,
  aProject,
  committing,
} from './temporary-project.js'
import type { Installation, InstallOutcome } from './install.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'

/**
 * What happens to a real project, rather than what happens in a fixture.
 *
 * Every situation `breakage.ts` classifies as a clean refusal is guarded under the identifier that
 * entry names - and *where* each of those guards lives is published by
 * `every-clean-refusal-resolves-to-the-guard-it-names` rather than claimed here. A sentence saying
 * they are all in this file and a guard saying where each one is are two statements of one fact, and
 * it is always the sentence that ends up lying: this header carried that sentence, and eleven of the
 * twenty were somewhere else by the time anybody looked.
 *
 * The ones classified as breaking badly are not guarded: they are declared, deliberately, with the
 * reason each was left open - and the one guard over the list is that nothing sits in between.
 */

const HERE = import.meta.dirname

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

/**
 * Every guard this folder's suite carries, as its address against the file - or files - that hold it.
 *
 * A title is read the way `catalogue/identifier.ts` says one is read - the identifier, then the
 * separator, then the sentence - rather than by a rule restated here. Measured over this folder: every
 * guard title is a plain string literal, no `it.each` and no template, so what the source says and
 * what vitest collects are the same list of names.
 *
 * **Every file an address occurs in, joined, rather than one of them.** Written first as a plain
 * record it kept whichever file sorted last, so an identifier carried by two files read exactly like
 * one carried by the file that happened to win - measured by planting a second copy of
 * `a-directory-where-a-file-goes-is-refused-by-name` in `list.test.ts`, where `write.test.ts` sorted
 * after it and the guard stayed green. A resolution that silently picks one of two answers is the
 * failure this whole guard exists to refuse, arriving inside the guard itself.
 */
const guardsOfThisFolder = (): Readonly<Record<string, string>> => {
  const carried = new Map<string, string[]>()

  for (const name of readdirSync(HERE).filter((entry) => entry.endsWith('.test.ts'))) {
    for (const title of readFileSync(join(HERE, name), 'utf8').matchAll(/\bit\(\s*'([^']+)'/g)) {
      const id = guardIdOf(title[1] as string)
      carried.set(id, [...(carried.get(id) ?? []), name])
    }
  }

  return Object.fromEntries([...carried].map(([id, files]) => [id, files.join(', ')]))
}

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

  /**
   * Every guard a clean refusal names is a guard this folder carries, and the map says which file.
   *
   * **The address was declared and nothing resolved it**, which is the class `CLAUDE.md` carries
   * against five kinds of address and had closed for four. A guard identifier is frozen with its
   * major, so a rename is a decision; what this refuses is the rename nobody noticed, which leaves
   * `breakage.ts` pointing at a guard that no longer exists and reads exactly like one that does.
   *
   * **It lives here rather than in the instrument's pre-flight, and the line between the two is the
   * rule.** The pre-flight resolves what a *battery* names, against the guards a run really collected.
   * `WHAT_BREAKS` is named by no battery, and making one name it - arbitrarily one of the four that
   * collect this suite, or all four - would have a battery declare something it does not declare, to
   * fit a mechanism. So: **the pre-flight resolves what a battery names, a suite guard resolves what a
   * module declares.** Two universes, two mechanisms, each beside the declaration it keeps.
   *
   * What this reads is the source rather than what vitest collected, so a guard inside a skipped block
   * would still resolve. That hole is already closed at another cadence: `mutation/census.ts` declares
   * how many guards each file of this suite collects, and a file that stops collecting falls under its
   * declared count and is refused by name. This one catches the frequent fault in seconds - an address
   * renamed by somebody refactoring - and the census catches the rare one. Neither repeats the other,
   * which is what makes both affordable.
   *
   * The map is pinned rather than merely checked for emptiness, because it is what replaced a sentence
   * in this file's header claiming all of them were here. A derived fact that is checked beats a claim
   * that is not, and moving a guard to another file is an event worth confirming.
   */
  it('every-clean-refusal-resolves-to-the-guard-it-names :: and this is the file each one is in', () => {
    const carried = guardsOfThisFolder()

    expect(
      Object.fromEntries(
        WHAT_BREAKS.flatMap((entry) =>
          entry.guard === undefined ? [] : [[entry.guard, carried[entry.guard] ?? null] as const],
        ),
      ),
    ).toEqual({
      'a-file-we-did-not-write-is-never-overwritten': 'breakage.test.ts',
      'a-file-already-holding-our-bytes-is-claimed-and-not-rewritten': 'breakage.test.ts',
      'a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run': 'breakage.test.ts',
      'an-edited-file-is-never-replaced': 'breakage.test.ts',
      'reinstalling-what-is-already-there-changes-nothing': 'install.test.ts',
      'add-with-no-configuration-writes-one-and-says-so': 'breakage.test.ts',
      'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name': 'configuration.test.ts',
      'an-unreadable-lockfile-stops-the-install': 'breakage.test.ts',
      'a-field-this-toopo-does-not-honour-is-refused': 'configuration.test.ts',
      'a-project-with-no-package-json-installs-normally': 'breakage.test.ts',
      'a-path-with-a-space-installs-normally': 'breakage.test.ts',
      'the-users-tsconfig-is-never-read': 'breakage.test.ts',
      'a-file-where-a-folder-must-go-is-refused-with-nothing-staged': 'write.test.ts',
      'a-directory-where-a-file-goes-is-refused-by-name': 'write.test.ts',
      'a-feature-that-was-never-asked-for-is-refused-with-what-imports-it': 'remove.test.ts',
      'a-feature-another-root-still-imports-stays-and-stops-being-a-root': 'remove.test.ts',
      'a-file-the-user-edited-is-not-deleted-by-a-removal': 'remove.test.ts',
      'a-removal-that-cannot-reach-the-registry-refuses-and-explains': 'remove.test.ts',
      'a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it': 'update.test.ts',
      'every-file-missing-at-once-says-the-folder-is-not-committed': 'update.test.ts',
      'a-file-already-equal-to-what-we-would-write-is-not-a-conflict': 'update.test.ts',
      'every-installed-file-moves-and-not-one-byte-changes': 'relocate.test.ts',
      'a-destination-holding-something-else-refuses-the-whole-move': 'relocate.test.ts',
      'the-folder-that-was-left-stays-when-it-holds-something-else': 'relocate.test.ts',
    })
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
        'src/lib/toopo/string/slugify/slugify.ts is not the file toopo wrote there. Toopo never ' +
          'replaces a change it did not make: move it aside, or keep it and skip this install.',
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
      expect(faults).toContain('That version did not record which features you asked for')
      expect(faults).toContain('toopo add string/slugify')
    } finally {
      project.remove()
    }
  })

  /**
   * **The version has to be the one this `toopo` reads**, and that is a repair the battery found: while
   * it said `1`, the file was refused for being an old *format* and the malformed entry inside it was
   * never looked at. The guard went on passing and stopped measuring what it names - which is exactly
   * the failure this repository calls a decorative guard, arriving through a change made three files
   * away.
   */
  it('an-unreadable-lockfile-stops-the-install', () => {
    const project = aProject()
    try {
      project.write(
        'toopo.lock',
        `{ "version": ${LOCKFILE_VERSION}, "features": [ { "contract": {} } ] }`,
      )

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
   *
   * **This is the first command anybody types, and it used to be a refusal.** What it asserts is the
   * whole of the first contact: nothing was configured, one line was typed, the feature is on disk, and
   * the file that appeared without being asked for is named on the screen that made it appear.
   *
   * The folder is `lib/toopo` rather than `src/lib/toopo` because a temporary project has no `src`,
   * which is `proposeDirectory` being exercised rather than a constant being restated.
   */
  it('add-with-no-configuration-writes-one-and-says-so', () => {
    const project = aProject()
    try {
      const screen = execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
      })

      expect(screen).toContain(`${CONFIGURATION_FILE}  written`)
      expect(screen).toContain('features    lib/toopo')
      expect(screen).toContain(`Commit ${CONFIGURATION_FILE}, toopo.lock and lib/toopo/`)
      expect(screen).toContain('typescript/string/slugify@1')

      expect(readConfiguration(project.root)).toEqual({ version: 1, directory: 'lib/toopo' })
      expect(
        existsSync(join(project.root, 'lib/toopo/string/slugify/slugify.ts')),
      ).toBe(true)
      expect(readLockfile(project.root)?.features).toHaveLength(1)
    } finally {
      project.remove()
    }
  })

  /**
   * And the project it still refuses, run the same way, because the refusal is the half of this change
   * that a guard over values cannot show writes nothing.
   */
  it('add-with-a-lockfile-and-no-configuration-writes-nothing', () => {
    const project = aProject()
    try {
      execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
      })
      rmSync(join(project.root, CONFIGURATION_FILE))

      const before = readFileSync(join(project.root, 'toopo.lock'), 'utf8')

      expect(() =>
        execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/levenshtein'], {
          cwd: project.root,
          encoding: 'utf8',
          stdio: 'pipe',
        }),
      ).toThrow()

      expect(existsSync(join(project.root, CONFIGURATION_FILE))).toBe(false)
      expect(readFileSync(join(project.root, 'toopo.lock'), 'utf8')).toBe(before)
      expect(existsSync(join(project.root, 'lib/toopo/string/levenshtein'))).toBe(false)
    } finally {
      project.remove()
    }
  })
})
