---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/remove-directory.ts
  - vitest-entry-point.ts
  - run-vitest.ts
  - mutation/census.ts
confirmed-by:
  - battery: cli-remove
    guard: a-project-is-removed-while-another-process-still-holds-it
  - battery: meta
    guard: a-battery-invoked-under-a-lower-case-drive-letter-collects-its-suite
  - battery: meta
    guard: the-launcher-invoked-under-a-lower-case-drive-letter-collects-its-suite
  - battery: meta
    guard: only-the-drive-letter-is-pinned
---

# A control that is red with nothing injected

## Context and Problem Statement

A replay refused itself: `cli-install`'s calibration answered *the unmutated `C/as-committed` is red, so
every verdict from this battery would be noise*. Sixty-three verdicts built on a red control would have
looked exactly like verdicts.

Three separate causes produced that one symptom, and two of them were first filed under a reading that
turned out to be wrong.

## Considered Options

- Treat the intermittency as state leaking between batteries, and serialise the runs.
- Reproduce each cause in isolation and repair it where it is.

## Decision Outcome

**A replay refused itself, and the refusal is the instrument working.** `cli-install`'s calibration
answered *the unmutated `C/as-committed` is red, so every verdict from this battery would be noise*,
naming `the-commands-that-reach-the-registry-are-these-and-no-others`. Sixty-three verdicts built on a
red control would have looked exactly like verdicts.

**One intermittent guard produced two failures that named anything but itself.** In another replay the
same guard reddened while a `cli-search` mutant was injected, and the attribution concluded *declared
silent and a mutant reddened it* — a stale declaration reported against a mutant with nothing to do
with it. Neither report can say *this guard is intermittent*, because neither is looking at that.

**It was never that guard's assertion.** All 169 assertions were collected and its seven booleans were
right. The failure was in its `finally`: `rmSync` answering `EPERM` on the temporary project it had
installed into. A teardown that throws reddens whichever guard happens to be running, and this
instrument reads a red guard as a verdict — so a removal failing in a `finally` produces a cell that
looks exactly like a kill. **That is the third member of the family `run.ts` names twice**, arriving
from the apparatus rather than from the contract, and none of the three guards written for that family
can see it: an edit that does not apply and a suite that half ran are both about what the *run*
collected, and this run collected everything.

### The reading it was filed under was wrong, and the arithmetic says so

**The reading this was filed under was wrong, and the arithmetic is what says so.** It was recorded as
state leaking between batteries on the strength of *0 red in 30 runs of the unmutated `cli` suite
alone*. Measured at `71e3f13`, over that same suite, alone, sequential, with nothing injected and no
battery anywhere: **3 reds in 139 runs — 2.16 per cent**, 95 per cent Clopper-Pearson [0.45, 6.18],
every one of them the same exception at the same line. At that rate thirty clean runs happen **52 per
cent** of the time. *Clean in isolation, faulty in sequence* was the sample size and not a signature.
**Nothing leaks between batteries, and the parallelisation this was said to stand in front of is not
blocked by it.**

**So the rule this produces is about the shape of the evidence, not about this defect.** A run of zero
over *n* trials bounds nothing until *n* is put beside the rate being looked for. Thirty was about a
thirtieth of what this question needed, and *0 red in 30* was true, was measured, and carried a
conclusion it could not support — which is this repository's own diagnostics rule arriving on a
measurement instead of on a screen: an inference offered with its premise is argument, a conclusion
offered alone is assertion, and the premise here was a number nobody had compared with anything. It is
`G-14`'s lesson met from the other side. There a pin claimed a determinism the draws did not have; here
a silence claimed an absence the trials could not establish.

**Two readings were built and refuted rather than argued**, which is the whole reason the third one
could be believed. The working directory on its own — **0 failures in 400 rounds**. The `git`
subprocess an install spawns, which is the one thing this guard does that its forty-two neighbours do
not — **0 in 200, across four arms**. What *is* established is that a directory held as a process's
working directory answers exactly `EPERM` on exactly `rmSync`, and that `command.test.ts` is the only
one of this folder's 43 teardowns that ever makes a project the working directory. **What holds it
during the natural failures is not established**: 600 rounds outside vitest reproduced none, so nothing
here names one. The previous version of this section refused to name a cause for the same reason, and
that refusal is what left the question in a state somebody could still measure.

