/**
 * Block 4.4 of contract `array/group-by@1` - the named and settled edge cases.
 *
 * Split out of `contract.ts` because it is the one block that grows. The other four declare a fixed
 * number of things - an identity, a signature, a list of universal properties, a set of benchmark
 * profiles - while this one gains an entry every time a defect is found that no existing case
 * caught. Cutting along the block boundary keeps the contract's own numbering as the map: a reader
 * looking for 4.4 finds a file named for it, beside the file that executes it.
 *
 * This is a split inside one contract folder, not an abstraction across two. Nothing here is shared
 * with `number/parse@1` or `date/add@1`, which carry their own tables under the same name and no
 * common type.
 *
 * Each entry is simultaneously an exact test (`edge-cases.test.ts`) and one line of public
 * documentation. `rationale` is the published sentence; it states a measured fact, not an opinion.
 *
 * A case here needs two things the first two contracts' tables did not. Half the behaviour arrives
 * as a function, so an entry carries the key function it was settled under; and some entries are
 * about how that function was *used* rather than about the answer, so an entry may also pin the
 * calls it must have received. Both are consequences of block 4.2's `keyFunctionRules`: an
 * obligation nobody executes is a sentence.
 *
 * Every expected grouping below was computed against `Map.groupBy` before this contract's reference
 * existed, so the table judges the implementation rather than transcribing it. It agrees on every
 * non-throwing case; where this contract takes a side the language does not, the rationale says so.
 */

/**
 * Where a case came from. Without it a contract that has been closing its gaps reads exactly like a
 * contract that never had any, and the difference is the whole claim this project makes.
 *
 * No test can check that a declared provenance is true - a sentence about how a case was found is
 * not a property of the case - and none is written, because a guard that cannot fail would be worse
 * than none. One half of it is checkable, and it is checked without any new machinery: a case marked
 * `found-by-mutation:M-01` claims to kill M-01, the mutation battery pins M-01 as killed, and
 * deleting the case turns that column red.
 *
 * Every case here is `specified`: this table was written from the measurements in block 4.2 before
 * the reference existed, and no mutant has yet required an entry to be added. That is a fact about
 * this contract's short history rather than a virtue.
 */
export type Provenance =
  /** Written with the contract, before any implementation existed. */
  | 'specified'
  /** Added after a mutant survived. The text after the colon names the mutant it kills. */
  | `found-by-mutation:${string}`
  /** Added after a defect reported from real use. The text after the colon identifies the report. */
  | `found-in-the-wild:${string}`

/** Key and group, in the order the result must hold them. */
export type ExpectedGroup = readonly [key: unknown, group: readonly unknown[]]

export type Outcome =
  | { readonly kind: 'groups'; readonly groups: readonly ExpectedGroup[] }
  /** The key function threw, and the very same error object must leave `groupBy` unwrapped. */
  | { readonly kind: 'propagates' }
  /** Reading the input failed before any grouping could happen. */
  | { readonly kind: 'throws'; readonly errorName: string }

export type ExpectedCall = readonly [item: unknown, index: number]

export type EdgeCase = {
  readonly title: string
  readonly items: readonly unknown[]
  readonly keyOf: (item: unknown, index: number) => unknown
  readonly outcome: Outcome
  /**
   * The calls the key function must have received, when the case is about the protocol of block 4.2
   * rather than about the answer. Absent when the answer is the whole point.
   */
  readonly expectedCalls?: readonly ExpectedCall[]
  readonly provenance: Provenance
  readonly rationale: string
}

/**
 * Inputs no TypeScript caller can write, and every JavaScript caller can.
 *
 * A separate table rather than a widened `items`, so that the typed table above stays typed. The
 * compile-time half of these is covered by `signature.test-d.ts`; this is the runtime half, and it
 * exists because two implementations that both typecheck disagree here in silence - measured, a
 * counting loop over `length` answers "zero groups" for a Set and for `null`, where iteration groups
 * the first and refuses the second.
 */
export type UntypedCallerCase = {
  readonly title: string
  readonly items: unknown
  readonly keyOf: (item: unknown, index: number) => unknown
  readonly outcome: Outcome
  readonly provenance: Provenance
  readonly rationale: string
}

// ---------------------------------------------------------------------------
// The key functions the table is settled under, named so that a case reads as data
// ---------------------------------------------------------------------------

