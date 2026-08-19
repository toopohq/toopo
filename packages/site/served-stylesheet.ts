/**
 * The stylesheet as a reader receives it: the same rules, and none of the argument for them.
 *
 * ---------------------------------------------------------------------------
 * What this is worth, measured rather than asserted
 * ---------------------------------------------------------------------------
 *
 * `style.ts` carries its reasoning beside the declaration it explains, which is this repository's own
 * rule about where an argument lives - and the whole of it was being written into every page. Measured
 * at `018a2da` over the emitted tree: **seventy-five comments, 25 007 B of the stylesheet's 41 540**,
 * repeated in each of the fifteen files of HTML the build writes.
 *
 * The raw figure is the one that looks decisive and it is not the one a reader pays. These pages are
 * served compressed, so the reading that decides is brotli: the sheet is **11 236 B compressed and
 * 3 267 B with the prose out**, so the prose is 7 969 B of the sheet compressed - three times less
 * than the raw count suggests. Measured across the change, at `018a2da` and at `54b42e6`: the front
 * page goes **11 724 B to 3 805**, which is 68 % of everything it transferred, and per page the
 * saving runs from 7 679 B on the method page to 7 954 B on a domain page. Over the tree, **236 960 B
 * against 119 086**: half the HTML weight of this site was the commentary of one stylesheet.
 *
 * ---------------------------------------------------------------------------
 * Why the sheet is still inline, which this unit settled rather than left open
 * ---------------------------------------------------------------------------
 *
 * The header of `style.ts` has argued since ADR-0115 that a file and one request would be cheaper at a
 * thousand contracts and is not cheaper today. **Taking the prose out is what settles that, and in the
 * direction the argument already pointed.** Measured on the front page: inline costs 3 805 B where a
 * linked sheet costs 3 808 B on a first visit and 541 B on every page after it - so linking buys
 * 3 264 B per additional page, against one render-blocking round trip, one more address no listing
 * names, and a cache policy this repository does not derive. `theHeaderRules` derives its rules from
 * `ENDPOINTS`, and a stylesheet is not an endpoint; a `.css` file would land where `start.js` already
 * sits, at the host's four-hour default against pages served `max-age=0`. A stale script is a control
 * that does nothing. A stale stylesheet is the page.
 *
 * **The reason to link was that the sheet was heavy. It is 3 267 B.** ADR-0141.
 *
 * ---------------------------------------------------------------------------
 * What a comment is, and the one arm this reader does not need
 * ---------------------------------------------------------------------------
 *
 * A comment opens `/*` and closes with the first `*` `/` after it, **except where it stands inside a
 * string** - so a reader that matched the delimiters and nothing else would eat a rule the first time
 * somebody wrote one into a value. There is no such string today, measured: the whole sheet declares
 * one, `'true'` in an attribute selector. What is live is the other side of the same fact - the
 * comments carry **thirty-eight apostrophes**, so a reader that looked for strings before comments
 * would swallow the sheet whole today. Comments are therefore taken first, in one pass, and a string
 * is only recognised outside one.
 *
 * **There is no arm for an unquoted `url()`, and that is a fact about this site rather than an
 * omission.** CSS reads a url token to its closing bracket and recognises no comment inside it, so
 * `url(a/*b*` `/c)` would be corrupted by any reader shaped like this one. It cannot arise here:
 * `a-page-loads-nothing-and-runs-nothing` refuses `url(` anywhere in a served page, which is a rule
 * about what this site fetches and happens to close this hole as a consequence. The day that guard is
 * relaxed, this reader needs a third arm, and this paragraph is where somebody finds that out.
 *
 * A string ends at its quote **or at a newline**, which is what CSS says and is why a mistyped quote
 * cannot eat the rest of the sheet.
 */

import { STYLE } from './style.js'

/** The escape a string may carry, which takes the character after it whatever that character is. */
const A_BACKSLASH = 92

/**
 * Where a string opened at `quoted` ends: just past its closing quote, or at the newline that ends it
 * badly. Either way the answer is an index the scan may resume from.
 */
const pastTheString = (css: string, quoted: number): number => {
  const quote = css[quoted]
  let at = quoted + 1
  while (at < css.length && css[at] !== quote) {
    if (css[at] === '\n') return at
    at += css.charCodeAt(at) === A_BACKSLASH ? 2 : 1
  }

  return at + 1
}

/** Where a comment opened at `opened` ends, an unclosed one running to the end of the sheet. */
const pastTheComment = (css: string, opened: number): number => {
  const closed = css.indexOf('*/', opened + 2)

  return closed === -1 ? css.length : closed + 2
}

/**
 * The same stylesheet with its comments taken out, and nothing else taken with them.
 *
 * The blank a comment leaves on its own line is kept: sweeping those buys **21 B in brotli**, measured,
 * and it would cost the one claim this file is checked by - that every run taken out of the sheet is
 * comment-delimited, which is what `what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else`
 * establishes without reading a line of this module.
 */
export const withoutComments = (css: string): string => {
  let kept = ''
  let keptFrom = 0
  let at = 0

  while (at < css.length) {
    const character = css[at]

    if (character === '"' || character === "'") {
      at = pastTheString(css, at)
      continue
    }

    if (character === '/' && css[at + 1] === '*') {
      kept += css.slice(keptFrom, at)
      at = pastTheComment(css, at)
      keptFrom = at
      continue
    }

    at += 1
  }

  return kept + css.slice(keptFrom)
}

/**
 * The one string every page carries, which is what `document.ts` writes into its `style` element.
 *
 * Computed once, at load, because it is one value for the whole build and a page is a value the guards
 * build in memory. `STYLE` stays exported and stays annotated: what changed is what a reader
 * downloads, never what a maintainer reads.
 */
export const THE_SERVED_STYLESHEET = withoutComments(STYLE)
