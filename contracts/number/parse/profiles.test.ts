import { describe, it, expect } from 'vitest'
import { benchmarkProfiles } from './contract.js'
import { parseNumber } from './reference.js'

/**
 * Block 4.5, executable. This is the contract where the catalogue's rule came from: `long-inputs`
 * promised to time the cost of reading a long number and a third of its samples timed the cost of
 * refusing one, and nothing said so until this file existed.
 */
describe('number/parse@1 benchmark profiles', () => {
  for (const { name, sampleClass, samples } of benchmarkProfiles) {
    it(`${name} - every sample is ${sampleClass}`, () => {
      const offenders = samples.filter(
        (sample) => (parseNumber(sample) === null) === (sampleClass === 'accepted'),
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
