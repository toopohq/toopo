import { describe, it, expect } from 'vitest'
import { THE_SWEEP, outputsAreEqual, theTraps } from './contract.js'
import { edgeCases } from './edge-cases.js'

/**
 * Where this contract parts from the language, replayed rather than asserted.
 *
 * Block 4.1 says the two spellings a caller writes first answer a wrong number silently, that the
 * one spelling which answers correctly hands back text, and it publishes a figure for each. Those
 * sentences are what admits the contract, and a sentence that decides something and cannot be
 * replayed is an opinion. This file runs each of them against the runtime.
 *
 * ---------------------------------------------------------------------------
 * Nothing here calls `reference.ts`, and that is the design rather than an omission
 * ---------------------------------------------------------------------------
 *
 * Every claim below is about JavaScript, so every judge below is JavaScript's. The table of block
 * 4.4 is the judge for the named calls, and `inIntegers` is the judge for the sweep - arithmetic on
 * an integer count of thousandths, which is exact and is not this contract's implementation read a
 * second time. So no mutant of `reference.ts` can redden anything in this file, and it belongs to
 * the guards the mutation instrument cannot reach.
 *
 * That is recorded rather than hidden: it is there for the reader deciding whether this contract is
 * worth admitting, not for the score.
 *
 * ---------------------------------------------------------------------------
 * A runtime that cannot answer has not agreed
 * ---------------------------------------------------------------------------
 *
 * `Intl.NumberFormat` is the language's own correct decimal rounder and it is what block 4.1 rests
 * on. A runtime whose `Intl` ignores `roundingMode` would silently be asked a different question, so
 * the resolved options are read and a runtime that does not carry it fails here rather than passing.
 * That is the same rule `array/group-by@1` follows for `Map.groupBy`.
 *
 * ---------------------------------------------------------------------------
 * Why the sweep hoists the formatter, measured
 * ---------------------------------------------------------------------------
 *
 * `Number.prototype.toLocaleString` constructs a `NumberFormat` on every call, and over `THE_SWEEP`
 * that costs 18 278 ms against 583 ms for the same computation with one formatter hoisted - the same
 * verdict on every value. The sweep hoists it, and `the-right-answer-as-text-is-the-spelling-a-caller-writes`
 * is what stops that from being a substitution taken on trust.
 */

type Spelling = (value: number, places: number) => number

/** The three spellings exactly as a caller writes them, by the address `theTraps` gives each. */
const spellings: Readonly<Record<string, Spelling>> = {
  'the-stored-double-and-not-the-written-decimal': (value, places) => Number(value.toFixed(places)),
  'the-error-moved-and-not-removed': (value, places) =>
    Math.round(value * 10 ** places) / 10 ** places,
  'the-right-answer-as-text': (value, places) =>
    Number(
      value.toLocaleString('en-US', {
        maximumFractionDigits: places,
        minimumFractionDigits: places,
      }),
    ),
}

/**
 * The same three at the sweep's own place count, with the third one's formatter hoisted.
 *
 * Grouping is left on, because grouping is the trap. What is taken out of the loop is only the
 * construction, and `the-right-answer-as-text-is-the-spelling-a-caller-writes` is what checks that
 * taking it out changes no answer.
 */
const sweepFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: THE_SWEEP.places,
  minimumFractionDigits: THE_SWEEP.places,
})

const sweepSpellings: Readonly<Record<string, Spelling>> = {
  ...spellings,
  'the-right-answer-as-text': (value) => Number(sweepFormatter.format(value)),
}

/**
 * `roundingMode` is ES2023 and this repository compiles against the ES2022 library, so the option
 * and the resolved option are both declared here and reached through a cast - the same treatment
 * `array/group-by@1` gives `Map.groupBy`, and for the same reason.
 *
 * Declaring it is not decoration. The default rounding mode of `Intl.NumberFormat` is already
 * `halfExpand`, so passing the option changes nothing on a runtime that has it and reading it back
 * is the only thing that tells a runtime which ignores it from a runtime which honours it.
 */
type RoundingModeOptions = Intl.NumberFormatOptions & { readonly roundingMode: 'halfExpand' }
type RoundingModeResolved = Intl.ResolvedNumberFormatOptions & { readonly roundingMode?: string }

/**
 * The language's own correct rounder, or a failure saying the runtime cannot be asked.
 *
 * `maximumFractionDigits` is capped at 100 by ECMA-402, so this answers `undefined` where the
 * contract still answers - and which cases those are is asserted below rather than assumed.
 */
