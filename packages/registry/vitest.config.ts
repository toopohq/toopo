import { defineConfig } from 'vitest/config'

/**
 * `npm run registry` means the registry's own guards, and nothing else.
 *
 * Separate from the repository's configuration, and the reason is a measurement rather than a
 * preference. The mutation instrument runs `npm test` once per injected defect and reads its exit
 * status as a verdict, so anything the repository's configuration collects enters every cell of every
 * battery. The guards below read `contract.ts` and `edge-cases.ts` - which is exactly what the five
 * specification batteries inject into - so a registry guard collected by `npm test` would redden
 * under a specification mutant and be counted as the contract catching it.
 *
 * That is not hypothetical. GS-11 of `string-slugify-spec` widens the declared output alphabet and is
 * pinned `survived`: it is the one mutant in the catalogue that demonstrates a declaration can be
 * wider than what it guards. A registry guard that compares the serialised alphabet against the
 * contract would redden on it, the cell would read `killed`, the battery would disagree, and the
 * single thing that mutant exists to show would be gone.
 *
 * `vitest.config.ts` at the root says "the contracts' own suite, and nothing else" and means it. This
 * file is what keeps that sentence true, on the precedent `mutation/vitest.config.ts` already set.
 *
 * **A second door had to be closed, and it was found by measuring rather than by reasoning.** Test
 * collection is not the only way this folder can reach a battery: `npm test` runs `--typecheck`, and
 * a type error anywhere in the root `tsconfig.json`'s `include` makes it exit non-zero. Measured,
 * with one bad line in a file under `packages/registry/`: the suite reports "467 passed, Type Errors no
 * errors" and exits 1. The instrument reads the exit status as its verdict and finds no failed
 * guard, so every cell of every battery would read `killed (typecheck)` - and `testsSeen` would still
 * be 467, so the guard that catches a truncated run would see nothing wrong. It is the same family as
 * the defect `run.ts` records about the json reporter, arriving by a different door.
 *
 * So `packages/registry/` is not in the root `tsconfig.json`. It has its own, and `npm run registry` runs it
 * before the suite, because an unchecked `.ts` file would claim a guarantee this repository does not
 * give it.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],

    /**
     * Declared rather than inherited, because vitest's default is a clock and the slowest guard here
     * spends its whole time in child processes.
     *
     * `the-served-bytes-are-the-committed-bytes` runs one `git show` per harness file of seven
     * contracts and hashes each against what `serialiseContract` produced. Nothing in any contract says
     * that has to finish in five seconds, so the default was a threshold nobody decided - and this
     * folder is where that threshold was measured turning machine load into a red guard, which the
     * mutation instrument reads as a verdict.
     *
     * **The condition it is measured in is the one a battery cell runs, and that is the whole of why
     * the number moved.** The file alone takes 1 124 ms; the same guard inside the whole folder under
     * `--typecheck`, which is what `run.ts` spawns, takes **2 672, 2 818 and 2 820 ms** - already 56 %
     * of the default on an idle machine. Measured at `d9f62b8` on Windows 11, node v24.15.0, vitest
     * 4.1.10, sixteen logical cores, with N background processes spinning beside the suite's own
     * workers:
     *
     *     idle    2 672   2 818   2 820                     green
     *     N = 4   3 403   3 450   3 636                     green
     *     N = 8   4 971   4 993   5 606                     one red of three
     *     N = 16  12 514  12 664  13 670  15 015            four red of four
     *
     * At saturation two other guards cross the default with it and three of 466 report a duration
     * above it, so the bound is not about one guard.
     *
     * **The base is measured and the multiple is a convention, said out loud because the number would
     * otherwise read as derived.** The base is 15 015 ms, the worst of ten readings, at a contention of
     * 5.32 over idle. The multiple is four: the bound has to clear the worst machine measured with room
     * for one worse still, and four is a choice about how much room. So 60 060 ms carries its own base
     * in its digits, and re-measuring the worst reading moves it.
     *
     * It is 10 % of `THE_LONGEST_A_RUN_MAY_TAKE`, so a guard that is genuinely hung still reddens
     * inside the bound on the run that contains it rather than arriving as `not-measured`, which is the
     * verdict ADR-0162 says no cell can be pinned at.
     *
     * **`hookTimeout` is deliberately left at its default, and that is a refusal rather than an
     * oversight.** The heaviest hook here clones this repository and makes four commits, and no reading
     * taken for this unit separates it from the file's own import and collection: the figure that looked
     * like the hook - 8 226 ms against a 10 000 ms default - is the whole file, and the same file was
     * seen taking 27 519 ms at saturation without the hook expiring. A bound set on a quantity nobody
     * has measured is the thing this comment exists not to be. ADR-0205.
     */
    testTimeout: 60_060,
  },
})
