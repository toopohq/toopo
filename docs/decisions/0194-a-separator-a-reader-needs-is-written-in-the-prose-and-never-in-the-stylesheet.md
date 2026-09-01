---
status: accepted
date: 2026-09-01
governs:
  - packages/site/components.ts
  - packages/site/contract-page.ts
confirmed-by:
  - battery: site
    guard: no-element-runs-into-the-one-beside-it
  - battery: site
    guard: the-cost-a-page-states-is-what-lands-and-not-what-is-served
---

# A separator a reader needs is written in the prose and never in the stylesheet

## Context and Problem Statement

[ADR-0193](0193-an-entry-about-this-site-is-remeasured-against-the-site-that-exists.md) re-measured
fifteen open entries against the site that exists and closed by naming five things it had found and
deliberately not repaired. Two of them are what this site prints wrongly to a reader, and this unit is
those two.

**The first is served.** The shelf's domain filter draws a name and a count, told apart by
`margin-left: var(--s)` and by nothing else — so the HTML is right and the Markdown twin at
`https://toopo.dev/index.md` reads:

```
- all6
- number2
- date1
- string2
- object1
```

A stylesheet is the one thing a projection cannot carry. Both `toText` and `toMarkdown` throw the
markup away, and a `span` decorates as `ends('')` in each, so what separated those two fragments for a
reader with CSS separated them for nobody else.

**The second is the same fault one floor up: a fact stated twice.** Every contract page stated its
installed byte total in its `description` and again in the card's own figure, both off one derivation,
`whatACardSays`. `the-cost-a-page-states-is-what-lands-and-not-what-is-served` asks whether that total
is *somewhere* in the page's reading, so the second statement answered for the first.

## Decision Drivers

- **A reader without a stylesheet is a reader.** The Markdown twin is served at seven addresses and is
  what a retriever opens; a repair that only a browser can see is not a repair.
- **Rule 4 before rule 1.** A way to separate two fragments in every projection either already exists
  in this repository or it does not, and finding out comes before inventing one.
- **A guard that catches the five by reporting the seventeen is worse than the guard it replaces.**
  ADR-0193 measured both populations; the widening is worth taking only if it is exact.
- **[ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md).** What is
  perturbed is the claim. Both repairs were seen red on the defect and green beside it, in that order.

## Considered Options

### For the separator

- **A space written into the prose**, which is `quantity.ts`'s `figure`.
- **` · ` written into the prose**, which is `contract-page.ts`'s version-and-date row. Taken.
- **The count becoming a block.** ADR-0193's other named option, refused below on the language.
- **A separator in the projection table**, refused below on the population it would move.

### For the doubled total

- **Take the magnitude out of the page description.** Taken.
- **Take the figure off the card.** Refused: the card is where a reader acts on it and where the guard
  reads it.
- **Teach the guard *where* rather than *whether*.** Refused, and it is what `CLAUDE.md`'s own entry
  proposes — see below.

## Decision Outcome

### The separator is prose, because this repository had already answered that twice

Searched before it was invented, and the answer was in two places:

- `quantity.ts`'s `figure` writes the separator into the label's own text node,
  `text(` ` ${counts}` `)`. Its header records **this very defect met once already**: a second copy of
  that rendering left the space out, and the front page's Markdown twin published
  `**672**defect cells injected` where every card reads `**7 075** bytes, one file`. That is `all6`,
  eight months earlier, on the same projection. [ADR-0123](0123-a-wide-screen-is-filled-by-a-column-and-never-by-a-longer-line.md).
- `contract-page.ts` writes `text(` ` · ${readableDate(…)}` `)` after a version, and `chrome.ts` writes
  ` · ` between three phrases of the footer.

So the *mechanism* is settled: the separator belongs to the second fragment's own text node. What this
unit chooses is the character, and it chooses the second precedent rather than the first, on a reading
of the projection rather than on taste. A bare space repairs `all6` and produces `- number 2`,
`- date 1` and `- object 1`, which read as ordinals — the filter has no heading in the twin, so nothing
around them says otherwise. Two values side by side are what `contract-page.ts` already uses ` · ` for,
and a domain and its magnitude are two values.

