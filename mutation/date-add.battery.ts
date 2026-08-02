/**
 * The `date/add@1` battery.
 *
 * D-01 to D-21 are defects of behaviour and carry the mutation score. R-1 to R-4 are defects of
 * reason: they answer every call with the value the contract asks for and are wrong only about why
 * a refusal happened. F-1, F-2 and X-2 are probes rather than defects - they ask whether a guard can
 * reach the region it claims to cover, and whether two exports can drift apart - so they are kept
 * out of the score.
 *
 * The `D-` prefix exists because an earlier battery used `M17` for two different defects in two
 * different contracts. A mutant has one name in the whole project.
 *
 * Every arm is a git ref, so a column is exactly what a commit says it is. The battery is measured
 * under `UTC` and nothing else: D-05 replaces the UTC calendar accessors with the local ones, and
 * under any zone that is not UTC the named edge cases catch it on their own. UTC is the setting
 * where the zone-independence property is the only thing standing between this contract and a
 * defect that answers differently on two machines running the same code, which makes it the setting
 * worth pinning.
 *
 * The `reason-blind` lens reads the suite as if the diagnostic published only its presence and never
 * which reason it names. The difference between the two columns is the entire detection the reason
 * buys, isolated - which is the measurement that justifies the diagnostic existing at all.
 */

import type { Battery, Edit, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: ['reason-blind'] }

const { behavioural, onlySeenUnblinded } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const WEEK = `const MILLISECONDS_PER_WEEK = 604_800_000`

const WHOLE_NUMBER = `  value === undefined || Number.isSafeInteger(value)`

const LAST_DAY = `const lastDayOfMonth = (year: number, monthIndex: number): number => {
  const probe = new Date(0)
  probe.setUTCFullYear(year, monthIndex + 1, 0)

  return probe.getUTCDate()
}`

const MONTH_SHIFT = `  const year = shifted.getUTCFullYear()
  const targetMonth = shifted.getUTCMonth() + totalMonths
  const clampedDay = Math.min(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))

  shifted.setUTCFullYear(year, targetMonth, clampedDay)`

const CLAMP = `  const clampedDay = Math.min(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))`

const MILLISECONDS_FIELD = `  valueOf(duration, 'milliseconds')`

const ELAPSED = `const elapsedMilliseconds = (duration: Duration): number =>
  valueOf(duration, 'weeks') * MILLISECONDS_PER_WEEK +
  valueOf(duration, 'days') * MILLISECONDS_PER_DAY +
  valueOf(duration, 'hours') * MILLISECONDS_PER_HOUR +
  valueOf(duration, 'minutes') * MILLISECONDS_PER_MINUTE +
  valueOf(duration, 'seconds') * MILLISECONDS_PER_SECOND +
  valueOf(duration, 'milliseconds')`

const TOTALS = `  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')`

const BOTH_TOTALS = `${TOTALS}
  const elapsed = elapsedMilliseconds(duration)`

const SHIFT = `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)`

const COMPUTE = `${SHIFT}
  const result = new Date(shifted + elapsed)`

const INVALID_DATE = `  if (!Number.isFinite(start)) return { ok: false, reason: 'invalid-date' }`
const UNKNOWN_FIELD = `  if (!hasOnlyDeclaredFields(duration)) return { ok: false, reason: 'unknown-field' }\n`
const FINAL = `  return Number.isFinite(result.getTime())
    ? { ok: true, date: result }
    : { ok: false, reason: 'out-of-range' }`

const ANALYSE = `const analyse = (date: Date, duration: Duration): AddAnalysis => {`

const ADD_TO_DATE = `export const addToDate = (date: Date, duration: Duration): Date | null => {
  const analysis = analyse(date, duration)

  return analysis.ok ? analysis.date : null
}`

const reasonSwap = (from: string, to: string): Edit =>
  reference(`reason: '${from}' }`, `reason: '${to}' }`)

const ZONE_PROPERTY = 'has no ambient input - the answer does not depend on the process time zone'
const COUPLING_PROPERTY = 'P7 - a call fails exactly when it has a description'
const NO_INVALID_DATE = 'P1 - returns null or a valid Date, never an Invalid Date'
const CALL_HISTORY = 'has no ambient input - an answer does not depend on the calls made before it'
const DETERMINISTIC = 'is deterministic - the same call yields the same answer every time'
const CANCELS = 'P4 - an elapsed-time duration and its negation cancel exactly'
const TIME_OF_DAY = 'P5 - a calendar-only duration never changes the UTC time of day'

