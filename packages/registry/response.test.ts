import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import * as groupBy from '../../contracts/typescript/array/group-by/contract.js'
import { canonical, digestOfBytes } from './canonical.js'
import { endpointOf } from './endpoints.js'
import { FIELD_MAP, pathsIn } from './field-map.js'
import { localReadApi } from './local-read-api.js'
import type { ReadApi } from './read-api.js'
import { THE_ENDPOINT_BEHIND } from './read-api.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract } from './serialise.js'
import type { CachePolicy } from './response.js'
import {
  CONTRACT_BINDING_NATURES,
  IMPLEMENTATION_BINDING_NATURES,
  bindingHasMoved,
  cacheControlOf,
  cachePolicyFor,
  revisableFieldsOf,
  servedBlob,
  servedBlobFaults,
  servedContractBinding,
  servedImplementationBinding,
  servedExportsOf,
  servedIndex,
  servedRefusals,
  servedSnapshot,
  servedSnapshotFaults,
} from './response.js'
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
import { eachContract, theCatalogue } from './the-catalogue.js'

/**
 * The response shapes, built from the five and checked on them.
 *
 * Two questions run through this file. Can a reader establish, from an answer alone, that it is the
 * answer the address names - which is what the content-addressed half exists for. And is the frozen
 * half kept out of every named answer - which is what makes the first question answerable at all.
 */

const PUBLISHED_AT = '2026-08-03T00:00:00.000Z'

/** A revision these answers are pretended to have been served from. Not this repository's. */
const SERVED_FROM = 'f'.repeat(40)

/**
 * The commit these bindings are pretended to have been published from, and deliberately not
 * `SERVED_FROM`. Two revision-shaped fields travel through this file - one about the answer, one
 * about the artefact - and giving them one value would let a projection that confused them pass.
 */
const PUBLISHED_FROM = 'a'.repeat(40)

/**
 * A ledger holding the catalogue as it would be published: the four that are not yet published, and
 * the one that was refused, from its own `catalogueAdmission` rather than from a sentence written
 * here.
 */
const theCatalogueAsALedger = (): Ledger => {
  const refused = theCatalogue.filter((source) => source.lifecycle.state === 'never-published')
  const published = theCatalogue.filter((source) => source.lifecycle.state !== 'never-published')

  const withRefusals = refused.reduce(
    (ledger, source) =>
      refuseContract(ledger, {
        address: source.address,
        decidedAgainst: groupBy.catalogueAdmission.decidedAgainst,
        measurement: groupBy.catalogueAdmission.measurement,
        keptAs: groupBy.catalogueAdmission.keptAs,
        decidedOn: PUBLISHED_AT,
      }),
    EMPTY_LEDGER,
  )

  return published.reduce((ledger, source) => {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)

    return publishImplementation(
      publishContract(ledger, {
        address: source.address,
        digest: digestOfSnapshot(contractSnapshot(record)),
        publishedAt: PUBLISHED_AT,
        publishedFrom: PUBLISHED_FROM,
        standing: { lifecycle: { state: 'published' } },
      }),
      {
        address: { contract: source.address, id: implementation.id, version: '1.0.0' },
        digest: digestOfSnapshot(implementationSnapshot(implementation)),
        publishedAt: PUBLISHED_AT,
        publishedFrom: PUBLISHED_FROM,
        standing: { status: 'default' },
      },
    )
  }, withRefusals)
}

/** The index over the whole catalogue, built the way the local source builds it. */
const theServedIndex = () =>
  servedIndex(
    SERVED_FROM,
    theCatalogueAsALedger(),
    theCatalogue.map((source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)

      return {
        address: record.address,
        summary: record.identity.summary,
        searchAliases: record.identity.searchAliases,
        exports: servedExportsOf(record.surface.exports),
      }
    }),
  )

