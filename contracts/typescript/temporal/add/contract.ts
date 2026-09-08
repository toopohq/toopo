/**
 * Contract `temporal/add@1`. The anatomy of a contract folder is the catalogue's and is described in
 * `packages/catalogue/every-contract.js`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * ADR-0216 is the admission — the trap, measured against the ecosystem at ADR-0217 — ADR-0223 and
 * ADR-0225 settle which carriers the question can be asked of, and ADR-0236 settles why a carrier is
 * named rather than parsed out of a string.
 *
 * Failure is reported as `null`, with the reason published beside the return channel rather than
 * inside it — the catalogue-wide convention, settled on `number/parse@1` and `date/add@1`.
 *
 * ---------------------------------------------------------------------------
 * Nothing in this repository runs this file, and that is declared rather than hidden
 * ---------------------------------------------------------------------------
 *
 * `Temporal` reached stage 4 in March 2026 and Node 26 ships it unflagged; the two legs of this
 * repository's matrix are 22.18.0 and 24, and neither carries it. So this contract's folder is
 * excluded from the contracts' own suite and from the typechecker's project, and `contract.ts`
 * declares `requiresOfTheRuntime` so that a client refuses to install it on a runtime that cannot
 * run it. Every figure below that would ordinarily be measured says whether it was.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../../packages/catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'temporal/add',
  major: 1,
  exportName: 'add',

  summary:
    'Add a duration to a Temporal carrier, refusing a unit the carrier does not apply rather than ' +
    'dropping it in silence, or null when the call cannot be answered.',

  /** Written to answer the natural search query "temporal add duration ignored javascript". */
  description:
    'Adds a duration bag to a zone-free Temporal carrier and refuses any unit that carrier does ' +
    'not apply. Temporal answers this question three different ways, and only one of them is loud: ' +
    'Temporal.PlainTime.from("12:00").add({days: 1}) answers 12:00:00, having dropped the day ' +
    'without a word; Temporal.PlainYearMonth.from("2026-01").add({days: 1}) throws Can only add ' +
    'years or months; and a Temporal.Duration refuses depending on itself, so P1D plus a nanosecond ' +
    'answers P1DT0.000000001S while P1Y plus the same nanosecond throws. A caller who writes one ' +
    'helper over more than one carrier therefore gets a silent loss on one and an exception on ' +
    'another, for the same mistake. This contract answers the carrier it was given, refuses the ' +
    'unit the carrier will not apply, and tells the caller which unit it was.',

  /**
   * The input domain the contract is written for. It belongs to the identity because block 4.4 is
   * only defensible relative to it: *inapplicable* is a property of a carrier and a unit, and the
   * carriers this contract spans are exactly those of which the question can be asked at all.
   */
  inputDomain:
    'The three zone-free Temporal carriers of which the question can be asked - PlainTime, ' +
    'PlainYearMonth and Duration - and a duration expressed as a plain object of unit counts. It is ' +
    'not a calendar arithmetic library, not a formatter, and not a replacement for Temporal: it is ' +
    'one operation made uniform across the carriers Temporal is heterogeneous about. PlainDate, ' +
    'PlainDateTime and ZonedDateTime are outside it because every duration unit applies to them, so ' +
    'there is no unit to refuse and no question to ask. Instant is outside it because the answer ' +
    'there depends on a zone, which is a different contract.',

  /**
   * Required here rather than optional: `contractAnatomy` asks a contract that answers differently
   * from the language to say so, and every row of block 4.4 on `PlainTime` is a parting.
   */
  relationToTheLanguage:
    'The language ships `add` on each carrier and answers a unit the carrier does not apply in ' +
    'three different ways: `PlainTime` drops it in silence, `PlainYearMonth` throws, and a ' +
    '`Duration` throws or applies depending on its own largest unit. This contract refuses in all ' +
    'three, so one caller reading one answer is enough.',

  searchAliases: [
    'temporal add duration',
    'add duration to plaintime',
    'plaintime add days ignored',
    'temporal plainyearmonth add days',
    'temporal duration add throws',
    'add duration javascript',
    'temporal arithmetic',
    'duration bag',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The ten duration units, written out because the case table quantifies over them and because
 * `Temporal.DurationLike` declares every one optional by design — ADR-0216 measured that a
 * type-level repair is unavailable, so the vocabulary is a value here rather than a type nobody can
 * narrow.
 */
export const durationUnits = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds',
] as const

