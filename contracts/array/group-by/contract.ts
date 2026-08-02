/**
 * Contract `array/group-by@1`. The anatomy of a contract folder is the catalogue's and is described
 * in `catalogue/every-contract.ts`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * This contract is total. It answers every array with a Map and never returns `null`, so it
 * publishes no diagnostic and there is no coupling property here. The catalogue's error convention
 * is for fallible functions; a contract that cannot fail declaring a failure reason would be
 * declaring a literal nobody can ever receive.
 *
 * It will not be published. `catalogueAdmission` below carries that decision and the measurement it
 * rests on. It stays in the repository as the third prototype the contract format was settled on -
 * the one that produced what neither of the other two needed.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'array/group-by',
  major: 1,
  exportName: 'groupBy',

  summary:
    'Partition an array into groups by a key computed from each element, keeping the input order ' +
    'everywhere and the key values exactly as the key function returned them.',

  /** Written to answer the natural search query "group array by key javascript". */
  description:
    'Groups the elements of an array by a key in JavaScript and TypeScript, and returns a Map from ' +
    'each key to the elements that produced it, in the order they were first seen. The grouping ' +
    'itself is four lines; what is not four lines is agreeing on what the four lines must answer, ' +
    'and the widely used implementations disagree. Measured on lodash 4.18.1, Ramda 0.32.0, ' +
    'd3-array 3.2.4 and the ES2024 built-ins: given keys first seen in the order "10", "2", "1", ' +
    'lodash, Ramda and Object.groupBy all return the groups as "1", "2", "10", because an object ' +
    'orders integer-like property names ahead of the rest whatever order they were inserted in, ' +
    'while d3 and Map.groupBy keep the order the keys arrived in. Grouping by the numbers 1 and the ' +
    'string "1" gives one group in the first three and two in the last two. Grouping by the key ' +
    '"__proto__" makes Ramda return a group of one where the array had two elements, so an element ' +
    'is silently dropped, and grouping a null input makes lodash answer zero groups instead of ' +
    'refusing. This contract settles all of it and returns a Map: group order is first-occurrence ' +
    'order, order inside a group is input order, a key is whatever the key function returned and ' +
    'is never coerced to a string, and the key function is called exactly once per element.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: grouping a stream, or grouping under a key that
   * is derived asynchronously, has different right answers and is a different contract.
   */
  inputDomain:
    'In-memory arrays that fit in memory, of any element type: rows read from a database or a CSV, ' +
    'items of a cart, events to be bucketed by day, files to be bucketed by extension. The key ' +
    'function is synchronous and is expected to be a pure function of the element it is given. ' +
    'This is not a streaming or asynchronous grouper, not a multi-key or nested grouper - a key ' +
    'function returns one key - and not an aggregator: it partitions, and the caller reduces.',

  /**
   * How this contract stands to the language, replayed rather than argued.
   *
   * `Object.groupBy` and `Map.groupBy` are ES2024. They are absent from this repository's own
   * compilation target (`lib: ["ES2022"]`) and from every runtime older than Node 21, Safari 17.4 or
   * Firefox 119 - and present on the runtimes people are actually on, which is the fact that decided
   * this contract's admission.
   *
   * Against `Map.groupBy` the behavioural content here is nothing at all. Measured on Node 24.15.0
   * by `language.test.ts`, which runs both tables of block 4.4 against it rather than against the
   * reference: all thirty cases answer what this contract requires, including the two that throw and
   * the three that pin the calls the key function receives.
   *
   * Against the implementations people used to reach for, the content is real - an element dropped
   * on a key named `__proto__`, a group order that is silently numeric, two different keys merged
   * into one. That is what this contract settles, and `catalogueAdmission` below records why
   * settling it is not a reason to publish it.
   */
  relationToTheLanguage:
    'ES2024 added Object.groupBy and Map.groupBy. Map.groupBy answers what this contract requires ' +
    'on all thirty cases of block 4.4, replayed by language.test.ts; Object.groupBy disagrees on ' +
    'group order and on key identity, because its result is an object.',

  searchAliases: [
    'group by',
    'groupBy',
    'group array by key',
    'group array by property',
    'group objects by key',
    'group items by field',
    'bucket by key',
    'partition array by key',
    'index by',
    'collect by key',
    'lodash groupBy',
    'Object.groupBy',
    'Map.groupBy',
    'array to map',
  ],
} as const

