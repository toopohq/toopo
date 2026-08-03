/**
 * The `array/group-by@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks whether it
 * catches a broken *specification*. Why it is a second battery rather than a second arm or lens, and
 * the two limits measured while writing the first one, are stated in `number-parse-spec.battery.ts`
 * and are not repeated here.
 *
 * This contract is where the second of those limits did not bite, and that contrast is what settled
 * the catalogue's case identifier. Its cases carried an explicit name from the start, so a mutant
 * that rewrites an expectation reddens the guard it was written for - where the same family of mutant
 * on the other two reddened a title that did not exist before it. AG-8 and AG-9 were pinned on real,
 * calibrated guards while NP-6 and DA-7 could not be; every case of every contract now carries an
 * `id`, and they are.
 *
 * AG-8 and AG-9 also reach `language.test.ts`, which the reference battery declares out of its reach
 * by construction: it runs block 4.4 against `Map.groupBy`, so no defect injected into
 * `reference.ts` can touch it. It reads the table, so a defect injected into the table does - and a
 * wrong expectation reddens the contract's own case and its language twin together, which is the
 * measurement that `language.test.ts` really replays this table rather than restating it. Two of the
 * thirty are probed and the other twenty-eight are declared, because thirty mutants would say one
 * sentence thirty times.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, killedByTypecheck, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const NO_AMBIENT_OUTPUT = `    name: 'no ambient output',
    applicable: false,`

const EXCEPTION_RULE_KIND = `    kind: 'obligation',
    name: 'an exception propagates unchanged',`

const INDEX_ORDER_RULE = `    kind: 'obligation',
    name: 'in ascending index order',
    statement:
      'Calls happen in index order, from 0 upwards. Observable through a key function that records ' +
      'what it was asked, and it is what makes first-occurrence group order meaningful: an ' +
      'implementation that visited the array backwards would produce the reverse group order while ' +
      'satisfying every other statement here.',`

const STRING_KEYS_DESCRIPTION = `    description:
      'The same few-large-groups shape with keys that are strings rather than numbers, because a ' +
      'Map hashes the two differently and an object would not have the choice.',`

const MANY_SMALL_SAMPLES = `    samples: [range(60), range(3_000)],`

const SINGLE_ELEMENT_RATIONALE = `    rationale: 'One group of one. Listed because it is the input a fast path is written for.',`

const SINGLE_ELEMENT_ID = `    id: 'a-single-element',`

const PARITY_CASE = `    id: 'numbers-by-parity',
    items: [1, 2, 3, 4, 5],
    keyOf: parityKey,
    outcome: { kind: 'groups', groups: [['odd', [1, 3, 5]], ['even', [2, 4]]] },
    provenance: 'specified',`

const INTEGER_LIKE_OUTCOME = `    outcome: {
      kind: 'groups',
      groups: [['10', ['10']], ['2', ['2']], ['1', ['1']], ['b', ['b']], ['a', ['a']]],
    },`

const INDEX_CALLS = `    expectedCalls: [['a', 0], ['b', 1], ['c', 2]],`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_ID_UNIQUE = 'every-case-is-addressed'
const EVERY_CASE_JUSTIFIED = 'every-case-is-justified'
const EVERY_PROFILE_POPULATED = 'every-profile-has-samples'
const EVERY_SHAPE_AND_DESCRIPTION =
  'every-shape-is-named-and-described'
const INAPPLICABLE_STAY_INAPPLICABLE = 'universal-properties-answered'
const EVERY_RULE_STATED = 'declares-a-statement-for-every-key-function-rule'
const ONE_PRECONDITION =
  'declares-one-precondition-and-its-obligations'

const INTEGER_LIKE_ORDER = 'integer-like-keys-keep-first-occurrence-order'
const INDEX_PROTOCOL = 'the-key-function-receives-the-element-and-its-index'
/**
 * The two suffixes `language.test.ts` adds to a case identifier to address its own guards.
 *
 * There used to be three. Two of them - one for the divergence on key identity, one for the
 * divergence on group order - differed only in the sentence they carried, and a sentence is no
 * longer part of an address, so they are one constant.
 */
