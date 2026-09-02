---
status: accepted
date: 2026-09-02
governs:
  - mutation/run.ts
  - CLAUDE.md
confirmed-by: []
---

# A control that reddens says what reddened it

## Context and Problem Statement

ADR-0200 repaired four calibrations and, on its way out, named a fault it deliberately did not
repair. `calibrate` refuses a battery whose unmutated control is red and prints
`failedGuards.join()`, and that string is empty **exactly when the report carries no failure** - so
the one refusal in this instrument whose whole job is to say *nothing below this is a reading* handed
its reader a colon and a blank line.

The state that produces it was measured there and is not remeasured here: a type error in a runtime
test file leaves vitest reporting `success: true` with every assertion passed while the process exits
1, because the typechecker's complaint arrives as an *Unhandled Source Error* which is printed and
never enters the report. **The report is this instrument's whole input, and it was not an account of
the run that wrote it.**

ADR-0200 removed the instance - four lenses and a mutant that had orphaned declarations - and said so
in as many words: *this unit removes the instance and not the class*. The class is any type error in
a runtime test file, whatever put it there. That is what closes here.

**And ADR-0200 named the second half of the fault**: `runSuite`'s `catch` reads `code` and throws
`stdout` and `stderr` away, which is the only place the answer was ever written.

## Decision Drivers

- **A report may state what it observed and may not name a cause it did not measure.** ADR-0042. What
  the instrument has here is two sources that disagree; what it has not got is a reading of which one
  is right.
- **A red that manufactures a regression costs more than a silence, because somebody goes and looks
  for it.** ADR-0060, restated in `run.ts` beside `assertEveryAddressResolves`. Failing on a
  disagreement and inventing a failed guard are not the same act, and only the first was ever on the
  table.
- **A guard that cannot be watched under a perturbation is one nobody can see red.**
  `verdict.test.ts` says this of itself, and it is why that file exists apart from
  `instrument.test.ts`.
- The instrument already tells a run's `status` from its `code`, measured at `505fddb`. What was
  missing was not a second classifier but the two facts the existing one discards.

## Considered Options

**Refuse a run whose report contradicts its exit code.** This was the shape reached for first, and a
measurement killed it. It is the finding of the unit and it is below.

**Carry the child's output into a `RunResult`**, which is ADR-0200's own wording for the repair.
Refused on two counts. A `RunResult` is what a replay writes into `mutation/results/`, so every
artefact this instrument produces would change shape for a field only a refusal reads; and **the cell
that needs it produces no `RunResult` at all** - a control is not a mutant, and `calibrate` throws
before `runBattery` exists. The output belongs on `SuiteRun`, which is where a run is described.

**Parse the child's output for a cause and print that.** Refused under ADR-0042. The instrument would
be naming a cause from a shape nobody measured, and the shape is not diagnostic anyway - see below.

**Render the red from what the run said, at the one place that has the question.** Taken.

## Decision Outcome

### The measurement that refused the refusal

A report saying the run succeeded while the process says otherwise looks exactly like a fault, and
making it one would have been wrong. Measured at `74a125d` over `mutation/fixture` - the smallest
thing that is a battery at all - by running the command `runSuite` runs and reading the report beside
the exit code:

| what was in the tree | exit | report `success` | files failed | assertions failed |
| --- | --- | --- | --- | --- |
| as committed | 0 | `true` | 0 of 2 | 0 of 3 |
| one guard given a wrong expectation | 1 | `false` | 1 of 2 | 1 of 3 |
| a type error in a runtime test file | 1 | **`true`** | 0 of 3 | 0 of 4 |
| an unhandled rejection in a test file | 1 | **`true`** | 0 of 2 | 0 of 3 |
| a type-only error in a **source** file | 1 | **`true`** | 0 of 3 | 0 of 4 |

**The last row is `NP-5`'s shape**, and five batteries pin a mutant of that kind as
`killed-by-typecheck`: a change with no consequence at runtime, which the compiler is meant to catch
alone. It produces the identical report to the fault. So **the disagreement does not separate a fault
from a detection - the column does.** A control carries no mutant, so nothing there can have been
caught by a compiler; a mutant cell can, and that is what the verdict `killed-by-typecheck` is for.

