---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/mutants.ts
confirmed-by: []
---

# What a reproduced rate is worth, and how a repair is chosen

## Context and Problem Statement

A pin on a property-based guard carries a miss rate, and that rate is obtained by reproducing the
generator beside the mutant. The question this record settles is what such a number may be quoted to,
and what decides between two candidate repairs.

## Considered Options

- Quote the rate as measured, to the precision the arithmetic gives.
- Quote an order of magnitude, and let real runs decide anything finer.

## Decision Outcome

**The miss rate is the per-draw probability raised to the number of draws, so the exponent turns a
small error on the input into a large one on the answer.** Measured on `G-02` of `string-slugify`,
whose pin on P6 this repository reads at 1000 draws: a per-draw catching probability of 0.8226%
predicts one silent run in 3 866, and 0.6195% predicts one in 500. That is a **25% error on the input
becoming a factor of seven on the answer**, and 25% is well inside what a reproduction can be wrong by
while looking right.

So: **no miss rate obtained by reproducing a generator is trustworthy to better than an order of
magnitude**, and publishing one to four significant figures claims a precision the method has not got —
the same fault as a byte count published without the divisor that produced it. Quote the order, name
the draw count it was raised to, and let the real runs decide anything finer.

It is written here rather than beside `G-02` because it is not a fact about that cell. It holds for
every pin on a property-based guard this instrument will ever carry, and it was found by measuring one
of them.

**So a repair is chosen for its margin, never for its precision**, and that is the rule the sentence
above is worth: **take the repair whose margin swallows the known uncertainty of the method.** A factor
of ten is what a reproduced rate may be wrong by, so a repair that improves the rate by a factor of ten
has bought nothing that survives its own error bar, and one that improves it by a factor of thousands
is safe whichever way the model is wrong. On `G-02` the second astral symbol takes P6 from one silent
run in some thousands to one in some tens of millions on the model, and to one in some hundreds of
thousands on the least favourable reading the measurements permit — two readings a factor of seventy
apart, both far past anything that matters. **That is what decides it, and the third decimal of either
never enters.**

### The two cheap checks that come before spending real runs

**The two cheap checks that come before spending real runs**, both learned from the same cell and both
eliminating a hypothesis in minutes. *Is the draw count the one the model raises to?* — instrument the
predicate and count, because a property reading 600 draws where the model assumed 1000 moves the answer
further than any refinement of the probability will. *Is the draw sequence actually independent and
identically distributed?* — collect the catching count per run over a hundred runs and compare its
spread against the binomial one, because overdispersion is what produces silent runs a binomial model
cannot account for, and it shows up long before a silence does. On `G-02` both came back clean: 1000
draws exactly, and a spread of 0.96 times binomial over 150 runs at 0.87% per draw.

## Consequences

This is a rule about how a figure is published rather than a decision about one cell, so it is stated
in `CLAUDE.md` under *How a figure is published* and argued here. It also prices a measurement out:
separating one-in-6 100 from one-in-500 on `G-02` needs some 5 000 real passes, and that was not spent,
because every candidate repair cleared both readings by orders of magnitude — a measurement that enters
no decision is not bought at any price.

## Confirmation

Nothing guards this, and there is nothing a guard could hold: it is a rule about what a *published
number* may claim, and no assertion can read the sentence a rate is quoted in. What keeps it is the
method written in `mutation/mutants.ts` beside the pins themselves, and the fact that the rule's first
application is recorded with its own limits rather than with a figure.

## What would reopen this

A generator whose draws are reproducible exactly rather than statistically — a seeded property — which
would make the reproduced rate the real rate and remove the error bar this record is about.

## More Information

- [ADR-0053](0053-what-a-pin-on-a-re-drawn-property-may-claim.md) — the three checks that come before
  measuring a rate at all.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — the same discipline on a count rather
  than on a rate.
- [ADR-0056](0056-a-control-that-is-red-with-nothing-injected.md) — why a trial count is quoted beside
  the rate being looked for.
