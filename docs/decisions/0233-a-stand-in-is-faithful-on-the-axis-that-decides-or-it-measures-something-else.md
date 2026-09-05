---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A stand-in is faithful on the axis that decides, or it measures something else

## Context and Problem Statement

ADR-0232 concluded that ADR-0218 is wrong about how a Temporal carrier fails — an instance holding
nothing, where the truth is a refusal by name — and **posted no note on it**. That is ADR-0226's class
arriving on a report for the fourth time in this thread, and this time on the measurement that founded
the price just paid.

**The owner found the reason the figure was wrong, and it is worth more than the figure.** ADR-0218's
stand-in was an ordinary class called `InternalState`. It reproduced the property that record was
reasoning about — a value with no own fields — and not the property that decides which arm the encoder
takes.

He asked, in the same breath, whether the double ADR-0232 paid the first price with escapes the same
reproach.

## Decision Drivers

* **The correction is one line; the mechanism is the unit.** A stand-in that is faithful on the studied
  property and wrong on the deciding one produces a red that looks right, and no reading of the result
  can tell.
* **A question put to my own work is answered by measurement, not by assertion.** The owner is entitled
  to a reading of ADR-0232's double against the same test, and to hear it if it fails.
* **Two closed units beat one wide one.** He said so and gave the escape: post the note, cost item 2,
  stop.

## Considered Options

* **Correct ADR-0218's block and move on.** Refused: the block is a symptom and the stand-in is the
  cause.
* **Take item 2 in the same unit.** Refused on the costing below, which found a structure item 1 did not
  have.
* **Post the note, name the mechanism, re-cost item 2, stop.** Retained.

## Decision Outcome

### The two stand-ins, measured side by side

Both against the encoder, in one process:

| stand-in | tag | own keys | `encode` renders |
| --- | --- | --- | --- |
| ADR-0218's, an ordinary class | `[object Object]` | `[]` | `{"kind":"instance","className":"InternalState","fields":[]}` |
| ADR-0232's, the tag on a prototype | `[object Temporal.PlainTime]` | `[]` | `{"kind":"temporal","typeName":"Temporal.PlainTime","rendered":"12:30:00"}` |

**They agree on the axis under study and part on the axis that routes.** ADR-0218's block is exactly
what its stand-in encodes to — the record measured correctly and measured the wrong thing.

**The distance is the sharpest way to say it.** At `7c1cf96`, the tree that record was written against,
`unmodelled` refuses at line **567** and the instance arm is at line **716**: a real carrier is thrown
out **149 lines** before the arm whose output was published as its own. (The owner read 124; the figure
at that commit is 149, and 158 on the tree today — it moves with the file, which is why it carries its
commit.)

### The mechanism, stated as a rule

> **A stand-in is faithful on the axis that decides the path, or it measures something else.**

`encodeAt` routes by `typeof`, by `Array.isArray`, by `instanceof` against five built-ins, and by the
tag. A carrier answers *no* to every one but the last, **so the tag alone decides**. A stand-in
reproducing *no own fields* reproduces the thing being reasoned about and leaves the routing to
whatever its own construction happens to give — and an ordinary class gives `[object Object]`, which
routes somewhere else entirely.

**What makes it hard to catch is that the red looks right.** A double missing the tag fails with
`'instance'` where `'temporal'` was expected — a red naming the guard, the arm and the expectation,
carrying no sign at all that the value never travelled the road under test.

### Does ADR-0232's double escape it? Measured, and yes — with one thing that is luck rather than method

**Yes, and the evidence is the red rather than the design.** The five guards were first seen failing
with `UnencodableValue: probe holds a Temporal.PlainTime, which the registry does not model` — **the
refusal a real carrier meets, at the point it meets it**. A double that had missed the tag could not
have produced that message. So the double reached the same decision point, which is what the reproach
is about.

**And the axes were read before the double was written, which is the method half.** The probe against
Chrome 152 asked `PlainTime`, `PlainYearMonth` and `Duration` for exactly what `encodeAt` reads: the
tag, `Object.keys`, `instanceof` against `Date`, `Map`, `Set`, `RegExp` and `Error`, `Array.isArray`,
and whether the prototype is `Object.prototype`. The double reproduces all of them. **ADR-0218's
stand-in was written from an idea of the shape; this one was written from a reading of it.**

**What is luck and is said rather than smoothed**: `Object.create({...})` gives a prototype that is not
`Object.prototype` because that is how `Object.create` works, not because the double was built for it.
It matches a real carrier there, and it would have matched by accident if the reading had not been
taken. One axis of five is faithful for a reason nobody chose.

