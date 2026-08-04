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

const A_FEATURE_STILL_REACHED_STAYS = `  const stays = reconciliation.features.some(`

const WHAT_WAS_NEVER_ASKED_FOR_IS_REFUSED = `  if (!named.feature.askedFor) {`

const ONLY_THE_ONE_NAMED_IS_DEMOTED = `    renderContract(feature.contract) === renderContract(named)`

const DEMOTING_CLEARS_THE_FLAG = `      ? { ...feature, askedFor: false }`

const THE_REMAINING_ROOTS_ARE_BOUND_AS_RECORDED = `    boundAs: 'as-the-lockfile-records-it',`

const A_DEDUPLICATED_COPY_IS_FOUND = `      if (written.has(file.path)) continue`

const AN_EDITED_COPY_IS_NOT_TAKEN = `        verdict: onDisk === file.sha256 ? 'removed' : 'kept-orphan',`

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

export const mutants: readonly Mutant[] = [
  // -------------------------------------------------------------------------
  // Removing more than was asked for
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'R-01',
    'takes out a feature another root still imports, because it reads every removal as a departure. ' +
      'The lockfile loses the entry, the folder loses the files, and the root that imports it is left ' +
      'compiling against nothing - the exact failure the demotion answer exists to refuse',
    [removeFile(A_FEATURE_STILL_REACHED_STAYS, `  const stays = false && reconciliation.features.some(`)],
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
    [reconcileFile(AN_EDITED_COPY_IS_NOT_TAKEN, `        verdict: 'removed',`)],
    killed(['a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it']),
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

  unprobedRegions: [],
}