const NEUTRAL_DURATION =
  'P2 - the empty duration is neutral: it always answers, with the same instant in a new object'
const MILLISECOND_SHIFT = 'P3 - adding milliseconds shifts the instant by exactly that many'
const DAY_NEVER_GROWS = 'P6 - the day of the month never grows under a calendar-only duration'

/** The two named cases written to kill D-07 and D-08, pinned so that deleting one reddens here. */
const YEAR_ZERO_CASE = '0000-01-31T00:00:00.000Z + { months: 1 } -> 0000-02-29T00:00:00.000Z'
const CANCELLING_TOTAL_CASE =
  '2024-01-15T00:00:00.000Z + { years: 9007199254740992, months: -108086391056891900 } -> null'

const CLAMP_FEBRUARY = '2024-01-31T00:00:00.000Z + { months: 1 } -> 2024-02-29T00:00:00.000Z'
const CLAMP_JUNE = '2024-05-31T00:00:00.000Z + { months: 1 } -> 2024-06-30T00:00:00.000Z'
const CENTURY_RULE = '2096-02-29T00:00:00.000Z + { years: 4 } -> 2100-02-28T00:00:00.000Z'
const THIRTEEN_MONTHS = '2023-01-31T00:00:00.000Z + { years: 1, months: 1 } -> 2024-02-29T00:00:00.000Z'
const ORDER_HOURS = '2024-01-30T23:00:00.000Z + { months: 1, hours: 2 } -> 2024-03-01T01:00:00.000Z'
const ORDER_DAYS = '2024-01-30T00:00:00.000Z + { months: 1, days: 1 } -> 2024-03-01T00:00:00.000Z'
const MIXED_SIGN = '2024-01-31T00:00:00.000Z + { months: 1, days: -1 } -> 2024-02-28T00:00:00.000Z'
const WEEK_AND_DAY = '2024-02-25T00:00:00.000Z + { weeks: 1, days: 1 } -> 2024-03-04T00:00:00.000Z'
const WEEK_ACROSS_MONTHS = '2024-01-31T00:00:00.000Z + { weeks: 1 } -> 2024-02-07T00:00:00.000Z'
const EPOCH_CROSSING = '1969-12-31T23:59:59.999Z + { milliseconds: 1 } -> 1970-01-01T00:00:00.000Z'

const UNKNOWN_FIELD_VALUE = '2024-01-15T00:00:00.000Z + { day: 1 } -> null'
const UNKNOWN_FIELD_REASON = '2024-01-15T00:00:00.000Z + { day: 1 } -> unknown-field'
const UNKNOWN_MONTH_REASON = '2024-01-15T00:00:00.000Z + { month: 1 } -> unknown-field'
const UNKNOWN_BOTH_REASON = '2024-01-15T00:00:00.000Z + { days: 1, day: 1 } -> unknown-field'
const FRACTIONAL_MONTH_REASON = '2024-01-15T00:00:00.000Z + { months: 1.5 } -> field-not-whole'
const STRING_FIELD_REASON = '2024-01-15T00:00:00.000Z + { days: "1" } -> field-not-whole'
const MONTH_TOTAL_REASON = '2024-01-15T00:00:00.000Z + { years: 9007199254740991 } -> total-not-exact'
const INVALID_DATE_REASON = 'not a date + { days: 1 } -> invalid-date'
const INVALID_DATE_NEUTRAL_REASON = 'not a date + {} -> invalid-date'

