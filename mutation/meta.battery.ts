/**
 * The battery over the instrument: the folder that measures, measured.
 *
 * It is the twenty-fourth, and it is the only one whose subject is the tool producing the verdict. For
 * five refusals and nine entries of the open list, *no battery injects into `mutation/`* was the reason
 * a guard could not be written here - stated in fourteen places and decided in none. ADR-0244 measured
 * that it was an absence rather than a decision and named the one obstacle; ADR-0245 answered the
 * question that obstacle posed; ADR-0246 is this file.
 *
 * ---------------------------------------------------------------------------
 * What it may collect, and the one file it may not
 * ---------------------------------------------------------------------------
 *
 * `instrument.test.ts` calls `calibrate` at module scope and runs real batteries in its guards. A
 * battery runs its suite once per cell, so collecting that file would run a battery inside a battery -
 * which is the loop `vitest.config.ts` refuses in its own first paragraph, written for the contracts'
 * suite before any of this existed. `under-measurement.vitest.config.ts` excludes it, and its
 * forty-seven guards are declared below as guards no cell can redden.
 *
 * **It is the only such file, and that was measured rather than assumed.** Over the thirteen test files
 * of this folder, `instrument.test.ts` is the only one that calls `calibrate`, `runBattery` or
 * `runSuite`. `selection.test.ts` spawns `print-which-batteries-to-replay.ts`, which is a reader and
 * spawns nothing itself; `verdict.test.ts` names the machinery in comments and touches no disk;
 * `attribution.test.ts` says in its own header that it is here rather than in `instrument.test.ts`
 * *because they are pure*. A second spawning file would have to be excluded too, and at some count the
 * excluded set stops being a declaration and becomes the suite.
 *
 * ---------------------------------------------------------------------------
 * The danger this battery has and no other one does
 * ---------------------------------------------------------------------------
 *
 * A cell edits the code the cell is running under. The parent - `measure.ts` - loaded its own modules
 * before the first injection and is unaffected; what reads the mutant is the child vitest process, and
 * that is the whole point. `selection.ts` already says this half is wanted rather than feared: *it also
 * measures itself, and a claim nobody replays is the thing this whole folder exists against.*
 *
 * **No cell of this battery may edit `mutation/fixture`.** `clean-tree.test.ts` restores that folder in
 * a `finally`, and the fixture battery's own calibration - which the failing direction of that guard
 * reaches - checks it out again. Either would silently put back a mutant this battery had injected
 * there, and the cell would read as a survivor of a defect that was never present. Every `file:` below
 * is a module of `mutation/` itself.
 *
 * ---------------------------------------------------------------------------
 * The cells
 * ---------------------------------------------------------------------------
 *
 * MT-02 is the cell this battery was written for and the only one whose verdict decides whether the
 * battery may exist at all. Everything else here is ordinary work, and the count of it is a rule
 * rather than an appetite.
 *
 * **The rule was written before the cells: one cell per collected guard file, aimed at the decision
 * that file exists to keep.** It is the shape ADR-0209 to ADR-0211 used to price the unprobed half of
 * `packages/registry` - *the wholly unprobed file* - applied here as a floor rather than as a slice,
 * because a first battery over a folder has no residue to slice and the failure it has to avoid is the
 * one this instrument exists to name: a battery that reddens on nothing is the defect it is for.
 *
 * **Eleven cells over thirteen files, and the two that carry none are named rather than counted out.**
 * `anchors.test.ts` is reddened by every cell already, by construction and not as a witness - see
 * `THE_ANCHOR_OF_THE_INJECTED_CELL`. `workflows.test.ts` is declared out of reach: its subject is
 * `.github/workflows/`, which a battery over `mutation/` may not edit, and the only route to it from
 * this folder is `paths.ts`'s `THE_REPOSITORY` - a shared mechanism, which `mutants.ts` says in as many
 * words is what a cell must never aim at.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'M', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const inFile =
  (file: string) =>
  (find: string, replace: string) => ({ file, find, replace })

const runFile = inFile('run.ts')
const jobsFile = inFile('every-job-answered.ts')
const attributionFile = inFile('attribution.ts')
const historyFile = inFile('history.ts')
const documentsFile = inFile('root-documents.ts')
const selectionFile = inFile('selection.ts')
const handsFile = inFile('hands.ts')
const decisionsFile = inFile('decisions.ts')
const predictionFile = inFile('prediction.ts')
const publishedFile = inFile('published.ts')

/**
 * The red every cell of this battery carries, and it is a property of measuring this folder rather
 * than a detection.
 *
 * `anchors.test.ts` requires every battery cell's `find` text to occur exactly once in the file it
 * names. A cell of *this* battery replaces that text in a file of `mutation/`, so while the cell is
 * injected its own anchor occurs nought times and the guard reddens - on every cell, always, whatever
 * the defect is. No other battery meets this, because no other battery collects `anchors.test.ts`.
 *
 * It is named in every pin below rather than declared away. `unclaimedRedsIn` asks for exactly that -
 * *establish which, then name it in the pin* - and the establishing is this paragraph: the cause is the
 * injection and not the defect, so the guard is a companion of the apparatus and never a witness of a
 * cell. What it costs is that no guard of this battery can ever be *alone* on a cell.
 */
