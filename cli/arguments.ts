/**
 * What the user typed, read without a parser library.
 *
 * The repository is limited to four dev dependencies and a feature takes none at all, so an argument
 * parser is not available and is not wanted: the grammar below is two commands and two flags, and a
 * library that handled the ninety cases this does not have would be ninety behaviours nobody here has
 * decided.
 *
 * Everything is refused rather than guessed. An unknown flag, a flag with no value, a second contract
 * name - each of them is a sentence naming what was wrong, because the alternative is a `toopo add`
 * that quietly installed something other than what was asked for.
 */

export type Command =
  | { readonly name: 'init'; readonly directory: string | null }
  | {
      readonly name: 'add'
      /** The contract, as the user wrote it: `domain/name` or `domain/name@major`. */
      readonly contract: string
      /** The implementation to install, or `null` for whichever the registry makes default. */
      readonly implementation: string | null
    }

export const USAGE = `usage:
  toopo init [--dir <path>]                  configure where features go
  toopo add <domain>/<name> [--implementation <id>]
                                             install a feature and what it imports`

export type ParsedArguments =
  | { readonly command: Command }
  | { readonly faults: readonly string[] }

type Flags = { readonly values: Readonly<Record<string, string>>; readonly faults: readonly string[] }

/** `--flag value`, and nothing else. A flag with no value is refused rather than read as empty. */
const flagsIn = (words: readonly string[], permitted: readonly string[]): Flags => {
  const values: Record<string, string> = {}
  const faults: string[] = []

  for (let at = 0; at < words.length; at += 1) {
    const word = words[at] as string

    if (!word.startsWith('--')) {
      faults.push(`\`${word}\` is not a flag, and this command takes no further argument`)
      continue
    }

    const name = word.slice(2)
    const value = words[at + 1]
    const given = value !== undefined && !value.startsWith('--')
    // Consumed before the flag is judged, so that a refused flag does not leave its own value behind
    // to be reported a second time as a stray word.
    if (given) at += 1

    if (!permitted.includes(name)) {
      faults.push(`\`--${name}\` is not a flag this command takes (${permitted.map((f) => `--${f}`).join(', ')})`)
      continue
    }
    if (!given) {
      faults.push(`\`--${name}\` was given no value`)
      continue
    }
    if (values[name] !== undefined) {
      faults.push(`\`--${name}\` was given twice`)
      continue
    }

    values[name] = value as string
  }

  return { values, faults }
}

export const parseArguments = (argv: readonly string[]): ParsedArguments => {
  const [command, ...rest] = argv

  if (command === undefined) return { faults: ['no command was given'] }

  if (command === 'init') {
    const flags = flagsIn(rest, ['dir'])
    if (flags.faults.length > 0) return { faults: flags.faults }

    return { command: { name: 'init', directory: flags.values['dir'] ?? null } }
  }

  if (command === 'add') {
    const [contract, ...flagWords] = rest
    if (contract === undefined) return { faults: ['`add` needs the name of a contract'] }
    if (contract.startsWith('--')) {
      return { faults: ['`add` needs the name of a contract before any flag'] }
    }

    const flags = flagsIn(flagWords, ['implementation'])
    if (flags.faults.length > 0) return { faults: flags.faults }

    return {
      command: {
        name: 'add',
        contract,
        implementation: flags.values['implementation'] ?? null,
      },
    }
  }

  return { faults: [`\`${command}\` is not a command this \`toopo\` has`] }
}
