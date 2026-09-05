---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A carrier enters where the question can be asked of it, and this tree carries two different fives

## Context and Problem Statement

ADR-0218 named three prices for a Temporal `add`, and ADR-0220 wrote that the first of them cannot be
sized at all until one thing is fixed: **whether item 1 is one kind, four or five is undetermined, and
settling it is a prerequisite to sizing the repair rather than a detail of it. That is a gap in a price
two records have now published.**

That gap is the arity — how many carriers the contract spans — and this unit fixes it by a rule rather
than by a preference. **No contract is written**, nothing under `contracts/` is touched, none of
ADR-0218's three repairs is taken, and `THE_PACKAGE_VERSION` stays at `1.2.0`.

### This tree already carries two different fives, and nobody had put them side by side

Read at `eb9dbdb`, over the records themselves:

* **ADR-0220** — *the zone-free subset is at most five — `Duration`, `PlainDate`, `PlainDateTime`,
  `PlainTime`, `PlainYearMonth`*. Its fifth is **`PlainDateTime`**, and it classes `Instant` with
  `ZonedDateTime` as *not zone-free*.
* **ADR-0219** — its control table has **five rows**: `PlainDate`, `PlainTime`, `PlainYearMonth`,
  **`Instant`**, `Duration`. Its fifth is **`Instant`**, and `PlainDateTime` is not in it.

**The two sets share four members, and those four are exactly the four ADR-0216's R13 clause names.**
So R13's four is an intersection — *zone-free* ∧ *the question can be asked of it* — and each of the
two fives is that intersection widened by one condition, in opposite directions. Neither record was
wrong about its own half; what nothing anywhere states is that they are two halves.

### And one of the two rests on a `measured` it borrowed from the clause beside it

ADR-0220's sentence is *Measured on Node 26.8.1: of the nine members of the namespace, `PlainMonthDay`
carries no `add` … `Instant` and `ZonedDateTime` are the two that are not zone-free.* The verb governs
the first clause, which is a reading of the namespace. **The classification of `Instant` is an
assertion standing beside a measurement**, and it inherits the measurement's authority in a reader's
eye — which is this repository's own rule about a dated number followed by a present-tense claim,
arriving between two clauses of one sentence rather than between a figure and its date.

Whether the assertion is true is measurable, and ADR-0216's own matrix already contains the material:
`Instant` **refuses every date unit** and applies only the six time units, while `ZonedDateTime`
applies all ten. Whether that difference is the difference R13 is about is what the protocol below
settles.

## Decision Drivers

* **The rule is committed before the count.** ADR-0210 and ADR-0212 both established the form: the
  rule, its bias and the outcomes are written into the record and committed before a figure of them is
  read, so that no reading can be fitted afterwards and no outcome can be presented as a rescue.
* **The rule comes from what the contract settles, never from what the type system permits.** A
  carrier that is admitted because it is also a Temporal type has widened the surface without widening
  what the contract decides, and P3 and permanent rule 7 would both ask why it is there.
* **A case table records agreement as much as divergence, and the catalogue's own precedent settles
  it.** ADR-0150 replayed `date/add@1` against Temporal over all forty-three cases: **thirty-eight
  agree and five part**, and the forty-three are in the table. A rule admitting a carrier only where
  the language is *wrong* would refuse what this catalogue already publishes.
* **A ground read globally is not a ground read per carrier.** ADR-0216 judged R12 over the candidate
  as a whole and called it *Weak*. The arity is the first question that asks the twelve grounds of one
  carrier at a time, and a ground can fire on one member of a union while missing the others.

## Considered Options

* **The narrow rule** — *a carrier enters where the contract answers a question the language answers
  otherwise.* **Refused before it was applied, and by arithmetic rather than by taste.** It admits only
  the carriers that *swallow*: `PlainYearMonth`, `Instant` and `Duration` already refuse the
  inapplicable unit, which is what the contract would do, so the language does not answer otherwise and
  all three fall out. It renders **two** — `PlainDate` and `PlainTime` — where R13 names four, and it
  is refuted by ADR-0150's forty-three rows above.
* **Zone-freeness alone** — the condition ADR-0220 used. It admits `PlainDateTime`, of which the
  question cannot be asked at all.
* **The first residue decision alone** — the unknown key, which is uniform on all seven, so it admits
  every carrier and leaves R13 to remove one. Named as outcome D below so that its exclusion is a
  ground rather than an omission.
* **Posability, then R13** — retained.

## Decision Outcome

### The rule, as committed, before any count

> **A carrier enters if the question the contract settles can be asked of it, and if its answer does
> not follow the runtime.**

Three things make it applicable rather than merely sayable:

1. **Which question.** The second of ADR-0216's three residue decisions — *a known duration unit the
   carrier cannot apply*. It can be asked of a carrier **iff at least one of the ten duration units is
   inapplicable to it**, which is a property of the carrier that the matrix reads directly.
2. **Why the second and not the first or third.** Decisions 1 and 3 — the unknown key, and the
   prototype chain — are uniform across every carrier, so a rule keyed to either admits all seven and
   decides nothing. The second is the one on which the language has no single answer, and it is
   therefore the one a contract exists to settle.
3. **The second member is R13**, applied to the carrier's own `add` rather than to its name.

