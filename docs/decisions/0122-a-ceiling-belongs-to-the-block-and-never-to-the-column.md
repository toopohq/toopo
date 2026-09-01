---
status: accepted
date: 2026-08-18
governs:
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-ceiling-on-a-box-is-derived-and-never-typed
  - battery: site
    guard: every-colour-the-stylesheet-paints-with-is-a-role-it-declared
---

# A ceiling belongs to the block and never to the column

> **Every ceiling this record derived has been removed, and the sentence in its title is what removed
> them.** [ADR-0134](0134-a-width-stated-in-characters-and-a-layout-that-follows-the-screen.md)
> withdrew the bound on prose, and `--two-columns` — twice the same bound, one floor up — went with it,
> taking the body's middle track, all three shell arrangements and the use-case grid's ceiling. **The
> rule below is not what was overturned; it is what made the removal legible.** A block owning its own
> ceiling is exactly why `.use-cases` could lose one: the argument written for it here — *two abreast,
> which is what the 22rem floor was chosen for* — was a complaint about a block standing wide while the
> page around it was narrow, and the page is no longer narrow.
>
> Every measurement below keeps its coordinate and was taken on a site that had a ceiling on prose. The
> readings that were **about** that ceiling — 0 of 4 008 prose lines over 75, worst 69 — are true of
> `456ee44` and are not true now.

## Context and Problem Statement

The owner opened the site on a wide screen and said everything was centred and squeezed into the
middle for no reason. Measured at `456ee44`, over all eleven files of HTML the tree holds, at 1440,
1920, 2560 and 390, in a real browser:

| page | 1440 | 1920 | 2560 | 390 |
| --- | --- | --- | --- | --- |
| `/` | 446px · 31.3% | 446px · 23.4% | **446px · 17.5%** | 335px · 89.2% |
| `/method/` | 446px · 31.3% | 446px · 23.4% | **446px · 17.5%** | 335px · 89.3% |
| `/refused/` | 444px · 31.2% | 444px · 23.1% | **444px · 17.3%** | 322px · 85.8% |
| `/typescript/number/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% | 339px · 87.0% |
| `/typescript/date/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% | 325px · 86.7% |
| `/typescript/string/` | 757px · 52.6% | 757px · 39.5% | 757px · 29.6% | 326px · 87.0% |
| `number/parse@1` | 983px · 69.0% | 983px · 51.6% | 983px · 38.6% | 327px · 87.2% |
| `date/add@1` | 984px · 69.0% | 984px · 51.6% | 984px · 38.7% | 327px · 87.2% |
| `string/levenshtein@1` | 984px · 69.0% | 984px · 51.7% | 984px · 38.7% | 327px · 87.2% |
| `string/slugify@1` | 984px · 69.0% | 984px · 51.6% | 984px · 38.7% | 327px · 87.2% |
| `404.html` | 435px · 30.2% | 435px · 22.7% | **435px · 17.0%** | 346px · 88.7% |

**The share is the span of rendered ink over the width the layout resolved against**, and the
definition is not a detail. It is taken from text rectangles rather than from boxes, clipped to every
scroll container above them, with the masthead left out because the chrome spans the width by
declaration and would answer 100% on every page. A box can be wide with its text narrow, which is
the other half of this same defect, so measuring boxes would have hidden it.

**Three ceilings were in play, and the diagnosis named the least of them.** The owner's arithmetic
was about `main { max-width: 45rem }` on a contract page. Underneath were two more:

- `.shell { max-width: 78rem }`, which centred a 1 248px layout on a 2 560px screen and **named no
  question anywhere in this repository** — no comment, no record, nothing that `grep 78rem` finds
  beyond the declaration itself;
- the body's own grid track, `min(var(--measure), calc(100% - var(--s10)))`, which is the worst of
  the three and had never been looked at. **Only the domain and contract pages carry a `.shell`.**
  The other four put their children straight into that track, so on the front page, the method page,
  the refusals page and the 404 the card, the code blocks and the lists were bound by a rule about
  prose — at every width, not only past 1248. That is the 17.5% in the table, and it is very
  probably what the owner saw.

