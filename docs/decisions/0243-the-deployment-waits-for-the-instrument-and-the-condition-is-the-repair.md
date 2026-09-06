---
status: accepted
date: 2026-09-06
governs:
  - .github/workflows/suites.yml
  - CLAUDE.md
confirmed-by: []
---

# The deployment waits for the instrument, and the condition is the repair

## Context and Problem Statement

`site` declared `needs: [suites, suites-on-windows]` and `batteries` declared
`needs: [suites, which-batteries]`, so the two were siblings: **a red battery did not un-deploy
anything**, and nothing rolled a deployment back. ADR-0146 decided *which* batteries run when and said
nothing about what the deployment waits for; the asymmetry with npm was a reading of two `needs` lines
rather than a decision anybody had taken.

**Measured on run `34018431616`**: `site` finished at `07:15:11`, `batteries (site)` at `07:45:01`, and
`every-job-answered` at `07:45:08`. The deployment landed **29 min 50 s** before the instrument had
anything to say about the commit it deployed, and because the run already ended with the battery, making
`site` wait costs the run **nothing**. That reading is what turned the entry from a trade nobody had
priced into one the owner could rule on, and he ruled: the deployment waits.

## Decision Drivers

* **`needs` alone breaks the ordinary push, and silently.** `batteries` is skipped whenever the
  selection is empty, which is most pushes here.
* **`every-job-answered` accepts `skipped`**, so a wrongly skipped deployment would be reported by
  nothing — the new silence this change could have introduced.
* **Two invariants and not one**, and the second is the one that fails quietly.

## Considered Options

* **`needs: [..., batteries]` and nothing else** — the naive form.
* **`needs` plus `if: always()`** — which would deploy from a red tree.
* **`needs` plus an explicit result allow-list** — taken.

## Decision Outcome

### 1. The propagation, measured on three surfaces

The provider's own documentation states it in one sentence:

> If a job fails or is skipped, all jobs that need it are skipped unless the jobs use a conditional
> expression that causes the job to continue.

and gives `needs.<job_id>.result` the values `success`, `failure`, `cancelled` and `skipped`.

**This repository already declared the same thing and is built on it**: `publish`'s own comment reads
*a skipped dependency skips its dependent, and the two are skipped together*, citing ADR-0146, and the
`publish → site → suites-on-windows` path is argued from it.

**What the trace shows is the override half and never the propagation itself**, and that is worth
separating rather than folding in. On run `34021980981`, `batteries` was **skipped** and
`every-job-answered` — which needs it under `if: always()` — ran **green**: a conditional expression
carrying a job past a skipped dependency, observed. **No job of this workflow has ever exhibited the
propagation in isolation**, because every job whose dependency can be skipped either carries
`if: always()` or carries the same condition as that dependency: `every-battery` and `publish` are gated
on one expression, so on an ordinary push both are false and the propagation and the condition agree.
So the reading in front of this unit is **correct**, and it is correct on the documentation and on this
repository's own declaration rather than on anything a run here has shown.

### 2. What was written, and why each clause is there

    site:
      needs: [suites, suites-on-windows, batteries]
      if: >-
        !cancelled()
        && needs.suites.result == 'success'
        && needs['suites-on-windows'].result == 'success'
        && (needs.batteries.result == 'success' || needs.batteries.result == 'skipped')

**The two suites are re-asserted by hand because writing an `if` at all replaces the implicit
`success()`.** Without those two clauses this job would deploy from a tree whose suites are red — the
property its own header has claimed since it was written, and the one a naive `if` would silently
repeal. It is the same shape as ADR-0111's finding one floor over: a sentence that never became wrong
and simply stopped being attached to anything.

**The battery is an allow-list and never `!= 'failure'`, and that is a measurement rather than
fastidiousness.** A battery killed by its own `timeout-minutes` reports **`cancelled`**, not `failure` —
ADR-0222 measured six such kills across twenty-two runs of `main`, on `registry-storage` alone — so a
deny-list would deploy from a tree whose instrument was cut off mid-replay, which is the exact state that
record exists to describe. `success` or `skipped` is the same pair `every-job-answered` already admits.

**`needs['suites-on-windows']` and not the dotted form**, because a hyphen in a context path is
subtraction.

### 3. The two invariants, and which one is the work

1. **A push that selects batteries does not deploy before they have answered.**
2. **A push that selects none deploys anyway.**

The second is the one that breaks in silence, and it is the whole reason the repair is a condition rather
than a `needs` line. The proof is therefore **two runs and not one**, both with `site` in `success` and
never in `skipped`, read on the jobs.

