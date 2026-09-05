---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# R5 is read on what the packages do and never on how often they are downloaded

> **One term of the language-side sentence below falls, the sentence itself stands, and the reading it
> rests on has a limit that is now visible.**
> [ADR-0225](0225-one-rule-or-two-is-decided-by-whether-a-verdict-is-a-function-of-the-pair-the-sentence-names.md)
> measured each unit at several magnitudes: `PlainDate.add({hours: 24})` answers `2026-01-16`, so
> `PlainDate` **truncates rather than ignoring** and *`PlainYearMonth` and `Instant` refuse where
> `PlainDate` and `PlainTime` ignore* is one carrier short — only `PlainTime` ignores. **The conclusion
> is untouched**: on the second decision the language still contests itself, and the ecosystem still
> does not.
>
> **What this record measured is untouched, and what it did not measure is named rather than assumed.**
> R5 does not fire, `luxon` still refuses what Temporal swallows, and the ten packages were read as they
> were read. But the library rows were taken at **one magnitude** — `CalendarDate.add({ hours: 5 })`
> answering the input unchanged — which is the method that misread `PlainDate` for three records. Whether
> `@internationalized/date` also truncates at a whole day was not asked here and is not asked by
> ADR-0225 either, so *it answers the second question exactly as Temporal answers it* is established at
> the value read and at no other.

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

**R5 does not fire. `luxon` refuses what Temporal swallows, so the question is contested and the
candidate is alive.**

Ten packages were installed and executed at the versions below. **Not one figure below decides
anything**; the search that found them is a demand signal and it decided only what was measured.

### Q1 — an unknown key beside a valid one

| package | version | answer to `{ days: 1, dayz: 9 }` | |
| --- | --- | --- | --- |
| **`luxon`** | 3.7.2 | **`InvalidUnitError: Invalid unit dayz`** | **disagrees** |
| `date-fns` | 4.4.0 | `2026-01-16` — dropped in silence | agrees with Temporal |
| `moment` | 2.30.1 | `2026-01-16` — dropped in silence | agrees |
| `@internationalized/date` | 3.12.4 | `2026-01-16` — dropped in silence | agrees |
| `dayjs` | 1.11.23 | throws on a **well-formed** bag too | **no bag API — excluded** |
| `date-arithmetic` | 4.1.0 | throws on a **well-formed** bag too | **no bag API — excluded** |
| `@js-joda/core` | 6.1.0 | takes a typed `Period`, not a bag | **no bag API — excluded** |
| `temporal-zod` | 0.7.0 | validates ISO **strings**; refuses `{ days: 1 }` | **does not do the job — excluded** |
| `temporal-fun` | 0.2.0 | no add-like export at all | **does not do the job — excluded** |
| `temporal-utils` | 1.0.2 | `diff*`, `startOf*`, `roundTo*` only | **does not do the job — excluded** |

**Three exclusions are outcome 3 arriving as predicted**, and they are controlled rather than assumed:
`dayjs` and `date-arithmetic` were first read as refusals, and the control — the same call with a
**well-formed** bag — throws for them too, so what they refuse is the shape of the argument and not its
contents. Their API is `add(n, unit)`.

### Q2 — a known unit the target cannot apply

**The ecosystem agrees with Temporal here, and the closest structural analogue is what says so.**
`@internationalized/date` is the only library read that carries **partial types** the way Temporal
does — `CalendarDate`, `Time`, `CalendarDateTime`, `ZonedDateTime` — and it answers exactly as Temporal
answers: `new Time(12, 0).add({ days: 1 })` is `12:00:00` and `new CalendarDate(2026, 1, 15).add({
hours: 5 })` is `2026-01-15`, both the input unchanged.

**`@js-joda/core` gives a third answer by making the question unrepresentable**:
`LocalTime.prototype.plusDays` and `LocalDate.prototype.plusHours` are `undefined`, so there is no bag
and no inapplicable unit to ignore.

**So the disagreement is about the unknown key and not about the inapplicable unit**, which is narrower
than ADR-0216 could know and narrows what a contract would settle. On the second decision the language
still contests itself — `PlainYearMonth` and `Instant` refuse where `PlainDate` and `PlainTime` ignore
— but the ecosystem does not contest it.

### The narrow reading, reported because the method promised it

**It is empty, and not for the reason the bias was declared against.** None of the three
Temporal-wrapping packages was excluded for wrapping a young proposal: each was excluded because it
does not do this job. `temporal-zod` validates durations as **ISO 8601 strings** and refuses an object
bag outright, `temporal-fun` exports no addition, and `temporal-utils` exports differences, boundaries
and rounding. **That is a finding rather than an absence**: the packages built on Temporal so far take
durations as text.

### The condition, applied

R5 was declared to fire **only if every package that does this job answers as Temporal does**. Four do
the job. **One of the four disagrees.** R5 does not fire.

