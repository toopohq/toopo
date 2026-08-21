/**
 * This working tree, answering the whole read API, so that the tree a host serves can be written from
 * ADR-0052 is why this third reader of the-catalogue.ts exists beside the two clients' stand-ins.
 *
 * it.
 *
 * ---------------------------------------------------------------------------
 * The third reader of one source, and why it is not either client's
 * ---------------------------------------------------------------------------
 *
 * `packages/cli/local-source.ts` serves the harness of every contract and mints a version that lands in
 * somebody's `toopo.lock`; it carries no `contract-binding`, because an installer turns a name into an
 * address through the index and never needs the digest. `packages/site/local-source.ts` carries that binding and
 * the methodology, and serves one file per contract - the implementation a playground runs. **Neither
 * is the union, and neither should be**: a port belongs to its consumer, and those two consumers ask
 * for what they ask for.
 *
 * What this answers is not a consumer's slice at all. It is every question, because what it feeds
 * writes down every answer - and the closure proves that only if the thing being closed over holds
 * everything. The three are readers of one source: `the-catalogue.ts` is the only statement of what the
 * catalogue is, `serialiseContract` the only statement of how a folder becomes a record, and
 * `packages/registry/snapshot.ts` the only statement of what freezing one means. What differs between the three
 * is which questions they will be asked.
 *
 * ---------------------------------------------------------------------------
 * The frontier is unchanged, and this is the side of it the frontier is about
 * ---------------------------------------------------------------------------
 *
 * `packages/cli/source.ts` says serialising this working tree stands in for a publication that has not happened
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
import {
  REPOSITORY_ROOT,
  referenceImplementationOf,
  serialiseContract,
  servedFileOf,
  servedFilesOf,
} from './serialise.js'
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
import {
  THE_PUBLICATION_INSTANT,
  THE_PUBLISHED_IMPLEMENTATION_VERSION,
} from './publication.js'
import { THE_UNPUBLISHED_REVISION } from './revision.js'
import { theCatalogue } from './the-catalogue.js'
import { servedMethodology } from './verifiability.js'

/**
 * The version and the instant this registry binds at, read from the one place that declares them.
 *
 * **This module used to declare both itself, and that is the hole this closes.** Its copy of the
 * version was the one the emission reads - `packages/site/site.ts` builds the deployed tree from
 * `localReadApi`, so what is written here is what lands in a reader's `toopo.lock` - and it was the
 * only one of the three tied to nothing at all. A drift here announced a version this repository never
 * published, in somebody else's lockfile, with every guard green.
 *
 * The two stand-ins go on redeclaring it, because a client may not import another client and the
 * disagreement between two statements is what their guards read. This is not one of the two: it is the
 * registry, and the registry is where `publication.ts` says the version is minted - so it imports the
 * declaration rather than restating it, and there is no second statement here left to drift.
 */

/**
 * A publication, named by the commit that carried it out.
 *
 * **A commit cannot contain its own identifier, so the commit that mints a digest can never record
 * where it was minted.** Publishing and anchoring are two acts: `d3a5166` marked the first four
 * contracts published and bound their implementations at `1.0.0`, and the commit after it is the one
 * that could name it. That second commit moved no digest of its own - neither snapshot carries
 * anything from this module - so rebuilding `d3a5166` produces exactly what this tree produces for
 * those eight addresses, which is what makes a coordinate written afterwards a true statement rather
 * than a convenient one. ADR-0106.
 */
const THE_FIRST_PUBLICATION = 'd3a5166347cf334ee699097673ada179e8f06b60'

/**
 * The commit each published address was minted at, and the only transcriptions this file carries.
 *
 * **It was one constant until the day its own comment named.** That comment read *one constant for
 * eight bindings because one publication minted all eight; a catalogue that publishes a sixth
 * contract later anchors it at a different commit, and this becomes a map keyed by address - which is
 * a change this file should take on the day it happens and not before.* A second publication mints
 * its bindings at its own commit, and one string could only ever have answered for one of them.
 *
 * **An address this map does not hold falls back to `THE_UNPUBLISHED_REVISION`, and that is a door
 * rather than a default.** It is the state a contract stands in between the commit that publishes it
 * and the commit that can say where - the one window this repository cannot close, because no commit
 * names itself - and `nothing-this-tree-binds-escapes-the-freeze-check` is what refuses to let a tree
 * be pushed while standing in it.
 *
 * **They are transcribed and they are not trusted.** `packages/registry/against-what-was-published/`
 * checks each commit out, runs *its* `ledger` script and compares, so a coordinate naming the wrong
 * commit is a red rather than a note - measured, and the reds are in ADR-0107. ADR-0093 is why the
 * past is rebuilt rather than recorded, and ADR-0144 is the publication that made this a map.
 */
