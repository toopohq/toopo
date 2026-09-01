---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: the-depth-is-derived-from-the-edges
  - battery: registry-storage
    guard: every-reference-has-no-dependencies
---

# The edges are carried and the depth is derived

## Context and Problem Statement

The registry features this one imports, directly, each at the version it was published against. Empty
for every implementation of the five. The field began life as a *number*, and the read API is what
proved that insufficient.

## Considered Options

- Carry the depth, as a number.
- Carry the edges, and derive the depth from them.
- Carry both, and keep them in step.

## Decision Outcome

**This field used to be a depth, and the read API is what proved a depth insufficient.** `toopo add`
has to resolve dependencies recursively and deduplicate a shared file, and neither operation can be
performed against a number: a depth is the *summary* of a walk over edges, so it can be derived from
them and they cannot be recovered from it. Carrying the summary and not the fact is the shape of
mistake `canonical.ts` refuses one level down when it returns the canonical text rather than only the
digest — a consumer needs the thing that reproduces the answer.

The depth is still published, by `dependencyDepthOf`, and permanent rule 2 is still what it measures:
a feature depends only on other registry features, so an edge leaving this catalogue is
unrepresentable rather than refused — `ImplementationAddress` cannot name one.

Frozen, and it belongs in the digest: what a published artefact imports is part of what it *is*, and
an edge that could be edited afterwards would let the bytes installed under a fixed digest change
meaning without the digest moving. That is also what makes the digest each edge carries worth its
bytes: it is frozen with the edge, so the whole closure hangs off one root digest.

### Why the depth is still published

How deep the tree under an implementation goes. Zero for every implementation of the five.

Derived from the edges rather than declared beside them, which is the rule this repository already
applies to a profile's sample count and its encoded size: a figure read off the values is a fact and
has no second statement to disagree with, and a figure transcribed next to them is a claim that can be
wrong. It is published because permanent rule 2 is a promise a reader should be able to check with one
number, not because anything downstream computes with it.

## Consequences

Carrying both was refused on the third option's own terms: two statements of one quantity drift, and
the derived one is free. This is the first entry of the series `CLAUDE.md` keeps under *a defect in
this schema has never once been found by looking at the schema* — it was found by the read API, not by
rereading the field.

## Confirmation

`the-depth-is-derived-from-the-edges` establishes the derivation over a graph with three reachable and
two deep; `every-reference-has-no-dependencies` establishes permanent rule 2 over the five, as edges
and as a number.

## What would reopen this

A feature that depends on something outside this catalogue, which permanent rule 2 forbids and
`ImplementationAddress` cannot spell. Lifting the rule is what would reopen the field's shape, not a
new consumer.

## More Information

- [ADR-0066](0066-an-edge-carries-the-digest-of-the-snapshot-it-names.md) — what one edge carries.
- [ADR-0013](0013-samples-are-carried-or-pointed-at.md) — the same refusal of a summary standing in for
  the values it summarises.
