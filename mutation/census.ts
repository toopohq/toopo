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
 * Three doors into this failure were found by accident, none of them by a guard: naming the json
 * reporter alone under `--typecheck`, a type error inside the root `tsconfig.json`'s include, and
 * passing a file filter alongside `--config`. Measured on this repository when this file was
 * written - dated rather than left in the present tense, because the entries below are a record of
 * three runs and not a claim about today:
 *
 * - the json reporter alone: 21 files reported, **28 assertions**, sixteen runtime files collecting
 *   nothing. `success: false`, and **zero failed assertions** - so calibration refuses it as a red
 *   control, naming no guard. The denominator this line carried was the guard count of the day and
 *   has been dropped; what the door does is collect twenty-eight of them, whatever the total is.
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
 * The fourth door, and the first this refusal found rather than survived
 * ---------------------------------------------------------------------------
 *
 * A lower-case Windows drive letter in the root handed to vitest collapses every runtime file with
 * `TypeError: Cannot read properties of undefined (reading 'config')` - deterministically, over
 * twenty runs of each spelling: **28 assertions** under the contracts' configuration, which are the
 * five `.test-d.ts` files tsc collects in the parent process where no worker is involved, and **none
 * at all** under `cli/`, which declares no typecheck files for that process to collect.
 * `mutation/paths.ts` carries the measurement and closes it by pinning the spelling.
 *
 * Those two figures used to be written *of 472* and *of 170*, and the second went false the day this
 * folder's suite gained a file. What the sentence is about is the pair 28 and zero being one door read
 * through two configurations, and neither half needs the population it was a fraction of - the rule
 * this file's own header states about a number that describes something, arriving on the header.
 *
 * It is the fourth door and the first that was not a setting anybody typed - and unlike the other
 * three it was **named by this refusal** rather than stumbled into. Calibration would have stopped
 * either way, because sixteen files that fail to collect make the control red; but that refusal
 * prints `control.failedGuards`, and no guard failed. *A red control with no failed guard says only
 * that something did.* What said which sixteen files, twice, before any verdict existed, is the
 * refusal below - and naming them is what turned an operator's half-hour into a door.
 *
 * The entry stays after the closure for the reason all four stay: the next one will not be a drive
 * letter.
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
 * and five existing counts moved, plus one in `packages/registry/`. That is what a unit costs when it adds a
 * command rather than a contract, and it is the number the paragraph above predicted at "a unit that
 * only changes behaviour touches none" - this one changed behaviour *and* added guards, so it paid for
 * both.
 *
 * **A sixth on `toopo remove`, and it is the first time the refusal fired on a real unit rather than
 * on the apparatus.** Two new files and four counts moved, all under the fifth configuration - and the
 * battery refused to calibrate until they were written, naming all six disagreements at once. Every
 * earlier measurement here was taken by somebody who had already updated the file; this one is the
 * message being read by the person it was written for, and it cost one edit.
 *
 * A seventh on the site: a **sixth configuration** with four new files, plus two entries moved under
 * the registry's - a new file and one existing count. That is what a unit costs when it adds a client
 * *and* repairs the schema underneath it, and the configuration was counted before the battery was
 * first run rather than after the refusal fired, which is the second time that has been true.
 *
 * An eighth on the method page: no new file and two counts moved, both under the site's. It is the
 * cheapest measurement here and it is the one that matches the prediction two paragraphs up - a unit
 * that adds guards to files that already exist touches only their entries. The page itself has no
 * test file of its own on purpose: what it publishes is checked where the pages are checked and where
 * the port is checked, because that is what those guards are about.
 *
 * A ninth on the archive, and it is the first taken by a unit that wrote no guard at all. `packaging/`
 * already had its fifteen and no battery; giving them one added a **seventh configuration** with two
 * entries and moved nothing else, because a battery is not collected by any suite. That is the shape
 * of every later unit that closes this same debt elsewhere, and it is the cheapest entry this file
 * will ever gain.
 *
 * A tenth on the folder that moves: one new file and one count moved, both under the fifth
 * configuration, and the refusal did not fire because they were written before the battery ran. It is
 * the ordinary shape a unit takes here - a module of its own gets a file of its own, and the screen it
 * changed is counted where screens are counted.
 *
 * An eleventh on the teardown, and it is the first taken by a unit whose defect was in the apparatus
 * rather than in anything the apparatus measures: one new file under the fifth configuration and no
 * count moved, because the guard it adds is over this folder's own test support. What made it
 * necessary is that a removal answering `EPERM` in a `finally` reddens whichever guard is running, and
 * a red guard is what this instrument reads as a verdict - so the census gaining an entry here is the
 * cheapest half of the repair, and the retry beside it is the other.
 *
 * A twelfth on the licence, and it is the first spread over two configurations for a reason other than
 * scale: one new file under the registry's, one count moved under the site's. What is guarded is a
 * single origin and a single licence perimeter, whose declaration is in `packages/registry/` and whose consumer
 * is in `site/` - and neither folder may hold the other's guard, so the entries land where the reach
 * falls rather than where the subject is.
 *
 * A thirteenth on the narrowing, and it is the first that moved no number at all: a contract battery
 * now collects its own contract instead of all five, so what changed is which entries a run is
 * compared against and not how many there are. That is the whole of what `censusFor` gained, and the
 * shape it did *not* take is worth recording beside it - see below.
 *
 * A fourteenth on the edge that carries a digest: no new file and two counts moved, one under the
 * registry's and one under the fifth configuration. It is the shape the eighth predicted - a unit that
 * adds guards to files that already exist touches only their entries - arriving on a change to the
 * schema rather than to a page, which is worth one line because the schema is where a new file would
 * have been the expected cost. Both guards ask one question about one fact, so both land beside the
 * fixture and the installer that already ask everything else about it.
 *
 * ---------------------------------------------------------------------------
 * The census this file is not, and the wall it does not move
 * ---------------------------------------------------------------------------
 *
 * A narrowed run collects a fraction of its configuration, so it cannot be compared against the whole
 * table. The obvious repair is a census **per battery**, and it is the wrong one: it multiplies every
 * integer here by the number of batteries a contract carries, on a file that already grows with the
 * catalogue. What a run collects is instead *selected* from the same table, by the folder the battery
 * injects into - a field it already holds, and already the predicate `run.ts` uses to decide which
 * guards are its own. **No integer here is new, and none moved.**
 *
 * That leaves the file's own scale exactly where it was, and this is said rather than left to look
 * addressed: **four to five hand-written counts per contract**, twenty-one for the five, and nothing
 * about the narrowing changes that arithmetic.
 *
 * Deriving them was measured and refused. A count is not a function of any one committed value: over
 * the five, an `edge-cases.test.ts` collects `cases + 1`, `cases + 4`, `2 x cases + 1`, `2 x cases + 6`
 * and `cases + 4` - the constant differs per contract, so a derivation would need a hand-written
 * integer per contract *and* a formula, where the formula is a second statement about the shape of a
 * test file and can drift from it. The counting itself is the demonstration: reading `id:` off the
 * five case tables gives 194 where the catalogue publishes 187 cases, because a group carries one
 * too. An independent source would need a second careful statement, which is what the first paragraph
 * of this file refuses.
 */

