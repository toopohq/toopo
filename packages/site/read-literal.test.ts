import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type { CaseRecord } from '../registry/contract-record.js'
import type { EncodedValue } from '../registry/value.js'
import { decode, encode } from '../registry/value.js'
import { heldByTheRegistry } from './catalogue.js'
import { WITHOUT_A_SPELLING, hasASpelling, literal } from './literal.js'
import { localSource } from './local-source.js'
import { whatKeepsACaseFromTheForm } from './playground.js'
import { UnreadableLiteral, read } from './read-literal.js'

/**
 * The reader, against the writer it claims to invert.
 *
 * ---------------------------------------------------------------------------
 * Totality first, and the catalogue second
 * ---------------------------------------------------------------------------
 *
 * The stronger of the two guards below is the one the compiler holds. `EVERY_ARM` is a record keyed by
 * `EncodedValue['kind']`, so an arm added to that union does not compile until a sample for it is
 * written - which is the difference between *it happens to be covered* and *it cannot fail to be*. A
 * pass over the catalogue's own cases would have been the other kind: real cases reach the arms they
 * reach, nobody has ever checked which, and nothing reddens when one is never touched.
 *
 * The second guard is the pass over every case the registry serves, and it exists for what the first
 * cannot say: that the literals this catalogue actually publishes are among the ones that read back.
 *
 * ---------------------------------------------------------------------------
 * What this file cannot see, measured rather than left implicit
 * ---------------------------------------------------------------------------
 *
 * `packages/site/source.test.ts` refuses every module of this folder but one - tests included, and its own
 * comment says *every other module of this folder* - the right to reach `the-catalogue` or `serialise`. So
 * a guard here sees exactly what the port serves, and the port resolves no binding for a contract the
 * catalogue refused. Measured over the five: **157 of the 187 cases sit on contracts that have a page,
 * and all 30 that print a word with no spelling sit on `array/group-by@1`, which has none.**
 *
 * That is why the guard below the catalogue pass is written as an assertion rather than as a remark.
 * **It said what it would cost to be wrong and it was right about the day**: it reddened when
 * `object/deep-equal@1` gained a page, on the seven of its forty-nine cases whose values are a
 * function, a promise, a weak collection or an instance of a class. It is
 * `a-case-printed-as-a-word-is-a-case-the-form-declines-to-open` now, because the invariant it held is
 * not available - a rewritten function is a different function - and what replaces it is that the
 * printer and the form cannot disagree about which rows those are. ADR-0160.
 */

const source = localSource()

/**
 * Gathered inside each guard rather than once at the top of the file, and that is the apparatus
 * talking rather than taste - the reason `pages.test.ts` already states. A defect that makes
 * `heldByTheRegistry` throw would otherwise stop this whole file from collecting, and the instrument
 * reads a file that collected nothing as a run that measured part of the suite. W-20 is that mutant,
 * and it caught this file the first time it ran against it.
 */
const servedCases = (): readonly { contract: string; entry: CaseRecord }[] =>
  heldByTheRegistry(source).flatMap((one) =>
    one.contract.caseTables.flatMap((table) =>
      table.cases.map((entry) => ({ contract: renderContract(one.contract.address), entry })),
    ),
  )

const withoutASpelling = new Set(Object.keys(WITHOUT_A_SPELLING))

// ---------------------------------------------------------------------------
// Comparing what was read with what the registry decodes
// ---------------------------------------------------------------------------

/**
 * A value named in a fault message.
 *
 * `String` throws on an object with no prototype - `Cannot convert object to primitive value` - and
 * `object/deep-equal@1` settles a case on one, so the rendering of a disagreement was able to fail
 * while describing it. An object is tagged rather than stringified, which is what `String` gave for
 * every other object anyway.
 */
const show = (value: unknown): string => {
  if (Object.is(value, -0)) return '-0'
  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'symbol') return value.toString()
  if (typeof value === 'object' && value !== null) return Object.prototype.toString.call(value)

  return String(value)
}

const at = (path: string): string => (path === '' ? 'the value' : path)

const listFaults = (mine: unknown[], theirs: unknown[], path: string, seen: Map<unknown, unknown>) => {
  if (mine.length !== theirs.length) {
    return [`${at(path)} holds ${mine.length} entries where the registry decodes ${theirs.length}`]
  }

  return mine.flatMap((entry, index) => {
    // A hole is not an `undefined` element, and `in` is the only thing that tells them apart.
    if (index in mine !== index in theirs) return [`${at(path)}[${index}] is a hole on one side only`]

    return index in mine ? disagreement(entry, theirs[index], `${at(path)}[${index}]`, seen) : []
  })
}

