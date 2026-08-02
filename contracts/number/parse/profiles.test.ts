import { describe, it, expect } from 'vitest'
import { benchmarkProfiles } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.5, executable.
 *
 * A benchmark profile names what it measures, and that name is a claim about its samples: a profile
 * called `long-inputs` promises to time the cost of reading a long number, not the cost of refusing
 * one. Nothing enforced that promise until this file existed, and the contract shipped a profile
 * where a third of the samples took the other path.
 *
 * The check is cheap and it is the only thing standing between a profile and a quiet lie.
 */
describe('number/parse@1 benchmark profiles', () => {
  for (const { name, sampleClass, samples } of benchmarkProfiles) {
    it(`${name} - every sample is ${sampleClass}`, () => {
      const offenders = samples.filter(
        (sample) => parseNumber(sample).ok !== (sampleClass === 'accepted'),
      )

      expect(offenders.map((sample) => `${sample.slice(0, 16)} (length ${sample.length})`)).toEqual(
        [],
      )
    })
  }

  it('declares a non-empty sample set for every profile', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty).toEqual([])
  })
})
