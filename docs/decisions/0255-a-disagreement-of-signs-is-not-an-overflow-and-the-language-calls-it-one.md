---
status: accepted
date: 2026-09-08
governs:
  - contracts/typescript/temporal/add/contract.ts
  - contracts/typescript/temporal/add/reference.ts
  - contracts/typescript/temporal/add/edge-cases.ts
confirmed-by: []
---

# A disagreement of signs is not an overflow, and the language calls it one

## Context and Problem Statement

ADR-0253 built a leg on a runtime carrying `Temporal` and, with it, executed `temporal/add@1`'s six
properties for the first time on any engine. One failed. `p5-a-unit-the-carrier-does-not-apply-is-refused`
was handed a bag whose counts disagreed in sign — a value no `Temporal.Duration` can represent — and
the reference answered `out-of-range`, where the property expected the call to be answered.

That record named two decisions and left both to the owner: whether the generator should stop drawing
such a bag, and whether the reason should be `duration-not-read`. **The ruling took a third option
neither had named**: declare the case, do not shrink the generator, and give it its own reason.

**What the ruling exposes is not a wide `catch`.** `describeAddFailure` wraps `carrier.add` in a total
`catch` and reports the range, which reads like a net cast too far. It is not: measured on node
v24.15.0 under `--harmony-temporal`, `Temporal.PlainTime.from('12:30:00').add({hours: 1, seconds: -1})`
throws **`RangeError: Invalid time value`**, and so do `PlainYearMonth`, both `Duration` modes, and
`Temporal.Duration.from` on the same bag. So the language classes a disagreement of signs as a range
error, and an implementation that catches the arithmetic and reports what it caught **inherits the
language's own misnomer**. The reference was not careless about its `catch`; it believed the engine.

`contract.ts` is not published and is in no catalogue, so this is reachable at all — which is the
window ADR-0251's exclusion exists to hold open, arriving on the first thing it had to carry.

## Decision Drivers

* **A reason is worth publishing when the repair it names is a different repair.** ADR-0020 settles
  that the reason set is what makes a failure actionable, and this contract already has three
  repairs: remove the unit, fix the key, reduce the magnitude. A caller whose counts disagree makes a
  fourth — pick a sign — and no existing literal names it.
* **`duration-not-read`'s three arms are all about the bag's keys.** A value that is not an object,
  an object naming no unit, an object carrying a key that is not one. A mixed-sign bag's keys are
  impeccable and every count is a number; what it is not is *representable*.
* **A bag can trip two reasons at once and nothing said which one wins.** That hole predates this
  unit and this unit is what found it.
* **The generator must not shrink.** A property whose population is narrowed to the region it already
  passes on is the shape this repository refuses everywhere else.

## Considered Options

* Fold it into `duration-not-read` — the option ADR-0253 named.
* Leave it as `out-of-range` and narrow the property.
* A fourth literal, with the precedence between all four declared.

## Decision Outcome

**The fourth literal, `counts-of-two-signs`, and `failureReasons` becomes the precedence.**

### The order is derived and not chosen, and the language agrees with the derivation

The principle was already written in `describeAddFailure`'s own comment: a bag that cannot be read is
refused before any carrier is consulted, and the range is last because it is the only reason needing
the arithmetic to have been attempted. **The sign is a property of the bag alone**, so it belongs with
the first group; and it must come after `duration-not-read`, because reading a count is only defined
once the keys are known to be units. The order is therefore `duration-not-read`,
`counts-of-two-signs`, `unit-the-carrier-does-not-apply`, `out-of-range`.

**The language reads it the same way, and the control is what makes that a measurement.** On the draft
engine, `PlainTime.from('12:30:00').add({days: 1})` answers `12:30:00` — the day dropped in silence —
while `add({days: 1, seconds: -1})` **throws**. The only difference between the two calls is the sign,
and `days` is discarded either way, so the throw can only be the sign: the bag becomes a `Duration`
before the carrier is consulted. `Temporal.Duration.from({hours: 1, seconds: -1})` throwing with the
identical message says the same thing by a second path.

**The derivation decides and the reading confirms.** Were Chrome 152 to answer otherwise, the order
would stand on the principle and this record's second paragraph would be the one to correct.

### The precedence hole was older than the unit that found it

Before this change nothing in the contract said which reason a call tripping two of them gets.
`{years: 400000, days: 1}` on a `PlainYearMonth` trips the inapplicable unit and the range;
`{dayz: 9, days: 1}` on a `PlainTime` trips the unreadable key and the inapplicable unit. In both the
reference picks one and **the contract never promised that pick**, so a second conforming
implementation could answer the other on a call the forty-four-row table did not settle.

It is now a promise: the order of `failureReasons` is the order the reasons are tested in, which is
the same promise `describeAddFailure` already made about *which* unit it names. One declaration
carries it, because a second list of the same four literals is two places that can drift.

### The red before the green, three of three and each for its own reason

The table and the properties were written first and the reference left alone. On the draft engine,
**3 failed of 115**, and the three are the three that were aimed at:

