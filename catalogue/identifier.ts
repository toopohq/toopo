/**
 * The shape of every frozen address in this catalogue.
 *
 * A case of block 4.4 is addressed by one, a guard is addressed by one, and the registry addresses a
 * case, a guard and a mutant by one. It is a name in kebab-case, unique within its contract, frozen
 * with the contract's major version - and the reasons are stated where the rule was settled:
 * `every-contract.ts` for a case, `mutation/run.ts` for a guard.
 *
 * It lives in a module of its own for one reason, and it is the reason `every-contract.ts` gives for
 * what belongs to the catalogue at all: *what it says belongs to the registry rather than to any one
 * feature*. `every-contract.ts` imports `expect` at its top level, because most of what it holds is a
 * guard; an address is not a guard, and the registry must be able to state what an address looks like
 * without importing a test framework to do it.
 *
 * `mutation/run.ts` carries a third copy, under the name `GUARD_IDENTIFIER` and with a comment saying
 * it is the same shape for the same reason. It is not folded in here, and that is a debt rather than
 * a decision: the instrument was out of scope for the change that created this file.
 */

export const FROZEN_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const isFrozenIdentifier = (candidate: string): boolean => FROZEN_IDENTIFIER.test(candidate)