**`maxRetries` is not the mechanism, because it does not work.** Measured on node v24.15.0, three runs
alike, against a directory held as another process's working directory:

```
rmSync(root, { recursive: true, force: true })                        EPERM after 0ms
rmSync(root, { recursive: true, force: true, maxRetries: 10, ... })   EPERM after 0ms
await rm(root, { recursive: true, force: true, maxRetries: 10, ... }) removed after 634ms
```

Node documents that option as retrying exactly `EPERM` when `recursive` is true. The synchronous form
answers in zero milliseconds, which is the shape of an option read and dropped. Reaching the
asynchronous one would turn this folder's 43 teardowns, every helper above them, and `rewrite.ts`
through to `command.ts` into promises — and `command.ts` is the file whose whole property is that
everything it decides is reachable from a guard with no process. So the retry is written in
`remove-directory.ts` with the measurement beside it, which is the treatment `ignored.ts` already gives
`git check-ignore`'s exit codes.

**The sweep found the same defect on the install path, and there it is worse.** `rewrite.ts` removes
the folder it parsed a submission's imports in from a `finally`, and a `finally` that throws replaces
what was being returned — so an `EPERM` there turns a rewrite that worked into an install that failed,
on the one path that writes into somebody else's project. One module answers for both callers, because
there is one rule about an operating system and a copy in each would be two.

**The guard is seen red on the real condition rather than on a reconstitution.** A child process holds
the project as its working directory and writes a sentinel before anything is removed, so the guard
cannot pass by winning a race against a holder that never started. With the retry taken away it answers
the identical `EPERM` on the identical call; with it restored the directory goes.

**Before and after, over the same loop at two commits.** 3 in 149 at `71e3f13`; **0 in 700** at
`2995c0d`. If the repair had changed nothing, P(0 in 700) = 6.6 × 10⁻⁷, and 0 in 700 bounds that class
under **0.427 per cent** against 2.01 — a margin of about five, which is what a repair is chosen on
rather than on the second decimal of either figure.

**And the after arm found a second cause of the same symptom, which is the whole argument for measuring
a repair instead of declaring one.** One run in 700 reddened
`only-what-the-removed-feature-alone-pulled-in-goes-with-it`, and it was not `EPERM` but
*Test timed out in 5000ms* — on a run that took **62.4 s against a 6.0 s median**, a stall of ten.
Measured over ten idle runs, the slowest guard of this folder is 2 688 ms, which is **1.9 times** that
default and 1.4 under load: a threshold that gives way at a stall of two, in the one folder whose guards
wait on a compiler, on `git` and on a disk. It was nobody's decision — no contract says an install
finishes in five seconds — so `packages/cli/vitest.config.ts` now declares 60 000, twenty-two times the slowest
guard, and the sentence in `packaging/vitest.config.ts` claiming everything else here decides in memory
is narrowed, because it was already false of `cli/` when it was written.

### The third cause: a drive letter

**The third cause is closed, and it was the drive letter after all — the correlation the last unit was
right not to promote on the evidence it had.** Twice in eight battery invocations a run collected
**nothing at all**, and both times `assertTheCensusHolds` refused before a verdict existed, naming each
file and its declared count. What stopped a cause being named was arithmetic: 28 collected assertions
is not the 0 a lower-case drive had been separately measured to give. **Both figures are that one door,
read through two configurations.** The contracts' own declares five `.test-d.ts`, which tsc collects in
the parent process where no worker is involved, and 9 + 5 + 4 + 5 + 5 is 28; `packages/cli/vitest.config.ts`
declares no typecheck files at all, so nothing survives and the run collects 0 of 170. Under the
lower-case spelling all sixteen runtime files fail with `TypeError: Cannot read properties of undefined
(reading 'config')`.

**It is not a rate, which is why nobody could reproduce it.** Measured over twenty runs of each
spelling: `c:\...\toopo` collapses **20 of 20**, `C:\...\toopo` collects 472 **20 of 20**. The spelling
is carried rather than produced — `realpath` does not normalise a Windows drive letter,
`import.meta.url` keeps whatever resolved the entry point, `join` carries it on — and both shells
measured normalise a typed `cd`, which is exactly why fifty invocations through npm and through node
had reproduced nothing. What does not normalise is a script named by a lower-case absolute path:
`node c:\...\mutation\measure.ts fixture` refuses at calibration from a shell whose own directory is
`C:`. Eight invocations from mixed launchers giving two collapses was never a probability — it was a
predicate on the invocation, counted as though it were one, which is this record's own lesson
arriving on the defect that closes it.

