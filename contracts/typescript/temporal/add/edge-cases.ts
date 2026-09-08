/**
 * Block 4.4 of contract `temporal/add@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `packages/catalogue/every-contract.js`. What is here is this contract's own table.
 *
 * Every case is `specified`: this contract has no battery, and cannot have one until a leg of the
 * matrix carries `Temporal`, so no case here can have been added because a mutant survived and none
 * is claimed to have been.
 *
 * ---------------------------------------------------------------------------
 * Forty rows are the matrix; the table is forty-eight, and the eight say why
 * ---------------------------------------------------------------------------
 *
 * ADR-0225 publishes *the case table is 40 rows* - `PlainTime` and `PlainYearMonth` ten each,
 * `Duration` twenty for its two modes. That is the **matrix**: one row per carrier and unit. A table
 * of only those forty could not name a case for every reason this contract declares, which
 * `edge-cases.test.ts` requires in both directions - so two rows settle a bag that is not a duration,
 * four settle a bag whose counts disagree in sign, and two settle the range, which is the reason
 * that exists because *an overflow is not an inapplicability*. The forty are unchanged and the
 * record's figure is the matrix's.
 *
 * **Two of the eight settle a precedence rather than a behaviour**, which no row of the matrix can:
 * a bag can trip two reasons at once, `failureReasons` declares the order they are tested in, and
 * those two are the calls on which conforming implementations would otherwise be free to disagree.
 * One is on the carrier that drops its refused units in silence and one on the carrier that refuses
 * them loudly, which is what makes the second the language's own word on the order rather than this
 * contract's. ADR-0255, ADR-0256.
 *
 * ---------------------------------------------------------------------------
 * Where each answer comes from
 * ---------------------------------------------------------------------------
 *
 * The sixteen applied answers were measured on node v24.15.0, V8 13.6.233.17, and the two
 * out-of-range rows with them. **Every refusal is the language's, read on Chrome 152** - the
 * twenty-five of the matrix at ADR-0225 and the seven beyond it at ADR-0255 and ADR-0256, the four
 * sign rows among them. The draft `Temporal` behind `--harmony-temporal` **disagrees on
 * `PlainYearMonth`**, answering where the language throws, so no refusal here is taken from it.
 *
 * **And the sign rows are where that rule stopped being about a verdict and became about a word.**
 * The two engines agree on every verdict of this group and part on the message: the language answers
 * `RangeError: Temporal error: Duration was not valid.` where the draft answers `RangeError: Invalid
 * time value`. Nothing in this table reads a message, which is why the group could be written from
 * the draft and confirmed rather than corrected - but anything that ever does is bound to one engine
 * by writing it down. ADR-0256.
 */

import type { CaseGroup } from '../../../../packages/catalogue/identifier.js'
import type { Provenance } from '../../../../packages/catalogue/every-contract.js'
import type { AddFailureReason, DurationBag, DurationUnit } from './contract.js'

/**
 * The six questions this table answers, in the order it answers them.
 *
 * The partition is this contract's own and is frozen with its major. It divides by *the carrier a
 * reader arrived with*, because that is what somebody has in their hand when they meet the
 * behaviour - one helper over three carriers is the shape the whole contract is about.
 */
