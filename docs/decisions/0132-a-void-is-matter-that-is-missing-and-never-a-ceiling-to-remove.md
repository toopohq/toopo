---
status: accepted
date: 2026-08-19
governs:
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-word-of-every-page-survives-every-projection
  - battery: site
    guard: every-heading-of-a-page-is-a-heading-in-its-markdown
  - battery: site
    guard: no-element-runs-into-the-one-beside-it
  - battery: site
    guard: every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown
---

# A void is matter that is missing and never a ceiling to remove

> **The ceiling was removed after all, and by the owner rather than by an argument.**
> [ADR-0134](0134-a-width-stated-in-characters-and-a-layout-that-follows-the-screen.md) takes out the
> bound on prose and every length derived from it. That does not retract what is below: this record
> refused *widening the column* as a repair for a void **while the page was capped**, and it was right
> — the void moved inside the card, which is measured here and still reproducible. ADR-0134 is a
> different act, and it is not a repair for a void.
>
> **Two things below are now false rather than dated.** The two-abreast opening this record built is
> gone, so the void it measured has no grid to sit in. And the reopening trigger it wrote for the
> `97rem` threshold — that the rail cannot share a column with a 905px case row — is unchanged in
> substance and changed in setting: there is no shell ceiling left for the threshold to be arithmetic
> against.
>
> Its measurements keep their coordinates and were taken at `0cec957`, on a site with a ceiling on
> prose.

## Context and Problem Statement

The owner read a contract page on his own screen at 1440 and asked for two things: that the centre
column reach the end of its container, and that the responsive hold at every size. His reading, taken
before the request was sent: `.shell` grows from 1 245 to 1 537 between 1440 and 1920, `main` is 933 at
both, the card is 580, the prose 447, and 353px to the right of the card carry nothing.

**Three of those figures are exact and the sentence around them was not.** *`main` holds nothing wider
than 580* is false: twelve settled-case tables reach 905 and the chip list reaches 904. What replaces
it, measured at `0cec957` over rendered text rectangles with the masthead excluded — ADR-0122's
definition, applied to the content column rather than to the whole page, so **these shares are not that
record's and do not compare with them**:

- on `number/parse@1` at 1440 the **median block reaches 431px of 933, or 46%**, and 12 of 71 blocks
  reach 90% of the column;
- on `array/group-by@1`, which is a refused contract and therefore has neither card nor case table,
  **no block reaches 90%** and the widest reaches 500 of 933;
- the one-contract family pages are the same shape at 512 of 933, and `/typescript/array/` — which
  carries a refusal and no contract — has a median block at **24%**.

**And nothing at all moves between 1280 and 2560.** Four widths, one reading: 4 429 prose lines, worst
69 characters, median 56, column 933, widest ink 905. The owner's 1440-against-1920 comparison is the
general case rather than a coincidence of two widths.

### The measure was re-taken, and the gap it shows is a margin rather than an error

`--measure` divides by `1.393 * 1.04`, and the owner measured that the page renders 65 characters at
worst rather than 75, and asked whether the divisor matches what the page draws.

Re-measured at `0cec957` over every file of HTML in the tree at 1440 — one `Range` per character,
grouped into line boxes by vertical overlap, density read against each element's own `ch`: the densest
line in a box of exactly this measure is **1.3342 characters per ch**, and the worst line rendered
anywhere is **69**. The model is exact rather than indicative: `75 * 1.3342 / 1.4487` is 69.1. So the
gap is **8.6%** and not 15% — the 15% came from one page whose worst line is 65 — and it decomposes
into 4% of declared drift and 4.2% of density that has fallen since it was taken over eight pages.

**It cannot be spent, and the two reasons are arithmetic.** Measured at the same commit, the same width
and the same population:

| divisor | measure | content column | void right of the card | worst line | over 75 |
| --- | --- | --- | --- | --- | --- |
| 1.4487 — in force | 447 | 933 | 353 | 69 | 0 |
| 1.3876 — density re-measured, drift kept | 466 | 972 | **368** | 72 | 0 |
| 1.3342 — density with no margin at all | 485 | 1 010 | **384** | **77** | **1** |

Density is not stationary: a wider box breaks the same sentences at different words and the density
rises to meet it, so spending the margin breaks the ceiling. And `--two-columns` is two measures, so
the column grows twice as fast as the line — **widening prose to fill a column widens the column by
more than it fills**. The divisor does not move, and this is why rather than an oversight.

## Decision Outcome

### The finding is the sentence, and the two proposed repairs are what established it

