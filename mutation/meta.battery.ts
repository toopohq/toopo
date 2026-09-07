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
 * battery may exist at all. Everything else here is ordinary work.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'M', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const runFile = (find: string, replace: string) => ({ file: 'run.ts', find, replace })
const jobsFile = (find: string, replace: string) => ({
  file: 'every-job-answered.ts',
  find,
  replace,
})

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
    killed(['a-job-with-nothing-to-do-is-not-a-job-that-failed']),
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
    killed(['a-dirty-working-tree-is-refused-before-anything-is-measured']),
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
  unreachableGuards: [],

  unprobedRegions: [],
}