export const edgeCaseGroups: readonly CaseGroup[] = [
  {
    id: 'a-time-and-the-four-units-it-drops',
    title: 'A time, and the four units it drops',
    note:
      'The reason this contract exists. `PlainTime` is the only one of the three that loses a unit ' +
      'without a word, so a caller who wrote a day and got the same time back has no signal at all.',
  },
  {
    id: 'a-year-month-and-the-eight-it-refuses',
    title: 'A year-month, and the eight it refuses',
    note:
      'The language already throws here, and it names what is allowed rather than what was refused ' +
      '- so a caller with a bag of six units is not told which one was the problem.',
  },
  {
    id: 'a-duration-that-applies-nothing',
    title: 'A duration that applies nothing',
    note:
      'A duration whose largest non-zero unit is a calendar unit refuses all ten, nanoseconds ' +
      'included. It is the same receiver as the group below and a different answer, which is what ' +
      'makes this carrier the one whose inapplicable set depends on its own value.',
  },
  { id: 'a-duration-that-applies-seven', title: 'A duration that applies seven', note: null },
  { id: 'a-bag-that-is-not-a-duration', title: 'A bag that is not a duration', note: null },
  {
    id: 'a-bag-whose-counts-disagree-in-sign',
    title: 'A bag whose counts disagree in sign',
    note:
      'No duration has two signs, so such a bag names one for no carrier - which is why the refusal ' +
      'is decided before the carrier is consulted, and why one bag gets one answer whichever of the ' +
      'three it is handed to. A zero count carries no sign and the last row is what says so.',
  },
  {
    id: 'the-range-and-not-the-unit',
    title: 'The range, and not the unit',
    note:
      'Calls refused for the size of the answer rather than for the unit, on units the carrier ' +
      'applies perfectly well. An overflow is not an inapplicability, and a reading that confuses ' +
      'the two classes a carrier as refusing a unit it applies at every reachable magnitude.',
  },
]

export type EdgeCase = {
  readonly id: string
  /** Which of `edgeCaseGroups` this case sits under. */
  readonly group: string
  /** The carrier, by name and ISO rendering, so a row is readable without constructing anything. */
  readonly carrier: 'PlainTime' | 'PlainYearMonth' | 'Duration'
  readonly from: string
  readonly duration: DurationBag
  /** The ISO rendering of the answer, or `null` when the call is refused. */
  readonly expected: string | null
  /** What the diagnostic surface must report, and `null` exactly when the call is answered. */
  readonly reason: AddFailureReason | null
  /** Which unit the diagnostic must name, `null` where the reason is not about one. */
  readonly unit: DurationUnit | null
  readonly provenance: Provenance
  readonly rationale: string
}

/** One refused matrix row, written once because forty of them differ only in the unit. */
const refuses = (
  carrier: 'PlainTime' | 'PlainYearMonth' | 'Duration',
  from: string,
  group: string,
  id: string,
  unit: DurationUnit,
  rationale: string,
): EdgeCase => ({
  id,
  group,
  carrier,
  from,
  duration: { [unit]: 1 },
  expected: null,
  reason: 'unit-the-carrier-does-not-apply',
  unit,
  provenance: 'specified',
  rationale,
})

/** One applied matrix row. */
const applies = (
  carrier: 'PlainTime' | 'PlainYearMonth' | 'Duration',
  from: string,
  group: string,
  id: string,
  unit: DurationUnit,
  expected: string,
  rationale: string,
): EdgeCase => ({
  id,
  group,
  carrier,
  from,
  duration: { [unit]: 1 },
  expected,
  reason: null,
  unit: null,
  provenance: 'specified',
  rationale,
})

const A_TIME = '12:30:00'
const A_YEAR_MONTH = '2026-01'
const A_CALENDAR_DURATION = 'P1Y'
const A_DAY_DURATION = 'P1D'

