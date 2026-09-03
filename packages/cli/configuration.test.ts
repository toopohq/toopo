import { describe, it, expect } from 'vitest'

import {
  CONFIGURATION_FILE,
  UnusableConfiguration,
  configurationFaults,
  configurationToInstallUnder,
  proposeDirectory,
  readConfiguration,
  writeConfiguration,
} from './configuration.js'
import { aProject } from './temporary-project.js'

/**
 * `toopo.json`, which is the only thing `add` consults about the user's project.
 *
 * The guard that matters most here is the one about a field this `toopo` does not honour. A
 * configuration file is a promise: the user writes a setting expecting it to change something, and a
 * tool that reads a file it does not act on is a tool that lies quietly. Refusing an unknown key is
 * also what makes `version: 1` load-bearing rather than decorative - it is how the next version of
 * this file arrives without the previous one having pretended to understand it.
 */

/**
 * The directories a committed `toopo.json` cannot carry, sorted by what each row is *about*.
 *
 * A declaration rather than a handful somebody thought of, and grouped the way
 * `where-a-file-may-land.test.ts` groups the served path's rows: by the thing a reader checking the
 * table has to be able to decide, never by platform. A volume of its own is not a Windows row - it is
 * refused on Linux for the same reason.
 *
 * Everything but the last two groups is refused by `A_DIRECTORY`, and a row added to one of them is a
 * row the same expression already decides. `not text at all` is the one fault that belongs to this
 * file rather than to the rule, because a rule about folders has nothing to say about a number.
 */
const WHAT_A_COMMITTED_DIRECTORY_CANNOT_BE: Readonly<Record<string, readonly unknown[]>> = {
  'a path from the root': ['/etc/toopo', '//server/share/toopo'],
  'a volume of its own': ['C:\\toopo', 'C:/toopo'],
  'a separator that names two different places': ['src\\lib\\toopo'],
  'a step upwards': ['../outside', 'a/../../x', '..'],
  'a character a folder here is not spelled with': [
    'lib/toopo:stream',
    'lib/a\u0000b/toopo',
    'lib/a\nb/toopo',
    'src/bibliothèque/toopo',
  ],
  'a folder with no name': ['', 'a//b', 'a/'],
  'not text at all': [42, undefined, null],
}

