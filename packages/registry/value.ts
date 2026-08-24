/**
 * How a declared value of a contract is carried by the registry.
 *
 * A contract's declarative content is data and is modelled; its executable content - `outputsAreEqual`,
 * the key functions, the bodies of the properties - is served as hashed files and is never modelled.
 * That frontier is the registry's, not this file's, and ADR-0003 states it. What this file
 * answers is the question the frontier leaves: the declarative half is not JSON either.
 *
 * Measured, over the five contracts, by round-tripping every declarative export through
 * `JSON.parse(JSON.stringify(...))` and comparing every leaf with `Object.is`. **Thirty-three leaves
 * come back different.**
 *
 *   -0                    5  two `number/parse@1` answers, one `date/add@1` duration, two
 *                            `array/group-by@1` elements. `JSON` returns `0`, and the sign is the one
 *                            thing `outputsAreEqual` uses `Object.is` rather than `===` to preserve.
 *   NaN                   7  a `date/add@1` benchmark sample and case, five `array/group-by@1` keys
 *                            and elements. `JSON` returns `null`, which that contract also uses.
 *   Infinity              1  a `date/add@1` duration. `JSON` returns `null`.
 *   undefined             7  `array/group-by@1` keys, elements and calls. `JSON` returns `null`.
 *   a symbol              2  two `array/group-by@1` group keys. `JSON` drops them.
 *   a shared reference    9  `array/group-by@1` pins that the element in a group is the *same object*
 *                            as the element in the input, so an implementation that clones its input
 *                            is not conformant. `JSON` returns two equal objects and the claim is gone.
 *   a regular expression  1  `string/slugify@1`'s declared output alphabet. `JSON` returns `{}`.
 *
 * One more was missed by the measurement itself and is worth recording, because it is the failure
 * this file is least likely to be suspected of. A field set to `undefined` and a field that is absent
 * survive a JSON round trip as the same thing - the key is dropped - so a comparison keyed on paths
 * cannot see the difference. `date/add@1` declares the two equivalent on purpose; `array/group-by@1`
 * does not, and its untyped table carries an input that is `undefined` rather than missing. The
 * encoding below distinguishes them, and a measurement that compares paths never would have said so.
 *
 * **The encoding is total over what it models, and refuses what it does not.** It carries every
 * `number`, including the three JSON drops and the negative zero, because a contract that answers
 * `-Infinity` must enter without a migration - which is the design criterion this unit is measured
 * against, and the one the vocabularies below are chosen by.
 *
 * ---------------------------------------------------------------------------
 * The sentence above used to end differently, and its condition arrived
 * ---------------------------------------------------------------------------
 *
 * It read *it does not model a `Date`, a `Map` or a `bigint`: none of the five produces one*. That was
 * a reading of the five contracts of the day and it was true of them; `date/add@1` writes its instants
 * as ISO strings rather than as `Date` objects, which is what let it be true. **The seventh produces
 * all three**, and the reading is repaired here as a reading that served rather than struck out as an
 * error - what it did was hold the line until a contract crossed it, which is what it was for.
 *
 * **The loud refusal has now been paid for twice, by the same mechanism and to the same end.** A `Set`
 * is modelled because `array/group-by@1` produced one against a sentence in this file claiming none
 * did. `Date`, `Map`, `bigint`, an `Error`, a boxed primitive, a typed array and a value nobody can
 * read are modelled because `object/deep-equal@1` produced them against the same kind of sentence.
 * Both times the refusal named the path and the path named the kind; neither time did anything reach a
 * published record. That is two instances of the design working, and it is the argument for keeping
 * the refusal loud rather than widening the encoding on speculation.
 *
 * ---------------------------------------------------------------------------
 * The hole the second payment found, which was not a missing kind
 * ---------------------------------------------------------------------------
 *
 * A refusal is only loud where `unmodelled` has something to say. It answered `null` for an object
 * with **no prototype at all**, so `Object.assign(Object.create(null), { a: 1 })` and `{ a: 1 }`
 * encoded to the same bytes - measured, byte for byte identical - and the difference was lost in
 * silence rather than refused. `object/deep-equal@1` settles that difference in two rows, so both
 * would have been served as `deepEqual({ a: 1 }, { a: 1 })` answering `false`, which a reader cannot
 * make sense of and no guard would have questioned.
 *
 * `record` carries its prototype now, and carries it **only when there is something to say** - a plain
 * object emits no such field, so every record the five already publish encodes to the bytes it always
 * did and no published digest moves. That is measured rather than reasoned, and `npm run freeze` is
 * where it is asked.
 *
 * A `Set` is modelled, and how it got here is the argument for the refusal being loud. This file was
 * written claiming no contract produced one. It was wrong: `array/group-by@1` settles what happens
 * when a JavaScript caller passes a Set, because iterating gives a Set the right answer where a
 * counting loop over `length` gives it zero groups - which is what makes lodash wrong there. The
 * measurement that preceded this file missed it, and missed it in the exact way a silent encoding
 * would have: a Set has no own enumerable properties, so walking it with `Object.entries` reads it as
 * an empty object and reports nothing. The refusal is what turned a wrong sentence in this comment
 * into a failing serialisation.
 */

