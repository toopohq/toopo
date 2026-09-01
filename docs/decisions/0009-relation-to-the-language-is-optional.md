---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
  - packages/registry/serialise.ts
confirmed-by: []
---

# `relationToTheLanguage` is optional, and the optionality is a measurement

## Context and Problem Statement

`IdentityRecord` is described by its own line:

The seven fields `contractAnatomy` measured present in five of five, and the eighth it measured at
three of five.

A schema can require the eighth and force the two contracts that lack it to fill it, or it can carry
the gap.

## Considered Options

- Require the field, and fill the two contracts that lack it.
- Make it optional, and record why the gap is left open.

## Decision Outcome

`relationToTheLanguage` is optional here rather than required, and the optionality is a measurement
rather than a convenience: it is missing from exactly the two contracts that also owe the divergence
replay, and `CLAUDE.md` records that as one debt with two symptoms. A schema that required it would
force the debt closed by transcription, which is the one repair that proves nothing.

## Consequences

It is also the field the register above was written for. It had none: three of its four values were
clauses and one was a sentence, and the page printed a clause as a bare paragraph on two contract
pages for as long as the field has existed. Filling the two contracts that lack it is a separate
decision about content and is still owed.

`serialise.ts` carries the field through as absent rather than as an empty string, because an empty
string would be a value the page would print.

## Confirmation

Nothing guards this, and there is nothing to guard: the decision is that a field may be absent, and an
absence is what a schema cannot refuse without reversing the decision. What is guarded is the register
of the value when there is one — [ADR-0008](0008-a-prose-field-rendered-as-a-paragraph-is-a-sentence.md).

## What would reopen this

`number/parse@1` and `date/add@1` gaining the divergence guard they owe. `CLAUDE.md` records the two
symptoms as one debt, so the unit that closes the replay is the unit in which these two contracts
acquire something to say about their relation to the language — and on that day the field is filled by
five of five and the optionality has no measurement behind it any more.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
