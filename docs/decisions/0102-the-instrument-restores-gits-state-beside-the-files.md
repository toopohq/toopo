---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
confirmed-by:
  - battery: meta
    guard: a-checkout-a-cell-left-behind-is-deregistered
---

# The instrument restores git's state beside the files, and a total is not a composition

## Context and Problem Statement

A full replay of the nineteen batteries could not finish, and had not been able to for about twenty
commits. Measured at `0671e6e`: a completed `registry-storage` leaves `.rebuilt/<HEAD>` registered as a
worktree whose directory has gone, and the six batteries that follow it in `THE_BATTERIES` — `site`,
`string-levenshtein-spec`, `string-levenshtein`, `string-slugify-spec`, `string-slugify`,
`validation-stage-1` — then die in a tenth of a second each at `assertNoStrayWorktree`. So
`npm run mutation` never reached its total, `npm run tally` could never produce one, and the figures the
README and the method page publish could not be re-derived by the route those pages document.

Two mechanisms written the same day block each other, and they only meet on a full replay: the refusal
that forbids a checkout registered beside the root, and `bindingsAtRevision`, which legitimately makes
one while it works.

### Which cell, measured rather than reasoned about

What was recorded before this unit is that nobody had isolated it, and that the residue sitting at HEAD
implicated `I-54` — whose mutant checks out HEAD — at least as much as `I-56`, whose mutant leaves the
checkout registered.

**It is `I-56` on `R/as-committed`, and `I-54` is innocent.** Both were reproduced by injecting the
battery's own edit into `packages/registry/rebuild.ts` by hand and running the two files that call
`bindingsAtRevision`.

`I-56` replaces the deregistration in the `finally` with a comment and leaves the `rmSync` beside it, so
the directory goes and the registration stays:

```
 Test Files  1 passed (1)      Tests  4 passed (4)

C:/…/toopo/.rebuilt/0671e6e6…  0671e6e (detached HEAD) prunable
prunable gitdir file points to non-existent location
```

`I-54` moves the reference and never touches the `finally`. Its edit reddens four guards — which is what
its pin says — and leaves git exactly as it found it:

```
 Test Files  2 failed (2)      Tests  4 failed | 9 passed (13)

C:/Users/Mathis/Desktop/Toopo/toopo  0671e6e [main]
```

**The path says where it comes from.** `bindingsAtRevision` is called against *this* repository in
exactly one place, `packages/registry/frozen-for-life.test.ts`'s `rebuild(REPOSITORY_ROOT, atHead)`.
The three rebuilds beside it target the clone under `.rebuilt/the-published-subject`, whose registrations
die when `afterAll` removes it whole. Only the fourth is registered against the repository being
measured, under the name the residue carries.

### Why the cleanup could not reach it, and why the subject must not be repaired

Three reasons, of increasing depth.

`assertCleanTree` cannot see it: measured with the residue present, `git status --porcelain
--untracked-files=no` answered only ` M packages/registry/rebuild.ts`. A registration is not a change to
a tree, and `.rebuilt/` is ignored besides.

`restoreAfterAnInterruption` restored files only — `git checkout HEAD -- <contractPath>` and the report.
Nothing under `.git/worktrees/` lies below any `contractPath`.

And the reason that makes the first two inevitable: **the content of the mutant is *do not deregister*.**
Running `I-56` is, by construction, committing the act the refusal forbids. Making `bindingsAtRevision`
robust against it was considered and refused — it would mean `I-56` no longer expresses its defect.
*That is not repairing the instrument, it is removing a measurement.*

## Considered Options

- Relax `assertNoStrayWorktree` so that a prunable entry is tolerated.
- Make `bindingsAtRevision` tidy up whatever the state of its own `finally`.
- Prune git's administrative state once per battery, in the existing `finally`.
- Restore git's administrative state wherever the files are already restored, which is once per cell.

## Decision Outcome

Chosen: **the last**. `restore` puts back the contract under measurement *and* git's own state, so the
instrument now restores exactly the two things it asserts before it starts.

The symmetry is the whole argument, and it is legible in four lines of `run.ts`:

| asserted before a run | restored after a cell |
| --- | --- |
| `assertCleanTree` | `git checkout HEAD -- <contractPath>` |
| `assertNoStrayWorktree` | `deregisterStrayWorktrees` |

For as long as the right column held one entry and the left held two, a cell could leave the repository
in a state the instrument's own preconditions refuse.

**The first option is refused on the ground the refusal was written on.** A residue leaves
`git status --porcelain` empty, so this refusal is the only barrier that ever saw it; one relaxed to
admit the case that triggers it keeps nothing.

