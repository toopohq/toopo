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
 * **A specification mutant used to rename the guard it reddens, and no longer does.** Both tables of
 * this contract titled their tests by rendering the very data under mutation -
 * `it(`${input} -> ${expected}`)` - so NP-6 reddened a guard under a title the unmutated contract
 * does not contain and left the calibrated one silent, with a hundred guards of block 4.4 declared
 * silent in a block because attribution identifies a guard by its title and could not see the one
 * that spoke. `array/group-by@1` did not have the problem, because its cases carried an explicit
 * name; that is now the catalogue's rule, every case carries an `id`, and NP-6 is pinned on the guard
 * it was written for. The measured consequence is in this battery's own attribution: the block-4.4
 * silence went from an artefact of the apparatus to a fact about the battery, and one case of the
 * ninety-nine left it.
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

const EVERY_ID_UNIQUE = 'every-case-is-addressed'
const EVERY_INPUT_ONCE = 'settles-each-input-once'
const REASONS_AGREE = 'names-a-case-for-every-reason'
const EVERY_CASE_JUSTIFIED = 'every-case-is-justified'
const EVERY_PROFILE_POPULATED = 'every-profile-has-samples'
const INAPPLICABLE_STAY_INAPPLICABLE = 'universal-properties-answered'
const DIAGNOSTIC_TYPE = 'signature-publishes-the-diagnostic'
const REJECTED_PROFILE = 'profile-rejected-inputs'

const OVERFLOW_CASE_ID = 'overflow-past-the-largest-double'

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
      'tables exist to keep. It is the mutant the case identifier was introduced for: it used to be ' +
      'pinned on `"1e400" -> 0`, a title the unmutated contract does not contain, and it is now ' +
      'pinned on the guard it was written for',
    [edgeCases(OVERFLOW_CASE, `    input: '1e400',\n    expected: 0,\n    reason: 'overflow',`)],
    killed([OVERFLOW_CASE_ID]),
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
  sameOnEveryLens(
    'NP-10',
    'one case addressed by another case\'s identifier, so two rows of block 4.4 answer to one name. ' +
      'It is the defect an identifier makes possible, and the only mutant here that probes the ' +
      'catalogue guard introduced with it: an address that is not unique addresses nothing, and both ' +
      'rows go on passing, so nothing else in the suite has anything to say. A rename rather than an ' +
      'added case, for the reason NP-8 is one - the count check refuses a cell whose suite grew',
    [edgeCases(`    id: 'a-bigint-suffix',`, `    id: 'arbitrary-text',`)],
    killed([EVERY_ID_UNIQUE]),
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
      guards: [
        'signature-accepts-a-string',
        'signature-returns-a-number-or-null',
        'p1-finite-or-absent',
        'p4-failure-coupling',
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
      guards: [
        'p2-whitespace-insensitive',
        'p3-right-inverse-of-string',
        'determinism',
        'no-ambient-input-from-history',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the identity assertion of block 4.2. It is reachable from this side - rewriting ' +
        '`ParseNumber` in `contract.ts` reddens it - and the mutant is not written, because S-9 and ' +
        'S-10 of the reference battery already redden this guard from the implementation side and a ' +
        'declaration mutant would be the same failure read from the mirror.',
      guards: ['signature-is-the-declared-type'],
    },
    {
      nature: 'documents a decision',
      reason:
        'the four benchmark profiles NP-7 and NP-9 leave alone. Each publishes a claim about what ' +
        'its samples do, and one mutant per profile would repeat one sentence five times; NP-7 ' +
        'measures that the claim is executed and NP-9 that an empty list is caught, which is what ' +
        'block 4.5 has to answer for here.',
      guards: [
        'profile-small-integers',
        'profile-decimals-and-exponents',
        'profile-whitespace-padded',
        'profile-long-inputs',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the cases of block 4.4 no mutant here rewrites, and this list is what the case identifier ' +
        'bought. The same declaration used to name both suites whole, on the grounds that the ' +
        'silence was the instrument\'s: NP-6 did redden a guard in there, under a title the ' +
        'unmutated contract does not contain, so attribution could not see it and all hundred read ' +
        'as silent. They are now addressed by name, NP-6 reddens the case it was written for, and ' +
        'what is left is a measurement of this battery - forty-nine value guards and fifty described ' +
        'ones that would each need their own mutant to say one sentence about a different row. The ' +
        'described suite is whole because no mutant here changes a reason: NP-6 moves a value and ' +
        'leaves `overflow` in place, which is the asymmetry the two tables exist to keep.',
      suites: ['number/parse@1 named edge cases, described'],
      guards: [
        'ordinary-integer',
        'ordinary-negative-decimal',
        'surrounding-whitespace',
        'tabs-and-newlines',
        'leading-byte-order-mark',
        'whitespace-inside-the-number',
        'leading-plus-sign',
        'sign-detached-from-its-digits',
        'repeated-sign',
        'negative-zero',
        'leading-zeros',
        'bare-fraction',
        'trailing-decimal-point',
        'lone-decimal-point',
        'two-decimal-points',
        'exponent',
        'exponent-uppercase-and-signed',
        'negative-exponent',
        'exponent-with-no-digits',
        'the-empty-string',
        'a-blank-string',
        'the-word-nan',
        'the-word-infinity',
        'the-word-negative-infinity',
        'hexadecimal',
        'octal',
        'binary',
        'comma-as-a-decimal-separator',
        'comma-grouping',
        'underscore-grouping',
        'comma-grouping-with-a-decimal-point',
        'apostrophe-grouping',
        'no-break-space-grouping',
        'narrow-no-break-space-grouping',
        'grouping-that-is-not-in-threes',
        'full-stop-grouping-with-a-comma-decimal',
        'an-ordinary-space-between-digits',
        'a-typographic-apostrophe-between-digits',
        'the-arabic-thousands-separator',
        'a-separator-with-nothing-to-separate',
        'a-separator-in-text-that-is-not-a-number',
        'a-separator-inside-a-radix-prefix',
        'arbitrary-text',
        'a-bigint-suffix',
        'arabic-indic-digits',
        'an-inherited-property-name',
        'underflow-to-zero',
        'negative-underflow',
        'an-integer-past-two-to-the-fifty-third',
      ],
    },
  ],

  mutants,
}
