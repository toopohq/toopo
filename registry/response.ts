/**
 * What the read API answers, and the rule that decides which half of the registry an answer comes
 * from.
 *
 * ---------------------------------------------------------------------------
 * The thesis of this unit, in one sentence
 * ---------------------------------------------------------------------------
 *
 * **If a response mixed the frozen half with the registry's current opinion, a client could no longer
 * recompute the digest without believing us about the projection. The separation is not a cache
 * convenience: it is what makes verification possible at all.**
 *
 * That sentence is the whole file. A snapshot is addressed by its digest and travels as the canonical
 * text that digest was taken over, verbatim - so a reader hashes what arrived and compares. Put one
 * mutable field in that body and the reader has to strip it before hashing; to strip it they must know
 * which fields to strip; and knowing that is knowing our projection, which they got from us. The
 * arithmetic that was independent of the server becomes a second implementation of the server's
 * opinion, and the only thing that made this distribution model trustworthy is gone.
 *
 * The cache consequence follows for free, which is the sign the cut is in the right place. A
 * content-addressed answer can be cached for ever by anything, because the address changes whenever
 * the bytes do. A named answer must be revalidated, because the name outlives what it points at. Mix
 * them and the whole body inherits the mutable class: the 32-50 kB records - measured over the five -
 * would be revalidated on every request, and worse, a CDN would be free to serve a *stale frozen half*
 * under a name whose binding had moved.
 *
 * ---------------------------------------------------------------------------
 * Three classes of answer, and nothing belongs to two
 * ---------------------------------------------------------------------------
 *
 *   snapshot  the canonical text of a frozen artefact, addressed by its digest.
 *   blob      the served bytes of one file, addressed by its digest.
 *   named     what the registry says today about an address: which digest it resolves to, what its
 *             standing is, what has been measured on it, what it is called.
 *
 * A contract page needs all three, and it makes three requests. That is not a cost imposed on the
 * site: it is the site being able to tell its reader which parts of the page they can check.
 *
 * ---------------------------------------------------------------------------
 * What is deliberately not here
 * ---------------------------------------------------------------------------
 *
 * No server, no framework, no routing, no transport. Which bytes go over which protocol under which
 * status code is a deployment decision and taking it now would be guessing, exactly as choosing an
 * object store would have been at the previous unit. What is designed is what an answer contains, what
 * it may not contain, and what a reader can do with it alone.
 */

import type { ContractAddress, ImplementationAddress } from './address.js'
import { renderContract, renderImplementation } from './address.js'
import type { Attestation } from './attestation.js'
import { DIGEST, canonical, digestOfBytes, servedBytes } from './canonical.js'
import type { Lifecycle } from './contract-record.js'
import type { BenchmarkFigure, ImplementationStatus } from './implementation-record.js'
import type {
  Ledger,
  PublishedContract,
  PublishedImplementation,
  RefusedContract,
  Snapshot,
} from './snapshot.js'
import { SNAPSHOT_FORMAT, digestOfSnapshot } from './snapshot.js'

// ---------------------------------------------------------------------------
// How an answer is addressed, and what that costs a cache
// ---------------------------------------------------------------------------

/**
 * The two ways an answer can be addressed, and the only property of a response the cache policy is
 * allowed to depend on.
 */
export type AddressingClass =
  /** The address is the digest of the answer. Two registries answering it answer the same bytes. */
  | 'content-addressed'
  /** The address is a name. What it resolves to is the registry's current opinion. */
  | 'named'

export type CachePolicy = {
  readonly immutable: boolean
  readonly maxAgeSeconds: number
  readonly mustRevalidate: boolean
  /** What makes this answer wrong, so that a deployment knows what it has to purge. */
  readonly staleWhen: string
}

/** A year, which is the longest `max-age` RFC 9111 recommends anyone rely on. */
const A_YEAR = 31_536_000