**`git worktree remove --force` answers both states, and that was measured rather than inherited from
the sentence in `mutation/paths.ts` that claims it.** On an entry git reports `prunable`, with its
directory already gone, it exits 0 and the entry is gone. It answers a live checkout as well, which is
the state a hard kill between the removal and the `rmSync` would leave.

**What cannot be removed is refused, never reported.** A teardown that swallows what it failed to undo
hands the next cell a repository nobody put in that state — which is the sentence `assertNoStrayWorktree`
exists against, arriving one cell later and blamed on the wrong run.

### Once per cell, and the measurement that decided it against once per battery

The obvious repair is the battery-level `finally`, and it is wrong. What it would leave is this.

Measured at `0671e6e`, with the residue present, on the whole `packages/registry` suite read exactly as
`runSuite` reads it:

```
assertions in the JSON report : 351
by status                     : {"passed":347,"skipped":4}
failed                        : 0
frozen-for-life reported      : "0671e6e6… cannot be rebuilt, because git could no…"
```

The four guards of `frozen-for-life.test.ts` are **`skipped`, not `failed`**. The file cannot start:
`worktree add` refuses the path its own residue holds. So every cell of `registry-storage` after `I-56`
ran against a suite whose four guards had silently left it, and the suite was red for free — by a failed
*file*, contributing no failed *test*.

**And this is the finding worth more than the repair, because it is a property of the control and not of
this cell.** `assertWholeSuiteRan` compares a total against a total: 351 against 351, and it is silent.
It does not look at the composition. *Ignored is not failed*, and the two are indistinguishable to any
check that counts. It will hold for anything that makes a test file unstartable — a `beforeAll` that
throws, an import that dies, a fixture that cannot be built — and the cell will read as a result while
part of the suite has quietly stopped answering.

That gap is **not closed here**, and it is recorded in `CLAUDE.md` among what this repository declares
and nothing keeps. What closes it is a control that compares the run's composition against the census it
already holds, per cell rather than only during calibration — `assertTheCensusHolds` applied where
`assertWholeSuiteRan` runs. It is not built in this unit because this unit's subject is a checkout, and
because a second control over one reading has nothing to say on the day the two disagree until somebody
has decided which of them owns the question.

What *is* closed here is the cause: with the restore per cell, no cell inherits the previous cell's
residue, and the four guards are reachable again on every one of them.

### What it costs, measured

A `git` invocation costs 21 ms on the machine this was measured on — `worktree list --porcelain` 21.1 ms
and `rev-parse --show-toplevel` 20.2 ms over twenty draws each. `strayWorktrees` spends two, and the
confirming reading is taken only where something was removed. The last complete set of results on this
machine holds **685 cells**, so the reading adds about 29 seconds to a replay of some thirty-four
minutes: **near 1.5 %**, bought for the independence of every cell.

Hoisting the repository root out of `strayWorktrees` would halve it and was refused. It is fourteen
seconds against a reading that asks git for both sides of its comparison, which is the rule
`mutation/paths.ts` states in its own words — *reconciling them by inventing a third spelling is how that
family got its first two members.*

## Consequences

- `npm run mutation` can reach its total, and `npm run tally` can produce one.
- The cells of a battery no longer inherit each other's residue, so a cell that leaves one is contained
  to itself instead of degrading every cell after it.
- The instrument refuses a checkout it could not remove, which is a state nothing here has produced.
- `mutation/instrument.test.ts` gains a guard, and the meta suite goes from 63 to 64.
- A control that compares a total against a total is now known not to see a composition, and that is
  written down rather than left for a reader to assume it closes.

## Confirmation

`a-checkout-a-cell-left-behind-is-deregistered` registers two checkouts against this repository — one
with its directory removed, which is what `I-56` really produces, and one left whole, which is what a
hard kill leaves — asks that both are seen, calls `restoreAfterAnInterruption`, and asks that neither
survives. It perturbs a checkout really registered against this repository and never a list handed to
the teardown, which is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)'s
rule.

Its real failure condition is the removal of `deregisterStrayWorktrees` from `restore`, and it was seen
red on exactly that, alone.

**What it does not establish** is that a battery leaves nothing behind: that is a run rather than a test,
and the answer to it is the replay itself. Nor does it reach the `throw` on a checkout that resists
removal — no state was found on this platform that `git worktree remove --force` refuses, so that branch
is declared here rather than dressed as a measurement.

## What would reopen this

- A second module of this repository that registers a worktree. `bindingsAtRevision` is the only one
  today, and the restore is written over `strayWorktrees` rather than over that module, so a second one
  costs nothing here — but a module registering something that is *not* a worktree would be a third half
  of this repository's state, restored by nothing.
- A control that reads a run's composition rather than its total, which would take the finding above out
  of `CLAUDE.md` and into a mechanism.
- A replay long enough that 1.5 % stops being the right trade. The reading is per cell, so its cost
  grows with the cells and its value grows with them too.
