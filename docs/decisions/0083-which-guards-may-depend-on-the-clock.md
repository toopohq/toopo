---
status: accepted
date: 2026-08-15
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# Which guards may depend on the clock

## Context and Problem Statement

Every guard whose verdict can depend on the clock declares a timeout, or removes the dependency. A test
framework's default limit is a duration assertion nobody wrote.

## Considered Options

- Give every guard a timeout.
- Give a timeout to the guards whose verdict a defect's complexity can act on, and audit which those
  are.

## Decision Outcome

A test framework's default limit is a duration assertion nobody wrote. Measured on `array/group-by@1`:
M-18 rebuilds a group array on every insertion, answers correctly on every sample, and takes 5392 ms
against the reference's 0.7 ms on the fifty-thousand-element sample. Under vitest's five-second default
it failed the block 4.5 shape test — a test that asserts a shape and was silently asserting a duration
as well, eight per cent away from flipping with the speed of the machine. A verdict that flips with the
speed of the computer is the one thing the mutation instrument exists to prevent, so it would have been
pinned as a defect that contract catches.

The rule bites where a guard feeds the implementation an input whose size a defect's complexity can act
on. Audited across the three prototypes, with the per-guard durations of a full run:

Two guards qualify, both in block 4.5, and both now declare a timeout — the shape test of
`array/group-by@1`, which groups fifty thousand elements, and the class test of `number/parse@1`, whose
`long-inputs` profile carries a five-thousand-character sample. The second was measured rather than
assumed, and the first version of the claim was wrong: a nested-quantifier grammar that still accepts
those samples costs 0.032 ms against the reference's 0.031 ms. One that rejects them does not terminate
on forty characters. The size axis is real; what makes it bite is a defect that refuses, which is
precisely what that guard is there to catch.

No other guard does. The slowest guard in the whole suite is the time-zone property of `date/add@1`, at
69 ms against a five-second default — seventy times of headroom — and every property draws inputs its
arbitraries bound small: arrays of at most twenty-four elements, strings of at most a dozen digits,
dates in one range. A quadratic defect on twenty-four elements is five hundred and seventy-six
operations.

A guard that reads the clock at all, even where its verdict does not depend on the value, uses a pinned
instant instead. A rule with an exception it does not name is a sentence.

## Consequences

**This rule is declared, cited in prose, and imported by nothing executable, and this record does not
change that.** It is one of the four entries of `contractAnatomy` that stay a reader's for ever: which
guards *can* depend on elapsed time is a judgement about what a defect could do to a guard, and a tool
that claimed to settle it would be claiming to check what it cannot. `CLAUDE.md` goes on listing it
among the declarations nothing keeps, and moving the argument into this record neither closes it nor
pretends to.

## Confirmation

Nothing confirms it, and the entry above says why rather than leaving the empty field to be read as an
oversight. The audit is the evidence, and it is a measurement taken once rather than a guard that runs.

## What would reopen this

A fourth contract whose guards feed the implementation an input its arbitraries do not bound — which is
what the audit above rules out for the five, and what a new benchmark profile could reintroduce in one
line.

## More Information

- [ADR-0082](0082-what-a-reviewer-can-establish-without-running-a-contract.md) — the triage that puts
  this entry in the reader's column.
- [ADR-0053](0053-what-a-pin-on-a-re-drawn-property-may-claim.md) — the neighbouring question of a
  verdict that varies for a reason nobody declared.
