---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
confirmed-by: []
---

# The second slice inverts one clause and holds the other, and that buys a bracket or a refusal

## Context and Problem Statement

ADR-0209 priced the first witness on `round-trip.test.ts` and **refused to extrapolate its own
headline**. Thirty-two of thirty-four is 94 %, and that record published no fraction for the 262,
because the rule that chose the file selected for the very thing being measured: *the wholly
unprobed file with the most guards* selects for a parameterised table, and a table is written
precisely so that a removed branch reddens one row. **32 of that file's 34 guards are rows of an
`it.each`.**

It named the correcting reading in its own reopening section — **a slice over the standalone
guards**, the 117 of the 262 not parameterised over a contract, *which is the same work under a rule
chosen to have the opposite bias*. This is that slice.

**Two readings at the same bias give a false precision; two readings at opposite biases give a
bracket.** That is what this unit buys and it is the whole of what it buys. It adds no mechanism, it
retires no column, and the price it publishes is a fourth row of a table that already has three.

## Decision Drivers

- **The definition does not move.** ADR-0209's A1, A2 and the narrowest-defect discipline were
  committed at `68e466a` before the first cell that took one. This is the population where relaxing
  them would be most tempting, because a hand-written guard resists more than a table's row does. **A
  fraction obtained by widening the definition brackets nothing** — it manufactures the result it
  claims to measure. If a guard does not yield under A1 and A2, it resists, and that is the figure.
- **A rule is fixed before a guard is read, and its bias is named before the result is known.**
  ADR-0209's discipline, and the only thing that makes a second reading a bracket rather than a
  second attempt.
- **Exactly one clause is inverted.** A rule that changes two things at once brackets nothing,
  because nothing then says which of the two moved the rate.
- **A guard is not rewritten to make a cell work.** ADR-0203.
- **A declaration is retired because a cell witnesses it**, never because the count looked better.
- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199.

## The rule, fixed before a guard of the slice was read

**Every unprobed-claims guard of `packages/registry` that is not parameterised over a contract and
is collected in a wholly unprobed test file.**

Two clauses, each a property of the population, and neither of them a reading of a guard's sentence:

- **Not parameterised over a contract.** ADR-0209's own test, taken from that record rather than
  invented here: the address does not end in one of the catalogue's seven contract slugs. **This is
  the clause that is inverted.**
- **Collected in a wholly unprobed test file.** Every guard the folder collects in that file sits in
  `unprobedClaims`, so no cell of this battery reddens anything in it and no witness can arrive
  incidentally from a cell aimed at a neighbour. **This is the clause that is held**, unchanged, and
  holding it is what makes the two rates comparable: it is ADR-0209's reason 1 word for word.

### The structure the rule was fixed against, and nothing else

A control run of this folder's own suite at `9ae6d8d` — **466 collected assertions, none red** —
joined to the attribution of ADR-0209's replay on disk, which is the artefact that record was
written from. The join is total in both directions: every one of the 228 addresses the attribution
declares unprobed is carried by the report, and every one of the 466 the report carries falls in
exactly one bucket.

| file | collected | alone | never alone | unprobed | of them a family | of them standalone |
| --- | --- | --- | --- | --- | --- | --- |
| `against-the-catalogue.test.ts` | 69 | 9 | 0 | 52 | 49 | 3 |
| `response.test.ts` | 67 | 6 | 29 | 32 | 26 | 6 |
| `snapshot.test.ts` | 60 | 0 | 33 | 27 | 21 | 6 |
| **`coverage.test.ts`** | **28** | **0** | **0** | **28** | **28** | **0** |
| `determinism.test.ts` | 20 | 1 | 5 | 14 | 0 | 14 |
| `signature.test.ts` | 16 | 3 | 0 | 13 | 0 | 13 |
| `the-sixth-contract.test.ts` | 15 | 2 | 2 | 11 | 0 | 11 |
| `verifiability.test.ts` | 13 | 1 | 0 | 12 | 0 | 12 |
| **`endpoints.test.ts`** | **12** | **0** | **0** | **12** | **0** | **12** |
| **`visibility.test.ts`** | **12** | **0** | **0** | **12** | **7** | **5** |
| `implementations.test.ts` | 24 | 0 | 14 | 10 | 7 | 3 |
| **`attestation.test.ts`** | **3** | **0** | **0** | **3** | **0** | **3** |
| `publication.test.ts` | 9 | 1 | 6 | 1 | 0 | 1 |
| `round-trip.test.ts` | 34 | 17 | 16 | 1 | 0 | 1 |

**The 228 are 138 parameterised and 90 standalone**, where ADR-0209 read 145 and 117 over the 262 it
had. The difference is that record's own slice leaving the bucket: `round-trip.test.ts` gave up 7 of
the parameterised and 27 of the standalone, and keeps the one guard that resisted.

**The slice is 20 guards over three files** — 12 of `endpoints.test.ts`, 5 of `visibility.test.ts`,
3 of `attestation.test.ts`. That is 22 % of the 90 standalone guards left in the bucket, and 8.8 % of
the 228.

