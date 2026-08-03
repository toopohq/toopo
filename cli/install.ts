/**
 * `toopo add`, from a name the user typed to the bytes that will be written.
 *
 * **Nothing here writes.** Every fetch, every verification, every refusal and the whole cost happen
 * before `commit` is called, and that function's first phase can only abandon. An install that
 * discovered a conflict after writing four files would have already changed the user's project, and the
 * user's project is the one thing this tool has no right to leave in a state nobody asked for.
 *
 * What it asks a registry for, and how each answer is checked, is `resolve.ts` - shared with `update`,
 * because the two commands ask for exactly the same things and differ only in where they start.
 */

import type { ContractAddress, ImplementationAddress } from '../registry/address.js'
import { renderContract, sameContract } from '../registry/address.js'
import { digestOfBytes } from '../registry/canonical.js'
import type { InstalledFile, LockedFeature, Lockfile } from '../registry/implementation-record.js'
import { dependencyDepthOf, resolveDependencies } from '../registry/implementation-record.js'
import type { ServedExport } from '../registry/response.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import type { Configuration } from './configuration.js'
import { digestOnDisk, withFeature } from './lockfile.js'
import type { InstallPlan } from './plan.js'
import { THE_ENTRY_FILE, planInstall } from './plan.js'
import { chooseContract, bindingFor, fetchedSources, gatherHoldings, heldAt, refused } from './resolve.js'
import { rewrittenSources } from './rewrite.js'
import type { RegistrySource } from './source.js'
import type { FileToWrite } from './write.js'

export type Cost = {
  readonly files: number
  readonly bytes: number
  readonly depth: number
}

export type PlannedWrite = FileToWrite & {
  /** True when the installer changed the bytes on the way in, by repointing an import. */
  readonly repointed: boolean
}

/**
 * What the user has to write to reach what they just installed.
 *
 * It is on the installation rather than derived by the report, because both parts come from decisions
 * this module took - where the entry file landed, and which contract's exports those are - and a report
 * that recomputed either would be a second opinion about a thing already settled.
 */
export type InstalledEntry = {
  /** Where the entry file landed, relative to the configured directory, with forward slashes. */
  readonly path: string
  /** The answer first, then whatever diagnostic ships beside it. */
  readonly exports: readonly ServedExport[]
}

export type Installation = {
  readonly contract: ContractAddress
  readonly summary: string
  readonly implementation: ImplementationAddress
  readonly cost: Cost
  readonly writes: readonly PlannedWrite[]
  readonly entry: InstalledEntry
  /**
   * One entry per feature, and not one entry claiming everything.
   *
   * An install of `number/round` writes four features, and the lockfile has to say so: a single entry
   * claiming all five files would leave `string/pad` installed and unrecorded, so a later
   * `toopo add string/pad` would find a file it did not write and refuse, and `toopo update` would
   * have nothing to compare it against.
   */
  readonly features: readonly LockedFeature[]
  /** Every feature this install pulls in besides the one that was asked for. */
  readonly dependencies: readonly ImplementationAddress[]
  /** What deduplication actually did: a destination written once, and who else carries that file. */
  readonly shared: readonly SharedFile[]
}

/**
 * One file two or more features carry, written in the folder of the first and named by the others.
 *
 * `alsoCarriedBy` rather than a count, because the line the user reads has to say *which* feature they
 * are now sharing a file with. "shared, written once" describes what the installer did; a name tells
 * them what their project now looks like.
 */
export type SharedFile = {
  readonly path: string
  readonly alsoCarriedBy: readonly string[]
}

export type InstallOutcome =
  | { readonly installation: Installation }
  /**
   * Already installed, byte for byte. No file moves - and the lockfile still might.
   *
   * `features` is here because of the case that found it: installing by name something the project
   * already holds *as a dependency*. Not one byte changes, and yet the user has just said they want
   * this feature, which is what `askedFor` records and what `toopo update` resolves from. Answering
   * "nothing to do" and stopping would leave it a dependency for ever - so that the day the feature
   * that pulled it in stops importing it, an update would remove something the user asked for.
   */
  | {
      readonly unchanged: ImplementationAddress
      readonly entry: InstalledEntry
      readonly features: readonly LockedFeature[]
    }
  | { readonly faults: readonly string[] }

