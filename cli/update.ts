/**
 * `toopo update` - the command permanent rule 4 is about.
 *
 * *Never update user code silently. Notification, readable diff, explicit acceptance.* Everything below
 * is that sentence taken apart into decisions somebody can check.
 *
 * ---------------------------------------------------------------------------
 * Explicit acceptance is a second command, not a prompt
 * ---------------------------------------------------------------------------
 *
 * `toopo update` shows and writes nothing; `toopo update --apply` writes. A prompt would need a
 * terminal, a standard input and a moment in time, and this tool has a property worth more than the
 * convenience: **everything it decides is reachable from a guard, with no process, no working directory
 * and no clock**. That is what keeps `command.ts` to fifty lines, and it is why `add` could be measured
 * end to end without a sandbox. The first interactive prompt written here would take it away without
 * anybody noticing, so it is written down where the next person to want one will read it.
 *
 * ---------------------------------------------------------------------------
 * The whole project is planned, every time
 * ---------------------------------------------------------------------------
 *
 * There is no `toopo update <feature>`, and its absence is a decision. Deduplication is a property of a
 * plan and not of a feature - which carrier of a shared file keeps it depends on what else is being
 * installed - so a plan built for one feature in a project holding four would move files the other
 * three own. Planning everything and applying part of it is the only shape that cannot do that, and
 * once everything is planned, "just this one" buys nothing a held-back feature does not already give.
 *
 * ---------------------------------------------------------------------------
 * Six answers about a file, and the last is what makes an interruption survivable
 * ---------------------------------------------------------------------------
 *
 * Two questions decide everything: *does this file have to change* - the bytes we would write are not
 * the bytes the lockfile says we wrote - and *did the user change it* - the bytes on disk are not the
 * bytes the lockfile says we wrote. Both are asked against `sha256`, the digest of what landed, which
 * is the half of the lockfile's two digests that exists for exactly this.
 *
 *   must change, untouched      updated          write it, with the diff
 *   unchanged, edited           kept             leave it, and say so: upstream did not touch it
 *   must change, edited         conflict         hold the whole feature back
 *   unchanged, untouched        unchanged        nothing at all
 *   gone from disk              restored         put it back
 *   already the new bytes       already-written  a previous run was interrupted here, not a conflict
 *
 * The last one closes the partial-write window `write.ts` leaves open, and it closes it without a
 * journal: a file whose bytes are exactly the ones we are about to write is not somebody's edit, it is
 * a write that already happened.
 *
 * ---------------------------------------------------------------------------
 * What a conflict is shown as, and the reconstruction that turned out not to exist
 * ---------------------------------------------------------------------------
 *
 * A conflicted file is diffed **as it is on disk against what would be written**, which states the
 * consequence of accepting rather than describing the upstream change in the abstract: the user sees
 * their own lines going away. `git diff` already shows them what they changed, better than this could,
 * and re-deriving it here would be a second implementation of a tool they already have.
 *
 * The other reading - reconstruct the bytes we originally wrote and diff *those* against the new ones,
 * to isolate what upstream did - was tried first and **cannot be built from the lockfile**. It needs
 * the old relocation, and the lockfile records only the files that were *written*: a shared blob's
 * second carrier is deduplicated away and has no entry, so a specifier resolving to it resolves to
 * nothing. Rebuilding it from the old snapshots is possible and would be a second resolution of a
 * second graph, to produce a report - where the diff below needs nothing at all, because the file on
 * disk *is* what we wrote. The two digests still earn their existence on every file of every run:
 * `served` is what a comparison with the registry is made against, `sha256` is what the disk is
 * compared against, and no run of this command can be made without both.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ContractAddress } from '../registry/address.js'
import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { InstalledFile, LockedFeature, Lockfile } from '../registry/implementation-record.js'
import { resolveDependencies } from '../registry/implementation-record.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import type { Configuration } from './configuration.js'
import type { FileDiff } from './diff.js'
import { diffOf } from './diff.js'
import { digestOnDisk, withFeature } from './lockfile.js'
import type { InstallPlan, PlannedFeature } from './plan.js'
import { planInstall } from './plan.js'
import { bindingFor, contractAt, fetchedSources, gatherHoldings, heldAt, refused } from './resolve.js'
import { rewrittenSources } from './rewrite.js'
import type { RegistrySource } from './source.js'
import type { FileToWrite } from './write.js'

export type UpdateRequest = {
  readonly root: string
  readonly configuration: Configuration
  readonly lockfile: Lockfile
  /** The instant recorded in the lockfile, supplied rather than read, so a guard is reproducible. */
  readonly at: string
}

