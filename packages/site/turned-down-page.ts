/**
 * The page a contract the catalogue turned down has, at that contract's own address.
 * ADR-0127 is why it exists and which half of ADR-0027 it reverses; ADR-0126 is why the domain above
 * it has a page at all.
 *
 * ---------------------------------------------------------------------------
 * It is the same address a published contract would have had, and that is the decision
 * ---------------------------------------------------------------------------
 *
 * `pageOf` is the one spelling of a contract's page, and nothing here composes a second: a refusal is a
 * **state** of a contract rather than a different kind of thing, so it is at the address the contract
 * has. A reader who arrives from a search for `group-by` lands where they would have landed if it had
 * been published, and is told what happened.
 *
 * ---------------------------------------------------------------------------
 * What it does not show, and why saying so is the point
 * ---------------------------------------------------------------------------
 *
 * **The contract as written is not here.** ADR-0027 settled that a contract page with no digest behind
 * it is missing the only half that makes this registry worth anything, and that half of ADR-0027 is
 * kept: `refuseContract` records an argument and binds nothing, so there is no frozen definition for
 * this address and no digest a reader could check anything against.
 *
 * What this page does instead is ADR-0027's own rule about an empty section, applied honestly - *a
 * section with no data is not rendered, and what is missing is said in a sentence where a reader would
 * have looked for it.* Every other contract page publishes a digest. This one says it has none.
 *
 * **And there is no install command anywhere on it.**
 * `nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` is what keeps that, and
 * it was written for the catalogue's list long before this page existed - so it arrived here already
 * holding the one thing this page must never do.
 */

import { renderContract } from '../registry/address.js'
import type { Domain, TurnedDown } from './catalogue.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { beside, masthead } from './chrome.js'
import { pageOf } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * The sentence that says this is a refusal, in words rather than in a colour.
 *
 * ADR-0115's rule is that a colour never carries meaning alone and that what tells two states apart is
 * the word. Here there is not even a mark to colour: the state is the first thing under the heading,
 * as a sentence, so it survives `toText` and `toMarkdown` as itself and a reader who arrives from a
 * search cannot miss it while scanning for the install line that is not there.
 */
const WHAT_HAPPENED =
  'This contract was written in full and then turned down. It is not installable, there is no ' +
  'command for it, and there will not be one. What the catalogue publishes about it is the decision ' +
  'and the measurement that decision rests on, so that the decision can be disagreed with.'

/**
 * The half a reader of any other contract page would look for, and what is in its place.
 *
 * Named where they would have looked rather than left as an absence, which is the rule ADR-0027 states
 * about a section with no data - and the reason it matters more here than anywhere else on this site is
 * that every other page at an address of this shape carries a digest.
 */
const WHAT_IS_NOT_HERE =
  'The contract as written - the signature, the properties, and the cases it settled one at a time - ' +
  'is not on this page. A contract is frozen when it is published, and this one never was: the ' +
  'registry recorded an argument and bound no digest, so there is no frozen definition at this ' +
  'address and nothing here that a reader could hash and compare. Every other contract page of this ' +
  'catalogue publishes a digest. This one has none, and saying so is worth more than a section shaped ' +
  'like the others with nothing behind it.'

export const turnedDownPage = (
  turnedDown: TurnedDown,
  here: Domain,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const { refusal, summary } = turnedDown
  const name = renderContract(refusal.address)
  const own = pageOf(refusal.address)

  /** The last segment, for the reason a contract page takes it: the address is already above it. */
  const shortName = refusal.address.name.split('/').at(-1) as string

  return {
    /**
     * The same shape every contract page of this catalogue takes - the short name and what the thing
     * was for - because a refusal is a state of a contract and not a different kind of page.
     *
     * **The state leads the description instead**, which is the other half a search result shows. It
     * was in the title first, and `the-opening-of-a-page-says-three-different-things` is what moved it:
     * that guard requires a contract page's title to carry the summary and its description not to, so a
     * title saying only *turned down* would have made this the one address of the shape where a reader
     * scanning results cannot see what the function was.
     */
    title: `${shortName} — ${summary}`,
    servedBesideItsMarkdown: true,
    /**
     * A refused contract has no source to point at, so the one `@type` this site publishes does not
     * apply. `only-a-page-about-one-contract-says-it-is-source-code` is the guard that would otherwise
     * be widened to admit a page about a contract with no code.
     */
    structuredData: null,
    description:
      `Turned down before publication: ${refusal.decidedAgainst}. It was written in full first, and ` +
      `the measurement it was refused on is published with it, so the decision can be disagreed with.`,
    body: [
      masthead(own, menu),
      el(
        'div',
        { class: 'shell' },
        el(
          'main',
          NOTHING,
          el('p', { class: 'address' }, line('code', name)),
          line('h1', shortName),
          line('p', summary, { class: 'lede' }),
          line('p', WHAT_HAPPENED),

          line('h2', 'Turned down for'),
          line('p', refusal.decidedAgainst),

          line('h2', 'On this measurement'),
          line('p', refusal.measurement),

          line('h2', 'Kept as'),
          line('p', refusal.keptAs),

          line('h2', 'What this page does not show'),
          line('p', WHAT_IS_NOT_HERE),
        ),
        beside(own, here, domains, []),
      ),
    ],
  }
}