/** What JSON carries faithfully, and the only thing that reaches a reader unencoded. */
export type JsonPrimitive = string | number | boolean | null

/**
 * The four numbers JSON does not carry. `negative-zero` is a distinct entry rather than a sign flag
 * because it is a distinct *value*: `Object.is(-0, 0)` is false, and two contracts settle a case on
 * exactly that.
 */
export type NumberLiteral = 'negative-zero' | 'nan' | 'infinity' | 'negative-infinity'

/**
 * A label for an object that appears more than once inside one encoded value.
 *
 * Only such objects carry one. Two structurally identical objects that each appear once are two
 * groups in `array/group-by@1`'s table and the structure already says so; a label on every object
 * would be noise on 187 cases to carry a claim nine of them make.
 *
 * `array/group-by@1` reached the same device for its failure messages - `outcome.ts` tags distinct
 * objects `object#1` so that a failure can tell two keys apart that `String` cannot. That is an
 * observation about the problem, not a shared implementation: this file cannot import from one
 * contract, and a display tag and a serialised identity are not the same object.
 */
export type SharedObject = number

/**
 * What a record's prototype is, where it is not `Object.prototype` and the difference is therefore
 * worth carrying.
 *
 * A plain object emits nothing, which is what keeps every record the five already publish encoding to
 * the bytes it always did. `object/deep-equal@1` is what needs the other two: it settles that an
 * instance of a class is not its own fields and that an object with no prototype is not a plain one,
 * and both rows are unreadable if the two sides serialise alike.
 *
 * **A class cannot be carried and this does not pretend to.** What is carried is the name, and what a
 * decoder rebuilds is an object whose prototype is not `Object.prototype` and which remembers that
 * name - so two instances of one class come back sharing a prototype, and an instance and a plain
 * object come back different. The methods are gone, and no case of any contract is about them.
 */
export type EncodedPrototype = 'none'

/** The standard error constructors. The language's closed list, so that no contract needs a migration. */
export type ErrorKind =
  | 'Error'
  | 'TypeError'
  | 'RangeError'
  | 'SyntaxError'
  | 'ReferenceError'
  | 'EvalError'
  | 'URIError'

/** Which primitive a boxed object wraps, which is what decides the prototype it comes back with. */
export type BoxedKind = 'string' | 'number' | 'boolean' | 'bigint' | 'symbol'

/** The typed-array constructors, for the reason `ErrorKind` is closed: the list is the language's. */
export type TypedArrayKind =
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float32Array'
  | 'Float64Array'
  | 'BigInt64Array'
  | 'BigUint64Array'

/** What a value nobody can read into is, where the reason it cannot be read is the point. */
export type OpaqueKind = 'promise' | 'weak-map' | 'weak-set' | 'weak-ref'

