import { describe, it, expect } from 'vitest'
import type { BenchmarkProfile } from './contract.js'
import { benchmarkProfiles } from './contract.js'
import { deepEqual } from './reference.js'

/**
 * Block 4.5, executable. A profile declares the class its samples belong to, and this is what stops
 * that declaration from being a label: `number/parse@1` is where the rule came from, its
 * `long-inputs` having promised to time the cost of reading a long number while a third of its
 * samples timed the cost of refusing one.
 *
 * The class is read off the samples rather than off the profile, which is what makes the guard able
 * to fail at all - a classifier that consulted `comparisonClass` would establish that the profile
 * agrees with itself.
 *
 * ---------------------------------------------------------------------------
 * Why no timeout is declared
 * ---------------------------------------------------------------------------
 *
 * `CLOCK_DEPENDENCE_RULE` asks whether a guard's verdict can depend on elapsed time. Here it can, and
 * the answer is that the surface is bounded rather than absent: the only non-linear path in this
 * contract is `sameMembers`, which is quadratic in the size of one collection, and the largest
 * collection sampled below holds three members. A defect can make this implementation wrong, and the
 * one place it could make it slow is a collection this contract's own profiles keep small.
 *
 * **No profile times the stack clause and none can**, which `contract.ts` states with the measurement:
 * a sample is carried in the served record, the registry's encoder walks a chain of about fifteen
 * hundred levels before its own stack gives out, and that is shallower than two of the five shipped
 * implementations already answer. `p7-ordinary-depth-costs-no-call-frames` is where the clause is
 * asserted instead, because a property is executed and never served.
 */

/**
 * Where two values first part, as an index into the own keys of the left one, or `null` where they do
 * not part at that level.
 *
 * This is the whole of the classifier and it is deliberately shallow: what separates `stops-early`
 * from `stops-late` is how much of a comparison is paid before the answer is known, and for the
 * samples below that is decided at the top level.
 */
const partsAt = (left: unknown, right: unknown): number | null => {
  if (left === null || typeof left !== 'object' || right === null || typeof right !== 'object') {
    return null
  }

  const keys = Reflect.ownKeys(left).filter((key) => key !== 'length')
  const at = keys.findIndex(
    (key) =>
      !deepEqual(
        (left as Record<string | symbol, unknown>)[key],
        (right as Record<string | symbol, unknown>)[key],
      ),
  )

  return at === -1 ? null : at
}

/** What a sample really is, judged by the answer it gets and never by the profile that carries it. */
const classOf = (left: unknown, right: unknown): BenchmarkProfile['comparisonClass'] | 'unclassed' => {
  if (deepEqual(left, right)) return 'walks-everything'

  const at = partsAt(left, right)

  if (at === null) return 'unclassed'

  const keys = Reflect.ownKeys(left as object).filter((key) => key !== 'length')

  if (at === 0) return 'stops-early'

  return at === keys.length - 1 ? 'stops-late' : 'unclassed'
}

const shape = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return String(value)

  const tag = Object.prototype.toString.call(value).slice(8, -1)

  return Array.isArray(value) ? `[${value.length}]` : tag
}

describe('object/deep-equal@1 benchmark profiles', () => {
  for (const { name, comparisonClass, samples } of benchmarkProfiles) {
    it(`profile-${name} :: every sample is ${comparisonClass}`, () => {
      const offenders = samples.filter(
        ({ left, right }) => classOf(left, right) !== comparisonClass,
      )

      expect(
        offenders.map(
          ({ left, right }) =>
            `deepEqual(${shape(left)}, ${shape(right)}) is ${classOf(left, right)}`,
        ),
      ).toEqual([])
    })
  }

  it('every-profile-has-samples', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty.map(({ name }) => name)).toEqual([])
  })

  it('every-profile-is-addressed :: a name in kebab-case, and no two alike', () => {
    // A profile name is an address: the registry cites one, and a benchmark report keyed on a
    // duplicate would attribute one profile's cost to another.
    const names = benchmarkProfiles.map(({ name }) => name)

    expect({
      malformed: names.filter((name) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)),
      duplicated: [...new Set(names.filter((name, at) => names.indexOf(name) !== at))],
    }).toEqual({ malformed: [], duplicated: [] })
  })

  it('every-class-the-vocabulary-declares-is-sampled', () => {
    // A class nobody samples is a word in a union, and the registry serves that union as the
    // vocabulary a reader is handed. Both directions: a profile declaring a class outside it does not
    // compile, and a class inside it that no profile carries reddens here.
    const declared: readonly BenchmarkProfile['comparisonClass'][] = [
      'stops-early',
      'stops-late',
      'walks-everything',
    ]
    const used = new Set(benchmarkProfiles.map(({ comparisonClass }) => comparisonClass))

    expect(declared.filter((entry) => !used.has(entry))).toEqual([])
  })
})
