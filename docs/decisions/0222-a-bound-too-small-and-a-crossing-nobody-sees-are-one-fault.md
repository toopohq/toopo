---
status: accepted
date: 2026-09-05
governs:
  - .github/workflows/suites.yml
  - mutation/every-job-answered.ts
  - mutation/check-every-job-answered.ts
  - CLAUDE.md
confirmed-by:
  - battery: meta
    guard: a-job-its-own-timeout-cancelled-is-a-job-that-did-not-answer
  - battery: meta
    guard: a-job-with-nothing-to-do-is-not-a-job-that-failed
  - battery: meta
    guard: a-job-that-failed-is-named-too-and-the-order-does-not-follow-the-input
  - battery: meta
    guard: an-answer-that-names-no-job-is-refused-rather-than-read-as-well
  - battery: meta
    guard: an-answer-that-is-not-a-set-of-job-results-is-named-rather-than-parsed
  - battery: meta
    guard: every-job-of-a-workflow-is-one-its-last-gate-waits-for
  - battery: meta
    guard: the-gate-over-a-run-runs-even-where-a-job-it-waits-for-was-cancelled
---

# A bound too small and a crossing nobody sees are one fault, and the red is built before the bound is raised

> **This record writes no contract, moves no digest and touches nothing under `contracts/`.**
> `THE_PACKAGE_VERSION` stays at `1.2.0` and nothing here reaches npm.

## Context and Problem Statement

`CLAUDE.md` carries an entry asking that *the bound a battery runs under is one anybody compared with
what a battery costs*. It has been firing, and nobody saw it.

**Measured over the last twenty-two runs of `main`.** `batteries (registry-storage)` was killed by the
40-minute bound on six pushes — `1238833`, `cc7b64b`, `870354a`, `94458f4`, `46a8a9f` and `3078f81` —
each at 40 min 16 s to 40 min 20 s. Its last completion is `6d03933` at **39 min 49 s**, eleven
seconds under.

**And the greens in between say nothing about it.** The five pushes from `d33f1d3` to `a0bbf86` are
the prose commits of ADR-0215 to ADR-0220; the selection chose no battery at all, the runs carry ten
jobs, and `batteries (registry-storage)` was *not launched*. So the record is not six cancellations
among greens — it is that **the battery has not completed once since `6d03933`**, and every run since
either killed it or never ran it.

**Nothing reddened, because `cancelled` is not `failure`.** A job killed by its own `timeout-minutes`
reports `cancelled`; the run concludes `cancelled`; and a reader looking for a red finds none. Every
cell the job had measured went with the process.

## Decision Drivers

* **The bound is a number and what hid it is a mechanism.** Raising the number repairs six occurrences
  and not the seventh. A bound raised without a red is a reprieve.
* ADR-0162 is the precedent for treating the two as one fault, in as many words: the buffer that
  killed a red run before vitest could report, and the bound that was never there, were one fault.
* So the red is built **first**, and the bound is raised after it.

## Decision Outcome

### The red

`every-job-answered` is the last job of the run and the only one whose subject is the run rather than
the repository. It waits for every other job, runs `if: always()`, and refuses any result that is
neither `success` nor `skipped`.

**`always()` and never `failure()`**, because a cancelled job produces no failure — which is the whole
subject. Without it the gate is skipped exactly when it is needed, and a skipped gate is as silent as
the cancellation it reports.

**`skipped` is not a failure.** `batteries` is skipped when the selection is empty, and both
`every-battery` legs are skipped on every push that does not publish. Refusing it would redden almost
every push this repository makes.

**It is a node script rather than a condition, and the reason is measurable.**
`contains(needs.*.result, 'cancelled')` is *false* when `needs` resolves to nothing, so a gate reading
an empty answer passes — with exactly the output a healthy run produces. `whyTheResultsAreUnreadable`
refuses an answer naming no job, which the condition cannot express. It is the same shape as a
pre-flight answering *nought faults* over a measurement it never read, one day after ADR-0221.

**Two structural guards keep it total.** The gate is found by the command it runs rather than by its
name — the way a publishing job is, because a name written into a guard is a second statement of which
job it is and the two are free to drift. And every job of a workflow must be one its gate waits for, so
a job added and left out of the list is a red rather than a job whose cancellation is silent again.

**Seven guards, seven seen red alone over seven candidates.** One pair was re-aimed before anything was
measured: two of them both asserted that a cancelled job is named, and two guards asserting one thing
are one guard with two names. The four paths of the script — a healthy run, a cancelled job, an answer
naming no job, and no answer at all — are read by hand as well.

### Both directions on a real runner, and the half of it GitHub does not give

**The guards establish what the script decides and nothing about what a runner reports**, so both were
measured. Green on run `33935566567`, where twenty-three batteries answered and the gate read nine
jobs and passed. Red on run `33952003572`, where a bound of one minute killed `validation-stage-1`
fifty seconds into its battery step:

    1 of 9 job(s) of this run did not answer:
      batteries: cancelled

**It names `batteries` and not `batteries (validation-stage-1)`**, because `needs` aggregates a matrix
into the parent — so the gate says which job did not answer and a reader opens it for which leg.

