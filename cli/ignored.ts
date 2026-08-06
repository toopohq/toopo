/**
 * Whether the folder this tool just wrote into is one the user's git will refuse to commit.
 *
 * ---------------------------------------------------------------------------
 * A decision this repository had recorded, reversed on a measurement
 * ---------------------------------------------------------------------------
 *
 * `report.ts` used to say that reading a `.gitignore` would mean spawning git inside somebody else's
 * repository to answer a question one sentence answers better - and it printed that sentence:
 * *Commit toopo.json, toopo.lock and <directory>/*. It was right about the danger and its remedy is
 * what failed. Measured, on git 2.49.0, in a project whose `.gitignore` holds `lib/`:
 *
 * ```
 * toopo add string/slugify        ->  + lib/toopo/string/slugify/slugify.ts
 * git check-ignore -v <that file> ->  .gitignore:2:lib/  lib/toopo/.../slugify.ts
 * git add -A ; git ls-tree -r HEAD ->  .gitignore  package.json  toopo.json  toopo.lock
 * ```
 *
 * The lockfile is committed and the source is not, so the next clone gets a lockfile describing files
 * that are not there - which is the exact trap that sentence was written to prevent, happening while
 * the sentence is on screen telling them to commit a folder their project will not accept. **A
 * decision whose premise is falsified is reversed rather than argued with**, and the description of
 * the trap it carried was right and is kept.
 *
 * `lib/` with no leading slash matches *any* directory of that name at any depth, so `src/lib/toopo`
 * is ignored by it too: both branches of `proposeDirectory` are exposed, not only the one that looked
 * exposed.
 *
 * ---------------------------------------------------------------------------
 * git answers this, and nothing else may
 * ---------------------------------------------------------------------------
 *
 * Reading `.gitignore` here was refused rather than attempted. Negations, `**`, anchoring, nested
 * `.gitignore` files, `.git/info/exclude` and the user's global excludes are a semantics this
 * repository does not own, and a second statement of what git means by *ignored* would drift from the
 * first. **A false "your folder is ignored" is worse than silence**, because it teaches its reader to
 * ignore what this tool says.
 *
 * ---------------------------------------------------------------------------
 * What it costs, and the promise it does not break
 * ---------------------------------------------------------------------------
 *
 * `command.ts` says everything this tool **decides** is reachable from a guard with no process, no
 * working directory and no clock. This is not a decision: no file, no byte and no lockfile entry
 * depends on the answer, and `an-installation-is-the-same-with-git-and-without` measures that rather
 * than asserting it. What the answer changes is one paragraph of advice.
 *
 * Three outcomes and no fourth. git absent, or a folder that is not in a repository, is **silence** -
 * never a claim, because the reader cannot check this one themselves.
 *
 * ---------------------------------------------------------------------------
 * The flag that is not passed, measured rather than deduced from its name
 * ---------------------------------------------------------------------------
 *
 * `git check-ignore` consults the index by default, so a file that is already tracked is **not**
 * reported as ignored even when a pattern matches it. That is exactly the wanted behaviour: a project
 * that force-added its installed folder has committed it, and nothing needs saying. `--no-index` turns
 * that off, and its name reads like *do not be confused by the index*. Measured on git 2.49.0, over a
 * file matching `lib/` and committed with `git add -f`:
 *
 * ```
 * git check-ignore -q <file>             -> 1   not ignored, because it is tracked
 * git check-ignore -q --no-index <file>  -> 0   ignored, which would be a false warning
 * ```
 *
 * So no flag beyond `-q`, and the reason is on the record rather than in somebody's memory.
 *
 * ---------------------------------------------------------------------------
 * One path, and it is the configured directory
 * ---------------------------------------------------------------------------
 *
 * **`-q` refuses more than one pathname**: `fatal: --quiet is only valid with a single pathname`, exit
 * **128**. Asking about every file an install wrote in one call would therefore have answered 128 -
 * which this module reads as *git cannot say* and prints nothing for. That is exactly the silence it
 * exists to end, arriving through its own front door, and it was found by measuring rather than by
 * reading the manual page.
 *
 * The directory is the right single path because **git answers for a directory out of the index too**.
 * Measured in one repository whose `.gitignore` holds `lib/`, after force-adding a file under `lib/a`:
 *
 * ```
 * git check-ignore -q lib/a  -> 1   it holds a tracked file, so nothing needs saying
 * git check-ignore -q lib/c  -> 0   same pattern, nothing tracked inside
 * ```
 *
 * So a project that force-added its installed folder is silent, and one that has not is told - without
 * this module ever enumerating what an install wrote.
 */

import { spawnSync } from 'node:child_process'

import { LOCKFILE } from './lockfile.js'

/**
 * The exit codes `git check-ignore` answers with, pinned because this repository depends on them.
 *
 * It is the treatment `node:util.diff`'s operation codes already received, for the same reason: an
 * external tool's convention that is assumed rather than pinned is one that changes underneath a
 * silent code path. Confusing `NOT_IGNORED` with an error would produce exactly the silence this
 * module exists to end.
 */
export const CHECK_IGNORE = { IGNORED: 0, NOT_IGNORED: 1 } as const

/**
 * Whether git ignores this path, or `null` when git cannot say.
 *
 * `null` is every other answer there is: git is not installed, the folder is not in a repository, or
 * the command failed for a reason this module deliberately does not enumerate. The caller prints
 * nothing for it.
 *
 * The path is given relative to the project root and the command runs there, which is what makes a
 * project nested inside a larger repository answer for itself - measured on a monorepo layout, where
 * the pattern lives in the repository's own `.gitignore` two folders up.
 */
export const gitIgnores = (root: string, path: string): boolean | null => {
  const done = spawnSync('git', ['check-ignore', '-q', '--', path], {
    cwd: root,
    encoding: 'utf8',
    // No shell, so no path is ever parsed by one - the sentence `breakage.ts` carries about every
    // file operation in this repository holds for the one subprocess an install now spawns.
    shell: false,
  })

  if (done.error !== undefined) return null
  if (done.status === CHECK_IGNORE.IGNORED) return true
  if (done.status === CHECK_IGNORE.NOT_IGNORED) return false

  return null
}

/** What git says about the two things a project has to commit for a clone to be usable. */
export type CommitStanding = {
  readonly directory: boolean | null
  /** `null` when it was not asked, which is every run where the folder is not ignored. */
  readonly lockfile: boolean | null
}

/**
 * Nothing was asked, which is a different thing from git having no answer and reads the same here.
 *
 * It is what the showing half of an update passes: that run wrote nothing, so there is nothing on
 * disk for git to have an opinion about yet.
 */
export const GIT_WAS_NOT_ASKED: CommitStanding = { directory: null, lockfile: null }

/**
 * The folder, and - only when git refuses it - the lockfile beside it.
 *
 * **The second question exists because the screen was answering it without asking.** *what was just
 * written will not be committed - and toopo.lock will be* is two claims about the user's repository
 * and git had been consulted about one of them. The whole warning rests on the second: a lockfile that
 * is committed while the folder is not is what leaves the next clone naming files that are not there,
 * and a project that ignores both has no such trap and needs a different sentence. It costs one more
 * `check-ignore`, on the one branch that says anything about the lockfile, and `-q` takes a single
 * pathname so it could not have been folded into the first call anyway.
 */
export const whatGitIgnores = (root: string, directory: string): CommitStanding => {
  const folder = gitIgnores(root, directory)

  return { directory: folder, lockfile: folder === true ? gitIgnores(root, LOCKFILE) : null }
}
