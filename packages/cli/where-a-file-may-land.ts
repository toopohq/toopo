/**
 * The one statement of where this tool may put a file, read one, or take one away.
 *
 * Every path this installer touches is composed from three parts: the project root, the configured
 * directory, and a path that arrived from somewhere else - a served answer, or a `toopo.lock` written
 * by an earlier run and committed into a repository since. The root is the process's own. The other
 * two are somebody else's strings, and this module is what they have to satisfy before they become an
 * argument to the filesystem. ADR-0206.
 *
 * ---------------------------------------------------------------------------
 * It refuses rather than repairs, and that was decided here before it was decided again
 * ---------------------------------------------------------------------------
 *
 * `configuration.ts` has carried the argument since it was written, about the one field of the three
 * that already had a rule: *backslashes are refused rather than normalised... silently repairing it
 * here would leave the committed file saying something this tool does not mean.* The same sentence
 * decides the other two, and for a reason that is stronger rather than merely parallel.
 *
 * A path is not an isolated string here. It is written into `toopo.lock` as the record of what landed,
 * and the whole product rests on that record describing what is on disk. Repairing a path on the way
 * in makes the record and the disk two different statements - so a run that "corrected" one would have
 * to either write down the correction, which is a file the user never asked for under a name nobody
 * chose, or write down the original, which is a lockfile that lies. Refusing has neither branch.
 *
 * The asymmetry decides it where the argument alone would leave a preference: a refusal costs somebody
 * one sentence they can act on, and an acceptance costs them a file where they were not looking.
 *
 * ---------------------------------------------------------------------------
 * A list of what is allowed, and not a list of what is not
 * ---------------------------------------------------------------------------
 *
 * `A_PATH_INSIDE` says what a segment may be made of, which is ADR-0046's shape one folder along: the
 * catalogue admits a pure function by naming what it may reach rather than by enumerating what it may
 * not, because the second list is never finished. Spelled that way, a whole class of question is not
 * asked - a leading slash, a drive letter, a UNC prefix, a backslash, a colon, a control character and
 * an empty segment are all outside the alphabet rather than each being a clause somebody remembered.
 *
 * `..` is the one sequence the alphabet cannot exclude, because `.` and `-` are legitimate in a
 * filename and `..` is spelled out of them. So it is refused as a *segment*, which is the form that
 * cannot be spelled around: `a..b` is a filename and `..` is not.
 *
 * ---------------------------------------------------------------------------
 * Two facts, because a string cannot answer for the disk
 * ---------------------------------------------------------------------------
 *
 * `staysInside` answers about a string and is what a boundary asks - the lockfile reader, the
 * configuration reader, the plan. `under` answers about a place, and it is what a caller about to call
 * the filesystem asks. They are not two rules: `under` applies `staysInside` and then asks the one
 * question no string can answer, which is what the directory *is* on this disk.
 *
 * A directory that is a link is the case. The project a user cloned decides its own shape, so
 * `lib/toopo` can be a link to somewhere else entirely - and every part of the arithmetic above is
 * satisfied by a path that then lands wherever the link points. Resolving the deepest part that
 * exists, and comparing that, is the only thing that answers it.
 */

import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { realpathSync } from 'node:fs'

/**
 * What a segment of a path this tool writes may be made of.
 *
 * The same alphabet `configuration.ts` has always required of the configured directory, stated here so
 * that the directory and the files under it are one rule rather than two that agree today.
 */
export const A_PATH_INSIDE = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/

/** Whether a path names a place inside whatever it is joined to, whoever wrote it. */
export const staysInside = (path: string): boolean =>
  A_PATH_INSIDE.test(path) && !path.split('/').includes('..')

/**
 * What a reader is told when a path was refused. Always a sentence.
 *
 * **It answers unconditionally, and the first version of it did not.** Written to return the faults
 * *about* a path, it re-derived the verdict from the string - so a path that was refused because the
 * directory it sits in leads out of the project came back with nothing to say, and the command wrote
 * no file and reported no reason. A refusal that can answer *nothing to report* is not a refusal, and
 * the caller has already decided; this only says it.
 *
 * The two arms are the two ways out of `under`, because they are two different things for a person to
 * do something about: one is a path they can look at, the other is a folder that is not where it looks.
 * `where` is what wrote the path rather than what read it, which is the only part a reader can act on.
 */
export const theRefusal = (where: string, path: string): string =>
  staysInside(path)
    ? `${where} names ${JSON.stringify(path)}, and the directory toopo was asked to write in does ` +
      `not lead inside your project - it is a link, or a folder standing somewhere other than where ` +
      `it appears. Toopo only ever writes under your project, so it has written nothing.`
    : `${where} names ${JSON.stringify(path)}, which is not a path inside the directory toopo was ` +
      `asked to write in. Toopo only ever writes under that directory, so it will not use this ` +
      `path - and it does not rewrite one into something it could use, because the file it landed ` +
      `on would then be a file nobody asked for.`

/**
 * Where a path really leads on this disk, following the links of the part of it that exists.
 *
 * The part that does not exist yet cannot be a link, so it is carried through unresolved rather than
 * being a case: a destination two folders below anything that exists is the ordinary first install.
 */
const trulyAt = (path: string): string => {
  const carried: string[] = []
  let at = resolve(path)

  for (;;) {
    try {
      return join(realpathSync.native(at), ...[...carried].reverse())
    } catch {
      const up = dirname(at)
      if (up === at) return resolve(path)
      carried.push(basename(at))
      at = up
    }
  }
}

/**
 * The place these segments name under `root`, or `null` where they name one outside it.
 *
 * Every composition of a path this tool is about to hand to the filesystem goes through here, so that
 * *inside the project* is one function and not a habit six call sites share.
 *
 * **It takes the root and the directory apart rather than a base already joined, and that is the whole
 * of what makes it answer about a link.** Resolving a base and asking whether the file stays under *it*
 * accepts a configured directory that is itself a link out of the project: the file is faithfully
 * inside a directory that is somewhere else. The project root is the one part of the composition this
 * process chose, so it is the one thing the answer can be measured against.
 *
 * **The alphabet is asked of `path` and never of `within`, and that distinction is the repair's own
 * measurement.** They are two fields with two rules: `within` is the project's own decision, read once
 * by `configurationFaults` and legitimately holding whatever a folder on somebody's disk is called -
 * `a-path-with-a-space-installs-normally` is the guard that says so, and it is what caught this
 * function asking one rule of both. What `within` still cannot do is lead out of the project, and that
 * is the comparison below rather than the alphabet above.
 */
export const under = (root: string, within: string, path: string): string | null => {
  if (!staysInside(path)) return null

  const inside = relative(trulyAt(root), trulyAt(join(root, within, path)))

  return inside !== '' && (isAbsolute(inside) || inside === '..' || inside.startsWith(`..${sep}`))
    ? null
    : join(root, within, path)
}
