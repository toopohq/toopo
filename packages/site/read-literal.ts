/**
 * The text somebody typed, as the value it spells - the inverse of `literal`.
 * ADR-0055 is why the arm table is a record keyed by the union rather than a pass over real cases.
 *
 * ADR-0029 is why the replay imports the stripped artefact rather than this module.
 *
 *
 * ---------------------------------------------------------------------------
 * Why `JSON.parse` is not this function
 * ---------------------------------------------------------------------------
 *
 * A playground field declared `Duration` holds a literal, and the literals this catalogue publishes
 * are not JSON. Block 4.4 alone settles cases on `{ days: undefined }`, on `-0`, on `Infinity`, on
 * `NaN`, on a lone surrogate, on a hole in a sparse array, on a symbol, on a regular expression, and
 * on two fields holding the *same* object. `JSON.parse` answers a different value for five of those
 * and refuses the rest - which is why `packages/registry/value.ts` exists at all, and this file is
 * that argument arriving from the other direction.
 *
 * ---------------------------------------------------------------------------
 * The three arms it refuses, and why refusing is the whole point
 * ---------------------------------------------------------------------------
 *
 * `literal` prints a bracketed phrase for a function, for a value whose contents cannot be read and
 * for an instance of a class, deliberately, because none of the three has a JavaScript spelling.
 * Whoever meets one gets a refusal that names it, never a value: a reader answering anything at all
 * for a function would put a value where the registry deliberately serves a file, and one answering a
 * plain object for an instance would build the very thing `object/deep-equal@1` settles it is not. The
 * phrases are imported from `literal.ts` rather than written again, so the printing and the refusal
 * cannot come apart - and what is imported is what each phrase *opens with*, because an instance goes
 * on to name its class and the fields under it.
 *
 * **This paragraph read `<hole>` and `<a function, served as a file>`, and counted them as two.** Both
 * halves were false. A hole has had a spelling since ADR-0160 - it prints as nothing at all, which is
 * the language's own notation, and `readList` below builds a real one rather than refusing it - and
 * the two arms that arrived with `object/deep-equal@1` were never added here. The sentence went on
 * describing a reader that had stopped existing, in the file whose subject is these exact words.
 * ADR-0164.
 *
 * ---------------------------------------------------------------------------
 * Strict on the notation, forgiving on the spacing
 * ---------------------------------------------------------------------------
 *
 * White space between tokens is skipped, because somebody editing a pre-filled field adds and removes
 * it without meaning anything by it. Everything else is exactly what `literal` writes: single quotes,
 * because that is the quote a case is published under, and a second accepted spelling would be a shape
 * this reader accepts and its inverse never produces - surface with no guard behind it. The refusal
 * says what the notation is, so a field teaches rather than only declining.
 */

import { WITHOUT_A_SPELLING } from './literal.js'

export class UnreadableLiteral extends Error {
  constructor(text: string, at: number, detail: string) {
    super(
      `\`${text}\` cannot be read as a value: ${detail}, at character ${at + 1}. A value is written ` +
        `here the way the catalogue writes it - 'a string', 42, -0, undefined, [1, 2], ` +
        `{ field: value }.`,
    )
    this.name = 'UnreadableLiteral'
  }
}

/** Where the reading has got to, and the objects it has already named. */
type Cursor = {
  readonly text: string
  at: number
  readonly shared: Map<number, unknown>
}

const fail = (scan: Cursor, detail: string): never => {
  throw new UnreadableLiteral(scan.text, scan.at, detail)
}

const skipSpace = (scan: Cursor): void => {
  while (scan.at < scan.text.length && /\s/.test(scan.text[scan.at] as string)) scan.at += 1
}

/** Consumes `token` when it is next, and answers whether it was. */
const take = (scan: Cursor, token: string): boolean => {
  if (!scan.text.startsWith(token, scan.at)) return false
  scan.at += token.length

  return true
}

const AFTER_A_WORD = /[A-Za-z0-9_$]/

/** The same, for a token that must not run into an identifier: `nullish` does not begin with `null`. */
const takeWord = (scan: Cursor, word: string): boolean => {
  const after = scan.text[scan.at + word.length]
  if (after !== undefined && AFTER_A_WORD.test(after)) return false

  return take(scan, word)
}

