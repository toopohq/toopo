/**
 * Which guard catches which defect, read off a completed battery.
 *
 * The matrix says a mutant died. It does not say what killed it, and that is the question worth
 * asking: a defect that migrates from one guard to another leaves the score untouched and the verdict
 * untouched, so nothing anywhere else in this instrument can see it. Two real gaps were found by
 * extracting this by hand - determinism and freedom from ambient input turned out to be red only on
 * mutants that also redden everything else, so neither had been seen red on its own failure condition
 * - and a control that finds a defect in a contract twice in two sessions belongs in the instrument
 * rather than in a script somebody remembers to run.
 *
 * It reads `failedGuards`, which every run already collects, so nothing new is measured. What the
 * `by` pins in a battery add on top is durability: the attribution below is what is true today, and
 * a pin is what makes tomorrow's change to it loud.
 *
 * A guard is addressed by its identifier throughout - never by its title. `run.ts` says why the two
 * are different objects; what matters here is that a guard reddening under a title calibration never
 * saw is a guard this file cannot see at all, and the silence it leaves is indistinguishable from a
 * region no mutant reaches.
 *
 * Only the guards of the contract under measurement are attributed, and since `theFilesToCollect`
 * narrowed a contract battery's run to its own contract, that is every guard the run collected. The
 * reason it was ever a restriction is unchanged and is why the narrowing is safe: a guard of another
 * contract cannot be reddened by a defect injected into this one, so reporting three hundred of them
 * as silent would have buried the handful that mean something.
 *
 * Three buckets, and the third is the one that has to be accounted for rather than merely printed.
 *
 * A guard is *load-bearing* when it is the only red on at least one mutant: the contract would stop
 * catching that defect if it went away.
 *
 * A guard is *never alone* when it reddens but always beside another. It is not decorative - it would
 * catch its defect on its own if the other guard were removed - but nothing here shows it carrying a
 * defect by itself.
 *
 * A guard is *never red* when no mutant of the battery reddens it, and that is where the accounting
 * matters. A battery injects into `reference.ts`, so a guard over the contract's own declarations or
 * over the runtime cannot be reached by construction; a guard a mutant could redden and none does
 * marks a region the battery does not probe. That second list measures the battery rather than the
 * guards, and it is printed under that name so that reading it produces mutants instead of deletions.
 * This file cannot tell the two apart, so the battery declares which is which, and this file refuses
 * a silence nobody accounts for - and refuses a declaration a mutant contradicts, which is how a
 * region leaves the list once it is probed.
 */

import type { Battery, Calibration, GuardIdentity, RunResult, SilentGuards } from './run.ts'

export type GuardAttribution = {
  readonly guard: string
  readonly reddenedBy: readonly string[]
  readonly soleRedOn: readonly string[]
}

export type AccountedGuard = {
  readonly guard: string
  readonly reason: string
}

export type ColumnAttribution = {
  readonly column: string
  readonly loadBearing: readonly GuardAttribution[]
  readonly neverAlone: readonly GuardAttribution[]
  /** Never red, and out of this battery's reach by construction. */
  readonly outOfReach: readonly AccountedGuard[]
  /** Never red, claims detection, and no mutant probes its region. Decorative until one does. */
  readonly unprobedClaims: readonly AccountedGuard[]
  /** Never red, documents a decision, and no mutant probes its region. The case still stands. */
  readonly unprobedDecisions: readonly AccountedGuard[]
  /** Never red, and nothing says why: a guard nobody has shown able to fail. */
  readonly unaccountedFor: readonly string[]
  /** Declared silent, and a mutant reddened it anyway, so the declaration is stale. */
  readonly wronglyDeclaredSilent: readonly string[]
}

const columnsOf = (results: readonly RunResult[]): readonly string[] => [
  ...new Set(results.map((result) => `${result.arm}/${result.lens}`)),
]

const lensOf = (column: string): string => column.slice(column.indexOf('/') + 1)

const reasonIn = (
  groups: readonly SilentGuards[],
  guard: GuardIdentity,
  lens: string,
): string | undefined =>
  groups.find(
    (group) =>
      (group.lenses === undefined || group.lenses.includes(lens)) &&
      ((group.suites ?? []).includes(guard.suite) || (group.guards ?? []).includes(guard.id)),
  )?.reason

const accountFor = (battery: Battery, guard: GuardIdentity, lens: string): string | undefined =>
  reasonIn(battery.unreachableGuards, guard, lens) ??
  reasonIn(battery.unprobedRegions, guard, lens)

const namedIn = (
  groups: readonly SilentGuards[],
  guards: readonly GuardIdentity[],
  lens: string,
): readonly AccountedGuard[] =>
  guards
    .map((guard) => ({ guard: guard.id, reason: reasonIn(groups, guard, lens) }))
    .filter((entry): entry is AccountedGuard => entry.reason !== undefined)

