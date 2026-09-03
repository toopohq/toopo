/**
 * The battery over `toopo update`, the diff it shows and the two-phase write underneath it.
 *
 * It is the fourteenth, and the second to inject into `packages/cli/`. `cli-install` measures what happens when
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
/**
 * The arithmetic this battery injects into moved out of `update.ts` when `remove` arrived.
 *
 * Both commands reconcile a project against what it should hold and differ in two things only - which
 * features they call roots, and at which version those roots are bound - so what they share is one
 * module and `update.ts` keeps its own two refusals. Every anchor below was repointed rather than
 * rewritten, and the matrix was compared cell by cell against the run before the move: what a mutant
 * measures is the same arithmetic under a different file name.
 */
const reconcileFile = (find: string, replace: string) => ({ file: 'reconcile.ts', find, replace })
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

// The anchor moved when the commit gained `toopo.json` as a second root file: the lockfile is staged
// through the same list rather than on a line of its own, and the defect is the same one - a root file
// written straight to its destination while everything else waits.
const THE_LOCKFILE_IS_STAGED_TOO = `      write: (to: string) => writeLockfile(root, what.lockfile, to),`

const AN_UNTOUCHED_FILE_IS_UPDATED = `  if (mustChange && !wasEdited) return 'updated'`

const WHAT_WE_WOULD_WRITE_IS_NOT_AN_EDIT = `  if (onDisk === wanted) return claimed.sha256 === wanted ? 'unchanged' : 'already-written'`

const AN_UNCHANGED_FILE_THE_USER_EDITED_IS_KEPT = `  return 'kept'`

const HOLDING_BACK_PROPAGATES = `  for (let again = true; again; ) {`

/**
 * The set this is asked of gained a half, and the mutant is unchanged.
 *
 * It used to read `held.size > 0`, which counts the features still in the plan. A feature held back by
 * an edit *while leaving* is in nobody's plan, so its dependencies were removed underneath the code it
 * left on disk - found by the removal suite, on a project whose kept `round.ts` went on importing a
 * `../clamp/clamp.js` that had just been deleted.
 */
const NOTHING_IS_REMOVED_WHILE_ANYTHING_IS_HELD = `  const somethingIsHeldBack = held.size > 0 || editedIn.some((edited) => edited.length > 0)`

/**
 * The filter gained a second conjunct, and the two halves belong to two batteries.
 *
 * `!isDemoted(...)` is dead code for an update - `demoted` is `null` on every reconciliation this
 * battery makes - so that half is `cli-remove`'s region and R-04 injects into it. This one goes on
 * probing what it always probed, *which entries are roots at all*, by taking the whole filter away.
 * Two sub-expressions of one line, each probed by the battery whose command they are about.
 */
const ONLY_A_ROOT_IS_RESOLVED_FROM = `  const roots = request.lockfile.features.filter(
    (feature) => feature.askedFor && !isDemoted(request, feature.contract),
  )`

/**
 * The binding an update resolves through, which is now one branch of a choice rather than the only
 * answer: a removal binds its remaining roots at the version the lockfile records, and this is the
 * other half of that ternary.
 */
const THE_RECORDED_IMPLEMENTATION_IS_KEPT = `        ? bindingFor(source, feature.contract, feature.implementation.id)`

const A_PATH_NOBODY_CLAIMS_IS_REFUSED = `  const unclaimed = planned.plan.files`

const THE_INSTANT_MOVES_ONLY_WHEN_SOMETHING_DID = `      installedAt: moved ? request.at : (was as LockedFeature).installedAt,`

const A_HELD_BACK_FEATURE_KEEPS_ITS_ENTRY = `      if (was !== undefined) lockfile = withFeature(lockfile, was)`

const A_LEAVING_FEATURE_IS_REMOVED = `    removals.push(...entry.files.map((file) => file.path))`

const THE_EXTENSION_IS_JAVASCRIPT = `    \`'./\${configuration.directory}/\${entry.path.replace(/\\.ts$/, '.js')}'\``

const EVERY_EXPORT_IS_NAMED = `  \`\${INDENT}import { \${entry.exports.map((held) => held.name).join(', ')} } from \` +`

