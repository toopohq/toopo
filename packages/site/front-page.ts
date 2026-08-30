/**
 * The page a reader arrives at, which is the shelf the catalogue can be taken off.
 * ADR-0181 is what it holds and what it deliberately leaves out; ADR-0140 is the door it replaces.
 *
 * ---------------------------------------------------------------------------
 * It was a door for a year, and the owner replaced it with what is on the shelf
 * ---------------------------------------------------------------------------
 *
 * ADR-0140 made this page a name and two doors, on an argument about who arrives: *somebody searching
 * for a function does not arrive here - they arrive on a contract page, from outside*. The owner has
 * overruled it, and the reason is the one this project is sold on: a developer comes to find functions
 * they can use, and a page that describes a catalogue without showing one asks them to take a second
 * step before they have seen anything.
 *
 * **It is recorded as an overruling rather than as a discovery**, which is the treatment ADR-0176 gave
 * the theme button: nothing measured here made ADR-0140 wrong, and the owner decided.
 *
 * **Half of ADR-0140 survives untouched, and it is the half that was argued rather than concluded.**
 * That record refused `add domain/function` on this page - the shape of every command at once, so that
 * no contract was privileged - because *the constraint was right and its form was a template, which is
 * a thing a reader sees*. Every command here names a real contract and runs. What fell is the sentence
 * it generalised to, *a command belongs on no page that is about the catalogue*; what stands is that a
 * reader is never shown a command they cannot type.
 *
 * ---------------------------------------------------------------------------
 * Six and not seven, and the rule it overturns is named with its scope
 * ---------------------------------------------------------------------------
 *
 * The shelf lists what is installable. `array/group-by@1` is refused, so it is not here - the owner's
 * rule is that a showcase holds what can be used, and a refusal on a shelf is noise. **It is still an
 * answer in a search**: somebody who types its name asked for that thing, and `npx toopo search` gives
 * them the refusal with its reason. ADR-0179 carries the split and why the contract stays in the
 * repository at all.
 *
 * **`catalogue-page.ts` carries a measured rule this page breaks**: *one field is added per level and
 * never two - this page names; a domain page names and summarises; a contract page is the contract*,
 * with the figure behind it, that one entry cost 443 bytes of the emitted tree and that a summary under
 * every name *is the page at five contracts and is the whole page at a hundred*.
 *
 * That rule is not wrong and this page is not an index. **A shelf is a different thing from a
 * catalogue**: it exists to be read rather than navigated, and at six contracts five fields fit on one
 * screen. The arithmetic behind the rule does not go away, so it is a reopening condition rather than
 * an objection nobody wrote down: **the day this page stops fitting on a screen it stops being a
 * shelf**, and what it becomes is the question ADR-0181 declines to guess at.
 *
 * ---------------------------------------------------------------------------
 * Nothing here needs JavaScript, and the search does not fabricate a card
 * ---------------------------------------------------------------------------
 *
 * Every contract is in the served HTML with its signature, its summary and its command. That is the
 * constraint the owner set and it is what makes the search cheap: a query filters cards that are
 * already on the page rather than building them from `contract-index`, so **a searched card cannot show
 * less than a static one, by construction rather than by vigilance**. It is also why no field was added
 * to `contract-index` - ADR-0180 has the derivation, and `what-a-card-says.ts` is where it lives.
 */

