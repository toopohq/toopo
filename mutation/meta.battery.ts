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
    killed([
      'a-red-the-pin-of-its-own-cell-does-not-name-is-reported',
      'a-cell-whose-pin-names-every-guard-it-reddened-is-not-reported',
      'a-red-is-reported-with-what-to-do-about-it-and-a-clean-run-is-not-lectured',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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
    killed([
      'a-verdict-is-asked-of-the-absence-before-the-evidence',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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
    killed([
      'the-citation-sweep-reaches-the-prose-and-the-declaration',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
  ),

  /**
   * **Re-aimed after its first reading, and the first reading is why it is worth a paragraph.** MT-06
   * began as the white-space collapse of `theSectionOn` - `/\s+/g` replaced by nothing rather than by
   * one space, which is the `all6` defect one floor down. Measured, it reddened
   * `every-anchor-of-every-battery-still-quotes-its-file` **and nothing else**: killed by the
   * apparatus and by no guard, which is exactly the false kill this instrument exists to refuse. The
   * anchor red would have carried it, and only the attribution's *alone on MT-06* said so.
   *
   * What it aims at now is the population both root documents count over, which four guards of two
   * files really read.
   */
  sameOnEveryLens(
    'MT-06',
    'serialises every contract of the catalogue but the first, so both root documents are counted ' +
      'against a catalogue one contract short and every figure either of them publishes about the ' +
      'catalogue agrees with a registry nobody can ask',
    [
      documentsFile(
        `  theCatalogue.map((source) => serialiseContract(REPOSITORY_ROOT, source))`,
        `  theCatalogue.slice(1).map((source) => serialiseContract(REPOSITORY_ROOT, source))`,
      ),
    ],
    killed([
      'every-figure-in-contributing-is-one-the-contracts-declare',
      'every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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
    killed([
      'every-battery-answers-for-its-own-declaration',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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
    killed([
      'every-source-that-holds-prose-yields-a-paragraph',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
  ),

  sameOnEveryLens(
    'MT-09',
    'reports a citation of a record that exists and passes over one of a record that does not, so a ' +
      'four-digit citation naming no record resolves silently while every real citation is named as ' +
      'broken. Its own first run reddened the control rather than a cell, because this description ' +
      'carried such a citation and `citationFaults` sweeps every tracked file - the battery breaking ' +
      'the guard it aims at, from its own prose',
    [decisionsFile(`      .filter((id) => !held.has(id))`, `      .filter((id) => held.has(id))`)],
    killed([
      'every-decision-a-file-cites-exists',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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
    killed([
      'a-reading-that-could-not-be-taken-exits-differently-from-one-that-found-nothing',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
  ),

  sameOnEveryLens(
    'MT-11',
    'publishes one battery fewer than the instrument holds, so every figure this repository states ' +
      'about its own defect detection is short by one battery and the page saying so is green',
    [publishedFile(`  batteries: batteries.length,`, `  batteries: batteries.length - 1,`)],
    killed([
      'every-figure-in-the-readme-is-the-one-the-instrument-declares',
      THE_ANCHOR_OF_THE_INJECTED_CELL,
    ]),
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

  /**
   * The sixty-nine guards this battery collects and no cell of it reddens, declared by the file each
   * one lives in.
   *
   * **They are a measurement of the battery and never an indictment of the guards**, which is what the
   * name is for. The floor this battery was written to is one cell per collected guard file, and every
   * file below has one; what is unprobed is the rest of each file's region, which is ordinary work at
   * the price this repository has now measured five times - about 1.3 candidate runs per cell.
   *
   * **It is the largest such declaration in the instrument and that is stated rather than smoothed**:
   * 69 of the 96 guards this battery collects are silent, so a first battery over this folder buys a
   * witness for the file and never for the guard. The two thirds are where the next unit goes.
   */
  unprobedRegions: [
    {
      nature: 'claims detection',
      guards: [
        'a-red-above-the-line-a-pin-draws-in-full-is-not-reported',
      ],
      reason:
        'the 1 of `attribution.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'the-ratio-contributing-argues-from-is-the-one-the-counts-give',
        'every-family-the-census-counts-is-a-field-of-the-record',
        'every-rule-stage-1-applies-is-named-in-contributing',
        'contributing-names-no-rule-stage-1-does-not-have',
      ],
      reason:
        'the 4 of `contributing.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'every-decision-declares-what-it-governs-and-what-keeps-it',
        'no-decision-governs-a-guard-file',
        'every-decision-says-what-would-reopen-it',
        'every-path-a-decision-governs-exists',
        'every-file-a-decision-governs-cites-it-back',
        'every-guard-a-decision-names-is-one-its-suite-collects',
        'every-decision-a-record-links-to-is-the-one-it-names',
      ],
      reason:
        'the 7 of `decisions.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'a-job-its-own-timeout-cancelled-is-a-job-that-did-not-answer',
        'a-job-that-failed-is-named-too-and-the-order-does-not-follow-the-input',
        'an-answer-that-names-no-job-is-refused-rather-than-read-as-well',
        'an-answer-that-is-not-a-set-of-job-results-is-named-rather-than-parsed',
      ],
      reason:
        'the 4 of `every-job-answered.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'every-population-a-reading-can-name-is-one-it-really-sweeps',
        'every-paragraph-a-reading-reports-is-attributed-to-a-commit',
      ],
      reason:
        'the 2 of `hands.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'every-commit-this-repository-cites-is-one-it-has',
        'an-identifier-two-commits-answer-to-is-refused',
        'no-object-of-the-graph-carries-a-refused-address',
        'the-address-sweep-reaches-the-commits-and-the-annotated-tags',
        'a-refused-address-is-declared-as-a-well-formed-digest',
        'an-address-is-digested-from-its-lowercased-self',
        'an-address-in-free-text-is-found-and-matched',
        'no-worktree-is-registered-beside-this-repository',
      ],
      reason:
        'the 8 of `history.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'a-battery-that-agrees-with-its-own-measurement-predicts-nothing-and-says-so',
        'a-pin-naming-a-guard-the-measurement-does-not-redden-is-a-fault',
        'a-pin-whose-verdict-the-measurement-contradicts-is-a-fault',
        'a-guard-reddening-where-the-battery-declares-silence-is-a-fault',
        'a-guard-nothing-reddens-and-nothing-accounts-for-is-a-fault',
        'a-measurement-with-no-guard-identities-is-unread-and-never-clean',
        'a-column-with-no-guard-list-is-unread-even-beside-columns-that-have-one',
        'a-measurement-taken-on-another-platform-is-unread',
        'a-measurement-that-is-not-a-measurement-is-named-rather-than-parsed',
        'a-cell-the-measurement-does-not-hold-is-named-and-never-judged',
        'a-cell-the-battery-no-longer-declares-is-named',
      ],
      reason:
        'the 11 of `prediction.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'the-readme-says-what-caught-means-where-a-defect-is-not-everywhere',
        'the-readme-says-its-figures-are-an-assertion-and-not-an-observation',
        'every-command-the-readme-tells-a-reader-to-type-carries-the-invocation',
        'the-readme-never-gives-a-survivor-total-without-its-split',
        'every-contract-the-catalogue-holds-is-named-on-the-readme',
        'every-file-the-readme-says-a-contract-holds-is-one-the-contract-declares',
        'every-field-the-readme-quotes-from-a-case-is-the-one-the-contract-declares',
        'every-property-the-readme-names-is-one-the-contracts-suite-collects',
        'the-header-the-readme-shows-is-the-one-the-installer-writes',
        'the-readme-names-the-banner-form-it-does-not-show-and-a-contract-that-carries-it',
        'the-readme-names-every-root-an-install-can-write-to',
        'the-import-line-the-readme-shows-is-the-file-it-just-showed',
      ],
      reason:
        'the 12 of `readme.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'every-battery-answers-for-the-folder-it-injects-into',
        'a-changed-file-no-battery-answers-for-is-reported-and-never-dropped',
        'a-path-beside-a-folder-a-battery-injects-into-is-not-a-path-inside-it',
        'a-selection-is-in-the-order-the-batteries-are-declared-in',
        'every-file-a-run-of-a-battery-reads-is-declared',
        'a-change-to-what-every-battery-is-built-out-of-selects-every-battery',
        'a-declaration-left-to-its-own-rows-is-one-a-run-really-reads',
        'a-change-to-a-declaration-left-to-its-own-rows-selects-nothing-and-is-reported',
        'a-push-that-changed-nothing-a-battery-answers-for-selects-none-and-says-so',
        'a-first-push-selects-every-battery-rather-than-none',
        'a-base-this-checkout-does-not-hold-selects-every-battery-rather-than-none',
        'the-log-carries-what-was-passed-over-and-not-only-what-was-chosen',
        'the-entry-point-answers-for-the-whole-instrument-as-well-as-for-the-selection',
        'every-battery-holding-a-cell-one-platform-alone-measures-is-named-to-the-gate',
        'the-entry-point-answers-for-the-platform-no-gate-of-this-file-can-measure',
      ],
      reason:
        'the 15 of `selection.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
    {
      nature: 'claims detection',
      guards: [
        'a-run-cut-short-is-told-from-a-run-that-reddened',
        'a-red-that-names-no-guard-is-answered-by-what-the-run-printed',
        'the-report-and-the-exit-code-are-both-reported-and-neither-is-preferred',
        'a-quotation-of-a-run-says-what-it-left-out',
        'a-run-that-printed-nothing-says-that-rather-than-promising-a-cause',
      ],
      reason:
        'the 5 of `verdict.test.ts` no cell of this battery aims at. The floor this ' +
        'battery was written to is one cell per collected guard file, and this file has one; the rest of ' +
        'its region is ordinary work nobody has taken, and the cell that would take it is a defect this ' +
        'file names rather than a defect nobody can find',
    },
  ],
}
