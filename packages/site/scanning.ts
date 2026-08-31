/**
 * The compiler's own scanner, driven - never a reader written here.
 * ADR-0156 is why this is a lexer rather than a parser and why it is the compiler's; ADR-0162 is the
 * bound that turned a wrong reading from a hang into a refusal.
 *
 * ---------------------------------------------------------------------------
 * One drive, two readers
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
 * **So the scanner does the language and this module does the two ambiguities it cannot resolve
 * alone**, which are the two the parser normally resolves for it: whether a `/` opens a regular
 * expression or divides, and where a template literal resumes after a substitution. Everything else -
 * escapes, unicode, line terminators, numeric literals - is the compiler's and is already right.
 * Measured on the served modules: **21 regular expression literals and 74 template substitutions**, so
 * neither arm is born green. `served-modules.ts` reads this drive for where the comments are, and the
 * contract page's highlighting reads it for what every token is - one statement of the drive, because
 * a second scan loop would be the same two ambiguities resolved where nobody will maintain them.
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
 * That is an argument about today. What makes the drive safe tomorrow is not this paragraph but
 * `a-module-a-reader-runs-is-the-program-its-source-declares`, which parses both sides with the real
 * compiler and compares every node. A reader that misreads anything at all stops the suite.
 */

import { TYPESCRIPT_SURFACE } from '../validation/typescript-api.js'

const { SyntaxKind, createScanner } = TYPESCRIPT_SURFACE

/** One token as the scanner read it, with the two ambiguities already resolved in its kind. */
export type LexedToken = {
  readonly kind: number
  readonly from: number
  readonly to: number
}

/** The two comment trivia, named once for the readers that select or class them. */
export const A_COMMENT: ReadonlySet<number> = new Set<number>([
  SyntaxKind.SingleLineCommentTrivia,
  SyntaxKind.MultiLineCommentTrivia,
])

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
      `reading a module of ${characters} characters took more steps than it has characters, so ` +
        `the reader is no longer advancing through it`,
    )
    this.name = 'TheReaderLostItsPlace'
  }
}

/**
 * Every token of one module, comments and whitespace included, in the order they are written.
 *
 * The trivia is kept rather than skipped because the two readers between them want both halves: the
 * comment remover selects exactly the trivia, and the highlighting walks every token so that what it
 * emits is the source to the byte. The bookkeeping - a brace depth per unfinished substitution, the
 * previous token of substance - is the drive itself, and `previous` deliberately never becomes a
 * comment or a space: the token that decides what a `/` means is the last one the language saw.
 */
export const everyTokenIn = (source: string): readonly LexedToken[] => {
  const scanner = createScanner(false, undefined, source)
  const found: LexedToken[] = []

  /** The brace depth each unfinished template substitution was opened at. */
  const substitutions: number[] = []
  let braces = 0
  let previous: number | undefined = undefined
  let steps = 0

  for (;;) {
    steps += 1
    if (steps > source.length + 1) throw new TheReaderLostItsPlace(source.length)

    let token: number = scanner.scan()
    if (token === SyntaxKind.EndOfFile) break

    if (!A_COMMENT.has(token) && !NOT_A_TOKEN.has(token)) {
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

    found.push({ kind: token, from: scanner.getTokenStart(), to: scanner.getTokenEnd() })
  }

  return found
}