Refusing on the disagreement would have turned five pinned cells into cells nobody measured, in five
batteries, for a rule that reads as obviously right. It was refused before it was written, by
measuring the shape it would have fired on.

**The two rows carrying a type error needed a `shape.test-d.ts` the fixture has not got**, written for
the probe and removed with it - which is why they report three files where the others report two. A
configuration collecting no type test does not run the typechecker at all: measured, `typecheck` left
at its default and `typecheck.include` naming a pattern nothing matches both leave the run at exit 0
with `Type Errors  no errors`.

### What the instrument prints now

`whyARunReddened` renders a red from the run that produced it. A red naming guards is unchanged, byte
for byte. A red naming none now carries three things: which of the two sources said what, that neither
is preferred, and the run's own output.

Before, at `938ded8`, on a control reddened by an error the report does not carry:

```
the unmutated C/as-committed is red, so every verdict from this battery would be noise:

```

After, at `7461878`, on the same control, elided in the middle and nowhere else:

```
the unmutated C/as-committed is red, so every verdict from this battery would be noise:
  the run exited non-zero and its report names no guard that failed and says the run succeeded, so
  the report is not an account of this run.
  what the run printed is the only place its cause was written:
   RUN  v4.1.10 .../mutation/fixture
   Test Files  2 passed (2)
        Tests  3 passed (3)
  Type Errors  no errors
       Errors  1 error
  Unhandled Rejection
  Error: a red that never reaches the report
   at second-file.test.ts:4:21
```

**`Type Errors  no errors` is in that quotation on purpose.** It is vitest's own summary saying there
is nothing wrong, in the same output, four lines above the error - which is what a reader is up
against, and why handing over the whole tail beats quoting a line somebody chose.

**Three answers rather than one**, because the report can fail to account for a run in three different
ways and collapsing them puts a reader back where the empty string left them. It says the run
succeeded; it agrees the run failed but names no guard, so something other than a guard gave way; or
it gives no verdict at all, so there is nothing to hold the exit code against. The third is not
bookkeeping: `success` is parsed out of JSON, and a runner that stopped writing it would otherwise
arrive as `undefined` and be compared as though it had said something - which is `AN_ANSWER`'s rule
one level up, applied to the run instead of to a guard.

### The quotation is a tail, and the bound is derived

`THE_TAIL_OF_A_RUN_QUOTED` is 60 lines. Measured at `74a125d` over the two ways the fixture has been
made to produce this state, the whole output was **35 non-empty lines either time** and the
unhandled-errors block began **22 and 23 lines from the end**. Sixty is over twice the larger, which
holds a block carrying several errors while keeping a refusal something a person reads.

**The head is what grows and the tail is what answers**: a suite prints one line per file before its
summary, so a larger suite pushes its own file listing off the top of the quotation and never its
errors. That is why one number serves the fixture and `registry-storage` alike, and why the quotation
is a tail rather than a head. What is cut is stated - *last 60 of 200 lines* - because a reader who
cannot see that a quotation was cut has no way to know there is more, which is a silence of the family
being repaired.

### The witness, and it is a red at a commit rather than an argument

`938ded8` carries the sentence, the two new fields and all five guards, with `calibrate` still
rendering `failedGuards.join()`. `pnpm run meta` there, exit 1:

```
FAIL  instrument.test.ts > ... > a-control-that-reddens-with-no-failed-guard-still-names-its-cause
AssertionError: expected 'the unmutated C/as-committed is red, ...' to contain 'names no guard that
failed and says t...'
+ the unmutated C/as-committed is red, so every verdict from this battery would be noise:
+
Test Files  2 failed | 8 passed (10)
     Tests  2 failed | 118 passed (120)
```

**The received value is the defect itself** - the colon and nothing after it. The second red is
`every-decision-a-file-cites-exists`, refusing this record's own address until this record existed.
`7461878` points the refusal at `whyARunReddened` and that guard goes green.

The four guards in `verdict.test.ts` were seen red separately, by putting the old rendering back
inside the function and running `pnpm run meta` on the modified tree: **all four red, `3 failed | 7
passed (10)` files.** The third failing file is `instrument.test.ts`, which cannot collect at all
while the tree is dirty because `calibrate` runs at its module scope - which is precisely the reason
those four guards live where they do.

