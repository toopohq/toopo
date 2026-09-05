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

import type {
  EncodedField,
  EncodedSymbolField,
  EncodedValue,
  JsonPrimitive,
} from '../registry/value.js'
import { kindsIn } from '../registry/value.js'

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

/**
 * A property whose key is a symbol, in the computed-key notation the language has for it.
 *
 * The key is a value like any other, so it carries its own label: `[#1 = Symbol('shared')]` the first
 * time and `[#1]` after. **That is the whole point of the notation here** - two objects keyed by one
 * symbol and two objects keyed by two symbols of the same description are a different value, and this
 * catalogue settles a case on the difference.
 */
const symbolField = (field: EncodedSymbolField): string =>
  `[${literal(field.key)}]: ${literal(field.value)}`

const record = (
  fields: readonly EncodedField[],
  symbolFields: readonly EncodedSymbolField[] = [],
): string => {
  const written = [
    ...fields.map((field) => `${key(field.name)}: ${literal(field.value)}`),
    ...symbolFields.map(symbolField),
  ]

  return written.length === 0 ? '{}' : `{ ${written.join(', ')} }`
}

/**
 * The three arms of an encoded value that have no JavaScript spelling, and what a page prints where
 * one stands - each entry being what that phrase **opens with**.
 *
 * **One statement rather than two, because `read-literal.ts` has to refuse exactly these.** What this
 * file prints and what the reader turns down are the same fact, and a second copy of either word would
 * drift the day one of them is reworded - after which the reader would quietly build a value where the
 * page shows a word, which is the one outcome both sides exist to prevent.
 *
 * **An opening rather than the whole phrase, because one of the three goes on to say something.** The
 * reader matches what a phrase begins with, so an arm that carries content a reader needs - which
 * `instance` does, the record holding a class name and the fields under it - is printed and refused by
 * the same declaration as the two that have nothing further to add. This entry read
 * `<an instance of a class>` and threw that content away; ADR-0164 is why it no longer does, and the
 * sentence above it said *two* arms while this record held three.
 */
export const WITHOUT_A_SPELLING: Readonly<Record<'not-data' | 'opaque' | 'instance', string>> = {
  'not-data': '<a function, served as a file>',
  /**
   * A promise, a WeakMap, a WeakSet or a WeakRef. There is no expression that builds one carrying
   * particular contents, because nothing about their contents is readable in the first place - which
   * is the reason `object/deep-equal@1` answers `false` for two of them rather than comparing.
   */
  opaque: '<a value whose contents cannot be read>',
  /**
   * An instance of a class, whose name and fields follow. The class is not in the record and cannot
   * be, so no expression here would build the value a contract settled a case about - and a spelling
   * that looked like one would be a lie a reader could paste. The brackets are what say so, which is
   * what lets the phrase carry the content without becoming a spelling.
   */
  instance: '<an instance of ',
}

/**
 * The kinds this file prints a word for instead of a spelling, as a set to test a value against.
 *
 * **Derived from `WITHOUT_A_SPELLING` and never listed again**, which is the same rule the reader
 * follows: what has no spelling is a property of the kind, so a case that cannot be opened in the form
 * is recognised by what it is made of rather than by being named in a list somebody keeps.
 */
const WORDS_INSTEAD: ReadonlySet<EncodedValue['kind']> = new Set(
  Object.keys(WITHOUT_A_SPELLING) as readonly EncodedValue['kind'][],
)

/** Whether every part of a value can be written as JavaScript a reader can edit and this repo can read. */
export const hasASpelling = (value: EncodedValue): boolean =>
  [...kindsIn(value)].every((kind) => !WORDS_INSTEAD.has(kind))

/** `Object.assign(x, { … })`, which is how a value carrying own properties beside a slot is spelled. */
const withFields = (
  built: string,
  fields: readonly EncodedField[],
  symbolFields: readonly EncodedSymbolField[] = [],
): string =>
  fields.length === 0 && symbolFields.length === 0
    ? built
    : `Object.assign(${built}, ${record(fields, symbolFields)})`