/**
 * Derived from the addressing class and from nothing else.
 *
 * A policy declared per endpoint would be a second statement about the same fact, and the first time
 * the two disagreed the disagreement would be a content-addressed answer that expires or a named one
 * that does not - the second of which is how a CDN serves a binding that has moved. There is one
 * decision here, it was taken by choosing how to address the answer, and this reads it back.
 */
export const cachePolicyFor = (addressing: AddressingClass): CachePolicy =>
  addressing === 'content-addressed'
    ? {
        immutable: true,
        maxAgeSeconds: A_YEAR,
        mustRevalidate: false,
        staleWhen:
          'never. The address is the digest of the answer, so different bytes are a different ' +
          'address and this entry is never wrong - it is only ever unused.',
      }
    : {
        immutable: false,
        maxAgeSeconds: 0,
        mustRevalidate: true,
        staleWhen:
          'a publication binds a new address, a standing changes, or a measurement arrives. All ' +
          'three are writes to the ledger, so a deployment purges on ledger writes and on nothing ' +
          'else.',
      }

// ---------------------------------------------------------------------------
// The content-addressed answers
// ---------------------------------------------------------------------------

/**
 * A frozen artefact, as the exact text its digest was taken over.
 *
 * The body is a string and not an object, and that is the load-bearing decision of this type. An
 * object would be re-serialised by whatever wrote the response, and every re-serialisation is a chance
 * to reorder a key, render a number differently or drop a field - after which the reader hashes
 * something else and the digest is wrong for a reason that has nothing to do with the contract. What
 * is served is the canonical text, and `canonical.ts` is the specification a reader in another
 * language implements to reproduce it.
 *
 * Nothing in it can be lost by JSON, because `value.ts` has already encoded the declarative half - the
 * negative zeros, the NaNs, the holes, the shared references. That is why a reader may parse this text
 * and re-canonicalise it rather than having to hash the octets it received, which is what lets a
 * response survive a transport that re-encodes it.
 */
export type ServedSnapshot = {
  readonly addressing: 'content-addressed'
  /** The digest this answer is addressed by. */
  readonly addressedBy: string
  readonly canonicalText: string
  /** The canonicalisation and projection the digest was taken under. Also inside the text. */
  readonly formatVersion: number
}

export const servedSnapshot = (snapshot: Snapshot): ServedSnapshot => ({
  addressing: 'content-addressed',
  addressedBy: digestOfSnapshot(snapshot),
  canonicalText: canonical(snapshot, 'snapshot'),
  formatVersion: snapshot.formatVersion,
})

/**
 * One file, as the bytes the registry serves - UTF-8, LF, no byte-order mark.
 *
 * The whole executable half of the catalogue travels this way: the harness a reader runs, the
 * reference an installation writes, the attestation bundle `cosign` verifies. None of it is modelled,
 * all of it is addressed.
 */
export type ServedBlob = {
  readonly addressing: 'content-addressed'
  readonly addressedBy: string
  readonly bytes: Buffer
}

export const servedBlob = (contents: Buffer): ServedBlob => {
  const bytes = servedBytes(contents)

  return { addressing: 'content-addressed', addressedBy: digestOfBytes(bytes), bytes }
}

// ---------------------------------------------------------------------------
// The named answers - everything the registry may change its mind about
// ---------------------------------------------------------------------------

/**
 * What a contract name resolves to today.
 *
 * It carries no part of the definition, and the guard in `response.test.ts` requires that in as many
 * words: the only field it shares with a frozen contract is the address it was asked about. Everything
 * else here is a fact about *this moment* - which digest the name points at, when that was bound, and
 * what the registry currently says about it.
 */
export type ServedContractBinding = {
  readonly addressing: 'named'
  readonly address: ContractAddress
  readonly digest: string
  readonly publishedAt: string
  readonly lifecycle: Lifecycle
}

export const servedContractBinding = (entry: PublishedContract): ServedContractBinding => ({
  addressing: 'named',
  address: entry.address,
  digest: entry.digest,
  publishedAt: entry.publishedAt,
  lifecycle: entry.standing.lifecycle,
})

