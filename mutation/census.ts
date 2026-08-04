/**
 * How many guards each suite of this repository collects, file by file, declared rather than counted.
 *
 * ---------------------------------------------------------------------------
 * The blind spot this closes, measured rather than argued
 * ---------------------------------------------------------------------------
 *
 * `assertWholeSuiteRan` compares a cell's test count against the *control of that same cell*. It
 * catches a door that opens for a mutant and not for the control. It cannot catch a door that is open
 * for both: the control establishes the number, every mutant matches it, and the apparatus agrees
 * with itself while measuring a fraction of the suite.
 *
 * **That is the third instance of `GUARD_PERTURBATION_RULE`, and this time in the apparatus that
 * measures everything else.** The rule says a guard perturbs the claim and never the object derived
 * from it. The claim here is *this run collected the whole suite*; the object derived from it is the
 * control's own count. Deriving the expectation from the control is what makes the guard unable to
 * fail. **So the number below must never be replaced by a derivation - not by counting the files, not
 * by reading a previous run, not by trusting the control.** A future reader who "simplifies" this
 * into a computation will restore the blind spot exactly.
 *
 * Three doors into this failure have been found, all three by accident, none of them by a guard:
 * naming the json reporter alone under `--typecheck`, a type error inside the root `tsconfig.json`'s
 * include, and passing a file filter alongside `--config`. Measured now, on this repository:
 *
 * - the json reporter alone: 21 files reported, **28 assertions instead of 467**, sixteen runtime
 *   files collecting nothing. `success: false`, and **zero failed assertions** - so calibration
 *   refuses it as a red control, naming no guard.
 * - a file filter: seven files fail to collect, no test runs at all, and calibration refuses it as a
 *   run that reported no test.
 *
 * So the three known doors all redden, and none of them is what this file is for. What it is for is
 * the door in the same family that stays **green**: measured, narrowing the collection glob in
 * `vitest.config.ts` by one character drops `string/slugify@1` entirely and the suite reports
 * `success: true`, 15 files, **347 assertions, zero failures**. Calibration accepts it, pins 347 as
 * the number every cell must match, and every cell matches. A hundred and twenty guards are gone and
 * nothing anywhere says so.
 *
 * The next unit is the read API. It adds configuration surface, which is where every one of these
 * doors was.
 *
 * ---------------------------------------------------------------------------
 * Why a pinned number here is not the published-figure rule being broken
 * ---------------------------------------------------------------------------
 *
 * The catalogue's rule is that a number published in this repository is derived at run time, or names
 * the conditions of its measurement. This looks like a violation and is the opposite of one.
 *
 * It is the *independent redeclaration* mechanism this repository already runs on: a reference
 * implementation restates its own signature instead of importing the contract's, a battery pins the
 * verdict of every cell instead of reading it back, and `publicContract` is written out field by
 * field instead of being derived from `FIELD_MAP`. Two statements that must coincide, where the
 * duplication *is* the test. Deriving either side collapses it into a tautology.
 *
 * The published-figure rule governs a number that *describes* something - a size, a share, a count of
 * defects - where a reader has no second statement to check it against. This number is one half of a
 * comparison, and the other half is a live run.
 *
 * ---------------------------------------------------------------------------
 * Per file rather than one total, and what that costs
 * ---------------------------------------------------------------------------
 *
 * Measured on both reproducible failures, a single total per suite would catch each one: 467 becomes
 * 28, and 467 becomes 347. Neither needs per-file resolution to be *detected*.
 *
 * What per-file buys is the message. Both failures are a set of files collecting nothing, and the
 * question the person reading the refusal has to answer is *which*. A total answers "347 where 467
 * was declared" and leaves them to find out; this answers "these six files collected nothing".
 *
 * It costs no more to maintain. Adding a guard moves exactly one number either way - the file's, or
 * the total - so the number of edits per change is identical. What it costs is forty-nine entries
 * to hold instead of five, and one edit whenever a file is added, renamed or removed.
 *
 * **The maintenance cost, stated plainly rather than discovered.** Adding a test breaks this pin.
 * That is the same price as a pinned verdict, already paid deliberately everywhere else in this
 * folder. Measured on the unit that wrote this file - the immutable storage - it would have touched
 * five of the entries it declared: four new test files, and one existing file whose count changed.
 * Measured again on the read API, the unit after it: four entries, three of them new files. A unit
 * that adds a contract touches four. A unit that only changes behaviour touches none.
 *
 * **And measured a third time on the unit that gave the validation pipeline its first battery**, which
 * is the one that exercised the other half of this file: six new entries under a fourth configuration,
 * and that configuration had never been counted, so `censusFor` refused the battery before it measured
 * anything. The refusal fired on the first unit to reach it, which is what it was written for.
 *
 * A fourth time on the installer: seven new entries under a fifth configuration, counted before the
 * battery was first run rather than after `censusFor` refused it. That the refusal did not fire is
 * worth writing down beside the three measurements above: it is the only figure here that was not
 * produced by being caught out.
 *
 * A fifth on `toopo update`, and it is the largest yet: three new files under the fifth configuration
 * and five existing counts moved, plus one in `registry/`. That is what a unit costs when it adds a
 * command rather than a contract, and it is the number the paragraph above predicted at "a unit that
 * only changes behaviour touches none" - this one changed behaviour *and* added guards, so it paid for
 * both.
 *
 * **A sixth on `toopo remove`, and it is the first time the refusal fired on a real unit rather than
 * on the apparatus.** Two new files and four counts moved, all under the fifth configuration - and the
 * battery refused to calibrate until they were written, naming all six disagreements at once. Every
 * earlier measurement here was taken by somebody who had already updated the file; this one is the
 * message being read by the person it was written for, and it cost one edit.
 */