**`coverage.test.ts` is the file that says the rule is doing work rather than being convenient.** It
is wholly unprobed, it is the second largest such file, and **all 28 of its guards are parameterised
over a contract** — so it is admitted by the clause that is held and excluded whole by the clause
that is inverted. It is the file that would have pulled the rate back towards ADR-0209's, and the
rule takes none of it.

### Which way it biases, written before the result is known

**Downwards, and for a reason about how the guards were authored rather than a feeling about how
hard they look.**

A parameterised table exists because somebody found a rule with *n* branches and wrote one guard per
branch. **That correspondence between a branch of the code and a row of the table is what a table
is**, so a defect removing one branch reddens exactly one row: the cell is available by
construction, and the author of the file arranged for it in advance. `round-trip.test.ts` says so in
its own words — *removing a branch of the encoder reddens here first and says which value it was*.

**A standalone guard carries no such correspondence.** It was written to state a claim, not to sit
opposite a branch, and nothing about it promises that the claim has a narrowest falsifier reachable
in one edit. So the expected result is a lower fraction than 94 %, and that expectation is what the
bracket is made of.

**The bias ADR-0209 named as downwards is common to both slices and therefore cancels.** That record
excluded the 173 guards sitting in files some cell already reaches, where a witness may arrive free;
the held clause excludes them here too, by the same wording. It is a bias of both readings against
the population, not a difference between them, and naming it as shared is the point of holding the
clause.

### The three outcomes, and each is a result

1. **The two fractions bracket.** 94 % above, this reading below, and the fraction of the 262 is
   publishable as an interval with a named bias at each end — never as a mean of the two, which
   would be a number measured nowhere.
2. **The two fractions meet.** That is the larger finding, and it is written here in advance so that
   it cannot be read as a rescue: it would say **parameterisation was not the factor**, that 94 % is
   a property of the population rather than of the table, and that the fraction is publishable as
   one number with the table bias retired.
3. **This reading comes back above 94 %.** Then the direction named above is false, neither reading
   bounds the other, and what is published is a refusal to bracket with the refuted prediction beside
   it — the shape ADR-0204 took for the authoring cost, which it declared unpriceable rather than
   guessing.

### The two counts, as ADR-0209 published them

**What the instrument counts as probed and what this work counts as witnessed are two numbers, and
the gap between them is what makes the reading believable.** `wronglyDeclaredSilent` refuses a
declaration any mutant contradicts, so a guard reddened incidentally leaves `unprobedClaims` whatever
this record thinks of it. ADR-0209 published 34 leaving the declaration against 32 witnessed, and
named the guard in between — `two-distinct-objects-stay-two`, reddened by `E-23` with nothing aimed
at it. Both counts are published here again, per guard, for the same reason: a slice reporting only
the instrument's number would be true of the instrument and false of the work.

### How this slice is unrepresentative, stated before it is measured

- **Three files are three subjects.** It is ADR-0199's rule again, and it bites less hard than it did
  on ADR-0209: 20 guards over three files rather than 34 over one. Three is not fourteen.
- **Small.** Twenty guards is the smallest of the four slices this repository has taken, so the
  fraction it produces is the coarsest of the four.
- **Upwards, if a file turns out to be a family that is not one over a contract.** The inverted
  clause tests for a contract slug and for nothing else, so a guard parameterised over anything but a
  contract reads as standalone here. That is the one way this slice could carry a table without
  saying so, and it is the mirror of the bias ADR-0209 walked into.

## Decision Outcome

To be measured against the definition at `68e466a` and the rule above, in the commits that follow.

## Consequences

To be measured.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A third slice reopens whichever end of the bracket it lands nearest.** The two clauses are
independent, so the readings not taken are the two the rule refuses: standalone guards in a partly
probed file, and parameterised guards in one.

**A guard witnessed by a cell that fails A2 reopens the definition**, which is ADR-0209's own
reopening clause inherited whole: *aimed* is checked by reading, so the way it fails is a reader
disagreeing with an aim published here — which the per-guard co-red lists exist to make possible.

**A family over something other than a contract reopens the inverted clause.** The test is a suffix
against seven slugs, and it cannot see a table parameterised over anything else.

## More Information

The 228 were read from the attribution of ADR-0209's replay, on disk, by ADR-0200's stated rule: a
guard is *collected* when any attribution bucket of any column of the folder names it, and *unprobed*
when it never reddened and the battery accounts for it under a region whose nature is `claims
detection`. The join to a file is a control run of the folder's own suite, read out of the same JSON
report the instrument reads. The family count is that artefact asked whether each address ends in one
of the seven contract slugs, which is ADR-0209's own question.

Candidates are searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration — and reading the failed guards and the type-error line out of the report. That is
a search tool and never the measurement: every figure published here comes from a real battery run,
and because a pin is checked as a *subset*, co-red counts are read back off the battery's own
artefact rather than off the search.

Nothing is measured here.
