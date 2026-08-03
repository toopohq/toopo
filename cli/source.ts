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
 */

import type { ContractAddress } from '../registry/address.js'
import { ENDPOINTS } from '../registry/endpoints.js'
import type {
  ServedBlob,
  ServedImplementationBinding,
  ServedIndex,
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
 * exists, which is what the guard is for - the two halves of the same discipline `FIELD_MAP` and
 * `publicContract` already run on.
 */
export const THE_ENDPOINT_BEHIND: Readonly<Record<keyof RegistrySource, string>> = {
  contractIndex: 'contract-index',
  implementationBindings: 'implementation-bindings',
  snapshot: 'snapshot',
  blob: 'blob',
}

/** Why a source does not implement the port. Empty when it does, exactly and no more. */
export const sourceFaults = (source: RegistrySource): readonly string[] => {
  const declared = Object.keys(THE_ENDPOINT_BEHIND).sort()
  const carried = Object.keys(source).sort()
  const known = new Set(ENDPOINTS.map((endpoint) => endpoint.id))

  return [
    ...declared
      .filter((method) => !carried.includes(method))
      .map((method) => `the source carries no \`${method}\`, which the port declares`),
    ...carried
      .filter((method) => !declared.includes(method))
      .map(
        (method) =>
          `the source carries \`${method}\`, which the port does not declare - an installer reaching ` +
          `for it would be reaching past the read API`,
      ),
    ...Object.entries(THE_ENDPOINT_BEHIND)
      .filter(([, endpoint]) => !known.has(endpoint))
      .map(([method, endpoint]) => `\`${method}\` claims to answer "${endpoint}", which is no endpoint`),
  ]
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
