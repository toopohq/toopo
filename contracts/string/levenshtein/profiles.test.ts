import { describe, it, expect } from 'vitest'
import type { DistanceClass } from './contract.js'
import { benchmarkProfiles } from './contract.js'
import { levenshtein } from './reference.js'

/**
 * Block 4.5, executable. On the first two contracts the claim a profile made about its samples was
 * "these are accepted" or "these are refused"; `array/group-by@1` refuses nothing and had to claim
 * the shape of the grouping instead. A distance has neither, so a profile here claims where its
 * answer sits between the two bounds - which is what decides how much of the matrix an
 * implementation actually walks. The check is the same idea for the fourth time, in a fourth
 * vocabulary, and it is what stops a profile called `one-edit-apart` from quietly measuring two
 * unrelated strings.
 */

const lengthIn = (text: string): number => [...text].length

const holds = (distanceClass: DistanceClass, a: string, b: string, distance: number): boolean => {
  const longer = Math.max(lengthIn(a), lengthIn(b))

  if (distanceClass === 'zero') return distance === 0
  if (distanceClass === 'one-edit') return distance === 1
  if (distanceClass === 'the-whole-of-one-side') {
    return (lengthIn(a) === 0 || lengthIn(b) === 0) && distance === longer
  }

  // `far` is drawn at a quarter of the longer side: below it, an implementation that walks a band
  // around the diagonal does most of the work of one that does not, and the profile would be
  // measuring the band rather than the distance.
  return distance * 4 > longer
}

/**
 * This test asserts a class, never a duration, and the timeout says so out loud - the catalogue's
 * clock rule, applied to the third guard in the repository that qualifies for it.
 *
 * `long-inputs` carries two thousand-code-point samples, so this guard has an input size a defect's
 * complexity can act on, and the reference is already quadratic in it. An implementation that
 * recomputed a row instead of reading it is cubic, and a cubic implementation on a thousand code
 * points is what a five-second default would answer for. A verdict that flips with the speed of the
 * machine would be pinned in the battery as a defect this contract catches, when what caught it was
 * the timer.
 *
 * The contract does not constrain complexity. Block 4.5 declares profiles for a benchmark this
 * repository does not run, and the size at which an implementation stops being usable is exactly what
 * that benchmark exists to expose and this test must not pretend to.
 */
const CLASS_CHECK_TIMEOUT_MS = 30_000

describe('string/levenshtein@1 benchmark profiles', () => {
  for (const { name, distanceClass, samples } of benchmarkProfiles) {
    it(
      `${name} - every sample is ${distanceClass}`,
      () => {
        const offenders = samples
          .map((sample) => ({ ...sample, distance: levenshtein(sample.a, sample.b) }))
          .filter(({ a, b, distance }) => !holds(distanceClass, a, b, distance))

        expect(
          offenders.map(
            ({ a, b, distance }) =>
              `${lengthIn(a)} against ${lengthIn(b)} code points answered ${distance}`,
          ),
        ).toEqual([])
      },
      CLASS_CHECK_TIMEOUT_MS,
    )
  }

  it('declares a non-empty sample set for every profile', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty.map((profile) => profile.name)).toEqual([])
  })

  it('names every declared class at least once, and describes every profile', () => {
    // A class nobody measures is a vocabulary entry pretending to be a plan, and a profile with no
    // description is a name with nothing behind it.
    const classes = new Set(benchmarkProfiles.map((profile) => profile.distanceClass))
    const undescribed = benchmarkProfiles.filter((profile) => profile.description.trim() === '')

    expect({ classes: [...classes].sort(), undescribed: undescribed.map((p) => p.name) }).toEqual({
      classes: ['far', 'one-edit', 'the-whole-of-one-side', 'zero'],
      undescribed: [],
    })
  })
})
