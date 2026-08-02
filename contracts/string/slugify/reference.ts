/**
 * `string/slugify@1` - turn human-authored text into an identifier that is safe in a URL path
 * segment, readable, and stable.
 *
 * Written to be read. The whole function is one pass over the code points of the normalised text,
 * and the three questions it asks about each one are the three lines of the rule the contract
 * publishes: is this a letter, a mark or a digit; is this mark already carried by the letter in
 * front of it; and is there a boundary to emit before it.
 *
 * The rule adds no mapping of its own. Every fold below is Unicode's - `NFKC` unifies presentation
 * forms, and a canonical composition decides which marks a base absorbs - which is what makes it
 * three lines instead of a table of two thousand entries. A table is a language, and a language is
 * a locale; the contract argues that at length.
 *
 * Two subtleties, both of them measured rather than reasoned, and both of them defects this file
 * carried before they were caught.
 *
 * A mark is compared against **the base of its run**, never against the code point immediately to
 * its left. Unicode's blocking rule lets a mark of high combining class compose onto the starter
 * across a mark of lower class, so `e` + fatha + acute has the acute reaching the `e` over the
 * fatha; a neighbour test keeps that acute, and the next call composes it away.
 *
 * The output is a fixed point of this function, and the reason is that no surviving mark composes
 * onto its base and marks never compose onto one another. That sentence is the invariant, and the
 * contract has a property and a mutant for it, because the first two arguments for it were wrong.
 *
 * There is no diagnostic export beside this one. Every string has a slug - the empty one, when
 * nothing in the text is a letter, a mark or a digit - so there is no refusal to describe.
 */

/** What survives the fold: a letter, a mark, or a decimal digit. Everything else is a boundary. */
const KEPT = /[\p{L}\p{M}\p{Nd}]/u

const MARK = /\p{M}/u

/** The first code point of a canonical decomposition: `é` yields `e`, and `日` yields itself. */
const baseOf = (point: string): string => [...point.normalize('NFD')][0]

/** Whether the base already carries this mark - that is, whether the two compose into one. */
const absorbs = (base: string, mark: string): boolean =>
  [...`${base}${mark}`.normalize('NFC')].length === 1

export const slugify = (text: string): string => {
  const out: string[] = []

  /** The letter the current run hangs off, or `null` before one has been seen. */
  let runBase: string | null = null
  let boundary = false

  for (const point of text.normalize('NFKC')) {
    const base = baseOf(point)

    if (!KEPT.test(base)) {
      boundary = true
      runBase = null
      continue
    }

    const lowered = base.toLowerCase()

    if (MARK.test(lowered)) {
      if (runBase !== null && absorbs(runBase, lowered)) continue
    } else {
      runBase = lowered
    }

    // A boundary becomes a separator only between two runs, which is what keeps one off each end.
    if (boundary && out.length > 0) out.push('-')
    boundary = false

    out.push(lowered)
  }

  return out.join('')
}
