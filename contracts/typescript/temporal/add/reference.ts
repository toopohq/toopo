// SPDX-License-Identifier: MIT-0

/**
 * The reference implementation of contract `temporal/add@1`.
 *
 * It is the only one of the seven files that is a detail: anything satisfying the other six may
 * replace it. What it is written for is readability against block 4.4 — every branch below is one
 * the case table names.
 *
 * **It runs on a runtime carrying `Temporal` and on no other.** `contract.ts` declares that in
 * `requiresOfTheRuntime`, the client refuses to install it elsewhere, and this file names the global
 * directly rather than guarding for it: a helper that silently did nothing without `Temporal` would
 * be the exact failure this contract exists to refuse, one level up.
 */

import type { AddFailure, DurationBag, DurationUnit } from './contract.js'
import { durationUnits } from './contract.js'

/** Which carrier this is, read off the tag rather than by `instanceof`, so a second realm agrees. */
const carrierKind = (carrier: unknown): 'PlainTime' | 'PlainYearMonth' | 'Duration' | null => {
  const tag = (carrier as { readonly [Symbol.toStringTag]?: unknown })?.[Symbol.toStringTag]

  return tag === 'Temporal.PlainTime' || tag === 'Temporal.PlainYearMonth' || tag === 'Temporal.Duration'
    ? (tag.slice('Temporal.'.length) as 'PlainTime' | 'PlainYearMonth' | 'Duration')
    : null
}

/** The four date units, which a `PlainTime` has nowhere to put. */
const THE_DATE_UNITS: readonly DurationUnit[] = ['years', 'months', 'weeks', 'days']

/** The three calendar units, which a `Duration` refuses whatever its own shape. */
const THE_CALENDAR_UNITS: readonly DurationUnit[] = ['years', 'months', 'weeks']

/** The two a `PlainYearMonth` applies; it refuses the other eight. */
const THE_YEAR_MONTH_UNITS: readonly DurationUnit[] = ['years', 'months']

/**
 * A duration whose largest non-zero unit is a calendar unit applies nothing at all.
 *
 * Non-zero rather than declared: ADR-0225 measured that `{years: 0, days: 1}` and `{weeks: 0, days: 5}`
 * both sit in the mode that applies seven, so the mode is decided by what the value carries and not
 * by which fields were written.
 */
const isCalendarMode = (duration: Temporal.Duration): boolean =>
  duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0

/** Which units this carrier will not apply, for this carrier's own value. */
const whatTheCarrierWillNotApply = (
  carrier: Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration,
): readonly DurationUnit[] => {
  const kind = carrierKind(carrier)

  if (kind === 'PlainTime') return THE_DATE_UNITS
  if (kind === 'PlainYearMonth') {
    return durationUnits.filter((unit) => !THE_YEAR_MONTH_UNITS.includes(unit))
  }

  return isCalendarMode(carrier as Temporal.Duration) ? durationUnits : THE_CALENDAR_UNITS
}

/**
 * The units a bag names, and whether it names anything this contract can read.
 *
 * A key outside the ten makes the whole bag unreadable rather than being dropped, which is the
 * repair: ADR-0216 measured that Temporal ignores an unknown field whenever one field it knows is
 * present, so `{days: 1, dayz: 9}` is answered as though the second had not been written.
 */
const unitsNamedBy = (duration: DurationBag): readonly DurationUnit[] | null => {
  if (typeof duration !== 'object' || duration === null) return null

  const keys = Object.keys(duration)
  if (keys.some((key) => !(durationUnits as readonly string[]).includes(key))) return null

  const named = durationUnits.filter((unit) => duration[unit] !== undefined)

  return named.length === 0 ? null : named
}

/**
 * Whether the counts a bag names disagree in sign, which is the second refusal decided before any
 * carrier is consulted.
 *
 * `> 0` and `< 0` rather than a sign function, because the rule is written over the *non-zero*
 * counts: a zero field belongs to no sign and neither does `-0`, so `{hours: 0, seconds: -1}` is the
 * duration `-PT1S` and is answered. A count that is not a number satisfies neither test and falls
 * through to the range, which is where this implementation already sent it.
 */
const countsDisagreeInSign = (
  duration: DurationBag,
  named: readonly DurationUnit[],
): boolean => {
  const counts = named.map((unit) => duration[unit] as number)

  return counts.some((count) => count > 0) && counts.some((count) => count < 0)
}

/**
 * Why this call cannot be answered, or `null` when it can.
 *
 * **The order is `failureReasons`' own**, which the contract declares as the precedence rather than
 * leaving it to an implementation: the two refusals that read the bag alone come first — a bag whose
 * keys are not units, then one whose counts disagree in sign — then the first unit the carrier will
 * not apply, first in the declared order of `durationUnits` so that two implementations refusing one
 * bag name one unit, and the range last, because it is the only reason that needs the arithmetic to
 * have been attempted.
 *
 * **The `catch` below takes no binding, and that is the whole of why the order had to be the
 * repair.** It reads neither the class of what was thrown nor its message: it classes on the *fact*
 * that something threw, which is sound exactly while the range is the only thing left to throw for.
 * A disagreement of signs throws here too, and throws a `RangeError`, so reading the class would not
 * have separated them either — and reading the message would have bound this file to one engine's
 * wording, the draft and the language disagreeing on it. So until the sign was decided ahead of the
 * arithmetic, this reported the range on a bag every unit of which the carrier applies.
 * ADR-0255, ADR-0256.
 */
export const describeAddFailure = (
  carrier: Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration,
  duration: DurationBag,
): AddFailure | null => {
  const named = unitsNamedBy(duration)
  if (named === null) return { reason: 'duration-not-read', unit: null }

  if (countsDisagreeInSign(duration, named)) return { reason: 'counts-of-two-signs', unit: null }

  const willNotApply = whatTheCarrierWillNotApply(carrier)
  const refused = named.find((unit) => willNotApply.includes(unit))
  if (refused !== undefined) return { reason: 'unit-the-carrier-does-not-apply', unit: refused }

  try {
    carrier.add(duration as Temporal.DurationLike)
  } catch {
    return { reason: 'out-of-range', unit: null }
  }

  return null
}

/**
 * Add a duration to a Temporal carrier, refusing a unit the carrier does not apply.
 *
 * Both exports consult one private check, so the coupling of block 4.2 cannot be violated here —
 * which is not a reason to drop the property, because the contract governs every implementation
 * including one that validates on the fast path and forgets to on the diagnostic one.
 */
export const add = <T extends Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration>(
  carrier: T,
  duration: DurationBag,
): T | null =>
  describeAddFailure(carrier, duration) === null
    ? (carrier.add(duration as Temporal.DurationLike) as T)
    : null
