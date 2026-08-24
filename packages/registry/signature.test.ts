import { describe, it, expect } from 'vitest'

import type { ParameterRecord } from './contract-record.js'
import { UnreadableSignature, parametersOf } from './signature.js'
import { serialiseContract, REPOSITORY_ROOT } from './serialise.js'
import { eachContract } from './the-catalogue.js'

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
    expect(parametersOf('(input: string) => number | null')).toEqual([{ name: 'input', type: 'string' }])
    expect(parametersOf('(a: string, b: string) => number')).toEqual([{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }])
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
      { name: 'items', type: 'readonly T[]' },
      { name: 'keyOf', type: '(item: T) => K' },
    ])
  })

  /**
   * `Map<K, V>` as a parameter's type carries a comma that separates nothing, and a reader that split
   * on it would name half a type as a parameter.
   */
  it('a-comma-inside-a-generic-type-separates-no-parameter', () => {
    expect(parametersOf('(held: Map<string, number>, at: number) => void')).toEqual([{ name: 'held', type: 'Map<string, number>' }, { name: 'at', type: 'number' }])
  })

  /**
   * The inner parameters of a function-typed parameter are not the outer call's, and `keyOf` is the
   * one instance of it in the catalogue.
   */
  it('the-parameters-of-a-parameter-are-not-parameters', () => {
    expect(parametersOf('(keyOf: (item: string, index: number) => string) => void')).toEqual([{ name: 'keyOf', type: '(item: string, index: number) => string' }])
  })

  /** `array/group-by@1` writes its signature over four lines and closes it with a trailing comma. */
  it('a-trailing-comma-leaves-no-parameter-behind-it', () => {
    expect(
      parametersOf(`<T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
) => Map<K, T[]>`),
    ).toEqual([
      { name: 'items', type: 'readonly T[]' },
      { name: 'keyOf', type: '(item: T, index: number) => K' },
    ])
  })

  /**
   * Neither mark is written by any of the five. They are read anyway because what a page needs is the
   * name a caller writes, and `...rest` and `x?` are that name carrying a mark about arity.
   */
  it('an-optional-or-rest-parameter-is-named-without-its-mark', () => {
    expect(parametersOf('(first: string, second?: number, ...rest: string[]) => void')).toEqual([
      { name: 'first', type: 'string' },
      { name: 'second', type: 'number' },
      { name: 'rest', type: 'string[]' },
    ])
  })

  /**
   * A function type inside a *type parameter* is the shape that would close the type parameter list
   * early, because `=>` ends in the character that closes it.
   */
  it('an-arrow-inside-a-type-parameter-does-not-close-it', () => {
    expect(parametersOf('<T extends () => void>(run: T) => void')).toEqual([{ name: 'run', type: 'T' }])
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
   * Every contract of the catalogue, read rather than transcribed - and the expectation transcribed
   * rather than read, which is what makes this a comparison instead of a tautology.
   *
   * **A contract with no row here does not pass, it reddens**, `expected[name]` being `undefined`
   * against a list of parameters, so the transcription cannot be left behind by a publication.
   */
  it.each(eachContract)('the-call-of-%s-is-read-from-its-own-signature', (name, source) => {
    const expected: Readonly<Record<string, readonly ParameterRecord[]>> = {
      'number-parse': [{ name: 'input', type: 'string' }],
      'date-add': [{ name: 'date', type: 'Date' }, { name: 'duration', type: 'Duration' }],
      'array-group-by': [
        { name: 'items', type: 'readonly T[]' },
        { name: 'keyOf', type: '(item: T, index: number) => K' },
      ],
      'string-levenshtein': [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }],
      'string-slugify': [{ name: 'text', type: 'string' }],
      'number-round': [{ name: 'value', type: 'number' }, { name: 'places', type: 'number' }],
      'object-deep-equal': [{ name: 'left', type: 'unknown' }, { name: 'right', type: 'unknown' }],
    }

    const record = serialiseContract(REPOSITORY_ROOT, source)
    const answer = record.surface.exports.find((entry) => entry.role === 'the-answer')

    expect(answer?.parameters).toEqual(expected[name])
  })
})
