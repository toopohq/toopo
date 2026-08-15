/**
 * A directory on an ephemeral port: the whole of what a static host does, so that a guard can measure
 * the emitted tree rather than a description of it.
 *
 * **It is the guard's apparatus and not a design for a deployment**, exactly as `serving-over-http.ts`
 * is - and the two are not one thing wearing two hats. That one puts a `RegistrySource` on a wire, so
 * it routes: it reads which endpoint a path names and calls the method behind it. This one has nothing
 * to route, because an emitted answer *is* the file at the path a client asks for. **That difference is
 * the measurement**: everything the other module does between a request and a body is what a process
 * costs and a directory does not.
 *
 * One content type for every answer, and it is not a shortcut. A host with no extension to go on
 * answers octets, and `http-source.ts` never reads the header - so serving one type for all of them is
 * what a host really does *and* an assertion that the client does not depend on it.
 */

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, relative, resolve } from 'node:path'

/** One request, as the path it named and whether the tree held a file there. */
export type AskedOfTheTree = {
  readonly path: string
  readonly found: boolean
}

export type TreeServing = {
  readonly origin: string
  /**
   * Every request answered, in order.
   *
   * `found` is the whole point: **an answer a client can ask for that the emission did not write is a
   * 404 at the moment somebody installs something**, and this is where that is counted rather than
   * inferred from a command having refused.
   */
  readonly asked: readonly AskedOfTheTree[]
  readonly close: () => Promise<void>
}

/** The file a URL names, or `null` where it names nothing under the tree. */
const fileUnder = async (root: string, pathname: string): Promise<string | null> => {
  const wanted = resolve(join(root, decodeURIComponent(pathname)))
  const inside = relative(root, wanted)
  if (inside === '' || inside.startsWith('..')) return null

  try {
    return (await stat(wanted)).isFile() ? wanted : null
  } catch {
    return null
  }
}

export const servingATree = async (root: string): Promise<TreeServing> => {
  const asked: AskedOfTheTree[] = []

  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost')

    void fileUnder(root, pathname)
      .then((file) => {
        asked.push({ path: pathname, found: file !== null })

        if (file === null) {
          response.writeHead(404).end()

          return
        }

        response.writeHead(200, { 'content-type': 'application/octet-stream' })
        createReadStream(file).pipe(response)
      })
      // A server that died silently would look to a client exactly like one that is slow, and the
      // guard would hang rather than fail. 500 is what `http-source.ts` throws on.
      .catch(() => response.writeHead(500).end())
  })

  await new Promise<void>((ready) => {
    server.listen(0, '127.0.0.1', ready)
  })

  const address = server.address()
  if (address === null || typeof address === 'string') {
    throw new Error('the tree under measurement did not take a port')
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    asked,
    close: () =>
      new Promise<void>((closed, failed) => {
        server.close((error) => (error === undefined ? closed() : failed(error)))
      }),
  }
}
