---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
confirmed-by: []
---

# The third slice takes the clause both the others held, and reads the mechanism inside itself

## Context and Problem Statement

ADR-0209 and ADR-0210 priced the first witness on two slices and published one count between them:
**51 of 54, 94 %, for a guard of `packages/registry` sitting in a wholly unprobed test file**. Both
records refused to say anything about the rest, and they refused it for the same reason, written in
both: *a wholly unprobed test file* is the clause both rules held, and holding it is what made the
two rates comparable.

**That clause is most of the population.** Of the 201 guards this folder still declares under
`unprobedClaims`, **173 sit in files some cell of this battery already reddens** and 28 do not. So
the published 94 % speaks for a seventh of what is left, and nothing measured says whether it speaks
for the other six.

ADR-0210 named the two directions that population could go in and refused to guess between them. **A
witness may arrive free from a cell that already exists**, which biases up. And **a guard still
silent in a probed file has already survived every cell aimed at its neighbours** — ADR-0209's own
central finding about isolation, *the expensive part of isolation is isolating a guard that has
already resisted every cell in the battery*, transposed to first witnesses — which biases down.

This is the reading that decides it, and it is not a reading this unit invented. ADR-0210's own
reopening section names it in as many words: *the two clauses are independent, so the readings not
taken are the two the rule refuses: **standalone guards in a partly probed file**, and parameterised
guards in one.* This is the first of those two.

## Decision Drivers

- **The definition does not move.** A1, A2 and the narrowest-defect discipline are committed at
  `68e466a` and are the same three sentences the two slices before this one were measured under. A
  third unit that relaxed them would make its own number and measure nothing.
- **A first witness is a cell of its own, aimed at one guard.** It is never an existing cell widened
  until it reaches one more. This is the trap peculiar to *this* population and it is written out
  below, because here the injection site is already there and the widening is within reach.
- **A guard is not rewritten to make a cell work.** ADR-0203.
- **A declaration is retired because a cell witnesses it**, never because the count looked better. A
  guard that resists keeps its declaration and the record says why.
- **The two counts are published apart** — what leaves `unprobedClaims`, and what a cell witnessed.
  ADR-0209 published them apart and ADR-0210 measured a gap of eight; the gap is what makes the rate
  believable rather than convenient, and this population is the one where it should be widest.
- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199.
- **One reading of a battery calibrates it no better than to about a sixth.** ADR-0200.

## The rule, fixed before a guard of the slice was read

**Every unprobed-claims guard of `packages/registry` that is not parameterised over a contract — the
address does not end in one of the seven contract slugs, which is ADR-0209's own test — and is
collected in a test file some cell of this battery already reddens.**

That is ADR-0210's rule with exactly one clause inverted and the other held, which is the shape both
earlier rules were fixed in. It is **70 guards over eleven files**.

| file | slice | file's unprobed | reddened / collected |
| --- | --- | --- | --- |
| `determinism.test.ts` | 14 | 14 | 6 / 20 |
| `signature.test.ts` | 13 | 13 | 3 / 16 |
| `the-sixth-contract.test.ts` | 11 | 11 | 4 / 15 |
| `verifiability.test.ts` | 11 | 11 | 2 / 13 |
| `response.test.ts` | 6 | 25 | 42 / 67 |
| `snapshot.test.ts` | 6 | 27 | 33 / 60 |
| `against-the-catalogue.test.ts` | 3 | 52 | 9 / 69 |
| `implementations.test.ts` | 3 | 10 | 14 / 24 |
| `publication.test.ts` | 1 | 1 | 7 / 9 |
| `round-trip.test.ts` | 1 | 1 | 33 / 34 |
| `visibility.test.ts` | 1 | 8 | 4 / 12 |

### The structure the rule was fixed against, and nothing else

A control run of this folder at `6d03933` — **466 collected assertions, none red, *Type Errors no
errors*, 10.15 s** — joined to the attribution of ADR-0210's replay on disk, which is the 163-cell
artefact taken at `709798c`. Nothing between those two commits touches `packages/registry` or the
battery: `6d03933` moves `CLAUDE.md` and one record.

The join is total in both directions. All 201 declared-unprobed addresses are carried by the report,
and all 466 the report carries fall in exactly one bucket — 86 load-bearing, 168 never alone, 11 out
of reach, 201 unprobed claims, **nought unaccounted for and nought wrongly declared silent**.

**A guard is joined to a file by the address rather than by the whole title**, and that is not
cosmetic. ADR-0019 makes a guard's title its address, then ` :: `, then a sentence, and this folder
writes both forms — `round-trip.test.ts` writes the address alone. Joining on the whole title loses
27 of the 201 in silence, which is what the first attempt did.

The 201 decompose two ways, and the two decompositions are what the rule cuts on:

- **70 standalone and 131 parameterised** over a contract.
- **173 in partly probed files and 28 in one wholly unprobed file**, which is `coverage.test.ts`.