export type DurationUnit = (typeof durationUnits)[number]

/**
 * A duration as a caller writes one: unit counts, every field optional.
 *
 * Deliberately not `Temporal.DurationLike`. That type admits every unit on every carrier, which is
 * the whole reason this contract exists — the compiler cannot say that a `PlainTime` has no day, so
 * the refusal has to be a value and not a type.
 */
export type DurationBag = { readonly [U in DurationUnit]?: number }

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 *
 * **The type parameter is bound to the three carriers and that bound is load-bearing outside this
 * file.** `packages/site/playground.ts` builds a form field per parameter, keys it on the parameter's
 * declared type — which is the bare name `T` — and refuses to build the page unless this signature's
 * own type-parameter list binds `T` to `PlainTime`, `PlainYearMonth` and `Duration`. A type parameter
 * is a name rather than a type, so the table cannot tell one contract's `T` from another's; the bound
 * is what says which is meant. ADR-0239.
 *
 * The return is `T | null` rather than `Carrier | null`, so a caller who passes a `PlainTime` is
 * handed a `PlainTime` and not a union they have to narrow.
 */
export type Add = <T extends Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration>(
  carrier: T,
  duration: DurationBag,
) => T | null

/**
 * Why a call cannot be answered. Declared as a list rather than only as a type, so that the partition
 * is a value the contract can check itself against: `edge-cases.test.ts` requires the reasons the
 * table actually produces to be exactly these four.
 *
 * **The order of this list is the precedence, and it is a promise rather than a detail of one
 * implementation.** A bag can trip two of these at once — `{days: 1, seconds: -1}` on a `PlainTime`
 * names a unit that carrier will not apply *and* carries two signs — so with no declared order two
 * conforming implementations would name different reasons for one call. It is the same promise
 * `describeAddFailure` already makes about *which* unit it names, one literal up. **The order is
 * derived rather than chosen**: a refusal that reads the bag alone is decided before one that reads
 * the carrier, because a bag that names no duration names none for any carrier; and the one that
 * needs the arithmetic to have been attempted is last.
 *
 * The partition is frozen with the major, so each literal is argued rather than listed.
 *
 * `duration-not-read` is one literal for a bag this contract cannot read as a duration at all — a
 * value that is not an object, an object naming no unit of the ten, or one carrying a key that is
 * not among them. **All three arms are about the bag's keys**, which is why it is first: whether the
 * counts can be read at all is settled before any count is read. ADR-0216 measured the shape the
 * third arm exists for: Temporal silently ignores an unknown field whenever one field it knows is
 * present, so `{days: 1, dayz: 9}` is answered as though the second had not been written —
 * `date/add@1`'s own frozen phrase, *a plausible value that silently drops what the caller asked
 * for*, met a second time on a second surface.
 *
 * `counts-of-two-signs` is a bag whose keys are all units and whose non-zero counts are not all of
 * one sign. **No duration has two signs**, which is the specification rather than an engine's
 * behaviour: `Temporal.Duration` requires every non-zero field to carry the sign of the whole, so
 * such a bag names no duration for any carrier to apply. A zero count is exempt because it carries
 * no sign — `{hours: 0, seconds: -1}` is `-PT1S`. It is separate from the literal above because that
 * one's three arms are all about keys and this bag's keys are impeccable, and the repair a caller
 * makes is different again: fix a key there, pick a sign here. **It names no unit**, because two
 * units are at fault and the field holds one.
 *
 * **It is the one reason of the four where the language is not heterogeneous**, and that is what
 * makes it worth publishing rather than folding into the literal below. Read on Chrome 152: all
 * three carriers and both `Duration` modes refuse a mixed-sign bag with one message —
 * `RangeError: Temporal error: Duration was not valid.` — and `Temporal.Duration.from` refuses it
 * identically, so the refusal is the bag's construction and not the addition.
 *
 * **The class is the range, the message is not, and the reference reads neither — which is why the
 * repair had to be the order.** `RangeError` is what a mixed-sign bag throws and what an overflow
 * throws, so no reading of the *class* separates them. The message does separate them and says the
 * right thing, and it differs between the two engines: the draft answers `RangeError: Invalid time
 * value`. What the reference inherited was therefore neither — its `catch` takes no binding at all —
 * but an **assumption about the language's refusals**: that once the keys are units and the carrier
 * applies every one of them, the range is the only thing left to throw for. That held while the
 * reason set was three and stopped holding the moment a refusal survived past the carrier check.
 * ADR-0253, ADR-0255, ADR-0256.
 *
 * `unit-the-carrier-does-not-apply` is the contract's subject and carries the unit's name in the
 * diagnostic, because a caller who wrote a bag of six units needs to know which one was refused.
 *
 * `out-of-range` is the last, and it is the distinction this contract exists to keep sharp. **An
 * overflow is not an inapplicability.** ADR-0225 measured seven bags of five hundred and twenty that
 * do not apply for the range rather than for the unit, and named the distinction; a reading that
 * confuses them classes a carrier as refusing a unit it applies perfectly well at every reachable
 * magnitude. Publishing it as its own reason is what stops a caller — and a later measurement —
 * making that mistake.
 */
