/**
 * The six inks the contract page sets code in, decided at emission and never in a browser.
 * ADR-0176 and ADR-0178 are the tokens and their floor; ADR-0156 is why the reading is the compiler's.
 *
 * ---------------------------------------------------------------------------
 * The artboard's classifier, re-founded on the compiler's reading
 * ---------------------------------------------------------------------------
 *
 * The artboard highlights with ten ordered regular expressions, and that shape is the class of reader
 * ADR-0156 measured losing the parity of a template literal and returning a plausible number with no
 * error - so the rules are not transcribed. What is kept is the artboard's *vocabulary*: six inks,
 * and the word list that decides which words read as types. The language itself - comments, strings,
 * templates, regular expressions against division, numbers - is `scanning.ts`'s drive of the
 * compiler's scanner, which two guards and three battery mutants already hold to the byte.
 *
 * **The classification is lexical on purpose, and that is the artboard's own approximation kept
 * rather than improved.** A word is inked for what it says, not for where it stands: `entry.type`
 * takes the keyword ink because `type` is a keyword to the scanner, exactly as the artboard inks
 * every occurrence of `in` or `as`. Resolving that would need a parser, which `browser.ts` refuses in
 * the path of a page's content - and a highlight is a reading aid, not a claim the page makes.
 *
 * The output is data rather than markup: the code-block component turns runs into elements, so the
 * totality guard - every character of the source reaches the reader, in order, to the byte - is a
 * comparison of strings and not a walk of a tree.
 */

import { TYPESCRIPT_SURFACE } from '../validation/typescript-api.js'
import type { LexedToken } from './scanning.js'
import { A_COMMENT, everyTokenIn } from './scanning.js'

const { SyntaxKind } = TYPESCRIPT_SURFACE

/**
 * The six inks and the palette token each is set in - one spelling, from which the component derives
 * its class names and the stylesheet's `--tk-*` declarations take their audience. `style.ts` carries
 * the values, the floor they clear, and the repair three of them needed.
 */
export const THE_SYNTAX_INKS = {
  keyword: 'tk-k',
  string: 'tk-s',
  number: 'tk-n',
  function: 'tk-f',
  type: 'tk-t',
  comment: 'tk-c',
} as const

export type SyntaxInk = keyof typeof THE_SYNTAX_INKS

/** One run of a highlighted source: the ink it is set in, or null for the page's own. */
export type HighlightedRun = {
  readonly ink: SyntaxInk | null
  readonly text: string
}

/**
 * The words the artboard sets in the type ink, verbatim: the primitive type keywords, the literal
 * constants, and the globals its samples reach for. A keyword outside this list takes the keyword
 * ink whatever it is - the artboard enumerates the keywords its samples use and this generalises
 * that intent to the scanner's own notion of one, so `interface` or `switch` arriving in a source
 * does not fall through to plain text.
 */
const THE_TYPE_WORDS: ReadonlySet<string> = new Set<string>([
  'string',
  'number',
  'boolean',
  'null',
  'undefined',
  'true',
  'false',
  'void',
  'unknown',
  'object',
  'Date',
  'Promise',
  'Record',
  'Partial',
  'Pick',
  'RangeError',
  'Set',
  'Math',
  'Number',
  'String',
  'Object',
  'Intl',
  'NaN',
  'ReturnType',
])

/** Everything the scanner reads as string-shaped: strings, every part of a template, and a regex. */
const A_STRING: ReadonlySet<number> = new Set<number>([
  SyntaxKind.StringLiteral,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateHead,
  SyntaxKind.TemplateMiddle,
  SyntaxKind.TemplateTail,
  SyntaxKind.RegularExpressionLiteral,
])

const A_NUMBER: ReadonlySet<number> = new Set<number>([
  SyntaxKind.NumericLiteral,
  SyntaxKind.BigIntLiteral,
])

/** The shape of a word, which is what separates a keyword token from an operator's. */
const A_WORD = /^[A-Za-z_$][A-Za-z0-9_$]*$/

/**
 * The ink of one token, read from its kind first and its text second.
 *
 * The function ink asks whether the very next token is the parenthesis, and that alone is the
 * artboard's own lookahead `(?=\()`: a space is a token to this drive, so `parse (x)` reads as a
 * name and `parse(x)` as a call with nothing more said. A first draft compared offsets on top of
 * that, and the comparison could never be false - the tokens tile the source - which was proved by
 * dropping it against a green suite rather than argued.
 */
const inkOf = (
  token: LexedToken,
  text: string,
  next: LexedToken | undefined,
): SyntaxInk | null => {
  if (A_COMMENT.has(token.kind)) return 'comment'
  if (A_STRING.has(token.kind)) return 'string'
  if (A_NUMBER.has(token.kind)) return 'number'
  if (!A_WORD.test(text)) return null
  if (THE_TYPE_WORDS.has(text)) return 'type'
  if (token.kind !== SyntaxKind.Identifier) return 'keyword'

  return next !== undefined && next.kind === SyntaxKind.OpenParenToken
    ? 'function'
    : null
}

/** A run appended, merged into its neighbour when the ink is the same, dropped when empty. */
const pushed = (runs: HighlightedRun[], ink: SyntaxInk | null, text: string): void => {
  if (text === '') return

  const last = runs[runs.length - 1]
  if (last !== undefined && last.ink === ink) {
    runs[runs.length - 1] = { ink, text: last.text + text }
    return
  }

  runs.push({ ink, text })
}

/**
 * One source as the runs a page sets it in, total over the text: the concatenation of every run is
 * the source to the byte, which is what lets an answer's comment carry its ink without the page
 * ever showing a character the digest did not cover.
 */
export const highlighted = (source: string): readonly HighlightedRun[] => {
  const tokens = everyTokenIn(source)
  const runs: HighlightedRun[] = []
  let cursor = 0

  for (const [at, token] of tokens.entries()) {
    if (token.from > cursor) pushed(runs, null, source.slice(cursor, token.from))

    const text = source.slice(token.from, token.to)
    pushed(runs, inkOf(token, text, tokens[at + 1]), text)
    cursor = token.to
  }

  pushed(runs, null, source.slice(cursor))

  return runs
}
