/**
 * From what somebody typed to the contracts that answer it.
 *
 * ---------------------------------------------------------------------------
 * Every word has to be answered, and that is what makes silence reachable
 * ---------------------------------------------------------------------------
 *
 * A contract matches when **every word of the query is answered by something it carries**. Not most
 * of them, not the best of them - all of them. The rule is one sentence, so a reader can predict what
 * this command does before running it, and it is the only rule under which `sort array` answers
 * nothing: `array` is half of a contract's own name, and a search that scored the halves it liked
 * would hand back `array/group-by` to somebody looking for a sorter.
 *
 * **A search that always answers something is the one that loses trust**, and it is the failure this
 * file is shaped around rather than a risk it accepts. Measured over twenty queries for utilities
 * this catalogue does not hold - `debounce`, `deep clone`, `uuid`, `flatten nested array` - the rule
 * answers nothing for all twenty.
 *
 * ---------------------------------------------------------------------------
 * The second rule, and the exact thing that bounds it
 * ---------------------------------------------------------------------------
 *
 * The first rule alone answers nothing to `convert a string to a number in javascript`, and that was
 * measured rather than feared: `in` occurs in `date/add@1`'s summary and nowhere in `number/parse@1`,
 * so one English preposition sank the most natural query the catalogue has. A list of words to ignore
 * would fix it by deciding, once and invisibly, which words carry meaning - and `to`, `by` and `from`
 * carry meaning here, they are in fourteen aliases.
 *
 * So: **a word a contract cannot answer is set aside for that contract, and what remains must then
 * name one of its own names, exports or aliases in full.** Setting a word aside can only widen a
 * query, and this is what the widening is paid for with - the remainder has to *precisely* name
 * something the contract declares, which `array` alone does not do for `array/group-by@1` and
 * `convert string to number` does do for `number/parse@1`.
 *
 * A summary cannot be what is named in full, and that is the same argument again: a summary is prose
 * a contract happens to be described by, so covering it is not a statement about anything.
 *
 * ---------------------------------------------------------------------------
 * What is searched, and why the description is not
 * ---------------------------------------------------------------------------
 *
 * The index and nothing else: the rendered address, the export names, the search aliases, the summary
 * and the language. `ServedIndexEntry` is the answer fetched before a query is answered and says of
 * itself that it is deliberately small - measured, the five contracts index to 3 106 bytes while
 * their descriptions alone are 6 187, so carrying them would triple the one document every search
 * pays for.
 *
 * That is not a limit accepted grudgingly. **The aliases are the searchable surface of the
 * description**: a query only the description could have answered is an alias the contract is
 * missing, and the repair belongs in `identity.searchAliases`, where it is frozen, reviewed and
 * served, rather than in an index that grew to hide the gap.
 *
 * ---------------------------------------------------------------------------
 * No tolerance for a typo, deliberately
 * ---------------------------------------------------------------------------
 *
 * A misspelling answers nothing. Edit distance would answer *something* for every input ever typed,
 * which is the property above given away for a convenience. The catalogue holds a `string/levenshtein`
 * whose reference implementation is three files away, and calling it from here was refused twice
 * over: it would buy the behaviour this file exists to refuse, and it would take `cli/` across the
 * frontier `source.ts` holds, where one module and only one may reach into the working tree.
 *
 * What is not a typo is a shortening - `leven` finds `levenshtein` - or an English plural, `arrays`
 * finding `array`. Both are bounded, and the bound was found by measurement: see `answers` below for
 * what a symmetric prefix admitted and why it is gone.
 */

import type { ContractAddress, Language } from '../registry/address.js'
import { renderContract, sameContract } from '../registry/address.js'
import type { ServedIndexEntry, ServedRefusal } from '../registry/response.js'
import type { RegistrySource } from './source.js'

/**
 * The words people type for a language, which are not the identifier an address carries.
 *
 * Total over `Language` by construction: a second language cannot enter the registry without
 * somebody deciding what a person searching for it would type. Nobody writes `typescript` meaning the
 * address coordinate - they write it meaning *is this for me*, which every contract here answers yes
 * to, which is why this field carries the least authority of any.
 */
