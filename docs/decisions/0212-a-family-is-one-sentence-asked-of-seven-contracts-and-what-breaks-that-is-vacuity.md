---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
confirmed-by: []
---

# A family is one sentence asked of seven contracts, and what breaks that is vacuity rather than disagreement

## Context and Problem Statement

ADR-0209 published an arithmetic and named its own weakest joint in the same paragraph. **145 of the
262 are parameterised over a contract, in 21 families**, 117 stand alone, and therefore *if a family
collapses to one cell, the 262 are at most 138 aiming decisions and never 262*. Beside it, in as many
words: **whether a family really collapses is measured once and assumed twenty times, and that is the
weakest joint in the arithmetic.** One family had collapsed — `a-record-survives-the-wire`, seven
members for one cell — and nothing had ever tested the claim on another.

**The standalone half is exhausted, so the 138 is now the whole of what is unpriced.** ADR-0210 took
the twenty standalone guards in wholly unprobed files and ADR-0211 took the seventy in probed ones;
between them they read **90 of 90** and witnessed 79, and `unprobedClaims` fell 262 → 228 → 201 → 129.
What is left is almost entirely the parameterised half, and its price rests entirely on a single
measurement taken once.

**The population moved while nobody was reading it, and it is rebuilt here rather than carried
forward.** Measured at `1238833` off the 215-cell artefact ADR-0211 replayed at `14bd274`: the 129
are **120 parameterised rows in 19 families and 9 standalone**, where ADR-0209 read 145 in 21 and 117.
Two families left the bucket entirely and eleven lost a row apiece — which is ADR-0211's own cell, the
one that stops a contract serialising and reddens that contract's row across eleven families at once.

## Decision Drivers

- **The definition does not move.** A1, A2 and the narrowest-defect discipline are committed at
  `68e466a`, including its family exception — *a defect may be the failure condition several guards
  name*. This is the population that most solicits a relaxation of that exception, and relaxing it
  here would make the number rather than measure it.
- **A1 and A2 apply row by row, and the shortcut is invisible in the count.** A cell that reddens
  seven rows without being the failure condition of seven has witnessed one and reddened six
  incidentally. The audit is therefore per member and not per cell, and the record publishes the
  member-by-member decomposition rather than a family's verdict alone.
- **The mechanism is worth more than the rate.** ADR-0209 says a family collapses when one defect is
  the failure condition all its members name, and that *nothing says the other twenty families have
  such a defect available*. Naming what actually decides it, in advance, is the finding this unit is
  for; the rate is what tests the naming.

## The structure, read mechanically before any sentence

Three readings, all off the artefact and the control report, none of which prints a guard's sentence
or opens a test file. The control is `pnpm run registry` at `1238833` — **466 collected assertions,
466 passed, 24 files, 10.53 s, exit 0** — joined to the attribution of the 215-cell artefact.

**The join is total in both directions.** 123 load-bearing + 204 never alone + 10 out of reach + 129
unprobed claims = **466**, with nought unaccounted for, nought wrongly declared silent, nought
disagreeing, 210 killed and 5 survived. That is ADR-0211's published row `123/204/139` reproduced
exactly, the 139 being the ten out of reach plus the 129.

**Every family carries exactly seven rows, and they are the seven distinct contract slugs — 19 of
19.** So a family is not a resemblance between separately written guards. It is **one guard title
parameterised over the whole catalogue**, expanded by the runner into one row per contract, which the
artefact addresses individually because `failedGuards` holds expanded names.

**Thirteen rows of the slice are already witnessed**: ten families stand at six silent rows of seven,
one at four of seven, and eight at seven of seven.

## The rule, fixed before a guard of the slice was read

**Every family of `unprobedClaims` in `packages/registry`.** All nineteen, total over the population
as it stands, with no selection and no easy half — which is the shape ADR-0211 reached for and the
only shape that can settle a claim about *the other twenty*.

**One aiming decision per family, and the measurement is how many of that family's silent rows the
resulting cell witnesses**, audited row by row against A1 and A2. A family *collapses* when one cell
witnesses every silent row it has. A family that does not collapse is recorded as not collapsing,
with the count of rows the cell does witness; this unit does not then buy a cell per remaining row,
because what is under test is the collapse and not the coverage.

**What was seen when this rule was fixed**: the counts above and nothing else. No guard address was
printed, no sentence was read, no test file was opened. The three scripts that produced the counts
emit sizes and never names, deliberately.

## The prediction, committed here

