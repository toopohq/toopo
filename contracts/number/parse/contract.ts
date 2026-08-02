/**
 * Contract `number/parse@1`.
 *
 * The contract is the folder, not one file. This one carries identity, signature,
 * universal-property applicability and benchmark profiles; block 4.4, the named and settled edge
 * cases, has its own file because it is the only block that grows. All of it declares behaviour and
 * executes nothing: the reference implementation lives in `reference.ts`, and the executable half of
 * each block lives beside it - `signature.test-d.ts` for 4.2, `properties.test.ts` for 4.3,
 * `edge-cases.ts` and `edge-cases.test.ts` for 4.4, `profiles.test.ts` for 4.5.
 *
 * Failure is reported as `null`, with the reason published beside the return channel rather than
 * inside it - the catalogue-wide convention, settled after three forms were built and measured on
 * this contract and on `date/add@1`.
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
    'either null or a finite number: never NaN, never Infinity. Which of the four refusals ' +
    'happened is published by a second export rather than folded into the return value, so a ' +
    'caller who only needs a number is not made to unwrap one. One of the four is that the text ' +
    'carries digit separators - "1,5", "1 000", "1\'000" - which is what a French, German, Swiss ' +
    'or Nordic spreadsheet exports, and a caller holding that reason can correct its user instead ' +
    'of telling them their number is not a number.',

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

/**
 * Why a string is not a decimal number. Declared as a list rather than only as a type, so that the
 * partition is a value the contract can check itself against: `edge-cases.test.ts` requires the
 * reasons the tables actually produce to be exactly these four, which is what stops a literal
 * nobody names any more from surviving as documentation.
 *
 * The literals belong to this contract and to no other. There is no shared failure type in the
 * catalogue, so a reason means exactly what this contract says it means and nothing has to be kept
 * compatible across features.
 *
 * The partition is frozen with the major, so it was chosen against a test rather than by taxonomy:
 * two motives share a literal only when one message covers both without lying AND no caller acts
 * differently on them.
 *
 * The freeze bites at publication, not at authorship. Nothing in this repository is published, no
 * caller switches on these literals yet, and this partition gained `separator` after it was first
 * written. Once `number/parse@1` ships, the same addition costs `number/parse@2` - which is why the
 * paragraphs below argue each literal rather than listing it.
 *
 * `empty` and `overflow` each earn theirs. "Not a decimal number" is simply false of `1e400`, which
 * is a well-formed decimal with no finite double; and a blank field is a caller telling its user
 * "this is required" where a malformed one says "this is not a number" - the distinction a caller
 * would otherwise have to rebuild by restating this contract's grammar in its own code.
 *
 * `separator` earns its own, and an earlier revision of this contract was wrong to refuse it. The
 * refusal argued that membership could only be defined by a second grammar - a second thing that
 * can be wrong, and one the coupling property does not cover. Measured on 41 inputs, that is false:
 * an input is a separator mistake exactly when it matches the grammar above once the separator
 * characters are removed, which is the same grammar consulted twice rather than a second one. The
 * argument that decided it is the caller's, not the implementer's: `1,5` is the most frequent real
 * refusal in half of Europe, and a caller holding this reason corrects its user in one sentence
 * where the residual reason leaves it guessing.
 *
 * Which characters count is behaviour, so block 4.4 settles it one case at a time rather than a
 * list here doing it twice. The family is the comma, the underscore, the apostrophe, the no-break
 * space and the narrow no-break space; the full stop, the ordinary space and the Arabic separators
 * are excluded, each for a reason its own case in block 4.4 carries.
 *
 * `not-decimal` is the residual, and it is written here as one rather than dressed up as a peer:
 * twenty-two of the thirty-four refusals in block 4.4 carry it. A `wrong-radix` reason is refused:
 * `0o17` would be a radix prefix while `0777` parses as seven hundred and seventy-seven, so the
 * category is inconsistent at its own edge.
 */
export const failureReasons = ['empty', 'separator', 'not-decimal', 'overflow'] as const

export type ParseFailureReason = (typeof failureReasons)[number]

