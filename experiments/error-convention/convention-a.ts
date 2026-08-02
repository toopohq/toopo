/**
 * Experiment material. This folder exists only on `experiment/discriminated-union` and disappears
 * with it; nothing here is a contract, an implementation or a registry test.
 *
 * `number/parse@1` now reports failure as a discriminated union, so the `null` convention it used
 * before no longer exists anywhere in the repository. This is a copy of it, kept for one purpose:
 * the six call sites are written twice, once against each convention, and there is no way to compare
 * two forms while only one of them exists.
 *
 * It is a verbatim copy of the reference as it stood at a6d02a2.
 */

const DECIMAL_GRAMMAR = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

export const parseNumber = (input: string): number | null => {
  const trimmed = input.trim()
  if (!DECIMAL_GRAMMAR.test(trimmed)) return null

  const value = Number(trimmed)

  return Number.isFinite(value) ? value : null
}
