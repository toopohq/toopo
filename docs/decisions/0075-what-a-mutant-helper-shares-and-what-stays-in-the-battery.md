---
status: accepted
date: 2026-08-15
governs:
  - mutation/mutants.ts
confirmed-by:
  - battery: meta
    guard: every-battery-of-this-folder-is-published
---

# What a mutant helper shares, and what stays in the battery

## Context and Problem Statement

How a battery declares a mutant. Three batteries had written the same helpers by hand, and the
question was whether that was the no-abstraction suspension working as intended or a plain violation.

## Considered Options

- Read it as the suspension: three contracts repeating themselves is what the suspension permits.
- Read it as duplication: `mutation/` is not a contract folder, so the suspension never covered it.

## Decision Outcome

`mutation/` is not a contract folder, so the suspension of the no-duplication rule that lets three
contracts repeat themselves never covered it. These helpers were copied into three batteries anyway,
which was a plain violation rather than a question about the contract format, and this file is the
correction.

What is shared is the shape of an expectation and the shape of a mutant that every lens of an arm sees
alike. What is not shared stays in the battery that needs it: `array/group-by@1` builds signature
defects with a different expectation per lens, `date/add@1` swaps reason literals by anchoring on whole
statements, and neither has a second exemplar to generalise from.

### The path literals

Almost every edit rewrites the reference implementation; the lenses are what edit a test file.

The two files a specification battery injects into.

They are named here rather than in each specification battery for the reason `reference` is: three
batteries write the same two path literals, and a path literal repeated three times is a rename away
from being wrong in two places.

## Consequences

The bar that governs `packages/catalogue/` governs this file too, and it is the same bar: shared
because the batteries repeat it *identically*, not because they resemble each other. The three
exceptions above are named so that the next battery does not read this file as a template for
everything a battery does.

## Confirmation

`every-battery-of-this-folder-is-published` establishes that no battery sits outside the set these
helpers are shared across; nothing separately establishes that a helper is used rather than
reimplemented, which the type system settles at each call site.

## What would reopen this

A fourth battery that needs a fourth form. Two of the three exceptions above already have one exemplar
each; a second exemplar of either is what would move it into this file.

## More Information

- [ADR-0053](0053-what-a-pin-on-a-re-drawn-property-may-claim.md) — what a pin declared through these
  helpers may claim.
