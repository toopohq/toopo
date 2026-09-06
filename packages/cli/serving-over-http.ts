/**
 * A registry on an ephemeral port, so that `http-source.ts` can be measured against a real transport.
 *
 * **It is the guard's apparatus and not a design for a deployment.** Nothing here decides an address
 * scheme, a cache header or a byte store; what it is for is that a claim about a client is worth
 * nothing until something has answered it over a socket. There is nothing to host - the server is
 * created inside the test process, listens on a port the operating system picks, and is closed by the
 * guard that made it.
 *
 * It sits in `packages/cli/` with the other modules here that exist for guards rather than for the
 * product. None of them ships: `packaging/build.ts` prunes what the published entry point cannot
 * reach, and `archive.test.ts` is what says so rather than this sentence - which is why the list is
 * not written out here, where it would go stale the day a fifth one is added.
 *
 * ---------------------------------------------------------------------------
 * It serves a `RegistrySource`, so there is nothing here that knows a catalogue
 * ---------------------------------------------------------------------------
 *
 * What it wraps is the port itself, which means any of the four implementations can be put on a wire
 * and nothing here describes what is being served. A server built over the frozen artefact instead
 * would have worked, and would have made `packages/cli/` depend on `packaging/` - the wrong way round, since
 * `packaging/freeze.ts` imports the installer's walk out of this folder.
 *
 * It also means the thing under measurement is exactly the port: whatever a source answers, this puts
 * on a socket, and `http-source.ts` is required to read it back.
 *
 * ---------------------------------------------------------------------------
 * Both sides of the route derive from one declaration
 * ---------------------------------------------------------------------------
 *
 * `pathOf` asks `packages/registry/endpoints.ts` where an endpoint's answers live, `askedAt` is that function's
 * own inverse, and `WHERE` below turns the endpoint it names back into a method of this port. Nothing
 * here is a table of paths, so a method whose endpoint moves moves on both sides at once. A list of
 * routes written beside it would be the copy of a parser this repository refuses.
 *
 * **A tree emitted to a static host needs none of this**, and that is worth seeing from here: it
 * answers by *being* the file at the path `pathTo` names, so the whole of the routing below is what a
 * process costs and a directory does not.
 */

import { createServer } from 'node:http'

import type { ContractAddress } from '../registry/address.js'
import { askedAt, contentTypeOf } from '../registry/endpoints.js'
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
 * The contract a bindings request names, read back into its parts off its own rendering.
 *
 * The one place in this repository that takes a rendered contract address apart, and it is here because
 * a URL is a string and a server has nothing else to go on - which is a fact about HTTP rather than a
 * shortcut. `askedAt` says which endpoint a path names and hands the address on whole; turning that
 * string back into a `ContractAddress` is this. It is the apparatus rather than the product: no module
 * of the client does it, `fixpoint.ts` carries an address as an address precisely so that it never has
 * to, and a real server would read its route parameters the same way.
 */
const contractAt = (rendered: string): ContractAddress => {
  const at = rendered.lastIndexOf('@')
  const slash = rendered.indexOf('/')
  const major = Number(rendered.slice(at + 1))
  const language = rendered.slice(0, slash)

  if (at === -1 || slash === -1 || !Number.isInteger(major)) {
    throw new Error(`"${rendered}" is not a rendered contract address`)
  }

  // Read rather than assumed, which is the whole subject of the unit that put a language into every
  // rendering: a parser that supplies the coordinate itself is one that cannot be wrong about it, and
  // would answer this registry's TypeScript catalogue to a question about somebody else's.
  if (language !== 'typescript') {
    throw new Error(`"${rendered}" names ${language}, and this registry serves typescript`)
  }

  return { language, name: rendered.slice(slash + 1, at), major }
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
  /**
   * An origin this registry sends every request on to, instead of answering it.
   *
   * A parameter for `misrouted`'s reason and a *second* `servingOverHttp` for the opposite one: what a
   * redirect models is somewhere else, so the place it names has to be a different origin rather than a
   * different answer from this one. The two are not the same shape and this is where they part.
   *
   * The request is recorded before it is sent on, because what a guard has to be able to see is that
   * this origin was asked and the other one was not. ADR-0242.
   */
  redirectingTo?: string,
): Promise<Serving> => {
  const asked: Asked[] = []

  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const question = askedAt(url.pathname)
    const method = question === null ? undefined : WHERE.get(question.endpoint.id)

    if (question === null || method === undefined) {
      response.writeHead(404).end()

      return
    }

    const wanted = question.address
    asked.push({ method, address: wanted })

    if (redirectingTo !== undefined) {
      response.writeHead(302, { location: `${redirectingTo}${url.pathname}` }).end()

      return
    }

    void BODY_FOR[method](held, misrouted.get(wanted) ?? wanted)
      .then((body) => {
        if (body === null) response.writeHead(404).end()
        else response.writeHead(200, { 'content-type': contentTypeOf(question.endpoint) }).end(body)
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
