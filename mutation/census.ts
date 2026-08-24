/**
 * How many guards each suite of this repository collects, file by file, declared rather than counted.
 * ADR-0057 is why a run is selected from this table rather than declared per battery; ADR-0056 is why
 * a fault line quotes what the run said.
 *
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
 * at all** under `packages/cli/`, which declares no typecheck files for that process to collect.
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
 * is in `packages/site/` - and neither folder may hold the other's guard, so the entries land where the reach
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
 * A fifteenth on the freeze: **three** new files under the registry's and no count moved, and the
 * refusal fired on the first two before the battery measured anything. Two of them are the shape the
 * tenth took - a module of its own gets a file of its own - arriving twice because the rule and the
 * reader are deliberately two modules, so that the comparison and the rebuilding of a past commit fail
 * apart. The third is a file with no module of its own at all, and it is the first here: what it holds
 * is a *subject* rather than a unit, built because nothing in this catalogue is published and a check
 * over an empty set goes green for ever. ADR-0093.
 *
 * A sixteenth on the projection a machine reads: no new file and **four counts moved**, all four under
 * the site's, and the refusal did not fire because they were written before the battery ran. It is the
 * shape the eighth predicted - a unit that adds guards to files that already exist touches only their
 * entries - arriving on a unit that added a third projection of every page, an index at the root and a
 * payload in every contract page's head. Four files rather than one because the thing added is answered
 * where each half of it already is: the projection where the projections are checked, the index where
 * the crawler files are, the outline and the payload where the pages are, and the twin where the tree
 * is.
 *
 * A seventeenth on the deployment: one new file under the site's and two counts moved, one under each
 * of the two configurations. It is the eighth's shape again, and the split is the twelfth's - the
 * policy is declared in `packages/registry/` and served from `packages/site/`, so the rendering of a
 * header is counted where the registry is and the file a host reads is counted where the tree is.
 * ADR-0097.
 *
 * An eighteenth on the freeze covering what a contract calls: one new file under the registry's and no
 * count moved, which is the tenth's shape - a module of its own gets a file of its own. What is worth a
 * line is not the cost but *which control charged it*. Seven suites were green, `npm run anchors` was
 * at 0 loose, and the census refused at the calibration of the nineteenth battery: `shared-surface.test.ts:
 * collected 4, and the census does not name it`. That is 34 minutes into a replay, at the one battery
 * whose subject the unit had rewritten - and it is exactly the composition check `CLAUDE.md` records
 * `assertWholeSuiteRan` as lacking, doing the job the total could not. A run that collects a fraction of
 * the suite produces verdicts that look exactly like verdicts, and nothing else in that half-hour would
 * have said so. ADR-0105.
 *
 * A nineteenth on the columns: no new file and **one count moved**, under the site's. It is the
 * cheapest shape this file has - the eighth's - and it is worth a line for the opposite reason to the
 * eighteenth's: nothing charged it. The guard it counts is over the stylesheet, which is where the two
 * guards over the stylesheet already are, so a unit that rewrote the whole layout of every page paid
 * one integer. What a unit costs here is a function of how many *files* its guards land in and never
 * of how much it changed. ADR-0123.
 *
 * A twenty-second on a contract page publishing its own measurement: no new file and one count
 * moved, under the registry's. The guard it counts joins two folders - a battery's declared
 * `contractPath` and a contract's address - and it is counted where the contract half is,
 * because a battery may edit only the folder under measurement and `mutation/` is not one a
 * battery of this repository injects into. ADR-0130.
 *
 * A twenty-first on a domain carrying what it turned down: no new file and one count moved, under the
 * site's - the nineteenth's shape. What it is worth a line for is *why* the count moved. The guard it
 * counts is one `catalogue.ts` had cited for three units and that did not exist:
 * `every-guard-a-decision-names-is-one-its-suite-collects` resolves the guards a **decision record**
 * names and has no opinion about the ones a comment names. It was found by a record naming it in a
 * `confirmed-by`, where the meta suite does look. ADR-0126.
 *
 * A twenty-third on the door: no new file and one count moved, under the site's - the nineteenth's
 * shape again. It is worth a line for what the unit found on its way here rather than for what it
 * cost. The guard it counts was written in the same hour as a second one whose regular expression had
 * been silently narrowed: a `\b` edited into a source through a shell heredoc lands as a literal
 * backspace, the file compiles, the guard collects, and it refuses less than it says. Three were in
 * the tree, two of them committed, and what found them is that a mutant injected against the fresh
 * one failed to redden it. **The census counts guards and cannot count what a guard covers**, which
 * is the sentence this file's own header is about read one level in. ADR-0140.
 *
 * A twenty-fourth on the stylesheet a reader receives: **one new file under the site's, carrying
 * three**, which is the tenth's shape - a module of its own gets a file of its own. It is worth a line
 * for the count rather than the file. Three guards over one removal looked like two too many until
 * each was seen red: the removal bypassed reddens the first alone, a removal that also sweeps blank
 * lines reddens the second alone, and a reader that takes a delimiter for a comment inside a value
 * reddens the third alone. **A guard that no condition reddens by itself is a guard another one
 * already makes**, and that is a thing this file can be asked for cheaply - one number, three
 * measurements. ADR-0141.
 *
 * A twenty-fifth on what a control says: **two new files under the site's, carrying twenty between
 * them, and one count moved** - the largest single arrival this table has taken since the fifth. It is
 * worth a line for what the number *is* rather than for its size. Every one of those twenty is a claim
 * that had no guard of any kind: they came out of `packages/site/start.ts`, which exports nothing, and
 * out of `searching.ts`, which exported four names no test imported. So the twenty are not new
 * coverage of an old subject - they are the first coverage of the only part of this product a visitor
 * touches with a mouse.
 *
 * **The count that did not move is the interesting one.** Nothing in `mutation/site.battery.ts`
 * injected into either file, and nothing anywhere recorded that as a decision - it was an absence and
 * never a refusal. A cell there would have been a guaranteed survivor, which is what an empty column
 * in this table looks like from the inside. ADR-0157.
 *
 * A twentieth on the address that goes on being written: one new file under the packaging's and no
 * count moved, which is the tenth's shape once more - a module of its own gets a file of its own. It is
 * a line here for what it says about *where* a network guard lands: the reading opens a socket, so the
 * obvious home was `packaging/against-the-origin/`, which no battery replays and which this file
 * therefore never counts. Splitting the reader from the reading put eight guards inside the census
 * instead of none, and left the socket in a script the workflow runs. **A suite this file cannot count
 * is a suite nothing can compose-check**, which is the eighteenth's finding read forwards. ADR-0125.
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
    'contracts/typescript/number/round/edge-cases.test.ts': 68,
    'contracts/typescript/number/round/language.test.ts': 29,
    'contracts/typescript/number/round/profiles.test.ts': 8,
    'contracts/typescript/number/round/properties.test.ts': 10,
    'contracts/typescript/number/round/signature.test-d.ts': 4,
    'contracts/typescript/object/deep-equal/edge-cases.test.ts': 103,
    'contracts/typescript/object/deep-equal/profiles.test.ts': 9,
    'contracts/typescript/object/deep-equal/properties.test.ts': 11,
    'contracts/typescript/object/deep-equal/signature.test-d.ts': 5,
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
    'packages/registry/against-the-catalogue.test.ts': 62,
    'packages/registry/attestation.test.ts': 3,
    'packages/registry/coverage.test.ts': 24,
    'packages/registry/determinism.test.ts': 20,
    'packages/registry/emit.test.ts': 11,
    'packages/registry/imagined-addresses.test.ts': 2,
    'packages/registry/endpoints.test.ts': 12,
    'packages/registry/implementations.test.ts': 21,
    'packages/registry/response.test.ts': 60,
    'packages/registry/revision.test.ts': 4,
    'packages/registry/round-trip.test.ts': 33,
    'packages/registry/served-files.test.ts': 12,
    'packages/registry/shared-surface.test.ts': 4,
    'packages/registry/search.test.ts': 14,
    'packages/registry/signature.test.ts': 15,
    'packages/registry/snapshot.test.ts': 53,
    'packages/registry/frozen-for-life.test.ts': 4,
    'packages/registry/publication.test.ts': 9,
    'packages/registry/rebinding.test.ts': 13,
    'packages/registry/rebuild.test.ts': 9,
    'packages/registry/the-sixth-contract.test.ts': 15,
    'packages/registry/verifiability.test.ts': 13,
    'packages/registry/visibility.test.ts': 11,
  },

  'packages/validation/vitest.config.ts': {
    'packages/validation/forbidden-constructs.test.ts': 9,
    'packages/validation/source.test.ts': 3,
    'packages/validation/states-its-own-signature.test.ts': 3,
    'packages/validation/the-boundary.test.ts': 3,
    'packages/validation/the-catalogue.test.ts': 8,
    'packages/validation/typescript-api.test.ts': 2,
  },

  'packages/cli/vitest.config.ts': {
    'packages/cli/arguments.test.ts': 12,
    'packages/cli/breakage.test.ts': 14,
    'packages/cli/command.test.ts': 1,
    'packages/cli/configuration.test.ts': 9,
    'packages/cli/diff.test.ts': 10,
    'packages/cli/emitted-registry.test.ts': 6,
    'packages/cli/http-source.test.ts': 6,
    'packages/cli/ignored.test.ts': 3,
    'packages/cli/install.test.ts': 22,
    'packages/cli/list.test.ts': 4,
    'packages/cli/plan.test.ts': 6,
    'packages/cli/relocate.test.ts': 10,
    'packages/cli/remove.test.ts': 13,
    'packages/cli/report.test.ts': 12,
    'packages/cli/rewrite.test.ts': 7,
    'packages/cli/search.test.ts': 3,
    'packages/cli/source.test.ts': 6,
    'packages/cli/remove-directory.test.ts': 1,
    'packages/cli/update.test.ts': 25,
    'packages/cli/write.test.ts': 8,
  },

  'packages/site/vitest.config.ts': {
    'packages/site/document.test.ts': 17,
    'packages/site/indexing.test.ts': 11,
    'packages/site/literal.test.ts': 11,
    'packages/site/pages.test.ts': 43,
    'packages/site/playground.test.ts': 19,
    'packages/site/published-tree.test.ts': 9,
    'packages/site/read-literal.test.ts': 10,
    'packages/site/searching.test.ts': 4,
    'packages/site/served-headers.test.ts': 8,
    'packages/site/served-modules.test.ts': 4,
    'packages/site/served-stylesheet.test.ts': 3,
    'packages/site/source.test.ts': 8,
    'packages/site/what-a-control-says.test.ts': 16,
  },

  'packaging/vitest.config.ts': {
    'packaging/archive.test.ts': 8,
    'packaging/what-npm-holds.test.ts': 6,
    'packaging/what-the-origin-lists.test.ts': 8,
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
