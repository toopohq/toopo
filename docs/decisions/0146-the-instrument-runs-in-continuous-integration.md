---
status: accepted
date: 2026-08-21
governs:
  - mutation/selection.ts
  - mutation/print-which-batteries-to-replay.ts
  - .github/workflows/suites.yml
confirmed-by:
  - battery: meta
    guard: every-battery-answers-for-the-folder-it-injects-into
  - battery: meta
    guard: every-battery-answers-for-its-own-declaration
  - battery: meta
    guard: a-changed-file-no-battery-answers-for-is-reported-and-never-dropped
  - battery: meta
    guard: a-first-push-selects-every-battery-rather-than-none
  - battery: meta
    guard: the-entry-point-answers-for-the-whole-instrument-as-well-as-for-the-selection
  - battery: meta
    guard: nothing-publishes-to-npm-without-waiting-for-a-battery-to-be-replayed
---

# The instrument runs in continuous integration, selectively on every push and wholly before a publication

## Context and Problem Statement

`CLAUDE.md` carries an entry saying that a battery's disagreement with itself is read by nobody.
`npm run battery <name>` ends by pairing every guard of its suite against the mutants that redden it and
refuses a run where a guard is neither witnessed nor declared unreachable, and one battery of the
twenty-one - the fixture, two mutants, one arm, no property-based guard - replays on every push. The
other twenty fire when somebody happens to type the command.

**It is not hypothetical and the population is not zero.** Four instances are recorded there, and every
one of them was found by somebody replaying for another reason.

`suites.yml` refused the job in its own header, on an argument about pins being calibrated per machine.
[ADR-0145](0145-the-batteries-are-read-on-two-runners.md) replaced that argument with a reading and it
is not confirmed: the instrument runs whole on both platforms, and every disagreement attributes.

`CONTRIBUTING.md` already names the second half in as many words - *a full replay is worth its price on
exactly two occasions: before a release, and before anything is published to a registry, because that
is the last commit at which a wrong verdict is still correctable.*

## Decision Drivers

- A gate whose failure mode is silence is worse than no gate: a green run is what a reader takes it for.
- Every battery of a push must be able to report, so nothing may be excluded by a list somebody types.
- A publication is frozen for life, so the last commit at which a wrong verdict is correctable is the
  one before it.
- The cost lands on every push and has to be stated as it is rather than as a share that flatters.

## Considered Options

- Replay everything on every push.
- Replay a selection on every push, and everything before a publication.
- Replay everything nightly and nothing on a push.

## Decision Outcome

**Two gates.** On every push, the batteries that can say something about the change. Before a
publication, all of them.

A nightly replay was refused because it answers about a commit nobody is looking at: the red arrives
detached from the push that caused it, and the person who could act on it has moved on. Replaying
everything on every push was refused on the price below, which is nine times the median.

### The rule, and why it is the only cheap one

A battery answers for the folder it injects into and for its own declaration. The second half is not a
convenience: editing `cli-install.battery.ts` changes what this repository claims about `packages/cli`
without changing `packages/cli`, and a claim nobody replays is what the instrument exists against.

**Nothing follows imports, and that is a measurement rather than a shortcut.** Taken over every tracked
`.ts` at `66cdb3f`, folder by folder, source edges and test edges together:

    packages/cli, packages/registry, packages/site,
    packages/validation, packaging, mutation          one strongly connected component of six
    packages/catalogue                                reaches nothing
    contracts                                         reaches packages/catalogue and nothing else

Each of the six reaches every other transitively, in both directions. **The transitive closure of any
one of them is all of them**, so an import-following selection selects everything on every push, which
is not a selection at all.

### A range that cannot be read selects everything

A first push of a branch hands `0000000000000000000000000000000000000000` as the commit before it; a
force-push hands one the checkout may not hold. Both mean *this cannot tell what changed*, and that
must never resolve to *run nothing*. The two are told apart in what is printed, because a reader
deciding whether a full replay was warranted needs to know which of them happened.

`any` is a separate output because GitHub fails a job whose matrix is an empty list rather than
skipping it, so the gate reads the boolean and never the array's length.

