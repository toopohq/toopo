/**
 * Experiment material - site 7, form C: a form that must say which part of the request to correct.
 *
 * The reason is asked for, on the failing path only, and the registry answers it rather than the
 * caller reconstructing it. That is the whole of what this form buys over A on this site.
 *
 * It also shows what it costs. `describeAddFailure` returns `AddFailureReason | null`, and the
 * `null` is unreachable here - `addToDate` has already refused, and the contract promises the two
 * agree. The type system does not know that promise, so the branch has to be written and can only
 * be written as a throw. Form B has no such branch, because its discriminant makes the impossible
 * state unrepresentable rather than merely untaken.
 */

import { addToDate, describeAddFailure } from '../../../contracts/date/add/reference.js'
import type { Duration } from '../../../contracts/date/add/contract.js'
import type { ScheduleOutcome } from './schedule-outcome.js'
import { MESSAGES } from './schedule-outcome.js'

export const schedule = (start: Date, duration: Duration): ScheduleOutcome => {
  const runsAt = addToDate(start, duration)
  if (runsAt !== null) return { kind: 'scheduled', runsAt }

  const reason = describeAddFailure(start, duration)
  if (reason === null) throw new Error('unreachable: a refused call with no description')

  return { kind: 'rejected', message: MESSAGES[reason] }
}
