/**
 * The `number/round@1` reference battery.
 *
 * It injects into `reference.ts` and asks the question the contract exists to answer: does this
 * suite refuse an implementation that rounds the way the language rounds? Most of the cells below
 * are not invented - they are `toFixed`, `Math.round` and the scaling trick, transplanted into the
 * reference and offered to the suite.
 *
 * **The specification battery is separate and injects into `contract.ts` and `edge-cases.ts`.** The
 * declaration under `unreachableGuards` says, in writing, that this battery reaches the
 * implementation and nothing else; widening it would make that declaration false, which is the
 * defect this instrument exists to make loud arriving through the front door. ADR-0075.
 *
 * ---------------------------------------------------------------------------
 * Three cells survive, and each is inert for every input rather than unreached
 * ---------------------------------------------------------------------------
 *
 * RD-05, RD-09 and RD-11 remove three defensive constructs from the reference and redden nothing.
 * They are not coverage gaps: each was measured differentially against the reference over 2 000 001
 * values at four place counts and twenty-five traps at twenty-one, with zero disagreements, and each
 * has a structural argument beside the measurement. What they establish is that those three
 * constructs state an intent rather than carry a behaviour - which is worth knowing about a file
 * that is frozen for life the moment this contract is published.
 *
 * ADR-0143 injected sixteen perturbations of this file by hand and read the suite after each, to
 * establish that every property could be seen red. It named three findings and did not carry the
 * perturbations as data, so what is below is derived again rather than transcribed - and its three
 * findings are cells here, because a finding nobody can replay is a sentence.
 *
 * ADR-0143 is the contract and ADR-0144 the publication that let this battery name its folder.
 *
 * The prefix is `RD-`, two letters, on the rule `CLAUDE.md` records: `F-`, `S-` and `X-` are global
 * counters because they were not once, and the collision cost a rename. Signature mutants continue
 * the global `S-` counter and probes the global `F-`.
 *
 * **The four signature cells are `killed` and not `killed-by-typecheck`, and the replay is what said
 * so.** A cell reddening no guard at all is what earns that verdict; this battery typechecks its own
 * suite, so a broken declaration reddens `signature.test-d.ts` by name. An out-of-band `tsc` over the
 * whole tree says the tree does not compile, which is a different question, and a pin does not move
 * on a measurement that asks the wrong one.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const A_FINITE = `  if (!Number.isFinite(value)) return 'value-not-finite'`
const A_WHOLE = `  if (!Number.isInteger(places)) return 'places-not-whole'`
const A_NEGATIVE = `  if (places < 0) return 'places-negative'`

const INCREMENT_HEAD = `const incremented = (digits: string): string => {`
const CARRY = `    if (out[at] !== '9') {`

const DIGITS = `    digits: (whole + fraction).replace(/^0+(?=\\d)/, ''),`
const SCALE = `    scale: Number(exponent) - fraction.length,`

const ENTRY = `export const round = (value: number, places: number): number | null => {`
const DIAGNOSTIC = `export const describeRoundFailure = (\n  value: number,\n  places: number,\n): RoundFailureReason | null => refusalFor(value, places)`
const SIGN = `  const negative = value < 0 || Object.is(value, -0)`
const NOTHING_TO_DROP = `  if (toDrop <= 0) return value`
const FIRST = `  const first = toDrop > digits.length ? '0' : (digits[digits.length - toDrop] as string)`
const CARRIED = `  const carried = first >= '5' ? incremented(kept) : kept === '' ? '0' : kept`

// ---------------------------------------------------------------------------
// The guards, by identifier
// ---------------------------------------------------------------------------

const FINITE_OR_ABSENT = 'p1-finite-or-absent'
const THE_WRITTEN_DECIMAL = 'p2-the-written-decimal-and-not-the-stored-double'
const IDEMPOTENT = 'p3-idempotent'
const NOTHING_TO_DROP_IS_THE_VALUE = 'p4-nothing-to-drop-is-the-value'
const ORDER_PRESERVING = 'p5-order-preserving'
const SIGN_SYMMETRIC = 'p6-sign-symmetric'
const FAILURE_COUPLING = 'p7-failure-coupling'

const DETERMINISTIC = 'determinism'
const CALL_HISTORY = 'no-ambient-input-from-history'

const TYPE_IDENTITY = 'signature-is-the-declared-type'
const TAKES_TWO_NUMBERS = 'signature-takes-two-numbers'
const RETURNS_NUMBER_OR_NULL = 'signature-returns-a-number-or-null'
const PUBLISHES_THE_DIAGNOSTIC = 'signature-publishes-the-diagnostic'

/**
 * The corpus every survival claim below was measured over, named once because three cells rest on
 * it. It is `THE_SWEEP`'s own population plus the values `theTraps` and block 4.4 reach.
 */
