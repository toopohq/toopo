import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { renderContract } from '../registry/address.js'
import { digestOfBytes } from '../registry/canonical.js'
import { emitted } from '../registry/emit.js'
import { localReadApi } from '../registry/local-read-api.js'
import { deciding } from './fixpoint.js'
import { httpSource } from './http-source.js'
import { prepareInstallation } from './install.js'
import type { InstallOutcome } from './install.js'
import { localSource } from './local-source.js'
import { removeDirectory } from './remove-directory.js'
import { prepareRemoval } from './remove.js'
import { search } from './search.js'
import { servingATree } from './serving-a-tree.js'
import type { AskedOfTheTree } from './serving-a-tree.js'
import type { HeldRegistry, RegistrySource } from './source.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'
import { prepareUpdate } from './update.js'

/**
 * The acceptance criterion of the emission, and it is not that an install works over HTTP.
 *
 * **It is that every command, against the tree a host would serve, decides exactly what it decides
 * against the catalogue this repository holds.** Not `add` alone: `search` reads the index, `remove`
 * reads the bindings, `update` re-plans the whole project. An answer a client can ask for and the
 * emission did not write is a 404 at the moment somebody installs something, in somebody else's
 * project - so the tree is written to a disk, served by a file server with nothing in front of it, and
 * every request it answers is recorded with whether a file was there.
 *
 * The two registries are compared and never derived from each other: the reference is
 * `packages/cli/local-source.ts`, which is what every other guard in this folder measures against.
 */

/**
 * Built once and lazily: emitting serialises five contracts and reads thirty-seven files, and doing it
 * at the top of the file would let a mutant that makes the serialisation throw stop the whole file
 * collecting - which the instrument reads as a run that measured part of the suite rather than as a
 * defect. It is `site/pages.test.ts`'s lesson from W-20, met here by I-01.
 */
let emittedTree: ReadonlyMap<string, Buffer> | null = null

const theTree = (): ReadonlyMap<string, Buffer> => (emittedTree ??= emitted(localReadApi()))

const servingTheTree = async <T>(
  use: (source: RegistrySource) => Promise<T>,
): Promise<{ readonly answer: T; readonly asked: readonly AskedOfTheTree[] }> => {
  const root = mkdtempSync(join(tmpdir(), 'toopo-emitted-'))

  for (const [path, bytes] of theTree()) {
    const destination = join(root, path)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, bytes)
  }

  const serving = await servingATree(root)
  try {
    return { answer: await use(httpSource(serving.origin)), asked: serving.asked }
  } finally {
    await serving.close()
    removeDirectory(root)
  }
}

/**
 * A decision with every buffer in it replaced by the digest of its bytes.
 *
 * The comparison stays byte for byte - two files with one digest are two files with one content, which
 * is the assumption this whole registry is built on - and a disagreement prints one line instead of the
 * four thousand a `Buffer` diff prints one integer at a time. The bytes themselves are compared as
 * bytes by `every-byte-the-registry-serves-arrives-unchanged`, where a difference has a digest to name.
 */
const byDigest = (value: unknown): unknown => {
  if (Buffer.isBuffer(value)) return `sha-256:${digestOfBytes(value)}`
  if (Array.isArray(value)) return value.map(byDigest)
  if (value === null || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, held]) => [key, byDigest(held)]),
  )
}

/** One decision, taken against the catalogue and against the tree, with what the tree was asked. */
const bothWays = async <T>(
  decide: (held: HeldRegistry) => T,
): Promise<{
  readonly local: unknown
  readonly served: unknown
  readonly asked: readonly AskedOfTheTree[]
}> => {
  const local = await deciding(localSource(), decide)
  const served = await servingTheTree(async (source) => (await deciding(source, decide)).answer)

  return { local: byDigest(local.answer), served: byDigest(served.answer), asked: served.asked }
}

const THE_INSTALLABLE = ['number/parse', 'date/add', 'string/levenshtein', 'string/slugify']

const installing =
  (root: string, contract: string) =>
  (held: HeldRegistry): InstallOutcome =>
    prepareInstallation(held, {
      root,
      configuration: { version: 1, directory: 'src/lib/toopo' },
      lockfile: EMPTY_LOCKFILE,
      contract,
      implementation: null,
      at: A_PINNED_INSTANT,
    })