export type EncodedValue =
  | { readonly kind: 'primitive'; readonly value: JsonPrimitive }
  | { readonly kind: 'number'; readonly literal: NumberLiteral }
  /** Carried as digits, because a bigint is exactly the integer JSON cannot hold. */
  | { readonly kind: 'big-integer'; readonly digits: string }
  | { readonly kind: 'undefined' }
  | { readonly kind: 'symbol'; readonly description: string | null }
  | { readonly kind: 'pattern'; readonly source: string; readonly flags: string }
  | {
      readonly kind: 'list'
      readonly entries: readonly EncodedValue[]
      readonly shared?: SharedObject
    }
  | {
      readonly kind: 'record'
      readonly fields: readonly EncodedField[]
      /** Absent on a plain object, which is what keeps every already-published record byte-identical. */
      readonly prototype?: EncodedPrototype
      readonly shared?: SharedObject
    }
  /**
   * An instant. The epoch is an encoded *number* rather than a bare one, so that an invalid date - a
   * `Date` whose time is `NaN` - survives the wire on the same machinery every other `NaN` does.
   */
  | {
      readonly kind: 'instant'
      readonly epoch: EncodedValue
      readonly shared?: SharedObject
    }
  /**
   * A Map, whose entries are a sequence for the reason a Set's are: insertion order is observable, and
   * `object/deep-equal@1` settles that two Maps built in different orders are one value - which is a
   * claim about the entries and not about the order they happen to be written in.
   */
  | {
      readonly kind: 'map'
      readonly entries: readonly { readonly key: EncodedValue; readonly value: EncodedValue }[]
      readonly shared?: SharedObject
    }
  /**
   * An error as data. `cause` is carried because a contract settles that two errors with different
   * causes are different; `stack` is not, because it names where an error was constructed rather than
   * what it says.
   */
  | {
      readonly kind: 'error'
      readonly errorKind: ErrorKind
      readonly message: string
      readonly cause?: EncodedValue
      readonly fields: readonly EncodedField[]
      readonly shared?: SharedObject
    }
  /**
   * A boxed primitive, which carries its value where no own property is - the blindness that made two
   * of them compare equal in this catalogue's own reference implementation.
   */
  | {
      readonly kind: 'boxed'
      readonly of: BoxedKind
      readonly value: EncodedValue
      readonly fields: readonly EncodedField[]
      readonly shared?: SharedObject
    }
  /** A typed array: its kind, because two of different kinds are different values, and its elements. */
  | {
      readonly kind: 'typed-array'
      readonly of: TypedArrayKind
      readonly elements: readonly EncodedValue[]
      readonly shared?: SharedObject
    }
  /**
   * A value whose contents no caller can read. It is not `not-data`, which is the executable half of a
   * contract served as a file; this is data whose data is unreachable by construction, and the
   * distinction is what a reader needs to know why two of them are not equal.
   */
  | { readonly kind: 'opaque'; readonly nature: OpaqueKind }
  /**
   * An instance of a class, which is a kind of its own rather than a record carrying a note.
   *
   * **The split is forced by what a page can print.** A record with no prototype has a JavaScript
   * spelling a reader can build - `Object.assign(Object.create(null), { a: 1 })` - and an instance of a
   * class has none, because the class is not in the record and cannot be.
   * `every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` admits exactly two answers per
   * kind, so a kind that was sometimes readable and sometimes not could be filed under neither.
   *
   * The name is carried because a reader deserves to know which class, and it is not enough to rebuild
   * one. `object/deep-equal@1` settles that an instance is not its own fields; nothing settles anything
   * about its methods.
   */
  | {
      readonly kind: 'instance'
      readonly className: string
      readonly fields: readonly EncodedField[]
      readonly shared?: SharedObject
    }
  /**
   * A Set, whose order is observable: `array/group-by@1` groups one and pins the groups in the order
   * iteration produced them, so the entries are a sequence and not a bag.
   */
  | {
      readonly kind: 'set'
      readonly entries: readonly EncodedValue[]
      readonly shared?: SharedObject
    }
  /** The same object as the `shared` one already encoded. */
  | { readonly kind: 'again'; readonly shared: SharedObject }
  /**
   * A value the registry serves rather than models: the executable half of a contract. It carries
   * what kind of thing sits there and nothing that reproduces it, because a record that carried the
   * source would publish code the registry does not run and therefore does not verify.
   */
  | { readonly kind: 'not-data'; readonly nature: 'function' }
  /**
   * A hole in a sparse array, which is not the same value as an `undefined` element and is settled as
   * a case by `array/group-by@1`: a hole is *visited*, and its element is `undefined`, which is what
   * separates iteration from a counting loop guarded by `i in items`. The two look identical from
   * outside and behave differently under the implementation strategy that contract refuses, so
   * flattening one into the other would delete the case.
   *
   * Found the same way the Set was. `Array.prototype.map` preserves holes, so the first version of
   * this encoder produced a sparse list of encoded values, `JSON.stringify` wrote the holes as
   * `null`, and decoding crashed on a null claiming to be an encoded value. A crash rather than a
   * silent loss, and only because the round trip goes through real JSON.
   */
  | { readonly kind: 'hole' }

