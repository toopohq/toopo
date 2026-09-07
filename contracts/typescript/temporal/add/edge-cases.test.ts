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
import type { EdgeCase } from './edge-cases.js'
import { edgeCaseGroups, edgeCases } from './edge-cases.js'
import { add, describeAddFailure } from './reference.js'

/**
 * Block 4.4, executable. Every entry of the contract's table is asserted exactly, using the equality
 * semantics the contract declares — the ISO rendering, so an implementation that re-balances `P1DT1H`
 * into `PT25H` fails here rather than passing a comparison that calls them the same length of time.
 *
 * A guard is titled by the case's `id` and nothing else, which is the catalogue's rule and is what
 * makes the title stable under a specification mutant.
 *
 * **The table holds ISO renderings and this file constructs the carriers**, rather than the table
 * holding carriers. A case is data a reader can read without a runtime, and on a runtime without
 * `Temporal` the table still loads while this file does not — which is the honest division for a
 * contract whose own suite cannot run here.
 */

const carrierOf = (
  kind: EdgeCase['carrier'],
  from: string,
): Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration =>
  kind === 'PlainTime'
    ? Temporal.PlainTime.from(from)
    : kind === 'PlainYearMonth'
      ? Temporal.PlainYearMonth.from(from)
      : Temporal.Duration.from(from)

const call = (one: EdgeCase): string =>
  `add(Temporal.${one.carrier}.from('${one.from}'), ${JSON.stringify(one.duration)})`

describe('temporal/add@1 named edge cases', () => {
  for (const one of edgeCases) {
    it(one.id, () => {
      const answer = add(carrierOf(one.carrier, one.from), one.duration)
      const wanted = one.expected === null ? null : carrierOf(one.carrier, one.expected)

      expect(
        outputsAreEqual(answer, wanted),
        `${call(one)}: expected ${one.expected}, received ${answer === null ? 'null' : answer.toString()}`,
      ).toBe(true)
    })
  }
})

describe('temporal/add@1 named edge cases, described', () => {
  for (const one of edgeCases) {
    it(`${one.id}-described`, () => {
      const described = describeAddFailure(carrierOf(one.carrier, one.from), one.duration)

      expect(described, call(one)).toEqual(
        one.reason === null ? null : { reason: one.reason, unit: one.unit },
      )
    })
  }
})

describe('temporal/add@1 edge case table', () => {
  it(CASE_TABLE_IS_ADDRESSED, () => {
    expectEveryCaseIsAddressed([
      ...edgeCaseGroups.map(({ id }) => id),
      ...edgeCases.map((one) => one.id),
    ])
  })

  it('settles-each-call-once', () => {
    // A call is the pair, so the key is both halves.
    const calls = edgeCases.map(call)

    expect(calls).toHaveLength(new Set(calls).size)
  })

  it('names-a-case-for-every-reason :: and declares every reason it names', () => {
    // Both directions, one guard. A literal nobody produces would survive as documentation of a
    // refusal that does not happen, and a reason the table produces without declaring it would be
    // invisible to a caller reading the contract.
    const produced = edgeCases.map(({ reason }) => reason).filter((reason) => reason !== null)

    expect([...new Set(produced)].sort()).toEqual([...failureReasons].sort())
  })

  it('every-answered-case-answers-a-carrier :: and every refused one answers a reason', () => {
    const inconsistent = edgeCases.filter(
      ({ expected, reason }) => (expected === null) !== (reason !== null),
    )

    expect(inconsistent.map(({ id }) => id)).toEqual([])
  })

  it('names-the-unit-exactly-when-the-reason-is-about-one', () => {
    // The diagnostic carries a unit because the reason alone is not actionable on this contract - a
    // bag of six units refused for one of them is repaired by removing that one. A row carrying a
    // unit under `out-of-range`, or none under `unit-the-carrier-does-not-apply`, is a specification
    // defect no property could see.
    const wrong = edgeCases.filter(
      ({ reason, unit }) => (reason === 'unit-the-carrier-does-not-apply') !== (unit !== null),
    )

    expect(wrong.map(({ id }) => id)).toEqual([])
  })

  it('settles-every-carrier-against-every-unit :: the forty rows of the matrix', () => {
    // ADR-0225's figure, asserted rather than transcribed: three carriers of which one is bimodal,
    // ten units each. The four rows beyond it are the two reasons the matrix cannot reach, and this
    // guard is what says the matrix is whole rather than that the table is forty long.
    const theMatrixGroups = [
      'a-time-and-the-four-units-it-drops',
      'a-year-month-and-the-eight-it-refuses',
      'a-duration-that-applies-nothing',
      'a-duration-that-applies-seven',
    ]
    const matrix = edgeCases.filter((one) => theMatrixGroups.includes(one.group))
    const seen = matrix.map((one) => `${one.carrier}(${one.from}) ${Object.keys(one.duration)[0]}`)

    expect(seen).toHaveLength(40)
    expect(new Set(seen).size).toBe(40)
  })

  it(CASE_TABLE_IS_PARTITIONED, () => {
    expectEveryCaseIsGrouped([{ name: 'edge-cases', groups: edgeCaseGroups, cases: edgeCases }])
  })

  it(CASE_TABLE_IS_JUSTIFIED, () => {
    expectEveryCaseIsJustified(edgeCases, ({ id }) => id)
  })
})
