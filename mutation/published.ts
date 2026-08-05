/**
 * What this repository publishes about its own verification, derived from the batteries themselves.
 *
 * ---------------------------------------------------------------------------
 * Why the derivation is over the pins and not over a run
 * ---------------------------------------------------------------------------
 *
 * `tally.ts` reads `mutation/results/`, which `.gitignore` keeps out of the repository because it is
 * the output of one run. A page built on it could not be built from a clean clone, and a page carrying
 * the figures of some past run transcribed into prose is the thing this repository spent months
 * removing from its own documentation.
 *
 * So this reads the other half, which is committed: **what a cell must produce is pinned in its
 * battery**, and `measure.ts` exits non-zero on any cell that disagrees. Anybody with a checkout
 * re-derives every figure below from the batteries themselves, and the derivation moves the day a
 * battery does.
 *
 * ---------------------------------------------------------------------------
 * An assertion and an observation are not the same thing, and the page says which it is showing
 * ---------------------------------------------------------------------------
 *
 * The two coincide - a replay that disagreed with a pin would have failed - and they are still not one
 * object. A reader who runs nothing holds **what this repository asserts**; a reader who runs the
 * command holds **what happened on their machine**. Publishing the first as though it were the second
 * would be the exact move this page exists to argue against, and it costs nothing to say: the figures
 * are the pins, the command is below, and so is what it costs to run.
 *
 * `THE_PINS_ARE_AN_ASSERTION` and `THE_REPLAY` are the two sentences that carry it, exported so that
 * the page renders them rather than restating them.
 *
 * ---------------------------------------------------------------------------
 * Why a survivor carries a nature
 * ---------------------------------------------------------------------------
 *
 * A count of surviving cells published alone is read as a count of holes. Four of the five kinds here
 * are not holes at all - a mutant nothing could catch, a behaviour the contract declines to specify, a
 * rule no input in this catalogue exercises, and a cell that lives only where a lens took the suite's
 * sight away - and only `a-declared-open-class` is a debt. A number more frightening than the truth is
 * as much a misreport as one that flatters, so the aggregate is never available without the split:
 * `theMeasurement` returns the two together and there is no export that gives the total alone.
 */

import type { Battery, Mutant, SurvivalNature } from './run.ts'

import { battery as arrayGroupBySpec } from './array-group-by-spec.battery.ts'
import { battery as arrayGroupBy } from './array-group-by.battery.ts'
import { battery as cliInstall } from './cli-install.battery.ts'
import { battery as cliRemove } from './cli-remove.battery.ts'
import { battery as cliSearch } from './cli-search.battery.ts'
import { battery as cliUpdate } from './cli-update.battery.ts'
import { battery as dateAddSpec } from './date-add-spec.battery.ts'
import { battery as dateAdd } from './date-add.battery.ts'
import { battery as fixture } from './fixture.battery.ts'
import { battery as numberParseSpec } from './number-parse-spec.battery.ts'
import { battery as numberParse } from './number-parse.battery.ts'
import { battery as packaging } from './packaging.battery.ts'
import { battery as registryStorage } from './registry-storage.battery.ts'
import { battery as site } from './site.battery.ts'
import { battery as stringLevenshteinSpec } from './string-levenshtein-spec.battery.ts'
import { battery as stringLevenshtein } from './string-levenshtein.battery.ts'
import { battery as stringSlugifySpec } from './string-slugify-spec.battery.ts'
import { battery as stringSlugify } from './string-slugify.battery.ts'
import { battery as validationStage1 } from './validation-stage-1.battery.ts'

/**
 * Every battery, listed rather than read off the directory, because this module is imported by a
 * generator that must not touch a disk.
 *
 * A list is a second statement of what `mutation/*.battery.ts` already says, and a second statement
 * drifts - a battery added and not listed would make every figure here quietly smaller, which is
 * `scoreFaults`'s *silently be a total of the other batteries* arriving through a different door. What
 * closes it is a guard in `instrument.test.ts`, which may read the directory because it is a test.
 */
