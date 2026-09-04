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
 * `A_PATH_INSIDE` and `A_DIRECTORY` say what a segment may be made of, which is ADR-0046's shape one
 * folder along: the catalogue admits a pure function by naming what it may reach rather than by
 * enumerating what it may not, because the second list is never finished. Spelled that way, a whole
 * class of question is not asked - a leading slash, a drive letter, a UNC prefix, a backslash, a colon,
 * a control character and an empty segment are all outside both alphabets rather than each being a
 * clause somebody remembered.
 *
 * They are two because a served path and the folder a project chose are two fields with two jobs, and
 * ADR-0208 is the measurement that separated them again. Neither grows by anticipation: a character
 * enters an alphabet when somebody has shown it does no harm, which is how the space entered this one.
 *
 * `..` is the one sequence the alphabet cannot exclude, because `.` and `-` are legitimate in a
 * filename and `..` is spelled out of them. So it is refused as a *segment*, which is the form that
 * cannot be spelled around: `a..b` is a filename and `..` is not.
 *
 * ---------------------------------------------------------------------------
 * Two facts, because a string cannot answer for the disk
 * ---------------------------------------------------------------------------
 *
 * `staysInside` answers about a string and is what a boundary asks - the lockfile reader, the plan.
 * `travels` is the same question asked of the one field that is the project's own, and the
 * configuration reader is its only caller. `under` answers about a place, and it is what a caller about
 * to call the filesystem asks. They are not three rules: `under` applies `staysInside` and then asks
 * the one question no string can answer, which is what the directory *is* on this disk.
 *
 * A directory that is a link is the case. The project a user cloned decides its own shape, so
 * `lib/toopo` can be a link to somewhere else entirely - and every part of the arithmetic above is
 * satisfied by a path that then lands wherever the link points. Resolving the deepest part that
 * exists, and comparing that, is the only thing that answers it.
 */

import { basename, dirname, isAbsolute, join, posix, relative, resolve, sep, win32 } from 'node:path'
import { realpathSync } from 'node:fs'

/**
 * What a segment of a served path may be made of.
 *
 * It is the alphabet of a string that arrived from somewhere else - a served answer, or a `toopo.lock`
 * a repository carries - so it is spelled out of what this catalogue spells. `A_DIRECTORY` below is
 * the other one, and the whole of what they disagree about is one character.
 */
export const A_PATH_INSIDE = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/

/**
 * What a segment of the configured directory may be made of, which is that alphabet and a space.
 *
 * **Two alphabets rather than one, because the two fields answer two questions.** A served path
 * describes what the catalogue holds. A directory is the project's own decision about a folder on its
 * own disk, and the only thing it owes anybody is to mean the same folder on every machine that checks
 * the project out, because the file naming it is committed.
 *
 * They were one rule for one release, and the space is what separated them again. Measured at
 * `a2495c3`, on NTFS under node v24.15.0 and on ext4 under node v24.20.0, over nine spellings each:
 * a space in a folder name - leading, trailing or in the middle - is rendered back under the name it
 * was asked for on both platforms, the file under it is read at the path that asked for it, `under`
 * composes the place that was asked for, and `git check-ignore -q --`, the one subprocess an install
 * hands a user's own directory to, answers normally. **An alphabet that refuses a character it cannot
 * show a harm for is narrower than its own reason.** The same reading found `src/code./toopo` admitted
 * by `A_PATH_INSIDE` today, so a trailing character was never what either rule was about.
 *
 * **What stays outside is outside by not being in it, and never by a clause.** A drive letter, a
 * backslash, `<>:"|?*`, a control character and an empty segment are each spelled out of the alphabet
 * rather than each being a rule somebody remembered, which is what the note above says one folder
 * along and the reason both are written this way.
 *
 * Nothing outside ASCII is admitted, and that is an absence rather than a decision. macOS normalises a
 * name to NFD where Linux keeps the bytes it was handed, so a directory committed as `é` in NFC would
 * come back spelled otherwise - which is exactly the failure this rule exists to prevent - and no
 * macOS reading was taken. It reopens on one.
 */
export const A_DIRECTORY = /^[A-Za-z0-9._ -]+(?:\/[A-Za-z0-9._ -]+)*$/

/** Whether a path names a place inside whatever it is joined to, whoever wrote it. */
export const staysInside = (path: string): boolean =>
  A_PATH_INSIDE.test(path) && !path.split('/').includes('..')

