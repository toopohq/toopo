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

**Measured: `killed`, on `a-dirty-working-tree-is-refused-before-anything-is-measured`.** The guard
moved to `clean-tree.test.ts` is inside what the battery collects and the cell reddens it. The hole
ADR-0245 §5 named is closed rather than traded away, and the pin names every guard the cell reddened
under ADR-0076's line — which is two, because of §4 below.

**It is not *alone* and no guard of this battery can be**, for a reason that is the apparatus rather
than the cell: §4.

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

### 4. The red every cell carries, and it is the apparatus rather than a detection

`anchors.test.ts` requires every battery cell's `find` text to occur exactly once in the file it names.
A cell of *this* battery replaces that text in a file of `mutation/`, so while the cell is injected its
own anchor occurs nought times and the guard reddens — **on every one of the eleven, always, whatever
the defect is**. No other battery meets it, because no other battery collects that guard.

It is named in every pin rather than declared away, which is what `unclaimedRedsIn` asks for: *establish
which, then name it in the pin.* **What it costs is that no guard of this battery can ever be seen red
alone**, so the `alone` column is empty by construction here and the *never alone* bucket is not a debt
this battery can pay.

**And it is what nearly published a false kill.** MT-06 began as the white-space collapse of
`theSectionOn` and came back `killed` — on the anchor guard **and nothing else**. Killed by the
apparatus and by no guard, which is exactly the reading this instrument exists to refuse; the only
thing that said so was the attribution's *alone on MT-06*. Re-aimed at the population both root
documents count over, it reddens `every-figure-in-contributing-is-one-the-contracts-declare` and
`every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare` — two guards of the two
files it was written for.

### 5. The control was red before any cell ran, and the cause was the battery's own prose

MT-09 aims at `citationFaults`, which sweeps **every tracked file** for `ADR-\d{4}` and refuses a
citation naming no record. Its description carried such a citation as an illustration, so the first run
stopped at calibration with `the unmutated M/as-committed is red` naming
`every-decision-a-file-cites-exists`.

**The battery broke the guard it aims at, from its sentence rather than from its edit.** It is the
narrowest form of the self-reference this folder was expected to produce, it cost one run, and it is
written into the cell rather than quietly repaired — a battery over the instrument is measured by the
instrument's own guards, and its prose is inside their population.

### 6. What the battery reddened that nobody had asked it to

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

### 7. What the battery holds, measured

**Eleven cells, one arm, one lens, and the whole battery runs in 108 seconds** — measured end to end on
this machine at `e1eefe0`, calibration included, against ADR-0244's projection of *roughly 7 to 21
minutes* and a bound of 79. That projection was built on 9.2 s per cell across a population of
twenty-three; this battery's suite is the meta suite without `instrument.test.ts`, which is the cheapest
in the instrument.

Of the **96 guards it collects**: **15 redden**, of which fourteen are witnesses of a cell and one is
§4's structural companion; **12 are out of reach**, declared with the reason; and **69 are unprobed**,
declared by the file each lives in. Exit 0, every cell agreeing with its pin, nought unaccounted for and
nought unclaimed. `npm run predict` reads **24 batteries, 0 faults, 0 questions it could not ask**.

**Sixty-nine of ninety-six silent is the largest such declaration in the instrument, and it is stated
rather than smoothed**: the floor this unit set is one cell per collected guard file, so what a first
battery over this folder buys is a witness for the file and never for the guard. The two thirds are
where the next unit goes.

### 8. What it unblocks: eight of the nine, and the ninth is a correction to ADR-0244

That record wrote that **every one of the nine has a reader that would live in `mutation/`**. Measured
against the battery, it holds for eight and fails for one.

**The one it fails for is ADR-0243's deployment invariant.** Its guard would live beside
`workflows.test.ts`, whose subject is `.github/workflows/` and which imports nothing of this folder but
`THE_REPOSITORY` — so the only edit here that reaches it is one to where the repository root is, which
every guard of every file reads, and `mutants.ts` says a cell aims at a choice and never at a shared
mechanism. Its twelve guards are this battery's whole `unreachableGuards` entry. **It is a line of work
and not a refusal**: extracting the reader from the test file into a module of `mutation/` makes it
witnessable like the other eight.

**And one of the nine is not merely unblocked but already carries a cell.** ADR-0244 named `A_CITATION`
in `mutation/history.ts` as one of the three whose reader exists today; `MT-05` narrows it and reddens
`the-citation-sweep-reaches-the-prose-and-the-declaration`.

**The pair itself is the milestone.** This record's `confirmed-by` names `battery: meta`, which is what
ADR-0201 recorded as a pair that *cannot be formed here at all*.

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
* **No guard of this battery can be seen red alone**, §4's companion being red on every cell, so the
  *never alone* bucket gains fifteen members this battery can never empty.
* **A count in `run.ts` went stale and is left standing rather than repaired**: *the six configurations
  of this repository set `root` to their own folder* is seven of eight now. The constraint on this unit
  was that nothing in `run.ts` moves, and the sentence's argument — that narrowing is expressible only
  under the contracts' configuration — is unaffected by the number. It is named here rather than
  corrected in silence. `census.ts`'s copy of the same count was in the unit's reach and was corrected.

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
* **`workflows.test.ts`'s reader moving into a module of `mutation/`.** §8's one failure closes, the
  twelve leave `unreachableGuards`, and ADR-0243's invariant becomes a guard somebody can write.
* **The sixty-nine falling.** They are the whole of what this battery does not yet say, and the rate at
  which they fall is what would turn ADR-0244's *between about 30 and 95 cells* into a figure.

## More Information

* ADR-0244 established the absence and costed the battery; ADR-0245 refused the distinction, named the
  route and named this hole.
* ADR-0019 is the rule the moved guard's address follows; ADR-0076 is the line its pin is written under.
* `mutation/vitest.config.ts` carries the loop argument this configuration applies, and the measured red
  behind `fileParallelism: false`.
