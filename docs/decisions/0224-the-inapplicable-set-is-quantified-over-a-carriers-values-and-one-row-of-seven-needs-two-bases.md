---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# The inapplicable set is quantified over a carrier's values, and one row of seven needs two bases

## Context and Problem Statement

ADR-0223 committed a rule before counting and read the arity as four. Its first member is *the question
can be asked of the carrier*, spelled **at least one of the ten duration units is inapplicable to it**,
and the owner asked what `inapplicable` means there — with a measurement, and with the discriminant he
had used to take it declared broken in the same message.

**It is a new record rather than a rewrite because ADR-0223 is stamped**, on ADR-0216's own precedent
for the same situation.

### What was put to this record

`Temporal.Duration` carries all ten components and `Duration.prototype.add({ years: 1 })` throws
*Largest unit cannot be a calendar unit when adding two durations*, with `relativeTo` making no
difference. Read as *a component the carrier does not have*, the absent-component counts are
`PlainDate` 7, `PlainTime` 4, `PlainYearMonth` 8, `Duration` 0 — so `Duration` would be the only one of
the four whose refused units are components it carries, which suggests the question is not posable of
it at all, exactly as it is not posable of `PlainDateTime`.

**And the reading was handed over broken**: `PlainDate` has no `week` component and
`add({ weeks: 1 })` applies, so *being a component* and *being applicable* are not the same predicate.

Three outcomes were named: the rule already held the answer; the rule is under-specified and gains a
dated amendment; or `Duration` leaves and the arity is three.

## Decision Drivers

* **The committed text decides, and it is short enough to quote.** ADR-0223 spells the criterion *a
  known duration unit the carrier cannot apply*. Whether that is settled by behaviour or by structure
  is a question its own words answer, and reaching for either after the fact is what the two-commit
  discipline exists to prevent.
* **The outcome that preserves a published figure is the one that most needs a failing direction.**
  Outcome 1 keeps ADR-0223's arity, so it is worth taking only if the reading behind it could have gone
  the other way and did not.
* **A broken discriminant is worth measuring rather than discarding.** It was handed over as broken on
  one line; how broadly it fails is a fact about the structural reading, and it is cheap.

## Considered Options

* **Structure — a unit is inapplicable when the carrier has no component for it.** Refused on
  measurement below.
* **Behaviour over one base — what the matrix read.** This is what ADR-0216 and ADR-0223 both did, and
  it is right about the answer and wrong about its own generality.
* **Behaviour quantified over the carrier's values.** Retained.

## Decision Outcome

**Outcome 1: the rule already held the answer, and `inapplicable` means the carrier does not apply the
unit — quantified over the carrier's values, not over one base and not over its components.** The arity
stays **four**. No amendment to the rule is needed; what is corrected is a figure, a method, and the
generality ADR-0223 claimed for one of its own sentences.

### Why the committed words settle it

ADR-0223's criterion is *a known duration unit the carrier **cannot apply***, and its matrix classes
each cell `applied`, `ignored in silence` or `refused`. Inapplicable is the union of the last two — a
statement about what the carrier does, which is also what the *contract* settles: a caller who passes a
unit is owed an answer about what happens, and whether the carrier has a slot for it is a fact about its
shape that no caller asks.

### The measurement, and it had a failing direction

**Is a calendar unit ever applicable to a `Duration` receiver?** Swept over eleven bases — the zero
duration, `{days: 1}`, `{days: 400}`, `{days: -3}`, `{hours: 1}`, `{seconds: 90}`, `{nanoseconds: 1}`,
`{years: 1}`, `{months: 1}`, `{weeks: 1}`, `{years: 1, days: 2}`:

| unit | bases on which it applies |
| --- | --- |
| `years`, `months`, `weeks` | **0 of 11** |
| `days` … `nanoseconds` | 7 of 11 |

**Had any of the three applied on any base, `Duration`'s inapplicable set would have been empty and the
arity three.** It is 0 of 11, so the three are inapplicable to every `Duration`, the set is non-empty
and stable, and it is exactly the three ADR-0223's matrix read. The reading could have taken the
prediction down and did not.

### What is new, and it corrects a method two records share

**`Duration`'s row is bimodal, and no other row is.** Partitioned by the mechanism the engine's own
message names — whether the receiver's largest unit is a calendar unit:

| receiver | bases | inapplicable of ten |
| --- | --- | --- |
| largest unit is `days` or smaller | 7 | **3** — `years`, `months`, `weeks` |
| largest unit is a calendar unit | 4 | **10** — every unit, `nanoseconds` included |

So a `Duration` of `P1Y` refuses to have a nanosecond added to it. The other five carriers are **stable
across their bases** — `PlainDate` 6, 6, 6; `PlainTime` 4, 4, 4; `PlainYearMonth` 8, 8; `Instant` 4, 4;
`PlainDateTime` 0, 0 — measured over end-of-month, end-of-year, midnight and epoch values chosen to move
them.