/** The key for a battery that names no configuration, which collects the contracts' own suite. */
export const THE_CONTRACTS_SUITE = 'the contracts'

/** Guards per test file, relative to the repository root. */
export type SuiteCensus = Readonly<Record<string, number>>

export const CENSUS: Readonly<Record<string, SuiteCensus>> = {
  [THE_CONTRACTS_SUITE]: {
    'contracts/typescript/array/group-by/edge-cases.test.ts': 33,
    'contracts/typescript/array/group-by/language.test.ts': 35,
    'contracts/typescript/array/group-by/profiles.test.ts': 8,
    'contracts/typescript/array/group-by/properties.test.ts': 12,
    'contracts/typescript/array/group-by/signature.test-d.ts': 9,
    'contracts/typescript/date/add/edge-cases.test.ts': 92,
    'contracts/typescript/date/add/profiles.test.ts': 6,
    'contracts/typescript/date/add/properties.test.ts': 18,
    'contracts/typescript/date/add/signature.test-d.ts': 5,
    'contracts/typescript/number/parse/edge-cases.test.ts': 105,
    'contracts/typescript/number/parse/profiles.test.ts': 6,
    'contracts/typescript/number/parse/properties.test.ts': 7,
    'contracts/typescript/number/parse/signature.test-d.ts': 4,
    'contracts/typescript/string/levenshtein/edge-cases.test.ts': 28,
    'contracts/typescript/string/levenshtein/profiles.test.ts': 7,
    'contracts/typescript/string/levenshtein/properties.test.ts': 15,
    'contracts/typescript/string/levenshtein/signature.test-d.ts': 5,
    'contracts/typescript/string/slugify/edge-cases.test.ts': 47,
    'contracts/typescript/string/slugify/profiles.test.ts': 8,
    'contracts/typescript/string/slugify/properties.test.ts': 17,
    'contracts/typescript/string/slugify/signature.test-d.ts': 5,
  },

  'packages/registry/vitest.config.ts': {
    'packages/registry/address.test.ts': 3,
    'packages/registry/against-the-five.test.ts': 50,
    'packages/registry/attestation.test.ts': 3,
    'packages/registry/coverage.test.ts': 20,
    'packages/registry/determinism.test.ts': 20,
    'packages/registry/emit.test.ts': 11,
    'packages/registry/endpoints.test.ts': 12,
    'packages/registry/implementations.test.ts': 18,
    'packages/registry/response.test.ts': 46,
    'packages/registry/round-trip.test.ts': 19,
    'packages/registry/served-files.test.ts': 10,
    'packages/registry/signature.test.ts': 14,
    'packages/registry/snapshot.test.ts': 45,
    'packages/registry/publication.test.ts': 5,
    'packages/registry/the-sixth-contract.test.ts': 15,
    'packages/registry/verifiability.test.ts': 13,
    'packages/registry/visibility.test.ts': 10,
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
    'cli/breakage.test.ts': 12,
    'cli/command.test.ts': 1,
    'cli/configuration.test.ts': 9,
    'cli/diff.test.ts': 10,
    'cli/emitted-registry.test.ts': 6,
    'cli/http-source.test.ts': 5,
    'cli/ignored.test.ts': 3,
    'cli/install.test.ts': 21,
    'cli/list.test.ts': 4,
    'cli/plan.test.ts': 6,
    'cli/relocate.test.ts': 10,
    'cli/remove.test.ts': 13,
    'cli/report.test.ts': 12,
    'cli/rewrite.test.ts': 7,
    'cli/search.test.ts': 12,
    'cli/source.test.ts': 6,
    'cli/remove-directory.test.ts': 1,
    'cli/update.test.ts': 25,
    'cli/write.test.ts': 8,
  },

  'site/vitest.config.ts': {
    'site/document.test.ts': 8,
    'site/indexing.test.ts': 9,
    'site/literal.test.ts': 11,
    'site/pages.test.ts': 26,
    'site/playground.test.ts': 10,
    'site/published-tree.test.ts': 3,
    'site/read-literal.test.ts': 10,
    'site/source.test.ts': 8,
  },

  'packaging/vitest.config.ts': {
    'packaging/archive.test.ts': 8,
    'packaging/freeze.test.ts': 8,
  },

  'mutation/fixture/vitest.config.ts': {
    'mutation/fixture/guards.test.ts': 2,
    'mutation/fixture/second-file.test.ts': 1,
  },
}

