/**
 * Experiment material, and a verbatim copy of `main:contracts/date/add/reference.ts`. This folder
 * exists only on `experiment/error-convention-round-3` and disappears with it; nothing here is a
 * contract, an implementation or a registry test.
 *
 * date/add@1 as `main` reports it: failure is `null` and nothing more. This branch's own copy of the
 * contract carries the third form, so the bare `null` arm has to come from the commit that still
 * holds it.
 *
 * Copied rather than imported because no import reaches across a git ref, and rewritten by hand it
 * would stop being the arm this experiment compares.
 */

/**
 * Reference implementation of `date/add@1`.
 *
 * It is the oracle of the registry's differential test, so it is written to be read: correctness and
 * obviousness come before speed.
 *
 * The signature is written out here rather than imported from `contract.ts`. Annotating this
 * function with the contract's own type would make the compiler enforce conformance at authoring
 * time and leave `signature.test-d.ts` unable to fail - a guard that proves nothing. An
 * implementation states its signature independently, and the contract checks it.
 *
 * Every accessor below belongs to the `getUTC*` / `setUTC*` family. The local-time family reads and
 * writes the calendar of whichever time zone the process happens to run in, which would make this
 * function answer differently on two machines running the same code. Block 4.3 tests that by running
 * the function under four time zones at once, and the validation pipeline forbids the local methods
 * lexically.
 *
 * PROVISIONAL: `null` marks failure. The catalogue-wide error convention is still undecided.
 */

type Duration = {
  readonly years?: number | undefined
  readonly months?: number | undefined
  readonly weeks?: number | undefined
  readonly days?: number | undefined
  readonly hours?: number | undefined
  readonly minutes?: number | undefined
  readonly seconds?: number | undefined
  readonly milliseconds?: number | undefined
}

type DurationField = keyof Duration

const DECLARED_FIELDS: readonly DurationField[] = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
]

const MILLISECONDS_PER_WEEK = 604_800_000
const MILLISECONDS_PER_DAY = 86_400_000
const MILLISECONDS_PER_HOUR = 3_600_000
const MILLISECONDS_PER_MINUTE = 60_000
const MILLISECONDS_PER_SECOND = 1_000

/** An absent field and a field explicitly set to `undefined` both mean zero. */
const valueOf = (duration: Duration, field: DurationField): number => duration[field] ?? 0

const isExactWholeNumber = (value: number | undefined): boolean =>
  value === undefined || Number.isSafeInteger(value)

const hasOnlyDeclaredFields = (duration: Duration): boolean =>
  Object.keys(duration).every((key) => (DECLARED_FIELDS as readonly string[]).includes(key))

/**
 * The length of a month, found by asking for day zero of the one after it.
 *
 * Built with `setUTCFullYear` rather than `Date.UTC`, because `Date.UTC` maps years 0 to 99 onto
 * 1900 to 1999 - `Date.UTC(50, 0, 1)` is 1950-01-01 - and February is exactly the month whose length
 * that mapping can get wrong.
 */
const lastDayOfMonth = (year: number, monthIndex: number): number => {
  const probe = new Date(0)
  probe.setUTCFullYear(year, monthIndex + 1, 0)

  return probe.getUTCDate()
}

/**
 * The calendar step: the month total is applied to the UTC year and month at once, and a day the
 * target month does not have is clamped down to the last one it does. `setUTCFullYear` accepts a
 * month index outside 0-11 and carries it into the year, so no year arithmetic is needed here, and
 * it leaves the time of day untouched.
 */
const monthShiftedTimestamp = (start: number, totalMonths: number): number => {
  const shifted = new Date(start)
  const year = shifted.getUTCFullYear()
  const targetMonth = shifted.getUTCMonth() + totalMonths
  const clampedDay = Math.min(shifted.getUTCDate(), lastDayOfMonth(year, targetMonth))

  shifted.setUTCFullYear(year, targetMonth, clampedDay)

  return shifted.getTime()
}

const elapsedMilliseconds = (duration: Duration): number =>
  valueOf(duration, 'weeks') * MILLISECONDS_PER_WEEK +
  valueOf(duration, 'days') * MILLISECONDS_PER_DAY +
  valueOf(duration, 'hours') * MILLISECONDS_PER_HOUR +
  valueOf(duration, 'minutes') * MILLISECONDS_PER_MINUTE +
  valueOf(duration, 'seconds') * MILLISECONDS_PER_SECOND +
  valueOf(duration, 'milliseconds')

export const addToDate = (date: Date, duration: Duration): Date | null => {
  // Measured redundant and kept deliberately: NaN propagates through every path below, so deleting
  // this line changes no answer on any input tried, including 200 000 random draws. The contract
  // declares that an invalid date is rejected, and the reference states that where a reader looks
  // for it rather than leaving it to emerge from the arithmetic three steps later.
  const start = date.getTime()
  if (!Number.isFinite(start)) return null

  if (!hasOnlyDeclaredFields(duration)) return null
  if (!DECLARED_FIELDS.every((field) => isExactWholeNumber(duration[field]))) return null

  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const elapsed = elapsedMilliseconds(duration)

  // Each field is a safe integer on its own, but a total need not be, and past 2^53 these sums round
  // instead of adding. Rejecting there keeps every answer exact; the widest shift it costs is one
  // spanning the whole representable range, which no caller can want more than approximately.
  if (!Number.isSafeInteger(totalMonths) || !Number.isSafeInteger(elapsed)) return null

  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)
  const result = new Date(shifted + elapsed)

  return Number.isFinite(result.getTime()) ? result : null
}
