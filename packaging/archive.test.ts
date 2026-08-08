import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import { THE_UNPUBLISHED_VERSION } from '../cli/local-source.js'
import { anInstalledArchive } from './the-archive.js'
import type { InstalledArchive } from './the-archive.js'

/**
 * What a user receives, proved by receiving it.
 *
 * ---------------------------------------------------------------------------
 * Why this suite exists at all
 * ---------------------------------------------------------------------------
 *
 * Every contract page the site publishes ends in `toopo add <name>`, and until this unit nobody could
 * run that line. Three independent things stopped them, and all three were invisible to the 999 guards
 * this repository already had, because every one of them measures the working tree.
 *
 * **`npm pack` refused.** `Invalid package, must have name and version` - there was no archive to be
 * wrong about.
 *
 * **A published `.ts` file cannot run.** Node refuses to strip types under `node_modules` -
 * `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` on v24.15.0 - and refuses it for a `bin` entry point
 * exactly as for an imported module.
 *
 * **The CLI reached vitest.** `toopo search slugify` loaded 147 modules, among them vitest, the
 * TypeScript compiler API and twelve modules of `mutation/`, through
 * `the-five.ts` -> a contract module -> `catalogue/every-contract.ts`. vitest is a dev dependency a
 * user never receives, so the first command anybody ran would have ended in `ERR_MODULE_NOT_FOUND`.
 *
 * `artefact.ts` and `freeze.ts` carry the fix. This file is the only place in the repository where the
 * fix is measured against what actually ships, and that is its whole justification: **the archive is
 * built by `npm pack`, installed by `npm install`, and run by node out of the user's `node_modules`.**
 * Everything else here could be green while this is red.
 *
 * ---------------------------------------------------------------------------
 * The two halves of a whitelist
 * ---------------------------------------------------------------------------
 *
 * `files` is a declaration, and this repository has found eight things that behave like rules with
 * nothing keeping them. So neither half of it is taken on trust.
 *
 * *Nothing is missing* is established by running the tool: a module left out of the archive is a
 * module the entry point cannot import, and `an-archive-installs-a-feature-whose-bytes-are-the-
 * catalogues` is the failure.
 *
 * *Nothing is extra* is established by loading: every command is run under a loader that writes down
 * what node really loads, and every JavaScript file in the tarball must appear. That is derived from
 * what the tool reads rather than declared beside it - and it is deliberately a different mechanism
 * from the static walk `build.ts` prunes with, so that a walk which is wrong in either direction is
 * caught here rather than confirmed.
 */

const REPOSITORY = join(import.meta.dirname, '..')

let archive: InstalledArchive

beforeAll(() => {
  archive = anInstalledArchive()
})

afterAll(() => {
  archive?.remove()
})

/**
 * Where the guard puts what it installs.
 *
 * Named rather than left to `toopo init`, which proposes a folder by looking at the project - a
 * perfectly good thing for it to do and the wrong thing to build a comparison on. It also means
 * `--dir` is exercised, which nothing else here would reach.
 */
const THE_DIRECTORY = 'src/lib/toopo'

/**
 * A path that is inside a folder, wherever in the tarball that folder sits.
 *
 * **It is anchored at a path segment rather than at the start, and that is a repair rather than a
 * tidying.** `files` is `["dist"]`, so npm reports every path in the archive as `dist/...`, and a
 * condition written `startsWith('mutation/')` sees the instrument only when it ships as *source*. The
 * route the build can actually take is the other one: compile more than the entry point, ship what the
 * compiler emitted, and the generator arrives as `dist/site/document.js`.
 *
 * Measured, on the tarball rather than on the argument: shipping two modules of `site/` that way
 * reddens `every-file-in-the-archive-is-loaded-by-a-command` and left the guard below **green** as it
 * was written. The condition it is named for was live in one spelling and blind in the other, and the
 * blind one is the reachable one.
 */
const inside = (path: string, folder: string): boolean =>
  path.startsWith(`${folder}/`) || path.includes(`/${folder}/`)

