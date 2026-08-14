/**
 * Block 4.4 of contract `date/add@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `catalogue/every-contract.ts`. What is here is this contract's own two tables.
 *
 * Dates are written as ISO 8601 strings rather than constructed, so that the table reads as data and
 * survives a diff. A string that is not a date is how the invalid input is expressed.
 *
 * Every arithmetic answer below was computed by two independent oracles - Temporal under `constrain`
 * and luxon - before the reference existed, so the table judges the implementation instead of
 * transcribing it. They agreed on every case except the two where this contract knowingly takes a
 * side, both marked in their rationale.
 *
 * Nothing here is `found-in-the-wild` yet. No defect reported from real use has reached this
 * catalogue, and saying so is more honest than repainting the history of the two cases that came from
 * mutation.
 */

import type { CaseGroup } from '../../../../catalogue/identifier.js'
import type { Provenance } from '../../../../catalogue/every-contract.js'
import type { AddFailureReason, Duration } from './contract.js'
import { EARLIEST_REPRESENTABLE, LATEST_REPRESENTABLE } from './contract.js'

/**
 * The ten questions the typed table answers, in the order it answers them. Frozen with the major -
 * see `CaseGroup`.
 */
export const edgeCaseGroups: readonly CaseGroup[] = [
  { id: 'baseline', title: 'Baseline', note: null },
  { id: 'end-of-month-clamping', title: 'End-of-month clamping', note: null },
  { id: 'leap-years', title: 'Leap years', note: null },
  { id: 'aggregation-within-a-step', title: 'Aggregation within a step', note: null },
  { id: 'order-between-the-steps', title: 'Order between the steps', note: null },
  { id: 'negative-and-mixed-signs', title: 'Negative and mixed signs', note: null },
  { id: 'the-neutral-duration', title: 'The neutral duration', note: null },
  { id: 'durations-that-are-not-whole-units', title: 'Durations that are not exact whole units', note: null },
  { id: 'inputs-that-are-not-dates', title: 'Inputs that are not dates', note: null },
  { id: 'the-edges-of-the-representable-range', title: 'The edges of the representable range', note: null },
]

export type EdgeCase = {
  readonly id: string
  /** Which of `edgeCaseGroups` this case sits under. */
  readonly group: string
  readonly date: string
  readonly duration: Duration
  readonly expected: string | null
  /** What the diagnostic surface must report, and `null` exactly when the call is answered. */
  readonly reason: AddFailureReason | null
  readonly provenance: Provenance
  readonly rationale: string
}

