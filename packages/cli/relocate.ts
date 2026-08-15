/**
 * What moves when the configured folder does, decided before a single byte does.
 * ADR-0041 is what a folder change moves, and the one part it leaves.
 *
 *
 * ---------------------------------------------------------------------------
 * The hole this closes, and why only `init` can close it
 * ---------------------------------------------------------------------------
 *
 * A user whose folder is ignored by git is told, on the screen that has just written into it, to *pick
 * a folder that is committed with `toopo init --dir <path>`. They obey, and before this module the
 * installed copy stayed where it was, claimed by nobody: `toopo.lock` records each file's path relative
 * to the configured directory and never the directory itself, so the entry went on being valid and
 * pointed somewhere else. `toopo list` then called every file *missing* and offered `toopo update
 * --apply`, which put a second copy in the new folder and left the first inside the folder git ignores
 * - invisible to `git status`, to `toopo list`, and to everything else, for ever. One hole was closed
 * by opening the next one a floor down.
 *
 * **`init` is the only command that can ever see both folders.** Once `toopo.json` is written the old
 * path is recoverable from nothing on disk - the sentence `configurationToInstallUnder` already carries
 * about a lockfile with no configuration beside it. So a relocation that is not taken here cannot be
 * taken later by anything, which is what disqualifies reporting the orphan and leaving it to the user:
 * there would be no command for them to run.
 *
 * ---------------------------------------------------------------------------
 * A relocation is a renaming, and that was measured rather than hoped
 * ---------------------------------------------------------------------------
 *
 * Nothing that decides a byte can see the configured directory. `plan.ts`, `rewrite.ts` and
 * `resolve.ts` never read it; every use in this folder is a `join` to reach the disk, a line to print,
 * or a `commit`. So the directory is a prefix applied last, and moving the tree moves nothing else.
 *
 * Measured at both ends. The same contract installed under two different folders leaves a lockfile that
 * is identical byte for byte once `installedAt` is pinned, and files identical byte for byte. And on
 * the imagined graph - five files, six cross-feature specifiers including the repointed
 * `../../string/pad/digits.js` that deduplication produces - renaming the whole tree and changing
 * nothing else gives `toopo update`: nothing moved, no file to write, no file to remove, every verdict
 * `unchanged`, lockfile identical. **So this module rewrites no import, recomputes no digest, and asks
 * the registry nothing** - which is what keeps `init` in the pair with `list`, the commands that need
 * no server.
 *
 * ---------------------------------------------------------------------------
 * Four answers about a file, and the third is designed for the interruption
 * ---------------------------------------------------------------------------
 *
 *   source there, destination free        moved          write it across, take the old one
 *   source there, destination is ours     already-moved  take the old one, write nothing
 *   source there, destination is not      refused        the whole relocation, naming the path
 *   source not on disk                    not-on-disk    nothing to move and nothing to refuse
 *
 * **`already-moved` is not permissiveness, and a future reader would take it for some.** `commit`
 * renames every staged file into place and only then removes the old copies, so a run killed between
 * those two phases leaves the files at *both* paths with `toopo.json` still naming the old folder.
 * Without this answer the retry would meet a destination that is occupied and refuse - the project
 * stuck, by the very rule that exists to protect it, on a state this tool produced itself. With it the
 * retry resolves forwards. It is `PlannedWrite.alreadyOnDisk` and `update`'s `already-written` arriving
 * at a third case: **bytes we were about to write, already written, are a write that happened and never
 * somebody's file.**
 *
 * **A file that is not on disk is not compared against anything**, and that is what keeps the refusal
 * honest. There is nothing to move, so nothing is written, so nothing is overwritten - whatever sits at
 * the destination becomes the project's business under the ordinary rules, where `update` will call it
 * a conflict if it is somebody's own file. Comparing it here would need bytes this module does not have:
 * a file the user edited hashes to neither of the lockfile's two digests, and refusing on that would
 * strand exactly the project this unit exists for.
 *
 * ---------------------------------------------------------------------------
 * What is compared, and what is written, are not the same bytes
 * ---------------------------------------------------------------------------
 *
 * The comparison is over the served normalisation, because `canonical.ts` imposes that on this whole
 * folder: a user whose git rewrites checkouts to CRLF would otherwise see two identical copies of one
 * file disagree. What is *written* is the source's own bytes, read and carried across untouched -
 * normalising on the way would silently rewrite the line endings of somebody who is only moving a
 * folder, and a move that edits a file is not a move.
 *
 * That is also what makes this correct on a project the user has edited, which is the property the two
 * refused designs could not have: an edited file is carried across as it is, and `toopo list` goes on
 * reporting it `edited` at its new path.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Lockfile } from '../registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import { digestOnDisk } from './lockfile.js'
import type { FileToWrite } from './write.js'

/** What became of one file the lockfile claims. */
export type MoveVerdict = 'moved' | 'already-moved' | 'not-on-disk'

