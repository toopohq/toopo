/**
 * Block 4.4 of contract `string/levenshtein@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `catalogue/every-contract.ts`. What is here is this contract's own table.
 *
 * It is the smallest table in the catalogue and the reason is worth stating, because it is the format
 * finding this contract was written to produce. The three earlier contracts were carried by their
 * tables: `number/parse@1` settles fifty inputs because its properties are weak - a grammar has no
 * algebra, so almost everything it decides has to be decided one input at a time. Here the four
 * axioms of block 4.2 hold of every pair of strings at once, and between them they refuse whole
 * families of wrong answer that no case names. What is left for a table is the region no axiom
 * reaches: the arithmetic anchors a reader recognises, and the unit an edit is counted in, which is a
 * decision about the alphabet rather than about the distance and which every axiom is blind to.
 *
 * Every expected distance below was computed by two independent oracles before the reference existed,
 * so the table judges the implementation rather than transcribing it: a breadth-first search over the
 * strings reachable by single edits, which never builds a matrix, and a Wagner-Fischer matrix filled
 * column by column where the reference fills it row by row. They agreed on all twenty-three cases.
 *
 * Every case here is `specified`. No mutant has yet required an entry to be added - a fact about this
 * table's short history rather than a virtue.
 */

import type { CaseGroup } from '../../../../catalogue/identifier.js'
import type { Provenance } from '../../../../catalogue/every-contract.js'

/**
 * The six questions this table answers, in the order it answers them. Frozen with the major - see
 * `CaseGroup`.
 */
export const edgeCaseGroups: readonly CaseGroup[] = [
  { id: 'the-two-ends-of-the-scale', title: 'The two ends of the scale', note: null },
  { id: 'one-edit-of-each-kind', title: 'One edit of each kind', note: null },
  { id: 'the-anchors-a-reader-recognises', title: 'The anchors a reader recognises', note: null },
  { id: 'the-scope-this-contract-does-not-cover', title: 'The scope this contract does not cover', note: null },
  {
    id: 'the-unit-an-edit-is-counted-in',
    title: 'The unit an edit is counted in',
    note:
      'The region no axiom reaches. Every case below is answered differently by an implementation ' +
      'counting UTF-16 code units, which is what the widely used JavaScript implementations do - ' +
      'and every one of them satisfies all four axioms under either counting, so nothing but these ' +
      'rows decides it.',
  },
  { id: 'normalisation', title: 'Normalisation is not applied', note: null },
]

export type EdgeCase = {
  readonly id: string
  /** Which of `edgeCaseGroups` this case sits under. */
  readonly group: string
  readonly a: string
  readonly b: string
  readonly expected: number
  readonly provenance: Provenance
  readonly rationale: string
}

/**
 * Written as escapes rather than pasted, because every one of them is either invisible in source or
 * indistinguishable on screen from a different string this table also settles. `PRECOMPOSED_E_ACUTE`
 * and `DECOMPOSED_E_ACUTE` are the same glyph and carry different answers here; a copy or a re-encode
 * would quietly merge them and delete the case.
 */
const GRINNING_FACE = String.fromCodePoint(0x1f600)
const WOMAN = String.fromCodePoint(0x1f469)
const LAPTOP = String.fromCodePoint(0x1f4bb)
const ZERO_WIDTH_JOINER = String.fromCodePoint(0x200d)
const LONE_HIGH_SURROGATE = String.fromCharCode(0xd83d)
const COMBINING_ACUTE = String.fromCodePoint(0x0301)
const PRECOMPOSED_E_ACUTE = String.fromCodePoint(0x00e9)
const DECOMPOSED_E_ACUTE = `e${COMBINING_ACUTE}`

/**
 * The axiom before its degenerate instance, which is a reading order and not an address.
 *
 * `both-empty` used to open the table and therefore opened the page's playground, where it renders as
 * two empty fields answering `0`: a reader arriving on it has nothing to edit and has watched nothing
 * happen. `identical-text` is the same claim with something in it - change one character of either
 * side and the answer moves to 1, which is the whole idea in one keystroke.
 *
 * Nothing here is frozen and nothing was renamed. An `id` is an address and a group membership is a
 * partition; the order of two cases inside one group is neither, and the only order this table
 * declares frozen is the order of its groups. `one-side-empty` and `the-other-side-empty` stay
 * adjacent and in that order, because their own rationales are about being a pair.
 */
