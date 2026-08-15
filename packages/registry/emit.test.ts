import { describe, it, expect } from 'vitest'

import { ENDPOINTS, askedAt, contentTypeOf, endpointOf, pathTo, portFaults } from './endpoints.js'
import { THE_QUESTIONS_THAT_NEED_NOTHING, emitted, theFileAt, urlAsked } from './emit.js'
import { CLAMP, HOLDINGS, IMAGINED_BLOBS, IMAGINED_VERSION, ROUND } from './imagined-graph.js'
import { localReadApi } from './local-read-api.js'
import type { ReadApi } from './read-api.js'
import { NOT_ANSWERED, THE_ENDPOINT_BEHIND } from './read-api.js'
import { renderContract } from './address.js'
import type { ContractRecord } from './contract-record.js'
import { servedBlob, servedSnapshot } from './response.js'
import { contractSnapshot, digestOfSnapshot, implementationSnapshot } from './snapshot.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { theFive } from './the-five.js'

/**
 * What a client can ask for, and whether it is there.
 *
 * The emission is a walk of the *questions*, so what these guards have to establish is that the walk
 * reaches every question and that nothing it wrote needs translating to be found. The load-bearing one
 * is `the-emitted-tree-is-closed`, and it is written to be **independent of the walk**: it reads the
 * addresses back out of the served bytes with a regular expression rather than by calling the record
 * the walk is built on. A guard that asked `WHAT_AN_ANSWER_NAMES` what the answers name would be green
 * for exactly the arm somebody forgot to write, which is `GUARD_PERTURBATION_RULE` arriving on a
 * closure.
 *
 * **Nothing is built at the top of this file, and that is the apparatus talking rather than taste.** A
 * mutant that makes the serialisation throw would otherwise stop the whole file collecting, and the
 * instrument reads a file that collected nothing as a run that measured part of the suite - the lesson
 * `packages/site/pages.test.ts` records against W-20, met here by I-01 reporting 303 tests where the unmutated
 * arm reports 314. It is built once and lazily instead, so a throw reddens the guards rather than
 * hiding them.
 */

const endpointAt = (file: string) => {
  const question = askedAt(`/${file}`)
  if (question === null) throw new Error(`${file} is at no address any client can ask for`)

  return question.endpoint
}

type Holding = {
  readonly registry: ReadApi
  readonly tree: ReadonlyMap<string, Buffer>
  /** Every address the tree serves. */
  readonly held: ReadonlySet<string>
  /** The five, serialised here rather than read out of the emission, so the readings stay independent. */
  readonly records: readonly { readonly folder: string; readonly record: ContractRecord }[]
  /** Which contracts this registry publishes, which decides whose files it has to serve. */
  readonly published: ReadonlySet<string>
  /**
   * The digests a served answer carries that are **not** addresses, and there is exactly one kind.
   *
   * A profile whose samples are produced by an expression records the digest of their canonical
   * encoding so that a reader can regenerate them and check they got the same corpus. Nothing is stored
   * at it: the samples are a function of `producedBy` and not a file this registry holds, and the check
   * is a recomputation rather than a fetch. Every other 64-hex value in the tree addresses something.
   */
  readonly notAnAddress: ReadonlySet<string>
  /**
   * The served text of every answer that is a document, with one level of JSON escaping undone.
   *
   * A snapshot carries its canonical text as a string, so every address inside it arrives escaped; a
   * reading that did not undo that would see the digests - which need no escaping - and none of the
   * contract addresses, and would quietly check half of what it claims to.
   */
  readonly documents: readonly (readonly [string, string])[]
}

const gather = (): Holding => {
  const registry = localReadApi()
  const tree = emitted(registry)
  const records = theFive.map((source) => ({
    folder: source.folder,
    record: serialiseContract(REPOSITORY_ROOT, source),
  }))

  return {
    registry,
    tree,
    held: new Set(tree.keys()),
    records,
    published: new Set(
      registry
        .contractIndex()
        .entries.filter((entry) => entry.installable)
        .map((entry) => renderContract(entry.address)),
    ),
    notAnAddress: new Set(
      records.flatMap(({ record }) =>
        record.benchmarks.profiles.flatMap((profile) =>
          profile.samples.kind === 'produced' ? [profile.samples.sha256] : [],
        ),
      ),
    ),
    documents: [...tree]
      .filter(([file]) => contentTypeOf(endpointAt(file)) === 'application/json')
      .map(([file, bytes]) => [file, bytes.toString('utf8').replaceAll('\\"', '"')] as const),
  }
}

let gathered: Holding | null = null

/** Everything these guards read, built on the first one that asks and never at import. */
const holding = (): Holding => (gathered ??= gather())

