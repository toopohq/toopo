/**
 * The only thing in this repository that changes somebody else's project, and the two phases that
 * ADR-0039 is why the configuration goes through the two phases rather than beside them.
 *
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
 * One commit that spans two folders, and the folder it abandons
 * ---------------------------------------------------------------------------
 *
 * Every command but one writes and removes under the same configured folder. `toopo init --dir` moving
 * that folder is the exception: the files land under the new one and leave the old one, in one act. So
 * `Commit` names the folder being left rather than deriving it - a required field with `null` for *not
 * moving*, which is the shape `Commit.configuration` already takes and for the same reason. A caller
 * that could omit it is a caller that will, and the alternative - two folder fields, five call sites
 * repeating one string - is duplication that reads like a copy-paste rather than like a decision.
 *
 * **A folder that is being left is removed when the removals emptied it, and that is not the rule
 * `emptiedFolders` carries.** `remove` and `update` must never delete the configured folder: it goes on
 * being the configured folder, and a project that installs again wants it there. Here it stops being
 * one. An abandoned folder is not an emptied folder, so the two facts are decided apart rather than
 * folded into one walk that would then be wrong for one of them.
 *
 * It goes only when it is empty, and that condition is the whole of its safety: a folder still holding
 * something is one the user put something in, so it is left where it is and the caller is told which it
 * was. `rmdir` answers that by refusing, which is the same reason `emptiedFolders` asks it that way
 * rather than looking first.
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
import type { Configuration } from './configuration.js'
import { CONFIGURATION_FILE, writeConfiguration } from './configuration.js'
import { LOCKFILE, writeLockfile } from './lockfile.js'
import { theRefusal, under } from './where-a-file-may-land.js'

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
  /** Paths this command removes, under `leaving` when there is one and under the configured directory otherwise. */
  readonly removals: readonly string[]
  /**
   * The folder this commit is leaving behind, or `null` when the configured folder is not moving.
   *
   * Set only by `toopo init --dir` on a project that holds something. It is what makes one commit span
   * two folders - the files are written under the new one and taken out of this one - and it is what
   * tells this function there is a folder to abandon at the end.
   */
  readonly leaving: string | null
  readonly lockfile: Lockfile
  /**
   * The configuration to write beside the lockfile, or `null` when the project already has one.
   *
   * It is in the commit rather than written by `add` beforehand because it is one of the files this
   * command puts into somebody's project, and a project half-configured by a run that then refused
   * would contradict the sentence every refusal ends with.
   *
   * **That second half is guarded end to end and not here, and the reason is worth writing down.** A
   * guard was written in `write.test.ts` asserting that a refused commit leaves no `toopo.json`, and
   * measured, it could not fail: every fault this function can raise is raised while staging the
   * *files*, and the block that writes the root files is behind `faults.length === 0`, so a refused
   * commit never reaches this field at all. The property is structural rather than kept, so the guard
   * was deleted instead of left green - and `add-with-a-lockfile-and-no-configuration-writes-nothing`
   * asserts it where a refusal really can arrive after something was decided.
   */
  readonly configuration: Configuration | null
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

/** A file a commit writes at the project root rather than under the configured directory. */
type RootFile = {
  readonly name: string
  readonly at: string
  readonly write: (to: string) => void
}

/**
 * The root files of a commit, in the order they are renamed into place.
 *
 * **The lockfile is last, and `toopo.json` is immediately before it.** The lockfile is last so that the
 * window an interruption leaves always resolves backwards - the record of an install arrives after the
 * thing it records. `toopo.json` is before it for the second half of the same argument: a lockfile with
 * no configuration beside it is the one state `configurationToInstallUnder` refuses, because the folder
 * its paths are relative to is not recoverable, so it must never be the state a killed run leaves
 * behind. Either order writes both or neither in the ordinary case; only the kill tells them apart.
 */
const rootFilesOf = (root: string, what: Commit): readonly RootFile[] => {
  const { configuration } = what

  return [
    ...(configuration === null
      ? []
      : [
          {
            name: CONFIGURATION_FILE,
            at: join(root, CONFIGURATION_FILE),
            write: (to: string) => writeConfiguration(root, configuration, to),
          },
        ]),
    {
      name: LOCKFILE,
      at: join(root, LOCKFILE),
      write: (to: string) => writeLockfile(root, what.lockfile, to),
    },
  ]
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

export type CommitOutcome =
  | {
      readonly written: readonly string[]
      /**
       * The folder this commit left, when it still held something and was therefore not removed.
       *
       * `null` covers both the ordinary commit, which abandons nothing, and the relocation that emptied
       * the folder it left - and the caller says nothing for either, because there is nothing a reader
       * has to know about a folder that is gone.
       */
      readonly leftBehind: string | null
    }
  | { readonly faults: readonly string[] }

/**
 * Write everything or write nothing, and say which files landed.
 *
 * The answer is the paths that were renamed into place, in the order they were, because the caller's
 * report says what happened to the project and a count would leave it saying how much.
 */
export const commit = (root: string, directory: string, what: Commit): CommitOutcome => {
  const staged: { readonly temporary: string; readonly destination: string; readonly path: string }[] = []
  const faults: string[] = []
  const removeUnder = join(root, what.leaving ?? directory)

  /**
   * Both lists are confined here, before anything is staged, and the removals are why it is here
   * rather than beside each operation.
   *
   * A write that leaves the directory can be refused where it is composed, because staging is a phase
   * whose whole property is that abandoning it costs nothing. A removal cannot: it happens after the
   * renames, where there is no longer a refusal to make - so the only place a bad one can still be
   * answered with a sentence is before the first file is written.
   */
  const removals = what.removals.map((path) => ({ path, at: under(root, what.leaving ?? directory, path) }))
  for (const removal of removals) {
    if (removal.at === null) faults.push(theRefusal('a file this command would remove', removal.path))
  }

  for (const write of what.writes) {
    const destination = under(root, directory, write.path)
    if (destination === null) {
      faults.push(theRefusal('a file this command would write', write.path))
      continue
    }

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

  const rootFiles = rootFilesOf(root, what)

  if (faults.length === 0) {
    for (const file of rootFiles) {
      try {
        file.write(`${file.at}${STAGED}`)
      } catch (error) {
        faults.push(`${file.name} could not be written: ${reasonOf(error)}`)
      }
    }
  }

  if (faults.length > 0) {
    for (const entry of staged) rmSync(entry.temporary, { force: true })
    for (const file of rootFiles) rmSync(`${file.at}${STAGED}`, { force: true })

    return { faults }
  }

  for (const entry of staged) renameSync(entry.temporary, entry.destination)

  for (const removal of removals) {
    const full = removal.at as string
    rmSync(full, { force: true })

    for (const folder of emptiedFolders(removeUnder, full)) {
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

  for (const file of rootFiles) renameSync(`${file.at}${STAGED}`, file.at)

  return { written: staged.map((entry) => entry.path), leftBehind: whatWasAbandoned(root, what.leaving) }
}

/**
 * The folder a relocation left, when it could not be taken with it.
 *
 * Asked after the removals rather than before, so the question is about the folder as this commit
 * leaves it. `rmdir` is what answers it: a folder still holding one of the user's own files refuses to
 * go, and that refusal *is* the answer rather than an error to report.
 */
const whatWasAbandoned = (root: string, leaving: string | null): string | null => {
  if (leaving === null) return null

  try {
    rmdirSync(join(root, leaving))

    return null
  } catch {
    return leaving
  }
}
