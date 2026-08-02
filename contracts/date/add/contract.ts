/**
 * Contract `date/add@1`. The anatomy of a contract folder is the catalogue's and is described in
 * `catalogue/every-contract.ts`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * Failure is reported as `null`, with the reason published beside the return channel rather than
 * inside it - the catalogue-wide convention, settled after three forms were built and measured on
 * this contract and on `number/parse@1`.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'date/add',
  major: 1,
  exportName: 'addToDate',

  summary:
    'Add a duration to a Date and get a new Date back, in UTC, without mutating the input, or null ' +
    'when the call cannot be answered exactly - with a named reason available beside it for a ' +
    'caller who needs to know which refusal it was.',

  /** Written to answer the natural search query "add days to date javascript". */
  description:
    'Adds a duration to a Date in JavaScript and TypeScript and returns a new Date, without ' +
    'mutating the one it was given and without reading the machine time zone. The built-in way to ' +
    'do this mutates: `d.setDate(d.getDate() + 7)` changes the caller\'s object in place, and it ' +
    'reads the calendar of whichever time zone the process happens to run in, so the same code ' +
    'answers differently on a laptop in Paris and a server in UTC. It also has no notion of a month ' +
    'that is too short - setUTCMonth on 31 January lands on 2 or 3 March rather than the end of ' +
    'February. This contract computes in absolute UTC time, clamps a day that does not exist in the ' +
    'target month down to the last day that does, applies calendar units before elapsed time, and ' +
    'returns null rather than an Invalid Date when the input is not a date, when the duration ' +
    'carries a field this contract does not declare, when the duration is not made of exact whole ' +
    'units, or when the result falls outside the range a Date can hold. It never returns an ' +
    'Invalid Date, the value that propagates as NaN through every later computation and surfaces ' +
    'far away from the call that produced it. Which of those refusals happened is published by a ' +
    'second export rather than folded into the return value, so a caller who only needs a date is ' +
    'not made to unwrap one.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: the same call has a different right answer under
   * zone-aware arithmetic, which is a different contract.
   */
  inputDomain:
    'Absolute instants, shifted by durations written in whole units: an expiry, a reminder, a ' +
    'retention window, a report period, a timestamp read from a database or an API. The arithmetic ' +
    'is UTC throughout, so no daylight-saving transition is ever crossed, skipped or repeated, and ' +
    'one day is always exactly 24 hours. That exclusion is deliberate rather than an oversight: ' +
    'reading the wall clock of a particular place, where a civil day can last 23 or 25 hours, ' +
    'requires knowing which place, and a function that silently borrows the process time zone is ' +
    'impure and answers differently on two machines running the same code. Calendar arithmetic in a ' +
    'named zone is a separate, later contract that will take the zone as a parameter. This one is ' +
    'not a parser, not a formatter, and not a difference-between-two-dates function.',

  searchAliases: [
    'add days to date',
    'addDays',
    'add months to date',
    'addMonths',
    'addYears',
    'add hours',
    'subtract days from date',
    'subDays',
    'date arithmetic',
    'date plus duration',
    'shift date',
    'offset date',
    'date add duration',
    'increment date',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * A duration written in whole units. Every field is optional; an absent field and a field set to
 * `undefined` both mean zero, because `{ days: maybeDays }` is how callers actually write this.
 *
 * There is no field for a unit smaller than a millisecond, since `Date` cannot represent one, and
 * none larger than a year.
 */
export type Duration = {
  readonly years?: number | undefined
  readonly months?: number | undefined
  readonly weeks?: number | undefined
  readonly days?: number | undefined
  readonly hours?: number | undefined
  readonly minutes?: number | undefined
  readonly seconds?: number | undefined
  readonly milliseconds?: number | undefined
}

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 */
export type AddToDate = (date: Date, duration: Duration) => Date | null

/**
 * Why a call could not be answered. Declared as a list rather than only as a type, so that the
 * partition is a value the contract can check itself against: `edge-cases.test.ts` requires the
 * reasons the tables actually produce to be exactly these five, which is what stops a literal
 * nobody names any more from surviving as documentation.
 *
 * The literals belong to this contract and to no other. There is no shared failure type in the
 * catalogue, so a reason means exactly what this contract says it means and nothing has to be kept
 * compatible across features.
 *
 * The partition is frozen with the major, so it was chosen against a test rather than by taxonomy:
 * two motives share a literal only when one message covers both without lying AND no caller acts
 * differently on them.
 *
 * `invalid-date` and `unknown-field` are the pair that decided the shape of the diagnostic. One is a
 * caller who never parsed what it was given; the other is a caller who wrote `{ day: 1 }` for
 * `{ days: 1 }`. They are corrected by different edits in different files, and under `null` alone
 * they arrive as the same value.
 *
 * `total-not-exact` covers both totals this contract computes - the month total and the elapsed
 * total. They were two literals while the reference had two guards, and that was the wrong reason to
 * have two: "a total this contract must compute is not exactly representable" is true of both, and a
 * caller repairs both the same way, by looking at the duration it wrote and making it smaller.
 *
 * `field-not-whole` is not split into a separate reason for a field carrying the wrong type. It
 * would have been the same message: a string is not a whole number either, so `{ days: '1' }` and
 * `{ days: 0.5 }` can be told the same true sentence.
 */
export const failureReasons = [
  'invalid-date',
  'unknown-field',
  'field-not-whole',
  'total-not-exact',
  'out-of-range',
] as const

export type AddFailureReason = (typeof failureReasons)[number]

/**
 * The diagnostic surface. `addToDate` keeps answering `Date | null`, and a caller who needs to know
 * why asks.
 *
 * The reason is published beside the return channel rather than inside it because that form is
 * additive: a contract can ship `name@1` with no diagnostic and gain one later without breaking
 * anyone, where putting the reason in the return type freezes it into the major on day one. On
 * detection the two forms that carry a reason were measured to tie, so the error convention is not a
 * verification question.
 *
 * This contract is where that tie is strongest, and saying so is the point of saying it here. It was
 * measured over the whole battery of that round - every mutant, under both lenses - where
 * `number/parse@1` could only measure it on four cells, the three reason defects and the coupling
 * probe under one lens. An earlier revision of this comment said "measured to tie exactly" in both
 * contracts, in the same words, which lent this contract's evidence to the other one.
 *
 * The measurement is replayable rather than asserted: the batteries it comes from are at the
 * annotated tags `evidence/error-convention-round-2` and `evidence/error-convention-round-3`.
 *
 * The cost is one extra traversal, on the failing path and only there. On this contract that
 * traversal is arithmetic rather than a regular expression, which is why the reference computes it
 * once and derives both exports from it.
 */
export type DescribeAddFailure = (date: Date, duration: Duration) => AddFailureReason | null

/**
 * The coupling between the two exports, stated here because it is a promise of the contract rather
 * than a detail of one implementation: a call fails exactly when it has a description.
 *
 * The reference cannot violate it - both exports derive from one private analysis, so there is one
 * traversal of the arithmetic in the module and no way for the two to drift. That is not a reason to
 * drop the property. The contract governs every implementation, not this one, and an implementation
 * that writes the two independently - the obvious thing to do when the answering path is optimised
 * and the diagnostic one is not - can absolutely diverge.
 */
export const couplingRule =
  'addToDate(d, u) === null if and only if describeAddFailure(d, u) !== null, for every date d ' +
  'and duration u'

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * The canonical field list, in the order block 4.3 applies them. Declared once because three
 * different things need to agree on it: the type above, the application order below, and the check
 * that no field was added to one without the other.
 */
export const durationFields = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Date` is an object, so `===` compares identity: two distinct objects holding the same instant are
 * not `===`, and an implementation returning the caller's own object would compare equal to the
 * right answer. This contract therefore needs two notions where `number/parse` needed one.
 * `outputsAreEqual` is the claim that two results mean the same instant; the non-mutation property
 * in block 4.3 is the separate claim that the result is *not* the same object as the input. Neither
 * implies the other, and an implementation that mutates and returns its argument satisfies the first
 * while failing the second.
 *
 * `Object.is` on the timestamp rather than `===` keeps the comparison total: an Invalid Date has a
 * NaN timestamp and `NaN === NaN` is false, which would make a broken result incomparable rather
 * than unequal. Property P1 forbids returning one at all, so this costs nothing and removes a hole.
 */
export const outputsAreEqual = (a: Date | null, b: Date | null): boolean => {
  if (a === null || b === null) return a === b

  return Object.is(a.getTime(), b.getTime())
}

/**
 * The extremes of what a `Date` can hold: ±8.64e15 ms, as ISO strings that parse back exactly.
 *
 * Facts about the type rather than table data, which is why they stayed here when block 4.4 moved
 * out: block 4.5 names the later of the two as well, and putting them in the table would have made
 * this file import from the one that imports it.
 */
export const LATEST_REPRESENTABLE = '+275760-09-13T00:00:00.000Z'
export const EARLIEST_REPRESENTABLE = '-271821-04-20T00:00:00.000Z'

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at all
 * is the catalogue's rule; the figure is this contract's.
 *
 * Measured on the time-zone property, the most expensive one here because it runs every case four
 * times: the local time zone mutant it exists to catch diverges on 411 of 1000 pseudo-random draws
 * and is first caught on draw 1, so 1000 is far past the point where the guarantee is real.
 */
export const propertyRuns = 1000

/**
 * The order units are applied in, and whether they are aggregated or applied one at a time.
 *
 * Both halves are observable, so both are contract data rather than an implementation accident.
 * Order: measured, 2024-01-30T23:00Z plus `{ months: 1, hours: 2 }` is 2024-03-01T01:00Z when the
 * calendar step runs first and 2024-02-29T01:00Z when the elapsed-time step does. Aggregation:
 * measured, 2023-01-31 plus `{ months: 2 }` is 2023-03-31, while one month added twice is
 * 2023-03-28, because the intermediate clamp is not undone. date-fns, luxon, moment, js-joda and
 * Temporal all agree with the choices below, on every case measured.
 */
export const applicationOrder = [
  {
    step: 'calendar',
    fields: ['years', 'months'],
    rule:
      'Aggregated into a single month total, `years * 12 + months`, applied once to the UTC year ' +
      'and month. The day of the month is then clamped down to the last day the target month has, ' +
      'and the UTC time of day is carried across untouched.',
  },
  {
    step: 'elapsed',
    fields: ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'],
    rule:
      'Summed into a single count of milliseconds and added to the instant, one day being exactly ' +
      '24 hours. There are two steps rather than three because the six fields here commute with ' +
      'one another - measured, a day then two hours and two hours then a day reach the same ' +
      'instant, since UTC has no transitions to make a day any other length. Declaring an order ' +
      'among them would fix something no caller can observe.',
  },
] as const

/**
 * The two instants at which the declared time zones are pinned. Two rather than one, six months
 * apart, so that a runtime carrying a stub time-zone database - one that knows an offset but not
 * when it changes - is caught rather than silently accepted.
 */
export const ambientProbeInstants = {
  january: '2024-01-15T12:00:00.000Z',
  july: '2024-07-15T12:00:00.000Z',
} as const

/**
 * The time zones the ambient-input property runs the function under, with the offset each one must
 * produce, in minutes behind UTC as `Date.prototype.getTimezoneOffset` reports them.
 *
 * The set is chosen, not collected. A zone whose offset is a whole number of hours and which never
 * changes it cannot separate local-time arithmetic from UTC arithmetic on day counts, because a
 * local day is then exactly 24 hours long; measured, `Pacific/Kiritimati` diverges on 8 cases out of
 * 100 where `Europe/Paris` diverges on 32. UTC is included as the control that must agree with the
 * others, and is on its own completely blind: measured, a local-time implementation and a UTC one
 * return the same instant on 100 cases out of 100 when the process runs in UTC, which is precisely
 * why this property exists rather than a fixed harness time zone.
 */
export const ambientTimeZoneProbes = [
  {
    timeZone: 'UTC',
    offsetMinutes: { january: 0, july: 0 },
    role: 'control - agrees with every other zone, and alone cannot see the defect',
  },
  {
    timeZone: 'Europe/Paris',
    offsetMinutes: { january: -60, july: -120 },
    role: 'changes offset twice a year, so a local civil day is sometimes 23 or 25 hours',
  },
  {
    timeZone: 'Asia/Kathmandu',
    offsetMinutes: { january: -345, july: -345 },
    role: 'offset that is not a whole number of hours, and never changes',
  },
  {
    timeZone: 'Pacific/Chatham',
    offsetMinutes: { january: -825, july: -765 },
    role: 'both at once - a quarter-hour offset that also shifts twice a year',
  },
] as const

/**
 * What the validation pipeline must establish by reading an implementation rather than by running
 * it. Declared here, in public, because a requirement that lives only inside a tool nobody can read
 * is not part of a contract whose whole product is auditability.
 *
 * These are defence in depth, not the only line. The first requirement duplicates a guarantee the
 * ambient-input property already tests: the property catches the instance that happens to be drawn,
 * the lexical rule catches the whole class before anything runs. The second is here because no
 * property can reach it at all.
 *
 * The check is lexical and therefore evadable on purpose - `d['get' + 'Month']()` slips through. It
 * is written to catch the mistake, not the adversary; the adversary is caught by the property.
 */
export const staticAnalysisRequirements = [
  {
    name: 'no local time methods',
    /** Matched as method calls, so the `getUTC*` and `setUTC*` families are untouched. */
    forbiddenMethods: [
      'getFullYear',
      'getMonth',
      'getDate',
      'getDay',
      'getHours',
      'getMinutes',
      'getSeconds',
      'getMilliseconds',
      'setFullYear',
      'setMonth',
      'setDate',
      'setHours',
      'setMinutes',
      'setSeconds',
      'setMilliseconds',
      'getTimezoneOffset',
      'toLocaleDateString',
      'toLocaleTimeString',
      'toLocaleString',
    ],
    reason:
      'Every one of these reads or writes the calendar of the process time zone, which is ambient ' +
      'input the signature does not declare. An implementation using them answers differently on ' +
      'two machines running the same code.',
  },
  {
    name: 'no global state',
    forbiddenMethods: [],
    reason:
      'A feature may not read or write anything outside its arguments and its own module scope. ' +
      'Unreachable by property: a test cannot observe a write that happened before it ran, and a ' +
      'correct cache is indistinguishable from a defect by behaviour alone.',
  },
] as const

/**
 * How this contract answers the four universal properties of the catalogue.
 *
 * `no ambient input` is the interesting one here: the time zone is a real ambient input that a
 * plausible implementation really does read, which is what makes this contract the one where the
 * catalogue's split of `no observable side effect` pays for itself.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: true,
    reason:
      'Applicable here, where it was not on `number/parse@1`: `Date` is a mutable object and the ' +
      'implementation a developer writes first - `date.setUTCDate(date.getUTCDate() + n)` - mutates ' +
      'the caller\'s object and returns it. The property asserts both halves, that the input holds ' +
      'the same instant afterwards and that the result is a different object, because an ' +
      'implementation that mutates and returns its argument satisfies output equality.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by D-18 of the battery: an implementation that shifts ' +
      'the caller\'s own Date and returns a copy answers from a moved instant on the second call. ' +
      'Two candidate witnesses were measured and rejected, because a property pinned to a flaky ' +
      'or silent mutant is worse than an open gap. A clock read is not observable here - Date.now ' +
      'has millisecond resolution and the two calls this property makes are microseconds apart, so ' +
      'the mutant would be green almost always and red by accident. A cache is not observable ' +
      'either: consulted first, it is primed by the property\'s own first call and returns that ' +
      'same answer to the second. D-02, which mutates the input and hands the object back rather ' +
      'than a copy, leaves this property green for a third reason - measured - because both calls ' +
      `then return the one object and it is compared against itself. ${DETERMINISM_ORDERING_FINDING} - ` +
      'D-22 is that mutant here.',
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'The substantive property of this contract. The ambient input at stake is the process time ' +
      'zone: `getMonth` and `setDate` read and write the local calendar, so an implementation built ' +
      'on them is a different function on a machine in Paris and a machine in UTC. Measured, such ' +
      'an implementation diverges from the UTC answer on 411 of 1000 pseudo-random draws once the ' +
      'zone is varied - and on 0 of 1000 if the zone is never varied. The zone instance is ' +
      'witnessed by D-05, which reads and writes the local calendar. The call history is tested as ' +
      'a second instance of the same property, and witnessed by D-19: the Date used to look up the ' +
      'length of a month hoisted to module scope, so the year the previous call left in it decides ' +
      'the next one. State that advances with every call is the only thing this instance can see - ' +
      'a cache consulted first is primed by the probe and stays invisible, measured on ' +
      '`number/parse@1` where two such caches survive the whole battery. D-22 is the witness that ' +
      'belongs to this instance alone: measured, it reddens here and leaves determinism green.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason:
      `${NO_AMBIENT_OUTPUT_FINDING}. Here it is a static analysis requirement instead, declared in ` +
      '`staticAnalysisRequirements` above.',
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * Every profile declares the class its samples belong to, and `profiles.test.ts` checks it, because
 * `number/parse@1` shipped a profile named for one path whose samples took the other and nothing said
 * so.
 */
export type BenchmarkSample = {
  readonly date: string
  readonly duration: Duration
}

export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must do. A profile mixing both classes measures neither. */
  readonly sampleClass: 'accepted' | 'rejected'
  readonly samples: readonly BenchmarkSample[]
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'elapsed-time-only',
    description:
      'Durations with no calendar unit, which skip the month arithmetic entirely. The dominant ' +
      'shape in expiry and timeout code.',
    sampleClass: 'accepted',
    samples: [
      { date: '2024-06-15T12:00:00.000Z', duration: { hours: 1 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { minutes: 30 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { days: 7 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { weeks: 2, days: 3 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { milliseconds: 250 } },
    ],
  },
  {
    name: 'calendar-only',
    description: 'Durations that touch only the month arithmetic, on days that never clamp.',
    sampleClass: 'accepted',
    samples: [
      { date: '2024-06-15T12:00:00.000Z', duration: { months: 1 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { years: 1 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { years: 1, months: 6 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { months: -18 } },
    ],
  },
  {
    name: 'clamping',
    description:
      'Calendar arithmetic that lands on a day the target month does not have, isolating the cost ' +
      'of finding the length of a month. Measured separately because the clamp is the one branch ' +
      'an implementation can get expensive.',
    sampleClass: 'accepted',
    samples: [
      { date: '2024-01-31T00:00:00.000Z', duration: { months: 1 } },
      { date: '2023-01-31T00:00:00.000Z', duration: { months: 1 } },
      { date: '2024-05-31T00:00:00.000Z', duration: { months: 1 } },
      { date: '2024-02-29T00:00:00.000Z', duration: { years: 1 } },
      { date: '2096-02-29T00:00:00.000Z', duration: { years: 4 } },
    ],
  },
  {
    name: 'every-field',
    description: 'A duration carrying all eight fields, the worst case for validation and summation.',
    sampleClass: 'accepted',
    samples: [
      {
        date: '2024-06-15T12:00:00.000Z',
        duration: {
          years: 1,
          months: 2,
          weeks: 3,
          days: 4,
          hours: 5,
          minutes: 6,
          seconds: 7,
          milliseconds: 8,
        },
      },
      {
        date: '2024-01-31T23:59:59.999Z',
        duration: {
          years: -1,
          months: -2,
          weeks: -3,
          days: -4,
          hours: -5,
          minutes: -6,
          seconds: -7,
          milliseconds: -8,
        },
      },
    ],
  },
  {
    name: 'rejected-inputs',
    description:
      'Calls that must return null. Measured separately because an implementation may take a very ' +
      'different path when it refuses, and callers validating untrusted input hit that path most.',
    sampleClass: 'rejected',
    samples: [
      { date: 'not a date', duration: { days: 1 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { days: 0.5 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { months: Number.NaN } },
      { date: '2024-06-15T12:00:00.000Z', duration: { days: 1e21 } },
      { date: LATEST_REPRESENTABLE, duration: { milliseconds: 1 } },
    ],
  },
]
