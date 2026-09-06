---
status: accepted
date: 2026-09-06
governs:
  - CLAUDE.md
confirmed-by: []
---

# Nobody ever refused a battery over the instrument, and the obstacle is one guard

> **Completed rather than corrected: a reason exists and it is not in a record.** This record swept
> `docs/decisions/`, `CLAUDE.md` and the tree for *no battery injects into `mutation/`* and found the
> fact fourteen times with no reason attached. `mutation/vitest.config.ts`'s own header carries one, for
> a neighbouring question: *the contracts' suite is run once per cell by the instrument, so putting
> guards that themselves spawn cells inside it would be a loop.* **That refuses a configuration shape
> and not the folder** — so §1's finding stands, and what it missed is that the argument for excluding
> `instrument.test.ts` was already written, one suite over, by somebody solving the same loop. It is
> what makes the route round the obstacle the repository's own shape rather than an exemption.
> [ADR-0245](0245-no-distinction-over-the-tree-exists-and-the-route-round-it-opens-one-hole.md).

## Context and Problem Statement

Five times this repository has refused a guard because no battery can redden it, and **nine entries of
the open list are blocked by that one reason**. The sentence behind all of them is that the meta suite
is where every claim about this repository's own files has to live, and it is the one folder the
instrument does not measure.

**The first question is whether that is a decision or an absence**, because a recorded refusal has a
reason and that reason is the price, while an absence nobody interrogated has none — and the two lead to
completely different units.

**Nothing is built here.** No battery is written, no `*.battery.ts` file is created, no guard is added.
The ledger reads `18cc4e82…` on both sides.

## Decision Drivers

* **A plausible reason is not a recorded one.** If no record refuses it, that is the result, and filling
  the gap with an argument nobody made would be inventing the decision this unit exists to look for.
* **The self-reference objection is folklore until it is measured.** It has a testable form: which parts
  of `mutation/` are read while a replay runs.
* **A cost that makes the bound untenable is an answer**, and a better one than a battery nobody dares
  launch.

## Considered Options

Not applicable: nothing is chosen. What is established is the **status** of the exclusion, its real
obstacle, and what a battery would cost.

## Decision Outcome

### 1. It is an absence, and no record refuses it

**Fourteen places state the fact and not one gives a reason.** Swept over `docs/decisions/`, `CLAUDE.md`
and the tree: *no battery injects into `mutation/`* appears in **ADR-0001, ADR-0109, ADR-0113, ADR-0149,
ADR-0152, ADR-0174, ADR-0199, ADR-0200, ADR-0201, ADR-0228, ADR-0240, ADR-0241, ADR-0243**, in five
entries of `CLAUDE.md`, and in `mutation/contributing.test.ts`. Every one of them **cites it as a
constraint they are subject to**. None decides it.

**ADR-0001 is the discriminator, and it puts `mutation/` on the undecided side in its own sentence.** It
is the one record that separates a designed exclusion from an undesigned one:

> `meta` came first: `readme.test.ts` and `contributing.test.ts` have been guards for as long as
> `mutation/` has existed, no battery injects there … ADR-0104 added `origin` for the same reason on a
> second folder, **and there the unaddressability is *designed*: that suite is kept out of every battery
> on purpose**.

So `origin` carries a recorded refusal and `meta` does not. **ADR-0104's reason is real and specific**:
that suite reaches a live host, a battery would run it at least seven times per replay, and it would add
a checkout and a second installation on a repository where the minutes are metered. **No sentence of
that kind exists for `mutation/`.**

**And the line that reads like one is about something else.** ADR-0001 cites
`packages/registry/verifiability.ts` — *the instrument measures the catalogue and is not part of it* —
and read in place, that clause is about **a reader resolving a mutant citation from a served response**,
in a field whose subject is what the registry publishes. It is not an argument against a battery, and
using it as one would be reading a sentence into a population it was not written for.

**ADR-0201 goes further than not refusing it**: it writes *none can be written until that changes*,
which treats the absence as a state to be moved rather than a decision to be kept.

### 2. The self-reference is real, it has a frontier, and it is not the obstacle

**The frontier is already declared and already derived.** `WHAT_A_RUN_OF_ANY_BATTERY_READS` in
`mutation/selection.ts` names the eight files a run of any battery reads, six of them in `mutation/`:
`attribution.ts`, `census.ts`, `measure.ts`, `mutants.ts`, `paths.ts`, `run.ts`. It is derived by a walk
and held by a guard that refuses to disagree with it, and ADR-0149 published its own blind spot — a
templated `import()` is invisible to the walk.

Measured over the folder:

| | files | lines |
| --- | --- | --- |
| battery declarations | 23 | 20 986 |
| test files | 13 | 4 167 |
| other modules | 24 | 6 894 |
| — **read by a run of any battery** | **6** | **3 385** |
| — not on that path | 18 | 3 509 |

So **a quarter of the modules, and about half their lines, are the hazard**; the other eighteen are
ordinary code under measurement. `selection.ts` already says the self-measuring half is wanted rather
than feared: *it also measures itself — editing `cli-install.battery.ts` changes what the instrument
claims about `packages/cli`, and a claim nobody replays is the thing this whole folder exists against.*

