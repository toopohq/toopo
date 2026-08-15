import { defineConfig } from 'vitest/config'

/**
 * `npm run site` means the generator's own guards, and nothing else.
 *
 * The sixth configuration in this repository, for the three reasons `packages/registry/vitest.config.ts` and
 * `cli/vitest.config.ts` already record: a guard collected by `npm test` enters every cell of every
 * contract battery; a type error anywhere in the root `tsconfig.json`'s `include` makes `npm test`
 * exit non-zero with no failed guard, which the instrument reads as every cell killed by typecheck;
 * and the guards here serialise all five contracts, which reads thirty-seven files and would be paid
 * once per injected defect on every battery in the repository.
 *
 * Nothing here writes a file. The pages are built in memory and compared in memory - `build.ts` is the
 * only thing that writes, and it is not a guard. That is deliberate rather than incidental: what the
 * generator decides has to be reachable without a working directory, for the reason `cli/command.ts`
 * already states about the installer.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