export type FileVerdict =
  | 'unchanged'
  | 'updated'
  | 'restored'
  | 'already-written'
  | 'kept'
  | 'conflict'
  | 'removed'
  | 'kept-orphan'

export type FileOutcome = {
  /** Relative to the configured directory, with forward slashes. */
  readonly path: string
  readonly verdict: FileVerdict
  /** The bytes accepting would write, or `null` when this verdict writes nothing. */
  readonly bytes: Buffer | null
  /** What accepting would do to what is on disk, or `null` when there is nothing to show. */
  readonly change: FileDiff | null
}

/** An implementation as one side of a comparison names it. */
export type Standing = {
  readonly id: string
  readonly version: string
}

export type FeatureOutcome = {
  readonly contract: ContractAddress
  /** What the lockfile records, or `null` for a feature the project does not hold yet. */
  readonly was: Standing | null
  /** What the registry serves, or `null` for a feature that leaves the project. */
  readonly now: Standing | null
  readonly files: readonly FileOutcome[]
  /** Why nothing of this feature is applied, or `null` when it is. */
  readonly heldBack: string | null
}

export type Update = {
  readonly features: readonly FeatureOutcome[]
  readonly writes: readonly FileToWrite[]
  readonly removals: readonly string[]
  /** The lockfile this update leaves behind, which the caller commits together with the bytes. */
  readonly lockfile: Lockfile
}

export type UpdateOutcome =
  | { readonly update: Update }
  | { readonly faults: readonly string[] }

/** Every verdict that puts bytes on disk, named once so that three readers cannot drift apart. */
const WRITES: ReadonlySet<FileVerdict> = new Set<FileVerdict>([
  'updated',
  'restored',
  'already-written',
])

/** Every verdict that says the user's own hand is on this file. */
const EDITED: ReadonlySet<FileVerdict> = new Set<FileVerdict>(['kept', 'conflict', 'kept-orphan'])

type Claimed = ReadonlyMap<string, InstalledFile>

const standingOf = (feature: LockedFeature): Standing => ({
  id: feature.implementation.id,
  version: feature.implementation.version,
})

const keyOf = (contract: ContractAddress): string => renderContract(contract)

/**
 * What a file on disk says, normalised the way its digest was taken.
 *
 * Normalised rather than read raw, for the reason `canonical.ts` imposes on this whole folder: a user
 * whose git rewrites checkouts to CRLF would otherwise see every line of every file in the diff, on a
 * project where nothing has changed at all.
 */
const installedText = (request: UpdateRequest, path: string): string => {
  const full = join(request.root, request.configuration.directory, path)

  return servedBytes(readFileSync(full)).toString('utf8')
}

// ---------------------------------------------------------------------------
// Where an update starts
// ---------------------------------------------------------------------------

/**
 * The new graph: every feature the user asked for, at the version its own implementation is bound to
 * today, and everything those reach.
 *
 * The implementation `id` is carried over from the lockfile rather than resolved to the registry's
 * default, and `resolve.ts` says why: following the default would move somebody who chose an
 * implementation onto a different one, which is a larger change than a version bump and exactly what
 * permanent rule 4 forbids doing quietly.
 */
