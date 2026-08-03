import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../catalogue/every-contract.js'
import type { Duration } from './contract.js'
import {
  ambientProbeInstants,
  ambientTimeZoneProbes,
  applicationOrder,
  durationFields,
  outputsAreEqual,
  propertyRuns,
  staticAnalysisRequirements,
  universalProperties,
} from './contract.js'
import { addToDate, describeAddFailure } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * The generators matter as much as the assertions. Uniformly drawn instants almost never land on
 * the 29th, 30th or 31st of a month, so a suite built on them would never exercise the clamp - the
 * single decision this contract is most about. The arbitraries below concentrate there on purpose.
 *
 * Half of what follows is liveness rather than safety, and that is deliberate. Measured on
 * `number/parse@1`, an implementation returning `null` for every input satisfies every safety
 * property a contract can state - it never returns a bad value, it is invariant, it is
 * deterministic - because forbidding wrong answers is free for a function that gives none. At least
 * one property here must force an answer out.
 */

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Built with `setUTC*` so that the generator itself cannot import the local calendar it is testing. */
const utcInstant = (
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
  millisecond: number,
): Date => {
  const instant = new Date(0)
  instant.setUTCFullYear(year, monthIndex, day)
  instant.setUTCHours(hour, minute, 0, millisecond)

  return instant
}

/** Days chosen to sit on the ends of months, where clamping either happens or just fails to. */
const clampProneDate = fc
  .tuple(
    fc.integer({ min: 1700, max: 2400 }),
    fc.integer({ min: 0, max: 11 }),
    fc.constantFrom(1, 15, 28, 29, 30, 31),
    fc.constantFrom(0, 12, 23),
    fc.constantFrom(0, 30, 59),
    fc.constantFrom(0, 1, 999),
  )
  .map((parts) => utcInstant(...parts))

const spreadDate = fc.date({
  min: new Date(Date.UTC(1700, 0, 1)),
  max: new Date(Date.UTC(2400, 0, 1)),
  noInvalidDate: true,
})

const anyDate = fc.oneof(
  { weight: 3, arbitrary: clampProneDate },
  { weight: 1, arbitrary: spreadDate },
)

const calendarFields = {
  years: fc.integer({ min: -5, max: 5 }),
  months: fc.integer({ min: -30, max: 30 }),
}

const elapsedFields = {
  weeks: fc.integer({ min: -10, max: 10 }),
  days: fc.integer({ min: -60, max: 60 }),
  hours: fc.integer({ min: -48, max: 48 }),
  minutes: fc.integer({ min: -120, max: 120 }),
  seconds: fc.integer({ min: -120, max: 120 }),
  milliseconds: fc.integer({ min: -5_000, max: 5_000 }),
}

/** `requiredKeys: []` makes every field independently present or absent, as the type declares. */
const anyDuration: fc.Arbitrary<Duration> = fc.record(
  { ...calendarFields, ...elapsedFields },
  { requiredKeys: [] },
)

/**
 * The support P1 needs, and the reason it is a second pair of arbitraries rather than a widening of
 * the ones above.
 *
 * P1 forbids an Invalid Date from ever being returned. It is a safety property: true everywhere, so
 * its support should be everywhere. `anyDate` is not everywhere. Measured, it spans at most 1.36e13
 * ms from the epoch and the widest duration the arbitraries can draw is about 1.14e10 ms and 90
 * months, while the range a `Date` can hold ends at 8.64e15 - so no draw could leave the range, by
 * arithmetic rather than by luck, and the only region where P1 can fail was unreachable. The probe
 * that proved it is in the battery: F-2 returns an Invalid Date for every call and P1 reddens, so
 * the property is sound; F-1 returns one only on the neutral duration and P1 stayed green, because
 * the neutral duration came out of `anyDuration` about once in two hundred thousand draws - measured
 * - and the properties run a thousand.
 *
 * P2 to P6 keep `anyDate` on purpose. They are liveness properties: each one requires an answer, and
 * a date at the edge of the range legitimately has none, so widening their support would make them
 * fail on a correct implementation. Widening everything would have broken five properties to repair
 * one.
 */
const REPRESENTABLE_RANGE_MS = 8_640_000_000_000_000

