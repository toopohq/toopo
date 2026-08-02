/**
 * What every contract in this catalogue shares.
 *
 * Read this before adding anything here.
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

// ---------------------------------------------------------------------------
// How a reference implementation is written
// ---------------------------------------------------------------------------

/**
 * A `reference.ts` is the oracle of the registry's differential test, and it is also the one file in
 * this repository that becomes somebody else's code. Its comments say what the function does and why
 * a non-obvious step is there. They do not explain the registry's rules of authorship to a reader who
 * has never heard of the registry, and they never point at a path that will not exist in the codebase
 * the file lands in - which is why the two rules below are stated here and not in the three files
 * they govern.
 *
 * Declared as data, in the shape `date/add@1` already uses for its own static analysis requirements:
 * these are established by reading an implementation rather than by running it, so the validation
 * pipeline is what will enforce them. A requirement that lived only inside that tool would not be part
 * of a contract whose whole product is auditability.
 */
export const referenceImplementationRules = [
  {
    name: 'states its own signature and private types',
    reason:
      'A reference that annotated its export with the contract\'s own type would make the compiler ' +
      'enforce conformance at authoring time and leave `signature.test-d.ts` unable to fail - a ' +
      'guard that proves nothing. An implementation declares what it is; the contract checks it. The ' +
      'same holds for the private types it computes with, for the same reason.',
  },
  {
    name: 'does not delegate to a built-in that does the same job',
    reason:
      'The mutation battery injects its defects into `reference.ts`. A reference that forwards to the ' +
      'runtime has no lines left to inject them into, so the contract\'s verification could no longer ' +
      'be shown to catch anything. Measured on `array/group-by@1`, where `Map.groupBy` would have ' +
      'answered every case of block 4.4 and emptied the battery in the same move.',
  },
] as const

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
 */
const CASE_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Every case of every table of one contract answers to a distinct name, shaped like an address.
 *
 * Both halves in one assertion, because they are one question - whether these strings can be used as
 * addresses - and a failure has to say which half gave way.
 *
 * This is not the guard that a contract settles each *input* exactly once. Two contracts carry that
 * one as well and it is theirs, over data this file knows nothing about; a table can legitimately
 * hold two cases about one input, and no two cases may answer to one name.
 */
export const expectEveryCaseIsAddressed = (ids: readonly string[]): void => {
  expect({
    malformed: ids.filter((id) => !CASE_IDENTIFIER.test(id)),
    duplicated: [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))],
  }).toEqual({ malformed: [], duplicated: [] })
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
 * Why `no ambient output` is inapplicable everywhere, measured once and confirmed twice.
 *
 * A test that snapshots global state inside its own `it` runs after the earlier tests have called the
 * function hundreds of times, so it cannot see a write that already happened: measured on
 * `number/parse@1`, an implementation writing `globalThis.__parseNumberCalls` passes the whole suite.
 * A correct memoising cache passes it too, and should - a cache is not a defect. The guarantee is
 * obtained by static analysis in the validation pipeline, which forbids a feature from reaching global
 * state at all.
 *
 * Published here rather than restated three times, because it is a fact about what a property can
 * observe and not about parsing, dates or grouping. A contract still declares its own entry: this is
 * the reason it is allowed to give, not a declaration it is spared.
 */
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
 */
export const DETERMINISM_ORDERING_FINDING =
  'ordered under `no ambient input` rather than independent of it: every mutant measured to redden ' +
  'this property reddens that one too, and the memoise-last mutant reddens that one and not this'

export const NO_AMBIENT_OUTPUT_FINDING =
  'not reachable by a property - a test cannot observe a write that happened before it ran, and a ' +
  'correct memoising cache is indistinguishable from a defect by behaviour alone'

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
