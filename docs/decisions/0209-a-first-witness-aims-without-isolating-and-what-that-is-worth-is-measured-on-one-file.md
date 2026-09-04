---
status: accepted
date: 2026-09-03
governs:
  - mutation/registry-storage.battery.ts
  - CLAUDE.md
confirmed-by: []
---

# A first witness aims without isolating, and what that is worth is measured on one file nothing reaches

## Context and Problem Statement

CLAUDE.md's entry on a guard seen red **alone** carries two buckets and separates them in its own
words: *a guard that never reddens alone is not decorative — it would catch its defect if its
neighbour went away*. The never-alone bucket is therefore a debt about attribution. The never-red
bucket is decorative, by the word the instrument itself uses for it: `unprobedClaims`, *claims
detection, so decorative until a mutant reaches it*.

**262 of `packages/registry`'s 466 guards sit in that second bucket** — more than half of the suite,
a proportion ADR-0199 read and nobody had read before it. Every one of those declarations was
written deliberately; what none of them costs is known.

ADR-0203 and ADR-0204 priced the **sole** witness on two slices: 11 of 16 and 14 of 22 isolable, at
1.27 and 1.21 candidate runs per cell written, and 1.5 runs per guard of the population once the runs
that established a refusal are counted. **The first witness has never been priced at all.** Making a
guard red full stop demands no isolation, so it should be cheaper; how much cheaper decides whether
262 guards can leave the decorative bucket for less than isolating 166 would cost, which is the best
ratio available in anything left on that list.

## Decision Drivers

- **A cell must aim at one guard.** ADR-0203's rule, and it is relaxed here in exactly one respect
  and in no other: the cell need not isolate. So what *aiming* means has to be written down before
  the first cell exists — without it the 262 fall to a handful of coarse cells and nothing has been
  bought.
- **A guard is not rewritten to make a cell work.** ADR-0203. Fitting the question to the answer.
- **A declaration is retired because a cell witnesses it**, never because the count looked better.
  A guard that resists keeps its declaration and the record says why.
- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199.
- **One reading of a battery calibrates it no better than to about a sixth.** ADR-0200.

## What aiming means here, and how it is weaker than alone

**A cell aims at a guard when the defect it injects is the failure condition that guard's own
sentence names.** Two tests, both applied before the run rather than read off it:

- **A1 — the claim is falsified.** The guard states a claim; the defect must make that claim false,
  so that staying green would be the guard being *wrong*. Reaching a line the guard happens to
  execute is not that.
- **A2 — the guard is not a bystander.** What is broken cannot be described without naming the thing
  the guard is about. If the injected defect has a plain description in which the guard's own subject
  does not appear, its red is incidental and it has witnessed nothing.

And one discipline that keeps A1 and A2 from being a licence: **the defect is the narrowest one found
that satisfies them.** The search is the same search isolation runs. What a first witness does is
**stop it as soon as A1 and A2 hold**, instead of carrying on until nothing else reddens — and that,
rather than a different kind of work, is the whole of the saving. Naming it that way is what makes
the price comparable to the two slices before it.

**One cell aims at one guard, and a family is the one exception.** A defect may be the failure
condition several guards name — a rule refusing eleven kinds of value, one guard per kind — and then
it witnesses each of them, and the record says, per guard, which clause of the defect that guard's
sentence names. **Every other multiplicity is bystanders**: a cell reddening twenty guards of which
nineteen are consequences has witnessed one.

**Where it is weaker than alone, stated rather than implied.** *Alone* is a property of the run:
`failedGuards` holds one name, and the artefact proves the attribution with nobody reading anything.
*Aimed* is a property of the author's intention, checked by reading, and **the artefact cannot see
it** — a set of failed guards is a set. So a first witness is a claim a reader has to believe, where
a sole witness is a claim the instrument holds. That is the notch it is weaker by, and it is the
whole of what the cheapness costs.

What stands in for the artefact is that **every cell here publishes what reddened with it**. The
co-red count is a reader's own measure of how much belief an aim is asking for, and it is published
per guard rather than summarised, because a mean would hide exactly the cell this discipline exists
to refuse.

## The slice, and why it is this one

