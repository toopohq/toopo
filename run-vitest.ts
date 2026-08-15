/**
 * The file every npm script of this repository starts vitest through.
 * ADR-0056 is why every script that starts vitest goes through this entry point.
 *
 *
 *   node run-vitest.ts run --config site/vitest.config.ts
 *
 * ---------------------------------------------------------------------------
 * What it is for, and who it is for
 * ---------------------------------------------------------------------------
 *
 * `vitest-entry-point.ts` carries the measurement: a lower-case Windows drive letter in the path
 * node is handed for `vitest.mjs` collapses the run, and every runtime file fails to collect. The
 * scripts used to reach vitest through `node_modules/.bin`, whose shim derives that path from
 * wherever PATH found it - so the spelling was inherited from the launcher, and an ordinary
 * `npm run site` was seen collapsing exactly that way.
 *
 * **It is written for somebody who has never seen this repository.** For us the failure is loud
 * rather than dangerous: the run exits non-zero having collected nothing, so no verdict is ever
 * built on it. For a stranger who clones this on the day it is published, types `npm run site` and
 * reads `TypeError: Cannot read properties of undefined (reading 'config')`, it is five minutes with
 * no explanation and no relation to what they just did, on a project whose front page sells
 * verifiability. That reframing is what moved this ahead of the rest, and it is the whole of why a
 * failure that announces itself is worth turning into no failure at all.
 *
 * ---------------------------------------------------------------------------
 * Why this and the instrument's own child command stay separate
 * ---------------------------------------------------------------------------
 *
 * `mutation/run.ts` also starts vitest, and it does **not** go through this file. It needs pipes to
 * read a report back, a pinned `TZ` in the child's environment, a json reporter named alongside the
 * default one, and an output file whose path it chooses - none of which a launcher forwarding a
 * command line can express, and all of which are load-bearing where they are.
 *
 * So **what is shared is the rule, not the launching**: both import `THE_VITEST_ENTRY_POINT` and
 * neither restates it. Writing that down is worth more than the separation itself - without it,
 * somebody merges the two in six months believing they are simplifying, and they will look right
 * while doing it.
 */

import { spawnSync } from 'node:child_process'

import { THE_VITEST_ENTRY_POINT } from './vitest-entry-point.ts'

/**
 * The command line is forwarded verbatim, because every option this repository passes vitest is
 * decided by the script that typed it and none of it is this file's business.
 */
const done = spawnSync(process.execPath, [THE_VITEST_ENTRY_POINT, ...process.argv.slice(2)], {
  stdio: 'inherit',
})

if (done.error !== undefined) {
  process.stderr.write(`vitest could not be started: ${done.error.message}\n`)
}

/**
 * A child killed by a signal reports no status, and a run that was interrupted did not pass. The
 * fallback is what keeps an interruption from reading as a green suite to whoever called this.
 */
process.exit(done.status ?? 1)
