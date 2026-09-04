---
status: accepted
date: 2026-09-05
governs:
  - mutation/prediction.ts
  - mutation/predict.ts
  - mutation/measure.ts
  - mutation/attribution.ts
  - CLAUDE.md
confirmed-by:
  - battery: meta
    guard: a-battery-that-agrees-with-its-own-measurement-predicts-nothing-and-says-so
  - battery: meta
    guard: a-pin-naming-a-guard-the-measurement-does-not-redden-is-a-fault
  - battery: meta
    guard: a-guard-reddening-where-the-battery-declares-silence-is-a-fault
  - battery: meta
    guard: a-guard-nothing-reddens-and-nothing-accounts-for-is-a-fault
  - battery: meta
    guard: a-measurement-with-no-guard-identities-is-unread-and-never-clean
  - battery: meta
    guard: a-column-with-no-guard-list-is-unread-even-beside-columns-that-have-one
  - battery: meta
    guard: a-reading-that-could-not-be-taken-exits-differently-from-one-that-found-nothing
---

# A pre-flight is worth its name only where it refuses, and the control is that it reddens on one commit and not on the next

> **This record writes no contract, moves no digest and touches nothing under `contracts/`.**
> `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing here reaches npm, and none of ADR-0218's three
> repairs is taken.

## Context and Problem Statement

`CLAUDE.md` carries an entry asking that *a reading which decides whether to pay for a replay checks
every way a replay can refuse*, and it names its own closure: the reading living in `mutation/` as a
command, next to the battery it predicts, where the three buckets are one import away instead of being
retyped from memory. This is that unit.

**The price is measured rather than argued, and it has been paid twice.** ADR-0212 wrote a predictor
for exactly this question, named the three counts a battery refuses on in its own header, implemented
two of them, and answered *nought faults*; the replay then refused on the third at the end of **42
minutes**, and the count it corrected was that record's headline figure. ADR-0206 measures the same
debt from the other side: `pnpm run cli` was green on 191 tests and said nothing, while
`pnpm battery cli-install` reproduced the runner's refusal line for line in **twenty seconds** —
against a run of thirty-seven minutes that reddened nine jobs.

**A predictor that names three failure modes and checks two reads exactly like one that checks
three** — same output, same shape, same confidence. That is the class this unit is built inside, and
it is why the load-bearing part of it is not what the tool checks but what it declines to answer.

## Decision Drivers

* The three refusals are imported from the module that computes them, never retyped. Retyping is the
  defect the entry describes, one floor down.
* A born-green tool is an assertion. The control is the unit, and it is read in **both** directions,
  because *it sees the refusal* is satisfied by a tool that refuses everything.
* A question the reading cannot ask must never be answered as though it had been.

## Decision Outcome

### The scope, written in the header before the code

`prediction.ts` opens with the sentence the whole tool is held to: **it is exact for the drift of a
declaration against a measurement already taken, and blind to what a cell that has not run would
redden.**

The reasoning is that a battery refuses on a comparison between what was *measured* and what the
battery *declares*, and only the second half moves when somebody edits a battery module. So a
measurement in `mutation/results/` can be re-judged against today's declarations without running
anything, and the verdict is the one the replay will reach — for every cell that measurement holds. A
cell added since, a mutant whose edits changed, or any change under the folder being injected into
moves what a run would observe, and no reading of a stored artefact can know it. Those cells are
reported as **not covered by this reading**, never as agreeing.

### What was extracted, so that one question has one answer

The entry's own wording is that the three buckets should be *one import away*. Two of them already
were: `attributionOf` and `disagreementsIn` are called rather than restated, so both silences are the
battery's own. The first refusal was not importable, and four things came out of `run.ts`:

| extracted | why |
| --- | --- |
| `unmetBy` | three callers were answering it separately — and two of them read the expectation the *run* resolved while the third reads the one the battery declares *today*, which is the whole subject of a pre-flight. One definition puts the difference in the argument rather than in the arithmetic. |
| `agreesWith` | so a stored cell is judged by the rule a live one is. |
| `thePinFor` | a run holds the objects; a reading holds three strings. It answers `undefined` where a run throws, because a measurement naming a cell the battery no longer declares has gone stale rather than committed a fault. |
| `cellsOf` | so a pre-flight cannot be quietly narrower than the replay it predicts. |

`measure.ts` stopped recomputing *no longer caught by* and calls `unmetBy`.

### The false green the build found, which is why the tool refuses in three places

`attributionOf` answers an empty attribution for a column it has no guard list for, and an empty
attribution yields no disagreement. **No measurement carried guard identities, so the obvious build
reports `0 faults` on all twenty-three batteries** — byte for byte what ADR-0212's predictor reported
on the day it was wrong.

So a measurement carries `guards` and `platform` now, and where either is absent the reading is
declared **unread** with the command that repairs it. Three absences are refused separately rather
than defaulted: a measurement that is missing, unparseable or partial; a measurement with no guard
identities at all; and a single column carrying cells and no guard list while its siblings carry one.
`whyAMeasurementIsUnreadable` answers a sentence rather than a boolean, because a reading that
declines without a reason is the silence this module replaces.

**The exit code is three-valued**: nought is a reading that was taken and agreed, one is a fault a
replay would refuse on, two is a question this reading could not ask. Folding the third into the first
publishes exactly the false green. It is the instrument's own vocabulary one floor up — `not-measured`
is not `survived`.

### The control: red on one commit, green on the next, over one measurement

**A tool that only reddens is satisfied by refusing everything, so both directions were read.**
`409ab48` and `90e6f1b` are consecutive commits that touch **exactly one file each and it is the same
file**, `mutation/registry-storage.battery.ts` — so the code under measurement is identical at both,
the measurement is therefore the same, and the only thing that moves is a declaration. That is the
ideal control for a tool whose subject is declaration drift, and it is ADR-0212's own event.

Measured at `881a85b`, against one measurement written by `npm run battery -- registry-storage` —
230 cells, one column, 467 guard identities, exit 0, *every guard of this contract is either witnessed
or accounted for*:

| the battery module at | exit | faults |
| --- | --- | --- |
| `409ab48` | **1** | 1 — `every-export-is-carried-or-declared-uncarried-number-parse`: *nothing reddens it, and the battery does not say why* |
| `90e6f1b` | **0** | 0 |
| `881a85b` | **0** | 0 |

`90e6f1b` adds one line to a claims-detection region and changes nothing else in the repository. It is
the whole of the difference between a red reading and a green one, and the fault names the guard that
line declares.

**The reading costs 185 ms** for that battery and 172 ms for all twenty-three, against the 42 minutes
the same refusal took to arrive.

Both historical readings also name `I-176 on R/as-committed` as a cell the measurement holds that the
battery no longer declares — that mutant arrived with ADR-0214, after both commits. It is reported and
is not a fault, which is the coverage half of the reading doing exactly what it is for.

### Every guard seen red alone, and the two that took a second aiming

Twelve guards, **twelve seen red alone**, over fourteen candidates. The rule ADR-0203 and ADR-0204
produced — *aim at a choice and never at a shared mechanism* — decided all three re-aimings, and two
of them were faults in the **guards** rather than in the candidates:

* The guard over the exit code manufactured its fault through `predictionFor`, so a defect in
  whichever mechanism it borrowed reddened it beside the guard whose claim that was. Measured on the
  third refusal, re-aimed at a pin, and measured again on the pin — the same two-red result, moved
  rather than removed. Its predictions are written out now, because its subject is the code and not
  how a fault arises.
* The guard over a measurement with no guard identities also asserted the exit code, so nothing
  separated the two. Two guards asserting one thing are one guard with two names.
* The third re-aiming was of a candidate: both silences leave through `disagreementsIn`, so a
  candidate aimed at that function reddened both guards at once. Aimed at its two arms separately,
  each guard is alone.

**The baseline earned its own red.** It asserted four empty fields, every one of which some other
guard also asserts, so no single defect could redden it alone. It asserts the *sentence* now — that a
clean reading says it is clean — which is a claim only it makes, and which is not decoration: a reader
shown nothing cannot tell a clean reading from a reading that printed nothing, and those two looking
alike is the whole subject of this module.

### What the walk caught, which is the mechanism working on its author

`StoredMeasurement` was first declared in `prediction.ts`, and `measure.ts` imported the type.
`every-file-a-run-of-a-battery-reads-is-declared` reported it on the first run: **the walk counts a
type-only import**, so a pre-flight that cannot change any verdict would have joined the eight files
whose every change replays all twenty-three batteries. `run.ts` cannot hold the type either — it would
import `ColumnAttribution` from `attribution.ts`, which is the cycle ADR-0198 cut. It lives in
`attribution.ts`, where the writer and the reader share one statement and neither drags the other into
a run.

## Consequences

`npm run predict` exists, and the entry of `CLAUDE.md` that named it closes. The command is offline,
runs nothing, spawns nothing and needs no clean tree.

**Twenty-two measurements cannot answer the two silences until each battery is measured once**, and
the command names that per battery rather than counting it as agreement. That is a debt with a price
and a remedy rather than a hole: one ordinary run of a battery repairs it, and the batteries are run
anyway.

The twelve guards are collected by `npm run meta` and witnessed by no battery, because nothing injects
into `mutation/`. That is this folder's standing trade rather than a new debt, and it is stated rather
than discovered. The two file-absence branches of `measurementFor` are in the script and are verified
by hand rather than by a guard — a missing measurement and a partial one, each read once.

## What would reopen this

* **A battery gaining a fourth refusal.** The three are what `attributeColumn` computes and
  `assertTheCensusHolds` refuses on; a fourth would make this tool narrower than the replay again,
  which is the entry's exact shape.
* **A measurement growing a field the reading should judge.** `guards` and `platform` were both added
  here because a reading could not be taken without them, and neither was foreseen when the entry was
  written.
* **The walk learning to skip a type-only import.** The layering above rests on it counting one; were
  that to change, `StoredMeasurement` could live beside its reader again.
* **A cell whose reds a reading could infer.** The scope sentence says a pre-flight cannot know what an
  unrun cell reddens. Anything making that false — a cached per-cell verdict, a deterministic
  derivation — would widen the tool past what its header claims, and the header would have to move
  with it.

## More Information

ADR-0206 and ADR-0212 are the two measurements of the debt this closes. ADR-0203 and ADR-0204 carry
the aiming rule. ADR-0198 is the cycle the type placement avoids, and ADR-0149 is the walk that caught
the placement.
