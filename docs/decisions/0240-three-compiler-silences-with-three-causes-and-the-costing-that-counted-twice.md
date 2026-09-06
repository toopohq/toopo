---
status: accepted
date: 2026-09-06
governs:
  - packages/site/playground.ts
  - CLAUDE.md
confirmed-by: []
---

# Three compiler silences with three causes, and the costing that counted twice

## Context and Problem Statement

Three units in a row paid a price of ADR-0218 and each found a site the costing before it had not
named: `unmodelled` at price 1, `read-literal.ts` at price 2, `spelledFields` at price 3a. The
observation was written three times — ADR-0235, ADR-0239 and `CLAUDE.md` — and never instructed.

**The framing offered for it was that these are three instances of one class**: compiler-silent,
reader-visible, named by no list, found by sweeping wider than the announcement. This unit was asked to
contest that framing rather than repeat it, and it does: **three of its four clauses are false of at
least one of the three sites**, and the one clause that holds is true for three different reasons.

**Nothing is built here.** No guard is added or modified, no price of ADR-0218 is taken, the ledger
reads `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` on both sides, and the census
and the README figures are unmoved — which is what says no guard moved.

## Decision Drivers

* **A class whose members are silent for different reasons is not one class.** If the three silences
  have three causes, no single mechanism reaches them, and that is a finding rather than a gap.
* **A guard born without a witness is not a guard here.** The meta suite is injected into by no
  battery, and this repository has refused a guard there twice on that ground.
* **A repair that lands in the folder that found it makes the finding its own justification**, which
  is why a mechanism is costed here and taken nowhere.

## Considered Options

* **One class, three instances** — the framing under test.
* **Three classes with one word in common.**
* **A mechanism that names a consumer** — two candidates, both costed below.

## Decision Outcome

### 1. Not one class: the framing fails three of its four clauses

Each clause asked of each site, measured rather than recalled.

| | `unmodelled` | the reader, `read-literal.ts` | `spelledFields` |
| --- | --- | --- | --- |
| compiler-silent | yes | yes | yes |
| **reader-visible** | **no** | conditionally | yes |
| **named by no list** | yes | **no** | yes |
| **found by sweeping wider** | **no** | **no** | yes |

**Reader-visible is false of `unmodelled`.** `UnencodableValue` is thrown at `value.ts:604` and caught
**nowhere** outside a test — swept over `packages/`, three occurrences, all of them the declaration and
the throw. It stops the serialisation, so no page is written and no reader receives anything. Its own
comment says who it is for: *what a value of an unmodelled kind is called in the refusal, **so that a
reader knows what to add***, and that reader is whoever is adding a kind. The reader's refusal is
conditional — `start.ts:701` writes `answer.textContent = theWhatWentWrong(thrown)`, so it reaches a
reader who acts, on a runtime without `Temporal`. Only `spelledFields` is in the served bytes before
anybody acts.

**Named by no list is false of the reader**, and the record that says so is my own. ADR-0232's site
table reads, in its own column:

| **`unmodelled`** | **nobody** |
| **`read-literal.ts`** | **a guard** |

`every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` reddened the moment a spelling it could
not parse existed. **A mechanism did its job**, and folding that site in with the two nothing named is
the error this unit exists to correct.

**Found by sweeping wider is false of two of the three.** `unmodelled` was found by the *red message* of
a guard written before the change — ADR-0232: *only writing the guard could find it*. The reader was
found by that guard reddening. Only `spelledFields` was found by a sweep.

**So one clause of four survives, and the class of *named by nobody* has two members, not three.**

### 2. What the survivor shares is a word and not a cause

All three are compiler-silent, and each for a different reason.

* **`unmodelled` is upstream of the union.** It tests the *input's* tag and never mentions
  `EncodedValue`, so adding a member to that union cannot name it. A type system names the sites that
  mention the type that moved.
* **`read-literal.ts` is derived from a declaration.** It reads `WITHOUT_A_SPELLING` rather than listing
  the kinds, so a new kind flows through with no type error — ADR-0234's *derived, and not free*.
* **`spelledFields` is downstream of an index signature.** `AS_AN_ARGUMENT` is
  `Readonly<Record<string, Argument>>`, so adding a key changes no type anywhere at all.

**Three causes need three tools**, which is the whole of why §5 finds no mechanism.

**And a hypothesis of this unit's own was refuted by measuring it.** `spelledFields` casts its input —
`field.reads as { readonly because: string }` at `contract-page.ts:125` — and a cast is the obvious
candidate for what silences a site. It is not. Renaming `because` to `why` on the union that crosses
into the browser and typechecking `packages/site` names **`contract-page.ts(125,31)` first**:

    error TS2352: Conversion of type '… { readonly kind: "a-literal"; readonly why: string; }' to type
    '{ readonly because: string; }' may be a mistake because neither type sufficiently overlaps …

