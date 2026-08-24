/**
 * Contract `object/deep-equal@1`. The anatomy of a contract folder is the catalogue's and is
 * described in `packages/catalogue/every-contract.ts`; this file carries blocks 4.1, 4.2, 4.3 and 4.5.
 *
 * ADR-0158 carries the admission: eleven candidates measured, ten refused with the measurement that
 * refused each, and this one retained because the ecosystem's disagreement is a wrong answer rather
 * than a taste.
 *
 * The function is total. There is no failure channel and no `describe...Failure` beside it, because
 * every value in the declared domain has an answer and the answer is a boolean - the shape
 * `number/round@1` and `number/parse@1` needed and this one does not.
 */

import {
  DETERMINISM_ORDERING_FINDING,
  NO_AMBIENT_OUTPUT_FINDING,
} from '../../../../packages/catalogue/every-contract.js'

// ---------------------------------------------------------------------------
// Block 4.1 - Identity
// ---------------------------------------------------------------------------

export const identity = {
  name: 'object/deep-equal',
  major: 1,
  exportName: 'deepEqual',

  summary:
    'Compare two values by the data they carry rather than by reference, walking into arrays, ' +
    'objects, Map, Set, typed arrays, Date, RegExp and Error, terminating on graphs that return to ' +
    'themselves, and never writing to either argument.',

  /** Written to answer the natural search query "deep equal javascript". */
  description:
    'Answers whether two JavaScript values carry the same data. `===` compares references, and the ' +
    'spelling a caller reaches for instead - comparing two JSON.stringify results - is wrong on ' +
    'seven of nine ordinary pairs: it answers false for {a:1,b:2} against {b:2,a:1}, true for a ' +
    'populated Map against an empty one, true for a Date against its own ISO string, true for -0 ' +
    'against 0, and it throws on a cyclic value and on a BigInt. The cause is one line of the ' +
    'language: Object.keys of a Set is the empty array, so a collection carries its contents where ' +
    'no property walk reaches. Measured on fast-deep-equal 3.1.3, deep-equal 2.2.3, dequal 2.0.3, ' +
    'lodash 4.18.1 and the runtime\'s own util.isDeepStrictEqual, eleven of twenty-eight ordinary ' +
    'pairs are answered differently by at least two of them - and two of those five answer true for ' +
    'new Set([1]) against new Set([2]) and for a populated Map against an empty one, because they ' +
    'walk own properties and a Set has none. The entry point their README sends a caller to for ' +
    'collections answers false for a Set of objects against its own structured clone. This contract ' +
    'settles all of it, and settles two things nothing else does: the comparison does not consume ' +
    'the call stack in proportion to the depth of ordinary structure, and a candidate match inside ' +
    'a collection that fails leaves nothing behind it.',

  /**
   * The input domain the contract is written for. It belongs to the identity because the answers in
   * block 4.4 are only defensible relative to it: the boundary is `structuredClone`'s, which is the
   * platform's own rather than one this catalogue invented, and it is what makes
   * `deepEqual(x, structuredClone(x))` a property rather than a hope.
   */
  inputDomain:
    'The values structuredClone carries: primitives, plain objects, arrays, Map, Set, Date, RegExp, ' +
    'Error, typed arrays, ArrayBuffer, DataView, boxed primitives, and any graph made of them, ' +
    'including one that returns to itself. It is not a schema validator, not a similarity score and ' +
    'not an assertion - it answers and never throws. It does not read into a Promise, a WeakMap, a ' +
    'WeakSet, a WeakRef or a function, because nothing about their contents is observable; two ' +
    'distinct such values are answered false rather than guessed at. It compares prototypes, so an ' +
    'instance of a class and a plain object carrying the same fields are two different things, and ' +
    'a caller who wants them equal wants a different function.',

  /**
   * Optional by ADR-0009, and owed here: `contractAnatomy` requires a contract that answers
   * differently from the language to say so, and this one answers where the language does not answer
   * at all - which is the same obligation arriving from the empty side.
   *
   * The three proposals are named with the date of each one's last movement rather than with its
   * stage alone, because *there is a proposal* and *the language is coming for this* are different
   * sentences and `array/group-by@1` is what this catalogue paid to learn the difference.
   */
  relationToTheLanguage:
    'ECMAScript compares two values structurally nowhere: Object.is and === answer about references, ' +
    'and JSON.stringify is not a comparison. Read on 2026-08-23, three stage 1 proposals touch this ' +
    'and none would answer it. Composites, last moved 2026-08-18, gives value equality to ' +
    'purpose-built frozen string-keyed structures compared with === after interning - it is shallow, ' +
    'cannot hold a cycle and cannot be asked about two objects that already exist. Array Equality, ' +
    'last moved 2021-04-22, is scoped to arrays. Comparisons, last moved 2026-06-11, is about ' +
    'assertion functions and its open question is whether it should cover rich equality comparisons ' +
    'at all; that is the proposal this contract is re-examined against. The runtime\'s ' +
    'util.isDeepStrictEqual is a host\'s assertion helper, absent from the browser, specified ' +
    'nowhere, and the first of six to fall over on depth.',

  /**
   * Declared freely because this contract is not yet published. The window shuts at publication -
   * `contractSnapshot` freezes `identity` whole - and `CLAUDE.md` carries the entry that says so.
   */
  searchAliases: [
    'deep equal',
    'deepEqual',
    'deep compare',
    'compare objects',
    'are two objects equal',
    'object equality',
    'structural equality',
    'compare arrays',
    'deep comparison',
    'isEqual',
    'lodash isEqual',
    'compare nested objects',
    'compare Map',
    'compare Set',
    'value equality',
  ],
} as const

