/**
 * What a contract is, for somebody who has just arrived and installed nothing.
 * ADR-0129 is why this page exists, why its address is a question rather than a category, and what it
 * deliberately does not repeat.
 *
 * ---------------------------------------------------------------------------
 * It moves matter rather than adding it, and one section is genuinely new
 * ---------------------------------------------------------------------------
 *
 * Three of its four sections were **one paragraph** in an aside of the front page - a contract is frozen
 * for life, an implementation freezes nothing, a contribution is an implementation or an input and
 * never a contract. Three arguments stacked in a box beside a list, on the surface a stranger meets
 * first. ADR-0119 measured that this site is read in two halves and cut a contract page on it; this is
 * the same cut on the front page, and what the sections gain is room rather than words.
 *
 * The new one is the seven files, and the site had no page saying what a contract is made of - which is
 * the product. `the-seven-files.ts` carries the names and the meanings as one constant, so this page
 * describes exactly the list an installation is checked against and there is nothing here to drift.
 *
 * ---------------------------------------------------------------------------
 * What is not on it, and where it is instead
 * ---------------------------------------------------------------------------
 *
 * **How each field is checked is not here.** The mock-up draws it, and the method page already composes
 * it from `FIELD_MAP` - every field of a contract record with the stratum it is verified at, which is a
 * table this page could only copy. A link goes there instead, which is the relation ADR-0119 already
 * settled between a summary and the thing it summarises.
 */

import type { ContractFile } from '../registry/the-seven-files.js'
import { THE_SEVEN_FILES } from '../registry/the-seven-files.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { masthead } from './chrome.js'
import { METHOD_PAGE, WHAT_A_CONTRACT_IS_PAGE, linkTo, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * One file, as a name and what opening it gives you.
 *
 * The name is a heading rather than a term in a list, so the outline of this page names all seven -
 * which is what a reader scanning for *where is the implementation* is doing, and what the Markdown
 * twin and the sitemap description are built from.
 */
const file = (entry: ContractFile): Node =>
  el(
    'li',
    NOTHING,
    el('h3', { class: 'call' }, line('code', entry.name)),
    line('p', entry.what, { class: 'why' }),
  )

export const whatAContractIsPage = (menu: readonly MenuEntry[]): Document => {
  const own = WHAT_A_CONTRACT_IS_PAGE

  return {
    title: 'A contract is the whole specification of one function',
    servedBesideItsMarkdown: true,
    /** A description of what a contract is is not source code, and the only `@type` here is. */
    structuredData: null,
    description:
      `Its signature, the invariants that must hold for every input, and every edge case named, ` +
      `settled and argued for — in ${THE_SEVEN_FILES.length} files of which one is the ` +
      `implementation. Anything that satisfies the other six can replace it.`,
    body: [
      masthead(own, menu),

      line('h1', 'A contract is the whole specification of one function'),
      line(
        'p',
        'Its signature, the invariants that must hold for every input, and every edge case named, ' +
          'settled and argued for. Anything that satisfies it can replace anything else that does, ' +
          'which is what makes an implementation a detail.',
        { class: 'lede' },
      ),

      /**
       * The count is read off the list rather than written, so the heading cannot say seven while the
       * list holds eight. It is the rule this repository applies to every figure it publishes, met on
       * the one page whose subject is a count of files.
       *
       * **And the heading does not open on the digit**, which `domain-page.ts` states as the reason its
       * own opening sentence is built the way it is. Written `7 files, of which one is…` the largest
       * type in the section starts on a numeral; `A contract is 7 files` reads as a sentence and keeps
       * the figure derived.
       */
      line(
        'h2',
        `A contract is ${THE_SEVEN_FILES.length} files, of which one is the implementation`,
      ),
      line(
        'p',
        'The others are what judges it. All of them are readable before you install anything, and ' +
          'all of them are served at the contract’s own address, so a copy of the harness can be ' +
          'checked against the definition and then run against any implementation.',
      ),
      el('ul', { class: 'plain' }, ...THE_SEVEN_FILES.map(file)),

      line('h2', 'A published contract is frozen for life'),
      line(
        'p',
        'Frozen for the life of its major version, and almost everything it settles is an address ' +
          'that can never move: a case that was published is a case a reader can link to for as ' +
          'long as the major exists. That is a heavier promise than a version number, and it is why ' +
          'a contract is written in full and measured before it is published — including the ones ' +
          'that are then turned down.',
      ),

      line('h2', 'An implementation freezes nothing'),
      line(
        'p',
        'It competes under a contract that already exists, and that contract’s own suite — public, ' +
          'and runnable by anyone — is what decides between it and ours. An implementation the ' +
          'registry stops recommending goes on being served, so the opinion changes what is ' +
          'suggested and never what is reachable: a project that installed it keeps resolving its ' +
          'digest.',
      ),

      line('h2', 'What a contribution can be'),
      line(
        'p',
        'An implementation, or an input where ours is wrong — never a contract. Because a contract ' +
          'is frozen and almost everything it settles is an address that can never move, it is ours ' +
          'to keep rather than yours to send. CONTRIBUTING.md in the repository says what can be ' +
          'received today and what cannot.',
      ),

      line('h2', 'Not every field is checked the same way'),
      el(
        'p',
        NOTHING,
        text(
          'A contract is a record, and each of its fields carries the stratum it is verified at — so ' +
            'you are told which sentences no run could falsify instead of being left to assume they ' +
            'were all checked. That table is on the method page, field by field: ',
        ),
        el(
          'a',
          { href: `${rootFrom(own)}${linkTo(METHOD_PAGE)}` },
          text('how we verify, and what it does not prove'),
        ),
        text('.'),
      ),
    ],
  }
}
