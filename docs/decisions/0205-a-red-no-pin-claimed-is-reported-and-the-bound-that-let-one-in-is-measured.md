---
status: accepted
date: 2026-09-02
governs:
  - mutation/attribution.ts
  - mutation/run.ts
  - packages/registry/vitest.config.ts
  - CLAUDE.md
confirmed-by:
  - battery: meta
    guard: a-red-the-pin-of-its-own-cell-does-not-name-is-reported
  - battery: meta
    guard: a-red-above-the-line-a-pin-draws-in-full-is-not-reported
  - battery: meta
    guard: a-cell-whose-pin-names-every-guard-it-reddened-is-not-reported
  - battery: meta
    guard: a-red-is-reported-with-what-to-do-about-it-and-a-clean-run-is-not-lectured
---

# A red no pin claimed is reported, and the bound that let one in is measured

## Context and Problem Statement

ADR-0204 published its census in two columns. One guard of `packages/registry` reddened on `I-38`, a
cell that edits `emit.ts` and has no causal path to a comparison between `serialiseContract`'s output
and what git holds; the extra red took `an-edge-is-followed-to-the-artefact-it-names` out of the
isolated bucket and manufactured a reciprocal pair out of two guards with no relationship to each
other.

**Nothing this instrument holds reported it.** A pin is checked as a *subset* - `agreesWith` asks that
every guard the pin names reddened, and never that every guard that reddened was named - so the cell
read `killed`, agreed with its battery, and the run exited 0. The two columns exist because a person
noticed, argued from causality, and wrote the correction down by hand.

The subset rule is right and is not touched here. **A cell that reddens more guards than its pin names
does not contradict that pin**, which is ADR-0076 and which holds. What was missing is not a
constraint: it is a reading.

The instrument prints `never red, UNACCOUNTED FOR (n)` and refuses a run on it. It had no reading at
all of the mirror - a guard that reddened and that no pin claimed.

## Decision Drivers

- **A number nobody reads is worse than no number.** A line that is non-zero on every run teaches a
  reader to skip it, and one that can never be non-zero establishes nothing.
- **The instance decides the shape.** A reading that would not have reported `I-38` is not a reading of
  this problem, whatever else it reports.
- **Rule 4.** `attribution.ts` already holds `red on` and `alone on` per guard; whatever is added is
  derived from what a completed run carries rather than measured again.
- **A bound posed by judgement is a bound nobody has.** This repository wrote what that costs twice in
  one week - ADR-0169 on a timeout derivation that moved the wrong way, ADR-0199 on a bound
  extrapolated from the convenient member of a population.

## Two readings, measured before the shape was chosen

Both were taken over the twenty-three artefacts on disk at `b0372b3`. **The perimeter is mixed and is
named as one**: `registry-storage` is ADR-0204's own replay, `validation-stage-1` is this unit's,
`fixture` and `packaging` are later still, and the rest are ADR-0200's at `257425c`. That is
acceptable here for a reason it would not always be - what is being counted is the *shape of pins*,
which is a property of the batteries rather than a state of the tree, and every figure below
reproduced to the unit across two takings an hour apart.

**898 cells, of which 846 reddened at all and 193 reddened more than five guards.**

### Over guards, which is the shape reached for first

*A guard that reddened somewhere in the run and that no pin of the run names.* It answers **634
guards**, and on `packages/registry` it answers **47**.

It is refused on two measurements.

**Forty-six of those forty-seven reddened only on cells above the line.** Above five reds a pin names
the guards the mutant was written to exercise and deliberately not the rest, so the reading is almost
entirely a report of ADR-0076 working as designed.

**And it is blind to the case that motivated the unit.**
`the-served-bytes-are-the-committed-bytes` is named by `I-65`'s pin, so under a guard-level reading it
is accounted for and `I-38` reports nothing. A reading that answers 634 and misses the one instance
this repository has is not a weaker version of the right reading; it is about something else.

### Over cells, bounded by the line

