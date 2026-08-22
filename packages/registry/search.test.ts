import { describe, it, expect } from 'vitest'

import { renderContract, sameContract } from './address.js'
import { localReadApi } from './local-read-api.js'
import type { ServedIndex, ServedIndexEntry, ServedRefusals } from './response.js'
import type { Search } from './search.js'
import { answers, phrasesOfferedBy, search, spreadOverTheCatalogue, wordsOf } from './search.js'

/**
 * How a ranking is put to the test when it has five things to rank.
 *
 * Three trials, and they do not measure the same thing. **The alias property** takes every phrase the
 * five contracts declare as a way of being found and requires it to find that contract first - which
 * is the first time `identity.searchAliases` has been more than documentation, a debt open since the
 * first session of this project. **The corpus** is queries somebody would actually type, several of
 * them deliberately touching two contracts at once, with the one that must win named. **The negative
 * half** is utilities this catalogue does not hold, and without it the other two are satisfied by a
 * search that returns everything.
 *
 * **What none of this measures is discoverability.** The corpus is written by whoever wrote the
 * ranking, so it measures coherence: that the search agrees with what the catalogue says about
 * itself. Nobody has ever typed anything into this command, there is no query log, and five contracts
 * cannot tell a good score from a lucky one. That is the limit, and it is written here rather than
 * left to be inferred from a green suite.
 */

/**
 * The two answers a search reads, built at the first question and kept.
 *
 * **It is the registry's own reader rather than either client's stand-in**, which is what this file
 * moving here is about: the matching rule is a function of `contract-index` and `refusals` and of
 * nothing else, so the trial holds those two answers and no port at all. There is no warming step and
 * no view that could quietly answer *the catalogue is empty*, because there is nothing between the
 * decision and the data.
 *
 * **It is lazy rather than taken at module load, and a battery is what says why.** Built at load,
 * this file cannot *start* when a mutant breaks the serialisation it reads - so instead of eleven red
 * guards there are eleven guards that were never collected, which is a report indistinguishable from
 * a smaller suite. Measured the first time this battery ran here: under `I-01` the registry suite
 * reported 359 tests where the unmutated arm reported 370, and `assertWholeSuiteRan` refused the run
 * on exactly that difference. Reached from inside a guard, the same mutant reddens the guard, which
 * is what a mutant is for.
 *
 * `localReadApi()` serialises five contracts and reads their files every time it is called, and these
 * trials ask a few hundred questions - measured on the installer's stand-in, a source per query took
 * the corpus past a thirty-second timeout - so it is built once and held.
 */
let held: { readonly index: ServedIndex; readonly refusals: ServedRefusals } | null = null

const theAnswers = (): { readonly index: ServedIndex; readonly refusals: ServedRefusals } => {
  if (held === null) {
    const registry = localReadApi()
    held = { index: registry.contractIndex(), refusals: registry.refusals() }
  }

  return held
}

/** `search` against those answers, so that each trial reads like the call it measures. */
const searching = (query: string): Search => {
  const { index, refusals } = theAnswers()

  return search(index, refusals, query)
}

const theIndex = (): readonly ServedIndexEntry[] => theAnswers().index.entries

/**
 * Which fields of an index entry hold a phrase somebody chose the contract to be found by.
 *
 * **This is the population of the alias trial, and it is declared rather than written out because a
 * hand-written union is what the next field falls out of.** Until ADR-0155 the trial swept
 * `entry.searchAliases`, which was every such phrase there was; that record gave the registry a
 * second place to put one, and a guard whose population is half its subject is green about the half
 * it kept. It is the class ADR-0152 closed hours earlier at `f776a43`, arriving again on the change
 * that would have caused it.
 *
 * Keyed by `keyof`, so a field added to `ServedIndexEntry` does not compile until somebody has said
 * whether it is one - the shape `CONTRACT_BINDING_NATURES`, `FIELD_MAP` and `THE_ENDPOINT_BEHIND`
 * already take. **What the compiler cannot do is judge the answer**: a field marked `null` that
 * really holds phrases leaves this population short and every guard below green, which is why
 * `every-phrase-an-entry-offers-is-a-phrase-the-search-reads` compares this with what `search.ts`
 * reads rather than trusting either alone.
 */
