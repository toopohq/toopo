import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { deciding, withoutAsking } from './fixpoint.js'
import { localSource } from './local-source.js'
import { renderCatalogue, renderSearch } from './report.js'
import type { Search } from './search.js'
import { answers, displayed, search, spreadOverTheCatalogue, wordsOf } from './search.js'
import type { HeldRegistry } from './source.js'

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
 * Built once for the whole file. `localSource()` serialises five contracts and reads thirty-seven
 * files every time it is called, and these trials ask it a hundred and forty questions - measured, a
 * source per query takes the corpus past a thirty-second timeout.
 */
const SOURCE = localSource()

/**
 * The answers a search needs, fetched once, so that every trial below is a synchronous decision.
 *
 * `search` asks a registry two questions and both are answered in the first round, so warming it with
 * one query warms it for all of them - and `answering` refuses rather than fabricating if that ever
 * stops being true, because a view that quietly answered *the catalogue is empty* would turn every
 * trial in this file green at once.
 */
const { arrived: ANSWERS } = await deciding(SOURCE, (held) => search(held, 'warm'))

const answering = <T>(decide: (held: HeldRegistry) => T): T => {
  const { answer, wanted } = withoutAsking(ANSWERS, decide)
  if (wanted.length > 0) throw new Error(`the warmed registry does not hold ${wanted.join(', ')}`)

  return answer
}

/** `search` against that registry, so that each trial reads like the call it measures. */
const searching = (query: string): Search => answering((held) => search(held, query))

const INDEX = answering((held) => held.contractIndex()).entries

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
    const missed = INDEX.flatMap((entry) =>
      entry.searchAliases
        .filter((alias) => firstFor(alias) !== renderContract(entry.address))
        .map((alias) => `${renderContract(entry.address)}: "${alias}" -> ${firstFor(alias)}`),
    )

    expect(missed).toEqual([])
    expect(
      INDEX.filter((entry) => entry.searchAliases.length === 0).map((entry) =>
        renderContract(entry.address),
      ),
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
      ['convert a string to a number in javascript', 'typescript/number/parse@1'],
      ['how do I convert a string to a number', 'typescript/number/parse@1'],
      ['what is the edit distance between two strings', 'typescript/string/levenshtein@1'],
      ['I need to slugify a title for a url', 'typescript/string/slugify@1'],
      ['add days to a date in javascript', 'typescript/date/add@1'],
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
    ]

    expect(
      nothing
        .map((query) => [query, searching(query).results] as const)
        .filter(([, results]) => results.length > 0)
        .map(([query, results]) => `"${query}" -> ${results.length} results`),
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
    const declared = [...spreadOverTheCatalogue(INDEX).keys()]
    const onlyDescribed = [
      ...new Set(INDEX.flatMap((entry) => wordsOf(entry.summary))),
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
   * The catalogue, which is what `toopo search` with no words answers now.
   *
   * It used to be refused - *`search` needs something to look for* - which answers "you must already
   * know what you want" to the first question anybody asks. **Listing is not searching**, and the two
   * are kept apart in the grammar rather than here: the guard below still requires a query with no
   * words in it to answer nothing, and it would be the first casualty of making an empty query mean
   * everything.
   *
   * The refused contract is listed and marked. A catalogue that showed only what it sells would be
   * publishing its own decisions nowhere, and *the language ships this now* is the most useful thing
   * this screen has to say to somebody about to write their own grouper.
   */
  it('the-catalogue-lists-every-contract-and-marks-the-one-it-refuses', () => {
    const screen = renderCatalogue(
      INDEX.map((entry) => displayed(entry, answering((held) => held.refusals()).refusals)),
    )

    expect(screen).toContain(`The catalogue holds ${INDEX.length} contracts.`)
    expect(INDEX.filter((entry) => !screen.includes(renderContract(entry.address)))).toEqual([])
    expect(screen).toContain('typescript/array/group-by@1   not installable')
    expect(screen).toContain('toopo add <domain>/<name>')
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

  /**
   * The screen for a contract that cannot be installed offers no command that would refuse.
   *
   * **This is the defect reading the first draft of this output caught by eye**, and it is a guard
   * rather than a memory: the draft printed `toopo add array/group-by` directly under a result it had
   * just labelled `not installable`. A reader who copies it gets a refusal, which is the product
   * contradicting itself on the first screen a stranger sees.
   */
  it('a-refused-contract-is-offered-no-install-line', () => {
    const refused = renderSearch(searching('Map.groupBy'))

    expect(refused).toContain('not installable')
    expect(refused).not.toContain('toopo add')

    expect(renderSearch(searching('slugify'))).toContain('toopo add string/slugify')
  })

  /**
   * A summary too long for the screen says that it was cut.
   *
   * `date/add@1` is the one that reaches the limit - its summary carries the error convention as well
   * as the answer - and a sentence that stopped mid-thought with no mark would read as the whole of
   * what the contract claims.
   */
  it('a-cut-summary-says-that-it-was-cut', () => {
    expect(renderSearch(searching('add days to date'))).toContain('...')
    expect(renderSearch(searching('slugify'))).not.toContain('...')
  })
})
