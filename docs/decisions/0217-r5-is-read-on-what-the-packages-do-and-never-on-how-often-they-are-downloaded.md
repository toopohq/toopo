---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# R5 is read on what the packages do and never on how often they are downloaded

> **This record is committed in two halves and the order is the evidence.** *The method, declared
> before the first probe* and the prediction closing it were written and committed before any package
> was installed or read; everything else was added afterwards. That section is byte-identical between
> the method commit and the commit that landed the findings, heading to the last line of the
> prediction, and the check is a `cmp` rather than a claim. What moved afterwards is named so the claim
> is not read as wider than it is — *What the reading returned* onwards, *What would reopen this*, the
> coordinates, and this note, which cannot describe a commit it precedes.

## Context and Problem Statement

[ADR-0216](0216-the-residue-is-three-decisions-and-the-language-answers-one-of-them-two-ways.md)
withdrew R10 from the twenty-four operations
[ADR-0215](0215-the-fourth-search-is-conducted-on-the-surface-that-arrived-after-the-third.md) had
refused, read the other twelve grounds one at a time, and found that none fires cleanly — **with one
exception it declared rather than waved past**: *R5 — no ecosystem to disagree. This record cannot rule
it out.* Whether any package answers this question differently from Temporal was not measured.

**A ground named and not measured is the weakest thing either record carries.** It is binary, it
decides whether the candidate is alive at all, and choosing between the three shapes ADR-0216 names
before knowing it would be settling the form of something that may not exist. So it is paid here.

**And it has a rule that decides how it may be paid.**
[ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) settles that a
demand signal may decide what is **measured** and never what is **refused**. An install count says
nothing about whether anybody disagrees; it says where an ecosystem is busy. **R5 asks whether the
packages that do this job agree**, and only reading what they do can answer it.

## Decision Drivers

* **A ground declared unmeasurable and then left is worse than a ground nobody thought of.** ADR-0216
  published R5 as the one thing that could still overturn its verdict. Leaving it there while choosing
  a contract's shape would be building on the half that was never read.
* **The population is where this measurement can be bent, so it is declared first.** A population of
  *packages that wrap Temporal* would be near-empty because Temporal is months old, and R5 would fire
  on the proposal's age rather than on the question's contestedness. That is the bias, it is named, and
  the population below is chosen against it.
* **What a package does is not what its README says.** Every reading here is a call executed against an
  installed package, not a documented claim.
* **A negative is a result, and a fourth negative after three would be the most informative of them.**
  It would say the bar refuses even where the language is measurably wrong, which is a fact about this
  catalogue's own criterion rather than about Temporal.

## Considered Options

* **Read only packages that wrap Temporal** — biased toward R5 firing, on the proposal's age
* **Read every library that does this job, whatever duration type it carries** — the question predates
  Temporal
* **Rank by installs and read the top of the list** — refused by ADR-0191 for the verdict, permitted
  for the enumeration
* **Leave R5 declared and choose a shape anyway** — refused by the driver above

## Decision Outcome

**Chosen: the population is every library that does this job, read by execution, with no figure in the
verdict.**

### The method, declared before the first probe

#### The population, and why it is the wide one

**The job is: take a duration expressed as an object of named units, and apply it to a date-like
value.** That is what the candidate would do and it is what Temporal's twenty-four retained operations
do. It is older than Temporal, so the packages that answer it are not only the ones that wrap Temporal.

**Two readings are taken and the wide one decides.** The narrow reading — packages depending on a
Temporal polyfill — is reported because it is what a Temporal-typed contract's own neighbourhood looks
like; it is not what R5 asks. R5 asks whether the packages doing this job agree, on
`string/strip-ansi`'s pattern, where the refusal was that everybody who does the job does it the same
way.

**A polyfill cannot disagree and is excluded by construction.** `temporal-polyfill` and
`@js-temporal/polyfill` implement the specification, so their answer is Temporal's answer by
definition, and counting them as agreement would be counting the specification twice.

#### How the population is enumerated

**By capability search on the npm registry, and by dependents of the two polyfills.** A search ranking
is influenced by popularity, and using it to *find* a package is exactly what ADR-0191 permits — *a
demand signal decides what is measured*. **No figure reaches the verdict**, and no refusal or retention
below quotes one.

**The enumeration is the assistant's judgement and is published as such**, on ADR-0192's treatment of
its own partition: a reader may add a package and re-run the reading.

#### What is read, and what counts as disagreement

Each package is installed and **executed**. Two calls, chosen because they are the two decisions
ADR-0216 measured the language answering inconsistently:

1. **An unknown key beside a valid one** — the singular-for-plural slip, or a typo.
2. **A known unit the target cannot apply** — a date unit given to a time-of-day, or a time unit given
   to a year-month.

**A package disagrees when its answer to either differs from Temporal's**, which is to ignore silently.
Rejecting, throwing, returning an invalid value, or reporting a reason all count as disagreement;
answering as Temporal answers counts as agreement.

**A package with no object-shaped duration API is reported and excluded**, because it does not do the
job — it cannot agree or disagree about a question it does not take.

#### R5's own condition, written before the answer is known

**R5 fires — and the candidate dies — only if every package that does this job answers as Temporal
does.** One package that rejects what Temporal swallows is enough for the question to be contested, and
R5 does not fire.

**That is a low bar and it is deliberately low**, because R5's own precedent is low: `string/strip-ansi`
was refused because *everybody* agrees, not because most do.

#### The prediction, written before the first probe

**I predict R5 does not fire**, and that at least one library rejects an unknown unit where Temporal
ignores it — most likely `luxon`, whose duration handling carries an explicit notion of an invalid
duration, where `date-fns` I expect to ignore unknown keys as Temporal does.

**Three outcomes are named so that none can afterwards read as a rescue:**

1. **At least one disagreement** — R5 does not fire, the candidate is alive, and P4 is then taken
   against `object/deep-equal@1`'s precedent. Most likely.
2. **No disagreement anywhere** — R5 fires, the candidate dies, and this is the fourth negative. It
   would be the most informative of the four.
3. **The question is not the same question** — the libraries take a unit as a string rather than an
   object, so they cannot express the malformed bag at all, and the population is thinner than the
   search suggests. I hold this possible for `dayjs`, whose API is `add(1, 'day')`.

**I may be wrong about the direction as well as the detail.** ADR-0215 predicted R2 would do the killing
and it was 15 of 142, so a prediction from this searcher about which mechanism decides has been wrong
once already in this sequence.

## What the reading returned

*Written after the probe.*

## What would reopen this

*Written after the probe.*

## More Information

### Where the probes live

*Written after the probe.*

### Why `confirmed-by` is empty

For ADR-0215's reason, unchanged: nothing here reads a record's reasoning, and a search's conclusion is
prose about a population outside this repository. Declared rather than left blank, on ADR-0186's rule
for the neighbouring field.
