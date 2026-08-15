import { describe, it, expect } from 'vitest'

import { readAnchors, renderLoose } from './anchors.ts'

/**
 * Every quotation every battery makes of this repository's source, resolved against the tree it will
 * be applied to.
 *
 * A mutant is written as a *quotation* of the line it replaces, so a change that moves a quoted line
 * breaks the battery rather than the code. Nothing said so until a replay reached that cell, and by
 * then the change was committed: C-19 and A-14 were each found that way, one replay at a time, at
 * thirty-five minutes a replay. The reading has existed as a diagnostic since then and had to be
 * remembered; this is the same reading, at the cadence of the suite.
 *
 * **It is one guard because a loose anchor is one failure**, whatever the family of the quotation. A
 * mutant's edit and a lens's edit are matched by the same function against the same text - `runCell`
 * applies a lens's before a mutant's - so splitting them would be two guards over one condition, with
 * nothing to say for themselves on the day they disagreed.
 *
 * `renderLoose` is what the report prints, reused rather than restated: a guard that formatted its own
 * failure would be a second statement of what a loose anchor is, free to describe it differently from
 * the command a reader runs next.
 */

describe('what every battery quotes of the tree it injects into', () => {
  /**
   * Seen red by moving a line one battery quotes, which is the change this guard exists in front of.
   *
   * What it cannot do is name the repair, and that is `anchors.ts`'s own limit rather than this
   * guard's: by the time a quotation has stopped matching, all that is known is that it is gone. What
   * the report gives instead is the file and the label, which is what somebody who has just moved a
   * line needs to move the anchor with it.
   */
  it('every-anchor-of-every-battery-still-quotes-its-file', () => {
    const reading = readAnchors()

    expect(reading.loose.length === 0 ? '' : renderLoose(reading)).toBe('')
    expect(reading.resolved.length).toBeGreaterThan(0)
  })
})
