---
status: accepted
date: 2026-09-07
governs:
  - CLAUDE.md
  - mutation/meta.battery.ts
  - mutation/under-measurement.vitest.config.ts
confirmed-by:
  - battery: meta
    guard: a-dirty-working-tree-is-refused-before-anything-is-measured
---

# The guard moved, and the instrument is measured by a battery

## Context and Problem Statement

ADR-0244 found that *no battery injects into `mutation/`* was an absence rather than a decision, stated
in fourteen places and decided in none, and named the single obstacle: `instrument.test.ts` calls
`calibrate` at module scope, so every cell of such a battery would come back killed by the dirty-tree
refusal rather than by a detection. ADR-0245 answered the question that posed — no predicate over a
tree can separate an injection in progress from a leftover mutant, and the route that works never runs
the guard, by excluding the one file that spawns cells. It costed that route and named its one hole:
`instrument.test.ts:1001` was the only guard over `assertCleanTree`, so a cell mutating the
instrument's own floor would be a survivor by construction.

**The owner ruled the second of the three options: move the guard, then take the battery.** Taking the
route as it stood would knowingly open a hole of the same family as the one the mechanism exists to
close.

**The move is not a unit of its own** and is not offered as one: alone it is a file changing places
with no demonstrable effect, which this repository does not take. It is the precondition of the
battery and it lives in the same unit, and the cell that reddens the moved guard is what says the move
did what it was for.

## Decision Drivers

* **The deciding cell is written first.** Killed means the move worked and the rest is ordinary work;
  survived means the hole was rebuilt in the act of closing it, and the unit stops there and says so.
* **A battery that reddens on nothing is the defect it exists to find**, so the count of cells is
  argued rather than left at one.
* **The sixth configuration must collect no file that spawns cells**, which is the loop
  `mutation/vitest.config.ts` refuses one suite over and the only reason this battery is possible.

## Considered Options

Not applicable to the move, which the ruling settled. What was chosen here is the shape of the
configuration, the address the moved guard gained, and which cells the battery carries.

## Decision Outcome

### 1. The cell that decides, and its verdict

`MT-02` narrows `assertCleanTree` to ask git about `contracts/` rather than about the tree:

    const dirty = git('status', '--porcelain', '--untracked-files=no', '--', 'contracts').trim()

**The defect is a narrowing rather than a removal, because a narrowing is what somebody would write.**
Scoping cleanliness to the folder under measurement is a plausible reading of what the check is for,
and it is exactly wrong: what the refusal has to see is dirt *outside* this run's folder — a mutant
left behind by an interrupted run of another battery, which is the state `run.ts:545` says nothing else
covers.

**Measured: `killed`, on `a-dirty-working-tree-is-refused-before-anything-is-measured` and on nothing
else.** The guard moved to `clean-tree.test.ts` is inside what the battery collects, the cell reddens
it alone, and the pin names it in full under ADR-0076's line. The hole ADR-0245 §5 named is closed
rather than traded away.

**Its failing direction is expensive, and that is a property of the guard rather than of the cell.**
Any mutant that falsifies the claim is one that lets `calibrate` past its first statement, at which
point it goes on to calibrate the fixture — two real suite runs — before returning and failing the
`toThrow`. The passing direction, which is every other cell, is one `git status` and a throw.

### 2. What moved, and the address it gained

The guard is `mutation/clean-tree.test.ts`, alone in a file, and the file is the decision. It spawns
nothing: `calibrate` opens on `assertCleanTree()`, before the stray-worktree check, the census and any
child process, and the guard dirties the tree on the line above the call — so on every cell but its own
the refusal fires at the first statement and no suite runs.

**It gained a kebab-case address in the move, because for the first time something addresses it.**
`assertGuardsAreAddressed` refuses a run whose guards cannot all be used as addresses, and a battery
pins by identifier. Measured over the twelve other files: **95 of 95 already carry an identifier and
none is duplicated**, so this was the only one to write — and the prose titles are exactly the file the
battery cannot collect.

### 3. The configuration, and the one file it excludes

