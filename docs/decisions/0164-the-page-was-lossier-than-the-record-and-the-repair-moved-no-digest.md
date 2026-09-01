---
status: accepted
date: 2026-08-25
governs:
  - packages/site/literal.ts
  - packages/site/read-literal.ts
  - mutation/site.battery.ts
confirmed-by:
  - battery: site
    guard: an-instance-shows-the-class-it-is-of-and-what-it-holds
---

# The page was lossier than the record, and the repair moved no digest

## Context and Problem Statement

ADR-0163 measured what the catalogue cannot spell, by serialising every contract and rendering each
case as `theCallOf` renders it on a page. Its table is headed *with an argument that has no spelling*
and reads 30 of 30 on `array/group-by@1`, **5 of 49 on `object/deep-equal@1`**, and zero on the other
five. That reading reproduces here at `045709b`, to the row.

**Nobody had decomposed the five, and the decomposition is a different problem from the one ADR-0163
went on to describe.** Measured at `045709b` by matching each of `WITHOUT_A_SPELLING`'s three phrases
against the rendering of every served case:

| what has no spelling | rows on `object/deep-equal@1` |
| --- | --- |
| a function | 1 |
| a value whose contents cannot be read | 2 |
| **an instance of a class** | **2** |

The one function is `two-functions-are-not-compared`, where the word is the right answer: its own
frozen rationale says *source text is not behaviour*, so which two functions they are is not what the
row settles. The two opaque rows are the same shape — nothing about a promise's contents is readable,
which is why the contract answers `false` for two of them.

**The two instance rows are not that shape, and they are the whole of this record.** The record holds
everything about them and the page threw it away:

```
  record: { kind: 'instance', className: 'ASmallClass', fields: [{ name: 'x', value: … }] }
  page:   { left: <an instance of a class>, right: { x: 1 }, expected: false }
```

What `a-class-instance-is-not-its-fields` settles is that an instance carrying `{ x: 1 }` is **not**
the plain object `{ x: 1 }`. A reader saw an unnamed something beside `{ x: 1 }` answering `false`,
which reads as *two different things are different* — true, uninteresting, and not the claim. Its
neighbour `a-class-instance-is-not-its-own-clone`, whose instance holds `x: 2`, was printed in the
very same words on the left.

**The population is two nodes, both `ASmallClass`, one field each, no symbol fields and no label** —
measured over every case, use case and benchmark profile of all seven contracts. That is too thin to
carry a guard, which is why the one below is total over the arm's shape rather than over what the
catalogue happens to hold.

## Decision Drivers

* It is a defect on a **published** contract that a reader meets today.
* `packages/site/literal.ts` is in no digest and is not one of `THE_SHARED_FILES`, so the repair is
  free of permanent rule 6 — which had to be measured rather than assumed.
* The brackets cannot go. `ASmallClass { x: 1 }` is the form a reader knows from a console and would
  paste, and there is no expression that builds the value: the class is not in the record and cannot
  be.
* `read-literal.ts` must go on refusing the phrase, and by naming it.

## Considered Options

* **Print the class alone** — `<an instance of ASmallClass>`. Tells the two rows apart and still hides
  the field each row turns on.
* **Print a pastable form** — `ASmallClass { x: 1 }`. A lie a reader could paste, which is what the
  arm's own comment refuses in as many words.
* **Print the class and what it holds, inside the brackets.** Chosen.

## Decision Outcome

An instance renders as `<an instance of ASmallClass, holding { x: 1 }>`, and as
`<an instance of ASmallClass>` where it holds nothing. The fields are rendered by `record`, the same
function the record arm uses, so there is no second statement of how a field is written.

Measured after, on the two rows this is about:

```
a-class-instance-is-not-its-fields
  { left: <an instance of ASmallClass, holding { x: 1 }>, right: { x: 1 }, expected: false }
a-class-instance-is-not-its-own-clone
  { left: <an instance of ASmallClass, holding { x: 2 }>, right: { x: 2 }, expected: false }
```

The two now read differently, which was the criterion — and the thing worth more is that each now
*shows its claim*: the same field on both sides, and the answer still `false`.

### `WITHOUT_A_SPELLING` holds what a phrase opens with

`read-literal.ts` refuses by `startsWith`, so a phrase that goes on to say more is refused by the same
declaration that prints it, with no change to the refusal at all. The entry becomes
`'<an instance of '` and `literal` closes the phrase. The two arms with nothing further to add are
their own openings and did not move.

