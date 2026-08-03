/**
 * The `array/group-by@1` battery.
 *
 * M-01 to M-20 are defects of behaviour and carry the mutation score. S-1 to S-7 are defects of the
 * *signature*: they answer every call correctly and are wrong only about the type they declare, which
 * is the question this contract was written third to answer. F-5 and F-6 are probes rather than
 * defects - they ask whether a property's generators reach the region it claims to guard - so they
 * are kept out of the score.
 *
 * They were written as F-1 and F-2, which `date/add@1` already used for two different probes. A
 * mutant has one name in the whole project - the rule the `D-` prefix was introduced for - and the
 * `F-` family is where it is kept globally rather than per contract: `date/add@1` holds F-1 and F-2,
 * `number/parse@1` took F-3 and F-4 for that reason, and this contract now holds F-5 and F-6.
 *
 * There is one arm. The other two contracts carry a second because the error convention was under
 * measurement there; this contract is total, publishes no reason, and has no convention to compare.
 *
 * There are two lenses, and the second is the instrument this contract needed. `identity-blind`
 * replaces the one assertion that compares the implementation's whole type against the contract's -
 * `expectTypeOf(groupBy).toEqualTypeOf<GroupBy>()` - with a check that it is a function at all. The
 * difference between the two columns is exactly what that assertion catches on a generic signature
 * that the call-site inference checks beside it do not, which is the thing nobody in this repository
 * knew before running it.
 *
 * The battery is measured under `UTC` so that two runs on two machines are the same run. No verdict
 * here depends on the zone; this contract reads no clock.
 */

import type { Battery, Edit, Expectation, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, probe, reference, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: ['identity-blind'] }

