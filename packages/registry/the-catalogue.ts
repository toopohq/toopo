/**
 * The catalogue, described to the serialiser.
 *
 * **It is `theCatalogue` and it was `theFive`, and the count is why it moved.** A name that renders
 * the data it names is false on the day that data moves, and this one held for as long as the
 * catalogue held five contracts: the module, two suites and four guard addresses all said *five*,
 * and none of them would have reddened on a sixth. That is ADR-0017's own test - falsifying the name
 * and reddening the guard are the same event, or the name is carrying data - applied to the list
 * rather than to a case.
 *
 * **The word is not a second spelling of `packages/catalogue/`.** That folder opens on *what every
 * contract in this catalogue shares*: it is named after the collection whose shared surface it
 * carries, and this list is the collection. The alternative considered was a compound naming these
 * entries by their type, and it was refused for the reason `/contracts/` was refused as an address:
 * a second spelling of something this project already names in one word is the drift
 * `packages/site/paths.ts` names at its own head. ADR-0140.
 *
 * What is here is everything the builder cannot read from a module, and nothing else. Three kinds of
 * thing qualify, and each one is guarded rather than trusted.
 *
 * A *declared type* is not a value, so nothing at run time can read one. The texts below are
 * transcribed from `contract.ts` and `against-the-catalogue.test.ts` requires each one to occur
 * there, whitespace normalised. A signature is the first thing a reader of a contract page looks at,
 * so it has to be in the record; being in the record, it has to be checkable.
 *
 * A *profile vocabulary* is a union type, so the same applies. The guard is different because the
 * data is: every class a profile uses must be declared here, and every class declared here must be
 * used by a profile.
 *
 * A *table's purpose* and an *own declaration's stratum* are judgements about a contract, made once,
 * in public. The stratum was measured rather than assumed - by reading which guard imports which
 * declaration - and the measurement is recorded beside each entry that is not obvious.
 */

import type { Battery } from '../../mutation/run.js'
import type { BatteryRecord } from './evidence.js'
import type { ContractSource } from './serialise.js'
import { SERVED_AS_A_FILE } from './serialise.js'
import type { ContractAddress } from './address.js'
import type { Lifecycle } from './contract-record.js'
import { THE_SEVEN_FILE_NAMES } from './the-seven-files.js'

import * as numberParse from '../../contracts/typescript/number/parse/contract.js'
import * as numberParseCases from '../../contracts/typescript/number/parse/edge-cases.js'
import * as dateAdd from '../../contracts/typescript/date/add/contract.js'
import * as dateAddCases from '../../contracts/typescript/date/add/edge-cases.js'
import * as groupBy from '../../contracts/typescript/array/group-by/contract.js'
import * as groupByCases from '../../contracts/typescript/array/group-by/edge-cases.js'
import * as levenshtein from '../../contracts/typescript/string/levenshtein/contract.js'
import * as levenshteinCases from '../../contracts/typescript/string/levenshtein/edge-cases.js'
import * as slugify from '../../contracts/typescript/string/slugify/contract.js'
import * as slugifyCases from '../../contracts/typescript/string/slugify/edge-cases.js'
import * as round from '../../contracts/typescript/number/round/contract.js'
import * as roundCases from '../../contracts/typescript/number/round/edge-cases.js'

import { battery as numberParseBattery } from '../../mutation/number-parse.battery.js'
import { battery as numberParseSpec } from '../../mutation/number-parse-spec.battery.js'
import { battery as dateAddBattery } from '../../mutation/date-add.battery.js'
import { battery as dateAddSpec } from '../../mutation/date-add-spec.battery.js'
import { battery as groupByBattery } from '../../mutation/array-group-by.battery.js'
import { battery as groupBySpec } from '../../mutation/array-group-by-spec.battery.js'
import { battery as levenshteinBattery } from '../../mutation/string-levenshtein.battery.js'
import { battery as levenshteinSpec } from '../../mutation/string-levenshtein-spec.battery.js'
import { battery as slugifyBattery } from '../../mutation/string-slugify.battery.js'
import { battery as slugifySpec } from '../../mutation/string-slugify-spec.battery.js'
import { battery as roundBattery } from '../../mutation/number-round.battery.js'
import { battery as roundSpec } from '../../mutation/number-round-spec.battery.js'
import { battery as validationStageOne } from '../../mutation/validation-stage-1.battery.js'

const addressOf = (name: string): ContractAddress => ({ language: 'typescript', name, major: 1 })

