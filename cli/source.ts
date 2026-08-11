/**
 * Where an installation gets what it installs, and the frontier nobody may cross.
 *
 * ---------------------------------------------------------------------------
 * There is no server, and this file is what keeps that from becoming a habit
 * ---------------------------------------------------------------------------
 *
 * `registry/` designs a read API and deliberately builds no service: `response.ts` and `endpoints.ts`
 * model what an answer contains, what it may not contain, and what a reader can do with it alone, and
 * they name no transport at all. So the installer talks to an *interface*, and the only implementation
 * of that interface today is backed by serialising the five contracts out of this working tree.
 *
 * **That serialisation is not a source of distribution and must never become one.** Permanent rule 3
 * says installations are served only from the registry's immutable snapshot, never from a third-party
 * repository - and a checkout of this repository is a third-party repository to everyone who is not
 * the founder. What `local-source.ts` does is stand in for a publication that has not happened, on a
 * machine that holds the catalogue anyway, so that the installer can be measured against real
 * contracts before a server exists to measure it against.
 *
 * The day a server exists it implements this same type and nothing above it changes. That is the whole
 * value of the port, and it is why the port is exactly the endpoints and never a convenience wider
 * than them.
 *
 * ---------------------------------------------------------------------------
 * Why the port is four methods
 * ---------------------------------------------------------------------------
 *
 * Each one answers one endpoint of `endpoints.ts`, and `THE_ENDPOINT_BEHIND` below is the statement of
 * which. Two independent statements that must coincide: a method added here with no endpoint is a type
 * error, because the map must be total over the port; an endpoint named here that `ENDPOINTS` does not
 * declare is caught by a guard; and a source object carrying a method the port does not declare is
 * caught by the same guard, which compares the keys rather than the types.
 *
 * `refusals` arrived with the fourth consumer rather than with the first three, which is the same
 * lesson as the paragraph below read from the other end: a port derived from what a consumer needs
 * grows exactly when a consumer needs something, and never before.
 *
 * **`contract-binding` is not here, and finding that out is what deriving a port from a consumer is
 * for.** It looks like the first thing an installer would ask - resolve the name, then fetch the thing
 * - and `needs.ts` already says otherwise: the two needs it answers are the site's contract page and
 * `toopo update`'s comparison with the lockfile. `add` turns a name into an address through the index,
 * which is also where it learns whether the catalogue refuses the contract, and then asks for the
 * implementations. A method nothing calls is a method a fixture has to fabricate an answer for, and
 * fabricating one here would have meant inventing a contract snapshot for three contracts that do not
 * exist.
 *
 * The four endpoints that are not here - `contract-binding`, `refusals`, `methodology`, `attestations`
 * - answer needs the site, an auditor and `update` have. An installer that fetched them would be
 * fetching what it does not use, which is how a client comes to depend on an answer nobody meant it to
 * have.
 *
 * ---------------------------------------------------------------------------
 * *Nothing above it changes* was measured, and one thing inside it has to
 * ---------------------------------------------------------------------------
 *
 * The sentence above is a claim about a day that has not come, so it was paid rather than left as one:
 * the frozen artefact was served by `node:http` on an ephemeral port, a source over that wire was
 * handed to the installer's own functions, and the real entry point was run in a real project. Measured
 * at `0ce32d6`, at a maquette reverted in the commit that carries this paragraph.
 *
 * **`resolve.ts`, `install.ts`, `reconcile.ts`, `search.ts` and `command.ts` were not edited**, and
 * `toopo add number/round` printed its ordinary screen - five files, `digits.ts` shared with
 * `number/clamp@1`, three imports repointed - out of a registry reached over HTTP. The bytes, the
 * deduplication and the `update` verdicts were compared against the same call on a local source and
 * were identical. So the claim holds for everything above this type.
 *
 * **What it does not hold for is this type's own implementation, and one line of it decides a supply
 * chain.** `localSource` and `packagedSource` both look an answer up *by* its digest in a map keyed on
 * that digest, so the pairing of an answer with the address it was asked at is held by a data
 * structure. There is no such structure on a wire: a server answers what it chooses to answer, and
 * `servedBlobFaults` compares `addressedBy` against a recompute of the bytes beside it. A remote source
 * built with `servedBlob(whatArrived)` therefore checks that the bytes hash to their own hash.
 *
 * It is `artefact.ts`'s own sentence one layer up - *digests recomputed from whatever is on disk
 * certify themselves and prove nothing.* **So a remote implementation addresses every content-addressed
 * answer by the digest it asked for**, which is what turns `servedSnapshotFaults` and `servedBlobFaults`
 * into the check `resolve.ts` believes it is making. Measured on a registry serving the wrong bytes at
 * the right blob address:
 *
 *     addressed by the question   refused - these bytes hash to b5b6d4b... and not to 11d3e28...
 *     addressed by what arrived   installed, 5 files, nothing objected
 *
 * The snapshot half is narrower and is stated at the strength it was measured. A whole, self-consistent
 * snapshot served at another snapshot's address was refused under **both** spellings, in both of the two
 * substitutions tried - the root's and a dependency's. Under the question it is named exactly; under
 * what arrived it is caught downstream, by `entryOf` and by the walk, under sentences that name causes
 * the run did not establish - *publishes no reference.ts* and *the registry holds no such published
 * implementation*, of a contract that publishes one and is served. Two substitutions are not a proof
 * that a third is caught, and the diagnostics are this repository's own worst class arriving through
 * the front door.
 */

