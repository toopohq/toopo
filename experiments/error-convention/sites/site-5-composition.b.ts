/**
 * Experiment material - site 5, convention B: two registry features composed, the result of
 * `number/parse` feeding `date/add`.
 *
 * This is the state a catalogue is in while a convention is being rolled out, and it is worth
 * measuring rather than assuming: `number/parse` reports a union and `date/add` still reports
 * `null`, so one function reads two different failure idioms four lines apart.
 */

import { addToDate } from './forms/add-null.js'
import type { ExpiryOutcome } from './expiry-outcome.js'
import { parseNumber } from './forms/parse-union.js'

export const expiryFrom = (issued: Date, retentionDays: string): ExpiryOutcome => {
  const days = parseNumber(retentionDays)
  if (!days.ok) return { kind: 'unreadable-retention' }

  const expiry = addToDate(issued, { days: days.value })
  if (expiry === null) return { kind: 'out-of-range' }

  return { kind: 'ok', date: expiry }
}
