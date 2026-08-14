import { describe, it, expectTypeOf } from 'vitest'
import type { GroupBy } from './contract.js'
import { groupBy } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, narrows its return type, or loses a
 * type parameter fails the suite before any behavioural test runs.
 *
 * This is the first generic signature in the catalogue, and the first place where the catalogue's
 * `toEqualTypeOf` alone is not enough to trust. A monomorphic signature has one shape and one
 * comparison; a generic one is also a promise about *inference*, and a mutant can keep the declared
 * shape while breaking what a caller's `groupBy(users, (u) => u.team)` produces at the call site. The
 * identity check below is therefore followed by call-site checks, and the mutation battery measures
 * which of the two catches which signature mutant rather than assuming the first one covers
 * everything.
 */

type User = { readonly name: string; readonly team: string }

const USERS: readonly User[] = [{ name: 'Alice', team: 'red' }]

describe('array/group-by@1 signature', () => {
  it('signature-is-the-declared-type', () => {
    expectTypeOf(groupBy).toEqualTypeOf<GroupBy>()
  })

  it('signature-infers-the-element-type :: from the array, and hands it to the key function', () => {
    // No annotation on `user`: if the element type stopped flowing into the key function, this line
    // would be an implicit `any` and the parameter check below would be reading nothing.
    expectTypeOf(groupBy(USERS, (user) => user.team)).toEqualTypeOf<Map<string, User[]>>()
  })

  it('signature-infers-the-key-type :: from the key function, and constrains it to nothing', () => {
    const RED = Symbol('red')

    expectTypeOf(groupBy([1, 2, 3], (n) => n)).toEqualTypeOf<Map<number, number[]>>()
    expectTypeOf(groupBy([1, 2, 3], (n) => n > 1)).toEqualTypeOf<Map<boolean, number[]>>()
    expectTypeOf(groupBy([1], () => RED)).toEqualTypeOf<Map<symbol, number[]>>()
    expectTypeOf(groupBy([1], (n) => ({ bucket: n }))).toEqualTypeOf<Map<{ bucket: number }, number[]>>()
  })

  it('signature-passes-the-index :: as a number, second', () => {
    expectTypeOf(groupBy(USERS, (_user, index) => index)).toEqualTypeOf<Map<number, User[]>>()
  })

  it('signature-accepts-a-readonly-array', () => {
    const frozen: readonly number[] = Object.freeze([1, 2, 3])

    expectTypeOf(groupBy(frozen, (n) => n)).toEqualTypeOf<Map<number, number[]>>()
  })

  it('signature-returns-owned-groups', () => {
    // The groups are `T[]` and not `readonly T[]`: they are fresh arrays, so a caller may sort or
    // push into one without reaching anything this function was given. The negative half is what
    // makes this a check rather than a restatement of the line above it.
    expectTypeOf(groupBy([1], () => 'k')).toEqualTypeOf<Map<string, number[]>>()
    expectTypeOf(groupBy([1], () => 'k')).not.toEqualTypeOf<Map<string, readonly number[]>>()
  })

  it('signature-refuses-a-third-argument :: a key function may not ask for more than the contract passes', () => {
    // @ts-expect-error d3.group passes the source array as a third argument; this contract passes
    // two, so a key function written against d3 does not typecheck here rather than silently
    // receiving undefined.
    groupBy([1, 2], (_item, _index, _source) => 1)
  })

  it('signature-refuses-a-non-array', () => {
    // @ts-expect-error the domain is arrays. Block 4.4 settles what happens at runtime when
    // untyped JavaScript passes something else, which is a different question from this one.
    groupBy(null, (item) => item)

    // @ts-expect-error a Set is grouped correctly at runtime, and is still not what the signature
    // declares - the type states the domain the contract is written for.
    groupBy(new Set([1, 2]), (item) => item)
  })

  it('signature-refuses-a-missing-key-function', () => {
    // @ts-expect-error the key is not optional, and there is no default: this contract has no
    // opinion about what a caller meant to group by.
    groupBy([1, 2])
  })
})
