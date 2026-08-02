import { describe, it, expectTypeOf } from 'vitest'
import type { ParseNumber, ParseNumberResult } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.2, executable. The signature is part of the contract, so an implementation that widens
 * its input, narrows its return type, or drops a member of the result union fails the suite before
 * any behavioural test runs.
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

  it('returns a result that is either a number or a named failure', () => {
    expectTypeOf(parseNumber).returns.toEqualTypeOf<ParseNumberResult>()
  })
})
