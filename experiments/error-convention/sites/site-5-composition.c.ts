/**
 * Experiment material - site 5, form C: two registry features composed, the result of
 * `number/parse` feeding `date/add`.
 *
 * The site has to say which of the two stages refused, and that is stage identity rather than a
 * reason: the caller already knows which call it was standing at. Both stages answer `null`, so the
 * site reads one idiom and asks nothing about why. Character for character the A form.
 */

import { addToDate } from './forms/add-null.js'
import type { ExpiryOutcome } from './expiry-outcome.js'
import { parseNumber } from '../../../contracts/number/parse/reference.js'

export const expiryFrom = (issued: Date, retentionDays: string): ExpiryOutcome => {
  const days = parseNumber(retentionDays)
  if (days === null) return { kind: 'unreadable-retention' }

  const expiry = addToDate(issued, { days })
  if (expiry === null) return { kind: 'out-of-range' }

  return { kind: 'ok', date: expiry }
}
