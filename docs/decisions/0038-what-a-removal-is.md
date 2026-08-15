---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/remove.ts
confirmed-by:
  - battery: cli-remove
    guard: a-feature-another-root-still-imports-stays-and-stops-being-a-root
  - battery: cli-remove
    guard: a-feature-nothing-else-holds-leaves-with-everything-it-pulled-in
  - battery: cli-remove
    guard: a-feature-that-was-never-asked-for-is-refused-with-what-imports-it
  - battery: cli-remove
    guard: only-what-the-removed-feature-alone-pulled-in-goes-with-it
  - battery: cli-remove
    guard: the-features-that-stay-are-planned-at-the-version-the-lockfile-records
---

# What a removal is

## Context and Problem Statement

Before `toopo remove` the only way to uninstall was to edit `toopo.lock` by hand, and the tool put a
deleted folder straight back. The question is what *removing* means in a project where features depend
on each other and share files.

## Considered Options

- Delete the feature's files and its lockfile entry.
- Demote it from being a root, and re-plan what remains.

## Decision Outcome

**Asking for a feature to go is asking for it to stop being a root**, and everything else follows from
re-planning what remains. So a removal is a reconciliation with one feature demoted, sharing the whole
of its arithmetic with `update`; the measurement that says this is real rather than tidy is that
nineteen of the twenty-five guards that unit added redden on `cli-update`'s battery.

**Two differences, and both are load-bearing.** The roots that stay are bound at the version the
lockfile records, never at what the registry serves today — not merely so that a removal does not
update four other features, but because *which files leave* is decided from that plan, and a root
republished without a dependency would have it planned away while the version on disk still imports it.
And zero roots is an answer rather than an error, which is why the two refusals about a lockfile with
nothing in it stay in `update.ts`.

**Four answers, and the one that matters most is not a refusal.**

```
not in the lockfile         refused, with what the project does hold
held, never asked for       refused, naming the feature that imports it
asked for, still reached    it stays, it stops being a root, and the screen says both
asked for, reached by none  it goes, and so does what only it pulled in
```

The third is where trust is lost, because from outside it looks exactly like nothing happened. *I asked
to take it out and it is still there* is never left to be read off a report with nothing in it.

## Consequences

**Two holes in `update` were found by building it**, and both are closed. A copy deduplicated away was
left on disk claimed by nothing — `add` plans one root at a time, so two features carrying one file are
written twice and the first update afterwards drops one from its entry — and the next command refused
to write there, about a file this tool had written itself. And *nothing is removed while a feature is
held back* was asked of the features still in the plan, so an edited file that kept a **leaving**
feature let its dependencies be deleted underneath the code it left behind.

## Confirmation

The four answers of the table are four guards, one each, and the fifth holds the binding rule that makes
the first two correct: the features that stay are planned at the version the lockfile records. Nineteen
guards of this unit also redden on `cli-update`'s battery, which is what establishes that the two
commands share their arithmetic rather than resembling each other.

## What would reopen this

A removal that has to work with no registry, which is
[ADR-0037](0037-what-the-lockfile-does-not-describe.md)'s limit rather than this one's. Nothing about
the four answers changes; what changes is where the plan they are computed from comes from.

## More Information

- [ADR-0034](0034-what-an-update-is-and-what-it-will-not-do.md) — the arithmetic this command shares.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
