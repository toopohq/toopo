---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A carrier enters where the question can be asked of it, and this tree carries two different fives

> **What `inapplicable` means in the rule below is settled by
> [ADR-0224](0224-the-inapplicable-set-is-quantified-over-a-carriers-values-and-one-row-of-seven-needs-two-bases.md),
> and two things here are corrected without being rewritten.** It is behaviour quantified over a
> carrier's values rather than over one base or over its components, so **the arity is four and
> unchanged** — measured against a failing direction, `years`, `months` and `weeks` applying to **0 of
> 11** `Duration` bases. What moves is that **`Duration`'s row is bimodal**: a receiver whose largest
> unit is a calendar unit refuses all ten, `nanoseconds` included, where one whose largest unit is
> `days` or smaller refuses three. The matrix below reads one base per carrier — the method ADR-0216
> established — so its `Duration` row is one of two modes. **The case table figure of 40 rows is
> corrected to 50** for the same reason. Both prices are unmoved.

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

### What the measurement returned

**The engine and the guard.** The installed build is **152.0.7977.77**; the reduced user agent reports
`Chrome/152.0.0.0`, and both are written because neither alone identifies what ran. Host zone
`Europe/Paris`, which is ADR-0216's. The draft guard **passed**: the namespace is exactly the nine and
`TimeZone` and `Calendar` are both `undefined`.

**The population is seven of nine, enumerated.** `Now` and `PlainMonthDay` carry no `add` — the first
because it is a namespace rather than a constructor, the second as ADR-0220 measured.

**The matrix reproduces ADR-0216 row for row, seven rows of seven**, so the engine is the control it
was meant to be and nothing below rests on a reading somebody transcribed:

| carrier | applied | ignored in silence | refused | **inapplicable** |
| --- | --- | --- | --- | --- |
| `PlainDate` | 4 | 6 | 0 | **6** |
| `PlainTime` | 6 | 4 | 0 | **4** |
| `PlainDateTime` | 10 | 0 | 0 | **0** |
| `PlainYearMonth` | 2 | 0 | 8 | **8** |
| `Instant` | 6 | 0 | 4 | **4** |
| `ZonedDateTime` | 10 | 0 | 0 | **0** |
| `Duration` | 7 | 0 | 3 | **3** |

**The first decision is uniform on all seven** — an unknown key beside a valid one is dropped in
silence everywhere, measured rather than assumed, which is what refuses outcome D on a reading instead
of on an assertion.

### R13, and what it does to the arity

Zone `America/New_York`, transition confirmed in the same reading: `-05:00` at
`2026-03-08T06:59:00Z` and `-04:00` at `07:01:00Z`.

* **`ZonedDateTime`** — `{ days: 1 }` moves the instant by **23 hours** and `{ hours: 24 }` by 24. The
  two bags part. Its answer follows the zone.
* **`PlainDateTime`** — both bags answer `2026-03-08T12:00:00`. They agree. Its answer does not.
* **`Instant`** — refuses `{ days: 1 }` and applies `{ hours: 24 }` as **exactly** 24 × 3 600 × 10⁹
  nanoseconds, asserted on the epoch rather than on the rendering.
* **One carrier of seven exposes a `timeZoneId`**, and it is `ZonedDateTime`.

**So `Instant` is zone-free for `add`, and ADR-0220's classification of it is refuted with a positive
control in the same reading** — the control being that the carrier the sentence pairs it with parts by
exactly one hour on the same transition, so the probe can tell the two apart and did.

**And R13 turns out not to be load-bearing for the arity at all.** The only carrier whose answer
follows the runtime is the one that applies all ten units, so it is already out on the first member of
the rule before the second is reached. On this population **posability implies zone-freeness**, the two
conditions are not independent, and R13 removes nobody. That is the structural reason the two later
records diverged when each read ADR-0216's R13 clause as though it were the arity: **it is a rebuttal
and not an enumeration.** Six of the seven carriers are zone-free; the clause names four.

### R12, read per carrier for the first time

`date/add@1` is frozen. Its `identity.inputDomain` opens *Absolute instants, shifted by durations
written in whole units*, its declared signature is `(date: Date, duration: Duration) => Date | null`,
and its own `Duration` type declares **eight** units — years, months, weeks, days, hours, minutes,
seconds, milliseconds — every one of which it applies, in UTC, with clamping.

