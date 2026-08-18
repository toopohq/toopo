---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
  - packages/site/catalogue-page.ts
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length
  - battery: site
    guard: every-ceiling-on-a-box-is-derived-and-never-typed
  - battery: site
    guard: every-command-the-site-tells-a-reader-to-run-carries-the-invocation
---

# A wide screen is filled by a column and never by a longer line

## Context and Problem Statement

ADR-0122 took every typed ceiling off this site and named, in its own reopening section, the thing it
had not done: *a reading of the front page as something other than a list. The 19.8% above is a
measurement of a page whose every element is prose. It is not evidence that the page is right; it is
evidence that no ceiling is what makes it narrow.* This is that unit.

Measured at `eefca18` over all eleven files of HTML the tree holds, at 1440, 1920 and 2560, in a real
browser, with **the share defined exactly as ADR-0122 defines it** — the span of rendered ink over the
width the layout resolved against, taken from text rectangles rather than boxes, clipped to every
scroll container above them, with the masthead left out:

| page | 1440 | 1920 | 2560 |
| --- | --- | --- | --- |
| `/` | 505px · 35.4% | 505px · 26.5% | **505px · 19.8%** |
| `/method/` | 526px · 36.9% | 526px · 27.6% | 526px · 20.7% |
| `/refused/` | 519px · 36.4% | 519px · 27.2% | 519px · 20.4% |
| `/typescript/number/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% |
| `/typescript/date/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% |
| `/typescript/string/` | 757px · 52.6% | 757px · 39.4% | 757px · 29.6% |
| `number/parse@1` | 1169px · 82.0% | 1169px · 61.4% | 1169px · 45.9% |
| `date/add@1` | 1169px · 82.0% | 1169px · 61.4% | 1169px · 45.9% |
| `string/levenshtein@1` | 1169px · 82.0% | 1169px · 61.4% | 1169px · 45.9% |
| `string/slugify@1` | 1173px · 82.3% | 1173px · 61.6% | 1173px · 46.1% |
| `404.html` | 435px · 30.2% | 435px · 22.7% | 435px · 17.0% |

**The reading agrees with ADR-0122's own table to a tenth of a point on every one of the 33 cells**,
which is what says the harness is that method and not a second one. Where the two differ is the line
count under it — 11 913 lines here against the 4 008 that record published — and neither this record
nor that one can say which population the smaller figure was over. What is comparable is a before and
an after taken by one harness in one sitting, and that is what is below.

## Decision

**The width comes from a second column. The line does not move.**

`--measure` is untouched. A page fills a wide screen by putting something in the space, never by
letting a sentence run into it, and the two are opposite repairs that look alike from a distance.

### The column beside the content, on both sides of it

A contract page's navigation and its table of contents were stacked in one column on the left, which
left the entire right of the page empty. They separate: the navigation stays left, the table of
contents crosses to the right, and the front page gains a column of its own on the right.

**The table of contents does not leave its parent in the document, and could not.** CSS cannot
reparent an element, and the two halves must stay one sticky block in the band where they are stacked
— two sticky boxes in one column overlap. So `.beside` becomes `display: contents` at the widest band
and its two children become cases of the page's own grid. **The DOM is byte for byte what it was**, so
`the-rail-of-a-page-names-every-section-of-it-and-only-those`, every projection and every screen
reader see the page they saw before.

### The front page's column is a move and not an addition

Its three secondary sections — the domains, the refusals and how we verify — were queued under the
catalogue in one column. They are now beside it. **Not one word changed**, and they keep their `h2`,
so the outline, the Markdown twin and the sitemap are identical: the tag is the outline and the class
is the look, and only the class moved. ADR-0025.

**The split is not *long prose stays and short prose moves*, and one measurement is why.** The first
arrangement left *what a contribution can be* in the content column, and at 390 that puts a section
addressed to the few people who will send something above the claim this project is sold on. So the
line is: **the content column is the catalogue, and the column beside it is everything else.**

**Four figures are the only matter this unit adds to the site**, and they are derived by
`theMeasurement` from the batteries rather than typed. There is no survivor total among them:
`the-readme-never-gives-a-survivor-total-without-its-split` refuses exactly that one repository over,
and a rule that holds on one surface and not the other is not a rule. The sentence under the figures
already said where the split is, so nothing had to be written.

### Two ends of one span, and one length that is not derived

The column of secondary matter needed a width, and the stylesheet already declared the answer without
deriving it: *45 to 75 characters is the span a line stays readable across*, of which only the top was
a length. `--the-shortest-line: 45` gives `--aside`, and **no number entered this stylesheet that was
not already argued for in it**.

Every ceiling is its own arrangement's tracks and gutters added up:

| arrangement | ceiling |
| --- | --- |
| navigation and content | `--rail + --two-columns + 3 * --s6` |
| content and the column beside it | `--two-columns + --aside + 3 * --s6` |
| navigation, content and the table of contents | `--rail + --two-columns + --aside + 4 * --s6` |

**One length in this stylesheet is typed, and it is typed because the language has no other spelling.**
`var()` is not allowed in a media query's condition, in any browser. The three-column threshold is
therefore the arithmetic of its own row above — 240 + 933 + 268 + 96 resolves to 1 537px on this
machine's system font — rounded up to `97rem`. What makes the rounding safe rather than lucky is that
the content track is `minmax(0, 1fr)`: a face whose zero is wider squeezes the middle column instead of
pushing the page past the viewport.

**The contract list has no threshold at all.** `repeat(auto-fit, minmax(min(var(--a-contract-in-a-list),
100%), 1fr))` with a measure as the floor is two abreast exactly where the column is two measures wide
and one everywhere else. The floor is the value, and putting the list back to one column is that one
token — which was asked for, because whether an index of five reads better in one column or two is a
judgement that will be taken again.

