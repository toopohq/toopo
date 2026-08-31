---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  nothing: what it decided was a removal, and a removal is not implemented anywhere - the section it took out is still absent and the page it measured has been rebuilt since
confirmed-by:
  - battery: site
    guard: the-cost-a-page-states-is-what-lands-and-not-what-is-served
---

# What a page is long in is measured, and it is not the wrapping

> **The wrapping turned out to be worth far more than 3.7%, because what was measured was the wrapping
> under a ceiling.** This record bounded the repair by widening the column to the declared 75 and
> re-reading — 594 lines to 572. [ADR-0134](0134-a-width-stated-in-characters-and-a-layout-that-follows-the-screen.md)
> removed the ceiling instead of widening toward it, and `number/parse@1` at 1440 falls from 580
> rendered prose lines to 397, its height from 15 901px to 12 081. The 3.7% is exact for the question
> it was asked and the question had a ceiling in it.
>
> **Its prose-line figures are not reproducible and that is recorded rather than repaired.** ADR-0134's
> probe reproduces every one of the eight heights in the table below **to the pixel**, and the nine-line
> delta of the removal exactly; it reads the base as 610 → 601 where this record publishes 594 → 585.
> Neither of the two populations declared in the table above yields 585 — with navigation the count is
> 601, without it 580. The rendering is identical and the counting differs, and nothing here says how.

## Context and Problem Statement

[ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md) put *What lands in your
project* on the contract page two days ago — the installed file names, and the licence header shown
rather than described. It was proposed on a supposition: that somebody deciding on a function wants to
know what arrives on their disk. The owner read it on his own screen and did not want it, and a reading
by the person the page is for outranks a supposition about them. **The two things this unit was asked to
remove are one deletion**: the licence header is the last two lines of that section.

**And the same reading raised the question this unit is really about.** The page is too long. Cutting
its prose is not available — 90 % of a contract page's text is the frozen half of the contract, which
[permanent rule 6](../../CLAUDE.md) makes unremovable for the life of the major — so the owner asked
whether the length is the matter at all, in his own words: *or is it just the line breaks that make it
look long?*

**Nothing in this repository had ever counted a rendered line of a whole page.**
[ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md),
[ADR-0123](0123-a-wide-screen-is-filled-by-a-column-and-never-by-a-longer-line.md) and
[ADR-0132](0132-a-void-is-matter-that-is-missing-and-never-a-ceiling-to-remove.md) counted lines to
police a ceiling — *is any line over 75 characters* — and answered with a worst and a median. None of
them asked how many lines a reader is handed, which is the quantity the complaint is about.

## Decision Outcome

**The section is removed, and the reading that replaces its argument is that it was not costing what it
looked like it cost.**

### Two populations, named here because one of them is new

A line is counted the way ADR-0122 counts one: **one `Range` per character, grouped into line boxes by
vertical overlap** — a character joins the line whose band its vertical midpoint falls inside, and the
band grows to the union. A character whose rect has no width is on no line, which is what a collapsed
space is. Characters are attributed to the **nearest ancestor that is not laid out as inline text**, so
two columns side by side are never read as one line and a `code` span set smaller stays on the line a
reader sees it on.

| population | what it is | why it exists |
| --- | --- | --- |
| **prose** | every character whose nearest such ancestor matches `h1, h2, h3, h4, p, li` | the set `style.ts` bounds at a measure, so every earlier reading of this site is comparable with it |
| **every rendered line** | every character on the page, whatever block owns it | what a reader scrolls past; `pre`, the install command, the figures and the copy control are in it and in no earlier reading |

**The second is new and this table is where it is declared**, because a population invented for one
reading is one the next reader has to be able to rebuild. It is the larger of the two by 5 to 7 %, and
that is itself the finding about this page: a settled case renders as `p.call`, `p.case-id` and a `p` of
argument, so the case tables — two thirds of everything under a heading, by
[ADR-0119](0119-the-page-is-read-in-two-halves.md)'s count — are already inside the prose population.
Almost nothing on a contract page is outside the rule the site bounds.

### What the page renders, before and after

At 1440, `documentElement.clientWidth` 1425, four contract pages. Before is measured at `00be46c`;
after is the tree this record lands in, which differs from it by this unit's diff and nothing else.

