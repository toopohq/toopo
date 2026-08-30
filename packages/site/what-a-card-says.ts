/**
 * What one contract says on a card, decided once for every surface that shows one.
 * ADR-0180 is why this exists; ADR-0157 is the shape it borrows.
 *
 * ---------------------------------------------------------------------------
 * The content is shared and the markup is not, and that is the whole design
 * ---------------------------------------------------------------------------
 *
 * Three surfaces show a contract as a card: its own page, the domain page that lists it, and the front
 * page. `domain-page.ts` said so in its own words before this module existed - *the same four things
 * the card of its own page opens on, in the same order, because a reader scanning a domain and a
 * reader landing on a contract are asking the same question and the second should not have to learn a
 * new layout to answer it* - and then computed them again.
 *
 * **What was really duplicated was arithmetic, and it was duplicated to the character.**
 * `contract-page.ts` and `domain-page.ts` each carried
 * `caseTables.reduce((count, table) => count + table.cases.length, 0)` and
 * `files.reduce((total, file) => total + file.bytes, 0)`. Two statements of one figure are two things
 * that can come to disagree about what a reader is choosing on.
 *
 * **The markup is deliberately not shared.** A card on a contract's own page opens with an `h1`, a card
 * in a domain's list opens with an `h2` inside an `li`, and a card on the front page is a cell of a
 * grid. Those are three page outlines rather than three renderings of one thing, and
 * `the-rail-of-a-page-names-every-section-of-it-and-only-those` reads the outline. A builder returning
 * one fixed tree would have to be told the tag, the heading level and the wrapper - at which point it
 * is a template with three call sites and no claim of its own.
 *
 * So what is shared is the *sentence*: the address, the name, the summary, the signature, the command
 * and the four figures. Resemblance is not duplication and identical arithmetic is, which is the line
 * `CLAUDE.md` already draws about `outputsAreEqual`.
 *
 * ---------------------------------------------------------------------------
 * The signature is the record's own form and never a second spelling of it
 * ---------------------------------------------------------------------------
 *
 * The artboard writes a signature as a declaration - `slugify(input: string): string`. What the frozen
 * record holds is a type: `text` on the `the-answer` export, rendered `type Slugify = (text: string) =>
 * string` on a contract page since ADR-0116. **Composing the declaration from the type would need the
 * type parsed**, and ADR-0026 refuses a second parser in as many words - a copy of a parser is not a
 * second opinion, it is the same statement written where nobody will maintain it.
 *
 * So every surface shows the form the record holds. A reader who meets a signature on the front page
 * and the same signature on the contract page meets one string, which is the property that made the
 * front page's cards buildable without adding a field to `contract-index`.
 */

import type { ExportRecord } from '../registry/contract-record.js'
import { THE_INVOCATION } from '../registry/address.js'
import type { Held } from './catalogue.js'
import { shortNameOf } from './catalogue.js'

/**
 * A contract has exactly one `the-answer` export, and a card with no signature is not a card.
 *
 * `states-its-own-signature` is stage 1's rule that a contract declares one, and `the-catalogue.ts`
 * types the surface, so this cannot be absent on anything the registry serves. It is refused rather
 * than defaulted because a card silently missing its signature is the defect this module was written
 * to make impossible.
 */
export class ACardCannotBeBuilt extends Error {
  constructor(what: string, why: string) {
    super(
      `no card can be built for ${what}, because ${why}. Every surface that lists a contract shows ` +
        `the same sentence about it, so a contract that cannot answer one of its parts would be a ` +
        `card that is quietly shorter on one page than on another.`,
    )
    this.name = 'ACardCannotBeBuilt'
  }
}

/**
 * What a contract costs a reader who takes it, counted once.
 *
 * The four are what a reader is choosing on, and they were computed in two files with identical
 * expressions until ADR-0180. `files` is separate from `bytes` because a card says *N bytes, one file*
 * and the singular is decided by the count rather than by the total.
 */
export type WhatItCosts = {
  readonly cases: number
  readonly bytes: number
  readonly files: number
  readonly imports: number
}

/** Everything a card says about one contract, whatever the surface renders it as. */
export type WhatACardSays = {
  /** The rendered contract address, which is also where the card links to. */
  readonly address: string
  /** The name without its domain, which is what a heading carries. */
  readonly name: string
  /** The domain it is filed under, which a card shows before the name. */
  readonly domain: string
  readonly summary: string
  /** The answer's type, in the form the frozen record holds. */
  readonly signature: string
  /** The one invocation that runs with nothing installed, installed globally, or as a dependency. */
  readonly command: string
  readonly costs: WhatItCosts
}

export const whatItCosts = (held: Held): WhatItCosts => ({
  cases: held.contract.caseTables.reduce((count, table) => count + table.cases.length, 0),
  bytes: held.implementation.files.reduce((total, file) => total + file.bytes, 0),
  files: held.implementation.files.length,
  imports: held.implementation.dependsOn.length,
})

/** The export a card shows the signature of, refused rather than defaulted when there is none. */
export const theAnswerOf = (held: Held): ExportRecord => {
  const answer = held.contract.surface.exports.find((entry) => entry.role === 'the-answer')

  if (answer === undefined) {
    throw new ACardCannotBeBuilt(
      held.contract.address.name,
      'its declared surface carries no export in the role `the-answer`',
    )
  }

  return answer
}

export const whatACardSays = (held: Held): WhatACardSays => {
  const answer = theAnswerOf(held)
  const { name } = held.contract.address

  return {
    address: name,
    name: shortNameOf(name),
    domain: name.slice(0, name.indexOf('/')),
    summary: held.contract.identity.summary,
    signature: `type ${answer.typeName} = ${answer.text}`,
    command: `${THE_INVOCATION} add ${name}`,
    costs: whatItCosts(held),
  }
}
