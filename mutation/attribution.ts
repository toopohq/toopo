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
 *
 * Those three are about silence, and the reading at the foot of this file is about its mirror: a guard
 * that reddened on a cell whose pin does not name it. It is a report rather than a refusal and it says
 * at length why, because a pin checked as a subset is what let one load flake rewrite a census with
 * every gate green.
 */

import type {
  Battery,
  Calibration,
  GuardIdentity,
  PlatformFamily,
  RunResult,
  SilentGuards,
} from './run.ts'
import { THE_MOST_REDS_A_PIN_NAMES_IN_FULL, thePlatformFamily } from './run.ts'

export type GuardAttribution = {
  readonly guard: string
  readonly reddenedBy: readonly string[]
  readonly soleRedOn: readonly string[]
}

/**
 * One complete run of a battery, as `measure.ts` writes it into `mutation/results/`.
 *
 * **It is declared here rather than beside `writeResults` or beside its reader, and both alternatives
 * were tried.** `run.ts` cannot hold it without importing `ColumnAttribution` from this file, which is
 * the cycle ADR-0198 cut; and holding it in `prediction.ts` put that module on the import closure of
 * `measure.ts`, which `every-file-a-run-of-a-battery-reads-is-declared` reported at once - the walk
 * counts a type-only import, so a pre-flight that cannot change any verdict would have joined the set
 * of files whose every change replays all twenty-three batteries. Here, the writer and the reader
 * share one statement and neither drags the other into a run.
 *
 * `guards` and `platform` are optional because twenty-three measurements were written before either
 * existed. Their absence is a reading `prediction.ts` declines to take, never a default it fills in.
 * ADR-0221.
 */
