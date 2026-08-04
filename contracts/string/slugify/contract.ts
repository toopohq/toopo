/**
 * Contract `string/slugify@1`. The anatomy of a contract folder is the catalogue's and is described
 * in `catalogue/every-contract.js`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * This contract is total. Every string has a slug, so it publishes no diagnostic, there is no
 * coupling property here, and the empty slug is an answer rather than a refusal.
 *
 * It is the first contract in the catalogue with no oracle of any kind. `number/parse@1` had
 * `Number`, `parseFloat` and Python's `float`; `date/add@1` had six libraries unanimous on
 * clamping; `string/levenshtein@1` had the axioms of a metric, which are theorems. Here the
 * ecosystem disagrees violently and nothing is true - `Crème Brûlée` becoming `creme-brulee` is
 * defensible, not correct. What replaces the oracle is a rule short enough to be argued with, and
 * the measurement of what the alternatives cost.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'string/slugify',
  major: 1,
  exportName: 'slugify',

  summary:
    'Turn text into a URL-safe identifier: one lower-case run of letters, marks and digits per ' +
    'word, joined by single hyphens. The output is Unicode, not ASCII.',

  /**
   * Written to answer the natural search query "slugify javascript", and to contradict what that
   * reader expects in its second sentence rather than in a footnote.
   */
  description:
    'Turns a title, a name or a heading into an identifier that is safe in a URL path segment, ' +
    'readable, and stable. The first thing to know is the one that will surprise you: the output ' +
    'is not restricted to ASCII. Japanese text stays Japanese, Cyrillic stays Cyrillic, and Arabic ' +
    'stays Arabic - what is removed is punctuation, symbols, emoji and case, not other people\'s ' +
    'writing systems. Latin and Greek diacritics are folded to their base letter, so `Crème ' +
    'Brûlée` becomes `creme-brulee`, and that folding is Unicode\'s own decomposition rather than a ' +
    'table this contract wrote: `Straße` stays `straße` and `Æther` stays `æther`, because Unicode ' +
    'does not decompose those letters and inventing a mapping for them would be inventing German ' +
    'and English. If you need ASCII, romanise first and slugify the result - that is a different ' +
    'function, and it is named below. The result is lower case, carries no leading, trailing or ' +
    'doubled hyphen, is unchanged by slugifying it again, and is deliberately lossy: different ' +
    'texts can share one slug, so a slug is not a unique key.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: the same text has a different right answer under
   * a slug meant for a DNS label, which cannot carry a non-ASCII code point at all.
   */
  inputDomain:
    'Human-authored short text held in memory: article titles, product names, headings, tags, ' +
    'category labels. The output is written for a URL path segment, a fragment identifier, or a ' +
    'key in a document a person will read. It is not written for a DNS label, a filename on a ' +
    'case-insensitive file system, or an identifier in a language with an ASCII grammar - each of ' +
    'those has a narrower alphabet than a URL does, and a contract that satisfied all of them at ' +
    'once would be the intersection, which is the empty slug for most of the world.',

  /**
   * How this contract stands to the language, recorded because `array/group-by@1` established that
   * the catalogue re-examines itself against a moving language rather than clearing permanent rule
   * 7 once and keeping it.
   *
   * ECMAScript ships `String.prototype.normalize`, which this function uses, and
   * `encodeURIComponent`, which percent-escapes rather than transliterates and answers
   * `Cr%C3%A8me%20Br%C3%BBl%C3%A9e` - unreadable, unstable under re-encoding, and not an
   * identifier. Nothing in the platform produces a slug.
   *
   * Rule 7 is satisfied by a measurement rather than by an argument: across fifty-seven samples the
   * four most used libraries agree on seven. The rest of that measurement is in `ecosystem` below.
   */
  relationToTheLanguage:
    'the language ships normalisation and percent-encoding, and nothing that produces an identifier',

  searchAliases: [
    'slugify',
    'slug',
    'url slug',
    'slugify javascript',
    'string to slug',
    'title to url',
    'seo friendly url',
    'permalink from title',
    'url safe string',
    'make a string url safe',
    'kebab case a sentence',
    'anchor id from heading',
  ],
} as const

