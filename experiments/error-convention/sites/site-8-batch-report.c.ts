/**
 * Experiment material - site 8, form C: many rows scheduled at once, with the refusals tallied by
 * reason.
 *
 * Two calls per refused row, one per accepted one. This is the site where form C's second call is
 * paid at the rate of the batch's failure count rather than once, and it is the reason this
 * measurement exists: on `number/parse@1` the repeated work was a regular expression, and here it is
 * the whole analysis the first call already performed.
 */

import { addToDate, describeAddFailure } from '../../../contracts/date/add/reference.js'
import type { BatchReport, ScheduleRow } from './batch-report.js'

export const reportOn = (rows: readonly ScheduleRow[]): BatchReport => {
  const scheduled: Date[] = []
  const refusedByReason = new Map<string, number>()

  for (const { start, duration } of rows) {
    const runsAt = addToDate(start, duration)

    if (runsAt !== null) {
      scheduled.push(runsAt)
      continue
    }

    const reason = describeAddFailure(start, duration)
    if (reason === null) throw new Error('unreachable: a refused call with no description')

    refusedByReason.set(reason, (refusedByReason.get(reason) ?? 0) + 1)
  }

  return { scheduled, refusedByReason }
}
