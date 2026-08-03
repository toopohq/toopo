/**
 * `toopo.json` - what the user told us once, and the only thing `add` consults about their project.
 *
 * ---------------------------------------------------------------------------
 * One settable field, and the version that carries the next one
 * ---------------------------------------------------------------------------
 *
 * There is no `imports` field, and its absence is a decision rather than an omission. Only one import
 * style exists in this unit - relative, which is what a published source already writes - so a field
 * holding one value nobody can change would be a setting we write and do not honour, which is a promise
 * not kept. When the alias style arrives it is `version: 2`, `init` detects the prefix once and records
 * it, and `add` goes on consulting nothing but this file. We record what the user told us; we do not
 * inspect their build.
 *
 * `directory` is relative to the project root and stays relative, because the file is committed: an
 * absolute path would name the machine that ran `init` and would be wrong for everybody else who
 * checks the project out.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const CONFIGURATION_FILE = 'toopo.json'

export type Configuration = {
  readonly version: 1
  /** Where installed features go, relative to the project root, with forward slashes. */
  readonly directory: string
}

/**
 * A path that stays inside the project and means the same thing on every platform.
 *
 * Backslashes are refused rather than normalised. A configuration written on Windows and committed
 * would otherwise name a directory no other machine can resolve, and silently repairing it here would
 * leave the committed file saying something this tool does not mean.
 */
const DIRECTORY = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/

export const configurationFaults = (value: unknown): readonly string[] => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return [`${CONFIGURATION_FILE} does not hold an object`]
  }

  const held = value as Readonly<Record<string, unknown>>
  const directory = held['directory']

  return [
    ...(held['version'] === 1
      ? []
      : [
          `${CONFIGURATION_FILE} carries version ${JSON.stringify(held['version'])}, and this ` +
            `\`toopo\` writes version 1`,
        ]),
    ...(typeof directory === 'string' && DIRECTORY.test(directory) && !directory.split('/').includes('..')
      ? []
      : [
          `${CONFIGURATION_FILE} carries ${JSON.stringify(directory)} as its directory, which is not ` +
            `a relative path inside the project written with forward slashes`,
        ]),
    ...Object.keys(held)
      .filter((key) => key !== 'version' && key !== 'directory')
      .map(
        (key) =>
          `${CONFIGURATION_FILE} carries \`${key}\`, which this \`toopo\` does not honour - a setting ` +
          `that is written and ignored is a promise not kept`,
      ),
  ]
}

export class UnusableConfiguration extends Error {
  constructor(faults: readonly string[]) {
    super(faults.join('\n'))
    this.name = 'UnusableConfiguration'
  }
}

/** The configuration of a project, or `null` when it has never been initialised. */
export const readConfiguration = (root: string): Configuration | null => {
  const path = join(root, CONFIGURATION_FILE)
  if (!existsSync(path)) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    throw new UnusableConfiguration([`${CONFIGURATION_FILE} is not JSON`])
  }

  const faults = configurationFaults(parsed)
  if (faults.length > 0) throw new UnusableConfiguration(faults)

  return parsed as Configuration
}

/** Written with a trailing newline, because it is a file a person opens in an editor. */
export const writeConfiguration = (root: string, configuration: Configuration): void => {
  writeFileSync(
    join(root, CONFIGURATION_FILE),
    `${JSON.stringify(configuration, null, 2)}\n`,
    'utf8',
  )
}

/**
 * Where features go when nobody says otherwise.
 *
 * Detected once rather than asked, because a prompt is a click and a wrong default is one flag. A
 * project with a `src` folder gets `src/lib/toopo`; one without gets `lib/toopo`. Both are two
 * segments deep so that a feature's own `domain/name` folders sit under something named for this tool
 * rather than loose in the user's tree.
 */
export const proposeDirectory = (root: string): string =>
  existsSync(join(root, 'src')) ? 'src/lib/toopo' : 'lib/toopo'