An assertion between types that do not overlap enough is refused, so the cast reports a *shape* change.
What it cannot report is a *new key*, and that is the index signature rather than the cast. The rename
was reverted and the tree is clean.

### 3. Five mechanisms, five structural blindnesses, and not one oversight

* **`Where this looked` blocks — structural, and this is the measurement that says so.** Swept over
  `CLAUDE.md`: **39 blocks carrying 25 (identifier, file) pairs, and 25 of 25 name a declaration.**
  Nought name a consumer. The block's grammar is *`X` in `Y`* where `Y` is where `X` is declared, so a
  reader of `X` cannot appear in one. ADR-0218's block named `AS_AN_ARGUMENT` — the declaration — and
  `spelledFields` is a consumer of that entry's own `because`. **The block was not careless; it was
  complete on its own population.**
  * The probe's pattern also matched ten places joining two identifiers with *and*, and those are
    excluded rather than counted: none is a missed pair.
  * **And the sweep found a live defect it was not looking for.** One of the 25,
    `Attributes` in `packages/site/document.ts`, resolves to nothing: `grep` finds no `Attributes` in
    that file, and `packages/site/tree.ts:39` declares it — ADR-0198's cut moved the node vocabulary
    and the block did not move with it. It is repaired here.
* **`confirmed-by` — structural.** `confirmationFaults` resolves a `(battery, guard)` pair against the
  guards a suite collects. Its vocabulary is guards; a site is not one, and `spelledFields` had none.
* **The census — structural.** `census.ts` declares how many guards each *test file* collects. A site
  with no guard contributes nothing and the count does not move. Its own header is explicit that what
  it exists for is a door that stays green, and this is not that door.
* **`predict` — structural, and it declares it.** Its three counts are a pin naming a guard that did
  not redden, a guard reddening where a battery declares silence, and a guard left silent that no
  declaration accounts for. All three range over guards. `prediction.ts`'s header: *exact for the drift
  of a declaration against a measurement already taken, and blind to what a cell that has not run would
  redden.*
* **The surface guard — structural, and measured before this unit.**
  `a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself` is total over a type the
  table does *not* hold, so a key the table holds meaning the wrong thing is outside its population by
  construction. ADR-0235.

**Not one of the five was blind by oversight**, and that is worth more than a longer list: nobody forgot
anything. Each mechanism has a vocabulary — a guard, a cell, a declaration — and a site reached by a
*value* is in none of them.

### 4. What found them is not one thing, and the method is a costing's second count

Three finders: a red message, a guard reddening, and a sweep. What is common is not a finder but an
act — **the paying unit re-derived the costing's site list instead of reading it off** — and the rate
says which act works.

| the costing | the site list it published | corrected by |
| --- | --- | --- |
| ADR-0223, items 1 and 2 | *five sites of which the compiler names two* | ADR-0232, which found eight and `unmodelled` among them; ADR-0234, which found *costs nothing* to be an arm and a whole guard category |
| ADR-0218's `Where this looked`, item 3 | three declarations | ADR-0235, which found `spelledFields` |
| **ADR-0235, item 3a** | **two counts** | **nothing — ADR-0239 corrects it nowhere** |

**Three of four costings were corrected, and the one that held is the one that counted twice.**
ADR-0235 states the rule in its own §3: *a site is a place that has to be read or written for one key
to be added honestly. It is counted twice, because the two counts answer different questions.* The first
count is *what must I edit*, which is the compiler's question and the one a costing naturally asks. The
second is *what does this change reach*. `spelledFields` appears only under the second.

**So the method has a name, it is `count the sites twice`, and it was written in one record and in none
of the rules.** That is what this unit moves.

**And the structural reason the other three were wrong is not carelessness either**: a costing is the
one unit that cannot check its own site list, because checking it means making the change, which is
what a costing exists to defer. The failure therefore has no event until somebody pays — and all three
were caught by the paying unit, so **not one of them reached a reader**. What the recurrence costs is a
figure wrong in the interval between costing and payment, never a defect shipped.

### 5. Two mechanisms, both costed, and neither survives

**M1 — a guard resolving the names a `Where this looked` block writes.** Population: 39 blocks, 25
pairs, 50 distinct bare files. One module, some fifty lines, no new dependency, and **it would be red on
its first run** — `Attributes` is stale today — which is the rare shape this repository names, a guard
that is not born green. **Refused on the witness**: it belongs beside `mutation/decisions.ts`, which is
the meta suite, which no battery injects into, so nothing could ever redden it. That is the **third**
time this repository refuses a meta-suite guard and the third time on the witness rather than on the
capture rate — and here the rate is not the objection, because a name resolves or it does not, 25 of 25
mechanically.