**And the reproach that does still apply**, unchanged from ADR-0232's own note: the double proves
nothing about a real carrier *presenting* that tag, nor about `Temporal.<name>.from(rendered)` returning
the value. Both are measured on Chrome 152 and exercised by nothing that runs here. The difference is
that these are declared limits of what the double reaches, where ADR-0218's was an undeclared limit of
what it *was*.

### Item 2, re-costed — and it has a structure item 1 did not

**The mechanical part is small.** `read-literal.ts` is 626 lines carrying one reader per form —
`readDate`, `readMap`, `readError`, `readBox`, `readTypedArray`, `readObjectCall`, `readAssign`,
`readSymbol`. A `readCarrier` for `Temporal.PlainTime.from('12:30:00')` is `readDate`'s shape: a reader
of about ten lines and one line in `readTerm`. `literal.ts` loses its `WITHOUT_A_SPELLING` entry and
gains the composed spelling, which ADR-0232 already wrote once and withdrew.

**The part that is not small is that the reader has to build a value.** `readDate` ends in
`new Date(epoch)`; `readCarrier` would have to end in `Temporal[name].from(rendered)`, and **`Temporal`
is `undefined` on both runtimes this repository runs**. Item 1 never met this: an encoder *reads* a
value somebody else built, so a double sufficed. A reader *constructs* one, and there is nothing to
construct.

**`read-literal.ts` is a browser module** — it is in `THE_BROWSER_GRAPH`, at `browser.ts:118` — so it
runs where a reader's browser may well carry `Temporal`, while the guards run on node where nothing
does. **So item 2's cost is not lines; it is a decision about what the reader does where the namespace
is absent**, and the three ways out are not equivalent:

* **Reach for the namespace and let it throw.** Honest, and the guard can only exercise the refusal.
* **Return a double where the namespace is missing.** Two behaviours by runtime, which is close to what
  permanent rule 1 refuses and would put a value in a contract's hands that the contract cannot use.
* **Wait for a runtime.** Which is the fourth thing ADR-0218 named and did not price.

**That is the owner's, and it is why this record stops rather than paying.** Item 2 is not a bigger item
1; it is the first of the three whose cost is a rule about the product rather than an edit.

## Consequences

**ADR-0218 carries a head note**, naming the block as true of its stand-in and false of its subject,
with the mechanism and the 149 lines.

**The mechanism is written down as a rule**: a stand-in is faithful on the axis that decides, or it
measures something else — and the tell is that the red looks right.

**ADR-0232's double is measured against that rule and holds**, on the strength of the red it was first
seen on, with one axis credited to `Object.create` rather than to method and the remaining limits
unchanged. Its note now carries this rather than only the limits.

**Item 2 is re-costed and not taken**: small in lines, and blocked on a decision about what a reader
does where `Temporal` is absent — a shape item 1 did not have because an encoder reads where a reader
builds.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/` moved, no
digest moved, `engines`, `suites.yml` and the contributor floor are unchanged, and
`THE_PACKAGE_VERSION` stays at `1.2.0`.

## What would reopen this

* **A third stand-in of this shape.** Two is a pattern named; a third would say the rule needs a
  mechanism rather than a sentence, and there is none in sight — no check can know which axis decides a
  path it is not reading.
* **A runtime carrying `Temporal` on the matrix**, which collapses item 2's three ways out into one and
  deletes both doubles.
* **The owner ruling on what the reader does without the namespace**, which is what item 2 is waiting
  for rather than a unit of work.
* **An axis of `encodeAt` this reading missed.** Five were read — `typeof`, `Array.isArray`, five
  `instanceof`, the prototype, the tag — and a sixth would put ADR-0232's double back under the same
  question it just answered.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `71c85d6`, node v24.15.0, Windows. The two stand-ins were
encoded in one process by importing `packages/registry/value.ts` directly. The line distances are `git
show <sha>:packages/registry/value.ts` at `7c1cf96` and at `d1983b3`, reading the refusal and the
instance arm. The carrier axes are Chrome **152.0.7977.77** headless, the reading ADR-0232 took.

Nothing outside `docs/decisions/`, `packages/registry/round-trip.test.ts` and `CLAUDE.md` was edited,
and the test file's change is prose.

### Why `confirmed-by` is empty

The subject is what a stand-in is faithful to, which no guard of this repository can ask — the rule's
own reopening clause says why.
