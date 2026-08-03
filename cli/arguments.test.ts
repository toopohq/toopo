import { describe, it, expect } from 'vitest'

import { parseArguments } from './arguments.js'

/**
 * What the user typed, and what is refused rather than guessed.
 *
 * The grammar is two commands and two flags, so what is worth guarding is not that it parses - it is
 * that everything outside the grammar produces a sentence instead of a default. A `toopo add` that
 * read an unknown flag as decoration would install something other than what was asked for and say
 * nothing about it.
 */

describe('what the user typed', () => {
  it('a-command-with-no-flag-is-read', () => {
    expect(parseArguments(['init'])).toEqual({ command: { name: 'init', directory: null } })
    expect(parseArguments(['add', 'string/slugify'])).toEqual({
      command: { name: 'add', contract: 'string/slugify', implementation: null },
    })
  })

  it('a-flag-and-its-value-are-read', () => {
    expect(parseArguments(['init', '--dir', 'app/toopo'])).toEqual({
      command: { name: 'init', directory: 'app/toopo' },
    })
    expect(parseArguments(['add', 'number/parse', '--implementation', 'reference'])).toEqual({
      command: { name: 'add', contract: 'number/parse', implementation: 'reference' },
    })
  })

  /**
   * A flag whose value is missing must never be read as an empty one. `--dir` at the end of a line is
   * a user whose shell ate an argument, and `init --dir ''` would silently configure the project root.
   */
  it('a-flag-with-no-value-is-refused', () => {
    expect(parseArguments(['init', '--dir'])).toEqual({
      faults: ['`--dir` was given no value'],
    })
    expect(parseArguments(['init', '--dir', '--dir'])).toEqual({
      faults: ['`--dir` was given no value', '`--dir` was given no value'],
    })
  })

  it('an-unknown-command-and-an-unknown-flag-are-refused', () => {
    expect(parseArguments(['remove', 'string/slugify'])).toEqual({
      faults: ['`remove` is not a command this `toopo` has'],
    })
    expect(parseArguments(['add', 'string/slugify', '--force'])).toEqual({
      faults: ['`--force` is not a flag this command takes (--implementation)'],
    })
  })

  /** `add` with the flag first is a user who forgot the name, not a user asking for the default. */
  it('add-without-a-contract-is-refused', () => {
    expect(parseArguments(['add'])).toEqual({ faults: ['`add` needs the name of a contract'] })
    expect(parseArguments(['add', '--implementation', 'reference'])).toEqual({
      faults: ['`add` needs the name of a contract before any flag'],
    })
  })

  it('a-repeated-flag-and-a-stray-word-are-refused', () => {
    expect(parseArguments(['init', '--dir', 'a', '--dir', 'b'])).toEqual({
      faults: ['`--dir` was given twice'],
    })
    expect(parseArguments(['add', 'string/slugify', 'string/levenshtein'])).toEqual({
      faults: ['`string/levenshtein` is not a flag, and this command takes no further argument'],
    })
  })

  it('nothing-at-all-is-refused', () => {
    expect(parseArguments([])).toEqual({ faults: ['no command was given'] })
  })

  /**
   * The acceptance permanent rule 4 asks for, as a word the user types rather than as an answer to a
   * prompt. Without the flag the command shows and writes nothing, which is why its default is the
   * safe one and not the convenient one.
   */
  it('update-writes-only-when-it-is-asked-to', () => {
    expect(parseArguments(['update'])).toEqual({ command: { name: 'update', apply: false } })
    expect(parseArguments(['update', '--apply'])).toEqual({
      command: { name: 'update', apply: true },
    })
  })

  /**
   * A switch is a flag that is its own answer, and it must never swallow the word after it. `--apply
   * --dir x` is a user asking for two things, not a switch that ate one of them.
   */
  it('a-switch-takes-no-value-and-swallows-nothing', () => {
    expect(parseArguments(['update', '--apply', '--dir'])).toEqual({
      faults: ['`--dir` is not a flag this command takes (--apply)'],
    })
    expect(parseArguments(['update', '--apply', '--apply'])).toEqual({
      faults: ['`--apply` was given twice'],
    })
    expect(parseArguments(['update', 'string/slugify'])).toEqual({
      faults: ['`string/slugify` is not a flag, and this command takes no further argument'],
    })
  })
})
