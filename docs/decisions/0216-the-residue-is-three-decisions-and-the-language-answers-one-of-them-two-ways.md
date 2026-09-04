---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# The residue is three decisions and the language answers one of them two ways

> **This record withdraws a ground [ADR-0215](0215-the-fourth-search-is-conducted-on-the-surface-that-arrived-after-the-third.md)
> published, and it is a new record rather than a rewrite because that one is stamped.** ADR-0215
> refused twenty-four operations on **R10** — *the residue is one decision* — and invited the reader to
> dispute exactly that row: *the difference between refusing it and retaining it is the difference
> between this record's negative and an eighth candidate.* The owner disputed it with a measurement.
> **The measurement holds, R10 is withdrawn, and the twenty-four are retained.** ADR-0215's population,
> its window, its guard against the draft engine and its other 118 grounds are untouched; what moves is
> one bucket of its table.

## Context and Problem Statement

ADR-0215 measured that Temporal silently ignores an **unknown** field in a duration or fields bag
whenever one field it knows is present — `PlainDate.prototype.add({ days: 1, dayz: 9 })` answers
`2026-01-16` — on 24 of 24 operations probed. It held that permanent rule 7 was met positively and
refused on **R10**, arguing that once you decide to reject the unknown field nothing is left to settle.

**The contestation is that a *known* field the carrier cannot apply is a second decision, and that two
types of one API answer it in opposite ways.** That is measurable rather than arguable, so it was
measured.

## Decision Drivers

* **A refusal ground that a measurement falsifies is worse than no ground.** ADR-0192's own second
  reopening trigger is *a refusal ground being wrong*, and ADR-0215 spent a section on ADR-0192's
  `Date.parse` row resting on a false premise. Leaving R10 standing here would be that defect
  committed by the record that reported it.
* **The invitation was explicit and it was taken.** ADR-0215 named this row as the one to dispute
  first. A record that invites contestation and then absorbs it into the original ground has published
  an invitation it did not mean.
* **The acceptance rule decides, not the searcher's preference for a tidy negative.** ADR-0192's brief
  and ADR-0215's both refuse a candidate manufactured to avoid an empty result; the mirror obligation
  is to retain one the rule retains.
* **What a contract's *unit* should be is not a refusal ground.** ADR-0207 separates the twelve-and-one
  grounds from **P3, the unit**. Confusing the two is how a ground gets stretched to carry a judgement
  it was not read off.

## Considered Options

* **Keep R10** — refuted by the matrix below
* **Move the refusal to R8** — one algorithm behind several renderings
* **Move the refusal to R4** — a product choice with nothing to be wrong against
* **Withdraw the ground and retain the operations**, naming the open question as P3's rather than a
  ground's

## Decision Outcome

**Chosen: R10 is withdrawn and the twenty-four operations are retained.** No ground of R1 to R13 fires
cleanly on them. What is unsettled is the **unit** — P3 — and that is a decision for the owner rather
than a refusal this record may take.

**No contract is written.**

### The measurement that withdrew the ground

Re-taken on Chrome 152.0.7977.77 headless, the draft guard passing, at `d33f1d3`. **The five readings
put to this record all reproduce**, including the one that looked wrong: `PlainTime.add({ days: 1 })`
answers *the input unchanged*, which is `00:00:00` from midnight and `12:00:00` from noon.

**A known duration unit the carrier cannot apply:**

| carrier | applied | **ignored in silence** | **refused** |
| --- | --- | --- | --- |
| `PlainDate` | 4 | **6** — every time unit | 0 |
| `PlainTime` | 6 | **4** — every date unit | 0 |
| `PlainDateTime` | 10 | 0 | 0 |
| `PlainYearMonth` | 2 | 0 | **8** |
| `Instant` | 6 | 0 | **4** |
| `ZonedDateTime` | 10 | 0 | 0 |
| `Duration` | 7 | 0 | **3** |

**Two carriers swallow it, three refuse it, two can apply everything.** `PlainDate.add({ hours: 5 })`
answers `2026-01-15` — the input unchanged — while `PlainYearMonth.add({ hours: 5 })` throws. One API,
one question, opposite answers.

**An unknown key beside an applicable one is dropped in silence on all seven**, which is uniform and is
what ADR-0215 measured.

**And the bag is read more widely than own enumerable string keys.** A `{ days: 1 }` reached through
the prototype chain is accepted; a getter is accepted; `{ DAYS: 1 }` and `{ day: 1 }` throw **alone**
and are dropped **beside** a valid field.

### Why R10 falls

R10 is *the residue is one decision*, read off `semver/compare`, `string/compare-natural` and
`object/flatten`. **The residue here is three:**

1. **An unknown key beside a valid one** — reject or ignore. Temporal ignores, uniformly.
2. **A known unit the carrier cannot apply** — reject or ignore. **Temporal has no single answer**: two
   carriers ignore, three refuse.
3. **Own properties or the prototype chain** — Temporal reads the chain, and a contract must say so.

The second is not a residue at all in R10's sense, because R10 supposes the language settled the
question and left one thing over. **Here the language answers it two ways inside one API.**

### What the other twelve do, read one at a time

