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
// produced three entry shapes with no field in common beyond `provenance` and `rationale`, which are
// the two that live here.
// ---------------------------------------------------------------------------

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
