import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { calibrate } from './run.ts'
import { THE_INSTRUMENT_FOLDER, THE_REPOSITORY } from './paths.ts'
import { battery } from './fixture.battery.ts'

/**
 * The instrument's floor: it refuses to measure a working tree that is not what git says it is.
 *
 * **One guard, in a file of its own, and the file is the decision.** It stood in `instrument.test.ts`
 * until ADR-0246, where it was correct and unmeasurable. That file calls `calibrate` at module scope,
 * so it spawns cells; a battery over `mutation/` runs the meta suite once per cell, and a suite holding
 * a guard that spawns cells is the loop `vitest.config.ts` refuses one folder over - *the contracts'
 * suite is run once per cell by the instrument, so putting guards that themselves spawn cells inside it
 * would be a loop.* So `instrument.test.ts` is outside what such a battery collects, and this guard,
 * left inside it, would have been the one guard over `assertCleanTree` sitting where no cell could
 * redden it: a mutant of the instrument's own floor, published as a survivor, and - left in the tree by
 * an interruption - disarming the next run. `run.ts` states that path and states that the next run's
 * `assertCleanTree` is what closes it.
 *
 * **What makes the move legal rather than convenient is that this guard spawns nothing, and it is a
 * property rather than a hope.** `calibrate` opens on `assertCleanTree()`, before the stray-worktree
 * check, before the census and before any child process. The tree is dirty when the call is made -
 * this guard makes it so on the line above - so the refusal fires at the first statement and the call
 * returns without a suite ever running. The one condition under which it *does* spawn is the mutant
 * this guard exists to catch, and on that cell it is red.
 *
 * **The dirt is written here rather than assumed**, and that is what makes the guard read the same
 * inside a battery and outside one. Run by hand the tree is clean, so nothing but this line would make
 * the refusal fire; run as a cell the tree already carries the injected mutant, and the refusal would
 * fire whether this line existed or not. Writing it covers both, and neither reading is a different
 * guard.
 *
 * **Scoped to `mutation/fixture`, in both directions.** The dirt is a file of the fixture and the
 * restore names that folder, so a cell's own injected mutant - anywhere else under `mutation/` -
 * survives this guard untouched. No cell of the battery over this folder may edit `mutation/fixture`,
 * and `meta.battery.ts` says so where a cell is written.
 *
 * **It gained an address in the move, because for the first time something addresses it.** A battery
 * pins the guards a cell reddens by identifier, and `assertGuardsAreAddressed` refuses a run whose
 * guards cannot all be used as addresses - so a prose title, which is what this guard carried inside
 * `instrument.test.ts`, is not merely untidy there. Measured at that file's own commit over the twelve
 * others: **95 of 95 already carry a kebab-case identifier and none is duplicated**, so this was the
 * only one to write, and the prose titles are exactly the file the battery cannot collect. ADR-0019 is
 * the rule; the sentence after ` :: ` is the one that stood above the assertion before.
 */

/**
 * Its own bound, for the reason `instrument.test.ts` declares one: the failing direction of this guard
 * spawns a real calibration of the fixture, so its verdict can depend on elapsed time. Measured, the
 * passing direction is milliseconds - one `git status` and a throw - and the failing one is the
 * fixture's two suite runs.
 */
const A_CALIBRATION_MAY_TAKE_MS = 60_000

describe('the instrument refuses a tree that is not what git says it is', () => {
  it(
    'a-dirty-working-tree-is-refused-before-anything-is-measured :: an arm is a git ref materialised ' +
      'over the tree, so a run on a dirty one would destroy uncommitted work and measure an arm that ' +
      'is not the commit it claims to be',
    () => {
      // Arms are git refs and the instrument materialises them by checking out over the working
      // tree, so measuring a dirty tree would both destroy the operator's uncommitted work and
      // measure an arm that is not the commit it claims to be.
      const path = join(THE_INSTRUMENT_FOLDER, 'fixture', 'reference.ts')

      try {
        writeFileSync(path, `${readFileSync(path, 'utf8')}\nexport const dirt = 1\n`)

        expect(() => calibrate(battery)).toThrow(/the working tree carries uncommitted changes/)
      } finally {
        execFileSync('git', ['checkout', 'HEAD', '--', 'mutation/fixture'], { cwd: THE_REPOSITORY })
      }
    },
    A_CALIBRATION_MAY_TAKE_MS,
  )
})
