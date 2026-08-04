import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { localSource } from './local-source.js'
import { renderSearch } from './report.js'
import { search } from './search.js'

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
const INDEX = SOURCE.contractIndex().entries

const firstFor = (query: string): string | null => {
  const [best] = search(SOURCE, query).results

  return best === undefined ? null : renderContract(best.address)
}

describe('finding a contract from what somebody typed', () => {
  /**
   * Every alias, verbatim, ranks its own contract first.
   *
   * Seventy assertions in one guard, because a failure has to name the alias and the contract in one
   * message: what a failure means is either that the alias is wrong or that the ranking is, and the
   * reader cannot tell which from a count.
   */
  it('every-declared-alias-finds-its-own-contract-first', () => {
    const missed = INDEX.flatMap((entry) =>
      entry.searchAliases
        .filter((alias) => firstFor(alias) !== renderContract(entry.address))
        .map((alias) => `${renderContract(entry.address)}: "${alias}" -> ${firstFor(alias)}`),
    )

    expect(missed).toEqual([])
    expect(INDEX.flatMap((entry) => entry.searchAliases).length).toBeGreaterThan(60)
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
      ['number/parse', 'number/parse@1'],
      ['number/parse@1', 'number/parse@1'],
      ['parseNumber', 'number/parse@1'],
      ['describeParseFailure', 'number/parse@1'],
      ['convert string to number', 'number/parse@1'],
      ['string to int', 'number/parse@1'],
      ['addDays', 'date/add@1'],
      ['add days to date', 'date/add@1'],
      ['subtract days from date', 'date/add@1'],
      ['date/add', 'date/add@1'],
      ['groupBy', 'array/group-by@1'],
      ['Map.groupBy', 'array/group-by@1'],
      ['group array by key', 'array/group-by@1'],
      ['levenshtein', 'string/levenshtein@1'],
      ['edit distance', 'string/levenshtein@1'],
      ['compare two strings', 'string/levenshtein@1'],
      ['did you mean', 'string/levenshtein@1'],
      ['leven', 'string/levenshtein@1'],
      ['slugify', 'string/slugify@1'],
      ['title to url', 'string/slugify@1'],
      ['remove accents from string', 'string/slugify@1'],
      ['seo friendly url', 'string/slugify@1'],
      ['convert a string to a number in javascript', 'number/parse@1'],
      ['how do I convert a string to a number', 'number/parse@1'],
      ['what is the edit distance between two strings', 'string/levenshtein@1'],
      ['I need to slugify a title for a url', 'string/slugify@1'],
      ['add days to a date in javascript', 'date/add@1'],
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
   */
  it('a-query-the-catalogue-cannot-answer-answers-nothing', () => {
    const nothing = [
      'debounce',
      'throttle',
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
        .map((query) => [query, search(SOURCE, query).results] as const)
        .filter(([, results]) => results.length > 0)
        .map(([query, results]) => `"${query}" -> ${results.length} results`),
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
    expect(search(SOURCE, '   ').results).toEqual([])
    expect(search(SOURCE, '- -').results).toEqual([])
  })

  /**
   * A word the catalogue has never heard is named, rather than guessed past.
   *
   * It is what turns a miss into something the reader can act on in one second, and it is the only
   * thing this command says about *why* it found nothing.
   */
  it('a-miss-names-the-words-no-contract-carries', () => {
    expect(search(SOURCE, 'deep clone').unknownWords).toEqual(['deep', 'clone'])
    expect(search(SOURCE, 'memoize the levenshtein').unknownWords).toEqual(['memoize'])
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
      const results = search(SOURCE, query).results

      expect(results.map((result) => renderContract(result.address))).toEqual([
        'string/levenshtein@1',
        'string/slugify@1',
        'number/parse@1',
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
    expect(firstFor('leven')).toBe('string/levenshtein@1')
    expect(firstFor('slugif')).toBe('string/slugify@1')
    expect(firstFor('arrays')).toBe('array/group-by@1')
    expect(firstFor('dates')).toBe('date/add@1')

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
    const [only, ...rest] = search(SOURCE, 'Map.groupBy').results

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
    expect(search(SOURCE, 'slugify').results.map((result) => result.refusal)).toEqual([null])
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
    const refused = renderSearch(search(SOURCE, 'Map.groupBy'))

    expect(refused).toContain('not installable')
    expect(refused).not.toContain('toopo add')

    expect(renderSearch(search(SOURCE, 'slugify'))).toContain('toopo add string/slugify')
  })

  /**
   * A summary too long for the screen says that it was cut.
   *
   * `date/add@1` is the one that reaches the limit - its summary carries the error convention as well
   * as the answer - and a sentence that stopped mid-thought with no mark would read as the whole of
   * what the contract claims.
   */
  it('a-cut-summary-says-that-it-was-cut', () => {
    expect(renderSearch(search(SOURCE, 'add days to date'))).toContain('...')
    expect(renderSearch(search(SOURCE, 'slugify'))).not.toContain('...')
  })
})