const identityKey = (item: unknown): unknown => item
const constantKey = (): string => 'all'
const indexKey = (_item: unknown, index: number): number => index
const parityKey = (item: unknown): string => (Number(item) % 2 === 0 ? 'even' : 'odd')
const teamKey = (item: unknown): unknown => (item as { readonly team: unknown }).team

/**
 * A key function that answers differently the second time it is asked about the same element.
 *
 * One of the three impure shapes this contract has to settle. It cannot be a shared helper, because
 * its whole content is the state it carries, so each case that needs one builds its own.
 */
const answersDifferentlyOnASecondLook = (): ((item: unknown) => string) => {
  const alreadyAsked = new Set<unknown>()

  return (item: unknown): string => {
    if (alreadyAsked.has(item)) return 'second-look'
    alreadyAsked.add(item)

    return 'first-look'
  }
}

/**
 * A key function that writes to the element it is given - the second impure shape.
 *
 * It returns the team it found and then changes it, so the write is proved by the answer rather than
 * by a second assertion the table would have to grow a field for: asked twice about one object, it
 * returns two different keys.
 */
const renamesTheTeamItRead = (item: unknown): unknown => {
  const target = item as { team: unknown }
  const found = target.team
  target.team = 'renamed'

  return found
}

/**
 * The two keys that name something on `Object.prototype` are written through named functions rather
 * than inline arrows, because `() => '__proto__'` inside an object literal is exactly the shape a
 * reader skims past, and these are the cases a maintainer is most likely to "simplify" away.
 */
const constantKeyProto = (): string => '__proto__'
const constantKeyConstructor = (): string => 'constructor'

/** The third impure shape. The error object is exported so a case can require this exact one. */
export const THE_KEY_FUNCTION_ERROR = new Error('the key function refused')

const throwsTheKeyFunctionError = (): never => {
  throw THE_KEY_FUNCTION_ERROR
}

// ---------------------------------------------------------------------------
// Elements the table refers to by identity
// ---------------------------------------------------------------------------

const ALICE = { name: 'Alice', team: 'red' }
const BOB = { name: 'Bob', team: 'blue' }
const CARLA = { name: 'Carla', team: 'red' }

/** Two distinct objects that print the same, used as keys rather than as elements. */
const RED_ONE = { colour: 'red' }
const RED_TWO = { colour: 'red' }

/** The one element the table lets a key function write to, listed twice in its own case. */
const DANA: { team: unknown } = { team: 'green' }

const RED_SYMBOL = Symbol('red')
const BLUE_SYMBOL = Symbol('blue')