import type { ContractAddress } from '../registry/address.js'
import type {
  ServedBlob,
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from '../registry/response.js'

/**
 * Everything `toopo` may ask of a registry.
 *
 * Every method answers with what the endpoint answers or with `null`, and `null` means *this registry
 * holds no such thing* rather than *something went wrong*. A transport failure is not modelled here
 * because there is no transport; when one exists it will refuse loudly, and a refusal that arrives as
 * an absence is the failure `validation/source.ts` records one folder along - a thing that was not read
 * passes every check for the wrong reason.
 */
export type RegistrySource = {
  /** Every contract the registry knows, installable or refused. */
  readonly contractIndex: () => ServedIndex
  /** The implementations competing under a contract, in the registry's own order. */
  readonly implementationBindings: (
    address: ContractAddress,
  ) => readonly ServedImplementationBinding[]
  /**
   * What the catalogue decided against, with the measurement it decided on.
   *
   * **Here because a fourth consumer asked for it, and it is `toopo search`.** `installable` is a
   * boolean on an index entry, so a search could already say *no* - and a search result saying
   * `not installable` and nothing else tells somebody the catalogue has no opinion, when publishing
   * the opinion is the whole point. Somebody typing `Map.groupBy` is best answered by *the language
   * already does this*, which the catalogue knows and only this endpoint carries.
   *
   * It is legitimately here rather than a widening of the port, because the port is *everything
   * `toopo` may ask of a registry* and not everything the installer asks: `resolve.ts` reaches for
   * four of these methods and never for this one.
   */
  readonly refusals: () => ServedRefusals
  /** A frozen artefact, as the exact text its digest was taken over. */
  readonly snapshot: (digest: string) => ServedSnapshot | null
  /** The served bytes of one file. */
  readonly blob: (sha256: string) => ServedBlob | null
}

/**
 * The endpoint each method of the port answers, by identifier.
 *
 * Total over the port by construction: adding a method without deciding which endpoint answers it does
 * not compile. What it cannot decide by itself is whether the identifier names an endpoint that
 * exists, which is what `portFaults` is for - the two halves of the same discipline `FIELD_MAP` and
 * `publicContract` already run on. That check lives in `registry/endpoints.ts` because it is a
 * question about the read API rather than about an installer, and the site's port asks it too.
 */
export const THE_ENDPOINT_BEHIND: Readonly<Record<keyof RegistrySource, string>> = {
  contractIndex: 'contract-index',
  implementationBindings: 'implementation-bindings',
  refusals: 'refusals',
  snapshot: 'snapshot',
  blob: 'blob',
}

/**
 * The sentence that has to stay true when a server arrives, kept here rather than in a paragraph
 * nobody imports.
 *
 * A guard requires the local adapter to be the only module of this folder that reaches the
 * serialisation. Without it the frontier above is a comment: any file could read `the-five.ts`, an
 * installer would grow a second way of obtaining a contract, and the day a server exists there would
 * be two sources of truth with no line between them.
 */
export const THE_LOCAL_SERIALISATION_IS_NOT_A_DISTRIBUTION =
  'serialising this working tree stands in for a publication that has not happened; it is not a ' +
  'source an installation may ever be served from, and permanent rule 3 is the sentence it must not ' +
  'be allowed to weaken'
