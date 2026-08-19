---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/site/contract-page.ts
  - packages/site/survivors.ts
  - mutation/published.ts
confirmed-by:
  - battery: registry-storage
    guard: every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns
  - battery: site
    guard: nothing-of-the-instrument-reaches-this-folder-but-the-published-derivation
---

# A contract page publishes what its own suite did not catch

> **One of the two sections below is withdrawn by
> [ADR-0133](0133-what-a-page-is-long-in-is-measured-and-it-is-not-the-wrapping.md), and on none of
> the triggers under *What would reopen this*.** *What lands in your project* is gone from the
> contract page, the licence header it showed with it. *How this contract measured* stands, and
> everything this record argues about it — the projection, the placement below the line, a contract
> with no survivor saying so — is unchanged. **What was wrong is not the argument but that nobody had
> asked the reader**: the section was proposed on the supposition that somebody deciding on a function
> wants to know what lands, the owner read it on his own screen and did not. Its own confirmation goes
> with it, so `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` is no longer among the guards
> above — it kept the file-name list and there is no list. The 74-word reading below is the last state
> of a page that no longer exists and is not retaken; ADR-0133 measures the same page in lines.

## Context and Problem Statement

The redesign adds two sections to the contract page — the page that is 99 % of this site at a thousand
entries, and the only one whose length has been measured. Eight of its ten sections already existed.

**What survived a suite was published for the whole catalogue and never for one function.** The method
page carries every survivor of nineteen batteries; a reader deciding on `number/parse@1` had no way to
ask what got past *its* suite, on the page they were standing on.

**And what lands was a figure without a name.** The card says *4 299 bytes, one file* and does not say
which file; `licenceHeaderOf` was imported by the contract page for the structured data and shown to
nobody.

## Decision Outcome

**A contract page publishes its own measurement, and it is a projection rather than a second
statement.** `theMeasurement` already took its population as an argument. `theMeasurementOf` is that
function at a contract's address, so the method page's whole and this page's part are one computation
at two arguments — which is what makes it a filter and not the duplication
[ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md) and
[ADR-0129](0129-what-a-contract-is-has-a-page-and-its-address-is-the-question.md) refused two days
running.

**Below the line, which is the argument for the placement.**
[ADR-0119](0119-the-page-is-read-in-two-halves.md) cut this page in two: what answers *is this the
function I want* and what answers *what exactly is it bound to do*. What a suite did not catch is read
after a reader has decided, so it sits in the second half and immediately before what they can check
themselves.

**A contract with no survivor says so rather than dropping the section**, and that is the stronger half
rather than a symmetry with ADR-0027's rule about an empty section. **No survivor is not an absent
result: it is the best reading this project can publish about a function** — everything written against
this suite was caught — and a page going quiet for want of a list to render would lose the most
favourable thing it has to say.

**What lands is reduced to what a figure cannot carry**: the file names with their weights, and the
licence header shown rather than described, which answers *what does this oblige me to* with the
shortest true answer there is.

**No path, and the reason is that this site cannot know one.** `configuration.ts` answers
`src/lib/toopo` where a `src` directory exists and `lib/toopo` where it does not, so a full path
published here would be right for one reader and wrong for the next. The README carries that
imprecision and nobody has raised it; this states the rule in a clause instead of drawing a path that
is half false.

**No colour, and the temptation is named so that the visual unit finds it named.** A caught mutant and
a survivor on one page invite a palette to sort them. [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md)
settled it — an accent means *you can act on this* and never *this is bad*, and a colour survives
neither `toText` nor `toMarkdown` — and this section is the surface that will make somebody want to
reopen it.

## Consequences

**The join between a battery and a contract is composed and held in both directions.** A battery
declares the folder it edits; a contract's folder is `contracts/<language>/<name>`. `theFolderOf`
composes it on the side that holds the batteries, so no module of `packages/site/` spells a path — and
`every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` refuses both a battery
injecting where no contract is and a contract no battery injects into. **A filter over a composed
string that stops matching answers an empty measurement, and an empty measurement on a contract page
reads exactly like a contract nobody has measured.**

**`survivors.ts` is the third shared module born of one pattern, and that is an observation about how
this site is written rather than three accidents.** `marks.ts`, then `quantity.ts`, now this: a
rendering decision lives beside the page that needs it first, which is right while one page needs it,
and moves the day a second one does. Each of the three moved *before* there were two copies, because
the first copy is the one nobody finds — `quantity.ts` records a drift that had already happened
between two copies of one decision within a unit of writing them.

**What the two sections add, measured, and what is deliberately not measured beside it:**

```
What lands in your project     74 words, above the line
How this contract measured    418 words, below it
                              ─────
                              492 words, four fifths of them below
```

ADR-0119's reading of this page — 754 words above the line and 3 262 below — **is not retaken, and
that is a decision rather than an omission.** This sweep's population is not that one: it counts the
masthead, the title and the column, so 950 against 754 would be two methods compared rather than two
readings. What a reader needs is the variation, which is exact and needs no population at all: **the
half met before deciding grew by 74 words.** A total comparable to ADR-0119's would enter no decision —
at any value it would leave this unit exactly as it is — and a measurement that enters no decision is
not bought at any price. Whoever retakes it rebuilds that sweep first.

## Confirmation

`every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` was seen red on the
composition rather than on the guard: dropping the language from `theFolderOf` reports ten batteries
injecting where no contract is.

`a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` did real work here, refusing `reference.ts`
alone in a paragraph — an identifier is an address and not prose, and the file name is in a sentence
because that guard said so.

**Two defects only reading found.** Backticks written through `line` instead of `paragraph` would have
reached readers as themselves, which is ADR-0117's class arriving on new content exactly as it
predicted. And `P-02` and `P-06` each appeared twice, because a defect is measured once per lens and
one mutant surviving on two lenses is two cells — which the method page had already solved, in a
sentence that turned out to be about both surfaces: *six of `number/parse@1`'s defects appeared as
twelve identical entries; nothing was false and it was unreadable, which on this page is the same
failure.*

## What would reopen this

A contract with more surviving cells than settled cases, at which point the section stops being a
coda to the reference half and starts competing with it.

## More Information

- [ADR-0119](0119-the-page-is-read-in-two-halves.md) — the line this section is placed below.
- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — the card whose figures
  *What lands in your project* deliberately does not restate.
