/**
 * Experiment material - the four-link chain, form C: every stage answers `null`, and the reason is
 * published beside the return channel for the one link that needs it.
 *
 * `date/add` is used through its null arm with no diagnostic surface at all. That is the form and
 * not a shortcut: three of the four links need to know only which stage refused, and stage identity
 * is something the caller already has - it is standing at the call. Only the grace field has to
 * tell two failures apart, and only there is a reason asked for.
 */

import { addToDate } from './forms/add-null.js'
import { describeFailure, parseNumber } from '../../../contracts/number/parse/reference.js'
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
  if (grace === null && describeFailure(graceDays) !== 'empty') return { kind: 'unreadable-grace' }

  const renewsAt = addToDate(trialEnds, { days: grace ?? 0 })
  if (renewsAt === null) return { kind: 'grace-out-of-range' }

  return { kind: 'ok', renewsAt }
}
