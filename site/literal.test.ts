import { describe, it, expect } from 'vitest'

import { encode } from '../registry/value.js'
import { literal, quoted } from './literal.js'

/**
 * What the page shows where the registry holds an encoded value.
 *
 * Every case below is a value one of the five actually settles. The ones that matter most are the ones
 * a page would otherwise publish as a lie: two inputs that are the same glyphs on screen and carry
 * opposite answers, and a negative zero printed as a zero.
 */

const shown = (value: unknown): string => literal(encode(value, 'here'))

/**
 * Named rather than pasted, which is the discipline `contracts/number/parse/edge-cases.ts` states and
 * the reason it states it: a no-break space and an ordinary one are the same glyph, so a file holding
 * both as literals leaves a reader unable to tell which line is which and a maintainer free to "fix"
 * one into the other. This file exists to prove the two are printed apart; writing them as characters
 * would have been the same mistake it guards against, and it was written that way once - the edit that
 * replaced them failed to match its own text, which is the failure arriving on the person who caused
 * it.
 */
const NO_BREAK_SPACE = String.fromCharCode(0x00a0)
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff)
const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d)
const COMBINING_ACUTE = String.fromCharCode(0x0301)
const HIGH_SURROGATE = String.fromCharCode(0xd83d)
const WOMAN = String.fromCodePoint(0x1f469)
const COMPUTER = String.fromCodePoint(0x1f4bb)
const PRECOMPOSED_E_ACUTE = String.fromCharCode(0x00e9)

describe('an encoded value, written as the literal a reader recognises', () => {
  it('the-four-numbers-json-cannot-carry-are-written-as-themselves', () => {
    expect([-0, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY].map(shown)).toEqual([
      '-0',
      'NaN',
      'Infinity',
      '-Infinity',
    ])
  })

  /**
   * `number/parse@1`'s own source says it: `1 000` written with a no-break space and `1 000` written
   * with an ordinary one are the same eight glyphs on screen, and its table gives them opposite
   * answers. A page that printed both as they are would publish two cases a reader cannot tell apart,
   * one saying the input parses and the other that it does not.
   */
  it('two-inputs-that-look-alike-are-written-apart', () => {
    expect(shown(`1${NO_BREAK_SPACE}000`)).toBe("'1\\u00A0000'")
    expect(shown('1 000')).toBe("'1 000'")
    expect(shown(`1${NO_BREAK_SPACE}000`)).not.toBe(shown('1 000'))
  })

  it('an-invisible-character-is-written-as-its-code-point', () => {
    expect(shown(`${BYTE_ORDER_MARK}9`)).toBe("'\\uFEFF9'")
    expect(shown('\t\n 7 \r\n')).toBe("'\\t\\n 7 \\r\\n'")
    expect(shown(HIGH_SURROGATE)).toBe("'\\uD83D'")
    expect(shown(`${WOMAN}${ZERO_WIDTH_JOINER}${COMPUTER}`)).toBe(`'${WOMAN}\\u200D${COMPUTER}'`)
  })

  /**
   * A combining mark renders on the character before it, so a decomposed and a precomposed `é` are one
   * glyph each and `string/levenshtein@1` answers 2 between them. The ordinary space is never escaped,
   * because a quoted literal already shows it and escaping it would make every sentence unreadable.
   */
  it('a-combining-mark-is-written-apart-from-its-base', () => {
    expect(shown(`e${COMBINING_ACUTE}`)).toBe("'e\\u0301'")
    expect(shown(PRECOMPOSED_E_ACUTE)).toBe(`'${PRECOMPOSED_E_ACUTE}'`)
    expect(shown(`e${COMBINING_ACUTE}`)).not.toBe(shown(PRECOMPOSED_E_ACUTE))
    expect(shown('Salt & Pepper')).toBe("'Salt & Pepper'")
  })

  /** What is visible stays visible. `string/slugify@1`'s table is about these. */
  it('a-visible-character-is-printed-as-itself', () => {
    const cyrillic = 'Привет'
    const japanese = '日本語'
    const euro = '10€'

    expect([shown(cyrillic), shown(japanese), shown(euro)]).toEqual([
      `'${cyrillic}'`,
      `'${japanese}'`,
      `'${euro}'`,
    ])
  })

  it('a-quote-and-a-backslash-are-escaped-before-anything-else', () => {
    expect(quoted("1'000")).toBe("'1\\'000'")
    expect(quoted('a\\b')).toBe("'a\\\\b'")
  })

  /**
   * A hole is visited and its element is `undefined`, which is what separates iteration from a
   * counting loop - `array/group-by@1` settles it as a case. Printed as JavaScript spells it, two
   * commas in a row, it is a gap nobody sees.
   */
  it('a-hole-is-named-rather-than-left-as-a-gap', () => {
    const sparse = [1, , 3] as unknown[]

    expect(shown(sparse)).toBe('[1, <hole>, 3]')
    expect(shown([1, undefined, 3])).toBe('[1, undefined, 3]')
  })

  /**
   * The registry serves a function as a hashed file and models nothing of it. Printing `undefined`
   * there would say the contract passes nothing; printing nothing would leave a call with a missing
   * argument.
   */
  it('a-function-is-named-as-what-the-registry-does-with-it', () => {
    expect(shown([1, (x: number) => x])).toBe('[1, <a function, served as a file>]')
  })

  /**
   * `array/group-by@1` pins that the element in a group is the *same object* as the element in the
   * input, and nine of its cases say so. Printing the object twice would publish a claim about
   * equality where the contract makes one about identity.
   */
  it('the-same-object-is-shown-as-the-same-object', () => {
    const one = { team: 'green' }

    expect(shown({ items: [one, one] })).toBe("{ items: [#1 = { team: 'green' }, #1] }")
    expect(shown({ items: [{ team: 'green' }, { team: 'green' }] })).toBe(
      "{ items: [{ team: 'green' }, { team: 'green' }] }",
    )
  })

  it('a-symbol-a-pattern-and-a-set-are-written-as-a-caller-writes-them', () => {
    expect(shown(Symbol('red'))).toBe("Symbol('red')")
    expect(shown(Symbol())).toBe('Symbol()')
    expect(shown(/^[a-z0-9-]*$/u)).toBe('/^[a-z0-9-]*$/u')
    expect(shown(new Set([1, 2]))).toBe('new Set([1, 2])')
  })

  /**
   * A key that is not an identifier is quoted, and `__proto__` is the one the catalogue settles: it is
   * a name a reader has to see exactly as it is. It is built with `Object.defineProperty` because an
   * object literal would set the prototype instead of a property, which is the trap the contract is
   * about.
   */
  it('a-key-that-is-not-an-identifier-is-quoted', () => {
    const awkward = { ok: 2 }
    Object.defineProperty(awkward, '__proto__', { value: 1, enumerable: true })

    expect(shown(awkward)).toBe("{ ok: 2, __proto__: 1 }")
    expect(shown({ 'not an identifier': 1 })).toBe("{ 'not an identifier': 1 }")
    expect(shown({ plain: 1 })).toBe('{ plain: 1 }')
  })
})
