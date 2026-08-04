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
  /**
   * The way out, and it carries `--apply` for the same reason `update` does - see THE_WRITE_DISCIPLINE
   * below, which is the rule both of them are instances of.
   */
  | { readonly name: 'remove'; readonly contract: string; readonly apply: boolean }
  /** What this project holds, read out of `toopo.lock` and nothing else. */
  | { readonly name: 'list' }
  /**
   * The words are joined back into one query, because a query is a phrase and nobody quotes in a
   * shell. Forty-nine of the sixty-two aliases the catalogue declares carry a space; requiring quotes
   * would make the most natural way to search the one that does not work.
   *
   * The figure used to read "fourteen of the seventy", and it was false at seventy as well - fifty-six
   * of them carried a space. It is the same number `CLAUDE.md` published for a different claim, the
   * aliases holding `to`, `by` or `from`, and it was wrong for that one too. Both are measured here
   * rather than restated, which is the only thing that stops a figure from migrating onto a claim it
   * was never about.
   */
  | { readonly name: 'search'; readonly query: string }
  /**
   * `toopo search` with no words at all. A separate command rather than an empty query, because
   * listing is not searching: `search.ts` answers nothing to a query with no words in it, on purpose
   * and under a guard, and a command that meant "everything" when it held nothing would be that rule
   * with an exception nobody can see. The grammar decides which of the two acts was asked for, which
   * is the one place that knows.
   */
  | { readonly name: 'catalogue' }

/**
 * Which commands ask twice, and it is not a matter of taste.
 *
 * **A command that can destroy or overwrite shows first and writes on a second word. A command that
 * can only refuse writes at once.** `update` and `remove` may replace or delete somebody's file, so
 * neither writes without `--apply`. `add` never touches a file it did not put there - it refuses, by
 * name, with nothing written - so asking twice would buy the user nothing and cost them a word.
 *
 * It is written down because the CLI had been applying it without saying it, and an unsaid convention
 * is one the next person breaks by trying to help: a `toopo add --dry-run` reads as symmetry and would
 * put the opposite default on the opposite half of the same tool, so that half the commands write
 * unless told not to and half refuse to write unless told to. That is worse than either rule alone,
 * and nobody would choose it deliberately - which is exactly why it has to be refusable by pointing at
 * a sentence.
 */
export const THE_WRITE_DISCIPLINE =
  'a command that can destroy or overwrite shows first and writes only on a second command; a ' +
  'command that can only refuse writes at once'

export const USAGE = `usage:
  toopo init [--dir <path>]                  configure where features go
  toopo add <domain>/<name> [--implementation <id>]
                                             install a feature and what it imports
  toopo remove <domain>/<name> [--apply]     show what would go, then take it out
  toopo update [--apply]                     show what would change, then write it
  toopo list                                 what this project holds
  toopo search [words...]                    find a contract, or list the catalogue`

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

/**
 * A contract name, then flags. The shape `add` and `remove` share, read once.
 *
 * The two refusals are the reason this is one function rather than two similar ones: they are the same
 * sentence about the same mistake, and a second copy of them is a second thing to keep true when the
 * wording is improved.
 */
const contractThenFlags = (
  verb: string,
  rest: readonly string[],
  grammar: Grammar,
): { readonly contract: string; readonly flags: Flags } | { readonly faults: readonly string[] } => {
  const [contract, ...flagWords] = rest

  if (contract === undefined) return { faults: [`\`${verb}\` needs the name of a contract`] }
  if (contract.startsWith('--')) {
    return { faults: [`\`${verb}\` needs the name of a contract before any flag`] }
  }

  const flags = flagsIn(flagWords, grammar)

  return flags.faults.length > 0 ? { faults: flags.faults } : { contract, flags }
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
    const read = contractThenFlags('add', rest, { valued: ['implementation'], switches: [] })
    if ('faults' in read) return read

    return {
      command: {
        name: 'add',
        contract: read.contract,
        implementation: read.flags.values['implementation'] ?? null,
      },
    }
  }

  if (command === 'remove') {
    const read = contractThenFlags('remove', rest, { valued: [], switches: ['apply'] })
    if ('faults' in read) return read

    return {
      command: { name: 'remove', contract: read.contract, apply: read.flags.switched.has('apply') },
    }
  }

  if (command === 'list') {
    // Refused here rather than through `flagsIn`, which would report an unknown flag against an empty
    // list of the ones this command takes - a sentence ending in "()".
    if (rest.length > 0) return { faults: ['`list` takes no argument'] }

    return { command: { name: 'list' } }
  }

  if (command === 'search') {
    const flag = rest.find((word) => word.startsWith('--'))
    if (flag !== undefined) {
      return { faults: [`\`${flag}\` is not a flag this command takes - \`search\` takes words`] }
    }
    // No words is the catalogue, and it is the first question anybody asks. It used to be refused,
    // which answered "you must know what you are looking for" to somebody who had just arrived.
    if (rest.length === 0) return { command: { name: 'catalogue' } }

    return { command: { name: 'search', query: rest.join(' ') } }
  }

  if (command === 'update') {
    const flags = flagsIn(rest, { valued: [], switches: ['apply'] })
    if (flags.faults.length > 0) return { faults: flags.faults }

    return { command: { name: 'update', apply: flags.switched.has('apply') } }
  }

  return { faults: [`\`${command}\` is not a command this \`toopo\` has`] }
}
