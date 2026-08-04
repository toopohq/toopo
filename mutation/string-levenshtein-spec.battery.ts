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
    group: 'the-two-ends-of-the-scale',
    a: '',
    b: '',
    expected: 0,
    provenance: 'specified',`

const TRANSPOSITION_EXPECTED = `    id: 'a-transposition',
    group: 'the-scope-this-contract-does-not-cover',
    a: 'ab',
    b: 'ba',
    expected: 2,`

const ASTRAL_EXPECTED = `    id: 'an-astral-character-is-one-unit',
    group: 'the-unit-an-edit-is-counted-in',
    a: GRINNING_FACE,
    b: '',
    expected: 1,`

const ONE_INSERTION_CASE = `    id: 'one-insertion',
    group: 'one-edit-of-each-kind',
    a: 'ab',
    b: 'abc',`

const ONE_DELETION_ID = `    id: 'one-deletion',`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_ID_UNIQUE = 'every-case-is-addressed'
const EVERY_CASE_GROUPED = 'every-case-is-grouped'
const EVERY_PAIR_ONCE = 'settles-each-pair-once'
const EVERY_CASE_JUSTIFIED = 'every-case-is-justified'
const SEPARATES_FROM_THE_ECOSYSTEM =
  'the-cases-that-separate-from-the-ecosystem'
const EVERY_PROFILE_POPULATED = 'every-profile-has-samples'
const EVERY_CLASS_AND_DESCRIPTION =
  'every-class-is-named-and-described'
const ONE_EDIT_PROFILE = 'profile-one-edit-apart'
const INAPPLICABLE_STAY_INAPPLICABLE = 'universal-properties-answered'
const EVERY_AXIOM_ANSWERED =
  'declares-a-property-for-every-axiom'
const EVERY_AXIOM_STATED = 'declares-a-statement-for-every-axiom'

const A_TRANSPOSITION = 'a-transposition'
const ASTRAL_ALONE = 'an-astral-character-is-one-unit'

const IDENTICAL_PROFILE = 'profile-identical'

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
      'defect on its own, and it is the mutant that measured what a guard identifier buys. A block ' +
      '4.5 guard renders its declared class into its title, so before identifiers this defect ' +
      'reddened its guard under `identical - every sample is far`, a title the unmutated contract ' +
      'does not contain: calibration never saw it, attribution had nothing to attribute, and this ' +
      'battery passed thirteen of thirteen while reporting the region as one no mutant probes. The ' +
      'pin could only name the mutated title, which is not an address. It now names ' +
      '`profile-identical`, the guard carries that address whatever its class says, and the ' +
      'declaration that called this region unprobed had to go - because it is probed.',
    [contract(IDENTICAL_PROFILE_CLASS, IDENTICAL_PROFILE_CLASS.replace(`'zero'`, `'far'`))],
    killed([IDENTICAL_PROFILE]),
  ),
  sameOnEveryLens(
    'LS-14',
    'one case filed under a group it does not belong to, so the page publishes it under the wrong ' +
      'heading. Every answer in the table is still right, every identifier still unique, every ' +
      'anchor still resolves - the only thing wrong is what a reader is told the row is about, ' +
      'which is why the grouping needed a guard of its own rather than a comment banner. It moves ' +
      'to a group that is not its neighbour, and the first version of this cell did not: see the ' +
      'limit declared below',
    [
      edgeCases(
        `    id: 'one-substitution',\n    group: 'one-edit-of-each-kind',`,
        `    id: 'one-substitution',\n    group: 'normalisation',`,
      ),
    ],
    killed([EVERY_CASE_GROUPED]),
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
        'signature-is-the-declared-type',
        'signature-accepts-two-strings',
        'signature-returns-a-number',
        'signature-refuses-one-string',
        'signature-refuses-options',
        'p1-identity',
        'p2-discernibility',
        'p3-symmetry',
        'p4-triangle-inequality',
        'p5-bounds',
        'p6-a-whole-non-negative-number',
        'p7-one-edit-is-one',
        'p8-shared-affixes-cost-nothing',
        'determinism',
        'no-ambient-input-from-history',
        'support-the-pairs-are-one-edit-apart',
        'support-the-texts-reach-every-region',
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
        'the benchmark profiles LS-8, LS-9, LS-10 and LS-13 leave alone. Each publishes a claim ' +
        'about where its answer sits between the two bounds, and one mutant per profile would ' +
        'repeat one sentence five times. `identical` left this list when LS-13 was written: it is ' +
        'the row that measured what an address buys, because the same mutant reddened the same ' +
        'guard before identifiers existed and this declaration went on calling the region unprobed.',
      guards: ['profile-unrelated', 'profile-against-the-empty-string', 'profile-astral-text'],
    },
  ],

  mutants,
}
