---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# The four properties every contract answers

## Context and Problem Statement

The four properties every contract considers, in the order every contract declares them. A contract may
find one of them inapplicable, and what it does about that decides whether the green count means
anything.

## Considered Options

- List only the properties a contract can test.
- Answer all four, always, with a verdict and a reason.

## Decision Outcome

The vocabulary is the catalogue's; the verdict is the contract's. A contract says whether each one is
applicable to it and why, and the reason is its own measurement — `never mutates its arguments` is
unfalsifiable on a string, real on a Date and the most violable property of an array grouper. What is
shared is that all four are answered, always, and that a property is only written as a test when it is
applicable: one that cannot fail is recorded with its reason instead, so the green count never carries a
guard that proves nothing.

`no observable side effect` used to be one entry and that was the error: it named two guarantees at once
and only one of them is reachable by a property. The split is catalogue-wide because the measurement
behind it is - see `NO_AMBIENT_OUTPUT_FINDING`.

### The guard that asks it, and the three things it checks

The guard each contract's `properties.test.ts` calls, and it checks three things where the three
hand-written versions checked one.

The versions it replaces asserted only which properties are inapplicable. That leaves two ways to weaken
a contract silently: dropping a property from the list altogether, and declaring one with an empty
reason. Neither was reachable before, and neither is now.

`inapplicable` is passed by the caller rather than derived, because the point of the assertion is that a
contract cannot quietly promote an inapplicable property into a passing test, or demote an applicable
one to make a failing guard go away. Deriving it from the same array it checks would compare the list
against itself.

## Consequences

An inapplicable property is a published verdict with a reason rather than a silence, which is what makes
a contract's green count readable: it never includes a guard that could not have failed. The
`inapplicable` parameter is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)
applied once, before that rule had a second instance to be stated from.

## Confirmation

The guard is `universal-properties-answered`, which each contract's own suite collects — and a decision
cannot cite a contract's guard, because those titles are built in a loop over the five. The identifier
is frozen in this file as `UNIVERSAL_PROPERTIES_ARE_ANSWERED`, under
[ADR-0084](0084-the-four-guards-the-catalogue-owns.md).

## What would reopen this

A fifth universal property, or a sixth contract whose shape makes one of the four unanswerable rather
than inapplicable — a distinction this record does not currently need.

## More Information

- [ADR-0021](0021-a-property-settles-what-its-alphabet-represents.md) — what a property settles, and
  what it leaves to a named case.
- [ADR-0088](0088-why-no-ambient-output-is-inapplicable-everywhere.md) — the reason the fourth is
  inapplicable in all five.
- [ADR-0086](0086-determinism-is-ordered-under-no-ambient-input.md) — why two of the four are not
  independent.
