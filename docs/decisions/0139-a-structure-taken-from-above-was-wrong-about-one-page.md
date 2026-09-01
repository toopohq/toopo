---
status: accepted
date: 2026-08-19
governs:
  - packages/site/style.ts
confirmed-by: []
---

# A structure taken from above was wrong about one page, and the page's own numbers said so

## Context and Problem Statement

A structure for the whole site was proposed, argued page by page, and validated. For the method page
it said: **it keeps the argument and the totals, and the per-contract census descends onto each
contract page, where [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md)
already put half of it.**

That was written from a reading of the site. Three measurements of the page itself refute it.

**The census is not the weight.** Measured section by section over the served page, by visible words
between `h2`s: *Guards no defect here reddens* is **5 953 words, 55%**, and the survivors are 2 684,
25%. What the structure proposed to move is a quarter of the page, and what actually makes it long is
the reason each of seventy-three guards cannot be reddened.

**There is no per-contract half to move.** The page names 62 cells; **19 belong to a contract.** The
other 43 come from `cli-install`, `registry-storage`, `site`, `packaging` and `validation` — batteries
with no page to descend to.

**And the 19 are not duplicated.** Read on `G-06` and `G-07`: a contract page cites a cell as the
provenance of a settled case — *this case exists because a mutant survived without it* — while the
method page cites the same address about attribution across three runs. Same address, two propositions.

So the validated plan would have touched about 8% of the page and deleted words with nowhere else to
be. **A structure proposed on a reading of the whole can be wrong about one page**, and only a
measurement of that page says which.

## Considered Options

### Refused: cut the 55%

The obvious reading of *this page is too long*. It is the one thing this page will not trade: every
word of that section is a guard's reason and every word of the next is a battery's sentence about a
defect that got past. Cutting there cuts the only thing this project sells.

### Refused: the row is two columns, as a settled case is

Built and measured rather than reasoned about. Three readings at 1440, over the hundred rows this
page renders:

| | prose lines over 75 | height |
| --- | ---: | ---: |
| as committed | 283 | 25 192px |
| stacked, argument bounded | 88 | 35 640px |
| two columns | 88 | 41 402px |

**The columns buy nothing here** — the same reading for 5 762px more. The left half is one short
identifier against a paragraph, so half the width carries no height. On a contract page the left half
is a call that often folds to several lines, and there the columns pay: ADR-0122 records the same
shape deciding the other way, and the difference is the data rather than the layout.

## Decision Outcome

**The census is a table whose rows are not two columns, and not one word is cut.**

An identifier and an argument, which is the shape a settled case has, with the argument as a cell that
has a width — the rule `.argument` already carried. Measured against the committed page at 1440: 283
prose lines over 75 characters become **88**, the median falls from 75 to 62, and **every reason reads
at 73 characters or fewer** at every width from 768 up, against up to 252 before.

The cost is height, 25 192px to 34 040, **+35%**, and it is the reflow of bounding the reasons rather
than any decoration. The 88 lines that remain and the worst of 252 are page prose, which
[ADR-0134](0134-a-width-stated-in-characters-and-a-layout-that-follows-the-screen.md) left unbounded
by the owner's decision; this unit does not revisit that.

### The page gains a `main`, and it is not tidiness

A row folds on the width of its own container and the container is declared on `main`. This page had
none — it has no shell, because it has no navigation column — so it was the one place on the site
where such a table could never fold, whatever the screen. It has content, so it has a `main`.

## What would reopen this

A page whose rows carry a long identifier — a call rather than a battery and a cell — turns the
refused option back into the right one. What decides it is the ratio of the two halves' heights, and
that is a reading rather than a preference.

If the reasons themselves are ever shortened, the +35% goes with them; nothing here argues that they
should be, and the guards named above are what would refuse it.