**And the two paths a run is given were separated rather than moved together.** `runSuite` hands the
child a working directory and an entry point, and the twenty-run measurement above varied both at
once. Split, on the same suite: `cwd C: entry c:` collects **28**, `cwd c: entry C:` collects **472**.
**The working directory is irrelevant; the path node is given for `vitest.mjs` decides.** A
configuration cannot defend itself either — canonicalising `root` inside `packages/site/vitest.config.ts` and
running from a lower-case entry point still collects 0 of 78 — so the only place the spelling can be
fixed is where the path is built, which is why `vitest-entry-point.ts` is one constant and not one
per caller.

**The half of this that was not ours is closed, and what closed it is a reframing rather than a
measurement.** Every script that starts vitest reached it through `node_modules/.bin`, whose shim
derives `vitest.mjs` from wherever PATH found it — and an ordinary `npm run site` collapsed exactly
this way: seven files, no test, root `c:/...`, while node in that same shell answered `C:` for its
working directory moments later and the next `npm run site` collected all 78. What produced that
spelling was not isolated and is still not guessed at. It was priced and refused once, on the reading
that it is loud rather than dangerous — the run exits non-zero having collected nothing, so no verdict
is ever built on it. **That reading is true of the instrument and false of a stranger**: somebody who
clones this on the day it is published and types `npm run site` gets `TypeError: Cannot read
properties of undefined (reading 'config')` with no explanation and no relation to what they just did,
on the first project whose front page sells verifiability. `run-vitest.ts` is the entry point every
script now goes through, and `vitest-entry-point.ts` owns the rule both routes share.

**The count in that paragraph was wrong before anybody read it back, and it is dropped rather than
corrected.** It said *the five `npm run <suite>` scripts*; seven start vitest — `test`, `meta`,
`registry`, `validation`, `cli`, `site`, `packaging` — and `npm test` was the one missing from a
sentence about what a stranger types. It is the fourth count retired in `CLAUDE.md`, on the rule the
others established: a state does not drift where a tally does, so the sentence now says *every script
that starts vitest* and has no number to go stale.

**What the repair costs, measured rather than asserted, because a cost paid on every commit by every
contributor for ever is a design question and not a footnote.** One node process per suite: median
**134 ms** through the launcher against **76 ms** direct, over ten invocations of `--version` each.
Bare `node -e ""` is **54 ms** on the same machine, so the 58 ms is the process itself and about 4 ms
is stripping the two modules — irreducible short of not having the process, and a plain `.mjs`
launcher would buy those 4 ms at the price of a file the typechecker never sees. Across the seven
suites that is **0.41 s**. Against a full pass — **34 s** on the machine this repair was asked from,
**38 s and 49 s** on two runs of the machine it was built on, which are two machines and are said to be
two — it is below the noise rather than a share of it: those two runs of identical work differed by
**11 s**, and `packaging` alone moved **7.7 s** between them, nineteen times the whole cost of the
change.

**What is shared is the rule and not the launching**, and that is written in `run-vitest.ts` because
it is what somebody will undo. `mutation/run.ts` goes on building its own child command — it needs
pipes to read a report back, a pinned `TZ`, a json reporter named beside the default one and an output
file it chooses, none of which a forwarded command line can express. Both import
`THE_VITEST_ENTRY_POINT`; neither restates it.

**Three guards, and the third was measured on its own.** `mutation/instrument.test.ts` holds them
together because there is one door and two routes into it. On the edit that makes
`withCanonicalDriveLetter` the identity all three redden — 3 failed, 29 passed. On an edit that leaves
the rule alone and has `run-vitest.ts` build its own path, **only the third reddens** — 1 failed, 31
passed — and its assertion prints the door verbatim under both of the fixture's files. No edit was
found that reddens the second alone, and that is recorded rather than left to be assumed from the
symmetry.

**And it is the drive letter and nothing else.** `C:\users\...`, `C:\...\toopo\toopo` and both mistakes
at once each collect 472 — so the repair upper-cases the drive letter and touches no other segment,
because the rest of a path is a claim about spellings that live on the disk rather than in a function.
The elisions are a redaction of one machine's home directory, taken when this repository was swept for
publication; the case of every segment shown is the spelling that was really run, which is what this
measurement is about.