describe('a content-addressed answer carries its own proof', () => {
  it.each(eachContract)('a-snapshot-answer-hashes-to-its-address-%s', (_name, source) => {
    const response = servedSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, source)))

    expect(servedSnapshotFaults(response)).toEqual([])
  })

  /**
   * The server's half of the bargain, and it needed its own guard.
   *
   * `servedSnapshotFaults` re-canonicalises before hashing, so a proxy that pretty-prints does not
   * break a verification which is not about it. Measured: with that robustness in place, a registry
   * serving `JSON.stringify(snapshot)` instead of the canonical text passes every other guard in this
   * file. It is not harmless. The cheapest check anybody will ever run is `sha256` over the response
   * body - `curl ... | sha256sum` - and it works only if the body *is* the canonical text.
   *
   * So both halves are required and neither substitutes for the other: the registry serves canonical
   * bytes, and the reader re-canonicalises anyway.
   */
  it.each(eachContract)('the-body-served-is-already-canonical-%s', (_name, source) => {
    const response = servedSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, source)))

    expect(response.canonicalText).toBe(canonical(JSON.parse(response.canonicalText), 'snapshot'))
    expect(digestOfBytes(Buffer.from(response.canonicalText, 'utf8'))).toBe(response.addressedBy)
  })

  /**
   * The real failure condition, and the reason this check is a function rather than a paragraph: a
   * body that was altered anywhere at all stops hashing to the address it arrived under.
   */
  it('a-snapshot-answer-that-was-altered-is-refused', () => {
    const source = theCatalogue[0]
    if (source === undefined) throw new Error('the five are not five')

    const response = servedSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, source)))
    const altered = {
      ...response,
      canonicalText: response.canonicalText.replace('"typescript"', '"typescrypt"'),
    }

    expect(servedSnapshotFaults(altered)).toHaveLength(1)
    expect(servedSnapshotFaults({ ...response, addressedBy: 'not-a-digest' })).toHaveLength(1)
  })

  /**
   * A body that arrived re-encoded still verifies, and that is deliberate: the reader re-canonicalises
   * before hashing, so a proxy that pretty-prints JSON does not break a verification which is not
   * about it. It is only safe because the declarative half was encoded before it was serialised.
   */
  it('a-snapshot-answer-survives-a-transport-that-re-encodes-it', () => {
    const source = theCatalogue[0]
    if (source === undefined) throw new Error('the five are not five')

    const response = servedSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, source)))
    const prettyPrinted = {
      ...response,
      canonicalText: JSON.stringify(JSON.parse(response.canonicalText), null, 2),
    }

    expect(prettyPrinted.canonicalText).not.toBe(response.canonicalText)
    expect(servedSnapshotFaults(prettyPrinted)).toEqual([])
  })

  it('a-snapshot-answer-under-another-format-version-means-nothing-here', () => {
    const source = theCatalogue[0]
    if (source === undefined) throw new Error('the five are not five')

    const snapshot = contractSnapshot(serialiseContract(REPOSITORY_ROOT, source))
    const later = servedSnapshot({ ...snapshot, formatVersion: snapshot.formatVersion + 1 })

    expect(servedSnapshotFaults(later)).toHaveLength(1)
  })

  it.each(eachContract)('a-blob-answer-hashes-to-its-address-%s', (_name, source) => {
    const record = serialiseContract(REPOSITORY_ROOT, source)

    const faults = record.harness.flatMap((file) => {
      const response = servedBlob(readFileSync(join(REPOSITORY_ROOT, source.folder, file.path)))

      return [
        ...servedBlobFaults(response),
        ...(response.addressedBy === file.sha256
          ? []
          : [`${file.path} is served under ${response.addressedBy} and listed as ${file.sha256}`]),
      ]
    })

    expect(faults).toEqual([])
  })

  it('a-blob-answer-with-one-byte-changed-is-refused', () => {
    const response = servedBlob(Buffer.from('export const one = 1\n', 'utf8'))

    expect(servedBlobFaults(response)).toEqual([])
    expect(
      servedBlobFaults({ ...response, bytes: Buffer.from('export const one = 2\n', 'utf8') }),
    ).toHaveLength(1)
  })

  /**
   * The registry serves LF, and a reader whose transport handed back CRLF must not be told their whole
   * platform modified the file. `canonical.ts` takes this decision for the CLI; this is the same
   * decision for a response, and it is the one place where a check deliberately repairs before it
   * compares.
   */
  it('a-blob-answer-that-arrived-with-crlf-still-verifies', () => {
    const response = servedBlob(Buffer.from('const a = 1\nconst b = 2\n', 'utf8'))
    const mangled = { ...response, bytes: Buffer.from('const a = 1\r\nconst b = 2\r\n', 'utf8') }

    expect(servedBlobFaults(mangled)).toEqual([])
  })
})