const IN_THE_LANGUAGE = '-in-the-language'
const DIVERGES_IN_THE_LANGUAGE = '-diverges-in-object-groupby'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'AG-1',
    'a case published with no justification. It is the calibration mutant of this battery, for the ' +
      'reason NP-1 and DA-1 are on the other two: the guard it reddens is the catalogue\'s own, ' +
      'carried identically by all three contracts',
    [edgeCases(SINGLE_ELEMENT_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),
  sameOnEveryLens(
    'AG-2',
    'an inapplicable universal property promoted to applicable. This contract is the third shape ' +
      '`no ambient output` was confirmed unreachable on without changing a word of the finding, so ' +
      'the flag is where that confirmation is recorded',
    [contract(NO_AMBIENT_OUTPUT, `    name: 'no ambient output',\n    applicable: true,`)],
    killed([INAPPLICABLE_STAY_INAPPLICABLE]),
  ),
  sameOnEveryLens(
    'AG-3',
    'an obligation demoted to a precondition - and the guard that catches it names this exact move ' +
      'in its own comment as the cheap way to make a failing guard go away. Block 4.2 of this ' +
      'contract exists to separate three kinds of statement about the key function, and the claim it ' +
      'makes is that exactly one of them is a precondition. Demoting the propagation obligation ' +
      'would let an implementation swallow the caller\'s exception and blame the caller for it',
    [contract(EXCEPTION_RULE_KIND, `    kind: 'precondition',\n    name: 'an exception propagates unchanged',`)],
    killed([ONE_PRECONDITION]),
  ),
  sameOnEveryLens(
    'AG-4',
    'a rule about the key function published with no statement. The rules are the block neither ' +
      'other prototype needed, and a named rule with nothing behind it is the shape the naive move ' +
      'reaches - declaring "the key function must be pure" and moving on',
    [contract(INDEX_ORDER_RULE, `    kind: 'obligation',\n    name: 'in ascending index order',\n    statement: '',`)],
    killed([EVERY_RULE_STATED]),
  ),
  sameOnEveryLens(
    'AG-5',
    'one case addressed by another case\'s identifier, so block 4.4 settles two different things ' +
      'under one name. It is the defect the instrument itself was bitten by: `language.test.ts` ' +
      'gives every replayed case its own suffix because two guards sharing a title are attributed to ' +
      'each other, and twenty-four of them once read as reddened by defects they cannot see. It is ' +
      'also the mutant the other two contracts copied when the identifier became the catalogue\'s ' +
      'rule - NP-10 and DA-15 are this one. Written as a rename rather than as an added case, ' +
      'because adding one grows the suite and the count check refuses the cell before any guard can ' +
      'speak',
    [edgeCases(SINGLE_ELEMENT_ID, `    id: 'the-empty-array',`)],
    killed([EVERY_ID_UNIQUE]),
  ),
  sameOnEveryLens(
    'AG-6',
    'a benchmark profile emptied of its samples. The shape assertion beside it passes on an empty ' +
      'list, which is why the emptiness guard is separate rather than a clause of it',
    [contract(MANY_SMALL_SAMPLES, `    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),
  sameOnEveryLens(
    'AG-7',
    'a benchmark profile published with no description. Block 4.5 of this contract had to stop being ' +
      'pure data - one of its two arguments is a function - so a profile here names a key function ' +
      'and an array and a shape, and the description is the only thing that says which of the three ' +
      'is the point. A name with nothing behind it is the guard\'s own wording',
    [contract(STRING_KEYS_DESCRIPTION, `    description: '',`)],
    killed([EVERY_SHAPE_AND_DESCRIPTION]),
  ),
  sameOnEveryLens(
    'AG-8',
    'the group-order case specified as an object would answer it: keys first seen as "10", "2", "1" ' +
      'settled as "1", "2", "10". It is the single decision the return type was chosen for, written ' +
      'backwards - the answer lodash, Ramda and `Object.groupBy` all give, measured. Two guards go ' +
      'red together and that pair is the point: the contract\'s own case, and its twin in ' +
      '`language.test.ts`, which the reference battery cannot reach at all. A wrong table entry ' +
      'reddens what the language answers as well as what the reference does, which is what makes ' +
      'that file a replay of this table rather than a second opinion about it. Three guards go red ' +
      'and the third is the sharpest: the answer this mutant writes into the table is exactly what ' +
      '`Object.groupBy` gives, so the guard that requires the two to *disagree* stops being able to ' +
      'find a disagreement. A specification that drifts towards the object-shaped answer takes the ' +
      'measurement refusing that answer with it',
    [
      edgeCases(
        INTEGER_LIKE_OUTCOME,
        `    outcome: {
      kind: 'groups',
      groups: [['1', ['1']], ['2', ['2']], ['10', ['10']], ['b', ['b']], ['a', ['a']]],
    },`,
      ),
    ],
    killed([
      INTEGER_LIKE_ORDER,
      `${INTEGER_LIKE_ORDER}${IN_THE_LANGUAGE}`,
      `${INTEGER_LIKE_ORDER}${DIVERGES_IN_THE_LANGUAGE}`,
    ]),
  ),
  sameOnEveryLens(
    'AG-9',
    'the call protocol specified one-based. It is the second half of what AG-8 measures and it is ' +
      'not the same half: `expectedCalls` is the field neither of the other two contracts\' tables ' +
      'has, because half the behaviour here arrives as a function and an obligation nobody executes ' +
      'is a sentence. A one-based index is what a caller migrating from a language that counts from ' +
      'one would specify, and both the reference and `Map.groupBy` count from zero, so both twins ' +
      'go red',
    [edgeCases(INDEX_CALLS, `    expectedCalls: [['a', 1], ['b', 2], ['c', 3]],`)],
    killed([INDEX_PROTOCOL, `${INDEX_PROTOCOL}${IN_THE_LANGUAGE}`]),
  ),
  sameOnEveryLens(
    'AG-10',
    'a provenance outside the vocabulary the catalogue declares - the part of the specification the ' +
      'compiler holds alone, on a third contract. The catalogue says in writing that no test can ' +
      'check a declared provenance; this measures the consequence rather than restating it',
    [edgeCases(PARITY_CASE, PARITY_CASE.replace(`'specified'`, `'guessed'`))],
    killedByTypecheck,
  ),
]

export const battery: Battery = {
  name: 'array-group-by-spec',
  contractPath: 'contracts/array/group-by',
  timeZone: 'UTC',
  calibrationMutant: 'AG-1',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'total - one export, no diagnostic, a Map returned for every array',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the contract\'s declarations. This battery injects ' +
        'into `contract.ts` and `edge-cases.ts`, and none of these reads either: the signature block ' +
        'compares the reference\'s own generic type against types written beside it, and the ' +
        'properties quantify over answers this battery does not change. The reference battery ' +
        'witnesses all of them - S-1 to S-8 on the first nine, M-01 to M-22 on the rest.',
      guards: [
        'signature-is-the-declared-type',
        'signature-infers-the-element-type',
        'signature-infers-the-key-type',
        'signature-passes-the-index',
        'signature-accepts-a-readonly-array',
        'signature-returns-owned-groups',
        'signature-refuses-a-third-argument',
        'signature-refuses-a-non-array',
        'signature-refuses-a-missing-key-function',
        'no-mutation-of-arguments',
        'support-the-key-functions-reach-every-region',
        'every-divergence-is-justified',
      ],
    },
    {
      reason:
        'over the implementation rather than over the declarations, on the five properties of block ' +
        '4.3. Each compares what the reference answered against what it was asked, with helpers ' +
        'local to `properties.test.ts`; nothing in `contract.ts` or `edge-cases.ts` decides their ' +
        'verdict.',
      suites: ['array/group-by@1 specific properties'],
    },
  ],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'reachable from here only through `outputsAreEqual`, which lives in `contract.ts` and which ' +
        'this battery does not mutate. Both compare two answers with the contract\'s declared ' +
        'equality, so a mutant that broke that function would redden them - and a defect of the ' +
        'contract\'s own comparison is a fifth family, not one of the four written here. The ' +
        'reference battery witnesses both: M-21 and M-22.',
      guards: [
        'determinism',
        'no-ambient-input-from-history',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the six benchmark profiles AG-6 and AG-7 leave alone. Each publishes a claim about the ' +
        'shape of the grouping its samples produce, and one mutant per profile would repeat one ' +
        'sentence six times; AG-6 measures that an empty list is caught and AG-7 that a profile ' +
        'with no description is.',
      guards: [
        'profile-one-group-per-element',
        'profile-single-group',
        'profile-few-large-groups',
        'profile-many-small-groups',
        'profile-string-keys',
        'profile-empty',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the cases of block 4.4 that AG-5, AG-8 and AG-9 do not touch, and the six inputs only an ' +
        'untyped caller can pass. Every one is reachable - AG-8 and AG-9 are the proof, on this ' +
        'contract where a case carries its own title and a mutant therefore reddens the guard it was ' +
        'written for - and each of the rest would need its own mutant to say the same sentence about ' +
        'a different row. What is missing is a mutant, not a case.',
      guards: [
        'numbers-by-parity',
        'objects-by-a-field',
        'the-empty-array',
        'a-single-element',
        'numeric-keys-keep-first-occurrence-order',
        'a-group-keeps-input-order',
        'nan-keys-form-one-group',
        'a-negative-zero-key-is-stored-as-a-positive-zero',
        'a-number-and-its-string-are-different-keys',
        'a-boolean-and-its-string-are-different-keys',
        'two-distinct-objects-are-two-keys',
        'one-object-used-twice-is-one-key',
        'symbols-are-keys',
        'undefined-and-null-are-two-keys',
        'the-key-proto',
        'the-key-constructor',
        'the-keys-tostring-and-hasownproperty',
        'a-hole-in-a-sparse-array',
        'an-explicit-undefined-element',
        'a-key-function-is-never-asked-twice',
        'a-key-function-that-writes-to-its-element',
        'an-exception-propagates-unchanged',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'block 4.4 replayed against `Map.groupBy`, minus the two twins AG-8 and AG-9 redden. The ' +
        'reference battery declares this whole suite out of its reach by construction, and that is ' +
        'true of it and not of this one: these guards read the table, so a defect injected into the ' +
        'table reaches them. Two of the thirty are probed, which is what establishes that the file ' +
        'replays this table; the other twenty-eight would each need a mutant to repeat it.',
      guards: [
        'numbers-by-parity-in-the-language',
        'objects-by-a-field-in-the-language',
        'the-empty-array-in-the-language',
        'a-single-element-in-the-language',
        'numeric-keys-keep-first-occurrence-order-in-the-language',
        'a-group-keeps-input-order-in-the-language',
        'nan-keys-form-one-group-in-the-language',
        'a-negative-zero-key-is-stored-as-a-positive-zero-in-the-language',
        'a-number-and-its-string-are-different-keys-in-the-language',
        'a-boolean-and-its-string-are-different-keys-in-the-language',
        'two-distinct-objects-are-two-keys-in-the-language',
        'one-object-used-twice-is-one-key-in-the-language',
        'symbols-are-keys-in-the-language',
        'undefined-and-null-are-two-keys-in-the-language',
        'the-key-proto-in-the-language',
        'the-key-constructor-in-the-language',
        'the-keys-tostring-and-hasownproperty-in-the-language',
        'a-hole-in-a-sparse-array-in-the-language',
        'an-explicit-undefined-element-in-the-language',
        'a-key-function-is-never-asked-twice-in-the-language',
        'a-key-function-that-writes-to-its-element-in-the-language',
        'an-exception-propagates-unchanged-in-the-language',
        'a-null-input-in-the-language-from-an-untyped-caller',
        'an-undefined-input-in-the-language-from-an-untyped-caller',
        'a-plain-object-in-the-language-from-an-untyped-caller',
        'a-number-in-the-language-from-an-untyped-caller',
        'a-set-in-the-language-from-an-untyped-caller',
        'a-string-in-the-language-from-an-untyped-caller',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the three divergences from `Object.groupBy` AG-8 does not reach. Like the language twins ' +
        'above they read block 4.4 by title, so a defect injected into the table reaches them - AG-8 ' +
        'is the proof, on the fourth. What they publish is the half of block 4.1 that says the ' +
        'object-shaped grouper disagrees, and each of the three would need its own mutant to say ' +
        'that about a different row.',
      guards: [
        `a-number-and-its-string-are-different-keys${DIVERGES_IN_THE_LANGUAGE}`,
        `a-boolean-and-its-string-are-different-keys${DIVERGES_IN_THE_LANGUAGE}`,
        `two-distinct-objects-are-two-keys${DIVERGES_IN_THE_LANGUAGE}`,
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the six inputs only an untyped caller can pass. They are the runtime half of what the ' +
        'signature refuses at compile time, and no mutant here rewrites one - the same argument as ' +
        'the block 4.4 table above, and separated from it only because they are a second table.',
      suites: ['array/group-by@1 inputs only an untyped caller can pass'],
    },
  ],

  mutants,
}
