---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/mutants.ts
confirmed-by:
  - battery: meta
    guard: every-cell-published-as-surviving-is-pinned-as-surviving
  - battery: meta
    guard: no-two-cells-of-one-battery-answer-to-one-address
---

# How many guards a pin names

## Context and Problem Statement

Which guards a killed cell names, by identifier, and where the line is.

A pin exists so that a defect which stops being caught by the guard that used to catch it is as loud
as a failing test. That is worth doing where a single edit could take the detection away, and worth
nothing where forty guards catch the same defect — so the rule is written here rather than left to
judgement, because the next battery will apply it and two batteries applying different rules would
make the pins incomparable.

## Considered Options

- Name every red guard, always.
- Name none, and pin only the verdict.
- Cut at a size: name all of them below it, and only the exercised ones above.

## Decision Outcome

**Five or fewer red guards: name all of them.** At that size the set usually sits in one region — one
property, or the cases of one block — and one commit can remove it.

**More than five: name the guards the mutant was written to exercise, and nothing else.**

**Five is a convention.** It is not derived from anything, and it is written down as a convention
because the number reads as though it were derived — which is a trap for whoever inherits it. What was
measured is a distribution of red-set sizes; where to cut that distribution is a choice, and it was
calibrated against a snapshot rather than against a law.

The snapshot has already moved twice, which is the whole argument for saying so. When the line was
drawn there were three batteries and 147 killed cells and the median red set was exactly five, so five
split them almost in half. A second measurement over six batteries and 197 cells put the median at
three. There are now eight batteries and 262 killed cells — `string/levenshtein@1` and its
specification battery — and the median is four: 151 cells sit at or below the line and 111 above it.
Pinning the 151 in full costs 324 titles; pinning the other 111 in full would cost 2248, none of which
would pin anything a single edit could remove, and every one of which would break on a rename. A pin
that transcribes a run is not a claim about the contract.

The line stays at five, and it must be remeasured when the fifth contract moves it again. It is
defensible across a range rather than at a point — what it has to separate is a set one commit can
remove from a transcript of a run — and moving it with every measurement would make two batteries
written a month apart incomparable. The median has now gone three, then four, on the same line; that it
moves in both directions is the evidence that five is a convention rather than a consequence.

### A pin names an identifier, never a title

**A pin names an identifier, never a title.** `run.ts` states the rule; the consequence here is that
rewording the sentence a guard shows in the runner's output leaves every pin standing, and that a pin
naming a string no guard of the contract
answers to is not an address at all — which is what LS-13 of `string-levenshtein-spec` was written to
demonstrate, and what it stopped being able to demonstrate once this rule existed.

### Pins are checked by inclusion rather than by equality

Pins are checked by inclusion rather than by equality, and that is measured too. Three consecutive runs
of the three batteries that existed then agreed on 173 of 174 cells; the one that moved is `F-1` on
`date/add@1`, which gained `P4` on the third run because `elapsedOnlyDuration` drew the empty record.
Requiring the exact set would have failed that cell on two runs out of three — a battery that reddens
on the seed is a battery nobody can read.

The older measurement stands and is the same shape. On `string/levenshtein@1`, L-05 reddens three
guards and two are pinned, because the third needs a pair the arbitraries draw on 0.221% of runs and is
therefore red on 175 runs out of 200.

## Consequences

The convention is written where whoever is about to pin something will be reading, and its own
provenance is written beside it — a number that looks derived and is not is a trap, and the two
remeasurements are the evidence that it is a choice.

## Confirmation

`every-cell-published-as-surviving-is-pinned-as-surviving` establishes that no cell escapes being
pinned at all; `no-two-cells-of-one-battery-answer-to-one-address` establishes that a pin addresses one
cell. Neither can establish that a pin names the *right* guards, which is what a replay measures rather
than a suite.

## What would reopen this

A sixth contract moving the median again, which the record above commits to remeasuring. What would
reopen the *convention* rather than the figure is a way of removing a red set that does not cost a
commit — at which point what the line separates would no longer be what it was drawn to separate.

## More Information

- [ADR-0053](0053-what-a-pin-on-a-re-drawn-property-may-claim.md) — what a pin on a re-drawn property
  may claim, which is the constraint this one sits inside.
- [ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) — why a pin names an
  identifier and never a title.
- [ADR-0077](0077-what-a-reproduced-rate-is-worth.md) — what the rate a pin carries is worth.
