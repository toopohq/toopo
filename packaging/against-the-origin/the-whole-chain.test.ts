import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { ContractAddress } from '../../packages/registry/address.js'
import { THE_ORIGIN, renderContract } from '../../packages/registry/address.js'
import { digestOfBytes } from '../../packages/registry/canonical.js'
import { endpointOf, pathTo } from '../../packages/registry/endpoints.js'
import type { Lockfile } from '../../packages/registry/implementation-record.js'
import type { InstalledArchive, Ran } from '../the-archive.js'
import { anInstalledArchive } from '../the-archive.js'

/**
 * The whole chain, once, against the registry this project publishes. ADR-0104.
 *
 * ---------------------------------------------------------------------------
 * The debt this closes, and the two thirds of it that come back
 * ---------------------------------------------------------------------------
 *
 * Three guards left `packaging/` when the catalogue left the archive: they installed a real feature
 * out of a real tarball and compared the bytes on disk with the bytes in `contracts/`, and they
 * worked because the catalogue travelled inside the archive. ADR-0092 recorded the loss as dated
 * rather than decided, and named the event that would end it - the first deployment answering on
 * `https://toopo.dev`. That deployment exists.
 *
 * **Two of the three come back here**, one of them stronger than it was: a feature installed into a
 * project that was never configured, and a lockfile recording the digest the registry served - which
 * is now a digest that crossed a wire rather than one a packaged file carried.
 *
 * **The third does not, and the reason is a comparison that would be red with nothing wrong.** It
 * compared the installed bytes against `contracts/` on disk; the origin serves the last *deployed*
 * commit, which is not this working tree during a unit that touches a contract. What stands in its
 * place is the arithmetic half - the bytes are compared against the digest the registry announced,
 * read here independently of the client that installed them. What is therefore not established is
 * that the digest names the catalogue's own bytes, which is the registry's single believed step.
 * `CLAUDE.md` carries it with the mechanism that would close it and its price.
 *
 * ---------------------------------------------------------------------------
 * Two statements, because one of them would be a tautology
 * ---------------------------------------------------------------------------
 *
 * The lockfile records `served.sha256`, and comparing the file on disk against it would check the
 * client against itself: a client that recorded the on-disk digest in that field would pass. So this
 * file asks the registry what it announces - the binding, then the snapshot behind it - and compares
 * *that* against what landed. It is the independent redeclaration this repository already runs on,
 * where the second statement is what makes the first checkable, and it is two requests.
 *
 * It reads the registry's own `status: 'default'` rather than calling `bindingFor`. Reusing the
 * client's chooser would put the thing under measurement on both sides of the comparison.
 *
 * ---------------------------------------------------------------------------
 * How a red says which of the two it is
 * ---------------------------------------------------------------------------
 *
 * A guard over a network is red on a defect and red on an outage, and a reader has to know in one
 * line whether to repair something or to wait. So the origin is asked before anything is packed, and
 * asked **again** if the chain fails - which makes the classification a measurement taken at the
 * moment of failure rather than a guess taken before it.
 *
 * **The case it does not separate, named rather than left to look covered:** an origin that answers
 * and serves a wrong body - a truncated blob, a corrupted index - arrives as a failure with the
 * origin reachable, and is classed as the product. That is right about the action, since the
 * deployment is ours, and wrong about the place: the repair would be in the emission.
 *
 * ---------------------------------------------------------------------------
 * Nothing here throws out of a hook
 * ---------------------------------------------------------------------------
 *
 * `beforeAll` captures what happened and never rethrows it. A hook that throws makes a file
 * unstartable, and its guards are then reported *skipped* - which `assertWholeSuiteRan` cannot tell
 * from a guard that passed, because it compares a total against a total. That is an open entry of
 * `CLAUDE.md`, found one unit ago on this repository, and it is a constraint on this file rather than
 * a remark about another: every guard below runs, whatever the origin did.
 */

/**
 * The contract this installs, declared once and rendered by the registry's own renderer.
 *
 * It is the line every contract page ends in and the one `CLAUDE.md` quotes, so a registry that
 * stopped resolving it is a real red rather than an accident of which contract was picked. `name` is
 * exactly what a user types after `toopo add`, which is why the address is spelled once here and
 * never as a URL.
 */