**`45rem` was not a number without a question behind it, which is what the diagnosis got wrong in
the owner's favour.** Its comment named two: *without it the card stretched to 913px to hold a 446px
sentence*, and *45rem is two 22rem use-case tracks and the gap between them*. Both are real. Both are
about blocks. Neither is about the column they were written on, and putting them there charged every
other block for them — the case table, the playground, the code blocks, all of which gain by being
wide.

## Considered Options

- **Take the ceilings off and leave the blocks to fill the column.** Refused at the browser: at 2560
  the card stretched to 2 233px around a 400px sentence, the three figures of a card stood 1 800px
  apart, and the settled cases drew a separator 2 233px wide under a 330px argument.
- **Move each ceiling to the block it was about, and leave the column and the shell unbounded.**
  Refused at the browser for a different reason: with nothing bounding the layout the rail sits at
  the left edge and a 1 245px page leaves 1 900px of blank paper on the right of a 2 560px screen.
  It also does not survive the use-case grid, whose `auto-fit` tracks take whatever they are offered
  — four cards alone in a row 1 892px wide while nothing else on the page passed 950.
- **Move each ceiling to its block, and derive the layout's own ceiling from the widest of them.**
  Taken.

## Decision Outcome

**A ceiling belongs to the block, and what a block may be is derived rather than typed.**

Five blocks say what they are worth, and each says it in the form that carries its own reason:

| block | what it now says | the question it answers |
| --- | --- | --- |
| `.card` | `width: fit-content; max-width: 100%` | as wide as its widest block needs, not as wide as what is left over |
| `pre` | `width: fit-content; max-width: 100%` | as wide as its longest line; past what is available it scrolls, because code does not wrap |
| `.cases` | `width: fit-content; max-width: 100%` | one width for every row, so the separators line up, and that width is what a case asks for |
| `.case` first column | `minmax(0, var(--measure))` | as wide as a call may be — and a call here is a paragraph, so that is the measure |
| `.use-cases` | `max-width: var(--two-columns)` | two abreast, which is what the 22rem floor was chosen for, now holding at every width |

Two lengths are declared once and reached from everywhere else:

    --two-columns: calc(2 * var(--measure) + var(--s10));
    --rail: 15rem;

**`--two-columns` is what a block of this catalogue may be**: a column of prose is at most a measure,
so a block of two columns of prose is at most two of them and the gap between. Both blocks that would
otherwise take whatever they are offered are two-column blocks — a settled case is a call beside an
argument, the use cases are jobs read two abreast — so one length bounds both. Measured under these
rules, the widest block the catalogue actually puts on a page is a case row asking for 905px against
the 933 this resolves to, so it is a ceiling rather than a squeeze.

The layout follows from those two:

    .shell { max-width: calc(var(--rail) + var(--two-columns) + 3 * var(--s6)) }

The rail, what stands beside it, and the three gutters around and between them. **Nothing in that is
chosen.** It resolves to 1 245px today — within 3px of the 78rem it replaces, which is the one thing
in this record that was luck — and the day a block grows, the layout follows without this line being
edited.

The body's track stops asking for a measure and asks its content instead:

    grid-template-columns: 1fr fit-content(min(var(--two-columns), calc(100% - var(--s10)))) 1fr;

**The `min()` is not decoration and the `overflow-wrap` under it had to change with it.**
`fit-content()` has a `min-content` floor, and `overflow-wrap: break-word` breaks a word without
counting the break in `min-content` — so a contract's 64-character digest floored the track at 400px
inside a 375px viewport and the method page scrolled sideways at 390. `overflow-wrap: anywhere` is
the same rendering with the break counted. That was found by sweeping all 88 combinations, not by
looking.

### What it measures out at

