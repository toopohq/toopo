import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { THE_INVOCATION, THE_ORIGIN } from '../packages/registry/address.js'
import { THE_PACKAGE_VERSION } from '../packages/registry/publication.js'
import { anInstalledArchive } from './the-archive.js'
import type { InstalledArchive } from './the-archive.js'

/**
 * What a user receives, proved by receiving it.
 *
 * ---------------------------------------------------------------------------
 * Why this suite exists at all
 * ---------------------------------------------------------------------------
 *
 * Every contract page the site publishes ends in `toopo add <name>`, and until this folder existed
 * nobody could run that line. Three independent things stopped them, and all three were invisible to
 * the guards this repository already had, because every one of them measures the working tree.
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
 * `the-catalogue.ts` -> a contract module -> `packages/catalogue/every-contract.ts`. vitest is a dev
 * dependency a user never receives, so the first command anybody ran would have ended in
 * `ERR_MODULE_NOT_FOUND`.
 *
 * This file is the only place in the repository where any of that is measured against what actually
 * ships: **the archive is built by `npm pack`, installed by `npm install`, and run by node out of the
 * user's `node_modules`.** Everything else here could be green while this is red.
 *
 * ---------------------------------------------------------------------------
 * What this file stopped measuring, and where it started again
 * ---------------------------------------------------------------------------
 *
 * **Three guards left here when the catalogue left the archive (ADR-0092).** They installed a real
 * feature out of a real archive and compared the bytes on disk with the bytes in `contracts/` -
 * `an-archive-installs-a-feature-whose-bytes-are-the-catalogues`,
 * `an-archive-installs-into-a-project-that-was-never-configured`, and
 * `the-lockfile-an-archive-writes-records-the-digest-the-registry-served`. They worked because the
 * catalogue travelled inside the archive, so an install needed nothing but the tarball.
 *
 * It does not travel any more, so an installed `toopo` asks `https://toopo.dev`, and `THE_ORIGIN` is a
 * constant with no override - deliberately, because the one thing a client cannot check by arithmetic
 * is which digest a name resolves to, and an override is exactly what would move it. So there is no
 * way from *this suite* to point the installed binary at a registry this process serves.
 *
 * **The debt closed on the event it named, and it closed one folder down rather than in this file.**
 * `packaging/against-the-origin/` installs from the archive against the real origin, and ADR-0104 is
 * why it is a suite of its own: the `packaging` battery replays this configuration once per cell, and
 * a guard over a live host inside it would make the instrument depend on one. Two of the three guards
 * come back there and the third does not, which that file states and `CLAUDE.md` prices.
 *
 * **What stays here is what needs no socket**, and it is the half that can be mutation-tested: the
 * installed CLI runs, reads a project, writes one, names the published origin, and carries nothing the
 * catalogue produces.
 *
 * ---------------------------------------------------------------------------
 * The two halves of a whitelist
 * ---------------------------------------------------------------------------
 *
 * `files` is a declaration, and this repository has found eight things that behave like rules with
 * nothing keeping them. So neither half of it is taken on trust.
 *
 * *Nothing is missing* is established by running the tool: a module left out of the archive is a
 * module the entry point cannot import, and every command below would end in `ERR_MODULE_NOT_FOUND`.
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
 * Measured, on the tarball rather than on the argument: shipping two modules of `packages/site/` that
 * way reddens `every-file-in-the-archive-is-loaded-by-a-command` and left the guard below **green** as
 * it was written. The condition it is named for was live in one spelling and blind in the other, and
 * the blind one is the reachable one.
 */
const inside = (path: string, folder: string): boolean =>
  path.startsWith(`${folder}/`) || path.includes(`/${folder}/`)

/** The bytes of one file of the tarball, as they sit in somebody's `node_modules`. */
const carried = (path: string): string => readFileSync(join(archive.installedAt, path), 'utf8')