### The domain page keeps two columns

The mock-up draws three everywhere and this record refuses the third here, because **there is nothing
to put in it**. A domain page has no table of contents, its only headings are the contract names its
left rail already lists, and the four figures the mock-up puts on the right are the four
`whatIsHere` already composes into the page's opening sentence — which ADR-0121 composed precisely so
that they would not be stated a fifth time. The screen is filled instead by the same list going two
abreast, which says nothing twice. **The objective was never three columns.**

## What it measures out at

| page | 1440 | 1920 | 2560 |
| --- | --- | --- | --- |
| `/` | 1224px · 85.9% | 1224px · 64.3% | **1224px · 48.1%** |
| `/method/` | 526px · 36.9% | 526px · 27.6% | 526px · 20.7% |
| `/refused/` | 519px · 36.4% | 519px · 27.2% | 519px · 20.4% |
| `/typescript/number/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% |
| `/typescript/date/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% |
| `/typescript/string/` | 1173px · 81.5% | 1173px · 61.1% | **1173px · 45.8%** |
| `number/parse@1` | 1169px · 82.0% | 1422px · 74.6% | **1422px · 55.9%** |
| `date/add@1` | 1169px · 82.0% | 1422px · 74.6% | **1422px · 55.9%** |
| `string/levenshtein@1` | 1169px · 82.0% | 1422px · 74.6% | **1422px · 55.9%** |
| `string/slugify@1` | 1173px · 82.3% | 1422px · 74.6% | **1422px · 55.9%** |
| `404.html` | 435px · 30.2% | 435px · 22.7% | 435px · 17.0% |

**The measure held, which was the thing at risk.** Over the eleven pages at the three widths: **0 of
11 964 prose lines over 75 characters, worst 70** — against 0 of 11 913, worst 70, before. At 390 the
reading is 0 of 5 101, worst 63, against 0 of 5 096, worst 63.

**Three of the eleven did not move, and it is the same answer ADR-0122 gave.** Every child of the
method page, the refusals page and the 404 is a prose element, prose is bounded on the line, and no
column was ever what bound them. Adding a column to them would be adding matter, which this unit is
not for.

**`/typescript/number/` and `/typescript/date/` did not move either, and that one is arithmetic.** Each
holds one contract, so a list that goes two abreast where there are two has nothing to do.

## Consequences

- The stylesheet gains one declared length, one value, three arrangements and one typed threshold. The
  threshold is the only width here that is not derived, the reason is a limitation of media queries,
  and it is written beside the arithmetic it came from.
- **A guard exists that did not.** `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length`
  is the ceiling guard's claim on the axis that guard declines to read: it says so in its own comment,
  and this unit is what turned that limit into a hole by moving the layout from one ceiling to three
  arrangements of tracks. A floor is admitted and is not an exception — `minmax(8.5rem, 1fr)` says
  *not under this*, which is a statement about when a column appears rather than about how wide a page
  is. Seen red before it was believed: with the three-column arrangement typed as
  `240px minmax(0, 1fr) 268px`, the fault reads both lengths, and `W-86` of the site battery is that
  mutant.
- **`every-command-the-site-tells-a-reader-to-run-carries-the-invocation` was widened rather than left
  behind.** The front page now prints `npx toopo add domain/function`, the shape of every command at
  once, and the guard recognised an install instruction by the fact that it names a contract of this
  catalogue — so the one command a reader meets before they know what a contract is called was the one
  command nothing kept. Recognition is now the shape of an address rather than the list of them:
  `add` followed by a slash-separated pair. Measured before it was believed — 24 occurrences of
  `toopo add` across the tree, 24 carrying the invocation — and the thirteen mutant descriptions that
  made that guard's two earlier and wider sweeps red name a command as the subject of a sentence and
  never hand it an address, which is what the slash tests for.
- `aside` is the seventeenth tag, and it does not compile until all three projections have said what
  they do with it. Its argument is `main`'s read backwards: matter a reader may skip has to be
  skippable, and `complementary` is what says so to somebody who is not looking at the columns.
- **One defect was found by this unit's sweep and pre-dates it**, and it is repaired here rather than
  left: `.use-case > p` set a `margin` shorthand, so a use case opened 8px under its own title where
  every other heading on the site is followed by 12. That is the fifth instance of a trap the
  stylesheet already names four times — a shorthand on a class outranking `h2 + p` on specificity —
  and it was measured on `string/slugify@1` at all four widths.
- The three secondary sections of the front page are read after the catalogue rather than around it in
  every projection and on every narrow screen. That is a change to the reading order and it is the one
  editorial decision in a unit that changed no words.

## What would reopen this

**A contract page's table of contents growing past a column of its own.** `--aside` is 45 characters,
the short end of a span about *lines*, and a table of contents is a list of links rather than prose.
Nothing measured says 45 is right for a list; what says it is defensible is that no entry of any of the
four contract pages wraps at it. A contract with longer section names is the event.

**A catalogue large enough that the front page is not a list.** The 48.1% above is a page holding five
contracts in two columns. At a thousand the front page is a search result and this arrangement says
nothing about it — which is the same sentence ADR-0122 wrote about this unit, one size up.

**A second face.** Every length here resolves against `ch`, and the one threshold that cannot is
`97rem`, computed from `ch` on one machine. The day this site is read where the system monospace or
sans is materially wider, the three-column band starts one step late or one step early. It degrades by
squeezing rather than by overflowing, which is why it is a threshold and not a ceiling — but it is the
one number here that a different machine can make wrong.
