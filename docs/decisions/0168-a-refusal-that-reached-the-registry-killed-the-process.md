---
status: accepted
date: 2026-08-27
governs:
  - packages/cli/command.ts
  - packages/cli/published.ts
  - packages/cli/toopo.ts
  - packages/cli/a-client-over-http.ts
  - mutation/cli-install.battery.ts
  - mutation/packaging.battery.ts
  - mutation/census.ts
confirmed-by:
  - battery: cli-install
    guard: a-refusal-that-reached-the-registry-exits-one-and-says-nothing-on-the-error-stream
  - battery: cli-install
    guard: a-refusal-lets-the-process-end-rather-than-stopping-it
  - battery: cli-install
    guard: a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way
  - battery: packaging
    guard: no-module-the-archive-carries-ends-the-process-itself
---

# A refusal that had reached the registry killed the process, and the ending was the half nothing watched

## Context and Problem Statement

The published client refused correctly and then died. Reproduced at `d962426` on Node v24.15.0,
win32, three times in three, in an empty folder:

```
$ node dist/packages/cli/published.js add nonsense/nothing

  Refused, and nothing was written.
    the registry holds no contract called `nonsense/nothing`

Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

Every part of that but the last line is right. The name really is one the registry does not hold, the
sentence is the one written for it, and nothing was written to the project. **What follows the refusal
is the defect**, and it was on `toopo@1.0.4` as npm serves it — on the most likely mistake a stranger
makes, which is typing a name the catalogue does not have.

**The exit code has three readings and the record needs all three, because they disagree about what
kind of thing happened.** The raw status is `3221226505`, which is `0xC0000409` — the Windows
fail-fast code. PowerShell's `$LASTEXITCODE` and `cmd`'s `ERRORLEVEL` under `/v:on` both report it as
the signed `-1073740791`. **git-bash reports `127`**, which is the code a POSIX shell keeps for
*command not found*. So a CI script that mistypes a contract name is told that `toopo` is not
installed — the failure does not merely lie, it points at the wrong cause.

**Nothing here could have noticed.** The refusal is decided by `prepareInstallation`, which is
guarded; the sentence is rendered by `renderRefusal`, which is guarded; the absence of a write is
guarded. Every one of those guards stops at the sentence, and the process was still alive when they
read it. `command.test.ts` could not have caught it either, and not by oversight: it calls `run` in the
test's own process, where `process.exit` had to be replaced by a throw for the suite to survive a
single command — so the exit code was a stand-in for itself and the ending was not observed at all.

## What the defect is, measured rather than reasoned about

No cause was inherited from anywhere. What follows is the order the measurements were taken in,
including the two hypotheses the measurements killed.

### It is `add`, and only where the registry answered nothing

Twelve commands in a fresh empty folder, and the same twelve in a folder `init` had written a
`toopo.json` into:

| command | fetches | ends |
| --- | --- | --- |
| `add nonsense/nothing` | 1 | **aborted**, `3221226505` |
| `add array/group-by` (refused contract) | 1 | **aborted**, `3221226505` |
| `add string/slugify --implementation nonsense` | 2 | clean, `1` |
| `add string/slugify` | 4 | clean, `0` |
| `remove nonsense/nothing`, one feature installed | 0 | clean, `1` |
| `remove number/parse`, one feature installed | 0 | clean, `1` |
| `search zzqqxx` | 2 | clean, `0` |
| `list`, nothing installed | 0 | clean, `1` |

The fetch column is counted rather than inferred: `globalThis.fetch` was wrapped by a module preloaded
with `--import`, which appends one line per call before the entry point is evaluated.

**Two readings of the brief this unit started from are corrected by that table.** `remove` of an
unknown name was reported as a refusal that reaches the origin; it fetches nothing, because the folder
had no lockfile and `theLockfile` refuses before the loop. And `add NOT A NAME` — a name that is not
even well formed — takes the same path and aborts the same way, so the shape of the argument decides
nothing.

### The count was the wrong reading, and the product itself refuted it

*One fetch aborts, two do not* survives the table above and is false. Against a server on this
machine's own loopback, the two swap over — five runs of five each, and both spellings of the address
answer identically:

| | `127.0.0.1` | `localhost` |
| --- | --- | --- |
| one fetch, then `process.exit(1)` | clean ×5 | clean ×5 |
| two fetches, then `process.exit(1)` | **aborted ×5** | **aborted ×5** |
| one fetch, then `process.exitCode = 1` | clean ×5 | clean ×5 |

So it is not the number of requests, and it is not a name having to be resolved.

### It is a race, and the ladder is what shows it

Against `https://toopo.dev/contract-index`, five runs each:

