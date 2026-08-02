/**
 * `array/group-by@1` - partition an array into groups by a key computed from each element, keeping
 * the input order everywhere and the key values exactly as the key function returned them.
 *
 * Written to be read: correctness and obviousness come before speed.
 *
 * `Map.groupBy` does the same job and is not called here: it is ES2024, and this file compiles
 * against ES2022, where it is not typed at all.
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
 * so a sparse array's hole arrives as `undefined` at its own index - which is what both ES2024
 * built-ins do, measured.
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
