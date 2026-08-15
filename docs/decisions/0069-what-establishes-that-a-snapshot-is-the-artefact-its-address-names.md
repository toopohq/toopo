---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: an-unpublished-implementation-cannot-be-depended-on
  - battery: registry-storage
    guard: every-edge-resolves-to-the-artefact-it-names
  - battery: cli-update
    guard: an-edge-whose-digest-names-another-artefact-is-refused
---

# What establishes that a snapshot is the artefact its address names

## Context and Problem Statement

Why this artefact is not the one that address names. Empty when it is. A client obtains a snapshot for
an address in two ways, and neither of them establishes that what arrived is what was asked for.

## Considered Options

- Check the binding path only, where the registry is asked and believed.
- Check the edge path only, where a digest is carried.
- One function covering both, taking the subset that decides the answer.

## Decision Outcome

**The one rule that closes both halves of the same hole, which is why it is one function.** A client
obtains a snapshot for an address in two ways and neither of them establishes that what arrived is
what was asked for. Through a *binding*, the registry is asked which digest a name resolves to and is
believed. Through an *edge*, the digest is carried and the name is not checked against it at all — so
an edge naming `string/pad@1/reference@1.0.0` while carrying the digest of `number/sign@1`'s snapshot
is answered honestly by any registry, verified perfectly by `servedSnapshotFaults`, and installs the
other feature.

Before the edges carried a digest the second half was covered by accident: `gatherHoldings` found the
digest by matching `id` and `version` in the bindings, so the identity was established by the lookup.
That lookup is exactly the round trip an edge's digest removes. **So the field that buys the round
trips is also what takes the check away, and this is the check put back where it can cover both.**

It takes a `DependencyNode` rather than a `FrozenImplementation` for the reason that type exists: the
subset that decides the answer, so that a caller holding either can ask without widening anything —
and so that this module needs no import from `snapshot.ts`, which imports it.

The three parts are compared rather than their rendering, and the rendering is used only to say so.
`renderImplementation` joins an id and a version with `@`, and nothing in this schema refuses an id
that carries one — so a comparison of two renderings would be a comparison that can be right about two
strings and wrong about two artefacts.

An unpublished artefact is the one that answers nothing rather than the wrong thing, and it is said
separately: an address carries a `string` version, `null` is what a record holds until the publishing
tool assigns one, and *this has never been published* is a different sentence from *this is something
else*.

### The lookup this rule is asked through

One lookup with one refusal, used by both walks, because "the registry holds no such implementation"
is one fact about one edge and a second copy of it is a second thing that can come to disagree.

An unpublished implementation can never be returned, and that is `declarationFaults`' first branch
rather than a comparison that happens not to match. Every record it returns therefore has a version.

**What it does not look at is the digest the edge carries**, and that is a division rather than an
omission. This walk runs on a client over snapshots that were *fetched by* that digest, so the pairing
has already been decided one floor up, in `heldAt`, where the thing that arrived can be compared with
the thing that was asked for. Asking again here would be a second guard over one fact, with nothing to
say for itself the day the two disagree.

## Consequences

A round trip removed by [ADR-0066](0066-an-edge-carries-the-digest-of-the-snapshot-it-names.md) did not
come free: it took an accidental check with it, and this record is the price. That is worth writing
down as a shape — an optimisation that removes a step can remove a guarantee the step was providing
without anyone naming it.

## Confirmation

`an-unpublished-implementation-cannot-be-depended-on` covers the first branch;
`every-edge-resolves-to-the-artefact-it-names` covers the agreement of the three parts; and
`an-edge-whose-digest-names-another-artefact-is-refused` is the client-side half, on the exact
substitution this record describes.

## What would reopen this

A third way for a client to obtain a snapshot. Two are covered because two exist; a third would have
to be shown to arrive through this same function rather than beside it.

## More Information

- [ADR-0066](0066-an-edge-carries-the-digest-of-the-snapshot-it-names.md) — the field whose arrival
  opened this hole.
- [ADR-0068](0068-a-walk-takes-the-subset-that-decides-its-answer.md) — why the parameter is a subset.