The request named two forms. Both were injected into a browser and measured, and both fail — for
different reasons, which is what makes the conclusion an argument rather than a preference.

**The column tightens on what it contains**, as `fit-content` on the content track: it works on the
pages holding nothing wide, does nothing at all on `number/parse@1` where the case table already asks
for 933, and **breaks the two-abreast list** — `/typescript/string/` falls from 909px of ink to 493 and
the front page from 923 to 505. The cause is not a detail of this stylesheet: under an indefinite
constraint `repeat(auto-fit, …)` repeats **once**, so a track that asks a two-abreast list how wide it
wants to be is answered *one contract*.

**The card fills the column**, as `width: auto`: the card reaches 933 and the void moves inside it —
727px unused beside the address, 814 beside the name, 590 beside the command, 445 beside the signature,
with the card's own median block at **41% of 883**. That is the objection ADR-0122 recorded when it
made the card `fit-content`, arriving one floor down.

So: **a void is matter that is missing and never a ceiling to remove.** Neither form was the right
question, and what each of them moved is what says so.

### What that finding asked for was refused, after being measured

The only matter a contract page could put in the right half of its column is the table of contents,
which today stands in the shell and is sticky for the whole page. **A sticky rail and a 905px case row
cannot share a column** — a block spanning both tracks runs underneath the rail — so the rail can only
stand beside a region holding no wide block, and this page's wide region is contiguous and long.

Measured by building that arrangement in a browser at `0cec957`: the rail would accompany **13.7% of
`number/parse@1` and 23.2% of `string/slugify@1`**, against 100% today. Refused. **`97rem` therefore
does not close**, and `CLAUDE.md`'s entry naming this unit as the one that would close it for nothing is
corrected in this commit rather than struck.

### The card is the column's width, and it is read across

The card is the first thing on the page and the thing that tells a reader how wide the page is; at 580
in a 933 column it said 580 while every table under it said 905. It now fills the column with two
groups: what it is called, how to get it and what it answers on one side, what it costs on the other.

**The two are not halves, and that is measured.** With even halves the signature sits in 422px, and a
`pre` does not wrap at any width, so 455px of type scrolls. The half carrying the signature grows and
the half carrying three numbers does not — `flex: 1 1 var(--measure)` against `flex: 0 1 var(--aside)`,
both of them lengths this stylesheet already declares and argues for.

**One consequence is about the document rather than the layout, and it is a change rather than a
side-effect**: the signature now precedes the figures in the reading, where ADR-0116 named the card as
name, sentence, command, figures and signature. Nothing asserts that order, and putting it back with
`order` is refused for the reason ADR-0121 refuses it — a visual order the document does not have is
one a screen reader and `toText` disagree with.

### The opening is its sections, two abreast where there is room for two

`halves.summary` was already a list of sections and was flattened into `main`; a run of headings with
their bodies between them is not something any layout can place. They are `section` elements now, in a
grid whose floor is a measure — so a second column appears exactly where it would be a column of prose
and never a squeezed one, which is the condition `ul.contracts` already folds on and which needs no
width written for it.

**A section left alone on its row keeps the measure it has today**, which is what makes this a gain and
not an exchange: the arrangement can only ever fill width that was empty.

### A page whose widest block is a line is bound by the line

The blocks that ask for more than a measure name themselves — `.card`, `.cases`, `.chips`,
`.use-cases`, and a contract list with a second entry to put in a second column. A shell holding none
of them asks its content how wide it wants to be. `fit-content` is scoped by `:has()` rather than
applied generally, for the measurement above: every page this selector reaches holds no `auto-fit` list
for it to answer wrongly.

## Consequences

Measured at 1440, and identical at 1920 and 2560 — the column, the widest ink, the share of the column
the median block reaches, and how many blocks reach 90% of it:

| page | column | widest ink | median block | reaching 90% |
| --- | --- | --- | --- | --- |
| `/` | 933 → 933 | 923 → 923 | 38.0% → 38.0% | 1/7 → 1/7 |
| `/typescript/array/` | 933 → **530** | 503 → 503 | 24.3% → **42.8%** | 0/5 → 1/5 |
| `/typescript/date/` | 933 → **530** | 512 → 512 | 46.8% → **82.5%** | 0/4 → 1/4 |
| `/typescript/number/` | 933 → **530** | 512 → 512 | 45.7% → **80.4%** | 0/4 → 1/4 |
| `/typescript/string/` | 933 → 933 | 909 → 909 | 52.8% → 52.8% | 1/4 → 1/4 |
| `array/group-by@1` | 933 → **530** | 500 → 500 | 37.8% → **66.6%** | 0/12 → 1/12 |
| `date/add@1` | 933 → 933 | 905 → **933** | 46.2% → 47.1% | 12/67 → **14/67** |
| `number/parse@1` | 933 → 933 | 905 → **933** | 46.2% → 47.1% | 12/71 → **14/71** |
| `string/levenshtein@1` | 933 → 933 | 905 → **933** | 46.2% → 47.2% | 7/48 → **9/48** |
| `string/slugify@1` | 933 → 933 | 909 → **933** | 46.3% → 47.3% | 12/66 → **15/66** |

