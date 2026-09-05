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

### What the measurement returned

**The engine and the guard.** The installed build is **152.0.7977.77**, the reduced user agent reports
`HeadlessChrome/152.0.0.0`, host zone `Europe/Paris`. The draft guard **passed**: the namespace is
exactly the nine and `TimeZone` and `Calendar` are both `undefined`.

**The control passed and it is what makes the rest readable.** At the value `1`, every carrier's
inapplicable count reproduces ADR-0223 row for row — `PlainDate` 6, `PlainTime` 4, `PlainYearMonth` 8,
`Duration` 3, `Instant` 4, `PlainDateTime` 0 — and the owner's two readings reproduce exactly: `P1Y`
plus one nanosecond throws, `P1D` plus one nanosecond answers `P1DT0.000000001S`.

**And then F1 fired, on the carrier nobody was watching.**

### F1 fired: `PlainDate` does not drop a time unit, it truncates one

| asked of `2026-01-15` | answer |
| --- | --- |
| `{ hours: 1 }`, `{ hours: 23 }` | `2026-01-15` |
| `{ hours: 24 }`, `{ hours: 25 }`, `{ hours: 47 }` | **`2026-01-16`** |
| `{ hours: 48 }` | `2026-01-17` |
| `{ minutes: 1440 }`, `{ seconds: 86400 }` | `2026-01-16` |
| `{ milliseconds: 86400000 }`, `{ microseconds: 86400000000 }`, `{ nanoseconds: 86400000000000 }` | `2026-01-16` |
| `{ hours: 12, minutes: 720 }` | `2026-01-16` |

**All six time units act, on every one of them, as soon as they reach a whole day.** What the carrier
does is balance the time part into days and discard the remainder — so the verdict of `hours` on
`PlainDate` is `ignored` at 1 and `applied` at 24, which is F1 exactly: **a verdict that depends on the
value the unit carries and not on the unit.**

**It is not this build's.** Controlled on a second engine — node v24.15.0, V8 13.6.233.17, the draft
Temporal ADR-0215 measured — `{ hours: 23 }` answers `2026-01-15` and `{ hours: 24 }` answers
`2026-01-16`, identically, along with every other row above. Two engines and two versions of the
specification agree.

**So `PlainDate`'s inapplicable set is nought and not six**, and the reading that said six is an
artefact of the value the matrix used. ADR-0216 measured each unit **alone with the value 1**, ADR-0223
reproduced that method and ADR-0224 corrected it along the other axis — one base per carrier — without
touching this one. **ADR-0224's own sentence, one axis over: the matrix reads one value per unit, and
for one row of seven that is not enough.**

**Additivity is the reading that names the phenomenon without interpreting it.** A carrier applies a
unit exactly when adding it in two goes matches adding it in one; anything else is arithmetic the
carrier cannot carry and does not report. Over five splits per cell, on each carrier's ordinary base:

| carrier | exact | lossy | inert at every magnitude | refused at every magnitude |
| --- | --- | --- | --- | --- |
| `PlainDate` | 5 | **3** — `hours`, `seconds`, `milliseconds` | 2 | **0** |
| `PlainTime` | 6 | 0 | **4** | 0 |
| `PlainYearMonth` | 2 | 0 | 0 | **8** |
| `Duration` at `P1D` | 7 | 0 | 0 | **3** |
| `Duration` at `P1Y` | 0 | 0 | 0 | **10** |
| `Instant` | 6 | 0 | 0 | **4** |
| `PlainDateTime` | 10 | 0 | 0 | 0 |

`PlainDate`'s two *inert* cells are inert only against these splits, whose largest sum is 10⁹; the
direct reading above moves both at 86 400 × 10⁹ nanoseconds and 86 400 × 10⁶ microseconds. **So the
honest count for `PlainDate` is ten applied and none inapplicable**, and the split table is published
with that limit stated rather than as though it were total.

### What my own declaration failed to separate, said rather than smoothed

F1 was written *fires: the sentence falls*. **It fired and the sentence did not fall**, because the
carrier it fired on leaves the population the sentence quantifies over. My declaration assumed the
population was fixed and that F1 tested the sentence against it; in fact F1 refuted the population.
That is a case the falsifier did not distinguish, it is written here rather than resolved by reading
the declaration generously, and a reader should hold the sentence's survival to that much less than the
declaration promised.

### The sentence, on the population the measurement leaves

**F2 did not fire.** Over **520** pairs of units that each apply alone, **7** bags did not apply — and
all seven are the range, on `+275760-09-12` and `+275760-09`, with the messages *Date is not within ISO
date time limits* and *epoch days exceed maximum range*. **Not one is a refusal of a unit.** The second
clause the owner feared — *…or that the pair does not permit* — has **no instance**.

**F3 did not fire.** Over **19** `Duration` bases the mode predicts the inapplicable set with **nought
exceptions**: three where the largest non-zero unit is not a calendar unit, ten where it is. The
*non-zero* reading is measured rather than taken from the specification — `{years: 0, days: 1}` and
`{weeks: 0, days: 5}` both sit in the three-unit mode.

