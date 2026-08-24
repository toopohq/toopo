/**
 * The `object/deep-equal@1` specification battery.
 *
 * It injects into `contract.ts` and `edge-cases.ts` and asks the other half of the question the
 * reference battery asks: when the *specification* is wrong, does anything say so? A contract is
 * frozen for the life of its major, so a defect here is one nobody can repair afterwards - and the
 * guards that catch one are structural rather than behavioural, which is why they need a battery of
 * their own. ADR-0075.
 *
 * **Every pin below was read off a replay and none was predicted**, which is the same discipline the
 * reference battery states and the one this repository was caught failing three days before this
 * contract was written.
 *
 * The prefix is `DS-`, two letters, on the rule `CLAUDE.md` records.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'S', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const NOT_A_NUMBER_EQUALS_ITSELF = `    id: 'not-a-number-equals-itself',
    group: 'identity-of-a-primitive',
    left: NaN,
    right: NaN,
    expected: true,`

const THE_ERROR_GROUP = `  { id: 'an-error-is-data', title: 'An error is data', note: null },`

const A_CASE_CARRIES_A_REASON = `    rationale:
      '\`NaN === NaN\` is false and \`Object.is(NaN, NaN)\` is true. A comparison about data takes the ' +
      'second: a caller holding two records that both failed to parse a number is holding the same ' +
      'record twice, not two different ones.',`

const THE_PROFILE_VOCABULARY = `  readonly comparisonClass: 'stops-early' | 'stops-late' | 'walks-everything'`

const THE_FIRST_PROFILE_CLASS = `    comparisonClass: 'stops-early',
    samples: [
      { left: { id: 1, name: 'a', open: false }, right: { id: 2, name: 'a', open: false } },`


const THE_MUTATION_PROPERTY_IS_APPLICABLE = `    name: 'never mutates its arguments',
    applicable: true,`

const THE_DECLARED_SIGNATURE = `export type DeepEqual = (left: unknown, right: unknown) => boolean`

const HOW_ANSWERS_ARE_COMPARED = `export const outputsAreEqual = (a: boolean, b: boolean): boolean => Object.is(a, b)`

// ---------------------------------------------------------------------------
// Guard identifiers, named once
// ---------------------------------------------------------------------------

const CASES_ARE_ADDRESSED = 'every-case-is-addressed'
const CASES_ARE_GROUPED = 'every-case-is-grouped'
const CASES_ARE_JUSTIFIED = 'every-case-is-justified'
const UNIVERSAL_PROPERTIES = 'universal-properties-answered'
const TYPE_IDENTITY = 'signature-is-the-declared-type'

const specification: readonly Mutant[] = [
  sameOnEveryLens(
    'DS-01',
    'declares that NaN is not equal to itself, which is the language\'s `===` rule written into the ' +
      'contract instead of `Object.is`. A settled answer moved by one word, and the whole point of ' +
      'block 4.4 is that an answer nobody can derive has to be asserted somewhere',
    [edgeCases(NOT_A_NUMBER_EQUALS_ITSELF, NOT_A_NUMBER_EQUALS_ITSELF.replace('expected: true,', 'expected: false,'))],
    killed(['not-a-number-equals-itself', 'not-a-number-equals-itself-transposed']),
  ),

  sameOnEveryLens(
    'DS-02',
    'takes a group out of the partition while its four cases go on naming it, so a reader following ' +
      'the table\'s own structure meets rows that belong to nothing',
    [edgeCases(THE_ERROR_GROUP, '')],
    killed([CASES_ARE_GROUPED]),
  ),

  sameOnEveryLens(
    'DS-03',
    'empties the sentence that justifies a case. A row with no rationale is a decision the catalogue ' +
      'took and cannot explain, and it is frozen with the major either way',
    [edgeCases(A_CASE_CARRIES_A_REASON, `    rationale: '',`)],
    killed([CASES_ARE_JUSTIFIED]),
  ),

  sameOnEveryLens(
    'DS-04',
    'gives two cases one identifier, so the registry addresses two different questions by one name ' +
      'and a citation resolves to whichever it meets first',
    [
      edgeCases(
        NOT_A_NUMBER_EQUALS_ITSELF,
        NOT_A_NUMBER_EQUALS_ITSELF.replace(
          "id: 'not-a-number-equals-itself',",
          "id: 'negative-zero-is-not-zero',",
        ),
      ),
    ],
    killed([CASES_ARE_ADDRESSED]),
  ),

  sameOnEveryLens(
    'DS-05',
    'adds a fourth class to the profile vocabulary that no profile carries, so the registry serves a ' +
      'word a reader is handed and nothing measures. **It survives, and the guard written for it is ' +
      'why**: `every-class-the-vocabulary-declares-is-sampled` re-declares the union by hand - three ' +
      'strings in an array beside the type - so a fourth member of the type leaves its list at three ' +
      'and it passes. Its own comment claims *both directions*, and the second one is dead: a profile ' +
      'declaring a class outside the union does not compile, and a class inside it that no profile ' +
      'carries reddens nothing. Totality would need the union derived from a runtime list rather than ' +
      'transcribed from the type, and `profiles.test.ts` is one of the seven files inside this ' +
      'contract digest. ADR-0161',
    [
      contract(
        THE_PROFILE_VOCABULARY,
        `  readonly comparisonClass: 'stops-early' | 'stops-late' | 'walks-everything' | 'stops-nowhere'`,
      ),
    ],
    survived('its-witness-is-frozen-out'),
  ),

  sameOnEveryLens(
    'DS-06',
    'labels a profile with a class its samples do not belong to, which is the defect ' +
      '`number/parse@1` produced the rule for: a profile that promises to time one path and times ' +
      'another measures neither, and the label is what a reader believes',
    [
      contract(
        THE_FIRST_PROFILE_CLASS,
        THE_FIRST_PROFILE_CLASS.replace(
          "comparisonClass: 'stops-early',",
          "comparisonClass: 'walks-everything',",
        ),
      ),
    ],
    killed(['profile-two-renders-of-one-view']),
  ),

  sameOnEveryLens(
    'DS-09',
    'declares the mutation property inapplicable on a contract whose two arguments are arbitrary ' +
      'object graphs. It is the property this contract brought back to life, and demoting it is how ' +
      'a guard stops being written without anybody deleting one',
    [
      contract(
        THE_MUTATION_PROPERTY_IS_APPLICABLE,
        THE_MUTATION_PROPERTY_IS_APPLICABLE.replace('applicable: true,', 'applicable: false,'),
      ),
    ],
    killed([UNIVERSAL_PROPERTIES]),
  ),

  sameOnEveryLens(
    'DS-10',
    'narrows the declared signature to a record, which is the candidate `contract.ts` argues against ' +
      'and the one a reader is most likely to think stricter. The declaration moves and the ' +
      'implementation does not',
    [
      contract(
        THE_DECLARED_SIGNATURE,
        `export type DeepEqual = (a: Record<string, unknown>, b: Record<string, unknown>) => boolean`,
      ),
    ],
    killed([TYPE_IDENTITY]),
  ),

  sameOnEveryLens(
    'DS-11',
    'declares that two answers are compared by their negation, which is the smallest edit that makes ' +
      'every case of block 4.4 assert the opposite of what it says while the implementation is ' +
      'untouched',
    [
      contract(
        HOW_ANSWERS_ARE_COMPARED,
        `export const outputsAreEqual = (a: boolean, b: boolean): boolean => Object.is(a, !b)`,
      ),
    ],
    killed(['not-a-number-equals-itself', 'negative-zero-is-not-zero']),
  ),
]

export const battery: Battery = {
  name: 'object-deep-equal-spec',
  contractPath: 'contracts/typescript/object/deep-equal',
  timeZone: 'UTC',
  calibrationMutant: 'DS-01',

  arms: [
    {
      id: 'S',
      ref: 'HEAD',
      convention: 'the specification as committed: the declared table, the profiles and the signature',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['S'],
      edits: [],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the specification. This battery injects into ' +
        '`contract.ts` and `edge-cases.ts`, so a property that draws its own values and compares the ' +
        'walk against the platform reaches nothing this battery can edit.',
      guards: [
        'p1-reflexive-under-a-copy',
        'p2-symmetric',
        'p3-reflexive',
        'p4-transitive',
        'p5-order-of-declaration-is-not-read',
        'p6-a-perturbed-clone-is-not-the-original',
        'never-mutates-its-arguments',
        'determinism',
        'no-ambient-input-from-history',
        'the-alphabet-reaches-what-the-contract-is-about',
      ],
    },
  ],

  unprobedRegions: [
    /**
     * Regions of the specification this battery could edit and does not, one entry per region.
     *
     * They are apart from the list above because that one is about what this battery *cannot* reach -
     * a property that draws its own values - and these are cells nobody has written yet.
     */
    {
      nature: 'claims detection',
      reason:
        'the case table read as a table rather than as rows. DS-02 to DS-04 break a case one field ' +
        'at a time; nothing here writes the same pair twice or leaves a row out of the transposed ' +
        'table, which is what these two are about.',
      guards: ['settles-each-pair-once', 'answers-both-ways'],
    },
    {
      nature: 'claims detection',
      reason:
        'the shape of a benchmark profile. DS-05 edits the vocabulary and DS-06 the samples; nothing ' +
        'here empties a profile of its samples or malforms a profile name.',
      guards: ['every-profile-has-samples', 'every-profile-is-addressed'],
    },
    {
      nature: 'claims detection',
      reason:
        'what three particular profiles hold, which is a claim about samples rather than about the ' +
        'shape of one. A cell would have to replace the samples of a named profile with values that ' +
        'no longer answer its own description.',
      guards: [
        'profile-a-row-that-changed-at-the-end',
        'profile-members-without-an-order',
        'profile-two-copies-of-one-tree',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the declared signature read as a type. DS-10 breaks the type identity outright; the four ' +
        'below are the finer claims about it - that it takes two unknowns, returns a boolean, and ' +
        'accepts values whose types are unrelated or unknown to the caller - and a cell narrowing ' +
        'one parameter rather than replacing the whole signature is what would part them.',
      guards: [
        'signature-takes-two-unknowns',
        'signature-returns-a-boolean',
        'signature-accepts-a-value-whose-type-the-caller-does-not-know',
        'signature-accepts-two-values-of-unrelated-types',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the bound on ordinary depth, which is measured against the runtime and not against the ' +
        'specification. p7 builds a chain deeper than any call stack holds and requires the walk to ' +
        'finish; nothing this battery edits changes how deep the walk goes.',
      guards: ['p7-ordinary-depth-costs-no-call-frames'],
    },
  ],

  mutants: [...specification],
}
