/**
 * Block 4.4 of contract `string/slugify@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `catalogue/every-contract.js`. What is here is this contract's own table.
 *
 * It is the second largest table in the catalogue, and that is the format finding this contract was
 * written to produce rather than a failure to be economical. `string/levenshtein@1` shrank its
 * table to twenty-three because four axioms held of every pair of strings and refused whole
 * families of wrong answer at once. There are no axioms here. The properties of block 4.3 are
 * strong, but they are statements about the *shape* of a slug - it is closed under an alphabet, it
 * is a fixed point, it retains a subsequence - and every one of them is satisfied by a rule that
 * folds the wrong characters. What a slug of a given text should actually *be* is settled one input
 * at a time, because nothing else can settle it.
 *
 * Every expected slug below was computed by two independent implementations of the rule before the
 * reference existed: one streaming code points and carrying a boundary flag, one grouping survivors
 * into runs. They agreed on all forty cases, and the reference agrees with both.
 *
 * Three of the cases were not specified: they were found by being wrong. `a-mark-the-base-absorbs-is-dropped`
 * and `a-mark-reaching-its-base-across-another` are the two counterexamples that broke two
 * successive formulations of the absorb step, and they are the reason the step is written against
 * the base of a run rather than against a neighbour.
 */

import type { Provenance } from '../../../catalogue/every-contract.js'

export type EdgeCase = {
  readonly id: string
  readonly text: string
  readonly expected: string
  readonly provenance: Provenance
  readonly rationale: string
}

/**
 * Written as escapes wherever the string is invisible in source, or indistinguishable on screen
 * from a different string this table also settles. `PRECOMPOSED_CAFE` and `DECOMPOSED_CAFE` are the
 * same word and carry different rows here; a copy or a re-encode would quietly merge them.
 *
 * Text that reads unambiguously - Japanese, Cyrillic, Arabic - is written as itself, because a
 * table of escapes is a table nobody checks.
 */
const COMBINING_ACUTE = '́'
const ARABIC_FATHA = 'َ'
const PRECOMPOSED_E_ACUTE = 'é'
const DECOMPOSED_CAFE = `cafe${COMBINING_ACUTE}`
const PRECOMPOSED_CAFE = `caf${PRECOMPOSED_E_ACUTE}`
const LONE_HIGH_SURROGATE = String.fromCharCode(0xd83d)
const ZERO_WIDTH_JOINER = '‍'
const DOTLESS_I = 'ı'
const CAPITAL_SIGMA = 'Σ'
const SMALL_SIGMA = 'σ'
const FINAL_SIGMA = 'ς'
const SHARP_S = 'ß'
const SMALL_AE = 'æ'
const SMALL_STROKED_O = 'ø'
const GOTHIC_AHSA = String.fromCodePoint(0x10330)
const GOTHIC_BAIRKAN = String.fromCodePoint(0x10331)

