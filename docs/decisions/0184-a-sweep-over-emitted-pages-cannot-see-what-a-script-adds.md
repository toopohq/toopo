---
status: accepted
date: 2026-08-30
governs:
  - packages/site/style.ts
confirmed-by: []
---

# A sweep over emitted pages cannot see what a script adds

## Context and Problem Statement

At 390 this site introduced itself as five lines of one letter.

Measured at `6dadac2` in a browser, on the emitted tree with the module running: `.masthead .wordmark`
is **38.05px wide and 129.53px tall**, where one line of it is 25.91px. The wordmark is a flex item at
the default `flex: 0 1 auto`, so it may shrink below its content, and the search field and the menu
took its width.

**ADR-0135 repaired this defect once and could not have met it a second time.** That unit swept 14
pages × 21 widths × 2 themes and fixed a wordmark that broke below about 479. The masthead's search
field is built by `start.ts`, in the reader's browser — so it is in none of those 294 renderings, and
the geometry a reader meets at 390 is the geometry of a document this repository had never rendered.

**It is not deployed, and the reason is worth writing down so nobody hunts a cause that does not
exist.** `toopo.dev` still serves the masthead from before ADR-0182's bar: read at `6dadac2`, the live
page carries no `.bar` element and a one-entry menu, and its wordmark is 43.98px wide on one line.
**That is not a deployment that went wrong — none of the redesign is deployed at all.** Measured at
`f2ea3a1`, `origin/main` stands at `a9236dd` and the branch is fourteen commits ahead of it: the five
that built the front page from the artboard and the bar, and the nine of ADR-0183 and this record. The
defect entered with `f1a8cbf` and `bedf227`, and one `git push` carries every one of the fourteen.

**So the state of the origin is evidence about what has been pushed and about nothing else.** A
session comparing the live site against this tree and looking for a cause in the code is looking for
something that is not there.

**It is not ADR-0183's.** That unit's component layer was suspected first and cleared by measurement:
removing all 3 376 B of its rules from the served sheet leaves the wordmark at **129.53px, identical**,
and its commit touches no masthead rule, no `chrome.ts` and no `start.ts`.

## Decision Outcome

**The name does not give up its width.** `.masthead .wordmark` declares `flex: none`.

Measured in a browser across the change: 38.05px × 129.53px before, **69.39px × 25.91px after**, with
no sideways scroll and **the bar at 56px either way** — which is the trap ADR-0135 recorded in as many
words, a wordmark repaired at the menu's expense, and it does not fire here because the menu is not
what was squeezing it.

### The repair is correct and it is not sufficient, which was found by looking rather than by measuring

**The masthead is still broken at 390, and the first reading of this repair missed it.** The probe that
confirmed the wordmark asked for the wordmark's box, the bar's height, the viewport's overflow and the
elements outside it — **four good measurements, none of them able to see text breaking inside a box
that fits**. Looking at the rendered page is what found it: the menu now takes the squeeze the wordmark
was taking, and `How we verify` wraps to `w / we / verif / y`.

**That is this record's own subject arriving on this record.** The entry below says a sweep over
emitted pages cannot see what a script adds; this says a sweep over boxes cannot see what happens
inside one. Both are the same mistake in different clothes — treating the thing that was measured as
the thing that was asked — and the second was made by the author of the first, in the act of writing
it. It is the best statement this repository has of what measurement does not replace, and it is here
rather than in a commit message because a commit message is not somewhere anybody looks twice.

**Two smaller instances of the same family came out of the same unit**, and they are named because
three make a shape where one makes an anecdote. `README.md` was swept for a guard count and reported
as carrying no figure this unit moves; it carries three, all counting cells, and the meta suite found
them. And `W-148` was read as the last address of the battery's cell list, which is not ordered — W-149
and W-150 already existed further down, so three new cells landed on two taken addresses. **Each was a
reading taken for a measurement**: a grep answered honestly, and the question it answered was not the
question asked of it.

