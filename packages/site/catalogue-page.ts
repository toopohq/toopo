/**
 * The page the whole catalogue fits on, which at five contracts is the whole site's navigation.
 *
 * It is deliberately not a search. Search is a unit of its own and `packages/cli/search.ts` already holds the
 * matching rule it will be built on; what a catalogue of five needs is to be *read*, and a list a
 * reader can take in at once beats a box they have to guess a word for.
 *
 * A contract the catalogue refused is listed and carries no install command, which is the rule
 * `toopo search` already follows on the terminal: it must be findable, because somebody who has heard
 * of it deserves to be told the catalogue considered it and why, and it must never be offered.
 */

import { renderContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import { METHOD_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

export const cataloguePage = (index: ServedIndex, refusals: ServedRefusals): Document => ({
  title: 'Toopo — utility functions with a public, executable contract',
  /** A list of contracts is not source code, and the only `@type` this site publishes is. */
  servedBesideItsMarkdown: true,
  structuredData: null,
  /**
   * Counted over the installable entries rather than over the index, because a refused contract has
   * no published contract behind it: `refuseContract` records an argument and binds no digest, so
   * `array/group-by@1` has no signature, no invariants and no frozen definition to have. Saying *each*
   * of five would have been the front page's first sentence contradicting its own refusals page.
   */
  description:
    `${index.entries.filter((entry) => entry.installable).length} utility functions with a ` +
    `published contract: a signature, property-based invariants, and every edge case named and ` +
    `settled. The source is copied into your project.`,
  body: [
    line('h1', 'Toopo'),
    line(
      'p',
      'Utility functions you copy into your project, each verified against a public, executable ' +
        'contract. Not a dependency: the source lands in your repository and it is yours.',
      { class: 'lede' },
    ),
    line(
      'p',
      /**
       * It used to read *implementations compete underneath it and are interchangeable*, which
       * describes a catalogue this one is not: every contract here has exactly one implementation,
       * ours. A conditional is what survives - anything satisfying the contract can replace anything
       * else that does - because it is true of a catalogue with one implementation and of a catalogue
       * with twenty, and it is the claim the contract actually makes. No count is written, for the
       * reason this repository keeps rediscovering in its own prose: a number in a sentence outlives
       * the data it counted.
       */
      'A contract is the whole behavioural specification of one function — its signature, the ' +
        'invariants that must hold for every input, and every edge case named, settled and argued ' +
        'for. Anything that satisfies it can replace anything else that does, which is what makes ' +
        'an implementation a detail. The contract is what this project publishes; the code is what ' +
        'it hands you.',
    ),

    line('h2', `${index.entries.length} contracts`),
    el(
      'ul',
      { class: 'plain' },
      ...index.entries.map((entry) =>
        el(
          'li',
          NOTHING,
          /**
           * A contract's name is a heading that happens to be a link, and it used to be a bare anchor.
           *
           * Read in document order it came out as `typescript/number/parse@1Convert a string to a
           * finite number` - an anchor is phrasing content and carries no separator, so the summary
           * began mid-line, on the first screen of the site. **The repair is here rather than in the
           * separator table, and the measurement is what says so:** across the seven pages there is not
           * one anchor written inside a sentence, and nine of the fourteen a reader can see are already
           * the sole child of an element that separates. Giving `a` a separator would state something
           * about a phrasing element that is false of every other phrasing element beside it, to repair
           * five places where the mistake is that a title was not written as one.
           *
           * The tag is the outline and the class is the look, which is what settles both halves at once.
           * The tag, because the refusals page already renders this exact pair - an address and the
           * summary under it - as a heading and a paragraph, and two renderings of one thing drift until
           * one lies: the front page's outline held its four sections and not one contract name, on the
           * page that *is* this site's navigation. The class, because 121 of the 126 list items here
           * open with `.call` and these five are the only departure.
           */
          el(
            'h3',
            { class: 'call' },
            el(
              'a',
              { href: linkTo(entry.installable ? pageOf(entry.address) : REFUSALS_PAGE) },
              text(renderContract(entry.address)),
            ),
          ),
          line('p', entry.summary, { class: 'why' }),
          line(
            'p',
            entry.installable
              ? `toopo add ${entry.address.name}`
              : 'Considered and turned down — see what we refuse and why.',
            { class: 'meta' },
          ),
        ),
      ),
    ),

    ...(refusals.refusals.length === 0
      ? []
      : [
          line('h2', 'What we refuse'),
          line(
            'p',
            `${refusals.refusals.length} of these ${index.entries.length} ` +
              `${refusals.refusals.length === 1 ? 'was' : 'were'} written in full and then turned ` +
              `down. What they were turned down for, and the measurement each decision rests on, ` +
              `is published beside them.`,
          ),
          el('p', NOTHING, el('a', { href: linkTo(REFUSALS_PAGE) }, text('What we refuse, and why'))),
        ]),

    line('h2', 'How we verify'),
    line(
      'p',
      'A test suite that has never failed proves nothing. Every contract here is measured by ' +
        'breaking the implementation on purpose and requiring the suite to notice — and what those ' +
        'measurements did not catch is published beside what they did.',
    ),
    el('p', NOTHING, el('a', { href: linkTo(METHOD_PAGE) }, text('How we verify, and what it does not prove'))),

    /**
     * The question every visitor arrives with and the site had no answer to, and silence in front of
     * it is not neutrality.
     *
     * **It carries no link, and that is the page's own guard rather than an omission.**
     * `every-page-is-reachable-from-the-front-page` compares every `href` here against the set of
     * pages, so an address outside the site cannot be written on this page at all - and there is no
     * address to write: this repository has no public remote, and inventing a URL to fill the gap is
     * the class the whole project spends its length removing. So the file is named and not linked.
     *
     * **No figure, deliberately.** The ratio that carries this argument lives in `CONTRIBUTING.md`,
     * where a guard derives it from the five records; restating it here would be a second statement
     * of one measurement, on the surface that cannot compute it. A sentence that is true without
     * counting does not count.
     */
    line('h2', 'What a contribution can be'),
    line(
      'p',
      'An implementation, or an input where ours is wrong — never a contract. A contract is frozen ' +
        'for the life of its major version, and almost everything it settles is an address that can ' +
        'never move, so it is ours to keep rather than yours to send. An implementation freezes ' +
        'nothing: it competes under a contract that already exists, and that contract\'s own suite — ' +
        'public, and runnable by anyone — is what decides between it and ours. CONTRIBUTING.md in the ' +
        'repository says what can be received today and what cannot.',
    ),
  ],
})
