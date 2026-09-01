---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: registry-storage
    guard: the-absorbed-state-is-constructible
  - battery: registry-storage
    guard: fills-the-fields-no-published-contract-fills
---

# Four lifecycle states, and two retirements that are not one

## Context and Problem Statement

Where a contract stands with respect to publication.

A contract can stop being current in two different ways, and they look alike from a distance: it can
be decided against before it ever ships, or it can be absorbed by the language after it has shipped.
A schema that collapses them has to pick which of the two it describes.

## Considered Options

- One retirement state, with a reason field distinguishing the cases.
- Two retirement states, decided apart.

## Decision Outcome

Four states, and the two retirements are deliberately not one. A contract that was decided against
before it ever shipped has no callers and no immutability obligation; a contract the language later
absorbed has both. Collapsing them would either strand the first in a catalogue it was refused from,
or let the second read as never having existed - and a published version is frozen for life and served
for ever, whatever the language does afterwards.

### `not-yet-published`

Written, verified, not yet published. Four of the five.

### `never-published`

Written and decided against before publication. One of the five: `array/group-by@1`, whose
`catalogueAdmission` carries the decision, the measurement it rests on and what the contract is kept
for. Nothing was ever served, so nothing is frozen.

### `published`

Published, immutable, served. None of the five today, and it is here because permanent rule 6 is the
reason this registry exists: "a published version is frozen for life". A schema with no state for the
normal case would not be a registry schema.

### `absorbed-by-the-language`

Published, then answered by the language itself. Still immutable, still served for ever, and flagged
as such rather than left to rot in silence.

`answeredBy`:

What the language ships that answers this contract, and where.

`measurement`:

The measurement that established it, replayable in the way `language.test.ts` is.

## Consequences

**The one field in this record that no contract fills**, and it is authorised by a written rule rather
than by a measurement. The rule is the one `array/group-by@1` established and `CLAUDE.md` records:
"the language moves, so the catalogue re-examines itself against it. Clearing rule 7 is not a property
a contract acquires once and keeps." A contract that clears rule 7 today and is absorbed tomorrow
cannot be unpublished - permanent rule 6 forbids it - so the only honest thing the catalogue can do is
say so on its page. Without this state the rule has no consequence any reader can see, which is the
definition of a decorative rule.

`array/group-by@1` is the shape of the thing without being an instance of it: it was refused *before*
publication for exactly this reason, on exactly this measurement. Had it shipped first, it would be
here.

It is therefore one of the two exceptions [ADR-0002](0002-every-field-is-filled-by-a-contract.md)
allows, and it names its authority above.

## Confirmation

`the-absorbed-state-is-constructible` in `packages/registry/the-sixth-contract.test.ts` builds the
state no contract fills, and `fills-the-fields-no-published-contract-fills` is the guard that would notice
it becoming unreachable.

## What would reopen this

The language absorbing a published contract. That is the day the state stops being authorised by a
rule and starts being filled by a contract, and the day the two retirements have to be told apart in
public rather than in a type.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
