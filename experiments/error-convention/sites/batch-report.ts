/**
 * Experiment material - what site 8 produces, declared once so that the three forms return exactly
 * the same thing.
 *
 * The tally is keyed by `string` rather than by a reason type, because the three forms do not agree
 * on where that type lives: form B declares it in its return value, form C declares it beside, and
 * form A has no such type at all and has to invent one in the caller. Keying on `string` is the only
 * shape all three can produce without one of them borrowing another's declaration, which would make
 * the comparison a comparison of imports.
 */

import type { Duration } from '../../../contracts/date/add/contract.js'

export type ScheduleRow = {
  readonly start: Date
  readonly duration: Duration
}

export type BatchReport = {
  readonly scheduled: readonly Date[]
  readonly refusedByReason: ReadonlyMap<string, number>
}
