---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by:
  - battery: registry-storage
    guard: every-mutation-provenance-resolves
---

# Where a case came from is published, and half of it is checkable

## Context and Problem Statement

Where a case of block 4.4 came from. Without it a contract that has been closing its gaps reads exactly
like a contract that never had any, and the difference is the whole claim this project makes.

## Considered Options

- Leave provenance out: a case is a case.
- Publish it, and write a guard that checks it.
- Publish it, check the half that is checkable, and refuse to write a guard for the other half.

## Decision Outcome

Identical in all three prototypes, down to the wording, and about registry bookkeeping rather than about
any feature — which is what puts it here rather than in three edge-case tables.

No test can check that a declared provenance is true: a sentence about how a case was found is not a
property of the case, and none is written, because a guard that cannot fail would be worse than none.
One half of it is checkable, and it is checked without any new machinery — a case marked
`found-by-mutation:D-07` claims to kill D-07, the mutation battery pins D-07 as killed, and deleting the
case turns that column red.

## Consequences

The three arms of the union are not equally checkable and the record says so, rather than a guard
existing over all three and proving something about one. That asymmetry is the point: `specified`
claims nothing a run could contradict, `found-by-mutation` claims something a battery already measures,
and `found-in-the-wild` names a report outside this repository.

## Confirmation

`every-mutation-provenance-resolves` establishes the checkable half at the registry's boundary — four
cases of the five cite a battery cell, and each resolves. Nothing establishes the other two arms, and
this record names that rather than leaving the gap to be discovered.

## What would reopen this

A defect reported from real use, which is the arm no case of the five carries yet. What it would show is
whether `found-in-the-wild:` needs a resolvable coordinate the way `found-by-mutation:` has one.

## More Information

- [ADR-0010](0010-a-transcription-is-guarded-by-its-occurrence.md) — the same shape of half-checkable
  claim, guarded where it can be.
- [ADR-0021](0021-a-property-settles-what-its-alphabet-represents.md) — why a named case exists beside a
  property at all.
