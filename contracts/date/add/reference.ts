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
 * PROVISIONAL: failure is reported as a discriminated union carrying a reason. The catalogue-wide
 * error convention is still undecided.
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

/**
 * The result type is written out here rather than imported from `contract.ts`, for the same reason
 * the signature is: a reference that borrows the contract's own types cannot fail the conformance
 * check the contract performs on it.
 */
type AddToDateResult =
  | { readonly ok: true; readonly date: Date }
  | {
      readonly ok: false
      readonly reason:
        | 'invalid-date'
        | 'unknown-field'
        | 'field-not-whole'
        | 'month-total-not-exact'
        | 'elapsed-total-not-exact'
        | 'out-of-range'
    }

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

export const addToDate = (date: Date, duration: Duration): AddToDateResult => {
  // No longer measured redundant. Under `null` this line changed no answer on any input tried,
  // including 200 000 random draws, because NaN propagates to the final range check by every path.
  // It now decides between two different answers: an unparsed input is `invalid-date`, and the range
  // check would call it `out-of-range`.
  const start = date.getTime()
  if (!Number.isFinite(start)) return { ok: false, reason: 'invalid-date' }

  if (!hasOnlyDeclaredFields(duration)) return { ok: false, reason: 'unknown-field' }
  if (!DECLARED_FIELDS.every((field) => isExactWholeNumber(duration[field]))) {
    return { ok: false, reason: 'field-not-whole' }
  }

  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const elapsed = elapsedMilliseconds(duration)

  // Each field is a safe integer on its own, but a total need not be, and past 2^53 these sums round
  // instead of adding. Rejecting there keeps every answer exact; the widest shift it costs is one
  // spanning the whole representable range, which no caller can want more than approximately.
  //
  // One test under `null`, two here. The rejection is identical - no input changes side - but a
  // caller who overflowed the month total and one who overflowed the elapsed total wrote different
  // fields, and the convention now has room to say which.
  if (!Number.isSafeInteger(totalMonths)) return { ok: false, reason: 'month-total-not-exact' }
  if (!Number.isSafeInteger(elapsed)) return { ok: false, reason: 'elapsed-total-not-exact' }

  const shifted = totalMonths === 0 ? start : monthShiftedTimestamp(start, totalMonths)
  const result = new Date(shifted + elapsed)

  return Number.isFinite(result.getTime())
    ? { ok: true, date: result }
    : { ok: false, reason: 'out-of-range' }
}