**The mixed bag behaves as the sentence needs.** Where one unit applies and another does not:
`PlainYearMonth`, `Instant` and `Duration` refuse the whole bag, **406 of 406**; `PlainDate` and
`PlainTime` apply the good one and swallow the rest, **246 of 264**, the other 18 being the range on the
two edge bases. That is the divergence the contract publishes, and it is uniform.

**So the sentence holds on `PlainTime`, `PlainYearMonth` and `Duration`, and on both modes of
`Duration`, with no second clause.** On the owner's own two rows it is exact: `P1Y` applies no unit, so
the contract refuses every unit; `P1D` applies seven, so it refuses three. **The owner is right about
his sentence.**

**One nuance the zero exemption does not reach, and it cuts his way.** `P1D` plus `{years: 0}` answers
`P1D`, and `P1Y` plus `{years: 0}` **throws**. A unit carried with the value nought is inert on every
other carrier and is refused by a calendar-mode `Duration` — so the exemption declared in advance has
one exception, and the sentence covers it: `P1Y` does not apply `years`, so the contract refuses.

### The counter-argument, measured — and it falls

Of the five predicates enumerated in advance:

* **Q1 separates exactly.** Across every value swept — 7 `PlainDate` bases, 4 `PlainTime`, 5
  `PlainYearMonth`, 19 `Duration` — the inapplicable set is **one set** for each of the other three and
  **two** for `Duration`. There is a predicate the three share and `Duration` alone lacks.
* **Q2 does not separate**, and it fails on the owner's own principle. `PlainYearMonth` at
  `-271821-04` applies nothing at all, exactly as `P1Y` applies nothing. The causes differ — one is the
  range, the other the composition rule — and *the contract claims the answer and not the reason* is
  his own move, so it disqualifies Q2 as well.
* **Q3 is Q1, read observationally, and that is what makes the counter-argument fall.** *The cause of a
  refusal is the unit and never the receiver* looks like a claim about reasons, which he rightly says a
  contract does not publish. But a cause that is the receiver **is observable as an answer**: it is
  precisely a verdict that moves when the receiver's value moves, which is Q1. **So the difference in
  reason is a difference in answer here**, and *the contract claims the answer* does not shelter
  `Duration` from it.
* **Q4 does not separate.** Inapplicability is decidable from the operand's units alone on all three,
  `Duration` included.
* **Q5 was declared not measurable and no attempt was made on it.**

**His defence of the counter-argument is true and lands on an axis that separates nothing.**
`PlainTime` swallows and `PlainYearMonth` refuses — the reasons are as heterogeneous as he says — and
**both have an inapplicable set that does not depend on the receiver's value**, which is the axis that
does separate. Heterogeneity of mechanism is real; heterogeneity of *dependence* is `Duration`'s alone.

### One value on which no arithmetic works, and the limit of a behavioural criterion

`PlainYearMonth` at `-271821-04` refuses all ten units on every magnitude, so the behavioural criterion
— *a throw on every non-zero value is an inapplicability* — classes it with `P1Y`. The cross-check
declared beside it separates them: two of its ten carry *Date is not within ISO date time limits* and
eight carry *Can only add years or months to PlainYearMonth*. It is the range, and the cause is direct:
that value's reference day lies outside `PlainDate`'s own range — `toPlainDate({ day: 1 })` throws,
`-271821-04-01` throws, `-271821-04-19` exists — so **even `subtract({ years: -1 })` throws**. It is a
value of the type on which no arithmetic works at all.

**The behavioural criterion alone would have published `PlainYearMonth` as bimodal**, which is the
finding this record most nearly got wrong. What caught it is that the protocol asked for both readings
and not one.

### The arity, under the committed rule and the corrected matrix

| carrier | inapplicable, corrected | posable | R13 | R12 | verdict |
| --- | --- | --- | --- | --- | --- |
| `PlainTime` | **4**, inert at every magnitude | yes | zone-free | no overlap | **in** |
| `PlainYearMonth` | **8**, refused | yes | zone-free | no overlap | **in** |
| `Duration` | **3 / 10**, refused | yes | zone-free | no overlap | **in** |
| `PlainDate` | **0** — every unit acts | **no** | — | — | **out** |
| `Instant` | 4, refused | yes | zone-free | fires | out |
| `PlainDateTime`, `ZonedDateTime` | 0 | no | — | — | out |

**The arity is three, and the carrier that leaves is `PlainDate`.** Both of the outcomes named in
advance are wrong about which: the owner's outcome 2 reached three by removing `Duration`, and outcome 1
kept four. **`Duration` stays and `PlainDate` goes**, which no outcome named — so the arity moved and
not one of the reasons anybody had written down for it moving is the reason it moved.

