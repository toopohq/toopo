/**
 * Contract `number/round@1`. The anatomy of a contract folder is the catalogue's and is described in
 * `packages/catalogue/every-contract.ts`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * ADR-0143 carries the admission: the three spellings a caller reaches for, what each one gets
 * wrong, and why they are three traps rather than one.
 *
 * Failure is reported as `null`, with the reason published beside the return channel rather than
 * inside it - the catalogue-wide convention, settled on `number/parse@1` and `date/add@1`.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../../packages/catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'number/round',
  major: 1,
  exportName: 'round',

  summary:
    'Round a number to a fixed number of decimal places, or null when the call cannot be answered.',

  /** Written to answer the natural search query "round to 2 decimal places javascript". */
  description:
    'Rounds a number to a fixed number of decimal places in JavaScript and TypeScript, answering ' +
    'the decimal the caller wrote rather than the double the machine stored. The two spellings a ' +
    'caller reaches for first are wrong, silently: Number((1.005).toFixed(2)) answers 1 and ' +
    'Math.round(1.005 * 100) / 100 answers 1, because the double nearest 1.005 sits below it. ' +
    'Neither ever returns NaN, so nothing announces the loss - a half-cent goes missing and the ' +
    'total is short. Math.round carries a second, unrelated fault: it breaks a tie towards positive ' +
    'infinity, so Math.round(-0.5) is -0 and Math.round(-2.5) is -2, which makes a refund round the ' +
    'opposite way from the charge it reverses. The one spelling in the language that answers ' +
    'correctly is Intl.NumberFormat with a rounding mode, and it hands back a locale-formatted ' +
    'string: converting it back with Number is the third trap, because "1,000.01" is NaN. This ' +
    'contract answers a number, breaks every tie away from zero, and refuses rather than guesses.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: half away from zero is the rule a person and an
   * invoice expect, and it is *not* the rule IEEE 754 or a statistics package would choose.
   */
  inputDomain:
    'Finite doubles carrying an amount somebody wrote down: prices, totals, tax lines, ' +
    'measurements, percentages, chart axes. It is not a formatter - the answer is a number and ' +
    'never text - not a decimal arithmetic library, not a currency type, not banker\'s rounding, ' +
    'and not a way to round to tens or hundreds, which is why a negative place count is refused ' +
    'rather than answered.',

  /**
   * Optional by ADR-0009, and owed here: `contractAnatomy` requires a contract that answers
   * differently from the language to say so, and `language.test.ts` replays the parting.
   */
  relationToTheLanguage:
    'The language ships `toFixed`, which answers a string and rounds the stored double rather ' +
    'than the decimal the caller wrote, and `Math.round`, which breaks a tie towards positive ' +
    'infinity rather than away from zero. `Intl.NumberFormat` with `roundingMode: "halfExpand"` ' +
    'agrees with this contract and answers locale-formatted text.',

  searchAliases: [
    'round to 2 decimal places',
    'round to decimals',
    'round number javascript',
    'toFixed',
    'to fixed',
    'round half up',
    'round money',
    'round price',
    'floating point rounding',
    'round to nearest cent',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * One call of this contract: the value to round and the number of decimal places to keep.
 *
 * It is named `Call` rather than `BenchmarkSample` because two blocks need it - block 4.5 samples a
 * call, and `theTraps` below names the calls where the language and this contract part. A second
 * type carrying the same two fields would be the same statement written twice.
 */
export type Call = {
  readonly value: number
  readonly places: number
}

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 *
 * `places` is required rather than defaulted to zero. A default would put a second arity into the
 * major, and `round(x)` reads as "round x" to a caller who has not checked which way it rounds - the
 * exact ambiguity `Math.round` already occupies.
 */
export type Round = (value: number, places: number) => number | null

/**
 * Why a call cannot be answered. Declared as a list rather than only as a type, so that the
 * partition is a value the contract can check itself against: `edge-cases.test.ts` requires the
 * reasons the table actually produces to be exactly these three.
 *
 * The literals belong to this contract and to no other. There is no shared failure type in the
 * catalogue, so a reason means exactly what this contract says it means.
 *
 * The partition is frozen with the major, so each literal is argued rather than listed.
 *
 * `value-not-finite` is one literal for NaN and for both infinities, because one message covers all
 * three without lying - there is no decimal to round - and no caller acts differently on them. A
 * caller who needs to tell an overflow from a nonsense arithmetic result already has
 * `Number.isNaN`, and splitting here would publish a distinction this contract does not use.
 *
 * `places-not-whole` and `places-negative` are two literals for one parameter, and they earn the
 * split on the caller's side rather than on the implementer's. A non-whole place count - 1.5, NaN,
 * Infinity - is a bug in the calling code, and the repair is upstream. A negative one is a caller
 * asking for something real that this contract declines to do: rounding to tens or hundreds is
 * magnitude rounding, `inputDomain` refuses it in as many words, and the repair is to divide, round
 * and multiply, or to reach for another tool. Two different messages, two different repairs.
 *
 * There is no `places-out-of-range`. `toFixed` throws a RangeError above 100 places and this
 * contract does not, because a place count larger than the value carries decimals is not an error -
 * it is a request that changes nothing, and `round(1.5, 1e21)` answers 1.5. Measured rather than
 * assumed: the implementation reads the shortest decimal of the value, so a place count past its
 * length has nothing to drop.
 */
export const failureReasons = ['value-not-finite', 'places-not-whole', 'places-negative'] as const

export type RoundFailureReason = (typeof failureReasons)[number]

/**
 * The diagnostic surface. `round` keeps answering `number | null`, and a caller who needs to know
 * why asks.
 *
 * The reason is published beside the return channel rather than inside it because that form is
 * additive; the catalogue settled this on two contracts before this one existed, and the argument is
 * in `number/parse@1`'s own block 4.2 rather than restated here.
 *
 * This contract is where that convention earns something the other two did not need. `round` and
 * `describeRoundFailure` take the same two arguments, so an implementation that validates in one and
 * not the other has nowhere to hide: the coupling property below asks both of every call it draws.
 */
export type DescribeRoundFailure = (value: number, places: number) => RoundFailureReason | null

/**
 * The coupling between the two exports, stated here because it is a promise of the contract rather
 * than a detail of one implementation: a call is refused exactly when it has a description.
 *
 * The reference cannot violate it - both exports consult one private check - and that is not a
 * reason to drop the property. The contract governs every implementation, including one that
 * validates `places` on the fast path and forgets to on the diagnostic one.
 */
export const couplingRule =
  'round(v, p) === null if and only if describeRoundFailure(v, p) !== null, for every v and p'

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Object.is` is required rather than `===` because the contract preserves the sign of zero:
 * `round(-0.001, 2)` answers `-0`, and `-0 === 0` is true, so `===` would silently accept an
 * implementation that normalises the sign away. That is the same decision `number/parse@1` took for
 * the same reason, and it matters more here: a ledger line that reads `0.00` where the amount was a
 * refund has lost the only mark saying which way the money went.
 *
 * `Object.is` also treats NaN as equal to NaN, which costs nothing: property `p1-finite-or-absent`
 * forbids NaN from ever being answered.
 */
export const outputsAreEqual = (a: number | null, b: number | null): boolean => Object.is(a, b)

// ---------------------------------------------------------------------------
// Where this contract parts from the language
// ---------------------------------------------------------------------------

/**
 * The population `wrongOnTheSweep` below is counted over: every value `k / 1000` for `k` from 1 to
 * `thousandths`, rounded to `places` decimal places.
 *
 * It is a *total* over a declared population rather than a sample, so the figures below are
 * reproducible by anybody with this checkout and do not carry a seed. Thousandths because that is
 * what a third decimal is - a half-cent on a price, a rate applied to an amount, a unit price
 * multiplied by a quantity - and it is the shape in which the traps are met.
 */
export const THE_SWEEP = { thousandths: 1_000_000, places: 2 } as const

export type LanguageTrap = {
  /** A frozen identifier, so that a guard of `language.test.ts` is addressed rather than described. */
  readonly name: string
  /** The expression a caller writes, in source. */
  readonly spelling: string
  /** What it gets wrong. One sentence, because a reader is deciding whether they are affected. */
  readonly statement: string
  /** Calls where this spelling and this contract part. `language.test.ts` replays each one. */
  readonly partsFrom: readonly Call[]
  /**
   * How many values of `THE_SWEEP` this spelling answers differently from this contract.
   *
   * A claim and never a transcription: `language.test.ts` recomputes it over the whole population
   * and fails on any disagreement, so the figure moves the day a runtime changes its mind.
   */
  readonly wrongOnTheSweep: number
}

/**
 * The three spellings a caller reaches for, and what each one does with them.
 *
 * They are three and not one because they fail in three different ways, and a reader who has only
 * been told about the first will reach for the second. The first two answer a wrong *number*, with
 * nothing announcing it. The third answers the right number for every value below a thousand and
 * `NaN` from there up, which is the shape of a defect that survives every test somebody wrote with
 * small amounts and arrives in production on a real invoice.
 *
 * `Intl.NumberFormat` with `roundingMode: 'halfExpand'` is deliberately not among them, and that is
 * the honest half of this block: measured over 300 000 random calls, it agrees with this contract on
 * every one, sign of zero included. The language *can* round a decimal correctly. What it cannot do
 * is hand the answer back as a number, and the third trap is what happens to a caller who tries.
 *
 * The correct spelling carries a second cost that is invisible until somebody profiles it, and it is
 * recorded here because a reader weighing the three needs it: `Number.prototype.toLocaleString`
 * constructs a `NumberFormat` on every call. Measured over the sweep, the same million answers cost
 * 18 278 ms written as `value.toLocaleString(...)` and 583 ms with one formatter hoisted out of the
 * loop - the same verdict on all six, thirty-one times the price.
 */
export const theTraps: readonly LanguageTrap[] = [
  {
    name: 'the-stored-double-and-not-the-written-decimal',
    spelling: 'Number(value.toFixed(places))',
    statement:
      'Rounds the double the machine stored rather than the decimal the caller wrote, so a value ' +
      'that sits a hair below its own half-cent rounds down.',
    partsFrom: [
      { value: 1.005, places: 2 },
      { value: 0.015, places: 2 },
      { value: 2.675, places: 2 },
      { value: 8.575, places: 2 },
      { value: 162.295, places: 2 },
    ],
    wrongOnTheSweep: 48_000,
  },
  {
    name: 'the-error-moved-and-not-removed',
    spelling: 'Math.round(value * 10 ** places) / 10 ** places',
    statement:
      'Multiplying by a power of ten introduces an error of its own, so the tie the caller wrote ' +
      'is not the tie `Math.round` is shown - and `Math.round` breaks a tie towards positive ' +
      'infinity, which rounds a refund the opposite way from the charge it reverses.',
    partsFrom: [
      { value: 0.145, places: 2 },
      { value: 1.005, places: 2 },
      { value: -0.5, places: 0 },
      { value: -1.5, places: 0 },
      { value: -2.5, places: 0 },
    ],
    wrongOnTheSweep: 4_588,
  },
  {
    name: 'the-right-answer-as-text',
    spelling: 'Number(value.toLocaleString(locale, { maximumFractionDigits: places }))',
    statement:
      'Rounds correctly and answers text, so reading it back as a number meets the grouping ' +
      'separator: every amount below a thousand survives and every amount above it is NaN.',
    partsFrom: [
      { value: 999.995, places: 2 },
      { value: 1000.005, places: 2 },
      { value: 1234.567, places: 2 },
    ],
    wrongOnTheSweep: 6,
  },
]

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at all
 * is the catalogue's rule; the figure is this contract's, and comes from measurement rather than
 * taste.
 *
 * Three runs of this file at each of 100, 1000 and 10000 draws cost 11-11 ms, 34-43 ms and
 * 184-185 ms of test time respectively, so an order of magnitude over fast-check's default of 100 is
 * bought for about 24 ms and the next order costs six times that. The arbitraries below already
 * concentrate on the boundary this contract lives at - the half-cent, which `aThousandth` reaches on
 * one draw in ten - so the extra order re-draws a region the generator was built to hit rather than
 * reaching a new one.
 */
export const propertyRuns = 1000

/** How this contract answers the four universal properties of the catalogue. */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: false,
    reason:
      'The signature takes two `number` arguments, primitives immutable by construction in ' +
      'JavaScript. No implementation, correct or broken, can violate this, so a test asserting it ' +
      'would be structurally incapable of failing.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by an implementation that hoists the carry out of the ' +
      'increment loop - the shape a variable reaches when it is made "reusable" - so that a carry ' +
      'left by an earlier call decides this one and two identical consecutive calls answer ' +
      'differently. Two caches keyed on one of the two arguments were measured as candidates and ' +
      'both were rejected: the probe primes them itself, so the pair of calls agrees and the ' +
      'defect surfaces on the specific properties instead. A third was rejected for a reason worth ' +
      'carrying past this contract - an accumulator that appends rather than replaces drives the ' +
      'digit string past what a double holds, both calls answer Infinity, and `outputsAreEqual` is ' +
      '`Object.is`, which judges two infinities equal. On a numeric contract an overflow can ' +
      `absorb a determinism signal. ${DETERMINISM_ORDERING_FINDING}`,
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: this contract reads two numbers and answers a third, so the call ' +
      'history is the only ambient input it can plausibly acquire. Witnessed by an implementation ' +
      'holding the last call answered and serving it whenever the value matches, which answers the ' +
      'previous place count - the shape a caller rounding one amount to two places and then to ' +
      'none would meet. The property interleaves a probe with an arbitrary history and requires ' +
      'the probe to answer identically either way. Measured: a memo keyed on the value alone stays ' +
      'invisible to it, because the probe primes the memo before the history runs, which is the ' +
      'same limit `number/parse@1` records of its own caches.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason: NO_AMBIENT_OUTPUT_FINDING,
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * Every profile declares the class its samples belong to, because without it a profile can measure
 * something other than what it names and nothing says so.
 *
 * The four classes are this contract's own. `already-exact` and `shortened` divide the answering
 * path in the place it actually divides: an implementation reading the shortest decimal returns the
 * value untouched when it has nothing to drop, and that early answer is most of the calls a real
 * caller makes. `at-a-tie` is the region the whole contract exists for, and the region every
 * spelling in `theTraps` fails in. `refused` is a different path and is timed apart.
 */
export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must do. A profile mixing classes measures neither. */
  readonly roundingClass: 'already-exact' | 'at-a-tie' | 'shortened' | 'refused'
  readonly samples: readonly Call[]
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'money-to-the-cent',
    description:
      'Amounts with a third decimal rounded to two places, the dominant shape in pricing, tax and ' +
      'invoicing code.',
    roundingClass: 'shortened',
    samples: [
      { value: 19.994, places: 2 },
      { value: 1234.561, places: 2 },
      { value: -75.128, places: 2 },
      { value: 0.333, places: 2 },
      { value: 99999.999, places: 2 },
    ],
  },
  {
    name: 'half-cents',
    description:
      'Values sitting exactly on the half-cent, where the rounding rule is the whole answer and ' +
      'every built-in spelling parts from this contract.',
    roundingClass: 'at-a-tie',
    samples: [
      { value: 1.005, places: 2 },
      { value: 0.015, places: 2 },
      { value: 2.675, places: 2 },
      { value: -8.575, places: 2 },
      { value: 162.295, places: 2 },
    ],
  },
  {
    name: 'nothing-to-drop',
    description:
      'Values already carrying no more decimals than the caller asked for. Timed apart because an ' +
      'implementation reading the shortest decimal answers these without rounding anything, and a ' +
      'caller normalising a column of amounts hits this path on most rows.',
    roundingClass: 'already-exact',
    samples: [
      { value: 42, places: 2 },
      { value: 19.99, places: 2 },
      { value: -0.5, places: 4 },
      { value: 1e21, places: 2 },
      { value: 1.7976931348623157e308, places: 2 },
      { value: 0, places: 0 },
    ],
  },
  {
    name: 'seventeen-significant-digits',
    description:
      'Values whose shortest decimal is as long as a double gets, to expose an implementation ' +
      'whose cost grows with the digit string rather than with the places asked for. The last one ' +
      'carries every digit through the increment, since rounding it grows the string.',
    roundingClass: 'shortened',
    samples: [
      { value: 0.1 + 0.2, places: 2 },
      { value: 1.2345678901234567, places: 2 },
      { value: 1.2345678901234567, places: 15 },
      { value: 0.9999999999999999, places: 15 },
    ],
  },
  {
    name: 'refused-calls',
    description:
      'Calls that must answer null. Measured separately because an implementation may take a very ' +
      'different path when it refuses, and a caller validating user input hits that path most.',
    roundingClass: 'refused',
    samples: [
      { value: NaN, places: 2 },
      { value: Infinity, places: 2 },
      { value: -Infinity, places: 0 },
      { value: 1.5, places: 1.5 },
      { value: 1.5, places: -1 },
    ],
  },
]