**The bar was declared low in advance and a reader may dispute the condition rather than the
measurement** — that is the honest place to push, and it is a different argument from *luxon is only
one package*, which the condition already answers.

### The prediction is scored

**Right on the direction and right on the package.** The method predicted R5 would not fire, named
`luxon` as the most likely dissenter for its explicit notion of an invalid duration, and predicted
`date-fns` would ignore unknown keys as Temporal does. All three hold. Outcome 3 was named as possible
for `dayjs` and is what `dayjs` and `date-arithmetic` both turned out to be.

**What the prediction did not reach** is that the two questions would separate: it treated Q1 and Q2 as
one ground and they are not.

## P4, re-taken on `object/deep-equal@1`'s precedent

**ADR-0216 set aside the polymorphic form because its case table would cross carrier types. That
objection is withdrawn, and the precedent that withdraws it is published and frozen.**

`object/deep-equal@1` carries **58 cases in 10 groups** whose subjects cross the whole language:
`a-bigint-is-not-its-number`, `a-boxed-primitive-is-not-its-primitive`, `data-under-a-symbol-key-is-data`,
`a-class-instance-is-not-its-fields`, `a-null-prototype-object-is-not-a-plain-one`,
`a-getter-is-read-as-the-value-it-returns`, `a-graph-that-returns-to-itself`, `an-error-is-data`,
`a-map-key-is-compared-by-its-data`, `two-instants-are-one-date`. **A case table that crosses kinds
serves readably, and this catalogue has published one and frozen it.**

Taken clause by clause against the polymorphic form — one `add` over the zone-free carriers:

| clause | | |
| --- | --- | --- |
| **¬R6** | pure and deterministic in its arguments | holds, once the union excludes `ZonedDateTime` |
| **¬R7** | a signature that can carry the answer | holds — `T | null` beside a reason export, `date/add@1`'s own shape |
| **¬R9** | a case table that serves readably | **holds on the precedent** |
| **¬R12** | no collision with a frozen contract | holds weakly — ADR-0216's reading, `date/add@1` being `Date`-typed and anticipating neighbours |
| **¬R13** | an answer that does not follow the runtime | holds for the zone-free carriers |

**So the polymorphic form passes P4.** The one difference from the precedent is named rather than
smoothed: `deepEqual` is `(a: unknown, b: unknown)`, so **one** signature carries every case, where the
polymorphic form needs a generic whose return type follows its argument. That difference touches
neither R7 nor R9 — a generic signature carries the answer and the table still reads one row per case —
so it is not a P4 objection, and it is written down because it is the nearest thing to one.

**Of ADR-0216's three shapes, one survives.** The per-carrier form is what would make R8 true; the
validator dies on ADR-0158's criterion, and the narrow reading above sharpens that — the packages built
on Temporal validate durations as **strings**, so a bag validator has no ecosystem either. **The
polymorphic form is the only one standing**, and saying so is a narrowing rather than a choice: **no
contract is written**, and whether this catalogue publishes one is the owner's.

## What would reopen this

* **The condition, rather than the measurement.** R5 was declared to fire only if *every* package
  agrees. A reader who holds that one dissenter among four is too thin is disputing a threshold this
  record fixed in advance, and that dispute reopens the ground without touching a figure.
* **`luxon` changing its mind.** The whole of R5's answer rests on one package refusing an unknown
  unit. A major of `luxon` that adopted Temporal's silence would make the ecosystem unanimous and fire
  R5 retroactively.
* **A package this enumeration missed.** The search did not return `luxon`, which does the job as
  plainly as any library there is, and it was added by judgement. A reader may add another and re-run
  the reading; the probe takes a package name.
* **Q2 gaining a dissenter.** No library read disagrees with Temporal about the inapplicable unit. One
  that rejects it would widen what a contract settles from one decision to two.
* **The owner settling the unit.** P3 is what remains, and P4 no longer narrows it.

## More Information

### Where the probes live

Outside this repository on stage rule 5, with the ten packages installed under the scratchpad and never
in this tree — **`package.json` is untouched and no dependency was added**. Two readings carry the load
and both are controlled: every Q1 row is run beside the same call without the offending key, so a
package that refuses everything is not read as a package that refuses this; and the three exclusions
were each confirmed by a well-formed bag throwing too.

### Coordinates

Measured on **2026-09-04** against the tree at `ec8e8bb`, on **node v24.15.0** for the packages and
**Chrome 152.0.7977.77 headless** for Temporal's own answers, which are ADR-0216's. Package versions
are in the table above. `pnpm freeze` is green either side and **no digest moved**: nothing under
`contracts/` was touched and `THE_PACKAGE_VERSION` stays at `1.2.0`.

### Why `confirmed-by` is empty

For ADR-0215's reason, unchanged: nothing here reads a record's reasoning, and a search's conclusion is
prose about a population outside this repository. Declared rather than left blank, on ADR-0186's rule
for the neighbouring field.
