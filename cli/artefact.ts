/**
 * Every answer the registry gives, frozen into one file, so that an installed `toopo` needs no
 * working tree.
 *
 * ---------------------------------------------------------------------------
 * Why this exists, measured rather than argued
 * ---------------------------------------------------------------------------
 *
 * `local-source.ts` stands in for a publication by serialising this repository. That is exactly what
 * `source.ts` says it may never become - *a checkout of this repository is a third-party repository
 * to everyone who is not the founder* - and three measurements on node v24.15.0 say it could not
 * become one even if the rule allowed it.
 *
 * **The serialisation drags the whole repository behind it.** `toopo search slugify` - a command that
 * installs nothing - loads 147 modules, among them `vitest`, the TypeScript compiler API, twelve
 * modules of `mutation/` and four of `validation/`. The chain is
 * `the-five.ts` -> `contracts/typescript/*\/contract.ts` -> `packages/catalogue/every-contract.ts` ->
 * `import { expect } from 'vitest'`, and vitest is a dev dependency a user never receives. Cutting
 * `local-source.ts` out of the graph drops it from 55 repository modules to 26 and removes vitest
 * entirely.
 *
 * **A published `.ts` file cannot run.** Node refuses to strip types under `node_modules` -
 * `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` - and refuses it for a `bin` entry point exactly as
 * for an imported module. So what ships is JavaScript, and a JavaScript build that imported
 * `the-five.ts` would still import vitest.
 *
 * **And the supply-chain argument runs the same way.** A `toopo` that serialised whatever contract
 * files it found in its own `node_modules` would recompute the digests it then writes into somebody's
 * lockfile, so a corrupted byte would be hashed rather than caught, and the lockfile would faithfully
 * record the corruption. Digests fixed when the archive was built are checkable; digests recomputed
 * from whatever is on disk certify themselves and prove nothing. Permanent rule 3 calls what an
 * installation is served from *the registry's immutable snapshot*, and this file is that snapshot for
 * as long as there is no server to hold it.
 *
 * ---------------------------------------------------------------------------
 * It carries what a command reads, and the harness is not in it
 * ---------------------------------------------------------------------------
 *
 * `local-source.ts` gathers every file of a contract's harness, because an auditor fetching the suite
 * asks for all of them. No command of this folder ever asks: an installation writes `reference.ts`
 * and nothing else, so the blobs here are the ones `fetchedSources` reaches for and no others.
 * Carrying the rest would be shipping bytes nothing reads, which is what `field-map.ts` calls a
 * speculative field and deletes.
 *
 * That is not permanent rule 5 being weakened. The contracts stay public in full - in this
 * repository, and on every contract page the site publishes. What would change this is a command that
 * serves somebody the harness of what they installed; on the day it exists, the walk in
 * `packaging/freeze.ts` widens and this paragraph goes.
 *
 * ---------------------------------------------------------------------------
 * Its integrity is not checked here, and that is not an omission
 * ---------------------------------------------------------------------------
 *
 * What this file validates is *shape*: that the thing parsed off disk has the fields a source needs,
 * so that a truncated or hand-edited artefact is refused with a sentence instead of surfacing as an
 * undefined three call frames later. It deliberately does not re-hash anything.
 *
 * The integrity check already exists one layer up and on the path every installation takes:
 * `heldAt` runs `servedSnapshotFaults` over every snapshot it fetches and `fetchedSources` runs
 * `servedBlobFaults` over every blob, and both re-derive the digest from the bytes that arrived. A
 * second verification here would be a second statement of one fact, green whenever the first is, and
 * the two would have no answer to *which of us is right* on the day they disagreed.
 */

import { existsSync, readFileSync } from 'node:fs'