The rule is applied and not re-opened. It says *the question can be asked of a carrier iff at least one
of the ten duration units is inapplicable to it*, `PlainDate` has none, and reaching for a different
first member now would be fitting a criterion to a reading — which is what committing it first exists to
prevent.

### What the arity does to the figures, and what it leaves standing

**The case table is 40 rows**: `PlainTime` and `PlainYearMonth` ten each, `Duration` twenty for its two
modes. It returns to ADR-0223's figure by a different route — three carriers of which one is bimodal
rather than four of which none was — and it stays inside the precedent.

**Both prices are unmoved, exactly as the owner said.** Item 1 is one kind whatever the arity, because
the encoding shape is per shape and not per type. Item 3 is one key whose choice now has three members
rather than four, and `parametersOf` reads the generic form as `carrier: T` at three as at four. Nothing
downstream moves, which is what made the question settleable slowly.

**And a real defect on `PlainDate` is now outside the contract's reach.** `add({ hours: 5 })` answers
the same day and loses five hours without saying so, which is `date/add@1`'s own frozen phrase — *a
plausible value that silently drops what the caller asked for*. The committed rule cannot see it,
because the rule is written over the **unit** and the phenomenon is over the **value**. Whether that
reopens the rule is a decision about what the contract settles, it is P3's neighbour rather than P3, and
**it is the owner's**. It is not taken here.

## Consequences

**The owner's sentence holds, on three carriers and on both modes of `Duration`, with no second
clause.** F2 has no instance over 520 pairs and F3 none over 19 bases, so *…or that the pair does not
permit* is not owed. The P3 question he answered is closed in the direction he answered it: `Duration`
is the same subject, and it stays.

**His counter-argument is refuted.** Q1 separates the other carriers from `Duration` exactly, and Q3 —
the predicate he set aside as being about reasons — is Q1 read observationally, so *the contract claims
the answer* does not shelter it. The heterogeneity he points to is real and sits on an axis that
separates nobody.

**The arity is three, and neither of us was right about it.** `PlainDate` applies all ten units and
leaves on posability; the matrix that said otherwise reads one value per unit, which is ADR-0224's
correction one axis over. Two engines agree.

**ADR-0216, ADR-0223 and ADR-0224 are corrected and none is rewritten.** All three publish `PlainDate`
as ignoring six time units in silence; it truncates them into whole days, and the count is nought.
ADR-0223's `PlainDate` row and ADR-0224's structural table inherit it. They are stamped, so the
correction is here.

**The case table is 40 rows** and both of ADR-0218's prices are unmoved.

**Nothing is repaired.** No contract is written, nothing under `contracts/` moved, none of ADR-0218's
three repairs was taken, `THE_PACKAGE_VERSION` stays at `1.2.0`, and `pnpm freeze` is green on 3 guards
either side.

## What would reopen this

* **A carrier whose inert units act at a magnitude nobody tried.** `PlainTime`'s four date units are
  inert to 10⁹ and are inert by construction — every date unit is a whole number of days and a day is a
  whole number of turns of the clock — but that is an argument and the sweep is a sweep. One that moved
  would take `PlainTime` out on posability the way `PlainDate` went, and the arity would be two.
* **The owner reopening the rule over the value rather than the unit.** The `PlainDate` defect is real
  and the committed rule cannot see it. A first member spelled *a duration the carrier cannot carry
  exactly* readmits `PlainDate` and changes what the contract settles; it is named here and not taken.
* **A third engine, or a stage-4 erratum.** Every figure is Chrome 152's, controlled on V8 13.6 for the
  `PlainDate` reading alone and not for the rest.
* **A `Duration` on which a calendar unit applies**, unchanged from ADR-0224: the mode predictor is 19
  bases and not a proof.
* **`PlainMonthDay` gaining an `add`**, unchanged from ADR-0223.

## More Information

### Where the probes live

Outside this repository, on stage rule 5, alongside ADR-0215's, ADR-0216's, ADR-0223's and ADR-0224's.

### Coordinates

The criterion, the five falsifiers, the exemption, the predicates, the prediction and the protocol are
committed at **`0c0f8c0`**, before the probe was written. Everything below them was measured after it,
on **2026-09-05**, against the tree at that commit: Chrome **152.0.7977.77** headless, reduced user
agent `HeadlessChrome/152.0.0.0`, no flag, host zone `Europe/Paris`, the draft guard passing. The
second-engine control is node **v24.15.0**, V8 **13.6.233.17**, under `--harmony-temporal`, and it
covers the `PlainDate` reading only.

Nothing inside the tree was edited to take any of it, and `git status --porcelain` was empty across
every probe. `node packages/registry/print-ledger.ts` hashes to
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, which is what ADR-0218 and ADR-0223
recorded, so no published binding moved; `pnpm freeze` is green on 3 guards either side and `pnpm meta`
is 143 of 143 on the clean tree.

### Why `confirmed-by` is empty

For ADR-0223's reason and ADR-0224's, unchanged.
