/**
 * Experiment material - site 4, convention B: an environment variable where absence and invalidity
 * must not lead to the same behaviour. An unset PORT falls back to the default; a PORT that is
 * present and wrong stops the process, because starting on the wrong port is worse than not
 * starting. `PORT=` in a .env file arrives as an empty string and counts as unset.
 */

import { parseNumber } from '../../contracts/number/parse/reference.js'

const DEFAULT_PORT = 3000

export const resolvePort = (raw: string | undefined): number => {
  if (raw === undefined) return DEFAULT_PORT

  const parsed = parseNumber(raw)
  if (parsed.ok) return parsed.value
  if (parsed.reason === 'empty') return DEFAULT_PORT

  throw new Error(`PORT must be a number, received ${JSON.stringify(raw)}.`)
}