const NUMBER_PARSE = addressOf('number/parse')
const DATE_ADD = addressOf('date/add')
const GROUP_BY = addressOf('array/group-by')
const LEVENSHTEIN = addressOf('string/levenshtein')
const SLUGIFY = addressOf('string/slugify')
const ROUND = addressOf('number/round')

/**
 * The state the four installable contracts entered on the day this catalogue was published.
 *
 * **Read the sentence on `publishContract` before moving any contract into it.** Every byte of a
 * published contract's declared files is frozen from here on - the seven, `reference.ts` and the four
 * test files included, comments and blank lines included - and the repair for anything that has to
 * change is `name@2` beside it rather than in place of it. `packages/registry/against-what-was-published/`
 * is what refuses the alternative, by rebuilding each binding at the commit it records.
 *
 * The lifecycle is the standing half and never enters a snapshot, so moving a contract here moves no
 * digest: measured, and `the-decision-to-publish-moves-no-digest` is the guard that keeps it so.
 * ADR-0106 is the unit that moved these four, and why the commit that did it could not record where.
 */
const PUBLISHED: Lifecycle = { state: 'published' }

/**
 * The two guards an `executable` declaration of the catalogue names, written once because two
 * declarations each rest on the same one. A string repeated here is a rename away from being wrong
 * twice.
 */
const ZONE_PROPERTY = 'no-ambient-input-from-the-time-zone'
const A_PROFILE_KEEPS_ITS_SHAPE = 'profile-one-group-per-element'

/**
 * Every guard identifier a battery names: pinned by a cell, declared out of its reach, or declared
 * unprobed.
 *
 * Read off the battery rather than transcribed beside it. A transcription is a second statement, and
 * a guard address that resolved against a transcription would establish that two lists agree rather
 * than that the guard exists.
 *
 * `suites` are deliberately not here: a suite is a `describe` title and a guard is not, so folding
 * them in would let an address resolve against a block name.
 */
const guardsNamedBy = (battery: Battery): readonly string[] => [
  ...new Set([
    ...battery.mutants.flatMap((mutant) =>
      Object.values(mutant.expected).flatMap((expectation) => expectation.by ?? []),
    ),
    ...battery.unreachableGuards.flatMap((silent) => silent.guards ?? []),
    ...battery.unprobedRegions.flatMap((region) => region.guards ?? []),
  ]),
]

/** Reduce a battery to what makes a citation resolvable. Nothing else of it is registry data. */
const batteryRecord = (contract: ContractAddress, battery: Battery): BatteryRecord => ({
  name: battery.name,
  contract,
  mutants: battery.mutants.map((mutant) => mutant.id),
  guards: guardsNamedBy(battery),
})

/**
 * A battery that measures the repository's machinery rather than a contract, and whose guards a
 * contract record may still cite.
 *
 * It carries no contract, and `evidence.ts` says why that absence is the mechanism rather than a
 * gap: `resolveProvenance` matches on the contract, so a case of block 4.4 can never resolve
 * `found-by-mutation` against one of these. The honest citation stays possible and the wrong one is
 * unrepresentable, with no second list to keep in step.
 */
const machineryRecord = (battery: Battery): BatteryRecord => ({
  name: battery.name,
  mutants: battery.mutants.map((mutant) => mutant.id),
  guards: guardsNamedBy(battery),
})

const ACCEPTED_AND_REJECTED = [
  { name: 'accepted', meaning: 'every sample of the profile is answered rather than refused' },
  { name: 'rejected', meaning: 'every sample of the profile is refused, which is a different path' },
]

/**
 * The seven files with fixed names, read from the module that also says what each one is.
 *
 * It used to be a private list here and the meanings were nowhere. `the-seven-files.ts` carries both,
 * so the list a reader is served and the list the site describes cannot come apart - which is what a
 * second copy on a page would have made possible. ADR-0129.
 */
const THE_SEVEN_FILES = THE_SEVEN_FILE_NAMES

/**
 * What every contract's own files reach outside their folder, and what is therefore frozen with it.
 *
 * The same list for every contract, because `packages/catalogue/` is what they share and ADR-0080
 * is the bar for putting anything there. That record already said this in prose - *whatever lives in
 * this file is part of the public surface of every contract that imports it, and inherits their
 * discipline of freezing* - and nothing computed it; ADR-0105 is the unit that made it executable.
 *
 * **Written out rather than read off the walk**, which is the whole mechanism: `sharedHarnessOf`
 * derives the same set from what the seven files import and refuses any disagreement, and a list
 * derived from that walk could not disagree with it. The consequence is deliberate and is the price
 * of the freeze holding in substance - editing either file below rebinds every published address
 * at once.
 */
