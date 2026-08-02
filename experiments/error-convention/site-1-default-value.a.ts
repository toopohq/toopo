/** Experiment material - site 1, convention A: fall back to a default when the input does not parse. */

import { parseNumber } from './convention-a.js'

const DEFAULT_TIMEOUT_MS = 30_000

export const readTimeoutMs = (raw: string): number => parseNumber(raw) ?? DEFAULT_TIMEOUT_MS