**`Temporal.Instant` refuses four units, and all four are units `date/add@1` declares and applies.**
So the two would settle one question — *what does adding a duration to an absolute instant do* — on one
domain, in opposite directions, both frozen. That is not prose held against prose: it is an
intersection of unit sets over a domain the frozen field names in its first two words.

**It fires on exactly one of the five, and the discriminator is that first phrase.** A `PlainDate` is
not an absolute instant, nor is a `PlainTime`, a `PlainYearMonth` or a `Duration`; a `Temporal.Instant`
is. And the frozen sentence reserves the neighbour it does *not* take — *calendar arithmetic in a named
zone is a separate, later contract* — which is `ZonedDateTime`, already out. Nothing reserves a second
absolute-instant contract, because `date/add@1` is one.

### The arity, carrier by carrier

| carrier | inapplicable units — the question | R13 | R12 | verdict |
| --- | --- | --- | --- | --- |
| `PlainDate` | **6**, every time unit, swallowed | zone-free | no overlap | **in** |
| `PlainTime` | **4**, every date unit, swallowed | zone-free | no overlap | **in** |
| `PlainYearMonth` | **8**, refused | zone-free | no overlap | **in** |
| `Duration` | **3**, refused | zone-free | no overlap | **in** |
| `Instant` | **4**, refused | zone-free | **fires** | out |
| `PlainDateTime` | **0** — the question cannot be asked | zone-free | — | out |
| `ZonedDateTime` | **0** — the question cannot be asked | follows the zone | — | out |

**Outcome A. The arity is four, and the prediction held.** Two carriers swallow and two refuse, so the
contradiction the contract would publish lives entirely inside the retained set, and the two that agree
with the answer the contract would give are in it — which is the clause ADR-0150's forty-three rows
required and which the refused narrow rule would have dropped.

**The four are ADR-0216's four**, and that is a coincidence worth naming rather than a confirmation:
that clause reaches them by asserting zone-freeness, which is true of six, and it omits `Instant` for a
reason it does not give. **Its membership is right and its stated ground does not produce it.**

### What the arity does to the generic, and to the third price

Measured on `parametersOf`, which is what the site really reads:

| declared signature | what `parametersOf` returns |
| --- | --- |
| `<T extends PlainDate \| PlainTime \| PlainYearMonth \| Duration>(carrier: T, duration: Duration) => T \| null` | `carrier: T`, `duration: Duration` |
| the same with `Instant` added to the bound | **identical** |
| `(carrier: PlainDate, duration: Duration) => PlainDate \| null` | `carrier: PlainDate`, `duration: Duration` |
| the union spelled at the parameter | `carrier: PlainDate \| PlainTime \| PlainYearMonth \| Duration` |

**The arity is invisible to that seam.** Four and five read identically, because the parameter's
declared type is the type parameter's *name*. So `AS_AN_ARGUMENT` gains **one** key and not four —
and ADR-0218's *the choice has as many members as the arity* is right about the field and wrong about
the table. What the arity sizes is the number of options inside one field, which a reader picks from,
and not the number of rows the site must learn.

**Two things fall out of the same reading and neither was looked for.** `Duration` is **already** a key
of `AS_AN_ARGUMENT`, declared for `date/add@1`, so the second parameter of the retained form is
buildable today. And the key the first parameter would need is `T` — **a type parameter's name, which
is not a type**, so the table would hold an entry that any contract naming its type parameter `T` would
collide with. That is a property of a table keyed by declared type text, and whoever pays item 3 meets
it before they meet the choice.

**The case table is inside the precedent.** Four carriers over ten units is **40 rows** for the second
decision — **21 where the unit is inapplicable and 19 where it applies** — against `date/add@1`'s 43
and `object/deep-equal@1`'s 58 in ten groups.

### The first price, sized

**The multiplier is one, and it is measured rather than argued.** One encoding shape — the carrier's
type name beside its ISO rendering — is **lossless on seven carriers of seven**, and the spelling it
produces **evaluates back to the same rendering on seven of seven**, which is the half `literal.ts`
needs and which ADR-0219's round trip did not test. So a kind is per *encoding shape* and not per
type, exactly as `instant` is one kind for `Date`, and **the arity does not enter item 1 at all**.
ADR-0220's *one kind, four or five* is answered: one.

