import { describe, it, expect } from 'vitest'
import type { BenchmarkProfile } from './contract.js'
import { benchmarkProfiles, outputsAreEqual } from './contract.js'
import { round } from './reference.js'

/**
 * Block 4.5, executable. A profile declares the class its samples belong to, and this is what stops
 * that declaration from being a label: `number/parse@1` is where the rule came from, its
 * `long-inputs` having promised to time the cost of reading a long number while a third of its
 * samples timed the cost of refusing one.
 *
 * The class is read off the samples rather than off the profile, which is what makes the guard able
 * to fail at all - a classifier that consulted `roundingClass` would establish that the profile
 * agrees with itself.
 *
 * ---------------------------------------------------------------------------
 * Why no timeout is declared, where `number/parse@1` declares one
 * ---------------------------------------------------------------------------
 *
 * `CLOCK_DEPENDENCE_RULE` asks whether a guard's verdict can depend on elapsed time, and on that
 * contract it can: its samples are a thousand and five thousand characters long, and a grammar
 * mutant with a nested quantifier does not terminate on them, so the clock would answer before the
 * class assertion did.
 *
 * There is no such surface here. The reference carries no regular expression on the answering path,
 * no recursion, and no nested loop: its cost is linear in a digit string of at most seventeen
 * significant digits, and the longest sample below is a value whose answer is itself. A defect can
 * make this implementation wrong and cannot make it slow, so a timeout would be a number with
 * nothing behind it rather than a repair. That is stated rather than left as an absence, because the
 * neighbouring contract declares one and a reader is owed the difference.
 */

/**
 * Whether a call sits exactly halfway, decided by an integer rather than by re-reading the decimal.
 *
 * Scaling one place past what the caller asked for puts the first dropped digit in the units column,
 * so the question becomes whether that integer ends in five. `Number.isSafeInteger` is what makes it
 * exact: past 2 ** 53 the scaling loses digits, and a value written in exponent notation - `1e+21` -
 * produces a malformed literal and answers NaN, so both fall out as *not* a tie.
 *
 * The limit is therefore one-sided and is declared rather than hidden: this answers false where it
 * cannot tell, never true. A sample at a tie past the safe integers would be classed `shortened` and
 * would have to be declared so. None of the profiles below is in that region - the largest tie is
 * 162 295 - and the day one is, this comment is what says why the class it must be declared with is
 * the weaker one.
 */
const atATie = (value: number, places: number): boolean => {
  const scaled = Number(`${Math.abs(value)}e${places + 1}`)

  return Number.isSafeInteger(scaled) && scaled % 10 === 5
}

/** What a sample really is, judged by the answer it gets and never by the profile that carries it. */
const classOf = (value: number, places: number): BenchmarkProfile['roundingClass'] => {
  const answer = round(value, places)

  if (answer === null) return 'refused'
  if (outputsAreEqual(answer, value)) return 'already-exact'

  return atATie(value, places) ? 'at-a-tie' : 'shortened'
}

const rendered = (value: number): string => (Object.is(value, -0) ? '-0' : String(value))

describe('number/round@1 benchmark profiles', () => {
  for (const { name, roundingClass, samples } of benchmarkProfiles) {
    it(`profile-${name} :: every sample is ${roundingClass}`, () => {
      const offenders = samples.filter(({ value, places }) => classOf(value, places) !== roundingClass)

      expect(
        offenders.map(
          ({ value, places }) =>
            `round(${rendered(value)}, ${rendered(places)}) is ${classOf(value, places)}`,
        ),
      ).toEqual([])
    })
  }

  it('every-profile-has-samples', () => {
    const empty = benchmarkProfiles.filter((profile) => profile.samples.length === 0)

    expect(empty.map(({ name }) => name)).toEqual([])
  })

  it('every-profile-is-addressed :: a name in kebab-case, and no two alike', () => {
    // A profile name is an address: `theTraps` and the registry both cite one, and a benchmark
    // report keyed on a duplicate would attribute one profile's cost to another.
    const names = benchmarkProfiles.map(({ name }) => name)

    expect({
      malformed: names.filter((name) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)),
      duplicated: [...new Set(names.filter((name, at) => names.indexOf(name) !== at))],
    }).toEqual({ malformed: [], duplicated: [] })
  })

  it('every-class-the-vocabulary-declares-is-sampled', () => {
    // A class nobody samples is a word in a union, and the registry serves that union as the
    // vocabulary a reader is handed. Both directions: a profile declaring a class outside it does
    // not compile, and a class inside it that no profile carries reddens here.
    const declared: readonly BenchmarkProfile['roundingClass'][] = [
      'already-exact',
      'at-a-tie',
      'shortened',
      'refused',
    ]
    const used = new Set(benchmarkProfiles.map(({ roundingClass }) => roundingClass))

    expect(declared.filter((entry) => !used.has(entry))).toEqual([])
  })
})