/** Consumes what `pattern` matches at the cursor, and answers it. */
const takePattern = (scan: Cursor, pattern: RegExp): string | null => {
  const found = pattern.exec(scan.text.slice(scan.at))
  if (found === null) return null
  scan.at += found[0].length

  return found[0]
}

// ---------------------------------------------------------------------------
// The leaves
// ---------------------------------------------------------------------------

const SHORT: Readonly<Record<string, string>> = { t: '\t', n: '\n', r: '\r', '\\': '\\', "'": "'" }

const HEXADECIMAL = /^[0-9A-Fa-f]+$/

/** One escape, entered at the character after the backslash. */
const readEscape = (scan: Cursor): string => {
  const marker = scan.text[scan.at]
  if (marker === undefined) return fail(scan, 'the string ends on a backslash')

  const short = SHORT[marker]
  if (short !== undefined) {
    scan.at += 1

    return short
  }

  if (marker !== 'u') return fail(scan, `\\${marker} is not an escape this notation writes`)
  scan.at += 1

  const braced = take(scan, '{')
  const ends = braced ? scan.text.indexOf('}', scan.at) : scan.at + 4
  if (braced && ends < 0) return fail(scan, 'the braced code point is never closed')

  const digits = scan.text.slice(scan.at, ends)
  if (!HEXADECIMAL.test(digits) || (!braced && digits.length !== 4)) {
    return fail(scan, `\`${digits}\` is not a code point in hexadecimal`)
  }

  const code = Number.parseInt(digits, 16)
  if (code > 0x10ffff) return fail(scan, `${digits} is past the last code point there is`)

  scan.at = ends + (braced ? 1 : 0)

  return String.fromCodePoint(code)
}

/** A string, entered at its opening quote. */
const readString = (scan: Cursor): string => {
  scan.at += 1
  let value = ''

  for (;;) {
    const character = scan.text[scan.at]
    if (character === undefined) return fail(scan, 'the string is never closed')
    if (character === "'") {
      scan.at += 1

      return value
    }

    scan.at += 1
    value += character === '\\' ? readEscape(scan) : character
  }
}

/** A regular expression, whose own `source` escapes the delimiter it would otherwise end on. */
const readPattern = (scan: Cursor): RegExp => {
  const from = scan.at
  scan.at += 1

  while (scan.text[scan.at] !== '/') {
    const character = scan.text[scan.at]
    if (character === undefined) return fail(scan, 'the pattern is never closed')
    scan.at += character === '\\' ? 2 : 1
  }

  const source = scan.text.slice(from + 1, scan.at)
  scan.at += 1
  const flags = takePattern(scan, /^[a-z]*/) ?? ''

  try {
    return new RegExp(source, flags)
  } catch {
    scan.at = from

    return fail(scan, `/${source}/${flags} is not a pattern this engine accepts`)
  }
}

// ---------------------------------------------------------------------------
// The shapes that hold other values
// ---------------------------------------------------------------------------

/**
 * The comma-separated entries up to `closing`, entered just inside the bracket that opened them.
 *
 * A trailing comma is accepted because a caller editing a pre-filled field leaves one behind, and
 * because the catalogue's own signatures are written with one.
 */
const readSequence = (scan: Cursor, closing: string, entry: () => void): void => {
  skipSpace(scan)
  if (take(scan, closing)) return

  for (;;) {
    entry()
    skipSpace(scan)
    if (take(scan, closing)) return
    if (!take(scan, ',')) fail(scan, `a comma or a \`${closing}\` has to come next`)
    skipSpace(scan)
    if (take(scan, closing)) return
  }
}

/**
 * A list, holes included.
 *
 * **It does not go through `readSequence`, and the hole is why.** `[, 1]` is a list of two whose first
 * element is absent and `[1, 2, ,]` is a list of three whose last is - so an empty position between
 * two commas is an element here, where everywhere else in this notation it is nothing at all. A
 * trailing comma after a *value* closes the list without adding one, which is the same comma meaning
 * two things and the reason the two readers are apart.
 *
 * The hole is made by growing `length` and never assigning, so what comes back is a real hole rather
 * than an `undefined` - which is the pair of cases `object/deep-equal@1` settles. ADR-0160.
 */
