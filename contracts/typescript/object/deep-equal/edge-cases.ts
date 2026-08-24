/**
 * Block 4.4 of contract `object/deep-equal@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `packages/catalogue/every-contract.ts`. What is here is this contract's own table.
 *
 * Every case is `specified`: this contract has no battery yet, so no case here can have been added
 * because a mutant survived, and none is claimed to have been. What the table *is* built from is
 * three readings rather than an intuition. Twenty-eight ordinary pairs were put to seven shipped
 * implementations and eleven were answered differently by at least two of them; twelve pairs were put
 * to the built-ins that carry their value in an internal slot; and the whole table was replayed
 * against the walk after every change to it.
 *
 * **Seven of the forty-nine rows carry a fault the contract's own author committed**, and the
 * rationale of each says so: two from a memo where a path was needed, five from a dispatch that
 * enumerated the built-ins the author remembered. They are not decoration - `contract.ts` publishes
 * a clause about speculation, and the evidence for that clause is that the fault is easy enough to
 * commit in the hour after writing the clause down.
 *
 * The last group is the one to read if `p1-reflexive-under-a-copy` looks unconditional. It is not,
 * and the reason is `structuredClone`'s rather than this contract's.
 */

import type { CaseGroup } from '../../../../packages/catalogue/identifier.js'
import type { Provenance } from '../../../../packages/catalogue/every-contract.js'

/**
 * The nine questions this table answers, in the order it answers them.
 *
 * The partition is this contract's own and is frozen with its major - see `CaseGroup`. It divides by
 * *what a reader arrived with*: somebody who has just watched two different Sets compare equal reads
 * the fourth group and stops.
 */
export const edgeCaseGroups: readonly CaseGroup[] = [
  {
    id: 'identity-of-a-primitive',
    title: 'Identity of a primitive',
    note:
      'Where the walk stops before it starts. Every one of these is decided by `Object.is`, which ' +
      'is the language\'s own rule and the reason `NaN` equals itself here while `-0` does not ' +
      'equal `0`.',
  },
  {
    id: 'the-shape-of-a-plain-object',
    title: 'The shape of a plain object',
    note: null,
  },
  {
    id: 'arrays-and-their-holes',
    title: 'Arrays and their holes',
    note:
      'An array is compared by its own keys, so a hole and a stored `undefined` are different ' +
      'things - which is what `Object.keys` says about them and what nothing that walks values ' +
      'alone can see.',
  },
  {
    id: 'collections-carry-what-no-key-walk-sees',
    title: 'Collections carry what no key walk sees',
    note:
      'The reason this contract exists. `Object.keys(new Set([1]))` is the empty array, so an ' +
      'implementation that walks own properties sees two empty objects and says they match - ' +
      'measured, two of five shipped implementations answer `true` for `new Set([1])` against ' +
      '`new Set([2])`.',
  },
  {
    id: 'a-value-in-an-internal-slot',
    title: 'A value in an internal slot',
    note:
      'The same blindness one floor down: a `Date`, a boxed number and a typed array carry their ' +
      'value where no own property is, and a walk that enumerates keys sees nothing to compare.',
  },
  { id: 'an-error-is-data', title: 'An error is data', note: null },
  {
    id: 'a-graph-that-returns-to-itself',
    title: 'A graph that returns to itself',
    note:
      'Terminating is half of it. The other half is that a comparison which remembers what it has ' +
      'already assumed must forget an assumption it made speculatively, and the last two rows are ' +
      'the ones the author got wrong.',
  },
  {
    id: 'what-the-domain-does-not-carry',
    title: 'What the domain does not carry',
    note:
      'Values `structuredClone` refuses. The contract answers `false` rather than guessing or ' +
      'throwing, because a silent `true` on two different functions is the defect this whole ' +
      'catalogue is written against.',
  },
  {
    id: 'what-a-clone-does-not-preserve',
    title: 'What a clone does not preserve',
    note:
      '`p1-reflexive-under-a-copy` is the oracle this contract was admitted on, and it is not ' +
      'unconditional. `structuredClone` returns a plain object for a class instance and for a ' +
      'null-prototype object, so a value of either shape is not equal to its own clone - measured, ' +
      'and `util.isDeepStrictEqual` answers the same. The property\'s alphabet excludes both, and ' +
      'these rows are where they are settled instead.',
  },
]

