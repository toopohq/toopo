/**
 * The page a reader arrives at, implemented from the owner's artboard.
 * ADR-0182 is that implementation and what it deviates from; ADR-0181 is the shelf it replaces.
 *
 * ---------------------------------------------------------------------------
 * The artboard is the specification, and the last version of this page was not
 * ---------------------------------------------------------------------------
 *
 * ADR-0181 built a shelf that satisfied every constraint it was given - six contracts, their
 * signatures, their commands, readable with nothing running - and looked nothing like the design. The
 * briefs had given constraints and never the artboard as a test, and the shared card it reached for
 * carried the *existing* visual language, which is what that module was for.
 *
 * So the order of authority is written down here rather than left implied. **`Toopo.dc.html` decides
 * every size, colour, spacing, word and order on this page.** Three things outrank it and they are the
 * only three:
 *
 * 1. the page is readable with no JavaScript - the six contracts, their signatures and their commands
 *    are in the served HTML, and the palette, the live search and the theme toggle are added on top;
 * 2. every pair of the palette clears the contrast floor, which
 *    `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` holds;
 * 3. the 73 addresses of the origin do not move.
 *
 * Where this page departs from the artboard for any other reason, the departure is named in ADR-0182
 * with what forced it. *I did not notice* is not one of the reasons available.
 *
 * ---------------------------------------------------------------------------
 * The card is this page's own, and the arithmetic behind it is still shared
 * ---------------------------------------------------------------------------
 *
 * The artboard carries two layouts: the shelf's card and, under `isDetail`, a different and complete
 * one. They are two things, so the markup is not shared - which is what ADR-0180 decided and what the
 * last unit then failed to act on, by reaching for a card that already existed instead of building the
 * one the design draws.
 *
 * `what-a-card-says.ts` stays exactly as it is. What it holds is the arithmetic - the four figures
 * that were written twice, to the character - and none of it is markup.
 */

