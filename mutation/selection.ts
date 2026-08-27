/**
 * Which batteries can say anything about a change, derived from what each one injects into.
 * ADR-0146 is the gate this feeds and what it does not reach.
 *
 * ---------------------------------------------------------------------------
 * The rule, and why it is the only cheap one
 * ---------------------------------------------------------------------------
 *
 * A battery injects into exactly one folder, so a change inside that folder is a change that battery
 * measures. It also measures itself: editing `cli-install.battery.ts` changes what the instrument
 * claims about `packages/cli`, and a claim nobody replays is the thing this whole folder exists
 * against.
 *
 * **No walk starts at a folder under measurement, and that is a measurement rather than a shortcut.**
 * Taken over every tracked `.ts` at `66cdb3f`, folder by folder, source edges and test edges together,
 * the five folders a battery injects into and `mutation/` itself form **one strongly connected
 * component**: each of `packages/cli`, `packages/registry`, `packages/site`, `packages/validation`,
 * `packaging` and `mutation` reaches every other transitively, in both directions. So the transitive
 * closure of any one of them is all of them, and a selection that followed what a *suite* imports
 * would select everything on every push - which is not a selection.
 *
 * What that leaves open is stated where it belongs rather than here: a change in one injection folder
 * can redden a guard in another, no cheap selection reaches it, and what bounds it is the second gate
 * running everything before a publication. ADR-0146.
 *
 * ---------------------------------------------------------------------------
 * The other half: what a battery is built out of, as against what it measures
 * ---------------------------------------------------------------------------
 *
 * A battery *measures* a folder and is *built out of* the instrument. The rule above answers for the
 * first and answered for the second by leaving it out, which is the hole ADR-0146 named and priced and
 * did not take: a change to `run.ts` selected nothing, on the reading that following imports is a full
 * replay by another name.
 *
 * **That reading conflated two walks.** Following what a suite imports does select everything, and it
 * is refused above. Following what a *run* reads starts at `measure.ts` and at each battery's own
 * declaration - neither of which imports a folder under measurement - and closes on eight files.
 * `WHAT_A_RUN_OF_ANY_BATTERY_READS` is the list; the guard beside it derives the same set from the
 * imports and refuses any disagreement, so the two are independent statements in the sense
 * `sharedHarnessOf` gives that phrase: the walk notices the instrument reaching somewhere new, the
 * declaration notices the walk going quiet. ADR-0149.
 *
 * ---------------------------------------------------------------------------
 * Why a path that selects nothing is reported rather than dropped
 * ---------------------------------------------------------------------------
 *
 * Most of them are ordinary - a record, the README, a workflow - and two are not. `packages/catalogue/`
 * is reached by all six regions above and injected into by none, so it is at once the folder where
 * this selection answers *no battery* and the folder where an edit's reach is widest. A selection that
 * printed only what it chose would say nothing about that, and a reader of the job's log would have no
 * way to tell the ordinary case from it.
 *
 * **The second is `mutation/census.ts`, and it is the one path this file deliberately answers nothing
 * for.** The argument is at `THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS`. What matters here is that it
 * leaves through this half rather than through the floor: the residue is printed on every run that
 * touches it, so a reader of the log sees the gap instead of reading it in a paragraph somewhere else.
 */

import type { Battery, PlatformFamily } from './run.ts'
import type { TheMeasurement } from './published.ts'

/**
 * Where a battery's own declaration lives.
 *
 * Composed rather than declared, on the convention `instrument.test.ts` already holds against the
 * directory: every battery of `THE_BATTERIES` is `mutation/<name>.battery.ts` and every such file is a
 * battery of `THE_BATTERIES`. A second statement of that here would be free to drift from the guard.
 */
export const theFileOf = (battery: Battery): string => `mutation/${battery.name}.battery.ts`

/**
 * Every file a run of any battery reads, declared - and derived independently by the guard beside it.
 *
 * A run is `measure.ts <name>`, which is what both gates invoke. Its closure and the closure of each
 * battery's own declaration are what a battery is *built out of*: change one of these and every
 * verdict this instrument produces is a verdict about different code.
 *
 * **Eight files and not six.** Two of them are outside `mutation/` and would be missed by any rule
 * scoped to the instrument's folder: `vitest-entry-point.ts`, which every cell is collected through,
 * and `packages/catalogue/identifier.ts`. The second is worth its own line, because it narrows a
 * population this repository keeps an entry for: `packages/catalogue/` is the folder reached by
 * everything and injected into by nothing, and one of its two files is now answered for. The other,
 * `every-contract.ts`, is read by the contract suites and by no run of a battery, so it stays exactly
 * where ADR-0146 left it.
 *
 * **The blind spot is published rather than discovered.** `measure.ts` resolves its battery through a
 * templated `import()`, and `specifiersIn` matches only a quoted literal - so the walk reaches no
 * battery from `measure.ts` at all, and the guard adds every battery declaration as an entry point of
 * its own. A second templated import written into any of these files would be invisible to the walk
 * and the declaration would go on looking right. That is the direction this pair fails in, and it is
 * the direction the declaration exists to cover: the walk notices the instrument reaching somewhere
 * new, the declaration notices the walk going quiet.
 */