### The inverted clause selects nothing extra, and that is the second slice's doing

**There are no standalone unprobed-claims guards left in a wholly unprobed file.** `coverage.test.ts`
is the only wholly unprobed file this folder still has and all 28 of its unprobed guards are
parameterised over a contract. So the inverted clause excludes nothing the held clause did not
already exclude, and the slice is **total over the standalone population as it stands**.

That is a property of ADR-0210 rather than of this rule: that slice took all 20 standalone guards
there were in wholly unprobed files, so the set it drew from is empty behind it. It has a consequence
worth stating, because it is what the two units publish together rather than separately:

> **The union of ADR-0210's slice and this one is every standalone unprobed-claims guard this folder
> has ever declared — 20 + 70 = 90**, which is the 90 that record counted at the 228 state.

So the comparison between the two readings is exact. Same rule, disjoint populations, one clause
apart, and their union is a whole population rather than a sample of one.

### A figure of ADR-0210 does not reproduce, and it is noted rather than rewritten

That record publishes **174 of the 228** for the population both slices excluded. Its own rule
commit, `e91dd13`, publishes **173** for the same population. They cannot both be right.

Measured. The 228 state is rebuilt from the artefact on disk — ADR-0210's nineteen cells are `I-91`
to `I-109`, so a guard was silent at 228 exactly when every cell reddening it today is one of those
nineteen, and nothing else moved. The rebuild answers **228, of which 55 in wholly unprobed files and
173 in partly probed ones**, and it names those four files as `coverage.test.ts` 28,
`visibility.test.ts` 12, `attestation.test.ts` 3, `endpoints.test.ts` 12 — which is ADR-0210's own
description of its slice, from the other side. Re-read at the 262 state off the pre-slice artefact,
the same figure is **173**; re-read at 201 today it is **173** again.

**So it is 173 at every coordinate this population has had, the commit message carries the right
figure and the record carries the wrong one.** ADR-0210 is stamped, so this is a note against it and
never an edit of it: what changes is that a reader arriving at that line meets the correction here.

The three readings agreeing is what makes it a transcription slip rather than a fourth state. It has
not moved because the two effects that could move it cancelled exactly: ADR-0210's cells reddened
eight guards in partly probed files as bystanders, and the four files its slice emptied moved eight
guards the other way when they became partly probed.

### The trap peculiar to this population, and how it is refused

**The injection site is already there.** Every file in this slice has cells aimed into it — from 2
into `verifiability.test.ts` to 42 into `response.test.ts` — so the cheapest way to redden a silent
guard is to widen a neighbouring cell until it catches one more. **A widened cell has stopped
aiming**, which is ADR-0206's finding about battery surfaces one notch finer: there, a battery
widened until it could reach a guard goes green having changed subject; here, a cell does.

So a first witness is a cell of its own, aimed at that guard, and the count is over cells written
rather than over guards a cell happens to touch.

**And one form of the up-bias is refused by construction rather than by discipline.**
`unprobedClaims` is derived, not declared: `attributeColumn` computes it as the guards a
claims-detection region names **that no cell of this battery reddened**. A guard reddened by any
existing cell is therefore not in the population at all — it is in `loadBearing`, in `neverAlone`, or
in `wronglyDeclaredSilent`, and that last bucket is **nought** today. So *a witness arrives free from
a cell that already exists* cannot raise this rate, because a guard it would be true of is not one of
the 70.

What survives of the up-bias is two things, and neither of them is the rate:

- **The price.** The site is known, so the search for a candidate should be shorter.
- **The gap between the two counts.** A cell written into a well-trodden module reddens bystanders,
  and each one leaves `unprobedClaims` without being witnessed. ADR-0210 measured that gap at eight
  over nineteen witnessed in files nothing had ever touched; here it should be wider.

### Which way it biases, written before the result is known

**The bias is downwards, and it is the effect under test rather than a distortion of it.** That is
the distinction ADR-0210 did not have to make: its bias was a property of its rule, and here the
clause being inverted *is* the mechanism the unit exists to measure. So the honest question is a
different one — is the *standalone* subset unrepresentative of the 173 it is drawn from?

**It is, downwards, and the size of that has been measured rather than argued.** ADR-0210 declared
that a standalone guard is dearer than a table's row, because a table exists as one guard per branch
of a rule and a defect removing a branch reddens exactly one row by construction, where a standalone
guard carries no such correspondence. That record then measured the difference at **95 % against
94 %** — under a point, and in the direction opposite to the one declared. So the residual bias of
taking the standalone half is at most about a point and its sign is not established.

**The one thing this reading cannot see is whether that difference is itself different in probed
files**, and it is named here rather than discovered: the parameterised 103 are what a fourth slice
would take.

### The prediction, committed before the first candidate

**The rate comes back below 95 %.** The reasoning is the asymmetry above and nothing else: of the two
directions ADR-0210 named, the up-bias cannot enter the numerator at all, because the bucket is
derived from what reddened. So only the down-bias is in a position to move the rate, and the question
is whether it bites rather than which of two forces wins.