describe('the tree a host serves', () => {
  /**
   * The one port in this repository that is the whole read API, which is what makes this an equality.
   * A client's port can only be checked for naming endpoints that exist; this one is checked for
   * naming all of them, and an endpoint nothing answers has to say what would change that.
   */
  it('every-endpoint-is-answered-or-declared-unanswerable', () => {
    const answered = new Set(Object.values(THE_ENDPOINT_BEHIND))
    const deferred = new Set(Object.keys(NOT_ANSWERED))

    expect({
      answeredByNothing: ENDPOINTS.map((endpoint) => endpoint.id).filter(
        (id) => !answered.has(id) && !deferred.has(id),
      ),
      deferredAndAnswered: [...deferred].filter((id) => answered.has(id)),
      deferredAndUnknown: [...deferred].filter(
        (id) => !ENDPOINTS.some((endpoint) => endpoint.id === id),
      ),
    }).toEqual({ answeredByNothing: [], deferredAndAnswered: [], deferredAndUnknown: [] })
  })

  it('an-unanswered-endpoint-names-what-would-close-it', () => {
    expect(
      Object.entries(NOT_ANSWERED)
        .filter(([, deferred]) => deferred.because.trim() === '' || deferred.until.trim() === '')
        .map(([id]) => id),
    ).toEqual([])
  })

  it('the-registry-answers-every-question-its-port-declares', () => {
    expect(portFaults(THE_ENDPOINT_BEHIND, holding().registry)).toEqual([])
  })

  /**
   * The roots of the closure, declared beside the walk and derived here from the endpoints. A root
   * quietly dropped emits a smaller tree that is still closed, so no other guard in this file would
   * see it.
   */
  it('the-questions-that-need-nothing-are-the-answers-about-the-catalogue', () => {
    const derived = Object.entries(THE_ENDPOINT_BEHIND)
      .filter(([, endpoint]) => endpointOf(endpoint).about === 'the catalogue')
      .map(([method]) => method)
      .sort()

    expect(THE_QUESTIONS_THAT_NEED_NOTHING.map((question) => question.method).sort()).toEqual(derived)
  })
})

describe('where an answer lives', () => {
  /**
   * `pathTo` and `askedAt` are inverse, over every endpoint there is. It is what lets a server route
   * without a table of paths, and it is the half a static host does not need at all.
   */
  it('where-an-answer-lives-reads-back-to-the-question-it-answers', () => {
    const address = (endpoint: (typeof ENDPOINTS)[number]): string =>
      endpoint.about === 'a contract' ? 'typescript/number/parse@1' : 'a'.repeat(64)

    expect(
      ENDPOINTS.map((endpoint) => {
        const wanted = endpoint.about === 'the catalogue' ? '' : address(endpoint)
        const read = askedAt(pathTo(endpoint, wanted))

        return { id: read?.endpoint.id ?? null, address: read?.address ?? null }
      }),
    ).toEqual(ENDPOINTS.map((endpoint) => ({
      id: endpoint.id,
      address: endpoint.about === 'the catalogue' ? '' : address(endpoint),
    })))
  })

  /**
   * The whole of the translation between a URL and a file, and the reason there is no router in front
   * of the tree. An address that needed encoding would be a file name no filesystem can hold - which is
   * what the client used to ask for, `%2F` and all.
   */
  it('a-url-is-a-file-path-with-its-leading-slash-taken-off', () => {
    const wrong = [...holding().tree.keys()].filter((file) => {
      const url = `/${file}`

      return theFileAt(url) !== file || encodeURI(url) !== url || askedAt(url) === null
    })

    expect(wrong).toEqual([])
  })

  it('a-page-and-the-answers-about-that-contract-share-one-address', () => {
    const parse = renderContract({ language: 'typescript', name: 'number/parse', major: 1 })

    expect([...holding().held].filter((file) => file.startsWith(`${parse}/`)).sort()).toEqual([
      `${parse}/contract-binding`,
      `${parse}/implementation-bindings`,
    ])
  })
})

