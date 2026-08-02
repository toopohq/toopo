import { describe, it, expect } from 'vitest'
import { expectEveryCaseIsJustified } from '../../../catalogue/every-contract.js'
import { failureReasons, outputsAreEqual } from './contract.js'
import { edgeCases } from './edge-cases.js'
import { describeParseFailure, parseNumber } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the
 * equality semantics the contract declares - `Object.is`, so that an implementation normalising
 * `-0` into `0` fails here instead of slipping through a `===` comparison - and every entry is
 * asserted a second time against the diagnostic surface.
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

/** `String(-0)` is "0", so the expected value has to be rendered by hand to stay readable. */
const rendered = (value: number | null): string => (Object.is(value, -0) ? '-0' : String(value))

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

describe('number/parse@1 named edge cases, described', () => {
  for (const { input, reason } of edgeCases) {
    it(`${printable(input)} -> ${reason ?? 'no failure to describe'}`, () => {
      expect(describeParseFailure(input)).toBe(reason)
    })
  }
})

describe('number/parse@1 edge case table', () => {
  it('settles each input exactly once', () => {
    const inputs = edgeCases.map((edgeCase) => edgeCase.input)

    expect(inputs).toHaveLength(new Set(inputs).size)
  })

  it('names a case for every declared reason, and declares every reason it names', () => {
    // The partition is frozen with the major, so a literal nobody produces any more would survive
    // as documentation of a refusal that no longer exists - and a reason the tables produce without
    // declaring it would be invisible to a caller reading the contract. Both directions, one guard.
    const produced = edgeCases
      .map(({ reason }) => reason)
      .filter((reason) => reason !== null)

    expect([...new Set(produced)].sort()).toEqual([...failureReasons].sort())
  })

  it('publishes a rationale for every decision', () => {
    expectEveryCaseIsJustified(edgeCases, ({ input }) => printable(input))
  })
})
