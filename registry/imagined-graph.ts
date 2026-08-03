/**
 * A dependency graph the catalogue cannot produce, over sources that really import one another.
 *
 * **None of these four contracts exists, and none of these bodies is an implementation of anything.**
 * They are addresses and digests over real bytes, shaped like a graph a registry will one day hold.
 * Nothing about rounding, padding, clamping or signs is claimed here, and no part of this file should
 * ever be copied into a contract folder. It lives under `registry/` for the reason the instrument's
 * fixture lives under `mutation/`: `contracts/` is the catalogue and nothing else.
 *
 * ---------------------------------------------------------------------------
 * Why the graph has this shape, and why the first shape was wrong
 * ---------------------------------------------------------------------------
 *
 *     round -> clamp, sign
 *     clamp -> pad
 *     sign  -> pad
 *
 * It was first written as `round -> pad, clamp, sign` with `clamp -> pad`, and measured: an
 * implementation that pushed each dependency *before* walking into it - a pre-order walk, which writes
 * a dependent before what it imports - produced the identical order and the guard stayed green. `pad`
 * was a direct edge of `round` and the first one, so it came out first either way, and the ordering
 * claim was untestable against the only mutant that can violate it.
 *
 * So `pad` is reached only through its two dependents. Three implementations are reachable, the depth
 * is two, and the two walks disagree - which is what makes the order an assertion rather than a
 * coincidence.
 *
 * ---------------------------------------------------------------------------
 * Why the sources import, which they did not before
 * ---------------------------------------------------------------------------
 *
 * The bodies used to be `export const pad = 1`. That was enough to establish what the schema needed -
 * an order, a dedup, a refusal - because the schema never looks inside a file. It is not enough for
 * `toopo add`, whose hardest half is exactly the inside: an import naming a file the installer moved
 * has to be pointed at where the file went, and a fixture with no import cannot show that happening.
 *
 * Two edges are here for two different reasons and both are load-bearing.
 *
 * `digits.ts` is carried by `pad` **and** by `clamp`, byte for byte, so its digest is the same in both
 * - which is the only thing that makes it recognisable as one file, since its path is the same in two
 * folders and would be equally the same if the two files differed. It is the shape the installer
 * deduplicates on.
 *
 * `../../string/pad/reference.js` is written by `clamp` and by `sign`, which is how a published feature
 * names another one: relative to the folder every contract of the catalogue sits in. What the installer
 * does to that specifier is the measurement `cli/` exists to make.
 */

import type { ContractAddress, ImplementationAddress } from './address.js'
import { digestOfBytes, servedBytes } from './canonical.js'
import type { HarnessFile, ImplementationRecord } from './implementation-record.js'

const addressOf = (name: string): ContractAddress => ({ language: 'typescript', name, major: 1 })

export const PAD = addressOf('string/pad')
export const CLAMP = addressOf('number/clamp')
export const SIGN = addressOf('number/sign')
export const ROUND = addressOf('number/round')

/**
 * The version every implementation of this graph is published at.
 *
 * A published version, unlike the five: the walk refuses an unpublished edge by construction, so a
 * graph written with `null` versions could not be walked at all. That refusal is exercised by a record
 * built from these on purpose, rather than by leaving the whole fixture unable to resolve.
 */
export const IMAGINED_VERSION = '1.0.0'

export const referenceAt = (
  contract: ContractAddress,
  version: string = IMAGINED_VERSION,
): ImplementationAddress => ({ contract, id: 'reference', version })

const DIGITS_SOURCE = 'export const DIGITS = /^[0-9]+$/\n'

/**
 * The source of `number/round@1`'s reference, which the imagined contract record hashes as its own
 * harness file. One text, so that the contract and the implementation of it do not describe two
 * different files under one name.
 */
export const ROUND_SOURCE = `import { clamp } from '../../number/clamp/reference.js'
import { sign } from '../../number/sign/reference.js'

export const round = (value: number, places: number): number | null =>
  Number.isFinite(value) ? sign(value) * clamp(Math.abs(value), 0, places) : null
`

/**
 * Every file of the graph, keyed by the path it occupies in the catalogue's own tree - `domain/name`
 * then the file, which is what a contract folder is under `contracts/`.
 *
 * Keyed by that path rather than by a digest, because two of these entries hold one digest and a map
 * from digests would silently lose one of them - which is the very collapse the installer has to
 * perform deliberately rather than inherit from a data structure.
 */
export const IMAGINED_SOURCES: Readonly<Record<string, string>> = {
  'string/pad/digits.ts': DIGITS_SOURCE,
  'string/pad/reference.ts': `import { DIGITS } from './digits.js'

export const pad = (text: string, width: number): string =>
  DIGITS.test(text) ? text.padStart(width, '0') : text
`,

  'number/clamp/digits.ts': DIGITS_SOURCE,
  'number/clamp/reference.ts': `import { DIGITS } from './digits.js'
import { pad } from '../../string/pad/reference.js'

export const clamp = (value: number, low: number, high: number): number =>
  DIGITS.test(pad(String(value), 1)) ? Math.min(Math.max(value, low), high) : low
`,

  'number/sign/reference.ts': `import { pad } from '../../string/pad/reference.js'

export const sign = (value: number): number =>
  pad(String(value), 1).startsWith('-') ? -1 : 1
`,

  'number/round/reference.ts': ROUND_SOURCE,
}

const bytesOf = (path: string): Buffer => {
  const source = IMAGINED_SOURCES[path]
  if (source === undefined) throw new Error(`the imagined graph holds no ${path}`)

  return servedBytes(Buffer.from(source, 'utf8'))
}

/**
 * A file as the registry would serve it, addressed as a record addresses one: by its name inside the
 * contract folder, and never by the path it occupies in the tree above.
 */
const fileOf = (path: string): HarnessFile => {
  const bytes = bytesOf(path)

  return { path: path.slice(path.lastIndexOf('/') + 1), sha256: digestOfBytes(bytes), bytes: bytes.byteLength }
}

const implementationOf = (
  contract: ContractAddress,
  files: readonly string[],
  dependsOn: readonly ImplementationAddress[],
): ImplementationRecord => ({
  id: 'reference',
  contract,
  author: 'toopo',
  version: IMAGINED_VERSION,
  status: 'default',
  files: files.map(fileOf),
  dependsOn,
  minifiedBytes: null,
  benchmarks: [],
  tags: ['reference'],
})

export const pad = implementationOf(PAD, ['string/pad/reference.ts', 'string/pad/digits.ts'], [])

export const sign = implementationOf(SIGN, ['number/sign/reference.ts'], [referenceAt(PAD)])

export const clamp = implementationOf(
  CLAMP,
  ['number/clamp/reference.ts', 'number/clamp/digits.ts'],
  [referenceAt(PAD)],
)

export const round = implementationOf(ROUND, ['number/round/reference.ts'], [
  referenceAt(CLAMP),
  referenceAt(SIGN),
])

export const HOLDINGS: readonly ImplementationRecord[] = [pad, sign, clamp, round]

/**
 * The bytes behind every digest of the graph, which is what a source of this catalogue has to serve
 * and what the records themselves never carry.
 *
 * Five entries for six files: `digits.ts` is one blob under two paths, and that collapse happening
 * here is the fixture stating the fact rather than the installer being told it.
 */
export const IMAGINED_BLOBS: ReadonlyMap<string, Buffer> = new Map(
  Object.keys(IMAGINED_SOURCES).map((path) => [digestOfBytes(bytesOf(path)), bytesOf(path)]),
)