// ---------------------------------------------------------------------------
// D-01 to D-17 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  behavioural(
    'D-01',
    'null-always: refuses every call, the implementation that is free to be safe',
    [
      reference(
        INVALID_DATE,
        `  if (Number.isFinite(start)) return { ok: false, reason: 'invalid-date' }\n${INVALID_DATE}`,
      ),
    ],
    killed([NEUTRAL_DURATION, MILLISECOND_SHIFT]),
  ),
  behavioural(
    'D-02',
    "mutates-the-input: shifts the caller's own Date and hands it back",
    [reference(COMPUTE, `${SHIFT}\n  date.setTime(shifted + elapsed)\n  const result = date`)],
    killed(['never mutates its arguments']),
  ),
  behavioural(
    'D-03',
    'elapsed-before-calendar: applies the two steps in the order the contract forbids',
    [
      reference(
        COMPUTE,
        `  const moved = start + elapsed\n` +
          `  const result = new Date(totalMonths === 0 ? moved : monthShiftedTimestamp(moved, totalMonths))`,
      ),
    ],
    killed([ORDER_HOURS, ORDER_DAYS, MIXED_SIGN]),
  ),
  behavioural(
    'D-04',
    'overflows-instead-of-clamping: 31 January plus a month lands in March, as setUTCMonth does',
    [reference(CLAMP, `  const clampedDay = shifted.getUTCDate()`)],
    killed([CLAMP_FEBRUARY, CLAMP_JUNE]),
  ),
  behavioural(
    'D-05',
    'local-time-methods: reads and writes the calendar of the process time zone',
    [
      reference(
        MONTH_SHIFT,
        `  const year = shifted.getFullYear()
  const targetMonth = shifted.getMonth() + totalMonths
  const clampedDay = Math.min(shifted.getDate(), lastDayOfMonth(year, targetMonth))

  shifted.setFullYear(year, targetMonth, clampedDay)`,
      ),
    ],
    // The most valuable single verdict in the repository, and the reason this battery pins its time
    // zone. Under UTC the named cases cannot see this defect at all - a local calendar and a UTC one
    // agree when they are the same calendar - and the zone-independence property is the only guard
    // left. Naming it here means a rewrite that quietly stops varying the zone reddens the battery.
    killed([ZONE_PROPERTY]),
  ),
  behavioural(
    'D-06',
    'months-then-years: applies the two calendar fields one after the other, clamping twice',
    [
      reference(
        SHIFT,
        `  const months = valueOf(duration, 'months')\n` +
          `  const years = valueOf(duration, 'years')\n` +
          `  const afterMonths = months === 0 ? start : monthShiftedTimestamp(start, months)\n` +
          `  const shifted = years === 0 ? afterMonths : monthShiftedTimestamp(afterMonths, years * 12)`,
      ),
    ],
    killed([THIRTEEN_MONTHS]),
  ),
  behavioural(
    'D-07',
    'date-utc-two-digit-year: looks up a month length through Date.UTC, which maps years 0-99 onto ' +
      '1900-1999. Y and 1900 + Y are congruent modulo four, so they agree on February everywhere ' +
      'except the century rule; year 0 is the only two-digit year where they part',
    [
      reference(
        LAST_DAY,
        `const lastDayOfMonth = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()`,
      ),
    ],
    killed([YEAR_ZERO_CASE]),
  ),
  behavioural(
    'D-08',
    'isinteger-not-issafeinteger: accepts a field past 2^53, where the arithmetic stops being exact',
    [reference(WHOLE_NUMBER, `  value === undefined || Number.isInteger(value)`)],
    killed([CANCELLING_TOTAL_CASE]),
  ),
  behavioural(
    'D-09',
    'accepts-unknown-fields: applies the part of the duration it understood and ignores the rest',
    [reference(UNKNOWN_FIELD, '')],
    killed([UNKNOWN_FIELD_VALUE, UNKNOWN_FIELD_REASON]),
  ),
  behavioural(
    'D-10',
    'no-final-range-check: hands back an Invalid Date rather than refusing. The one stray value ' +
      'this contract can produce without a cast, and the real defect P1 exists to catch',
    [reference(FINAL, `  return { ok: true, date: result }`)],
    killed([NO_INVALID_DATE]),
  ),
  onlySeenUnblinded(
    'D-11',
    'no-input-validity-check: drops the early rejection of an Invalid Date input. NaN reaches the ' +
      'final range check by every path, so the value is unchanged; only the reason moves, from ' +
      'invalid-date to out-of-range',
    [reference(`${INVALID_DATE}\n\n`, '')],
    [INVALID_DATE_REASON, INVALID_DATE_NEUTRAL_REASON],
  ),

  behavioural(
    'D-12',
    'weeks-are-five-days',
    [reference(WEEK, `const MILLISECONDS_PER_WEEK = 432_000_000`)],
    killed([WEEK_AND_DAY, WEEK_ACROSS_MONTHS]),
  ),
  behavioural(
    'D-13',
    'naive-leap-rule: year % 4 with no century rule, so 2100 gets a 29 February',
    [
      reference(
        LAST_DAY,
        `const lastDayOfMonth = (year: number, monthIndex: number): number => {
  const shiftedYear = year + Math.floor(monthIndex / 12)
  const month = ((monthIndex % 12) + 12) % 12
  const lengths = [31, shiftedYear % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  return lengths[month]
}`,
      ),
    ],
    killed([CENTURY_RULE]),
  ),
  behavioural(
    'D-14',
    "identity-on-empty-duration: returns the caller's own object for the neutral duration",
    [
      reference(
        TOTALS,
        `  if (Object.keys(duration).length === 0) return { ok: true, date }\n\n${TOTALS}`,
      ),
    ],
    killed([NEUTRAL_DURATION]),
  ),
  behavioural(
    'D-15',
    'clamps-up-not-down: Math.max where the contract clamps with Math.min',
    [
      reference(
        CLAMP,
        `  const clampedDay = Math.max(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))`,
      ),
    ],
    killed([DAY_NEVER_GROWS, CLAMP_FEBRUARY]),
  ),
  behavioural(
    'D-16',
    'last-day-off-by-one: asks for day 1 of the next month rather than day 0',
    [
      reference(
        `  probe.setUTCFullYear(year, monthIndex + 1, 0)`,
        `  probe.setUTCFullYear(year, monthIndex + 1, 1)`,
      ),
    ],
    killed([CLAMP_FEBRUARY, CLAMP_JUNE]),
  ),
  behavioural(
    'D-17',
    'drops-milliseconds: the smallest field is summed as zero',
    [reference(MILLISECONDS_FIELD, `  0`)],
    killed([MILLISECOND_SHIFT, EPOCH_CROSSING]),
  ),

  // D-18 to D-21 exist because four properties of this contract were declared applicable and had
  // never been seen red on anything but a defect that reddens everything. A property whose only
  // witness is "refuses every call" has been shown to be a test, not to be this test.
  behavioural(
    'D-18',
    'mutates-the-input-and-copies: shifts the caller\'s own Date, then returns a fresh one holding ' +
      'the same instant. D-02 hands the mutated object back, which makes the second of two ' +
      'identical calls compare the same object against itself and leaves determinism green; ' +
      'returning a copy is the shape where the second call starts from an instant the first one ' +
      'moved. Every named case survives it, because each of them calls once on a fresh Date',
    [reference(COMPUTE, `${SHIFT}\n  date.setTime(shifted + elapsed)\n  const result = new Date(date.getTime())`)],
    killed([DETERMINISTIC]),
  ),
  behavioural(
    'D-19',
    'shared-month-probe: the Date used to look up the length of a month is hoisted to module scope ' +
      'and only its month and day are set, so the year it was left at by the previous call decides ' +
      'the answer to this one. This is the analogue of the global-flag regular expression that ' +
      'witnesses the same property on `number/parse@1`: state that advances with every call, which ' +
      'is the one thing this property can see - a cache consulted first is primed by the probe ' +
      'itself and stays invisible to it, measured there as P-02 and P-19 surviving',
    [
      reference(
        LAST_DAY,
        `const monthProbe = new Date(0)

const lastDayOfMonth = (year: number, monthIndex: number): number => {
  monthProbe.setUTCMonth(monthIndex + 1, 0)

  return monthProbe.getUTCDate()
}`,
      ),
    ],
    killed([CALL_HISTORY]),
  ),
  behavioural(
    'D-20',
    'midnight-normalising: the calendar step zeroes the UTC time of day, the mistake of an ' +
      'implementation that assumes a date is a day',
    [reference(MONTH_SHIFT, `${MONTH_SHIFT}\n  shifted.setUTCHours(0, 0, 0, 0)`)],
    killed([TIME_OF_DAY]),
  ),
  behavioural(
    'D-21',
    'remainder-not-modulo: hours are normalised into days with Math.floor and %, which disagree on ' +
      'negatives - measured, Math.floor(-25 / 24) is -2 while -25 % 24 is -1, so minus twenty-five ' +
      'hours is applied as minus forty-nine. The defect is invisible to every other guard: no named ' +
      'case carries an hour field past a day, P3 draws milliseconds only, and the zone property sees ' +
      'four zones agreeing on the same wrong answer. Only the cancellation property looks at a ' +
      'duration and its negation, which is exactly where an odd function stops being one',
    [
      reference(
        ELAPSED,
        `const elapsedMilliseconds = (duration: Duration): number => {
  const hours = valueOf(duration, 'hours')
  const carriedDays = Math.floor(hours / 24)

  return (
    valueOf(duration, 'weeks') * MILLISECONDS_PER_WEEK +
    (valueOf(duration, 'days') + carriedDays) * MILLISECONDS_PER_DAY +
    (hours % 24) * MILLISECONDS_PER_HOUR +
    valueOf(duration, 'minutes') * MILLISECONDS_PER_MINUTE +
    valueOf(duration, 'seconds') * MILLISECONDS_PER_SECOND +
    valueOf(duration, 'milliseconds')
  )
}`,
      ),
    ],
    killed([CANCELS]),
  ),
  behavioural(
    'D-22',
    'remembers the last analysis and hands it back whenever the next duration carries the same ' +
      'number of fields - the memoise-last idiom with a cheap fingerprint for a key. It exists to ' +
      'separate two properties this battery had never separated: determinism and the call-history ' +
      'instance of freedom from ambient input were red on D-18 and D-19, together and on nothing ' +
      'else, so neither had been seen red on the sentence it alone makes. The zone instance is ' +
      'already separated, by D-05. The slot is written on a miss and read on a hit, so two identical ' +
      'consecutive calls agree and determinism cannot see it; a foreign call in between replaces it, ' +
      'which is exactly what the ambient-input property interleaves',
    [
      reference(
        ANALYSE,
        `let lastAnalysis: { readonly fields: number; readonly analysis: AddAnalysis } | null = null\n\n` +
          `const analyse = (date: Date, duration: Duration): AddAnalysis => {\n` +
          `  const fields = Object.keys(duration).length\n` +
          `  if (lastAnalysis !== null && lastAnalysis.fields === fields) return lastAnalysis.analysis\n\n` +
          `  const computed = analyseFully(date, duration)\n` +
          `  lastAnalysis = { fields, analysis: computed }\n\n` +
          `  return computed\n` +
          `}\n\n` +
          `const analyseFully = (date: Date, duration: Duration): AddAnalysis => {`,
      ),
    ],
    killed([CALL_HISTORY]),
  ),
]

