import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { A_NAME_THE_CATALOGUE_DOES_NOT_HOLD, ROUND } from '../registry/imagined-addresses.js'
import { imaginedSource } from './imagined-source.js'
import { servingOverHttp } from './serving-over-http.js'

/**
 * How a command ends, which is the half of this tool no guard here could see until ADR-0168.
 *
 * ---------------------------------------------------------------------------
 * The defect these were written from
 * ---------------------------------------------------------------------------
 *
 * `toopo add` of a name the registry does not hold refused correctly, said the right sentence and wrote
 * nothing - and then aborted. On win32, `process.exit` called after a `fetch` races the teardown of
 * what that connection left behind, and node dies on an assertion in `src/win/async.c` with an exit
 * code of `0xC0000409` - which git-bash reports as `127`, the code a POSIX shell keeps for *command not
 * found*. So a mistyped contract name told a CI script that `toopo` was not installed.
 *
 * **Every guard over that refusal was green through all of it**, because every one stopped at the
 * sentence. `command.test.ts` could not have caught it either, and not by oversight: it calls `run` in
 * the test's own process, where `process.exit` had to be replaced by a throw for the suite to survive
 * one command - so the exit code was a stand-in and the ending was not observed at all.
 *
 * ---------------------------------------------------------------------------
 * What each of these three establishes, and what it leaves to its neighbour
 * ---------------------------------------------------------------------------
 *
 * The first is the crash: it reads the exit code and the error stream of a real process, and it is what
 * the defect looked like from outside. **Its red is not portable and that is written down rather than
 * discovered** - the abort is libuv's Windows implementation, and no leg of this repository's CI runs
 * on it. On an ubuntu runner the first guard is green either side of the repair.
 *
 * The second is why, and it is portable. `beforeExit` runs when the loop has nothing left to do, and is
 * skipped by both of the endings ADR-0168 is about: `process.exit` and an uncaught throw. So *the
 * process was killed rather than finished* is observable on any platform, which is what makes this the
 * one of the three that reddens in CI.
 *
 * The third is the control, and it is not a formality. The first two are about a command that refuses;
 * a repair that ended every process the same way by never letting one succeed would satisfy both.
 *
 * ---------------------------------------------------------------------------
 * Why these three spend a process where the rest of the folder spends none
 * ---------------------------------------------------------------------------
 *
 * `command.ts` is thin so that everything it decides is reachable with no process, no working directory
 * and no clock, and every other guard here takes it up on that. An exit code, an aborted process and a
 * stack on the error stream are facts about a process and about nothing else. `a-client-over-http.ts`
 * carries why the client under measurement is a file of its own and why it never ships.
 */

const HERE = dirname(fileURLToPath(import.meta.url))
const THE_CLIENT = join(HERE, 'a-client-over-http.ts')

/** What one run of the client left behind. */
type Ended = {
  readonly status: number | null
  /** `null` unless the operating system killed it, which an abort on Windows does not do. */
  readonly signal: NodeJS.Signals | null
  readonly stdout: string
  readonly stderr: string
  /** Whether `beforeExit` ran, which is whether the process was allowed to end rather than stopped. */
  readonly wasAllowedToEnd: boolean
}

/**
 * Run the client against a registry this process is serving, and answer how it ended.
 *
 * **Asynchronous, and that is a correctness condition rather than a preference.** The server answering
 * these requests lives in this same process, so a synchronous spawn would block the event loop that has
 * to accept the connection its own child opens - a deadlock that reads exactly like a client hanging.
 */
