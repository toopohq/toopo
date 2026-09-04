---
status: accepted
date: 2026-09-04
governs:
  - CLAUDE.md
confirmed-by: []
---

# No form over values this catalogue already spells is the retained form

> **This record writes no contract, opens no `value.ts`, and moves no digest.** It answers the
> reopening trigger ADR-0218 left — *a carrier this catalogue can already spell* — and answers it
> negatively. Measured at `58ab1a8` on node v24.15.0 and Chrome 152, the same engine ADR-0216's matrix
> was taken on.

## Context and Problem Statement

ADR-0218 measured that the format carries a generic and that what refuses the retained form is an
unmodelled parameter type, priced in three items whose first is `value.ts` gaining a kind for a
carrier that keeps its state in internal slots. That first item is the encoder whose output the freeze
fixes, and it is the owner's to rule on.

The order was then chosen deliberately and it is the motif of the two units before this one: **measure
the cheap thing that can make the expensive one unnecessary.** Opening `value.ts` and discovering
afterwards that it was not needed would be the worst available order.

**The constraint that decides whether the answer counts was fixed before the measurement**: a form
chosen because it is cheap is not the same function. Establishing that a carrier can be written as an
ISO string is not enough — the transposed form has to settle *the same disagreement*, and a string is
exactly where a disagreement can dissolve without anybody seeing it, because the carrier becomes
implicit in it.

## Decision Drivers

* ADR-0216's residue is three decisions, and all three are the language's own. A transposition that
  adds a decision only our API poses is the question being adjusted to the machinery.
* ADR-0217 narrowed three shapes to one: a polymorphic `add` over the zone-free carriers, whose
  return type follows its argument.
* Measurement on the same cases, never an argument about them.

## Decision Outcome

**No form expressible over values this catalogue already spells is the retained form.** One
transposition dissolves the disagreement and is refused on measurement; the other preserves it exactly
and is not the same function. `value.ts` is therefore back on the table, and the cheap measurement did
not make the expensive one unnecessary — which is the outcome this ordering exists to be able to
report.

### What `value.ts` spells, and the precedent read the right way round

Nineteen subjects, fifteen distinct kinds reached, **thirteen spelled and two not** — `instance` and
`not-data`. The union declares further arms this reading did not reach (`number`, `opaque`, `again`,
`hole`), so the figure is a reading of the kinds a case is likely to carry rather than of the type.

`date/add@1` was put forward as the precedent, on the ground that it takes a `Date` and a `Date` is a
carrier with internal state. **The precedent is real and it points the other way.** A `Date` keeps its
data in an internal slot exactly as a Temporal carrier does, and it is spelled `new Date(1768435200000)`
**because `value.ts` models it as a kind of its own**, `instant`. Measured beside it, a class whose
state is a private field encodes to `{"kind":"instance","className":"…","fields":[]}` and spells
`<an instance of …>`.

So what `date/add@1` establishes is not that this catalogue spells carriers. It is that **a carrier is
spelled by being given its own kind**, which is item 1 of ADR-0218's price and the thing this unit was
forbidden to do. The precedent argues *for* the expensive repair rather than around it.

### The only route, and the two shapes it has

With `instance` unspelled, the carrier cannot be the carrier. The only values left that could denote
one are a **string** and a **record**, both spelled, which gives two shapes:

* **A** — `(carrier: string, duration: Bag) => string | null`, the carrier inferred from the shape of
  the ISO string.
* **C** — `(carrier: string, as: CarrierName, duration: Bag) => string | null`, the carrier named as
  data.

### A dissolves the disagreement, measured

An ISO string does not determine its carrier. Measured on Chrome 152:

| string | carriers that accept it |
| --- | --- |
| `2026-01-15` | **3** — `PlainDate`, `PlainDateTime`, `PlainYearMonth` |
| `2026-01-15T12:30:00` | **4** |
| `2026-01-15T12:30:00-05:00[America/New_York]` | **6** |
| `12:30:00`, `2026-01`, `…Z`, `P1D` | 1 each |