*A guard that reddened on a cell whose own pin does not name it, where the cell is at or below the line
ADR-0076 draws.* It answers **155 cells** across the repository, **13** on `packages/registry` -
`I-38` among them - and **3** on `validation-stage-1`.

**A pin is a per-cell object and the convention is a per-cell rule**, which is the whole of why the
granularity is this one.

**One reading came out of the sweep that was not looked for**: of the 653 cells at or below the line,
**nought have an empty pin**. Every killed cell in this repository names at least one guard. What 155
of them do not do is name *all* of them, which is what ADR-0076 asks at that size -
`array-group-by.battery.ts` carries one instance found by hand, in its own words, *this pin named one
where it owed four*.

## Decision Outcome

**`unclaimedRedsIn` is per cell, stops at `THE_MOST_REDS_A_PIN_NAMES_IN_FULL`, and reports.**

ADR-0076's line moves out of prose into `run.ts`, beside the field it is about, because until now
nothing read it. It stays a convention and says so: what was measured is a distribution of red-set
sizes, where to cut it is a choice, and the reading built on it moves when the cut does.

### Report, and not refuse

An unclaimed red is a load flake or a real detection nobody pinned. **Nothing in one run separates the
two** - that is what ADR-0204 needed a person and an argument from causality for - and both deserve to
be seen. Refusing would redden twenty-one of the twenty-three batteries and both gates behind them, on
a debt of 155 rather than on a fault.

**The other half of that arbitration is held by the shape rather than by a guard.** `disagreementsIn`
takes columns and this reading takes cells, so refusing on an unclaimed red would mean handing it a
second argument, and that does not compile. Writing a guard for it would be asserting what the
compiler already refuses.

### Where the number lives, and why there is no threshold

**Both, and they are one object.** The block's header carries the count - the aggregate for the run -
and each cell is listed under it with the guards it did not claim, so a reader can look at one. A
second statement of the same number elsewhere is one more thing free to drift, and nothing is written
into the results file for the same reason: every term of the reading is already in `results`.

**There is no threshold, and its absence is the decision.** The count is at zero when every pin at or
below the line names its reds. A number chosen to be tolerated would publish a level of noise nobody
established, and it would be the second bound in this unit posed by judgement.

### What it prints on a real run, and the red it was made to produce

`npm run battery -- validation-stage-1`, at `b0372b3`, exit 0:

```
red, UNCLAIMED BY THE PIN OF ITS OWN CELL - at or below the line ADR-0076 draws, where a pin owes
every guard it reddened (3)
  S-07 V/as-committed  4 named, 1 unclaimed
    the-reference-crosses-no-rule-object-deep-equal
  S-13 V/as-committed  1 named, 2 unclaimed
    what-the-reader-sees
    the-boundary-is-a-measurement-and-not-a-claim
  S-20 V/as-committed  2 named, 2 unclaimed
    what-the-reader-sees
    the-boundary-is-a-measurement-and-not-a-claim
```

**The red was produced deterministically rather than waited for.** A throwaway battery re-exports
`validation-stage-1` with one name dropped from `S-03`'s pin and changes nothing else. That is the
defect in its purest form: a pin that stops claiming a guard it used to claim.

Everything else in the report is green through it. The battery prints `every cell agrees with the
verdict this battery pins for it`, the attribution prints `every guard of this contract is either
witnessed or accounted for`, and the process exits **0**. The count goes **3 to 4** and names `S-03`
and `the-refusal-carries-the-catalogues-own-reason`. **The new line is the only thing in the whole
report that sees it.**

### The four guards, and where they live

They are in `mutation/attribution.test.ts` and not in `instrument.test.ts`. That file calibrates the
fixture battery at module scope, so it refuses to collect at all on a working tree carrying
uncommitted changes - which is right for guards about an apparatus that checks arms out into the tree,
and which would mean a pure reading over a list of records could only ever be seen red at a commit.
Nothing in the new file touches a disk, spawns a process or reads the repository.

**Each was seen red alone**, over six perturbations of `attribution.ts`, read out of the json report
with a green control either side:

