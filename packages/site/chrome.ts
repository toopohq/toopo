/**
 * The furniture every page carries: the wordmark, the two pages a reader can always get back to, and
 * the column that says where in the catalogue they are.
 * ADR-0116 is why it exists and what it deliberately leaves out; ADR-0121 is the column - why it is a
 * sibling of the rail rather than a part of it, and why it is placed by the grid rather than ordered.
 *
 *
 * ---------------------------------------------------------------------------
 * Why the menu is passed in rather than written here
 * ---------------------------------------------------------------------------
 *
 * The refusals page is emitted only when something has been refused, and `theSite` is the one place
 * that knows. A menu written here would name an address the tree does not hold on the day the
 * catalogue refuses nothing - which `the-emitted-tree-is-closed` would catch, but only after somebody
 * had written a link this module had no way to check.
 *
 * ---------------------------------------------------------------------------
 * The field, and why it is a slot rather than a control
 * ---------------------------------------------------------------------------
 *
 * The masthead carries a search field since ADR-0137, and what is *served* is an empty element
 * carrying the two addresses the catalogue answers at. `start.ts` builds the field into it, and a
 * reader with no JavaScript meets a masthead with nothing extra in it rather than a box that does
 * nothing.
 *
 * **That is the same arrangement the playground already has, and it settles what this header used to
 * refuse.** Three ways of shipping the control were considered when search was not built. *Served and
 * inert* is refused by `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing`.
 * *Served and disabled* is a promise deferred where a reader sees a fault. *A link wearing a search
 * field's clothes* was the worst: a box carrying `describe what you need…` that answers a click with a
 * list is a control lying about what it does, and an inert control disappoints where that one
 * misleads. All three are still refused; none of them is what this is.
 *
 * **The addresses are handed over rather than computed in the browser.** `pathTo` is the one statement
 * of where an answer lives, and reaching it from a browser module would pull `endpoints.ts` in to read
 * two strings. So they are resolved here, against this page's own depth, exactly as a contract page
 * hands over the module its playground runs.
 */

import { endpointOf, pathTo } from '../registry/endpoints.js'
import type { Domain } from './catalogue.js'
import { shortNameOf } from './catalogue.js'
import type { WhereTheCatalogueIs } from './searching.js'
import type { Attributes, Node } from './document.js'
import { el, text } from './document.js'
import {
  FRONT_PAGE,
  METHOD_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
  rootFrom,
} from './paths.js'

const NOTHING = {} as const

/** One destination of the masthead: what it is called, and the page it is. */
export type MenuEntry = {
  readonly label: string
  readonly page: string
}

/**
 * The page the masthead offers, which is one and used to be three.
 *
 * The catalogue is not among them: it is what the wordmark is for, and two links to one address is a
 * reader's choice they gain nothing by making.
 *
 * **What a masthead is for is the thing a reader needs before they know they need it**, and only one
 * of the three was that. *How we verify* is the claim this whole catalogue rests on and the one a
 * reader evaluating the project goes looking for without being told it exists.
 *
 * The other two are reached where they are asked for instead of everywhere. *What a contract is* is
 * linked from the phrase on a contract page that uses the word - the seam, where the page stops
 * describing a function and starts quoting a binding - and from the front page. *What we refuse* is
 * linked from the front page and from the domain that turned something down, which is where somebody
 * meets a refusal rather than where they would go looking for the set of them.
 *
 * **No address is lost and none was ever going to be**: an address this tree has served goes on being
 * written, and what changes is what points at it. ADR-0125 is that rule and it is about the address
 * rather than about the navigation.
 */
export const theMenu = (): readonly MenuEntry[] => [
  { label: 'How we verify', page: METHOD_PAGE },
]

/**
 * A destination as it is reached from one page, or the plain words where it is the page you are on.
 *
 * A link to the page under the reader's cursor is a control that does nothing, which is the class of
 * thing this masthead refuses whatever it is made of. Marking it instead is what tells somebody where
 * they are, and `aria-current` is the declaration for that rather than a class this repository
 * invented.
 */