const theNewGraph = (
  source: RegistrySource,
  roots: readonly LockedFeature[],
): { readonly order: readonly FrozenImplementation[] } | { readonly faults: readonly string[] } => {
  const held: FrozenImplementation[] = []
  const faults: string[] = []

  for (const feature of roots) {
    const contract = contractAt(source, feature.contract)
    if (refused(contract)) {
      faults.push(...contract.faults)
      continue
    }

    const binding = bindingFor(source, feature.contract, feature.implementation.id)
    if (refused(binding)) {
      faults.push(...binding.faults)
      continue
    }

    const snapshot = heldAt(source, binding.found.digest, renderContract(feature.contract))
    if (refused(snapshot)) {
      faults.push(...snapshot.faults)
      continue
    }

    held.push(snapshot.found)
  }

  if (faults.length > 0) return { faults }

  const holdings = gatherHoldings(source, held)
  if (refused(holdings)) return { faults: holdings.faults }

  // Every root's dependencies before it, then the root, and each contract once across the whole
  // project - which is what makes one plan see two features carrying one file.
  const order: FrozenImplementation[] = []
  const seen = new Set<string>()

  try {
    for (const root of held) {
      for (const implementation of [...resolveDependencies(root, holdings.found), root]) {
        const what = keyOf(implementation.contract)
        if (seen.has(what)) continue
        seen.add(what)
        order.push(implementation)
      }
    }
  } catch (error) {
    return { faults: [error instanceof Error ? error.message : String(error)] }
  }

  return { order }
}

// ---------------------------------------------------------------------------
// What each file becomes
// ---------------------------------------------------------------------------

const verdictOf = (
  claimed: InstalledFile | undefined,
  onDisk: string | null,
  wanted: string,
): FileVerdict => {
  if (claimed === undefined || onDisk === null) return 'restored'
  if (onDisk === wanted) return claimed.sha256 === wanted ? 'unchanged' : 'already-written'

  const mustChange = claimed.sha256 !== wanted
  const wasEdited = claimed.sha256 !== onDisk

  if (mustChange && !wasEdited) return 'updated'
  if (mustChange) return 'conflict'

  return 'kept'
}

/**
 * A file's outcome, and the diff that goes with it.
 *
 * The diff is against what is on disk rather than against what the lockfile says was written, and for
 * a `conflict` the two differ - which is the point: what the user decides is what accepting would do
 * to the file they are actually holding.
 */
const outcomeOf = (
  request: UpdateRequest,
  claimed: Claimed,
  path: string,
  bytes: Buffer,
): FileOutcome => {
  const onDisk = digestOnDisk(request.root, request.configuration.directory, path)
  const wanted = digestOfBytes(bytes)
  const verdict = verdictOf(claimed.get(path), onDisk, wanted)

  return {
    path,
    verdict,
    bytes: WRITES.has(verdict) ? bytes : null,
    change:
      verdict === 'updated' || verdict === 'conflict'
        ? diffOf(installedText(request, path), bytes.toString('utf8'))
        : null,
  }
}

/**
 * The features the lockfile holds and the new plan does not, with what becomes of each of their files.
 *
 * A dependency that leaves the closure is not litter to be kept out of politeness: the lockfile claims
 * it, nothing imports it any more, and a project that accumulates those stops being one anybody trusts.
 * A file the user edited is a different matter and stays, which holds its feature - and its lockfile
 * entry - exactly where it was.
 */
type Leaving = { readonly feature: LockedFeature; readonly files: readonly FileOutcome[] }

const leavingFeatures = (
  request: UpdateRequest,
  planned: readonly PlannedFeature[],
): readonly Leaving[] => {
  const kept = new Set(planned.map((feature) => keyOf(feature.implementation.contract)))

  return request.lockfile.features
    .filter((feature) => !kept.has(keyOf(feature.contract)))
    .map((feature) => ({
      feature,
      // A file already gone from disk produces nothing to say and nothing to do. The lockfile entry
      // still goes, which is the whole of what leaving means.
      files: feature.files.flatMap((file): readonly FileOutcome[] => {
        const onDisk = digestOnDisk(request.root, request.configuration.directory, file.path)
        if (onDisk === null) return []

        return [
          {
            path: file.path,
            verdict: onDisk === file.sha256 ? 'removed' : 'kept-orphan',
            bytes: null,
            change: null,
          },
        ]
      }),
    }))
}

/**
 * Which features are not applied, and why, in the words the user reads.
 *
 * Two reasons, and the second is the one that is easy to miss. A feature is held back when a file it
 * *carries* is conflicted - carries, not owns, so a feature reading a shared blob somebody else's
 * folder holds is held back with it rather than left compiling against bytes that did not move. And a
 * feature is held back when anything it depends on is, because a dependent updated over an old
 * dependency is a combination nobody published and the worse half of a half-done update.
 */
