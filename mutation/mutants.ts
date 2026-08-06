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

import type { Edit, Expectation, Mutant, SurvivalNature } from './run.ts'

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
 * **A pin names what is red on every run, not what is red on this one** - and for a guard built on a
 * re-drawn property that sentence is unreachable as written, which is worth saying rather than
 * pretending it is met. Such a guard has no determinism to offer: it has a *miss rate*. So the
 * usable rule is that **a pin on a property-based guard carries its measured miss rate, and is
 * legitimate only when that rate is unobservable over the lifetime of the project.** A rate of one
 * green in 110 runs is met every fortnight, and a pin met by a green every fortnight teaches its
 * reader to ignore the red - which is the one way this instrument is destroyed. Naming the figure
 * beats asserting a determinism that does not exist.
 *
 * **Before measuring a rate, check that the guard polices the step the mutant breaks.** Skipping
 * this is how the rule above gets misapplied: `G-14` of `string-slugify` pinned P1, whose table of
 * equivalent spellings is blind to it at 0 of 200 000 draws and cannot stop being - P1 polices
 * `unify` and `fold`, and that mutant breaks `keep`. Its 0.470% of catching draws was the
 * general-purpose alphabet having an accident. Without this step first, a rate gets optimised for an
 * accident; with it, there is no rate to measure, only a pin to drop.
 *
 * The method, three minutes for any pair of mutant and pin, and it is the validation that makes it
 * worth anything rather than the code: inject the mutant, reproduce the generator beside it, check
 * the reproduction against a series of real runs before believing it, then read the rate. Measured
 * on `G-14`: a reproduction predicting 0.89% against 1 green in 60 real runs - agreeing, which is
 * what earned the 200 000-draw figure the right to be quoted.
 *
 * The older measurement stands and is the same shape. On `string/levenshtein@1`, L-05 reddens three
 * guards and two are pinned, because the third needs a pair the arbitraries draw on 0.221% of runs
 * and is therefore red on 175 runs out of 200.
 *
 * ---------------------------------------------------------------------------
 * What a rate obtained this way is worth, which is one order of magnitude and no more
 * ---------------------------------------------------------------------------
 *
 * **The miss rate is the per-draw probability raised to the number of draws, so the exponent turns a
 * small error on the input into a large one on the answer.** Measured on `G-02` of `string-slugify`,
 * whose pin on P6 this repository reads at 1000 draws: a per-draw catching probability of 0.8226%
 * predicts one silent run in 3 866, and 0.6195% predicts one in 500. That is a **25% error on the
 * input becoming a factor of seven on the answer**, and 25% is well inside what a reproduction can be
 * wrong by while looking right.
 *
 * So: **no miss rate obtained by reproducing a generator is trustworthy to better than an order of
 * magnitude**, and publishing one to four significant figures claims a precision the method has not
 * got - the same fault as a byte count published without the divisor that produced it. Quote the
 * order, name the draw count it was raised to, and let the real runs decide anything finer.
 *
 * It is written here rather than beside `G-02` because it is not a fact about that cell. It holds for
 * every pin on a property-based guard this instrument will ever carry, and it was found by measuring
 * one of them.
 *
 * **So a repair is chosen for its margin, never for its precision**, and that is the rule the sentence
 * above is worth: **take the repair whose margin swallows the known uncertainty of the method.** A
 * factor of ten is what a reproduced rate may be wrong by, so a repair that improves the rate by a
 * factor of ten has bought nothing that survives its own error bar, and one that improves it by a
 * factor of thousands is safe whichever way the model is wrong. On `G-02` the second astral symbol
 * takes P6 from one silent run in some thousands to one in some tens of millions on the model, and to
 * one in some hundreds of thousands on the least favourable reading the measurements permit - two
 * readings a factor of seventy apart, both far past anything that matters. **That is what decides it,
 * and the third decimal of either never enters.**
 *
 * **The two cheap checks that come before spending real runs**, both learned from the same cell and
 * both eliminating a hypothesis in minutes. *Is the draw count the one the model raises to?* -
 * instrument the predicate and count, because a property reading 600 draws where the model assumed
 * 1000 moves the answer further than any refinement of the probability will. *Is the draw sequence
 * actually independent and identically distributed?* - collect the catching count per run over a
 * hundred runs and compare its spread against the binomial one, because overdispersion is what
 * produces silent runs a binomial model cannot account for, and it shows up long before a silence
 * does. On `G-02` both came back clean: 1000 draws exactly, and a spread of 0.96 times binomial over
 * 150 runs at 0.87% per draw.
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

/**
 * A survivor, and the kind of thing it is.
 *
 * **The nature is an argument rather than a field somebody wanted, and the argument is about how a
 * survivor reads from outside.** A count of surviving cells published on its own is read as a count
 * of holes, and that is not what these are: a mutant nothing could ever catch, a behaviour the
 * contract deliberately declines to specify, a rule no input in this catalogue exercises, and a limit
 * this repository has already declared with its price are four different things, and only the fourth
 * is a debt. Aggregating them publishes a number more frightening than the truth, which is as much a
 * misreport as one that flatters.
 *
 * It is a required argument rather than an optional field for the reason `DeferredNeed.until` is
 * required one folder along: a rule in prose is one the next declaration omits, and a survivor whose
 * nature nobody stated is exactly the survivor that gets counted as a hole. Making it unwritable
 * costs one word at each of the sites that already argue the point in their own description.
 *
 * **The description goes on carrying the argument and this carries only the kind.** Two statements of
 * one thing drift, and the description is where every one of these sites already says why - so this
 * adds what a count can be taken over and nothing else.
 */
export const survived = (nature: SurvivalNature): Expectation => ({ verdict: 'survived', nature })

/**
 * The survivor the apparatus explains, which is the only one that declares no nature.
 *
 * A lens removes part of the suite's sight; a defect that dies on the column reading the contract as
 * committed and lives on a blinded one is *the measurement the lens exists for* - what a contract
 * without that half of its surface would have caught, which is nothing. Declaring a nature here would
 * be inventing a fact about the contract out of a setting of the instrument.
 *
 * It carries no nature rather than a fifth member saying "the apparatus", because that member would
 * be writable on a cell where it is false. What makes it legitimate is structural and is checked:
 * `survivorFaults` refuses a bare survivor whose own mutant does not die on the committed column.
 */
export const survivesOnlyBlinded: Expectation = { verdict: 'survived' }

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