| perturbation | red |
| --- | --- |
| the cell addressed by `lens/arm` | `a-red-the-pin-of-its-own-cell-does-not-name-is-reported` |
| the line not applied | `a-red-above-the-line-a-pin-draws-in-full-is-not-reported` |
| a fully-named pin reported anyway | `a-cell-whose-pin-names-every-guard-it-reddened-is-not-reported` |
| the guidance removed | `a-red-is-reported-with-what-to-do-about-it-…` |
| the guidance printed over an empty run | the same |
| the count dropped from the header | the same |

**One guard was renamed before it was believed.** It was written as
`a-red-no-pin-claimed-is-reported-and-never-refused`, and not one of its assertions held the second
half - the name promised what the shape holds and the guard did not. It is named for what it
establishes now, and the refusal half is argued in `attribution.ts` where the shape is.

## The bound that let one in

`packages/registry` declared no `testTimeout`, so it ran under vitest 4.1.10's default 5 000 ms.

**The condition it is measured in is what moved the number, and the brief's own figure was the wrong
one.** The file alone finishes its twenty guards in 1 124 ms. The same guard inside the whole folder
under `--typecheck`, which is what `run.ts` spawns for every cell, takes **2 820 ms** worst of three -
already 56 % of the default on an idle machine, where the file-alone reading suggests 22 %.

Measured at `d9f62b8` on Windows 11, node v24.15.0, vitest 4.1.10, sixteen logical cores, with N
processes spinning beside the suite's own workers:

| | readings | |
| --- | --- | --- |
| idle | 2 672, 2 818, 2 820 | green |
| N = 4 | 3 403, 3 450, 3 636 | green |
| N = 8 | 4 971, 4 993, 5 606 | **one red of three** |
| N = 16 | 12 514, 12 664, 13 670, 15 015 | **four red of four** |

At saturation the failure is not one guard's: **six guards of four files redden**, and three of 466
report a duration above the default.

**The base is measured and the multiple is a convention, said out loud because the number would
otherwise read as derived.** The base is 15 015 ms, the worst of ten readings, at a contention of
**5.32** over idle. The multiple is four - the bound clears the worst machine measured with room for
one worse still, and how much room is a choice. So the bound is **60 060 ms**, which carries its base
in its own digits: re-measuring the worst reading moves it.

**`packages/cli`'s number was not copied, and the reason is a measurement.** That folder set 60 s at
22 times its slowest idle guard and 17 times its worst under load, because its contention factor is
1.31. Here it is 5.32, so those two multiples give 62 s and 256 s and cannot both be right. A bound
extrapolated from one member of a population states the cost of that member - ADR-0199, arriving on a
timeout rather than on a job duration. That the two folders land near one number from different bases
is a coincidence and is not the argument.

The bound is 10 % of `THE_LONGEST_A_RUN_MAY_TAKE`, so a guard that is genuinely hung still reddens
inside the run that contains it rather than arriving as `not-measured`, which is the verdict ADR-0162
says no cell can be pinned at.

**Verified with a control on both sides**: the same saturation that reddened six guards gives **466 of
466 passed** with the bound declared.

### `hookTimeout` is left alone, and that is a refusal

An intermediate reading of this unit said the heaviest hook here costs 8 226 ms against a 10 000 ms
default - 82 %, tighter in proportion than the guard - and it was wrong. **That figure is the whole
file**, import and collection included, and the hook is not separable from it by anything this
repository reads. The same file was then seen at **27 519 ms** under saturation *without the hook
expiring*, which is what refuted the reading.

So no number is declared for it. A bound set on a quantity nobody has measured is the thing this
repair exists not to be, and the honest state is that the hook was never observed to fail at any load
applied here and that its own cost is unknown.

## A figure that a busy machine can move carries the machine as well as the commit

**Yes, it is a rule, and it goes where ADR-0018's clauses are.**

ADR-0018 requires a published count to carry its coordinates, and a coordinate is a commit. That is
right for almost everything this repository counts - guards collected, cells, bytes, addresses,
selectors - because those are functions of the tree and a commit fixes them.

