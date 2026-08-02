import { describe, it, expect } from 'vitest'
import {
  expectEveryCaseIsAddressed,
  expectEveryCaseIsJustified,
} from '../../../catalogue/every-contract.js'
import type { AddFailureReason, Duration } from './contract.js'
import { failureReasons, outputsAreEqual } from './contract.js'
import { edgeCases, untypedEdgeCases } from './edge-cases.js'
import { addToDate, describeAddFailure } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's two tables is asserted exactly, using the
 * equality semantics the contract declares - on the instant, never on object identity - and every
 * entry is asserted a second time against the diagnostic surface.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule and is what
 * makes the title stable under a specification mutant. The call and the answer it used to render are
 * carried by the failure message instead, where a mutant may rewrite them freely because nothing
 * identifies a guard by them.
 *
 * The four blocks below must not share a title. Attribution identifies a guard by its title alone, so
 * two guards carrying one would be read as reddening each other.
 */

/**
 * Durations are rendered by hand rather than with `JSON.stringify`, which erases exactly the values
 * these tables exist to settle: it drops a field set to `undefined`, and prints `-0` as `0`.
 */
const renderValue = (value: unknown): string => {
  if (typeof value === 'number' && Object.is(value, -0)) return '-0'
  if (typeof value === 'string') return JSON.stringify(value)

  return String(value)
}

const renderDuration = (duration: Readonly<Record<string, unknown>>): string => {
  const entries = Object.entries(duration).map(([field, value]) => `${field}: ${renderValue(value)}`)

  return entries.length === 0 ? '{}' : `{ ${entries.join(', ')} }`
}

const renderCall = (date: string, duration: Readonly<Record<string, unknown>>): string =>
  `${date} + ${renderDuration(duration)}`

const rendered = (value: Date | null): string => {
  if (value === null) return 'null'

  return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
}

const asExpected = (expected: string | null): Date | null =>
  expected === null ? null : new Date(expected)

/**
 * The one place a call of either table is answered and compared, so that a case is judged identically
 * whether or not TypeScript would have accepted the duration that produced it.
 */
const expectAnswered = (
  date: string,
  duration: Readonly<Record<string, unknown>>,
  expected: string | null,
): void => {
  // The cast is the point of the second table rather than a shortcut around it: those durations are
  // what reaches the function from JSON, from a form, or from a JavaScript caller, none of whom were
  // stopped by the type. Removing the cast would delete the case, not fix it.
  const actual = addToDate(new Date(date), duration as Duration)

  expect(
    outputsAreEqual(actual, asExpected(expected)),
    `${renderCall(date, duration)}: expected ${expected ?? 'null'}, received ${rendered(actual)}`,
  ).toBe(true)
}

/** The one place the diagnostic surface is asserted, shared by the two tables for the same reason. */
const expectDescribedAs = (
  date: string,
  duration: Readonly<Record<string, unknown>>,
  reason: AddFailureReason | null,
): void => {
  expect(
    describeAddFailure(new Date(date), duration as Duration),
    renderCall(date, duration),
  ).toBe(reason)
}

describe('date/add@1 named edge cases', () => {
  for (const { id, date, duration, expected } of edgeCases) {
    it(id, () => {
      expectAnswered(date, duration, expected)
    })
  }
})

describe('date/add@1 edge cases outside the declared type', () => {
  for (const { id, date, duration, expected } of untypedEdgeCases) {
    it(id, () => {
      expectAnswered(date, duration, expected)
    })
  }
})

describe('date/add@1 named edge cases, described', () => {
  for (const { id, date, duration, reason } of edgeCases) {
    it(`${id}, described`, () => {
      expectDescribedAs(date, duration, reason)
    })
  }
})

describe('date/add@1 edge cases outside the declared type, described', () => {
  for (const { id, date, duration, reason } of untypedEdgeCases) {
    it(`${id}, described`, () => {
      expectDescribedAs(date, duration, reason)
    })
  }
})

describe('date/add@1 edge case tables', () => {
  const allCases = [...edgeCases, ...untypedEdgeCases]

  it('addresses each case with a unique identifier', () => {
    expectEveryCaseIsAddressed(allCases.map((edgeCase) => edgeCase.id))
  })

  it('names a case for every declared reason, and declares every reason it names', () => {
    // The partition is frozen with the major, so a literal nobody produces any more would survive
    // as documentation of a refusal that no longer exists - and a reason the tables produce without
    // declaring it would be invisible to a caller reading the contract. Both directions, one guard.
    const produced = allCases.map(({ reason }) => reason).filter((reason) => reason !== null)

    expect([...new Set(produced)].sort()).toEqual([...failureReasons].sort())
  })

  it('settles each call exactly once across both tables', () => {
    const calls = allCases.map(({ date, duration }) => renderCall(date, duration))

    expect(calls).toHaveLength(new Set(calls).size)
  })

  it('publishes a rationale for every decision', () => {
    expectEveryCaseIsJustified(allCases, ({ id }) => id)
  })

  it('writes every expected instant in a form that survives a round trip', () => {
    // An expectation the test framework cannot parse back would silently become NaN and compare
    // equal to nothing, turning a real assertion into an unfalsifiable one.
    const unparseable = allCases
      .map(({ expected }) => expected)
      .filter((expected) => expected !== null)
      .filter((expected) => new Date(expected).toISOString() !== expected)

    expect(unparseable).toEqual([])
  })
})