/**
 * Whether this contract enters the catalogue. It does not, and a reader is owed the reason here
 * rather than in a commit message: a contract that exists and will not be published is otherwise
 * indistinguishable from one nobody has got round to publishing.
 *
 * The measurement that decided it is above and is replayable: `Map.groupBy` answers what this
 * contract requires on all thirty cases of block 4.4, on the runtime the decision was taken on.
 * Permanent rule 7 forbids anything trivial in the catalogue, and a specification of a method the
 * language already ships is exactly that - the TC39 specification is then the contract, and it is
 * more rigorous and more public than this one.
 *
 * This contract offered two arguments in its own defence and both are polyfill arguments rather than
 * contract arguments, which is the distinction worth keeping.
 *
 * "Not available on older runtimes" describes a commodity that is already being resolved, so the
 * argument expires on its own: a contract whose value has an expiry date is a polyfill wearing a
 * specification. The registry does not sell availability.
 *
 * "The widely used implementations disagree" is true - lodash, Ramda, d3 and the two built-ins really
 * do give four different answers, measured, and block 4.4 settles them. But the answer to a
 * disagreement among libraries, once the language has ruled, is to use the language, not to publish a
 * fifth thing a caller now also has to choose between.
 *
 * The rule this generalises to is the catalogue's, not this contract's: the language moves, so the
 * catalogue re-examines itself against it. Clearing rule 7 is not a property a contract acquires once
 * and keeps.
 *
 * What this contract is kept for is the format. It was written third, deliberately unlike the other
 * two - total where they are fallible, generic where they are monomorphic, higher-order where they
 * are closed over their arguments - and it is the only one of the three that produced
 * `keyFunctionRules`, the `ProfileShape` vocabulary that replaced `sampleClass`, and the measurement
 * that a generic signature needs call-site inference checks beside a type-identity assertion. None of
 * that came from the first two, and none of it would have been discovered by writing two more
 * contracts shaped like them.
 */
export const catalogueAdmission = {
  admitted: false,
  decidedAgainst: 'permanent rule 7 - nothing trivial in the catalogue',
  measurement:
    'Map.groupBy answers what this contract requires on all thirty cases of block 4.4, replayed by ' +
    'language.test.ts on Node 24.15.0. Where the language ships the function, the TC39 ' +
    'specification is the contract.',
  keptAs: 'the third prototype the contract format was settled on',
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The declared signature. Every implementation must expose exactly this type; `signature.test-d.ts`
 * fails the suite when an implementation deviates.
 *
 * It is the first generic signature in the catalogue, and both parameters carry weight. `T` is
 * inferred from the array and reaches the key function's first parameter, so a caller writing
 * `groupBy(users, (u) => u.department)` gets `u` typed without an annotation. `K` is inferred from
 * the key function's return type and is *not* constrained: a key may be a number, a boolean, a
 * symbol, an object, anything. Constraining it to `PropertyKey` is the single change that would let
 * an implementation return an object instead of a Map, and it is refused for the reason the return
 * type is: a key coerced to a property name is a different key.
 *
 * `readonly T[]` rather than `T[]`, so that a caller holding a frozen or readonly array can call it.
 * The groups themselves are mutable `T[]`, because they are fresh arrays the caller owns.
 */
export type GroupBy = <T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
) => Map<K, T[]>

