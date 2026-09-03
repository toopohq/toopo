---
status: accepted
date: 2026-09-03
governs:
  - mutation/registry-storage.battery.ts
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

To be measured against the definition above, in the commits that follow it.

## Consequences

To be measured.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A slice in a partly probed file reopens the rate.** The downward bias named above is the one this
slice was chosen to have, and the reading that would measure it is the same work over guards whose
file some cell already reaches.

**A guard witnessed by a cell that fails A2 reopens the definition.** *Aimed* is checked by reading,
so the way it fails is a reader disagreeing with an aim published here — which the per-cell co-red
lists exist to make possible.

**A second folder reopens the comparison with the sole witness**, exactly as ADR-0204 reopened
ADR-0203's two rates by taking the same reading somewhere else.

## More Information

The 262 were rebuilt from ADR-0200's own stated rule over the artefact of ADR-0204's replay on disk:
a guard is *collected* when any attribution bucket of any column of the folder names it, and
*unprobed* when it never reddened and the battery accounts for it under a region whose nature is
`claims detection`. The join to a file is a control run of the folder's own suite, read out of the
same JSON report the instrument reads.

Candidates are searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration — and reading the failed guards and the type-error line out of the report. That is
a search tool and never the measurement: every pin published here comes from a real battery run.