**The trap is between a count and a duration.** A duration is obviously not fixed by a commit, and
this repository has measured that twice: ADR-0169 read two runs of identical work at one commit at
1 541 s and 1 319 s, and ADR-0200 put a floor under it - one reading of a battery calibrates that
battery no better than to about a sixth. Neither wrote the rule down.

What ADR-0204 met is sharper than either, and it is why the rule is worth writing. **A count derived
from a run looks like a function of the tree and is not.** `alone`, `never alone`, `one companion
away` are counts; they were rebuilt from artefacts by a stated rule; and one of them moved because a
machine was busy. A reader meeting `317 alone` has no reason to ask what else was running.

So the clause is: **a figure a busy machine can move carries the machine as well as the commit.** It
reaches durations, and it reaches counts derived from what a run observed - which is every figure the
attribution and the census produce.

**ADR-0204 is the instance and not an exception**, and its own last sentence is the rule asking to be
written: *no published figure anywhere says which kind of machine it was taken on*.

**What the rule does not do is make the figure stable**, and the two halves of this unit are the two
things that can be done instead. The bound makes the crossing far less likely and cannot make it
impossible, because a machine can always be worse. The reading makes it visible when it happens. The
coordinate is what lets a reader tell two honest figures apart afterwards.

## Consequences

- **`mutation/attribution.ts` gains a reading and `mutation/run.ts` a constant.** No verdict changes,
  no pin moves, and the exit code of every battery is what it was: `unclaimedRedsIn` is read by nothing
  that decides anything.
- **`mutation/attribution.test.ts` is a new file of four guards.** The meta suite goes 120 to **124**.
  The census is untouched, because `mutation/vitest.config.ts` has no entry in it - only
  `mutation/fixture/` does - and the README's figures are untouched, because no cell was added.
- **`packages/registry` runs under a declared bound.** The suite is 466 passed either side on an idle
  machine, and 466 rather than 460 under saturation.
- **Every battery's report is one block longer.** Twenty-one of the twenty-three will print a non-zero
  count on their next run, and the totals are in CLAUDE.md's open list with what closing them costs.

## What would reopen this

**A count of 155 that falls reopens the entry rather than this record.** Naming the reds of a cell at
or below the line is what closes one, and the reading is what makes the debt visible; the record does
not predict how fast it falls.

**A cell at or below the line whose pin is empty reopens the sweep**, which found nought of 653 and
therefore asserts nothing about that case.

**A re-measurement of ADR-0076's distribution reopens the reading's population.** The line has moved
in the record's own history - median five, then three, then four - and this reading is bounded by it,
so a different cut is a different set of 155.

**A reading of `the-served-bytes-are-the-committed-bytes` above 15 015 ms reopens the bound**, which
is four times that number and nothing else. A faster reading tightens it and a slower one loosens it,
which is the direction ADR-0169 asks a derivation to move in.

**A measurement that separates the heaviest hook from its file's import and collection reopens
`hookTimeout`**, which is declared nowhere here for exactly that reason.

**And a figure published without its machine, where a busy machine could have moved it, reopens the
rule above** - which is the only one of these triggers that somebody else's unit can fire.

## More Information

The two readings were taken with a script over `mutation/results/`, which is ignored, so they are
rebuilt rather than kept. Both reproduced to the unit across two takings an hour apart, and the three
cells of `validation-stage-1` the script named are the three the battery printed.

The perturbations were applied to `mutation/attribution.ts` one at a time, each with the file restored
afterwards and the restoration verified by comparing the bytes, and the verdicts were read out of
vitest's json report rather than out of its console output.

```sh
npx tsc -p tsconfig.json --noEmit               # exit 0
npx tsc -p packages/registry/tsconfig.json      # exit 0
pnpm run registry                               # 466 passed
pnpm run meta                                   # 11 files, 124 passed
npm run battery -- validation-stage-1           # 21 cells, exit 0, 3 unclaimed
pnpm run anchors
pnpm run freeze                                 # no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
d9f62b8..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's own files nor
either of the two shared ones was touched, and the freeze is green beside that reading rather than in
place of it.
