---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: nothing-is-measured-yet
  - battery: registry-storage
    guard: every-unfilled-field-is-justified
  - battery: registry-storage
    guard: the-unfilled-fields-are-the-ones-that-were-argued-for
---

# A field the closed launch cannot fill is carried and answered null

## Context and Problem Statement

Four fields of an implementation record have nothing true to put in them — the implementation's own
version, its minified size, its benchmark figures, and the whole vocabulary a submission process would
need.

## Considered Options

- Leave the fields out until something can fill them.
- Fill them with a plausible value.
- Carry them, answer `null`, and publish the reason beside each one.

## Decision Outcome

The launch is closed and the founder writes everything, so every contract has exactly one
implementation today: its own reference. The list is still a list, and the fields below are still the
fields an open registry needs, because retrofitting a one-to-many relation into a published schema
costs far more than carrying it from the start — and a published version is frozen for life.

What is *not* carried is anything a submission process would need and no implementation can fill:
there is no review state, no submitter identity, no competition ranking. Those belong to the
publishing tool, which is the fourth unit, and inventing them here would be inventing the tool.

### The version

The implementation's own version, which moves while the contract's major does not, or `null` while
nothing has published it.

`null` for all five. A version is assigned by the publishing tool, which is the fourth unit, and the
five references have never been published — so writing `1.0.0` here would be inventing a fact about a
release that has not happened. The lockfile takes a `string` and not this type, because a lockfile
only ever records something that was served.

### The minified size

The size a bundler would ship, in bytes, or `null` when nothing has measured it.

`null` for all five. Producing it needs a minifier, the repository is limited to four dev
dependencies, and a figure invented from the source size would be a number with nothing behind it.
The field exists because the comparison it serves — two implementations of one contract, one of them
smaller — is the reason an implementation list exists at all; the null says the comparison cannot be
made yet.

### The benchmark figures

A figure measured on a real machine. Empty for every implementation of the five, for the reason
block 4.5 gives: there is no reference machine yet, and a number produced on a developer laptop would
be dishonest.

The environment is part of the figure rather than of the implementation, because the same code has
different numbers on node, in a browser and on bun, and a single number would be an average of three
things nobody runs.

## Consequences

A reader of the served schema meets four nulls and a reason for each, rather than four absences they
would have to interpret. The alternative this refuses — a field left out — reads exactly like a field
forgotten, which is the treatment `OwnDeclaration.executableBy` already receives one folder along.

## Confirmation

`nothing-is-measured-yet` establishes that no minified size, no benchmark figure and no version is
carried by any of the five; `every-unfilled-field-is-justified` and
`the-unfilled-fields-are-the-ones-that-were-argued-for` establish that each unfilled field names the
sentence that argues for it, and that no other field is unfilled.

## What would reopen this

A second implementation of any contract, which is what the publishing tool makes possible. It would
give three of these four fields something true to hold, and the fourth — the submission vocabulary —
is what that tool has to design rather than inherit.

## More Information

- [ADR-0013](0013-samples-are-carried-or-pointed-at.md) — the same treatment of a field that cannot be
  filled, one block along.
- [ADR-0074](0074-the-lockfile-version-moves-when-its-shape-moves.md) — why the lockfile takes a
  `string` version where this type takes `string | null`.
