/**
 * The `string/slugify@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks whether it
 * catches a broken *specification*. Why it is a second battery rather than a second arm or lens,
 * and the limit that a specification mutant may not change the number of guards, are stated in
 * `number-parse-spec.battery.ts` and are not repeated here.
 *
 * GS-6 is the mutant this battery is worth writing for on its own. It specifies the decision block
 * 4.1 puts in front - that the output is not restricted to ASCII - the way the ecosystem answers it,
 * with Japanese text slugging to the empty string. Two guards go red together: the case itself, and
 * the guard that requires this table to disagree with an ASCII-only alphabet on exactly fifteen
 * rows, because a row that answers the empty slug is a row an ASCII-only alphabet agrees with. A
 * specification drifting towards the ecosystem takes the measurement refusing the ecosystem with
 * it, which is the shape AG-8 found on `array/group-by@1` and LS-11 on `string/levenshtein@1`.
 *
 * GS-11 is the one that survives, and it is left open rather than closed. Widening the declared
 * output alphabet is invisible to this contract: the reference never emits the character that was
 * added, so every property that reads the pattern goes on passing. The alphabet is checked in one
 * direction only - nothing the implementation answers may fall outside it - and nothing requires it
 * to be no wider than the answers need.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, killedByTypecheck, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'S', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const NO_AMBIENT_OUTPUT = `    name: 'no ambient output',
    applicable: false,`

const LOWER_STEP = `  {
    name: 'lower',
    statement:
      'Each base is lower-cased on its own rather than as part of the whole text. JavaScript\\'s ' +
      'lower-casing is context sensitive - a Greek sigma at the end of a word becomes a final ' +
      'sigma - and that context includes characters this function is about to discard. An answer ' +
      'must not depend on a character that does not survive it.',
  },`

const JOIN_STEP = `  {
    name: 'join',
    statement:
      'Consecutive survivors form a run; runs are joined by exactly one hyphen. A boundary before ' +
      'the first run or after the last one produces nothing, so a slug never begins or ends with a ' +
      'separator and never carries two in a row.',
  },
] as const`

const ALPHABET_PATTERN = `  pattern: /^[\\p{L}\\p{M}\\p{Nd}]+(?:-[\\p{L}\\p{M}\\p{Nd}]+)*$/u,`

const PUNCTUATION_SAMPLES = `    samples: ['!!! a ??? b @@@ c', '🎉🎉🎉 party 🎉🎉🎉', \`\${repeated('- ', 100)}end\`],`

const NOTHING_RETAINABLE_DESCRIPTION = `    description:
      'Nothing survives, so the answer is the empty slug. It is the cheapest possible call that ' +
      'still reads all of its input, and callers filtering a list of user-supplied labels make it ' +
      'far more often than they expect to.',`

const ALREADY_A_SLUG_SAMPLES = `    samples: ['already-a-slug', 'creme-brulee', \`\${repeated('very-long-slug-', 60)}end\`],`

const NOTHING_RETAINABLE_RATIONALE = `    rationale:
      'Text holding no letter, mark or digit answers the empty slug. \`slug\` answers \`iseh\` here - ' +
      'the base64 of the input, slugged - which is an identifier that looks meaningful and is ' +
      'noise. The empty slug is an answer, and a caller who cannot use it substitutes its own.',`

const THE_EMPTY_STRING_CASE = `    id: 'the-empty-string',
    text: '',
    expected: '',
    provenance: 'specified',`

const NON_LATIN_CASE = `    id: 'a-non-latin-script-is-kept',
    text: '日本語テキスト',
    expected: '日本語テキスト',`

const A_HASH_ID = `    id: 'a-hash-is-not-a-letter',`

const A_HASH_CASE = `    id: 'a-hash-is-not-a-letter',
    text: 'C#',
    expected: 'c',`

const A_PLUS_CASE = `    id: 'a-plus-is-not-a-letter',
    text: 'C++',
    expected: 'c',`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const EVERY_ID_UNIQUE = 'every-case-is-addressed'
const EVERY_TEXT_ONCE = 'settles-each-text-once'
const EVERY_CASE_JUSTIFIED = 'every-case-is-justified'
const ASCII_DIVERGENCE = 'the-cases-an-ascii-alphabet-answers-differently'
const COLLISIONS = 'the-texts-that-share-one-slug'
const EVERY_PROFILE_POPULATED = 'every-profile-has-samples'
const EVERY_CLASS_AND_DESCRIPTION =
  'every-class-is-named-and-described'
const ALREADY_A_SLUG_PROFILE = 'profile-already-a-slug'
const INAPPLICABLE_STAY_INAPPLICABLE = 'universal-properties-answered'
const EVERY_STEP_ANSWERED =
  'declares-a-property-for-every-step'
const EVERY_STEP_STATED = 'declares-a-statement-for-every-step'

const A_NON_LATIN_SCRIPT = 'a-non-latin-script-is-kept'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'GS-1',
    'a case published with no justification. It is the calibration mutant of this battery, for the ' +
      'reason NP-1, DA-1, AG-1 and LS-1 are on the other four: the guard it reddens is the ' +
      'catalogue\'s own, carried identically by every contract',
    [edgeCases(NOTHING_RETAINABLE_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),
  sameOnEveryLens(
    'GS-2',
    'an inapplicable universal property promoted to applicable. This contract is the fifth shape ' +
      '`no ambient output` has been confirmed unreachable on without changing a word of the ' +
      'finding, so the flag is where that confirmation is recorded',
    [contract(NO_AMBIENT_OUTPUT, `    name: 'no ambient output',\n    applicable: true,`)],
    killed([INAPPLICABLE_STAY_INAPPLICABLE]),
  ),
  sameOnEveryLens(
    'GS-3',
    'a step of the rule published with no statement. The six steps are what this contract sells - ' +
      'a rule short enough to be argued with, where the ecosystem has a table that can only be ' +
      'inherited - and a named step with nothing behind it is the shape that claim reaches when it ' +
      'becomes a heading',
    [contract(LOWER_STEP, `  {\n    name: 'lower',\n    statement: '',\n  },`)],
    killed([EVERY_STEP_STATED]),
  ),
  sameOnEveryLens(
    'GS-4',
    'a step removed from the declared rule while the properties that police it stay. It is the ' +
      'quiet way a contract stops claiming something: the guards go on passing, the properties go ' +
      'on running, and the published rule no longer says a slug is joined by single hyphens. Both ' +
      'directions are one guard, so the mirror - a property whose step nobody declared - reddens ' +
      'the same one',
    [contract(JOIN_STEP, `] as const`)],
    killed([EVERY_STEP_ANSWERED]),
  ),
  sameOnEveryLens(
    'GS-5',
    'a provenance outside the vocabulary the catalogue declares - the part of the specification the ' +
      'compiler holds alone, on a fifth contract. The catalogue says in writing that no test can ' +
      'check a declared provenance; this measures the consequence rather than restating it',
    [edgeCases(THE_EMPTY_STRING_CASE, THE_EMPTY_STRING_CASE.replace(`'specified'`, `'assumed'`))],
    killedByTypecheck,
  ),
  sameOnEveryLens(
    'GS-6',
    'the decision block 4.1 puts in front, specified the way the ecosystem answers it: Japanese ' +
      'text slugging to the empty string, which is what two of the four measured libraries do. Two ' +
      'guards go red, and the pair is the point. The case itself goes red, and so does the guard ' +
      'that requires this table to disagree with an ASCII-only alphabet on exactly fifteen rows - ' +
      'because the empty slug *is* the ASCII-only answer, so the row stops being a disagreement. A ' +
      'specification drifting towards the ecosystem takes the measurement refusing the ecosystem ' +
      'with it, and nothing else in the suite would have said so',
    [edgeCases(NON_LATIN_CASE, NON_LATIN_CASE.replace(`expected: '日本語テキスト',`, `expected: '',`))],
    killed([A_NON_LATIN_SCRIPT, ASCII_DIVERGENCE]),
  ),
  sameOnEveryLens(
    'GS-7',
    'one case addressed by another case\'s identifier, so two rows of block 4.4 answer to one name. ' +
      'The plus and the hash are the pair that demonstrates the loss, and under one address they ' +
      'read as one decision. Both rows go on passing, so the catalogue guard and the collision ' +
      'guard are the only things that see it',
    [edgeCases(A_HASH_ID, `    id: 'a-plus-is-not-a-letter',`)],
    killed([EVERY_ID_UNIQUE, COLLISIONS]),
  ),
  sameOnEveryLens(
    'GS-8',
    'a benchmark profile emptied of its samples. The retention assertion beside it passes on an ' +
      'empty list, which is why the emptiness guard is separate rather than a clause of it',
    [contract(PUNCTUATION_SAMPLES, `    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),
  sameOnEveryLens(
    'GS-9',
    'a benchmark profile published with no description. On this contract a profile names a handful ' +
      'of strings and a retention class, and the description is the only thing that says which of ' +
      'the three expensive steps the samples were chosen to exercise',
    [contract(NOTHING_RETAINABLE_DESCRIPTION, `    description: '',`)],
    killed([EVERY_CLASS_AND_DESCRIPTION]),
  ),
  sameOnEveryLens(
    'GS-10',
    'a benchmark sample that answers the opposite of what its profile is named for: a title with ' +
      'spaces and case in the profile that claims every sample is already a slug. It is the defect ' +
      '`number/parse@1` shipped and this guard exists to catch, reintroduced on a fifth vocabulary ' +
      '- and it is the defect this contract\'s own block 4.5 shipped on its first run, where three ' +
      'profiles out of six named a retention their samples did not have',
    [
      contract(
        ALREADY_A_SLUG_SAMPLES,
        `    samples: ['Already A Slug', 'creme-brulee', \`\${repeated('very-long-slug-', 60)}end\`],`,
      ),
    ],
    killed([ALREADY_A_SLUG_PROFILE]),
  ),
  sameOnEveryLens(
    'GS-11',
    'the declared output alphabet widened to admit the underscore, while the implementation goes ' +
      'on never emitting one. It survives, and that is the finding this battery reports rather ' +
      'than repairs: the alphabet is checked in one direction only. Every property asks whether an ' +
      'answer falls outside the declared alphabet, and nothing asks whether the declared alphabet ' +
      'is wider than the answers need - so a contract can promise a larger surface than it keeps, ' +
      'and a caller who escapes on the strength of that promise is escaping more than they have to. ' +
      'The same hole would admit any character; the underscore is chosen because it is the one ' +
      'readers actually ask for',
    [
      contract(
        ALPHABET_PATTERN,
        `  pattern: /^[\\p{L}\\p{M}\\p{Nd}_]+(?:-[\\p{L}\\p{M}\\p{Nd}_]+)*$/u,`,
      ),
    ],
    survived,
  ),
  sameOnEveryLens(
    'GS-12',
    'one row rewritten onto another row\'s text, so block 4.4 settles the same call twice. Both ' +
      'rows keep their own identifiers and their own answers, and both are right, so nothing but ' +
      'the guard about the table sees that one of the two decisions has stopped being made',
    [edgeCases(A_PLUS_CASE, `    id: 'a-plus-is-not-a-letter',\n    text: 'C#',\n    expected: 'c',`)],
    killed([EVERY_TEXT_ONCE]),
  ),
  sameOnEveryLens(
    'GS-13',
    'the collision that demonstrates the loss, specified away: the hash becomes a text that slugs ' +
      'to something of its own, so the pair block 4.1 points at stops being a pair. The case still ' +
      'passes and the table still reads as a table; what is gone is the only executable ' +
      'demonstration that this function is not injective, and `lossiness` becomes a sentence a ' +
      'reader has to believe',
    [
      edgeCases(
        A_HASH_CASE,
        `    id: 'a-hash-is-not-a-letter',\n    text: 'C sharp',\n    expected: 'c-sharp',`,
      ),
    ],
    killed([COLLISIONS]),
  ),
]

export const battery: Battery = {
  name: 'string-slugify-spec',
  contractPath: 'contracts/string/slugify',
  timeZone: 'UTC',
  calibrationMutant: 'GS-1',

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
  ],

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the contract\'s declarations. This battery ' +
        'injects into `contract.ts` and `edge-cases.ts`, and none of these reads either: the ' +
        'properties quantify over answers this battery does not change, and the arbitrary ' +
        'preconditions measure generators declared in their own file. The reference battery ' +
        'witnesses every one of them.',
      guards: [
        'p1-two-spellings-one-slug',
        'p2-idempotence',
        'p3-no-absorbable-mark',
        'p5-discarded-characters-are-interchangeable',
        'p6-a-letter-or-a-digit-answers',
        'p7-a-slug-is-a-fixed-point',
        'p8-one-separator-per-gap',
        'determinism',
        'no-ambient-input-from-history',
        'support-the-stacks-reach-the-hidden-base',
        'support-the-gaps-carry-a-sigma',
        'support-the-texts-reach-every-region',
      ],
    },
  ],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'the type block, which a specification mutant can reach and none of these does. Rewriting ' +
        '`Slugify` in `contract.ts` would redden all five, and this battery carries no such mutant ' +
        'because the four signature defects of the reference battery already measure what each of ' +
        'them catches. What is missing is a mutant, not a guard.',
      guards: [
        'signature-is-the-declared-type',
        'signature-accepts-one-string',
        'signature-returns-a-string',
        'signature-refuses-no-argument',
        'signature-refuses-options',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the two guards that read the declared alphabet. GS-11 widens it and both go on passing, ' +
        'which is that mutant\'s finding: the alphabet is checked in one direction only. A mutant ' +
        'that narrowed it would redden them, and this battery does not carry one.',
      guards: [
        'p4-the-declared-alphabet',
        'support-the-slugs-are-well-formed',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the cases of block 4.4 no mutant here rewrites. Every one is reachable - GS-6 and GS-13 ' +
        'are the proof - and each of the rest would need its own mutant to say the same sentence ' +
        'about a different row. What is missing is a mutant, not a case.',
      guards: [
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
        // GS-12 and GS-13 rewrite these two rows and neither reddens: both mutants leave a row
        // that still answers what it claims, which is the whole point of each of them. What they
        // redden is the guard about the table, not the case.
        'a-plus-is-not-a-letter',
        'a-hash-is-not-a-letter',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the five benchmark profiles GS-8, GS-9 and GS-10 leave alone. Each publishes a claim about ' +
        'how much of its input survives, and one mutant per profile would repeat one sentence six ' +
        'times.',
      guards: [
        'profile-ascii-prose',
        'profile-latin-diacritics',
        'profile-other-writing-systems',
        'profile-punctuation-heavy',
        'profile-nothing-retainable',
      ],
    },
  ],

  mutants,
}
