/**
 * What every contract in this catalogue shares.
 *
 * Read this before adding anything here.
 *
 * Four decisions rule what is below, each with its measurements and its refused alternatives:
 * ADR-0017 for how a case is addressed, ADR-0020 for the shape a fallible contract answers in,
 * ADR-0021 for what a universal property settles and what it leaves to a named case, and ADR-0023 for
 * what `SEARCH_ALIAS_RULE` refuses.
 *
 * Whatever lives in this file is part of the public surface of every contract that imports it, and
 * inherits their discipline of freezing. A published major is frozen for life, so a field added here,
 * a literal removed here or a name changed here is not one edit: it is a breaking change to the whole
 * catalogue at once. Mutualising divides the cost of writing and multiplies the cost of changing -
 * what used to be three independent edits and no rupture becomes one rupture everywhere.
 *
 * The bar for putting something here is therefore not "the contracts repeat it". It is "the contracts
 * repeat it *identically*, and what it says belongs to the registry rather than to any one feature".
 * Three contracts were written by hand with no shared abstraction precisely so that this bar could be
 * applied to evidence instead of to a guess, and every entry below names what the three exemplars
 * showed.
 *
 * What was left out is as much of the answer as what was put in, and it is recorded here so that the
 * next reader does not have to rediscover it.
 *
 * `outputsAreEqual` exists in all three contracts with three different bodies - `Object.is` on a
 * primitive, `Object.is` on a timestamp with a null case, a structural walk over a Map. That is
 * resemblance, not duplication.
 *
 * `propertyRuns` carries the same figure, 1000, in all three, and three independent measurements
 * behind it. Sharing the value would make one contract's declared strength rest on another contract's
 * benchmark.
 *
 * `BenchmarkProfile` looked shared after two contracts and was not. The third had to replace
 * `sampleClass` with a shape vocabulary, because a total function has no use for "accepted" and
 * "rejected". Three exemplars showed the axis, not the abstraction.
 */

import { expect } from 'vitest'

import type { CaseGroup } from './identifier.js'
import { groupingFaults, isFrozenIdentifier } from './identifier.js'

// ---------------------------------------------------------------------------
// The anatomy of a contract folder
//
// A contract is the folder, not one file. `contract.ts` carries identity, signature,
// universal-property applicability and benchmark profiles; block 4.4, the named and settled edge
// cases, has its own file because it is the only block that grows. All of that declares behaviour
// and executes nothing: the reference implementation lives in `reference.ts`, and the executable half
// of each block lives beside it - `signature.test-d.ts` for 4.2, `properties.test.ts` for 4.3,
// `edge-cases.ts` and `edge-cases.test.ts` for 4.4, `profiles.test.ts` for 4.5.
//
// Two conventions of the executable halves are catalogue-wide because all three contracts reached
// them independently.
//
// Block 4.2 is checked with `toEqualTypeOf` rather than `toMatchTypeOf`: a signature that merely
// satisfies the contract's shape is not conformant, it has to be identical.
//
// Block 4.5 is declared as data and nothing in it is executed or measured in this repository. There
// is no reference machine yet, and a number produced on a developer laptop would be dishonest. What
// `profiles.test.ts` does check is that a profile's name is true of its samples: the name is a claim,
// and `number/parse@1` shipped a profile named for one path whose samples took the other with nothing
// to say so.
//
// Block 4.3 declares its own number of draws, as contract data rather than a runner setting. The
// harness is public and executable by anyone, so the number of draws is part of the strength of what
// the contract claims, and leaving it to whoever types the command would make two runs of the same
// contract mean different things. It is a floor, not a value: official validation may draw more,
// nothing may draw fewer. The figure itself stays in each contract, with the measurement that chose
// it.
// ---------------------------------------------------------------------------

