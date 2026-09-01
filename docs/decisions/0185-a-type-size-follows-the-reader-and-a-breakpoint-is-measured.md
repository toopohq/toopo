---
status: accepted
date: 2026-08-30
governs:
  - packages/site/style.ts
  - packages/site/components.ts
  - packages/site/chrome.ts
confirmed-by: []
---

# A type size follows the reader, and a breakpoint is measured

## Context and Problem Statement

The owner read the front page at 320 and found the masthead unreadable: `How we verify` broken into
four vertical pieces, `GitHub` one letter to a line, the field truncated to `Sea`, and a bar occupying
about 180px where it declares 56.

**Two faults were tangled together and they are separate chantiers.** Measured at `f2ea3a1`, inside the
`STYLE` literal with comments stripped: `style.ts` held **46 pixel lengths and no pixel type size** at
`a9236dd`, before the redesign, and **99 pixel lengths of which 13 were type sizes** after it. The
component layer added eight more. So the redesign copied the artboard's pixels instead of landing them
on the scale that exists — and **a pixel type size ignores the reader's own font-size setting**, so
somebody who enlarged their text because they cannot read small print received nothing. That is a
defect of access rather than a preference.

**The breaking at 320 is not caused by the pixels**, and that distinction decided the order of work.
Five flex children do not fit in 272px of content at any unit. The scale and the absence of width
conditions are two problems and both were needed.

## Decision Outcome

### Every type size follows the reader

**Twenty-one pixel type sizes are gone and none moved at the default settings.** Eight land on the
scale the stylesheet already declares and take its steps — 16 is `--t3`, 15 is `--t4`, 13 is `--t5`,
11 is `--t6`. Twelve have no step and are stated in `--a-point`, a sixteenth of the root multiplied by
the artboard's own number, so the number stays legible against the source it came from and every call
site is greppable as a size that is not on the scale. The headline is `2.5rem`.

Nothing moves at the default, and that is arithmetic rather than a hope: `calc(N * (1rem / 16))`
resolves to exactly N pixels at a 16px root. Measured in a browser over sixteen selectors, every one is
byte-identical across the change. And the fix is confirmed by contrast: at a 32px root every converted
size doubles while the headline, converted last, stayed at 40px until it was.

### What this unit did not settle, and it is the owner's

**The artboard draws fourteen distinct type sizes across eighty-one declarations, and four land on the
scale.** ADR-0115 declares six steps and no seventh. The design and a recorded decision are in direct
conflict, and the redesign had been settling it silently by writing pixels. **Twelve of the fourteen
sit between 10.5 and 16, separated by half-pixels** — which is not a scale but the residue of
adjustment by eye, and *reproduce it exactly* would mean reproducing the adjustments. It is an entry of
the open list and the owner rules on it. What this unit separates is the half that is not a design
question at all.

### The techniques, three of which were already here

**`@container` is refused for the card on an arithmetic.** `.offers` floors at `--a-card` 18.75rem
inside `.listing` capped at `--the-page` with `var(--s6)` padding, so at 1440 it lays three tracks of
342.7px; at 390 it lays one of 342. **The card is the same width at both.** A container query on a box
whose width does not change buys nothing. The stylesheet already declares `container-type` on `main`
and uses one such query, so this is a technique in use, aimed here at an immobile box.

**`repeat(auto-fill, minmax(min(300px, 100%), 1fr))` is already the idiom** — seven `auto-fill` or
`auto-fit` and fifteen `minmax`, and `.offers` is literally that expression with the `min()` guard.
Nothing to adopt; it is why the cards were already right at 390.

**`clamp()` is refused for the headline, on the same kind of reading that refused the container
query.** A clamp needs a floor and nothing derives one: the longest word is 180px inside a 272px column
at 320, so the word-fitting derivation does not bind, and the artboard declares no size below the width
it is drawn at **because it carries no width condition at all** — zero `@media`, zero `@container`,
zero `@supports`, its `min-width` declarations being `0` three times and `150px` once, and its seven
`max-width` declarations all content ceilings. A floor chosen here would be a familiar number wearing a
derivation.

