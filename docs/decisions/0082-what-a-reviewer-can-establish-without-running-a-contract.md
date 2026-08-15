---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by:
  - battery: registry-storage
    guard: every-anatomy-requirement-is-triaged
---

# What a reviewer can establish about a contract without running it

## Context and Problem Statement

What a reviewer can establish about a contract in front of them, without running it. The list existed
as a checklist, and a checklist that claimed to be automatable would be the decorative guard applied to
the tool that hunts decorative guards.

## Considered Options

- Keep the list in a planning document, for whoever builds the validation pipeline.
- Publish it as data in the catalogue, with each entry triaged against where it can be settled from.

## Decision Outcome

It belongs to the catalogue by the criterion `reference-implementation.ts` applies to itself: a
requirement a reviewer can check by reading a contract is a rule of the catalogue, and a rule kept in a
planning document is a rule the person writing the sixth contract never reads. Every entry was
established by reading the five prototypes and carries what that reading measured, rather than what it
hoped for.

Three strata, and they are not worth the same.

`required` was measured present in all five. A sixth contract omitting one is departing from something
rather than choosing freely, and the two entries not yet at five say so with a number instead of being
quietly promoted.

`dependsOnTheFunction` cannot be universal: what it asks for depends on what the function does. A
reviewer checks that it is present and justified, never that it holds a particular value.

`observedOnce` is the honest stratum. Each entry was proved by exactly one contract, so it is an
observation and the most likely thing here to be wrong. It is published rather than promoted, because a
rule with one exemplar is a guess wearing a rule's clothes — the mistake three hand-written contracts
were spent avoiding.

Nothing below is enforced by a test, and that is deliberate. These are established by reading a contract
rather than by running one, exactly like `referenceImplementationRules` in
`reference-implementation.ts`, so the validation pipeline is what will enforce them — and a requirement
that lived only inside that tool would not be part of a catalogue whose whole product is auditability.

### What the pipeline can take, and what stays a reader's

Every entry carries `checkableFrom`, and the three values are a *measurement of where the frontier
falls* rather than a wish list. The criterion is stage 1's own constraint, stated in
`packages/validation/source.ts`: **it never imports what it analyses**, because importing is executing
and stage 1 is what runs before anything executes. So a requirement is `the source alone` when a syntax
tree settles it, and it is `the module` when it needs the *value* of a declaration — which belongs to a
stage that has already decided the code is safe to evaluate.

The triage, and the count is published because a checklist that claimed to be automatable would be the
decorative guard applied to the tool that hunts decorative guards. **Three of the eleven are settled by
the source alone; four need the module; four are a reader's and no stage will ever take them.** One
entry is split across two of those and is counted with the reader, because half of a requirement
enforced is not a requirement enforced: `referenceImplementationRules` has two rules, and stage 1
refuses an implementation that imports its own contract while nothing can decide whether a reference
*delegates to a built-in that does the same job*.

**What `a reader` means, said plainly.** Not "not yet built". These four ask whether a guard's verdict
*can* depend on elapsed time, whether a contract *diverges* from the ecosystem, whether a comment
records a real measurement, and whether an implementation does the same job as a built-in. Each is a
judgement about intent, and a tool that claimed to settle one would be claiming to check what it cannot.

Nothing enforces `checkableFrom` either, and one guard keeps the one half of it that can be kept: a new
entry with no verdict is refused, so the next requirement is triaged when it is written rather than left
for whoever builds the checker.

### Where a requirement can be settled from

`the source alone` is stage 1's reach — a syntax tree, no evaluation. `the module` needs the value of a
declaration and therefore a stage that has already vetted the code. `a reader` is a judgement no stage
takes.

## Consequences

The conformance controller is not "`contractAnatomy` made executable"; it is three entries, and a
fourth stage evaluating a vetted module takes four more. Four are a reader's for ever. That triage is
what `CLAUDE.md` records for this entry among the declarations nothing keeps, and it is why the entry
is priced rather than dressed as a mechanism.

## Confirmation

`every-anatomy-requirement-is-triaged` is the half that can be kept: a new entry with no `checkableFrom`
verdict is refused. Nothing establishes that a verdict is *correct*, which is the judgement this record
says no stage takes.

## What would reopen this

A fourth stage of the validation pipeline, which is what would move four entries from a reader's column
into a checkable one. The count in this record is the thing to remeasure on that day, not the reasoning.

## More Information

- [ADR-0005](0005-an-executable-declaration-names-its-guard.md) — stage 1's own constraint, which is
  the criterion this triage uses.
- [ADR-0083](0083-which-guards-may-depend-on-the-clock.md) — one of the four entries that stays a
  reader's, with the audit behind it.
