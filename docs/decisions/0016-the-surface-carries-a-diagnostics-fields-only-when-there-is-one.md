---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
  - packages/registry/response.ts
confirmed-by: []
---

# The surface names a role once, and carries a diagnostic's fields only when there is one

## Context and Problem Statement

Two of the five contracts publish a diagnostic beside the answer. Three do not. The surface record has
to say which export is which, and what to do with the two fields that only exist where a diagnostic
does — the reason set and the coupling rule.

## Considered Options

- Spell the role union inline where it is used.
- Name it once, and let both consumers read the same union.

And, for the two fields:

- Require them, with an empty reason set on a total contract.
- Carry them only where a diagnostic exists.

## Decision Outcome

### `ExportRole`

What an export is for. Two of the five publish a diagnostic beside the answer.

Named rather than written inline, because a second consumer needs it: the index a client reads before
it can name what it installed carries the pair, and a union spelled out in two places is a union that
comes to disagree with itself the day a third role exists.

### `SurfaceRecord.failureReasons`

The reason set, frozen with the major. Two of the five publish one; a total contract has none, and
declaring an empty one would declare a literal no caller can ever receive.

### `SurfaceRecord.couplingRule`

The promise that the two exports cannot drift. Present exactly when a diagnostic is.

### `SupportingTypeRecord`

Beside them sits the one part of a surface that is neither an export nor a diagnostic:

A type the signature refers to. One of the five needs one: `Duration` on `date/add@1`.

## Consequences

A total contract's record says nothing about failure rather than saying that failure is impossible in
an empty list, which is the distinction a caller switching exhaustively depends on.

The reason set being frozen with the major is the catalogue-wide rule `CLAUDE.md` records: adding a
literal, removing one, or splitting one all break a caller that switches exhaustively, so the partition
is chosen once and a later change costs `name@2`.

## Confirmation

Nothing guards the pairing of `couplingRule` with a diagnostic directly. What is guarded is the claim
the coupling rule makes: each of the two fallible contracts carries a coupling property in its own
suite, asserting that a call fails exactly when it has a description.

## What would reopen this

A third export role. The union is named once precisely so that the day one exists there is a single
place to add it, and `response.ts` is the second consumer that would have to agree.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
