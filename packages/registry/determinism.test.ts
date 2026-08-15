import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { describe, it, expect } from 'vitest'

import { UncanonicalValue, canonical, digestOfBytes, servedBytes } from './canonical.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { theFive } from './the-five.js'

/**
 * The same content produces the same digest, on any machine.
 *
 * Every guard below is written against a way two computations of one content were measured to
 * disagree, or could. None of them asserts that a digest equals a constant: a digest pinned in a test
 * is a test that reddens on any change and says nothing about determinism, and the question here is
 * whether two computations agree rather than what the answer happens to be.
 */

describe('the canonical form', () => {
  /**
   * The hazard is measured in the first assertion and the fix in the second, so a reader sees why
   * this guard exists without leaving the file - and so that replacing `canonical` with
   * `JSON.stringify` reddens here rather than somewhere far away.
   */
  it('key-order-does-not-depend-on-construction', () => {
    const built = { b: 1, a: { d: 2, c: 3 } }
    const rebuilt = { a: { c: 3, d: 2 }, b: 1 }

    expect(JSON.stringify(built)).not.toBe(JSON.stringify(rebuilt))
    expect(canonical(built, 'probe')).toBe(canonical(rebuilt, 'probe'))
  })

  /**
   * The one ordering JavaScript imposes whatever the author wrote: an integer-like key comes first,
   * in numeric order. Nothing in the five reaches it today, and `round-trip.test.ts` already probes
   * the shape - so it is closed here rather than left for the contract that meets it.
   */
  it('integer-like-keys-are-sorted-with-every-other-key', () => {
    const record: Record<string, number> = {}
    record['10'] = 1
    record['2'] = 2
    record['b'] = 3

    expect(JSON.stringify(record)).toBe('{"2":2,"10":1,"b":3}')
    expect(canonical(record, 'probe')).toBe('{"10":1,"2":2,"b":3}')
  })

  it('an-array-keeps-its-order :: order is the value, not a rendering of it', () => {
    expect(canonical([3, 1, 2], 'probe')).toBe('[3,1,2]')
  })

  /**
   * The encoded half of a record is a list of `EncodedField`, and its order is semantic - a contract
   * settles cases on it and `round-trip.test.ts` compares the key sequence. Sorting the keys of a
   * schema object while leaving that list alone is the distinction this guard pins.
   */
  it('an-encoded-field-list-is-not-reordered', () => {
    const encoded = { kind: 'record', fields: [{ name: 'b' }, { name: 'a' }] }

    expect(canonical(encoded, 'probe')).toBe('{"fields":[{"name":"b"},{"name":"a"}],"kind":"record"}')
  })

  /**
   * The canonical form is injective, and the separators are what make it so.
   *
   * Without them `{ a: 1, b: 2 }` and `{ a1b: 2 }` are both `a1b2`, and two different records share a
   * digest - which is the collision a hash is supposed to make hard and this would make free. It is
   * closed by building real JSON rather than by concatenating, so this guard pins the property rather
   * than the mechanism.
   */
  it('two-different-values-do-not-share-a-canonical-form', () => {
    expect(canonical({ a: 1, b: 2 }, 'probe')).not.toBe(canonical({ a1b: 2 }, 'probe'))
  })

  /**
   * Every value JSON would answer something else for. Each one is a silent loss inside a digest,
   * which is the failure this file is least likely to be suspected of, so each is refused by name.
   */
  it.each([
    ['negative-zero', 'a negative zero', -0],
    ['nan', 'a NaN', Number.NaN],
    ['infinity', 'an infinity', Number.POSITIVE_INFINITY],
    ['negative-infinity', 'a negative infinity', Number.NEGATIVE_INFINITY],
    ['undefined', 'an undefined', undefined],
    ['a-function', 'a function', () => 1],
    ['a-symbol', 'a symbol', Symbol('probe')],
    ['a-bigint', 'a bigint', 1n],
    ['a-hole', 'a hole in an array', [1, , 3]],
    ['an-undefined-field', 'an undefined field', { present: 1, absent: undefined }],
  ])('a-value-json-would-lose-is-refused-%s :: %s', (_slug, _what, value) => {
    expect(() => canonical(value, 'probe')).toThrow(UncanonicalValue)
  })

  /**
   * Deliberately not normalised, and this is the guard that says so.
   *
   * `string/slugify@1` settles cases on the difference between a composed and a decomposed spelling,
   * so a canonicaliser that folded them would change what a contract says on its way into a digest.
   * Six of the fourteen tracked files carrying non-ASCII content are contracts.
   */
  it('unicode-is-not-normalised :: two spellings are two values', () => {
    const composed = 'é'
    const decomposed = 'é'

    expect(composed.normalize('NFC')).toBe(decomposed.normalize('NFC'))
    expect(canonical(composed, 'probe')).not.toBe(canonical(decomposed, 'probe'))
  })
})

describe('the bytes the registry serves', () => {
  it('a-crlf-source-is-served-as-its-lf-form', () => {
    expect(servedBytes(Buffer.from('a\r\nb\r\n', 'utf8')).toString('utf8')).toBe('a\nb\n')
  })

  it('a-byte-order-mark-is-not-content', () => {
    expect(servedBytes(Buffer.from('﻿const a = 1\n', 'utf8')).toString('utf8')).toBe(
      'const a = 1\n',
    )
  })

  it('normalising-changes-the-digest :: so the rule is load-bearing rather than cosmetic', () => {
    const crlf = Buffer.from('a\r\nb\n', 'utf8')

    expect(digestOfBytes(crlf)).not.toBe(digestOfBytes(servedBytes(crlf)))
  })

  /**
   * The end-to-end claim: what this machine would publish is what the committed content says, whatever
   * the machine's git configuration did to the working tree.
   *
   * Measured before the normalisation existed: `core.autocrlf` is true here, and every one of the 37
   * harness files differed from its blob - `contracts/typescript/string/slugify/contract.ts` was 25 115 bytes
   * hashing to `bfcc6145...` against 24 641 bytes hashing to `3c448a88...`. After it, none differs.
   *
   * **Where this guard has teeth, said out loud.** On a machine whose checkout is already LF - a
   * Linux runner, or this repository once `.gitattributes` has been in place through a fresh clone -
   * removing the normalisation would not redden it, because there would be nothing to normalise. The
   * unit guards above have teeth everywhere and this one has them where the defect actually lives, so
   * both are kept.
   */
  it('the-served-bytes-are-the-committed-bytes', () => {
    const differing = theFive.flatMap((source) =>
      serialiseContract(REPOSITORY_ROOT, source)
        .harness.map((file) => {
          const blob = execFileSync('git', ['show', `HEAD:${source.folder}/${file.path}`], {
            cwd: REPOSITORY_ROOT,
            encoding: 'buffer',
            maxBuffer: 1 << 28,
          })

          return {
            path: `${source.folder}/${file.path}`,
            agrees:
              createHash('sha256').update(blob).digest('hex') === file.sha256 &&
              blob.length === file.bytes,
          }
        })
        .filter((file) => !file.agrees)
        .map((file) => file.path),
    )

    expect(differing).toEqual([])
  })
})
