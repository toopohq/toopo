/**
 * What a page is built out of: the kinds of node there are, and the two functions that make one.
 * ADR-0198 is why this is a module of its own rather than the head of `document.ts`.
 *
 * ---------------------------------------------------------------------------
 * Why the vocabulary is not in the file that renders it
 * ---------------------------------------------------------------------------
 *
 * Rendering a page means carrying the stylesheet, so `document.ts` imports `served-stylesheet.js`,
 * which imports `style.js`, which imports `components.js` - and `components.ts` draws markup, so it
 * wanted `el` and `text`. That is a cycle, and it closed on the two constructors below. What broke it
 * is the observation that they are not part of rendering at all: `toHtml` serialises a tree and these
 * build one, and it was their living in the serialiser's file that made the loop unavoidable, because
 * every module that builds a node had to import the module that renders it.
 *
 * **Two loaders, two behaviours, and the dangerous one is the one the guards run under.** Node's own
 * loader throws on whichever module loses the race: measured, entering the graph by `style.ts` gives
 * `Cannot access 'STYLE' before initialization`, and entering by `components.ts` gives the same of
 * `THE_COMPONENT_RULES`. The transform the test runner applies does not throw - it answers `undefined`
 * - so a guard read the whole sheet or the sheet with nine characters where five thousand nine hundred
 * and forty-nine bytes of component rules belonged, according to which module its file named first.
 * `components.test.ts` named the wrong one, and the guard whose subject is that every component is
 * painted by its own rules was sweeping a sheet with no component rules in it. ADR-0197.
 *
 * **What is worth keeping is the property rather than the file boundary: this module imports
 * nothing.** Anything it ever imports can be reached from a page, and a page is what `document.ts`
 * renders - so an import added here is the cycle again, by a longer road.
 *
 * ---------------------------------------------------------------------------
 * No node kind carries raw markup
 * ---------------------------------------------------------------------------
 *
 * There is no kind below holding a string a renderer would write out as it stands. That is what makes
 * the escaping in `document.ts` total by construction rather than by discipline, and it is a property
 * of this vocabulary rather than of that file - which is why it is stated here, where a new kind would
 * be written, and cited there.
 */

export type Attributes = Readonly<Record<string, string>>

/**
 * Every tag this repository builds a node with, closed so that a projection cannot forget one.
 *
 * It used to be `string`, and the separator table was a partial record falling back to *no separator* -
 * which is the exact shape of the defect W-64 published: an element that carried no separator was put
 * where a block belonged, and the element after it began mid-line, on the first screen of the site. A
 * partial table cannot fail to be silent about a tag nobody entered.
 *
 * With the set closed, a total map over it is the shape ADR-0054 asks for: **one more tag does not
 * compile until every projection has said what it does with it.**
 * That is worth more here than anywhere else in this folder, because there are now three projections
 * and the cost of forgetting one is a reading that is quietly wrong rather than a page that breaks.
 *
 * Every one of them has a call site, which is a property of the set rather than a count of it: all but
 * `section` are written by a page, and that one occurs in `document.test.ts`, which builds nesting no
 * page happens to write today.
 *
 * **The last two arrived for the same reason, one at each end of the content.** `main` came with the
 * rail: a page carrying a masthead and a table of contents makes whoever navigates by landmark cross
 * both before reaching a word of the contract, and the remedy for that is the landmark rather than a
 * rule about how many links may come first. `aside` came with the column beside it, and the argument
 * is that rule read backwards - matter a reader may skip has to be skippable, and `complementary` is
 * what says so to somebody who is not looking at the columns. ADR-0116, ADR-0123.
 * Eight tags the separator table used to carry - `table`, `tr`, `ol`, `dl`, `dt`, `dd`, `header`,
 * `footer` - had no call site at all and went with it, because an entry nothing exercises is an entry
 * nothing keeps honest.
 *
 * **Two of the eight came back, and what brought them back is the rule that removed them.** The
 * artboard draws a banner at the top of the page and a contentinfo at the foot; both are now written by
 * `chrome.ts`, so both have a call site and neither is an entry nobody exercises. Five tags entered
 * with them - `span`, `svg`, `rect`, `path` for the marks the design draws, and `footer` for the foot -
 * and the compiler refused each until both projections had said what it does, which is the whole of
 * what this union is for. ADR-0182.
 */
export type Tag =
  | 'header'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'pre'
  | 'ul'
  | 'ol'
  | 'li'
  | 'div'
  | 'section'
  | 'nav'
  | 'main'
  | 'aside'
  | 'a'
  | 'code'
  | 'strong'
  | 'span'
  | 'svg'
  | 'rect'
  | 'path'
  | 'script'

export type TextNode = { readonly kind: 'text'; readonly text: string }

export type Element = {
  readonly kind: 'element'
  readonly tag: Tag
  readonly attributes: Attributes
  readonly children: readonly Node[]
}

export type Node = TextNode | Element

export const text = (value: string): Node => ({ kind: 'text', text: value })

export const el = (tag: Tag, attributes: Attributes, ...children: readonly Node[]): Node => ({
  kind: 'element',
  tag,
  attributes,
  children,
})
