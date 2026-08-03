import { describe, it, expect } from 'vitest'

import {
  CONFIGURATION_FILE,
  UnusableConfiguration,
  configurationFaults,
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
})
