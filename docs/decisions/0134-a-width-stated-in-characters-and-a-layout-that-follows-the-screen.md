---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
  - packages/site/contract-page.ts
confirmed-by:
  - battery: site
    guard: every-ceiling-on-a-box-is-derived-and-never-typed
  - battery: site
    guard: every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length
  - battery: site
    guard: the-rail-of-a-page-names-every-section-of-it-and-only-those
---

# A width stated in characters and a layout that follows the screen

## Context and Problem Statement

The owner read the site in an inspector, changed it there, looked at the result, and decided. Two
things: **the limit on characters per line disappears** — not replaced, not moved elsewhere, removed —
and **the sections of a contract page's opening stack in one column**, so the two-abreast arrangement
[ADR-0132](0132-a-void-is-matter-that-is-missing-and-never-a-ceiling-to-remove.md) built goes with it.

His argument is one sentence and it is the whole of this record's premise: *a width capped in
characters and a layout that follows the screen are contradictory*. Asked what size to put back, he
declined to give one — **no defined size, the size changes with the screen** — and asked for the
question to be settled by measurement rather than by a number handed down.

**The decision was taken against advice, twice, with the measurement in view.** It is not re-argued
here. What is recorded is what it reached, what it cost, and what nothing was watching.

### The rule named one limit and there were four

`h1, h2, h3, h4, p, li { max-width: var(--measure) }` is the rule anybody would name, and it is the
smaller half. `--two-columns` was declared as `calc(2 * var(--measure) + var(--s10))` — **the same
ceiling stated in characters, one floor up** — and four things resolved against it:

| what it bounded | since |
| --- | --- |
| the body's middle track, so every page with no shell | [ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md) |
| `.shell:has(.beside)`, `.shell:has(.aside)`, `.shell:has(.rail)` | [ADR-0123](0123-a-wide-screen-is-filled-by-a-column-and-never-by-a-longer-line.md) |
| the use-case grid's ceiling | ADR-0122 |
| the `97rem` threshold's arithmetic, as the `933` in `240 + 933 + 268 + 96` | ADR-0123 |

**A limit derived from a limit that is being removed is an orphan, and nobody had read this one as the
same limit.** Three units added a consumer to `--two-columns` and each described it as *what a block of
this catalogue may be*, which is true and is not the same sentence as *seventy-five characters*. Taking
out the rule and leaving the constant would have moved a contract page's prose from 466px to 933px and
stopped there, identically at 1280 and at 3840 — which satisfies the letter of the decision and not one
word of its argument.

**The use-case grid is where the orphaning is easiest to see, because its ceiling carried its own
refutation.** The comment above it read: *at 2 560 the four cards stood alone in a row 1 892px wide
while nothing else on the page passed 950*. What made them stand alone was the page being capped and
that block not being. With the cap gone the complaint has no subject.

## Decision Outcome

**Removed:** the rule on prose; `--two-columns` and its four consumers; the `.opening` grid; the
scoped `fit-content` arrangement ADR-0132 wrote for pages whose widest block is a line; and, in
`contract-page.ts`, the `div.opening` and the `section` around each block, which the file's own comment
says existed for one reason — a grid can place a section beside a section and cannot place a run of
`h2`s with their bodies between them.

**Replaced:** the body's middle track. It was
`fit-content(min(var(--two-columns), calc(100% - var(--s10))))` and is `var(--s5) minmax(0, 1fr)
var(--s5)` — a gutter, the page, the same gutter. **The gutter is half the step the old ceiling
subtracted, so the narrow end of the range is unmoved by construction**: at 390 the content was 335px
before and is 335px after, and the whole tree reads within one line and 99px of itself there.

**Kept, with the argument rewritten rather than the value:** `--a-contract-in-a-list` is still
`var(--measure)`. Its old comment was arithmetic about a column that no longer has a width — *two
abreast exactly where the column is two measures wide*. Measured at `7c15c69` on the front page, the
floor now folds the list at five widths instead of one and no track ever falls under 464px:

| | 810 | 1024 | 1280 | 1440 | 1920 | 2560 | 3840 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| columns | 1 | 1 | 1 | 2 | 3 | 4 | 5 |
| track px | 747 | 669 | 925 | 523 | 495 | 521 | 665 |

So the value survives on a measurement and the reason does not survive at all. **It is a coupling and
no longer a derivation** — the two agree on a number and have stopped agreeing on a meaning — and that
is written beside it rather than repaired, because repairing it means choosing a length and the owner
withheld exactly that.

**No number was invented anywhere in this unit.** Every length still in the file was already argued for
in it before this change.

## The measurement

