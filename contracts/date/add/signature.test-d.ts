import { describe, it, expectTypeOf } from 'vitest'
import type { AddToDate, AddToDateResult, Duration } from './contract.js'
import { addToDate } from './reference.js'

/**
 * Block 4.2, executable. The signature is part of the contract, so an implementation that widens its
 * input, narrows its return type, or drops the failure arm from it fails the suite before any
 * behavioural test runs.
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

  it('returns either a Date or a named reason, never an Invalid Date', () => {
    expectTypeOf(addToDate).returns.toEqualTypeOf<AddToDateResult>()
  })

  it('leaves every duration field optional', () => {
    expectTypeOf<Duration>().toEqualTypeOf<Partial<Duration>>()
  })
})