describe('the configuration of a project', () => {
  it('a-configuration-round-trips-through-the-file', () => {
    const project = aProject()
    try {
      writeConfiguration(project.root, { version: 1, directory: 'app/toopo' })

      expect(readConfiguration(project.root)).toEqual({ version: 1, directory: 'app/toopo' })
    } finally {
      project.remove()
    }
  })

  it('a-project-that-was-never-initialised-answers-nothing', () => {
    const project = aProject()
    try {
      expect(readConfiguration(project.root)).toBeNull()
    } finally {
      project.remove()
    }
  })

  it('a-field-this-toopo-does-not-honour-is-refused', () => {
    expect(configurationFaults({ version: 1, directory: 'src/lib/toopo', imports: 'alias' })).toEqual([
      `${CONFIGURATION_FILE} carries \`imports\`, which this \`toopo\` does not honour - a setting ` +
        `that is written and ignored is a promise not kept`,
    ])
  })

  it('a-version-this-toopo-does-not-write-is-refused', () => {
    expect(configurationFaults({ version: 2, directory: 'src/lib/toopo' })).toEqual([
      `${CONFIGURATION_FILE} carries version 2, and this \`toopo\` writes version 1`,
    ])
  })

  /**
   * Every row is refused, and each is refused exactly once.
   *
   * A directory is committed with the project, so it has to mean the same folder on every machine that
   * checks it out. None of these is repaired on the way in, because repairing one would leave the
   * committed file saying something this tool does not mean.
   *
   * The count is asserted rather than the mere presence of a fault: two faults for one directory is a
   * rule answering twice, and it is the shape a fifth arm added without reading the four would take.
   */
  it('a-directory-that-does-not-travel-is-refused', () => {
    const notRefusedExactlyOnce = Object.entries(WHAT_A_COMMITTED_DIRECTORY_CANNOT_BE).flatMap(
      ([about, spellings]) =>
        spellings
          .filter((directory) => configurationFaults({ version: 1, directory }).length !== 1)
          .map((directory) => `${about}: ${JSON.stringify(directory)}`),
    )

    expect(notRefusedExactlyOnce).toEqual([])
  })

  /**
   * The other direction, so that the guard above cannot be satisfied by a rule that refuses everything.
   *
   * `src/my code/toopo` is the row this pair exists for. It is a relative path inside the project
   * written with forward slashes, it was refused for one release while `breakage.ts` declared that it
   * installs normally, and ADR-0208 is the measurement that admitted it. The three positions are all
   * here because the space was refused on a claim about *where* it sits, and that claim was measured
   * false on both platforms.
   *
   * `src/code./toopo` and `a..b/toopo` are the rows the `..` clause is most likely to take with it: a
   * folder whose name ends in a dot, and one that merely holds two, are not a step upwards.
   */
  it('a-directory-that-travels-is-accepted', () => {
    const refused = [
      'lib/toopo',
      'src/lib/toopo',
      'src/my code/toopo',
      'src/ code/toopo',
      'src/code /toopo',
      'src/code./toopo',
      'a..b/toopo',
      'a_b-c.d/toopo',
    ].filter((directory) => configurationFaults({ version: 1, directory }).length > 0)

    expect(refused).toEqual([])
  })

  /**
   * A refusal that explains is a door and one that reports is a wall, so what is read here is the
   * *cause* and never the whole sentence.
   *
   * The arms are ordered so that each names the thing a person can act on, and the ordering is the
   * whole of what this guard is about: a rule read backwards from its alphabet would answer `":"` for
   * a drive letter and `"\\"` for a Windows path, both true and neither useful.
   */
  it('a-refused-directory-is-told-what-in-it-was-refused', () => {
    const said = (directory: string): string =>
      configurationFaults({ version: 1, directory })[0] ?? '(nothing was said)'

    const CAUSES: readonly (readonly [string, string])[] = [
      ['C:\\toopo', 'an absolute path'],
      ['src\\lib\\toopo', 'written with backslashes'],
      ['../outside', 'leads out of your project'],
      ['lib/toopo:stream', 'it holds ":"'],
      ['a//b', 'named by nothing at all'],
    ]

    expect(CAUSES.filter(([directory, cause]) => !said(directory).includes(cause))).toEqual([])
  })

  it('a-file-that-is-not-json-is-refused-by-name', () => {
    const project = aProject()
    try {
      project.write(CONFIGURATION_FILE, '{ not json')

      expect(() => readConfiguration(project.root)).toThrow(UnusableConfiguration)
    } finally {
      project.remove()
    }
  })

  /** Detected, not asked. A prompt is a click; a wrong default is one flag. */
  it('the-proposed-directory-follows-the-shape-of-the-project', () => {
    const withSource = aProject()
    const without = aProject()
    try {
      withSource.write('src/index.ts', 'export const a = 1\n')

      expect(proposeDirectory(withSource.root)).toBe('src/lib/toopo')
      expect(proposeDirectory(without.root)).toBe('lib/toopo')
    } finally {
      withSource.remove()
      without.remove()
    }
  })

  /**
   * The three answers `toopo add` can get about a project's configuration, decided from values alone.
   *
   * They are asserted together rather than as three guards because they are one partition and the thing
   * worth catching is a decision moving between arms - which is invisible when each arm is checked by
   * itself.
   */
  it('a-project-with-nothing-in-it-is-configured-rather-than-refused', () => {
    const held = { version: 1, directory: 'app/toopo' } as const

    expect(configurationToInstallUnder(held, false, 'lib/toopo')).toEqual({
      configuration: held,
      write: false,
    })
    expect(configurationToInstallUnder(held, true, 'lib/toopo')).toEqual({
      configuration: held,
      write: false,
    })
    expect(configurationToInstallUnder(null, false, 'lib/toopo')).toEqual({
      configuration: { version: 1, directory: 'lib/toopo' },
      write: true,
    })
  })

  /**
   * The one project `add` still refuses, and it is the case the old refusal was covering by accident.
   *
   * `toopo.lock` holds each file's path relative to the configured directory and never the directory,
   * so a project with features installed and no `toopo.json` is one where the folder is not recoverable.
   * Proposing one would install beside the files that are already there rather than over them.
   *
   * The refusal is checked for the command it names, because a refusal nobody can act on is the shape
   * this repository refuses everywhere: a wall rather than a door.
   */
  it('a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name', () => {
    const refused = configurationToInstallUnder(null, true, 'lib/toopo')

    if (!('faults' in refused)) throw new Error('a lockfile with no configuration was not refused')

    expect(refused.faults.join('\n')).toContain('toopo init --dir')
    expect(refused.faults.join('\n')).toContain('relative to the configured directory')
    expect(refused.faults.join('\n')).toContain(CONFIGURATION_FILE)
  })
})
