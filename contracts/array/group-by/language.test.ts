import { describe, it, expect } from 'vitest'
import { edgeCases, untypedCallerCases } from './edge-cases.js'
import { assertOutcome, callOnce, callsMatch, renderCalls } from './outcome.js'
import type { Grouper } from './outcome.js'

/**
 * The measurement `catalogueAdmission` rests on, replayed rather than asserted.
 *
 * Block 4.1 says this contract will not be published because the language now ships the function it
 * specifies and answers what it requires. That sentence decides whether a contract enters the
 * catalogue, and a sentence that decides something and cannot be replayed is an opinion. This file
 * runs block 4.4 - both tables, every case - against `Map.groupBy` instead of the reference, and
 * fails if the language and this contract ever part.
 *
 * It measures the runtime, not `reference.ts`, so no mutant of the battery can redden it. That is
 * recorded rather than hidden: it belongs to the guards the mutation instrument cannot reach, and it
 * is there for the reader who has to decide whether a contract is worth admitting, not for the score.
 *
 * A runtime without `Map.groupBy` fails here, loudly, instead of skipping. The claim is about what
 * the language does; a runtime that cannot answer has not agreed, and a guard that did not run is
 * not a guard that passed - the same rule the time-zone property of `date/add@1` follows.
 */

type LanguageGroupBy = (
  items: Iterable<unknown>,
  keyOf: (item: unknown, index: number) => unknown,
) => Map<unknown, unknown[]>

/** Reached through a cast because `Map.groupBy` is ES2024 and this repository compiles to ES2022. */
const languageGrouper = (): Grouper => {
  const groupBy = (Map as unknown as { readonly groupBy?: LanguageGroupBy }).groupBy

  if (typeof groupBy !== 'function') {
    throw new Error(
      'this runtime has no Map.groupBy, so the measurement that decides against admitting ' +
        'array/group-by@1 cannot be made here. The contract fails rather than skips.',
    )
  }

  return (items, keyOf) => groupBy(items, keyOf)
}

describe('array/group-by@1 against Map.groupBy', () => {
  for (const { title, items, keyOf, outcome, expectedCalls } of edgeCases) {
    it(title, () => {
      const { attempt, calls } = callOnce(languageGrouper(), items, keyOf)

      assertOutcome(outcome, attempt)

      if (expectedCalls !== undefined) {
        expect(
          callsMatch(calls, expectedCalls),
          `expected the key function to be asked ${renderCalls(expectedCalls)}, ` +
            `it was asked ${renderCalls(calls)}`,
        ).toBe(true)
      }
    })
  }

  for (const { title, items, keyOf, outcome } of untypedCallerCases) {
    it(`${title}, from an untyped caller`, () => {
      const { attempt } = callOnce(languageGrouper(), items as readonly unknown[], keyOf)

      assertOutcome(outcome, attempt)
    })
  }
})
