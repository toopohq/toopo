import { describe, it, expect } from 'vitest'
import { benchmarkProfiles } from './contract.js'
import { addToDate } from './reference.js'

/**
 * Block 4.5, executable.
 *
 * A benchmark profile names what it measures, and that name is a claim about its samples: a profile
 * called `clamping` promises to time the calendar branch, not the refusal path. `number/parse@1`
 * shipped a profile whose samples took the other path and nothing said so, which is the whole reason
 * this file exists in both contracts.
 */
describe('date/add@1 benchmark profiles', () => {
  for (const { name, sampleClass, samples } of benchmarkProfiles) {
    it(`${name} - every sample is ${sampleClass}`, () => {
      const offenders = samples
        .filter(
          ({ date, duration }) =>
            (addToDate(new Date(date), duration).ok === false) === (sampleClass === 'accepted'),
        )
        .map(({ date, duration }) => `${date} + ${JSON.stringify(duration)}`)

      expect(offenders).toEqual([])
    })
  }

  it('declares a non-empty sample set for every profile', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty).toEqual([])
  })
})