/**
 * Why a Map and not `Record<K, T[]>`.
 *
 * Three measurements decided it, all of them on behaviour the contract would otherwise have to
 * declare as something no caller wants.
 *
 * Order. Group order is observable, so it is contract. An object cannot express first-occurrence
 * order: measured, keys first seen as "10", "2", "1" come back as "1", "2", "10" from lodash, from
 * Ramda, from `Object.groupBy` and from a bare object literal, because integer-like property names
 * are enumerated first and in ascending numeric order whatever order they were written in. Choosing
 * the object would force this contract to publish "first-occurrence order, except that keys which
 * look like array indices come first in numeric order" - a rule that exists only to describe an
 * implementation accident.
 *
 * Key identity. Measured, an object merges the number 1 with the string "1", merges -0 with 0, and
 * merges two distinct objects into one group named "[object Object]". A Map merges none of those
 * except -0 with 0, which is the language's own SameValueZero and is settled below.
 *
 * The prototype hole. A bare object accumulator does not merely answer wrongly on a key named
 * `constructor` or `__proto__`: measured, `(accumulator[key] ??= []).push(item)` throws a TypeError
 * on `__proto__`, `constructor`, `toString` and `hasOwnProperty`, because the inherited value is
 * already truthy and is not an array. Defending against it is possible - `Object.create(null)`
 * handles all four, measured - and is also possible to get wrong: Ramda 0.32.0 returns a group of
 * one where the input had two elements under the key `__proto__`. A Map does not have the hole to
 * defend.
 *
 * The cost is real and is stated rather than skipped. The ecosystem's most-used groupers return an
 * object, so a caller moving from lodash rewrites `groups[key]` as `groups.get(key)`, and the result
 * no longer survives `JSON.stringify`. That cost buys the three answers above; the reverse trade
 * buys nothing this contract could publish honestly.
 */
export const returnsAMap = true

/**
 * When two keys are the same key - part of the contract, not an implementation detail.
 *
 * SameValueZero, which is the Map's own comparison and the one both ES2024 built-ins use. Two
 * consequences are settled here rather than discovered by a caller:
 *
 * `NaN` is one key. `NaN === NaN` is false, so an implementation that looks up its groups with
 * `===` or `indexOf` gives every NaN-keyed element a group of its own; under SameValueZero they
 * form a single group. Block 4.4 names it in both directions.
 *
 * `-0` and `0` are one key, and the key the Map ends up holding is `+0`. Measured:
 * `new Map().set(-0, x)` stores `+0`, because `Map.prototype.set` normalises a negative zero key on
 * the way in. This is the exact mirror of `number/parse@1`, where the sign of a negative zero had to
 * be *preserved* in the output and `Object.is` was chosen for that reason. Here the platform erases
 * it in the key position and preserves it in the value position - measured, a group keyed `0` still
 * holds the `-0` element with its sign intact - and the contract publishes both halves rather than
 * letting a caller find out.
 */
export const keyEquality = 'SameValueZero, as Map uses it: NaN equals NaN, and -0 is stored as +0'

/**
 * How the result is compared - part of the contract, not a test detail.
 *
 * Three things are compared, because all three are observable and no single primitive covers them:
 * the group keys in Map iteration order, each group's elements in array order, and the identity of
 * those elements. `Object.is` throughout: for keys it agrees with SameValueZero except on NaN, where
 * it is the comparison a reader expects; for elements it is identity, since this contract copies the
 * array structure and never the elements.
 *
 * Deep equality is deliberately not used. Two distinct objects with the same fields are two
 * different elements here, and an implementation that cloned its input would be conformant under a
 * deep comparison while breaking every caller that expects to find its own objects in the groups.
 */
export const outputsAreEqual = <T, K>(a: Map<K, T[]>, b: Map<K, T[]>): boolean => {
  if (a.size !== b.size) return false

  const left = [...a.entries()]
  const right = [...b.entries()]

  return left.every(([key, group], at) => {
    const [otherKey, otherGroup] = right[at] as [K, T[]]

    if (!Object.is(key, otherKey) || group.length !== otherGroup.length) return false

    return group.every((item, index) => Object.is(item, otherGroup[index]))
  })
}

