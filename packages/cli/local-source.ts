/**
 * The implementation of `RegistrySource` backed by this working tree, and the only module allowed to
 * reach the serialisation that makes it one.
 *
 * It used to open by calling itself *the only implementation there is*, which had been false since
 * `packaged-source.ts` was written and is further from true now that a source can be reached over a
 * wire. What is singular about this one is not that it is alone: it is that nothing else may cross the
 * frontier below.
 *
 * `source.ts` states that frontier and says why it exists; this file is the one thing on the far side of
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
 *
 * The check is `servedFileOf`, one floor down, because it is one rule about this working tree and there
 * are three readers of it. It was written here first, when this was the only stand-in that served bytes.
 */

import type { ContractAddress } from '../registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../registry/address.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import type { ServedExport } from '../registry/response.js'
import {
  servedBlob,
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
import { THE_PUBLICATION_INSTANT } from '../registry/publication.js'
import { THE_UNPUBLISHED_REVISION } from '../registry/revision.js'
import {
  REPOSITORY_ROOT,
  referenceImplementationOf,
  serialiseContract,
  servedFileOf,
  servedFilesOf,
} from '../registry/serialise.js'
import { theCatalogue } from '../registry/the-catalogue.js'
import type { RegistrySource } from './source.js'

/**
 * The version every implementation this source serves is bound at, restated rather than imported.
 *
 * **A client may not import another client, so this is one of two independent statements of one fact**
 * and the disagreement between them is what `source.test.ts` reads. The registry no longer takes part
 * in that redundancy: it is where `publication.ts` mints the version, so `local-read-api.ts` imports
 * the declaration and this one is resolved against it. That third leg was missing for as long as the
 * string named nothing, and it was the leg the emission reads.
 *
 * It says `1.0.0` and no longer `0.0.0-local`. The old string's job was to be visibly not a
 * publication; what does that job now is the ledger itself, whose binding names the commit it was
 * published from and is refused if that commit does not produce it. ADR-0106.
 */
export const THE_PUBLISHED_VERSION = '1.0.0'

type Holding = {
  readonly address: ContractAddress
  readonly summary: string
  readonly searchAliases: readonly string[]
  /**
   * What the registry learned people ask by, which this stand-in serves and does not curate.
   *
   * The standing below is `lifecycle` and nothing else, because an installer never asks for a
   * contract binding - but the index is a different answer and this one carries it, so a search
   * against this source answers what a search against the origin answers. ADR-0155.
   */
  readonly alsoFoundBy?: readonly string[]
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

  for (const source of theCatalogue) {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const implementation: ImplementationRecord = {
      ...referenceImplementationOf(REPOSITORY_ROOT, source),
      version: THE_PUBLISHED_VERSION,
    }

    const contractShot = contractSnapshot(record)
    const implementationShot = implementationSnapshot(implementation)
    const contractDigest = digestOfSnapshot(contractShot)
    const implementationDigest = digestOfSnapshot(implementationShot)

    snapshots.set(contractDigest, servedSnapshot(contractShot))
    snapshots.set(implementationDigest, servedSnapshot(implementationShot))

    for (const file of servedFilesOf(source.folder, record)) {
      blobs.set(file.sha256, servedFileOf(REPOSITORY_ROOT, file.path, file.sha256))
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
        decidedOn: THE_PUBLICATION_INSTANT,
      })
    } else {
      ledger = publishImplementation(
        publishContract(ledger, {
          address: record.address,
          digest: contractDigest,
          publishedAt: THE_PUBLICATION_INSTANT,
          publishedFrom: THE_UNPUBLISHED_REVISION,
          standing: { lifecycle: record.lifecycle },
        }),
        {
          address: {
            contract: implementation.contract,
            id: implementation.id,
            version: THE_PUBLISHED_VERSION,
          },
          digest: implementationDigest,
          publishedAt: THE_PUBLICATION_INSTANT,
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
export const localSource = (servedFrom: string = THE_UNPUBLISHED_REVISION): RegistrySource => {
  const held = gather()

  return {
    contractIndex: async () => servedIndex(servedFrom, held.ledger, held.holdings),

    implementationBindings: async (address) =>
      held.ledger.implementations
        .filter((entry) => sameContract(entry.address.contract, address))
        .map((entry) => {
          const holding = held.holdings.find(
            (candidate) =>
              renderImplementation({
                contract: candidate.address,
                id: candidate.implementation.id,
                version: THE_PUBLISHED_VERSION,
              }) === renderImplementation(entry.address),
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

    refusals: async () => servedRefusals(servedFrom, held.ledger),

    snapshot: async (digest) => held.snapshots.get(digest) ?? null,

    blob: async (sha256) => {
      const bytes = held.blobs.get(sha256)

      return bytes === undefined ? null : servedBlob(bytes)
    },
  }
}
