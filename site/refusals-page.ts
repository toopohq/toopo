/**
 * What the catalogue turned down, and the measurement each refusal rests on.
 *
 * ---------------------------------------------------------------------------
 * The page this project can publish on day one and almost nobody else can
 * ---------------------------------------------------------------------------
 *
 * `array/group-by@1` was written in full - contract, reference, properties, thirty settled cases, its
 * own mutation battery - and then refused, because ES2024 shipped `Map.groupBy` and it answers what
 * the contract requires on every one of those thirty cases. That last clause is the point: the refusal
 * is not an opinion about a built-in, it is a *replayed measurement*, and `language.test.ts` is where
 * it runs.
 *
 * ---------------------------------------------------------------------------
 * Two retirements, and they are not one
 * ---------------------------------------------------------------------------
 *
 * A contract decided against before publication has no callers and nothing frozen. A contract the
 * language absorbed *after* publication is still frozen, still served and still installable, because
 * permanent rule 6 forbids unpublishing it. Collapsing them would either strand the first in a
 * catalogue it was refused from, or let the second read as though it had never existed.
 *
 * The second list is empty today and its section is not rendered when it is - an empty heading tells a
 * reader something is missing without telling them what, which is the rule the contract page follows
 * about benchmarks.
 *
 * ---------------------------------------------------------------------------
 * What this page cannot say, named rather than left to be noticed
 * ---------------------------------------------------------------------------
 *
 * A refused contract has no binding and no snapshot, so its own prose - the comparison of lodash,
 * Ramda, d3 and the two ES2024 built-ins that makes its case - is not reachable from any endpoint. The
 * registry serves a refusal, not a definition of the thing refused. What is here is what the registry
 * holds: the address, the summary from the index, the decision, the measurement, and what the contract
 * is kept as.
 */

import { renderContract, sameContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import { REFUSALS_PAGE, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: string, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

export const refusalsPage = (index: ServedIndex, refusals: ServedRefusals): Document => {
  const summaryOf = (address: Parameters<typeof renderContract>[0]): string =>
    index.entries.find((entry) => sameContract(entry.address, address))?.summary ?? ''

  return {
    title: 'What Toopo refuses, and why',
    description:
      `${refusals.refusals.length} contract${refusals.refusals.length === 1 ? ' was' : 's were'} ` +
      `written in full and then turned down. Each refusal is published with the measurement it was ` +
      `decided on.`,
    body: [
      el('nav', NOTHING, el('a', { href: rootFrom(REFUSALS_PAGE) }, text('Toopo'))),

      line('h1', 'What we refuse, and why'),
      line(
        'p',
        'A registry that only shows what it accepted is a registry whose standard nobody can see. ' +
          'These contracts were written in full — signature, properties, every edge case settled — ' +
          'and then turned down. Each refusal is published with the measurement it rests on, so it ' +
          'can be disagreed with.',
        { class: 'lede' },
      ),

      ...refusals.refusals.flatMap((refusal) => [
        line('h2', renderContract(refusal.address)),
        line('p', summaryOf(refusal.address), { class: 'why' }),
        line('h3', 'Turned down for'),
        line('p', refusal.decidedAgainst),
        line('h3', 'On this measurement'),
        line('p', refusal.measurement),
        line('h3', 'Kept as'),
        line('p', refusal.keptAs),
      ]),

      ...(refusals.absorbed.length === 0
        ? []
        : [
            line('h2', 'Answered by the language after we published it'),
            line(
              'p',
              'These are still frozen, still served and still installable: a published version is ' +
                'frozen for life, so a contract the language later absorbed is flagged rather than ' +
                'withdrawn from under the projects that installed it.',
            ),
            ...refusals.absorbed.flatMap((binding) => [
              line('h3', renderContract(binding.address)),
              line(
                'p',
                binding.lifecycle.state === 'absorbed-by-the-language'
                  ? `${binding.lifecycle.answeredBy} ${binding.lifecycle.measurement}`
                  : '',
              ),
            ]),
          ]),
    ],
  }
}
