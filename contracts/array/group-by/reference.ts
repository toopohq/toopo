/**
 * Reference implementation of `array/group-by@1`.
 *
 * It is the oracle of the registry's differential test, so it is written to be read: correctness and
 * obviousness come before speed.
 *
 * The signature is written out here rather than imported from `contract.ts`. Annotating this
 * function with the contract's own type would make the compiler enforce conformance at authoring
 * time and leave `signature.test-d.ts` unable to fail - a guard that proves nothing. An
 * implementation states its signature independently, and the contract checks it.
 *
 * `Map.groupBy` is not called here, and the reason is not that it would be cheating. It is ES2024
 * and absent from this repository's `lib: ["ES2022"]` target, so it is not typed here at all; and
 * delegating would move every line the mutation battery injects a defect into out of this file and
 * into the runtime, leaving a contract whose verification could no longer be shown to catch
 * anything.
 *
 * There is no diagnostic export beside this one. The function is total: every array has a grouping,
 * so there is no refusal to describe.
 */

/**
 * The input is consumed by iteration rather than by a counting loop over `length`.
 *
 * The counting loop is faster and is what lodash does; measured, it is also what makes lodash answer
 * zero groups for a Set and zero groups for `null` instead of refusing either. Iterating groups a
 * non-array iterable correctly and lets a non-iterable raise the language's own TypeError, which is
 * the loud failure the fast version was converting into a quiet wrong answer.
 *
 * The index is counted here rather than read from the iterator, because the iterator does not carry
 * one. It is passed to the key function as its second argument and is never used for anything else,
 * so a sparse array's hole arrives as `undefined` at its own index - the behaviour block 4.4 names,
 * and the behaviour of both ES2024 built-ins, measured.
 */
export const groupBy = <T, K>(
  items: readonly T[],
  keyOf: (item: T, index: number) => K,
): Map<K, T[]> => {
  const groups = new Map<K, T[]>()
  let index = 0

  for (const item of items) {
    // One call per element, and the only one: the key is read once and used both to find the group
    // and to create it. Asking twice would let a key function that is not a function of its element
    // alone put an element in one group under a key it never returned for it.
    const key = keyOf(item, index)
    const existing = groups.get(key)

    // A fresh array per group, never the input and never shared between groups, so that a caller
    // editing one group reaches neither the array it grouped nor any other group.
    if (existing === undefined) groups.set(key, [item])
    else existing.push(item)

    index += 1
  }

  return groups
}