/** The key for a battery that names no configuration, which collects the contracts' own suite. */
export const THE_CONTRACTS_SUITE = 'the contracts'

/** Guards per test file, relative to the repository root. */
export type SuiteCensus = Readonly<Record<string, number>>

export const CENSUS: Readonly<Record<string, SuiteCensus>> = {
  [THE_CONTRACTS_SUITE]: {
    'contracts/array/group-by/edge-cases.test.ts': 32,
    'contracts/array/group-by/language.test.ts': 35,
    'contracts/array/group-by/profiles.test.ts': 8,
    'contracts/array/group-by/properties.test.ts': 12,
    'contracts/array/group-by/signature.test-d.ts': 9,
    'contracts/date/add/edge-cases.test.ts': 91,
    'contracts/date/add/profiles.test.ts': 6,
    'contracts/date/add/properties.test.ts': 18,
    'contracts/date/add/signature.test-d.ts': 5,
    'contracts/number/parse/edge-cases.test.ts': 104,
    'contracts/number/parse/profiles.test.ts': 6,
    'contracts/number/parse/properties.test.ts': 7,
    'contracts/number/parse/signature.test-d.ts': 4,
    'contracts/string/levenshtein/edge-cases.test.ts': 27,
    'contracts/string/levenshtein/profiles.test.ts': 7,
    'contracts/string/levenshtein/properties.test.ts': 15,
    'contracts/string/levenshtein/signature.test-d.ts': 5,
    'contracts/string/slugify/edge-cases.test.ts': 46,
    'contracts/string/slugify/profiles.test.ts': 8,
    'contracts/string/slugify/properties.test.ts': 17,
    'contracts/string/slugify/signature.test-d.ts': 5,
  },

  'registry/vitest.config.ts': {
    'registry/against-the-five.test.ts': 42,
    'registry/attestation.test.ts': 3,
    'registry/coverage.test.ts': 20,
    'registry/determinism.test.ts': 20,
    'registry/endpoints.test.ts': 12,
    'registry/implementations.test.ts': 18,
    'registry/response.test.ts': 46,
    'registry/round-trip.test.ts': 19,
    'registry/served-files.test.ts': 10,
    'registry/snapshot.test.ts': 45,
    'registry/the-sixth-contract.test.ts': 14,
    'registry/verifiability.test.ts': 12,
    'registry/visibility.test.ts': 10,
  },

  'validation/vitest.config.ts': {
    'validation/forbidden-constructs.test.ts': 9,
    'validation/source.test.ts': 3,
    'validation/states-its-own-signature.test.ts': 3,
    'validation/the-boundary.test.ts': 3,
    'validation/the-five.test.ts': 7,
    'validation/typescript-api.test.ts': 2,
  },

  'cli/vitest.config.ts': {
    'cli/arguments.test.ts': 12,
    'cli/breakage.test.ts': 10,
    'cli/configuration.test.ts': 7,
    'cli/diff.test.ts': 10,
    'cli/install.test.ts': 18,
    'cli/list.test.ts': 4,
    'cli/plan.test.ts': 6,
    'cli/remove.test.ts': 12,
    'cli/report.test.ts': 8,
    'cli/rewrite.test.ts': 7,
    'cli/search.test.ts': 12,
    'cli/source.test.ts': 6,
    'cli/update.test.ts': 22,
    'cli/write.test.ts': 8,
  },

  'mutation/fixture/vitest.config.ts': {
    'mutation/fixture/guards.test.ts': 2,
    'mutation/fixture/second-file.test.ts': 1,
  },
}

/**
 * A battery that collects under a configuration nobody has counted is refused before it measures
 * anything.
 *
 * Without this, adding a configuration would silently opt that suite out of the census - which is the
 * same failure one level up: a guard that is absent looks exactly like a guard that passed.
 */
export const censusFor = (config: string | undefined): SuiteCensus => {
  const census = CENSUS[config ?? THE_CONTRACTS_SUITE]
  if (census === undefined) {
    throw new Error(
      `no census declares what "${config ?? THE_CONTRACTS_SUITE}" collects, so a run under it ` +
        `could measure a fraction of its suite and agree with itself. Count it once and write it ` +
        `into mutation/census.ts.`,
    )
  }

  return census
}

/**
 * Which files disagree with the census, each with what was declared and what was collected. Empty
 * when the run collected exactly the declared suite.
 */
export const censusFaults = (
  collected: Readonly<Record<string, number>>,
  declared: SuiteCensus,
): readonly string[] => [
  ...Object.entries(declared)
    .filter(([file, guards]) => (collected[file] ?? 0) !== guards)
    .map(([file, guards]) => `  ${file}: declared ${guards}, collected ${collected[file] ?? 0}`),
  ...Object.keys(collected)
    .filter((file) => declared[file] === undefined)
    .map((file) => `  ${file}: collected ${collected[file] ?? 0}, and the census does not name it`),
]
