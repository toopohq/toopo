---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: registry-storage
    guard: every-declared-type-occurs-in-the-contract
---

# A transcribed declaration is guarded by its occurrence in the contract's own source

## Context and Problem Statement

`ExportRecord.text` holds a TypeScript signature. A type is not a value, so nothing at run time can
read it, and the record has to transcribe it. Transcription drifts.

## Considered Options

- Leave the transcription unguarded and rely on review.
- Require the transcribed text to occur in the contract's own source.

## Decision Outcome

One export of a contract, with the type it must expose.

`text` is TypeScript source and it is transcribed rather than derived, because a type is not a value
and nothing at run time can read it. Transcription drifts, so it is guarded:
`against-the-catalogue.test.ts` requires this exact declaration to occur in the contract's own
`contract.ts`, whitespace normalised. A signature is the first thing a reader of a contract page looks
at, so it has to be in the record; being in the record it has to be checkable, and it is.

## Consequences

The rule generalises to every transcribed value in the record, and the one other instance carries its
own limit: `ProfileSamples.producedBy` is guarded the same way and is recorded as `one-directional` in
`field-map.ts`, because a text can survive the guard for a reason that has nothing to do with the
samples it claims to produce. That is [ADR-0013](0013-samples-are-carried-or-pointed-at.md).

**That second instance left the rule at
[ADR-0171](0171-a-profile-name-is-frozen-with-a-claim-nothing-reads-and-only-the-next-contract-can-still-be-held-to-it.md),
and the limit named above is exactly why.** `producedBy` is now resolved against the profile that
writes it rather than against the file that contains it, so the text cannot survive for another
profile's reason, and the field is `structural`. The paragraph below still holds for the signature and
is the argument for why that one did not have to move: a contract publishes one export under one name,
so there is no twin to answer for it.

What the occurrence check does not establish is that the transcription is the *right* declaration —
only that it is *a* declaration the file holds. On a signature that is enough, because a contract
publishes one export under one name.

## Confirmation

`every-declared-type-occurs-in-the-contract` resolves the declaration against the contract's own
`contract.ts`, whitespace normalised, once per contract.

That pair is what this record used to say in prose while `confirmed-by` was empty — and the file was
named under `governs` besides, which is a guard addressed as a path. Both halves are one repair: the
guard is named where a guard is named, and `no-decision-governs-a-guard-file` is what stops the other
spelling coming back.

## What would reopen this

A contract publishing two exports whose declarations differ only in a position the normalisation
erases. That is the case where occurrence stops implying identity, and it is the point at which the
guard would have to resolve the declaration to its export rather than to the file.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
