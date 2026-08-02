/** Experiment material - site 2, convention B: three different messages under a price field. */

import { parseNumber } from '../../contracts/number/parse/reference.js'

export const priceFieldError = (raw: string): string | null => {
  const parsed = parseNumber(raw)
  if (parsed.ok) return null
  if (parsed.reason === 'empty') return 'Enter a price.'
  if (parsed.reason === 'overflow') return 'That price is too large.'

  return 'Enter a price like 12.50.'
}