/**
 * The commit that published `number/round@1`, and the second publication this catalogue has had.
 *
 * It is the same shape as the first and for the same reason: that commit minted two addresses no
 * earlier commit binds, so it could not name itself, and this is the commit that can. It moves no
 * digest of its own - measured, the ledger is byte-identical either side - which is what makes a
 * coordinate written afterwards a true statement rather than a convenient one.
 *
 * **One commit sits between the two and it is not this coordinate's business.** `35d7115` corrected
 * four pins the replay disagreed with, and a pin is not in `contractSnapshot`'s frozen half: the
 * ledger it prints is byte-identical to the ledger `50ff990` prints, so rebuilding there still
 * produces what this tree produces. ADR-0144.
 */
const THE_SIXTH_CONTRACT = '50ff9906be9a00e033cb41b5443a3b5a08e96e8f'

const PUBLISHED_FROM: Readonly<Record<string, string | undefined>> = {
  'typescript/number/parse@1': THE_FIRST_PUBLICATION,
  'typescript/date/add@1': THE_FIRST_PUBLICATION,
  'typescript/string/levenshtein@1': THE_FIRST_PUBLICATION,
  'typescript/string/slugify@1': THE_FIRST_PUBLICATION,
  'typescript/number/round@1': THE_SIXTH_CONTRACT,
}

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

  for (const source of theCatalogue) {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const implementation: ImplementationRecord = {
      ...referenceImplementationOf(REPOSITORY_ROOT, source),
      version: THE_PUBLISHED_IMPLEMENTATION_VERSION,
    }

    const contractShot = contractSnapshot(record)
    const implementationShot = implementationSnapshot(implementation)
    const publishedFrom = PUBLISHED_FROM[renderContract(record.address)] ?? THE_UNPUBLISHED_REVISION

    snapshots.set(digestOfSnapshot(contractShot), servedSnapshot(contractShot))
    snapshots.set(digestOfSnapshot(implementationShot), servedSnapshot(implementationShot))

    for (const file of servedFilesOf(source.folder, record)) {
      blobs.set(file.sha256, servedBlob(servedFileOf(REPOSITORY_ROOT, file.path, file.sha256)))
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
          digest: digestOfSnapshot(contractShot),
          publishedAt: THE_PUBLICATION_INSTANT,
          publishedFrom,
          standing: {
            lifecycle: record.lifecycle,
            ...(record.useCases === undefined ? {} : { useCases: record.useCases }),
            ...(record.againstTheLanguage === undefined
              ? {}
              : { againstTheLanguage: record.againstTheLanguage }),
          },
        }),
        {
          address: {
            contract: record.address,
            id: implementation.id,
            version: THE_PUBLISHED_IMPLEMENTATION_VERSION,
          },
          digest: digestOfSnapshot(implementationShot),
          publishedAt: THE_PUBLICATION_INSTANT,
          publishedFrom,
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
 * What this working tree binds, as the ledger rather than as answers about it.
 *
 * The read API serves a binding's digest and not the commit it was published from, which is the field
 * ADR-0093 adds and deliberately leaves unserved - two revision-shaped fields on one named answer is
 * one a reader would confuse. So the freeze check asks the ledger directly, and this is the one thing
 * of `gather()` that leaves this module.
 */
export const theLocalLedger = (): Ledger => gather().ledger

/**
 * This working tree, as the registry that serves it. Built lazily and once.
 *
 * **`servedFrom` defaults to the unpublished revision rather than being required, and the omission it
 * leaves open is closed where it would happen.** A stand-in stands in for a publication that has not
 * taken place, so forty zeros is its honest answer and every guard here wants exactly that. The one
 * caller for which the default would be a lie is the emission, which is a single file - and
 * `the-emitted-tree-names-the-revision-it-was-built-from` reddens there rather than asking fifty guards
 * to pass a constant they have no opinion about.
 */
export const localReadApi = (servedFrom: string = THE_UNPUBLISHED_REVISION): ReadApi => {
  const held = gather()

  const holdingFor = (address: ContractAddress): Holding => {
    const holding = held.holdings.find((candidate) => sameContract(candidate.address, address))
    if (holding === undefined) {
      throw new Error(`${renderContract(address)} has a ledger entry and no record behind it`)
    }

    return holding
  }

  return {
    contractIndex: () => servedIndex(servedFrom, held.ledger, held.holdings),

    contractBinding: (address) => {
      const entry = held.ledger.contracts.find((candidate) => sameContract(candidate.address, address))

      return entry === undefined ? null : servedContractBinding(servedFrom, entry)
    },

    implementationBindings: (address) =>
      held.ledger.implementations
        .filter((entry) => sameContract(entry.address.contract, address))
        .map((entry) => {
          const { implementation } = holdingFor(entry.address.contract)

          return servedImplementationBinding(servedFrom, entry, {
            benchmarks: implementation.benchmarks,
            minifiedBytes: implementation.minifiedBytes,
            tags: implementation.tags,
          })
        }),

    refusals: () => servedRefusals(servedFrom, held.ledger),

    methodology: () => servedMethodology(servedFrom),

    snapshot: (digest) => held.snapshots.get(digest) ?? null,

    blob: (sha256) => held.blobs.get(sha256) ?? null,
  }
}
