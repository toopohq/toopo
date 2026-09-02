/**
 * How a battery declares a mutant.
 *
 * ADR-0075 is what these helpers share and what stays in the battery that needs it. ADR-0053 is what a
 * pin on a re-drawn property may claim, and the three checks that come before a rate; ADR-0077 is what
 * the rate is then worth, and how a repair is chosen from it.
 *
 * ---------------------------------------------------------------------------
 * Writing a cell that isolates one guard
 * ---------------------------------------------------------------------------
 *
 * `attribution.ts` asks for cells aimed at a single guard's own failure condition, because a guard
 * that only ever reddens beside another has never been shown carrying a defect by itself. Two rules
 * came out of writing eleven of them, and both are worth reading before a candidate is spent.
 *
 * **Aim at a choice, not at a shared mechanism.** A defect in *how* something is composed has every
 * consumer's guards behind it; a defect in *which* thing is composed has only the guard that is about
 * the choice. Measured: two candidates that dropped the separator from a rewritten command each
 * reddened three guards or four, and the one that handed the reader a different spelling reddened one.
 *
 * **A total guard over a population shadows every guard whose subject is a property of that
 * population.** `every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` sweeps
 * every address the emission writes, so any defect that moves an address reddens it beside whatever
 * else it breaks. Where the population is declared in one place and written in another, a cell editing
 * *both* lifts the shadowing and is the shape somebody's real mistake takes anyway - W-178 of the site
 * battery is the instance.
 *
 * Neither needs a probe to recognise, which is what makes them worth more than the eleven cells.
 * ADR-0203.
 *
 * **A third rule came out of twenty-two more in another folder, and the first two were put to the test
 * there rather than restated.** Aiming at a choice held everywhere it was tried; the total-guard rule
 * predicted three refusals and was wrong on three guards it was named on, every one of which isolated
 * on its first candidate. The rule below is the one those three were mistaken for.
 *
 * **Two guards whose subject is one declaration - a rule, or a constant - are separable only by an arm
 * one of them has outside it.** A population is not such an arm, however differently it was chosen:
 * `a-query-the-catalogue-cannot-answer-answers-nothing` is twenty-eight hand-written requests and
 * `a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing` is a sweep over every
 * word the catalogue declares, neither contains the other, and every plausible defect of the allowance
 * they both read opens both. What isolated the first is its **second assertion** - that the one query
 * answered while naming what it could not place still answers - which makes it red on a tightening as
 * well as on a loosening, where its neighbour's three assertions are all the rule. So look for the arm
 * before spending a candidate, and where a guard has none, expect the refusal.
 *
 * **And a guard that resists is dearer to establish than a cell is to write.** Measured over those
 * twenty-two: 1.21 candidate runs per cell against 2.0 per refusal, which is the half ADR-0203's own
 * table did not price. ADR-0204.
 */

import type { Edit, Expectation, Mutant, PlatformFamily, SurvivalNature } from './run.ts'

/** Almost every edit rewrites the reference implementation; the lenses are what edit a test file. */
export const reference = (find: string, replace: string): Edit => ({
  file: 'reference.ts',
  find,
  replace,
})

/** One of the two files a specification battery injects into, named once for three batteries. ADR-0075. */
export const contract = (find: string, replace: string): Edit => ({
  file: 'contract.ts',
  find,
  replace,
})

/** The other. ADR-0075. */
export const edgeCases = (find: string, replace: string): Edit => ({
  file: 'edge-cases.ts',
  find,
  replace,
})

/** Which guards a killed cell names, by identifier, and where the line is. ADR-0076. */
export const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

/** A survivor, and the kind of thing it is - required, so that no total aggregates unlike cells. ADR-0078. */
export const survived = (nature: SurvivalNature): Expectation => ({ verdict: 'survived', nature })

/** The survivor the apparatus explains, which is the only one that declares no nature. ADR-0078. */
export const survivesOnlyBlinded: Expectation = { verdict: 'survived' }

