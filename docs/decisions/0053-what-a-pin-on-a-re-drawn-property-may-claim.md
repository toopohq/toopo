---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/mutants.ts
confirmed-by: []
---

# What a pin on a re-drawn property may claim

## Context and Problem Statement

`mutants.ts` states that a pin names what is red on every run. A property-based guard re-draws its
generations, so it has no determinism to offer — only a miss rate. A pin on one is therefore
unreachable as written, and pretending otherwise is what produced `G-14`.

## Considered Options

- Forbid a pin on a property-based guard.
- Let a pin carry its measured miss rate, and be legitimate only while that rate is unobservable.

## Decision Outcome

**A property that re-draws its generations has no determinism to offer, only a miss rate.** So the
rule `mutants.ts` states — *a pin names what is red on every run* — is unreachable as written for such
a guard, and pretending it is met is what produced `G-14`. The usable form: **a pin on a
property-based guard carries its measured miss rate, and is legitimate only when that rate is
unobservable over the lifetime of the project.** One green in 110 runs is met every fortnight, and a
pin met by a green every fortnight teaches its reader to ignore the red — the one known way to destroy
this instrument. A named figure beats an asserted determinism that does not exist.

**And the first step is not the rate. It is whether the guard polices the step the mutant breaks.**
`G-14` stops `keep` keeping marks, and it pinned P1, which `POLICED` declares for `unify` and `fold`.
P1's table of equivalent spellings is blind to it at **0 of 200 000 draws** and cannot stop being:
`unify` is NFKC, so a bare mark is composed onto its base before `keep` runs, and a mark that survives
composition is one the rule *keeps* rather than a second spelling of anything. Its 0.470% of catching
draws was the general-purpose alphabet having an accident. **Without this step, a rate is optimised for
an accident; with it, there is no rate to measure and only a pin to drop.** The pin is dropped on that
argument rather than on its 59-in-60.

**And before either: check that the thing is stochastic at all.** This is the sister of the rule above
and it was paid for outside this section. The drive-letter door presented itself as a rate — eight
invocations from mixed launchers gave two collapses, twenty from one shell gave none, and *two in
eight* was written down as though it were a frequency. Nothing about it was random. It is a predicate
on the invocation, **20 of 20 under one spelling of the entry point and 0 of 20 under the other**, and
what *two in eight* measured was how often the sampling happened to include the deciding input. **A
frequency measured over trials that differ in a hidden deterministic input is a number about the
sampling and not about the system** — and it is worse than no number, because it cannot be reproduced,
so every failure to reproduce it reads as evidence that the rate is low. That reading cost two replays
and about half an hour before anybody looked for a predicate instead of a probability.

The check is the same one either way and it is cheap: **vary one input at a time and look for a cell
that is 0 of *n* or *n* of *n*.** A stochastic phenomenon has no such cell; a hidden predicate is
nothing but such cells, and one of them ends the question without a confidence interval. `mutants.ts`
carries it as the third of a series, and they read together: a rate is worth measuring only if the
guard polices the step, only if the phenomenon is stochastic, and only against a trial count put
beside the rate being looked for. The third of those is the *0 in 30* lesson from the teardown, and
this is the first time all three are stated as one thing.

## Consequences

**The detour is recorded because it was expensive and it looked right.** Widening the spelling table
with a decomposed entry was proposed, built, and measured: 0 of 100 000 against `G-14`, unchanged, and
*fewer* catches on the two mutants P1 does police — 35 487 against 38 142, 80 700 against 83 995 —
because a tenth entry dilutes the nine. A symbol added to a frozen alphabet with no red in front of it
is decorative in this repository's exact sense. It was reverted, and the refusal now lives in the
table's own comment so the next reader does not repeat it.

**What separates a guard worth keeping from a symbol worth reverting, and it is measurable rather than
doctrinal: a guard whose failure has been observed on its real condition is kept, even when no battery
mutant can produce that condition; a guard with no red at all is not.** The partition of
`support-the-texts-reach-every-region` is the first case — it replaced a `.length` with the three kinds
the table holds, and it was seen red twice, on an entry silently changing kind and on a kind nobody
foresaw. No mutant produces either, and none can: a battery injects into `reference.ts` and cannot
reach a generator's coverage. A person editing that table produces both in one line. It is the census's
own argument, arriving on an arbitrary.

**The method survives and the script does not**, because the validation is what made it worth
anything. Inject the mutant, reproduce the generator beside it, **check the reproduction against a
series of real runs before believing it**, then read the rate. On `G-14` the reproduction predicted
0.89% and 60 real runs gave 1 green — agreeing, which is what earned the 200 000-draw figure the right
to be quoted. Three minutes for any pair of mutant and pin, and it is written in `mutants.ts` where
whoever is about to pin something will be reading.

## Confirmation

Nothing guards this, and there is nothing a guard could hold: it is a rule about what a *pin* may
claim, and a pin is checked by the battery it belongs to rather than by a suite. What keeps it is
`calibrate()` refusing a pin that names no guard, plus the method written in `mutants.ts` beside the
pins themselves.

The rule's own instance closed: `G-14` pinned `p1-two-spellings-one-slug`, that pin is gone, and
`G-02`'s repair was chosen for its margin rather than its precision — a second astral letter widening
the alphabet, taking the smallest count over a hundred runs from 2 to 8, which is a margin visible
without a rate at all.

## What would reopen this

A property whose draws are seeded rather than re-drawn, which would give a pin back the determinism
this record says it cannot have. `propertyRuns` is shared by all eight properties of a contract, so
that is a decision about the whole contract rather than about one pin.

## More Information

- [ADR-0015](0015-the-draw-count-is-a-floor.md) — what a draw count may claim.
- [ADR-0056](0056-a-control-that-is-red-with-nothing-injected.md) — the *0 in 30* lesson this record's
  third check comes from.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
