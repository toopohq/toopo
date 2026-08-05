/**
 * The battery over `toopo remove`, the listing beside it, and the two holes a removal found in
 * `update`.
 *
 * It is the sixteenth, and the fourth to inject into `cli/`. **It is also the only one over a command
 * that deletes somebody's files**, which changes what a green suite is worth here: every other command
 * in this folder fails by refusing to do something, and this one can fail by doing too much, silently,
 * to a project that then looks exactly as it should.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **Removing more than was asked for.** Three ways: taking out a feature another root still imports,
 * taking out one the user never asked for, and demoting every entry instead of the one named. Each
 * leaves a project that compiles until the import that is gone is reached.
 *
 * **The version the remaining roots are planned at.** A removal decides which files leave by
 * re-planning what stays, so planning that at *today's* publication rather than at the one the lockfile
 * records decides from a graph the files on disk are not - and a dependency the installed version still
 * imports gets planned away. R-04 is that one edit, and it is the reason `bindingAt` exists.
 *
 * **The shared file whose carrier leaves.** `trim.ts` is carried by two features that depend on nothing
 * and know nothing about each other, so a plan over both writes it once and repoints the other. Take
 * the carrier out and it has to move into the folder of whoever still holds it. R-06 and R-07 are the
 * two halves of that, and the second is the one that would delete a copy the user had edited.
 *
 * **What the reader is told when nothing goes.** A feature that stays because something else imports it
 * is the answer that decides whether somebody trusts this command, and it is indistinguishable from a
 * failure unless the screen says so. R-08 and R-09 take that sentence away.
 *
 * **The listing.** `toopo list` hashes the disk rather than reading `locallyModified`, which is the one
 * thing that makes it a report about the project instead of a report about our own bookkeeping.
 *
 * ---------------------------------------------------------------------------
 * What is not measured here, and why
 * ---------------------------------------------------------------------------
 *
 * **`somethingIsHeldBack`.** A removal is what found the missing half of it - a feature held back by an
 * edit *while leaving* was in nobody's plan, so its dependencies were taken out underneath the code it
 * left behind - but the line is `cli-update`'s region and it has a mutant there. Splitting a region
 * across two batteries is how two batteries come to disagree about who probes what.
 *
 * **That a removal needs no registry to take out a project's last root.** It is a guard that counts
 * calls, and what it measures is an absence: no edit to a body can produce a call that is not made.
 * The measurement it replays - 8 of 64 removals over both graphs reach the registry not at all - is a
 * fact about the graphs rather than about this code.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'R', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const removeFile = (find: string, replace: string) => ({ file: 'remove.ts', find, replace })
const reconcileFile = (find: string, replace: string) => ({ file: 'reconcile.ts', find, replace })
const listFile = (find: string, replace: string) => ({ file: 'list.ts', find, replace })
const reportFile = (find: string, replace: string) => ({ file: 'report.ts', find, replace })
const argumentsFile = (find: string, replace: string) => ({ file: 'arguments.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

/**
 * Whether it stays is read off the list that names who keeps it, and the anchor moved with it.
 *
 * It used to ask the planned features and then name the keepers from `reachedBy` - two lists that
 * agree by construction and were consulted separately, which is how an empty `stillReachedBy` reached
 * the screen that names what imports it and had only a `something else` fallback to name.
 */
const A_FEATURE_STILL_REACHED_STAYS = `  if (stillReachedBy.length === 0) {`

const WHAT_WAS_NEVER_ASKED_FOR_IS_REFUSED = `  if (!named.feature.askedFor) {`

const ONLY_THE_ONE_NAMED_IS_DEMOTED = `    renderContract(feature.contract) === renderContract(named)`

const DEMOTING_CLEARS_THE_FLAG = `      ? { ...feature, askedFor: false }`

const THE_REMAINING_ROOTS_ARE_BOUND_AS_RECORDED = `    boundAs: 'as-the-lockfile-records-it',`

const A_DEDUPLICATED_COPY_IS_FOUND = `      if (written.has(file.path)) continue`

/**
 * Three lines rather than one, because an anchor is matched as a substring and the same expression
 * lives in `leavingFeatures` under four more spaces of indentation - so the one-line form matched twice
 * and the instrument refused it. Two features of one contract answering one question about different
 * data is the catalogue's own rule for keeping them apart; here it is why an anchor needs its opening
 * brace.
 */
const AN_EDITED_COPY_IS_NOT_TAKEN = `      held.push({
        path: file.path,
        verdict: onDisk === file.sha256 ? 'removed' : 'kept-orphan',`

const A_ROOT_IS_WHAT_REACHES = `        holders.push(root.contract)`