| | |
| --- | --- |
| `process.exit(1)` with no asynchronous work at all | clean ×5 |
| a 10 ms timer, then `process.exit(1)` | clean ×5 |
| one fetch, then `process.exit(1)` | **aborted ×5** |
| one fetch, body left unread, then `process.exit(1)` | **aborted ×5** |
| two fetches at once, then `process.exit(1)` | **aborted ×5** |
| two fetches in sequence, then `process.exit(1)` | clean ×5 |
| one fetch, one tick, then `process.exit(1)` | **aborted ×5** |
| one fetch, 10 ms, then `process.exit(1)` | **aborted 3 of 5** |
| one fetch, 200 ms, then `process.exit(1)` | clean ×5 |
| one fetch, 2 000 ms, then `process.exit(1)` | clean ×5 |

**Three of five at ten milliseconds is the signature.** A defect that depends on how long after a
`fetch` the process is stopped, and that has a transition zone rather than a threshold, is a race. Two
sequential fetches are clean because the second one's latency *is* the delay; two at once are not,
because there is none. A timer alone is clean, so it is not asynchrony in general — it is what a
connection leaves behind.

**What the cause is, in the words the measurements support**: `process.exit` stops node where it
stands and tears libuv down under whatever is still live. After a `fetch`, the machinery that
connection left behind is still settling, and something signals an async handle that the teardown has
already marked closing — which is the assertion at `src/win/async.c:76`, `uv_async_send` refusing to
post to a closing handle. **Which handle is not named here, because nothing measured names one.**
ADR-0042 is the rule; what is established is the trigger, its timing profile and its cure, and not the
identity of the object.

### The class is wider than `process.exit`, and that is the finding that changed the repair

Three runs each, against the same origin:

| after one fetch | |
| --- | --- |
| a top-level `throw` | **aborted ×3** |
| an unhandled rejection | **aborted ×3** |
| `process.exitCode = 1`, then a top-level `throw` | **aborted ×3** |
| `process.exitCode = 1`, ending naturally | clean ×3 |
| ending naturally | clean ×3 |

An uncaught throw ends a node process by a different path and hits the same race. `command.ts` was
written to let an unexpected error through as a crash — deliberately, so that a bug is loud — so the
client had a second door onto exactly this defect, and a repair that only removed `process.exit` would
have left it open. **The scope of the repair is therefore how a command ends at all, not how it
refuses.**

## Decision Drivers

- The refusal was already correct; nothing about the decision, the sentence or the write discipline is
  in question.
- The exit code is part of what the tool promises, and `127` is a lie about the kind of failure.
- `command.ts` is thin so that everything it decides is reachable from a guard with no process. How a
  command *ends* is the one thing that offer does not cover, and it is where the defect lived.
- No leg of this repository's CI runs on Windows, so a guard whose red needs the race is a guard CI
  cannot see.

## Considered Options

- **Close the connection before ending.** Reaching into undici's global dispatcher to shut it down
  before `process.exit`. Refused: it is a hack against an internal, and it repairs one door of two.
- **Wait before ending.** Measured to work at 200 ms. Refused as the deferred fix the quality bar
  forbids: it buys a race with a longer fuse, and it is a delay on every refusal for ever.
- **End the process nowhere.** `run` answers what the process should end with, one frame reports and
  converts every ending into a code, and the process ends by having nothing left to do.

