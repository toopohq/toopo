/**
 * The artefact an archive carries, built by walking the registry exactly as an installation walks it.
 *
 * ---------------------------------------------------------------------------
 * It is a transcript, not a second description of the catalogue
 * ---------------------------------------------------------------------------
 *
 * The obvious way to build this file is to describe what an installer needs and then go and fetch it.
 * That description would be a second statement of something `resolve.ts` already makes - which edges
 * are followed, which snapshots are parsed, which files are fetched - and this repository has watched
 * a second statement of one fact go stale often enough to write the rule down.
 *
 * So nothing here describes the walk. `heldAt` and `gatherHoldings` *are* the walk, imported from the
 * installer and run against a source that records every answer it gives. What the archive carries is
 * whatever that walk asked for, which means an edge the installer learns to follow tomorrow is carried
 * tomorrow with nothing here being edited. The failure this shape cannot have is the one that matters:
 * an artefact missing exactly the answer a real install needs.
 *
 * ---------------------------------------------------------------------------
 * What it walks, and the one thing it deliberately does not
 * ---------------------------------------------------------------------------
 *
 * Every installable contract, every implementation published under it, and the transitive closure of
 * their edges. A refused contract has no binding to walk - `array/group-by@1` is in the index, is not
 * installable, and appears in the refusals answer instead - which is the registry's own shape rather
 * than a special case here.
 *
 * The harness is not fetched, and `artefact.ts` says why in full: no command of `packages/cli/` ever asks for
 * it, and carrying it would be shipping bytes nothing reads.
 *
 * ---------------------------------------------------------------------------
 * A refusal here stops the build
 * ---------------------------------------------------------------------------
 *
 * `Found` carries faults because an installer meets a registry that may be having a bad day and has to
 * tell a user about it. A build meets a registry that is a serialisation of the working tree three
 * lines up the stack: a fault is this repository contradicting itself, and the only honest thing to do
 * with it is stop. An archive built around a fault would ship a `toopo` that refuses at the moment
 * somebody installs something, which is the worst possible place to find out.
 *
 * ---------------------------------------------------------------------------
 * It warms the cache and then records one pass, and that order is forced
 * ---------------------------------------------------------------------------
 *
 * The walk is synchronous and the registry answers promises, so this file runs `fixpoint.ts` - and the
 * two phases may not be collapsed into one. `recording` writes an entry for **every** answer it is
 * asked for, and a decision replayed against a cold cache is answered with what a registry holding
 * nothing answers: an empty binding list. Recording during the loop would therefore freeze an artefact
 * whose bindings are the misses of a first round, and *the catalogue is empty because nobody looked* is
 * exactly the state the paragraph below already refuses to be able to produce.
 *
 * So the loop warms, and then `withoutAsking` takes one pass over a cache that holds everything. That
 * pass asks for nothing, which is asserted rather than assumed - a pass that still wanted an answer
 * would mean the warming walk and the recording walk had diverged, which is the one failure a
 * transcript cannot survive.
 */

import { renderContract, renderImplementation } from '../packages/registry/address.js'
import type { ContractAddress } from '../packages/registry/address.js'
import type { ServedBlob, ServedSnapshot } from '../packages/registry/response.js'
import type { FrozenImplementation } from '../packages/registry/snapshot.js'
import type { ArtefactBindings, ArtefactBlob, ServedArtefact } from '../packages/cli/artefact.js'
import { ARTEFACT_FORMAT } from '../packages/cli/artefact.js'
import { deciding, withoutAsking } from '../packages/cli/fixpoint.js'
import { gatherHoldings, heldAt, refused } from '../packages/cli/resolve.js'
import type { Found, RootAt } from '../packages/cli/resolve.js'
import type { HeldRegistry, RegistrySource } from '../packages/cli/source.js'

export class TheRegistryContradictsItself extends Error {
  constructor(faults: readonly string[]) {
    super(
      `this archive cannot be built, because the registry it would carry does not answer for ` +
        `everything it offers:\n${faults.join('\n')}`,
    )
    this.name = 'TheRegistryContradictsItself'
  }
}

type Recording = {
  readonly source: HeldRegistry
  readonly bindings: Map<string, ArtefactBindings>
  readonly snapshots: Map<string, ServedSnapshot>
  readonly blobs: Map<string, ServedBlob>
}

/**
 * A source that answers exactly what it wraps and remembers every answer.
 *
 * The two named answers a walk asks for once - the index and the refusals - are not recorded here.
 * They are taken directly below, because recording them would mean the artefact carried them only if
 * something happened to ask, and *the catalogue is empty because nobody looked* is not a state this
 * file should be able to produce.
 */
