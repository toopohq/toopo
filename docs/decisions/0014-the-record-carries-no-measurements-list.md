---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by: []
---

# The record carries no `measurements` list

## Context and Problem Statement

`BenchmarksRecord` carried a `measurements` list beside its vocabulary and its profiles. It held the
same fact as `BenchmarkFigure` on the implementation record, keyed from the contract instead.

## Considered Options

- Keep both, and let a benchmark figure be reachable from either side.
- Keep the one on the implementation, and remove the one on the contract.

## Decision Outcome

**This record carried a `measurements` list and no longer does.** It held the same fact as
`BenchmarkFigure` on the implementation - a profile, an environment, a figure, the machine and the
date - keyed from the contract instead of from the implementation, with an implementation id beside it.
Two models of one measurement, both empty on all five, and only one of them ever served: a benchmark
figure belongs to the implementation it was measured on, which is where the comparison that justifies
an implementation list happens.

It went for a second reason as well. That id was the last place in this folder where a type named
something by its identifier alone, and an identifier here is unique *within its contract* - the rule
the catalogue has now learned three times, on cases, on guards, and on the read API's
`/implementations/{id}@{version}`.

## Consequences

`BenchmarksRecord` is a vocabulary and a list of profiles, and nothing else. A benchmark figure is
asked of the implementation that was measured, which is the only place a comparison between two
implementations can be made.

## Confirmation

**Nothing keeps the absence, and the mechanism this paragraph first claimed does not exist.** It said
`FIELD_MAP` was total over the record, so that a field reintroduced here would not compile until
somebody classified it. `FIELD_MAP` is a `Readonly<Record<string, FieldClassification>>` keyed by a
path string, not by `keyof ContractRecord`: it is resolved against the paths a real record carries,
which is a guard over data and not a totality over a type. Nothing would refuse a `measurements` field
added back tomorrow except the argument above.

What *is* kept is the second half. `packages/registry/address.ts` publishes `ImplementationAddress` as
a contract, an identifier and a version, and publishes no type carrying an implementation identifier
alone — so the shape that made this list wrong is unrepresentable whether or not the list returns.

## What would reopen this

A benchmark figure that belongs to a contract rather than to an implementation — a figure about the
*specification* rather than about a program that answers it. Nothing in the catalogue has produced one,
and it is the only shape that would need this list back.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
