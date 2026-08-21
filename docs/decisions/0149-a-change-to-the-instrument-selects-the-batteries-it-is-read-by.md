---
status: accepted
date: 2026-08-21
decision-makers: Mathis Perron
governs:
  - mutation/selection.ts
  - packaging/reachable.ts
confirmed-by:
  - battery: meta
    guard: every-file-a-run-of-a-battery-reads-is-declared
  - battery: meta
    guard: a-change-to-what-every-battery-is-built-out-of-selects-every-battery
  - battery: meta
    guard: a-declaration-left-to-its-own-rows-is-one-a-run-really-reads
  - battery: meta
    guard: a-change-to-a-declaration-left-to-its-own-rows-selects-nothing-and-is-reported
  - battery: meta
    guard: a-cell-disagreeing-with-its-pin-reaches-the-exit-code
  - battery: meta
    guard: a-guard-disagreeing-with-its-battery-reaches-the-exit-code
  - battery: meta
    guard: a-filtered-run-carries-a-cell-disagreement-into-the-exit-code-too
---

# A change to the instrument selects the batteries it is read by, and the exit code both gates read is exercised

## Context and Problem Statement

[ADR-0146](0146-the-instrument-runs-in-continuous-integration.md) named three things its gates do not
reach. The third was *the shared modules of `mutation/`*: `run.ts`, `published.ts`, `mutants.ts` and
`attribution.ts` are what every battery is built out of, and a change to one of them selected nothing.
It was refused on the price - *it is a full replay by another name* - and not overlooked.

**It bit the two pushes that followed.** `f465660` moved `run.ts`, `paths.ts` and `mutants.ts` and
replayed two batteries of twenty-one; `8b6aa89` moved `attribution.ts` and replayed none. The push
repairing a fault the gate found is a push the gate does not answer for.

**Two of two is not a rate**, so the first deliverable of this unit was a number and not a mechanism.

## Decision Drivers

- A gate whose failure mode is silence is worse than no gate.
- A declaration nothing derives is a debt this repository already keeps a list for, so a rule stated as
  a list of names has to be checked against something that is not that list.
- The instrument's own modules decide every verdict this repository publishes about its catalogue.
- A renforcement whose foundation is unproven is not publishable: both gates read an exit code, and
  that exit code had a failing direction nothing exercised.

## Considered Options

- Leave it to the second gate, which is the state ADR-0146 left.
- Select every battery on any file a run reads, `census.ts` included.
- Select every battery on any file a run reads, and project `census.ts`'s changed rows onto the paths
  they name.
- Select every battery on any file a run reads, `census.ts` excepted and its residue declared.

## Decision Outcome

**The fourth.** A changed file a battery's *run* reads selects every battery; `mutation/census.ts` is
declared as the one member that selects nothing, with its residue measured beside it.

### The reading that refused this was about a different walk

Following what a *suite* imports selects everything: the six injection folders are one strongly
connected component, and that measurement stands untouched. Following what a *run* reads starts at
`measure.ts` and at each battery's own declaration - neither of which imports a folder under
measurement - and closes on **eight files**.

    mutation/attribution.ts   mutation/mutants.ts   packages/catalogue/identifier.ts
    mutation/census.ts        mutation/paths.ts     vitest-entry-point.ts
    mutation/measure.ts       mutation/run.ts

The two walks were conflated, and the conflation is what made the price look like a full replay.

### The four names were wrong in both directions, and the population was supposed rather than derived

Derived with this repository's own walk rather than listed from memory: **`published.ts` is on no
battery's execution path at all.** `measure.ts` resolves its battery through a templated `import()` and
never reads `THE_BATTERIES`, and `suites.yml` runs `npm run battery <name>`, which is `measure.ts`. And
`census.ts`, `measure.ts` and `paths.ts` are read by every run and were named nowhere.

One name too many, three missing. **Nothing had derived that list**; it was written from a reading of
what the instrument looked like, which is the failure mode `CLAUDE.md` names as an entry that is false
without being stale.