const setFaults = (mine: Set<unknown>, theirs: Set<unknown>, path: string, seen: Map<unknown, unknown>) =>
  listFaults([...mine], [...theirs], `${at(path)} as a set`, seen)

/** The own enumerable keys of a value, of both sorts, in the order the value reports them. */
const ownKeysOf = (subject: object): readonly (string | symbol)[] =>
  Reflect.ownKeys(subject).filter(
    (key) => Object.getOwnPropertyDescriptor(subject, key)?.enumerable === true,
  )

/**
 * Two records, named keys and symbol keys alike.
 *
 * **`Object.keys` reports neither of the two things this contract is about**, and reading it here
 * would have been the defect being published compared against itself: a symbol-keyed property is
 * invisible to it, so `{ [s]: 1 }` and `{ [s]: 2 }` are both `{}` and every reader would pass.
 *
 * Named keys are sorted, because a record's own order is not part of what it is - `object/deep-equal@1`
 * settles that in as many words. Symbol keys are compared in the order they are reported, because there
 * is no order on symbols to sort by, and each key is put through `disagreement` so that the identity of
 * one shared symbol is followed rather than its description read.
 */
const recordFaults = (
  mine: Record<string | symbol, unknown>,
  theirs: Record<string | symbol, unknown>,
  path: string,
  seen: Map<unknown, unknown>,
) => {
  const named = (subject: object): string[] =>
    ownKeysOf(subject).filter((key): key is string => typeof key === 'string').sort()
  const keyed = (subject: object): symbol[] =>
    ownKeysOf(subject).filter((key): key is symbol => typeof key === 'symbol')

  const mineKeys = named(mine)
  const theirKeys = named(theirs)

  if (mineKeys.join() !== theirKeys.join()) {
    return [`${at(path)} holds [${mineKeys}] where the registry decodes [${theirKeys}]`]
  }

  const mineSymbols = keyed(mine)
  const theirSymbols = keyed(theirs)

  if (mineSymbols.length !== theirSymbols.length) {
    return [
      `${at(path)} holds ${mineSymbols.length} symbol keys where the registry decodes ` +
        `${theirSymbols.length}`,
    ]
  }

  return [
    ...mineKeys.flatMap((key) =>
      disagreement(mine[key], theirs[key], `${at(path)}.${key}`, seen),
    ),
    ...mineSymbols.flatMap((key, at_) => {
      const theirKey = theirSymbols[at_] as symbol

      return [
        ...disagreement(key, theirKey, `${at(path)}[${String(key)}]<key>`, seen),
        ...disagreement(mine[key], theirs[theirKey], `${at(path)}[${String(key)}]`, seen),
      ]
    }),
  ]
}

/**
 * Every way the two values differ, empty when they do not.
 *
 * Identity is followed rather than ignored: `array/group-by@1` pins that an element in a group is the
 * *same object* as the element in the input, `literal` prints that as `#1 = … , #1`, and a reader that
 * built two equal objects instead would satisfy any structural comparison while losing the claim.
 */
const disagreement = (
  mine: unknown,
  theirs: unknown,
  path: string,
  seen: Map<unknown, unknown>,
): readonly string[] => {
  const differ = [`${at(path)} is ${show(mine)} where the registry decodes ${show(theirs)}`]

  /**
   * **A symbol is followed like an object, and comparing descriptions alone is the defect this
   * contract publishes.** `object/deep-equal@1` settles that two objects keyed by *one* symbol differ
   * from two objects keyed by two symbols of one description - so a comparison that read only the
   * description would call the reader's answer right whichever of the two it had built.
   */
  if (typeof mine === 'symbol' || typeof theirs === 'symbol') {
    if (typeof mine !== 'symbol' || typeof theirs !== 'symbol') return differ

    const met = seen.get(mine)
    if (met !== undefined) {
      return met === theirs ? [] : [`${at(path)} is one symbol where the registry decodes a second`]
    }
    seen.set(mine, theirs)

    return mine.description === theirs.description ? [] : differ
  }

  if (typeof mine !== 'object' || mine === null || typeof theirs !== 'object' || theirs === null) {
    return Object.is(mine, theirs) ? [] : differ
  }

  const already = seen.get(mine)
  if (already !== undefined) {
    return already === theirs ? [] : [`${at(path)} is shared where the registry decodes a second object`]
  }
  seen.set(mine, theirs)

  if (mine instanceof RegExp || theirs instanceof RegExp) {
    return String(mine) === String(theirs) ? [] : differ
  }

  // Before the general comparison, because what these hold is where the general comparison cannot
  // look. The argument is on `beyondJson` itself rather than restated here.
  const beyond = beyondJson(mine, theirs, path, seen)
  if (beyond !== null) return beyond

  if (Array.isArray(mine) && Array.isArray(theirs)) return listFaults(mine, theirs, path, seen)
  if (mine instanceof Set && theirs instanceof Set) return setFaults(mine, theirs, path, seen)
  if (Array.isArray(mine) !== Array.isArray(theirs) || mine instanceof Set !== (theirs instanceof Set)) {
    return differ
  }

  return recordFaults(mine as Record<string, unknown>, theirs as Record<string, unknown>, path, seen)
}

