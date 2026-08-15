import { defineConfig } from 'vitest/config'

/**
 * `npm run validation` means the validation pipeline's own guards, and nothing else.
 *
 * The third configuration in this repository, for the two reasons `packages/registry/vitest.config.ts`
 * already records and measured rather than assumed. A guard collected by `npm test` enters every cell
 * of every contract battery, and a type error anywhere in the root `tsconfig.json`'s `include` makes
 * `npm test` exit non-zero with no failed guard - which the instrument reads as every cell killed by
 * typecheck.
 *
 * This folder has a third reason of its own, and it is the loudest. Every guard here spawns a
 * TypeScript compiler process to parse the files it analyses. Collected by `npm test`, that cost
 * would be paid once per injected defect, on every battery in the repository.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