/** Killed by the compiler and by nothing else, and counted apart for that reason. ADR-0078. */
export const killedByTypecheck: Expectation = { verdict: 'killed-by-typecheck' }

/**
 * That the defect this cell injects exists on one family of platforms and cannot occur on the other.
 *
 * It wraps a verdict rather than replacing one, which is the whole of what it is for: the verdict
 * stays what the cell really produces where its defect exists, and a run off that family does not
 * inject at all. **There is no second verdict to write**, because there is no second measurement -
 * the alternative is `not-applicable`, and the instrument reaches that without being told.
 *
 * ADR-0147 is why this is an applicability and not a fifth `SurvivalNature`, and why a figure derived
 * from it is the same on every machine.
 */
export const onlyOn = (
  family: PlatformFamily,
  because: string,
  expectation: Expectation,
): Expectation => ({ ...expectation, onlyOn: { family, because } })

/** The arm a battery declares its mutants against, and how its lenses read it. ADR-0079. */
export type ArmUnderTest = {
  readonly arm: string
  /** The lens that reads the arm exactly as committed. */
  readonly asCommitted: string
  /** The lenses that read part of the suite blind. */
  readonly blinded: readonly string[]
}

const expectedPerCell = (
  under: ArmUnderTest,
  expectationFor: (lens: string) => Expectation,
): Readonly<Record<string, Expectation>> =>
  Object.fromEntries(
    [under.asCommitted, ...under.blinded].map((lens) => [
      `${under.arm}/${lens}`,
      expectationFor(lens),
    ]),
  )

/** The three forms a mutant takes on the blinding axis, named for the axis and not for its uses. ADR-0079. */
export type MutantForms = {
  /** A defect no lens of this arm is blind to: every cell sees it, and sees it alike. */
  readonly sameOnEveryLens: (
    id: string,
    description: string,
    edits: readonly Edit[],
    expected: Expectation,
  ) => Mutant
  /** A defect only the unblinded lens can see, so a blinded column measures what it would have caught. */
  readonly onlySeenUnblinded: (
    id: string,
    description: string,
    edits: readonly Edit[],
    by?: readonly string[],
  ) => Mutant
  /** A defect every lens sees and no two lenses see alike, pinned one lens at a time. */
  readonly perLens: (
    id: string,
    description: string,
    edits: readonly Edit[],
    expected: Readonly<Record<string, Expectation>>,
  ) => Mutant
}

export const mutantsOn = (under: ArmUnderTest): MutantForms => ({
  sameOnEveryLens: (id, description, edits, expected) => ({
    id,
    kind: 'defect',
    description,
    arms: { [under.arm]: edits },
    expected: expectedPerCell(under, () => expected),
  }),

  onlySeenUnblinded: (id, description, edits, by) => ({
    id,
    kind: 'defect',
    description,
    arms: { [under.arm]: edits },
    expected: expectedPerCell(under, (lens) =>
      lens === under.asCommitted ? killed(by) : survivesOnlyBlinded,
    ),
  }),

  perLens: (id, description, edits, expected) => ({
    id,
    kind: 'defect',
    description,
    arms: { [under.arm]: edits },
    expected: expectedPerCell(under, (lens) => {
      const pinned = expected[lens]

      if (pinned === undefined) {
        throw new Error(`${id} declares no expected verdict for the lens ${lens}`)
      }

      return pinned
    }),
  }),
})

/**
 * A probe: a question about the shape of the contract rather than a defect of it, kept out of the
 * score so that a score measures the contract and not the question. ADR-0078.
 */
export const probe = (
  under: ArmUnderTest,
  id: string,
  description: string,
  edits: readonly Edit[],
  expected: Expectation,
): Mutant => ({
  id,
  kind: 'probe',
  description,
  arms: { [under.arm]: edits },
  expected: expectedPerCell(under, () => expected),
})
