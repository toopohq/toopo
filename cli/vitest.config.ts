import { defineConfig } from 'vitest/config'

/**
 * `npm run cli` means the installer's own guards, and nothing else.
 *
 * The fourth configuration in this repository, for the three reasons `registry/vitest.config.ts` and
 * `validation/vitest.config.ts` already record and measured rather than assumed. A guard collected by
 * `npm test` enters every cell of every contract battery; a type error anywhere in the root
 * `tsconfig.json`'s `include` makes `npm test` exit non-zero with no failed guard, which the instrument
 * reads as every cell killed by typecheck; and every guard here that rewrites an import spawns a
 * TypeScript compiler process, a cost that would otherwise be paid once per injected defect on every
 * battery in the repository.
 *
 * This folder has a fourth reason nothing before it had, and it is the loudest of the four. Every
 * guard here **writes files**. They are written under the operating system's temporary directory and
 * removed afterwards, never inside this repository - but a suite that writes at all, collected by the
 * suite the mutation instrument runs a hundred times, would be a hundred rounds of file system
 * activity attached to measurements about parsing numbers.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
