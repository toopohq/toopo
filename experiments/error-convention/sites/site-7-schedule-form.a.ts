/**
 * Experiment material - site 7, form A: a form that must say which part of the request to correct.
 *
 * `null` carries no reason, so the reason is rebuilt in the caller. The rebuilding lives in
 * `forms/classify-add-failure.ts`, shared with site 9 rather than restated here, which is the
 * strongest version of this form: it is what a developer does after needing the reason twice.
 */

import { addToDate } from './forms/add-null.js'
import { classifyAddFailure } from './forms/classify-add-failure.js'
import type { Duration } from '../../../contracts/date/add/contract.js'
import type { ScheduleOutcome } from './schedule-outcome.js'
import { MESSAGES } from './schedule-outcome.js'

export const schedule = (start: Date, duration: Duration): ScheduleOutcome => {
  const runsAt = addToDate(start, duration)
  if (runsAt !== null) return { kind: 'scheduled', runsAt }

  return { kind: 'rejected', message: MESSAGES[classifyAddFailure(start, duration)] }
}
