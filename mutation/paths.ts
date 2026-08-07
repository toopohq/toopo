/**
 * Where the instrument is, spelled one way rather than however it happened to be invoked.
 *
 * ---------------------------------------------------------------------------
 * The fourth door into a run that collects nothing, and the first found on purpose
 * ---------------------------------------------------------------------------
 *
 * `census.ts` names three ways a run of a suite here can collect a fraction of what it has, all
 * three found by accident. This is the fourth, and it is not a setting anybody typed: it is the
 * spelling of the path this folder hands vitest, which the instrument inherits from whatever
 * invoked it.
 *
 * Measured on vitest 4.1.10 under node v24.15.0 on Windows 11, twenty runs of the contracts' own
 * configuration against each spelling of the repository root:
 *
 *     C:\...\toopo    20 of 20    21 files    472 assertions    green
 *     c:\...\toopo    20 of 20    21 files     28 assertions    red
 *
 * Under the lower-case spelling all sixteen runtime files fail to collect, each with
 * `TypeError: Cannot read properties of undefined (reading 'config')`, and the 28 that survive are
 * the five `.test-d.ts` files, which tsc collects in this process rather than in a worker. The same
 * door under `cli/vitest.config.ts` collects **0 of 170**, because that configuration declares no
 * typecheck files at all - so the two figures this defect was observed under, 28 and 0, are one door
 * read through two configurations rather than two faults.
 *
 * **It is the drive letter and nothing else about the path.** Measured on the same suite,
 * `C:\users\...`, `C:\Users\Mathis\Desktop\toopo\toopo` and both mistakes at once each collect 472.
 * Only a lower-case drive letter collapses the run, and it collapses every time.
 *
 * ---------------------------------------------------------------------------
 * Where the spelling comes from, and why it looked like a rate
 * ---------------------------------------------------------------------------
 *
 * It is carried rather than produced. `fs.realpathSync` does not normalise a drive letter on
 * Windows, `import.meta.url` keeps whatever resolved the entry point, and `join` carries it on - so
 * the spelling of the invocation reaches vitest's root untouched. Both shells this was measured in
 * normalise a typed `cd`; what does not normalise is a process spawned with an explicit lower-case
 * `cwd`, which keeps it, and a script named by a lower-case absolute path, which keeps it whatever
 * the shell's own directory is. Measured from a shell whose own directory is `C:`:
 *
 *     node c:\...\mutation\measure.ts fixture
 *     -> C/as-committed: this run did not collect the suite this repository declares.
 *          mutation/fixture/guards.test.ts: declared 2, collected 0
 *
 * So the collapse is deterministic in the invocation and was never a probability, which is exactly
 * what it looked like from a distance: eight invocations from mixed launchers gave two collapses,
 * and twenty from one shell gave none. A run of zero over twenty bounded nothing, because the
 * quantity being bounded did not exist.
 *
 * ---------------------------------------------------------------------------
 * Pinned rather than refused, on an argument this folder already makes
 * ---------------------------------------------------------------------------
 *
 * `Battery.timeZone` pins the process time zone rather than inheriting it, because a verdict
 * measured under whatever zone the operator's machine carries is not a verdict anybody else can
 * reproduce. A drive letter is the same class of ambient input reaching the same apparatus, and it
 * gets the same treatment: one spelling, chosen here, whatever the invocation said. Refusing instead
 * would cost the operator a replay and teach them to relaunch, and there is nothing for them to
 * decide - the two spellings name one directory.
 *
 * The census stays the backstop rather than being replaced by this. It is what caught the defect
 * both times it happened, before a single verdict existed, and it is what would catch the next door
 * in this family - which will not be a drive letter.
 *
 * The rule lives in this folder because this is the only folder that hands a constructed path to
 * vitest. Everything else here takes the spelling it is given: `git` was measured indifferent to it,
 * since the reproduction above checked arms out of a lower-case tree and reached the census.
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** A Windows drive letter at the start of a path, in the one spelling that has to move. */
const A_LOWER_CASE_DRIVE_LETTER = /^[a-z]:/

/**
 * The same path with its Windows drive letter upper-cased, and nothing else about it touched.
 *
 * The rest is deliberately left as the invocation spelled it. `C:\users\...` collects the whole
 * suite, so upper-casing any further would be a change no measurement asks for - and it would be a
 * claim about segments whose true spelling is on the disk and not in this function.
 */
export const withCanonicalDriveLetter = (path: string): string =>
  path.replace(A_LOWER_CASE_DRIVE_LETTER, (letter) => letter.toUpperCase())

/** This folder, in the spelling every path below is built from. */
export const THE_INSTRUMENT_FOLDER = withCanonicalDriveLetter(
  dirname(fileURLToPath(import.meta.url)),
)

/** The repository root, in the spelling every child process of this folder is given. */
export const THE_REPOSITORY = join(THE_INSTRUMENT_FOLDER, '..')
