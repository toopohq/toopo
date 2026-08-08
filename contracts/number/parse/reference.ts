// number/parse@1 - https://toopo.dev/number/parse@1/
// Copyright (c) 2026 Mathis Perron. SPDX-License-Identifier: MIT-0

/**
 * `number/parse@1` - convert a string to a finite number, or `null` when the string is not a decimal
 * number.
 *
 * Written to be read: correctness and obviousness come before speed.
 *
 * Failure is `null`, and `describeParseFailure` publishes the reason beside it. Both derive from one
 * private analysis, so this module holds a single grammar and the two exports cannot drift.
 */

/**
 * The decimal grammar this contract accepts, anchored at both ends: an optional sign, then either
 * digits with an optional fractional part or a bare fractional part, then an optional exponent.
 *
 * The grammar is matched before conversion rather than after, because `Number` accepts a wider
 * language than this contract does - hexadecimal, binary, octal, the empty string, "Infinity" -
 * and there is no way to tell those apart from a legitimate decimal by looking at the result.
 *
 * `\d` matches ASCII 0-9 only in JavaScript regular expressions, which is what rejects non-ASCII
 * digits such as the Arabic-Indic U+0661 U+0662 U+0663.
 */
const DECIMAL_GRAMMAR = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

/**
 * The second look that tells a separator mistake from text that is not a number at all.
 *
 * It is the grammar above consulted twice rather than a second grammar: whatever survives the
 * removal is judged by exactly the same rule, so there is no additional thing that can be wrong and
 * nothing for the coupling property to fail to cover.
 *
 * The family is the comma, the underscore, the apostrophe, the no-break space and the narrow no-break
 * space - the grouping characters `Intl.NumberFormat` emits, measured over 108 locales. The ordinary
 * space is not one of them: no locale emits it between digits, so it is a typo rather than formatting.
 *
 * The characters are escaped rather than pasted because three of them are invisible, and the literal
 * is written inside the call so that this module holds no global-flagged regular expression whose
 * lastIndex could survive a call.
 */
const withoutSeparators = (input: string): string => input.replace(/[,_'\u00A0\u202F]/g, '')

type ParseFailureReason = 'empty' | 'separator' | 'not-decimal' | 'overflow'

/**
 * The single source both exports derive from, private because it is not the shape this module
 * publishes: a caller sees `number | null` and asks for the reason only when it needs one.
 *
 * One function rather than two, so that a string fails to parse exactly when it has a description -
 * there is one grammar here, so the two exports cannot disagree about which strings fail. It also
 * keeps one public call to one traversal: defining `parseNumber` through `describeParseFailure` would
 * trim and convert twice on every accepted input.
 */
type ParseAnalysis =
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly reason: ParseFailureReason }

const analyse = (input: string): ParseAnalysis => {
  const trimmed = input.trim()
  if (trimmed === '') return { ok: false, reason: 'empty' }
  if (!DECIMAL_GRAMMAR.test(trimmed)) {
    return DECIMAL_GRAMMAR.test(withoutSeparators(trimmed))
      ? { ok: false, reason: 'separator' }
      : { ok: false, reason: 'not-decimal' }
  }

  const value = Number(trimmed)

  // Overflow is the one failure the grammar cannot express: "1e400" is a well-formed decimal that
  // has no finite double. Underflow ("1e-400" -> 0) stays finite and is accepted.
  return Number.isFinite(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }
}

export const parseNumber = (input: string): number | null => {
  const analysis = analyse(input)

  return analysis.ok ? analysis.value : null
}

/**
 * Why a string is not a decimal number, or `null` when it is one.
 *
 * A caller that asks for the reason after a refusal repeats the whole analysis. That is affordable
 * here - a trim and a regular expression - and it is the price of keeping the answering path free of
 * a wrapper no caller asked for.
 */
export const describeParseFailure = (input: string): ParseFailureReason | null => {
  const analysis = analyse(input)

  return analysis.ok ? null : analysis.reason
}
