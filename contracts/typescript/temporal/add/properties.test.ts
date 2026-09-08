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

/**
 * Whether a bag carries counts of both signs, restated here rather than imported from the reference,
 * for `willNotApply`'s reason: a property asking the implementation which bags it refuses would be
 * comparing it with itself.
 *
 * Non-zero counts only, and `>` and `<` rather than a sign function, because that is the rule the
 * contract states — a zero field belongs to no sign, and `-0` is a zero.
 */
const carriesTwoSigns = (bag: DurationBag): boolean => {
  const counts = durationUnits
    .filter((unit) => bag[unit] !== undefined)
    .map((unit) => bag[unit] as number)

  return counts.some((count) => count > 0) && counts.some((count) => count < 0)
}

/**
 * A bag of one to three units, drawn small so the *magnitude* never reaches the range.
 *
 * **The size is not the whole of what makes a bag a duration**, and reading this line as though it
 * were is what left `p5` wrong until an engine ran it: each count is drawn independently, so two of
 * them can disagree in sign, and a bag of two signs is no duration at any magnitude. ADR-0255.
 */
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
   * **The population it sets aside is settled by `p7` rather than skipped.** A bag of two signs is
   * refused ahead of any carrier, so the biconditional above is false of it — and that is what this
   * property was red on, on the first engine that ever executed it. Its own comment claimed the bags
   * drawn never reach the range; the reference answered `out-of-range` on `{seconds: -1, hours: 0,
   * microseconds: 1}`, because the language calls a disagreement of signs a `RangeError` and a total
   * `catch` reports what it caught. ADR-0253, ADR-0255.
   *
   * **Neither half can go vacuous unnoticed**: the generator always draws at least one unit and a bag
   * of one unit cannot carry two signs, so every one-unit draw is this property's by construction.
   */
  it('p5-a-unit-the-carrier-does-not-apply-is-refused', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        if (carriesTwoSigns(bag)) return

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

  /**
   * The half `p5` sets aside, and the one place the precedence of `failureReasons` is quantified.
   *
   * It is a property of its own rather than an arm of `p5` because the claim is a different one:
   * `p5` says what a *carrier* refuses, and this says a bag of two signs is refused **whatever
   * carrier it meets** — which is the whole of what makes one helper over three carriers give one
   * answer to one mistake. **The two failure conditions are distinct and neither is `p5`'s, which is
   * measured rather than argued**: with the sign check moved below the carrier's, this property and
   * the two precedence rows of block 4.4 are the whole of what reddens — **3 of 117, with `p5` green
   * throughout** — and with the check taken out this reddens with `out-of-range`, which is the state
   * the contract shipped in. ADR-0255, ADR-0256.
   */
  it('p7-a-bag-of-two-signs-is-refused-by-every-carrier', () => {
    fc.assert(
      fc.property(aCarrier, aBag, (of, bag) => {
        if (!carriesTwoSigns(bag)) return

        expect(describeAddFailure(of(), bag)).toEqual({ reason: 'counts-of-two-signs', unit: null })
      }),
      runs,
    )
  })
})
