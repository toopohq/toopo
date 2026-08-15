/**
 * The implementations that compete under a contract, and the file the user's project keeps.
 *
 * The launch is closed and the founder writes everything, so every contract has exactly one
 * implementation today: its own reference. The list is still a list, and the fields below are still
 * the fields an open registry needs, because retrofitting a one-to-many relation into a published
 * schema costs far more than carrying it from the start - and a published version is frozen for life.
 *
 * What is *not* carried is anything a submission process would need and no implementation can fill:
 * there is no review state, no submitter identity, no competition ranking. Those belong to the
 * publishing tool, which is the fourth unit, and inventing them here would be inventing the tool.
 */

import type { ContractAddress, ImplementationAddress } from './address.js'
import { renderImplementation, sameContract } from './address.js'

/**
 * A file of an implementation or of a harness, with the hash the lockfile compares against.
 *
 * SHA-256 over the bytes as committed. It is what makes "never update user code silently" checkable
 * from the user's side rather than promised from the registry's: the lockfile holds the hash the
 * registry served, the file on disk hashes to something, and a difference is a local modification
 * whether the user remembers making it or not.
 *
 * This is also the whole of what the registry says about the executable half of a contract. The
 * bodies of `outputsAreEqual`, of the properties and of the key functions are in these files and in
 * no field of any record.
 */
export type HarnessFile = {
  /** Relative to the contract folder, as the instrument's edits already address a file. */
  readonly path: string
  readonly sha256: string
  readonly bytes: number
}

/**
 * Where an implementation stands in the registry.
 *
 * `demoted` is not `removed`, and the difference is permanent rule 6 applied one level down: a
 * version that was ever served goes on being served, so an implementation found wanting is
 * de-listed from the default position rather than withdrawn from under the projects that already
 * installed it.
 */
export type ImplementationStatus = 'listed' | 'default' | 'demoted'

/**
 * One edge of the dependency graph: which implementation, and the digest of the snapshot that *is* it.
 *
 * **The digest is the whole of this type, and what it buys is that the edge stops being a question.**
 * An edge carrying an address alone names something the registry must then be asked to resolve, and
 * that answer is `implementation-bindings` - a named answer, which is the registry's word and nothing a
 * reader can check. Carrying the digest makes the step arithmetic: the client fetches a
 * content-addressed snapshot and hashes what arrives. Measured on the imagined graph, `toopo add
 * number/round` goes from believing five named answers to believing one, and from eight round trips to
 * six, because the round trips that disappear are exactly the ones spent asking which digest an edge
 * resolves to.
 *
 * **A type of its own rather than a coordinate added to `ImplementationAddress`.** That address is also
 * `PublishedImplementation.address` and `ServedImplementationBinding.address`, where a `digest` field
 * already sits beside it - widening it would write one fact twice into a served body, which is the drift
 * this schema refuses everywhere else.
 *
 * **An edge is built by `edgeTo` and never written by hand.** The digest is derived from the target's
 * own snapshot, so a wrong one is unconstructible here rather than forbidden by a sentence. What that
 * cannot reach is an edge arriving from somewhere else - which is why `declarationFaults` below is a
 * check and not a second derivation.
 */
export type DependencyEdge = {
  readonly implementation: ImplementationAddress
  /** The digest of the implementation snapshot this edge names. */
  readonly digest: string
}

/**
 * A figure measured on a real machine. Empty for every implementation of the five, for the reason
 * block 4.5 gives: there is no reference machine yet, and a number produced on a developer laptop
 * would be dishonest.
 *
 * The environment is part of the figure rather than of the implementation, because the same code has
 * different numbers on node, in a browser and on bun, and a single number would be an average of
 * three things nobody runs.
 */
export type BenchmarkFigure = {
  readonly profile: string
  readonly environment: string
  readonly nanosecondsPerCall: number
  readonly referenceMachine: string
  readonly measuredOn: string
}

