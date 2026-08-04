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
  /**
   * True when this exact file is already on disk, byte for byte, and no lockfile claims it.
   *
   * It is not written and it is not refused. **Byte-for-byte identity over a source file is not a
   * coincidence anybody meets**: it is our file, or an exact copy of it, and claiming it is the same
   * rule `toopo update` already applies under the verdict `already-written` - a file whose bytes are
   * the ones we were about to write is a write that already happened, not somebody's edit.
   *
   * What it does *not* cover is a file that differs by one byte, which stays the refusal it was.
   * Permanent rule 4 is about not replacing somebody's work, and there is no work here to replace.
   */
  readonly alreadyOnDisk: boolean
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
      /**
       * True when the lockfile held this contract as a dependency and this call makes it a root.
       *
       * **A field of its own, and the reason is a sentence that lied.** The screen used to decide
       * whether to say *it was there as a dependency* from "did the lockfile change at all", which is
       * a different question with a different answer - and once the instant moved on every run, the
       * two came apart and the sentence printed on every re-add of a feature the user had installed
       * directly. An assertion about somebody's project, contradicted by the file the tool had just
       * read, on a product whose thesis is that it does not do that.
       *
       * The two questions stay two values even now that only one thing can differ here, because the
       * defect was not a wrong boolean - it was one boolean answering for two claims.
       */
      readonly promoted: boolean
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
 * What is already sitting where this install would write, decided once.
 *
 * Four answers and they are not the same. A path the lockfile claims whose bytes have moved is the
 * user's own edit, and permanent rule 4 forbids replacing it silently. A path the lockfile claims that
 * still hashes to what was written is ours and untouched. A path nothing claims whose bytes are
 * *exactly* the ones we would write is ours too - see `PlannedWrite.alreadyOnDisk` - and is recorded
 * rather than rewritten. A path nothing claims holding anything else is somebody else's file, and
 * overwriting it is out of the question whatever is in it.
 *
 * The would-be digests are passed in rather than recomputed here, because they are the digests of the
 * *rewritten* bytes: a file whose import was repointed is not the bytes the registry served, and
 * comparing against the served digest would report it as somebody else's file for ever.
 */
type DiskStanding = {
  readonly faults: readonly string[]
  /** Paths that already hold the bytes this install would write, with nothing claiming them. */
  readonly alreadyOnDisk: ReadonlySet<string>
}

const diskStanding = (
  request: InstallRequest,
  plan: InstallPlan,
  wouldWrite: ReadonlyMap<string, string>,
): DiskStanding => {
  const claimed = new Map(
    request.lockfile.features.flatMap((feature) =>
      feature.files.map((file) => [file.path, file] as const),
    ),
  )
  const faults: string[] = []
  const alreadyOnDisk = new Set<string>()

  for (const file of plan.files) {
    if (!file.written) continue

    const onDisk = digestOnDisk(request.root, request.configuration.directory, file.path)
    if (onDisk === null) continue

    const held = claimed.get(file.path)
    const where = `${request.configuration.directory}/${file.path}`

    if (held === undefined) {
      if (onDisk === wouldWrite.get(file.path)) alreadyOnDisk.add(file.path)
      else {
        faults.push(
          `${where} is already there, toopo.lock does not claim it, and its bytes are not the ones ` +
            `toopo would write - so it is not ours to overwrite`,
        )
      }
      continue
    }

    if (held.sha256 !== onDisk) {
      faults.push(
        `${where} was edited after it was installed. Toopo never replaces your changes: move them ` +
          `aside, or keep them and skip this install.`,
      )
    }
  }

  return { faults, alreadyOnDisk }
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

  // The bytes first, because what is on disk is judged against what *this install* would write and
  // not against what the registry served - the two differ on every file whose import was repointed.
  const bytesFor = new Map(
    planned.plan.files
      .filter((file) => file.written)
      .map((file) => [
        file.path,
        Buffer.from(rewritten.sources.get(file.servedAt) as string, 'utf8'),
      ]),
  )
  const standing = diskStanding(
    request,
    planned.plan,
    new Map([...bytesFor].map(([path, bytes]) => [path, digestOfBytes(bytes)])),
  )
  if (standing.faults.length > 0) return { faults: standing.faults }

  const writes: PlannedWrite[] = []
  const features: LockedFeature[] = []

  for (const planning of planned.plan.features) {
    const files: InstalledFile[] = []

    for (const file of planning.files) {
      if (!file.written) continue

      const bytes = bytesFor.get(file.path) as Buffer
      const sha256 = digestOfBytes(bytes)

      writes.push({
        path: file.path,
        bytes,
        repointed: sha256 !== file.served.sha256,
        alreadyOnDisk: standing.alreadyOnDisk.has(file.path),
      })
      files.push({ path: file.path, served: file.served, sha256, bytes: bytes.byteLength })
    }

    const candidate: LockedFeature = {
      contract: planning.implementation.contract,
      implementation: {
        id: planning.implementation.id,
        version: planning.implementation.version,
      },
      files,
      installedAt: request.at,
      locallyModified: false,
      askedFor: sameContract(planning.implementation.contract, chosen.found.address),
    }

    /**
     * The instant moves only when something did, which is the rule `reconcile.ts` already states and
     * this path did not honour.
     *
     * Re-adding a feature that is already there stamped every entry with the run's own clock, so a
     * lockfile that describes exactly the same install came out one line different - a diff in a
     * committed file for nothing. Worse, it made *the lockfile changed* true on a run where nothing
     * had, which is the boolean the screen was reading to decide whether to tell the user their
     * feature had been promoted from a dependency.
     */
    const held = heldEntry(request, planning.implementation.contract)

    features.push(
      held !== undefined && isAlreadyInstalled(request, candidate)
        ? { ...candidate, installedAt: held.installedAt }
        : candidate,
    )
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
    const held = heldEntry(request, chosen.found.address)

    return {
      unchanged: rootAddress,
      entry,
      features,
      promoted: held !== undefined && !held.askedFor,
    }
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
/** What `toopo.lock` already records about this contract, if anything. */
const heldEntry = (
  request: InstallRequest,
  contract: ContractAddress,
): LockedFeature | undefined =>
  request.lockfile.features.find((entry) => sameContract(entry.contract, contract))

const isAlreadyInstalled = (request: InstallRequest, feature: LockedFeature): boolean => {
  const held = heldEntry(request, feature.contract)

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

/**
 * The files a commit actually puts on disk.
 *
 * A file already holding the exact bytes is recorded and not rewritten, so that the lines the report
 * prints and the writes the commit makes are the same set of events. Rewriting it would be harmless
 * to its contents and would still be a write - a changed timestamp under a line saying nothing was
 * written - and this repository does not print one thing and do another.
 */
export const filesToWrite = (installation: Installation): readonly FileToWrite[] =>
  installation.writes.filter((write) => !write.alreadyOnDisk)

/** The lockfile these features leave behind, so that no caller folds them itself. */
export const lockfileAfter = (
  lockfile: Lockfile,
  features: readonly LockedFeature[],
): Lockfile => features.reduce(withFeature, lockfile)
