/**
 * How this site writes a number, and how it shows one.
 *
 * **This is `marks.ts`'s argument on a second subject, and it arrived the same way.** Both lived
 * beside the page that needed them first, which was right while one page needed them; the front page's
 * column beside the catalogue is the second, and a second copy of a rendering decision is two
 * statements of one thing that drift until one lies. They had already drifted before this module
 * existed: the copy written for that column left out the space between the figure and its word, so the
 * front page's Markdown twin read `**672**defect cells injected` where every card on the site reads
 * `**7 075** bytes, one file`. That is the whole argument, found rather than predicted, on the second
 * copy and within one unit of it being written. ADR-0123.
 *
 * `grouped` had drifted further and more quietly: three identical copies across three pages, none of
 * them wrong, all of them one edit away from being. Nothing found that, because there is nothing to
 * find until one of them moves.
 */

import type { Node } from './document.js'
import { el, text } from './document.js'

const NOTHING = {} as const

/**
 * A number with the thousands marked, because a quantity is read rather than parsed.
 *
 * A no-break space and not a comma: this catalogue publishes byte counts beside code, where a comma is
 * a separator a reader has to decide about. `en-US` is asked for the grouping and its comma is then
 * replaced, rather than a locale being trusted to answer the same way on every machine that builds
 * this site.
 */
export const grouped = (value: number): string =>
  value.toLocaleString('en-US').replaceAll(',', ' ')

/**
 * One figure: the number, then what it counts.
 *
 * **It is one paragraph and not two, and the reading is why.** Split into a value and a label the page
 * reads `3 332` and then `bytes, one file` as two separate things, where
 * `the-cost-a-page-states-is-what-lands-and-not-what-is-served` asks for `3 332 bytes` - and it is
 * right to, because that is the sentence a reader is owed and two stacked fragments are not one. The
 * look the mock-ups carry, a large mono figure over a small label, is what the stylesheet makes of
 * `strong`; the sentence survives underneath it.
 *
 * The value is a string rather than a number because not every figure is one this module formats: a
 * count of imports is written as it stands, and passing it through the grouping would be asking a
 * question about thousands of a quantity that has none.
 */
export const figure = (value: string, counts: string): Node =>
  el('p', { class: 'figure' }, el('strong', NOTHING, text(value)), text(` ${counts}`))
