---
status: accepted
date: 2026-08-27
decision-makers: Mathis Perron
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
fact that one does not.** The second reading, at `c44a76d` in the wired shape, is **325 s** — 26 %
above. The lesson was applied to the bound and not to the figure beside it, and the correction is worth
more than the number: **all of the spread is the tooling.** Checkout, `pnpm/action-setup`, `setup-node`
and the install went **83 s to 152 s** between the two readings; the eight suites went **167 s to
164 s**. So what a Windows leg costs is a runner setting itself up, and the work on top of it is the
stable part — which is also why the same job's per-step table above is worth reading and its total is
not.

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
    x the spread of this battery's own identical work, seven readings on
      ubuntu-latest - 1 319, 1 392, 1 417, 1 477, 1 541, 1 549, 1 566 s:
      1 566 / 1 319                                                      x 1.1873
    = the worst plausible run                                            2 519 s  42.0 min
    x what the 40 minutes already allows the longest job it was
      written against: 2 400 / 1 649                                     x 1.4554
    =                                                                    3 667 s  61.1 min

rounded up to the whole minute the field takes, which is the only rounding: **62**.

**This record shipped saying 61, on six readings, and named its own reopening condition — *a seventh
falling outside 1 319–1 549 s*. The next run measured 1 566 s.** `c44a76d` is the push that wired these
two legs, and `batteries (cli-install)` on it is that seventh. The arithmetic was re-run rather than the
clause left to be somebody else's problem, which is the whole of what a reopening condition is for.

**What that says about the form is worth more than the minute.** The input moved 1.1 % and the answer
moved one minute, so the derivation is insensitive to the reading that broke its own population. What it
also says, and this is the half to carry: **six readings did not bound the spread, and seven may not
either.** The assumption below — that this spread characterises the class — is weaker than six readings
made it look.

**What it assumes.** That the Windows job's relative spread is the ubuntu one for this battery — there
is one Windows reading and n = 1 measures no spread at all. And that the reading taken was the fastest
plausible draw, which is the conservative direction.

**What it does not claim.** It does not bound a hang, which is unbounded by definition. It does not
claim 61 is optimal. It does not claim the spread is stationary — six readings of one battery on one
platform, and the day a seventh falls outside them this arithmetic is what somebody re-runs.

**What says it landed somewhere is the check and not the argument.** 3 720 s over the worst plausible
2 519 leaves 1 201 s, which at 27.1 s a cell is **44 cells** — against the **41** the 40 minutes leave
the ubuntu leg over its own worst plausible 1 566. The two legs get about the same margin, which the
derivation was not aimed at.

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
- **An eighth reading of `cli-install` on `ubuntu-latest` falling outside 1 319–1 566 s**, at which
  point the spread the bound rests on is not the spread and the arithmetic above is re-run. This clause
  read *a seventh outside 1 319–1 549* and fired on the next run, which is the entry that has closed
  and reopened fastest in this repository; it is restated at the widened range rather than struck,
  because what it is about has not changed.
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