const tagOf = (value: object): string => Object.prototype.toString.call(value).slice(8, -1)

/**
 * The kinds whose whole value lives where `Object.keys` cannot see it, and `null` where the general
 * comparison is what applies.
 *
 * **Without these this comparison would commit the defect `object/deep-equal@1` exists to publish.**
 * `Object.keys` of a Date, of a Map and of a Set are all the empty array - the one line of the
 * language that makes `fast-deep-equal` answer `true` for two different Sets. Measured on this very
 * file: breaking the decoder so that every instant came back as the epoch left this guard green.
 */
const beyondJson = (
  mine: object,
  theirs: object,
  path: string,
  seen: Map<unknown, unknown>,
): readonly string[] | null => {
  const differ = [`${at(path)} is ${show(mine)} where the registry decodes ${show(theirs)}`]

  if (mine instanceof Date || theirs instanceof Date) {
    const same =
      mine instanceof Date && theirs instanceof Date && Object.is(mine.getTime(), theirs.getTime())

    return same ? [] : differ
  }

  if (mine instanceof Map || theirs instanceof Map) {
    if (!(mine instanceof Map) || !(theirs instanceof Map) || mine.size !== theirs.size) return differ

    const held = [...theirs]

    return [...mine].flatMap(([key, value], index) => [
      ...disagreement(key, held[index]?.[0], `${at(path)}<key ${index}>`, seen),
      ...disagreement(value, held[index]?.[1], `${at(path)}<value ${index}>`, seen),
    ])
  }

  if (mine instanceof Error || theirs instanceof Error) {
    if (!(mine instanceof Error) || !(theirs instanceof Error)) return differ
    if (mine.name !== theirs.name || mine.message !== theirs.message) return differ

    return disagreement(mine.cause, theirs.cause, `${at(path)}<cause>`, seen)
  }

  const tag = tagOf(mine)
  if (tag !== tagOf(theirs)) return differ

  if (['String', 'Number', 'Boolean', 'BigInt', 'Symbol'].includes(tag)) {
    const held = (mine as { valueOf(): unknown }).valueOf()
    const other = (theirs as { valueOf(): unknown }).valueOf()

    return Object.is(held, other) ? null : differ
  }

  if (ArrayBuffer.isView(mine)) {
    const held = [...(mine as unknown as Iterable<unknown>)]
    const other = [...(theirs as unknown as Iterable<unknown>)]

    return held.length === other.length && held.every((entry, index) => Object.is(entry, other[index]))
      ? []
      : differ
  }

  // A record with no prototype is not a plain one, and this is the only thing that says so: their
  // fields are identical and `Object.keys` reads them alike.
  const bare = Object.getPrototypeOf(mine) === null
  if (bare !== (Object.getPrototypeOf(theirs) === null)) return differ

  return null
}

const faultsOf = (encoded: EncodedValue): readonly string[] =>
  disagreement(read(literal(encoded)), decode(encoded), '', new Map())

// ---------------------------------------------------------------------------
// One sample per arm, and the compiler is what keeps the list complete
// ---------------------------------------------------------------------------

const theSameObject = { team: 'green' }

/**
 * A value the registry encodes to each arm of `EncodedValue`, keyed by the arm.
 *
 * Real values rather than hand-written encodings, so that nothing here states twice what `encode`
 * already decides - and `the-sample-really-produces-the-arm-it-is-filed-under` is what stops a sample
 * from quietly covering something other than its key.
 */
