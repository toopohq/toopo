/**
 * The one byte string a value has, and the digest taken over it.
 *
 * Immutability is a claim, and a claim about bytes is worth exactly what the rule that produces those
 * bytes is worth. `the same content produces the same digest, on any machine` is the whole of what
 * this file exists to make true - so every way two computations of one content could disagree is
 * either closed here or refused here, and nothing is left to a default.
 *
 * Three of those ways were measured in this repository rather than imagined.
 *
 * **Line endings.** `core.autocrlf` is true here and there is no `.gitattributes`, so a checked-out
 * source carries CRLF while the committed content carries LF. Measured on
 * `contracts/typescript/string/slugify/contract.ts`: the working tree is 25 115 bytes and hashes to
 * `bfcc6145...`, the committed content is 24 641 bytes and hashes to `3c448a88...`. Same commit, two
 * digests, and the one a machine produces depends on its git configuration rather than on the
 * contract. Audited over all 82 tracked blobs: no BOM, no lone carriage return, no CRLF in any
 * committed blob - so normalising to LF here restores the committed bytes exactly and loses nothing.
 *
 * **Key order.** `JSON.stringify` writes a record in insertion order, except that integer-like keys
 * come first in numeric order: measured, `{'10':1,'2':2,'b':3,'a':4}` serialises as
 * `{"2":2,"10":1,"b":3,"a":4}`. Two constructions of one record would therefore hash differently, so
 * keys are sorted here.
 *
 * **Unicode.** `'é'` and `'é'` are two strings and hash differently. Fourteen tracked files
 * carry non-ASCII content and six of them are contracts. Nothing here normalises, and that is a
 * decision rather than an omission: `string/slugify@1` settles cases *on* the difference between a
 * composed and a decomposed spelling, so normalising a record would change what a contract says. The
 * bytes are hashed as the contract declares them.
 *
 * The shape of the canonical form is RFC 8785's - keys sorted by UTF-16 code unit, no whitespace,
 * ECMAScript number rendering - and it is followed rather than invented because a reader who wants to
 * recompute a digest in another language needs a specification to point at, not a description of this
 * file. What RFC 8785 leaves hard is the number rendering and the string escaping, and both are
 * `JSON.stringify`'s own: `Number::toString` is fixed by ECMA-262 and identical in every engine, and
 * well-formed `JSON.stringify` has escaped lone surrogates since ES2019.
 *
 * What is *not* followed from RFC 8785 is its silence about values JSON cannot hold. It has none to be
 * silent about; this schema does, and `JSON.stringify` answers `0` for a negative zero, `null` for a
 * NaN, and nothing at all for an `undefined` field. Every one of those is a silent loss inside a
 * digest, which is the failure this file is least likely to be suspected of, so each is refused by
 * name. The declared half of a contract never reaches here as a raw value anyway - `value.ts` has
 * already encoded it - and that is exactly why a refusal costs nothing and catches a schema field
 * somebody added without thinking about it.
 */

import { createHash } from 'node:crypto'

/** What a digest looks like everywhere in the registry: sha-256, lower-case hex, no prefix. */
export const DIGEST = /^[0-9a-f]{64}$/

export class UncanonicalValue extends Error {
  constructor(path: string, nature: string) {
    super(
      `${path} holds ${nature}, which has no canonical form. JSON would answer something else for ` +
        `it - a zero for a negative zero, a null for a NaN, nothing at all for an undefined field - ` +
        `and a digest taken over that would be a digest of a value the registry does not hold.`,
    )
    this.name = 'UncanonicalValue'
  }
}

/**
 * Sorted by UTF-16 code unit, which is what RFC 8785 requires and what `sort` with no comparator
 * already does.
 *
 * Written with the empty comparator rather than with `localeCompare`, and the difference is the whole
 * point: `sort()` compares code units and is fixed by the specification, `localeCompare` consults the
 * environment's collation and would make a digest depend on the machine's locale. The default reads
 * like the careless choice and is the correct one here, so it says so.
 */
const sortedKeys = (record: Readonly<Record<string, unknown>>): readonly string[] =>
  Object.keys(record).sort()

const canonicalNumber = (value: number, path: string): string => {
  if (Number.isNaN(value)) throw new UncanonicalValue(path, 'a NaN')
  if (!Number.isFinite(value)) throw new UncanonicalValue(path, 'an infinity')
  if (Object.is(value, -0)) throw new UncanonicalValue(path, 'a negative zero')

  return JSON.stringify(value)
}

const canonicalAt = (value: unknown, path: string): string => {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number') return canonicalNumber(value, path)

  if (typeof value === 'undefined') throw new UncanonicalValue(path, 'an undefined')
  if (typeof value === 'function') throw new UncanonicalValue(path, 'a function')
  if (typeof value === 'symbol') throw new UncanonicalValue(path, 'a symbol')
  if (typeof value === 'bigint') throw new UncanonicalValue(path, 'a bigint')

  if (Array.isArray(value)) {
    // Index by index rather than with `map`, so that a hole is refused instead of becoming a null.
    const entries = Array.from({ length: value.length }, (_, at) => {
      if (!(at in value)) throw new UncanonicalValue(`${path}[${at}]`, 'a hole in an array')

      return canonicalAt(value[at], `${path}[${at}]`)
    })

    return `[${entries.join(',')}]`
  }

  const record = value as Readonly<Record<string, unknown>>

  return `{${sortedKeys(record)
    .map((key) => `${JSON.stringify(key)}:${canonicalAt(record[key], `${path}.${key}`)}`)
    .join(',')}}`
}

/**
 * The canonical text of a value, and the only text a digest is ever taken over.
 *
 * It returns a string rather than writing a digest directly because the text is what a reader has to
 * be able to reproduce in another language to check us, and a function that only ever answered a
 * digest would leave them nothing to compare against but a hash.
 */
export const canonical = (value: unknown, path: string): string => canonicalAt(value, path)

export const digestOf = (value: unknown, path: string): string =>
  createHash('sha256').update(canonical(value, path), 'utf8').digest('hex')

/**
 * The bytes the registry serves for a source file, and hashes.
 *
 * A checkout is not a source of truth about bytes: it carries whatever the reader's git configuration
 * asked for. So the served form is stated here - UTF-8, LF, no byte-order mark - and it is what the
 * digest, the byte count and the installed file all refer to. There is one form, and everything
 * downstream means that one.
 *
 * **What this imposes on the CLI, written here so that unit does not rediscover it.** The registry
 * serves LF. A user whose git rewrites checkouts to CRLF would see every installed file differ from
 * the digest their lockfile holds, and `locallyModified` would be true for a whole platform without
 * anybody having touched anything. The comparison the CLI makes must therefore be over these
 * normalised bytes and not over the bytes on disk - a lockfile that lies about an entire operating
 * system is worse than no lockfile, and the user's git configuration is the user's business.
 */
export const servedBytes = (contents: Buffer): Buffer => {
  const text = contents.toString('utf8')
  const withoutMark = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

  return Buffer.from(withoutMark.replace(/\r\n/g, '\n'), 'utf8')
}

export const digestOfBytes = (bytes: Buffer): string =>
  createHash('sha256').update(bytes).digest('hex')