export type EdgeCase = {
  readonly id: string
  /** Which of `edgeCaseGroups` this case sits under. */
  readonly group: string
  readonly left: unknown
  readonly right: unknown
  readonly expected: boolean
  readonly provenance: Provenance
  readonly rationale: string
}

// ---------------------------------------------------------------------------
// The values that cannot be written as literals
// ---------------------------------------------------------------------------

/** An object holding itself, built twice so that two of them are never one reference. */
const selfReferring = (): unknown => {
  const node: Record<string, unknown> = { name: 'root' }
  node['self'] = node

  return node
}

/** A Set holding itself, which is the shape that needs the path to be shared rather than fresh. */
const selfHoldingSet = (): unknown => {
  const held = new Set<unknown>()
  held.add(held)

  return held
}

/**
 * The witness of the speculation fault, built as a pair so that the shared reference is real.
 *
 * The two Sets match either way round. `also` holds `{v:1}` against `{v:2}`, so the answer is
 * `false` - and an implementation memoising the pair its failed candidate tried answers `true`.
 */
const theSpeculationWitness = (): { readonly left: unknown; readonly right: unknown } => {
  const shared = { v: 1 }

  return {
    left: { s: new Set([shared, { v: 2 }]), also: [shared] },
    right: { s: new Set([{ v: 2 }, { v: 1 }]), also: [{ v: 2 }] },
  }
}

/** The same witness with its two keys declared the other way round, and nothing else changed. */
const theWitnessTransposed = (): { readonly left: unknown; readonly right: unknown } => {
  const witness = theSpeculationWitness()
  const flip = (subject: unknown): unknown => {
    const held = subject as { readonly s: unknown; readonly also: unknown }

    return { also: held.also, s: held.s }
  }

  return { left: flip(witness.left), right: flip(witness.right) }
}

class ASmallClass {
  readonly x: number

  constructor(x: number) {
    this.x = x
  }
}

const withoutAPrototype = (): unknown => Object.assign(Object.create(null), { a: 1 })

const theSharedSymbol = Symbol.for('object/deep-equal@1 case')

const witness = theSpeculationWitness()
const transposed = theWitnessTransposed()
const aClassInstance = new ASmallClass(1)
const aBareObject = withoutAPrototype()

/**
 * The two values the last group compares against their own clones, and they are deliberately not the
 * two above.
 *
 * `structuredClone` flattens a prototype, so the clone of a class instance *is* the plain object the
 * prototype rows already compare against - which would make those rows and these ones the same call
 * asked twice, and `settles-each-pair-once` is what says so. The values differ; the claim does not.
 */
const aSecondClassInstance = new ASmallClass(2)
const aSecondBareObject = Object.assign(Object.create(null), { b: 2 }) as unknown