**The ambiguity lands on the row the contract exists to publish.** ADR-0216's split is
`PlainDate.add({hours: 5})` answering the input unchanged against `PlainYearMonth.add({hours: 5})`
throwing — and a bare `2026-01-15` is accepted by both.

Driven on ADR-0216's own five rows, with two honest parsers differing only in which carrier they try
first:

| row | the retained form | parser, date first | parser, year-month first |
| --- | --- | --- | --- |
| `PlainDate` + `{hours: 5}` | **ignored** | ignored | **refused** |
| `PlainTime` + `{days: 1}` | ignored | ignored | ignored |
| `PlainYearMonth` + `{hours: 5}` | refused | refused | refused |
| `Instant` + `{days: 1}` | refused | refused | refused |
| `Duration` + `{years: 1}` | refused | refused | refused |

**Two honest implementations of one contract disagree with each other on the row the contract is
for**, and nothing in the language separates them: whichever order is chosen, the contract publishes
one of the two answers as *the* answer and the split disappears.

**And the question it would have to settle instead is one nobody asks.** `Temporal.from` does not
exist — measured, the namespace holds `Now` and eight named carriers and no inferring entry point, so
every `from` is reached through a carrier the caller has already chosen. A string-carrier contract
would invent *what does a bare `2026-01-15` denote?*, answer it silently, and thereby answer the
question it was written for without ever asking it.

A is refused.

### C preserves the disagreement and is not the same function

Measured on the same five rows, C reproduces the retained form exactly — ignored, ignored, refused,
refused, refused. The round trip is **lossless on seven carriers of seven**, `from(s).toString() === s`
for each. ADR-0215's unknown-key decision survives it. So C is available, in values already spelled,
and it settles the disagreement it was tested against.

**It is refused on identity, and on this repository's own criterion rather than on taste.**

1. **It is not generic.** The return type is `string` for every carrier, so the promise ADR-0217
   narrowed to — a return that follows its argument — is not what would be published. The two units
   spent on whether the format carries a generic would be answering about a contract nobody wrote.
2. **It adds a decision the language does not pose.** ADR-0216 was careful that all three residue
   decisions are Temporal's own. C has a fourth that is ours alone: what to do when `as` names no
   carrier. Growing the residue with a decision invented by the transposition is the question being
   fitted to the machinery, which is what this repository refuses everywhere else.
3. **Its caller is a different person.** `PlainDate.add({hours: 5})` is asked by somebody holding a
   `PlainDate`; they will not serialise it and retype its type name in order to add to it. C's caller
   holds a string, and for them the live problem is parsing. That is ADR-0158's criterion — nobody
   types the phrase that reaches it — arriving on a shape rather than on a name.

The disagreement does not weaken under C. What fails is the other half of the constraint, and it fails
plainly enough to say so.

## What would reopen this

* **A carrier gaining a kind in `value.ts`.** That is item 1 of ADR-0218's price and the only route
  this record leaves standing. It is the owner's ruling, not this unit's, and nothing here should be
  read as pre-empting it.
* **A reading that shows C's fourth decision is not new.** The refusal above rests on `Temporal.from`
  being absent and on every carrier being reached by name. A language API that dispatches on a carrier
  name would put C's extra decision back inside the language and reopen point 2.
* **A retained form over fewer carriers.** The ambiguity measured here is between `PlainDate`,
  `PlainDateTime` and `PlainYearMonth`. A contract narrowed to carriers whose ISO strings are mutually
  exclusive would not meet it — and whether such a narrowing is still the function ADR-0217 kept is
  exactly the question this record refused to answer by convenience.
* **Temporal on the matrix.** Everything above is Chrome's. `Temporal` is `undefined` on node
  v24.15.0, so no form of this contract is exercisable by this repository's suites today, and ADR-0150
  holds that debt.

## More Information

Measured at `58ab1a8`. The engine is Chrome 152; its user-agent string is reduced to `152.0.0.0`, so
the build is not quoted here the way ADR-0216 quotes its own. The catalogue side was measured on node
v24.15.0 with throwaway probes outside the tree.

`git status --porcelain` is empty across the unit, `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing
under `contracts/` moved, and `value.ts` was read and not edited.