Nine widths — 390, 810, 1024, 1280, 1440, 1600, 1920, 2560, 3840 — over **all fourteen files of HTML**,
in Chrome, each page laid out in an iframe at the target width so a media query and a `ch` resolve
against the width being read rather than against the window behind it. *Prose* is `h1, h2, h3, h4, p,
li`, [ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md)'s method: one `Range`
per character, grouped into line boxes by vertical overlap. **`layout` is 15px under the frame wherever
the page scrolls**, which is the scrollbar and is why the figures are quoted against the frame.

### The whole tree, before at `ab2765c` and after at `6eb5c95`

Lines and height are summed over the fourteen pages; the median is the median of the fourteen medians;
the worst is the worst line anywhere in the tree.

| width | median | worst | prose lines | height px | ink |
| --- | --- | --- | --- | --- | --- |
| 390 | 41 → 41 | 62 → 62 | 5 413 → 5 412 | 174 528 → 174 429 | 87.4% → 87.4% |
| 810 | 56 → 59 | 69 → **139** | 4 190 → 2 818 | 140 977 → 105 852 | 71.4% → 93.8% |
| 1024 | 49 → 44 | 69 → **173** | 4 828 → 3 534 | 142 492 → 109 485 | 75.4% → 95.1% |
| 1280 | 56 → 58 | 69 → **219** | 4 188 → 2 567 | 123 932 → 84 957 | 69.3% → 95.6% |
| 1440 | 56 → 55 | 69 → **251** | 4 188 → 2 292 | 123 932 → 78 570 | 61.6% → 96.3% |
| 1600 | 56 → 57 | 69 → **272** | 4 188 → 2 382 | 123 932 → 80 439 | 59.5% → 94.8% |
| 1920 | 56 → 53 | 69 → **329** | 4 188 → 2 020 | 123 932 → 71 976 | 49.5% → 92.3% |
| 2560 | 56 → 51 | 69 → **443** | 4 188 → 1 716 | 123 932 → 65 562 | 37.1% → 87.0% |
| 3840 | 56 → 39 | 69 → **663** | 4 188 → 1 471 | 123 932 → 61 355 | 24.7% → 76.2% |

**The `before` column is the finding as much as the `after` one.** From 1280 upward it is one reading
repeated six times — 4 188 lines, median 56, worst 69, 123 932px — because above about a thousand
pixels the column was capped and the screen was not, so five of the nine widths a reader has were the
same page. After, every width answers differently. That is the owner's criterion, and it is met.

### The method page, which is the worst case in both directions

It is the page whose every element is prose, so it gained the most and it is where the line gets
longest.

| width | median | worst | prose lines | height px | ink |
| --- | --- | --- | --- | --- | --- |
| 390 | 42 → 42 | 60 → 60 | 2 561 → 2 561 | 73 024 → 73 024 | 89.3% → 89.3% |
| 810 | 57 → 96 | 69 → 135 | 1 940 → 1 187 | 56 665 → 37 034 | 66.2% → 94.9% |
| 1024 | 57 → 123 | 69 → 173 | 1 940 → 967 | 56 665 → 31 261 | 52.1% → 96.0% |
| 1280 | 57 → 156 | 69 → 219 | 1 940 → 812 | 56 665 → 27 200 | 41.6% → 96.8% |
| 1440 | 57 → 175 | 69 → 251 | 1 940 → 743 | 56 665 → 25 387 | 36.9% → 97.2% |
| 1600 | 57 → 194 | 69 → 272 | 1 940 → 687 | 56 665 → 23 911 | 33.2% → 97.5% |
| 1920 | 57 → 233 | 69 → 329 | 1 940 → 602 | 56 665 → 21 686 | 27.6% → 97.9% |
| 2560 | 57 → 217 | 69 → 443 | 1 940 → 513 | 56 665 → 19 351 | 20.7% → 98.4% |
| 3840 | 57 → 226 | 69 → 663 | 1 940 → 412 | 56 665 → 16 698 | 13.8% → 98.9% |

**It is a quarter of the height it was and its lines are four times as long.** A reader at 3840 scrolls
past 412 lines instead of 1 940.

### A contract page

`number/parse@1`, whose case tables keep a call column of `minmax(0, var(--measure))` and are
untouched, so it moves less than the method page by construction.