| | what it answered |
| --- | --- |
| `a-bag-of-two-signs-described` | `out-of-range` — the inherited misnomer |
| `a-bag-of-two-signs-and-a-unit-the-carrier-drops-described` | `unit-the-carrier-does-not-apply`, `days` — the other reason a conforming implementation could give |
| `p7-a-bag-of-two-signs-is-refused-by-every-carrier` | refused after 1 test |

**`p5` was green in that run**, which is what says its precondition is exact rather than generous: the
mixed sign was its only failure and excluding it left nothing else red. With the sign check inserted,
**115 of 115, exit 0**.

### Seven properties and not six, and why the sign is not an arm of `p5`

`p5` claims what a *carrier* refuses. `p7` claims that a bag of two signs is refused **whatever
carrier it meets**, which is the property that makes one helper over three carriers give one answer to
one mistake — and it is the only thing that quantifies the precedence. The two have different failure
conditions: move the sign check after the carrier's and `p7` reddens with `p5` green throughout;
remove it and `p7` reddens with `out-of-range`. Folding them would have given one guard two claims,
which is the shape ADR-0246 found and named on two other guards.

**Neither half can go vacuous unnoticed**, and one of the two arguments is derivable rather than
measured: the generator always draws at least one unit and a one-unit bag cannot carry two signs, so
every one-unit draw is `p5`'s by construction. Measured over 1 000 draws at seed 1 the split is
**308 of two signs against 692 of one**, with 345 one-unit bags.

### Three rows and not one, and what the third is for

`a-bag-of-two-signs` settles the reason. `a-bag-of-two-signs-and-a-unit-the-carrier-drops` settles the
precedence, which no row of the matrix can. `a-zero-count-carries-no-sign` settles the boundary of the
rule: `{hours: 0, seconds: -1}` is the duration `-PT1S` and the call is **answered**, so the rule is
written over non-zero counts and an implementation reading the sign of every field it finds is refused
here. Measured: `-0` is a zero on that test as well, `Temporal.Duration.from({hours: -0, seconds: 1})`
answering `PT1S`.

### What is not measured, said rather than implied

**The three sign rows are read on the draft and the language's reading is owed**, which is this
contract's own `liftedBy` rule applied to itself. What makes them sound meanwhile is that the refusal
is `Temporal.Duration`'s own requirement that every non-zero field carry the sign of the whole — the
specification rather than an engine's behaviour — and that the draft was measured refusing the bag at
construction, so it never reaches a carrier. The one row a language reading could move is the
precedence row, and it would move the prose rather than the literal.

**No benchmark profile is added.** The sign path is a second refusal decided before the carrier, and
`not-a-duration-at-all`'s description said *the one path that does not depend on the carrier*, which
this change makes false; the sentence is repaired and the profile is not written, because whether the
two are worth timing apart is a decision this unit did not take. It is named in the description
rather than left to be rediscovered.

**No divergence row is added either.** `theDivergences` records the three answers the language gives
to *the unit question*, and `partsOn` is a list of units; a sign disagreement is about no unit and the
language is uniform about it. That uniformity is the argument for the literal and is written where the
literal is argued.

## Consequences

* The case table is **47 rows**, 40 of them the matrix. Sixteen applied answers and thirty-one
  refusals.
* The properties are **seven**. `p5` keeps its address and its claim.
* `failureReasons` is four literals and its order is load-bearing. `edge-cases.test.ts` sorts both
  sides of the partition guard, so nothing there reads the order — the promise is carried by the
  reference, the precedence row and `p7`.
* **The ledger is `18cc4e82…` at 1 206 bytes and `pnpm freeze` is 3 passed**, unmoved, because this
  contract is in no catalogue and mints no binding.
* All seven files typecheck against `ESNext.Temporal` out of band, exit 0.
* The contracts' own suite is untouched: the folder is excluded from both globs and from the
  typechecker's project, which is what ADR-0251 built.

## What would reopen this

* **A reading on the published language that disagrees with the draft on any of the three sign rows.**
  The sharpest is `PlainTime.from('12:30:00').add({days: 1, seconds: -1})`: if Chrome 152 answers
  `12:29:59` rather than throwing, then the language drops the inapplicable unit *before* reading the
  sign, the paragraph naming the language as agreeing with this order is wrong, and the order stands
  on its principle alone.
* **A carrier for which the sign is not decided before the unit.** The arity is three today; a fourth
  admitted by a later measurement would have to be read against this order rather than assumed into
  it.
* **A count that is neither positive nor negative reaching a caller.** `NaN` satisfies neither test
  and falls through to the range, which is where this implementation already sent it; if that is the
  wrong reason for it, it is a fifth literal and not a widening of this one.

## More Information

ADR-0253 is the leg, the execution and the two decisions this record answers. ADR-0225 is where
*an overflow is not an inapplicability* was measured and named, and this record is that distinction
holding a second time against a second collapse. ADR-0251 and ADR-0252 are the exclusion that makes
`contract.ts` editable at all, and ADR-0020 is the convention the reason set belongs to.
