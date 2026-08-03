/**
 * The `string/levenshtein@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks whether it catches
 * a broken *specification*. Why it is a second battery rather than a second arm or lens, and the
 * limit that a specification mutant may not change the number of guards, are stated in
 * `number-parse-spec.battery.ts` and are not repeated here.
 *
 * The second limit stated there - that a specification mutant renames the guard it reddens - was
 * removed from the catalogue before this contract existed, so this is the first battery written after
 * every case carries an `id`. LS-6 and LS-11 are pinned on the guards they were written for, with no
 * paragraph explaining why they could not be.
 *
 * LS-11 is the mutant this battery is worth writing for on its own. It specifies the unit decision
 * backwards - one emoji at distance two from the empty string, which is what the ecosystem answers -
 * and two guards go red together: the case itself, and the guard that requires this contract's table
 * to disagree with a code-unit implementation on exactly four rows. A specification drifting towards
 * the ecosystem's answer takes the measurement refusing that answer with it, which is the shape AG-8
 * found on `array/group-by@1` and the reason that guard exists here at all.
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

const SYMMETRY_AXIOM = `  {
    name: 'symmetry',
    statement:
      'The distance does not depend on which string is given first. It holds because the three ' +
      'operations come in inverse pairs of equal cost - an insertion on one side is a deletion on ' +
      'the other, and a substitution is its own inverse - and it fails the moment an implementation ' +
      'prices two of them differently.',
  },`

const TRIANGLE_AXIOM = `  {
    name: 'triangle inequality',
    statement:
      'No detour is shorter: the distance from a to c never exceeds the distance from a to b plus ' +
      'the distance from b to c. It is the axiom that catches an implementation whose notion of two ' +
      'characters being equal is not transitive - a fuzzy comparison, a tolerance, a unit applied to ' +
      'one side and not the other - none of which any single named case would notice.',
  },
] as const`

const UNRELATED_SAMPLES = `    samples: [
      { a: 'aaaaaaaaaa', b: 'bbbbbbbbbb' },
      { a: repeated('ab', 100), b: repeated('cd', 100) },
      { a: wordOfLength(1_000, 1), b: wordOfLength(1_000, 2) },
    ],`

const ASTRAL_PROFILE_DESCRIPTION = `    description:
      'Text made of astral characters, where the decomposition into code points allocates two units ' +
      'of storage per unit of length. Measured separately because it is the one shape where the ' +
      'choice of unit has a cost, and a reader comparing implementations should see what it is.',`

const ONE_EDIT_SAMPLE = `      { a: 'address', b: 'adress' },`

const IDENTICAL_PROFILE_CLASS = `    distanceClass: 'zero',
    samples: [
      { a: 'levenshtein', b: 'levenshtein' },`

const IDENTITY_RATIONALE = `    rationale: 'A string is at distance zero from itself, which is the first axiom made concrete.',`

const BOTH_EMPTY_CASE = `    id: 'both-empty',
    a: '',
    b: '',
    expected: 0,
    provenance: 'specified',`

const TRANSPOSITION_EXPECTED = `    id: 'a-transposition',
    a: 'ab',
    b: 'ba',
    expected: 2,`

const ASTRAL_EXPECTED = `    id: 'an-astral-character-is-one-unit',
    a: GRINNING_FACE,
    b: '',
    expected: 1,`

const ONE_INSERTION_CASE = `    id: 'one-insertion',
    a: 'ab',
    b: 'abc',`

const ONE_DELETION_ID = `    id: 'one-deletion',`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_ID_UNIQUE = 'addresses each case with a unique identifier'
const EVERY_PAIR_ONCE = 'settles each pair exactly once'
const EVERY_CASE_JUSTIFIED = 'publishes a rationale for every decision'
const SEPARATES_FROM_THE_ECOSYSTEM =
  'names exactly the cases that separate this contract from the ecosystem'
const EVERY_PROFILE_POPULATED = 'declares a non-empty sample set for every profile'
const EVERY_CLASS_AND_DESCRIPTION =
  'names every declared class at least once, and describes every profile'
const ONE_EDIT_PROFILE = 'one-edit-apart - every sample is one-edit'
const INAPPLICABLE_STAY_INAPPLICABLE = 'keeps the inapplicable universal properties declared as such'
const EVERY_AXIOM_ANSWERED =
  'answers every declared metric axiom with a property, and declares every axiom it answers'
const EVERY_AXIOM_STATED = 'publishes a statement for every metric axiom'

const A_TRANSPOSITION = 'a-transposition'
const ASTRAL_ALONE = 'an-astral-character-is-one-unit'

/**
 * The title the `identical` profile's guard carries **only while LS-13 is injected**, and the reason
 * that sentence is possible to write at all.
 *
 * A block 4.5 guard is titled by rendering the profile's own declared class, so a specification
 * mutant that rewrites the class rewrites the guard. This constant is therefore not the address of
 * anything in the unmutated contract - it names a guard that exists in one cell of one battery - and
 * it is the state the guard identifiers of this unit exist to end.
 */
