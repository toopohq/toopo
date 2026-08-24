import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../packages/catalogue/every-contract.js'
import { outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { deepEqual } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * **Five of the six below are satisfied by an implementation that always answers `true`**, and that is
 * not a criticism of them - reflexivity, symmetry, transitivity and order-independence are all
 * one-sided. `p6` is what makes the set worth anything, and it is written here rather than left to the
 * case table because the table settles forty-nine pairs and a generator settles a shape.
 *
 * ---------------------------------------------------------------------------
 * What the alphabet holds, and the one thing it deliberately does not
 * ---------------------------------------------------------------------------
 *
 * `noNullPrototype` is the alphabet and not a convenience. `structuredClone` returns a *plain* object
 * for a null-prototype one - measured, the prototype goes from `null` to `Object` - so `p1` is false
 * on that shape, and it is false for `util.isDeepStrictEqual` too. The same is true of a class
 * instance. Neither is excluded from the contract: both are settled by name, under
 * `what-a-clone-does-not-preserve`, which is where a reader who came here from `p1` is sent.
 *
 * That exclusion was not reasoned. It was found by fast-check on the first hundred draws, while the
 * draw count below was being chosen, and the counter-example it shrank to was `{"": {__proto__: null}}`.
 */

/**
 * The leaves, chosen so that the traps this contract settles are drawn rather than hoped for:
 * `NaN` and `-0` for the `Object.is` rule, a `BigInt` beside a number, and a pattern.
 */
const aLeaf = fc.oneof(
  fc.integer({ min: -5, max: 5 }),
  fc.string({ maxLength: 3 }),
  fc.boolean(),
  fc.constant(null),
  fc.constant(undefined),
  fc.constant(NaN),
  fc.constant(-0),
  fc.bigInt({ min: -3n, max: 3n }),
  fc.date({ min: new Date(0), max: new Date(3000) }),
  fc.constantFrom(/a/g, /b/i, /a/),
)

/**
 * Any value the declared domain carries, nested.
 *
 * The bounds are small on purpose: what these properties are about is the *shape* of the walk, and a
 * wide draw spends its runs on breadth this contract settles in one comparison. Depth and the mixture
 * of containers are what reach the interesting paths, and `coverage` below is how that was checked
 * rather than assumed.
 */
const aValue = fc.letrec((tie) => ({
  any: fc.oneof(
    { depthSize: 'small' },
    aLeaf,
    fc.array(tie('any'), { maxLength: 4 }),
    fc.dictionary(fc.string({ maxLength: 2 }), tie('any'), { maxKeys: 4, noNullPrototype: true }),
    fc.array(tie('any'), { maxLength: 3 }).map((members) => new Set(members)),
    fc.array(fc.tuple(tie('any'), tie('any')), { maxLength: 3 }).map((entries) => new Map(entries)),
    fc.array(fc.integer({ min: 0, max: 255 }), { maxLength: 4 }).map((bytes) => new Uint8Array(bytes)),
  ),
})).any

/** Every own key of every object reachable from a value, as one string. Used by two properties. */
const shapeOf = (value: unknown, seen = new Set<unknown>()): string => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return '.'

  seen.add(value)

  const parts = value instanceof Map
    ? [...value.keys(), ...value.values()]
    : value instanceof Set
      ? [...value]
      : Object.values(value)

  return `${Reflect.ownKeys(value).map(String).join(',')}(${parts.map((part) => shapeOf(part, seen)).join('|')})`
}

