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
 * with one bad line in a file under `registry/`: the suite reports "467 passed, Type Errors no
 * errors" and exits 1. The instrument reads the exit status as its verdict and finds no failed
 * guard, so every cell of every battery would read `killed (typecheck)` - and `testsSeen` would still
 * be 467, so the guard that catches a truncated run would see nothing wrong. It is the same family as
 * the defect `run.ts` records about the json reporter, arriving by a different door.
 *
 * So `registry/` is not in the root `tsconfig.json`. It has its own, and `npm run registry` runs it
 * before the suite, because an unchecked `.ts` file would claim a guarantee this repository does not
 * give it.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
  },
})
