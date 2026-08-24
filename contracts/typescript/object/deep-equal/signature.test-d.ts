import { describe, it, expectTypeOf } from 'vitest'
import type { DeepEqual } from './contract.js'
import { deepEqual } from './reference.js'

/**
 * Block 4.2, executable. An implementation that narrows its input to a shape, constrains it with a
 * type parameter, or returns anything but a boolean fails the suite before any behavioural test runs.
 *
 * **The two stricter-looking signatures are asserted against here rather than only argued about in
 * `contract.ts`.** `<T>(a: T, b: T) => boolean` refuses `deepEqual(1, 'a')` and accepts two object
 * literals of different shapes, because the compiler infers a union of the candidates for one and the
 * literal type of the first argument for the other - so its strictness depends on whether the caller
 * wrote a literal, which is not strictness. `<T>(a: T, b: NoInfer<T>) => boolean` refuses both and is
 * refused by `p2-symmetric`: it accepts a call and rejects the same two values in the other order.
 *
 * The calls below are the measurement, kept as compiling code rather than as prose. If a future
 * signature made any of them an error, this file is where that is met.
 */
describe('object/deep-equal@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(deepEqual).toEqualTypeOf<DeepEqual>()
  })

  it('signature-takes-two-unknowns :: both required, neither constrained', () => {
    expectTypeOf(deepEqual).parameter(0).toEqualTypeOf<unknown>()
    expectTypeOf(deepEqual).parameter(1).toEqualTypeOf<unknown>()
    // @ts-expect-error A comparison needs two values. A default would put a second arity into the
    // major, and there is nothing a one-argument `deepEqual` could sensibly mean.
    deepEqual(1)
  })

  it('signature-returns-a-boolean :: an answer, never a failure channel', () => {
    expectTypeOf(deepEqual).returns.toEqualTypeOf<boolean>()
  })

  it('signature-accepts-a-value-whose-type-the-caller-does-not-know', () => {
    // The call this function exists for, and the one both stricter candidates make awkward. Written
    // in both orders because `p2-symmetric` says the answer does not depend on which side a value is
    // on, and a signature that accepted one order and refused the other would contradict it.
    const fromJson: unknown = JSON.parse('{"a":1}')
    const holding = { a: 1 }

    expectTypeOf(deepEqual(fromJson, holding)).toEqualTypeOf<boolean>()
    expectTypeOf(deepEqual(holding, fromJson)).toEqualTypeOf<boolean>()
  })

  it('signature-accepts-two-values-of-unrelated-types', () => {
    // Deliberately admitted. Asking whether `1` and `'a'` carry the same data is a question with an
    // answer, and a caller comparing two values out of a cache does not know their types are related.
    expectTypeOf(deepEqual(1, 'a')).toEqualTypeOf<boolean>()
    expectTypeOf(deepEqual({ a: 1 }, { b: 2 })).toEqualTypeOf<boolean>()
  })
})
