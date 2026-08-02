/**
 * Experiment material - site 8, form B: many rows scheduled at once, with the refusals tallied by
 * reason.
 *
 * One call per row, whatever the row does. The tally reads the reason straight out of the value the
 * call already returned.
 */

import { addToDate } from './forms/add-union.js'
import type { BatchReport, ScheduleRow } from './batch-report.js'

export const reportOn = (rows: readonly ScheduleRow[]): BatchReport => {
  const scheduled: Date[] = []
  const refusedByReason = new Map<string, number>()

  for (const { start, duration } of rows) {
    const result = addToDate(start, duration)

    if (result.ok) {
      scheduled.push(result.date)
      continue
    }

    refusedByReason.set(result.reason, (refusedByReason.get(result.reason) ?? 0) + 1)
  }

  return { scheduled, refusedByReason }
}
