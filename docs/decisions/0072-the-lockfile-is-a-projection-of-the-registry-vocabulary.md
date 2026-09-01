---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: a-lockfile-is-json
  - battery: registry-storage
    guard: needs-no-field-the-schema-does-not-have
---

# The lockfile is a projection of the registry's vocabulary

## Context and Problem Statement

One installed feature, as `toopo.lock` records it. The lockfile is the one file this project writes
into somebody else's repository, and its shape could be designed by the CLI that writes it or by the
registry whose facts it records.

## Considered Options

- Let the CLI design the lockfile, since the CLI is what writes it.
- Define it in the registry's own unit, as a projection of what the registry already names.

## Decision Outcome

It is in this unit because the CLI must not have to guess any of it: every part below is already an
address or a hash the registry holds, so the lockfile is a projection rather than a second vocabulary.
If the CLI had to invent a way to name an implementation, the registry and the lockfile would drift the
first time either changed.

`locallyModified` is derived by the CLI from the hashes and stored anyway. Storing it is what lets
`toopo` tell "you edited this" from "we changed this underneath you" without a network call, which is
the difference between an honest diff and a surprising one.

### The whole of what a project holds

The whole of what a project holds, as `toopo.lock` records it.

`version` is typed by the constant rather than by a literal of its own, so the number the reader checks
and the number the writer writes are one fact.

## Consequences

A field added to the registry's vocabulary is a field the lockfile can carry without negotiation, and a
field the CLI wants that the registry does not name is a question about the registry rather than about
the lockfile. `locallyModified` is the one derived value stored deliberately, and the reason is
recorded above rather than left to look like an oversight.

## Confirmation

`a-lockfile-is-json` establishes that it lives on the user's disk with nothing of ours decoding it;
`needs-no-field-the-schema-does-not-have` establishes the projection claim directly — that nothing the
lockfile records is outside what the registry already names.

## What would reopen this

A second client writing a lockfile of its own, which would make the shape a shared interface rather
than a projection, and would be the moment to ask whether the registry should publish a schema for it.

## More Information

- [ADR-0037](0037-what-the-lockfile-does-not-describe.md) — the limits of what this file claims.
- [ADR-0074](0074-the-lockfile-version-moves-when-its-shape-moves.md) — how the shape is versioned.