describe('a named answer carries no part of the frozen half', () => {
  /**
   * The thesis of the unit, as a guard over the shapes rather than over a sentence. A named answer
   * that carried one frozen field would force a reader to strip it before hashing, and knowing what to
   * strip is knowing the projection - which they would have got from the same server.
   */
  it.each(eachContract)('a-contract-binding-carries-only-the-address-%s', (_name, source) => {
    const record = serialiseContract(REPOSITORY_ROOT, source)
    const snapshot = contractSnapshot(record)
    const binding = servedContractBinding(SERVED_FROM, {
      address: source.address,
      digest: digestOfSnapshot(snapshot),
      publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
      standing: { lifecycle: { state: 'published' } },
    })

    const shared = Object.keys(binding).filter((key) => key in snapshot.frozen)

    expect(shared).toEqual(['address'])
  })

  it.each(eachContract)('an-implementation-binding-carries-no-frozen-field-%s', (_name, source) => {
    const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)
    const snapshot = implementationSnapshot(implementation)
    const binding = servedImplementationBinding(
      SERVED_FROM,
      {
        address: { contract: source.address, id: implementation.id, version: '1.0.0' },
        digest: digestOfSnapshot(snapshot),
        publishedAt: PUBLISHED_AT,
        publishedFrom: PUBLISHED_FROM,
        standing: { status: 'default' },
      },
      implementation,
    )

    expect(Object.keys(binding).filter((key) => key in snapshot.frozen)).toEqual([])
    // The files and the edges are the frozen half, and a binding that carried them would be the
    // definition arriving through a door with no digest on it.
    expect('files' in binding).toBe(false)
    expect('dependsOn' in binding).toBe(false)
  })
})