**Each candidate moves the squeeze rather than removing it, and that is the finding.** Measured at
`abbc12a` at 390: the menu is 147.16px tall with links at 125 and 147px; giving the menu the same
treatment as the wordmark - `white-space: nowrap` and `flex: none` - takes it to 37.86px with both
links at 38px, and **crushes the search field to 2px wide**. The bar holds a wordmark, a search field,
two links and a theme button, and at 390 it cannot hold them on one row. Something has to give and
nothing here declares what.

### The specification stops at one width, and what is below it is a decision

**The artboard carries no responsive rule at all.** Measured over `Toopo.dc.html`: **zero `@media`,
zero `@container`, zero `@supports`**. Its `min-width` declarations are `0` three times — flex
shrink guards — and `150px` on one row's name column; its seven `max-width` declarations are content
ceilings, 1100 for the page, 760 for the hero, 640, 620 and 600 for prose and the dialog, 300 for the
aside and 38% for a code cell. **Not one of them is a breakpoint.**

So the mock-up is a desktop mock-up, and *reproduce the artboard* has literally no answer at 390. That
is a gap in the source rather than in the implementation, and it changes what the open question is:
below the width the specification covers, the masthead's behaviour is **a decision and not a
deduction**. Nobody can derive it, measure it out of the artboard, or be shown to have got it wrong by
comparison — which is why the three candidates below are put to the owner rather than chosen here, and
why this record repairs the one thing that was wrong on its own terms and stops.

**So this record repairs one thing and defers the decision.** A flex item shrinking below its content
with no decision behind it is a defect on its own terms, and five lines of one letter is strictly worse
than a wrapped menu; the rest is a layout question - whether the bar wraps to two rows, whether the
search collapses to an icon at that width, whether the menu goes behind a control - and it belongs to
the unit that owns the masthead. It is ADR-0135's own trap seen a second time, one child along: that
record wrote that repairing the wordmark took the height from the menu, and here repairing it takes the
*words* from the menu.

**The finding is worth more than the repair, and it is an entry of `CLAUDE.md`'s open list rather than
a mechanism here.** Every sweep this repository takes over its own pages reads what `build.ts` wrote,
and a control `start.ts` adds is in none of them. The population is every control the module builds —
the copy controls, the theme button, the search field and its answers panel, the playground's form.

**Half the machinery to close it exists, and the half that does not is the one that matters.**
`start.test.ts` already runs `start.ts`'s builders against a happy-dom document, so reaching the
enriched DOM costs nothing new. Measuring it does: probed at `6dadac2`, happy-dom answers
`{width: 0, height: 0}` from `getBoundingClientRect()` for an element declared `width: 200px;
height: 40px`, while `getComputedStyle(el).width` answers `200px` by echoing the declaration back. It
parses and cascades; **it does not lay out**. So the closure is the headless browser four entries of
that list already price and refuse, and this is the first of them whose subject is a page *after a
script has run*.

**No guard is added, and `confirmed-by` is empty rather than furnished.** A guard over this defect
needs a browser; a guard over the declaration would assert that a stylesheet contains a string, which
is the shape ADR-0112 refuses. What keeps the repair is the reading in this record and the entry that
says nothing keeps it.

## What would reopen this

- **A browser in the suites**, which closes the entry rather than this record, and which would be red
  on its first run over the widths ADR-0135 used — the rare shape of a guard not born green.
- **The masthead's narrow widths, which this record deliberately leaves open — and which are the
  owner's to rule on rather than anybody's to derive.** The bar's contents already exceed it at 390 and
  nothing declares what gives; the three candidates are the bar wrapping to two rows, the search
  collapsing to an icon and the menu going behind a control. The artboard settles none of them, because
  it carries no responsive rule at all, so this is the one part of the redesign where there is nothing
  to reproduce and something to decide. The three are with the owner. **Whoever takes it takes 320 with
  it**, which this record did not read.
- **The search field becoming a palette-opening button**, which ADR-0183 leaves open: it is narrower
  than the input, so the squeeze that produced this defect would be smaller and the measurement worth
  retaking rather than assumed to hold.
