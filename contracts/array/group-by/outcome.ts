/**
 * How an outcome of block 4.4 is compared, and how a case is run.
 *
 * Split out of `edge-cases.test.ts` because two files now run this table: the contract's own suite,
 * against the reference, and `language.test.ts`, against `Map.groupBy`. One comparison for both is
 * what makes the second file a measurement of the same claim rather than a second opinion about it.
 *
 * The comparison is written here rather than taken from `outputsAreEqual` in the contract, and the
 * reason is one of the cases. That helper compares two results; using it would mean building the
 * expected side as a Map, and `Map.prototype.set` normalises a -0 key to +0 - so the case that pins
 * that normalisation would be normalised on both sides and could no longer fail. The table is
 * therefore compared entry by entry against literals, with `Object.is`, exactly as the contract's key
 * equality declares.
 */

import { expect } from 'vitest'
import type { ExpectedCall, ExpectedGroup, Outcome } from './edge-cases.js'
import { THE_KEY_FUNCTION_ERROR } from './edge-cases.js'

/** Anything that groups: the reference, and the language's own `Map.groupBy`. */
export type Grouper = (
  items: readonly unknown[],
  keyOf: (item: unknown, index: number) => unknown,
) => Map<unknown, unknown[]>

/**
 * Distinct objects that print alike are given a stable tag, so a failure message can tell two keys
 * apart that `String` cannot. Without it the two-distinct-objects case fails with "expected [object
 * Object], received [object Object]".
 */
const tags = new WeakMap<object, string>()
let nextTag = 0

export const render = (value: unknown): string => {
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

export const renderGroups = (groups: readonly ExpectedGroup[]): string =>
  groups.length === 0
    ? '(no groups)'
    : groups
        .map(([key, group]) => `${render(key)} => [${group.map(render).join(', ')}]`)
        .join('  |  ')

export const renderCalls = (calls: readonly ExpectedCall[]): string =>
  calls.length === 0
    ? '(no calls)'
    : calls.map(([item, index]) => `(${render(item)}, ${index})`).join(' ')

export const groupingMatches = (
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

export const callsMatch = (
  actual: readonly ExpectedCall[],
  expected: readonly ExpectedCall[],
): boolean =>
  actual.length === expected.length &&
  actual.every(([item, index], at) => {
    const [expectedItem, expectedIndex] = expected[at] as ExpectedCall

    return Object.is(item, expectedItem) && index === expectedIndex
  })

export type Attempt =
  | { readonly kind: 'returned'; readonly result: Map<unknown, unknown[]> }
  | { readonly kind: 'threw'; readonly error: unknown }

/** One call, with the key function wrapped so that what it was asked is recorded as it happens. */
export const callOnce = (
  grouper: Grouper,
  items: readonly unknown[],
  keyOf: (item: unknown, index: number) => unknown,
): { readonly attempt: Attempt; readonly calls: readonly ExpectedCall[] } => {
  const calls: ExpectedCall[] = []
  const recorded = (item: unknown, index: number): unknown => {
    calls.push([item, index])

    return keyOf(item, index)
  }

  try {
    return { attempt: { kind: 'returned', result: grouper(items, recorded) }, calls }
  } catch (error: unknown) {
    return { attempt: { kind: 'threw', error }, calls }
  }
}

export const assertOutcome = (outcome: Outcome, attempt: Attempt): void => {
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
