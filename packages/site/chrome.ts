/**
 * The furniture every page carries: the wordmark, and the two pages a reader can always get back to.
 * ADR-0116 is why it exists and what it deliberately leaves out.
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
 * What is not here, and will be
 * ---------------------------------------------------------------------------
 *
 * The mock-up this is derived from carries a search field in the masthead. Search is not built, and a
 * field that searches nothing is exactly what
 * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` refuses - so the rule
 * this repository already keeps is applied before it can be broken rather than after.
 */

import type { Domain } from './catalogue.js'
import type { Attributes, Node } from './document.js'
import { el, text } from './document.js'
import {
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
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
 * The pages the masthead offers, which is every page of this site that is not about one contract.
 *
 * The catalogue is not among them: it is what the wordmark is for, and two links to one address is a
 * reader's choice they gain nothing by making.
 */
export const theMenu = (refused: number): readonly MenuEntry[] => [
  { label: 'How we verify', page: METHOD_PAGE },
  ...(refused === 0 ? [] : [{ label: 'What we refuse', page: REFUSALS_PAGE }]),
]

/**
 * A destination as it is reached from one page, or the plain words where it is the page you are on.
 *
 * A link to the page under the reader's cursor is a control that does nothing, one class down from
 * the search field this masthead does not carry. Marking it instead is what tells somebody where they
 * are, and `aria-current` is the declaration for that rather than a class this repository invented.
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
      own === CATALOGUE_PAGE
        ? text('toopo')
        : el('a', { href: rootFrom(own) }, text('toopo')),
    ),
    el('ul', { class: 'menu' }, ...menu.map((entry) => destination(own, entry.page, entry.label))),
  )

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
        `${here.name} · ${here.held.length} ${here.held.length === 1 ? 'contract' : 'contracts'}`,
        domainPageOf(here.held[0].contract.address),
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
            domainPageOf(domain.held[0].contract.address),
            own,
            NOTHING,
          ),
        ),
      ),
    ),
    ...rail,
  )

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
const shortNameOf = (name: string): string => name.slice(name.indexOf('/') + 1)
