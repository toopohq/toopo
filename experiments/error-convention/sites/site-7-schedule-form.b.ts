/**
 * Experiment material - site 7, form B: a form that must say which part of the request to correct.
 *
 * The reason arrives with the answer, and the discriminant makes the two arms exhaustive: there is
 * no state of the returned value this function does not handle, and no branch it cannot reach.
 */

import { addToDate } from './forms/add-union.js'
import type { Duration } from '../../../contracts/date/add/contract.js'
import type { ScheduleOutcome } from './schedule-outcome.js'
import { MESSAGES } from './schedule-outcome.js'

export const schedule = (start: Date, duration: Duration): ScheduleOutcome => {
  const result = addToDate(start, duration)

  return result.ok
    ? { kind: 'scheduled', runsAt: result.date }
    : { kind: 'rejected', message: MESSAGES[result.reason] }
}