const THE_SHARED_FILES = [
  'packages/catalogue/every-contract.ts',
  'packages/catalogue/identifier.ts',
] as const

export const theCatalogue: readonly ContractSource[] = [
  {
    address: NUMBER_PARSE,
    lifecycle: PUBLISHED,
    banner: 'a-copyright-beside-the-marking',
    /**
     * The first word this registry learned about a contract it may no longer edit. ADR-0155.
     *
     * It is declared here rather than in `identity.searchAliases` because it cannot be declared
     * there: `contractSnapshot` freezes `identity` whole and this contract has been published
     * since `d3a5166`, so an alias added to it rebinds an address permanent rule 6 froze for life.
     */
    alsoFoundBy: [
      {
        term: 'string to integer',
        howItIsAsked:
          'This contract declares `int` and not `integer`, and `answers` lets a query shorten a ' +
          'word the catalogue carries and never extend one - so `integer` reaches nothing at all ' +
          'while `int` reaches this contract. Measured at `91b7314` over eight ordinary ways of ' +
          'asking for this function: written with `int`, **nought of the eight are silent**; ' +
          'written with `integer`, **all eight are**. The two spellings are the same request and ' +
          'the longer one is the one a person writing a sentence reaches for.',
        whyThisContract:
          '`parseNumber` is what somebody asking this wants: it takes a string and answers the ' +
          'number it denotes or `null`, and `describeParseFailure` says which of the four ' +
          'refusals it was. What it does **not** promise is the word `integer` itself - it ' +
          'answers `4.5` for `"4.5"` and does not round, truncate or refuse a fraction - and ' +
          '`identity.inputDomain` is where a reader is told so. It is the best answer this ' +
          'catalogue holds and the only one, which is what an alias claims; it is not a claim ' +
          'that the function returns an integer.',
      },
    ],
    folder: 'contracts/typescript/number/parse',
    files: THE_SEVEN_FILES,
    shared: THE_SHARED_FILES,
    module: numberParse as unknown as Readonly<Record<string, unknown>>,
    declares: [numberParse, numberParseCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [{ name: 'outputsAreEqual', reason: SERVED_AS_A_FILE }],
    exports: [
      {
        name: 'parseNumber',
        typeName: 'ParseNumber',
        text: '(input: string) => number | null',
        role: 'the-answer',
      },
      {
        name: 'describeParseFailure',
        typeName: 'DescribeParseFailure',
        text: '(input: string) => ParseFailureReason | null',
        role: 'the-diagnostic',
      },
    ],
    supportingTypes: [],
    caseTables: [
      {
        name: 'edge-cases',
        purpose: 'the inputs this contract settles one at a time, because a grammar has no algebra',
        groups: numberParseCases.edgeCaseGroups,
        cases: numberParseCases.edgeCases,
      },
    ],
    benchmarks: {
      classField: 'sampleClass',
      vocabulary: ACCEPTED_AND_REJECTED,
      profiles: numberParse.benchmarkProfiles,
      /**
       * One profile of the five here, and the only one of this contract whose value is worth less to
       * a reader than the expression: its samples encode to 7.3 kB of which five thousand characters
       * are the digit zero. The other four encode to between 0.3 and 0.5 kB and are carried.
       */
      producedBy: {
        'long-inputs': `['0.' + '1'.repeat(1000), '0'.repeat(5000) + '1', ' '.repeat(1000) + '42']`,
      },
    },
    // The one contract of the catalogue that publishes nothing beyond the shared seven.
    ownDeclarations: [],
    batteries: [
      batteryRecord(NUMBER_PARSE, numberParseBattery),
      batteryRecord(NUMBER_PARSE, numberParseSpec),
    ],
  },

  {
    address: DATE_ADD,
    lifecycle: PUBLISHED,
    banner: 'a-copyright-beside-the-marking',
    /**
     * The one contract of the catalogue whose language moved under it after it was frozen. ADR-0150.
     *
     * It is declared here rather than in `contract.ts` for the reason a use case is, and for a
     * sharper one: every door inside the folder is hashed into the digest, so the contract cannot be
     * the thing that says this.
     */
    againstTheLanguage: [
      {
        whatMoved:
          'Temporal reached TC39 stage 4 in March 2026, is part of ES2026, and Node 26 ships it ' +
          'unflagged. It is the first date and time API the language has ever had, and this ' +
          'contract is the one standing next to it.',
        measurement:
          'Block 4.4 was replayed against Temporal at `ee2d1c1` - all forty-three cases of both ' +
          'tables, the call bridged through `Date.prototype.toTemporalInstant` and ' +
          '`ZonedDateTime.add` under `constrain`. **Thirty-eight agree and five part, for three ' +
          'causes.** The empty duration: Temporal refuses `{}` and `{ days: undefined }`, which ' +
          'this contract answers as the neutral element, and that cause carries three of the five ' +
          'rows. Fields of opposite sign: Temporal rejects `{ months: 1, days: -1 }` outright. And ' +
          'a field carrying `NaN`, which this contract refuses and Temporal answered as zero. ' +
          '**The reading was taken on V8 13.6**, which predates stage 4 and still exposes the ' +
          '`Temporal.TimeZone` and `Temporal.Calendar` the specification removed, so the third ' +
          'cause is a suspicion and not an established divergence: the specification requires a ' +
          'field that is not integral to be rejected, and a runtime that answered zero was wrong ' +
          'rather than different. The first two are the two this contract already knew about.',
        whatItEstablishes:
          'The contract stands, and it is not the news that says so. Temporal does not answer what ' +
          'this contract specifies: the declared signature takes a `Date` and returns a `Date`, ' +
          'Temporal takes neither and offers a replacement type instead, so the bridge the ' +
          'measurement went through had to be built by hand. Permanent rule 7 is therefore cleared ' +
          'again rather than assumed, and `absorbed-by-the-language` is not reached. What would ' +
          'reach it is the language answering block 4.4 of this contract the way `Map.groupBy` ' +
          'answers block 4.4 of `array/group-by@1` - on every case, with nothing bridged.',
      },
    ],
    folder: 'contracts/typescript/date/add',
    files: THE_SEVEN_FILES,
    shared: THE_SHARED_FILES,
    module: dateAdd as unknown as Readonly<Record<string, unknown>>,
    declares: [dateAdd, dateAddCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [{ name: 'outputsAreEqual', reason: SERVED_AS_A_FILE }],
    exports: [
      {
        name: 'addToDate',
        typeName: 'AddToDate',
        text: '(date: Date, duration: Duration) => Date | null',
        role: 'the-answer',
      },
      {
        name: 'describeAddFailure',
        typeName: 'DescribeAddFailure',
        text: '(date: Date, duration: Duration) => AddFailureReason | null',
        role: 'the-diagnostic',
      },
    ],
    supportingTypes: [
      {
        name: 'Duration',
        text: `{
  readonly years?: number | undefined
  readonly months?: number | undefined
  readonly weeks?: number | undefined
  readonly days?: number | undefined
  readonly hours?: number | undefined
  readonly minutes?: number | undefined
  readonly seconds?: number | undefined
  readonly milliseconds?: number | undefined
}`,
      },
    ],
    caseTables: [
      {
        name: 'edge-cases',
        purpose: 'the calls this contract settles, every answer computed by two oracles beforehand',
        groups: dateAddCases.edgeCaseGroups,
        cases: dateAddCases.edgeCases,
      },
      {
        name: 'untyped-callers',
        purpose: 'durations no TypeScript caller can write and every JavaScript caller can',
        groups: dateAddCases.untypedEdgeCaseGroups,
        cases: dateAddCases.untypedEdgeCases,
      },
    ],
    benchmarks: {
      classField: 'sampleClass',
      vocabulary: ACCEPTED_AND_REJECTED,
      profiles: dateAdd.benchmarkProfiles,
    },
    ownDeclarations: [
      // Read by the guard that requires the application order and the field list to agree.
      { name: 'durationFields', verification: 'structural' },
      { name: 'applicationOrder', verification: 'structural' },
      // Read by the ambient-input property, which runs the function under each zone and requires the
      // declared offset. D-05 reddens it, so an implementation really is refused by these.
      {
        name: 'ambientProbeInstants',
        verification: 'executable',
        executableBy: { battery: dateAddBattery.name, guard: ZONE_PROPERTY },
      },
      {
        name: 'ambientTimeZoneProbes',
        verification: 'executable',
        executableBy: { battery: dateAddBattery.name, guard: ZONE_PROPERTY },
      },
      // Both flow into a case and a benchmark sample, so a wrong constant reddens a guard - but no
      // implementation is involved, which is what separates this from `executable`.
      { name: 'LATEST_REPRESENTABLE', verification: 'structural' },
      { name: 'EARLIEST_REPRESENTABLE', verification: 'structural' },
      /**
       * **The debt this field carried is closed, and this is the record of it.** It was the second
       * `one-directional` case in the catalogue and said so in as many words: the only guard over it
       * required every entry to carry a non-empty reason, nothing refused an implementation that
       * called `getMonth`, because the check was the validation pipeline's and the pipeline did not
       * exist. Stage 1 reads the twenty methods off this very declaration and refuses a submission
       * that calls one, so the stratum is now the strongest this schema has.
       *
       * It carries the address rather than the sentence. `executable` names a guard that could be
       * renamed or deleted three units from now, leaving the claim standing and pointing nowhere -
       * which is the failure `found-by-mutation` was given an address to prevent, arriving on the
       * other claim a record makes about its own verification.
       */
      {
        name: 'staticAnalysisRequirements',
        verification: 'executable',
        executableBy: {
          battery: validationStageOne.name,
          guard: 'an-implementation-that-calls-a-forbidden-method-is-refused',
        },
      },
    ],
    batteries: [
      batteryRecord(DATE_ADD, dateAddBattery),
      batteryRecord(DATE_ADD, dateAddSpec),
      machineryRecord(validationStageOne),
    ],
  },

  {
    address: GROUP_BY,
    /**
     * The one contract of the catalogue that carries a retirement, and it is the retirement that
     * happens *before* publication. Read from its own `catalogueAdmission` rather than transcribed.
     */
    lifecycle: {
      state: 'never-published',
      decidedAgainst: groupBy.catalogueAdmission.decidedAgainst,
      measurement: groupBy.catalogueAdmission.measurement,
      keptAs: groupBy.catalogueAdmission.keptAs,
    },
    /**
     * The one contract of the catalogue whose copied file carries the current banner, and it can
     * because it is the one the ledger binds nothing for. ADR-0159.
     *
     * It is not a special case made for it: the rule is that a contract not yet published carries
     * `THE_CURRENT_BANNER`, and this contract has never been published. What it buys is that the
     * second branch of `licenceHeaderOf` has an instance from the day it exists, so
     * `every-file-the-installer-copies-is-marked-mit-0` is exercised on both forms rather than on one
     * and a branch nothing reaches.
     */
    banner: 'the-marking-alone',
    folder: 'contracts/typescript/array/group-by',
    // The nine `contractAnatomy` records: the seven, plus the two this contract invented.
    files: [...THE_SEVEN_FILES, 'language.test.ts', 'outcome.ts'],
    shared: THE_SHARED_FILES,
    module: groupBy as unknown as Readonly<Record<string, unknown>>,
    declares: [groupBy, groupByCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [
      { name: 'outputsAreEqual', reason: SERVED_AS_A_FILE },
      {
        name: 'THE_KEY_FUNCTION_ERROR',
        reason:
          'the error object the propagation cases are settled against. What the table claims is ' +
          'that this very object leaves `groupBy` unwrapped, and object identity is not a value a ' +
          'record can carry - so the claim lives entirely in the executable half, beside the ' +
          'comparison that makes it',
      },
    ],
    exports: [
      {
        name: 'groupBy',
        typeName: 'GroupBy',
        text: `<T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
) => Map<K, T[]>`,
        role: 'the-answer',
      },
    ],
    supportingTypes: [],
    caseTables: [
      {
        name: 'edge-cases',
        purpose: 'the groupings this contract settles, every answer computed against Map.groupBy',
        groups: groupByCases.edgeCaseGroups,
        cases: groupByCases.edgeCases,
      },
      {
        name: 'untyped-callers',
        purpose: 'inputs no TypeScript caller can write and every JavaScript caller can',
        groups: groupByCases.untypedCallerCaseGroups,
        cases: groupByCases.untypedCallerCases,
      },
    ],
    benchmarks: {
      classField: 'shape',
      vocabulary: [
        { name: 'single-group', meaning: 'exactly one group, however many elements' },
        { name: 'one-group-per-element', meaning: 'as many groups as elements' },
        { name: 'few-large-groups', meaning: 'between the two, closer to the single-group end' },
        {
          name: 'many-small-groups',
          meaning: 'between the two, closer to the one-group-per-element end',
        },
        { name: 'empty', meaning: 'no elements at all' },
      ],
      profiles: groupBy.benchmarkProfiles,
      /**
       * Five of the six, and this contract is why the arm exists at all: three of these encode to
       * 1.73 MB each, one to 100.9 kB and one to 14.1 kB, against 0.4 kB for `empty`, which is
       * carried. Its record was 5.22 MB and 99.2 per cent block 4.5 before this map existed.
       *
       * **Two entries hold the same text, and that is the residual gap the transcription guard
       * cannot see.** `one-group-per-element` and `single-group` genuinely draw the same three
       * ranges and differ only in the key function, so if one of them became literal tomorrow the
       * other would keep the text alive in `contract.ts` and the guard would stay green. It is the
       * only instance in the catalogue, it is named here rather than left for a reader to find, and
       * it is why `benchmarks.profiles[].samples.producedBy` is classified `one-directional`.
       */
      producedBy: {
        'one-group-per-element': '[range(10), range(1_000), range(50_000)]',
        'single-group': '[range(10), range(1_000), range(50_000)]',
        'few-large-groups': '[range(1_000), range(50_000)]',
        'many-small-groups': '[range(60), range(3_000)]',
        'string-keys': '[range(400).map((n) => String(n * 3))]',
      },
    },
    ownDeclarations: [
      // Prose. Nothing imports them, so nothing refuses a wrong value.
      { name: 'returnsAMap', verification: 'documentary' },
      { name: 'keyEquality', verification: 'documentary' },
      { name: 'inputIsReadBy', verification: 'documentary' },
      /**
       * **Reclassified from `executable`, and the mechanism that required an address is what found
       * it.** Two guards read this declaration - one requires every rule to carry a statement, the
       * other requires the kinds to partition as the contract claims - and neither runs an
       * implementation against it. What the obligations are tested by is the properties, which read
       * the key functions rather than these rules. So the stratum is the one that describes a guard
       * over a declaration's own shape, and the stronger word was a word.
       */
      { name: 'keyFunctionRules', verification: 'structural' },
      // Five functions, run over every sample by `profiles.test.ts`. The names are data and the
      // bodies are not: they encode as the marker this registry uses for what it serves as a file.
      {
        name: 'profileKeyFunctions',
        verification: 'executable',
        executableBy: { battery: groupByBattery.name, guard: A_PROFILE_KEEPS_ITS_SHAPE },
      },
    ],
    batteries: [batteryRecord(GROUP_BY, groupByBattery), batteryRecord(GROUP_BY, groupBySpec)],
  },

  {
    address: LEVENSHTEIN,
    lifecycle: PUBLISHED,
    banner: 'a-copyright-beside-the-marking',
    folder: 'contracts/typescript/string/levenshtein',
    files: THE_SEVEN_FILES,
    shared: THE_SHARED_FILES,
    module: levenshtein as unknown as Readonly<Record<string, unknown>>,
    declares: [levenshtein, levenshteinCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [{ name: 'outputsAreEqual', reason: SERVED_AS_A_FILE }],
    exports: [
      {
        name: 'levenshtein',
        typeName: 'Levenshtein',
        text: '(a: string, b: string) => number',
        role: 'the-answer',
      },
    ],
    supportingTypes: [],
    caseTables: [
      {
        name: 'edge-cases',
        purpose: 'the region no axiom reaches: the arithmetic anchors, and the unit an edit counts in',
        groups: levenshteinCases.edgeCaseGroups,
        cases: levenshteinCases.edgeCases,
      },
    ],
    benchmarks: {
      classField: 'distanceClass',
      vocabulary: [
        { name: 'zero', meaning: 'the two strings are identical, so the diagonal is free' },
        { name: 'one-edit', meaning: 'exactly one edit apart, where a banded implementation stops early' },
        { name: 'the-whole-of-one-side', meaning: 'one side is empty, so the answer is the other length' },
        { name: 'far', meaning: 'more than a quarter of the longer side, where no band helps' },
      ],
      profiles: levenshtein.benchmarkProfiles,
      // Every profile here produces at least one sample with `wordOfLength` or `repeated`, and every
      // one of them is carried anyway: they encode to between 0.9 and 3.1 kB, so the value tells a
      // reader more than the call would. Producing a sample and pointing at it are two different
      // questions, and this contract is where they come apart.
    },
    ownDeclarations: [
      // Prose, imported by nothing. The decision they record is real; no guard refuses a wrong one.
      { name: 'countedIn', verification: 'documentary' },
      { name: 'comparedAsWritten', verification: 'documentary' },
      // `properties.test.ts` refuses an axiom declared with no property answering it.
      { name: 'metricAxioms', verification: 'structural' },
    ],
    batteries: [
      batteryRecord(LEVENSHTEIN, levenshteinBattery),
      batteryRecord(LEVENSHTEIN, levenshteinSpec),
    ],
  },

  {
    address: SLUGIFY,
    lifecycle: PUBLISHED,
    banner: 'a-copyright-beside-the-marking',
    /**
     * Four jobs, chosen because they carry four different warnings and not because four is a number.
     *
     * The warning is what a use case is worth reading for, so two jobs that end in the same one are
     * one job written twice. A fifth was drafted and dropped rather than kept: a filename on a
     * case-insensitive file system, which `inputDomain` already refuses in as many words - a use case
     * arguing against the contract's own domain would be the page contradicting itself two sections
     * apart.
     *
     * **Four jobs in four languages, and the third one used to be a second French.** The 27 settled
     * cases of this contract reach Japanese, Russian, Arabic, Hindi, Vietnamese, Greek, Turkish and
     * Norwegian; these four were written in one sitting by somebody whose own language is French, and
     * two of them were French. Nothing was wrong with either example - the set was narrower than what
     * the contract settles, which is a claim a reader takes from it without being told. `Kraków`
     * shows exactly what this slot needs, the spaces, the case and the fold, and shows nothing the
     * job above it already shows. ADR-0120.
     *
     * They are declared here and not in `contract.ts`, and that is not tidiness: `contractSnapshot`
     * hashes the seven files, so a published contract cannot gain a byte in its own folder. ADR-0118.
     */
    useCases: [
      {
        name: 'A URL for an article title',
        situation:
          'The common job: somebody types a headline, and the site needs a path segment for it.',
        caveat:
          'Store the slug beside the article rather than recomputing it on read. A title corrected ' +
          'for a typo answers a different slug, and every link to the old one is then broken by an ' +
          'edit nobody thought was a move.',
        text: 'Crème Brûlée, 12 façons',
        expected: 'creme-brulee-12-facons',
      },
      {
        name: 'An anchor for a heading',
        situation:
          'Fragment identifiers for a table of contents built from the headings of a document.',
        caveat:
          'Two headings can slug alike, and this function will not number the repeats for you. A ' +
          'document that allows a heading to occur twice has to disambiguate them itself, because ' +
          'the answer here depends on one input and cannot know what else is on the page.',
        text: 'What NFKC unifies',
        expected: 'what-nfkc-unifies',
      },
      {
        name: 'A tag typed by hand',
        situation:
          'Normalising labels, so that two people who typed the same tag differently land on one tag.',
        caveat:
          'Good for grouping and wrong for identity. `C++` and `C#` both answer `c`, so a tag store ' +
          'keyed on the slug alone silently merges them: keep the text the user typed as well, and ' +
          'let the slug decide only what sits together.',
        text: '  Kraków  ',
        expected: 'krakow',
      },
      {
        name: 'A catalogue in several scripts',
        situation: 'Product names in more than one writing system, each needing a readable address.',
        caveat:
          'This is the reason to prefer this contract over an ASCII slugifier, and it is also the ' +
          'reason to check what your URLs are for: the answer is a valid path segment and is not ' +
          'ASCII. If something downstream needs Latin letters, romanise first and slugify the result.',
        text: '日本語テキスト',
        expected: '日本語テキスト',
      },
    ],
    folder: 'contracts/typescript/string/slugify',
    files: THE_SEVEN_FILES,
    shared: THE_SHARED_FILES,
    module: slugify as unknown as Readonly<Record<string, unknown>>,
    declares: [slugify, slugifyCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [{ name: 'outputsAreEqual', reason: SERVED_AS_A_FILE }],
    exports: [
      {
        name: 'slugify',
        typeName: 'Slugify',
        text: '(text: string) => string',
        role: 'the-answer',
      },
    ],
    supportingTypes: [],
    caseTables: [
      {
        name: 'edge-cases',
        purpose: 'the answers this contract argues for, having no oracle of any kind to appeal to',
        groups: slugifyCases.edgeCaseGroups,
        cases: slugifyCases.edgeCases,
      },
    ],
    benchmarks: {
      classField: 'retention',
      vocabulary: [
        { name: 'all', meaning: 'every code point survives: the text is already a slug' },
        { name: 'most', meaning: 'more than half survives, where the fold does most of its work' },
        { name: 'few', meaning: 'less than half survives, where the boundary logic dominates' },
        { name: 'none', meaning: 'nothing survives, and the answer is the empty slug' },
      ],
      profiles: slugify.benchmarkProfiles,
    },
    ownDeclarations: [
      // Prose and tables imported by nothing. `ecosystem` is a measurement of four libraries this
      // repository takes no dependency on, so it is not replayable here at all.
      { name: 'ecosystem', verification: 'documentary' },
      { name: 'composeInsteadOfConfiguring', verification: 'documentary' },
      { name: 'lossiness', verification: 'documentary' },
      // `properties.test.ts` refuses a step published with no property answering it.
      { name: 'theRule', verification: 'structural' },
      /**
       * GS-11, which is why this stratum exists. Every property asks whether an answer falls outside
       * the declared alphabet; nothing asks whether the alphabet is wider than the answers need, so
       * widening it is invisible and the mutant survives.
       */
      { name: 'outputAlphabet', verification: 'one-directional' },
    ],
    batteries: [batteryRecord(SLUGIFY, slugifyBattery), batteryRecord(SLUGIFY, slugifySpec)],
  },

  {
    address: ROUND,
    lifecycle: PUBLISHED,
    banner: 'a-copyright-beside-the-marking',
    folder: 'contracts/typescript/number/round',
    /**
     * The sixth contract, published by ADR-0144.
     *
     * The eight `contractAnatomy` records: the seven, plus the language suite this contract
     * invented. `array/group-by@1` has the same shape and two extras; the constant's own comment
     * says an extra file is the contract's own.
     */
    files: [...THE_SEVEN_FILES, 'language.test.ts'],
    shared: THE_SHARED_FILES,
    module: round as unknown as Readonly<Record<string, unknown>>,
    declares: [round, roundCases] as unknown as Readonly<Record<string, unknown>>[],
    notCarried: [{ name: 'outputsAreEqual', reason: SERVED_AS_A_FILE }],
    exports: [
      {
        name: 'round',
        typeName: 'Round',
        text: '(value: number, places: number) => number | null',
        role: 'the-answer',
      },
      {
        name: 'describeRoundFailure',
        typeName: 'DescribeRoundFailure',
        text: '(value: number, places: number) => RoundFailureReason | null',
        role: 'the-diagnostic',
      },
    ],
    supportingTypes: [],
    caseTables: [
      {
        name: 'edge-cases',
        purpose:
          'the calls this contract settles, every answer computed in integer arithmetic beforehand',
        groups: roundCases.edgeCaseGroups,
        cases: roundCases.edgeCases,
      },
    ],
    benchmarks: {
      classField: 'roundingClass',
      vocabulary: [
        { name: 'already-exact', meaning: 'the value carries no more decimals than were asked for' },
        { name: 'at-a-tie', meaning: 'the value sits exactly on a half, where the rule is the answer' },
        { name: 'shortened', meaning: 'digits are dropped and a carry may run' },
        { name: 'refused', meaning: 'every sample is refused, which is a different path' },
      ],
      profiles: round.benchmarkProfiles,
      // Every sample here is a pair of small numbers, so the whole of block 4.5 encodes to under a
      // kilobyte and the value tells a reader more than the call would.
    },
    ownDeclarations: [
      /**
       * The population every figure in `theTraps` is a count over, read by two files for two
       * purposes: `language.test.ts` replays the spellings across it, and `properties.test.ts`
       * bounds its thousandth arbitrary by it. RS-13 narrows it and three guards redden.
       */
      {
        name: 'THE_SWEEP',
        verification: 'executable',
        executableBy: {
          battery: roundSpec.name,
          guard: 'the-stored-double-and-not-the-written-decimal-over-the-sweep',
        },
      },
      /**
       * The three spellings this contract parts from, with the rows and the count that say where.
       * The guard runs each spelling rather than reading the sentence beside it, so a figure that
       * drifts is a red - RS-11 moves one by a round number and RS-12 adds a row on which the
       * spelling is right.
       */
      {
        name: 'theTraps',
        verification: 'executable',
        executableBy: {
          battery: roundSpec.name,
          guard: 'the-stored-double-and-not-the-written-decimal-parts-from-this-contract',
        },
      },
    ],
    batteries: [batteryRecord(ROUND, roundBattery), batteryRecord(ROUND, roundSpec)],
  },
]

/**
 * The catalogue as rows for a parameterised guard, each with a kebab-case slug of its name.
 *
 * The slug is not decoration. `mutation/run.ts` refuses two guards of one contract answering to one
 * identifier, because attribution addresses a guard by its identifier and would read each of them as
 * reddening the others - and a guard written with `it.each` over this list hands every instance the
 * same name. Measured when the catalogue held five: the storage battery would not calibrate, with 28
 * identifiers of this folder addressing five guards apiece.
 *
 * A contract's own suite never needs this, because a contract's suite is one contract. This folder is
 * the first place in the repository where one file guards all of them, and the slug is what makes
 * each instance an address rather than one name shared by the whole catalogue.
 */
export const eachContract = theCatalogue.map(
  (source) => [source.address.name.replaceAll('/', '-'), source] as const,
)