export const literal = (value: EncodedValue): string => {
  switch (value.kind) {
    case 'primitive':
      return primitive(value.value)
    case 'number':
      return LITERALS[value.literal] as string
    case 'undefined':
      return 'undefined'
    case 'symbol':
      return shared(
        value.shared,
        value.description === null ? 'Symbol()' : `Symbol(${quoted(value.description)})`,
      )
    case 'pattern':
      return `/${value.source}/${value.flags}`
    case 'not-data':
      return WITHOUT_A_SPELLING['not-data']
    /**
     * **A hole spells as nothing at all, which is the language's own notation for it.** `[, 1]` is a
     * list of two whose first element is absent and `[1, 2, ,]` is a list of three whose last is - so
     * what carries a hole is the comma beside it, and the comma belongs to the list. The list arm adds
     * the closing one, because a trailing comma after a value is a separator and after a hole is the
     * hole itself.
     *
     * It used to print `<hole>`, which is why a hole was among the kinds with no spelling. It has one.
     * ADR-0160.
     */
    case 'hole':
      return ''
    case 'again':
      return `#${value.shared}`
    case 'opaque':
      return WITHOUT_A_SPELLING.opaque
    /**
     * **The record holds the class and the fields under it, and this used to print neither.** What
     * `object/deep-equal@1` settles in two rows is that an instance carrying `{ x: 1 }` is not the
     * plain object `{ x: 1 }` - so a page that dropped the fields rendered the case as
     * `<an instance of a class>` beside `{ x: 1 }`, which is two different things being different and
     * is not the claim. Its neighbour, whose instance holds `x: 2`, was printed in the very same
     * words. The loss was the page's alone: no digest moved to repair it. ADR-0164.
     *
     * The label is carried for the reason every other arm carries one. An instance in two places is
     * one object, `encode` labels it, and the second occurrence renders `#1` - which pointed at
     * nothing while this arm dropped the label. No case does that today; a contract settling identity
     * on an instance is what would, and this catalogue has one that settles identity.
     */
    case 'instance': {
      const holding =
        value.fields.length === 0 && (value.symbolFields ?? []).length === 0
          ? ''
          : `, holding ${record(value.fields, value.symbolFields)}`

      return shared(value.shared, `${WITHOUT_A_SPELLING.instance}${value.className}${holding}>`)
    }
    case 'big-integer':
      return `${value.digits}n`
    case 'list': {
      const closing = value.entries[value.entries.length - 1]?.kind === 'hole' ? ',' : ''

      return shared(value.shared, `[${value.entries.map(literal).join(', ')}${closing}]`)
    }
    case 'set':
      return shared(value.shared, `new Set([${value.entries.map(literal).join(', ')}])`)
    case 'instant':
      return shared(value.shared, `new Date(${literal(value.epoch)})`)
    /**
     * `Temporal.PlainTime.from('12:30:00')`, which is what a reader would type.
     *
     * The type name is the carrier's own tag - the kind ADR-0232 gave `value.ts` carries it - so the
     * spelling is composed rather than listed per carrier. And it is a spelling and not a word because
     * `read-literal.ts` reads this form back wherever the runtime carries the namespace. Where it does
     * not, that reader refuses by naming the carrier and the runtime rather than pretending; a spelling
     * whose reader is honest about what it cannot build is not the lie the brackets exist to refuse.
     * ADR-0232, ADR-0234.
     */
    case 'temporal':
      return shared(value.shared, `${value.typeName}.from(${primitive(value.rendered)})`)
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
          value.symbolFields,
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
          value.symbolFields,
        ),
      )
    case 'record':
      return shared(
        value.shared,
        value.prototype === 'none'
          ? `Object.assign(Object.create(null), ${record(value.fields, value.symbolFields)})`
          : record(value.fields, value.symbolFields),
      )
  }
}
