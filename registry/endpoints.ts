/**
 * The endpoints, derived from `needs.ts`, and the indicative list of §6.2 checked against the result.
 *
 * The order is the point. The specification gives five endpoints and calls them indicative; this file
 * was written by starting from what the consumers have to do, and only then reading the five back. Had
 * it been written the other way, every difference below would have been an argument against the list
 * instead of a consequence of a need - and four of them would not have been found at all.
 *
 * ---------------------------------------------------------------------------
 * What the confrontation found
 * ---------------------------------------------------------------------------
 *
 * **The list has no content-addressed endpoint, so nothing it serves is verifiable.** That is the
 * whole of it in one line. Every one of its five entries is addressed by a name, a name resolves
 * through the registry, and a reader who fetches every one of them has checked nothing at all - they
 * have five documents the server chose to send. The two endpoints this unit adds underneath, and which
 * no entry anticipated, are the ones the arithmetic runs on.
 *
 * **One entry is refused.** `/contracts/{...}/harness` serves bytes that the contract snapshot already
 * lists by digest and the blob endpoint already serves. A second route to one byte string is a second
 * thing that can disagree with the first, and it would be the route with no digest of its own.
 *
 * **One entry cannot be addressed as written.** `/implementations/{id}@{version}` treats an
 * implementation id as globally unique; it is unique *within a contract*, frozen there, and
 * `ImplementationAddress` carries the contract for that reason. It is the same lesson `CLAUDE.md`
 * already records about a guard - *the registry schema must always carry the pair, never the
 * identifier alone* - arriving a second time at a second kind of address.
 *
 * **One entry mixes the two halves and has to be split.** The definition is frozen and the links are
 * not; `response.ts` says why one body may not carry both.
 *
 * **Three needs have no entry at all**: the methodology page, the refusals page, and attestations.
 *
 * ---------------------------------------------------------------------------
 * What is not here
 * ---------------------------------------------------------------------------
 *
 * No server, no framework, no routing. A `path` below is the shape of an address, written so that the
 * addressing class can be read off it, and not a route anything registers. Whether two of these
 * collapse into one request under HTTP/2, whether a harness arrives as an archive, and what a status
 * code is on a digest nobody holds are transport questions a deployment answers.
 *
 * The resolution of a dependency graph is deliberately *not* an endpoint, and that is a finding rather
 * than an omission - `RESOLUTION_IS_THE_CLIENT'S` below says why.
 */

import type { AddressingClass } from './response.js'
import { NEEDS } from './needs.js'

export type Endpoint = {
  /** Frozen, kebab-case, and the address a report or a deployment cites this endpoint by. */
  readonly id: string
  /** The shape of the address. `{...}` marks the part that varies. */
  readonly path: string
  readonly addressing: AddressingClass
  /** Which half of the registry the body comes from. Never both - `response.ts` says why. */
  readonly serves: 'the frozen half' | 'served bytes' | "the registry's current opinion"
  /** The needs of `needs.ts` this endpoint answers, by identifier. */
  readonly answers: readonly string[]
  /** What a reader can establish about this answer without believing the registry. */
  readonly whatAReaderCanCheck: string
}