/**
 * What a reviewer can establish about a contract in front of them, without running it.
 *
 * It belongs to the catalogue by the criterion `reference-implementation.ts` applies to itself: a
 * requirement a reviewer can check by reading a contract is a rule of the catalogue, and a rule kept
 * in a planning document is a rule the person writing the sixth contract never reads. Every entry
 * was established by reading the five prototypes and carries what that reading measured, rather than
 * what it hoped for.
 *
 * Three strata, and they are not worth the same.
 *
 * `required` was measured present in all five. A sixth contract omitting one is departing from
 * something rather than choosing freely, and the two entries not yet at five say so with a number
 * instead of being quietly promoted.
 *
 * `dependsOnTheFunction` cannot be universal: what it asks for depends on what the function does. A
 * reviewer checks that it is present and justified, never that it holds a particular value.
 *
 * `observedOnce` is the honest stratum. Each entry was proved by exactly one contract, so it is an
 * observation and the most likely thing here to be wrong. It is published rather than promoted,
 * because a rule with one exemplar is a guess wearing a rule's clothes - the mistake three
 * hand-written contracts were spent avoiding.
 *
 * Nothing below is enforced by a test, and that is deliberate. These are established by reading a
 * contract rather than by running one, exactly like `referenceImplementationRules` in
 * `reference-implementation.ts`, so the validation pipeline is what will enforce them - and a
 * requirement that lived only inside that tool would not be part of a catalogue whose whole product
 * is auditability.
 *
 * ---------------------------------------------------------------------------
 * What the pipeline can take, and what stays a reader's
 * ---------------------------------------------------------------------------
 *
 * Every entry carries `checkableFrom`, and the three values are a *measurement of where the frontier
 * falls* rather than a wish list. The criterion is stage 1's own constraint, stated in
 * `packages/validation/source.ts`: **it never imports what it analyses**, because importing is executing and
 * stage 1 is what runs before anything executes. So a requirement is `the source alone` when a syntax
 * tree settles it, and it is `the module` when it needs the *value* of a declaration - which belongs
 * to a stage that has already decided the code is safe to evaluate.
 *
 * The triage, and the count is published because a checklist that claimed to be automatable would be
 * the decorative guard applied to the tool that hunts decorative guards. **Three of the eleven are
 * settled by the source alone; four need the module; four are a reader's and no stage will ever take
 * them.** One entry is split across two of those and is counted with the reader, because half of a
 * requirement enforced is not a requirement enforced: `referenceImplementationRules` has two rules,
 * and stage 1 refuses an implementation that imports its own contract while nothing can decide
 * whether a reference *delegates to a built-in that does the same job*.
 *
 * **What `a reader` means, said plainly.** Not "not yet built". These four ask whether a guard's
 * verdict *can* depend on elapsed time, whether a contract *diverges* from the ecosystem, whether a
 * comment records a real measurement, and whether an implementation does the same job as a built-in.
 * Each is a judgement about intent, and a tool that claimed to settle one would be claiming to check
 * what it cannot.
 *
 * Nothing enforces `checkableFrom` either, and one guard keeps the one half of it that can be kept: a
 * new entry with no verdict is refused, so the next requirement is triaged when it is written rather
 * than left for whoever builds the checker.
 */

/**
 * Where a requirement can be settled from.
 *
 * `the source alone` is stage 1's reach - a syntax tree, no evaluation. `the module` needs the value
 * of a declaration and therefore a stage that has already vetted the code. `a reader` is a judgement
 * no stage takes.
 */
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

// ---------------------------------------------------------------------------
// Block 4.1 - what a search alias is, and the trap that hides a wrong one
// ---------------------------------------------------------------------------