* **R1** — *the language gives it and its answer is not wrong*. Fails on measurement: the answer is
  wrong on `PlainDate` and `PlainTime`.
* **R2** — a written normative specification is the contract. The specification says what Temporal
  *does*; ADR-0215's narrow test asks whether another domain's right answer differs, and an application
  developer who wrote `plainTime.add({ days: 1 })` wants to be told. Does not fire.
* **R3** — one expression over built-ins. A per-carrier applicable-unit set, an own-property decision
  and a delegation is not one expression.
* **R4** — a product choice with nothing to be wrong against. **The strongest of the near misses, and
  it does not fire**: `number/parse@1` publishes this catalogue's position that a plausible value which
  silently drops what the caller asked for is *wrong*, not merely different, and `PlainYearMonth` and
  `Instant` show the language itself taking that side.
* **R5** — no ecosystem to disagree. **This record cannot rule it out.** Temporal shipped recently and
  whether any package wraps it, or disagrees about this, was not measured — it is the one ground a
  reading this record did not take could still fire, and it is named rather than waved past.
* **R6** — impure. The affected carriers are zone-free and clock-free.
* **R7** — the signature cannot carry the answer. It can: `T | null` beside a reason export, which is
  `date/add@1`'s own shape.
* **R8** — one algorithm behind several renderings. **A stretch, and it is refused as the ground rather
  than leaned on.** Its precedent, `string/camel-case`, is several *output renderings of one input
  type*; this is one rule over several *carrier* types, which is polymorphism. Reaching for it would be
  stretching a ground to carry a judgement about the unit.
* **R9** — the case table cannot be served readably. Temporal values render as ISO strings.
* **R11** — nothing at stake. A silently dropped field is the stake.
* **R12** — it collides with a question a frozen contract settles. **Weak**: `date/add@1` settles this
  for `Date` and UTC instants, and its own `inputDomain` says *calendar arithmetic in a named zone is a
  separate, later contract*, so the catalogue anticipates neighbouring date contracts rather than
  foreclosing them.
* **R13** — the answer follows the runtime. `PlainDate`, `PlainTime`, `PlainYearMonth` and `Duration`
  are zone-free.

**So the classification of ADR-0215 becomes R1 65, R13 32, R2 15, R6 6, and 24 retained**, over the
same population of 142 with the same window and the same guard.

### What is not settled, and why it is not this record's to settle

**The open question is P3, the unit, and the owner named it before the measurement was taken: is this a
function, or a lint?** Three shapes are available and each has a real problem:

* **One contract per carrier** — five to seven thin contracts, each restating one rule. This is what
  would make R8 true if it were taken, and it is the shape that most looks like a rule wearing a
  function's clothes.
* **One polymorphic `add` over a union of carriers** — one function, but its case table crosses carrier
  types, and ADR-0207's P4 asks that a case table serve readably.
* **A duration validator** — one function, one type, and it dies on the criterion ADR-0158 used to kill
  `string/split-words`: nobody types *validate a duration bag*, they type *add days to a date*, and a
  phrase that promises an addition may not answer with a validated object.

**A type-level repair is not available and that is measured rather than assumed.**
`Temporal.DurationLike` declares every unit optional by design, so the compiler permits
`plainTime.add({ days: 1 })` on purpose; a contract could publish a narrower type, but the runtime
check is what a case table can hold.

Deciding between the three is a product decision about what this catalogue publishes, and the unit was
constrained to write no contract until the owner has ruled.

## What would reopen this

* **A reading of the ecosystem.** R5 is the one ground this record could not rule out. If nothing wraps
  Temporal and nothing disagrees, R5 fires and the twenty-four return to being refused.
* **The owner settling the unit.** Any of the three shapes above, chosen, turns this from a retained
  candidate into either a contract or a refusal on P3 — and a refusal on P3 is not a refusal on a
  ground, which is the distinction this record exists to hold.
* **A second engine.** Every figure here is Chrome 152's. A stage-4 engine that refuses where this one
  ignores would move the matrix and with it the second decision.
* **The specification moving.** Temporal reached stage 4 in March 2026; an erratum making the carriers
  consistent would remove the second decision and put R10 back within reach.

## More Information

### Where the probes live

Outside this repository, on stage rule 5, alongside ADR-0215's. Two carry the load and both refuse to
print rather than narrowing in silence: the draft guard, which throws unless `TimeZone` and `Calendar`
are absent and the namespace is exactly the nine; and the classification, which exits non-zero unless
every operation of the 142 receives exactly one verdict.

### Coordinates

Measured on **2026-09-04** against the tree at `d33f1d3`, on **Chrome 152.0.7977.77 headless**, no
flag, `--lang=en-US`, host zone `Europe/Paris`. The matrix is ten duration units against seven carrier
types. `pnpm freeze` is green either side and **no digest moved**: nothing under `contracts/` was
touched and `THE_PACKAGE_VERSION` stays at `1.2.0`.

### Why `confirmed-by` is empty

For ADR-0215's reason, unchanged: nothing here reads a record's reasoning, and a search's conclusion is
prose about a population outside this repository. Declared rather than left blank, on ADR-0186's rule
for the neighbouring field.
