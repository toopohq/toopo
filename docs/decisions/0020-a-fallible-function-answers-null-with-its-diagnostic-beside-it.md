---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: number-parse
    guard: p4-failure-coupling
  - battery: date-add
    guard: p7-failure-coupling
---

# A fallible function answers `T | null`, and publishes its diagnostic beside it

## Context and Problem Statement

Two of the five contracts can fail, and a caller needs two different things from them: the answer, and
why there is none. How that pair is shaped is a decision every fallible contract in the catalogue
inherits for the life of its major version, so it is taken once.

## Considered Options

- `T | null`, with a diagnostic export beside the answer.
- A discriminated union, `{ ok, value } | { ok, reason }`.
- A thrown error carrying the reason.

## Decision Outcome

A fallible function returns `T | null` and publishes a diagnostic export **beside** it:
`describe<X>Failure(...)`, returning a reason literal owned by that contract, or `null`. No type is
shared between features — each contract declares its own literals.

Every contract that publishes a diagnostic carries a **coupling property**: a call fails exactly
when it has a description. Without it the two exports can drift, and an implementation that
optimises the answering path while leaving the diagnostic one alone will diverge on any input the
named cases do not cover.

Three forms were built and measured across both prototype contracts. The union
`{ ok, value } | { ok, reason }` ties this one on detection, so the error convention is not a
verification question. Read that tie at the strength it was actually measured: on `date/add@1` it is
a full-battery tie, every mutant under both lenses; on `number/parse@1` it rests on four mutants
under one lens. What decided it is that this form is **additive**: a contract can ship
`name@1` with no diagnostic and gain one later without breaking anyone, whereas putting the reason
in the return type freezes it into the major version on day one. Known costs are recorded in the
project specification, together with what would invalidate the decision.

Those measurements are replayable, at three annotated tags whose messages say what each one proves:
`evidence/error-convention-round-1` (two forms, six call sites), `evidence/error-convention-round-2`
(three forms on both contracts, and the batteries the detection tie comes from) and
`evidence/error-convention-round-3` (the callers that need the value and the reason at once). They
are tags rather than branches because the conclusion is on `main` and nobody should be reading three
dead working states — but a published sentence with no replayable measurement behind it is an
opinion, which is the one thing this repository sells against.

## Consequences

**The reason set of a contract is frozen with its major version.** Adding a literal, removing one,
or splitting one all break a caller that switches exhaustively — so the partition is chosen once,
deliberately, and a later change costs `name@2`. The additivity that decided this convention covers
gaining a diagnostic, not reshaping one.

The record's side of that is
[ADR-0016](0016-the-surface-carries-a-diagnostics-fields-only-when-there-is-one.md): a total contract
carries neither a reason set nor a coupling rule, rather than carrying an empty one.

The site's side is the playground, which calls both exports and shows the reason exactly when the
answer is `null` — a `→ null` printed under every answered call would be a line that is always the
same, and the two spellings of `1 000` would be indistinguishable on the page whose contract settles
them.

## Confirmation

`p4-failure-coupling` in `contracts/typescript/number/parse/properties.test.ts` and
`p7-failure-coupling` in `contracts/typescript/date/add/properties.test.ts` are the coupling property
itself, one per fallible contract: a call fails exactly when it has a description. Both are property
guards, so what they establish is over generated families and not over the named cases alone.

What no guard holds is the *convention* — that the next fallible contract takes this shape rather than
another. Stage 1 of the validation pipeline reads a submission's implementation and not its contract,
and the shape of a contract is what `contractAnatomy` measures, four of whose eleven entries are a
reader's for ever.

## What would reopen this

A caller that genuinely needs the value and the reason in one expression, often enough to pay for the
union. That was measured at `evidence/error-convention-round-3` and did not carry, on the callers this
catalogue has; a consumer outside it — a framework integration, a validation report generator — is the
population that could answer differently.

## More Information

- [ADR-0016](0016-the-surface-carries-a-diagnostics-fields-only-when-there-is-one.md) — how the record
  carries the two fields that exist only where a diagnostic does.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