/**
 * **An alias is a query whose best answer is this contract - not a phrase that relates to it.**
 *
 * The distinction is the whole content of the rule, because the second reading admits everything: a
 * phrase relates to a contract whenever anybody can explain the connection, and an explanation is
 * always available. What `identity.searchAliases` declares is the set of things somebody could type
 * and be right to be sent here, and every entry that is merely *about* the feature is a promise the
 * result does not keep.
 *
 * ---------------------------------------------------------------------------
 * The trap, and it is the reason this is written down at all
 * ---------------------------------------------------------------------------
 *
 * **A property that checks that every alias retrieves its own contract first is satisfied by a lying
 * alias.** The alias is in the index, so it matches the contract that declares it by construction -
 * which is what retrieval *means*. `every-declared-alias-finds-its-own-contract-first` therefore
 * establishes that the ranking works and says nothing whatever about whether the phrase should have
 * been declared. Somebody will read that guard as a review of the aliases, because it looks like one;
 * it is a review of the search.
 *
 * Measured: `string/levenshtein@1` declared `string similarity` while its own input domain says *it is
 * not a similarity ratio*, and `string/slugify@1` declared `remove accents from string` while its own
 * description sends that reader to a different function. Both retrieved their own contract first.
 * Eight aliases were removed across the five and the trial was green before and after.
 *
 * ---------------------------------------------------------------------------
 * The review that does catch them, in two filters that are not the same filter
 * ---------------------------------------------------------------------------
 *
 * **Mechanical.** Read the contract's own exclusions - every *it is not X* of the input domain, every
 * *that is a different function* of the description - and refuse any alias that names one. It needs no
 * judgement and it found five of the eight: `string similarity`, `damerau levenshtein`, `remove
 * accents from string`, `strip diacritics`, and `offset date`, whose contract refuses time zones and
 * whose word is what a zone offset is called.
 *
 * **A judgement, one alias at a time.** The rest are not contradicted by anything the contract wrote,
 * and they are not one category: *an alias nobody would type costs weight, an alias that promises what
 * we do not do costs trust*. `atoi` is the first - a C function name nobody types looking for
 * JavaScript. `index by` and `array to map` are the second - `indexBy` returns one element per key and
 * a map conversion is one-to-one, and this contract returns groups.
 *
 * **The criterion that decides the next one without a second opinion: could a better answer exist in
 * this catalogue?** For `string similarity` yes, and it is a different function with a different
 * output shape - so the alias is a lie whether or not that contract is ever written. For `how similar
 * are two strings` no: it is a layperson's phrasing of exactly this question, it names no function and
 * no output shape, and nothing better could answer it. Vagueness is not the fault; *naming something
 * we are not* is.
 *
 * **What this does not forbid is naming the built-in or the library a contract is positioned
 * against**, and the line is that the contract must name it too. `parseFloat`, `parseInt`,
 * `Object.groupBy`, `Map.groupBy` and `lodash groupBy` are all argued against by name in their own
 * contract's published prose, which is what makes the alias a service rather than a bait: somebody
 * typing `Map.groupBy` is best answered by *the language ships this now*, and only the contract that
 * declares the alias can say so. `atoi` is out under the same line, because no contract names it.
 *
 * ---------------------------------------------------------------------------
 * An alias is not frozen with the major, and that is what makes the repair cheap
 * ---------------------------------------------------------------------------
 *
 * A case identifier, a guard identifier, a reason literal and a benchmark profile name are all frozen,
 * because each of them is an *address*: an API response cites one, a URL anchors on one, a validation
 * report names one, and an address that changes breaks a link. An alias is none of those. Nobody links
 * to an alias, no answer cites one, and correcting one breaks nobody's code - it is curation, not
 * addressing. So a lying alias is repaired the day it is found, and it does not cost `name@2`.
 *
 * Nothing enforces the rule above, and it is written here in prose rather than dressed as a mechanism.
 * The executable form was looked for: it needs each contract to publish its exclusions as data, which
 * is a new frozen field on five contracts to buy a check that would still refuse the wrong phrases by
 * matching words. It is recorded among the declarations this repository keeps by hand.
 */
export const SEARCH_ALIAS_RULE =
  'an alias is a query whose best answer is this contract, never a phrase that relates to it: an ' +
  'alias naming a function, an algorithm or an output shape the contract declares it is not is a ' +
  'lie, and the property that every alias retrieves its own contract cannot see one'

// ---------------------------------------------------------------------------
// Guards and the clock
// ---------------------------------------------------------------------------

