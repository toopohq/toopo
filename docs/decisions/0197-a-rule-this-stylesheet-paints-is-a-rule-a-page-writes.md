---
status: accepted
date: 2026-09-02
governs:
  - packages/site/painting.ts
  - packages/site/style.ts
  - mutation/site.battery.ts
confirmed-by:
  - battery: site
    guard: every-rule-this-sheet-paints-is-one-a-page-writes
  - battery: site
    guard: what-this-reads-as-a-selector-is-what-a-browser-reads-as-one
---

# A rule this stylesheet paints is a rule a page writes

## Context and Problem Statement

[ADR-0195](0195-a-page-count-written-in-the-present-carries-the-number-the-tree-emits.md) found
`ul.contracts` in the stylesheet, wrote that **no file of HTML carries `class="contracts"`**, and left
it: *the count cannot be repaired without deciding the rule's fate, and deleting a rule changes what
every reader is served, which this unit does not do.*

The guard that ought to have caught it reads one way. `every-component-class-the-browser-writes-is-one-this-registry-paints`
establishes that a class the browser writes is one this registry paints; nothing anywhere establishes
the converse, that a rule this registry paints has anything to paint.

**The question this unit had to answer first is how many there are**, because that decides whether
there is a guard at all. A population of one is the trap this repository has paid for repeatedly: a
guard born on a single instance is a declaration with a test in front of it.

## Decision Drivers

- The population decides whether there is a guard, and not the other way round.
- No guard that exempts by list. A list of selectors excused from having a subject grows by one every
  time somebody writes a rule nothing paints, which is the defect rather than the remedy.
- A rule may be painted by a script rather than by the emission, may name no class at all, and may be
  a state no static document carries. A sweep that counts those as dead is wrong, loudly and in the
  direction that costs a reader something.
- A guard that cannot tell the dead from the living without a list should not exist; a written finding
  is worth more than a guard that lies.

## Considered Options

- **Sweep the emitted tree for class names.** Refused before it was run: `ul.chips a` names no class,
  which is the measurement `components.test.ts` already records, and a text sweep answers *dead* for
  every selector that reaches its subject by tag or ancestry.
- **Ask the matcher over the emitted pages only.** Refused on its own reading: it reports 21 selectors
  as dead that the module every page runs paints, and 9 more that a reader reaches by acting.
- **Ask the matcher over the pages, the controls and the states a reader can drive.** Taken.
- **Delete without a guard.** Held open until the population was known, and not needed: the population
  is 47.

## Decision Outcome

**The reading rule was written before the sweep, and it is the half of this unit worth keeping.**

- The population is every selector of the sheet a page carries, at every depth, one entry per
  comma-separated member — because a comma group is as many claims as it has members and one can die
  while the other lives.
- Each selector is asked with its states and pseudo-elements taken off, because no static document
  carries a state and no pseudo-element is an element. A selector that is nothing but a state answers
  `*`.
- A selector is alive when at least one element matches it in the DOM a reader holds: the eight
  documents this site serves, after the module every page runs has built its controls, and in the
  states a reader reaches by acting.
- Nothing is excluded from the population. A selector the matcher cannot read is reported, never
  skipped.
- **Declared in advance as what the sweep does not reach**: a class a script writes only in a state a
  reader acts into. Every selector the sweep reported was therefore read one by one against
  `start.ts` before anything was deleted.

### What the sweep returned

Measured at `42cb81d`, over the eight documents the tree writes and the served sheet of 27 036 B:

| | selectors |
| --- | --- |
| declared, one per comma-separated member | 263 |
| distinct once states and pseudo-elements are stripped | 212 |
| reached by a page as served | 135 |
| reached only once the module builds its controls | 21 |
| reached only when a reader acts | 9 |
| **reached by nothing** | **47** |

The nine are the two themes, which are a click on the theme button; the invitation, its examples and
the panel's own sentence, which are the search field taking focus; and an answer with its name,
summary and mark, which is a query the catalogue answers with a contract it turned down. Every one of
them is why the sweep drives controls rather than reading markup.

**The 47 are one class in eleven spellings**, and every one is a page that no longer exists:

| | |
| --- | --- |
| the shell and the navigation column, including the six declared only inside a `@media` | 25 |
| the retired catalogue and domain pages' lists — `ul.contracts`, `h3.domain`, `ul.names` | 6 |
| `.what`, `.what .call`, `.what code` | 3 |
| `ul.plain`, `ul.plain > li` | 2 |
| `h2.call`, `h3.call` | 2 |
| `h4`, `h4 + p` | 2 |
| `pre.shape`, `pre.shape code` | 2 |
| the marked entry of a masthead menu and of a footer list | 2 |
| `.address` | 1 |
| `.stacked` | 1 |
| `.elsewhere` | 1 |

