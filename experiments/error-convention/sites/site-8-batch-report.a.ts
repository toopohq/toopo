/**
 * Experiment material - site 8, form A: many rows scheduled at once, with the refusals tallied by
 * reason for an operator who has to decide whether the batch is worth rerunning.
 *
 * This is the site that pays form A's cost per failing row rather than once: every refusal runs the
 * caller's own reconstruction of the contract's arithmetic.
 */

import { addToDate } from './forms/add-null.js'
import { classifyAddFailure } from './forms/classify-add-failure.js'
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

    const reason = classifyAddFailure(start, duration)
    refusedByReason.set(reason, (refusedByReason.get(reason) ?? 0) + 1)
  }

  return { scheduled, refusedByReason }
}