export type FileMove = {
  /** Relative to the configured directory, with forward slashes - the same on both sides of the move. */
  readonly path: string
  readonly verdict: MoveVerdict
  /** The bytes to write at the destination, or `null` when this verdict writes nothing. */
  readonly bytes: Buffer | null
}

export type Relocation = {
  /** The folder being left, relative to the project root. */
  readonly from: string
  readonly to: string
  readonly moves: readonly FileMove[]
}

export type RelocationOutcome =
  | { readonly relocation: Relocation }
  | { readonly faults: readonly string[] }

export type FolderChange =
  | { readonly moving: Moving }
  /** The folder is not changing, nothing is installed, or nothing that is installed is on disk. */
  | { readonly nothingToMove: true }
  | { readonly faults: readonly string[] }

const verdictOf = (
  root: string,
  from: string,
  to: string,
  path: string,
): MoveVerdict | { readonly fault: string } => {
  const source = digestOnDisk(root, from, path)
  if (source === null) return 'not-on-disk'

  const destination = digestOnDisk(root, to, path)
  if (destination === null) return 'moved'
  if (destination === source) return 'already-moved'

  // Not *a file toopo did not write*: the two digests differ, which says the destination is not this
  // file and never who put it there. A folder restored from git after a `--dir` there and back holds
  // a file toopo wrote, at bytes that have since moved.
  return {
    fault:
      `${to}/${path} is already there and holds different bytes, so moving ${from}/${path} onto it ` +
      `would replace it. Move it aside, or name a different folder.`,
  }
}

/**
 * Every file `toopo.lock` claims, and what changing the configured folder does to it.
 *
 * The whole relocation is refused as one, rather than the offending files being skipped: a project half
 * in one folder and half in another is a state no command afterwards could describe, and the caller has
 * written nothing at the point this answers.
 */
export const planRelocation = (
  root: string,
  from: string,
  to: string,
  lockfile: Lockfile,
): RelocationOutcome => {
  const moves: FileMove[] = []
  const faults: string[] = []

  for (const feature of lockfile.features) {
    for (const file of feature.files) {
      const verdict = verdictOf(root, from, to, file.path)

      if (typeof verdict !== 'string') {
        faults.push(verdict.fault)
        continue
      }

      moves.push({
        path: file.path,
        verdict,
        bytes: verdict === 'moved' ? readFileSync(join(root, from, file.path)) : null,
      })
    }
  }

  return faults.length > 0 ? { faults } : { relocation: { from, to, moves } }
}

/** A folder change with something to move, and the lockfile the commit carries across unchanged. */
export type Moving = {
  readonly relocation: Relocation
  readonly lockfile: Lockfile
}

/**
 * What `toopo init` does to what is already installed: move it, refuse, or leave it alone.
 *
 * Three arms rather than a nullable answer, because *nothing to move* is a decision and not an absence
 * - and because `command.ts` states that everything this tool decides is reachable from a guard with no
 * process. A precondition read inside the entry point would be the first thing to leave that behind.
 *
 * Three things must hold before a folder can move: one was configured, something is installed, and the
 * folder being asked for is not the one already there. A project holding a lockfile and no
 * configuration is the state `configurationToInstallUnder` refuses, and `init --dir` is what repairs
 * it - there is no old folder to move from, which is precisely why only the user can name the new one.
 */
export const whatMoves = (
  root: string,
  held: Configuration | null,
  to: Configuration,
  lockfile: Lockfile | null,
): FolderChange => {
  if (held === null || lockfile === null || held.directory === to.directory) {
    return { nothingToMove: true }
  }

  const planned = planRelocation(root, held.directory, to.directory, lockfile)
  if ('faults' in planned) return planned

  return planned.relocation.moves.some((move) => move.verdict !== 'not-on-disk')
    ? { moving: { relocation: planned.relocation, lockfile } }
    : { nothingToMove: true }
}

/**
 * The files a relocation writes at the destination.
 *
 * `already-moved` is absent, for the reason `filesToWrite` leaves out a file already holding our bytes:
 * rewriting it would be a changed timestamp under a line saying the file was already there, and this
 * repository does not print one thing and do another.
 */
export const filesToMove = (relocation: Relocation): readonly FileToWrite[] =>
  relocation.moves
    .filter((move) => move.bytes !== null)
    .map((move) => ({ path: move.path, bytes: move.bytes as Buffer }))

/** The paths a relocation takes out of the folder being left, which is every copy that now exists elsewhere. */
export const pathsLeftBehind = (relocation: Relocation): readonly string[] =>
  relocation.moves.filter((move) => move.verdict !== 'not-on-disk').map((move) => move.path)
