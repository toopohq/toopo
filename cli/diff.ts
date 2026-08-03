/**
 * The diff a person decides on, and the one thing about it that could be silently backwards.
 *
 * ---------------------------------------------------------------------------
 * Node's own diff, and why it is worth an experimental API
 * ---------------------------------------------------------------------------
 *
 * `node:util`'s `diff` is a Myers diff shipped with the runtime this tool already requires. Writing one
 * by hand here would be writing an algorithm the platform provides, in the folder whose whole job is to
 * show somebody what is about to happen to their code - and this repository's rule is to prefer the
 * proven thing and to say what was checked.
 *
 * It is marked `@experimental`, which means the API may move rather than that it is wrong, and the
 * exposure is confined exactly as `typescript/unstable` is one folder along: a pinned runtime, one
 * module that knows the API, and a guard that pins the semantics. It has been available since node
 * v22.15.0, which costs nothing - `node cli/toopo.ts` already needs a node that runs TypeScript
 * without a flag, and that is a later version than this.
 *
 * ---------------------------------------------------------------------------
 * The two constants below are the whole risk, and they are measured
 * ---------------------------------------------------------------------------
 *
 * `diff` answers `[operation, line]` pairs. Its documentation calls `-1` *delete* and `1` *insert*,
 * which reads as though `-1` were the removed line. **Measured on node v24.15.0 it is the other way
 * round**: `diff(['a','b'], ['a','c'])` answers `[[0,'a'],[1,'b'],[-1,'c']]`, so `1` marks what is only
 * in the first argument and `-1` what is only in the second.
 *
 * A diff rendered from the documentation's reading would be inverted - every `-` a `+` - and that is
 * the defect this file exists to make impossible. Nothing else would catch it: an inverted diff has the
 * right files, the right line numbers, the right counts and the right hunks, and it would tell a user
 * that a line they are about to gain is a line they are about to lose. So the two codes are named for
 * what they *mean here*, in one place, and a guard pins them against the runtime rather than against
 * this comment.
 */

import { diff } from 'node:util'

/** What the first argument holds and the second does not. Rendered `-`. */
export const ONLY_IN_THE_FIRST = 1

/** What the second argument holds and the first does not. Rendered `+`. */
export const ONLY_IN_THE_SECOND = -1

/** How many unchanged lines are shown around a change. Three, which is what every diff reader expects. */
export const CONTEXT = 3

/**
 * The two markers, and why they are not the one `git` writes.
 *
 * `git` renders `\ No newline at end of file` and can leave it unqualified, because it makes the last
 * line a `-`/`+` pair whenever the newline differs - so the marker always sits under a line that says
 * which side it belongs to. This diff compares lines, and two lines that differ only by a trailing
 * newline are one context line, under which an unqualified marker would name neither side. So each
 * side has its own sentence. Nothing here is ever fed to `patch`; it is indented, which already
 * disqualifies it, and what it is fed to is a person.
 */
const NO_NEWLINE: Readonly<Record<'first' | 'second', string>> = {
  first: '\\ the first text has no newline at the end',
  second: '\\ the second text has no newline at the end',
}

export type Hunk = {
  /** `@@ -before,count +after,count @@`, with the line numbers a person counts from. */
  readonly header: string
  /** Each line prefixed by ` `, `-` or `+`, and the no-newline marker where one belongs. */
  readonly lines: readonly string[]
}

export type FileDiff = {
  readonly added: number
  readonly removed: number
  readonly hunks: readonly Hunk[]
}

type Marked = {
  readonly mark: ' ' | '-' | '+'
  readonly text: string
  /** Index of this line in the first text, meaningful unless the mark is `+`. */
  readonly before: number
  /** Index of this line in the second text, meaningful unless the mark is `-`. */
  readonly after: number
}

/**
 * The lines of a text, and whether it ended with a newline.
 *
 * The two are returned together because dropping the second loses a real difference: `'a\nb'` and
 * `'a\nb\n'` split to the same three-then-two lines once the trailing empty one is removed, so a file
 * that lost its final newline would diff as identical. Every text this tool diffs today is bytes it
 * wrote itself and ends with a newline, which is exactly why the case has to be carried rather than
 * assumed - an assumption that holds for every current caller is an assumption nobody will recheck.
 */
const linesOf = (text: string): { readonly lines: readonly string[]; readonly complete: boolean } => {
  const lines = text.split('\n')
  const complete = lines.at(-1) === ''

  return { lines: complete ? lines.slice(0, -1) : lines, complete }
}