Three more, each falsifiable on its own:

- **The price falls, at or below 1.21 runs per cell written.** That is where the known injection site
  goes, and it is the only place it can go.
- **The gap between the two counts is wider than ADR-0210's eight over nineteen**, because a cell
  written into a trodden module reddens bystanders that a cell written into an untouched file does
  not.
- **Within the slice, the rate falls as the file's reddened share rises.** This is the sharpest thing
  the unit can produce and no earlier slice could produce it: every file in both earlier slices had a
  reddened share of zero, and this one runs from 3 of 16 to 33 of 34. If the mechanism is real it is
  visible here without any comparison to another record at all.

### The three outcomes, and each is a result

- **Below 90 %.** The mechanism bites. The 94 % is a corner, what is publishable over the two
  populations is two counts named apart and never one fraction, and ADR-0210's headline gets a note
  saying what it covers.
- **At or above 94 %.** The mechanism is refuted at the population it was named for, and the
  publishable count becomes one over both — 51 + *n* of 124 — covering the majority of what is left.
- **Between 90 % and 94 %.** Nothing is decided by a gap smaller than the one already separating the
  two readings taken, and it is published as a refusal to decide, exactly as ADR-0210 refused to
  bracket rather than reporting a mean.

### The forms of being wrong, named in advance

- **The rate holds.** The down-bias is refuted, and the argument that made the prediction — that only
  one of the two directions can reach the numerator — was true and irrelevant, because the direction
  that could reach it does not push.
- **The price does not fall.** Then *the injection site is known* was a claim about an author's
  convenience and not about the search, and the up-bias has no measurable effect anywhere, having
  already been refused the numerator.
- **The gap does not widen.** Then a trodden module does not produce more bystanders than an
  untouched one, and the two counts are further apart in the earlier slices for a reason nobody has.
- **The within-slice reading is flat.** Then whatever moves the rate is not *how much* a file has
  been probed, and a mechanism stated as a dose would have to be restated as a threshold or given up.
- **A fourth resistance mechanism appears, and it is about being in a probed file.** That would be
  the largest finding available here and it would say the two populations differ in kind rather than
  in rate — at which point no fraction over their union is publishable at all.

### How this slice is unrepresentative, stated before it is measured

- **Downwards, by at most about a point**, for taking the standalone half of its population. Measured
  by ADR-0210 at 95 against 94, sign not established.
- **Upwards, if a file turns out to be a family that is not one over a contract.** The clause tests
  for a contract slug and for nothing else, so a guard parameterised over anything else reads as
  standalone. ADR-0209 walked into the mirror of this, and `signature.test.ts`, `determinism.test.ts`
  and `verifiability.test.ts` carry 38 of the 70 between them without a slug among them.
- **Unrepresentative of the 173 in the shape of its files, in both directions at once.** Four files
  supply 49 of the 70 and are barely probed — 2 to 6 cells each — while the six most trodden supply
  17. A single rate over the seventy is therefore an average over a spread the unit can read, which
  is why the within-slice reading is published beside it and not instead of it.

## Decision Outcome

To be measured against the definition at `68e466a` and the rule above, in the commits that follow.

## Consequences

To be measured.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A fourth slice reopens the fraction, and there is exactly one left of this shape.** The two clauses
are independent and three of their four combinations are now read, so what remains is the
parameterised guards in a partly probed file — the 103, and `coverage.test.ts`'s 28 beside them as
the last wholly unprobed file there is.

**A guard witnessed by a cell that fails A2 reopens the definition**, which is ADR-0209's own
reopening clause inherited whole: *aimed* is checked by reading, so the way it fails is a reader
disagreeing with an aim published here — which the per-guard co-red lists exist to make possible.

**A family over something other than a contract reopens the clause that is held.** The test is a
suffix against seven slugs and it cannot see a table parameterised over anything else.

**And a cell that widens a neighbour rather than aiming reopens the count.** That is the trap this
population carries, it is refused above by a discipline rather than by a mechanism, and the anchors
of every cell written here are what a reader checks it against.

## More Information

The 201 were read from the attribution of ADR-0210's replay, on disk, by ADR-0200's stated rule: a
guard is *collected* when any attribution bucket of any column of the folder names it, and *unprobed*
when it never reddened and the battery accounts for it under a region whose nature is `claims
detection`. The join to a file is a control run of the folder's own suite, read out of the same JSON
report the instrument reads, on the address rather than the whole title. The family count is that
artefact asked whether each address ends in one of the seven contract slugs, which is ADR-0209's own
question.

Candidates are searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration, with no file filter, which is what that battery's `vitestConfig` means. That is a
search tool and never the measurement: every figure published here comes from a real battery run,
and because a pin is checked as a *subset*, co-red counts are read back off the battery's own
artefact rather than off the search.

Nothing is measured here.
