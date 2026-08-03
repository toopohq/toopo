/**
 * `toopo add`, from a name the user typed to the bytes that will be written.
 *
 * **Nothing here writes.** Every fetch, every verification, every refusal and the whole cost happen
 * before `commitInstallation` is called, and that function can only succeed. An install that discovered
 * a conflict after writing four files would have already changed the user's project, and the user's
 * project is the one thing this tool has no right to leave in a state nobody asked for.
 *
 * **Every answer is verified on arrival.** `servedSnapshotFaults` and `servedBlobFaults` exist because
 * `response.ts` refused to describe a check a consumer would then skip - "verify the digest" is exactly
 * the step that gets skipped when it is written in prose - so they are called here, on every snapshot
 * and every blob, and a failure is a refusal rather than a warning. That is the whole of what makes a
 * source untrusted rather than merely remote.
 *
 * The resolution is the client's, and that is a decision `endpoints.ts` records rather than an economy:
 * the edges are frozen inside each implementation snapshot, so a client that fetches the snapshots it
 * needs anyway can walk the graph itself and verify every step, where a resolution computed by a server
 * would be one more thing to believe bought with nothing.
 *
 * Every step below answers either what it found or why it refused, in one shape, because a step that
 * answered an absence would be a step whose failure looks exactly like an empty result.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import type { ContractAddress, ImplementationAddress } from '../registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../registry/address.js'
import { digestOfBytes } from '../registry/canonical.js'
import type { InstalledFile, LockedFeature, Lockfile } from '../registry/implementation-record.js'
import { dependencyDepthOf, resolveDependencies } from '../registry/implementation-record.js'
import { servedBlobFaults, servedSnapshotFaults } from '../registry/response.js'
import type { FrozenImplementation, Snapshot } from '../registry/snapshot.js'
import type { Configuration } from './configuration.js'
import { digestOnDisk } from './lockfile.js'
import type { InstallPlan } from './plan.js'
import { planInstall } from './plan.js'
import { rewrittenSources } from './rewrite.js'
import type { RegistrySource } from './source.js'

/** What a step found, or why it refused. Never an absence, which a caller could read as an answer. */
type Found<T> = { readonly found: T } | { readonly faults: readonly string[] }

const refused = <T>(answer: Found<T>): answer is { readonly faults: readonly string[] } =>
  'faults' in answer

export type Cost = {
  readonly files: number
  readonly bytes: number
  readonly depth: number
}

export type PlannedWrite = {
  readonly path: string
  readonly bytes: Buffer
  /** True when the installer changed the bytes on the way in, by repointing an import. */
  readonly repointed: boolean
}

export type Installation = {
  readonly contract: ContractAddress
  readonly summary: string
  readonly implementation: ImplementationAddress
  readonly cost: Cost
  readonly writes: readonly PlannedWrite[]
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
  /** Destinations more than one feature carries, written once. What deduplication actually did. */
  readonly shared: readonly string[]
}

export type InstallOutcome =
  | { readonly installation: Installation }
  /** Already installed, byte for byte, and there is nothing to do. */
  | { readonly unchanged: ImplementationAddress }
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
// Resolving what was asked for
// ---------------------------------------------------------------------------

type Chosen = { readonly address: ContractAddress; readonly summary: string }

const askedFor = (typed: string): { readonly name: string; readonly major: number | null } => {
  const at = typed.lastIndexOf('@')
  if (at === -1) return { name: typed, major: null }

  const major = Number(typed.slice(at + 1))

  return { name: typed.slice(0, at), major: Number.isInteger(major) ? major : Number.NaN }
}

const chooseContract = (source: RegistrySource, typed: string): Found<Chosen> => {
  const wanted = askedFor(typed)
  if (Number.isNaN(wanted.major)) {
    return { faults: [`\`${typed}\` does not name a major version, which is a whole number from 1 upwards`] }
  }

  const entries = source
    .contractIndex()
    .entries.filter(
      (entry) =>
        entry.address.name === wanted.name &&
        (wanted.major === null || entry.address.major === wanted.major),
    )

  const first = entries[0]
  if (first === undefined) return { faults: [`the registry holds no contract called \`${typed}\``] }

  if (entries.length > 1) {
    return {
      faults: [
        `\`${typed}\` names ${entries.length} majors - ` +
          `${entries.map((entry) => renderContract(entry.address)).join(', ')}. Ask for one of them.`,
      ],
    }
  }
  if (!first.installable) {
    return {
      faults: [
        `${renderContract(first.address)} is in the catalogue and is not installable: it was ` +
          `considered and decided against. The registry publishes what it refuses and why.`,
      ],
    }
  }

  return { found: { address: first.address, summary: first.summary } }
}

// ---------------------------------------------------------------------------
// Fetching, and checking every answer
// ---------------------------------------------------------------------------