**`packages/registry/round-trip.test.ts`, all 34 of its guards.**

The rule, fixed before one of those guards was read: **every unprobed-claims guard of the wholly
unprobed test file that carries the most of them.**

The structure it was fixed against — a control run of this folder at `0f5da44`, 466 assertions, none
red, *Type Errors no errors*, 11.8 s, joined to the attribution of the replay on disk. The 262 sit in
fourteen of this folder's twenty-four test files, and **five of those files are wholly unprobed**:

| file | collected | unprobed | alone | never alone |
| --- | --- | --- | --- | --- |
| `against-the-catalogue.test.ts` | 69 | 52 | 9 | 0 |
| **`round-trip.test.ts`** | **34** | **34** | 0 | 0 |
| `response.test.ts` | 67 | 32 | 6 | 29 |
| **`coverage.test.ts`** | **28** | **28** | 0 | 0 |
| `snapshot.test.ts` | 60 | 27 | 0 | 33 |
| `determinism.test.ts` | 20 | 14 | 1 | 5 |
| `signature.test.ts` | 16 | 13 | 3 | 0 |
| **`endpoints.test.ts`** | **12** | **12** | 0 | 0 |
| `the-sixth-contract.test.ts` | 15 | 12 | 2 | 1 |
| `verifiability.test.ts` | 13 | 12 | 1 | 0 |
| **`visibility.test.ts`** | **12** | **12** | 0 | 0 |
| `implementations.test.ts` | 24 | 10 | 0 | 14 |
| **`attestation.test.ts`** | **3** | **3** | 0 | 0 |
| `publication.test.ts` | 9 | 1 | 1 | 6 |

Three reasons, and none of them is about how hard a guard looks:

1. **A wholly unprobed file is the population's condition at its purest.** No cell of this battery
   reddens anything in it, so no witness can arrive incidentally from a cell aimed at a neighbour.
   It is the strictest place there is to ask what a *first* witness costs.
2. **Total over the file**, so there is no selection inside it and no possibility of having taken the
   easy half of one.
3. **The most is a count and never a judgement**, and 34 is the largest single block of the 262 that
   satisfies the first reason — 13 % of the population.

**The rule is deliberately keyed to a property no declaration mentions.** The eight `claims detection`
regions of this battery carry reasons, and some of those reasons speak about reachability — *shown
reachable and not promoted*, *the reason is cost rather than doubt*. They are the declaration and
cannot be unread. So the slice is keyed to **which file a guard is collected in**, which no region
names, rather than to which region accounts for it.

### How it is not representative, stated before it is measured

- **One file is one subject.** Whatever this file is about, its 34 guards share it, so what is
  measured is a rate for that subject. It is ADR-0199's rule at its sharpest — *a bound extrapolated
  from one member of a population states the cost of that member* — and the 262 span fourteen files
  and eight declared regions.
- **Downwards.** 173 of the 262 sit in files some cell of this battery already reaches, where a first
  witness may arrive from a cell that already exists and cost nothing at all. This slice deliberately
  excludes every one of those.
- **Upwards.** If this file's guards turn out to be a family over one rule, one defect witnesses many
  of them, and the rate is then a fact about a family rather than about the population. The exception
  written into the definition above is exactly where that would arrive, which is why it is written
  before the file is read rather than after.

## Decision Outcome

**Thirty-two of the thirty-four are witnessed, by twenty-six cells, `E-01` to `E-26`.** Two are not,
and each carries the reason it resisted. The slice cost **33 candidate runs**, 310.2 s of machine
time, and **24 of the 26 cells landed on their first candidate**.

### What was witnessed, and what reddened with it

The co-red column is what a reader weighs the aim against, and it is published per cell for the
reason the definition gives: the artefact cannot see an aim, so the number of guards that came with
one is the only thing standing where the proof would be. Every figure below is read back off the
battery's own artefact and not off the search.

