/**
 * A dependency graph the catalogue cannot produce, over sources that really import one another.
 *
 * **None of these four contracts exists, and none of these bodies is an implementation of anything.**
 * They are addresses and digests over real bytes, shaped like a graph a registry will one day hold.
 * Nothing about rounding, padding, clamping or signs is claimed here, and no part of this file should
 * ever be copied into a contract folder. It lives under `packages/registry/` for the reason the instrument's
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
 * `../../imagined-string/pad/reference.js` is written by `clamp` and by `sign`, which is how a published feature
 * names another one: relative to the folder every contract of the catalogue sits in. What the installer
 * does to that specifier is the measurement `packages/cli/` exists to make.
 */

import type { ContractAddress } from './address.js'
import { digestOfBytes, servedBytes } from './canonical.js'
import type { HarnessFile, ImplementationRecord } from './implementation-record.js'
import { CLAMP, LEFT, PAD, RIGHT, ROUND, SIGN } from './imagined-addresses.js'
import { edgeTo } from './snapshot.js'

/**
 * The version every implementation of this graph is published at.
 *
 * A published version, unlike the five: the walk refuses an unpublished edge by construction, so a
 * graph written with `null` versions could not be walked at all. That refusal is exercised by a record
 * built from these on purpose, rather than by leaving the whole fixture unable to resolve.
 */
export const IMAGINED_VERSION = '1.0.0'

const DIGITS_SOURCE = 'export const DIGITS = /^[0-9]+$/\n'

/** Carried by `imagined-text/left` and by `imagined-text/right`, byte for byte, with no edge between them. */
const TRIM_SOURCE = 'export const TRIM = /\\s/\n'

/**
 * The source of `imagined-number/round@1`'s reference, which the imagined contract record hashes as its own
 * harness file. One text, so that the contract and the implementation of it do not describe two
 * different files under one name.
 */
export const ROUND_SOURCE = `import { clamp } from '../../imagined-number/clamp/reference.js'
import { sign } from '../../imagined-number/sign/reference.js'

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
  'imagined-string/pad/digits.ts': DIGITS_SOURCE,
  'imagined-string/pad/reference.ts': `import { DIGITS } from './digits.js'

export const pad = (text: string, width: number): string =>
  DIGITS.test(text) ? text.padStart(width, '0') : text
`,

  'imagined-number/clamp/digits.ts': DIGITS_SOURCE,
  'imagined-number/clamp/reference.ts': `import { DIGITS } from './digits.js'
import { pad } from '../../imagined-string/pad/reference.js'

export const clamp = (value: number, low: number, high: number): number =>
  DIGITS.test(pad(String(value), 1)) ? Math.min(Math.max(value, low), high) : low
`,

  'imagined-number/sign/reference.ts': `import { pad } from '../../imagined-string/pad/reference.js'

export const sign = (value: number): number =>
  pad(String(value), 1).startsWith('-') ? -1 : 1
`,

  'imagined-number/round/reference.ts': ROUND_SOURCE,

  // Neither names the other. What they share is `trim.ts`, and only its digest says so.
  'imagined-text/left/trim.ts': TRIM_SOURCE,
  'imagined-text/left/reference.ts': `import { TRIM } from './trim.js'

export const left = (text: string): string => (TRIM.test(text) ? text.trimStart() : text)
`,

  'imagined-text/right/trim.ts': TRIM_SOURCE,
  'imagined-text/right/reference.ts': `import { TRIM } from './trim.js'

export const right = (text: string): string => (TRIM.test(text) ? text.trimEnd() : text)
`,
}

/**
 * The version the graph moves to when the registry publishes it a second time.
 *
 * A whole-graph bump rather than one artefact, and that is what a registry actually does: `dependsOn`
 * pins a version, so a feature whose dependency moves is republished against the new one even when not
 * a byte of its own source changed. Two of the four here change their source and two do not, which is
 * the mixture `toopo update` has to be able to tell apart - a version that moved and a file that did.
 */
export const IMAGINED_NEXT_VERSION = '1.0.1'

/**
 * What the second publication changes, and only that.
 *
 * Written as the difference rather than as a second copy of the whole map, because a fixture that
 * restated five unchanged files would be five more places for the two publications to drift apart -
 * and the thing under measurement is precisely which files differ between them.
 *
 * Both changes are the shape a real one takes: a guard added to a condition, and a body turned into an
 * early return. A few lines each, in the middle of a file, which is what a diff has to be readable on.
 *
 * **`imagined-number/round` also stops importing `imagined-number/sign`**, and that one is here for a reason no smaller
 * change reaches: a dependency dropped upstream leaves the closure, so the project holds a folder the
 * lockfile claims and nothing imports. Whether that folder is tidied away or accumulates for ever is a
 * decision `toopo update` has to take, and it cannot be measured on a graph where nothing ever leaves.
 */
export const THE_SECOND_PUBLICATION: Readonly<Record<string, string>> = {
  'imagined-string/pad/reference.ts': `import { DIGITS } from './digits.js'

export const pad = (text: string, width: number): string =>
  DIGITS.test(text) && Number.isInteger(width) ? text.padStart(width, '0') : text
`,

  'imagined-number/round/reference.ts': `import { clamp } from '../../imagined-number/clamp/reference.js'

