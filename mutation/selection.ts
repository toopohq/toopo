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
 * **Nothing follows imports, and that is a measurement rather than a shortcut.** Taken over every
 * tracked `.ts` at `66cdb3f`, folder by folder, source edges and test edges together, the five folders
 * a battery injects into and `mutation/` itself form **one strongly connected component**: each of
 * `packages/cli`, `packages/registry`, `packages/site`, `packages/validation`, `packaging` and
 * `mutation` reaches every other transitively, in both directions. So the transitive closure of any
 * one of them is all of them, and an import-following selection would select everything on every
 * push - which is not a selection.
 *
 * What that leaves open is stated where it belongs rather than here: a change in one injection folder
 * can redden a guard in another, no cheap selection reaches it, and what bounds it is the second gate
 * running everything before a publication. ADR-0146.
 *
 * ---------------------------------------------------------------------------
 * Why a path that selects nothing is reported rather than dropped
 * ---------------------------------------------------------------------------
 *
 * Most of them are ordinary - a record, the README, a workflow - and one is not. `packages/catalogue/`
 * is reached by all six regions above and injected into by none, so it is at once the folder where
 * this selection answers *no battery* and the folder where an edit's reach is widest. A selection that
 * printed only what it chose would say nothing about that, and a reader of the job's log would have no
 * way to tell the ordinary case from it.
 */

import type { Battery } from './run.ts'

/**
 * Where a battery's own declaration lives.
 *
 * Composed rather than declared, on the convention `instrument.test.ts` already holds against the
 * directory: every battery of `THE_BATTERIES` is `mutation/<name>.battery.ts` and every such file is a
 * battery of `THE_BATTERIES`. A second statement of that here would be free to drift from the guard.
 */
export const theFileOf = (battery: Battery): string => `mutation/${battery.name}.battery.ts`

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

export const selectionFor = (
  changed: readonly string[],
  batteries: readonly Battery[],
): Selection => ({
  batteries: batteries
    .filter((battery) => changed.some((path) => answersFor(battery, path)))
    .map((battery) => battery.name),
  unaccounted: changed.filter((path) => !batteries.some((battery) => answersFor(battery, path))),
})
