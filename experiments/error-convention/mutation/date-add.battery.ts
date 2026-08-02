/**
 * Experiment material. The `date/add@1` mutation battery, D-01 to D-17, plus the four reason
 * mutants R-1 to R-4, as data.
 *
 * Round 1's verdicts on the D battery - D-07, D-08 and D-11 alive, the rest dead - are recorded in
 * each mutant's `description` as history, and are not trusted. Both columns are measured again in
 * this session with one instrument, because a verdict carried over from another session is a claim
 * about a run nobody can see.
 *
 * `D-` prefixes the ids because round 1 used `M17` for two different defects in two different
 * contracts: the bare-object memoisation of `number/parse` and `drops-milliseconds` here.
 *
 * The R mutants exist only on the union arm. That is the measurement, not an omission: `null` has
 * nowhere to put a wrong reason, so a defect that reports one cannot be written against it.
 */

import type { Battery, Edit, Mutant } from './run.ts'

// ---------------------------------------------------------------------------
// Anchors. Most of the reference is untouched by the convention - the helpers, the clamp, the month
// length - so most defects are one edit that applies to both arms.
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

const TOTALS = `  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')`

const SHIFT = `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)`

const COMPUTE = `${SHIFT}
  const result = new Date(shifted + elapsed)`

// The four places where the two arms genuinely differ.
const A_INVALID_DATE = `  if (!Number.isFinite(start)) return null`
const A_UNKNOWN_FIELD = `  if (!hasOnlyDeclaredFields(duration)) return null\n`
const A_FINAL = `  return Number.isFinite(result.getTime()) ? result : null`

const B_INVALID_DATE = `  if (!Number.isFinite(start)) return { ok: false, reason: 'invalid-date' }`
const B_UNKNOWN_FIELD = `  if (!hasOnlyDeclaredFields(duration)) return { ok: false, reason: 'unknown-field' }\n`
const B_FINAL = `  return Number.isFinite(result.getTime())
    ? { ok: true, date: result }
    : { ok: false, reason: 'out-of-range' }`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

/** A defect that touches neither return path is one edit applied to both arms. */
const shared = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  description,
  arms: { A: edits, B: edits },
})

/** A defect that only the union can carry, because it is about the reason reported. */
const reasonOnly = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  description,
  arms: { B: edits },
})

const reasonSwap = (from: string, to: string): Edit =>
  reference(`reason: '${from}' }`, `reason: '${to}' }`)

// ---------------------------------------------------------------------------
// D-01 to D-17 - defects of behaviour
// ---------------------------------------------------------------------------