| | words on the page | prose lines | every rendered line | median | worst | over 75 | height px |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `number/parse@1` | 4 509 → **4 433** | 594 → **585** | 630 → **619** | 56 → 56 | 69 → 69 | 0 → 0 | 16 608 → **15 901** |
| `date/add@1` | 4 360 → **4 284** | 564 → **555** | 612 → **601** | 56 → 56 | 67 → 67 | 0 → 0 | 15 399 → **14 530** |
| `string/levenshtein@1` | 2 887 → **2 811** | 362 → **353** | 386 → **375** | 56 → 56 | 68 → 68 | 0 → 0 | 10 295 → **9 619** |
| `string/slugify@1` | 4 667 → **4 591** | 579 → **570** | 610 → **599** | 56 → 56 | 69 → 69 | 0 → 0 | 15 604 → **15 604** |

The word count is of `body.innerText` over the whole page, masthead and column included. **It is not
the population the owner quoted** — his 4 163 of 4 607 for `number/parse@1` was taken another way — and
the two are written side by side rather than reconciled, because a variation is exact and a total
compared across two sweeps is not.

**The removal is worth nine lines of 594, which is 1.5 %.**

### The height a section costs is a row of a grid, and on one page it is zero

`string/slugify@1` did not move by one pixel while its neighbours lost 676 to 869. That is not a fault
in the reading, and it was measured rather than explained: `.opening` is a two-column grid, both tracks
`446.5px`, filled in document order.

| | before | after | Δ |
| --- | --- | --- | --- |
| `number/parse@1` | `[861, 468]` then `[707]` = 1 568 | `[861, 707]` = 861 | −707 |
| `date/add@1` | `[1 121, 468]` then `[868]` = 1 989 | `[1 121, 868]` = 1 121 | −868 |
| `string/levenshtein@1` | `[1 084, 468]` then `[676]` = 1 760 | `[1 084, 676]` = 1 084 | −676 |
| `string/slugify@1` | `[930, 468]` then `[603, 1 523]` = 2 453 | `[930, 603]` then `[1 523]` = 2 453 | **0** |

The section was **468px on all four pages** and stood beside a taller sibling on all four, so **its own
height was never on the page at all**. What the removal buys is whichever row the re-packing drops, and
on the one page whose rows re-pack without losing one it buys nothing. **A section in this grid is paid
for in rows and never in its own height** — which is
[ADR-0132](0132-a-void-is-matter-that-is-missing-and-never-a-ceiling-to-remove.md)'s sentence one floor
down: the block was in the void rather than in the way.

### The answer to the question: the wrapping is worth 3.7 %

The declared limit is 75 characters and the page renders 69 at worst, 56 at the median. Two readings of
what that costs, and they bound the answer from both sides.

**Measured, not projected.** `--measure` is derived from `--characters-per-ch` and `--the-methods-drift`,
so the column was widened in a browser until the widest line on any of the four pages was as close to 75
as it goes without passing it, and the pages were re-read. Nothing on any disk changed.

| divisor | worst line, the four pages | prose lines, the four pages |
| --- | --- | --- |
| 1.4487 — in force | 69, 67, 68, 69 | 594, 564, 362, 579 |
| 1.3651 | 73, 71, 71, 72 | **572, 547, 349, 554** |
| 1.3582 | 74, 71, 72, **77** | 569, 545, 348, 553 |
| 1.3512 | 75, 72, 72, **77** | 568, 541, 347, 551 |

The second row is the widest column the limit allows: one step further and `string/slugify@1` breaks it.
**At the declared limit the page renders 572 lines instead of 594 — 3.7 % fewer.** The jump from 73 to
77 in one step is ADR-0132's *density is not stationary* arriving on line counts rather than on a worst
line: a wider box breaks the same sentences at different words, so the ceiling is met in jumps.

**And the floor, which no renderer reaches.** Block by block, `ceil(characters / 75)` — every line but
each block's last exactly at the limit — gives 511, 491, 315, 506 against today's 594, 564, 362, 579:
**14 % fewer at perfect packing**. Per block and never on the total, because every block's last line is
partial in both renderings and a total divided by 75 would credit the projection with one saved line per
block.

So the two bounds are **3.7 % measured and 14 % at a packing no line-breaker performs**, against a page
of 4 509 words. The wrapping is not what makes this page long.

### What is long is the space between the blocks, and it is a quarter of the page

Taken over `main` at `00be46c`, by union of vertical extents so that two columns side by side are
counted once: the glyphs, the leading inside the blocks that hold them, and what is left.

