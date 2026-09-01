---
status: accepted
date: 2026-09-01
governs:
  - packages/site/start.test.ts
confirmed-by:
  - battery: site
    guard: a-page-with-no-slots-on-it-has-nothing-built-into-it
---

# A guard over a page that serves no slot calls every builder the module exports

## Context and Problem Statement

`a-page-with-no-slots-on-it-has-nothing-built-into-it` is the guard that keeps every control of this
site harmless on a page that serves no slot for it. It called **four** of the six builders
`packages/site/start.ts` exports, and it said so in its own comment: *`themeControl` is called by no
guard of this file and `siftControl` only where a shelf is served, so the claim above is established
for the four called here and asserted for neither of the others.*

That comment is honest and it is a hole. A guard whose name promises a page and whose body exercises
two thirds of what can build into one is a name that promises more than it keeps, and the honesty of
the sentence underneath does not change what a reader takes from the title.

[ADR-0195](0195-a-page-count-written-in-the-present-carries-the-number-the-tree-emits.md) is where the
gap was found, by repairing a count rather than by looking for coverage, and it named this unit in as
many words: *No guard is written for them here, because a guard is a unit of its own and this one is
about prose.*

**The hole was not hypothetical, and the control is what says so.** Measured at `0e97bc0`, with
`themeControl`'s slot check replaced by a cast — the shape ADR-0182 calls *the one a compiler
invites* — the whole site suite came back **184 of 184 green**. Seventeen files, one hundred and
eighty-four guards, and not one of them had an opinion about the control that stands on every page of
this site.

## Decision Drivers

- A guard's title is read as its claim; its comment is read by whoever is already suspicious.
- A widened guard that stays green whatever happens is worse than a narrow one that says what it
  does not cover, because the narrow one at least tells the truth.
- The instrument's accounting is per guard and never per arm, so an arm that no cell reaches is
  established once by hand and defended by nothing afterwards.
- A list of what a population builds is the thing that goes quietly out of date the day the
  population grows — which is exactly what happened here.

## Considered Options

- **Call all six builders and make the assertion total.** The title becomes true of the module's
  whole export surface, and a seventh builder joins the claim by being called.
- **Call all six and keep the assertion as a list of element kinds.** Cheaper, and it carries the
  defect that produced this unit into the next one.
- **Narrow the title to the four it exercises.** Honest, and it gives up on the two controls rather
  than on the sentence.

## Decision Outcome

**All six are called, and the assertion is total.** It used to count
`button, input, ul, .answers` — an enumeration of what four builders would have built. It now asserts
that `document.body.innerHTML` is the string the page was written from, so anything any builder adds
anywhere in the body reddens it and nothing has to be listed.

`themeControl` needs nothing from the harness that was not already there: it returns on
`!(slot instanceof HTMLElement)` at line 311 and reaches `window.matchMedia` at line 313, so on a
page with no slot the media query is never asked for. `siftControl` needs the port the file already
builds for the search.

### What each of the six made red, and by which mechanism

Every reading below is at the widened guard, one edit at a time, each restored, verdicts read off
vitest's json reporter rather than off its console.

| builder | the defect | verdict | how it reddens | alone |
| --- | --- | --- | --- | --- |
| `copyControl` | back to `querySelector` and cast | red | **exception**, `closest` on null | no — with `every-command-a-page-shows-carries-its-own-copy-control` |
| `managerControl` | both clauses cast away | red | **exception**, `JSON.parse("undefined")` | no — with `a-slot-that-declares-nothing-is-left-alone` |
| `themeControl` | slot check cast away | red | **exception**, `append` on null | **yes** |
| `themeControl` | `?? document.body` | red | **a button built**, on the assertion | **yes** |
| `searchControl` | `W-150`'s own edit | red | **exception**, destructuring null | no — with `a-slot-that-declares-nothing-is-left-alone` |
| `siftControl` | one clause cast away | **green** | — | — |
| `siftControl` | both clauses cast away | red | **exception**, destructuring null | no — with `a-page-that-serves-no-shelf-is-left-alone` |
| `playgroundControl` | the declaration cast away | **killed by typecheck** | `TS18047` | — |

