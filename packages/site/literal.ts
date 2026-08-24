/**
 * An encoded value, written as the literal a reader recognises.
 *
 * ---------------------------------------------------------------------------
 * What the registry hands over, and why nothing rendered it until now
 * ---------------------------------------------------------------------------
 *
 * `packages/registry/value.ts` encodes the declarative half of a contract so that nothing is lost on the way to
 * JSON: a negative zero, a NaN, a hole in an array, a lone surrogate, a symbol, two fields that hold
 * the *same* object. It was written for a reader who would decode it. This is the first consumer that
 * has to *show* it, and showing is not decoding: `decode` gives back a value whose `String()` is `0`
 * where the contract settled `-0`.
 *
 * So every arm of that union is written out here rather than routed through `decode`, and the two
 * arms with no JavaScript spelling at all - a hole, and a function the registry serves as a file -
 * are named in words instead of being dropped.
 *
 * ---------------------------------------------------------------------------
 * The escaping, which is the difference between documentation and a lie
 * ---------------------------------------------------------------------------
 *
 * `contracts/typescript/number/parse/edge-cases.ts` says it in as many words: `'1 000'` written with a no-break
 * space and `'1 000'` written with an ordinary one *are the same eight glyphs on screen* and carry
 * opposite answers in that table. A page that printed both as they are would publish two cases a
 * reader cannot tell apart, one of which says the input parses and the other that it does not - which
 * is worse than publishing neither.
 *
 * Measured over the five: **36 of 438 string values** carry a character that is invisible on its own or
 * that renders on top of the one before it. So what is escaped is exactly that class - control
 * characters, format characters, every space separator that is not U+0020, lone surrogates and every
 * combining mark - and nothing else. Cyrillic, Arabic, emoji, `é` and `€` are printed as themselves,
 * because they are visible and because `string/slugify@1`'s table is *about* them.
 */

import type { EncodedField, EncodedValue, JsonPrimitive } from '../registry/value.js'

/**
 * A character that carries meaning and shows nothing, or shows on top of its neighbour.
 *
 * `\p{M}` rather than `\p{Mn}`: a spacing or enclosing mark is as unreadable on its own as a
 * non-spacing one, and drawing the line inside the marks would be a distinction with no reason behind
 * it.
 *
 * The second alternative is *a space separator that is not the ordinary space*, which a quoted literal
 * already shows: `[^\P{Zs} ]` is the double negation that expresses it under the `u` flag. The `v`
 * flag would write it as a set subtraction and read better, and it is not used because it needs an
 * ES2024 target - this repository compiles to ES2022 for the sake of the contracts, and a rendering
 * detail does not get to move the matrix a whole catalogue is written against.
 */
const INVISIBLE = /[\p{Cc}\p{Cf}\p{Cs}\p{M}\p{Zl}\p{Zp}]|[^\P{Zs} ]/gu

const SHORT: Readonly<Record<string, string>> = {
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
}

/**
 * The braced form above the basic plane, and it is a repair rather than a flourish.
 *
 * `\uXXXX` carries four hexadecimal digits and no more, so a code point above `FFFF` written that way
 * runs into whatever follows it: `ᴖ5` is `ᴖ` and then a `5`, which is a *different string*
 * and one JavaScript reads without complaining. The class is reachable rather than theoretical - every
 * tag character of a regional flag is `Cf` and sits at `E0020`-`E007F`, and `\p{M}` holds the combining
 * marks of the musical notation block - so a slug contract publishing a flag would have printed a
 * literal that spells something else.
 *
 * A lone surrogate is unaffected and stays four digits: `codePointAt` on one answers the surrogate
 * itself, which is below the plane by construction.
 */
export const escaped = (character: string): string => {
  const short = SHORT[character]
  if (short !== undefined) return short

  const code = character.codePointAt(0) as number
  const hexadecimal = code.toString(16).toUpperCase()

  return code > 0xffff ? `\\u{${hexadecimal}}` : `\\u${hexadecimal.padStart(4, '0')}`
}

/** A string as a caller would write it, with everything unreadable made readable. */
export const quoted = (value: string): string =>
  `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replace(INVISIBLE, escaped)}'`

/**
 * A property name written bare when it can be, and quoted when it cannot.
 *
 * `array/group-by@1` settles what happens to a key called `__proto__`, which is a name a reader has to
 * see exactly as it is.
 */
const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/

const key = (name: string): string => (IDENTIFIER.test(name) ? name : quoted(name))

const primitive = (value: JsonPrimitive): string =>
  typeof value === 'string' ? quoted(value) : String(value)

const LITERALS: Readonly<Record<string, string>> = {
  'negative-zero': '-0',
  nan: 'NaN',
  infinity: 'Infinity',
  'negative-infinity': '-Infinity',
}