const EVERY_CLAIMED_FILE_MISSING = `    claimed.every(`

const A_FEATURE_THAT_STAYS_HAS_ITS_OWN_SCREEN = `  if (removal.departure === 'stays-as-a-dependency') {`

const A_SENTENCE_NAMES_THEM_ALL = `  return names.length <= 1`

const THE_LISTING_HASHES_THE_DISK = `  return onDisk === file.sha256 ? 'as-written' : 'edited'`

const A_MISSING_FILE_IS_NAMED = `  if (onDisk === null) return 'missing'`

const THE_UP_TO_DATE_SCREEN_NAMES_EVERY_FEATURE = `      update.features.map(`

const INIT_SAYS_WHAT_TO_COMMIT = `    ...paragraph(whatToCommit(configuration)).map((line) => \`\${INDENT}\${line}\`),`

const REMOVE_TAKES_THE_ACCEPTANCE = `    const read = contractThenFlags('remove', rest, { valued: [], switches: ['apply'] })`

const NO_WORDS_IS_THE_CATALOGUE = `    if (rest.length === 0) return { command: { name: 'catalogue' } }`

const A_PROJECT_WITH_NOTHING_IS_NOT_MISSING_ANYTHING = `    claimed.length > 0 &&`

const A_REFUSAL_NAMES_WHAT_THE_PROJECT_DOES_HOLD = `    const installed = lockfile.features.map((feature) => renderContract(feature.contract))`

const THE_LISTING_SAYS_WHICH_WERE_ASKED_FOR = `    askedFor: feature.askedFor,`

const AN_EMPTY_PROJECT_HAS_ITS_OWN_SCREEN = `  if (listing.features.length === 0) {`