| width | median | worst | prose lines | height px | ink |
| --- | --- | --- | --- | --- | --- |
| 390 | 41 → 41 | 62 → 62 | 760 → 760 | 25 087 → 25 071 | 87.2% → 87.2% |
| 810 | 56 → 59 | 69 → 133 | 580 → 419 | 20 258 → 16 199 | 79.4% → 94.0% |
| 1024 | 30 → 30 | 68 → 124 | 747 → 672 | 20 581 → 18 636 | 95.2% → 95.2% |
| 1280 | 56 → 58 | 69 → 170 | 580 → 456 | 15 901 → 13 443 | 94.4% → 96.2% |
| 1440 | 56 → 56 | 69 → 202 | 580 → 397 | 15 901 → 12 081 | 83.8% → 96.6% |
| 1600 | 56 → 58 | 69 → 170 | 580 → 440 | 15 901 → 13 038 | 89.7% → 92.7% |
| 1920 | 56 → 56 | 69 → 239 | 580 → 368 | 15 901 → 11 432 | 74.6% → 94.0% |
| 2560 | 56 → 52 | 69 → 282 | 580 → 313 | 15 901 → 10 501 | 55.9% → 95.5% |
| 3840 | 56 → 48 | 69 → 467 | 580 → 279 | 15 901 → 10 035 | 37.2% → 97.0% |

**The column is not monotonic in the width and the reason is the two thresholds it crosses.** At 1024
the frame is exactly `64rem`, where the shell gains its navigation column; between 1440 and 1600 it
crosses `97rem`, where a table of contents takes a third column and the content column gives up its
width — which is why the worst line at 1600 is shorter than at 1440. Both were true before this unit
and were invisible then, because the column was capped below the width either threshold hands it.

### Nothing breaks, and that is a reading rather than an absence of complaint

Three things were swept at every width on every page: whether the document scrolls sideways
(`scrollWidth > clientWidth`), whether any element is painted past the viewport, and whether two
block-level siblings that should stack are drawn over one another by more than a quarter of the smaller
one's area.

**Zero sideways scrolls and zero overlaps, at all nine widths, before and after.** One element is
painted outside the viewport: the copy control of `string/levenshtein@1` at 390, at `left 346, right
392` in a 375px layout. **It reads identically before and after** and belongs to the install block,
which this unit was told not to touch — so it is recorded below as older than this change and left
alone.

**The four pages that still hold little ink at 3840 hold little matter.** `/typescript/array/` reaches
37.5% of the screen and `/typescript/number/` 38.1%, and their content column is full width — what
stops at 1 442px is the longest sentence they contain. That is a page with three lines on it, not a
page with a ceiling.

## Considered Options

**Remove the rule on prose and keep `--two-columns`.** Refused on the owner's own sentence rather than
on a measurement: the constant is a width stated in characters, and it would have frozen every page at
933px from 1280 to 3840, which is the state the decision was taken against. It is the reading that made
the question worth asking him rather than answering alone.

**Give `.use-cases` its own ceiling, derived from its own floor.** `2 * 22rem + gap` is derivable and
would have satisfied both guards. Refused because the ceiling's written argument is a comparison with
the rest of the page, and the rest of the page moved.

**Re-derive the `97rem` threshold from the tracks it now separates.** That means choosing a width for
the content column, which is the one thing the owner withheld. Left at its value and recorded as a
number with nothing behind it.

**Keep the `div.opening` and stack it in one column.** Refused as dead structure: a wrapper and five
`section`s that no rule lays out. Flattening was measured to change nothing — **identical across nine
widths and fourteen pages on lines, median, worst, height, span and the count over 75**.

## Consequences

- **No box on this site carries a ceiling.** Every surviving `max-width` is `100%`, which is the
  containing block and bounds nothing. `every-ceiling-on-a-box-is-derived-and-never-typed` is unharmed
  and its claim is now stronger than it was: not *derived rather than typed*, but *there are none*.
- **`--the-longest-line: 75` names the width of a call column.** `--measure` survives to size three
  boxes and not one of them is a line of prose: a settled case's call column, the half of the card that
  carries a signature, and the list floor above. All three were named untouchable by the same decision,
  so the token keeps a name that no longer describes it. **That is this record's own orphan and it is
  declared rather than fixed.**
- **The `97rem` threshold lost the arithmetic that justified it.** It was the one of three typed widths
  whose sum was written down; the `933` in that sum was the content column's ceiling. The entry in
  `CLAUDE.md` about a breakpoint being the arithmetic of the lengths it separates **got worse without
  moving**.
- The geometry declarations of the stylesheet fell from **40 to 30**, counted inside the `STYLE`
  literal with comments stripped and `@media` conditions excluded.
- `.use-cases` and `ul.contracts` now take as many columns as they have items on a wide screen: four
  use cases at 793px each at 3840, five contracts at 665px. Neither was chosen; both follow from floors
  that were already there.

