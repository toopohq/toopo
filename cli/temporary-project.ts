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
      rmSync(root, { recursive: true, force: true })
    },
  }
}