const ASKED_FOR_IS_STICKY = `    askedFor: feature.askedFor || (held?.askedFor ?? false),`

const ONLY_THE_ROOT_IS_ASKED_FOR = `      askedFor: sameContract(planning.implementation.contract, chosen.found.address),`

/**
 * The `unchanged` answer gained a field, and the anchor follows it.
 *
 * `promoted` says whether this call turns a dependency into a root, and it exists because the screen
 * used to read that off "did the lockfile change at all" - a different question, whose answer became
 * *always yes* once the instant was stamped on every run. The sentence *it was there as a dependency*
 * then printed on every re-add of something the user had installed directly.
 */
const AN_UNCHANGED_INSTALL_STILL_CARRIES_ITS_FEATURES = `      features,
      promoted: held !== undefined && !held.askedFor,`

const HUNKS_MERGE_WHEN_THEY_MEET = `    if (last !== undefined && from <= last.to + 1) last.to = Math.max(last.to, to)`

const APPLY_IS_A_SWITCH = `    const flags = flagsIn(rest, { valued: [], switches: ['apply'] })`

const A_WAY_OUT_IS_OFFERED_WHERE_THERE_IS_ONE = `    ...(feature.heldBack === null || !theirsToResolve(feature)`

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

  /**
   * The first run of this battery pinned this to the wrong guard, and the correction is the finding.
   *
   * A commit that writes straight to each destination ends in the same state as one that stages,
   * because the cleanup that removes a staged file removes a directly written one too - so the guard
   * that starts from an empty project cannot see it. What staging protects is the file that was
   * **already there**: written straight, it is truncated before anybody knows the commit can finish.
   */
  sameOnEveryLens(
    'U-09',
    'writes each file straight to its destination, so a commit that refuses three files later has ' +
      'already replaced the ones before it and the user is left with neither their version nor ours',
    [writeFile(A_FILE_IS_STAGED_BESIDE_ITS_DESTINATION, `    const temporary = destination`)],
    killed(['a-refused-commit-does-not-touch-the-file-it-would-replace']),
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
    [reconcileFile(WHAT_WE_WOULD_WRITE_IS_NOT_AN_EDIT, `  if (onDisk === wanted) return 'unchanged'`)],
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
    [
      writeFile(
        THE_LOCKFILE_IS_STAGED_TOO,
        `      write: () => writeLockfile(root, what.lockfile),`,
      ),
    ],
    killed(['a-commit-writes-the-files-and-the-lockfile-together']),
  ),

  // -------------------------------------------------------------------------
  // Which of six things a file is
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-16',
    'updates exactly the files the user edited and leaves the untouched ones alone - permanent rule ' +
      '4 inverted, and every edit in the project overwritten in one run',
    [reconcileFile(AN_UNTOUCHED_FILE_IS_UPDATED, `  if (mustChange && wasEdited) return 'updated'`)],
    killed([THE_CONFLICT, 'a-conflicted-feature-is-held-back-whole', THE_NOMINAL]),
  ),

  sameOnEveryLens(
    'U-17',
    'overwrites a file the user edited that the registry never changed, which is somebody\'s work ' +
      'destroyed for no reason at all',
    [reconcileFile(AN_UNCHANGED_FILE_THE_USER_EDITED_IS_KEPT, `  return 'updated'`)],
    killed([
      'a-file-the-registry-did-not-change-keeps-your-version',
      'a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk',
    ]),
  ),

  sameOnEveryLens(
    'U-18',
    'holds back only the feature that was edited, so a dependent lands at its new version over a ' +
      'dependency that stayed at the old one - a combination nobody published',
    [reconcileFile(HOLDING_BACK_PROPAGATES, `  for (let again = false; again; ) {`)],
    killed(['a-feature-that-imports-a-held-back-one-is-held-back-too']),
  ),

  sameOnEveryLens(
    'U-19',
    'removes a dependency that left the closure while the feature that dropped it is held back, so ' +
      'the old code still on disk imports a file this run has just deleted',
    [reconcileFile(NOTHING_IS_REMOVED_WHILE_ANYTHING_IS_HELD, `  const somethingIsHeldBack = false`)],
    killed(['nothing-is-removed-while-a-feature-is-held-back']),
  ),

  /**
   * The pin lost a guard when the reconciliation moved, and that is the mechanism working rather than
   * a coverage loss.
   *
   * `a-lockfile-with-no-root-has-nowhere-to-start` used to redden here because the refusal and the
   * root selection were one statement in one file. They are two now: the selection is the
   * reconciliation's, shared with `remove`, and the refusal is `update.ts`'s own - because taking out a
   * project's last root leaves no root legitimately. So this edit no longer reaches that guard, the
   * pin said so on the first run after the split, and it is corrected rather than widened.
   */
  sameOnEveryLens(
    'U-20',
    'resolves from every locked feature rather than from the ones the user asked for, so a ' +
      'dependency climbs to its own newest version independently of the dependent it was published ' +
      'against, and nothing ever leaves the project',
    [reconcileFile(ONLY_A_ROOT_IS_RESOLVED_FROM, `  const roots = request.lockfile.features`)],
    killed([THE_LEAVING]),
  ),

  sameOnEveryLens(
    'U-21',
    "follows the registry's current default rather than the implementation the lockfile names, so a " +
      'user who chose one is moved onto another without a word',
    [reconcileFile(THE_RECORDED_IMPLEMENTATION_IS_KEPT, `        ? bindingFor(source, feature.contract, null)`)],
    killed(['an-update-keeps-the-implementation-the-lockfile-names']),
  ),

  sameOnEveryLens(
    'U-22',
    'overwrites a file at a path the lockfile does not claim, which is somebody else\'s code ' +
      'replaced by a command they ran to keep ours up to date',
    [reconcileFile(A_PATH_NOBODY_CLAIMS_IS_REFUSED, `  const unclaimed: readonly string[] = []
  const unused = planned.plan.files`)],
    killed(['a-file-toopo-did-not-write-is-never-overwritten-by-an-update']),
  ),

  sameOnEveryLens(
    'U-23',
    'stamps every feature with the instant of the run, so a `toopo update` that changed nothing ' +
      'still rewrites a committed lockfile and every project has a diff nobody made',
    [reconcileFile(THE_INSTANT_MOVES_ONLY_WHEN_SOMETHING_DID, `      installedAt: request.at,`)],
    killed([
      'applying-an-update-twice-changes-nothing-the-second-time',
      'a-registry-that-has-not-moved-changes-nothing',
    ]),
  ),

  sameOnEveryLens(
    'U-24',
    'drops the lockfile entry of a feature it held back, so the files it did not touch become files ' +
      'nothing claims and the next `toopo add` refuses them as somebody else\'s',
    [reconcileFile(A_HELD_BACK_FEATURE_KEEPS_ITS_ENTRY, `      void was`)],
    killed([THE_HELD_ENTRY]),
  ),

  sameOnEveryLens(
    'U-25',
    'drops a feature from the lockfile and leaves its files on disk, so the project holds code no ' +
      'lockfile describes and nothing will ever update or remove it',
    [reconcileFile(A_LEAVING_FEATURE_IS_REMOVED, `    void entry`)],
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
    killed(['a-root-stays-one-when-something-else-pulls-it-in']),
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
        replace: `      features: [],
      promoted: held !== undefined && !held.askedFor,`,
      },
    ],
    killed(['a-feature-pulled-in-and-then-asked-for-becomes-a-root']),
  ),

  // -------------------------------------------------------------------------
  // Four defects written for four silences the first complete run left.
  //
  // Every one of them named a defect that could be written, which is what the instrument asks for
  // rather than a declaration that the region is out of reach - the same answer `cli-install` and
  // `validation-stage-1` gave to the same question.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'U-32',
    'treats every line as a change, so two identical files are shown as a diff of the whole file and ' +
      'a user is asked to accept something that changes nothing',
    [diffFile(A_MARKER_FORCES_ITS_HUNK, `    if (false) continue`)],
    killed(['two-identical-texts-have-nothing-to-show']),
  ),

  sameOnEveryLens(
    'U-33',
    'merges every hunk into one whatever the distance between them, so two changes at opposite ends ' +
      'of a file arrive as one hunk carrying the whole file between them',
    [diffFile(HUNKS_MERGE_WHEN_THEY_MEET, `    if (last !== undefined) last.to = Math.max(last.to, to)`)],
    killed(['two-changes-far-apart-are-two-hunks']),
  ),

  sameOnEveryLens(
    'U-34',
    'reads `--apply` as a flag that takes a value, so the acceptance permanent rule 4 asks for is ' +
      'refused for having no value and `toopo update --apply` can never write anything',
    [
      {
        file: 'arguments.ts',
        find: APPLY_IS_A_SWITCH,
        replace: `    const flags = flagsIn(rest, { valued: ['apply'], switches: [] })`,
      },
    ],
    killed(['update-writes-only-when-it-is-asked-to', 'a-switch-takes-no-value-and-swallows-nothing']),
  ),

  sameOnEveryLens(
    'U-35',
    'offers the two ways out under every held-back feature, so somebody whose feature is held back by ' +
      "a conflict elsewhere is told to delete a file they never touched",
    [reportFile(A_WAY_OUT_IS_OFFERED_WHERE_THERE_IS_ONE, `    ...(feature.heldBack === null`)],
    killed(['the-ways-out-are-offered-only-where-the-reader-put-something']),
  ),

  /**
   * The confinement, at the two of its frontiers this battery's surface reaches.
   *
   * `write.ts` and `lockfile.ts` are both in it, and three of the ten guards over that rule are
   * exercised through them - the two write frontiers and the lockfile boundary. The other seven are
   * declared below rather than reached from here, and the declaration names this search rather than
   * resting on a judgement about what is plausible.
   */
  sameOnEveryLens(
    'U-36',
    'composes a destination without asking whether it stays inside the project, so a path that walks ' +
      'out of the configured directory is one this tool writes to',
    [writeFile(`    const destination = under(root, directory, write.path)`, `    const destination: string | null = join(root, directory, write.path)`)],
    killed(['a-write-that-leaves-the-directory-is-refused-with-nothing-staged']),
  ),

  sameOnEveryLens(
    'U-37',
    'takes any string as the path of an installed file, so a `toopo.lock` naming a place outside the ' +
      'configured directory is read as usable',
    [
      {
        file: 'lockfile.ts',
        find: `    holds: (value) => typeof value === 'string' && staysInside(value),`,
        replace: `    holds: (value) => typeof value === 'string',`,
      },
    ],
    killed(['a-lockfile-naming-a-file-outside-the-configured-directory-is-unusable']),
  ),

  /**
   * The removal frontier is a third cell rather than a second arm of `U-36`, because it is a third
   * choice: a removal is confined in the staging phase where a write is confined at its composition,
   * and one edit cannot be wrong about both.
   */
  sameOnEveryLens(
    'U-38',
    'composes the path of a file it is about to remove without asking whether it stays inside the ' +
      'project, so a path that walks out of the configured directory is one this tool deletes',
    [
      writeFile(
        `  const removals = what.removals.map((path) => ({ path, at: under(root, what.leaving ?? directory, path) }))`,
        `  const removals = what.removals.map((path) => ({\n    path,\n    at: join(root, what.leaving ?? directory, path) as string | null,\n  }))`,
      ),
    ],
    killed(['a-removal-that-leaves-the-directory-is-refused-before-anything-is-written']),
  ),
]