export const mutants: readonly Mutant[] = [
  // -------------------------------------------------------------------------
  // Removing more than was asked for
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-01',
    'takes out a feature another root still imports, because it reads every removal as a departure. ' +
      'The lockfile loses the entry, the folder loses the files, and the root that imports it is left ' +
      'compiling against nothing - the exact failure the demotion answer exists to refuse',
    [removeFile(A_FEATURE_STILL_REACHED_STAYS, `  if (true) {`)],
    killed([
      'a-feature-another-root-still-imports-stays-and-stops-being-a-root',
      'a-feature-that-was-never-asked-for-is-refused-with-what-imports-it',
    ]),
  ),

  sameOnEveryLens(
    'R-02',
    'accepts a removal of something the user never asked for, so `toopo remove string/pad` on a ' +
      'project that holds it only because `number/round` imports it answers as though it were theirs ' +
      'to take back',
    [removeFile(WHAT_WAS_NEVER_ASKED_FOR_IS_REFUSED, `  if (false) {`)],
    killed(['a-feature-that-was-never-asked-for-is-refused-with-what-imports-it']),
  ),

  sameOnEveryLens(
    'R-03',
    'demotes every feature rather than the one that was named, so one `toopo remove` makes the whole ' +
      'project rootless and the next update has nowhere to start',
    [removeFile(ONLY_THE_ONE_NAMED_IS_DEMOTED, `    true`)],
    killed(['only-what-the-removed-feature-alone-pulled-in-goes-with-it']),
  ),

  sameOnEveryLens(
    'R-04',
    'demotes nothing, so the feature stays a root, the plan keeps holding it, and the command reports ' +
      'a removal that removed nothing at all',
    [removeFile(DEMOTING_CLEARS_THE_FLAG, `      ? feature`)],
    killed([
      'a-feature-nothing-else-holds-leaves-with-everything-it-pulled-in',
      'only-what-the-removed-feature-alone-pulled-in-goes-with-it',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The version the project is re-planned at
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-05',
    'plans the features that stay at the version the registry serves today rather than the one the ' +
      'lockfile records. It is not merely an update nobody asked for: which files leave is decided ' +
      'from that plan, so a root republished without a dependency, or without a file it used to ' +
      'share, has that file planned away and deleted while the version on disk goes on importing it',
    [
      removeFile(
        THE_REMAINING_ROOTS_ARE_BOUND_AS_RECORDED,
        `    boundAs: 'as-the-registry-serves-it-today',`,
      ),
    ],
    killed([
      'the-features-that-stay-are-planned-at-the-version-the-lockfile-records',
      'a-removal-that-cannot-reach-the-registry-refuses-and-explains',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The shared file whose carrier leaves
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-06',
    'finds no deduplicated copy, so a file a plan stopped writing is left on disk claimed by nothing. ' +
      'It is the state that made a later removal refuse with *it is already there and toopo.lock does ' +
      'not claim it* - about a file toopo had written itself two commands earlier',
    [reconcileFile(A_DEDUPLICATED_COPY_IS_FOUND, `      if (true) continue`)],
    killed(['a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it']),
  ),

  sameOnEveryLens(
    'R-07',
    'deletes a deduplicated copy whatever is in it, so a file the user edited is taken because another ' +
      'folder happens to hold the bytes we once wrote there',
    [
      reconcileFile(
        AN_EDITED_COPY_IS_NOT_TAKEN,
        `      held.push({\n        path: file.path,\n        verdict: 'removed',`,
      ),
    ],
    killed(['a-deduplicated-copy-the-user-edited-is-kept-rather-than-taken']),
  ),

  // -------------------------------------------------------------------------
  // What the reader is told when nothing goes
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-08',
    'renders a feature that stays as an ordinary removal, so the screen shows a report with nothing ' +
      'in it. *I asked to take it out and it is still there* with no sentence anywhere is the exact ' +
      'moment somebody stops trusting a tool',
    [reportFile(A_FEATURE_THAT_STAYS_HAS_ITS_OWN_SCREEN, `  if (false) {`)],
    killed(['a-feature-another-root-still-imports-stays-and-stops-being-a-root']),
  ),

  sameOnEveryLens(
    'R-09',
    'has every feature reach only itself, so the refusal for something the user never asked for names ' +
      'nothing that imports it - which is the difference between an answer they can act on and one ' +
      'they argue with',
    [reconcileFile(A_ROOT_IS_WHAT_REACHES, `        holders.push(implementation.contract)`)],
    killed(['a-feature-that-was-never-asked-for-is-refused-with-what-imports-it']),
  ),

  sameOnEveryLens(
    'R-10',
    'names only the last of the features a refusal lists, so a reader with two dependents is told ' +
      'about one and removes the wrong thing',
    [removeFile(A_SENTENCE_NAMES_THEM_ALL, `  return names.length <= 99`)],
    killed(['a-feature-that-was-never-asked-for-is-refused-with-what-imports-it']),
  ),

  // -------------------------------------------------------------------------
  // The listing, and what it is asked
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-11',
    'reports every file as written, so the one command that can tell somebody what they have changed ' +
      'answers that they have changed nothing',
    [listFile(THE_LISTING_HASHES_THE_DISK, `  return 'as-written'`)],
    killed(['the-listing-hashes-the-disk-rather-than-reading-what-we-recorded']),
  ),

  sameOnEveryLens(
    'R-12',
    'calls a file that is gone one that is as it was written, so a project missing half its code reads ' +
      'as a project in perfect order',
    [listFile(A_MISSING_FILE_IS_NAMED, `  if (onDisk === null) return 'as-written'`)],
    killed(['a-file-that-is-gone-is-named-with-what-puts-it-back']),
  ),

  // -------------------------------------------------------------------------
  // The three small gaps
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-13',
    'says the folder is not committed as soon as one file is missing, so deleting a single file - ' +
      'which is a thing people do - is answered with a paragraph about version control',
    [reconcileFile(EVERY_CLAIMED_FILE_MISSING, `    claimed.some(`)],
    killed(['one-file-missing-is-not-a-folder-nobody-committed']),
  ),

  sameOnEveryLens(
    'R-14',
    'answers `Nothing to do` without naming a single feature, which is the measured gap `toopo list` ' +
      'was written for: the one command that knows what the project holds refusing to say it',
    [reportFile(THE_UP_TO_DATE_SCREEN_NAMES_EVERY_FEATURE, `      [].map(`)],
    killed(['a-registry-that-has-not-moved-changes-nothing']),
  ),

  sameOnEveryLens(
    'R-15',
    'drops the line saying what to commit, so the trap closes at the symptom and never at the moment ' +
      'the folder is being chosen',
    [reportFile(INIT_SAYS_WHAT_TO_COMMIT, `    ...[],`)],
    killed(['an-init-says-what-has-to-be-committed']),
  ),

  sameOnEveryLens(
    'R-16',
    'lets `toopo remove` write without being asked twice, which is `THE_WRITE_DISCIPLINE` given away ' +
      'on the one command that deletes',
    [
      argumentsFile(
        REMOVE_TAKES_THE_ACCEPTANCE,
        `    const read = contractThenFlags('remove', rest, { valued: [], switches: [] })`,
      ),
    ],
    killed(['remove-writes-only-when-it-is-asked-to']),
  ),

  sameOnEveryLens(
    'R-17',
    'refuses `toopo search` with no words again, which answers "you must already know what you are ' +
      'looking for" to the first question anybody asks',
    [
      argumentsFile(
        NO_WORDS_IS_THE_CATALOGUE,
        `    if (rest.length === 0) return { faults: ['nothing to look for'] }`,
      ),
    ],
    killed(['a-command-that-takes-nothing-is-read-and-refuses-an-argument']),
  ),

  sameOnEveryLens(
    'R-18',
    'never says the folder is not committed, so the one trap whose victim has no way to reach its ' +
      'cause is repaired perfectly and silently, and the next person to clone meets it again',
    [reconcileFile(A_PROJECT_WITH_NOTHING_IS_NOT_MISSING_ANYTHING, `    false &&`)],
    killed(['every-file-missing-at-once-says-the-folder-is-not-committed']),
  ),

  sameOnEveryLens(
    'R-19',
    'refuses a name the project does not hold without saying what it does hold, which is the useful ' +
      'half: somebody typing a name that is not there has misremembered it, and what they want back is ' +
      'the one they meant',
    [
      removeFile(
        A_REFUSAL_NAMES_WHAT_THE_PROJECT_DOES_HOLD,
        `    const installed: readonly string[] = []`,
      ),
    ],
    killed(['a-name-the-project-does-not-hold-is-refused-with-what-it-does']),
  ),

  sameOnEveryLens(
    'R-20',
    'reports every installed feature as one the user asked for, so the listing cannot tell a root from ' +
      'a dependency - which is the one fact `toopo remove` refuses on and the whole reason to read it',
    [listFile(THE_LISTING_SAYS_WHICH_WERE_ASKED_FOR, `    askedFor: true,`)],
    killed(['every-installed-feature-is-named-with-whether-it-was-asked-for']),
  ),

  /**
   * The last of the twenty-five guards this unit added to have never been red anywhere.
   *
   * It was declared unprobed by all four batteries of this folder, which the instrument accepts - and
   * a declared silence nobody can reach is exactly what a decorative guard looks like from the inside.
   * It is one edit away from being witnessed, so it is witnessed.
   */
  sameOnEveryLens(
    'R-21',
    'prints a project holding nothing as a project with nothing to say - `0 features · 0 files` and ' +
      'two commands to type, which leaves the reader unsure whether anything ran',
    [reportFile(AN_EMPTY_PROJECT_HAS_ITS_OWN_SCREEN, `  if (false) {`)],
    killed(['a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen']),
  ),
]

