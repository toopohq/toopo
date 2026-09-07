/**
 * The contracts in this tree that the contracts' own suite does not run, and why. ADR-0251.
 *
 * ---------------------------------------------------------------------------
 * Why a declaration and not three edits
 * ---------------------------------------------------------------------------
 *
 * Excluding a contract is **three places**, measured before any of it was written: the two globs of
 * `vitest.config.ts`, which stop collection, and `tsconfig.json`'s `exclude`, which stops the
 * typechecker — vitest typechecks the *project* rather than the collected set and reports what it
 * finds outside that set as a source error, so two of the three leave the suite red at exit 1 with
 * every test passing.
 *
 * Three edits, one of which is in another file, is exactly the shape that goes half-done in silence.
 * So the folders are named here once, the two configurations read this list, and
 * `excluded-contracts.test.ts` refuses a folder missing from the third — which no configuration can
 * import, `tsconfig.json` being JSON.
 *
 * ---------------------------------------------------------------------------
 * What an exclusion costs, said rather than implied
 * ---------------------------------------------------------------------------
 *
 * **Nothing measures an excluded contract.** Its suite does not run, its types are not checked, and
 * ADR-0250's guard does not reach it either — that one requires every contract *of the catalogue* to
 * be collected by a configuration a battery reads, and a contract in the tree that is not in the
 * catalogue is outside its population by construction.
 *
 * That is the price of keeping `npm run test` green on 22.18.0 and on 24 for everybody, and it is
 * paid deliberately. What is refused is the *silent* version of it: an exclusion nothing names, whose
 * reason nobody wrote down, and which no reader can tell from an oversight.
 */

/** One contract the contracts' suite does not run, with the reason and the event that would end it. */
export type AnExcludedContract = {
  /** Repository-relative, no trailing slash: the two configurations append their own glob. */
  readonly folder: string
  /** Why it cannot run here. A sentence, because a reader is deciding whether it applies to them. */
  readonly because: string
  /** What would put it back in the suite. Never *someday*: a condition somebody can recognise. */
  readonly liftedBy: string
}

export const THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN: readonly AnExcludedContract[] = [
  {
    folder: 'contracts/typescript/temporal/add',
    because:
      'it is written against `Temporal`, which reached stage 4 in March 2026 and which neither leg ' +
      'of this repository matrix carries - node 22.18.0 and node 24 both answer `undefined` for the ' +
      'global, and `lib` has no fragment for it that vitest honours. Every file of the folder is ' +
      'affected and not only its test files: measured, `contract.ts` and `reference.ts` alone raise ' +
      'eleven `TypeCheckError`s and take `npm run test` to exit 1 with every test passing.',
    liftedBy:
      'a leg of the matrix carrying `Temporal` in the form the language published - node 26 ships it ' +
      'unflagged, and ADR-0220 measured all eight suites green on 26.8.1. What that leg needs and ' +
      'this exclusion does not is a way to route a battery to a runtime: `PlatformFamily` is the ' +
      'closed union `windows | posix` and the `batteries` job pins `node-version: 24`.',
  },
]

/** The folders alone, which is what the two configurations append a glob to. */
export const THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN: readonly string[] =
  THE_CONTRACTS_THIS_SUITE_DOES_NOT_RUN.map((excluded) => excluded.folder)

/**
 * Where an exclusion has to be written, in the words a fault says it in.
 *
 * A list rather than three booleans, so the guard reports *which* place is missing rather than that
 * something is - which is the difference between a fault somebody repairs and one they re-derive.
 */
export type ThePlacesAnExclusionLives = {
  /** `vitest.config.ts`, as text. */
  readonly runtimeConfiguration: string
  /** `tsconfig.json`, as text: JSON, so no configuration can import the declaration above. */
  readonly typecheckProject: string
}

/**
 * Which folder is missing from which place, empty when every declared folder is in all three.
 *
 * The two globs of `vitest.config.ts` are read as one place deliberately: they are derived from this
 * declaration by a `map` in that file, so they cannot disagree with each other, and a guard asserting
 * they do would be comparing the declaration with itself. What *can* disagree is the third, which is
 * JSON and is written by hand.
 */
export const exclusionFaults = (
  declared: readonly AnExcludedContract[],
  places: ThePlacesAnExclusionLives,
): readonly string[] => [
  ...declared.flatMap((excluded) =>
    places.runtimeConfiguration.includes('THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN')
      ? []
      : [`${excluded.folder}: vitest.config.ts does not read the declaration`],
  ),
  ...declared.flatMap((excluded) =>
    places.typecheckProject.includes(`"${excluded.folder}"`)
      ? []
      : [
          `${excluded.folder}: tsconfig.json does not exclude it, so the typechecker still reads ` +
            `the folder and reports what it finds there as a source error`,
        ],
  ),
]