| page | 1440 | 1920 | 2560 | 390 |
| --- | --- | --- | --- | --- |
| `/` | 505px · 35.4% | 505px · 26.5% | 505px · 19.8% | 335px · 89.2% |
| `/method/` | 526px · 36.9% | 526px · 27.6% | 526px · 20.7% | 335px · 89.3% |
| `/refused/` | 519px · 36.4% | 519px · 27.0% | 519px · 20.3% | 322px · 85.8% |
| `/typescript/number/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% | 339px · 87.0% |
| `/typescript/date/` | 776px · 53.9% | 776px · 40.4% | 776px · 30.3% | 325px · 86.7% |
| `/typescript/string/` | 757px · 52.6% | 757px · 39.5% | 757px · 29.6% | 326px · 87.0% |
| `number/parse@1` | 1169px · 82.0% | 1169px · 61.4% | **1169px · 45.9%** | 327px · 87.2% |
| `date/add@1` | 1169px · 82.0% | 1169px · 61.4% | **1169px · 45.9%** | 327px · 87.2% |
| `string/levenshtein@1` | 1169px · 82.0% | 1169px · 61.4% | **1169px · 45.9%** | 327px · 87.2% |
| `string/slugify@1` | 1173px · 82.3% | 1173px · 61.6% | **1173px · 46.1%** | 327px · 87.2% |
| `404.html` | 435px · 30.2% | 435px · 22.7% | 435px · 17.0% | 346px · 88.7% |

**The reader's gain is not the share and is worth stating on its own.** The call column of a settled
case was `34ch`, a number that named nothing. At 293px it folded **50 of 50 calls on `number/parse@1`
and 43 of 43 on `date/add@1`** onto more than one line. At the measure the four contract pages render
their **157 calls in 223 lines instead of 325** — 31% fewer — and every one of `levenshtein@1`'s 23
calls now fits on one.

**The measure held, which was the thing at risk.** Widening a box changes where lines break, and
`--characters-per-ch` is a fixed point reached by iterating. Over the eleven pages at all four
widths: **0 of 4 008 prose lines over 75 characters, worst 69, typical 55** — against 0 of 4 166,
worst 69, typical 47 before. The ceiling is untouched and the typical line moved eight characters
closer to it. At 390 the reading is unchanged at 0 of 5 134, worst 62.

### Three pages did not move, and that is the answer rather than a shortfall

The three domain pages read 776px before and after; the 404 reads 435px before and after; the front,
method and refusals pages moved by 59 to 80px and no further. **Every child of those pages is a prose
element, and prose is bounded on the line by `--measure`, on the element, by ADR-0115.** The
container was never what bound them. Removing its ceiling freed the few children that are not prose
and could free nothing else.

So a reader on a 2 560px screen still meets a 505px column on the front page. **That is a decision
about what a catalogue index is, not a ceiling that can be lifted** — making it wider means giving
five contracts a layout other than one list, which is a different unit and is not smuggled into this
one.

## Consequences

- The stylesheet grows two declared lengths and loses two typed ones. `44ch` on the install block
  goes with them: once the block sizes to its own command the guess is redundant, and it had become
  harmful — being more specific than the rule over every `pre`, it left the block 34px past a 390
  viewport.
- `overflow-wrap` on the body is `anywhere` rather than `break-word`. Same rendering, and
  `min-content` now counts the break.
- **A guard exists that did not before**, and it is the palette guard's shape on the other axis:
  `every-ceiling-on-a-box-is-derived-and-never-typed`. A colour arrives on this site by being named
  as a role; a width arrives by being derived from the measure, the rail or the spacing unit. Seen
  red before it was believed — with `.shell` returned to `max-width: 78rem`, the fault reads
  `78rem` — and `W-85` of the site battery is that mutant.
- **What that guard does not reach is declared rather than implied.** It reads `max-width` and
  nothing else, so a ceiling written as the second argument of `minmax()` or of `fit-content()` is
  outside it. Those are one occurrence apiece today, and reading them means carrying a balanced-paren
  scan for a form nobody has got wrong yet, where both forms that *were* wrong were `max-width`.
- One defect at 390 is left where it was found: on `levenshtein@1` the copy button sits 17px past the
  viewport, inside a block that scrolls. It is present at `456ee44` and present here, it was measured
  both ways rather than assumed, and it is not this unit's.

## What would reopen this

**A block that is genuinely wider than two columns of prose.** `--two-columns` is a claim about what
this catalogue puts on a page, and it was measured against a catalogue of four published contracts. A
contract publishing a table of three columns, or a benchmark chart, is outside it — and the shape of
the repair is already here: the block says what it is worth, and the layout follows.

**A reading of the front page as something other than a list.** The 19.8% above is a measurement of a
page whose every element is prose. It is not evidence that the page is right; it is evidence that no
ceiling is what makes it narrow.

**A ceiling written as the second argument of `minmax()` or `fit-content()`.** The guard would be
green and the rule broken. It is priced above and refused for now on the ground that no such ceiling
has ever been got wrong here; the day one is, the balanced-paren scan is what closes it.
