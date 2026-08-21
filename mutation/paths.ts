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
 * header, and the two guards that resolve a citation sweep it whole. `trackedProse` below narrows it
 * for the one reading that blames what it sweeps. *Two functions answering two questions about
 * different data are not a duplication; two answering one question about one set are.*
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
 * The tracked prose this repository blames paragraph by paragraph: its TypeScript and its Markdown.
 *
 * `readHands` runs `git blame` over every path it is handed and groups the answer into populations,
 * so what belongs here is text somebody wrote a paragraph of. `pnpm-lock.yaml` is tracked, is
 * generated, holds no paragraph at all, and would be blamed on every run of `npm run hands`.
 *
 * ---------------------------------------------------------------------------
 * Why the two citation guards no longer start here, which is where the damage was
 * ---------------------------------------------------------------------------
 *
 * They did until `9d05552`, on the argument that this is *the text this repository reads as its own*.
 * The argument was right and the filter was not: an extension test written when the only text here
 * was `.ts` and `.md` excludes, in silence, every format that arrives afterwards. Measured over the
 * tracked tree at that commit, two files hold a citation and are outside it -
 * `.github/workflows/suites.yml` with twelve `ADR-NNNN` and four commit identifiers, and
 * `wrangler.jsonc` with three and one. **Twenty citations that both guards reported as resolved by
 * never looking at them**, in the file where this repository's own continuous integration is defined.
 *
 * The asymmetry is what makes it a defect rather than a gap: `backCitationFaults` reads a governed
 * file directly, so `suites.yml` is held to citing the record that governs it, while nothing holds
 * the records and commits it cites to existing. One direction of one relationship, kept.
 *
 * **The event is not hypothetical.** `suites.yml` cites `26e2000`, which no branch of this repository
 * reaches; deleting the branch that carried it would have killed that citation with `npm run meta`
 * green, and the tag that saved it was posted for another reason entirely. What replaces the
 * extension test is no test at all - both guards now sweep `trackedFiles`, so a format this
 * repository has not met yet is inside their reach on the day it arrives, and `dist/` stays out
 * because it is not tracked rather than because it is not named here.
 *
 * What one of them still narrows, and why the narrowing is a category rather than an exemption, is
 * argued at `theEditableSources`: a citation inside a file a published contract freezes cannot be
 * repaired, because the repair is the edit permanent rule 6 forbids. ADR-0124.
 */
export const trackedProse = (): readonly string[] =>
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