describe('which registry answered, and where that may be written down', () => {
  /**
   * Every named answer says which revision produced it, and the list is read off the endpoints rather
   * than written here.
   *
   * A sixth named answer added without a revision is what this refuses, and the two statements it
   * compares are independent: `ENDPOINTS` says which answers are named, and the port says what each one
   * returns. A list of five method names would have been the third statement, green for exactly the one
   * nobody added it to.
   */
  it('every-named-answer-names-the-revision-it-was-served-from', () => {
    const registry = localReadApi(SERVED_FROM)
    const named = Object.entries(THE_ENDPOINT_BEHIND).filter(
      ([, endpoint]) => endpointOf(endpoint).addressing === 'named',
    )

    const answers = named.flatMap(([method]) => {
      const answer = registry[method as keyof ReadApi](theCatalogue[0]?.address as never)

      return (Array.isArray(answer) ? answer : [answer])
        .filter((one): one is { readonly servedFrom?: unknown } => one !== null)
        .map((one) => [method, one.servedFrom] as const)
    })

    expect([...new Set(answers.map(([method]) => method))].sort()).toEqual(
      named.map(([method]) => method).sort(),
    )
    expect(answers.filter(([, servedFrom]) => servedFrom !== SERVED_FROM)).toEqual([])
  })

  /**
   * **The trap this unit is about, made executable.**
   *
   * `ServedSnapshot` and `ServedBlob` are envelopes: the digest is taken over `canonicalText`, not over
   * the body that carries it, so a revision added to either would move no digest and every guard in
   * the file above would stay green. What forbids it is the cache policy - a content-addressed answer
   * promises `immutable` for a year on the grounds that different bytes are a different address - and a
   * promise is not a guard.
   *
   * So the claim is measured as the promise itself: **the bytes of a content-addressed answer are a
   * function of its address and of nothing else.** Two registries over one working tree at two
   * revisions answer one digest, and the two answers have to be the same byte string. A revision
   * dropped into either envelope makes them differ, and reddens here.
   *
   * The last assertion is the control, and without it this guard would pass on a registry where the
   * revision reached nothing at all. ADR-0090 is the argument.
   */
  it('a-content-addressed-answer-is-the-same-bytes-at-every-revision', () => {
    const one = localReadApi('a'.repeat(40))
    const other = localReadApi('b'.repeat(40))

    const binding = one.implementationBindings(theCatalogue[0]?.address as never)[0]
    if (binding === undefined) throw new Error('the first of the five publishes no implementation')

    const snapshot = one.snapshot(binding.digest)
    const file = JSON.parse(snapshot?.canonicalText ?? '{}').frozen.files[0] as {
      readonly sha256: string
    }

    expect(JSON.stringify(other.snapshot(binding.digest))).toBe(JSON.stringify(snapshot))
    expect(other.blob(file.sha256)?.bytes.equals(one.blob(file.sha256)?.bytes as Buffer)).toBe(true)

    expect(JSON.stringify(other.contractIndex())).not.toBe(JSON.stringify(one.contractIndex()))
  })

  /**
   * The revision is not the registry's opinion, and `revisableFieldsOf` is where saying so would go
   * wrong.
   *
   * That list is rendered into what `implementation-bindings` publishes as *the registry's opinion,
   * changeable without anything being wrong* - beside a sentence telling a reader not to take it for a
   * fact about the code. The revision is the one field of a named answer that is a fact, and the one a
   * lockfile keeps in order to go back to it.
   */
  it('the-revision-is-not-published-as-an-opinion', () => {
    expect(revisableFieldsOf(IMPLEMENTATION_BINDING_NATURES)).not.toContain('servedFrom')
    expect(IMPLEMENTATION_BINDING_NATURES.servedFrom).toBe('the-registry-that-answered')
    expect(CONTRACT_BINDING_NATURES.servedFrom).toBe('the-registry-that-answered')
  })

  /**
   * The cache policy said the named half goes stale on ledger writes *and on nothing else*, which
   * carrying a revision made false: a commit touching no ledger entry changes every named body. A
   * deployment reading the old sentence would purge too rarely.
   *
   * Derived from what moves rather than asserted about the wording: two indices over one ledger, at two
   * revisions, are two documents - so *a write to the ledger* cannot be the whole of what makes one
   * stale.
   */
  it('a-named-answer-moves-when-the-revision-does-and-the-policy-says-so', () => {
    const ledger = theCatalogueAsALedger()
    const identities = theCatalogue.map((source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)

      return {
        address: record.address,
        summary: record.identity.summary,
        searchAliases: record.identity.searchAliases,
        exports: servedExportsOf(record.surface.exports),
      }
    })

    expect(canonical(servedIndex(SERVED_FROM, ledger, identities), 'index')).not.toBe(
      canonical(servedIndex('a'.repeat(40), ledger, identities), 'index'),
    )
    expect(cachePolicyFor('named').staleWhen).toContain('revision')
  })
})

/**
 * The policy, as the header a host actually sends.
 *
 * **The two strings below are written out here on purpose, and it is the one place in this file where
 * that is right.** Everything else about a cache is derived from `cachePolicyFor`; if this guard were
 * derived from it too, both sides would move together and nothing could ever be red - the shape
 * ADR-0087 names, arriving where deriving would have looked tidier. So the guard states what RFC 9111
 * spells and the implementation has to come to it.
 */
