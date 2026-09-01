---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
confirmed-by: []
---

# The draw count is a floor, and its justification is not carried

## Context and Problem Statement

`PropertiesRecord.runs` is the number of draws every property of a contract is tested on. Each of the
five chose it by measurement — three draw counts and three durations — and `contractAnatomy` requires
that measurement of every contract. It lives in a JSDoc comment in all five and the registry does not
serve it.

## Considered Options

- Carry the measurement in the record, so a reader can check the figure.
- Carry the figure alone, and record the gap.

## Decision Outcome

The number of draws every property of this contract is tested on. A floor, not a value: official
validation may draw more, nothing may draw fewer.

Beside it sits `PropertiesRecord.universal`:

The catalogue's four names, in the catalogue's order, each answered. Five of five.

The measurement that chose it - three draw counts and three durations - is required of every contract
by `contractAnatomy` and lives in a JSDoc comment in all five. It is not carried here, and that is a
debt of the contracts rather than a decision of this schema: a published figure whose justification the
registry cannot serve is a figure a reader has to take on trust.

## Consequences

A floor rather than a value is what lets official validation draw more without a contract's record
changing. The cost is the one named above: the figure is served and its justification is not, so a
contract page publishes a number a reader cannot check.

## Confirmation

Nothing guards it, and the paragraph above says why — the justification is prose in a contract's own
source and the registry has no field for it.

## What would reopen this

The measurement becoming data on the contract. That is what would let the registry serve it, and it is
a change to five contracts rather than to this schema — which is why it is recorded here as a debt of
the contracts.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