**The mechanism first, because it is the claim under test.** ADR-0209 locates the risk in whether a
defect exists that all seven members name. Under the structure measured above that is the wrong
place to look: the seven members **are one sentence**, so any edit to the shared path is by
construction the failure condition each of them names, and A2 holds for each row because the row's
subject is that contract's instance of the very thing broken. The risk is therefore not disagreement
between members. It is **vacuity**: a row whose contract has no instance of what the clause
quantifies over is green whatever the shared code does, and no cell can witness it. So —

> **A family collapses iff its clause is non-vacuous for all seven contracts. Where a family fails to
> collapse, the missing rows are the contracts whose data does not instantiate the clause, and never
> contracts whose sentence names a different condition.**

**The rate: 17 of 19 families collapse to one cell.** The bias is declared **upwards** — the
prediction trusts the parameterised shape, so the way it is wrong is that vacuity is commoner than
one family in ten. The 120 silent rows are therefore predicted to be witnessed by **19 to 25 cells**.

**The family standing at four silent rows of seven is one of the two predicted to fail**, and it is
the only observable in the artefact that argues for a failure at all: three of its rows were
witnessed by cells that left the other four silent, which is direct evidence that its defect space is
per contract. The ten families at six lost their row to one contract-specific cell and that says
nothing against collapse.

**Three sub-predictions, each falsifiable on its own.** The price is at or below 1.3 candidate runs
per cell written, so about 25 runs and four minutes of machine at the 9.4 s the folder's suite takes.
No family is witnessed by a cell that reddens rows it does not witness — that is the A2 shortcut, and
predicting its absence is what makes the row-by-row audit worth publishing. And the verdict on
ADR-0209 comes back **held in form and corrected in figure**, the ceiling today being 9 + 19 = 28
aiming decisions for 129 guards rather than 138 for 262.

**Three outcomes are named in advance so that none can be read afterwards as a rescue.**

- **Seventeen or more of nineteen collapse.** The 138's form is held, the parameterised half is
  cheap, and this is the predicted and least informative result.
- **Ten to sixteen collapse.** The form holds and the factor is materially worse than one cell per
  family; the correction is publishable and the ceiling moves.
- **Nine or fewer collapse.** The 138 is refuted, the parameterised half is not cheap, and that is
  the more useful of the two because it corrects a published figure.

**Four forms of being wrong are named beside them.** A family failing to collapse because its rows
genuinely name different conditions refutes the mechanism outright and says *family* is the wrong
abstraction for this population. A cell reddening seven rows while satisfying A2 for fewer is the
shortcut this record refuses, and it is invisible in a count. Vacuity making a row **unreachable**
rather than merely unwitnessed would move it to `unreachableGuards`, which is ADR-0211's third
mechanism arriving on the parameterised half. And a price dominated by reading rather than by runs —
seven A1/A2 judgements per cell instead of one — would leave the runs-per-cell figure intact while
making the arithmetic wrong about what a family costs.

## Decision Outcome

Nothing is measured here.

## Consequences

- The slice is total over the parameterised population, so a rate obtained from it is a count over a
  population and never a sample of one — which is the form ADR-0210 established for publishing a
  figure of this kind.
- A family that does not collapse leaves rows without a witness and this unit does not buy them, so
  `unprobedClaims` falls by less than 120 whatever happens. The record publishes what is left rather
  than emptying the bucket.
- The mechanism, if it holds, retires ADR-0209's framing of the joint: what has to be asked of a
  family before pricing it is whether every contract instantiates its clause, which is answerable by
  reading the catalogue and needs no cell at all.

## What would reopen this

- **A family whose rows are not one parameterised title.** The structure is measured over nineteen
  families at one commit; a guard written as seven separate assertions sharing a stem would be a
  family by address and not by construction, and the mechanism says nothing about it.
- **A contract published or refused.** Every family here is parameterised over the catalogue, so an
  eighth contract adds a row to all nineteen at once, and each new row is silent until something
  reaches it. The rate is a property of a seven-contract catalogue.
- **The definition moving.** A1, A2 and the narrowest-defect discipline are `68e466a`'s, and a
  measurement taken under a relaxed family exception would not be comparable with the three slices
  before it.
- **A reading of the same population on another folder.** `packages/cli` and the contract batteries
  have parameterised guards of their own, and nothing here says the vacuity rate is a property of
  anything but this catalogue's own data.

## More Information

- ADR-0209 — the first witness, the 21 families, the 138, and the joint this unit tests.
- ADR-0210 and ADR-0211 — the two standalone slices, 90 of 90 read and 79 witnessed.
- `68e466a` — A1, A2, the narrowest-defect discipline and the family exception.
- The control is `pnpm run registry` at `1238833`; the artefact is `mutation/results/registry-storage.json`,
  215 cells taken at `14bd274`.