describe('object/deep-equal@1 properties', () => {
  it('p1-reflexive-under-a-copy :: a value equals the copy the platform makes of it', () => {
    // The oracle, and the one property here this contract did not invent: `structuredClone` is the
    // platform's own answer to what a value's data is. Measured, it caught three of the five shipped
    // implementations - a float array holding NaN, a Set of objects, and a cyclic value that two of
    // them cannot answer at all.
    fc.assert(
      fc.property(aValue, (subject) => deepEqual(subject, structuredClone(subject))),
      { numRuns: propertyRuns },
    )
  })

  it('p2-symmetric :: the answer does not depend on which side a value is on', () => {
    // Violable by a matching that claims members greedily: `Set([a, b])` against `Set([c, d])` can
    // answer differently depending on which side is walked, if a candidate is claimed before it is
    // known that the rest can still be matched.
    fc.assert(
      fc.property(aValue, aValue, (left, right) =>
        outputsAreEqual(deepEqual(left, right), deepEqual(right, left)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p3-reflexive :: a value equals itself, including one that holds itself', () => {
    // Not free, and the cycles are why: an implementation without the identity short-circuit still
    // answers `true` for a plain value compared with itself, and does not return at all for a value
    // that holds itself.
    fc.assert(fc.property(aValue, (subject) => deepEqual(subject, subject)), {
      numRuns: propertyRuns,
    })
  })

  it('p4-transitive :: two values equal to a third are equal to each other', () => {
    // Drawn as a value and two copies rather than as three independent draws, which would answer the
    // premise false on essentially every run and prove nothing. A copy of a copy is where a walk that
    // compared identity somewhere it should compare data would part.
    fc.assert(
      fc.property(aValue, (subject) => {
        const first = structuredClone(subject)
        const second = structuredClone(first)

        return !(deepEqual(subject, first) && deepEqual(first, second)) || deepEqual(subject, second)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p5-order-of-declaration-is-not-read :: two answers about one pair agree', () => {
    // The speculation property, and the one this contract's own first implementation failed. A walk
    // that memoises the pairs a failed candidate tried answers differently depending on the order the
    // keys of an object were written in, so the same pair is asked twice with the keys transposed.
    const transposed = (value: unknown): unknown => {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) return value
      if (Object.getPrototypeOf(value) !== Object.prototype) return value

      return Object.fromEntries(Object.entries(value).reverse())
    }

    fc.assert(
      fc.property(aValue, aValue, (left, right) =>
        outputsAreEqual(deepEqual(left, right), deepEqual(transposed(left), transposed(right))),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p6-a-perturbed-clone-is-not-the-original :: the answer is not always yes', () => {
    // The only property here with a `false` expectation, and without it the five above are satisfied
    // by an implementation that answers `true` unconditionally.
    //
    // **The perturbation adds a key rather than replacing a value, and that was measured rather than
    // chosen.** Replacing one drawn leaf failed on `Uint8Array.from([0])` at the 325th draw: writing a
    // string into an index of a typed array is coerced to a number, so the clone came back unchanged
    // and the property was asking whether a value differs from itself. Adding an own property is the
    // one perturbation every kind in the alphabet carries - an object, an array, a Set, a Map and a
    // typed array all accept a named key, and none of them coerces it away.
    //
    // The key is longer than any the alphabet draws, so it cannot collide with one the subject
    // already holds.
    const A_KEY_THE_ALPHABET_NEVER_DRAWS = 'perturbed-by-p6'

    fc.assert(
      fc.property(aValue, (subject) => {
        if (subject === null || typeof subject !== 'object') return true

        const clone = structuredClone(subject) as Record<string, unknown>
        clone[A_KEY_THE_ALPHABET_NEVER_DRAWS] = true

        return !deepEqual(subject, clone)
      }),
      { numRuns: propertyRuns },
    )
  })
})

describe('object/deep-equal@1 the stack clause', () => {
  it('p7-ordinary-depth-costs-no-call-frames :: a chain no call stack holds is still answered', () => {
    // The clause `theClauses` publishes, executable. It is here rather than in a benchmark profile
    // because a profile's samples are carried in the served record and the registry's encoder walks a
    // chain of at most about fifteen hundred levels - shallower than two of the five shipped
    // implementations already answer, so the deepest value a page could show would demonstrate
    // nothing. A property is executed and never served, which is what makes this the one place the
    // claim can be made at a depth that means something.
    //
    // Fifty thousand rather than a million: the claim is that the depth costs no call frames, and
    // fifty thousand is already six times past the deepest of the five and an order past three of
    // them. What a larger figure would buy is a slower test.
    const chain = (depth: number): unknown => {
      let node: unknown = { leaf: true }

      for (let at = 0; at < depth; at += 1) node = { next: node }

      return node
    }

    expect(deepEqual(chain(50_000), chain(50_000))).toBe(true)
    expect(deepEqual(chain(50_000), chain(49_999))).toBe(false)
  })
})

describe('object/deep-equal@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    expectUniversalPropertiesAnswered(universalProperties, ['no ambient output'])
  })

  it('never-mutates-its-arguments :: neither graph carries anything it did not arrive with', () => {
    // Applicable over a graph for the first time in this catalogue, and violable in practice: marking
    // visited objects is the textbook way to detect a cycle, and an implementation that forgets to
    // unmark leaves a property on every object it failed to unwind. Both arguments are walked before
    // and after, and every reachable object's own keys are compared.
    fc.assert(
      fc.property(aValue, aValue, (left, right) => {
        const before = [shapeOf(left), shapeOf(right)]

        deepEqual(left, right)

        return shapeOf(left) === before[0] && shapeOf(right) === before[1]
      }),
      { numRuns: propertyRuns },
    )
  })

  it('determinism :: the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(aValue, aValue, (left, right) =>
        outputsAreEqual(deepEqual(left, right), deepEqual(left, right)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the calls made before it', () => {
    // An implementation holding its last pair and verdict answers correctly until one of the two
    // graphs is mutated between calls, and then answers the previous question. The probe is asked
    // before and after an arbitrary history, and both answers must agree.
    fc.assert(
      fc.property(
        aValue,
        aValue,
        fc.array(fc.tuple(aValue, aValue), { maxLength: 20 }),
        (left, right, history) => {
          const first = deepEqual(left, right)

          for (const [earlierLeft, earlierRight] of history) deepEqual(earlierLeft, earlierRight)

          return outputsAreEqual(deepEqual(left, right), first)
        },
      ),
      { numRuns: propertyRuns },
    )
  })
})

describe('object/deep-equal@1 property alphabet', () => {
  it('the-alphabet-reaches-what-the-contract-is-about', () => {
    // `propertyRuns` was chosen on what each draw count *reaches* rather than on what it costs, and
    // this is that reading made executable: a run in which no draw carried a collection would leave
    // the whole of `sameMembers` unvisited while every property above stayed green. Measured at 1 000
    // draws: a Set in 38.5% of them, a Set holding an object in 25.9%, a `-0` somewhere in 16.0%.
    const reached = { aSet: 0, aMap: 0, aCollectionOfObjects: 0, aNestedValue: 0 }

    fc.assert(
      fc.property(aValue, (subject) => {
        const walk = (value: unknown, depth: number, seen: Set<unknown>): void => {
          if (value === null || typeof value !== 'object' || seen.has(value)) return

          seen.add(value)

          if (value instanceof Set) reached.aSet += 1
          if (value instanceof Map) reached.aMap += 1
          if (depth >= 2) reached.aNestedValue += 1

          const parts = value instanceof Map
            ? [...value.keys(), ...value.values()]
            : value instanceof Set
              ? [...value]
              : Object.values(value)

          if (
            (value instanceof Set || value instanceof Map) &&
            parts.some((part) => part !== null && typeof part === 'object')
          ) {
            reached.aCollectionOfObjects += 1
          }

          for (const part of parts) walk(part, depth + 1, seen)
        }

        walk(subject, 0, new Set())

        return true
      }),
      { numRuns: propertyRuns },
    )

    expect(
      Object.fromEntries(Object.entries(reached).map(([what, count]) => [what, count > 0])),
    ).toEqual({ aSet: true, aMap: true, aCollectionOfObjects: true, aNestedValue: true })
  })
})
