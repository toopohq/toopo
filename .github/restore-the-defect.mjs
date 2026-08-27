/**
 * ADR-0168's defect, put back in the one line it lived on.
 *
 * The client the three guards of `packages/cli/how-a-command-ends.test.ts` spawn ends by assigning
 * `process.exitCode`. The defect is `process.exit` in its place: on win32, called after a `fetch`, it
 * races the teardown of what that connection left behind and node dies on an assertion in
 * `src/win/async.c`.
 *
 * **It refuses to substitute nothing.** A step that replaced no text and then ran a suite would report
 * a green that means the apparatus did not fire - which is the shape this whole reading exists to
 * refuse, arriving inside the demonstration that a guard is not decorative.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const THE_CLIENT = 'packages/cli/a-client-over-http.ts'

const THE_REPAIR = 'process.exitCode = await run(() => httpSource(THE_ORIGIN_UNDER_MEASUREMENT))'
const THE_DEFECT = 'process.exit(await run(() => httpSource(THE_ORIGIN_UNDER_MEASUREMENT)))'

const before = readFileSync(THE_CLIENT, 'utf8')

const occurrences = before.split(THE_REPAIR).length - 1
if (occurrences !== 1) {
  throw new Error(
    `${THE_CLIENT} holds the line to replace ${occurrences} times rather than once, so this reading ` +
      'would measure something other than ADR-0168.',
  )
}

writeFileSync(THE_CLIENT, before.replace(THE_REPAIR, THE_DEFECT), 'utf8')

process.stdout.write(`${THE_CLIENT}\n  was: ${THE_REPAIR}\n  now: ${THE_DEFECT}\n`)
