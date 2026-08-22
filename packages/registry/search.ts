/**
 * From what somebody typed to the contracts that answer it.
 * ADR-0035 is what a search may answer, and the one rule under which it answers nothing; ADR-0136 is
 * the two bounds that replaced its single one, and the cliff those two sides of it were; ADR-0154 is
 * why a word left out and a word brought in are now charged separately.
 *
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
 * name one of its own names, exports or aliases - with more than one word of it.** Setting a word
 * aside can only widen a query, and this is what the widening is paid for with - the remainder has to
 * name something the contract declares, which `array` alone does not do for `array/group-by@1` and
 * `convert string to number` does do for `number/parse@1`.
 *
 * **The last clause of that sentence is ADR-0154 and it was missing for two contracts.** Naming a
 * field was decided by which of its words tell the contracts apart, and that set shrinks as the
 * catalogue grows - so `describeParseFailure` came down to `parse` alone at the sixth contract, and
 * `parse yaml` was answered by a function that converts strings to numbers. The allowance being spent
 * was the one written for a word the query *omits*, and what it was being spent on was a word the
 * query *adds*. See `namedWellEnoughToSetAWordAside`.
 *
 * A summary cannot be what is named, and that is the same argument again: a summary is prose a
 * contract happens to be described by, so covering it is not a statement about anything.
 *
 * ---------------------------------------------------------------------------
 * *Name it in full* was the wrong half of that sentence, and a reader paid for it
 * ---------------------------------------------------------------------------
 *
 * That rule read *name one of them **in full*** until it was measured against the descriptions
 * people actually write. It required the query to carry every word of a field, connecting words and
 * all - so `string to number` was named by `convert a string to a number` and **not** by `turn a
 * string into a number`, which is the same request with a different verb and not one unknown word in
 * it. Measured over nineteen ordinary descriptions of these five functions: **six answered, thirteen
 * did not**, and several of the thirteen were a working query with one word changed.
 *
 * The bound was right and its direction was not. It was stated on the registry's phrasing, so a
 * reader had to have guessed the label down to its prepositions; what it is stated on now is what a
 * field's words *establish*, which the catalogue itself says by how many contracts declare them. See
 * `namedByWhatTellsThemApart`. Nothing here is a list of words to ignore - that was refused when this
 * file was written and it stays refused, because a list decides which words carry meaning and a count
 * observes it.
 *
 * **What it does not repair is a word the catalogue declares nowhere.** `typo tolerance`,
 * `spelling suggestion` and `date maths` still answer nothing, and under this file's own rule that is
 * a missing alias rather than a missing rule. The repair is closed: `identity.searchAliases` is
 * inside the frozen half, and four of the five contracts are published. `CLAUDE.md` carries it.
 *
 * ---------------------------------------------------------------------------
 * What is searched, and why the description is not
 * ---------------------------------------------------------------------------
 *
 * The index and nothing else: the rendered address, the export names, the search aliases, the terms
 * the registry learned, the summary and the language. `ServedIndexEntry` is the answer fetched
 * before a query is answered and says of itself that it is deliberately small - measured, the five
 * contracts indexed to 3 106 bytes while their descriptions alone are 6 187, so carrying them would
 * triple the one document every search pays for.
 *
 * That is not a limit accepted grudgingly. **The aliases are the searchable surface of the
 * description**: a query only the description could have answered is an alias the contract is
 * missing, and the repair belongs where an alias belongs.
 *
 * **Where that is depends on whether the contract is published, and until ADR-0155 there was one
 * answer and it was wrong for five of the six.** `identity.searchAliases` is inside
 * `contractSnapshot`, so on a published contract the repair this file prescribed could not be
 * carried out by anybody - which is a prescription and not a repair. What a contract cannot say,
 * the registry now says beside it: `alsoFoundBy` is standing, so a phrase can be learned under a
 * frozen address, and it is read here as an alias because that is what it is.
 *
 * ---------------------------------------------------------------------------
 * No tolerance for a typo, deliberately
 * ---------------------------------------------------------------------------
 *
 * A misspelling answers nothing. Edit distance would answer *something* for every input ever typed,
 * which is the property above given away for a convenience. The catalogue holds a `string/levenshtein`
 * whose reference implementation is a few folders away, and calling it from here was refused: it would
 * buy the behaviour this file exists to refuse.
 *
 * **That refusal used to have a second reason and this file outlived it.** While the matching rule
 * lived in `packages/cli/`, reaching for the implementation would also have taken that folder across
 * the frontier `packages/cli/source.ts` holds, where one module and only one may reach into the
 * working tree. This is not in that folder any more, so the second reason is gone and the first is
 * untouched - which is the only one that ever decided it. It is written down rather than deleted,
 * because a refusal that quietly loses half its argument is one somebody reopens on the half that
 * remains.
 *
 * What is not a typo is a shortening - `leven` finds `levenshtein` - or an English plural, `arrays`
 * finding `array`. Both are bounded, and the bound was found by measurement: see `answers` below for
 * what a symmetric prefix admitted and why it is gone.
 */

