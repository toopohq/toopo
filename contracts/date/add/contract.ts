/**
 * Contract `date/add@1`.
 *
 * This file is the contract itself: identity, signature, universal-property applicability, named
 * edge cases and benchmark profiles. It declares behaviour and executes nothing. The reference
 * implementation lives in `reference.ts`; the executable half of each block lives in its own file -
 * `signature.test-d.ts` for 4.2, `properties.test.ts` for 4.3, `edge-cases.test.ts` for 4.4 and
 * `profiles.test.ts` for 4.5.
 *
 * PROVISIONAL: failure is reported as `null`, with the reason published beside the return channel
 * rather than inside it. The catalogue-wide error convention is still undecided and will be frozen
 * for every contract at once; this file is the third arm of the experiment that decides it. The
 * first two are `main`, where failure is `null` and nothing more, and
 * `experiment/error-convention-round-2`, where the reason travels in the returned value.
 *
 * The six reasons are the six rejections `reference.ts` performs, enumerated rather than counted so
 * that the claim can be checked against it instead of trusted: an input that is not a date, a field
 * the contract does not declare, a field that is not an exact whole number, a month total that is
 * not exactly representable, an elapsed total that is not exactly representable, and a result
 * outside the range a `Date` can hold. `null` alone collapses all six into one, which is the
 * sharpest argument the catalogue has yet produced against keeping it - and the reason this
 * contract, rather than `number/parse@1`, is where the argument gets measured.
 *
 * Every rationale below is left exactly as it was written under the bare `null` convention. Those
 * sentences are part of what the experiment measures, and rewriting them here would settle silently
 * a question that is supposed to be answered by measurement.
 */

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
    'caller who needs to know which of the six refusals it was.',

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
 * Why a call could not be answered. There are six, one per rejection the reference performs, and the
 * literals belong to this contract and to no other: there is no shared failure type in the
 * catalogue, so a reason means exactly what this contract says it means and nothing has to be kept
 * compatible across features.
 *
 * `invalid-date` and `unknown-field` are the pair this experiment turns on. One is a caller who
 * never parsed what they were given; the other is a caller who wrote `{ day: 1 }` for `{ days: 1 }`.
 * They are corrected by different edits in different files, and under `null` alone they arrive as
 * the same value.
 */
export type AddFailureReason =
  | 'invalid-date'
  | 'unknown-field'
  | 'field-not-whole'
  | 'month-total-not-exact'
  | 'elapsed-total-not-exact'
  | 'out-of-range'

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 */
export type AddToDate = (date: Date, duration: Duration) => Date | null

/**
 * PROVISIONAL, third form. The reason is published beside the return channel rather than inside it:
 * `addToDate` keeps answering `Date | null`, and a caller who needs to know why asks.
 *
 * It exists because of a measurement, not a preference. Measured on `number/parse@1`, the reason
 * bought zero net detection - 14 of 20 mutants died in all three columns - while the union cost 15
 * extra unwrappings across thirteen call sites. Measured on this contract, the reason buys two
 * mutants the bare `null` column misses. So the reason is worth having and the return channel is not
 * where it has to live; this form is the one that separates the two claims.
 *
 * The cost is one extra traversal on the failing path, and only there. On this contract that
 * traversal is arithmetic rather than a regular expression, which is why the cost is measured here
 * on real call sites instead of assumed.
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
 * and the diagnostic one is not - can absolutely diverge. `properties.test.ts` shows the property
 * red on exactly that.
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

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. It is contract data rather than
 * a runner setting: the harness is public and executable by anyone, so the number of draws is part
 * of the strength of what the contract claims.
 *
 * A floor, not a value - official validation may draw more, nothing may draw fewer. Measured on the
 * time-zone property, the most expensive one here because it runs every case four times: the local
 * time zone mutant it exists to catch diverges on 411 of 1000 pseudo-random draws and is first
 * caught on draw 1, so 1000 is far past the point where the guarantee is real.
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
 * The universal properties every contract must consider. A property is only written as a test when
 * it is applicable; one that cannot fail is recorded here with its reason instead, so the green
 * count never carries a guard that proves nothing.
 *
 * `no observable side effect` is split in two, following the measurement made on `number/parse@1`.
 * `no ambient input` - the answer depends on the declared arguments and on nothing else - is
 * testable, and on this contract it is the interesting half: the time zone is a real ambient input
 * that a plausible implementation really does read.
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
      'Violable in practice: an implementation that reads the current clock to decide anything, or ' +
      'that caches on a mutable key, answers differently on the second call.',
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'The substantive property of this contract. The ambient input at stake is the process time ' +
      'zone: `getMonth` and `setDate` read and write the local calendar, so an implementation built ' +
      'on them is a different function on a machine in Paris and a machine in UTC. Measured, such ' +
      'an implementation diverges from the UTC answer on 411 of 1000 pseudo-random draws once the ' +
      'zone is varied - and on 0 of 1000 if the zone is never varied. The call history is tested as ' +
      'a second instance of the same property.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason:
      'Not reachable by a property, for the reason measured on `number/parse@1`: a test cannot see ' +
      'a write that happened before it ran, and a correct memoising cache - which is not a defect - ' +
      'is indistinguishable from one that is. It is a static analysis requirement instead.',
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.4 - Named and settled edge cases
// ---------------------------------------------------------------------------

/**
 * Each entry is simultaneously an exact test (`edge-cases.test.ts`) and one line of public
 * documentation. `rationale` is the published sentence; it states a measured fact, not an opinion.
 *
 * Dates are written as ISO 8601 strings rather than constructed, so that the table reads as data and
 * survives a diff. A string that is not a date is how the invalid input is expressed.
 *
 * Every arithmetic answer below was computed by two independent oracles - Temporal under `constrain`
 * and luxon - before the reference existed, so the table judges the implementation instead of
 * transcribing it. They agreed on every case except the two where this contract knowingly takes a
 * side, both marked in their rationale.
 */
