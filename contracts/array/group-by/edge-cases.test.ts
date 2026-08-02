import { describe, it, expect } from 'vitest'
import type { ExpectedCall, ExpectedGroup, Outcome } from './edge-cases.js'
import { THE_KEY_FUNCTION_ERROR, edgeCases, untypedCallerCases } from './edge-cases.js'
import { groupBy } from './reference.js'

/**
 * Block 4.4, executable.
 *
 * The comparison is written here rather than taken from `outputsAreEqual` in the contract, and the
 * reason is one of the cases. That helper compares two results; using it would mean building the
 * expected side as a Map, and `Map.prototype.set` normalises a -0 key to +0 - so the case that pins
 * that normalisation would be normalised on both sides and could no longer fail. The table is
 * therefore compared entry by entry against literals, with `Object.is`, exactly as the contract's
 * key equality declares.
 *
 * Each case is called exactly once, and everything the table says about it is asserted from that one
 * call. That is not a stylistic choice. Two cases carry state - a key function that answers
 * differently the second time it sees an element, and one that writes to the element it is given -
 * and a second `describe` re-running the table would make those two answer differently depending on
 * which block of tests ran first. A table whose cases interfere is a table that settles nothing.
 */

/**
 * Distinct objects that print alike are given a stable tag, so a failure message can tell two keys
 * apart that `String` cannot. Without it the two-distinct-objects case fails with "expected [object
 * Object], received [object Object]".
 */
const tags = new WeakMap<object, string>()
let nextTag = 0

const render = (value: unknown): string => {
  if (Object.is(value, -0)) return '-0'
  if (typeof value === 'symbol') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value !== 'object' || value === null) return String(value)

  const existing = tags.get(value)
  if (existing !== undefined) return existing

  nextTag += 1
  const tag = `${Array.isArray(value) ? 'array' : 'object'}#${nextTag}`
  tags.set(value, tag)

  return tag
}

const renderGroups = (groups: readonly ExpectedGroup[]): string =>
  groups.length === 0
    ? '(no groups)'
    : groups
        .map(([key, group]) => `${render(key)} => [${group.map(render).join(', ')}]`)
        .join('  |  ')

const renderCalls = (calls: readonly ExpectedCall[]): string =>
  calls.length === 0
    ? '(no calls)'
    : calls.map(([item, index]) => `(${render(item)}, ${index})`).join(' ')

const groupingMatches = (
  actual: readonly ExpectedGroup[],
  expected: readonly ExpectedGroup[],
): boolean => {
  if (actual.length !== expected.length) return false

  return actual.every(([key, group], at) => {
    const [expectedKey, expectedGroup] = expected[at] as ExpectedGroup

    if (!Object.is(key, expectedKey) || group.length !== expectedGroup.length) return false

    return group.every((item, index) => Object.is(item, expectedGroup[index]))
  })
}

const callsMatch = (actual: readonly ExpectedCall[], expected: readonly ExpectedCall[]): boolean =>
  actual.length === expected.length &&
  actual.every(([item, index], at) => {
    const [expectedItem, expectedIndex] = expected[at] as ExpectedCall

    return Object.is(item, expectedItem) && index === expectedIndex
  })

type Attempt =
  | { readonly kind: 'returned'; readonly result: Map<unknown, unknown[]> }
  | { readonly kind: 'threw'; readonly error: unknown }

/** One call, with the key function wrapped so that what it was asked is recorded as it happens. */
const callOnce = (
  items: readonly unknown[],
  keyOf: (item: unknown, index: number) => unknown,
): { readonly attempt: Attempt; readonly calls: readonly ExpectedCall[] } => {
  const calls: ExpectedCall[] = []
  const recorded = (item: unknown, index: number): unknown => {
    calls.push([item, index])

    return keyOf(item, index)
  }

  try {
    return { attempt: { kind: 'returned', result: groupBy(items, recorded) }, calls }
  } catch (error: unknown) {
    return { attempt: { kind: 'threw', error }, calls }
  }
}

const assertOutcome = (outcome: Outcome, attempt: Attempt): void => {
  if (outcome.kind === 'groups') {
    if (attempt.kind === 'threw') {
      throw new Error(
        `expected ${renderGroups(outcome.groups)}, but the call threw ${String(attempt.error)}`,
      )
    }

    // The return type is the decision block 4.2 argues hardest for, and a type test cannot see an
    // implementation that ships as JavaScript.
    expect(attempt.result).toBeInstanceOf(Map)

    const actual = [...attempt.result.entries()]

    expect(
      groupingMatches(actual, outcome.groups),
      `expected ${renderGroups(outcome.groups)}, received ${renderGroups(actual)}`,
    ).toBe(true)

    return
  }

  if (attempt.kind === 'returned') {
    throw new Error(
      `expected a throw, but the call returned ${renderGroups([...attempt.result.entries()])}`,
    )
  }

  if (outcome.kind === 'propagates') {
    // Identity, not shape: the contract promises the caller's own error object, unwrapped.
    expect(attempt.error).toBe(THE_KEY_FUNCTION_ERROR)

    return
  }

  expect((attempt.error as Error).constructor.name).toBe(outcome.errorName)
}

describe('array/group-by@1 named edge cases', () => {
  for (const { title, items, keyOf, outcome, expectedCalls } of edgeCases) {
    it(title, () => {
      const elementsBefore = [...items]
      const { attempt, calls } = callOnce(items, keyOf)

      assertOutcome(outcome, attempt)

      if (expectedCalls !== undefined) {
        expect(
          callsMatch(calls, expectedCalls),
          `expected the key function to be asked ${renderCalls(expectedCalls)}, ` +
            `it was asked ${renderCalls(calls)}`,
        ).toBe(true)
      }

      // Asserted on every case, including the one whose key function throws: the array the caller
      // passed holds the same elements in the same order afterwards. Element identity rather than
      // element contents, because one case has a key function that legitimately writes to its own
      // element and that write is the caller's, not this function's.
      expect(
        items.length === elementsBefore.length &&
          items.every((item, index) => Object.is(item, elementsBefore[index])),
        `the input was rewritten: ${renderGroups([['before', elementsBefore], ['after', [...items]]])}`,
      ).toBe(true)
    })
  }
})

describe('array/group-by@1 inputs only an untyped caller can pass', () => {
  for (const { title, items, keyOf, outcome } of untypedCallerCases) {
    it(title, () => {
      // The cast is the whole point of this table: these are the calls TypeScript refuses and
      // JavaScript makes anyway, and block 4.4 settles them so two implementations cannot differ.
      const { attempt } = callOnce(items as readonly unknown[], keyOf)

      assertOutcome(outcome, attempt)
    })
  }
})

describe('array/group-by@1 edge case table', () => {
  it('titles each case exactly once, across both tables', () => {
    const titles = [...edgeCases, ...untypedCallerCases].map((edgeCase) => edgeCase.title)

    expect(titles).toHaveLength(new Set(titles).size)
  })

  it('publishes a rationale for every decision', () => {
    const undocumented = [...edgeCases, ...untypedCallerCases].filter(
      (edgeCase) => edgeCase.rationale.trim() === '',
    )

    expect(undocumented.map((edgeCase) => edgeCase.title)).toEqual([])
  })
})