export type InstallRequest = {
  readonly root: string
  readonly configuration: Configuration
  readonly lockfile: Lockfile
  /** As the user typed it: `domain/name` or `domain/name@major`. */
  readonly contract: string
  readonly implementation: string | null
  /** The instant recorded in the lockfile, supplied rather than read, so a guard is reproducible. */
  readonly at: string
}

// ---------------------------------------------------------------------------
// What is already on disk
// ---------------------------------------------------------------------------

/**
 * Why the files this install would write cannot be written. Empty when they can.
 *
 * Three answers and they are not the same. A path this project's lockfile does not claim is somebody
 * else's file, and overwriting it is out of the question whatever is in it. A path the lockfile claims
 * whose bytes have moved is the user's own edit, and permanent rule 4 forbids replacing it silently. A
 * path the lockfile claims that still hashes to what was written is ours and untouched.
 */
const diskFaults = (request: InstallRequest, plan: InstallPlan): readonly string[] => {
  const claimed = new Map(
    request.lockfile.features.flatMap((feature) =>
      feature.files.map((file) => [file.path, file] as const),
    ),
  )

  return plan.files
    .filter((file) => file.written)
    .flatMap((file) => {
      const onDisk = digestOnDisk(request.root, request.configuration.directory, file.path)
      if (onDisk === null) return []

      const held = claimed.get(file.path)
      const where = `${request.configuration.directory}/${file.path}`

      if (held === undefined) {
        return [`${where} is already there and toopo.lock does not claim it, so it is not ours to overwrite`]
      }
      if (held.sha256 !== onDisk) {
        return [
          `${where} was edited after it was installed. Toopo never replaces your changes: move them ` +
            `aside, or keep them and skip this install.`,
        ]
      }

      return []
    })
}

// ---------------------------------------------------------------------------
// The whole of it
// ---------------------------------------------------------------------------

export const prepareInstallation = (
  source: RegistrySource,
  request: InstallRequest,
): InstallOutcome => {
  const chosen = chooseContract(source, request.contract)
  if (refused(chosen)) return { faults: chosen.faults }

  const binding = bindingFor(source, chosen.found.address, request.implementation)
  if (refused(binding)) return { faults: binding.faults }

  const rootAddress: ImplementationAddress = {
    contract: chosen.found.address,
    id: binding.found.id,
    version: binding.found.version,
  }

  const root = heldAt(source, binding.found.digest, renderContract(chosen.found.address))
  if (refused(root)) return { faults: root.faults }

  const graph = gatherHoldings(source, [root.found])
  if (refused(graph)) return { faults: graph.faults }

  let order: readonly FrozenImplementation[]
  let depth: number
  try {
    order = [...resolveDependencies(root.found, graph.found), root.found]
    depth = dependencyDepthOf(root.found, graph.found)
  } catch (error) {
    return { faults: [error instanceof Error ? error.message : String(error)] }
  }

  const planned = planInstall(order)
  if ('faults' in planned) return { faults: planned.faults }

  const fetched = fetchedSources(source, planned.plan)
  if (refused(fetched)) return { faults: fetched.faults }

  const rewritten = rewrittenSources(fetched.found, planned.plan.relocation)
  if ('faults' in rewritten) return { faults: rewritten.faults }

  const onDisk = diskFaults(request, planned.plan)
  if (onDisk.length > 0) return { faults: onDisk }

  const writes: PlannedWrite[] = []
  const features: LockedFeature[] = []

  for (const planning of planned.plan.features) {
    const files: InstalledFile[] = []

    for (const file of planning.files) {
      if (!file.written) continue

      const bytes = Buffer.from(rewritten.sources.get(file.servedAt) as string, 'utf8')
      const sha256 = digestOfBytes(bytes)

      writes.push({ path: file.path, bytes, repointed: sha256 !== file.served.sha256 })
      files.push({ path: file.path, served: file.served, sha256, bytes: bytes.byteLength })
    }

    features.push({
      contract: planning.implementation.contract,
      implementation: {
        id: planning.implementation.id,
        version: planning.implementation.version,
      },
      files,
      installedAt: request.at,
      locallyModified: false,
      askedFor: sameContract(planning.implementation.contract, chosen.found.address),
    })
  }

  const entry = entryOf(planned.plan, chosen.found.address, chosen.found.exports)
  if (entry === null) {
    return {
      faults: [
        `${renderContract(chosen.found.address)} publishes no ${THE_ENTRY_FILE}, so nothing knows ` +
          `which of its files a caller imports`,
      ],
    }
  }

  if (features.every((feature) => isAlreadyInstalled(request, feature))) {
    return { unchanged: rootAddress, entry, features }
  }

  return {
    installation: {
      contract: chosen.found.address,
      summary: chosen.found.summary,
      implementation: rootAddress,
      cost: {
        files: writes.length,
        bytes: writes.reduce((total, write) => total + write.bytes.byteLength, 0),
        depth,
      },
      writes,
      entry,
      features,
      dependencies: planned.plan.features
        .map((held) => held.implementation)
        .filter((held) => !sameContract(held.contract, chosen.found.address)),
      shared: sharedFilesIn(planned.plan),
    },
  }
}