`margin-left: var(--s)` goes with it. The gap is now declared once, in the markup, where both
projections read it — leaving both would be two statements of one separation in a module whose whole
argument is that a second drawing of one thing drifts. [ADR-0183](0183-a-component-owns-its-class-and-nothing-outside-it-may-paint-it.md).
**The paint moves by design**: one mono space at `calc(12 * var(--a-point))` in place of a `.25rem`
margin, and a middle dot that was not there.

### Why not the projection table, and why not a block

Both were considered and both fail on the same fact.

`document.ts` says the separator is a property of the *element*, which is the shape to reach for — and
`span` is the tag the count uses **and** the tag an address split for highlighting uses. Making `span`
separate would render `number/parse` as `number/ parse` on every page. One tag cannot carry two
answers.

And no *inline* tag separates in the reading: `code` and `strong` gain delimiters in Markdown and
decorate as `ends('')` in `THE_READING`, so a count wrapped in either still reads `all6`. Only block
tags separate, and a block inside the pill's `span` variant is not something `Tag` should be asked to
express. That is the cost ADR-0193 priced as a layout decision, and it is the reason the answer is
prose instead.

### The doubled total: the magnitude belongs to the card and the shape to the description

The description now reads `50 named edge cases, settled and frozen. TypeScript source copied into your
project: one file, no dependencies.` — the shape of what lands, and not its magnitude. Neither surface
lost a claim: the number is made once, on the card, where a reader acts on it.

**What the duplication was shielding is not the mutant either record named**, and measuring it is what
found that out. ADR-0193 writes that *the mutant the entry describes, pointing the card's figure at the
harness, is survivable on all six*. It is not. `W-12` injects into `whatItCosts`, which is the one
derivation **both** statements read, so it moves them together: measured at `aff4bdd`, W-12 reddens
`the-cost-a-page-states-is-what-lands-and-not-what-is-served`, and the failure prints a page whose
description and card both say `60 371 bytes`.

What the duplication really shielded is a mutant at the *call site*, and it is worse than the one that
was looked for:

| at `aff4bdd`, the card's cost figure removed | the guard |
| --- | --- |
| before this unit | **green** — the description still carried the needle |
| after this unit | **red** on all six pages |

A reader loses the one figure on the card that says what installing costs, and the guard whose entire
subject is that figure says nothing. That is the reading that decided which of the two statements
leaves.

### The guard sees a text node now, and what it asks of the seam depends on who wrote it

`no-element-runs-into-the-one-beside-it` skipped any pair where either side is a text node. ADR-0193
measured the cost with that line removed — **22 pairs, of which 5 were the defect above and 17 are
correct by construction** — and the guard is widened rather than left, because the seventeen are
separable from the five by a rule and not by a list.

There are two questions and one subject, *is this boundary visible to somebody reading a projection?*

- **Between two elements, only white space can make it visible.** An element boundary is not a
  character. Unchanged, and it is what [ADR-0025](0025-what-separates-two-elements-in-a-reading.md)
  decided.
- **Between an element and prose, the character the author typed can make it visible too.** All
  seventeen are that shape — `<span>number/</span>parse` and `<code>toFixed</code>, which answers a
  string` — where the `/` and the `,` *are* the boundary and a space beside either would be wrong.
  What has nothing making it visible is a seam between two word characters, which is one word broken
  in half.

`WORD_MATTER` is `/[\p{L}\p{N}\p{M}]/u` rather than `[A-Za-z0-9]`, because this catalogue settles cases
on `日本語`, `हिन्दी` and `٤٢`: an ASCII class would read every one of them as a separator and go quiet
on the pages carrying the most of them.

**Measured over the 22, the rule separates them exactly**: 5 reported, 17 allowed, no exception list.
The seventeen are allowed because their seams fall on `/` and `,`, which is the argument rather than
the outcome.