import type { ServedIndex } from '../registry/response.js'
import type { Domain, Held } from './catalogue.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { masthead } from './chrome.js'
import { grouped } from './quantity.js'
import { whatACardSays } from './what-a-card-says.js'
import {
  CATALOGUE_PAGE,
  FRONT_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
} from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A count and the word it counts, so that a seventh contract does not need a sentence rewritten. */
const said = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`

/**
 * What this page calls the shelf, which promises an order nothing here computes.
 *
 * **The artboard's heading is `Popular functions` and there is no such thing in this repository.**
 * Nothing measures popularity: permanent rule 1 forbids the runtime call that would produce a figure,
 * and no download count, no telemetry and no usage signal exists anywhere in the tree - swept over
 * `packages/`, `mutation/` and `packaging/`. A heading naming a ranking would be a claim about data
 * that does not exist, on the first line a visitor reads.
 *
 * So the heading says what the list *is*: everything the catalogue can install. It is exhaustive over
 * the installable half, it states no order, and the order it happens to be in is the registry's own -
 * the same one the catalogue, the sitemap and every column already use.
 */
const WHAT_THE_SHELF_IS = 'What you can install'

/**
 * One contract on the shelf: what it is called, what it does, what it is, and how to take it.
 *
 * The sentence is `what-a-card-says.ts`'s and the markup is this page's, which is ADR-0180's split. An
 * `h3` under the shelf's `h2`, because the outline of this page is its name, its one section and the
 * contracts in it - a heading level is a fact about a page rather than about a card.
 *
 * **The signature is the form the frozen record holds** and never a declaration composed from it: the
 * artboard writes `slugify(input: string): string`, and turning the record's type into that needs the
 * type parsed, which ADR-0026 refuses. A reader who meets a signature here and the same signature on
 * the contract page meets one string.
 */
const offer = (held: Held): Node => {
  const says = whatACardSays(held)

  return el(
    'li',
    { class: 'offer' },
    el(
      'h3',
      { class: 'call' },
      el(
        'a',
        { href: linkTo(pageOf(held.contract.address)) },
        text(`${says.domain}/${says.name}`),
      ),
    ),
    line('pre', says.signature, { class: 'shape' }),
    line('p', says.summary, { class: 'why' }),
    line(
      'p',
      `${said(says.costs.cases, 'settled case', 'settled cases')} · ` +
        `${grouped(says.costs.bytes)} bytes · ` +
        `${says.costs.imports === 0 ? 'no imports' : said(says.costs.imports, 'import', 'imports')}`,
      { class: 'meta' },
    ),
    line('pre', says.command, { class: 'install' }),
  )
}

/**
 * A domain, as a way into the part of the shelf that is filed under it.
 *
 * **They are links and never controls**, which is what makes them work with nothing running: the
 * artboard's chips filter the grid in the browser, and a domain already has a page that lists exactly
 * what a filtered grid would show. So the chip goes to that page, a reader with no JavaScript gets the
 * same answer as a reader with it, and `every-page-is-reachable-from-the-front-page` reaches every
 * domain page from here rather than through the catalogue.
 */
const chip = (domain: Domain): Node =>
  el(
    'li',
    NOTHING,
    el(
      'a',
      { class: 'chip', href: linkTo(domainPageOf(domain.address)) },
      text(`${domain.name} ${domain.held.length}`),
    ),
  )

export const frontPage = (
  index: ServedIndex,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const held = domains.flatMap((domain) => domain.held)
  const installable = index.entries.filter((entry) => entry.installable).length
  const turnedDown = index.entries.length - installable

  return {
    title: 'Toopo — utility functions with a public, executable contract',
    servedBesideItsMarkdown: true,
    structuredData: null,
    description:
      `${installable} utility functions with a published contract: a signature, property-based ` +
      `invariants, and every edge case named and settled. The source is copied into your project.`,
    body: [
      masthead(FRONT_PAGE, menu),
      /**
       * No `.shell`, for the reason ADR-0139 measured: a shell exists to stand a navigation column
       * beside the content, this page has none, and a shell with one child hands on no inset of its
       * own - so it ran edge to edge at 320, 390 and 768.
       */
      el(
        'main',
        { class: 'shelf' },
        el('h1', NOTHING, text('Toopo')),
        el(
          'p',
          { class: 'lede' },
          text(
            'Utility functions you copy into your project, each verified against a public, ' +
              'executable contract. Not a dependency: the source lands in your repository and it ' +
              'is yours.',
          ),
        ),
        line('h2', WHAT_THE_SHELF_IS),
        el('ul', { class: 'chips plain' }, ...domains.filter((one) => one.held.length > 0).map(chip)),
        el('ul', { class: 'offers plain' }, ...held.map(offer)),
        /**
         * What the shelf does not show, and the way to it.
         *
         * **It is composed rather than written**, so a second refusal lands in this sentence with
         * nobody editing it - the treatment a domain page's opening already gets. It is also what
         * keeps `/catalogue/` reachable from here: no page is removed in this unit, and a page nothing
         * links to is one `every-page-is-reachable-from-the-front-page` refuses.
         */
        el(
          'p',
          { class: 'aside-line' },
          text(
            turnedDown === 0
              ? 'The catalogue is every one of these, with what each was measured against. '
              : `${said(turnedDown, 'contract', 'contracts')} the catalogue considered and turned ` +
                `down ${turnedDown === 1 ? 'is' : 'are'} not on this shelf. The catalogue holds ` +
                `${said(index.entries.length, 'contract', 'contracts')} in all, with the argument ` +
                `for each. `,
          ),
          el('a', { href: linkTo(CATALOGUE_PAGE) }, text('The catalogue')),
          text(' · '),
          el('a', { href: linkTo(WHAT_A_CONTRACT_IS_PAGE) }, text('What a contract is')),
        ),
      ),
    ],
  }
}