const whatIsHeldBack = (
  order: readonly FrozenImplementation[],
  planned: readonly PlannedFeature[],
  outcomes: ReadonlyMap<string, FileOutcome>,
): ReadonlyMap<string, string> => {
  const held = new Map<string, string>()

  for (const feature of planned) {
    const conflicted = feature.files
      .filter((file) => outcomes.get(file.path)?.verdict === 'conflict')
      .map((file) => file.path)

    // The reason does not name the files, because the lines underneath it do. A held-back feature
    // prints one sentence and then a `!` line per file, and saying the paths twice makes the reader
    // check whether the two lists are the same one.
    if (conflicted.length > 0) {
      held.set(
        keyOf(feature.implementation.contract),
        conflicted.length === 1
          ? 'you edited a file the registry changed too'
          : `you edited ${conflicted.length} files the registry changed too`,
      )
    }
  }

  // Settled by running to a fixed point rather than by one pass, because a dependent may be planned
  // before the dependency that holds it back - the order is dependencies-first per root, and a second
  // root can reach a feature the first one already placed.
  for (let again = true; again; ) {
    again = false

    for (const implementation of order) {
      const what = keyOf(implementation.contract)
      if (held.has(what)) continue

      const blocking = implementation.dependsOn.find((edge) => held.has(keyOf(edge.contract)))
      if (blocking === undefined) continue

      held.set(what, `it imports ${renderContract(blocking.contract)}, which is held back`)
      again = true
    }
  }

  return held
}

// ---------------------------------------------------------------------------
// The whole of it
// ---------------------------------------------------------------------------

export const prepareUpdate = (source: RegistrySource, request: UpdateRequest): UpdateOutcome => {
  if (request.lockfile.features.length === 0) {
    return { faults: ['toopo.lock records no installed feature, so there is nothing to update'] }
  }

  const roots = request.lockfile.features.filter((feature) => feature.askedFor)
  if (roots.length === 0) {
    return {
      faults: [
        'toopo.lock records features and says every one of them was pulled in as a dependency, so ' +
          'nothing in it is a root and an update has nowhere to start.',
      ],
    }
  }

  const graph = theNewGraph(source, roots)
  if ('faults' in graph) return { faults: graph.faults }

  const planned = planInstall(graph.order)
  if ('faults' in planned) return { faults: planned.faults }

  const fetched = fetchedSources(source, planned.plan)
  if (refused(fetched)) return { faults: fetched.faults }

  const rewritten = rewrittenSources(fetched.found, planned.plan.relocation)
  if ('faults' in rewritten) return { faults: rewritten.faults }

  const claimed: Claimed = new Map(
    request.lockfile.features.flatMap((feature) =>
      feature.files.map((file) => [file.path, file] as const),
    ),
  )

  const unclaimed = planned.plan.files
    .filter(
      (file) =>
        file.written &&
        !claimed.has(file.path) &&
        digestOnDisk(request.root, request.configuration.directory, file.path) !== null,
    )
    .map(
      (file) =>
        `${request.configuration.directory}/${file.path} is already there and toopo.lock does not ` +
        `claim it, so it is not ours to overwrite`,
    )

  if (unclaimed.length > 0) return { faults: unclaimed }

  const outcomes = new Map<string, FileOutcome>()
  for (const file of planned.plan.files) {
    if (!file.written) continue

    outcomes.set(
      file.path,
      outcomeOf(
        request,
        claimed,
        file.path,
        Buffer.from(rewritten.sources.get(file.servedAt) as string, 'utf8'),
      ),
    )
  }

  const leaving = leavingFeatures(request, planned.plan.features)
  const held = whatIsHeldBack(graph.order, planned.plan.features, outcomes)

  return {
    update: assemble(request, planned.plan, outcomes, leaving, held, rewritten.sources),
  }
}

/**
 * The report, the bytes and the lockfile, built from one set of verdicts.
 *
 * They are built together on purpose: three walks over the same verdicts would be three chances for
 * the thing shown, the thing written and the thing recorded to disagree, and the whole product here is
 * that they do not.
 */
