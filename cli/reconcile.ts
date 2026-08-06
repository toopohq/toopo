/**
 * What a project should hold, and what getting there costs the files already in it.
 *
 * This is the middle both `update` and `remove` are built on, and it is one module because the two
 * commands differ in exactly two things: which features they call roots, and at which version those
 * roots are bound. Everything after that - the closure, the plan, the deduplication, the six answers
 * about a file, what is held back, what leaves, and the lockfile left behind - is one arithmetic, and
 * a second copy of it would be a second set of answers to the question this folder exists to answer
 * once.
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
 * compared against, and no run of this can be made without both.
 *
 * ---------------------------------------------------------------------------
 * The lockfile records what was written, never what was planned
 * ---------------------------------------------------------------------------
 *
 * Two claims about `toopo.lock` sound alike and only one of them is true, and the difference decides
 * what this module may be asked to do offline.
 *
 * **True:** the lockfile lets anybody check, with nothing from us, that the bytes on disk are the bytes
 * that were served. That is the supply-chain argument of the whole project and it holds entirely - it
 * is what `sha256` and `served` are for.
 *
 * **False:** that the lockfile describes the installed graph. It does not, and no field would fix it.
 * A shared blob is written once, in the folder of whichever carrier the resolution reached first, and
 * the other carriers are repointed at it - so the second carrier's entry does not mention the file it
 * imports. Measured on the fixture graph: `number/clamp@1`'s entry names one file, and
 * `number/clamp/clamp.ts` imports `../../string/pad/digits.js`. A removal decided from the lockfile
 * alone would delete `string/pad/digits.ts` and three files that stay would import something that is
 * gone - not an incomplete answer, a wrong and silent one.
 *
 * Recording the edges would not close it either: deduplication is a property of the *plan* and not of
 * the graph, a blob is recognised by its digest and never by a path, and two roots that depend on
 * nothing can still share one file. The only sufficient record would be the plan itself, which is a
 * cache of something the registry recomputes - a second source of truth that can contradict the first.
 * So the plan is rebuilt here, every time, and that is why anything but the last root of a project
 * needs a registry to answer.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ContractAddress } from '../registry/address.js'
import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { InstalledFile, LockedFeature, Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION, resolveDependencies } from '../registry/implementation-record.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import type { Configuration } from './configuration.js'
import type { FileDiff } from './diff.js'
import { diffOf } from './diff.js'
import { digestOnDisk, withFeature } from './lockfile.js'
import type { InstallPlan, PlannedFeature } from './plan.js'
import { planInstall } from './plan.js'
import {
  bindingAt,
  bindingFor,
  contractAt,
  fetchedSources,
  gatherHoldings,
  heldAt,
  refused,
} from './resolve.js'
import { rewrittenSources } from './rewrite.js'
import type { RegistrySource } from './source.js'
import type { FileToWrite } from './write.js'

/**
 * At which version a root is resolved, named rather than passed as a predicate.
 *
 * A union with two members and no third, because a command that reconciled a project without deciding
 * this would be deciding it by accident - and the two answers are the difference between an update and
 * a removal, not a detail of either.
 *
 * **`as-the-registry-serves-it-today`** is what an update *is*: go and see what moved.
 *
 * **`as-the-lockfile-records-it`** is what a removal needs, and the reason is not merely that a
 * removal should not quietly update four other features. It is that the files a removal deletes are
 * decided by re-planning what stays, and a root re-planned at *today's* publication may have dropped a
 * dependency or stopped sharing a file - so a blob the version on disk still imports would be planned
 * away and deleted underneath it. The bytes in the project were installed against the recorded
 * versions, and those are the versions whose closure describes them.
 */
export type HowRootsAreBound = 'as-the-registry-serves-it-today' | 'as-the-lockfile-records-it'