const THE_CONTRACT: ContractAddress = { language: 'typescript', name: 'number/parse', major: 1 }

/** Where the guard installs, which is `toopo add`'s own proposal in a project that has none. */
const CONFIGURATION_FILE = 'toopo.json'
const LOCKFILE = 'toopo.lock'

const UNAVAILABLE = 'THE ORIGIN DID NOT ANSWER - nothing about the product is established by this run.'
const THE_PRODUCT = 'THE ORIGIN ANSWERED AND THE CHAIN FAILED - this is the product.'

/** What this machine saw when it asked the origin one question, and nothing about why. ADR-0042. */
type Reachability = {
  readonly url: string
  readonly reached: boolean
  /** The status, or the failure as this machine phrased it. Never a cause. */
  readonly said: string
  /** Every contract the index lists, rendered. Empty where the question was not answered. */
  readonly catalogue: readonly string[]
}

/** What the registry announces about the implementation a client with no `--implementation` takes. */
type Announced = {
  /** The revision the binding declares it was served from. Reported, never resolved - see below. */
  readonly revision: string
  readonly implementation: { readonly id: string; readonly version: string }
  readonly digest: string
  readonly files: readonly { readonly path: string; readonly sha256: string; readonly bytes: number }[]
}

type Chain = {
  readonly before: Reachability
  /** Asked again only when something failed, which is what tells an outage from a defect. */
  readonly after: Reachability | null
  readonly announced: Announced | null
  readonly ran: Ran | null
  /** What stopped the chain, as this machine saw it, or `null` where nothing did. */
  readonly stopped: string | null
}

const url = (path: string): string => `${THE_ORIGIN}${path}`

const asked = async (path: string): Promise<unknown> => {
  const at = url(path)
  const response = await fetch(at)
  if (!response.ok) throw new Error(`${at} answered ${response.status}`)

  return response.json()
}

/**
 * One question to the origin, whose answer is *reached or not* and what this machine saw.
 *
 * The index is the address asked, because it is the one answer every registry has and because its
 * body says whether this catalogue is the one being served - so the reachability probe and the
 * catalogue check are one request rather than two.
 */
const theOriginAnswers = async (): Promise<Reachability> => {
  const at = url(pathTo(endpointOf('contract-index')))

  try {
    const response = await fetch(at)
    if (!response.ok) {
      return { url: at, reached: false, said: `it answered ${response.status}`, catalogue: [] }
    }

    const body = (await response.json()) as {
      readonly entries: readonly { readonly address: ContractAddress }[]
    }

    return {
      url: at,
      reached: true,
      said: 'it answered 200',
      catalogue: body.entries.map((entry) => renderContract(entry.address)),
    }
  } catch (error) {
    return {
      url: at,
      reached: false,
      said: error instanceof Error ? error.message : String(error),
      catalogue: [],
    }
  }
}

/**
 * What the registry says about this contract, read straight off two answers.
 *
 * Exactly one binding must carry `status: 'default'`, which is the field the client reads when no
 * implementation is named. A second default is not a fault of this guard to work around: it is a
 * registry a client would refuse, and a red here is the right way to learn of it.
 */
const whatTheRegistryAnnounces = async (): Promise<Announced> => {
  const rendered = renderContract(THE_CONTRACT)
  const bindings = (await asked(
    pathTo(endpointOf('implementation-bindings'), rendered),
  )) as readonly {
    readonly servedFrom: string
    // The whole implementation address, contract included. The lockfile records the two parts under
    // it, which is why the projection below is written out rather than the object compared whole.
    readonly address: { readonly id: string; readonly version: string }
    readonly digest: string
    readonly status: string
  }[]

  const defaults = bindings.filter((binding) => binding.status === 'default')
  const binding = defaults[0]
  if (binding === undefined || defaults.length !== 1) {
    throw new Error(
      `${rendered} has ${defaults.length} implementations the registry makes default, and a client ` +
        `with no --implementation takes exactly one`,
    )
  }

  const snapshot = (await asked(pathTo(endpointOf('snapshot'), binding.digest))) as {
    readonly canonicalText: string
  }
  const frozen = (JSON.parse(snapshot.canonicalText) as {
    readonly frozen: {
      readonly files: readonly { readonly path: string; readonly sha256: string; readonly bytes: number }[]
    }
  }).frozen

  return {
    revision: binding.servedFrom,
    implementation: { id: binding.address.id, version: binding.address.version },
    digest: binding.digest,
    files: frozen.files,
  }
}

