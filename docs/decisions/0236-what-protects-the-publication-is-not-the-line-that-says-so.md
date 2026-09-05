---
status: accepted
date: 2026-09-05
governs:
  - .github/workflows/suites.yml
  - CLAUDE.md
confirmed-by: []
---

# What protects the publication is not the line that says so

> **This record overstates its own finding once, and the correcting sentence is one this record
> wrote.** §3 says the concealed red *would have concealed it indefinitely*. It would not:
> `every-battery` is gated on `github.ref == 'refs/heads/main' && needs.version.outputs.unpublished ==
> 'true'` and `publish` declares `needs: [site, version, every-battery, every-battery-on-windows]`, so
> the next publication replays every battery and the unaccounted guard reddens **before `npm
> publish`**. A guard nothing accounts for is invisible between two commits and never at the moment
> that decides.
>
> **The bound was already written in the paragraph this record repaired.** `suites.yml` reads *it is
> bounded by `every-battery`, which a publication waits for whatever the per-push selection did* —
> put there by this unit, then left out of this unit's own account of what the gap costs. What the
> episode proves is that the diff selection leaves an **interval**, not a breach. ADR-0239.

## Context and Problem Statement

**This unit begins with the assistant breaking the thing it then measured.** The owner was waiting on two
runs before closing the previous unit. A push of `main` was made while one of them sat queued, and it
cancelled that run. The reasoning that led to the push was written down an hour earlier in this same
session — *the concurrency group keeps the verdicts separate* — and it was wrong.

`suites.yml` carries a paragraph whose subject is exactly that, and the paragraph agrees with the wrong
reading:

> So what is protected is every run of `main`, which is a superset of the ones that publish and costs a
> duplicated run on the rare second push.

Fifteen lines above it, the same paragraph states what it exists for: *a cancelled publication is
indistinguishable from one that never happened, for anybody reading the run*. So the question is not
whether one sentence is loose. It is whether the mechanism that sentence describes protects the one act
this repository cannot undo.

Four things, in order: **is a queued run on `main` really deleted by a later push**; **can that reach
`publish`**; **what would close it**; and **the sentence, repaired either way**.

