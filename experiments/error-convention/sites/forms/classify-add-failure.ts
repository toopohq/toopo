/**
 * Experiment material - the failure reason of `date/add@1`, reconstructed by the caller, because
 * form A does not publish one.
 *
 * This file is the cost of form A on this contract, isolated so that it can be counted once instead
 * of being copied into every site that needs it. Writing it once is the strongest version of form A
 * available: a developer who needs a reason at two call sites factors the reconstruction out after
 * the second one, and measuring the weaker version - the same twenty-odd lines restated per site -
 * would be measuring a strawman.
 *
 * Three things are worth noticing about it, and none of them is a matter of taste.
 *
 * It restates the arithmetic. To tell a month total that cannot be represented exactly from an
 * elapsed total that cannot, the caller has to compute both totals the way the contract computes
 * them, down to the twelve months in a year and the number of milliseconds in a week. The logic the
 * registry exists to own is now in the caller's repository, unversioned, and nothing will tell this
 * file when `date/add@2` changes it.
 *
 * It invents the vocabulary. Form A's contract declares no reason type, so these six literals are
 * the caller's own guess at the contract's own list. They happen to match because this file was
 * written by reading `reference.ts`, which is not a guarantee any caller has.
 *
 * It is only correct where it is called. The final `out-of-range` is a fallback that holds only
 * because the caller has already seen `addToDate` return `null`; called on a duration that adds
 * cleanly it answers `out-of-range` for a call that succeeded. The function cannot be validated on
 * its own, which is exactly the property a contract is supposed to remove from caller code.
 */

import type { Duration } from '../../../../contracts/date/add/contract.js'

type ReconstructedReason =
  | 'invalid-date'
  | 'unknown-field'
  | 'field-not-whole'
  | 'month-total-not-exact'
  | 'elapsed-total-not-exact'
  | 'out-of-range'

const DECLARED_FIELDS = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
] as const

const valueOf = (duration: Duration, field: (typeof DECLARED_FIELDS)[number]): number =>
  duration[field] ?? 0

export const classifyAddFailure = (date: Date, duration: Duration): ReconstructedReason => {
  if (!Number.isFinite(date.getTime())) return 'invalid-date'

  const declared: readonly string[] = DECLARED_FIELDS
  if (!Object.keys(duration).every((key) => declared.includes(key))) return 'unknown-field'

  const notWhole = DECLARED_FIELDS.some(
    (field) => duration[field] !== undefined && !Number.isSafeInteger(duration[field]),
  )
  if (notWhole) return 'field-not-whole'

  const totalMonths = valueOf(duration, 'years') * 12 + valueOf(duration, 'months')
  const elapsed =
    valueOf(duration, 'weeks') * 604_800_000 +
    valueOf(duration, 'days') * 86_400_000 +
    valueOf(duration, 'hours') * 3_600_000 +
    valueOf(duration, 'minutes') * 60_000 +
    valueOf(duration, 'seconds') * 1_000 +
    valueOf(duration, 'milliseconds')

  if (!Number.isSafeInteger(totalMonths)) return 'month-total-not-exact'
  if (!Number.isSafeInteger(elapsed)) return 'elapsed-total-not-exact'

  return 'out-of-range'
}