export type ReconcileRequest = {
  readonly root: string
  readonly configuration: Configuration
  /**
   * The lockfile as the project holds it, which callers hand over unchanged.
   *
   * **It used to be the thing a caller shaped, and that is what made a report lie.** `remove` passed
   * this file with one feature's `askedFor` already cleared, so one value was answering two questions -
   * *what does the project hold* and *what does this command want as roots* - and every reader below
   * got the second when it wanted the first. A feature held back then recorded the demotion while the
   * screen said nothing had changed. It is the shape `install.ts` records for `promoted`: the defect is
   * never a wrong value, it is one value answering for two claims.
   */
  readonly lockfile: Lockfile
  /**
   * The feature this command is taking out of the roots, or `null` when it is not a removal.
   *
   * Required rather than optional, the shape `Commit.leaving` already takes: a caller that could omit
   * it is a caller that will. It is applied in exactly two places - the roots a plan is built from, and
   * the `askedFor` of an entry this run rewrites - and **never to a feature that is held back**, which
   * is what makes *held back, nothing changed* a sentence rather than a hope.
   */
  readonly demoted: ContractAddress | null
  readonly boundAs: HowRootsAreBound
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

/**
 * For every feature the plan holds, the roots whose closure reaches it. A root reaches itself.
 *
 * Keyed by rendered contract address, and it exists for one reader: the refusal `remove` owes somebody
 * who asks to take out a feature they never asked for. *You did not install this, `number/round@1`
 * imports it* is an answer they can act on; *it is a dependency* is not. The order throws this away -
 * it folds every root's closure into one list so that a shared file is seen once - so it is kept here
 * on the way past rather than resolved a second time.
 */
export type ReachedBy = ReadonlyMap<string, readonly ContractAddress[]>

export type Reconciliation = {
  readonly features: readonly FeatureOutcome[]
  readonly writes: readonly FileToWrite[]
  readonly removals: readonly string[]
  /** The lockfile this leaves behind, which the caller commits together with the bytes. */
  readonly lockfile: Lockfile
  readonly reachedBy: ReachedBy
  /**
   * The lockfile claims files and not one of them is on disk.
   *
   * It is a signal rather than a verdict, and it is here because it is the one shape of a project this
   * module can see and a reader cannot: every file `restored`, on a project nobody deleted anything
   * from. What produces it is a checkout that never received the folder - which is what happens when
   * the installed directory is not committed, and what makes that trap silent is that the repair works
   * perfectly and hides the cause until the next person clones.
   *
   * False when the lockfile claims nothing, because a project with no files is not a project missing
   * its files.
   */
  readonly everyClaimedFileIsMissing: boolean
}

export type ReconcileOutcome =
  | { readonly reconciliation: Reconciliation }
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
const installedText = (request: ReconcileRequest, path: string): string => {
  const full = join(request.root, request.configuration.directory, path)

  return servedBytes(readFileSync(full)).toString('utf8')
}

// ---------------------------------------------------------------------------
// Where a reconciliation starts
// ---------------------------------------------------------------------------

/**
 * The graph the project should hold: every feature the user asked for, and everything those reach.
 *
 * The implementation `id` is carried over from the lockfile in both policies, and `resolve.ts` says
 * why: following the registry's default would move somebody who chose an implementation onto a
 * different one, which is a larger change than a version bump and exactly what permanent rule 4
 * forbids doing quietly. What `boundAs` decides is the *version*, and only that.
 */
type TheGraph = {
  readonly order: readonly FrozenImplementation[]
  readonly reachedBy: ReachedBy
}

const theNewGraph = (
  source: RegistrySource,
  roots: readonly LockedFeature[],
  boundAs: HowRootsAreBound,
): TheGraph | { readonly faults: readonly string[] } => {
  const held: FrozenImplementation[] = []
  const faults: string[] = []

  for (const feature of roots) {
    const contract = contractAt(source, feature.contract)
    if (refused(contract)) {
      faults.push(...contract.faults)
      continue
    }

    const binding =
      boundAs === 'as-the-registry-serves-it-today'
        ? bindingFor(source, feature.contract, feature.implementation.id)
        : bindingAt(source, feature.contract, feature.implementation)
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
  const reachedBy = new Map<string, ContractAddress[]>()

  try {
    for (const root of held) {
      // The closure of this root on its own, before it is folded into the project's order: which root
      // reaches what is exactly the question the order throws away, and the one a removal asks.
      for (const implementation of [...resolveDependencies(root, holdings.found), root]) {
        const what = keyOf(implementation.contract)
        const holders = reachedBy.get(what) ?? []
        holders.push(root.contract)
        reachedBy.set(what, holders)

        if (seen.has(what)) continue
        seen.add(what)
        order.push(implementation)
      }
    }
  } catch (error) {
    return { faults: [error instanceof Error ? error.message : String(error)] }
  }

  return { order, reachedBy }
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
  request: ReconcileRequest,
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
  request: ReconcileRequest,
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
 * Files a staying feature stops carrying because another feature's folder now holds the same bytes.
 *
 * **Found by measuring, and it is a hole `update` had before `remove` existed.** Two features that
 * carry one file are deduplicated by whichever plan sees them both - and `add` never does, because it
 * plans one root at a time. So two separate installs write two copies, each claimed by its own entry,
 * and the first `update` afterwards repoints one at the other and drops it from that entry. Measured:
 * the file stayed on disk claimed by nothing, and the next command that wanted to write there refused
 * with *it is already there and toopo.lock does not claim it* - about a file this tool had written two
 * commands earlier.
 *
 * The bytes are not in question: deduplication is by digest, so what is deleted is a copy of what the
 * carrier holds and the borrower's import has already been repointed at it. What is in question is
 * whether the user changed it, which is the same question asked of a leaving feature and gets the same
 * answer - an edited file stays, under `kept-orphan`, and is never silently taken.
 *
 * A feature whose *whole* entry is leaving is not here: `leavingFeatures` has it, and both appearing
 * would report one file twice.
 */
const deduplicatedAway = (
  request: ReconcileRequest,
  plan: InstallPlan,
): ReadonlyMap<string, readonly FileOutcome[]> => {
  const written = new Set(plan.files.filter((file) => file.written).map((file) => file.path))
  const staying = new Set(plan.features.map((feature) => keyOf(feature.implementation.contract)))
  const orphans = new Map<string, FileOutcome[]>()

  for (const feature of request.lockfile.features) {
    const what = keyOf(feature.contract)
    if (!staying.has(what)) continue

    for (const file of feature.files) {
      if (written.has(file.path)) continue

      const onDisk = digestOnDisk(request.root, request.configuration.directory, file.path)
      if (onDisk === null) continue

      const held = orphans.get(what) ?? []
      held.push({
        path: file.path,
        verdict: onDisk === file.sha256 ? 'removed' : 'kept-orphan',
        bytes: null,
        change: null,
      })
      orphans.set(what, held)
    }
  }

  return orphans
}

/**
 * Which features are not applied, and why, in the words the user reads.
 *
 * Two reasons, and the second is the one that is easy to miss. A feature is held back when a file it
 * *carries* is conflicted - carries, not owns, so a feature reading a shared blob somebody else's
 * folder holds is held back with it rather than left compiling against bytes that did not move. And a
 * feature is held back when anything it depends on is, because a dependent updated over an old
 * dependency is a combination nobody published and the worse half of a half-done change.
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

/**
 * Nothing moved at all: no byte, no entry, and nothing held back.
 *
 * **The condition under which a command may say "nothing to do", and it used to be two thirds of
 * it.** No file written and nothing held back was read as nothing to do - and the lockfile is the
 * third thing a run changes. Measured: a project whose lockfile claims a feature no root reaches and
 * whose files are already gone writes no byte, holds nothing back, and drops the entry. The screen
 * said *every file is as it was written*, listed the feature as leaving, and closed with *Nothing to
 * do.* - three sentences, two of them contradicting the third, about the reader's own project.
 *
 * The comparison is over the serialised form because that is what lands on disk, and because a
 * lockfile equal to the one that was read is exactly the run that would rewrite nothing.
 */
export const nothingMoved = (before: Lockfile, after: Reconciliation): boolean =>
  !commitChangesSomething(before, after) &&
  after.features.every((feature) => feature.heldBack === null)

/**
 * Whether committing this would change anything at all: a byte on disk, or a line of the lockfile.
 *
 * **Not the same question as `nothingMoved`, and separating them repaired a sentence.** That one
 * decides whether a command may say *nothing to do*, so it also requires that nothing is held back -
 * a project with a conflict in it has something to do even when this run writes nothing. This one is
 * only about what the commit does, and it is what the closing line is entitled to say: a removal whose
 * every feature is held back used to close with *Written, and recorded in toopo.lock* directly under
 * *held back, nothing changed*, because the closing was read off `--apply` having been typed rather
 * than off anything having happened.
 */
export const commitChangesSomething = (before: Lockfile, after: Reconciliation): boolean =>
  after.writes.length > 0 ||
  after.removals.length > 0 ||
  JSON.stringify(after.lockfile) !== JSON.stringify(before)

/**
 * Whether this contract is the one the command is taking out of the roots.
 *
 * One reading of `demoted`, used by both places that honour it, because two spellings of *is this the
 * feature being removed* is how the plan and the entry come to disagree about which feature it was.
 */
const isDemoted = (request: ReconcileRequest, contract: ContractAddress): boolean =>
  request.demoted !== null && keyOf(request.demoted) === keyOf(contract)

export const reconcileProject = (
  source: RegistrySource,
  request: ReconcileRequest,
): ReconcileOutcome => {
  const roots = request.lockfile.features.filter(
    (feature) => feature.askedFor && !isDemoted(request, feature.contract),
  )
  const graph = theNewGraph(source, roots, request.boundAs)
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
    reconciliation: assemble(
      request,
      planned.plan,
      outcomes,
      leaving,
      held,
      rewritten.sources,
      graph.reachedBy,
      deduplicatedAway(request, planned.plan),
    ),
  }
}

/**
 * Whether the project holds none of what it claims.
 *
 * Asked of the lockfile rather than of the plan, because it is a question about what the user has and
 * not about what they should have: a feature that left the closure is claimed too, and its absence is
 * part of the same evidence.
 */
const nothingClaimedIsOnDisk = (request: ReconcileRequest): boolean => {
  const claimed = request.lockfile.features.flatMap((feature) => feature.files)

  return (
    claimed.length > 0 &&
    claimed.every(
      (file) => digestOnDisk(request.root, request.configuration.directory, file.path) === null,
    )
  )
}

/**
 * The report, the bytes and the lockfile, built from one set of verdicts.
 *
 * They are built together on purpose: three walks over the same verdicts would be three chances for
 * the thing shown, the thing written and the thing recorded to disagree, and the whole product here is
 * that they do not.
 */
const assemble = (
  request: ReconcileRequest,
  plan: InstallPlan,
  outcomes: ReadonlyMap<string, FileOutcome>,
  leaving: readonly Leaving[],
  held: ReadonlyMap<string, string>,
  sources: ReadonlyMap<string, string>,
  reachedBy: ReachedBy,
  orphans: ReadonlyMap<string, readonly FileOutcome[]>,
): Reconciliation => {
  const locked = new Map(request.lockfile.features.map((feature) => [keyOf(feature.contract), feature]))
  const features: FeatureOutcome[] = []
  const writes: FileToWrite[] = []
  const removals: string[] = []
  let lockfile: Lockfile = { version: LOCKFILE_VERSION, features: [] }

  for (const planning of plan.features) {
    const what = keyOf(planning.implementation.contract)
    const was = locked.get(what)
    const written = planning.files.filter((file) => file.written)
    const dropped = orphans.get(what) ?? []
    const files = [...written.map((file) => outcomes.get(file.path) as FileOutcome), ...dropped]
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

    // A copy deduplicated away goes with the same care a leaving feature's file goes: only when it
    // still hashes to what we wrote there.
    for (const file of dropped) if (file.verdict === 'removed') removals.push(file.path)

    const moved =
      wrote.length > 0 ||
      dropped.length > 0 ||
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
      /**
       * The demotion lands here and only here, on a feature this run is rewriting anyway.
       *
       * A feature reached by another root is the case: it stays on disk, it stops being something the
       * user asked for, and the screen says both. Held-back features never reach this line - they
       * `continue` above with their entry carried over untouched - which is the whole of what makes
       * *nothing changed* true rather than nearly true.
       */
      askedFor: (was?.askedFor ?? false) && !isDemoted(request, planning.implementation.contract),
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
  /**
   * A leaving feature the user edited holds everything back too, and that half was missing.
   *
   * It was written as `held.size > 0`, which counts only the features still *in* the plan - and a
   * feature held back by an edit while leaving is not in the plan. Measured on a removal: editing
   * `number/round`'s own file kept it on disk, correctly, and removed the three features it imports,
   * leaving a file nobody had touched importing `../clamp/clamp.js` with nothing there. The sentence
   * beneath was already the right one; what it was asked about was the wrong set.
   */
  const editedIn = leaving.map((entry) =>
    entry.files.filter((file) => file.verdict === 'kept-orphan'),
  )
  const somethingIsHeldBack = held.size > 0 || editedIn.some((edited) => edited.length > 0)

  for (const [at, entry] of leaving.entries()) {
    const edited = editedIn[at] as readonly FileOutcome[]
    const heldBack =
      edited.length > 0
        ? `you edited ${edited.length === 1 ? 'a file' : `${edited.length} files`} of it, so it ` +
          `stays where it is`
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

    /**
     * The entry is carried over exactly as it was read, field for field.
     *
     * It used to arrive with `locallyModified` refreshed, and refreshing one field is still moving the
     * entry - on the one screen that says nothing moved. There is nothing to lose by leaving it: the
     * field is what was true when the last command ran, and `list.ts` re-hashes every file rather than
     * reading it, precisely because a cached observation is not the observation.
     */
    if (heldBack !== null) {
      lockfile = withFeature(lockfile, entry.feature)
      continue
    }

    removals.push(...entry.files.map((file) => file.path))
  }

  return {
    features,
    writes,
    removals,
    lockfile,
    reachedBy,
    everyClaimedFileIsMissing: nothingClaimedIsOnDisk(request),
  }
}
