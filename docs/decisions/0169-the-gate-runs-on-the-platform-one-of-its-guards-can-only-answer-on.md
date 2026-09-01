---
status: accepted
date: 2026-08-27
governs:
  - .github/workflows/suites.yml
  - mutation/selection.ts
  - mutation/print-which-batteries-to-replay.ts
  - mutation/cli-install.battery.ts
confirmed-by:
  - battery: meta
    guard: every-battery-holding-a-cell-one-platform-alone-measures-is-named-to-the-gate
  - battery: meta
    guard: the-entry-point-answers-for-the-platform-no-gate-of-this-file-can-measure
  - battery: meta
    guard: every-job-gated-on-the-version-is-one-the-publication-waits-for
---

# The gate runs on the platform one of its guards can only answer on, and the bound was read rather than argued

## Context and Problem Statement

[ADR-0168](0168-a-refusal-that-reached-the-registry-killed-the-process.md) repaired a crash that
reached readers: `toopo add` of a name the registry does not hold refused correctly and then aborted on
win32, with an exit code git-bash reports as `127` — *command not found*, on the most likely mistake a
stranger makes. Its own reopening clause is this unit in one line: *a Windows leg in `suites.yml`*.

Measured at `88bfb54`: **seven `runs-on:` in `suites.yml`, every one `ubuntu-latest`**, one file in
`.github/`, and the single occurrence of `windows-latest` in the whole directory a comment at line 98
describing a reading taken elsewhere. So no gate this project owned could have gone red on that defect.

**A second thing was in the same state one floor down, and it is not the same thing.** `C-64` of
`cli-install` removes the retry from `removeDirectory`; POSIX unlinks a directory another process is
standing in, so off Windows there is no defect and [ADR-0147](0147-a-published-count-carries-the-platform-it-is-true-on.md)
makes that an applicability — `expectedHere` answers `not-applicable` and `measureCell` returns before
injecting. That is correct and it is not the problem. The problem is that the **`killed` half of that
pin is exercised by no runner this repository owns**, and the guard it names,
`a-project-is-removed-while-another-process-still-holds-it`, is named by no other cell at all:
measured at `88bfb54`, `theMeasurement().whereThePlatformDecides` is one row and that guard appears in
no cell without an `onlyOn`.

**The brief this unit began from said the repository *pins a thing nothing verifies*, and that is
false.** The two answers are both pinned and the POSIX one is checked on every ubuntu run; `suites.yml`
lines 114–117 already say so. What is true is narrower and sharper, and it is the sentence this record
is written on.

## Decision Drivers

- A leg on a job where nothing platform-specific can fail is a leg that cannot redden — the same defect
  one floor up, added by the repair.
- `every-battery` is 23 jobs under a 40-minute bound before every publication, and the slowest is
  `cli-install`. Doubling that is a cost, not a detail.
- A bound is not a guard. Crossing it detects nothing and kills a publication at the one moment that
  does not replay.
- A criterion written after seeing a result is written by the result. ADR-0145.

## Considered Options

- `windows-latest` across the board — every job, both gates.
- One leg on `suites`, which is where ADR-0168's guards live.
- One leg on the battery gates, which is where `C-64` lives.
- Both, on different jobs, at different prices.

## Decision Outcome

**Both, and the finding is that they are two things.** The brief treated them as one. They are caught by
different jobs at prices that differ by a factor of eight, and **neither buys the other**:

- The three guards of ADR-0168 are ordinary guards of `packages/cli/how-a-command-ends.test.ts`,
  collected by `npm run cli`, which is a **step of the `suites` job**. They spawn a real process and
  read its exit code, so the defect reddens them with no mutant injected.
- `C-64` is a pin of the instrument. Exercising it needs `npm run battery cli-install`.

### The reading

Taken on a throwaway branch carrying one workflow and two scripts, the way ADR-0145 took its own, with
the criterion in that workflow's header and committed before any run of it had finished. The branch is
`the-windows-reading`, its commit is `36e4bbb`, and the run is `33085599394`. No `suites.yml` was
edited there: a branch runs its own copy of every workflow, so measuring inside that file would have
meant editing the gate that keeps a branch from deploying and from publishing.

    ubuntu-latest    node v24.19.0        windows-latest   node v24.19.0
    one run, six jobs, all started within a minute of one another, at `36e4bbb`

