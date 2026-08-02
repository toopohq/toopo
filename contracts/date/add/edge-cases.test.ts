import { describe, it, expect } from 'vitest'
import type { AddToDateResult, Duration, ExpectedOutcome } from './contract.js'
import { edgeCases, outputsAreEqual, untypedEdgeCases } from './contract.js'
import { addToDate } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's two tables is asserted exactly, using the
 * equality semantics the contract declares - on the instant, never on object identity, and on the
 * reason when the call was refused.
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

const rendered = (value: AddToDateResult): string => {
  if (value.ok === true) {
    return Number.isNaN(value.date.getTime()) ? 'Invalid Date' : value.date.toISOString()
  }

  return `refused: ${value.reason}`
}

const renderExpected = (expected: ExpectedOutcome): string =>
  expected.ok ? expected.date : `refused: ${expected.reason}`

const asResult = (expected: ExpectedOutcome): AddToDateResult =>
  expected.ok ? { ok: true, date: new Date(expected.date) } : { ok: false, reason: expected.reason }

describe('date/add@1 named edge cases', () => {
  for (const { date, duration, expected } of edgeCases) {
    it(`${date} + ${renderDuration(duration)} -> ${renderExpected(expected)}`, () => {
      const actual = addToDate(new Date(date), duration)

      expect(
        outputsAreEqual(actual, asResult(expected)),
        `expected ${renderExpected(expected)}, received ${rendered(actual)}`,
      ).toBe(true)
    })
  }
})

describe('date/add@1 edge cases outside the declared type', () => {
  for (const { date, duration, expected } of untypedEdgeCases) {
    it(`${date} + ${renderDuration(duration)} -> ${renderExpected(expected)}`, () => {
      // The cast is the point of this table rather than a shortcut around it: these durations are
      // what reaches the function from JSON, from a form, or from a JavaScript caller, none of whom
      // were stopped by the type. Removing the cast would delete the case, not fix it.
      const actual = addToDate(new Date(date), duration as Duration)

      expect(
        outputsAreEqual(actual, asResult(expected)),
        `expected ${renderExpected(expected)}, received ${rendered(actual)}`,
      ).toBe(true)
    })
  }
})

describe('date/add@1 edge case tables', () => {
  const allCases = [...edgeCases, ...untypedEdgeCases]

  it('settles each call exactly once across both tables', () => {
    const calls = allCases.map(({ date, duration }) => `${date} + ${renderDuration(duration)}`)

    expect(calls).toHaveLength(new Set(calls).size)
  })

  it('publishes a rationale for every decision', () => {
    const undocumented = allCases.filter(({ rationale }) => rationale.trim() === '')

    expect(undocumented).toEqual([])
  })

  it('writes every expected instant in a form that survives a round trip', () => {
    // An expectation the test framework cannot parse back would silently become NaN and compare
    // equal to nothing, turning a real assertion into an unfalsifiable one.
    const unparseable = allCases
      .map(({ expected }) => expected)
      .filter((expected) => expected.ok === true && new Date(expected.date).toISOString() !== expected.date)

    expect(unparseable).toEqual([])
  })
})