**Two of the eight are outside `mutation/`**, so a rule scoped to the instrument's folder would have
missed them. `packages/catalogue/identifier.ts` narrows ADR-0146's second gap by exactly one file; its
neighbour `every-contract.ts` is read by the contract suites and by no run of a battery, so that gap
stays open and is not closed here by accident.

### The declaration and the walk are two statements, and the walk is the one that goes quiet

`WHAT_A_RUN_OF_ANY_BATTERY_READS` is a constant, and the guard beside it derives the same set from the
imports and refuses any disagreement - the pair `sharedHarnessOf` is built on. **The blind spot is
published rather than discovered**: `specifiersIn` matches a quoted literal and cannot see the
templated `import()` in `measure.ts`, so the walk reaches no battery from the runner at all and the
guard adds every declaration as an entry point of its own. A second templated import would be invisible
to the walk and the declaration would go on looking right. That is the direction this pair fails in and
the reason neither half alone would do.

`sourceNamedBy` moved from `packages/registry/serialise.ts` to `packaging/reachable.ts` in the same
change, there now being three callers of `closureFrom` and two resolutions between them.

### The rate, over a population rebuilt rather than inherited

ADR-0146 priced 39 pushes from `694a7a6` to `9d05552`. That is a stamp, and reading it in the present
tense is ADR-0018's own defect: the population at `341f86c` is **43 pushes**, the first 39 of which are
its. The method reproduces its three published figures on its own 39 - median wall 578 s, worst runner
4 698 s, and 8 selecting no battery at all - which is what makes the four extra readable beside them.

**"Selects nothing" is the wrong question and it undercounts by fourteen times.** Fourteen of the 43
pushes touched a file a run reads; only one of them selected nothing, because the other thirteen
selected batteries for the *other* files they carried. The question that answers is *was a battery that
reads the changed file left unselected*:

    7c9906c   1 battery missed    a census row, validation-stage-1
    f465660  19 batteries missed  run.ts +70/-1, paths.ts +34/-13, mutants.ts +18/-1
    8b6aa89  21 batteries missed  attribution.ts +50/-1

**Three of 43 - 7 %.** Two of two for pushes that move the instrument's machinery, and both total.

### What the cheap witness already catches, measured before anything was built

The fixture battery replays on every push inside `npm run meta`, so the eight files are not unwitnessed
- they are witnessed by a toy with two mutants, one arm and no property-based guard. Five plausible
defects, each committed and run against `npm run meta` and `tsc -p tsconfig.json`:

    run.ts           measureCell stops skipping a cell this family cannot have    meta green, compiles
    mutants.ts       a killed pin stops naming its guards                         meta RED, 6 tests
    paths.ts         trackedProse drops every Markdown file                       meta green, compiles
    attribution.ts   the platform-skip reason reads the wrong family              meta green, compiles
    measure.ts       a guard disagreement stops reaching the exit code            meta green, compiles

**Four of five pass both.** The distribution is the result and not the count: **two of the four are
caught by a battery this rule now selects** - `cli-install`, the only battery of the twenty-one
carrying an `onlyOn` cell - and **two are caught by nothing**. One of those two is the exit code below.
The other is `trackedProse`, whose subject is `npm run hands`, a command in no workflow, and whose
guard derives its own population from the function the defect narrows; it is left standing as a finding
rather than repaired here.

**The `run.ts` defect is invisible on the machine this was measured on**, and that is I-01's lesson
arriving again: `C-64` is pinned `onlyOn('windows')`, so on Windows the cell is applicable and the skip
never fires. A posix runner is required to see it.

### The exit code both gates read

`instrument.test.ts` already spawned `measure.ts fixture` and asserted `done.status` is 0 - a battery
pinned green, so the assertion cannot fail when the exit code stops carrying a failure. Both gates run
`npm run battery <name>` and read that status. Dropping `|| disagreements.length > 0` prints every
guard disagreement and exits 0, so twenty-one batteries report success while half of what each reports
is discarded.