**Leg (a), the eight suites.** 125 s against 257 s.

    step                        ubuntu   windows        step              ubuntu   windows
    set up job + checkout           4 s       8 s       registry            19 s      25 s
    pnpm/action-setup               5 s      39 s       validation           5 s       7 s
    actions/setup-node              4 s      33 s       cli                 23 s      31 s
    pnpm install                    1 s       3 s       site                12 s      14 s
    contracts                       5 s      11 s       packaging            5 s      16 s
    meta                           32 s      56 s       the freeze           5 s       7 s
                                                        whole job          125 s     257 s

The eight suites go from 106 s to 167 s, which is 1.58; the tooling goes from 14 s to 83 s, which is
5.9, and **72 of the 132 seconds of difference are two actions**. Anybody optimising this should know
which half it is in.

**That 257 s was published as though a job had a duration, in the record that derives a bound from the
fact that one does not.** Three more readings in the wired shape, at `c44a76d`, `df91920` and
`7d979c4`:

    checkout, pnpm/action-setup, setup-node, install     83 s   152 s    47 s   100 s    x3.2
    the eight suites                                    167 s   164 s   158 s   139 s    x1.20
    the job                                             257 s   325 s   211 s   244 s    x1.54

**This record then said *all of the spread is the tooling and none of it is the work*, and the fourth
reading made that false.** The suites had gone 167, 164, 158 — six per cent, on three readings — and
then 139. It was a claim about a total that three draws happened to land close on, which is the same
mistake as the 257 one level up, made while correcting it.

What survives is the comparison and not the absolute: **the tooling spreads 105 s where the suites
spread 28**, so it dominates without being alone, and `meta` by itself moves 41 to 56 s across the
four. A total here is the runner's mood; the per-step table is the reading.

**`meta` and `freeze` had never run on `windows-latest`.** A battery runs its own folder's
configuration, so six configurations had; neither of those two is replayed by any battery — ADR-0107 is
why the freeze is not. Both are green. That was the named risk of leg (a) and it is answered by a
reading rather than by an argument.

**Leg (b), the battery.** 1 541 s against 2 122 s, and the cell the leg exists for:

    ubuntu-latest    C-64 not-applicable as expected
                     never red, not measured on this platform ... (1)
                       a-project-is-removed-while-another-process-still-holds-it
    windows-latest   C-64 killed as expected
                       a-project-is-removed-... red on C-64, alone on C-64
                     never red, not measured on this platform ... (0)

**The asymmetry ADR-0168 measured by hand is now one run.** With `process.exit` restored in the client
those guards spawn:

    ubuntu-latest    reddened 2 of 3    a-refusal-that-reached-the-registry-exits-one-... GREEN
    windows-latest   reddened 3 of 3    ... RED

