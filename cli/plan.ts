/**
 * Where every file lands, decided before a single byte is written.
 *
 * Nothing here touches a disk, a network or a clock. An install that discovered a collision after
 * writing four files would have already changed the user's project, so the whole of the arithmetic -
 * destinations, deduplication, refusals - happens against values and the writing is a separate step
 * that can only succeed.
 *
 * ---------------------------------------------------------------------------
 * The layout, and the constraint that could not be kept
 * ---------------------------------------------------------------------------
 *
 * A feature lands in `<domain>/<name>/`, and its entry file is named after the feature:
 *
 *     src/lib/toopo/string/slugify/slugify.ts
 *     src/lib/toopo/string/pad/pad.ts
 *     src/lib/toopo/string/pad/digits.ts
 *
 * The domain stays a folder, so `number/parse` and `string/parse` never collide and no artificial
 * prefix is needed. The entry file is `slugify.ts` and not `reference.ts`, because `reference` names
 * what the file was in *our* catalogue and says nothing about what it holds - and in the user's editor
 * every installed feature would otherwise open a tab called `reference.ts`.
 *
 * **A folder from the first file, rather than a flat `slugify.ts` promoted to a folder later.**
 * Measured on node v24.15.0, because the promotion has to be invisible to whoever wrote the import:
 *
 *     cjs  ./x.js -> MODULE_NOT_FOUND       cjs  ./x -> x/index.js
 *     esm  ./x.js -> ERR_MODULE_NOT_FOUND   esm  ./x -> ERR_UNSUPPORTED_DIR_IMPORT
 *
 * A published source writes its imports with the extension, which is the only spelling that resolves
 * under both module systems and under `node16`. At that spelling neither CommonJS nor ESM treats
 * `x.js` and `x/index.js` as one specifier, so an implementation that gained a second file would
 * change the path every dependent had written. The folder costs one level of nesting on a single-file
 * feature and the import path never moves again.
 *
 * **What this costs, stated rather than discovered: every cross-feature import is rewritten.** The
 * catalogue serves its entry file as `reference.ts` - `contractAnatomy` requires that name at five of
 * five - so a published `number/clamp` names its dependency as `../../string/pad/reference.js`, and
 * that specifier is wrong the moment the file lands as `pad.ts`. Naming the file after the feature and
 * needing no rewriting between features are incompatible, and the first wins because it is the one
 * argued from the user's editor. What softens it is that the rewriting mechanism is needed anyway, for
 * the shared blob below, and that both jobs turn out to be one rule: *a specifier is repointed when
 * the file it names did not land where the specifier says it would.*
 *
 * ---------------------------------------------------------------------------
 * The path carries neither the language nor the major, and that is a decision
 * ---------------------------------------------------------------------------
 *
 * `renderContract` renders `typescript/number/parse@1`; this path is `number/parse/parse.ts`. The
 * asymmetry is deliberate and is argued here because this is where somebody would come to remove it.
 *
 * **A path is a place on disk and not an address.** What governs it is *one feature is one folder*, the
 * rule the refusal below is written on, and a folder somebody opens every day carries what tells two
 * features apart and nothing more. The major is not in it either, so adding the language alone would
 * put half an address into a string that deliberately is not one.
 *
 * **The case it would supposedly protect against exists, and something else already refuses it.**
 * Measured by widening `Language` and asking for one contract name in two languages: both plan to
 * `number/parse/parse.ts`, `placedByPath` finds two digests at one path, and the install is refused by
 * name with nothing written. That refusal is only *true* because the address carries the language -
 * keyed on a language-less rendering the two collide one step earlier, in `seenContracts`, and the
 * sentence that comes out names two versions that do not exist. `registry/address.ts` quotes both.
 *
 * So the protection is in the refusal rather than in the path. Putting it in both would be two
 * mechanisms over one fault, with nothing to say for themselves on the day they disagree.
 *
 * ---------------------------------------------------------------------------
 * The shared blob, and why the entry file is exempt from it
 * ---------------------------------------------------------------------------
 *
 * Two implementations may carry one file - the same bytes, therefore the same digest, under a path
 * that is the same in two folders and would be equally the same if the two files differed. It is
 * written once, in the folder of whichever carrier the resolution reaches first, and the other
 * carrier's imports are pointed at it. Recognised by digest and never by path, which is the guard
 * `registry/` already carries: `reference.ts` is carried by every implementation of the graph and is
 * four different files.
 *
 * **An entry file is never deduplicated**, even if two features happened to be byte-identical. A
 * feature's entry file is its identity: dropping one because another feature's answer coincided would
 * leave a folder with no file named after it, and an import of that feature pointing into somebody
 * else's folder.
 */

