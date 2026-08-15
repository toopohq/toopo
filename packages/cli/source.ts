/**
 * Where an installation gets what it installs, and the frontier nobody may cross.
 *
 * ADR-0044 is why the archive carries a frozen artefact rather than this working tree; ADR-0051 is why
 * every implementation of this port is asynchronous, including the three that need no network.
 *
 * ---------------------------------------------------------------------------
 * There is no server, and this file is what keeps that from becoming a habit
 * ---------------------------------------------------------------------------
 *
 * `packages/registry/` designs a read API and deliberately builds no service: `response.ts` and `endpoints.ts`
 * model what an answer contains, what it may not contain, and what a reader can do with it alone, and
 * they name no transport at all. So the installer talks to an *interface*, and what implements it is
 * this working tree serialised, the frozen artefact an archive carries, a graph that exists to be
 * walked, and a registry reached over HTTP.
 *
 * That sentence used to read *the only implementation of that interface today*, and it had been false
 * since `packaged-source.ts` was written. What replaces it carries no number, for the reason this
 * repository has retired four counts on: a tally is edited whenever the data moves and is wrong
 * between two of those edits, where a list is read.
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
 * Why the port is exactly the endpoints a consumer reaches for
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
 * *Nothing above it changes* is built, and one thing inside it had to
 * ---------------------------------------------------------------------------
 *
 * The sentence above was a claim about a day that had not come. It was paid at `0ce32d6`, at a maquette
 * reverted for being an implementation of a design nobody had taken, and it is a unit here:
 * `http-source.ts` is the implementation, `fixpoint.ts` is what lets a decision stay synchronous in
 * front of it, and `serving-over-http.ts` is the apparatus a guard answers from.
 *
 * **`resolve.ts`, `install.ts`, `reconcile.ts`, `remove.ts`, `update.ts` and `search.ts` changed by a
 * type name and by no line of behaviour**, which is what the claim was about. What did change is
 * `command.ts`, and it gained a loop rather than an await in a decision.
 *
 * **What the claim does not cover is this type's own implementation, and one line of it decides a
 * supply chain.** `localSource` and `packagedSource` both look an answer up *by* its digest in a map
 * keyed on that digest, so the pairing of an answer with the address it was asked at is held by a data
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
 * **The second spelling does not ship, and that is the difference between the maquette and this.** There
 * it was a parameter, so that corruption could be watched going through; a parameter that selects the
 * unsafe spelling is a hole with a name on it, and a caller reaching for it would be reaching for the
 * defect. `http-source.ts` addresses by the question and offers no other way, and what keeps the check
 * load-bearing is a battery cell that takes the addressing away and has to come back killed.
 *
 * **The snapshot half was narrower and is not any more, and what closed it is `heldAt` rather than this
 * type.** A whole, self-consistent snapshot served at another snapshot's address was refused under both
 * spellings when this was written, but only one of them named the failure: under what arrived it was
 * caught downstream, by `entryOf` and by the walk, under *publishes no reference.ts* and *the registry
 * holds no such published implementation* - of a contract that publishes one and is served. Those are
 * this repository's own worst class arriving through the front door, and no amount of measuring the
 * right spelling of *this* type would have removed them.
 *
 * What removed them is that a snapshot is now checked against the address it was fetched for, wherever
 * that address came from. Measured over the six substitutions the imagined graph can express - three at
 * a root binding, three at an edge - all six are refused naming the digest, what it declares and what
 * was asked for. Addressing by the question stays the rule for the reason above; what it decides is no
 * longer whether a substitution is *caught*, only whether the answer or the address is the thing found
 * to be wrong.
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
 * Everything `toopo` may ask of a registry, as a transport answers it.
 *
 * Every method answers with what the endpoint answers or with `null`, and `null` means *this registry
 * holds no such thing* rather than *something went wrong*. A transport failure is **not** an absence:
 * `http-source.ts` throws on any status that is neither the answer nor a 404, because a refusal that
 * arrives as an absence is the failure `packages/validation/source.ts` records one folder along - a thing that
 * was not read passes every check for the wrong reason. This paragraph used to say a transport failure
 * was not modelled *because there is no transport*, and the clause stopped being true in the commit
 * that carries this one.
 *
 * **Asynchronous, and that is a claim about a transport rather than about a decision.** Nothing that
 * decides anything holds this type; decisions hold `HeldRegistry` below, and `fixpoint.ts` is what
 * stands between the two. Making the three registries that need no network answer promises anyway is
 * the deliberate half: two shapes would mean `command.ts` branching on which kind of registry it was
 * handed, so almost every guard would exercise the path with no loop, and the day the catalogue moves
 * out of this repository the surviving path would be the least tested one.
 */
export type RegistrySource = {
  /** Every contract the registry knows, installable or refused. */
  readonly contractIndex: () => Promise<ServedIndex>
  /** The implementations competing under a contract, in the registry's own order. */
  readonly implementationBindings: (
    address: ContractAddress,
  ) => Promise<readonly ServedImplementationBinding[]>
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
  readonly refusals: () => Promise<ServedRefusals>
  /** A frozen artefact, as the exact text its digest was taken over. */
  readonly snapshot: (digest: string) => Promise<ServedSnapshot | null>
  /** The served bytes of one file. */
  readonly blob: (sha256: string) => Promise<ServedBlob | null>
}

/**
 * The same questions, answered out of what has already arrived.
 *
 * **This is the type every decision holds**, and the reason `resolve.ts`, `install.ts`, `reconcile.ts`,
 * `remove.ts`, `update.ts` and `search.ts` are untouched by a registry becoming remote: they read a
 * registry that answers now. `command.ts` states the property this protects - everything this tool
 * decides is reachable from a guard, with no process, no working directory and no clock - and the
 * measurement behind the shape is that making the port asynchronous and leaving the decisions reading
 * it directly raises 25 compiler errors across `resolve.ts`, `search.ts` and `command.ts`, **every one
 * of them an `await` that is missing**. Under this projection all 25 are a type name and not one body
 * changes, which is the property under test rather than a hope about it.
 *
 * Derived rather than declared, so there is one statement of what may be asked and two projections of
 * it - the shape `toHtml` and `toText` already have one folder along. A method added to the port is in
 * this view without anybody writing it, which is the totality `THE_ENDPOINT_BEHIND` carries below and
 * `FIELD_MAP`, `FIELDS_OF` and `EVERY_ARM` carry elsewhere. A hand-written twin would be the second
 * statement that goes stale on exactly the member nobody enumerated.
 */
export type HeldRegistry = {
  readonly [Question in keyof RegistrySource]: (
    ...asked: Parameters<RegistrySource[Question]>
  ) => Awaited<ReturnType<RegistrySource[Question]>>
}

/**
 * The endpoint each method of the port answers, by identifier.
 *
 * Total over the port by construction: adding a method without deciding which endpoint answers it does
 * not compile. What it cannot decide by itself is whether the identifier names an endpoint that
 * exists, which is what `portFaults` is for - the two halves of the same discipline `FIELD_MAP` and
 * `publicContract` already run on. That check lives in `packages/registry/endpoints.ts` because it is a
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
