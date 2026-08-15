/**
 * What the generator has fetched, and checked before believing.
 *
 * ---------------------------------------------------------------------------
 * A page that renders an unverified answer is a page that undoes the argument
 * ---------------------------------------------------------------------------
 *
 * The whole claim of this registry is that a frozen artefact travels as the canonical text its digest
 * was taken over, so a reader hashes what arrived and compares. `servedSnapshotFaults` exists because
 * *verify the digest* is the step a consumer skips when it is described instead of provided -
 * `response.ts` says so - and `cli/resolve.ts` is the consumer that already does it.
 *
 * A site is the consumer with the most to lose by skipping it. It publishes the definition to
 * everybody, so a snapshot that did not hash to its own address would become the catalogue in every
 * reader's mind, and nothing downstream would ever ask again. So every snapshot is checked here, on
 * arrival, and a fault stops the build rather than colouring a page.
 *
 * ---------------------------------------------------------------------------
 * Three answers per contract, which is the read API's shape rather than a cost
 * ---------------------------------------------------------------------------
 *
 * The binding says which digest the name resolves to today; the contract snapshot is the frozen
 * definition; the implementation snapshot is what an installation would write. `response.ts` predicts
 * exactly this - *a contract page needs all three, and it makes three requests* - and the reason is
 * that the page can then tell its reader which parts of it are checkable.
 */

import { renderContract } from '../packages/registry/address.js'
import type { ServedContractBinding } from '../packages/registry/response.js'
import { servedSnapshotFaults } from '../packages/registry/response.js'
import type { FrozenContract, FrozenImplementation, Snapshot } from '../packages/registry/snapshot.js'
import type { RegistrySource } from './source.js'

export class ThePageCannotBeBuilt extends Error {
  constructor(what: string, detail: string) {
    super(
      `the page for ${what} cannot be built, and ${detail}. A generator that published a page ` +
        `anyway would be publishing the catalogue's own definition on an answer nobody checked.`,
    )
    this.name = 'ThePageCannotBeBuilt'
  }
}

/** One contract, as everything a page about it needs and nothing else. */
export type Held = {
  readonly binding: ServedContractBinding
  readonly contract: FrozenContract
  /** The implementation `toopo add` would write, which is what the cost on the page is about. */
  readonly implementation: FrozenImplementation
}

const frozen = (source: RegistrySource, digest: string, what: string, unit: string): Snapshot => {
  const answer = source.snapshot(digest)
  if (answer === null) {
    throw new ThePageCannotBeBuilt(what, `the registry holds no snapshot ${digest}`)
  }

  const faults = servedSnapshotFaults(answer)
  if (faults.length > 0) {
    throw new ThePageCannotBeBuilt(what, `the ${unit} snapshot it names does not check out: ${faults.join('; ')}`)
  }

  const parsed = JSON.parse(answer.canonicalText) as Snapshot
  if (parsed.unit !== unit) {
    throw new ThePageCannotBeBuilt(what, `${digest} is a ${parsed.unit} snapshot where a ${unit} was asked for`)
  }

  return parsed
}

/**
 * Everything the registry holds that has a page, in the registry's own order.
 *
 * A contract the catalogue refused is not here, and that is the design rather than an omission: it was
 * decided against *before* publication, so it has no binding, no digest and no frozen definition -
 * `refuseContract` records an argument and binds nothing. What the catalogue publishes about it is the
 * refusal, and the refusals page is where it goes.
 */
export const heldByTheRegistry = (source: RegistrySource): readonly Held[] =>
  source
    .contractIndex()
    .entries.filter((entry) => entry.installable)
    .map((entry) => {
      const what = renderContract(entry.address)
      const binding = source.contractBinding(entry.address)

      if (binding === null) {
        throw new ThePageCannotBeBuilt(what, 'the index offers it and no binding resolves it')
      }

      const contract = frozen(source, binding.digest, what, 'contract')

      /**
       * The default, because that is the one `toopo add` writes and the cost on the page is the cost
       * of running that command. A catalogue with no default for a contract it offers is one the
       * installer could not serve either, so it is refused here rather than guessed at.
       */
      const bindings = source.implementationBindings(entry.address)
      const chosen = bindings.filter((one) => one.status === 'default')
      if (chosen.length !== 1) {
        throw new ThePageCannotBeBuilt(
          what,
          `${chosen.length} of its ${bindings.length} implementations are the default, and a page ` +
            `states the cost of installing exactly one`,
        )
      }

      const implementation = frozen(source, (chosen[0] as (typeof chosen)[number]).digest, what, 'implementation')

      if (contract.unit !== 'contract' || implementation.unit !== 'implementation') {
        throw new ThePageCannotBeBuilt(what, 'a snapshot arrived as the wrong kind of artefact')
      }

      return { binding, contract: contract.frozen, implementation: implementation.frozen }
    })