export const WHAT_A_RUN_OF_ANY_BATTERY_READS: readonly string[] = [
  'mutation/attribution.ts',
  'mutation/census.ts',
  'mutation/measure.ts',
  'mutation/mutants.ts',
  'mutation/paths.ts',
  'mutation/run.ts',
  'packages/catalogue/identifier.ts',
  'vitest-entry-point.ts',
]

/**
 * The one file above that selects nothing, because a change to it is already addressed to a folder.
 *
 * `census.ts` is a table keyed by suite file, not logic: every row names a path, and the batteries
 * that path belongs to are what the rule at the top of this file already answers for. **A row of it
 * moving without its battery running is a defect of the census - a declaration nothing derives - and
 * repairing it here would put the correction in the mechanism beside the one that has the defect.**
 *
 * **The residue is measured rather than assumed.** Over the 43 pushes from `694a7a6` to `341f86c`,
 * read at `341f86c`: 13 touched `census.ts`, and in 12 of them every battery whose row moved was
 * already selected by the push's own files. One was not - `7c9906c` moved the row of
 * `packages/validation/the-catalogue.test.ts` and `validation-stage-1` did not run.
 *
 * **Its cause is known and it recurs**, which is the half worth carrying: guards written with
 * `it.each` over the catalogue change count when a contract is *published*, in files nobody edited.
 * So the residue is about one push per publication, and it belongs to the entry `CLAUDE.md` already
 * keeps about a parameterised guard having no citable address, rather than to this rule.
 *
 * **What it is worth, so that nobody re-opens it on a hunch:** selecting on this file costs 12 full
 * replays in 43 pushes and buys one battery of 54 seconds. Projecting its changed rows onto the paths
 * they name buys the same battery for 54 s and was refused on the argument above, not on the price -
 * the two differ by 0.098 % of the runner seconds either spends, and by nothing at all on the clock.
 */
export const THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS: readonly string[] = ['mutation/census.ts']

export type Selection = {
  /** Battery names, in the order `THE_BATTERIES` declares them, so a matrix is stable across runs. */
  readonly batteries: readonly string[]
  /** Changed paths no battery answers for, kept so the job's log says what it passed over. */
  readonly unaccounted: readonly string[]
}

const answersFor = (battery: Battery, path: string): boolean =>
  path === battery.contractPath ||
  path.startsWith(`${battery.contractPath}/`) ||
  path === theFileOf(battery)

/**
 * A change every battery answers for, because every battery is built out of it.
 *
 * Membership and never a prefix: these are files, and a folder test here would make
 * `mutation/measure.ts.bak` a change to the runner.
 */
const everyBatteryAnswersFor = (path: string): boolean =>
  WHAT_A_RUN_OF_ANY_BATTERY_READS.includes(path) &&
  !THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS.includes(path)

export const selectionFor = (
  changed: readonly string[],
  batteries: readonly Battery[],
): Selection => {
  const theInstrumentMoved = changed.some(everyBatteryAnswersFor)

  return {
    batteries: batteries
      .filter(
        (battery) => theInstrumentMoved || changed.some((path) => answersFor(battery, path)),
      )
      .map((battery) => battery.name),
    unaccounted: changed.filter(
      (path) => !everyBatteryAnswersFor(path) && !batteries.some((b) => answersFor(b, path)),
    ),
  }
}

/**
 * The batteries holding a cell whose defect exists on one family of platforms and not the other.
 *
 * **It is a projection of what the instrument already publishes and never a second walk.**
 * `whereThePlatformDecides` is built once, in `published.ts`, out of every `onlyOn` a pin carries;
 * this filters it by family and keeps the battery names. A rule here that re-read `mutant.expected`
 * would be free to disagree with the count that reader publishes, and the disagreement would be a leg
 * of continuous integration silently running the wrong batteries.
 *
 * **The order is `THE_BATTERIES`', for the reason `selectionFor` gives about its own**: the field is
 * built by walking the batteries in order, so first insertion into the set is that order, and a matrix
 * built from this is stable across runs.
 *
 * **What makes it worth deriving rather than naming `cli-install` in a workflow** is that both
 * directions move on their own. A second such cell arriving in another battery adds that battery to a
 * leg with nobody editing `.github/`; and the day the last one stops being decided by the platform,
 * this answers nothing and the leg has nothing to run - which is the state the caller has to handle
 * rather than discover, exactly as `any` exists beside `batteries` above. ADR-0169.
 */
export const batteriesWhereThePlatformDecides = (
  family: PlatformFamily,
  measured: TheMeasurement,
): readonly string[] => [
  ...new Set(
    measured.whereThePlatformDecides
      .filter((cell) => cell.family === family)
      .map((cell) => cell.battery),
  ),
]
