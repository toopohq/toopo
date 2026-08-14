import { describe, it, expect } from 'vitest'
import type { RetentionClass } from './contract.js'
import { benchmarkProfiles } from './contract.js'
import { slugify } from './reference.js'

/**
 * Block 4.5, executable. On the first two contracts the claim a profile made about its samples was
 * "these are accepted" or "these are refused"; `array/group-by@1` needed the shape of the grouping
 * and `string/levenshtein@1` needed where the answer sits between two bounds. What a profile claims
 * here is how much of its input survives, which is what decides how many of the three expensive
 * steps an implementation actually pays for. The check is the same idea for the fifth time, in a
 * fifth vocabulary, and it is what stops a profile called `punctuation-heavy` from quietly
 * measuring ordinary prose.
 */

const survivors = (text: string): number =>
  [...slugify(text)].filter((point) => point !== '-').length

const holds = (retention: RetentionClass, sample: string): boolean => {
  const total = [...sample].length
  const kept = survivors(sample)

  if (retention === 'all') return slugify(sample) === sample
  if (retention === 'none') return slugify(sample) === ''

  // `most` and `few` are drawn at half rather than at a fraction chosen to fit: above it the fold
  // is what an implementation spends its time in, below it the boundary logic is.
  if (retention === 'most') return kept * 2 > total && slugify(sample) !== sample

  return kept > 0 && kept * 2 < total
}

/**
 * This test asserts a class, never a duration, and the timeout says so out loud - the catalogue's
 * clock rule, applied to the fourth guard in the repository that qualifies for it.
 *
 * Three profiles carry samples of several hundred code points, so this guard has an input size a
 * defect's complexity can act on. An implementation that rebuilt the answer string on every kept
 * code point is quadratic in the length, and a quadratic implementation on a thousand code points
 * is what a five-second default would eventually answer for. A verdict that flips with the speed of
 * the machine would be pinned in the battery as a defect this contract catches, when what caught it
 * was the timer.
 *
 * The contract does not constrain complexity. Block 4.5 declares profiles for a benchmark this
 * repository does not run, and the size at which an implementation stops being usable is exactly
 * what that benchmark exists to expose and this test must not pretend to.
 */
const CLASS_CHECK_TIMEOUT_MS = 30_000

describe('string/slugify@1 benchmark profiles', () => {
  for (const { name, retention, samples } of benchmarkProfiles) {
    it(
      `profile-${name} :: every sample retains ${retention}`,
      () => {
        const offenders = samples
          .filter((sample) => !holds(retention, sample))
          .map(
            (sample) =>
              `${[...sample].length} code points kept ${survivors(sample)} and answered ` +
              `"${slugify(sample).slice(0, 40)}"`,
          )

        expect(offenders).toEqual([])
      },
      CLASS_CHECK_TIMEOUT_MS,
    )
  }

  it('every-profile-has-samples', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty.map((profile) => profile.name)).toEqual([])
  })

  it('every-class-is-named-and-described :: every declared class is measured at least once, and every profile has a description', () => {
    // A class nobody measures is a vocabulary entry pretending to be a plan, and a profile with no
    // description is a name with nothing behind it.
    const classes = new Set(benchmarkProfiles.map((profile) => profile.retention))
    const undescribed = benchmarkProfiles.filter((profile) => profile.description.trim() === '')

    expect({ classes: [...classes].sort(), undescribed: undescribed.map((p) => p.name) }).toEqual({
      classes: ['all', 'few', 'most', 'none'],
      undescribed: [],
    })
  })
})
