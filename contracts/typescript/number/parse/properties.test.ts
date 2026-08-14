import { describe, it } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../packages/catalogue/every-contract.js'
import { outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { describeParseFailure, parseNumber } from './reference.js'

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
  it('p1-finite-or-absent :: returns null or a finite number, never NaN and never Infinity', () => {
    // The support of this property was probed rather than assumed, because the same property on
    // `date/add@1` turned out to be sound and starved: its generators could not reach the region
    // where it fails, and it stayed green on a defect that returned a forbidden value there.
    // Measured here with the same pair of probes. F-3 returns NaN for every call and reddens this
    // property, so it is not decorative. F-4 returns NaN only on the overflow path - the one region
    // this property polices at its boundary - and reddens it too, so the arbitraries do build an
    // exponent past 308 on their own and the named case 1e400 is not carrying this alone. No
    // widening was needed here.

    fc.assert(
      fc.property(candidateInput, (input) => {
        const result = parseNumber(input)
        return result === null || Number.isFinite(result)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p2-whitespace-insensitive :: is insensitive to surrounding whitespace', () => {
    fc.assert(
      fc.property(candidateInput, (input) =>
        outputsAreEqual(parseNumber(input), parseNumber(input.trim())),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p3-right-inverse-of-string :: is a right inverse of String on the finite doubles, except negative zero', () => {
    fc.assert(
      fc.property(
        finiteDouble.filter((n) => !Object.is(n, -0)),
        (n) => outputsAreEqual(parseNumber(String(n)), n),
      ),
      { numRuns: propertyRuns },
    )
  })
})

describe('number/parse@1 coupling between the two exports', () => {
  it('p4-failure-coupling :: a string fails to parse exactly when it has a description', () => {
    // The reference cannot fail this one: both exports derive from one private analysis, so the
    // module holds a single grammar and the two cannot drift. That is not what makes a property
    // decorative or not. It governs every implementation, and one that writes the two independently
    // - which is what optimising the parsing path and leaving the diagnostic one alone looks like -
    // can diverge on any input the named cases do not carry. The X-1 probe of the mutation battery
    // is that implementation, and this property is the only guard in the contract that reddens on it.
    fc.assert(
      fc.property(
        candidateInput,
        (input) => (parseNumber(input) === null) === (describeParseFailure(input) !== null),
      ),
      { numRuns: propertyRuns },
    )
  })
})

describe('number/parse@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    // The contract must never silently promote an inapplicable universal property back into a
    // passing test: a guard that cannot fail would inflate the green count with false assurance.
    // Both entries below were measured to be unfalsifiable here - one because strings are
    // immutable, the other because no property can observe a write that already happened.
    expectUniversalPropertiesAnswered(universalProperties, [
      'never mutates its arguments',
      'no ambient output',
    ])
  })

  it('determinism :: the same input yields the same output on every call', () => {
    fc.assert(
      fc.property(candidateInput, (input) =>
        outputsAreEqual(parseNumber(input), parseNumber(input)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the inputs parsed before it', () => {
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