// ---------------------------------------------------------------------------
// Block 4.2 - Signature
// ---------------------------------------------------------------------------

/**
 * The declared signature, and the two stricter-looking forms it was measured against.
 *
 * The argument that chose it was reasoned first and the reasoning was wrong, so what is written here
 * is the measurement. Three candidates were put to `tsc` 7.0.2 under `strict`:
 *
 * `<T>(a: T, b: T) => boolean` does **not** infer `number | string` and compile `deepEqual(1, 'a')`.
 * `T` is inferred from the first argument as the literal type `1` and `"a"` is refused, `TS2345`.
 * What the compiler does instead is worse for the same conclusion: for two object *literals* it
 * infers a union - `{a: number; b?: undefined} | {a?: undefined; b: number}` - and accepts, while for
 * the same two shapes held in declared variables it refuses with `TS2741`. **A signature whose
 * strictness depends on whether the caller wrote a literal is not stricter, it is inconsistently
 * strict**, and no caller can learn its rule.
 *
 * `<T>(a: T, b: NoInfer<T>) => boolean` refuses both of those, and is refused by a property this
 * contract publishes: it accepts `deepEqual(unknownValue, knownValue)` and refuses the same two
 * values in the other order, `TS2345`. `p2-symmetric` says the answer does not depend on the order,
 * and a signature that accepts one order and refuses the other contradicts it. That is the argument
 * `where-a-pattern-stopped-is-not-part-of-it` makes about a case, arriving on the type.
 *
 * So the honest form wins on a measurement, and it is the right one on its own terms too: this
 * function is most often called on values whose type the caller does not know, which is its whole
 * point.
 */
export type DeepEqual = (left: unknown, right: unknown) => boolean

export const targetEnvironments = ['node', 'browser', 'bun'] as const

/**
 * Output equality semantics - part of the contract, not a test detail.
 *
 * `Object.is` on two booleans is `===` on two booleans, and it is written this way because every
 * contract in this catalogue declares how its outputs are compared and a reader comparing two of
 * them should not have to work out whether a different operator means different semantics. Here it
 * does not: there is no `-0` to catch in the *answer*, however much of the contract is about `-0` in
 * the arguments.
 */
export const outputsAreEqual = (a: boolean, b: boolean): boolean => Object.is(a, b)

// ---------------------------------------------------------------------------
// What this contract settles that no implementation measured does
// ---------------------------------------------------------------------------

/**
 * How deep a comparison goes before it stops answering, by population, measured on 2026-08-23 on
 * Node 24.15.0.
 *
 * **Every figure here is an order and not a value, and that is a property of what is being
 * measured.** A stack ceiling depends on what is already on the stack when the reading is taken:
 * `lodash.isEqual` answered 1 874, then 1 953, then 1 464 across three runs of one bisection, a
 * spread of 25 per cent. They are quoted to one significant figure and no finer, and a reading that
 * disagreed with one of them by less than that would not be a disagreement.
 */
