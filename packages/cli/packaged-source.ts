/**
 * The registry as a published `toopo` sees it: an artefact that travelled in the archive, and nothing
 * else.
 *
 * It was the second implementation of `RegistrySource` to be written and the first that is not a
 * stand-in. `source.ts` says the port exists so that *the day a server exists it implements this same
 * type and nothing above it changes* - this was that claim being paid one implementation early, and
 * `http-source.ts` is the day itself: `resolve.ts`, `install.ts`, `search.ts` and `reconcile.ts` are
 * untouched by either, and the only thing that decides which registry an installation is served from is
 * which entry point was run.
 *
 * **It takes the artefact rather than a path, so that everything it answers is reachable from a guard
 * with no disk at all.** `command.ts` states that property for the tool as a whole and it is the one
 * this folder would lose first; a source that opened a file to be built would put the port's own
 * answers behind a fixture nobody can write. Reading the file is `published.ts`, which is the only
 * module that knows where it sits.
 *
 * `null` means *this registry holds no such thing*, exactly as the port requires, and never *the
 * artefact is broken* - a broken artefact was refused by `readArtefact` before this function was
 * called.
 */

import { renderContract } from '../registry/address.js'
import type { ContractAddress } from '../registry/address.js'
import type { ServedBlob, ServedSnapshot } from '../registry/response.js'
import type { ServedArtefact } from './artefact.js'
import { decodedBlob } from './artefact.js'
import type { RegistrySource } from './source.js'

export const packagedSource = (artefact: ServedArtefact): RegistrySource => {
  const bindings = new Map(artefact.bindings.map((entry) => [entry.contract, entry.bindings]))
  const snapshots = new Map<string, ServedSnapshot>(
    artefact.snapshots.map((snapshot) => [snapshot.addressedBy, snapshot]),
  )
  const blobs = new Map<string, ServedBlob>(
    artefact.blobs.map((blob) => [blob.addressedBy, decodedBlob(blob)]),
  )

  return {
    contractIndex: async () => artefact.index,

    implementationBindings: async (address: ContractAddress) =>
      bindings.get(renderContract(address)) ?? [],

    refusals: async () => artefact.refusals,

    snapshot: async (digest) => snapshots.get(digest) ?? null,

    blob: async (sha256) => blobs.get(sha256) ?? null,
  }
}