const assemble = (
  request: UpdateRequest,
  plan: InstallPlan,
  outcomes: ReadonlyMap<string, FileOutcome>,
  leaving: readonly Leaving[],
  held: ReadonlyMap<string, string>,
  sources: ReadonlyMap<string, string>,
): Update => {
  const locked = new Map(request.lockfile.features.map((feature) => [keyOf(feature.contract), feature]))
  const features: FeatureOutcome[] = []
  const writes: FileToWrite[] = []
  const removals: string[] = []
  let lockfile: Lockfile = { version: 1, features: [] }

  for (const planning of plan.features) {
    const what = keyOf(planning.implementation.contract)
    const was = locked.get(what)
    const written = planning.files.filter((file) => file.written)
    const files = written.map((file) => outcomes.get(file.path) as FileOutcome)
    const heldBack = held.get(what) ?? null

    features.push({
      contract: planning.implementation.contract,
      was: was === undefined ? null : standingOf(was),
      now: { id: planning.implementation.id, version: planning.implementation.version },
      files,
      heldBack,
    })

    if (heldBack !== null) {
      // Held back means nothing of it moves, including its entry: the project still holds exactly what
      // the lockfile said it held, which is what makes running this again a safe thing to do.
      if (was !== undefined) lockfile = withFeature(lockfile, was)
      continue
    }

    const wrote = files.filter((file) => file.bytes !== null)
    for (const file of wrote) writes.push({ path: file.path, bytes: file.bytes as Buffer })

    const moved =
      wrote.length > 0 ||
      was === undefined ||
      was.implementation.id !== planning.implementation.id ||
      was.implementation.version !== planning.implementation.version

    lockfile = withFeature(lockfile, {
      contract: planning.implementation.contract,
      implementation: {
        id: planning.implementation.id,
        version: planning.implementation.version,
      },
      /**
       * The planned bytes, for every file, including the ones this run leaves alone.
       *
       * A `kept` file is the case that decides this. Its digest is unchanged - that is what `kept`
       * means - so the planned bytes and the recorded digest agree, and recording *the disk* instead
       * would write the user's own edit into the lockfile as though we had put it there, which would
       * make their change invisible to the next run and safe to overwrite. The one thing this file
       * exists to prevent.
       */
      files: written.map((file) => {
        const bytes = Buffer.from(sources.get(file.servedAt) as string, 'utf8')

        return {
          path: file.path,
          served: file.served,
          sha256: digestOfBytes(bytes),
          bytes: bytes.byteLength,
        }
      }),
      // The instant moves only when something did, so that running this twice leaves one lockfile.
      installedAt: moved ? request.at : (was as LockedFeature).installedAt,
      locallyModified: files.some((file) => EDITED.has(file.verdict)),
      askedFor: was?.askedFor ?? false,
    })
  }

  /**
   * Nothing is removed while anything is held back, and this is the rule that was found by looking at
   * the report rather than at the code.
   *
   * A feature leaves the closure because somebody's *new* code stopped importing it. A held-back
   * feature is running its *old* code, which may import it still - measured on the imagined graph,
   * where `number/round@1.0.1` drops `number/sign` and the held-back `round.ts` on disk goes on
   * importing `../sign/sign.js`. Removing it there would break a build to tidy a folder.
   *
   * It is the blunt form of the rule on purpose. The exact one - ask the registry for each held-back
   * feature's old edges and remove what none of them reaches - costs a fetch per held-back feature and
   * a fallback for a registry that no longer serves the old version, to win one run of tidiness in a
   * situation the user is already in the middle of resolving. This one is a sentence anybody can check.
   */
  const somethingIsHeldBack = held.size > 0

  for (const entry of leaving) {
    const edited = entry.files.filter((file) => file.verdict === 'kept-orphan')
    const heldBack =
      edited.length > 0
        ? `you edited ${edited.length === 1 ? 'a file' : `${edited.length} files`} of a feature ` +
          `nothing imports any more, so it stays where it is`
        : somethingIsHeldBack
          ? 'nothing is removed while a feature is held back, because a held-back feature runs its ' +
            'old code and that code may still import this'
          : null

    features.push({
      contract: entry.feature.contract,
      was: standingOf(entry.feature),
      now: null,
      files: entry.files,
      heldBack,
    })

    if (heldBack !== null) {
      lockfile = withFeature(lockfile, { ...entry.feature, locallyModified: edited.length > 0 })
      continue
    }

    removals.push(...entry.files.map((file) => file.path))
  }

  return { features, writes, removals, lockfile }
}
