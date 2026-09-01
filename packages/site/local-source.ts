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
import {
  THE_PUBLICATIONS,
  THE_PUBLICATION_INSTANT,
  THE_UNPUBLISHED_PUBLICATION,
} from '../registry/publication.js'
import { THE_UNPUBLISHED_REVISION } from '../registry/revision.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract } from '../registry/serialise.js'
import { theCatalogue } from '../registry/the-catalogue.js'
import { servedMethodology } from '../registry/verifiability.js'
import type { ReadOneAnswer, WhereTheCatalogueIs } from './searching.js'
import type { RegistrySource } from './source.js'

/**
 * The version this stand-in binds its implementations at, restated rather than imported.
 *
 * **Written here and also in `packages/cli/local-source.ts`, deliberately.** A client may not import
 * another client, so the two state one fact twice and `source.test.ts` reads the disagreement. The
 * sentence this used to carry - *the registry has no notion of a stand-in, so there is no home that
 * would make it one constant* - was true of a stand-in and died with it: `publication.ts` is the home,
 * `local-read-api.ts` imports it rather than taking part in the redundancy, and the guard that ties
 * these two now ties both to that declaration.
 *
 * Nothing this generator renders shows it, which is why the guard is worth having: a disagreement here
 * would be invisible on every page and would surface the day either stand-in is replaced by a server.
 * ADR-0106.
 */
export const THE_PUBLISHED_VERSION = '1.0.0'

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

  for (const source of theCatalogue) {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const implementation = {
      ...referenceImplementationOf(REPOSITORY_ROOT, source),
      version: THE_PUBLISHED_VERSION,
    }

    const contractShot = contractSnapshot(record)
    const implementationShot = implementationSnapshot(implementation)
    const contractDigest = digestOfSnapshot(contractShot)
    const implementationDigest = digestOfSnapshot(implementationShot)

    /**
     * When the catalogue published this, taken from the one declaration that says so.
     *
     * **A stand-in dates its bindings correctly and still anchors nothing**, which is the split
     * `snapshot.ts` draws between the two fields: the instant is a fact about the catalogue and is
     * true wherever it is served, while the commit is a claim that *this* tree can be rebuilt at it -
     * and a working tree cannot make that claim. So `from` stays forty zeros below and this is read.
     * ADR-0177.
     */
    const publication =
      THE_PUBLICATIONS[renderContract(record.address)] ?? THE_UNPUBLISHED_PUBLICATION

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
        decidedOn: THE_PUBLICATION_INSTANT,
      })
    } else {
      ledger = publishImplementation(
        publishContract(ledger, {
          address: record.address,
          digest: contractDigest,
          publishedAt: publication.at,
          publishedFrom: THE_UNPUBLISHED_REVISION,
          standing: {
            lifecycle: record.lifecycle,
            ...(record.useCases === undefined ? {} : { useCases: record.useCases }),
            ...(record.againstTheLanguage === undefined
              ? {}
              : { againstTheLanguage: record.againstTheLanguage }),
            ...(record.correctionsToFrozenProse === undefined
              ? {}
              : { correctionsToFrozenProse: record.correctionsToFrozenProse }),
            ...(record.alsoFoundBy === undefined ? {} : { alsoFoundBy: record.alsoFoundBy }),
          },
        }),
        {
          address: {
            contract: record.address,
            id: implementation.id,
            version: THE_PUBLISHED_VERSION,
          },
          digest: implementationDigest,
          publishedAt: publication.at,
          publishedFrom: THE_UNPUBLISHED_REVISION,
          standing: { status: implementation.status },
        },
      )
    }

    holdings.push({
      address: record.address,
      summary: record.identity.summary,
      searchAliases: record.identity.searchAliases,
      ...(record.alsoFoundBy === undefined
        ? {}
        : { alsoFoundBy: record.alsoFoundBy.map((learned) => learned.term) }),
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
export const localSource = (servedFrom: string = THE_UNPUBLISHED_REVISION): RegistrySource => {
  const held = gather()

  return {
    contractIndex: () => servedIndex(servedFrom, held.ledger, held.holdings),

    contractBinding: (address) => {
      const entry = held.ledger.contracts.find((held) => sameContract(held.address, address))

      return entry === undefined ? null : servedContractBinding(servedFrom, entry)
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

          return servedImplementationBinding(servedFrom, entry, {
            benchmarks: holding.implementation.benchmarks,
            minifiedBytes: holding.implementation.minifiedBytes,
            tags: holding.implementation.tags,
          })
        }),

    refusals: () => servedRefusals(servedFrom, held.ledger),

    snapshot: (digest) => held.snapshots.get(digest) ?? null,

    /**
     * The one answer of this port that is not about the five contracts at all.
     *
     * It is served straight from `packages/registry/verifiability.ts` because there is nothing here to stand
     * in for: the two columns, the strata and the seeding policy are the registry's own opinion about
     * its own guarantees, and a stand-in mints nothing about them. A published server answers the
     * same value.
     */
    methodology: () => servedMethodology(servedFrom),

    blob: (sha256) => held.blobs.get(sha256) ?? null,
  }
}


/**
 * The same working tree, answered over the shape a browser fetches rather than over `RegistrySource`.
 *
 * `overHttp` reads two addresses off a page and asks a host for them; a guard that drives a control has
 * to answer those two without one. This is that answer, and it is here rather than beside a guard for
 * the reason this whole file exists: standing in for a publication that has not happened is this
 * module's subject, and an HTTP-shaped stand-in over the same tree is the same stand-in one layer up.
 *
 * **It is read by guards and by nothing the site builds**, which is why it takes the source instead of
 * calling `localSource` itself: two callers that each built their own would serialise the catalogue
 * twice, and one of them would be free to hand it a different one.
 *
 * Anything but the two addresses the page declares answers 404, because a control asking for a third
 * is a control this stand-in should not be quietly satisfying.
 */
export const answeredFromThisTree =
  (source: RegistrySource, where: WhereTheCatalogueIs): ReadOneAnswer =>
  (at) =>
    Promise.resolve(
      at === where.index
        ? { status: 200, body: JSON.stringify(source.contractIndex()) }
        : at === where.refusals
          ? { status: 200, body: JSON.stringify(source.refusals()) }
          : { status: 404, body: '' },
    )
