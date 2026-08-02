import { describe, it, expect } from 'vitest'
import {
  expectEveryCaseIsAddressed,
  expectEveryCaseIsJustified,
} from '../../../catalogue/every-contract.js'
import { outputsAreEqual } from './contract.js'
import { edgeCases } from './edge-cases.js'
import { slugify } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the
 * equality semantics the contract declares.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule. The text
 * and the slug are carried by the failure message instead, where a mutant may rewrite them freely
 * because nothing identifies a guard by them.
 */

/**
 * Failure messages must survive a terminal: half of this table is text in scripts a terminal may
 * not have a font for, and four of its rows differ from another row by an invisible code point.
 */
const printable = (text: string): string =>
  [...text]
    .map((point) => {
      const code = point.codePointAt(0) ?? 0
      return code > 0x7f || code < 0x20 ? `\\u{${code.toString(16)}}` : point
    })
    .join('')

describe('string/slugify@1 named edge cases', () => {
  for (const { id, text, expected } of edgeCases) {
    it(id, () => {
      const actual = slugify(text)

      expect(
        outputsAreEqual(actual, expected),
        `"${printable(text)}": expected "${printable(expected)}", received "${printable(actual)}"`,
      ).toBe(true)
    })
  }
})

/**
 * The same rule on a narrower alphabet: every survivor that is not ASCII becomes a boundary.
 *
 * It is a change of alphabet applied to the reference rather than a second implementation, which is
 * the trick `string/levenshtein@1` used to measure the ecosystem's counting convention without
 * holding a copy of the recurrence. The slug is already folded and lower-cased, so mapping its
 * non-ASCII code points to spaces and slugging the result is exactly what this rule answers when
 * only ASCII is allowed to survive.
 */
const underAnAsciiAlphabet = (text: string): string =>
  slugify(
    [...slugify(text)].map((point) => (/[a-z0-9-]/.test(point) ? point : ' ')).join(''),
  )

/**
 * The rows where this contract and an ASCII-only alphabet part company, named rather than inlined
 * so that the mutation battery can blind this guard in one edit. Without that, a lens claiming to
 * read the suite blind to block 4.4 would leave the one guard here that compares an answer against
 * the table's own expectations - measured, it caught fourteen mutants on a column that was supposed
 * to be blind to all of them.
 */
const DIVERGING_UNDER_AN_ASCII_ALPHABET = [
  'a-non-latin-script-is-kept',
  'cyrillic-is-kept',
  'arabic-is-kept',
  'an-indic-mark-is-kept',
  'a-non-latin-digit-is-a-digit',
  'an-astral-letter-is-kept',
  'a-letter-with-no-decomposition-is-kept',
  'a-ligature-letter-is-kept',
  'a-stroked-letter-is-kept',
  'a-mark-reaching-its-base-across-another',
  'a-mark-with-no-base-to-absorb-it-is-kept',
  'a-greek-tonos-is-removed',
  'a-final-sigma-is-not-unified',
  'a-written-final-sigma-is-kept',
  'the-turkish-dotless-i-is-kept',
] as const

describe('string/slugify@1 edge case table', () => {
  it('addresses each case with a unique identifier', () => {
    expectEveryCaseIsAddressed(edgeCases.map((edgeCase) => edgeCase.id))
  })

  it('settles each text exactly once', () => {
    const texts = edgeCases.map(({ text }) => printable(text))

    expect(texts).toHaveLength(new Set(texts).size)
  })

  it('publishes a rationale for every decision', () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })

  it('names exactly the cases that an ASCII-only alphabet answers differently', () => {
    // The decision this contract is most likely to be argued with is that the output alphabet is
    // Unicode rather than `[a-z0-9-]`, and block 4.1 puts it in front for that reason. This guard
    // is that decision replayed rather than asserted: the rows named below are where the two
    // alphabets part company, and six of them are where an ASCII-only answer is the empty slug - a
    // whole writing system reduced to one identifier. A table that lost them would settle nothing
    // an ASCII slugifier does not already settle, and it would go on passing.
    const differing = edgeCases
      .filter(({ text, expected }) => underAnAsciiAlphabet(text) !== expected)
      .map(({ id }) => id)

    expect(differing).toEqual([...DIVERGING_UNDER_AN_ASCII_ALPHABET])
  })

  it('names exactly the texts of this table that share one slug', () => {
    // `lossiness` in block 4.1 says this function is not injective, and a sentence a reader has to
    // believe is worth less than a measurement they can run. These are the collisions the table
    // itself contains, and the `c` group is the one that makes the cost concrete: two different
    // programming languages, one identifier.
    const bySlug = new Map<string, string[]>()
    for (const { id, expected } of edgeCases) {
      bySlug.set(expected, [...(bySlug.get(expected) ?? []), id])
    }

    const colliding = [...bySlug.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([slug, ids]) => `${printable(slug) || '(the empty slug)'}: ${ids.join(', ')}`)

    expect(colliding).toEqual([
      'cafe: a-decomposed-diacritic-folds-alike, a-precomposed-diacritic-folds-alike',
      '(the empty slug): the-empty-string, nothing-retainable, a-lone-surrogate-is-removed',
      'c: a-plus-is-not-a-letter, a-hash-is-not-a-letter',
    ])
  })
})
