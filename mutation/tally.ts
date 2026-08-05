/**
 * The entry point that turns a completed replay into the one figure.
 *
 *   npm run tally
 *
 * It reads `mutation/results/`, which `.gitignore` keeps out of the repository because it is the output
 * of one run rather than a durable record - what a cell must produce is pinned in its battery. So this
 * derives the figure and never stores it, and `score.ts` holds everything it decides, where the
 * instrument's own suite can reach it without a disk.
 *
 * The process exits non-zero when the artefacts do not describe the committed tree, for the reason
 * `measure.ts` exits non-zero on a cell that disagrees: a total taken over a stale or incomplete set is
 * a number that looks exactly like a total.
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Battery, RunResult } from './run.ts'
import type { MeasuredBattery } from './score.ts'
import { renderScore, scoreFaults, theScore } from './score.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
const RESULTS = join(HERE, 'results')

const BATTERY = /\.battery\.ts$/

const declared = readdirSync(HERE)
  .filter((file) => BATTERY.test(file))
  .map((file) => file.replace(BATTERY, ''))
  .sort()

const written = new Set(
  (() => {
    try {
      return readdirSync(RESULTS)
    } catch {
      return []
    }
  })(),
)

const partial = [...written]
  .filter((file) => file.endsWith('.partial.json'))
  .sort()
  .map((name) => ({ name, writtenAt: statSync(join(RESULTS, name)).mtimeMs }))

const measured: readonly MeasuredBattery[] = await Promise.all(
  declared
    .filter((name) => written.has(`${name}.json`))
    .map(async (name) => {
      const file = join(RESULTS, `${name}.json`)
      const { battery } = (await import(`./${name}.battery.ts`)) as { battery: Battery }
      const kinds = new Map(battery.mutants.map((mutant) => [mutant.id, mutant.kind]))
      const { results } = JSON.parse(readFileSync(file, 'utf8')) as { results: readonly RunResult[] }

      return {
        battery: name,
        writtenAt: statSync(file).mtimeMs,
        cells: results.map((cell) => ({
          mutant: cell.mutant,
          cell: `${cell.arm}/${cell.lens}`,
          verdict: cell.verdict,
          // A result naming a mutant its battery no longer declares is a stale artefact, and it is
          // reported as one rather than quietly counted under a kind it does not have.
          kind: kinds.get(cell.mutant) ?? 'defect',
        })),
      }
    }),
)

const head = execFileSync('git', ['show', '-s', '--format=%ct %h', 'HEAD'], {
  cwd: REPO,
  encoding: 'utf8',
}).trim()

const [committedAt, at] = head.split(' ') as [string, string]

const faults = scoreFaults(declared, measured, partial, Number(committedAt) * 1000)

if (faults.length > 0) {
  process.stdout.write(
    `these artefacts do not describe the tree committed at ${at}:\n` +
      `${faults.map((fault) => `  ${fault}`).join('\n')}\n` +
      `  Run every battery again on this commit - a total over part of a replay reads exactly like a ` +
      `total.\n`,
  )
  process.exitCode = 1
} else {
  process.stdout.write(`${renderScore(theScore(measured), measured.length, at)}\n`)
}
