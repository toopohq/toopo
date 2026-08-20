/**
 * The endpoints, derived from `needs.ts`, and the indicative list of §6.2 checked against the result.
 * ADR-0052 is why an endpoint says what its answer is about, and the collision that decided it.
 *
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
 * Where an answer lives, and why the segment is the endpoint's own identifier
 * ---------------------------------------------------------------------------
 *
 * An address used to be written out per endpoint, as a `path` with `{...}` in it, and read by nothing.
 * It is derived now, from one field and three rules: **an answer about the catalogue lives at the
 * root, an answer about a contract lives in that contract's own directory, and an answer addressed by
 * content lives in a flat space of its own** - flat because the same bytes are named by several
 * contracts and a shared thing cannot live under one of its owners.
 *
 * The second rule is what makes an emitted tree possible at all. Under a `/contracts/{...}` prefix, a
 * contract's binding is a *file* at the very path its implementation list needs to be a *directory*,
 * and no filesystem holds both - which is the one class a static emission finds and a dynamic server
 * never meets. Putting each answer inside the contract's directory dissolves the prefix and the
 * collision at once, and it buys the thing the collision was hiding: **the address a reader opens and
 * the address the client asks are the same address**, so `/typescript/number/parse@1/` is the page and
 * every answer about that contract is a leaf beside it.
 *
 * The leaf is the endpoint's `id`, and not a name chosen to read well. That field is already declared
 * *the address a report or a deployment cites this endpoint by*, so a second spelling here would be
 * one thing with two names - the slug `packages/site/paths.ts` refuses for a page, arriving on an endpoint. The
 * price is `/snapshot/{digest}` where English would write the plural, and the return is that no table
 * of routes exists anywhere in this repository to drift from these identifiers.
 *
 * ---------------------------------------------------------------------------
 * What is not here
 * ---------------------------------------------------------------------------
 *
 * No server, no framework, no routing. `pathTo` is where an answer lives, not a route anything
 * registers; `askedAt` is its inverse, for whoever has a URL and nothing else. Whether two of these
 * collapse into one request under HTTP/2, whether a harness arrives as an archive, and what a status
 * code is on a digest nobody holds are transport questions a deployment answers.
 *
 * The resolution of a dependency graph is deliberately *not* an endpoint, and that is a finding rather
 * than an omission - `RESOLUTION_IS_THE_CLIENT'S` below says why.
 */

import type { AddressingClass } from './response.js'
import { IMPLEMENTATION_BINDING_NATURES, revisableFieldsOf } from './response.js'
import { NEEDS } from './needs.js'

/**
 * What an answer is about, which is the whole of what decides where it lives.
 *
 * Three members and not two: an answer addressed by content is shared - one blob is named by every
 * contract whose harness holds that file - so it cannot live inside any one contract's directory
 * without lying about whose it is.
 */
export type WhatAnAnswerIsAbout =
  /** The catalogue as a whole. It lives at the root, and it is asked for at no address. */
  | 'the catalogue'
  /** One contract. It lives in that contract's own directory, beside the contract's page. */
  | 'a contract'
  /** Whatever hashes to the digest it is asked for by. It lives in a flat space of its own. */
  | 'the content that addresses it'

export type Endpoint = {
  /** Frozen, kebab-case, and the address a report or a deployment cites this endpoint by. */
  readonly id: string
  /** What the answer is about, from which `pathTo` derives where it lives. */
  readonly about: WhatAnAnswerIsAbout
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
    about: 'the content that addresses it',
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
      'everything this repository writes. The body is the canonical text the digest was taken over, ' +
      'so re-canonicalising it and hashing reproduces the address it was fetched by, and between ' +
      '`harness` and `sharedHarness` the digests it names cover every file the harness imports, ' +
      'transitively - which `sharedHarnessOf` derives from the imports rather than from a list. What ' +
      'is outside it is the runner: `vitest` and `fast-check` are named by no digest here, so a ' +
      'reader reproduces the verdicts of this suite and not the behaviour of the tools that run it.',
  },
  {
    id: 'blob',
    about: 'the content that addresses it',
    addressing: 'content-addressed',
    serves: 'served bytes',
    answers: [
      'write-the-files-into-the-project',
      'show-a-readable-diff-per-feature',
      'fetch-and-run-the-executable-harness',
      'run-the-implementation-on-what-a-reader-types',
    ],
    whatAReaderCanCheck:
      'that these are the bytes the address names, by hashing them. Not what they do - reading that ' +
      'is what the harness is for.',
  },
  {
    id: 'contract-index',
    about: 'the catalogue',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: [
      'search-on-names-and-aliases',
      'search-with-an-alias-thesaurus',
      'list-the-whole-catalogue',
    ],
    whatAReaderCanCheck:
      'nothing. It is the registry saying what it holds, and an index that omitted a contract would ' +
      'be indistinguishable from a catalogue that never had it.',
  },
  {
    id: 'contract-binding',
    about: 'a contract',
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
    about: 'a contract',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: [
      'fetch-a-named-or-default-implementation',
      'list-the-implementations-with-their-standing',
      'compare-the-lockfile-with-the-registry',
      'record-the-install-in-the-lockfile',
    ],
    whatAReaderCanCheck:
      'that the digest of each entry is the one that address is bound to for life - not by fetching ' +
      'anything, but because a binding is made once and `publishImplementation` refuses to make it ' +
      'twice. What is the registry\'s opinion, and changeable without anything being wrong, is ' +
      `${revisableFieldsOf(IMPLEMENTATION_BINDING_NATURES).join(', ')}. So a reader may pin what ` +
      'they installed against this answer and be told the truth about it later; what they may not do ' +
      'is take the standing for a fact about the code.',
  },
  {
    id: 'attestations',
    about: 'the content that addresses it',
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
    about: 'the catalogue',
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
    about: 'the catalogue',
    addressing: 'named',
    serves: "the registry's current opinion",
    answers: ['render-the-methodology-page'],
    whatAReaderCanCheck:
      'nothing directly - but everything it lists is a check the reader can then run, which is the ' +
      'only endpoint here whose value is that it makes the others checkable.',
  },
]

