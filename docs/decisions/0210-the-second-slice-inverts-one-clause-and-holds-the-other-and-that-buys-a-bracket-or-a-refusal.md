---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
  - CLAUDE.md
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

**Nineteen of the twenty are witnessed, by nineteen cells, `I-91` to `I-109`.** One is not, and it
carries the reason it resisted. The slice cost **23 candidate runs**, and **eighteen of the nineteen
cells landed on their first candidate**.

**The prediction is refuted, and that is the result.** The rule was written to bias downwards and the
reading came back at **19 of 20**, which is 95 % against ADR-0209's 94 %. The two do not bracket. They
meet.

### What was witnessed, and what reddened with it

The co-red column is what a reader weighs the aim against, and it is published per cell for the reason
ADR-0209's definition gives: the artefact cannot see an aim, so the number of guards that came with one
is the only thing standing where the proof would be. Every figure below is read back off the battery's
own artefact and not off the search.

| cell | the defect it injects | reds |
| --- | --- | --- |
| `I-91` | an attestation is accepted for any subject the length of a digest | 1 |
| `I-92` | a bundle's digest is checked for presence rather than for shape | 1 |
| `I-93` | the published limit of a signature drops the third of its three claims | 2 |
| `I-94` | an endpoint claims to answer a need nobody declared | 1 |
| `I-95` | a need only one endpoint answers stops being answered | 1 |
| `I-96` | a need is identified by a camel-cased name | 2 |
| `I-97` | a fifth need declares that something other than the API answers it | 2 |
| `I-98` | an entry of the indicative list became an endpoint that does not exist | 1 |
| `I-99` | the declared list of endpoints no entry anticipated loses one | 1 |
| `I-100` | an entry that held also became a content-addressed endpoint | 1 |
| `I-101` | a second entry of the indicative list is refused | 1 |
| `I-102` | an entry carries a verdict and no reason | 1 |
| `I-103` | a content-addressed answer is revalidated | 2 |
| `I-104` | a named answer is fresh for a minute | 2 |
| `I-105` | the snapshot endpoint is addressed by name | 2 |
| `I-106` | the sample values are declared private and served anyway | 8 |
| `I-107` | a field nothing fills carries a blank justification | 1 |
| `I-108` | a field nothing fills stops being one of those that were argued for | 2 |
| `I-109` | a second field defers its stratum to the declaration | 1 |

**Eleven of the nineteen redden alone**, against ADR-0209's seventeen of twenty-six — 58 % against
65 %, and neither slice searched for isolation. The protocol was that record's: write the defect that
most directly falsifies the guard's own sentence, run once, and stop.

### A2 was applied twice against a red, which is what the definition is for

**Two candidates reddened the guard they were aimed at and were thrown away anyway**, and both are
worth reading, because a slice that kept them would have reported 20 of 20.

**`the-unfilled-fields-are-the-ones-that-were-argued-for`.** The first candidate renamed a classified
path to one the schema does not carry. It reddened the guard — and it reddened
`needs-no-field-the-schema-does-not-have`, which is the *nearer* description of that edit: what was
broken can be said in full as *a classification names a field that does not exist*, and the aimed
guard's subject does not appear in that sentence. A2 failing on a red is invisible to everything but
reading. `I-108` takes the justification off the field instead.

**`the-strata-are-populated`.** The candidate that reddens it is the one aimed at its neighbour, and
the record below is what it turned into.

### What resisted, with what was looked for

**`the-strata-are-populated` — a claim about a set another guard pins member by member.** It asks that
every one of the five verification strata be held by some field of the seven. To falsify it a stratum
has to become unheld, and **only one stratum is held by a single declaration**: `stated-per-declaration`,
carried by `ownDeclarations[].value` and by nothing else. So the only single edit that reaches this
guard is the edit to that field — and the plainest description of it is *the one field that defers its
stratum stops deferring*, in which this guard's own subject does not appear. That is A2 failing, and it
is the cell `I-109` is aimed at from the other side.

**Measured rather than argued, from both sides of the other candidate.** `one-directional` is the only
other stratum with few holders, and it has two: `benchmarks.profiles[].name` in the field map, and
`outputAlphabet` in `string/slugify@1`'s own declarations. Emptying either alone leaves the guard
**green** — one of the two runs reddening `the-methodology-answer-carries-every-field-of-a-record`
instead and the other reddening nothing at all. Two edits would reach it, and ADR-0209 refused a
two-edit defect for the reason that holds here: it is not a defect anybody makes.

**It is a third mechanism and it belongs beside the two ADR-0209 found.** That record's two resisters
were a pincer whose narrow direction is invisible and whose visible direction is broad, and a claim the
language keeps rather than the code. This one is neither: the defect exists, it is one edit, and it is
*spoken for* by a neighbouring guard. **What the three have in common is not what the slice rules
separate them by** — it is the absence of a single edit whose plainest description is this guard's own
claim.

### The two counts, and the gap between them

