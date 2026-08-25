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
 * The compiler's own scanner, driven - never a reader written here
 * ---------------------------------------------------------------------------
 *
 * A parser would settle every question and cannot be had: the only route to a syntax tree is
 * `typescript/unstable/sync`, which loads a project and spawns the compiler, and `browser.ts` refuses
 * a subprocess in the path of a page's content. What is available in process is the scanner, and it is
 * wrong when it is simply looped over: measured on `packages/registry/address.js`, a bare run reports
 * **10 comments and 9 644 bytes** where the parser reports **25 and 16 358**. It loses the parity of a
 * template literal at line 204 - without the parser to ask for a rescan, a closing backtick reads as an
 * opening one - and this repository's prose is full of backticks, so it never resynchronises. It
 * raised no error. It returned a plausible number.
 *
 * A reader written from scratch is worse and that is measured too: one written for ADR-0156, by
 * somebody who had just enumerated the hazards, agreed with the parser on the six files it finished
 * and looped for ever on the seventh.
 *
 * **So the scanner does the language and this file does the two ambiguities it cannot resolve alone**,
 * which are the two the parser normally resolves for it: whether a `/` opens a regular expression or
 * divides, and where a template literal resumes after a substitution. Everything else - escapes,
 * unicode, line terminators, numeric literals - is the compiler's and is already right. Measured on
 * the served modules: **21 regular expression literals and 74 template substitutions**, so neither arm
 * is born green.
 *
 * ---------------------------------------------------------------------------
 * What the previous-token rule gets wrong, named rather than discovered
 * ---------------------------------------------------------------------------
 *
 * Whether a regular expression may begin is decided by the token before it, which is what a lexer has
 * instead of a grammar. It is wrong in two places and both are known: a regular expression may follow
 * `)` in `if (a) /re/.test(b)` and `}` in `function f() {} /re/.test(b)`, and this rule calls both of
 * them division. Neither shape occurs here, and the consequence if one arrived is bounded rather than
 * hoped for: a misread regular expression can only invent a comment if its own body carries `//` or
 * `/*`, and **measured over the served modules, none does**.
 *
 * That is an argument about today. What makes the file safe tomorrow is not this paragraph but
 * `a-module-a-reader-runs-is-the-program-its-source-declares`, which parses both sides with the real
 * compiler and compares every node. A reader that misreads anything at all stops the suite.
 */

import { TYPESCRIPT_SURFACE } from '../validation/typescript-api.js'

const { SyntaxKind, createScanner } = TYPESCRIPT_SURFACE

/** Where one comment sits in a module, as offsets into it. */
export type CommentRange = {
  readonly from: number
  readonly to: number
}

/**
 * The tokens after which a `/` divides rather than opening a regular expression.
 *
 * A keyword is not here on purpose: `return /re/`, `typeof /re/`, `case /re/` and `in /re/` are all
 * legal, and TypeScript gives a keyword its own kind rather than `Identifier`, so leaving the set to
 * the value-shaped tokens is what makes those work without listing them.
 */
const A_DIVISION_FOLLOWS: ReadonlySet<number> = new Set<number>([
  SyntaxKind.Identifier,
  SyntaxKind.PrivateIdentifier,
  SyntaxKind.NumericLiteral,
  SyntaxKind.BigIntLiteral,
  SyntaxKind.StringLiteral,
  SyntaxKind.RegularExpressionLiteral,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateTail,
  SyntaxKind.CloseParenToken,
  SyntaxKind.CloseBracketToken,
  SyntaxKind.CloseBraceToken,
  SyntaxKind.PlusPlusToken,
  SyntaxKind.MinusMinusToken,
  SyntaxKind.ThisKeyword,
  SyntaxKind.SuperKeyword,
  SyntaxKind.NullKeyword,
  SyntaxKind.TrueKeyword,
  SyntaxKind.FalseKeyword,
])

/** Trivia that separates tokens without being one, so it never decides what follows a `/`. */
const NOT_A_TOKEN: ReadonlySet<number> = new Set<number>([
  SyntaxKind.NewLineTrivia,
  SyntaxKind.WhitespaceTrivia,
  SyntaxKind.ConflictMarkerTrivia,
])

/**
 * A reader that lost its place, refused rather than left to spin.
 *
 * **The bound is the input's own length and is therefore sound rather than generous.** Every
 * iteration below calls `scan()` exactly once, and a scanner that has not reached the end consumes at
 * least one character per call - the two rescans re-read a token already begun and happen at most
 * once each per iteration. So a correct reading of *n* characters takes at most *n* + 1 iterations,
 * and one that takes more has stopped advancing.
 *
 * It is born green and the event it is for is measured: `site · W-97` takes the template-token rescan
 * out of the loop, and the reader then never leaves the first substitution it meets - measured at
 * `505fddb` over the ten modules a browser fetches, it does not finish on `playground.ts`,
 * `literal.ts` or `value.ts`. Without this the build hangs rather than failing, and the guard written
 * to catch that mutant hangs with it. ADR-0162.
 */
export class TheReaderLostItsPlace extends Error {
  constructor(characters: number) {
    super(
      `reading the comments of a module of ${characters} characters took more steps than it has ` +
        `characters, so the reader is no longer advancing through it`,
    )
    this.name = 'TheReaderLostItsPlace'
  }
}

/** Every comment in one module of JavaScript, in the order it is written. */
export const theCommentRangesIn = (javascript: string): readonly CommentRange[] => {
  const scanner = createScanner(false, undefined, javascript)
  const found: CommentRange[] = []

  /** The brace depth each unfinished template substitution was opened at. */
  const substitutions: number[] = []
  let braces = 0
  let previous: number | undefined = undefined
  let steps = 0

  for (;;) {
    steps += 1
    if (steps > javascript.length + 1) throw new TheReaderLostItsPlace(javascript.length)

    let token: number = scanner.scan()
    if (token === SyntaxKind.EndOfFile) break

    if (
      token === SyntaxKind.SingleLineCommentTrivia ||
      token === SyntaxKind.MultiLineCommentTrivia
    ) {
      found.push({ from: scanner.getTokenStart(), to: scanner.getTokenEnd() })
      continue
    }
    if (NOT_A_TOKEN.has(token)) continue

    if (
      (token === SyntaxKind.SlashToken || token === SyntaxKind.SlashEqualsToken) &&
      (previous === undefined || !A_DIVISION_FOLLOWS.has(previous))
    ) {
      token = scanner.reScanSlashToken()
    }

    if (token === SyntaxKind.OpenBraceToken) {
      braces += 1
    } else if (token === SyntaxKind.CloseBraceToken) {
      if (substitutions[substitutions.length - 1] === braces) {
        substitutions.pop()
        token = scanner.reScanTemplateToken(false)
      } else {
        braces -= 1
      }
    }

    if (token === SyntaxKind.TemplateHead || token === SyntaxKind.TemplateMiddle) {
      substitutions.push(braces)
    }

    previous = token
  }

  return found
}

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