export const failureReasons = [
  'duration-not-read',
  'counts-of-two-signs',
  'unit-the-carrier-does-not-apply',
  'out-of-range',
] as const

export type AddFailureReason = (typeof failureReasons)[number]

/**
 * The diagnostic surface. `add` keeps answering `T | null`, and a caller who needs to know why asks.
 *
 * It answers the reason and the unit, because on this contract the reason alone is not actionable: a
 * bag of six units refused for one of them is repaired by removing that one, and a diagnostic that
 * says only *a unit the carrier does not apply* leaves the caller to find out which.
 */
export type AddFailure = {
  readonly reason: AddFailureReason
  /** Which unit was refused, or `null` where the reason is not about one. */
  readonly unit: DurationUnit | null
}

export type DescribeAddFailure = (
  carrier: Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration,
  duration: DurationBag,
) => AddFailure | null

/**
 * The coupling between the two exports, stated here because it is a promise of the contract rather
 * than a detail of one implementation: a call is refused exactly when it has a description.
 */
export const couplingRule =
  'add(c, d) === null if and only if describeAddFailure(c, d) !== null, for every c and d'

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * What this contract needs of the runtime it is run on. ADR-0249.
 *
 * **Here from this file's first version, because it can never arrive later.** `contractSnapshot`
 * freezes it, so a contract published without it can never receive it — and a reader installing this
 * one on a runtime without Temporal would get a file that does not compile and throws when called.
 * The registry refuses a capability outside its closed vocabulary; the client reads this off the
 * index and refuses the install before it writes anything.
 */
