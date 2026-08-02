import { describe, it, expect } from 'vitest'
import { edgeCases, outputsAreEqual, type ParseNumberResult } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the
 * equality semantics the contract declares - `Object.is` on a successful value, so that an
 * implementation normalising `-0` into `0` fails here instead of slipping through a `===`
 * comparison, and an exact match on the reason of a failure.
 */

/**
 * Test titles must survive a terminal: several inputs are invisible (byte-order mark) or
 * non-Latin (Arabic-Indic digits), and two entries printed raw would look identical or empty.
 */
const printable = (value: string): string =>
  [...JSON.stringify(value)]
    .map((char) => {
      const code = char.charCodeAt(0)
      return code > 0x7f ? `\\u${code.toString(16).padStart(4, '0')}` : char
    })
    .join('')

/** `String(-0)` is "0", so a successful value has to be rendered by hand to stay readable. */
const rendered = (result: ParseNumberResult): string => {
  if (!result.ok) return result.reason

  return Object.is(result.value, -0) ? '-0' : String(result.value)
}

describe('number/parse@1 named edge cases', () => {
  for (const { input, expected } of edgeCases) {
    it(`${printable(input)} -> ${rendered(expected)}`, () => {
      const actual = parseNumber(input)

      expect(
        outputsAreEqual(actual, expected),
        `expected ${rendered(expected)}, received ${rendered(actual)}`,
      ).toBe(true)
    })
  }
})

describe('number/parse@1 edge case table', () => {
  it('settles each input exactly once', () => {
    const inputs = edgeCases.map((edgeCase) => edgeCase.input)

    expect(inputs).toHaveLength(new Set(inputs).size)
  })

  it('publishes a rationale for every decision', () => {
    const undocumented = edgeCases.filter((edgeCase) => edgeCase.rationale.trim() === '')

    expect(undocumented).toEqual([])
  })
})