**The mechanism is stated rather than flattered.** Four of the five reds are a control failing where
it should have done nothing, which is the wording `W-150` already publishes for its own. Only the
theme's fallback reddens on the sentence the guard is named after: a button appended to a page that
asked for none.

### The cell is the theme's, and only the theme's

`W-163` injects the fallback rather than the cast, and the reason is which sentence reddens. Cast
away, the missing slot throws at `slot.append` and the guard fails before its own assertion runs;
falling back to the body builds the button and the assertion refuses it. Both are red alone, and one
of them is red on the claim.

**No reader meets that defect today, and it is written down rather than smoothed.** The tree writes
eight files of HTML. Seven carry `.masthead .theme`; `404.html` is the one that does not, and it
carries the masthead while loading no module — so nothing runs there. What the cell buys is the day a
page gains the script or loses the slot, which is the argument `CLAUDE.md` requires of a guard born
green.

### No cell for the sift, and the measurement is why

The plan this unit was approved on carried two cells. **The second was refused by its own
measurement.** `siftControl` opens on three independent early returns, so casting one away leaves the
other two refusing and the suite stays at 184 green — and casting two away reddens
`a-page-that-serves-no-shelf-is-left-alone` alongside this guard, because that guard already runs
`siftControl` against a real served contract page and asserts the same absence.

So the shelf's arm here restates a claim that already has a guard of its own, on a page this site
really serves rather than on a synthetic one. It is **called** so that the claim is over the module
rather than over a list, and it is **not** given a cell, because a cell aimed at it would buy a
second witness for a sentence that has one.

That neighbour's comment had already published the fact this unit re-measured: *three independent
early returns each refuse to build here, so defeating one leaves the other two refusing.* It is
reproduced at `0e97bc0` and not merely cited.

### The playground's null container is the compiler's and not this guard's

Reaching the path where a container is null and the builder carries on is `TS18047: 'container' is
possibly 'null'`, measured again here. `start.test.ts` already refuses to keep a guard for it, in as
many words: *a guard whose subject is enforced by the type system is a guard that cannot fail.* This
unit changes nothing about that and records the reading beside the other five, because a reader
comparing six arms is owed the one that is not a red.

### `five builders` in `start.ts`, under ADR-0195's rule

`start()`'s comment read *what it composes is five builders each reached on its own, and a guard over
the composition would be a guard over five calls in a row*, for six calls. ADR-0195's rule decides it
and the count is not what decides: **a count in a present-tense sentence is deleted where the
argument survives its removal.** The argument is that each builder is reached on its own, so a guard
over the composition would add nothing — which survives whole. So the number is gone and it did not
become six.

## What would reopen this

- **A builder added to `start.ts` and not called here.** The assertion is total over the body, so a
  builder that is never called is invisible to it — the population is the calls in the guard, and
  nothing derives it from the module's exports.
- **A control that writes outside the body**, to the head or to the root element, which this reading
  cannot see. The one such write this module makes is the theme's, on the click rather than on the
  build.
- **A second guard whose page serves no shelf.** The sift's arm is called here and witnessed next
  door; the day `a-page-that-serves-no-shelf-is-left-alone` is retired, this guard is the only thing
  left asserting it and it has no cell.
- **A single edit that makes `siftControl` build on a bare page.** None exists today over its three
  early returns; one would make the sift's arm worth a cell of its own.

## More Information

- [ADR-0195](0195-a-page-count-written-in-the-present-carries-the-number-the-tree-emits.md) found the
  gap and named this unit.
- [ADR-0182](0182-the-artboard-is-the-specification-and-a-green-suite-was-not-a-reading-of-the-page.md)
  is where `W-150` replaced `W-127`, and where *the shape a compiler invites* is written down.
- [ADR-0181](0181-the-page-a-reader-arrives-at-is-a-shelf.md) carries
  `a-page-that-serves-no-shelf-is-left-alone` and its three early returns.
- [ADR-0165](0165-the-wiring-is-run-against-a-document-and-the-first-thing-it-found-was-escape.md) is
  the record this guard was written under, and carries what an emulated document does not prove.