| cell | the defect it injects | reds |
| --- | --- | --- |
| `E-01` | a negative zero comes back an ordinary zero | 1 |
| `E-02` | a NaN comes back a zero | 3 |
| `E-03` | an infinity comes back the largest finite number | 1 |
| `E-04` | a negative infinity comes back the smallest | 1 |
| `E-05` | an undefined comes back a null | 3 |
| `E-06` | a field whose value came back undefined is dropped | 1 |
| `E-07` | a pattern is rebuilt without its flags | 1 |
| `E-08` | a Set comes back in the reverse of its own order | 1 |
| `E-09` | a hole is assigned rather than left | 2 |
| `E-10` | an undefined element is encoded as a hole | 1 |
| `E-11` | a big integer comes back a number | 1 |
| `E-12` | an instant is rebuilt at the whole second | 1 |
| `E-13` | an invalid date is written as the epoch | 1 |
| `E-14` | a Map comes back with each entry the other way round | 2 |
| `E-15` | a Map's key is rendered as text rather than encoded | 1 |
| `E-16` | an error is rebuilt with no message | 3 |
| `E-17` | every error is rebuilt as an `Error` | 1 |
| `E-18` | an error is rebuilt without its cause | 1 |
| `E-19` | a box comes back unboxed | 2 |
| `E-20` | a box's own field is taken for one its slot carries | 1 |
| `E-21` | every typed array is rebuilt as a `Float64Array` | 1 |
| `E-22` | a NaN element of a typed array is written as a zero | 1 |
| `E-23` | a record with no fields comes back as nothing | 2 |
| `E-24` | a field whose name looks like a number is read as an index | 1 |
| `E-25` | a record is rebuilt with its fields reversed | 9 |
| `E-26` | a shared value is given a new label every time it is met | 3 |

**Seventeen of the twenty-six redden alone**, and that is the finding rather than the intention.
Nothing here searched for isolation: the protocol was to write the defect that most directly
falsifies the guard's own sentence, run once, and stop. Two times in three that produced a sole
witness for the price of a first one.

**What that says about the two prices is sharper than the rate below.** ADR-0203 and ADR-0204 measured
isolation on the *residue* — guards that already redden and that every cell written so far had failed
to separate. This slice measured it on guards nothing had ever tried. So the expensive part of
isolation is not isolating; **it is isolating a guard that has already resisted every cell in the
battery**, and that is a property of the population rather than of the work.

### Aim where the bytes do not move, which is this folder's own version of ADR-0203's rule

**Every cell is on the decode side wherever a decode side exists**, and it is measured rather than
stylistic. `serialiseContract` calls `encode` and nothing but the round trip calls `decode`, so an
edit to the encoder moves the bytes every digest is taken over: the freeze, the served bytes, every
content-addressed answer and every search answer go with it. Two candidates measured it —
**40 reds** for a typed array's elements written as plain JSON numbers, **66 reds** for reading a
constructor off a prototype without checking for none. The same defects expressed on the way back
redden the round trip alone.

It is ADR-0203's *aim at a choice and never at a shared mechanism* with the shared mechanism named:
in this folder the shared mechanism is **the serialisation a digest is taken over**, and what tells a
reader in advance which side of it they are on is which of `encode` and `decode` the edit lands in.

Three cells are on the encode side and each says why: `E-10` and `E-13` are about how a value is
*read* rather than how it is written back, and `E-20` is about which of a box's keys are its own.
All three redden alone, because no record of this catalogue carries an undefined array element, a
date whose time is NaN, or a box with a field.

### What resisted, with what was looked for

**`a-value-json-cannot-hold-survives-the-wire-a-bare-object` — a pincer, measured from both sides.**
The round trip compares keys, kinds and classes and **never a prototype**: `classOf` answers `null`
both for `Object.prototype` and for none, so an object that lost its prototype comes back equal.
Measured, both directions green with nothing red at all — the encoder never emitting `'none'`, and
the decoder ignoring it. The one direction that does redden takes `object/deep-equal@1`'s whole
serialisation with it, that contract settling a case on such an object, and it reddened **66 guards**.
So the narrow direction is invisible and the visible direction is broad, and there is nothing between
them. **The row exists to check the very defect its own file records having had** — a null prototype
falling through to the record arm — and the comparison beside it cannot see that defect.

