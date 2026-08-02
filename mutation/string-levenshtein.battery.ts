/**
 * The `string/levenshtein@1` battery.
 *
 * L-01 to L-20 are defects of behaviour and carry the mutation score. S-16 to S-19 are defects of the
 * declared type: they answer every call with the number the contract requires and are wrong only
 * about what they promise, so nothing outside block 4.2 can see them. F-7 and F-8 are probes rather
 * than defects - they ask which guard sees a defect that only appears past the size the properties
 * draw, and which guard kills a partial constant zero - so they are kept out of the score.
 *
 * The `S-` and `F-` families are numbered across the project rather than per contract, so this
 * contract continues at S-16 and F-7. The `L-` prefix is its own.
 *
 * There is one arm. The other two fallible contracts carry a second because the error convention was
 * under measurement there; this contract is total, publishes no reason, and has no convention to
 * compare.
 *
 * There are two lenses, and the second asks a question `array/group-by@1` opened and could not close.
 * `identity-blind` replaces `expectTypeOf(levenshtein).toEqualTypeOf<Levenshtein>()` with a check that
 * the export is a function at all. On that contract the identity assertion caught eight signature
 * defects the call-site inference checks caught too, and the interesting cases were the generic ones.
 * This signature is monomorphic, so the difference between the two columns is the whole answer to
 * whether a monomorphic identity assertion carries what the directives beside it carry.
 *
 * The battery is measured under `UTC` so that two runs on two machines are the same run. No verdict
 * here depends on the zone; this contract reads no clock.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: ['identity-blind'] }

const { sameOnEveryLens, perLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const SIGNATURE = `export const levenshtein = (a: string, b: string): number => {`

const DECOMPOSE = `  const left = [...a]
  const right = [...b]`

const COLUMN_ZERO = `    distance[i][0] = i`
const ROW_ZERO = `  for (let j = 0; j <= right.length; j += 1) distance[0][j] = j`

const SUBSTITUTION_COST = `(left[i - 1] === right[j - 1] ? 0 : 1)`
const SUBSTITUTION = `      const substitution = distance[i - 1][j - 1] + ${SUBSTITUTION_COST}`
const INSERTION = `      const insertion = distance[i][j - 1] + 1`
const CHOICE = `      distance[i][j] = Math.min(substitution, deletion, insertion)`

const ANSWER = `  return distance[left.length][right.length]`

// ---------------------------------------------------------------------------
// Guards the battery pins by name. `mutants.ts` states when a cell names all of
// its reds and when it names only the region the defect lives in.
// ---------------------------------------------------------------------------

const IDENTITY = 'P1 - identity: a string is at distance zero from itself'
const DISCERNIBILITY = 'P2 - discernibility: two different strings are at a distance of at least one'
const SYMMETRY = 'P3 - symmetry: the distance does not depend on which string comes first'
const TRIANGLE = 'P4 - the triangle inequality: no detour through a third string is shorter'
const BOUNDS = 'P5 - the distance sits between the difference of the lengths and the longer length'
const SHAPE = 'P6 - the answer is a whole number and never negative'
const ONE_EDIT = 'P7 - one edit apart is a distance of exactly one'
const AFFIXES = 'P8 - a shared prefix and a shared suffix cost nothing'

const DETERMINISTIC = 'is deterministic - the same call yields the same answer every time'
const CALL_HISTORY = 'has no ambient input - an answer does not depend on the calls made before it'

const TYPE_IDENTITY = 'matches the type declared by the contract'
const ACCEPTS_TWO_STRINGS = 'accepts two strings and nothing else'
const ALWAYS_A_NUMBER = 'always returns a number'
const REFUSES_ONE_STRING = 'refuses a call with one string'
const REFUSES_OPTIONS = 'refuses a call carrying options'

const ASTRAL_ALONE = 'an-astral-character-is-one-unit'
const ASTRAL_INSIDE = 'an-astral-character-inside-a-word'
const TWO_ASTRAL = 'two-astral-characters-and-one'
const A_GRAPHEME = 'a-grapheme-is-not-the-unit'
const NORMALISATION = 'normalisation-is-not-applied'
const A_COMBINING_MARK = 'a-combining-mark-is-one-unit'
const A_SPACE = 'a-space-is-a-code-point'
const A_TRANSPOSITION = 'a-transposition'
const ONE_SUBSTITUTION = 'one-substitution'
const THE_OTHER_SIDE_EMPTY = 'the-other-side-empty'
const BOTH_EMPTY = 'both-empty'
const IDENTICAL_TEXT = 'identical-text'

const SEPARATES_FROM_THE_ECOSYSTEM =
  'names exactly the cases that separate this contract from the ecosystem'

const IDENTICAL_PROFILE = 'identical - every sample is zero'
const ONE_EDIT_PROFILE = 'one-edit-apart - every sample is one-edit'

// ---------------------------------------------------------------------------
// L-01 to L-20 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  sameOnEveryLens(
    'L-01',
    'answers zero for every pair - the implementation that is free to be a metric. It satisfies ' +
      'identity, symmetry and the triangle inequality exactly, which is the whole reason this ' +
      'contract does not rest on the axioms alone, and it is the calibration mutant because an ' +
      'apparatus that cannot see it cannot see anything',
    [reference(ANSWER, `  return 0`)],
    killed([DISCERNIBILITY]),
  ),
  sameOnEveryLens(
    'L-02',
    'counts UTF-16 code units rather than code points - what `fastest-levenshtein` and `leven` do, ' +
      'measured by reading their source. Every axiom still holds: it is a metric, on a different ' +
      'alphabet. Only the region no axiom reaches can see it, which is exactly the region block 4.4 ' +
      'is small enough to still cover',
    [reference(DECOMPOSE, `  const left = a.split('')\n  const right = b.split('')`)],
    killed([ASTRAL_ALONE, ASTRAL_INSIDE, TWO_ASTRAL, A_GRAPHEME]),
  ),
  sameOnEveryLens(
    'L-03',
    'normalises both arguments to NFC before comparing - the helpfulness a reader proposes on ' +
      'reading that this contract compares text as written. It maps two different strings onto one, ' +
      'so it answers zero for a pair that is not a pair of identical strings, which is the ' +
      'discernibility axiom failing',
    [
      reference(
        DECOMPOSE,
        `  const left = [...a.normalize('NFC')]\n  const right = [...b.normalize('NFC')]`,
      ),
    ],
    killed([NORMALISATION, BOUNDS, ONE_EDIT, AFFIXES]),
  ),
  sameOnEveryLens(
    'L-04',
    'normalises one argument and not the other - the shape the brief for this contract named before ' +
      'it was written, and the one that shows why a unit has to be applied to both sides. The result ' +
      'is not a metric at all: it is asymmetric, and the same pair of strings measures differently ' +
      'depending on which one is given first',
    [reference(DECOMPOSE, `  const left = [...a]\n  const right = [...b.normalize('NFD')]`)],
    killed([IDENTITY, SYMMETRY, BOUNDS, ONE_EDIT, AFFIXES]),
  ),
  sameOnEveryLens(
    'L-05',
    'prices a substitution at zero whenever either side is a space - "ignore whitespace ' +
      'differences", written as an equality that is not transitive. A detour through a string of ' +
      'spaces is then shorter than the direct route: the triangle inequality is the only axiom that ' +
      'can see a comparison which is not an equivalence, and no named case compares three strings at ' +
      'once. It is also the mutant that found the starved support of that property: measured over ' +
      'two hundred runs of a thousand draws, it reddened P4 on 189 of them under independently drawn ' +
      'triples and on 200 under the blended mediator the property now draws. Three guards go red and ' +
      'only two are pinned: P2 reddens on 175 runs out of 200 - the pair it needs is two strings of ' +
      'one length whose every mismatch involves a space, which the arbitraries draw on 0.221% of ' +
      'pairs - so naming it would make this cell red on the seed rather than on the defect',
    [
      reference(
        SUBSTITUTION,
        `      const substitution =\n` +
          `        distance[i - 1][j - 1] +\n` +
          `        (left[i - 1] === right[j - 1] || left[i - 1] === ' ' || right[j - 1] === ' ' ? 0 : 1)`,
      ),
    ],
    killed([TRIANGLE, ONE_EDIT]),
  ),
  sameOnEveryLens(
    'L-06',
    'prices an insertion at two and a deletion at one. Every operation still costs something and ' +
      'the answer is still a whole number, so only the pair of guards that compare the two ' +
      'directions can see it',
    [reference(INSERTION, `      const insertion = distance[i][j - 1] + 2`)],
    killed([SYMMETRY]),
  ),
  sameOnEveryLens(
    'L-07',
    'prices a substitution at one half - the shape an implementation reaches when someone decides a ' +
      'replacement is "half an insertion plus half a deletion". The answer stops being a count',
    [reference(SUBSTITUTION_COST, `(left[i - 1] === right[j - 1] ? 0 : 0.5)`)],
    killed([SHAPE]),
  ),
  sameOnEveryLens(
    'L-08',
    'starts the insertion edge of the matrix one short, so turning the empty string into a string of ' +
      'n code points costs n - 1 and the empty pair costs minus one. It is the off-by-one an ' +
      'implementer makes on the boundary they wrote last, and the only mutant here that produces a ' +
      'negative distance',
    [reference(ROW_ZERO, `  for (let j = 0; j <= right.length; j += 1) distance[0][j] = j - 1`)],
    killed([SHAPE]),
  ),
  sameOnEveryLens(
    'L-09',
    'charges nothing for a substitution, ever - the longest common subsequence distance in reverse. ' +
      'Two strings of the same length are then always zero apart',
    [reference(SUBSTITUTION_COST, `0`)],
    killed([DISCERNIBILITY]),
  ),
  sameOnEveryLens(
    'L-10',
    'charges two for a substitution, which is the longest common subsequence distance: an ' +
      'implementation offering insertion and deletion only, and a real thing to have written before. ' +
      'Every axiom survives it - it is a metric, and a well known one - so the guards that see it are ' +
      'the ones about the size of an edit',
    [reference(SUBSTITUTION_COST, `(left[i - 1] === right[j - 1] ? 0 : 2)`)],
    killed([ONE_EDIT]),
  ),
  sameOnEveryLens(
    'L-11',
    'charges for a substitution even when the two code points are the same, so a string is not at ' +
      'distance zero from itself',
    [reference(SUBSTITUTION_COST, `1`)],
    killed([IDENTITY]),
  ),
  sameOnEveryLens(
    'L-12',
    'forgets that an insertion is a choice, so the matrix only ever deletes or substitutes',
    [reference(CHOICE, `      distance[i][j] = Math.min(substitution, deletion)`)],
    killed([SYMMETRY]),
  ),
  sameOnEveryLens(
    'L-13',
    'takes the most expensive of the three choices instead of the cheapest - the sign error at the ' +
      'heart of the recurrence',
    [reference(CHOICE, `      distance[i][j] = Math.max(substitution, deletion, insertion)`)],
    killed([BOUNDS]),
  ),
  sameOnEveryLens(
    'L-14',
    'compares the wrong pair of code points - `right[j]` where the recurrence needs `right[j - 1]`. ' +
      'It reads one past the end on the last column, where the comparison is against `undefined` and ' +
      'is therefore always unequal',
    [reference(SUBSTITUTION_COST, `(left[i - 1] === right[j] ? 0 : 1)`)],
    killed([IDENTITY]),
  ),
  sameOnEveryLens(
    'L-15',
    'reads the answer out of the transposed corner of the matrix. When the two strings have the same ' +
      'length it is the right cell and the defect is invisible; when they do not, the cell does not ' +
      'exist and the answer is NaN',
    [reference(ANSWER, `  return distance[right.length][left.length]`)],
    killed([SHAPE]),
  ),
  sameOnEveryLens(
    'L-16',
    'starts the deletion edge of the matrix at zero, so turning any string into the empty string is ' +
      'free. It is the mirror of L-08 on the other edge, and it is not an off-by-one: the whole ' +
      'column is wrong, which makes the function asymmetric rather than merely shifted',
    [reference(COLUMN_ZERO, `    distance[i][0] = 0`)],
    killed([SYMMETRY]),
  ),
  sameOnEveryLens(
    'L-17',
    'answers the difference of the lengths - the cheap approximation, and the one a caller who has ' +
      'not read the contract might accept. It satisfies the lower bound of P5 exactly, because it is ' +
      'that bound',
    [reference(ANSWER, `  return Math.abs(left.length - right.length)`)],
    killed([DISCERNIBILITY]),
  ),
  sameOnEveryLens(
    'L-18',
    'memoises into a bare object keyed by the two strings run together, so `levenshtein("ab", "c")` ' +
      'and `levenshtein("a", "bc")` are one entry - the classic defect of a key built by ' +
      'concatenation. It was written expecting a survivor and it is killed, which is the finding. ' +
      'The reasoning that expected a survivor was about the ambient-input property alone, and it ' +
      'holds: the probe fills the slot itself and a later colliding call reads rather than writes it, ' +
      'so that property is green here exactly as `number/parse@1` measured twice with P-02 and P-19. ' +
      'What kills it is that a collision inside one property run answers a *wrong number* for the ' +
      'second pair, and six of the eight guards in block 4.3 check the number rather than its ' +
      'stability. A cache survives a contract whose properties only compare answers with each other; ' +
      'it does not survive one that knows what the answer should be',
    [
      reference(SIGNATURE, `const CACHE: Record<string, number> = {}\n\n${SIGNATURE}`),
      reference(
        DECOMPOSE,
        `  const cached = CACHE[a + b]\n  if (cached !== undefined) return cached\n\n${DECOMPOSE}`,
      ),
      reference(ANSWER, `  CACHE[a + b] = distance[left.length][right.length]\n\n${ANSWER}`),
    ],
    killed([DISCERNIBILITY, ONE_EDIT]),
  ),
  sameOnEveryLens(
    'L-19',
    'counts the edits into an accumulator hoisted out of the function - the shape a variable reaches ' +
      'when it is made "reusable" and the `+=` survives the move. It is the only witness this ' +
      'contract has for determinism, and the entry in block 4.3 records why there is no narrower ' +
      'one: this function recomputes every cell of its table from two immutable primitives, so the ' +
      'only way to make two identical consecutive calls disagree is to leak state between them, and ' +
      'every other leak that is plausible here is a cache - which answers a repeated call from the ' +
      'slot the first call filled and is invisible to determinism by construction',
    [
      reference(SIGNATURE, `let edits = 0\n\n${SIGNATURE}`),
      reference(ANSWER, `  edits += distance[left.length][right.length]\n\n  return edits`),
    ],
    killed([DETERMINISTIC]),
  ),
  sameOnEveryLens(
    'L-20',
    'remembers the last answer and hands it back whenever the next pair has the same two lengths - ' +
      'the memoise-last idiom with a cheap proxy for identity, and the fourth contract it has been ' +
      'written on. The slot is written on a miss and read on a hit, so two identical consecutive ' +
      'calls agree and determinism cannot see it; a foreign call in between replaces it, which is ' +
      'the only thing the ambient-input property can see. Four guards are pinned and up to three ' +
      'more redden depending on the seed - measured over four runs - so the pin names the four that ' +
      'were red on all of them',
    [
      reference(
        SIGNATURE,
        `let lastAnswer: { readonly na: number; readonly nb: number; readonly distance: number } | null =\n` +
          `  null\n\n` +
          `export const levenshtein = (a: string, b: string): number => {\n` +
          `  if (lastAnswer !== null && lastAnswer.na === a.length && lastAnswer.nb === b.length) {\n` +
          `    return lastAnswer.distance\n` +
          `  }\n\n` +
          `  const computed = computeDistance(a, b)\n` +
          `  lastAnswer = { na: a.length, nb: b.length, distance: computed }\n\n` +
          `  return computed\n` +
          `}\n\n` +
          `const computeDistance = (a: string, b: string): number => {`,
      ),
    ],
    killed([A_COMBINING_MARK, SEPARATES_FROM_THE_ECOSYSTEM, SYMMETRY, CALL_HISTORY]),
  ),
]

// ---------------------------------------------------------------------------
// S-16 to S-19 - defects of the declared type
//
// Every one of them answers every call with exactly the number the contract
// requires, so the whole behavioural suite is blind to all four by construction
// and the only question is which type assertion notices.
// ---------------------------------------------------------------------------

const signatures: readonly Mutant[] = [
  perLens(
    'S-16',
    'widens both parameters to `string | number`, so a contract written to measure text starts ' +
      'accepting a value nobody has decided how to render. `String` is the identity on a string, so ' +
      'every call in the suite answers exactly as before. It is the mutant that makes the ' +
      '`levenshtein(1, 2)` directive stop being used, which is itself an error',
    [
      reference(
        SIGNATURE,
        `export const levenshtein = (a: string | number, b: string | number): number => {`,
      ),
      reference(DECOMPOSE, `  const left = [...String(a)]\n  const right = [...String(b)]`),
    ],
    {
      'as-committed': killed([TYPE_IDENTITY, ACCEPTS_TWO_STRINGS]),
      'identity-blind': killed([ACCEPTS_TWO_STRINGS]),
    },
  ),
  perLens(
    'S-17',
    'declares a return of `number | null` and never returns null. It is the shape a total function ' +
      'reaches when it is copied from a fallible one, and every caller then unwraps an absence that ' +
      'cannot happen - which is the cost this contract refuses in writing by having no diagnostic',
    [reference(SIGNATURE, `export const levenshtein = (a: string, b: string): number | null => {`)],
    {
      'as-committed': killed([TYPE_IDENTITY, ALWAYS_A_NUMBER]),
      'identity-blind': killed([ALWAYS_A_NUMBER]),
    },
  ),
  perLens(
    'S-18',
    'gives the second argument a default, so `levenshtein(text)` compiles and silently measures the ' +
      'text against nothing. The answer is unchanged on every call the suite makes, because every ' +
      'one of them passes two arguments; what is lost is the compile error a caller gets today',
    [reference(SIGNATURE, `export const levenshtein = (a: string, b: string = ''): number => {`)],
    {
      'as-committed': killed([TYPE_IDENTITY, ACCEPTS_TWO_STRINGS, REFUSES_ONE_STRING]),
      'identity-blind': killed([ACCEPTS_TWO_STRINGS, REFUSES_ONE_STRING]),
    },
  ),
  perLens(
    'S-19',
    'accepts a third argument and ignores it - the door an options object comes through. Nothing ' +
      'changes for any caller who does not pass one, and a caller who does is told nothing at all: ' +
      'their `{ caseSensitive: false }` is accepted and discarded',
    [
      reference(
        SIGNATURE,
        `export const levenshtein = (a: string, b: string, _options?: unknown): number => {`,
      ),
    ],
    {
      'as-committed': killed([TYPE_IDENTITY, REFUSES_OPTIONS]),
      'identity-blind': killed([REFUSES_OPTIONS]),
    },
  ),
]

// ---------------------------------------------------------------------------
// The probes
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-7',
    'answers the upper bound instead of the distance, and only past twelve code points - which is ' +
      'longer than anything block 4.4 carries and longer than any string the property arbitraries ' +
      'draw. It asks which guard is this contract\'s only sensor for a defect that appears at scale, ' +
      'and the answer is block 4.5: the class a profile claims about its samples is checked by ' +
      'running the reference over them, and two of those profiles carry a thousand code points',
    [
      reference(
        ANSWER,
        `  if (left.length > 12 || right.length > 12) return Math.max(left.length, right.length)\n\n${ANSWER}`,
      ),
    ],
    killed([IDENTICAL_PROFILE, ONE_EDIT_PROFILE, AFFIXES]),
  ),
  probe(
    UNDER,
    'F-8',
    'answers zero whenever the two strings have the same length, and correctly otherwise - a ' +
      'constant zero restricted to the region where it is hardest to notice. It asks what L-01 ' +
      'cannot: whether the guards that kill a total collapse also kill a partial one, or whether ' +
      'they only ever saw the pairs whose lengths differ',
    [
      reference(
        ANSWER,
        `  if (left.length === right.length) return 0\n\n${ANSWER}`,
      ),
    ],
    killed([DISCERNIBILITY]),
  ),
]

export const battery: Battery = {
  name: 'string-levenshtein',
  contractPath: 'contracts/string/levenshtein',
  timeZone: 'UTC',
  calibrationMutant: 'L-01',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'total - one export, no diagnostic, a number returned for every pair of strings',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
    {
      id: 'identity-blind',
      description:
        'the type test read as if it only checked that the export is a function, never that its ' +
        'whole type equals the contract\'s - so the column measures what the directives beside it ' +
        'catch on their own, on a monomorphic signature',
      arms: ['C'],
      edits: [
        {
          file: 'signature.test-d.ts',
          find: '    expectTypeOf(levenshtein).toEqualTypeOf<Levenshtein>()',
          replace: '    expectTypeOf(levenshtein).toBeFunction()',
        },
      ],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the table, the ' +
        'profile list, the axiom list, the universal-property declarations or the arbitraries.',
      titles: [
        'addresses each case with a unique identifier',
        'settles each pair exactly once',
        'publishes a rationale for every decision',
        'declares a non-empty sample set for every profile',
        'names every declared class at least once, and describes every profile',
        'keeps the inapplicable universal properties declared as such',
        'answers every declared metric axiom with a property, and declares every axiom it answers',
        'publishes a statement for every metric axiom',
        'draws pairs that really are one code point apart',
        'draws texts that reach every region the properties police',
      ],
    },
    {
      lenses: ['identity-blind'],
      reason:
        'the assertion this lens replaces. `identity-blind` reads ' +
        '`expectTypeOf(levenshtein).toEqualTypeOf<Levenshtein>()` as a check that the export is a ' +
        'function, so on that column the guard cannot fail whatever is injected - which is the point ' +
        'of the lens. On `as-committed` it is red on all four signature defects, and the difference ' +
        'between the two columns is the answer to the question `array/group-by@1` could only ask of a ' +
        'generic signature: on a monomorphic one, does the identity assertion carry anything the ' +
        'directives beside it do not?',
      titles: ['matches the type declared by the contract'],
    },
  ],

  unprobedRegions: [],

  mutants: [...behaviour, ...signatures, ...probes],
}
