import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { THE_REPOSITORY } from './paths.ts'
import {
  THE_PINS_ARE_AN_ASSERTION,
  WHAT_A_SURVIVOR_MEANS_TO_A_READER,
  survivorsByKind,
  theMeasurement,
} from './published.ts'

/**
 * The figures the front of this repository publishes, and the sentence that says what kind of thing
 * they are, resolved against the instrument that produces both.
 *
 * `README.md` is the first thing a stranger reads and the last thing anybody edits. It cannot compute
 * anything - it is Markdown, and generating it would put the project's opening sentence behind a
 * build step no reader can see - so every number in it is a transcription, and this is what stops a
 * transcription from becoming the false half of a true page.
 *
 * **It is the same guard the method page carries, aimed the other way.** There, every figure is
 * computed and a guard requires each run of digits a reader can see to occur in the data. Here the
 * figures are written and a guard requires each to equal what the data says. Both fail on the same
 * event - the instrument moving while the prose does not - and this one is the cheaper half, because
 * a README has five figures and a page has forty.
 *
 * The limit is the method page's own, stated rather than discovered: **a literal equal to today's
 * value passes today.** It goes red on the day the measurement moves, which is the day it would
 * otherwise start lying, and that is the whole of what it promises.
 */

/**
 * The README as one line, because where a paragraph wraps is not a fact about anything asserted here.
 *
 * The claims below used to carry the break the file happened to hold - `are\nequivalent mutants` - so
 * a guard about the instrument went red on a re-flow and the expectation had to be re-transcribed to
 * match a layout. Collapsing runs of whitespace makes a claim the sentence rather than the sentence
 * plus its column width, and it is what makes a transcription longer than one line checkable at all.
 */
const README = (): string =>
  readFileSync(join(THE_REPOSITORY, 'README.md'), 'utf8').replace(/\s+/g, ' ')

describe('what the readme publishes about the measurement', () => {
  /**
   * Every figure, against the value the instrument declares for it.
   *
   * Written as a table of claim and value rather than as five assertions, so that the guard names
   * which figure drifted instead of failing on the first one.
   */
  it('every-figure-in-the-readme-is-the-one-the-instrument-declares', () => {
    const measured = theMeasurement()
    const byKind = survivorsByKind(measured.defects)
    const text = README()

    const claims = [
      `${measured.batteries} mutation batteries`,
      `**${measured.defects.cells} deliberate defects**`,
      `**${measured.defects.killed} are caught.**`,
      `The ${measured.defects.surviving.length} that survive`,
      `all ${measured.defects.cells} cells`,
      `${byKind.equivalent} are equivalent mutants`,
      `${byKind['outside-what-the-contract-specifies']} are behaviour the contract declines to specify`,
      `${byKind['unreachable-on-this-catalogue']} are unreachable on this`,
      `${byKind['only-where-a-lens-blinded-the-suite']} exist only where a lens`,
    ]

    expect(claims.filter((claim) => !text.includes(claim))).toEqual([])
  })

  /**
   * And the page says what kind of thing those figures are, in the instrument's own words.
   *
   * **The guard above establishes that the numbers are right and nothing establishes what they are.**
   * A reader who has run nothing holds an assertion; the figures and an observation of them coincide,
   * because a replay disagreeing with a pin fails the run, and coinciding is not being the same
   * object. The methodology page has carried that distinction since it existed. The README - the
   * surface a stranger meets first, and the one that says *verify it yourself* - carried the drift
   * guarantee and stopped there, which reads as a report of what was run.
   *
   * So it transcribes `THE_PINS_ARE_AN_ASSERTION` rather than a second wording of it: the sentence is
   * already exported for the page to render, and two spellings of one admission are two things that
   * can come apart, on the one claim where being caught overstating would cost most.
   */
  it('the-readme-says-its-figures-are-an-assertion-and-not-an-observation', () => {
    expect(README()).toContain(THE_PINS_ARE_AN_ASSERTION)
  })

  /**
   * The aggregate is never published without the split, which is `published.ts`'s own rule arriving
   * on the one surface it cannot reach by construction.
   *
   * That module refuses to export a survivor total alone, so no page can accidentally render one.
   * Markdown is outside that reach: a README can write any number it likes. What it may not do is
   * write the total and stop, because a count of survivors read alone is a count of holes - and four
   * of the five kinds are not holes at all.
   */
  it('the-readme-never-gives-a-survivor-total-without-its-split', () => {
    const text = README()
    const named = Object.keys(WHAT_A_SURVIVOR_MEANS_TO_A_READER).filter(
      (why) => why !== 'a-declared-open-class',
    )
    const counted = survivorsByKind(theMeasurement().defects)

    expect(text).toContain('exactly one is a debt')
    expect(named.filter((why) => !text.includes(String(counted[why as keyof typeof counted])))).toEqual(
      [],
    )
  })
})