/** A project holding one installed feature, so that `update` and `remove` have something to re-plan. */
const aProjectHolding = async (contract: string) => {
  const project = aProject()
  const outcome = await deciding(localSource(), installing(project.root, contract))

  if (!('installation' in outcome.answer)) {
    throw new Error(`${contract} did not install against the catalogue`)
  }

  return { project, lockfile: committing(project, outcome.answer.installation) }
}

const missed = (asked: readonly AskedOfTheTree[]): readonly string[] =>
  asked.filter((request) => !request.found).map((request) => request.path)

describe('every command, against the tree a host serves', () => {
  it('add-decides-the-same-thing-against-the-emitted-tree', async () => {
    for (const contract of THE_INSTALLABLE) {
      const project = aProject()
      try {
        const { local, served, asked } = await bothWays(installing(project.root, contract))

        expect(served, contract).toEqual(local)
        expect(missed(asked), contract).toEqual([])
      } finally {
        project.remove()
      }
    }
  })

  /**
   * The one command that reaches the registry and installs nothing, so the only thing it can be wrong
   * about is the index and the refusals. The queries include the contract the catalogue turned down and
   * one nothing answers, because a search that always answers something is the one nobody believes
   * twice.
   */
  it('search-decides-the-same-thing-against-the-emitted-tree', async () => {
    for (const query of ['slugify', 'string to number', 'Map.groupBy', 'debounce']) {
      const { local, served, asked } = await bothWays((held) => search(held, query))

      expect(served, query).toEqual(local)
      expect(missed(asked), query).toEqual([])
    }
  })

  it('update-decides-the-same-thing-against-the-emitted-tree', async () => {
    const { project, lockfile } = await aProjectHolding('string/slugify')

    try {
      const { local, served, asked } = await bothWays((held) =>
        prepareUpdate(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile,
          at: A_PINNED_INSTANT,
        }),
      )

      expect(served).toEqual(local)
      expect(missed(asked)).toEqual([])
    } finally {
      project.remove()
    }
  })

  it('remove-decides-the-same-thing-against-the-emitted-tree', async () => {
    const { project, lockfile } = await aProjectHolding('number/parse')

    try {
      const { local, served, asked } = await bothWays((held) =>
        prepareRemoval(held, {
          root: project.root,
          configuration: project.configuration,
          lockfile,
          contract: 'number/parse',
          at: A_PINNED_INSTANT,
        }),
      )

      expect(served).toEqual(local)
      expect(missed(asked)).toEqual([])
    } finally {
      project.remove()
    }
  })

  /**
   * The bytes, compared directly rather than through a decision. A file that arrived changed would
   * already fail `servedBlobFaults` inside the walk above - this says which byte string, and it is the
   * claim the whole tree exists to make.
   */
  it('every-byte-the-registry-serves-arrives-unchanged', async () => {
    const digests = [...theTree().keys()]
      .filter((path) => path.startsWith('blob/'))
      .map((path) => path.slice('blob/'.length))
    const catalogue = localSource()

    const differing = await servingTheTree(async (source) => {
      const wrong: string[] = []

      for (const digest of digests) {
        const here = await catalogue.blob(digest)
        const there = await source.blob(digest)

        if (here === null || there === null || !here.bytes.equals(there.bytes)) wrong.push(digest)
      }

      return wrong
    })

    expect(digests.length).toBeGreaterThan(0)
    expect(differing.answer).toEqual([])
  })

  /**
   * A contract the catalogue refused is in the index, has no binding, and answers an empty list of
   * implementations - and every one of those three is a *file* in the tree except the binding, which is
   * an absence. It is the one place the emission spells *this registry holds no such thing* by having
   * written nothing, so it is asserted rather than assumed.
   */
  it('a-refused-contract-answers-no-binding-and-an-empty-list-of-implementations', async () => {
    const refused = renderContract({ language: 'typescript', name: 'array/group-by', major: 1 })

    expect(theTree().has(`${refused}/contract-binding`)).toBe(false)
    expect(theTree().get(`${refused}/implementation-bindings`)?.toString('utf8')).toBe('[]')

    const { answer, asked } = await servingTheTree(async (source) =>
      source.implementationBindings({ language: 'typescript', name: 'array/group-by', major: 1 }),
    )

    expect(answer).toEqual([])
    expect(missed(asked)).toEqual([])
  })
})
