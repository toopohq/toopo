import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../catalogue/every-contract.js'
import { keyFunctionRules, outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { groupBy } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * The generators matter as much as the assertions, and here half of the generator is a *function*.
 * An arbitrary that only ever drew `(item) => item` would give almost every element its own group,
 * so nothing that goes wrong inside a group - order, aliasing, a lost element - could ever be
 * reached; and one that only drew a constant key would never reach group order at all. The key
 * functions below are chosen to put the input in each of the regions the properties police, and the
 * mutation battery carries probes that check they arrive there rather than assuming it.
 *
 * Every key function drawn here is a pure function of its two arguments. That restriction is
 * published in block 4.2 as a `conditional`, and what stops it from hiding a defect is P5: the
 * contract is obliged to call the key function exactly once per element, tested without any
 * assumption about the caller, so an implementation has no second look through which to smuggle a
 * changing answer past a property that drew a well-behaved function.
 *
 * Half of what follows is liveness rather than safety, for the reason measured on `number/parse@1`:
 * an implementation that answers nothing satisfies every safety property a contract can state. Here
 * that implementation returns an empty Map, and P1 is what forces an answer out of it.
 */

// ---------------------------------------------------------------------------
// Comparing values the way the contract declares
// ---------------------------------------------------------------------------

/**
 * `-0` needs two different treatments and mixing them up would make two properties vacuous.
 *
 * As an *element* it is distinct from `0`, and a multiset keyed by a Map would merge the two, so it
 * is swapped for a sentinel before counting. As a *key* it does not survive: `Map.prototype.set`
 * normalises it to `+0`, measured, so any expectation about the key a group carries has to apply the
 * same normalisation or compare a key against one that cannot exist.
 */
const NEGATIVE_ZERO = Symbol('negative zero')

const asCountingKey = (value: unknown): unknown => (Object.is(value, -0) ? NEGATIVE_ZERO : value)

const asMapKey = (key: unknown): unknown => (Object.is(key, -0) ? 0 : key)

const multiset = (values: readonly unknown[]): Map<unknown, number> => {
  const counts = new Map<unknown, number>()

  for (const value of values) {
    const key = asCountingKey(value)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return counts
}

const sameMultiset = (a: Map<unknown, number>, b: Map<unknown, number>): boolean =>
  a.size === b.size && [...a].every(([value, count]) => b.get(value) === count)

/** Enough of an element to notice a write to it, for the elements that can carry one. */
const snapshotOf = (value: unknown): string => {
  if (typeof value !== 'object' || value === null) {
    return Object.is(value, -0) ? '-0' : `${typeof value}:${String(value)}`
  }

  return `object:{${Object.entries(value)
    .map(([field, held]) => `${field}=${String(held)}`)
    .join(',')}}`
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/**
 * Elements are drawn from four families on purpose. The primitives collide often, so groups grow;
 * the traps carry the values whose equality the contract had to settle; the records are fresh
 * objects every draw, so element identity is a real question; and the strings give the
 * first-character key function something to work with.
 */
const anyElement = fc.oneof(
  { weight: 4, arbitrary: fc.integer({ min: -4, max: 4 }) },
  { weight: 2, arbitrary: fc.string({ maxLength: 3 }) },
  {
    weight: 2,
    // Spread into an ordinary object: measured, `fc.record` builds its records with a null
    // prototype, and `String(record)` then throws rather than producing "[object Object]". A key
    // function that throws is a case this contract settles on purpose in block 4.4; a generator that
    // makes the *well-behaved* key functions throw is a defect in the generator, and it would have
    // been read as this contract failing a property it does not fail.
    arbitrary: fc
      .record({ team: fc.constantFrom('red', 'blue', 'green'), id: fc.nat({ max: 5 }) })
      .map((record) => ({ ...record })),
  },
  {
    weight: 1,
    arbitrary: fc.constantFrom<unknown[]>(
      Number.NaN,
      -0,
      0,
      undefined,
      null,
      true,
      '1',
      1,
      '__proto__',
      'constructor',
    ),
  },
)

const anyItems = fc.array(anyElement, { maxLength: 24 })

type NamedKeyFunction = {
  readonly name: string
  readonly keyOf: (item: unknown, index: number) => unknown
}

/** Fixed so that the key function returning them stays a function of its arguments. */
const OBJECT_KEYS = [{ bucket: 0 }, { bucket: 1 }, { bucket: 2 }] as const

/**
 * The key functions the properties are quantified over. Each one is a pure function of its two
 * arguments, and each one puts the result in a region some property polices.
 *
 * `integerLikeStrings` earns its place alone: it is the only one that produces keys which an object
 * would reorder, so it is the only draw under which the group-order property can tell a Map-shaped
 * answer from an object-shaped one. `prototypeNames` is the same argument for the keys that name
 * something on `Object.prototype`.
 */
const keyFunctions: readonly NamedKeyFunction[] = [
  { name: 'identity', keyOf: (item) => item },
  { name: 'constant', keyOf: () => 'all' },
  { name: 'typeof', keyOf: (item) => typeof item },
  { name: 'indexParity', keyOf: (_item, index) => index % 2 },
  { name: 'stringified', keyOf: (item) => String(item) },
  {
    name: 'integerLikeStrings',
    keyOf: (_item, index) => String([10, 2, 1, 30, 4][index % 5]),
  },
  {
    name: 'prototypeNames',
    keyOf: (_item, index) => ['__proto__', 'constructor', 'toString', 'valueOf'][index % 4],
  },
  // Three fixed objects rather than a fresh one per call. A key function returning `{ bucket: n }`
  // is not a pure function of its arguments under this contract's key equality, because two objects
  // with the same fields are two different keys - so it makes the determinism property fail on a
  // correct implementation. That is the conditional of block 4.2 biting in the generator itself.
  { name: 'objectKeys', keyOf: (_item, index) => OBJECT_KEYS[index % 3] },
  { name: 'nanAndZeroes', keyOf: (_item, index) => [Number.NaN, -0, 0, 1][index % 4] },
]

const anyKeyFunction = fc.constantFrom(...keyFunctions)

// ---------------------------------------------------------------------------
// One call, with what the key function was asked recorded as it happens
// ---------------------------------------------------------------------------

type Call = { readonly item: unknown; readonly index: number; readonly key: unknown }

type Observed = {
  readonly result: Map<unknown, unknown[]>
  readonly calls: readonly Call[]
}

const observe = (items: readonly unknown[], named: NamedKeyFunction): Observed => {
  const calls: Call[] = []
  const recorded = (item: unknown, index: number): unknown => {
    const key = named.keyOf(item, index)
    calls.push({ item, index, key })

    return key
  }

  return { result: groupBy(items, recorded), calls }
}

/** The calls that produced a given group key, in the order they happened. */
const callsUnder = (calls: readonly Call[], key: unknown): readonly Call[] =>
  calls.filter((call) => Object.is(asMapKey(call.key), key))

// ---------------------------------------------------------------------------
// Specific properties
// ---------------------------------------------------------------------------

describe('array/group-by@1 specific properties', () => {
  it('p1-the-groups-partition-the-input :: every element appears once, in exactly one group', () => {
    // The liveness property of this contract, and the reason it is stated as a multiset rather than
    // as a count. A count catches an implementation that loses an element and misses one that files
    // an element under two keys; the multiset catches both, and catches an implementation that
    // returns an empty Map, which satisfies every safety property here for free.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const flattened = [...groupBy(items, named.keyOf).values()].flat()

        return sameMultiset(multiset(flattened), multiset(items))
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p2-a-group-is-coherent-and-stable :: a group holds exactly the elements given its key, in the order they were given it', () => {
    // Coherence and stability are one statement rather than two, because separating them would
    // assert the same thing twice: a guard requiring every element of a group to carry that group's
    // key, and a second requiring the group to be in input order, are both this one walk. Written as
    // two guards, the weaker of them would never be the only thing to fail.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const { result, calls } = observe(items, named)

        return [...result.entries()].every(([key, group]) => {
          const expected = callsUnder(calls, key)

          return (
            group.length === expected.length &&
            group.every((item, at) => Object.is(item, (expected[at] as Call).item))
          )
        })
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p3-groups-come-back-in-first-seen-order :: the groups come back in the order their keys were first seen', () => {
    // The property the return type was chosen for. It is the only guard that separates a Map-shaped
    // answer from an object-shaped one on the general case, and it is only able to do so on the
    // draws where `integerLikeStrings` supplies keys an object would reorder - which is why that key
    // function exists and why the battery probes that it is reached.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const { result, calls } = observe(items, named)

        const firstSeen: unknown[] = []
        for (const call of calls) {
          const key = asMapKey(call.key)
          if (!firstSeen.some((seen) => Object.is(seen, key))) firstSeen.push(key)
        }

        const actual = [...result.keys()]

        return (
          actual.length === firstSeen.length &&
          actual.every((key, at) => Object.is(key, firstSeen[at]))
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p4-no-group-is-shared-or-aliased :: no group is the input array, and no two groups are the same array', () => {
    // The guard against the fast path nobody writes on purpose and everybody writes eventually:
    // "one key, so hand back the array we were given". It has mutated nothing, so the non-mutation
    // property is green on it, and it answers the right elements in the right order, so P1, P2 and
    // P3 are green too - and it gives the caller a group whose later edits reach back into the
    // array it grouped. The aliasing half catches the accumulator hoisted out of the loop.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const groups = [...groupBy(items, named.keyOf).values()]

        if (groups.some((group) => (group as unknown) === (items as unknown))) return false

        return groups.every((group, at) => groups.every((other, elsewhere) => at === elsewhere || group !== other))
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p5-one-call-per-element :: in index order, with the element and its index', () => {
    // The obligation of block 4.2, and the load-bearing one. It assumes nothing about the key
    // function, so it holds where the conditional properties below are restricted - and it is what
    // makes that restriction safe: an implementation allowed one look per element has no second look
    // through which to answer differently from what it was told.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const { calls } = observe(items, named)

        return (
          calls.length === items.length &&
          calls.every((call, at) => call.index === at && Object.is(call.item, items[at]))
        )
      }),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// Universal properties
// ---------------------------------------------------------------------------

describe('array/group-by@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    expectUniversalPropertiesAnswered(universalProperties, ['no ambient output'])
  })

  it('no-mutation-of-arguments', () => {
    // Two claims, and the third one a reader expects here is deliberately not among them: that no
    // group is the input array is P4, because it is a statement about the result rather than about
    // the input, and an implementation can satisfy this property while failing it.
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) => {
        const elementsBefore = [...items]
        const contentsBefore = items.map(snapshotOf)

        groupBy(items, named.keyOf)

        return (
          items.length === elementsBefore.length &&
          items.every((item, at) => Object.is(item, elementsBefore[at])) &&
          items.every((item, at) => snapshotOf(item) === contentsBefore[at])
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('determinism :: the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyItems, anyKeyFunction, (items, named) =>
        outputsAreEqual(groupBy(items, named.keyOf), groupBy(items, named.keyOf)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the calls made before it', () => {
    fc.assert(
      fc.property(
        anyItems,
        anyKeyFunction,
        fc.array(fc.tuple(anyItems, anyKeyFunction), { maxLength: 8 }),
        (items, named, history) => {
          const first = groupBy(items, named.keyOf)
          for (const [earlierItems, earlierKey] of history) groupBy(earlierItems, earlierKey.keyOf)

          return outputsAreEqual(groupBy(items, named.keyOf), first)
        },
      ),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// The declarations the properties above rest on
// ---------------------------------------------------------------------------

describe('array/group-by@1 property preconditions', () => {
  it('declares-a-statement-for-every-key-function-rule', () => {
    const unexplained = keyFunctionRules.filter((rule) => rule.statement.trim() === '')

    expect(unexplained.map((rule) => rule.name)).toEqual([])
  })

  it('declares-the-kinds-of-key-function-rule :: the precondition, and the obligations that make the rest testable', () => {
    // The shape of block 4.2 is itself a claim: that delegating purity to the caller produces one
    // requirement no test can enforce, and that everything else is either owed by the contract or
    // conditional on a well-behaved argument. If a later revision quietly turned an obligation into
    // a precondition - the cheap way to make a failing guard go away - this is what would catch it.
    const kinds = keyFunctionRules.map((rule) => rule.kind)

    expect({
      obligations: kinds.filter((kind) => kind === 'obligation').length,
      conditionals: kinds.filter((kind) => kind === 'conditional').length,
      preconditions: kinds.filter((kind) => kind === 'precondition').length,
    }).toEqual({ obligations: 4, conditionals: 1, preconditions: 1 })
  })

  it('support-the-key-functions-reach-every-region', () => {
    // Without this the properties above are guards whose support is a matter of hope. Each entry is
    // a region some property can only fail in, and the assertion is that the declared key functions
    // put a result there at all - the battery's probes then check that the *arbitraries* reach them
    // under the declared number of runs.
    const items = [0, 1, 2, 3, 4, 5, 6, 7]
    const reached = Object.fromEntries(
      keyFunctions.map((named) => [named.name, groupBy(items, named.keyOf).size]),
    )

    expect({
      oneGroupForEverything: reached['constant'],
      oneGroupPerElement: reached['identity'],
      keysAnObjectWouldReorder: reached['integerLikeStrings'],
      keysNamedOnObjectPrototype: reached['prototypeNames'],
      keysThatAreObjects: reached['objectKeys'],
      keysThatAreNaNAndZero: reached['nanAndZeroes'],
    }).toEqual({
      oneGroupForEverything: 1,
      oneGroupPerElement: 8,
      keysAnObjectWouldReorder: 5,
      keysNamedOnObjectPrototype: 4,
      keysThatAreObjects: 3,
      keysThatAreNaNAndZero: 3,
    })
  })
})
