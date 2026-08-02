import { describe, it, expect } from 'vitest'
import { benchmarkProfiles } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.5, executable. This is the contract where the catalogue's rule came from: `long-inputs`
 * promised to time the cost of reading a long number and a third of its samples timed the cost of
 * refusing one, and nothing said so until this file existed.
 */

/**
 * This test asserts a class, never a duration, and the timeout says so out loud - the catalogue's
 * clock rule, applied to the second guard in the repository that qualifies for it.
 *
 * `long-inputs` carries a 1002-character and a 5001-character sample, so this guard has an input size
 * a defect's complexity can act on. What that costs was measured rather than assumed, because the
 * obvious version of the claim is false: a grammar mutant that adds a nested quantifier and still
 * accepts these samples is not slow at all - measured, 0.032 ms against the reference's 0.031 ms on
 * the 1002-character sample, because a match succeeds on the first greedy attempt.
 *
 * The expensive shape is a nested quantifier that *rejects* one of them, and it is not marginal:
 * measured, `(?:\d+(?:\.\d*)?|\.\d+)+...[a-z]$` does not terminate on a forty-character input, let
 * alone on these. A mutant that rejects a long accepted sample is exactly what the class assertion
 * below exists to catch - so under a five-second default the clock would answer first, and the cell
 * would be pinned as caught by this test when what caught it was the timer.
 *
 * The contract does not constrain complexity. Block 4.5 declares profiles for a benchmark this
 * repository does not run, and a pathological implementation is something that benchmark would expose
 * and this test must not pretend to.
 */
const CLASS_CHECK_TIMEOUT_MS = 30_000

describe('number/parse@1 benchmark profiles', () => {
  for (const { name, sampleClass, samples } of benchmarkProfiles) {
    it(
      `${name} - every sample is ${sampleClass}`,
      () => {
        const offenders = samples.filter(
          (sample) => (parseNumber(sample) === null) === (sampleClass === 'accepted'),
        )

        expect(
          offenders.map((sample) => `${sample.slice(0, 16)} (length ${sample.length})`),
        ).toEqual([])
      },
      CLASS_CHECK_TIMEOUT_MS,
    )
  }

  it('declares a non-empty sample set for every profile', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty).toEqual([])
  })
})
