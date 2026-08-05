/**
 * The replay: every battery this repository declares, then the total.
 *
 *   npm run mutation
 *
 * ---------------------------------------------------------------------------
 * Why the published name belongs to this file
 * ---------------------------------------------------------------------------
 *
 * `published.ts` puts `npm run mutation` in front of a stranger as the one thing that turns what this
 * repository *asserts* into something they have watched happen. Until this file existed that command
 * ran `measure.ts` with no argument and exited on `usage: measure.ts <battery>` - so a reader who
 * followed the central instruction of the method page got an error, and the page went on stating what
 * the command cost over every battery.
 *
 * There was no second repair. Naming what a reader must type instead would have meant naming
 * something, and there was nothing: replaying everything was a loop each of us wrote by hand and
 * nobody committed. **That is the defect underneath the broken command** - two people had two
 * definitions of *a replay*, either could drift, and nothing would have said so. A published name has
 * to belong to a committed thing, and the by-name usage moves to `npm run battery` because it is the
 * narrower question: this file answers *what does this repository catch*, and `measure.ts` answers
 * *what does this one battery catch*.
 *
 * ---------------------------------------------------------------------------
 * It composes the two commands a reader could type, and implements neither
 * ---------------------------------------------------------------------------
 *
 * Each battery is run by spawning `measure.ts`, and the total by spawning `tally.ts`. Neither is
 * reimplemented here, so there is no second definition of what measuring a battery is or of what a
 * total refuses - and what a reader sees scroll past is exactly what they would see running the two
 * commands themselves. A process per battery costs about a tenth of a second against a run of
 * twenty-odd minutes, which is the whole price of that guarantee.
 *
 * ---------------------------------------------------------------------------
 * Two lists of the batteries, checking each other
 * ---------------------------------------------------------------------------
 *
 * The batteries run here come from `THE_BATTERIES`, which is a declared list; the batteries `tally.ts`
 * requires come from reading `mutation/*.battery.ts`. That is deliberate and it is not duplication:
 * a battery written and left off the list is not replayed here, so it writes no result, so the total
 * at the end refuses with *declares a battery and wrote no result*. The two halves fail on opposite
 * conditions, which is the shape `reachable.ts` and `archive.test.ts` already have one folder along.
 *
 * ---------------------------------------------------------------------------
 * It ends with the total, and `npm run tally` keeps its own job
 * ---------------------------------------------------------------------------
 *
 * The artefacts this has just written are newer than the commit they describe, so the total accepts
 * them and a reader gets one command and one answer instead of a command and a homework. What stays
 * with `npm run tally` is the half that is not a measurement: printing that total again without
 * re-running anything, and refusing a set of results that is not one replay of the commit it would
 * describe. That refusal is the reason the second command exists, and it is only reachable from there
 * - by construction it can never fire here, because the results are always fresh by the time it runs.
 *
 * ---------------------------------------------------------------------------
 * The duration is printed, so the published figure has a command behind it
 * ---------------------------------------------------------------------------
 *
 * `THE_REPLAY.duration` cannot be derived at build time - `mutation/results/` is the output of a run
 * and is deliberately not committed - so it is transcribed, with the commit it was taken at beside it.
 * What this file changes is that the transcription now comes from committed code rather than from
 * somebody's stopwatch, and it is printed in the spelling that field carries so the two cannot
 * disagree about what a minute is.
 */

import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { THE_BATTERIES } from './published.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')

/** Run one of this folder's entry points as a reader would, and answer its exit status. */
const run = (script: string, args: readonly string[] = []): number => {
  const done = spawnSync(process.execPath, [join(HERE, script), ...args], {
    cwd: REPO,
    stdio: 'inherit',
  })

  return done.status ?? 1
}

/** The spelling `THE_REPLAY.duration` carries, so a figure can be transcribed without rounding twice. */
const spelled = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)

  return `${minutes} min ${Math.round(seconds - minutes * 60)} s`
}

const startedAt = process.hrtime.bigint()
const elapsedSince = (at: bigint): number => Number(process.hrtime.bigint() - at) / 1e9

const took: { readonly battery: string; readonly seconds: number; readonly agreed: boolean }[] = []

for (const battery of THE_BATTERIES) {
  const at = process.hrtime.bigint()
  const status = run('measure.ts', [battery.name])

  took.push({ battery: battery.name, seconds: elapsedSince(at), agreed: status === 0 })
}

const total = elapsedSince(startedAt)
const disagreed = took.filter((one) => !one.agreed)

process.stdout.write(
  `\n${'battery'.padEnd(26)}duration\n` +
    took
      .map(
        (one) =>
          `${one.battery.padEnd(26)}${`${one.seconds.toFixed(1)}s`.padStart(8)}` +
          `${one.agreed ? '' : '  DISAGREED'}`,
      )
      .join('\n') +
    `\n\n${took.length} batteries in ${spelled(total)}\n` +
    (disagreed.length === 0
      ? 'every cell of every battery agreed with the verdict pinned for it\n\n'
      : `${disagreed.length} battery(s) disagree: ${disagreed.map((one) => one.battery).join(', ')}\n\n`),
)

const totalled = run('tally.ts')

process.exitCode = disagreed.length > 0 || totalled !== 0 ? 1 : 0
