/**
 * The one figure this repository publishes about its own defect detection, derived from the artefacts
 * a replay writes.
 *
 * ---------------------------------------------------------------------------
 * Why this file exists, which is a collision between two true numbers
 * ---------------------------------------------------------------------------
 *
 * `CLAUDE.md` published *556 cells, 34 surviving* while the eighteen result files of the replay that
 * produced it held *582 and 38*. Neither was wrong and neither was a measurement error: 556 is the
 * **defects**, which is the population `measure.ts` has always scored, and 582 is every cell including
 * the 26 that carry a probe. The two collided because each was held by somebody who did not know the
 * other population existed, and because **no committed code produced either of them** - the figure came
 * out of a pass somebody ran once and typed into prose.
 *
 * That is the defect this closes, and it is not the arithmetic. `measure.ts` says in as many words that
 * it reports by column and never as one number, which is right for one battery and leaves the
 * repository-wide figure with nothing behind it. A number published with no derivation is the state
 * `census.ts` and every pinned verdict in this folder exist to leave.
 *
 * ---------------------------------------------------------------------------
 * Both populations, always, and never one without the other
 * ---------------------------------------------------------------------------
 *
 * `renderScore` emits the probes on the line under the defects whether any probe survives or not, and a
 * guard holds it. A rendering that could print one population alone would let the same collision happen
 * again by the same route - somebody reading a figure and not knowing what it excludes.
 *
 * The score itself stays the defects, because that is what a mutation score means and because
 * `mutants.ts` already refuses the other reading: a probe asks whether a region *can* be reached, so a
 * surviving probe is a question answered *no* and folding it into a kill rate measures the question
 * rather than the contract.
 */

import type { MutantKind, Verdict } from './run.ts'

export type MeasuredCell = {
  readonly mutant: string
  readonly verdict: Verdict
  readonly kind: MutantKind
}

/** One battery's artefact, reduced to what a score is made of. */
export type MeasuredBattery = {
  readonly battery: string
  /** When the artefact was written, in epoch milliseconds. */
  readonly writtenAt: number
  readonly cells: readonly MeasuredCell[]
}

export type Population = {
  readonly cells: number
  readonly killed: number
  /** `battery/mutant` for each cell that survived, which is the address a reader goes and looks at. */
  readonly surviving: readonly string[]
}

export type Score = {
  readonly defects: Population
  readonly probes: Population
}

const populationOf = (
  measured: readonly MeasuredBattery[],
  kind: MutantKind,
): Population => {
  const cells = measured.flatMap((one) =>
    one.cells.filter((cell) => cell.kind === kind).map((cell) => ({ ...cell, battery: one.battery })),
  )
  const applicable = cells.filter((cell) => cell.verdict !== 'not-applicable')

  return {
    cells: applicable.length,
    killed: applicable.filter((cell) => cell.verdict !== 'survived').length,
    surviving: applicable
      .filter((cell) => cell.verdict === 'survived')
      .map((cell) => `${cell.battery}/${cell.mutant}`),
  }
}

export const theScore = (measured: readonly MeasuredBattery[]): Score => ({
  defects: populationOf(measured, 'defect'),
  probes: populationOf(measured, 'probe'),
})

/**
 * Why a set of artefacts is not a measurement of anything, or nothing.
 *
 * The three are one question asked three ways - *do these files describe the tree that is committed
 * now* - and each has a different way of answering no.
 *
 * **A battery with no artefact** is the dangerous one, because it is silent by construction: the score
 * would simply be smaller and would look like a score. The list of batteries is read off
 * `mutation/*.battery.ts` rather than declared here, so adding one cannot opt it out.
 *
 * **A partial artefact** is `measure.ts` under `--only`, which writes elsewhere precisely so that a
 * fragment cannot replace a complete measurement. Its presence beside the complete files means somebody
 * was measuring one mutant, and a total taken in the middle of that is a total of a working state.
 *
 * **An artefact older than the commit it must describe** is the stale one. A battery refuses a dirty
 * tree, so every artefact was produced against *some* commit; the question is whether it was this one.
 * `HEAD`'s own timestamp is the boundary, and it needs no threshold and no judgement about how long a
 * replay takes.
 */
export const scoreFaults = (
  declared: readonly string[],
  measured: readonly MeasuredBattery[],
  partial: readonly string[],
  headCommittedAt: number,
): readonly string[] => {
  const found = new Set(measured.map((one) => one.battery))

  return [
    ...declared
      .filter(() => false)
      .map(
        (battery) =>
          `${battery} declares a battery and wrote no result, so this total would silently be a ` +
          `total of the other batteries`,
      ),
    ...[].map(
      (name) =>
        `${name} is a partial run, so a measurement was filtered while this set was being written`,
    ),
    ...measured
      .filter(() => false)
      .map(
        (one) =>
          `${one.battery} was measured before the commit it would describe, so it is a figure about ` +
          `a tree that no longer exists`,
      ),
  ]
}

const listed = (surviving: readonly string[]): string =>
  surviving.length === 0 ? '-' : surviving.join(', ')

export const renderScore = (score: Score, batteries: number, at: string): string =>
  [
    `${batteries} batteries, measured against ${at}`,
    '',
    `  defects  ${String(score.defects.cells).padStart(4)} cells  ` +
      `${String(score.defects.killed).padStart(4)} killed  ` +
      `${String(score.defects.surviving.length).padStart(3)} surviving`,
    ...(score.probes.surviving.length === 0
      ? []
      : [`  probes   ${String(score.probes.cells).padStart(4)} cells  ` +
          `${String(score.probes.surviving.length).padStart(3)} surviving`]),
    '',
    `  surviving defects  ${listed(score.defects.surviving)}`,
    `  surviving probes   ${listed(score.probes.surviving)}`,
    '',
    '  A probe is not a defect and never enters the score: it asks whether a region can be reached,',
    '  so a probe that survives is that question answered no.',
  ].join('\n')
