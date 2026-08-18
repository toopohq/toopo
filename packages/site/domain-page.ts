/**
 * The page a domain has: what is published in this corner of the catalogue, and what taking it costs.
 * ADR-0121 is why its opening sentence is composed rather than written, and what that cost.
 *
 *
 * ---------------------------------------------------------------------------
 * Every term of the opening sentence comes from the registry
 * ---------------------------------------------------------------------------
 *
 * The mock-up opens this page on a hand-written line - *four contracts over text held in memory, every
 * one of them counting in Unicode code points* - and marks it as somebody's placeholder. Two things
 * are wrong with writing it for real, and only the second is about work.
 *
 * A sentence about a domain is a **fifth** statement of what is in it, beside the contract list under
 * it, the index, the sitemap and each contract's own summary. Nothing keeps it true. The day a domain
 * gains a contract that does not fit the sentence, the sentence is what a reader believes, because it
 * is the first thing on the page and the list is below the fold.
 *
 * So the opening is composed from what the registry already answers: how many contracts, how many
 * cases they settle, what they weigh, what they import. ADR-0043's rule arriving on prose rather than
 * on a report - **a sentence that cannot be false is worth more than a sentence somebody checked** -
 * and the consequence is that a fifth contract lands in this sentence without anybody editing it.
 *
 * **What it deliberately is not is a row of figures.** The mock-up draws one, and the four numbers in
 * it are the four in this sentence: a page carrying both would state one measurement twice, which is
 * the defect this folder spends its length removing. A sentence is the half that a reader who is not
 * scanning can use, and it is the half that survives `toText` and `toMarkdown` as something other than
 * four numbers in a row.
 *
 * ---------------------------------------------------------------------------
 * What this domain turned down is on it, and that paragraph used to say the opposite
 * ---------------------------------------------------------------------------
 *
 * It read: *no section for what the catalogue refused in this domain; it would render for no domain
 * that has a page, so it would be a branch nothing exercises.* That was true of a catalogue where
 * `array` had no page, and the reason it had none was that its list would be empty. Both halves moved
 * together: a refusal is a state of a contract rather than an entry on a page of its own, so the domain
 * that turned something down is the domain a reader climbs to from it. ADR-0126.
 *
 * **The branch is exercised on exactly one page and every other domain proves the other arm**, which is
 * the state the old paragraph was written to avoid and is now reached rather than argued around.
 *
 * ---------------------------------------------------------------------------
 * What is still not on it
 * ---------------------------------------------------------------------------
 *
 * A turned-down contract is named with the reason it was turned down and nothing else. It has no
 * summary here because `ServedRefusal` carries none - the summary lives in the index, and reaching for
 * a second answer to decorate a mention would make this page need two where the refusal needs one.
 */

