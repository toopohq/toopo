import { describe, it, expect } from 'vitest'

import { THE_SERVED_STYLESHEET, withoutComments } from './served-stylesheet.js'
import { STYLE } from './style.js'

/** How much of a run a fault reprints: enough to find it, never enough to be a second copy of it. */
const ENOUGH_TO_FIND_IT = 60

/**
 * The first run of the source that is missing from what is served and is not a comment, or `null`.
 *
 * **The walk is anchored on the served sheet and it reads no line of `served-stylesheet.ts`**, which is
 * the whole of why it is worth taking. It matches the two strings character by character; where they
 * diverge it requires the source to be opening a comment, skips to that comment's own close, and
 * carries on. So a run taken out of the middle of a rule has nothing to justify it and is reported.
 *
 * **A greedy `is this a subsequence` walk was written first and refuted by measuring it**: allowed to
 * resynchronise on any coincidental character match, it reported **322 deleted runs where the sheet has
 * 75 comments**, because comment prose shares characters with the CSS after it. A walk that finds *a*
 * subsequence embedding says nothing about the intended one.
 *
 * **The comment is preferred over the match, and that ordering is load-bearing.** Where a comment is
 * followed by a `/`, matching first would consume the source's comment opener as though it were that
 * slash and then report a fault on perfectly good work. Where the served sheet legitimately carries
 * `/*` - inside a string - both sides open one and the walk matches, which is what keeps a kept string
 * from reading as a removal.
 */
const takenOutAndNotAComment = (source: string, served: string): string | null => {
  let inSource = 0
  let inServed = 0

  while (inSource < source.length) {
    if (source.startsWith('/*', inSource) && !served.startsWith('/*', inServed)) {
      const closed = source.indexOf('*/', inSource + 2)
      inSource = closed === -1 ? source.length : closed + 2
      continue
    }

    if (source[inSource] !== served[inServed]) {
      return source.slice(inSource, inSource + ENOUGH_TO_FIND_IT)
    }

    inSource += 1
    inServed += 1
  }

  return inServed === served.length ? null : served.slice(inServed, inServed + ENOUGH_TO_FIND_IT)
}

describe('a reader receives the rules and not the argument for them', () => {
  /**
   * The prose of `style.ts` does not travel.
   *
   * Measured at `018a2da`: 75 comments and 25 007 B of a 41 540 B sheet, written into every one of the
   * fifteen files of HTML the build produces. Read across the change, at `018a2da` and at `54b42e6`:
   * **the front page goes from 11 724 B to 3 805 B in brotli**, and the tree from 236 960 to 119 086.
   * ADR-0141 carries the reading and the trade it settled.
   *
   * **The source is asserted to carry a comment first**, because a sweep whose population has left is
   * a sweep that passes by having nothing to look at - the shape the two geometry guards of
   * `document.test.ts` already refuse. Here it is sharper than usual: the whole subject of this file is
   * removing something, so a green over an empty removal is exactly the wrong reading.
   *
   * The mutant it exists for is the removal bypassed. Seen red before it was believed, and seen to
   * redden **this guard and neither of its neighbours**: with `THE_SERVED_STYLESHEET` bound to
   * `STYLE`, the fault reads *a comment survived into the served sheet*.
   */
  it('the-stylesheet-a-reader-receives-carries-no-comment', () => {
    expect(STYLE, 'the source carries no comment, so there is nothing to take out').toContain('/*')

    expect(THE_SERVED_STYLESHEET.includes('/*'), 'a comment survived into the served sheet').toBe(false)
    expect(THE_SERVED_STYLESHEET.includes('*/'), 'a comment close survived into the served sheet').toBe(
      false,
    )
  })

  /**
   * Nothing but a comment left the sheet on the way to a reader.
   *
   * **This is the guard beside the one above, and saying both out loud is what separates them**: that
   * one says the prose is gone, this one says nothing went with it. Neither implies the other, and a
   * removal that ate a rule satisfies the first perfectly.
   *
   * It reads the whole of the real stylesheet - 41 540 characters - where
   * `what-this-reads-as-a-comment-is-what-a-browser-reads-as-one` reads four short inputs chosen for
   * their hazards. That is the division: crafted rows catch a reader that is wrong about what a
   * comment *is*, and this catches one that is wrong about the sheet this site actually serves.
   *
   * **What it cannot catch is named rather than implied.** A removal that takes one declaration out of
   * the middle of a rule *and* replaces it with nothing a comment could not have covered is invisible
   * here, because the walk only asks that a divergence begin at `/*`. The total form is a CSS parser
   * comparing two rule lists, which this repository will not gain for one stylesheet; ADR-0141 prices
   * it and refuses it, and this sentence is where a reader finds the blind spot without having to
   * infer it.
   *
   * **The mutant it exists for is the removal that sweeps up after itself**, and it is the one this
   * unit built and refused: taking the blank line a comment leaves behind buys 21 B in brotli and
   * removes a newline no comment covers. Seen red before it was believed, and seen to redden **this
   * guard and neither of its neighbours** - the fault reads the declaration that follows the first
   * comment of the sheet, which is where the two strings part company.
   */
  it('what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else', () => {
    expect(takenOutAndNotAComment(STYLE, THE_SERVED_STYLESHEET)).toBeNull()
  })

  /**
   * What this reads as a comment is what a browser reads as one.
   *
   * Four rows, and each is a hazard rather than an example. **The second is live and the others are
   * not**, which is the whole reason the reader is written as a scan instead of as one regular
   * expression: the sheet carries thirty-eight apostrophes inside its comments and exactly one string
   * outside them, `'true'`, so a reader that looked for strings before comments would swallow this
   * site today, and one that matched the delimiters alone is correct until somebody writes a value.
   *
   * The last row is why a string ends at a newline as well as at its quote: without it a mistyped
   * quote does not break one declaration, it silently returns the whole sheet with its comments still
   * in - a defect that looks exactly like this unit never happening.
   *
   * The mutant it exists for is a reader that takes a delimiter for a comment wherever it stands -
   * the regular expression anybody reaches for first. Seen red before it was believed, with the
   * string arm dropped: the first row loses the value out of `content`, and **the two guards above
   * stay green on the real sheet**, which is the whole reason those two are not enough on their own.
   */
  it('what-this-reads-as-a-comment-is-what-a-browser-reads-as-one', () => {
    // A comment opener inside a value is a value, and taking it for a comment eats the rule with it.
    expect(withoutComments('a { content: "/* x */"; color: red }')).toBe(
      'a { content: "/* x */"; color: red }',
    )

    // An apostrophe inside a comment is prose, because a comment is read before a string can open.
    expect(withoutComments("/* a card's own */ a { color: red }")).toBe(' a { color: red }')

    // A comment nobody closed takes the rest of the sheet and not the rule before it.
    expect(withoutComments('a { color: red } /* and then')).toBe('a { color: red } ')

    // A string ends at a newline as well as at its quote, so a mistyped quote cannot eat the sheet.
    expect(withoutComments('a { content: "oops\n} b { color: red } /* c */')).toBe(
      'a { content: "oops\n} b { color: red } ',
    )
  })
})