export const THE_BATTERIES: readonly Battery[] = [
  arrayGroupBySpec,
  arrayGroupBy,
  cliInstall,
  cliRemove,
  cliSearch,
  cliUpdate,
  dateAddSpec,
  dateAdd,
  fixture,
  numberParseSpec,
  numberParse,
  packaging,
  registryStorage,
  site,
  stringLevenshteinSpec,
  stringLevenshtein,
  stringSlugifySpec,
  stringSlugify,
  validationStage1,
]

/**
 * Why a cell survives. The four a battery declares, and the fifth the structure establishes.
 *
 * The fifth is not declarable: a lens is a setting of the instrument, so a cell that lives only on a
 * blinded column is a fact about the apparatus rather than about the contract, and letting a battery
 * assert it would let a battery assert it wrongly.
 */
export type WhySurviving = SurvivalNature | 'only-where-a-lens-blinded-the-suite'

/**
 * What each kind means to somebody deciding whether it is a hole.
 *
 * Total over the union, so a kind added does not compile until it has been translated for a reader -
 * the shape `WHAT_A_STRATUM_MEANS_TO_A_READER` already takes in `registry/verifiability.ts`, and for
 * the same reason: the page must never be the place where a vocabulary is first explained.
 */
export const WHAT_A_SURVIVOR_MEANS_TO_A_READER: Readonly<Record<WhySurviving, string>> = {
  equivalent:
    'the edit cannot change an answer, so no test could catch it. Measured rather than assumed: each ' +
    'one carries what was compared against what.',
  'outside-what-the-contract-specifies':
    'the edit changes something a caller could observe, and the contract deliberately makes no ' +
    'promise about it. What this marks is the edge of the specification, not a gap in the tests.',
  'unreachable-on-this-catalogue':
    'the rule is real and no input in this catalogue tells the two apart. A larger catalogue would ' +
    'reach it, so the rule is kept and the cell records that nothing here exercises it.',
  'a-declared-open-class':
    'a limit this repository has written down, with its price, in the list of what it declares and ' +
    'nothing keeps. This is the only one of the five that is a debt.',
  'only-where-a-lens-blinded-the-suite':
    'the same defect dies on the column that reads the contract as committed, and lives only where a ' +
    'lens took part of the suite\'s sight away. That difference is what the lens exists to measure: ' +
    'it is what a contract without that half of its surface would have caught, which is nothing.',
}

export type PublishedSurvivor = {
  readonly battery: string
  readonly mutant: string
  /** `arm/lens`, which is what makes this a cell rather than a mutant. */
  readonly cell: string
  /** The battery's own sentence about this defect. Never rewritten here. */
  readonly description: string
  readonly why: WhySurviving
}

export type PublishedPopulation = {
  readonly cells: number
  readonly killed: number
  readonly surviving: readonly PublishedSurvivor[]
}

/** A guard no mutant of its battery reddens, with the battery's own account of why. */
export type PublishedSilence = {
  readonly battery: string
  readonly what: readonly string[]
  readonly reason: string
}

export type TheMeasurement = {
  readonly batteries: number
  readonly lenses: number
  readonly defects: PublishedPopulation
  readonly probes: PublishedPopulation
  /** Guards the battery cannot redden by construction. */
  readonly outOfReach: readonly PublishedSilence[]
  /** Regions a mutant could reach and none does. */
  readonly unprobed: readonly PublishedSilence[]
}

/** The lens of an arm that reads it exactly as its commit left it: the one that edits nothing. */
const committedLensOf = (battery: Battery, arm: string): string | null => {
  const reading = battery.lenses.filter(
    (lens) => lens.arms.includes(arm) && lens.edits.length === 0,
  )

  return reading.length === 1 ? (reading[0]?.id ?? null) : null
}

