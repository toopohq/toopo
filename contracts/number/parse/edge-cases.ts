/**
 * Block 4.4 of contract `number/parse@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `catalogue/every-contract.ts`. What is here is this contract's own table.
 *
 * Every case in it is `specified`, and that is still true of the separator family, which arrived after
 * the rest. No mutant of this contract has ever required a case to be added - a fact about this table
 * rather than a virtue, and why `date/add@1` carries two entries this one does not. The separator
 * cases are not an exception to that: they were written with a revision of the partition in block 4.2,
 * before the branch that produces the reason existed, which is what `specified` means. The revision
 * was possible because nothing here is published yet; after that, the same change would have cost
 * `number/parse@2`.
 */

import type { Provenance } from '../../../catalogue/every-contract.js'
import type { ParseFailureReason } from './contract.js'

export type EdgeCase = {
  readonly id: string
  readonly input: string
  readonly expected: number | null
  /** What the diagnostic surface must report, and `null` exactly when the input parses. */
  readonly reason: ParseFailureReason | null
  readonly provenance: Provenance
  readonly rationale: string
}

/**
 * Invisible in source, so they are named rather than pasted: a copy or re-encode would lose them.
 *
 * The three separator characters are named for a second reason. `'1 000'` written with a no-break
 * space and `'1 000'` written with an ordinary one are the same eight glyphs on screen and carry
 * opposite answers in this table, so pasting either would leave a reader unable to tell which case
 * is which - and a maintainer free to "fix" one into the other.
 */
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff)
const ARABIC_INDIC_123 = String.fromCharCode(0x0661, 0x0662, 0x0663)
const NO_BREAK_SPACE = String.fromCharCode(0x00a0)
const NARROW_NO_BREAK_SPACE = String.fromCharCode(0x202f)
const TYPOGRAPHIC_APOSTROPHE = String.fromCharCode(0x2019)
const ORDINARY_SPACE = String.fromCharCode(0x20)
const ARABIC_THOUSANDS_SEPARATOR = String.fromCharCode(0x066c)