/**
 * A field of an encoded record. Present with an `undefined` value and absent are different fields,
 * and this shape keeps them different: the first is a `field` whose value is `{ kind: 'undefined' }`,
 * the second is no `field` at all.
 */
export type EncodedField = {
  readonly name: string
  readonly value: EncodedValue
}

export class UnencodableValue extends Error {
  constructor(path: string, nature: string) {
    super(
      `${path} holds ${nature}, which the registry does not model. Encoding it as anything else ` +
        `would publish a value the contract does not declare; extend packages/registry/value.ts deliberately ` +
        `instead.`,
    )
    this.name = 'UnencodableValue'
  }
}

const numberLiteralOf = (value: number): NumberLiteral | null => {
  if (Object.is(value, -0)) return 'negative-zero'
  if (Number.isNaN(value)) return 'nan'
  if (value === Number.POSITIVE_INFINITY) return 'infinity'
  if (value === Number.NEGATIVE_INFINITY) return 'negative-infinity'

  return null
}

/** The tag `Object.prototype.toString` gives, which reads the internal slot where a prototype does not. */
const tagOf = (value: object): string => Object.prototype.toString.call(value).slice(8, -1)

const BOXED_BY_TAG: Readonly<Record<string, BoxedKind | undefined>> = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  BigInt: 'bigint',
  Symbol: 'symbol',
}

const ERROR_KINDS: readonly ErrorKind[] = [
  'Error',
  'TypeError',
  'RangeError',
  'SyntaxError',
  'ReferenceError',
  'EvalError',
  'URIError',
]

const TYPED_ARRAY_KINDS: readonly TypedArrayKind[] = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
]

const OPAQUE_BY_TAG: Readonly<Record<string, OpaqueKind | undefined>> = {
  Promise: 'promise',
  WeakMap: 'weak-map',
  WeakSet: 'weak-set',
  WeakRef: 'weak-ref',
}

/** The error constructor a value really has, read off its prototype rather than off its `name`. */
const errorKindOf = (value: Error): ErrorKind | null => {
  const named = (Object.getPrototypeOf(value) as { readonly constructor?: { readonly name?: string } })
    .constructor?.name

  return ERROR_KINDS.find((kind) => kind === named) ?? null
}

const typedArrayKindOf = (value: object): TypedArrayKind | null =>
  TYPED_ARRAY_KINDS.find((kind) => kind === tagOf(value)) ?? null

/**
 * What a value of an unmodelled kind is called in the refusal, so that a reader knows what to add.
 *
 * Everything this answers `null` for has an arm in `encodeAt`, and the two lists are one list read
 * twice - which is why a kind added below without an arm here would be refused rather than silently
 * flattened, and a kind admitted here without an arm below would fall through to the record arm and
 * lose whatever it carries in a slot. That was the shape of the hole a null prototype fell through.
 */
const unmodelled = (value: object): string | null => {
  if (value instanceof Set) return null
  if (value instanceof RegExp) return null
  if (value instanceof Map) return null
  if (value instanceof Date) return null
  if (Array.isArray(value)) return null

  if (value instanceof Error) {
    return errorKindOf(value) === null ? 'an error of a kind the language does not define' : null
  }

  const tag = tagOf(value)

  if (BOXED_BY_TAG[tag] !== undefined) return null
  if (OPAQUE_BY_TAG[tag] !== undefined) return null
  if (typedArrayKindOf(value) !== null) return null

  if (tag === 'ArrayBuffer' || tag === 'SharedArrayBuffer') return 'a buffer'
  if (tag === 'DataView') return 'a DataView'
  if (tag !== 'Object') return `a ${tag}`

  return null
}

/**
 * What a record has to say about its prototype, and `undefined` where it has nothing to say.
 *
 * `Object.prototype` is the ordinary case and emits nothing at all, which is what keeps every record
 * the five already publish encoding to the bytes it always did.
 */
const prototypeOf = (value: object): EncodedPrototype | undefined =>
  Object.getPrototypeOf(value) === null ? 'none' : undefined

