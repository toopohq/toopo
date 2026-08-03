import { describe, it, expect } from 'vitest'
import type { ProfileShape } from './contract.js'
import { benchmarkProfiles, profileKeyFunctions } from './contract.js'
import { groupBy } from './reference.js'

/**
 * Block 4.5, executable. On the first two contracts the claim a profile makes about its samples was
 * "these are accepted" or "these are refused"; this contract refuses nothing, so its claim is about
 * the *shape* of the grouping - one group, one group per element, or somewhere between - and the
 * check is the same idea. Without it, a profile called `many-small-groups` could quietly be measuring
 * sixteen groups over fifty thousand elements.
 */

const holds = (shape: ProfileShape, size: number, length: number): boolean => {
  if (shape === 'empty') return length === 0 && size === 0
  if (length === 0) return false

  if (shape === 'single-group') return size === 1
  if (shape === 'one-group-per-element') return size === length
  // The two middle shapes are separated at a quarter: a profile with fewer groups than a quarter of
  // its elements is measuring the arrays, one with more is measuring the Map.
  if (shape === 'few-large-groups') return size > 1 && size * 4 <= length

  return size > 1 && size < length && size * 4 > length
}

/**
 * These tests assert a shape, never a duration, and the timeout says so out loud.
 *
 * Measured, and the reason this is not left at the default. An implementation that rebuilds a group
 * array on every insertion instead of pushing into it answers correctly on every sample here and
 * takes 5392 ms on the fifty-thousand-element single-group sample, against 0.7 ms for the reference.
 * Under vitest's default five-second limit that implementation fails this file - not because the
 * shape it produced was wrong, but because the machine was slow enough that day. A verdict that
 * flips with the speed of the computer is the one thing the mutation instrument exists to prevent,
 * and it would have been pinned here as a defect this contract catches.
 *
 * The contract does not constrain complexity. Block 4.5 declares profiles for a benchmark that this
 * repository does not run, and a quadratic implementation is something that benchmark would expose
 * and these tests must not pretend to.
 */
const SHAPE_CHECK_TIMEOUT_MS = 30_000

describe('array/group-by@1 benchmark profiles', () => {
  for (const { name, shape, keyFunction, samples } of benchmarkProfiles) {
    it(
      `profile-${name} :: every sample is ${shape}`,
      () => {
        const keyOf = profileKeyFunctions[keyFunction]

        const offenders = samples
          .map((sample) => ({ length: sample.length, size: groupBy(sample, keyOf).size }))
          .filter(({ size, length }) => !holds(shape, size, length))

        expect(
          offenders.map(({ size, length }) => `${length} elements fell into ${size} group(s)`),
        ).toEqual([])
      },
      SHAPE_CHECK_TIMEOUT_MS,
    )
  }

  it('every-profile-has-samples', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty.map((profile) => profile.name)).toEqual([])
  })

  it('every-shape-is-named-and-described :: every declared shape is measured at least once, and every profile has a description', () => {
    // A shape nobody measures is a vocabulary entry pretending to be a plan, and a profile with no
    // description is a name with nothing behind it.
    const shapes = new Set(benchmarkProfiles.map((profile) => profile.shape))
    const undescribed = benchmarkProfiles.filter((profile) => profile.description.trim() === '')

    expect({ shapes: [...shapes].sort(), undescribed: undescribed.map((p) => p.name) }).toEqual({
      shapes: ['empty', 'few-large-groups', 'many-small-groups', 'one-group-per-element', 'single-group'],
      undescribed: [],
    })
  })

  // There is no guard here checking that a profile names a key function which exists.
  // `ProfileKeyFunction` is `keyof typeof profileKeyFunctions`, so the compiler refuses the mistake
  // before this file runs, and a runtime assertion of it would be structurally incapable of failing.
})
