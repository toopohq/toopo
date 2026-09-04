/**
 * What a replay of one battery would refuse on, read off the measurement it already has.
 *
 * ---------------------------------------------------------------------------
 * What this is exact for, and what it is blind to
 * ---------------------------------------------------------------------------
 *
 * **It is exact for the drift of a declaration against a measurement already taken, and blind to what
 * a cell that has not run would redden.** That sentence is the whole of the tool and it is written
 * before the code because the defect this module exists to close is a predictor that was believed
 * past what it checked.
 *
 * A battery refuses a run on three counts. A pin naming a guard that did not redden; a guard that
 * reddened where the battery declares silence; and a guard left silent that no declaration accounts
 * for. All three are a comparison between *what was measured* and *what the battery declares* - and
 * only one of those two halves moves when somebody edits a battery module. So the measurement in
 * `mutation/results/` can be re-judged against today's declarations without running anything, and the
 * verdict is the one the replay will reach, for every cell that measurement holds.
 *
 * What it cannot do is invent a measurement. A cell added since, a mutant whose edits changed, a guard
 * added to the suite, or any change under the folder being injected into, moves what a run would
 * observe - and no reading of a stored artefact can know it. Those cells are reported as **not
 * covered by this reading**, never as agreeing.
 *
 * ---------------------------------------------------------------------------
 * Why it refuses rather than guesses, in three places
 * ---------------------------------------------------------------------------
 *
 * The cheapest way to build this would have been to answer *no faults* wherever a question could not
 * be asked, and that answer is indistinguishable from a healthy battery. So:
 *
 *   1. A measurement that is absent, unparseable or partial is **unread**, and never clean.
 *   2. A measurement written before this module existed carries no guard identities. The two silences
 *      cannot be judged without them - `attributionOf` would receive an empty guard list per column
 *      and report no silence at all, which is a false green rather than a missing reading. So it is
 *      declared unread, with the command that repairs it.
 *   3. A column of the measurement that carries no guard list is unread for the same reason, even
 *      where its siblings carry one.
 *
 * `ExitCode` below is what carries that distinction outwards: a reading that could not be taken exits
 * differently from one that was taken and found nothing. It is the instrument's own vocabulary one
 * floor up - `not-measured` is not `survived`.
 *
 * ---------------------------------------------------------------------------
 * The limit that is declared rather than closed
 * ---------------------------------------------------------------------------
 *
 * A pin carrying `onlyOn` resolves against the platform family of the machine *reading*, because a
 * measurement written before `platform` was stored does not say where it was taken. Where the stored
 * family is known it is compared and a disagreement is reported as unread rather than judged.
 *
 * ADR-0221 carries the control - red on `409ab48`, green on `90e6f1b`, over one measurement - and why
 * both directions had to be read.
 */

import type { StoredMeasurement } from './attribution.ts'
import { attributionOf, disagreementsIn } from './attribution.ts'
import type { Battery, PlatformFamily, RunResult } from './run.ts'
import { agreesWith, cellsOf, expectedHere, thePinFor, thePlatformFamily, unmetBy } from './run.ts'

export type Prediction = {
  readonly battery: string
  /** Cells this battery declares that the measurement does not hold, so nothing here judges them. */
  readonly notCovered: readonly string[]
  /** Cells the measurement holds that this battery no longer declares. */
  readonly stale: readonly string[]
  /** What a replay would refuse on, in the battery's own words. */
  readonly faults: readonly string[]
  /** Questions this reading could not ask, each with what would make it answerable. */
  readonly unread: readonly string[]
}

/**
 * A measurement is file content, so it is checked rather than trusted.
 *
 * It answers a sentence rather than a boolean because every refusal of this tool has to say what it
 * could not read: a reading that declines without a reason is the silence it exists to replace.
 */
export const whyAMeasurementIsUnreadable = (parsed: unknown): string | null => {
  if (typeof parsed !== 'object' || parsed === null) return 'it is not an object'

  const results = (parsed as { results?: unknown }).results
  if (!Array.isArray(results)) return 'it carries no `results` array'
  if (results.length === 0) return 'it carries no cell at all'

  const malformed = results.findIndex(
    (cell: unknown) =>
      typeof cell !== 'object' ||
      cell === null ||
      typeof (cell as { mutant?: unknown }).mutant !== 'string' ||
      typeof (cell as { arm?: unknown }).arm !== 'string' ||
      typeof (cell as { lens?: unknown }).lens !== 'string' ||
      typeof (cell as { verdict?: unknown }).verdict !== 'string' ||
      !Array.isArray((cell as { failedGuards?: unknown }).failedGuards),
  )

  return malformed === -1 ? null : `cell ${malformed} is not a measured cell`
}

/** A reading that was taken and found nothing is not a reading that could not be taken. */
export const EXIT = {
  agreed: 0,
  faults: 1,
  unread: 2,
} as const

const cellOf = (result: RunResult): string => `${result.mutant} on ${result.arm}/${result.lens}`

const columnOf = (result: RunResult): string => `${result.arm}/${result.lens}`

/**
 * A pin the battery declares today, judged against what the cell really did.
 *
 * It reads `thePinFor` rather than the `expected` the measurement stored, and that is the entire
 * point: the stored one is what the battery said on the day it ran, and the question here is whether
 * what it says *now* still holds. A reading built on the stored expectation would agree with itself
 * for ever.
 */