const attributeColumn = (
  battery: Battery,
  guards: readonly GuardIdentity[],
  results: readonly RunResult[],
  column: string,
): ColumnAttribution => {
  const lens = lensOf(column)
  const cells = results.filter((result) => `${result.arm}/${result.lens}` === column)
  const reddenedBy = (guard: GuardIdentity): readonly RunResult[] =>
    cells.filter((cell) => cell.failedGuards.includes(guard.id))

  const speaking = guards.filter((guard) => reddenedBy(guard).length > 0)
  const silent = guards.filter((guard) => reddenedBy(guard).length === 0)

  const attributions = speaking.map((guard) => {
    const reddened = reddenedBy(guard)

    return {
      guard: guard.id,
      reddenedBy: reddened.map((cell) => cell.mutant),
      soleRedOn: reddened.filter((cell) => cell.failedGuards.length === 1).map((cell) => cell.mutant),
    }
  })

  return {
    column,
    loadBearing: attributions.filter((entry) => entry.soleRedOn.length > 0),
    neverAlone: attributions.filter((entry) => entry.soleRedOn.length === 0),
    outOfReach: namedIn(battery.unreachableGuards, silent, lens),
    unprobedClaims: namedIn(
      battery.unprobedRegions.filter((region) => region.nature === 'claims detection'),
      silent,
      lens,
    ),
    unprobedDecisions: namedIn(
      battery.unprobedRegions.filter((region) => region.nature === 'documents a decision'),
      silent,
      lens,
    ),
    unaccountedFor: silent
      .filter((guard) => accountFor(battery, guard, lens) === undefined)
      .map((guard) => guard.id),
    wronglyDeclaredSilent: speaking
      .filter((guard) => accountFor(battery, guard, lens) !== undefined)
      .map((guard) => guard.id),
  }
}

export const attributionOf = (
  battery: Battery,
  calibration: Calibration,
  results: readonly RunResult[],
): readonly ColumnAttribution[] =>
  columnsOf(results).map((column) =>
    attributeColumn(battery, calibration.guardsPerCell[column] ?? [], results, column),
  )

const withRedsListed = (entries: readonly GuardAttribution[]): readonly string[] =>
  entries.map(
    (entry) =>
      `    ${entry.guard}\n` +
      `      red on   ${entry.reddenedBy.join(', ')}\n` +
      `      alone on ${entry.soleRedOn.length === 0 ? '-' : entry.soleRedOn.join(', ')}`,
  )

const groupedByReason = (entries: readonly AccountedGuard[]): readonly string[] =>
  [...new Set(entries.map((entry) => entry.reason))].flatMap((reason) => [
    `    ${reason}`,
    ...entries.filter((entry) => entry.reason === reason).map((entry) => `      ${entry.guard}`),
  ])

export const renderAttribution = (columns: readonly ColumnAttribution[]): string =>
  columns
    .flatMap((column) => [
      `attribution on ${column.column}`,
      `  load-bearing - the only red on some mutant (${column.loadBearing.length})`,
      ...withRedsListed(column.loadBearing),
      `  never alone - always red beside another guard (${column.neverAlone.length})`,
      ...withRedsListed(column.neverAlone),
      `  never red, out of this battery's reach (${column.outOfReach.length})`,
      ...groupedByReason(column.outOfReach),
      `  never red, A REGION THIS BATTERY DOES NOT PROBE - claims detection, so decorative until a ` +
        `mutant reaches it (${column.unprobedClaims.length})`,
      ...groupedByReason(column.unprobedClaims),
      `  never red, a region this battery does not probe - documents a decision, which stands ` +
        `whether or not a mutant violates it (${column.unprobedDecisions.length})`,
      ...groupedByReason(column.unprobedDecisions),
      `  never red, UNACCOUNTED FOR (${column.unaccountedFor.length})`,
      ...column.unaccountedFor.map((id) => `    ${id}`),
      ...(column.wronglyDeclaredSilent.length === 0
        ? []
        : [
            `  DECLARED SILENT AND REDDENED ANYWAY (${column.wronglyDeclaredSilent.length})`,
            ...column.wronglyDeclaredSilent.map((id) => `    ${id}`),
          ]),
      '',
    ])
    .join('\n')

/**
 * An attribution disagrees when a guard nothing reddens is not accounted for, or when a guard the
 * battery declared silent reddened. Both are the same failure as an unpinned cell: a claim nobody
 * has to agree with.
 *
 * A declared unprobed region is not a disagreement. It is already as loud as this instrument can make
 * it - named in the battery, printed in the report - and failing on it would leave an author two ways
 * out, one of which is to write the reason as a lie.
 */
export const disagreementsIn = (columns: readonly ColumnAttribution[]): readonly string[] =>
  columns.flatMap((column) => [
    ...column.unaccountedFor.map(
      (id) =>
        `${column.column}: nothing reddens "${id}", and the battery does not say why. Either it ` +
        `is out of this battery's reach, or it is a debt - both are declared, neither is silence.`,
    ),
    ...column.wronglyDeclaredSilent.map(
      (id) =>
        `${column.column}: "${id}" is declared silent and a mutant reddened it, so the ` +
        `declaration is stale and must be removed.`,
    ),
  ])