## Decision Outcome

**`run` answers `HowItEnded`, and nothing under it ends the process.**

`refuse` throws `TheCommandRefused` instead of printing and exiting, so the four helpers nested inside
the dispatch have one way out rather than two. One frame at the top of `run` catches it, prints the
refusal, and answers `1`; the same frame catches anything else, prints its stack on the error stream,
and answers `1`. The two entry points assign that answer to `process.exitCode`. **A bug is still
loud** — the stack is the one node would have printed — and what it no longer does is take the ending
with it.

The code is *answered* rather than written into `process` from inside, and that is what makes it
guardable: a command that ends the process cannot be run twice, which is why `command.test.ts` was
replacing `process.exit` at all. That stand-in is gone.

Verified by the same command in both directions. Before: aborted three times in three,
`3221226505`. After: three times in three,

```
  Refused, and nothing was written.

    the registry holds no contract called `nonsense/nothing`
exit=1
```

Both scope sweeps were re-run whole: nineteen readings, every one clean, every exit code the one the
command means.

## The guards, and which of them can be red where

Four, and they are not four readings of one claim.

**`a-refusal-that-reached-the-registry-exits-one-and-says-nothing-on-the-error-stream`** is the defect
as a person meets it: a real process, a real socket, exit `1`, no signal, an empty error stream. It
runs both refusal shapes, and **the one that reddens it here is not the one in the bug report** —
against `toopo.dev` the unknown contract aborts and the unknown implementation is clean, and against a
registry on loopback they swap over, the unknown implementation aborting five times in five. Anybody
narrowing this guard to the reported command would lose its red without losing its green, so both are
run and the comment says why.

**`a-refusal-lets-the-process-end-rather-than-stopping-it`** is the cause, in the one form that is
observable anywhere. `beforeExit` runs when the loop has nothing left, and is skipped by both endings
this record is about. It is deliberately not a second reading of the exit code: a process that was
killed can have set the right code on its way, which is what a repair writing `process.exitCode`
*before* a `process.exit` would do.

**`a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way`** is the control. The two above
are both about a command that refuses, and a repair that ended every process identically by never
letting one succeed would satisfy both. It asks for a `search` rather than an install, for the reason
the section below gives at length: a control that installs is a control that any defect in the plan,
the rewrite, the lockfile, the configuration or the git question reddens, and that is a different
subject.

**`no-module-the-archive-carries-ends-the-process-itself`** is total over what ships: the population is
the tarball's own `.js`, so a module added to the archive joins it with nobody editing the guard. It
reads text, and it says so.

All four were seen red at `d962426` with `process.exit(1)` put back in `refuse`:

- the crash guard failed with the libuv assertion as its own failure message, and the control beside it
  stayed green — the neighbour measured rather than asserted;
- the portable guard failed `expected false to be true`;
- the archive guard failed `expected [ 'dist/packages/cli/command.js' ] to deeply equal []`, alone
  among the twenty-three guards of that suite.

The apparatus is `packages/cli/a-client-over-http.ts`: the client on a socket in a process of its own,
taking its origin from the environment. It is the client's side of the seam `serving-over-http.ts` and
`serving-a-tree.ts` are the server's side of, and it ships no more than they do — `tsconfig.dist.json`
compiles the closure of `published.ts` and nothing else. The origin arrives in the environment rather
than in the arguments so that the grammar under measurement is the product's own, word for word.

**C-73, C-74 and C-75 of `cli-install` are what redden the three on every run.** C-73 is this record's
own defect restored; C-74 refuses with an ordinary error, so the frame reads a decision as a bug and
prints a stack where a sentence belonged; C-75 stops the process on the way out of a command that
succeeded, which is the one path the other two do not travel. Three doors, not one defect three times.

## The accounting is per suite, and the red run it cost found a defect in a guard

