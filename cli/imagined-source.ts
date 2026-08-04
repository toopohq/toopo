/**
 * A registry over the imagined graph, which is the only registry that can exercise this installer.
 *
 * **The reserve this file answers, stated before the code.** None of the five contracts depends on
 * anything. Recursive resolution and deduplication are the two mechanisms the whole distribution model
 * is for, and the catalogue offers them no case at all - so shipping them measured only against the
 * five would be shipping two decorative guards in the unit that proves the model. The graph is
 * `registry/imagined-graph.ts`, it is the one `toopo add` was written from, and a second consumer for
 * it is why it is no longer inside a test file.
 *
 * Everything the installer touches here is real arithmetic over real bytes: the snapshots are built by
 * `implementationSnapshot`, the digests by `digestOfSnapshot`, and the blobs are the graph's own
 * sources hashed by `digestOfBytes`. So a defect in the installer's verification is caught here exactly
 * as it would be against a server.
 *
 * The one thing written by hand is the index, and that is what an index *is*: `response.ts` says in as
 * many words that it is the registry saying what it holds, checkable by nothing. Building it through
 * `servedIndex` would have meant a ledger, a ledger means a published contract digest, and a contract
 * digest means fabricating a `ContractRecord` for three contracts that do not exist - four fabrications
 * to obtain a value whose whole nature is that it is asserted.
 */

import type { ContractAddress } from '../registry/address.js'
import { renderContract, renderImplementation, sameContract } from '../registry/address.js'
import {
  HOLDINGS,
  IMAGINED_BLOBS,
  IMAGINED_NEXT_VERSION,
  IMAGINED_VERSION,
  INDEPENDENT_CARRIERS,
  NEXT_HOLDINGS,
} from '../registry/imagined-graph.js'
import type { ImplementationRecord } from '../registry/implementation-record.js'
import type { ServedImplementationBinding, ServedIndex } from '../registry/response.js'
import { servedBlob, servedSnapshot } from '../registry/response.js'
import { digestOfSnapshot, implementationSnapshot } from '../registry/snapshot.js'
import type { RegistrySource } from './source.js'

/**
 * What the index says about each imagined contract.
 *
 * `number/round` is marked installable and the other three are too, because every one of them is
 * something a dependent imports. A refused contract that is nonetheless a dependency would be a
 * catalogue contradicting itself, and the installer's refusal of an uninstallable contract is measured
 * against the five - where `array/group-by@1` is genuinely refused.
 */
const SUMMARIES: Readonly<Record<string, string>> = {
  'string/pad': 'Pad a run of digits on the left, or answer the text unchanged.',
  'number/clamp': 'Hold a number between a low and a high bound.',
  'number/sign': 'Answer -1 or 1 for the sign of a number.',
  'number/round': 'Round a number to a given number of decimal places.',
  'text/left': 'Trim the start of a text that holds whitespace.',
  'text/right': 'Trim the end of a text that holds whitespace.',
}

const indexEntryOf = (record: ImplementationRecord) => {
  const name = record.contract.name
  const action = name.slice(name.indexOf('/') + 1)
  const summary = SUMMARIES[name]
  if (summary === undefined) throw new Error(`the imagined index has no summary for ${name}`)

  return {
    address: record.contract,
    summary,
    searchAliases: [action],
    domain: name.slice(0, name.indexOf('/')),
    installable: true,
    // Every imagined body exports its action and nothing else, so the index says so rather than
    // inventing a diagnostic none of them publishes.
    exports: [{ name: action, role: 'the-answer' as const }],
  }
}

const snapshotOf = (record: ImplementationRecord) => implementationSnapshot(record)

const bindingOf = (record: ImplementationRecord): ServedImplementationBinding => ({
  addressing: 'named',
  address: { contract: record.contract, id: record.id, version: record.version ?? IMAGINED_VERSION },
  digest: digestOfSnapshot(snapshotOf(record)),
  publishedAt: '1970-01-01T00:00:00.000Z',
  status: record.status,
  benchmarks: record.benchmarks,
  minifiedBytes: record.minifiedBytes,
  tags: record.tags,
})

/**
 * A source serving exactly these implementations, over the graph's blobs and index.
 *
 * One builder for the three sources this file publishes, because they differ only in *which* records
 * they hold - which is the whole of what each of them is for - and three copies of the four methods
 * would be three places to keep one port implemented.
 */