**What one kind costs was derived from the compiler rather than counted by hand, and the two disagree.**
A throwaway arm was added to `EncodedValue`, both projects typechecked, and the arm was removed by a
counter-edit with `git status --porcelain` empty either side:

* **`packages/registry` typechecks clean.** The encode recogniser, `everyValueIn`'s walk and `decode`'s
  switch are all **silent**: `decode` returns `unknown`, so a missing arm returns `undefined` and is
  assignable; `everyValueIn` is a generator, so a missing arm yields nothing.
* **`packages/site` names two sites** — `literal.ts:209`, whose `literal` returns `string` so a missing
  arm is `TS2366`, and `read-literal.test.ts:314`, whose `EVERY_ARM` is
  `Readonly<Record<EncodedValue['kind'], unknown>>` and is `TS2741` until a sample exists. That second
  one is deliberate and its own comment says so.

**So one kind is five sites, of which the compiler names two — and the three it does not name are the
three that carry the round trip.** A kind added by following the compiler alone encodes, decodes to
`undefined` and is invisible to the walk, with the page rendering correctly throughout. `hasASpelling`
and `read-literal.ts` cost nothing, both being derived from `WITHOUT_A_SPELLING` rather than listing
the kinds again.

## Consequences

**The arity is four**, and item 1 of ADR-0218's price is **one kind at five sites, two of them
compiler-held** — which is the figure ADR-0220 said could not be produced until the arity was fixed.
Item 3 is one key, one choice of four, and a collision the table's own shape creates.

**Two records are corrected and neither is rewritten.** ADR-0219's five and ADR-0220's five are
different sets, each right about its own condition and neither the arity; ADR-0220's classification of
`Instant` is refuted; and ADR-0216's R13 clause is a rebuttal whose membership is right and whose
stated ground does not produce it. All three are stamped, so the correction is here.

**`Instant` is out on R12 and not on R13**, which is the first time any of the twelve grounds has been
read one carrier at a time. ADR-0216 judged R12 over the candidate as a whole and called it *Weak*; per
carrier it is not weak, and the difference is the whole of what this record adds to that one.

**Nothing is repaired.** No contract is written, nothing under `contracts/` moved, none of ADR-0218's
three repairs was taken, `THE_PACKAGE_VERSION` stays at `1.2.0`, `npm run freeze` is green on three
guards either side and the ledger is byte-identical at `18cc4e82…`.

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

The rule, the four outcomes, the prediction and the protocol are committed at **`d7f4e56`**, before the
probe was written. Everything below them was measured after it, on **2026-09-05**, against the tree at
that commit: Chrome **152.0.7977.77** headless, reduced user agent `Chrome/152.0.0.0`, no flag, host
zone `Europe/Paris`, the draft guard passing. `parametersOf` and the compiler readings are node
v24.15.0, Windows.

The one edit inside the tree — a throwaway arm on `EncodedValue`, to derive what a kind costs — was
reverted by a counter-edit, and `git status --porcelain` is empty either side.
`node packages/registry/print-ledger.ts` hashes to
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` across the whole unit, which is what
ADR-0218 recorded, and `npm run freeze` is green on 3 guards.

### What the reading does not reach

**The R13 verdict rests on two readings and not on one sweep.** The DST test discriminates only the two
carriers on which both bags apply; for the other five the matrix has already answered, one bag being
ignored or refused, and what stands in its place is that none of them exposes a `timeZoneId`. **No
tzdata version was varied here**, which is the reading ADR-0215 took and this one did not, so what is
established is that no zone enters these operations rather than that two zone databases agree about
them.

**And the R12 half is a reading.** It is sharper than prose held against prose — an intersection of
declared unit sets over a domain a frozen field names — but the step from *the same question on the
same domain* to *a collision* is a judgement about what a frozen contract's subject is, and the bias
towards taking it was declared above before the count.

### Why `confirmed-by` is empty

For ADR-0215's reason and ADR-0216's, unchanged: nothing here reads a record's reasoning, and a
search's conclusion is prose about a population outside this repository. Declared rather than left
blank, on ADR-0186's rule for the neighbouring field.