/**
 * Every guard whose verdict can depend on the clock declares a timeout, or removes the dependency.
 *
 * A test framework's default limit is a duration assertion nobody wrote. Measured on
 * `array/group-by@1`: M-18 rebuilds a group array on every insertion, answers correctly on every
 * sample, and takes 5392 ms against the reference's 0.7 ms on the fifty-thousand-element sample.
 * Under vitest's five-second default it failed the block 4.5 shape test - a test that asserts a shape
 * and was silently asserting a duration as well, eight per cent away from flipping with the speed of
 * the machine. A verdict that flips with the speed of the computer is the one thing the mutation
 * instrument exists to prevent, so it would have been pinned as a defect that contract catches.
 *
 * The rule bites where a guard feeds the implementation an input whose size a defect's complexity can
 * act on. Audited across the three prototypes, with the per-guard durations of a full run:
 *
 * Two guards qualify, both in block 4.5, and both now declare a timeout - the shape test of
 * `array/group-by@1`, which groups fifty thousand elements, and the class test of `number/parse@1`,
 * whose `long-inputs` profile carries a five-thousand-character sample. The second was measured
 * rather than assumed, and the first version of the claim was wrong: a nested-quantifier grammar that
 * still accepts those samples costs 0.032 ms against the reference's 0.031 ms. One that rejects them
 * does not terminate on forty characters. The size axis is real; what makes it bite is a defect that
 * refuses, which is precisely what that guard is there to catch.
 *
 * No other guard does. The slowest guard in the whole suite is the time-zone property of
 * `date/add@1`, at 69 ms against a five-second default - seventy times of headroom - and every
 * property draws inputs its arbitraries bound small: arrays of at most twenty-four elements, strings
 * of at most a dozen digits, dates in one range. A quadratic defect on twenty-four elements is five
 * hundred and seventy-six operations.
 *
 * A guard that reads the clock at all, even where its verdict does not depend on the value, uses a
 * pinned instant instead. A rule with an exception it does not name is a sentence.
 */
export const CLOCK_DEPENDENCE_RULE =
  'a guard whose verdict can depend on elapsed time declares its own timeout; a guard that reads ' +
  'the clock without needing to uses a pinned instant instead'

// ---------------------------------------------------------------------------
// Block 4.4 - the named and settled edge cases
//
// Block 4.4 lives in its own `edge-cases.ts`, beside the `edge-cases.test.ts` that executes it, in
// every contract. The other four blocks declare a fixed number of things - an identity, a signature,
// a list of universal properties, a set of benchmark profiles - while this one gains an entry every
// time a defect is found that no existing case caught. Cutting along the block boundary keeps the
// contract's own numbering as the map: a reader looking for 4.4 finds a file named for it.
//
// Each entry is simultaneously an exact test and one line of public documentation. `rationale` is the
// published sentence, and it states a measured fact rather than an opinion.
//
// The tables themselves are not shared and were measured not to be shareable: three contracts
// produced three entry shapes with no field in common beyond `id`, `provenance` and `rationale`,
// which are the three that live here.
// ---------------------------------------------------------------------------

/**
 * How a case is addressed: a name, in kebab-case, unique within the contract, frozen with its major.
 *
 * A **name**, and not a rendering of the case's own data - that distinction is the whole content of
 * this decision. `"1e400" -> overflow` restates the row it addresses, so it can be wrong about it,
 * and block 4.4 makes every case one line of public documentation, where false documentation is
 * worse than none. `overflow-past-the-largest-double` claims nothing about the data, so there is
 * nothing for it to drift from. The published line goes on being rendered from the data; an
 * identifier addresses a case, it does not describe it.
 *
 * A name is also stable under mutation, which is what the instrument needs and what two of the three
 * prototypes did not give it. They titled their guards by rendering the very data a specification
 * battery injects into, so a mutant that changed an expectation reddened a guard under a title the
 * unmutated contract does not contain and left the calibrated one silent. Measured: a hundred guards
 * of `number/parse@1` and eighty-six of `date/add@1` stood declared silent in a block, as an artefact
 * of the apparatus rather than a fact about either contract, because attribution identifies a guard
 * by its title and could not see the one that spoke. `array/group-by@1` carried an explicit title and
 * did not have the problem, which is the exemplar this generalises.
 *
 * The reason that outlives the instrument belongs to the registry rather than to any one contract. An
 * API response that cites a case, a URL anchor on a contract's page, a validation report naming the
 * case a submission failed - each of them needs an address, and an address that changes breaks links.
 * So it is frozen with the major version, under the discipline a reason set already carries: the name
 * is chosen once, and renaming one costs `name@2`.
 *
 * The shape itself is `identifier.ts`, because the registry addresses a case, a guard and a mutant by
 * the same one and cannot import a test framework to find out what it looks like.
 */

