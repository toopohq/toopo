/**
 * The `string/slugify@1` battery.
 *
 * G-01 to G-22 are defects of behaviour and carry the mutation score. S-20 to S-23 are defects of
 * the declared type: they answer every call with the string the contract requires and are wrong
 * only about what they promise. F-9, F-10 and F-11 are probes rather than defects - they ask
 * questions about the shape of the contract rather than about its correctness - so they are kept
 * out of the score.
 *
 * The `S-` and `F-` families are numbered across the project rather than per contract, so this
 * contract continues at S-20 and F-9. The `G-` prefix is its own.
 *
 * There is one arm. The two fallible contracts carry a second because the error convention was
 * under measurement there; this contract is total, publishes no reason, and has no convention to
 * compare.
 *
 * The second lens is what this battery was worth writing for, and what it measured is not what it
 * was written expecting. `table-blind` reads all forty-two guards of block 4.4 as though they only
 * compared an answer against itself, so the column is what this contract catches with its table
 * removed and nothing else changed. The expectation was that the table would carry the content,
 * because this contract has no axioms to rest on the way `string/levenshtein@1` does.
 *
 * Measured, over three complete runs: **twenty-one of the twenty-two behaviour defects die with the
 * table blinded.** The properties and the benchmark profiles catch them between them, and two
 * guards are load-bearing on that column - `P1` alone on G-03 and G-04, and the
 * `other-writing-systems` profile alone on G-05.
 *
 * The twenty-second is G-21, and it is the whole finding. It transliterates Cyrillic to Latin,
 * which is what three of the four measured libraries do and the single thing this contract exists
 * to refuse. It answers a well-formed, lower-case, idempotent slug that retains a subsequence and
 * carries no absorbable mark, so every property is satisfied by it, every profile keeps its class,
 * and every type assertion passes. On the committed column it is killed by exactly one guard in the
 * whole suite: `cyrillic-is-kept`.
 *
 * G-22 is the control that makes that result readable rather than anecdotal. It folds the sharp s
 * to a double s - the same kind of curation decision, from the same table the ecosystem writes - and
 * it dies on both columns, because the arbitrary that draws well-formed slugs carries a sharp s and
 * carries no Cyrillic. A property settles the content of a slug exactly as far as the alphabet of
 * its arbitrary reaches; what block 4.4 catches alone is what no arbitrary samples.
 *
 * The battery is measured under `UTC` so that two runs on two machines are the same run. No verdict
 * here depends on the zone; this contract reads no clock.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'S', asCommitted: 'as-committed', blinded: ['table-blind'] }

const { sameOnEveryLens, onlySeenUnblinded, perLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const KEPT = `const KEPT = /[\\p{L}\\p{M}\\p{Nd}]/u`

const BASE_OF = `const baseOf = (point: string): string => [...point.normalize('NFD')][0]`

const ABSORBS_TEST = '  [...`${base}${mark}`.normalize(\'NFC\')].length === 1'

const SIGNATURE = `export const slugify = (text: string): string => {`

const LOOP = `  for (const point of text.normalize('NFKC')) {`

const DISCARD = `    if (!KEPT.test(base)) {
      boundary = true
      runBase = null
      continue
    }`

const LOWERED = `    const lowered = base.toLowerCase()`

const MARK_BLOCK = `    if (MARK.test(lowered)) {
      if (runBase !== null && absorbs(runBase, lowered)) continue
    } else {
      runBase = lowered
    }`

const SEPARATOR = `    if (boundary && out.length > 0) out.push('-')`

const RESET = `    boundary = false

    out.push(lowered)`

const ANSWER = `  return out.join('')`

// ---------------------------------------------------------------------------
// Guards the battery pins by name. `mutants.ts` states when a cell names all of
// its reds and when it names only the region the defect lives in. Every pin
// below is the intersection of three complete runs.
// ---------------------------------------------------------------------------

const SPELLINGS = 'p1-two-spellings-one-slug'
const IDEMPOTENCE = 'p2-idempotence'
const NO_COMPOSING_MARK = 'p3-no-absorbable-mark'
const ALPHABET = 'p4-the-declared-alphabet'
const DISCARDED_SWAP = 'p5-discarded-characters-are-interchangeable'
const NON_EMPTY = 'p6-a-letter-or-a-digit-answers'
const FIXED_POINT = 'p7-a-slug-is-a-fixed-point'
const SEPARATOR_COUNT = 'p8-one-separator-per-gap'

const DETERMINISTIC = 'determinism'
const CALL_HISTORY = 'no-ambient-input-from-history'

const TYPE_IDENTITY = 'signature-is-the-declared-type'
const ACCEPTS_ONE_STRING = 'signature-accepts-one-string'
const ALWAYS_A_STRING = 'signature-returns-a-string'
const REFUSES_NO_ARGUMENT = 'signature-refuses-no-argument'
const REFUSES_OPTIONS = 'signature-refuses-options'

const CYRILLIC_IS_KEPT = 'cyrillic-is-kept'
const AN_ASTRAL_LETTER = 'an-astral-letter-is-kept'
const AN_INDIC_MARK = 'an-indic-mark-is-kept'
const A_FULLWIDTH_LETTER = 'a-fullwidth-letter-is-unified'
const A_MARK_ABSORBED = 'a-mark-the-base-absorbs-is-dropped'
const A_MARK_ACROSS = 'a-mark-reaching-its-base-across-another'
const A_MARK_KEPT = 'a-mark-with-no-base-to-absorb-it-is-kept'
const AN_UNDERSCORE = 'an-underscore-is-a-boundary'
const A_FINAL_SIGMA = 'a-final-sigma-is-not-unified'
const A_DOTTED_I = 'the-turkish-dotted-i-loses-its-dot'
const A_NON_LATIN_DIGIT = 'a-non-latin-digit-is-a-digit'
const A_SHARP_S = 'a-letter-with-no-decomposition-is-kept'

const ASCII_DIVERGENCE = 'the-cases-an-ascii-alphabet-answers-differently'

const PROFILE_ALREADY_A_SLUG = 'profile-already-a-slug'
const PROFILE_ASCII_PROSE = 'profile-ascii-prose'
const PROFILE_LATIN = 'profile-latin-diacritics'
const PROFILE_OTHER_WRITING = 'profile-other-writing-systems'
const PROFILE_PUNCTUATION = 'profile-punctuation-heavy'
const PROFILE_NOTHING = 'profile-nothing-retainable'

// ---------------------------------------------------------------------------
// G-01 to G-22 - defects of behaviour
//
// Every one of them is pinned per lens, because the difference between the two
// columns is the measurement this battery exists to take.
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  perLens(
    'G-01',
    'answers the empty slug for everything - the implementation that is free to satisfy every ' +
      'safety property this contract can state. It is closed under the alphabet, it is a fixed ' +
      'point, it carries no leading or doubled separator, and no mark in it composes onto ' +
      'anything. It is the calibration mutant because an apparatus that cannot see it cannot see ' +
      'anything, and the question it exists to answer is which guard kills it: measured, the two ' +
      'liveness properties do, on both columns, and every one of the forty-two guards of block 4.4 ' +
      'does as well',
    [reference(ANSWER, `  return ''`)],
    {
      'as-committed': killed([NON_EMPTY, FIXED_POINT]),
      'table-blind': killed([NON_EMPTY, FIXED_POINT]),
    },
  ),
  perLens(
    'G-02',
    'walks UTF-16 code units rather than code points, which is what a loop written with an index ' +
      'and `length` does. Emoji cannot see it - both conventions discard them - so the only inputs ' +
      'that can are letters outside the basic plane, and the contract carries exactly one row and ' +
      'one alphabet symbol for that reason. The alphabet symbol is why the blinded column still ' +
      'catches it',
    [reference(LOOP, `  for (const point of text.normalize('NFKC').split('')) {`)],
    {
      'as-committed': killed([AN_ASTRAL_LETTER, NON_EMPTY, FIXED_POINT]),
      'table-blind': killed([NON_EMPTY, FIXED_POINT]),
    },
  ),
  perLens(
    'G-03',
    'normalises to NFD rather than NFKC, so canonical equivalence is handled and compatibility is ' +
      'not. Fullwidth letters, typographic ligatures, superscript digits and Roman numerals all ' +
      'stop being unified with their ordinary spellings, and the same text typed on two keyboards ' +
      'gets two identifiers. P1 is alone on it once the table is blinded, which is what the table ' +
      'of equivalent spellings inside that property is for',
    [reference(LOOP, `  for (const point of text.normalize('NFD')) {`)],
    {
      'as-committed': killed([SPELLINGS, A_FULLWIDTH_LETTER]),
      'table-blind': killed([SPELLINGS]),
    },
  ),
  perLens(
    'G-04',
    'normalises nothing at all. It is the shape an implementation reaches when the fold is written ' +
      'first and the normalisation is meant to be added later',
    [reference(LOOP, `  for (const point of text) {`)],
    {
      'as-committed': killed([SPELLINGS, A_FULLWIDTH_LETTER]),
      'table-blind': killed([SPELLINGS]),
    },
  ),
  perLens(
    'G-05',
    'drops every combining mark instead of only the ones a base absorbs - "strip the diacritics", ' +
      'written as though every script used marks the way Latin does. Devanagari loses its vowel ' +
      'signs and its virama, Arabic loses its harakat, and the answer is a consonant skeleton that ' +
      'is not a word. With the table blinded the only thing left that sees it is a benchmark ' +
      'profile, because block 4.5 is where this contract keeps text in the scripts the fold must ' +
      'not touch',
    [reference(MARK_BLOCK, `    if (MARK.test(lowered)) continue\n\n    runBase = lowered`)],
    {
      'as-committed': killed([AN_INDIC_MARK, A_MARK_ACROSS, A_MARK_KEPT, PROFILE_OTHER_WRITING]),
      'table-blind': killed([PROFILE_OTHER_WRITING]),
    },
  ),
  perLens(
    'G-06',
    'keeps every mark that normalisation did not already compose away - the first formulation this ' +
      'contract was written with, and it is wrong. A mark left beside a bare base is composed onto ' +
      'it by the next call and dropped there, so the function is not idempotent: measured on ' +
      'thirty words out of four thousand before the rule was corrected. The case ' +
      '`a-mark-the-base-absorbs-is-dropped` claims to kill this mutant',
    [reference(MARK_BLOCK, `    if (!MARK.test(lowered)) {\n      runBase = lowered\n    }`)],
    {
      'as-committed': killed([
        A_MARK_ABSORBED,
        A_MARK_ACROSS,
        SPELLINGS,
        IDEMPOTENCE,
        NO_COMPOSING_MARK,
      ]),
      'table-blind': killed([SPELLINGS, IDEMPOTENCE, NO_COMPOSING_MARK]),
    },
  ),
  perLens(
    'G-07',
    'asks whether the code point to the left absorbs the mark rather than whether the base of the ' +
      'run does - the second formulation, and it is wrong one layer deeper. Unicode lets a mark of ' +
      'high combining class compose onto the starter across a mark of lower class, so an acute ' +
      'sitting behind an Arabic fatha still reaches the `e` in front of it. The case ' +
      '`a-mark-reaching-its-base-across-another` claims to kill this mutant, and it is the reason ' +
      'that row exists. It is also the mutant that found the starved support of P2 and P3: under ' +
      'independently drawn text they were red on one column and green on the other in a single ' +
      'run, and both now draw from a generator that stacks marks on a base',
    [
      reference(
        MARK_BLOCK,
        `    if (MARK.test(lowered) && runBase !== null && absorbs(runBase, lowered)) continue\n\n` +
          `    runBase = lowered`,
      ),
    ],
    {
      // P1 reddens here on most runs and not all - it needs a draw where a rich spelling meets a
      // stacked mark - so it is left out rather than making this cell red on the seed.
      'as-committed': killed([A_MARK_ACROSS, IDEMPOTENCE, NO_COMPOSING_MARK]),
      'table-blind': killed([IDEMPOTENCE, NO_COMPOSING_MARK]),
    },
  ),
  perLens(
    'G-08',
    'emits a separator for a boundary that precedes the first run, so a slug can begin with one. ' +
      'It is the off-by-one of the shape rule, and it is what `github-slugger` does on purpose - ' +
      'measured, three leading spaces become three leading hyphens there',
    [reference(SEPARATOR, `    if (boundary) out.push('-')`)],
    {
      'as-committed': killed([ALPHABET, SEPARATOR_COUNT]),
      'table-blind': killed([ALPHABET, SEPARATOR_COUNT]),
    },
  ),
  perLens(
    'G-09',
    'emits one separator per discarded code point rather than one per gap, so a run of spaces ' +
      'becomes a run of hyphens. Every survivor is still in the right order and still lower case, ' +
      'so only the guards about the shape of the answer can see it',
    [
      reference(
        DISCARD,
        `    if (!KEPT.test(base)) {\n      out.push('-')\n      runBase = null\n      continue\n    }`,
      ),
    ],
    {
      'as-committed': killed([ALPHABET, SEPARATOR_COUNT]),
      'table-blind': killed([PROFILE_NOTHING, ALPHABET, SEPARATOR_COUNT]),
    },
  ),
  perLens(
    'G-10',
    'lets the underscore through the alphabet - the single most common request a slugifier gets, ' +
      'and the one that quietly widens what a caller has to escape downstream. Two of the four ' +
      'measured libraries keep it',
    [reference(KEPT, `const KEPT = /[\\p{L}\\p{M}\\p{Nd}_]/u`)],
    {
      'as-committed': killed([AN_UNDERSCORE, ALPHABET, DISCARDED_SWAP]),
      'table-blind': killed([ALPHABET, DISCARDED_SWAP]),
    },
  ),
  perLens(
    'G-11',
    'does not lower-case, so the answer carries whatever case the caller wrote. It is the default ' +
      'behaviour of `slugify` at its published defaults - measured - and the output is not safe in ' +
      'a URL that is compared case-sensitively. P4 only catches it because the alphabet check reads ' +
      'both halves of what block 4.2 declares an alphabet to be; against the pattern alone it went ' +
      'green, because an upper-case letter is a letter',
    [reference(LOWERED, `    const lowered = base`)],
    {
      'as-committed': killed([ALPHABET]),
      'table-blind': killed([SPELLINGS, ALPHABET]),
    },
  ),
  perLens(
    'G-12',
    'lower-cases the whole text in one call before folding, rather than each base on its own. It ' +
      'is the obvious way to write the step and it makes the answer depend on characters the ' +
      'function discards: JavaScript reads what follows a Greek sigma to decide whether it is ' +
      'final, and a discarded full stop is not a cased letter while a discarded zero-width joiner ' +
      'is case-ignorable. P5 is what states that dependency as a property, and it is red here on ' +
      'both columns',
    [
      reference(LOOP, `  for (const point of text.normalize('NFKC').toLowerCase()) {`),
      reference(LOWERED, `    const lowered = base`),
    ],
    {
      'as-committed': killed([A_FINAL_SIGMA, A_DOTTED_I, ASCII_DIVERGENCE, SPELLINGS, DISCARDED_SWAP]),
      'table-blind': killed([SPELLINGS, DISCARDED_SWAP]),
    },
  ),
  perLens(
    'G-13',
    'does not keep decimal digits, so a version number, a year and a house number all vanish. The ' +
      'answer is still a well-formed slug of the remaining letters, which is why the shape ' +
      'properties are blind to it and the two liveness ones are not',
    [reference(KEPT, `const KEPT = /[\\p{L}\\p{M}]/u`)],
    {
      'as-committed': killed([A_NON_LATIN_DIGIT, NON_EMPTY, FIXED_POINT]),
      'table-blind': killed([NON_EMPTY, FIXED_POINT]),
    },
  ),
  perLens(
    'G-14',
    'does not keep marks at all, so they become boundaries rather than being removed: Devanagari ' +
      'is split into single consonants joined by hyphens. It is the mirror of G-05 - that one ' +
      'deletes the marks silently, this one splits the word at each of them - and the pair is here ' +
      'because a contract that caught one and not the other would be catching a symptom',
    [reference(KEPT, `const KEPT = /[\\p{L}\\p{Nd}]/u`)],
    {
      'as-committed': killed([
        AN_INDIC_MARK,
        A_MARK_ACROSS,
        A_MARK_KEPT,
        PROFILE_OTHER_WRITING,
        SPELLINGS,
      ]),
      // Same as G-07: P1 is red on most runs and not all, so the profile carries this cell.
      'table-blind': killed([PROFILE_OTHER_WRITING]),
    },
  ),
  perLens(
    'G-15',
    'takes the last code point of a canonical decomposition instead of the first, so a letter ' +
      'carrying a mark folds to the mark. It is the index error of the fold, and the answer stops ' +
      'being letters at all',
    [
      reference(
        BASE_OF,
        `const baseOf = (point: string): string => [...point.normalize('NFD')].at(-1) ?? point`,
      ),
    ],
    {
      'as-committed': killed([SPELLINGS, IDEMPOTENCE]),
      'table-blind': killed([SPELLINGS, IDEMPOTENCE]),
    },
  ),
  perLens(
    'G-16',
    'inverts the absorb test, so a mark is dropped exactly when its base cannot carry it and kept ' +
      'exactly when it can. Latin diacritics survive and Indic vowel signs disappear - the rule ' +
      'read backwards, which is the shape a negation reaches when it is moved during a refactor',
    [reference(ABSORBS_TEST, '  [...`${base}${mark}`.normalize(\'NFC\')].length !== 1')],
    {
      'as-committed': killed([AN_INDIC_MARK, IDEMPOTENCE, NO_COMPOSING_MARK]),
      'table-blind': killed([
        PROFILE_OTHER_WRITING,
        SPELLINGS,
        IDEMPOTENCE,
        NO_COMPOSING_MARK,
      ]),
    },
  ),
  perLens(
    'G-17',
    'joins the runs with an underscore rather than a hyphen. Every other step is untouched, so the ' +
      'answer is the right sequence of the right letters with the wrong thing between them - and ' +
      'the alphabet is what says so',
    [reference(SEPARATOR, `    if (boundary && out.length > 0) out.push('_')`)],
    {
      'as-committed': killed([ALPHABET, FIXED_POINT]),
      'table-blind': killed([PROFILE_ALREADY_A_SLUG, ALPHABET, FIXED_POINT]),
    },
  ),
  perLens(
    'G-18',
    'never lowers the boundary flag once it has been raised, so every survivor after the first ' +
      'discarded code point gets a separator in front of it and `hello world` becomes ' +
      '`hello-w-o-r-l-d`. It is the one shape defect the separator count cannot see - the answer ' +
      'has n runs and n - 1 separators, all of them exactly where a separator is allowed to be - ' +
      'so what catches it is knowing what the answer should have been',
    [reference(RESET, `    out.push(lowered)`)],
    {
      'as-committed': killed([FIXED_POINT]),
      'table-blind': killed([PROFILE_ALREADY_A_SLUG, FIXED_POINT]),
    },
  ),
  perLens(
    'G-19',
    'accumulates into an array hoisted out of the function - the shape a variable reaches when it ' +
      'is made "reusable" and the declaration survives the move. The first call answers the slug ' +
      'and the second answers every slug so far. It is the only witness this contract has for ' +
      'determinism, and the entry in block 4.3 records why there is no narrower one: every other ' +
      'leak plausible on a function of this shape is a cache, which answers a repeated call from ' +
      'the slot the first call filled and is invisible to determinism by construction',
    [
      reference(SIGNATURE, `const out: string[] = []\n\n${SIGNATURE}`),
      reference(`  const out: string[] = []\n\n`, ``),
    ],
    {
      'as-committed': killed([DETERMINISTIC]),
      'table-blind': killed([DETERMINISTIC]),
    },
  ),
  perLens(
    'G-20',
    'remembers the last answer and hands it back whenever the next text has the same length - the ' +
      'memoise-last idiom with a cheap proxy for identity, and the fifth contract it has been ' +
      'written on. The slot is written on a miss and read on a hit, so two identical consecutive ' +
      'calls agree and determinism cannot see it; a foreign call in between replaces it, which is ' +
      'the only thing the ambient-input property can see',
    [
      reference(
        SIGNATURE,
        `let lastAnswer: { readonly length: number; readonly slug: string } | null = null\n\n` +
          `export const slugify = (text: string): string => {\n` +
          `  if (lastAnswer !== null && lastAnswer.length === text.length) return lastAnswer.slug\n\n` +
          `  const computed = computeSlug(text)\n` +
          `  lastAnswer = { length: text.length, slug: computed }\n\n` +
          `  return computed\n` +
          `}\n\n` +
          `const computeSlug = (text: string): string => {`,
      ),
    ],
    {
      'as-committed': killed([CALL_HISTORY]),
      'table-blind': killed([SPELLINGS, DISCARDED_SWAP, FIXED_POINT, CALL_HISTORY]),
    },
  ),
  onlySeenUnblinded(
    'G-21',
    'transliterates Cyrillic to Latin, which is what three of the four measured libraries do and ' +
      'the single thing this contract exists to refuse. It is the only defect in this battery that ' +
      'the properties do not catch, and the reason is that it is not a broken fold: it answers a ' +
      'well-formed, lower-case, idempotent slug that retains a subsequence and carries no ' +
      'absorbable mark, so every property is satisfied, every profile keeps its class and every ' +
      'type assertion passes. One guard in the whole suite kills it, and it is a named case of ' +
      'block 4.4 - which is the measurement this lens exists to take, and the answer to what a ' +
      'table buys a contract that has no axioms to rest on',
    [
      reference(
        LOWERED,
        `    const CYRILLIC = 'абвгдежзийклмнопрстуфхцчшщыэюя'\n` +
          `    const LATIN = 'abvgdezziyklmnoprstufhccssyeua'\n` +
          `    const at = CYRILLIC.indexOf(base.toLowerCase())\n` +
          `    const lowered = at === -1 ? base.toLowerCase() : LATIN[at]`,
      ),
    ],
    [CYRILLIC_IS_KEPT],
  ),
  perLens(
    'G-22',
    'folds the sharp s to a double s, which is what three of the five measured columns answer for ' +
      '`Straße`. It is the same kind of decision as G-21, from the same table the ecosystem ' +
      'writes, and it dies on both columns - which is what makes G-21 a measurement rather than an ' +
      'anecdote. What separates them is not the decision, it is the arbitrary: the generator that ' +
      'draws well-formed slugs carries a sharp s and carries no Cyrillic, so one of the two ' +
      'curation decisions is reachable by a property and the other is not. P7 is what carries this ' +
      'cell. P2 and P3 are red on it too and neither is pinned: breaking the fixed point this way ' +
      'needs a sharp s immediately followed by a mark its base would absorb, and the stacked ' +
      'generator built for those two properties carries no sharp s among its bases at all, so the ' +
      'shape only arrives when `anyText` draws the two adjacent out of thirty symbols - measured ' +
      'red on eight runs out of nine, and seven out of nine for P3 on the blinded column. That is a ' +
      'gap in the generator rather than in the properties, and it is recorded here rather than ' +
      'closed, because widening a support that no defect needs buys nothing this battery can show',
    [reference(LOWERED, `    const lowered = base.toLowerCase() === 'ß' ? 'ss' : base.toLowerCase()`)],
    {
      'as-committed': killed([A_SHARP_S, FIXED_POINT]),
      'table-blind': killed([FIXED_POINT]),
    },
  ),
]

// ---------------------------------------------------------------------------
// S-20 to S-23 - defects of the declared type
//
// Every one of them answers every call with exactly the string the contract
// requires, so the whole behavioural suite is blind to all four by construction.
// Both columns name the same guards, measured, which is the expected result and
// is recorded rather than assumed: blinding block 4.4 cannot change what a type
// assertion sees.
// ---------------------------------------------------------------------------

const signatures: readonly Mutant[] = [
  sameOnEveryLens(
    'S-20',
    'widens the parameter to `string | number`, so a contract written for text starts accepting a ' +
      'value nobody has decided how to render - a number formatted by `String` carries no locale ' +
      'and no precision. `String` is the identity on a string, so every call in the suite answers ' +
      'exactly as before',
    [
      reference(SIGNATURE, `export const slugify = (text: string | number): string => {`),
      reference(LOOP, `  for (const point of String(text).normalize('NFKC')) {`),
    ],
    killed([TYPE_IDENTITY, ACCEPTS_ONE_STRING]),
  ),
  sameOnEveryLens(
    'S-21',
    'declares a return of `string | null` and never returns null. It is the shape a total function ' +
      'reaches when it is copied from a fallible one, and every caller then unwraps an absence ' +
      'that cannot happen - which is exactly the cost this contract refuses in writing by treating ' +
      'the empty slug as an answer',
    [reference(SIGNATURE, `export const slugify = (text: string): string | null => {`)],
    killed([TYPE_IDENTITY, ALWAYS_A_STRING]),
  ),
  sameOnEveryLens(
    'S-22',
    'gives the parameter a default, so `slugify()` compiles and silently answers the empty slug. ' +
      'The answer is unchanged on every call the suite makes, because every one of them passes an ' +
      'argument; what is lost is the compile error a caller gets today',
    [reference(SIGNATURE, `export const slugify = (text: string = ''): string => {`)],
    killed([TYPE_IDENTITY, ACCEPTS_ONE_STRING, REFUSES_NO_ARGUMENT]),
  ),
  sameOnEveryLens(
    'S-23',
    'accepts a second argument and ignores it - the door an options object comes through. Nothing ' +
      'changes for a caller who does not pass one, and a caller who does is told nothing at all: ' +
      'their `{ separator: "_" }` is accepted and discarded, which is worse than a compile error ' +
      'and worse than honouring it',
    [
      reference(
        SIGNATURE,
        `export const slugify = (text: string, _options?: unknown): string => {`,
      ),
    ],
    killed([TYPE_IDENTITY, REFUSES_OPTIONS]),
  ),
]

// ---------------------------------------------------------------------------
// The probes
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-9',
    'never resets the base of the run at a boundary, so a mark that opens a run is absorbed by a ' +
      'letter from the previous one. It asks whether anything in this contract knows that a ' +
      'boundary ends a run for the purposes of the absorb step, and the answer is no: nothing ' +
      'reddens on either column. The region is reachable - a text of the shape `e!` followed by a ' +
      'combining acute answers differently under it - and neither the table nor any arbitrary ' +
      'draws that shape. What is missing is a case, and it is recorded here rather than added, ' +
      'because a probe that turns into a case stops measuring what the contract was',
    [
      reference(
        DISCARD,
        `    if (!KEPT.test(base)) {\n      boundary = true\n      continue\n    }`,
      ),
    ],
    survived,
  ),
  probe(
    UNDER,
    'F-11',
    'trims the text before folding - the shape an implementation reaches when a leading separator ' +
      'was once a defect and `trim` was the fix that stayed. It survives, and that is the finding ' +
      'rather than a gap: every character `trim` removes is already a boundary, and a boundary ' +
      'before the first run or after the last one already produces nothing, so the edit cannot ' +
      'change an answer. It is a probe rather than a defect because an equivalent mutant that ' +
      'counted against the score would measure the question instead of the contract',
    [reference(LOOP, `  for (const point of text.trim().normalize('NFKC')) {`)],
    survived,
  ),
  probe(
    UNDER,
    'F-10',
    'answers the empty slug only past sixteen code points, and correctly otherwise - a constant ' +
      'collapse restricted to the region where it is hardest to notice. It asks what G-01 cannot: ' +
      'whether the guards that kill a total collapse also kill one that only appears past the ' +
      'length the property arbitraries draw. The answer is block 4.5, whose profiles carry samples ' +
      'of several hundred code points, and P7, whose slugs are shorter than sixteen and which sees ' +
      'it only through the profiles it shares a file with',
    [reference(ANSWER, `  if ([...text].length > 16) return ''\n\n${ANSWER}`)],
    killed([
      PROFILE_ALREADY_A_SLUG,
      PROFILE_ASCII_PROSE,
      PROFILE_LATIN,
      PROFILE_PUNCTUATION,
      FIXED_POINT,
    ]),
  ),
]

export const battery: Battery = {
  name: 'string-slugify',
  contractPath: 'contracts/string/slugify',
  timeZone: 'UTC',
  calibrationMutant: 'G-01',

  arms: [
    {
      id: 'S',
      ref: 'HEAD',
      convention: 'total - one export, no diagnostic, a string returned for every string',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['S'],
      edits: [],
    },
    {
      id: 'table-blind',
      description:
        'every guard of block 4.4 read as a comparison of the answer against itself, so the column ' +
        'measures what this contract catches with its table removed and nothing else changed. It ' +
        'is the format question of the fifth contract: with no axioms to rest on, how much of the ' +
        'content of a slug can a property settle?',
      arms: ['S'],
      edits: [
        {
          file: 'edge-cases.test.ts',
          find:
            '      expect(\n' +
            '        outputsAreEqual(actual, expected),\n' +
            '        `"${printable(text)}": expected "${printable(expected)}", received "${printable(actual)}"`,\n' +
            '      ).toBe(true)',
          replace:
            '      expect(\n' +
            '        outputsAreEqual(actual, actual),\n' +
            '        `"${printable(text)}": expected "${printable(expected)}", received "${printable(actual)}"`,\n' +
            '      ).toBe(true)',
        },
        {
          // Blinding the forty-one case guards is not enough on its own, and the first run of this
          // battery measured why: the guard that replays the ASCII divergence also compares an
          // answer against the table's own expectations, and it caught fourteen mutants on a column
          // that was supposed to be blind to every one of them. A lens that leaves one eye open
          // reports the detection a blinding removes as detection the properties had.
          file: 'edge-cases.test.ts',
          find: '    expect(differing).toEqual([...DIVERGING_UNDER_AN_ASCII_ALPHABET])',
          replace: '    expect(differing).toEqual(differing)',
        },
      ],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the table, ' +
        'the profile list, the rule, the universal-property declarations or the arbitraries.',
      guards: [
        'every-case-is-addressed',
        'every-case-is-grouped',
        'settles-each-text-once',
        'every-case-is-justified',
        'every-profile-has-samples',
        'every-class-is-named-and-described',
        'universal-properties-answered',
        'declares-a-property-for-every-step',
        'declares-a-statement-for-every-step',
        'support-the-slugs-are-well-formed',
        'support-the-stacks-reach-the-hidden-base',
        'support-the-gaps-carry-a-sigma',
        'support-the-texts-reach-every-region',
        // Measured on the first run of this battery: this guard groups the table by its declared
        // answers and never calls the function, so no defect injected into `reference.ts` can
        // reach it. The collision it publishes is a fact about two rows of block 4.4, not about
        // any implementation.
        'the-texts-that-share-one-slug',
      ],
    },
    {
      lenses: ['table-blind'],
      reason:
        'the assertions this lens replaces. `table-blind` reads every case guard of block 4.4 as a ' +
        'comparison of the answer against itself, so on that column not one of them can fail ' +
        'whatever is injected - which is the point of the lens. The guard that replays the ASCII ' +
        'divergence is blinded by the same lens and is not listed here, because it still reddens on ' +
        'G-19: that mutant makes every call return the whole history of the run, and the guard dies ' +
        'of a string too long to build rather than of an expectation. A blinding removes a ' +
        'verdict, not an execution.',
      guards: [
        'a-non-latin-script-is-kept',
        'cyrillic-is-kept',
        'arabic-is-kept',
        'an-indic-mark-is-kept',
        'a-non-latin-digit-is-a-digit',
        'an-astral-letter-is-kept',
        'a-latin-diacritic-is-removed',
        'a-decomposed-diacritic-folds-alike',
        'a-precomposed-diacritic-folds-alike',
        'two-stacked-marks-are-removed',
        'a-letter-with-no-decomposition-is-kept',
        'a-ligature-letter-is-kept',
        'a-stroked-letter-is-kept',
        'a-mark-the-base-absorbs-is-dropped',
        'a-mark-reaching-its-base-across-another',
        'a-mark-with-no-base-to-absorb-it-is-kept',
        'a-greek-tonos-is-removed',
        'a-final-sigma-is-not-unified',
        'a-written-final-sigma-is-kept',
        'the-turkish-dotted-i-loses-its-dot',
        'the-turkish-dotless-i-is-kept',
        'a-fullwidth-letter-is-unified',
        'a-typographic-ligature-is-unified',
        'a-superscript-digit-is-a-digit',
        'a-roman-numeral-is-letters',
        'runs-of-spaces-become-one-separator',
        'an-existing-slug-is-unchanged',
        'a-doubled-separator-collapses',
        'an-underscore-is-a-boundary',
        'a-full-stop-is-a-boundary',
        'an-apostrophe-is-a-boundary',
        'an-ampersand-is-not-a-word',
        'a-currency-sign-is-not-a-word',
        'the-empty-string',
        'nothing-retainable',
        'an-emoji-is-removed',
        'a-joined-emoji-sequence-is-removed',
        'a-lone-surrogate-is-removed',
        'a-lone-surrogate-inside-a-word',
        'a-plus-is-not-a-letter',
        'a-hash-is-not-a-letter',
      ],
    },
  ],

  unprobedRegions: [],

  mutants: [...behaviour, ...signatures, ...probes],
}