### It has a cell, and the cell is red alone

The widened arm had no witness. `no-element-runs-into-the-one-beside-it` is accounted for by W-29,
which breaks `p: ends('')` in the projection and reddens the element-against-element arm that has
always existed; **W-64 was this arm's cell and [ADR-0189](0189-the-site-is-what-a-reader-can-install-and-the-rest-is-served-as-data.md)
deleted it**, so `CLAUDE.md`'s entry cites a cell nobody can replay. W-162 puts the defect back in the
one line that carries it, emptying `BEFORE_A_COUNT`.

Measured at `aff4bdd` with the separator emptied, over the whole site suite: **183 guards green and
this one red**, the pages building perfectly — which is what `attribution.ts` calls *red alone*, and
what `CLAUDE.md`'s open entry records that a little over half of this battery cannot say.

### What was measured

| | at `aff4bdd` | after |
| --- | --- | --- |
| `/index.md` | 3 592 B, `- all6` | **3 612 B**, `- all · 6` |
| pairs the guard's loop finds with no kind test | 22 — 5 defects, 17 correct | **17, all correct** |
| pages stating the installed total twice | 6 of 6 | **0 of 6** |
| the site suite | 184 guards | **184 guards** |
| battery cells | 837, 795 caught | **838, 796 caught** |

The twenty bytes are arithmetic and not a surprise: ` · ` is four bytes in UTF-8 and there are five
pills. [ADR-0018](0018-a-published-count-carries-its-coordinates.md).

## What would reopen this

- **A second thing put beside a fragment with no separator.** The guard now reports it, which is the
  point; what would reopen the *decision* is a pair whose seam is two word characters and which is
  nonetheless right — an ordinal written as `1<span>st</span>` is the shape, and this site writes none.
- **A page whose count needs a different word.** ` · ` is chosen against a reading of the twin, where
  the filter carries no heading. A twin that named the list could take a bare space, and that is a
  reason to re-take the reading rather than to keep the character.
- **A tag whose projection separates in the reading and is legal inline.** That would move the
  separator out of the prose and back into the element, which is where `document.ts` argues it belongs.
- **The description needing its magnitude back.** It was removed because it answered for the card; a
  surface that states the total and is *not* in the guard's reading does not reopen anything.

## More Information

### The repair `CLAUDE.md` proposes for the doubled total is not the one taken, and the reason is a price

That entry reads: *What would close it is asking those guards **where** rather than **whether** - the
card, not the page - and the price is that a guard about a claim starts naming a block, which is the
coupling to a layout that `no-element-runs-into-the-one-beside-it` and its neighbours were written to
avoid. Priced and not taken.*

The price is real and it is still refused. What this unit does instead is remove the duplicate, which
the entry's own sentence allows for — *the guard is not too broad and the page is not wrong; what is
wrong is that they met*. Stopping them meeting costs nothing and couples nothing. **The class is
untouched**: nothing reads a page for repeated values, nothing sensibly could, and the entry stays open
with its instance count moved from one to nought.

### What this unit deliberately did not touch

ADR-0193's three other findings. The nine false present-tense page counts, `start.ts` exporting six
builders where two entries say four, and the address the origin serves for `array/group-by@1` — the
last of which is not this repository's to decide, because it touches what the 404 promises.

### The commands

The 22 pairs were reproduced at `aff4bdd` with the guard's own loop and its kind test removed, printed
one per line with both kinds, and the criterion was run over the same population before the repair was
written. `/index.md` was read from `pnpm site:build`'s output before and rendered through `toMarkdown`
after. Each perturbation was applied to the working tree, the site suite run, and the tree restored by
a counter-edit. `pnpm freeze` is green either side and no digest moves: nothing under `contracts/` is
touched, and `packages/registry/` holds no import of `packages/site/`, which is what makes the first
reading the one at `aff4bdd` rather than one taken beside it.
