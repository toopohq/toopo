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

### The bound

**Every recent reading of this battery on a runner is censored.** A killed job says *at least forty
minutes* and nothing more, so no bound can be derived from the six of them: a median over censored
data is not a median. Taking an uncensored reading requires raising the bound, and raising the bound
is what the reading is for — which is circular, and is why a throwaway branch carries a provisional
75 minutes that is chosen to be far above any plausible reading rather than derived from anything.

The uncensored reading this section is derived from is being taken on the branch this commit sits on,
and the derived bound replaces the provisional one on `main`. Until it does, this section states what
is known and no number: every reading of this battery since `1238833` is a lower bound of forty
minutes, and the one reading below that is `6d03933`'s 39 min 49 s.

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
