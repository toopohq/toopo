/**
 * `toopo.json` - what the user told us once, and the only setting `add` consults about their project.
 * ADR-0039 is why this file can be written by an install rather than only by init.
 *
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

import { THE_INVOCATION, THE_PACKAGE_NAME } from '../registry/address.js'
import { LOCKFILE } from './lockfile.js'
import { theDirectoryRefusal, travels } from './where-a-file-may-land.js'

export const CONFIGURATION_FILE = 'toopo.json'

export type Configuration = {
  readonly version: 1
  /** Where installed features go, relative to the project root, with forward slashes. */
  readonly directory: string
}

/**
 * Where the folder a project installs into can have come from, which is the half of a refusal a reader
 * can act on.
 *
 * Three, because `init` composes the folder out of three branches and a refusal that named the wrong
 * one sent a reader to a file that does not exist. They are spelled once here so that the sentence and
 * the branch cannot drift: `theDirectoryToConfigure` chooses the value and the source in one
 * expression, and `from` is typed as one of these three. ADR-0214.
 */
export const WHERE_A_DIRECTORY_COMES_FROM = {
  typed: '--dir',
  committed: CONFIGURATION_FILE,
  proposed: `${THE_PACKAGE_NAME}'s own proposal`,
} as const

export type WhereADirectoryCameFrom =
  (typeof WHERE_A_DIRECTORY_COMES_FROM)[keyof typeof WHERE_A_DIRECTORY_COMES_FROM]

/**
 * What is wrong with the folder a project would install into, said in the words of what is wrong with
 * it, and named by where the folder came from.
 *
 * The rule and its sentence both live in `where-a-file-may-land.ts`, beside the alphabet a served path
 * is spelled out of: one module states where this tool may put a file, and the configured directory is
 * half of every such place. ADR-0206 is what moved the alphabet there, and ADR-0208 is what gave the
 * directory one of its own - wider by a space, because a folder called `my code` travels.
 *
 * **`where` is a parameter because two populations reach this and only one of them is a file.** It was
 * `CONFIGURATION_FILE` in the code, so `toopo init --dir ../outside` was refused with a sentence about
 * a `toopo.json` that does not exist on that path, about a string that came from the command line.
 * ADR-0213 measured it; ADR-0214 is the repair.
 *
 * What stays here is the one fault that is about a *file* rather than about a folder: a field that is
 * not text at all, which a rule about the spelling of folders has nothing to say about. It is reachable
 * from the committed source alone - the other two hand this a `string` - so it is an arm no caller has
 * to think about rather than a branch that reads falsely for two of the three.
 */
export const theDirectoryFaults = (
  where: WhereADirectoryCameFrom,
  directory: unknown,
): readonly string[] =>
  typeof directory !== 'string'
    ? [
        `${where} names ${JSON.stringify(directory)} as the folder to install in, and a folder is ` +
          `named by text`,
      ]
    : travels(directory)
      ? []
      : [theDirectoryRefusal(where, directory)]

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
    ...theDirectoryFaults(WHERE_A_DIRECTORY_COMES_FROM.committed, directory),
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

/**
 * Written with a trailing newline, because it is a file a person opens in an editor.
 *
 * `to` is where the bytes go, and it defaults to the configuration's own place, for the reason
 * `writeLockfile` already takes the same parameter: `write.ts` stages every file it commits under a
 * temporary name first, and a configuration that could only be written in place would be one file of a
 * commit with no staged form.
 */
export const writeConfiguration = (
  root: string,
  configuration: Configuration,
  to = join(root, CONFIGURATION_FILE),
): void => {
  writeFileSync(to, `${JSON.stringify(configuration, null, 2)}\n`, 'utf8')
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

/** The folder `init` would configure, and which of the three sources supplied it. */
export type ADirectoryToConfigure = {
  readonly directory: string
  readonly from: WhereADirectoryCameFrom
}

/**
 * Which folder `toopo init` configures, decided from values alone, with where it came from beside it.
 *
 * **The source travels with the value because they are chosen by one expression**, and a refusal that
 * names the wrong source is the defect this exists after: the three branches lived in the entry point
 * and the sentence naming them was a constant one module away, so `init --dir ../outside` was refused
 * in the words of a file nobody had read. Chosen here, `from` cannot be true of a branch other than the
 * one that supplied `directory`.
 *
 * The order is the order of who decided: what somebody typed, then what the project already committed,
 * then what this tool deduces from the shape of the project. ADR-0214.
 */
export const theDirectoryToConfigure = (
  typed: string | null,
  held: Configuration | null,
  proposed: string,
): ADirectoryToConfigure =>
  typed !== null
    ? { directory: typed, from: WHERE_A_DIRECTORY_COMES_FROM.typed }
    : held !== null
      ? { directory: held.directory, from: WHERE_A_DIRECTORY_COMES_FROM.committed }
      : { directory: proposed, from: WHERE_A_DIRECTORY_COMES_FROM.proposed }

/** The configuration an install runs under, and whether it is one this command has to write. */
export type ConfigurationToUse =
  | { readonly configuration: Configuration; readonly write: boolean }
  | { readonly faults: readonly string[] }

/**
 * Which configuration `toopo add` installs under, decided from values alone.
 *
 * **`init` stops being a toll.** `add` used to refuse a project with no `toopo.json` and name
 * `toopo init`. That stopped somebody for
 * nothing: the only thing an install needs to know is a folder, `proposeDirectory` already deduces one,
 * and nothing was at stake in asking. So a project with nothing in it gets the proposed folder written
 * and is told so - **the report says a file appeared**, because a committed file arriving unannounced is
 * a surprise the user's team meets and the same file announced is a convenience. Whoever wanted another
 * folder edits one line and runs it again.
 *
 * `init` keeps every reason it had, for whoever wants to choose in advance. What it loses is the right
 * to stand in front of the first command anybody types.
 *
 * **One project is refused, and removing a friction is what revealed it.** A lockfile with no
 * configuration beside it is the case the old refusal was covering by accident.
 * **`toopo.lock` records each file's path relative to the configured directory and never the directory
 * itself** - `list.ts` and `write.ts` both join the two - so a project holding installed features and no
 * `toopo.json` is one where the folder is not recoverable from anything on disk. Proposing one would
 * install beside files that already exist rather than over them, leaving two copies and a lockfile
 * describing one of them.
 *
 * It is a door rather than a wall: the refusal says which command names the folder, and why only the
 * user can name it.
 */
export const configurationToInstallUnder = (
  held: Configuration | null,
  anythingInstalled: boolean,
  proposed: string,
): ConfigurationToUse => {
  if (held !== null) return { configuration: held, write: false }

  if (anythingInstalled) {
    return {
      faults: [
        `${LOCKFILE} records installed features and there is no ${CONFIGURATION_FILE}, so nothing ` +
          `knows which folder they are in - a lockfile records each file's path relative to the ` +
          `configured directory and never the directory itself. Name it once and run this again:`,
        `  ${THE_INVOCATION} init --dir <the folder they are in>`,
      ],
    }
  }

  return { configuration: { version: 1, directory: proposed }, write: true }
}