const recording = (source: HeldRegistry): Recording => {
  const bindings = new Map<string, ArtefactBindings>()
  const snapshots = new Map<string, ServedSnapshot>()
  const blobs = new Map<string, ServedBlob>()

  return {
    bindings,
    snapshots,
    blobs,
    source: {
      contractIndex: () => source.contractIndex(),
      refusals: () => source.refusals(),

      implementationBindings: (address: ContractAddress) => {
        const answer = source.implementationBindings(address)
        bindings.set(renderContract(address), { contract: renderContract(address), bindings: answer })

        return answer
      },

      snapshot: (digest) => {
        const answer = source.snapshot(digest)
        if (answer !== null) snapshots.set(digest, answer)

        return answer
      },

      blob: (sha256) => {
        const answer = source.blob(sha256)
        if (answer !== null) blobs.set(sha256, answer)

        return answer
      },
    },
  }
}

/**
 * Every implementation the index offers, as the roots a dependency walk starts from.
 *
 * It answers `Found` rather than throwing, and that is what lets the fixpoint replay it: a round run
 * against a cache that holds nothing must be able to ask for everything and refuse harmlessly, where an
 * exception would end the build on the first round of its own warming.
 */
const rootsOf = (source: HeldRegistry): Found<readonly RootAt[]> => {
  const roots: RootAt[] = []
  const faults: string[] = []

  for (const entry of source.contractIndex().entries.filter((candidate) => candidate.installable)) {
    for (const binding of source.implementationBindings(entry.address)) {
      const answer = heldAt(source, binding.address, binding.digest)

      if (refused(answer)) {
        faults.push(
          ...answer.faults.map((fault) => `${renderImplementation(binding.address)}: ${fault}`),
        )
      } else {
        roots.push({ frozen: answer.found, digest: binding.digest })
      }
    }
  }

  return faults.length > 0 ? { faults } : { found: roots }
}

const blobEntry = (blob: ServedBlob): ArtefactBlob => ({
  addressedBy: blob.addressedBy,
  base64: blob.bytes.toString('base64'),
})

/**
 * Sorted everywhere a list is written, so that two builds of one working tree produce one byte string.
 *
 * A map's insertion order is the order a walk happened to take, and a walk's order is not a fact about
 * the catalogue. Two archives differing only in the order their walk resolved would have two digests,
 * and a digest that moves for no reason is the immutability defect this repository has already found
 * twice elsewhere.
 */
const byKey = <T>(entries: readonly T[], keyOf: (entry: T) => string): readonly T[] =>
  [...entries].sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : 1))

/**
 * The whole transcript, as a value, taken against whatever the caller holds.
 *
 * One function and not two, which is this file's own rule: a warming pass and a recording pass written
 * apart would be two statements of one walk, and the second would stop asking for something the first
 * still fetched. The fixpoint runs *this* to find out what to fetch, and runs *this* again to record.
 */
const transcribed = (held: HeldRegistry): Found<ServedArtefact> => {
  const recorded = recording(held)
  const { source } = recorded

  const index = source.contractIndex()
  const refusals = source.refusals()

  const roots = rootsOf(source)
  if (refused(roots)) return roots

  const holdings = gatherHoldings(source, roots.found)
  if (refused(holdings)) return holdings

  const unserved = holdings.found.flatMap((holding) =>
    holding.files
      .filter((file) => source.blob(file.sha256) === null)
      .map(
        (file) =>
          `${renderContract(holding.contract)}, whose ${file.path} it does not serve: no file is ` +
          `served at ${file.sha256}`,
      ),
  )
  if (unserved.length > 0) return { faults: unserved }

  return {
    found: {
      formatVersion: ARTEFACT_FORMAT,
      index,
      refusals,
      bindings: byKey([...recorded.bindings.values()], (entry) => entry.contract),
      snapshots: byKey([...recorded.snapshots.values()], (snapshot) => snapshot.addressedBy),
      blobs: byKey([...recorded.blobs.values()].map(blobEntry), (blob) => blob.addressedBy),
    },
  }
}

export const frozenArtefact = async (registry: RegistrySource): Promise<ServedArtefact> => {
  // Warm. What this round answers is discarded - a transcript of a partial cache is a transcript of
  // nothing - and what is kept is every question the walk turned out to ask.
  const { arrived } = await deciding(registry, transcribed)

  // Record. One synchronous pass over a cache that holds everything, which is the shape the acceptance
  // guard of the fixpoint is written against.
  const { answer, wanted } = withoutAsking(arrived, transcribed)

  if (wanted.length > 0) {
    throw new TheRegistryContradictsItself([
      `the recording pass asked for ${wanted.length} answer(s) the warming walk never fetched, so ` +
        `the two have diverged: ${wanted.join(', ')}`,
    ])
  }

  if (refused(answer)) throw new TheRegistryContradictsItself(answer.faults)

  return answer.found
}