export const battery: Battery = {
  name: 'cli-remove',
  contractPath: 'cli',
  vitestConfig: 'cli/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'R-01',

  arms: [
    {
      id: 'R',
      ref: 'HEAD',
      convention:
        'the way out as committed: what leaves, what stays, what is refused, and what the reader is ' +
        'told when nothing goes',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['R'], edits: [] },
  ],

  mutants,

  unreachableGuards: [],

  /**
   * `cli/` is now one folder measured by four batteries, and this is the three quarters the other
   * three hold.
   *
   * The division follows the commands rather than the files: `cli-install` holds what happens when
   * files arrive in a project that has none, `cli-update` what happens when they arrive on top of
   * files already there, `cli-search` what a query matches, and this what happens when files leave.
   * Every guard below belongs to one of the first three and is probed there.
   *
   * Two of them are worth naming because they look like this battery's and are not.
   * `nothing-is-removed-while-a-feature-is-held-back` is the rule a removal found the missing half of,
   * and its mutant is `cli-update`'s - splitting a region across two batteries is how two batteries
   * come to disagree about who probes what. And `a-dependency-that-left-the-closure-is-removed` is the
   * same arithmetic this battery measures from the other side: there the graph moved, here the user
   * asked.
   */
  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'everything that is not a removal. Installing, updating, diffing, searching, the argument ' +
        'grammar and the two-phase write - a removal reaches the write and the reconciliation and ' +
        'nothing else of it, and the three batteries next door carry eighty-odd defects over exactly ' +
        'these.',
      guards: [
        'a-blob-that-is-not-what-its-address-names-is-refused',
        'a-command-with-no-flag-is-read',
        'a-commit-leaves-no-staged-file-behind',
        'a-commit-writes-the-files-and-the-lockfile-together',
        'a-configuration-round-trips-through-the-file',
        'a-conflicted-feature-is-held-back-whole',
        'a-contract-the-catalogue-refused-is-not-installable',
        'a-corpus-of-real-queries-ranks-the-right-contract-first',
        'a-count-is-read-off-the-lines-it-summarises',
        'a-cut-summary-says-that-it-was-cut',
        'a-dependency-that-left-the-closure-is-removed',
        'a-directory-that-does-not-travel-is-refused',
        'a-directory-where-a-file-goes-is-refused-by-name',
        'a-feature-pulled-in-and-then-asked-for-becomes-a-root',
        'a-feature-that-imports-a-held-back-one-is-held-back-too',
        'a-feature-with-no-dependency-lands-exactly-as-it-was-served',
        'a-field-this-toopo-does-not-honour-is-refused',
        'a-file-already-equal-to-what-we-would-write-is-not-a-conflict',
        'a-file-already-holding-our-bytes-is-claimed-and-not-rewritten',
        'a-file-changed-on-both-sides-is-a-conflict',
        'a-file-that-is-not-json-is-refused-by-name',
        'a-file-that-was-deleted-is-put-back',
        'a-file-the-registry-did-not-change-keeps-your-version',
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
        'a-miss-names-the-words-no-contract-carries',
        'a-missing-final-newline-is-said-rather-than-lost',
        'a-name-the-catalogue-does-not-hold-is-refused',
        'a-path-with-a-space-installs-normally',
        'a-project-that-was-never-initialised-answers-nothing',
        'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name',
        'a-project-with-nothing-in-it-is-configured-rather-than-refused',
        'a-project-with-no-package-json-installs-normally',
        'a-query-the-catalogue-cannot-answer-answers-nothing',
        'a-query-with-no-words-answers-nothing',
        'a-refusal-leaves-no-staged-file-behind',
        'a-refusal-leaves-the-project-exactly-as-it-was',
        'a-refusal-says-nothing-was-written-before-it-says-why',
        'a-refused-commit-does-not-touch-the-file-it-would-replace',
        'a-refused-contract-is-found-with-the-reason-it-was-refused',
        'a-refused-contract-is-in-the-index-and-is-not-installable',
        'a-refused-contract-is-offered-no-install-line',
        'a-removal-leaves-a-folder-that-still-holds-something',
        'a-removal-tidies-the-folder-it-emptied',
        'a-renamed-entry-file-is-repointed',
        'a-repeated-flag-and-a-stray-word-are-refused',
        'a-root-stays-one-when-something-else-pulls-it-in',
        'a-shared-blob-is-repointed-across-features',
        'a-shared-file-is-written-once-and-still-appears-in-the-plan',
        'a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not',
        'a-size-is-read-the-way-a-file-manager-shows-it',
        'a-snapshot-that-is-not-what-its-digest-names-is-refused',
        'a-source-carrying-more-than-the-port-declares-is-refused',
        'a-switch-takes-no-value-and-swallows-nothing',
        'a-version-that-moved-with-no-byte-changing-is-recorded-anyway',
        'a-version-this-toopo-does-not-write-is-refused',
        'a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias',
        'add-with-no-configuration-writes-one-and-says-so',
        'add-with-a-lockfile-and-no-configuration-writes-nothing',
        'an-ignored-folder-is-told-about-instead-of-being-told-to-commit-it',
        'an-installation-is-the-same-with-git-and-without',
        'git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot',
        'add-without-a-contract-is-refused',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-edited-file-is-never-replaced',
        'an-entry-file-is-named-after-its-feature',
        'an-entry-file-is-never-deduplicated',
        'an-import-line-is-printed-ready-to-copy',
        'an-import-line-names-the-diagnostic-beside-the-answer',
        'an-import-of-a-file-this-install-does-not-carry-is-refused',
        'an-import-of-something-outside-the-registry-is-refused',
        'an-installable-contract-carries-no-refusal',
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
        'every-clean-refusal-resolves-to-the-guard-it-names',
        'every-declared-alias-finds-its-own-contract-first',
        'every-feature-the-install-writes-gets-its-own-lockfile-entry',
        'every-method-of-the-port-answers-an-endpoint-that-exists',
        'every-shape-of-import-is-repointed-and-not-only-the-obvious-one',
        'nothing-at-all-is-refused',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
        'nothing-is-removed-while-a-feature-is-held-back',
        'nothing-to-do-is-said-only-when-the-lockfile-does-not-move',
        'only-the-feature-that-was-asked-for-is-a-root',
        'only-the-lines-around-a-change-are-shown',
        're-adding-what-you-asked-for-changes-nothing-and-claims-nothing',
        'reinstalling-what-is-already-there-changes-nothing',
        'remove-without-a-contract-is-refused',
        'the-catalogue-lists-every-contract-and-marks-the-one-it-refuses',
        'the-cost-is-stated-before-the-files',
        'the-cost-is-the-files-the-bytes-and-the-depth',
        'the-diff-op-codes-are-what-node-answers',
        'the-graph-lands-as-a-tree-of-features',
        'the-import-line-follows-the-configured-directory',
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
