/**
 * What a stylesheet paints, read off the page that carries it.
 * ADR-0197 is why the sheet is taken from a rendering rather than imported.
 *
 * ---------------------------------------------------------------------------
 * Why the sheet is read out of a page and never imported
 * ---------------------------------------------------------------------------
 *
 * `document.ts` imports `served-stylesheet.ts`, which imports `style.ts`, which imports
 * `components.ts`, which imports `document.ts`. That is a cycle, and what a cycle decides is which
 * module was entered first. Under node's own loader the loser throws, which is loud; under the
 * transform the test runner applies it is `undefined`, which is silent.
 *
 * **Measured at `42cb81d`, two files differing only in the order of their imports**: entered through
 * `document.js` the served sheet is **27 036 B**; entered through `components.js` it is **21 096 B**,
 * the 5 949 B of component rules replaced by the nine characters of `undefined`. `THE_COMPONENT_RULES`
 * is 5 949 B in both. Nothing threw and nothing was reported.
 *
 * So a guard that imports the sheet is a guard whose subject depends on the order of its own import
 * list, and one such guard was already reading the short sheet - `components.test.ts`, which imports
 * `./components.js` first. What it lost is measured in that file.
 *
 * Reading the sheet out of a rendered page has no such degree of freedom, and it is the better reading
 * on its own merits: `<style>` is written verbatim by `document.ts`, so what comes back is the bytes a
 * reader receives rather than the value a module composed. It is `build.ts`'s own rule one floor down -
 * a count taken from an input is a claim about an intention.
 *
 * **The cycle itself is not repaired here.** Breaking it means either `components.ts` giving up `el`
 * and `text`, or `document.ts` giving up the sheet, and both are a decision about how this folder is
 * arranged rather than about what the stylesheet paints. ADR-0197 records it with what it costs.
 */

/**
 * At-rules whose body holds rules rather than declarations.
 *
 * A `@media` block contains selectors and a `@font-face` block does not, so the two cannot be walked
 * the same way. Anything not named here is read as holding declarations, which is the safe direction:
 * a grouping at-rule this list has not heard of loses its selectors from the population rather than
 * putting a keyframe step into it.
 */
const GROUPING = /^@(?:media|supports|layer|container|scope|document)\b/

/**
 * Every selector a block of CSS declares, at every depth, one entry per comma-separated member.
 *
 * A scan and not a parser, which is enough because the population is this repository's own stylesheet:
 * it is written by hand, it nests only in at-rules, and it is read with its comments already out.
 *
 * **A comma group is as many selectors as it has members.** `h2.call, h3.call` is two claims about two
 * shapes, and one of them can be dead while the other is not - which is exactly what was measured of
 * that pair.
 *
 * **At every depth, because a rule inside a `@media` is a rule.** Measured at `42cb81d`, this sheet
 * declares 195 selectors at the top level and 213 in all, and **7 of the 18 nested occurrences are
 * spellings that occur nowhere else** - six of which were painting a layout no page has built since
 * ADR-0189.
 */
export const selectorsIn = (css: string): readonly string[] => {
  const found: string[] = []
  const holdsRules: boolean[] = [true]
  let since = 0

  for (let at = 0; at < css.length; at += 1) {
    if (css[at] === '{') {
      const prelude = css.slice(since, at).trim()
      const isAtRule = prelude.startsWith('@')

      if (holdsRules[holdsRules.length - 1] === true && !isAtRule && prelude.length > 0) {
        found.push(prelude)
      }

      holdsRules.push(isAtRule ? GROUPING.test(prelude) : false)
      since = at + 1
      continue
    }

    if (css[at] === '}') {
      holdsRules.pop()
      since = at + 1
      continue
    }

    // A declaration inside a grouping at-rule would otherwise be read as the prelude of the next rule.
    if (css[at] === ';' && holdsRules[holdsRules.length - 1] === true) since = at + 1
  }

  return found
    .flatMap((one) => one.split(','))
    .map((one) => one.trim())
    .filter((one) => one.length > 0)
}

/**
 * States and pseudo-elements, longest alternative first.
 *
 * The order is load-bearing and it was got wrong once: with `focus` before `focus-visible`,
 * `:focus-visible` loses its head and leaves `-visible` glued to the element beside it, so
 * `input:focus-visible` is asked of the matcher as `input-visible` and reported as painting nothing.
 */
const NOT_AN_ELEMENT =
  /::?(?:focus-visible|focus-within|focus|hover|active|visited|target|empty|checked|disabled|enabled|default|indeterminate|first-of-type|last-of-type|first-child|last-child|only-child|placeholder-shown|placeholder|before|after|marker|selection|backdrop|file-selector-button|-webkit-[a-z-]+|-moz-[a-z-]+)\b/g

/**
 * The same selector with everything that is not an element taken out.
 *
 * A static document carries no state and no pseudo-element is an element, so asking a matcher about
 * `a:hover` or `p::before` answers about the page's furniture rather than about the rule. What is left
 * is the shape the rule paints when the state is on, which is the thing worth asking about.
 *
 * **A selector that is nothing but a state answers `*`, and never the empty string.** This sheet
 * declares one, `:focus-visible`, which paints whichever element the reader has reached with a
 * keyboard - so its subject is every element, which is what `*` says. The empty string says the
 * opposite to everything downstream: a matcher throws on it, and a sweep that dropped it would lose a
 * live rule from its population without reporting anything.
 */
export const asAnElement = (selector: string): string => {
  const left = selector.replace(NOT_AN_ELEMENT, '').trim()

  return left.length === 0 ? '*' : left
}

/**
 * The stylesheet a page carries, taken from the page.
 *
 * `document.ts` writes `<style>` with the sheet interpolated verbatim - it is the one thing on a page
 * that must not be escaped and it says so - so the run between the tags is the bytes themselves.
 */
export const theSheetAPageCarries = (html: string): string => {
  const opened = html.indexOf('<style>')
  const closed = html.indexOf('</style>', opened)
  if (opened === -1 || closed === -1) throw new Error('the page carries no stylesheet')

  return html.slice(opened + '<style>'.length, closed)
}
