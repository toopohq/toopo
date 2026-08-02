/**
 * Experiment material. The entry point of the mutation instrument.
 *
 *   node experiments/error-convention/mutation/measure.ts number-parse --controls
 *   node experiments/error-convention/mutation/measure.ts number-parse --only=P-17,P-03
 *   node experiments/error-convention/mutation/measure.ts date-add --arm=A
 *
 * `--controls` runs every arm and lens with no mutant at all. It is not optional politeness: a
 * verdict of "survived" means nothing unless the unmutated arm under the same lens is green, and a
 * lens that reddened the suite on its own would report every mutant as killed.
 */

import type { Battery, RunResult } from './run.ts'
import { runBattery, runControls, writeResults } from './run.ts'

const [name, ...flags] = process.argv.slice(2)

if (name === undefined) {
  throw new Error('usage: measure.ts <battery> [--controls] [--only=ID,ID]')
}

const valueOf = (flag: string): readonly string[] | undefined =>
  flags.find((f) => f.startsWith(`${flag}=`))?.slice(flag.length + 1).split(',')

const only = valueOf('--only')
const onlyArms = valueOf('--arm')

const module: { battery: Battery } = await import(`./${name}.battery.ts`)

if (flags.includes('--controls')) {
  runControls(module.battery)
} else {
  const results = runBattery(module.battery, only, onlyArms)
  writeResults(name, results)
  process.stdout.write(`\n${matrix(results)}\n`)
}

function matrix(results: readonly RunResult[]): string {
  const columns = [...new Set(results.map((r) => `${r.arm}/${r.lens}`))]
  const rows = [...new Set(results.map((r) => r.mutant))]
  const mark = {
    killed: 'killed',
    'killed-by-typecheck': 'killed (typecheck)',
    survived: 'SURVIVED',
    'not-applicable': 'n/a',
  } as const

  const header = ['mutant'.padEnd(6), ...columns.map((c) => c.padEnd(18))].join('  ')

  const body = rows.map((mutant) => {
    const cells = columns.map((column) => {
      const hit = results.find((r) => r.mutant === mutant && `${r.arm}/${r.lens}` === column)

      return (hit === undefined ? '-' : mark[hit.verdict]).padEnd(18)
    })

    return [mutant.padEnd(6), ...cells].join('  ')
  })

  return [header, ...body].join('\n')
}