const THE_ANCHOR_OF_THE_INJECTED_CELL = 'every-anchor-of-every-battery-still-quotes-its-file'

const A_JOB_WITH_NOTHING_TO_DO_HAS_ANSWERED = `export const HOW_A_JOB_ANSWERS: readonly string[] = ['success', 'skipped']`

const THE_WHOLE_TREE_IS_ASKED_ABOUT = `  const dirty = git('status', '--porcelain', '--untracked-files=no').trim()`

const mutants: readonly Mutant[] = [
  /**
   * The calibration mutant. It is deliberately not the cell below: calibration runs its mutant on every
   * cell before any verdict is read, and MT-02's failing direction spawns a real calibration of the
   * fixture, so using it here would pay that price twice before the battery had established anything.
   *
   * ADR-0243 is the decision this defect would undo: a battery skipped on a push that selects none is a
   * job that answered, and a gate reading only `success` would stop every deployment of a prose commit.
   */
  sameOnEveryLens(
    'MT-01',
    'reads a skipped job as one that did not answer, so the gate that waits for every job of a run ' +
      'refuses every run in which anything was correctly skipped - which is every push that selects ' +
      'no battery',
    [jobsFile(A_JOB_WITH_NOTHING_TO_DO_HAS_ANSWERED, `export const HOW_A_JOB_ANSWERS: readonly string[] = ['success']`)],
    killed(['a-job-with-nothing-to-do-is-not-a-job-that-failed', THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  /**
   * The cell that decides, and the reason this battery could not have been written before the guard it
   * reddens was moved.
   *
   * `assertCleanTree` is the instrument's floor. `run.ts` states the path it closes: a `finally` does
   * not run when a process is signalled, so an interrupted run leaves a mutant in the tree; if it is a
   * survivor, `npm test` is green and the defect is committable - *the only path this repository has
   * that nothing else covers* - and what closes it is that the next battery run is already refused.
   *
   * **The defect is a narrowing and not a removal, because a narrowing is what somebody would write.**
   * Scoping the status to the folder under measurement is a plausible reading of what cleanliness is
   * for, and it is exactly wrong: what the refusal has to see is dirt *outside* the folder this run is
   * about - a mutant left by an interrupted run of another battery, which is the state the whole
   * mechanism exists for.
   *
   * **Its failing direction is expensive and that is a property of the guard rather than of the cell.**
   * With the refusal blind, `calibrate` does not stop at its first statement: it goes on to calibrate
   * the fixture, which is two real suite runs, and only then returns - at which point the guard's
   * `toThrow` fails. There is no cheaper mutant that falsifies the claim, because any mutant that
   * falsifies it is one that lets `calibrate` proceed. The passing direction, which is every other cell
   * of this battery, is one `git status` and a throw.
   */
  sameOnEveryLens(
    'MT-02',
    'asks git whether `contracts/` is clean instead of whether the tree is, so a mutant left in any ' +
      'other folder by an interrupted run is invisible to the refusal that exists to catch exactly ' +
      'that - and the next battery measures an arm that is not the commit it claims to be',
    [
      runFile(
        THE_WHOLE_TREE_IS_ASKED_ABOUT,
        `  const dirty = git('status', '--porcelain', '--untracked-files=no', '--', 'contracts').trim()`,
      ),
    ],
    killed([
      'a-dirty-working-tree-is-refused-before-anything-is-measured',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
  ),

  // -------------------------------------------------------------------------
  // One cell per collected guard file, so that no file of the meta suite is wholly unprobed
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'MT-03',
    'reports the reds a pin *did* name as the ones it did not, so a cell that owes every guard it ' +
      'reddened reads as clean and a cell that named them all reads as a debt - the mirror of the ' +
      'silence, inverted',
    [
      attributionFile(
        `      unclaimed: cell.failedGuards.filter((id) => !(cell.expected.by ?? []).includes(id)),`,
        `      unclaimed: cell.failedGuards.filter((id) => (cell.expected.by ?? []).includes(id)),`,
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-04',
    'swaps the two ways a red run is read, so a mutant the compiler refused is reported as caught by ' +
      'a guard and a mutant a guard caught is reported as refused by the compiler - two verdicts that ' +
      'mean opposite things about whether the suite noticed anything',
    [
      runFile(
        `  return run.failedGuards.length === 0 ? 'killed-by-typecheck' : 'killed'`,
        `  return run.failedGuards.length === 0 ? 'killed' : 'killed-by-typecheck'`,
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-05',
    'reads a citation as eight hexadecimal digits where this repository writes seven, so every commit ' +
      'identifier in the prose becomes invisible to the sweep and the guard that resolves them passes ' +
      'over an empty population',
    [
      historyFile(
        'const A_CITATION = /`([0-9a-f]{7})(?:\\^|~\\d+)?`/g',
        'const A_CITATION = /`([0-9a-f]{8})(?:\\^|~\\d+)?`/g',
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-06',
    'collapses the white space of a section to nothing instead of to one space, so every pair of ' +
      'words a root document separates by a line break is glued into one - which is the defect this ' +
      'repository met once already, on a count served as `all6`',
    [
      documentsFile(
        `  return (closes === -1 ? body : body.slice(0, closes)).replace(/\\s+/g, ' ')`,
        `  return (closes === -1 ? body : body.slice(0, closes)).replace(/\\s+/g, '')`,
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-07',
    'stops a battery answering for its own declaration, so editing a cell of a battery selects that ' +
      'battery only if the edit also touched the folder it injects into - and a pin rewritten alone is ' +
      'replayed by nothing',
    [
      selectionFile(
        '  path === battery.contractPath ||\n  path.startsWith(`${battery.contractPath}/`) ||\n  path === theFileOf(battery)',
        '  path === battery.contractPath ||\n  path.startsWith(`${battery.contractPath}/`)',
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-08',
    'reads every file as source, so a Markdown document is parsed for comments, yields no paragraph, ' +
      'and the reading of who has read this repository\'s prose goes quiet over the three documents a ' +
      'reader actually meets',
    [
      handsFile(
        `  return path.endsWith('.md') ? markdownProse(path, source) : commentProse(path, source)`,
        `  return commentProse(path, source)`,
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-09',
    'reports a citation of a record that exists and passes over one of a record that does not, so a ' +
      'four-digit citation naming no record resolves silently while every real citation is named as ' +
      'broken. Its own first run reddened the control rather than a cell, because this description ' +
      'carried such a citation and `citationFaults` sweeps every tracked file - the battery breaking ' +
      'the guard it aims at, from its own prose',
    [decisionsFile(`      .filter((id) => !held.has(id))`, `      .filter((id) => held.has(id))`)],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-10',
    'gives a reading that could not be taken the exit code of one that found nothing, so a ' +
      'measurement predating the guard identities answers *agreed* - which is byte for byte what the ' +
      'predictor printed on the day it was wrong',
    [
      predictionFile(
        `  if (predictions.some((one) => one.unread.length > 0)) return EXIT.unread\n`,
        ``,
      ),
    ],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),

  sameOnEveryLens(
    'MT-11',
    'publishes one battery fewer than the instrument holds, so every figure this repository states ' +
      'about its own defect detection is short by one battery and the page saying so is green',
    [publishedFile(`  batteries: batteries.length,`, `  batteries: batteries.length - 1,`)],
    killed([THE_ANCHOR_OF_THE_INJECTED_CELL]),
  ),
]

export const battery: Battery = {
  name: 'meta',
  contractPath: 'mutation',
  vitestConfig: 'mutation/under-measurement.vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'MT-01',

  arms: [
    {
      id: 'M',
      ref: 'HEAD',
      convention:
        'the instrument as committed: it refuses a tree git does not answer for, it refuses a run it ' +
        'could not measure, and every figure this repository publishes about its own defect detection ' +
        'is derived from what it holds',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['M'], edits: [] },
  ],

  mutants,

  /**
   * The forty-seven guards of `instrument.test.ts`, which no cell of this battery can redden because no
   * cell of this battery can collect them.
   *
   * They are not a debt this battery took on: they were unmeasurable under every shape ADR-0244 costed,
   * and the alternative to excluding them is a battery that runs a battery per cell. What changed at
   * ADR-0246 is that the count is forty-seven rather than forty-eight - the one guard that spawned
   * nothing moved out, because leaving it here would have published a mutant of the instrument's own
   * floor as a survivor.
   */
  unreachableGuards: [
    {
      guards: [
        'there-is-a-workflow-to-sweep-and-it-uses-something',
        'every-action-a-workflow-uses-is-pinned-to-a-digest',
        'every-pinned-action-says-which-version-it-was-pinned-at',
        'exactly-one-job-of-this-repository-publishes-to-npm',
        'the-job-that-publishes-to-npm-is-gated-by-the-suites-the-branch-and-the-environment',
        'the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version',
        'nothing-publishes-to-npm-without-waiting-for-a-battery-to-be-replayed',
        'every-job-gated-on-the-version-is-one-the-publication-waits-for',
        'only-the-job-that-publishes-to-npm-can-mint-an-identity-token',
        'no-workflow-authenticates-to-npm-with-a-long-lived-credential',
        'every-job-of-a-workflow-is-one-its-last-gate-waits-for',
        'the-gate-over-a-run-runs-even-where-a-job-it-waits-for-was-cancelled',
      ],
      reason:
        'their subject is `.github/workflows/`, which a battery may not edit - it edits one folder and ' +
        'that folder is `mutation/`. `workflows.test.ts` imports nothing of this folder but ' +
        '`THE_REPOSITORY`, so the only edit here that could reach them is one to where the repository ' +
        'root is, which every guard of every file reads: aiming a cell at it would redden the suite ' +
        'rather than these twelve, and `mutants.ts` says a cell aims at a choice and never at a shared ' +
        'mechanism',
    },
  ],

  unprobedRegions: [],
}