const readList = (scan: Cursor, label: number | undefined): readonly unknown[] => {
  const entries: unknown[] = []
  if (label !== undefined) scan.shared.set(label, entries)

  scan.at += 1
  for (;;) {
    skipSpace(scan)
    if (take(scan, ']')) return entries
    if (scan.text[scan.at] === ',') {
      scan.at += 1
      entries.length += 1
      continue
    }

    entries.push(readValue(scan))
    skipSpace(scan)
    if (take(scan, ']')) return entries
    if (!take(scan, ',')) fail(scan, 'a comma or a `]` has to come next')
  }
}

const readSet = (scan: Cursor, label: number | undefined): ReadonlySet<unknown> => {
  const entries = new Set<unknown>()
  if (label !== undefined) scan.shared.set(label, entries)

  readSequence(scan, ']', () => {
    entries.add(readValue(scan))
  })
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, 'a `new Set([` has to be closed by a `)`')

  return entries
}

const A_FIELD_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*/

const readFieldName = (scan: Cursor): string => {
  skipSpace(scan)
  if (scan.text[scan.at] === "'") return readString(scan)

  const found = takePattern(scan, A_FIELD_NAME)
  if (found === null) return fail(scan, 'a field name has to be an identifier or a quoted string')

  return found
}

/**
 * What a field is keyed by: a name, or a value in brackets.
 *
 * The bracketed form is the language's computed key, and the only value this notation ever puts in it
 * is a symbol - so a key that reads back as anything else is refused here rather than becoming a
 * property named after whatever it stringifies to.
 */
const readFieldKey = (scan: Cursor): string | symbol => {
  skipSpace(scan)
  if (!take(scan, '[')) return readFieldName(scan)

  const key = readValue(scan)
  skipSpace(scan)
  if (!take(scan, ']')) fail(scan, 'a computed key has to be closed by a `]`')
  if (typeof key !== 'symbol') {
    fail(scan, 'a computed key is written here only for a symbol')
  }

  return key as symbol
}

/**
 * One record. Every field is *defined* rather than assigned, and that is not a precaution about
 * hostile input: `array/group-by@1` settles what happens to a key called `__proto__`, and an
 * assignment there sets the prototype instead of the field - so the one case the catalogue wrote about
 * that name would be the one case this reader lost.
 */
const readRecord = (scan: Cursor, label: number | undefined): Readonly<Record<string, unknown>> => {
  const record: Record<string, unknown> = {}
  if (label !== undefined) scan.shared.set(label, record)

  scan.at += 1
  readSequence(scan, '}', () => {
    const key = readFieldKey(scan)
    skipSpace(scan)
    if (!take(scan, ':')) fail(scan, `the field \`${String(key)}\` is not followed by a colon`)

    const value = readValue(scan)
    Object.defineProperty(record, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    })
  })

  return record
}

// ---------------------------------------------------------------------------
// A value
// ---------------------------------------------------------------------------

