---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: an-edge-is-followed-to-the-artefact-it-names
  - battery: registry-storage
    guard: every-edge-resolves-to-the-artefact-it-names
  - battery: registry-storage
    guard: an-edge-the-registry-does-not-hold-is-refused
---

# An edge carries the digest of the snapshot it names

## Context and Problem Statement

One edge of the dependency graph: which implementation, and the digest of the snapshot that *is* it.
An edge carrying only an address leaves the client with a name it must ask the registry to resolve.

## Considered Options

- An address alone, resolved against the bindings at install time.
- A coordinate added to `ImplementationAddress`, so that every address carries a digest.
- A type of its own, carrying the address and the digest of the snapshot it names.

## Decision Outcome

**The digest is the whole of this type, and what it buys is that the edge stops being a question.** An
edge carrying an address alone names something the registry must then be asked to resolve, and that
answer is `implementation-bindings` — a named answer, which is the registry's word and nothing a
reader can check. Carrying the digest makes the step arithmetic: the client fetches a
content-addressed snapshot and hashes what arrives. Measured on the imagined graph, `toopo add
number/round` goes from believing five named answers to believing one, and from eight round trips to
six, because the round trips that disappear are exactly the ones spent asking which digest an edge
resolves to.

**A type of its own rather than a coordinate added to `ImplementationAddress`.** That address is also
`PublishedImplementation.address` and `ServedImplementationBinding.address`, where a `digest` field
already sits beside it — widening it would write one fact twice into a served body, which is the drift
this schema refuses everywhere else.

**An edge is built by `edgeTo` and never written by hand.** The digest is derived from the target's
own snapshot, so a wrong one is unconstructible here rather than forbidden by a sentence. What that
cannot reach is an edge arriving from somewhere else — which is why `declarationFaults` is a check and
not a second derivation.

## Consequences

The whole closure hangs off one root digest, and the client believes one named answer instead of five.
It also creates the hole [ADR-0069](0069-what-establishes-that-a-snapshot-is-the-artefact-its-address-names.md)
closes: before the edges carried a digest, an edge's identity was established by the lookup that this
field removes.

## Confirmation

`an-edge-is-followed-to-the-artefact-it-names` and `every-edge-resolves-to-the-artefact-it-names`
establish the forward direction over the imagined graph and over the five;
`an-edge-the-registry-does-not-hold-is-refused` establishes that a dangling edge is a refusal rather
than a silence.

## What would reopen this

A digest algorithm change, or an edge that must name something not content-addressed. Both are
excluded today by the registry serving nothing that is not addressed by its own bytes.

## More Information

- [ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) — the freezing half of this field.
- [ADR-0051](0051-what-a-registry-over-a-wire-costs.md) — where the round-trip measurement comes from.