// ---------------------------------------------------------------------------
// R-1 to R-4 - defects of reason
// ---------------------------------------------------------------------------

const reasons: readonly Mutant[] = [
  onlySeenUnblinded(
    'R-1',
    'right value, wrong reason: a field that is not a whole number is reported as out-of-range',
    [reasonSwap('field-not-whole', 'out-of-range')],
    [FRACTIONAL_MONTH_REASON, STRING_FIELD_REASON],
  ),

  onlySeenUnblinded(
    'R-2',
    'a plausible but false reason: an unknown field is reported as field-not-whole, which is what a ' +
      'developer would guess if they had to guess',
    [reasonSwap('unknown-field', 'field-not-whole')],
    [UNKNOWN_FIELD_REASON, UNKNOWN_MONTH_REASON, UNKNOWN_BOTH_REASON],
  ),

  onlySeenUnblinded(
    'R-3',
    'collapse: every reason reported as one. This is a diagnostic carrying exactly as much ' +
      'information as null, and a contract that cannot kill it has bought nothing but syntax',
    [
      reasonSwap('unknown-field', 'invalid-date'),
      reasonSwap('field-not-whole', 'invalid-date'),
      reasonSwap('total-not-exact', 'invalid-date'),
      reasonSwap('out-of-range', 'invalid-date'),
    ],
    [FRACTIONAL_MONTH_REASON, MONTH_TOTAL_REASON],
  ),

  onlySeenUnblinded(
    'R-4',
    'the pair null renders indistinguishable: invalid-date and unknown-field exchanged. Under null ' +
      'this defect has no observable consequence whatsoever',
    // Anchored on whole statements rather than on the literals. Swapping two values by two
    // substitutions would make the first edit's output an anchor for the second: measured, the naive
    // version matched twice and the instrument refused it rather than injecting half a defect.
    [
      reference(
        INVALID_DATE,
        `  if (!Number.isFinite(start)) return { ok: false, reason: 'unknown-field' }`,
      ),
      reference(
        UNKNOWN_FIELD.trimEnd(),
        `  if (!hasOnlyDeclaredFields(duration)) return { ok: false, reason: 'invalid-date' }`,
      ),
    ],
    [INVALID_DATE_REASON, INVALID_DATE_NEUTRAL_REASON, UNKNOWN_FIELD_REASON, UNKNOWN_MONTH_REASON, UNKNOWN_BOTH_REASON],
  ),

]

