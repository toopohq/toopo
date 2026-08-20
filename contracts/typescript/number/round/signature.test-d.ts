import { describe, it, expectTypeOf } from 'vitest'
import type { DescribeRoundFailure, Round } from './contract.js'
import { describeRoundFailure, round } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, narrows its return type, drops
 * `null` from it, or makes `places` optional fails the suite before any behavioural test runs.
 */
describe('number/round@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(round).toEqualTypeOf<Round>()
  })

  it('signature-takes-two-numbers :: a value and a place count, both required', () => {
    expectTypeOf(round).parameter(0).toEqualTypeOf<number>()
    expectTypeOf(round).parameter(1).toEqualTypeOf<number>()
    // @ts-expect-error `places` is required on purpose. A default would put a second arity into the
    // major, and `round(x)` reads as "round x" without saying which way - the ambiguity
    // `Math.round` already occupies.
    round(1.005)
  })

  it('signature-returns-a-number-or-null :: a number that may be absent, never NaN-as-number-only', () => {
    expectTypeOf(round).returns.toEqualTypeOf<number | null>()
  })

  it('signature-publishes-the-diagnostic :: the diagnostic surface has the type the contract declares', () => {
    expectTypeOf(describeRoundFailure).toEqualTypeOf<DescribeRoundFailure>()
  })
})
