import { describe, it, expect } from 'vitest'

import { THE_INVOCATION, THE_WAYS_TO_RUN_IT, renderContract } from '../registry/address.js'
import type { Search } from '../registry/search.js'
import { search } from '../registry/search.js'
import { THE_EXAMPLES } from './chrome.js'
import { localSource } from './local-source.js'
import type { WhereTheCatalogueIs } from './searching.js'
import {
  THE_COPY_CONTROL_SAYS,
  THE_PANEL_IS_CLOSED,
  theAnswerIsStale,
  theArgumentsIn,
  theCommandWrittenFor,
  theCopyLabelFor,
  theRefusalShownFor,
  theSpellingShownFor,
  theWayAlreadyChosen,
  whatThePanelShows,
} from './what-a-control-says.js'

/**
 * What the controls of this site say, against the catalogue they say it about.
 *
 * ---------------------------------------------------------------------------
 * Every guard here is a claim that had no guard at all until ADR-0157
 * ---------------------------------------------------------------------------
 *
 * `start.ts` exports no name, so nothing could import it and no mutant could kill anything in it. Two
 * fifths of its executable text was a decision about what a visitor reads, written as an argument to
 * `setAttribute`; this file is where those decisions became reachable, and every `it` below is a
 * sentence that was previously true only because somebody had read it.
 *
 * ---------------------------------------------------------------------------
 * What these guards do not establish, said once here rather than in each of them
 * ---------------------------------------------------------------------------
 *
 * **They do not keep `start.ts` calling any of it.** A guard over `theSpellingShownFor` is green on
 * the day the control stops asking for it, which is the class this repository has five recorded
 * instances of. What is bought here is that the decisions are checkable at all.
 *
 * **That residue is `start.test.ts`'s now**, which runs each builder against a document and asks what
 * reached an element - so a control that stops asking, asks the wrong thing, or asks at the wrong
 * moment reddens there. The two files are one claim each: a decision is checked here, and that the
 * decision arrives is checked there. ADR-0165.
 *
 * ---------------------------------------------------------------------------
 * The catalogue is this working tree's, and the populations are asserted before they are swept
 * ---------------------------------------------------------------------------
 *
 * A guard over *every refused way* passes comfortably when there are none, and a guard over *every
 * unknown word* passes when the query happened to be answered. Each sweep below asserts that what it
 * is sweeping is not empty, which is the cheapest form of the rule this repository pays for most
 * often.
 */

const source = localSource()
const index = source.contractIndex()
const refusals = source.refusals()

const WHERE: WhereTheCatalogueIs = {
  index: '/api/contract-index.json',
  refusals: '/api/refusals.json',
  root: '/',
  examples: THE_EXAMPLES,
}

const asking = (query: string): Search => search(index, refusals, query)

/** A query this catalogue answers with something, so a guard about results has results. */
const ANSWERED = asking('turn a title into a url')

/** A query whose words the catalogue has never heard, so `unknownWords` is not empty. */
const UNHEARD = asking('yaml frontmatter')

