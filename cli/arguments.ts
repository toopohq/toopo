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
  /**
   * `apply` is the explicit acceptance permanent rule 4 asks for, and it is a second command rather
   * than an answer to a prompt: `update.ts` records why that matters more than the convenience.
   */
  | { readonly name: 'update'; readonly apply: boolean }

export const USAGE = `usage:
  toopo init [--dir <path>]                  configure where features go
  toopo add <domain>/<name> [--implementation <id>]
                                             install a feature and what it imports
  toopo update [--apply]                     show what would change, then write it`

export type ParsedArguments =
  | { readonly command: Command }
  | { readonly faults: readonly string[] }

/**
 * The two kinds of flag this grammar has.
 *
 * They are named apart rather than distinguished by whether a value happens to follow, because
 * `--apply --dir x` has to read as a switch and a valued flag and not as a switch that swallowed
 * `--dir`. A grammar that guessed from what came next would decide that from the user's typing.
 */
type Grammar = {
  /** `--dir <path>`: the flag and its value. */
  readonly valued: readonly string[]
  /** `--apply`: the flag is the answer. */
  readonly switches: readonly string[]
}

type Flags = {
  readonly values: Readonly<Record<string, string>>
  readonly switched: ReadonlySet<string>
  readonly faults: readonly string[]
}

const named = (grammar: Grammar): string =>
  [...grammar.valued, ...grammar.switches].map((flag) => `--${flag}`).join(', ')

/** `--flag value` and `--flag`, and nothing else. A valued flag with no value is refused. */
const flagsIn = (words: readonly string[], grammar: Grammar): Flags => {
  const values: Record<string, string> = {}
  const switched = new Set<string>()
  const faults: string[] = []

  for (let at = 0; at < words.length; at += 1) {
    const word = words[at] as string

    if (!word.startsWith('--')) {
      faults.push(`\`${word}\` is not a flag, and this command takes no further argument`)
      continue
    }

    const name = word.slice(2)

    if (grammar.switches.includes(name)) {
      if (switched.has(name)) faults.push(`\`--${name}\` was given twice`)
      switched.add(name)
      continue
    }

    const value = words[at + 1]
    const given = value !== undefined && !value.startsWith('--')
    // Consumed before the flag is judged, so that a refused flag does not leave its own value behind
    // to be reported a second time as a stray word.
    if (given) at += 1

    if (!grammar.valued.includes(name)) {
      faults.push(`\`--${name}\` is not a flag this command takes (${named(grammar)})`)
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

  return { values, switched, faults }
}

export const parseArguments = (argv: readonly string[]): ParsedArguments => {
  const [command, ...rest] = argv

  if (command === undefined) return { faults: ['no command was given'] }

  if (command === 'init') {
    const flags = flagsIn(rest, { valued: ['dir'], switches: [] })
    if (flags.faults.length > 0) return { faults: flags.faults }

    return { command: { name: 'init', directory: flags.values['dir'] ?? null } }
  }

  if (command === 'add') {
    const [contract, ...flagWords] = rest
    if (contract === undefined) return { faults: ['`add` needs the name of a contract'] }
    if (contract.startsWith('--')) {
      return { faults: ['`add` needs the name of a contract before any flag'] }
    }

    const flags = flagsIn(flagWords, { valued: ['implementation'], switches: [] })
    if (flags.faults.length > 0) return { faults: flags.faults }

    return {
      command: {
        name: 'add',
        contract,
        implementation: flags.values['implementation'] ?? null,
      },
    }
  }

  if (command === 'update') {
    const flags = flagsIn(rest, { valued: [], switches: ['apply'] })
    if (flags.faults.length > 0) return { faults: flags.faults }

    return { command: { name: 'update', apply: flags.switched.has('apply') } }
  }

  return { faults: [`\`${command}\` is not a command this \`toopo\` has`] }
}
