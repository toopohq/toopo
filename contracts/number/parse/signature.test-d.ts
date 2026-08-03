import { describe, it, expectTypeOf } from 'vitest'
import type { DescribeParseFailure, ParseNumber } from './contract.js'
import { describeParseFailure, parseNumber } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, narrows its return type, or drops
 * `null` from it fails the suite before any behavioural test runs.
 */
describe('number/parse@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(parseNumber).toEqualTypeOf<ParseNumber>()
  })

  it('signature-accepts-a-string :: a string and nothing else', () => {
    expectTypeOf(parseNumber).parameter(0).toEqualTypeOf<string>()
    // @ts-expect-error the contract narrows the input to `string` on purpose; widening it to
    // `unknown` would turn this contract into a multi-type conversion table.
    parseNumber(42)
  })

  it('signature-returns-a-number-or-null :: a number that may be absent, never NaN-as-number-only', () => {
    expectTypeOf(parseNumber).returns.toEqualTypeOf<number | null>()
  })

  it('signature-publishes-the-diagnostic :: the diagnostic surface has the type the contract declares', () => {
    expectTypeOf(describeParseFailure).toEqualTypeOf<DescribeParseFailure>()
  })
})