export const edgeCases: readonly EdgeCase[] = [
  // --- Baseline -----------------------------------------------------------
  {
    title: 'numbers grouped by parity',
    items: [1, 2, 3, 4, 5],
    keyOf: parityKey,
    outcome: { kind: 'groups', groups: [['odd', [1, 3, 5]], ['even', [2, 4]]] },
    provenance: 'specified',
    rationale:
      'The ordinary case. "odd" comes first because 1 is the first element, and each group holds ' +
      'its elements in the order the input had them.',
  },
  {
    title: 'objects grouped by a field, held by identity',
    items: [ALICE, BOB, CARLA],
    keyOf: teamKey,
    outcome: { kind: 'groups', groups: [['red', [ALICE, CARLA]], ['blue', [BOB]]] },
    provenance: 'specified',
    rationale:
      'The groups hold the caller\'s own objects, not copies. An implementation that cloned its ' +
      'elements would satisfy a deep comparison and break every caller that expects to find the ' +
      'objects it passed in.',
  },
  {
    title: 'the empty array',
    items: [],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [] },
    expectedCalls: [],
    provenance: 'specified',
    rationale:
      'An empty Map, never null: this contract is total, so the empty input has an answer like ' +
      'every other. The key function is not called at all.',
  },
  {
    title: 'a single element',
    items: [7],
    keyOf: constantKey,
    outcome: { kind: 'groups', groups: [['all', [7]]] },
    provenance: 'specified',
    rationale: 'One group of one. Listed because it is the input a fast path is written for.',
  },

  // --- Group order --------------------------------------------------------
  {
    title: 'group order is first occurrence, not numeric, for keys that look like integers',
    items: ['10', '2', '1', 'b', 'a'],
    keyOf: identityKey,
    outcome: {
      kind: 'groups',
      groups: [['10', ['10']], ['2', ['2']], ['1', ['1']], ['b', ['b']], ['a', ['a']]],
    },
    provenance: 'specified',
    rationale:
      'The case the return type was chosen for. Measured, lodash 4.18.1, Ramda 0.32.0 and ' +
      'Object.groupBy all answer 1, 2, 10, b, a here, because an object enumerates integer-like ' +
      'property names first and in ascending order whatever order they were inserted in. A Map ' +
      'keeps the order the keys arrived in, and so does this contract.',
  },
  {
    title: 'group order is first occurrence for numeric keys too',
    items: [10, 2, 1],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[10, [10]], [2, [2]], [1, [1]]] },
    provenance: 'specified',
    rationale:
      'The same statement with the keys left as numbers, so that a mutant which stringifies keys ' +
      'on the way in is caught here as well as on the case above.',
  },
  {
    title: 'a group keeps its elements in input order across interleaving',
    items: [1, 2, 3, 4, 5, 6],
    keyOf: parityKey,
    outcome: { kind: 'groups', groups: [['odd', [1, 3, 5]], ['even', [2, 4, 6]]] },
    provenance: 'specified',
    rationale:
      'Stability is contract. An implementation that prepends rather than appends answers 5, 3, 1 ' +
      'here and is otherwise indistinguishable.',
  },

  // --- Key identity -------------------------------------------------------
  {
    title: 'NaN keys form a single group',
    items: [Number.NaN, 1, Number.NaN],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[Number.NaN, [Number.NaN, Number.NaN]], [1, [1]]] },
    provenance: 'specified',
    rationale:
      'SameValueZero, which is what a Map uses: NaN equals NaN. An implementation that looks its ' +
      'groups up with === or indexOf gives every NaN-keyed element a group of its own, since ' +
      'NaN === NaN is false.',
  },
  {
    title: 'a negative zero key is stored as a positive zero, and merges with it',
    items: [-0, 0],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[0, [-0, 0]]] },
    provenance: 'specified',
    rationale:
      'Two halves, both measured. Map.prototype.set normalises a -0 key to +0, so the key this ' +
      'contract publishes is +0 and writing -0 as the expected key here fails; and SameValueZero ' +
      'merges the two into one group. The elements keep their signs - the group holds -0 then 0 - ' +
      'which is the exact mirror of `number/parse@1`, where the sign of a negative zero had to be ' +
      'preserved in the answer and Object.is was adopted for it.',
  },
  {
    title: 'the number 1 and the string "1" are different keys',
    items: [1, '1'],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[1, [1]], ['1', ['1']]] },
    provenance: 'specified',
    rationale:
      'Measured, lodash, Ramda and Object.groupBy merge these into one group, because an object ' +
      'key is a string. Nothing about the caller\'s data says they are the same thing, so this ' +
      'contract keeps them apart.',
  },
  {
    title: 'true and the string "true" are different keys',
    items: [true, 'true'],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[true, [true]], ['true', ['true']]] },
    provenance: 'specified',
    rationale: 'The same statement for the other primitive an object silently stringifies.',
  },
  {
    title: 'two distinct objects are two distinct keys',
    items: ['x', 'y'],
    keyOf: (item: unknown): unknown => (item === 'x' ? RED_ONE : RED_TWO),
    outcome: { kind: 'groups', groups: [[RED_ONE, ['x']], [RED_TWO, ['y']]] },
    provenance: 'specified',
    rationale:
      'Measured, an object-returning grouper collapses both into one group named "[object ' +
      'Object]". Keys are compared by identity here, so two objects that print alike stay apart.',
  },
  {
    title: 'the same object used as a key twice is one key',
    items: ['x', 'y'],
    keyOf: (): unknown => RED_ONE,
    outcome: { kind: 'groups', groups: [[RED_ONE, ['x', 'y']]] },
    provenance: 'specified',
    rationale: 'The other direction of the case above: identity, not shape, decides.',
  },
  {
    title: 'symbols are keys',
    items: ['x', 'y', 'z'],
    keyOf: (item: unknown): unknown => (item === 'y' ? BLUE_SYMBOL : RED_SYMBOL),
    outcome: { kind: 'groups', groups: [[RED_SYMBOL, ['x', 'z']], [BLUE_SYMBOL, ['y']]] },
    provenance: 'specified',
    rationale:
      'The key type is unconstrained, so a symbol is an ordinary key. It is named because ' +
      'constraining the key parameter to PropertyKey - the change that would allow an object ' +
      'return type - would still admit this case while silently breaking the two above it.',
  },
  {
    title: 'undefined and null are two different keys',
    items: ['x', 'y', 'z'],
    keyOf: (item: unknown): unknown => (item === 'y' ? null : undefined),
    outcome: { kind: 'groups', groups: [[undefined, ['x', 'z']], [null, ['y']]] },
    provenance: 'specified',
    rationale:
      'A key function that returns nothing produces the key undefined rather than no group at all. ' +
      'An implementation that treats a missing group and an undefined key as the same thing - the ' +
      'natural shape of `if (!groups.get(key))` - answers this one correctly and the next one ' +
      'wrongly.',
  },

  // --- Keys that name something on Object.prototype -----------------------
  {
    title: 'the key "__proto__"',
    items: ['x', 'y'],
    keyOf: constantKeyProto,
    outcome: { kind: 'groups', groups: [['__proto__', ['x', 'y']]] },
    provenance: 'specified',
    rationale:
      'A Map has no prototype to inherit from, so this key needs no defending. It is named because ' +
      'the obvious object accumulator does not merely answer wrongly here: measured, ' +
      '`(accumulator[key] ??= []).push(item)` throws a TypeError, and Ramda 0.32.0 - which does ' +
      'defend - returns a group of one where the input had two elements.',
  },
  {
    title: 'the key "constructor"',
    items: ['x', 'y'],
    keyOf: constantKeyConstructor,
    outcome: { kind: 'groups', groups: [['constructor', ['x', 'y']]] },
    provenance: 'specified',
    rationale:
      'The same trap under the name that caught `number/parse@1`, where a memoising cache built on ' +
      'a bare object served Object.prototype.constructor as if it were an answer.',
  },
  {
    title: 'the keys "toString" and "hasOwnProperty" together',
    items: ['x', 'y', 'z'],
    keyOf: (item: unknown): unknown => (item === 'y' ? 'hasOwnProperty' : 'toString'),
    outcome: {
      kind: 'groups',
      groups: [['toString', ['x', 'z']], ['hasOwnProperty', ['y']]],
    },
    provenance: 'specified',
    rationale:
      'Two inherited names in one call, so that a mutant defending against a hard-coded list of ' +
      'one is caught. Measured, both throw under a bare object accumulator.',
  },

  // --- How the input is read ----------------------------------------------
  {
    title: 'a hole in a sparse array is an element whose value is undefined',
    items: [1, , 3],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[1, [1]], [undefined, [undefined]], [3, [3]]] },
    expectedCalls: [[1, 0], [undefined, 1], [3, 2]],
    provenance: 'specified',
    rationale:
      'Measured, Object.groupBy and Map.groupBy both visit the hole and pass undefined; a counting ' +
      'loop guarded by `i in items` skips it and answers two groups. The contract follows the ' +
      'language, and pins the calls as well as the answer so that an implementation cannot reach ' +
      'the right groups by a different route.',
  },
  {
    title: 'an explicit undefined element is indistinguishable from a hole',
    items: [1, undefined, 3],
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [[1, [1]], [undefined, [undefined]], [3, [3]]] },
    provenance: 'specified',
    rationale:
      'The other half of the case above, and the reason it is settled that way: iteration cannot ' +
      'tell these two arrays apart, so any answer that distinguished them would be an answer no ' +
      'caller could rely on.',
  },

  // --- The protocol the contract owes the key function --------------------
  {
    title: 'the key function receives the element and its index',
    items: ['a', 'b', 'c'],
    keyOf: indexKey,
    outcome: { kind: 'groups', groups: [[0, ['a']], [1, ['b']], [2, ['c']]] },
    expectedCalls: [['a', 0], ['b', 1], ['c', 2]],
    provenance: 'specified',
    rationale:
      'Two arguments, in that order, index from zero - matching Object.groupBy and Map.groupBy, ' +
      'measured. lodash and Ramda pass the element alone and d3 passes the source array as a ' +
      'third; the language\'s choice is the one a caller writing (item, index) expects.',
  },
  {
    title: 'a key function that would answer differently on a second look is never asked twice',
    items: ['x', 'y'],
    keyOf: answersDifferentlyOnASecondLook(),
    outcome: { kind: 'groups', groups: [['first-look', ['x', 'y']]] },
    expectedCalls: [['x', 0], ['y', 1]],
    provenance: 'specified',
    rationale:
      'The third impure shape, and the one that shows why "the key function must be pure" is the ' +
      'wrong way to write this down. The contract does not assume the second answer would agree; ' +
      'it never asks for it. An implementation that reads the key twice - once to find the group, ' +
      'once to create it - files these elements under two different keys, which is exactly the ' +
      'defect the obligation exists to forbid.',
  },
  {
    title: 'a key function that writes to its element is not prevented from doing so',
    items: [DANA, DANA],
    keyOf: renamesTheTeamItRead,
    outcome: { kind: 'groups', groups: [['green', [DANA]], ['renamed', [DANA]]] },
    expectedCalls: [[DANA, 0], [DANA, 1]],
    provenance: 'specified',
    rationale:
      'The second impure shape. The write is the caller\'s, and this contract neither prevents nor ' +
      'hides it: the key function reads the team, returns it, and renames it, so one object lands ' +
      'in two groups under the two keys it produced. That answer proves three things at once - the ' +
      'groups hold the caller\'s own object rather than a copy, the write reached it, and the ' +
      'contract used each key exactly as it was returned. The non-mutation property of block 4.3 is ' +
      'a promise about what *this function* writes, and this case is what stops it from being read ' +
      'as a claim about what the key function may do.',
  },
  {
    title: 'an exception from the key function propagates unchanged',
    items: ['x', 'y'],
    keyOf: throwsTheKeyFunctionError,
    outcome: { kind: 'propagates' },
    expectedCalls: [['x', 0]],
    provenance: 'specified',
    rationale:
      'The first impure shape. The very same error object leaves this function - not wrapped, not ' +
      'swallowed, not turned into an empty Map, which would claim a grouping happened. It stops at ' +
      'the first element rather than collecting the rest, and the input is left as it was found. ' +
      'Measured, Object.groupBy and Map.groupBy propagate too.',
  },
]

