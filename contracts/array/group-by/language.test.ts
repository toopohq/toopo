import { describe, it, expect } from 'vitest'
import { expectEveryCaseIsJustified } from '../../../catalogue/every-contract.js'
import type { EdgeCase, ExpectedGroup } from './edge-cases.js'
import { edgeCases, untypedCallerCases } from './edge-cases.js'
import { assertOutcome, callOnce, callsMatch, groupingMatches, renderCalls, renderGroups } from './outcome.js'
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
 *
 * Every title carries its own suffix rather than reusing the identifier block 4.4 gave the case. The
 * mutation instrument identifies a guard by its title, so two guards sharing one would be attributed
 * to each other - measured, and it made twenty-four of these read as reddened by defects they cannot
 * see.
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
  for (const { id, items, keyOf, outcome, expectedCalls } of edgeCases) {
    it(`${id}, in the language`, () => {
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

  for (const { id, items, keyOf, outcome } of untypedCallerCases) {
    it(`${id}, in the language, from an untyped caller`, () => {
      const { attempt } = callOnce(languageGrouper(), items as readonly unknown[], keyOf)

      assertOutcome(outcome, attempt)
    })
  }
})

/**
 * The other half of what block 4.1 publishes about the language, and it needs the opposite assertion.
 *
 * `Map.groupBy` answers what this contract requires, so replaying block 4.4 against it is enough.
 * `Object.groupBy` is claimed to *disagree*, on group order and on key identity, and a claim of
 * disagreement is not replayed by running a table and hoping it fails: nothing would say whether it
 * failed for the declared reason or for a different one, and a version of the runtime that silently
 * started agreeing would leave the published sentence standing with nothing behind it. Each case
 * below therefore asserts both halves - that the language and this contract part, and exactly what
 * the language answers instead.
 *
 * The cases are looked up in block 4.4 by identifier rather than restated, so a divergence is
 * measured against the row the contract actually settles. Renaming or deleting one of those rows
 * reddens here, which is the coupling that keeps this file a measurement of the table.
 *
 * It was written because the sentence was inherited and unmeasured while the sentence beside it was
 * replayed. A published claim with no replay behind it is the one thing this repository sells
 * against, and it does not stop being one because the claim is about somebody else's function.
 */

type LanguageObjectGroupBy = (
  items: Iterable<unknown>,
  keyOf: (item: unknown, index: number) => PropertyKey,
) => Partial<Record<PropertyKey, readonly unknown[]>>

/** Reached through a cast because `Object.groupBy` is ES2024 and this repository compiles to ES2022. */
const objectGrouper = (): ((
  items: readonly unknown[],
  keyOf: (item: unknown, index: number) => unknown,
) => readonly ExpectedGroup[]) => {
  const groupBy = (Object as unknown as { readonly groupBy?: LanguageObjectGroupBy }).groupBy

  if (typeof groupBy !== 'function') {
    throw new Error(
      'this runtime has no Object.groupBy, so the divergence block 4.1 publishes cannot be ' +
        'measured here. The contract fails rather than skips.',
    )
  }

  return (items, keyOf) =>
    Object.entries(
      groupBy(items, keyOf as (item: unknown, index: number) => PropertyKey),
    ).map(([key, group]) => [key, group ?? []] as const)
}

const caseIdentified = (id: string): EdgeCase => {
  const settled = edgeCases.find((entry) => entry.id === id)

  if (settled === undefined) {
    throw new Error(`block 4.4 no longer carries a case identified as "${id}"`)
  }

  return settled
}

/**
 * What `Object.groupBy` answers where this contract answers something else. Every one of these was
 * measured on Node 24.15.0 before being written down, and each names which half of the published
 * sentence it carries.
 */
const objectGroupByDivergences: readonly {
  readonly settledAs: string
  readonly disagreesOn: string
  readonly answers: readonly ExpectedGroup[]
  readonly rationale: string
}[] = [
  {
    settledAs: 'integer-like-keys-keep-first-occurrence-order',
    disagreesOn: 'the order of the groups',
    answers: [['1', ['1']], ['2', ['2']], ['10', ['10']], ['b', ['b']], ['a', ['a']]],
    rationale:
      'An object enumerates integer-like property names first and in ascending numeric order, ' +
      'whatever order they were inserted in. This is the whole reason the return type is a Map, and ' +
      'it is the half of the sentence that is about order.',
  },
  {
    settledAs: 'a-number-and-its-string-are-different-keys',
    disagreesOn: 'the identity of the keys',
    answers: [['1', [1, '1']]],
    rationale:
      'An object key is a string, so the number and the string collapse into one group. Nothing ' +
      'about a caller\'s data says they are the same thing.',
  },
  {
    settledAs: 'a-boolean-and-its-string-are-different-keys',
    disagreesOn: 'the identity of the keys',
    answers: [['true', [true, 'true']]],
    rationale: 'The same collapse for the other primitive an object silently stringifies.',
  },
  {
    settledAs: 'two-distinct-objects-are-two-keys',
    disagreesOn: 'the identity of the keys',
    answers: [['[object Object]', ['x', 'y']]],
    rationale:
      'Two objects that print alike become one property name, so two groups become one. It is the ' +
      'sharpest of the four: no coercion rule a caller could learn makes this recoverable.',
  },
]

describe('array/group-by@1 against Object.groupBy', () => {
  for (const { settledAs, disagreesOn, answers } of objectGroupByDivergences) {
    it(`${settledAs}: Object.groupBy disagrees on ${disagreesOn}`, () => {
      const settled = caseIdentified(settledAs)

      if (settled.outcome.kind !== 'groups') {
        throw new Error(`"${settledAs}" does not settle a grouping, so nothing here can diverge`)
      }

      const actual = objectGrouper()(settled.items, settled.keyOf)

      expect(
        groupingMatches(actual, settled.outcome.groups),
        `Object.groupBy was expected to disagree with this contract and answered ` +
          `${renderGroups(actual)}, which is what the contract requires`,
      ).toBe(false)

      expect(
        groupingMatches(actual, answers),
        `expected Object.groupBy to answer ${renderGroups(answers)}, it answered ` +
          `${renderGroups(actual)}`,
      ).toBe(true)
    })
  }

  it('publishes a rationale for every divergence', () => {
    // The catalogue's own guard, over a table that is not block 4.4 but is the same kind of thing:
    // an exact test and one line of public documentation. Without it the sentences above would be
    // a field nothing reads.
    expectEveryCaseIsJustified(objectGroupByDivergences, (entry) => entry.settledAs)
  })
})
