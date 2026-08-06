/**
 * A project to install into, made and removed by a guard. Test support, and nothing else imports it.
 *
 * It is under the operating system's temporary directory rather than under this repository, for the
 * reason the folder's vitest configuration already gives: a suite that writes inside the repository
 * would be a suite the mutation instrument runs a hundred times against a working tree it also
 * checks out.
 */

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import type { Installation } from './install.js'
import { filesToWrite, lockfileAfter } from './install.js'
import { commit } from './write.js'

export type TemporaryProject = {
  readonly root: string
  readonly configuration: Configuration
  /** Write a file into the project, creating whatever folders it needs. */
  readonly write: (path: string, text: string) => void
  /** The text of a file under the configured directory. */
  readonly installed: (path: string) => string
  readonly remove: () => void
}

export const EMPTY_LOCKFILE: Lockfile = { version: LOCKFILE_VERSION, features: [] }

/**
 * The file a guard runs when it wants the command rather than the function.
 *
 * Here rather than in whichever suite needed it first, because two of them do: everything else in this
 * folder measures a value, and the two guards that measure a *screen* both have to spawn the real
 * entry point.
 */
export const THE_ENTRY_POINT = join(import.meta.dirname, 'toopo.ts')

/** The instant every guard records, so that two runs of one guard produce one lockfile. */
export const A_PINNED_INSTANT = '2026-08-03T00:00:00.000Z'

/**
 * Commit an installation the way the command does, and answer the lockfile it leaves behind.
 *
 * Through `commit` rather than through a `writeFileSync` of its own, so that every guard which sets a
 * project up goes through the staging the real command goes through - a fixture that wrote files
 * directly would be a fixture measuring a path the product does not take.
 */
export const committing = (
  project: TemporaryProject,
  installation: Installation,
  lockfile: Lockfile = EMPTY_LOCKFILE,
): Lockfile => {
  const after = lockfileAfter(lockfile, installation.features)
  const written = commit(project.root, project.configuration.directory, {
    writes: filesToWrite(installation),
    removals: [],
    leaving: null,
    lockfile: after,
    configuration: null,
  })

  if ('faults' in written) throw new Error(written.faults.join('\n'))

  return after
}

/**
 * A synchronous wait. Exported because the guard over `removeDirectory` has to hold a directory for a
 * measurable moment without an `await` either - a teardown runs in a `finally`, and a `finally` that
 * returned a promise would be a teardown the guard above it does not wait for.
 */
export const waitFor = (milliseconds: number): void => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

/**
 * How long a removal keeps asking. The wait grows linearly, so ten attempts spend 50 + 100 + ... + 500
 * = 2 750 ms in all: long enough for the holder measured below to let go with room to spare, and short
 * enough that a directory which is genuinely stuck fails the run instead of hanging it.
 */
const REMOVAL_ATTEMPTS = 10
const REMOVAL_BACKOFF = 50

/**
 * Remove a directory, asking again while the operating system refuses.
 *
 * **This is a teardown, and a teardown that throws reddens whichever guard happens to be running.**
 * That is not a tidiness argument. The mutation instrument reads a red guard as a verdict, so a
 * removal failing in a `finally` produces a cell that looks exactly like a kill - the third member of
 * the family `run.ts` already names twice, arriving from the apparatus rather than from the contract.
 * It was found that way: `the-commands-that-reach-the-registry-are-these-and-no-others` reddened a
 * calibration control with nothing injected, and the failure was `rmSync`, not the assertion.
 *
 * **Why this is written here rather than passed to `rmSync`.** Node documents `maxRetries` as retrying
 * exactly `EPERM` when `recursive` is true. Measured on node v24.15.0, against a directory held as
 * another process's working directory:
 *
 * ```
 * rmSync(root, { recursive: true, force: true })                        EPERM after 0ms
 * rmSync(root, { recursive: true, force: true, maxRetries: 10, ... })   EPERM after 0ms
 * await rm(root, { recursive: true, force: true, maxRetries: 10, ... }) removed after 634ms
 * ```
 *
 * The synchronous form answers in zero milliseconds, which is the shape of an option that was read and
 * dropped; only the asynchronous form honours it. Making this asynchronous would turn all 43 teardowns
 * of this folder and every helper above them into promises to route around that, so the retry is taken
 * here and the measurement is recorded beside it - the treatment `ignored.ts` already gives
 * `git check-ignore`'s exit codes and `diff.ts` gives `node:util.diff`'s operation codes.
 *
 * **What the refusal may say.** `EPERM` establishes that the system refused; it does not establish what
 * holds the directory, and 600 rounds of the two candidates this repository could think of - the
 * working directory, and the `git` subprocess an install spawns - reproduced it zero times outside
 * vitest. So the message reports what was seen and names no cause.
 */
export const removeDirectory = (path: string): void => {
  for (let attempt = 1; ; attempt++) {
    try {
      rmSync(path, { recursive: true, force: true })
      return
    } catch (error) {
      if (attempt > REMOVAL_ATTEMPTS) {
        const spent = (REMOVAL_BACKOFF * REMOVAL_ATTEMPTS * (REMOVAL_ATTEMPTS + 1)) / 2

        throw new Error(
          `${path} was still there after ${REMOVAL_ATTEMPTS} further attempts over ${spent}ms. ` +
            `The last answer from the operating system is the cause of this error; what holds the ` +
            `directory is not something this helper can observe, so it says nothing about it.`,
          { cause: error },
        )
      }

      waitFor(REMOVAL_BACKOFF * attempt)
    }
  }
}

export const aProject = (directory = 'src/lib/toopo'): TemporaryProject => {
  const root = mkdtempSync(join(tmpdir(), 'toopo-project-'))

  return {
    root,
    configuration: { version: 1, directory },
    write: (path, text) => {
      const full = join(root, path)
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, text, 'utf8')
    },
    installed: (path) => readFileSync(join(root, directory, path), 'utf8'),
    remove: () => {
      removeDirectory(root)
    },
  }
}