/**
 * What the ecosystem does, measured rather than characterised, because it is the whole reason this
 * contract can exist without an oracle and the whole reason its answers have to be argued for.
 *
 * Measured on 2026-08-03 under node v24.15.0, over fifty-seven samples, against `slugify@1.6.9`,
 * `slug@12.0.1`, `@sindresorhus/slugify@3.0.0` and `github-slugger@2.0.0`, with `slugify` read both
 * at its defaults and at `{ lower: true, strict: true }`. The measurement is not replayable from
 * this repository, which takes no dependency on any of the four; what is replayable is every
 * consequence of it that block 4.4 settles.
 *
 * The number that matters is the first one. Five columns agree on seven samples out of fifty-seven,
 * and that is after folding case to give them the best chance.
 */
export const ecosystem = {
  samplesCompared: 57,
  samplesAgreedOn: 7,

  findings: [
    'No library is consistent with itself about writing systems. `slugify` transliterates Cyrillic, ' +
      'Greek and Arabic, and eliminates Japanese, Korean, Hebrew, Thai and Devanagari to the empty ' +
      'string. That is not a principle, it is the size of a table - which is the sentence this ' +
      'contract is built on, because a rule that can be stated in three lines can be argued with ' +
      'and a table of two thousand entries can only be inherited.',
    '`slug` never answers the empty string: when its table produces nothing it slugs the base64 ' +
      'encoding of the input instead, so a party popper becomes `8joiq` and three hyphens become ' +
      '`ls0t`. An identifier that looks like an identifier and means nothing is worse than none.',
    '`slug` throws on a lone surrogate rather than answering, so a truncated string crashes a ' +
      'function whose whole job is to be safe to call on user input.',
    '`slugify` at its defaults does not lower-case, so `Hello World` becomes `Hello-World` and ' +
      '`user@example.com` is returned unchanged - the default output of the most used library in ' +
      'this space is not safe in a URL.',
    '`github-slugger` folds nothing and trims nothing: it answers `crème-brûlée`, and leading, ' +
      'trailing and doubled hyphens survive, so three spaces become `---`. It is an anchor ' +
      'generator rather than a slugifier, and it is in this table because it is the one column ' +
      'that keeps other writing systems.',
    'The three libraries that substitute words for symbols disagree about which words. A euro sign ' +
      'is `euro`, `e`, or nothing; an ampersand is `and` or nothing; a per-cent sign is `percent` ' +
      'or nothing. This contract substitutes no word for any symbol, and that disagreement is the ' +
      'measurement behind the refusal.',
    'All five agree on exactly one thing worth having: none of them truncates. Four hundred ' +
      'letters in, four hundred letters out. This contract declares no length bound for the same ' +
      'reason, and because a bound would introduce collisions silently.',
  ],
} as const

/**
 * What this function is not, and where to go instead. A catalogue that refuses something has to say
 * what obtains it, or the refusal reads as a gap.
 *
 * The reader who wants `japanese-text` rather than `日本語テキスト` wants a **romanisation**, which
 * is a different function with a different signature - it takes a script and a scheme, because
 * Hepburn and Kunrei disagree about Japanese and the two published Greek schemes disagree about
 * `η`, measured, `h` against `i`. It composes exactly: romanise, then slugify the result. Putting
 * it inside this function would freeze one scheme per script into this major version for life, and
 * would be wrong for somebody in every script it covered.
 */
export const composeInsteadOfConfiguring = [
  {
    want: 'an ASCII-only slug',
    instead:
      'romanise the text first and slugify the result. A romanisation is a separate contract, not ' +
      'a missing option here: it needs a scheme per script, and the schemes disagree with each ' +
      'other in ways no single answer settles.',
  },
  {
    want: 'a slug bounded to n characters',
    instead:
      'slug first, then truncate at a separator with the bound the destination actually has - 63 ' +
      'code points for a DNS label, 255 bytes for most file systems. Truncating inside this ' +
      'function would need the bound and the unit, and would introduce collisions the caller could ' +
      'not see.',
  },
  {
    want: 'a slug guaranteed unique',
    instead:
      'ask the store that owns the namespace, and append a discriminator when it answers that the ' +
      'slug is taken. This function is deliberately lossy and cannot be made injective; see ' +
      '`lossiness` below.',
  },
  {
    want: 'a different separator, or upper case, or an options object',
    instead:
      'a different contract. Every one of those changes what the function computes rather than how, ' +
      'and a contract whose answers depend on a flag settles nothing.',
  },
] as const