export type DepthReading = {
  readonly implementation: string
  /** Deepest chain of plain objects answered, as an order. */
  readonly ordinaryStructure: string
  /** Deepest chain of nested Sets answered, as an order. */
  readonly throughCollections: string
  readonly note: string | null
}

export const theDepthReadings: readonly DepthReading[] = [
  {
    implementation: 'this contract',
    ordinaryStructure: 'at least 1 000 000',
    throughCollections: 'about 1 500',
    note:
      'Ordinary structure is walked on an explicit stack, so its depth costs no call frames at all ' +
      'and the figure is where the probe stopped asking rather than where the walk stopped ' +
      'answering. Nesting through collections costs one frame per level, for the reason the clause ' +
      'below states.',
  },
  {
    implementation: 'dequal 2.0.3',
    ordinaryStructure: 'about 5 000',
    throughCollections: 'about 3 000',
    note:
      'Twice as far as this contract through collections. The clause below is about ordinary ' +
      'structure, and through collections this contract is not the best of the five - which is ' +
      'stated here because a reading that named only where it won would not be a reading.',
  },
  {
    implementation: 'fast-deep-equal/es6 3.1.3',
    ordinaryStructure: 'about 8 000',
    throughCollections: 'one',
    note:
      'The second figure is not a ceiling. It answers false for a Set containing a Set against the ' +
      'same shape, because it tests membership by reference, so the bisection reports the depth at ' +
      'which it stops being right rather than the depth at which it stops answering. Counting it as ' +
      'a ceiling would be a cause nobody measured.',
  },
  {
    implementation: 'lodash 4.18.1',
    ordinaryStructure: 'about 1 500',
    throughCollections: 'about 1 200',
    note: null,
  },
  {
    implementation: 'util.isDeepStrictEqual on Node 24.15.0',
    ordinaryStructure: 'about 1 000',
    throughCollections: 'about 800',
    note:
      'The strictest implementation measured and the first to give up. A thousand-deep structure is ' +
      'a linked list or a parsed tree, not a pathological input.',
  },
]

/**
 * The two things this contract requires that nothing measured provides, each with its bound in the
 * same sentence as its claim.
 *
 * They are declared here rather than left to prose because a clause with no data behind it is a
 * sentence, and this catalogue's whole argument is that a sentence is not a guarantee.
 */
export type Clause = {
  readonly id: string
  readonly claim: string
  /** What the claim does not reach, in the same declaration, so a reader cannot meet one without the other. */
  readonly bound: string
}

export const theClauses: readonly Clause[] = [
  {
    id: 'the-stack-is-not-spent-on-ordinary-depth',
    claim:
      'The comparison does not consume the call stack in proportion to the depth of ordinary ' +
      'structure - objects and arrays - because that walk runs on a stack of its own on the heap.',
    bound:
      'Nesting through collections costs one call frame per level, because a candidate member has ' +
      'to be settled completely before it can be claimed, and no order-insensitive matching avoids ' +
      'that. Measured at about 1 500 levels of nested Set or Map, where dequal reaches about twice ' +
      'as far. The bound is declared so that a caller meets it here rather than in production.',
  },
  {
    id: 'speculation-inside-a-collection-is-taken-back',
    claim:
      'A candidate match inside a Map or a Set that fails leaves nothing behind it. The pairs being ' +
      'compared are a path, entered on the way down and left on the way up, and a speculative walk ' +
      'that fails takes back everything it opened.',
    bound:
      'No implementation measured gets this wrong, so it founds no admission. What it carries ' +
      'instead is `theAuthoringFaults` below: the fault is easy enough that the person who had just ' +
      'enumerated it committed it, and a fifty-four case trial did not see it.',
  },
]

/**
 * The three faults committed while this contract's own walk was being written, kept because they are
 * the evidence for the second clause and for something wider than it.
 *
 * A contract does not only settle where implementations diverge today - it closes the faults a
 * future implementation will make. Most contracts assert that and offer nothing. **One instance is
 * an anecdote. Three, of one shape, committed by the author in the hours after writing the danger
 * down, are a demonstration**, and that rather than the absence of a faulty library is what the
 * second clause is worth.
 *
 * The shape they share is the one worth naming: each is a category enumerated and then missed, and
 * none was found by reading. The first came from asking what a failed candidate leaves behind, the
 * second from asking what a built-in dispatch cannot see, the third from a property whose
 * counter-example was a typed array holding a single zero.
 *
 * **The third is the one that changed the implementation rather than patching it.** Two repairs
 * inside two branches were an anecdote; the third said the branches were the wrong place to be
 * repairing anything, and the answer moved out of them: a branch now settles only what its value
 * carries in a slot, and the own keys are compared once, on the way out, for every kind of value at
 * once. **Two patches were worth an anecdote and three were worth a structure**, and a fourth branch
 * added later inherits the repair instead of needing one.
 */