import type {
  ServedBlob,
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from '../packages/registry/response.js'

/** The file, beside the compiled entry point that reads it. */
export const ARTEFACT_FILE = 'registry.json'

/**
 * The shape of this file, so that a `toopo` meeting an artefact it does not understand says so.
 *
 * It is not the snapshot format and not the lockfile version: those describe things this repository
 * publishes for other people to read, and this describes one file two of its own modules pass between
 * them. It moves when a field here changes, which the two move independently of.
 */
export const ARTEFACT_FORMAT = 1

/** The bindings under one contract, keyed by the rendered address the port is asked with. */
export type ArtefactBindings = {
  readonly contract: string
  readonly bindings: readonly ServedImplementationBinding[]
}

/**
 * One file's served bytes, base64.
 *
 * Base64 rather than the text itself, because a blob is bytes and this file is JSON. The catalogue
 * holds a lone surrogate on purpose - `string/slugify@1` settles a case on it - and a lone surrogate
 * does not survive a round trip through a JSON string as itself.
 */
export type ArtefactBlob = {
  readonly addressedBy: string
  readonly base64: string
}

export type ServedArtefact = {
  readonly formatVersion: number
  readonly index: ServedIndex
  readonly refusals: ServedRefusals
  readonly bindings: readonly ArtefactBindings[]
  readonly snapshots: readonly ServedSnapshot[]
  readonly blobs: readonly ArtefactBlob[]
}

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** One field of the shape, and what a reader is told when it is not there. */
type Check = {
  readonly holds: (value: unknown) => boolean
  readonly missing: string
}

/**
 * Every field of `ServedArtefact`, total by construction.
 *
 * The shape `cli/lockfile.ts` already takes, for the reason stated where this repository settled it:
 * a field added to the type does not compile until a check for it is written. What the totality
 * guarantees is that no field goes unconsidered, never that every check is one expression - the lists
 * are checked as lists here and their elements below.
 */
const FIELDS_OF: Readonly<Record<keyof ServedArtefact, Check>> = {
  formatVersion: { holds: (value) => typeof value === 'number', missing: 'carries no format version' },
  index: {
    holds: (value) => isRecord(value) && Array.isArray(value['entries']),
    missing: 'carries no contract index',
  },
  refusals: {
    holds: (value) =>
      isRecord(value) && Array.isArray(value['refusals']) && Array.isArray(value['absorbed']),
    missing: 'carries no refusals',
  },
  bindings: { holds: (value) => Array.isArray(value), missing: 'carries no implementation bindings' },
  snapshots: { holds: (value) => Array.isArray(value), missing: 'carries no snapshots' },
  blobs: { holds: (value) => Array.isArray(value), missing: 'carries no files' },
}

const BINDINGS_FIELDS_OF: Readonly<Record<keyof ArtefactBindings, Check>> = {
  contract: { holds: (value) => typeof value === 'string', missing: 'names no contract' },
  bindings: { holds: (value) => Array.isArray(value), missing: 'carries no bindings' },
}

const BLOB_FIELDS_OF: Readonly<Record<keyof ArtefactBlob, Check>> = {
  addressedBy: { holds: (value) => typeof value === 'string', missing: 'carries no digest' },
  base64: { holds: (value) => typeof value === 'string', missing: 'carries no bytes' },
}

const faultsAgainst = (
  fields: Readonly<Record<string, Check>>,
  value: unknown,
  where: string,
): readonly string[] =>
  isRecord(value)
    ? Object.entries(fields)
        .filter(([name, check]) => !check.holds(value[name]))
        .map(([, check]) => `${where} ${check.missing}`)
    : [`${where} is not an object`]

const elementFaults = (
  value: unknown,
  fields: Readonly<Record<string, Check>>,
  what: string,
): readonly string[] =>
  Array.isArray(value)
    ? value.flatMap((element, at) => faultsAgainst(fields, element, `${what} ${at}`))
    : []

/**
 * Why this is not an artefact this `toopo` can serve from. Empty when it is.
 *
 * A format this reader does not know is answered *instead of* the field checks rather than beside
 * them, the shape `lockfileFaults` already takes: the fields of another format are another format's
 * business, and listing them would bury the one sentence that says what happened.
 */
export const artefactFaults = (value: unknown): readonly string[] => {
  if (!isRecord(value)) return [`${ARTEFACT_FILE} does not hold an object`]

  if (value['formatVersion'] !== ARTEFACT_FORMAT) {
    return [
      // The third sentence used to name what built the archive, which the format number does not
      // establish - a truncated or hand-edited file carries a number too. It said nothing the two
      // facts above do not, so it goes rather than being qualified.
      `${ARTEFACT_FILE} is written under format ${JSON.stringify(value['formatVersion'])} and this ` +
        `\`toopo\` reads format ${ARTEFACT_FORMAT}.`,
    ]
  }

  return [
    ...faultsAgainst(FIELDS_OF, value, ARTEFACT_FILE),
    ...elementFaults(value['bindings'], BINDINGS_FIELDS_OF, 'binding'),
    ...elementFaults(value['blobs'], BLOB_FIELDS_OF, 'file'),
  ]
}

/**
 * Refused cleanly, and deliberately not an entry in `WHAT_BREAKS`.
 *
 * That list is *what happens to a real project*, and every situation in it is a state the user's own
 * project is in: a file already there, a file they edited, a lockfile from an older `toopo`, a path
 * with a space. An artefact that is missing or unreadable is none of those - it is a defect in the
 * archive, which is why the sentence below says so in as many words. Filing it beside the others
 * would blur a list whose whole value is that it is about the person using the tool.
 */
export class UnusableArtefact extends Error {
  constructor(faults: readonly string[]) {
    super(
      `this \`toopo\` cannot read the catalogue it was published with, so it can install nothing:\n` +
        faults.join('\n'),
    )
    this.name = 'UnusableArtefact'
  }
}

export const readArtefact = (path: string): ServedArtefact => {
  if (!existsSync(path)) {
    throw new UnusableArtefact([
      // Neither *published without it* nor *rather than anything you did*: what was measured is that
      // the path holds nothing. A `rm` under `node_modules` produces exactly this, so absolving the
      // reader is a claim about their own machine that nothing here can make.
      `${path} is not there, so this \`toopo\` has no catalogue to install from.`,
    ])
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    throw new UnusableArtefact([`${path} is not JSON`])
  }

  const faults = artefactFaults(parsed)
  if (faults.length > 0) throw new UnusableArtefact(faults)

  return parsed as ServedArtefact
}

/** A blob as the port answers it, decoded from the entry that carries it. */
export const decodedBlob = (blob: ArtefactBlob): ServedBlob => ({
  addressing: 'content-addressed',
  addressedBy: blob.addressedBy,
  bytes: Buffer.from(blob.base64, 'base64'),
})
