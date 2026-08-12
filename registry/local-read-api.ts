/**
 * This working tree, answering the whole read API, so that the tree a host serves can be written from
 * it.
 *
 * ---------------------------------------------------------------------------
 * The third reader of one source, and why it is not either client's
 * ---------------------------------------------------------------------------
 *
 * `cli/local-source.ts` serves the harness of every contract and mints a version that lands in
 * somebody's `toopo.lock`; it carries no `contract-binding`, because an installer turns a name into an
 * address through the index and never needs the digest. `site/local-source.ts` carries that binding and
 * the methodology, and serves one file per contract - the implementation a playground runs. **Neither
 * is the union, and neither should be**: a port belongs to its consumer, and those two consumers ask
 * for what they ask for.
 *
 * What this answers is not a consumer's slice at all. It is every question, because what it feeds
 * writes down every answer - and the closure proves that only if the thing being closed over holds
 * everything. The three are readers of one source: `the-five.ts` is the only statement of what the
 * catalogue is, `serialiseContract` the only statement of how a folder becomes a record, and
 * `registry/snapshot.ts` the only statement of what freezing one means. What differs between the three
 * is which questions they will be asked.
 *
 * ---------------------------------------------------------------------------
 * The frontier is unchanged, and this is the side of it the frontier is about
 * ---------------------------------------------------------------------------
 *
 * `cli/source.ts` says serialising this working tree stands in for a publication that has not happened
 * and is never a source an installation may be served from, because a checkout of this repository is a
 * third-party repository to everyone who is not the founder. That is a rule about **clients**, and both
 * client guards keep it: one module of each folder may reach the serialisation.
 *
 * This is the registry serialising itself, which is what publishing is until a publishing tool exists.
 * The tree it feeds is what a host answers with, so an installation served from it is served from the
 * registry's own snapshot and permanent rule 3 holds exactly. Nothing here widens what a client may do:
 * no client imports this, and the two frontier guards go on refusing every module but one.
 *
 * ---------------------------------------------------------------------------
 * The version is false on purpose, for the third time
 * ---------------------------------------------------------------------------
 *
 * `0.0.0-local`, never `1.0.0`. `ImplementationRecord.version` is `null` for all five - nothing has
 * been published - so a version has to be minted for anything to be installable at all, and one that
 * looks published would turn a lockfile's own argument against it. The constant is written in three
 * modules and kept in step by a guard rather than by an import, for the reason the two clients already
 * carry it twice: a published registry mints real versions and has no notion of a stand-in, so there is
 * no home that would make this one constant.
 */

import type { ContractAddress } from './address.js'
import { renderContract, sameContract } from './address.js'
import type { ImplementationRecord } from './implementation-record.js'
import type { ReadApi } from './read-api.js'
import type { ServedBlob, ServedExport, ServedSnapshot } from './response.js'
import {
  servedBlob,
  servedContractBinding,
  servedExportsOf,
  servedImplementationBinding,
  servedIndex,
  servedRefusals,
  servedSnapshot,
} from './response.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract, servedFileOf } from './serialise.js'
import type { Ledger } from './snapshot.js'
import {
  EMPTY_LEDGER,
  contractSnapshot,
  digestOfSnapshot,
  implementationSnapshot,
  publishContract,
  publishImplementation,
  refuseContract,
} from './snapshot.js'
import { theFive } from './the-five.js'
import { servedMethodology } from './verifiability.js'

/** The version every implementation this registry serves is bound at, visibly not a published one. */
export const THE_UNPUBLISHED_VERSION = '0.0.0-local'

/** The epoch, because a binding minted here was never published and a clock would be a second lie. */
const THE_UNPUBLISHED_INSTANT = '1970-01-01T00:00:00.000Z'

type Holding = {
  readonly address: ContractAddress
  readonly summary: string
  readonly searchAliases: readonly string[]
  readonly exports: readonly ServedExport[]
  readonly implementation: ImplementationRecord
}

/**
 * Everything this registry holds, built once.
 *
 * The blobs are the **contract's harness** and not the implementation's file list: a contract snapshot
 * names every file of its suite by digest, so every one of them is an address a reader can ask for, and
 * permanent rule 5 says the tests are public in full. Serving the smaller set would publish a page of
 * digests that answer 404.
 */
const gather = (): {
  readonly ledger: Ledger
  readonly holdings: readonly Holding[]
  readonly snapshots: ReadonlyMap<string, ServedSnapshot>
  readonly blobs: ReadonlyMap<string, ServedBlob>
} => {
  const snapshots = new Map<string, ServedSnapshot>()
  const blobs = new Map<string, ServedBlob>()
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

    snapshots.set(digestOfSnapshot(contractShot), servedSnapshot(contractShot))
    snapshots.set(digestOfSnapshot(implementationShot), servedSnapshot(implementationShot))

    for (const file of record.harness) {
      blobs.set(file.sha256, servedBlob(servedFileOf(REPOSITORY_ROOT, source.folder, file)))
    }

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
          digest: digestOfSnapshot(contractShot),
          publishedAt: THE_UNPUBLISHED_INSTANT,
          standing: { lifecycle: record.lifecycle },
        }),
        {
          address: {
            contract: record.address,
            id: implementation.id,
            version: THE_UNPUBLISHED_VERSION,
          },
          digest: digestOfSnapshot(implementationShot),
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
      implementation,
    })
  }

  return { ledger, holdings, snapshots, blobs }
}

/** This working tree, as the registry that serves it. Built lazily and once. */
export const localReadApi = (): ReadApi => {
  const held = gather()

  const holdingFor = (address: ContractAddress): Holding => {
    const holding = held.holdings.find((candidate) => sameContract(candidate.address, address))
    if (holding === undefined) {
      throw new Error(`${renderContract(address)} has a ledger entry and no record behind it`)
    }

    return holding
  }

  return {
    contractIndex: () => servedIndex(held.ledger, held.holdings),

    contractBinding: (address) => {
      const entry = held.ledger.contracts.find((candidate) => sameContract(candidate.address, address))

      return entry === undefined ? null : servedContractBinding(entry)
    },

    implementationBindings: (address) =>
      held.ledger.implementations
        .filter((entry) => sameContract(entry.address.contract, address))
        .map((entry) => {
          const { implementation } = holdingFor(entry.address.contract)

          return servedImplementationBinding(entry, {
            benchmarks: implementation.benchmarks,
            minifiedBytes: implementation.minifiedBytes,
            tags: implementation.tags,
          })
        }),

    refusals: () => servedRefusals(held.ledger),

    methodology: () => servedMethodology(),

    snapshot: (digest) => held.snapshots.get(digest) ?? null,

    blob: (sha256) => held.blobs.get(sha256) ?? null,
  }
}
