/**
 * From a name to the bytes, with every answer checked on arrival. Shared by `add` and by `update`.
 *
 * It is one module rather than two because the two commands ask a registry for exactly the same
 * things: which contract a name is, which implementation is bound to it, what that implementation's
 * snapshot says, everything it reaches through its edges, and the bytes of every file. `add` starts
 * from a name the user typed and `update` starts from an address the lockfile recorded, and that is
 * the whole of the difference - so it is the only thing here that has two entry points.
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

import type { ContractAddress, ImplementationAddress } from '../registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../registry/address.js'
import type { ServedExport, ServedIndexEntry } from '../registry/response.js'
import { servedBlobFaults, servedSnapshotFaults } from '../registry/response.js'
import type { FrozenImplementation, Snapshot } from '../registry/snapshot.js'
import type { InstallPlan } from './plan.js'
import type { SourceToRewrite } from './rewrite.js'
import type { RegistrySource } from './source.js'

/** What a step found, or why it refused. Never an absence, which a caller could read as an answer. */
export type Found<T> = { readonly found: T } | { readonly faults: readonly string[] }

export const refused = <T>(answer: Found<T>): answer is { readonly faults: readonly string[] } =>
  'faults' in answer

/** A contract the registry holds and is willing to serve, with what a caller has to know to use it. */
export type Chosen = {
  readonly address: ContractAddress
  readonly summary: string
  readonly exports: readonly ServedExport[]
}

export type ChosenBinding = {
  readonly id: string
  readonly version: string
  readonly digest: string
}

// ---------------------------------------------------------------------------
// Which contract
// ---------------------------------------------------------------------------

/**
 * What the user typed, split into a name and the major they asked for, if any.
 *
 * `NaN` for a major that is not a whole number, so that `array/group-by@x` is refused by name rather
 * than answered as `array/group-by@x` - a contract nothing holds - which is a worse sentence for the
 * same mistake.
 *
 * Exported because `remove` resolves the same spelling against the *lockfile* rather than against the
 * index: what a removal names is something the project holds, and asking the catalogue about it would
 * make a feature unremovable the day the catalogue changed its mind about it.
 *
 * It used to be called `askedFor`, which is also the name of the lockfile field saying whether the
 * user typed a feature - two different things one word away from each other, in the two modules that
 * both handle a name the user typed.
 */
export const contractTyped = (
  typed: string,
): { readonly name: string; readonly major: number | null } => {
  const at = typed.lastIndexOf('@')
  if (at === -1) return { name: typed, major: null }

  const major = Number(typed.slice(at + 1))

  return { name: typed.slice(0, at), major: Number.isInteger(major) ? major : Number.NaN }
}

/**
 * An index entry becomes something installable, or the sentence saying it never will be.
 *
 * The refusal is here rather than at each call site because it is one fact about one contract, and a
 * second copy of it is a second thing that can come to disagree - the shape this folder already
 * refuses for a missing edge.
 */
const installable = (entry: ServedIndexEntry): Found<Chosen> =>
  entry.installable
    ? { found: { address: entry.address, summary: entry.summary, exports: entry.exports } }
    : {
        /**
         * What the field says, and not the decision that is the usual way of arriving at it.
         *
         * It read *it was considered and decided against. The registry publishes what it refuses and
         * why* - two claims from one boolean. `servedIndex` sets `installable` from membership of the
         * published set, so a contract with an identity and no publication is not installable and has
         * no refusal to publish either; `search.ts` already models that, with `refusal: … ?? null`,
         * and prints the reason only where there is one. Two modules of this folder disagreed about
         * what one field means, and this was the one telling the user.
         */
        faults: [
          `${renderContract(entry.address)} is in the catalogue and the registry publishes no ` +
            `implementation of it, so there is nothing to install. \`toopo search ` +
            `${entry.address.name}\` shows what the catalogue says about it.`,
        ],
      }

export const chooseContract = (source: RegistrySource, typed: string): Found<Chosen> => {
  const wanted = contractTyped(typed)
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

  return installable(first)
}