/**
 * The negative property, published in block 4.1 because a caller who does not know it builds
 * identifiers that collide in silence.
 *
 * This function is **not injective, by design**. It removes information at every step - case,
 * punctuation, symbols, emoji, diacritics, presentation forms - so distinct texts share a slug, and
 * the cheapest collision is two code points long: `a!` and `a` are both `a`. Block 4.4 names a pair
 * that makes the cost concrete rather than abstract: `C++` and `C#` are two different programming
 * languages and one slug, `c`.
 *
 * The empty slug is the extreme of the same fact. Any text holding no letter, mark or digit answers
 * the empty string, so `!!!`, a lone surrogate and the empty string are one slug between them.
 *
 * A caller storing slugs as keys therefore needs a uniqueness check it owns. That is not a defect
 * of this function - a slug that could not be lossy would be a percent-encoding, which is the thing
 * a slug exists not to be.
 */
export const lossiness =
  'not injective by design: distinct texts share a slug, `a!` and `a` collide at two code points, ' +
  'and any text with no letter, mark or digit answers the empty slug'

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The declared signature. Every implementation must expose exactly this type;
 * `signature.test-d.ts` fails the suite when an implementation deviates.
 *
 * One string in, one string out, and no options object. Every option a caller might reach for -
 * a different separator, a length bound, ASCII output, keeping the case - changes what the function
 * computes rather than how, so each of them belongs to another contract. `composeInsteadOfConfiguring`
 * names where each one goes.
 */
export type Slugify = (text: string) => string

/**
 * The rule, as data rather than as prose in a comment, because it is what this contract sells.
 *
 * Six steps, in this order. `properties.test.ts` answers each of them with at least one property
 * and checks that no step is published here without one - the same discipline
 * `string/levenshtein@1` applies to its axioms, and for the same reason: a step nobody checks is a
 * claim this contract makes and does not keep.
 *
 * Every fold below is Unicode's. That is the point, and it is what a reader is invited to attack:
 * three lines can be argued with, a table of two thousand entries can only be inherited.
 */
export const theRule = [
  {
    name: 'unify',
    statement:
      'The text is normalised to NFKC first, so that presentation forms and their ordinary ' +
      'spellings are one text. Fullwidth `ＡＢＣ` and `ABC` are the same three letters typed on ' +
      'two keyboards, and a slugifier that gave them two identifiers would be the collision ' +
      'defect in reverse.',
  },
  {
    name: 'fold',
    statement:
      'Each code point is replaced by the first code point of its canonical decomposition, so `é` ' +
      'becomes `e` and `ế` becomes `e`. This is Unicode\'s own statement about what those ' +
      'characters are made of, not a mapping written here - which is why `ß` stays `ß` and `æ` ' +
      'stays `æ`: Unicode does not decompose them, and answering `ss` and `ae` means writing down ' +
      'German and English by hand.',
  },
  {
    name: 'absorb',
    statement:
      'A mark is dropped when the base of its run already carries it - when the two compose into ' +
      'one code point. A mark that composes onto nothing is part of the orthography of its script ' +
      'rather than a diacritic, so Devanagari vowel signs, the virama, the nukta, Arabic harakat ' +
      'and Hebrew niqqud all survive. The base of the run is the test, never the code point to the ' +
      'left: Unicode lets a mark of high combining class reach the base across a mark of lower ' +
      'class.',
  },
  {
    name: 'keep',
    statement:
      'A letter, a mark or a decimal digit survives. Everything else - punctuation, symbols, ' +
      'emoji, control characters, unpaired surrogates, whitespace - is a boundary and is removed. ' +
      'No symbol is replaced by a word: an ampersand does not become `and`, because that is ' +
      'English, and a euro sign does not become `euro`, because the ecosystem cannot agree whether ' +
      'it is `euro`, `e` or nothing.',
  },
  {
    name: 'lower',
    statement:
      'Each base is lower-cased on its own rather than as part of the whole text. JavaScript\'s ' +
      'lower-casing is context sensitive - a Greek sigma at the end of a word becomes a final ' +
      'sigma - and that context includes characters this function is about to discard. An answer ' +
      'must not depend on a character that does not survive it.',
  },
  {
    name: 'join',
    statement:
      'Consecutive survivors form a run; runs are joined by exactly one hyphen. A boundary before ' +
      'the first run or after the last one produces nothing, so a slug never begins or ends with a ' +
      'separator and never carries two in a row.',
  },
] as const

