/**
 * The page the whole catalogue fits on, which at five contracts is the whole site's navigation.
 *
 * It is deliberately not a search. Search is a unit of its own and `cli/search.ts` already holds the
 * matching rule it will be built on; what a catalogue of five needs is to be *read*, and a list a
 * reader can take in at once beats a box they have to guess a word for.
 *
 * A contract the catalogue refused is listed and carries no install command, which is the rule
 * `toopo search` already follows on the terminal: it must be findable, because somebody who has heard
 * of it deserves to be told the catalogue considered it and why, and it must never be offered.
 */

import { renderContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import { METHOD_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'

const NOTHING = {} as const

const line = (tag: string, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

export const cataloguePage = (index: ServedIndex, refusals: ServedRefusals): Document => ({
  title: 'Toopo — utility functions with a public, executable contract',
  description:
    `${index.entries.length} utility functions, each with a published contract: a signature, ` +
    `property-based invariants, and every edge case named and settled. The source is copied into ` +
    `your project.`,
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
      'A contract is the whole behavioural specification of one function — its signature, the ' +
        'invariants that must hold for every input, and every edge case named, settled and argued ' +
        'for. Implementations compete underneath it and are interchangeable. The contract is what ' +
        'this project publishes; the code is what it hands you.',
    ),

    line('h2', `${index.entries.length} contracts`),
    el(
      'ul',
      { class: 'plain' },
      ...index.entries.map((entry) =>
        el(
          'li',
          NOTHING,
          el(
            'a',
            { href: linkTo(entry.installable ? pageOf(entry.address) : REFUSALS_PAGE) },
            text(renderContract(entry.address)),
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
            `${refusals.refusals.length} of these ${index.entries.length} were written in full and ` +
              `then turned down. What they were turned down for, and the measurement each decision ` +
              `rests on, is published beside them.`,
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
  ],
})