**M2 — a command naming the consumers of a declaration.** **Measured dead before it was priced**:
`AS_AN_ARGUMENT` occurs in three sources — `playground.ts`, its own test, and `site.battery.ts` — and
`contract-page.ts` **never mentions it**. A walk keyed on the name returns the declaration and nothing
else, and would have missed `spelledFields` exactly as the block did, because the site is reached by a
*value* crossing two modules and a JSON serialisation rather than by a name. What would reach it is a
property-level reference search, which is buildable — `typescript` is already a runtime dependency and
`packages/validation/typescript-api.ts` is the one door onto it. **It is refused on the question rather
than the price**: it needs a name to start from, and at price 3 that name would have had to be
`because`, which only somebody who has already done the sweep would choose. And it would join
`npm run hands` as a second reading nothing executes, which is an entry of the open list already.

**So: no mechanism, and that is the conclusion rather than a failure.** What is cheap and is done
instead is the convention — ADR-0235's rule moved out of one record and into the verification
discipline, where somebody costing a change arrives.

### 6. The counts of `playground.ts`, treated rather than left — and there are four

Measured at `50ff990`, the commit that wrote the header, and at HEAD, by counting entries rather than
matching lines: a first reading of *how many entries carry `the-text-itself`* answered six, because
`grep -c` counts the type declaration too.

| the header's claim | at `50ff990` | at HEAD | verdict |
| --- | --- | --- | --- |
| *the two types reading it* | 3 | 3 | **false the day it was written**, unmoved since |
| *Four types* | 4 | **6** | true then, drifted |
| *two `build`s that are not the identity* | **1** | **1** | **false the day it was written**, unmoved since |
| *what two of the four spell* | 2 of 4 | 2 of **6** | the *two* holds, the *four* drifted |

**Four claims, three false — where two records said three.** Neither ADR-0235 nor ADR-0239 named the
`build`s, so the count of false counts was itself wrong, in the two records whose subject was that
counts go wrong. And the taxonomy the open list separates lives **inside one sentence**: *Four types*
drifted, which is its rules 1 and 2; *two `build`s that are not the identity* was false from the first
keystroke, which is its rule 3 — one line of prose, two failures, indistinguishable to a reader.

**They are treated here and the reason each earlier refusal lapses is stated.** ADR-0235 left them
because it was forbidden that file and because a correction landing inside a costing makes the costing
unreadable; ADR-0239 left them because a count corrected inside the unit that changes what it counts is
a correction nobody can check. **Neither reason survives**: this unit is neither costing nor paying item
3, and it moves nothing the counts count. Applied by the rule ADR-0195 named and did not write — *a
count in a present-tense sentence is deleted where the argument survives its removal* — all three false
counts are **deleted** rather than restated, and the sentence that named a real pair keeps it by
**naming rather than counting**: *what `string` and `Date` spell*.

## Consequences

* **The recurrence is one class of two and not one of three**, and the two differ in what they cost: a
  site that stops the build, and a site that writes a sentence a reader believes.
* **Five mechanisms are shown blind for structural reasons**, so no session need re-propose one of them
  for this population and discover the same thing.
* **The method is in the rules** rather than in one record: a costing counts its sites twice.
* **`playground.ts` carries no false count of its own table**, and this record says so rather than
  leaving a repair to be discovered in a diff.
* **A stale name in a `Where this looked` block is repaired**, and it was found by a sweep this unit ran
  for another reason — which is the fourth time the block form has been measured and the first time on
  its names rather than its figures.
* **Nothing is built.** The census does not move, the README figures do not move, no cell is written,
  and the ledger is unchanged.

## What would reopen this

* **A battery that can redden a guard of the meta suite.** M1 becomes writable, and it is red today, so
  it would be the rare guard that is not born green. That is the same trigger ADR-0230 named for the
  figure guard, and the two would close together.
* **A fourth costing corrected by its payer.** Three of four is a rate over a small population; a fourth
  correction of a site list that counted twice would refute §4's conclusion that the second count is
  what works.
* **A site of this class that reaches a reader and is not caught by the paying unit.** All three were
  caught before publication, which is what makes the recurrence a wrong figure rather than a shipped
  defect. One that ships changes the price.
* **A seventh entry in `AS_AN_ARGUMENT`.** The header now counts nothing, so it cannot go stale; the
  reopening is whether naming `string` and `Date` survives a third entry spelling the text as written.

## More Information

* ADR-0218 prices the three repairs; ADR-0223 costs them and is corrected twice; ADR-0232, ADR-0234 and
  ADR-0239 pay them; ADR-0235 costs item 3 and is the costing that counted twice.
* ADR-0198 moved `Attributes` out of `document.ts`, which is the stale name §3 repairs.
* ADR-0230 refuses the figure guard on the witness; §5 refuses its neighbour on the same ground.
* ADR-0195 named the rule §6 applies and deliberately did not write it.
