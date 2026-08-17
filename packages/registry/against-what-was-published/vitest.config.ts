import { defineConfig } from 'vitest/config'

/**
 * The freeze check over this catalogue, kept out of every battery so that nothing which replays can
 * depend on it. ADR-0107.
 *
 * **A configuration of its own rather than a file beside `frozen-for-life.test.ts`, and the reason is
 * the instrument rather than taste.** `registry-storage` declares `packages/registry/vitest.config.ts`
 * and runs it sixty times per replay. The guards below rebuild a past commit of this repository - a
 * `git worktree add`, a checkout and a child process each time - inside an instrument that is already
 * checking arms out and adding worktrees of its own. ADR-0102 cost a whole unit to isolate one
 * collision of that kind; asking for it again, sixty times, is the most expensive place this repository
 * has to be wrong in.
 *
 * **And the cheap reading of *it would be green anyway* is what makes it a trap.** `agreesWith`
 * tolerates an extra reddened guard when the pinned verdict is `killed`, and every one of
 * `registry-storage`'s fifty-nine cells is pinned `killed` today - so a freeze guard reddening on all
 * of them changes no verdict *this year*. The day that battery gains a survivor, an extra red turns
 * its verdict to `killed` and the replay reports a disagreement nobody can attribute to a defect. A
 * green that is correct for a reason nobody chose is a green that lies later.
 *
 * `packages/registry/vitest.config.ts` needs no exclusion to stay clear of this: its `include` is
 * `*.test.ts`, a single star does not descend, and this file sits one folder down. The shape is
 * `packaging/against-the-origin/vitest.config.ts`'s, for the same reason and with the same price -
 * what this suite catches is never measured by the instrument, and ADR-0107 states that rather than
 * leaving somebody to look for its cells.
 *
 * The timeout is the larger of the two this repository declares. A rebuild is a checkout and a node
 * process, about a second and a half apiece over a clone of this repository, and a machine that stalls
 * must not turn that into a defect that is not there.
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
