import { describe, it, expectTypeOf } from 'vitest'
import type { AddToDate, DescribeAddFailure, Duration } from './contract.js'
import { addToDate, describeAddFailure } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, narrows its return type, or drops
 * `null` from it fails the suite before any behavioural test runs.
 */
describe('date/add@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(addToDate).toEqualTypeOf<AddToDate>()
  })

  it('signature-accepts-a-date-and-a-duration :: a Date and a Duration, and nothing else', () => {
    expectTypeOf(addToDate).parameter(0).toEqualTypeOf<Date>()
    expectTypeOf(addToDate).parameter(1).toEqualTypeOf<Duration>()

    // @ts-expect-error a timestamp is not a Date. The contract takes the object, because accepting
    // both would make the signature the place where units are guessed.
    addToDate(0, {})

    // @ts-expect-error every unit is named in the plural. This guard only reaches literals written
    // at the call site, which is why block 4.4 settles the same input at runtime as well.
    addToDate(new Date(), { day: 1 })
  })

  it('signature-returns-a-date-or-null :: a Date that may be absent, never an Invalid Date', () => {
    expectTypeOf(addToDate).returns.toEqualTypeOf<Date | null>()
  })

  it('signature-duration-fields-are-optional', () => {
    expectTypeOf<Duration>().toEqualTypeOf<Partial<Duration>>()
  })

  it('signature-publishes-the-diagnostic :: the diagnostic surface has the type the contract declares', () => {
    expectTypeOf(describeAddFailure).toEqualTypeOf<DescribeAddFailure>()
  })
})
