---
status: accepted
date: 2026-09-08
governs:
  - mutation/history.ts
confirmed-by:
  - battery: meta
    guard: every-commit-this-repository-cites-is-one-a-clone-keeps
---

# A citation resolves against what a clone keeps, and the tag is what makes that askable

## Context and Problem Statement

`every-commit-this-repository-cites-is-one-it-has` refused a push and was right to. What failed was
the **moment**: the reading had been taken before a throwaway branch was deleted, `theHistory()` is
`git rev-list --all`, and a citation is live while *any* ref reaches it. So the guard passed on a graph
that was about to stop existing and `main` carried a red window across both legs.

ADR-0254's entry costed the remedy: a second population, `main` and the tags, which is what a clone
keeps. **It is not born green.** One commit of this repository is cited and reachable from no tag and
from no branch but one, and that branch is kept alive by an instruction to whoever is working rather
than by any mechanism.

The owner lifted a standing prohibition once and by name for this: one annotated tag,
`evidence/the-windows-reading`.

## Decision Drivers

* **The two populations answer different questions and neither replaces the other.** `--all` says
  *this repository holds it*; `main` and the tags say *a reader will hold it too*. `theHistory()` may
  not narrow — the address sweep reads it to be total over every commit, and ADR-0095's argument is
  that `--all` is the only spelling of this repository a tag cannot fall out of.
* **A guard that depends on when it is run is the defect, not the cure.** The new one is red the day a
  citation of a branch commit is written, which is the day somebody can still choose another
  coordinate; the old one goes red the day the branch is deleted, which is after every reading.
* **A tag adds and replaces nothing.** The branch stays; what stops being load-bearing is the
  instruction.

## Considered Options

* Leave the entry costed and unopened.
* Merge that line into `main` — refused: it changes `main`.
* Cherry-pick the commit — refused: it changes the identifier ten citations spell.
* An annotated `evidence/*` tag and the second population.

## Decision Outcome

**The tag, then the guard, and the order is the point.**

### Two spellings were wrong before one was right, and the probe is what said so

The first reading of the narrowed population used `--branches=main --remotes=origin/main --tags` and
came back **873, identical to `--tags` alone** — which reads as *main is inside the tags* and is
really *both selectors matched nothing*. Measured over every candidate:

| spelling | commits | reaches `36e4bbb` |
| --- | --- | --- |
| `--all` | 945 | yes |
| `--branches --remotes` | 922 | yes |
| `--tags` | 873 | no |
| `--branches=main` | **0** | no |
| `main` | 921 | no |
| `origin/main` | 921 | no |
| **`main --tags`** | **944** | no |

So `--branches=<pattern>` does not select a branch by name here, and the spelling that works is the
plain revision. **A population that comes back plausible is the shape this repository refuses**: 873
was a number, not an error, and only asking each spelling separately separated *empty* from *equal*.

### That a runner holds the tags is measured and not assumed

A population narrowed to `main` and the tags is worthless in CI if the runner has no tags, and reading
`actions/checkout`'s documentation is not a measurement. **The existing green is one.** Swept at
`744e4bc`: **23 commits are reachable from a tag and from no branch, and three of them are cited** —
`6203758` and `26e2000` in `.github/workflows/suites.yml`, `92f60d8` in ADR-0145.
`every-commit-this-repository-cites-is-one-it-has` is green on the runner, and it could not be unless
those tags were fetched.

### `main` is resolved from a ref and never from `HEAD`

Read off `HEAD` the population grows to include whichever branch somebody is standing on, so a
citation of that branch's own commit resolves **exactly while it is worthless** — the defect the
population exists to catch, committed inside the thing catching it. So `refs/heads/main` is tried,
then `refs/remotes/origin/main`, and `HEAD` is a declared fallback that can only fire where neither
exists: a detached checkout, testing a commit that *is* main's tip.

### The red came before the tag, which cost nothing because the order gave it away free

With the guard written and the tag not yet posted, on the tree as it stood:

    every-commit-this-repository-cites-is-one-a-clone-keeps — 1 failed | 9 passed (10)
    .github/workflows/suites.yml cites 36e4bbb, and no commit of this repository answers to it
    CLAUDE.md cites 36e4bbb, …
    docs/decisions/0169-…-can-only-answer-on.md cites 36e4bbb, …
    docs/decisions/0256-…-reads-neither.md cites 36e4bbb, …
    mutation/cli-install.battery.ts cites 36e4bbb, …

**Five files where ADR-0254's entry counted four**, and the fifth is ADR-0256 — written in the unit
before this one, which cited the commit while its own entry was recording that nothing held it. A
figure moving inside the units that read it, which is a class this list already carries.

The tag was then posted, pushed **before any other push**, and verified on origin after the event:
`refs/tags/evidence/the-windows-reading` dereferences to `36e4bbb446e3c5e65f378a768831adc13f6760aa`.
`main --tags` went **944 → 945**, equal to `--all`, and the guard re-read **10 of 10, exit 0**. The
only thing that moved between the two readings is the tag.

### What the second population changes to the class of the three inversions

The class is *a verification binds to a state it does not name, so an act on that state un-does it*.
This unit does not close it. What it does is name a remedy that was not visible before: **narrow the
population to the part of the substrate the act cannot move.**

**It generalises to two substrates of the three, and the reason it fails on the third is structural.**
The ref graph has a sub-state an act on a working branch does not touch — `main` and the tags — and
that is this unit. The working tree has one too: a verification that reads *committed* state is immune
to an edit made while it runs, which is what `frozen-for-life.test.ts` already does by cloning at
committed `HEAD`, at the price that it then says nothing about the working tree. **The run queue has
none.** A queued run is not a sub-state of anything; it is a pending event, and there is no part of it
that survives a push. So the rule *the verification is the last thing you do* is retired for the ref
graph, available at a cost for the tree, and stands undiminished for the queue.

That asymmetry is worth more than the remedy: it says which of the three inversions can be
mechanised and which can only be honoured.

## Consequences

* `mutation/history.ts` gains `whatACloneKeeps()`; `history.test.ts` gains one guard and its census
  row goes **9 → 10**; the meta battery's claims-detection region for that file goes **8 → 9**.
* **One tag exists that did not**, the sixth `evidence/*`, and the branch is untouched.
* The instruction never to delete `the-windows-reading` may stay for its own reasons and is no longer
  the only thing between ten citations and a dead coordinate.
* **The ledger is `18cc4e82…` at 1 206 bytes and `pnpm freeze` is 3 passed**, unmoved: nothing here
  touches a contract.

## What would reopen this

* **A second working branch whose commits get cited.** The guard is red on the day that happens, which
  is the outcome, and the answer will be another tag or another coordinate — not a widening.
* **A runner that stops fetching tags.** Today's green over three tag-only citations is the
  measurement; if `actions/checkout` changes, that green goes first and this guard with it, and the
  cause will be visible in both.
* **`main` renamed, or a checkout with neither main ref.** The fallback to `HEAD` is declared and is
  correct only where HEAD is main's tip; a repository where that stops holding needs the resolution
  read again rather than the fallback trusted.

## More Information

ADR-0095 is where `--all` was chosen and why it may not narrow. ADR-0169 is the reading `36e4bbb`
carries and the reason it is cited at all. ADR-0253 is the red window this guard exists to have caught,
and ADR-0254 is the entry that costed the second population and named the tag as its prerequisite.