const { sameOnEveryLens, perLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites, quoted from `reference.ts`
// ---------------------------------------------------------------------------

const SIGNATURE = `export const groupBy = <T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
): Map<K, T[]> => {`

const DECLARE = `  const groups = new Map<K, T[]>()
  let index = 0`

const LOOP = `  for (const item of items) {`

const KEY_CALL = `    const key = keyOf(item, index)`

const KEY = `    const key = keyOf(item, index)
    const existing = groups.get(key)`

const INSERT = `    if (existing === undefined) groups.set(key, [item])
    else existing.push(item)`

const STEP = `    index += 1`

const RETURN = `  return groups`

const LOOP_BODY = `${LOOP}
    // One call per element, and the only one: the key is read once and used both to find the group
    // and to create it. Asking twice would let a key function that is not a function of its element
    // alone put an element in one group under a key it never returned for it.
${KEY}

    // A fresh array per group, never the input and never shared between groups, so that a caller
    // editing one group reaches neither the array it grouped nor any other group.
${INSERT}

${STEP}
  }`

/**
 * A defect of the declared type. Every one of them groups exactly as the contract requires, so the
 * behavioural half of the suite is blind to all of them by construction and the only question is
 * which type assertion notices.
 *
 * `perLens` is the shared form in `mutants.ts`. It was written here and stayed here while this was
 * the only contract with a lens that blinds the identity assertion; `string/levenshtein@1` is the
 * second, and it writes the same thing.
 */
const signatureDefect = (
  id: string,
  description: string,
  edits: readonly Edit[],
  asCommitted: Expectation,
  identityBlind: Expectation,
): Mutant =>
  perLens(id, description, edits, {
    'as-committed': asCommitted,
    'identity-blind': identityBlind,
  })

// ---------------------------------------------------------------------------
// Test titles the battery pins by name
// ---------------------------------------------------------------------------

const PARTITION = 'p1-the-groups-partition-the-input'
const COHERENCE =
  'p2-a-group-is-coherent-and-stable'
const GROUP_ORDER = 'p3-groups-come-back-in-first-seen-order'
const NO_SHARING = 'p4-no-group-is-shared-or-aliased'
const CALL_PROTOCOL =
  'p5-one-call-per-element'
const NO_MUTATION = 'no-mutation-of-arguments'
const DETERMINISTIC = 'determinism'
const NO_AMBIENT_INPUT = 'no-ambient-input-from-history'

const TYPE_IDENTITY = 'signature-is-the-declared-type'
const INFERS_ELEMENT = 'signature-infers-the-element-type'
const INFERS_KEY = 'signature-infers-the-key-type'
const INDEX_IS_SECOND = 'signature-passes-the-index'
const READONLY_INPUT = 'signature-accepts-a-readonly-array'
const OWNED_GROUPS = 'signature-returns-owned-groups'
const REFUSES_A_NON_ARRAY = 'signature-refuses-a-non-array'

const SPARSE = 'a-hole-in-a-sparse-array'
const A_SET = 'a-set'
const A_STRING = 'a-string'
const REACHES_EVERY_REGION = 'support-the-key-functions-reach-every-region'
const INTEGER_LIKE_ORDER = 'integer-like-keys-keep-first-occurrence-order'
const NAN_KEYS = 'nan-keys-form-one-group'
const DISTINCT_OBJECT_KEYS = 'two-distinct-objects-are-two-keys'
const SAME_OBJECT_KEY = 'one-object-used-twice-is-one-key'
const PROTO_KEY = 'the-key-proto'
const SECOND_LOOK = 'a-key-function-is-never-asked-twice'
const EMPTY_ARRAY = 'the-empty-array'

// ---------------------------------------------------------------------------
// M-01 to M-20 - defects of behaviour
// ---------------------------------------------------------------------------

const behaviour: readonly Mutant[] = [
  sameOnEveryLens(
    'M-01',
    'accumulates into a bare object keyed by String(key), then builds the Map from it - the whole ' +
      'alternative return type, injected as a defect. It is wrong in three independent ways at ' +
      'once: it reorders keys that look like integers, it merges keys a string cannot tell apart, ' +
      'and it throws a TypeError on a key that names something on Object.prototype',
    [
      reference(DECLARE, `  const buckets: Record<string, T[]> = {}\n  let index = 0`),
      reference(
        KEY,
        `    const key = String(keyOf(item, index))\n    const existing = buckets[key]`,
      ),
      reference(
        INSERT,
        `    if (existing === undefined) buckets[key] = [item]\n    else existing.push(item)`,
      ),
      reference(RETURN, `  return new Map(Object.entries(buckets)) as unknown as Map<K, T[]>`),
    ],
    killed([INTEGER_LIKE_ORDER, PROTO_KEY]),
  ),
  sameOnEveryLens(
    'M-02',
    'hands back the input array as the group when there is only one - the fast path nobody writes ' +
      'on purpose and everybody writes eventually. It mutates nothing, so the non-mutation property ' +
      'is green on it; it answers the right elements in the right order under the right key, so the ' +
      'partition, coherence and order properties are green too',
    [
      reference(
        RETURN,
        `  if (groups.size === 1) {\n` +
          `    const only = [...groups.keys()][0] as K\n\n` +
          `    return new Map([[only, items as T[]]])\n` +
          `  }\n\n${RETURN}`,
      ),
    ],
    killed([NO_SHARING]),
  ),
  sameOnEveryLens(
    'M-03',
    'sorts the input in place before walking it, the shape of an implementation that means to group ' +
      'contiguous runs',
    [reference(DECLARE, `  (items as T[]).sort()\n\n${DECLARE}`)],
    killed([NO_MUTATION]),
  ),
  sameOnEveryLens(
    'M-04',
    'answers an empty Map for every input - the obvious defect the calibration needs, and the one ' +
      'that separates a contract with a liveness property from a contract without one',
    [reference(RETURN, `  return new Map<K, T[]>()`)],
    killed([PARTITION]),
  ),
  sameOnEveryLens(
    'M-05',
    'drops the last element',
    [reference(LOOP, `  for (const item of items.slice(0, -1)) {`)],
    killed([PARTITION]),
  ),
  sameOnEveryLens(
    'M-06',
    'prepends rather than appends, so a group comes back in reverse input order',
    [
      reference(
        INSERT,
        `    if (existing === undefined) groups.set(key, [item])\n    else existing.unshift(item)`,
      ),
    ],
    killed([COHERENCE]),
  ),
  sameOnEveryLens(
    'M-07',
    'sorts the groups by key on the way out, which is what a caller who wanted a stable order would ' +
      'reach for and is not the order this contract publishes',
    [
      reference(
        RETURN,
        `  return new Map([...groups.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]))))`,
      ),
    ],
    killed([GROUP_ORDER]),
  ),
  sameOnEveryLens(
    'M-08',
    'finds the group by scanning the entries with ===, so a NaN key never matches an existing one ' +
      'and the group it had is overwritten',
    [
      reference(
        KEY,
        `${KEY_CALL}\n` +
          `    const found = [...groups.entries()].find(([candidate]) => candidate === key)\n` +
          `    const existing = found === undefined ? undefined : found[1]`,
      ),
    ],
    // Four guards redden and the rule in `mutants.ts` says to name all of a set of five or fewer, so
    // this pin named one where it owed four. Found while giving `profileKeyFunctions` an address: the
    // benchmark guard below is what establishes that those key functions are run against an
    // implementation at all, and it was red on a complete run while nothing named it.
    killed([NAN_KEYS, 'profile-one-group-per-element', 'p1-the-groups-partition-the-input', 'p2-a-group-is-coherent-and-stable']),
  ),
  sameOnEveryLens(
    'M-09',
    'asks the key function twice for a key it has not seen - once to look the group up, once to ' +
      'create it. Every other guard in this contract draws a pure key function, so all of them agree ' +
      'with the answer; the obligation of block 4.2 is the only thing that can see it',
    [
      reference(KEY, `    const existing = groups.get(keyOf(item, index))`),
      reference(
        INSERT,
        `    if (existing === undefined) groups.set(keyOf(item, index), [item])\n` +
          `    else existing.push(item)`,
      ),
    ],
    killed([CALL_PROTOCOL, SECOND_LOOK]),
  ),
  sameOnEveryLens(
    'M-10',
    'passes a one-based index to the key function',
    [reference(KEY_CALL, `    const key = keyOf(item, index + 1)`)],
    killed([CALL_PROTOCOL]),
  ),
  sameOnEveryLens(
    'M-11',
    'reads the input by counting over `length` and skipping holes - the fastest correct-looking ' +
      'loop, and what lodash does. Every property here draws dense arrays, so none of them can see ' +
      'it: only the two named cases that were written from the measurement can',
    [
      reference(
        LOOP_BODY,
        `  for (let at = 0; at < items.length; at += 1) {\n` +
          `    if (!(at in items)) continue\n\n` +
          `    const key = keyOf(items[at] as T, at)\n` +
          `    const existing = groups.get(key)\n\n` +
          `    if (existing === undefined) groups.set(key, [items[at] as T])\n` +
          `    else existing.push(items[at] as T)\n\n` +
          `${STEP}\n  }`,
      ),
    ],
    killed([SPARSE, A_SET]),
  ),
  sameOnEveryLens(
    'M-12',
    'accumulates every element into one array shared by every group',
    [
      reference(DECLARE, `  const groups = new Map<K, T[]>()\n  const shared: T[] = []\n  let index = 0`),
      reference(INSERT, `    shared.push(item)\n    if (existing === undefined) groups.set(key, shared)`),
    ],
    killed([NO_SHARING]),
  ),
  sameOnEveryLens(
    'M-13',
    'writes the key onto each element it groups, the shape of an implementation that means to make ' +
      'the grouping inspectable later',
    [
      reference(
        KEY,
        `${KEY}\n    if (typeof item === 'object' && item !== null) Object.assign(item, { group: key })`,
      ),
    ],
    killed([NO_MUTATION]),
  ),
  sameOnEveryLens(
    'M-14',
    'memoises the answer in a WeakMap keyed by the input array, ignoring which key function it was ' +
      'given. It was written expecting a survivor - the same shape survives the whole battery of ' +
      '`number/parse@1` twice - and it is killed, by two guards neither of which was put there for ' +
      'it. One is a named case from the untyped-caller table: a string is a legal input here and ' +
      'not a legal WeakMap key, so the cache throws on it. The other is the precondition test that ' +
      'checks the property generators reach every region, and it is the interesting one: it is the ' +
      'only guard in this contract that calls the function several times on *one* array with ' +
      'different key functions, which is exactly what a cache keyed on the array alone gets wrong. ' +
      'A guard written to police the arbitraries turned out to be the contract\'s only sensor for a ' +
      'whole class of caching defect',
    [
      reference(
        SIGNATURE,
        `const CACHE = new WeakMap<object, Map<unknown, unknown[]>>()\n\n${SIGNATURE}`,
      ),
      reference(
        DECLARE,
        `  const cached = CACHE.get(items as object)\n` +
          `  if (cached !== undefined) return cached as unknown as Map<K, T[]>\n\n${DECLARE}`,
      ),
      reference(
        RETURN,
        `  CACHE.set(items as object, groups as unknown as Map<unknown, unknown[]>)\n\n${RETURN}`,
      ),
    ],
    killed([A_STRING, REACHES_EVERY_REGION]),
  ),
  sameOnEveryLens(
    'M-15',
    'memoises the answer keyed by the length of the input - a cache on a cheap proxy for its key, ' +
      'so two different arrays of the same size collide',
    [
      reference(
        SIGNATURE,
        `const CACHE = new Map<number, Map<unknown, unknown[]>>()\n\n${SIGNATURE}`,
      ),
      reference(
        DECLARE,
        `  const cached = CACHE.get(items.length)\n` +
          `  if (cached !== undefined) return cached as unknown as Map<K, T[]>\n\n${DECLARE}`,
      ),
      reference(
        RETURN,
        `  CACHE.set(items.length, groups as unknown as Map<unknown, unknown[]>)\n\n${RETURN}`,
      ),
    ],
    killed([PARTITION, GROUP_ORDER]),
  ),
  sameOnEveryLens(
    'M-16',
    'hoists the Map to module scope and never clears it, so every call accumulates on top of the ' +
      'calls before it. It was written for the determinism and ambient-input properties and neither ' +
      'of them sees it - measured. Both calls return the one Map, so each property compares that ' +
      'object against itself and agrees, which is the trap `date/add@1` recorded of its D-02 arriving ' +
      'here through the return value instead of the argument. What kills it is the partition, ' +
      'coherence and order properties, on the elements the previous call left behind',
    [
      reference(SIGNATURE, `const GROUPS = new Map<unknown, unknown[]>()\n\n${SIGNATURE}`),
      reference(
        DECLARE,
        `  const groups = GROUPS as unknown as Map<K, T[]>\n  let index = 0`,
      ),
    ],
    killed([PARTITION, COHERENCE, GROUP_ORDER]),
  ),
  sameOnEveryLens(
    'M-17',
    'walks the array backwards, the reverse loop written for speed',
    [
      reference(
        LOOP_BODY,
        `  for (let at = items.length - 1; at >= 0; at -= 1) {\n` +
          `    const item = items[at] as T\n` +
          `    const key = keyOf(item, at)\n` +
          `    const existing = groups.get(key)\n\n` +
          `    if (existing === undefined) groups.set(key, [item])\n` +
          `    else existing.push(item)\n\n` +
          `${STEP}\n  }`,
      ),
    ],
    killed([CALL_PROTOCOL]),
  ),
  sameOnEveryLens(
    'M-18',
    'rebuilds the group array on every insertion instead of pushing into it. The answer is right on ' +
      'every input and the cost is quadratic in the size of a group - measured, 5392 ms against ' +
      '0.7 ms on the fifty-thousand-element single-group sample. It survives, and it is the mutant ' +
      'that found a defect in this contract\'s own guards: under vitest\'s default five-second limit ' +
      'it was killed by the block 4.5 shape test, which asserts a shape and was silently asserting a ' +
      'duration as well. A verdict eight per cent away from flipping with the speed of the machine ' +
      'is not a verdict, so that test now carries an explicit timeout and this cell records the ' +
      'truth: nothing in this contract constrains complexity',
    [
      reference(
        INSERT,
        `    if (existing === undefined) groups.set(key, [item])\n` +
          `    else groups.set(key, [...existing, item])`,
      ),
    ],
    survived,
  ),
  sameOnEveryLens(
    'M-19',
    'serialises a key that is an object, so two distinct objects that print alike become one group',
    [
      reference(
        KEY,
        `    const raw = keyOf(item, index)\n` +
          `    const key = (typeof raw === 'object' && raw !== null\n` +
          `      ? JSON.stringify(raw)\n` +
          `      : raw) as K\n` +
          `    const existing = groups.get(key)`,
      ),
    ],
    killed([DISTINCT_OBJECT_KEYS, SAME_OBJECT_KEY, COHERENCE, GROUP_ORDER]),
  ),
  sameOnEveryLens(
    'M-20',
    'recycles one module-scope Map, cleared at the start of every call and handed to every caller. ' +
      'Pinned as a survivor on purpose: the contract requires each *group* to be a fresh array and ' +
      'says nothing about the Map that holds them, so a caller who keeps a result watches it empty ' +
      'itself on the next call. The determinism property is green here for the reason `date/add@1` ' +
      'recorded of its D-02 - both calls return the one object, and it is compared against itself',
    [
      reference(SIGNATURE, `const GROUPS = new Map<unknown, unknown[]>()\n\n${SIGNATURE}`),
      reference(
        DECLARE,
        `  const groups = GROUPS as unknown as Map<K, T[]>\n  groups.clear()\n  let index = 0`,
      ),
    ],
    survived,
  ),
  sameOnEveryLens(
    'M-21',
    'reverses the input in place before grouping it. It exists because of what M-16 measured: ' +
      'without it, the only mutant in this battery that reddens the determinism and ambient-input ' +
      'properties is M-01, which reddens them by throwing - and a property that has only ever been ' +
      'red on a mutant that throws has not been seen red on its own failure condition, since every ' +
      'guard in the file catches a throw. Reversal is an involution, which is precisely what sorting ' +
      'in place is not: two identical consecutive calls really do answer differently, so these two ' +
      'properties fail here on the sentence they actually make',
    [reference(DECLARE, `  (items as T[]).reverse()\n\n${DECLARE}`)],
    killed([DETERMINISTIC, NO_AMBIENT_INPUT, NO_MUTATION]),
  ),
  sameOnEveryLens(
    'M-22',
    'remembers the last answer and hands it back whenever the next input has the same length - the ' +
      'memoise-last idiom with a cheap proxy for identity. It exists to separate two properties this ' +
      'battery had never separated: every mutant that reddened determinism reddened freedom from ' +
      'ambient input with it, so neither had been seen red on the sentence it alone makes. The slot ' +
      'is written only on a miss, so two identical consecutive calls both read it and determinism ' +
      'compares one object against itself; a foreign call in between replaces it, which is the only ' +
      'thing the ambient-input property can see. M-15 is the same cache without that: keyed by length ' +
      'in a Map that is never overwritten, it freezes after warm-up and both properties stay green on ' +
      'it - measured',
    [
      reference(
        SIGNATURE,
        `let lastGrouping: { readonly length: number; readonly groups: Map<unknown, unknown[]> } | null =\n` +
          `  null\n\n${SIGNATURE}`,
      ),
      reference(
        DECLARE,
        `  if (lastGrouping !== null && lastGrouping.length === items.length) {\n` +
          `    return lastGrouping.groups as unknown as Map<K, T[]>\n` +
          `  }\n\n${DECLARE}`,
      ),
      reference(
        RETURN,
        `  lastGrouping = {\n` +
          `    length: items.length,\n` +
          `    groups: groups as unknown as Map<unknown, unknown[]>,\n` +
          `  }\n\n${RETURN}`,
      ),
    ],
    killed([NO_AMBIENT_INPUT]),
  ),
]

// ---------------------------------------------------------------------------
// S-1 to S-7 - defects of the declared type
// ---------------------------------------------------------------------------

const signatures: readonly Mutant[] = [
  signatureDefect(
    'S-1',
    'widens the key function\'s first parameter to `unknown`, so the element type stops flowing to ' +
      'the call site and a caller must annotate what the contract promised to infer',
    [reference(`  keyOf: (item: T, index: number) => K,`, `  keyOf: (item: unknown, index: number) => K,`)],
    killed([TYPE_IDENTITY, INFERS_ELEMENT]),
    killed([INFERS_ELEMENT]),
  ),
  signatureDefect(
    'S-2',
    'constrains the key parameter to `PropertyKey` - the single change that would let an ' +
      'implementation return an object instead of a Map, and the one a reviewer is most likely to ' +
      'wave through as a tightening',
    [
      reference(
        `export const groupBy = <T, K>(`,
        `export const groupBy = <T, K extends PropertyKey>(`,
      ),
    ],
    killed([TYPE_IDENTITY, INFERS_KEY]),
    killed([INFERS_KEY]),
  ),
  signatureDefect(
    'S-3',
    'declares the groups readonly, so a caller can no longer sort or push into a group this ' +
      'function freshly allocated for it',
    [
      reference(`): Map<K, T[]> => {`, `): Map<K, readonly T[]> => {`),
      reference(`  const groups = new Map<K, T[]>()`, `  const groups = new Map<K, readonly T[]>()`),
      reference(
        INSERT,
        `    if (existing === undefined) groups.set(key, [item])\n` +
          `    else groups.set(key, [...existing, item])`,
      ),
    ],
    killed([TYPE_IDENTITY, OWNED_GROUPS]),
    killed([OWNED_GROUPS]),
  ),
  signatureDefect(
    'S-4',
    'drops the index, so a key function that wanted the position of its element receives nothing ' +
      'and every caller who passed one is silently reading undefined',
    [
      reference(`  keyOf: (item: T, index: number) => K,`, `  keyOf: (item: T) => K,`),
      reference(KEY_CALL, `    const key = keyOf(item)`),
    ],
    killed([TYPE_IDENTITY, INDEX_IS_SECOND]),
    killed([INDEX_IS_SECOND]),
  ),
  signatureDefect(
    'S-5',
    'erases the key type from the return, so every caller\'s `groups.get(...)` takes an `unknown`',
    [reference(`): Map<K, T[]> => {`, `): Map<unknown, T[]> => {`)],
    killed([TYPE_IDENTITY, INFERS_KEY]),
    killed([INFERS_KEY]),
  ),
  signatureDefect(
    'S-6',
    'lets the key function return `any`, the leak that keeps every assertion about the key type ' +
      'true by making it meaningless',
    [
      reference(
        `  keyOf: (item: T, index: number) => K,`,
        `  keyOf: (item: T, index: number) => any,`,
      ),
    ],
    killed([TYPE_IDENTITY, INFERS_KEY]),
    killed([INFERS_KEY]),
  ),
  signatureDefect(
    'S-7',
    'takes a mutable array, so a caller holding a `readonly T[]` - which is what this function ' +
      'promises to be safe with - can no longer call it',
    [reference(`  items: readonly T[],`, `  items: T[],`)],
    killed([TYPE_IDENTITY, READONLY_INPUT]),
    killed([READONLY_INPUT]),
  ),
  signatureDefect(
    'S-8',
    'widens the input to `Iterable<T>`. It is the only mutant of this battery that reaches the ' +
      'three `@ts-expect-error` guards, and it exists because the first seven measured that those ' +
      'guards had never fired at all. It is also the real design pressure on this contract rather ' +
      'than an invented one: block 4.4 pins that a Set is grouped correctly, so widening the type to ' +
      'say so out loud is the change a reader will propose - and it would silently move the domain ' +
      'the whole table is defensible relative to',
    [reference(`  items: readonly T[],`, `  items: Iterable<T>,`)],
    killed([TYPE_IDENTITY, REFUSES_A_NON_ARRAY]),
    killed([REFUSES_A_NON_ARRAY]),
  ),
]

// ---------------------------------------------------------------------------
// The probes
// ---------------------------------------------------------------------------

const probes: readonly Mutant[] = [
  probe(
    UNDER,
    'F-5',
    'returns the groups in the order an object would have enumerated them - keys that look like ' +
      'array indices first, in ascending numeric order, then the rest in insertion order - and ' +
      'changes nothing else. It asks the question the return type was chosen on: if the group-order ' +
      'property does not redden here, then nothing in this contract but one named case separates a ' +
      'Map-shaped answer from the object-shaped one that lodash, Ramda and Object.groupBy all give',
    [
      reference(
        RETURN,
        `  const entries = [...groups.entries()]\n` +
          `  const looksNumeric = ([key]: readonly [K, T[]]): boolean =>\n` +
          `    typeof key === 'string' && key !== '' && String(Number(key)) === key\n\n` +
          `  return new Map([\n` +
          `    ...entries.filter(looksNumeric).sort((a, b) => Number(a[0]) - Number(b[0])),\n` +
          `    ...entries.filter((entry) => !looksNumeric(entry)),\n` +
          `  ])`,
      ),
    ],
    killed([GROUP_ORDER, INTEGER_LIKE_ORDER]),
  ),
  probe(
    UNDER,
    'F-6',
    'answers a single empty group for the empty input and is correct everywhere else. It asks ' +
      'whether the arbitraries reach the empty array at all under the declared number of runs, the ' +
      'question that found the starved support of P1 on `date/add@1`. The partition property cannot ' +
      'see it - an empty group flattens to nothing - so the group-order property is the one to watch',
    [
      reference(
        RETURN,
        `  if (items.length === 0) return new Map([[undefined as K, [] as T[]]])\n\n${RETURN}`,
      ),
    ],
    killed([GROUP_ORDER, EMPTY_ARRAY]),
  ),
]

export const battery: Battery = {
  name: 'array-group-by',
  contractPath: 'contracts/array/group-by',
  timeZone: 'UTC',
  calibrationMutant: 'M-04',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'total - one export, no diagnostic, a Map returned for every array',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
    {
      id: 'identity-blind',
      description:
        'the type test read as if it only checked that the export is a function, never that its ' +
        'whole type equals the contract\'s - so the column measures what the call-site inference ' +
        'checks catch on their own',
      arms: ['C'],
      edits: [
        {
          file: 'signature.test-d.ts',
          find: '    expectTypeOf(groupBy).toEqualTypeOf<GroupBy>()',
          replace: '    expectTypeOf(groupBy).toBeFunction()',
        },
      ],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the contract\'s own declarations rather than over the implementation. This battery ' +
        'injects into `reference.ts`, so nothing it can do reaches a guard that reads the two tables, ' +
        'the profile list, the key-function rules or the universal-property declarations.',
      guards: [
        'every-case-is-addressed',
        'every-case-is-justified',
        'every-profile-has-samples',
        'every-shape-is-named-and-described',
        'universal-properties-answered',
        'declares-a-statement-for-every-key-function-rule',
        'declares-the-kinds-of-key-function-rule',
      ],
    },
    {
      reason:
        'over the runtime rather than over the implementation. `language.test.ts` runs block 4.4 ' +
        'against `Map.groupBy`, and the four divergences block 4.1 publishes against ' +
        '`Object.groupBy`, neither of which a defect injected into `reference.ts` can touch. It is ' +
        'the measurement `catalogueAdmission` rests on, and it is silent here by construction rather ' +
        'than for want of a mutant.',
      suites: [
        'array/group-by@1 against Map.groupBy',
        'array/group-by@1 against Object.groupBy',
      ],
    },
    {
      lenses: ['identity-blind'],
      reason:
        'the assertion this lens replaces. `identity-blind` reads ' +
        '`expectTypeOf(groupBy).toEqualTypeOf<GroupBy>()` as a check that the export is a function, ' +
        'so on that column the guard cannot fail whatever is injected - which is the point of the ' +
        'lens, and the difference between the two columns is what it measures. On `as-committed` it ' +
        'is red on all eight signature defects.',
      guards: ['signature-is-the-declared-type'],
    },
  ],

  unprobedRegions: [
    {
      nature: 'documents a decision',
      reason:
        'no mutant answers a nullish input instead of refusing it. That is precisely what lodash ' +
        'does - measured, it returns zero groups for `null` - so the defect these two cases refuse is ' +
        'real and plausible, and this battery does not carry it. The three other untyped-caller cases ' +
        'are red on M-11, which reads the input by counting over `length`. Both cases publish a ' +
        'decision either way; what is missing is the mutant that violates it.',
      guards: ['a-null-input', 'an-undefined-input'],
    },
    {
      nature: 'claims detection',
      reason:
        'the two `@ts-expect-error` guards of block 4.2 that S-8 does not reach. S-8 widened the ' +
        'input and reddened the third; widening the key function to take a third argument, or making ' +
        'it optional, would reach these two, and neither mutant is written.',
      guards: [
        'signature-refuses-a-third-argument',
        'signature-refuses-a-missing-key-function',
      ],
    },
  ],

  mutants: [...behaviour, ...signatures, ...probes],
}