const THE_CORPUS =
  'measured differentially against the reference over 2 000 001 values at four place counts and ' +
  'twenty-five traps at twenty-one: zero disagreements'

// ---------------------------------------------------------------------------
// The defects - what an implementation of this contract plausibly gets wrong
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  sameOnEveryLens(
    'RD-01',
    'delegates to `toFixed`, which is the trap this contract was written to correct and the first ' +
      'thing a reader proposes on being shown the signature. It rounds the stored double rather ' +
      'than the decimal the caller wrote, so `round(1.005, 2)` answers 1 - and it is the ' +
      'calibration mutant because an apparatus that cannot see the defect the contract is named ' +
      'for cannot see anything',
    [
      reference(
        ENTRY,
        `${ENTRY}\n  if (refusalFor(value, places) !== null) return null\n\n  return Number(value.toFixed(places))`,
      ),
    ],
    killed([THE_WRITTEN_DECIMAL, FINITE_OR_ABSENT, IDEMPOTENT, NOTHING_TO_DROP_IS_THE_VALUE]),
  ),

  sameOnEveryLens(
    'RD-02',
    'scales by a power of ten, rounds with `Math.round` and scales back - the second spelling a ' +
      'caller reaches for, and the one that carries two defects at once. Multiplying introduces a ' +
      'second error on top of the first, and `Math.round` breaks a tie towards positive infinity ' +
      'rather than away from zero, so a refund rounds the opposite way from the charge it reverses',
    [
      reference(
        ENTRY,
        `${ENTRY}\n  if (refusalFor(value, places) !== null) return null\n\n  const scaled = 10 ** places\n\n  return Math.round(value * scaled) / scaled`,
      ),
    ],
    killed([THE_WRITTEN_DECIMAL, SIGN_SYMMETRIC, ORDER_PRESERVING]),
  ),

  sameOnEveryLens(
    'RD-03',
    'breaks a tie towards zero rather than away from it - half-down, which is the rule nobody ' +
      'declares and everybody writes by getting the comparison one character wrong. Every value ' +
      'that is not on a tie is answered correctly, so only the region block 4.4 and the thousandth ' +
      'arbitrary reach can see it',
    [reference(CARRIED, CARRIED.replace(`first >= '5'`, `first > '5'`))],
    killed([THE_WRITTEN_DECIMAL]),
  ),

  sameOnEveryLens(
    'RD-04',
    'carries from four rather than from five, so a fourth digit of four rounds up. It is the same ' +
      'one-character slip as RD-03 in the other direction, and it is here because a battery that ' +
      'only ever perturbs a boundary inwards has measured half a boundary. **It reddens two guards ' +
      'where RD-03 reddens thirteen**: half-down parts from this contract on every tie block 4.4 ' +
      'carries, and carrying early parts from it only where a fourth digit is exactly four',
    [reference(CARRIED, CARRIED.replace(`first >= '5'`, `first >= '4'`))],
    killed([THE_WRITTEN_DECIMAL, 'just-below-a-tie']),
  ),

  sameOnEveryLens(
    'RD-05',
    'reads the sign off the comparison alone, dropping the `Object.is(value, -0)` disjunct. **It ' +
      'survives because the early return is in front of it**: negative zero has the decimal `0` at ' +
      'scale zero, so `toDrop` is `-places` and is never positive for a place count this contract ' +
      'accepts - the value is answered back before the sign is ever consulted. So the disjunct ' +
      'states an intent and carries no behaviour, and `a-negative-zero-stays-negative` guards the ' +
      `contract rather than this path. ${THE_CORPUS}`,
    [reference(SIGN, `  const negative = value < 0`)],
    survived('equivalent'),
  ),

  sameOnEveryLens(
    'RD-06',
    'refuses nothing for the value, so `NaN` and both infinities are answered rather than refused. ' +
      'The refusal is what keeps this contract\'s promise that an answer is a finite number or ' +
      'nothing at all, and a caller reaches this arm by passing a total that overflowed upstream',
    [reference(A_FINITE, `  if (false) return 'value-not-finite'`)],
    killed([FINITE_OR_ABSENT, 'not-a-number', 'positive-infinity', 'negative-infinity']),
  ),

  sameOnEveryLens(
    'RD-07',
    'refuses nothing for the place count, so a fractional one, an infinite one and `NaN` are all ' +
      'accepted. The digit arithmetic answers a fractional exponent without complaining, because a ' +
      'fractional exponent is a perfectly good double - nothing about the answer looks wrong until ' +
      'it is compared with the one the contract settles',
    [reference(A_WHOLE, `  if (false) return 'places-not-whole'`)],
    killed([
      FINITE_OR_ABSENT,
      'a-fractional-place-count',
      'a-place-count-that-is-not-a-number',
      'an-infinite-place-count',
    ]),
  ),

  sameOnEveryLens(
    'RD-08',
    'answers a negative place count instead of refusing it - rounding to tens and hundreds, which ' +
      '`inputDomain` excludes in as many words. It is the helpful widening a reader proposes on ' +
      'reading the signature, and the contract refuses it so that a caller who passes a negative ' +
      'by accident is told rather than handed a number a hundred times too large',
    [reference(A_NEGATIVE, `  if (false) return 'places-negative'`)],
    killed(['a-negative-place-count', 'a-negative-place-count-described']),
  ),

  sameOnEveryLens(
    'RD-09',
    'strips no leading zero from the digit string, so `String(0.001)` contributes `"0001"` rather ' +
      'than `"1"`. **It survives because a leading zero moves both terms that read the string ' +
      'together**: it can only ever come from `whole === "0"`, so `digits.length` and the index ' +
      '`first` is taken at shift by the same amount, and `Number` ignores it in the answer. ' +
      `${THE_CORPUS}`,
    [reference(DIGITS, `    digits: whole + fraction,`)],
    survived('equivalent'),
  ),

  sameOnEveryLens(
    'RD-10',
    'reads the exponent and forgets the fraction length, so the scale is wrong for every value ' +
      '`String` writes with a decimal point and right for every one it writes without. That ' +
      'function produces three forms and this handles one of them',
    [reference(SCALE, `    scale: Number(exponent),`)],
    killed([
      THE_WRITTEN_DECIMAL,
      'profile-money-to-the-cent',
      'profile-half-cents',
      'profile-seventeen-significant-digits',
    ]),
  ),

  sameOnEveryLens(
    'RD-11',
    'indexes past the left edge of the digit string rather than answering a zero there. **It ' +
      'survives because `undefined >= "5"` is false**, which is exactly what `"0" >= "5"` already ' +
      'was - so the explicit default states what happens past the edge and carries no behaviour ' +
      `of its own. ${THE_CORPUS}`,
    [reference(FIRST, `  const first = digits[digits.length - toDrop] as string`)],
    survived('equivalent'),
  ),

  sameOnEveryLens(
    'RD-12',
    'returns the value whenever there is nothing to drop *or* one digit to drop, which is the ' +
      'off-by-one a reader writes on reading `toDrop` as a count of digits kept',
    [reference(NOTHING_TO_DROP, `  if (toDrop <= 1) return value`)],
    killed([THE_WRITTEN_DECIMAL]),
  ),

  sameOnEveryLens(
    'RD-13',
    'hoists the carry out of the increment loop into a module-level accumulator, so the digits one ' +
      'call carries leak into the next. ADR-0143 names this as the witness that really reddens ' +
      'determinism, having measured that the two caches it tried first do not - the probe primes ' +
      'them itself, which is the limit `number/parse@1` records of its own',
    [
      reference(
        INCREMENT_HEAD,
        `const carriedOver: string[] = []\n\n${INCREMENT_HEAD}\n  carriedOver.push(digits)\n  if (carriedOver.length > 1) digits = carriedOver[0] as string`,
      ),
    ],
    killed([THE_WRITTEN_DECIMAL, ORDER_PRESERVING]),
  ),

  sameOnEveryLens(
    'RD-14',
    'never carries at all: every digit becomes zero and the loop runs off the left edge, so the ' +
      'growth arm answers where the ordinary arm should. It is the half of the increment a reader ' +
      'tests least, because a carry that grows the string is the one they remember to check',
    [reference(CARRY, `    if (false) {`)],
    killed([THE_WRITTEN_DECIMAL, 'the-smallest-double-carried-up']),
  ),

  sameOnEveryLens(
    'RD-15',
    'drops the early return for a value that has nothing to drop, so every such call goes through ' +
      'the digit path and is rebuilt at the wrong scale. It is the shape of a reader deciding the ' +
      'early return was an optimisation rather than the answer. **Measured, it is load-bearing only ' +
      'where `toDrop` is strictly negative**: at exactly zero the digit path keeps every digit and ' +
      'rebuilds at the same scale, so it answers the value back too - which is why ' +
      '`every-place-already-there` stays green here and `the-largest-double` does not',
    [reference(NOTHING_TO_DROP, `  if (false) return value`)],
    killed([NOTHING_TO_DROP_IS_THE_VALUE, IDEMPOTENT, 'the-largest-double']),
  ),

  sameOnEveryLens(
    'RD-16',
    'caps the place count at what `toFixed` accepts, refusing anything above a hundred - the limit ' +
      'an implementation inherits by having been written around that function and then rewritten ' +
      'without it. ECMA-402 caps out there too, which is why block 4.4 carries a case on each side',
    [
      reference(
        A_NEGATIVE,
        `${A_NEGATIVE}\n  if (places > 100) return 'places-negative'`,
      ),
    ],
    killed(['a-place-count-past-what-to-fixed-accepts', 'a-place-count-larger-than-any-decimal']),
  ),

  sameOnEveryLens(
    'RD-17',
    'gives the diagnostic its own, weaker check: it reports only a non-finite value and says ' +
      'nothing about a place count. This is the implementation `p7-failure-coupling` is written ' +
      'for and the reason that property is not decorative - one that validates on the answering ' +
      'path and leaves the diagnostic to guess is a shape a reader writes without noticing',
    [
      reference(
        DIAGNOSTIC,
        `export const describeRoundFailure = (\n  value: number,\n  places: number,\n): RoundFailureReason | null => (Number.isFinite(value) ? null : 'value-not-finite')`,
      ),
    ],
    killed([FAILURE_COUPLING]),
  ),

  sameOnEveryLens(
    'RD-18',
    'inverts the finiteness test, so every finite value is refused and the two infinities are ' +
      'answered - a one-character slip, and the total collapse a battery needs at least one of. ' +
      'It is what says whether the guards that catch a subtle defect also catch an obvious one, or ' +
      'whether they were only ever reading the region the subtle one moved. **It is the one cell ' +
      'that reaches the diagnostic\'s silence**: every other defect here refuses more or answers ' +
      'differently, and the twenty guards asserting that an answered call has no description can ' +
      'only be reddened by a description appearing where the contract answers',
    [reference(A_FINITE, `  if (Number.isFinite(value)) return 'value-not-finite'`)],
    killed([
      FINITE_OR_ABSENT,
      NOTHING_TO_DROP_IS_THE_VALUE,
      'a-price-with-three-decimals',
      'a-price-with-three-decimals-described',
      'every-place-already-there',
    ]),
  ),
]

