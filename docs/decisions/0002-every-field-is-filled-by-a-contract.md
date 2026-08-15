---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - needs-no-field-the-schema-does-not-have
  - fills-the-fields-none-of-the-five-fills
---

# Every field of the record is filled by a contract, and the two that are not name their authority

## Context and Problem Statement

A registry schema is written before most of the things it will hold exist. The temptation is to
provide for what might be needed, and the cost of doing so is invisible until publication freezes the
shape.

## Considered Options

- Design the record from what a registry is imagined to need.
- Derive it from contracts written by hand, and admit a field only where one of them fills it.

## Decision Outcome

Every field below is filled from one of the five, and the two that are not say so in their own comment
together with the written requirement that authorises them. A schema that provides for what might be
needed is a schema nobody measured, and the five were written by hand precisely so that this one could
be measured instead of guessed.

## Consequences

The two authorised exceptions are `Lifecycle.absorbed-by-the-language`, which [ADR-0007](0007-four-lifecycle-states.md)
carries, and the pointed-at arm of [ADR-0013](0013-samples-are-carried-or-pointed-at.md), whose union
must be complete before anything is published because adding an arm afterwards is a breaking change.

Everything else in the record has a contract behind it, and a sixth contract that needed a field the
schema does not have would be a finding rather than an inconvenience.

## Confirmation

`the-sixth-contract.test.ts` is the guard, and it asks the question in both directions:
`needs-no-field-the-schema-does-not-have` over an imagined sixth contract, and
`fills-the-fields-none-of-the-five-fills` over the fields no published contract exercises.

## What would reopen this

A sixth contract that cannot be expressed. `CLAUDE.md` records that every defect ever found in this
schema was found by a consumer trying to use it and never by reading it, so the event to watch for is
a consumer stopped by a missing field — not a review of the record.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