/**
 * The contract at an address the caller already holds, which is the shape `update` starts from.
 *
 * A contract that has left the index is refused rather than skipped. Permanent rule 6 says a published
 * version is frozen for life, so this cannot happen to a real registry - and an update that quietly
 * ignored it would be an update that stopped maintaining a feature without saying so.
 */
export const contractAt = (source: RegistrySource, address: ContractAddress): Found<Chosen> => {
  const entry = source
    .contractIndex()
    .entries.find((candidate) => sameContract(candidate.address, address))

  if (entry === undefined) {
    return {
      faults: [
        `the registry no longer holds ${renderContract(address)}, which toopo.lock records as ` +
          `installed. Nothing was changed.`,
      ],
    }
  }

  return installable(entry)
}

// ---------------------------------------------------------------------------
// Which implementation, and what it says
// ---------------------------------------------------------------------------

/**
 * The binding for an implementation, by name or by whichever the registry makes default.
 *
 * **`update` always names one**, and that is not an accident of the caller: an update that followed
 * the default would move somebody who chose `--implementation fast` onto `reference` the day the
 * registry changed its mind, which is a larger change than a version bump and exactly the kind
 * permanent rule 4 forbids making silently.
 */
export const bindingFor = (
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
 * The binding for the exact implementation a lockfile records, version included.
 *
 * It is what a **removal** resolves its remaining roots through, and the version is the whole point.
 * `bindingFor` answers what the registry serves today, which is what an update goes to find out; a
 * removal decides which files leave by re-planning what stays, so re-planning a root at a *newer*
 * publication would let a dependency it has since dropped, or a file it has since stopped sharing, be
 * planned away and deleted underneath the code that is actually on disk. The bytes in the project were
 * installed against the recorded versions, so those are the versions whose closure describes them.
 *
 * There is no empty-list branch here, and its absence is the more accurate answer rather than an
 * economy: a contract with no binding at all and a contract whose recorded version is not among them
 * are the same fact from this function's side - the exact artefact is not being served - and one
 * sentence says it without guessing which.
 */
export const bindingAt = (
  source: RegistrySource,
  address: ContractAddress,
  implementation: { readonly id: string; readonly version: string },
): Found<ChosenBinding> => {
  const wanted = source
    .implementationBindings(address)
    .find(
      (binding) =>
        binding.address.id === implementation.id &&
        binding.address.version === implementation.version,
    )

  if (wanted === undefined) {
    const what = renderImplementation({ contract: address, ...implementation })

    return {
      faults: [
        `the registry is not serving ${what}, which toopo.lock records as installed. A published ` +
          `version is served for life, so this is a registry that cannot answer right now rather ` +
          `than an artefact that went away. Nothing was changed.`,
      ],
    }
  }

  return { found: { id: wanted.address.id, version: wanted.address.version, digest: wanted.digest } }
}

export const heldAt = (
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

/**
 * Every implementation an install needs, fetched by walking the edges the snapshots carry.
 *
 * It terminates because it never fetches an address twice; a cycle among those addresses is refused by
 * `resolveDependencies`, which is where that refusal belongs and where it is already measured.
 *
 * `roots` is a list rather than one implementation because `update` resolves the whole project at once:
 * a single walk over every root is what lets one plan see two features carrying one file, where a walk
 * per root would deduplicate nothing across them.
 */
export const gatherHoldings = (
  source: RegistrySource,
  roots: readonly FrozenImplementation[],
): Found<readonly FrozenImplementation[]> => {
  const held = new Map<string, FrozenImplementation>()
  const faults: string[] = []
  const pending: ImplementationAddress[] = []
  // An address is asked about once even when two dependents name it, so a missing edge is one
  // refusal rather than one per dependent - the reader has one thing to fix, not two.
  const asked = new Set<string>()

  for (const root of roots) {
    held.set(
      renderImplementation({ contract: root.contract, id: root.id, version: root.version ?? '' }),
      root,
    )
    pending.push(...root.dependsOn)
  }

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
// The bytes
// ---------------------------------------------------------------------------

export const fetchedSources = (
  source: RegistrySource,
  plan: InstallPlan,
): Found<readonly SourceToRewrite[]> => {
  const texts: SourceToRewrite[] = []
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