/**
 * One implementation competing under a contract, as the registry sees it today.
 *
 * The benchmark figures are here rather than in the snapshot because they arrive against an artefact
 * that was published without them - there is no reference machine, so every one of these lists is
 * empty on all five, and the emptiness is the honest answer rather than a missing field.
 */
export type ServedImplementationBinding = {
  readonly addressing: 'named'
  readonly address: ImplementationAddress
  readonly digest: string
  readonly publishedAt: string
  readonly status: ImplementationStatus
  readonly benchmarks: readonly BenchmarkFigure[]
  readonly minifiedBytes: number | null
  readonly tags: readonly string[]
}

/**
 * The standing half of an implementation lives in two places today - `status` in the ledger entry,
 * and the rest on the record - so the projection takes both. That split is the storage unit's and is
 * not re-litigated here; what this unit adds is that all four travel together, because they change
 * together and a client that cached them apart would show a demoted implementation with the tags of
 * the default one.
 */
export const servedImplementationBinding = (
  entry: PublishedImplementation,
  standing: {
    readonly benchmarks: readonly BenchmarkFigure[]
    readonly minifiedBytes: number | null
    readonly tags: readonly string[]
  },
): ServedImplementationBinding => ({
  addressing: 'named',
  address: entry.address,
  digest: entry.digest,
  publishedAt: entry.publishedAt,
  status: entry.standing.status,
  benchmarks: standing.benchmarks,
  minifiedBytes: standing.minifiedBytes,
  tags: standing.tags,
})

/**
 * One row of the search index.
 *
 * Deliberately small. It is fetched before a query is answered, so anything in it is paid for by every
 * search - which is why the description, the cases and the profiles are not here and the summary is.
 *
 * `installable` is a field rather than a filter, and the difference matters: a refused contract must
 * still be findable, because somebody searching for `groupBy` should be told the catalogue considered
 * it and why, rather than being told nothing. What must never happen is offering to install it.
 */
export type ServedIndexEntry = {
  readonly address: ContractAddress
  readonly summary: string
  readonly searchAliases: readonly string[]
  /** `domain/name` split, because the site's navigation is built on the domain. */
  readonly domain: string
  readonly installable: boolean
}

export type ServedIndex = {
  readonly addressing: 'named'
  readonly entries: readonly ServedIndexEntry[]
}

/**
 * What the catalogue decided against, with the measurement it decided on.
 *
 * **This answer had no source until this unit asked for it, and finding that out is what deriving
 * endpoints from needs was for.** A `Ledger` holds published contracts and published implementations;
 * `array/group-by@1` was refused *before* publication, so it can never have a ledger entry, so the
 * site's "what we refuse and why" page had nothing to render. The catalogue's most-cited act of
 * honesty was the one thing the registry could not serve.
 */
export type ServedRefusal = {
  readonly address: ContractAddress
  readonly decidedAgainst: string
  readonly measurement: string
  readonly keptAs: string
  readonly decidedOn: string
}

export type ServedRefusals = {
  readonly addressing: 'named'
  readonly refusals: readonly ServedRefusal[]
  /**
   * Contracts that were published and later answered by the language. A different retirement from the
   * one above - these are frozen, still served, and still installable - and the page says both,
   * because collapsing them would either strand the first in a catalogue it was refused from or let
   * the second read as never having existed.
   */
  readonly absorbed: readonly ServedContractBinding[]
}

export type ServedAttestations = {
  readonly addressing: 'named'
  /** The snapshot these are about. Named here so the answer is self-describing when cached. */
  readonly subject: string
  readonly attestations: readonly Attestation[]
}

// ---------------------------------------------------------------------------
// Projections from the ledger
// ---------------------------------------------------------------------------

const domainOf = (name: string): string => name.slice(0, name.indexOf('/'))

/**
 * The index, built from the ledger and from each contract's identity.
 *
 * A contract with no ledger entry is refused rather than published, so it is in the index and is not
 * installable. Everything else is.
 */
