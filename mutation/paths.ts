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
 * `trackedFiles` is here because two guards in two folders ask one question about one set of bytes,
 * and neither folder owns it: `packages/registry/publication.test.ts` asks which files carry a licence
 * header, and `decisions.ts` asks which files cite a decision. *Two functions answering two questions
 * about different data are not a duplication; two answering one question about one set are.*
 *
 * git is asked rather than a walk written, for the reason `packages/cli/ignored.ts` gives about
 * `.gitignore`: a second statement of what this repository contains drifts from the first, and the
 * derived trees are exactly where a stale answer would hide. `dist/` holds a compiled copy of every
 * module of `packages/`, comments included - so a walk that reached it would let a citation in a build
 * output stand in for one in the source it was built from.
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

/** Every file this repository tracks, repository-relative and forward-slashed, as git spells them. */
export const trackedFiles = (): readonly string[] =>
  execFileSync('git', ['ls-files'], { cwd: THE_REPOSITORY, encoding: 'utf8', maxBuffer: 1 << 26 })
    .split('\n')
    .filter((path) => path !== '')
