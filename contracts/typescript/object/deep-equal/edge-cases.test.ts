import { describe, it, expect } from 'vitest'
import {
  CASE_TABLE_IS_ADDRESSED,
  CASE_TABLE_IS_JUSTIFIED,
  CASE_TABLE_IS_PARTITIONED,
  expectEveryCaseIsAddressed,
  expectEveryCaseIsGrouped,
  expectEveryCaseIsJustified,
} from '../../../../packages/catalogue/every-contract.js'
import { outputsAreEqual } from './contract.js'
import { edgeCaseGroups, edgeCases } from './edge-cases.js'
import { deepEqual } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the equality
 * semantics the contract declares.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule and is what
 * makes the title stable under a specification mutant. What the title would otherwise carry - the
 * pair, rendered - is in the failure message, where a mutant may rewrite it freely because nothing
 * identifies a guard by it.
 *
 * **The renderer below has to survive a value that holds itself**, which is not a nicety here: five
 * rows of this table are graphs that return to themselves, and a message that threw while being built
 * would turn a red guard into an error with no answer in it.
 *
 * It also has to stay small. A `ContractSource` printed by a neighbouring guard once produced
 * 1 177 066 bytes on a red run and overflowed the mutation instrument's buffer, which reported the
 * cell that reddened it as a mutant that did not compile. Nothing here renders more than a shape.
 */

/**
 * A value as a shape rather than as its contents, cycle-safe and bounded.
 *
 * Depth and breadth are cut deliberately: what a reader needs from a failure is which pair was asked,
 * and every pair in this table is identified by two or three levels.
 */
const rendered = (value: unknown, depth = 0, seen = new Set<unknown>()): string => {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'bigint') return `${value}n`
  if (Object.is(value, -0)) return '-0'
  if (value === null || typeof value !== 'object') return String(value)
  if (seen.has(value)) return '<itself>'
  if (depth > 2) return '…'

  seen.add(value)

  const inner = (part: unknown): string => rendered(part, depth + 1, seen)
  const prototype = Object.getPrototypeOf(value) as object | null

  // The kind is read off the prototype and not off `Object.prototype.toString`, because a class
  // instance and a plain object share the tag `[object Object]` and this table settles the difference
  // between them twice. A null prototype is named for the same reason: it is invisible to every other
  // rendering and it is what two of these rows are about.
  const tag =
    prototype === null
      ? 'null-prototype'
      : ((prototype as { readonly constructor?: { readonly name?: string } }).constructor?.name ??
        'anonymous-prototype')

  if (value instanceof Set) return `Set(${[...value].map(inner).join(', ')})`
  if (value instanceof Map) {
    return `Map(${[...value].map(([key, held]) => `${inner(key)} => ${inner(held)}`).join(', ')})`
  }
  if (value instanceof RegExp) return String(value)
  if (value instanceof Date) return `Date(${value.getTime()})`
  if (value instanceof Error) return `${value.name}(${JSON.stringify(value.message)})`
  const held = value as unknown as Record<string | symbol, unknown>

  if (Array.isArray(value)) {
    // Own keys rather than iteration, because a hole and a stored `undefined` are two different
    // things here and iteration renders them alike - which would make the failure message of
    // `a-hole-is-not-an-undefined` read as though the two sides were identical.
    return `[${Reflect.ownKeys(value)
      .filter((key) => key !== 'length')
      .map((key) => `${String(key)}: ${inner(held[key])}`)
      .join(', ')}]`
  }
  // Elements and not just the kind: two of these rows are float arrays that differ only in what they
  // hold, and a rendering that stopped at the kind would print the same message for both.
  if (ArrayBuffer.isView(value)) {
    return `${tag}(${[...(value as unknown as Iterable<unknown>)].map(inner).join(', ')})`
  }
  if (value instanceof ArrayBuffer) return `${tag}(${value.byteLength} bytes)`

  const body = Reflect.ownKeys(value)
    .map((key) => `${String(key)}: ${inner(held[key])}`)
    .join(', ')

  return `${tag === 'Object' ? '' : `${tag} `}{${body}}`
}

const call = (left: unknown, right: unknown): string =>
  `deepEqual(${rendered(left)}, ${rendered(right)})`

describe('object/deep-equal@1 named edge cases', () => {
  for (const { id, left, right, expected } of edgeCases) {
    it(id, () => {
      const actual = deepEqual(left, right)

      expect(
        outputsAreEqual(actual, expected),
        `${call(left, right)}: expected ${expected}, received ${actual}`,
      ).toBe(true)
    })
  }
})

/**
 * And the same pair the other way round, which is a second claim rather than a restatement.
 *
 * `p2-symmetric` draws its pairs and this asserts it on the ones the contract settles by name - the
 * cycles, the collections, the boxed primitives and the values outside the domain, none of which a
 * generator reaches with any reliability. An implementation whose collection matching claims members
 * greedily answers differently depending on which side it walks first, and it is the named rows that
 * carry the shapes where that happens.
 */
describe('object/deep-equal@1 named edge cases, transposed', () => {
  for (const { id, left, right, expected } of edgeCases) {
    it(`${id}-transposed`, () => {
      const actual = deepEqual(right, left)

      expect(
        outputsAreEqual(actual, expected),
        `${call(right, left)}: expected ${expected}, received ${actual}`,
      ).toBe(true)
    })
  }
})

describe('object/deep-equal@1 edge case table', () => {
  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...edgeCases.map((edgeCase) => edgeCase.id),
    ])
  })

  it('settles-each-pair-once', () => {
    // A call is the pair, so the key is both halves, rendered rather than joined: two rows settling
    // one pair would be a table that looks larger than the number of questions it answers.
    const pairs = edgeCases.map(({ left, right }) => call(left, right))

    expect(pairs).toHaveLength(new Set(pairs).size)
  })

  it('answers-both-ways :: the table settles calls that agree and calls that do not', () => {
    // A table of nothing but `false` rows is satisfied by an implementation that never answers
    // `true`, and one of nothing but `true` rows by `() => true`. Both are populated here and this
    // says so, because the shape of a table is a claim about what it is able to catch. It is the same
    // question `p6-a-perturbed-clone-is-not-the-original` asks of the properties, one block over.
    const agreeing = edgeCases.filter(({ expected }) => expected).length

    expect({
      agreeing: agreeing > 0,
      differing: edgeCases.length - agreeing > 0,
    }).toEqual({ agreeing: true, differing: true })
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([{ name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases }])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })
})
