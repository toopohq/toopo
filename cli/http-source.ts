/**
 * The registry reached over HTTP, and the one line of it that decides a supply chain.
 *
 * It is the implementation `source.ts` has been claiming since it was written - *the day a server
 * exists it implements this same type and nothing above it changes*. Nothing above it did: the
 * decisions changed by a type name, and `fixpoint.ts` is what keeps them synchronous in front of it.
 *
 * ---------------------------------------------------------------------------
 * A content-addressed answer is addressed by the question, never by what arrived
 * ---------------------------------------------------------------------------
 *
 * `localSource` and `packagedSource` look an answer up *by* its digest in a map keyed on that digest,
 * so the pairing of an answer with the address it was asked at is held by a data structure. **There is
 * no such structure on a wire.** A server answers what it chooses to answer, and `servedBlobFaults`
 * compares `addressedBy` against a recompute of the bytes beside it - so a source that built its answer
 * with `servedBlob(whatArrived)` would be checking that the bytes hash to their own hash, and would
 * pass on any bytes at all.
 *
 * It is `artefact.ts`'s own sentence one layer up: *digests recomputed from whatever is on disk certify
 * themselves and prove nothing.* So `addressedBy` here is the digest that was **asked for**, and what
 * the server claims about the address of its own answer is not read at all. That is what turns
 * `servedSnapshotFaults` and `servedBlobFaults` into the check `resolve.ts` believes it is making.
 *
 * The unsafe spelling is not offered. The maquette carried it as a parameter so that corruption could
 * be watched going through; a parameter selecting it is a hole with a name on it, and what keeps this
 * check load-bearing instead is a battery cell that removes the addressing and has to come back killed.
 *
 * ---------------------------------------------------------------------------
 * What is believed, and what is checked
 * ---------------------------------------------------------------------------
 *
 * The two named answers and the bindings are **believed**, and that is the registry's declared root of
 * trust rather than a gap here: `endpoints.ts` says the resolution is the client's, and what a client
 * cannot check is that the name it started from is bound to the digest this registry says it is.
 * Everything downstream of that digest is content-addressed and is checked. The closure is a Merkle
 * tree with one root of trust, which is the shape an OCI manifest and Go's module graph already have.
 *
 * A body that is not the shape its endpoint answers is therefore **not** validated here, and that is a
 * measurement rather than an omission: a snapshot with no `canonicalText` fails `servedSnapshotFaults`
 * under *the body is not JSON, so nothing can be recomputed from it*, and one with the wrong
 * `formatVersion` fails it under the sentence about canonicalising. A second validator here would be a
 * second statement of what a served answer has to be, disagreeing with the first the day one moves.
 *
 * ---------------------------------------------------------------------------
 * A failure is loud, and an absence is an answer
 * ---------------------------------------------------------------------------
 *
 * `null` means *this registry holds no such thing* and is spelled `404`. Every other status that is not
 * the answer throws, because a refusal arriving as an absence is the failure `validation/source.ts`
 * records - a thing that was not read passes every check for the wrong reason. So a 500 on a blob is an
 * error, where a 404 on one is `null`; and a 404 on the index is an error too, because the port makes
 * that answer non-nullable and a registry with no index is not a registry with an empty catalogue.
 *
 * **What that throw does not yet have is a screen, and it is declared rather than half-built.**
 * `command.ts` turns `UnusableConfiguration`, `UnusableLockfile` and `UnusableArtefact` into refusals a
 * person can read, and a registry that is down would arrive beside them as a stack trace. Nothing here
 * constructs an `httpSource`: both entry points name a local registry, so the path is unreachable in
 * the product and a sentence written for it now could not be seen red by anything. **It closes with the
 * entry point that first names an origin** - the unit that moves the catalogue out of this repository -
 * because that is the change that makes the failure reachable, and a refusal is written against a
 * screen somebody can actually meet.
 *
 * ---------------------------------------------------------------------------
 * The route is the endpoint identifier, and there is no table of paths
 * ---------------------------------------------------------------------------
 *
 * `THE_ENDPOINT_BEHIND` already states which endpoint answers each method. A table of URL paths beside
 * it would be a second statement of the same thing, free to drift - so a path *is* the endpoint
 * identifier and, where the endpoint takes one, the address it is asked about. `serving-over-http.ts`
 * reads a request back through this same function rather than through a copy of it.
 */

import type {
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from '../registry/response.js'
import type { Question } from './fixpoint.js'
import { addressAsked } from './fixpoint.js'
import type { RegistrySource } from './source.js'
import { THE_ENDPOINT_BEHIND } from './source.js'

/** Where a question is asked, derived from the endpoint behind it and from nothing else. */
export const pathOf = (question: Question): string =>
  `/${THE_ENDPOINT_BEHIND[question.method]}/${encodeURIComponent(addressAsked(question))}`

/** What a snapshot body carries that this client reads. Checked by `servedSnapshotFaults`, not here. */
type SnapshotBody = {
  readonly canonicalText: string
  readonly formatVersion: number
}

class TheRegistryDidNotAnswer extends Error {
  constructor(origin: string, question: Question, said: string) {
    super(
      `${origin} answered ${said} for \`${question.method}\`` +
        `${addressAsked(question) === '' ? '' : ` at ${addressAsked(question)}`}`,
    )
    this.name = 'TheRegistryDidNotAnswer'
  }
}

/**
 * A registry over HTTP.
 *
 * `origin` is a scheme, a host and a port, with no trailing slash - the shape `THE_ORIGIN` already has
 * one folder along. It is a parameter rather than a constant because which registry an installation was
 * served from is a fact about which entry point was run, which is the rule `command.ts` states and the
 * reason a probe never decides it.
 */
export const httpSource = (origin: string): RegistrySource => {
  /** The response, or `null` where the registry says it holds no such thing. */
  const answering = async (question: Question): Promise<Response | null> => {
    const response = await fetch(`${origin}${pathOf(question)}`)
    if (response.status === 404) return null
    if (!response.ok) throw new TheRegistryDidNotAnswer(origin, question, String(response.status))

    return response
  }

  /** An answer the port makes non-nullable, so that a registry holding none of it is an error. */
  const insisted = async <T>(question: Question): Promise<T> => {
    const response = await answering(question)
    if (response === null) throw new TheRegistryDidNotAnswer(origin, question, '404')

    return (await response.json()) as T
  }

  return {
    contractIndex: () => insisted<ServedIndex>({ method: 'contractIndex' }),

    refusals: () => insisted<ServedRefusals>({ method: 'refusals' }),

    // A contract with no published implementation answers `[]`, which is an answer the registry gives
    // rather than a thing it does not hold - so this one is insisted on too.
    implementationBindings: (address) =>
      insisted<readonly ServedImplementationBinding[]>({
        method: 'implementationBindings',
        address,
      }),

    snapshot: async (digest) => {
      const response = await answering({ method: 'snapshot', digest })
      if (response === null) return null

      const body = (await response.json()) as SnapshotBody

      return {
        addressing: 'content-addressed',
        // The question, never what arrived. The header is the whole argument.
        addressedBy: digest,
        canonicalText: body.canonicalText,
        formatVersion: body.formatVersion,
      } satisfies ServedSnapshot
    },

    blob: async (sha256) => {
      const response = await answering({ method: 'blob', sha256 })
      if (response === null) return null

      return {
        addressing: 'content-addressed',
        addressedBy: sha256,
        bytes: Buffer.from(await response.arrayBuffer()),
      }
    },
  }
}
