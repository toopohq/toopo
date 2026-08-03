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
 * The two files a specification battery injects into.
 *
 * They are named here rather than in each specification battery for the reason `reference` is: three
 * batteries write the same two path literals, and a path literal repeated three times is a rename
 * away from being wrong in two places.
 */
export const contract = (find: string, replace: string): Edit => ({
  file: 'contract.ts',
  find,
  replace,
})

export const edgeCases = (find: string, replace: string): Edit => ({
  file: 'edge-cases.ts',
  find,
  replace,
})

/**
 * Which guards a killed cell names, by identifier, and where the line is.
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
 * **Five is a convention.** It is not derived from anything, and it is written down as a convention
 * because the number reads as though it were derived - which is a trap for whoever inherits it. What
 * was measured is a distribution of red-set sizes; where to cut that distribution is a choice, and it
 * was calibrated against a snapshot rather than against a law.
 *
 * The snapshot has already moved twice, which is the whole argument for saying so. When the line was
 * drawn there were three batteries and 147 killed cells and the median red set was exactly five, so
 * five split them almost in half. A second measurement over six batteries and 197 cells put the
 * median at three. There are now eight batteries and 262 killed cells - `string/levenshtein@1` and
 * its specification battery - and the median is four: 151 cells sit at or below the line and 111
 * above it. Pinning the 151 in full costs 324 titles; pinning the other 111 in full would cost 2248,
 * none of which would pin anything a single edit could remove, and every one of which would break on
 * a rename. A pin that transcribes a run is not a claim about the contract.
 *
 * The line stays at five, and it must be remeasured when the fifth contract moves it again. It is
 * defensible across a range rather than at a point - what it has to separate is a set one commit can
 * remove from a transcript of a run - and moving it with every measurement would make two batteries
 * written a month apart incomparable. The median has now gone three, then four, on the same line;
 * that it moves in both directions is the evidence that five is a convention rather than a
 * consequence.
 *
 * **A pin names what is red on every run, not what is red on this one.** Naming all of a set of five
 * is the rule; naming a guard whose red depends on the seed is a battery that fails on the seed.
 * Measured on `string/levenshtein@1`: L-05 reddens three guards and two are pinned, because the third
 * needs a pair the arbitraries draw on 0.221% of runs and is therefore red on 175 runs out of 200.
 * The intersection over four runs is what a pin should carry, and it is cheap to take - the
 * instrument's `--only` flag runs one mutant in seconds.
 *
 * **A pin names an identifier, never a title.** `run.ts` states the rule; the consequence here is
 * that rewording the sentence a guard shows in the runner's output leaves every pin standing, and
 * that a pin naming a string no guard of the contract answers to is not an address at all - which
 * is what LS-13 of `string-levenshtein-spec` was written to demonstrate, and what it stopped being
 * able to demonstrate once this rule existed.
 *
 * Pins are checked by inclusion rather than by equality, and that is measured too. Three consecutive
 * runs of the three batteries that existed then agreed on 173 of 174 cells; the one that moved is
 * `F-1` on `date/add@1`,
 * which gained `P4` on the third run because `elapsedOnlyDuration` drew the empty record. Requiring
 * the exact set would have failed that cell on two runs out of three - a battery that reddens on the
 * seed is a battery nobody can read.
 */
export const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

export const survived: Expectation = { verdict: 'survived' }

/**
 * Killed by the compiler and by nothing else: the run reddened and no guard reported a failure,
 * because the defect never reached one.
 *
 * It is a real kill and it is counted apart, because what caught it is not a guard anyone wrote. A
 * specification battery produces these by construction - removing a reason literal breaks the union
 * every table entry is typed against - and the share of a contract that only this verdict holds is
 * worth reading rather than folding into the score. The type system is part of the verification;
 * pretending a test did the work would misattribute it.
 */
export const killedByTypecheck: Expectation = { verdict: 'killed-by-typecheck' }

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
  /**
   * A defect no lens of this arm is blind to: every cell sees it, and sees it alike.
   *
   * Named for the axis it is on rather than for the defects that happen to use it. Most of them are
   * defects of behaviour, and the seven signature defects of `number/parse@1` and `date/add@1` are
   * not - a lens that blinds the suite to which reason a refusal names cannot blind it to the
   * declared type, so they belong here too.
   */
  readonly sameOnEveryLens: (
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
  /**
   * A defect every lens sees and no two lenses see alike, pinned one lens at a time.
   *
   * It is the form the signature defects take on a contract whose second lens blinds the type
   * identity assertion: both columns catch them, and the difference between what each column names is
   * the measurement the lens exists for. `array/group-by@1` wrote it first and kept it local because
   * one exemplar generalises nothing; `string/levenshtein@1` writes exactly the same thing, so it
   * lives here rather than in two batteries.
   */
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
      lens === under.asCommitted ? killed(by) : survived,
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
