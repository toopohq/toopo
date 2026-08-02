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
 *
 * The `reason-blind` lens reads the suite as if the diagnostic published only its presence and never
 * which reason it names. The difference between the two columns is the entire detection the reason
 * buys, isolated - which is the measurement that justifies the diagnostic existing at all.
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

const ADD_TO_DATE = `export const addToDate = (date: Date, duration: Duration): Date | null => {
  const analysis = analyse(date, duration)

  return analysis.ok ? analysis.date : null
}`

const reference = (find: string, replace: string): Edit => ({ file: 'reference.ts', find, replace })

const reasonSwap = (from: string, to: string): Edit =>
  reference(`reason: '${from}' }`, `reason: '${to}' }`)

const ZONE_PROPERTY = 'has no ambient input - the answer does not depend on the process time zone'
const COUPLING_PROPERTY = 'P7 - a call fails exactly when it has a description'
const NO_INVALID_DATE = 'P1 - returns null or a valid Date, never an Invalid Date'

/** The two named cases written to kill D-07 and D-08, pinned so that deleting one reddens here. */
const YEAR_ZERO_CASE = '0000-01-31T00:00:00.000Z + { months: 1 } -> 0000-02-29T00:00:00.000Z'
const CANCELLING_TOTAL_CASE =
  '2024-01-15T00:00:00.000Z + { years: 9007199254740992, months: -108086391056891900 } -> null'

const killed = (by?: readonly string[]): Expectation =>
  by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by }

const survived: Expectation = { verdict: 'survived' }

/** A defect that is not about the reason: both lenses see it, and see it the same way. */
const behavioural = (
  id: string,
  description: string,
  edits: readonly Edit[],
  expected: Expectation,
): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: { C: edits },
  expected: { 'C/as-committed': expected, 'C/reason-blind': expected },
})

/**
 * A defect of reason. Every one of them answers every call with the value the contract asks for, so
 * the blinded column is what the bare `null` convention would have seen: nothing.
 */
const reasonDefect = (id: string, description: string, edits: readonly Edit[]): Mutant => ({
  id,
  kind: 'defect',
  description,
  arms: { C: edits },
  expected: { 'C/as-committed': killed(), 'C/reason-blind': survived },
})

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
    killed(),
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
    killed(),
  ),
  behavioural(
    'D-04',
    'overflows-instead-of-clamping: 31 January plus a month lands in March, as setUTCMonth does',
    [reference(CLAMP, `  const clampedDay = shifted.getUTCDate()`)],
    killed(),
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
    killed(),
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
    killed(),
  ),
  behavioural(
    'D-10',
    'no-final-range-check: hands back an Invalid Date rather than refusing. The one stray value ' +
      'this contract can produce without a cast, and the real defect P1 exists to catch',
    [reference(FINAL, `  return { ok: true, date: result }`)],
    killed([NO_INVALID_DATE]),
  ),
  {
    id: 'D-11',
    kind: 'defect',
    description:
      'no-input-validity-check: drops the early rejection of an Invalid Date input. NaN reaches the ' +
      'final range check by every path, so the value is unchanged; only the reason moves, from ' +
      'invalid-date to out-of-range',
    arms: { C: [reference(`${INVALID_DATE}\n\n`, '')] },
    expected: { 'C/as-committed': killed(), 'C/reason-blind': survived },
  },
  behavioural(
    'D-12',
    'weeks-are-five-days',
    [reference(WEEK, `const MILLISECONDS_PER_WEEK = 432_000_000`)],
    killed(),
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
    killed(),
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
    killed(),
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
    killed(),
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
    killed(),
  ),
  behavioural(
    'D-17',
    'drops-milliseconds: the smallest field is summed as zero',
    [reference(MILLISECONDS_FIELD, `  0`)],
    killed(),
  ),
]

// ---------------------------------------------------------------------------
// R-1 to R-4 - defects of reason
// ---------------------------------------------------------------------------

const reasons: readonly Mutant[] = [
  reasonDefect(
    'R-1',
    'right value, wrong reason: a field that is not a whole number is reported as out-of-range',
    [reasonSwap('field-not-whole', 'out-of-range')],
  ),
  reasonDefect(
    'R-2',
    'a plausible but false reason: an unknown field is reported as field-not-whole, which is what a ' +
      'developer would guess if they had to guess',
    [reasonSwap('unknown-field', 'field-not-whole')],
  ),
  reasonDefect(
    'R-3',
    'collapse: every reason reported as one. This is a diagnostic carrying exactly as much ' +
      'information as null, and a contract that cannot kill it has bought nothing but syntax',
    [
      reasonSwap('unknown-field', 'invalid-date'),
      reasonSwap('field-not-whole', 'invalid-date'),
      reasonSwap('total-not-exact', 'invalid-date'),
      reasonSwap('out-of-range', 'invalid-date'),
    ],
  ),
  reasonDefect(
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
      'representable-range boundary and onto an input the generators were assumed to draw. It ' +
      'separates "P1 cannot see this" from "P1 was never given the chance", and it answered the ' +
      'second: P1 stayed green on it until the neutral duration became a branch that is drawn',
    arms: {
      C: [
        reference(
          FINAL,
          `  if (totalMonths === 0 && elapsed === 0) return { ok: true, date: new Date(Number.NaN) }\n\n${FINAL}`,
        ),
      ],
    },
    expected: {
      'C/as-committed': killed([NO_INVALID_DATE]),
      'C/reason-blind': killed([NO_INVALID_DATE]),
    },
  },
  {
    id: 'F-2',
    kind: 'probe',
    description:
      'returns an Invalid Date for every call. The control that separates "P1 cannot fail" from ' +
      '"P1 was never reached": if F-2 does not redden P1, the property is decorative; if it does, ' +
      'the property is sound and its generators are the defect',
    arms: { C: [reference(FINAL, `  return { ok: true, date: new Date(Number.NaN) }`)] },
    expected: {
      'C/as-committed': killed([NO_INVALID_DATE]),
      'C/reason-blind': killed([NO_INVALID_DATE]),
    },
  },
  {
    id: 'X-2',
    kind: 'probe',
    description:
      'the two exports written independently, and drifting. `addToDate` gets its own arithmetic - ' +
      'the obvious shape when the answering path is optimised and the diagnostic one is left alone ' +
      '- and `analyse`, which now only `describeAddFailure` reaches, acquires a rule that a week ' +
      'cannot be combined with a calendar unit. Every entry of both tables still answers correctly ' +
      'on both exports, because no named case carries weeks and months at once; only the coupling ' +
      'property can see it',
    arms: {
      C: [
        // The guard is injected before `addToDate` is rewritten. The independent implementation
        // names its locals differently, so neither edit can turn the other's anchor ambiguous - the
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
    },
    expected: {
      'C/as-committed': killed([COUPLING_PROPERTY]),
      'C/reason-blind': killed([COUPLING_PROPERTY]),
    },
  },
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

  mutants: [...behaviour, ...reasons, ...probes],
}
