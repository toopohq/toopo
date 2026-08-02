/** Experiment material - site 1, convention B: fall back to a default when the input does not parse. */

import { parseNumber } from './forms/parse-union.js'

const DEFAULT_TIMEOUT_MS = 30_000

export const readTimeoutMs = (raw: string): number => {
  const parsed = parseNumber(raw)

  return parsed.ok ? parsed.value : DEFAULT_TIMEOUT_MS
}
