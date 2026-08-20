/**
 * Every address a fixture of this repository stands at, declared in one place so that a guard can be
 * total over them.
 *
 * ---------------------------------------------------------------------------
 * Why this module exists, which is a defect and not a tidying
 * ---------------------------------------------------------------------------
 *
 * The fixtures used to stand at `number/round`, `string/pad`, `number/clamp`, `number/sign`,
 * `text/left`, `text/right`, `string/titlecase`, `number/rond` and `toy/thing`. Every one of those is
 * an address `CONTRACT_NAME` accepts, so every one of them was an address the catalogue could be
 * asked to publish - and `number/round` is the one it decided to. A fixture holding an admissible
 * address is a collision waiting for the day somebody writes the contract, and on that day the choice
 * is between renaming forty files and publishing at a name nobody chose.
 *
 * They stand in the imagined space now, which `THE_IMAGINED_DOMAIN_PREFIX` declares and
 * `serialiseContract` refuses. So a fixture's hold on an address costs the catalogue nothing, for
 * good.
 *
 * ---------------------------------------------------------------------------
 * Why the addresses are here rather than where each fixture is written
 * ---------------------------------------------------------------------------
 *
 * **Three successive sweeps of this repository counted six, then eight, then nine.** The first was a
 * hand-written list, the second added the two the graph holds and no test names in isolation, the
 * third added the toy repository's one. Nothing about the two that were missed looked different from
 * the six that were found: a list written by hand missed something at every passage.
 *
 * A sweep over the sources cannot replace it, and that was measured rather than assumed: matching the
 * shape `CONTRACT_NAME` accepts against every quoted literal in this repository returns `lib/toopo`,
 * `packages/cli`, `application/json` and `vitest/config` beside the real answers. The shape of an
 * address and the shape of a path are the same shape, so no reading of the text can tell one from the
 * other.
 *
 * What is left is a declaration, and a guard that is total over *it* rather than over a list somebody
 * keeps: `every-address-a-fixture-stands-at-is-one-the-catalogue-refuses` reads this module's exports
 * and asks each one. Adding an address here puts it in that guard's population with nobody editing
 * the guard; adding one *elsewhere* is what nothing here catches, and `CLAUDE.md` carries it.
 *
 * ADR-0142.
 */

import type { ContractAddress } from './address.js'
import { THE_IMAGINED_DOMAIN_PREFIX } from './address.js'

const imagined = (name: string): ContractAddress => ({
  language: 'typescript',
  name: `${THE_IMAGINED_DOMAIN_PREFIX}${name}`,
  major: 1,
})

/** Carried by `imagined-number/clamp` and `imagined-number/sign`, and reached through neither alone. */
export const PAD = imagined('string/pad')

/** Depends on `PAD`, and shares `digits.ts` with it byte for byte. */
export const CLAMP = imagined('number/clamp')

/** Depends on `PAD` too, which is what makes the deduplication a collapse rather than a copy. */
export const SIGN = imagined('number/sign')

/** The root of the graph: depth two, three implementations reachable, two walks that disagree. */
export const ROUND = imagined('number/round')

/** Shares `trim.ts` with `RIGHT` and depends on nothing, which no edge of the graph can express. */
export const LEFT = imagined('text/left')

/** The other half of that pair. Neither knows about the other; deduplication is by digest. */
export const RIGHT = imagined('text/right')

/**
 * A name the catalogue does not hold, so that a refusal can be seen.
 *
 * **It is imagined for the reason the six above are, arriving from the opposite side.** A fixture
 * asserting that the catalogue holds no `string/titlecase` is a fixture that becomes false the day
 * the catalogue holds one - and `string/titlecase` is a name a registry of string utilities plausibly
 * takes. The assertion is about the imagined space now, where nothing can ever be published, so it is
 * true for the same reason for ever.
 */
export const A_NAME_THE_CATALOGUE_DOES_NOT_HOLD = imagined('string/titlecase')

/**
 * `ROUND` with two letters transposed, so that a refusal can name what the reader meant.
 *
 * It is one character from `ROUND` on purpose: the refusal it exercises answers with what the project
 * *does* hold, and that answer is only useful to somebody who has misremembered a name.
 */
export const A_MISSPELLING_OF_ROUND = imagined('number/rond')

/**
 * The one address of the toy repository `rebuild.test.ts` builds, publishes from and then edits.
 *
 * It is not part of the graph above and shares nothing with it: the toy is a repository with a
 * `ledger` script of its own, built to be asked what a past commit bound. What it shares with the six
 * is the only thing this module is about - it is an address, and it was an admissible one.
 */
export const THE_TOY = imagined('toy/thing')