export const edgeCases: readonly EdgeCase[] = [
  // --- Baseline -----------------------------------------------------------
  {
    id: 'ordinary-integer',
    input: '42',
    expected: 42,
    reason: null,
    provenance: 'specified',
    rationale: 'An ordinary integer parses to itself.',
  },
  {
    id: 'ordinary-negative-decimal',
    input: '-3.5',
    expected: -3.5,
    reason: null,
    provenance: 'specified',
    rationale: 'An ordinary negative decimal parses to itself.',
  },

  // --- Whitespace ---------------------------------------------------------
  {
    id: 'surrounding-whitespace',
    input: '  42  ',
    expected: 42,
    reason: null,
    provenance: 'specified',
    rationale:
      'Surrounding whitespace is ignored, because text arriving from a form field or a ' +
      'spreadsheet cell routinely carries it. Trimming uses String.prototype.trim.',
  },
  {
    id: 'tabs-and-newlines',
    input: '\t\n 7 \r\n',
    expected: 7,
    reason: null,
    provenance: 'specified',
    rationale: 'Tabs and newlines are whitespace for String.prototype.trim, so they are ignored too.',
  },
  {
    id: 'leading-byte-order-mark',
    input: BYTE_ORDER_MARK + '9',
    expected: 9,
    reason: null,
    provenance: 'specified',
    rationale:
      'A leading byte-order mark parses, because String.prototype.trim removes U+FEFF: ' +
      '"\\uFEFF9".trim() has length 1. This is derived from the whitespace rule rather than a ' +
      'special case, and it matters because text copied out of a document often carries a ' +
      'byte-order mark or a non-breaking space.',
  },
  {
    id: 'whitespace-inside-the-number',
    input: '4 2',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'Whitespace inside the number is not ignored; only leading and trailing whitespace is.',
  },

  // --- Sign ---------------------------------------------------------------
  {
    id: 'leading-plus-sign',
    input: '+42',
    expected: 42,
    reason: null,
    provenance: 'specified',
    rationale: 'A leading plus sign is accepted and has no effect on the value.',
  },
  {
    id: 'sign-detached-from-its-digits',
    input: '- 1',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'A sign separated from its digits is not a number.',
  },
  {
    id: 'repeated-sign',
    input: '--1',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'A repeated sign is not a number.',
  },
  {
    id: 'negative-zero',
    input: '-0',
    expected: -0,
    reason: null,
    provenance: 'specified',
    rationale:
      'Negative zero is preserved, because it is a distinct IEEE-754 value carrying the sign of ' +
      'an underflowing computation. Comparing results with === would hide the difference, since ' +
      '-0 === 0 is true; this contract compares with Object.is.',
  },

  // --- Digit shapes -------------------------------------------------------
  {
    id: 'leading-zeros',
    input: '01',
    expected: 1,
    reason: null,
    provenance: 'specified',
    rationale:
      'Leading zeros are accepted and carry no meaning. They are not read as octal - that legacy ' +
      'of old parseInt implementations is not part of this contract.',
  },
  {
    id: 'bare-fraction',
    input: '.5',
    expected: 0.5,
    reason: null,
    provenance: 'specified',
    rationale: 'A fraction with no integer part is accepted, matching how people write it.',
  },
  {
    id: 'trailing-decimal-point',
    input: '5.',
    expected: 5,
    reason: null,
    provenance: 'specified',
    rationale: 'An integer with a trailing decimal point is accepted; it is a common typing artefact.',
  },
  {
    id: 'lone-decimal-point',
    input: '.',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'A decimal point with no digits on either side is not a number.',
  },
  {
    id: 'two-decimal-points',
    input: '1.2.3',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'Two decimal points is not a number. parseFloat("1.2.3") returns 1.2, silently discarding ' +
      'the rest of the input; this contract rejects it instead.',
  },

  // --- Exponent -----------------------------------------------------------
  {
    id: 'exponent',
    input: '1e3',
    expected: 1000,
    reason: null,
    provenance: 'specified',
    rationale:
      'Scientific notation is accepted, because it is how spreadsheets and scientific exports ' +
      'write large numbers. parseInt("1e3") returns 1, keeping only the leading digit.',
  },
  {
    id: 'exponent-uppercase-and-signed',
    input: '1E+3',
    expected: 1000,
    reason: null,
    provenance: 'specified',
    rationale: 'The exponent marker is case-insensitive and its sign is optional.',
  },
  {
    id: 'negative-exponent',
    input: '1e-7',
    expected: 1e-7,
    reason: null,
    provenance: 'specified',
    rationale: 'A negative exponent is accepted.',
  },
  {
    id: 'exponent-with-no-digits',
    input: '1e',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'An exponent marker with no digits is not a number. parseFloat("1e") returns 1, silently ' +
      'dropping the incomplete exponent.',
  },

  // --- Empty and blank ----------------------------------------------------
  {
    id: 'the-empty-string',
    input: '',
    expected: null,
    reason: 'empty',
    provenance: 'specified',
    rationale:
      'The empty string is not a number. Number("") returns 0, the single most damaging trap in ' +
      'JavaScript numeric conversion: an empty form field becomes a legitimate-looking zero. ' +
      'Correcting it is the main reason this contract exists.',
  },
  {
    id: 'a-blank-string',
    input: '   ',
    expected: null,
    reason: 'empty',
    provenance: 'specified',
    rationale: 'A blank string is not a number, for the same reason: Number("   ") also returns 0.',
  },

  // --- Non-finite words ---------------------------------------------------
  {
    id: 'the-word-nan',
    input: 'NaN',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'The word "NaN" is not a number. Number("NaN") returns NaN, which is indistinguishable from ' +
      'the failure value of every other invalid input.',
  },
  {
    id: 'the-word-infinity',
    input: 'Infinity',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'The word "Infinity" is rejected, because a parser that can return an infinite value forces ' +
      'every caller to guard with isFinite afterwards. Number("Infinity") returns Infinity and ' +
      'Python accepts float("Infinity"); this contract knowingly diverges from both. It is ' +
      'not-decimal rather than overflow: the rejection is about the word, not about a magnitude ' +
      'that was computed and lost.',
  },
  {
    id: 'the-word-negative-infinity',
    input: '-Infinity',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'Rejected for the same reason as "Infinity".',
  },

  // --- Alternative radixes ------------------------------------------------
  {
    id: 'hexadecimal',
    input: '0x1F',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'Hexadecimal is rejected: this contract reads human decimal text, where "0x1F" is a typo ' +
      'rather than the number 31. Number("0x1F") returns 31, but JavaScript\'s own numeric parser ' +
      'disagrees - parseFloat("0x1F") returns 0 - and Python raises on float("0x1F").',
  },
  {
    id: 'octal',
    input: '0o17',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'Octal notation is rejected, consistently with hexadecimal.',
  },
  {
    id: 'binary',
    input: '0b11',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'Binary notation is rejected, consistently with hexadecimal.',
  },

  // --- Separators: the characters the family covers -------------------------
  //
  // Every character below was measured rather than chosen: `Intl.NumberFormat` was asked to format
  // 1234567.5 in 108 locales, and these are the grouping characters it emitted. The value is still
  // refused - this contract is not locale-aware and will not guess which separator was decimal -
  // but the reason names what the writer did instead of calling their number "not a number".
  {
    id: 'comma-as-a-decimal-separator',
    input: '1,5',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'A comma is never a decimal separator here, and this is the most frequent real refusal in ' +
      'half of Europe: measured, 61 of 108 locales write the decimal point as a comma. The value ' +
      'is refused because reading it as 1.5 or as 15 would both be guesses about the writer, but ' +
      'the reason is not a guess - the text does carry a separator, and a caller can say so.',
  },
  {
    id: 'comma-grouping',
    input: '1,000',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'A thousands separator, and the exact input that makes guessing indefensible: 1,000 is one ' +
      'thousand in English and one in French. The refusal is the answer; the reason is the repair.',
  },
  {
    id: 'underscore-grouping',
    input: '1_000',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'The underscore is the one member of the family no locale emits. It is here because it is ' +
      'the digit separator of JavaScript and Python source literals: Number("1_000") returns NaN ' +
      'while Python\'s float("1_000") returns 1000, so a developer who expects the Python answer ' +
      'gets a named reason rather than the residual one.',
  },
  {
    id: 'comma-grouping-with-a-decimal-point',
    input: '1,234.56',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'Grouping and a decimal point together, the shape a spreadsheet exports in English. It is ' +
      'listed because it is the case where the separator and the grammar meet: the full stop is a ' +
      'token this grammar reads and the comma is not, so only the comma is removed before the ' +
      'second look.',
  },
  {
    id: 'apostrophe-grouping',
    input: "1'000",
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'The apostrophe groups digits in Swiss and Liechtenstein formatting - measured, de-CH, ' +
      'de-LI, it-CH, gsw, wae and en-CH all emit it. It is the only member of the family that is ' +
      'an ordinary typeable character, and it is included because no measured locale emits it for ' +
      'anything else between two digits.',
  },
  {
    id: 'no-break-space-grouping',
    input: `1${NO_BREAK_SPACE}000`,
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'A no-break space groups digits in 56 of the 108 locales measured, among them Swedish, ' +
      'Czech, Polish and Russian. It survives a copy out of a document and is invisible to the ' +
      'person who pasted it, which is exactly the population that cannot diagnose a bare refusal.',
  },
  {
    id: 'narrow-no-break-space-grouping',
    input: `1${NARROW_NO_BREAK_SPACE}000,5`,
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'What a French spreadsheet exports: a narrow no-break space grouping and a comma decimal, ' +
      'both in one string. Measured, fr, fr-BE, fr-CH and rm-CH emit U+202F and not the no-break ' +
      'space, so covering one and not the other would miss the locale the literal exists for.',
  },
  {
    id: 'grouping-that-is-not-in-threes',
    input: '1,2,3',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'Grouping that is not in threes is still a separator mistake. This case was cited by an ' +
      'earlier revision of this contract as the reason the literal could not exist - the claim ' +
      'being that classifying it would need a second grammar that knows groups come in threes. ' +
      'The claim was wrong about what the reason has to mean: "this text uses digit separators" ' +
      'is true of 1,2,3 whether or not the grouping is well formed, and no caller acts on the ' +
      'difference.',
  },
  {
    id: 'full-stop-grouping-with-a-comma-decimal',
    input: '1.000,5',
    expected: null,
    reason: 'separator',
    provenance: 'specified',
    rationale:
      'German and Italian grouping: the full stop groups and the comma is decimal. Removing the ' +
      'family from this input leaves 1.0005, which is not what the writer meant - and the reason ' +
      'is still correct, because it names the motive and not the repair. A caller that echoes ' +
      '"remove the separators" would be wrong here; one that says "this contract reads 1000.5, ' +
      'not 1.000,5" is right. The literal is a diagnosis, never a rewrite rule.',
  },

  // --- Separators: the characters the family does not cover -----------------
  {
    id: 'an-ordinary-space-between-digits',
    input: `1${ORDINARY_SPACE}000`,
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'An ordinary space is not formatting. No measured locale emits U+0020 between digits - the ' +
      'ones that group with a space emit U+00A0 or U+202F - so a space here is a typo, and it ' +
      'carries the residual reason for the same purpose that 4 2 does. This is the line that ' +
      'makes the family a decision rather than a habit: it is drawn where the measurement draws ' +
      'it, and a mutant that widens the family to whitespace is caught by this case.',
  },
  {
    id: 'a-typographic-apostrophe-between-digits',
    input: `1${TYPOGRAPHIC_APOSTROPHE}000`,
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'The typographic apostrophe is excluded, and it is the exclusion this contract is least ' +
      'sure of. A word processor turns a typed apostrophe into U+2019, so the character does ' +
      'reach real text; but measured, no locale emits it as a group separator, and the family is ' +
      'drawn from the measurement rather than from what seems likely. Recorded here so that a ' +
      'later revision has the reason it would be overturning.',
  },
  {
    id: 'the-arabic-thousands-separator',
    input: `1${ARABIC_THOUSANDS_SEPARATOR}234`,
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'The Arabic thousands separator is excluded on a measurement rather than a preference: the ' +
      'locales that emit U+066C emit Arabic-Indic digits with it, and this contract rejects those ' +
      'digits anyway. Adding it to the family would create a branch that no formatted number can ' +
      'reach, which is the shape of a guard that cannot fail.',
  },
  {
    id: 'a-separator-with-nothing-to-separate',
    input: ',',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'A separator with nothing to separate is not a number with separators in it. Removing the ' +
      'family leaves the empty string, which the grammar refuses, so the residual reason is ' +
      'reached - and `empty` is not, because the input was not blank to begin with.',
  },
  {
    id: 'a-separator-in-text-that-is-not-a-number',
    input: 'x,y',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'A comma inside something that is not a number at all. It is the other side of the same ' +
      'boundary: the reason is decided by what is left once the family is removed, not by whether ' +
      'a family character appears.',
  },
  {
    id: 'a-separator-inside-a-radix-prefix',
    input: '0x1_F',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'A separator does not rescue a radix prefix. Removing the underscore leaves 0x1F, which the ' +
      'grammar refuses, so this stays the residual refusal - the same answer it would get without ' +
      'the underscore, which is the point.',
  },

  // --- Not numbers at all -------------------------------------------------
  {
    id: 'arbitrary-text',
    input: 'abc',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale: 'Arbitrary text is not a number.',
  },
  {
    id: 'a-bigint-suffix',
    input: '12n',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'A BigInt literal suffix is rejected. parseFloat("12n") returns 12, silently discarding the ' +
      'suffix that carried the meaning.',
  },
  {
    id: 'arabic-indic-digits',
    input: ARABIC_INDIC_123,
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'Digits outside ASCII 0-9 are rejected. Number() also returns NaN for the Arabic-Indic ' +
      'digits U+0661 U+0662 U+0663, even though they spell 123.',
  },
  {
    id: 'an-inherited-property-name',
    input: 'constructor',
    expected: null,
    reason: 'not-decimal',
    provenance: 'specified',
    rationale:
      'An inherited object property name is not a number. It is listed because an implementation ' +
      'memoising into a plain object serves it from Object.prototype: "constructor" in {} is true. ' +
      'Which of the two exports catches that depends on the error convention, and under this one it ' +
      'is no longer the value: measured, parseNumber("constructor") answers null, which is correct, ' +
      'while describeParseFailure answers undefined where this row requires "not-decimal". Block ' +
      '4.2 records why that matters to every later contract.',
  },

  // --- IEEE-754 limits ----------------------------------------------------
  {
    id: 'overflow-past-the-largest-double',
    input: '1e400',
    expected: null,
    reason: 'overflow',
    provenance: 'specified',
    rationale:
      'A value too large for a double is rejected, because Number("1e400") returns Infinity and ' +
      'the contract guarantees a finite result. The magnitude is lost either way; returning null ' +
      'makes the loss impossible to ignore.',
  },
  {
    id: 'underflow-to-zero',
    input: '1e-400',
    expected: 0,
    reason: null,
    provenance: 'specified',
    rationale:
      'A value too small for a double becomes 0, the nearest representable double under ' +
      'IEEE-754. Unlike overflow this stays finite, so it is accepted - the contract cannot ' +
      'repair IEEE-754, only make its behaviour explicit.',
  },
  {
    id: 'negative-underflow',
    input: '-1e-400',
    expected: -0,
    reason: null,
    provenance: 'specified',
    rationale:
      'A negative underflow becomes -0, keeping the sign of the value that was lost. This is ' +
      'where preserving negative zero pays for itself.',
  },
  {
    id: 'an-integer-past-two-to-the-fifty-third',
    input: '9007199254740993',
    expected: 9007199254740992,
    reason: null,
    provenance: 'specified',
    rationale:
      'Above 2^53 consecutive integers are no longer representable, so this input parses to the ' +
      'nearest double, 9007199254740992. Every JavaScript number parser loses this digit; the ' +
      'contract documents the loss rather than pretending otherwise.',
  },
]