/**
 * Where the asked-for feature's own entry file landed, and what it publishes.
 *
 * Read off the plan rather than rebuilt from the naming rule, because the plan already applied that
 * rule and applying it twice is how two answers to one question come to disagree. `null` when the
 * implementation carries no entry file at all, which the catalogue's own anatomy forbids and a
 * submission could still do.
 */
const entryOf = (
  plan: InstallPlan,
  contract: ContractAddress,
  exports: readonly ServedExport[],
): InstalledEntry | null => {
  const feature = plan.features.find((held) => sameContract(held.implementation.contract, contract))
  const file = feature?.files.find((held) => held.served.path === THE_ENTRY_FILE)

  return file === undefined ? null : { path: file.path, exports }
}

/**
 * The files a plan writes once and more than one feature carries, each with the features that name it
 * without owning the copy.
 *
 * Read off the plan's own `written` flag rather than recomputed from the digests: the plan already
 * took that decision, and taking it twice is how two answers to one question come to disagree.
 */
const sharedFilesIn = (plan: InstallPlan): readonly SharedFile[] => {
  const carriers = new Map<string, string[]>()

  for (const feature of plan.features) {
    for (const file of feature.files) {
      if (file.written) continue

      const held = carriers.get(file.path) ?? []
      held.push(renderContract(feature.implementation.contract))
      carriers.set(file.path, held)
    }
  }

  return [...carriers].map(([path, alsoCarriedBy]) => ({ path, alsoCarriedBy }))
}

/**
 * This exact feature is already recorded and every file of it still hashes to what was written.
 *
 * Both halves, because either one alone answers the wrong question: a lockfile entry with the files
 * deleted is not an install, and files that happen to match under a different version are a
 * coincidence. It is asked of every feature the install would write, so a project whose dependency was
 * deleted is repaired rather than reported as already done.
 */
const isAlreadyInstalled = (request: InstallRequest, feature: LockedFeature): boolean => {
  const held = request.lockfile.features.find((entry) => sameContract(entry.contract, feature.contract))

  return (
    held !== undefined &&
    held.implementation.id === feature.implementation.id &&
    held.implementation.version === feature.implementation.version &&
    feature.files.every(
      (file) =>
        digestOnDisk(request.root, request.configuration.directory, file.path) === file.sha256,
    )
  )
}

/** The lockfile these features leave behind, so that no caller folds them itself. */
export const lockfileAfter = (
  lockfile: Lockfile,
  features: readonly LockedFeature[],
): Lockfile => features.reduce(withFeature, lockfile)
