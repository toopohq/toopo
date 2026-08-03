/**
 * The five contracts of the catalogue, described to the serialiser.
 *
 * What is here is everything the builder cannot read from a module, and nothing else. Three kinds of
 * thing qualify, and each one is guarded rather than trusted.
 *
 * A *declared type* is not a value, so nothing at run time can read one. The texts below are
 * transcribed from `contract.ts` and `against-the-five.test.ts` requires each one to occur there,
 * whitespace normalised. A signature is the first thing a reader of a contract page looks at, so it
 * has to be in the record; being in the record, it has to be checkable.
 *
 * A *profile vocabulary* is a union type, so the same applies. The guard is different because the
 * data is: every class a profile uses must be declared here, and every class declared here must be
 * used by a profile.
 *
 * A *table's purpose* and an *own declaration's stratum* are judgements about a contract, made once,
 * in public. The stratum was measured rather than assumed - by reading which guard imports which
 * declaration - and the measurement is recorded beside each entry that is not obvious.
 */

import type { BatteryRecord } from './evidence.js'
import type { ContractSource } from './serialise.js'
import { SERVED_AS_A_FILE } from './serialise.js'
import type { ContractAddress } from './address.js'
import type { Lifecycle } from './contract-record.js'

import * as numberParse from '../contracts/number/parse/contract.js'
import * as numberParseCases from '../contracts/number/parse/edge-cases.js'
import * as dateAdd from '../contracts/date/add/contract.js'
import * as dateAddCases from '../contracts/date/add/edge-cases.js'
import * as groupBy from '../contracts/array/group-by/contract.js'
import * as groupByCases from '../contracts/array/group-by/edge-cases.js'
import * as levenshtein from '../contracts/string/levenshtein/contract.js'
import * as levenshteinCases from '../contracts/string/levenshtein/edge-cases.js'
import * as slugify from '../contracts/string/slugify/contract.js'
import * as slugifyCases from '../contracts/string/slugify/edge-cases.js'

import { battery as numberParseBattery } from '../mutation/number-parse.battery.js'
import { battery as numberParseSpec } from '../mutation/number-parse-spec.battery.js'
import { battery as dateAddBattery } from '../mutation/date-add.battery.js'
import { battery as dateAddSpec } from '../mutation/date-add-spec.battery.js'
import { battery as groupByBattery } from '../mutation/array-group-by.battery.js'
import { battery as groupBySpec } from '../mutation/array-group-by-spec.battery.js'
import { battery as levenshteinBattery } from '../mutation/string-levenshtein.battery.js'
import { battery as levenshteinSpec } from '../mutation/string-levenshtein-spec.battery.js'
import { battery as slugifyBattery } from '../mutation/string-slugify.battery.js'
import { battery as slugifySpec } from '../mutation/string-slugify-spec.battery.js'

const addressOf = (name: string): ContractAddress => ({ language: 'typescript', name, major: 1 })

const NUMBER_PARSE = addressOf('number/parse')
const DATE_ADD = addressOf('date/add')
const GROUP_BY = addressOf('array/group-by')
const LEVENSHTEIN = addressOf('string/levenshtein')
const SLUGIFY = addressOf('string/slugify')

const NOT_YET_PUBLISHED: Lifecycle = { state: 'not-yet-published' }

/** Reduce a battery to what makes a citation resolvable. Nothing else of it is registry data. */
const batteryRecord = (
  contract: ContractAddress,
  battery: { readonly name: string; readonly mutants: readonly { readonly id: string }[] },
): BatteryRecord => ({
  name: battery.name,
  contract,
  mutants: battery.mutants.map((mutant) => mutant.id),
})

const ACCEPTED_AND_REJECTED = [
  { name: 'accepted', meaning: 'every sample of the profile is answered rather than refused' },
  { name: 'rejected', meaning: 'every sample of the profile is refused, which is a different path' },
]

export const theFive: readonly ContractSource[] = [
  {
    address: NUMBER_PARSE,
    lifecycle: NOT_YET_PUBLISHED,
    folder: 'contracts/number/parse',
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
        cases: numberParseCases.edgeCases,
      },
    ],
    benchmarks: {
      classField: 'sampleClass',
      vocabulary: ACCEPTED_AND_REJECTED,
      profiles: numberParse.benchmarkProfiles,
    },
    // The only contract of the five that publishes nothing beyond the shared seven.
    ownDeclarations: [],
    batteries: [
      batteryRecord(NUMBER_PARSE, numberParseBattery),
      batteryRecord(NUMBER_PARSE, numberParseSpec),
    ],
  },

  {
    address: DATE_ADD,
    lifecycle: NOT_YET_PUBLISHED,
    folder: 'contracts/date/add',
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
        cases: dateAddCases.edgeCases,
      },
      {
        name: 'untyped-callers',
        purpose: 'durations no TypeScript caller can write and every JavaScript caller can',
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
      { name: 'ambientProbeInstants', verification: 'executable' },
      { name: 'ambientTimeZoneProbes', verification: 'executable' },
      // Both flow into a case and a benchmark sample, so a wrong constant reddens a guard - but no
      // implementation is involved, which is what separates this from `executable`.
      { name: 'LATEST_REPRESENTABLE', verification: 'structural' },
      { name: 'EARLIEST_REPRESENTABLE', verification: 'structural' },
      /**
       * The second `one-directional` case in the catalogue, and it is the same shape as GS-11. The
       * only guard over it requires every entry to carry a non-empty reason; nothing refuses an
       * implementation that calls `getMonth`, because the check is the validation pipeline's and the
       * pipeline does not exist. The declaration claims more than any guard here keeps.
       */
      { name: 'staticAnalysisRequirements', verification: 'one-directional' },
    ],
    batteries: [batteryRecord(DATE_ADD, dateAddBattery), batteryRecord(DATE_ADD, dateAddSpec)],
  },

  {
    address: GROUP_BY,
    /**
     * The one contract of the five that carries a retirement, and it is the retirement that happens
     * *before* publication. Read from its own `catalogueAdmission` rather than transcribed.
     */
    lifecycle: {
      state: 'never-published',
      decidedAgainst: groupBy.catalogueAdmission.decidedAgainst,
      measurement: groupBy.catalogueAdmission.measurement,
      keptAs: groupBy.catalogueAdmission.keptAs,
    },
    folder: 'contracts/array/group-by',
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
        cases: groupByCases.edgeCases,
      },
      {
        name: 'untyped-callers',
        purpose: 'inputs no TypeScript caller can write and every JavaScript caller can',
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
    },
    ownDeclarations: [
      // Prose. Nothing imports them, so nothing refuses a wrong value.
      { name: 'returnsAMap', verification: 'documentary' },
      { name: 'keyEquality', verification: 'documentary' },
      { name: 'inputIsReadBy', verification: 'documentary' },
      // The obligations are tested unconditionally by a key function that records what happened to
      // it, which is what stops the conditionals from hiding a defect.
      { name: 'keyFunctionRules', verification: 'executable' },
      // Five functions, run over every sample by `profiles.test.ts`. The names are data and the
      // bodies are not: they encode as the marker this registry uses for what it serves as a file.
      { name: 'profileKeyFunctions', verification: 'executable' },
    ],
    batteries: [batteryRecord(GROUP_BY, groupByBattery), batteryRecord(GROUP_BY, groupBySpec)],
  },

  {
    address: LEVENSHTEIN,
    lifecycle: NOT_YET_PUBLISHED,
    folder: 'contracts/string/levenshtein',
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
    lifecycle: NOT_YET_PUBLISHED,
    folder: 'contracts/string/slugify',
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
]