export type AuthoringFault = {
  readonly id: string
  readonly what: string
  readonly howItWasFound: string
  readonly remedy: string
}

export const theAuthoringFaults: readonly AuthoringFault[] = [
  {
    id: 'a-memo-where-a-path-was-needed',
    what:
      'A candidate match inside a Set that failed left the pair it had tried marked as assumed ' +
      'equal, and nothing removed it. Given { s: Set([{v:1},{v:2}]), also: [{v:1}] } against ' +
      '{ s: Set([{v:2},{v:1}]), also: [{v:2}] } the walk answered true where the answer is false - ' +
      'and answered false when the two keys were declared in the other order.',
    howItWasFound:
      'By asking what a failed candidate leaves behind, not by a test. All four shipped ' +
      'implementations answer this correctly.',
    remedy:
      'The pairs under comparison are a path rather than a memo, and a speculative walk that fails ' +
      'unwinds what it opened.',
  },
  {
    id: 'a-dispatch-that-enumerated-what-the-author-remembered',
    what:
      'The built-in dispatch listed the kinds the author had thought of, and the ones carrying ' +
      'their value in an internal slot have no own property for a key walk to see. Over twelve ' +
      'pairs the walk answered eight wrongly, every one a silent true: new Number(7) against ' +
      'new Number(8), new Boolean(true) against new Boolean(false), Object(1n) against Object(2n), ' +
      'two boxed symbols, two promises, two WeakMaps, two WeakSets and two functions. lodash and ' +
      'util.isDeepStrictEqual answer all twelve correctly.',
    howItWasFound: 'By asking what the dispatch cannot see, not by a test.',
    remedy:
      'The dispatch reads Object.prototype.toString rather than instanceof, because the tag reads ' +
      'the slot where the prototype proves nothing: Object.create(Number.prototype) passes ' +
      'instanceof Number, has no slot, and a walk that trusted the prototype would call valueOf on ' +
      'it and throw.',
  },
  {
    id: 'a-branch-that-answered-for-the-whole-value',
    what:
      'Every built-in branch answered for the value and not for its slot, so a built-in carrying an ' +
      'own property beside its slot compared equal to the same value without one. Measured over ' +
      'eight pairs, the walk answered six wrongly, every one a silent true: a Date, a RegExp, a ' +
      'Set, a Map, an ArrayBuffer and a typed array. lodash gets all eight wrong; ' +
      'util.isDeepStrictEqual gets all eight right.',
    howItWasFound:
      'By p6-a-perturbed-clone-is-not-the-original, whose counter-example was a typed array holding ' +
      'a single zero - and the counter-example was not the fault. Chasing why that one value ' +
      'survived a perturbation is what led to the branches.',
    remedy:
      'The repair left the branches. A branch settles only what its value carries in a slot, and ' +
      'settle compares the own keys once on the way out for every kind of value - so a branch added ' +
      'later inherits it rather than needing its own patch, which is what the first two got.',
  },
]

// ---------------------------------------------------------------------------
// Block 4.3 - Universal property applicability
// ---------------------------------------------------------------------------

/**
 * **Ask of a property set, before anything else: does it separate this function from a constant?**
 *
 * This contract's first five properties - reflexive under a copy, symmetric, reflexive, transitive,
 * and the order of declaration is not read - are **every one of them satisfied by an implementation
 * that answers `true` unconditionally**. Five properties, drawn over a careful alphabet at a
 * thousand runs each, and between them they could not tell `deepEqual` from `() => true`.
 *
 * That is not a defect in any one of them. Each is a real law and each is one-sided, which is what a
 * law about *equality* usually is - and one-sidedness is invisible property by property. It is only
 * visible to the question above, asked of the set.
 *
 * `p6-a-perturbed-clone-is-not-the-original` is what answers it here, and it is the only property of
 * this contract with a `false` expectation. The case table carries the same question one block over,
 * as `answers-both-ways`.
 *
 * **A reader writing an eighth contract meets this here rather than in a record**, because the
 * moment to ask it is while the properties are being written. It is not in
 * `packages/catalogue/every-contract.ts`, where a lesson belonging to every contract would go, for
 * the reason permanent rule 6 gives: that file is frozen into six published digests and cannot gain
 * a byte.
 *
 * It is written as prose and not as a declaration on purpose. A constant nothing reads would be a
 * rule with nothing making it hold, which is the class this repository keeps a list of - and the
 * thing that has to happen is that somebody asks the question, which no value can stand in for.
 */

