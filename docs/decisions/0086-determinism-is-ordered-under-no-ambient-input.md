---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# Determinism is ordered under no ambient input, and both stay declared

## Context and Problem Statement

`deterministic` and `no ambient input` are ordered rather than independent, measured on all three
prototypes. A reader counting two guards where there is one and a half is reading the contract as
stronger than it is.

## Considered Options

- Drop `deterministic`, since everything that reddens it reddens the other.
- Keep both, and publish the ordering.

## Decision Outcome

The determinism property calls the function twice in a row; the ambient-input property calls it, runs an
arbitrary history, and calls it again. Anything that makes two consecutive calls disagree makes two
calls with a history between them disagree as well, so every mutant that reddens the first reddens the
second — measured, with no exception across three batteries.

The converse is false, and the mutant that shows it now exists on each contract: P-21, D-22 and M-22
remember their last answer under a cheap proxy for identity, written on a miss and read on a hit. Two
identical consecutive calls read one slot, so determinism compares an answer against itself and stays
green; one foreign call in between replaces the slot, which is the only thing the ambient instance can
see. Measured, all three redden `no ambient input` and none reddens `deterministic`.

Both stay declared. Determinism is red on real mutants — a global-flagged regular expression, an array
reversed in place, a Date the implementation moved under itself — so it is not decorative. What it is not
is independent, and that is worth publishing rather than leaving a reader to assume two guards where
there is one and a half.

**A whole sentence, because it lands in prose a contract page prints.** It used to be a clause, and all
five contracts composed it as `` `...own first answer. ${this} - X is that mutant here.` `` - so every
contract page published a sentence beginning in lower case after a full stop. ADR-0008 carries the
register and names the two guards that keep it.

## Consequences

A published finding says what a pair of guards is worth rather than letting their count say it. The
literal that carries it is a whole sentence for the register reason, which is a second rule arriving on
the same string.

## Confirmation

Nothing in a suite confirms an ordering between two properties — it is a statement about what mutants
redden, and what establishes it is the battery cells themselves, which a decision cannot cite because a
contract's guard titles are built in a loop. The three memoise-last mutants are the evidence, and they
are pinned in each contract's battery.

## What would reopen this

A mutant that reddens `deterministic` and not `no ambient input`, which would break the ordering. Three
batteries have looked for one; a fourth contract with a different shape of state is where one would
come from.

## More Information

- [ADR-0008](0008-a-prose-field-rendered-as-a-paragraph-is-a-sentence.md) — the register rule that made
  this finding a whole sentence, and the two guards that keep it.
- [ADR-0088](0088-why-no-ambient-output-is-inapplicable-everywhere.md) — the neighbouring property, and
  why it is answered rather than tested.