/**
 * The alphabet the output is closed under, declared here because it is the promise a caller builds
 * a route table on.
 *
 * A slug is either empty, or one or more runs of letters, marks and decimal digits joined by single
 * hyphens. It is always equal to its own lower case.
 *
 * It is not `[a-z0-9-]`, and that is the decision this contract is most likely to be argued with.
 * The alternative was measured: restricting to ASCII means answering the empty string for Japanese,
 * Korean, Hebrew, Thai and Devanagari, which is what two of the four libraries do. Every title in
 * those scripts then collides on one slug, silently. A reader who wants ASCII composes a
 * romanisation in front, which `composeInsteadOfConfiguring` names.
 */
export const outputAlphabet = {
  description:
    'either empty, or runs of Unicode letters, marks and decimal digits joined by single hyphens, ' +
    'always equal to its own lower case',
  /** Anchored, and the empty slug is handled beside it rather than by making every part optional. */
  pattern: /^[\p{L}\p{M}\p{Nd}]+(?:-[\p{L}\p{M}\p{Nd}]+)*$/u,
} as const

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Object.is` on two strings is `===` on two strings, and it is written this way for one reason:
 * every contract in this catalogue declares how its outputs are compared, and a reader comparing
 * two of them should not have to work out whether a difference in the operator means a difference
 * in the semantics. Here it does not. There is no `-0` to catch, as there was on a count, and no
 * structural walk to do, as there was on a Map.
 */
export const outputsAreEqual = (a: string, b: string): boolean => Object.is(a, b)

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at
 * all is the catalogue's rule; the figure is this contract's, and it was measured here.
 *
 * Three runs of this contract's property file at 100, 1000 and 10000 draws cost 18-19 ms, 57-62 ms
 * and 385-386 ms of test time respectively. An order of magnitude over fast-check's default is
 * bought for about 40 ms; the next order costs eight times that, on eleven guards each of which
 * normalises twice per draw and asks a composition question per mark.
 */
export const propertyRuns = 1000

/**
 * How this contract answers the four universal properties of the catalogue.
 *
 * `never mutates its arguments` is inapplicable for the third time on a signature over primitives,
 * and the entry says so rather than restating the reasoning.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: false,
    reason:
      'The signature takes one `string`, a primitive that is immutable by construction in ' +
      'JavaScript. No implementation, correct or broken, can violate this, so a test asserting it ' +
      'would be structurally incapable of failing - the same measurement `number/parse@1` recorded ' +
      'and `string/levenshtein@1` confirmed, on a third signature over primitives.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by G-19 of the battery: an implementation that ' +
      'accumulates the runs into an array hoisted out of the function - the shape a variable ' +
      'reaches when it is made "reusable" - answers the slug on the first call and the slug of ' +
      'every call so far on the second. It is the only witness that reddens this property on its ' +
      'own failure condition; every other candidate on a function of this shape is a cache, and a ' +
      `cache answers a repeated call from its own first answer. ${DETERMINISM_ORDERING_FINDING} - ` +
      'G-20 is that mutant here.',
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: this function reads no clock and no time zone, and the one ambient ' +
      'thing it could plausibly read is the call history, through a cache keyed on a cheap proxy ' +
      'for its argument. The property interleaves a probe with an arbitrary history and requires ' +
      'the probe to answer identically either way. Witnessed by G-20, which remembers the last ' +
      'answer under the length of the argument: measured, it reddens here and leaves determinism ' +
      'green, which is the fifth contract on which that ordering has been measured.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason: `${NO_AMBIENT_OUTPUT_FINDING}. Confirmed here on a fifth shape without changing a word of it.`,
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * A profile's name is a claim about its samples, and `profiles.test.ts` checks it. The vocabulary is
 * this contract's own and is the fifth the catalogue has produced: `number/parse@1` and
 * `date/add@1` partitioned samples into accepted and rejected, `array/group-by@1` needed the shape
 * of the grouping, `string/levenshtein@1` needed where the answer sits between two bounds. What a
 * profile claims here is **how much of the input survives**, because that is what decides how many
 * of the three expensive steps - a normalisation, a decomposition per code point, a composition per
 * mark - an implementation actually pays for.
 */
export type RetentionClass =
  /** Every code point survives: the text is already a slug, and a fast path is written for it. */
  | 'all'
  /** More than half survives: ordinary prose, where the fold does most of its work. */
  | 'most'
  /** Less than half survives: punctuation-heavy text, where the boundary logic dominates. */
  | 'few'
  /** Nothing survives, and the answer is the empty slug. */
  | 'none'

export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must answer. A profile mixing classes measures neither. */
  readonly retention: RetentionClass
  readonly samples: readonly string[]
}

const repeated = (text: string, times: number): string => text.repeat(times)

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'already-a-slug',
    description:
      'The text is already a slug. The dominant shape wherever slugs are recomputed on read, and ' +
      'the one a fast path is written for: an implementation that compares the input against the ' +
      'alphabet first answers in linear time here and pays the whole fold everywhere else.',
    retention: 'all',
    samples: ['already-a-slug', 'creme-brulee', `${repeated('very-long-slug-', 60)}end`],
  },
  {
    name: 'ascii-prose',
    description:
      'Ordinary English words with spaces and a little punctuation - the common case, and the one ' +
      'where nothing needs folding at all. It is here so that a reader can see what the fold costs ' +
      'on text that does not need it, which is the price every caller pays.',
    retention: 'most',
    samples: [
      'Hello World',
      'The Quick Brown Fox Jumps Over the Lazy Dog',
      repeated('the quick brown fox jumps over the lazy dog ', 20),
    ],
  },
  {
    name: 'latin-diacritics',
    description:
      'Text where most letters carry a mark to fold, so the decomposition and the composition ' +
      'question are paid on nearly every code point. It is the worst case of the fold on text a ' +
      'European site actually stores.',
    retention: 'most',
    samples: ['Crème Brûlée à la Française', 'Tiếng Việt', repeated('Ćwikła Żółć Ąę ', 40)],
  },
  {
    name: 'other-writing-systems',
    description:
      'Japanese, Cyrillic, Arabic and Devanagari - the text this contract keeps and two of the four ' +
      'measured libraries answer the empty string for. Measured separately because the marks in ' +
      'the last two make the absorb question fire on every one of them and never drop anything.',
    retention: 'most',
    samples: ['日本語の「テキスト」', 'Привет мир', 'مرحبا بالعالم', 'हिन्दी में लिखा'],
  },
  {
    name: 'punctuation-heavy',
    description:
      'Text that is mostly boundaries: single letters between runs of symbols, one word inside an ' +
      'emoji run, and two hundred separators before a word. It is where the boundary logic ' +
      'dominates and where an implementation that allocates per discarded code point shows it.',
    retention: 'few',
    samples: ['!!! a ??? b @@@ c', '🎉🎉🎉 party 🎉🎉🎉', `${repeated('- ', 100)}end`],
  },
  {
    name: 'nothing-retainable',
    description:
      'Nothing survives, so the answer is the empty slug. It is the cheapest possible call that ' +
      'still reads all of its input, and callers filtering a list of user-supplied labels make it ' +
      'far more often than they expect to.',
    retention: 'none',
    samples: ['', '!!!', repeated('- ', 200)],
  },
]
