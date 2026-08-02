import { defineConfig } from 'vitest/config'

/**
 * `npm test` means the contracts' own suite, and nothing else.
 *
 * The mutation instrument in `mutation/` runs that suite once per injected defect and reads its exit
 * status as a verdict. Anything else vitest collected by default would enter every one of those runs,
 * so a defect in a file that is not part of any contract's verification would redden a column and be
 * counted as a contract catching something. Restricting collection here is what keeps a mutation
 * score a measurement of the contracts.
 */
export default defineConfig({
  test: {
    include: ['contracts/**/*.test.ts'],
    typecheck: { include: ['contracts/**/*.test-d.ts'] },
  },
})