describe('the declared policy is the header that is served', () => {
  it('a-content-addressed-answer-is-public-for-a-year-and-immutable', () => {
    expect(cacheControlOf(cachePolicyFor('content-addressed'))).toBe(
      'public, max-age=31536000, immutable',
    )
  })

  it('a-named-answer-is-public-and-revalidated-before-every-use', () => {
    expect(cacheControlOf(cachePolicyFor('named'))).toBe('public, max-age=0, must-revalidate')
  })

  /**
   * Which fields of the policy reach the header, asked by perturbing each one and watching the string.
   *
   * It is what stops the two guards above from being satisfied by a function that switches on the
   * addressing class and returns a literal: such a function passes both, and fails here on all three
   * directives at once. Keyed by `keyof CachePolicy` on both sides, so a fourth directive does not
   * compile until somebody has said whether it is served - ADR-0055's shape on the type that decides
   * what a year-long cache entry promises.
   *
   * `staleWhen` is the one that must *not* move it, and that is the assertion rather than an omission:
   * it is prose telling a deployment what to purge, and a sentence in a `Cache-Control` header is not
   * a directive any cache reads.
   */
  it('every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not', () => {
    const base = cachePolicyFor('named')
    const perturbed: Readonly<Record<keyof CachePolicy, CachePolicy>> = {
      maxAgeSeconds: { ...base, maxAgeSeconds: base.maxAgeSeconds + 60 },
      mustRevalidate: { ...base, mustRevalidate: !base.mustRevalidate },
      immutable: { ...base, immutable: !base.immutable },
      staleWhen: { ...base, staleWhen: `${base.staleWhen} and on a blue moon` },
    }
    const moves = Object.fromEntries(
      Object.entries(perturbed).map(([field, policy]) => [
        field,
        cacheControlOf(policy) !== cacheControlOf(base),
      ]),
    )

    expect(moves).toEqual({
      maxAgeSeconds: true,
      mustRevalidate: true,
      immutable: true,
      staleWhen: false,
    })
  })
})

describe('what a snapshot answer is allowed to contain', () => {
  /**
   * Every field a snapshot serves is one the field map classifies, which is what stops a private field
   * from reaching a reader through the endpoint nobody thought of. §8 keeps the adversarial corpus,
   * the seeds and the volumes of official runs off every public answer, and none of them is a field of
   * anything served here.
   */
  it.each(eachContract)('every-field-a-snapshot-serves-is-classified-%s', (_name, source) => {
    const snapshot = contractSnapshot(serialiseContract(REPOSITORY_ROOT, source))
    const paths = new Set<string>()
    pathsIn(snapshot.frozen, '', paths)

    const unclassified = [...paths].filter((path) => FIELD_MAP[path] === undefined).sort()

    expect(unclassified).toEqual([])
  })

  it.each(eachContract)('no-private-field-reaches-a-snapshot-answer-%s', (_name, source) => {
    const snapshot = contractSnapshot(serialiseContract(REPOSITORY_ROOT, source))
    const paths = new Set<string>()
    pathsIn(snapshot.frozen, '', paths)

    expect([...paths].filter((path) => FIELD_MAP[path]?.visibility === 'private')).toEqual([])
  })
})