**`two-distinct-objects-stay-two` — a claim the language keeps rather than the code.** For two
distinct objects to come back as one, the encoder has to claim they are the same, and the only source
of identity here is a `Map` keyed by the object. No single edit makes that keying value-based without
changing the type. Two candidates measured green — labelling every value rather than only the shared
ones, and registering an unlabelled record in the shared table — and a third was refused before it was
run, because collapsing two objects needs the label threshold and the label itself to move together,
which is two edits and not a defect anybody makes.

**A third guard leaves the bucket with nothing aimed at it, and that is the trap made concrete.**
`two-distinct-objects-stay-two` reddens on `E-23`: two empty records both come back as `null`, so the
guard is false on that cell. **The instrument's own criterion for leaving `unprobedClaims` is
reddening and not aiming** — `wronglyDeclaredSilent` refuses a declaration any mutant contradicts —
so the guard must leave the region whatever this record thinks of it. It is counted as reddened and
not as witnessed, and the arithmetic below says so: **34 guards leave the declaration, 32 of them the
slice's own with a witness, one of the slice's without one, and one belonging to another file.**

That is the measurable form of what the definition was written to refuse. A slice reporting *33 of 34
probed* would be true of the instrument and false of the work.

### A third direction the slice is unrepresentative in, found rather than predicted

The record predicted two. There is a third, it is larger than either, and it is a property of the
**rule** rather than of the file: *the wholly unprobed file with the most guards* selects for a
parameterised table, and a table is written precisely so that each row has a guard of its own.

`round-trip.test.ts` says so in its own words — *removing a branch of the encoder reddens here first
and says which value it was*. **32 of its 34 guards are rows of an `it.each`**, and the file is
therefore designed for exactly the thing this unit was measuring the cost of. Nothing in the slice
rule saw that coming, and the correlation is not an accident: a file has many guards *because* it is
a table.

So the 94 % below is the fraction for a population designed to be witnessable, and the two predicted
biases are smaller than this one.

## What this prices, and the verdict on the 262

### The two prices, normalised on the thing that is actually bought

A rate per *cell* answers nothing here, because a sole witness can never be one cell for two guards —
ADR-0203's arithmetic, and it does not move. What is comparable is the cost per guard **taken out of
its bucket**:

| | `packages/site`, ADR-0203 | `packages/registry`, ADR-0204 | here |
| --- | --- | --- | --- |
| what a cell buys | a sole witness | a sole witness | a first witness |
| the slice | 16 reciprocal-pair guards | all 22 one-companion-away | all 34 of one unprobed file |
| candidate runs | 14, refusals not counted | **33** | **33** |
| guards witnessed | 11 of 16 = 69 % | 14 of 22 = **64 %** | 32 of 34 = **94 %** |
| runs per cell written | 1.27 | 1.21 | **1.27** |
| runs per guard witnessed | 1.27 | **2.36** | **1.03** |
| runs per refusal established | not spent | 2.0 | **2.5** |

**A first witness costs 2.3 times less per guard than a sole one**, against ADR-0204's accounting,
which is the only one of the two that counts the runs a refusal costs. **Take the family out and it
is still 1.9 times less** — 26 witnessed on 33 runs — so the factor is not the seven-for-one cell.

**And the runs-per-cell figure is identical to both**: 1.27 here, 1.27 and 1.21 there. So a first
witness is not a cheaper *search*. What it is cheaper at is landing: more of the slice gets a witness
at all, and one cell can serve a family, which isolation forbids by construction.

**The suite time was re-taken and it is lower than the table ADR-0203 built.** Over the 33 candidate
runs, `packages/registry`'s suite ran in **9.40 s** on average — 9.1 s at its fastest and 9.8 s at its
slowest — against the 14.9 s that record carried from ADR-0162's reading at `505fddb`. The figure is
published rather than folded into that table, for the reason ADR-0203 gave for not folding its own
re-reading in: one fresh row among six stale ones publishes a total taken at no commit at all.

### The count can be priced, and it does not come from this slice

**145 of the 262 are parameterised over a contract, in 21 families** — twenty of seven members and one
of five — and 117 stand alone. Measured off the same artefact the 262 come from, by asking of each
address whether it ends in one of the seven contract slugs.

