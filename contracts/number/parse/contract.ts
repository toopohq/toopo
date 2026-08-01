/**
 * Contract `number/parse@1`.
 *
 * This file is the contract itself: identity, signature, universal-property applicability, named
 * edge cases and benchmark profiles. It declares behaviour and executes nothing. The reference
 * implementation lives in `reference.ts`; the executable halves of the contract live in
 * `signature.test-d.ts`, `properties.test.ts` and `edge-cases.test.ts`.
 *
 * PROVISIONAL: failure is reported as `null`. The catalogue-wide error convention
 * (`null` / throw / `Result`) is still undecided and will be frozen for every contract at once.
 * Every `null` below is a placeholder for that decision, not a settled answer.
 */

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'number/parse',
  major: 1,
  exportName: 'parseNumber',

  summary: 'Convert a string to a finite number, or null when the string is not a decimal number.',

  /** Written to answer the natural search query "convert string to number javascript". */
  description:
    'Converts a string to a number in JavaScript and TypeScript, returning null instead of a ' +
    'misleading value when the string is not a number. JavaScript offers three built-in ways to ' +
    'convert a string to a number and all three lie in common cases: Number("") returns 0, ' +
    'Number(" ") returns 0, Number("0x1F") returns 31, parseFloat("1.2.3") returns 1.2 and ' +
    'parseInt("1e3") returns 1. Each of them can also return NaN, a value that survives every ' +
    'arithmetic operation and surfaces far away from the mistake that produced it. This contract ' +
    'accepts the decimal grammar a human writes - optional surrounding whitespace, optional sign, ' +
    'leading zeros, a fractional part, scientific notation - and rejects everything else, ' +
    'including hexadecimal, octal, binary, digit separators, "NaN" and "Infinity". The result is ' +
    'either null or a finite number: never NaN, never Infinity.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers
   * in block 4.4 are only defensible relative to it: the same string may legitimately parse under
   * a different domain, since a reader of JavaScript source literals must accept `0x1F` and
   * `1_000` while this one must not.
   */
  inputDomain:
    'Human-authored decimal text: form fields, CSV and spreadsheet cells, CLI arguments, ' +
    'environment variables, query-string parameters, and text pasted out of documents. It is not ' +
    'a reader for JavaScript source literals, not a locale-aware parser, and not an arbitrary ' +
    'precision parser.',

  searchAliases: [
    'string to number',
    'convert string to number',
    'to number',
    'toNumber',
    'parse float',
    'parseFloat',
    'parse int',
    'parseInt',
    'cast to number',
    'string to int',
    'string to float',
    'atoi',
    'number from string',
    'safe parse number',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 */
export type ParseNumber = (input: string) => number | null

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Object.is` is required rather than `===` because the contract preserves the sign of negative
 * zero: `parseNumber('-0')` returns `-0`, and `-0 === 0` is true, so `===` would silently accept
 * an implementation that normalises the sign away. `Object.is` also treats NaN as equal to NaN,
 * which costs nothing here since property P1 forbids NaN from ever being returned.
 */
export const outputsAreEqual = (a: number | null, b: number | null): boolean => Object.is(a, b)

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on.
 *
 * It is contract data rather than a runner setting, because the harness is public and executable by
 * anyone: the number of draws is part of the strength of what the contract claims, and leaving it to
 * whoever types the command would make two runs of the same contract mean different things.
 * fast-check's own default is 100 - a sensible default for a testing library, not a promise made to
 * a reader.
 *
 * It is a floor, not a value: the registry's official validation may draw more, nothing may draw
 * fewer. The figure comes from measurement rather than taste. Three runs of this suite at each of
 * 100, 1000 and 10000 draws cost 16-19 ms, 40-45 ms and 185-239 ms of test time respectively, so an
 * order of magnitude over the library default is bought for about 25 ms, while the next order costs
 * five times that to re-explore a boundary the arbitraries already concentrate on.
 */
export const propertyRuns = 1000

/**
 * The universal properties every contract must consider. A property is only written as a test when
 * it is applicable; one that cannot fail is recorded here with its reason instead, so the green
 * count never carries a guard that proves nothing.
 *
 * `no observable side effect` used to be a single entry here, and that was the error: it named two
 * different guarantees at once, and only one of them is reachable by a property. `no ambient input`
 * - the answer depends on the declared arguments and on nothing else - is testable, and is tested.
 * `no ambient output` - the function writes nowhere - is not, and belongs to the static analysis of
 * the validation pipeline. The guard removed from this contract was not proof that side effects are
 * untestable; it was proof that the wrong half was being tested.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: false,
    reason:
      'The signature takes a single `string`, a primitive that is immutable by construction in ' +
      'JavaScript. No implementation, correct or broken, can violate this, so a test asserting it ' +
      'would be structurally incapable of failing.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice: a regular expression carrying the global flag keeps a lastIndex ' +
      'between calls and answers differently on the second one.',
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: a cache keyed on the wrong thing, or a regular expression whose ' +
      'lastIndex survives a call, makes an answer depend on which inputs were parsed before it. ' +
      'The property interleaves a probe with an arbitrary history and requires the probe to answer ' +
      'identically either way. This contract reads a string and returns a number, so the call ' +
      'history is the only ambient input it can plausibly acquire.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason:
      'Not reachable by a property, and the attempt was removed rather than left decorative. A ' +
      'test that snapshots globalThis inside its own `it` runs after the earlier tests have called ' +
      'the function hundreds of times, so it cannot see a write that already happened: measured, ' +
      'an implementation writing globalThis.__parseNumberCalls passes the whole suite. A correct ' +
      'memoising cache passes it too, and should - a cache is not a defect. The guarantee is ' +
      'obtained by static analysis in the validation pipeline, which forbids a feature from ' +
      'reaching global state at all.',
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.4 - Named and settled edge cases
// ---------------------------------------------------------------------------

/**
 * Each entry is simultaneously an exact test (`edge-cases.test.ts`) and one line of public
 * documentation. `rationale` is the published sentence; it states a measured fact, not an opinion.
 */
export type EdgeCase = {
  readonly input: string
  readonly expected: number | null
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
    rationale: 'An ordinary integer parses to itself.',
  },
  {
    input: '-3.5',
    expected: -3.5,
    rationale: 'An ordinary negative decimal parses to itself.',
  },

  // --- Whitespace ---------------------------------------------------------
  {
    input: '  42  ',
    expected: 42,
    rationale:
      'Surrounding whitespace is ignored, because text arriving from a form field or a ' +
      'spreadsheet cell routinely carries it. Trimming uses String.prototype.trim.',
  },
  {
    input: '\t\n 7 \r\n',
    expected: 7,
    rationale: 'Tabs and newlines are whitespace for String.prototype.trim, so they are ignored too.',
  },
  {
    input: BYTE_ORDER_MARK + '9',
    expected: 9,
    rationale:
      'A leading byte-order mark parses, because String.prototype.trim removes U+FEFF: ' +
      '"\\uFEFF9".trim() has length 1. This is derived from the whitespace rule rather than a ' +
      'special case, and it matters because text copied out of a document often carries a ' +
      'byte-order mark or a non-breaking space.',
  },
  {
    input: '4 2',
    expected: null,
    rationale: 'Whitespace inside the number is not ignored; only leading and trailing whitespace is.',
  },

  // --- Sign ---------------------------------------------------------------
  {
    input: '+42',
    expected: 42,
    rationale: 'A leading plus sign is accepted and has no effect on the value.',
  },
  {
    input: '- 1',
    expected: null,
    rationale: 'A sign separated from its digits is not a number.',
  },
  {
    input: '--1',
    expected: null,
    rationale: 'A repeated sign is not a number.',
  },
  {
    input: '-0',
    expected: -0,
    rationale:
      'Negative zero is preserved, because it is a distinct IEEE-754 value carrying the sign of ' +
      'an underflowing computation. Comparing results with === would hide the difference, since ' +
      '-0 === 0 is true; this contract compares with Object.is.',
  },

  // --- Digit shapes -------------------------------------------------------
  {
    input: '01',
    expected: 1,
    rationale:
      'Leading zeros are accepted and carry no meaning. They are not read as octal - that legacy ' +
      'of old parseInt implementations is not part of this contract.',
  },
  {
    input: '.5',
    expected: 0.5,
    rationale: 'A fraction with no integer part is accepted, matching how people write it.',
  },
  {
    input: '5.',
    expected: 5,
    rationale: 'An integer with a trailing decimal point is accepted; it is a common typing artefact.',
  },
  {
    input: '.',
    expected: null,
    rationale: 'A decimal point with no digits on either side is not a number.',
  },
  {
    input: '1.2.3',
    expected: null,
    rationale:
      'Two decimal points is not a number. parseFloat("1.2.3") returns 1.2, silently discarding ' +
      'the rest of the input; this contract rejects it instead.',
  },

  // --- Exponent -----------------------------------------------------------
  {
    input: '1e3',
    expected: 1000,
    rationale:
      'Scientific notation is accepted, because it is how spreadsheets and scientific exports ' +
      'write large numbers. parseInt("1e3") returns 1, keeping only the leading digit.',
  },
  {
    input: '1E+3',
    expected: 1000,
    rationale: 'The exponent marker is case-insensitive and its sign is optional.',
  },
  {
    input: '1e-7',
    expected: 1e-7,
    rationale: 'A negative exponent is accepted.',
  },
  {
    input: '1e',
    expected: null,
    rationale:
      'An exponent marker with no digits is not a number. parseFloat("1e") returns 1, silently ' +
      'dropping the incomplete exponent.',
  },

  // --- Empty and blank ----------------------------------------------------
  {
    input: '',
    expected: null,
    rationale:
      'The empty string is not a number. Number("") returns 0, the single most damaging trap in ' +
      'JavaScript numeric conversion: an empty form field becomes a legitimate-looking zero. ' +
      'Correcting it is the main reason this contract exists.',
  },
  {
    input: '   ',
    expected: null,
    rationale: 'A blank string is not a number, for the same reason: Number("   ") also returns 0.',
  },

  // --- Non-finite words ---------------------------------------------------
  {
    input: 'NaN',
    expected: null,
    rationale:
      'The word "NaN" is not a number. Number("NaN") returns NaN, which is indistinguishable from ' +
      'the failure value of every other invalid input.',
  },
  {
    input: 'Infinity',
    expected: null,
    rationale:
      'The word "Infinity" is rejected, because a parser that can return an infinite value forces ' +
      'every caller to guard with isFinite afterwards. Number("Infinity") returns Infinity and ' +
      'Python accepts float("Infinity"); this contract knowingly diverges from both.',
  },
  {
    input: '-Infinity',
    expected: null,
    rationale: 'Rejected for the same reason as "Infinity".',
  },

  // --- Alternative radixes ------------------------------------------------
  {
    input: '0x1F',
    expected: null,
    rationale:
      'Hexadecimal is rejected: this contract reads human decimal text, where "0x1F" is a typo ' +
      'rather than the number 31. Number("0x1F") returns 31, but JavaScript\'s own numeric parser ' +
      'disagrees - parseFloat("0x1F") returns 0 - and Python raises on float("0x1F").',
  },
  {
    input: '0o17',
    expected: null,
    rationale: 'Octal notation is rejected, consistently with hexadecimal.',
  },
  {
    input: '0b11',
    expected: null,
    rationale: 'Binary notation is rejected, consistently with hexadecimal.',
  },

  // --- Separators and locale ----------------------------------------------
  {
    input: '1_000',
    expected: null,
    rationale:
      'Numeric separators are a feature of JavaScript source literals, not of strings. ' +
      'Number("1_000") returns NaN while Python\'s float("1_000") returns 1000; this contract ' +
      'follows JavaScript and rejects it.',
  },
  {
    input: '1,5',
    expected: null,
    rationale:
      'A comma is never a decimal separator here. Which separator is decimal depends on locale, ' +
      'and this contract is deliberately not locale-aware.',
  },
  {
    input: '1,000',
    expected: null,
    rationale:
      'A thousands separator is rejected for the same reason; reading it as 1000 or as 1 would ' +
      'both be guesses about the writer\'s locale.',
  },

  // --- Not numbers at all -------------------------------------------------
  {
    input: 'abc',
    expected: null,
    rationale: 'Arbitrary text is not a number.',
  },
  {
    input: '12n',
    expected: null,
    rationale:
      'A BigInt literal suffix is rejected. parseFloat("12n") returns 12, silently discarding the ' +
      'suffix that carried the meaning.',
  },
  {
    input: ARABIC_INDIC_123,
    expected: null,
    rationale:
      'Digits outside ASCII 0-9 are rejected. Number() also returns NaN for the Arabic-Indic ' +
      'digits U+0661 U+0662 U+0663, even though they spell 123.',
  },
  {
    input: 'constructor',
    expected: null,
    rationale:
      'An inherited object property name is not a number. It is listed because an implementation ' +
      'memoising into a plain object answers this one wrongly: "constructor" in {} is true.',
  },

  // --- IEEE-754 limits ----------------------------------------------------
  {
    input: '1e400',
    expected: null,
    rationale:
      'A value too large for a double is rejected, because Number("1e400") returns Infinity and ' +
      'the contract guarantees a finite result. The magnitude is lost either way; returning null ' +
      'makes the loss impossible to ignore.',
  },
  {
    input: '1e-400',
    expected: 0,
    rationale:
      'A value too small for a double becomes 0, the nearest representable double under ' +
      'IEEE-754. Unlike overflow this stays finite, so it is accepted - the contract cannot ' +
      'repair IEEE-754, only make its behaviour explicit.',
  },
  {
    input: '-1e-400',
    expected: -0,
    rationale:
      'A negative underflow becomes -0, keeping the sign of the value that was lost. This is ' +
      'where preserving negative zero pays for itself.',
  },
  {
    input: '9007199254740993',
    expected: 9007199254740992,
    rationale:
      'Above 2^53 consecutive integers are no longer representable, so this input parses to the ' +
      'nearest double, 9007199254740992. Every JavaScript number parser loses this digit; the ' +
      'contract documents the loss rather than pretending otherwise.',
  },
]

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * Declared as data. Nothing here is executed or measured in this repository: there is no reference
 * machine yet, and a number produced on a developer laptop would be dishonest.
 */
export const benchmarkProfiles = [
  {
    name: 'small-integers',
    description: 'Short integer strings, the dominant shape in form and query-string input.',
    samples: ['0', '7', '42', '1999', '-15'],
  },
  {
    name: 'decimals-and-exponents',
    description: 'Fractional and scientific notation, the shape of spreadsheet and CSV exports.',
    samples: ['3.14159', '-0.001', '1e3', '2.5E-8', '.5'],
  },
  {
    name: 'rejected-inputs',
    description:
      'Inputs that must return null. Measured separately because an implementation may take a ' +
      'very different path when it rejects, and validation-heavy callers hit that path most.',
    samples: ['', '   ', 'abc', '0x1F', '1,5', 'NaN'],
  },
  {
    name: 'whitespace-padded',
    description: 'Valid numbers wrapped in whitespace, isolating the cost of trimming.',
    samples: ['  42  ', '\t7\n', '   -3.5   '],
  },
  {
    name: 'long-inputs',
    description:
      'Pathological lengths, to expose implementations whose cost grows faster than linearly.',
    samples: ['1'.repeat(1000), '0'.repeat(5000) + '1', ' '.repeat(1000) + '42'],
  },
] as const
