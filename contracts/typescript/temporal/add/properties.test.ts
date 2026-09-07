import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../packages/catalogue/every-contract.js'
import type { DurationBag, DurationUnit } from './contract.js'
import { durationUnits, outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { add, describeAddFailure } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * The generators matter as much as the assertions. A bag drawn uniformly over ten units would be
 * refused on almost every draw — the union of the inapplicable sets is eight of the ten across the
 * three carriers — so the region where a call is *answered* would go unvisited. `aBagFor` draws
 * against a carrier rather than in isolation, weighted so that roughly half the draws are calls the
 * carrier applies in full.
 */

/** The three carriers, and for `Duration` both modes, because its inapplicable set is its own. */
const aCarrier = fc.constantFrom(
  () => Temporal.PlainTime.from('12:30:00'),
  () => Temporal.PlainTime.from('23:59:59.999999999'),
  () => Temporal.PlainYearMonth.from('2026-01'),
  () => Temporal.PlainYearMonth.from('2026-12'),
  () => Temporal.Duration.from('P1Y'),
  () => Temporal.Duration.from('P1M'),
  () => Temporal.Duration.from('P1D'),
  () => Temporal.Duration.from('PT1H'),
)

/**
 * What a carrier will not apply, restated here rather than imported from the reference.
 *
 * A property that asked the implementation which units it refuses would be comparing it with itself,
 * which is `GUARD_PERTURBATION_RULE` on an oracle. This is the contract's sentence written a second
 * time, from the case table's four groups rather than from the code.
 */
const willNotApply = (
  carrier: Temporal.PlainTime | Temporal.PlainYearMonth | Temporal.Duration,
): readonly DurationUnit[] => {
  const tag = (carrier as { readonly [Symbol.toStringTag]: string })[Symbol.toStringTag]

  if (tag === 'Temporal.PlainTime') return ['years', 'months', 'weeks', 'days']
  if (tag === 'Temporal.PlainYearMonth') {
    return durationUnits.filter((unit) => unit !== 'years' && unit !== 'months')
  }

  const duration = carrier as Temporal.Duration

  return duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0
    ? durationUnits
    : ['years', 'months', 'weeks']
}

/** A bag of one to three units, drawn small so the arithmetic never reaches the range. */
const aBag: fc.Arbitrary<DurationBag> = fc
  .uniqueArray(fc.constantFrom(...durationUnits), { minLength: 1, maxLength: 3 })
  .chain((units) =>
    fc.array(fc.integer({ min: -3, max: 3 }), { minLength: units.length, maxLength: units.length })
      .map((counts) =>
        Object.fromEntries(units.map((unit, at) => [unit, counts[at] ?? 0])) as DurationBag,
      ),
  )

const runs = { numRuns: propertyRuns }

describe('temporal/add@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    expectUniversalPropertiesAnswered(universalProperties, ['no ambient output'])
  })

  /**
   * The carrier is immutable by construction, so this property is about the *bag* — a plain object
   * the caller still holds and is going to read again.
   */
  it('p1-never-mutates-the-bag', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        const before = JSON.stringify(bag)
        add(of(), bag)
        describeAddFailure(of(), bag)

        expect(JSON.stringify(bag)).toBe(before)
      }),
      runs,
    )
  })

  /**
   * Two identical consecutive calls agree. The defect it is written for caches the inapplicable set
   * per carrier *type*, which is right for two of the three and wrong for `Duration`.
   */
  it('p2-deterministic', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        expect(outputsAreEqual(add(of(), bag), add(of(), bag))).toBe(true)
      }),
      runs,
    )
  })

  /** The same probe, with an arbitrary history run between the two halves. */
  it('p3-no-ambient-input', () => {
    fc.assert(
      fc.property(
        aCarrier,
        aBag,
        fc.array(fc.tuple(aCarrier, aBag), { maxLength: 6 }),
        (of, bag, history) => {
          const alone = add(of(), bag)
          for (const [other, otherBag] of history) add(other(), otherBag)

          expect(outputsAreEqual(add(of(), bag), alone)).toBe(true)
        },
      ),
      runs,
    )
  })

  it('p4-refused-exactly-when-described :: the coupling of block 4.2', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        expect(add(of(), bag) === null).toBe(describeAddFailure(of(), bag) !== null)
      }),
      runs,
    )
  })

  /**
   * The contract's own sentence, quantified: a call is refused for a unit exactly when the bag names
   * one the carrier does not apply.
   *
   * The bags drawn here never reach the range, so `out-of-range` cannot fire and the two reasons
   * cannot be confused — which is the distinction the case table settles by name and this property
   * keeps out of its own population deliberately.
   */
  it('p5-a-unit-the-carrier-does-not-apply-is-refused', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        const carrier = of()
        const refusedUnits = willNotApply(carrier)
        const named = durationUnits.filter((unit) => bag[unit] !== undefined)
        const shouldRefuse = named.some((unit) => refusedUnits.includes(unit))

        const described = describeAddFailure(carrier, bag)

        expect(described?.reason ?? null).toBe(
          shouldRefuse ? 'unit-the-carrier-does-not-apply' : null,
        )
      }),
      runs,
    )
  })

  /** And when it refuses for a unit, the unit it names is one the bag actually carries. */
  it('p6-a-refusal-names-a-unit-the-bag-carries', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        const described = describeAddFailure(of(), bag)
        if (described?.reason !== 'unit-the-carrier-does-not-apply') return

        expect(described.unit === null ? false : bag[described.unit] !== undefined).toBe(true)
      }),
      runs,
    )
  })
})