export const round = (value: number, places: number): number | null => {
  if (!Number.isFinite(value)) return null

  return clamp(value, -places, places)
}
`,
}

export const IMAGINED_NEXT_SOURCES: Readonly<Record<string, string>> = {
  ...IMAGINED_SOURCES,
  ...THE_SECOND_PUBLICATION,
}

const bytesIn = (sources: Readonly<Record<string, string>>, path: string): Buffer => {
  const source = sources[path]
  if (source === undefined) throw new Error(`the imagined graph holds no ${path}`)

  return servedBytes(Buffer.from(source, 'utf8'))
}

/**
 * A file as the registry would serve it, addressed as a record addresses one: by its name inside the
 * contract folder, and never by the path it occupies in the tree above.
 */
const fileIn = (sources: Readonly<Record<string, string>>, path: string): HarnessFile => {
  const bytes = bytesIn(sources, path)

  return { path: path.slice(path.lastIndexOf('/') + 1), sha256: digestOfBytes(bytes), bytes: bytes.byteLength }
}

/**
 * One publication of one artefact, taking the *records* it depends on rather than their addresses.
 *
 * An edge carries the digest of the snapshot it names, and `edgeTo` reads that digest off the target -
 * so what this function needs is the target itself. The consequence is that the graph is written in
 * dependency order below, which it was anyway, and that a wrong digest cannot be written here at all.
 */
const publicationAt = (version: string, sources: Readonly<Record<string, string>>) => (
  contract: ContractAddress,
  files: readonly string[],
  dependsOn: readonly ImplementationRecord[],
): ImplementationRecord => ({
  id: 'reference',
  contract,
  author: 'toopo',
  version,
  status: 'default',
  files: files.map((path) => fileIn(sources, path)),
  dependsOn: dependsOn.map(edgeTo),
  minifiedBytes: null,
  benchmarks: [],
  tags: ['reference'],
})

const PAD_FILES = ['imagined-string/pad/reference.ts', 'imagined-string/pad/digits.ts']
const CLAMP_FILES = ['imagined-number/clamp/reference.ts', 'imagined-number/clamp/digits.ts']
const SIGN_FILES = ['imagined-number/sign/reference.ts']
const ROUND_FILES = ['imagined-number/round/reference.ts']

const first = publicationAt(IMAGINED_VERSION, IMAGINED_SOURCES)

export const pad = first(PAD, PAD_FILES, [])

export const sign = first(SIGN, SIGN_FILES, [pad])

export const clamp = first(CLAMP, CLAMP_FILES, [pad])

export const round = first(ROUND, ROUND_FILES, [clamp, sign])

export const HOLDINGS: readonly ImplementationRecord[] = [pad, sign, clamp, round]

/**
 * The two independent carriers, apart from `HOLDINGS` and never mixed into it.
 *
 * **Two contracts that share a file and depend on nothing, which the graph above cannot express.** It
 * deduplicates `digits.ts` between `PAD` and `CLAMP`, and that pair has a property nobody chose: the
 * carrier is a *dependency* of the borrower. Resolution is dependencies-first, so the carrier is
 * always placed first and can never leave the project while the borrower stays - which makes the one
 * thing deduplication has to survive unreachable, and it was unreachable in silence until a removal
 * went looking for it.
 *
 * Deduplication is by digest across the whole plan and never by an edge, so two features that know
 * nothing about each other share a file exactly as readily. Removing the carrier then has to write the
 * blob into the folder of whoever still holds it and repoint that folder's import at it - and a defect
 * that skipped either half would leave the project looking installed and failing at build, on an
 * import inside a file nobody edited.
 *
 * These are kept out of `HOLDINGS` on purpose: adding them there would change the graph two batteries
 * and three suites are already measured against, to reach one shape that wants its own source.
 *
 * `imagined-text/left@1` sorts before `imagined-text/right@1`, so a plan over both places `trim.ts` in
 * the left folder and repoints the right one at it. That is what makes removing `imagined-text/left@1`
 * the case that matters: the file has to move into `imagined-text/right/`, and the import inside
 * `right.ts` has to move with it.
 */
export const INDEPENDENT_CARRIERS: readonly ImplementationRecord[] = [
  first(LEFT, ['imagined-text/left/reference.ts', 'imagined-text/left/trim.ts'], []),
  first(RIGHT, ['imagined-text/right/reference.ts', 'imagined-text/right/trim.ts'], []),
]

const next = publicationAt(IMAGINED_NEXT_VERSION, IMAGINED_NEXT_SOURCES)

const nextPad = next(PAD, PAD_FILES, [])
const nextSign = next(SIGN, SIGN_FILES, [nextPad])
const nextClamp = next(CLAMP, CLAMP_FILES, [nextPad])

export const NEXT_HOLDINGS: readonly ImplementationRecord[] = [
  nextPad,
  nextSign,
  nextClamp,
  // No edge to `sign` any more, which is the whole point of the second publication being a graph and
  // not two files: `imagined-number/sign@1` is still published and is no longer reachable from `imagined-number/round@1`.
  next(ROUND, ROUND_FILES, [nextClamp]),
]

/**
 * The bytes behind every digest of the graph, which is what a source of this catalogue has to serve
 * and what the records themselves never carry.
 *
 * Both publications, because a registry goes on serving what it published: a lockfile pinning
 * `reference@1.0.0` names bytes that must still be fetchable, and permanent rule 6 is the reason.
 * Seven entries for twelve paths - `digits.ts` is one blob under two paths in each publication, and
 * four of the six files did not change between them.
 */
export const IMAGINED_BLOBS: ReadonlyMap<string, Buffer> = new Map(
  [IMAGINED_SOURCES, IMAGINED_NEXT_SOURCES].flatMap((sources) =>
    Object.keys(sources).map(
      (path) => [digestOfBytes(bytesIn(sources, path)), bytesIn(sources, path)] as const,
    ),
  ),
)