export type ImplementationRecord = {
  /** Unique within the contract, frozen, and an address like every other identifier here. */
  readonly id: string
  readonly contract: ContractAddress
  readonly author: string
  /**
   * The implementation's own version, which moves while the contract's major does not, or `null`
   * while nothing has published it.
   *
   * `null` for all five. A version is assigned by the publishing tool, which is the fourth unit, and
   * the five references have never been published - so writing `1.0.0` here would be inventing a
   * fact about a release that has not happened. The lockfile below takes a `string` and not this
   * type, because a lockfile only ever records something that was served.
   */
  readonly version: string | null
  readonly status: ImplementationStatus
  readonly files: readonly HarnessFile[]
  /**
   * The registry features this one imports, directly, each at the version it was published against.
   * Empty for every implementation of the five.
   *
   * **This field used to be a depth, and the read API is what proved a depth insufficient.** `toopo
   * add` has to resolve dependencies recursively and deduplicate a shared file, and neither operation
   * can be performed against a number: a depth is the *summary* of a walk over edges, so it can be
   * derived from them and they cannot be recovered from it. Carrying the summary and not the fact is
   * the shape of mistake `canonical.ts` refuses one level down when it returns the canonical text
   * rather than only the digest - a consumer needs the thing that reproduces the answer.
   *
   * The depth is still published, by `dependencyDepthOf` below, and permanent rule 2 is still what it
   * measures: a feature depends only on other registry features, so an edge leaving this catalogue is
   * unrepresentable rather than refused - `ImplementationAddress` cannot name one.
   *
   * Frozen, and it belongs in the digest: what a published artefact imports is part of what it *is*,
   * and an edge that could be edited afterwards would let the bytes installed under a fixed digest
   * change meaning without the digest moving. That is also what makes the digest each edge carries
   * worth its bytes: it is frozen with the edge, so the whole closure hangs off one root digest.
   */
  readonly dependsOn: readonly DependencyEdge[]
  /**
   * The size a bundler would ship, in bytes, or `null` when nothing has measured it.
   *
   * `null` for all five. Producing it needs a minifier, the repository is limited to four dev
   * dependencies, and a figure invented from the source size would be a number with nothing behind
   * it. The field exists because the comparison it serves - two implementations of one contract, one
   * of them smaller - is the reason an implementation list exists at all; the null says the
   * comparison cannot be made yet.
   */
  readonly minifiedBytes: number | null
  readonly benchmarks: readonly BenchmarkFigure[]
  readonly tags: readonly string[]
}

// ---------------------------------------------------------------------------
// Resolution - the walk `toopo add` cannot perform against a number
// ---------------------------------------------------------------------------

export class UnresolvedDependency extends Error {
  constructor(where: string, detail: string) {
    super(`${where} cannot be resolved, and ${detail}`)
    this.name = 'UnresolvedDependency'
  }
}

/**
 * What the walk below needs of an implementation, which is exactly what a snapshot carries.
 *
 * **Written by approaching the consumer, like the edges themselves.** The walk used to require a whole
 * `ImplementationRecord`, and the client that performs it holds no such thing: `toopo add` fetches
 * snapshots, and a snapshot is a *projection* that deliberately leaves out the standing - the status,
 * the tags, the benchmarks, the minified size. An installer would have had to invent all four to call
 * a function whose answer depends on none of them, and inventing a standing is exactly how a client
 * comes to publish an opinion it was never given.
 *
 * So the parameter is the subset that decides the answer, and the walk is generic over it: a caller
 * holding records gets records back, a caller holding snapshots gets snapshots back, and neither has
 * to widen or narrow anything.
 */
export type DependencyNode = {
  readonly id: string
  readonly contract: ContractAddress
  readonly version: string | null
  readonly dependsOn: readonly DependencyEdge[]
}

/**
 * Why this artefact is not the one that address names. Empty when it is.
 *
 * **The one rule that closes both halves of the same hole, which is why it is one function.** A client
 * obtains a snapshot for an address in two ways and neither of them establishes that what arrived is
 * what was asked for. Through a *binding*, the registry is asked which digest a name resolves to and is
 * believed. Through an *edge*, the digest is carried and the name is not checked against it at all - so
 * an edge naming `string/pad@1/reference@1.0.0` while carrying the digest of `number/sign@1`'s snapshot
 * is answered honestly by any registry, verified perfectly by `servedSnapshotFaults`, and installs the
 * other feature.
 *
 * Before the edges carried a digest the second half was covered by accident: `gatherHoldings` found the
 * digest by matching `id` and `version` in the bindings, so the identity was established by the lookup.
 * That lookup is exactly the round trip an edge's digest removes. **So the field that buys the round
 * trips is also what takes the check away, and this is the check put back where it can cover both.**
 *
 * It takes a `DependencyNode` rather than a `FrozenImplementation` for the reason that type exists: the
 * subset that decides the answer, so that a caller holding either can ask without widening anything -
 * and so that this module needs no import from `snapshot.ts`, which imports it.
 *
 * The three parts are compared rather than their rendering, and the rendering is used only to say so.
 * `renderImplementation` joins an id and a version with `@`, and nothing in this schema refuses an id
 * that carries one - so a comparison of two renderings would be a comparison that can be right about
 * two strings and wrong about two artefacts.
 *
 * An unpublished artefact is the one that answers nothing rather than the wrong thing, and it is said
 * separately: an address carries a `string` version, `null` is what a record holds until the publishing
 * tool assigns one, and *this has never been published* is a different sentence from *this is something
 * else*.
 */
