import { describe, it, expect } from 'vitest'

import { UnreadableSignature, parametersOf } from './signature.js'
import { serialiseContract, REPOSITORY_ROOT } from './serialise.js'
import { eachContract } from './the-five.js'

/**
 * Reading a declared type without a compiler, and the shapes that decide whether it is readable.
 *
 * Every case below except the last two is a shape one of the five actually writes or that a sixth
 * plausibly would. The reader counts brackets rather than recognising syntax, so what it has to get
 * right is where a comma separates a parameter and where it separates something inside one - and the
 * three ways a comma can be inside something are a generic type, a type parameter list, and a function
 * type used as a parameter's type. All three occur in `array/group-by@1`'s one signature.
 */

describe('the call a declared signature declares', () => {
  it('a-plain-signature-names-its-parameters', () => {
    expect(parametersOf('(input: string) => number | null')).toEqual(['input'])
    expect(parametersOf('(a: string, b: string) => number')).toEqual(['a', 'b'])
  })

  it('a-signature-that-takes-nothing-has-no-parameters', () => {
    expect(parametersOf('() => number')).toEqual([])
  })

  /**
   * The type parameter list holds a comma of its own and sits where the parameter list is looked for.
   * `<T, K>` is `array/group-by@1`'s.
   */
  it('the-type-parameters-are-not-the-parameters', () => {
    expect(parametersOf('<T, K>(items: readonly T[], keyOf: (item: T) => K) => Map<K, T[]>')).toEqual([
      'items',
      'keyOf',
    ])
  })

  /**
   * `Map<K, V>` as a parameter's type carries a comma that separates nothing, and a reader that split
   * on it would name half a type as a parameter.
   */
  it('a-comma-inside-a-generic-type-separates-no-parameter', () => {
    expect(parametersOf('(held: Map<string, number>, at: number) => void')).toEqual(['held', 'at'])
  })

  /**
   * The inner parameters of a function-typed parameter are not the outer call's, and `keyOf` is the
   * one instance of it in the catalogue.
   */
  it('the-parameters-of-a-parameter-are-not-parameters', () => {
    expect(parametersOf('(keyOf: (item: string, index: number) => string) => void')).toEqual(['keyOf'])
  })

  /** `array/group-by@1` writes its signature over four lines and closes it with a trailing comma. */
  it('a-trailing-comma-leaves-no-parameter-behind-it', () => {
    expect(
      parametersOf(`<T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
) => Map<K, T[]>`),
    ).toEqual(['items', 'keyOf'])
  })

  /**
   * Neither mark is written by any of the five. They are read anyway because what a page needs is the
   * name a caller writes, and `...rest` and `x?` are that name carrying a mark about arity.
   */
  it('an-optional-or-rest-parameter-is-named-without-its-mark', () => {
    expect(parametersOf('(first: string, second?: number, ...rest: string[]) => void')).toEqual([
      'first',
      'second',
      'rest',
    ])
  })

  /**
   * A function type inside a *type parameter* is the shape that would close the type parameter list
   * early, because `=>` ends in the character that closes it.
   */
  it('an-arrow-inside-a-type-parameter-does-not-close-it', () => {
    expect(parametersOf('<T extends () => void>(run: T) => void')).toEqual(['run'])
  })

  /**
   * Both halves of the refusal, because they are different mistakes: a declaration that is not a
   * function at all, and one this reader cannot follow. Either would otherwise reach a page as a case
   * whose arguments have no names.
   */
  it('a-declaration-this-reader-cannot-follow-is-refused', () => {
    expect(() => parametersOf('{ readonly value: number }')).toThrow(UnreadableSignature)
    expect(() => parametersOf('(value: number => number')).toThrow(UnreadableSignature)
    expect(() => parametersOf('(value) => number')).toThrow(UnreadableSignature)
  })

  /**
   * The five, read rather than transcribed - and the expectation transcribed rather than read, which
   * is what makes this a comparison instead of a tautology.
   */
  it.each(eachContract)('the-call-of-%s-is-read-from-its-own-signature', (name, source) => {
    const expected: Readonly<Record<string, readonly string[]>> = {
      'number-parse': ['input'],
      'date-add': ['date', 'duration'],
      'array-group-by': ['items', 'keyOf'],
      'string-levenshtein': ['a', 'b'],
      'string-slugify': ['text'],
    }

    const record = serialiseContract(REPOSITORY_ROOT, source)
    const answer = record.surface.exports.find((entry) => entry.role === 'the-answer')

    expect(answer?.parameters).toEqual(expected[name])
  })
})
