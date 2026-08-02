/**
 * Block 4.4 of contract `number/parse@1` - the named and settled edge cases.
 *
 * Split out of `contract.ts` because it is the one block that grows. The other four declare a fixed
 * number of things - an identity, a signature, a list of universal properties, a set of benchmark
 * profiles - while this one gains an entry every time a defect is found that no existing case
 * caught. Cutting along the block boundary keeps the contract's own numbering as the map: a reader
 * looking for 4.4 finds a file named for it, beside the file that executes it.
 *
 * This is a split inside one contract folder, not an abstraction across two. Nothing here is shared
 * with `date/add@1`, which carries its own table under the same name and no common type.
 *
 * Each entry is simultaneously an exact test (`edge-cases.test.ts`) and one line of public
 * documentation. `rationale` is the published sentence; it states a measured fact, not an opinion.
 */

import type { ParseFailureReason } from './contract.js'

export type EdgeCase = {
  readonly input: string
  readonly expected: number | null
  /** What the diagnostic surface must report, and `null` exactly when the input parses. */
  readonly reason: ParseFailureReason | null
  readonly rationale: string
}

/** Invisible in source, so they are named rather than pasted: a copy or re-encode would lose them. */
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff)
const ARABIC_INDIC_123 = String.fromCharCode(0x0661, 0x0662, 0x0663)

