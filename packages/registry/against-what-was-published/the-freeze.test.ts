import { describe, expect, it } from 'vitest'

import { theLocalLedger } from '../local-read-api.js'
import { bindingsOf, rebindingFaults, unanchoredBindings } from '../rebinding.js'
import { bindingsAtRevision } from '../rebuild.js'
import { REPOSITORY_ROOT } from '../serialise.js'

/**
 * What this repository published, still produced by this repository. ADR-0107.
 *
 * ---------------------------------------------------------------------------
 * The one thing here that is not a comparison in memory
 * ---------------------------------------------------------------------------
 *
 * `rebinding.test.ts` proves the rule with the past supplied - a map handed in, so the comparison and
 * the rebuilding fail apart. `rebuild.test.ts` proves the reader on a toy repository built to be
 * published from and edited. `frozen-for-life.test.ts` proves both on a clone of this catalogue with
 * commits made into it.
 *
 * **None of the three asks the question about this catalogue at this commit**, and that question is the
 * whole of permanent rule 6: the four contracts published at `15aeb6c` are bound to four digests, and
 * this tree either still produces them or the addresses have been rebound. Nothing here is a fixture.
 * The subject is the working tree, the past is a commit in this repository's own history, and the
 * comparison is between what somebody promised and what they are shipping.
 *
 * ---------------------------------------------------------------------------
 * Why it is not in the registry's suite, which is where it looks like it belongs
 * ---------------------------------------------------------------------------
 *
 * `vitest.config.ts` beside this file carries the argument at length. The short of it: the registry's
 * suite is replayed sixty times by `registry-storage`, these guards spawn a checkout and a process
 * each, and the instrument is already managing worktrees of its own - the collision ADR-0102 spent a
 * unit isolating. And the reading that says *the verdicts would hold anyway* is true this year and
 * false the year `registry-storage` gains a survivor, because `agreesWith` stops tolerating an extra
 * red the moment a cell is pinned `survived`.
 *
 * **The price is stated here and not discovered.** No mutant of this repository ever reddens the two
 * guards below, so their detecting power is not measured by the instrument. That is the same price
 * `packaging/against-the-origin/` pays, accepted for the same reason, and what stands in its place is
 * the same thing: they were seen red on their real conditions, and the reds are in ADR-0107.
 */

const theFaults = (): readonly string[] =>
  rebindingFaults(theLocalLedger(), (revision) => bindingsAtRevision(REPOSITORY_ROOT, revision))

describe('what this repository published, against what it produces today', () => {
  /**
   * Every published binding, rebuilt at the commit it records, still equal to what this tree makes.
   *
   * The faults are asserted whole rather than counted: `faultFor` has two arms - a digest that moved,
   * and a coordinate naming a commit that binds no such address - and they are different defects
   * wearing each other's clothes. A count would be satisfied by either.
   */
  it('every-published-binding-still-hashes-to-what-it-was-published-as :: the freeze holds', () => {
    expect(theFaults()).toEqual([])
  })

  /**
   * And nothing left the check by the door it opens for itself.
   *
   * **This is the guard `the-five-anchor-nothing-and-the-check-says-which` turned into.** For as long
   * as nothing was published, `isAnchored` put every binding of this tree outside the comparison, so
   * the guard above was computed over an empty set - the shape of a check that goes green for ever and
   * is read by nobody until the day it is needed. That guard asserted the emptiness from the other
   * side, and wrote in its own comment that it would redden the day somebody published.
   *
   * Somebody published. It reddened, and this is what it became: the population it named as
   * unreachable is now empty, and the population the check runs over is every binding this tree mints.
   * A binding falling back to `THE_UNPUBLISHED_REVISION` would drop silently out of the guard above,
   * and reddens here instead.
   */
  it('nothing-this-tree-binds-escapes-the-freeze-check :: the population is every binding', () => {
    const ledger = theLocalLedger()

    expect(unanchoredBindings(ledger)).toEqual([])
    expect(bindingsOf(ledger).size).toBeGreaterThan(0)
  })
})
