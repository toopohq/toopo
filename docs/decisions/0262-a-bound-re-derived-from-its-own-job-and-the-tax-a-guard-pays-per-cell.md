---
status: accepted
date: 2026-09-09
governs:
  - .github/workflows/suites.yml
  - mutation/census.ts
  - packages/registry/local-read-api.ts
  - CLAUDE.md
confirmed-by: []
---

# A bound re-derived from its own job, and the tax a guard pays once per cell

> **This record writes no contract, moves no digest and touches nothing under `contracts/`.**
> `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing here reaches npm, and the ledger is `18cc4e82…` at
> 1 206 bytes either side with `pnpm freeze` at 3 passed.

## Context and Problem Statement

ADR-0222 derived the two ubuntu gates at 79 minutes and named its own first reopening trigger: *a
battery growing past the new bound*. It fired six days later. `batteries (registry-storage)` was
killed at **79 min 21 s** on `5939df3` — `cancelled` and not `failure`, which `every-job-answered`
turned into a red job exactly as that record wrote, its first real instance — and the repair that
followed brought the job back under the bound at 4 440 s, which leaves **5 min 00 s** of margin where
the last completion before the unit had left 11 min 34 s.

Nobody decided that margin. So the question is not whether the number is comfortable; it is whether
the derivation still holds. ADR-0222 did not choose 79, it computed it from three terms, and every one
of the three has moved: the battery holds 239 cells where it held 230, a cell replays a suite of 486
tests where it replayed 466, and — the term nobody had looked at — the spread was **borrowed from
another battery** because this one had a single uncensored reading, taken on a throwaway branch.

**The second half of the unit is the price that crossed the bound in the first place.** ADR-0261 added
three guards to `packages/registry` that each rebuilt the whole ledger — 809, 707 and 508 ms — and
2 024 ms of suite time is **484 s of runner** at 239 cells, which is what took the battery past its
bound. Nothing anywhere says that a guard's own duration is multiplied by a battery's cell count, and
the person who pays it is the person writing the guard, who has no way to find out.

## Decision Drivers

* A bound is a blockage detector and never a budget, so it is placed above the worst plausible healthy
  run rather than near the median.
* ADR-0169's property decides the form before the number: **a derivation that moves in response to a
  faster run is broken.**
* ADR-0199's rule — a bound extrapolated from one member of a population states the cost of that
  member — had been applied to the base and never to the spread.
* A price a person meets at the moment of acting is kept; a price in a record is not. That is the same
  lesson as the heredoc and the tree during a replay.

## Considered Options

* **Lift the number.** Refused: ADR-0222 derived it, so choosing where somebody derived would replace a
  measurement with a preference.
* **Leave it.** Refused: it keeps a margin that fell from 11 min 34 s to 5 min 12 s with nobody
  deciding anything, which is the entry of `CLAUDE.md` this record exists inside.
* **Re-derive it, and take the direction whatever it is.** Taken.

## The readings, and where each comes from

**The population is eight readings of this job on `main`**, read off the Actions API and off each
job's own log. The cell count is the battery's own printed column, never a count of the source: a
regular expression over `mutation/registry-storage.battery.ts` answers 212 where the column answers
239, and publishing the regular expression's figure would have understated the multiplier by 11 %.

| | cells | control | job | per-cell median |
| --- | --- | --- | --- | --- |
| `0f5da44` | 118 | 466 | 2 149 s | 17.73 s |
| `6d03933` | 163 | 466 | 2 389 s | 13.48 s |
| `71c85d6` | 231 | 472 | 2 371 s | 10.08 s |
| `98aba43` | 231 | 472 | 4 056 s | 17.46 s |
| `eee980f` | 235 | 482 | 4 014 s | 16.99 s |
| `807be8b` | 235 | 482 | 4 046 s | 17.12 s |
| `5939df3` | 239 | 486 | 4 761 s, killed | 19.66 s |
| `db9e20d` | 239 | 486 | 4 440 s | 18.36 s |

**The per-cell median is taken off the timestamps of the job's own log**, one reading per pair of
consecutive cell verdicts. It is the unit that disarms the trap ADR-0222 named: that record refused
`max/median` over this battery's job totals because the ratio measured the growth in cells rather than
the runner, and per cell there is no growth left in it. **So this battery may be its own population,
where ADR-0222 had to borrow.**

**What the spread measures is the runner, and that is measured paired rather than inferred.**
`71c85d6` and `98aba43` hold **231 cells and a 472-test control apiece** — identical work — and read
2 371 s and 4 056 s. Matched cell by cell over 193 of them the ratio is **p10 1.65, median 1.73, p90
1.77**: every cell was slower, uniformly, under the same `ubuntu-latest` label. The steps say the same
from the other side — the checkout, the two setups and the install are 13 to 17 s in every reading, so
the job *is* the battery and none of the difference is the tooling.

**One correction the readings do not carry is stated rather than smoothed.** `5939df3`'s 19.66 s
includes about 1.3 s of guard cost that `db9e20d`'s memo removed, so as a reading of *today's* suite it
is generous. It is kept: a bound may be conservative, and correcting it would be the only unmeasured
step in the derivation.

## Decision Outcome

**The bound is re-derived and it rises, 79 to 92 minutes.**

    base       239 cells x 17.29 s a cell   =  4 132 s
    spread     x 1.137                      =  4 699 s
    growth     + 41 cells x 19.66 s         =  5 505 s  =  91.8 minutes  ->  92

* **base** — 239 is the battery's own column at `db9e20d`; 17.29 s is the median of the eight per-cell
  medians above.
* **spread** — 19.66 / 17.29, which is ADR-0169's `max/median` over that same population. It is
  **1.137** against the 1.042 ADR-0222 borrowed from `site`, and that is the largest single cause of
  the movement.
* **growth** — 41 cells, ADR-0169's convention for the Windows leg carried unchanged, priced at the
  **tail** rather than at the typical, because headroom that only survives at the typical rate is not
  headroom.

**The form matters more than the number, and it is why the terms are written this way.** `base x
spread` is `cells x median x (max / median)`, so the median cancels and the product is `239 x 19.66`.
A faster reading therefore leaves the bound exactly where it is; the median survives only in the
growth term, where a faster reading *tightens* it. That is ADR-0169's property held in both
directions, which `max/median` over job totals does not manage — appending a fast reading there lowers
the median and raises the bound, which is the failure that record refused `max/min` for, one decimal
place down.

**92 rather than 90** because 5 505 s is 91.8 minutes and a bound rounded down sits below its own
derivation, and because an hour and a half reads as chosen where 92 reads as derived — ADR-0205's
reason for 60 060.

**What it lands on.** 1.24× the measured job of `db9e20d`, against ADR-0222's 1.22×, holding **57
cells** over it where that record held 50. The bound it replaces held **26 seconds** over a healthy
run and killed it.

### The movement decomposed, because *it went up* is not a finding

| | s |
| --- | --- |
| nine more cells, at 17.29 s | +156 |
| a dearer cell, 16.90 → 17.29 s | +93 |
| the spread stopping being borrowed, 1.042 → 1.137 | **+393** |
| headroom priced at the tail rather than at the base's own rate | +113 |

**Two thirds of the rise is one term, and it is the term ADR-0222 could not measure.** That record's
1.042 was `site`'s, taken because `site` was the one battery whose work had not moved over its window;
this battery's own answer is 1.137, which is 3.3 times as much in excess over 1. It is ADR-0199's rule
arriving on the spread rather than on the base — and the reading that says so most sharply is not the
ratio at all but the paired 1.73 between two runs of identical work.

## The tax, and where it is written

**A cell replays the whole suite, so a guard's own duration is paid once per cell of every battery
that collects it.** The multiplier is neither a property of the guard nor of the instrument: it is the
cell count of the folder the guard lands in.

| folder | batteries | cells |
| --- | --- | --- |
| `packages/registry` | `registry-storage` | **239** |
| `packages/site` | `site` | 172 |
| `packages/cli` | `cli-install`, `cli-update`, `cli-remove`, `cli-search` | 149 |
| a contract folder | its two batteries | 28 to 82 |
| `packages/validation` | `validation-stage-1` | 21 |
| `packaging` | `packaging` | 20 |
| `mutation` | `meta` | 15 |

**So yes, it is measurable per battery, and `packages/registry` is the dearest place in this repository
to write a guard** — 1.4 times the site and 1.6 times the client, whose figure is a sum over four
batteries. That is ADR-0206's *a new guard is answered for as many times as it is collected* arriving
on wall clock rather than on answers. Add two to any row for the control and the calibration mutant.

**It is confirmed on a runner rather than reasoned about, and the pair is exact.** `5939df3` and
`db9e20d` hold the same 239 cells and the same 486-test control, and the memo is the only thing between
them: the per-cell median went **19.66 s to 18.36 s** and the job went **4 761 s to 4 440 s**. So
roughly 1.2 s of local suite time was worth **321 seconds of runner**, and it is what took the battery
past its bound.

**Where it is written is decided by a measurement rather than by taste.** It is in the header of
`mutation/census.ts`, beside the price in *edits* that section already states — the file
`assertTheCensusHolds` sends somebody to at the moment they add a guard, and the one member of
`WHAT_A_RUN_OF_ANY_BATTERY_READS` the selection deliberately answers nothing for, so writing there
costs no replay. **The derived form is priced and refused**: `assertTheCensusHolds` knows the battery
and its mutant count, so the refusal could print the multiplier — and it lives in `run.ts`, which
selects all twenty-four batteries on every push that touches it.

## What the sweep of `suites.yml` found while the bound was being moved

**ADR-0222 moved the two gates from 40 to 79 and left five statements of the old number in the same
file**, three of them present-tense: *the slowest job consumes 68 % of its bound*, *nothing compares 40
minutes to what the slowest battery really costs*, and *the two ubuntu gates are typed at 40 minutes*.
The other two are inside ADR-0169's stamped arithmetic for the Windows leg, where 40 is the value that
derivation used — those keep their reading and only their pointer is repaired, because *a rename may
move a name; it may not move a reading*.

That is `CLAUDE.md`'s rule 2 — the change that builds a mechanism sweeps for every statement naming
it — failing inside the file whose whole subject is keeping other declarations. It is repaired here,
and the 68 % is **not restated with today's number**: it moves whenever the battery grows or the bound
is re-derived, which is precisely the sentence ADR-0018 refuses.

## The four guards `not-yet-published` will redden, priced and not paid

The owner's brief keeps them for the unit that puts `temporal/add` into the state, where the red
arrives for real rather than under a control. What this record owes is that they are written where
that unit will meet them: one note at each of the four, and the collected bill at the dispatch arm in
`local-read-api.ts`, which is where somebody putting a contract into the state arrives.

**They do not cost the same thing, and ADR-0261 priced them as one number.** Both anchoring names
*encode* that every binding is anchored, so ADR-0017 makes their repair a rename. The two site guards
cost no address at all: neither name says how many entries are uninstallable or that an uninstallable
one has no binding, so each is repaired inside its own body by reading the lifecycle where it reads
`installable`.

Measured at `db9e20d` by counting each address in the committed bytes of every tracked file:

| | occurrences | files | records | `confirmed-by` |
| --- | --- | --- | --- | --- |
| `every-binding-anchors-a-commit-and-the-check-reaches-all-of-them` | 11 | 7 | 5 | 3 |
| `nothing-this-tree-binds-escapes-the-freeze-check` | 10 | 7 | 4 | 2 |
| `a-refused-contract-is-in-the-index-and-resolves-to-no-binding` | 3 | 3 | 1 | 0 |
| `every-contract-the-index-lists-has-a-page-at-its-own-address` | 17 | 10 | 8 | 7 |

**So the bill is the pair's 21 across 9 files, not the four's 41 across 17** — and the largest single
figure in the table belongs to a guard that costs nothing, which is what makes the separation worth
more than the total. **ADR-0261's *fourteen citations across six records, three in `confirmed-by`* does
not reproduce**: the six records are right if its own is counted, and every other reading of the pair
is 12, 16, 17 or 21, with five `confirmed-by` entries rather than three. It is corrected here rather
than in that record, which is stamped.

## Consequences

The two ubuntu gates read 92. `every-battery` takes the first gate's number for the first gate's
reason, so a publication is bounded by the same derivation the per-push gate is. Nothing else in
`suites.yml` moved: not the floor, not `engines`, not `cancel-in-progress`, not the Windows legs at 20
and 57, not the answering job at 5.

The entry of `CLAUDE.md` about the bound does not close. Three of the five `timeout-minutes` are
derived and two are typed, and every derivation is still performed by a person on the day they think
to; the job that would read the matrix's own durations and refuse a share of them is unchanged and
still priced there. What moved is that the derived one is now derived from **its own job** rather than
from a neighbour's, and that the entry gains a rate: two units in seven days have re-derived it, and
one of them left five statements of the old number behind.

`packages/registry` is declared the dearest folder in the repository for a guard, with the figure and
the arithmetic beside the table that makes somebody edit it.

## What would reopen this

* **A reading of `registry-storage` above 19.66 s a cell.** The spread is `max/median` over eight
  readings and the max is the only term the product depends on, so a slower run moves the bound and
  nothing else does. That is the trigger, and it is the one this form was chosen to make legible.
* **The battery crossing 92 minutes.** It is ADR-0222's own trigger firing a second time, and the
  arithmetic above is what somebody re-runs — with the cell count read off the column and never off
  the source.
* **A second battery approaching the bound.** Every reading here is `registry-storage`'s, and the gate
  bounds every battery in the matrix; the day a second one is within 40 cells of it, the derivation
  needs a population rather than a job.
* **A guard added to `packages/registry` costing more than about half a second.** The table in
  `census.ts` prices it at two minutes of runner, and that figure is what the next unit to add one
  should check its own guard against rather than trust.

## More Information

ADR-0222 is the bound this replaces, and its first reopening trigger is what fired. ADR-0169 carries
the form and the property that decides it. ADR-0199 is the rule about extrapolating from one member of
a population, applied here to the spread. ADR-0205 is the precedent for a base that is measured and a
multiple that is a convention said out loud, and for a number that carries its arithmetic in its
digits. ADR-0206 is the accounting this record reads on wall clock. ADR-0261 is the unit whose three
guards crossed the bound and whose four unpaid guards are priced here. ADR-0018 is why the 68 % is not
restated.
