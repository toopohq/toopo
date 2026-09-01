---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/implementation-record.ts
  - packages/cli/lockfile.ts
  - packages/cli/resolve.ts
  - packages/cli/install.ts
  - packages/cli/reconcile.ts
confirmed-by:
  - battery: cli-install
    guard: an-install-records-the-revision-the-registry-answered-from
  - battery: cli-install
    guard: two-named-answers-from-two-revisions-refuse-the-install
  - battery: cli-update
    guard: a-lockfile-from-before-the-revision-is-refused-with-the-command-to-run
  - battery: cli-remove
    guard: taking-out-the-last-root-asks-the-registry-nothing
---

# The lockfile records the revision it was resolved against

## Context and Problem Statement

[ADR-0090](0090-a-revision-belongs-to-the-named-half.md) puts a revision on every named answer. A
lockfile that did not keep it would be throwing away the only thing that says *which registry, when* —
and a lockfile is the one file this project writes into somebody else's repository.

Three questions follow, and none of them has an obvious answer: where the field goes, what an
installation may honestly claim, and what happens to the lockfiles written under the shape before it.

## Considered Options

- On `Lockfile`, once per file.
- On `LockedFeature`, once per feature.
- On `InstalledFile`, once per file written.
- Migrate a version-2 lockfile by stamping the current revision on it.

## Decision Outcome

### Per feature, and the two commands settle it between them

**Per file is wrong because a file is content-addressed**: its digest already covers it, and a revision
beside it would be a fact about the resolution attached to something the resolution did not decide.

**Per lockfile is wrong because `toopo update` is partial.** A held-back feature keeps the bytes it had,
and a revision on the file would be stamped over entries the run never looked at — the same defect
`installedAt` was repaired for, one level up. `reconcile.ts` writes the revision on the entries it
rewrites and on no others, which is exactly the set whose files moved.

So it is per feature. Every feature one install writes carries the same value, and that is the honest
shape rather than a shortcut: only the root goes through a named answer, and everything under it is
reached by edges carrying the digest of what they name. What the field records is the state the
*resolution* was made against, which is precisely what a reader would have to rebuild.

### An installation reads two named answers, and they have to be one state

The index turns a name into an address; the bindings turn that address into a digest. Everything below
is arithmetic. Those two are therefore the whole of what a lockfile's revision can honestly claim, and
one of them coming from a later deployment than the other would record a state that never served this
install.

`oneRevisionBehind` refuses it, and the refusal names both answers and tells the reader to run the
command again. It accuses nobody: a publication landing between two requests is ordinary. What it must
not do is pick one and carry on, because the whole value of the field is that a reader can go back to
it.

An update reads more — one index and one binding per root — so it has more room for a publication to
land in the middle, and the same function is asked of all of them at once. *This project was reconciled
against two registry states* is one fact about the run, not one per feature.

### The case that was found by a guard rather than by reading the code

`taking-out-the-last-root-asks-the-registry-nothing` went red. Removing the last root of a project
leaves nothing to resolve, so the walk reads **no** named answer at all — and `oneRevisionBehind` of
nothing was a refusal.

It is not one. There is no revision, and there is nothing to stamp one on either, because a feature is
planned from a root and this walk has none. The two absences are the same absence, so `TheGraph`
carries `string | null` and `assemble` throws where a feature would be written under it — the treatment
`local-source.ts` already gives *a ledger entry with no record behind it*. A fallback there would write
an invented revision into somebody's lockfile, which is the one thing this file exists to prevent.

### Version 2 is refused rather than migrated, for the reason version 1 was

`LOCKFILE_VERSION` moves to 3. That is not a decision but the mechanism
[ADR-0074](0074-the-lockfile-version-moves-when-its-shape-moves.md) built working: `FIELDS_OF` is total
over `keyof LockedFeature`, so the field could not be added without the number being confronted.

What **is** a decision is the refusal. The revision that served an old install is a fact about a moment
that has passed, and the only values available to invent are today's — which would record that an
install from last month came from a state it never saw. That is the same shape as `askedFor` in
[ADR-0073](0073-a-locked-feature-records-whether-the-user-asked-for-it.md), where both ways of guessing
were wrong, and it is refused for the same reason: **a lockfile whose whole value is that it can be
checked against a published fact must not be filled in with a plausible one.**

The refusal is usable because `toopo add` recognises a file whose bytes are already the ones it would
write. Re-adding writes nothing, keeps every file where it is, and records the fact that was missing.

The two older shapes are now rows in a record rather than a chain of conditions, so a third is a row
and the sentence around it stays written once. A version no row names is still refused, and says so
without pretending to know what it lacked.

**Nothing in the world holds a version-2 lockfile**: `private: true` holds, the package is not on npm,
and nothing is published. That is the whole reason this is done now rather than after the launch.

## Confirmation

Four guards. One says an install records the revision the port answered with, on every feature it
writes. One says two named answers from two revisions refuse the install and leave no lockfile behind,
with the control that the same source installs when its answers agree. One says a version-2 lockfile is
refused with the command to type back, and asserts both older shapes rather than one — a row that
stopped being reached would leave a version silently answered by the generic sentence. One is the
removal guard that found the empty walk.

Two were seen red on their real failure condition:

```
the index dropped from the comparison   two-named-answers-from-two-revisions-refuse-the-install
                                        Error: a mid-deployment install was not refused

the row for version 2 deleted           a-lockfile-from-before-the-revision-is-refused-with-the-command-to-run
                                        expected 'toopo.lock carries version 2, and thi…'
                                        to contain 'That version did not record which rev…'
```

**What no guard here establishes** is that the revision recorded is one anybody can obtain. Against the
stand-in it is forty zeros, which is visibly not a publication; against a deployment it is whatever
`theRevision` refused to produce from a dirty tree. Neither is a check a *reader* can run, and none can
be until something is published.

## What would reopen this

- An update that refreshes one feature rather than the project, which does not exist and whose absence
  `update.ts` argues. It would make the run-level revision wrong and force it back onto the root.
- A registry that serves an implementation binding without an index, which would leave an installation
  reading one named answer instead of two and make `oneRevisionBehind` a comparison of one thing.
- A fourth lockfile shape, which is a row in `WHAT_AN_OLDER_SHAPE_LACKED` and not a change here.

## More Information

- [ADR-0090](0090-a-revision-belongs-to-the-named-half.md) — where the revision comes from, and why the
  frozen half and the content-addressed envelope both refuse it.
- [ADR-0073](0073-a-locked-feature-records-whether-the-user-asked-for-it.md) — the previous field that
  could not be derived, and the refusal it produced.
- [ADR-0074](0074-the-lockfile-version-moves-when-its-shape-moves.md) — the mechanism that made this
  version move.
