import { configDefaults, defineConfig } from 'vitest/config'

import { THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN } from './mutation/excluded-contracts.ts'

/**
 * `npm test` means the contracts' own suite, and nothing else.
 *
 * The mutation instrument in `mutation/` runs that suite once per injected defect and reads its exit
 * status as a verdict. Anything else vitest collected by default would enter every one of those runs,
 * so a defect in a file that is not part of any contract's verification would redden a column and be
 * counted as a contract catching something. Restricting collection here is what keeps a mutation
 * score a measurement of the contracts.
 *
 * ---------------------------------------------------------------------------
 * The mirror of that sentence, and why it is two exclusions here and a third elsewhere
 * ---------------------------------------------------------------------------
 *
 * A contract needing a runtime neither leg of the matrix carries reddens this suite for every
 * contributor, so it is taken *out* — and an exclusion is three places, measured rather than
 * reasoned about. The two below stop collection; they do not stop the typechecker, which typechecks
 * the *project* rather than the collected set and reports what it finds outside that set as a source
 * error. `tsconfig.json` carries the third. ADR-0251.
 *
 * `typecheck.ignoreSourceErrors` is deliberately not the answer: it would silence every real source
 * error in every `contract.ts` of the catalogue to serve one contract.
 *
 * The folders are declared once, in `mutation/excluded-contracts.ts`, and a guard beside that
 * declaration refuses a folder missing from any of the three. An exclusion silent in one place is
 * exactly what this repository refuses.
 */
export default defineConfig({
  test: {
    include: ['contracts/**/*.test.ts'],
    exclude: [
      ...configDefaults.exclude,
      ...THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN.map((folder) => `${folder}/**`),
    ],
    typecheck: {
      include: ['contracts/**/*.test-d.ts'],
      exclude: [
        ...(configDefaults.typecheck?.exclude ?? []),
        ...THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN.map((folder) => `${folder}/**`),
      ],
    },
  },
})
