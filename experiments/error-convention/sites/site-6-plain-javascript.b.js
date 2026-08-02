/**
 * Experiment material - site 6, convention B: the same parser called from a file with no TypeScript,
 * which is how a large share of the catalogue's audience will use it. Nothing here is type-checked;
 * the shape of the returned value is whatever the runtime says it is.
 */

import { parseNumber } from './forms/parse-union.js'

/**
 * @param {string} raw
 * @returns {number | string} the quantity, or the message to show under the field
 */
export const readQuantity = (raw) => {
  const parsed = parseNumber(raw)
  if (parsed.ok) return parsed.value

  return parsed.reason === 'empty' ? 'Enter a quantity.' : 'Enter a whole number.'
}