const markOf = (operation: number): ' ' | '-' | '+' => {
  if (operation === ONLY_IN_THE_FIRST) return '-'
  if (operation === ONLY_IN_THE_SECOND) return '+'

  return ' '
}

const markedLines = (before: readonly string[], after: readonly string[]): readonly Marked[] => {
  let atBefore = 0
  let atAfter = 0

  return diff(before, after).map(([operation, text]) => {
    const mark = markOf(operation)
    const held = { mark, text, before: atBefore, after: atAfter }

    if (mark !== '+') atBefore += 1
    if (mark !== '-') atAfter += 1

    return held
  })
}

/**
 * The stretches of lines a hunk covers: every change, widened by the context and merged where they meet.
 *
 * `shown` is what must appear even though it is not a changed line, and it has exactly one member: a
 * line carrying a no-newline marker. Without it a text that lost only its final newline produces no
 * changed line, therefore no hunk, therefore no marker - and the difference this file went out of its
 * way to carry is thrown away at the last step. Measured, on the guard written for it.
 */
const ranges = (
  marked: readonly Marked[],
  context: number,
  shown: ReadonlySet<Marked>,
): readonly { readonly from: number; readonly to: number }[] => {
  const merged: { from: number; to: number }[] = []

  for (const [at, entry] of marked.entries()) {
    if (entry.mark === ' ' && !shown.has(entry)) continue

    const from = Math.max(0, at - context)
    const to = Math.min(marked.length - 1, at + context)
    const last = merged.at(-1)

    if (last !== undefined && from <= last.to + 1) last.to = Math.max(last.to, to)
    else merged.push({ from, to })
  }

  return merged
}

/**
 * A hunk's `@@` line.
 *
 * A count of zero carries the line *before* the change rather than a line number of its own, which is
 * what a unified diff means by an insertion at the top of a file and what every reader of one expects.
 */
const headerOf = (
  entries: readonly Marked[],
  first: Marked,
): string => {
  const beforeCount = entries.filter((entry) => entry.mark !== '+').length
  const afterCount = entries.filter((entry) => entry.mark !== '-').length
  const beforeStart = beforeCount === 0 ? first.before : first.before + 1
  const afterStart = afterCount === 0 ? first.after : first.after + 1

  return `@@ -${beforeStart},${beforeCount} +${afterStart},${afterCount} @@`
}

/**
 * What changed between two texts, as hunks and as two counts.
 *
 * The counts are read off the same marked lines the hunks are built from, so a report cannot print a
 * summary that disagrees with the body underneath it.
 */
export const diffOf = (before: string, after: string, context = CONTEXT): FileDiff => {
  const first = linesOf(before)
  const second = linesOf(after)
  const marked = markedLines(first.lines, second.lines)

  const lastFrom = (mark: '-' | '+'): Marked | undefined =>
    marked.filter((entry) => entry.mark === ' ' || entry.mark === mark).at(-1)

  const incomplete = new Map<Marked, readonly string[]>()
  const note = (at: Marked | undefined, marker: string): void => {
    if (at !== undefined) incomplete.set(at, [...(incomplete.get(at) ?? []), marker])
  }

  // Only when the two sides disagree. A marker exists to show a difference, and two texts that both
  // end without a newline are not different - saying so on both would put a hunk on two identical
  // texts, which is the opposite of what this carries the state for.
  if (first.complete !== second.complete) {
    if (!first.complete) note(lastFrom('-'), NO_NEWLINE.first)
    if (!second.complete) note(lastFrom('+'), NO_NEWLINE.second)
  }

  const hunks = ranges(marked, context, new Set(incomplete.keys())).map((range) => {
    const entries = marked.slice(range.from, range.to + 1)

    return {
      header: headerOf(entries, entries[0] as Marked),
      lines: entries.flatMap((entry) => [
        `${entry.mark}${entry.text}`,
        ...(incomplete.get(entry) ?? []),
      ]),
    }
  })

  return {
    added: marked.filter((entry) => entry.mark === '+').length,
    removed: marked.filter((entry) => entry.mark === '-').length,
    hunks,
  }
}

/** `+12 -3`, or nothing at all when the two texts are the same. */
export const renderCount = (held: FileDiff): string =>
  held.added === 0 && held.removed === 0 ? '' : `+${held.added} -${held.removed}`