/** The class a value is an instance of, or  where it is an ordinary object. */
const classNameOf = (value: object): string | null => {
  const prototype = Object.getPrototypeOf(value) as object | null

  if (prototype === Object.prototype || prototype === null) return null

  const named = (prototype as { readonly constructor?: { readonly name?: string } }).constructor?.name

  return named ?? 'an anonymous class'
}

type Walk = {
  /** How many times each object occurs, so that only the shared ones are labelled. */
  readonly occurrences: Map<object, number>
  readonly labels: Map<object, SharedObject>
  readonly emitted: Set<object>
}

const count = (value: unknown, occurrences: Map<object, number>): void => {
  if (typeof value !== 'object' || value === null) return

  const seen = occurrences.get(value) ?? 0
  occurrences.set(value, seen + 1)
  if (seen > 0) return

  if (value instanceof RegExp) return
  if (Array.isArray(value)) {
    for (let at = 0; at < value.length; at += 1) {
      if (at in value) count(value[at], occurrences)
    }
    return
  }
  if (value instanceof Set) {
    for (const entry of value) count(entry, occurrences)
    return
  }
  if (value instanceof Map) {
    for (const [key, entry] of value) {
      count(key, occurrences)
      count(entry, occurrences)
    }
    return
  }
  if (value instanceof Date) return
  if (value instanceof Error) {
    count(value.cause, occurrences)
    for (const entry of Object.values(value)) count(entry, occurrences)
    return
  }
  if (unmodelled(value) !== null) return

  // A typed array's elements are numbers and a boxed primitive's value is a primitive, so neither can
  // hold an object to share - but both can carry own properties, which can.
  for (const entry of Object.values(value)) count(entry, occurrences)
}

const labelFor = (value: object, walk: Walk): SharedObject | undefined => {
  if ((walk.occurrences.get(value) ?? 0) < 2) return undefined

  const existing = walk.labels.get(value)
  if (existing !== undefined) return existing

  const next = walk.labels.size + 1
  walk.labels.set(value, next)

  return next
}

const encodeAt = (value: unknown, path: string, walk: Walk): EncodedValue => {
  if (typeof value === 'function') return { kind: 'not-data', nature: 'function' }
  if (typeof value === 'undefined') return { kind: 'undefined' }
  if (typeof value === 'symbol') return { kind: 'symbol', description: value.description ?? null }
  if (typeof value === 'bigint') return { kind: 'big-integer', digits: value.toString() }

  if (typeof value === 'number') {
    const literal = numberLiteralOf(value)

    return literal === null ? { kind: 'primitive', value } : { kind: 'number', literal }
  }

  if (typeof value !== 'object' || value === null) {
    return { kind: 'primitive', value: value as JsonPrimitive }
  }

  const nature = unmodelled(value)
  if (nature !== null) throw new UnencodableValue(path, nature)

  if (value instanceof RegExp) {
    return { kind: 'pattern', source: value.source, flags: value.flags }
  }

  const shared = labelFor(value, walk)
  if (shared !== undefined && walk.emitted.has(value)) return { kind: 'again', shared }
  walk.emitted.add(value)

  if (Array.isArray(value)) {
    // Written index by index rather than with `map`, which preserves holes and would leave them in
    // the encoded list for `JSON.stringify` to turn into nulls.
    const entries = Array.from({ length: value.length }, (_, at) =>
      at in value ? encodeAt(value[at], `${path}[${at}]`, walk) : { kind: 'hole' as const },
    )

    return shared === undefined ? { kind: 'list', entries } : { kind: 'list', entries, shared }
  }

  if (value instanceof Set) {
    const entries = [...value].map((entry, at) => encodeAt(entry, `${path}{${at}}`, walk))

    return shared === undefined ? { kind: 'set', entries } : { kind: 'set', entries, shared }
  }

  const fieldsOf = (subject: object): readonly EncodedField[] =>
    Object.entries(subject).map(([name, entry]) => ({
      name,
      value: encodeAt(entry, `${path}.${name}`, walk),
    }))

  if (value instanceof Date) {
    const epoch = encodeAt(value.getTime(), `${path}<epoch>`, walk)

    return shared === undefined ? { kind: 'instant', epoch } : { kind: 'instant', epoch, shared }
  }

  if (value instanceof Map) {
    const entries = [...value].map(([key, entry], at) => ({
      key: encodeAt(key, `${path}<key ${at}>`, walk),
      value: encodeAt(entry, `${path}<value ${at}>`, walk),
    }))

    return shared === undefined ? { kind: 'map', entries } : { kind: 'map', entries, shared }
  }

  if (value instanceof Error) {
    const errorKind = errorKindOf(value) as ErrorKind
    const carried = {
      kind: 'error' as const,
      errorKind,
      message: value.message,
      fields: fieldsOf(value),
      ...(value.cause === undefined
        ? {}
        : { cause: encodeAt(value.cause, `${path}<cause>`, walk) }),
    }

    return shared === undefined ? carried : { ...carried, shared }
  }

  const tag = tagOf(value)
  const boxed = BOXED_BY_TAG[tag]

  if (boxed !== undefined) {
    const carried = {
      kind: 'boxed' as const,
      of: boxed,
      value: encodeAt((value as { valueOf(): unknown }).valueOf(), `${path}<boxed>`, walk),
      fields: fieldsOf(value),
    }

    return shared === undefined ? carried : { ...carried, shared }
  }

  const opaque = OPAQUE_BY_TAG[tag]
  if (opaque !== undefined) return { kind: 'opaque', nature: opaque }

  const typedArray = typedArrayKindOf(value)

  if (typedArray !== null) {
    const elements = [...(value as unknown as Iterable<unknown>)].map((entry, at) =>
      encodeAt(entry, `${path}[${at}]`, walk),
    )
    const carried = { kind: 'typed-array' as const, of: typedArray, elements }

    return shared === undefined ? carried : { ...carried, shared }
  }

  const fields = fieldsOf(value)
  const className = classNameOf(value)

  if (className !== null) {
    const instance = { kind: 'instance' as const, className, fields }

    return shared === undefined ? instance : { ...instance, shared }
  }

  const prototype = prototypeOf(value)
  const record = { kind: 'record' as const, fields, ...(prototype === undefined ? {} : { prototype }) }

  return shared === undefined ? record : { ...record, shared }
}