const sourceOver = (
  held: readonly ImplementationRecord[],
  /**
   * What the index says this registry holds, which is not the same list as what it serves.
   *
   * `imaginedSource(refuse)` drops an implementation from `held` to make an *edge* resolve to nothing,
   * and the contract has to stay in the index for that to be the failure under measurement rather than
   * an unknown name. So the default is the whole graph, and only a source over a different graph
   * entirely passes its own.
   */
  indexed: readonly ImplementationRecord[] = HOLDINGS,
): RegistrySource => {
  const snapshots = new Map(
    held.map((record) => [digestOfSnapshot(snapshotOf(record)), servedSnapshot(snapshotOf(record))]),
  )
  const index: ServedIndex = { addressing: 'named', entries: indexed.map(indexEntryOf) }

  return {
    contractIndex: () => index,

    implementationBindings: (address: ContractAddress) =>
      held.filter((record) => sameContract(record.contract, address)).map(bindingOf),

    // The imagined graph is four features nobody decided against, so this is empty rather than
    // fabricated: a fixture that invented a refusal would let a guard pass on a shape the catalogue
    // does not produce.
    refusals: () => ({ addressing: 'named', refusals: [], absorbed: [] }),

    snapshot: (digest) => snapshots.get(digest) ?? null,

    blob: (sha256) => {
      const bytes = IMAGINED_BLOBS.get(sha256)

      return bytes === undefined ? null : servedBlob(bytes)
    },
  }
}

/**
 * A source over the imagined graph.
 *
 * `refuse` names an implementation address this source pretends not to hold, so that a caller can
 * measure what happens when an edge resolves to nothing without having to build a second graph. It is
 * a parameter rather than a second source because the two differ in one answer, and two sources
 * differing in one answer is a copy waiting to drift.
 */
export const imaginedSource = (refuse: readonly string[] = []): RegistrySource =>
  sourceOver(
    HOLDINGS.filter(
      (record) =>
        !refuse.includes(
          renderImplementation({ contract: record.contract, id: record.id, version: IMAGINED_VERSION }),
        ),
    ),
  )

/**
 * The same registry, one publication later. What `toopo update` is measured against.
 *
 * It serves the second publication as the binding every name resolves to today, which is what a
 * registry does: the first publication is still addressable by digest and is still served as blobs -
 * permanent rule 6 - but a name resolves to what is current, and finding out that it moved is the
 * whole of what an update asks.
 */
export const updatedImaginedSource = (): RegistrySource => sourceOver(NEXT_HOLDINGS)

/**
 * A registry that has published twice and, as permanent rule 6 requires, still serves the first.
 *
 * `updatedImaginedSource` deliberately does not: an update is measured against a registry whose *name
 * resolution* has moved, and dropping the old artefacts is the shortest way to say so. A removal asks
 * the opposite question - it resolves what stays at the version the lockfile records - and it can only
 * be measured against a registry where both answers exist and the command has to pick one.
 *
 * The second publication is listed first, because that is what a binding by name means: the artefact a
 * contract resolves to *today*. A removal that followed it would plan the project against a graph the
 * files on disk are not, which is the defect this ordering makes visible.
 */
export const sourceServingBothPublications = (): RegistrySource =>
  sourceOver([...NEXT_HOLDINGS, ...HOLDINGS])

/**
 * A source whose `string/pad@1` is held at two versions at once, which is the collision no fixture of
 * the schema produced and every real catalogue eventually will.
 *
 * Two dependents may legitimately have been published against two versions of one feature - `sign`
 * against `1.0.0` and `clamp` against `1.0.1` - and both addresses resolve, because they *are* two
 * artefacts. What cannot happen is both landing in the project: one feature is one folder, so the
 * second write would overwrite the first and the dependent that asked for it would silently get the
 * other one's code.
 */
/**
 * Two roots that share one file and depend on nothing, which is the shape a removal has to survive and
 * the one the main graph cannot produce.
 *
 * There, the carrier of a shared blob is always a dependency of its borrower, so it can never leave
 * while the borrower stays. Here it can: removing `text/left@1` has to move `trim.ts` into
 * `text/right/` and repoint the import inside `right.ts` at it, or the project is left holding a file
 * that imports one that is gone.
 */
export const sourceWithIndependentCarriers = (): RegistrySource =>
  sourceOver(INDEPENDENT_CARRIERS, INDEPENDENT_CARRIERS)

export const TWO_VERSIONS_OF_ONE_FEATURE = IMAGINED_NEXT_VERSION

export const sourceWithTwoVersionsOfPad = (): RegistrySource => {
  const pad = HOLDINGS.find((record) => record.contract.name === 'string/pad')
  const clamp = HOLDINGS.find((record) => record.contract.name === 'number/clamp')
  if (pad === undefined || clamp === undefined) {
    throw new Error('the imagined graph no longer holds string/pad and number/clamp')
  }

  const newerPad: ImplementationRecord = { ...pad, version: TWO_VERSIONS_OF_ONE_FEATURE }
  const clampOnTheNewerPad: ImplementationRecord = {
    ...clamp,
    dependsOn: [
      { contract: pad.contract, id: 'reference', version: TWO_VERSIONS_OF_ONE_FEATURE },
    ],
  }

  return sourceOver(
    HOLDINGS.map((record) =>
      record.contract.name === 'number/clamp' ? clampOnTheNewerPad : record,
    ).concat(newerPad),
  )
}

/** The contract the imagined graph is rooted at, so that a caller does not transcribe the name. */
export const THE_IMAGINED_ROOT = renderContract({
  language: 'typescript',
  name: 'number/round',
  major: 1,
})