/**
 * Whether the configured directory is one a committed file can carry to another machine.
 *
 * The `..` clause is written out again rather than shared with `staysInside`, and a mutant decides
 * that rather than a preference: a cell aims at a choice and never at a mechanism two claims share, so
 * one function serving both alphabets would be one edit reddening the served path and the configured
 * directory at once. ADR-0203.
 */
export const travels = (directory: string): boolean =>
  A_DIRECTORY.test(directory) && !directory.split('/').includes('..')

/**
 * A string somebody typed, shown back to them as they typed it.
 *
 * **`JSON.stringify` renders for a machine and this is a sentence for a person**, and the case that
 * separates them is the one half these refusals are about: it doubles a backslash, so a reader who
 * typed `C:\toopo` is shown `"C:\\toopo"` and goes looking for a string they did not write. A
 * backslash is what somebody on Windows types, so the character the rendering was worst for is the
 * character the message exists for. ADR-0214.
 *
 * Everything else `JSON.stringify` does is kept rather than reimplemented, and the newline is why: a
 * directory holding one is refused too, and a refusal that broke its own line into two would be a
 * worse sentence than one spelling it `\n`.
 */
export const asTyped = (value: string): string => JSON.stringify(value).replaceAll('\\\\', '\\')

/**
 * What a reader is told when the configured directory was refused, naming the thing in it that was.
 *
 * **The arms are ordered so that each sentence is true of the string it is shown for**, rather than
 * merely true: `C:\toopo` is refused for naming a volume and not for the colon in it, and a backslash
 * for meaning two places and not for being outside the alphabet. A refusal derived from the alphabet
 * alone would give the second of each pair, which is a reason nobody can act on.
 *
 * **`where` is what supplied the folder and never what read it**, which is the same distinction
 * `theRefusal` below makes and the one this sentence was wrong about for a release: written for a
 * committed file and reused by `toopo init --dir`, it opened *`toopo.json` carries …* on a path where
 * no such file exists, nothing is written, and the string arrived on the command line. The sentence
 * was exactly true of the population it was written for and false of the one it was shown to. So the
 * subject is the caller's, the reason is this module's, and the one clause that is about the committed
 * file names it by what it does rather than by its name - which is true whether the file is being read
 * or is about to be written. ADR-0208, ADR-0213, ADR-0214.
 *
 * The last arm asks the alphabet about one character at a time rather than restating it, so there is
 * one statement of what a directory is spelled out of and not two that agree today.
 */
export const theDirectoryRefusal = (where: string, directory: string): string => {
  const carries = `${where} names ${asTyped(directory)} as the folder to install in, and `

  if (directory === '') return `${carries}a folder has to have a name.`

  if (posix.isAbsolute(directory) || win32.isAbsolute(directory)) {
    return (
      `${carries}it is an absolute path. The folder is recorded in a file that is committed with ` +
      `your project, so it is named relative to your project's root - an absolute one names the ` +
      `machine that wrote it and is wrong for everybody else who checks the project out.`
    )
  }

  if (directory.includes('\\')) {
    return (
      `${carries}it is written with backslashes. A backslash separates folders on Windows and is an ` +
      `ordinary character in a name everywhere else, so a committed one is a single string naming two ` +
      `different places. Write the folder with forward slashes on every platform.`
    )
  }

  if (directory.split('/').includes('..')) {
    return (
      `${carries}it leads out of your project. Toopo only ever writes under your project, and a ` +
      `folder above it is one this tool will not install into.`
    )
  }

  const outside = [...directory].find(
    (character) => character !== '/' && !A_DIRECTORY.test(character),
  )

  return outside === undefined
    ? `${carries}one of its folders is named by nothing at all.`
    : `${carries}it holds ${asTyped(outside)}, which toopo does not put in a folder name.`
}

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
 * by `configurationFaults` against `A_DIRECTORY` - which is wider than the one above by a space and
 * not by *whatever a folder on somebody's disk is called*, because this string is also printed on a
 * screen and written into a committed file, and a newline is a folder name. What `within` still cannot
 * do is lead out of the project, and that is the comparison below rather than the alphabet above.
 */
export const under = (root: string, within: string, path: string): string | null => {
  if (!staysInside(path)) return null

  const inside = relative(trulyAt(root), trulyAt(join(root, within, path)))

  return inside !== '' && (isAbsolute(inside) || inside === '..' || inside.startsWith(`..${sep}`))
    ? null
    : join(root, within, path)
}
