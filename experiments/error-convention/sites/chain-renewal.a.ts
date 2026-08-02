/**
 * Experiment material - the four-link chain, form A: every stage reports failure as `null`.
 *
 * parse the trial length, add it, parse the grace period, add that. An empty grace field means no
 * grace period rather than a mistake, which is the one place in the chain that needs to tell two
 * failures apart rather than only which stage refused.
 */

import { addToDate } from './forms/add-null.js'
import { parseNumber } from './forms/parse-null.js'
import type { RenewalOutcome } from './renewal-outcome.js'

export const renewalDate = (
  signedUpAt: Date,
  trialDays: string,
  graceDays: string,
): RenewalOutcome => {
  const trial = parseNumber(trialDays)
  if (trial === null) return { kind: 'unreadable-trial' }

  const trialEnds = addToDate(signedUpAt, { days: trial })
  if (trialEnds === null) return { kind: 'trial-out-of-range' }

  const grace = parseNumber(graceDays)
  if (grace === null && graceDays.trim() !== '') return { kind: 'unreadable-grace' }

  const renewsAt = addToDate(trialEnds, { days: grace ?? 0 })
  if (renewsAt === null) return { kind: 'grace-out-of-range' }

  return { kind: 'ok', renewsAt }
}
