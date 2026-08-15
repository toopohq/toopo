/**
 * What every contract in this catalogue shares.
 *
 * Read this before adding anything here. ADR-0080 is the bar for putting something in this file, the
 * three things that were measured *not* to belong, and the freeze discipline everything here inherits.
 * ADR-0081 is what a contract folder is. ADR-0017 addresses a case, ADR-0020 shapes a fallible answer,
 * ADR-0021 divides a property from a named case, and ADR-0023 is what `SEARCH_ALIAS_RULE` refuses.
 */

import { expect } from 'vitest'

import type { CaseGroup } from './identifier.js'
import { groupingFaults, isFrozenIdentifier } from './identifier.js'

/** What a reviewer can establish about a contract in front of them, without running it. ADR-0082. */

/** Where a requirement can be settled from: stage 1's reach, a vetted module, or a judgement. ADR-0082. */
export type CheckableFrom = 'the source alone' | 'the module' | 'a reader'

export const contractAnatomy = {
  required: [
    {
      requirement: 'a folder of seven files with fixed names',
      measured: 'five of five. `array/group-by@1` carries nine; the two extras are its own.',
      checkableFrom: 'the source alone',
      // The submission's own file list, which stage 1 is handed before it parses anything.
      because: 'a list of names, and not the content of any of them',
    },
    {
      requirement:
        '`contract.ts` exports exactly seven shared names - identity, targetEnvironments, ' +
        'outputsAreEqual, propertyRuns, universalProperties, BenchmarkProfile, benchmarkProfiles',
      measured:
        'five of five, and no other export is carried by more than two of them: failureReasons, ' +
        'couplingRule and BenchmarkSample sit at two, everything else at one.',
      checkableFrom: 'the source alone',
      because:
        'which names a module exports is syntax. What each one is worth is not, and this ' +
        'requirement does not ask',
    },
    {
      requirement:
        '`identity` carries name, major, exportName, summary, description, inputDomain and ' +
        'searchAliases',
      measured:
        'five of five for those seven. `relationToTheLanguage` is an eighth field and sits at three ' +
        'of five - missing from exactly the two contracts that also owe the divergence replay below. ' +
        'One debt with two symptoms, and the reason it is a debt is in the project specification.',
      checkableFrom: 'the module',
      because:
        'carrying a field is a property of the value. All five write an object literal and a reader ' +
        'of syntax could see its keys, but a contract that computed its identity would satisfy the ' +
        'requirement and defeat the reader - so the source settles it only under a stricter rule ' +
        'than the one written here',
    },
    {
      requirement:
        'a named signature type, checked with `toEqualTypeOf` and never with `toMatchTypeOf`',
      measured: 'five of five - and `toMatchTypeOf` appears zero times in the catalogue.',
      checkableFrom: 'the source alone',
      because: 'a type alias is a declaration and a matcher is a call, and both are written down',
    },
    {
      requirement:
        '`propertyRuns` is published with the measurement that chose it: three draw counts and ' +
        'three durations',
      measured: 'five of five, three independent measurements behind one shared figure.',
      checkableFrom: 'a reader',
      because:
        'the measurement is a sentence in a comment. A reader of syntax can see that a comment is ' +
        'there; whether it records three real draw counts and three real durations is what the ' +
        'requirement asks, and it is prose',
    },
    {
      requirement:
        '`universalProperties` answers the catalogue\'s four names, in order, each with ' +
        '`applicable` and a non-empty reason, and the inapplicable list is passed explicitly',
      measured: 'five of five - `expectUniversalPropertiesAnswered` is the guard.',
      checkableFrom: 'the module',
      because:
        'the answers are values. `expectUniversalPropertiesAnswered` already establishes this by ' +
        'running the contract, which is exactly the stage this entry belongs to',
    },
    {
      requirement:
        'every case of block 4.4 carries a unique frozen kebab-case `id`, a `provenance` and a ' +
        'non-empty `rationale`, and every guard is addressed by an identifier',
      measured:
        'five of five for the cases; every guard of every battery, none duplicated inside a ' +
        'contract - `calibrate()` refuses both, and no figure is carried here because a count in ' +
        'prose drifts the moment a guard is added and it is the count that then lies.',
      checkableFrom: 'the module',
      because:
        'a case table is a value, and the guard half is stronger still - a guard cannot enumerate ' +
        'the tests vitest collected, so `calibrate()` is what asks it and a run is what answers',
    },
    {
      requirement: '`reference.ts` follows `referenceImplementationRules`',
      measured: 'five of five.',
      checkableFrom: 'a reader',
      because:
        'the two rules do not fall on the same side, and half of a requirement enforced is not a ' +
        'requirement enforced. Stage 1 refuses an implementation that imports its own contract - it ' +
        'reads the specifier - and nothing decides whether an implementation delegates to a built-in ' +
        '*that does the same job*, which is a judgement about what the job is',
    },
    {
      requirement:
        'two batteries, one calibration mutant, arms that are git refs, every cell pinned, and ' +
        'every silent guard declared - out of this battery\'s reach, or an unprobed region with ' +
        'its nature',
      measured: 'five of five, over ten batteries and 365 cells.',
      checkableFrom: 'the module',
      because:
        'a battery is a value, and `run.ts` already refuses an unpinned cell and a silence nobody ' +
        'accounts for. What a reader of syntax could establish is that two files exist',
    },
    {
      requirement: 'a guard whose verdict can depend on elapsed time declares its own timeout',
      measured: 'five of five - the rule and what it rests on are `CLOCK_DEPENDENCE_RULE`.',
      checkableFrom: 'a reader',
      because:
        'which guards *can* depend on elapsed time is the whole content of the rule, and it is a ' +
        'judgement about what a defect could do to a guard. A reader of syntax sees which `it` calls ' +
        'carry a third argument and never which ones need one',
    },
    {
      requirement:
        'a contract that diverges from the ecosystem or from the language replays the divergence ' +
        'on its own table',
      measured:
        'three of five. Which two are in debt, and why it is a debt rather than an exception, are ' +
        'recorded in the project specification.',
      checkableFrom: 'a reader',
      because:
        'whether a contract diverges is a comparison with four libraries this repository takes no ' +
        'dependency on, and with a language that moves. Nothing here can be asked it',
    },
  ],

  dependsOnTheFunction: [
    'a diagnostic export and a coupling property, and only if the function can fail - two of five',
    'the vocabulary of block 4.5: five contracts produced five vocabularies with no overlap, which ' +
      'is exactly why it must never be mutualised',
    'the size of the table and the number of properties, which trade against each other',
    'the second lens: five contracts asked five different questions with it',
  ],

  observedOnce: [
    '`outcome.ts` and `language.test.ts`',
    '`ecosystem`, `composeInsteadOfConfiguring` and `lossiness` as data exports',
    'the `table-blind` lens',
    '`identity-blind` on a monomorphic signature',
    'the central claim published as a list of data - `metricAxioms` in one contract, `theRule` in ' +
      'another. Two shapes, so an observation and not a rule.',
  ],
} as const