// ---------------------------------------------------------------------------
// The signature - what the declared type refuses before a behaviour runs
// ---------------------------------------------------------------------------

const signatures: readonly Mutant[] = [
  sameOnEveryLens(
    'S-26',
    'widens the value to `number | string`, which is the convenience an implementation offers when ' +
      'it finds callers passing the text out of an input field. This contract takes a number, and ' +
      'a parser is a contract of its own at `number/parse@1`',
    [
      reference(
        ENTRY,
        `export const round = (value: number | string, places: number): number | null => {`,
      ),
    ],
    killed([TYPE_IDENTITY, TAKES_TWO_NUMBERS]),
  ),

  sameOnEveryLens(
    'S-27',
    'gives `places` a default of two, which reads as a kindness and puts a second arity into the ' +
      'major for life. `round(x)` then says *round x* without saying which way, which is the ' +
      'ambiguity `Math.round` already occupies',
    [reference(ENTRY, `export const round = (value: number, places = 2): number | null => {`)],
    killed([TYPE_IDENTITY, TAKES_TWO_NUMBERS]),
  ),

  sameOnEveryLens(
    'S-28',
    'drops `null` from the return type, which is the shape that makes a loss silent - the whole ' +
      'argument of this contract\'s block 4.1 arriving in the type',
    [reference(ENTRY, `export const round = (value: number, places: number): number => {`)],
    killed([TYPE_IDENTITY, RETURNS_NUMBER_OR_NULL]),
  ),

  sameOnEveryLens(
    'S-29',
    'narrows the diagnostic to a string, so a caller can no longer switch on the reason set this ' +
      'contract freezes with the major',
    [
      reference(
        DIAGNOSTIC,
        `export const describeRoundFailure = (\n  value: number,\n  places: number,\n): string | null => refusalFor(value, places)`,
      ),
    ],
    // The only red on this mutant, which the replay reports as load-bearing: nothing else in the
    // suite notices a diagnostic that stops naming the reason set the contract freezes.
    killed([PUBLISHES_THE_DIAGNOSTIC]),
  ),
]