const A_NUMBER = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/
const A_SET_OPENS = /^new\s+Set\s*\(\s*\[/
const A_SYMBOL_OPENS = /^Symbol\s*\(/

// The forms `literal.ts` prints for the kinds a contract of this catalogue produces beyond JSON. Each
// one is a spelling somebody can paste into a console and get the value back, which is the whole test
// of whether it belonged on a page at all.
const A_BIG_INTEGER = /^-?\d+n/
const A_DATE_OPENS = /^new\s+Date\s*\(/
const A_MAP_OPENS = /^new\s+Map\s*\(\s*\[/
const AN_ERROR_OPENS =
  /^new\s+(Error|TypeError|RangeError|SyntaxError|ReferenceError|EvalError|URIError)\s*\(/
const A_BOX_OPENS = /^new\s+(String|Number|Boolean)\s*\(/
const AN_OBJECT_CALL_OPENS = /^Object\s*\(/
/** The carrier's own type name is captured, because the refusal below has to be able to say which. */
const A_CARRIER_OPENS = /^Temporal\.([A-Za-z]+)\s*\.\s*from\s*\(/
const A_TYPED_ARRAY_OPENS =
  /^new\s+(Int8Array|Uint8ClampedArray|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array)\s*\(\s*\[/
const AN_ASSIGN_OPENS = /^Object\s*\.\s*assign\s*\(/
const A_BARE_OBJECT = /^Object\s*\.\s*create\s*\(\s*null\s*\)/

const ERROR_CONSTRUCTORS: Readonly<Record<string, ErrorConstructor | undefined>> = {
  Error,
  TypeError,
  RangeError,
  SyntaxError,
  ReferenceError,
  EvalError,
  URIError,
}

const BOXES: Readonly<Record<string, ((value: never) => object) | undefined>> = {
  String: (value: string) => new String(value),
  Number: (value: number) => new Number(value),
  Boolean: (value: boolean) => new Boolean(value),
}

const TYPED_ARRAYS = {
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

/** One argument, then the `)` that closes the call it opened. */
const readOneArgument = (scan: Cursor, what: string): unknown => {
  const value = readValue(scan)
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, `a \`${what}\` has to be closed by a \`)\``)

  return value
}

const readDate = (scan: Cursor, label: number | undefined): Date => {
  const epoch = readOneArgument(scan, 'new Date(')
  const instant = new Date(epoch as number)
  if (label !== undefined) scan.shared.set(label, instant)

  return instant
}

/**
 * A Temporal carrier, built where the runtime carries the namespace and refused by name where it does
 * not.
 *
 * ---------------------------------------------------------------------------
 * Why it refuses rather than skipping or standing something in
 * ---------------------------------------------------------------------------
 *
 * `readDate` one function up ends in `new Date(epoch)`, because `Date` is in the language. This one has
 * to end in `Temporal[name].from(rendered)`, and `Temporal` is `undefined` on both runtimes this
 * repository's suites run on. **Three ways out were open and two are refused by rules this catalogue
 * already holds.** Returning a stand-in would put a value in a contract's hands that the contract
 * cannot use, and would make every guard here exercise the substitute rather than the thing - which is
 * ADR-0233's finding, committed in the unit that recorded it. Answering `undefined` and carrying on is
 * the silent skip `array/group-by@1` settles against: *a runtime without the function fails loudly
 * instead of skipping*.
 *
 * So it refuses, and the refusal names the carrier, the value and the runtime, on
 * `theDirectoryRefusal`'s pattern in `packages/cli/where-a-file-may-land.ts`: a reader is told what
 * could not be built and why, rather than being handed a reason nobody can act on.
 *
 * **What is exercised here is the refusal and never the construction.** Every guard over this arm runs
 * where `Temporal` is absent, so the branch that builds a carrier is written and unread. **A runtime
 * carrying `Temporal` on the matrix is what lifts that**, and on that day the guards over this arm gain
 * the other half. ADR-0233, ADR-0234.
 */
const readCarrier = (scan: Cursor, typeName: string, label: number | undefined): unknown => {
  const at = scan.at
  const rendered = readOneArgument(scan, `Temporal.${typeName}.from(`)
  const namespace = (globalThis as { Temporal?: Record<string, { from?: (text: unknown) => unknown }> })
    .Temporal

  if (namespace === undefined) {
    scan.at = at

    return fail(
      scan,
      `\`Temporal.${typeName}.from(…)\` names a carrier this runtime cannot build: \`Temporal\` is ` +
        `not defined here, so there is nothing to hand the value ${JSON.stringify(rendered)} to`,
    )
  }

  const carrier = namespace[typeName]?.from
  if (carrier === undefined) {
    scan.at = at

    return fail(
      scan,
      `\`Temporal.${typeName}\` is not a carrier this runtime knows: the namespace is here and ` +
        `\`${typeName}\` is not in it`,
    )
  }

  const built = carrier.call(namespace[typeName], rendered)
  if (label !== undefined && typeof built === 'object' && built !== null) {
    scan.shared.set(label, built)
  }

  return built
}

const readMap = (scan: Cursor, label: number | undefined): ReadonlyMap<unknown, unknown> => {
  const entries = new Map<unknown, unknown>()
  if (label !== undefined) scan.shared.set(label, entries)

  readSequence(scan, ']', () => {
    skipSpace(scan)
    if (!take(scan, '[')) fail(scan, 'an entry of a `new Map([` is a `[key, value]` pair')
    const key = readValue(scan)
    skipSpace(scan)
    if (!take(scan, ',')) fail(scan, 'a map entry needs a comma between its key and its value')
    const value = readValue(scan)
    skipSpace(scan)
    if (!take(scan, ']')) fail(scan, 'a map entry has to be closed by a `]`')
    entries.set(key, value)
  })
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, 'a `new Map([` has to be closed by a `)`')

  return entries
}

const readError = (scan: Cursor, kind: string, label: number | undefined): Error => {
  skipSpace(scan)
  const message = readString(scan)
  skipSpace(scan)

  const cause = take(scan, ',') ? (readValue(scan) as { readonly cause?: unknown }) : undefined
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, `a \`new ${kind}(\` has to be closed by a \`)\``)

  const make = ERROR_CONSTRUCTORS[kind] as ErrorConstructor
  const failure =
    cause === undefined ? new make(message) : new make(message, { cause: cause.cause })

  if (label !== undefined) scan.shared.set(label, failure)

  return failure
}

const readBox = (scan: Cursor, kind: string, label: number | undefined): object => {
  const value = readOneArgument(scan, `new ${kind}(`)
  const box = (BOXES[kind] as (held: unknown) => object)(value)
  if (label !== undefined) scan.shared.set(label, box)

  return box
}

/** `Object(x)`, which is how a boxed bigint or symbol is written - neither has a `new` form. */
const readObjectCall = (scan: Cursor, label: number | undefined): object => {
  const value = readOneArgument(scan, 'Object(')
  if (typeof value !== 'bigint' && typeof value !== 'symbol') {
    return fail(scan, '`Object(` is how a boxed bigint or symbol is written, and holds one of those')
  }

  const box = Object(value) as object
  if (label !== undefined) scan.shared.set(label, box)

  return box
}

const readTypedArray = (scan: Cursor, kind: string, label: number | undefined): ArrayBufferView => {
  const elements: unknown[] = []
  readSequence(scan, ']', () => {
    elements.push(readValue(scan))
  })
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, `a \`new ${kind}([\` has to be closed by a \`)\``)

  const make = TYPED_ARRAYS[kind as keyof typeof TYPED_ARRAYS] as {
    from(source: readonly unknown[]): ArrayBufferView
  }
  const built = make.from(elements)
  if (label !== undefined) scan.shared.set(label, built)

  return built
}

/**
 * `Object.assign(x, { … })`, which is how a value carrying own properties beside a slot is written.
 *
 * The fields are *defined* rather than assigned, for the reason `readRecord` defines its own: a field
 * called `__proto__` is a field on one side of that difference and a prototype on the other, and
 * `array/group-by@1` settles a case on exactly that name.
 */
const readAssign = (scan: Cursor, label: number | undefined): object => {
  const target = readValue(scan) as Record<string, unknown>
  if (label !== undefined) scan.shared.set(label, target)

  skipSpace(scan)
  if (!take(scan, ',')) fail(scan, 'an `Object.assign(` needs a comma between its two arguments')
  skipSpace(scan)
  if (scan.text[scan.at] !== '{') fail(scan, 'the second argument of `Object.assign(` is a record')

  const fields = readRecord(scan, undefined)
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, 'an `Object.assign(` has to be closed by a `)`')

  for (const [name, value] of Object.entries(fields)) {
    Object.defineProperty(target, name, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    })
  }

  return target
}

/** A symbol, whose description is a string or nothing at all. */
const readSymbol = (scan: Cursor, label: number | undefined): symbol => {
  skipSpace(scan)
  const description = scan.text[scan.at] === "'" ? readString(scan) : undefined
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, 'a `Symbol(` has to be closed by a `)`')

  const held = Symbol(description)
  // A symbol takes a label like an object, and for the same reason: `{ [#1 = Symbol('s')]: 1 }` beside
  // `{ [#1]: 2 }` is one symbol keying two objects, which is a different value from two symbols.
  if (label !== undefined) scan.shared.set(label, held)

  return held
}

const readTerm = (scan: Cursor, label: number | undefined): unknown => {
  skipSpace(scan)

  for (const word of Object.values(WITHOUT_A_SPELLING)) {
    if (scan.text.startsWith(word, scan.at)) {
      return fail(
        scan,
        `\`${word}\` is what a page prints where a value has no JavaScript spelling, so there is ` +
          `nothing here to read`,
      )
    }
  }

  const character = scan.text[scan.at]
  if (character === undefined) return fail(scan, 'there is no value here')
  if (character === '[') return readList(scan, label)
  if (character === '{') return readRecord(scan, label)
  if (takePattern(scan, A_SET_OPENS) !== null) return readSet(scan, label)
  if (takePattern(scan, A_MAP_OPENS) !== null) return readMap(scan, label)
  if (takePattern(scan, A_DATE_OPENS) !== null) return readDate(scan, label)

  // Above `Object(`, which does not match it, and beside `new Date(` for the reason they share: both
  // are a named constructor taking one argument, and this one carries its type in the name.
  const aCarrier = A_CARRIER_OPENS.exec(scan.text.slice(scan.at))
  if (aCarrier !== null) {
    scan.at += aCarrier[0].length

    return readCarrier(scan, aCarrier[1] as string, label)
  }

  // Before `Object(`, which its first six characters would otherwise match.
  if (takePattern(scan, A_BARE_OBJECT) !== null) return Object.create(null) as object
  if (takePattern(scan, AN_ASSIGN_OPENS) !== null) return readAssign(scan, label)
  if (takePattern(scan, AN_OBJECT_CALL_OPENS) !== null) return readObjectCall(scan, label)

  const anError = takePattern(scan, AN_ERROR_OPENS)
  if (anError !== null) return readError(scan, anError.replace(/^new\s+|\s*\($/g, ''), label)

  const aBox = takePattern(scan, A_BOX_OPENS)
  if (aBox !== null) return readBox(scan, aBox.replace(/^new\s+|\s*\($/g, ''), label)

  const aTypedArray = takePattern(scan, A_TYPED_ARRAY_OPENS)
  if (aTypedArray !== null) {
    return readTypedArray(scan, aTypedArray.replace(/^new\s+|\s*\(\s*\[$/g, ''), label)
  }

  // The one primitive that carries a label, above the refusal because of it: identity is what a symbol
  // is, so `#1 = Symbol('s')` and `#1` beside it are one symbol and not two of one description.
  if (takePattern(scan, A_SYMBOL_OPENS) !== null) return readSymbol(scan, label)

  if (label !== undefined) {
    return fail(
      scan,
      'only a symbol, a list, a set, a record, a map, a date, an error, a boxed primitive or a typed ' +
        'array is addressed by a `#n =` label',
    )
  }

  // Before the number, whose pattern would otherwise take the digits and leave the `n` behind.
  const big = takePattern(scan, A_BIG_INTEGER)
  if (big !== null) return BigInt(big.slice(0, -1))

  if (character === "'") return readString(scan)
  if (character === '/') return readPattern(scan)
  if (takeWord(scan, 'undefined')) return undefined
  if (takeWord(scan, 'null')) return null
  if (takeWord(scan, 'true')) return true
  if (takeWord(scan, 'false')) return false
  if (takeWord(scan, 'NaN')) return Number.NaN
  if (takeWord(scan, 'Infinity')) return Number.POSITIVE_INFINITY
  if (takeWord(scan, '-Infinity')) return Number.NEGATIVE_INFINITY

  const number = takePattern(scan, A_NUMBER)
  if (number !== null) return Number(number)

  return fail(scan, `\`${scan.text.slice(scan.at, scan.at + 12)}\` begins no value this reader knows`)
}

const A_LABEL = /^#\d+/

/**
 * A shared object, which is either being named here or being referred back to.
 *
 * `#1 = { … }` defines and `#1` refers, so the two are told apart by what follows the number - and the
 * definition registers the object *before* its own entries are read, which is what lets a value hold
 * itself.
 */
const readAddressed = (scan: Cursor): unknown => {
  const from = scan.at
  const found = takePattern(scan, A_LABEL) as string
  const label = Number(found.slice(1))
  const afterTheNumber = scan.at

  skipSpace(scan)
  if (take(scan, '=')) return readTerm(scan, label)

  scan.at = afterTheNumber
  if (!scan.shared.has(label)) {
    scan.at = from

    return fail(scan, `#${label} is referred to before it is defined`)
  }

  return scan.shared.get(label)
}

const readValue = (scan: Cursor): unknown => {
  skipSpace(scan)

  return A_LABEL.test(scan.text.slice(scan.at)) ? readAddressed(scan) : readTerm(scan, undefined)
}

/** What `text` spells, or a refusal saying where the reading stopped and what it expected. */
export const read = (text: string): unknown => {
  const scan: Cursor = { text, at: 0, shared: new Map() }
  const value = readValue(scan)
  skipSpace(scan)

  if (scan.at < text.length) fail(scan, 'there is more text after the value ends')

  return value
}