const THE_WORDS_FOR: Readonly<Record<Language, readonly string[]>> = {
  typescript: ['javascript', 'typescript', 'js', 'ts'],
}

type MatchedField = 'name' | 'export' | 'alias' | 'summary' | 'language'

/**
 * What a match in each field is worth.
 *
 * A name is what the contract *is*, an export is what a caller writes, an alias is what the contract
 * says people look for, a summary is prose that happens to contain the word. The ladder is the order
 * of how deliberate the field is, and nothing subtler than that is claimed for it.
 */
const AUTHORITY: Readonly<Record<MatchedField, number>> = {
  name: 100,
  export: 60,
  alias: 40,
  summary: 10,
  language: 1,
}

/**
 * The shortest word that may be shortened further, or made singular.
 *
 * Three would let every three-letter word in a query reach across five contracts. Four is where the
 * pairs that matter still work - `leven`/`levenshtein`, `slugif`/`slugify` - and it is also what
 * keeps `is` and `as` from being read as plurals of `i` and `a`.
 */
const MINIMUM_PREFIX = 4

const WORD = /[a-z0-9]+/g

/**
 * The words of a text, with camel case split apart.
 *
 * `parseNumber` becomes `parse`, `number`; `Object.groupBy` becomes `object`, `group`, `by`. The same
 * function reads the query and the fields, which is the whole reason it can be this crude: somebody
 * typing `groupBy` and a contract spelling its alias `group by` meet in the middle, rather than
 * either one having to anticipate the other.
 */
const wordsOf = (text: string): readonly string[] =>
  text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .match(WORD) ?? []

type Field = {
  readonly kind: MatchedField
  /** The text as the contract wrote it, so a report can show what was matched. */
  readonly text: string
  readonly words: readonly string[]
}

/**
 * Everything of an entry a query may meet.
 *
 * The name is the *rendered* address - `number/parse@1` - rather than the bare name, so that typing
 * the major answers instead of refusing: every word of a query has to be answered, and `1` would
 * otherwise be a word nothing answers. There is no separate domain field because the rendered address
 * already carries it.
 */
const fieldsOf = (entry: ServedIndexEntry): readonly Field[] => {
  const rendered = renderContract(entry.address)

  return [
    { kind: 'name', text: rendered, words: wordsOf(rendered) },
    ...entry.exports.map((held) => ({
      kind: 'export' as const,
      text: held.name,
      words: wordsOf(held.name),
    })),
    ...entry.searchAliases.map((alias) => ({
      kind: 'alias' as const,
      text: alias,
      words: wordsOf(alias),
    })),
    { kind: 'summary', text: entry.summary, words: wordsOf(entry.summary) },
    { kind: 'language', text: entry.address.language, words: THE_WORDS_FOR[entry.address.language] },
  ]
}

/** One trailing `s` dropped, for words long enough that dropping it means something. */
const singular = (word: string): string =>
  word.length > MINIMUM_PREFIX && word.endsWith('s') ? word.slice(0, -1) : word

/**
 * Whether one word answers another: exactly, as its plural, or by being a shortening of it.
 *
 * **How it was reached does not change what it is worth**, and that is measured rather than assumed.
 * An exactness multiplier was written first, on the reading that an exact word is a stronger signal
 * than a shortened one; set to 2 and then to 100, it moved no result past another on any of the seven
 * queries this catalogue can order. A multiplier that cannot change an answer at any value is not a
 * rule, and the field a word was found in already carries the whole of what is known about it.
 *
 * **The shortening goes one way only, and that was measured rather than assumed.** A symmetric
 * prefix - either word starting the other - reads well and answers `stringify` with all three
 * contracts whose name or summary carries `string`, `datepicker` and `dateline` with `date/add@1`,
 * and `stringbuilder` with three more. Those are the plausible-but-wrong hits this file exists to
 * refuse, arriving through the one rule that was supposed to be a convenience.
 *
 * So a query word may be a *prefix* of something the contract carries - `leven` reaching
 * `levenshtein`, which is somebody typing less - and never an extension of it, which is somebody
 * typing a different, longer word. What the direction costs is the English plural, and that is what
 * `singular` buys back explicitly: `arrays`, `numbers` and `dates` are queries people write, and
 * they are a plural rather than a different word. Nothing else about English is claimed.
 */
