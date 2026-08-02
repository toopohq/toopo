/**
 * Experiment material - site 2, convention A: three different messages under a price field.
 *
 * The grammar is copied here because there is no other way. A caller installs the parser as source
 * and gets a function returning `number | null`; the reason the parser already computed is not part
 * of what it hands back, so recovering it means doing the work again. The naive attempt -
 * `Number.isFinite(Number(trimmed))` - is wrong, because `Number("abc")` is NaN and would report an
 * overflow for arbitrary text, so the copy has to be the real grammar.
 */

import { parseNumber } from './convention-a.js'

const DECIMAL_GRAMMAR = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

export const priceFieldError = (raw: string): string | null => {
  if (parseNumber(raw) !== null) return null

  const trimmed = raw.trim()
  if (trimmed === '') return 'Enter a price.'
  if (DECIMAL_GRAMMAR.test(trimmed)) return 'That price is too large.'

  return 'Enter a price like 12.50.'
}
