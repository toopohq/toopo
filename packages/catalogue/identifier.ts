/**
 * The shape of every frozen address in this catalogue, and of the one thing that is nothing but an
 * address and its sentence.
 *
 * A case of block 4.4 is addressed by one, a guard is addressed by one, a group of a table is
 * addressed by one, and the registry addresses a case, a guard and a mutant by one. It is a name in
 * kebab-case, unique within its contract, frozen with the contract's major version - and the reasons
 * are stated where the rule was settled: `every-contract.ts` for a case, `mutation/run.ts` for a
 * guard, `CaseGroup` below for a group.
 *
 * It lives in a module of its own for one reason, and it is the reason `every-contract.ts` gives for
 * what belongs to the catalogue at all: *what it says belongs to the registry rather than to any one
 * feature*. `every-contract.ts` imports `expect` at its top level, because most of what it holds is a
 * guard; an address is not a guard, and the registry must be able to state what an address looks like
 * without importing a test framework to do it.
 *
 * `mutation/run.ts` carried a third copy of the shape and its own copy of the separator, recorded here
 * as a debt rather than a decision because the instrument was out of scope for the change that created
 * this file. It imports both from here now: a second folder began reading a guard title, and a rule
 * stated in three places is one that comes to disagree with itself.
 */

export const FROZEN_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const isFrozenIdentifier = (candidate: string): boolean => FROZEN_IDENTIFIER.test(candidate)

/**
 * What separates a guard's address from its sentence, and the reading of a title that uses it.
 *
 * ASCII on purpose, and it cannot occur inside an identifier because an identifier has no spaces - so
 * the split cannot be wrong. An em dash reads better and would have been the first non-ASCII code
 * point in any title in the repository.
 *
 * **It lives here because two folders now read a guard title and neither owns the rule.** The
 * instrument reads one to address a cell; `cli/breakage.test.ts` reads one to resolve the guard a
 * declared refusal names. A rule stated in two places is a rule that comes to disagree with itself,
 * and the header of this module already describes this exact shape in prose for `CaseGroup` - so
 * holding it as code is the smaller change, not the larger one. The debt this module recorded against
 * `mutation/run.ts` carrying its own copy is closed by that file importing this one.
 */
export const GUARD_SEPARATOR = ' :: '

/** The address half of a guard's title, which is the whole title when it carries no sentence. */
export const guardIdOf = (title: string): string => {
  const at = title.indexOf(GUARD_SEPARATOR)

  return at === -1 ? title : title.slice(0, at)
}

/**
 * One group of a table of block 4.4: an address, and the sentence a reader sees above the cases.
 *
 * **It is the guard rule in data form.** A guard's title is an identifier, then ` :: `, then a
 * sentence, because a guard needs an address a battery can pin and a sentence a person can read, and
 * one string doing both means every reword breaks a pin. A group needs exactly the same two things
 * for exactly the same reasons - the site anchors a URL on the `id`, and the `title` is what somebody
 * reads before deciding whether this section holds their question - so it is written as two fields
 * rather than as one string with a separator in it. A group is data and a guard title is not, which
 * is the only reason the shapes differ.
 *
 * `id` is a frozen identifier, unique within the contract across **groups and cases together**: both
 * become `#id` on one page, so a collision is a link that silently lands on the wrong element.
 * `title` is prose and is corrected the day it reads badly, exactly as a guard's sentence is.
 *
 * **What is frozen and what it costs.** Splitting a group, merging two, or renaming an `id` costs
 * `name@2`, because each of them breaks a link somebody has already shared. Adding a case to an
 * existing group costs nothing, and that is the common gesture.
 *
 * It lives here rather than in `every-contract.ts` for this module's founding reason: the registry
 * carries a group in `CaseTableRecord` and cannot import a file that imports vitest.
 */
