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
 * The harness is not fetched, and `artefact.ts` says why in full: no command of `cli/` ever asks for
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
 */

import { renderContract, renderImplementation } from '../registry/address.js'
import type { ContractAddress } from '../registry/address.js'
import type { ServedBlob, ServedSnapshot } from '../registry/response.js'
import type { FrozenImplementation } from '../registry/snapshot.js'
import type { ArtefactBindings, ArtefactBlob, ServedArtefact } from '../cli/artefact.js'
import { ARTEFACT_FORMAT } from '../cli/artefact.js'
import { gatherHoldings, heldAt, refused } from '../cli/resolve.js'
import type { Found } from '../cli/resolve.js'
import type { RegistrySource } from '../cli/source.js'

export class TheRegistryContradictsItself extends Error {
  constructor(what: string, faults: readonly string[]) {
    super(
      `this archive cannot be built, because the registry it would carry does not answer for ` +
        `${what}:\n${faults.join('\n')}`,
    )
    this.name = 'TheRegistryContradictsItself'
  }
}

const insisted = <T>(answer: Found<T>, what: string): T => {
  if (refused(answer)) throw new TheRegistryContradictsItself(what, answer.faults)

  return answer.found
}

type Recording = {
  readonly source: RegistrySource
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
const recording = (source: RegistrySource): Recording => {
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

/** Every implementation the index offers, as the roots a dependency walk starts from. */
const rootsOf = (source: RegistrySource): readonly FrozenImplementation[] =>
  source
    .contractIndex()
    .entries.filter((entry) => entry.installable)
    .flatMap((entry) =>
      source.implementationBindings(entry.address).map((binding) => {
        const what = renderImplementation(binding.address)

        return insisted(heldAt(source, binding.digest, what), what)
      }),
    )

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

export const frozenArtefact = (registry: RegistrySource): ServedArtefact => {
  const held = recording(registry)
  const { source } = held

  const index = source.contractIndex()
  const refusals = source.refusals()

  const holdings = insisted(gatherHoldings(source, rootsOf(source)), 'the implementations it offers')

  for (const holding of holdings) {
    for (const file of holding.files) {
      if (source.blob(file.sha256) === null) {
        throw new TheRegistryContradictsItself(
          `${renderContract(holding.contract)}, whose ${file.path} it does not serve`,
          [`no file is served at ${file.sha256}`],
        )
      }
    }
  }

  return {
    formatVersion: ARTEFACT_FORMAT,
    index,
    refusals,
    bindings: byKey([...held.bindings.values()], (entry) => entry.contract),
    snapshots: byKey([...held.snapshots.values()], (snapshot) => snapshot.addressedBy),
    blobs: byKey([...held.blobs.values()].map(blobEntry), (blob) => blob.addressedBy),
  }
}