export const servedIndex = (
  ledger: Ledger,
  identities: readonly {
    readonly address: ContractAddress
    readonly summary: string
    readonly searchAliases: readonly string[]
  }[],
): ServedIndex => {
  const published = new Set(ledger.contracts.map((entry) => renderContract(entry.address)))

  return {
    addressing: 'named',
    entries: identities.map((identity) => ({
      address: identity.address,
      summary: identity.summary,
      searchAliases: identity.searchAliases,
      domain: domainOf(identity.address.name),
      installable: published.has(renderContract(identity.address)),
    })),
  }
}

export const servedRefusals = (ledger: Ledger): ServedRefusals => ({
  addressing: 'named',
  refusals: ledger.refusals.map((entry: RefusedContract) => ({
    address: entry.address,
    decidedAgainst: entry.decidedAgainst,
    measurement: entry.measurement,
    keptAs: entry.keptAs,
    decidedOn: entry.decidedOn,
  })),
  absorbed: ledger.contracts
    .filter((entry) => entry.standing.lifecycle.state === 'absorbed-by-the-language')
    .map(servedContractBinding),
})

// ---------------------------------------------------------------------------
// What a reader does with an answer, provided rather than described
// ---------------------------------------------------------------------------

/**
 * Why a reader may not accept this snapshot as the one the address names. Empty when they may.
 *
 * It re-canonicalises the parsed text rather than hashing the octets that arrived, and that is
 * deliberate: a proxy that pretty-prints JSON would otherwise break a verification that is not about
 * it. Re-canonicalising is safe here and nowhere else, because the declarative half was encoded before
 * it was serialised - a `-0`, a NaN and an absent field all survive the round trip as themselves.
 *
 * A function rather than a paragraph, because "verify the digest" is exactly the step a consumer skips
 * when it is described instead of provided. `snapshotFaults` answers the same question one level down,
 * about a snapshot already in hand; this one answers it about bytes that just arrived.
 */
export const servedSnapshotFaults = (response: ServedSnapshot): readonly string[] => {
  if (!DIGEST.test(response.addressedBy)) {
    return [`"${response.addressedBy}" is not a sha-256 digest in lower-case hex`]
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(response.canonicalText)
  } catch {
    return ['the body is not JSON, so nothing can be recomputed from it']
  }

  const recomputed = digestOfBytes(Buffer.from(canonical(parsed, 'snapshot'), 'utf8'))

  return [
    ...(recomputed === response.addressedBy
      ? []
      : [`this body canonicalises to ${recomputed} and not to ${response.addressedBy}`]),
    ...(response.formatVersion === SNAPSHOT_FORMAT
      ? []
      : [
          `this snapshot was written under format ${response.formatVersion} and this reader ` +
            `canonicalises under ${SNAPSHOT_FORMAT}, so a digest computed here means nothing`,
        ]),
  ]
}

/**
 * The same question about a file. The bytes are normalised before hashing, for the reason
 * `canonical.ts` gives: the registry serves LF, a reader's git may hand them back CRLF, and a check
 * that failed for a whole operating system would be a check nobody kept.
 */
export const servedBlobFaults = (response: ServedBlob): readonly string[] => {
  const recomputed = digestOfBytes(servedBytes(response.bytes))

  return [
    ...(DIGEST.test(response.addressedBy)
      ? []
      : [`"${response.addressedBy}" is not a sha-256 digest in lower-case hex`]),
    ...(recomputed === response.addressedBy
      ? []
      : [`these bytes hash to ${recomputed} and not to ${response.addressedBy}`]),
  ]
}

/**
 * Whether a binding still points at what a lockfile recorded.
 *
 * The one check `toopo update` makes against the registry, and the reason a binding is one string: a
 * comparison of two digests answers "has this moved" without fetching either artefact, and a reader
 * that had to compare two documents could not tell a change from a re-serialisation.
 */
export const bindingHasMoved = (
  response: ServedImplementationBinding,
  recorded: { readonly address: ImplementationAddress; readonly digest: string },
): boolean =>
  renderImplementation(response.address) === renderImplementation(recorded.address) &&
  response.digest !== recorded.digest