const theLanguageRounder = (value: number, places: number): number | undefined => {
  if (!Number.isFinite(value) || !Number.isInteger(places) || places < 0 || places > 100) {
    return undefined
  }

  const format = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: places,
    minimumFractionDigits: places,
    roundingMode: 'halfExpand',
    useGrouping: false,
  } as RoundingModeOptions)

  if ((format.resolvedOptions() as RoundingModeResolved).roundingMode !== 'halfExpand') {
    throw new Error(
      'this runtime ignores Intl.NumberFormat roundingMode, so the measurement that admits ' +
        'number/round@1 cannot be made here. The contract fails rather than skips.',
    )
  }

  return Number(format.format(value))
}

/** What a count of thousandths rounds to, in integers. Exact, and not this contract's own code. */
const inIntegers = (thousandths: number, places: number): number => {
  const divisor = 10 ** (3 - places)
  const magnitude = Math.floor((Math.abs(thousandths) + divisor / 2) / divisor)

  return Number(`${thousandths < 0 ? '-' : ''}${magnitude}e-${places}`)
}

const rendered = (value: number | null): string => (Object.is(value, -0) ? '-0' : String(value))

const answerable = edgeCases.filter(
  ({ value, places }) => theLanguageRounder(value, places) !== undefined,
)

describe('number/round@1 against the language own rounder', () => {
  for (const { id, value, places, expected } of answerable) {
    it(`${id}-in-the-language`, () => {
      const theirs = theLanguageRounder(value, places)

      expect(
        outputsAreEqual(theirs ?? null, expected),
        `Intl answers ${rendered(theirs ?? null)} where this contract settles ${rendered(expected)}`,
      ).toBe(true)
    })
  }

  it('every-case-the-language-cannot-be-asked-is-refused-or-past-a-hundred-places', () => {
    // The skip is declared and checked rather than left implicit: a guard that did not run is not a
    // guard that passed, so the set of cases outside the language's reach has to be exactly the set
    // this contract can say in advance - the refusals, and the place counts ECMA-402 caps out at.
    const outside = edgeCases
      .filter((entry) => !answerable.includes(entry))
      .map(({ id }) => id)
      .sort()

    const predicted = edgeCases
      .filter(({ expected, places }) => expected === null || places > 100)
      .map(({ id }) => id)
      .sort()

    expect(outside).toEqual(predicted)
  })
})

describe('number/round@1 against the spellings a caller reaches for', () => {
  for (const trap of theTraps) {
    it(`${trap.name}-parts-from-this-contract`, () => {
      const spelling = spellings[trap.name]
      expect(spelling, `${trap.name} names no spelling this file knows`).toBeTypeOf('function')

      const agreeing = trap.partsFrom.filter(({ value, places }) =>
        Object.is((spelling as Spelling)(value, places), theLanguageRounder(value, places)),
      )

      expect(
        agreeing.map(({ value, places }) => `round(${rendered(value)}, ${places})`),
        `${trap.spelling} agrees with the correct answer on rows the contract says it parts from`,
      ).toEqual([])
    })
  }

  for (const trap of theTraps) {
    it(`${trap.name}-over-the-sweep`, () => {
      const spelling = sweepSpellings[trap.name] as Spelling
      let wrong = 0

      for (let thousandths = 1; thousandths <= THE_SWEEP.thousandths; thousandths++) {
        const value = Number(`${thousandths}e-3`)
        if (!Object.is(spelling(value, THE_SWEEP.places), inIntegers(thousandths, THE_SWEEP.places))) {
          wrong += 1
        }
      }

      expect(wrong, `${trap.spelling} over every k/1000 for k in [1, ${THE_SWEEP.thousandths}]`).toBe(
        trap.wrongOnTheSweep,
      )
    })
  }

  it('the-right-answer-as-text-is-the-spelling-a-caller-writes', () => {
    // The sweep above hoists the formatter out of the loop because constructing one per call costs
    // thirty-one times as much. This is what keeps that from being a substitution taken on trust:
    // the spelling a caller really writes and the hoisted form answer the same thing.
    const differing = edgeCases
      .filter(({ expected }) => expected !== null)
      .filter(({ value }) => {
        const written = Number(
          value.toLocaleString('en-US', {
            maximumFractionDigits: THE_SWEEP.places,
            minimumFractionDigits: THE_SWEEP.places,
          }),
        )

        return !Object.is(written, Number(sweepFormatter.format(value)))
      })

    expect(differing.map(({ id }) => id)).toEqual([])
  })
})
