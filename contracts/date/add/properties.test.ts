import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { AddToDateResult, Duration } from './contract.js'
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
import { addToDate } from './reference.js'

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
 *
 * Every safety property below enumerates the licit output forms - `result.ok === true` and
 * `result.ok === false`, never `!result.ok`. Measured on `number/parse@1`: a property written the
 * short way stayed green on an implementation returning a function, because `undefined` is falsy and
 * the negated discriminant sent the stray value down the branch that asserts nothing about it.
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

/**
 * The answer, rendered as a value a `Set` can compare. Under `null` the zone property compared
 * `number | null` directly; a result carrying a `Date` is an object, so four zones would produce
 * four distinct members whatever the implementation did.
 */
const comparableAnswer = (result: AddToDateResult): string =>
  result.ok === true ? `at ${result.date.getTime()}` : `refused: ${result.reason}`

const answerUnder = (timeZone: string, date: Date, duration: Duration): string =>
  withTimeZone(timeZone, () => comparableAnswer(addToDate(new Date(date.getTime()), duration)))

// ---------------------------------------------------------------------------
// Specific properties
// ---------------------------------------------------------------------------

describe('date/add@1 specific properties', () => {
  it('P1 - refuses, or answers with a valid Date, never an Invalid Date', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) => {
        const result = addToDate(date, duration)

        return result.ok === false || (result.ok === true && Number.isFinite(result.date.getTime()))
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P2 - the empty duration is neutral: it always answers, with the same instant in a new object', () => {
    fc.assert(
      fc.property(anyDate, (date) => {
        const result = addToDate(date, {})

        return result.ok === true && result.date !== date && result.date.getTime() === date.getTime()
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P3 - adding milliseconds shifts the instant by exactly that many', () => {
    fc.assert(
      fc.property(anyDate, fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }), (date, ms) => {
        const result = addToDate(date, { milliseconds: ms })

        return result.ok === true && result.date.getTime() === date.getTime() + ms
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P4 - an elapsed-time duration and its negation cancel exactly', () => {
    fc.assert(
      fc.property(anyDate, elapsedOnlyDuration, (date, duration) => {
        const forward = addToDate(date, duration)
        if (forward.ok !== true) return false

        const back = addToDate(forward.date, negated(duration))

        return back.ok === true && back.date.getTime() === date.getTime()
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P5 - a calendar-only duration never changes the UTC time of day', () => {
    fc.assert(
      fc.property(anyDate, calendarOnlyDuration, (date, duration) => {
        const result = addToDate(date, duration)
        if (result.ok !== true) return false

        return (
          result.date.getUTCHours() === date.getUTCHours() &&
          result.date.getUTCMinutes() === date.getUTCMinutes() &&
          result.date.getUTCSeconds() === date.getUTCSeconds() &&
          result.date.getUTCMilliseconds() === date.getUTCMilliseconds()
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P6 - the day of the month never grows under a calendar-only duration', () => {
    // The clamp only ever moves a date earlier in its month. An implementation that overflows
    // instead lands on the 1st, 2nd or 3rd of the following month, which this catches from the
    // other side than the named cases do.
    fc.assert(
      fc.property(anyDate, calendarOnlyDuration, (date, duration) => {
        const result = addToDate(date, duration)
        if (result.ok !== true) return false

        const clamped = result.date.getUTCDate() !== date.getUTCDate()

        return !clamped || result.date.getUTCDate() < date.getUTCDate()
      }),
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
  it('keeps the inapplicable universal properties declared as such', () => {
    const inapplicable = universalProperties.filter((p) => !p.applicable).map((p) => p.name)

    expect(inapplicable).toEqual(['no ambient output'])
  })

  it('never mutates its arguments', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) => {
        const instantBefore = date.getTime()
        const durationBefore = durationSnapshot(duration)

        const result = addToDate(date, duration)

        return (
          date.getTime() === instantBefore &&
          durationSnapshot(duration) === durationBefore &&
          (result.ok !== true || result.date !== date)
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('is deterministic - the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyDate, anyDuration, (date, duration) =>
        outputsAreEqual(addToDate(date, duration), addToDate(date, duration)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('has no ambient input - the answer does not depend on the process time zone', () => {
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

  it('has no ambient input - an answer does not depend on the calls made before it', () => {
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
  it('the declared time zones take effect in this runtime', () => {
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

  it('the declared time zones do not all agree with each other', () => {
    // A set of zones that never disagree would make the property above vacuous whatever the
    // implementation did.
    const offsets = ambientTimeZoneProbes.map(({ offsetMinutes }) => offsetMinutes.january)

    expect(new Set(offsets).size).toBeGreaterThan(1)
  })

  it('has left the ambient time zone exactly as it found it', () => {
    // Compared against the value read when this module loaded, so that a zone leaked by any
    // property above is visible here. Reading it inside this test instead would compare the leak
    // against itself and pass.
    expect(hostEnvironment().TZ).toBe(ambientTimeZoneAtLoad)
  })

  it('restores both a zone that was set and a zone that was absent', () => {
    // The check above depends on the properties having run first. This one does not depend on
    // anything having run at all: it drives both branches of the restore from inside the test.
    const environment = hostEnvironment()
    const sentinel = 'Asia/Kathmandu'

    environment.TZ = sentinel
    withTimeZone('Pacific/Chatham', () => new Date().getTimezoneOffset())
    const afterSet = environment.TZ

    delete environment.TZ
    withTimeZone('Pacific/Chatham', () => new Date().getTimezoneOffset())
    const afterAbsent = environment.TZ

    if (ambientTimeZoneAtLoad === undefined) delete environment.TZ
    else environment.TZ = ambientTimeZoneAtLoad

    expect({ afterSet, afterAbsent }).toEqual({ afterSet: sentinel, afterAbsent: undefined })
  })

  it('the declared application order covers every duration field exactly once', () => {
    const ordered = applicationOrder.flatMap((step) => [...step.fields])

    expect([...ordered].sort()).toEqual([...durationFields].sort())
  })

  it('publishes a reason for every static analysis requirement', () => {
    const unexplained = staticAnalysisRequirements.filter((rule) => rule.reason.trim() === '')

    expect(unexplained).toEqual([])
  })
})
