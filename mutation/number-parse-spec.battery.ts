/**
 * The `number/parse@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks the other
 * question: does the contract catch a broken *specification*? The two are not the same guard set at
 * all - measured, five guards of this contract are red on nothing the reference battery can do,
 * because they read the declarations rather than the answers.
 *
 * A second battery rather than a second arm or a second lens, and that is a design constraint rather
 * than a filing preference. `unreachableGuards` in the reference battery says, in writing, "this
 * battery injects into `reference.ts`". Widening that battery's reach would make its own declaration
 * false - which is precisely the defect this instrument exists to make loud, arriving through the
 * front door.
 *
 * Two limits were measured while writing it, and both are properties of the instrument rather than
 * of this contract.
 *
 * **A specification mutant may not change the number of guards.** `assertWholeSuiteRan` compares the
 * count against calibration, and it cannot tell a table that grew from a suite that half ran. So the
 * duplicate-input defect is written as one case *renamed onto* another rather than as a case added,
 * and the empty-profile defect empties a sample list rather than deleting a profile.
 *
 * **A specification mutant renames the guard it reddens.** Both tables of this contract title their
 * tests by rendering the very data under mutation - `it(`${input} -> ${expected}`)` - so a mutant
 * that changes an expectation reddens a guard under a title that does not exist in the unmutated
 * contract, and leaves the calibrated one silent. NP-6 and NP-8 are those mutants: they are pinned
 * on the titles they really redden, and the attribution cannot see them, because it identifies a
 * guard by its title. `array/group-by@1` does not have this problem - its cases carry an explicit
 * `title` field - which is the first argument this repository has for writing tables that way.
 *
 * The prefix is per contract rather than a shared counter. `F-`, `X-` and `S-` are global because
 * they were not, once, and the collision cost a rename; two letters make one impossible.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, killedByTypecheck, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const FAILURE_REASONS = `export const failureReasons = ['empty', 'separator', 'not-decimal', 'overflow'] as const`

const NEVER_MUTATES = `    name: 'never mutates its arguments',
    applicable: false,`

const SMALL_INTEGERS = `    samples: ['0', '7', '42', '1999', '-15'],`

const REJECTED_SAMPLES = `    samples: ['', '   ', 'abc', '0x1F', '1,5', 'NaN'],`

const ARBITRARY_TEXT_RATIONALE = `    rationale: 'Arbitrary text is not a number.',`

const ARBITRARY_TEXT_CASE = `    input: 'abc',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',`

const OVERFLOW_CASE = `    input: '1e400',
    expected: null,
    reason: 'overflow',`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_INPUT_ONCE = 'settles each input exactly once'
const REASONS_AGREE = 'names a case for every declared reason, and declares every reason it names'
const EVERY_CASE_JUSTIFIED = 'publishes a rationale for every decision'
const EVERY_PROFILE_POPULATED = 'declares a non-empty sample set for every profile'
const INAPPLICABLE_STAY_INAPPLICABLE = 'keeps the inapplicable universal properties declared as such'
const DIAGNOSTIC_TYPE = 'publishes the diagnostic surface with the type the contract declares'
const REJECTED_PROFILE = 'rejected-inputs - every sample is rejected'

/**
 * A title that does not exist in the unmutated contract, because the mutant renders it. NP-8 has no
 * twin here: renaming an input onto another produces a title that already exists and still passes,
 * so the only guard that speaks is the one about the table.
 */