So if a family collapses to one cell, as `a-record-survives-the-wire` did here, **the 262 are at most
138 aiming decisions and never 262**. That arithmetic is a property of the population, computable by
anybody at any commit, and it owes this slice nothing.

At the measured 1.27 runs per cell and 9.40 s per run, the search over all 262 is about **175 runs and
27 minutes**. The audit is one replay of one battery, as it was for ADR-0204, and the battery is what
grows: 138 more cells at this folder's own rate is about **25 minutes** added to every full replay and
to the gate before a publication.

**Whether a family really collapses is measured once and assumed twenty times, and that is the
weakest joint in the arithmetic.** `a-record-survives-the-wire` collapsed because one defect —
reversing a decoded record's field order — is the failure condition all seven name and no other row's
sentence names. Nothing says the other twenty families have such a defect available.

### The fraction cannot be priced, and the reason is the slice rule rather than the folder

94 % is the fraction for a file **designed** to be witnessable, and the slice rule is what walked into
it: *the file with the most guards* selects for a parameterised table, and a table exists so that each
row reddens on its own branch. That bias was not predicted, it is larger than the two that were, and
it points the same way as one of them.

So this record publishes **no** extrapolation of 94 % to the 262. What it publishes instead is the
reading that would correct it: **a slice over standalone guards** — the 117 that are not
parameterised, or the wholly unprobed file that carries the *fewest* — which is the same work under a
rule chosen to have the opposite bias. Until that is taken, the honest statement is that between 138
cells and 262 guards there is a fraction nobody has measured outside a table.

### And the judgement half stays refused, for a reason that has not changed

ADR-0204 closed by saying a third slice would not close the authoring cost, because **nothing in
either record measures authoring at all** — every figure in both is a count of runs. That is true of
this record too. The 33 runs are 310 seconds; the twenty-six cells are an afternoon, and nobody timed
it. A fourth slice would produce a fourth rate and still not that number.

## The census afterwards, and a column it retired for free

Read off this unit's own replay at `6888853`, `packages/registry` alone:

| | before, as ADR-0204's run left it | ADR-0204 corrected | here |
| --- | --- | --- | --- |
| collected | 466 | 466 | 466 |
| alone | 57 | **58** | **75** |
| never alone | 136 | **135** | **152** |
| never red | 273 | 273 | **239** |
| — of them `unprobedClaims` | 262 | 262 | **228** |
| — of them out of reach | 11 | 11 | 11 |

**The 34 that left the bucket went 17 to *alone* and 17 to *never alone*.** Nought unaccounted for,
nought wrongly declared silent.

**Eighteen guards became load-bearing and only seventeen of them are this unit's**, which is the free
finding. The eighteenth is `an-edge-is-followed-to-the-artefact-it-names`, and ADR-0204 records
exactly why it was not: `the-served-bytes-are-the-committed-bytes` crossed vitest's 5 000 ms default
under load and reddened on `I-38`, which has no causal path to it, so *a load flake un-isolated a
load-bearing guard*. On this run `I-38` reddens **one** guard and that guard is the edge one, while
`the-served-bytes-are-the-committed-bytes` is reddened by `I-65` and by nothing else — which is what
ADR-0148 says it should be.

**So ADR-0204's own reopening clause has fired, and the mechanism that fired it is ADR-0205's.** That
record wrote *a `testTimeout` for `packages/registry` retires the column entirely*; the bound was
declared at 60 060 ms and this is the first replay of the folder under it. The corrected column is now
the measured one, and the arithmetic says so twice: **58 + 17 = 75** and **135 + 17 = 152** from the
corrected reading, where the raw one needs 57 + 18 and 136 + 16 with the extra unit unexplained.

**And the reds no pin claimed are twelve, none of them this unit's.** `unclaimedRedsIn` names `I-14`,
`I-16`, `I-51`, `I-54`, `S-05`, `S-06`, `S-09`, `S-15`, `S-18`, `S-23`, `S-24` and `S-27` — every one
of them a cell that predates this unit, and every one of the twenty-six new cells at or below
ADR-0076's line naming all of its reds. It is the debt CLAUDE.md already carries, unmoved.

## Consequences

