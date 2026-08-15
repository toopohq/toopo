---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by:
  - battery: registry-storage
    guard: every-identifier-is-an-address
  - battery: registry-storage
    guard: a-group-that-takes-a-case-address-is-refused
  - battery: registry-storage
    guard: a-grouping-that-is-not-a-partition-is-refused
---

# The four guards the catalogue owns

## Context and Problem Statement

A guard carries an identifier — a name, kebab-case, unique within its contract, frozen with its major —
and a contract chooses its own. Four guards are the exception, and an exception needs a line drawn
narrowly enough that the next guard does not walk through it.

## Considered Options

- Let each contract name its own copy of every shared guard.
- Name the guards whose helper *is* the guard here, and no others.

## Decision Outcome

A guard carries an identifier - a name, kebab-case, unique within its contract, frozen with its major -
and a contract chooses its own. These four are the exception, and the exception is narrow: the helper
below *is* the guard. `expectEveryCaseIsAddressed` is one function applied five times, not five guards
that resemble each other, so it answers to one name everywhere and a contract cannot rename it locally.
Renaming one costs a major on the whole catalogue, which is the discipline everything in this file
already carries.

`every-case-is-grouped` is the fourth and arrived with the grouping. It is here on exactly the same
argument: `groupingFaults` is one function applied to seven tables, and what it says — that a heading
has cases under it and a case has a heading over it — belongs to the registry that anchors a URL on
both, not to any one feature.

The test that a contract has not quietly renamed one is the battery: a pin naming
`every-case-is-addressed` on a contract whose guard answers to something else fails to match, and the
cell disagrees.

Twelve other identifier strings are shared by more than one contract today — `determinism`,
`signature-is-the-declared-type`, `every-profile-has-samples` and so on. Those are *not* here, and the
difference is the rule this file already states about `outputsAreEqual`: five contracts asking the same
question about different data is resemblance, not duplication. Each of them owns its own, and two
contracts choosing the same string is a coincidence the pair `(contract, identifier)` absorbs.

### Every address of one contract is distinct and is shaped like one

Every address of one contract is distinct and is shaped like one.

Both halves in one assertion, because they are one question — whether these strings can be used as
addresses — and a failure has to say which half gave way. `mutation/run.ts` asks the same pair of the
*guards* of a contract, for the same reason and with the same shape of identifier.

This is not the guard that a contract settles each *input* exactly once. Two contracts carry that one as
well and it is theirs, over data this file knows nothing about; a table can legitimately hold two cases
about one input, and no two cases may answer to one name.

### A table's groups partition its cases

**What this guards that `serialise.ts` cannot.** The serialiser refuses the same thing at the registry's
boundary, from the same `groupingFaults`, and that refusal is reached by the registry's suite. It is not
reached by `npm test`, which collects `contracts/` and nothing else — and `npm test` is what a
specification battery runs once per injected defect. A mutant that moved a case from one group to
another, or emptied a group, would publish a heading over the wrong cases and no column would redden.
That is the defect this guard exists for; the rest is tidiness.

One call per contract and not one per table, because a guard identifier is unique within a contract and
the two contracts carrying two tables would otherwise hold this name twice — the shape
`expectEveryCaseIsAddressed` already takes for the same reason. Each fault names its table, so nothing
is lost by asking once.

### Every case publishes the sentence that justifies it

Every case of every table publishes the sentence that justifies it. The three prototypes each wrote this
guard, identically, over tables that have no other field in common; the caller supplies how to name one
of its own cases so that the failure still reads in its own vocabulary.

## Consequences

Four names are frozen with the whole catalogue at once, and twelve near-identical strings deliberately
are not. The line is *the helper is the guard*, which is checkable by reading rather than by judgement.

## Confirmation

`every-identifier-is-an-address` establishes the shape and uniqueness at the registry's boundary;
`a-group-that-takes-a-case-address-is-refused` and `a-grouping-that-is-not-a-partition-is-refused`
establish the grouping half. The contract-side guards these helpers *are* cannot be cited by a decision,
because a contract's guard titles are built in a loop — a limit `mutation/decisions.ts` declares.

## What would reopen this

A fifth helper that is itself a guard, which is what a new catalogue-wide assertion would be. The bar is
the one in [ADR-0080](0080-what-may-live-in-the-catalogue-package.md), not this record.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — what a case address is, and
  what it may never be.
- [ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) — why an identifier
  alone is not an address.
- [ADR-0012](0012-block-4-4-is-several-tables-and-a-case-has-a-group.md) — the grouping these guards
  arrived with.
