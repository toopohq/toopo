---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/update.ts
  - packages/cli/reconcile.ts
  - packages/cli/command.ts
confirmed-by:
  - battery: cli-update
    guard: a-conflicted-feature-is-held-back-whole
  - battery: cli-update
    guard: a-file-the-registry-did-not-change-keeps-your-version
  - battery: cli-update
    guard: a-file-already-holding-our-bytes-is-claimed-and-not-rewritten
  - battery: cli-update
    guard: a-file-that-was-deleted-is-put-back
  - battery: cli-update
    guard: nothing-is-removed-while-a-feature-is-held-back
  - battery: cli-update
    guard: only-the-feature-that-was-asked-for-is-a-root
---

# What an update is, and what it will not do

## Context and Problem Statement

An update rewrites files somebody has been editing. Permanent rule 4 says never update user code
silently — notification, readable diff, explicit acceptance — and the shape that satisfies it decides
whether every decision this tool makes stays reachable from a guard.

## Considered Options

- Show the changes and prompt for acceptance.
- Show on one command, and write on a second.

## Decision Outcome

**Acceptance is a second command, never a prompt.** `toopo update` shows and writes nothing;
`toopo update --apply` writes. What that protects had never been named and is the property this folder
would lose first: **everything this tool decides is reachable from a guard, with no process, no working
directory and no clock.** It is what keeps `command.ts` thin, and it is why `add` could be measured end
to end without a sandbox. The first interactive prompt written here takes it away, and takes it away
silently — so the sentence lives in `command.ts` and in `update.ts`, where whoever wants one will read
it.

**The whole project is planned every time, and there is no `toopo update <feature>`.** Deduplication is a
property of a plan and not of a feature — which carrier of a shared file keeps it depends on what else is
being installed — so a plan built for one feature in a project holding four would move files the other
three own. Planning everything and applying part of it is the only shape that cannot do that.

**Six answers about a file, decided by two questions.** *Does this have to change* — the bytes we would
write are not the bytes the lockfile says we wrote. *Did the user change it* — the bytes on disk are not
the bytes the lockfile says we wrote. Both asked against `sha256`, which is the half of the lockfile's
two digests that exists for exactly this.

```
must change, untouched      updated          write it, with the diff
unchanged, edited           kept             leave it, and say so
must change, edited         conflict         hold the whole feature back
unchanged, untouched        unchanged        nothing at all
gone from disk              restored         put it back
already the new bytes       already-written  a run was interrupted here, not an edit
```

The last one is what closes the partial-write window without a journal.

**A conflict is diffed as the file is on disk against what would be written**, which states the
consequence of accepting rather than describing the upstream change in the abstract; `git diff` already
shows the user their own change better than this could. The other reading — reconstruct what we
originally wrote and isolate the upstream change — **cannot be built from the lockfile**, and finding
that out is worth recording: the lockfile records only the files that were *written*, so a shared blob's
second carrier is deduplicated away and has no entry, and the old relocation is not recoverable from it.

**A conflicted feature is held back whole**, and so is anything carrying one of its files or importing
it. A feature half at one version and half at another is a combination nobody published.

**Nothing is removed while anything is held back**, and that rule was found by reading the report rather
than the code: the second publication of the imagined graph has `imagined-number/round` drop `imagined-number/sign`, and a
held-back `imagined-number/round` runs the old code that imports it still — so removing it would break a build in
order to tidy a folder. The blunt form is deliberate; the exact one costs a fetch per held-back feature
and a fallback, to win one run of tidiness in a situation the user is already resolving.

## Consequences

**`LockedFeature.askedFor` is one of the defects a consumer found in this schema.** The lockfile did
not say which features the user had typed, and an update has two ways to guess, both wrong for different
reasons. Treating every entry as a root climbs a dependency to whatever its own binding names today
rather than to the one its dependent was published against — a combination nobody published. Deriving
the roots from the edges reads precisely what an update is trying to find out has moved, and gets the
ordinary case wrong anyway: a `imagined-string/pad` installed directly *and* pulled in by `imagined-number/round` would
never again be updated on its own. It is **sticky towards true**, and that case found a second defect in
`add`: asking by name for something already held as a dependency answered "nothing to do" and recorded
nothing, after which a later update would have removed what the user had asked for. It is smaller than
the ones the read API and `toopo add` found, and it is in the lockfile rather than in the served schema.

## Confirmation

The six guards named above are the six answers of the table, one each where a guard can hold one, plus
the two rules that are about the plan rather than about a file: nothing is removed while a feature is
held back, and only what was asked for is a root.

What no guard holds is the property the first paragraph names — that everything decided here is
reachable with no process and no clock — because it is a property of the shape rather than of a run. The
sentence is in `command.ts` and in `update.ts` because that is where somebody about to write a prompt
would be looking.

## What would reopen this

A caller who genuinely needs to update one feature: the argument above is that a plan is whole-project
by nature, so what would reopen it is a project large enough that planning everything is slow, at which
point the question is caching rather than scope.

## More Information

- [ADR-0036](0036-which-commands-ask-twice.md) — the discipline this command's two halves obey.
- [ADR-0037](0037-what-the-lockfile-does-not-describe.md) — why the plan cannot come from the lockfile.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
