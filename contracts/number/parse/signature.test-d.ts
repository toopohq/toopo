import { describe, it, expectTypeOf } from 'vitest'
import type { DescribeParseFailure, ParseNumber } from './contract.js'
import { describeParseFailure, parseNumber } from './reference.js'

/**
 * Block 4.2, executable. The signature is part of the contract, so an implementation that widens
 * its input, narrows its return type, or drops `null` from it fails the suite before any
 * behavioural test runs.
 *
 * `toEqualTypeOf` is used rather than `toMatchTypeOf`: a signature that merely satisfies the
 * contract's shape is not conformant, it has to be identical.
 */
describe('number/parse@1 signature', () => {
  it('matches the type declared by the contract', () => {
    expectTypeOf(parseNumber).toEqualTypeOf<ParseNumber>()
  })

  it('accepts a string and nothing else', () => {
    expectTypeOf(parseNumber).parameter(0).toEqualTypeOf<string>()
    // @ts-expect-error the contract narrows the input to `string` on purpose; widening it to
    // `unknown` would turn this contract into a multi-type conversion table.
    parseNumber(42)
  })

  it('returns a number that may be absent, never NaN-as-number-only', () => {
    expectTypeOf(parseNumber).returns.toEqualTypeOf<number | null>()
  })

  it('publishes the diagnostic surface with the type the contract declares', () => {
    expectTypeOf(describeParseFailure).toEqualTypeOf<DescribeParseFailure>()
  })
})