const answers = (asked: string, held: string): boolean =>
  asked === held ||
  singular(asked) === singular(held) ||
  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked))

type Hit = { readonly value: number; readonly field: Field }

/** The most authoritative field of this entry that answers the word, or nothing at all. */
const bestHit = (word: string, fields: readonly Field[]): Hit | null => {
  let best: Hit | null = null

  for (const field of fields) {
    if (!field.words.some((held) => answers(word, held))) continue

    const value = AUTHORITY[field.kind]
    if (best === null || value > best.value) best = { value, field }
  }

  return best
}

/**
 * A field the query names in full: every word the field carries is present in the query.
 *
 * The deliberate fields only. Covering a summary says nothing, because a summary is not a thing
 * anybody chose as a way of being found.
 */
const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>(['name', 'export', 'alias'])

const namedInFull = (fields: readonly Field[], words: readonly string[]): boolean =>
  fields.some(
    (field) => DELIBERATE.has(field.kind) && field.words.every((word) => words.includes(word)),
  )

export type Result = {
  readonly address: ContractAddress
  readonly summary: string
  readonly exports: readonly string[]
  readonly installable: boolean
  /** Why the catalogue decided against it, for a contract that carries a refusal. */
  readonly refusal: ServedRefusal | null
  readonly score: number
}

export type Search = {
  readonly query: string
  /** Best first, and on a tie by rendered address, so two machines answer in one order. */
  readonly results: readonly Result[]
  /** The words no contract in the catalogue answers at all. */
  readonly unknownWords: readonly string[]
}

/**
 * What this entry is worth against this query, or `null` when it does not answer it.
 *
 * `null` rather than a score of zero, so that no threshold anywhere has to be tuned: an entry that
 * leaves a word unanswered without naming something in full is not a weak result, it is not a result.
 */
const scoreOf = (entry: ServedIndexEntry, words: readonly string[]): number | null => {
  const fields = fieldsOf(entry)
  const hits = words.map((word) => bestHit(word, fields))
  const answered = words.filter((_word, at) => hits[at] !== null)

  if (answered.length === 0) return null
  if (answered.length !== words.length && !namedInFull(fields, answered)) return null

  return hits.reduce((total, hit) => total + (hit?.value ?? 0), 0)
}

/**
 * Every contract that answers the query, best first.
 *
 * The refusals are fetched whatever the query, because a refused contract is a result like any other
 * and its reason is what makes it one - answering `not installable` and nothing else would say the
 * catalogue has no opinion, when publishing the opinion is the point. It is one small answer over a
 * catalogue this size, and the day that stops being true it is fetched for the entries that need it.
 *
 * Nothing here reads a clock, a process or a directory, which is the property `command.ts` states for
 * this whole folder and which `search` is the first command to hold without even a project.
 */
export const search = (source: RegistrySource, query: string): Search => {
  const words = wordsOf(query)
  const entries = source.contractIndex().entries
  const refusals = source.refusals().refusals

  const results = entries
    .flatMap((entry) => {
      const score = scoreOf(entry, words)
      if (score === null) return []

      return [
        {
          address: entry.address,
          summary: entry.summary,
          exports: entry.exports.map((held) => held.name),
          installable: entry.installable,
          refusal: refusals.find((refusal) => sameContract(refusal.address, entry.address)) ?? null,
          score,
        },
      ]
    })
    .sort((first, second) =>
      first.score === second.score
        ? renderContract(first.address).localeCompare(renderContract(second.address))
        : second.score - first.score,
    )

  const unknown = words.filter((word) =>
    entries.every((entry) => bestHit(word, fieldsOf(entry)) === null),
  )

  return { query, results, unknownWords: [...new Set(unknown)] }
}