/**
 * What this contract says about the function it is given.
 *
 * This is the block neither prototype needed, and writing it is the reason this contract was chosen
 * third. `number/parse@1` takes a string and `date/add@1` takes a Date and a plain object; both are
 * closed over their arguments, so "deterministic" and "no ambient input" are statements about the
 * implementation alone. Here a caller supplies half the behaviour, and the naive move - declaring
 * "the key function must be pure" as a precondition and moving on - would quietly weaken every
 * universal property in block 4.3 into an assumption no test can check.
 *
 * The three kinds below exist because the naive move confuses them, and only one of the three is
 * actually a precondition.
 *
 * An `obligation` is something the contract owes the caller about how it uses the function. It
 * assumes nothing and is tested unconditionally, by passing a key function that records what
 * happened to it. These are the load-bearing entries: once "exactly one call per element" is an
 * obligation with a guard on it, an implementation cannot reach ambient state through the key
 * function, because it is only allowed one look - so the conditionals below cannot hide a defect
 * behind the caller's purity.
 *
 * A `conditional` is a universal property that holds when the key function is well behaved. It is
 * still applicable and still tested; what the entry records is that its generators draw pure key
 * functions on purpose, in the same way `date/add@1` records the support its P1 needed.
 *
 * A `precondition` is the residue: a requirement no test can enforce and no implementation can
 * defend against without charging every caller for it. There is exactly one, and it is small.
 */
export const keyFunctionRules = [
  {
    kind: 'obligation',
    name: 'exactly one call per element',
    statement:
      'The key function is called once for each element of the input, and never a second time for ' +
      'the same element. An implementation that asks twice - once to choose the group and once to ' +
      'store the key - answers differently from this one for a key function that is not a function ' +
      'of its element alone, and the difference would be invisible to every other guard here.',
  },
  {
    kind: 'obligation',
    name: 'in ascending index order',
    statement:
      'Calls happen in index order, from 0 upwards. Observable through a key function that records ' +
      'what it was asked, and it is what makes first-occurrence group order meaningful: an ' +
      'implementation that visited the array backwards would produce the reverse group order while ' +
      'satisfying every other statement here.',
  },
  {
    kind: 'obligation',
    name: 'called with the element and its index',
    statement:
      'Each call receives exactly two arguments, `(items[i], i)`, matching Object.groupBy and ' +
      'Map.groupBy, measured. d3.group passes the source array as a third argument and lodash and ' +
      'Ramda pass the element alone; two arguments is the language\'s own choice and the one a ' +
      'caller writing `(item, index) => ...` expects.',
  },
  {
    kind: 'obligation',
    name: 'an exception propagates unchanged',
    statement:
      'If the key function throws, the same error object leaves this function untouched - not ' +
      'wrapped, not swallowed, not converted into an empty group or a null. This contract is total ' +
      'on its own account and stays that way: it has no failure of its own to report, and turning ' +
      'a caller\'s exception into a value would claim a grouping happened when none did. The input ' +
      'is left as it was found.',
  },
  {
    kind: 'conditional',
    name: 'determinism and freedom from ambient input',
    statement:
      'Two calls with the same array and the same key function answer the same thing, and an ' +
      'answer does not depend on the calls made before it - given a key function that is itself a ' +
      'function of its arguments. The properties in block 4.3 draw pure key functions for exactly ' +
      'this reason. The restriction cannot hide an implementation defect, because the obligations ' +
      'above are tested without it: an implementation may look at each element once, so it has no ' +
      'second look through which to smuggle a changing answer.',
  },
  {
    kind: 'precondition',
    name: 'does not add to or remove from the input while it runs',
    statement:
      'The one genuine precondition, and it is not testable. This contract reads its input by ' +
      'iterating it once, so a key function that pushes to the array being grouped is read as it ' +
      'rewrites itself - measured, the appended elements are visited, exactly as they are by ' +
      'Map.groupBy. No implementation can promise anything there without copying the input first, ' +
      'which every caller would pay for on every call to defend against a caller who has already ' +
      'lost. Recorded here rather than tested, for the same reason an inapplicable universal ' +
      'property is recorded rather than written as a passing test.',
  },
] as const

