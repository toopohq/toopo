import { describe, it, expect } from 'vitest'
import { benchmarkProfiles } from './contract.js'
import { addToDate } from './reference.js'

/**
 * Block 4.5, executable. Here the claim is that `clamping` times the calendar branch and not the
 * refusal path.
 */
describe('date/add@1 benchmark profiles', () => {
  for (const { name, sampleClass, samples } of benchmarkProfiles) {
    it(`profile-${name} :: every sample is ${sampleClass}`, () => {
      const offenders = samples
        .filter(
          ({ date, duration }) =>
            (addToDate(new Date(date), duration) === null) === (sampleClass === 'accepted'),
        )
        .map(({ date, duration }) => `${date} + ${JSON.stringify(duration)}`)

      expect(offenders).toEqual([])
    })
  }

  it('every-profile-has-samples', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty).toEqual([])
  })
})
