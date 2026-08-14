import { describe, it, expect } from 'vitest'
import {
  CASE_TABLE_IS_ADDRESSED,
  expectEveryCaseIsAddressed,
  CASE_TABLE_IS_JUSTIFIED,
  CASE_TABLE_IS_PARTITIONED,
  expectEveryCaseIsGrouped,
  expectEveryCaseIsJustified,
} from '../../../../catalogue/every-contract.js'
import { outputsAreEqual } from './contract.js'
import { edgeCaseGroups, edgeCases } from './edge-cases.js'
import { levenshtein } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the equality
 * semantics the contract declares - `Object.is`, so that an implementation ending in `Math.round` and
 * answering `-0` fails here instead of slipping through a `===` comparison.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule. The two
 * strings are carried by the failure message instead, where a mutant may rewrite them freely because
 * nothing identifies a guard by them.
 */

/**
 * Failure messages must survive a terminal: a third of this table is astral characters, combining
 * marks and an unpaired surrogate, and three of its entries printed raw would look identical.
 */
const printable = (text: string): string =>
  [...text]
    .map((point) => {
      const code = point.codePointAt(0) ?? 0
      return code > 0x7f ? `\\u{${code.toString(16)}}` : point
    })
    .join('')

describe('string/levenshtein@1 named edge cases', () => {
  for (const { id, a, b, expected } of edgeCases) {
    it(id, () => {
      const actual = levenshtein(a, b)

      expect(
        outputsAreEqual(actual, expected),
        `"${printable(a)}" against "${printable(b)}": expected ${expected}, received ${actual}`,
      ).toBe(true)
    })
  }
})

/**
 * The same pair of strings with every UTF-16 code unit rewritten as a distinct code point of the
 * private use area, so that the reference - which counts code points - counts code units instead.
 *
 * It is a change of alphabet rather than a second implementation, and that is the point: this file
 * measures the convention the ecosystem uses without holding a copy of the recurrence that could
 * drift from the one under test. The rewriting is order-preserving and injective, and an edit
 * distance depends only on which units are equal to which, so the number it produces is exactly what
 * `fastest-levenshtein` and `leven` would answer.
 */
const inCodeUnits = (a: string, b: string): number => {
  const seen = new Map<number, string>()
  const recoded = (text: string): string =>
    Array.from({ length: text.length }, (_, at) => {
      const unit = text.charCodeAt(at)
      const already = seen.get(unit)
      if (already !== undefined) return already

      const fresh = String.fromCharCode(0xe000 + seen.size)
      seen.set(unit, fresh)

      return fresh
    }).join('')

  return levenshtein(recoded(a), recoded(b))
}

describe('string/levenshtein@1 edge case table', () => {
  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...edgeCases.map((edgeCase) => edgeCase.id),
    ])
  })

  it('settles-each-pair-once', () => {
    const pairs = edgeCases.map(({ a, b }) => `${printable(a)} ${printable(b)}`)

    expect(pairs).toHaveLength(new Set(pairs).size)
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([{ name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases }])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })

  it('the-cases-that-separate-from-the-ecosystem :: named exactly, on the rows where counting code points and counting code units part', () => {
    // The table is small because the axioms of block 4.2 carry the arithmetic, so what is left for
    // it to do is the region no axiom reaches: the answers that differ between counting code points
    // and counting UTF-16 code units. This guard is that claim, replayed rather than asserted - the
    // divergence block 4.2 argues for is measured here, on the rows it happens on and on no others.
    // A table that lost them would settle nothing the ecosystem does not already agree on, and it
    // would go on passing.
    const separating = edgeCases
      .filter(({ a, b, expected }) => inCodeUnits(a, b) !== expected)
      .map(({ id }) => id)

    expect(separating).toEqual([
      'an-astral-character-is-one-unit',
      'an-astral-character-inside-a-word',
      'two-astral-characters-and-one',
      'a-grapheme-is-not-the-unit',
    ])
  })
})