const IDENTICAL_PROFILE_UNDER_LS_13 = 'identical - every sample is far'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'LS-1',
    'a case published with no justification. It is the calibration mutant of this battery, for the ' +
      'reason NP-1, DA-1 and AG-1 are on the other three: the guard it reddens is the catalogue\'s ' +
      'own, carried identically by every contract',
    [edgeCases(IDENTITY_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),
  sameOnEveryLens(
    'LS-2',
    'an inapplicable universal property promoted to applicable. This contract is the fourth shape ' +
      '`no ambient output` has been confirmed unreachable on without changing a word of the finding, ' +
      'so the flag is where that confirmation is recorded',
    [contract(NO_AMBIENT_OUTPUT, `    name: 'no ambient output',\n    applicable: true,`)],
    killed([INAPPLICABLE_STAY_INAPPLICABLE]),
  ),
  sameOnEveryLens(
    'LS-3',
    'an axiom published with no statement. The axioms are what this contract claims about itself and ' +
      'the reason its table is a third the size of `number/parse@1`\'s; a named axiom with nothing ' +
      'behind it is the shape the claim reaches when it becomes a heading',
    [contract(SYMMETRY_AXIOM, `  {\n    name: 'symmetry',\n    statement: '',\n  },`)],
    killed([EVERY_AXIOM_STATED]),
  ),
  sameOnEveryLens(
    'LS-4',
    'an axiom removed from the declared list while the property that answers it stays. It is the ' +
      'quiet way a contract stops claiming something: the guard goes on passing, the property goes on ' +
      'running, and the published list no longer says the function is a metric. Both directions are ' +
      'one guard, so the mirror - a property deleted while the axiom stands - reddens the same one',
    [contract(TRIANGLE_AXIOM, `] as const`)],
    killed([EVERY_AXIOM_ANSWERED]),
  ),
  sameOnEveryLens(
    'LS-5',
    'a provenance outside the vocabulary the catalogue declares - the part of the specification the ' +
      'compiler holds alone, on a fourth contract. The catalogue says in writing that no test can ' +
      'check a declared provenance; this measures the consequence rather than restating it',
    [edgeCases(BOTH_EMPTY_CASE, BOTH_EMPTY_CASE.replace(`'specified'`, `'assumed'`))],
    killedByTypecheck,
  ),
  sameOnEveryLens(
    'LS-6',
    'the transposition specified as Damerau-Levenshtein answers it: one edit rather than two. It is ' +
      'the single decision that separates this contract from that one, written backwards, and it is ' +
      'the kind of drift a reader proposes in good faith because the Damerau answer is the one a ' +
      'spelling corrector wants. Two guards go red: the case itself, and the guard that measures ' +
      'which rows this table answers differently from a code-unit implementation - because a ' +
      'transposition is answered the same way under both units, so a wrong expectation makes it look ' +
      'like a divergence it is not',
    [edgeCases(TRANSPOSITION_EXPECTED, TRANSPOSITION_EXPECTED.replace(`expected: 2,`, `expected: 1,`))],
    killed([A_TRANSPOSITION, SEPARATES_FROM_THE_ECOSYSTEM]),
  ),
  sameOnEveryLens(
    'LS-7',
    'one case addressed by another case\'s identifier, so two rows of block 4.4 answer to one name. ' +
      'One insertion and one deletion are the same edit read from the two ends and would read as one ' +
      'case under one address. Both rows go on passing, so the catalogue guard is the only thing ' +
      'that sees it. A rename rather than an added case, because the count check refuses a cell whose ' +
      'suite grew',
    [edgeCases(ONE_DELETION_ID, `    id: 'one-insertion',`)],
    killed([EVERY_ID_UNIQUE]),
  ),
  sameOnEveryLens(
    'LS-8',
    'a benchmark profile emptied of its samples. The class assertion beside it passes on an empty ' +
      'list, which is why the emptiness guard is separate rather than a clause of it',
    [contract(UNRELATED_SAMPLES, `    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),
  sameOnEveryLens(
    'LS-9',
    'a benchmark profile published with no description. On this contract a profile names two strings ' +
      'and a class, and the description is the only thing that says which part of the matrix the pair ' +
      'was chosen to exercise',
    [contract(ASTRAL_PROFILE_DESCRIPTION, `    description: '',`)],
    killed([EVERY_CLASS_AND_DESCRIPTION]),
  ),
  sameOnEveryLens(
    'LS-10',
    'a benchmark sample that answers the opposite of what its profile is named for: two unrelated ' +
      'words in the profile that claims to measure a single typo. It is the defect `number/parse@1` ' +
      'shipped and this guard exists to catch, reintroduced on a fourth vocabulary - and it is the ' +
      'defect this contract\'s own block 4.5 shipped on its first run, where two samples claiming to ' +
      'be far apart were six and a hundred and fifty edits apart',
    [contract(ONE_EDIT_SAMPLE, `      { a: 'address', b: 'zzzzzzz' },`)],
    killed([ONE_EDIT_PROFILE]),
  ),
  sameOnEveryLens(
    'LS-11',
    'the unit decision specified the way the ecosystem answers it: one emoji at distance two from ' +
      'the empty string. It is the single decision this contract exists to settle, written ' +
      'backwards, and the pair of guards it reddens is the point. The case itself goes red, and so ' +
      'does the guard that requires this table to disagree with a code-unit implementation on exactly ' +
      'four rows - because the answer this mutant writes into the table *is* the code-unit answer, so ' +
      'the row stops being a disagreement. A specification drifting towards the ecosystem takes the ' +
      'measurement refusing the ecosystem with it, and nothing else in the suite would have said so',
    [edgeCases(ASTRAL_EXPECTED, ASTRAL_EXPECTED.replace(`expected: 1,`, `expected: 2,`))],
    killed([ASTRAL_ALONE, SEPARATES_FROM_THE_ECOSYSTEM]),
  ),
  sameOnEveryLens(
    'LS-12',
    'one pair of strings rewritten onto another, so block 4.4 settles the same call twice. The two ' +
      'rows keep their own identifiers and their own answers, and both are right, so nothing but the ' +
      'guard about the table sees that one of the two decisions has stopped being made',
    [edgeCases(ONE_INSERTION_CASE, `    id: 'one-insertion',\n    a: 'abc',\n    b: 'ab',`)],
    killed([EVERY_PAIR_ONCE]),
  ),
  sameOnEveryLens(
    'LS-13',
    'the `identical` profile relabelled as a pair of unrelated strings - a benchmark that claims to ' +
      'time the fast path and is published as timing the worst case. It is a real specification ' +
      'defect on its own, and it is here for a second reason: it is the one mutant in the ten ' +
      'batteries that rewrites data a guard\'s *title* is rendered from, which is the question this ' +
      'unit had to answer with a measurement rather than with an argument. The guard reddens, and ' +
      'reddens under a title the unmutated contract does not contain, so calibration never saw it: ' +
      'the instrument attributes nothing to it, and the declaration below that calls its region ' +
      'unprobed is not reported stale, which is the one refusal `instrument.test.ts` exists to ' +
      'guarantee. The pin can only name the mutated title, and a pin that names a string no contract ' +
      'carries is not an address.',
    [contract(IDENTICAL_PROFILE_CLASS, IDENTICAL_PROFILE_CLASS.replace(`'zero'`, `'far'`))],
    killed([IDENTICAL_PROFILE_UNDER_LS_13]),
  ),
]

export const battery: Battery = {
  name: 'string-levenshtein-spec',
  contractPath: 'contracts/string/levenshtein',
  timeZone: 'UTC',
  calibrationMutant: 'LS-1',

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
  ],

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the contract\'s declarations. This battery injects ' +
        'into `contract.ts` and `edge-cases.ts`, and none of these reads either: the signature block ' +
        'compares the reference\'s own type against a type written beside it, and the properties ' +
        'quantify over answers this battery does not change. The reference battery witnesses every ' +
        'one of them - S-16 to S-19 on the first five, L-01 to L-20 on the rest.',
      guards: [
        'matches the type declared by the contract',
        'accepts two strings and nothing else',
        'always returns a number',
        'refuses a call with one string',
        'refuses a call carrying options',
        'P1 - identity: a string is at distance zero from itself',
        'P2 - discernibility: two different strings are at a distance of at least one',
        'P3 - symmetry: the distance does not depend on which string comes first',
        'P4 - the triangle inequality: no detour through a third string is shorter',
        'P5 - the distance sits between the difference of the lengths and the longer length',
        'P6 - the answer is a whole number and never negative',
        'P7 - one edit apart is a distance of exactly one',
        'P8 - a shared prefix and a shared suffix cost nothing',
        'is deterministic - the same call yields the same answer every time',
        'has no ambient input - an answer does not depend on the calls made before it',
        'draws pairs that really are one code point apart',
        'draws texts that reach every region the properties police',
      ],
    },
  ],

  unprobedRegions: [
    {
      nature: 'documents a decision',
      reason:
        'the cases of block 4.4 no mutant here rewrites. Every one is reachable - LS-6 and LS-11 are ' +
        'the proof - and each of the rest would need its own mutant to say the same sentence about a ' +
        'different row. What is missing is a mutant, not a case.',
      guards: [
        'both-empty',
        'identical-text',
        'one-side-empty',
        'the-other-side-empty',
        'one-substitution',
        'one-insertion',
        'one-deletion',
        'the-canonical-example',
        'a-shared-suffix',
        'a-shared-infix',
        'a-transposition-inside-a-word',
        'case-is-a-difference',
        'a-space-is-a-code-point',
        'an-astral-character-inside-a-word',
        'two-astral-characters-and-one',
        'a-grapheme-is-not-the-unit',
        'a-lone-surrogate-is-one-unit',
        'a-surrogate-pair-against-its-own-half',
        'normalisation-is-not-applied',
        'a-combining-mark-is-one-unit',
        'a-precomposed-character-is-one-unit',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the five benchmark profiles LS-8, LS-9 and LS-10 leave alone. Each publishes a claim about ' +
        'where its answer sits between the two bounds, and one mutant per profile would repeat one ' +
        'sentence six times.',
      guards: [
        'identical - every sample is zero',
        'unrelated - every sample is far',
        'against-the-empty-string - every sample is the-whole-of-one-side',
        'astral-text - every sample is far',
      ],
    },
  ],

  mutants,
}