**The injected cause is an unhandled rejection and the fault it stands for is a type error**, and the
two are one shape by the table above. It is used because it is reachable: a type error needs typecheck
to be collecting, which needs a `.test-d.ts` this folder has not got, and **a lens edits files and
cannot write one**. It is deterministic - the identical report five runs out of five.

### The silence, declared rather than dressed up

**No cell watches any of this, and `confirmed-by` above is empty because it cannot be anything else.**
A `confirmed-by` entry is a `(battery, guard)` pair resolved against what that battery's suite
collects, and **no battery injects into `mutation/`** - the census reads thirteen folders and this is
not one of them. So the five guards added here have no mutant aimed at them, and none can be written
until that changes.

**That is weaker than a cell, and it is weaker in a way worth naming.** A cell is a defect somebody
wrote down, replayed on every run, which fails the instrument when it stops reddening what it names.
What stands here instead is two reds a person produced by hand and wrote down: one at a commit anybody
can check out, one under a perturbation nobody keeps. **Neither is replayed.** The day somebody edits
`whyARunReddened` into agreeing with itself, these five guards go on passing and nothing in this
repository says so.

It is the trade ADR-0200 refused this repair on, taken here rather than refused. The argument for
taking it is that the alternative is worse in kind: the fault being repaired is *an instrument that
cannot say what happened*, and leaving that in place to avoid an unwitnessed branch would be
preferring a silence that is certain to a silence that is possible.

### What no digest and no pin moved, measured rather than assumed

`pnpm run freeze` is green either side, 3 guards, and `pnpm run ledger` answers `a1eea462...` either
side - the same digest ADR-0200 recorded, which is the control that says nothing under `contracts/`
or `packages/catalogue/` was touched.

**No verdict changes and therefore no pin does.** The repair renders a sentence and decides nothing:
`verdictOf` is untouched, `SuiteRun` gained two fields no verdict reads, and the one call site that
moved sits inside a refusal that had already been reached. The five `killed-by-typecheck` pins are the
population that would have moved under the refused option, and they do not move under this one.

## What would reopen this

**A cell reaching `mutation/`.** The moment any battery injects into this folder, the silence above
stops being unavoidable and these five guards owe a mutant apiece - and `confirmed-by` here stops
being empty by necessity and starts being empty by omission.

**A reading of `printed` by anything that is not a refusal.** It is a description of a run and nothing
decides on it today. A verdict derived from it would need the measurement above retaken, because the
disagreement it records is ordinary on a mutant cell and anomalous only on a control.

**A counter-example to the last row of the table** - a type-only mutant that does *not* leave the
report green - reopens the refused option, because what that row establishes is that the shape does
not separate a fault from a detection.

**Vitest changing what it writes.** Two things here are read out of its report - `success`, and the
statuses `AN_ANSWER` names - and a runner that stops writing either reddens loudly rather than
quietly, by construction. That is the intended failure and not a hazard, but it is the event that
brings somebody back to this file.

**A run whose cause is not in its last sixty lines** makes the bound wrong. It is derived from two
readings of one suite; a third that put an error block further from the end would move it, and the
refusal states how much it cut so that such a reading is possible to notice at all.

## More Information

The reproductions live outside the repository, as CLAUDE.md rule 5 requires. Each is the command
`runSuite` runs, spelled through `THE_VITEST_ENTRY_POINT`, against `mutation/fixture/vitest.config.ts`,
with the json reporter written to a scratch path and the tree restored in a `finally`.

```sh
pnpm run meta                    # 938ded8: 2 failed | 118 passed - the witness, red
pnpm run meta                    # with the old rendering put back: 4 red in verdict.test.ts
pnpm run meta                    # green
pnpm run freeze                  # green either side, 3 guards
pnpm run ledger                  # byte-identical either side, sha256 a1eea462...
pnpm run anchors                 # every quotation resolves
pnpm run battery -- fixture      # the folder the reproductions were taken in, unmoved
```

The type-error rows of the table needed a `mutation/fixture/shape.test-d.ts` written for the probe and
removed with it, because vitest runs its typechecker only where a type test is collected. That file is
not in this repository, and the row is a reading of a state which existed for the length of one probe -
which is why it says three files where the fixture has two.
