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
   * A directory is committed with the project, so it has to mean the same thing on every machine that
   * checks it out. An absolute path names the machine that ran `init`; a backslash names Windows; a
   * `..` names something outside the project. None of the three is repaired here, because repairing it
   * would leave the committed file saying something this tool does not mean.
   */
  it('a-directory-that-does-not-travel-is-refused', () => {
    const refused = ['/etc/toopo', 'C:\\toopo', 'src\\lib\\toopo', '../outside', '', 42, undefined]

    expect(
      refused.map((directory) => configurationFaults({ version: 1, directory }).length),
    ).toEqual([1, 1, 1, 1, 1, 1, 1])
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