### The price, measured rather than estimated

**The population is the runs and not the commits.** GitHub starts one run per push, on the tip, so the
ordered list of runs of `suites.yml` on `main` is the list of pushes - which is what the gate sees,
since `github.event.before` is the previous tip. Pricing per commit would count a push of four commits
as four gates.

Read at `b20a678` over the 39 pushes from `694a7a6` to `9d05552`, with each battery at ADR-0145's
`ubuntu-latest` seconds:

    wall clock of one gate, which is its longest selected battery
      median    578 s      worst   1497 s      8 of 39 select no battery at all
    runner seconds, which is the sum of what it selected
      median    578 s      worst   4698 s      mean   1099 s
    a full replay on the same platform
      wall     1497 s      runner  5389 s

**Two shares, because one of them alone flatters.** At the median the gate is **11 %** of a full replay
in runner seconds; by the mean it is **20 %**, and the mean is the one that says what a month of pushes
costs. Nineteen of the thirty-nine are `site`, which is why the median is 578 s: **the gate roughly
quadruples the time a verdict takes to arrive on the commonest push**, from the two and a half minutes
the eight suites answer in. It blocks nobody - those suites still answer in two and a half minutes -
but a publication gated on the second gate waits for the whole of it.

**Fifty-five further pushes are in the runs and are not priceable**, and the reason is worth the line:
ADR-0124 reissued every commit of this graph, so a run from before it names a commit this history does
not hold. The population is therefore every push since the rewrite, which is what `694a7a6` marks.

**The second gate is 21 jobs against a ceiling of 20**, so one of them queues behind the rest and its
wall clock is above the 1497 s of the longest battery rather than equal to it.

### The gate seen red on a push of this history, and the correction that came out of it

A gate believed before it has been red is the thing this repository refuses everywhere else, so it was
replayed against a push that should have reddened it.

**ADR-0145 names `50ff990` as that push and it was not one.** `gh run list` holds no run for
`50ff990`, nor for `35d7115`, nor for `aa94e33`: the five commits from `50ff990` to `7c9906c` were
pushed together, and GitHub starts one run per push on the tip. So the gate would never have seen
`50ff990` as a range end - it sees `github.event.before .. github.sha`, which for that push is
`bc88230..7c9906c`.

That distinction is not pedantry, and replaying `50ff990` is what showed it. At that commit the
unmutated registry suite is **red** - `every-binding-anchors-a-commit-and-the-check-reaches-all-of-them`,
because ADR-0106's rule means the commit that publishes cannot anchor and the anchoring arrives at
`7c9906c`. A gate pointed there would refuse to calibrate rather than report a disagreement, and it
would be right to: *the unmutated arm is red, so every verdict from this battery would be noise.*

**At the tip, which is where the gate really fires, it is red for the right reason.** Replayed by hand
at `7c9906c`:

    node mutation/print-which-batteries-to-replay.ts bc88230 7c9906c
      20 files changed, 8 of 21 batteries answer for them
      cli-install cli-remove cli-search cli-update number-round-spec number-round
      registry-storage site
      7 changed files no battery answers for, among them mutation/census.ts and mutation/published.ts

    npm run battery -- registry-storage --only=S-12
      calibration R/as-committed   control green (407 tests)
      calibration R/as-committed   I-05 killed
      S-12   R/as-committed        survived   DISAGREES
      S-12 on R/as-committed: expected killed, measured survived
        no longer caught by: a-query-the-catalogue-cannot-answer-answers-nothing

Exit 1, with the control green at 407 tests either side of it - so the apparatus is sound and the
disagreement is the battery's. **The run of `suites.yml` at `7c9906c` concluded `success`**, which is
the whole claim of this record in one line: eight green suites, a green `meta`, a green `tsc` and a
green continuous integration, and a battery that had stopped agreeing with itself.

The seven files no battery answers for include `mutation/census.ts` and `mutation/published.ts`, which
is the third gap below arriving in the demonstration itself rather than in a paragraph about it.

### Consequences