const destination = (own: string, page: string, label: string): Node =>
  own === page
    ? el('li', { class: 'here', 'aria-current': 'page' }, text(label))
    : el('li', NOTHING, el('a', { href: `${rootFrom(own)}${linkTo(page)}` }, text(label)))

/**
 * The masthead of one page.
 *
 * The wordmark is a paragraph holding a link rather than a bare link, and that is the reading and not
 * the look: two elements that each carry content and neither of which separates run into one another,
 * which is what `no-element-runs-into-the-one-beside-it` exists for. The menu is a list for the same
 * reason - three anchors side by side are one word in a screen reader.
 */
export const masthead = (own: string, menu: readonly MenuEntry[]): Node =>
  el(
    'nav',
    { class: 'masthead' },
    el(
      'p',
      { class: 'wordmark' },
      own === FRONT_PAGE
        ? text('toopo')
        : el('a', { href: rootFrom(own) }, text('toopo')),
    ),
    el('div', { class: 'search', 'data-search': theCatalogueFrom(own) }),
    el('ul', { class: 'menu' }, ...menu.map((entry) => destination(own, entry.page, entry.label))),
    /**
     * Where the theme button is built, and it is served empty for the reason the search field is.
     *
     * A reader with no JavaScript meets a masthead with nothing extra in it rather than a control
     * that does nothing, which is what `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing`
     * asks of every control on this site. There is nothing to fall back to here and that is the point:
     * the palette answers `prefers-color-scheme` in CSS, so a reader who never gets this button still
     * gets their own system's theme. It is an override and never a way in. ADR-0176.
     */
    el('div', { class: 'theme' }),
  )

/**
 * The three queries offered before a reader has typed anything.
 *
 * **Every one is measured to answer, and a guard is what keeps that true rather than this sentence.**
 * An example that finds nothing is the defect a visitor met on the install command - found on the
 * first thing they tried, by them and not by a sweep - and it is worse here, because the example is
 * this site's own claim about what describing a need gets you.
 *
 * They are three descriptions rather than three identifiers, which is the promise being demonstrated:
 * somebody who already knows `slugify` does not need a search. Each goes to a different contract, and
 * each is a sentence somebody would write rather than a label somebody would guess.
 */
export const THE_EXAMPLES: readonly string[] = [
  'turn a title into a url',
  'convert a string to a number',
  'add days to a date',
]

/**
 * Where the two answers a search reads live, from this page.
 *
 * Both come from `pathTo`, which is the only statement of where an answer lives, and both are made
 * relative to the page that declares them - so a contract page two levels down and the front page ask
 * the same host for the same file.
 */
const whereTheCatalogueIs = (own: string): WhereTheCatalogueIs => ({
  index: `${rootFrom(own)}${pathTo(endpointOf('contract-index')).slice(1)}`,
  refusals: `${rootFrom(own)}${pathTo(endpointOf('refusals')).slice(1)}`,
  root: rootFrom(own),
  examples: THE_EXAMPLES,
})

/**
 * The same two addresses, for a page that serves a second slot of its own.
 *
 * **Exported so that the front page's sift and this masthead ask one function where the catalogue is**,
 * rather than two composing the same pair from `pathTo`. The value is the slot's own `data-search`, so
 * what crosses into the browser is a string either way and neither side reaches `endpoints.ts`.
 * ADR-0181.
 */
export const theCatalogueFrom = (own: string): string =>
  JSON.stringify(whereTheCatalogueIs(own))

