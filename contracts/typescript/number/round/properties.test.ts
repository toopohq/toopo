import { describe, it } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../packages/catalogue/every-contract.js'
import { outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { describeRoundFailure, round } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * The generators matter as much as the assertions, and this contract is one where an unconsidered
 * one would be worthless: `fc.double()` draws values whose shortest decimal is seventeen digits
 * long, so a place count of two never lands on a tie and the whole region this contract exists for
 * would go unvisited. `aThousandth` is what reaches it - a value with exactly three decimals, one in
 * ten of which sits on a half-cent.
 */

/**
 * A value with exactly three decimal places, drawn as an integer count of thousandths.
 *
 * The bound is a million because that is the range `THE_SWEEP` declares and because every figure
 * below stays well inside the integers a double holds exactly, so the oracle beside it is arithmetic
 * rather than an approximation.
 */
const aThousandth = fc
  .integer({ min: -1_000_000, max: 1_000_000 })
  .map((thousandths) => ({ thousandths, value: Number(`${thousandths}e-3`) }))

/**
 * What a thousandth rounds to, computed in integers and never in doubles.
 *
 * This is a second statement of the contract's rule, written differently on purpose: the reference
 * reads a decimal string and carries a digit, and this divides an integer. Two implementations that
 * agree are evidence; one implementation compared against itself is not - which is
 * `GUARD_PERTURBATION_RULE` applied to an oracle. Measured over every value of `THE_SWEEP`: one
 * million values, zero disagreements.
 */
const inIntegers = (thousandths: number, places: number): number => {
  const divisor = 10 ** (3 - places)
  const magnitude = Math.floor((Math.abs(thousandths) + divisor / 2) / divisor)

  return Number(`${thousandths < 0 ? '-' : ''}${magnitude}e-${places}`)
}

/** The place counts a caller of this contract actually writes, plus zero and the deep end. */
const aPlaceCount = fc.oneof(
  { weight: 6, arbitrary: fc.integer({ min: 0, max: 4 }) },
  { weight: 2, arbitrary: fc.integer({ min: 5, max: 20 }) },
  { weight: 1, arbitrary: fc.constantFrom(0, 100, 400, 1e21, Number.MAX_SAFE_INTEGER) },
)

const aFiniteDouble = fc.double({ noNaN: true, noDefaultInfinity: true })

/**
 * Values chosen because a spelling in `theTraps` parts from this contract on them, plus the shapes
 * where a digit string does something a reader would not predict: a carry that grows the string, a
 * magnitude written in exponent notation, and the two ends of the double range.
 */
const aKnownTrap = fc.constantFrom(
  1.005, 2.675, 8.575, 162.295, 0.015, 0.145, -0.5, -1.5, -2.5, 0.5, 2.5, 999.995, 1000.005,
  0.9999999999999999, 0.1 + 0.2, -0.001, -0, 0, 1e21, 1e-7, 5e-324, Number.MAX_VALUE,
)

/** Anything a caller can pass, including the calls this contract refuses. */
const anyValue = fc.oneof(
  { weight: 4, arbitrary: aThousandth.map(({ value }) => value) },
  { weight: 3, arbitrary: aKnownTrap },
  { weight: 2, arbitrary: aFiniteDouble },
  { weight: 1, arbitrary: fc.constantFrom(NaN, Infinity, -Infinity) },
)

const anyPlaceCount = fc.oneof(
  { weight: 6, arbitrary: aPlaceCount },
  { weight: 1, arbitrary: fc.constantFrom(1.5, -1, -20, NaN, Infinity, -Infinity, -0) },
)

/** How many decimal places a value's shortest decimal actually carries. */
const decimalsOf = (value: number): number => {
  const [mantissa = '', exponent = '0'] = String(Math.abs(value)).split('e')
  const [, fraction = ''] = mantissa.split('.')

  return Math.max(0, fraction.length - Number(exponent))
}

describe('number/round@1 specific properties', () => {
  it('p1-finite-or-absent :: answers null or a finite number, never NaN and never Infinity', () => {
    fc.assert(
      fc.property(anyValue, anyPlaceCount, (value, places) => {
        const answer = round(value, places)

        return answer === null || Number.isFinite(answer)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p2-the-written-decimal-and-not-the-stored-double :: agrees with integer arithmetic on every thousandth', () => {
    // The central claim of this contract, in the one region where an exact oracle exists. It is
    // restricted to place counts below three because at three and above there is nothing to drop,
    // and the property would then be settling `p4` instead of this.
    fc.assert(
      fc.property(aThousandth, fc.integer({ min: 0, max: 2 }), ({ thousandths, value }, places) =>
        outputsAreEqual(round(value, places), inIntegers(thousandths, places)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p3-idempotent :: rounding an answer to the same places answers it back', () => {
    fc.assert(
      fc.property(anyValue, anyPlaceCount, (value, places) => {
        const once = round(value, places)

        return once === null || outputsAreEqual(round(once, places), once)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p4-nothing-to-drop-is-the-value :: a value already at the place asked for is answered unchanged', () => {
    fc.assert(
      fc.property(anyValue, aPlaceCount, (value, places) => {
        if (!Number.isFinite(value) || decimalsOf(value) > places) return true

        return outputsAreEqual(round(value, places), value)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p5-order-preserving :: two values in order round to two answers in order', () => {
    // A carry that runs the wrong way, a sign dropped, or a tie broken by magnitude in one direction
    // and not the other all show up here and in no other property of this contract.
    fc.assert(
      fc.property(anyValue, anyValue, aPlaceCount, (a, b, places) => {
        if (!Number.isFinite(a) || !Number.isFinite(b) || a > b) return true

        return (round(a, places) as number) <= (round(b, places) as number)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p6-sign-symmetric :: negating the value negates the answer, negative zero included', () => {
    // This is what separates half away from zero from `Math.round`, which breaks a tie towards
    // positive infinity and therefore rounds -0.5 and 0.5 in the same direction.
    fc.assert(
      fc.property(anyValue, aPlaceCount, (value, places) => {
        if (!Number.isFinite(value)) return true

        return outputsAreEqual(round(-value, places), -(round(value, places) as number))
      }),
      { numRuns: propertyRuns },
    )
  })
})

describe('number/round@1 coupling between the two exports', () => {
  it('p7-failure-coupling :: a call is refused exactly when it has a description', () => {
    // The reference cannot fail this one: both exports consult one private check. That is not what
    // makes a property decorative. It governs every implementation, including one that validates
    // `places` on the answering path and leaves the diagnostic one to guess.
    fc.assert(
      fc.property(
        anyValue,
        anyPlaceCount,
        (value, places) =>
          (round(value, places) === null) === (describeRoundFailure(value, places) !== null),
      ),
      { numRuns: propertyRuns },
    )
  })
})

describe('number/round@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    // The contract must never silently promote an inapplicable universal property back into a
    // passing test: a guard that cannot fail would inflate the green count with false assurance.
    expectUniversalPropertiesAnswered(universalProperties, [
      'never mutates its arguments',
      'no ambient output',
    ])
  })

  it('determinism :: the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyValue, anyPlaceCount, (value, places) =>
        outputsAreEqual(round(value, places), round(value, places)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the calls made before it', () => {
    // A memo keyed on the value alone answers the previous place count, which is exactly what a
    // caller rounding one amount to two places and then to none would meet. The probe is asked
    // before and after an arbitrary history, and both answers must agree.
    fc.assert(
      fc.property(
        anyValue,
        anyPlaceCount,
        fc.array(fc.tuple(anyValue, anyPlaceCount), { maxLength: 20 }),
        (value, places, history) => {
          const first = round(value, places)
          for (const [earlierValue, earlierPlaces] of history) round(earlierValue, earlierPlaces)

          return outputsAreEqual(round(value, places), first)
        },
      ),
      { numRuns: propertyRuns },
    )
  })
})