A carrier passing both members is still subject to the twelve grounds read one at a time, and **R12 is
the one with a live candidate** — `date/add@1` is frozen and its `inputDomain` opens *Absolute
instants, shifted by durations written in whole units … The arithmetic is UTC throughout*.

**The first member is a measurement and the R12 half is a reading**, and they are not worth the same.
The matrix is taken from an engine; R12 is frozen prose held against a candidate. This record says
which of its own conclusions rests on which.

### The four outcomes, named in advance

* **A — four.** `PlainDate`, `PlainTime`, `PlainYearMonth`, `Duration`. `PlainDateTime` out on
  posability, `ZonedDateTime` on R13, `Instant` on R12.
* **B — five with `Instant`.** As A, plus `Instant`: R13 does not fire on it, and R12 read per carrier
  does not either, because a frozen contract's subject is the type its signature declares rather than
  the domain its prose names.
* **C — five with `PlainDateTime`.** The rule's first member is read over the unknown key rather than
  over the inapplicable unit.
* **D — six or seven.** A rule keyed to decision 1, with R13 removing `ZonedDateTime` or not.

### The prediction, with its bias declared

**A, four.** The bias is **towards four and towards R12 firing**, and it is declared because
`date/add@1`'s `inputDomain` was read *before* this rule was written — so the half of the prediction
most at risk of having been fitted to a reading already taken is the R12 half, and a reader should
discount it accordingly. The R13 half was not read before the rule; it is predicted below as part of
the protocol, where it can fail.

### The protocol, written before it is played

**The engine.** Chrome **152.0.7977.77** headless, which is the build ADR-0216 measured its matrix on,
so the figures below are comparable with **ADR-0216 and not with ADR-0220**, whose reading was taken on
Node 26.8.1. No Node 26 exists on this machine. The **draft guard** runs first and the probe throws
rather than narrowing in silence unless the namespace is exactly the nine members and `TimeZone` and
`Calendar` are absent.

**The population.** Every member of the namespace carrying `add` on its prototype, enumerated from the
engine rather than transcribed from ADR-0216.

**The matrix.** Ten duration units against that population, each unit applied alone with the value 1,
each cell classed *applied*, *ignored in silence* or *refused*. It doubles as the control on the
engine: a cell disagreeing with ADR-0216 stops the unit and is reported rather than smoothed.

**The first decision, as a control.** An unknown key beside a valid one, on every member of the
population, so that outcome D is refused on a reading rather than by assertion.

**R13, with its zone and its date fixed here rather than chosen afterwards.** Zone
`America/New_York`; the transition instant `2026-03-08T07:00:00Z`; the base wall time
`2026-03-07T12:00:00`; the two bags `{ days: 1 }` and `{ hours: 24 }`. **The two carriers that apply
all ten units are the only two on which both bags apply, so they are exactly the pair this test
separates** — for every other carrier the matrix has already answered, one bag being ignored or
refused. Predicted: the two bags **agree on `PlainDateTime` and part on `ZonedDateTime`**, and
`Instant` refuses `{ days: 1 }` while applying `{ hours: 24 }` as exactly 86 400 × 10⁹ nanoseconds —
an assertion that can fail rather than a structural remark that cannot.

**R12.** `date/add@1`'s frozen `identity.inputDomain` and its declared signature, read against each
carrier the first two stages retain.

### What the arity is for

Two things downstream, and they take it differently.

* **Item 1 of ADR-0218's price** — a kind in `value.ts` for a carrier whose state is internal. Whether
  the arity multiplies it is the question ADR-0220 left open, and ADR-0219 has already measured the
  material that answers it: naming the carrier as data **round-trips losslessly on seven carriers of
  seven**. One encoding shape spelling every carrier is one kind whatever the arity; one kind per
  carrier is arity kinds. The measurement is which, and then what one kind costs.
* **Item 3** — `AS_AN_ARGUMENT` gaining a field whose type is a choice. The choice has as many members
  as the arity, so this item is multiplied by it where item 1 may not be.

## Consequences

To be completed in this record's second commit, with the measurements taken.

## What would reopen this

* **A second engine.** Every figure here is Chrome 152's. A stage-4 engine that refuses where this one
  ignores, or applies where this one refuses, moves the matrix and with it the rule's first member.
* **An erratum making the carriers consistent.** The specification removing the inapplicable-unit
  question empties the rule's first member for every carrier at once, and the arity becomes nought
  rather than four.
* **R12 read the other way.** If a frozen contract's subject is held to be the type its signature
  declares rather than the domain its prose names, `Instant` enters and the arity is five. That reading
  is available today and is not taken here.
* **The owner ruling on `Duration`'s subject.** Whether adding a duration to a duration is the same
  subject as adding a duration to a date-like carrier is P3 and not a measurement. If it is a different
  subject, `Duration` leaves and the arity is three.
* **A carrier gaining an `add`.** `PlainMonthDay` carries none today, which is why the population is
  seven of nine.

## More Information

### Where the probes live

Outside this repository, on stage rule 5, alongside ADR-0215's and ADR-0216's.

### Coordinates

The rule, the four outcomes, the prediction and the protocol above are committed **before the probe was
written**. The measured coordinates follow in this record's second commit.

### Why `confirmed-by` is empty

For ADR-0215's reason and ADR-0216's, unchanged: nothing here reads a record's reasoning, and a
search's conclusion is prose about a population outside this repository. Declared rather than left
blank, on ADR-0186's rule for the neighbouring field.
