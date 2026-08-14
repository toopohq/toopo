// typescript/string/levenshtein@1 - https://toopo.dev/typescript/string/levenshtein@1/
// Copyright (c) 2026 Mathis Perron. SPDX-License-Identifier: MIT-0

/**
 * `string/levenshtein@1` - count the single-character insertions, deletions and substitutions that
 * turn one string into the other.
 *
 * Written to be read: correctness and obviousness come before speed. The whole matrix is kept rather
 * than the two rows the recurrence needs, so that the code can be read against the definition it
 * implements. The two-row and banded variants compute the same numbers in less memory; under this
 * contract they are competing implementations, and this one is the oracle they are compared against.
 *
 * The unit is the Unicode code point - what `for...of` and `Array.from` yield, and what the contract
 * argues for at length. What matters here is that the same decomposition is applied to both
 * arguments and that nothing else touches them: the axioms this function claims only hold if the two
 * sides are measured in one unit, and an implementation that counted one side in code points and
 * normalised the other would break the triangle inequality without ever answering an obviously wrong
 * number.
 *
 * There is no diagnostic export beside this one. Every pair of strings has a distance, so there is no
 * refusal to describe.
 */
export const levenshtein = (a: string, b: string): number => {
  const left = [...a]
  const right = [...b]

  /**
   * `distance[i][j]` is the distance between the first `i` code points of `left` and the first `j`
   * of `right`.
   */
  const distance: number[][] = []

  // The two trivial edges of the matrix: turning a prefix into the empty string costs one deletion
  // per code point, and turning the empty string into a prefix costs one insertion per code point.
  for (let i = 0; i <= left.length; i += 1) {
    distance[i] = new Array<number>(right.length + 1)
    distance[i][0] = i
  }

  for (let j = 0; j <= right.length; j += 1) distance[0][j] = j

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const substitution = distance[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      const deletion = distance[i - 1][j] + 1
      const insertion = distance[i][j - 1] + 1

      distance[i][j] = Math.min(substitution, deletion, insertion)
    }
  }

  return distance[left.length][right.length]
}
