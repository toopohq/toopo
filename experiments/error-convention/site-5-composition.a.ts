/**
 * Experiment material - site 5, convention A: two registry features composed, the result of
 * `number/parse` feeding `date/add`. Both report failure the same way, so the site reads one idiom.
 */

import { addToDate } from '../../contracts/date/add/reference.js'
import type { ExpiryOutcome } from './expiry-outcome.js'
import { parseNumber } from './convention-a.js'

export const expiryFrom = (issued: Date, retentionDays: string): ExpiryOutcome => {
  const days = parseNumber(retentionDays)
  if (days === null) return { kind: 'unreadable-retention' }

  const expiry = addToDate(issued, { days })
  if (expiry === null) return { kind: 'out-of-range' }

  return { kind: 'ok', date: expiry }
}
