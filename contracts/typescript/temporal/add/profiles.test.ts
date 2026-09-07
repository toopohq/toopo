import { describe, it, expect } from 'vitest'
import type { BenchmarkProfile, BenchmarkSample } from './contract.js'
import { benchmarkProfiles, durationUnits } from './contract.js'
import { add, describeAddFailure } from './reference.js'

/**
 * Block 4.5, executable. A profile declares the class its samples belong to, and this is what stops
 * that declaration from being a label: the class is read off the samples and never off the profile,
 * so a classifier consulting `addClass` would only establish that a profile agrees with itself.
 *
 * `number/parse@1` is where the rule came from — its `long-inputs` promised to time the cost of
 * reading a long number while a third of its samples timed the cost of refusing one.
 *
 * ---------------------------------------------------------------------------
 * Why no timeout is declared
 * ---------------------------------------------------------------------------
 *
 * `CLOCK_DEPENDENCE_RULE` asks whether a guard's verdict can depend on elapsed time. There is no
 * such surface here: the reference reads at most ten keys, compares them against a list of at most
 * ten, and calls the carrier once. No recursion, no regular expression on the answering path, and no
 * loop whose bound is the caller's. A defect can make this implementation wrong and cannot make it
 * slow, so a timeout would be a number with nothing behind it.
 *
 * ---------------------------------------------------------------------------
 * And why no two profiles are indistinguishable
 * ---------------------------------------------------------------------------
 *
 * ADR-0171 forbids two profiles of one contract that the guards cannot tell apart, and settling it
 * before publication is the only time it can be settled. The four here differ in the class read off
 * their samples, which is exactly what the first guard below computes — so the separation is
 * measured rather than declared.
 */

const carrierOf = (sample: BenchmarkSample) =>
  sample.carrier === 'PlainTime'
    ? Temporal.PlainTime.from(sample.from)
    : sample.carrier === 'PlainYearMonth'
      ? Temporal.PlainYearMonth.from(sample.from)
      : Temporal.Duration.from(sample.from)

/** What a sample actually does, read by running it rather than by trusting its profile. */
const classOf = (sample: BenchmarkSample): BenchmarkProfile['addClass'] => {
  const named = durationUnits.filter((unit) => sample.duration[unit] !== undefined)
  if (named.length === 0) return 'refused-before-a-unit'

  const described = describeAddFailure(carrierOf(sample), sample.duration)

  return described === null ? 'all-applied' : 'refused-by-the-carrier'
}

describe('temporal/add@1 benchmark profiles', () => {
  it('every-sample-belongs-to-the-class-its-profile-declares', () => {
    // `receiver-decides` is the one class a single sample cannot show, because what it names is a
    // relation between two of them - the same bag against both modes of a Duration. It is asserted
    // by the guard below instead, and excused here rather than silently passed.
    const wrong = benchmarkProfiles
      .filter((profile) => profile.addClass !== 'receiver-decides')
      .flatMap((profile) =>
        profile.samples
          .filter((sample) => classOf(sample) !== profile.addClass)
          .map((sample) => `${profile.name}: ${sample.carrier}(${sample.from}) is ${classOf(sample)}`),
      )

    expect(wrong).toEqual([])
  })

  it('the-receiver-that-decides-really-decides', () => {
    // The profile's whole claim is that one bag answers differently on two receivers of one type.
    // Without this the class would be a label, and the profile would be indistinguishable from
    // `refused-by-the-carrier` to every guard here.
    const profile = benchmarkProfiles.find(({ addClass }) => addClass === 'receiver-decides')
    expect(profile, 'no profile declares the class').toBeDefined()

    const verdicts = new Set((profile?.samples ?? []).map(classOf))

    expect(verdicts.size, `${profile?.name}: every sample answers the same way`).toBeGreaterThan(1)
  })

  it('no-two-profiles-are-indistinguishable', () => {
    // ADR-0171, settled before publication because it can be settled at no other time.
    const seen = benchmarkProfiles.map(({ addClass }) => addClass)

    expect(seen).toHaveLength(new Set(seen).size)
  })

  it('every-profile-names-what-it-measures', () => {
    const unnamed = benchmarkProfiles.filter(
      ({ name, description, samples }) =>
        name.trim() === '' || description.trim() === '' || samples.length === 0,
    )

    expect(unnamed.map(({ name }) => name)).toEqual([])
  })

  it('every-sample-runs', () => {
    // A sample that throws is a benchmark measuring an exception. Every one of them is either
    // answered or refused by the contract, and neither raises.
    for (const profile of benchmarkProfiles) {
      for (const sample of profile.samples) {
        expect(() => add(carrierOf(sample), sample.duration)).not.toThrow()
      }
    }
  })
})
