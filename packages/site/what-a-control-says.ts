/**
 * What the controls of this site say, decided here and delivered by `start.ts`.
 * ADR-0157 is why the decision is separated from the delivery, and what that separation does not buy.
 *
 * ---------------------------------------------------------------------------
 * The one module a visitor touches was the one nothing verified
 * ---------------------------------------------------------------------------
 *
 * `start.ts` exports no name, so nothing can import it and nothing runs it: measured at `17cc9bf`,
 * zero tests and zero mutants over 19 220 bytes that build the copy control, the choice of package
 * manager, the search field and the playground's form. Everything a reader clicks.
 *
 * **What was in the way was not the document.** Measured over the same file's executable text, by the
 * rule that a line is delivery as soon as it names the document, the navigator or something that came
 * from one: 50.8 % delivery, 40.2 % decision, 9.0 % brackets - where the decision half counts both the
 * lines standing free and the eighteen written straight into an element, a spelling at a time. Two
 * fifths of that file was a claim about what a visitor reads, expressed as an assignment to
 * `textContent`.
 *
 * So the repair is not a document in the suite. It is that a decision stops being an argument to
 * `setAttribute` and becomes a value something can ask for.
 *
 * ---------------------------------------------------------------------------
 * Strings and flat records, never a description of a node
 * ---------------------------------------------------------------------------
 *
 * The obvious shape for *what a control says* is a tree - and this file has none, because none of the
 * decisions is one. They are `string`, `string | null`, `boolean`, and a union of flat records. The
 * search panel is the widest of them and it is four shapes with a list inside one of them.
 *
 * `document.ts`'s `Node` was the tempting target and it is refused twice over. Its `Tag` is a closed
 * union of seventeen names with no `button`, `input` or `label` in it, and widening a union that is
 * small on purpose is a decision this repository already records as one nobody takes in passing; and
 * the module weighs 23 933 bytes and pulls `paths.js` and `served-stylesheet.js` behind it, into a
 * browser graph kept to nine modules on a measurement. A vocabulary of nodes would have been a second
 * statement of what an element is, downloaded by every reader, to express decisions that are strings.
 *
 * ---------------------------------------------------------------------------
 * What this buys, and the half it does not
 * ---------------------------------------------------------------------------
 *
 * Every function here is reachable, so every claim below is a guard that can be red, and a mutant in
 * this file has something to kill it. That is the whole of the purchase.
 *
 * **It does not keep `start.ts` calling them.** A guard over `theSpellingShownFor` is green on the day
 * the control stops asking it, which is the class this repository has five recorded instances of. What
 * would close *that* is executing the control against a document, and this unit deliberately does not
 * reach for one: the residue is five wiring behaviours rather than a file, which is a smaller question
 * for whoever prices the tool. It is written down rather than dressed up.
 */

import type { AWayToRunIt } from '../registry/address.js'
import { THE_INVOCATION, renderContract } from '../registry/address.js'
import type { Result, Search } from '../registry/search.js'
import type { WhereTheCatalogueIs } from './searching.js'
import type { Theme } from './theme.js'

// ---------------------------------------------------------------------------
// The copy control beside the install command
// ---------------------------------------------------------------------------

/**
 * The three words the copy control ever carries, and the third is the one worth a table.
 *
 * A clipboard write can be refused - a page without focus, a permission withheld - and the reply to
 * that is a instruction the reader can act on rather than a button that silently stays as it was.
 * They are words and never a colour, which is the rule the stylesheet states for this site's accent
 * and which holds here for a second reason: a reader who cannot tell two colours apart still reads
 * the word.
 */
export const THE_COPY_CONTROL_SAYS = {
  /** Before anybody has pressed it. */
  atRest: 'copy',
  /** After the command has reached the clipboard. */
  afterCopying: 'copied',
  /** After the clipboard refused, naming the gesture that still works. */
  whenTheClipboardRefuses: 'press ⌘C',
} as const

