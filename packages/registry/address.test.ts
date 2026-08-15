import { describe, it, expect } from 'vitest'

import * as ADDRESS from './address.js'
import type { ContractAddress } from './address.js'
import { contractUrl, renderContract } from './address.js'

/**
 * The module that owns every address this project has, guarded directly for the first time.
 *
 * That is worth stating plainly rather than leaving to be inferred from a new file: `address.ts`
 * renders the identity of a case, a guard, a contract, an implementation and a mutant - the strings a
 * URL anchor, an API response, a validation report and the licence header of an installed file are all
 * built from - and until now nothing asserted anything about it. Its renderings were reached only
 * through the things that use them: `packages/site/pages.test.ts` resolves `pageOf` against `renderContract`,
 * `packages/site/indexing.test.ts` resolves `contractUrl` against the sitemap, `publication.test.ts` compares
 * `licenceHeaderOf` byte for byte with five real files. Each of those is a guard over its own consumer
 * that happens to travel through here, so the module was covered the way a road is covered by the
 * traffic on it.
 *
 * What that left unguarded is the claim none of those consumers can make, because each sees one
 * rendering: **an address renders every coordinate it carries**. `language` was in the record, in
 * `sameContract` and in the lockfile, and out of every string a reader ever sees - and no consumer of
 * one rendering is in a position to notice a coordinate missing from all of them.
 *
 * So the two guards below are about the *module*, and the consumers keep their own. Nothing here
 * re-asserts what `pages.test.ts`, `indexing.test.ts` or `publication.test.ts` already resolve: two
 * guards over one fault have no answer to *which of us is right* on the day they disagree.
 */

/**
 * The address every guard here is asked about.
 *
 * A real one, because a rendering is compared against a frozen spelling below and an invented name
 * would freeze a spelling of nothing.
 */
const PROBE: ContractAddress = { language: 'typescript', name: 'number/parse', major: 1 }

/**
 * What each coordinate of an address looks like once rendered, total over the address's own fields.
 *
 * **A coordinate added to `ContractAddress` does not compile until somebody says what it looks like in
 * a rendered address** - which is the moment to decide, rather than the moment somebody notices a
 * string is missing something. This record is the mechanism for exactly the defect this file was
 * written for: `language` was a field of the address for as long as the address has existed, and the
 * rendering dropped it, and nothing was in a position to say so.
 *
 * A pass over real addresses would not do it. Every address in this catalogue carries one language, so
 * a pass would confirm that the renderings agree with each other about a coordinate none of them
 * prints - which is the accidental coverage `packages/site/read-literal.test.ts` records the general form of.
 */
const COORDINATE: Readonly<Record<keyof ContractAddress, string>> = {
  language: PROBE.language,
  name: PROBE.name,
  major: String(PROBE.major),
}

/**
 * Whether an export of this module renders an address containing a contract, and what it renders if so.
 *
 * Total over the module's own exports: **an export added to `address.ts` does not compile until it is
 * either rendered here or declared to carry no contract, with a reason.** That is
 * `every-export-is-carried-or-declared-uncarried` asked about a module instead of about a contract
 * record, and it exists because the guard below is otherwise a guard over whatever somebody remembered
 * to list.
 *
 * `renderGuard` is the interesting exclusion rather than a formality: a guard is addressed by
 * `(battery, guard)` and a battery is not a contract, so it is the one rendering here that genuinely
 * holds no contract address - which is the pair `address.ts` argues for at length two screens up.
 */
type Rendering =
  | { readonly renders: (address: ContractAddress) => string }
  | { readonly holdsNoContract: string }

const RENDERINGS: Readonly<Record<keyof typeof ADDRESS, Rendering>> = {
  renderContract: { renders: renderContract },
  renderImplementation: {
    renders: (address) => ADDRESS.renderImplementation({ contract: address, id: 'reference', version: '1.0.0' }),
  },
  renderCase: {
    renders: (address) => ADDRESS.renderCase({ contract: address, case: 'ordinary-integer' }),
  },
  renderMutant: {
    renders: (address) =>
      ADDRESS.renderMutant({ contract: address, battery: 'number-parse', mutant: 'P-16' }),
  },
  contractUrl: { renders: contractUrl },
  renderGuard: {
    holdsNoContract:
      'a guard is addressed by (battery, guard), and a battery is not a contract - the correction ' +
      '`GuardAddress` records',
  },
  sameContract: { holdsNoContract: 'it compares two addresses and renders neither' },
  contractAddressFaults: { holdsNoContract: 'it says why an address is malformed, and renders nothing' },
  caseAddressFaults: { holdsNoContract: 'it says why an address is malformed, and renders nothing' },
  guardAddressFaults: { holdsNoContract: 'it says why an address is malformed, and renders nothing' },
  THE_ORIGIN: { holdsNoContract: 'it is where this registry is published, and holds no contract' },
}

describe('how the registry addresses what it serves', () => {
  /**
   * Every rendering of an address that contains a contract carries every coordinate that contract has.
   *
   * The failure this exists for is the one it was written after: a coordinate that is in the record, in
   * the equality and in the lockfile, and in none of the strings anybody reads. It is silent by nature -
   * every consumer goes on working, every guard stays green, and the loss only becomes visible on the
   * day a second value of that coordinate exists, which is the day the addresses are already frozen in
   * repositories nobody here will see again.
   *
   * Over the renderings rather than over `renderContract` alone, because the claim is about the family:
   * a rendering that built `name@major` by hand instead of calling `renderContract` would satisfy any
   * guard aimed at that one function.
   */
  it('every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract', () => {
    const lost = Object.entries(RENDERINGS).flatMap(([name, rendering]) =>
      'renders' in rendering
        ? Object.entries(COORDINATE)
            .filter(([, value]) => !rendering.renders(PROBE).includes(value))
            .map(([field]) => `${name} drops ${field}`)
        : [],
    )

    expect(lost).toEqual([])
  })

  /**
   * And the spelling itself, which is frozen for the life of every major this registry publishes.
   *
   * A literal, because a freeze is what a literal is for: the guard above keeps the coordinates and
   * would be satisfied by `typescript number/parse 1`, and what is frozen into a licence header is the
   * separators as much as the parts. The two redden apart - dropping a coordinate reddens both,
   * respelling `@` reddens this one alone - which is what makes the pair worth having rather than one
   * guard doing both jobs badly.
   *
   * `ts/` fails it, and that is deliberate: the address is the record's own value and not an
   * abbreviation of it, so a correspondence table between two spellings of one language is refused
   * here rather than in a comment.
   */
  it('a-rendered-address-is-the-spelling-frozen-with-the-major', () => {
    expect(renderContract(PROBE)).toBe('typescript/number/parse@1')
  })

  /**
   * An export that renders no contract says which of the two it is, and why.
   *
   * The record above is total by the compiler, so nothing can be *omitted* from it. What totality does
   * not buy is a real reason: `holdsNoContract: ''` compiles, and would turn the classification into a
   * way of getting past the compiler. It is the shape `every-uncarried-export-carries-a-reason` already
   * has one floor down, and it is here for the same reason it is there.
   */
  it('every-export-that-renders-no-contract-says-why', () => {
    const unexplained = Object.entries(RENDERINGS)
      .filter(([, rendering]) => 'holdsNoContract' in rendering && rendering.holdsNoContract.trim() === '')
      .map(([name]) => name)

    expect(unexplained).toEqual([])
  })
})
