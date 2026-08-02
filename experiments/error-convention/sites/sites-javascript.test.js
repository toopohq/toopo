/**
 * Experiment material. Site 6 runs from JavaScript, so its test is JavaScript too: a test written
 * in TypeScript would put the compiler back into a measurement whose whole point is its absence.
 *
 * The second block measures the trap each form leaves for a caller who writes the shortest check
 * that looks right - `if (parseNumber(raw))`. All three have one. What differs is how often it
 * fires, and that is counted rather than argued.
 */

import { describe, it, expect } from 'vitest'
import { readQuantity as quantityA } from './site-6-plain-javascript.a.js'
import { readQuantity as quantityB } from './site-6-plain-javascript.b.js'
import { readQuantity as quantityC } from './site-6-plain-javascript.c.js'
import { parseNumber as parseA } from './forms/parse-null.js'
import { parseNumber as parseB } from './forms/parse-union.js'
import { parseNumber as parseC } from '../../../contracts/number/parse/reference.js'
import { edgeCases } from '../../../contracts/number/parse/contract.js'

describe('site 6 - the same job from a file with no TypeScript', () => {
  const cases = [
    ['7', 7],
    ['0', 0],
    ['', 'Enter a quantity.'],
    ['   ', 'Enter a quantity.'],
    ['two', 'Enter a whole number.'],
  ]

  for (const [raw, expected] of cases) {
    it(`${JSON.stringify(raw)} -> ${expected}, in all three forms`, () => {
      expect(quantityA(raw)).toBe(expected)
      expect(quantityB(raw)).toBe(expected)
      expect(quantityC(raw)).toBe(expected)
    })
  }
})

describe('the truthiness trap, counted over the 38 settled inputs', () => {
  const inputs = edgeCases.map((edgeCase) => edgeCase.input)

  /** How often `if (parseNumber(raw))` disagrees with the check the form actually requires. */
  const wrongBranch = (parse, succeeded) =>
    inputs.filter((raw) => Boolean(parse(raw)) !== succeeded(parse(raw)))

  it('fires on the zero-valued successes under the null form', () => {
    const wrong = wrongBranch(parseA, (result) => result !== null)

    expect(wrong).toEqual(['-0', '1e-400', '-1e-400'])
  })

  it('fires on every failure under the discriminated union', () => {
    // Both arms of the union are objects, and every object is truthy. The shortest check that looks
    // right is wrong on every refusal rather than on three accepted values.
    const wrong = wrongBranch(parseB, (result) => result.ok)

    expect(wrong).toHaveLength(22)
    expect(wrong).toContain('')
    expect(wrong).toContain('abc')
  })

  it('fires exactly as often under the third form as under the null one', () => {
    // The return channel is unchanged, so the trap is unchanged. Publishing the reason beside it
    // adds no new way to read the result wrongly.
    const wrong = wrongBranch(parseC, (result) => result !== null)

    expect(wrong).toEqual(['-0', '1e-400', '-1e-400'])
  })
})