// ---------------------------------------------------------------------------
// Probes - questions about the shape of the contract, kept out of the score
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-1',
    'returns an Invalid Date on the neutral duration - the same defect as D-10, moved off the ' +
      'representable-range boundary and onto an input the generators were assumed to draw. It ' +
      'separates "P1 cannot see this" from "P1 was never given the chance", and it answered the ' +
      'second: P1 stayed green on it until the neutral duration became a branch that is drawn',
    [
      reference(
        FINAL,
        `  if (totalMonths === 0 && elapsed === 0) return { ok: true, date: new Date(Number.NaN) }\n\n${FINAL}`,
      ),
    ],
    killed([NO_INVALID_DATE]),
  ),
  probe(
    UNDER,
    'F-2',
    'returns an Invalid Date for every call. The control that separates "P1 cannot fail" from ' +
      '"P1 was never reached": if F-2 does not redden P1, the property is decorative; if it does, ' +
      'the property is sound and its generators are the defect',
    [reference(FINAL, `  return { ok: true, date: new Date(Number.NaN) }`)],
    killed([NO_INVALID_DATE]),
  ),
  probe(
    UNDER,
    'X-2',
    'the two exports written independently, and drifting. `addToDate` gets its own arithmetic - ' +
      'the obvious shape when the answering path is optimised and the diagnostic one is left alone ' +
      '- and `analyse`, which now only `describeAddFailure` reaches, acquires a rule that a week ' +
      'cannot be combined with a calendar unit. Every entry of both tables still answers correctly ' +
      'on both exports, because no named case carries weeks and months at once; only the coupling ' +
      'property can see it',
    [
      // The guard is injected before `addToDate` is rewritten. The independent implementation names
      // its locals differently, so neither edit can turn the other's anchor ambiguous - the
      // instrument would refuse rather than inject half a defect.
      reference(
        BOTH_TOTALS,
        `${BOTH_TOTALS}\n\n` +
          `  if (totalMonths !== 0 && valueOf(duration, 'weeks') !== 0) {\n` +
          `    return { ok: false, reason: 'field-not-whole' }\n` +
          `  }`,
      ),
      reference(
        ADD_TO_DATE,
        `export const addToDate = (date: Date, duration: Duration): Date | null => {
  const start = date.getTime()
  if (!Number.isFinite(start)) return null

  if (!hasOnlyDeclaredFields(duration)) return null
  if (!DECLARED_FIELDS.every((field) => isExactWholeNumber(duration[field]))) return null

  const months = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const ms = elapsedMilliseconds(duration)
  if (!Number.isSafeInteger(months) || !Number.isSafeInteger(ms)) return null

  const result = new Date((months === 0 ? start : monthShiftedTimestamp(start, months)) + ms)

  return Number.isFinite(result.getTime()) ? result : null
}`,
      ),
    ],
    killed([COUPLING_PROPERTY]),
  ),
]