**Pinned rather than refused, on the argument `Battery.timeZone` already makes.** That field pins the
process time zone because a verdict measured under whatever zone the operator's machine carries is not
one anybody else can reproduce; a drive letter is the same ambient input reaching the same apparatus,
so `vitest-entry-point.ts` chooses one spelling and every child process started here is given it.
Refusing would have cost a replay and taught an operator to relaunch, and the two spellings name one
directory. **The census stays the backstop, and it is why this was ever a door rather than a mystery**:
the red-control refusal prints `control.failedGuards`, and no guard failed — *a red control with no
failed guard says only that something did*. What said which sixteen files, twice, is the census.

**And the census now quotes the run instead of only counting it**, which is the filed remedy built
rather than dropped once the door was named. It listed the empty files and threw away the one sentence
saying why they were empty: vitest reports it per file in `testResults[].message`, `runSuite` read past
it, and that silence is what cost two replays. A fault line now carries `the run said: <what it said>`,
and the refusal names the entry point it ran — the spelling the isolation above shows is the deciding
input. Under this door the two lines read `Cannot read properties of undefined (reading 'config')` and
a path beginning `c:`, which is the whole diagnosis on one screen.

**Seen red on the real condition rather than on a reconstitution**, by a guard that invokes the
instrument exactly as a launcher that does not normalise invokes it. With the rule made the identity the
child answers `control RED (0 tests)` and calibration refuses on the census; with it restored the
fixture battery agrees with every verdict pinned for it. A second guard beside it pins that only the
drive letter moves — a function upper-casing the whole path would keep every replay green, since
`C:\users\...` collects all 472. `paths.ts` also ends four copies of the same two lines: `run.ts`,
`replay.ts`, `tally.ts` and `instrument.test.ts` each derived the folder and the root from their own
module URL, and a rule about one of them held in four places is held in none.

## Consequences

**And a leak the sweep found beside it.** `withNoGit` made an empty directory per call and removed
none — one per run of this suite, 1 933 of them under the operating system's temporary directory on the
machine where this was found. It is now made once and removed with the file, and what is checked is the
delta per run rather than a total anybody would have to trust: `1, 2, 3` before, **0 on every one of
700 runs** after.

**A fourth event of this family is recorded and not diagnosed, which is the whole of what one event
supports.** The first of the two replays taken at `d9f4506` reported *`cli-search`:
`every-shape-of-import-is-repointed-and-not-only-the-obvious-one` is declared silent and a mutant
reddened it*. Rerun alone, immediately afterwards, that battery agreed on all twenty of its cells and
the guard was silent again; the second full replay was clean throughout. So the event is not
deterministic, and the two things it is not are worth writing down: it is not that battery's cells,
which reproduce, and it is not the unit that was running, which edits nothing under `cli/`.

The guard reaches `rewrite.ts`, which is one of the two callers of `removeDirectory` — the module this
record exists for, whose retry gives up after 2 750 ms. That is a *candidate* and it is left as one.
**Nothing here establishes it, because the instrument cannot say why a guard failed**: a reddened
silence declaration is reported as a stale declaration and the exception behind it is not carried, which
is the limit this record already names — neither report is looking at whether a guard is intermittent.

**What forbids going further is this record's own lesson rather than a shortage of time.** *0 red in
30* was true, was measured, and carried a conclusion it could not support; *1 red in 2* is the same
shape with the sign reversed. A rate needs a trial count put beside the rate being looked for, and two
replays is not that at any price — the cheap form is the isolated loop that settled the `EPERM` case,
and it is not this unit's to run. What is owed is that the observation exists with its date, so the
next occurrence is a second event rather than a first one.

## Confirmation

The `EPERM` half is held by a guard that reproduces the real condition — a child process holding the
project as its working directory — rather than a reconstitution. The drive-letter half is held by three
guards over one door and two routes into it, and the third was measured on its own because no edit
reddens the second alone.

## What would reopen this

A fifth event of the family, which would make the fourth a second occurrence rather than a first. The
observation is recorded with its date for exactly that.

## More Information

- [ADR-0053](0053-what-a-pin-on-a-re-drawn-property-may-claim.md) — the same lesson about evidence,
  met from the other side.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
