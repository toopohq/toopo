import { describe, expect, it } from 'vitest'

import { renderUnclaimedReds, unclaimedRedsIn } from './attribution.ts'
import type { RunResult } from './run.ts'
import { THE_MOST_REDS_A_PIN_NAMES_IN_FULL } from './run.ts'

/**
 * The mirror of the silence, and the four ways it could report nothing.
 *
 * The subject is the one thing this instrument could not see. A pin is checked as a subset -
 * `agreesWith` asks that every named guard reddened and never that every reddened guard was named - so
 * a cell that reddens beyond its pin agrees with its battery and the run exits 0. That is how one load
 * flake on `I-38` rewrote a census with every gate green. `attribution.ts` carries the argument; these
 * carry its failure conditions.
 *
 * **They are here rather than in `instrument.test.ts` because they are pure, and that file is not.**
 * It calibrates the fixture battery at module scope, so it refuses to collect at all on a working tree
 * carrying uncommitted changes - which is right for guards about an apparatus that checks arms out
 * into the tree, and which would mean a reading over a list of records could only be seen red at a
 * commit. Nothing below touches a disk, spawns a process or reads the repository.
 */
describe('a red no pin claimed is reported, and never absorbed', () => {
  const cell = (
    mutant: string,
    failedGuards: readonly string[],
    by: readonly string[] | undefined,
  ): RunResult => ({
    mutant,
    arm: 'R',
    lens: 'as-committed',
    verdict: 'killed',
    failedGuards,
    expected: by === undefined ? { verdict: 'killed' } : { verdict: 'killed', by },
    agrees: true,
  })

  /**
   * The shape ADR-0204 met, restated as the cell it happened on: two guards red, one named, and the
   * unnamed one with no causal path to the edit.
   */
  it('a-red-the-pin-of-its-own-cell-does-not-name-is-reported', () => {
    const reds = unclaimedRedsIn([
      cell(
        'I-38',
        ['the-served-bytes-are-the-committed-bytes', 'an-edge-is-followed'],
        ['an-edge-is-followed'],
      ),
    ])

    expect(reds.map((entry) => entry.cell)).toEqual(['I-38 R/as-committed'])
    expect(reds.map((entry) => entry.unclaimed)).toEqual([
      ['the-served-bytes-are-the-committed-bytes'],
    ])
  })

  /**
   * The other half, and the one that decides whether the reading is readable at all.
   *
   * Above the line a pin names the guards the mutant was written to exercise and deliberately not the
   * rest, so reporting an unnamed red there reports a decision rather than a debt. Measured over one
   * whole replay, the unbounded form answers 634 guards where this one answers 155 cells.
   *
   * The second assertion is what makes the first a claim about the line rather than about the guards:
   * the same pin over one fewer red is reported.
   */
  it('a-red-above-the-line-a-pin-draws-in-full-is-not-reported', () => {
    const wide = Array.from(
      { length: THE_MOST_REDS_A_PIN_NAMES_IN_FULL + 1 },
      (_, index) => `guard-${index}`,
    )

    expect(unclaimedRedsIn([cell('M-11', wide, [wide[0]])])).toEqual([])
    expect(unclaimedRedsIn([cell('M-11', wide.slice(1), [wide[1]])])).toHaveLength(1)
  })

  /** A pin that owes nothing reports nothing, which is what puts the count at zero on a healthy run. */
  it('a-cell-whose-pin-names-every-guard-it-reddened-is-not-reported', () => {
    const named = ['a-first-guard', 'a-second-guard']

    expect(unclaimedRedsIn([cell('I-51', named, named)])).toEqual([])
    expect(unclaimedRedsIn([cell('I-51', named, [])])).toHaveLength(1)
  })

  /**
   * What a reader is handed, which is the count, the guard and what to do about it.
   *
   * **The other half of the arbitration is not here, and the reason is that nothing could break it.**
   * *Reported and never refused* is held by the shape: `disagreementsIn` takes columns and this reading
   * takes cells, so refusing on an unclaimed red would mean handing it a second argument, and that does
   * not compile. A guard asserting it would be asserting what the compiler already refuses - so this
   * one is named for what it holds, and the sentence about the shape is in `attribution.ts`.
   *
   * What it does hold is that a reader meets the guidance, because the gesture this reading invites is
   * the wrong one: an unclaimed red is a load flake or a detection nobody pinned, one run does not
   * separate them, and widening the pin to absorb it turns an unread cause into a published fact. And
   * that a clean run is not lectured, because a block that prints advice over nothing teaches a reader
   * to skip it.
   */
  it('a-red-is-reported-with-what-to-do-about-it-and-a-clean-run-is-not-lectured', () => {
    const reds = unclaimedRedsIn([
      cell('I-38', ['a-noisy-guard', 'an-aimed-guard'], ['an-aimed-guard']),
    ])
    const printed = renderUnclaimedReds(reds)

    expect(printed).toContain('UNCLAIMED BY THE PIN OF ITS OWN CELL')
    expect(printed).toContain('reddened (1)')
    expect(printed).toContain('a-noisy-guard')
    expect(printed).toMatch(/never to quieten a red whose cause is unread/)
    expect(renderUnclaimedReds([])).not.toMatch(/never to quieten/)
  })
})