// ---------------------------------------------------------------------------
// Where an answer lives
// ---------------------------------------------------------------------------

const BY_ID: ReadonlyMap<string, Endpoint> = new Map(
  ENDPOINTS.map((endpoint) => [endpoint.id, endpoint]),
)

export class NoSuchEndpoint extends Error {
  constructor(id: string) {
    super(
      `"${id}" is no endpoint of this registry (${[...BY_ID.keys()].join(', ')}), so nothing can ` +
        `say where its answer lives`,
    )
    this.name = 'NoSuchEndpoint'
  }
}

export const endpointOf = (id: string): Endpoint => {
  const endpoint = BY_ID.get(id)
  if (endpoint === undefined) throw new NoSuchEndpoint(id)

  return endpoint
}

/**
 * Where the answer to one question lives - as a URL path, and as a file path with the leading slash
 * taken off.
 *
 * **Total over `WhatAnAnswerIsAbout` by the compiler**, so an endpoint about something new does not
 * compile until somebody has said where its answers go. That is the whole mechanism: there is no table
 * of routes, and the three arms below are the only statement of an address this repository has.
 *
 * `address` is a rendered address - `renderContract` for a contract, a digest for content - and it is
 * interpolated rather than encoded, because every character `packages/registry/address.ts` can produce is legal
 * in a path segment and percent-encoding one would make a name no filesystem can hold. That is asserted
 * rather than assumed, in `endpoints.test.ts`, over every address this catalogue has.
 */
export const pathTo = (endpoint: Endpoint, address = ''): string => {
  switch (endpoint.about) {
    case 'the catalogue':
      return `/${endpoint.id}`
    case 'a contract':
      return `/${address}/${endpoint.id}`
    case 'the content that addresses it':
      return `/${endpoint.id}/${address}`
  }
}

/** The shape of an address, for a reader, with `{...}` where the address goes. */
export const pathShapeOf = (endpoint: Endpoint): string => pathTo(endpoint, '{...}')

/**
 * What an answer arrives as, derived from what it serves rather than declared beside it.
 *
 * One endpoint serves bytes and every other serves a document about them, so the exception is read off
 * `serves` and is not a table anybody maintains. Total over that union by the compiler, which is what
 * makes it the single statement of *a blob travels as its own octets and everything else as JSON* -
 * a sentence that used to live in the apparatus, where a static host could not read it.
 *
 * The octets are what a transport really does, and base64 is how the *archive* carries a blob because
 * an archive is one JSON file. Sending the bytes also puts the catalogue's lone surrogate on the wire
 * as itself, which is the one byte string a JSON round trip would quietly repair.
 */
export const contentTypeOf = (endpoint: Endpoint): string => {
  switch (endpoint.serves) {
    case 'served bytes':
      return 'application/octet-stream'
    case 'the frozen half':
    case "the registry's current opinion":
      return 'application/json'
  }
}

/** One question, as a URL names it. */
export type AskedAt = {
  readonly endpoint: Endpoint
  /** The rendered address, or `''` where the endpoint is about the catalogue and takes none. */
  readonly address: string
}