/**
 * What a screen reader is told the button copies, which is the command and never the word `copy`.
 *
 * It is computed from the command at the moment it is used rather than captured when the button was
 * built, because the command is something a reader can change: the choice of package manager rewrites
 * it, and a label captured at build time would go on naming the first spelling afterwards.
 */
export const theCopyLabelFor = (command: string): string => `Copy ${command} to the clipboard`

// ---------------------------------------------------------------------------
// The theme
// ---------------------------------------------------------------------------

/**
 * What the theme button carries, which is where pressing it goes and never where the reader is.
 *
 * **A control that names its own current state is one a reader has to guess the verb of.** *dark*,
 * on a page that is already dark, is either a label or a destination and nothing on the button says
 * which. Naming the destination makes the press readable without a second word: the button says
 * `light`, and pressing it gives you light.
 *
 * It is a word and never an icon, for the reason the copy control's three words are words: a sun and
 * a moon are a claim about what a reader will recognise, and this site has no other pictogram to
 * teach them from. It is also what survives `toText` - the masthead is in every projection of every
 * page, and a glyph in a font this site does not ship is a box in half of them.
 */
export const theThemeControlSays = (goingTo: Theme): Theme => goingTo

/**
 * What a screen reader is told the button does, spelled as the action rather than as the word on it.
 *
 * The visible word is a noun standing where a verb is understood, which is fine for somebody who can
 * see the page it sits on and thin for somebody who meets it in a list of controls.
 */
export const theThemeLabelFor = (goingTo: Theme): string => `Use the ${goingTo} theme`

/**
 * The theme a press moves to, from the one the reader is looking at.
 *
 * Total over the union by construction rather than by a default arm: there are two themes and this is
 * the other one, so a third would not compile here rather than falling silently to `dark`.
 */
export const theOtherTheme = (from: Theme): Theme => (from === 'dark' ? 'light' : 'dark')

// ---------------------------------------------------------------------------
// The choice of package manager
// ---------------------------------------------------------------------------

/**
 * What follows the invocation in the command the page serves, or `null` when it serves something else.
 *
 * **The count of words is derived and no longer typed**, which is what taking this out of the element
 * revealed. It read `.split(' ').slice(2)` - correct for `npx toopo`, and a silent wrong answer the
 * day `THE_INVOCATION` gains a word, which is exactly the shape this repository refuses in a
 * stylesheet and had not looked for here.
 *
 * `null` rather than an empty string, because a command this control cannot take apart is one it must
 * not rewrite: offering a reader `bunx toopo` with the arguments dropped is worse than offering them
 * no choice at all.
 */
export const theArgumentsIn = (command: string): string | null =>
  command.startsWith(THE_INVOCATION) ? command.slice(THE_INVOCATION.length).trim() : null

/**
 * Whether this is the way the page already serves, which is what the control opens marked.
 *
 * A spelling against a spelling, never against the whole command: it was written against the command
 * first and marked nothing at all, because the command carries the arguments and `THE_INVOCATION`
 * does not.
 */
export const theWayAlreadyChosen = (way: AWayToRunIt): boolean => way.spelling === THE_INVOCATION

/** Why the catalogue refuses this way of running it, or `null` for a way that runs. */
export const theRefusalShownFor = (way: AWayToRunIt): string | null => way.refusedBecause ?? null

/**
 * The spelling a reader is shown for the manager they chose, which is not always the one they chose.
 *
 * A refused way shows the form that works. The reader said which manager they use; they did not ask
 * to be handed a command that fails, and the reason it fails is beside it in its own words.
 */
export const theSpellingShownFor = (way: AWayToRunIt): string =>
  theRefusalShownFor(way) === null ? way.spelling : THE_INVOCATION

/** The whole command for one way of running it: the spelling shown, then what the page already asked for. */
export const theCommandWrittenFor = (way: AWayToRunIt, arguments_: string): string =>
  `${theSpellingShownFor(way)} ${arguments_}`

// ---------------------------------------------------------------------------
// The search in the masthead
// ---------------------------------------------------------------------------

