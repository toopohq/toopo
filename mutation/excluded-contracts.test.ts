import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import theContractsSuiteConfiguration from '../vitest.config.ts'
import {
  THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN,
  asAGlob,
  exclusionFaults,
} from './excluded-contracts.ts'
import { THE_REPOSITORY } from './paths.ts'

/**
 * An exclusion is three places, and this is what refuses one written in two. ADR-0251.
 *
 * **The third place is why this file exists.** `vitest.config.ts` reads the declaration and derives
 * both of its globs from it, so those two cannot disagree with it or with each other.
 * `tsconfig.json` is JSON and can import nothing, so its copy is written by hand — and a folder
 * excluded from the two globs and not from the typechecker's project leaves `npm run test` at exit 1
 * with every test passing, which is the shape a reader spends an afternoon on.
 *
 * Measured before this guard existed: `contract.ts` and `reference.ts` alone, with both globs
 * excluding their folder, raise eleven `TypeCheckError`s as *Unhandled Source Errors*.
 */

const theText = (file: string): string => readFileSync(join(THE_REPOSITORY, file), 'utf8')

describe('what the contracts suite does not run', () => {
  /**
   * Every declared folder is excluded in all three places.
   *
   * The fault names the place rather than reporting that something is missing, because a reader
   * meeting *the exclusion is incomplete* has to re-derive which of the three it is — and re-deriving
   * it means reading a vitest option and a tsconfig field to find out which one silently does
   * nothing.
   */
  it('every-contract-the-suite-does-not-run-is-excluded-in-all-three-places', () => {
    // `asAGlob` is the one derivation both sides share, so a defect in it moves the configuration
    // and this comparison together and the guard would be reading the map against itself -
    // `GUARD_PERTURBATION_RULE`. Its shape is pinned here, which is the second statement that makes
    // the comparison below a comparison.
    expect(asAGlob('a/b'), 'a folder excludes its contents and not a file of its own name').toBe(
      'a/b/**',
    )

    const configured = theContractsSuiteConfiguration.test ?? {}

    expect(
      exclusionFaults(THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN, {
        collected: configured.exclude ?? [],
        typechecked: configured.typecheck?.exclude ?? [],
        typecheckProject: theText('tsconfig.json'),
      }),
      'an exclusion written in two places of three leaves the suite red at exit 1 with every test ' +
        'passing, which reads as a broken suite rather than as a missing line.',
    ).toEqual([])
  })

  /**
   * And nothing is excluded that the declaration does not name, or that is not there any more.
   *
   * Two directions in one guard because they are one claim — *the declaration describes the tree* —
   * and they fail apart: a folder in `tsconfig.json` that nothing declares is an exclusion whose
   * reason nobody wrote, and a declared folder that no longer exists is a reason outliving its
   * subject. Either is the silent exclusion this file refuses.
   */
  it('every-excluded-contract-is-a-folder-that-exists-and-says-what-would-lift-it', () => {
    const gone = THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN.filter(
      ({ folder }) => !existsSync(join(THE_REPOSITORY, folder)),
    ).map(({ folder }) => `${folder}: declared excluded and not in the tree`)

    const silent = THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN.filter(
      ({ because, liftedBy }) => because.trim() === '' || liftedBy.trim() === '',
    ).map(({ folder }) => `${folder}: excluded without a reason or without what would lift it`)

    const declared = new Set(THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN.map(({ folder }) => folder))
    const undeclared = [...theText('tsconfig.json').matchAll(/"(contracts\/[^"]+)"/g)]
      .map((found) => found[1] as string)
      .filter((folder) => !declared.has(folder))
      .map((folder) => `${folder}: excluded by tsconfig.json and named by no declaration`)

    expect([...gone, ...silent, ...undeclared]).toEqual([])
  })
})