export type StoredMeasurement = {
  readonly results: readonly RunResult[]
  /** Absent on a filtered run, which computes no attribution and says so. */
  readonly attribution?: readonly ColumnAttribution[]
  /** The guards each `arm/lens` column collected, which is what the two silences are judged against. */
  readonly guards?: Readonly<Record<string, readonly GuardIdentity[]>>
  /** The platform family the measurement was taken on, so a pin naming one can be judged. */
  readonly platform?: PlatformFamily
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
  /**
   * Never red here, because the only cells that name it are ones this platform does not measure.
   *
   * **It is the cell's applicability arriving one level up, and it was missed once.** A cell carrying
   * `onlyOn` is not injected off its family, so a guard whose only witness is that cell goes silent
   * there - and a silence nobody accounts for is what this file refuses. Declaring it in
   * `unreachableGuards` instead would be false where the defect does exist and would redden
   * `wronglyDeclaredSilent` on that platform, so the account has to be the same fact the cell carries
   * rather than a second declaration beside it. ADR-0147.
   */
  readonly notMeasuredHere: readonly AccountedGuard[]
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

/**
 * The battery's own sentence about why a guard has no witness on this platform, or `undefined`.
 *
 * It reads the **pin** rather than the run, because a run off that family carries the resolved
 * expectation - `not-applicable`, with neither the guards it names nor the reason it was skipped for.
 * Reading the declaration is also what makes this a fact about the battery rather than about what
 * happened to be measured.
 *
 * A guard reaching here is already silent, so no cell reddened it; and a cell that had named it and
 * run without reddening it would have disagreed with its own pin one check earlier. So one skipped
 * cell naming it is enough.
 */
const skippedOnThisPlatform = (
  battery: Battery,
  guard: GuardIdentity,
  column: string,
): string | undefined =>
  battery.mutants
    .map((mutant) => mutant.expected[column])
    .find(
      (pinned) =>
        pinned?.onlyOn !== undefined &&
        pinned.onlyOn.family !== thePlatformFamily() &&
        (pinned.by ?? []).includes(guard.id),
    )?.onlyOn?.because

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
    notMeasuredHere: silent
      .filter((guard) => accountFor(battery, guard, lens) === undefined)
      .map((guard) => ({ guard: guard.id, reason: skippedOnThisPlatform(battery, guard, column) }))
      .filter((entry): entry is AccountedGuard => entry.reason !== undefined),
    unaccountedFor: silent
      .filter(
        (guard) =>
          accountFor(battery, guard, lens) === undefined &&
          skippedOnThisPlatform(battery, guard, column) === undefined,
      )
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
      `  never red, not measured on this platform - the cells that name it are not injected here ` +
        `(${column.notMeasuredHere.length})`,
      ...groupedByReason(column.notMeasuredHere),
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

/**
 * A guard that reddened on a cell whose own pin does not name it, where the pin owed the name.
 *
 * ---------------------------------------------------------------------------
 * Why the reading exists
 * ---------------------------------------------------------------------------
 *
 * `unaccountedFor` above is the silence: a guard nothing reddens and no declaration explains. This is
 * its mirror, and until it was written the instrument had no reading of it at all. **A pin is checked
 * as a subset** - `agreesWith` asks that every named guard reddened - so a cell that reddens more than
 * its pin names still reads `killed`, still agrees, and the battery still exits 0. Nothing anywhere
 * said a word.
 *
 * That silence has a cost measured rather than imagined. ADR-0204 published a census in two columns
 * because one guard of `packages/registry` reddened on `I-38`, a cell that edits `emit.ts` and has no
 * causal path to it: the extra red took a load-bearing guard out of the isolated bucket and
 * manufactured a reciprocal pair out of two guards with no relationship to each other. The run was
 * green throughout. And `array-group-by.battery.ts` carries the same class found by hand - *this pin
 * named one where it owed four* - discovered while giving something else an address.
 *
 * ---------------------------------------------------------------------------
 * Why it stops at the line, which is the whole of what makes it readable
 * ---------------------------------------------------------------------------
 *
 * Above `THE_MOST_REDS_A_PIN_NAMES_IN_FULL` a pin names the guards the mutant was written to exercise
 * and deliberately not the rest, so an unnamed red there is the convention working and reporting it
 * would be reporting a decision. Measured over the twenty-three artefacts of one replay: the reading
 * taken over *every* cell answers 634 guards, of which 46 of `packages/registry`'s 47 reddened only on
 * cells above the line. Bounded by the line it answers **155 cells** across the repository, and it
 * contains `I-38`.
 *
 * **The reading over guards rather than over cells was tried first and is measurably blind to the
 * case.** A guard named by *some* pin of the run is accounted for under it, and
 * `the-served-bytes-are-the-committed-bytes` is named by `I-65`'s pin - so the guard-level form reports
 * nothing on the very run that motivated this. A pin is a per-cell object and the convention is a
 * per-cell rule, so the reading is per cell.
 *
 * ---------------------------------------------------------------------------
 * Why it reports and does not refuse
 * ---------------------------------------------------------------------------
 *
 * It is deliberately absent from `disagreementsIn`, and the reason is a measurement rather than a
 * caution. An unclaimed red is either a load flake or a real detection nobody pinned, **nothing in one
 * run separates the two**, and the repository holds 155 of them today - so refusing would redden
 * twenty-one of twenty-three batteries and both gates behind them, on a debt rather than on a fault.
 *
 * There is no threshold either, and its absence is the decision. The count is at zero when every pin
 * at or below the line names its reds; a number chosen to be tolerated would publish a level of noise
 * nobody established.
 *
 * It is not written into the results file: every term of it is already in `results`, and a second copy
 * is one more thing free to drift. ADR-0205.
 */
export type UnclaimedRed = {
  readonly cell: string
  readonly named: readonly string[]
  readonly unclaimed: readonly string[]
}

export const unclaimedRedsIn = (results: readonly RunResult[]): readonly UnclaimedRed[] =>
  results
    .filter(
      (cell) =>
        cell.failedGuards.length > 0 &&
        cell.failedGuards.length <= THE_MOST_REDS_A_PIN_NAMES_IN_FULL,
    )
    .map((cell) => ({
      cell: `${cell.mutant} ${cell.arm}/${cell.lens}`,
      named: cell.expected.by ?? [],
      unclaimed: cell.failedGuards.filter((id) => !(cell.expected.by ?? []).includes(id)),
    }))
    .filter((entry) => entry.unclaimed.length > 0)

export const renderUnclaimedReds = (reds: readonly UnclaimedRed[]): string =>
  [
    `red, UNCLAIMED BY THE PIN OF ITS OWN CELL - at or below the line ADR-0076 draws, where a pin ` +
      `owes every guard it reddened (${reds.length})`,
    ...reds.flatMap((entry) => [
      `  ${entry.cell}  ${entry.named.length} named, ${entry.unclaimed.length} unclaimed`,
      ...entry.unclaimed.map((id) => `    ${id}`),
    ]),
    ...(reds.length === 0
      ? []
      : [
          '',
          'Each is a load flake or a detection nobody pinned, and one run does not tell them apart. ' +
            'Establish which, then name it in the pin - never to quieten a red whose cause is unread.',
        ]),
    '',
  ].join('\n')