describe('the archive somebody installs', () => {
  /**
   * The tool runs out of somebody else's `node_modules`, reads their project, and writes one.
   *
   * **It is the half of the end-to-end proof that needs no socket**: the whitelist, the compiled
   * graph, the `bin` entry, node's refusal to strip types under `node_modules`, and every module the
   * command loads are all on this path. What it does not reach is the registry, and what does is
   * `packaging/against-the-origin/`, kept apart for the reason the header gives.
   *
   * Three commands rather than one, because they are three different things the archive could get
   * wrong: printing a usage with no project at all, writing `toopo.json`, and refusing a `list` in a
   * project that has one and holds nothing. None of them opens a socket.
   */
  it('an-installed-toopo-runs-reads-a-project-and-writes-one', () => {
    const usage = archive.toopo()

    // The usage names the invocation once and the commands under it, so both halves are witnessed:
    // a header with no rows would print for a binary that knows none of its own commands.
    expect(usage.stdout).toContain(`usage: ${THE_INVOCATION} <command>`)
    expect(usage.stdout).toContain('add <domain>/<name>')

    expect(archive.toopo('init', '--dir', THE_DIRECTORY).status).toBe(0)
    expect(
      JSON.parse(readFileSync(join(archive.project.root, 'toopo.json'), 'utf8')),
    ).toEqual({ version: 1, directory: THE_DIRECTORY })

    const listed = archive.toopo('list')

    expect(listed.status).toBe(1)
    expect(listed.stdout).toContain('nothing is installed')
  })

  /**
   * The installed entry point names the registry this project publishes, and names no other.
   *
   * Read off the tarball rather than run, and that is a choice with a reason: running it would ask the
   * real `https://toopo.dev`, whose answer depends on whether this machine has a network and on what a
   * proxy in front of it does - so the guard would be measuring somebody's connection. What the bytes
   * establish is the whole of what a knob would break: one origin, named once, with nothing between it
   * and `httpSource`.
   *
   * The absence of an override is asserted as an absence, because that is what it is: no `process.env`
   * anywhere in the archive, and no `argv` outside the one module that parses a command line.
   */
  it('the-published-entry-point-names-one-origin-and-offers-no-way-to-change-it', () => {
    const entry = carried('dist/packages/cli/published.js')

    expect(entry).toContain('httpSource(THE_ORIGIN)')

    const namingAnOrigin = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => carried(path).includes('https://'))

    expect(namingAnOrigin).toEqual(['dist/packages/registry/address.js'])
    expect(carried('dist/packages/registry/address.js')).toContain(
      `export const THE_ORIGIN = '${THE_ORIGIN}'`,
    )

    const reachingForAKnob = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => /process\.env|process\.argv/.test(carried(path)))

    // `command.js` reads `process.argv`, which is the command line and not a registry. Nothing in the
    // archive reads an environment variable at all, and that is the half worth pinning: a knob would
    // arrive as one.
    expect(reachingForAKnob).toEqual(['dist/packages/cli/command.js'])
    expect(
      archive.carries.filter((path) => path.endsWith('.js')).filter((path) => carried(path).includes('process.env')),
    ).toEqual([])
  })

  /**
   * Nothing the archive carries ends the process itself.
   *
   * **This is ADR-0168's cause rather than its symptom, and it is the half that reddens everywhere.**
   * `process.exit` and `process.abort` stop node where it stands; after a `fetch` that races the
   * teardown of what the connection left behind, and on win32 libuv aborts on an assertion in
   * `src/win/async.c` - so `toopo add` of a name the registry does not hold printed a correct refusal
   * and then died with an exit code git-bash reads as *command not found*. `how-a-command-ends.test.ts`
   * is what watches the ending happen; **that suite can only be red where the race is lost**, and no
   * leg of this repository's CI runs on Windows. This one is red on the text wherever it runs.
   *
   * It is total over what ships rather than over a list somebody keeps: the population is the tarball's
   * own `.js`, so a module added to the archive joins it with nobody editing this guard. What it reads
   * is text, and it says so - `command.ts` answering a code rather than writing one is what makes the
   * behaviour reachable from a guard at all, and this is the claim that no second way back in appears.
   *
   * Seen red at `d962426` by putting `process.exit(1)` back in `refuse`, which named
   * `dist/packages/cli/command.js`.
   */
  it('no-module-the-archive-carries-ends-the-process-itself', () => {
    const endingItWhereItStands = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => /process\.(?:exit|abort)\s*\(/.test(carried(path)))

    expect(endingItWhereItStands).toEqual([])
  })

  /**
   * **The claim this unit is about: nothing the archive carries is produced by the catalogue.**
   *
   * The archive used to hold `registry.json`, every contract the registry serves with its files base64
   * inside it - 30 438 bytes at five contracts, of which 23 217 was source. Its size was therefore a
   * function of how many contracts existed, which is the one property that does not survive a
   * catalogue of any size.
   *
   * It is asserted over the tarball and over the one door the catalogue could come back through. Every
   * carried path is a compiled module of the tool, its manifest, or a file npm adds; and no carried
   * module reaches the serialisation, which is what `the-catalogue.js` and `packages/catalogue/` are. A
   * contract added to `contracts/` changes neither, which is the sentence *the archive does not grow
   * with the catalogue* said in a form something can fail.
   */
  it('nothing-the-archive-carries-is-produced-by-the-catalogue', () => {
    const fromTheCatalogue = archive.carries.filter(
      (path) =>
        path.endsWith('.json') && path !== 'package.json' && !path.endsWith('/package.json'),
    )

    expect(fromTheCatalogue).toEqual([])

    /**
     * The door is an import and not a word, so the specifiers are read rather than the text.
     *
     * A grep over the bytes matches a comment - measured: `address.js` mentions the catalogue in prose
     * and came back as a module reaching the serialisation, which is the lint-over-prose this
     * repository refuses everywhere else.
     */
    const importsOf = (path: string): readonly string[] =>
      [...carried(path).matchAll(/from\s*['"]([^'"]+)['"]/g)].map((match) => match[1] as string)

    /**
     * The three modules that turn `contracts/` into records, and not the folder they half live in.
     *
     * `packages/catalogue/identifier.js` ships and always has: it is the vocabulary a frozen identifier
     * is checked against, imported by `address.js`, and it holds no contract. `every-contract.js` is
     * the one beside it that does - it imports vitest, which is how the whole catalogue used to come
     * into the archive behind `the-catalogue.js`.
     */
    const theSerialisation = /(^|\/)(the-catalogue|serialise|every-contract)\.js$/

    const reachingIt = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => importsOf(path).some((specifier) => theSerialisation.test(specifier)))

    expect(reachingIt).toEqual([])
    expect(archive.carries.filter((path) => inside(path, 'contracts'))).toEqual([])
  })

  /**
   * The half of the whitelist that running one command cannot establish, measured by running all of
   * them that need no registry.
   *
   * Every command is loaded under a recording loader and the union is what the archive is compared
   * against, so the set is derived from what node does rather than from a list beside it. `command.ts`
   * imports the whole graph at module load, so a command that refuses for want of a project still
   * loads every module a command that succeeds would - which is what lets this stay complete without
   * opening a socket.
   *
   * **It found six the day it was written.** `packages/cli/source.js`, `packages/registry/field-map.js`
   * and four more were emitted because something is *typed* against them, shipped because `files` said
   * `dist`, and loaded by nothing - 44 kB of 362 kB. `build.ts` now drops them, and this is what says
   * so.
   *
   * **And it found `LICENSE` the day that file existed**, which is the guard working and not a false
   * refusal. npm adds the licence, the readme and the changelog to every tarball whatever `files`
   * says, so they arrive without anybody choosing them - and no program will ever load a licence. They
   * are a third category rather than a widening of `readByPath`: that set is *read by this program at a
   * path it knows*, and these are read by a person, by npm's own web page, and by every licence scanner
   * a company runs before allowing an install.
   */
  it('every-file-in-the-archive-is-loaded-by-a-command', () => {
    const loaded = new Set([
      ...archive.loadedBy(),
      ...archive.loadedBy('list'),
      ...archive.loadedBy('init'),
      ...archive.loadedBy('remove', 'string/levenshtein'),
    ])
    const readByPath = new Set(['package.json'])
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
   * **This guard used to say the opposite, and the inversion is the unit.**
   *
   * It read `the-archive-reaches-no-network`: permanent rule 3 says an installation is served only from
   * the registry's immutable snapshot, and while that snapshot travelled *inside* the archive nothing
   * an installation did could reach a socket. The snapshot is now at `https://toopo.dev`, so the
   * archive reaches the network by design - and permanent rule 3 is unchanged, because what it forbids
   * is being served from somewhere else.
   *
   * So what is checked is the narrower thing that is still true: **exactly one module opens a socket**,
   * and it is the one whose whole subject is the wire. A second would be a second place a request could
   * be made from, which is how a client comes to talk to something nobody decided it should.
   */
  it('the-archive-reaches-the-network-from-exactly-one-module', () => {
    const reaching = archive.carries
      .filter((path) => path.endsWith('.js'))
      .filter((path) => {
        const text = carried(path)

        return /from\s*['"]node:(http|https|net|tls|dgram)['"]/.test(text) || /\bfetch\s*\(/.test(text)
      })

    expect(reaching).toEqual(['dist/packages/cli/http-source.js'])
  })

  /**
   * The version a consumer installs is the version this code declares, read out of their `node_modules`.
   *
   * **This guard used to tie the manifest's version to the one implementations are bound at, and the
   * publication is what cuts that tie.** It was right while both were stand-ins saying *nothing here
   * was published*: one of them being quietly stamped `1.0.0` while the other denied it was the failure
   * worth refusing. Published, they answer different questions and must be free to differ - the package
   * moves on the next patch of the client, an implementation's version is half of a frozen address and
   * may never move - so a tie kept here would rebind four addresses on the first bug fix. ADR-0093 is
   * what refuses that, and it refuses it by rebuilding rather than by a comparison in this file.
   *
   * **What replaces it is the archive's own question rather than the repository's.**
   * `publication.test.ts` already resolves `package.json` against `THE_PACKAGE_VERSION`; reading the
   * same file again here would be that guard written twice. What nothing else reaches is the manifest
   * npm wrote into somebody's project, and the two are not the same object: `files`, `prepack` and npm's
   * own rewriting all sit between them.
   *
   * **It stays out of the `packaging` battery's reach, and for a better reason than the guard it
   * replaces.** That one read this repository's `package.json`; this one reads a manifest `npm pack`
   * produced from it. Neither end is a file this folder writes, so a mutant here cannot move either -
   * which is a stronger statement of unreachability than the old one, not a repetition of it.
   */
  it('the-installed-archive-carries-the-version-this-code-declares', () => {
    const manifest = JSON.parse(
      readFileSync(join(archive.installedAt, 'package.json'), 'utf8'),
    ) as { readonly version?: unknown; readonly private?: unknown }

    expect(manifest.version).toBe(THE_PACKAGE_VERSION)
    // npm refuses to pack a private package at all, so this is what a consumer's copy must not carry.
    expect(manifest.private).toBeUndefined()
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
