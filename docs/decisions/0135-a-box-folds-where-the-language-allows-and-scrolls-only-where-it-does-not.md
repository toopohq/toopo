---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-word-of-every-page-survives-every-projection
  - battery: site
    guard: every-command-the-site-tells-a-reader-to-run-carries-the-invocation
  - battery: site
    guard: a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing
  - battery: site
    guard: no-element-runs-into-the-one-beside-it
---

# A box folds where the language allows and scrolls only where it does not

## Context and Problem Statement

A sweep of the whole site at thirteen widths in both themes found four defects that share one shape
and one population: **on a phone, a box will not give up its content.** The owner read them and
declined to treat them as a trade — *if text runs off the screen on a phone, the CSS is wrong by
default; adapting is what responsive design is for* — and set the outcome rather than the method:
**nothing a reader came for is out of their view, at any width a phone has.**

The four, measured at `6aa90db` over 14 pages × 21 widths × 2 themes:

| | what a reader loses | where |
| --- | --- | --- |
| A1 | the install command, and the copy control with it | 280 to 430, three of four contracts at 390 |
| A2 | the signature, behind a block scrolling at up to 2.11× its window | 280 to 736 |
| A3 | whatever they followed a link to, behind the sticky bar | 280 to 430, every destination of a page's own table of contents |
| A4 | the site's own name, broken as `toop` over `o` | every width below about 479 |

### The argument this repository had, and the case it was never tested against

The stylesheet said, of a code block: *as wide as its longest line, and past what is available it
scrolls rather than wraps*. That sentence was written about a block **wider than its own content** —
`width: fit-content` replacing a 2 183px box around a 356px signature — and it was never put against a
screen **narrower than a type declaration**. Both halves were carried by one rule, so the second
inherited an argument made for the first.

**They are two cases and the repository treated them as one.** A signature has break points: a space,
a comma, an arrow. A digest has none. Folding the first is reading it; folding the second at an
arbitrary character is not.

## Decision Outcome

Five rules, none of which asks how wide the screen is.

1. **A `pre` folds where the language allows.** `white-space: pre-wrap` keeps every space and newline
   the text really has and adds the break opportunities the text already contains. `overflow-wrap`
   stays `normal`, so a token with nowhere to break keeps its shape and the block scrolls — which is
   the case the old sentence was right about, now the only case it covers.

2. **The install command folds inside its own half of the row, and the control keeps its place.** A
   flex item that cannot wrap cannot shrink, so the whole row overflowed and the control — pushed to
   the end by its own margin — landed at the end of the *scroll* width rather than the visible one.
   Once the text can fold, the row shrinks the text and leaves the control where it was. **Nothing
   wraps the row**: the arrangement is the same at every width.

3. **The control is as wide as its own label.** `flex: none`, because a control is not text that
   reflows: left to shrink it took the command's `anywhere` and offered a reader `cop` over `y`.

4. **The wordmark keeps its word.** `overflow-wrap: anywhere` on `body` — added so a 64-character
   digest could not push a page sideways — makes any word's min-content one character, and a flex row
   squeezed the name to nothing. `normal` on the wordmark alone gives the word its width back, and a
   flex item cannot be shrunk under its min-content.

5. **What a linked-to element clears is the bar, and the two share their terms.** `scroll-padding-top`
   on the scroll container replaces three `scroll-margin-top` declarations, and is `--the-sticky-bar`
   plus a gap. The bar is its own padding plus its content at the tallest that content gets.

The playground's answer takes `anywhere` with the settled cases rather than `normal` with the other
`pre`s, because it renders the same thing they do — a call and what it answered — and the two were
wrapping differently for no reason but which element carried them.

## The measurement

Both readings warm, same probe, same population: 14 pages × 21 widths (11 portrait phone, 6 landscape,
4 desktop controls), light and dark.

| | before | after |
| --- | --- | --- |
| install command hidden, over 84 readings | 2 541 px | **0** |
| readings with the copy control outside its block | 31 | **0** |
| readings with the copy control off the screen | 12 | **0** |
| blocks a reader must scroll sideways | 197 | **0** |
| worst single block | 471 px hidden | **0** |
| readings with a broken wordmark | 142 | **0** |
| pages painting anything outside the viewport | 12 | **0** |
| pages scrolling sideways | 0 | 0 |

**A3 was read by really following each link**, at ten widths, over every destination of two contract
pages' own tables of contents — 19 addresses, not one case:

| viewport | bar | before | after |
| --- | --- | --- | --- |
| 280 | 106.1 | — | clears by 8.4 |
| 320 – 414 | 77.1 | 25 px behind | clears by 37.5 |
| 430 and above | 50.9 | 12.5 px clear | clears by 63.7 |

### What repairing one closed in another, measured rather than assumed

