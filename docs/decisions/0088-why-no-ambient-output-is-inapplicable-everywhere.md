---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# Why no ambient output is inapplicable everywhere

## Context and Problem Statement

Why `no ambient output` is inapplicable everywhere, measured once and confirmed twice. Every contract
must answer all four universal properties, and this is the one no contract can answer with a test.

## Considered Options

- Write the property anyway, as a test that snapshots global state.
- Declare it inapplicable in each contract, with each contract writing its own reason.
- Declare it inapplicable, and publish the reason once where it belongs.

## Decision Outcome

A test that snapshots global state inside its own `it` runs after the earlier tests have called the
function hundreds of times, so it cannot see a write that already happened: measured on
`number/parse@1`, an implementation writing `globalThis.__parseNumberCalls` passes the whole suite. A
correct memoising cache passes it too, and should — a cache is not a defect. The guarantee is obtained
by static analysis in the validation pipeline, which forbids a feature from reaching global state at
all.

Published here rather than restated five times, because it is a fact about what a property can observe
and not about parsing, dates or grouping. A contract still declares its own entry: this is the reason it
is allowed to give, not a declaration it is spared.

**A whole sentence, for the reason `DETERMINISM_ORDERING_FINDING` is one.** All five contracts open
their `no ambient output` reason with it, so as a clause it opened a paragraph of four contract pages in
lower case. This doc block also used to sit sixty lines above the constant it describes, stacked on
another constant's, which is how it stayed there while the value under it was wrong.

## Consequences

The first option is refused for the exact reason this repository exists: it is a guard that cannot fail
on the defect it names, and writing it would have added a green test proving nothing. What was gained
instead is a reason each contract states and a stage of the pipeline that really does establish it.

## Confirmation

Nothing confirms it, and nothing should: the finding is that no property *can*. What establishes the
guarantee is stage 1's forbidden-constructs analysis, which is a different mechanism under a different
record; what keeps this reason honest is that it was measured on a real implementation writing to
`globalThis` and passing.

## What would reopen this

A test runner that isolates each guard in a fresh realm, which would let a property observe global
writes made during its own call and no others. Nothing in the four dev dependencies offers that today.

## More Information

- [ADR-0086](0086-determinism-is-ordered-under-no-ambient-input.md) — the neighbouring property, and the
  register rule both findings obey.
- [ADR-0008](0008-a-prose-field-rendered-as-a-paragraph-is-a-sentence.md) — why this is a whole sentence.
- [ADR-0089](0089-the-four-properties-every-contract-answers.md) — why an inapplicable property is
  answered rather than omitted.
