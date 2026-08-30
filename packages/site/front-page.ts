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
import { whatACardSays } from './what-a-card-says.js'
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
 * The mark that says a contract's definition is frozen, drawn as the artboard draws it.
 *
 * `aria-hidden` on the drawing and the word beside it in text, which is the split `isChrome` already
 * makes: a padlock is a picture of the claim and the claim is the word. So a screen reader hears
 * `stable` once and every projection carries it once.
 */
const theFrozenMark = (): Node =>
  el(
    'span',
    { class: 'stable' },
    el(
      'svg',
      { width: '9', height: '9', viewBox: '0 0 16 16', 'aria-hidden': 'true' },
      el('rect', { x: '3', y: '7', width: '10', height: '7', rx: '1.5', fill: 'currentColor' }),
      el('path', {
        d: 'M5 7 V5 a3 3 0 0 1 6 0 V7',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.6',
      }),
    ),
    text('stable'),
  )

/**
 * One contract as the shelf draws it: the name, what it is frozen as, its shape, what it does, and
 * the command that takes it.
 *
 * The order is the artboard's and so is every part of it. The install line is a block of its own at
 * the foot of the card, ruled off, because that is where the design puts the thing a reader acts on -
 * and `start.ts` appends the copy control to it, exactly as it does on a contract page.
 */
const offer = (held: Held): Node => {
  const says = whatACardSays(held)

  return el(
    'li',
    { class: 'offer', 'data-contract': says.address },
    /**
     * The name and the two marks, on one row and as three blocks in the reading.
     *
     * **They were three phrasing elements side by side and `no-element-runs-into-the-one-beside-it`
     * refused it**, correctly: the reading ran `number/parse` into `stable` into `TS` as one word,
     * which is exactly what that guard exists for. The row is a flex container either way; what
     * changed is that each part is a block a projection separates rather than three spans nothing
     * does. ADR-0025 is the rule - a separator belongs to a block, and a phrasing element gets none.
     */
    el(
      'div',
      { class: 'head' },
      el(
        'p',
        { class: 'named' },
        el(
          'a',
          { class: 'call', href: linkTo(pageOf(held.contract.address)) },
          el('span', { class: 'of' }, text(`${says.domain}/`)),
          text(says.name),
        ),
      ),
      el(
        'ul',
        { class: 'marks' },
        el('li', NOTHING, theFrozenMark()),
        el('li', NOTHING, el('span', { class: 'language' }, text('TS'))),
      ),
    ),
    line('pre', says.signature, { class: 'signature' }),
    line('p', says.summary, { class: 'says' }),
    line('pre', says.command, { class: 'install' }),
  )
}

/**
 * A domain, as a way into the part of the catalogue filed under it.
 *
 * **The artboard's chips filter the grid in the browser and these are links**, which is constraint 1
 * deciding a shape: a chip that narrows the page needs JavaScript, and a domain already has a page
 * listing exactly what a filtered grid would show. So a reader with nothing running gets the same
 * answer as a reader with everything, and `every-page-is-reachable-from-the-front-page` reaches every
 * domain page from here. ADR-0182.
 */
const chip = (name: string, count: number, href: string): Node =>
  el(
    'li',
    NOTHING,
    el('a', { class: 'chip', href }, text(name), el('span', { class: 'count' }, text(String(count)))),
  )

/**
 * The chip for the list a reader is already looking at, which the artboard draws as the selected one.
 *
 * It is marked and never linked, for the reason `chrome.ts` marks the page you are on: a link to what
 * is already in front of you is a control that does nothing. `aria-current` is the declaration for it
 * rather than a class this repository invented, and it is the same one the masthead uses.
 *
 * The catalogue keeps its way in - the closing line links it - so nothing became unreachable by this.
 * ADR-0182.
 */
const theChipYouAreOn = (name: string, count: number): Node =>
  el(
    'li',
    NOTHING,
    el(
      'span',
      { class: 'chip here', 'aria-current': 'true' },
      text(name),
      el('span', { class: 'count' }, text(String(count))),
    ),
  )

/** The month a reader reads, from the instant the registry publishes. */
const THE_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/**
 * When a contract was published, in the artboard's own spelling.
 *
 * **This section exists because ADR-0177 gave it a source.** It was the one part of the design nothing
 * here could answer: `publishedAt` was one constant for the whole catalogue, so *Recently added* would
 * have been four rows in an arbitrary order under a heading claiming a chronology. It is per contract
 * now, read off the commit that minted each binding, so the order is a fact rather than the order of a
 * file.
 */
const readableDate = (instant: string): string => {
  const when = new Date(instant)

  return `${THE_MONTHS[when.getUTCMonth()] as string} ${when.getUTCDate()}, ${when.getUTCFullYear()}`
}

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
            { class: 'chips' },
            theChipYouAreOn('all', installable),
            ...domains
              .filter((domain) => domain.held.length > 0)
              .map((domain) =>
                chip(domain.name, domain.held.length, linkTo(domainPageOf(domain.address))),
              ),
          ),
        ),
        el(
          'section',
          { class: 'listing' },
          line('h2', WHAT_THE_LIST_IS),
          el('ul', { class: 'offers' }, ...held.map(offer)),
        ),
        el(
          'section',
          { class: 'recent' },
          line('h2', 'Recently added'),
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