**The matrix reads one base per carrier, and for one row of seven that is not enough.** ADR-0216
established that method and ADR-0223 reproduced it; both are right about the inapplicable set and both
publish a `Duration` row that is one of two modes without saying so. Neither is rewritten: the row they
publish is the mode their base sits in.

**The arity is unmoved by the bimodality**, and that is worth stating rather than assuming: posability
asks for at least one inapplicable unit, and `Duration` has three in one mode and ten in the other. The
question is posable of it under either.

### The structural reading, refused on a wider measurement than the one that refused it

It was handed over as failing on one line. Measured against the inapplicable counts, over the six
carriers of which the question can be asked or which were in play:

| carrier | components absent of ten | inapplicable | agree |
| --- | --- | --- | --- |
| `PlainDate` | 7 | 6 | no — no `week` component, and `weeks` applies |
| `PlainTime` | 4 | 4 | yes |
| `PlainYearMonth` | 8 | 8 | yes |
| `Instant` | 10 | 4 | no |
| `PlainDateTime` | 1 | 0 | no |
| `Duration` | 0 | 3 | no |

**Two of six agree and four do not.** `Instant` is the sharpest: it carries no component of the ten at
all — its state is an epoch count — while applying six of them. So the structural reading is not one
broken case with five sound ones; it is a different predicate that happens to coincide twice.

### What this does to the figures ADR-0223 published

**The case table is 50 rows and not 40.** Three carriers contribute ten rows each; `Duration`
contributes twenty, because a contract that settles what it does must settle both receiver modes, and a
table carrying only one publishes *a nanosecond may be added to a duration* as though it were
unconditional. Against `date/add@1`'s 43 and `object/deep-equal@1`'s 58 in ten groups, 50 is still
inside the precedent.

**Both prices are unmoved.** Item 1 is one kind whatever the arity, and `parametersOf` reads the generic
form as `carrier: T` at any arity — so nothing downstream of the arity moves, which is what makes this a
question worth settling slowly.

### The residue reserved for the owner is sharpened rather than dissolved

ADR-0223 left one P3 question: whether adding a duration to a duration is the same subject. The reading
above makes it harder rather than easier. **`Duration` is the only carrier that poses a second refusal
question** — a constraint on the *pair* rather than on the unit — and a contract spanning it settles two
rules where the other three need one. That is an argument about the unit and not about the rule, it
remains the owner's, and the arity is four until he takes it.

## Consequences

`inapplicable` is settled as behaviour quantified over a carrier's values. The arity is **four**,
unchanged, and the reading that confirms it is one that could have refuted it.

ADR-0223's 40-row figure is corrected to **50**, and the one-base matrix method it shares with ADR-0216
is recorded as under-reading `Duration`. Both records are stamped and carry a head note rather than an
edit.

The structural reading is refused on four of six carriers rather than on one line.

Nothing is repaired. No contract is written, nothing under `contracts/` moved, none of ADR-0218's three
repairs was taken, and `THE_PACKAGE_VERSION` stays at `1.2.0`.

## What would reopen this

* **A `Duration` on which a calendar unit applies.** The sweep is eleven bases and not a proof; the
  mechanism is the engine's own message, and a base that escaped it would empty the inapplicable set and
  make the arity three.
* **A second engine.** Every figure is Chrome 152's, as ADR-0223's are.
* **A carrier gaining a second mode.** The stability of the other five rests on three bases apiece at
  most; one that moved would put them in `Duration`'s position and would grow the table again.
* **An erratum removing the pair constraint.** If adding two durations stopped depending on the
  receiver's largest unit, `Duration`'s row would cease to be bimodal, the table would return to 40, and
  the P3 argument above would lose its sharpest term.
* **The owner ruling on `Duration`'s subject.** Unchanged from ADR-0223, and now with one more argument
  in it.

## More Information

### Where the probes live

Outside this repository, on stage rule 5, alongside ADR-0223's.

### Coordinates

Measured on **2026-09-05** against the tree at `2d7f267`, on Chrome **152.0.7977.77** headless, reduced
user agent `Chrome/152.0.0.0`, no flag, host zone `Europe/Paris`, the draft guard of ADR-0223 passing.
Nothing inside the tree was edited to take it.

**One correction belongs to this record's own reading rather than to anything it examined.** The first
sweep of components asked for the plural unit names on every carrier and answered *nought present* for
`PlainDate`, `PlainTime` and `PlainYearMonth`, which would have contradicted the figures put to this
record. The date-like carriers name their components in the singular — `year`, `month`, `day` — and once
that is read, all four figures reproduce exactly. The wrong reading was not published, and it is
recorded because a probe that answers nought looks like a finding.

### Why `confirmed-by` is empty

For ADR-0223's reason, unchanged.
