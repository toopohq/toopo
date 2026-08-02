import { defineConfig } from 'vitest/config'

/**
 * The configuration a meta cell collects under: the fixture's three tests, and nothing else.
 *
 * It exists so that the repository's own `vitest.config.ts` can keep saying "the contracts' own
 * suite, and nothing else" and mean it. A fixture collected by `npm test` would appear in the
 * contracts' output as though it were one of them, which is the first step towards someone copying
 * it, and it would enter every cell of every contract battery for no reason.
 *
 * No `typecheck` block: the fixture declares no types to check, and `run.ts` passes `--typecheck`
 * regardless because every contract battery needs it. Measured, vitest collects zero type tests here
 * and the run is unaffected.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory: the instrument
  // invokes vitest from the repository root, where `*.test.ts` would match nothing.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
