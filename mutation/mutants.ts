/**
 * How a battery declares a mutant.
 *
 * `mutation/` is not a contract folder, so the suspension of the no-duplication rule that lets three
 * contracts repeat themselves never covered it. These helpers were copied into three batteries
 * anyway, which was a plain violation rather than a question about the contract format, and this file
 * is the correction.
 *
 * What is shared is the shape of an expectation and the shape of a mutant that every lens of an arm
 * sees alike. What is not shared stays in the battery that needs it: `array/group-by@1` builds
 * signature defects with a different expectation per lens, `date/add@1` swaps reason literals by
 * anchoring on whole statements, and neither has a second exemplar to generalise from.
 */

import type { Edit, Expectation, Mutant } from './run.ts'

/** Almost every edit rewrites the reference implementation; the lenses are what edit a test file. */
export const reference = (find: string, replace: string): Edit => ({
  file: 'reference.ts',
  find,
  replace,
})

/**
 * Which guards a killed cell names, and where the line is.
 *
 * A pin exists so that a defect which stops being caught by the guard that used to catch it is as
 * loud as a failing test. That is worth doing where a single edit could take the detection away, and
 * worth nothing where forty guards catch the same defect - so the rule is written here rather than
 * left to judgement, because the next battery will apply it and two batteries applying different
 * rules would make the pins incomparable.
 *
 * **Five or fewer red guards: name all of them.** At that size the set usually sits in one region -
 * one property, or the cases of one block - and one commit can remove it.
 *
 * **More than five: name the guards the mutant was written to exercise, and nothing else.**
 *
 * The line is at five because that is where the measurement puts it, not because it is round.
 * Measured across the three batteries, over 147 killed cells: the median red set is exactly five, so
 * the line splits them almost in half. The 77 cells at or below it cost 196 pinned titles between
 * them; pinning the other 70 in full would cost 1505 more, none of which would pin anything a single
 * edit could remove, and every one of which would break on a rename. A pin that transcribes a run is
 * not a claim about the contract.
 *
 * Pins are checked by inclusion rather than by equality, and that is measured too. Three consecutive
 * runs of all three batteries agreed on 173 of 174 cells; the one that moved is `F-1` on `date/add@1`,
 * which gained `P4` on the third run because `elapsedOnlyDuration` drew the empty record. Requiring
 * the exact set would have failed that cell on two runs out of three - a battery that reddens on the
 * seed is a battery nobody can read.
 */
export const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

export const survived: Expectation = { verdict: 'survived' }

/**
 * The arm a battery declares its mutants against, and how its lenses read it.
 *
 * Named rather than inferred from the lens list, because "which lens reads the contract as its commit
 * left it" is the axis every measurement in this repository is a difference along. A battery that got
 * it the wrong way round would report the detection a blinding *removes* as the detection it adds.
 */
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

export type MutantForms = {
  /** A defect no lens of this arm is blind to: every cell sees it, and sees it alike. */
  readonly behavioural: (
    id: string,
    description: string,
    edits: readonly Edit[],
    expected: Expectation,
  ) => Mutant
  /**
   * A defect only the unblinded lens can see. Every one of them answers every call with the value the
   * contract asks for, so a blinded column is what a contract without that half of its surface would
   * have seen: nothing.
   */
  readonly onlySeenUnblinded: (
    id: string,
    description: string,
    edits: readonly Edit[],
    by?: readonly string[],
  ) => Mutant
}

export const mutantsOn = (under: ArmUnderTest): MutantForms => ({
  behavioural: (id, description, edits, expected) => ({
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
      lens === under.asCommitted ? killed(by) : survived,
    ),
  }),
})

/**
 * A probe: a question about the shape of the contract rather than a defect of it, kept out of the
 * score so that a score measures the contract and not the question.
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