export type EdgeCase = {
  readonly date: string
  readonly duration: Duration
  readonly expected: string | null
  /** What the diagnostic surface must report, and `null` exactly when the call is answered. */
  readonly reason: AddFailureReason | null
  readonly rationale: string
}

/** The extremes of what a `Date` can hold: ±8.64e15 ms, as ISO strings that parse back exactly. */
const LATEST_REPRESENTABLE = '+275760-09-13T00:00:00.000Z'
const EARLIEST_REPRESENTABLE = '-271821-04-20T00:00:00.000Z'

export const edgeCases: readonly EdgeCase[] = [
  // --- Baseline -----------------------------------------------------------
  {
    date: '2024-01-15T10:30:00.000Z',
    duration: { days: 1 },
    expected: '2024-01-16T10:30:00.000Z',
    reason: null,
    rationale: 'An ordinary day is added, and the time of day is untouched.',
  },
  {
    date: '2024-01-15T10:30:00.000Z',
    duration: { minutes: 90 },
    expected: '2024-01-15T12:00:00.000Z',
    reason: null,
    rationale: 'Elapsed units carry into the next unit; ninety minutes is an hour and a half.',
  },
  {
    date: '1969-12-31T23:59:59.999Z',
    duration: { milliseconds: 1 },
    expected: '1970-01-01T00:00:00.000Z',
    reason: null,
    rationale:
      'The epoch is not a boundary. It is listed because implementations that branch on the sign ' +
      'of the timestamp get this one wrong.',
  },

  // --- End-of-month clamping ----------------------------------------------
  {
    date: '2024-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    rationale:
      'A day that the target month does not have is clamped down to the last day it does. There is ' +
      'no 31 February, and the two defensible answers are the end of February or the overflow into ' +
      'March. Measured, date-fns, luxon, dayjs, moment, js-joda and Temporal under its default ' +
      'overflow all clamp; JavaScript\'s own setUTCMonth overflows, to 2 March. The contract follows ' +
      'the six libraries against the language, because "a month later" naming a date in March is a ' +
      'surprise no caller asked for.',
  },
  {
    date: '2023-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2023-02-28T00:00:00.000Z',
    reason: null,
    rationale: 'The same clamp in a common year lands on the 28th, since that is the last day.',
  },
  {
    date: '2024-05-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2024-06-30T00:00:00.000Z',
    reason: null,
    rationale: 'Clamping is not about February; any 31-day month followed by a 30-day one clamps.',
  },
  {
    date: '2024-03-31T00:00:00.000Z',
    duration: { months: -1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    rationale: 'Clamping applies in both directions; going backwards is not a special case.',
  },
  {
    date: '2024-02-29T00:00:00.000Z',
    duration: { months: -1 },
    expected: '2024-01-29T00:00:00.000Z',
    reason: null,
    rationale:
      'Adding a month and removing it again does not return where it started: 31 January plus one ' +
      'month is 29 February, and 29 February minus one month is 29 January. The clamp discards the ' +
      'day of the month, and nothing remembers it. This is a consequence of clamping rather than a ' +
      'defect, it is what every measured library does, and it is why the round-trip property in ' +
      'block 4.3 excludes calendar units instead of pretending they qualify.',
  },
  {
    date: '2024-01-31T23:59:59.999Z',
    duration: { months: 1 },
    expected: '2024-02-29T23:59:59.999Z',
    reason: null,
    rationale:
      'The clamp moves the date and leaves the UTC time of day exactly as it was, down to the ' +
      'millisecond, including at the last instant of a day.',
  },

  // --- Leap years ----------------------------------------------------------
  {
    date: '2024-02-29T00:00:00.000Z',
    duration: { years: 1 },
    expected: '2025-02-28T00:00:00.000Z',
    reason: null,
    rationale: 'A leap day plus one year clamps, because the target year has no 29 February.',
  },
  {
    date: '2024-02-29T00:00:00.000Z',
    duration: { years: 4 },
    expected: '2028-02-29T00:00:00.000Z',
    reason: null,
    rationale: 'Four years later the day exists again and nothing is clamped.',
  },
  {
    date: '2096-02-29T00:00:00.000Z',
    duration: { years: 4 },
    expected: '2100-02-28T00:00:00.000Z',
    reason: null,
    rationale:
      'The century rule bites: 2100 is divisible by 4 but not by 400, so it is not a leap year and ' +
      'the day is clamped. An implementation testing only `year % 4` answers 2100-02-29.',
  },
  {
    date: '0050-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '0050-02-28T00:00:00.000Z',
    reason: null,
    rationale:
      'A two-digit year stays a two-digit year rather than being read as a nineteen-hundreds one. ' +
      'It is listed because `Date.UTC` maps years 0 to 99 onto 1900 to 1999 - measured, ' +
      '`Date.UTC(50, 0, 1)` is 1950-01-01 where `setUTCFullYear(50, 0, 1)` is year 50 - so an ' +
      'implementation that builds its result through `Date.UTC` answers in the wrong century. The ' +
      'measured limit of this case is published rather than hidden: an implementation using ' +
      '`Date.UTC` only to look up the length of a month passes it, because Y and 1900 + Y are ' +
      'congruent modulo four and so agree on February everywhere except the century rule. Year 0 ' +
      'is the only two-digit year where they part - 0 is a leap year and 1900 is not - and this ' +
      'table does not carry it.',
  },

  // --- Aggregation within a step ------------------------------------------
  {
    date: '2023-01-31T00:00:00.000Z',
    duration: { months: 2 },
    expected: '2023-03-31T00:00:00.000Z',
    reason: null,
    rationale:
      'Two months are added as two months, not as one month twice. Measured, adding one month twice ' +
      'gives 2023-03-28, because the clamp to 28 February is never undone. The contract aggregates, ' +
      'as every measured library does.',
  },
  {
    date: '2023-01-31T00:00:00.000Z',
    duration: { years: 1, months: 1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    rationale:
      'Years and months are one total of thirteen months, not a year then a month. Applying months ' +
      'first would give 2024-02-28, one day earlier, because it clamps twice.',
  },
  {
    date: '2024-02-25T00:00:00.000Z',
    duration: { weeks: 1, days: 1 },
    expected: '2024-03-04T00:00:00.000Z',
    reason: null,
    rationale: 'Weeks and days are one total of eight days; a week is seven days and nothing else.',
  },
  {
    date: '2024-01-31T00:00:00.000Z',
    duration: { weeks: 1 },
    expected: '2024-02-07T00:00:00.000Z',
    reason: null,
    rationale: 'A week never clamps, because it is a count of days rather than a calendar unit.',
  },

  // --- Order between the steps --------------------------------------------
  {
    date: '2024-01-30T23:00:00.000Z',
    duration: { months: 1, hours: 2 },
    expected: '2024-03-01T01:00:00.000Z',
    reason: null,
    rationale:
      'Calendar units are applied before elapsed time, and the order is observable: the calendar ' +
      'step clamps 30 January to 29 February, and the two hours then cross midnight into 1 March. ' +
      'Adding the hours first would reach 31 January, which clamps to 29 February - a different ' +
      'answer, a day earlier.',
  },
  {
    date: '2024-01-30T00:00:00.000Z',
    duration: { months: 1, days: 1 },
    expected: '2024-03-01T00:00:00.000Z',
    reason: null,
    rationale:
      'The same order between months and days: 30 January clamps to 29 February, then one day is ' +
      'added. Days first would give 31 January, then 29 February.',
  },

  // --- Negative and mixed signs -------------------------------------------
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: -3 },
    expected: '2024-01-12T00:00:00.000Z',
    reason: null,
    rationale: 'A negative field subtracts; there is no separate subtraction function.',
  },
  {
    date: '2024-01-31T00:00:00.000Z',
    duration: { months: 1, days: -1 },
    expected: '2024-02-28T00:00:00.000Z',
    reason: null,
    rationale:
      'Fields may disagree in sign. Temporal rejects a mixed-sign duration outright; this contract ' +
      'accepts it, because `{ months: 1, days: -1 }` is how a caller writes "the day before the ' +
      'same date next month" and refusing it makes a common intention inexpressible. luxon and ' +
      'date-fns accept it and agree on this answer.',
  },

  // --- The neutral duration ------------------------------------------------
  {
    date: '2024-01-31T12:34:56.789Z',
    duration: {},
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    rationale:
      'The empty duration is the neutral element: it returns the same instant, in a new object. ' +
      'Temporal rejects it - measured, `TypeError: No valid fields` - on the grounds that it ' +
      'declares no operation; this contract accepts it, as date-fns and luxon do, because ' +
      '`addToDate(d, buildDuration(form))` must not fail when the form is empty.',
  },
  {
    date: '2024-01-31T12:34:56.789Z',
    duration: { days: -0 },
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    rationale:
      'Negative zero is a whole number and adds nothing. Unlike `number/parse@1`, where the sign of ' +
      'zero is preserved in the result, it cannot survive here: measured, `new Date(-0).getTime()` ' +
      'is `0`, so `Date` erases the distinction before any implementation could keep it.',
  },
  {
    date: '2024-01-31T12:34:56.789Z',
    duration: { days: undefined },
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    rationale:
      'A declared field set to `undefined` means zero, not an error. `{ days: form.days }` where the ' +
      'form has no value is ordinary TypeScript, and rejecting it would make the type lie.',
  },

  // --- Durations that are not exact whole units ---------------------------
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { months: 1.5 },
    expected: null,
    reason: 'field-not-whole',
    rationale:
      'A fractional month has no meaning the contract can honour, and the established libraries ' +
      'disagree about it - measured, date-fns and dayjs silently truncate to one month, luxon ' +
      'converts the half into about fifteen days, Temporal throws. Silently truncating is the same ' +
      'failure as `Number("0x1F")` returning 31: an answer that looks right and is not what was ' +
      'asked. This is the first place in the catalogue where a contract takes a side instead of ' +
      'following the ecosystem.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 0.5 },
    expected: null,
    reason: 'field-not-whole',
    rationale:
      'Half a day is rejected even though it has an exact meaning in UTC, because the rule is one ' +
      'rule for every field. `{ hours: 12 }` says the same thing without ambiguity.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: Number.NaN },
    expected: null,
    reason: 'field-not-whole',
    rationale: 'NaN is not a whole number. Adding it would produce an Invalid Date.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: Number.POSITIVE_INFINITY },
    expected: null,
    reason: 'field-not-whole',
    rationale: 'An infinite duration is not a whole number and has no representable result.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 1e21 },
    expected: null,
    reason: 'field-not-whole',
    rationale:
      'Beyond 2^53 an integer is no longer exactly representable as a double, so the arithmetic ' +
      'stops being the arithmetic the caller wrote. `Number.isInteger(1e21)` is true and every ' +
      'measured library accepts it; this contract requires `Number.isSafeInteger` instead, for the ' +
      'same reason it rejects a fractional month - a wrong answer delivered silently is worse than ' +
      'no answer.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { years: Number.MAX_SAFE_INTEGER },
    expected: null,
    reason: 'month-total-not-exact',
    rationale:
      'Each field is a safe integer here, but the total is not: measured, `MAX_SAFE_INTEGER * 12` ' +
      'is not a safe integer, so the month total could not be computed exactly. The rule applies to ' +
      'the totals the contract actually adds, not only to the fields as written.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { milliseconds: Number.MAX_SAFE_INTEGER, seconds: Number.MAX_SAFE_INTEGER },
    expected: null,
    reason: 'elapsed-total-not-exact',
    rationale:
      'The same rule for elapsed time: two safe integers whose sum in milliseconds is not one. Past ' +
      '2^53 milliseconds - about 285 000 years, far outside the range a Date can hold anyway - the ' +
      'sum would round, and the contract does not return values it cannot compute exactly.',
  },

  // --- Inputs that are not dates -------------------------------------------
  {
    date: 'not a date',
    duration: { days: 1 },
    expected: null,
    reason: 'invalid-date',
    rationale:
      'An Invalid Date in gives null out, never an Invalid Date out. `new Date("nonsense")` is a ' +
      'Date whose timestamp is NaN; measured, date-fns propagates it and returns another Invalid ' +
      'Date, which then poisons every later computation exactly as NaN does in `number/parse@1`.',
  },
  {
    date: 'not a date',
    duration: {},
    expected: null,
    reason: 'invalid-date',
    rationale:
      'The neutral duration does not rescue an invalid input. The date is checked before the ' +
      'duration is looked at, so no duration can make an unanswerable call answerable.',
  },

  // --- The edges of the representable range --------------------------------
  {
    date: LATEST_REPRESENTABLE,
    duration: {},
    expected: LATEST_REPRESENTABLE,
    reason: null,
    rationale: 'The last representable instant is a valid input and is returned unchanged.',
  },
  {
    date: LATEST_REPRESENTABLE,
    duration: { milliseconds: 1 },
    expected: null,
    reason: 'out-of-range',
    rationale:
      'One millisecond past the end of the range has no Date. `new Date(8.64e15 + 1)` is an Invalid ' +
      'Date; the contract returns null rather than hand one back.',
  },
  {
    date: EARLIEST_REPRESENTABLE,
    duration: { milliseconds: -1 },
    expected: null,
    reason: 'out-of-range',
    rationale: 'The range is symmetric, and so is the rejection.',
  },
  {
    date: LATEST_REPRESENTABLE,
    duration: { months: 1, days: -40 },
    expected: null,
    reason: 'out-of-range',
    rationale:
      'The steps are applied in the declared order and each one must land inside the range. Adding ' +
      'a month leaves it, and removing forty days would come back; the contract does not allow the ' +
      'detour. Declaring this follows from declaring the order at all - a contract that fixed the ' +
      'order but let intermediate results roam would have declared half a rule.',
  },
]

