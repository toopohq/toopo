/**
 * The `date/add@1` battery.
 *
 * D-01 to D-17 are defects of behaviour and carry the mutation score. R-1 to R-4 are defects of
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
 */

import type { Battery, Edit, Expectation, Mutant } from './run.ts'

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

const TOTALS = `  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')`

const SHIFT = `  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)`

const COMPUTE = `${SHIFT}
  const result = new Date(shifted + elapsed)`

const INVALID_DATE = `  if (!Number.isFinite(start)) return null`
const UNKNOWN_FIELD = `  if (!hasOnlyDeclaredFields(duration)) return null\n`
const FINAL = `  return Number.isFinite(result.getTime()) ? result : null`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

const ZONE_PROPERTY = 'has no ambient input - the answer does not depend on the process time zone'

const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

const survived: Expectation = { verdict: 'survived' }
const notApplicable: Expectation = { verdict: 'not-applicable' }

/** A defect the bare `null` arm cannot carry, because it is about the reason reported. */
const reasonDefect = (id: string, description: string): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: {},
  expected: { 'A/as-committed': notApplicable },
})

// ---------------------------------------------------------------------------
// D-01 to D-17 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  {
    id: 'D-01',
    kind: 'defect',
    description: 'null-always: refuses every call, the implementation that is free to be safe',
    arms: { A: [reference(INVALID_DATE, `  if (Number.isFinite(start)) return null\n${INVALID_DATE}`)] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-02',
    kind: 'defect',
    description: "mutates-the-input: shifts the caller's own Date and hands it back",
    arms: {
      A: [reference(COMPUTE, `${SHIFT}\n  date.setTime(shifted + elapsed)\n  const result = date`)],
    },
    expected: { 'A/as-committed': killed(['never mutates its arguments']) },
  },
  {
    id: 'D-03',
    kind: 'defect',
    description: 'elapsed-before-calendar: applies the two steps in the order the contract forbids',
    arms: {
      A: [
        reference(
          COMPUTE,
          `  const moved = start + elapsed\n` +
            `  const result = new Date(totalMonths === 0 ? moved : monthShiftedTimestamp(moved, totalMonths))`,
        ),
      ],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-04',
    kind: 'defect',
    description:
      'overflows-instead-of-clamping: 31 January plus a month lands in March, as setUTCMonth does',
    arms: { A: [reference(CLAMP, `  const clampedDay = shifted.getUTCDate()`)] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-05',
    kind: 'defect',
    description: 'local-time-methods: reads and writes the calendar of the process time zone',
    arms: {
      A: [
        reference(
          MONTH_SHIFT,
          `  const year = shifted.getFullYear()
  const targetMonth = shifted.getMonth() + totalMonths
  const clampedDay = Math.min(shifted.getDate(), lastDayOfMonth(year, targetMonth))

  shifted.setFullYear(year, targetMonth, clampedDay)`,
        ),
      ],
    },
    // The most valuable single verdict in the repository, and the reason this battery pins its time
    // zone. Under UTC the named cases cannot see this defect at all - a local calendar and a UTC one
    // agree when they are the same calendar - and the zone-independence property is the only guard
    // left. Naming it here means a rewrite that quietly stops varying the zone reddens the battery.
    expected: { 'A/as-committed': killed([ZONE_PROPERTY]) },
  },
  {
    id: 'D-06',
    kind: 'defect',
    description:
      'months-then-years: applies the two calendar fields one after the other, clamping twice',
    arms: {
      A: [
        reference(
          SHIFT,
          `  const months = valueOf(duration, 'months')\n` +
            `  const years = valueOf(duration, 'years')\n` +
            `  const afterMonths = months === 0 ? start : monthShiftedTimestamp(start, months)\n` +
            `  const shifted = years === 0 ? afterMonths : monthShiftedTimestamp(afterMonths, years * 12)`,
        ),
      ],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-07',
    kind: 'defect',
    description:
      'date-utc-two-digit-year: looks up a month length through Date.UTC, which maps years 0-99 ' +
      'onto 1900-1999. Y and 1900 + Y are congruent modulo four, so they agree on February ' +
      'everywhere except the century rule; year 0 is the only two-digit year where they part',
    arms: {
      A: [
        reference(
          LAST_DAY,
          `const lastDayOfMonth = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()`,
        ),
      ],
    },
    expected: { 'A/as-committed': survived },
  },
  {
    id: 'D-08',
    kind: 'defect',
    description:
      'isinteger-not-issafeinteger: accepts a field past 2^53, where the arithmetic stops being exact',
    arms: { A: [reference(WHOLE_NUMBER, `  value === undefined || Number.isInteger(value)`)] },
    expected: { 'A/as-committed': survived },
  },
  {
    id: 'D-09',
    kind: 'defect',
    description:
      'accepts-unknown-fields: applies the part of the duration it understood and ignores the rest',
    arms: { A: [reference(UNKNOWN_FIELD, '')] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-10',
    kind: 'defect',
    description:
      'no-final-range-check: hands back an Invalid Date rather than refusing. The one stray value ' +
      'this contract can produce without a cast',
    arms: { A: [reference(FINAL, `  return result`)] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-11',
    kind: 'defect',
    description:
      'no-input-validity-check: drops the early rejection of an Invalid Date input. NaN reaches the ' +
      'final range check by every path, so under `null` alone this defect changes no answer',
    arms: { A: [reference(`${INVALID_DATE}\n\n`, '')] },
    expected: { 'A/as-committed': survived },
  },
  {
    id: 'D-12',
    kind: 'defect',
    description: 'weeks-are-five-days',
    arms: { A: [reference(WEEK, `const MILLISECONDS_PER_WEEK = 432_000_000`)] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-13',
    kind: 'defect',
    description: 'naive-leap-rule: year % 4 with no century rule, so 2100 gets a 29 February',
    arms: {
      A: [
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
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-14',
    kind: 'defect',
    description: "identity-on-empty-duration: returns the caller's own object for the neutral duration",
    arms: {
      A: [reference(TOTALS, `  if (Object.keys(duration).length === 0) return date\n\n${TOTALS}`)],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-15',
    kind: 'defect',
    description: 'clamps-up-not-down: Math.max where the contract clamps with Math.min',
    arms: {
      A: [
        reference(
          CLAMP,
          `  const clampedDay = Math.max(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))`,
        ),
      ],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-16',
    kind: 'defect',
    description: 'last-day-off-by-one: asks for day 1 of the next month rather than day 0',
    arms: {
      A: [
        reference(
          `  probe.setUTCFullYear(year, monthIndex + 1, 0)`,
          `  probe.setUTCFullYear(year, monthIndex + 1, 1)`,
        ),
      ],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'D-17',
    kind: 'defect',
    description: 'drops-milliseconds: the smallest field is summed as zero',
    arms: { A: [reference(MILLISECONDS_FIELD, `  0`)] },
    expected: { 'A/as-committed': killed() },
  },
]

// ---------------------------------------------------------------------------
// R-1 to R-4 - defects of reason
//
// None of them can be written against this arm. That is the measurement rather than an omission: a
// form with no reason has nowhere to put a wrong one, so a defect that reports one cannot exist here.
// ---------------------------------------------------------------------------

const reasons: readonly Mutant[] = [
  reasonDefect(
    'R-1',
    'right value, wrong reason: a field that is not a whole number is reported as out-of-range',
  ),
  reasonDefect(
    'R-2',
    'a plausible but false reason: an unknown field is reported as field-not-whole, which is what a ' +
      'developer would guess if they had to guess',
  ),
  reasonDefect(
    'R-3',
    'collapse: every reason reported as one. This is a diagnostic carrying exactly as much ' +
      'information as null, and a contract that cannot kill it has bought nothing but syntax',
  ),
  reasonDefect(
    'R-4',
    'the pair null renders indistinguishable: invalid-date and unknown-field exchanged. Under null ' +
      'this defect has no observable consequence whatsoever',
  ),
]

// ---------------------------------------------------------------------------
// Probes - questions about the shape of the contract, kept out of the score
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  {
    id: 'F-1',
    kind: 'probe',
    description:
      'returns an Invalid Date on the neutral duration - the same defect as D-10, moved off the ' +
      'representable-range boundary and onto an input the generators were assumed to draw',
    arms: {
      A: [
        reference(FINAL, `  if (totalMonths === 0 && elapsed === 0) return new Date(Number.NaN)\n\n${FINAL}`),
      ],
    },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'F-2',
    kind: 'probe',
    description:
      'returns an Invalid Date for every call. The control that separates "P1 cannot fail" from ' +
      '"P1 was never reached": if F-2 does not redden P1, the property is decorative; if it does, ' +
      'the property is sound and its generators are the defect',
    arms: { A: [reference(FINAL, `  return new Date(Number.NaN)`)] },
    expected: { 'A/as-committed': killed() },
  },
  {
    id: 'X-2',
    kind: 'probe',
    description:
      'the two exports written independently, and drifting. Not expressible here: this arm has one ' +
      'export, so there is nothing for it to drift from',
    arms: {},
    expected: { 'A/as-committed': notApplicable },
  },
]

export const battery: Battery = {
  name: 'date-add',
  contractPath: 'contracts/date/add',
  timeZone: 'UTC',
  calibrationMutant: 'D-01',

  arms: [{ id: 'A', ref: 'HEAD', convention: 'failure reported as null, with no diagnostic' }],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['A'],
      edits: [],
    },
  ],

  mutants: [...behaviour, ...reasons, ...probes],
}