/**
 * The label a shared object carries, so that *the same object* stays readable as such.
 *
 * `array/group-by@1` pins that the element in a group is the very object that was in the input - an
 * implementation that clones its input is not conformant - and nine of its cases say so. Printing the
 * object twice would publish a claim about equality where the contract makes one about identity.
 */
const shared = (label: number | undefined, rendered: string): string =>
  label === undefined ? rendered : `#${label} = ${rendered}`

/** The constructor a boxed primitive is written with, for the three that have one. */
const BOXES: Readonly<Record<'string' | 'number' | 'boolean', string>> = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
}

const record = (fields: readonly EncodedField[]): string =>
  fields.length === 0
    ? '{}'
    : `{ ${fields.map((field) => `${key(field.name)}: ${literal(field.value)}`).join(', ')} }`

/**
 * The two arms of an encoded value that have no JavaScript spelling, and the words printed instead.
 *
 * **One statement rather than two, because `read-literal.ts` has to refuse exactly these.** What this
 * file prints and what the reader turns down are the same fact, and a second copy of either word would
 * drift the day one of them is reworded - after which the reader would quietly build a value where the
 * page shows a word, which is the one outcome both sides exist to prevent.
 */
export const WITHOUT_A_SPELLING: Readonly<
  Record<'hole' | 'not-data' | 'opaque' | 'instance', string>
> = {
  hole: '<hole>',
  'not-data': '<a function, served as a file>',
  /**
   * A promise, a WeakMap, a WeakSet or a WeakRef. There is no expression that builds one carrying
   * particular contents, because nothing about their contents is readable in the first place - which
   * is the reason `object/deep-equal@1` answers `false` for two of them rather than comparing.
   */
  opaque: '<a value whose contents cannot be read>',
  /**
   * An instance of a class. The class is not in the record and cannot be, so no expression here would
   * build the value a contract settled a case about - and a spelling that looked like one would be a
   * lie a reader could paste.
   */
  instance: '<an instance of a class>',
}

/** `Object.assign(x, { … })`, which is how a value carrying own properties beside a slot is spelled. */
const withFields = (built: string, fields: readonly EncodedField[]): string =>
  fields.length === 0 ? built : `Object.assign(${built}, ${record(fields)})`

export const literal = (value: EncodedValue): string => {
  switch (value.kind) {
    case 'primitive':
      return primitive(value.value)
    case 'number':
      return LITERALS[value.literal] as string
    case 'undefined':
      return 'undefined'
    case 'symbol':
      return value.description === null ? 'Symbol()' : `Symbol(${quoted(value.description)})`
    case 'pattern':
      return `/${value.source}/${value.flags}`
    case 'not-data':
      return WITHOUT_A_SPELLING['not-data']
    case 'hole':
      return WITHOUT_A_SPELLING.hole
    case 'again':
      return `#${value.shared}`
    case 'opaque':
      return WITHOUT_A_SPELLING.opaque
    case 'instance':
      return WITHOUT_A_SPELLING.instance
    case 'big-integer':
      return `${value.digits}n`
    case 'list':
      return shared(value.shared, `[${value.entries.map(literal).join(', ')}]`)
    case 'set':
      return shared(value.shared, `new Set([${value.entries.map(literal).join(', ')}])`)
    case 'instant':
      return shared(value.shared, `new Date(${literal(value.epoch)})`)
    case 'map':
      return shared(
        value.shared,
        `new Map([${value.entries
          .map((entry) => `[${literal(entry.key)}, ${literal(entry.value)}]`)
          .join(', ')}])`,
      )
    case 'typed-array':
      return shared(value.shared, `new ${value.of}([${value.elements.map(literal).join(', ')}])`)
    case 'error':
      return shared(
        value.shared,
        withFields(
          value.cause === undefined
            ? `new ${value.errorKind}(${quoted(value.message)})`
            : `new ${value.errorKind}(${quoted(value.message)}, { cause: ${literal(value.cause)} })`,
          value.fields,
        ),
      )
    case 'boxed':
      // `new BigInt(…)` and `new Symbol(…)` are not expressions the language has, so those two are
      // spelled the way a caller really writes them.
      return shared(
        value.shared,
        withFields(
          value.of === 'bigint' || value.of === 'symbol'
            ? `Object(${literal(value.value)})`
            : `new ${BOXES[value.of]}(${literal(value.value)})`,
          value.fields,
        ),
      )
    case 'record':
      return shared(
        value.shared,
        value.prototype === 'none'
          ? `Object.assign(Object.create(null), ${record(value.fields)})`
          : record(value.fields),
      )
  }
}