| | `main` px | carrying glyphs | leading inside blocks | between blocks |
| --- | --- | --- | --- | --- |
| `number/parse@1` | 16 461 | 9 886 — 60.1 % | 2 414 | 4 161 — 25.3 % |
| `date/add@1` | 15 252 | 9 075 — 59.5 % | 2 281 | 3 896 — 25.5 % |
| `string/levenshtein@1` | 10 148 | 6 059 — 59.7 % | 1 585 | 2 504 — 24.7 % |
| `string/slugify@1` | 15 457 | 9 474 — 61.3 % | 2 302 | 3 681 — 23.8 % |

**A quarter of a contract page is the gap between one block and the next**, stable within 1.7 points
across four pages of very different lengths. On `number/parse@1` that is 4 161px against the 707px the
section removed here and the 485px reaching the declared line length buys — 16 608 to 16 123, measured
in the same sweep as the table above. **Nothing is
decided about it in this unit** — the brief forbids touching the layout, and a spacing scale is
[ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md)'s, argued and derived. It
is written down because it is the only quantity measured here that is worth more than the two the
question was about.

## Considered Options

- **Cut prose.** Unavailable: 90 % of the page is the frozen half of the contract.
- **Widen the line to its declared limit.** Measured above at 3.7 %, and ADR-0132 has already refused
  the divisor move on other grounds — the column grows twice as fast as the line, so the void beside the
  card grows with it.
- **Publish the arithmetic projection alone.** Refused: `ceil(characters / 75)` is a floor no renderer
  reaches, and published on its own it would read as what widening the line buys.
- **Measure words only.** Refused, and it is the whole reason this unit exists: a paragraph of 230 words
  is 28 lines at 54 characters and 17 at 90, so a word count cannot answer a question about length.

## Consequences

- A contract page's opening carries three sections where it carried four, and two on
  `string/slugify@1`'s second row.
- `licenceHeaderOf` is no longer imported by `packages/site/contract-page.ts`. It is still read by
  `mutation/readme.test.ts` and by `packages/registry/publication.ts`, which are what keep the header
  that lands in somebody's repository correct; the site had been the only surface *showing* it.
- What the section did that still needed doing is done by the card, which states the installed byte
  total and file count — and that is kept by a guard rather than by this sentence.
- **The measurement is the deliverable and the removal is not.** Nine lines of 594 is what the cut is
  worth; the two figures worth carrying out of this unit are the 3.7 % and the quarter.

## Confirmation

`the-cost-a-page-states-is-what-lands-and-not-what-is-served` is what the removal is checked against
rather than what it added: it requires the installed byte total in a contract page's reading, and with
the section gone the card is the only place that total appears. That is the state the guard was written
for — [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md) had made the guard
satisfiable by a second copy, and `W-12` survived on it until `b2db9dc`. **The removal returns the guard
to one population**, and the entry in `CLAUDE.md` about a value stated twice on one surface keeps its
subject: nothing here makes that class narrower.

`the-rail-of-a-page-names-every-section-of-it-and-only-those` is what makes a section removable at all.
The rail is derived from the sections, so a removal cannot leave an entry pointing at a heading that is
gone — and this record names it because that is the guard that would have been red had the two been
declared in two places.

**No guard is written for the absence, and that is deliberate.** A guard asserting that this page has no
section about what lands would fire the day somebody adds one, which is not a defect — the page gained
this section legitimately two days ago and could gain another legitimately tomorrow. The rule
`CLAUDE.md` states is that a guard born green is justified by the event it would catch and by what that
event costs; here the event is a reader disagreeing with a section, and no suite can hold that opinion.

## What would reopen this

- **A contract page whose opening holds an odd number of sections again**, at which point the grid has a
  free cell and a section costs nothing — the measurement above is of one arrangement of four, three and
  two sections, and it expires with that arrangement.
- **A second reader saying the same thing about a different part of the page.** One reading by the owner
  is what removed this section; it is not evidence about any other.
- **The spacing scale being taken again.** The quarter measured above enters no decision here, and it is
  the figure that would decide one.
- **A page whose worst line reaches 75.** The 3.7 % is the distance between what the page renders and
  what it declares, and it is a bound on a repair only while the two differ.

## More Information

- [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md) — the record whose
  first section this withdraws, and whose second stands.
- [ADR-0132](0132-a-void-is-matter-that-is-missing-and-never-a-ceiling-to-remove.md) — the void a block
  can sit in, one floor up.
- [ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md) — the line-box method this
  reading reuses, and the reading it reproduces: median 56, worst 69, none over 75.
- [ADR-0119](0119-the-page-is-read-in-two-halves.md) — the page counted in words, which is the reading
  this one exists because of.
