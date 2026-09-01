/**
 * The two marks a sentence written for a reader of source carries, and the one function that reads
 * them.
 * ADR-0026 is why they are parsed once rather than stripped where each page needs them stripped;
 * ADR-0117 is why the catalogue's own prose is read by this function too.
 *
 *
 * ---------------------------------------------------------------------------
 * Why this is a module and not two helpers beside the page that needed them first
 * ---------------------------------------------------------------------------
 *
 * These lived in `methodology-page.ts`, which was right while one page took prose written for a
 * reader of source. Six pages take it now - every contract page, from the catalogue's own records -
 * and ADR-0026 named that arrival as what would reopen its scope.
 *
 * **The method page was the second and it is gone.** ADR-0189 retired it and serves the methodology
 * as data, so the arrival that reopened the scope has outlived the page that made it; what keeps this
 * module is the six that remain, and a copy of the parser would be a copy six pages share. This
 * paragraph went on naming that page for as long as it took somebody to count. ADR-0195.
 *
 * **A copy of a parser is not a second opinion, it is the same statement written where nobody will
 * maintain it.** That sentence is ADR-0026's and it decided this file: the alternative was a second
 * `asCode` in `contract-page.ts`, which would have been correct on the day it was written and would
 * have drifted on the first reword of either.
 *
 * ---------------------------------------------------------------------------
 * What is prose and what is content, which is the one distinction a caller has to get right
 * ---------------------------------------------------------------------------
 *
 * A backtick in a rationale is syntax; the same backtick inside a rendered call is the contract's own
 * answer and a character of it. So a caller routes *prose* through here and never a value `literal`
 * produced - the same line `document.ts` already draws with `THE_MARKDOWN.verbatim`, arriving one
 * floor up where the tree is built rather than where it is projected.
 *
 * Nothing here holds raw markup: `strong` and `code` are nodes, so `document.ts`'s rule that there is
 * nowhere for an escape to be forgotten survives untouched.
 */

import type { Attributes, Node, Tag } from './document.js'
import { el, text } from './document.js'

const NOTHING = {} as const

/**
 * A sentence's code marks, turned into the elements they already mean.
 *
 * It is deliberately two marks and not a Markdown renderer. A third mark would be a feature nobody
 * asked for, and an unpaired one is left as the character it is rather than guessed at.
 */
const asCode = (prose: string): readonly Node[] =>
  prose
    .split(/(`[^`]+`)/g)
    .filter((piece) => piece !== '')
    .map((piece) =>
      piece.startsWith('`') && piece.endsWith('`') && piece.length > 1
        ? el('code', NOTHING, text(piece.slice(1, -1)))
        : text(piece),
    )

/**
 * Both marks, the code one nested inside the bold one.
 *
 * **The two nest, and only the reading found that they had to.** The first version split on both
 * marks at once, so a code mark inside a bold span was swallowed by it - and P-20 of `number-parse`
 * writes exactly that, publishing the backticks around `\s` on the page. Every type was satisfied and
 * every projection guard was green; the sentence was simply wrong on screen.
 *
 * Exported for the guards that require a sentence on a page. They have to ask for it *as a reader
 * sees it*, and a guard stripping the marks itself would be a second statement of what this function
 * does, wrong on the day a third mark is added.
 */
export const inline = (prose: string): readonly Node[] =>
  prose
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((piece) => piece !== '')
    .flatMap((piece) =>
      piece.startsWith('**') && piece.endsWith('**')
        ? [el('strong', NOTHING, ...asCode(piece.slice(2, -2)))]
        : asCode(piece),
    )

/** A sentence at whatever tag the outline asks for, with its marks read. */
export const marked = (tag: Tag, prose: string, attributes: Attributes = NOTHING): Node =>
  el(tag, attributes, ...inline(prose))

/** The same, at the tag prose almost always takes. */
export const paragraph = (prose: string, attributes: Attributes = NOTHING): Node =>
  marked('p', prose, attributes)
