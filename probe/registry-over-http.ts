/**
 * The artefact, served over HTTP, so that a `RegistrySource` can be measured against a real transport.
 *
 * **This is a maquette and not a unit.** Nothing here is a design for the byte store, an address scheme
 * or a deployment: it is the smallest thing that makes the registry *remote*, so that the property
 * `cli/command.ts` declares - everything this tool decides is reachable from a guard, with no process,
 * no working directory and no clock - can be broken now rather than after the repository is split.
 *
 * There is nothing to deploy. `packaging/freeze.ts` already answers *what does an installation ask a
 * registry for*, and it answers it as a transcript of the installer's own walk rather than as a second
 * description of it. So the content served here is `frozenArtefact(...)` of whichever source is under
 * measurement, and the wire is `node:http` on an ephemeral port inside the measuring process.
 *
 * ---------------------------------------------------------------------------
 * The routes are derived from the port, never listed beside it
 * ---------------------------------------------------------------------------
 *
 * `THE_ENDPOINT_BEHIND` already states which endpoint each method of the port answers. A table of URL
 * paths would be a second statement of the same thing, free to drift from it - so a path is the
 * endpoint identifier and, where the endpoint takes one, the address it is asked about. A method added
 * to the port does not compile here until it has a body, which is the totality `THE_ENDPOINT_BEHIND`
 * already carries one floor down.
 */

import { createServer } from 'node:http'

import type { ServedArtefact } from '../cli/artefact.js'
import { decodedBlob } from '../cli/artefact.js'
import type { RegistrySource } from '../cli/source.js'
import { THE_ENDPOINT_BEHIND } from '../cli/source.js'

/** One question a source asks a registry: which method, and the address it names, if any. */
export type Wanted = {
  readonly method: keyof RegistrySource
  /** The rendered contract, the snapshot digest, the blob digest - or `''` for the two named answers. */
  readonly key: string
}

export const asked = (wanted: Wanted): string => `${wanted.method} ${wanted.key}`

export const pathOf = (wanted: Wanted): string =>
  `/${THE_ENDPOINT_BEHIND[wanted.method]}/${encodeURIComponent(wanted.key)}`

/** The inverse, so that the server reads a request back into the question that produced it. */
const METHOD_OF: ReadonlyMap<string, keyof RegistrySource> = new Map(
  Object.entries(THE_ENDPOINT_BEHIND).map(([method, endpoint]) => [
    endpoint,
    method as keyof RegistrySource,
  ]),
)

const json = (value: unknown): Buffer => Buffer.from(JSON.stringify(value), 'utf8')

/**
 * What each endpoint answers out of the artefact, and `null` for *this registry holds no such thing*.
 *
 * Total over the port by construction, which is the whole reason it is keyed this way: a fifth method
 * on `RegistrySource` stops this file compiling until somebody has said what a server would answer.
 */
const BODY_FOR: Readonly<Record<keyof RegistrySource, (held: ServedArtefact, key: string) => Buffer | null>> = {
  contractIndex: (held) => json(held.index),

  refusals: (held) => json(held.refusals),

  // An empty list rather than a 404, because the port says a contract with no published implementation
  // answers `[]` - that is an answer the registry gives and not a thing it does not hold.
  implementationBindings: (held, key) =>
    json(held.bindings.find((entry) => entry.contract === key)?.bindings ?? []),

  snapshot: (held, key) => {
    const snapshot = held.snapshots.find((entry) => entry.addressedBy === key)

    return snapshot === undefined ? null : json(snapshot)
  },

  blob: (held, key) => {
    const blob = held.blobs.find((entry) => entry.addressedBy === key)

    return blob === undefined ? null : decodedBlob(blob).bytes
  },
}

/**
 * A blob travels as its own bytes and everything else as JSON.
 *
 * Base64 is how the *archive* carries a blob, because the archive is one JSON file; a server has no
 * such constraint, and sending the octets is what a server would really do. It also puts the catalogue's
 * lone surrogate on the wire as itself, which is the one byte string a JSON round trip would quietly
 * repair.
 */
const CONTENT_TYPE: Readonly<Record<keyof RegistrySource, string>> = {
  contractIndex: 'application/json',
  refusals: 'application/json',
  implementationBindings: 'application/json',
  snapshot: 'application/json',
  blob: 'application/octet-stream',
}

export type Served = {
  readonly origin: string
  /** Every request the server answered, in order, as the questions that produced them. */
  readonly requests: readonly Wanted[]
  readonly close: () => Promise<void>
}

/**
 * The artefact on an ephemeral port, recording what it was asked for.
 *
 * The count is taken here rather than in the client on purpose: what a measurement of round trips has
 * to establish is what crossed the wire, and a client that answered from a cache it forgot to mention
 * would be counting its own intentions.
 */
export const servingOverHttp = async (
  held: ServedArtefact,
  /**
   * Addresses this registry answers with somebody else's answer, requested address to served one.
   *
   * A parameter rather than a second server, on the argument `imaginedSource(refuse)` already makes:
   * two servers differing in one answer is a copy waiting to drift. What it models is the one failure
   * no local implementation can have - both of them look an answer up *by* its digest in a map keyed
   * on that digest, so the pairing of an answer with its address is held by a data structure. Over a
   * wire it is held by whatever the server chooses to send.
   */
  misrouted: ReadonlyMap<string, string> = new Map(),
): Promise<Served> => {
  const requests: Wanted[] = []

  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const [, endpoint = '', key = ''] = url.pathname.split('/')
    const method = METHOD_OF.get(endpoint)

    if (method === undefined) {
      response.writeHead(404).end()

      return
    }

    const wanted: Wanted = { method, key: decodeURIComponent(key) }
    requests.push(wanted)

    const body = BODY_FOR[method](held, misrouted.get(wanted.key) ?? wanted.key)
    if (body === null) {
      response.writeHead(404).end()

      return
    }

    response.writeHead(200, { 'content-type': CONTENT_TYPE[method] }).end(body)
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  if (address === null || typeof address === 'string') {
    throw new Error('the probe server did not take a port')
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    requests,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error === undefined ? resolve() : reject(error)))
      }),
  }
}

/** What one question answered over the wire, or `null` for a registry that holds no such thing. */
export type Arrived = { readonly json: unknown } | { readonly bytes: Buffer } | null

export const fetchOne = async (origin: string, wanted: Wanted): Promise<Arrived> => {
  const response = await fetch(`${origin}${pathOf(wanted)}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`${asked(wanted)} answered ${response.status}`)

  return wanted.method === 'blob'
    ? { bytes: Buffer.from(await response.arrayBuffer()) }
    : { json: (await response.json()) as unknown }
}