const EVERY_ARM: Readonly<Record<EncodedValue['kind'], unknown>> = {
  primitive: '  42  ',
  number: -0,
  undefined: undefined,
  symbol: Symbol('red'),
  pattern: /^[a-z0-9-]*$/u,
  list: [1, 'two', true],
  record: { days: undefined, months: 1 },
  set: new Set([1, 2]),
  again: { items: [theSameObject, theSameObject] },
  hole: [1, , 3],
  'not-data': [1, (x: number) => x],
  'big-integer': 123n,
  instant: new Date(1234),
  /**
   * A Temporal carrier stood in for, because `Temporal` is `undefined` on both runtimes of this
   * repository's matrix. It matches a real one on every property the encoder reads - the tag on the
   * prototype, an ISO `toString`, and no own property at all - each measured on Chrome 152 against
   * `PlainTime`, `PlainYearMonth` and `Duration`. `round-trip.test.ts` carries the same double and the
   * same limit at length: **this does not exercise the spelling against a value `Temporal.from` can
   * read back**, and a runtime carrying the namespace is what would.
   */
  temporal: Object.create({
    [Symbol.toStringTag]: 'Temporal.PlainTime',
    toString: () => '12:30:00',
  }) as object,
  map: new Map<unknown, unknown>([['a', 1]]),
  // With a cause, because a cause is the half an error's spelling would be easiest to leave out.
  error: new TypeError('boom', { cause: 1 }),
  // Boxed and carrying an own property, so that the `Object.assign(…)` form is exercised here rather
  // than only where a contract happens to declare one.
  boxed: Object.assign(new Number(7), { tag: 1 }),
  'typed-array': new Uint8Array([1, 2]),
  /**
   * Refused rather than read back, and the word is the point: nothing about a promise's contents is
   * readable, so no expression builds the one a contract settled a case about.
   */
  opaque: Promise.resolve(1),
  /** Refused for the neighbouring reason - the class is not in the record and cannot be. */
  instance: new (class Sample {
    readonly x = 1
  })(),
}

const kindsIn = (encoded: EncodedValue, into: Set<string> = new Set()): ReadonlySet<string> => {
  into.add(encoded.kind)
  if (encoded.kind === 'list' || encoded.kind === 'set') {
    for (const entry of encoded.entries) kindsIn(entry, into)
  }
  if (encoded.kind === 'record' || encoded.kind === 'instance' || encoded.kind === 'boxed') {
    for (const field of encoded.fields) kindsIn(field.value, into)
  }
  if (encoded.kind === 'error') {
    for (const field of encoded.fields) kindsIn(field.value, into)
    if (encoded.cause !== undefined) kindsIn(encoded.cause, into)
  }
  if (encoded.kind === 'boxed') kindsIn(encoded.value, into)
  if (encoded.kind === 'instant') kindsIn(encoded.epoch, into)
  if (encoded.kind === 'typed-array') for (const entry of encoded.elements) kindsIn(entry, into)
  if (encoded.kind === 'map') {
    for (const entry of encoded.entries) {
      kindsIn(entry.key, into)
      kindsIn(entry.value, into)
    }
  }

  return into
}

/**
 * The arms whose spelling is real and whose reading depends on the runtime, with what the refusal owes
 * a reader where that runtime is absent.
 *
 * ---------------------------------------------------------------------------
 * Why a third category, and why it is narrower than the two it sits beside
 * ---------------------------------------------------------------------------
 *
 * The guard below used to carry two: a spelling that reads back, or a word from `WITHOUT_A_SPELLING`
 * that is refused. **A carrier is neither.** `Temporal.PlainTime.from('12:30:00')` is a spelling a
 * reader can paste - into a browser that carries the namespace, which is where `read-literal.ts` runs -
 * and it is unreadable on the runtime these guards run on, where `Temporal` is `undefined`.
 *
 * **This is not the two-way test widened.** Where `WITHOUT_A_SPELLING` asks only that the refusal
 * carry a word, this asks that it carry **the carrier's own type name and the reason the runtime cannot
 * build it** - both fragments, on the same refusal. A message saying merely *unreadable* satisfies the
 * old shape and fails this one, so the category costs its arm more than the two beside it and not less.
 *
 * **What it does not reach is the other half**: that the same spelling *is* read where the namespace
 * exists. Nothing on this matrix can ask it. A runtime carrying `Temporal` is what would, and on that
 * day this declaration loses its row and the arm moves into the reading half above. ADR-0234.
 */
const READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT: Readonly<Record<string, readonly [string, string]>> = {
  temporal: ['Temporal.PlainTime', '`Temporal` is not defined here'],
}

