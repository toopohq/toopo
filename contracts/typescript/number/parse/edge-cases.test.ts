import { describe, it, expect } from 'vitest'
import {
  CASE_TABLE_IS_ADDRESSED,
  CASE_TABLE_IS_JUSTIFIED,
  CASE_TABLE_IS_PARTITIONED,
  expectEveryCaseIsAddressed,
  expectEveryCaseIsGrouped,
  expectEveryCaseIsJustified,
} from '../../../../catalogue/every-contract.js'
import { failureReasons, outputsAreEqual } from './contract.js'
import { edgeCaseGroups, edgeCases } from './edge-cases.js'
import { describeParseFailure, parseNumber } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the
 * equality semantics the contract declares - `Object.is`, so that an implementation normalising
 * `-0` into `0` fails here instead of slipping through a `===` comparison - and every entry is
 * asserted a second time against the diagnostic surface.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule and is what
 * makes the title stable under a specification mutant. What the title used to carry - the input and
 * the answer, rendered - is carried by the failure message instead, where a mutant may rewrite it
 * freely because nothing identifies a guard by it.
 *
 * The two blocks below must not share a title. Attribution identifies a guard by its title alone, so
 * two guards carrying one would be read as reddening each other - measured on `language.test.ts` of
 * `array/group-by@1`, where it made twenty-four guards claim defects they cannot see.
 */

/**
 * Failure messages must survive a terminal: several inputs are invisible (byte-order mark) or
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
  for (const { id, input, expected } of edgeCases) {
    it(id, () => {
      const actual = parseNumber(input)

      expect(
        outputsAreEqual(actual, expected),
        `${printable(input)}: expected ${rendered(expected)}, received ${rendered(actual)}`,
      ).toBe(true)
    })
  }
})

describe('number/parse@1 named edge cases, described', () => {
  for (const { id, input, reason } of edgeCases) {
    it(`${id}-described`, () => {
      expect(describeParseFailure(input), printable(input)).toBe(reason)
    })
  }
})

describe('number/parse@1 edge case table', () => {
  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...edgeCases.map((edgeCase) => edgeCase.id),
    ])
  })

  it('settles-each-input-once', () => {
    const inputs = edgeCases.map((edgeCase) => edgeCase.input)

    expect(inputs).toHaveLength(new Set(inputs).size)
  })

  it('names-a-case-for-every-reason :: and declares every reason it names', () => {
    // The partition is frozen with the major, so a literal nobody produces any more would survive
    // as documentation of a refusal that no longer exists - and a reason the tables produce without
    // declaring it would be invisible to a caller reading the contract. Both directions, one guard.
    const produced = edgeCases
      .map(({ reason }) => reason)
      .filter((reason) => reason !== null)

    expect([...new Set(produced)].sort()).toEqual([...failureReasons].sort())
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([{ name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases }])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })
})
