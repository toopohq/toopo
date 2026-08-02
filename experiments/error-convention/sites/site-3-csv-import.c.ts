/**
 * Experiment material - site 3, form C: a CSV column where a blank cell is not an error.
 *
 * Two calls on the failing path, one on the accepting path. The A form spends a `trim` instead of
 * the second call, and is right to: blankness is observable without the contract's grammar, so this
 * is a site where the third form buys nothing and costs a call.
 */

import type { CellOutcome } from './cell-outcome.js'
import { describeFailure, parseNumber } from '../../../contracts/number/parse/reference.js'

export const readColumn = (cells: readonly string[]): readonly CellOutcome[] =>
  cells.map((cell) => {
    const parsed = parseNumber(cell)
    if (parsed !== null) return { kind: 'value', value: parsed }

    return describeFailure(cell) === 'empty' ? { kind: 'blank' } : { kind: 'invalid' }
  })
