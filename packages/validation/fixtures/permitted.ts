/**
 * A submission that crosses no rule of stage 1.
 *
 * **This is a fixture, not a template.** It exists so that the rules can be shown answering nothing
 * on a file that legitimately uses the things they refuse the ambient forms of: `Date` and `Math` are
 * language APIs a feature may use, and the `getUTC*` family sits one character from the `get*` family
 * `date/add@1` forbids. A filter that refused this would be worse than no filter, because it would
 * refuse the catalogue it protects.
 *
 * It is deliberately minimal and is never a model for a real reference implementation - a contract's
 * `reference.ts` answers a contract, and this answers nothing.
 */

export const PERMITTED = 'a value another fixture imports by a relative path'

export const usesOnlyWhatIsAllowed = (when: Date, sizes: readonly number[]): number => {
  const monthInUtc = when.getUTCMonth()
  const smallest = Math.min(...sizes)
  const shifted = new Date(when.getTime() + monthInUtc)

  return shifted.getUTCFullYear() + smallest
}