const cellsOf = (mutant: Mutant): readonly { readonly cell: string; readonly arm: string }[] =>
  Object.keys(mutant.expected).map((cell) => ({ cell, arm: cell.split('/')[0] ?? '' }))

/**
 * Why a bare survivor is legitimate, or `null` when it is not.
 *
 * `mutants.ts` gives the apparatus the only survivor that declares no nature, on the argument that the
 * structure establishes it. This is where that argument is checked rather than trusted: the same
 * mutant must die on the column that reads the arm as committed.
 */
const whyBareSurvivorSurvives = (
  battery: Battery,
  mutant: Mutant,
  arm: string,
): WhySurviving | null => {
  const committed = committedLensOf(battery, arm)
  if (committed === null) return null

  const onCommitted = mutant.expected[`${arm}/${committed}`]

  return onCommitted !== undefined && onCommitted.verdict !== 'survived'
    ? 'only-where-a-lens-blinded-the-suite'
    : null
}

/**
 * Every survivor a battery declares without a nature and without the structure explaining it, and
 * every arm whose committed lens cannot be identified.
 *
 * The second is not padding: the first check is meaningless without it, because an arm with no
 * identifiable committed lens would make every bare survivor on it unaccountable *by accident* rather
 * than by a claim anybody made.
 */
export const survivorFaults = (batteries: readonly Battery[]): readonly string[] =>
  batteries.flatMap((battery) => [
    ...battery.arms
      .filter((arm) => committedLensOf(battery, arm.id) === null)
      .map(
        (arm) =>
          `${battery.name}: the arm ${arm.id} has no single lens that edits nothing, so no cell of ` +
          `it can be said to read the contract as committed`,
      ),
    ...battery.mutants.flatMap((mutant) =>
      cellsOf(mutant)
        .filter(({ cell, arm }) => {
          const expectation = mutant.expected[cell]

          return (
            expectation?.verdict === 'survived' &&
            expectation.nature === undefined &&
            whyBareSurvivorSurvives(battery, mutant, arm) === null
          )
        })
        .map(
          ({ cell }) =>
            `${battery.name}: ${mutant.id} on ${cell} survives, declares no nature, and is not ` +
            `explained by a lens - so it would be published as a hole nobody argued about`,
        ),
    ),
  ])

const populationOf = (
  batteries: readonly Battery[],
  kind: 'defect' | 'probe',
): PublishedPopulation => {
  const surviving: PublishedSurvivor[] = []
  let cells = 0
  let killed = 0

  for (const battery of batteries) {
    for (const mutant of battery.mutants.filter((one) => one.kind === kind)) {
      for (const { cell, arm } of cellsOf(mutant)) {
        const expectation = mutant.expected[cell]
        if (expectation === undefined || expectation.verdict === 'not-applicable') continue

        cells += 1

        if (expectation.verdict !== 'survived') {
          killed += 1
          continue
        }

        const why = expectation.nature ?? whyBareSurvivorSurvives(battery, mutant, arm)

        // Refused rather than defaulted. `survivorFaults` is what reports this properly; reaching
        // here means it was not consulted, and a rendering that picked one of the five kinds to
        // stand in would publish a judgement nobody made - inside the function written to stop
        // exactly that.
        if (why === null) {
          throw new Error(
            `${battery.name}: ${mutant.id} on ${cell} survives and nothing says why - see ` +
              `survivorFaults`,
          )
        }

        surviving.push({
          battery: battery.name,
          mutant: mutant.id,
          cell,
          description: mutant.description,
          why,
        })
      }
    }
  }

  return { cells, killed, surviving }
}

const silencesOf = (
  batteries: readonly Battery[],
  which: 'unreachableGuards' | 'unprobedRegions',
): readonly PublishedSilence[] =>
  batteries.flatMap((battery) =>
    battery[which].map((silence) => ({
      battery: battery.name,
      what: [...(silence.suites ?? []), ...(silence.guards ?? [])],
      reason: silence.reason,
    })),
  )

