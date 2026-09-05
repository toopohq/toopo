---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# One rule or two is decided by whether a verdict is a function of the pair the sentence names

## Context and Problem Statement

ADR-0223 fixed the arity at four and reserved one question for the owner. ADR-0224 sharpened it rather
than dissolving it: **`Duration` is the only carrier that poses a second refusal question — a constraint
on the *pair* rather than on the unit — and a contract spanning it settles two rules where the other
three need one.** That is P3, the unit, and the record left it standing.

The owner has answered it. He proposes that one sentence covers all four:

> **Adding a duration to a Temporal carrier refuses a unit the carrier does not apply, instead of
> dropping it in silence.**

His reasoning, quoted rather than paraphrased because this record exists to test it: *on a `Duration` of
`P1Y` no unit is applied, nanoseconds included — `P1Y + 1ns` throws and `P1D + 1ns` answers
`P1DT0.000000001S`, so the bimodality reproduces. The sentence therefore covers both modes. What differs
is the reason, and the contract claims the answer.*

And his counter-argument, which he names as the more contestable of the two: *the other three do not
share a single reason either — `PlainTime` has no slot for a day, `PlainYearMonth` has one for months
and not for days. If the reason had to be common, the arity would be one.*

**He asks for the falsifier before the measurement.** His own candidate, offered to be verified rather
than adopted: the sentence falls if it cannot cover both modes of `Duration` without a second clause —
if writing it honestly demands *…or that the pair does not permit*, then it is two rules and the arity
is three.

### Why this record can only be worth taking if it could refute him

Outcome 1 preserves ADR-0223's arity and ADR-0224's 50-row table. This repository's own rule is that
**the outcome preserving a published figure is the one that most needs a failing direction**, and it was
applied one record ago to the same question. So the falsifiers below are written first, they are
operational rather than rhetorical, and each names the reading that would fire it.

### What is not in play

Nothing downstream moves on the answer. Item 1 of ADR-0218's price is one kind at any arity, and
`parametersOf` reads the generic form as `carrier: T` at arity three as at arity four — both measured at
ADR-0223. **That is precisely what makes the question settleable cleanly**, and it is why it is worth
spending a unit on a sentence.

## Decision Drivers

* **The criterion has to be about the sentence's own shape, not about taste.** *One rule or two* is
  decided by nothing anybody can measure until it is made operational. The sentence quantifies over a
  pair — a carrier and a unit — and returns a verdict, so it is a single rule exactly if the verdict is
  a function of that pair. Anything the verdict depends on that the pair does not name is a second
  clause, whatever it is called.
* **A reason is not an answer, and the contract publishes answers.** The owner's first move is that the
  contract claims what happens and not why. That is the catalogue's own position — `object/deep-equal@1`
  publishes rows on which two sound implementations agree for different reasons — so it is granted here
  rather than re-argued, and the falsifiers below are aimed at the *answer* accordingly.
* **A predicate discovered after a rule cannot enforce it.** ADR-0223's admission rule is committed and
  contains posability and R13. If a predicate separating three carriers from the fourth turns up, it
  bears on P3 — what the unit is — and not on the rule. Reaching for it to move the arity would be
  fitting a criterion to a reading, which is what the two-commit discipline exists to prevent.
* **An exemption declared afterwards is a rescue.** The one degenerate case the sweep will certainly
  meet — a unit carried with the value zero — is ruled on below, before it is seen.

## Considered Options

The question has two halves and they are independent, so the options are named per half.

**On the sentence.**

* **It covers the four carriers and both modes of `Duration` as written.** The owner's position.
* **It needs a second clause naming the pair.** His candidate falsifier; the arity is three.
* **It covers them but the table is not 50 rows.** Named so that a reading which moves the figure
  without moving the arity has somewhere to land instead of being pushed into one of the other two.

**On the counter-argument.**

* **No predicate common to the three is missing from `Duration`.** The owner's position: heterogeneity
  of reason is universal, so it disqualifies nobody.
* **Such a predicate exists.** His counter-argument falls, and what it bears on is P3.

## Decision Outcome

### The criterion, committed before any probe

> **The sentence is one rule exactly if, for every retained carrier value and every duration unit, the
> verdict of `add` is a function of that pair alone.**

Three things make it applicable rather than merely sayable:

1. **What the pair is.** A carrier *value* and a unit *name*. ADR-0224 settled that `inapplicable` is
   quantified over a carrier's values, so the first member is the received value and not the type; that
   is a decision already taken and it is inherited here rather than re-opened.
2. **What a verdict is.** One of `applied`, `ignored in silence`, `refused` — ADR-0216's three classes,
   unchanged, so this reading is comparable with the two matrices already published.
3. **What counts as a second clause.** Any input the verdict depends on that the pair does not name:
   the magnitude or sign carried by the unit, another unit in the same bag whose own inapplicability
   does not already explain the refusal, or a property of the receiver the phrase *the carrier does not
   apply* cannot reach.

### The falsifiers, written before the measurement

**F1 — a verdict that depends on the value rather than on the unit.** On one carrier value, one unit
applied with two different non-zero values yields two different verdicts. The sentence names the unit
and not its magnitude, so it cannot predict both. **Fires: the sentence falls.**