**But the obstacle is not there. It is one guard, and it is measured.** A battery injects by editing the
working tree, and `instrument.test.ts` calls `calibrate`, which calls `assertCleanTree`. Injected into an
**off-path** module — two comment lines, semantically null, that no guard in this repository can read —
`npm run meta` answers:

    ❯ instrument.test.ts (0 test)
    Error: the working tree carries uncommitted changes, so a restore would destroy them
    Test Files  1 failed | 12 passed (13)
          Tests  95 passed (95)

**Every cell of such a battery would come back killed, and none of them would have measured anything.**
The kill is `instrument.test.ts` refusing a dirty tree, not a guard detecting a defect — a battery whose
every cell is a false kill, which is *a guard that cannot fail* one floor up and inside the instrument
that exists to find those.

**So the danger everybody assumes is not the one that stops it.** The self-reference has a boundary and
eighteen modules sit safely outside it; what stops it is a single precondition, and whether that
precondition can be scoped, suspended for an injected run, or excluded by configuration is a design
question — the owner's, and not one this unit takes.

### 3. What the battery would cost

**`contractPath: 'mutation'`, and a `vitestConfig` the census counts.** `calibrate` reads
`censusFor(battery.vitestConfig, battery.contractPath)` and `instrument.test.ts` **refuses a
configuration nobody has counted** — seen red there deliberately. So `mutation/census.ts` gains a
fourteenth folder and thirteen rows. **And `census.ts` is one of the six on the run path**, so the
census counting the instrument is the self-reference arriving at the first step rather than at the last.

**What would kill its mutants is the meta suite minus `instrument.test.ts`: 95 guards of 143.** That
file holds **48** — a third of the suite, and the largest single file in it — and under any injected
mutant it collects **0 tests**. Those 48 are unmeasurable by construction, not by omission.

**The time is measured and it is not the obstacle.** Across the twenty-three batteries of run
`34025610658` — one run, one runner class, one commit — **1 032 cells over 9 469 job seconds, 9.2 s per
cell**, ranging from **1.3 s** on `number-parse` to **34.7 s** on `cli-search`. The spread is a factor of
27, so per-cell is not a constant and what dominates is the suite's own runtime, which is ADR-0199's rule
holding on a fresh population. The meta suite without `instrument.test.ts` runs in **8.59 s** against
**36 s** with it, so a battery here sits near the cheap end of that range. At the population's own density
— `packaging` answers 24 guards with 20 cells, `site` 190-odd with 172 — 95 guards is somewhere between
about 30 and 95 cells, and at that runtime **roughly 7 to 21 minutes against a bound of 79**. **The
bound is not what refuses this.**

### 4. What it unblocks: all nine in principle, three today

**Every one of the nine has a reader that would live in `mutation/`**, so the battery gives all nine a
witness where they have none. Three of them name readers that **already exist**, so a cell could be
aimed at them the day the battery exists: `A_CITATION` in `mutation/history.ts` for an identifier written
bare, `guardsCollectedIn` in `mutation/decisions.ts` for a decision naming a per-contract guard, and
`refusedAddressFaults` in `mutation/history.ts` for a file naming the machine it was written on. The
other six need their guard written first, which is circular and is exactly the deadlock: the witness is
what the guard was refused for.

**What the battery does not buy is the aiming**, and that is worth saying because it is where the count
would otherwise be overstated. A cell must make a guard's answer *wrong* rather than *empty* — a reader
broken into finding nothing leaves its guard green, which is `GUARD_PERTURBATION_RULE` and the
false-only region ADR-0141 named. Whether each of the ninety-five has a plausible such edit is a
per-guard reading this repository prices at about **1.3 candidate runs per cell** over five slices, and
it is not settled here.

## Consequences

* **The exclusion is an absence and not a decision**, established over fourteen citations and one
  contrast, so a unit that takes it is repairing an oversight rather than overturning a judgement.
* **The self-reference has a measured frontier** — six modules of twenty-four — and it is not what stops
  a battery.
* **One precondition is what stops it**, and it is named: `assertCleanTree`, reached from
  `instrument.test.ts`, which turns every cell into a false kill.
* **The time is not the obstacle**, which is a negative result and the one that would otherwise have
  been assumed.
* **Nine entries would gain a witness and three could be aimed at immediately**; the remaining six carry
  an aiming cost this repository has measured five times.

## What would reopen this

* **A ruling on `assertCleanTree`.** Scoped, suspended for an injected run, or a configuration that
  excludes `instrument.test.ts` — each is a different battery and a different set of guards under it,
  and choosing between them is a unit of its own.
* **A per-guard reading of the ninety-five.** This record bounds what the battery reaches and does not
  say how many of them have a plausible cell; that reading is what would turn *between about 30 and 95
  cells* into a figure.
* **A sixth refusal on the witness.** Five is now a property rather than a series; a sixth taken without
  reference to this record would mean the absence has been re-established as a decision by repetition,
  which is the thing this unit found had never happened.
* **`instrument.test.ts` ceasing to calibrate.** Its 48 guards are unmeasurable only because they run a
  battery; a file that read the instrument without running it would be measurable like any other.

## More Information

* ADR-0001 separates a designed exclusion from an undesigned one and is the whole of §1; ADR-0104 is the
  refusal that exists, for `origin`.
* ADR-0149 derived `WHAT_A_RUN_OF_ANY_BATTERY_READS`, which is the frontier §2 measures against.
* ADR-0199 is the rule §3's per-cell spread confirms; ADR-0241 classified the nine entries §4 counts.
