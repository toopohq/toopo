/**
 * A registry on an ephemeral port, so that `http-source.ts` can be measured against a real transport.
 *
 * **It is the guard's apparatus and not a design for a deployment.** Nothing here decides an address
 * scheme, a cache header or a byte store; what it is for is that a claim about a client is worth
 * nothing until something has answered it over a socket. There is nothing to host - the server is
 * created inside the test process, listens on a port the operating system picks, and is closed by the
 * guard that made it.
 *
 * It sits in `cli/` beside `imagined-source.ts` and `temporary-project.ts`, which are the other two
 * modules here that exist for guards. `packaging/build.ts` prunes what the published entry point
 * cannot reach, so none of the three ships, and `archive.test.ts` is what says so rather than this
 * sentence.
 *
 * ---------------------------------------------------------------------------
 * It serves a `RegistrySource`, so there is nothing here that knows a catalogue
 * ---------------------------------------------------------------------------
 *
 * What it wraps is the port itself, which means any of the four implementations can be put on a wire
 * and nothing here describes what is being served. A server built over the frozen artefact instead
 * would have worked, and would have made `cli/` depend on `packaging/` - the wrong way round, since
 * `packaging/freeze.ts` imports the installer's walk out of this folder.
 *
 * It also means the thing under measurement is exactly the port: whatever a source answers, this puts
 * on a socket, and `http-source.ts` is required to read it back.
 *
 * ---------------------------------------------------------------------------
 * Both sides of the route derive from one declaration
 * ---------------------------------------------------------------------------
 *
 * `pathOf` writes `/<endpoint>/<address>` out of `THE_ENDPOINT_BEHIND`, and `WHERE` below is that same
 * record inverted. Neither is a table of paths, so a method whose endpoint moves moves on both sides at
 * once and there is nothing here to drift from the client. A list of routes written beside it would be
 * the copy of a parser this repository refuses.
 */

import { createServer } from 'node:http'

import type { ContractAddress } from '../registry/address.js'
import type { RegistrySource } from './source.js'
import { THE_ENDPOINT_BEHIND } from './source.js'

/** Which method a request path names - `THE_ENDPOINT_BEHIND` read the other way round. */
const WHERE: ReadonlyMap<string, keyof RegistrySource> = new Map(
  (Object.entries(THE_ENDPOINT_BEHIND) as readonly (readonly [keyof RegistrySource, string])[]).map(
    ([method, endpoint]) => [endpoint, method],
  ),
)

const json = (value: unknown): Buffer => Buffer.from(JSON.stringify(value), 'utf8')

/**
 * The contract a bindings request names, read back off its own rendering.
 *
 * The one place in this repository that parses a rendered address, and it is here because a URL is a
 * string and a server has nothing else to go on - which is a fact about HTTP rather than a shortcut. It
 * is the apparatus rather than the product: no module of the client does this, `fixpoint.ts` carries an
 * address as an address precisely so that it never has to, and a real server would read its route
 * parameters the same way this does.
 */
const contractAt = (rendered: string): ContractAddress => {
  const at = rendered.lastIndexOf('@')
  const slash = rendered.indexOf('/')
  const major = Number(rendered.slice(at + 1))

  if (at === -1 || slash === -1 || !Number.isInteger(major)) {
    throw new Error(`"${rendered}" is not a rendered contract address`)
  }

  return { language: 'typescript', name: rendered.slice(slash + 1, at), major }
}

/**
 * What each endpoint answers out of the source, and `null` for *this registry holds no such thing*.
 *
 * Total over the port by construction, which is the whole reason it is keyed this way: a method added
 * to `RegistrySource` stops this file compiling until somebody has said what a server would answer.
 */
const BODY_FOR: Readonly<
  Record<keyof RegistrySource, (held: RegistrySource, address: string) => Promise<Buffer | null>>
> = {
  contractIndex: async (held) => json(await held.contractIndex()),

  refusals: async (held) => json(await held.refusals()),

  // An empty list rather than a 404, because the port says a contract with no published implementation
  // answers `[]` - an answer the registry gives, not a thing it does not hold.
  implementationBindings: async (held, address) =>
    json(await held.implementationBindings(contractAt(address))),

  snapshot: async (held, address) => {
    const snapshot = await held.snapshot(address)

    return snapshot === null ? null : json(snapshot)
  },

  blob: async (held, address) => {
    const blob = await held.blob(address)

    return blob === null ? null : blob.bytes
  },
}

/**
 * A blob travels as its own bytes and everything else as JSON.
 *
 * Base64 is how the *archive* carries a blob, because the archive is one JSON file; a server has no
 * such constraint, and sending the octets is what a server would really do. It also puts the
 * catalogue's lone surrogate on the wire as itself, which is the one byte string a JSON round trip
 * would quietly repair.
 */
const CONTENT_TYPE: Readonly<Record<keyof RegistrySource, string>> = {
  contractIndex: 'application/json',
  refusals: 'application/json',
  implementationBindings: 'application/json',
  snapshot: 'application/json',
  blob: 'application/octet-stream',
}

/** One request, as the method and address it named. */
export type Asked = {
  readonly method: keyof RegistrySource
  readonly address: string
}

export type Serving = {
  readonly origin: string
  /** Every request answered, in order, so that round trips are counted at the wire and not by a client. */
  readonly asked: readonly Asked[]
  readonly close: () => Promise<void>
}

/**
 * The artefact on an ephemeral port, recording what it was asked for.
 *
 * The count is taken here rather than in the client on purpose: what a measurement of round trips has
 * to establish is what crossed the wire, and a client counting its own requests would be counting its
 * intentions.
 */
export const servingOverHttp = async (
  held: RegistrySource,
  /**
   * Addresses this registry answers with somebody else's answer, requested address to served one.
   *
   * A parameter rather than a second server, on the argument `imaginedSource(refuse)` already makes:
   * two servers differing in one answer is a copy waiting to drift. What it models is the one failure
   * no local implementation can have - both of them look an answer up *by* its digest in a map keyed on
   * that digest, so the pairing of an answer with its address is held by a data structure. Over a wire
   * it is held by whatever the server chooses to send.
   */
  misrouted: ReadonlyMap<string, string> = new Map(),
): Promise<Serving> => {
  const asked: Asked[] = []

  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const [, endpoint = '', address = ''] = url.pathname.split('/')
    const method = WHERE.get(endpoint)

    if (method === undefined) {
      response.writeHead(404).end()

      return
    }

    const wanted = decodeURIComponent(address)
    asked.push({ method, address: wanted })

    void BODY_FOR[method](held, misrouted.get(wanted) ?? wanted)
      .then((body) => {
        if (body === null) response.writeHead(404).end()
        else response.writeHead(200, { 'content-type': CONTENT_TYPE[method] }).end(body)
      })
      // A server that died silently would look to a client exactly like one that is slow, and the
      // guard would hang rather than fail. 500 is what `http-source.ts` throws on.
      .catch(() => response.writeHead(500).end())
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  if (address === null || typeof address === 'string') {
    throw new Error('the registry under measurement did not take a port')
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    asked,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error === undefined ? resolve() : reject(error)))
      }),
  }
}
