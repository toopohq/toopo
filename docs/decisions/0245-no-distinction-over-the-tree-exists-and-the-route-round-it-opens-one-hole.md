---
status: accepted
date: 2026-09-06
governs:
  - CLAUDE.md
confirmed-by: []
---

# No distinction over the tree exists, and the route round it opens exactly one hole

## Context and Problem Statement

ADR-0244 found that a battery over `mutation/` is stopped by one precondition: `instrument.test.ts`
calls `calibrate` at module level, `calibrate` calls `assertCleanTree`, and a battery injects by
dirtying the tree — so every cell would come back killed by the refusal rather than by a detection.

**One question follows, and nothing before it**: can a tree dirtied by an injection in progress be
distinguished from one dirtied otherwise, **without weakening the property `assertCleanTree` protects**?

That property is written at `run.ts:545`: a `finally` does not run when a process is signalled, so an
interrupted run leaves a mutant in the tree; if it is a survivor, `npm test` is green and the defect is
committable — *the only path this repository has that nothing else covers*, closed because **the next
battery run is already refused by `assertCleanTree`**. So what is wanted is a distinction and never a
tolerance: a guard that admits a little dirt reopens exactly the path it closes.

**Nothing is built here.** No battery, no `*.battery.ts`, no guard, and `assertCleanTree` and `run.ts`
are untouched. The ledger reads `18cc4e82…` on both sides.

## Decision Drivers

* **A floor is not repaired by lowering it.** Any relaxation is the defect, whatever it is called.
* **A channel an operator can open by hand is a hole with a name on it** — this repository's own words,
  in `http-source.ts`, about a parameter that would have selected an unsafe spelling.
* **Three outcomes and none is a failure**: a distinction, a route round it, or a wall written as a
  conclusion.

## Considered Options

* **A predicate over the tree** — refused below, by construction rather than by price.
* **A channel from the parent** — refused below, on this repository's own rule.
* **A route that never runs the guard in the child** — taken as the answer, and costed.

## Decision Outcome

### 1. The parent/child reading, corrected in one place and confirmed in the rest

**Confirmed**: `calibrate(battery)` is at module level at `instrument.test.ts:89` and nowhere else — the
other nine calls are inside `expect(…)`. So the refusal fires at load and the whole file collects zero
tests, which is what the measurement showed.

**Corrected**: *the child does not know what the parent did* is false as a mechanical statement. The
suite is spawned at `run.ts:1105` with `env: { ...process.env, TZ: battery.timeZone }` — **the child
inherits the parent's entire environment**, so the parent can tell it anything it likes.

**And that is exactly why it settles nothing.** A variable the parent can set is one an operator can
set, and this repository has already refused that shape in as many words: *the unsafe spelling is not
offered … a parameter selecting it is a hole with a name on it.* The channel exists and is worthless,
which is a sharper statement than the channel not existing.

### 2. No predicate over the tree can work, and the reason is construction

**The two trees are produced by one code path.** A leftover mutant and an injection in progress are both
`applyEdits` having run; they are byte-identical, and no predicate over `git status` accepts one and
refuses the other. What separates them is whether a process is still alive, which is not in the tree —
the reading in front of this unit, confirmed.

**And the one tree-predicate that looks clever destroys the property exactly.** A rule admitting *a tree
carrying precisely one declared mutant of one declared battery* is derivable with no channel at all:
`THE_BATTERIES` holds every `find`/`replace`, and `check-anchors` already requires each `find` to occur
once. It would also admit, by definition, the interrupted-run state — a declared mutant sitting in the
tree — which is the single state `run.ts:545` says nothing else covers. **The cleverest form of the
distinction is the relaxation, and it arrives wearing the shape of a proof.**

**So outcome 1 does not exist**, and it does not exist for a reason of construction rather than of
price: no amount of work makes two identical trees different.

### 3. Outcome 2 exists, it never touches the guard, and the repository already argues for its shape

**The obstacle is one file, and only one.** Measured: with a semantically null edit in the tree,
`npm run meta` reports `instrument.test.ts (0 test)` and **12 files, 95 of 95 passing**. And of the
thirteen, **only `instrument.test.ts` spawns cells** — `selection.test.ts:217` spawns
`print-which-batteries-to-replay.ts`, which is a reader, and `verdict.test.ts` names the machinery in
comments alone.

**The reason for excluding it is already recorded**, and ADR-0244's sweep did not surface it because it
lives in a configuration header rather than in a record. `mutation/vitest.config.ts` opens:

> The contracts' suite is run once per cell by the instrument, so **putting guards that themselves spawn
> cells inside it would be a loop**.

That argument applies verbatim to a battery over `mutation/`: such a battery runs the meta suite once
per cell, and the meta suite holds a guard that spawns cells. **So excluding `instrument.test.ts` is not
an exemption invented for this unit — it is the shape this repository already argues for, one folder
over.** It corrects ADR-0244 by completion rather than by contradiction: no record refuses the battery,
and a configuration header refuses the loop.