export type CaseGroup = {
  readonly id: string
  readonly title: string
  /**
   * What a reader of the page needs before the cases, or `null` when the title says it all.
   *
   * **Required and never optional**, so that having nothing to add is written rather than left out -
   * the shape `ImplementationRecord.version` already takes for the same reason. Forty-four of the
   * forty-eight are `null`.
   *
   * **The split is what it is addressed to, and the four that exist are the test.** A sentence for
   * whoever reads the contract page goes here; a sentence for whoever maintains the table stays in a
   * comment. `the-loss-made-concrete` says in as many words that its two rows exist so that a
   * declaration has *a demonstration on the contract's own page* - a sentence that asks to be on the
   * page, and putting it in a comment was a loss of content rather than a tidying.
   *
   * **Not frozen.** `id` is the address and freezes with the major; `title` and this are prose and
   * are corrected the day they read badly, exactly as a `rationale` is. Nobody links to a sentence.
   *
   * **A declared note is rendered.** There is no state where one is written and not shown, which is
   * the class `coverage.test.ts` already refuses on the record: a field carried and never served is
   * a field nobody can check.
   */
  readonly note: string | null
}

/**
 * Every way a table's grouping fails to be a partition of its cases, in one list.
 *
 * It answers rather than throws because it has two callers that need it differently, and the whole
 * point of writing it here is that they share one implementation: `packages/registry/serialise.ts` refuses a
 * contract at the boundary and cannot import vitest, and the contracts' own `edge-cases.test.ts`
 * asserts the same thing under `npm test` - which collects `contracts/` and nothing else, so a
 * specification mutant that moved a case between groups would otherwise be a defect nothing probes.
 *
 * Four faults, and the fourth is the one that is easy to leave out. A group is *contiguous* because
 * the source's order is the page's order, so a group interrupted by another renders as two headings
 * with one title and nothing saying why.
 *
 * **What it cannot see, measured rather than reasoned about.** A case moved across the boundary into
 * the group *next to* it leaves a partition that is still well formed - contiguous, nothing empty,
 * nothing undeclared - so nothing here can object, and the page publishes the row under its
 * neighbour's heading. LS-14 was written that way by accident and survived; it now moves a case to a
 * group that is not its neighbour, and the limit is declared here because the alternative would be a
 * guard claiming to check that a case *belongs* where it is filed, which is a judgement about prose.
 */
export const groupingFaults = (
  groups: readonly CaseGroup[],
  used: readonly string[],
): readonly string[] => {
  const declared = groups.map((group) => group.id)
  const distinct = (values: readonly string[]): readonly string[] => [...new Set(values)]

  const faults: string[] = []

  const malformed = declared.filter((id) => !isFrozenIdentifier(id))
  if (malformed.length > 0) faults.push(`[${malformed.join(', ')}] is not an address`)

  const twice = distinct(declared.filter((id, at) => declared.indexOf(id) !== at))
  if (twice.length > 0) faults.push(`[${twice.join(', ')}] is declared more than once`)

  const undeclared = distinct(used.filter((id) => !declared.includes(id)))
  if (undeclared.length > 0) faults.push(`no group is declared for [${undeclared.join(', ')}]`)

  const empty = declared.filter((id) => !used.includes(id))
  if (empty.length > 0) faults.push(`[${empty.join(', ')}] holds no case`)

  const split = distinct(
    used.filter((id, at) => at > 0 && id !== used[at - 1] && used.slice(0, at).includes(id)),
  )
  if (split.length > 0) faults.push(`[${split.join(', ')}] is interrupted by another group`)

  const order = distinct(used)
  if (split.length === 0 && undeclared.length === 0 && empty.length === 0) {
    if (order.join(',') !== declared.join(',')) {
      faults.push(`the cases run [${order.join(', ')}] and the groups declare [${declared.join(', ')}]`)
    }
  }

  return faults
}

/**
 * Every address a contract page renders as `#id`, held by more than one thing.
 *
 * A group and a case are both anchored on one page, so they share one space of addresses and a
 * duplicate is a link that silently lands on the wrong element. Measured when the grouping was first
 * derived: two of the forty-eight group identifiers collided with a case of their own table, which
 * is why this exists rather than being assumed away.
 */
export const takenAddresses = (addresses: readonly string[]): readonly string[] => [
  ...new Set(addresses.filter((id, at) => addresses.indexOf(id) !== at)),
]
