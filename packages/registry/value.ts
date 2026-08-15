/**
 * How a declared value of a contract is carried by the registry.
 *
 * A contract's declarative content is data and is modelled; its executable content - `outputsAreEqual`,
 * the key functions, the bodies of the properties - is served as hashed files and is never modelled.
 * That frontier is the registry's, not this file's, and `contract-record.ts` states it. What this file
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
 * `number`, including the three JSON drops and the negative zero, because a sixth contract that
 * answers `-Infinity` must enter without a migration - which is the design criterion this unit is
 * measured against. It does not model a `Date`, a `Map` or a `bigint`: none of the five produces one,
 * `date/add@1` writes its instants as ISO strings rather than as `Date` objects, and a value of one
 * of those kinds is refused loudly at serialisation instead of being silently flattened. A sixth
 * contract that needs one gets a refusal naming the path, which is the signal to extend this file
 * deliberately - the opposite of discovering the loss in a published record.
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

export type EncodedValue =
  | { readonly kind: 'primitive'; readonly value: JsonPrimitive }
  | { readonly kind: 'number'; readonly literal: NumberLiteral }
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

/** What a value of an unmodelled kind is called in the refusal, so that a reader knows what to add. */
const unmodelled = (value: object): string | null => {
  if (value instanceof Date) return 'a Date'
  if (value instanceof Map) return 'a Map'
  if (value instanceof Set) return null
  if (value instanceof RegExp) return null
  if (value instanceof Error) return 'an Error'
  if (Array.isArray(value)) return null
  if (Object.getPrototypeOf(value) === Object.prototype) return null
  if (Object.getPrototypeOf(value) === null) return null

  return 'an instance of a class'
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
  if (unmodelled(value) !== null) return

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
  if (typeof value === 'bigint') throw new UnencodableValue(path, 'a bigint')

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

  const fields = Object.entries(value).map(([name, entry]) => ({
    name,
    value: encodeAt(entry, `${path}.${name}`, walk),
  }))

  return shared === undefined ? { kind: 'record', fields } : { kind: 'record', fields, shared }
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
    case 'record': {
      const record: Record<string, unknown> = {}
      if (encoded.shared !== undefined) shared.set(encoded.shared, record)
      for (const field of encoded.fields) record[field.name] = decode(field.value, shared)

      return record
    }
  }
}

/**
 * What a decoded function is. A distinct value rather than `undefined`, so that the round-trip guard
 * can tell "the registry serves this as a file" from "the registry lost it".
 */
export const NOT_DATA: unique symbol = Symbol('served as a hashed file, not modelled')
