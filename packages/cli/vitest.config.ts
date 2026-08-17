import { defineConfig } from 'vitest/config'

/**
 * `npm run cli` means the installer's own guards, and nothing else.
 *
 * The reasons `packages/registry/vitest.config.ts` records apply here unchanged, and were measured
 * rather than assumed: a guard collected by `npm test` enters every cell of every contract battery,
 * and a type error anywhere in the root `tsconfig.json`'s `include` makes `npm test` exit non-zero
 * with no failed guard, which the instrument reads as every cell killed by typecheck.
 *
 * This folder adds its own. Every guard here that rewrites an import spawns a TypeScript compiler
 * process, which is the cost `packages/validation/vitest.config.ts` keeps out of `npm test` for the
 * same reason. And every guard here **writes files** - under the operating system's temporary
 * directory and removed afterwards, never inside this repository, but a suite that writes at all,
 * collected by the suite the mutation instrument runs a hundred times, would be a hundred rounds of
 * file system activity attached to measurements about parsing numbers.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    /**
     * Declared rather than inherited, because the default is a clock and this folder is the one that
     * waits on things it does not control.
     *
     * The paragraph above says every guard here writes files; since `ignored.ts` they also spawn `git`,
     * and since `rewrite.ts` a TypeScript compiler. Nothing in any contract says an install must
     * finish in five seconds, so vitest's default was a threshold nobody had decided - and it turned
     * machine load into a red guard, which this instrument reads as a verdict.
     *
     * Measured. The slowest guard is `an-installation-is-the-same-with-git-and-without` at **2 688 ms**,
     * worst of ten runs on an idle machine and 3 518 ms under load: **1.9x** of the default, and 1.4x
     * under load. Over 700 consecutive runs of this suite one run took **62.4 s against a 6.0 s
     * median**, and that guard's neighbour expired - a stall of ten, against a threshold that gives way
     * at two. Sixty seconds is twenty-two times the slowest guard, so a stall would have to be an order
     * of magnitude worse than the worst observed before load could redden anything, and a guard that is
     * genuinely hung still surfaces within a minute.
     *
     * The hooks take the same number for the same reason: the `afterAll` in `ignored.test.ts` removes a
     * directory through `remove-directory.ts`, which spends up to 2 750 ms when something still holds
     * it - 3.6x of the ten seconds vitest allows a hook by default.
     */
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