export const edgeCases: readonly EdgeCase[] = [
  {
    id: 'identical-text',
    group: 'the-two-ends-of-the-scale',
    a: 'levenshtein',
    b: 'levenshtein',
    expected: 0,
    provenance: 'specified',
    rationale: 'A string is at distance zero from itself, which is the first axiom made concrete.',
  },
  {
    id: 'both-empty',
    group: 'the-two-ends-of-the-scale',
    a: '',
    b: '',
    expected: 0,
    provenance: 'specified',
    rationale:
      'Two empty strings are the same string, so the distance is zero. It is the input an ' +
      'implementation indexing a matrix is most likely to fall off, since the matrix has one cell ' +
      'and no loop body ever runs.',
  },
  {
    id: 'one-side-empty',
    group: 'the-two-ends-of-the-scale',
    a: 'abc',
    b: '',
    expected: 3,
    provenance: 'specified',
    rationale:
      'Turning a string into nothing costs one deletion per code point. It is the anchor that fixes ' +
      'the scale: without it, an implementation could halve every answer and satisfy every axiom.',
  },
  {
    id: 'the-other-side-empty',
    group: 'the-two-ends-of-the-scale',
    a: '',
    b: 'abc',
    expected: 3,
    provenance: 'specified',
    rationale:
      'The same call the other way round, and the cheapest case that can catch an implementation ' +
      'pricing an insertion differently from a deletion. Both directions are named rather than left ' +
      'to the symmetry property, because this is the pair where the price is set.',
  },

  {
    id: 'one-substitution',
    group: 'one-edit-of-each-kind',
    a: 'abc',
    b: 'abd',
    expected: 1,
    provenance: 'specified',
    rationale:
      'Replacing one code point costs one edit and not two. An implementation offering only ' +
      'insertion and deletion - which is the longest common subsequence distance, and a real thing ' +
      'a reader may have implemented before - answers two here and is correct everywhere the ' +
      'lengths differ.',
  },
  {
    id: 'one-insertion',
    group: 'one-edit-of-each-kind',
    a: 'ab',
    b: 'abc',
    expected: 1,
    provenance: 'specified',
    rationale: 'Adding one code point costs one edit.',
  },
  {
    id: 'one-deletion',
    group: 'one-edit-of-each-kind',
    a: 'abc',
    b: 'ab',
    expected: 1,
    provenance: 'specified',
    rationale: 'Removing one code point costs one edit, at the same price as adding one.',
  },

  {
    id: 'the-canonical-example',
    group: 'the-anchors-a-reader-recognises',
    a: 'kitten',
    b: 'sitting',
    expected: 3,
    provenance: 'specified',
    rationale:
      'The example every published description of this distance uses: two substitutions and an ' +
      'insertion. It is here so that a reader can check this contract against the definition they ' +
      'already know, without running anything.',
  },
  {
    id: 'a-shared-suffix',
    group: 'the-anchors-a-reader-recognises',
    a: 'Saturday',
    b: 'Sunday',
    expected: 3,
    provenance: 'specified',
    rationale:
      'The second example the literature uses, and the one where the shared letters are not in the ' +
      'same positions - an implementation comparing position by position answers six.',
  },
  {
    id: 'a-shared-infix',
    group: 'the-anchors-a-reader-recognises',
    a: 'flaw',
    b: 'lawn',
    expected: 2,
    provenance: 'specified',
    rationale:
      'The shared part sits in the middle, so neither a shared prefix nor a shared suffix can be ' +
      'trimmed. It is the case an implementation that trims common affixes has to get right by ' +
      'doing the work rather than by avoiding it.',
  },

  {
    id: 'a-transposition',
    group: 'the-scope-this-contract-does-not-cover',
    a: 'ab',
    b: 'ba',
    expected: 2,
    provenance: 'specified',
    rationale:
      'Two adjacent code points swapped cost two edits, not one. This is the single decision that ' +
      'separates this contract from Damerau-Levenshtein, where a transposition is one operation, and ' +
      'it is settled on the smallest input that can express it. The two are different distances - ' +
      'Damerau is not a metric refinement of this one, it is another function - so a caller who ' +
      'wants a swapped pair of letters to cost one wants a different contract, not an option here.',
  },
  {
    id: 'a-transposition-inside-a-word',
    group: 'the-scope-this-contract-does-not-cover',
    a: 'form',
    b: 'from',
    expected: 2,
    provenance: 'specified',
    rationale:
      'The same decision on the typo a reader will actually meet. It is named separately because ' +
      '`ab` and `ba` read as an abstract pair, and this one is the input that makes a caller ask ' +
      'why their spelling corrector ranks it below a single substitution.',
  },
  {
    id: 'case-is-a-difference',
    group: 'the-scope-this-contract-does-not-cover',
    a: 'Alice',
    b: 'alice',
    expected: 1,
    provenance: 'specified',
    rationale:
      'An upper-case letter and its lower-case form are two different code points, one edit apart. ' +
      'That is scope rather than a gap: folding the case would make two different strings zero ' +
      'apart, which is the discernibility axiom failing, and it would make the answer depend on the ' +
      'ambient locale, since `I` does not lower-case to `i` in Turkish. A caller who wants case to ' +
      'be ignored lower-cases both arguments, in the locale it chooses, before calling.',
  },
  {
    id: 'a-space-is-a-code-point',
    group: 'the-scope-this-contract-does-not-cover',
    a: 'a b',
    b: 'ab',
    expected: 1,
    provenance: 'specified',
    rationale:
      'Whitespace is text like any other text: no trimming, no collapsing, no ignoring. Named ' +
      'because a caller comparing user input will meet it on the first day, and because the ' +
      'alternative - a distance that skips whitespace - is not a metric on strings.',
  },

  {
    id: 'an-astral-character-is-one-unit',
    group: 'the-unit-an-edit-is-counted-in',
    a: GRINNING_FACE,
    b: '',
    expected: 1,
    provenance: 'specified',
    rationale:
      'One emoji is one edit away from nothing. Measured, an implementation counting UTF-16 code ' +
      'units answers two, because an astral character occupies two of them - so a caller who ' +
      'deleted one character is told that two edits happened. This is the case block 4.2 chooses the ' +
      'unit on, and the whole reason this contract diverges from the ecosystem.',
  },
  {
    id: 'an-astral-character-inside-a-word',
    group: 'the-unit-an-edit-is-counted-in',
    a: `a${GRINNING_FACE}b`,
    b: 'ab',
    expected: 1,
    provenance: 'specified',
    rationale:
      'The same decision where the astral character is surrounded by ordinary text, which is where ' +
      'it actually occurs. An implementation counting code units answers two here as well, and its ' +
      'intermediate step is a string holding half of a character.',
  },
  {
    id: 'two-astral-characters-and-one',
    group: 'the-unit-an-edit-is-counted-in',
    a: `${GRINNING_FACE}${GRINNING_FACE}`,
    b: GRINNING_FACE,
    expected: 1,
    provenance: 'specified',
    rationale:
      'Two identical astral characters against one. It is named because it is the case where a ' +
      'code-unit implementation still answers a plausible number - two - rather than an obviously ' +
      'wrong one, so nothing but the declared unit distinguishes the two answers.',
  },
  {
    id: 'a-grapheme-is-not-the-unit',
    group: 'the-unit-an-edit-is-counted-in',
    a: `${WOMAN}${ZERO_WIDTH_JOINER}${LAPTOP}`,
    b: WOMAN,
    expected: 2,
    provenance: 'specified',
    rationale:
      'A joined emoji sequence is three code points, so removing the joiner and the second symbol ' +
      'costs two edits. Counting grapheme clusters instead would answer one, and block 4.2 records ' +
      'why that unit is refused: it costs thirty times the decomposition, it reads the process ' +
      'default locale, and its boundaries follow whichever Unicode version the runtime carries.',
  },
  {
    id: 'a-lone-surrogate-is-one-unit',
    group: 'the-unit-an-edit-is-counted-in',
    a: LONE_HIGH_SURROGATE,
    b: '',
    expected: 1,
    provenance: 'specified',
    rationale:
      'An unpaired surrogate is a code point of its own and costs one edit. It is not a well-formed ' +
      'character and it reaches this function anyway, out of a truncated string or a byte-level ' +
      'slice, so the contract settles it rather than leaving two implementations free to disagree.',
  },
  {
    id: 'a-surrogate-pair-against-its-own-half',
    group: 'the-unit-an-edit-is-counted-in',
    a: GRINNING_FACE,
    b: LONE_HIGH_SURROGATE,
    expected: 1,
    provenance: 'specified',
    rationale:
      'An emoji against the lone high surrogate that begins it: one substitution, because the two ' +
      'are one code point each. Measured, an implementation counting code units answers one as well ' +
      'and reaches it by a different route - deleting the trailing half - which is why this case is ' +
      'here beside the ones that separate the two conventions rather than instead of them.',
  },

  {
    id: 'normalisation-is-not-applied',
    group: 'normalisation',
    a: PRECOMPOSED_E_ACUTE,
    b: DECOMPOSED_E_ACUTE,
    expected: 2,
    provenance: 'specified',
    rationale:
      'The same glyph written two ways - one precomposed code point against a letter and a ' +
      'combining mark - is two edits apart: one substitution and one insertion. Normalising first ' +
      'would answer zero, and zero for two different strings is the discernibility axiom failing. A ' +
      'caller who wants the two treated as equal normalises both arguments before calling; that ' +
      'composition is exact, and putting it inside this function would take the choice of form away ' +
      'from the caller who has it.',
  },
  {
    id: 'a-combining-mark-is-one-unit',
    group: 'normalisation',
    a: 'e',
    b: DECOMPOSED_E_ACUTE,
    expected: 1,
    provenance: 'specified',
    rationale:
      'Adding a combining mark to a letter costs one edit, because the mark is a code point. It is ' +
      'the half of the decision above that says the two forms are not merely unequal but unequal by ' +
      'a measurable amount.',
  },
  {
    id: 'a-precomposed-character-is-one-unit',
    group: 'normalisation',
    a: PRECOMPOSED_E_ACUTE,
    b: 'e',
    expected: 1,
    provenance: 'specified',
    rationale:
      'The precomposed form against the bare letter is one substitution, where the decomposed form ' +
      'against the bare letter is one insertion. Two ways of writing one glyph sit at the same ' +
      'distance from `e` and at distance two from each other, which is the whole shape of what ' +
      'refusing to normalise means.',
  },
]