/**
 * The diagnostic surface. `parseNumber` keeps answering `number | null`, and a caller who needs to
 * know why asks.
 *
 * The reason is published beside the return channel rather than inside it because that form is
 * additive: a contract can ship `name@1` with no diagnostic and gain one later without breaking
 * anyone, where putting the reason in the return type freezes it into the major on day one. On
 * detection the two forms that carry a reason were measured to tie, so the error convention is not a
 * verification question.
 *
 * That tie is published here at the strength it was measured on *this* contract, which is not the
 * strength it has on the other one. On `date/add@1` it is a full-battery tie - every mutant of that
 * round, under both lenses. Here it rests on four cells: the three reason defects and the coupling
 * probe, under one lens. Four cells are enough to answer the question that was asked, since two forms
 * that both publish a reason can only differ where a reason is at stake, and they are not enough to
 * call it a full-battery tie. An earlier revision of this comment said "measured to tie exactly" of
 * both contracts at once, which claimed the stronger measurement for the weaker one.
 *
 * The measurement is replayable rather than asserted: the batteries it comes from are at the
 * annotated tags `evidence/error-convention-round-2` and `evidence/error-convention-round-3`.
 *
 * The cost is one extra traversal, on the failing path and only there.
 *
 * One measured consequence belongs here rather than in a commit message, because it generalises past
 * this contract: publishing a reason does not only add detection, it can *move* where the detection
 * happens. P-17 of the battery memoises into a bare object consulted before anything else, so
 * `CACHE["constructor"]` is served from `Object.prototype` - a function, not an analysis. Under a
 * convention that reports failure as `null` alone, the poisoned entry was the answer and
 * `parseNumber("constructor")` returned a function, which the named case caught on the value. Under
 * this convention the poisoned entry is read as an analysis whose `ok` is `undefined`, so
 * `parseNumber` answers `null` - which is the right answer - and the only export that still sees
 * anything is the diagnostic, which answers `undefined` where the contract requires "not-decimal".
 * Measured: read blind to which reason it names, this contract catches nothing at all on P-17.
 *
 * The general form, for whoever writes the twelfth contract. A value channel that reports failure as
 * one uninformative value can absorb a defect by accident, because on that input the wrong answer
 * and the right answer are the same value. A contract that ships without a diagnostic is not merely
 * less informative about that class of defect - it is blind to it, and it will not find out, because
 * the named case that used to catch it still passes.
 */
export type DescribeParseFailure = (input: string) => ParseFailureReason | null

/**
 * The coupling between the two exports, stated here because it is a promise of the contract rather
 * than a detail of one implementation: a string fails to parse exactly when it has a description.
 *
 * The reference cannot violate it - both exports derive from one private analysis, so the module
 * holds one grammar and there is no way for the two to drift. That is not a reason to drop the
 * property. The contract governs every implementation, not this one, and an implementation that
 * writes the two independently - the obvious thing to do when the parsing path is optimised and the
 * diagnostic one is left alone - can diverge on any input the named cases do not carry.
 */
export const couplingRule =
  'parseNumber(s) === null if and only if describeParseFailure(s) !== null, for every string s'

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
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * Declared as data. Nothing here is executed or measured in this repository: there is no reference
 * machine yet, and a number produced on a developer laptop would be dishonest.
 *
 * Every profile declares the class its samples belong to, because without it a profile can measure
 * something other than what it names and nothing says so. This one did: `long-inputs` carried
 * '1'.repeat(1000), a thousand digits whose value overflows to Infinity and is therefore rejected,
 * so a third of the profile timed the rejection path instead of the cost of reading a long number.
 * `profiles.test.ts` runs the reference over every sample and fails when a declared class does not
 * hold, which is what turns this block from a comment into a claim.
 */
export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must do. A profile mixing both classes measures neither. */
  readonly sampleClass: 'accepted' | 'rejected'
  readonly samples: readonly string[]
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'small-integers',
    description: 'Short integer strings, the dominant shape in form and query-string input.',
    sampleClass: 'accepted',
    samples: ['0', '7', '42', '1999', '-15'],
  },
  {
    name: 'decimals-and-exponents',
    description: 'Fractional and scientific notation, the shape of spreadsheet and CSV exports.',
    sampleClass: 'accepted',
    samples: ['3.14159', '-0.001', '1e3', '2.5E-8', '.5'],
  },
  {
    name: 'rejected-inputs',
    description:
      'Inputs that must return null. Measured separately because an implementation may take a ' +
      'very different path when it rejects, and validation-heavy callers hit that path most.',
    sampleClass: 'rejected',
    samples: ['', '   ', 'abc', '0x1F', '1,5', 'NaN'],
  },
  {
    name: 'whitespace-padded',
    description: 'Valid numbers wrapped in whitespace, isolating the cost of trimming.',
    sampleClass: 'accepted',
    samples: ['  42  ', '\t7\n', '   -3.5   '],
  },
  {
    name: 'long-inputs',
    description:
      'Pathological lengths, to expose implementations whose cost grows faster than linearly. The ' +
      'thousand digits sit behind the decimal point so that the value stays finite and the sample ' +
      'stays on the accepting path; written as an integer it overflows and measures rejection.',
    sampleClass: 'accepted',
    samples: ['0.' + '1'.repeat(1000), '0'.repeat(5000) + '1', ' '.repeat(1000) + '42'],
  },
]
