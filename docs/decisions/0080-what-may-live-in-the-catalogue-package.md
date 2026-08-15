---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# What may live in the catalogue package, and why resemblance is not duplication

## Context and Problem Statement

What every contract in this catalogue shares. Three contracts were written by hand with no shared code
so that this question could be answered against evidence; the suspension has ended and the answer has
to be written down before a fourth contract is added.

## Considered Options

- Share what the contracts repeat.
- Share what the contracts repeat *identically*, and only where it belongs to the registry.

## Decision Outcome

Whatever lives in this file is part of the public surface of every contract that imports it, and
inherits their discipline of freezing. A published major is frozen for life, so a field added here, a
literal removed here or a name changed here is not one edit: it is a breaking change to the whole
catalogue at once. Mutualising divides the cost of writing and multiplies the cost of changing — what
used to be three independent edits and no rupture becomes one rupture everywhere.

The bar for putting something here is therefore not "the contracts repeat it". It is "the contracts
repeat it *identically*, and what it says belongs to the registry rather than to any one feature".
Three contracts were written by hand with no shared abstraction precisely so that this bar could be
applied to evidence instead of to a guess, and every entry below names what the three exemplars showed.

### What was left out, and why

What was left out is as much of the answer as what was put in, and it is recorded here so that the next
reader does not have to rediscover it.

`outputsAreEqual` exists in all three contracts with three different bodies — `Object.is` on a
primitive, `Object.is` on a timestamp with a null case, a structural walk over a Map. That is
resemblance, not duplication.

`propertyRuns` carries the same figure, 1000, in all three, and three independent measurements behind
it. Sharing the value would make one contract's declared strength rest on another contract's benchmark.

`BenchmarkProfile` looked shared after two contracts and was not. The third had to replace
`sampleClass` with a shape vocabulary, because a total function has no use for "accepted" and
"rejected". Three exemplars showed the axis, not the abstraction.

## Consequences

Three refusals are recorded with what each of them cost to discover, which is what makes the bar
usable by somebody who did not write the three prototypes. The same bar governs `mutation/mutants.ts`,
and it is stated once in `CLAUDE.md` rather than twice.

## Confirmation

Nothing guards this, and nothing could: it is a rule about what may be *added*, and no assertion can
read a future addition. What keeps it is the freeze discipline stated at the top of the file — anything
here is frozen with every contract at once, which makes the cost of a wrong entry visible before it is
made rather than after.

## What would reopen this

A second language in the catalogue. Everything here is TypeScript's shape as much as the registry's,
and a second language is what would show which half was which.

## More Information

- [ADR-0075](0075-what-a-mutant-helper-shares-and-what-stays-in-the-battery.md) — the same bar applied
  to the instrument's own helpers.
- [ADR-0021](0021-a-property-settles-what-its-alphabet-represents.md) — why `propertyRuns` is a
  contract's own measurement and not a shared constant.