describe('what the controls of this site say', () => {
  // -------------------------------------------------------------------------
  // The copy control
  // -------------------------------------------------------------------------

  /**
   * What a screen reader is told the button copies is the command, and never the word on the button.
   *
   * The defect is not hypothetical: `textContent` on the install block is the command *plus every
   * control appended to it*, so a label read off the button after it lands offers a reader
   * `npx toopo add string/slugifycopy`. The label is therefore built from the command it was handed.
   */
  it('the-copy-control-names-the-command-and-never-itself', () => {
    const command = `${THE_INVOCATION} add string/slugify`
    const label = theCopyLabelFor(command)

    expect(label).toContain(command)
    expect(label).not.toContain(THE_COPY_CONTROL_SAYS.atRest)
    expect(theCopyLabelFor('bunx toopo add date/add')).toContain('bunx toopo add date/add')
  })

  /**
   * A clipboard that refused says so, and a clipboard that worked says so, in words a reader reads.
   *
   * **A control that silently stays as it was is the failure this exists to refuse.** A write can be
   * refused - a page without focus, a permission withheld - and the reply to that has to be different
   * from the resting state or the reader is told nothing at all. It is a word rather than a colour,
   * which is the rule the stylesheet states for this site's accent and which holds here for a second
   * reason: a reader who cannot tell two colours apart still reads the word.
   */
  it('every-word-the-copy-control-carries-says-something-the-others-do-not', () => {
    const said = Object.values(THE_COPY_CONTROL_SAYS)

    expect(said.every((word) => word.length > 0)).toBe(true)
    expect(new Set(said).size).toBe(said.length)
  })

  // -------------------------------------------------------------------------
  // The choice of package manager
  // -------------------------------------------------------------------------

  /**
   * What follows the invocation is what the page already asked for, and nothing of the invocation.
   *
   * Built from `THE_INVOCATION` rather than typed, so the guard is about the relation and not about
   * one spelling of it.
   */
  it('what-follows-the-invocation-is-what-the-page-already-asked-for', () => {
    expect(theArgumentsIn(`${THE_INVOCATION} add string/slugify`)).toBe('add string/slugify')
    expect(theArgumentsIn(`${THE_INVOCATION} search a title`)).toBe('search a title')
    expect(theArgumentsIn(THE_INVOCATION)).toBe('')
  })

  /**
   * A command this control cannot take apart is one it refuses to rewrite.
   *
   * **The old spelling answered this wrongly and nothing could have said so.** `.split(' ').slice(2)`
   * on `yarn dlx toopo add x` returns `toopo add x`, so a block serving anything but the invocation
   * would have had its arguments silently mangled into the next command. It never happened, because
   * the served command is always the invocation - which is exactly the kind of correctness that stops
   * being true without an event.
   */
  it('a-command-this-control-cannot-take-apart-is-one-it-refuses-to-rewrite', () => {
    expect(theArgumentsIn('yarn dlx toopo add string/slugify')).toBeNull()
    expect(theArgumentsIn('')).toBeNull()
    expect(theArgumentsIn('add string/slugify')).toBeNull()
  })

  /**
   * The way the page already serves is the one the control opens marked, and it is exactly one.
   *
   * A spelling against a spelling, never against the whole command: written against the command first,
   * it marked nothing at all, because the command carries the arguments and `THE_INVOCATION` does not.
   */
  it('the-way-the-page-serves-is-the-one-the-control-opens-marked', () => {
    const chosen = THE_WAYS_TO_RUN_IT.filter(theWayAlreadyChosen)

    expect(chosen).toHaveLength(1)
    expect(chosen[0]?.spelling).toBe(THE_INVOCATION)
    expect(theWayAlreadyChosen({ manager: 'npm', spelling: `${THE_INVOCATION} add x` })).toBe(false)
  })

  /**
   * A way that runs carries no refusal, and a refused one carries the measurement that refused it.
   *
   * `null` and not the empty string, because the empty string is what the control writes into the
   * paragraph it also has to hide - so a refusal read as `''` is a paragraph shown empty rather than
   * a paragraph not shown.
   */
  it('a-refused-way-carries-its-measurement-and-a-way-that-runs-carries-nothing', () => {
    const refused = THE_WAYS_TO_RUN_IT.filter((way) => way.refusedBecause !== undefined)
    const running = THE_WAYS_TO_RUN_IT.filter((way) => way.refusedBecause === undefined)

    expect(refused.length).toBeGreaterThan(0)
    expect(running.length).toBeGreaterThan(0)
    expect(refused.map(theRefusalShownFor)).toEqual(refused.map((way) => way.refusedBecause))
    expect(running.map(theRefusalShownFor)).toEqual(running.map(() => null))
  })

  /**
   * A refused way shows the spelling that works, and never the one the reader chose.
   *
   * The reader said which manager they use; they did not ask to be handed a command that fails, and
   * the reason it fails is beside it in its own words.
   */
  it('a-refused-way-shows-the-spelling-that-works', () => {
    const refused = THE_WAYS_TO_RUN_IT.filter((way) => way.refusedBecause !== undefined)
    const running = THE_WAYS_TO_RUN_IT.filter((way) => way.refusedBecause === undefined)

    expect(refused.length).toBeGreaterThan(0)
    expect(running.length).toBeGreaterThan(0)
    expect(refused.map(theSpellingShownFor)).toEqual(refused.map(() => THE_INVOCATION))
    expect(running.map(theSpellingShownFor)).toEqual(running.map((way) => way.spelling))
  })

  /**
   * The command a reader is handed is the spelling shown, then what they had already asked for.
   *
   * The neighbour above decides *which* spelling; this one decides that the two halves are joined in
   * that order with one space, and it reddens on a swap or a lost separator where that one does not.
   */
  it('the-command-a-reader-is-handed-is-the-spelling-shown-then-what-they-asked-for', () => {
    const arguments_ = 'add string/slugify'

    for (const way of THE_WAYS_TO_RUN_IT) {
      const written = theCommandWrittenFor(way, arguments_)

      expect(written).toBe(`${theSpellingShownFor(way)} ${arguments_}`)
      expect(theArgumentsIn(written)).toBe(
        theSpellingShownFor(way) === THE_INVOCATION ? arguments_ : null,
      )
    }

    expect(THE_WAYS_TO_RUN_IT.length).toBeGreaterThan(1)
  })

  // -------------------------------------------------------------------------
  // The search in the masthead
  // -------------------------------------------------------------------------

  /**
   * A reader who is searching is never shown nothing.
   *
   * **A box that goes blank when a search fails is the failure the whole matching rule is built to
   * avoid**, arriving in the surface instead of in the rule. `nothing` is a state this decision can
   * name and never answers: it is what the control paints when the reader has *left*, which is a
   * different case and lives in `start.ts`.
   */
  it('a-reader-who-is-searching-is-never-shown-nothing', () => {
    const everyMoment = [
      whatThePanelShows(WHERE, { kind: 'was-not-asked' }),
      whatThePanelShows(WHERE, { kind: 'answered', found: ANSWERED }),
      whatThePanelShows(WHERE, { kind: 'answered', found: UNHEARD }),
      whatThePanelShows(WHERE, { kind: 'answered', found: asking('a') }),
      whatThePanelShows(WHERE, { kind: 'could-not-be-read', thrown: new Error('offline') }),
      whatThePanelShows(WHERE, { kind: 'could-not-be-read', thrown: 'a string nobody threw' }),
    ]

    expect(everyMoment.map((shows) => shows.kind)).not.toContain(THE_PANEL_IS_CLOSED.kind)
    expect(everyMoment).toHaveLength(6)
  })

  /**
   * A reader who has not typed meets the queries this catalogue answers, and an invitation to add one.
   *
   * Every example is measured to answer elsewhere; what this keeps is that they reach the panel at
   * all, which is what a control offering an empty list would quietly stop doing.
   */
  it('a-reader-who-has-not-typed-meets-the-queries-this-catalogue-answers', () => {
    const shows = whatThePanelShows(WHERE, { kind: 'was-not-asked' })

    expect(shows.kind).toBe('an-invitation')
    if (shows.kind !== 'an-invitation') return

    expect(shows.examples).toEqual(WHERE.examples)
    expect(shows.examples.length).toBeGreaterThan(0)
    expect(shows.said.length).toBeGreaterThan(0)
  })

  /**
   * A query nothing answers says which query it was, and which words no contract carries.
   *
   * Both halves, because a panel saying only *nothing found* is the answer a reader cannot act on -
   * the word that reached nobody is the one they would change.
   */
  it('a-query-nothing-answers-says-which-query-and-which-words', () => {
    expect(UNHEARD.results).toHaveLength(0)
    expect(UNHEARD.unknownWords.length).toBeGreaterThan(0)

    const shows = whatThePanelShows(WHERE, { kind: 'answered', found: UNHEARD })

    expect(shows.kind).toBe('no-answer')
    if (shows.kind !== 'no-answer') return

    const said = shows.said.join('\n')

    expect(said).toContain(UNHEARD.query)
    for (const word of UNHEARD.unknownWords) expect(said).toContain(word)
  })

  /**
   * A query whose every word is known and which no one contract carries is told that, in its own words.
   *
   * It reddens where the guard above it does not: a control printing the unknown words unconditionally
   * answers this reader `No contract mentions: ` with nothing after the colon, which reads as a defect
   * in the page rather than as an answer about the catalogue.
   */
  it('a-query-whose-every-word-is-known-is-told-that-and-not-an-empty-list', () => {
    const known = asking('slugify levenshtein')

    expect(known.results).toHaveLength(0)
    expect(known.unknownWords).toHaveLength(0)

    const shows = whatThePanelShows(WHERE, { kind: 'answered', found: known })

    expect(shows.kind).toBe('no-answer')
    if (shows.kind !== 'no-answer') return

    expect(shows.said.join('\n')).not.toContain('No contract mentions')
    expect(shows.said.every((one) => one.trim().length > 0)).toBe(true)
  })

  /**
   * A result links to the contract's own address, under the root the page resolved for itself.
   *
   * The root is the page's and not this module's: a contract page two levels down and the front page
   * hand over different ones, and a link built without it works on exactly one of them.
   */
  it('a-result-links-to-the-contracts-own-address-under-the-root-of-the-site', () => {
    const deep: WhereTheCatalogueIs = { ...WHERE, root: '../../' }
    const shows = whatThePanelShows(deep, { kind: 'answered', found: ANSWERED })

    expect(shows.kind).toBe('answers')
    if (shows.kind !== 'answers') return

    expect(shows.answers.length).toBeGreaterThan(0)
    expect(shows.answers).toEqual(
      ANSWERED.results.map((result) => ({
        href: `../../${renderContract(result.address)}/`,
        name: renderContract(result.address),
        summary: result.summary,
        mark: result.installable ? null : 'not installable',
      })),
    )
  })

  /**
   * A contract the catalogue turned down is shown and marked, never dropped from the answers.
   *
   * Dropping it is the defect `toopo search` already carries a mutant for, arriving on the surface
   * where somebody clicks: a reader searching for what this catalogue decided against is answered
   * *nothing* rather than *here is what we decided and why*.
   */
  it('a-contract-the-catalogue-turned-down-is-marked-and-still-shown', () => {
    const turnedDown = asking('group by')
    const installable = asking('string')

    expect(turnedDown.results.length).toBeGreaterThan(0)
    expect(turnedDown.results.every((result) => !result.installable)).toBe(true)
    expect(installable.results.length).toBeGreaterThan(0)
    expect(installable.results.every((result) => result.installable)).toBe(true)

    /**
     * **No query of this catalogue answers with both**, measured over eleven candidates at `17cc9bf`:
     * `array/group-by@1` is the only contract carrying a refusal and nothing reaches it beside another.
     * So the mixed list is assembled from the two real answers rather than met, and no contract is
     * invented to make it - what is exercised is the mapping over a list where the mark differs from
     * one row to the next, which is the branch a real catalogue will present the day it has two.
     */
    const mixed = {
      query: 'group by string',
      results: [...turnedDown.results, ...installable.results],
      unknownWords: [],
    }

    for (const found of [turnedDown, installable, mixed]) {
      const shows = whatThePanelShows(WHERE, { kind: 'answered', found })

      expect(shows.kind).toBe('answers')
      if (shows.kind !== 'answers') continue

      expect(shows.answers).toHaveLength(found.results.length)
      expect(shows.answers.map((answer) => answer.mark === null)).toEqual(
        found.results.map((result) => result.installable),
      )
      expect(shows.answers.every((answer) => answer.mark === null || answer.mark.length > 0)).toBe(
        true,
      )
    }
  })

  /**
   * A catalogue that could not be read says so in the failure's own words, wherever it has any.
   *
   * The address and the reason are what a reader can act on, and `TheCatalogueCouldNotBeReached`
   * carries both - so a panel substituting a sentence of ours for that one is a page hiding the one
   * thing it knows.
   */
  it('a-catalogue-that-could-not-be-read-says-so-in-the-failures-own-words', () => {
    const named = whatThePanelShows(WHERE, {
      kind: 'could-not-be-read',
      thrown: new Error('the catalogue at /api/contract-index.json could not be read: 503'),
    })
    const wordless = whatThePanelShows(WHERE, { kind: 'could-not-be-read', thrown: 7 })

    expect(named.kind).toBe('a-failure')
    expect(wordless.kind).toBe('a-failure')
    if (named.kind !== 'a-failure' || wordless.kind !== 'a-failure') return

    expect(named.said).toBe('the catalogue at /api/contract-index.json could not be read: 503')
    expect(wordless.said.length).toBeGreaterThan(0)
    expect(wordless.said).not.toBe(named.said)
  })

  /**
   * An answer about a query the reader has already moved on from is not shown.
   *
   * A search is a request per keystroke and the answers need not come back in order, so an answer is
   * shown only while the field still spells the question it was asked. The comparison is against the
   * trimmed field, because the query was trimmed before it was asked - untrimmed, a reader who typed a
   * trailing space would have every one of their answers dropped.
   */
  it('an-answer-about-a-query-the-reader-has-left-is-not-shown', () => {
    expect(theAnswerIsStale('slug', 'slug')).toBe(false)
    expect(theAnswerIsStale('  slug  ', 'slug')).toBe(false)
    expect(theAnswerIsStale('slugi', 'slug')).toBe(true)
    expect(theAnswerIsStale('', 'slug')).toBe(true)
  })
})
