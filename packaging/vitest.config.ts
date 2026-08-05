import { defineConfig } from 'vitest/config'

/**
 * `npm run packaging` means the archive's own guards, and nothing else.
 *
 * The seventh configuration in this repository, for the three reasons `registry/vitest.config.ts`,
 * `cli/vitest.config.ts` and `site/vitest.config.ts` already record - and for a fourth that is this
 * folder's alone: the guard here runs `npm pack` and `npm install`, which takes tens of seconds. A
 * guard collected by `npm test` enters every cell of every contract battery, and this one would be
 * paid once per injected defect on every one of them.
 *
 * The timeout is this folder's own for the same reason. Everything else in this repository decides in
 * milliseconds because it decides in memory; this one builds an archive and installs it, and a default
 * timeout would make the slowest machine in the world report a defect that is not there.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    testTimeout: 300_000,
    hookTimeout: 300_000,
  },
})
