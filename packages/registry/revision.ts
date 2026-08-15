/**
 * Which state of this repository a set of answers was produced from, and the one place that asks.
 * ADR-0090 is why this may travel in a named answer and in no other kind.
 *
 * ---------------------------------------------------------------------------
 * It is a fact about an answer, and never a fact about an artefact
 * ---------------------------------------------------------------------------
 *
 * A named answer says what the registry holds *today*, and a reader who records one has recorded
 * something they cannot check later: the name they asked about resolves to whatever the registry now
 * says it resolves to. The revision is what turns that into an anchor. It says which state of this
 * repository produced the answer, so a reader who kept it can rebuild the registry at that revision
 * and obtain the same answers - which is the only recourse there is if the host ever stops answering.
 *
 * **It may never enter the frozen half, and the second half of that rule is the one that gets missed.**
 * A snapshot's digest is taken over its canonical text, so a revision inside one would make the same
 * content produce a different digest per commit - `snapshot.ts` already refuses a publication timestamp
 * in exactly those words, and a revision is a clock with better resolution. The half that passes every
 * digest check is `ServedSnapshot` and `ServedBlob`: those are *envelopes*, hashed over their body and
 * not over themselves, so a revision in one moves no digest at all. What refuses it there is
 * `cachePolicyFor`, and `response.ts` carries the argument.
 *
 * ---------------------------------------------------------------------------
 * Nothing published asks git, and that is why this module is where it is
 * ---------------------------------------------------------------------------
 *
 * `theRevision` spawns a process, so no module a user receives may import it. Nothing does: the three
 * stand-ins and the emission import it, and `reachable.ts` prunes what the published entry point cannot
 * reach - so the archive carries neither this file nor a way to spawn anything.
 *
 * The stand-ins carry `THE_UNPUBLISHED_REVISION` rather than each declaring their own, which is where
 * this parts company with `THE_UNPUBLISHED_VERSION`. That constant is written three times because a
 * published registry mints real versions and has no notion of a stand-in, so there is no home that
 * would make it one. This one has a home: forty zeros is git's own spelling of *no object*, a fact
 * about git rather than an invention of a stand-in, and it belongs beside the function that asks git.
 */

import { execFileSync } from 'node:child_process'

/** A commit, as git renders one: forty lower-case hexadecimal digits. */
export const REVISION = /^[0-9a-f]{40}$/

/**
 * The null object identifier, which is git's own way of saying *no object*.
 *
 * A reader who meets it in a `toopo.lock` knows at once that nothing was published, which is the
 * argument `THE_UNPUBLISHED_VERSION` makes about `0.0.0-local` one folder along: a plausible-looking
 * value would name a state that exists nowhere and leave nobody able to tell it from one that does.
 */
export const THE_UNPUBLISHED_REVISION = '0'.repeat(40)

export class TheRevisionCannotBeNamed extends Error {
  constructor(reason: string) {
    super(
      `nothing can be published from this working tree, because ${reason}. An answer stamped with a ` +
        `revision it cannot be rebuilt from is worse than one carrying no revision at all: it invites ` +
        `a reader to check something that will not come back.`,
    )
    this.name = 'TheRevisionCannotBeNamed'
  }
}

const git = (root: string, ...arguments_: readonly string[]): string => {
  try {
    return execFileSync('git', [...arguments_], { cwd: root, encoding: 'utf8' }).trim()
  } catch (error) {
    throw new TheRevisionCannotBeNamed(
      `git could not answer \`${arguments_.join(' ')}\` here (${
        error instanceof Error ? error.message.split('\n')[0] : String(error)
      })`,
    )
  }
}

/**
 * The commit this working tree is at, refused unless the tree is exactly that commit.
 *
 * **The cleanliness check is the whole of what makes the answer worth carrying.** A revision stamped on
 * a tree with uncommitted work names a state nobody else can obtain, so every answer it travels in
 * would carry a durability claim that fails the first time somebody tries it. `git status --porcelain`
 * is empty exactly when the tree agrees with its commit, and it covers untracked files - which matters
 * here, because a contract added and not committed is precisely the change that would be served and
 * then be unfindable.
 */
export const theRevision = (root: string): string => {
  const dirty = git(root, 'status', '--porcelain')
  if (dirty !== '') {
    throw new TheRevisionCannotBeNamed(
      `it does not agree with its own commit:\n${dirty
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')}`,
    )
  }

  const head = git(root, 'rev-parse', 'HEAD')
  if (!REVISION.test(head)) {
    throw new TheRevisionCannotBeNamed(`git answered "${head}", which is not a commit`)
  }

  return head
}
