/**
 * The only implementation of `RegistrySource` there is, and the only module allowed to reach the
 * serialisation of this working tree.
 *
 * `source.ts` states the frontier and says why it exists; this file is the one thing on the far side of
 * it. Everything it does is a stand-in for a publication that has not happened, and every stand-in
 * below is *visibly* one rather than plausibly one.
 *
 * ---------------------------------------------------------------------------
 * The version is false on purpose
 * ---------------------------------------------------------------------------
 *
 * The five have never been published. `ImplementationRecord.version` is `null` for all of them, and a
 * null cannot be walked - `mustHold` compares an address's `string` version against a record's, so an
 * unpublished implementation is unreachable by construction, which is the schema being right rather
 * than in the way. So a version has to be minted here for anything to be installable at all.
 *
 * It is `0.0.0-local`, and the shape is the whole point. `1.0.0` in a `toopo.lock` would name a
 * version that exists nowhere, and a reader would have no way to tell it from one that does - which
 * turns the lockfile's own argument against itself, since the value of a lockfile is that it can be
 * checked offline against a published fact. A reader who sees `0.0.0-local` knows immediately that
 * nothing was published, and the day publication exists these entries are greppable in any lockfile in
 * the world.
 *
 * The instant is false in the same direction and matters less, because nothing reads it: a binding
 * minted here is not a publication, so it carries the epoch rather than the clock. Reading the clock
 * would also make two runs of one guard disagree, which `CLOCK_DEPENDENCE_RULE` forbids for a reason
 * that applies here unchanged.
 *
 * ---------------------------------------------------------------------------
 * Two reads of one file, deliberately
 * ---------------------------------------------------------------------------
 *
 * `harnessOf` reads every declared file to hash it, and the blobs below read them again to serve them.
 * That is the shape of I-08 - a digest and a size describing two different reads - so the second read
 * is checked against the first and a disagreement refuses the whole source. A file that changed between
 * the two reads is a working tree being edited underneath an install, and serving it would hand the
 * user bytes no digest covers.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ContractAddress } from '../registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import type { ServedExport } from '../registry/response.js'
import {
  servedBlob,
  servedExportsOf,
  servedImplementationBinding,
  servedIndex,
  servedSnapshot,
} from '../registry/response.js'
import type { Ledger } from '../registry/snapshot.js'
import {
  EMPTY_LEDGER,
  contractSnapshot,
  digestOfSnapshot,
  implementationSnapshot,
  publishContract,
  publishImplementation,
  refuseContract,
} from '../registry/snapshot.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract } from '../registry/serialise.js'
import { theFive } from '../registry/the-five.js'
import type { RegistrySource } from './source.js'

/**
 * The version every implementation this source serves is bound at. Visibly not a published version,
 * and that is its whole job.
 */
export const THE_UNPUBLISHED_VERSION = '0.0.0-local'

/** The epoch, because a binding minted here was never published and a clock would be a second lie. */
const THE_UNPUBLISHED_INSTANT = '1970-01-01T00:00:00.000Z'

export class ServedBytesDisagree extends Error {
  constructor(where: string, hashed: string, read: string) {
    super(
      `${where} hashed to ${hashed} when its record was built and to ${read} when it was read to be ` +
        `served. A file that changes between the two reads is a working tree being edited underneath ` +
        `an install, and serving it would hand the user bytes no digest covers.`,
    )
    this.name = 'ServedBytesDisagree'
  }
}

type Holding = {
  readonly address: ContractAddress
  readonly summary: string
  readonly searchAliases: readonly string[]
  readonly exports: readonly ServedExport[]
  readonly contractDigest: string
  readonly implementation: ImplementationRecord
  readonly implementationDigest: string
}

/**
 * Everything this source serves, built once.
 *
 * The blobs are gathered from the *contract's* harness rather than from the implementation's file
 * list, because an auditor fetching the suite asks for all of them and the implementation's are a
 * subset. Serving the smaller set would make the source answer a question the endpoint does not narrow.
 */