/**
 * What one run of a battery must collect: the files its configuration declares that lie under the
 * folder it injects into.
 *
 * Two refusals, and they fail on opposite conditions.
 *
 * A configuration nobody has counted is refused before the battery measures anything. Without it,
 * adding a configuration would silently opt that suite out of the census - the same failure one level
 * up, where a guard that is absent looks exactly like a guard that passed.
 *
 * A folder no file of that configuration lies under is refused for the same reason and it is the newer
 * half: an empty census agrees with a run that collected nothing at all, so a `contractPath` that has
 * stopped naming anything would leave calibration refusing a red control that names no guard - *which
 * says only that something did*, the sentence this whole file exists to replace.
 *
 * **One rule and no branch, which is what makes the second refusal cover every battery.** Six of the
 * seven configurations set `root` to their own folder and collect nothing outside it, so the selection
 * is the whole table for them and a mistyped folder is caught there too - not only under the one
 * configuration that is actually narrowed.
 */
export const censusFor = (config: string | undefined, folder: string): SuiteCensus => {
  const census = CENSUS[config ?? THE_CONTRACTS_SUITE]
  if (census === undefined) {
    throw new Error(
      `no census declares what "${config ?? THE_CONTRACTS_SUITE}" collects, so a run under it ` +
        `could measure a fraction of its suite and agree with itself. Count it once and write it ` +
        `into mutation/census.ts.`,
    )
  }

  const scoped = Object.entries(census).filter(([file]) => file.startsWith(`${folder}/`))
  if (scoped.length === 0) {
    throw new Error(
      `no file of "${config ?? THE_CONTRACTS_SUITE}" lies under "${folder}", so this battery would ` +
        `be compared against an empty census - which agrees with a run that collected nothing. ` +
        `Check the battery's contractPath, and count the folder in mutation/census.ts if it is new.`,
    )
  }

  return Object.fromEntries(scoped)
}

/**
 * What a run collected in one file, and what the run said about it if it said anything.
 *
 * The second field is why this is a record rather than a count, and it was paid for. The fourth door
 * above survived two replays because the refusal named the empty files and threw away the only
 * sentence that said why they were empty: vitest reports it in `testResults[].message`, and
 * `runSuite` read past it. Naming the files says *something is wrong*; quoting the run says *what*.
 */
export type CollectedFile = {
  readonly guards: number
  /** The first line of the first error the run reported for it. A file that collected is silent. */
  readonly reported: string | null
}

const fault = (file: string, count: string, reported: string | null): string =>
  `  ${file}: ${count}${reported === null ? '' : `\n    the run said: ${reported}`}`

/**
 * Which files disagree with the census, each with what was declared, what was collected, and what
 * the run said about it. Empty when the run collected exactly the declared suite.
 */
export const censusFaults = (
  collected: Readonly<Record<string, CollectedFile>>,
  declared: SuiteCensus,
): readonly string[] => [
  ...Object.entries(declared)
    .filter(([file, guards]) => (collected[file]?.guards ?? 0) !== guards)
    .map(([file, guards]) =>
      fault(
        file,
        `declared ${guards}, collected ${collected[file]?.guards ?? 0}`,
        collected[file]?.reported ?? null,
      ),
    ),
  ...Object.entries(collected)
    .filter(([file]) => declared[file] === undefined)
    .map(([file, one]) =>
      fault(file, `collected ${one.guards}, and the census does not name it`, one.reported),
    ),
]
