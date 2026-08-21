/**
 * The file the continuous integration runs to decide which batteries a push has to answer for.
 * ADR-0146 is the decision; `selection.ts` is where the rule lives.
 *
 *
 *   node mutation/print-which-batteries-to-replay.ts <base> <head>
 *
 * It prints what changed, what that selects and what it passed over, and appends `batteries` and
 * `any` to the file GitHub names in `GITHUB_OUTPUT`. **The printing is not decoration**, for the
 * reason `packaging/print-whether-to-publish.ts` gives one folder over: the job that runs this is the
 * only place a reader can afterwards see why a battery did or did not run, and a selection with
 * neither of its two sides beside it is a selection nobody can check.
 *
 * `any` exists because GitHub fails a job whose matrix is an empty list rather than skipping it, so
 * the gate is gated on the boolean and never on the array being non-empty.
 *
 * ---------------------------------------------------------------------------
 * A range that cannot be read selects everything
 * ---------------------------------------------------------------------------
 *
 * The first push of a branch hands `0000000000000000000000000000000000000000` as the commit before
 * it, and a force-push hands one this checkout may not hold. **Both mean *this cannot tell what
 * changed*, and that must never resolve to *run nothing*** - a gate whose failure mode is silence is
 * worse than no gate, because a green run is what a reader takes it for.
 *
 * So an unreadable range selects every battery and says which of the two reasons it was. The cost is
 * a full replay on a branch's first push, which is the direction to be wrong in.
 *
 * Nothing here is imported by anything: `mutation/selection.test.ts` reaches the rule, and this is the
 * entry point - the split `packaging/reachable.ts` and `packaging/build.ts` already have, and the one
 * `print-whether-to-publish.ts` is written on.
 */

import { appendFileSync } from 'node:fs'

import { answered, git } from './paths.ts'
import { THE_BATTERIES } from './published.ts'
import { selectionFor } from './selection.ts'

/** What GitHub hands as the commit before the first push of a branch. */
const NO_COMMIT_BEFORE = '0'.repeat(40)

const [base, head = 'HEAD'] = process.argv.slice(2)

/** The changed paths, or `null` when the range is one this checkout cannot resolve. */
const changedBetween = (from: string, to: string): readonly string[] | null => {
  try {
    return answered(git('diff', '--name-only', `${from}..${to}`))
  } catch {
    return null
  }
}

const unreadable =
  base === undefined || base === '' || base === NO_COMMIT_BEFORE
    ? 'no commit was named before this one, so this is a first push'
    : null

const changed = unreadable === null ? changedBetween(base as string, head) : null

const everything = THE_BATTERIES.map((battery) => battery.name)

const selection =
  changed === null
    ? { batteries: everything, unaccounted: [] as readonly string[] }
    : selectionFor(changed, THE_BATTERIES)

const why =
  unreadable ??
  (changed === null ? `${base} is a commit this checkout does not hold` : null)

process.stdout.write(
  why === null
    ? `${(changed as readonly string[]).length} file(s) changed between ${base} and ${head}\n` +
        (changed as readonly string[]).map((path) => `    ${path}\n`).join('') +
        `\n${selection.batteries.length} of ${everything.length} batteries answer for them\n` +
        selection.batteries.map((name) => `    ${name}\n`).join('') +
        `\n${selection.unaccounted.length} changed file(s) no battery answers for\n` +
        selection.unaccounted.map((path) => `    ${path}\n`).join('')
    : `${why}, so every battery is selected rather than none\n` +
      everything.map((name) => `    ${name}\n`).join(''),
)

/**
 * Absent when this is run by a person, which is the case the job output is meaningless in. A file that
 * is not there is not a failure here: the reading above is the whole of what somebody at a keyboard
 * wanted, and there is nothing for them to hand it to.
 */
const output = process.env['GITHUB_OUTPUT']
if (output !== undefined && output !== '') {
  appendFileSync(
    output,
    `batteries=${JSON.stringify(selection.batteries)}\nany=${selection.batteries.length > 0}\n`,
  )
}