export const encode = (value: unknown, path: string): EncodedValue => {
  const occurrences = new Map<object, number>()
  count(value, occurrences)

  return encodeAt(value, path, { occurrences, labels: new Map(), emitted: new Set() })
}

const literals: Readonly<Record<NumberLiteral, number>> = {
  'negative-zero': -0,
  nan: Number.NaN,
  infinity: Number.POSITIVE_INFINITY,
  'negative-infinity': Number.NEGATIVE_INFINITY,
}

const ERROR_CONSTRUCTORS: Readonly<Record<ErrorKind, ErrorConstructor>> = {
  Error,
  TypeError,
  RangeError,
  SyntaxError,
  ReferenceError,
  EvalError,
  URIError,
}

const TYPED_ARRAY_CONSTRUCTORS = {
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
} as const

/**
 * What a value nobody can read into comes back as. One marker per nature rather than one for all
 * four, so that a decoded promise and a decoded WeakMap stay different values - which is what the
 * round-trip comparison needs in order to say that the *kind* survived and not only that something
 * unreadable did.
 */
export const UNREADABLE: Readonly<Record<OpaqueKind, symbol>> = {
  promise: Symbol('a promise, whose contents no caller can read'),
  'weak-map': Symbol('a WeakMap, which cannot be enumerated'),
  'weak-set': Symbol('a WeakSet, which cannot be enumerated'),
  'weak-ref': Symbol('a WeakRef, whose referent cannot be held'),
}

/**
 * The prototypes a decoded record is given, one per class name and built once.
 *
 * Two instances of one class come back sharing a prototype, an instance and a plain object come back
 * different, and an instance of one class and an instance of another come back different - which is
 * every distinction any contract of this catalogue draws. The class itself is not rebuilt and cannot
 * be: what is carried is a name, and a name is not a constructor.
 */
const classPrototypes = new Map<string, object>()

const prototypeFor = (className: string): object => {
  const held = classPrototypes.get(className)
  if (held !== undefined) return held

  const built = Object.create(Object.prototype, {
    constructor: { value: { name: className }, enumerable: false },
  }) as object

  classPrototypes.set(className, built)

  return built
}

/**
 * The inverse. A function cannot be decoded and comes back as the marker it was encoded as, which is
 * what makes the round-trip guard a statement about the declarative half only - the half this
 * registry claims to model.
 */