**Good.** The entry `CLAUDE.md` has carried for the life of the instrument closes: a battery's
disagreement with itself is read on every push for the folders a push touches, and on everything before
anything reaches npm.

**Bad, and named rather than smoothed.** The guards over both gates live in `mutation/`, which no
battery injects into and no census counts, so they are born unwitnessed by construction. That is the
class `CLAUDE.md` already keeps an entry for, and the eight guards `workflows.test.ts` already holds
are in it. Writing them anywhere else would be worse: a guard about `suites.yml` in a folder that is
not about `suites.yml` is one nobody finds.

**Bad.** `seedsAreFrozen` is false by decision, so a pin is checked against one draw wherever it runs.
Twenty replays a day is twenty times the draws, and a thin pin will redden a healthy tree more often
than it does today. **The cost is not symmetric and that is the half to plan for**: a draw on the first
gate is a red somebody re-runs, and a draw on the second is a publication that waits. What classifies
one is the criterion committed at `26e2000` before any result of it existed and carried here so that it
outlives the branch it was written on - re-run the battery at the same commit, and agreeing the second
time makes it a draw rather than a defect.

### What the gates do not reach

**A guard reddened from another folder.** The six regions above are one strongly connected component,
so a change in `packages/registry` can redden a guard of `packages/cli` and no cheap selection reaches
it. What bounds it is the second gate, which is to say the cadence of publication rather than *never*.

**`packages/catalogue/`.** It is reached by all six and injected into by none, so it is at once the
folder where the rule answers *no battery* and the folder where an edit reaches furthest. It is printed
rather than dropped, and a guard keeps it printed. `sharedHarnessOf` already derives, for a contract,
the files its harness imports outside its folder; turning that into a selection is a unit of its own
and is not taken here.

> [ADR-0149](0149-a-change-to-the-instrument-selects-the-batteries-it-is-read-by.md) narrowed this by
> one file. `identifier.ts` is read by every run of a battery and is now answered for;
> `every-contract.ts` is read by the contract suites and by no run, so the gap is what remains of this
> paragraph rather than the whole of it.

**The shared modules of `mutation/`.** `run.ts`, `published.ts`, `mutants.ts` and `attribution.ts` are
what every battery is built out of, and a change to one of them selects nothing. Refused on the price -
it is a full replay by another name - and not overlooked.

> **Both halves of that sentence were wrong, and
> [ADR-0149](0149-a-change-to-the-instrument-selects-the-batteries-it-is-read-by.md) closed it.** The
> four names are one too many and three short: `published.ts` is on no battery's execution path, and
> `census.ts`, `measure.ts` and `paths.ts` are read by every run. **Nothing had derived that list** - it
> was written from a reading of what the instrument looked like, and it is left standing above with this
> beside it rather than corrected in place, because what it says about the gate's population at
> `9d05552` is what a reader of that gate needs.
>
> And the price was a different walk's. Following what a suite imports does select everything, which is
> the measurement above; following what a *run* reads closes on eight files and costs +5.2 % of wall
> clock over the same population.

**A runtime.** `suites.yml` carries two floors because the question there is which runtimes pass. A
battery measures what a suite catches and not which runtime ran it, so the gates run one runtime, and
they inherit ADR-0145's own deliberate absence.

## What would reopen this

- A draw reddening the second gate and delaying a publication, which is the cost stated above arriving
  in fact rather than in prose. The criterion classifies it; what would reopen this is the rate.
- A guard reddened from another folder reaching a publication, which is the hole the second gate bounds
  and does not close.
- The price moving, which it does whenever a battery does. It is a reading of one column of one table
  and it carries the commit it was taken at.
- A second cell whose verdict depends on the environment, which is what would turn a per-cell
  declaration into a shape rather than an exception. ADR-0145 already names it.

## More Information

`the-reading.yml`, on the annotated tag `evidence/the-batteries-on-two-runners`, is where the
selection-and-matrix shape here was first written and first run. Its `which` job reads `THE_BATTERIES`
by importing `published.ts` with no install at all, because that module and its whole import closure
reach nothing outside node's own - the same property the `version` job of `suites.yml` is built on.