**The half measured by a second and independent path.** The emitted tree on disk holds **8 files of
HTML carrying 68 distinct class names**, and not one of the seventeen class names above is among them;
there is **no `<h4>` anywhere**; and `.call` is carried by `a` and by `p` and never by a heading. That
reading goes through `thePublication` and a disk where the sweep goes through `theSite` and a matcher,
so neither is the other's second statement.

### What ships

`packages/site/painting.ts` holds the reader — the selectors a sheet declares, a selector as an
element, and the sheet a page carries. It is where `components.test.ts`'s own reader went, so there is
one reader and not two, and it is wider in both directions: at every depth rather than at the top
level, and stripping pseudo-elements rather than throwing them at the matcher. Measured across that
widening, `a-component-is-painted-by-its-own-rules-and-by-nothing-else` reports **0 faults either
way**, so the factoring cost nothing. What it bought was measured at `42cb81d`, before the deletion:
**18 more selector occurrences, 7 of them spellings that occur nowhere else** — and six of those seven
are what this unit then deleted, so the widening's standing value is the day the next `@media` rule is
written rather than a figure that survives this commit.

`packages/site/painting.test.ts` holds three guards. `packages/site/style.ts` loses 47 selectors and
the two custom properties the deletion orphaned — `--rail` and `--a-contract-in-a-list` — which is
**27 036 B to 23 609 B** of served stylesheet, and **60 geometry declarations to 48** by the rule the
open list's layout entry states.

**One live rule was kept and its condition lost its argument.** `@media (min-width: 50rem)` was
derived as the wider of the two shell arrangements, 49.14rem and 47.40rem. Both are gone and `main`'s
padding above that width is not, so the block keeps its one rule and the number keeps its value with
no derivation behind it. That is written into the comment rather than smoothed, and it is the open
list's own entry about typed widths arriving on a fifth condition.

### Seen red

**47 of 47.** Each deleted selector was put back into the sheet on its own, one run apiece: the sweep
reddened every time, **named that selector**, and was **red alone** — the other two guards green
beside it.

The reader's guard was seen red on five perturbations, one per row: the comma split removed, the depth
stack dropped, the at-rule prelude kept, `focus` written before `focus-visible`, and a state-only
selector left as the empty string. All five red; **the first two red alone**.

## What would reopen this

- **A unit that adds a page or a control.** The 47 were left by ADR-0189 removing five pages and
  ADR-0185 emptying the masthead menu; the next removal leaves its own, and the guard is what turns
  that from a discovery into a red.
- **A rule for a state no guard drives.** It reddens the sweep until somebody drives the state, which
  is the forcing direction. The day a state cannot be driven in this document at all, the answer is
  not an exemption — it is that the rule is unverifiable here and belongs in a browser.
- **A headless browser.** This sweep knows nothing about layout: a rule painting something invisible,
  off-screen or behind another element has a subject as far as it is concerned. The open list prices
  that tool in five other places and this is a sixth.
- **The cycle being broken**, which would let the precondition below take its strong form.

## More Information

### The finding this unit did not go looking for: the sheet depends on the import list

`document.ts` imports `served-stylesheet.ts`, which imports `style.ts`, which imports `components.ts`,
which imports `document.ts`. Under node's own loader the loser of that cycle throws. Under the
transform the test runner applies it is `undefined`, silently.

Measured at `42cb81d`, two files differing only in the order of their imports:

| entered through | `THE_COMPONENT_RULES` | `STYLE` | the served sheet |
| --- | --- | --- | --- |
| `document.js` | 5 949 B | 64 464 B | **27 036 B** |
| `components.js` | 5 949 B | 58 524 B | **21 096 B** |

The 5 940 B difference is the component rules replaced by the nine characters of `undefined`. **The
pages built in such a graph carry that sheet too**, measured rather than inferred — so reading the
sheet off a rendering is no protection.

**One file was already in that state and its guard was blind because of it.**
`components.test.ts` names `./components.js` first, so
`a-component-is-painted-by-its-own-rules-and-by-nothing-else` was sweeping a sheet with no component
rules in it — and a rule one component writes about another was outside its population. Measured with
`& .badge { color: red }` added to the offer's drawing, which is a component painting a component and
the exact fault that guard is named for: **green**.