export const decode = (encoded: EncodedValue, shared: Map<SharedObject, unknown> = new Map()): unknown => {
  switch (encoded.kind) {
    case 'primitive':
      return encoded.value
    case 'number':
      return literals[encoded.literal]
    case 'undefined':
      return undefined
    case 'symbol':
      return Symbol(encoded.description ?? undefined)
    case 'pattern':
      return new RegExp(encoded.source, encoded.flags)
    case 'not-data':
      return NOT_DATA
    case 'again': {
      const held = shared.get(encoded.shared)
      if (held === undefined) {
        throw new Error(`the encoded value refers to shared object ${encoded.shared} before it exists`)
      }

      return held
    }
    case 'hole':
      throw new Error('a hole is a gap in a list and has no value of its own to decode')
    case 'list': {
      const entries: unknown[] = []
      entries.length = encoded.entries.length
      if (encoded.shared !== undefined) shared.set(encoded.shared, entries)
      encoded.entries.forEach((entry, at) => {
        // Assigned only where there is something to assign, so that a hole stays a hole.
        if (entry.kind !== 'hole') entries[at] = decode(entry, shared)
      })

      return entries
    }
    case 'set': {
      const entries = new Set<unknown>()
      if (encoded.shared !== undefined) shared.set(encoded.shared, entries)
      for (const entry of encoded.entries) entries.add(decode(entry, shared))

      return entries
    }
    case 'instance': {
      const instance = Object.create(prototypeFor(encoded.className)) as Record<string, unknown>
      if (encoded.shared !== undefined) shared.set(encoded.shared, instance)
      for (const field of encoded.fields) instance[field.name] = decode(field.value, shared)

      return instance
    }
    case 'record': {
      const record = Object.create(encoded.prototype === 'none' ? null : Object.prototype) as Record<string, unknown>
      if (encoded.shared !== undefined) shared.set(encoded.shared, record)
      for (const field of encoded.fields) record[field.name] = decode(field.value, shared)

      return record
    }
    case 'big-integer':
      return BigInt(encoded.digits)
    case 'instant': {
      const instant = new Date(decode(encoded.epoch, shared) as number)
      if (encoded.shared !== undefined) shared.set(encoded.shared, instant)

      return instant
    }
    case 'map': {
      const entries = new Map<unknown, unknown>()
      if (encoded.shared !== undefined) shared.set(encoded.shared, entries)
      for (const entry of encoded.entries) {
        entries.set(decode(entry.key, shared), decode(entry.value, shared))
      }

      return entries
    }
    case 'error': {
      const failure = new ERROR_CONSTRUCTORS[encoded.errorKind](
        encoded.message,
        encoded.cause === undefined ? undefined : { cause: decode(encoded.cause, shared) },
      )
      if (encoded.shared !== undefined) shared.set(encoded.shared, failure)
      for (const field of encoded.fields) {
        ;(failure as unknown as Record<string, unknown>)[field.name] = decode(field.value, shared)
      }

      return failure
    }
    case 'boxed': {
      const box = Object(decode(encoded.value, shared)) as Record<string, unknown>
      if (encoded.shared !== undefined) shared.set(encoded.shared, box)
      for (const field of encoded.fields) box[field.name] = decode(field.value, shared)

      return box
    }
    case 'typed-array': {
      const elements = encoded.elements.map((entry) => decode(entry, shared))
      // One cast rather than a switch over eleven constructors: the two bigint arrays take bigints
      // and the nine others take numbers, so the union of their `from` signatures does not unify and
      // the compiler has nothing to choose. What decides the element type is the constructor the
      // encoding named, which is the fact this cast is standing in for.
      const make = TYPED_ARRAY_CONSTRUCTORS[encoded.of] as {
        from(source: readonly unknown[]): ArrayBufferView
      }
      const built = make.from(elements)
      if (encoded.shared !== undefined) shared.set(encoded.shared, built)

      return built
    }
    case 'opaque':
      return UNREADABLE[encoded.nature]
  }
}

/**
 * What a decoded function is. A distinct value rather than `undefined`, so that the round-trip guard
 * can tell "the registry serves this as a file" from "the registry lost it".
 */
export const NOT_DATA: unique symbol = Symbol('served as a hashed file, not modelled')
