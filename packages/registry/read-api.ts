/**
 * The read API as something that can be asked, and the one port in this repository that is the whole
 * of it.
 *
 * ---------------------------------------------------------------------------
 * A port belongs to its consumer, and this consumer is the registry itself
 * ---------------------------------------------------------------------------
 *
 * `packages/cli/source.ts` carries four endpoints and refuses `contract-binding` by argument; `site/source.ts`
 * carries six and refuses nothing it needs. Both are narrow because a port derived from a consumer
 * grows exactly when that consumer needs something. The consumer here is the thing that writes down
 * every answer a client could ever ask for, so its port is not narrow at all - it is `ENDPOINTS`, and
 * that is what makes the totality checkable as an **equality** for the first time. A client's port can
 * only ever be checked for naming endpoints that exist; this one is checked for naming all of them.
 *
 * It is synchronous, and that is the same reasoning `site/source.ts` runs on rather than a departure
 * from `packages/cli/source.ts`: what makes a port asynchronous is a transport under it, and there is none
 * under a build that reads the working tree it is standing in.
 *
 * ---------------------------------------------------------------------------
 * What is not answered, and the trigger that would close it
 * ---------------------------------------------------------------------------
 *
 * `attestations` is the one endpoint no method below carries. `packages/registry/attestation.ts` models the
 * bundle, the policy and what a signature does not prove; nothing anywhere holds one, so the honest
 * answers are *an empty set at every digest*, which publishes a claim about completeness that
 * `endpoints.ts` says in as many words cannot be made - *a registry withholding an attestation is
 * invisible* - or nothing at all.
 *
 * So it is nothing at all, declared with what would change that. A reason alone ages into a
 * description of the past; the field is the shape `DeferredNeed` already takes one folder along, and
 * it is written a second time rather than shared because `packages/registry/` may not import a client and a
 * published registry has no notion of a deferral - it either serves an endpoint or it does not.
 */

import type { ContractAddress } from './address.js'
import { renderContract } from './address.js'
import type {
  ServedBlob,
  ServedContractBinding,
  ServedImplementationBinding,
  ServedIndex,
  ServedRefusals,
  ServedSnapshot,
} from './response.js'
import type { ServedMethodology } from './verifiability.js'

/**
 * Everything this registry can be asked, as a build asks it.
 *
 * `null` means *this registry holds no such thing*, which an emitted tree spells by having no file at
 * that address - the reading `packages/cli/source.ts` fixed for a transport, arriving where there is none.
 */
export type ReadApi = {
  /** Every contract the registry knows, installable or refused. */
  readonly contractIndex: () => ServedIndex
  /** Which digest a contract name resolves to today, and what the registry says about it. */
  readonly contractBinding: (address: ContractAddress) => ServedContractBinding | null
  /** The implementations competing under a contract, in the registry's own order. */
  readonly implementationBindings: (
    address: ContractAddress,
  ) => readonly ServedImplementationBinding[]
  /** What the catalogue decided against, with the measurement it decided on. */
  readonly refusals: () => ServedRefusals
  /** What a reader can establish alone, what they must take from us, and the stratum of every field. */
  readonly methodology: () => ServedMethodology
  /** A frozen artefact, as the exact text its digest was taken over. */
  readonly snapshot: (digest: string) => ServedSnapshot | null
  /** The served bytes of one file. */
  readonly blob: (sha256: string) => ServedBlob | null
}

/**
 * The endpoint each method answers, by identifier. Total over the port by construction, and required
 * to be *onto* the endpoints - which is the property only this port can have.
 */
export const THE_ENDPOINT_BEHIND: Readonly<Record<keyof ReadApi, string>> = {
  contractIndex: 'contract-index',
  contractBinding: 'contract-binding',
  implementationBindings: 'implementation-bindings',
  refusals: 'refusals',
  methodology: 'methodology',
  snapshot: 'snapshot',
  blob: 'blob',
}

/** An endpoint this registry does not answer: why not, and the event that would change it. */
export type DeferredEndpoint = {
  /** Why nothing answers it today. */
  readonly because: string
  /** The observable event that makes it worth answering. Never a date, and never "when we have time". */
  readonly until: string
}

/**
 * Every endpoint no method of this port answers. The complement of `THE_ENDPOINT_BEHIND` over
 * `ENDPOINTS`, declared here and derived in the guard, so neither can grow in silence.
 */
export const NOT_ANSWERED: Readonly<Record<string, DeferredEndpoint>> = {
  attestations: {
    because:
      'nothing has been signed, so the only answer this registry could give is an empty set at every ' +
      'digest - and an empty set is exactly what a registry withholding an attestation would serve. ' +
      'Publishing one would put a claim about completeness where `endpoints.ts` says none can be made',
    until:
      'one snapshot of this catalogue is signed and the bundle is held somewhere this registry can ' +
      'read, which is the publishing tool binding a digest to a signature rather than a decision here',
  },
}

/**
 * One question a client asks, carrying the arguments it was asked with.
 *
 * A union rather than a method and a string, for the reason `packages/cli/fixpoint.ts` gives: the alternative
 * is a key that has to be parsed back into an address before the port can be asked, which is a second
 * parser of `renderContract`.
 */
export type Question =
  | { readonly method: 'contractIndex' }
  | { readonly method: 'refusals' }
  | { readonly method: 'methodology' }
  | { readonly method: 'contractBinding'; readonly address: ContractAddress }
  | { readonly method: 'implementationBindings'; readonly address: ContractAddress }
  | { readonly method: 'snapshot'; readonly digest: string }
  | { readonly method: 'blob'; readonly sha256: string }

/** The question a method of this port is asked, so an arm can be written against its own arguments. */
export type QuestionFor<Method extends keyof ReadApi> = Extract<Question, { readonly method: Method }>

/**
 * The address a question names, rendered - or `''` where the method names none.
 *
 * Total over the union by the compiler: a question added without saying what addresses it does not
 * compile, because the missing arm makes this able to return `undefined`.
 */
export const addressAsked = (question: Question): string => {
  switch (question.method) {
    case 'contractIndex':
    case 'refusals':
    case 'methodology':
      return ''
    case 'contractBinding':
    case 'implementationBindings':
      return renderContract(question.address)
    case 'snapshot':
      return question.digest
    case 'blob':
      return question.sha256
  }
}