/**
 * The number of cases every property in this contract is tested on. Why this is contract data at all
 * is the catalogue's rule; the figure is this contract's, and it was measured here.
 *
 * **Three draw counts and three durations, over the four properties together**: 100 draws in 10 ms,
 * 1 000 in 38 ms, 10 000 in 279 ms, on Node 24.15.0 on 2026-08-23.
 *
 * **The clock is not what chose it.** What each count *reaches* was measured over the same generator,
 * and the proportions are flat: a Set appears in 39.0, 38.5 and 38.0 per cent of draws at the three
 * counts, a Set holding an object in 22.0, 25.9 and 25.2, a `-0` somewhere in 15.0, 16.0 and 16.1.
 * Ten thousand draws buy ten times as many of the same shapes for seven times the time. A hundred
 * reaches the rarest declared shape fifteen times, which is thin enough that a defect living only
 * there could pass. **One thousand is where every declared shape is reached in the hundreds and the
 * suite pays 38 ms**, so it is the count where the alphabet is covered rather than the count where
 * the clock is comfortable.
 */
export const propertyRuns = 1000

/**
 * `never mutates its arguments` comes to life properly here, for the first time in this catalogue.
 * It is inapplicable on four of the five published contracts, whose signatures take primitives, and
 * applicable on `date/add@1` about a single Date. Here both arguments are arbitrary object graphs,
 * and the mutant is not hypothetical: marking visited objects is the textbook way to detect a cycle,
 * and an implementation that forgets to unmark leaves the caller's data changed.
 */
export const universalProperties = [
  {
    name: 'never mutates its arguments',
    applicable: true,
    reason:
      'Both arguments are arbitrary object graphs and the walk has to remember where it has been. ' +
      'Witnessed by an implementation that marks each visited object with a temporary property and ' +
      'removes it on the way out, which is a real technique and leaves a marker on every object it ' +
      'failed to unwind - the shape a walk reaches the first time somebody makes cycle detection ' +
      '"cheaper". The property walks both arguments before and after the call and compares the own ' +
      'keys of every reachable object, so a marker left anywhere in either graph reddens it.',
  },
  {
    name: 'deterministic',
    applicable: true,
    reason:
      'Violable in practice, and witnessed twice over. A cache keyed on one argument answers a ' +
      'second call from the first, and - measured on this contract\'s own walk while it was being ' +
      'written - a comparison that memoises the pairs a failed candidate tried answers differently ' +
      'depending on the order the keys of an object were declared in, which is the same defect ' +
      `arriving through the data instead of through a cache. ${DETERMINISM_ORDERING_FINDING}`,
  },
  {
    name: 'no ambient input',
    applicable: true,
    reason:
      'Violable in practice: this contract reads two values and answers a boolean, so the call ' +
      'history is the only ambient input it can plausibly acquire. Witnessed by an implementation ' +
      'holding the last pair it was asked and its verdict, and serving that verdict whenever both ' +
      'arguments match by reference - which answers correctly until one of the two graphs is ' +
      'mutated between calls, and then answers the previous question. The property interleaves a ' +
      'probe with an arbitrary history and requires the probe to answer identically either way.',
  },
  {
    name: 'no ambient output',
    applicable: false,
    reason: NO_AMBIENT_OUTPUT_FINDING,
  },
] as const

// ---------------------------------------------------------------------------
// Block 4.5 - Benchmark profiles
// ---------------------------------------------------------------------------

export type Pair = {
  readonly left: unknown
  readonly right: unknown
}