A guard file lands in the accounting of **every battery that collects its suite**, not of the battery
whose folder it describes. `packages/cli/` is measured by four — `cli-install`, `cli-remove`,
`cli-search`, `cli-update` — and all four collect `packages/cli/vitest.config.ts`. Three new guards
therefore arrived in four accountings at once, and only one of them had cells for them.

`cli-install` was run locally and was 74/74 with nothing unaccounted, which is exactly the reading that
made the other three look answered. They were not: the run at `aefd323` failed with `cli-search`
naming three unaccounted guards and `cli-remove` and `cli-update` naming two each.

**That is two findings and not one, and the first is the ordinary price.** `cli-search` is the clean
instance: nothing there reddens any of the three, nothing declares them, and the battery refuses — no
defect of any kind, just a guard that arrived in an accounting nobody told. The second finding is why
the other two said *two* rather than *three*, and it is a defect in a guard; it is below.

**So the price of a guard is one line and it is worth stating as one**: adding a guard to a folder
costs **one battery file per battery that collects that folder, plus the census**. Measured over
`THE_BATTERIES`, that is `packages/cli` at four, each of the seven contracts at two, and
`packaging`, `packages/registry`, `packages/site`, `packages/validation` and `mutation/fixture` at
one. `packages/cli/` is the most expensive folder in this repository to add a guard to, and this unit
paid it: **five files for three guards** — cells in `cli-install`, a declaration in each of
`cli-remove`, `cli-search` and `cli-update`, and a count in `mutation/census.ts`.

One battery must *witness* it and the rest must *declare* that they do not, because the instrument
refuses silence in both directions: an unwitnessed guard nothing accounts for is `unaccountedFor`, and
a guard declared silent that some mutant reddens is `wronglyDeclaredSilent`. Neither is a defect —
both are the price, and nobody will know it next time if it is not written down.

**The obvious repair was to declare the `3, 2, 2` as measured, and it was wrong.** The asymmetry was
`a-command-that-did-what-was-asked-exits-zero-and-ends-the-same-way`, which ran `add` — so it reached
the plan, the rewrite, the lockfile, the configuration and the git question, and any mutant of any of
those reddened it. The sets it was red on:

| | reddened the control |
| --- | --- |
| `cli-install`, win32 | C-08, C-22, C-42, C-69 |
| `cli-install`, ubuntu | C-08, C-22, C-42, **C-49, C-50**, C-69 |
| `cli-remove`, ubuntu | **R-20** |
| `cli-update`, ubuntu | **U-15** |
| `cli-remove` / `cli-update`, win32 | nothing |

Three of the five additions have a causal path — C-49 edits `configuration.ts`, C-50 edits `ignored.ts`
and U-15 edits `write.ts`, all of which an install reaches. **R-20 has none.** It edits `list.ts`,
whose only runtime export is `listProject`, reached by the `list` branch of `command.ts` and by nothing
else; `report.ts` imports a *type* from it and no value. So that red was the guard failing for a reason
that is not its subject — and a guard that does that makes every verdict naming it worth nothing. It
did not reproduce here: the file was run 30 times over and was green 30 times.

**So the repair is the guard and not the declaration.** The control asks for a `search` now — a command
that fetches, succeeds, and touches no project, no configuration, no lockfile and no subprocess. It is
the smallest command with the two properties the guard needs, *it fetched* and *it succeeded*, and
everything that made it broad is gone with the install. All three guards are now unprobed in all three
neighbouring batteries, in one sentence rather than three.

**And the control needed a witness of its own, which the install had been supplying by accident.**
C-75 ends the process on the way out of a command that did what was asked. C-73 and C-74 both leave
through the frame's `catch`, so neither touches that path. It reddens the control on win32 by aborting
and on every platform by skipping `beforeExit` — seen red here with the libuv assertion as its failure
message, both neighbours staying green.

No mechanism is proposed for the per-suite accounting itself. The instrument caught it on the first
push, named every guard and every battery, and the cost was one red run — which is the argument this
repository already states for not writing a guard whose event is cheap. **What the run bought was
larger than what it cost**: a guard reddening on a mutant that cannot reach it is invisible to a green
suite, and only the accounting of a battery that had no business witnessing it made it visible.

