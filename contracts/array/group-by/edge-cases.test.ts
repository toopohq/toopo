import { describe, it, expect } from 'vitest'
import {
  CASE_TABLE_IS_ADDRESSED,
  expectEveryCaseIsAddressed,
  CASE_TABLE_IS_JUSTIFIED,
  CASE_TABLE_IS_PARTITIONED,
  expectEveryCaseIsGrouped,
  expectEveryCaseIsJustified,
} from '../../../catalogue/every-contract.js'
import { edgeCaseGroups, edgeCases, untypedCallerCaseGroups, untypedCallerCases } from './edge-cases.js'
import { assertOutcome, callOnce, callsMatch, renderCalls, renderGroups } from './outcome.js'
import { groupBy } from './reference.js'

/**
 * Block 4.4, executable.
 *
 * How an outcome is compared, and why the contract's own `outputsAreEqual` is not what compares it,
 * lives in `outcome.js` - one comparison shared with `language.test.ts`, which runs this same table
 * against `Map.groupBy`.
 *
 * Each case is called exactly once, and everything the table says about it is asserted from that one
 * call. That is not a stylistic choice. Two cases carry state - a key function that answers
 * differently the second time it sees an element, and one that writes to the element it is given -
 * and a second `describe` re-running the table would make those two answer differently depending on
 * which block of tests ran first. A table whose cases interfere is a table that settles nothing.
 * `language.test.ts` runs the table a second time and is a separate file for exactly that reason:
 * vitest gives each test file its own module registry, so it draws those two cases fresh.
 */

describe('array/group-by@1 named edge cases', () => {
  for (const { id, items, keyOf, outcome, expectedCalls } of edgeCases) {
    it(id, () => {
      const elementsBefore = [...items]
      const { attempt, calls } = callOnce(groupBy, items, keyOf)

      assertOutcome(outcome, attempt)

      if (expectedCalls !== undefined) {
        expect(
          callsMatch(calls, expectedCalls),
          `expected the key function to be asked ${renderCalls(expectedCalls)}, ` +
            `it was asked ${renderCalls(calls)}`,
        ).toBe(true)
      }

      // Asserted on every case, including the one whose key function throws: the array the caller
      // passed holds the same elements in the same order afterwards. Element identity rather than
      // element contents, because one case has a key function that legitimately writes to its own
      // element and that write is the caller's, not this function's.
      expect(
        items.length === elementsBefore.length &&
          items.every((item, index) => Object.is(item, elementsBefore[index])),
        `the input was rewritten: ${renderGroups([['before', elementsBefore], ['after', [...items]]])}`,
      ).toBe(true)
    })
  }
})

describe('array/group-by@1 inputs only an untyped caller can pass', () => {
  for (const { id, items, keyOf, outcome } of untypedCallerCases) {
    it(id, () => {
      // The cast is the whole point of this table: these are the calls TypeScript refuses and
      // JavaScript makes anyway, and block 4.4 settles them so two implementations cannot differ.
      const { attempt } = callOnce(groupBy, items as readonly unknown[], keyOf)

      assertOutcome(outcome, attempt)
    })
  }
})

describe('array/group-by@1 edge case table', () => {
  const allCases = [...edgeCases, ...untypedCallerCases]

  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...untypedCallerCaseGroups.map(({ id }) => id),
      ...allCases.map((edgeCase) => edgeCase.id),
    ])
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([
      { name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases },
      { name: 'untyped-callers', groups: untypedCallerCaseGroups, cases: untypedCallerCases },
    ])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(allCases, (edgeCase) => edgeCase.id)
  })
})