/**
 * The whole of what the page may publish about this instrument, in one value.
 *
 * One call rather than an export per figure, because the aggregate and its breakdown must not be
 * separable: an export returning the number of survivors alone is the thing this file exists to
 * prevent, and the cheapest way to make it unavailable is not to write it.
 */
export const theMeasurement = (batteries: readonly Battery[] = THE_BATTERIES): TheMeasurement => ({
  batteries: batteries.length,
  lenses: batteries.reduce((total, battery) => total + battery.lenses.length, 0),
  defects: populationOf(batteries, 'defect'),
  probes: populationOf(batteries, 'probe'),
  outOfReach: silencesOf(batteries, 'unreachableGuards'),
  unprobed: silencesOf(batteries, 'unprobedRegions'),
})

/** How many survivors of each kind, in the order the vocabulary declares them. */
export const survivorsByKind = (
  population: PublishedPopulation,
): Readonly<Record<WhySurviving, number>> => {
  const counted = Object.fromEntries(
    Object.keys(WHAT_A_SURVIVOR_MEANS_TO_A_READER).map((why) => [why, 0]),
  ) as Record<WhySurviving, number>

  for (const survivor of population.surviving) counted[survivor.why] += 1

  return counted
}

/**
 * What a reader holds before they run anything.
 *
 * Said on the page rather than implied, because the difference between it and the sentence below is
 * the whole of what makes a published figure honest.
 */
export const THE_PINS_ARE_AN_ASSERTION =
  'every figure here is read off the batteries in this repository, where each cell carries the ' +
  'verdict it must produce. That is what this project asserts about its own tests. It is not yet ' +
  'something you have seen happen.'

/**
 * What turns it into an observation, and what that costs.
 *
 * The duration is a dated measurement rather than a derivation - no committed artefact holds it,
 * because `mutation/results/` is the output of a run and is deliberately not in the repository - so it
 * carries the commit it was taken at, which is the treatment this repository gives every published
 * figure it cannot re-derive.
 *
 * **And it carries a second figure, because a stamp alone does not stop the first one being misread.**
 * A duration published on its own reads as a period - as though the replay took that long, the way a
 * kettle takes three minutes. It is a wall clock on one machine on one afternoon, and the spread
 * between runs of the same batteries on the same machine is wider than the precision the figure is
 * written to. So `spread` goes beside `duration` and the page renders both: one run, and what a second
 * one cost. Publishing the first without the second would be a precision this measurement has not got,
 * which is the same defect as a count with no coordinates one folder up.
 */
export const THE_REPLAY = {
  command: 'npm run mutation',
  what:
    'injects every defect below into a working tree, runs the suite once per cell, compares what ' +
    'happened against what the battery pinned, and prints the total. A single cell that disagrees ' +
    'fails the run.',
  /** One run of the nineteen, on one machine, at the commit below. Read it beside `spread`. */
  duration: '25 min 21 s',
  measuredAt: '7042c3c',
  /** Every other replay taken on the same machine, so the figure above is not read to the second. */
  spread:
    'the run before it, one defect cell smaller, took 25 min 10 s, and four replays of the 18 ' +
    'batteries before them took 22 min 14 s, 23 min 4 s, 23 min 10 s and 26 min 32 s, so that is ' +
    'one run rather than how long it takes',
  reprintedBy: 'npm run tally',
  /**
   * What the second command is for, now that the first one prints the total itself.
   *
   * The refusal is the whole of it, and it is only reachable from there: a replay writes its results
   * and totals them in the same breath, so they are always fresh by the time it counts. Asking again
   * later is when a set can have gone stale.
   */
  reprintedWhy:
    'prints that total again from the results a replay left, measuring nothing - and refuses a set ' +
    'that is not one complete replay of the commit it would describe, so a figure taken over a stale ' +
    'or partial run cannot be produced by accident',
} as const
