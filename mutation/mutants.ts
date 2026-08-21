/**
 * How a battery declares a mutant.
 *
 * ADR-0075 is what these helpers share and what stays in the battery that needs it. ADR-0053 is what a
 * pin on a re-drawn property may claim, and the three checks that come before a rate; ADR-0077 is what
 * the rate is then worth, and how a repair is chosen from it.
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
