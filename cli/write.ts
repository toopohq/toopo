/**
 * The only thing in this repository that changes somebody else's project, and the two phases that
 * make a failure survivable.
 *
 * ---------------------------------------------------------------------------
 * Stage everything, then rename everything
 * ---------------------------------------------------------------------------
 *
 * Every file is written to a temporary name **beside its destination**, and only when every one of
 * them is on disk are they renamed into place. Beside, rather than under the operating system's
 * temporary directory, because a rename across devices is `EXDEV` and the user's project may well be
 * on a different volume from `/tmp` - which turns the one operation this file depends on being atomic
 * into a copy.
 *
 * That split is what closes three failures `breakage.ts` used to declare as breaking badly, and each
 * one closes for its own reason.
 *
 * **A folder that cannot be written to.** The failure now happens during staging, where nothing has
 * been committed, so it is a refusal with a sentence and an untouched project rather than an `EACCES`
 * with a stack trace. This is not a pre-flight writability check contradicted afterwards by the write
 * - the shape this repository refuses, two answers to one question. It is the write itself, taken in a
 * phase whose whole property is that abandoning it costs nothing.
 *
 * **A process killed part-way.** A single file is never half-written: it is renamed or it is not.
 * What remains is the window in which some files carry the new bytes and others the old, and the
 * lockfile is renamed last so that window always resolves *backwards* - the lockfile still describes
 * the old install. `update` closes it on the next run rather than with a journal: a file whose bytes
 * are exactly the ones we are about to write is not a local modification, it is a write that already
 * happened.
 *
 * **A directory where a file should go.** Measured on Windows, `rename` onto a directory is `EPERM`
 * and not something the caller can read. So the kind of what sits at the destination is asked before
 * staging, and answered as a refusal that names the path. That is a question about a *kind*, not a
 * prediction about writability, which is why it is not the shape refused above.
 *
 * ---------------------------------------------------------------------------
 * What is still not closed, and it is one line
 * ---------------------------------------------------------------------------
 *
 * A rename can fail after staging succeeded - a file held open by another process on Windows is the
 * realistic case - and at that point some files carry the new bytes. It resolves backwards like any
 * interruption, so nothing is lost; it throws rather than answering a sentence, and `breakage.ts`
 * declares it. Closing it would need every rename to be reversible, which is a journal, and the
 * interruption above is what a journal would otherwise have been for.
 */

import { existsSync, mkdirSync, renameSync, rmSync, rmdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE, writeLockfile } from './lockfile.js'

/**
 * The suffix a staged file carries. Deliberately not a `.ts` file: a compiler that met one of these
 * left behind by a hard kill would try to typecheck a fragment of somebody's dependency.
 */
export const STAGED = '.toopo-part'

export type FileToWrite = {
  /** Relative to the configured directory, with forward slashes. */
  readonly path: string
  readonly bytes: Buffer
}

/**
 * Everything one command changes on disk, committed as one act.
 *
 * The lockfile is in here rather than written by the caller afterwards, because it is the record of
 * what the other two fields did and a caller that could forget it is a caller that will.
 */
export type Commit = {
  readonly writes: readonly FileToWrite[]
  /** Paths under the configured directory this command removes. */
  readonly removals: readonly string[]
  readonly lockfile: Lockfile
}

const reasonOf = (error: unknown): string =>
  error instanceof Error && 'code' in error ? String(error.code) : String(error)

/**
 * Why the destination of a file cannot receive it. Empty when it can.
 *
 * Only the kind of what is already there, and nothing about permissions: what a process may do to a
 * path is answered by doing it, in a phase where the answer costs nothing.
 */
const destinationFaults = (full: string, path: string): readonly string[] => {
  if (existsSync(full) && statSync(full).isDirectory()) {
    return [
      `${path} is a directory in your project, and a file has to go where it is. Toopo will not ` +
        `remove a directory: move it aside and run this again.`,
    ]
  }

  return []
}

/** Every folder that this removal emptied, innermost first, up to but never including the root. */
const emptiedFolders = (root: string, from: string): readonly string[] => {
  const folders: string[] = []
  let at = dirname(from)

  while (at.startsWith(root) && at !== root) {
    folders.push(at)
    at = dirname(at)
  }

  return folders
}

/**
 * Write everything or write nothing, and say which files landed.
 *
 * The answer is the paths that were renamed into place, in the order they were, because the caller's
 * report says what happened to the project and a count would leave it saying how much.
 */
export const commit = (
  root: string,
  directory: string,
  what: Commit,
): { readonly written: readonly string[] } | { readonly faults: readonly string[] } => {
  const staged: { readonly temporary: string; readonly destination: string; readonly path: string }[] = []
  const faults: string[] = []

  for (const write of what.writes) {
    const destination = join(root, directory, write.path)
    const where = `${directory}/${write.path}`
    const kind = destinationFaults(destination, where)
    if (kind.length > 0) {
      faults.push(...kind)
      continue
    }

    const temporary = `${destination}${STAGED}`
    try {
      mkdirSync(dirname(destination), { recursive: true })
      writeFileSync(temporary, write.bytes)
      staged.push({ temporary, destination, path: where })
    } catch (error) {
      faults.push(`${where} could not be written: ${reasonOf(error)}`)
    }
  }

  const lockfileAt = join(root, LOCKFILE)
  const lockfileTemporary = `${lockfileAt}${STAGED}`
  if (faults.length === 0) {
    try {
      writeLockfile(root, what.lockfile, lockfileTemporary)
    } catch (error) {
      faults.push(`${LOCKFILE} could not be written: ${reasonOf(error)}`)
    }
  }

  if (faults.length > 0) {
    for (const entry of staged) rmSync(entry.temporary, { force: true })
    rmSync(lockfileTemporary, { force: true })

    return { faults }
  }

  for (const entry of staged) renameSync(entry.temporary, entry.destination)

  for (const path of what.removals) {
    const full = join(root, directory, path)
    rmSync(full, { force: true })

    for (const folder of emptiedFolders(join(root, directory), full)) {
      // `rmdir` refuses a folder that still holds something, which is the answer this wants: a folder
      // is tidied away exactly when the removal emptied it, and asking first would be asking a
      // question the removal has already answered.
      try {
        rmdirSync(folder)
      } catch {
        break
      }
    }
  }

  renameSync(lockfileTemporary, lockfileAt)

  return { written: staged.map((entry) => entry.path) }
}
