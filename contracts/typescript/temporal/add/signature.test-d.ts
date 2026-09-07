import { describe, it, expectTypeOf } from 'vitest'
import type { Add, DescribeAddFailure } from './contract.js'
import { add, describeAddFailure } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, narrows its return, drops `null`
 * from it, or loses the type parameter fails the suite before any behavioural test runs.
 *
 * **The type parameter is the half that is load-bearing outside this contract.** `packages/site`
 * builds the playground's form field from the parameter's declared type — the bare name `T` — and
 * refuses to build the page unless this signature binds `T` to `PlainTime`, `PlainYearMonth` and
 * `Duration`. An implementation answering `Carrier | null` would satisfy every behavioural test here
 * and take the contract's page off the site. ADR-0239.
 */
describe('temporal/add@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(add).toEqualTypeOf<Add>()
  })

  it('signature-answers-the-carrier-it-was-given :: and not a union the caller must narrow', () => {
    const time = Temporal.PlainTime.from('12:30:00')
    expectTypeOf(add(time, { hours: 1 })).toEqualTypeOf<Temporal.PlainTime | null>()

    const duration = Temporal.Duration.from('P1D')
    expectTypeOf(add(duration, { hours: 1 })).toEqualTypeOf<Temporal.Duration | null>()
  })

  it('signature-refuses-a-carrier-outside-the-three :: the bound is what the site reads', () => {
    // @ts-expect-error `PlainDate` applies all ten units, so there is no unit to refuse and no
    // question to ask. ADR-0225 removed it from the arity on exactly that reading.
    add(Temporal.PlainDate.from('2026-01-15'), { hours: 1 })
  })

  it('signature-takes-a-bag-of-unit-counts :: both arguments required', () => {
    // @ts-expect-error the duration is required. A default would put a second arity into the major
    // and `add(c)` reads as *advance c*, which says nothing about by how much.
    add(Temporal.PlainTime.from('12:30:00'))
  })

  it('signature-publishes-the-diagnostic :: with the unit, because the reason alone is not actionable', () => {
    expectTypeOf(describeAddFailure).toEqualTypeOf<DescribeAddFailure>()
  })
})