const pinFaults = (battery: Battery, measurement: StoredMeasurement): readonly string[] =>
  measurement.results.flatMap((result) => {
    const pinned = thePinFor(battery, result.mutant, result.arm, result.lens)
    if (pinned === undefined) return []

    const expected = expectedHere(pinned)
    if (agreesWith(expected, result.verdict, result.failedGuards)) return []

    const unmet = unmetBy(expected, result.failedGuards)

    return [
      `${cellOf(result)}: the battery pins ${expected.verdict} and the measurement is ` +
        `${result.verdict}` +
        (unmet.length === 0 ? '' : `, and its pin still names ${unmet.join(', ')}`),
    ]
  })

/**
 * The two silences, which need the guards each column collected.
 *
 * `attributionOf` answers `[]` for a column it has no guard list for, and an empty guard list produces
 * an empty attribution, which produces no disagreement. That is the false green this function exists
 * not to publish, so the guard list is checked before it is used rather than defaulted.
 */
const silenceFaults = (
  battery: Battery,
  measurement: StoredMeasurement,
): { readonly faults: readonly string[]; readonly unread: readonly string[] } => {
  const columns = [...new Set(measurement.results.map(columnOf))]

  if (measurement.guards === undefined) {
    return {
      faults: [],
      unread: [
        'this measurement carries no guard identities, so a guard reddening where the battery ' +
          'declares silence, and a guard silent that nothing accounts for, cannot be read at all. ' +
          `Run \`npm run battery -- ${battery.name}\` once to write a measurement that carries them.`,
      ],
    }
  }

  const guards = measurement.guards
  const missing = columns.filter((column) => guards[column] === undefined)

  if (missing.length > 0) {
    return {
      faults: [],
      unread: missing.map(
        (column) =>
          `${column}: the measurement holds cells for this column and no guard list for it, so ` +
          `neither silence can be read here.`,
      ),
    }
  }

  return {
    faults: disagreementsIn(attributionOf(battery, { testsPerCell: {}, guardsPerCell: guards }, measurement.results)),
    unread: [],
  }
}

/**
 * Cells that would be measured and cells that were, compared in both directions.
 *
 * Both are reported and neither is a fault. A battery that gained a mutant has cells this reading
 * cannot speak for; a battery that lost one leaves cells in the measurement that answer for nothing.
 * Reporting only the first would let a reading claim a coverage it does not have.
 */
const coverage = (
  battery: Battery,
  measurement: StoredMeasurement,
): { readonly notCovered: readonly string[]; readonly stale: readonly string[] } => {
  const measured = new Set(measurement.results.map(cellOf))
  const declared = new Set(
    battery.mutants.flatMap((mutant) =>
      cellsOf(battery).map(({ arm, lens }) => `${mutant.id} on ${arm.id}/${lens.id}`),
    ),
  )

  return {
    notCovered: [...declared].filter((cell) => !measured.has(cell)),
    stale: [...measured].filter((cell) => !declared.has(cell)),
  }
}

/**
 * Whether the measurement was taken somewhere this machine can judge pins for.
 *
 * A pin carrying `onlyOn` resolves to `not-applicable` off its family, so judging a measurement taken
 * on the other family against this one's resolution would report a disagreement the replay will not
 * have. Where the measurement says nothing the reading proceeds and the header declares the limit.
 */
const platformFaults = (
  measurement: StoredMeasurement,
  here: PlatformFamily,
): readonly string[] =>
  measurement.platform === undefined || measurement.platform === here
    ? []
    : [
        `this measurement was taken on ${measurement.platform} and is being read on ${here}, so a ` +
          `pin that names one platform family would be judged against the wrong one.`,
      ]

export const predictionFor = (
  battery: Battery,
  measurement: StoredMeasurement,
  here: PlatformFamily = thePlatformFamily(),
): Prediction => {
  const elsewhere = platformFaults(measurement, here)
  const { notCovered, stale } = coverage(battery, measurement)

  if (elsewhere.length > 0) {
    return { battery: battery.name, notCovered, stale, faults: [], unread: elsewhere }
  }

  const silences = silenceFaults(battery, measurement)

  return {
    battery: battery.name,
    notCovered,
    stale,
    faults: [...pinFaults(battery, measurement), ...silences.faults],
    unread: silences.unread,
  }
}

/** The exit code a prediction earns: a fault outranks an unread question, which outranks agreement. */
export const exitCodeFor = (predictions: readonly Prediction[]): number => {
  if (predictions.some((one) => one.faults.length > 0)) return EXIT.faults
  if (predictions.some((one) => one.unread.length > 0)) return EXIT.unread

  return EXIT.agreed
}

export const renderPrediction = (prediction: Prediction): string =>
  [
    `${prediction.battery}`,
    ...(prediction.faults.length === 0
      ? []
      : [
          `  ${prediction.faults.length} fault(s) a replay would refuse on:`,
          ...prediction.faults.map((fault) => `    ${fault}`),
        ]),
    ...(prediction.unread.length === 0
      ? []
      : [
          `  ${prediction.unread.length} question(s) this reading could not ask:`,
          ...prediction.unread.map((one) => `    ${one}`),
        ]),
    ...(prediction.notCovered.length === 0
      ? []
      : [
          `  ${prediction.notCovered.length} cell(s) this battery declares that the measurement ` +
            `does not hold, so nothing here speaks for them:`,
          ...prediction.notCovered.map((cell) => `    ${cell}`),
        ]),
    ...(prediction.stale.length === 0
      ? []
      : [
          `  ${prediction.stale.length} cell(s) the measurement holds that this battery no longer ` +
            `declares:`,
          ...prediction.stale.map((cell) => `    ${cell}`),
        ]),
    ...(prediction.faults.length === 0 &&
    prediction.unread.length === 0 &&
    prediction.notCovered.length === 0 &&
    prediction.stale.length === 0
      ? ['  every cell of this measurement agrees with what the battery declares today']
      : []),
    '',
  ].join('\n')