**The built tree is not affected**, and that was checked rather than assumed: the front page on disk
carries the 27 036 B sheet, every component's rules, and no `undefined`. The defect's blast radius is
guards.

### Why the cycle is not broken here, and what breaking it costs

The only break is `components.ts` giving up `el` and `text`, or `document.ts` giving up the
stylesheet. The first is a leaf module holding the element constructors and their three types, plus an
import line in each of the **nine** modules that take `el` or `text` from `document.js` today. The
second changes `toHtml`'s signature everywhere.

It is a decision about how this folder is arranged and not about what the stylesheet paints, and
landing it beside a 47-rule deletion would make every change in the diff unrecoverable — which is the
objection this repository's open list raises against exactly this move, repeatedly. **It is priced
here and not taken, and it is the owner's to schedule.**

### What stands in its place, and what the compiler already holds

`the-sheet-a-page-carries-is-the-whole-sheet-this-site-composes` refuses a served sheet holding a value
that failed to resolve. It is the sweep's precondition: a sheet missing a sixth of itself would make
the sweep pass over rules it has no opinion about, and that pass would look exactly like a healthy one.
Seen red before it was believed — with `./components.js` imported above the others in `painting.test.ts`,
it names all eight pages.

**The neighbouring defect is the compiler's, measured rather than assumed.** A sheet losing the
component rules because somebody deleted the interpolation is `TS6133: 'THE_COMPONENT_RULES' is
declared but its value is never read`, which ADR-0174's flags turned on. So the removal is refused
before a page is built, and the guard is aimed at the one shape the compiler cannot see.

**The strong form of that guard is unavailable and the reason is the cycle itself.** Asking that the
sheet contain `THE_COMPONENT_RULES` would catch both shapes and needs an import of `./components.js` —
which, in a list written alphabetically beside `./document.js`, is the graph entry that truncates the
sheet. Measured: with that import added, the guard reddens on all eight pages.

**It was declared under the battery's `unprobedRegions` and the instrument refused the run.** The
declaration said no rewritten line of this folder could reach it, because the defect is a module
graph's entry order and a battery rewrites lines rather than adding imports. That is a reading of the
defect and not of the battery: **W-24 serves the stylesheet as a link instead of carrying it**, so a
page carries no sheet at all — which is this guard's claim in its strongest form, and eight other
guards' as well. The replay came back *declared silent and reddened anyway*, the declaration is gone,
and the guard now asserts that a page carries a stylesheet before it reads one, so its red is its own
sentence rather than a reader throwing inside a map. **It has never been red alone**, and that is
recorded rather than repaired: no plausible edit to this folder corrupts a sheet without also
corrupting what stands in it.

### What the method cost, stated rather than smoothed

**Two readings of this repository were published to the session and then discarded.** The first probe
counted 263 selectors and 212 distinct; a second, written to answer a different question, counted 213
and 170 on what should have been the same sheet. The two readers were run side by side and agreed to
the entry, so the input was what differed — and it differed because the second probe imported
`./components.js` first. The figures in this record are the ones a single run at one commit produced,
and the disagreement is what found the cycle above.

**A probe returned a wrong answer twice before it returned a right one.** Its state stripper wrote
`focus` before `focus-visible`, so four selectors were reported as painting nothing that in fact paint
something; and it resolved each playground's reference by filename, which is `reference.js` for all
seven contracts, so six of the seven forms failed to build and `.field .why` was reported dead. Both
are rows of `what-this-reads-as-a-selector-is-what-a-browser-reads-as-one` now.

### What the battery moved

Two anchors came loose on the deletion — **W-85 and W-86 both injected into shell rules that no longer
exist**. They are re-aimed rather than deleted, and the reason is a reading stated with its method:
over every occurrence of their two guard names in `mutation/*.ts` and `packages/site/*.ts`, **each is
the only pin its guard has**. W-85 now types a contract page's ceiling and W-86 the body's own
gutters, which is the outermost track this site has.

**W-164 and W-165 are the two new cells.** W-164 puts `ul.contracts` back — the rule ADR-0195 named
and deliberately did not repair, made into a red. W-165 reads a comma group as one selector, which is
a dead member hiding behind a live one: `body > .masthead, body > .shell` was exactly that shape when
this unit swept it.

### The commands

`pnpm site` is 18 files and 187 tests green, against 17 and 184. `pnpm anchors` is 773 anchors across
104 files with none loose. Nothing under `contracts/` is touched, no digest moves, and
`THE_PACKAGE_VERSION` stays at `1.1.0`.