export const battery: Battery = {
  name: 'cli-update',
  contractPath: 'packages/cli',
  vitestConfig: 'packages/cli/vitest.config.ts',
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

  /**
   * The guards of `packages/cli/` this battery leaves silent, and they are one folder measured by two batteries
   * rather than a coverage hole.
   *
   * `cli-install` injects into the plan, the rewrite, the port, the local adapter, the argument
   * grammar and the configuration, with forty-five defects. This one injects into the diff, the
   * two-phase write, the comparison, the import line and the two places `askedFor` is decided. The
   * two lists below are what the first probes and the second does not touch - so they are declared
   * here as a region rather than as a debt, and the sentence that makes that honest is that a defect
   * in them *is* measured, by the battery next door.
   *
   * Four guards that looked like they belonged here turned out not to: the first complete run left
   * them silent, each named a defect that could be written, and U-32 to U-34 write it.
   */
  unprobedRegions: [
    /**
     * The confinement, minus the three frontiers this battery does reach.
     *
     * **The declaration rests on a search rather than on a judgement about what is plausible.** The ten
     * guards over that rule are exercised by five test files, and what each imports is what decides
     * whether a mutant of this surface can reach it: `write.test.ts` and `where-a-file-may-land.test.ts`
     * import `write.js` and `lockfile.js`, which are here, and U-36, U-37 and U-38 are the three
     * witnesses that come of it. The seven below are exercised through `where-a-file-may-land.ts`,
     * `plan.ts`, `rewrite.ts` and `relocate.ts`, and this battery injects into none of the four.
     *
     * Widening the surface to manufacture a cell was refused: a battery that gains a file to satisfy a
     * count has moved its subject rather than found a witness. `cli-install` carries all ten.
     */
    {
      nature: 'claims detection',
      reason:
        'the rule that decides where a file may land, outside the three frontiers of it this ' +
        'surface reaches. Measured by what the guards import rather than by what looks plausible: ' +
        'the seven below are exercised through `where-a-file-may-land.ts`, `plan.ts`, `rewrite.ts` ' +
        'and `relocate.ts`, and no cell of this battery injects into any of those four. The three ' +
        'that are reachable are witnessed here by U-36, U-37 and U-38, and `cli-install` carries all ' +
        'ten with C-76, C-77 and C-78',
      guards: [
        'a-directory-that-leads-out-of-the-project-is-not-a-place-a-file-may-land',
        'a-relocation-of-a-path-that-leaves-the-folder-is-refused',
        'a-served-path-that-leaves-the-directory-is-refused-by-the-plan',
        'a-served-path-that-leaves-the-parsing-project-is-refused-before-it-is-written',
        'an-ordinary-directory-is-a-place-a-file-may-land',
        'every-shape-a-served-answer-really-carries-is-admitted',
        'every-shape-that-is-not-a-place-inside-is-refused',
      ],
    },
    /**
     * How a command ends, which `command.ts` decides and this battery injects nowhere near.
     *
     * All three, and the control is here for the same reason its two neighbours are: it asks for a
     * search, which fetches and succeeds and touches no lockfile, no diff and no staged write. It ran
     * `add` for one commit, which reaches `write.ts` - measured at `aefd323` it was red on U-15, the
     * cell about staging the lockfile, which is a defect in an install and not in an ending.
     *
     * ADR-0168 is the defect they exist for; `cli-install` carries it with C-73, C-74 and C-75.
     */
    {
      nature: 'claims detection',
      reason:
        'how a command ends, which `command.ts` decides and this battery injects nowhere near. ' +
        '`cli-install` carries all three defects over that frame: C-73 and C-74 on a refusal that had ' +
        'reached the registry, and C-75 on a command that did what was asked. ADR-0168',
      guards: [
        'a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way',
        'a-refusal-lets-the-process-end-rather-than-stopping-it',
        'a-refusal-that-reached-the-registry-exits-one-and-says-nothing-on-the-error-stream',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the acceptance of the emitted tree. The two sides of each comparison share every decision ' +
        'and differ in exactly one thing - which registry they read: the installer stand-in on one ' +
        'side, the emitted tree on the other. So a defect in a decision changes both sides ' +
        'identically and the comparison is green on it, and what separates them is a defect in ' +
        'local-source.ts, which cli-install carries with C-17, C-18, C-22 and C-42. This battery ' +
        'injects into neither that stand-in nor the emission it is compared against.',
      guards: [
        'a-refused-contract-answers-no-binding-and-an-empty-list-of-implementations',
        'add-decides-the-same-thing-against-the-emitted-tree',
        'every-byte-the-registry-serves-arrives-unchanged',
        'search-decides-the-same-thing-against-the-emitted-tree',
      ],
    },

    /**
     * The registry reached over a socket, which `cli-install` carries with two defects.
     *
     * This battery injects into the diff, the two-phase write, the comparison, the import line and the
     * two places `askedFor` is decided - and an update reads a registry through the same held view
     * every other command does, so nothing it can break reaches the transport underneath it. That is
     * the division this file already makes about `remove` and about `init`, arriving on the port.
     */
    {
      nature: 'claims detection',
      reason:
        'the port over HTTP, which `cli-install` carries with C-67, C-68, C-69 and C-72. Nothing this ' +
        'battery injects into reaches `http-source.ts` or `fixpoint.ts`: an update is decided against ' +
        'a held view, and how those answers arrived is settled a floor below anything it can break. ' +
        'The revisions two named answers agree on is in the same list on a narrower reading: an ' +
        'update compares them in `reconcile.ts`, which this battery does inject into, but the refusal ' +
        'itself is `oneRevisionBehind` in `resolve.ts` and `cli-install` carries it with C-70.',
      guards: [
        'a-registry-that-does-not-answer-is-a-sentence-a-person-can-read',
        'a-status-that-is-neither-the-answer-nor-a-404-is-an-error-and-not-an-absence',
        'an-install-over-http-plans-exactly-what-the-same-registry-plans-in-process',
        'bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that',
        'the-same-decision-against-a-warm-cache-and-no-network-is-the-same-plan',
        'the-walk-costs-one-round-trip-per-level-and-fetches-each-frontier-at-once',
        'two-named-answers-from-two-revisions-refuse-the-install',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        '`toopo search`, which is the third battery of this folder and shares nothing with either of ' +
        'the other two: it writes no file, reads no project, and touches neither the plan nor the ' +
        'lockfile. `cli-search` carries three defects over the screen a reader is handed. What a query ' +
        'matches moved to `registry-storage` with `packages/registry/search.ts` - ADR-0136 - and this ' +
        'declaration named its guards for three units after they had left this suite.',
      guards: [
        'a-cut-summary-says-that-it-was-cut',
        'a-refused-contract-is-offered-no-install-line',
        'the-catalogue-lists-every-contract-and-marks-the-one-it-refuses',
      ],
    },
    /**
     * `toopo remove`, the fourth battery of this folder, and the division is worth reading rather than
     * skimming: it is **five guards here and one in the search region above**, not the twenty-five that
     * unit added.
     *
     * The other nineteen redden on this battery, because a removal is a reconciliation with one feature
     * demoted and this is the battery over the reconciliation. That is the measurement saying the two
     * commands share their arithmetic rather than resembling each other - if they did not, every guard
     * of `remove.test.ts` would be sitting in a list here.
     *
     * What is left is what a removal has that an update does not: its own two lines of grammar, the
     * screen `init` prints, and a project holding nothing - none of which an update can reach whatever
     * is injected into it.
     */
    {
      nature: 'claims detection',
      reason:
        '`toopo remove` and `toopo list`, which `cli-remove` carries with twenty defects. Only the ' +
        'ones below are out of reach here: the rest of that unit reddens on this battery, because a ' +
        'removal is a reconciliation with one feature demoted and this is the battery over the ' +
        'reconciliation.',
      guards: [
        'a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen',
        'a-command-that-takes-nothing-is-read-and-refuses-an-argument',
        'an-init-says-what-has-to-be-committed',
        'the-lockfile-standing-is-asked-and-not-predicted',
        'remove-without-a-contract-is-refused',
        'remove-writes-only-when-it-is-asked-to',
      ],
    },
    /**
     * The screen `toopo init` prints when the configured folder moves, and it is three guards of the
     * thirteen that unit added.
     *
     * The other ten redden here, which is the same measurement this file already makes about `remove`:
     * a relocation is decided against files on disk and committed through `write.ts`, and both are
     * reached by anything injected into the plan, the lockfile or the commit. What no defect of this
     * battery can reach is `renderInit` itself - an update never calls it - so the three guards over
     * what that screen says are `cli-install`'s, where C-61, C-62 and C-63 are each alone on one.
     */
    {
      nature: 'claims detection',
      reason:
        'what `toopo init` says when it moves a folder, which `cli-install` carries with three ' +
        'defects. This battery never renders that screen: an update changes no configuration, so the ' +
        'relocation half of `renderInit` is out of its reach however the arithmetic underneath is ' +
        'broken - and the arithmetic underneath does redden here, on ten of the same unit\'s guards.',
      guards: [
        'a-folder-change-names-every-file-that-moved',
        'a-folder-change-says-the-imports-are-the-users-to-change',
        'a-folder-that-could-not-be-taken-is-named',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the argument grammar and the configuration file. Nothing in this battery reads what the ' +
        'user typed or what `toopo.json` holds - it starts from a request already parsed - and ' +
        '`cli-install` carries twelve defects over exactly these. The two guards this unit *added* to ' +
        'the grammar are not here: `--apply` is this command\'s own acceptance, so U-34 probes it. ' +
        'ADR-0208 put three more guards in this region and the twelve did not move, because the cell ' +
        'that reaches them is C-30, which was already one of them.',
      guards: [
        'a-command-with-no-flag-is-read',
        'a-configuration-round-trips-through-the-file',
        'a-directory-that-does-not-travel-is-refused',
        'a-directory-that-travels-is-accepted',
        'a-field-this-toopo-does-not-honour-is-refused',
        'a-file-that-is-not-json-is-refused-by-name',
        'a-flag-and-its-value-are-read',
        'a-flag-with-no-value-is-refused',
        'a-project-that-was-never-initialised-answers-nothing',
        'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name',
        'a-project-with-nothing-in-it-is-configured-rather-than-refused',
        'a-refused-directory-is-told-what-in-it-was-refused',
        'a-repeated-flag-and-a-stray-word-are-refused',
        'a-version-this-toopo-does-not-write-is-refused',
        'add-without-a-contract-is-refused',
        'an-unknown-command-and-an-unknown-flag-are-refused',
        'nothing-at-all-is-refused',
        'the-folder-init-is-given-is-one-this-toopo-can-read',
        'the-proposed-directory-follows-the-shape-of-the-project',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the install path: where a file lands, what its imports point at afterwards, what is checked ' +
        'on arrival, what the port may ask for, and the report an install prints. An update reuses ' +
        'every one of those and perturbs none of them - it starts from a plan and asks what is on ' +
        'disk - so a defect in any of them is measured by `cli-install`, which is where the thirty ' +
        'defects aimed at them live.',
      guards: [
        'a-blob-that-is-not-what-its-address-names-is-refused',
        'a-contract-the-catalogue-refused-is-not-installable',
        'a-feature-with-no-dependency-lands-exactly-as-it-was-served',
        'a-file-we-did-not-write-is-never-overwritten',
        'a-line-says-what-was-done-to-that-file',
        'a-name-the-catalogue-does-not-hold-is-refused',
        'a-project-is-removed-while-another-process-still-holds-it',
        'a-refusal-leaves-the-project-exactly-as-it-was',
        'a-refusal-says-nothing-was-written-before-it-says-why',
        'a-refused-contract-is-in-the-index-and-is-not-installable',
        'a-renamed-entry-file-is-repointed',
        'a-shared-blob-is-repointed-across-features',
        'a-shared-file-is-written-once-and-still-appears-in-the-plan',
        'a-size-is-read-the-way-a-file-manager-shows-it',
        'a-snapshot-that-is-not-what-its-digest-names-is-refused',
        'a-source-carrying-more-than-the-port-declares-is-refused',
        'git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-edge-whose-digest-names-another-artefact-is-refused',
        'an-entry-file-is-named-after-its-feature',
        'an-entry-file-is-never-deduplicated',
        'an-import-of-a-file-this-install-does-not-carry-is-refused',
        'an-import-of-something-outside-the-registry-is-refused',
        'an-unchanged-specifier-is-left-alone',
        'an-unreadable-lockfile-stops-the-install',
        'every-breakage-is-classified',
        'every-clean-refusal-resolves-to-the-guard-it-names',
        'every-method-of-the-port-answers-an-endpoint-that-exists',
        'every-shape-of-import-is-repointed-and-not-only-the-obvious-one',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
        'the-cost-is-stated-before-the-files',
        'the-local-source-binds-the-version-the-registry-published',
        'the-plan-is-in-the-resolutions-order',
        'the-port-answers-every-need-behind-it-and-nothing-else',
        'the-three-spellings-of-one-file-all-resolve',
        'two-different-files-on-one-destination-are-refused',
        'two-edges-naming-one-address-at-two-digests-are-refused',
        'two-versions-of-one-feature-are-refused',
        'two-versions-of-one-feature-are-refused-before-anything-is-written',
      ],
    },
  ],

  mutants,
}