- **Twenty-six cells, `E-01` to `E-26`, in `mutation/registry-storage.battery.ts`**, a third series
  because their subject is `value.ts` and neither of the other two touches it. The battery goes from
  **118 to 144 cells** — 139 killed, 5 survivors, nothing disagreeing. **The runner prints no duration
  of its own**, so what is stated is a bound: 24 min 46 s separate the commit it measured from the
  artefact it wrote, and it was launched inside that.
- **Two suite names leave the suite-named declaration and are named guard by guard.** `the registry
  encoding` keeps one guard and `a sixth contract enters without a migration` keeps six. It is the
  battery's own recorded phenomenon firing for the third and fourth time — *a suite name is worth its
  brevity exactly until one mutant reaches into it, and there is no warning before that day*.
- **`packages/registry`'s `unprobedClaims` goes 262 to 228.**
  `a-value-json-cannot-hold-survives-the-wire-a-bare-object` stays, with the pincer written into its
  declaration rather than only here.
- **The README's three figures move and are derived rather than transcribed**: 879 defect cells to 905,
  837 caught to 863, survivors unmoved at 42.
- **`mutation/census.ts` is untouched.** No guard was added, so the folder still collects 466 guards
  over 24 files.
- **ADR-0200's, ADR-0203's and ADR-0204's censuses are not rewritten.** Each is stamped at its own
  commit and stays there; CLAUDE.md's entry carries the new figures with their own coordinate.
- **The battery's share of its gate grows**, which is the entry about a bound nobody compares with what
  a battery costs, arriving for the third unit in a row.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A slice over standalone guards reopens the fraction, and this record says in advance what it would
have to answer.** 94 % was measured on a file 32 of whose 34 guards are rows of an `it.each`, and the
rule that chose it selects for exactly that. The 117 of the 262 that are not parameterised are the
population with the opposite bias, and a slice there is the reading that would bound the fraction from
the other side.

**A family that does not collapse to one cell reopens the 138.** One of the twenty-one was measured and
twenty are assumed; a family whose members need a defect apiece takes the ceiling towards 262 by its own
size.

**A guard witnessed by a cell that fails A2 reopens the definition.** *Aimed* is checked by reading, so
the way it fails is a reader disagreeing with an aim published above — which the per-cell co-red counts
exist to make possible.

**A second folder reopens the comparison with the sole witness**, exactly as ADR-0204 reopened
ADR-0203's two rates by taking the same reading somewhere else. What it would have to move is the 1.9,
which is the factor with the family taken out.

**And a cell that reddens `a-value-json-cannot-hold-survives-the-wire-a-bare-object` alone retires the
pincer.** *No plausible mutant found* is a statement about a search in a stated direction, and the
direction here is named: both sides of the prototype, plus everything that takes `object/deep-equal@1`'s
serialisation with it.

## More Information

The 262 were rebuilt from ADR-0200's own stated rule over the artefact of ADR-0204's replay on disk:
a guard is *collected* when any attribution bucket of any column of the folder names it, and
*unprobed* when it never reddened and the battery accounts for it under a region whose nature is
`claims detection`. The join to a file is a control run of the folder's own suite, read out of the
same JSON report the instrument reads. The family count is that artefact asked whether each address
ends in one of the seven contract slugs.

Candidates were searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration — and reading the failed guards and the type-error line out of the report. All 33
report *Type Errors no errors* and 466 collected assertions, which is what says a candidate was
measured rather than refused by the compiler — the trap ADR-0204 found part way through its own
search. That is a search tool and never the measurement: **every figure published here comes from a
real battery run**, and because a pin is checked as a *subset*, the co-red counts and the seventeen
sole reds were read back off the battery's own artefact rather than off the search.

```sh
npx tsc -p tsconfig.json --noEmit     # exit 0
pnpm run anchors                      # 842 anchors across 106 files, exit 0
pnpm run registry                     # 466 passed
npm run battery -- registry-storage   # 144 cells, 0 disagreeing, exit 0
pnpm run meta                         # 11 files, 124 passed
pnpm run freeze                       # 3 passed - no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
0f5da44..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's own seven files
nor either of the two shared ones was touched, and the freeze is green beside that reading rather than
in place of it.