/** One result, as the panel shows it. */
export type AnAnswerShown = {
  /** Where the result goes, which is the contract's own address under the root of the site. */
  readonly href: string
  readonly name: string
  readonly summary: string
  /** What marks a contract the catalogue turned down, or `null` where a reader can install it. */
  readonly mark: string | null
}

/**
 * What the catalogue did, from which everything the panel shows follows.
 *
 * Three states and no fourth, so the answer below is total: the reader has not asked, the catalogue
 * answered, or it could not be read. A pair of a query and an optional answer would have carried a
 * state that cannot happen and a branch nobody could reach.
 */
export type WhatTheCatalogueDid =
  | { readonly kind: 'was-not-asked' }
  | { readonly kind: 'answered'; readonly found: Search }
  | { readonly kind: 'could-not-be-read'; readonly thrown: unknown }

/**
 * Why a query found nothing, in the reader's own words rather than in a count.
 *
 * **One sentence and two controls**, since the shelf gained a field: the panel says it about the whole
 * catalogue and the shelf says it about what can be installed, and the *reason* is the same either way
 * - either a word reached nobody, or every word is known and no one contract carries them all. Written
 * twice, the two would drift on the day either is reworded, and a reader would be told two different
 * things about one failure depending on which box they typed in. ADR-0181.
 */
const whyNothingAnswered = (found: Search): string =>
  found.unknownWords.length === 0
    ? NO_CONTRACT_CARRIES_THEM_ALL
    : `No contract mentions: ${found.unknownWords.join(', ')}`

/**
 * What stands in the panel, which is never nothing while somebody is searching.
 *
 * `nothing` is in this union and `whatThePanelShows` never answers it - it is what the control shows
 * when the reader has *left*, and having it here is what lets the delivery be total over one type.
 * **A box that goes blank when a search fails is the failure the whole matching rule is built to
 * avoid**, arriving in the surface instead of in the rule, so the distinction between *answered badly*
 * and *not searching* is a shape here rather than a sentence.
 */
export type WhatThePanelShows =
  | { readonly kind: 'nothing' }
  | { readonly kind: 'an-invitation'; readonly said: string; readonly examples: readonly string[] }
  | { readonly kind: 'no-answer'; readonly said: readonly string[] }
  | { readonly kind: 'answers'; readonly answers: readonly AnAnswerShown[] }
  | { readonly kind: 'a-failure'; readonly said: string }

/** The panel with nothing in it, which the stylesheet has described since the first day. */
export const THE_PANEL_IS_CLOSED: WhatThePanelShows = { kind: 'nothing' }

/** What a reader is invited to do before they have typed, beside the queries this catalogue answers. */
const THE_INVITATION = 'Describe what you need, in your own words.'

/** What is said when every word is known and no one contract carries them all. */
const NO_CONTRACT_CARRIES_THEM_ALL = 'Every word is known, and no one contract carries them all.'

/** What marks a contract the catalogue published a refusal for. */
const NOT_INSTALLABLE = 'not installable'

/** What a reader is told when the catalogue itself could not be fetched and the failure said nothing. */
const THE_CATALOGUE_COULD_NOT_BE_READ = 'the catalogue could not be read'

const theAnswerShownFor = (result: Result, root: string): AnAnswerShown => {
  const rendered = renderContract(result.address)

  return {
    href: `${root}${rendered}/`,
    name: rendered,
    summary: result.summary,
    mark: result.installable ? null : NOT_INSTALLABLE,
  }
}

/**
 * Everything the panel shows, from the one thing the control knows at that moment.
 *
 * The three shapes a query can meet are the three `packages/cli/report.ts` prints on a terminal - the
 * examples, an answer, and nothing found with the reason - rendered for a page rather than restated
 * for one. `renderSearch` is `Search` to a terminal; this is `Search` to a panel, and they take the
 * same value because ADR-0137 put the matching rule where both surfaces reach it.
 */