/**
 * The four guards this file owns, and the reason they are named here rather than by each contract.
 *
 * A guard carries an identifier - a name, kebab-case, unique within its contract, frozen with its
 * major - and a contract chooses its own. These four are the exception, and the exception is
 * narrow: the helper below *is* the guard. `expectEveryCaseIsAddressed` is one function applied five
 * times, not five guards that resemble each other, so it answers to one name everywhere and a
 * contract cannot rename it locally. Renaming one costs a major on the whole catalogue, which is the
 * discipline everything in this file already carries.
 *
 * `every-case-is-grouped` is the fourth and arrived with the grouping. It is here on exactly the
 * same argument: `groupingFaults` is one function applied to seven tables, and what it says - that
 * a heading has cases under it and a case has a heading over it - belongs to the registry that
 * anchors a URL on both, not to any one feature.
 *
 * The test that a contract has not quietly renamed one is the battery: a pin naming
 * `every-case-is-addressed` on a contract whose guard answers to something else fails to match, and
 * the cell disagrees.
 *
 * Twelve other identifier strings are shared by more than one contract today - `determinism`,
 * `signature-is-the-declared-type`, `every-profile-has-samples` and so on. Those are *not* here, and
 * the difference is the rule this file already states about `outputsAreEqual`: five contracts asking
 * the same question about different data is resemblance, not duplication. Each of them owns its own,
 * and two contracts choosing the same string is a coincidence the pair `(contract, identifier)`
 * absorbs.
 */
export const CASE_TABLE_IS_ADDRESSED = 'every-case-is-addressed'
export const CASE_TABLE_IS_JUSTIFIED = 'every-case-is-justified'
export const CASE_TABLE_IS_PARTITIONED = 'every-case-is-grouped'
export const UNIVERSAL_PROPERTIES_ARE_ANSWERED = 'universal-properties-answered'

/**
 * Every address of one contract is distinct and is shaped like one.
 *
 * Both halves in one assertion, because they are one question - whether these strings can be used as
 * addresses - and a failure has to say which half gave way. `mutation/run.ts` asks the same pair of
 * the *guards* of a contract, for the same reason and with the same shape of identifier.
 *
 * **The space it is asked over is the contract's cases *and* its groups**, because a page renders
 * both as `#id` and a duplicate is a link that silently lands on the wrong element. Widening the
 * question was the repair rather than writing a second guard: it was always *can these strings
 * address something*, and the grouping only added strings. It found two the day it was widened -
 * `exponent` on `number/parse@1` and `normalisation-is-not-applied` on `string/levenshtein@1`, each
 * a group named after a case of its own table.
 *
 * This is not the guard that a contract settles each *input* exactly once. Two contracts carry that
 * one as well and it is theirs, over data this file knows nothing about; a table can legitimately
 * hold two cases about one input, and no two cases may answer to one name.
 */
export const expectEveryCaseIsAddressed = (ids: readonly string[]): void => {
  expect({
    malformed: ids.filter((id) => !isFrozenIdentifier(id)),
    duplicated: [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))],
  }).toEqual({ malformed: [], duplicated: [] })
}

