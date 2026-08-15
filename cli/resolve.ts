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

import type { ContractAddress, ImplementationAddress } from '../packages/registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../packages/registry/address.js'
import type { DependencyEdge } from '../packages/registry/implementation-record.js'
import { declarationFaults } from '../packages/registry/implementation-record.js'
import type { ServedExport, ServedIndexEntry } from '../packages/registry/response.js'
import { servedBlobFaults, servedSnapshotFaults } from '../packages/registry/response.js'
import type { FrozenImplementation, Snapshot } from '../packages/registry/snapshot.js'
import type { InstallPlan } from './plan.js'
import type { SourceToRewrite } from './rewrite.js'
import type { HeldRegistry } from './source.js'

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

/**
 * A root of a walk, with the digest it was fetched by.
 *
 * The digest travels because an edge naming a root has to be comparable with it - see
 * `gatherHoldings`. It is never a second statement of anything: every caller obtained the snapshot by
 * that digest one line earlier, from the binding it resolved the root through.
 */
export type RootAt = {
  readonly frozen: FrozenImplementation
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

export const chooseContract = (source: HeldRegistry, typed: string): Found<Chosen> => {
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
export const contractAt = (source: HeldRegistry, address: ContractAddress): Found<Chosen> => {
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
  source: HeldRegistry,
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
  source: HeldRegistry,
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

/**
 * The frozen implementation at a digest, refused unless it is the one the address names.
 *
 * **The last check is the one this function exists for, and it is younger than the other three.** A
 * digest reaches this function from two places and neither of them establishes what arrives. From a
 * *binding*, the registry was asked which digest a name resolves to and was believed. From an *edge*,
 * the digest is carried inside a frozen snapshot and the name beside it is checked against nothing. So
 * a whole, self-consistent snapshot of another artefact - served honestly at the address that was
 * asked for - passes `servedSnapshotFaults` exactly, and the wrong feature is installed under the
 * right name.
 *
 * It is one check over both, rather than one per door, because it is one fact: *a snapshot is the
 * artefact it says it is*. Two guards over that would have nothing to say for themselves the day they
 * disagreed. `declarationFaults` holds it, in the schema, where the three parts of an address are
 * already compared.
 *
 * **What made the edge half urgent is that this unit created it.** Before an edge carried a digest,
 * `gatherHoldings` found the digest by looking the edge's `id` and `version` up in the bindings, so
 * identity was established by the lookup - and that lookup is exactly the round trip the digest
 * removes. Taking it without putting this back would have moved the belief from a named answer onto an
 * edge and checked neither.
 *
 * The root half is older and is latent rather than live: `localSource` and `packagedSource` look an
 * answer up *by* its digest in a map keyed on that digest, so no local registry can answer one address
 * with another artefact. It goes live the day a source is remote, which is the distribution unit - so
 * this closes it before the door it would come through is opened.
 */
export const heldAt = (
  source: HeldRegistry,
  address: ImplementationAddress,
  digest: string,
): Found<FrozenImplementation> => {
  const where = renderImplementation(address)
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

  const misdeclared = declarationFaults(parsed.frozen, address)
  if (misdeclared.length > 0) {
    return { faults: misdeclared.map((fault) => `the snapshot served at ${digest}: ${fault}`) }
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
 *
 * **An edge is followed without asking the registry anything about it**, and that is the whole of what
 * the digest on an edge buys. This loop used to fetch `implementation-bindings` for every edge, to
 * learn which digest it resolved to - a named answer, one per contract in the closure, each of them
 * something a reader believes rather than checks. The digest is now inside the frozen snapshot that
 * names the edge, so the step is arithmetic and the closure hangs off the root's digest alone.
 * Measured on the imagined graph, `toopo add number/round` goes from 8 round trips to 6 and from five
 * named answers to one. **Both figures were arithmetic over the endpoints when they were written and
 * are now counted at a socket**: `cli/http-source.test.ts` serves this walk over `node:http` and reads
 * six round trips and eleven requests off the server rather than off the client.
 *
 * **An address already held is still compared, and that was found by measuring rather than by reading
 * the loop.** A second dependent naming an address the walk has resolved needs no fetch - and skipping
 * it outright threw away the one thing that edge carried. Measured on the imagined graph with a
 * `number/sign@1` published naming `string/pad@1` at `number/clamp@1`'s digest: the honest edge from
 * `number/clamp@1` arrived first, the lying one was skipped, and the install answered five correct
 * files. The right artefact landed *because of the order the walk happened to take*, and the same
 * corrupt registry refuses when the two edges arrive the other way round.
 *
 * It is not registry hygiene. Two dependents disagreeing about which artefact an address is means one
 * of them was published against code the project is not getting - a combination nobody published,
 * which is the thing `reconcile.ts` already refuses to assemble one version at a time.
 *
 * `roots` therefore arrive with the digest they were fetched by, so that an edge naming a root is
 * compared like any other. Every caller already holds it: it is the binding it resolved the root
 * through.
 */
export const gatherHoldings = (
  source: HeldRegistry,
  roots: readonly RootAt[],
): Found<readonly FrozenImplementation[]> => {
  const held = new Map<string, { readonly frozen: FrozenImplementation; readonly digest: string }>()
  const faults: string[] = []
  const pending: DependencyEdge[] = []
  // An address is asked about once even when two dependents name it, so a missing edge is one
  // refusal rather than one per dependent - the reader has one thing to fix, not two. The same rule
  // covers a disagreement: three dependents where two carry one wrong digest is one corrupt address.
  const asked = new Set<string>()
  const disagreed = new Set<string>()

  for (const root of roots) {
    const { frozen } = root
    held.set(
      renderImplementation({ contract: frozen.contract, id: frozen.id, version: frozen.version ?? '' }),
      root,
    )
    pending.push(...frozen.dependsOn)
  }

  while (pending.length > 0) {
    const edge = pending.shift() as DependencyEdge
    const what = renderImplementation(edge.implementation)

    const already = held.get(what)
    if (already !== undefined) {
      if (already.digest !== edge.digest && !disagreed.has(what)) {
        disagreed.add(what)
        faults.push(
          `${what} is named by two edges at two digests, ${already.digest} and ${edge.digest}. ` +
            `One of the features being installed was published against an artefact the other is ` +
            `not getting, which is a combination nobody published.`,
        )
      }
      continue
    }
    if (asked.has(what)) continue
    asked.add(what)

    const answer = heldAt(source, edge.implementation, edge.digest)
    if (refused(answer)) {
      faults.push(...answer.faults)
      continue
    }

    held.set(what, { frozen: answer.found, digest: edge.digest })
    pending.push(...answer.found.dependsOn)
  }

  return faults.length > 0
    ? { faults }
    : { found: [...held.values()].map((entry) => entry.frozen) }
}

// ---------------------------------------------------------------------------
// The bytes
// ---------------------------------------------------------------------------

export const fetchedSources = (
  source: HeldRegistry,
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