export const whatThePanelShows = (
  where: WhereTheCatalogueIs,
  did: WhatTheCatalogueDid,
): WhatThePanelShows => {
  if (did.kind === 'was-not-asked') {
    return { kind: 'an-invitation', said: THE_INVITATION, examples: where.examples }
  }

  if (did.kind === 'could-not-be-read') {
    return {
      kind: 'a-failure',
      said:
        did.thrown instanceof Error ? did.thrown.message : THE_CATALOGUE_COULD_NOT_BE_READ,
    }
  }

  const { found } = did
  if (found.results.length === 0) {
    return {
      kind: 'no-answer',
      said: [`Nothing in the catalogue answers "${found.query}".`, whyNothingAnswered(found)],
    }
  }

  return {
    kind: 'answers',
    answers: found.results.map((result) => theAnswerShownFor(result, where.root)),
  }
}

/**
 * Whether an answer that has arrived is about a query the reader has already moved on from.
 *
 * A search is a request per keystroke and the answers do not have to come back in order, so an answer
 * is shown only while the field still spells the question it was asked. Without this the reader who
 * types faster than the network watches the panel settle on an older query than the one in front of
 * them.
 */
export const theAnswerIsStale = (typed: string, asked: string): boolean => typed.trim() !== asked

/**
 * What the shelf shows when somebody types, which is a set of addresses and never a set of cards.
 *
 * **The whole property this unit is built on is in the return type.** A card is served with the page,
 * with its signature, its summary and its command; a query decides which of them a reader is looking
 * at. So this answers *which addresses*, the caller hides the rest, and **a searched card cannot show
 * less than a static one because there is only one card**. Nothing here builds anything, and there is
 * no shape in which it could.
 *
 * `everything` is what an empty field means, and it is a member rather than an absence for the reason
 * `THE_PANEL_IS_CLOSED` is one: a shelf that went blank when a reader cleared the box would be the
 * failure the matching rule exists to avoid, arriving in the surface instead of in the rule.
 *
 * **A failure shows everything and says so.** The catalogue could not be read, so nothing is known
 * about what matches - and hiding cards on the strength of an answer nobody received would be a page
 * claiming a search happened. The reader keeps the shelf and is told the search is the part that
 * broke. ADR-0181.
 */
export type WhatTheShelfShows =
  | { readonly kind: 'everything' }
  | { readonly kind: 'these'; readonly addresses: readonly string[]; readonly said: string }
  | { readonly kind: 'none'; readonly said: readonly string[] }
  | { readonly kind: 'a-failure'; readonly said: string; readonly showing: 'everything' }

/** What is said above the shelf when a query has narrowed it, counted rather than written. */
const theyAre = (count: number): string =>
  `Showing ${count} of the catalogue's installable functions.`

export const whatTheShelfShows = (did: WhatTheCatalogueDid): WhatTheShelfShows => {
  if (did.kind === 'was-not-asked') return { kind: 'everything' }

  if (did.kind === 'could-not-be-read') {
    return {
      kind: 'a-failure',
      showing: 'everything',
      said: did.thrown instanceof Error ? did.thrown.message : THE_CATALOGUE_COULD_NOT_BE_READ,
    }
  }

  const { found } = did
  /**
   * A refusal is an answer in a search and it is not on this shelf, so it is dropped here rather than
   * hidden by having no card. ADR-0179 is the split: somebody who types a refused contract's name gets
   * it from `npx toopo search`, and a shelf holds what can be used.
   *
   * Dropping it here rather than relying on the absence of a card is what keeps the count honest -
   * *showing 2 of* is a claim about this shelf, and counting a result the shelf can never show would
   * make it wrong by one whenever a query reached the refusal.
   */
  const installable = found.results.filter((result) => result.installable)

  if (installable.length === 0) {
    return {
      kind: 'none',
      said: [`Nothing you can install answers "${found.query}".`, whyNothingAnswered(found)],
    }
  }

  return {
    kind: 'these',
    addresses: installable.map((result) => result.address.name),
    said: theyAre(installable.length),
  }
}
