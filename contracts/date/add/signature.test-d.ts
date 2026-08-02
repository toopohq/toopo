import { describe, it, expectTypeOf } from 'vitest'
import type { AddToDate, DescribeAddFailure, Duration } from './contract.js'
import { addToDate, describeAddFailure } from './reference.js'

/**
 * Block 4.2, executable. The signature is part of the contract, so an implementation that widens its
 * input, narrows its return type, or drops `null` from it fails the suite before any behavioural
 * test runs.
 *
 * `toEqualTypeOf` is used rather than `toMatchTypeOf`: a signature that merely satisfies the
 * contract's shape is not conformant, it has to be identical.
 */
describe('date/add@1 signature', () => {
  it('matches the type declared by the contract', () => {
    expectTypeOf(addToDate).toEqualTypeOf<AddToDate>()
  })

  it('accepts a Date and a Duration, and nothing else', () => {
    expectTypeOf(addToDate).parameter(0).toEqualTypeOf<Date>()
    expectTypeOf(addToDate).parameter(1).toEqualTypeOf<Duration>()

    // @ts-expect-error a timestamp is not a Date. The contract takes the object, because accepting
    // both would make the signature the place where units are guessed.
    addToDate(0, {})

    // @ts-expect-error every unit is named in the plural. This guard only reaches literals written
    // at the call site, which is why block 4.4 settles the same input at runtime as well.
    addToDate(new Date(), { day: 1 })
  })

  it('returns a Date that may be absent, never an Invalid Date', () => {
    expectTypeOf(addToDate).returns.toEqualTypeOf<Date | null>()
  })

  it('leaves every duration field optional', () => {
    expectTypeOf<Duration>().toEqualTypeOf<Partial<Duration>>()
  })

  it('publishes the diagnostic surface with the type the contract declares', () => {
    expectTypeOf(describeAddFailure).toEqualTypeOf<DescribeAddFailure>()
  })
})
