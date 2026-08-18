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

import type { Node } from './document.js'
import { el, text } from './document.js'
import { CATALOGUE_PAGE, METHOD_PAGE, REFUSALS_PAGE, linkTo, rootFrom } from './paths.js'

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
