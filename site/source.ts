/**
 * Where the generator gets what it publishes, and the frontier it shares with the installer.
 *
 * ---------------------------------------------------------------------------
 * A second port, and why it is not the first one widened
 * ---------------------------------------------------------------------------
 *
 * `cli/source.ts` states the frontier once and for all: serialising this working tree stands in for a
 * publication that has not happened, and it is never a source of distribution. Everything it says holds
 * here unchanged, and `local-source.ts` beside this file is the one thing on the far side of it.
 *
 * What does not carry over is the port itself. The installer's carries four endpoints and refuses
 * `contract-binding` **by argument** - it turns a name into an address through the index and never
 * needs the digest - and a page cannot do that: a contract page *is* a rendering of the frozen half,
 * so it fetches the binding to learn which digest the name resolves to and then fetches that snapshot.
 * The two ports differ in exactly the place their consumers differ, which is the whole reason a port
 * is derived from a consumer rather than from the API.
 *
 * They differ the other way too, and one of the two differences did not survive the playground. `blob`
 * used to be refused here on the argument that *the site publishes no byte of anybody's source*, which
 * was true of a page that only renders. A playground does not render an answer, it computes one, so
 * the implementation has to arrive as bytes and run - and a snapshot cannot stand in for that, because
 * a snapshot lists a file and hashes it and a list of hashes does not execute. The sentence was right
 * about what a page did and wrong about what a page is for; `run-the-implementation-on-what-a-reader-types`
 * in `needs.ts` is the need that had never been written down, and this is the endpoint that answers it.
 *
 * What the two ports still differ on is `contract-binding`, and that difference is untouched.
 *
 * ---------------------------------------------------------------------------
 * Why `implementationBindings` is here for a page that renders no implementation list
 * ---------------------------------------------------------------------------
 *
 * The launch has one implementation per contract, no reference machine and therefore no benchmark, so
 * `contract-page.ts` renders no list of them - an empty table of figures is worse than none. What it
 * does render is what installing costs in bytes, and that number is not in the contract's record: the
 * harness is every file the registry serves, and what lands in somebody's project is the
 * implementation's own file. So the binding is fetched for its digest, its snapshot for the file list,
 * and one figure comes out. Fetching an answer to publish one number of it is the honest shape;
 * fetching nothing and publishing the harness size would be a wrong number.
 */

import type { ContractAddress } from '../registry/address.js'
import type {
  ServedBlob,
  ServedContractBinding,
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from '../registry/response.js'

/**
 * Everything the generator may ask of a registry.
 *
 * Every method answers with what the endpoint answers or with `null`, and `null` means *this registry
 * holds no such thing* rather than *something went wrong* - the reading `cli/source.ts` fixes and this
 * port inherits.
 */
export type RegistrySource = {
  /** Every contract the registry knows, installable or refused. The catalogue page is this list. */
  readonly contractIndex: () => ServedIndex
  /** Which digest a contract name resolves to today, and what the registry says about it. */
  readonly contractBinding: (address: ContractAddress) => ServedContractBinding | null
  /** The implementations competing under a contract, in the registry's own order. */
  readonly implementationBindings: (
    address: ContractAddress,
  ) => readonly ServedImplementationBinding[]
  /** What the catalogue decided against, with the measurement it decided on. */
  readonly refusals: () => ServedRefusals
  /** A frozen artefact, as the exact text its digest was taken over. */
  readonly snapshot: (digest: string) => ServedSnapshot | null
  /** The served bytes of one file, which is what a playground runs. */
  readonly blob: (sha256: string) => ServedBlob | null
}

/**
 * The endpoint each method of the port answers, by identifier.
 *
 * Total over the port by construction, and checked against the endpoints that exist by `portFaults` -
 * the same two halves the installer's port already runs on.
 */
export const THE_ENDPOINT_BEHIND: Readonly<Record<keyof RegistrySource, string>> = {
  contractIndex: 'contract-index',
  contractBinding: 'contract-binding',
  implementationBindings: 'implementation-bindings',
  refusals: 'refusals',
  snapshot: 'snapshot',
  blob: 'blob',
}

/**
 * The needs of `the-site` this unit deliberately builds no page for, each with what it is waiting for.
 *
 * **It is a list of pages, not of answers, and the guard over it is what made that distinction.** One
 * of the two is answered by an endpoint this port already carries: a search would run over the same
 * index the catalogue page lists, so the generator could build it today from what it already fetches
 * and does not - a scope decision, written down as one rather than showing up as a port that happens
 * to be narrow. The other is different in kind: nothing here can answer `render-the-methodology-page`,
 * because the `methodology` endpoint is not in this port at all.
 *
 * **`pre-fill-the-playground` has left this list, which is the whole of what the playground unit was.**
 * What it said while it was here has been paid rather than repeated: a case whose input is a function
 * cannot be pre-filled, and `array/group-by@1` has thirty of them. That contract has no page, so no
 * playground meets one - and `no-case-the-registry-serves-is-printed-as-a-word-with-no-spelling` is
 * the guard that turns that from a fact about today into something that reddens the day it stops
 * being true.
 *
 * Declared rather than left as a gap, for the reason `field-map.ts` carries `unfilledBecause` and
 * `needs.ts` carries `answeredWithoutTheApi`: a unit that quietly built four pages out of six would be
 * indistinguishable from one that had forgotten two.
 */
export const NOT_THIS_UNIT: Readonly<Record<string, string>> = {
  'render-the-methodology-page':
    'it waits until there are figures to explain. Saying what "you can check this yourself" means is ' +
    'worth a page when the benchmark figures, the validation reports and the attestations it would ' +
    'describe exist; today it would describe a machine nobody has run',
  'search-with-an-alias-thesaurus':
    'search is a unit of its own, and at five contracts the catalogue page answers the same question ' +
    'better: a box asks somebody to guess a word for a list they could have read',
}

/**
 * The sentence that has to stay true when a server arrives, kept here rather than in a paragraph
 * nobody imports.
 *
 * A guard requires the local adapter to be the only module of this folder that reaches the
 * serialisation. It is the same guard `cli/` carries and it is written a second time rather than
 * shared, because what it keeps is a property of *this folder* - that one module here knows about the
 * working tree - and a shared guard would be one statement about two folders, green whenever either
 * one of them happened to be clean.
 */
export const THE_LOCAL_SERIALISATION_IS_NOT_A_DISTRIBUTION =
  'the generator reads a serialisation of this working tree because no registry is published yet; ' +
  'what it renders is a page about the catalogue, never a route by which anything is installed, and ' +
  'permanent rule 3 is the sentence that must not be allowed to weaken'
