/**
 * The last job of a run, which turns a job that did not answer into a red.
 *
 *   THE_JOBS_THIS_RUN_NEEDED='{"suites":{"result":"success"}}' node mutation/check-every-job-answered.ts
 *
 * It is a job rather than a step of an existing one because the thing it reads is `needs`, and a job
 * only has a `needs` for the jobs it waits for. `every-job-answered.ts` carries why `cancelled` is the
 * outcome this exists for, why `skipped` is not a failure, and why an answer naming no job is refused
 * rather than passed. ADR-0222.
 */

import { jobsThatDidNotAnswer, whyTheResultsAreUnreadable } from './every-job-answered.ts'

const written = process.env['THE_JOBS_THIS_RUN_NEEDED']

if (written === undefined || written.trim() === '') {
  throw new Error(
    'THE_JOBS_THIS_RUN_NEEDED is unset or empty, so this gate has no run to report on. It is set ' +
      'from `toJSON(needs)` in the workflow; a job that reads nothing must never be the job that ' +
      'says everything is well.',
  )
}

let parsed: unknown
try {
  parsed = JSON.parse(written)
} catch (error) {
  throw new Error(`THE_JOBS_THIS_RUN_NEEDED is not readable JSON: ${(error as Error).message}`)
}

const unreadable = whyTheResultsAreUnreadable(parsed)
if (unreadable !== null) {
  throw new Error(`THE_JOBS_THIS_RUN_NEEDED is not a set of job results: ${unreadable}`)
}

const silent = jobsThatDidNotAnswer(parsed as Parameters<typeof jobsThatDidNotAnswer>[0])
const counted = Object.keys(parsed as object).length

if (silent.length === 0) {
  process.stdout.write(`${counted} job(s) of this run answered or were skipped\n`)
} else {
  process.stdout.write(
    `${silent.length} of ${counted} job(s) of this run did not answer:\n` +
      silent.map((one) => `  ${one}\n`).join('') +
      '\nA job killed by its own timeout-minutes reports `cancelled`, which is not `failure` - so ' +
      'without this the run concludes `cancelled` and nothing is red. Every cell that job had ' +
      'measured went with the process. ADR-0222.\n',
  )
  process.exitCode = 1
}