export const requiresOfTheRuntime = ['temporal'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * **The ISO rendering and not `Temporal.Duration.compare`.** That comparison calls `P1D` and `PT24H`
 * equal, and they are the same length of time; they are not the same answer. This contract hands
 * back a carrier, and a caller who added an hour to `P1D` and received `PT25H` has been given
 * something they did not ask for. Comparing renderings is what makes an implementation that
 * re-balances silently fail here rather than pass.
 *
 * It is the same decision `number/round@1` took about the sign of zero, one type over: the cheaper
 * comparison is the one that cannot see the defect the contract is about.
 */
export const outputsAreEqual = (
  a: { readonly toString: () => string } | null,
  b: { readonly toString: () => string } | null,
): boolean => (a === null || b === null ? a === b : a.toString() === b.toString())

// ---------------------------------------------------------------------------
// Where this contract parts from the language
// ---------------------------------------------------------------------------

/**
 * The three answers Temporal gives to one question, and where each parts from this contract.
 *
 * They are three and not one because a caller who has learned the first will be surprised by the
 * second. `partsFrom` names calls this contract refuses and the language does not, or refuses for a
 * reason the caller cannot act on.
 *
 * **Every reading below is Chrome 152's**, which is the published language; the draft `Temporal`
 * behind `--harmony-temporal` on V8 13.6 disagrees on `PlainYearMonth` and is not a source for
 * anything here.
 */
export type LanguageDivergence = {
  /** A frozen identifier, so that a guard of a divergence replay is addressed rather than described. */
  readonly name: string
  /** The carrier this answer belongs to. */
  readonly carrier: 'PlainTime' | 'PlainYearMonth' | 'Duration'
  /** What the language does. One sentence, because a reader is deciding whether they are affected. */
  readonly statement: string
  /** Units on which the language and this contract part. */
  readonly partsOn: readonly DurationUnit[]
}

export const theDivergences: readonly LanguageDivergence[] = [
  {
    name: 'a-time-drops-a-date-unit-without-a-word',
    carrier: 'PlainTime',
    statement:
      'Applies the six time units and drops the four date units in silence, so a bag carrying a ' +
      'day is answered as though the day had not been written.',
    partsOn: ['years', 'months', 'weeks', 'days'],
  },
  {
    name: 'a-year-month-refuses-eight-and-says-only-two-are-allowed',
    carrier: 'PlainYearMonth',
    statement:
      'Throws for the eight units that are neither years nor months, with a message naming what is ' +
      'allowed rather than what was refused - so a caller with a bag of six units is not told which ' +
      'of them was the problem.',
    partsOn: ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds', 'microseconds', 'nanoseconds'],
  },
  {
    name: 'a-duration-refuses-by-its-own-largest-unit',
    carrier: 'Duration',
    statement:
      'Refuses a unit depending on the receiver rather than on the unit: a duration whose largest ' +
      'non-zero unit is a calendar unit refuses all ten, and one whose largest is days or smaller ' +
      'refuses three - so the same call succeeds or throws according to a property of the value.',
    partsOn: ['years', 'months', 'weeks'],
  },
]

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on.
 *
 * **It is not measured, and that is stated rather than smoothed.** The catalogue's other contracts
 * choose this figure by timing three runs at 100, 1 000 and 10 000 draws; no runtime in this
 * repository carries `Temporal`, so that reading cannot be taken here and no figure is claimed for
 * it. What stands instead is `number/round@1`'s measured 1 000, adopted because the population this
 * contract draws from is small and enumerable - three carriers, ten units, and a handful of
 * magnitudes each - so a draw count an order above fast-check's default already re-draws the region
 * the arbitraries were built to hit. The measurement is owed the day a leg carries the runtime.
 */
export const propertyRuns = 1000

/** How this contract answers the four universal properties of the catalogue. */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: true,
    reason:
      'Violable in practice, and on the second argument rather than the first. A Temporal carrier ' +
      'is immutable by construction, so no implementation can mutate it - but the duration is a ' +
      'plain object the caller still holds, and an implementation that normalises the bag in place ' +
      'before reading it, or deletes the unit it refuses so that a retry "works", changes a value ' +
      'its caller is going to read again. That is the shape a helper reaches when somebody makes it ' +
      'idempotent, and it is invisible to every other property here.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by an implementation that caches the inapplicable set of ' +
      'the last carrier it saw and reuses it whenever the next carrier is of the same type - which ' +
      'is right for `PlainTime` and `PlainYearMonth` and wrong for `Duration`, whose inapplicable ' +
      'set depends on its own largest unit. Two identical consecutive calls agree; a `P1D` after a ' +
      `\`P1Y\` does not. ${DETERMINISM_ORDERING_FINDING}`,
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: this contract reads a carrier and a bag and answers a carrier, so the ' +
      'call history is the only ambient input it can plausibly acquire. It is the same cache as ' +
      'above read from the other side - the property interleaves a probe with an arbitrary history ' +
      'and requires the probe to answer identically either way, which a per-type inapplicable set ' +
      'fails on `Duration` and passes on the other two.',
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
 * something other than what it names and nothing says so - and because two profiles a guard cannot
 * tell apart are two profiles this catalogue may not publish. ADR-0171.
 *
 * The four classes divide the answering path where it actually divides: a call every unit of which
 * applies, a call refused for a unit, a call refused before any unit is read, and the receiver whose
 * inapplicable set depends on itself.
 */
export type BenchmarkSample = {
  readonly carrier: 'PlainTime' | 'PlainYearMonth' | 'Duration'
  /** The carrier's ISO rendering, so a sample is data rather than a constructed value. */
  readonly from: string
  readonly duration: DurationBag
}

export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must do. A profile mixing classes measures neither. */
  readonly addClass: 'all-applied' | 'refused-by-the-carrier' | 'refused-before-a-unit' | 'receiver-decides'
  readonly samples: readonly BenchmarkSample[]
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'every-unit-applies',
    description:
      'Bags each of whose units the carrier applies, which is the path a caller doing ordinary ' +
      'arithmetic takes on every call.',
    addClass: 'all-applied',
    samples: [
      { carrier: 'PlainTime', from: '12:30:00', duration: { hours: 1, minutes: 30 } },
      { carrier: 'PlainYearMonth', from: '2026-01', duration: { years: 1, months: 2 } },
      { carrier: 'Duration', from: 'P1D', duration: { hours: 6, seconds: 30 } },
      { carrier: 'PlainTime', from: '23:59:59.999999999', duration: { nanoseconds: 1 } },
    ],
  },
  {
    name: 'refused-for-one-unit-of-many',
    description:
      'Bags whose units the carrier mostly applies and one it does not. Timed apart because an ' +
      'implementation that checks the whole bag before applying any of it does different work from ' +
      'one that applies until it meets the refusal.',
    addClass: 'refused-by-the-carrier',
    samples: [
      { carrier: 'PlainTime', from: '12:30:00', duration: { hours: 1, minutes: 30, days: 1 } },
      { carrier: 'PlainYearMonth', from: '2026-01', duration: { years: 1, months: 2, days: 1 } },
      { carrier: 'Duration', from: 'P1D', duration: { hours: 6, weeks: 1 } },
    ],
  },
  {
    name: 'not-a-duration-at-all',
    description:
      'Bags naming no unit of the ten, refused before any carrier is consulted. A caller validating ' +
      'input hits this path most. It is not the only refusal that is decided before the carrier - a ' +
      'bag of two signs is the other - and that one is deliberately not sampled here rather than ' +
      'folded in, because this path stops at the keys where that one reads every count, and a ' +
      'profile holding both would measure neither.',
    addClass: 'refused-before-a-unit',
    samples: [
      { carrier: 'PlainTime', from: '12:30:00', duration: {} },
      { carrier: 'PlainYearMonth', from: '2026-01', duration: {} },
      { carrier: 'Duration', from: 'P1D', duration: {} },
    ],
  },
  {
    name: 'the-receiver-that-decides',
    description:
      'The same bag against both modes of a Duration, which is the one receiver whose inapplicable ' +
      'set is a function of its own value. An implementation caching that set per type is fast here ' +
      'and wrong here, which is what makes this profile worth timing on its own.',
    addClass: 'receiver-decides',
    samples: [
      { carrier: 'Duration', from: 'P1D', duration: { nanoseconds: 1 } },
      { carrier: 'Duration', from: 'P1Y', duration: { nanoseconds: 1 } },
      { carrier: 'Duration', from: 'P1M', duration: { days: 1 } },
      { carrier: 'Duration', from: 'PT1H', duration: { days: 1 } },
    ],
  },
]
