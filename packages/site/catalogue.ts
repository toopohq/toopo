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

import type { ContractAddress } from '../registry/address.js'
import { renderContract, sameContract } from '../registry/address.js'
import type { ServedContractBinding, ServedRefusal } from '../registry/response.js'
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
 * says why it exists - *the site's navigation is built on the domain* - which is this. ADR-0121.
 */
export type Domain = {
  readonly name: string
  /**
   * The address this domain's page is computed from, which is an address of one of its contracts.
   *
   * **It is a field rather than `held[0]`, and the reason is that `held` may now be empty.** A domain's
   * page is addressed by going up one level from a contract of it; that used to make *this list has a
   * first element* the thing the address depended on, so `held` was a tuple. A domain the catalogue has
   * only ever turned something down in has no held contract and has a page, so what the address depends
   * on is that the domain exists at all - which is what `domainsOf` establishes and what this field
   * carries. Every caller that reached into a list for an address now reads one.
   */
  readonly address: ContractAddress
  /** What this domain publishes, in the registry's own order. Empty where everything in it was refused. */
  readonly held: readonly Held[]
  /**
   * What this domain was refused, in the registry's own order.
   *
   * A refusal is what the registry holds about a contract it decided against before publication:
   * `refuseContract` records an argument and binds no digest, so there is no snapshot here and no
   * `Held` to be made of one. ADR-0126.
   */
  readonly turnedDown: readonly TurnedDown[]
}

/**
 * One contract the catalogue turned down, as everything a page about it needs.
 *
 * **It is a pair because the registry answers the two halves separately**, and neither half is derivable
 * from the other. `refusals` carries the judgement - what it was decided against, on what measurement,
 * what it is kept as - and carries no summary, because a refusal is about a decision. The index carries
 * the summary, because a summary is about a contract and the index lists every contract the catalogue
 * has decided anything about, refused or not.
 *
 * Joined here rather than at each page, so a page renders a value instead of reaching for a second
 * answer to complete the first. ADR-0127.
 */
export type TurnedDown = {
  readonly refusal: ServedRefusal
  /** What the contract was for, in the index's own words. Empty where the index carries none. */
  readonly summary: string
}

/**
 * Every domain the catalogue has decided anything about, which is every domain the index files a
 * contract under.
 *
 * **A domain whose contracts were all refused is here, and it used to be excluded on an argument this
 * change refutes rather than outgrows.** That argument was that such a page *would carry an empty list,
 * a figure of zero and one line pointing at the refusals page - which answers no question that page
 * does not answer better*. It is true of a page that says nothing about the refusal, and the refusal is
 * now what the page is about: `array` publishes nothing, has turned one contract down, and the reason
 * it did is on it. ADR-0126.
 *
 * **The order is the index's and the refusals are ordered inside it**, so a domain that has both lists
 * what it publishes first. Neither list is sorted here: the registry's order is the one the front page,
 * the sitemap and every column already use, and a second ordering would be a second opinion about which
 * contract comes first.
 */
export const domainsOf = (
  source: RegistrySource,
  held: readonly Held[],
): readonly Domain[] => {
  const turnedDown = source.refusals().refusals
  const entries = source.contractIndex().entries
  const summaryOf = (address: ContractAddress): string =>
    entries.find((entry) => sameContract(entry.address, address))?.summary ?? ''
  const order: string[] = []

  for (const entry of source.contractIndex().entries) {
    if (!order.includes(entry.domain)) order.push(entry.domain)
  }

  return order.flatMap((name) => {
    const mine = held.filter((one) => domainOf(one.contract.address.name) === name)
    const refused = turnedDown
      .filter((one) => domainOf(one.address.name) === name)
      .map((refusal) => ({ refusal, summary: summaryOf(refusal.address) }))

    /**
     * What the page is addressed by, taken from whichever list has something in it.
     *
     * A domain of the index has at least one contract by construction - it exists because an entry was
     * filed under it - so exactly one arm of this is unreachable, and it is written rather than
     * asserted because the type cannot say which. A domain with neither is not a domain.
     */
    const address = mine[0]?.contract.address ?? refused[0]?.refusal.address

    return address === undefined ? [] : [{ name, address, held: mine, turnedDown: refused }]
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
