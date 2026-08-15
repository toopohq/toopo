---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: an-edge-is-followed-to-the-artefact-it-names
---

# A walk takes the subset that decides its answer

## Context and Problem Statement

What the dependency walk needs of an implementation, which is exactly what a snapshot carries. The
walk originally required a whole `ImplementationRecord`, and the client that performs it holds no such
thing.

## Considered Options

- Require the whole record, and let the caller build one.
- Take the subset that decides the answer, and be generic over it.

## Decision Outcome

**Written by approaching the consumer, like the edges themselves.** The walk used to require a whole
`ImplementationRecord`, and the client that performs it holds no such thing: `toopo add` fetches
snapshots, and a snapshot is a *projection* that deliberately leaves out the standing — the status, the
tags, the benchmarks, the minified size. An installer would have had to invent all four to call a
function whose answer depends on none of them, and inventing a standing is exactly how a client comes
to publish an opinion it was never given.

So the parameter is the subset that decides the answer, and the walk is generic over it: a caller
holding records gets records back, a caller holding snapshots gets snapshots back, and neither has to
widen or narrow anything.

## Consequences

This is a second entry in the series a consumer found rather than a reader of the schema:
`DependencyNode` exists because the walk demanded a record no client holds. It also keeps this module
free of an import from `snapshot.ts`, which imports it.

## Confirmation

`an-edge-is-followed-to-the-artefact-it-names` exercises the walk over the type this record
introduces; nothing separately establishes the genericity, which the compiler settles rather than a
guard.

## What would reopen this

A field outside this subset coming to decide the answer — a walk that had to consult a standing, for
instance, which would mean the standing had stopped being advisory.

## More Information

- [ADR-0069](0069-what-establishes-that-a-snapshot-is-the-artefact-its-address-names.md) — the check
  written against this same subset, for the same reason.
