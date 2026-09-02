/**
 * One battery, measured.
 *
 *   npm run battery -- date-add
 *   npm run battery -- number-parse --only=P-17,P-03
 *   npm run battery -- date-add --arm=A
 *
 * **`npm run mutation` is `replay.ts` and not this, and the split is about which name is published.**
 * The method page hands `npm run mutation` to a stranger as the thing that turns an assertion into
 * something they have watched happen, and what a stranger is owed under that name is every battery
 * this repository has. This answers the narrower question - *what does this one battery catch* - which
 * is the question somebody already inside the work asks, and it takes an argument that only they know
 * how to supply. `replay.ts` spawns this file once per battery, so there is one definition of what
 * measuring a battery is and both names reach it.
 *
 * Calibration is not a flag. It runs before every battery, on every cell: the unmutated arm must be
 * green and an obvious defect must be red. Making it optional would make it a step that gets
 * skipped, and a battery measured on an uncalibrated apparatus produces verdicts that look exactly
 * like verdicts.
 *
 * The process exits non-zero when any cell disagrees with the verdict its battery pins for it. That
 * is the whole point of pinning them: a guard that stops catching a defect it used to catch is a
 * regression, and it has to be as loud as a failing test.
 */

import type { Battery, RunResult } from './run.ts'
import { calibrate, runBattery, writeResults } from './run.ts'
import {
  attributionOf,
  disagreementsIn,
  renderAttribution,
  renderUnclaimedReds,
  unclaimedRedsIn,
} from './attribution.ts'

const [name, ...flags] = process.argv.slice(2)

if (name === undefined) {
  throw new Error(
    'usage: npm run battery -- <battery> [--only=ID,ID] [--arm=ID,ID]\n' +
      '  For every battery at once, which is what the method page publishes: npm run mutation',
  )
}

const valueOf = (flag: string): readonly string[] | undefined =>
  flags
    .find((f) => f.startsWith(`${flag}=`))
    ?.slice(flag.length + 1)
    .split(',')

const matrix = (results: readonly RunResult[]): string => {
  const columns = [...new Set(results.map((r) => `${r.arm}/${r.lens}`))]
  const rows = [...new Set(results.map((r) => r.mutant))]
  const mark = {
    killed: 'killed',
    'killed-by-typecheck': 'killed (typecheck)',
    survived: 'SURVIVED',
    'not-applicable': 'n/a',
    // Shouted like a survivor, because it is the worse of the two: a survivor is a hole this
    // repository knows the shape of, and this is a cell nobody measured at all. ADR-0162.
    'not-measured': 'NOT MEASURED',
  } as const

  const header = ['mutant'.padEnd(6), ...columns.map((c) => c.padEnd(20))].join('  ')
  const body = rows.map((mutant) => {
    const cells = columns.map((column) => {
      const hit = results.find((r) => r.mutant === mutant && `${r.arm}/${r.lens}` === column)
      if (hit === undefined) return '-'.padEnd(20)

      return `${mark[hit.verdict]}${hit.agrees ? '' : ' !'}`.padEnd(20)
    })

    return [mutant.padEnd(6), ...cells].join('  ')
  })

  return [header, ...body].join('\n')
}

type ColumnScore = {
  readonly column: string
  readonly applicable: number
  readonly killed: readonly string[]
  readonly surviving: readonly string[]
}

const armOf = (column: string): string => column.slice(0, column.indexOf('/'))

const scoreColumn = (
  results: readonly RunResult[],
  defects: ReadonlySet<string>,
  column: string,
): ColumnScore => {
  const cells = results.filter(
    (r) =>
      `${r.arm}/${r.lens}` === column && defects.has(r.mutant) && r.verdict !== 'not-applicable',
  )

  return {
    column,
    applicable: cells.length,
    killed: cells.filter((r) => r.verdict !== 'survived').map((r) => r.mutant),
    surviving: cells.filter((r) => r.verdict === 'survived').map((r) => r.mutant),
  }
}

/**
 * What one lens catches that another lens of the same arm does not.
 *
 * This is the quantity the whole error convention was decided on, so it is printed rather than left
 * to a reader to subtract: `as-committed` measures the contract, `reason-blind` measures what the
 * same contract would catch if it published no reason at all, and the difference is exactly the
 * detection the reason buys.
 *
 * Written over every ordered pair of lenses on an arm rather than over the two that exist today, so
 * that a third lens is reported instead of silently averaged into the others.
 */
