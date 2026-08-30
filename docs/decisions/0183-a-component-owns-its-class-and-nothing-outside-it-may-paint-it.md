---
status: accepted
date: 2026-08-30
decision-makers: Mathis Perron
governs:
  - packages/site/components.ts
  - packages/site/front-page.ts
  - packages/site/contract-page.ts
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: a-component-is-painted-by-its-own-rules-and-by-nothing-else
  - battery: site
    guard: every-selector-a-component-declares-is-rooted-at-its-own-class
  - battery: site
    guard: the-class-the-browser-writes-on-a-copy-control-is-the-one-this-registry-paints
---

# A component owns its class, and nothing outside it may paint it

## Context and Problem Statement

The owner read the front page and saw that the `all` pill was drawn squarer than its four neighbours.

**His eye was exact and the victim was the inverse.** Measured at `f5bab84` in a browser, on the
emitted tree:

| pill | element | radius | padding | font-size | height |
| --- | --- | --- | --- | --- | --- |
| `all` | `span.chip.here` | 6px | 5px 11px | 12px | 31.44px |
| `number` `date` `string` `object` | `a.chip` | 16px | 4px 12px | 11px | 27.81px |

The artboard, rendered live in the same browser, draws its seven chips identically at **6px,
`5px 11px`, 12px, 28px tall** — `all` included. So `all` was the only correct pill on the page, and
the four that looked right were the four that were wrong.

**The cause is a shared name and not a wrong rule.** `ul.chips a` was written for the contract page's
group bar; the front page reused the container name `chips` for a list of pills; and `ul.chips a` —
one type more specific, `(0,1,2)` against `a.chip`'s `(0,1,1)` — won. `all` escaped only by being a
`span`, which no `a` selector reaches.

**Three further instances were found, and a fourth by the new guard on its first run.**

1. **The copy control.** `start.ts` writes `button.className = 'copy'` once and puts it on every
   `pre.install` of every page, so the markup was already one thing. The paint was two. Measured live
   at `f5bab84`: `pre.install .copy` gave radius `0px`, no ground, no border, 13px, 37.05px tall;
   `.offers .install .copy` gave radius `5px`, a ground, a border, 11px, 25.81px. The artboard draws
   the second.
2. **The section label**, at `.08em` on the front page and `.09em` on the contract page, where the
   artboard uses `.08em` for both of its sizes.
3. **The card**, where `.card` already meant the contract page's card, so the front page's had to be
   reached as `.offers > li`.
4. **`.recent h2 { margin-bottom: 10px }`**, which no reading found and which
   `a-component-is-painted-by-its-own-rules-and-by-nothing-else` named the first time it ran.

Every one is the same fault: **a component painted from its container**, so its look belonged to
whichever page it happened to stand in. The stylesheet declared 92 class names and eleven page modules
composed them by hand; nothing said two pages could not draw one thing differently, and four times
nothing did.

## Decision Outcome

**A component is a member of a closed union, its class is its name, and its rules live beside its
markup. Nothing outside it may paint it.**

`packages/site/components.ts` holds five — `pill`, `badge`, `copy`, `offer`, `eyebrow`. The mechanism
is three properties, of which the compiler holds two and a guard holds the one no type reaches.

**A second drawing of one thing does not compile.** `classOf` derives the class from the union member,
so the string `pill` exists once; `THE_COMPONENTS` is a total `Record<Component, Drawing>`, so a
component with no drawing does not compile and two entries under one key do not either.

**A component cannot paint anything but itself.** A drawing writes its selectors against `&`, and
`paintedBy` is the only thing that turns `&` into a class — so there is no way to spell a selector
aimed elsewhere. `every-selector-a-component-declares-is-rooted-at-its-own-class` is what says that is
real rather than conventional, `&` being a string that can be left out.

**Nothing else may paint a component, and that is the half the defect came through.** `ul.chips a`
never names `.chip`: it reaches the pill by tag and ancestry, so no sweep of selector text can find
it. `a-component-is-painted-by-its-own-rules-and-by-nothing-else` asks a matcher instead — happy-dom's,
already a dev dependency — over every component element of every page the site emits. Every selector
that matches one must be that component's own or the document's own typography: a bare tag, or `*`.

**Three guards, each seen red before its green was believed.** The pill's hover written
`ul.pills a:hover` reddens the first; `ul.chips a` put back in the sheet with the front page's
container renamed reddens the second, naming `index.html: ul.chips a paints .pill`; `start.ts` writing
`copy-button` reddens the third. In each case the other two stayed green.