/**
 * **No profile here times the stack clause, and the reason is a bound of the registry rather than a
 * gap in this block.**
 *
 * A benchmark sample is carried in the served record, so it has to encode - and measured at the commit
 * this was written, `packages/registry/value.ts` carries a chain of at most **1 562 levels** before its
 * own walk exhausts the stack. That is *shallower than two of the five shipped implementations already
 * answer*: `fast-deep-equal` reaches about eight thousand and `dequal` about five thousand. So the
 * deepest value this contract could put in front of a reader would demonstrate nothing at all about the
 * clause, and a profile carrying one would be a label with no measurement under it - which is the
 * defect `number/parse@1` produced the class rule for.
 *
 * The clause is executable and is not weakened: `p7-ordinary-depth-costs-no-call-frames` builds a chain
 * at run time and asserts the answer, and a property is executed rather than served. What cannot be
 * done is to *show* a reader the value it was asserted on.
 *
 * The first version of this block carried such a profile at five thousand levels, and its description
 * claimed that depth was past every implementation measured. It was not - it is past three of the five
 * - and the record could not carry it either. Both are corrected here rather than left to a reader to
 * find.
 */

/**
 * Every profile declares the class its samples belong to, because without it a profile can measure
 * something other than what it names and nothing says so.
 *
 * The three classes are this contract's own and they divide the cost where it actually divides. A
 * comparison that answers `false` at the first key it looks at and one that walks two identical
 * graphs to the last leaf are not the same measurement, and a profile mixing them measures neither.
 * `stops-early` is most of what a real caller does - a memoisation check on two different renders -
 * and `walks-everything` is the worst case that decides whether the function can be called in a
 * render at all.
 */
export type BenchmarkProfile = {
  readonly name: string
  readonly description: string
  /** What every sample of this profile must do. A profile mixing classes measures neither. */
  readonly comparisonClass: 'stops-early' | 'stops-late' | 'walks-everything'
  readonly samples: readonly Pair[]
}

export const benchmarkProfiles: readonly BenchmarkProfile[] = [
  {
    name: 'two-renders-of-one-view',
    description:
      'Shallow objects of a handful of keys that differ in the first one looked at. The dominant ' +
      'shape in memoisation, and the path a caller takes on most calls.',
    comparisonClass: 'stops-early',
    samples: [
      { left: { id: 1, name: 'a', open: false }, right: { id: 2, name: 'a', open: false } },
      { left: { at: 0, of: 'x' }, right: { at: 1, of: 'x' } },
      { left: [1, 2, 3], right: [9, 2, 3] },
    ],
  },
  {
    name: 'a-row-that-changed-at-the-end',
    description:
      'Records agreeing on everything but their last field, so the walk pays the whole traversal ' +
      'and answers false. Timed apart from the profile above because an implementation optimised ' +
      'for the first difference measures nothing here.',
    comparisonClass: 'stops-late',
    samples: [
      {
        left: { id: 1, name: 'a', tags: ['x', 'y'], meta: { seen: 2, at: 'z' } },
        right: { id: 1, name: 'a', tags: ['x', 'y'], meta: { seen: 2, at: 'w' } },
      },
      { left: [1, 2, 3, 4, 5, 6, 7, 8], right: [1, 2, 3, 4, 5, 6, 7, 9] },
    ],
  },
  {
    name: 'two-copies-of-one-tree',
    description:
      'Structurally identical nested objects, walked to the last leaf and answered true. The worst ' +
      'case of the ordinary path and the one that decides whether this can be called in a render.',
    comparisonClass: 'walks-everything',
    samples: [
      {
        left: { a: { b: { c: [1, 2, { d: 'x' }] } }, e: [3, 4] },
        right: { a: { b: { c: [1, 2, { d: 'x' }] } }, e: [3, 4] },
      },
    ],
  },
  {
    name: 'members-without-an-order',
    description:
      'Sets and Maps holding objects, where a member of one has to be matched against the ' +
      'unclaimed members of the other. The only quadratic path in the contract, and the one the ' +
      'declared collection bound comes from.',
    comparisonClass: 'walks-everything',
    samples: [
      {
        left: new Set([{ id: 1 }, { id: 2 }, { id: 3 }]),
        right: new Set([{ id: 3 }, { id: 1 }, { id: 2 }]),
      },
      {
        left: new Map([[{ k: 1 }, 'a'], [{ k: 2 }, 'b']]),
        right: new Map([[{ k: 2 }, 'b'], [{ k: 1 }, 'a']]),
      },
    ],
  },
]