export const battery: Battery = {
  name: 'date-add',
  contractPath: 'contracts/date/add',
  timeZone: 'UTC',
  calibrationMutant: 'D-01',

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
    {
      /**
       * One edit rather than several, because the contract names a reason in exactly one place:
       * `addToDate` still answers `Date | null`, so no property and no equality function ever sees
       * one. Blinded, the suite still requires a refused call to have a description and no longer
       * requires it to be the right one - which is exactly as much sight as the bare `null`
       * convention had.
       */
      id: 'reason-blind',
      description:
        'the diagnostic read as if only its presence were published, never which reason it names',
      arms: ['C'],
      edits: [
        {
          file: 'edge-cases.test.ts',
          find: '  expect(describeAddFailure(new Date(date), duration as Duration)).toBe(reason)',
          replace:
            '  expect(describeAddFailure(new Date(date), duration as Duration) === null).toBe(\n' +
            '    reason === null,\n' +
            '  )',
        },
      ],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the two tables, ' +
        'the profile list, the application order or the static analysis requirements.',
      titles: [
        'names a case for every declared reason, and declares every reason it names',
        'settles each call exactly once across both tables',
        'publishes a rationale for every decision',
        'writes every expected instant in a form that survives a round trip',
        'declares a non-empty sample set for every profile',
        'keeps the inapplicable universal properties declared as such',
        'the declared application order covers every duration field exactly once',
        'publishes a reason for every static analysis requirement',
      ],
    },
    {
      reason:
        'over the harness rather than over the implementation: these establish that the runtime ' +
        'honours `process.env.TZ` and that the zone property puts it back. No defect injected into ' +
        '`reference.ts` can change either answer, which is exactly why they are the support the zone ' +
        'property rests on rather than part of what it measures.',
      titles: [
        'the declared time zones take effect in this runtime',
        'the declared time zones do not all agree with each other',
        'has left the ambient time zone exactly as it found it',
        'restores both a zone that was set and a zone that was absent',
      ],
    },
    {
      lenses: ['reason-blind'],
      reason:
        'the `described` twins of the ten refusals below, silent on this column and only on it. ' +
        'Blinded, the suite requires a refused call to have a description and no longer requires it ' +
        'to be the right one, so R-1 to R-4 - the only mutants that reddened these - stop being ' +
        'visible. That is the lens working rather than a gap, and those cells are part of the ' +
        'five-defect difference this battery reports between its two columns.',
      titles: [
        '2024-01-15T00:00:00.000Z + { months: 1.5 } -> field-not-whole',
        '2024-01-15T00:00:00.000Z + { days: 0.5 } -> field-not-whole',
        '2024-01-15T00:00:00.000Z + { days: NaN } -> field-not-whole',
        '2024-01-15T00:00:00.000Z + { days: Infinity } -> field-not-whole',
        '2024-01-15T00:00:00.000Z + { days: 1e+21 } -> field-not-whole',
        '2024-01-15T00:00:00.000Z + { years: 9007199254740991 } -> total-not-exact',
        '2024-01-15T00:00:00.000Z + { milliseconds: 9007199254740991, seconds: 9007199254740991 } -> total-not-exact',
        '2024-01-15T00:00:00.000Z + { days: "1" } -> field-not-whole',
        'not a date + { days: 1 } -> invalid-date',
        'not a date + {} -> invalid-date',
      ],
    },
  ],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'block 4.2 has no defect in this battery. These five are reachable - `array/group-by@1` ' +
        'carries S-1 to S-8 and every one of them reddens the equivalent guard there - so what is ' +
        'missing is a signature mutant, not a better guard.',
      titles: [
        'matches the type declared by the contract',
        'accepts a Date and a Duration, and nothing else',
        'returns a Date that may be absent, never an Invalid Date',
        'leaves every duration field optional',
        'publishes the diagnostic surface with the type the contract declares',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the refusal cases of block 4.4, on the value rather than on the reason. No mutant of this ' +
        'battery makes the function *accept* a duration it must refuse - D-08 weakens the field ' +
        'guard and the total guard catches every one of these behind it, which the table already ' +
        'records - so the region is unprobed on the value channel. Their `described` twins are red ' +
        'on R-1 to R-4, and every one of these publishes a decision a caller reads whether or not a ' +
        'mutant ever violates it. What is missing is a mutant that accepts a refusal, not a case.',
      titles: [
        '2024-01-15T00:00:00.000Z + { months: 1.5 } -> null',
        '2024-01-15T00:00:00.000Z + { days: 0.5 } -> null',
        '2024-01-15T00:00:00.000Z + { days: NaN } -> null',
        '2024-01-15T00:00:00.000Z + { days: Infinity } -> null',
        '2024-01-15T00:00:00.000Z + { days: 1e+21 } -> null',
        '2024-01-15T00:00:00.000Z + { years: 9007199254740991 } -> null',
        '2024-01-15T00:00:00.000Z + { milliseconds: 9007199254740991, seconds: 9007199254740991 } -> null',
        '2024-01-15T00:00:00.000Z + { days: "1" } -> null',
        'not a date + { days: 1 } -> null',
        'not a date + {} -> null',
      ],
    },
  ],

  mutants: [...behaviour, ...reasons, ...probes],
}