let chain: Chain
let archive: InstalledArchive | undefined

/**
 * The commit the measurement was taken against, said in the log of every run rather than only of a
 * failing one.
 *
 * A deployment returns before it has propagated, so the revision answering here is the one that is
 * live and not necessarily this checkout's head - and a reader who sees a commit that is not theirs
 * has to understand it on the line they are reading, not deduce it. It is reported and never
 * resolved against this clone: a clone legitimately behind the origin does not hold a commit the
 * origin already serves, and asserting it would be a red with nothing wrong. `CLAUDE.md` carries
 * what that leaves open.
 */
const report = (): void => {
  const revision = chain.announced?.revision

  process.stdout.write(
    revision === undefined
      ? `\n  against ${THE_ORIGIN}, which did not say what it serves: ${chain.before.said}\n\n`
      : `\n  against ${THE_ORIGIN}, which is serving ${revision}\n` +
          `  that is the deployed commit, which need not be this checkout's head\n\n`,
  )
}

beforeAll(async () => {
  const before = await theOriginAnswers()

  if (!before.reached) {
    chain = { before, after: null, announced: null, ran: null, stopped: null }
    report()

    return
  }

  let announced: Announced | null = null
  let ran: Ran | null = null
  let stopped: string | null = null

  try {
    announced = await whatTheRegistryAnnounces()
    archive = anInstalledArchive()
    ran = archive.toopo('add', THE_CONTRACT.name)

    if (ran.status !== 0) {
      stopped =
        `\`toopo add ${THE_CONTRACT.name}\` exited ${ran.status}\n` +
        `${ran.stdout}${ran.stderr}`.trimEnd()
    }
  } catch (error) {
    stopped = error instanceof Error ? error.message : String(error)
  }

  chain = { before, after: stopped === null ? null : await theOriginAnswers(), announced, ran, stopped }
  report()
})

afterAll(() => {
  archive?.remove()
})

const unavailable = (seen: Reachability, when: string): readonly string[] => [
  UNAVAILABLE,
  `  ${seen.url}: ${seen.said}`,
  `  ${when}`,
  '  Wait, or open the address above. This run measured the origin and not the product, so there ' +
    'is nothing here to repair.',
]

/** The origin as an obstacle, or nothing. The one guard that is about availability itself. */
const whyTheOriginIsUnusable = (): readonly string[] =>
  chain.before.reached ? [] : unavailable(chain.before, 'it did not answer this run at all')

/**
 * Why the chain did not finish, classified, or nothing. Every guard below the first begins here.
 *
 * The order is the classification: an origin that never answered, then one that stopped answering
 * while this ran, then a failure with the origin reachable on both sides of it - which is the only
 * arm that says *repair*.
 */
const whatStopped = (): readonly string[] => {
  if (!chain.before.reached) return unavailable(chain.before, 'it did not answer this run at all')
  if (chain.stopped === null) return []
  if (chain.after !== null && !chain.after.reached) {
    return unavailable(chain.after, 'it answered before this run and not after, so it went away while this ran')
  }

  return [
    THE_PRODUCT,
    `  ${chain.before.url}: reached before this run and after it`,
    ...chain.stopped.split('\n').map((line) => `  ${line}`),
  ]
}

/** What `toopo add` wrote, read off the project rather than off a path this file spells. */
const installedUnder = (): string => {
  const configuration = JSON.parse(
    readFileSync(join(project(), CONFIGURATION_FILE), 'utf8'),
  ) as { readonly directory: string }

  return configuration.directory
}

const project = (): string => (archive as InstalledArchive).project.root

const lockfile = (): Lockfile =>
  JSON.parse(readFileSync(join(project(), LOCKFILE), 'utf8')) as Lockfile

