/**
 * The index of what the catalogue turned down, one line each, at the address that list has always had.
 * ADR-0127 is why a refusal is explained at the contract's own address and only listed here.
 *
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
 * reader something is missing without telling them what, which is ADR-0027's rule and the reason that
 * record still governs this file after ADR-0127 took the explaining half of it away.
 *
 * ---------------------------------------------------------------------------
 * What this page cannot say, named rather than left to be noticed
 * ---------------------------------------------------------------------------
 *
 * A refused contract has no binding and no snapshot, so its own prose - the comparison of lodash,
 * Ramda, d3 and the two ES2024 built-ins that makes its case - is not reachable from any endpoint. The
 * registry serves a refusal, not a definition of the thing refused, and `turned-down-page.ts` says so
 * on the page where a reader would look for it.
 *
 * ---------------------------------------------------------------------------
 * The address is kept and the job changed, which is the whole of ADR-0125 applied
 * ---------------------------------------------------------------------------
 *
 * This page used to carry the decision, the measurement and what each contract is kept as. Those moved
 * to the contract's own address. **The address did not move with them**, because an address this tree
 * has served goes on being written and what it says is free to change - and `/refused/` has been served
 * since the first deployment, is in the sitemap and is in the index a retriever reads. A reader who
 * kept the link gets the list of what the catalogue turned down, which is the question they followed it
 * for.
 */

import { renderContract, sameContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { masthead } from './chrome.js'
import { REFUSALS_PAGE, linkTo, pageOf, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

export const refusalsPage = (
  index: ServedIndex,
  refusals: ServedRefusals,
  menu: readonly MenuEntry[],
): Document => {
  const summaryOf = (address: Parameters<typeof renderContract>[0]): string =>
    index.entries.find((entry) => sameContract(entry.address, address))?.summary ?? ''

  return {
    title: 'What Toopo refuses, and why',
    /** A judgement about contracts is not source code, and a refused contract has none to point at. */
    servedBesideItsMarkdown: true,
    structuredData: null,
    description:
      `${refusals.refusals.length} contract${refusals.refusals.length === 1 ? ' was' : 's were'} ` +
      `written in full and then turned down. Each refusal is published with the measurement it was ` +
      `decided on.`,
    body: [
      masthead(REFUSALS_PAGE, menu),

      line('h1', 'What we refuse, and why'),
      line(
        'p',
        'A registry that only shows what it accepted is a registry whose standard nobody can see. ' +
          'These contracts were written in full — signature, properties, every edge case settled — ' +
          'and then turned down. Each one is at its own address, with the measurement its refusal ' +
          'rests on, so the decision can be disagreed with.',
        { class: 'lede' },
      ),

      /**
       * One line each, linking to the contract's own address, and the measurement is not here.
       *
       * **This page was where a refusal was explained and is now the index of them**, which is
       * ADR-0127. What makes a refusal worth publishing is the measurement it rests on, and a
       * measurement quoted in a list is one without the comparison that gives it force - so the list
       * says what happened and the page at the contract's address says why. It is the relation a domain
       * page already has to a contract page, applied to refusals.
       */
      el(
        'ul',
        { class: 'plain' },
        ...refusals.refusals.map((refusal) =>
          el(
            'li',
            NOTHING,
            el(
              'h2',
              { class: 'call' },
              el(
                'a',
                { href: `${rootFrom(REFUSALS_PAGE)}${linkTo(pageOf(refusal.address))}` },
                text(renderContract(refusal.address)),
              ),
            ),
            line('p', summaryOf(refusal.address), { class: 'why' }),
            line('p', `Turned down for ${refusal.decidedAgainst}`, { class: 'meta' }),
          ),
        ),
      ),

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
