/** Experiment material - site 3, convention A: a CSV column where a blank cell is not an error. */

import type { CellOutcome } from './cell-outcome.js'
import { parseNumber } from './forms/parse-null.js'

export const readColumn = (cells: readonly string[]): readonly CellOutcome[] =>
  cells.map((cell) => {
    const parsed = parseNumber(cell)
    if (parsed !== null) return { kind: 'value', value: parsed }

    return cell.trim() === '' ? { kind: 'blank' } : { kind: 'invalid' }
  })
