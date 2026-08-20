/**
 * The guard over `removeDirectory`, which exists because the apparatus was the defect.
 *
 * `the-commands-that-reach-the-registry-are-these-and-no-others` reddened a calibration control of
 * `cli-install` with nothing injected, and the failure was not its assertion: all 169 assertions were
 * collected and the seven booleans were right. It was `rmSync` answering `EPERM` inside the guard's
 * `finally`. A teardown that throws reddens whichever guard happens to be running, and the mutation
 * instrument reads a red guard as a verdict - so a removal failing in a `finally` produces a cell that
 * looks exactly like a kill.
 *
 * **And the same `finally` is on the install path**, which is what took the repair out of test support
 * and into a module of its own: `rewrite.ts` removes the folder it parsed a submission's imports in,
 * and a throw there replaces a rewrite that worked with an install that failed. One guard covers both
 * callers, because there is one rule about the operating system and a copy in each would be two.
 *
 * **The rate it was found at.** Three reds in 139 consecutive runs of this suite alone, 2.16 per cent,
 * every one of them this same exception at this same line. It had been recorded as a leak of state
 * between batteries on the strength of thirty clean runs; at that rate thirty clean runs happen half
 * the time, so the reading was an artefact of the sample and not a signature.
 *
 * **Why the hold is established rather than raced.** A guard that spawned a holder and removed the
 * directory immediately would usually remove it before the holder ever ran, pass, and prove nothing -
 * which is the one thing this repository refuses more than a defect. The holder writes a sentinel
 * beside the project first, and nothing is removed until that sentinel is there.
 */

import { spawn } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { removeDirectory, waitFor } from './remove-directory.js'
import { aProject } from './temporary-project.js'

/**
 * How long the holder keeps the directory after it has said it is there.
 *
 * It has to outlast the first attempt, which is immediate, and sit well inside the ten attempts
 * `removeDirectory` spends 2 750 ms over. Measured, the removal wins this race at about 545 ms.
 */
const HELD_FOR = 400

/** Attempts of five milliseconds, so a holder that never starts fails the guard instead of hanging it. */
const UNTIL_HELD = 400

const holderProgram = (sentinel: string): string =>
  `require('fs').writeFileSync(${JSON.stringify(sentinel)}, 'holding')` +
  `;setTimeout(() => {}, ${HELD_FOR})`

describe('removing a temporary project', () => {
  /**
   * The removal outlives a directory something else is holding.
   *
   * A process's working directory cannot be removed on Windows, and the refusal is `EPERM` - the exact
   * answer the suite was getting. Seen red by taking the retry away: `removeDirectory` then answers
   * `EPERM` after zero milliseconds, which is also what `rmSync`'s own `maxRetries` does on node
   * v24.15.0 and is why that option is not the mechanism here.
   */
  it('a-project-is-removed-while-another-process-still-holds-it', () => {
    const project = aProject()
    project.write('src/lib/toopo/imagined-number/round.ts', 'export const round = (n: number) => n\n')

    const sentinel = `${project.root}.holding`
    const holder = spawn(process.execPath, ['-e', holderProgram(sentinel)], {
      cwd: project.root,
      stdio: 'ignore',
    })

    try {
      for (let attempt = 0; attempt < UNTIL_HELD && !existsSync(sentinel); attempt++) waitFor(5)

      expect(existsSync(sentinel)).toBe(true)

      project.remove()

      expect(existsSync(project.root)).toBe(false)
    } finally {
      holder.kill()
      rmSync(sentinel, { force: true })
      removeDirectory(project.root)
    }
  })
})
