import { defineConfig } from 'vitest/config'

/**
 * The one suite of this repository that reaches a live host, kept apart from the seven so that
 * nothing which replays can depend on one. ADR-0104.
 *
 * **A configuration of its own rather than a file beside `archive.test.ts`, and the reason is the
 * instrument rather than taste.** The `packaging` battery declares `packaging/vitest.config.ts`, six
 * mutants and one lens, so that suite runs at least seven times per replay of it. A guard reaching the
 * declared origin under that configuration would make calibration - and therefore the whole replay -
 * depend on a host being up, and a battery interrupted part-way leaves an injected mutant in the
 * working tree. That is the red nobody can act on, in the most expensive place this repository has.
 *
 * `packaging/vitest.config.ts` needs no exclusion to stay clear of it: its `include` is `*.test.ts`,
 * a single star does not descend, and this file sits one folder down. The shape is
 * `mutation/fixture/vitest.config.ts`'s, for the same reason - a suite that must not be collected by
 * the one beside it.
 *
 * The timeout is the neighbouring folder's, and it is the larger of the two this repository declares:
 * this suite packs an archive, installs it, and then waits on a network.
 *
 * **It has to exceed `THE_PROPAGATION_BOUND` and does, and the relation is stated because neither
 * number can see the other.** The hook waits up to two minutes for the origin to agree with itself
 * before it packs anything, so a hook timeout below that would cut the wait short and report it as a
 * timed-out hook - which is the one failure shape this file's header says must never happen, a file
 * made unstartable and its guards reported skipped. Five minutes leaves three for the archive.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    testTimeout: 300_000,
    hookTimeout: 300_000,
  },
})