describe('the archive somebody installs', () => {
  /**
   * The guard this unit is about.
   *
   * It asks for the one contract whose reference implementation is the largest of the five, installs
   * it out of a package that has never seen this working tree, and compares the bytes on disk with the
   * bytes in `contracts/`. Everything the archive has to get right is on that path: the whitelist, the
   * compiled graph, the artefact, the bin entry, and the offline install.
   */
  it('an-archive-installs-a-feature-whose-bytes-are-the-catalogues', () => {
    expect(archive.toopo('init', '--dir', THE_DIRECTORY).status).toBe(0)

    const added = archive.toopo('add', 'string/slugify')

    expect(added.stderr).toBe('')
    expect(added.status).toBe(0)
    expect(added.stdout).toContain('string/slugify@1')

    const written = archive.project.installed('string/slugify/slugify.ts')
    const catalogue = readFileSync(join(REPOSITORY, 'contracts/string/slugify/reference.ts'))

    expect(digestOfBytes(servedBytes(Buffer.from(written, 'utf8')))).toBe(
      digestOfBytes(servedBytes(catalogue)),
    )
  })

  /**
   * The first contact, from the archive, in a project that was never configured.
   *
   * **Everything else in this file runs `toopo init --dir` first, so the state a stranger actually
   * arrives in was the one state no guard here could reach.** Every contract page ends in
   * `toopo add <name>`; this is that line, typed once, by somebody who has read nothing else - and the
   * whole repository can be green while it fails, which is the argument this folder exists for.
   *
   * The folder is `lib/toopo` and nothing asked for it: the project has no `src`, so `proposeDirectory`
   * is what decides, out of somebody else's `node_modules`.
   */
  it('an-archive-installs-into-a-project-that-was-never-configured', () => {
    const fresh = archive.intoAFreshProject()
    try {
      const added = fresh.toopo('add', 'string/slugify')

      expect(added.stderr).toBe('')
      expect(added.status).toBe(0)
      expect(added.stdout).toContain('toopo.json  written')
      expect(added.stdout).toContain('features    lib/toopo')

      expect(
        JSON.parse(readFileSync(join(fresh.project.root, 'toopo.json'), 'utf8')),
      ).toEqual({ version: 1, directory: 'lib/toopo' })

      const written = readFileSync(join(fresh.project.root, 'lib/toopo/string/slugify/slugify.ts'))
      const catalogue = readFileSync(join(REPOSITORY, 'contracts/string/slugify/reference.ts'))

      expect(digestOfBytes(servedBytes(written))).toBe(digestOfBytes(servedBytes(catalogue)))
    } finally {
      fresh.remove()
    }
  })

  /**
   * The lockfile is the supply-chain claim of the whole project, so an installation that produced one
   * nobody could check would be the product's own argument failing where it is made.
   */
  it('the-lockfile-an-archive-writes-records-the-digest-the-registry-served', () => {
    const lockfile = JSON.parse(readFileSync(join(archive.project.root, 'toopo.lock'), 'utf8')) as {
      readonly features: readonly {
        readonly implementation: { readonly version: string }
        readonly files: readonly { readonly sha256: string; readonly served: { readonly sha256: string } }[]
      }[]
    }

    const catalogue = readFileSync(join(REPOSITORY, 'contracts/string/slugify/reference.ts'))
    const feature = lockfile.features[0]

    expect(feature?.implementation.version).toBe(THE_UNPUBLISHED_VERSION)
    expect(feature?.files.map((file) => file.served.sha256)).toEqual([
      digestOfBytes(servedBytes(catalogue)),
    ])
  })

  /**
   * The half of the whitelist that running one command cannot establish, measured by running all of
   * them.
   *
   * Every command is loaded under a recording loader and the union is what the archive is compared
   * against, so the set is derived from what node does rather than from a list beside it. The two
   * files read by path are named because neither is ever imported: `registry.json` is opened by
   * `published.ts`, which is the one module that knows where it sits, and `package.json` is npm's.
   *
   * **It found six the day it was written.** `cli/source.js`, `registry/field-map.js` and four more
   * were emitted because something is *typed* against them, shipped because `files` said `dist`, and
   * loaded by nothing - 44 kB of 362 kB. `build.ts` now drops them, and this is what says so.
   *
   * **And it found `LICENSE` the day that file existed**, which is the guard working and not a false
   * refusal. npm adds the licence, the readme and the changelog to every tarball whatever `files`
   * says, so they arrive without anybody choosing them - and no program will ever load a licence. They
   * are a third category rather than a widening of `readByPath`: that set is *read by this program at
   * a path it knows*, and these are read by a person, by npm's own web page, and by every licence
   * scanner a company runs before allowing an install. Naming them here is what stops the next
   * addition from being waved through under a set whose sentence it does not fit.
   */
  it('every-file-in-the-archive-is-loaded-by-a-command', () => {
    const loaded = new Set([
      ...archive.loadedBy('list'),
      ...archive.loadedBy('search', 'slugify'),
      ...archive.loadedBy('add', 'string/levenshtein'),
      ...archive.loadedBy('update'),
      ...archive.loadedBy('remove', 'string/levenshtein'),
    ])
    const readByPath = new Set(['package.json', 'dist/registry.json'])
    const readByAPerson = new Set(['LICENSE', 'README.md'])

    expect(
      archive.carries.filter(
        (path) => !readByPath.has(path) && !readByAPerson.has(path) && !loaded.has(path),
      ),
    ).toEqual([])
  })

  /**
   * What a user must never receive, named rather than left to the reachability guard.
   *
   * The two are not the same statement: reachability would also refuse a battery, but it would refuse
   * it as *an unreachable file* and this refuses it as *the instrument*. The distinction is worth a
   * guard of its own because the day somebody widens `files` to ship the contracts - which is a
   * defensible thing to want, and permanent rule 5 can be read as asking for it - the reachability
   * guard is the one they would edit, and this is the one that would still be there.
   */
  it('no-part-of-the-instrument-or-of-the-suite-is-in-the-archive', () => {
    const forbidden = archive.carries.filter(
      (path) =>
        inside(path, 'mutation') ||
        inside(path, 'site') ||
        path.includes('.battery.') ||
        path.endsWith('.test.js') ||
        path.endsWith('.test-d.js') ||
        path.includes('vitest'),
    )

    expect(forbidden).toEqual([])
  })

  /**
   * Permanent rule 3 says an installation is served only from the registry's immutable snapshot.
   * In an archive that snapshot is a file inside it, so nothing an installation does may reach a
   * socket - and the one place a network name occurs in the whole archive is the security filter's
   * own list of names it refuses, which is data.
   */
  it('the-archive-reaches-no-network', () => {
    const reaching = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => {
        const text = readFileSync(join(archive.installedAt, path), 'utf8')

        return /from\s*['"]node:(http|https|net|tls|dgram)['"]/.test(text) || /\bfetch\s*\(/.test(text)
      })

    expect(reaching).toEqual([])
  })

  /**
   * A version that looks published and is not turns the lockfile's own argument against it, which is
   * the sentence `local-source.ts` already carries about the version it binds implementations at. The
   * package carries the same string for the same reason, and tying them here is what stops one of them
   * being quietly stamped `1.0.0` while the other says nothing was ever published.
   */
  it('the-archive-is-visibly-unpublished', () => {
    const manifest = JSON.parse(readFileSync(join(REPOSITORY, 'package.json'), 'utf8')) as {
      readonly version: string
      readonly private: boolean
    }

    expect(manifest.version).toBe(THE_UNPUBLISHED_VERSION)
    expect(manifest.private).toBe(true)
  })

  /**
   * npm writes the shim, and it writes it from `bin`. Running the entry point directly - which every
   * other guard here does - would leave a `bin` pointing at a file that does not exist looking exactly
   * like a `bin` that works.
   */
  it('npm-writes-a-shim-for-the-command-the-site-tells-people-to-run', () => {
    const shims = join(archive.project.root, 'node_modules', '.bin')

    expect(existsSync(join(shims, 'toopo')) || existsSync(join(shims, 'toopo.cmd'))).toBe(true)
    expect(existsSync(archive.entryPoint)).toBe(true)
  })
})