describe('the text somebody typed, as the value it spells', () => {
  /**
   * The load-bearing guard, and the one a count could not have given. The record is total over the
   * union, so an arm added to `EncodedValue` does not compile until somebody writes a sample - and
   * deciding whether it can be read, must be refused, or is read only where a runtime carries it is
   * exactly the decision that arm's author owes.
   */
  it('every-arm-of-an-encoded-value-is-read-back-or-refused-by-name', () => {
    const answers = Object.entries(EVERY_ARM).map(([kind, value]) => {
      const encoded = encode(value, 'a sample')
      const text = literal(encoded)

      const runtimeBound = READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT[kind]
      if (runtimeBound !== undefined) {
        const [carrier, why] = runtimeBound

        expect(() => read(text), `${kind} is read where this runtime cannot build it`).toThrow(
          UnreadableLiteral,
        )
        // Both fragments on one refusal: which carrier, and why this runtime cannot build it.
        expect(() => read(text), `${kind} is refused without naming the carrier`).toThrow(carrier)
        expect(() => read(text), `${kind} is refused without naming the runtime`).toThrow(why)

        return [kind, []] as const
      }

      if (!withoutASpelling.has(kind)) return [kind, faultsOf(encoded)] as const

      expect(() => read(text), `${kind} is read where it must be refused`).toThrow(UnreadableLiteral)
      expect(() => read(text)).toThrow(
        WITHOUT_A_SPELLING[kind as keyof typeof WITHOUT_A_SPELLING],
      )

      return [kind, []] as const
    })

    expect(answers.filter(([, faults]) => faults.length > 0)).toEqual([])
  })

  /**
   * The two declarations are disjoint, which is what stops an arm being filed under both and quietly
   * taking the weaker test.
   */
  it('no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it', () => {
    const both = Object.keys(READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT).filter((kind) =>
      withoutASpelling.has(kind),
    )

    expect(both).toEqual([])
  })

  /**
   * The spelling a page prints is the form the reader dispatches on, so a carrier's refusal is the
   * runtime's and never the reader failing to recognise it. Without this, dropping the reader's arm
   * would leave the guard above green - the refusal would still throw and would still carry the type
   * name, because the type name is in the text somebody typed.
   */
  it('a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime', () => {
    const spelled = literal(encode(EVERY_ARM.temporal, 'a sample'))

    expect(spelled).toBe("Temporal.PlainTime.from('12:30:00')")
    expect(() => read(spelled)).toThrow('names a carrier this runtime cannot build')
    expect(() => read(spelled)).not.toThrow('begins no value this reader knows')
  })

  it('the-sample-really-produces-the-arm-it-is-filed-under', () => {
    const misfiled = Object.entries(EVERY_ARM).filter(
      ([kind, value]) => !kindsIn(encode(value, 'a sample')).has(kind),
    )

    expect(misfiled.map(([kind]) => kind)).toEqual([])
  })

  // -------------------------------------------------------------------------
  // The catalogue
  // -------------------------------------------------------------------------

  /**
   * Every case the registry serves, read back from the literal its own page publishes.
   *
   * The bound is what stops this from passing on an empty list: the contracts reached here have to be
   * the installable entries of the index, which is a second answer of the port and not a second
   * reading of this one.
   */
  it('every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes', () => {
    const installable = source.contractIndex().entries.filter((entry) => entry.installable)
    const served = servedCases()
    const held = heldByTheRegistry(source)

    expect(new Set(served.map((one) => one.contract)).size).toBe(installable.length)
    expect(
      held.map((one) => one.contract.caseTables.every((table) => table.cases.length > 0)),
    ).toEqual(held.map(() => true))

    /**
     * Rows whose value the page prints a word for are out of this population by construction, and the
     * filter is `hasASpelling` rather than a list: there is no text for a reader to type that builds
     * *that* function, so there is nothing here to read back. The guard below is what keeps that set
     * from growing past what the printer really declines. ADR-0160.
     */
    const faults = served
      .filter(({ entry }) => hasASpelling(entry.data))
      .flatMap(({ contract, entry }) =>
        faultsOf(entry.data).map((fault) => `${contract}#${entry.id}: ${fault}`),
      )

    expect(faults).toEqual([])
    expect(served.filter(({ entry }) => hasASpelling(entry.data)).length).toBeGreaterThan(0)
  })

  /**
   * A case printed as a word is a case the form declines to open, and the two say so of each other.
   *
   * **This guard predicted its own reopening and the question it would ask**, which is worth recording
   * because an entry of this kind usually closes by surprise. It read: *it is true today because every
   * case printing a word with no spelling belongs to `array/group-by@1`, which was refused before
   * publication and has no page. It reddens the day a higher-order contract gains one - which is the
   * day somebody has to decide what that contract's playground does with a case whose input is a
   * function.* `object/deep-equal@1` is that contract and this is that day. ADR-0160.
   *
   * **What replaces the invariant is the agreement rather than a weaker version of it.** The old claim
   * cannot be kept - a function has no expression that builds *that* function - and dropping it would
   * leave a page free to print a word into a field. So the claim is now that the two halves cannot
   * disagree: what `packages/site/literal.ts` prints a word for is exactly what
   * `whatKeepsARowFromTheForm` keeps out of the form, read case by case over everything served.
   *
   * The word is matched in the printed text rather than derived, deliberately: the *other* side is the
   * derivation, and a guard whose two sides are one derivation compares nothing.
   */
  it('a-case-printed-as-a-word-is-a-case-the-form-declines-to-open', () => {
    const words = Object.values(WITHOUT_A_SPELLING)
    const held = heldByTheRegistry(source)

    const faults = held.flatMap((one) =>
      one.contract.caseTables.flatMap((table) =>
        table.cases.flatMap((entry) => {
          const printed = words.some((word) => literal(entry.data).includes(word))
          const declined = whatKeepsACaseFromTheForm(entry, one.contract)
          const what = `${renderContract(one.contract.address)}#${entry.id}`

          if (printed && declined === null) return [`${what} prints a word and the form takes it`]

          return !printed && declined?.includes('no JavaScript spelling') === true
            ? [`${what} spells out and the form refuses it for having no spelling`]
            : []
        }),
      ),
    )

    expect(faults).toEqual([])
    // The bound, so a run reaching no case cannot pass on an empty list.
    expect(held.flatMap((one) => one.contract.caseTables.flatMap((table) => table.cases)).length)
      .toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  // The notation itself
  // -------------------------------------------------------------------------

  /**
   * The two inputs `number/parse@1` settles opposite answers on, which are the same eight glyphs on
   * screen. This notation tells them apart, which is what a case row on a page rests on: the table
   * prints `'1 000'` and `'1 000'` and a reader can see which row is which.
   *
   * It is no longer what the playground field rests on. Measured in Chrome, a text field carries a
   * no-break space whole, so both spellings reach the contract intact and what distinguishes them on
   * screen is the printed call. ADR-0096.
   */
  it('two-inputs-that-look-alike-are-read-apart', () => {
    expect(read("'1\\u00A0000'")).toBe(`1${String.fromCharCode(0x00a0)}000`)
    expect(read("'1 000'")).toBe('1 000')
    expect(read("'1\\u00A0000'")).not.toBe(read("'1 000'"))
  })

  it('a-code-point-above-the-basic-plane-survives-the-round-trip', () => {
    const combiningStem = String.fromCodePoint(0x1d165)

    expect(literal(encode(`x${combiningStem}`, 'here'))).toBe("'x\\u{1D165}'")
    expect(read("'x\\u{1D165}'")).toBe(`x${combiningStem}`)
  })

  it('the-numbers-json-cannot-carry-are-read-as-themselves', () => {
    expect(Object.is(read('-0'), -0)).toBe(true)
    expect(read('NaN')).toBeNaN()
    expect([read('Infinity'), read('-Infinity')]).toEqual([Infinity, -Infinity])
    expect(read('1e21')).toBe(1e21)
  })

  it('a-field-set-to-undefined-is-not-a-field-that-is-absent', () => {
    expect(Object.keys(read('{ days: undefined }') as object)).toEqual(['days'])
    expect(Object.keys(read('{}') as object)).toEqual([])
  })

  /** White space a reader adds while editing means nothing, and the notation itself is exact. */
  it('spacing-is-forgiven-and-a-second-spelling-is-not', () => {
    expect(read('  {  days :  1 ,  }  ')).toEqual({ days: 1 })
    expect(read('[ 1,2 , 3 ]')).toEqual([1, 2, 3])
    expect(() => read('"a string"')).toThrow(UnreadableLiteral)
    expect(() => read('{ days: 1 } and more')).toThrow(UnreadableLiteral)
  })

  it('a-shared-object-is-read-back-as-one-object', () => {
    const value = read("[#1 = { team: 'green' }, #1]") as readonly unknown[]

    expect(value[0]).toBe(value[1])
    expect(() => read('[#2]')).toThrow(/referred to before it is defined/)
  })
})