/**
 * A table's groups partition its cases, in the order the page will render them.
 *
 * **What this guards that `serialise.ts` cannot.** The serialiser refuses the same thing at the
 * registry's boundary, from the same `groupingFaults`, and that refusal is reached by the registry's
 * suite. It is not reached by `npm test`, which collects `contracts/` and nothing else - and
 * `npm test` is what a specification battery runs once per injected defect. A mutant that moved a
 * case from one group to another, or emptied a group, would publish a heading over the wrong cases
 * and no column would redden. That is the defect this guard exists for; the rest is tidiness.
 *
 * One call per contract and not one per table, because a guard identifier is unique within a
 * contract and the two contracts carrying two tables would otherwise hold this name twice - the
 * shape `expectEveryCaseIsAddressed` already takes for the same reason. Each fault names its table,
 * so nothing is lost by asking once.
 */
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

/**
 * Where a case of block 4.4 came from. Without it a contract that has been closing its gaps reads
 * exactly like a contract that never had any, and the difference is the whole claim this project
 * makes.
 *
 * Identical in all three prototypes, down to the wording, and about registry bookkeeping rather than
 * about any feature - which is what puts it here rather than in three edge-case tables.
 *
 * No test can check that a declared provenance is true: a sentence about how a case was found is not
 * a property of the case, and none is written, because a guard that cannot fail would be worse than
 * none. One half of it is checkable, and it is checked without any new machinery - a case marked
 * `found-by-mutation:D-07` claims to kill D-07, the mutation battery pins D-07 as killed, and
 * deleting the case turns that column red.
 */
export type Provenance =
  /** Written with the contract, before any implementation existed. */
  | 'specified'
  /** Added after a mutant survived. The text after the colon names the mutant it kills. */
  | `found-by-mutation:${string}`
  /** Added after a defect reported from real use. The text after the colon identifies the report. */
  | `found-in-the-wild:${string}`

/**
 * Every case of every table publishes the sentence that justifies it. The three prototypes each wrote
 * this guard, identically, over tables that have no other field in common; the caller supplies how to
 * name one of its own cases so that the failure still reads in its own vocabulary.
 */
export const expectEveryCaseIsJustified = <Case extends { readonly rationale: string }>(
  cases: readonly Case[],
  describeCase: (entry: Case) => string,
): void => {
  const undocumented = cases.filter((entry) => entry.rationale.trim() === '')

  expect(undocumented.map(describeCase)).toEqual([])
}

// ---------------------------------------------------------------------------
// Block 4.3 - the universal properties every contract must answer
// ---------------------------------------------------------------------------

/**
 * The four properties every contract considers, in the order every contract declares them.
 *
 * The vocabulary is the catalogue's; the verdict is the contract's. A contract says whether each one
 * is applicable to it and why, and the reason is its own measurement - `never mutates its arguments`
 * is unfalsifiable on a string, real on a Date and the most violable property of an array grouper.
 * What is shared is that all four are answered, always, and that a property is only written as a test
 * when it is applicable: one that cannot fail is recorded with its reason instead, so the green count
 * never carries a guard that proves nothing.
 *
 * `no observable side effect` used to be one entry and that was the error: it named two guarantees at
 * once and only one of them is reachable by a property. The split is catalogue-wide because the
 * measurement behind it is - see `NO_AMBIENT_OUTPUT_FINDING`.
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
 * prototypes.
 *
 * The determinism property calls the function twice in a row; the ambient-input property calls it,
 * runs an arbitrary history, and calls it again. Anything that makes two consecutive calls disagree
 * makes two calls with a history between them disagree as well, so every mutant that reddens the
 * first reddens the second - measured, with no exception across three batteries.
 *
 * The converse is false, and the mutant that shows it now exists on each contract: P-21, D-22 and
 * M-22 remember their last answer under a cheap proxy for identity, written on a miss and read on a
 * hit. Two identical consecutive calls read one slot, so determinism compares an answer against
 * itself and stays green; one foreign call in between replaces the slot, which is the only thing the
 * ambient instance can see. Measured, all three redden `no ambient input` and none reddens
 * `deterministic`.
 *
 * Both stay declared. Determinism is red on real mutants - a global-flagged regular expression, an
 * array reversed in place, a Date the implementation moved under itself - so it is not decorative.
 * What it is not is independent, and that is worth publishing rather than leaving a reader to assume
 * two guards where there is one and a half.
 *
 * **A whole sentence, because it lands in prose a contract page prints.** It used to be a clause, and
 * all five contracts composed it as `` `...own first answer. ${this} - X is that mutant here.` `` - so
 * every contract page published a sentence beginning in lower case after a full stop.
 * ADR-0008 carries the register and names the two guards that keep it.
 */
