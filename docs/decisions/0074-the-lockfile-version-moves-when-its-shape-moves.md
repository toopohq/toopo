---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: cli-update
    guard: a-version-this-toopo-does-not-write-is-refused
  - battery: cli-update
    guard: a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run
---

# The lockfile version moves when the lockfile's shape moves

## Context and Problem Statement

The version of `toopo.lock` this schema describes. A number that does not move when the shape moves
discriminates nothing, and this one had already failed to move once.

## Considered Options

- Move it when the format changes incompatibly, by judgement.
- Move it whenever the shape changes, and make the compiler ask.

## Decision Outcome

**It is 2 because `askedFor` was added to `LockedFeature`, and a number that does not move when the
shape moves discriminates nothing.** Both shapes went out under the number 1 before that was noticed —
on the only file this project writes into somebody else's repository, whose whole value is that it can
be checked against a published fact.

What stops it happening again is not this comment. `packages/cli/lockfile.ts` validates through a
record keyed by `keyof LockedFeature`, so a field added here does not compile until a check for it is
written — and the compiler asks the question at the moment the shape changes rather than leaving it to
be remembered.

## Consequences

This is [ADR-0054](0054-make-the-omission-impossible.md) applied before that record existed: the rule
in prose was broken once, and what replaced it is a total map over `keyof LockedFeature` that cannot be
left incomplete. The comment is now a pointer to the mechanism rather than the mechanism itself.

## Confirmation

`a-version-this-toopo-does-not-write-is-refused` establishes that an unknown version is a refusal
rather than a best effort; `a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run`
establishes the specific transition this number was introduced to discriminate, and that the refusal
tells the reader what to do about it.

## What would reopen this

A third shape, which is what the next field added to `LockedFeature` produces. The mechanism is
designed to make that a compile error rather than a decision, so what would reopen *this record* is a
change to how the lockfile is validated, not another version.

## More Information

- [ADR-0054](0054-make-the-omission-impossible.md) — the general form of the repair.
- [ADR-0073](0073-a-locked-feature-records-whether-the-user-asked-for-it.md) — the field whose arrival
  moved the number.