export const edgeCases: readonly EdgeCase[] = [
  // -------------------------------------------------------------------------
  {
    id: 'not-a-number-equals-itself',
    group: 'identity-of-a-primitive',
    left: NaN,
    right: NaN,
    expected: true,
    provenance: 'specified',
    rationale:
      '`NaN === NaN` is false and `Object.is(NaN, NaN)` is true. A comparison about data takes the ' +
      'second: a caller holding two records that both failed to parse a number is holding the same ' +
      'record twice, not two different ones.',
  },
  {
    id: 'negative-zero-is-not-zero',
    group: 'identity-of-a-primitive',
    left: -0,
    right: 0,
    expected: false,
    provenance: 'specified',
    rationale:
      'The other half of `Object.is`, and the half the ecosystem splits on: `lodash` and ' +
      '`fast-deep-equal` answer true, `util.isDeepStrictEqual` answers false. A refund that ' +
      'rounded away to nothing keeps the mark saying which way the money went - the same argument ' +
      '`number/round@1` freezes one contract over.',
  },
  {
    id: 'negative-zero-nested-is-still-not-zero',
    group: 'identity-of-a-primitive',
    left: { z: -0 },
    right: { z: 0 },
    expected: false,
    provenance: 'specified',
    rationale:
      'The same rule one level down, because a rule that held only at the root would be a property ' +
      'of the entry point rather than of the walk.',
  },
  {
    id: 'a-bigint-is-not-its-number',
    group: 'identity-of-a-primitive',
    left: { v: 1n },
    right: { v: 1 },
    expected: false,
    provenance: 'specified',
    rationale:
      '`1n == 1` is true and `Object.is(1n, 1)` is false. Two values a caller cannot add together ' +
      'are not the same datum, and the loose comparison is the one nothing here uses.',
  },
  {
    id: 'a-boxed-primitive-is-not-its-primitive',
    group: 'identity-of-a-primitive',
    left: new String('a'),
    right: 'a',
    expected: false,
    provenance: 'specified',
    rationale:
      'One is an object with a prototype and own indexed properties, the other is a primitive. ' +
      '`typeof` separates them and so does anything a caller does with them afterwards.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'the-order-keys-were-written-in-is-not-read',
    group: 'the-shape-of-a-plain-object',
    left: { a: 1, b: 2 },
    right: { b: 2, a: 1 },
    expected: true,
    provenance: 'specified',
    rationale:
      'The first thing the spelling a caller reaches for gets wrong: comparing two ' +
      '`JSON.stringify` results answers false here, because a serialisation carries an order the ' +
      'data does not have.',
  },
  {
    id: 'a-key-holding-undefined-is-not-a-missing-key',
    group: 'the-shape-of-a-plain-object',
    left: { a: undefined },
    right: {},
    expected: false,
    provenance: 'specified',
    rationale:
      'The two are different to `Object.keys`, to `in`, and to a caller writing `if ("a" in row)`. ' +
      'The `JSON.stringify` spelling answers true, because `undefined` is dropped on the way out.',
  },
  {
    id: 'data-under-a-symbol-key-is-data',
    group: 'the-shape-of-a-plain-object',
    left: { [theSharedSymbol]: 1 },
    right: { [theSharedSymbol]: 2 },
    expected: false,
    provenance: 'specified',
    rationale:
      'Measured, four of six shipped implementations answer true here: they walk `Object.keys`, ' +
      'which does not report a symbol. Two objects whose data differs compare equal, and nothing ' +
      'about the call says so.',
  },
  {
    id: 'a-class-instance-is-not-its-fields',
    group: 'the-shape-of-a-plain-object',
    left: aClassInstance,
    right: { x: 1 },
    expected: false,
    provenance: 'specified',
    rationale:
      'The prototype is part of what the value is: methods, a constructor and whatever else the ' +
      'class carries are all reachable from one and not from the other. Every implementation ' +
      'measured agrees, and `inputDomain` says in as many words that a caller who wants them equal ' +
      'wants a different function.',
  },
  {
    id: 'a-null-prototype-object-is-not-a-plain-one',
    group: 'the-shape-of-a-plain-object',
    left: aBareObject,
    right: { a: 1 },
    expected: false,
    provenance: 'specified',
    rationale:
      'The same rule at the other end of the prototype chain, and the place the ecosystem parts ' +
      'again: `lodash` answers true, `util.isDeepStrictEqual` answers false. An object built to ' +
      'have no inherited `toString` is not the object that has one.',
  },
  {
    id: 'a-getter-is-read-as-the-value-it-returns',
    group: 'the-shape-of-a-plain-object',
    left: { get a() { return 1 } },
    right: { a: 1 },
    expected: true,
    provenance: 'specified',
    rationale:
      'A comparison reads values, and reading a property is what a caller does too. The ' +
      'alternative - comparing descriptors - would answer about how an object was written rather ' +
      'than about what it carries, and would make a memoised object differ from its own plain copy.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'a-hole-is-not-an-undefined',
    group: 'arrays-and-their-holes',
    left: [, 1],
    right: [undefined, 1],
    expected: false,
    provenance: 'specified',
    rationale:
      '`Object.keys([,1])` is `["1"]` and `Object.keys([undefined,1])` is `["0","1"]`, so the two ' +
      'differ in what they hold and not only in what they read as. `map` and `forEach` skip the ' +
      'hole and visit the `undefined`, which is where a caller meets the difference.',
  },
  {
    id: 'a-trailing-hole-changes-the-length',
    group: 'arrays-and-their-holes',
    left: [1, 2],
    right: [1, 2, ,],
    expected: false,
    provenance: 'specified',
    rationale:
      'Own keys are identical here and the lengths are 2 and 3, so this is the row that says the ' +
      'walk compares an array\'s length as well as its keys. Without it a table built only from ' +
      'key sets would pass an implementation that dropped the length check.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'two-sets-of-different-members-are-different',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Set([1]),
    right: new Set([2]),
    expected: false,
    provenance: 'specified',
    rationale:
      'The sharpest instance in the catalogue of a silent wrong answer: measured, ' +
      '`fast-deep-equal@3.1.3` and `dequal/lite@2.0.3` both answer true, because a Set has no own ' +
      'enumerable property and a walk over keys sees two empty objects.',
  },
  {
    id: 'two-sets-of-different-size-are-different',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Set([1, 2]),
    right: new Set([1]),
    expected: false,
    provenance: 'specified',
    rationale:
      'The same two implementations answer true here too, which is what separates this from the ' +
      'row above: it is not that they compare members badly, it is that they do not look at the ' +
      'collection at all.',
  },
  {
    id: 'a-populated-map-is-not-an-empty-one',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Map([['a', 1]]),
    right: new Map(),
    expected: false,
    provenance: 'specified',
    rationale:
      'The `JSON.stringify` spelling also answers true here, and for the same reason as the two ' +
      'above rather than a different one - a Map serialises as `{}`. Three ways of asking, one ' +
      'blindness.',
  },
  {
    id: 'a-map-value-is-compared',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Map([['a', 1]]),
    right: new Map([['a', 2]]),
    expected: false,
    provenance: 'specified',
    rationale:
      'A Map is compared by its entries and not only by its keys, which is the half an ' +
      'implementation comparing sizes and key sets would pass without.',
  },
  {
    id: 'the-order-members-were-added-in-is-not-read',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Set([1, 2]),
    right: new Set([2, 1]),
    expected: true,
    provenance: 'specified',
    rationale:
      'Insertion order is observable on a Set - it decides iteration - and it is not part of what ' +
      'the Set holds. A caller who built the same set of ids from two different queries has one ' +
      'set of ids.',
  },
  {
    id: 'a-set-member-is-compared-by-its-data',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Set([{ id: 1 }]),
    right: new Set([{ id: 1 }]),
    expected: true,
    provenance: 'specified',
    rationale:
      'The other direction of the same blindness, and the one the ecosystem\'s remedy gets wrong: ' +
      '`fast-deep-equal/es6` - the entry point its README sends a caller to for collections - ' +
      'answers false, because it tests membership with `has`, which is reference identity.',
  },
  {
    id: 'a-map-key-is-compared-by-its-data',
    group: 'collections-carry-what-no-key-walk-sees',
    left: new Map([[{ k: 1 }, 'v']]),
    right: new Map([[{ k: 1 }, 'v']]),
    expected: true,
    provenance: 'specified',
    rationale:
      'The same for a key rather than a member, which is the harder half: matching entries without ' +
      'an order means a key of one has to be found among the unclaimed keys of the other, and that ' +
      'is the only quadratic path in the contract.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'two-instants-are-one-date',
    group: 'a-value-in-an-internal-slot',
    left: new Date(0),
    right: new Date(0),
    expected: true,
    provenance: 'specified',
    rationale:
      'A Date carries a number of milliseconds in a slot and has no own property at all. Two dates ' +
      'naming one instant are one datum.',
  },
  {
    id: 'an-invalid-date-equals-an-invalid-date',
    group: 'a-value-in-an-internal-slot',
    left: new Date(NaN),
    right: new Date(NaN),
    expected: true,
    provenance: 'specified',
    rationale:
      'The slot holds `NaN`, and the rule is the one the first group settles: `Object.is` and not ' +
      '`===`. Measured, three of five shipped implementations answer false here, which is `NaN`\'s ' +
      'own trap arriving inside a built-in.',
  },
  {
    id: 'an-invalid-date-is-not-an-instant',
    group: 'a-value-in-an-internal-slot',
    left: new Date(0),
    right: new Date(NaN),
    expected: false,
    provenance: 'specified',
    rationale:
      'The neighbour of the row above, and the reason that row is about `Object.is` rather than ' +
      'about treating every invalid date as equal to everything.',
  },
  {
    id: 'a-pattern-is-its-source-and-its-flags',
    group: 'a-value-in-an-internal-slot',
    left: /ab+c/gi,
    right: /ab+c/gi,
    expected: true,
    provenance: 'specified',
    rationale:
      'The two things a pattern is. Everything else about a RegExp object is derived from them or ' +
      'is the state of a scan, which the last row of this group settles.',
  },
  {
    id: 'a-pattern-source-is-part-of-it',
    group: 'a-value-in-an-internal-slot',
    left: /a/g,
    right: /b/g,
    expected: false,
    provenance: 'specified',
    rationale: 'The half of the row above that says `source` is read.',
  },
  {
    id: 'a-pattern-flag-is-part-of-it',
    group: 'a-value-in-an-internal-slot',
    left: /a/g,
    right: /a/i,
    expected: false,
    provenance: 'specified',
    rationale:
      'The other half, and not the same claim: an implementation comparing only `source` passes ' +
      'the row above and fails here.',
  },
  {
    id: 'where-a-pattern-stopped-is-not-part-of-it',
    group: 'a-value-in-an-internal-slot',
    left: Object.assign(/a/g, { lastIndex: 3 }),
    right: /a/g,
    expected: true,
    provenance: 'specified',
    rationale:
      '`util.isDeepStrictEqual` reads `lastIndex` and answers false; `lodash`, `dequal` and ' +
      '`fast-deep-equal` ignore it. **This contract excludes it and the argument is not a show of ' +
      'hands.** Measured: `structuredClone(/a/g)` with `lastIndex` at 3 returns a pattern whose ' +
      '`lastIndex` is 0, with `source` and `flags` identical, and the same for a sticky pattern. ' +
      'The declared domain is the values `structuredClone` carries and the admission oracle is that ' +
      'a value equals its own clone, so reading `lastIndex` would make this contract fail the ' +
      'oracle it was admitted on. `util.isDeepStrictEqual` is bound by no such domain; this ' +
      'contract is.',
  },
  {
    id: 'a-boxed-number-carries-a-number',
    group: 'a-value-in-an-internal-slot',
    left: new Number(7),
    right: new Number(8),
    expected: false,
    provenance: 'specified',
    rationale:
      '**A row the author of this contract got wrong.** A boxed number has no own property, so a ' +
      'walk that enumerates keys sees two empty objects and answers true - which is what this ' +
      'contract\'s own walk did, silently, until the dispatch was measured. `lodash` and ' +
      '`util.isDeepStrictEqual` were right about it all along.',
  },
  {
    id: 'a-boxed-boolean-carries-a-boolean',
    group: 'a-value-in-an-internal-slot',
    left: new Boolean(true),
    right: new Boolean(false),
    expected: false,
    provenance: 'specified',
    rationale:
      'The same slot blindness on a second kind, kept as its own row because a dispatch repaired ' +
      'for `Number` alone passes the row above and fails here - which is how the repair was ' +
      'checked.',
  },
  {
    id: 'a-boxed-bigint-carries-a-bigint',
    group: 'a-value-in-an-internal-slot',
    left: Object(1n),
    right: Object(2n),
    expected: false,
    provenance: 'specified',
    rationale:
      'The third kind, and the one that is easiest to leave out because `Object(1n)` is not a ' +
      'spelling anybody writes on purpose - which is exactly why a caller meets it through a ' +
      'library rather than through their own code.',
  },
  {
    id: 'a-slot-does-not-hide-an-own-property',
    group: 'a-value-in-an-internal-slot',
    left: new Number(7),
    right: Object.assign(new Number(7), { tag: 1 }),
    expected: false,
    provenance: 'specified',
    rationale:
      'The slots agree and the own keys do not. Measured, `lodash` answers true here - it reads ' +
      'the slot and stops - so this row is one of the two places this contract is stricter than ' +
      'the most-used implementation rather than looser.',
  },
  {
    id: 'two-typed-arrays-of-one-kind-are-their-elements',
    group: 'a-value-in-an-internal-slot',
    left: new Uint8Array([1, 2]),
    right: new Uint8Array([1, 2]),
    expected: true,
    provenance: 'specified',
    rationale:
      'A typed array has indexed own properties, so a key walk finds something - which is why this ' +
      'row passes almost everywhere and the next two do not.',
  },
  {
    id: 'a-typed-array-kind-is-part-of-it',
    group: 'a-value-in-an-internal-slot',
    left: new Uint8Array([1, 0]),
    right: new Uint16Array([1]),
    expected: false,
    provenance: 'specified',
    rationale:
      'Same bytes, different kinds, different lengths, and a caller cannot use one where the other ' +
      'is expected. The prototypes differ, which is what the walk reads.',
  },
  {
    id: 'not-a-number-inside-a-float-array-equals-itself',
    group: 'a-value-in-an-internal-slot',
    left: new Float64Array([NaN]),
    right: new Float64Array([NaN]),
    expected: true,
    provenance: 'specified',
    rationale:
      'The row that caught three of the five shipped implementations against the oracle: they ' +
      'compare elements with `===`, so a float array holding `NaN` is not equal to its own ' +
      'structured clone. `Object.is` per element is the rule, and it is the first group\'s rule ' +
      'again rather than a new one.',
  },
  {
    id: 'negative-zero-inside-a-float-array-is-not-zero',
    group: 'a-value-in-an-internal-slot',
    left: new Float64Array([-0]),
    right: new Float64Array([0]),
    expected: false,
    provenance: 'specified',
    rationale:
      'The other half of `Object.is` inside a typed array, and the half an implementation ' +
      'comparing bytes would get right by accident - which is a different implementation from one ' +
      'that got the row above right.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'two-errors-of-one-message-are-one-error',
    group: 'an-error-is-data',
    left: new Error('x'),
    right: new Error('x'),
    expected: true,
    provenance: 'specified',
    rationale:
      'An error caught and stored is a value like any other. `stack` is not read, because it names ' +
      'where the error was constructed rather than what it says, and two errors built at two ' +
      'call sites for one reason are one reason.',
  },
  {
    id: 'a-message-is-part-of-an-error',
    group: 'an-error-is-data',
    left: new Error('a'),
    right: new Error('b'),
    expected: false,
    provenance: 'specified',
    rationale:
      'Measured, `dequal` answers true here - it walks own enumerable properties and `message` is ' +
      'not one of them. The same blindness as the collections, on the type a caller is most likely ' +
      'to be comparing when something has gone wrong.',
  },
  {
    id: 'a-cause-is-part-of-an-error',
    group: 'an-error-is-data',
    left: new Error('a', { cause: 1 }),
    right: new Error('a', { cause: 2 }),
    expected: false,
    provenance: 'specified',
    rationale:
      '`cause` is where the original failure is kept, so an implementation reading `name` and ' +
      '`message` alone answers true for two errors that happened for different reasons. It is ' +
      'compared as data rather than by identity, so a cause that is itself an object is walked.',
  },
  {
    id: 'an-error-kind-is-part-of-it',
    group: 'an-error-is-data',
    left: new TypeError('x'),
    right: new Error('x'),
    expected: false,
    provenance: 'specified',
    rationale:
      'The prototype rule of the second group, arriving where a caller most often branches on it: ' +
      'code that asks `err instanceof TypeError` is asking about exactly this difference.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'a-cycle-terminates',
    group: 'a-graph-that-returns-to-itself',
    left: selfReferring(),
    right: selfReferring(),
    expected: true,
    provenance: 'specified',
    rationale:
      'Measured, three of six shipped implementations do not answer this at all - they exhaust the ' +
      'call stack. Answering is the claim; answering `true` is the second half, and it is the ' +
      'coinductive reading: two graphs that unfold to the same infinite tree are the same data.',
  },
  {
    id: 'a-set-containing-itself-terminates',
    group: 'a-graph-that-returns-to-itself',
    left: selfHoldingSet(),
    right: selfHoldingSet(),
    expected: true,
    provenance: 'specified',
    rationale:
      'The same claim through a collection rather than through a property, and it is not the same ' +
      'test: matching members recurses, so an implementation whose cycle detection lives only in ' +
      'the property walk answers the row above and never returns from this one.',
  },
  {
    id: 'a-cycle-is-not-the-same-as-its-unrolling',
    group: 'a-graph-that-returns-to-itself',
    left: selfReferring(),
    right: { name: 'root', self: { name: 'root', self: null } },
    expected: false,
    provenance: 'specified',
    rationale:
      'The row that stops the one above from being satisfied by an implementation that answers ' +
      '`true` whenever it has seen a pair before. A cycle and a finite unrolling of it part at the ' +
      'first place the unrolling ends.',
  },
  {
    id: 'a-failed-candidate-leaves-nothing-behind',
    group: 'a-graph-that-returns-to-itself',
    left: witness.left,
    right: witness.right,
    expected: false,
    provenance: 'specified',
    rationale:
      '**The row the author of this contract got wrong, in the hour after writing down the danger ' +
      'of cycle detection.** The two Sets match either way round; `also` holds `{v:1}` against ' +
      '`{v:2}`. An implementation that memoises the pairs a failed candidate tried answers `true`, ' +
      'because the failed attempt left `({v:1}, {v:2})` marked as assumed equal. All four shipped ' +
      'implementations answer `false`, so this row founds no admission - what it founds is the ' +
      'clause, and the evidence for the clause is that the fault was committed here.',
  },
  {
    id: 'and-answers-the-same-either-way-round',
    group: 'a-graph-that-returns-to-itself',
    left: transposed.left,
    right: transposed.right,
    expected: false,
    provenance: 'specified',
    rationale:
      'The same two values with their two keys declared in the other order, and nothing else ' +
      'changed. The walk that got the row above wrong answered `false` here, so a table carrying ' +
      'only one of the two would have been green on half the defect - which is what makes this a ' +
      'row rather than a note.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'two-promises-are-not-compared',
    group: 'what-the-domain-does-not-carry',
    left: Promise.resolve(1),
    right: Promise.resolve(2),
    expected: false,
    provenance: 'specified',
    rationale:
      'Nothing about a promise\'s contents is readable synchronously, so there is nothing to ' +
      'compare. `false` rather than a throw, because the caller asked a question with an answer: ' +
      'these are not the same value.',
  },
  {
    id: 'two-weak-collections-are-not-compared',
    group: 'what-the-domain-does-not-carry',
    left: new WeakMap(),
    right: new WeakMap(),
    expected: false,
    provenance: 'specified',
    rationale:
      'A WeakMap cannot be enumerated by design. Answering `true` for two of them - which the ' +
      'author\'s own walk did, because they have no own property - is the silent `true` this ' +
      'contract exists to refuse, arriving on a type nobody thinks to test.',
  },
  {
    id: 'two-functions-are-not-compared',
    group: 'what-the-domain-does-not-carry',
    left: () => 1,
    right: () => 2,
    expected: false,
    provenance: 'specified',
    rationale:
      'Two functions are equal when they are the same reference and not otherwise: source text is ' +
      'not behaviour, and a closure carries what no reading of it shows. The author\'s walk ' +
      'answered `true` for these two as well.',
  },

  // -------------------------------------------------------------------------
  {
    id: 'a-class-instance-is-not-its-own-clone',
    group: 'what-a-clone-does-not-preserve',
    left: aSecondClassInstance,
    right: structuredClone(aSecondClassInstance),
    expected: false,
    provenance: 'specified',
    rationale:
      '`structuredClone` returns a plain object for a class instance - measured, the prototype goes ' +
      'from the class to `Object` - so the clone is not the same kind of thing. This row is what ' +
      '`p1-reflexive-under-a-copy` excludes rather than what it asserts, and it was found by ' +
      'fast-check on the first hundred draws while the property was being calibrated.',
  },
  {
    id: 'a-null-prototype-object-is-not-its-own-clone',
    group: 'what-a-clone-does-not-preserve',
    left: aSecondBareObject,
    right: structuredClone(aSecondBareObject),
    expected: false,
    provenance: 'specified',
    rationale:
      'The same flattening at the other end: a null-prototype object clones to a plain one. ' +
      '`util.isDeepStrictEqual` answers `false` here too and `lodash` answers `true`, so the ' +
      'ecosystem is split on the row that decides how the oracle has to be stated.',
  },
]
