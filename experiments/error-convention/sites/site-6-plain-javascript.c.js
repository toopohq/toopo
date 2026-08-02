/**
 * Experiment material - site 6, form C: the same parser called from a file with no TypeScript,
 * which is how a large share of the catalogue's audience will use it. Nothing here is type-checked;
 * the shape of the returned value is whatever the runtime says it is.
 *
 * The reason arrives as a bare string rather than as a field of an object nobody checked the shape
 * of, so a typo in the literal is a comparison that is quietly false rather than a property access
 * on a value that may not have it.
 */

import { describeFailure, parseNumber } from '../../../contracts/number/parse/reference.js'

/**
 * @param {string} raw
 * @returns {number | string} the quantity, or the message to show under the field
 */
export const readQuantity = (raw) => {
  const parsed = parseNumber(raw)
  if (parsed !== null) return parsed

  return describeFailure(raw) === 'empty' ? 'Enter a quantity.' : 'Enter a whole number.'
}