**And the run still concludes `cancelled` rather than `failure`.** Measured on that run: one job
failed, one was cancelled, and the run's own conclusion is `cancelled` — so a cancelled job outranks a
failed one at the level `gh run list` prints. **The gate makes a red job and cannot make a red run**,
which is a limit of the host rather than of the script and is worth stating plainly: what changed is
that a run which was green-or-cancelled throughout now carries an explicit red naming the job that
went silent, where before nothing anywhere was red. A reading taken from job conclusions sees it; a
reading taken from the run's conclusion alone still sees the word this record is about.

**Two attempts were needed and the first is worth a line**, because its failure was an estimate rather
than a defect: a bound of two minutes did not bite. Measured on run `33951809405`, the whole job is
**84 s** — nine seconds of setup and seventy-two of battery — against the forty and ninety-seven
assumed. The estimate was high on both terms and the demonstration passed instead of failing.

### The bound

**Every recent reading of this battery on a runner is censored.** A killed job says *at least forty
minutes* and nothing more, so no bound can be derived from the six of them: a median over censored
data is not a median. Taking an uncensored reading requires raising the bound, and raising the bound
is what the reading is for — which is circular, and is why a throwaway branch carries a provisional
75 minutes that is chosen to be far above any plausible reading rather than derived from anything.

Measured at `6203758`, which `main` does not reach: the branch was deleted and its commits are retained
by the annotated tag `evidence/the-bound-and-the-silence`, which is what
`every-commit-this-repository-cites-is-one-it-has` resolves against. **It reddened before the tag
existed**, on a clone that had the branch's objects locally and a runner that did not — the citation
guard doing exactly what ADR-0095 built it to do, on this record's own coordinate.

Every battery under the provisional bound, and every one green:

| battery | seconds |
| --- | --- |
| `registry-storage` | **3 887** |
| `cli-install` | 1 946 |
| `site` | 1 611 |
| `cli-update` | 892 |
| `cli-remove` | 529 |
| the eighteen others | ≤ 273 |

**So the bound was not a little too small: the battery costs 64 min 47 s against forty.** And what
crossed it is measured rather than inferred — `6d03933` completed at 2 389 s with the **163** cells
ADR-0210's replay left, ADR-0211 added fifty-two and ADR-0212 the rest, and it holds **230**. That is
41 % more cells for 63 % more seconds, the cost of a cell on a runner having risen with them from
14.7 s to **16.9 s**.

**`max/median` over this battery's own readings answers 1.809 and is a trap rather than a spread.**
Its median, 2 149 s, is a reading of a battery two thirds today's size, so the ratio measures the
growth and not the runner. The short batteries are the same trap inverted:
`string-levenshtein-spec` answers **1.529** over a job of 34 s, where one hiccup of eighteen seconds
is the whole figure.

**So the spread is taken where the work did not move, and that is one battery.** Over the twenty-two
runs read, `mutation/site.battery.ts` has **zero commits** and `packages/site` has **zero commits**, so
its five readings are five readings of identical work — which is the population ADR-0169's form
requires and which no other long battery offers: `cli-install` moved on eight commits and
`registry-storage` on fourteen. `max/median` = **1.042**.

| | | |
| --- | --- | --- |
| base | 3 887 s | the uncensored reading, 230 cells, on a runner |
| spread | × 1.042 | measured on the only long battery whose work is fixed → 4 050 s |
| growth | + 693 s | 41 cells at 16.9 s, ADR-0169's own margin → **4 743 s = 79 minutes** |

**One term is measured and the other is a convention said out loud**, which is ADR-0205's shape. The
bound is **1.22×** the measured job and holds **50 cells**, ten of them from the spread and forty-one
from the convention. It is 79 rather than 80 because it carries its own arithmetic in its digits,
which is that record's reason for 60 060.

**The residue is named rather than smoothed.** `max/median` can still rise when a faster reading
arrives, because a reading below the median moves the median: a 1 500 s reading of `site` would take
1.042 to 1.046. ADR-0169 chose the form knowing that and measured the alternative to be worse —
`max/min` took its own bound from 64 to 69 minutes on the fastest run ever recorded. Four tenths of a
per cent against five minutes is the trade, and it is the same trade that record made.

**The Windows leg is left where it is**, and that is a reading rather than an omission: its matrix is
`which-batteries.outputs.windows`, which is `cli-install` alone, and that battery's Windows reading has
not moved.

## Consequences

A job killed by its own bound now reddens the run. The entry of `CLAUDE.md` about the bound closes by
half: what is derived is this bound, and the general mechanism — a job reading the matrix's own
durations and refusing a share of them — is unchanged and still priced there.

## What would reopen this

* **A battery growing past the new bound.** It is the same event this record is about, and the
  difference is that it will now be a red rather than a silence.
* **A job added to a workflow with no gate.** The structural guard covers a workflow that has one; a
  second workflow file with jobs and no gate is refused by the same guard, and the guard is what says
  so rather than this sentence.
* **GitHub reporting a timed-out job as something other than `cancelled`.** The gate refuses anything
  that is neither `success` nor `skipped`, so a new outcome is caught; but the record's account of
  *why* nothing was red would need re-reading.

## More Information

ADR-0162 is the precedent for a bound and a silence being one fault. ADR-0169 carries the form for
deriving a bound and the property that decides it — a derivation that moves in response to a faster
run is broken. ADR-0205 is the precedent for a base that is measured and a multiple that is a
convention said out loud. ADR-0221 is the pre-flight this repeats one floor up.