// --- Block 4.1 - what a search alias is, and the trap that hides a wrong one ---

/** An alias is a query whose best answer is this contract, never a phrase that relates to it. ADR-0023. */
export const SEARCH_ALIAS_RULE =
  'an alias is a query whose best answer is this contract, never a phrase that relates to it: an ' +
  'alias naming a function, an algorithm or an output shape the contract declares it is not is a ' +
  'lie, and the property that every alias retrieves its own contract cannot see one'

// --- Guards and the clock ---

/**
 * Every guard whose verdict can depend on the clock declares a timeout, or removes the dependency.
 * ADR-0083 carries the audit, and says plainly that nothing executable imports this rule.
 */
export const CLOCK_DEPENDENCE_RULE =
  'a guard whose verdict can depend on elapsed time declares its own timeout; a guard that reads ' +
  'the clock without needing to uses a pinned instant instead'

// --- Block 4.4 - the named and settled edge cases ---

/**
 * The four guards this file owns, and the reason they are named here rather than by each contract.
 * The exception is narrow and ADR-0084 states it: the helper below *is* the guard.
 */
export const CASE_TABLE_IS_ADDRESSED = 'every-case-is-addressed'
export const CASE_TABLE_IS_JUSTIFIED = 'every-case-is-justified'
export const CASE_TABLE_IS_PARTITIONED = 'every-case-is-grouped'
export const UNIVERSAL_PROPERTIES_ARE_ANSWERED = 'universal-properties-answered'