**Logical properties are refused**: zero uses today, one writing direction, and about 150 renames that
move no behaviour while making every stamped measurement in the records unverifiable by diff.
**`:has()` is already at ten uses.**

### A breakpoint is measured, and two of the three repairs needed none

**The bar fits at 320 with no condition at all** once the menu carries a mark instead of two labels.
*How we verify* is removed and not replaced — the owner's ruling, a contract's page being this
project's documentation — and the repository is drawn rather than spelled, in a box the size of the
theme button, with an `aria-label`. `/method/` is reached from `/catalogue/` and `/what-a-contract-is/`.

**The recent row needed no condition either.** Its name took a flex basis where it took a floor:
written as `flex: none` with a `min-width` it held 150px at 320 and pushed the row's own chevron 12px
outside the window.

**Three conditions are added and every one is derived.**

| condition | what it is | how it was measured |
| --- | --- | --- |
| `26rem` | the masthead field shows its placeholder | the placeholder is 122px, the field's own marks 68, the bar's other children 225 — so it first fits at 415px |
| `11rem` | the bar stops breaking its row | swept at 4px at a 32px root: fits from 11rem, fails at 10.88 |
| `12.5rem` | the row stops breaking | swept at 6px: fits from 200px, fails at 194 |

**The last two are in `rem` and that is the whole of why they work.** A condition in rem asks whether
the window is narrow *for the text in it*: 320px is 20rem at the default and 10rem at a 200 % setting,
and it is the same window. At the default root, 11rem is 176px and 12.5rem is 200px — narrower than any
device — so a reader who has not touched their font size never meets either break, and one who has
always does.

## What was measured, and one thing that could not be

**Over 17 pages and 12 widths from 320 to 2560, at the default settings: zero faults** — no text broken
mid-word, nothing outside the viewport, no page scrolling sideways. The front page alone was swept at
every 2px from 320 to 520, 101 widths, also zero. At 1440 every component matches the artboard on size,
radius, padding and border, and the two badges are 21px each.

**The detector is the one that was missing**, and it was corrected twice before it was trusted. Line
boxes are counted per text node and grouped by their top, because a Range returns several rects on one
line — counting rects alone reported three card names as broken that were not. A hyphen, a dot or a
bracket is a break the language offers, so an identifier may take a line per separator; anything past
that is a word broken in half, which is asked of the characters directly.

**The 200 % reading is incomplete and the reason is a property of the test.** In a media query, `rem`
resolves against the *initial* font size, not against the root element's — so setting
`documentElement.style.fontSize` moves every rem length and moves no condition. The mechanism was
verified instead at the width it corresponds to: the bar wraps at 172px and does not at 176px, which is
11rem exactly. **Whether a real 200 % setting fires it is not verifiable here** and is exactly what the
owner's own reading will decide.

**Two things are measured and not repaired.** At 320 the method page's field lists break words in half
— `publishe|d`, `mu|tant`, `prod|ucedBy` — and it is not fixable by a property: `overflow-wrap:
break-word` gives an identical reading, 15 breaks and no overflow, because the identifiers are longer
than the line. It is prose carrying schema paths, it predates this unit, and nothing overflows. And the
hero's field shows `Search a funct` at 320, which reads and is not broken.

## What would reopen this

- **The scale**, which is the entry this unit opened and the owner's to rule. Landing fourteen sizes on
  six moves the design; widening the scale to fourteen is not a scale.
- **A real 200 % reading**, which either confirms the two rem conditions or shows what they miss. It is
  the one part of the acceptance this repository cannot take for itself.
- **A second control in the masthead bar**, which is what the 11rem condition is measured against and
  what would move it.
- **The method page's field lists**, if somebody decides a schema path in prose should be marked as
  code and fold under ADR-0135's rule rather than break mid-word.
