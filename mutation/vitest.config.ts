import { defineConfig } from 'vitest/config'

/**
 * `npm run meta` means the instrument's own guards, and nothing else.
 *
 * Separate from the repository's configuration for two reasons. The contracts' suite is run once per
 * cell by the instrument, so putting guards that themselves spawn cells inside it would be a loop.
 * And each guard here checks out and rewrites `mutation/fixture` on disk, so they must not run
 * beside anything else that does: one file, run in order, is the whole concurrency model.
 *
 * **That model covered the writers and not the readers, and the omission was a red rather than an
 * argument.** `fileParallelism` was never set, so *files* ran concurrently while the guards inside each
 * one ran in order - and `anchors.test.ts` reads the same fixture `instrument.test.ts` rewrites.
 * Measured on CI at `432b7bf`, from the run's own timestamps:
 *
 *     16:23:52.268  workflows.test.ts passed
 *     16:23:53.402  calibration C/as-committed  control green
 *     16:23:53.781  anchors.test.ts  1 failed
 *     16:23:53.953  calibration C/as-committed  FX-1 killed
 *     16:24:05.038  instrument.test.ts passed, 11068ms
 *
 * The reading landed inside the injection: two anchors of `mutation/fixture/reference.ts` quoted text
 * that occurred zero times, because at that instant it did. **It was green on the machine it was written
 * on, green on both runtimes for every commit before it, and red on both after a commit that touched
 * neither file** - so what moved is the schedule and not the tree. *Why* it moved is not measured and no
 * cause is named for it: the two files overlapped, which is enough to know that they may.
 *
 * So the sentence above is now a setting. It costs nothing measurable: this suite is one eleven-second
 * file and six that finish in milliseconds, and serialising them removes a class of red that no reader
 * of a fault message could have attributed to a schedule.
 *
 * `include` names the instrument's own tests at this level only. The fixture's three tests live one
 * directory down and are collected by their own configuration, when a cell asks for them.
 *
 * Two of the guards it collects are about `../run-vitest.ts` and `../vitest-entry-point.ts` rather
 * than about the instrument. They are here because they belong beside the guard over the
 * instrument's own entry point - one door, two routes into it, and a reader who finds one must find
 * the other. Giving the root a configuration of its own would add collection surface, which is where
 * every door in `census.ts` has been found.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // instrument invokes vitest from the repository root and `npm run meta` is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    // The header's measurement is why: one file rewrites the fixture another one reads.
    fileParallelism: false,
  },
})