/**
 * How the input is read - contract, because two conformant-looking implementations disagree here in
 * silence.
 *
 * The input is consumed by iterating it, once. The alternative, a counting loop over `length`, is
 * faster and is what lodash does; measured, it is also what makes lodash answer zero groups for a
 * Set and zero groups for `null` rather than refusing either. Iterating gives a Set the right answer
 * and gives `null` a TypeError from the language itself, which is the loud failure the wrong answer
 * was hiding.
 *
 * Two consequences follow and are named in block 4.4. A hole in a sparse array is visited and its
 * element is `undefined` - measured, `Object.groupBy` does the same, while a counting loop guarded
 * by `i in items` skips it. And a non-array iterable passed from untyped JavaScript is grouped
 * correctly rather than answered emptily, even though the signature above declares arrays: the type
 * states the domain the contract is written for, and block 4.4 states what happens outside it, so
 * that no two implementations can disagree there by accident.
 */
export const inputIsReadBy = 'iteration, once, in order'

export const targetEnvironments = ['node', 'browser', 'bun'] as const

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at all
 * is the catalogue's rule; the figure is this contract's, and it was measured here rather than
 * copied from the other two that carry the same 1000.
 *
 * Three runs of this contract's property file at 100, 1000 and 10000 draws cost 16-17 ms, 51-53 ms
 * and 300-327 ms of test time respectively. An order of magnitude over fast-check's default is
 * bought for about 35 ms; the next order costs seven times that to redraw arrays from the same nine
 * key functions.
 */
export const propertyRuns = 1000

/**
 * How this contract answers the four universal properties of the catalogue.
 *
 * `never mutates its arguments` comes back to life here. It was inapplicable on `number/parse@1`,
 * where the single argument is an immutable primitive, and applicable but about one object on
 * `date/add@1`. Here the argument is an array, the thing a JavaScript implementation is most likely
 * to sort, splice or reverse in place on its way to an answer.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: true,
    reason:
      'The most violable property of this contract. Sorting the input by key before walking it is a ' +
      'real implementation strategy and `Array.prototype.sort` sorts in place, so the obvious ' +
      'version of it hands the caller back a reordered array. The property asserts three things: ' +
      'the input holds the same elements in the same order afterwards, no element was itself ' +
      'mutated, and no group is the input array. The third is not implied by the first two - an ' +
      'implementation with a fast path that returns the input array as the single group has ' +
      'mutated nothing yet, and hands the caller a group whose later edits reach back into the ' +
      'array they grouped.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed by M-21, which reverses the input in place: reversal is an ' +
      'involution, so two identical consecutive calls really do answer differently. Conditional on a ' +
      'deterministic key function, which the generators supply - see `keyFunctionRules`, where that ' +
      `restriction is published together with the obligation that stops it from hiding anything. ${DETERMINISM_ORDERING_FINDING} - ` +
      'M-22 is that mutant here.',
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice, and by the same shapes: any state carried between calls makes an ' +
      'answer depend on the calls made before it. The property interleaves a probe with an ' +
      'arbitrary history and requires the probe to answer identically either way. There is no ' +
      'ambient input of the kind `date/add@1` has - this contract reads no clock, no locale and no ' +
      'time zone - so the call history is the only one it can plausibly acquire. A cache consulted ' +
      'first stays invisible to it, measured twice already on `number/parse@1`, and that is ' +
      'recorded rather than papered over - M-15 is the same story here, keyed by length in a Map ' +
      'that is never overwritten, and neither this property nor determinism sees it. M-22 is the ' +
      'witness that belongs to this property alone: one slot rather than a Map, so it keeps ' +
      'advancing, and measured it reddens here while determinism stays green.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason:
      `${NO_AMBIENT_OUTPUT_FINDING}. Confirmed here on a third shape without changing a word of it.`,
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

/**
 * This block could not stay pure data, and that is a finding rather than a shortcut. One of the two
 * arguments of this contract is a function, so a profile that named only its array would leave the
 * expensive half of the call to whoever runs the benchmark - and grouping a thousand rows under one
 * key and under a thousand keys are different measurements of different code paths. The key
 * functions are therefore declared here, by name, as part of the profile.
 *
 * `sampleClass` from the first two contracts does not survive either. It partitioned samples into
 * accepted and rejected, a vocabulary a total function has no use for. What replaces it keeps the
 * same job: a profile's name is a claim about its samples, and `profiles.test.ts` runs the reference
 * over each one and fails when the claim does not hold. Without that, a profile called
 * `one-group-per-element` could quietly be measuring a single group.
 */