export const declarationFaults = (
  held: DependencyNode,
  address: ImplementationAddress,
): readonly string[] => {
  const asked = renderImplementation(address)

  if (held.version === null) {
    return [
      `it is unpublished, where ${asked} names a published version. A snapshot with no version was ` +
        `never served under any address.`,
    ]
  }

  if (
    held.id === address.id &&
    held.version === address.version &&
    sameContract(held.contract, address.contract)
  ) {
    return []
  }

  const declared = renderImplementation({
    contract: held.contract,
    id: held.id,
    version: held.version,
  })

  return [
    `it declares itself ${declared}, where ${asked} is what was asked for. A snapshot says which ` +
      `artefact it is, so this is the wrong artefact rather than a damaged one.`,
  ]
}

/**
 * The implementation an edge names, or a refusal saying which one is missing.
 *
 * One lookup with one refusal, used by both walks below, because "the registry holds no such
 * implementation" is one fact about one edge and a second copy of it is a second thing that can come
 * to disagree.
 *
 * An unpublished implementation can never be returned, and that is `declarationFaults`' first branch
 * rather than a comparison that happens not to match. Every record below therefore has a version.
 *
 * **What it does not look at is the digest the edge carries**, and that is a division rather than an
 * omission. This walk runs on a client over snapshots that were *fetched by* that digest, so the pairing
 * has already been decided one floor up, in `heldAt`, where the thing that arrived can be compared with
 * the thing that was asked for. Asking again here would be a second guard over one fact, with nothing to
 * say for itself the day the two disagree.
 */
const mustHold = <T extends DependencyNode>(
  holdings: readonly T[],
  address: ImplementationAddress,
): T => {
  const found = holdings.find((candidate) => declarationFaults(candidate, address).length === 0)

  if (found === undefined) {
    throw new UnresolvedDependency(
      renderImplementation(address),
      'the registry holds no such published implementation',
    )
  }

  return found
}

/**
 * Every implementation an install of `root` must also write, dependencies before dependents, each
 * once. The root is not in it: what the caller asked for is not something it has to be told about.
 *
 * **Post-order, and the order is part of the answer.** An installer that wrote a dependent before its
 * dependency would leave the project broken between two writes, and an order that depended on the
 * shape of the graph would make two resolutions of one artefact two different answers - which is the
 * same failure `canonical.ts` closes for keys and this file's own `harnessOf` closes for files.
 *
 * **A cycle is refused rather than survived.** Two artefacts that import each other cannot both have
 * been published second, so a cycle is a corrupt ledger rather than an exotic graph, and an installer
 * that merely deduplicated its way out of one would write a project whose imports do not terminate.
 *
 * **What this does not answer, and the CLI must.** Which file lands where, and how an import inside a
 * copied file is rewritten to point at a shared one. A shared file is *recognisable* from what is
 * already returned - two implementations carrying one `sha256` are carrying one blob, and dedup is
 * that comparison - but rewriting an import means reading inside the file, and the inside of a file is
 * the executable half this registry serves and never models. The registry cannot serve it, and an
 * endpoint that claimed to would be publishing an opinion about code it does not parse.
 */
export const resolveDependencies = <T extends DependencyNode>(
  root: T,
  holdings: readonly T[],
): readonly T[] => {
  const resolved: T[] = []
  const seen = new Set<string>()

  const walk = (record: T, open: readonly string[]): void => {
    for (const edge of record.dependsOn) {
      const what = renderImplementation(edge.implementation)
      if (open.includes(what)) {
        throw new UnresolvedDependency(what, `it imports itself through ${[...open, what].join(' -> ')}`)
      }
      if (seen.has(what)) continue

      const next = mustHold(holdings, edge.implementation)
      walk(next, [...open, what])
      seen.add(what)
      resolved.push(next)
    }
  }

  // An unpublished root has no address, so no edge can name it and it cannot be part of a cycle.
  walk(
    root,
    root.version === null
      ? []
      : [renderImplementation({ contract: root.contract, id: root.id, version: root.version })],
  )

  return resolved
}

/**
 * How deep the tree under an implementation goes. Zero for every implementation of the five.
 *
 * Derived from the edges rather than declared beside them, which is the rule this repository already
 * applies to a profile's sample count and its encoded size: a figure read off the values is a fact and
 * has no second statement to disagree with, and a figure transcribed next to them is a claim that can
 * be wrong. It is published because permanent rule 2 is a promise a reader should be able to check
 * with one number, not because anything downstream computes with it.
 */
