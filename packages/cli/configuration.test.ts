import { describe, it, expect } from 'vitest'

import type { ADirectoryToConfigure } from './configuration.js'
import {
  CONFIGURATION_FILE,
  UnusableConfiguration,
  WHERE_A_DIRECTORY_COMES_FROM,
  configurationFaults,
  configurationToInstallUnder,
  proposeDirectory,
  readConfiguration,
  theDirectoryFaults,
  theDirectoryToConfigure,
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

/**
 * One refused folder arriving from each of the three sources `init` composes it out of.
 *
 * Total by the compiler over `WHERE_A_DIRECTORY_COMES_FROM`, so a fourth source cannot arrive without
 * a row here - and the guard below checks the mapping in both directions, so it cannot arrive with a
 * row that names the wrong one either.
 *
 * The same string in all three, because what is being told apart is the *source* and a second variable
 * would let a row pass for the wrong reason.
 */
const A_REFUSED_FOLDER_FROM_EACH_SOURCE: Readonly<
  Record<keyof typeof WHERE_A_DIRECTORY_COMES_FROM, ADirectoryToConfigure>
> = {
  typed: theDirectoryToConfigure('../outside', { version: 1, directory: 'app/toopo' }, 'lib/toopo'),
  committed: theDirectoryToConfigure(null, { version: 1, directory: '../outside' }, 'lib/toopo'),
  proposed: theDirectoryToConfigure(null, null, '../outside'),
}

/**
 * What `asTyped` escapes on purpose, and so the one thing a reader is not shown as they typed it.
 *
 * A refusal is joined into a message with newlines, so a directory holding one would break its own
 * sentence in half. The rows carrying one are excluded here rather than the claim being weakened,
 * because the claim is exactly true everywhere else.
 */
const A_CONTROL_CHARACTER = /\p{Cc}/u

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

  /**
   * And the other half of a refusal a reader can act on: which of the three branches gave the folder.
   *
   * **It was one sentence written for one population and shown to another.** `configurationFaults`
   * speaks in the words of a committed `toopo.json`, and `toopo init --dir` reused it - so
   * `init --dir ../outside` was refused with *`toopo.json` carries "../outside"* on a path where no
   * such file exists, nothing is written, and the string arrived on the command line. Measured from
   * npm against `1.2.0`; the confinement was right in both cases and only the sentence was wrong,
   * which is why nothing anywhere was red. ADR-0213 found it, ADR-0214 is the repair.
   *
   * **Both doors are shut here, and that is why the two calls are composed rather than asked apart.**
   * A refusal names the wrong source either because the sentence reaches for the wrong constant or
   * because the chooser reports a branch other than the one that supplied the value, and reading only
   * the second half would leave the first free. The third door is the entry point calling this pair
   * with a source of its own, and `the-folder-init-is-given-is-one-this-toopo-can-read` is what shuts
   * that one, over a real process - which is the only place it can be shut.
   *
   * The negative arm is what stops it passing on a sentence that names every source at once.
   */
  it('a-refused-directory-is-named-by-where-it-came-from', () => {
    const reported = Object.fromEntries(
      Object.entries(A_REFUSED_FOLDER_FROM_EACH_SOURCE).map(([branch, one]) => [branch, one.from]),
    )

    expect(reported).toEqual(WHERE_A_DIRECTORY_COMES_FROM)

    const misnamed = Object.values(A_REFUSED_FOLDER_FROM_EACH_SOURCE).flatMap((one) => {
      const said = theDirectoryFaults(one.from, one.directory)[0] ?? '(nothing was said)'

      return [
        ...(said.startsWith(one.from) ? [] : [`${one.from}: the refusal does not open with it`]),
        ...Object.values(WHERE_A_DIRECTORY_COMES_FROM)
          .filter((other) => other !== one.from && said.includes(other))
          .map((other) => `${one.from}: the refusal also names ${other}`),
      ]
    })

    expect(misnamed).toEqual([])
  })

  /**
   * A folder is shown back in the characters somebody typed, so they can recognise what was refused.
   *
   * **`JSON.stringify` doubles a backslash**, so a reader who typed `C:\toopo` was shown `"C:\\toopo"`
   * - by the arm that refuses a volume, which is the arm somebody on Windows meets. The renderer is a
   * machine's and the sentence is a person's, and the character the two disagree about is the one half
   * these refusals are about. ADR-0214.
   *
   * The population is the declaration above rather than a second list, so a spelling added there is a
   * spelling this asks about too - which is what stops the two drifting into agreeing about different
   * things.
   */
  it('a-directory-a-reader-typed-is-shown-as-they-typed-it', () => {
    const said = (directory: string): string =>
      configurationFaults({ version: 1, directory })[0] ?? '(nothing was said)'

    const shownOtherwise = Object.values(WHAT_A_COMMITTED_DIRECTORY_CANNOT_BE)
      .flat()
      .filter((directory): directory is string => typeof directory === 'string')
      .filter((directory) => !A_CONTROL_CHARACTER.test(directory))
      .filter((directory) => !said(directory).includes(directory))

    expect(shownOtherwise).toEqual([])
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