/**
 * Which question a URL asks, or `null` where it asks none. The inverse of `pathTo`, and checked as one.
 *
 * A server needs this and a static host does not, which is the asymmetry worth recording: an emitted
 * tree answers by *being* the file `pathTo` names, so nothing in front of it parses anything. This
 * exists for whoever puts the same answers behind a process.
 *
 * It cannot be ambiguous, and that is a property of the two vocabularies rather than a precaution: a
 * rendered contract address ends in `@<major>` and an endpoint identifier is kebab-case with no `@`,
 * so the last segment of a path is an endpoint's or an address's and never both.
 */
export const askedAt = (pathname: string): AskedAt | null => {
  const segments = pathname.split('/').filter((segment) => segment !== '')
  const first = segments[0]
  const last = segments[segments.length - 1]
  if (first === undefined || last === undefined) return null

  const named = BY_ID.get(last)
  if (segments.length === 1) {
    return named === undefined || named.about !== 'the catalogue' ? null : { endpoint: named, address: '' }
  }

  if (named?.about === 'a contract') {
    return { endpoint: named, address: segments.slice(0, -1).join('/') }
  }

  const leading = BY_ID.get(first)

  return leading === undefined || leading.about !== 'the content that addresses it'
    ? null
    : { endpoint: leading, address: segments.slice(1).join('/') }
}

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
 * **This sentence used to say *verify every step*, and it was false until an edge carried a digest.**
 * The edges were frozen and each one named an address, so the client had to ask `implementation-
 * bindings` which digest that address resolved to - a named answer, one per contract in the closure,
 * believed rather than checked. The walk was verifiable everywhere except at every edge of it.
 *
 * What is true now is smaller and is stated as what it is: one belief, at the root, and it is named
 * rather than counted. A reader has to trust that `imagined-number/round@1` resolves to the digest this
 * registry says it does - which is the registry's single load-bearing assertion, the one
 * `contract-binding` already declares and the one nothing can remove, because a name is what a person
 * types. Every step under it is arithmetic. That is a Merkle tree with one root of trust, which is the
 * shape an OCI manifest and Go's module graph already have, and it is what makes the claim honest
 * instead of ambitious.
 *
 * So `resolveDependencies` stays, and it belongs to the publishing tool: a registry that would not
 * *serve* a resolution still has to refuse publishing a broken graph.
 */
export const RESOLUTION_IS_THE_CLIENTS =
  'each implementation snapshot names its edges by digest, so a client that fetches the snapshots it ' +
  'needs anyway resolves the graph itself with one thing to believe: that the name it started from ' +
  'is bound to the digest this registry says it is. Every step below that root is checked by ' +
  'arithmetic, and a resolution computed here would put an unverifiable answer back where the ' +
  'digests removed one'

/** Every need identifier an endpoint claims to answer. */
export const ANSWERED_NEEDS = new Set(ENDPOINTS.flatMap((endpoint) => endpoint.answers))

/**
 * Why a client's port is not a port of this read API. Empty when it is, exactly and no more.
 *
 * A port belongs to its consumer - the installer's carries no `contract-binding` and the site's does,
 * and `packages/cli/source.ts` argues at length that this is a design and not an accident. What does *not*
 * belong to a consumer is the question of whether a port answers endpoints that exist, so it is asked
 * here rather than once per client. Two clients asking it identically is the catalogue's own bar for
 * sharing something; two clients holding different methods is why the ports themselves stay apart.
 *
 * `behind` is a client's statement of which endpoint each of its methods answers, total over the port
 * by construction: a method added without deciding what answers it does not compile. What that cannot
 * decide by itself is whether the identifier names an endpoint at all, and whether the object handed
 * round at run time is the port its type claims - which is the whole of what this adds.
 */
export const portFaults = (
  behind: Readonly<Record<string, string>>,
  source: Readonly<Record<string, unknown>>,
): readonly string[] => {
  const declared = Object.keys(behind).sort()
  const carried = Object.keys(source).sort()
  const known = new Set(ENDPOINTS.map((endpoint) => endpoint.id))

  return [
    ...declared
      .filter((method) => !carried.includes(method))
      .map((method) => `the source carries no \`${method}\`, which the port declares`),
    ...carried
      .filter((method) => !declared.includes(method))
      .map(
        (method) =>
          `the source carries \`${method}\`, which the port does not declare - a client reaching ` +
          `for it would be reaching past the read API`,
      ),
    ...Object.entries(behind)
      .filter(([, endpoint]) => !known.has(endpoint))
      .map(([method, endpoint]) => `\`${method}\` claims to answer "${endpoint}", which is no endpoint`),
  ]
}

/** Every need that says the API does not answer it, with its reason. */
export const NEEDS_ANSWERED_ELSEWHERE = NEEDS.filter(
  (need) => need.answeredWithoutTheApi !== undefined,
)