export const edgeCases: readonly EdgeCase[] = [
  // --- The surprise, in front -----------------------------------------------
  //
  // A reader arriving from "slugify javascript" expects ASCII. These five rows are where this
  // contract contradicts that expectation, and they are first so that the contradiction is the
  // thing they meet rather than a paragraph they skip.
  {
    id: 'a-non-latin-script-is-kept',
    text: '日本語テキスト',
    expected: '日本語テキスト',
    provenance: 'specified',
    rationale:
      'Japanese text keeps its own script. Measured, two of the four libraries in `ecosystem` ' +
      'answer the empty string here, so every Japanese title on a site collides on one slug in ' +
      'silence - which is the failure this contract refuses. A reader who needs `nihongo-tekisuto` ' +
      'wants a romanisation, and `composeInsteadOfConfiguring` names it as a separate contract ' +
      'because Hepburn and Kunrei disagree and no single answer settles that.',
  },
  {
    id: 'cyrillic-is-kept',
    text: 'Привет мир',
    expected: 'привет-мир',
    provenance: 'specified',
    rationale:
      'Cyrillic is lower-cased and kept, and the space between the words becomes one separator. ' +
      'Three of the four libraries transliterate it to `privet-mir`; that is a scheme choice they ' +
      'made for their users, frozen into a table, and this contract makes no such choice.',
  },
  {
    id: 'arabic-is-kept',
    text: 'مرحبا بالعالم',
    expected: 'مرحبا-بالعالم',
    provenance: 'specified',
    rationale:
      'A right-to-left script passes through unchanged apart from the separator. The slug is the ' +
      'same sequence of code points as the input, which is what makes it a stable identifier in a ' +
      'URL even though the four libraries produce four different answers for it.',
  },
  {
    id: 'an-indic-mark-is-kept',
    text: 'हिन्दी',
    expected: 'हिन्दी',
    provenance: 'specified',
    rationale:
      'The vowel signs, the virama and the consonants all survive. This is the case that decides ' +
      'the absorb step: dropping every combining mark would answer `हनद`, which is not a word, and ' +
      'a rule that mangles a writing system to make Latin text prettier is not defensible. None of ' +
      'these marks composes onto its base, so none of them is a diacritic in the sense the fold ' +
      'means.',
  },
  {
    id: 'a-non-latin-digit-is-a-digit',
    text: '٤٢',
    expected: '٤٢',
    provenance: 'specified',
    rationale:
      'Arabic-Indic digits are decimal digits, so they survive exactly as ASCII digits do. Named ' +
      'because "digits" in a rule written in English reads as `0-9`, and the rule means what ' +
      'Unicode means.',
  },

  {
    id: 'an-astral-letter-is-kept',
    text: `${GOTHIC_AHSA}${GOTHIC_BAIRKAN}`,
    expected: `${GOTHIC_AHSA}${GOTHIC_BAIRKAN}`,
    provenance: 'specified',
    rationale:
      'Two Gothic letters, each one code point stored as two UTF-16 code units, survive as ' +
      'themselves. It is the row that fixes the unit: an implementation walking code units sees ' +
      'four unpaired surrogates, none of which is a letter, and answers the empty slug. Emoji ' +
      'cannot settle this - both conventions discard them - so a letter outside the basic plane is ' +
      'the only input that can.',
  },

  // --- The fold, which is Unicode's and not this contract's -------------------
  {
    id: 'a-latin-diacritic-is-removed',
    text: 'Crème Brûlée',
    expected: 'creme-brulee',
    provenance: 'specified',
    rationale:
      'The answer a reader expects, reached without a table: each letter is replaced by the first ' +
      'code point of its canonical decomposition, which Unicode already publishes. It is the one ' +
      'row where four of the five measured columns agree with this contract.',
  },
  {
    id: 'a-decomposed-diacritic-folds-alike',
    text: DECOMPOSED_CAFE,
    expected: 'cafe',
    provenance: 'specified',
    rationale:
      'The word written as a bare letter followed by a combining acute. It answers the same slug ' +
      'as the precomposed spelling below, which is the whole point of normalising first: two ' +
      'encodings of one word must not produce two identifiers.',
  },
  {
    id: 'a-precomposed-diacritic-folds-alike',
    text: PRECOMPOSED_CAFE,
    expected: 'cafe',
    provenance: 'specified',
    rationale:
      'The same word written with the precomposed character. It is named separately from the ' +
      'decomposed spelling because the two are different strings, and a contract that settled only ' +
      'one of them would leave an implementation free to answer differently on the other.',
  },
  {
    id: 'two-stacked-marks-are-removed',
    text: 'Tiếng Việt',
    expected: 'tieng-viet',
    provenance: 'specified',
    rationale:
      'Vietnamese stacks a vowel mark and a tone mark on one letter, and both decompose off the ' +
      'base. It is the case that shows the fold is not a single-diacritic rule.',
  },
  {
    id: 'a-letter-with-no-decomposition-is-kept',
    text: `Stra${SHARP_S}e`,
    expected: `stra${SHARP_S}e`,
    provenance: 'specified',
    rationale:
      'Three of the five measured columns answer `strasse`, and this contract answers `straße`. ' +
      'The divergence is the rule being honest: Unicode gives the sharp s no decomposition, so ' +
      'answering `ss` means writing down a German convention by hand, and a contract that writes ' +
      'down one language\'s convention has to write down every language\'s or be wrong for ' +
      'somebody. A reader who wants `strasse` wants a romanisation of German, which composes in ' +
      'front of this function.',
  },
  {
    id: 'a-ligature-letter-is-kept',
    text: 'Æther',
    expected: `${SMALL_AE}ther`,
    provenance: 'specified',
    rationale:
      'The same decision on a letter the measured columns disagree about three ways: `aether`, ' +
      '`a-ether`, and `æther`. Unicode does not decompose it either, so it is lower-cased and ' +
      'kept. It is named beside the sharp s because together they are the whole cost of refusing ' +
      'to write a table, and a reader should be able to see that cost rather than discover it.',
  },
  {
    id: 'a-stroked-letter-is-kept',
    text: 'Ødegård',
    expected: `${SMALL_STROKED_O}degard`,
    provenance: 'specified',
    rationale:
      'One word carrying both halves of the rule: the stroked o has no decomposition and is kept, ' +
      'the ring above the a decomposes and is removed. It is the clearest single input for what ' +
      '"the fold is Unicode\'s" actually means.',
  },

  // --- The absorb step, and the two defects that wrote it ---------------------
  {
    id: 'a-mark-the-base-absorbs-is-dropped',
    text: `${PRECOMPOSED_E_ACUTE}${COMBINING_ACUTE}`,
    expected: 'e',
    provenance: 'found-by-mutation:G-06',
    rationale:
      'A precomposed e-acute followed by a second combining acute. The first formulation of this ' +
      'contract kept the second mark, because normalisation had nothing left to compose it with - ' +
      'and the next call composed it onto the bare `e` the fold had just produced and dropped it, ' +
      'so the function was not idempotent. Measured on thirty words out of four thousand. The ' +
      'rule now asks whether the base absorbs a mark rather than whether normalisation already ' +
      'did.',
  },
  {
    id: 'a-mark-reaching-its-base-across-another',
    text: `${PRECOMPOSED_E_ACUTE}${ARABIC_FATHA}${COMBINING_ACUTE}`,
    expected: `e${ARABIC_FATHA}`,
    provenance: 'found-by-mutation:G-07',
    rationale:
      'The same defect one layer deeper. The second formulation asked whether the code point to ' +
      'the left absorbed the mark, and here the acute\'s left-hand neighbour is an Arabic fatha, ' +
      'which absorbs nothing - so the acute was kept, and the next call composed it onto the `e` ' +
      'anyway, because Unicode lets a mark of high combining class reach the base across a mark of ' +
      'lower class. The test is the base of the run, and this is the input that says so.',
  },
  {
    id: 'a-mark-with-no-base-to-absorb-it-is-kept',
    text: `x${COMBINING_ACUTE}`,
    expected: `x${COMBINING_ACUTE}`,
    provenance: 'specified',
    rationale:
      'There is no precomposed x-acute, so the base does not absorb the mark and the mark stays. ' +
      'It is the case that shows the fold is not "remove combining marks": what is removed is the ' +
      'mark a letter already carries, and nothing else.',
  },

  // --- Greek, where the fold and the case rule meet ---------------------------
  {
    id: 'a-greek-tonos-is-removed',
    text: 'Ελληνικά',
    expected: 'ελληνικα',
    provenance: 'specified',
    rationale:
      'The Greek tonos decomposes off its vowel exactly as a French accent does, so it is removed ' +
      'by the same step and for the same reason. The script is kept; only the mark goes. The two ' +
      'published transliteration schemes answer `ellhnika` and `ellinika`, measured, and that ' +
      'disagreement is why this contract transliterates nothing.',
  },
  {
    id: 'a-final-sigma-is-not-unified',
    text: `ΟΔΟ${CAPITAL_SIGMA}`,
    expected: `οδο${SMALL_SIGMA}`,
    provenance: 'specified',
    rationale:
      'An upper-case Greek word ending in sigma answers an ordinary small sigma, not a final one. ' +
      'JavaScript\'s lower-casing is context sensitive and would answer the final form, but that ' +
      'context includes the characters this function is about to discard - so `ΟΔΟΣ.` and `ΟΔΟΣΑ` ' +
      'would disagree about a letter because of a full stop that does not survive. Each base is ' +
      'therefore lower-cased on its own. The cost is named in the row below and is real.',
  },
  {
    id: 'a-written-final-sigma-is-kept',
    text: `οδο${FINAL_SIGMA}`,
    expected: `οδο${FINAL_SIGMA}`,
    provenance: 'specified',
    rationale:
      'The same word already written with a final sigma keeps it, because a final sigma is a ' +
      'letter and letters are kept. So the upper-case spelling and the correctly written ' +
      'lower-case spelling of one Greek word produce two slugs. That is a real limit of this ' +
      'contract rather than a defect of the case rule: the two are distinct code points that ' +
      'Unicode does not make canonically equivalent, and unifying them needs a case *folding*, ' +
      'which JavaScript does not expose and which this contract will not hand-write.',
  },

  // --- Case ------------------------------------------------------------------
  {
    id: 'the-turkish-dotted-i-loses-its-dot',
    text: 'İstanbul',
    expected: 'istanbul',
    provenance: 'specified',
    rationale:
      'The Turkish dotted capital I decomposes to a plain I and a combining dot above; the I ' +
      'lower-cases to `i`, and the dot is a mark the `i` absorbs. The answer falls out of the rule ' +
      'with no special case, which is worth naming because this character is the standard example ' +
      'of case conversion depending on a locale.',
  },
  {
    id: 'the-turkish-dotless-i-is-kept',
    text: `Iş${DOTLESS_I}k`,
    expected: `is${DOTLESS_I}k`,
    provenance: 'specified',
    rationale:
      'The dotless i has no decomposition and is a letter, so it survives - while the cedilla on ' +
      'the s decomposes and goes. An ASCII-only slugifier answers `is-k` or `isik` depending on ' +
      'whether it drops the letter or invents a mapping for it; this contract does neither.',
  },

  // --- What NFKC unifies, and what it costs ----------------------------------
  {
    id: 'a-fullwidth-letter-is-unified',
    text: 'ＡＢＣ',
    expected: 'abc',
    provenance: 'specified',
    rationale:
      'Fullwidth letters and ordinary letters are the same letters typed on two keyboards, and ' +
      'NFKC says so. Without this step they would produce two identifiers for one text, which is ' +
      'the collision defect in reverse and is worse than a collision, because nothing warns anyone.',
  },
  {
    id: 'a-typographic-ligature-is-unified',
    text: 'ﬁle',
    expected: 'file',
    provenance: 'specified',
    rationale:
      'The fi ligature is a presentation form of two letters, so NFKC separates it and the slug ' +
      'carries both. It also shows that the compatibility step, not a hand-written table, is what ' +
      'gets a two-letter answer out of a one-code-point input.',
  },
  {
    id: 'a-superscript-digit-is-a-digit',
    text: 'x²',
    expected: 'x2',
    provenance: 'specified',
    rationale:
      'A superscript two is a compatibility form of the digit two, so it survives as `2`. All five ' +
      'measured columns answer `x`, dropping it, and this contract diverges: the character carries ' +
      'information a reader typed, and Unicode already says what it is made of. It is the clearest ' +
      'row for what choosing NFKC over NFC buys and costs.',
  },
  {
    id: 'a-roman-numeral-is-letters',
    text: 'Ⅷ',
    expected: 'viii',
    provenance: 'specified',
    rationale:
      'The Roman numeral eight is a compatibility form of four Latin letters, so it becomes four ' +
      'letters. Named because it is the most surprising consequence of the compatibility step, and ' +
      'because the alternative - answering the empty string, which is what the ASCII-only columns ' +
      'do - throws away a character a reader chose deliberately.',
  },

  // --- Separators and shape ---------------------------------------------------
  {
    id: 'runs-of-spaces-become-one-separator',
    text: '  hello   world  ',
    expected: 'hello-world',
    provenance: 'specified',
    rationale:
      'Any run of boundary characters becomes one separator, and a boundary before the first run ' +
      'or after the last produces nothing. `github-slugger` answers `---hello---world---` here, ' +
      'measured, which is a valid anchor and not a slug.',
  },
  {
    id: 'an-existing-slug-is-unchanged',
    text: 'already-slugged',
    expected: 'already-slugged',
    provenance: 'specified',
    rationale:
      'Text that is already a slug is returned as it is. It is the concrete anchor for the fixed ' +
      'point property, and the case a caller relies on when a slug is recomputed on read.',
  },
  {
    id: 'a-doubled-separator-collapses',
    text: 'double--dash',
    expected: 'double-dash',
    provenance: 'specified',
    rationale:
      'A hyphen is not a letter, so two hyphens are one boundary and become one separator. It is ' +
      'the row that makes the shape rule bite on input that already looks like a slug.',
  },
  {
    id: 'an-underscore-is-a-boundary',
    text: 'under_score',
    expected: 'under-score',
    provenance: 'specified',
    rationale:
      'An underscore is punctuation, not a letter, so it is a boundary like any other. The four ' +
      'measured columns split four ways here - keep it, drop it, or turn it into a separator - ' +
      'which is exactly the kind of decision a contract exists to settle once.',
  },
  {
    id: 'a-full-stop-is-a-boundary',
    text: 'a.b.c',
    expected: 'a-b-c',
    provenance: 'specified',
    rationale:
      'A full stop separates rather than disappears. Three of the measured columns answer `abc`, ' +
      'silently joining two words that were not adjacent; a boundary that vanishes makes `a.b` and ' +
      '`ab` one slug for no reason a reader can see.',
  },
  {
    id: 'an-apostrophe-is-a-boundary',
    text: `l'${PRECOMPOSED_E_ACUTE}t${PRECOMPOSED_E_ACUTE}`,
    expected: 'l-ete',
    provenance: 'specified',
    rationale:
      'An apostrophe is a boundary, so a French elision splits. Three columns answer `lete`, ' +
      'treating the apostrophe as invisible, and one answers `l-ete`. Splitting is the answer the ' +
      'rule gives without an exception list, and an exception list for the apostrophe is where a ' +
      'table starts.',
  },

  // --- No symbol becomes a word ----------------------------------------------
  {
    id: 'an-ampersand-is-not-a-word',
    text: 'Salt & Pepper',
    expected: 'salt-pepper',
    provenance: 'specified',
    rationale:
      'An ampersand is a symbol and is removed; it does not become `and`, because `and` is ' +
      'English. Two of the measured columns answer `salt-and-pepper`, which is a translation ' +
      'decision made on behalf of every caller in every language.',
  },
  {
    id: 'a-currency-sign-is-not-a-word',
    text: '10€ and 5$',
    expected: '10-and-5',
    provenance: 'specified',
    rationale:
      'The currency signs go and the English word a caller actually typed stays. Measured, the ' +
      'euro sign becomes `euro`, `e`, or nothing depending on the library, and that three-way ' +
      'disagreement about a single character is the strongest evidence in `ecosystem` that symbol ' +
      'tables are not a shared convention anyone can appeal to.',
  },

  // --- Nothing retainable, and the empty slug ---------------------------------
  {
    id: 'the-empty-string',
    text: '',
    expected: '',
    provenance: 'specified',
    rationale:
      'The empty string slugs to itself. It is the input an implementation writing a separator ' +
      'before its first run is most likely to fall off, and the cheapest sensor for it.',
  },
  {
    id: 'nothing-retainable',
    text: '!!!',
    expected: '',
    provenance: 'specified',
    rationale:
      'Text holding no letter, mark or digit answers the empty slug. `slug` answers `iseh` here - ' +
      'the base64 of the input, slugged - which is an identifier that looks meaningful and is ' +
      'noise. The empty slug is an answer, and a caller who cannot use it substitutes its own.',
  },
  {
    id: 'an-emoji-is-removed',
    text: '🎉 party 🎉',
    expected: 'party',
    provenance: 'specified',
    rationale:
      'Emoji are symbols, so they are boundaries. All five measured columns agree that emoji do ' +
      'not belong in a slug, which makes this one of the few rows where the ecosystem is unanimous.',
  },
  {
    id: 'a-joined-emoji-sequence-is-removed',
    text: `👩${ZERO_WIDTH_JOINER}💻 developer`,
    expected: 'developer',
    provenance: 'specified',
    rationale:
      'A joined sequence is three code points - two symbols and a zero-width joiner - and none of ' +
      'them is a letter, a mark or a digit. Named because a rule stated over grapheme clusters ' +
      'would have to decide what a partial sequence means, and this rule never sees a cluster.',
  },
  {
    id: 'a-lone-surrogate-is-removed',
    text: LONE_HIGH_SURROGATE,
    expected: '',
    provenance: 'specified',
    rationale:
      'An unpaired surrogate is not a letter, so it is a boundary and the slug is empty. It ' +
      'reaches this function out of a truncated string or a byte-level slice, and `slug` throws on ' +
      'it - measured. A total function does not throw on input a caller cannot pre-validate ' +
      'without writing this function first.',
  },
  {
    id: 'a-lone-surrogate-inside-a-word',
    text: `a${LONE_HIGH_SURROGATE}b`,
    expected: 'a-b',
    provenance: 'specified',
    rationale:
      'The same character between two letters is a boundary and splits them. It is the row that ' +
      'says the surrogate is removed rather than skipped: skipping would answer `ab`, joining two ' +
      'letters that were not adjacent in the input.',
  },

  // --- The loss, made concrete ------------------------------------------------
  //
  // These two rows are one decision read twice. They exist so that `lossiness` in block 4.1 has a
  // demonstration on the contract's own page rather than a sentence a reader has to believe.
  {
    id: 'a-plus-is-not-a-letter',
    text: 'C++',
    expected: 'c',
    provenance: 'specified',
    rationale:
      'The plus signs are symbols and go, so the language is `c`. Named as half of a pair: the ' +
      'other half is `C#`, which answers the same slug. Two different programming languages, one ' +
      'identifier - which is what `lossiness` means and why a slug is not a key.',
  },
  {
    id: 'a-hash-is-not-a-letter',
    text: 'C#',
    expected: 'c',
    provenance: 'specified',
    rationale:
      'The other half of the pair. It is settled separately rather than mentioned in the row ' +
      'above, because the collision is a fact about two inputs and a table row is about one - and ' +
      'a guard below replays the collision rather than asserting it in prose.',
  },
]