// ---------------------------------------------------------------------------
// The probes - questions about the shape of the contract rather than defects
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-12',
    'appends to the digit string instead of replacing it, so the magnitude grows without bound and ' +
      'both calls of the determinism pair answer `Infinity`. `outputsAreEqual` is `Object.is`, ' +
      'which judges two infinities equal - so on a numeric contract an overflow absorbs a ' +
      'determinism signal. ADR-0143 found it and recorded it in the reason itself, because the ' +
      'next numeric contract will reach for the same accumulator mutant',
    [
      reference(
        INCREMENT_HEAD,
        `let accumulated = ''\n\n${INCREMENT_HEAD}\n  accumulated += digits\n  digits = accumulated`,
      ),
    ],
    killed([FINITE_OR_ABSENT, THE_WRITTEN_DECIMAL]),
  ),

  probe(
    UNDER,
    'F-13',
    'refuses a place count of negative zero rather than treating it as a count of zero. ADR-0143 ' +
      'injected exactly this and read **nothing at all** red - not one of the ten properties - ' +
      'because the decision is in no property\'s alphabet. It asks which guard is the only sensor ' +
      'for a settled decision that no property represents, and the answer is block 4.4',
    [reference(A_NEGATIVE, `  if (places < 0 || Object.is(places, -0)) return 'places-negative'`)],
    killed(['a-place-count-of-negative-zero', 'a-place-count-of-negative-zero-described']),
  ),
]