export const edgeCases: readonly EdgeCase[] = [
  // -------------------------------------------------------------------------
  // A time, and the four units it drops
  // -------------------------------------------------------------------------
  refuses(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-refuses-a-year',
    'years',
    'The language answers 12:30:00 and says nothing. A year is the largest thing a caller can hand ' +
      'a time, so it is the row that makes the loss unmistakable.',
  ),
  refuses(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-refuses-a-month',
    'months',
    'Dropped in silence like the year, and named separately because a caller adding a month to a ' +
      'schedule reaches for this unit and not for the year.',
  ),
  refuses(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-refuses-a-week',
    'weeks',
    'The unit `PlainYearMonth` also refuses and `Duration` refuses in both modes, so this row is ' +
      'where the three carriers agree - and the only one where the language does so silently.',
  ),
  refuses(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-refuses-a-day',
    'days',
    'The canonical instance, and the one a caller meets first: a time plus a day is the same time, ' +
      'which is arithmetic nobody asked for and which no exception announces.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-an-hour',
    'hours',
    '13:30:00',
    'The first unit a time does apply, so the four above are a refusal of the unit and not of the ' +
      'carrier.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-a-minute',
    'minutes',
    '12:31:00',
    'Applied like the hour. The six applied rows are here rather than in a group of their own ' +
      'because what a reader is comparing is one carrier answering ten different ways.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-a-second',
    'seconds',
    '12:30:01',
    'Applied, and the boundary between the units a clock shows and the three sub-second ones below.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-a-millisecond',
    'milliseconds',
    '12:30:00.001',
    'Applied, and the rendering grows a fractional part - which is what `outputsAreEqual` compares, ' +
      'so an implementation re-balancing the answer fails here.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-a-microsecond',
    'microseconds',
    '12:30:00.000001',
    'Applied. Named separately from the millisecond because the two are one field in most date ' +
      'libraries and two here.',
  ),
  applies(
    'PlainTime',
    A_TIME,
    'a-time-and-the-four-units-it-drops',
    'a-time-applies-a-nanosecond',
    'nanoseconds',
    '12:30:00.000000001',
    'The smallest unit Temporal carries, applied. It is the row that pairs with the two `Duration` ' +
      'nanosecond rows below, where the same unit is refused by one mode and applied by the other.',
  ),

  // -------------------------------------------------------------------------
  // A year-month, and the eight it refuses
  // -------------------------------------------------------------------------
  applies(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-applies-a-year',
    'years',
    '2027-01',
    'One of the two it applies, and the row the language message names: *can only add years or ' +
      'months*.',
  ),
  applies(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-applies-a-month',
    'months',
    '2026-02',
    'The other. Every other unit below is refused, which is the widest inapplicable set of the three ' +
      'carriers.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-week',
    'weeks',
    'Refused by the language too, and this contract keeps the refusal while naming the unit rather ' +
      'than the two that are allowed.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-day',
    'days',
    'The row a draft engine gets wrong: `--harmony-temporal` on V8 13.6 answers 2026-01 here and ' +
      '2026-02 at thirty-one days, where the language throws at every magnitude. No refusal in this ' +
      'table is read from that engine.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-an-hour',
    'hours',
    'The first of the six time units it refuses. A caller normalising a timestamp down to its month ' +
      'reaches this one.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-minute',
    'minutes',
    'Refused. Named because a bag carrying hours and minutes must be refused for the first unit in ' +
      'the declared order, and this row is what the second one would be.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-second',
    'seconds',
    'Refused, and the unit an interval library most often hands across a boundary.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-millisecond',
    'milliseconds',
    'Refused. It is the unit a JavaScript timestamp is measured in, so a caller arriving from ' +
      '`Date` meets this row first.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-microsecond',
    'microseconds',
    'Refused, and one of the two units no `Date` ever carried.',
  ),
  refuses(
    'PlainYearMonth',
    A_YEAR_MONTH,
    'a-year-month-and-the-eight-it-refuses',
    'a-year-month-refuses-a-nanosecond',
    'nanoseconds',
    'Refused. The smallest unit against the coarsest carrier is the extreme of the matrix, and it is ' +
      'refused for the unit and never for the size.',
  ),

  // -------------------------------------------------------------------------
  // A duration that applies nothing
  // -------------------------------------------------------------------------
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-year',
    'years',
    'A duration whose largest non-zero unit is a calendar unit applies nothing, its own kind ' +
      'included.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-month',
    'months',
    'Refused. A caller adding a month to a year is asking for arithmetic the receiver will not do ' +
      'without a reference date.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-week',
    'weeks',
    'Refused, as it is on the other mode below - the only unit of the ten this carrier refuses in ' +
      'both.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-day',
    'days',
    'Refused here and applied one group down, on the same carrier. It is the sharpest of the twenty ' +
      'rows: the verdict is a property of the receiver.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-an-hour',
    'hours',
    'Refused, where the same call on a `P1D` answers P1DT1H.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-minute',
    'minutes',
    'Refused. The four time units below it are refused for the same reason and are named because a ' +
      'contract that settled only one would leave a reader guessing at the rest.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-second',
    'seconds',
    'Refused.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-millisecond',
    'milliseconds',
    'Refused.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-microsecond',
    'microseconds',
    'Refused.',
  ),
  refuses(
    'Duration',
    A_CALENDAR_DURATION,
    'a-duration-that-applies-nothing',
    'a-calendar-duration-refuses-a-nanosecond',
    'nanoseconds',
    'The owner reading that opened the whole question: `P1Y` plus one nanosecond throws while `P1D` ' +
      'plus the same nanosecond answers, which is why this carrier is settled in two modes and not ' +
      'one.',
  ),

  // -------------------------------------------------------------------------
  // A duration that applies seven
  // -------------------------------------------------------------------------
  refuses(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-refuses-a-year',
    'years',
    'Refused. Adding a year to a duration of days needs a calendar the receiver does not carry.',
  ),
  refuses(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-refuses-a-month',
    'months',
    'Refused, for the reason the year is: a month is not a fixed number of days.',
  ),
  refuses(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-refuses-a-week',
    'weeks',
    'Refused, and it is the surprising one of the three: a week *is* seven days, and the receiver ' +
      'still will not take it. The contract publishes the answer and not the reason.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-day',
    'days',
    'P2D',
    'Applied, where the calendar-mode receiver above refuses the same unit.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-an-hour',
    'hours',
    'P1DT1H',
    'Applied, and the answer keeps the hour as an hour rather than balancing it - which is what ' +
      '`outputsAreEqual` compares renderings for.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-minute',
    'minutes',
    'P1DT1M',
    'Applied.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-second',
    'seconds',
    'P1DT1S',
    'Applied.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-millisecond',
    'milliseconds',
    'P1DT0.001S',
    'Applied, and rendered as a fraction of a second rather than as its own field - the rendering a ' +
      'caller receives, which is why it is the rendering the contract compares.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-microsecond',
    'microseconds',
    'P1DT0.000001S',
    'Applied, rendered in the same fraction.',
  ),
  applies(
    'Duration',
    A_DAY_DURATION,
    'a-duration-that-applies-seven',
    'a-day-duration-applies-a-nanosecond',
    'nanoseconds',
    'P1DT0.000000001S',
    'Applied. The fortieth row of the matrix, and the one the owner reading is paired with.',
  ),

  // -------------------------------------------------------------------------
  // A bag that is not a duration
  // -------------------------------------------------------------------------
  {
    id: 'a-bag-naming-no-unit-at-all',
    group: 'a-bag-that-is-not-a-duration',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: {},
    expected: null,
    reason: 'duration-not-read',
    unit: null,
    provenance: 'specified',
    rationale:
      'An empty bag is refused before any carrier is consulted. Temporal answers the receiver ' +
      'unchanged, which reads as *nothing to do* and is indistinguishable from a bag whose fields ' +
      'were all spelled wrong.',
  },
  {
    id: 'a-bag-carrying-a-key-that-is-not-a-unit',
    group: 'a-bag-that-is-not-a-duration',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: { hours: 1, dayz: 9 } as DurationBag,
    expected: null,
    reason: 'duration-not-read',
    unit: null,
    provenance: 'specified',
    rationale:
      'The trap ADR-0216 measured: Temporal ignores an unknown field whenever one field it knows is ' +
      'present, so this answers 13:30:00 and the nine days are gone. It is `date/add@1`\'s own ' +
      'frozen phrase met a second time - a plausible value that silently drops what the caller ' +
      'asked for - and the whole bag is refused rather than the key dropped, because a caller who ' +
      'misspelled one field has no reason to trust the others.',
  },

  // -------------------------------------------------------------------------
  // A bag whose counts disagree in sign
  // -------------------------------------------------------------------------
  {
    id: 'a-bag-of-two-signs',
    group: 'a-bag-whose-counts-disagree-in-sign',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: { hours: 1, seconds: -1 },
    expected: null,
    reason: 'counts-of-two-signs',
    unit: null,
    provenance: 'specified',
    rationale:
      'Both units are ones this carrier applies, and the call is still refused - for the bag rather ' +
      'than for the carrier. The language refuses it too and calls it `RangeError: Invalid time ' +
      'value`, which is the misnomer this reason exists to keep out of the diagnostic: an ' +
      'implementation that catches the arithmetic and reports what it caught reports the range here ' +
      'and is wrong about which of two decisions the caller got wrong.',
  },
  {
    id: 'a-bag-of-two-signs-and-a-unit-the-carrier-drops',
    group: 'a-bag-whose-counts-disagree-in-sign',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: { days: 1, seconds: -1 },
    expected: null,
    reason: 'counts-of-two-signs',
    unit: null,
    provenance: 'specified',
    rationale:
      'The row that settles the precedence rather than a behaviour. This call trips two refusals - ' +
      '`days` is one of the four this carrier drops, and the counts carry two signs - and the ' +
      'contract names the bag\'s, because a bag that names no duration names none for any carrier ' +
      'while an inapplicable unit is a fact about this one. Without this row a second conforming ' +
      'implementation could answer the other reason and no case would say it was wrong.',
  },
  {
    id: 'a-year-month-refuses-two-signs-before-it-refuses-the-unit',
    group: 'a-bag-whose-counts-disagree-in-sign',
    carrier: 'PlainYearMonth',
    from: A_YEAR_MONTH,
    duration: { hours: 1, seconds: -1 },
    expected: null,
    reason: 'counts-of-two-signs',
    unit: null,
    provenance: 'specified',
    rationale:
      'The hardest confirmation of the order, and it is the language\'s own rather than this ' +
      'contract\'s. Both units are among the eight this carrier refuses, so the carrier has a loud ' +
      'refusal ready - `Can only add years or months to PlainYearMonth.` - and the language answers ' +
      '`Duration was not valid.` instead. So it reads the sign before the carrier reads the unit, on ' +
      'the one carrier where the two refusals are told apart by their own words. The row is here ' +
      'because a call two reasons could claim and the language settles is exactly what this group ' +
      'exists to publish.',
  },
  {
    id: 'a-zero-count-carries-no-sign',
    group: 'a-bag-whose-counts-disagree-in-sign',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: { hours: 0, seconds: -1 },
    expected: '12:29:59',
    reason: null,
    unit: null,
    provenance: 'specified',
    rationale:
      'The boundary of the rule above, and the reason it is written over non-zero counts. A zero ' +
      'field belongs to no sign, so this bag is the duration `-PT1S` and the call is answered. An ' +
      'implementation reading the sign of every field it finds refuses this and is refused here.',
  },

  // -------------------------------------------------------------------------
  // The range, and not the unit
  // -------------------------------------------------------------------------
  {
    id: 'a-year-month-past-the-iso-limit',
    group: 'the-range-and-not-the-unit',
    carrier: 'PlainYearMonth',
    from: A_YEAR_MONTH,
    duration: { years: 400000 },
    expected: null,
    reason: 'out-of-range',
    unit: null,
    provenance: 'specified',
    rationale:
      'A year is one of the two units this carrier applies, and this call is still refused - for ' +
      'the size of the answer. The row exists so that the two reasons cannot be collapsed: a ' +
      'reading that counted this as an inapplicability would class `years` as a unit ' +
      '`PlainYearMonth` refuses, which is false at every reachable magnitude.',
  },
  {
    id: 'a-time-past-what-a-duration-holds',
    group: 'the-range-and-not-the-unit',
    carrier: 'PlainTime',
    from: A_TIME,
    duration: { hours: 1e15 },
    expected: null,
    reason: 'out-of-range',
    unit: null,
    provenance: 'specified',
    rationale:
      'The same distinction on the carrier that cannot overflow: a `PlainTime` is cyclic, so no ' +
      'number of hours changes the range of the answer - what fails is the duration itself. The ' +
      'contract reports the range rather than the unit, because `hours` is applied here at every ' +
      'magnitude a duration can hold.',
  },
]