const OVERFLOW_RENAMED = '"1e400" -> 0'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'NP-1',
    'a case published with no justification. It is the calibration mutant of this battery: the ' +
      'guard it reddens is the one every contract in the catalogue carries, in the same words, out ' +
      'of `catalogue/every-contract.ts` - so an apparatus that cannot see this one cannot see ' +
      'anything a specification battery is for',
    [edgeCases(ARBITRARY_TEXT_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),
  sameOnEveryLens(
    'NP-2',
    'an inapplicable universal property promoted to applicable - the cheapest way to inflate a ' +
      'green count with a guard that cannot fail. This contract is where the catalogue measured ' +
      'that `never mutates its arguments` is unfalsifiable on a string, so the flag is the whole ' +
      'record of that measurement; nothing else in the suite reads it',
    [contract(NEVER_MUTATES, `    name: 'never mutates its arguments',\n    applicable: true,`)],
    killed([INAPPLICABLE_STAY_INAPPLICABLE]),
  ),
  sameOnEveryLens(
    'NP-3',
    'a reason declared and never produced. `wrong-radix` is not an invented literal: block 4.2 ' +
      'argues in writing against exactly this one, on the grounds that `0o17` would be a radix ' +
      'prefix while `0777` parses, so the category is inconsistent at its own edge. A caller ' +
      'switching exhaustively would carry a branch no input reaches. Two guards see it, and one of ' +
      'them is the compiler: the declared reason set is the return type of the diagnostic, so ' +
      'widening it makes the reference stop matching the type the contract publishes',
    [
      contract(
        FAILURE_REASONS,
        `export const failureReasons = ['empty', 'separator', 'not-decimal', 'overflow', 'wrong-radix'] as const`,
      ),
    ],
    killed([REASONS_AGREE, DIAGNOSTIC_TYPE]),
  ),
  sameOnEveryLens(
    'NP-4',
    'a reason produced and never declared - the same guard from the other side, and the mutant that ' +
      'shows how much of this contract the compiler holds on its own. Removing `separator` leaves ' +
      'nine entries of block 4.4 typed against a union that no longer contains their reason: ' +
      'measured, nine source errors the run reports and no guard names. It is still killed by two ' +
      'guards, so the compiler is defence in depth here rather than the only line - which is exactly ' +
      'what NP-5 is written to separate',
    [
      contract(
        FAILURE_REASONS,
        `export const failureReasons = ['empty', 'not-decimal', 'overflow'] as const`,
      ),
    ],
    killed([REASONS_AGREE, DIAGNOSTIC_TYPE]),
  ),
  sameOnEveryLens(
    'NP-5',
    'a provenance outside the vocabulary the catalogue declares. This is the part of the ' +
      'specification the compiler holds alone, and it was already known to be: the catalogue says ' +
      'in writing that no test can check a declared provenance, because a sentence about how a case ' +
      'was found is not a property of the case. The mutant measures the consequence rather than ' +
      'restating it - the run reddens, no guard reports a failure, and the verdict is the one this ' +
      'instrument counts apart',
    [edgeCases(ARBITRARY_TEXT_CASE, ARBITRARY_TEXT_CASE.replace(`'specified'`, `'invented'`))],
    killedByTypecheck,
  ),
  sameOnEveryLens(
    'NP-6',
    'an expected value moved to a wrong answer that is not an obviously wrong one: `1e400` settled ' +
      'as 0 rather than as a refusal, which is what an implementation reading the underflow rule ' +
      'onto the overflow case would produce. Only the value half of block 4.4 reddens - the ' +
      'described half still requires `overflow` and still gets it - which is the asymmetry the two ' +
      'tables exist to keep. It is pinned on a title the unmutated contract does not contain, ' +
      'because this table renders its titles from the data being mutated',
    [edgeCases(OVERFLOW_CASE, `    input: '1e400',\n    expected: 0,\n    reason: 'overflow',`)],
    killed([OVERFLOW_RENAMED]),
  ),
  sameOnEveryLens(
    'NP-7',
    'a benchmark sample that takes the path its profile is named for the opposite of. This contract ' +
      'is where the guard came from - `long-inputs` promised to time the cost of reading a long ' +
      'number and a third of its samples timed the cost of refusing one - and the guard has never ' +
      'been red since, because the samples were repaired in the same change. `42` in the rejected ' +
      'profile is the same defect reintroduced on the other profile',
    [contract(REJECTED_SAMPLES, `    samples: ['', '   ', 'abc', '42', '1,5', 'NaN'],`)],
    killed([REJECTED_PROFILE]),
  ),
  sameOnEveryLens(
    'NP-8',
    'one input renamed onto another, so block 4.4 settles the same string twice. Written as a ' +
      'rename rather than as an added case on purpose: adding one would grow the suite by two tests ' +
      'and the instrument would refuse the cell before any guard could speak, which is the count ' +
      'check doing its job and is why a specification battery cannot express a defect of size. Both ' +
      'copies answer correctly, so the duplication guard is the only thing that sees it',
    [edgeCases(`    input: 'abc',`, `    input: '12n',`)],
    killed([EVERY_INPUT_ONCE]),
  ),
  sameOnEveryLens(
    'NP-9',
    'a benchmark profile emptied of its samples - the shape a profile reaches when it is written ' +
      'first and populated later, or when a rename leaves the list behind. The class assertion ' +
      'beside it passes on an empty list, which is exactly why the emptiness guard is a separate ' +
      'one rather than a clause of it',
    [contract(SMALL_INTEGERS, `    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),
]

export const battery: Battery = {
  name: 'number-parse-spec',
  contractPath: 'contracts/number/parse',
  timeZone: 'UTC',
  calibrationMutant: 'NP-1',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'failure reported as null, with the reason published beside the return channel',
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

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the contract\'s declarations. This battery injects ' +
        'into `contract.ts` and `edge-cases.ts`, and these four read neither: two compare the ' +
        'reference\'s own type against a type written beside them, and two quantify over answers ' +
        'this battery does not change. They are the reference battery\'s to witness, and it does - ' +
        'S-9, S-10, P-03, P-04, P-07 and X-1 among them.',
      titles: [
        'accepts a string and nothing else',
        'returns a number that may be absent, never NaN-as-number-only',
        'P1 - returns null or a finite number, never NaN and never Infinity',
        'P4 - a string fails to parse exactly when it has a description',
      ],
    },
  ],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'reachable from here only through `outputsAreEqual`, which lives in `contract.ts` and which ' +
        'this battery does not mutate. All four compare two answers with the contract\'s declared ' +
        'equality, so a mutant that broke that function would redden them - and a defect of the ' +
        'contract\'s own comparison is a fifth family, not one of the four written here. The ' +
        'reference battery witnesses every one of them.',
      titles: [
        'P2 - is insensitive to surrounding whitespace',
        'P3 - is a right inverse of String on the finite doubles, except negative zero',
        'is deterministic - the same input yields the same output on every call',
        'has no ambient input - an answer does not depend on the inputs parsed before it',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the identity assertion of block 4.2. It is reachable from this side - rewriting ' +
        '`ParseNumber` in `contract.ts` reddens it - and the mutant is not written, because S-9 and ' +
        'S-10 of the reference battery already redden this guard from the implementation side and a ' +
        'declaration mutant would be the same failure read from the mirror.',
      titles: ['matches the type declared by the contract'],
    },
    {
      nature: 'documents a decision',
      reason:
        'the four benchmark profiles NP-7 and NP-9 leave alone. Each publishes a claim about what ' +
        'its samples do, and one mutant per profile would repeat one sentence five times; NP-7 ' +
        'measures that the claim is executed and NP-9 that an empty list is caught, which is what ' +
        'block 4.5 has to answer for here.',
      titles: [
        'small-integers - every sample is accepted',
        'decimals-and-exponents - every sample is accepted',
        'whitespace-padded - every sample is accepted',
        'long-inputs - every sample is accepted',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'both tables of block 4.4, and the silence is the instrument\'s rather than the battery\'s. ' +
        'NP-6 and NP-8 do redden a guard in here; they redden it under a title the unmutated ' +
        'contract does not contain, because `edge-cases.test.ts` renders each title out of the very ' +
        'data being mutated. Attribution identifies a guard by its title, so the guard that speaks ' +
        'is invisible to it and the hundred guards calibrated here are all silent. The pins on NP-6 ' +
        'and NP-8 name the titles that really redden, so the cells still disagree if detection ' +
        'moves.',
      suites: ['number/parse@1 named edge cases', 'number/parse@1 named edge cases, described'],
    },
  ],

  mutants,
}