The sweep proposed that repairing the wordmark might close A3 as a consequence. **It does not, and
the reason is worth more than the answer: the bar's height is the menu's and never the wordmark's.**
Giving the name its 44px back takes 44px from the menu, which wraps to one more row and pays the
height straight back — measured, 89.1px before and 130.1px after the wordmark repair alone at 320.
What actually shortened the bar was the menu's own row gap, which is why that rule is in this unit at
all: A4's repair made A3 worse before anything made it better.

The bar ends up **shorter at every width**: −24px at 280, −12px from 320 to 428, −38px at 430.

### What it costs

Vertical space, where content that was hidden is now shown, and nowhere else.

| viewport | 14 pages, summed | change |
| --- | --- | --- |
| 280 | 242 297 → 243 473 | +0.49% |
| 320 | 209 159 → 209 944 | +0.38% |
| 390 | 174 317 → 174 403 | +0.05% |
| 768 and above | unchanged | **0.00%** |

At 390 the four contract pages gain 9 to 155px — `date/add@1` most, its `DescribeAddFailure` being the
longest signature — and every page without a card **loses 12px**, the bar being shorter. **Above 736
nothing moves at all**: the desktop rendering is byte-identical in geometry.

## Considered Options

**`overflow-wrap: anywhere` on every `pre`.** Takes every block to zero at every width, and dissolves
the distinction this record exists to draw: a digest would be chopped mid-token wherever it happened
to land. Refused for the case that does not exist yet rather than for one that does.

**Wrapping the install row, so the control drops beneath the command.** Built and looked at. The
control's separator is a left border, which on its own line hangs as a stray vertical mark in an empty
row; tightening the row gap moved it without fixing it. Letting the *text* fold instead keeps one
arrangement at every width and needs no second one.

**A typed clearance.** A number that clears the tallest bar somebody measured is a number nothing ties
to the bar. The arithmetic used instead shares the bar's own terms, and the one term it cannot
derive is named below.

## Consequences

**`--the-menu-at-its-tallest: 3` is data and not a length.** It is the most rows the menu wraps to at
any width a phone has, measured from 280 to 479, and a fourth destination in the masthead would move
it with nothing saying so. CSS cannot read a rendered height, so the clearance and the bar are tied by
sharing terms rather than by one measuring the other. `CLAUDE.md` carries it among what nothing keeps.

**The menu's 2-to-3-row boundary sits within a few pixels of 320.** Two readings in one session fell
on opposite sides of it. It changes nothing here — the clearance covers the three-row bar at every
width, so A3 holds either way — and it is written down because a threshold nobody controls is worth
knowing about before somebody builds on it.

**`--the-line: 1.62` is declared rather than typed in the body's font shorthand**, because two rules
need it now and one of them is arithmetic.

**A count this stylesheet published about itself was withdrawn on the way past.** Its header argued
that a long comment belongs outside the served literal, and gave *4 672 of the 13 323 bytes served are
comments* with no commit beside it — a present-tense count of a quantity that moves whenever the file
is edited. Measured at `2649780`, over the literal `style.ts` exports and its `/* */` comments: the
figure had reached **14 007 of 25 191 bytes in 37 comments before this unit**, and the first draft of
this unit's own comments took it to **19 397 of 30 957** — 5 766 bytes on every page of the tree, which
is the practice that paragraph exists to forbid, broken by the unit reading it. Rewritten to the
header, the same reasoning costs **2 264 bytes per page and lands at 15 895 of 27 455 in 45 comments**.
The prose now claims only that more than half of what is served is comment, which survives an edit;
the figures are here, where a date makes them honest.

## Confirmation

The four guards above are what this change had to keep and could have broken: no word of any page
moved, the command still carries the invocation, the copy control is still built rather than served,
and no block runs into its neighbour.

**None of them keeps the repair.** Every figure in this record was taken by hand in a browser, and the
eight suites were green before the change, after it, and would have been green had it made every page
worse — which is the debt `CLAUDE.md` names as *that any layout this site declares is one somebody
looked at*, now paid for the sixth time. The sweep that produced these numbers is the shape the ninth
suite would take; the decision to build one is the owner's and is not taken here.

## What would reopen this

**A destination added to or removed from the masthead**, which moves the one term of the clearance
that is data rather than a length.

**A `pre` whose content is neither a command, a signature nor a call** — the three this site renders
today. The separation is between text with break points and text without; a fourth kind is where that
rule gets read again rather than assumed.

**A ninth suite that lays a page out.** The moment something can redden on a box hiding its own
content, the arithmetic above stops being the only thing holding these four repairs, and the term
nothing keeps stops being a term nothing keeps.

## More Information

The sweep that found the four is the same one recorded in the state of the site taken before this
unit; [ADR-0134](0134-a-width-stated-in-characters-and-a-layout-that-follows-the-screen.md) is the
decision that removed the bound on prose, and this unit deliberately does not touch it: nothing here
bounds a line.