const gather = (): {
  readonly ledger: Ledger
  readonly holdings: readonly Holding[]
  readonly snapshots: ReadonlyMap<string, ReturnType<typeof servedSnapshot>>
  readonly blobs: ReadonlyMap<string, Buffer>
} => {
  const snapshots = new Map<string, ReturnType<typeof servedSnapshot>>()
  const blobs = new Map<string, Buffer>()
  const holdings: Holding[] = []
  let ledger = EMPTY_LEDGER

  for (const source of theFive) {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const implementation: ImplementationRecord = {
      ...referenceImplementationOf(REPOSITORY_ROOT, source),
      version: THE_UNPUBLISHED_VERSION,
    }

    const contractShot = contractSnapshot(record)
    const implementationShot = implementationSnapshot(implementation)
    const contractDigest = digestOfSnapshot(contractShot)
    const implementationDigest = digestOfSnapshot(implementationShot)

    snapshots.set(contractDigest, servedSnapshot(contractShot))
    snapshots.set(implementationDigest, servedSnapshot(implementationShot))

    for (const file of record.harness) {
      const bytes = servedBytes(readFileSync(join(REPOSITORY_ROOT, source.folder, file.path)))
      const read = digestOfBytes(bytes)
      if (read !== file.sha256) {
        throw new ServedBytesDisagree(`${source.folder}/${file.path}`, file.sha256, read)
      }
      blobs.set(read, bytes)
    }

    /**
     * A contract the catalogue decided against never enters the published half, and its
     * implementation is never bound at all.
     *
     * Measured rather than reasoned: this loop published all five, so `array/group-by@1` came back
     * `installable: true` from the index of the very registry whose refusals page exists to say it was
     * turned down. The state is not an exotic one - it is the one contract of the five that carries a
     * retirement, and it carries the retirement that happens *before* publication.
     */
    if (record.lifecycle.state === 'never-published') {
      ledger = refuseContract(ledger, {
        address: record.address,
        decidedAgainst: record.lifecycle.decidedAgainst,
        measurement: record.lifecycle.measurement,
        keptAs: record.lifecycle.keptAs,
        decidedOn: THE_UNPUBLISHED_INSTANT,
      })
    } else {
      ledger = publishImplementation(
        publishContract(ledger, {
          address: record.address,
          digest: contractDigest,
          publishedAt: THE_UNPUBLISHED_INSTANT,
          standing: { lifecycle: record.lifecycle },
        }),
        {
          address: {
            contract: implementation.contract,
            id: implementation.id,
            version: THE_UNPUBLISHED_VERSION,
          },
          digest: implementationDigest,
          publishedAt: THE_UNPUBLISHED_INSTANT,
          standing: { status: implementation.status },
        },
      )
    }

    holdings.push({
      address: record.address,
      summary: record.identity.summary,
      searchAliases: record.identity.searchAliases,
      exports: servedExportsOf(record.surface.exports),
      contractDigest,
      implementation,
      implementationDigest,
    })
  }

  return { ledger, holdings, snapshots, blobs }
}

/**
 * A source over the five contracts of this working tree.
 *
 * Built lazily and once, because building it serialises five contracts and reads thirty-seven files -
 * a cost worth paying when something is installed and not worth paying to print a usage line.
 */
export const localSource = (): RegistrySource => {
  const held = gather()

  return {
    contractIndex: () => servedIndex(held.ledger, held.holdings),

    implementationBindings: (address) =>
      held.ledger.implementations
        .filter((entry) => sameContract(entry.address.contract, address))
        .map((entry) => {
          const holding = held.holdings.find(
            (candidate) =>
              renderImplementation({
                contract: candidate.address,
                id: candidate.implementation.id,
                version: THE_UNPUBLISHED_VERSION,
              }) === renderImplementation(entry.address),
          )

          if (holding === undefined) {
            throw new Error(
              `${renderContract(entry.address.contract)} has a ledger entry and no record behind it`,
            )
          }

          return servedImplementationBinding(entry, {
            benchmarks: holding.implementation.benchmarks,
            minifiedBytes: holding.implementation.minifiedBytes,
            tags: holding.implementation.tags,
          })
        }),

    snapshot: (digest) => held.snapshots.get(digest) ?? null,

    blob: (sha256) => {
      const bytes = held.blobs.get(sha256)

      return bytes === undefined ? null : servedBlob(bytes)
    },
  }
}