export const battery: Battery = {
  name: 'number-round',
  contractPath: 'contracts/typescript/number/round',
  timeZone: 'UTC',
  calibrationMutant: 'RD-01',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention:
        'fallible - two exports, an answer that may be absent and a diagnostic that says why, ' +
        'coupled by block 4.2',
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
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the case ' +
        'table, the profile list or the universal-property declarations.',
      guards: [
        'every-case-is-addressed',
        'every-case-is-grouped',
        'every-case-is-justified',
        'settles-each-call-once',
        'names-a-case-for-every-reason',
        'every-answered-case-answers-a-number',
        'every-profile-has-samples',
        'every-profile-is-addressed',
        'every-class-the-vocabulary-declares-is-sampled',
        'universal-properties-answered',
      ],
    },
    {
      /**
       * The whole of `language.test.ts`, and the reason is a fact about that file rather than a
       * limit of this battery: it never calls the implementation. Every guard there compares the
       * language's own rounders - `Intl.NumberFormat`, `toFixed`, the scaling trick - against the
       * answers block 4.4 declares, so what it settles is whether the *contract* really parts from
       * the language. An implementation cannot make that true or false, which is why the
       * specification battery is where these are reachable.
       */
      reason:
        'over the language and the declared answers rather than over the implementation. Nothing ' +
        'in `language.test.ts` calls `round`: it asks whether the answers this contract settles ' +
        'differ from what the language produces, which is a question about the contract.',
      guards: [
        'the-half-cent-to-fixed-loses-in-the-language',
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
        'every-case-the-language-cannot-be-asked-is-refused-or-past-a-hundred-places',
        'the-stored-double-and-not-the-written-decimal-parts-from-this-contract',
        'the-error-moved-and-not-removed-parts-from-this-contract',
        'the-right-answer-as-text-parts-from-this-contract',
        'the-stored-double-and-not-the-written-decimal-over-the-sweep',
        'the-error-moved-and-not-removed-over-the-sweep',
        'the-right-answer-as-text-over-the-sweep',
        'the-right-answer-as-text-is-the-spelling-a-caller-writes',
      ],
    },
  ],

  unprobedRegions: [],

  mutants: [...behaviour, ...signatures, ...probes],
}
