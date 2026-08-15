---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/value.ts
confirmed-by: []
---

# The record models the declarative half, and serves the executable half as hashed files

## Context and Problem Statement

A contract has two kinds of content. Some of it is data — a name, a summary, a table of cases, a
declared type. Some of it is code — `outputsAreEqual`, the key functions of `array/group-by@1`, the
bodies of the properties and the arbitraries they draw from. A schema has to decide which of the two
it models, and the decision cannot be revisited after publication.

## Considered Options

- Model both, carrying the source of a function as a field.
- Model the declarative half only, and serve the executable half as hashed files.

## Decision Outcome

**The frontier this record is built on.** A contract's *declarative* content is modelled here; its
*executable* content is served as hashed files and never modelled. `outputsAreEqual`, the key
functions of `array/group-by@1`, the bodies of the properties and the arbitraries they draw from are
all of the second kind. That is not a limit of the schema, it is its shape: a record that carried the
source of a function would publish code the registry does not run, and therefore does not verify,
which is the opposite of what this catalogue sells. §6.2 of the project specification had already
separated the two endpoints - the definition and the harness - and this record arrives at the same
line from underneath.

`ContractRecord.harness` is where the other side of it lands:

The executable half, as files with their hashes. This is where `outputsAreEqual`, the key functions,
the properties and the arbitraries live: served, hashed, never modelled.

## Consequences

**What the frontier costs, named here because nothing else names it.** A contract of higher order
carries cases whose *input* is a function. `array/group-by@1` has thirty of them. The playground the
site is meant to pre-fill with a contract's edge cases cannot pre-fill those: a function is not a
value a browser form holds. So the playground of a higher-order contract covers part of its table and
never all of it, and that is a consequence of this frontier rather than of the site's implementation.
It is better known now than while building the site.

Two other decisions stand downstream of this one and restate it from where they sit:
[ADR-0004](0004-what-the-schema-does-not-name-is-encoded.md), which says what happens to declarative
content the schema declines to interpret, and
[ADR-0013](0013-samples-are-carried-or-pointed-at.md), whose second arm exists because a generator is
a function the registry cannot hold.

## Confirmation

Nothing guards the frontier directly, and the honest reason is that it is a shape rather than a rule:
a field carrying a function body would have to be written before anything could refuse it. What the
suite does hold is the consequence — `packages/registry/value.ts` refuses a value it cannot model
rather than encoding it approximately, and `harnessOf` refuses any disagreement between a contract's
declared `files` and what is on disk.

## What would reopen this

A command that serves somebody the harness of what they installed. `CLAUDE.md` records that the
archive carries the four `reference.ts` blobs and nothing else because no command of `packages/cli/`
ever asks for a harness; on the day one does, the walk widens and this frontier is where the widening
is argued.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