export const DETERMINISM_ORDERING_FINDING =
  'This property is ordered under `no ambient input` rather than independent of it: every mutant ' +
  'measured to redden it reddens that one too, and the memoise-last mutant reddens that one and not ' +
  'this.'

/**
 * A guard perturbs the claim, never the object derived from it.
 *
 * The two instances are ten units apart and share no subject, which is what makes this a rule rather
 * than an anecdote.
 *
 * `number/parse@1` wrote a property over `!result.ok`. The value it perturbed was the one the answer
 * had already been derived into, so the property held for any implementation that derived it
 * consistently - including a wrong one. It tested that a projection was a projection.
 *
 * The registry's storage wrote a guard that perturbed a *snapshot* field and required the digest to
 * move. That establishes only that the digest covers what the projection already holds, which is true
 * of every projection including one with a hole in it. Measured: a mutant that dropped the harness
 * digests out of the projection passed it. Perturbing the *record* asks the question the guard exists
 * for - can this contract change without its digest changing - and the mutant dies.
 *
 * The shape is the same both times. Something is derived, and a guard is written over the derived
 * thing because that is what the code has to hand. What it then proves is that the derivation is
 * self-consistent, which no defect this catalogue cares about would violate. The claim is always
 * upstream of the derivation, and that is where a perturbation has to go in.
 *
 * `expectUniversalPropertiesAnswered` is the same rule, applied once, to one guard: the inapplicable
 * list is passed in rather than computed, because deriving it from the array it checks would compare
 * that array with itself. This is that sentence generalised, after it was needed twice more.
 */
export const GUARD_PERTURBATION_RULE =
  'a guard perturbs the claim, never the object derived from it: perturbing the derived object ' +
  'establishes that the derivation is self-consistent, which is true of a derivation with a hole in it'

/**
 * Why `no ambient output` is inapplicable everywhere, measured once and confirmed twice.
 *
 * A test that snapshots global state inside its own `it` runs after the earlier tests have called the
 * function hundreds of times, so it cannot see a write that already happened: measured on
 * `number/parse@1`, an implementation writing `globalThis.__parseNumberCalls` passes the whole suite.
 * A correct memoising cache passes it too, and should - a cache is not a defect. The guarantee is
 * obtained by static analysis in the validation pipeline, which forbids a feature from reaching global
 * state at all.
 *
 * Published here rather than restated five times, because it is a fact about what a property can
 * observe and not about parsing, dates or grouping. A contract still declares its own entry: this is
 * the reason it is allowed to give, not a declaration it is spared.
 *
 * **A whole sentence, for the reason `DETERMINISM_ORDERING_FINDING` is one.** All five contracts open
 * their `no ambient output` reason with it, so as a clause it opened a paragraph of four contract
 * pages in lower case. This doc block also used to sit sixty lines above the constant it describes,
 * stacked on another constant's, which is how it stayed there while the value under it was wrong.
 */
export const NO_AMBIENT_OUTPUT_FINDING =
  'Not reachable by a property - a test cannot observe a write that happened before it ran, and a ' +
  'correct memoising cache is indistinguishable from a defect by behaviour alone.'

/**
 * The guard each contract's `properties.test.ts` calls, and it checks three things where the three
 * hand-written versions checked one.
 *
 * The versions it replaces asserted only which properties are inapplicable. That leaves two ways to
 * weaken a contract silently: dropping a property from the list altogether, and declaring one with an
 * empty reason. Neither was reachable before, and neither is now.
 *
 * `inapplicable` is passed by the caller rather than derived, because the point of the assertion is
 * that a contract cannot quietly promote an inapplicable property into a passing test, or demote an
 * applicable one to make a failing guard go away. Deriving it from the same array it checks would
 * compare the list against itself.
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
