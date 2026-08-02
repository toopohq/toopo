import { defineConfig } from 'vitest/config'

/**
 * `npm run meta` means the instrument's own guards, and nothing else.
 *
 * Separate from the repository's configuration for two reasons. The contracts' suite is run once per
 * cell by the instrument, so putting guards that themselves spawn cells inside it would be a loop.
 * And each guard here checks out and rewrites `mutation/fixture` on disk, so they must not run
 * beside anything else that does: one file, run in order, is the whole concurrency model.
 *
 * `include` names the instrument's own tests at this level only. The fixture's three tests live one
 * directory down and are collected by their own configuration, when a cell asks for them.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // instrument invokes vitest from the repository root and `npm run meta` is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
