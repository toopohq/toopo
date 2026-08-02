/**
 * The entry point of the mutation instrument.
 *
 *   node mutation/measure.ts date-add
 *   node mutation/measure.ts number-parse --only=P-17,P-03
 *   node mutation/measure.ts date-add --arm=A
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

const [name, ...flags] = process.argv.slice(2)

if (name === undefined) {
  throw new Error('usage: measure.ts <battery> [--only=ID,ID] [--arm=ID,ID]')
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

const scoreOf = (battery: Battery, results: readonly RunResult[]): string => {
  const defects = new Set(
    battery.mutants.filter((m) => m.kind === 'defect').map((m) => m.id),
  )
  const applicable = results.filter(
    (r) => defects.has(r.mutant) && r.verdict !== 'not-applicable',
  )
  const killed = applicable.filter((r) => r.verdict !== 'survived')
  const survivors = [...new Set(applicable.filter((r) => r.verdict === 'survived').map((r) => r.mutant))]

  return (
    `defects killed: ${killed.length}/${applicable.length} cells` +
    (survivors.length === 0 ? '' : `, surviving: ${survivors.join(', ')}`)
  )
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
    const missing = (cell.expected.by ?? []).filter((title) => !cell.failedTests.includes(title))

    process.stdout.write(
      `  ${cell.mutant} on ${cell.arm}/${cell.lens}: expected ${cell.expected.verdict}, ` +
        `measured ${cell.verdict}\n` +
        (missing.length === 0 ? '' : `    no longer caught by: ${missing.join(' | ')}\n`),
    )
  }

  return 1
}

const module: { battery: Battery } = (await import(`./${name}.battery.ts`)) as { battery: Battery }

calibrate(module.battery)

const results = runBattery(module.battery, valueOf('--only'), valueOf('--arm'))
writeResults(name, results)

process.exitCode = report(module.battery, results)
