/**
 * The battery over `toopo search`: what a query matches, what it must not, and the order.
 *
 * It is the fifteenth, and the third to inject into `cli/`. The other two measure what happens to
 * files; this one measures the only command that touches none - and the one whose failure mode is not
 * a broken project but a lost reader.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **The silence, first and hardest.** A search that always answers something is the one nobody
 * believes twice, and every way of weakening the matching rule produces exactly that: dropping the
 * requirement that every word be answered, letting the set-aside rule run without its bound, letting
 * a query *extend* a word instead of shortening it. Each of those is a defect that looks like a
 * feature from the inside - it finds more - and the negative half is the only thing that can see it.
 *
 * **The order, on the two queries there is any order to have.** Measured: nought of the eighty-nine
 * aliases and corpus queries answers more than one contract, so a comparator defect is invisible to
 * both of those trials. S-06 and S-07 are aimed at the one guard that can see it.
 *
 * **The refused contract.** Losing its refusal, or attaching the catalogue's one refusal to
 * everything, are opposite defects with the same look: a search that says something about
 * installability. Both are written.
 *
 * **What the reader is handed.** An install line under a contract that cannot be installed is the
 * defect reading the first draft of this output caught by eye, so it gets a mutant rather than a
 * memory.
 *
 * ---------------------------------------------------------------------------
 * Four that survive, and what each one measures by surviving
 * ---------------------------------------------------------------------------
 *
 * S-11 to S-14 are declared `survived`, and none of them is a gap. Each is a rule whose effect is
 * unreachable *because of a fact about this catalogue*, and the fact is what the mutant records: a
 * tokeniser applied to both sides cannot be seen from outside; a summary is a sentence and no query
 * covers one; and the address `1` is set aside by a rule written for something else. They are worth
 * more surviving with a reason than deleted, because the reason is about the data and the data will
 * change.
 *
 * Two constants did not survive that treatment and are gone rather than declared. An exactness
 * multiplier moved no result past another at 2 or at 100 - measured on all seven queries this
 * catalogue can order - and a full-query bonus could not either, because nought of eighty-nine
 * aliases and corpus queries answers more than one contract. A number that cannot change an answer at
 * any value is not a rule. **There is no S-08 for that reason**, and the gap is left rather than
 * closed by renumbering, because the identifiers are addresses and a battery's own history is worth
 * one missing number.
 *
 * ---------------------------------------------------------------------------
 * What is not measured, and why the mutant is not written
 * ---------------------------------------------------------------------------
 *
 * **Whether an alias is one somebody would type.** The alias trial proves every declared alias
 * retrieves its own contract first, and no mutant can make it prove more: whether `atoi` is a phrase
 * a JavaScript developer writes is not a fact about this code. It is a judgement about the
 * catalogue, and it is recorded as one.
 *
 * **That `search` reads no project.** It takes a source and a string and returns a value; there is no
 * root, no configuration and no lockfile to remove. A mutant would have to add a parameter, which is
 * not an edit to a body, and the property is held by the signature rather than by a guard.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'S', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const searchFile = (find: string, replace: string) => ({ file: 'search.ts', find, replace })
const reportFile = (find: string, replace: string) => ({ file: 'report.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const EVERY_WORD_MUST_BE_ANSWERED = `  if (answered.length !== words.length && !namedInFull(fields, answered)) return null`

const A_QUERY_ANSWERING_NOTHING_IS_NOT_A_RESULT = `  if (answered.length === 0) return null`

const A_SHORTENING_GOES_ONE_WAY = `  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked))`

const A_PLURAL_IS_ONE_TRAILING_S = `  singular(asked) === singular(held) ||`

const A_SHORT_WORD_IS_NOT_SHORTENED = `  word.length > MINIMUM_PREFIX && word.endsWith('s') ? word.slice(0, -1) : word`

const THE_MINIMUM = `const MINIMUM_PREFIX = 4`

const A_NAME_OUTRANKS_AN_ALIAS = `  name: 100,`

const BEST_FIRST = `        : second.score - first.score,`

const ONLY_A_DELIBERATE_FIELD_IS_NAMED_IN_FULL = `const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>(['name', 'export', 'alias'])`

const THE_NAME_IS_THE_RENDERED_ADDRESS = `    { kind: 'name', text: rendered, words: wordsOf(rendered) },`

const THE_EXPORTS_ARE_A_FIELD = `    ...entry.exports.map((held) => ({`

const THE_ALIASES_ARE_A_FIELD = `    ...entry.searchAliases.map((alias) => ({`

const CAMEL_CASE_IS_SPLIT = `    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')`

/**
 * The refusal moved into `displayed`, which is where the catalogue listing reads it too.
 *
 * Two screens show a contract now - a search result and the whole catalogue - and attaching a
 * refusal to the wrong one is a defect with no symptom, because every result would carry a
 * plausible-looking reason. One of the two would otherwise have to be trusted to have got it right
 * on its own, so the line lives once and this anchor follows it.
 */
const THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT = `  refusal: refusals.find((refusal) => sameContract(refusal.address, entry.address)) ?? null,`

const AN_UNKNOWN_WORD_IS_ONE_NO_ENTRY_ANSWERS = `    entries.every((entry) => bestHit(word, fieldsOf(entry)) === null),`

const A_REFUSED_CONTRACT_IS_OFFERED_NO_INSTALL_LINE = `      ? first.installable
        ? [\`\${INDENT}toopo add \${first.address.name}\`, '']
        : []`

const THE_MARK_SAYS_IT_IS_NOT_INSTALLABLE = `  \`\${INDENT}\${renderContract(result.address)}\${result.installable ? '' : '   not installable'}\`,`

const A_SUMMARY_IS_CUT_RATHER_THAN_DROPPED = `  return [...lines.slice(0, most - 1), \`\${lines[most - 1] as string}...\`]`

export const mutants: readonly Mutant[] = [
  // -------------------------------------------------------------------------
  // The silence: every way of making a search answer more than it should
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-01',
    'drops the rule that every word of the query must be answered, so a contract matches on the ' +
      'words it happens to share - `sort array` answers `array/group-by@1` to somebody looking for a ' +
      'sorter, and eleven of the twenty queries the catalogue cannot answer come back with something',
    [searchFile(EVERY_WORD_MUST_BE_ANSWERED, `  if (false) return null`)],
    killed([
      'a-query-the-catalogue-cannot-answer-answers-nothing',
      'a-refused-contract-is-found-with-the-reason-it-was-refused',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-02',
    'lets a word be set aside without the remainder naming anything in full, which is the same ' +
      'widening arrived at from the other side: the bound is what stops setting a word aside from ' +
      'turning every query into its most forgiving reading',
    [
      searchFile(
        EVERY_WORD_MUST_BE_ANSWERED,
        `  if (answered.length !== words.length && false) return null`,
      ),
    ],
    killed(['a-query-the-catalogue-cannot-answer-answers-nothing']),
  ),

  sameOnEveryLens(
    'S-03',
    'answers a query with no words in it, so `toopo search "   "` is the whole catalogue. **The ' +
      'guard it reddens was written because this mutant survived**: the check is unreachable through ' +
      'the ordinary path - a query whose words are all unanswered already fails the rule above it - ' +
      'and the empty query is the one input that reaches it',
    [searchFile(A_QUERY_ANSWERING_NOTHING_IS_NOT_A_RESULT, `  if (false) return null`)],
    killed(['a-query-with-no-words-answers-nothing']),
  ),

  sameOnEveryLens(
    'S-04',
    'lets a query *extend* a word the catalogue carries instead of only shortening it - the ' +
      'symmetric prefix this file was first written with, which answers `stringify` with all three ' +
      'contracts carrying `string` and `datepicker` with `date/add@1`',
    [
      searchFile(
        A_SHORTENING_GOES_ONE_WAY,
        `  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked)) ||\n` +
          `  (held.length >= MINIMUM_PREFIX && asked.startsWith(held))`,
      ),
    ],
    killed(['a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not']),
  ),

  sameOnEveryLens(
    'S-05',
    'drops the minimum length, so a three-letter word reaches across the catalogue and `add`, `url` ' +
      'and `key` each answer whatever they happen to start',
    [searchFile(THE_MINIMUM, `const MINIMUM_PREFIX = 1`)],
    // Measured rather than predicted: this does *not* widen into the negative half. What it breaks is
    // the corpus, because a one-letter prefix makes some other contract answer first.
    killed([
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
      'every-declared-alias-finds-its-own-contract-first',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The order, on the two queries there is any order to have
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-06',
    'sorts worst first, which is invisible to the alias trial and to the corpus - measured, nought ' +
      'of their eighty-nine queries answers more than one contract - and is the whole reason the ' +
      'ranking guard exists',
    [searchFile(BEST_FIRST, `        : first.score - second.score,`)],
    killed(['a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias']),
  ),

  sameOnEveryLens(
    'S-07',
    'puts an alias above a name, so a word a contract carries in passing outranks the same word in ' +
      'the name of the contract it belongs to',
    [searchFile(A_NAME_OUTRANKS_AN_ALIAS, `  name: 20,`)],
    killed(['a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias']),
  ),

  // -------------------------------------------------------------------------
  // What is searched
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-09',
    'stops searching the aliases, which is the whole of what the catalogue declares about how it ' +
      'expects to be looked for - and the one field this unit exists to make executable',
    [searchFile(THE_ALIASES_ARE_A_FIELD, `    ...[].map((alias: string) => ({`)],
    killed([
      'every-declared-alias-finds-its-own-contract-first',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-10',
    'stops searching the export names, so somebody typing the symbol they already know - ' +
      '`parseNumber`, the name in their editor - is told the catalogue has nothing',
    [searchFile(THE_EXPORTS_ARE_A_FIELD, `    ...[].map((held: { name: string }) => ({`)],
    killed(['a-corpus-of-real-queries-ranks-the-right-contract-first']),
  ),

  sameOnEveryLens(
    'S-11',
    'searches the bare name instead of the rendered address, so `1` in `number/parse@1` is a word ' +
      'nothing carries. **It survives, and the reason is the other rule**: `1` is set aside, and what ' +
      'remains - `number`, `parse` - names the bare name in full, so the query answers anyway. The ' +
      'rendered address changes what the result scores and not whether it is one, and nothing in this ' +
      'catalogue can order it differently. Recorded rather than deleted: the address a tool prints is ' +
      'the address it should match, and the argument for that is not the score.',
    [
      searchFile(
        THE_NAME_IS_THE_RENDERED_ADDRESS,
        `    { kind: 'name', text: rendered, words: wordsOf(entry.address.name) },`,
      ),
    ],
    survived,
  ),

  sameOnEveryLens(
    'S-12',
    'stops splitting camel case. **It survives because the split is applied to both sides**: the ' +
      'query and the field go through one tokeniser, so removing it from the tokeniser removes it ' +
      'from both and they go on agreeing - `groupBy` typed becomes `groupby`, and the alias `groupBy` ' +
      'becomes `groupby` too. What that measures is the catalogue rather than the code: `array/' +
      'group-by@1` declares `group by` *and* `groupBy`, so neither spelling depends on the split. A ' +
      'contract declaring only one of them would, and no mutant here can arrange that.',
    [searchFile(CAMEL_CASE_IS_SPLIT, `    .replace(/([a-z0-9])([A-Z])/g, '$1$2')`)],
    survived,
  ),

  sameOnEveryLens(
    'S-13',
    'lets a summary be what a query names in full. **It survives because no query covers a summary**: ' +
      'naming one in full means typing every word of a sentence, and the shortest of the five is ' +
      'eighty-five characters. The exclusion is a statement about which fields are deliberate, kept ' +
      'because it is one, and its effect is unreachable on any catalogue whose summaries are ' +
      'sentences.',
    [
      searchFile(
        ONLY_A_DELIBERATE_FIELD_IS_NAMED_IN_FULL,
        `const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>([\n` +
          `  'name',\n  'export',\n  'alias',\n  'summary',\n])`,
      ),
    ],
    survived,
  ),

  sameOnEveryLens(
    'S-14',
    'strips a trailing `s` from any word at all, so `is` becomes `i` and `as` becomes `a`. **It ' +
      'survives because neither `i` nor `a` is carried by anything those two queries would then ' +
      'reach**: `a` is a word four summaries hold, so `is` would answer them - and no negative query ' +
      'here contains `is` without another word that already fails. The bound is kept for the same ' +
      'reason a bound is always kept, and what this records is that the catalogue does not currently ' +
      'contain the input that would show it.',
    [
      searchFile(
        A_SHORT_WORD_IS_NOT_SHORTENED,
        `  word.endsWith('s') ? word.slice(0, -1) : word`,
      ),
    ],
    survived,
  ),

  sameOnEveryLens(
    'S-15',
    'stops reading a plural as its singular, so `arrays`, `numbers` and `dates` answer nothing - a ' +
      'search that is right about every word it was written for and wrong about how people type',
    [searchFile(A_PLURAL_IS_ONE_TRAILING_S, `  false ||`)],
    killed(['a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not']),
  ),

  // -------------------------------------------------------------------------
  // The refused contract, and the line the reader is handed
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-16',
    'attaches whatever refusal the registry holds to every result, so four installable contracts ' +
      'come back carrying an argument against a fifth',
    [searchFile(THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT, `  refusal: refusals[0] ?? null,`)],
    killed(['an-installable-contract-carries-no-refusal']),
  ),

  sameOnEveryLens(
    'S-17',
    'drops the refusal from every result, so `Map.groupBy` answers a contract marked not ' +
      'installable and says nothing about why - which tells the reader the catalogue has no opinion, ' +
      'where publishing the opinion is the point',
    [searchFile(THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT, `  refusal: null,`)],
    killed(['a-refused-contract-is-found-with-the-reason-it-was-refused']),
  ),

  sameOnEveryLens(
    'S-18',
    'names as unknown every word of the query rather than the ones no contract carries, so a miss ' +
      'that should point at one word points at all of them',
    // Two earlier spellings of this mutant measured nothing. The first dropped the parameter and left
    // the body reading it, which threw and reddened seven guards - a mutant that breaks the module
    // says nothing about the decision it was aimed at. The second filtered on `true` first, which is
    // the same function. This one keeps every word, which is the defect.
    [
      searchFile(
        AN_UNKNOWN_WORD_IS_ONE_NO_ENTRY_ANSWERS,
        `    entries.every((entry) => bestHit(word, fieldsOf(entry)) !== undefined),`,
      ),
    ],
    killed(['a-miss-names-the-words-no-contract-carries']),
  ),

  sameOnEveryLens(
    'S-19',
    'offers `toopo add` under a contract it has just called not installable - the command refuses ' +
      'when the reader runs it, and this is the defect reading the first draft of the output caught ' +
      'by eye',
    [
      reportFile(
        A_REFUSED_CONTRACT_IS_OFFERED_NO_INSTALL_LINE,
        `      ? [\`\${INDENT}toopo add \${first.address.name}\`, '']`,
      ),
    ],
    killed(['a-refused-contract-is-offered-no-install-line']),
  ),

  sameOnEveryLens(
    'S-20',
    'stops marking a refused contract, so the one result the catalogue will not serve looks exactly ' +
      'like the four it will',
    [reportFile(THE_MARK_SAYS_IT_IS_NOT_INSTALLABLE, `  \`\${INDENT}\${renderContract(result.address)}\`,`)],
    killed(['a-refused-contract-is-offered-no-install-line']),
  ),

  sameOnEveryLens(
    'S-21',
    'drops the rest of a summary instead of marking that it was cut, so a sentence ends mid-thought ' +
      'and reads as the whole of what the contract claims',
    [reportFile(A_SUMMARY_IS_CUT_RATHER_THAN_DROPPED, `  return lines.slice(0, most)`)],
    killed(['a-cut-summary-says-that-it-was-cut']),
  ),
]

export const battery: Battery = {
  name: 'cli-search',
  contractPath: 'cli',
  vitestConfig: 'cli/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'S-01',

  arms: [
    {
      id: 'S',
      ref: 'HEAD',
      convention:
        'the search command as committed: what a query matches, what it must not, the order, and ' +
        'the screen the reader gets',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['S'], edits: [] },
  ],

  mutants,

  unreachableGuards: [],

  /**
   * `cli/` is now one folder measured by four batteries, and this is the three quarters the other
   * three hold.
   *
   * `toopo remove` and `toopo list` added twenty-five guards and **all twenty-four that touch a
   * project are here**, which is the cleanest division of the four: the other two batteries each
   * absorbed most of that unit, because a removal parses through the same grammar and plans through
   * the same arithmetic. A query does neither. The one guard of that unit which is *not* here is the
   * catalogue listing, and it is not here because this battery reddens it - `toopo search` with no
   * words is a search command, whatever it answers.
   *
   * The division is clean because `search` shares nothing with them: it writes no file, reads no
   * project, and touches neither the plan nor the lockfile. Every guard below is over something a
   * query cannot reach, and every one of them is probed by `cli-install` or `cli-update`, which is
   * what makes this a declaration of division rather than a debt.
   *
   * The two guards of the argument grammar that `search` added are the exception, and they are not
   * here: S-22 and S-23 would be their mutants, and the reason they are not written is that the
   * grammar is `cli-install`'s region and splitting a region across batteries is how two batteries
   * come to disagree about who probes what.
   */
  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'everything that touches a project. Installing, updating, diffing, staging, renaming, the ' +
        'lockfile and what a plan does with a shared file - a query reaches none of it, and the two ' +
        'batteries next door carry sixty-six defects over exactly these. `search` is the one command ' +
        'that reads no project, so the division needs no argument beyond that sentence.',
      guards: [
        'a-blob-that-is-not-what-its-address-names-is-refused',
        'a-command-that-takes-nothing-is-read-and-refuses-an-argument',
        'a-command-with-no-flag-is-read',
        'a-commit-leaves-no-staged-file-behind',
        'a-commit-writes-the-files-and-the-lockfile-together',
        'a-configuration-round-trips-through-the-file',
        'a-conflicted-feature-is-held-back-whole',
        'a-contract-the-catalogue-refused-is-not-installable',
        'a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it',
        'a-count-is-read-off-the-lines-it-summarises',
        'a-deduplicated-copy-the-user-edited-is-kept-rather-than-taken',
        'a-dependency-that-left-the-closure-is-removed',
        'a-directory-that-does-not-travel-is-refused',
        'a-directory-where-a-file-goes-is-refused-by-name',
        'a-feature-another-root-still-imports-stays-and-stops-being-a-root',
        'a-feature-nothing-else-holds-leaves-with-everything-it-pulled-in',
        'a-feature-pulled-in-and-then-asked-for-becomes-a-root',
        'a-feature-that-imports-a-held-back-one-is-held-back-too',
        'a-feature-that-was-never-asked-for-is-refused-with-what-imports-it',
        'a-feature-with-no-dependency-lands-exactly-as-it-was-served',
        'a-field-this-toopo-does-not-honour-is-refused',
        'a-file-already-equal-to-what-we-would-write-is-not-a-conflict',
        'a-file-already-holding-our-bytes-is-claimed-and-not-rewritten',
        'a-file-changed-on-both-sides-is-a-conflict',
        'a-file-that-is-gone-is-named-with-what-puts-it-back',
        'a-file-that-is-not-json-is-refused-by-name',
        'a-file-that-was-deleted-is-put-back',
        'a-file-the-registry-did-not-change-keeps-your-version',
        'a-file-the-user-edited-is-not-deleted-by-a-removal',
        'a-file-toopo-did-not-write-is-never-overwritten-by-an-update',
        'a-file-we-did-not-write-is-never-overwritten',
        'a-file-where-a-folder-must-go-is-refused-with-nothing-staged',
        'a-flag-and-its-value-are-read',
        'a-flag-with-no-value-is-refused',
        'a-held-back-feature-keeps-its-lockfile-entry-exactly',
        'a-held-back-feature-says-so-before-it-says-anything-else',
        'a-hunk-header-counts-the-lines-it-covers',
        'a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk',
        'a-line-only-the-first-text-has-is-a-minus',
        'a-line-only-the-second-text-has-is-a-plus',
        'a-line-says-what-was-done-to-that-file',
        'a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run',
        'a-lockfile-with-no-root-has-nowhere-to-start',
        'a-missing-final-newline-is-said-rather-than-lost',
        'a-name-the-catalogue-does-not-hold-is-refused',
        'a-name-the-project-does-not-hold-is-refused-with-what-it-does',
        'a-path-with-a-space-installs-normally',
        'a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen',
        'a-project-that-was-never-initialised-answers-nothing',
        'a-project-with-no-package-json-installs-normally',
        'a-refusal-leaves-no-staged-file-behind',
        'a-refusal-leaves-the-project-exactly-as-it-was',
        'a-refusal-says-nothing-was-written-before-it-says-why',
        'a-refused-commit-does-not-touch-the-file-it-would-replace',
        'a-refused-contract-is-in-the-index-and-is-not-installable',
        'a-registry-that-has-not-moved-changes-nothing',
        'a-removal-leaves-a-folder-that-still-holds-something',
        'a-removal-shows-and-writes-nothing-until-it-is-applied',
        'a-removal-that-cannot-reach-the-registry-refuses-and-explains',
        'a-removal-tidies-the-folder-it-emptied',
        'a-renamed-entry-file-is-repointed',
        'a-repeated-flag-and-a-stray-word-are-refused',
        'a-root-stays-one-when-something-else-pulls-it-in',
        'a-shared-blob-is-repointed-across-features',
        'a-shared-file-is-written-once-and-still-appears-in-the-plan',
        'a-shared-file-moves-into-the-folder-of-a-carrier-that-stays',
        'a-size-is-read-the-way-a-file-manager-shows-it',
        'a-snapshot-that-is-not-what-its-digest-names-is-refused',
        'a-source-carrying-more-than-the-port-declares-is-refused',
        'a-switch-takes-no-value-and-swallows-nothing',
        'a-version-that-moved-with-no-byte-changing-is-recorded-anyway',
        'a-version-this-toopo-does-not-write-is-refused',
        'add-before-init-says-what-to-run',
        'add-without-a-contract-is-refused',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-edit-that-keeps-a-leaving-feature-keeps-what-it-imports-too',
        'an-edited-file-is-never-replaced',
        'an-entry-file-is-named-after-its-feature',
        'an-entry-file-is-never-deduplicated',
        'an-import-line-is-printed-ready-to-copy',
        'an-import-line-names-the-diagnostic-beside-the-answer',
        'an-import-of-a-file-this-install-does-not-carry-is-refused',
        'an-import-of-something-outside-the-registry-is-refused',
        'an-init-says-what-has-to-be-committed',
        'an-installed-file-imports-what-was-installed',
        'an-unchanged-specifier-is-left-alone',
        'an-unknown-command-and-an-unknown-flag-are-refused',
        'an-unreadable-lockfile-stops-the-install',
        'an-update-keeps-the-implementation-the-lockfile-names',
        'an-update-writes-the-bytes-the-registry-now-serves',
        'applying-an-update-twice-changes-nothing-the-second-time',
        'each-of-the-five-installs-one-file-named-after-itself',
        'each-side-says-for-itself-that-it-has-no-final-newline',
        'every-breakage-is-classified',
        'every-feature-the-install-writes-gets-its-own-lockfile-entry',
        'every-file-missing-at-once-says-the-folder-is-not-committed',
        'every-installed-feature-is-named-with-whether-it-was-asked-for',
        'every-method-of-the-port-answers-an-endpoint-that-exists',
        'every-shape-of-import-is-repointed-and-not-only-the-obvious-one',
        'nothing-at-all-is-refused',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
        'nothing-is-removed-while-a-feature-is-held-back',
        'nothing-to-do-is-said-only-when-the-lockfile-does-not-move',
        'one-file-missing-is-not-a-folder-nobody-committed',
        'only-the-feature-that-was-asked-for-is-a-root',
        'only-the-lines-around-a-change-are-shown',
        'only-what-the-removed-feature-alone-pulled-in-goes-with-it',
        're-adding-what-you-asked-for-changes-nothing-and-claims-nothing',
        'reinstalling-what-is-already-there-changes-nothing',
        'remove-without-a-contract-is-refused',
        'remove-writes-only-when-it-is-asked-to',
        'taking-out-the-last-root-asks-the-registry-nothing',
        'the-cost-is-stated-before-the-files',
        'the-cost-is-the-files-the-bytes-and-the-depth',
        'the-diff-op-codes-are-what-node-answers',
        'the-features-that-stay-are-planned-at-the-version-the-lockfile-records',
        'the-graph-lands-as-a-tree-of-features',
        'the-import-line-follows-the-configured-directory',
        'the-listing-hashes-the-disk-rather-than-reading-what-we-recorded',
        'the-local-source-binds-a-visibly-unpublished-version',
        'the-lockfile-holds-what-was-served-and-what-was-written',
        'the-plan-is-in-the-resolutions-order',
        'the-port-answers-every-need-behind-it-and-nothing-else',
        'the-proposed-directory-follows-the-shape-of-the-project',
        'the-three-spellings-of-one-file-all-resolve',
        'the-updated-lockfile-holds-what-was-served-and-what-was-written',
        'the-users-tsconfig-is-never-read',
        'the-ways-out-are-offered-only-where-the-reader-put-something',
        'two-changes-far-apart-are-two-hunks',
        'two-different-files-on-one-destination-are-refused',
        'two-identical-texts-have-nothing-to-show',
        'two-versions-of-one-feature-are-refused',
        'two-versions-of-one-feature-are-refused-before-anything-is-written',
        'update-writes-only-when-it-is-asked-to',
      ],
    },
  ],
}
