/**
 * What this repository bound at a commit that is not the one checked out. ADR-0093.
 *
 * ---------------------------------------------------------------------------
 * The past is rebuilt rather than recorded, and that is the whole of the design
 * ---------------------------------------------------------------------------
 *
 * A binding's freeze is checkable because the frozen half is a function of what is committed: check the
 * commit out, ask that commit what it bound, compare. Nothing is transcribed, so there is no second
 * statement of a digest for somebody to update alongside the change it was meant to refuse - which is
 * the difference between a check and a note, and [ADR-0043]'s rule about a sentence that cannot be
 * false.
 *
 * ---------------------------------------------------------------------------
 * The commit answers for itself, because a path does not survive
 * ---------------------------------------------------------------------------
 *
 * Reaching into a checkout by file path was measured and refused: `packages/registry/serialise.ts` does
 * not exist sixty commits back, where the folder was `registry/`. So what is asked for is a *script
 * name* in that commit's own `package.json`, and wherever that commit keeps its registry is its own
 * business.
 *
 * The script is read and re-run rather than handed to `npm`, and the reason is platform rather than
 * taste: `npm` is a `.cmd` on Windows and `execFileSync` will not start one. What is accepted is
 * exactly `node <one path>`; anything else is refused by name rather than interpreted, because a
 * command line this module half-understood would be the one thing in the freeze check able to run
 * something other than what it thought.
 *
 * ---------------------------------------------------------------------------
 * Why the checkout lands inside this repository
 * ---------------------------------------------------------------------------
 *
 * The registry's own digest path takes exactly one dependency - `expect`, imported by
 * `packages/catalogue/every-contract.ts` - and a worktree carries no `node_modules`. Putting the
 * checkout under `.rebuilt/` lets node's upward resolution find this repository's, which is the same
 * dependency tree that commit was measured under. A symbolic link would have done it too, and removing
 * one is a different operation on every platform with the target one mistake away.
 *
 * Nothing here may be reached by a module a user receives: this spawns processes and writes to a disk.
 * Nothing does - `reachable.ts` prunes what the published entry point can reach, and the only callers
 * are guards.
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import type { FrozenBindings } from './rebinding.js'
import { readBindings } from './rebinding.js'

/** The script every commit that can be rebuilt answers to. The coordinate, and the only one. */
export const THE_LEDGER_SCRIPT = 'ledger'

/** Where a rebuilt commit is put. Ignored by git, and inside the tree so that resolution works. */
export const THE_REBUILD_FOLDER = '.rebuilt'

export class ARevisionCannotBeRebuilt extends Error {
  constructor(revision: string, reason: string) {
    super(
      `${revision} cannot be rebuilt, because ${reason}. A binding published from a commit nobody ` +
        `can rebuild is one whose freeze nothing will ever check again - so this is refused rather ` +
        `than skipped, which is the state it would otherwise decay into in silence.`,
    )
    this.name = 'ARevisionCannotBeRebuilt'
  }
}

const git = (root: string, ...arguments_: readonly string[]): string => {
  try {
    return execFileSync('git', [...arguments_], { cwd: root, encoding: 'utf8' }).trim()
  } catch (error) {
    throw new ARevisionCannotBeRebuilt(
      arguments_[arguments_.length - 1] ?? '',
      `git could not answer \`${arguments_.join(' ')}\` (${
        error instanceof Error ? error.message.split('\n')[0] : String(error)
      })`,
    )
  }
}

/**
 * The file that commit runs to print its bindings, read out of its own manifest.
 *
 * Every branch refuses rather than guesses. A manifest that is not an object, a script that is absent,
 * a command that is not `node` and one path: each of them means this commit does not answer the
 * question, and saying so is the honest answer where running something adjacent is not.
 */
const entryPointOf = (worktree: string, revision: string): string => {
  let manifest: unknown
  try {
    manifest = JSON.parse(readFileSync(join(worktree, 'package.json'), 'utf8'))
  } catch (error) {
    throw new ARevisionCannotBeRebuilt(
      revision,
      `its \`package.json\` could not be read (${error instanceof Error ? error.message : String(error)})`,
    )
  }

  const scripts =
    typeof manifest === 'object' && manifest !== null
      ? (manifest as { readonly scripts?: unknown }).scripts
      : undefined
  const script =
    typeof scripts === 'object' && scripts !== null
      ? (scripts as Readonly<Record<string, unknown>>)[THE_LEDGER_SCRIPT]
      : undefined

  if (typeof script !== 'string') {
    throw new ARevisionCannotBeRebuilt(
      revision,
      `its \`package.json\` declares no \`${THE_LEDGER_SCRIPT}\` script, so it has no way to say ` +
        `what it bound`,
    )
  }

  const [runner, path, ...rest] = script.split(' ')
  if (runner !== 'node' || path === undefined || rest.length > 0) {
    throw new ARevisionCannotBeRebuilt(
      revision,
      `its \`${THE_LEDGER_SCRIPT}\` script is \`${script}\`, and what can be re-run here is ` +
        `\`node <one path>\` and nothing else`,
    )
  }

  return path
}

/**
 * The bindings one commit of this repository minted, by checking it out and asking it.
 *
 * The checkout is removed in a `finally`, because a worktree left registered would make `git status`
 * disagree with its commit on the next run - and that is the one thing `theRevision` refuses.
 */
export const bindingsAtRevision = (root: string, revision: string): FrozenBindings => {
  const worktree = join(root, THE_REBUILD_FOLDER, revision)

  mkdirSync(join(root, THE_REBUILD_FOLDER), { recursive: true })
  git(root, 'worktree', 'add', '--detach', '--quiet', worktree, revision)

  try {
    const entryPoint = entryPointOf(worktree, revision)

    return readBindings(
      execFileSync(process.execPath, [join(worktree, entryPoint)], {
        cwd: worktree,
        encoding: 'utf8',
      }),
    )
  } catch (error) {
    if (error instanceof ARevisionCannotBeRebuilt) throw error

    throw new ARevisionCannotBeRebuilt(
      revision,
      `running its \`${THE_LEDGER_SCRIPT}\` script answered nothing this reader could use (${
        error instanceof Error ? error.message.split('\n')[0] : String(error)
      })`,
    )
  } finally {
    git(root, 'worktree', 'remove', '--force', worktree)
    // Only this checkout, never the folder holding it: a caller may keep its own subject beside it.
    rmSync(worktree, { recursive: true, force: true })
  }
}
