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

import type { ContractAddress } from './address.js'

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
   * How deep the dependency tree goes. Zero for every implementation this catalogue will ever serve,
   * because permanent rule 2 forbids an external dependency inside a feature - so the field records
   * a fact a reader can check rather than a promise, and a submission that is not zero is refused by
   * a rule rather than by taste.
   */
  readonly dependencyDepth: number
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
// The lockfile
// ---------------------------------------------------------------------------

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
  /** Every file that was written into the project, with the hash the registry served. */
  readonly files: readonly HarnessFile[]
  readonly installedAt: string
  readonly locallyModified: boolean
}

export type Lockfile = {
  readonly version: 1
  readonly features: readonly LockedFeature[]
}