/** A commit as git renders one. The shape is asserted; which commit it is, is reported. */
const A_REVISION = /^[0-9a-f]{40}$/

describe('the archive against the registry this project publishes', () => {
  /**
   * The origin is up and it is serving this catalogue.
   *
   * Both halves of one answer: a host that responds with somebody else's index is reachable and
   * useless, and the three guards after this one would fail on it without saying why.
   */
  it('the-origin-answers-and-serves-this-catalogue', () => {
    expect(whyTheOriginIsUnusable()).toEqual([])
    expect(chain.before.catalogue).toContain(renderContract(THE_CONTRACT))
  })

  /**
   * The proof that left this folder with the catalogue, back: a tarball built here, installed, and
   * run in a project that holds nothing at all.
   *
   * `toopo init` is never run. The project the archive was installed into carries a `package.json`
   * and nothing else, so `add` is the command choosing a folder, writing the configuration and
   * writing the lockfile - which is the state no other guard of this repository can reach, because
   * every one of them starts from a registry this process serves.
   */
  it('an-archive-installs-a-feature-into-a-project-that-was-never-configured', () => {
    expect(whatStopped()).toEqual([])

    const held = lockfile()
    const feature = held.features[0]

    expect(held.features).toHaveLength(1)
    expect(feature?.contract).toEqual(THE_CONTRACT)
    expect(feature?.askedFor).toBe(true)
    expect(
      (feature?.files ?? []).map((file) => existsSync(join(project(), installedUnder(), file.path))),
    ).toEqual((feature?.files ?? []).map(() => true))
  })

  /**
   * The bytes on disk are the bytes the digest names, and the digest is the registry's own word for
   * it rather than the client's record of it.
   *
   * Every announced file is compared, matched by the path it was served at - so an implementation
   * that grows a second file is covered by the guard as written rather than by somebody remembering
   * to widen it.
   */
  it('the-bytes-installed-are-the-bytes-the-digest-names', () => {
    expect(whatStopped()).toEqual([])

    const announced = chain.announced as Announced
    const feature = lockfile().features[0]
    const under = installedUnder()

    expect(
      announced.files.map((file) => {
        const written = feature?.files.find((held) => held.served.path === file.path)
        if (written === undefined) return `${file.path}: nothing the install wrote was served at it`

        const bytes = readFileSync(join(project(), under, written.path))

        return `${file.path}: ${digestOfBytes(bytes)} ${bytes.byteLength}`
      }),
    ).toEqual(announced.files.map((file) => `${file.path}: ${file.sha256} ${file.bytes}`))
  })

  /**
   * The lockfile records what the registry served, which is the third of the lost guards and the one
   * that gained by the move: the digest it names crossed a wire, so the record is about a fetch
   * rather than about a file that shipped beside the tool.
   *
   * `servedFrom` is asserted in shape and reported by value. Resolving it against this clone's graph
   * would be red whenever the clone is behind the deployment, which is an ordinary state and not a
   * defect; what it leaves open - an invented revision passes - is on the open list with the
   * resolution that would close it.
   */
  it('the-lockfile-an-archive-writes-records-the-digest-the-registry-served', () => {
    expect(whatStopped()).toEqual([])

    const announced = chain.announced as Announced
    const feature = lockfile().features[0]

    expect(feature?.implementation).toEqual(announced.implementation)
    expect(feature?.locallyModified).toBe(false)
    expect(feature?.servedFrom).toMatch(A_REVISION)
    expect((feature?.files ?? []).map((file) => file.served.sha256).sort()).toEqual(
      announced.files.map((file) => file.sha256).sort(),
    )

    // The other field of the pair is the lockfile's claim about the disk rather than about the wire,
    // so it is checked against the disk. The two digests differ on any file whose import was
    // repointed, which is why neither stands in for the other here.
    const under = installedUnder()

    expect(
      (feature?.files ?? []).map(
        (file) => digestOfBytes(readFileSync(join(project(), under, file.path))) === file.sha256,
      ),
    ).toEqual((feature?.files ?? []).map(() => true))
  })
})
