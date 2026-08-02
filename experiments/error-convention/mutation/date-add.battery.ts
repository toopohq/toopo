/**
 * Experiment material. The `date/add@1` mutation battery, D-01 to D-17, as data.
 *
 * Round 1's verdicts on this battery - D-07, D-08 and D-11 alive, the rest dead - are recorded in
 * each mutant's `description` as history, and are not trusted. Both columns are measured again in
 * this session with one instrument, because a verdict carried over from another session is a claim
 * about a run nobody can see.
 *
 * `D-` prefixes the ids because round 1 used `M17` for two different defects in two different
 * contracts: the bare-object memoisation of `number/parse` and `drops-milliseconds` here.
 */

import type { Battery, Edit, Mutant } from './run.ts'

// ---------------------------------------------------------------------------
// Anchors, quoted from the reference
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

const A_INVALID_DATE = `  if (!Number.isFinite(start)) return null`
const A_UNKNOWN_FIELD = `  if (!hasOnlyDeclaredFields(duration)) return null\n`
const A_TOTALS = `  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')`
const A_COMPUTE = `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)
  const result = new Date(shifted + elapsed)`
const A_FINAL = `  return Number.isFinite(result.getTime()) ? result : null`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

/** A defect that touches neither the return paths nor the failure reasons is one edit per arm. */
const shared = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  description,
  arms: { A: edits },
})

export const mutants: readonly Mutant[] = [
  {
    id: 'D-01',
    description: 'null-always: refuses every call, the implementation that is free to be safe',
    arms: {
      A: [reference(A_INVALID_DATE, `  if (Number.isFinite(start)) return null\n${A_INVALID_DATE}`)],
    },
  },
  {
    id: 'D-02',
    description: 'mutates-the-input: shifts the caller\'s own Date and hands it back',
    arms: {
      A: [
        reference(
          A_COMPUTE,
          `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)\n` +
            `  date.setTime(shifted + elapsed)\n  const result = date`,
        ),
      ],
    },
  },
  {
    id: 'D-03',
    description: 'elapsed-before-calendar: applies the two steps in the order the contract forbids',
    arms: {
      A: [
        reference(
          A_COMPUTE,
          `  const moved = start + elapsed\n` +
            `  const result = new Date(totalMonths === 0 ? moved : monthShiftedTimestamp(moved, totalMonths))`,
        ),
      ],
    },
  },
  shared(
    'D-04',
    'overflows-instead-of-clamping: 31 January plus a month lands in March, as setUTCMonth does',
    [reference(CLAMP, `  const clampedDay = shifted.getUTCDate()`)],
  ),
  shared(
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
  ),
  {
    id: 'D-06',
    description: 'months-then-years: applies the two calendar fields one after the other, clamping twice',
    arms: {
      A: [
        reference(
          `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)`,
          `  const months = valueOf(duration, 'months')\n` +
            `  const years = valueOf(duration, 'years')\n` +
            `  const afterMonths = months === 0 ? start : monthShiftedTimestamp(start, months)\n` +
            `  const shifted = years === 0 ? afterMonths : monthShiftedTimestamp(afterMonths, years * 12)`,
        ),
      ],
    },
  },
  shared(
    'D-07',
    'date-utc-two-digit-year: looks up a month length through Date.UTC, which maps years 0-99 onto ' +
      '1900-1999. Round 1: alive, and the contract publishes why - Y and 1900 + Y agree on February ' +
      'except under the century rule, and year 0 is not in the table',
    [
      reference(
        LAST_DAY,
        `const lastDayOfMonth = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()`,
      ),
    ],
  ),
  shared(
    'D-08',
    'isinteger-not-issafeinteger: accepts a field past 2^53, where the arithmetic stops being ' +
      'exact. Round 1: alive',
    [reference(WHOLE_NUMBER, `  value === undefined || Number.isInteger(value)`)],
  ),
  shared(
    'D-09',
    'accepts-unknown-fields: applies the part of the duration it understood and ignores the rest',
    [reference(A_UNKNOWN_FIELD, '')],
  ),
  shared(
    'D-10',
    'no-final-range-check: hands back an Invalid Date rather than refusing. This is the one stray ' +
      'value the contract can produce without a cast, and the audit probe for P1',
    [reference(A_FINAL, `  return result`)],
  ),
  shared(
    'D-11',
    'no-input-validity-check: drops the early rejection of an Invalid Date input. Round 1: alive, ' +
      'and equivalent by every measure - NaN reaches the final range check by every path',
    [reference(`${A_INVALID_DATE}\n\n`, '')],
  ),
  shared('D-12', 'weeks-are-five-days', [
    reference(WEEK, `const MILLISECONDS_PER_WEEK = 432_000_000`),
  ]),
  shared(
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
  ),
  {
    id: 'D-14',
    description: 'identity-on-empty-duration: returns the caller\'s own object for the neutral duration',
    arms: {
      A: [reference(A_TOTALS, `  if (Object.keys(duration).length === 0) return date\n\n${A_TOTALS}`)],
    },
  },
  shared('D-15', 'clamps-up-not-down: Math.max where the contract clamps with Math.min', [
    reference(CLAMP, `  const clampedDay = Math.max(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))`),
  ]),
  shared('D-16', 'last-day-off-by-one: asks for day 1 of the next month rather than day 0', [
    reference(`  probe.setUTCFullYear(year, monthIndex + 1, 0)`, `  probe.setUTCFullYear(year, monthIndex + 1, 1)`),
  ]),
  shared('D-17', 'drops-milliseconds: the smallest field is summed as zero', [
    reference(MILLISECONDS_FIELD, `  0`),
  ]),
]

export const battery: Battery = {
  contractPath: 'contracts/date/add',

  arms: [{ id: 'A', ref: 'main', convention: 'failure reported as null' }],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['A'], edits: [] },
  ],

  mutants,
}
