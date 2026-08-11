/**
 * Removing a directory that something else is still holding.
 *
 * **It is here rather than beside either caller because there are two, and they are on opposite sides
 * of the product.** `rewrite.ts` removes the folder it parsed a submission's imports in, on the path
 * that writes into somebody else's project; `temporary-project.ts` removes the project a guard
 * installed into. A copy in each would be two statements of one rule about an operating system, free to
 * drift, which is what this repository refuses everywhere else.
 *
 * ---------------------------------------------------------------------------
 * What it is for, and how it was found
 * ---------------------------------------------------------------------------
 *
 * Both removals sit in a `finally`, and a `finally` that throws replaces whatever was being returned.
 * In `rewrite.ts` that turns a rewrite which succeeded into an install which failed. In a guard it
 * reddens whichever guard happens to be running - and the mutation instrument reads a red guard as a
 * verdict, so a removal failing there produces a cell that looks exactly like a kill.
 *
 * It was found from that end. `the-commands-that-reach-the-registry-are-these-and-no-others` reddened a
 * calibration control of `cli-install` with nothing injected: all 169 assertions were collected and its
 * seven booleans were right, and the failure was `rmSync` answering `EPERM` in its teardown. Measured
 * at three reds in 139 consecutive runs of the `cli` suite alone, every one the same exception at the
 * same line.
 *
 * ---------------------------------------------------------------------------
 * Why `maxRetries` is not the mechanism
 * ---------------------------------------------------------------------------
 *
 * Node documents `maxRetries` as retrying exactly `EPERM` when `recursive` is true. Measured on node
 * v24.15.0, against a directory held as another process's working directory:
 *
 * ```
 * rmSync(root, { recursive: true, force: true })                        EPERM after 0ms
 * rmSync(root, { recursive: true, force: true, maxRetries: 10, ... })   EPERM after 0ms
 * await rm(root, { recursive: true, force: true, maxRetries: 10, ... }) removed after 634ms
 * ```
 *
 * The synchronous form answers in zero milliseconds, which is the shape of an option that was read and
 * dropped; only the asynchronous form honours it. Going asynchronous to reach it would turn this
 * folder's teardowns and every helper above them into promises, and would make `rewrite.ts`
 * asynchronous through to the decisions themselves. So the retry is taken here, and the measurement is
 * recorded beside it: the treatment `ignored.ts` gives `git check-ignore`'s exit codes and `diff.ts`
 * gives `node:util.diff`'s operation codes.
 *
 * **Half of that argument named `command.ts`, and `command.ts` is asynchronous now.** The remote port
 * made it so, and the property it was protecting survived - because what became a promise is the loop
 * around a decision and never a decision. So the reason this module stays synchronous is narrower than
 * it was and is the half that always carried the weight: `rewrite.ts` is reached from
 * `prepareInstallation`, which `fixpoint.ts` replays and which must stay callable with no process at
 * all. The count of teardowns went with the repair, on the rule this repository has retired four
 * counts on.
 *
 * ---------------------------------------------------------------------------
 * What the refusal may say
 * ---------------------------------------------------------------------------
 *
 * `EPERM` establishes that the system refused. It does not establish what holds the directory, and the
 * two candidates this repository could think of - a working directory, and the `git` subprocess an
 * install spawns - reproduced it zero times in 600 rounds outside vitest. So the message reports what
 * was seen and names no cause, which is the rule the diagnostics sweep settled: an inference offered
 * with its premise is argument, a conclusion offered alone is assertion.
 */

import { rmSync } from 'node:fs'

/**
 * A synchronous wait.
 *
 * Exported because the guard over `removeDirectory` has to hold a directory for a measurable moment
 * without an `await` either, and a guard that raced its own holder would pass without ever testing
 * anything.
 */
export const waitFor = (milliseconds: number): void => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

/**
 * How long a removal keeps asking. The wait grows linearly, so ten attempts spend
 * 50 + 100 + ... + 500 = 2 750 ms in all: long enough for the holder the guard builds to let go with
 * room to spare - measured, the removal wins that race at about 545 ms - and short enough that a
 * directory which is genuinely stuck fails the run instead of hanging it.
 */
const REMOVAL_ATTEMPTS = 10
const REMOVAL_BACKOFF = 50

/** The total this spends before giving up, derived rather than restated so the two cannot disagree. */
const spentOverAllAttempts = (REMOVAL_BACKOFF * REMOVAL_ATTEMPTS * (REMOVAL_ATTEMPTS + 1)) / 2

export const removeDirectory = (path: string): void => {
  for (let attempt = 1; ; attempt++) {
    try {
      rmSync(path, { recursive: true, force: true })
      return
    } catch (error) {
      if (attempt > REMOVAL_ATTEMPTS) {
        throw new Error(
          `${path} was still there after ${REMOVAL_ATTEMPTS} further attempts over ` +
            `${spentOverAllAttempts}ms. The last answer from the operating system is the cause of ` +
            `this error; what holds the directory is not something this can observe, so it says ` +
            `nothing about it.`,
          { cause: error },
        )
      }

      waitFor(REMOVAL_BACKOFF * attempt)
    }
  }
}