const boundaryDate = fc.oneof(
  { weight: 2, arbitrary: fc.constantFrom(REPRESENTABLE_RANGE_MS, -REPRESENTABLE_RANGE_MS) },
  {
    weight: 3,
    arbitrary: fc
      .tuple(fc.constantFrom(1, -1), fc.integer({ min: 0, max: 7 * 86_400_000 }))
      .map(([side, inwards]) => side * (REPRESENTABLE_RANGE_MS - inwards)),
  },
  {
    weight: 1,
    arbitrary: fc.integer({ min: -REPRESENTABLE_RANGE_MS, max: REPRESENTABLE_RANGE_MS }),
  },
).map((timestamp) => new Date(timestamp))

/** Wider than `anyDate`, and a superset of it: P1 must still see everything it saw before. */
const anyRepresentableDate = fc.oneof(
  { weight: 3, arbitrary: anyDate },
  { weight: 2, arbitrary: boundaryDate },
)

/**
 * The neutral duration as a branch that is drawn rather than one that is hoped for. It is the input
 * F-1 corrupts, and leaving it to the chance that eight independent optional fields are all absent
 * put it out of reach of any run this contract declares.
 */
const anyDurationOrNeutral: fc.Arbitrary<Duration> = fc.oneof(
  { weight: 6, arbitrary: anyDuration },
  { weight: 1, arbitrary: fc.constant({}) },
)

const calendarOnlyDuration: fc.Arbitrary<Duration> = fc.record(calendarFields, { requiredKeys: [] })

const elapsedOnlyDuration: fc.Arbitrary<Duration> = fc.record(elapsedFields, { requiredKeys: [] })

const negated = (duration: Duration): Duration => ({
  weeks: -(duration.weeks ?? 0),
  days: -(duration.days ?? 0),
  hours: -(duration.hours ?? 0),
  minutes: -(duration.minutes ?? 0),
  seconds: -(duration.seconds ?? 0),
  milliseconds: -(duration.milliseconds ?? 0),
})

// ---------------------------------------------------------------------------
// Running the function under a chosen time zone
// ---------------------------------------------------------------------------

/**
 * The host object the zone property needs, reached through `globalThis` rather than by adding a
 * fourth dev dependency for its type definitions.
 *
 * A runtime that exposes no `process.env` fails here, loudly, instead of skipping. A guard that did
 * not run is not a guard that passed, and this contract has already deleted one property for
 * claiming more than it could see.
 */
type HostEnvironment = { process?: { env?: Record<string, string | undefined> } }

const hostEnvironment = (): Record<string, string | undefined> => {
  const host = (globalThis as HostEnvironment).process

  if (host?.env === undefined) {
    throw new Error(
      'this runtime exposes no process.env, so the ambient time zone cannot be varied and ' +
        'zone independence cannot be established here. The contract fails rather than skips.',
    )
  }

  return host.env
}

/**
 * The ambient zone as it was when this module loaded, before any property had a chance to borrow it.
 *
 * Read here rather than inside the test that checks it, because the obvious version of that test is
 * decorative: measured, a guard that snapshotted the zone inside its own `it` stayed green with the
 * restore deleted, since the property that ran before it had already left the borrowed zone in
 * place and the guard compared the leak against itself. That is the same failure as the globalThis
 * snapshot deleted from `number/parse@1`, rediscovered from the inside.
 */
const ambientTimeZoneAtLoad = (globalThis as HostEnvironment).process?.env?.TZ

/**
 * Node reads `process.env.TZ` on each call rather than caching it at startup, which is what makes
 * this property possible without a fixed harness time zone. The restore is in a `finally` because
 * this is the one place in the contract that writes to process-wide state: a property that leaked a
 * time zone into the tests running after it would be a defect of exactly the kind measured on the
 * first contract, where an answer depended on what had run before.
 */
const withTimeZone = <T>(timeZone: string, run: () => T): T => {
  const environment = hostEnvironment()
  const previous = environment.TZ

  try {
    environment.TZ = timeZone
    return run()
  } finally {
    if (previous === undefined) delete environment.TZ
    else environment.TZ = previous
  }
}

const answerUnder = (timeZone: string, date: Date, duration: Duration): number | null =>
  withTimeZone(timeZone, () => {
    const result = addToDate(new Date(date.getTime()), duration)

    return result === null ? null : result.getTime()
  })

