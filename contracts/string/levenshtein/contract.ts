/**
 * Contract `string/levenshtein@1`. The anatomy of a contract folder is the catalogue's and is
 * described in `catalogue/every-contract.ts`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * This contract is total. It answers every pair of strings with a number and never returns `null`, so
 * it publishes no diagnostic and there is no coupling property here - the catalogue's error
 * convention is for fallible functions.
 *
 * It is the first contract in the catalogue whose properties are strong by nature rather than by
 * construction: the four axioms of a metric hold of every pair of strings, and between them they
 * refuse most of the ways an edit distance can be wrong. Block 4.4 is a third of the size of
 * `number/parse@1`'s as a result, and almost all of what is left settles the one decision no axiom
 * can reach - which unit an edit is counted in.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'string/levenshtein',
  major: 1,
  exportName: 'levenshtein',

  summary:
    'Count the single-character insertions, deletions and substitutions that turn one string into ' +
    'the other, counting in Unicode code points.',

  /** Written to answer the natural search query "levenshtein distance javascript". */
  description:
    'Measures how far apart two strings are in JavaScript and TypeScript, as the smallest number of ' +
    'single-character edits - insert one character, delete one, replace one - that turns the first ' +
    'into the second. It is the classic edit distance and nothing else: a transposition costs two ' +
    'edits rather than one, every edit costs the same, and the result is a count rather than a ' +
    'similarity score between zero and one. The decision that separates implementations of it is ' +
    'invisible in the signature and is settled here: an edit is one Unicode code point, so a string ' +
    'holding one emoji is one edit away from the empty string. The widely used JavaScript ' +
    'implementations count UTF-16 code units instead and answer two, because JavaScript strings are ' +
    'stored as UTF-16 and an emoji occupies two of them. Nothing is normalised, nothing is folded to ' +
    'lower case and nothing is trimmed, so two strings that a person would call the same and a ' +
    'computer would not are one or more edits apart - which is what a caller who wants otherwise ' +
    'applies before calling. The result is always a non-negative whole number, and the function is ' +
    'a metric: zero exactly on two identical strings, the same in both directions, and never ' +
    'improved by a detour through a third string.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: the same pair of strings has a different right
   * answer under a distance that folds case or normalises, which is a different contract.
   */
  inputDomain:
    'Human-authored text held in memory: names, labels, search queries, product codes, identifiers, ' +
    'and short free text. Typo tolerance, deduplication, "did you mean", and the suggestion of a ' +
    'nearest match from a small set. It is not a similarity ratio, not a phonetic match, not a ' +
    'locale-aware comparison, and not an index: a caller ranking one query against a large corpus ' +
    'wants a data structure, and this function is what such a structure would call. Damerau-Levenshtein, ' +
    'where a transposition costs one edit, and weighted edit distances, where the operations cost ' +
    'different amounts, answer different questions and are separate contracts.',

  /**
   * How this contract stands to the language, recorded because `array/group-by@1` established that
   * the catalogue re-examines itself against a moving language rather than clearing permanent rule 7
   * once and keeping it.
   *
   * ECMAScript ships no string distance of any kind and no proposal for one. The nearest thing in the
   * platform is `Intl.Collator`, which orders two strings and does not measure the gap between them,
   * and `Intl.Segmenter`, which cuts a string into units and says nothing about two strings at all.
   */
  relationToTheLanguage:
    'the language ships no edit distance, and nothing in Intl measures the gap between two strings',

  searchAliases: [
    'levenshtein',
    'levenshtein distance',
    'edit distance',
    'string distance',
    'how similar are two strings',
    'string similarity',
    'fuzzy match',
    'fuzzy string matching',
    'typo distance',
    'did you mean',
    'closest match',
    'compare two strings',
    'difference between two strings',
    'damerau levenshtein',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 *
 * Two required strings and a number back. There is no options object, because every option a caller
 * might reach for - fold the case, normalise, weight the operations, stop at a threshold - changes
 * what the function computes rather than how, and a contract whose answers depend on a flag settles
 * nothing.
 */
export type Levenshtein = (a: string, b: string) => number

/**
 * What one edit is counted in - the decision this contract exists to settle, and the one that is
 * invisible in the signature above.
 *
 * **Unicode code points**: the sequence `for...of` and `Array.from` yield, where an astral character
 * is one unit and a combining mark is a unit of its own. Three candidates were built and measured.
 *
 * *UTF-16 code units* are what JavaScript stores and what the ecosystem counts. Measured by reading
 * the source: `fastest-levenshtein` reads `a.charCodeAt(i)` against `a.length`, and `leven` does the
 * same. The consequence is measured too, by the two oracles that computed block 4.4: the distance
 * between one emoji and the empty string is 1 counting code points and 2 counting code units, and
 * `a😀b` is 1 away from `ab` counting code points and 2 counting code units. A caller who deletes one
 * character and is told two edits happened has been told something false about their own text. This
 * contract diverges from the ecosystem here, on the same grounds `date/add@1` diverged from it on a
 * fractional month: an answer that looks right and is not what was asked is worse than a divergence a
 * reader can see.
 *
 * *Grapheme clusters* are what a person sees, and they are refused on three counts, two of them
 * measured. The cost: on a 12 600-code-unit sample, decomposing into graphemes with `Intl.Segmenter`
 * takes 1.503 ms against 0.050 ms for code points and 0.081 ms for a `charCodeAt` loop - thirty times
 * the price of the whole decomposition, on a function whose common case is two short strings. The
 * ambient read: `new Intl.Segmenter(undefined, { granularity: 'grapheme' })` resolves to the process
 * default locale - measured, `fr-FR` on the machine this was written on - which is ambient input the
 * signature does not declare, and is the same shape as the process time zone `date/add@1` refuses.
 * That one is removable by pinning a locale, and it is recorded as a caution rather than as the
 * decision, because it was also measured not to change the answer: seven locales from `en` to `ko`
 * agree on the segmentation of seven samples, including a ZWJ emoji, a Devanagari conjunct and a flag
 * sequence. What is not removable is the third count, and it is stated rather than measured because
 * one runtime cannot measure it: grapheme boundaries follow the Unicode version the runtime's ICU
 * carries, so two runtimes at two versions can disagree about a newly assigned emoji sequence, and a
 * distance that changes with the runtime is not a distance.
 *
 * Code points are also what the catalogue already decided a string is: `array/group-by@1` settles
 * that grouping the string `aab` yields the groups a person would expect because the input is read by
 * iteration, and iteration yields code points.
 *
 * Measured, the choice costs nothing: `Array.from` on the same sample is faster than the
 * `charCodeAt` loop the ecosystem writes, and the decomposition is linear where the comparison is
 * quadratic.
 */
export const countedIn =
  'Unicode code points - the sequence `for...of` and `Array.from` yield, where an astral character ' +
  'is one unit and a combining mark is a unit of its own'

/**
 * What is *not* done to the text before it is compared, published because a refusal to act is
 * invisible to a caller reading the signature.
 *
 * No Unicode normalisation, no case folding, no trimming. The reason is one reason for all three, and
 * it is structural rather than a preference: each of them maps two different strings onto one, and a
 * distance that maps two different strings onto one answers zero for a pair that is not a pair of
 * identical strings. That is `d(a, b) = 0 if and only if a = b` failing - one of the four axioms this
 * contract publishes and the only one that forces an answer out of an implementation at all. A
 * contract cannot fold case and claim to be a metric on strings; it would be a metric on
 * case-folded strings, which is a different function with a different domain.
 *
 * Case folding carries a second cost that is worth naming because it is the same one graphemes carry:
 * `'I'.toLowerCase()` is `'i'` everywhere except Turkish, so a case-insensitive distance either reads
 * the ambient locale or silently picks one for its callers.
 *
 * A caller who wants any of the three applies it to both arguments before calling. That composition
 * is exact and needs nothing from this contract, which is why none of the three is an option here.
 */
export const comparedAsWritten =
  'no Unicode normalisation, no case folding, no trimming: the text is compared as the caller wrote it'

/**
 * What this contract claims about itself, as data rather than as prose in a comment.
 *
 * These four are the axioms of a metric, and they are the reason this contract's table is small: they
 * hold of *every* pair of strings, so they refuse whole families of wrong answer without any case
 * having to name one. `properties.test.ts` answers each of them with one property and checks that no
 * axiom is declared here without one.
 *
 * The four are not equally strong and that is worth publishing. Three of them - identity, symmetry
 * and the triangle inequality - are all satisfied by the function that answers zero for everything,
 * which is why a contract built on them alone would be verified and useless. Discernibility is the
 * one that forces an answer out, and the mutation battery measures which guard actually kills the
 * constant-zero implementation rather than leaving that to argument.
 */
export const metricAxioms = [
  {
    name: 'identity',
    statement: 'The distance from a string to itself is zero.',
  },
  {
    name: 'discernibility',
    statement:
      'A distance of zero means the two strings are the same string. This is the axiom that ' +
      'forbids an implementation from answering zero for everything, and the reason nothing here ' +
      'is normalised or folded: any such mapping makes two different strings zero apart.',
  },
  {
    name: 'symmetry',
    statement:
      'The distance does not depend on which string is given first. It holds because the three ' +
      'operations come in inverse pairs of equal cost - an insertion on one side is a deletion on ' +
      'the other, and a substitution is its own inverse - and it fails the moment an implementation ' +
      'prices two of them differently.',
  },
  {
    name: 'triangle inequality',
    statement:
      'No detour is shorter: the distance from a to c never exceeds the distance from a to b plus ' +
      'the distance from b to c. It is the axiom that catches an implementation whose notion of two ' +
      'characters being equal is not transitive - a fuzzy comparison, a tolerance, a unit applied to ' +
      'one side and not the other - none of which any single named case would notice.',
  },
] as const

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Object.is` rather than `===` on what is only ever a whole number, for one reason: `-0 === 0` is
 * true and `Object.is(-0, 0)` is false, and an implementation that ends in `Math.round` can return
 * `-0` - measured, `Math.round(-0.2)` is `-0`. A count is a positive zero or it is not a count, and
 * `===` would accept the other one.
 */
export const outputsAreEqual = (a: number, b: number): boolean => Object.is(a, b)

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at all
 * is the catalogue's rule; the figure is this contract's, and it was measured here rather than
 * copied from the three that carry the same 1000.
 *
 * Three runs of this contract's property file at 100, 1000 and 10000 draws cost 14-18 ms, 47-51 ms
 * and 297-318 ms of test time respectively. An order of magnitude over fast-check's default is bought
 * for about 33 ms; the next order costs six times that to redraw strings of at most eight symbols
 * from an alphabet of fourteen.
 */
export const propertyRuns = 1000

/**
 * How this contract answers the four universal properties of the catalogue.
 *
 * `deterministic` is the interesting one here, and its entry records a finding rather than a witness.
 * This function is closed over two immutable primitives and recomputes every cell of its table from
 * them, so the only way to make two identical consecutive calls disagree is to leak state between
 * calls - and the leaks that are plausible on a function of this shape are caches, which answer a
 * repeated call from the slot the first call filled and are therefore invisible to determinism by
 * construction.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: false,
    reason:
      'The signature takes two `string` arguments, primitives that are immutable by construction in ' +
      'JavaScript. No implementation, correct or broken, can violate this, so a test asserting it ' +
      'would be structurally incapable of failing - the same measurement `number/parse@1` recorded, ' +
      'confirmed on a second monomorphic signature over primitives.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by L-19 of the battery: an implementation that counts the ' +
      'edits into an accumulator hoisted out of the function - the shape a variable reaches when it ' +
      'is made "reusable" - answers d on the first call and 2d on the second. It is the only witness ' +
      'that reddens this property on its own failure condition. Measured, one other mutant reddens ' +
      'it - L-15, which reads the answer out of the transposed corner of the matrix and throws when ' +
      'the two lengths differ - and a property that has only ever been red on a mutant that throws ' +
      'has not been seen red on the sentence it makes, which is the standard `array/group-by@1` set ' +
      'when it wrote M-21. That there is no third witness is a measurement rather than an omission: ' +
      'every other candidate was a cache, and a cache answers a repeated call from its own first ' +
      `answer. ${DETERMINISM_ORDERING_FINDING} - L-20 is that mutant here.`,
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: this function reads no clock, no locale and no time zone, so the call ' +
      'history is the only ambient input it can plausibly acquire, and a cache keyed on a cheap ' +
      'proxy for its arguments is how it acquires it. The property interleaves a probe with an ' +
      'arbitrary history and requires the probe to answer identically either way. Witnessed by L-20, ' +
      'which remembers the last answer under the lengths of the two arguments: measured, it reddens ' +
      'here and leaves determinism green, which is the fourth contract on which that ordering has ' +
      'been measured and the first on which determinism has no independent witness of the same kind.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason: `${NO_AMBIENT_OUTPUT_FINDING}. Confirmed here on a fourth shape without changing a word of it.`,
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * A profile's name is a claim about its samples, and `profiles.test.ts` checks it. The vocabulary is
 * this contract's own and is the fourth one the catalogue has produced: `number/parse@1` and
 * `date/add@1` partitioned samples into accepted and rejected, `array/group-by@1` needed the shape of
 * the grouping instead, and a distance has neither - what a profile here claims is where the answer
 * sits between its two bounds, because that is what decides which part of the matrix an
 * implementation spends its time in.
 */
export type DistanceClass =
  /** The two strings are identical, so the answer is zero and the diagonal is free. */
  | 'zero'
  /** Exactly one edit apart: the answer is one, and a banded implementation may stop early. */
  | 'one-edit'
  /** One side is empty, so the answer is the whole length of the other. */
  | 'the-whole-of-one-side'
  /** More than a quarter of the longer side, which is where no band helps. */
  | 'far'

export type BenchmarkSample = {
  readonly a: string
  readonly b: string
}

export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must answer. A profile mixing classes measures neither. */
  readonly distanceClass: DistanceClass
  readonly samples: readonly BenchmarkSample[]
}

const repeated = (text: string, times: number): string => text.repeat(times)

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/**
 * A long word, drawn from one seed so that a benchmark run and a reader are looking at the same
 * string. The generator is a linear congruential one rather than a formula in the index, because the
 * obvious `at * 7 + seed` produces a periodic word and two seeds then differ by a rotation - measured,
 * two such words of a thousand code points are six edits apart, and the profile that claimed they
 * were far apart failed the guard below on its first run.
 */
const wordOfLength = (length: number, seed: number): string => {
  let state = (seed + 1) * 7919

  return Array.from({ length }, () => {
    state = (state * 1103515245 + 12345) % 2147483648

    return ALPHABET[state % ALPHABET.length]
  }).join('')
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'identical',
    description:
      'The two strings are the same. The dominant shape in deduplication, and the one a fast path ' +
      'is written for: an implementation that compares the two strings first answers in constant ' +
      'time here and in quadratic time everywhere else.',
    distanceClass: 'zero',
    samples: [
      { a: 'levenshtein', b: 'levenshtein' },
      { a: wordOfLength(1_000, 0), b: wordOfLength(1_000, 0) },
    ],
  },
  {
    name: 'one-edit-apart',
    description:
      'A typo: one character inserted, deleted or replaced. The dominant shape in spelling ' +
      'correction and in "did you mean", and the region a banded implementation is written for - ' +
      'which is why the long sample matters more here than anywhere else, since a band is exactly ' +
      'what turns a quadratic call on a thousand code points into a linear one.',
    distanceClass: 'one-edit',
    samples: [
      { a: 'levenshtein', b: 'levenshtei' },
      { a: 'address', b: 'adress' },
      { a: wordOfLength(1_000, 0), b: wordOfLength(1_000, 0).slice(1) },
    ],
  },
  {
    name: 'unrelated',
    description:
      'Two strings that share no structure, so every cell of the matrix is a real choice, no band ' +
      'helps and no common affix can be trimmed. The worst case, and the one that says at what size ' +
      'an implementation stops being usable.',
    distanceClass: 'far',
    samples: [
      { a: 'aaaaaaaaaa', b: 'bbbbbbbbbb' },
      { a: repeated('ab', 100), b: repeated('cd', 100) },
      { a: wordOfLength(1_000, 1), b: wordOfLength(1_000, 2) },
    ],
  },
  {
    name: 'against-the-empty-string',
    description:
      'One side is empty. It is the cheapest possible call that still has to look at all of one ' +
      'argument, and callers filtering a list against a blank query make it far more often than they ' +
      'expect to.',
    distanceClass: 'the-whole-of-one-side',
    samples: [
      { a: '', b: '' },
      { a: 'levenshtein', b: '' },
      { a: '', b: wordOfLength(500, 3) },
    ],
  },
  {
    name: 'astral-text',
    description:
      'Text made of astral characters, where the decomposition into code points allocates two units ' +
      'of storage per unit of length. Measured separately because it is the one shape where the ' +
      'choice of unit has a cost, and a reader comparing implementations should see what it is.',
    distanceClass: 'far',
    samples: [
      { a: repeated('\u{1F600}\u{1F601}', 50), b: repeated('\u{1F602}\u{1F603}', 50) },
    ],
  },
]