import type { ImplementationAddress } from '../registry/address.js'
import { renderContract, renderImplementation } from '../registry/address.js'
import type { HarnessFile } from '../registry/implementation-record.js'
import type { FrozenImplementation } from '../registry/snapshot.js'

/** The name the catalogue gives an implementation's entry file, required of every contract folder. */
export const THE_ENTRY_FILE = 'reference.ts'

export type PlannedFile = {
  /** Where the catalogue holds it: `domain/name/file`, which is what a relative import resolves in. */
  readonly servedAt: string
  /** Where it lands, relative to the configured directory, with forward slashes. */
  readonly path: string
  readonly served: HarnessFile
  /**
   * False when this file is a second carrier of a blob already placed. Its imports still have to be
   * repointed - they live inside a *different* file that is written - so it stays in the plan rather
   * than being filtered out of it.
   */
  readonly written: boolean
}

export type PlannedFeature = {
  readonly implementation: ImplementationAddress
  readonly files: readonly PlannedFile[]
}

export type InstallPlan = {
  /** Dependencies first, then the feature that was asked for. */
  readonly features: readonly PlannedFeature[]
  readonly files: readonly PlannedFile[]
  /** Where each served path landed. The whole of what a rewrite needs to be told. */
  readonly relocation: Readonly<Record<string, string>>
}

export type PlanResult = { readonly plan: InstallPlan } | { readonly faults: readonly string[] }

const actionOf = (name: string): string => name.slice(name.indexOf('/') + 1)

const destinationOf = (contractName: string, file: string): string =>
  file === THE_ENTRY_FILE
    ? `${contractName}/${actionOf(contractName)}.ts`
    : `${contractName}/${file}`

const addressOf = (held: FrozenImplementation): ImplementationAddress => ({
  contract: held.contract,
  id: held.id,
  version: held.version ?? '',
})

/**
 * The plan for installing `order`, which must be dependencies first and the root last.
 *
 * The order is the resolution's, not this function's: `resolveDependencies` answers it, and an
 * installer that re-sorted here would be a second opinion about something already settled - and the
 * one that decides which carrier of a shared blob keeps it.
 */
export const planInstall = (order: readonly FrozenImplementation[]): PlanResult => {
  const faults: string[] = []
  const features: PlannedFeature[] = []
  const placedByDigest = new Map<string, string>()
  const placedByPath = new Map<string, string>()
  const seenContracts = new Map<string, string>()

  for (const held of order) {
    const contract = renderContract(held.contract)
    const already = seenContracts.get(contract)
    const rendered = renderImplementation(addressOf(held))

    if (already !== undefined) {
      faults.push(
        `${contract} is asked for at two versions in one install - ${already} and ${rendered}. One ` +
          `feature is one folder, so the second would overwrite the first and whichever dependent ` +
          `asked for it would silently get the other one's code.`,
      )
      continue
    }
    seenContracts.set(contract, rendered)

    const files: PlannedFile[] = []
    for (const served of held.files) {
      const servedAt = `${held.contract.name}/${served.path}`
      const isEntry = served.path === THE_ENTRY_FILE
      const shared = isEntry ? undefined : placedByDigest.get(served.sha256)
      const path = shared ?? destinationOf(held.contract.name, served.path)

      if (shared === undefined) {
        const collides = placedByPath.get(path)
        if (collides !== undefined && collides !== served.sha256) {
          faults.push(
            `two different files would both be written to ${path}: the one served as ${servedAt} and ` +
              `another with a different digest. An install that overwrote one with the other would ` +
              `leave the project holding code no lockfile describes.`,
          )
          continue
        }
        placedByPath.set(path, served.sha256)
        if (!isEntry) placedByDigest.set(served.sha256, path)
      }

      files.push({ servedAt, path, served, written: shared === undefined })
    }

    features.push({ implementation: addressOf(held), files })
  }

  if (faults.length > 0) return { faults }

  const files = features.flatMap((feature) => feature.files)

  return {
    plan: {
      features,
      files,
      relocation: Object.fromEntries(files.map((file) => [file.servedAt, file.path])),
    },
  }
}
