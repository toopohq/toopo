/**
 * The only implementation of this folder's `RegistrySource`, and the only module allowed to reach the
 * serialisation of this working tree.
 *
 * `source.ts` states the frontier and `packages/cli/local-source.ts` states it once more from the installer's
 * side; neither is weakened here. What this file does is stand in for a publication that has not
 * happened, so that pages can be built against real contracts before a server exists to build them
 * against.
 *
 * ---------------------------------------------------------------------------
 * Two stand-ins, and why they are two
 * ---------------------------------------------------------------------------
 *
 * The installer's stand-in and this one turn the same five contracts into served answers, and the
 * temptation to write the arithmetic once is real. It is refused, and measured rather than argued.
 *
 * They are not the same object. The installer's mints a version that lands in somebody's `toopo.lock`
 * and serves the bytes of every harness file, because an installation writes files and records what it
 * wrote. This one mints nothing a reader keeps, and serves the bytes of one file per contract rather
 * than of every file: the implementation a playground runs, which is the one thing on a page that is
 * computed instead of rendered.
 *
 * **That sentence used to read "serves no byte at all", and the playground is what falsified it.** It
 * is kept in view rather than quietly rewritten, because it is the same correction `source.ts` records
 * one file along and it was true of both for the same length of time: a page that only renders needs
 * to name what it renders, and a page that runs something needs the thing. Two of `cli-install`'s mutants -
 * C-17 and C-18 - inject into precisely the two lines a merge would move, and a battery injects only
 * into its own folder, so merging would delete two measured defects about the installer's stand-in in
 * order to save twenty lines. Resemblance is not duplication, which is the rule the catalogue already
 * applies to `outputsAreEqual`.
 *
 * What is genuinely one thing is one thing: the serialisation, the snapshots, the ledger and the
 * projections all live in `packages/registry/` and both stand-ins call them.
 *
 * ---------------------------------------------------------------------------
 * A refused contract has no binding, and that is the design rather than a hole
 * ---------------------------------------------------------------------------
 *
 * `array/group-by@1` was decided against *before* publication, so `refuseContract` records the
 * argument and binds no digest - there is no frozen artefact, because nothing was ever served. So
 * `contractBinding` answers `null` for it, and it has no contract page: what the catalogue publishes
 * about it is the refusal, on the page written for refusals. A page rendering a definition with no
 * digest behind it would be a contract page whose whole verifiable half is missing, which is the one
 * thing this site must not publish.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ContractAddress } from '../registry/address.js'
import { renderContract, sameContract } from '../registry/address.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import type { ServedBlob, ServedSnapshot } from '../registry/response.js'
import {
  servedBlob,
  servedContractBinding,
  servedExportsOf,
  servedImplementationBinding,
  servedIndex,
  servedRefusals,
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
import { servedMethodology } from '../registry/verifiability.js'
import type { RegistrySource } from './source.js'

/**
 * The version this stand-in binds its implementations at, visibly not a published one.
 *
 * **Written here and also in `packages/cli/local-source.ts`, deliberately.** A client may not import another
 * client, and the registry has no notion of a stand-in - a published registry mints real versions - so
 * there is no home that would make it one constant. What keeps the two in step is a guard rather than
 * a comment: `source.test.ts` reads the installer's and requires it to be this.
 *
 * Nothing this generator renders shows it, which is why the guard is worth having: a disagreement here
 * would be invisible on every page and would surface the day either stand-in is replaced by a server.
 */
export const THE_UNPUBLISHED_VERSION = '0.0.0-local'

/** The epoch, because a binding minted here was never published and a clock would be a second lie. */
const THE_UNPUBLISHED_INSTANT = '1970-01-01T00:00:00.000Z'

type Holding = {
  readonly address: ContractAddress
  readonly summary: string
  readonly searchAliases: readonly string[]
  readonly exports: ReturnType<typeof servedExportsOf>
  /** The standing of the one implementation, read from its record rather than invented here. */
  readonly implementation: ImplementationRecord
}

/**
 * The blobs are the implementation's files and not the contract's harness, which is where this
 * stand-in and the installer's genuinely part company rather than merely resembling each other.
 *
 * The installer serves the harness because an auditor fetching a suite asks for all of it. A page runs
 * one thing - the implementation whose cost it states, in a browser - so serving the harness here
 * would be serving bytes the generator fetches and does not use, which is the sentence `source.ts`
 * used to make about `blob` itself.
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
    const implementation = {
      ...referenceImplementationOf(REPOSITORY_ROOT, source),
      version: THE_UNPUBLISHED_VERSION,
    }

    const contractShot = contractSnapshot(record)
    const implementationShot = implementationSnapshot(implementation)
    const contractDigest = digestOfSnapshot(contractShot)
    const implementationDigest = digestOfSnapshot(implementationShot)

    snapshots.set(contractDigest, servedSnapshot(contractShot))
    snapshots.set(implementationDigest, servedSnapshot(implementationShot))

    for (const file of implementation.files) {
      const served = servedBlob(readFileSync(join(REPOSITORY_ROOT, source.folder, file.path)))
      blobs.set(served.addressedBy, served)
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
          digest: contractDigest,
          publishedAt: THE_UNPUBLISHED_INSTANT,
          standing: { lifecycle: record.lifecycle },
        }),
        {
          address: {
            contract: record.address,
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
      implementation,
    })
  }

  return { ledger, holdings, snapshots, blobs }
}

/**
 * A source over the five contracts of this working tree.
 *
 * Built lazily and once. Building it serialises five contracts and hashes thirty-seven files, and a
 * generator that rebuilt it per page would pay that five times to publish one catalogue.
 */
export const localSource = (): RegistrySource => {
  const held = gather()

  return {
    contractIndex: () => servedIndex(held.ledger, held.holdings),

    contractBinding: (address) => {
      const entry = held.ledger.contracts.find((held) => sameContract(held.address, address))

      return entry === undefined ? null : servedContractBinding(entry)
    },

    implementationBindings: (address) =>
      held.ledger.implementations
        .filter((entry) => sameContract(entry.address.contract, address))
        .map((entry) => {
          const holding = held.holdings.find((candidate) =>
            sameContract(candidate.address, entry.address.contract),
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

    refusals: () => servedRefusals(held.ledger),

    snapshot: (digest) => held.snapshots.get(digest) ?? null,

    /**
     * The one answer of this port that is not about the five contracts at all.
     *
     * It is served straight from `packages/registry/verifiability.ts` because there is nothing here to stand
     * in for: the two columns, the strata and the seeding policy are the registry's own opinion about
     * its own guarantees, and a stand-in mints nothing about them. A published server answers the
     * same value.
     */
    methodology: () => servedMethodology(),

    blob: (sha256) => held.blobs.get(sha256) ?? null,
  }
}
