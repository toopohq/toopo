import { defineConfig } from 'vitest/config'

/**
 * Experiment material, and the only file of this branch that sits at the root.
 *
 * `npm test` must mean exactly what it meant before this branch existed: the contracts' own suite,
 * and nothing else. The call sites under `experiments/` carry tests too - they check that the three
 * error conventions answer identically - and vitest would collect them by default, which would put
 * them inside every mutation run and make a defect in a contract redden a file that is not part of
 * any contract's verification. The mutation scores would then be measuring the experiment.
 *
 * They are run on their own, by `npm run test:experiment`.
 */
export default defineConfig({
  test: {
    include: ['contracts/**/*.test.ts'],
    typecheck: { include: ['contracts/**/*.test-d.ts'] },
  },
})