**F2 — a verdict that depends on a companion unit which is itself applicable.** On one carrier value,
`u1` alone applies, `u2` alone applies, and the bag `{u1, u2}` refuses. No inapplicability explains that
refusal, so covering it needs a clause about the pair of units. **Fires: the sentence falls, and it
falls in exactly the shape the owner named.**

**F3 — the mode does not predict the verdict on `Duration`.** Two `Duration` bases whose largest
non-zero unit has the same calendar character disagree on some unit. Then two modes are not enough, the
50-row figure is wrong, and the sentence — if it survives at all — survives over a table whose size
nobody knows. **Fires: outcome III.**

**F4 — the inapplicable set of one of the other three is not constant across its values.** This does not
touch the sentence; it strengthens it, by making the quantification over values uniform across the four.
What it touches is the counter-argument: the separating predicate would not exist. **Fires: the
counter-argument holds.**

**F5 — no predicate below separates.** Read over the candidates enumerated next. **Fires: the
counter-argument holds.**

**The one exemption, ruled before it is seen.** A unit carried with the value **zero** requests nothing,
and `DefaultTemporalLargestUnit` reads the largest *non-zero* unit, so `{years: 0, days: 1}` is expected
to behave as `{days: 1}`. **If zero is the only point at which a unit's verdict moves, it is published as
a named limit of the sentence and does not fire F1**, because a unit of value nought is not a unit
anybody asked for and the contract would say so in the same words. **If any non-zero value moves a
verdict, F1 fires and this exemption does not reach it.** Written here so that meeting the case later
cannot be answered by inventing the distinction.

**And an overflow is not an inapplicability.** A `RangeError` from a carrier reaching the edge of its
representable range is a third failure class, present on `PlainDate` as on `Duration`, and it is
classified apart rather than counted as a refusal. Failing to separate the two would publish a bound as
a unit rule.

### The predicates put to the counter-argument, enumerated in advance

Only these are tested, and the enumeration is declared rather than exhaustive:

* **Q1 — the inapplicable set is constant across the carrier's values.**
* **Q2 — the applicable set is non-empty on every value of the carrier**, so `add` does something
  somewhere on every receiver.
* **Q3 — the cause of a refusal is the unit added and never the receiver.**
* **Q4 — inapplicability is decidable without reading the operand beyond which units it names.**
* **Q5 — the carrier is a point and a duration is a displacement.** Named because it is the predicate a
  reader will reach for, and declared **not measurable here**: it is a statement about meaning, and no
  engine answers it. It is recorded so that its absence from the measurement is a stated limit rather
  than an omission.

### The prediction, with its bias declared

* **The sentence holds on the four and on both modes.** **This is the owner's position and it preserves
  two published figures, so the bias is towards holding it**, and a reader should discount it exactly as
  far as F1, F2 and F3 could have fired and did not.
* **The counter-argument falls: Q1 separates**, the three being constant and `Duration` not. **The bias
  here runs the other way** — it contradicts the owner — but it is not a free reading either: ADR-0224
  already measured three bases per carrier and found the other five stable, so this half starts from a
  reading already taken and the sweep below exists to give it a chance to fail.
* **The arity stays four**, because no Q is in ADR-0223's committed admission rule.

### The protocol, written before it is played

**The engine.** Chrome **152.0.7977.77** headless, the build ADR-0216, ADR-0223 and ADR-0224 all
measured on, so the figures are comparable with all three. No Node 26 exists on this machine, unchanged
from ADR-0223. The **draft guard** runs first and the probe throws rather than narrowing in silence
unless the namespace is exactly the nine members with `TimeZone` and `Calendar` absent.

**The population.** The four retained carriers, and `Instant` and `PlainDateTime` carried alongside as
controls wherever the reading is about stability rather than about the sentence.

**B1, the sentence against the value.** Every carrier base × ten units × the values `1`, `2`, `-1`,
`7`, `0`. F1 reads here.

**B2, the sentence against a companion.** Every carrier base × every ordered pair of units that apply
alone on it, as one bag. F2 reads here.

**B3, stability across the carrier's values.** A wide sweep of bases per carrier — deliberately wider
than ADR-0224's three, and chosen to include the edges that would move a carrier if anything does. F3
and F4 read here, and so do Q1 and Q2.

**B4, the mode as a predictor.** Over every `Duration` base, is the inapplicable set predicted by
whether the largest non-zero unit is a calendar unit? F3 reads here too, from the other side.

**The control on the engine.** B3's readings must reproduce ADR-0224's stability figures on the bases it
used — `PlainDate` 6, `PlainTime` 4, `PlainYearMonth` 8, `Instant` 4, `PlainDateTime` 0 — and B1's
value-`1` column must reproduce ADR-0223's matrix row for row. A disagreement stops the unit and is
reported rather than smoothed.

## Consequences

To be completed after the measurement, which is the point of committing this half first.

## What would reopen this

To be completed with the measurement.

## More Information

### Where the probes live

Outside this repository, on stage rule 5, alongside ADR-0215's, ADR-0216's, ADR-0223's and ADR-0224's.

### Coordinates

The criterion, the five falsifiers, the exemption, the predicates, the prediction and the protocol are
committed **before the probe is written**, against the tree at `aeaa6ea`. Everything after them was
measured on 2026-09-05 on the engine named above.

### Why `confirmed-by` is empty

For ADR-0223's reason and ADR-0224's, unchanged.
