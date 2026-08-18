/**
 * Where the instrument is, spelled one way rather than however it happened to be invoked.
 * ADR-0059 is why a computed root states how far up it goes, and what it goes up from.
 *
 *
 * ---------------------------------------------------------------------------
 * What this closes, and where the measurement lives
 * ---------------------------------------------------------------------------
 *
 * `census.ts` names three ways a run of a suite here can collect a fraction of what it has, all
 * three found by accident. The fourth is a lower-case Windows drive letter in the path node is
 * handed for `vitest.mjs`, and it is the first that was named by a refusal rather than stumbled
 * into. `../vitest-entry-point.ts` carries that measurement and owns the rule; this file is one of
 * its two callers, and it applies the rule to the paths **this folder** hands its own child
 * processes.
 *
 * The instrument reaches the door through its own entry points rather than through a shell:
 *
 *     node c:\...\mutation\measure.ts fixture
 *     -> C/as-committed: this run did not collect the suite this repository declares.
 *          mutation/fixture/guards.test.ts: declared 2, collected 0
 *
 * That is from a shell whose own directory is `C:`, which is the whole of the point - the spelling
 * travels through `measure.ts`'s module URL into the path built here, and the shell never enters it.
 * Every npm script reaches vitest through `run-vitest.ts` for the same reason on the other side, so
 * both routes into this repository's suites are now spelled rather than inherited.
 *
 * The working directory below is pinned as a consequence of deriving both paths from one constant,
 * not because it was ever the input: the four cells in `../vitest-entry-point.ts` establish that the
 * entry point decides and the working directory does not. `git` was measured indifferent to the
 * spelling - the reproduction above checked arms out of a lower-case tree and reached the census.
 *
 * The census stays the backstop rather than being replaced by this. It is what caught the defect
 * both times it happened, before a single verdict existed, and it is what would catch the next door
 * in this family - which will not be a drive letter.
 *
 * ---------------------------------------------------------------------------
 * What the repository holds, asked of git rather than of a walk
 * ---------------------------------------------------------------------------
 *
 * `trackedFiles` is here because guards in three folders ask one question about one set of bytes, and
 * none of them owns it: `packages/registry/publication.test.ts` asks which files carry a licence
 * header, and `trackedSources` below narrows the same answer for the two guards that resolve a
 * citation. *Two functions answering two questions about different data are not a duplication; two
 * answering one question about one set are.*
 *
 * git is asked rather than a walk written, for the reason `packages/cli/ignored.ts` gives about
 * `.gitignore`: a second statement of what this repository contains drifts from the first, and the
 * derived trees are exactly where a stale answer would hide. `dist/` holds a compiled copy of every
 * module of `packages/`, comments included - so a walk that reached it would let a citation in a build
 * output stand in for one in the source it was built from.
 *
 * `strayWorktrees` answers a second question of that kind - which checkouts this repository has
 * registered - and it is here rather than beside its caller because it has two. ADR-0095.
 * `bindingsAtRevision` adds a worktree and removes it in a `finally`, and that path is sound:
 * `git worktree remove --force` deregisters one even when the directory it names has already gone.
 * What nothing detected is the state after a run that never reached its `finally`. The registration
 * survives its directory, `git status --porcelain` stays empty, and it therefore walks straight past
 * `theRevision` - the refusal written for its neighbour. One was found registered here with its
 * directory gone, naming a commit that was no longer the head.
 *
 * **Both sides of that comparison are asked of git.** A path this module spells and a path git spells
 * differ in the separator and in the case of the drive letter, which is the family
 * `withCanonicalDriveLetter` above exists for - and reconciling them by inventing a third spelling is
 * how that family got its first two members.
 */

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { withCanonicalDriveLetter } from '../vitest-entry-point.ts'

/** This folder, in the spelling every path below is built from. */
export const THE_INSTRUMENT_FOLDER = withCanonicalDriveLetter(
  dirname(fileURLToPath(import.meta.url)),
)

/** The repository root, in the spelling every child process of this folder is given. */
export const THE_REPOSITORY = join(THE_INSTRUMENT_FOLDER, '..')

/** git, asked from the repository root and answering its own text. */
export const git = (...arguments_: readonly string[]): string =>
  execFileSync('git', [...arguments_], { cwd: THE_REPOSITORY, encoding: 'utf8', maxBuffer: 1 << 26 })

/** git answers one thing per line and ends on a newline, which is one empty line nobody wants. */
export const answered = (text: string): readonly string[] =>
  text.split('\n').filter((line) => line !== '')

/** Every file this repository tracks, repository-relative and forward-slashed, as git spells them. */
export const trackedFiles = (): readonly string[] => answered(git('ls-files'))

/**
 * The tracked files this repository reads as text of its own, which is its TypeScript and its prose.
 *
 * Both citation guards start from this set and for the same reason, so it is stated once:
 * `decisions.ts` resolves an `ADR-NNNN` written anywhere, `history.ts` resolves a commit identifier,
 * and neither may reach `dist/` - a compiled copy of every comment in `packages/`, where a citation
 * surviving a build would stand in for one in the source it was built from.
 *
 * **Only one of them sweeps all of it.** A record is never deleted, so an `ADR-NNNN` written into a
 * file a published contract freezes goes on resolving for ever; a commit identifier written there
 * dies the day the history is rewritten and cannot be repaired, because the repair is the edit
 * permanent rule 6 forbids. `theEditableSources` is where that narrowing is argued. ADR-0124.
 */
export const trackedSources = (): readonly string[] =>
  trackedFiles().filter((path) => path.endsWith('.ts') || path.endsWith('.md'))

const A_REGISTERED_WORKTREE = 'worktree '

/** Every worktree registered against this repository other than its own root, as git spells them. */
export const strayWorktrees = (): readonly string[] => {
  const root = git('rev-parse', '--show-toplevel').trim()

  return answered(git('worktree', 'list', '--porcelain'))
    .filter((line) => line.startsWith(A_REGISTERED_WORKTREE))
    .map((line) => line.slice(A_REGISTERED_WORKTREE.length))
    .filter((path) => path !== root)
}