describe('the index, the refusals, and what update compares', () => {
  /**
   * A refused contract is findable and is not installable, and both halves matter. Hiding it would
   * leave somebody searching for `groupBy` told nothing; offering it would offer an installation of
   * something the catalogue's own page says it turned down.
   */
  it('a-refused-contract-is-findable-and-not-installable', () => {
    const index = theServedIndex()

    const groupByEntry = index.entries.find((entry) => entry.address.name === 'array/group-by')

    expect(groupByEntry?.installable).toBe(false)
    expect(groupByEntry?.domain).toBe('array')
    expect(index.entries.filter((entry) => entry.installable)).toHaveLength(5)
    expect(index.entries.every((entry) => entry.searchAliases.length > 0)).toBe(true)
  })

  /**
   * The index carries the names a caller writes, because `toopo add` has to print an import line and
   * an export name is not derivable from an address - `number/parse` exports `parseNumber`.
   *
   * The answer comes first and the diagnostic after it, which is the order the printed line uses; and
   * the answer is the export the identity names, which `against-the-catalogue.test.ts` holds one level down.
   */
  it('the-index-names-what-a-caller-imports', () => {
    const index = theServedIndex()
    const named = Object.fromEntries(
      index.entries.map((entry) => [entry.address.name, entry.exports.map((held) => held.name)]),
    )

    expect(named).toEqual({
      'array/group-by': ['groupBy'],
      'date/add': ['addToDate', 'describeAddFailure'],
      'number/parse': ['parseNumber', 'describeParseFailure'],
      'string/levenshtein': ['levenshtein'],
      'string/slugify': ['slugify'],
      'number/round': ['round', 'describeRoundFailure'],
    })
    expect(
      index.entries.every((entry) => entry.exports[0]?.role === 'the-answer'),
    ).toBe(true)
  })

  /**
   * The claim this type makes about itself, held to a number. `exports` was added by a consumer that
   * could not name what it had installed, and a row nobody measured is how "deliberately small"
   * becomes a sentence rather than a constraint.
   *
   * The figures moved from 2 731 and 3 106 when the alias review took eight phrases out of the five
   * contracts, which is 137 bytes off the one document every search pays for. They moved again by 56
   * when a named answer began naming the revision it was served from - a field of the document rather
   * than of an entry, so it is paid once whatever the catalogue grows to. `added` did not move either
   * time, and that is the number this guard is actually about: what carrying the export names costs is
   * a property of the names and not of how much else the entry happens to hold.
   */
  it('the-index-stays-the-smallest-thing-the-registry-serves', () => {
    const index = theServedIndex()
    const withoutExports = {
      ...index,
      entries: index.entries.map(({ exports: _exports, ...rest }) => rest),
    }

    const grown = canonical(index, 'index').length
    const before = canonical(withoutExports, 'index').length

    expect({ before, grown, added: grown - before }).toEqual({
      before: 3070,
      grown: 3550,
      added: 480,
    })
  })

  /**
   * The page that had no source until this unit asked for it. `array/group-by@1` was decided against
   * before publication, so it can never have a ledger binding - and without the third list the
   * catalogue's most-cited act of honesty was the one thing it could not serve.
   */
  it('the-refusals-page-has-a-source :: and it is the contract own admission', () => {
    const refusals = servedRefusals(SERVED_FROM, theCatalogueAsALedger())

    expect(refusals.refusals.map((entry) => entry.address.name)).toEqual(['array/group-by'])
    expect(refusals.refusals[0]?.measurement).toBe(groupBy.catalogueAdmission.measurement)
    expect(refusals.refusals[0]?.keptAs).toBe(groupBy.catalogueAdmission.keptAs)
    expect(refusals.absorbed).toEqual([])
  })

  it('a-contract-is-refused-or-published-and-never-both', () => {
    const ledger = theCatalogueAsALedger()
    const numberParse = theCatalogue[0]
    if (numberParse === undefined) throw new Error('the five are not five')

    expect(() =>
      refuseContract(ledger, {
        address: numberParse.address,
        decidedAgainst: 'a decision nobody took',
        measurement: 'none',
        keptAs: 'nothing',
        decidedOn: PUBLISHED_AT,
      }),
    ).toThrow(/has already been published/)

    expect(() =>
      publishContract(ledger, {
        address: { language: 'typescript', name: 'array/group-by', major: 1 },
        digest: 'a'.repeat(64),
        publishedAt: PUBLISHED_AT,
        publishedFrom: PUBLISHED_FROM,
        standing: { lifecycle: { state: 'published' } },
      }),
    ).not.toThrow()
  })

  /**
   * The single comparison `toopo update` makes against the registry: two digests, not two documents.
   * A comparison of documents could not tell a change from a re-serialisation.
   */
  it('update-compares-two-digests-and-nothing-else', () => {
    const source = theCatalogue[0]
    if (source === undefined) throw new Error('the five are not five')

    const implementation = referenceImplementationOf(REPOSITORY_ROOT, source)
    const address = { contract: source.address, id: implementation.id, version: '1.0.0' }
    const digest = digestOfSnapshot(implementationSnapshot(implementation))
    const binding = servedImplementationBinding(
      SERVED_FROM,
      {
        address,
        digest,
        publishedAt: PUBLISHED_AT,
        publishedFrom: PUBLISHED_FROM,
        standing: { status: 'default' },
      },
      implementation,
    )

    expect(bindingHasMoved(binding, { address, digest })).toBe(false)
    expect(bindingHasMoved(binding, { address, digest: 'a'.repeat(64) })).toBe(true)
    // A different implementation is not a move, it is a different artefact.
    expect(
      bindingHasMoved(binding, { address: { ...address, version: '0.9.0' }, digest: 'a'.repeat(64) }),
    ).toBe(false)
  })
})