const ending = async (...words: readonly string[]): Promise<Ended> => {
  const serving = await servingOverHttp(imaginedSource())
  const beside = mkdtempSync(join(tmpdir(), 'toopo-ending-'))
  const record = join(beside, 'ending.txt')

  try {
    return await new Promise<Ended>((resolve, reject) => {
      const client = spawn(process.execPath, [THE_CLIENT, ...words], {
        cwd: beside,
        env: {
          ...process.env,
          THE_ORIGIN_UNDER_MEASUREMENT: serving.origin,
          WHERE_TO_RECORD_THE_ENDING: record,
        },
      })

      let stdout = ''
      let stderr = ''

      client.stdout.setEncoding('utf8')
      client.stderr.setEncoding('utf8')
      client.stdout.on('data', (chunk: string) => (stdout += chunk))
      client.stderr.on('data', (chunk: string) => (stderr += chunk))
      client.on('error', reject)
      client.on('close', (status, signal) => {
        resolve({ status, signal, stdout, stderr, wasAllowedToEnd: existsSync(record) })
      })
    })
  } finally {
    await serving.close()
    rmSync(beside, { recursive: true, force: true })
  }
}

describe('how a command ends', () => {
  /**
   * The defect, read from outside the process exactly as somebody running `toopo` reads it.
   *
   * Three claims and not one, because the crash broke all three and a guard reading only the code would
   * pass on a process that printed an assertion beside a correct refusal. `1` is what a refusal means;
   * `null` for the signal is *nothing killed it*, which an abort on Windows is not; and an empty error
   * stream is the whole of what the abort had to say.
   *
   * **Both refusals are run, and the second is the one that reddens here - which is not the one a
   * person met.** The abort is a race between `process.exit` and the teardown of what a connection left
   * behind, so which arrangement loses it is a fact about latency rather than about the command.
   * Measured at `d962426` with `process.exit(1)` back in `refuse`: against `toopo.dev`, asking for a
   * name the registry does not hold aborts three times in three and the unknown implementation is
   * clean; against a registry on this machine's own loopback the two swap over, the unknown
   * implementation aborting five times in five. **Anybody narrowing this guard to the command in the
   * bug report would lose its red without losing its green.**
   */
  it('a-refusal-that-reached-the-registry-exits-one-and-says-nothing-on-the-error-stream', async () => {
    const refusals = [
      ['add', A_NAME_THE_CATALOGUE_DOES_NOT_HOLD.name],
      ['add', ROUND.name, '--implementation', 'nothing-implements-it'],
    ] as const

    for (const words of refusals) {
      const asked = `toopo ${words.join(' ')}`
      const ended = await ending(...words)

      expect(ended.stdout, asked).toContain('Refused, and nothing was written.')
      expect(ended.stderr, asked).toBe('')
      expect(ended.signal, asked).toBe(null)
      expect(ended.status, asked).toBe(1)
    }
  })

  /**
   * The cause, in the one form that is observable wherever this runs.
   *
   * `beforeExit` is skipped by `process.exit` and by an uncaught throw and by nothing else a command
   * here can do, so this is the claim the guard above it cannot make on a platform where libuv does not
   * abort. **It is deliberately not a second reading of the exit code**: a command that ended by being
   * killed can still have set the code a reader expects on the way, which is precisely what the defect
   * did not do and what a repair setting `process.exitCode` before a `process.exit` would do.
   *
   * Seen red at `d962426` the same way, and red on an ubuntu runner too - which is what it is for.
   */
  it('a-refusal-lets-the-process-end-rather-than-stopping-it', async () => {
    const ended = await ending('add', A_NAME_THE_CATALOGUE_DOES_NOT_HOLD.name)

    expect(ended.wasAllowedToEnd).toBe(true)
  })

  /**
   * The control, and it is what the two above are not about.
   *
   * They are both about a command that refuses. A client that never got as far as doing anything would
   * satisfy both of them, and this is the guard that says the same process, against the same registry,
   * still installs a feature and ends at `0`.
   */
  it('a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way', async () => {
    const ended = await ending('add', ROUND.name)

    expect(ended.stderr).toBe('')
    expect(ended.signal).toBe(null)
    expect(ended.status).toBe(0)
    expect(ended.wasAllowedToEnd).toBe(true)
  })
})
