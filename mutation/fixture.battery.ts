/**
 * The fixture's own battery: the smallest thing that is a battery at all.
 *
 * It is the apparatus the meta-tests measure the instrument with, and it is a real battery rather
 * than a mock - `npm run mutation -- fixture` runs it and it passes. A mock would measure a
 * reimplementation of the instrument instead of the instrument.
 *
 * `mutation/fixture/reference.ts` says what a fixture is and, at more length, what it is not.
 *
 * Two mutants, and both earn their place. FX-1 is an obvious defect, which is what calibration
 * needs. FX-2 answers every call correctly, which is what the meta-test for an apparatus that cannot
 * see anything needs: pointing calibration at it must be refused.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

export const DOUBLED = `export const doubled = (value: number): number => value * 2`

export const DOUBLES_A_POSITIVE = 'doubles-a-positive-number'
export const DOUBLES_ZERO = 'doubles-zero'
export const DOUBLES_A_NEGATIVE = 'doubles-a-negative-number'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'FX-1',
    'returns the input unchanged - the obvious defect calibration needs, caught by two of the ' +
      'three guards and invisible to the third',
    [reference(DOUBLED, `export const doubled = (value: number): number => value`)],
    killed([DOUBLES_A_POSITIVE, DOUBLES_A_NEGATIVE]),
  ),
  sameOnEveryLens(
    'FX-2',
    'adds the value to itself instead of multiplying it by two - an equivalent mutant, and the one ' +
      'the meta-tests need: an apparatus pointed at it for calibration has been shown able to see ' +
      'nothing at all, and must be refused',
    [reference(DOUBLED, `export const doubled = (value: number): number => value + value`)],
    survived,
  ),
]

export const battery: Battery = {
  name: 'fixture',
  contractPath: 'mutation/fixture',
  vitestConfig: 'mutation/fixture/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'FX-1',

  arms: [{ id: 'C', ref: 'HEAD', convention: 'the fixture as committed' }],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
  ],

  unreachableGuards: [],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'zero doubled and zero returned unchanged are the same value, so neither mutant here reaches ' +
        'it. It is reachable - a defect on the constant term reddens it, and `instrument.test.ts` ' +
        'writes exactly that mutant to measure what happens to this declaration when one arrives - ' +
        'and it is deliberately left unreached, because the meta-tests need a declared silence to ' +
        'measure the declaration machinery on.',
      guards: [DOUBLES_ZERO],
    },
  ],

  mutants,
}