export const ENDPOINTS: readonly Endpoint[] = [
  {
    id: 'snapshot',
    path: 'GET /snapshots/{digest}',
    addressing: 'content-addressed',
    serves: 'the frozen half',
    answers: [
      'render-a-contract-page',
      'pre-fill-the-playground',
      'recompute-a-digest-offline',
      'resolve-internal-dependencies',
      'install-a-shared-feature-once',
      'record-the-install-in-the-lockfile',
      'fetch-and-run-the-executable-harness',
    ],
    whatAReaderCanCheck:
      'everything. The body is the canonical text the digest was taken over, so re-canonicalising it ' +
      'and hashing reproduces the address it was fetched by, and the harness digests it names cover ' +
      'every file transitively.',
  },
  {
    id: 'blob',
    path: 'GET /blobs/{sha256}',
    addressing: 'content-addressed',
    serves: 'served bytes',
    answers: [
      'write-the-files-into-the-project',
      'show-a-readable-diff-per-feature',
      'fetch-and-run-the-executable-harness',
    ],
    whatAReaderCanCheck:
      'that these are the bytes the address names, by hashing them. Not what they do - reading that ' +
      'is what the harness is for.',
  },
  {
    id: 'contract-index',
    path: 'GET /contracts',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: ['search-on-names-and-aliases', 'search-with-an-alias-thesaurus'],
    whatAReaderCanCheck:
      'nothing. It is the registry saying what it holds, and an index that omitted a contract would ' +
      'be indistinguishable from a catalogue that never had it.',
  },
  {
    id: 'contract-binding',
    path: 'GET /contracts/{domain}/{name}@{major}',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: ['render-a-contract-page', 'compare-the-lockfile-with-the-registry'],
    whatAReaderCanCheck:
      'that the digest is well formed, and - once they have fetched it - that the snapshot behind it ' +
      'hashes to it. What they cannot check is that this digest is the one this name should resolve ' +
      'to, which is the registry\'s single load-bearing assertion.',
  },
  {
    id: 'implementation-bindings',
    path: 'GET /contracts/{domain}/{name}@{major}/implementations',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: [
      'fetch-a-named-or-default-implementation',
      'list-the-implementations-with-their-standing',
      'compare-the-lockfile-with-the-registry',
      'record-the-install-in-the-lockfile',
    ],
    whatAReaderCanCheck:
      'nothing here is checkable, and every field of it is an opinion: which implementation is the ' +
      'default, which was demoted, what a benchmark measured, what the registry tagged it. The ' +
      'addresses and digests it carries are checkable once they are fetched.',
  },
  {
    id: 'attestations',
    path: 'GET /attestations/{digest}',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: ['check-an-attestation-against-a-snapshot'],
    whatAReaderCanCheck:
      'that an attestation is about this digest and not another, which is the cheapest way to make ' +
      'an unsigned thing look signed; and then, with `cosign` and a policy of their own, the bundle ' +
      'itself. Not that the set is complete: a registry withholding an attestation is invisible.',
  },
  {
    id: 'refusals',
    path: 'GET /refusals',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: [
      'render-what-the-catalogue-refuses-and-why',
      'say-why-a-found-contract-cannot-be-installed',
    ],
    whatAReaderCanCheck:
      'nothing, and it is the page where that matters least: a refusal is an argument, published so ' +
      'that it can be disagreed with rather than so that it can be verified.',
  },
  {
    id: 'methodology',
    path: 'GET /methodology',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: ['render-the-methodology-page'],
    whatAReaderCanCheck:
      'nothing directly - but everything it lists is a check the reader can then run, which is the ' +
      'only endpoint here whose value is that it makes the others checkable.',
  },
]

// ---------------------------------------------------------------------------
// The indicative list of §6.2, verbatim, and what became of each entry
// ---------------------------------------------------------------------------

export type IndicativeVerdict =
  /** Survives as one endpoint, doing what it said. */
  | 'held'
  /** Carried the frozen half and the current opinion in one body, so it becomes two. */
  | 'split'
  /** Survives, at an address it could not have had: the one it was written with is not an address. */
  | 'readdressed'
  /** Is not an endpoint. What it served is answered by endpoints that exist for other reasons. */
  | 'refused'

export type IndicativeEntry = {
  /** The entry as §6.2 writes it. Transcribed, and the only transcribed thing in this file. */
  readonly entry: string
  readonly verdict: IndicativeVerdict
  readonly reason: string
  /** The endpoints above that answer what this entry served. Never empty. */
  readonly became: readonly string[]
}

