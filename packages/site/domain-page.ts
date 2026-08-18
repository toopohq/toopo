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
 * What is not on it
 * ---------------------------------------------------------------------------
 *
 * No section for what the catalogue refused in this domain. It would render for no domain that has a
 * page - `array` is the one domain with a refusal and it has no page, because a page whose list is
 * empty answers nothing the refusals page does not answer better - so it would be a branch nothing
 * exercises, on the surface where an unexercised branch is a section a reader may one day meet in a
 * state nobody has seen.
 */

import { THE_INVOCATION } from '../registry/address.js'
import type { Domain, Held } from './catalogue.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { beside, masthead } from './chrome.js'
import { domainPageOf, linkTo, pageOf } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/** A number with the thousands marked, because a byte count is read as a quantity. */
const grouped = (value: number): string => value.toLocaleString('en-US').replaceAll(',', ' ')

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
 * The plurals are written out rather than suffixed, because `1 contracts` on the day a domain has one
 * is the kind of defect that makes a reader stop believing the numbers beside it.
 */
const whatIsHere = (domain: Domain): string => {
  const contracts = domain.held.length
  const cases = domain.held.reduce((total, held) => total + casesOf(held), 0)
  const bytes = domain.held.reduce((total, held) => total + bytesOf(held), 0)
  const imports = importedBy(domain.held)

  const pulls =
    imports.size === 0
      ? 'imports nothing'
      : `imports ${imports.size} other ${imports.size === 1 ? 'contract' : 'contracts'} of this catalogue`

  return contracts === 1
    ? `One contract here, with ${cases} settled edge cases. Taking it puts ${grouped(bytes)} bytes ` +
        `of TypeScript in your project, and it ${pulls}.`
    : `${contracts} contracts here, and ${cases} settled edge cases between them. Taking all of ` +
        `them puts ${grouped(bytes)} bytes of TypeScript in your project, and ${pulls}.`
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

export const domainPage = (
  domain: Domain,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
): Document => {
  const own = domainPageOf(domain.held[0].contract.address)
  const names = domain.held.map((held) => shortNameOf(held.contract.address.name))

  return {
    /**
     * The functions themselves, because that is what somebody scanning a search result is looking
     * for. A title reading `string — 2 contracts` says the shape of the page and nothing about
     * whether the thing they need is on it.
     */
    title: `${domain.name} — ${names.join(', ')}`,
    servedBesideItsMarkdown: true,
    /** A list of contracts is not source code, and the only `@type` this site publishes is. */
    structuredData: null,
    description:
      `${domain.held.length} utility ${domain.held.length === 1 ? 'function' : 'functions'} over ` +
      `${domain.name}, each with a published contract: a signature, property-based invariants, and ` +
      `every edge case named and settled. The source is copied into your project.`,
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
          el('ul', { class: 'plain' }, ...domain.held.map((held) => entry(held, own))),
        ),
        beside(own, domain, domains, []),
      ),
    ],
  }
}