The four pages with no shell are left out rather than reported as unchanged: they sit directly in the
body's own track, so the column this reading is taken against is the viewport, and the figure would say
nothing about them.

The opening, taken as the span from the card's bottom edge to the divider's top, and the page's whole
height, both at 1440:

| page | opening | page height | card |
| --- | --- | --- | --- |
| `number/parse@1` | 1 947 → **1 510** | 17 017 → 16 486 | 580 → 933 |
| `date/add@1` | 2 259 → **1 821** | 15 697 → 15 167 | 612 → 933 |
| `string/levenshtein@1` | 2 067 → **1 629** | 10 631 → 10 100 | 580 → 933 |
| `string/slugify@1` | 2 794 → **2 517** | 15 973 → 15 604 | 580 → 933 |

**The measure held, which was the thing at risk.** Over every file of HTML in the tree at 390, 810,
1024, 1280, 1366, 1440, 1600, 1920 and 2560: **0 lines over 75 characters, worst 69**, and no page
scrolls sideways at any of them — against 0 and 69 before, on the same populations.

**What is not closed is stated rather than left to be inferred.** A contract page's prose still reaches
447 in a 933 column, and its median block moves only from 46.2% to 47.1%. That is structural: the column
is 933 because twelve blocks need 905, the line is 447 because it is 75 characters, and the only matter
that could stand between them is the rail, measured above and refused. **Two of the owner's three
figures survive this unit unchanged**, and the one that moves is the one he was looking at.

**Two edges were found by measuring the widths a reader really has**, and neither is repaired here:

- **1288.** The front page's catalogue is one column at 1280 and two from 1288, because `auto-fit`
  folds at two measures and a gap. Eight pixels decide it, and 1280 is an ordinary laptop width. Moving
  it means typing a width, which `every-ceiling-on-a-box-is-derived-and-never-typed` refuses; a fold
  derived from the measure lands where the measure puts it.
- **1552.** The third column is gated on `97rem`, so at 1440 the right of the screen carries nothing.
  The rail is what would fill it, and the paragraph above is why it cannot.

## Confirmation

The five guards named above are what this change put at risk, and all five hold: the rail is still
derived from the same section list it now wraps; every word survives both projections; every heading of
a page is a heading in its Markdown twin; the card's two groups do not read as one sentence; and the
figures are still quantities with their breakdowns beside them.

**None of them reads a layout, and this record does not pretend otherwise.** `pages.test.ts` builds
documents and reads their text; nothing in this repository lays a page out. Every measurement here was
taken by hand in a browser, and every declaration this unit adds is `one-directional` — which is why
the population, the layout declarations of `packages/site/style.ts`, is on the list in `CLAUDE.md`
rather than described as covered. The trade that would close it is a browser as a dev dependency,
priced twice already on that list and deliberately not taken in a unit whose subject is a layout.

## What would reopen this

- **A contract page whose opening carries an even number of sections throughout.** The gain measured
  here is bounded by the row a lone section leaves half empty; `string/slugify@1` has four sections and
  the other three have three.
- **A block of a contract page that is neither prose nor a case table.** The list naming what asks for
  more than a measure is a list, and a sixth wide block added without being named there would be bound
  by a rule about lines.
- **Anything that lets the rail stand beside a page holding wide blocks.** That is what would fill the
  remaining half of a contract page's column, and it is the same event `97rem` closes on.

## More Information

- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) settles what the card carries.
- [ADR-0119](0119-the-page-is-read-in-two-halves.md) settles the two halves and the divider.
- [ADR-0122](0122-a-ceiling-belongs-to-the-block-and-never-to-the-column.md) is the reading this one
  extends, and the record that made the card `fit-content`.
- [ADR-0123](0123-a-wide-screen-is-filled-by-a-column-and-never-by-a-longer-line.md) is where the
  measure's calibration and the typed `97rem` were last taken.