/**
 * Every address of one contract is distinct and is shaped like one, over its cases and its groups.
 * ADR-0084 is why both halves are one assertion; ADR-0012 is why the groups are in the space.
 */
export const expectEveryCaseIsAddressed = (ids: readonly string[]): void => {
  expect({
    malformed: ids.filter((id) => !isFrozenIdentifier(id)),
    duplicated: [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))],
  }).toEqual({ malformed: [], duplicated: [] })
}

/** A table's groups partition its cases, in the order the page will render them. ADR-0084, ADR-0012. */
export const expectEveryCaseIsGrouped = (
  tables: readonly {
    readonly name: string
    readonly groups: readonly CaseGroup[]
    readonly cases: readonly { readonly group: string }[]
  }[],
): void => {
  const faults = tables.flatMap((table) =>
    groupingFaults(
      table.groups,
      table.cases.map((entry) => entry.group),
    ).map((fault) => `${table.name}: ${fault}`),
  )

  expect(faults).toEqual([])
}

/** Where a case of block 4.4 came from, and only half of it is checkable. ADR-0085. */
export type Provenance =
  /** Written with the contract, before any implementation existed. */
  | 'specified'
  /** Added after a mutant survived. The text after the colon names the mutant it kills. */
  | `found-by-mutation:${string}`
  /** Added after a defect reported from real use. The text after the colon identifies the report. */
  | `found-in-the-wild:${string}`

/** Every case of every table publishes the sentence that justifies it. ADR-0084. */
export const expectEveryCaseIsJustified = <Case extends { readonly rationale: string }>(
  cases: readonly Case[],
  describeCase: (entry: Case) => string,
): void => {
  const undocumented = cases.filter((entry) => entry.rationale.trim() === '')

  expect(undocumented.map(describeCase)).toEqual([])
}

// --- Block 4.3 - the universal properties every contract must answer ---

/**
 * The vocabulary is the catalogue's and the verdict is the contract's. ADR-0089 is why all four are
 * answered, always, and why an inapplicable one is recorded with its reason instead of tested.
 */
export const universalPropertyNames = [
  'never mutates its arguments',
  'deterministic',
  'no ambient input',
  'no ambient output',
] as const

export type UniversalPropertyName = (typeof universalPropertyNames)[number]

export type UniversalPropertyDeclaration = {
  readonly name: UniversalPropertyName
  readonly applicable: boolean
  readonly reason: string
}

/**
 * `deterministic` and `no ambient input` are ordered rather than independent, measured on all three
 * prototypes. ADR-0086 carries the measurement and the memoise-last mutant that shows the converse
 * false; ADR-0008 is why this is a whole sentence rather than a clause.
 */
export const DETERMINISM_ORDERING_FINDING =
  'This property is ordered under `no ambient input` rather than independent of it: every mutant ' +
  'measured to redden it reddens that one too, and the memoise-last mutant reddens that one and not ' +
  'this.'

/** ADR-0087 carries the two instances, ten units apart, that make this a rule rather than an anecdote. */
export const GUARD_PERTURBATION_RULE =
  'a guard perturbs the claim, never the object derived from it: perturbing the derived object ' +
  'establishes that the derivation is self-consistent, which is true of a derivation with a hole in it'

/**
 * Why `no ambient output` is inapplicable everywhere, measured once and confirmed twice. ADR-0088.
 *
 * ADR-0008 is why it is a whole sentence: all five contracts open their reason with it.
 */
export const NO_AMBIENT_OUTPUT_FINDING =
  'Not reachable by a property - a test cannot observe a write that happened before it ran, and a ' +
  'correct memoising cache is indistinguishable from a defect by behaviour alone.'

/**
 * The guard each contract's `properties.test.ts` calls, checking three things where the three
 * hand-written versions checked one. ADR-0089.
 */
export const expectUniversalPropertiesAnswered = (
  declared: readonly UniversalPropertyDeclaration[],
  inapplicable: readonly UniversalPropertyName[],
): void => {
  expect(declared.map((property) => property.name)).toEqual([...universalPropertyNames])

  expect(declared.filter((property) => property.reason.trim() === '')).toEqual([])

  expect(
    declared.filter((property) => !property.applicable).map((property) => property.name),
  ).toEqual([...inapplicable])
}