/**
 * Edge cases whose duration TypeScript would reject, kept in their own table because the table above
 * is typed and must stay that way: a misspelling in a case that means to exercise real arithmetic
 * has to be a compile error, and it stops being one the moment the field type is widened.
 *
 * They exist because the type is not the guard people assume. Excess property checking only applies
 * to object literals written at the call site: `addToDate(d, options)` where `options` came from a
 * variable, a JSON payload or a JavaScript caller passes straight through with whatever fields it
 * carries.
 */
export type UntypedEdgeCase = {
  readonly date: string
  readonly duration: Readonly<Record<string, unknown>>
  readonly expected: string | null
  readonly reason: AddFailureReason | null
  readonly rationale: string
}

export const untypedEdgeCases: readonly UntypedEdgeCase[] = [
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { day: 1 },
    expected: null,
    reason: 'unknown-field',
    rationale:
      'A field the contract does not define is a rejection, not a no-op. `{ day: 1 }` for ' +
      '`{ days: 1 }` is the singular-for-plural slip everyone makes, and returning the date ' +
      'unchanged would be `Number("")` returning 0 in another costume: a plausible value that ' +
      'silently drops what the caller asked for.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { month: 1 },
    expected: null,
    reason: 'unknown-field',
    rationale: 'The same slip on the calendar side, rejected for the same reason.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 1, day: 1 },
    expected: null,
    reason: 'unknown-field',
    rationale:
      'One unknown field is enough to reject the whole call, even alongside a valid one. Applying ' +
      'the part that was understood would be the most dangerous answer available: it looks like it ' +
      'worked.',
  },
  {
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: '1' },
    expected: null,
    reason: 'field-not-whole',
    rationale:
      'A declared field carrying the wrong type is rejected too. A string reaching this function ' +
      'has come from JSON or a form and has not been through the parser it needed.',
  },
]

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * Declared as data. Nothing here is executed or measured in this repository: there is no reference
 * machine yet, and a number produced on a developer laptop would be dishonest.
 *
 * Every profile declares the class its samples belong to, and `profiles.test.ts` checks it, because
 * `number/parse@1` shipped a profile named for one path whose samples took the other and nothing
 * said so.
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
