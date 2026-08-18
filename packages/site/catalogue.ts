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
 * `response.ts` says so - and `packages/cli/resolve.ts` is the consumer that already does it.
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

import { renderContract } from '../registry/address.js'
import type { ServedContractBinding } from '../registry/response.js'
import { servedSnapshotFaults } from '../registry/response.js'
import type { FrozenContract, FrozenImplementation, Snapshot } from '../registry/snapshot.js'
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

/**
 * One domain of the catalogue: the contracts published in it, and what it turned down.
 *
 * **A domain is the first segment of a contract's name and is not a thing the registry declares**, so
 * it is derived here rather than fetched. `ServedIndexEntry.domain` is the split, and its own comment
 * says why it exists - *the site's navigation is built on the domain* - which is this.
 */
export type Domain = {
  readonly name: string
  /**
   * In the registry's own order, and never empty.
   *
   * The tuple is the guarantee `domainsOf` already makes, written where a caller reads it: a domain's
   * page is addressed by going up one level from a contract of it, so *this list has a first element*
   * is what makes that address exist at all. As `readonly Held[]` every caller reaching for it has to
   * assert something the filter one function below has already established.
   */
  readonly held: readonly [Held, ...Held[]]
}

/**
 * Every domain that has a page, which is every domain something is published in.
 *
 * **A domain whose contracts were all refused is not here, and that is a decision rather than a
 * filter that happens to drop it.** `array` holds one entry, `array/group-by@1`, turned down before
 * publication. A page for it would carry an empty list, a figure of zero and one line pointing at the
 * refusals page - which answers no question that page does not answer better, and would put an
 * address in the catalogue's navigation that a reader gains nothing by following. What is published
 * about a refusal is the refusal.
 *
 * **A domain does not carry what it refused**, and that is the same decision one step on: no domain
 * with a page has a refusal today, so the section that would render one is a branch nothing
 * exercises. `domain-page.ts` carries the argument at the surface where it is visible.
 */
export const domainsOf = (
  source: RegistrySource,
  held: readonly Held[],
): readonly Domain[] => {
  const order: string[] = []

  for (const entry of source.contractIndex().entries) {
    if (!order.includes(entry.domain)) order.push(entry.domain)
  }

  return order.flatMap((name) => {
    const [first, ...rest] = held.filter((one) => domainOf(one.contract.address.name) === name)

    return first === undefined ? [] : [{ name, held: [first, ...rest] as const }]
  })
}

/**
 * The domain a contract's name opens on.
 *
 * `packages/registry/response.ts` splits the same string to build `ServedIndexEntry.domain`, and this
 * is not a second copy of that rule: a `Held` carries a frozen contract and no index entry, so the
 * two are reached from different values. What keeps them from disagreeing is that
 * `a-domain-page-lists-every-contract-the-index-files-under-it` compares the two sides.
 */
const domainOf = (name: string): string => name.slice(0, name.indexOf('/'))