/**
 * The column beside a page: where you are in the catalogue, and then whatever that page adds.
 *
 * **The rule it keeps is the current domain in full and the others one line each, never the whole
 * catalogue.** That is what MDN, the Rust book and the Python documentation all do, and the reason is
 * arithmetic rather than fashion: a navigation listing every contract is readable at five and is a
 * wall at a thousand, and the shape that survives to a thousand is the one worth building at five.
 *
 * **It is a sibling of the rail rather than a part of it**, and that is a decision about a guard as
 * much as about markup. `the-rail-of-a-page-names-every-section-of-it-and-only-those` walks
 * everything inside `.rail` and requires each link to be a section of the page; the links here go to
 * other pages. Putting them inside would have meant widening that guard to ignore them, which is a
 * guard being narrowed to fit what somebody wanted to add. Two elements in one column costs nothing
 * and leaves the rail meaning exactly what it meant.
 *
 * ---------------------------------------------------------------------------
 * No count beside a domain, and it is the mock-up this departs from
 * ---------------------------------------------------------------------------
 *
 * The mock-up draws `array 97 · date 156 · util 136`, from a catalogue of a thousand that does not
 * exist. The system is a magnitude beside a name; the data is fiction. Applied to what is really
 * here, every line would read `1`, `1`, `2` - which makes the catalogue look empty in the navigation
 * of every page, and answers no question a reader of three domains has.
 *
 * A bare digit is also the one thing here that does not survive a projection. `toText` renders a list
 * item as its words, so `string` and `2` come out as `string 2` with nothing saying what the 2
 * counts. So the figure is where there is room for the word that makes it mean something - the label
 * of the domain you are standing in - and the list is names.
 */
export const beside = (
  own: string,
  here: Domain,
  domains: readonly Domain[],
  rail: readonly Node[],
): Node =>
  el(
    'div',
    { class: 'beside' },
    el(
      'nav',
      { class: 'where', 'aria-label': 'Catalogue' },
      line(
        'p',
        whatThisDomainHolds(here),
        domainPageOf(here.address),
        own,
        { class: 'rail-label' },
      ),
      el(
        'ul',
        { class: 'siblings' },
        ...here.held.map((one) =>
          line('li', shortNameOf(one.contract.address.name), pageOf(one.contract.address), own, NOTHING),
        ),
      ),
      el('p', { class: 'rail-label' }, text('Domains')),
      el(
        'ul',
        { class: 'domains' },
        ...domains.map((domain) =>
          line(
            'li',
            domain.name,
            domainPageOf(domain.address),
            own,
            NOTHING,
          ),
        ),
      ),
    ),
    ...rail,
  )

/**
 * The label of the domain you are standing in, which is a magnitude and the word that says what it
 * counts.
 *
 * **A domain that publishes nothing says what it turned down instead of saying zero.** `array · 0
 * contracts` is arithmetic that reads as *this corner of the catalogue is empty*, on the one page whose
 * subject is a contract that was written in full and refused. The rule the header states is that a bare
 * digit does not survive `toText`, and this is the same rule one turn on: a digit survives, and a digit
 * counting the wrong noun says something false in every projection. ADR-0126.
 */
const whatThisDomainHolds = (domain: Domain): string =>
  domain.held.length === 0
    ? `${domain.name} · ${domain.turnedDown.length} turned down`
    : `${domain.name} · ${domain.held.length} ${domain.held.length === 1 ? 'contract' : 'contracts'}`

/**
 * A line of the column: a link, or the plain words where it is the page you are on.
 *
 * The same reading `destination` makes of the masthead, and the same declaration: a link to the page
 * under the reader's cursor is a control that does nothing, and `aria-current` is what says *this one*
 * rather than a class this repository invented.
 */
const line = (
  tag: 'p' | 'li',
  label: string,
  page: string,
  own: string,
  attributes: Attributes,
): Node =>
  own === page
    ? el(tag, { ...attributes, class: `${attributes['class'] ?? ''} here`.trim(), 'aria-current': 'page' }, text(label))
    : el(tag, attributes, el('a', { href: `${rootFrom(own)}${linkTo(page)}` }, text(label)))

/** The last segment of a contract's name, which is what tells it apart inside its own domain. */
