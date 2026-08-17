import { defineConfig } from 'vitest/config'

/**
 * `npm run packaging` means the archive's own guards, and nothing else.
 *
 * The reasons `packages/registry/vitest.config.ts` records apply here unchanged: a guard collected by
 * `npm test` enters every cell of every contract battery, and a type error anywhere in the root
 * `tsconfig.json`'s `include` makes `npm test` exit non-zero with no failed guard, which the
 * instrument reads as every cell killed by typecheck.
 *
 * This folder adds one of its own: the guard here runs `npm pack` and `npm install`, which takes tens
 * of seconds, and it would be paid once per injected defect on every battery in the repository.
 *
 * The timeout is this folder's own for the same reason. This sentence used to say that everything
 * else here decides in milliseconds because it decides in memory, and that was already false of
 * `packages/cli/` when it was written: those guards write files and spawn processes too, and they
 * inherited a default nobody had decided until one of them expired under a machine stall. What both
 * folders refuse is the same thing - a threshold that turns a slow machine into a defect that is not
 * there. This one builds an archive and installs it, which is tens of seconds where `packages/cli/`
 * is seconds, so the two numbers differ by the order of magnitude the work does.
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
