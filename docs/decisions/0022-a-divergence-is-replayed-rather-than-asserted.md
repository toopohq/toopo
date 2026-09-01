---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: array-group-by
    guard: every-divergence-is-justified
---

# A divergence from the language is replayed, never asserted in prose

## Context and Problem Statement

Three of the five contracts answer differently from what the language or the ecosystem answers, and
each says so in its published prose. A sentence claiming a divergence is a sentence that goes on being
true after the divergence has gone: a specification drifting back towards the common answer takes
nothing with it, and the prose keeps advertising a difference that no longer exists.

## Considered Options

- State the divergence in the contract's prose, where a reader meets it.
- Replay it: a guard that runs both answers on the rows where they differ.

## Decision Outcome

A contract that answers differently from what the ecosystem or the language answers carries a guard
that **replays** the divergence on the rows where it happens, rather than asserting it in prose. The
guard names the exact set of cases that diverge, so a specification drifting back towards the common
answer takes the measurement refusing that answer with it, and the drift is red instead of silent.

Three contracts carry one, in three shapes: `array/group-by@1` in a file of its own against
`Object.groupBy`, `string/levenshtein@1` by recoding its table into UTF-16 code units,
`string/slugify@1` by narrowing its alphabet to ASCII. The shapes differ because what is being
diverged from differs; what is identical is that the divergence is measured on the contract's own
table rather than described.

## Consequences

The prose stays — a reader meets the divergence where they are reading — but it stops being the only
statement of it, and it is the guard that goes red when the two disagree.

`number/parse@1` and `date/add@1` both diverge — from `Number` and from every library's fractional
month — and neither carries such a guard. That is recorded here as a debt against this rule rather
than as an exception to it.

That debt has a second symptom one field along: those are the same two contracts that carry no
`relationToTheLanguage`, which is why
[ADR-0009](0009-relation-to-the-language-is-optional.md) names this as the event that would fill that
field at five of five and take the measurement out from under its own optionality.

## Confirmation

`every-divergence-is-justified` in `contracts/typescript/array/group-by/language.test.ts` is the shape
in its purest form: a file of its own, running `Object.groupBy` beside the contract's answer on the
rows where the two differ, and requiring each of those rows to be one the contract has argued for.

The other two are the same claim in their own contracts' suites rather than in a file of their own,
because what is being diverged from is not a function one can call: a code-unit reading and an ASCII
alphabet are recodings of the contract's own table.

## What would reopen this

A divergence from something that cannot be run — a specification document, a standard's prose, the
behaviour of a language this catalogue does not hold. The replay is affordable here because every
divergence so far is from something with an implementation beside it.

## More Information

- [ADR-0009](0009-relation-to-the-language-is-optional.md) — the field that says what a contract's
  relation to the language is, and the two contracts that carry neither it nor a replay.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
