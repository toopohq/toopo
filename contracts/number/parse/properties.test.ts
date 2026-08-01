import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * The generators below matter as much as the assertions. `fc.string()` alone almost never produces
 * something numeric, so a suite built on it would be satisfied by an implementation returning
 * `null` for everything. These arbitraries deliberately concentrate on the boundary: well-formed
 * decimals, those same decimals corrupted by one character, known traps, and arbitrary text.
 */

const digitRun = (minLength: number) =>
  fc.array(fc.integer({ min: 0, max: 9 }), { minLength, maxLength: 12 }).map((d) => d.join(''))

const sign = fc.constantFrom('', '+', '-')

const mantissa = fc.oneof(
  digitRun(1),
  fc.tuple(digitRun(1), digitRun(0)).map(([whole, fraction]) => `${whole}.${fraction}`),
  digitRun(1).map((fraction) => `.${fraction}`),
)

const exponent = fc.oneof(
  fc.constant(''),
  fc.tuple(fc.constantFrom('e', 'E'), sign, digitRun(1)).map(([e, s, d]) => `${e}${s}${d}`),
)

const wellFormedDecimal = fc.tuple(sign, mantissa, exponent).map(([s, m, e]) => `${s}${m}${e}`)

/**
 * Every character `String.prototype.trim` removes that this contract is likely to meet. Written as
 * code points because two of them - the non-breaking space and the byte-order mark - are invisible
 * in source and would silently corrupt on a copy or a re-encode.
 */
const trimmableWhitespace = [0x20, 0x09, 0x0a, 0x0d, 0xa0, 0xfeff].map((code) =>
  String.fromCharCode(code),
)

const padding = fc
  .array(fc.constantFrom(...trimmableWhitespace), { maxLength: 3 })
  .map((chars) => chars.join(''))

const paddedDecimal = fc
  .tuple(padding, wellFormedDecimal, padding)
  .map(([before, decimal, after]) => `${before}${decimal}${after}`)

/** A well-formed decimal with one character inserted - the shape of a real typo. */
const corruptedDecimal = fc
  .tuple(wellFormedDecimal, fc.nat(), fc.constantFrom(' ', ',', '_', '.', 'e', 'x', '-', '+', 'n'))
  .map(([decimal, offset, char]) => {
    const at = offset % (decimal.length + 1)
    return decimal.slice(0, at) + char + decimal.slice(at)
  })

const knownTrap = fc.constantFrom(
  '', ' ', '   ', 'NaN', 'Infinity', '-Infinity', '0x1F', '0o17', '0b11', '1_000', '1,5', '1.2.3',
  '1e', '.', '-', '+', '12n', 'abc', 'constructor', 'toString', '__proto__', 'valueOf', '1e400',
  '1e-400', '-1e-400', '9007199254740993', '4 2',
  String.fromCharCode(0x0661, 0x0662, 0x0663),
  String.fromCharCode(0xfeff) + '9',
)

const candidateInput = fc.oneof(
  { weight: 4, arbitrary: paddedDecimal },
  { weight: 3, arbitrary: corruptedDecimal },
  { weight: 2, arbitrary: knownTrap },
  { weight: 1, arbitrary: fc.string() },
)

const finiteDouble = fc.double({ noNaN: true, noDefaultInfinity: true })

describe('number/parse@1 specific properties', () => {
  it('P1 - returns null or a finite number, never NaN and never Infinity', () => {
    fc.assert(
      fc.property(candidateInput, (input) => {
        const result = parseNumber(input)
        return result === null || Number.isFinite(result)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P2 - is insensitive to surrounding whitespace', () => {
    fc.assert(
      fc.property(candidateInput, (input) =>
        outputsAreEqual(parseNumber(input), parseNumber(input.trim())),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('P3 - is a right inverse of String on the finite doubles, except negative zero', () => {
    fc.assert(
      fc.property(
        finiteDouble.filter((n) => !Object.is(n, -0)),
        (n) => outputsAreEqual(parseNumber(String(n)), n),
      ),
      { numRuns: propertyRuns },
    )
  })
})

describe('number/parse@1 universal properties', () => {
  it('keeps the inapplicable universal properties declared as such', () => {
    // The contract must never silently promote an inapplicable universal property back into a
    // passing test: a guard that cannot fail would inflate the green count with false assurance.
    // Both entries below were measured to be unfalsifiable here - one because strings are
    // immutable, the other because no property can observe a write that already happened.
    const inapplicable = universalProperties.filter((p) => !p.applicable).map((p) => p.name)

    expect(inapplicable).toEqual(['never mutates its arguments', 'no ambient output'])
  })

  it('is deterministic - the same input yields the same output on every call', () => {
    fc.assert(
      fc.property(candidateInput, (input) =>
        outputsAreEqual(parseNumber(input), parseNumber(input)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('has no ambient input - an answer does not depend on the inputs parsed before it', () => {
    fc.assert(
      fc.property(candidateInput, fc.array(candidateInput, { maxLength: 20 }), (probe, history) => {
        const first = parseNumber(probe)
        for (const earlier of history) parseNumber(earlier)

        return outputsAreEqual(parseNumber(probe), first)
      }),
      { numRuns: propertyRuns },
    )
  })
})
