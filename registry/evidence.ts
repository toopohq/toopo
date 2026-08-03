/**
 * The evidence a contract record cites, and the one policy that decides how strong a citation is.
 *
 * This is deliberately the smallest thing that makes a citation resolvable, and not a model of the
 * mutation instrument. A battery is 700 lines of anchors and pins; what the registry needs of it is
 * that `found-by-mutation:D-07` names something that exists. Modelling the matrix here would be
 * building the storage of a measurement the instrument already writes, and storage is the next unit.
 */

import type { ContractAddress, MutantAddress } from './address.js'
import { renderContract, renderMutant, sameContract } from './address.js'

// ---------------------------------------------------------------------------
// Provenance - a free string becomes an address
// ---------------------------------------------------------------------------

/**
 * Where a case of block 4.4 came from.
 *
 * The catalogue publishes this as a template literal type - `found-by-mutation:${string}` - which
 * makes any text after the colon well typed. Four cases of the five contracts use it, and nothing
 * anywhere checks that the mutant they name exists. In a registry that is not acceptable: a case
 * claims to kill a defect, and the claim is the whole difference between a contract that has been
 * closing its gaps and a contract that never had any.
 *
 * So the registry carries an address rather than a string, and `against-the-five.test.ts` resolves
 * every one of them against the battery that holds it. A provenance naming a mutant no battery
 * declares fails at serialisation, which is what "controlled at publication" means when the
 * publishing tool arrives.
 *
 * `found-in-the-wild` keeps a free string, and the difference is not an oversight. A mutant is an
 * object this repository owns and can therefore resolve; a defect report from real use is an
 * identifier in somebody else's tracker, and inventing a resolvable shape for it would be inventing
 * the tracker too. No case of the five carries one.
 */
export type CaseProvenance =
  | { readonly kind: 'specified' }
  | { readonly kind: 'found-by-mutation'; readonly mutant: MutantAddress }
  | { readonly kind: 'found-in-the-wild'; readonly report: string }

/**
 * A battery, reduced to what makes a citation resolvable: which contract it measures, and which
 * mutants it declares.
 */
export type BatteryRecord = {
  readonly name: string
  readonly contract: ContractAddress
  readonly mutants: readonly string[]
}

export class UnresolvedProvenance extends Error {
  constructor(where: string, address: MutantAddress, detail: string) {
    super(`${where} cites ${renderMutant(address)}, and ${detail}`)
    this.name = 'UnresolvedProvenance'
  }
}

/**
 * Resolve a citation, or say precisely which half failed. The two halves are different mistakes: a
 * battery that does not exist is a wrong contract or a wrong name, a mutant that does not exist is a
 * defect that was renamed or removed - and the second is the one that happens when a battery is
 * rewritten.
 */
export const resolveProvenance = (
  where: string,
  provenance: CaseProvenance,
  batteries: readonly BatteryRecord[],
): void => {
  if (provenance.kind !== 'found-by-mutation') return

  const { mutant } = provenance
  const battery = batteries.find(
    (candidate) =>
      candidate.name === mutant.battery && sameContract(candidate.contract, mutant.contract),
  )

  if (battery === undefined) {
    throw new UnresolvedProvenance(
      where,
      mutant,
      `no battery named "${mutant.battery}" measures ${renderContract(mutant.contract)}`,
    )
  }

  if (!battery.mutants.includes(mutant.mutant)) {
    throw new UnresolvedProvenance(
      where,
      mutant,
      `the battery "${mutant.battery}" declares no mutant "${mutant.mutant}"`,
    )
  }
}

// ---------------------------------------------------------------------------
// How strong a claim about the evidence is
// ---------------------------------------------------------------------------

/**
 * Whether a claim about the evidence survives being run again, settled here for the whole registry.
 *
 * The problem is real and was measured before this unit existed: three cells of two batteries pinned
 * a guard whose red depends on the draw. `L-18` pinned discernibility, which sees that mutant only
 * when two pairs drawn inside one run collide - red on twenty-three runs out of twenty-five. `G-22`
 * pinned two properties that need a sharp s adjacent to an absorbable mark - red on eight runs out of
 * nine, and seven of nine on the blinded column. A registry cannot run a validation that fails once
 * in six.
 *
 * Two ways out were on the table and one of them is refused outright.
 *
 * **Freezing the seed in the contract is refused.** A property whose draws are fixed for the life of
 * a major version is a table of a thousand rows wearing a property's clothes: it explores one sample
 * set for ever, and a submitter who knows the seed adjusts an implementation row by row until it
 * passes. §4.3 of the project specification re-seeds every run for exactly that reason - so that
 * knowing the properties does not let anyone cheat - and freezing the seed would delete the sentence.
 * It would also freeze the draws into the major, so the arbitraries could never be widened, which is
 * the one repair `string/slugify@1` already records needing.
 *
 * **What is settled instead is a distinction the instrument's own measurements make and nothing
 * names.** A *verdict* - does this contract catch this defect - is stable. An *attribution* - which
 * guard catches it - is not. So the two are not claims of the same strength, and the registry says so
 * rather than treating a flaky pin as a flaky verdict.
 *
 * Measured for this decision rather than inherited: three complete runs of the `string-slugify`
 * battery, fifty-eight cells each. **Not one verdict moved. Six attributions did** - `G-07` and `F-10`
 * gain and lose `p1-two-spellings-one-slug`, `G-22` gains and loses `p2-idempotence`, each on both
 * lenses. All three runs exited zero, so every *pinned* guard held: what moves is exactly what the
 * battery does not pin, which is the discipline working rather than failing. Two of those three cells
 * are new here - `3d16158` found `L-18` and `G-22` by checking declared pins, and a cell whose
 * movement is unpinned leaves no trace for that check to find.
 *
 * `attributionRuns` is the number of independent runs a claim naming a guard must survive as an
 * intersection. Three, which is what the batteries already take before declaring a pin and what this
 * measurement shows is enough to surface movement. It is registry policy rather than contract data
 * because it is one number for the whole catalogue, and a per-contract copy would be five copies of
 * one decision.
 */
export type SeedingPolicy = {
  readonly seedsAreFrozen: false
  readonly whyNotFrozen: string
  /** How many runs a verdict has to survive. */
  readonly verdictRuns: number
  /** How many runs a claim naming a guard has to survive, as an intersection. */
  readonly attributionRuns: number
  readonly measurement: string
}

export const SEEDING_POLICY: SeedingPolicy = {
  seedsAreFrozen: false,
  whyNotFrozen:
    'a property whose draws are frozen with the major explores one sample set for ever and can be ' +
    'passed row by row by a submitter who knows it, which is what re-seeding every run exists to ' +
    'prevent',
  verdictRuns: 1,
  attributionRuns: 3,
  measurement:
    'three complete runs of the string-slugify battery, 58 cells each: 0 verdicts moved and 6 ' +
    'attributions moved, on G-07, G-22 and F-10, each on both lenses. Every pinned guard held. ' +
    'Earlier, at 3d16158: L-18 red on 23 runs of 25 and G-22 on 8 of 9, measured while checking ' +
    'declared pins. The intersection of three runs is what the batteries already take.',
}