### 4. What that route costs, chiffré and not taken

**A sixth configuration is required, and neither existing shape avoids it.**
`theFilesToCollect(battery)` is `[\`${battery.contractPath}/\`]` with no config and **`[]` with one**, so
a battery naming a config lets that config's `include` decide and a battery naming none passes a folder
filter. Neither excludes one file. So the battery declares a new configuration whose `include` is the
twelve, and `censusFor(battery.vitestConfig, battery.contractPath)` **refuses a configuration nobody has
counted** — a refusal that has fired on the first unit to reach it, four times by that file's own count.
The census gains a sixth configuration and twelve rows.

**The 48 guards of `instrument.test.ts` are declared rather than lost.** `unreachableGuards` is this
repository's vocabulary for a guard a battery cannot redden, and they are exactly that — they were
already unmeasurable under any shape, so the route costs nothing there that ADR-0244 had not counted.

**The time was measured in ADR-0244 and is unchanged**: the measuring suite is 8.59 s against 36 s with
that file, against a per-cell figure of 9.2 s across 1 032 cells of one run.

### 5. What it lets through that did not pass before, which is one thing and is precise

**`instrument.test.ts:1001` is the only guard over the dirty-tree refusal**:

    expect(() => calibrate(battery)).toThrow(/the working tree carries uncommitted changes/)

So under this route **the sole guard over `assertCleanTree` sits in the excluded file**. Three
consequences, in order of severity:

* **A cell that mutates `assertCleanTree` is a survivor by construction.** Nothing in the twelve reddens
  it, so the battery would publish it as a surviving mutant — a defect in the instrument's own floor,
  recorded as one no guard catches, which is true of the battery and false of the repository.
* **Left behind by an interruption, that survivor disarms the next run.** It is `run.ts:545`'s own path —
  a surviving mutant, a green `npm test`, a committable defect — and the thing that closes it there is
  the next run's `assertCleanTree`, which is the very function the mutant sits in. **The battery would
  make the instrument's floor reachable through the instrument.**
* **Everything else about the guard is untouched.** `npm run meta` still runs `instrument.test.ts` under
  the full configuration on every push, so the gate is unchanged; what changes is only what the battery
  can see.

**And the hole is closable, at a price this unit may not pay.** The dirty-tree guard does not need to
live beside a module-level `calibrate`: it calls `calibrate` inside `expect`, and with a dirty tree that
call throws *before* it spawns anything. Moved to a sibling file that spawns no cells, it would sit in
the battery's twelve and the cell would be killed rather than survive. That is **one guard moved between
two files**, and moving a guard is what this unit is forbidden.

### 6. The arbitration, put rather than taken

The route is not a weakening of `assertCleanTree` and it opens one hole of the same family, whose
closure is one guard moved. **Whether that trade is taken is the owner's**, and it is put here with what
it costs rather than with a recommendation:

* **Take it as it stands** — nine entries gain a witness, and the instrument's own floor is measured by
  a battery that cannot see the guard protecting it.
* **Take it with the guard moved first** — the same, with the hole closed, at one file's worth of
  motion in `mutation/` and a census row.
* **Leave it** — five refusals on the witness become six, and this record is what the sixth would have
  to answer.

## Consequences

* **The distinction is refused as a conclusion and not as a difficulty**: two trees produced by one code
  path cannot be told apart by a predicate over trees.
* **The channel is refused on this repository's own rule** rather than on its absence — it exists, at
  `run.ts:1105`, and an operator can write to it.
* **The obstacle is one file rather than the folder**, and the argument for excluding it was already
  written for another suite.
* **The route has one named cost and it is not a relaxation**: the only guard over `assertCleanTree`
  would be outside what the battery can see.
* **ADR-0244 is completed rather than corrected**: it swept records and the reason lives in a
  configuration header.

## What would reopen this

* **The dirty-tree guard moving out of `instrument.test.ts`.** §5's hole closes and the arbitration in
  §6 loses its middle option, becoming a straight yes or no.
* **A second guard of the meta suite spawning cells.** The route rests on `instrument.test.ts` being the
  only one; a second would have to be excluded too, and at some count the excluded set stops being a
  declaration and becomes the suite.
* **A shape that admits a file filter beside a configuration.** `theFilesToCollect` answers `[]` when a
  config is named; if a battery could name both, no sixth configuration would be needed and §4's price
  falls to the census rows alone.
* **An interruption on this repository leaving a mutant in `mutation/`.** It would be the first instance
  of §5's second consequence, and it would move the arbitration from a cost to a defect.

## More Information

* ADR-0244 costed the battery and named this precondition; this record answers the question it left.
* `run.ts:545` states the property, `run.ts:1105` the environment the child inherits, and
  `mutation/vitest.config.ts` the loop argument §3 turns on.
* ADR-0206 is where *a hole with a name on it* was written, about a parameter selecting an unsafe
  spelling.
