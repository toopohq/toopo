---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by: []
---

# What the schema does not name is encoded, never modelled

## Context and Problem Statement

Three places in the record hold content the schema deliberately declines to understand: the fields of
a case beyond the three the catalogue owns, everything a benchmark profile declares beyond the fields
named for it, and the declarations that belong to one contract and to no other. Something has to be
done with them, and inventing a vocabulary is the obvious move.

## Considered Options

- Invent a vocabulary wide enough to fit all of it.
- Carry it as an encoded value, and render it without interpreting it.

## Decision Outcome

### A case

One case. Three fields are the catalogue's and are the only three the five tables share - measured, and
[ADR-0081](0081-a-contract-is-the-folder-and-its-executable-halves-agree.md) says so in as many words -
and the fourth is everything else the case holds, encoded rather than modelled.

`data` is where this schema stops understanding a contract, and saying so is more useful than
inventing a vocabulary that fits none of the five. The registry renders it; it does not interpret it.
What that costs is that no query can ever ask "which cases answer null", because the registry does not
know which field is the answer.

### A profile

Everything else the profile declares, by the same rule `CaseRecord.data` follows: what is left after
the fields the schema names. Empty for four of the five; `array/group-by@1` leaves the key function its
samples are grouped under, because half of its behaviour arrives as a function and a profile that named
only its array would leave the expensive half of the call to whoever runs the benchmark.

### A profile's vocabulary

One class of the contract's own profile vocabulary, with what it claims about a sample.

### A declaration that belongs to one contract

A declaration that belongs to one contract and to no other.

This is the largest single thing the five contain and the schema does not understand. Of the exports
the five publish, `contractAnatomy` measured that seven are shared by all of them and that no other is
carried by more than two - so most of what each contract says is its own: `metricAxioms`, `theRule`,
`keyFunctionRules`, `applicationOrder`, `ambientTimeZoneProbes`, `staticAnalysisRequirements`,
`ecosystem`, `composeInsteadOfConfiguring`, `lossiness`, `countedIn`, `comparedAsWritten`,
`outputAlphabet`, `keyEquality`, `inputIsReadBy`.

They are carried as named encoded values, and the registry renders them without knowing what they
mean. The alternative was measured and refused: a vocabulary that fitted all fourteen would be a
vocabulary invented here rather than found in the contracts, and `BenchmarkProfile` is the
catalogue's own record of what that costs - it looked shared after two contracts and was not.

## Consequences

The cost is stated rather than hidden. A contract page renders these generically, so the site cannot
lay `theRule` out as six numbered steps unless it learns what `theRule` is; and no search can reach
inside them. Whether the registry should learn a vocabulary for them is a question the site will
answer, not this unit.

A profile's own vocabulary is data for the same reason.

Five contracts produced five vocabularies with no overlap, which `contractAnatomy` records as the
clearest thing in the catalogue that must never be mutualised. So the vocabulary is data of the
contract, and the registry stores the names without knowing what they mean.

## Confirmation

Nothing resolves an encoded value against a meaning, because there is no meaning here to resolve
against — that is the decision. What is guarded is the boundary:
`packages/registry/value.ts` refuses a value it cannot model, and
[ADR-0005](0005-an-executable-declaration-names-its-guard.md) covers the one claim an own declaration
is allowed to make about itself.

## What would reopen this

A second contract declaring something the first already declared under the same name and with the same
role. `BenchmarkProfile` is the precedent for how that is judged — it looked shared after two
contracts and was not, so two is not enough and the bar is what `catalogue/` already applies: the
contracts repeat it *identically*, and what it says belongs to the registry rather than to any one
feature.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
This is [ADR-0003](0003-the-code-data-frontier.md) arriving inside the declarative half: the frontier
says what is not modelled at all, and this says what is modelled as an opaque value.
