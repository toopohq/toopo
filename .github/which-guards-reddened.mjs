/**
 * Which guards answered and which reddened, read off the report rather than off a job's conclusion.
 *
 * The suite is expected red on both platforms, because `a-refusal-lets-the-process-end-…` is portable
 * by construction - `beforeExit` is skipped by `process.exit` anywhere. So a conclusion says nothing:
 * what is being read is the *set* of reddened guards, and whether the two platforms disagree about it.
 *
 * The shape of the report is the one `mutation/run.ts` already parses - `testResults[].assertionResults[]`
 * with a `title` and a `status` - and the two statuses that mean a guard spoke are its two, for the
 * reason it gives: naming the whole of vitest's union here would be a declaration that goes stale in
 * silence.
 */

import { readFileSync } from 'node:fs'

/**
 * Named by the caller, because vitest resolves `--outputFile.json` against the *configuration's* root
 * and not the repository's - so a path written here would be this file guessing where another one
 * decided to put something. Found by running it: the report landed in `packages/cli/`.
 */
const THE_REPORT = process.argv[2]

if (THE_REPORT === undefined) {
  throw new Error('the report to read is the one argument this takes, and it was not given.')
}

const AN_ANSWER = new Set(['passed', 'failed'])

const report = JSON.parse(readFileSync(THE_REPORT, 'utf8'))

const answered = (report.testResults ?? []).flatMap((file) =>
  (file.assertionResults ?? [])
    .filter((assertion) => AN_ANSWER.has(assertion.status))
    .map((assertion) => ({ title: assertion.title, status: assertion.status })),
)

if (answered.length === 0) {
  throw new Error(
    `${THE_REPORT} carries no guard that answered, so this leg measured the apparatus rather than ` +
      'the defect.',
  )
}

process.stdout.write(`platform: ${process.platform}\n\n`)
for (const { title, status } of answered) {
  process.stdout.write(`${status === 'failed' ? 'RED  ' : 'green'}  ${title}\n`)
}

const red = answered.filter(({ status }) => status === 'failed').map(({ title }) => title)
process.stdout.write(`\nreddened ${red.length} of ${answered.length}\n`)
for (const title of red) process.stdout.write(`  ${title}\n`)
