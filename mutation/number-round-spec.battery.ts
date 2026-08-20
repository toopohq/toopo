/**
 * The `number/round@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks the other
 * question: does the contract catch a broken *specification*? The two are not the same guard set -
 * the guards that read the case table, the profile list, the trap table and the universal-property
 * declarations are unreachable from `reference.ts` by construction, and this is where they are
 * witnessed. ADR-0075.
 *
 * A second battery rather than a second arm, and that is a constraint rather than a filing
 * preference: the reference battery's `unreachableGuards` says, in writing, *this battery injects
 * into `reference.ts`*. Widening it would make its own declaration false.
 *
 * **This contract's language suite is what makes the battery worth writing.** `language.test.ts` runs
 * every settled answer against `Intl.NumberFormat` and replays the three spellings this contract
 * parts from, over a million-value sweep. None of its twenty-nine guards can be reddened from
 * `reference.ts`, and eight of the cells below exist because they are the only cells that can reach
 * them.
 *
 * ADR-0143 is the contract and ADR-0144 the publication that let this battery name its folder.
 *
 * **A specification mutant may not change the number of guards.** `assertWholeSuiteRan` compares the
 * count against calibration and cannot tell a table that grew from a suite that half ran, so the
 * duplicate-call defect is written as one case *moved onto* another rather than as a case added, and
 * the empty-profile defect empties a sample list rather than deleting a profile. The same rule
 * forbids renaming a case: a guard here is titled by the case's `id` and nothing else, so an edit to
 * an `id` renames the guard it reddens and leaves the calibrated one silent - which is the defect
 * `number-parse-spec` paid for and this contract is written to avoid.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const FAILURE_REASONS = `export const failureReasons = ['value-not-finite', 'places-not-whole', 'places-negative'] as const`

const NEVER_MUTATES = `    name: 'never mutates its arguments',
    applicable: false,`

const THE_SWEEP = `export const THE_SWEEP = { thousandths: 1_000_000, places: 2 } as const`

const TO_FIXED_SWEEP = `    wrongOnTheSweep: 48_000,`
const TO_FIXED_PARTS = `    partsFrom: [
      { value: 1.005, places: 2 },
      { value: 0.015, places: 2 },
      { value: 2.675, places: 2 },
      { value: 8.575, places: 2 },
      { value: 162.295, places: 2 },
    ],`

const HALF_CENT_SAMPLES = `    roundingClass: 'at-a-tie',
    samples: [
      { value: 1.005, places: 2 },
      { value: 0.015, places: 2 },
      { value: 2.675, places: 2 },
      { value: -8.575, places: 2 },
      { value: 162.295, places: 2 },
    ],`

const NOT_A_NUMBER = `    id: 'not-a-number',
    group: 'what-is-refused',
    value: NaN,
    places: 2,
    expected: null,
    reason: 'value-not-finite',`

const A_GROUP = `    id: 'the-decimal-a-double-cannot-hold',
    title: 'The decimal a double cannot hold',`

const FIRST_CASE_RATIONALE = `    rationale:
      'The canonical instance. The double nearest 1.005 is 1.00499999999999989..., so ' +
      '\`(1.005).toFixed(2)\` answers "1.00" and the multiply answers 1. A caller who wrote 1.005 ' +
      'wrote the decimal, and the decimal is what is rounded.',`

const SECOND_CASE_BODY = `    group: 'the-decimal-a-double-cannot-hold',
    value: 0.015,
    places: 2,
    expected: 0.02,
    reason: null,`

const THIRD_CASE_BODY = `    group: 'the-decimal-a-double-cannot-hold',
    value: 0.145,
    places: 2,
    expected: 0.15,
    reason: null,`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_CASE_ADDRESSED = 'every-case-is-addressed'
const EVERY_CASE_GROUPED = 'every-case-is-grouped'
const EVERY_CASE_JUSTIFIED = 'every-case-is-justified'
const SETTLES_EACH_CALL = 'settles-each-call-once'
const A_CASE_PER_REASON = 'names-a-case-for-every-reason'
const ANSWERED_OR_REFUSED = 'every-answered-case-answers-a-number'

const UNIVERSAL_PROPERTIES = 'universal-properties-answered'

const EVERY_PROFILE_POPULATED = 'every-profile-has-samples'
const EVERY_CLASS_SAMPLED = 'every-class-the-vocabulary-declares-is-sampled'

const TO_FIXED_IN_THE_LANGUAGE = 'the-half-cent-to-fixed-loses-in-the-language'
const TO_FIXED_PARTS_GUARD = 'the-stored-double-and-not-the-written-decimal-parts-from-this-contract'
const TO_FIXED_SWEEP_GUARD = 'the-stored-double-and-not-the-written-decimal-over-the-sweep'
const THE_LANGUAGE_SKIPS = 'every-case-the-language-cannot-be-asked-is-refused-or-past-a-hundred-places'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'RS-01',
    'a case published with no justification. It is the calibration mutant of this battery: the ' +
      'guard it reddens is the one every contract in the catalogue carries, in the same words, out ' +
      'of `packages/catalogue/every-contract.ts` - so an apparatus that cannot see this one cannot ' +
      'see anything a specification battery is for',
    [edgeCases(FIRST_CASE_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),

  sameOnEveryLens(
    'RS-02',
    'an inapplicable universal property promoted to applicable - the cheapest way to inflate a ' +
      'green count with a guard that cannot fail. This contract takes two `number` arguments, ' +
      'primitives immutable by construction, so the flag is the whole record of that measurement ' +
      'and nothing else in the suite reads it',
    [contract(NEVER_MUTATES, `    name: 'never mutates its arguments',\n    applicable: true,`)],
    killed([UNIVERSAL_PROPERTIES]),
  ),

  sameOnEveryLens(
    'RS-03',
    'a reason declared and never produced. `places-too-large` is not an invented literal: this ' +
      'contract deliberately answers a place count larger than any decimal rather than refusing ' +
      'it, and block 4.4 carries a case for exactly that, so the category is one a reader might ' +
      'expect to exist. A caller switching exhaustively would carry a branch no input reaches. Two ' +
      'guards see it, and one of them is the compiler: the declared reason set is the return type ' +
      'of the diagnostic',
    [
      contract(
        FAILURE_REASONS,
        `export const failureReasons = ['value-not-finite', 'places-not-whole', 'places-negative', 'places-too-large'] as const`,
      ),
    ],
    killed([A_CASE_PER_REASON]),
  ),

  sameOnEveryLens(
    'RS-04',
    'two rows settling one call, written as one case moved onto another rather than as a case ' +
      'added, so the guard count does not move. The table would then carry two answers for one ' +
      'question with nothing saying which is the contract',
    [edgeCases(SECOND_CASE_BODY, THIRD_CASE_BODY)],
    killed([SETTLES_EACH_CALL]),
  ),

  sameOnEveryLens(
    'RS-05',
    'a case pointing at a group the table does not declare, which is what a reader produces by ' +
      'renaming a group and missing a row. The case is still addressed and still justified; what ' +
      'is lost is the sentence a reader is given about why the row is there',
    [
      edgeCases(
        `    group: 'the-decimal-a-double-cannot-hold',
    value: 0.145,`,
        `    group: 'the-decimals-a-double-cannot-hold',
    value: 0.145,`,
      ),
    ],
    killed([EVERY_CASE_GROUPED]),
  ),

  sameOnEveryLens(
    'RS-06',
    'a group whose identifier is not an address - capitalised, which is the shape a title takes ' +
      'when somebody edits the wrong field. A group is in the same address space as a case, ' +
      'because the site anchors on both',
    [
      edgeCases(
        A_GROUP,
        `    id: 'The-decimal-a-double-cannot-hold',\n    title: 'The decimal a double cannot hold',`,
      ),
    ],
    killed([EVERY_CASE_ADDRESSED, EVERY_CASE_GROUPED]),
  ),

  sameOnEveryLens(
    'RS-07',
    'a row carrying both an expected number and a refusal reason, which is a row no implementation ' +
      'obeying block 4.2 can satisfy. It is a specification defect no property could see, because ' +
      'a property draws calls and never reads this table',
    [
      edgeCases(
        `    expected: 0.02,\n    reason: null,`,
        `    expected: 0.02,\n    reason: 'places-negative',`,
      ),
    ],
    killed([ANSWERED_OR_REFUSED]),
  ),

  sameOnEveryLens(
    'RS-08',
    'a profile emptied of its samples rather than deleted, so the guard count does not move. A ' +
      'profile with nothing in it is a benchmark that reports a name and measures nothing, and the ' +
      'page would publish it beside the four that do',
    [contract(HALF_CENT_SAMPLES, `    roundingClass: 'at-a-tie',\n    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),

  sameOnEveryLens(
    'RS-09',
    'a profile reclassified onto a class another profile already carries, leaving one class of the ' +
      'declared vocabulary sampled by nothing. The vocabulary is what a reader is told the ' +
      'benchmark covers, and a class nobody samples is a column of the table that will never have ' +
      'a number in it',
    [contract(`    roundingClass: 'at-a-tie',`, `    roundingClass: 'shortened',`)],
    killed([EVERY_CLASS_SAMPLED]),
  ),

  sameOnEveryLens(
    'RS-10',
    'the answer to the canonical case moved to what `toFixed` produces, which is the one edit that ' +
      'makes this contract stop parting from the language. The case still has an id, a group and a ' +
      'justification; what it no longer has is a disagreement, and the language suite is the only ' +
      'thing in this repository that would say so',
    [edgeCases(`    expected: 1.01,`, `    expected: 1,`)],
    killed([TO_FIXED_IN_THE_LANGUAGE]),
  ),

  sameOnEveryLens(
    'RS-11',
    'the count of values `toFixed` gets wrong over the declared sweep, moved by a round number. It ' +
      'is the figure a reader is handed as the size of the trap, and the guard that keeps it ' +
      'honest recomputes it over a million values rather than reading the sentence beside it',
    [contract(TO_FIXED_SWEEP, `    wrongOnTheSweep: 50_000,`)],
    killed([TO_FIXED_SWEEP_GUARD]),
  ),

  sameOnEveryLens(
    'RS-12',
    'a row added to `partsFrom` on which the spelling does *not* part from the correct answer, ' +
      'which is the mistake a contributor makes by reaching for a memorable value rather than a ' +
      'measured one. The claim the table makes is that the spelling is wrong on every row named, ' +
      'and one right row makes the whole claim false',
    [
      contract(
        TO_FIXED_PARTS,
        TO_FIXED_PARTS.replace(
          `      { value: 162.295, places: 2 },`,
          `      { value: 162.295, places: 2 },\n      { value: 1.25, places: 2 },`,
        ),
      ),
    ],
    killed([TO_FIXED_PARTS_GUARD]),
  ),

  sameOnEveryLens(
    'RS-13',
    'the declared sweep narrowed to a hundredth of its range, which changes what every figure in ' +
      '`theTraps` is a count of while leaving all three figures where they are. It is the shape of ' +
      'a contributor speeding up a slow guard, and it is here because `THE_SWEEP` is the one ' +
      'declaration this contract has that two files read for two different purposes',
    [contract(THE_SWEEP, `export const THE_SWEEP = { thousandths: 10_000, places: 2 } as const`)],
    killed([TO_FIXED_SWEEP_GUARD]),
  ),

  sameOnEveryLens(
    'RS-14',
    'a refused call given an expected answer, so the set of cases the language cannot be asked no ' +
      'longer matches the set this contract can predict in advance. The prediction is the whole ' +
      'point of that guard: a skip that is not declared is a guard that did not run pretending to ' +
      'be one that passed',
    [edgeCases(NOT_A_NUMBER, NOT_A_NUMBER.replace(`    expected: null,`, `    expected: 0,`))],
    killed([THE_LANGUAGE_SKIPS, ANSWERED_OR_REFUSED]),
  ),
]

export const battery: Battery = {
  name: 'number-round-spec',
  contractPath: 'contracts/typescript/number/round',
  timeZone: 'UTC',
  calibrationMutant: 'RS-01',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention:
        'the specification rather than an implementation - block 4.2, 4.3, 4.4 and 4.5 as this ' +
        'contract declares them',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
  ],

  unreachableGuards: [],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'block 4.3, reachable only by changing what an implementation answers. Every one of these ' +
        'draws calls and compares them against an oracle or against itself, so no edit to the case ' +
        'table, the profile list or the trap table can move one. The reference battery witnesses all ' +
        'nine - RD-01 reddens seven of them at once, RD-13 the two about history, and RD-17 the ' +
        'coupling that no cell of the reference battery could reach before it was written.',
      guards: [
        'p1-finite-or-absent',
        'p2-the-written-decimal-and-not-the-stored-double',
        'p3-idempotent',
        'p4-nothing-to-drop-is-the-value',
        'p5-order-preserving',
        'p6-sign-symmetric',
        'p7-failure-coupling',
        'determinism',
        'no-ambient-input-from-history',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the rows of block 4.4 no mutant here rewrites, and the list is what the case identifier ' +
        'bought: each one is addressed by name rather than by a rendering of the row, so what is left ' +
        'is a measurement of this battery rather than an artefact of attribution. RS-04, RS-05, ' +
        'RS-06, RS-07, RS-10 and RS-14 each move one row and say one thing about it; a mutant per row ' +
        'would say the same sentence twenty-nine more times about a different value.',
      guards: [
        'the-smallest-half-cent-to-fixed-loses',
        'the-half-cent-the-multiply-loses',
        'a-price-with-three-decimals',
        'a-sum-that-is-not-its-parts',
        'a-positive-half',
        'a-negative-half',
        'a-negative-one-and-a-half',
        'a-negative-two-and-a-half',
        'just-below-a-tie',
        'an-amount-that-rounds-away-to-nothing',
        'a-negative-zero-stays-negative',
        'a-positive-amount-that-rounds-away-to-nothing',
        'a-carry-through-every-digit',
        'a-carry-that-crosses-ten',
        'a-carry-that-crosses-a-hundred',
        'a-value-written-in-exponent-notation',
        'the-largest-double',
        'the-smallest-double-carried-up',
        'the-smallest-double-dropped',
        'a-place-count-of-negative-zero',
        'a-place-count-past-what-to-fixed-accepts',
        'a-place-count-larger-than-any-decimal',
        'every-place-already-there',
        'positive-infinity',
        'negative-infinity',
        'a-fractional-place-count',
        'a-place-count-that-is-not-a-number',
        'an-infinite-place-count',
        'a-negative-place-count',
        'the-half-cent-to-fixed-loses-described',
        'the-half-cent-the-multiply-loses-described',
        'a-price-with-three-decimals-described',
        'a-sum-that-is-not-its-parts-described',
        'a-positive-half-described',
        'a-negative-half-described',
        'a-negative-one-and-a-half-described',
        'a-negative-two-and-a-half-described',
        'just-below-a-tie-described',
        'an-amount-that-rounds-away-to-nothing-described',
        'a-negative-zero-stays-negative-described',
        'a-positive-amount-that-rounds-away-to-nothing-described',
        'a-carry-through-every-digit-described',
        'a-carry-that-crosses-ten-described',
        'a-carry-that-crosses-a-hundred-described',
        'a-value-written-in-exponent-notation-described',
        'the-largest-double-described',
        'the-smallest-double-carried-up-described',
        'the-smallest-double-dropped-described',
        'a-place-count-of-negative-zero-described',
        'a-place-count-past-what-to-fixed-accepts-described',
        'a-place-count-larger-than-any-decimal-described',
        'every-place-already-there-described',
        'not-a-number-described',
        'positive-infinity-described',
        'negative-infinity-described',
        'a-fractional-place-count-described',
        'a-place-count-that-is-not-a-number-described',
        'an-infinite-place-count-described',
        'a-negative-place-count-described',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the per-case comparisons against `Intl.NumberFormat` that no mutant here moves. RS-10 moves ' +
        'one settled answer onto what `toFixed` produces, which is the whole claim these guards make, ' +
        'and RS-14 breaks the prediction that says which cases the language cannot be asked. The ' +
        'remaining rows would each need their own expected answer moved to repeat that one sentence ' +
        'about a different value.',
      guards: [
        'the-smallest-half-cent-to-fixed-loses-in-the-language',
        'the-half-cent-the-multiply-loses-in-the-language',
        'a-price-with-three-decimals-in-the-language',
        'a-sum-that-is-not-its-parts-in-the-language',
        'a-positive-half-in-the-language',
        'a-negative-half-in-the-language',
        'a-negative-one-and-a-half-in-the-language',
        'a-negative-two-and-a-half-in-the-language',
        'just-below-a-tie-in-the-language',
        'an-amount-that-rounds-away-to-nothing-in-the-language',
        'a-negative-zero-stays-negative-in-the-language',
        'a-positive-amount-that-rounds-away-to-nothing-in-the-language',
        'a-carry-through-every-digit-in-the-language',
        'a-carry-that-crosses-ten-in-the-language',
        'a-carry-that-crosses-a-hundred-in-the-language',
        'a-value-written-in-exponent-notation-in-the-language',
        'the-largest-double-in-the-language',
        'the-smallest-double-dropped-in-the-language',
        'a-place-count-of-negative-zero-in-the-language',
        'every-place-already-there-in-the-language',
        'the-error-moved-and-not-removed-parts-from-this-contract',
        'the-right-answer-as-text-parts-from-this-contract',
        'the-right-answer-as-text-is-the-spelling-a-caller-writes',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the four profiles RS-08 and RS-09 leave alone, and the addressing of the five. Each profile ' +
        'publishes a claim about what its samples do; RS-08 measures that an empty list is caught and ' +
        'RS-09 that a class nobody samples is caught, which is what block 4.5 has to answer for here.',
      guards: [
        'profile-money-to-the-cent',
        'profile-nothing-to-drop',
        'profile-seventeen-significant-digits',
        'profile-refused-calls',
        'every-profile-is-addressed',
      ],
    },
  ],

  mutants,
}