**They are taken on one commit and two refs**, which is what makes them comparable: a throwaway branch's
first push hands `0000…0000` as the commit before it, so the selection answers *every battery*, while the
same commit pushed to `main` diffs against `d5a00ad` and answers **none**. One tree, two selections, no
change manufactured to produce either.

**The price of that branch is stated before it is spent**: its first push replays all twenty-three
batteries, which ADR-0169 measured at **6 690 runner-seconds** and which this unit wants none of. It is
paid because the alternative is a package edit written for no reason but to move the selection, and a
change made to produce a measurement is the thing this repository refuses.

### 4. The guard is expressible, costed, and refused on the witness — the fifth time

**It can be written and the machinery exists.** `mutation/workflows.test.ts` already carries
`jobsThatReplayABattery()` and `jobsWaitedForBy()`, which is exactly the pair
`nothing-publishes-to-npm-without-waiting-for-a-battery-to-be-replayed` is built from. The invariant has
two clauses and both are readable from the file: the deploying job's `needs` names the replaying job, and
its `if` admits that job's `skipped` result. **The second clause is what makes the guard worth anything**
— a guard over `needs` alone would go green on the naive form that breaks every prose push.

**Refused on the witness.** It would live in `mutation/`, which no battery injects into, so nothing could
ever redden it — and a guard no battery can redden is not a guard here.

**The count is data now rather than an accident, and it is five rather than four.** Swept over
`CLAUDE.md`, four entries refuse a guard on this ground: the `extends` that resolves, the text of a guard
being what somebody wrote, a figure in a *Where this looked* block, and a costing's list of sites.
**ADR-0240 called itself the third and is the fourth**, which is a head note there and this unit's own
count corrected before it was repeated. This would be the fifth. **Five refusals of the same shape stop
being a series of judgements and become a property of the repository**: the meta suite is where every
claim about this repository's own files has to live, and it is the one folder the instrument cannot
measure.

### 5. A guard the workflow cited does not exist, and the claim it was credited with is wider than the
guard that does

Found while reading the file this unit edits. `suites.yml` cited
`every-job-that-replays-a-battery-is-one-the-publication-waits-for` as *what keeps a third from being
added and left out of this list*. **It occurs once in this repository, in that comment, and no suite
collects it.**

**And the guard that does exist keeps less than the sentence claimed.**
`nothing-publishes-to-npm-without-waiting-for-a-battery-to-be-replayed` filters on
`.some(...)` — a publishing job must wait for *some* replaying job — so a third replaying job added and
left out of `publish`'s `needs` is exactly what it does **not** catch. The comment is repaired to name
the guard that exists and to say what it does not keep.

It is `CLAUDE.md`'s own entry — *a comment naming a guard is naming one that exists* — met on the file
this unit governs, and by a person repeating the name in good faith rather than by any check.

## Consequences

* **A red battery now un-deploys**, and a battery killed by its bound does too.
* **A prose push still deploys**, which is the clause the naive form would have taken.
* **The run's wall clock does not move**: `every-job-answered` already waits for the batteries.
* **What the deployment pays is the slowest selected battery**, and on a push selecting none it pays
  nothing.
* **The guard is refused for the fifth time on the witness**, and the count is written down as a
  property rather than as five separate judgements.
* **A citation in `suites.yml` that resolved to nothing is repaired**, and the guard that does the work
  is named with the half it does not do.

## What would reopen this

* **A battery able to redden a guard of the meta suite.** The guard in §4 becomes writable, and with it
  the four entries the same refusal holds — five claims closing on one mechanism.
* **A second job that deploys.** The condition is written on `site` by name; a second deploying job would
  need its own, which is precisely what a guard would keep and what prose cannot.
* **A selection that is never empty.** If `which-batteries` ever answered at least one battery for every
  push, the condition's `skipped` arm would go dead and `needs` alone would do — at which point the
  clause should go rather than sit unread.
* **`batteries` gaining a result this allow-list does not name.** The pair is `success` and `skipped`
  because those are the two `every-job-answered` admits; a provider adding a fifth result would leave
  this job skipped and the run green.

## More Information

* ADR-0146 decides which batteries run when and is where this asymmetry was a reading rather than a
  decision; ADR-0241 is where the entry was picked out of the open list with the latency measured.
* ADR-0222 measured the six `cancelled` battery kills that make the allow-list the right shape.
* ADR-0230 and ADR-0240 are two of the four prior refusals on the witness; ADR-0169 is the record the
  repaired citation belongs to.
