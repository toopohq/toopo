/**
 * Experiment material - site 1, form C: fall back to a default when the input does not parse.
 *
 * The site never asks why, so it never pays for the reason. Character for character the A form.
 */

import { parseNumber } from '../../../contracts/number/parse/reference.js'

const DEFAULT_TIMEOUT_MS = 30_000

export const readTimeoutMs = (raw: string): number => parseNumber(raw) ?? DEFAULT_TIMEOUT_MS
