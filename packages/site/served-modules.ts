/**
 * Taking this repository's argument out of the modules a reader downloads.
 * ADR-0156 is why this is a lexer rather than a parser, and what keeps it honest.
 *
 *
 * ---------------------------------------------------------------------------
 * A CSS comment is whitespace and a JavaScript comment is not
 * ---------------------------------------------------------------------------
 *
 * `served-stylesheet.ts` next door removes a comment by writing nothing in its place, because that is
 * what CSS says a comment is worth. Here it would change what runs: a comment carrying a line
 * terminator *is* a line terminator for automatic semicolon insertion. Measured: a `return` separated
 * from its value by a block comment that spans a line answers `undefined`, and the same source with
 * that comment deleted answers `42`. Both parse. Nothing throws. V8 and the compiler's own parser
 * agree on all three readings of it, which is what makes the guard below worth having.
 *
 * So the replacement is the one the specification names rather than the one that reads tidiest: a
 * comment that carries a line terminator becomes one, and a comment that carries none becomes a
 * space, which keeps two tokens apart without inventing a line break. Measured on the fourteen served
 * modules, all three candidate rules - a line terminator, a space always, nothing at all - leave every
 * syntax tree identical, because no module of this catalogue carries the hazard today. **That zero is
 * the comfortable reading that would let somebody ship the wrong rule**, and it is why the rule is
 * argued from the specification and not from the corpus.
 *
 * ---------------------------------------------------------------------------
 * The reading is the compiler's, and it lives one module over
 * ---------------------------------------------------------------------------
 *
 * `scanning.ts` drives the compiler's own scanner and resolves the two ambiguities a lexer cannot
 * settle alone - whether a `/` opens a regular expression or divides, and where a template literal
 * resumes after a substitution - with ADR-0156's measurements of why nothing weaker survives this
 * repository's prose. This file is that drive's first reader: a comment is a token like any other to
 * the drive, and what makes one *removable as whitespace-or-terminator* is this file's claim, not the
 * scanner's.
 */

import { A_COMMENT, everyTokenIn } from './scanning.js'

/** Where one comment sits in a module, as offsets into it. */
export type CommentRange = {
  readonly from: number
  readonly to: number
}

/** Every comment in one module of JavaScript, in the order it is written. */
export const theCommentRangesIn = (javascript: string): readonly CommentRange[] =>
  everyTokenIn(javascript)
    .filter((token) => A_COMMENT.has(token.kind))
    .map((token) => ({ from: token.from, to: token.to }))

/**
 * What a parser counts as the end of a line, written as escapes so that a reader can see all four.
 *
 * The last two are line terminators in JavaScript and in nothing else a text editor shows, so a file
 * that spelled them literally would carry a rule nobody can read.
 */
const A_LINE_TERMINATOR = /[\n\r\u2028\u2029]/

/**
 * One module of this repository with the reason for it taken out and the program left alone.
 *
 * The replacement is never nothing: two tokens a comment kept apart have to stay apart, and a line
 * terminator a comment supplied has to stay supplied.
 */
export const withoutItsArgument = (javascript: string): string => {
  let out = ''
  let last = 0

  for (const comment of theCommentRangesIn(javascript)) {
    const body = javascript.slice(comment.from, comment.to)
    out += javascript.slice(last, comment.from) + (A_LINE_TERMINATOR.test(body) ? '\n' : ' ')
    last = comment.to
  }

  return out + javascript.slice(last)
}

/**
 * The comment forms something other than a reader reads, refused rather than handled.
 *
 * `a-module-a-reader-runs-is-the-program-its-source-declares` cannot see one of these removed, because
 * removing it leaves the syntax tree identical - so the total comparison is blind here exactly where
 * the consequence is not syntactic. The answer is the one `a-page-loads-nothing-and-runs-nothing` gives
 * about `url(`: make the hazard impossible instead of detecting it.
 */
export const A_COMMENT_A_TOOL_READS: readonly string[] = [
  '//#',
  '//@',
  'sourceMappingURL',
  'sourceURL',
  '@__PURE__',
]