const gapsBetweenLenses = (scores: readonly ColumnScore[]): readonly string[] =>
  scores.flatMap((seeing) =>
    scores
      .filter((other) => other.column !== seeing.column && armOf(other.column) === armOf(seeing.column))
      .map((blind) => ({ blind, only: seeing.killed.filter((id) => blind.surviving.includes(id)) }))
      .filter(({ only }) => only.length > 0)
      .map(
        ({ blind, only }) =>
          `${seeing.column} catches ${only.length} defect(s) that ${blind.column} does not: ` +
          only.join(', '),
      ),
  )

/**
 * Reported by column, and never as one number.
 *
 * The figure this replaced added the cells of both lenses - "37/42" - which is a count of nothing a
 * reader wants: the two lenses answer different questions, so their sum measures neither, and it
 * reads as a score the contract earned when half of it is the score of a contract that publishes no
 * reason. A number that invites the wrong reading is a defect in an instrument whose whole job is
 * honest measurement.
 */
const scoreOf = (battery: Battery, results: readonly RunResult[]): string => {
  const defects = new Set(battery.mutants.filter((m) => m.kind === 'defect').map((m) => m.id))
  const scores = [...new Set(results.map((r) => `${r.arm}/${r.lens}`))].map((column) =>
    scoreColumn(results, defects, column),
  )

  const rows = scores.map(
    (s) =>
      `${s.column.padEnd(22)}${`${s.killed.length}/${s.applicable}`.padEnd(18)}` +
      `${s.surviving.length === 0 ? '-' : s.surviving.join(', ')}`,
  )

  const gaps = gapsBetweenLenses(scores)

  return [
    `${'column'.padEnd(22)}${'defects killed'.padEnd(18)}surviving`,
    ...rows,
    '',
    ...(gaps.length === 0
      ? ['no lens of any arm catches a defect another lens of that arm misses']
      : gaps),
  ].join('\n')
}

const report = (battery: Battery, results: readonly RunResult[]): number => {
  process.stdout.write(`\n${matrix(results)}\n\n${scoreOf(battery, results)}\n`)

  const disagreements = results.filter((r) => !r.agrees)
  if (disagreements.length === 0) {
    process.stdout.write('every cell agrees with the verdict this battery pins for it\n')
    return 0
  }

  process.stdout.write(`\n${disagreements.length} cell(s) disagree with the battery:\n`)
  for (const cell of disagreements) {
    const missing = (cell.expected.by ?? []).filter((id) => !cell.failedGuards.includes(id))

    process.stdout.write(
      `  ${cell.mutant} on ${cell.arm}/${cell.lens}: expected ${cell.expected.verdict}, ` +
        `measured ${cell.verdict}\n` +
        (missing.length === 0 ? '' : `    no longer caught by: ${missing.join(' | ')}\n`),
    )
  }

  return 1
}

const module: { battery: Battery } = (await import(`./${name}.battery.ts`)) as { battery: Battery }

const only = valueOf('--only')
const onlyArms = valueOf('--arm')
const complete = only === undefined && onlyArms === undefined

const calibration = calibrate(module.battery)

const results = runBattery(module.battery, calibration, only, onlyArms)

const cellsDisagree = report(module.battery, results) !== 0

/**
 * Attribution is only meaningful on a complete battery. Under `--only` almost every guard is silent
 * because almost every mutant was skipped, and reporting that as a coverage hole would be an
 * artefact of the command line rather than a fact about the contract.
 */
if (!complete) {
  process.stdout.write(
    '\nthis run was filtered, so no attribution was computed and the complete results file was ' +
      'left untouched\n',
  )
  writeResults(name, { results }, false)
  process.exitCode = cellsDisagree ? 1 : 0
} else {
  const attribution = attributionOf(module.battery, calibration, results)
  const disagreements = disagreementsIn(attribution)

  process.stdout.write(`\n${renderAttribution(attribution)}`)

  /**
   * Printed beside the attribution and read into no verdict. `attribution.ts` carries the argument;
   * what belongs here is that the count in its header *is* the aggregate for this run, so nothing
   * restates it further down - a second copy of one number is one more thing free to drift.
   */
  process.stdout.write(`${renderUnclaimedReds(unclaimedRedsIn(results))}`)

  if (disagreements.length === 0) {
    process.stdout.write('every guard of this contract is either witnessed or accounted for\n')
  } else {
    process.stdout.write(`\n${disagreements.length} guard(s) disagree with the battery:\n`)
    for (const disagreement of disagreements) process.stdout.write(`  ${disagreement}\n`)
  }

  writeResults(name, { results, attribution }, true)
  process.exitCode = cellsDisagree || disagreements.length > 0 ? 1 : 0
}