**Twenty-seven guards leave `unprobedClaims` and nineteen are witnessed.** The instrument's criterion
for leaving is reddening and not aiming — `wronglyDeclaredSilent` refuses a declaration any mutant
contradicts — so the two numbers are two different facts and the slice publishes both.

The eight beside the slice are of two kinds and the distinction is the whole point:

- **Seven are a family.** `no-private-field-reaches-a-snapshot-answer-%s` is one written guard over
  seven contracts, and `I-106`'s defect is the failure condition each of the seven names as surely as
  it is of `no-private-field-is-served`. They are witnessed and they are not the slice's, so they enter
  neither count's numerator.
- **One is a bystander.** `the-methodology-answer-carries-both-columns-and-the-seeding-policy` reddens
  on `I-93` because the sentence it renders lost a claim; the defect is describable in full without
  naming which columns that answer carries.

**`packages/registry`'s `unprobedClaims` goes 228 to 201.**

### The verdict on the fraction, which is the whole of what this unit was for

**The bracket cannot be built, and the reason is a result rather than a failure of the method.** An
interval needs two readings that differ. The two rules were chosen to differ on exactly one clause,
parameterisation; the readings came back at 94 % and 95 %; **so parameterisation is refuted as the
factor**, and two readings that agree bound nothing.

The difference is smaller than one guard of either slice, and the record says so rather than reporting
a rank: one more resister here would read 18 of 20, which is 90 %, and one fewer there would read 33 of
34, which is 97 %. **A one-point gap between fractions with denominators of 20 and 34 separates
nothing.**

**What is publishable is a count over a population, and never a mean of two fractions.** The two slices
share the clause both rules held, and their union is a real measured population:

> **51 of 54 — 94 % — is the first-witness rate for a guard of `packages/registry` sitting in a wholly
> unprobed test file, whether or not it is a row of a family.**

That is 32 + 19 witnessed of 34 + 20 taken. It is not an average and it is not an extrapolation; it is
the count over every guard either slice touched.

**What stays unmeasured is the clause the two slices held in common, and no third slice of this shape
can reach it.** 174 of the 228 sit in files some cell of this battery already reddens, and both slices
excluded every one of them by construction — that exclusion being what made the two rates comparable.
Two directions are arguable there and nothing measured says which wins. A witness may arrive free from
a cell that already exists, which biases up. And a guard still silent in a probed file has already
survived every cell aimed at its neighbours, which is ADR-0209's own central finding — *the expensive
part of isolation is isolating a guard that has already resisted every cell in the battery* —
transposed to first witnesses, and it biases down.

**So the answer to the question this record opened with is neither of the two it offered.** It is not a
bracket, because the readings agree. It is not ADR-0204's refusal either, which was that *nothing in
either record measures authoring at all* — here the method produced a number, over a population it
states, and named exactly what that population excludes.

### The price, beside the three already published

| | `packages/site`, ADR-0203 | `packages/registry`, ADR-0204 | ADR-0209 | here |
| --- | --- | --- | --- | --- |
| what a cell buys | a sole witness | a sole witness | a first witness | a first witness |
| the slice | 16 reciprocal-pair guards | all 22 one-companion-away | all 34 of one unprobed file | all 20 standalone in wholly unprobed files |
| candidate runs | 14, refusals not counted | 33 | 33 | **23** |
| guards witnessed | 11 of 16 = 69 % | 14 of 22 = 64 % | 32 of 34 = 94 % | **19 of 20 = 95 %** |
| runs per cell written | 1.27 | 1.21 | 1.27 | **1.21** |
| runs per guard witnessed | 1.27 | 2.36 | 1.03 | **1.21** |
| runs per refusal established | not spent | 2.0 | 2.5 | **3.0** |

**ADR-0209's reopening clause named the figure a second folder would have to move, and this slice
does not move it.** That record priced the first witness at 1.9 times less per guard than the sole one
with its family taken out — 26 witnessed on 33 runs, which is 1.27 against ADR-0204's 2.36. **This
slice has no family inside it at all**, its one family being the seven that left beside it, so its
1.21 is the family-free figure by construction: **1.95 times less**, against a prediction of 1.9 made
on another file.

**And the runs-per-cell figure is identical to all three before it** — 1.21 here, 1.27, 1.21 and 1.27
there. A first witness is still not a cheaper search; it is a cheaper landing, and the fourth reading
says so as plainly as the third.

**The refusal is the dearest row and it is one refusal.** Three runs to establish that
`the-strata-are-populated` has no aimable defect, against ADR-0204's 2.0 and ADR-0209's 2.5 — and the
figure is over a single instance, so it states the cost of that instance and nothing more.

## Consequences

- **Nineteen cells, `I-91` to `I-109`, in `mutation/registry-storage.battery.ts`**, and they stay in
  the `I` series rather than opening a fourth. ADR-0209 opened `E` because its cells shared a subject
  neither of the other two touched; that test fails here, `I` already injecting into `endpoints.ts` and
  into `response.ts`. **A series born on a weaker test than the one that created the last one is a
  convention drifting.** The battery goes from **144 to 163 cells**.