## Confirmation

**The three guards named above are what this change was checked against, and not one of them can see
it.** That is stated first because it is the most important thing in this record.

`every-ceiling-on-a-box-is-derived-and-never-typed` and
`every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` read the stylesheet's *text*.
`the-rail-of-a-page-names-every-section-of-it-and-only-those` is what makes the opening's structure
removable at all — the rail is derived from the same value either way, so a wrapper can go without an
entry pointing at a heading that is gone. All eight suites were green before this change and after it,
and **would have been green had it broken every page in the tree.**

**The population is the thirty geometry declarations above, and every one of them is
`one-directional`.** `pages.test.ts` builds documents and reads their text; nothing in this repository
lays a page out. The entry for this in `CLAUDE.md` has now been paid for five times, and this unit is
the fifth: the whole of it was decided in an inspector and settled by a browser sweep, and no suite
took part in either.

**Two battery cells lost their anchors and `npm run anchors` said so**, which is the tool working. W-86
is the same mutant re-quoted against a rule that became one line. **W-85 is worth reading**: it typed a
ceiling the shell no longer has, so it now puts one back — `78rem`, the exact number ADR-0122 removed —
and that is the most plausible edit anybody makes to this stylesheet after this record. The cell reads
better than it did.

**A method note, because it invalidated a reading before it was caught.** The first sweep taken in a
freshly started browser disagrees with every sweep after it: `date/add@1` at 390 read 696 lines and
23 266px cold, and 700 and 23 515 on four consecutive warm runs of the same tree in the same session.
The cold reading was briefly attributed to the flattening. **Every figure in this record is warm**, the
sweep discarding one full pass before the one it keeps.

## What would reopen this

- **The line becoming a complaint.** `45 to 75 characters is the span a line stays readable across` is
  still declared in the stylesheet and is now enforced by nothing. The method page's median passes 75
  at 810 and reaches 226 at 3840. **Whether that wants a ceiling is the owner's decision and this
  record does not make it**; what it supplies is the width at which the span is left and by how much.
- **The redesign that follows this unit.** It is asked to go over the whole of the design and the
  responsive behaviour, and every length here is in its scope.
- **A second reader.** One reading in an inspector is what removed the ceiling; it is not evidence
  about any other part of the page.

## Noted and deliberately not repaired

Found by this unit's sweep, outside its subject, and left for the redesign:

- **The wordmark breaks mid-word at 390, on every page.** `toopo` renders as `toop` / `o`: the masthead
  is a flex row and `ul.menu` wraps before the wordmark does, leaving `.wordmark` a 39px box that
  `overflow-wrap: anywhere` then breaks. Measured on both trees — `lineBoxes` 2, width 39px, height
  52px at `ab2765c` and at `c375348`, identical — so it is older than this change. It is the most
  visible thing this unit's sweep found and it is in the masthead, which the decision did not reach.
- **The copy control overflows at 390 on `string/levenshtein@1`** by 17px, in the install block. Older
  than this change and identical either side of it.
- **The card's void grew with the column.** ADR-0132 measured 353px of nothing to the right of the card
  and refused to fix it by widening; the card is now the column's width at every screen, so the void it
  refused to move is larger. It is the same finding at a new size, not a new one.
- **`--measure`, `--the-longest-line` and `--a-contract-in-a-list` carry names that describe a line and
  size boxes.** Renaming them touches the case table and the card, both named untouchable here.
- **The `97rem`, `64rem` and `52rem` thresholds** are now three typed widths with no arithmetic
  between them.
- **ADR-0133's prose-line counts cannot be rebuilt.** Its eight heights reproduce to the pixel and its
  nine-line delta exactly; its base of 594 → 585 matches neither of the two populations its own table
  declares — 601 with navigation, 580 without. The rendering agrees and the counting does not, and
  nothing here establishes how.

## More Information

- [ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md) — where a ceiling belongs
  to a block, which is what made three of the four removals legible.
- [ADR-0123](0123-a-wide-screen-is-filled-by-a-column-and-never-by-a-longer-line.md) — the record whose
  title this overturns, and whose two-abreast lists it leaves standing.
- [ADR-0132](0132-a-void-is-matter-that-is-missing-and-never-a-ceiling-to-remove.md) — the two-abreast
  opening this removes, and the void it refused to fix by widening.
- [ADR-0133](0133-what-a-page-is-long-in-is-measured-and-it-is-not-the-wrapping.md) — the reading that
  bounded the wrapping at 3.7% under a ceiling, and which this replaces by removing the ceiling.
- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — the visual system,
  untouched: six sizes, one spacing unit, one accent.
