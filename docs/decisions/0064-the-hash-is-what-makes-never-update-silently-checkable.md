---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: the-served-bytes-are-the-committed-bytes
  - battery: registry-storage
    guard: every-file-a-published-contract-freezes-is-served
---

# The hash is what makes "never update silently" checkable from the user's side

## Context and Problem Statement

Permanent rule 4 says user code is never updated silently. A promise made by the registry about its
own conduct is worth what the registry is worth. A file of an implementation or of a harness needs
something that lets the user's own machine answer the question instead.

## Considered Options

- Publish the rule and let the client trust the registry.
- Carry a hash of each file, over the bytes as committed.

## Decision Outcome

A file of an implementation or of a harness, with the hash the lockfile compares against.

SHA-256 over the bytes as committed. It is what makes "never update user code silently" checkable
from the user's side rather than promised from the registry's: the lockfile holds the hash the
registry served, the file on disk hashes to something, and a difference is a local modification
whether the user remembers making it or not.

This is also the whole of what the registry says about the executable half of a contract. The bodies
of `outputsAreEqual`, of the properties and of the key functions are in these files and in no field of
any record.

## Consequences

The offline check — the one whose whole value is that it needs nothing from us — is arithmetic rather
than a question put to a server. It follows that the registry models the executable half of a contract
as bytes and never as structure: an endpoint claiming to know what is inside one of these files would
be publishing an opinion about code it does not parse.

## Confirmation

`the-served-bytes-are-the-committed-bytes` establishes that what an answer carries is what the
repository committed, and `every-file-a-published-contract-freezes-is-served` that no file a contract
freezes is missing from what a client can obtain.

## What would reopen this

A second hash function, which is what a break in SHA-256 would force. The field name carries the
algorithm, so a second one is a new field beside it rather than a reinterpretation of this one — and
a published version being frozen for life, that is the only shape available.

## More Information

- [ADR-0071](0071-an-installed-file-carries-two-digests.md) — why the lockfile compares against two
  hashes and not this one alone.
- [ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) — the same question one level up, about an
  artefact rather than a file.