with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94` on the
runner. **The restoration is wider than `C-73`** and that is worth naming: it replaces the client's own
ending, so the successful command reddens too, where `C-73` restores `process.exit` in the refusal path
alone and a `search` never reaches it. The two are the same defect and not the same population.

**The line number is not the assertion.** It reads 94 on `windows-latest` at node v24.19.0 and 76 on
the machine this was developed on at v24.15.0. Anybody who had written a guard against the line would
have been wrong; the guard reads an empty error stream.

### Where the legs are wired, and what waits for what

**Leg (a) is a job and not a leg of the `suites` matrix**, because `site` and `batteries` both wait for
`suites` and `needs` waits for every leg of a matrix — so the matrix form puts 132 s on the critical
path of every push. As a sibling it is named in `site`'s `needs`, and the path to the irreversible act
is **`publish → site → suites-on-windows`**: a skipped dependency skips its dependent, twice. It is
named there rather than in `publish`'s own `needs` because the claim is wider than publishing — nothing
is *deployed* from a tree whose Windows suites are red either, and `site` is what deploys.

**`batteries` deliberately does not wait for it.** Its reason for waiting on `suites` is that a battery
calibrates against its own suite's control, on its own platform, and this leg says nothing about that.
So the run grows only where nothing else is longer: 20 of the 75 pushes read at `88bfb54` select no
battery.

**Leg (b) is named directly in `publish`'s `needs`**, beside `every-battery`, because it carries that
job's own condition — a job gated on the same reading must run *in front of* the publication rather
than beside it.

**Its matrix is derived and never a name typed in a workflow.** `batteriesWhereThePlatformDecides`
projects `whereThePlatformDecides`, which the instrument already publishes, filtered by family. A second
such cell in another battery adds that battery with nobody editing `.github/`; the day the last one
stops being decided by the platform the list is empty, and `anyWindows` is why that is a skipped job
rather than a failed one — GitHub fails a job whose matrix is an empty list. It is not filtered by what
the push changed: a cell no runner exercises is unmeasured at every commit, not at the ones that touch
it.

### The bound, derived rather than chosen

**The single number was refused before it was read, and the same run said why.** The extrapolation
published in advance — ADR-0145's 1.316 applied to 1 542 s — said 2 029 s. The job measured **2 122 s**,
so the extrapolation was **93 s and 4.4 % low**. And two readings of *identical work at one commit*,
launched in the same minute, came back **1 541 s and 1 319 s**. One reading does not characterise this
job.

    the job, measured at `36e4bbb`                                        2 122 s
    x how far the slow tail of this battery's own identical work runs
      above its typical, ten readings on ubuntu-latest - 1 233, 1 319,
      1 392, 1 417, 1 477, 1 515, 1 541, 1 549, 1 566, 1 632 s, median
      1 496: 1 632 / 1 496                                               x 1.0909
    = the worst plausible run                                            2 315 s  38.6 min
    x what the 40 minutes already allows the longest job it was
      written against: 2 400 / 1 649                                     x 1.4554
    =                                                                    3 369 s  56.2 min

rounded up to the whole minute the field takes, which is the only rounding: **57**.

**This record shipped saying 61, on six readings, and named its own reopening condition — *a seventh
falling outside 1 319–1 549 s*. The next run measured 1 566 s.** `c44a76d` is the push that wired these
two legs, and `batteries (cli-install)` on it is that seventh. The arithmetic was re-run rather than the
clause left to be somebody else's problem, which is the whole of what a reopening condition is for.

**What that says about the form is worth more than the minute.** The input moved 1.1 % and the answer
moved one minute, so the derivation is insensitive to the reading that broke its own population.

### The clause that fired was the wrong clause, and that is this record's own defect

**It was keyed to the observed range, which grows with the sample by construction.** For exchangeable
readings the chance that the next is a new extreme is `2 / (n + 1)` — 25 % at seven, 22 % at eight — so
*outside 1 319–1 549 s* was a condition that fires about one time in four **for a reason that says
nothing about whether the number is wrong**. It is a treadmill: re-derive, widen the range, wait to
re-derive again.

**The eighth reading is the illustration and it arrived before this could be written.** `df91920`
measured **1 515 s** — a value this population had never held, inside the range, so the clause was
silent. It was silent by where the reading fell and not by anything it established.

**So the condition is keyed to the answer instead**, which is computable because the arithmetic rounds
to whole minutes. It fired on the first reading it ever judged — `7d979c4` measured **1 632 s**, and the
bound went 62 to 64 — where the clause it replaced would have fired on 1 515 s as well. That is the
difference between a condition and a treadmill, and it was not the end of it.

### The property that outlives the formula, and it is this record's finding

**A derivation that moves in response to a faster run is broken.** Not imprecise — broken. A bound
exists to survive the slow tail, so it may only move on evidence about how slow the job can get; a
number that loosens because a machine was quick has answered a different question from the one it was
asked.

**The form was `max / min` and it failed exactly that test, one reading after being defended here.**
`2903980` measured **1 233 s**, the fastest ever recorded for this job. The maximum did not move.
`max / min` went 1.2373 to 1.3236 and the bound would have gone **64 to 69** — a timeout loosening by
five minutes because a job ran faster, at which point it is 1.95 times the only Windows reading there
is and has stopped being a hang detector.

**`max / median` is what replaces it**, because it asks the question a timeout is about: how far the
slow tail runs above the typical. And the single Windows reading is treated as *typical* rather than as
*fastest*, which is the honest reading of one draw — a draw lands in the middle more often than at an
edge. Measured rather than asserted: append a reading of 1 100 s to the ten above and `max / median`
answers **57** where `max / min` answers **77**.

**Test any replacement against that property before checking its arithmetic.** The formula is a detail,
it has now been wrong once, and the property is what would have caught it before a reading did.

**A second consequence, and it is why this is better than the ratchet it replaces.** `max` only grows
but a median moves either way, so this bound can tighten as well as loosen. `max / min` could only ever
rise, which reads as conservatism and is really a number with no way back.

### What a later reading is worth, decided here so that nobody re-decides it

**The clause is a reason to look and never an obligation to edit**, and this unit nearly failed to
notice that about itself: each commit touching `mutation/cli-install.battery.ts` produces another
reading, which may move the number, which would want another commit — a repaired clause building the
treadmill the broken one built, one level up. So the conclusion is written in advance rather than
re-derived by whoever arrives next. **Look; and unless a run is approaching the bound, stop there.**
The worst plausible run is 38.6 minutes against a bound of 57, so nothing is approaching and nothing is
owed.

**The one error left in the number is declared with its price rather than bought.** There is a single
Windows reading and it could have been a fast draw, in which case this is short by however much. A
second reading would settle it, at **2 122 s of runner** — and it is not bought, because it buys
precision on a number nothing is near. The earlier refusal was that *n = 2 bounds a tail no better than
n = 1*, which remains true and is no longer the argument: what a second reading now buys is **locating
the anchor**, which is a different purchase at the same price. It is bought on the day a run approaches
the bound, which is the same trigger as above and makes a speculative expense a triggered one.

**What all of this exposes is the bound beside it, which is derived from nothing.** The ubuntu gates are
typed at 40, so as this battery's slowest reading grows their margin shrinks with nobody deciding
anything: across these ten readings it went **42 cells, then 41, then 38**. This number re-derived
itself three times over exactly that window and the typed one did not move at all. That is `CLAUDE.md`'s
entry about a bound nobody compares with what a battery costs, no longer a class but a rate.

**What it assumes.** That the Windows job's relative spread is the ubuntu one for this battery — there
is one Windows reading and n = 1 measures no spread at all. And that the reading taken was the fastest
plausible draw, which is the conservative direction.

**What it does not claim.** It does not bound a hang, which is unbounded by definition. It does not
claim 61 is optimal. It does not claim the spread is stationary — six readings of one battery on one
platform, and the day a seventh falls outside them this arithmetic is what somebody re-runs.

**What says it landed somewhere is the check and not the argument.** 3 420 s over the worst plausible
2 315 leaves 1 105 s, which at 27.1 s a cell is **41 cells** — against the **38** the 40 minutes leave
the ubuntu leg over its own worst plausible 1 632. And it is **1.61 times the job that was measured**,
where the form it replaces had reached 1.95: a bound approaching twice its subject is no longer
detecting a hang.

**A second Windows reading was priced and refused.** It costs 2 122 s of runner and takes n from 1 to
2, which bounds a tail no better than 1 does; the six ubuntu readings already give the spread for this
class of job. Thirty-five minutes of runner to move from one point to two changes no decision here, and
it is written down because it is the kind of expenditure somebody proposes again in six months.

**A macOS runner buys nothing for `C-64`**, and that is written here for the same reason.
`thePlatformFamily` sends everything that is not `win32` to `posix`, so a macOS leg answers
`not-applicable` exactly as ubuntu does. The split is a claim about filesystems and not about
`process.platform`; ADR-0147 already says a third value would be a decision rather than a widening.

## Consequences

**Good.** ADR-0168's reopening clause is closed by a mechanism rather than by a judgement: the guard
that reads a real process's exit code is now red in continuous integration on the real condition, and
the readings that record had to take by hand are taken by the machine.

**Good.** `C-64`'s `killed` half is exercised before every publication, and the *not measured on this
platform* bucket of `cli-install` goes from 1 to 0 on the leg that answers for it.

**Bad, and it is the entry this unit corrects rather than closes.** `CLAUDE.md` keeps an entry saying
nothing compares a bound with what a battery costs, whose text read *nothing before that moment says
the margin was thinning*. That is now said — for one battery, in prose, kept by nothing — and the
population of `timeout-minutes` declarations goes from two to four, of which one is derived. The
mechanism that entry prices is still refused, on its own grounds: `actions: read` on a token whose
whole argument is that it carries `contents: read`, plus a job after every matrix, plus a share to
refuse at which is itself a hand-written number.

**Bad, stated rather than smoothed.** A cell added to `cli-install` is now paid twice, and the Windows
second is 1.33 times the first. The two bounds run out together today by arithmetic somebody performed,
not by a property that maintains itself. `mutation/cli-install.battery.ts` carries that where a reader
adding a cell arrives; nothing recomputes it.

**Bad.** Every push now costs one more job, of 257 s and 325 s over the two readings, and on the 20
pushes in 75 where no battery is selected it is also the run's wall clock. The wiring is demonstrated
by the clock rather than by the graph: at `c44a76d` the ubuntu matrix finished at 16:21:34,
`suites-on-windows` at 16:24:59, and `site` started at 16:25:01 — so a deployment now waits 207 s
longer than it did.

**Bad, and it is the one thing here that could not be measured before it matters.** A skipped job does
not evaluate its `strategy`, so `every-battery-on-windows` was reported `skipped` at `c44a76d` without
GitHub ever resolving `fromJSON(needs.which-batteries.outputs.windows)`. **The first time that job
starts will be a publication.** What is established is narrower and is written down rather than
rounded up to *it works*: the condition evaluates and skips rather than failing; `which-batteries`
printed `1 battery(ies) hold a cell only a Windows runner can measure - cli-install` on that run; and
the matrix expression is the same construction as `every-battery`'s, which has resolved on every
publication so far. What is not established is this job starting.

It is the shape this record refused for the bound — *the first reading must not happen in a
publication* — arriving on the wiring, where it cannot be refused: the condition that makes the job run
is the condition that publishes, and nothing here can make one happen without the other. What could be
bought is a branch run with the condition relaxed, at the price of the job, and it is named here rather
than taken.

**What the reading cost, which is not what the legs cost.** 10 819 runner-seconds — 4 129 for the run
above, and **6 690 for a full replay of all 23 batteries that nobody wanted**. The first push of a
branch hands `0000…0000` as the commit before it, and the selection answers *every battery* rather than
*none* — `a-first-push-selects-every-battery-rather-than-none`, working exactly as written, in the
module whose comment had been read an hour earlier. The prediction that a branch carrying one workflow
would select nothing was made from the rule and not from the code that implements it.

**A guard was written too broad and the run said so.** `every-job-gated-on-the-version-is-one-the-publication-waits-for`
was first written over *jobs that replay a battery*, and reported
`publish publishes without waiting for batteries` — correctly, about a job that must **not** be waited
for: the first gate is skipped when a push selects nothing, and a skipped dependency skips its
dependent, so a `needs` on it would skip a publication whenever the push before it was quiet. What
separates the two is not the command they run but the reading they fire on. The repair is the guard and
not an exception.

## What would reopen this

- A second cell decided by a platform, in another battery. The matrix follows it with nobody editing
  `.github/`, and that is the first time the derivation would be doing work no list could.
- A cell decided by `posix`, which would give the derivation's other direction its first reachable
  instance — a name in the list that no cell of that family justifies is unreachable while every
  platform-decided cell names one family, and `mutation/selection.test.ts` says so rather than
  asserting it.
- **`max / median` for this battery leaving 1.0879–1.1074**, which is where the arithmetic above
  crosses a whole minute — today a reading above 1 657 s, or one that pulls the median below 1 473 s.
  **And the answer to it is written above rather than left open**: look, and unless a run is
  approaching the bound, stop there. Two clauses have already been replaced here — one keyed to a
  range, which fires on its own arithmetic, and one built on `max / min`, which moved when a job ran
  faster — so what reopens this is the *property*, not the next reading.
- **A run approaching the bound**, which is the one event that changes what anything here is worth: it
  is what makes the second Windows reading worth its 2 122 s, and what would make the ubuntu gates'
  own 40 minutes worth re-deciding.
- **The ubuntu gates' own margin reaching a point somebody is willing to name.** It is 38 cells and
  falling, against 42 ten readings ago, and nothing recomputes it because 40 minutes is typed. This
  record does not propose a number for it: raising a bound this unit did not measure, inside a unit
  about a different one, is the move `CLAUDE.md`'s list exists to refuse.
- `every-battery-on-windows` starting for the first time, which will be a publication and which is the
  one thing here nothing could exercise in advance.
- The `packaging` step of leg (a) losing its network, which is what makes an unreachable npm a red run
  already — the same conditional the `version` job's own comment states, arriving on a second job.

## More Information

**Ten citations of `36e4bbb` are live only while the branch is.** Measured after this unit was
written: five in `.github/workflows/suites.yml`, three here, one in `CLAUDE.md` and one in
`mutation/cli-install.battery.ts`. That commit is reachable from `refs/heads/the-windows-reading` and
from nothing else — `git rev-list --all` covers `refs/remotes/` too, and `actions/checkout` with
`fetch-depth: 0` creates `refs/remotes/origin/the-windows-reading`, which is why they resolve on a
runner.

**So deleting that branch turns ten citations dead at once**, and this paragraph exists so that whoever
meets that red knows what caused it rather than hunting for a rewrite. It is *kept* rather than merely
declared: `deadCitationFaults` sweeps the tracked tree against `--all` and the meta suite runs on every
push, so the deletion is a loud failure and not a silent one.

**ADR-0145 solved the same problem with an annotated tag** — `evidence/the-batteries-on-two-runners` —
and that route was not taken here because no tag was to be created in this unit. A branch and a tag
keep a commit reachable equally well; what a tag adds is that nobody deletes one by tidying up. That
difference is the whole of the risk, and it is written down rather than mitigated.