**No battery can witness it**, because a battery cannot read its own exit code; so the selection rule
above does not close it and it is closed here instead. **Why it was never written**: a declaration must
be on disk and `calibrate` refuses a tree with uncommitted changes, so a disagreement cannot be
arranged by editing anything tracked. `assertCleanTree` reads `--untracked-files=no`, so an untracked
declaration is the door - written and removed inside the guard, its name beginning `throwaway-` so that
`every-battery-of-this-folder-is-published` names what happened if a run dies between the two.

**Three exit codes and not one**, the third found by the first two failing to redden a perturbation of
it. Each perturbation reddens exactly its own guards, against a control of 101:

    no perturbation                       exit 0, 101 passed
    the guard term dropped                a-guard-disagreeing-with-its-battery-reaches-the-exit-code
    the complete run always exits 0       both guards above
    the filtered run always exits 0       a-filtered-run-carries-a-cell-disagreement-into-the-exit-code-too

### The price, and why it did not decide the census

Over the 43 pushes, at ADR-0145's `ubuntu-latest` seconds:

    today                                 wall 28 840 s            runner 46 182 s        fires  0/43
    the rule                              wall 30 337 s  +5.2 %    runner 54 885 s +18.8 %   fires  2/43
    with census.ts selecting too          wall 36 847 s +27.8 %    runner 94 307 s +104.2 %  fires 14/43
    with census.ts projected onto rows    wall 30 337 s  +5.2 %    runner 54 939 s +19.0 %   fires  3/43

**Excluding the census and projecting it differ by 54 seconds in 54 939 - 0.098 % - and by nothing at
all on the clock.** So the price cannot choose between them and the argument has to. `census.ts` is a
table keyed by suite file: every row names a path, and the batteries that path belongs to are what the
folder rule already answers for. A row moving without its battery running is a defect of the census - a
declaration nothing derives - and repairing it in the selection would put the correction in the
mechanism beside the one that has the defect.

**The residue is one push in thirteen and its cause recurs**: guards written with `it.each` over the
catalogue change count when a contract is *published*, in files nobody edited. It belongs to the entry
`CLAUDE.md` already keeps about a parameterised guard having no citable address.

Widening the rule from `mutation/` to the whole closure cost nothing: neither file outside the
instrument was touched by any of the 43 pushes.

### Consequences

**Good.** The third of ADR-0146's three gaps closes. `8b6aa89` goes from 0 batteries to 21 and
`f465660` from 2 to 21, replayed through the selector as it now stands.

**Good, and it is the half that was not planned.** The exit code both gates depend on has a failing
direction that is exercised, in all three of the places `measure.ts` sets one.

**Bad, and named rather than smoothed.** The guards live in `mutation/`, which no battery injects into
and no census counts, so they are born unwitnessed by construction - the class ADR-0146 already
recorded for its own guards. What witnesses them here is that each was seen red on its own condition
and on nobody else's: five perturbations of the selection reddened one guard apiece, and three of the
exit code reddened exactly the guards that name it.

**Bad.** Two pushes in 43 now pay a full replay, and `seedsAreFrozen` is false, so those are twenty-one
batteries' worth of fresh draws on a push that previously drew from two. A thin pin has more chances to
redden a healthy tree, and ADR-0146's criterion is what classifies one.

**A cost that is not this repository's to control.** A full selection is 21 jobs against a concurrency
ceiling of 20, so one queues and the wall clock of those two pushes is above the 1 497 s priced here
rather than equal to it.

## What would reopen this

- A second templated `import()` in a file the walk starts from, which the declaration would notice and
  the walk would not. It is the pair's failure direction and it is written into the guard.
- The census residue growing past one push in thirteen, which would mean the argument that a census row
  is already addressed to a folder had stopped holding. The measurement is in `selection.ts` beside the
  declaration.
- A file a run reads becoming expensive enough that selecting all twenty-one on it is worth splitting.
  Nothing here reads which battery a shared change could plausibly affect, and nothing could cheaply.
- The price moving, which it does whenever a battery does.

## More Information

The `run.ts` and `attribution.ts` defects above are both the `onlyOn` machinery
[ADR-0147](0147-a-published-count-carries-the-platform-it-is-true-on.md) landed, which is why
`cli-install` is the only battery that witnesses them: it carries the catalogue's only cell pinned to
one platform family.
