/**
 * Experiment material - site 2, form C: three different messages under a price field.
 *
 * This is the site the third form was built for. The A form had to copy the contract's grammar here
 * because the reason the parser already computed was not part of what it handed back; the copy is
 * gone, and the site does not call the parser at all - it only ever needed the reason.
 */

import { describeFailure } from '../../../contracts/number/parse/reference.js'

export const priceFieldError = (raw: string): string | null => {
  const reason = describeFailure(raw)
  if (reason === null) return null
  if (reason === 'empty') return 'Enter a price.'
  if (reason === 'overflow') return 'That price is too large.'

  return 'Enter a price like 12.50.'
}