**The coupling the declaration exists for is untouched**, and that is what makes this the smallest
change that is complete rather than a widening of the reader. Both sides still read one statement.

### The label is carried, and it is born green

An instance appearing twice is one object, `encode` labels it, and the second occurrence renders `#1`
— while this arm dropped the label, so the `#1` pointed at nothing. No case does that today; the event
that would is a contract settling identity on an instance, and `object/deep-equal@1` is a contract that
settles identity. It costs one call to `shared`, which every other arm already makes.

## Consequences

* **No digest moves.** Measured at `045709b` and again after, over all seven contracts: the contract
  snapshot digest is byte-identical on every one, `0 of 7` moved. `npm run freeze` is green, which is
  the authoritative reading — it rebuilds each published binding at the commit it records.
* **Nothing about what the form opens changes.** `hasASpelling` is a property of the kind, so those
  rows are still declined by the playground and still rendered in the table, which is where a word is
  the honest rendering.
* The site suite goes 164 to 165, `packages/site/literal.test.ts` from 11 guards to 12, and the
  instrument from 794 cells to 795 with 753 killed — derived from `theMeasurement()` rather than added
  up. The 42 survivors and their classification do not move.

### Three headers said *two*, and each was made false by a unit that did not come back

* `read-literal.ts` announced *the two arms it refuses* and said `literal` prints `<hole>`. **Both
  halves were false.** A hole has had a spelling since ADR-0160 — it prints as nothing at all, and
  `readList` builds a real one rather than refusing it — and the two arms that arrived with
  `object/deep-equal@1` were never added. The sentence described a reader that had stopped existing,
  in the file whose subject is these exact words.
* `literal.ts` opened `WITHOUT_A_SPELLING` with *The two arms* over a record holding three.
* `mutation/site.battery.ts` called its pair of anchors *the two words with no JavaScript spelling*
  while one of the two had a spelling.

None of the three is a drift of this unit's making, and all three are repaired here because this is the
change that touches their zone.

### What the guard establishes that its neighbour does not

`every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` is about the **refusal**: that a
wordless arm is turned down and named. The new guard is about the **content**: that the phrase carries
what the record holds. They are two claims and that is measured rather than asserted — with the
renderer perturbed back to printing the class-less phrase, `literal.test.ts` fails on the new guard and
`read-literal.test.ts` passes whole, because `<an instance of a class>` still opens with the declared
word and is still refused.

The guard is total over the arm's shape and not over the catalogue: a class with a field, two classes
differing only in a field's value, a class with no fields, symbol fields, and one instance in two
places. The population it would otherwise have had is two.

## What would reopen this

* **A fourth arm with no spelling.** The rule this record leaves is that such an arm carries whatever
  the record holds about it, inside the brackets, and that `WITHOUT_A_SPELLING` holds what its phrase
  opens with. Nothing enforces the first half; `every-arm-of-an-encoded-value-is-read-back-or-refused-by-name`
  enforces only that the arm is refused by name, and an arm printed as a bare word would satisfy it
  exactly as `instance` did for the whole of its life.
* **A reader that could open one of these rows.** Out of reach for an instance, whose class is not in
  the record and cannot be. It is reachable for a function and that is ADR-0163's second reopening
  trigger, not this one's.

## More Information

### What found it, and it was not a reading of this file

The arm had **no guard in `literal.test.ts` at all** — not a weak one, none — which is why it could be
written, published, and left. What found it was a probe written to answer a different question:
serialising every contract and printing the record beside the rendering, for a unit about whether a
case table can carry a function. The record and the page disagreed in a column nobody had put side by
side before.

That is the same shape as ADR-0163's own finding one floor up: a turned-down contract's page renders no
case table, so thirty unreadable calls were serialised and never rendered. Here the page *was*
rendered, on a published contract, and what it dropped was invisible without the record beside it.

### A restatement in `CLAUDE.md` that drops a heading

That file carries ADR-0163's table as *… the key function being half of what the case settles and
absent from the record — against 5 of 49 on `object/deep-equal@1`*. The record's table is headed *with
an argument that has no spelling* and is correct; the restatement puts the figure straight after a
clause about a key function, so a reader takes the five to be five functions. It is one, and the
decomposition is in this record. **The class is the one that file already traces** — a figure that was
true of its own population read into a sentence about another — arriving on the file that names it.
