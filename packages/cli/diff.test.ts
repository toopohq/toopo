import { diff } from 'node:util'

import { describe, it, expect } from 'vitest'

import { ONLY_IN_THE_FIRST, ONLY_IN_THE_SECOND, diffOf, renderCount } from './diff.js'

/**
 * The diff, and the one thing about it that could be wrong in a way nothing else would catch.
 *
 * An inverted diff has the right files, the right line numbers, the right counts and the right hunks.
 * Every guard about shape passes on it. What it does is tell somebody that a line they are about to
 * gain is a line they are about to lose, in the one command whose whole job is to let them decide.
 */

const BEFORE = `one
two
three
four
five
`

describe('what changed between two texts', () => {
  /**
   * The two constants, pinned against the runtime rather than against the comment that explains them.
   *
   * Node's documentation calls `-1` *delete* and `1` *insert*, which reads as though `-1` were the
   * removed line; measured, `1` marks what is only in the first argument. This is the guard that would
   * redden if a future node swapped them, and it is the only reason the two constants exist.
   */
  it('the-diff-op-codes-are-what-node-answers', () => {
    const answered = diff(['same', 'gone'], ['same', 'new'])

    expect(answered).toEqual([
      [0, 'same'],
      [ONLY_IN_THE_FIRST, 'gone'],
      [ONLY_IN_THE_SECOND, 'new'],
    ])
    expect(ONLY_IN_THE_FIRST).not.toBe(ONLY_IN_THE_SECOND)
  })

  /** The same fact one level up, where a reversal would be visible to a person. */
  it('a-line-only-the-first-text-has-is-a-minus', () => {
    const held = diffOf('kept\ngone\n', 'kept\n')

    expect(held.hunks[0]?.lines).toEqual([' kept', '-gone'])
    expect({ added: held.added, removed: held.removed }).toEqual({ added: 0, removed: 1 })
  })

  it('a-line-only-the-second-text-has-is-a-plus', () => {
    const held = diffOf('kept\n', 'kept\narrived\n')

    expect(held.hunks[0]?.lines).toEqual([' kept', '+arrived'])
    expect({ added: held.added, removed: held.removed }).toEqual({ added: 1, removed: 0 })
  })

  it('two-identical-texts-have-nothing-to-show', () => {
    const held = diffOf(BEFORE, BEFORE)

    expect(held.hunks).toEqual([])
    expect(renderCount(held)).toBe('')
  })

  /**
   * A change in the middle of a long file shows its neighbourhood and not the file. Measured on a
   * text long enough for the two to differ - twelve lines, three of context, one change.
   */
  it('only-the-lines-around-a-change-are-shown', () => {
    const lines = Array.from({ length: 12 }, (_, at) => `line ${at}`)
    const changed = lines.map((line, at) => (at === 6 ? 'line six, edited' : line))

    const held = diffOf(`${lines.join('\n')}\n`, `${changed.join('\n')}\n`)

    expect(held.hunks).toHaveLength(1)
    expect(held.hunks[0]?.lines).toEqual([
      ' line 3',
      ' line 4',
      ' line 5',
      '-line 6',
      '+line six, edited',
      ' line 7',
      ' line 8',
      ' line 9',
    ])
  })

  it('two-changes-far-apart-are-two-hunks', () => {
    const lines = Array.from({ length: 30 }, (_, at) => `line ${at}`)
    const changed = lines.map((line, at) => (at === 2 || at === 25 ? `${line}!` : line))

    const held = diffOf(`${lines.join('\n')}\n`, `${changed.join('\n')}\n`)

    expect(held.hunks).toHaveLength(2)
    expect({ added: held.added, removed: held.removed }).toEqual({ added: 2, removed: 2 })
  })

  /**
   * The header a reader counts lines by. One line replaced by one line, three of context either side,
   * is seven lines on both sides starting at the fourth.
   */
  it('a-hunk-header-counts-the-lines-it-covers', () => {
    const lines = Array.from({ length: 12 }, (_, at) => `line ${at}`)
    const changed = lines.map((line, at) => (at === 6 ? 'edited' : line))

    expect(diffOf(`${lines.join('\n')}\n`, `${changed.join('\n')}\n`).hunks[0]?.header).toBe(
      '@@ -4,7 +4,7 @@',
    )
  })

  /**
   * A text that lost its final newline differs from one that has it, and splitting on newlines throws
   * that difference away: `'a\nb'` and `'a\nb\n'` both become two lines. Every text this tool diffs
   * today ends with a newline, which is exactly why the case is carried - an assumption that holds for
   * every current caller is one nobody will recheck.
   */
  it('a-missing-final-newline-is-said-rather-than-lost', () => {
    const held = diffOf('a\nb\n', 'a\nb')

    expect(held.hunks).toHaveLength(1)
    expect(held.hunks[0]?.lines).toEqual([' a', ' b', '\\ the second text has no newline at the end'])
  })

  /** Both sides, so that the marker names a side rather than being read as belonging to either. */
  it('each-side-says-for-itself-that-it-has-no-final-newline', () => {
    expect(diffOf('a', 'a\n').hunks[0]?.lines).toEqual([
      ' a',
      '\\ the first text has no newline at the end',
    ])
    expect(diffOf('a', 'a').hunks).toEqual([])
  })

  it('a-count-is-read-off-the-lines-it-summarises', () => {
    expect(renderCount(diffOf('a\nb\nc\n', 'a\nB\nc\nd\n'))).toBe('+2 -1')
  })
})
