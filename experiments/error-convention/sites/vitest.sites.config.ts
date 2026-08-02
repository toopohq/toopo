import { defineConfig } from 'vitest/config'

/**
 * Experiment material. The call sites answer the same question in three error conventions, and that
 * equivalence has to be executable or the counts of the site measurement are counts of a sketch.
 *
 * They run under their own config rather than under the root one, so that a contract's suite and
 * the experiment's suite never share a run. A mutation run reddens the contracts; it must not
 * redden files that are not part of any contract's verification.
 */
export default defineConfig({
  test: {
    include: ['experiments/error-convention/sites/*.test.{ts,js}'],
    root: process.cwd(),
  },
})
