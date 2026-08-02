/**
 * Experiment material - site 9, form B: a retry schedule where running past the end of the
 * representable range is recoverable and every other refusal is a defect in the caller.
 */

import { addToDate } from './forms/add-union.js'
import type { BackoffOutcome } from './backoff-outcome.js'
import { LAST_REPRESENTABLE } from './backoff-outcome.js'
import type { Duration } from '../../../contracts/date/add/contract.js'

export const nextAttempt = (lastAttempt: Date, backoff: Duration): BackoffOutcome => {
  const result = addToDate(lastAttempt, backoff)
  if (result.ok) return { kind: 'retry-at', at: result.date }

  if (result.reason !== 'out-of-range') throw new Error(`backoff cannot be applied: ${result.reason}`)

  return { kind: 'capped', at: LAST_REPRESENTABLE }
}