**Nothing is built here.** No guard, no job, no configuration. `THE_PACKAGE_VERSION` stays at `1.2.0`,
the ledger reads `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, nothing under
`contracts/` moves, and neither half of ADR-0218's item 3 is taken.

## Decision Drivers

* **The owner's reading is measured before it is believed**, on this repository's own trace and on the
  vendor's own words, because a reading confirmed by the person who proposed it is the shape ADR-0042
  refuses.
* **A route is named or it is not claimed.** *This could reach the publication* is a worry; what is owed
  is the sequence of pushes and what a reader would see afterwards.
* **A mitigation may be a written rule.** The owner said so in advance, and it matters because the
  alternative here is a configuration change to the one line standing between a push and an
  uninterruptible act.

## Considered Options

Two, on the closure alone, and the record's own measurement decides between them: `queue: max`, which
GitHub offers for exactly this; or nothing, with the reason written where somebody reaching for the knob
arrives.

## Decision Outcome

### 1. The reading holds, on two independent sources

**The trace.** Three runs of `main`, read on the API:

| run | head | created | status |
| --- | --- | --- | --- |
| `33970163708` | `98aba43` | `13:52:42Z` | `in_progress` throughout, **untouched** |
| `33970943153` | `12c9fee` | `14:09:01Z` | pending, **nought jobs**, cancelled `14:34:26Z` |
| `33972213437` | `4674b09` | `14:34:25Z` | pending, took its place |

**One second between the creation of the third and the cancellation of the second, and the second ran no
job at all** — `total_count` is `0`, so it was ended before a job existed to be ended. Meanwhile the run
that was actually executing was not touched by either later push, which is the half `cancel-in-progress:
false` really buys.

**The vendor's words.** `cancel-in-progress` decides the *running* half; the pending half is `queue`,
which this file does not set and which therefore takes its default `single`: *"At most one job or
workflow run can be `pending` in the concurrency group. When a new job or workflow run is queued, any
existing `pending` job or workflow run in the same group is canceled and replaced."* The two sources
agree and neither was derived from the other.

**So the sentence in `suites.yml` is false in both of its clauses.** What is protected is the run in
progress, not every run of `main`; and a second push costs the queued run rather than "a duplicated
run" — nothing is duplicated, because the queued one never starts.

### 2. It does not reach `publish`, and the reason is not this line

**The route was looked for and it terminates.** Suppose a push moves `THE_PACKAGE_VERSION` to a version
npm does not hold while an earlier run of `main` is still executing. That run is protected, so the new
one queues. A second push arrives — anything at all, a corrected sentence — and the queued run is
cancelled. The version moved and its run never happened.

**The next run publishes it anyway.** `packaging/print-whether-to-publish.ts` is one line of arithmetic:

    const unpublished = !held.has(declared.version)

npm's listing against the manifest on disk. It reads no diff, no base, no previous commit. The
superseding push is a descendant, so its own checkout declares the same unpublished version, its
`version` job answers `true`, and `publish` fires there. **The publication is deferred by one run and
not lost.**

**That is ADR-0111's argument arriving on a cause it did not name.** That record refused the proxy *did
this commit move the number* and gave its reason: it "would still miss a bump pushed under a later
commit, because GitHub runs a workflow once per push and on the tip." A superseded run is the same
failure by a different road — a commit that moved the number and whose run did not happen — and the
state comparison answers both. **The publication is protected by the condition and not by the
concurrency line**, which is the finding: the paragraph claiming to protect it is the one that is wrong,
and the thing that actually protects it is in another file and was written for another reason.

**Three residues were looked for and named.** A superseding push that moves the version *back* leaves it
unpublished, which is correct rather than a hole. A surviving run that is red publishes nothing, and a
red is visible. And the last push of any sequence always has a run, so the deferral is bounded by
somebody stopping.

### 3. What it does reach, and that half is silent

**The battery selection.** `which-batteries` is a diff from the push's base, so a superseded push's own
diff is chosen by nobody: the superseding run selects `base → new tip` and the batteries owed to the
skipped step are never replayed. This unit produced the instance: `12c9fee` moved `packages/site/`,
`mutation/site.battery.ts` and `mutation/census.ts`, and the diff to `4674b09` is `docs/` and
`CLAUDE.md`, which selects nothing — so cell `W-179` and the census `10 → 12` that ADR-0234 wrote have
been replayed by no run.

**It is bounded and it is invisible, and the second half is worse.** Bounded, because `every-battery`
runs before any publication whatever the per-push selection did — the same bound ADR-0146 already states
for the change no cheap selection answers for. Invisible, because **a superseded run has no jobs**, so
`every-job-answered` is not among them: ADR-0222 built that guard to make a cancellation say so, and it
is total over the jobs of its own run and therefore blind by construction to a run that has none.

**And the instance was not an unreplayed battery. It was a red one.** The rerun of `33970943153` was
taken to close this entry's own debt, its selection was pre-registered — `98aba43..12c9fee` must choose
`site`, 1 of 23 — and the runner reproduced that line for line. **`batteries (site)` then failed**, and
the cause is one line of the report: `never red, UNACCOUNTED FOR (1)`, naming
`no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it`. ADR-0234 added two guards
to `read-literal.test.ts` and answered for one: `W-179` pins
`a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime` and
`every-arm-of-an-encoded-value-is-read-back-or-refused-by-name`, and the disjointness guard is named
**nowhere** in `mutation/site.battery.ts` — measured, nought occurrences — by no cell, no
`unprobedRegions` and no `unreachableGuards`. The census moved `10 → 12` so calibration passed; it is
the *accounting* that refused, which is ADR-0206's entry — *a new guard is answered for as many times
as it is collected* — firing on a unit whose own file carries that entry.

**So the supersession concealed a red gate for ninety-six minutes**, and would have concealed it
indefinitely: `4674b09` is green and selected no battery, so nothing on `main` says the tree carries an
unaccounted guard. **What was priced in this entry as *a battery not replayed* is measured as *a battery
red and unheard*, which is a different severity and it was found by paying the debt rather than by
reasoning about it.** The repair is a cell aiming at the disjointness — filing `temporal` under
`WITHOUT_A_SPELLING` in `literal.ts` while it stays in `READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT` is the
single edit that falsifies the guard's own sentence — or a declared region if that edit turns out to
redden it only alongside the spelling guards. **It is not taken here**, because a cell is written
against a red seen first and this unit's subject is the concurrency, and because a repair landing inside
the record that found it would make the finding its own justification.

### 4. What would close it, and why it is not taken

**`queue: max` is the knob and GitHub names it**: up to a hundred pending in the group instead of one.
It is not taken, on two grounds and the second is a measurement this unit could not make.

* **The hole reaches no irreversible act**, which is what §2 establishes. What it costs is a battery
  selection already bounded by the publication gate.
* **GitHub refuses `queue: max` beside `cancel-in-progress: true`** — "not allowed and will result in a
  workflow validation error" — and `cancel-in-progress` here is an *expression* that is `true` on every
  branch. Whether the validation reads the literal or the evaluated value is **unmeasured**, and the
  only way to measure it is to move the configuration and push, which is the one thing this unit may
  not do. A knob that might make every branch run fail to validate is not taken on a reading of the
  documentation alone.

**So the mitigation is a written rule and that is the result rather than a shortfall**: do not push to
`main` while a run of `main` is queued. It is one sentence, it costs nothing, and it is kept by whoever
reads it — which is exactly as much as this repository can honestly claim for it, and is why it is an
entry of the open list rather than a mechanism.

### 5. A figure of ADR-0219 does not reproduce, found by measuring the term a decision needed

ADR-0235 left one thing to the owner: which of the two readings the `T` entry of `AS_AN_ARGUMENT`
takes. Pricing that branch needs to know whether a bare string names one carrier among the three
ADR-0225 admits, and **carrying ADR-0219's figure across would have been a transposition** — that table
was taken when the arity was five and the arity is now three.

**The first reading published here was wrong, by the mechanism this record had just written a head
note about.** It reported *one spelling of seven*, over a population of seven this unit assembled
without stating — and that seven left out every date-and-time form but one, the zoned form ADR-0219's
own table names, and the seconds-less form ADR-0219's own head note names. A population narrower than
the claim, committed in the unit that names the class, on the day it names it. The owner counted two
and was short for the same reason at a smaller scale; ADR-0219's head note counted three over twelve
strings and is short of this one.

**So the count is not the finding, because every one of those counts is a function of a population
somebody chose.** Re-measured over a population stated row by row — every string ADR-0219's table
names, every string its head note names, one spelling of its own for each admitted carrier, and the
ordinary forms a reader types — Chrome 152 and V8 13.6.233.17 agreeing row for row: **4 of 12 are
ambiguous, and the rule behind them is total over the twelve.**

| | |
| --- | --- |
| a date **and** a time, no `Z` | **4, every one taken by `PlainTime` and `PlainYearMonth`** — `2026-01-15T12:30:00`, `2026-01-15T12:30`, `…-05:00[America/New_York]`, `…-05:00` |
| a date and a time **with** `Z` | 1, taken by **none** of the three — `2026-01-15T12:30:00Z` is an exact time and the arity holds no exact-time carrier |
| everything else | 7, each taken by exactly one — `12:30:00`, `12:30`, `2026-01`, `2026-01-15`, `P1D`, `PT1H`, `P1Y2M3D` |

**A string is ambiguous over the three admitted carriers exactly when it carries a date and a time and
no UTC designator**, because `PlainTime.from` takes the time out of such a string and
`PlainYearMonth.from` takes the year-month out of the same one. That is derivable, it accounts for all
twelve rows, and it needs no count — which is this repository's own first rule for a figure, arriving
on three readings that each published one.

**The control refutes the table it was a control for.** Rebuilt row for row on the engine ADR-0219
names: `2026-01-15` is **4** where that record publishes 3, `2026-01-15T12:30:00` is **5** where it
publishes 4, and the zoned string is **7** where it publishes 6. The four rows reading `1 each` agree.
**Every disagreement is short by exactly one and the missing carrier is `PlainMonthDay` all three
times.** The cause is measured rather than guessed: `Temporal` offers **eight** carriers, **seven have
`add`** and `PlainMonthDay` has none — so seven is exactly right for every question this catalogue has
asked about Temporal, all of which are arithmetic, and ADR-0219's table asks a *parsing* question, whose
population is the eight that have `from`. It inherited the arithmetic population. ADR-0219 carries the
note; its conclusion is untouched, resting on an ISO string not determining its carrier, which holds at
4, 5 and 7 as it held at 3, 4 and 6.

### 6. The decision ADR-0235 leaves to the owner, in one sentence

> **Which reading the `T` entry takes: `a-literal`, where the reader types the carrier's own spelling
> and the form therefore knows which of the three carriers is meant — at the cost of a sentence
> composed onto every such contract page by `spelledFields`, and of a field that refuses by name until
> a runtime carries `Temporal`; or `the-text-itself`, where the reader types a bare `12:30:00` and
> `build` constructs the carrier — at the cost of the entry having to choose a carrier from text that
> names none, which it can do for a string carrying a date or a time but not both, and cannot do for
> any string carrying both, every one of which `PlainTime` and `PlainYearMonth` accept alike and those
> two are exactly the pair whose verdicts the contract exists to publish.**

Both branches are equally inert on today's matrix, so the runtime is not what separates them.

**The rule is what makes that branch dearer than a corner case, and it is why the recount was worth
taking.** Read as a list of collisions it is a handful of odd spellings; read as the rule, `the-text-
itself` guesses on **the whole class of date-and-time strings** — and each admitted carrier having an
unambiguous spelling of its own means the reader guessed at is precisely the one who does not yet know
which carrier they want, who is the reader a playground exists for.

## Consequences

* **`suites.yml`'s paragraph says what the mechanism does**: the run in progress is protected, the
  queued one is replaced, the publication is safe for a reason living in another file, and the battery
  selection is what is actually lost. The configuration is unchanged.
* **The convention gains a line nobody can enforce**, and it is written as such rather than dressed as a
  mechanism.
* **ADR-0222's guard has a named blind spot**: it is total over the jobs of a run and a superseded run
  has none. That is not a defect of the guard — no job of a run can report on a run that never had one —
  and it is worth knowing before anybody reads its green as covering cancellation in general.
* **A published figure of ADR-0219 is corrected by a head note**, with its single cause, and this
  repository has a fourth instance of the class ADR-0233 named: a population faithful to the question
  that selected it, carried into a question it is not faithful to.
* **And a fifth instance was committed by this record, in the section that names the class.** The
  first reading of the ambiguity swept seven spellings nobody stated and missed three of the four that
  matter. It was caught by the owner reading, as the last four have been. **What it cost is one draft
  and what it bought is the rule**: a count over a population somebody assembled was replaced by a
  property of the format, which is the difference between a figure three readings disagreed on and a
  sentence none of them could have disagreed with.
* **The instance this unit created is not repaired by it.** `12c9fee`'s battery selection is owed a run
  and the only route is `gh run rerun 33970943153` once the group is empty, which cannot be done while
  a run is queued without recreating the fault.

## What would reopen this

* **A measurement of `queue: max` against an expression-valued `cancel-in-progress`.** If it validates,
  the closure costs one line and the ground for refusing it falls to the first alone. It cannot be taken
  from the documentation and it cannot be taken without pushing, so it belongs to a unit whose subject
  is the workflow.
* **A publication condition that stops being a state comparison.** Everything in §2 rests on
  `!held.has(declared.version)`. The day anything makes that a diff, the route to `publish` opens, and
  the entry stops being about a battery selection.
* **A second instance of the battery gap.** One is an accident; a rate would make the written rule
  insufficient and turn `queue: max` from a convenience into a repair.
* **A guard able to see a run that has no jobs.** That is the only shape that would make the silence
  reportable, and nothing in this repository can be it — a job cannot report on the run it was never
  created in.

## More Information

* ADR-0111 moved the trigger onto the version and wrote the condition this record leans on; ADR-0109
  puts `publish` behind the suites and the environment; ADR-0146 decides which batteries run when, and
  states the bound this gap falls inside.
* ADR-0222 derived the ubuntu bound and built `every-job-answered`, whose population this record names.
* ADR-0235 costed ADR-0218's item 3 and left the reading to the owner; ADR-0219 is the record whose
  table is corrected here, and ADR-0225 is the arity that made its illustration fall.
* The probes are `ambiguity.mjs`, `ambiguity.html`, `the-table.html`, `why-seven.html` and
  `recount.html`, run at `4674b09` and `eaeacb8` on Chrome 152.0.0.0 headless and on node v24.15.0
  with V8 13.6.233.17 under `--harmony-temporal`. They are outside the tree, as rule 5 requires of a
  reading that is not a guard. **The first four carry the reading the fifth corrects**, and they are
  named rather than replaced because the correction is about the population and not the arithmetic.