const heldAt = (
  source: RegistrySource,
  digest: string,
  where: string,
): Found<FrozenImplementation> => {
  const answer = source.snapshot(digest)
  if (answer === null) {
    return { faults: [`the registry serves no snapshot at ${digest}, which ${where} names`] }
  }

  const faults = servedSnapshotFaults(answer)
  if (faults.length > 0) return { faults: faults.map((fault) => `the snapshot of ${where}: ${fault}`) }

  const parsed = JSON.parse(answer.canonicalText) as Snapshot
  if (parsed.unit !== 'implementation') {
    return { faults: [`${digest} is a ${parsed.unit} snapshot where ${where} names an implementation`] }
  }

  return { found: parsed.frozen }
}

type ChosenBinding = { readonly id: string; readonly version: string; readonly digest: string }

const bindingFor = (
  source: RegistrySource,
  address: ContractAddress,
  implementation: string | null,
): Found<ChosenBinding> => {
  const bindings = source.implementationBindings(address)
  if (bindings.length === 0) {
    return {
      faults: [
        `${renderContract(address)} has no published implementation, so there is nothing to install`,
      ],
    }
  }

  const wanted =
    implementation === null
      ? bindings.find((binding) => binding.status === 'default')
      : bindings.find((binding) => binding.address.id === implementation)

  if (wanted === undefined) {
    return {
      faults:
        implementation === null
          ? [
              `${renderContract(address)} has ${bindings.length} implementation(s) and the registry ` +
                `makes none of them the default. Name one with --implementation.`,
            ]
          : [
              `${renderContract(address)} has no implementation called \`${implementation}\` ` +
                `(${bindings.map((binding) => binding.address.id).join(', ')})`,
            ],
    }
  }

  return { found: { id: wanted.address.id, version: wanted.address.version, digest: wanted.digest } }
}

/**
 * Every implementation the install needs, fetched by walking the edges the snapshots carry.
 *
 * It terminates because it never fetches an address twice; a cycle among those addresses is refused by
 * `resolveDependencies`, which is where that refusal belongs and where it is already measured.
 */
const gatherHoldings = (
  source: RegistrySource,
  root: FrozenImplementation,
): Found<readonly FrozenImplementation[]> => {
  const held = new Map<string, FrozenImplementation>()
  const faults: string[] = []
  const pending: ImplementationAddress[] = [...root.dependsOn]
  // An address is asked about once even when two dependents name it, so a missing edge is one
  // refusal rather than one per dependent - the reader has one thing to fix, not two.
  const asked = new Set<string>()

  held.set(
    renderImplementation({ contract: root.contract, id: root.id, version: root.version ?? '' }),
    root,
  )

  while (pending.length > 0) {
    const edge = pending.shift() as ImplementationAddress
    const what = renderImplementation(edge)
    if (held.has(what) || asked.has(what)) continue
    asked.add(what)

    const binding = source
      .implementationBindings(edge.contract)
      .find(
        (candidate) => candidate.address.id === edge.id && candidate.address.version === edge.version,
      )

    if (binding === undefined) {
      faults.push(`${what} is named by an edge and the registry holds no such published implementation`)
      continue
    }

    const answer = heldAt(source, binding.digest, what)
    if (refused(answer)) {
      faults.push(...answer.faults)
      continue
    }

    held.set(what, answer.found)
    pending.push(...answer.found.dependsOn)
  }

  return faults.length > 0 ? { faults } : { found: [...held.values()] }
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

  const root = heldAt(source, binding.found.digest, renderImplementation(rootAddress))
  if (refused(root)) return { faults: root.faults }

  const graph = gatherHoldings(source, root.found)
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
    })
  }

  if (features.every((feature) => isAlreadyInstalled(request, feature))) {
    return { unchanged: rootAddress }
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
      features,
      dependencies: planned.plan.features
        .map((entry) => entry.implementation)
        .filter((held) => !sameContract(held.contract, chosen.found.address)),
      shared: [
        ...new Set(planned.plan.files.filter((file) => !file.written).map((file) => file.path)),
      ],
    },
  }
}

const fetchedSources = (
  source: RegistrySource,
  plan: InstallPlan,
): Found<readonly { readonly servedAt: string; readonly text: string }[]> => {
  const texts: { readonly servedAt: string; readonly text: string }[] = []
  const faults: string[] = []

  for (const file of plan.files) {
    const answer = source.blob(file.served.sha256)
    if (answer === null) {
      faults.push(`the registry serves no file at ${file.served.sha256}, which ${file.servedAt} is`)
      continue
    }

    const blobFaults = servedBlobFaults(answer)
    if (blobFaults.length > 0) {
      faults.push(...blobFaults.map((fault) => `${file.servedAt}: ${fault}`))
      continue
    }

    texts.push({ servedAt: file.servedAt, text: answer.bytes.toString('utf8') })
  }

  return faults.length > 0 ? { faults } : { found: texts }
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

/**
 * Write what was planned. In the plan's order, which is the resolution's, so a project caught between
 * two writes never holds a file importing something that is not there yet.
 */
export const commitInstallation = (
  root: string,
  directory: string,
  installation: Installation,
): void => {
  for (const write of installation.writes) {
    const path = join(root, directory, write.path)
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, write.bytes)
  }
}