export const mutants: readonly Mutant[] = [
  {
    id: 'D-01',
    description: 'null-always: refuses every call, the implementation that is free to be safe',
    arms: {
      A: [reference(A_INVALID_DATE, `  if (Number.isFinite(start)) return null\n${A_INVALID_DATE}`)],
      B: [
        reference(
          B_INVALID_DATE,
          `  if (Number.isFinite(start)) return { ok: false, reason: 'invalid-date' }\n${B_INVALID_DATE}`,
        ),
      ],
    },
  },
  {
    id: 'D-02',
    description: "mutates-the-input: shifts the caller's own Date and hands it back",
    arms: {
      A: [reference(COMPUTE, `${SHIFT}\n  date.setTime(shifted + elapsed)\n  const result = date`)],
      B: [reference(COMPUTE, `${SHIFT}\n  date.setTime(shifted + elapsed)\n  const result = date`)],
    },
  },
  shared(
    'D-03',
    'elapsed-before-calendar: applies the two steps in the order the contract forbids',
    [
      reference(
        COMPUTE,
        `  const moved = start + elapsed\n` +
          `  const result = new Date(totalMonths === 0 ? moved : monthShiftedTimestamp(moved, totalMonths))`,
      ),
    ],
  ),
  shared(
    'D-04',
    'overflows-instead-of-clamping: 31 January plus a month lands in March, as setUTCMonth does',
    [reference(CLAMP, `  const clampedDay = shifted.getUTCDate()`)],
  ),
  shared('D-05', 'local-time-methods: reads and writes the calendar of the process time zone', [
    reference(
      MONTH_SHIFT,
      `  const year = shifted.getFullYear()
  const targetMonth = shifted.getMonth() + totalMonths
  const clampedDay = Math.min(shifted.getDate(), lastDayOfMonth(year, targetMonth))

  shifted.setFullYear(year, targetMonth, clampedDay)`,
    ),
  ]),
  shared(
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
  ),
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
  {
    id: 'D-09',
    description:
      'accepts-unknown-fields: applies the part of the duration it understood and ignores the rest',
    arms: { A: [reference(A_UNKNOWN_FIELD, '')], B: [reference(B_UNKNOWN_FIELD, '')] },
  },
  {
    id: 'D-10',
    description:
      'no-final-range-check: hands back an Invalid Date rather than refusing. The one stray value ' +
      'this contract can produce without a cast',
    arms: {
      A: [reference(A_FINAL, `  return result`)],
      B: [reference(B_FINAL, `  return { ok: true, date: result }`)],
    },
  },
  {
    id: 'D-11',
    description:
      'no-input-validity-check: drops the early rejection of an Invalid Date input. Round 1: alive ' +
      'and equivalent by every measure - NaN reaches the final range check by every path. Under the ' +
      'union that equivalence should break, because the call then comes back out-of-range rather ' +
      'than invalid-date',
    arms: {
      A: [reference(`${A_INVALID_DATE}\n\n`, '')],
      B: [reference(`${B_INVALID_DATE}\n\n`, '')],
    },
  },
  shared('D-12', 'weeks-are-five-days', [
    reference(WEEK, `const MILLISECONDS_PER_WEEK = 432_000_000`),
  ]),
  shared('D-13', 'naive-leap-rule: year % 4 with no century rule, so 2100 gets a 29 February', [
    reference(
      LAST_DAY,
      `const lastDayOfMonth = (year: number, monthIndex: number): number => {
  const shiftedYear = year + Math.floor(monthIndex / 12)
  const month = ((monthIndex % 12) + 12) % 12
  const lengths = [31, shiftedYear % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  return lengths[month]
}`,
    ),
  ]),
  {
    id: 'D-14',
    description:
      "identity-on-empty-duration: returns the caller's own object for the neutral duration",
    arms: {
      A: [reference(TOTALS, `  if (Object.keys(duration).length === 0) return date\n\n${TOTALS}`)],
      B: [
        reference(
          TOTALS,
          `  if (Object.keys(duration).length === 0) return { ok: true, date }\n\n${TOTALS}`,
        ),
      ],
    },
  },
  shared('D-15', 'clamps-up-not-down: Math.max where the contract clamps with Math.min', [
    reference(
      CLAMP,
      `  const clampedDay = Math.max(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))`,
    ),
  ]),
  shared('D-16', 'last-day-off-by-one: asks for day 1 of the next month rather than day 0', [
    reference(
      `  probe.setUTCFullYear(year, monthIndex + 1, 0)`,
      `  probe.setUTCFullYear(year, monthIndex + 1, 1)`,
    ),
  ]),
  shared('D-17', 'drops-milliseconds: the smallest field is summed as zero', [
    reference(MILLISECONDS_FIELD, `  0`),
  ]),

  // -------------------------------------------------------------------------
  // R-1 to R-4 - defects of reason. Every one of them answers every call with the
  // value the contract asks for; only the reason is wrong.
  // -------------------------------------------------------------------------

  reasonOnly(
    'R-1',
    'right value, wrong reason: a field that is not a whole number is reported as out-of-range',
    [reasonSwap('field-not-whole', 'out-of-range')],
  ),
  reasonOnly(
    'R-2',
    'a plausible but false reason: an unknown field is reported as field-not-whole, which is what a ' +
      'developer would guess if they had to guess',
    [reasonSwap('unknown-field', 'field-not-whole')],
  ),
  reasonOnly(
    'R-3',
    'collapse: all six reasons reported as one. This is the union carrying exactly as much ' +
      'information as null, and a contract that cannot kill it has bought nothing but syntax',
    [
      reasonSwap('unknown-field', 'invalid-date'),
      reasonSwap('field-not-whole', 'invalid-date'),
      reasonSwap('month-total-not-exact', 'invalid-date'),
      reasonSwap('elapsed-total-not-exact', 'invalid-date'),
      reasonSwap('out-of-range', 'invalid-date'),
    ],
  ),
  reasonOnly(
    'R-4',
    'the pair null renders indistinguishable: invalid-date and unknown-field exchanged. Under null ' +
      'this defect has no observable consequence whatsoever',
    // Anchored on the whole statement rather than on the literal. Swapping two values by two
    // substitutions makes the first edit's output an anchor for the second: measured, the naive
    // version matched twice and the instrument refused it rather than injecting half a defect.
    [
      reference(B_INVALID_DATE, `  if (!Number.isFinite(start)) return { ok: false, reason: 'unknown-field' }`),
      reference(
        B_UNKNOWN_FIELD.trimEnd(),
        `  if (!hasOnlyDeclaredFields(duration)) return { ok: false, reason: 'invalid-date' }`,
      ),
    ],
  ),
]

// ---------------------------------------------------------------------------
// Arms and lenses
// ---------------------------------------------------------------------------

export const battery: Battery = {
  contractPath: 'contracts/date/add',

  arms: [
    { id: 'A', ref: 'main', convention: 'failure reported as null' },
    { id: 'B', ref: 'HEAD', convention: 'failure reported as a discriminated union carrying a reason' },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it - reason-aware on the union arm',
      arms: ['A', 'B'],
      edits: [],
    },
    {
      id: 'reason-blind',
      description:
        'the union arm read as if the reason were not there: two failures compare equal whatever ' +
        'they carry. The difference between this column and the one before it is the entire ' +
        'detection the reason buys, isolated.',
      arms: ['B'],
      edits: [
        {
          file: 'contract.ts',
          find: `    : a.ok === false && b.ok === false && a.reason === b.reason`,
          replace: `    : a.ok === false && b.ok === false`,
        },
        {
          file: 'properties.test.ts',
          find: '  result.ok === true ? `at ${result.date.getTime()}` : `refused: ${result.reason}`',
          replace: "  result.ok === true ? `at ${result.date.getTime()}` : 'refused'",
        },
      ],
    },
  ],

  mutants,
}