export const edgeCases: readonly EdgeCase[] = [
  // --- Baseline -----------------------------------------------------------
  {
    input: '42',
    expected: 42,
    reason: null,
    rationale: 'An ordinary integer parses to itself.',
  },
  {
    input: '-3.5',
    expected: -3.5,
    reason: null,
    rationale: 'An ordinary negative decimal parses to itself.',
  },

  // --- Whitespace ---------------------------------------------------------
  {
    input: '  42  ',
    expected: 42,
    reason: null,
    rationale:
      'Surrounding whitespace is ignored, because text arriving from a form field or a ' +
      'spreadsheet cell routinely carries it. Trimming uses String.prototype.trim.',
  },
  {
    input: '\t\n 7 \r\n',
    expected: 7,
    reason: null,
    rationale: 'Tabs and newlines are whitespace for String.prototype.trim, so they are ignored too.',
  },
  {
    input: BYTE_ORDER_MARK + '9',
    expected: 9,
    reason: null,
    rationale:
      'A leading byte-order mark parses, because String.prototype.trim removes U+FEFF: ' +
      '"\\uFEFF9".trim() has length 1. This is derived from the whitespace rule rather than a ' +
      'special case, and it matters because text copied out of a document often carries a ' +
      'byte-order mark or a non-breaking space.',
  },
  {
    input: '4 2',
    expected: null,
    reason: 'not-decimal',
    rationale: 'Whitespace inside the number is not ignored; only leading and trailing whitespace is.',
  },

  // --- Sign ---------------------------------------------------------------
  {
    input: '+42',
    expected: 42,
    reason: null,
    rationale: 'A leading plus sign is accepted and has no effect on the value.',
  },
  {
    input: '- 1',
    expected: null,
    reason: 'not-decimal',
    rationale: 'A sign separated from its digits is not a number.',
  },
  {
    input: '--1',
    expected: null,
    reason: 'not-decimal',
    rationale: 'A repeated sign is not a number.',
  },
  {
    input: '-0',
    expected: -0,
    reason: null,
    rationale:
      'Negative zero is preserved, because it is a distinct IEEE-754 value carrying the sign of ' +
      'an underflowing computation. Comparing results with === would hide the difference, since ' +
      '-0 === 0 is true; this contract compares with Object.is.',
  },

  // --- Digit shapes -------------------------------------------------------
  {
    input: '01',
    expected: 1,
    reason: null,
    rationale:
      'Leading zeros are accepted and carry no meaning. They are not read as octal - that legacy ' +
      'of old parseInt implementations is not part of this contract.',
  },
  {
    input: '.5',
    expected: 0.5,
    reason: null,
    rationale: 'A fraction with no integer part is accepted, matching how people write it.',
  },
  {
    input: '5.',
    expected: 5,
    reason: null,
    rationale: 'An integer with a trailing decimal point is accepted; it is a common typing artefact.',
  },
  {
    input: '.',
    expected: null,
    reason: 'not-decimal',
    rationale: 'A decimal point with no digits on either side is not a number.',
  },
  {
    input: '1.2.3',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'Two decimal points is not a number. parseFloat("1.2.3") returns 1.2, silently discarding ' +
      'the rest of the input; this contract rejects it instead.',
  },

  // --- Exponent -----------------------------------------------------------
  {
    input: '1e3',
    expected: 1000,
    reason: null,
    rationale:
      'Scientific notation is accepted, because it is how spreadsheets and scientific exports ' +
      'write large numbers. parseInt("1e3") returns 1, keeping only the leading digit.',
  },
  {
    input: '1E+3',
    expected: 1000,
    reason: null,
    rationale: 'The exponent marker is case-insensitive and its sign is optional.',
  },
  {
    input: '1e-7',
    expected: 1e-7,
    reason: null,
    rationale: 'A negative exponent is accepted.',
  },
  {
    input: '1e',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'An exponent marker with no digits is not a number. parseFloat("1e") returns 1, silently ' +
      'dropping the incomplete exponent.',
  },

  // --- Empty and blank ----------------------------------------------------
  {
    input: '',
    expected: null,
    reason: 'empty',
    rationale:
      'The empty string is not a number. Number("") returns 0, the single most damaging trap in ' +
      'JavaScript numeric conversion: an empty form field becomes a legitimate-looking zero. ' +
      'Correcting it is the main reason this contract exists.',
  },
  {
    input: '   ',
    expected: null,
    reason: 'empty',
    rationale: 'A blank string is not a number, for the same reason: Number("   ") also returns 0.',
  },

  // --- Non-finite words ---------------------------------------------------
  {
    input: 'NaN',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'The word "NaN" is not a number. Number("NaN") returns NaN, which is indistinguishable from ' +
      'the failure value of every other invalid input.',
  },
  {
    input: 'Infinity',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'The word "Infinity" is rejected, because a parser that can return an infinite value forces ' +
      'every caller to guard with isFinite afterwards. Number("Infinity") returns Infinity and ' +
      'Python accepts float("Infinity"); this contract knowingly diverges from both. It is ' +
      'not-decimal rather than overflow: the rejection is about the word, not about a magnitude ' +
      'that was computed and lost.',
  },
  {
    input: '-Infinity',
    expected: null,
    reason: 'not-decimal',
    rationale: 'Rejected for the same reason as "Infinity".',
  },

  // --- Alternative radixes ------------------------------------------------
  {
    input: '0x1F',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'Hexadecimal is rejected: this contract reads human decimal text, where "0x1F" is a typo ' +
      'rather than the number 31. Number("0x1F") returns 31, but JavaScript\'s own numeric parser ' +
      'disagrees - parseFloat("0x1F") returns 0 - and Python raises on float("0x1F").',
  },
  {
    input: '0o17',
    expected: null,
    reason: 'not-decimal',
    rationale: 'Octal notation is rejected, consistently with hexadecimal.',
  },
  {
    input: '0b11',
    expected: null,
    reason: 'not-decimal',
    rationale: 'Binary notation is rejected, consistently with hexadecimal.',
  },

  // --- Separators and locale ----------------------------------------------
  {
    input: '1_000',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'Numeric separators are a feature of JavaScript source literals, not of strings. ' +
      'Number("1_000") returns NaN while Python\'s float("1_000") returns 1000; this contract ' +
      'follows JavaScript and rejects it.',
  },
  {
    input: '1,5',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'A comma is never a decimal separator here. Which separator is decimal depends on locale, ' +
      'and this contract is deliberately not locale-aware. It carries the residual reason rather ' +
      'than one of its own, because naming the motive "you used a separator" would require the ' +
      'same guess about the writer that refusing the value avoids.',
  },
  {
    input: '1,000',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'A thousands separator is rejected for the same reason; reading it as 1000 or as 1 would ' +
      'both be guesses about the writer\'s locale.',
  },

  // --- Not numbers at all -------------------------------------------------
  {
    input: 'abc',
    expected: null,
    reason: 'not-decimal',
    rationale: 'Arbitrary text is not a number.',
  },
  {
    input: '12n',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'A BigInt literal suffix is rejected. parseFloat("12n") returns 12, silently discarding the ' +
      'suffix that carried the meaning.',
  },
  {
    input: ARABIC_INDIC_123,
    expected: null,
    reason: 'not-decimal',
    rationale:
      'Digits outside ASCII 0-9 are rejected. Number() also returns NaN for the Arabic-Indic ' +
      'digits U+0661 U+0662 U+0663, even though they spell 123.',
  },
  {
    input: 'constructor',
    expected: null,
    reason: 'not-decimal',
    rationale:
      'An inherited object property name is not a number. It is listed because an implementation ' +
      'memoising into a plain object answers this one wrongly: "constructor" in {} is true.',
  },

  // --- IEEE-754 limits ----------------------------------------------------
  {
    input: '1e400',
    expected: null,
    reason: 'overflow',
    rationale:
      'A value too large for a double is rejected, because Number("1e400") returns Infinity and ' +
      'the contract guarantees a finite result. The magnitude is lost either way; returning null ' +
      'makes the loss impossible to ignore.',
  },
  {
    input: '1e-400',
    expected: 0,
    reason: null,
    rationale:
      'A value too small for a double becomes 0, the nearest representable double under ' +
      'IEEE-754. Unlike overflow this stays finite, so it is accepted - the contract cannot ' +
      'repair IEEE-754, only make its behaviour explicit.',
  },
  {
    input: '-1e-400',
    expected: -0,
    reason: null,
    rationale:
      'A negative underflow becomes -0, keeping the sign of the value that was lost. This is ' +
      'where preserving negative zero pays for itself.',
  },
  {
    input: '9007199254740993',
    expected: 9007199254740992,
    reason: null,
    rationale:
      'Above 2^53 consecutive integers are no longer representable, so this input parses to the ' +
      'nearest double, 9007199254740992. Every JavaScript number parser loses this digit; the ' +
      'contract documents the loss rather than pretending otherwise.',
  },
]

