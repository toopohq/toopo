/**
 * Experiment material - the four-link chain, form B: every stage reports failure as a discriminated
 * union carrying a reason. Both contracts are under the union here, which is the regime round 1
 * never measured - its only composition site had one stage under each convention.
 */

import { addToDate } from '../../../contracts/date/add/reference.js'
import { parseNumber } from './forms/parse-union.js'
import type { RenewalOutcome } from './renewal-outcome.js'

export const renewalDate = (
  signedUpAt: Date,
  trialDays: string,
  graceDays: string,
): RenewalOutcome => {
  const trial = parseNumber(trialDays)
  if (!trial.ok) return { kind: 'unreadable-trial' }

  const trialEnds = addToDate(signedUpAt, { days: trial.value })
  if (!trialEnds.ok) return { kind: 'trial-out-of-range' }

  const grace = parseNumber(graceDays)
  if (!grace.ok && grace.reason !== 'empty') return { kind: 'unreadable-grace' }

  const renewsAt = addToDate(trialEnds.date, { days: grace.ok ? grace.value : 0 })
  if (!renewsAt.ok) return { kind: 'grace-out-of-range' }

  return { kind: 'ok', renewsAt: renewsAt.date }
}