describe('the closure', () => {
  /**
   * **An answer a client can ask for that the emission did not write is a 404 at the moment somebody
   * installs something.** So every address a served answer names is required to be an address the tree
   * holds - read back out of the bytes, so that a forgotten arm of the walk shows up here rather than
   * agreeing with itself.
   *
   * A digest may name a snapshot or a blob and nothing in the text says which, so either is accepted.
   * That is weaker than the walk and it is the right weakness: this guard's job is to catch an address
   * that is served nowhere at all.
   *
   * **A digest is a whole JSON value and never a substring**, which is a narrowing this guard was
   * measured into: `string/levenshtein@1` carries a benchmark sample of a hundred and twenty
   * alternating letters, and `abab…` for sixty-four characters looks exactly like a digest to a reader
   * that matches inside strings.
   */
  it('the-emitted-tree-is-closed :: every address an answer names is an address it serves', () => {
    const { documents, held, notAnAddress } = holding()

    const unserved = documents.flatMap(([file, text]) => [
      ...[...text.matchAll(/"([0-9a-f]{64})"/g)]
        .map((match) => match[1] as string)
        .filter((digest) => !notAnAddress.has(digest))
        .filter((digest) => !held.has(`snapshot/${digest}`) && !held.has(`blob/${digest}`))
        .map((digest) => `${file} names ${digest}, which is served at no address`),
      ...[...text.matchAll(/"language":"(\w+)","name":"([\w/-]+)","major":(\d+)/g)]
        .map((match) => `${match[1]}/${match[2]}@${match[3]}`)
        .filter((contract) => !held.has(`${contract}/implementation-bindings`))
        .map((contract) => `${file} names ${contract}, whose implementations are served nowhere`),
    ])

    expect([...new Set(unserved)]).toEqual([])
  })

  /**
   * The blobs are the *contract's* harness and not the implementation's file list, which is where this
   * walk and the installer's part company: no command of `packages/cli/` fetches a test file, a contract page
   * publishes every one of their digests, and permanent rule 5 says the suite is public in full.
   */
  it('every-file-a-published-contract-freezes-is-served', () => {
    const { held, published, records } = holding()

    const missing = records
      .filter(({ record }) => published.has(renderContract(record.address)))
      .flatMap(({ folder, record }) =>
        record.harness
          .filter((file) => !held.has(`blob/${file.sha256}`))
          .map((file) => `${folder}/${file.path}`),
      )

    expect(missing).toEqual([])
  })

  /**
   * A refused contract has no binding, so nothing names the digest of its contract snapshot, so no
   * client can ever ask for it - nor for any of the harness files that snapshot is the only place to
   * learn the digests of. **Said rather than left to be found**: emitting them would publish artefacts
   * nothing can reach, and omitting them in silence would look exactly like a hole in the closure.
   *
   * It is `array/group-by@1`, it is two snapshots and nine files, and it is the whole of what this
   * registry answers and no client can name.
   */
  it('what-is-served-and-cannot-be-asked-for-is-the-refused-contract', () => {
    const { held, records } = holding()

    const unreachable = records
      .filter(({ record }) => !held.has(`snapshot/${digestOfSnapshot(contractSnapshot(record))}`))
      .map(({ record }) => ({
        contract: renderContract(record.address),
        files: record.harness.filter((file) => !held.has(`blob/${file.sha256}`)).length,
      }))

    expect(unreachable).toEqual([{ contract: 'typescript/array/group-by@1', files: 9 }])
  })
})

/**
 * An edge is the one thing the closure follows that this catalogue cannot exercise: the five depend on
 * nothing, so the arm that follows `dependsOn` would be dead code on real contracts and the guards
 * above would all stay green with it removed.
 *
 * `imagined-graph.ts` is the graph shaped for exactly this - `pad` is reachable only through `clamp`
 * and `sign`, at depth two - so what is asserted is that an artefact nothing names directly is emitted
 * because something else named it.
 */
const overTheImaginedGraph = (): ReadApi => {
  const snapshots = new Map(
    HOLDINGS.map((record) => {
      const frozen = implementationSnapshot(record)

      return [digestOfSnapshot(frozen), servedSnapshot(frozen)] as const
    }),
  )
  const digestOf = (record: (typeof HOLDINGS)[number]): string =>
    digestOfSnapshot(implementationSnapshot(record))

  return {
    contractIndex: () => ({
      addressing: 'named',
      entries: [
        {
          address: ROUND,
          summary: 'the only root of the imagined graph',
          searchAliases: [],
          domain: 'number',
          installable: true,
          exports: [],
        },
      ],
    }),
    contractBinding: () => null,
    implementationBindings: (address) =>
      HOLDINGS.filter((record) => renderContract(record.contract) === renderContract(address)).map(
        (record) => ({
          addressing: 'named',
          address: { contract: record.contract, id: record.id, version: IMAGINED_VERSION },
          digest: digestOf(record),
          publishedAt: '1970-01-01T00:00:00.000Z',
          status: record.status,
          benchmarks: [],
          minifiedBytes: null,
          tags: [],
        }),
      ),
    refusals: () => ({ addressing: 'named', refusals: [], absorbed: [] }),
    methodology: () => holding().registry.methodology(),
    snapshot: (digest) => snapshots.get(digest) ?? null,
    blob: (sha256) => {
      const bytes = IMAGINED_BLOBS.get(sha256)

      return bytes === undefined ? null : servedBlob(bytes)
    },
  }
}

describe('a graph with edges, which the catalogue has not got', () => {
  it('an-edge-is-followed-to-the-artefact-it-names', () => {
    const graph = emitted(overTheImaginedGraph())
    const digestOf = (name: string): string =>
      digestOfSnapshot(
        implementationSnapshot(
          HOLDINGS.find((record) => renderContract(record.contract) === name) ??
            (HOLDINGS[0] as (typeof HOLDINGS)[number]),
        ),
      )

    // `pad` is named by no binding at all: it is reached through `clamp` and `sign`, which is what
    // makes this an assertion about following an edge rather than about listing a catalogue.
    expect(
      ['typescript/number/round@1', 'typescript/number/clamp@1', 'typescript/string/pad@1'].map(
        (contract) => graph.has(`snapshot/${digestOf(contract)}`),
      ),
    ).toEqual([true, true, true])

    expect(graph.has(`${renderContract(CLAMP)}/implementation-bindings`)).toBe(true)
  })
})
