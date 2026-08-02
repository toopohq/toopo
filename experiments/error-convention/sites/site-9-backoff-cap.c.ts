/**
 * Experiment material - site 9, form C: a retry schedule where running past the end of the
 * representable range is recoverable and every other refusal is a defect in the caller.
 *
 * The site the second call costs most and shows least. `out-of-range` is the one reason of the six
 * that is only known after the month arithmetic has run, so this is the site where asking for the
 * reason repeats the whole computation rather than the first two lines of it - and it is the site
 * where the repeat is invisible in the source, because the extra work is inside the registry.
 *
 * It is also the site where form C's unreachable branch costs nothing. The caller is not exhaustive
 * over the reasons; it tests for one and throws on the rest, and `null` falls into the rest for
 * free. The impossible state still exists in the type - it just happens to land where this site was
 * already throwing.
 */

import { addToDate, describeAddFailure } from '../../../contracts/date/add/reference.js'
import type { BackoffOutcome } from './backoff-outcome.js'
import { LAST_REPRESENTABLE } from './backoff-outcome.js'
import type { Duration } from '../../../contracts/date/add/contract.js'

export const nextAttempt = (lastAttempt: Date, backoff: Duration): BackoffOutcome => {
  const at = addToDate(lastAttempt, backoff)
  if (at !== null) return { kind: 'retry-at', at }

  const reason = describeAddFailure(lastAttempt, backoff)
  if (reason !== 'out-of-range') throw new Error(`backoff cannot be applied: ${reason}`)

  return { kind: 'capped', at: LAST_REPRESENTABLE }
}