- **`packages/registry`'s `unprobedClaims` goes 228 to 201**, and `the-strata-are-populated` stays,
  with the mechanism written into its declaration rather than only here.
- **`the public/private frontier` leaves the suite-named declaration and is named guard by guard**,
  which is this battery's own recorded phenomenon firing for the fifth time — *a suite name is worth
  its brevity exactly until one mutant reaches into it, and there is no warning before that day*. The
  eight left silent are the seven of `every-served-field-is-classified` and the guard that resisted.
- **A declaration this battery carried is falsified and replaced rather than deleted.** It read *the
  private-field guards cannot redden until a private field exists: not one field of a contract record
  is private today*. That is true of the catalogue and false of this folder, because `field-map.ts` is
  a source of it — a field the projection serves, declared private, is one edit — and `I-106` is what
  says so. It is the first cell in this repository to exercise the private half of that frontier at
  all.
- **The README's three figures move and are derived rather than transcribed**: 905 defect cells to
  924, 863 caught to 882, survivors unmoved at 42.
- **`mutation/census.ts` is untouched.** No guard was added, so the folder still collects 466 guards
  over 24 files.
- **ADR-0200's, ADR-0203's, ADR-0204's and ADR-0209's censuses are not rewritten.** Each is stamped at
  its own commit and stays there; CLAUDE.md's entry carries the new figures with their own coordinate.
- **The battery's share of its gate grows again**, which is the entry about a bound nobody compares
  with what a battery costs, arriving for the fourth unit in a row.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense for
that reason.

**A slice in a partly probed file reopens the fraction, and it is the only reading that can.** The 174
guards of the 228 that sit in files some cell already reddens are what both slices excluded by
construction, and the exclusion is the clause that made them comparable — so no rule of this shape
reaches them. The record names the two directions that population could go in and refuses to guess
between them.

**A resister found by a mechanism already named reopens nothing; a fourth mechanism reopens the
reading of what resists.** Three are now recorded across two slices — a pincer with nothing between its
two directions, a claim the language keeps, and a claim spoken for by a neighbouring guard — and the
sentence they are read into is that none of them is about being or not being a row of a family.

**A guard witnessed by a cell that fails A2 reopens the definition**, which is ADR-0209's clause
inherited whole. This unit threw two reds away on exactly that test, so the way it fails is a reader
disagreeing with an aim published above, and the per-cell co-red counts exist to make that possible.

**A second folder reopens the 1.95.** ADR-0209 predicted 1.9 for the factor with its family removed and
this slice measured 1.95 with no family in it; a third reading somewhere else is what would move it,
exactly as ADR-0204 reopened ADR-0203's two rates by taking the same reading elsewhere.

**And a cell that reddens `the-strata-are-populated` while its plainest description names that guard
retires the refusal.** *No aimable defect found* is a statement about a search in a stated direction,
and the direction here is named: every stratum but one is held twice over, and the one that is not is
spoken for by `the-fields-that-defer-their-stratum`.

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

**All 23 report *Type Errors no errors* and 466 collected assertions**, which is what says a candidate
was measured rather than refused by the compiler. **The search cost 11.3 s a run** — wall clock with
the spawn in it, over three runs timed at `709798c` — so 23 runs are about **260 s of machine time**.
It is not comparable with ADR-0209's 9.40 s, which is the duration vitest reports for the suite alone,
and it is published as what it is rather than folded into that record's figure.

**The replay is the measurement and it was taken after the cells were committed.** At `709798c`:
163 cells, **158 killed and 5 survivors** — `I-01`, `I-08`, `S-11`, `S-12`, `S-14`, the same five —
nothing disagreeing, **nought unaccounted for and nought wrongly declared silent**, exit 0. The runner
prints no duration of its own, so what is stated is a bound: **28 min 46 s** separate the two clock
readings the replay was launched between.

**And the reds no pin claimed are twelve, none of them this unit's.** `unclaimedRedsIn` names `I-14`,
`I-16`, `I-51`, `I-54`, `S-05`, `S-06`, `S-09`, `S-15`, `S-18`, `S-23`, `S-24` and `S-27` — exactly the
twelve ADR-0209 read, unmoved, and every one of the nineteen new cells naming all of its reds.

```sh
npx tsc -p tsconfig.json --noEmit     # exit 0
pnpm run anchors                      # 861 anchors across 109 files, exit 0
pnpm run registry                     # 24 files, 466 passed
pnpm run battery registry-storage     # 163 cells, 158/163, 0 disagreeing, exit 0
pnpm run meta                         # 11 files
pnpm run freeze                       # 3 passed - no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
9ae6d8d..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's own seven files
nor either of the two shared ones was touched, and the freeze is green beside that reading rather than
in place of it.
