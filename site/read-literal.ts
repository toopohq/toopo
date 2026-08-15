/**
 * The text somebody typed, as the value it spells - the inverse of `literal`.
 *
 * ---------------------------------------------------------------------------
 * Why `JSON.parse` is not this function
 * ---------------------------------------------------------------------------
 *
 * A playground field holds a literal, and the literals this catalogue publishes are not JSON. Block
 * 4.4 alone settles cases on `{ days: undefined }`, on `-0`, on `Infinity`, on `NaN`, on a lone
 * surrogate, on a hole in a sparse array, on a symbol, on a regular expression, and on two fields
 * holding the *same* object. `JSON.parse` answers a different value for five of those and refuses the
 * rest - which is why `packages/registry/value.ts` exists at all, and this file is that argument arriving from
 * the other direction.
 *
 * ---------------------------------------------------------------------------
 * The two arms it refuses, and why refusing is the whole point
 * ---------------------------------------------------------------------------
 *
 * `literal` prints `<hole>` and `<a function, served as a file>` in words, deliberately, because
 * neither arm has a JavaScript spelling. Whoever meets those words gets a refusal that names them,
 * never a value: a reader answering `undefined` for a hole would build the value `array/group-by@1`
 * settles a case on *not* being, and a reader answering anything at all for a function would put a
 * value where the registry deliberately serves a file. The words are imported from `literal.ts` rather
 * than written again, so the printing and the refusal cannot come apart.
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

const readList = (scan: Cursor, label: number | undefined): readonly unknown[] => {
  const entries: unknown[] = []
  if (label !== undefined) scan.shared.set(label, entries)

  scan.at += 1
  readSequence(scan, ']', () => {
    entries.push(readValue(scan))
  })

  return entries
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
    const name = readFieldName(scan)
    skipSpace(scan)
    if (!take(scan, ':')) fail(scan, `the field \`${name}\` is not followed by a colon`)

    const value = readValue(scan)
    Object.defineProperty(record, name, {
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

/** A symbol, whose description is a string or nothing at all. */
const readSymbol = (scan: Cursor): symbol => {
  skipSpace(scan)
  const description = scan.text[scan.at] === "'" ? readString(scan) : undefined
  skipSpace(scan)
  if (!take(scan, ')')) fail(scan, 'a `Symbol(` has to be closed by a `)`')

  return Symbol(description)
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

  if (label !== undefined) {
    return fail(scan, 'only a list, a set or a record is addressed by a `#n =` label')
  }

  if (character === "'") return readString(scan)
  if (character === '/') return readPattern(scan)
  if (takePattern(scan, A_SYMBOL_OPENS) !== null) return readSymbol(scan)
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
