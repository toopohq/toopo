import { describe, it, expect } from 'vitest'
import {
  CASE_TABLE_IS_ADDRESSED,
  CASE_TABLE_IS_JUSTIFIED,
  CASE_TABLE_IS_PARTITIONED,
  expectEveryCaseIsAddressed,
  expectEveryCaseIsGrouped,
  expectEveryCaseIsJustified,
} from '../../../../packages/catalogue/every-contract.js'
import { failureReasons, outputsAreEqual } from './contract.js'
import { edgeCaseGroups, edgeCases } from './edge-cases.js'
import { describeRoundFailure, round } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the equality
 * semantics the contract declares - `Object.is`, so that an implementation normalising `-0` into `0`
 * fails here instead of slipping through a `===` comparison - and every entry is asserted a second
 * time against the diagnostic surface.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule and is what
 * makes the title stable under a specification mutant. What the title would otherwise carry - the
 * call and the answer, rendered - is in the failure message, where a mutant may rewrite it freely
 * because nothing identifies a guard by it.
 *
 * The two blocks below must not share a title. Attribution identifies a guard by its title alone, so
 * two guards carrying one would be read as reddening each other.
 */

/** `String(-0)` is "0", so both halves of a call have to be rendered by hand to stay readable. */
const rendered = (value: number | null): string =>
  Object.is(value, -0) ? '-0' : String(value)

const call = (value: number, places: number): string =>
  `round(${rendered(value)}, ${rendered(places)})`

describe('number/round@1 named edge cases', () => {
  for (const { id, value, places, expected } of edgeCases) {
    it(id, () => {
      const actual = round(value, places)

      expect(
        outputsAreEqual(actual, expected),
        `${call(value, places)}: expected ${rendered(expected)}, received ${rendered(actual)}`,
      ).toBe(true)
    })
  }
})

describe('number/round@1 named edge cases, described', () => {
  for (const { id, value, places, reason } of edgeCases) {
    it(`${id}-described`, () => {
      expect(describeRoundFailure(value, places), call(value, places)).toBe(reason)
    })
  }
})

describe('number/round@1 edge case table', () => {
  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...edgeCases.map((edgeCase) => edgeCase.id),
    ])
  })

  it('settles-each-call-once', () => {
    // A call is the pair, so the key is both halves - and rendered rather than joined numerically,
    // because `-0` and `0` are one key under template interpolation and two different questions
    // here: `a-place-count-of-negative-zero` exists precisely to settle one of them.
    const calls = edgeCases.map(({ value, places }) => call(value, places))

    expect(calls).toHaveLength(new Set(calls).size)
  })

  it('names-a-case-for-every-reason :: and declares every reason it names', () => {
    // The partition is frozen with the major, so a literal nobody produces any more would survive as
    // documentation of a refusal that no longer exists - and a reason the table produces without
    // declaring it would be invisible to a caller reading the contract. Both directions, one guard.
    const produced = edgeCases.map(({ reason }) => reason).filter((reason) => reason !== null)

    expect([...new Set(produced)].sort()).toEqual([...failureReasons].sort())
  })

  it('every-answered-case-answers-a-number :: and every refused one answers a reason', () => {
    // The coupling of block 4.2, asserted on the table rather than drawn: a row carrying both an
    // expected number and a reason, or neither, is a row that cannot be satisfied by any
    // implementation obeying the contract - and it would be a specification defect no property
    // could see, because a property draws calls and never reads this table.
    const inconsistent = edgeCases.filter(
      ({ expected, reason }) => (expected === null) !== (reason !== null),
    )

    expect(inconsistent.map(({ id }) => id)).toEqual([])
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([{ name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases }])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })
})