**A red produced by hand is not a cell, and the battery is what said so.** The first run reported 151
cells and zero disagreements - every declared cell killed what it named - and refused anyway: two of
these three had nothing reddening them, and the third was red on W-19, W-20 and W-92, none of which is
about painting. Each of those makes `theSite` throw, so the guard fell with every guard that builds a
page: red by collateral rather than by detection. W-152, W-153 and W-154 are the cells that were owed,
and the second run is green with **`UNACCOUNTED FOR (0)`** over 154 cells.

**Two of the three are now red alone and the third cannot be, which is stated rather than left to
look like an omission.** `every-selector-…-rooted-at-its-own-class` is alone on W-152;
`a-component-is-painted-by-its-own-rules-and-by-nothing-else` is alone on W-154, with the pages
building perfectly - measured over the whole suite, 1 failed and 194 passed.
`the-class-the-browser-writes-on-a-copy-control-…` is red on W-153 and alone on nothing, and **no
plausible mutant would change that**: it compares a literal in `start.ts` against a member of the
union, renaming the literal reddens eight guards because seven of them query `.copy`, and renaming the
member does not compile. That is a different state from *nobody wrote the cell*, and the two are
indistinguishable in the instrument's own bucket.

### What the artboard decided, and where it argued against unifying

**The badge keeps two paddings, and that is an intention rather than drift.** Measured on the
artboard: the frozen mark is `2px 6px` with no border, the language mark `1px 5px` with a `1px` one,
and **both are 18px tall**. The padding is reduced by exactly the border so the two align on the row
where they stand side by side; unifying them would put a 20px badge beside an 18px one. The rule
therefore subtracts the border rather than declaring two numbers that happen to differ by it.

**The copy control's two sizes have no such argument** — both are bordered, so nothing compensates —
and are unified at the card's `3px 8px`. The artboard's install-bar button is *not* this component: it
is drawn on the accent with `accent-ink` on it, which is a primary button and arrives with the
contract page.

**The pill's `line-height` is `normal` rather than a number**, because the artboard declares none and a
button's initial value is what draws its box. Inheriting this site's `--the-line` is what made the one
correct pill 31.44px tall against the artboard's 28.

**The selected pill is `[aria-current='true']` and never a second class.** The page already wrote that
attribute, so the look is keyed to the declaration a screen reader reads rather than to a word invented
for the stylesheet. `here` is gone.

### What this unit did not take

**The search field is left out, and on a reading rather than on scope.** Its two rules do diverge — the
masthead's paints `--paper` at `7px` in mono, the hero's `--wash` at `8px` inheriting — but the artboard
does not draw one control at two sizes: it draws a **button that opens a command palette** in the
masthead and a **search input** in the hero. Whether those are one component depends on whether this
site grows a palette, which is not settled here.

**The contract page's group bar is moved off the colliding name and is otherwise untouched**, so that
page renders as it did. It remains a pill-shaped thing that is not the pill component, and that is
named rather than repaired: componentising it would change a page this unit was not reviewing.

**The compiler does not yet refuse a hand-written class.** Measured, `Attributes` losing `class` makes
`el('span', { class: 'chip' }, …)` a `TS2353`, and the 148 remaining sites would all have to move in
one commit. That is deferred with an entry of `CLAUDE.md`'s open list carrying a number that descends —
70 distinct class names across 11 modules today, against 80 before this unit — because *when the rest is
converted* with nothing counting it is how an intention becomes an oversight.

**The published measurement of the hole is that the compiler closes the direct spelling and not the
indirect one.** A page building a `Record<string, string>` and passing it compiles under both shapes
that were probed. The guard over the emitted pages is what makes the pair total; neither half is total
alone, and that is written here so nobody reads the type as the whole mechanism.

### What it cost

The addresses do not move: the tree writes **130 files and 73 answers** either side, measured at
`f5bab84` and at the commit this record lands on.

## What would reopen this

- **A component whose two variants cannot be told apart by an attribute.** Every variant here is a
  `data-` attribute or an `aria-` state, which is what keeps a component one class. A shape needing a
  second class would need this record's first property re-argued.
- **The search field, on the day the palette is decided.** If the masthead's control becomes a button
  opening a palette, it and the hero's input are two components and this record's refusal to merge them
  is discharged rather than overturned; if it stays an input, they are one component at two sizes and
  the refusal was wrong.
- **A page section that has to reach into a component.** The guard admits a bare tag and `*` and
  nothing else. The first legitimate need for a container to paint its child is the reading that would
  widen that line, and it should arrive with the case rather than in advance.
- **The compiler refusing `class`**, which closes the open-list entry this unit opened and makes the
  second guard's population the whole site rather than the components.
