/**
 * Experiment material, and a verbatim copy of `experiment/discriminated-union:contracts/number/parse/reference.ts`. This folder exists only on
 * `experiment/error-convention-round-2` and disappears with it; nothing here is a contract, an
 * implementation or a registry test.
 *
 * number/parse@1 as round 1 reported it: the reason travels inside the returned value.
 *
 * Copied rather than imported because no import reaches across a git ref, and rewritten by hand it
 * would stop being the arm this experiment compares.
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
 * The result type is written out here rather than imported from `contract.ts`, for the same reason
 * the signature is: a reference that borrows the contract's own types cannot fail the conformance
 * check the contract performs on it.
 */
type ParseNumberResult =
  | { readonly ok: true; readonly value: number }
  | { readonly ok: false; readonly reason: 'empty' | 'not-decimal' | 'overflow' }

/**
 * Reference implementation of `number/parse@1`.
 *
 * It is the oracle of the registry's differential test, so it is written to be read: correctness
 * and obviousness come before speed.
 *
 * The signature is written out here rather than imported from `contract.ts`. Annotating this
 * function with the contract's own type would make the compiler enforce conformance at authoring
 * time and leave `signature.test-d.ts` unable to fail - a guard that proves nothing. An
 * implementation states its signature independently, and the contract checks it.
 *
 * PROVISIONAL: failure is reported as a discriminated union carrying a reason. The catalogue-wide
 * error convention is still undecided.
 */
export const parseNumber = (input: string): ParseNumberResult => {
  const trimmed = input.trim()
  if (trimmed === '') return { ok: false, reason: 'empty' }
  if (!DECIMAL_GRAMMAR.test(trimmed)) return { ok: false, reason: 'not-decimal' }

  const value = Number(trimmed)

  // Overflow is the one failure the grammar cannot express: "1e400" is a well-formed decimal that
  // has no finite double. Underflow ("1e-400" -> 0) stays finite and is accepted.
  return Number.isFinite(value) ? { ok: true, value } : { ok: false, reason: 'overflow' }
}
