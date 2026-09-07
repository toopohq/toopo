import { defineConfig } from 'vitest/config'

/**
 * The meta suite as a battery may collect it: everything `vitest.config.ts` collects, minus the one
 * file that spawns cells.
 *
 * **Why a second configuration exists at all, rather than a filter.** `theFilesToCollect` answers a
 * folder filter when a battery names no configuration and `[]` when it names one, so neither shape
 * lets a battery keep a configuration *and* drop one file from it. A battery over `mutation/` needs
 * exactly that, so the exclusion is expressed where vitest can read it. ADR-0246 costs it: a sixth
 * configuration and thirteen census rows.
 *
 * **What is excluded and why it is not an exemption.** `instrument.test.ts` calls `calibrate` at
 * module scope and runs batteries in nine of its guards. A battery over this folder runs this suite
 * once per cell, so collecting that file would run a battery inside a battery - the loop the sibling
 * configuration refuses in its own first paragraph, for the contracts' suite, before any of this
 * existed. The argument is that file's, applied to the folder it was written in.
 *
 * **It is an `exclude` and never a shorter `include`, and the difference is the failure mode.** A
 * hand-written list of the thirteen would drop a fourteenth test file in silence: nothing would
 * collect it and the census would not name it, so no mechanism would have an opinion. Excluding one
 * file leaves the glob total, so a new test file is collected, is not in the census, and
 * `assertTheCensusHolds` refuses the battery by name.
 *
 * **`fileParallelism: false` is carried over and it is load-bearing here for the same measured
 * reason.** The sibling configuration records a red on CI at `43f4626`: `anchors.test.ts` reads
 * `mutation/fixture/reference.ts` while another file rewrites it, and the reading landed inside the
 * injection. The rewriting moved with the guard - `clean-tree.test.ts` is what dirties that file now -
 * so the overlap is unchanged and so is the setting. Dropping it here would reproduce that red inside
 * a cell, where it would read as a detection.
 */
export default defineConfig({
  // The sibling configuration's reason, unchanged: the instrument invokes vitest from the repository
  // root, and a root left to the working directory would collect a different suite per caller.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    exclude: ['instrument.test.ts'],
    // One file rewrites the fixture another one reads. `vitest.config.ts` carries the measurement.
    fileParallelism: false,
  },
})