export type ProfileShape =
  /** Exactly one group, however many elements: the cheapest possible Map, the most expensive array. */
  | 'single-group'
  /** As many groups as elements: the most expensive Map, the cheapest arrays. */
  | 'one-group-per-element'
  /** Strictly between the two, and closer to the single-group end. */
  | 'few-large-groups'
  /** Strictly between the two, and closer to the one-group-per-element end. */
  | 'many-small-groups'
  /** No elements at all. */
  | 'empty'

/**
 * The key functions the profiles use, named so that a benchmark run and a reader are looking at the
 * same thing. Declared with `unknown` rather than a generic, because a profile is data: it names one
 * concrete function applied to one concrete array, and nothing here is inferred from a call site.
 */
export const profileKeyFunctions = {
  identity: (item: unknown): unknown => item,
  constant: (): string => 'all',
  /** Sixteen buckets, whatever the size of the input. */
  lowFourBits: (item: unknown): number => Number(item) & 0xf,
  /** Buckets of three, so the number of groups grows with the input. */
  everyThird: (item: unknown): number => Math.floor(Number(item) / 3),
  /** Ten buckets, keyed by a string rather than a number. */
  firstCharacter: (item: unknown): string => String(item).slice(0, 1),
} as const

export type ProfileKeyFunction = keyof typeof profileKeyFunctions

export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must produce. A profile that mixes shapes measures neither. */
  readonly shape: ProfileShape
  readonly keyFunction: ProfileKeyFunction
  readonly samples: readonly (readonly unknown[])[]
}

const range = (length: number): readonly number[] => Array.from({ length }, (_, i) => i)

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'one-group-per-element',
    description:
      'Every element has its own key, so the Map grows as fast as the input and every group holds ' +
      'one element. The worst case for an implementation whose per-group cost is not constant.',
    shape: 'one-group-per-element',
    keyFunction: 'identity',
    samples: [range(10), range(1_000), range(50_000)],
  },
  {
    name: 'single-group',
    description:
      'Every element shares one key. The Map does nothing and one array grows to the size of the ' +
      'input, which is where an implementation that copies a group on every insertion becomes ' +
      'quadratic. It is also the shape a fast path is most tempting on.',
    shape: 'single-group',
    keyFunction: 'constant',
    samples: [range(10), range(1_000), range(50_000)],
  },
  {
    name: 'few-large-groups',
    description:
      'Sixteen keys over a large input - bucketing by status, by shard, by day of the fortnight. ' +
      'The dominant shape in real reporting code.',
    shape: 'few-large-groups',
    keyFunction: 'lowFourBits',
    samples: [range(1_000), range(50_000)],
  },
  {
    name: 'many-small-groups',
    description:
      'Groups of three, so the number of keys grows with the input and neither the Map nor the ' +
      'arrays dominate. The shape a Map-returning implementation is least favoured on, which is why ' +
      'it is measured rather than argued about.',
    shape: 'many-small-groups',
    keyFunction: 'everyThird',
    samples: [range(60), range(3_000)],
  },
  {
    name: 'string-keys',
    description:
      'The same few-large-groups shape with keys that are strings rather than numbers, because a ' +
      'Map hashes the two differently and an object would not have the choice.',
    shape: 'few-large-groups',
    keyFunction: 'firstCharacter',
    samples: [range(400).map((n) => String(n * 3))],
  },
  {
    name: 'empty',
    description:
      'The empty array, measured on its own because it is the whole cost of a call that does ' +
      'nothing, and callers in a loop make this call far more often than they expect to.',
    shape: 'empty',
    keyFunction: 'identity',
    samples: [[]],
  },
]
