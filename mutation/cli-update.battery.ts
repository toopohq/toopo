/**
 * The battery over `toopo update`, the diff it shows and the two-phase write underneath it.
 *
 * It is the fourteenth, and the second to inject into `cli/`. `cli-install` measures what happens when
 * files arrive in a project that has none; this measures what happens when they arrive on top of files
 * that are already there, some of which the user has edited - which is the command permanent rule 4 is
 * about and the only one where getting it wrong destroys work rather than refusing to do any.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **The diff, and one defect in particular.** An inverted diff has the right files, the right line
 * numbers, the right counts and the right hunks; every guard about shape passes on it. What it does is
 * tell somebody that a line they are about to gain is a line they are about to lose, in the one screen
 * where they decide. Node's own documentation invites the mistake - it calls `-1` *delete* where `-1`
 * marks what is only in the *second* argument - so U-01 is that reading, injected.
 *
 * **Which of six things a file is.** Two questions decide it - does this have to change, did the user
 * change it - and every way of getting the four combinations wrong destroys something different: an
 * overwritten edit, a refused update, a conflict declared on a file nobody touched.
 *
 * **What is held back, and what is not removed.** A conflict holds a whole feature, a dependent of a
 * held-back feature is held back with it, and nothing is removed at all while anything is held - the
 * last of which was found by reading the report rather than the code, so it gets a mutant of its own.
 *
 * **The two phases of a write.** A refusal that leaves half a project behind, staged files that
 * survive a refusal, a destination whose kind is not asked about.
 *
 * **The line the user copies.** The extension, the configured directory, and the diagnostic that
 * ships beside the answer.
 *
 * ---------------------------------------------------------------------------
 * What is not measured, and why the mutant is not written
 * ---------------------------------------------------------------------------
 *
 * **The order the lockfile is renamed in.** It is renamed last so that an interruption always resolves
 * backwards - the lockfile describing the old install rather than one that never happened. Observing
 * it means killing the process between two renames, which no guard in a vitest suite can do, so a
 * mutant that moved the rename would survive. It is declared here rather than written, and the thing
 * that makes the window survivable at all - `already-written` - is measured by U-12.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'U', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const diffFile = (find: string, replace: string) => ({ file: 'diff.ts', find, replace })
const writeFile = (find: string, replace: string) => ({ file: 'write.ts', find, replace })
const updateFile = (find: string, replace: string) => ({ file: 'update.ts', find, replace })
const reportFile = (find: string, replace: string) => ({ file: 'report.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const THE_FIRST_CODE = `export const ONLY_IN_THE_FIRST = 1`

const THE_SECOND_CODE = `export const ONLY_IN_THE_SECOND = -1`

const THREE_LINES_OF_CONTEXT = `export const CONTEXT = 3`

const A_CHANGE_IS_WIDENED_AFTER = `    const to = Math.min(marked.length - 1, at + context)`

const A_HEADER_COUNTS_FROM_ONE = `  const beforeStart = beforeCount === 0 ? first.before : first.before + 1`

const A_FINAL_NEWLINE_IS_NOTICED = `  const complete = lines.at(-1) === ''`

const A_MARKER_FORCES_ITS_HUNK = `    if (entry.mark === ' ' && !shown.has(entry)) continue`

const A_MARKER_NEEDS_A_DISAGREEMENT = `  if (first.complete !== second.complete) {`

const THE_COUNTS_ARE_READ_OFF_THE_MARKS = `    added: marked.filter((entry) => entry.mark === '+').length,`

const A_FILE_IS_STAGED_BESIDE_ITS_DESTINATION = `    const temporary = \`\${destination}\${STAGED}\``

const A_REFUSAL_UNSTAGES = `    for (const entry of staged) rmSync(entry.temporary, { force: true })`

const THE_DESTINATION_KIND_IS_ASKED = `  if (existsSync(full) && statSync(full).isDirectory()) {`

const AN_EMPTIED_FOLDER_IS_TIDIED = `  while (at.startsWith(root) && at !== root) {`

const A_FOLDER_IS_ONLY_REMOVED_WHEN_EMPTY = `        rmdirSync(folder)`

const THE_LOCKFILE_IS_STAGED_TOO = `      writeLockfile(root, what.lockfile, lockfileTemporary)`

const AN_UNTOUCHED_FILE_IS_UPDATED = `  if (mustChange && !wasEdited) return 'updated'`

const WHAT_WE_WOULD_WRITE_IS_NOT_AN_EDIT = `  if (onDisk === wanted) return claimed.sha256 === wanted ? 'unchanged' : 'already-written'`

const AN_UNCHANGED_FILE_THE_USER_EDITED_IS_KEPT = `  return 'kept'`

const HOLDING_BACK_PROPAGATES = `  for (let again = true; again; ) {`

const NOTHING_IS_REMOVED_WHILE_ANYTHING_IS_HELD = `  const somethingIsHeldBack = held.size > 0`

const ONLY_A_ROOT_IS_RESOLVED_FROM = `  const roots = request.lockfile.features.filter((feature) => feature.askedFor)`

const THE_RECORDED_IMPLEMENTATION_IS_KEPT = `    const binding = bindingFor(source, feature.contract, feature.implementation.id)`

const A_PATH_NOBODY_CLAIMS_IS_REFUSED = `  const unclaimed = planned.plan.files`

const THE_INSTANT_MOVES_ONLY_WHEN_SOMETHING_DID = `      installedAt: moved ? request.at : (was as LockedFeature).installedAt,`

const A_HELD_BACK_FEATURE_KEEPS_ITS_ENTRY = `      if (was !== undefined) lockfile = withFeature(lockfile, was)`

const A_LEAVING_FEATURE_IS_REMOVED = `    removals.push(...entry.files.map((file) => file.path))`

const THE_EXTENSION_IS_JAVASCRIPT = `    \`'./\${configuration.directory}/\${entry.path.replace(/\\.ts$/, '.js')}'\``

const EVERY_EXPORT_IS_NAMED = `  \`\${INDENT}import { \${entry.exports.map((held) => held.name).join(', ')} } from \` +`

const ASKED_FOR_IS_STICKY = `    askedFor: feature.askedFor || (held?.askedFor ?? false),`

const ONLY_THE_ROOT_IS_ASKED_FOR = `      askedFor: sameContract(planning.implementation.contract, chosen.found.address),`

const AN_UNCHANGED_INSTALL_STILL_CARRIES_ITS_FEATURES = `    return { unchanged: rootAddress, entry, features }`

// Guards several mutants name, written once because a string repeated is a rename away from being
// wrong twice.
const THE_NOMINAL = 'an-update-writes-the-bytes-the-registry-now-serves'
const THE_CONFLICT = 'a-file-changed-on-both-sides-is-a-conflict'
const THE_LEAVING = 'a-dependency-that-left-the-closure-is-removed'
const THE_HELD_ENTRY = 'a-held-back-feature-keeps-its-lockfile-entry-exactly'
const THE_IMPORT_LINE = 'an-import-line-is-printed-ready-to-copy'
const NO_NEWLINE = 'a-missing-final-newline-is-said-rather-than-lost'

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const mutants: readonly Mutant[] = [
  // -------------------------------------------------------------------------
  // The diff
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-01',
    "reads node's op codes the way node's own documentation reads them, so every diff is inverted - " +
      'a line the user is about to gain is shown as one they are about to lose, on the one screen ' +
      'where they decide whether to accept it',
    [
      diffFile(THE_FIRST_CODE, `export const ONLY_IN_THE_FIRST = -1`),
      diffFile(THE_SECOND_CODE, `export const ONLY_IN_THE_SECOND = 1`),
    ],
    killed([
      'the-diff-op-codes-are-what-node-answers',
      'a-line-only-the-first-text-has-is-a-minus',
      'a-line-only-the-second-text-has-is-a-plus',
    ]),
  ),

  sameOnEveryLens(
    'U-02',
    'shows a change with no lines around it, so the reader gets a `-` and a `+` and no way to see ' +
      'where in the file they are',
    [diffFile(THREE_LINES_OF_CONTEXT, `export const CONTEXT = 0`)],
    killed(['only-the-lines-around-a-change-are-shown', 'a-hunk-header-counts-the-lines-it-covers']),
  ),

  sameOnEveryLens(
    'U-03',
    'stops showing the lines after a change while still showing the ones before it, which reads as ' +
      'a file that ends where the change does',
    [diffFile(A_CHANGE_IS_WIDENED_AFTER, `    const to = at`)],
    killed(['only-the-lines-around-a-change-are-shown', 'a-hunk-header-counts-the-lines-it-covers']),
  ),

  sameOnEveryLens(
    'U-04',
    'counts hunk lines from zero, so every line number in every header is one less than the one the ' +
      "reader's editor shows",
    [diffFile(A_HEADER_COUNTS_FROM_ONE, `  const beforeStart = first.before`)],
    killed(['a-hunk-header-counts-the-lines-it-covers']),
  ),

  sameOnEveryLens(
    'U-05',
    'stops noticing whether a text ended with a newline, so a file that lost its last one is diffed ' +
      'as identical',
    [diffFile(A_FINAL_NEWLINE_IS_NOTICED, `  const complete = true`)],
    killed([NO_NEWLINE]),
  ),

  sameOnEveryLens(
    'U-06',
    'notices the missing newline and then builds no hunk to say it in - the defect this file shipped ' +
      'with, where the difference is carried the whole way and thrown away at the last step',
    [diffFile(A_MARKER_FORCES_ITS_HUNK, `    if (entry.mark === ' ') continue`)],
    killed([NO_NEWLINE]),
  ),

  sameOnEveryLens(
    'U-07',
    'marks a missing final newline even when both texts are missing one, which puts a hunk on two ' +
      'identical files',
    [diffFile(A_MARKER_NEEDS_A_DISAGREEMENT, `  if (true) {`)],
    killed(['each-side-says-for-itself-that-it-has-no-final-newline']),
  ),

  sameOnEveryLens(
    'U-08',
    'counts an added line as a removed one, so the summary beside a file disagrees with the diff ' +
      'underneath it',
    [diffFile(THE_COUNTS_ARE_READ_OFF_THE_MARKS, `    added: marked.filter((entry) => entry.mark === '-').length,`)],
    killed(['a-count-is-read-off-the-lines-it-summarises']),
  ),

  // -------------------------------------------------------------------------
  // The two phases
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-09',
    'writes each file straight to its destination, so a commit that cannot finish leaves a project ' +
      'half changed and nobody to tell which half',
    [writeFile(A_FILE_IS_STAGED_BESIDE_ITS_DESTINATION, `    const temporary = destination`)],
    killed(['a-file-where-a-folder-must-go-is-refused-with-nothing-staged']),
  ),

  sameOnEveryLens(
    'U-10',
    'leaves what it staged behind when it refuses, so a refused install litters somebody\'s ' +
      'repository with fragments of a dependency',
    [writeFile(A_REFUSAL_UNSTAGES, `    for (const entry of staged) void entry`)],
    killed(['a-refusal-leaves-no-staged-file-behind']),
  ),

  sameOnEveryLens(
    'U-11',
    'stops asking what sits at a destination, so a directory where a file goes is an EPERM from ' +
      '`rename` with a stack trace instead of a sentence naming the path',
    [writeFile(THE_DESTINATION_KIND_IS_ASKED, `  if (false) {`)],
    killed(['a-directory-where-a-file-goes-is-refused-by-name']),
  ),

  sameOnEveryLens(
    'U-12',
    'reads a file it already wrote as a file somebody edited, so a run killed part-way turns every ' +
      'file it had managed to write into a conflict the user has to resolve by hand',
    [updateFile(WHAT_WE_WOULD_WRITE_IS_NOT_AN_EDIT, `  if (onDisk === wanted) return 'unchanged'`)],
    killed(['a-file-already-equal-to-what-we-would-write-is-not-a-conflict']),
  ),

  sameOnEveryLens(
    'U-13',
    'leaves the folder a removal emptied, so a project accumulates empty directories nobody put there',
    [writeFile(AN_EMPTIED_FOLDER_IS_TIDIED, `  while (false) {`)],
    killed(['a-removal-tidies-the-folder-it-emptied']),
  ),

  sameOnEveryLens(
    'U-14',
    'removes the folder around a removed file whatever else it holds, which deletes files the ' +
      'lockfile still claims and the user still imports',
    [writeFile(A_FOLDER_IS_ONLY_REMOVED_WHEN_EMPTY, `        rmSync(folder, { recursive: true })`)],
    killed(['a-removal-leaves-a-folder-that-still-holds-something']),
  ),

  sameOnEveryLens(
    'U-15',
    'writes the lockfile in place while every other file is staged, so it is the one file of a ' +
      'commit whose write can still be half done',
    [writeFile(THE_LOCKFILE_IS_STAGED_TOO, `      writeLockfile(root, what.lockfile)`)],
    killed(['a-commit-writes-the-files-and-the-lockfile-together']),
  ),

  // -------------------------------------------------------------------------
  // Which of six things a file is
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-16',
    'updates exactly the files the user edited and leaves the untouched ones alone - permanent rule ' +
      '4 inverted, and every edit in the project overwritten in one run',
    [updateFile(AN_UNTOUCHED_FILE_IS_UPDATED, `  if (mustChange && wasEdited) return 'updated'`)],
    killed([THE_CONFLICT, 'a-conflicted-feature-is-held-back-whole', THE_NOMINAL]),
  ),

  sameOnEveryLens(
    'U-17',
    'overwrites a file the user edited that the registry never changed, which is somebody\'s work ' +
      'destroyed for no reason at all',
    [updateFile(AN_UNCHANGED_FILE_THE_USER_EDITED_IS_KEPT, `  return 'updated'`)],
    killed([
      'a-file-the-registry-did-not-change-keeps-your-version',
      'a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk',
    ]),
  ),

  sameOnEveryLens(
    'U-18',
    'holds back only the feature that was edited, so a dependent lands at its new version over a ' +
      'dependency that stayed at the old one - a combination nobody published',
    [updateFile(HOLDING_BACK_PROPAGATES, `  for (let again = false; again; ) {`)],
    killed(['a-feature-that-imports-a-held-back-one-is-held-back-too']),
  ),

  sameOnEveryLens(
    'U-19',
    'removes a dependency that left the closure while the feature that dropped it is held back, so ' +
      'the old code still on disk imports a file this run has just deleted',
    [updateFile(NOTHING_IS_REMOVED_WHILE_ANYTHING_IS_HELD, `  const somethingIsHeldBack = false`)],
    killed(['nothing-is-removed-while-a-feature-is-held-back']),
  ),

  sameOnEveryLens(
    'U-20',
    'resolves from every locked feature rather than from the ones the user asked for, so a ' +
      'dependency climbs to its own newest version independently of the dependent it was published ' +
      'against, and nothing ever leaves the project',
    [updateFile(ONLY_A_ROOT_IS_RESOLVED_FROM, `  const roots = request.lockfile.features`)],
    killed([THE_LEAVING, 'a-lockfile-with-no-root-has-nowhere-to-start']),
  ),

  sameOnEveryLens(
    'U-21',
    "follows the registry's current default rather than the implementation the lockfile names, so a " +
      'user who chose one is moved onto another without a word',
    [updateFile(THE_RECORDED_IMPLEMENTATION_IS_KEPT, `    const binding = bindingFor(source, feature.contract, null)`)],
    killed(['an-update-keeps-the-implementation-the-lockfile-names']),
  ),

  sameOnEveryLens(
    'U-22',
    'overwrites a file at a path the lockfile does not claim, which is somebody else\'s code ' +
      'replaced by a command they ran to keep ours up to date',
    [updateFile(A_PATH_NOBODY_CLAIMS_IS_REFUSED, `  const unclaimed: readonly string[] = []
  const unused = planned.plan.files`)],
    killed(['a-file-toopo-did-not-write-is-never-overwritten-by-an-update']),
  ),

  sameOnEveryLens(
    'U-23',
    'stamps every feature with the instant of the run, so a `toopo update` that changed nothing ' +
      'still rewrites a committed lockfile and every project has a diff nobody made',
    [updateFile(THE_INSTANT_MOVES_ONLY_WHEN_SOMETHING_DID, `      installedAt: request.at,`)],
    killed([
      'applying-an-update-twice-changes-nothing-the-second-time',
      'a-registry-that-has-not-moved-changes-nothing',
    ]),
  ),

  sameOnEveryLens(
    'U-24',
    'drops the lockfile entry of a feature it held back, so the files it did not touch become files ' +
      'nothing claims and the next `toopo add` refuses them as somebody else\'s',
    [updateFile(A_HELD_BACK_FEATURE_KEEPS_ITS_ENTRY, `      void was`)],
    killed([THE_HELD_ENTRY]),
  ),

  sameOnEveryLens(
    'U-25',
    'drops a feature from the lockfile and leaves its files on disk, so the project holds code no ' +
      'lockfile describes and nothing will ever update or remove it',
    [updateFile(A_LEAVING_FEATURE_IS_REMOVED, `    void entry`)],
    killed([THE_LEAVING, THE_NOMINAL]),
  ),

  // -------------------------------------------------------------------------
  // The line the user copies
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-26',
    'prints the import with the `.ts` extension the file carries on disk, which is TS5097 under ' +
      'every resolution mode a published source is compiled with',
    [reportFile(THE_EXTENSION_IS_JAVASCRIPT, `    \`'./\${configuration.directory}/\${entry.path}'\``)],
    killed([THE_IMPORT_LINE, 'the-import-line-follows-the-configured-directory']),
  ),

  sameOnEveryLens(
    'U-27',
    'prints the import from a folder it guessed rather than the one `init` recorded, which is the ' +
      'exact mistake this line was written to stop somebody making',
    [
      reportFile(
        THE_EXTENSION_IS_JAVASCRIPT,
        `    \`'./src/lib/toopo/\${entry.path.replace(/\\.ts$/, '.js')}'\``,
      ),
    ],
    killed(['the-import-line-follows-the-configured-directory']),
  ),

  sameOnEveryLens(
    'U-28',
    'names only the answer, so a caller of a fallible feature never learns that the diagnostic ' +
      'beside it exists and writes their own error message instead',
    [reportFile(EVERY_EXPORT_IS_NAMED, `  \`\${INDENT}import { \${entry.exports[0]?.name} } from \` +`)],
    killed(['an-import-line-names-the-diagnostic-beside-the-answer']),
  ),

  // -------------------------------------------------------------------------
  // What a root is
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-29',
    'lets a feature stop being a root, so installing something by name and then having it pulled in ' +
      'as a dependency turns it back into one an update may remove',
    [{ file: 'lockfile.ts', find: ASKED_FOR_IS_STICKY, replace: `    askedFor: feature.askedFor,` }],
    killed(['a-feature-pulled-in-and-then-asked-for-becomes-a-root']),
  ),

  sameOnEveryLens(
    'U-30',
    'records every feature of an install as one the user asked for, so nothing is ever a dependency ' +
      'and nothing is ever removed',
    [{ file: 'install.ts', find: ONLY_THE_ROOT_IS_ASKED_FOR, replace: `      askedFor: true,` }],
    killed(['only-the-feature-that-was-asked-for-is-a-root']),
  ),

  sameOnEveryLens(
    'U-31',
    'answers "already installed" with nothing to record, so asking by name for something the project ' +
      'holds as a dependency never makes it a root and a later update removes what the user asked for',
    [
      {
        file: 'install.ts',
        find: AN_UNCHANGED_INSTALL_STILL_CARRIES_ITS_FEATURES,
        replace: `    return { unchanged: rootAddress, entry, features: [] }`,
      },
    ],
    killed(['a-feature-pulled-in-and-then-asked-for-becomes-a-root']),
  ),
]

export const battery: Battery = {
  name: 'cli-update',
  contractPath: 'cli',
  vitestConfig: 'cli/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'U-01',

  arms: [
    {
      id: 'U',
      ref: 'HEAD',
      convention:
        'the update command as committed: the comparison, the diff, the two-phase write and the ' +
        'import line',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['U'], edits: [] },
  ],

  unreachableGuards: [],

  unprobedRegions: [],

  mutants,
}
