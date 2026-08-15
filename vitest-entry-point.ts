/**
 * Where vitest's entry point is, spelled one way rather than however node happened to be invoked.
 * ADR-0056 is why the drive letter is pinned here rather than inherited from whatever launched a run.
 *
 *
 * ---------------------------------------------------------------------------
 * The door, measured rather than argued
 * ---------------------------------------------------------------------------
 *
 * A lower-case Windows drive letter in the path node is handed for `vitest.mjs` collapses the run:
 * every runtime file fails to collect with `TypeError: Cannot read properties of undefined (reading
 * 'config')`, and what survives is whatever the parent process collects on its own. Measured on
 * vitest 4.1.10 under node v24.15.0 on Windows 11, twenty runs of the contracts' configuration
 * against each spelling of the path below:
 *
 *     C:\...\vitest.mjs    20 of 20    21 files    472 assertions    green
 *     c:\...\vitest.mjs    20 of 20    21 files     28 assertions    red
 *
 * The 28 that survive are the five `.test-d.ts` files, which tsc collects in this process rather
 * than in a worker. The same door under `cli/vitest.config.ts` collects **0 of 170**, because that
 * configuration declares no typecheck files at all - so the two figures this defect was first
 * observed under, 28 and 0, are one door read through two configurations rather than two faults.
 *
 * **It is the drive letter and nothing else about the path.** Measured on the same suite,
 * `C:\users\...`, `C:\...\toopo\toopo` and both mistakes at once each collect 472. Only a lower-case
 * drive letter collapses the run, and it collapses every time.
 *
 * The two elisions are a redaction and not a rounding. What this measurement is about is the *case* of
 * a segment, so the case of every segment shown is the spelling that was really run; what is elided is
 * one machine's home directory, which the measurement never depended on and which a published file
 * would carry for ever. **A transcript is redacted of what is not its subject and never of its
 * subject** - a measurement missing its subject is worth nothing, and one missing the rest is worth
 * what it always was.
 *
 * ---------------------------------------------------------------------------
 * Which path decides it, separated rather than assumed
 * ---------------------------------------------------------------------------
 *
 * A child running vitest is given two spellings - its working directory and the entry point it is
 * asked to run - and the runs above moved them together. Split, on the same suite:
 *
 *     cwd C:   entry C:    472        cwd C:   entry c:     28
 *     cwd c:   entry c:     28        cwd c:   entry C:    472
 *
 * **The working directory is irrelevant and the entry point decides.** A configuration cannot defend
 * itself against this either: canonicalising `root` inside `site/vitest.config.ts` and running from a
 * lower-case entry point still collects 0 of 78, and the collapsed run prints an upper-case root in
 * its own banner while collecting nothing. So the only place the spelling can be fixed is where the
 * path is built, which is why this module is one constant and not one per caller.
 *
 * ---------------------------------------------------------------------------
 * Where the spelling comes from, and why it looked like a rate
 * ---------------------------------------------------------------------------
 *
 * It is carried rather than produced. `fs.realpathSync` does not normalise a drive letter on
 * Windows, `import.meta.url` keeps whatever resolved the entry point, and `join` carries it on - so
 * a lower-case invocation reaches `vitest.mjs` untouched. Both shells this was measured in normalise
 * a typed `cd`, and a script named by a lower-case absolute path does not, which is why fifty
 * invocations through npm and through node had reproduced nothing.
 *
 * So the collapse is deterministic in the invocation and was never a probability, which is exactly
 * what it looked like from a distance: eight invocations from mixed launchers gave two collapses,
 * and twenty from one shell gave none. `mutation/mutants.ts` carries the rule that came out of that,
 * beside the two it belongs with.
 *
 * ---------------------------------------------------------------------------
 * Canonicalising is a repair at the measured layer, and that is not the same as hiding a symptom
 * ---------------------------------------------------------------------------
 *
 * **The trigger is unknown and the cause is not.** What produced a lower-case spelling on the one
 * ordinary `npm run site` that was seen collapsing was never isolated, and nothing here guesses at
 * it. What is measured is the mechanism: this path decides whether the run collects, and the four
 * cells above isolate it from the working directory.
 *
 * A repair that acted on the symptom with the cause unknown would be a plaster - the thing this
 * repository refuses. This acts on the measured cause and leaves the trigger with nothing to do. The
 * distinction is written here because the rule forbidding the other shape would read as forbidding
 * this one.
 *
 * Pinning rather than refusing is the argument `Battery.timeZone` already makes one floor down: an
 * ambient property of the machine, pinned because a run measured under whatever the operator's
 * carries is not one anybody else can reproduce. There is nothing for an operator to decide here -
 * the two spellings name one directory - and refusing would cost them a relaunch and teach them to
 * expect one.
 *
 * ---------------------------------------------------------------------------
 * What this does not replace
 * ---------------------------------------------------------------------------
 *
 * `mutation/census.ts` stays the backstop. It is what caught this defect both times it happened,
 * before a single verdict existed, and it is what would catch the next door in this family - which
 * will not be a drive letter.
 *
 * This module is at the root because every entry point that starts vitest needs it and none of them
 * may import another: the instrument in `mutation/` builds its own child command, `run-vitest.ts` is
 * what every npm script goes through, and the catalogue's own suite must not start by way of the
 * instrument that measures it. `typescript-imports.ts` is at the root on exactly that argument.
 */

import { join } from 'node:path'

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

/** The repository root, in the spelling every path below is built from. */
const THE_REPOSITORY = withCanonicalDriveLetter(import.meta.dirname)

/**
 * The one path whose spelling decides whether a run collects its suite.
 *
 * Named once and imported rather than rebuilt, so that the instrument's child command and the
 * launcher every npm script goes through cannot disagree about where vitest is or about how it is
 * spelled.
 */
export const THE_VITEST_ENTRY_POINT = join(
  THE_REPOSITORY,
  'node_modules',
  'vitest',
  'vitest.mjs',
)