import type { ServedIndex } from '../registry/response.js'
import type { Domain, Held } from './catalogue.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { footer, masthead, theCatalogueFrom } from './chrome.js'
import { readableDate } from './quantity.js'
import { whatACardSays } from './what-a-card-says.js'
import { eyebrow, offer, pill } from './components.js'
import { CATALOGUE_PAGE, FRONT_PAGE, domainPageOf, linkTo, pageOf } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A count and the word it counts, so that a seventh contract needs no sentence rewritten. */
const said = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`

/**
 * The headline and the sentence under it, taken from the artboard verbatim.
 *
 * They are declarations rather than literals in the tree because they are the one part of this page
 * that is the *owner's copy*: a reader meets them before anything the registry produces, and a unit
 * that reworded them while moving a box would be editing the design.
 */
const THE_HEADLINE = 'Tested functions, copied into your project.'

const THE_SENTENCE_UNDER_IT =
  'No package to install, no dependency tree. Every function ships as plain source with a frozen ' +
  'contract — its signature and behaviour never change.'

/**
 * What the shelf is called, and it is the one word of the artboard this page does not use.
 *
 * The artboard heads the list `Popular functions`. **Nothing in this repository ranks anything** -
 * permanent rule 1 forbids the runtime call that would produce a figure, and no download count, no
 * telemetry and no usage signal exists anywhere in the tree. A heading naming a ranking would be a
 * claim about data that does not exist, on the first list a visitor reads, in a catalogue whose whole
 * argument is that nothing here is asserted without a measurement behind it.
 *
 * So the register is kept - a short uppercase label over the grid - and the word is what the list
 * actually is. ADR-0182 carries it as the one deviation taken on a truth rather than on a constraint.
 */
const WHAT_THE_LIST_IS = 'All functions'

/**
 * The three arguments the artboard closes on, in its own words.
 *
 * The command and the install root are the artboard's own spelling of two facts this repository
 * publishes elsewhere. They are read back by a guard rather than trusted here.
 */
const THE_ARGUMENTS: readonly { readonly heading: string; readonly says: string }[] = [
  {
    heading: 'No dependencies',
    says:
      'npx toopo add copies plain source into lib/toopo/. Nothing is added to your package.json, ' +
      'ever.',
  },
  {
    heading: 'Frozen contracts',
    says:
      "A function's signature and behaviour never change. Updates can fix internals — they can " +
      'never break callers.',
  },
  {
    heading: 'Tested continuously',
    says:
      'Every function carries its own test suite, run on every commit against the frozen contract.',
  },
]

/**
 * One contract as the shelf draws it, which is the `offer` component fed from the registry.
 *
 * What a card *says* is `what-a-card-says.ts`'s - the four figures written twice to the character -
 * and what it *looks like* is the component's. This function is the seam between them and holds
 * neither: it is a translation from a held contract to the data an offer shows.
 *
 * **The command names this contract and never a shape.** ADR-0140 took the template
 * `toopo add domain/function` off this page on the argument that a command belongs to a contract, and
 * ADR-0181 overruled where the page stands rather than that: six cards carry six commands, each about
 * the function above it. W-91 is the cell that puts a template back and it is red on the guard over
 * this page. ADR-0140, ADR-0180, ADR-0183.
 */
const offerFor = (held: Held): Node => {
  const says = whatACardSays(held)

  return offer({
    domain: says.domain,
    name: says.name,
    href: linkTo(pageOf(held.contract.address)),
    address: says.address,
    signature: says.signature,
    summary: says.summary,
    command: says.command,
    language: 'TS',
  })
}

/*
 * The date a row carries is `readableDate`'s, and the section it stands in exists because ADR-0177
 * gave it a source: `publishedAt` was one constant for the whole catalogue, so *Recently added* would
 * have been four rows in an arbitrary order under a heading claiming a chronology. It is per contract
 * now, read off the commit that minted each binding, so the order is a fact rather than the order of
 * a file.
 */

/** How many rows the artboard shows under *Recently added*. */
const THE_RECENT_ROWS = 4

const recently = (held: Held): Node => {
  const says = whatACardSays(held)

  return el(
    'li',
    NOTHING,
    /**
     * The whole row is the target, which is what the artboard draws, and its three parts are blocks.
     *
     * They were three spans and `no-element-runs-into-the-one-beside-it` read the name into the
     * signature into the date as one sentence - the same defect the card's head carried, on the
     * section under it. An anchor may hold flow content, so each part is a paragraph a projection
     * separates and the row is still one thing a reader clicks.
     */
    el(
      'a',
      { class: 'row', href: linkTo(pageOf(held.contract.address)) },
      line('p', says.address, { class: 'call' }),
      line('p', says.signature, { class: 'signature' }),
      line('p', readableDate(held.binding.publishedAt), { class: 'when' }),
      /**
       * The mark the artboard puts at the end of a row, which is a picture of the link and not a
       * second statement of it. `aria-hidden`, so `isChrome` drops it from both projections and a
       * screen reader hears the row once.
       */
      el('p', { class: 'onward', 'aria-hidden': 'true' }, text('›')),
    ),
  )
}

export const frontPage = (
  index: ServedIndex,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const held = domains.flatMap((domain) => domain.held)
  const installable = index.entries.filter((entry) => entry.installable).length
  const turnedDown = index.entries.length - installable

  const newest = [...held]
    .sort((one, other) => other.binding.publishedAt.localeCompare(one.binding.publishedAt))
    .slice(0, THE_RECENT_ROWS)

  return {
    title: 'Toopo — utility functions with a public, executable contract',
    servedBesideItsMarkdown: true,
    structuredData: null,
    description:
      `${installable} utility functions with a published contract: a signature, property-based ` +
      `invariants, and every edge case named and settled. The source is copied into your project.`,
    body: [
      masthead(FRONT_PAGE, menu),
      el(
        'main',
        { class: 'shelf' },
        /**
         * The opening: the headline, the sentence, the field and the domains, centred in a column
         * narrower than the grid under it. Every length is the artboard's.
         */
        el(
          'section',
          { class: 'hero' },
          line('h1', THE_HEADLINE),
          line('p', THE_SENTENCE_UNDER_IT, { class: 'lede' }),
          /**
           * The field a reader types into, served as an empty slot and never as a control.
           *
           * A reader with nothing running meets the headline, the sentence and the whole catalogue,
           * and no box. It is the arrangement ADR-0137 established for the masthead and what
           * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` asks of every
           * control on this site.
           */
          el('div', { class: 'find', 'data-search': theCatalogueFrom(FRONT_PAGE) }),
          el('p', { class: 'sifted', role: 'status', 'aria-live': 'polite' }),
          el(
            'ul',
            { class: 'pills' },
            el('li', NOTHING, pill('all', installable, null)),
            ...domains
              .filter((domain) => domain.held.length > 0)
              .map((domain) =>
                el(
                  'li',
                  NOTHING,
                  pill(domain.name, domain.held.length, linkTo(domainPageOf(domain.address))),
                ),
              ),
          ),
        ),
        el(
          'section',
          { class: 'listing' },
          eyebrow('section', 'h2', WHAT_THE_LIST_IS),
          el('ul', { class: 'offers' }, ...held.map(offerFor)),
        ),
        el(
          'section',
          { class: 'recent' },
          eyebrow('section', 'h2', 'Recently added'),
          el('ul', { class: 'recent-rows' }, ...newest.map(recently)),
        ),
        el(
          'section',
          { class: 'arguments' },
          ...THE_ARGUMENTS.map((one) =>
            el('div', { class: 'argument' }, line('h3', one.heading), line('p', one.says)),
          ),
        ),
        /**
         * What the shelf does not hold, and the way to the catalogue that does.
         *
         * **It is not on the artboard and it is here for a constraint**: no page is removed in this
         * unit, and a page nothing links to is one `every-page-is-reachable-from-the-front-page`
         * refuses. It is composed from the index, so a second refusal lands in it with nobody editing
         * anything. ADR-0182 carries it as an addition rather than a deviation.
         */
        el(
          'p',
          { class: 'elsewhere' },
          text(
            turnedDown === 0
              ? 'Every contract this catalogue holds is above. '
              : `${said(turnedDown, 'contract', 'contracts')} the catalogue considered and turned ` +
                `down ${turnedDown === 1 ? 'is' : 'are'} not listed here. `,
          ),
          el('a', { href: linkTo(CATALOGUE_PAGE) }, text('The whole catalogue')),
        ),
      ),
      footer(FRONT_PAGE, menu),
    ],
  }
}