export const THE_INDICATIVE_LIST: readonly IndicativeEntry[] = [
  {
    entry: 'GET /contracts - liste + recherche (nom, alias, domaine).',
    verdict: 'held',
    reason:
      'two consumers ask for exactly this and ask for nothing more of it. What it gains is a flag: a ' +
      'contract the catalogue refused must be findable - somebody searching for `groupBy` should be ' +
      'told it was considered and why - and must never be offered for installation.',
    became: ['contract-index'],
  },
  {
    entry:
      'GET /contracts/{domain}/{action}@{major} - definition, cas limites, signature, liens.',
    verdict: 'split',
    reason:
      'the definition, the edge cases and the signature are frozen; the links are what the registry ' +
      'says today. In one body a reader cannot hash what arrived without knowing which fields to ' +
      'strip first, and knowing that is knowing our projection - which they got from us. This is the ' +
      'entry the thesis of the unit is about.',
    became: ['contract-binding', 'snapshot'],
  },
  {
    entry: 'GET /contracts/{...}/harness - le harnais de tests public (executable).',
    verdict: 'refused',
    reason:
      'no need requires it. The contract snapshot already lists every harness file with its digest ' +
      'and its size, and the blob endpoint already serves those bytes - so this would be a second ' +
      'route to one byte string, and the one without a digest of its own. §6.2 separated the ' +
      'definition from the harness before the code/data frontier had a shape; `contract-record.ts` ' +
      'arrived at the same line from underneath and put the harness *inside* the record, as hashed ' +
      'files. Whether the bytes travel one at a time or in an archive is a transport question.',
    became: ['snapshot', 'blob'],
  },
  {
    entry: 'GET /contracts/{...}/implementations - la liste, avec benchs et metadonnees.',
    verdict: 'held',
    reason:
      'the list, the benchmarks and the metadata are all standing - which is what makes this one ' +
      'body legitimate where the definition was not. What it must not do is carry the files: those ' +
      'are frozen, and they travel by digest.',
    became: ['implementation-bindings'],
  },
  {
    entry:
      'GET /implementations/{id}@{version} - code source + fichiers + hash + dependances resolues.',
    verdict: 'readdressed',
    reason:
      'an implementation id is unique within its contract and frozen there, so this address does not ' +
      'name one thing - `reference@1.0.0` is carried by every contract in the catalogue. ' +
      '`ImplementationAddress` already carries the pair, for the reason `CLAUDE.md` records about ' +
      'guards: the schema must always carry the pair, never the identifier alone. What it serves ' +
      'also parts three ways - the binding is standing, the file list and the edges are frozen, and ' +
      'the source is bytes.',
    became: ['implementation-bindings', 'snapshot', 'blob'],
  },
]

/**
 * Endpoints no entry of the indicative list anticipated.
 *
 * Declared here and derived in `endpoints.test.ts`, as two statements that must coincide - the device
 * this repository runs on. Deriving it alone would leave nobody having said what the answer is
 * supposed to be, and a list that silently grew would read as a list that was checked.
 */
export const MISSING_FROM_THE_INDICATIVE_LIST: readonly string[] = [
  'attestations',
  'methodology',
  'refusals',
]

/**
 * Why serving a resolved dependency graph would be a step backwards, recorded because it is the one
 * place where this design refuses to do something the specification's wording invites.
 *
 * §6.2 lists `dependances resolues` as part of an implementation's answer. A resolution computed by
 * the registry is an assertion: the client receives a list and has no way to check it without walking
 * the graph itself. But walking it needs exactly the snapshots the client is already fetching - the
 * edges are frozen, inside the digest, in each implementation's own snapshot - so the walk costs
 * nothing extra and its result is verifiable where ours would not be.
 *
 * So `resolveDependencies` stays, and it belongs to the publishing tool: a registry that would not
 * *serve* a resolution still has to refuse publishing a broken graph.
 */
export const RESOLUTION_IS_THE_CLIENTS =
  'the edges are frozen inside each implementation snapshot, so a client that fetches the snapshots ' +
  'it needs anyway can resolve the graph itself and verify every step; a resolution computed here ' +
  'would be one more thing to believe, bought with nothing'

/** Every need identifier an endpoint claims to answer. */
export const ANSWERED_NEEDS = new Set(ENDPOINTS.flatMap((endpoint) => endpoint.answers))

/** Every need that says the API does not answer it, with its reason. */
export const NEEDS_ANSWERED_ELSEWHERE = NEEDS.filter(
  (need) => need.answeredWithoutTheApi !== undefined,
)