## Consequences

**Nothing is published, and `THE_PACKAGE_VERSION` and `package.json` stay at `1.0.4`.** A publication
fires on a push of `main` declaring a version npm does not hold — ADR-0111 — so moving the number *is*
the release. Whether this goes out is the owner's decision and it is not taken here. Until it does,
`npx toopo@1.0.4 add <a name that does not exist>` goes on aborting on Windows.

**This CI could not have caught the defect it has just repaired, and that is measured rather than
inferred.** `suites.yml` carries **seven `runs-on:` and every one of them is `ubuntu-latest`**; there
is no Windows or macOS runner anywhere in `.github/`, and the only occurrence of `windows-latest` in
the whole directory is a comment at line 98 describing a measurement taken elsewhere. The abort
belongs to libuv's Windows implementation — the assertion names `src/win/async.c` — so no gate this
project owns could ever have gone red on it.

**The sharper form of that is the one this repository refuses everywhere else.**
`a-refusal-that-reached-the-registry-exits-one-…` is green on every runner of this project *while the
defect is live*. It is not decorative — it is red where the defect exists, and this machine is where
that was seen — but on the machines that decide whether a push is good, it is a guard that cannot
fail. What answers there is `a-refusal-lets-the-process-end-…`, and CI has now demonstrated it:
`alone on C-73` on ubuntu, merely `red on C-73` here.

**Linux was unreadable from the machine this was measured on, and CI answered it on the first run.**
No Linux was reachable here — the docker daemon was not running, and the only WSL distribution
registered is Docker Desktop's own utility image — so this section was written owing a reading. The
run at `aefd323` took it, and the answer is in one line of the `cli-install` attribution:

| C-73, the defect restored | reddens |
| --- | --- |
| win32, this machine | `a-refusal-that-reached-the-registry-exits-one-…` **and** `a-refusal-lets-the-process-end-…` |
| ubuntu-latest, CI | `a-refusal-lets-the-process-end-…` **alone** |

So on Linux, `process.exit` after a `fetch` leaves the exit code at `1` and the error stream empty:
the abort does not happen there, and the structural argument — that the assertion names a Windows-only
source file — is now a reading as well. **The class is not wider than this record says.**

**It is also the demonstration that the portable guard was worth writing.** On the runners that gate
every push, C-73 is caught by `a-refusal-lets-the-process-end-…` and by nothing else — the cell is
`alone on C-73` there and merely `red on C-73` here. Had this unit shipped only the guard that reads
the exit code, CI would have been green on the defect this record is about.

**What it does not establish**: that no arrangement on Linux aborts. What was measured is this cell,
on this runner, at this commit.

**Node v24.15.0 is the only runtime read.** The matrix is `['22.18.0', '24']`; 22 was not measured
here.

**One promise is slightly narrowed and it is worth naming.** `command.ts` used to let an unexpected
error out as a crash. It is now caught, reported with its stack, and answered `1`. The information a
reader gets is the same; what changes is that a bug can no longer be observed as an abnormal
termination. `command.test.ts` pays that back by raising anything written to the error stream during a
run, so a bug inside a command cannot pass through the suite quietly.

## What would reopen this

A Windows leg in `suites.yml`. Two of the four guards would then be red in CI on the real condition
rather than on a text, and the readings this record had to take by hand would be taken by the machine.

**The argument for it is this unit and it is measured, not felt**: seven jobs, seven `ubuntu-latest`,
no Windows runner anywhere in `.github/` — so the gate that decides every push could not have gone red
on a defect that was live in the published package, on the most likely mistake a stranger makes. What
stood between that and a silent gate was one guard written on purpose because CI has no Windows leg.
That is a thin margin, and it was a judgement rather than a mechanism.

It is not decided here. It changes what every push and every publication costs, and the battery matrix
with it — `packages/cli` alone is four batteries, and the second gate replays all of them before
anything reaches npm.