const A_WAY_OF_BEING_FOUND: Readonly<
  Record<keyof ServedIndexEntry, ((entry: ServedIndexEntry) => readonly string[]) | null>
> = {
  address: null,
  summary: null,
  domain: null,
  installable: null,
  /** An export name is a phrase a query meets, and not one chosen as a way of being found. */
  exports: null,
  searchAliases: (entry) => entry.searchAliases,
  alsoFoundBy: (entry) => entry.alsoFoundBy ?? [],
}

const waysOfBeingFound = (entry: ServedIndexEntry): readonly string[] =>
  Object.values(A_WAY_OF_BEING_FOUND).flatMap((read) => read?.(entry) ?? [])

const firstFor = (query: string): string | null => {
  const [best] = searching(query).results

  return best === undefined ? null : renderContract(best.address)
}

describe('finding a contract from what somebody typed', () => {
  /**
   * Every alias, verbatim, ranks its own contract first.
   *
   * One assertion per alias in one guard, because a failure has to name the alias and the contract in
   * one message: what a failure means is either that the alias is wrong or that the ranking is, and
   * the reader cannot tell which from a count.
   *
   * **This guard reviews the search and never the aliases, and it looks exactly like the opposite.**
   * An alias is in the index, so it retrieves the contract that declares it by construction - which is
   * all retrieval can mean - and a phrase promising something the contract refuses to do passes here
   * as comfortably as a true one. ADR-0023 carries the review that does catch one
   * and the eight it caught; nothing below can, and a reader who took this for an alias review would
   * be trusting the one measurement that cannot make it.
   *
   * **What makes it non-vacuous is a state rather than a count.** It used to assert that the
   * catalogue declares more than sixty aliases, which is a total across five contracts: it stays true
   * while one contract drops to none, it is a number that drifts every time a phrase is added or
   * removed, and the alias review took it from seventy-one to sixty-three at a stroke. What the guard
   * needs is that no contract put nothing into the trial - the day one does, every alias of it is
   * checked vacuously - and that is a claim which disappears with what it asserts instead of
   * needing a new figure.
   */
  it('every-declared-alias-finds-its-own-contract-first', () => {
    const missed = theIndex().flatMap((entry) =>
      waysOfBeingFound(entry)
        .filter((phrase) => firstFor(phrase) !== renderContract(entry.address))
        .map((phrase) => `${renderContract(entry.address)}: "${phrase}" -> ${firstFor(phrase)}`),
    )

    expect(missed).toEqual([])
    expect(
      theIndex().filter((entry) => waysOfBeingFound(entry).length === 0).map((entry) =>
        renderContract(entry.address),
      ),
    ).toEqual([])
  })

  /**
   * What the answer offers as a way of being found and what the search reads as one are the same set.
   *
   * **It exists because the guard above builds its population, and a population built out of the thing
   * under test cannot see itself shrink.** `A_WAY_OF_BEING_FOUND` is total over `ServedIndexEntry` by
   * the compiler, which forces a *row* for every field and can say nothing about whether the row is
   * right; `fieldsOf` in `search.ts` decides, separately and in another module, what a query actually
   * meets. Two statements, and this is their disagreement - which is the shape ADR-0152 arrived at one
   * folder over, and the reason it is written the same day the second source of phrases exists rather
   * than the day somebody notices the trial went quiet.
   *
   * **Both directions are a real event.** A field that holds phrases and is marked `null` here leaves
   * the trial sweeping less than it says while every result stays green - the silent shrink. A field
   * `fieldsOf` stops reading leaves the answer carrying phrases that reach nobody, which is dead weight
   * in the one document every query fetches and a term the registry learned for nothing.
   *
   * The neighbour is `a-word-only-a-summary-carries-answers-nothing-on-its-own`, and the two cannot see
   * each other's defect: that one is about which fields *count*, this one about which fields are *read*.
   */
  it('every-phrase-an-entry-offers-is-a-phrase-the-search-reads', () => {
    const ordered = (phrases: readonly string[]): readonly string[] => [...phrases].sort()

    const faults = theIndex().flatMap((entry) => {
      const offered = ordered(waysOfBeingFound(entry))
      const read = ordered(phrasesOfferedBy(entry))
      const what = renderContract(entry.address)

      return [
        ...offered
          .filter((phrase) => !read.includes(phrase))
          .map((phrase) => `${what}: "${phrase}" is offered and the search does not read it`),
        ...read
          .filter((phrase) => !offered.includes(phrase))
          .map((phrase) => `${what}: "${phrase}" is read and this trial does not sweep it`),
      ]
    })

    expect(faults).toEqual([])

    /**
     * And no row of the declaration is a claim nothing exercises, which is the other way it goes
     * thin: a field marked as a way of being found that every entry leaves empty is a row nobody
     * could ever have got wrong.
     */
    const unexercised = Object.entries(A_WAY_OF_BEING_FOUND)
      .filter(([, read]) => read !== null)
      .filter(([, read]) => !theIndex().some((entry) => (read?.(entry) ?? []).length > 0))
      .map(([field]) => field)

    expect(unexercised).toEqual([])
  })

  /**
   * A term the registry learned is one the catalogue did not already answer with that contract.
   *
   * **It is the executable half of `LearnedTerm.howItIsAsked`**, and the reason that reading is not a
   * field: a sentence saying *the catalogue answers nothing for this* is true on the morning somebody
   * writes it and unfalsifiable afterwards, where this re-takes it against the catalogue as it stands
   * on every run. ADR-0043 is the rule - compute it from the thing it claims, rather than asserting it
   * beside.
   *
   * The event is a term that buys nothing: the phrase already resolved to this contract, so the
   * registry curated a word it had, and the index - the one document every query fetches - grew for
   * it. It reddens on a publication as readily as on a bad term, which is the point: a seventh
   * contract can bring a word that makes a learned term redundant, and nobody would look.
   *
   * The catalogue-without-it is built by emptying that one entry's list rather than by rebuilding a
   * source, so `spreadOverTheCatalogue` sees the same catalogue a reader would have had - a word
   * stops telling the contracts apart as words arrive, and dropping the term has to drop it from the
   * spread as well.
   */
  it('a-learned-term-is-one-the-contract-was-not-already-found-by', () => {
    const { index, refusals } = theAnswers()
    const learned = theIndex().flatMap((entry) =>
      (entry.alsoFoundBy ?? []).map((term) => ({ entry, term })),
    )

    const bought = learned.filter(({ entry, term }) => {
      const without: ServedIndex = {
        ...index,
        entries: index.entries.map((one) =>
          one === entry
            ? { ...one, alsoFoundBy: (one.alsoFoundBy ?? []).filter((held) => held !== term) }
            : one,
        ),
      }
      const [best] = search(without, refusals, term).results

      return best === undefined || !sameContract(best.address, entry.address)
    })

    expect(learned.length).toBeGreaterThan(0)
    expect(
      learned
        .filter((one) => !bought.includes(one))
        .map(({ entry, term }) => `${renderContract(entry.address)}: "${term}" was already answered`),
    ).toEqual([])
  })

  /**
   * Queries a person would type, with the contract that has to come first.
   *
   * Four of them contain the word `string` and go to three different contracts, which is the whole
   * point of writing a corpus rather than one query per contract: a ranking that cannot tell
   * `string to number` from `compare two strings` is not a ranking.
   *
   * The last three are sentences with words no alias carries - `how`, `do`, `I`, `for`, `in` - and
   * they are the ones that measure the setting-aside rule rather than the matching.
   *
   * **The last eight are one request spelled eight ways, and they are here because all eight were
   * silent.** `number/parse@1` declares `int` and not `integer`, and `answers` lets a query shorten a
   * word and never extend one, so `integer` reached nothing at all. Measured at `91b7314`: written
   * with `int`, nought of the eight answered nothing; written with `integer`, **all eight did**. The
   * repair is `alsoFoundBy`, and it could not have been an alias - `identity` is frozen on a contract
   * published at `d3a5166`, which is the state ADR-0155 exists for.
   *
   * They are eight rather than one because the defect is a *family*: what these sentences share is
   * the word, and what they do not share is anything else, so a corpus carrying one of them would
   * measure the term and eight measure the word. Each is a sentence with the word in it, and
   * `string to int` two lines above is the pair that says it was ever a spelling.
   */
  it('a-corpus-of-real-queries-ranks-the-right-contract-first', () => {
    const corpus: readonly (readonly [string, string])[] = [
      ['number/parse', 'typescript/number/parse@1'],
      ['number/parse@1', 'typescript/number/parse@1'],
      ['typescript/number/parse@1', 'typescript/number/parse@1'],
      ['parseNumber', 'typescript/number/parse@1'],
      ['describeParseFailure', 'typescript/number/parse@1'],
      ['convert string to number', 'typescript/number/parse@1'],
      ['string to int', 'typescript/number/parse@1'],
      ['addDays', 'typescript/date/add@1'],
      ['add days to date', 'typescript/date/add@1'],
      ['subtract days from date', 'typescript/date/add@1'],
      ['date/add', 'typescript/date/add@1'],
      ['groupBy', 'typescript/array/group-by@1'],
      ['Map.groupBy', 'typescript/array/group-by@1'],
      ['group array by key', 'typescript/array/group-by@1'],
      ['levenshtein', 'typescript/string/levenshtein@1'],
      ['edit distance', 'typescript/string/levenshtein@1'],
      ['compare two strings', 'typescript/string/levenshtein@1'],
      ['did you mean', 'typescript/string/levenshtein@1'],
      ['leven', 'typescript/string/levenshtein@1'],
      ['slugify', 'typescript/string/slugify@1'],
      ['title to url', 'typescript/string/slugify@1'],
      ['seo friendly url', 'typescript/string/slugify@1'],
      ['round to two decimal places', 'typescript/number/round@1'],
      ['round half up', 'typescript/number/round@1'],
      ['convert a string to a number in javascript', 'typescript/number/parse@1'],
      ['how do I convert a string to a number', 'typescript/number/parse@1'],
      ['what is the edit distance between two strings', 'typescript/string/levenshtein@1'],
      ['I need to slugify a title for a url', 'typescript/string/slugify@1'],
      ['add days to a date in javascript', 'typescript/date/add@1'],
      ['javascript round decimal', 'typescript/number/round@1'],
      ['round a price to cents', 'typescript/number/round@1'],
      ['how do I round a number', 'typescript/number/round@1'],

      ['string to integer', 'typescript/number/parse@1'],
      ['convert a string to an integer', 'typescript/number/parse@1'],
      ['parse a string as an integer', 'typescript/number/parse@1'],
      ['turn a string into an integer', 'typescript/number/parse@1'],
      ['how do I convert a string to an integer', 'typescript/number/parse@1'],
      ['javascript string to integer', 'typescript/number/parse@1'],
      ['safely convert a string to an integer', 'typescript/number/parse@1'],
      ['read an integer from a string', 'typescript/number/parse@1'],
    ]

    expect(
      corpus
        .filter(([query, expected]) => firstFor(query) !== expected)
        .map(([query, expected]) => `"${query}" -> ${firstFor(query)}, wanted ${expected}`),
    ).toEqual([])
  })

  /**
   * The half that decides whether the other two mean anything.
   *
   * Every one of these is a utility somebody would plausibly look for and this catalogue does not
   * hold. A search that answered any of them with a contract would be the kind that always answers
   * something, which is the kind nobody believes twice.
   *
   * `sort array` and `flatten nested array` are the ones to watch: `array` is half of a contract's
   * own name, so they are what the rule *every word must be answered* is bought for.
   *
   * **`remove accents from string` is here because the alias review moved it here**, and it is the
   * only entry in this file whose place changed rather than was chosen. `string/slugify@1` used to
   * declare it and used to be ranked first for it, in the corpus above; its own description sends that
   * reader to a different function - `Straße` stays `straße`, and Cyrillic stays Cyrillic - so the
   * alias was a promise the result did not keep. Removing it moves the query from a wrong answer to no
   * answer, which is the outcome the whole file is built to prefer, and it is what an alias review is
   * worth when the catalogue holds no accent-stripper.
   *
   * **`parse yaml` left this list at the sixth contract and came back at ADR-0154**, which is the
   * only entry here to have done that, and the reason it left is the reason eleven more are now
   * beside it.
   *
   * It left because the rule stopped answering it: `number/round@1` gave the catalogue a third
   * `describe…Failure` export, so `describe` and `failure` went from two contracts to three and
   * crossed `TELLS_THE_CONTRACTS_APART`, `number/parse@1`'s exports field came down to `parse`
   * alone, and a field with one telling word is named by a query carrying that one word whatever
   * else the query carries. It came back because the setting-aside rule now costs a second word of
   * the field, so one word names nobody.
   *
   * **The seven beside it are the same defect and were found by looking for it.** `parse` was one
   * of eleven words that had become the sole telling word of some field - measured at `a705977`, the
   * count of such fields ran **0, 0, 0, 2, 15, 21** over this catalogue's six publications - and
   * every one of them opened its contract to any query carrying it. Answered before the repair and
   * silent after: **0, 1, 1, 1, 2, 8** over those same six publications.
   *
   * **Four more were found with them and are not in this list, which is the entry rule holding
   * against its author.** `number formatting`, `levenshtein automaton`, `slugify a blog post` and
   * `slug from an object id` are the same one-word doors and they were about to be written here
   * because they are - but this list says *the catalogue cannot answer this*, and of those four it
   * can: somebody typing `slugify a blog post` wants the function this catalogue holds. A query
   * enters here because a person would type it **and** because the catalogue has nothing for them,
   * never because it happens to fire the mechanism under repair. They are published as the cost in
   * ADR-0154 instead, where the reading is that the bound cannot tell them from the eight above and
   * silences both.
   *
   * **The ceiling was measured on both sides and left alone.** At three, `parse yaml` answers
   * nothing again and `remove accents from string` answers `number/parse@1` at a score of 80 - a
   * real request, wrongly answered, where the paragraph above records that removing its alias was
   * worth doing precisely to stop a wrong answer. Both values break exactly one query of this list
   * and three breaks the better one, so `TELLS_THE_CONTRACTS_APART` is not what this was repaired
   * with. That reading stands and is what a later one is taken against.
   */
  it('a-query-the-catalogue-cannot-answer-answers-nothing', () => {
    const nothing = [
      'debounce',
      'throttle',
      'remove accents from string',
      'deep clone',
      'deep merge',
      'sort array',
      'chunk array',
      'fetch json',
      'uuid',
      'capitalize',
      'retry with backoff',
      'format currency',
      'shuffle an array',
      'flatten nested array',
      'memoize',
      'pick keys from object',
      'javascript sort an array',
      'a deep clone of an object',
      'how do I sort an array',
      'is there a debounce',
      'parse yaml',
      'parse json',
      'round robin',
      'add to cart',
      'add an event listener',
      'float left',
      'fixed header',
      'distance between two cities',
    ]

    expect(
      nothing
        .map((query) => [query, searching(query).results] as const)
        .filter(([, results]) => results.length > 0)
        .map(([query, results]) => `"${query}" -> ${results.length} results`),
    ).toEqual([])
  })

  /**
   * A word no contract carries, standing for the one a reader brings in from their own problem.
   *
   * **It is invented rather than borrowed.** `yaml` would do the job today and would stop doing it
   * the day this catalogue holds a contract about YAML, at which point the guard below reddens on a
   * publication instead of on a defect. Nothing rests on the choice: the guard establishes that this
   * really is unheard of before it sweeps with it.
   */
  const A_WORD_THE_CATALOGUE_HAS_NEVER_HEARD = 'zzq'

  /**
   * No single word of this catalogue answers a query that also asked for something it cannot place.
   *
   * **It is the guard above written over a declaration instead of over a list**, and that is the
   * whole reason it exists beside it: the twelve requests up there are twelve somebody thought of,
   * and this is every word the catalogue declares - 91 of them at `a705977`. A seventh contract
   * brings its own words into this population with nobody editing anything, which is what the entry
   * this closes asked for and could not have: *one negative query of twenty broke at six contracts,
   * and nothing says what breaks at ten.*
   *
   * **It was red on eleven of those 91 before ADR-0154** - `add`, `distance`, `fixed`, `float`,
   * `int`, `levenshtein`, `number`, `parse`, `round`, `slug`, `slugify` - each of them the last
   * telling word of some field, each opening its contract to anything typed beside it.
   *
   * **What it does not claim is that two words are safe**, and the line is where the catalogue's own
   * evidence starts rather than where the arithmetic was convenient: two words the reader carried
   * out of one field are two things the contract chose and the query spelled, and no reading here
   * separates a second word that belongs from a second word that does not. `edit distance zzq`
   * answers `string/levenshtein@1`, deliberately.
   *
   * **The neighbour is `a-query-the-catalogue-cannot-answer-answers-nothing`, and the two are not one
   * claim.** That one is about requests, so it can be wrong about English; this one is about the
   * mechanism, so it can be wrong about nothing but the mechanism, and it says nothing at all about
   * whether the catalogue holds what a reader wants.
   */
  it('a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing', () => {
    const declared = [...spreadOverTheCatalogue(theIndex()).keys()]
    const brought = searching(A_WORD_THE_CATALOGUE_HAS_NEVER_HEARD)

    expect(declared.length).toBeGreaterThan(0)
    expect(brought.results).toEqual([])
    expect(brought.unknownWords).toEqual([A_WORD_THE_CATALOGUE_HAS_NEVER_HEARD])

    expect(
      declared
        .map(
          (word) =>
            [word, searching(`${word} ${A_WORD_THE_CATALOGUE_HAS_NEVER_HEARD}`).results] as const,
        )
        .filter(([, results]) => results.length > 0)
        .map(([word, results]) => `"${word}" -> ${results.length} results`),
    ).toEqual([])
  })

  /**
   * The same request, worded another way, answers the same contract.
   *
   * **This is the half the corpus above cannot measure, because the corpus is written by whoever
   * wrote the rule.** Every pair here is one query this catalogue already answers and one rewording
   * of it that introduces **no word the catalogue has never heard** - which the second assertion
   * requires rather than trusts, so a pair cannot pass by smuggling in an unknown word and being
   * excused for it.
   *
   * Measured before it was written: thirteen of nineteen ordinary descriptions answered nothing. The
   * cause was a bound that asked the reader to reproduce a label down to its prepositions -
   * `string to number` was found by `convert a string to a number` and not by `turn a string into a
   * number`. All three pairs here answered nothing on the left of that repair.
   *
   * **Three pairs and not thirty, and the shortness is the measurement rather than laziness.** Of
   * nineteen rewordings written for the trial, most bring in a word this catalogue has never heard -
   * `read`, `strict`, `parsing`, `user`, `onto`, `some` - which puts them outside what this guard
   * claims, and several of the rest already answered. Three is what was left after the second
   * assertion below threw out the ones that would have passed by smuggling a word in. **The guard
   * caught them rather than a reader**: they were written into this file, run, and refused.
   *
   * **What it does not claim is that any rewording is answered.** A word this catalogue declares
   * nowhere - `tolerance`, `spelling`, `maths` - answers nothing and should, and that is a missing
   * alias rather than a missing rule. The second assertion is what keeps this guard about the rule.
   *
   * **It gained a second job at ADR-0154 and it is the only guard that can hold it.** All three of
   * these rewordings leave a word out *and* bring one in, so they are where the two allowances meet -
   * which is what makes them the ceiling on `A_SET_ASIDE_WORD_IS_PAID_FOR_WITH`. Seen red at three,
   * on `turn a string into a number` and `string into number`; seen red again when `carriedFrom` was
   * made to count only the words that tell the contracts apart, which is the same two. The floor
   * below is held by the guard above; this is what holds it from above.
   */
  it('a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers', () => {
    const rewordings: readonly (readonly [string, string])[] = [
      ['convert string to number', 'turn a string into a number'],
      ['convert string to number', 'string into number'],
      ['group array by key', 'group an array with a key'],
    ]

    expect(
      rewordings
        .filter(([first, again]) => firstFor(again) !== firstFor(first))
        .map(([first, again]) => `"${again}" -> ${firstFor(again)}, as "${first}" -> ${firstFor(first)}`),
    ).toEqual([])

    expect(
      rewordings
        .map(([, again]) => [again, searching(again).unknownWords] as const)
        .filter(([, unknown]) => unknown.length > 0)
        .map(([again, unknown]) => `"${again}" brings in ${unknown.join(', ')}`),
    ).toEqual([])
  })

  /**
   * A word only a summary carries answers nothing on its own.
   *
   * **The population is read off the index rather than listed here**, which is what makes this a
   * statement about the rule and not about eighteen words somebody thought of: it is every word some
   * contract's summary holds and no contract's name, export or alias does. A summary is prose a
   * contract happens to be described by, and `search.ts` has said since it was written that covering
   * one is not a statement about anything - it just did not say it about the branch where every word
   * of the query happened to be answered.
   *
   * Measured on what that cost: `toopo search a` returned all four contracts, `to` three, `in` two -
   * 37 results over eighteen bare function words, on a command whose subject is that a search which
   * always answers something is the one nobody believes twice.
   *
   * The population is asserted non-empty, because a guard that swept nothing would pass here exactly
   * as loudly as one that swept everything.
   */
  it('a-word-only-a-summary-carries-answers-nothing-on-its-own', () => {
    const declared = [...spreadOverTheCatalogue(theIndex()).keys()]
    const onlyDescribed = [
      ...new Set(theIndex().flatMap((entry) => wordsOf(entry.summary))),
    ].filter((word) => !declared.some((held) => answers(word, held)))

    expect(onlyDescribed.length).toBeGreaterThan(20)
    expect(
      onlyDescribed
        .map((word) => [word, searching(word).results] as const)
        .filter(([, results]) => results.length > 0)
        .map(([word, results]) => `"${word}" -> ${results.length} results`),
    ).toEqual([])
  })

  /**
   * A query with no words in it answers nothing rather than everything.
   *
   * **Found by the battery**: the check that a contract answering none of the query's words is not a
   * result was written for the ordinary case and is unreachable there - a query whose words are all
   * unanswered already fails the rule above it. The one input that reaches it is the query with no
   * words at all, where every contract scores zero and every contract would be returned. The grammar
   * refuses an empty `search`, so nobody meets it through the command; the function is public and
   * answers for itself.
   */
  it('a-query-with-no-words-answers-nothing', () => {
    expect(searching('   ').results).toEqual([])
    expect(searching('- -').results).toEqual([])
  })

  /**
   * A word the catalogue has never heard is named, rather than guessed past.
   *
   * It is what turns a miss into something the reader can act on in one second, and it is the only
   * thing this command says about *why* it found nothing.
   */
  it('a-miss-names-the-words-no-contract-carries', () => {
    expect(searching('deep clone').unknownWords).toEqual(['deep', 'clone'])
    expect(searching('memoize the levenshtein').unknownWords).toEqual(['memoize'])
  })

  /**
   * The ordering, on the only queries this catalogue gives it anything to order.
   *
   * **This guard exists because inverting the comparator broke nothing.** Every one of the seventy
   * aliases and every one of the twenty-seven corpus queries answers exactly one contract - measured,
   * nought of eighty-nine returns two - so both trials above pass just as well backwards. That is a
   * fact about the matching rule rather than a gap in them: a rule that requires every word to be
   * answered resolves almost everything to one contract, and what is left to rank is the vague query.
   *
   * Of the 161 distinct words the index carries, 25 answer more than one contract and 7 carry a score
   * that tells them apart. Four of those seven are `a`, `by`, `from` and `to`; one is `javascript`.
   * **Two are real queries, and they are these.** A `string` that put `number/parse@1` above the two
   * contracts with `string` in their own name would be ranking an alias above a name.
   *
   * So the honest statement about this ordering is that it is nearly unreachable on a catalogue of
   * five, and that what makes it so is the precision of the matching rather than anything clever
   * here. It is measured on what there is.
   */
  it('a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias', () => {
    for (const query of ['string', 'strings']) {
      const results = searching(query).results

      expect(results.map((result) => renderContract(result.address))).toEqual([
        'typescript/string/levenshtein@1',
        'typescript/string/slugify@1',
        'typescript/number/parse@1',
      ])
      expect(results.at(-1)?.score).toBeLessThan(results[0]?.score ?? 0)
    }
  })

  /**
   * A shortening and a plural are answered; a typo and a longer word are not.
   *
   * The last four are the ones this guard exists for. A symmetric prefix - either word starting the
   * other - was written first and measured: it answered `stringify` with all three contracts carrying
   * `string`, and `datepicker` and `dateline` with `date/add@1`. Those are the plausible-but-wrong
   * hits the whole file is built to refuse, so a query may shorten a word the catalogue carries and
   * may never extend one.
   */
  it('a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not', () => {
    expect(firstFor('leven')).toBe('typescript/string/levenshtein@1')
    expect(firstFor('slugif')).toBe('typescript/string/slugify@1')
    expect(firstFor('arrays')).toBe('typescript/array/group-by@1')
    expect(firstFor('dates')).toBe('typescript/date/add@1')

    expect(firstFor('levenshtien')).toBe(null)
    expect(firstFor('slugfy')).toBe(null)
    expect(firstFor('stringify')).toBe(null)
    expect(firstFor('datepicker')).toBe(null)
  })

  /**
   * The refused contract is found, is marked, and carries the argument the catalogue decided on.
   *
   * Somebody typing `Map.groupBy` is best answered by *the language ships this now*, and that
   * sentence exists in exactly one place - the refusals answer. A result saying `not installable` and
   * nothing else would tell them the catalogue had no opinion.
   */
  it('a-refused-contract-is-found-with-the-reason-it-was-refused', () => {
    const [only, ...rest] = searching('Map.groupBy').results

    expect(rest).toEqual([])
    expect(only?.installable).toBe(false)
    expect(only?.refusal?.decidedAgainst).toBe('permanent rule 7 - nothing trivial in the catalogue')
    expect(only?.refusal?.measurement).toContain('Map.groupBy answers what this contract requires')
  })

  /**
   * An installable contract carries no refusal, which is the other direction of the guard above.
   *
   * Without it, a search that attached the one refusal the catalogue holds to every result would pass
   * everything else here.
   */
  it('an-installable-contract-carries-no-refusal', () => {
    expect(searching('slugify').results.map((result) => result.refusal)).toEqual([null])
  })
})
