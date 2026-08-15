/**
 * The implementations that compete under a contract, and the file the user's project keeps.
 *
 * ADR-0063 is what a field the closed launch cannot fill answers, and why the fields an open registry
 * needs are carried before there is a second implementation of anything.
 */

import type { ContractAddress, ImplementationAddress } from './address.js'
import { renderImplementation, sameContract } from './address.js'

/** A file of an implementation or of a harness, with the hash the lockfile compares against. ADR-0064. */
export type HarnessFile = {
  /** Relative to the contract folder, as the instrument's edits already address a file. */
  readonly path: string
  readonly sha256: string
  readonly bytes: number
}

/** `demoted` is a de-listing and never a withdrawal, which is permanent rule 6 one level down. ADR-0065. */
export type ImplementationStatus = 'listed' | 'default' | 'demoted'

/** One edge of the dependency graph: which implementation, and the digest that *is* it. ADR-0066. */
export type DependencyEdge = {
  readonly implementation: ImplementationAddress
  /** The digest of the implementation snapshot this edge names. */
  readonly digest: string
}

/** A figure measured on a real machine, carrying the environment that decides it. ADR-0063. */
export type BenchmarkFigure = {
  readonly profile: string
  readonly environment: string
  readonly nanosecondsPerCall: number
  readonly referenceMachine: string
  readonly measuredOn: string
}

export type ImplementationRecord = {
  /** Unique within the contract, frozen, and an address like every other identifier here. ADR-0017. */
  readonly id: string
  readonly contract: ContractAddress
  readonly author: string
  /** Moves while the contract's major does not, or `null` while nothing has published it. ADR-0063. */
  readonly version: string | null
  readonly status: ImplementationStatus
  readonly files: readonly HarnessFile[]
  /** The registry features this one imports, each at the version it was published against. ADR-0067. */
  readonly dependsOn: readonly DependencyEdge[]
  /** The size a bundler would ship, or `null` while nothing has measured it. ADR-0063. */
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

/** What the walk below needs of an implementation, which is what a snapshot carries. ADR-0068. */
export type DependencyNode = {
  readonly id: string
  readonly contract: ContractAddress
  readonly version: string | null
  readonly dependsOn: readonly DependencyEdge[]
}

/** Why this artefact is not the one that address names. Empty when it is. ADR-0069. */
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

/** The implementation an edge names, or a refusal saying which one is missing. ADR-0069. */
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
 * ADR-0070 is why the order is part of the answer and a cycle is refused rather than survived.
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

/** How deep the tree under an implementation goes, read off the edges rather than declared. ADR-0067. */
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

/** One file of an installed feature: what was served, and what landed on disk. ADR-0071. */
export type InstalledFile = {
  readonly path: string
  readonly served: HarnessFile
  readonly sha256: string
  readonly bytes: number
}

/** One installed feature, as a projection of what the registry already names. ADR-0072. */
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
  /** True when the user typed this feature's name, false when it arrived through an edge. ADR-0073. */
  readonly askedFor: boolean
}

/** The version of `toopo.lock` this schema describes, and it moves when the shape does. ADR-0074. */
export const LOCKFILE_VERSION = 2

/** The whole of what a project holds, its version typed by the constant above. ADR-0072. */
export type Lockfile = {
  readonly version: typeof LOCKFILE_VERSION
  readonly features: readonly LockedFeature[]
}