// ---------------------------------------------------------------------------
// Specific properties
// ---------------------------------------------------------------------------

describe('date/add@1 specific properties', () => {
  it('p1-valid-date-or-absent :: returns null or a valid Date, never an Invalid Date', () => {
    fc.assert(
      fc.property(anyRepresentableDate, anyDurationOrNeutral, (date, duration) => {
        const result = addToDate(date, duration)

        return result === null || Number.isFinite(result.getTime())
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p2-the-neutral-duration :: the empty duration always answers, with the same instant in a new object', () => {
    fc.assert(
      fc.property(anyDate, (date) => {
        const result = addToDate(date, {})

        return result !== null && result !== date && result.getTime() === date.getTime()
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p3-milliseconds-shift-exactly :: adding milliseconds shifts the instant by exactly that many', () => {
    fc.assert(
      fc.property(anyDate, fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }), (date, ms) => {
        const result = addToDate(date, { milliseconds: ms })

        return result !== null && result.getTime() === date.getTime() + ms
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p4-elapsed-negation-cancels :: an elapsed-time duration and its negation cancel exactly', () => {
    // What this asserts beyond P3 is that the elapsed step is an odd function of the duration, and
    // that is not a distinction without a defect: D-21 of the battery normalises hours into days
    // with Math.floor and %, which disagree on negatives, so minus twenty-five hours is applied as
    // minus forty-nine. Measured, it is the only mutant in the battery this property catches and
    // the only guard in the contract that catches it - no named case carries an hour field past a
    // day, and P3 draws milliseconds alone.
    fc.assert(
      fc.property(anyDate, elapsedOnlyDuration, (date, duration) => {
        const forward = addToDate(date, duration)
        if (forward === null) return false

        const back = addToDate(forward, negated(duration))

        return back !== null && back.getTime() === date.getTime()
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p5-calendar-keeps-the-time-of-day :: a calendar-only duration never changes the UTC time of day', () => {
    // Witnessed by D-20, which zeroes the time of day in the calendar step - the mistake of an
    // implementation that assumes a date is a day. Two named cases catch it as well, and that is
    // published rather than hidden: this property is a guard with a defect of its own to answer
    // for, not the only thing standing between the contract and that defect.
    fc.assert(
      fc.property(anyDate, calendarOnlyDuration, (date, duration) => {
        const result = addToDate(date, duration)
        if (result === null) return false

        return (
          result.getUTCHours() === date.getUTCHours() &&
          result.getUTCMinutes() === date.getUTCMinutes() &&
          result.getUTCSeconds() === date.getUTCSeconds() &&
          result.getUTCMilliseconds() === date.getUTCMilliseconds()
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p6-the-day-never-grows :: the day of the month never grows under a calendar-only duration', () => {
    // The clamp only ever moves a date earlier in its month. An implementation that overflows
    // instead lands on the 1st, 2nd or 3rd of the following month, which this catches from the
    // other side than the named cases do.
    fc.assert(
      fc.property(anyDate, calendarOnlyDuration, (date, duration) => {
        const result = addToDate(date, duration)
        if (result === null) return false

        const clamped = result.getUTCDate() !== date.getUTCDate()

        return !clamped || result.getUTCDate() < date.getUTCDate()
      }),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// The coupling between the two exports
// ---------------------------------------------------------------------------

describe('date/add@1 coupling between the two exports', () => {
  it('p7-failure-coupling :: a call fails exactly when it has a description', () => {
    // The reference cannot fail this one: both exports derive from one private analysis, so the
    // module holds a single traversal of the arithmetic and the two cannot drift. That is not what
    // makes a property decorative or not. It governs every implementation, and one that writes the
    // two independently - which is what optimising the answering path and leaving the diagnostic
    // one alone looks like - can diverge on any input the named cases do not carry. The X-2 probe of
    // the mutation battery is that implementation, and this property is the only guard in the
    // contract that reddens on it.
    fc.assert(
      fc.property(
        anyDate,
        anyDuration,
        (date, duration) =>
          (addToDate(date, duration) === null) === (describeAddFailure(date, duration) !== null),
      ),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// Universal properties
// ---------------------------------------------------------------------------

const durationSnapshot = (duration: Duration): string =>
  `${Object.keys(duration).join('|')} :: ${durationFields.map((f) => String(duration[f])).join(',')}`

describe('date/add@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    expectUniversalPropertiesAnswered(universalProperties, ['no ambient output'])
  })

  it('no-mutation-of-arguments', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) => {
        const instantBefore = date.getTime()
        const durationBefore = durationSnapshot(duration)

        const result = addToDate(date, duration)

        return (
          date.getTime() === instantBefore &&
          durationSnapshot(duration) === durationBefore &&
          result !== date
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('determinism :: the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) =>
        outputsAreEqual(addToDate(date, duration), addToDate(date, duration)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-the-time-zone :: the answer does not depend on the process time zone', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) => {
        const answers = ambientTimeZoneProbes.map(({ timeZone }) =>
          answerUnder(timeZone, date, duration),
        )

        return new Set(answers).size === 1
      }),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the calls made before it', () => {
    fc.assert(
      fc.property(
        anyDate,
        anyDuration,
        fc.array(fc.tuple(anyDate, anyDuration), { maxLength: 10 }),
        (date, duration, history) => {
          const first = addToDate(date, duration)
          for (const [earlierDate, earlierDuration] of history) {
            addToDate(earlierDate, earlierDuration)
          }

          return outputsAreEqual(addToDate(date, duration), first)
        },
      ),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// The declarations the properties above rest on
// ---------------------------------------------------------------------------

describe('date/add@1 property preconditions', () => {
  it('support-the-zones-take-effect :: the declared time zones take effect in this runtime', () => {
    // Without this the zone property is a guard that cannot fail: if the runtime ignored TZ, all
    // four answers would be the answer of one zone and the set would trivially have size one.
    for (const { timeZone, offsetMinutes } of ambientTimeZoneProbes) {
      for (const season of ['january', 'july'] as const) {
        const observed = withTimeZone(timeZone, () =>
          new Date(ambientProbeInstants[season]).getTimezoneOffset(),
        )

        expect(observed, `${timeZone} in ${season}`).toBe(offsetMinutes[season])
      }
    }
  })

  it('support-the-zones-disagree :: the declared time zones do not all agree with each other', () => {
    // A set of zones that never disagree would make the property above vacuous whatever the
    // implementation did.
    const offsets = ambientTimeZoneProbes.map(({ offsetMinutes }) => offsetMinutes.january)

    expect(new Set(offsets).size).toBeGreaterThan(1)
  })

  it('support-the-zone-was-restored :: the properties left the ambient time zone exactly as they found it', () => {
    // Compared against the value read when this module loaded, so that a zone leaked by any
    // property above is visible here. Reading it inside this test instead would compare the leak
    // against itself and pass.
    expect(hostEnvironment().TZ).toBe(ambientTimeZoneAtLoad)
  })

  it('support-the-restore-drives-both-branches :: restores both a zone that was set and a zone that was absent', () => {
    // The check above depends on the properties having run first. This one does not depend on
    // anything having run at all: it drives both branches of the restore from inside the test.
    //
    // The instant is pinned rather than read from the clock. Nothing here asserts the offset, so the
    // verdict does not depend on it today - and the catalogue's clock rule has no exception for a
    // guard that reads the clock and happens not to need the value, because that is one edit away
    // from a guard that does.
    const environment = hostEnvironment()
    const sentinel = 'Asia/Kathmandu'
    const pinned = (): number =>
      new Date(ambientProbeInstants.january).getTimezoneOffset()

    environment.TZ = sentinel
    withTimeZone('Pacific/Chatham', pinned)
    const afterSet = environment.TZ

    delete environment.TZ
    withTimeZone('Pacific/Chatham', pinned)
    const afterAbsent = environment.TZ

    if (ambientTimeZoneAtLoad === undefined) delete environment.TZ
    else environment.TZ = ambientTimeZoneAtLoad

    expect({ afterSet, afterAbsent }).toEqual({ afterSet: sentinel, afterAbsent: undefined })
  })

  it('declares-an-application-order-over-every-field :: exactly once', () => {
    const ordered = applicationOrder.flatMap((step) => [...step.fields])

    expect([...ordered].sort()).toEqual([...durationFields].sort())
  })

  it('declares-a-reason-for-every-static-analysis-requirement', () => {
    const unexplained = staticAnalysisRequirements.filter((rule) => rule.reason.trim() === '')

    expect(unexplained).toEqual([])
  })
})
