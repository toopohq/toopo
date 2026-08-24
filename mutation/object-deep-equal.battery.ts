/**
 * The `object/deep-equal@1` reference battery.
 *
 * It injects into `reference.ts` and asks the question the contract exists to answer: does this suite
 * refuse an implementation that compares the way the ecosystem compares? Most of the cells below are
 * not invented - they are `fast-deep-equal`, `dequal` and `lodash.isEqual`, transplanted into the
 * reference and offered to the suite.
 *
 * **The specification battery is separate and injects into `contract.ts` and `edge-cases.ts`.** The
 * declaration under `unreachableGuards` says, in writing, that this battery reaches the
 * implementation and nothing else. ADR-0075.
 *
 * ---------------------------------------------------------------------------
 * Three of these cells are the faults this file was written with
 * ---------------------------------------------------------------------------
 *
 * `theAuthoringFaults` in `contract.ts` records them and DE-01, DE-04 and DE-06 put them back. That
 * is the whole argument for the speculation clause: no shipped implementation gets the witness wrong,
 * so the clause founds no admission - what founds it is that the fault is easy enough for the person
 * writing the clause to commit while writing it, three times, in one file.
 *
 * **Every pin below was read off a replay and none was predicted.** The first pass disagreed on
 * several cells, which is what a pin is for and what a prediction would have hidden.
 *
 * The prefix is `DE-`, two letters, on the rule `CLAUDE.md` records. Signature mutants continue the
 * global `S-` counter and probes the global `F-`.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'E', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const LEAVE_THE_PATH = `const leave = (underway: Underway, a: object, b: object): void => {
  underway.get(a)?.delete(b)
}`

const OWN_KEYS = `  Reflect.ownKeys(value).filter(
    (key) => Object.getOwnPropertyDescriptor(value, key)?.enumerable === true,
  )`

const ELEMENT_BY_ELEMENT = `    if (!Object.is(a[at], b[at])) return false`

const A_MEMBER_IS_MATCHED_BY_ITS_DATA = `      if (!compare(left, b[at], underway)) continue`

const THE_TAG_READS_THE_SLOT = `  const tag = Object.prototype.toString.call(a)`

const NOTHING_OBSERVABLE = `  if (OPAQUE.has(tag)) return false`

const A_PATTERN_IS_SOURCE_AND_FLAGS = `    return a.source === other.source && a.flags === other.flags`

const AN_INSTANT = `  if (a instanceof Date) return Object.is(a.getTime(), (b as Date).getTime())`

const AN_ERROR_IS_ITS_NAME_AND_MESSAGE = `    if (a.name !== other.name || a.message !== other.message) return false`

const THE_SLOT_SETTLES_ONLY_THE_SLOT = `  if (asBuiltIn(a, b, underway, pending) === false) return false`

const AN_ARRAY_CARRIES_ITS_LENGTH = `  if (Array.isArray(a) && a.length !== (b as readonly unknown[]).length) return false`

const IDENTITY_FIRST = `  if (Object.is(a, b)) return true`

const THE_PROTOTYPE_IS_PART_OF_THE_VALUE = `  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false`

const A_SET_IS_ITS_MEMBERS = `  if (a instanceof Set) return sameMembers([...a], [...(b as Set<unknown>)], underway)`

const THE_ENTRY = `export const deepEqual = (left: unknown, right: unknown): boolean =>
  compare(left, right, new Map())`

const THE_PAIR_IS_ENTERED_MARKS = `  enter(underway, a, b)`

// ---------------------------------------------------------------------------
// Guard identifiers, named once
// ---------------------------------------------------------------------------

const REFLEXIVE_UNDER_A_COPY = 'p1-reflexive-under-a-copy'
const SYMMETRIC = 'p2-symmetric'
const REFLEXIVE = 'p3-reflexive'
const ORDER_IS_NOT_READ = 'p5-order-of-declaration-is-not-read'
const NOT_ALWAYS_YES = 'p6-a-perturbed-clone-is-not-the-original'

const NEITHER_ARGUMENT_MOVES = 'never-mutates-its-arguments'

const TYPE_IDENTITY = 'signature-is-the-declared-type'
const TAKES_TWO_UNKNOWNS = 'signature-takes-two-unknowns'
const RETURNS_A_BOOLEAN = 'signature-returns-a-boolean'

const behaviour: readonly Mutant[] = [
  sameOnEveryLens(
    'DE-01',
    'memoises the pairs it has compared instead of keeping them on a path, so a candidate that ' +
      'failed inside a Set leaves the pair it tried marked as equal. This is the fault this file ' +
      'was written with, and the answer it produces depends on the order the keys of an object were ' +
      'declared in. **The two rows written to witness it do not separate it**, and only the replay ' +
      'said so: measured over the four forms, `false` against `false` as the witness is published in ' +
      'either key order, and `false` against `true` only when the keys are transposed *and* the ' +
      'right-hand `also` holds the very Set member the failed candidate tried. The published witness ' +
      'holds a fresh object there, and the path is keyed by identity - so nothing is ever found again. ' +
      'The row that would witness it is a row of `caseTables`, which is inside the digest a lockfile ' +
      'holds, so it cannot be added',
    [reference(LEAVE_THE_PATH, `const leave = (_underway: Underway, _a: object, _b: object): void => {}`)],
    survived('its-witness-is-frozen-out'),
  ),

  sameOnEveryLens(
    'DE-02',
    'walks `Object.keys` instead of `Reflect.ownKeys`, so data under a symbol key is invisible. Four ' +
      'of the six shipped implementations measured do exactly this, and two objects whose data ' +
      'differs compare equal with nothing said',
    [reference(OWN_KEYS, `  Object.keys(value)`)],
    killed(['data-under-a-symbol-key-is-data']),
  ),

  sameOnEveryLens(
    'DE-03',
    'compares typed-array elements with `===`, so a float array holding NaN is not equal to its own ' +
      'structured clone. Three of the five shipped implementations measured answer this wrongly, ' +
      'and it is the row the admission oracle caught them on',
    [reference(ELEMENT_BY_ELEMENT, `    if (!(a[at] === b[at])) return false`)],
    killed(['not-a-number-inside-a-float-array-equals-itself']),
  ),

  sameOnEveryLens(
    'DE-04',
    'dispatches on `instanceof` instead of on the tag, so a built-in carrying its value in an ' +
      'internal slot falls through to the key walk and two of them compare equal because neither has ' +
      'an own property. The second fault this file was written with',
    [reference(THE_TAG_READS_THE_SLOT, `  const tag = a instanceof Number ? '[object Number]' : 'nothing'`)],
    killed([
      'a-boxed-boolean-carries-a-boolean',
      'a-boxed-bigint-carries-a-bigint',
      'two-promises-are-not-compared',
      'two-weak-collections-are-not-compared',
    ]),
  ),

  sameOnEveryLens(
    'DE-05',
    'reads into a Promise, a WeakMap and a WeakSet as though they were objects, so two of any of ' +
      'them compare equal - none has an own property to tell them apart. A silent `true` on values ' +
      'whose contents are unreadable by construction',
    [reference(NOTHING_OBSERVABLE, `  if (false) return false`)],
    killed(['two-promises-are-not-compared', 'two-weak-collections-are-not-compared']),
  ),

  sameOnEveryLens(
    'DE-06',
    'lets a built-in branch answer for the whole value instead of for its slot, so a Date, a Set or ' +
      'a typed array carrying an own property beside its slot compares equal to the same value ' +
      'without one. The third fault this file was written with, and the one that moved the repair ' +
      'out of the branches',
    [reference(THE_SLOT_SETTLES_ONLY_THE_SLOT, `  const settled = asBuiltIn(a, b, underway, pending)\n\n  if (settled !== null) return settled`)],
    killed([NOT_ALWAYS_YES]),
  ),

  sameOnEveryLens(
    'DE-07',
    'compares a pattern by its source alone, so `/a/g` and `/a/i` are one pattern. A caller matching ' +
      'case-insensitively and a caller not doing so hold the same value',
    [reference(A_PATTERN_IS_SOURCE_AND_FLAGS, `    return a.source === other.source`)],
    killed(['a-pattern-flag-is-part-of-it']),
  ),

  sameOnEveryLens(
    'DE-08',
    'compares two instants with `===`, so two invalid dates are not equal to each other - the NaN ' +
      'trap arriving inside a built-in, which three of the five shipped implementations fall into',
    [reference(AN_INSTANT, `  if (a instanceof Date) return a.getTime() === (b as Date).getTime()`)],
    killed(['an-invalid-date-equals-an-invalid-date']),
  ),

  sameOnEveryLens(
    'DE-09',
    'reads an error\'s name and not its message, so two errors that happened for different reasons ' +
      'are one error. `dequal` does this, and it does it on the type a caller is most likely to be ' +
      'comparing when something has gone wrong',
    [reference(AN_ERROR_IS_ITS_NAME_AND_MESSAGE, `    if (a.name !== other.name) return false`)],
    killed(['a-message-is-part-of-an-error']),
  ),

  sameOnEveryLens(
    'DE-10',
    'drops the array length check, so an array and the same array with a trailing hole are equal - ' +
      'their own keys are identical and only the length says otherwise',
    [reference(AN_ARRAY_CARRIES_ITS_LENGTH, `  if (false) return false`)],
    killed(['a-trailing-hole-changes-the-length']),
  ),

  sameOnEveryLens(
    'DE-11',
    'compares primitives with `===` instead of `Object.is`, so NaN is not equal to itself and `-0` ' +
      'is equal to `0`. Both halves of the language\'s own rule, moved at once',
    [reference(IDENTITY_FIRST, `  if (a === b) return true`)],
    killed(['not-a-number-equals-itself', REFLEXIVE_UNDER_A_COPY, REFLEXIVE]),
  ),

  sameOnEveryLens(
    'DE-12',
    'stops comparing prototypes, so an instance of a class and a plain object carrying the same ' +
      'fields are one value. `inputDomain` says in as many words that a caller who wants them equal ' +
      'wants a different function',
    [reference(THE_PROTOTYPE_IS_PART_OF_THE_VALUE, `  if (false) return false`)],
    // Two of the four rows first pinned here are settled by the slot before the prototype is
    // reached, so they are green either way and the replay is what said so.
    killed(['a-class-instance-is-not-its-fields', 'a-null-prototype-object-is-not-a-plain-one']),
  ),

  sameOnEveryLens(
    'DE-13',
    'matches a Set member by reference rather than by its data, which is exactly what ' +
      '`fast-deep-equal/es6` does - the entry point its own README sends a caller to for collections. ' +
      'A Set of objects is then not equal to its own structured clone',
    [
      reference(
        A_MEMBER_IS_MATCHED_BY_ITS_DATA,
        `      if (!Object.is(left, b[at])) continue`,
      ),
    ],
    killed(['a-set-member-is-compared-by-its-data', 'a-map-key-is-compared-by-its-data']),
  ),

  sameOnEveryLens(
    'DE-14',
    'walks a Set as a plain object, which is what `fast-deep-equal` and `dequal/lite` do: a Set has ' +
      'no own enumerable property, so two of them compare equal whatever they hold. The sharpest ' +
      'silent wrong answer in the catalogue',
    [reference(A_SET_IS_ITS_MEMBERS, `  if (a instanceof Set) return true`)],
    killed([
      'two-sets-of-different-members-are-different',
      'two-sets-of-different-size-are-different',
    ]),
  ),
]

const signatures: readonly Mutant[] = [
  sameOnEveryLens(
    'S-30',
    'narrows the declared input to a record, so a caller comparing two values whose type they do ' +
      'not know - which is what this function is for - no longer compiles',
    [
      reference(
        THE_ENTRY,
        `export const deepEqual = (a: Record<string, unknown>, b: Record<string, unknown>): boolean =>\n  compare(a, b, new Map())`,
      ),
    ],
    killed([TYPE_IDENTITY, TAKES_TWO_UNKNOWNS]),
  ),

  sameOnEveryLens(
    'S-31',
    'widens the answer to `boolean | null`, which would put a failure channel into a total function ' +
      'and make every caller handle an absence that cannot happen',
    [
      reference(
        THE_ENTRY,
        `export const deepEqual = (a: unknown, b: unknown): boolean | null => compare(a, b, new Map())`,
      ),
    ],
    killed([TYPE_IDENTITY, RETURNS_A_BOOLEAN]),
  ),

  sameOnEveryLens(
    'S-32',
    'makes the second argument optional, which puts a second arity into the major - and there is ' +
      'nothing a one-argument comparison could sensibly mean',
    [
      reference(
        THE_ENTRY,
        `export const deepEqual = (a: unknown, b?: unknown): boolean => compare(a, b, new Map())`,
      ),
    ],
    killed([TYPE_IDENTITY, TAKES_TWO_UNKNOWNS]),
  ),
]

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-14',
    'marks each visited object with a temporary property and removes it on the way out, which is ' +
      'the textbook way to detect a cycle and the technique this contract declares ' +
      '`never mutates its arguments` against. The removal is deliberately left off one path, which ' +
      'is what makes it the shape a walk reaches the first time somebody makes cycle detection ' +
      '"cheaper" rather than an invented defect',
    [
      reference(
        THE_PAIR_IS_ENTERED_MARKS,
        `  enter(underway, a, b)\n  ;(a as Record<string, unknown>)['__seen'] = true`,
      ),
    ],
    killed([NEITHER_ARGUMENT_MOVES]),
  ),

  probe(
    UNDER,
    'F-15',
    'caches the last pair and its verdict and serves it whenever both arguments match by reference, ' +
      'which answers correctly until one of the two graphs is mutated between calls and then answers ' +
      'the previous question. It asks whether anything here is a sensor for a stale answer, and the ' +
      'measured answer is no. `no-ambient-input-from-history` was written for this implementation and ' +
      'the contract names it in the reason for `no ambient input` - it asks the same pair before and ' +
      'after an arbitrary history, and a history moves the cached references, so the cache misses and ' +
      'recomputes correctly. What separates them is a call, a mutation of a reachable object, and a ' +
      'second call through the same references; that probe belongs in `properties.test.ts`, which is ' +
      'frozen',
    [
      reference(
        THE_ENTRY,
        `let lastLeft: unknown\nlet lastRight: unknown\nlet lastVerdict = false\n\n` +
          `export const deepEqual = (a: unknown, b: unknown): boolean => {\n` +
          `  if (lastLeft === a && lastRight === b) return lastVerdict\n\n` +
          `  lastVerdict = compare(a, b, new Map())\n  lastLeft = a\n  lastRight = b\n\n` +
          `  return lastVerdict\n}`,
      ),
    ],
    survived('its-witness-is-frozen-out'),
  ),
]


export const battery: Battery = {
  name: 'object-deep-equal',
  contractPath: 'contracts/typescript/object/deep-equal',
  timeZone: 'UTC',
  calibrationMutant: 'DE-14',

  arms: [
    {
      id: 'E',
      ref: 'HEAD',
      convention:
        'total - one export, a boolean answer for every pair the declared domain carries, and no ' +
        'failure channel',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['E'],
      edits: [],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'the four rows of the speculation clause, declared here rather than as an unprobed region ' +
        'because a mutant does exist. DE-01 is that mutant and these rows do not separate it: ' +
        'measured over the four forms of the witness, the memoising walk answers `false` exactly as ' +
        'the sound one does in either key order, and answers `true` only when the keys are ' +
        'transposed *and* the right-hand `also` holds the very Set member the failed candidate ' +
        'tried. The published witness holds a fresh object there, and the path is keyed by identity. ' +
        'The row that would separate them belongs in `caseTables`, which is inside a published ' +
        'digest, so no cell of this battery or of any other reaches them for the life of this ' +
        'major. ADR-0161.',
      guards: [
        'a-failed-candidate-leaves-nothing-behind',
        'a-failed-candidate-leaves-nothing-behind-transposed',
        'and-answers-the-same-either-way-round',
        'and-answers-the-same-either-way-round-transposed',
      ],
    },
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the case ' +
        'table, the profile list or the universal-property declarations.',
      guards: [
        'every-case-is-addressed',
        'every-case-is-grouped',
        'every-case-is-justified',
        'settles-each-pair-once',
        'answers-both-ways',
        'every-profile-has-samples',
        'every-profile-is-addressed',
        'every-class-the-vocabulary-declares-is-sampled',
        'universal-properties-answered',
        'the-alphabet-reaches-what-the-contract-is-about',
      ],
    },
  ],

  unprobedRegions: [
    /**
     * A branch of the walk this battery does not perturb, one entry per branch.
     *
     * They are apart rather than in one list because the reason is what a reader needs: *no cell
     * reaches the built-ins* would be a sentence about the battery, where *nothing here compares a
     * bigint by value* names the cell somebody would write next.
     */
    {
      nature: 'claims detection',
      reason:
        'the primitive comparison. Every cell here perturbs a walk over objects and nothing edits ' +
        'the leaf test, so a cell answering `1n == 1` is what would redden these two.',
      guards: ['a-bigint-is-not-its-number', 'a-bigint-is-not-its-number-transposed'],
    },
    {
      nature: 'claims detection',
      reason:
        'the boxed-primitive slot. DE-05 reads a tag rather than a prototype and DE-12 stops ' +
        'comparing prototypes, and neither makes a box answer as its own primitive: a cell that ' +
        'unwrapped one before comparing would redden these four.',
      guards: [
        'a-boxed-primitive-is-not-its-primitive',
        'a-boxed-primitive-is-not-its-primitive-transposed',
        'a-boxed-number-carries-a-number',
        'a-boxed-number-carries-a-number-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'what a key set is. DE-02 walks `Object.keys` and reaches the symbol rows only; nothing ' +
        'here drops a key holding `undefined`, reads a key set in declaration order, or reads a ' +
        'getter twice.',
      guards: [
        'a-key-holding-undefined-is-not-a-missing-key',
        'a-key-holding-undefined-is-not-a-missing-key-transposed',
        'the-order-keys-were-written-in-is-not-read-transposed',
        'a-getter-is-read-as-the-value-it-returns-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'a hole in a list. The length test and the key set are two separate lines and no cell edits ' +
        'either, so nothing here reads `[, 1]` as `[undefined, 1]`.',
      guards: ['a-hole-is-not-an-undefined', 'a-hole-is-not-an-undefined-transposed'],
    },
    {
      nature: 'claims detection',
      reason:
        'the Map slot. DE-04 compares Sets by size alone; the Map arm is beside it and untouched, ' +
        'so nothing here reads a Map as an empty object or drops the value under a key.',
      guards: [
        'a-populated-map-is-not-an-empty-one',
        'a-populated-map-is-not-an-empty-one-transposed',
        'a-map-value-is-compared',
        'a-map-value-is-compared-transposed',
        'the-order-members-were-added-in-is-not-read-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the instant slot beyond the NaN trap. DE-08 compares two instants with `===` and reddens ' +
        'the row about two invalid dates; nothing here loses an instant altogether.',
      guards: [
        'an-invalid-date-is-not-an-instant',
        'an-invalid-date-is-not-an-instant-transposed',
        'two-instants-are-one-date-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the pattern slot. Nothing here compares a `RegExp` by anything but its source and flags, ' +
        'so the rows saying which parts of one are read are green either way.',
      guards: [
        'a-pattern-source-is-part-of-it',
        'a-pattern-source-is-part-of-it-transposed',
        'a-pattern-is-its-source-and-its-flags-transposed',
        'where-a-pattern-stopped-is-not-part-of-it-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the typed-array slot. DE-12 stops comparing prototypes and the kind rows stay green, ' +
        'because the slot settles two typed arrays of different kinds before a prototype is ' +
        'reached - measured, and it is why those two left the pin of DE-12.',
      guards: [
        'a-typed-array-kind-is-part-of-it',
        'a-typed-array-kind-is-part-of-it-transposed',
        'negative-zero-inside-a-float-array-is-not-zero',
        'negative-zero-inside-a-float-array-is-not-zero-transposed',
        'two-typed-arrays-of-one-kind-are-their-elements-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the error slot beyond the name. DE-09 reads the name of an error and not its message; ' +
        'nothing here drops a cause, and the kind row is settled by the slot before a prototype is ' +
        'read - the same reading that took it out of the pin of DE-12.',
      guards: [
        'a-cause-is-part-of-an-error',
        'a-cause-is-part-of-an-error-transposed',
        'an-error-kind-is-part-of-it',
        'an-error-kind-is-part-of-it-transposed',
        'two-errors-of-one-message-are-one-error-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'a cycle that terminates without assuming too much. The path is entered and left by two ' +
        'lines and DE-01 edits the second; nothing here stops entering, which is what would make a ' +
        'cycle read as its own unrolling.',
      guards: [
        'a-cycle-is-not-the-same-as-its-unrolling',
        'a-cycle-is-not-the-same-as-its-unrolling-transposed',
        'a-cycle-terminates-transposed',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'a function, which this contract compares by reference and by nothing else. Nothing here ' +
        'walks into one, so the two rows saying it does not are green either way.',
      guards: ['two-functions-are-not-compared', 'two-functions-are-not-compared-transposed'],
    },
    {
      nature: 'claims detection',
      reason:
        'the benchmark profiles and the transitivity property. A profile guard reads what the ' +
        'contract declares about its samples, and p4 needs three values disagreeing in a particular ' +
        'way; no cell here produces either.',
      guards: ['profile-two-renders-of-one-view', 'p4-transitive'],
    },
  ],

  mutants: [...behaviour, ...signatures, ...probes],
}