export const edgeCases: readonly EdgeCase[] = [
  {
    id: 'an-ordinary-day',
    group: 'baseline',
    date: '2024-01-15T10:30:00.000Z',
    duration: { days: 1 },
    expected: '2024-01-16T10:30:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'An ordinary day is added, and the time of day is untouched.',
  },
  {
    id: 'minutes-carry-into-hours',
    group: 'baseline',
    date: '2024-01-15T10:30:00.000Z',
    duration: { minutes: 90 },
    expected: '2024-01-15T12:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'Elapsed units carry into the next unit; ninety minutes is an hour and a half.',
  },
  {
    id: 'the-epoch-is-not-a-boundary',
    group: 'baseline',
    date: '1969-12-31T23:59:59.999Z',
    duration: { milliseconds: 1 },
    expected: '1970-01-01T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'The epoch is not a boundary. It is listed because implementations that branch on the sign ' +
      'of the timestamp get this one wrong.',
  },

  {
    id: 'clamp-to-the-end-of-february',
    group: 'end-of-month-clamping',
    date: '2024-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'A day that the target month does not have is clamped down to the last day it does. There is ' +
      'no 31 February, and the two defensible answers are the end of February or the overflow into ' +
      'March. Measured, date-fns, luxon, dayjs, moment, js-joda and Temporal under its default ' +
      'overflow all clamp; JavaScript\'s own setUTCMonth overflows, to 2 March. The contract follows ' +
      'the six libraries against the language, because "a month later" naming a date in March is a ' +
      'surprise no caller asked for.',
  },
  {
    id: 'clamp-in-a-common-year',
    group: 'end-of-month-clamping',
    date: '2023-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2023-02-28T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'The same clamp in a common year lands on the 28th, since that is the last day.',
  },
  {
    id: 'clamp-into-a-thirty-day-month',
    group: 'end-of-month-clamping',
    date: '2024-05-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2024-06-30T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'Clamping is not about February; any 31-day month followed by a 30-day one clamps.',
  },
  {
    id: 'clamp-going-backwards',
    group: 'end-of-month-clamping',
    date: '2024-03-31T00:00:00.000Z',
    duration: { months: -1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'Clamping applies in both directions; going backwards is not a special case.',
  },
  {
    id: 'the-clamp-does-not-round-trip',
    group: 'end-of-month-clamping',
    date: '2024-02-29T00:00:00.000Z',
    duration: { months: -1 },
    expected: '2024-01-29T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Adding a month and removing it again does not return where it started: 31 January plus one ' +
      'month is 29 February, and 29 February minus one month is 29 January. The clamp discards the ' +
      'day of the month, and nothing remembers it. This is a consequence of clamping rather than a ' +
      'defect, it is what every measured library does, and it is why the round-trip property in ' +
      'block 4.3 excludes calendar units instead of pretending they qualify.',
  },
  {
    id: 'the-clamp-keeps-the-time-of-day',
    group: 'end-of-month-clamping',
    date: '2024-01-31T23:59:59.999Z',
    duration: { months: 1 },
    expected: '2024-02-29T23:59:59.999Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'The clamp moves the date and leaves the UTC time of day exactly as it was, down to the ' +
      'millisecond, including at the last instant of a day.',
  },

  {
    id: 'a-leap-day-plus-one-year',
    group: 'leap-years',
    date: '2024-02-29T00:00:00.000Z',
    duration: { years: 1 },
    expected: '2025-02-28T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'A leap day plus one year clamps, because the target year has no 29 February.',
  },
  {
    id: 'a-leap-day-plus-four-years',
    group: 'leap-years',
    date: '2024-02-29T00:00:00.000Z',
    duration: { years: 4 },
    expected: '2028-02-29T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'Four years later the day exists again and nothing is clamped.',
  },
  {
    id: 'the-century-rule',
    group: 'leap-years',
    date: '2096-02-29T00:00:00.000Z',
    duration: { years: 4 },
    expected: '2100-02-28T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'The century rule bites: 2100 is divisible by 4 but not by 400, so it is not a leap year and ' +
      'the day is clamped. An implementation testing only `year % 4` answers 2100-02-29.',
  },
  {
    id: 'a-two-digit-year',
    group: 'leap-years',
    date: '0050-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '0050-02-28T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'A two-digit year stays a two-digit year rather than being read as a nineteen-hundreds one. ' +
      'It is listed because `Date.UTC` maps years 0 to 99 onto 1900 to 1999 - measured, ' +
      '`Date.UTC(50, 0, 1)` is 1950-01-01 where `setUTCFullYear(50, 0, 1)` is year 50 - so an ' +
      'implementation that builds its result through `Date.UTC` answers in the wrong century. The ' +
      'measured limit of this case is published rather than hidden: an implementation using ' +
      '`Date.UTC` only to look up the length of a month passes it, because Y and 1900 + Y are ' +
      'congruent modulo four and so agree on February everywhere except the century rule. The case ' +
      'below is the one input where they part.',
  },
  {
    id: 'year-zero',
    group: 'leap-years',
    date: '0000-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '0000-02-29T00:00:00.000Z',
    reason: null,
    provenance: 'found-by-mutation:D-07',
    rationale:
      'Year 0 is the single two-digit year where reading a month length through `Date.UTC` and ' +
      'reading it through `setUTCFullYear` disagree: 0 is a leap year and 1900, which `Date.UTC` ' +
      'maps it to, is not. Measured, February of year 0 has 29 days by `setUTCFullYear` and 28 by ' +
      '`Date.UTC`. Every other case in this table is congruent modulo four with the year it would ' +
      'be mistaken for, so all of them pass under that implementation and this one does not.',
  },

  {
    id: 'two-months-aggregated',
    group: 'aggregation-within-a-step',
    date: '2023-01-31T00:00:00.000Z',
    duration: { months: 2 },
    expected: '2023-03-31T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Two months are added as two months, not as one month twice. Measured, adding one month twice ' +
      'gives 2023-03-28, because the clamp to 28 February is never undone. The contract aggregates, ' +
      'as every measured library does.',
  },
  {
    id: 'years-and-months-are-one-total',
    group: 'aggregation-within-a-step',
    date: '2023-01-31T00:00:00.000Z',
    duration: { years: 1, months: 1 },
    expected: '2024-02-29T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Years and months are one total of thirteen months, not a year then a month. Applying months ' +
      'first would give 2024-02-28, one day earlier, because it clamps twice.',
  },
  {
    id: 'weeks-and-days-are-one-total',
    group: 'aggregation-within-a-step',
    date: '2024-02-25T00:00:00.000Z',
    duration: { weeks: 1, days: 1 },
    expected: '2024-03-04T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'Weeks and days are one total of eight days; a week is seven days and nothing else.',
  },
  {
    id: 'a-week-never-clamps',
    group: 'aggregation-within-a-step',
    date: '2024-01-31T00:00:00.000Z',
    duration: { weeks: 1 },
    expected: '2024-02-07T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'A week never clamps, because it is a count of days rather than a calendar unit.',
  },

  {
    id: 'calendar-before-elapsed-hours',
    group: 'order-between-the-steps',
    date: '2024-01-30T23:00:00.000Z',
    duration: { months: 1, hours: 2 },
    expected: '2024-03-01T01:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Calendar units are applied before elapsed time, and the order is observable: the calendar ' +
      'step clamps 30 January to 29 February, and the two hours then cross midnight into 1 March. ' +
      'Adding the hours first would reach 31 January, which clamps to 29 February - a different ' +
      'answer, a day earlier.',
  },
  {
    id: 'calendar-before-elapsed-days',
    group: 'order-between-the-steps',
    date: '2024-01-30T00:00:00.000Z',
    duration: { months: 1, days: 1 },
    expected: '2024-03-01T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'The same order between months and days: 30 January clamps to 29 February, then one day is ' +
      'added. Days first would give 31 January, then 29 February.',
  },

  {
    id: 'a-negative-field-subtracts',
    group: 'negative-and-mixed-signs',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: -3 },
    expected: '2024-01-12T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale: 'A negative field subtracts; there is no separate subtraction function.',
  },
  {
    id: 'fields-of-opposite-sign',
    group: 'negative-and-mixed-signs',
    date: '2024-01-31T00:00:00.000Z',
    duration: { months: 1, days: -1 },
    expected: '2024-02-28T00:00:00.000Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Fields may disagree in sign. Temporal rejects a mixed-sign duration outright; this contract ' +
      'accepts it, because `{ months: 1, days: -1 }` is how a caller writes "the day before the ' +
      'same date next month" and refusing it makes a common intention inexpressible. luxon and ' +
      'date-fns accept it and agree on this answer.',
  },

  {
    id: 'the-empty-duration',
    group: 'the-neutral-duration',
    date: '2024-01-31T12:34:56.789Z',
    duration: {},
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'The empty duration is the neutral element: it returns the same instant, in a new object. ' +
      'Temporal rejects it - measured, `TypeError: No valid fields` - on the grounds that it ' +
      'declares no operation; this contract accepts it, as date-fns and luxon do, because ' +
      '`addToDate(d, buildDuration(form))` must not fail when the form is empty.',
  },
  {
    id: 'a-negative-zero-field',
    group: 'the-neutral-duration',
    date: '2024-01-31T12:34:56.789Z',
    duration: { days: -0 },
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'Negative zero is a whole number and adds nothing. Unlike `number/parse@1`, where the sign of ' +
      'zero is preserved in the result, it cannot survive here: measured, `new Date(-0).getTime()` ' +
      'is `0`, so `Date` erases the distinction before any implementation could keep it.',
  },
  {
    id: 'a-field-set-to-undefined',
    group: 'the-neutral-duration',
    date: '2024-01-31T12:34:56.789Z',
    duration: { days: undefined },
    expected: '2024-01-31T12:34:56.789Z',
    reason: null,
    provenance: 'specified',
    rationale:
      'A declared field set to `undefined` means zero, not an error. `{ days: form.days }` where the ' +
      'form has no value is ordinary TypeScript, and rejecting it would make the type lie.',
  },

  {
    id: 'a-fractional-month',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { months: 1.5 },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale:
      'A fractional month has no meaning the contract can honour, and the established libraries ' +
      'disagree about it - measured, date-fns and dayjs silently truncate to one month, luxon ' +
      'converts the half into about fifteen days, Temporal throws. Silently truncating is the same ' +
      'failure as `Number("0x1F")` returning 31: an answer that looks right and is not what was ' +
      'asked. This is the first place in the catalogue where a contract takes a side instead of ' +
      'following the ecosystem.',
  },
  {
    id: 'half-a-day',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 0.5 },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale:
      'Half a day is rejected even though it has an exact meaning in UTC, because the rule is one ' +
      'rule for every field. `{ hours: 12 }` says the same thing without ambiguity.',
  },
  {
    id: 'a-field-that-is-not-a-number',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: Number.NaN },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale: 'NaN is not a whole number. Adding it would produce an Invalid Date.',
  },
  {
    id: 'an-infinite-field',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: Number.POSITIVE_INFINITY },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale: 'An infinite duration is not a whole number and has no representable result.',
  },
  {
    id: 'a-field-past-the-safe-range',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 1e21 },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale:
      'Beyond 2^53 an integer is no longer exactly representable as a double, so the arithmetic ' +
      'stops being the arithmetic the caller wrote. `Number.isInteger(1e21)` is true and every ' +
      'measured library accepts it; this contract requires `Number.isSafeInteger` instead, for the ' +
      'same reason it rejects a fractional month - a wrong answer delivered silently is worse than ' +
      'no answer.',
  },
  {
    id: 'two-fields-whose-total-cancels',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { years: 2 ** 53, months: -(2 ** 53) * 12 },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'found-by-mutation:D-08',
    rationale:
      'Two fields past the safe range whose month total is exactly zero. Measured, `2**53` is an ' +
      'integer and not a safe integer, and both products are exactly representable as doubles, so ' +
      'their sum really is 0. An implementation guarding with `Number.isInteger` instead of ' +
      '`Number.isSafeInteger` therefore accepts both fields, computes a total it can represent, ' +
      'and returns the date unchanged - a plausible answer rather than an obviously wrong one. ' +
      'Every other case here is caught by the total guard even when the field guard is weakened; ' +
      'this is the one that requires the rule to be about the fields as written.',
  },
  {
    id: 'a-month-total-that-is-not-exact',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { years: Number.MAX_SAFE_INTEGER },
    expected: null,
    reason: 'total-not-exact',
    provenance: 'specified',
    rationale:
      'Each field is a safe integer here, but the total is not: measured, `MAX_SAFE_INTEGER * 12` ' +
      'is not a safe integer, so the month total could not be computed exactly. The rule applies to ' +
      'the totals the contract actually adds, not only to the fields as written.',
  },
  {
    id: 'an-elapsed-total-that-is-not-exact',
    group: 'durations-that-are-not-whole-units',
    date: '2024-01-15T00:00:00.000Z',
    duration: { milliseconds: Number.MAX_SAFE_INTEGER, seconds: Number.MAX_SAFE_INTEGER },
    expected: null,
    reason: 'total-not-exact',
    provenance: 'specified',
    rationale:
      'The same rule for elapsed time: two safe integers whose sum in milliseconds is not one. Past ' +
      '2^53 milliseconds - about 285 000 years, far outside the range a Date can hold anyway - the ' +
      'sum would round, and the contract does not return values it cannot compute exactly. It ' +
      'carries the same reason as the month total above, because a caller repairs both by making ' +
      'the duration it wrote smaller.',
  },

  {
    id: 'an-input-that-is-not-a-date',
    group: 'inputs-that-are-not-dates',
    date: 'not a date',
    duration: { days: 1 },
    expected: null,
    reason: 'invalid-date',
    provenance: 'specified',
    rationale:
      'An Invalid Date in gives null out, never an Invalid Date out. `new Date("nonsense")` is a ' +
      'Date whose timestamp is NaN; measured, date-fns propagates it and returns another Invalid ' +
      'Date, which then poisons every later computation exactly as NaN does in `number/parse@1`.',
  },
  {
    id: 'an-input-that-is-not-a-date-with-the-empty-duration',
    group: 'inputs-that-are-not-dates',
    date: 'not a date',
    duration: {},
    expected: null,
    reason: 'invalid-date',
    provenance: 'specified',
    rationale:
      'The neutral duration does not rescue an invalid input. The date is checked before the ' +
      'duration is looked at, so no duration can make an unanswerable call answerable.',
  },

  {
    id: 'the-last-representable-instant',
    group: 'the-edges-of-the-representable-range',
    date: LATEST_REPRESENTABLE,
    duration: {},
    expected: LATEST_REPRESENTABLE,
    reason: null,
    provenance: 'specified',
    rationale: 'The last representable instant is a valid input and is returned unchanged.',
  },
  {
    id: 'one-millisecond-past-the-end-of-the-range',
    group: 'the-edges-of-the-representable-range',
    date: LATEST_REPRESENTABLE,
    duration: { milliseconds: 1 },
    expected: null,
    reason: 'out-of-range',
    provenance: 'specified',
    rationale:
      'One millisecond past the end of the range has no Date. `new Date(8.64e15 + 1)` is an Invalid ' +
      'Date; the contract returns null rather than hand one back.',
  },
  {
    id: 'one-millisecond-before-the-start-of-the-range',
    group: 'the-edges-of-the-representable-range',
    date: EARLIEST_REPRESENTABLE,
    duration: { milliseconds: -1 },
    expected: null,
    reason: 'out-of-range',
    provenance: 'specified',
    rationale: 'The range is symmetric, and so is the rejection.',
  },
  {
    id: 'an-intermediate-step-outside-the-range',
    group: 'the-edges-of-the-representable-range',
    date: LATEST_REPRESENTABLE,
    duration: { months: 1, days: -40 },
    expected: null,
    reason: 'out-of-range',
    provenance: 'specified',
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
/**
 * The two questions this table answers. Read off the `reason` its own cases carry rather than
 * decided beside them: three reject a field the contract does not define, one rejects a declared
 * field of the wrong type, and that partition is already in the data. Frozen with the major.
 */
export const untypedEdgeCaseGroups: readonly CaseGroup[] = [
  { id: 'fields-the-contract-does-not-define', title: 'A field the contract does not define', note: null },
  { id: 'fields-carrying-the-wrong-type', title: 'A declared field carrying the wrong type', note: null },
]

export type UntypedEdgeCase = {
  readonly id: string
  /** Which of `untypedEdgeCaseGroups` this case sits under. */
  readonly group: string
  readonly date: string
  readonly duration: Readonly<Record<string, unknown>>
  readonly expected: string | null
  readonly reason: AddFailureReason | null
  readonly provenance: Provenance
  readonly rationale: string
}

export const untypedEdgeCases: readonly UntypedEdgeCase[] = [
  {
    id: 'a-singular-day-field',
    group: 'fields-the-contract-does-not-define',
    date: '2024-01-15T00:00:00.000Z',
    duration: { day: 1 },
    expected: null,
    reason: 'unknown-field',
    provenance: 'specified',
    rationale:
      'A field the contract does not define is a rejection, not a no-op. `{ day: 1 }` for ' +
      '`{ days: 1 }` is the singular-for-plural slip everyone makes, and returning the date ' +
      'unchanged would be `Number("")` returning 0 in another costume: a plausible value that ' +
      'silently drops what the caller asked for.',
  },
  {
    id: 'a-singular-month-field',
    group: 'fields-the-contract-does-not-define',
    date: '2024-01-15T00:00:00.000Z',
    duration: { month: 1 },
    expected: null,
    reason: 'unknown-field',
    provenance: 'specified',
    rationale: 'The same slip on the calendar side, rejected for the same reason.',
  },
  {
    id: 'an-unknown-field-beside-a-declared-one',
    group: 'fields-the-contract-does-not-define',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: 1, day: 1 },
    expected: null,
    reason: 'unknown-field',
    provenance: 'specified',
    rationale:
      'One unknown field is enough to reject the whole call, even alongside a valid one. Applying ' +
      'the part that was understood would be the most dangerous answer available: it looks like it ' +
      'worked.',
  },
  {
    id: 'a-declared-field-carrying-a-string',
    group: 'fields-carrying-the-wrong-type',
    date: '2024-01-15T00:00:00.000Z',
    duration: { days: '1' },
    expected: null,
    reason: 'field-not-whole',
    provenance: 'specified',
    rationale:
      'A declared field carrying the wrong type is rejected too. A string reaching this function ' +
      'has come from JSON or a form and has not been through the parser it needed. It shares the ' +
      'reason of a fractional field rather than earning one, because the same sentence is true of ' +
      'both: a string is not a whole number either.',
  },
]