import { THE_INVOCATION } from '../registry/address.js'
import type { Domain, Held, TurnedDown } from './catalogue.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import { grouped } from './quantity.js'
import type { MenuEntry } from './chrome.js'
import { beside, masthead } from './chrome.js'
import { domainPageOf, linkTo, pageOf, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** What one contract settles, weighs and pulls in - the three figures a reader is choosing on. */
const casesOf = (held: Held): number =>
  held.contract.caseTables.reduce((count, table) => count + table.cases.length, 0)

const bytesOf = (held: Held): number =>
  held.implementation.files.reduce((total, file) => total + file.bytes, 0)

/**
 * What a domain's contracts import between them, counted as a set and never as a sum.
 *
 * Two contracts depending on the same third one is one thing a reader takes on, not two. Permanent
 * rule 2 is what makes this countable at all: an import here is another contract of this registry and
 * never a package, so it has a name that can be put in a set.
 */
const importedBy = (held: readonly Held[]): ReadonlySet<string> =>
  new Set(held.flatMap((one) => one.implementation.dependsOn.map((name) => String(name))))

/**
 * The sentence the page opens on, composed from four things the registry answers.
 *
 * **Every figure is a digit, and the sentence is built so that none of them opens it.** The first
 * draft spelled the singular - *One contract here* - beside a plural that read *2 contracts here*, so
 * one page of three stated its count in words and the other two in figures. A reader comparing two
 * domain pages is comparing quantities, and quantities that change register are quantities somebody
 * has to stop and convert. The plural of the noun is still written out, because `1 contracts` is the
 * kind of defect that makes a reader stop believing the numbers beside it.
 */
const whatIsHere = (domain: Domain): string => {
  const contracts = domain.held.length
  const cases = domain.held.reduce((total, held) => total + casesOf(held), 0)
  const bytes = domain.held.reduce((total, held) => total + bytesOf(held), 0)
  const imports = importedBy(domain.held)
  const refused = domain.turnedDown.length

  const pulls =
    imports.size === 0
      ? 'nothing'
      : `${imports.size} other ${imports.size === 1 ? 'contract' : 'contracts'} of this catalogue`

  const settles =
    contracts === 1
      ? `${cases} named edge cases`
      : `${cases} named edge cases between them`

  /**
   * What was turned down, appended rather than woven in, so the first sentence a reader meets is about
   * what they can take and the second is about what the catalogue decided against.
   *
   * A domain that publishes nothing opens on the second, because there is no first: `This domain
   * publishes 0 contracts, settling 0 named edge cases` is a sentence composed correctly out of
   * nothing, which is the shape ADR-0027's rule refuses - *an empty section tells a reader something is
   * missing without telling them what*, arriving on a sentence instead of on a heading.
   */
  const turnedDown =
    refused === 0
      ? ''
      : ` ${refused} ${refused === 1 ? 'contract was' : 'contracts were'} written in full and then ` +
        `turned down, each with the measurement it was refused on.`

  if (contracts === 0) return `This domain publishes nothing.${turnedDown}`.trim()

  return (
    `This domain publishes ${contracts} ${contracts === 1 ? 'contract' : 'contracts'}, settling ` +
    `${settles}. Taking ${contracts === 1 ? 'it' : 'all of them'} puts ${grouped(bytes)} bytes of ` +
    `TypeScript in your project, and ${contracts === 1 ? 'it imports' : 'they import'} ${pulls}.` +
    turnedDown
  )
}

/** The last segment of a contract's name, which is what tells it apart inside its own domain. */
const shortNameOf = (name: string): string => name.slice(name.indexOf('/') + 1)

/**
 * One contract as this page lists it: the name, what it does, what it costs, and how to take it.
 *
 * The same four things the card of its own page opens on, in the same order, because a reader
 * scanning a domain and a reader landing on a contract are asking the same question and the second
 * should not have to learn a new layout to answer it.
 */
const entry = (held: Held, own: string): Node => {
  const cases = casesOf(held)
  const bytes = bytesOf(held)
  const imports = held.implementation.dependsOn.length

  return el(
    'li',
    NOTHING,
    el(
      'h2',
      { class: 'call' },
      el(
        'a',
        { href: `../../${linkTo(pageOf(held.contract.address))}` },
        text(shortNameOf(held.contract.address.name)),
      ),
    ),
    line('p', held.contract.identity.summary, { class: 'why' }),
    line(
      'p',
      `${cases} settled ${cases === 1 ? 'case' : 'cases'} · ${grouped(bytes)} bytes · ` +
        `${imports === 0 ? 'no imports' : `${imports} ${imports === 1 ? 'import' : 'imports'}`}`,
      { class: 'meta' },
    ),
    line('p', `${THE_INVOCATION} add ${held.contract.address.name}`, { class: 'meta' }),
  )
}

/**
 * One contract this domain turned down: what it was called, and what it was turned down for.
 *
 * **No install line, and that is the whole difference from the entry above.** A command for something
 * that cannot be installed is the defect
 * `nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` already refuses on a
 * contract page, met here on a list.
 *
 * The argument behind the refusal is a link and not a paragraph. What makes a refusal worth publishing
 * is the measurement it rests on, and a measurement quoted in a list is a measurement without the
 * comparison that gives it its force - so the mention says what happened and the page written for it
 * says why.
 */
const turnedDownEntry = (turnedDown: TurnedDown, own: string): Node =>
  el(
    'li',
    NOTHING,
    el(
      'h2',
      { class: 'call' },
      el(
        'a',
        { href: `${rootFrom(own)}${linkTo(pageOf(turnedDown.refusal.address))}` },
        text(shortNameOf(turnedDown.refusal.address.name)),
      ),
    ),
    line('p', turnedDown.summary, { class: 'why' }),
    line('p', `Turned down for ${turnedDown.refusal.decidedAgainst}`, { class: 'meta' }),
  )

export const domainPage = (
  domain: Domain,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const own = domainPageOf(domain.address)
  const names = domain.held.map((held) => shortNameOf(held.contract.address.name))

  return {
    /**
     * The functions themselves, because that is what somebody scanning a search result is looking
     * for. A title reading `string — 2 contracts` says the shape of the page and nothing about
     * whether the thing they need is on it.
     */
    title:
      names.length === 0
        ? `${domain.name} — nothing published, ${domain.turnedDown.length} turned down`
        : `${domain.name} — ${names.join(', ')}`,
    servedBesideItsMarkdown: true,
    /** A list of contracts is not source code, and the only `@type` this site publishes is. */
    structuredData: null,
    description:
      domain.held.length === 0
        ? `Nothing is published over ${domain.name}. What the catalogue turned down here is named ` +
          `with the measurement it was refused on, because a registry that only shows what it ` +
          `accepted is a registry whose standard nobody can see.`
        : `${domain.held.length} utility ${domain.held.length === 1 ? 'function' : 'functions'} over ` +
          `${domain.name}, each with a published contract: a signature, property-based invariants, ` +
          `and every edge case named and settled. The source is copied into your project.`,
    body: [
      masthead(own, menu),
      el(
        'div',
        { class: 'shell' },
        el(
          'main',
          NOTHING,
          line('p', `typescript / ${domain.name}`, { class: 'address' }),
          line('h1', domain.name),
          line('p', whatIsHere(domain), { class: 'lede' }),
          /**
           * The same block the front page lists a catalogue with, and it takes the same class: two
           * contracts abreast where the column is two measures wide, one where it is not. A domain
           * of a thousand is the case this is for; at four it is what keeps the page from being a
           * ribbon down the left of a wide screen.
           */
          ...(domain.held.length === 0
            ? []
            : [el('ul', { class: 'plain contracts' }, ...domain.held.map((held) => entry(held, own)))]),
          ...(domain.turnedDown.length === 0
            ? []
            : [
                line('h2', 'What this domain turned down'),
                el(
                  'ul',
                  { class: 'plain' },
                  ...domain.turnedDown.map((one) => turnedDownEntry(one, own)),
                ),
              ]),
        ),
        beside(own, domain, domains, []),
      ),
    ],
  }
}