export const dependencyDepthOf = (
  root: DependencyNode,
  holdings: readonly DependencyNode[],
): number => {
  // Resolved first, so that a cycle is refused before this recursion meets it. Termination below
  // rests on that call having returned, and on nothing else.
  resolveDependencies(root, holdings)

  const depths = new Map<string, number>()

  const depthBelow = (edge: DependencyEdge): number => {
    const what = renderImplementation(edge.implementation)
    const memoised = depths.get(what)
    if (memoised !== undefined) return memoised

    const edges = mustHold(holdings, edge.implementation).dependsOn
    const depth = edges.length === 0 ? 0 : 1 + Math.max(...edges.map(depthBelow))
    depths.set(what, depth)

    return depth
  }

  return root.dependsOn.length === 0 ? 0 : 1 + Math.max(...root.dependsOn.map(depthBelow))
}

// ---------------------------------------------------------------------------
// The lockfile
// ---------------------------------------------------------------------------

/**
 * One file of an installed feature, as `toopo.lock` records it.
 *
 * **Two digests and not one, and that is a finding of the unit that wrote the installer rather than a
 * field somebody wanted.** This type used to be `HarnessFile`, on the reading that what was written is
 * what was served. It is not: a file whose import had to be pointed at a shared copy is written with
 * different bytes from the ones the registry served, so a lockfile holding only the served digest
 * would report every rewritten file as locally modified from the instant it was written - which is the
 * failure `canonical.ts` closes for line endings, arriving through a door the installer itself opens.
 *
 * `served` is the registry's fact, carried whole: the file as an implementation record addresses it,
 * under the name it has inside the contract folder. It is what a comparison with the registry is made
 * against. `path` is where it went, relative to the configured folder, and it differs from
 * `served.path` whenever the installer renamed or relocated the file. `sha256` and `bytes` describe
 * what is on disk, and they are what the offline check - the one whose whole value is that it needs
 * nothing from us - compares against.
 */
export type InstalledFile = {
  readonly path: string
  readonly served: HarnessFile
  readonly sha256: string
  readonly bytes: number
}

/**
 * One installed feature, as `toopo.lock` records it.
 *
 * It is in this unit because the CLI must not have to guess any of it: every part below is already
 * an address or a hash the registry holds, so the lockfile is a projection rather than a second
 * vocabulary. If the CLI had to invent a way to name an implementation, the registry and the
 * lockfile would drift the first time either changed.
 *
 * `locallyModified` is derived by the CLI from the hashes and stored anyway. Storing it is what lets
 * `toopo` tell "you edited this" from "we changed this underneath you" without a network call, which
 * is the difference between an honest diff and a surprising one.
 */
export type LockedFeature = {
  readonly contract: ContractAddress
  readonly implementation: {
    readonly id: string
    readonly version: string
  }
  /** Every file that was written into the project, with what was served and what landed. */
  readonly files: readonly InstalledFile[]
  readonly installedAt: string
  readonly locallyModified: boolean
  /**
   * True when the user typed this feature's name, false when it arrived through an edge.
   *
   * **The second finding this file owes to a consumer, and it is `toopo update`'s.** Without it the
   * lockfile is a flat set of features with no root, and an update has two ways to guess which of them
   * to resolve from - both of which are wrong, each for its own reason.
   *
   * Treating every entry as a root resolves a *dependency* independently, so it climbs to whatever
   * version its own binding names today rather than to the one its dependent was published against -
   * and the project ends up holding a combination nobody ever published. Deriving the roots instead
   * from "what no other locked feature depends on" reads the edges as they are *now*, which is
   * precisely what an update is trying to find out has moved; and it gets the ordinary case wrong
   * anyway, because a `string/pad` that was installed directly *and* is pulled in by `number/round`
   * would never again be updated on its own.
   *
   * So it is not derivable, and an absent field would produce an unpublished combination rather than a
   * missing convenience. It is **sticky towards true**: a feature that arrived as a dependency and is
   * later asked for by name becomes a root and stays one, because the user has said they want it, and
   * nothing an upstream graph does afterwards unsays that.
   */
  readonly askedFor: boolean
}

/**
 * The version of `toopo.lock` this schema describes.
 *
 * **It is 2 because `askedFor` was added to `LockedFeature` above, and a number that does not move
 * when the shape moves discriminates nothing.** Both shapes went out under the number 1 before that
 * was noticed - on the only file this project writes into somebody else's repository, whose whole
 * value is that it can be checked against a published fact.
 *
 * What stops it happening again is not this comment. `packages/cli/lockfile.ts` validates through a record
 * keyed by `keyof LockedFeature`, so a field added here does not compile until a check for it is
 * written - and the compiler asks the question at the moment the shape changes rather than leaving
 * it to be remembered.
 */
export const LOCKFILE_VERSION = 2

/**
 * The whole of what a project holds, as `toopo.lock` records it.
 *
 * `version` is typed by the constant rather than by a literal of its own, so the number the reader
 * checks and the number the writer writes are one fact.
 */
export type Lockfile = {
  readonly version: typeof LOCKFILE_VERSION
  readonly features: readonly LockedFeature[]
}
