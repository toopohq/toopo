---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: a-shared-dependency-is-resolved-once
  - battery: registry-storage
    guard: nothing-is-written-before-what-it-imports
  - battery: registry-storage
    guard: a-cycle-is-refused-rather-than-deduplicated-away
---

# An install order is post-order, and a cycle is a corrupt ledger

## Context and Problem Statement

Every implementation an install of a root must also write, dependencies before dependents, each once.
The root is not in it: what the caller asked for is not something it has to be told about. Two
questions follow — in what order, and what happens when the graph has a cycle.

## Considered Options

- Return the set, and let the installer choose an order.
- Return a post-order, so that the order is part of the answer.
- Survive a cycle by deduplicating out of it.

## Decision Outcome

**Post-order, and the order is part of the answer.** An installer that wrote a dependent before its
dependency would leave the project broken between two writes, and an order that depended on the shape
of the graph would make two resolutions of one artefact two different answers — which is the same
failure `canonical.ts` closes for keys and this file's own `harnessOf` closes for files.

**A cycle is refused rather than survived.** Two artefacts that import each other cannot both have been
published second, so a cycle is a corrupt ledger rather than an exotic graph, and an installer that
merely deduplicated its way out of one would write a project whose imports do not terminate.

**What this does not answer, and the CLI must.** Which file lands where, and how an import inside a
copied file is rewritten to point at a shared one. A shared file is *recognisable* from what is
already returned — two implementations carrying one `sha256` are carrying one blob, and dedup is that
comparison — but rewriting an import means reading inside the file, and the inside of a file is the
executable half this registry serves and never models. The registry cannot serve it, and an endpoint
that claimed to would be publishing an opinion about code it does not parse.

## Consequences

The registry hands the installer an order and a recognisable share, and stops there. Everything past
that line is the CLI's, and the line is where the registry stops being able to say anything true.

## Confirmation

`nothing-is-written-before-what-it-imports` establishes the order;
`a-shared-dependency-is-resolved-once` establishes the deduplication;
`a-cycle-is-refused-rather-than-deduplicated-away` establishes that the refusal is a refusal and not a
quiet recovery.

## What would reopen this

A dependency graph that is legitimately cyclic, which would require two artefacts published
simultaneously — something the publishing tool would have to be designed to allow, rather than
something that could arrive by accident.

## More Information

- [ADR-0064](0064-the-hash-is-what-makes-never-update-silently-checkable.md) — the digest by which a
  shared file is recognised.
- [ADR-0032](0032-what-an-installation-looks-like-on-disk.md) — the half this walk leaves to the CLI.