`under-measurement.vitest.config.ts` collects `*.test.ts` and excludes `instrument.test.ts`. It is an
`exclude` and never a shorter `include`, and the difference is the failure mode: a hand-written list
would drop a fourteenth test file in silence, where excluding one file leaves the glob total, so a new
file is collected, is not in the census, and `assertTheCensusHolds` refuses the battery by name.

**`fileParallelism: false` is carried over and is load-bearing here for the same measured reason.** The
sibling configuration records a red on CI at `43f4626`: `anchors.test.ts` reads
`mutation/fixture/reference.ts` while another file rewrites it, and the reading landed inside the
injection. The rewriting moved with the guard — `clean-tree.test.ts` is what dirties that file now — so
the overlap is unchanged and so is the setting.

**A second spawning file would have to be excluded too, and there is not one.** Over the thirteen test
files, `instrument.test.ts` is the only one calling `calibrate`, `runBattery` or `runSuite`.
`selection.test.ts` spawns `print-which-batteries-to-replay.ts`, which is a reader; `verdict.test.ts`
names the machinery in comments; `attribution.test.ts` says in its own header that it lives outside
`instrument.test.ts` *because it is pure*.

### 4. What the battery reddened that nobody had asked it to

**Two guards of `selection.test.ts` are refuted by the battery's own existence, and both were right
about their subject and wrong about a second claim nobody had separated from it.**

`a-path-beside-a-folder-a-battery-injects-into-is-not-a-path-inside-it` asked for an empty selection
over `<contractPath>-notes.ts`. `meta` injects into `mutation/` and `fixture` into `mutation/fixture`,
so `mutation/fixture-notes.ts` is beside one folder and **inside** the other — the first time two
batteries' folders nest. The emptiness was carrying *no battery's folder contains another's*, which was
never this guard's subject. Restated per battery, the subject survives whole and the defect it exists
for still reddens it on every one of the twenty-four.

`a-change-to-a-declaration-left-to-its-own-rows-selects-nothing-and-is-reported` asked that
`mutation/census.ts` select nothing. It now selects `meta`, by the ordinary folder rule and correctly:
a row of that table decides what a cell of `meta` collects, so `meta` is the one battery for which the
census is not *already addressed to a folder*. What the exception buys — the other twenty-three not
running — is unchanged, and the guard reads that.

### 5. What it unblocks, measured rather than counted forward

ADR-0244 said all nine entries blocked by the witness gain one in principle and three could be aimed at
immediately. **What this record establishes is one of the nine and the mechanism for the rest**: its own
`confirmed-by` names `battery: meta`, which is the pair ADR-0201 recorded as one that *cannot be formed
here at all*.

## Consequences

* **The instrument is measured by a battery**, and the five refusals on the witness stop being a
  standing trade.
* **The hole ADR-0245 named is closed rather than accepted**: the guard over `assertCleanTree` is
  inside what the battery collects, and a cell reddens it.
* **A sixth configuration and thirteen census rows** are the price, exactly as costed.
* **Every path under `mutation/` now selects `meta`**, including every other battery's declaration, so
  a push touching the instrument pays this battery.
* **Two guards were repaired on claims they were carrying without stating**, which is this repository's
  own recurring class arriving through a new door.

## What would reopen this

* **A second file of the meta suite spawning cells.** The route rests on `instrument.test.ts` being the
  only one; at some count the excluded set stops being a declaration and becomes the suite.
* **`instrument.test.ts` ceasing to calibrate at module scope.** Its guards would enter the battery's
  reach and the exclusion would have nothing left to justify it.
* **A third battery whose folder nests inside another's.** §4's repair is exact over two; a third would
  be the moment to ask whether nesting is a shape this instrument wants at all.
* **A cell of this battery editing `mutation/fixture`.** `clean-tree.test.ts` restores that folder and
  the fixture's own calibration checks it out, so such a cell would read as a survivor of a defect that
  was never present.

## More Information

* ADR-0244 established the absence and costed the battery; ADR-0245 refused the distinction, named the
  route and named this hole.
* ADR-0019 is the rule the moved guard's address follows; ADR-0076 is the line its pin is written under.
* `mutation/vitest.config.ts` carries the loop argument this configuration applies, and the measured red
  behind `fileParallelism: false`.