import type { ContractAddress, Language } from './address.js'
import { renderContract, sameContract } from './address.js'
import type { ServedIndex, ServedIndexEntry, ServedRefusal, ServedRefusals } from './response.js'

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
 * A name is what the contract *is*, an export is what a caller writes, an alias is a phrase somebody
 * chose as a way of being found, a summary is prose that happens to contain the word. The ladder is
 * the order of how deliberate the field is, and nothing subtler than that is claimed for it.
 *
 * **`alias` is two fields and not one, deliberately.** A contract's own `searchAliases` and the terms
 * the registry learned afterwards are read here as one kind, because the ladder ranks how deliberate
 * a field is and both are exactly as deliberate - somebody chose the phrase either way. A kind of
 * its own would need a value here, a decision in `DELIBERATE` and a row in the spread, and all three
 * would have to equal `alias`'s to be right: a distinction that must never make a difference is not
 * a distinction. What tells them apart is *who wrote it and when*, which is a question about the
 * catalogue and not about a query. ADR-0155.
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
export const wordsOf = (text: string): readonly string[] =>
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
 * The name is the *rendered* address - `typescript/number/parse@1` - rather than the bare name, so
 * that typing the major answers instead of refusing: every word of a query has to be answered, and `1`
 * would otherwise be a word nothing answers. There is no separate domain field because the rendered
 * address already carries it.
 *
 * The learned terms sit beside the aliases rather than in a field of their own, for the reason
 * `AUTHORITY` gives: a query meets them as the same kind of thing. `phrasesOfferedBy` below is what
 * reads them back out, and it is the only statement of what this function treats as an alias.
 *
 * The rendering gaining the language put `typescript` into this field as well as into the one below,
 * and that is worth a sentence rather than a repair. The two are not one fact restated: the name field
 * answers somebody who pasted an address off a contract page, the language field answers `js` and
 * `javascript`, which no address spells. A query matching both scores twice, which is right - it named
 * the language two ways.
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
    ...(entry.alsoFoundBy ?? []).map((learned) => ({
      kind: 'alias' as const,
      text: learned,
      words: wordsOf(learned),
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
export const answers = (asked: string, held: string): boolean =>
  asked === held ||
  singular(asked) === singular(held) ||
  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked))

/**
 * Every phrase of this entry a query meets as one somebody chose the contract to be found by.
 *
 * Exported so that a guard can ask the search what it reads and compare that with what the answer
 * declares, which are two statements and not one -
 * `every-phrase-an-entry-offers-is-a-phrase-the-search-reads` is their disagreement. Without it the
 * alias trial would build its population out of the very function a defect would narrow, which is
 * the shape ADR-0152 closed one folder over the same day, and the shape this file would have grown
 * hours later.
 */
export const phrasesOfferedBy = (entry: ServedIndexEntry): readonly string[] =>
  fieldsOf(entry)
    .filter((field) => field.kind === 'alias')
    .map((field) => field.text)

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
 * The fields somebody chose as a way of being found, as against the ones a contract merely has.
 *
 * Covering a summary says nothing, because a summary is not a thing anybody chose; covering the
 * language says less, because every contract here answers it yes.
 */
const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>(['name', 'export', 'alias'])

/**
 * How many contracts declare each word, counted over the deliberate fields and read off the index.
 *
 * It is derived from the catalogue rather than typed, which is the whole reason it may exist at all:
 * a list of words to ignore decides once and invisibly which words carry meaning, and that was
 * refused. This decides nothing - it counts. A word four contracts declare is a word that separates
 * none of them, and the catalogue is what says which words those are.
 */
export type WordSpread = ReadonlyMap<string, number>

export const spreadOverTheCatalogue = (entries: readonly ServedIndexEntry[]): WordSpread => {
  const spread = new Map<string, number>()

  for (const entry of entries) {
    const declared = fieldsOf(entry).filter((field) => DELIBERATE.has(field.kind))

    for (const word of new Set(declared.flatMap((field) => field.words))) {
      spread.set(word, (spread.get(word) ?? 0) + 1)
    }
  }

  return spread
}

/**
 * The most contracts a word may be declared by and still say which one is meant.
 *
 * **Both sides of it are pinned by a trial rather than chosen.** At one, `parse yaml` is admitted,
 * which the negative half exists to refuse. At three and above, the silence this constant was
 * introduced to remove comes straight back, 6 of 19 descriptions answered instead of 12. Two is the
 * only value the measurement leaves.
 *
 * **It is not in a gap of the distribution, and saying so would be the easier sentence.** Over the
 * five: 68 words are declared by one contract, three by two - `describe`, `failure`, `safe` - three
 * by three - `from`, `string`, `to` - and two by all five, `1` and `typescript`. The ceiling cuts
 * between two adjacent classes; the one empty class is four, which is nowhere near it. So what
 * justifies the value is the trial on either side of it and not the shape of the counts, and the
 * counts are published here because they are what a later reading is taken against.
 */
const TELLS_THE_CONTRACTS_APART = 2

const tellsThemApart = (spread: WordSpread, word: string): boolean =>
  (spread.get(word) ?? 0) <= TELLS_THE_CONTRACTS_APART

/**
 * How many telling words a field needs before the query may leave one of them out.
 *
 * **Counting what a word establishes is not enough on its own, and one query is what says so.**
 * `by` is declared by `array/group-by@1` alone, so it separates that contract from every other and is
 * as telling as a word gets - and in `group array by key` it is doing the work of `with`. So
 * `group an array with a key` brings in no word the catalogue has never heard, asks for exactly the
 * thing that contract does, and was answered by nothing.
 *
 * **The size condition is what keeps the allowance from being a hole, and it is measured rather than
 * chosen.** Let a field of any size keep one word back and the negative half breaks in the same
 * trial: `javascript sort an array` and `parse yaml` are both admitted, and
 * `convert a string to a number in javascript` stops resolving to the contract it names. Three is
 * where an allowance of one is still a minority of what was asked for.
 */
const A_FIELD_MAY_KEEP_ONE_BACK_FROM = 3

/**
 * **Which** of a field's words the query has to carry: the ones that say who is meant.
 *
 * **The direction is the repair, and what it drops is a field's connecting words.** This asked, until
 * it was measured, that the query carry *every* word of a deliberate field - so `string to number`
 * was found by `convert a string to a number` and not by `turn a string into a number`, which is the
 * same request with a different verb. The bound existed to stop the setting-aside rule widening a
 * query for free, and it was written on the registry's phrasing: a reader had to have guessed the
 * label, down to its prepositions.
 *
 * So the field's words are read for what they establish. `to` is declared by four of the six
 * contracts and separates none of them; `number` is declared by two and separates them from the rest.
 * A query that carries `string` and `number` has named `string to number` whether or not it happened
 * to spell the preposition, and a query that carries only `array` has not named `array/group-by` -
 * which is what keeps `sort array` answering nothing.
 *
 * A field with nothing that tells the contracts apart names nobody, which is why the emptiness is
 * refused rather than allowed to pass vacuously.
 *
 * **This answers one question and `carriedFrom` answers the other**, which is the shape ADR-0154
 * separated: what may be missing is decided here, how much has to be there is decided beside it, and
 * until that record the second question was being answered by this one.
 */
const namedByWhatTellsThemApart = (
  field: Field,
  asked: readonly string[],
  spread: WordSpread,
): boolean => {
  const telling = field.words.filter((word) => tellsThemApart(spread, word))
  if (telling.length === 0) return false

  const carried = telling.filter((word) => asked.some((one) => answers(one, word)))

  return telling.length >= A_FIELD_MAY_KEEP_ONE_BACK_FROM
    ? carried.length >= telling.length - 1
    : carried.length === telling.length
}

/**
 * **How much** of a field the query carried: its distinct words, connecting ones and all.
 *
 * Every word and not only the telling ones, which is measured rather than tidy. `string` is declared
 * by three contracts and tells none of them apart, so `string to number` has one telling word left -
 * and `string into number` carries two of that field's three words, which is somebody naming it.
 * Counting the telling ones instead refuses that rewording, and refusing it is the defect ADR-0136
 * was written to remove.
 *
 * **Distinct, and nothing in this catalogue distinguishes that from counting the repeats.** Removing
 * the deduplication leaves all twelve guards of this trial green, so the line is declared rather than
 * measured: it is reached only by a field that spells its *one* telling word twice - `number to
 * number` would be one - because any field with two telling words is already named by two distinct
 * carried words and any field with three is named by at least two. `convert a string to a number`
 * spells `a` twice and cannot reach it, having `convert` and `number` to be named by.
 *
 * It is kept for what that event costs rather than for what it catches now: a field of that shape is
 * a one-word door, which is the defect ADR-0154 exists to close, and nothing would report it.
 */
const carriedFrom = (field: Field, asked: readonly string[]): number =>
  new Set(field.words.filter((word) => asked.some((one) => answers(one, word)))).size

/**
 * How many words of the field it names a query has to carry before it may set a word aside.
 *
 * **One word is not a name, and that is the whole of it.** It is `sort array` one floor down: `array`
 * does not name `array/group-by@1` because a word a field *contains* is not a word that names it, and
 * a query reaching a contract through a single word of a single field is in exactly that position.
 *
 * **Both sides are pinned by a trial, and the value is the only one the measurement leaves.** At one
 * - which is to say with no floor at all, the rule as it stood - eight requests a person types are
 * answered by a contract that holds nothing for them: `parse yaml`, `parse json`, `round robin`,
 * `add to cart`, `add an event listener`, `float left`, `fixed header` and
 * `distance between two cities`. At three, `how do I round a number` stops resolving and two of the
 * three rewordings break. At four, three corpus queries and all three rewordings break.
 *
 * **What it silences beside them is published rather than left to be found**: `number formatting`,
 * `levenshtein automaton`, `slugify a blog post` and `slug from an object id` are the same shape and
 * this catalogue could have answered them. Nothing here separates the two sets - `blog` and `robin`
 * are both words no contract carries - so the choice was never which to keep but which way both go,
 * and a wrong answer is worse than a silence that names the word it could not place. ADR-0154 holds
 * the reading and says whose call it is to revisit.
 *
 * **It is not a threshold on how much of the query was understood**, and that was measured before
 * this was written: requiring the contract to have answered more words than it set aside leaves four
 * of the twelve, because the function words of a longer request pad the count - `add to cart` reaches
 * a majority on `add` and `to`. What separates the twelve from every query that must answer is not
 * how much of the *query* was met but how much of the *field* was named.
 */
const A_SET_ASIDE_WORD_IS_PAID_FOR_WITH = 2

/**
 * Whether the query named a contract well enough to be allowed a word that contract cannot answer.
 *
 * ---------------------------------------------------------------------------
 * Two questions, and one of them used to be answered by the other
 * ---------------------------------------------------------------------------
 *
 * A query may **leave a word out** - the preposition of a label nobody memorised - and it may **bring
 * a word in** that this contract has nothing to say about. Those are different things, and until
 * ADR-0154 the second was charged to the allowance written for the first: `scoreOf` asked
 * `namedByWhatTellsThemApart` whenever a word had been set aside, and that function's whole subject
 * is omission. So an addition cost nothing at all, and what it cost nothing *of* was a budget that
 * shrinks: a word stops telling the contracts apart as the catalogue grows, so a field's telling
 * words fall away until one is left and that one word opens the contract to any query carrying it.
 *
 * Measured over this catalogue's own six publications, the count of deliberate fields left with a
 * single telling word runs **0, 0, 0, 2, 15, 21**, the eight requests above are answered
 * **0, 1, 1, 1, 2, 8**, and the four beside them **0, 0, 0, 1, 4, 4**. The sixth contract doubled the
 * total, and nothing about that was the sixth contract's doing.
 *
 * So the two questions are asked separately here. `namedByWhatTellsThemApart` decides which of the
 * field's words may be missing; `carriedFrom` decides how many had to be there. The conjunction is
 * per field rather than over the union of them, and that too was measured: `add to cart` has no field
 * it names *and* carries two words of, but `add` and `to` do sit together in one alias of
 * `date/add@1`, so a rule that took the two clauses from different fields admits it.
 */
const namedWellEnoughToSetAWordAside = (
  fields: readonly Field[],
  asked: readonly string[],
  spread: WordSpread,
): boolean =>
  fields.some(
    (field) =>
      DELIBERATE.has(field.kind) &&
      namedByWhatTellsThemApart(field, asked, spread) &&
      carriedFrom(field, asked) >= A_SET_ASIDE_WORD_IS_PAID_FOR_WITH,
  )

/**
 * What a screen shows about one contract: everything except why it was ranked.
 *
 * It is a type of its own because two screens show it. A search result is one of these with a score;
 * the catalogue listing - `toopo search` with no words - is one of these and nothing else, because
 * there is no query and therefore nothing to rank. Without the split, listing the catalogue would mean
 * inventing a score for every entry, which is a number that means nothing sitting in a field whose
 * whole purpose is to mean something.
 */
export type Displayed = {
  readonly address: ContractAddress
  readonly summary: string
  readonly exports: readonly string[]
  readonly installable: boolean
  /** Why the catalogue decided against it, for a contract that carries a refusal. */
  readonly refusal: ServedRefusal | null
}

export type Result = Displayed & {
  readonly score: number
}

/**
 * One index entry as a screen shows it, with the catalogue's own refusal attached where there is one.
 *
 * Here rather than at the two call sites because attaching a refusal to the *wrong* contract is a
 * defect with no symptom - every result carries a plausible-looking reason - and one of the two
 * screens would have to be trusted to have got it right on its own.
 */
export const displayed = (
  entry: ServedIndexEntry,
  refusals: readonly ServedRefusal[],
): Displayed => ({
  address: entry.address,
  summary: entry.summary,
  exports: entry.exports.map((held) => held.name),
  installable: entry.installable,
  refusal: refusals.find((refusal) => sameContract(refusal.address, entry.address)) ?? null,
})

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
 * leaves a word unanswered without naming something is not a weak result, it is not a result.
 *
 * ---------------------------------------------------------------------------
 * Two bounds, and each one is bought by exactly one measurement
 * ---------------------------------------------------------------------------
 *
 * **The first is that something the contract chose has to have answered.** Every word being answered
 * used to be enough on its own, and a summary is a word list nobody chose - so `toopo search a`
 * returned all four contracts, `to` three and `in` two, on a rule whose whole subject is that a
 * search which always answers something is the one nobody believes twice. Measured over eighteen
 * bare function words: **seventeen answered and they returned 37 results between them; five answer
 * now, and nine results.** What is left is five words the catalogue really does declare - `a`, `to`,
 * `by`, `from`, `two` - and killing those costs a legitimate answer, which is measured under
 * `a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias` rather than argued: the
 * candidate that removed them dropped `number/parse@1` from `string`.
 *
 * **The second is `namedWellEnoughToSetAWordAside`, and it is the silence.** Measured over nineteen
 * ordinary descriptions of what these five functions do, six were answered and thirteen were not,
 * several of them a working query with one word changed. Thirteen are answered now.
 *
 * **It was one clause when that was measured and it is two now**, which is ADR-0154 and not a third
 * bound: the branch is reached because the query brought a word in, and until that record the only
 * thing asked of it was a test about words left out. What the split costs is nothing on any of the
 * three trials and what it buys is twelve requests a person types.
 *
 * **Neither bound buys the other's half and together they cost nothing**, which is what says both are
 * load-bearing. On the corpus, on every declared alias, and on the negative half, all four
 * combinations - neither, each alone, both - answer 27/27, 62/62 and 21/21 alike.
 */
const scoreOf = (
  entry: ServedIndexEntry,
  words: readonly string[],
  spread: WordSpread,
): number | null => {
  const fields = fieldsOf(entry)
  const hits = words.map((word) => bestHit(word, fields))
  const answered = words.filter((_word, at) => hits[at] !== null)

  if (!hits.some((hit) => hit !== null && DELIBERATE.has(hit.field.kind))) return null
  if (
    answered.length !== words.length &&
    !namedWellEnoughToSetAWordAside(fields, answered, spread)
  ) {
    return null
  }

  return hits.reduce((total, hit) => total + (hit?.value ?? 0), 0)
}

/**
 * Every contract that answers the query, best first.
 *
 * **It takes the two answers rather than a registry, and that is what let it move here.** It read a
 * port until two consumers needed it - `HeldRegistry`, which is the installer's projection of the
 * installer's port - so a function over an index and a list of refusals was declared in terms of one
 * client's type, and the site could not call it without importing that client. What it needs is
 * `contract-index` and `refusals`, and those are the registry's own answers; asking for them directly
 * is both narrower and the reason there is one matching rule instead of two.
 *
 * The refusals are asked for whatever the query, because a refused contract is a result like any other
 * and its reason is what makes it one - answering `not installable` and nothing else would say the
 * catalogue has no opinion, when publishing the opinion is the point. It is one small answer over a
 * catalogue this size, and the day that stops being true it is asked for only where it is needed.
 *
 * Nothing here reads a clock, a process, a directory or a transport. That was a property
 * `packages/cli/command.ts` stated for its whole folder and it is now a property of the function
 * itself: there is no source to read, so there is nothing for one to do.
 */
export const search = (
  index: ServedIndex,
  refused: ServedRefusals,
  query: string,
): Search => {
  const words = wordsOf(query)
  const entries = index.entries
  const refusals = refused.refusals
  const spread = spreadOverTheCatalogue(entries)

  const results = entries
    .flatMap((entry) => {
      const score = scoreOf(entry, words, spread)
      if (score === null) return []

      return [{ ...displayed(entry, refusals), score }]
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
