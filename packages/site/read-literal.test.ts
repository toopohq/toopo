import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type { CaseRecord } from '../registry/contract-record.js'
import type { EncodedValue } from '../registry/value.js'
import { decode, encode } from '../registry/value.js'
import { heldByTheRegistry } from './catalogue.js'
import { WITHOUT_A_SPELLING, literal } from './literal.js'
import { localSource } from './local-source.js'
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
 * That is why `no-case-the-registry-serves-is-printed-as-a-word-with-no-spelling` is written as an
 * assertion rather than as a remark. It is the invariant the playground needs, and it reddens on the
 * day a higher-order contract gains a page - which is exactly the day somebody has to decide what that
 * contract's playground does with a case whose input is a function.
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

const show = (value: unknown): string =>
  Object.is(value, -0) ? '-0' : typeof value === 'string' ? `'${value}'` : String(value)

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

const recordFaults = (
  mine: Record<string, unknown>,
  theirs: Record<string, unknown>,
  path: string,
  seen: Map<unknown, unknown>,
) => {
  const mineKeys = Object.keys(mine).sort()
  const theirKeys = Object.keys(theirs).sort()

  if (mineKeys.join() !== theirKeys.join()) {
    return [`${at(path)} holds [${mineKeys}] where the registry decodes [${theirKeys}]`]
  }

  return mineKeys.flatMap((key) =>
    disagreement(mine[key], theirs[key], `${at(path)}.${key}`, seen),
  )
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

  if (typeof mine === 'symbol' || typeof theirs === 'symbol') {
    const same =
      typeof mine === 'symbol' && typeof theirs === 'symbol' && mine.description === theirs.description

    return same ? [] : differ
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

  // The kinds whose whole value lives where  cannot see it. Without these, this
  // comparison would commit the defect  exists to publish:  of a
  // Date, of a Map and of a Set are all the empty array, so every Date would compare equal to every
  // other and a reader that built the wrong instant would pass. Measured - it did.
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

describe('the text somebody typed, as the value it spells', () => {
  /**
   * The load-bearing guard, and the one a count could not have given. The record is total over the
   * union, so an arm added to `EncodedValue` does not compile until somebody writes a sample - and
   * deciding whether it can be read or must be refused is exactly the decision that arm's author owes.
   */
  it('every-arm-of-an-encoded-value-is-read-back-or-refused-by-name', () => {
    const answers = Object.entries(EVERY_ARM).map(([kind, value]) => {
      const encoded = encode(value, 'a sample')
      const text = literal(encoded)

      if (!withoutASpelling.has(kind)) return [kind, faultsOf(encoded)] as const

      expect(() => read(text), `${kind} is read where it must be refused`).toThrow(UnreadableLiteral)
      expect(() => read(text)).toThrow(
        WITHOUT_A_SPELLING[kind as keyof typeof WITHOUT_A_SPELLING],
      )

      return [kind, []] as const
    })

    expect(answers.filter(([, faults]) => faults.length > 0)).toEqual([])
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

    const faults = served.flatMap(({ contract, entry }) =>
      faultsOf(entry.data).map((fault) => `${contract}#${entry.id}: ${fault}`),
    )

    expect(faults).toEqual([])
  })

  /**
   * The invariant a playground rests on, asserted rather than remarked.
   *
   * It is true today because every case printing a word with no spelling belongs to
   * `array/group-by@1`, which was refused before publication and has no page. It reddens the day a
   * higher-order contract gains one - which is the day somebody has to decide what that contract's
   * playground does with a case whose input is a function, rather than the day a reader meets a field
   * that cannot be filled.
   */
  it('no-case-the-registry-serves-is-printed-as-a-word-with-no-spelling', () => {
    const words = Object.values(WITHOUT_A_SPELLING)
    const unreadable = servedCases().filter(({ entry }) =>
      words.some((word) => literal(entry.data).includes(word)),
    )

    expect(unreadable.map(({ contract, entry }) => `${contract}#${entry.id}`)).toEqual([])
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
