import { defineConfig } from 'vitest/config'

import { THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN } from './mutation/excluded-contracts.ts'

/**
 * The contracts `npm test` does not run, run on a runtime that carries what they need. ADR-0259.
 *
 * ---------------------------------------------------------------------------
 * A second door and never a lifted exclusion
 * ---------------------------------------------------------------------------
 *
 * `vitest.config.ts` excludes these folders because a contract needing a runtime neither leg of the
 * matrix carries reddens the suite for every contributor, and that is unchanged: `npm test` still
 * answers the same thirty files and seven hundred and eighteen tests on 22.18.0 and on 24. What this
 * file adds is a configuration that collects **only** those folders, for a job that runs on a runtime
 * carrying `Temporal` - so the exclusion is exact rather than total, and the measurement it used to
 * cost is paid somewhere rather than nowhere.
 *
 * ---------------------------------------------------------------------------
 * Derived and never repeated, which is the whole of why it is a `.ts` file
 * ---------------------------------------------------------------------------
 *
 * The folders are declared once, in `mutation/excluded-contracts.ts`. Both halves below are computed
 * from that declaration, so a second contract excluded tomorrow is collected here with nobody editing
 * this file - and a folder excluded from `npm test` and forgotten here would be a contract that runs
 * nowhere at all, which is the failure this file exists against.
 *
 * ---------------------------------------------------------------------------
 * Why `typecheck.tsconfig` is named, measured rather than assumed
 * ---------------------------------------------------------------------------
 *
 * Vitest typechecks the *project* and not the collected set, and it spawns `tsc` with `-p` only when
 * this field is set - measured at ADR-0253. Without it the compiler reads the root project, which
 * excludes these folders and whose `lib` has no `ESNext.Temporal`, so the type tests would be
 * collected and the files under them typechecked by nobody. `tsconfig.excluded-contracts.json` is the
 * project this job means, and it names no folder: it inherits the root's `include` and empties the
 * root's `exclude`, so the declaration reaches it by negation rather than by a fourth transcription.
 */
export default defineConfig({
  test: {
    include: THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN.map((folder) => `${folder}/**/*.test.ts`),
    typecheck: {
      include: THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN.map((folder) => `${folder}/**/*.test-d.ts`),
      tsconfig: './tsconfig.excluded-contracts.json',
    },
  },
})