export const untypedCallerCases: readonly UntypedCallerCase[] = [
  {
    title: 'null',
    items: null,
    keyOf: identityKey,
    outcome: { kind: 'throws', errorName: 'TypeError' },
    provenance: 'specified',
    rationale:
      'A TypeError from the iteration itself, which is what the language does - measured, ' +
      'Object.groupBy, Map.groupBy, Ramda and d3 all throw here. lodash answers zero groups, and ' +
      'that is the wrong answer this contract is refusing: an API that returned null instead of an ' +
      'empty array becomes "nothing to report" rather than a stack trace.',
  },
  {
    title: 'undefined',
    items: undefined,
    keyOf: identityKey,
    outcome: { kind: 'throws', errorName: 'TypeError' },
    provenance: 'specified',
    rationale: 'The same refusal for the other absent value, which reaches this function as often.',
  },
  {
    title: 'a plain object',
    items: { a: 1, b: 2 },
    keyOf: identityKey,
    outcome: { kind: 'throws', errorName: 'TypeError' },
    provenance: 'specified',
    rationale:
      'A plain object is not iterable, so it refuses. It is named because lodash groups an ' +
      'object\'s values, measured, and a caller moving from lodash would otherwise discover the ' +
      'difference in production rather than here.',
  },
  {
    title: 'a number',
    items: 42,
    keyOf: identityKey,
    outcome: { kind: 'throws', errorName: 'TypeError' },
    provenance: 'specified',
    rationale: 'Neither an array nor an iterable, and refused as one rather than read as empty.',
  },
  {
    title: 'a Set',
    items: new Set([1, 2, 3]),
    keyOf: parityKey,
    outcome: { kind: 'groups', groups: [['odd', [1, 3]], ['even', [2]]] },
    provenance: 'specified',
    rationale:
      'Grouped, and settled here rather than left to the implementation. The signature declares ' +
      'arrays, which is the domain this contract is written for; but an implementation that ' +
      'iterates and one that counts over `length` disagree here in silence - measured, the counting ' +
      'one answers zero groups - and a contract that lets two conformant implementations answer ' +
      'differently has not settled anything.',
  },
  {
    title: 'a string',
    items: 'aab',
    keyOf: identityKey,
    outcome: { kind: 'groups', groups: [['a', ['a', 'a']], ['b', ['b']]] },
    provenance: 'specified',
    rationale:
      'A string is an iterable of its characters, so it groups rather than refusing. Named because ' +
      'a string also has a `length`, so it is the one input where the counting loop and iteration ' +
      'agree - which is what makes the Set case above the one that decides.',
  },
]
