/**
 * Experiment material - site 9, form A: a retry schedule where running past the end of the
 * representable range is recoverable and every other refusal is a defect in the caller.
 *
 * The reason is load-bearing rather than informational here: capping on `out-of-range` is right, and
 * capping on `field-not-whole` would hide a bug behind a plausible date.
 */

import { addToDate } from './forms/add-null.js'
import { classifyAddFailure } from './forms/classify-add-failure.js'
import type { BackoffOutcome } from './backoff-outcome.js'
import { LAST_REPRESENTABLE } from './backoff-outcome.js'
import type { Duration } from '../../../contracts/date/add/contract.js'

export const nextAttempt = (lastAttempt: Date, backoff: Duration): BackoffOutcome => {
  const at = addToDate(lastAttempt, backoff)
  if (at !== null) return { kind: 'retry-at', at }

  const reason = classifyAddFailure(lastAttempt, backoff)
  if (reason !== 'out-of-range') throw new Error(`backoff cannot be applied: ${reason}`)

  return { kind: 'capped', at: LAST_REPRESENTABLE }
}
