/** Experiment material - site 3, convention B: a CSV column where a blank cell is not an error. */

import type { CellOutcome } from './cell-outcome.js'
import { parseNumber } from './forms/parse-union.js'

export const readColumn = (cells: readonly string[]): readonly CellOutcome[] =>
  cells.map((cell) => {
    const parsed = parseNumber(cell)
    if (parsed.ok) return { kind: 'value', value: parsed.value }

    return parsed.reason === 'empty' ? { kind: 'blank' } : { kind: 'invalid' }
  })
