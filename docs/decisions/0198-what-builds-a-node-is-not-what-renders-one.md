---
status: accepted
date: 2026-09-02
governs:
  - packages/site/tree.ts
  - packages/site/document.ts
  - mutation/site.battery.ts
confirmed-by:
  - battery: site
    guard: the-sheet-a-page-carries-is-the-whole-sheet-this-site-composes
---

# What builds a node is not what renders one

## Context and Problem Statement

[ADR-0197](0197-a-rule-this-stylesheet-paints-is-a-rule-a-page-writes.md) found a cycle it was not
looking for and deliberately left it: `document.ts` imports `served-stylesheet.ts`, which imports
`style.ts`, which imports `components.ts`, which imports `document.ts`. It priced the two ways out and
took neither, because breaking a cycle is not what a unit about selectors does.

What the cycle costs is not a crash. Node's own loader throws on whichever module loses the race; the
transform the test runner applies answers `undefined`, silently. So the stylesheet a guard reads was
the whole sheet or the sheet with a hole in it **according to which module its file happened to name
first** — and one file was already in that state, with the guard whose subject is that every component
is painted by its own rules sweeping a sheet that carried no component rules.

**The dangerous loader is the one the guards run under**, which is what makes this a defect in the
instrument rather than an untidiness in the graph.

## Decision Drivers

- The measurement decides between the two cuts, and the argument decides only where the measurement is
  level.
- A cut is judged by what it leaves, not by what it removes: the graph after, and whether any entry
  order can still truncate.
- A guard written on the far side of the cut has to be able to redden. A guard born on a population
  that the cut has just emptied is what this repository has paid for repeatedly.
- Nothing a reader receives may move. This is a rearrangement of modules, not a change of rendering.

## Considered Options

ADR-0197 named both and this unit measured both. Each breaks the only cycle: **0 cycles remaining on
either side**, so the graph does not choose.

| | **A** — the node vocabulary leaves `document.ts` | **B** — `toHtml` gives up the stylesheet |
| --- | --- | --- |
| cycles after | 0 | 0 |
| modules touched | 9 | 6 |
| what changes | import lines | **23 call sites** |
| call sites changed | 0 | 23 |

The 23 are `document.test`:13, `start.test`:3, `pages.test`:2, `painting.test`:2, `site`:2,
`components.test`:1.

**What decided it is a property `document.ts` declares in its own header, and not the count.** That
header reads *a page is a value, and `toHtml`, `toText` and `toMarkdown` are projections of it*.
`toText` and `toMarkdown` take one argument. Option B gives `toHtml` two, so the three projections stop
being three statements about one tree — and `every-word-of-the-page-is-in-every-projection` loses the
symmetry that makes it legible. **A cut that costs a property the file declares is not a cheaper cut;
it is a cut that pays somewhere else.** Option B does not move the problem out of the graph either: it
moves it to every caller, each of which then has to know about the stylesheet.

Option A repairs the cause. `el` and `text` build a node; `toHtml` serialises one. It was their living
in the serialiser's file that made the ring unavoidable, because every module that builds a node then
had to import the module that renders one — and the stylesheet paints components, and a component
draws markup.

**No existing module was a home for them**, which was searched before one was written. The fourteen
modules of this folder that import no sibling are addresses, the compiler's scanner, the bytes of a
font, the search, the registry source and the like; not one is a vocabulary of nodes. `marks.ts` and
`quantity.ts` build nodes and are consumers rather than leaves.

## Decision Outcome

`packages/site/tree.ts` holds `Tag`, `Attributes`, `TextNode`, `Element`, `Node`, `text` and `el`, and
**imports nothing**. It takes its name from the section heading `document.ts` has carried since it was
written — *Why a page is a tree and not a string* — rather than from a type it exports.

The property to keep is the leaf and not the file boundary: anything `tree.ts` ever imports can be
reached from a page, and a page is what `document.ts` renders, so an import added there is the cycle
again by a longer road. That sentence is in its header, where somebody about to add one will read it.

### What moved

**Ten files, twelve import lines, no call site.** The two counts are two populations and the rule for
each is written down, because ADR-0197 published the first and this unit needed the second:

- **nine** modules take `el` or `text` from `document.js` as values — `chrome`, `components`,
  `contract-page`, `front-page`, `marks`, `not-found-page`, `quantity`, `document.test`, `site`. That
  is ADR-0197's figure and it reproduces exactly.
- **ten** files had an import line to move, the tenth being `pages.test.ts`, which takes `Element` and
  `Node` as types. A type-only import is erased and was never on the cycle; it moves because the types
  moved.

`document.ts` keeps `Document`, `StructuredData` and the three projections, and takes `Element`, `Node`
and `Tag` back as an erased import.

**The escaping argument moved half a step and is stated once.** *No node kind carries raw markup* is a
property of the vocabulary, so it is declared in `tree.ts`, where a new kind would be written, and
cited in `document.ts`, where the escaping is.

### The graph, before and after

| | modules | sibling imports | cycles |
| --- | --- | --- | --- |
| `6f60525` | 52 | 181 | **1** |
| after | 53 | 187 | **0** |

### No entry order truncates, over every entry there is

One child process per entry module, because the truncation is a property of the module cache and a
single process would answer for whichever module it loaded first. The population is every `.ts` of
`packages/site` that is not a test file — `vitest` is not importable outside a run — nor
`vitest.config.ts`, a configuration, nor `build.ts`, a script that writes the tree.

**At `6f60525`, 32 entries:**

| answer | entries |
| --- | --- |
| 23 609 B, component rules present, no `undefined` | 29 |
| `ReferenceError: Cannot access 'THE_COMPONENT_RULES' before initialization` | `components` |
| `ReferenceError: Cannot access 'STYLE' before initialization` | `style` |
| `ReferenceError: document is not defined` | `start` |

**After the cut, 33 entries:**

| answer | entries |
| --- | --- |
| 23 609 B, component rules present, no `undefined` | **32** — `browser`, `catalogue`, `chrome`, `components`, `contract-page`, `document`, `font`, `front-page`, `geist`, `highlight`, `indexing`, `literal`, `local-source`, `marks`, `not-found-page`, `painting`, `paths`, `playground`, `quantity`, `read-literal`, `scanning`, `searching`, `served-headers`, `served-modules`, `served-stylesheet`, `site`, `source`, `style`, `theme`, `tree`, `what-a-card-says`, `what-a-control-says` |
| `ReferenceError: document is not defined` | `start` |

**Exactly two entries changed behaviour and they are the two that were on the cycle.** `start.ts` reads
the global `document` at load and is the module a browser runs; it is not on the stylesheet's graph at
all, and it answers the same way on both sides, which is what says the sweep is reading a cycle rather
than an environment.

### The same reading under the loader that matters

Node throws; the runner does not. So the reading above is repeated inside the suite, with a file naming
`./components.js` first — the order `components.test.ts` carries.

| | `STYLE` | the served sheet | occurrences of `undefined` |
| --- | --- | --- | --- |
| `6f60525` | 49 409 B | **17 669 B** | 1 |
| after | 55 349 B | **23 609 B** | 0 |

The 5 940 B difference is the 5 949 B of component rules replaced by nine characters. **That is the
same arithmetic ADR-0197 measured at `42cb81d`** against a sheet 3 427 B larger, which is the reason
its figures are 27 036 and 21 096 where these are 23 609 and 17 669 — its own unit deleted 47 selectors
between the two coordinates. Nothing in that record is made false by this reading; it described one of
the two loaders correctly and stamped its table, so it is extended rather than corrected, and it
carries no head note.

### The sheet a reader receives does not move

**23 609 B before, 23 609 B after**, which is the whole of what a rearrangement of modules is allowed
to do. `pnpm run freeze` is green either side, no file under `contracts/` was touched, and the eight
published bindings are unmoved.

## The precondition guard is refused, and the measurement is why

ADR-0197 wanted a stronger form and named the cycle as what made it unavailable: *asking that the sheet
contain `THE_COMPONENT_RULES` would catch both shapes, and it needs an import of `./components.js`*.
The cut makes that import harmless. **The form is refused anyway, and not on its price.**

**It compares a value with itself.** Both sides are read out of one graph, so a defect in the rules
moves them together. Measured with `paintedBy` leaving `&` unresolved — a component layer painting
**fifty selectors no element matches**, a real defect a reader would meet, the sheet going 23 609 B to
23 328 B:

| | the strong form answers |
| --- | --- |
| as it stands | passes |
| `paintedBy` leaving `&` unresolved, 50 dead selectors served | **passes** |

That is `GUARD_PERTURBATION_RULE` exactly: it perturbs the object derived from the claim rather than
the claim. **Its only red in this repository's history came from the load order this unit removed** —
the two sides differed by accident of module cache, and the accident is the defect.

**The mutant was searched for and the two candidates are the compiler's.** Rewriting `components.ts` to
take `el` and `text` from `./document.js` again — the one-line way back to the cycle — is `TS2305`,
because those names live in `tree.ts` now. Deleting the interpolation is `TS6133`. Both flags are
[ADR-0174](0174-a-disappearance-nothing-noticed-is-a-question-and-not-a-verdict.md)'s, both were run
rather than recalled.

So the refusal is a result and what replaces it is the sweep above, published in full rather than
summarised.

## What became of `THE_UNRESOLVED`

It refused a sheet holding the word `undefined`, which is the shape the cycle produced. **It cannot
redden any more and it is gone**, which is rule 5 rather than a preference. Measured: three
interpolations reach this sheet — `THE_FONT_FACE`, `THE_SANS_STACK` and `THE_COMPONENT_RULES` — and
every one is a `const` of a module that now imports nothing or imports only leaves. A cycle was their
only producer, and there is no cycle.

**Removing it would have left the guard's name over-claiming**, which is what forced the replacement
rather than a deletion. Two of the three arms assert that a page carries a stylesheet; the third was
the only one saying it is the *whole* sheet. What stands there now is the guard's own name, and nothing
in this repository was making that comparison:

```ts
sheets.filter(([, sheet]) => sheet !== THE_SERVED_STYLESHEET)
```

**It is a claim about the rendering and not about the sheet's content**, which is what keeps it from
being the self-comparison refused above. A defect inside `served-stylesheet.ts` moves both sides
together and belongs to that file's own three guards; a defect on the way into the page moves them
apart and belongs here.

### Seen red

`document.ts` sending the sheet through `escapeText` — the one string its own header says must never
pass through there. It compiles.

**Red on all eight pages, and red alone: 1 failed, 186 passed.** That is new. Read off the recorded
results, this guard's `soleRedOn` is empty and its three witnesses each take a crowd with them — W-19
sixty-seven guards, W-20 seventy-four, W-24 nine — so a run could say only that it *would* catch its
defect if its neighbours went away.

### What the battery moved

**One cell and no guard**, so the census does not move and the suite still collects 187.

`W-167` injects that perturbation. Its pin names one guard and **the pin was audited by hand-injection
rather than by the replay**, because a pin is checked as a subset and extra reds never disagree with
it: applied on its own, the run reports one failure and it is this guard.

**The three witnesses were re-measured rather than assumed to survive**, since the arm they redden was
rewritten under them. All three still redden it — W-19 with 67 guards red, W-20 with 74, W-24 with 9 —
which is exactly what the recorded results say, so the population gained a witness and lost none.

`README.md` moves with it: **842 cells to 843, 800 caught to 801**. The 42 survivors and their
classification do not move, and `every-figure-in-the-readme-is-the-one-the-instrument-declares` is what
would have said so had they been forgotten.

## What would reopen this

- **A module of `packages/site` importing `tree.ts`'s importers.** The leaf is the mechanism and
  nothing executes it: a guard over the folder's import graph was considered and is not taken here,
  because it cannot be reddened by a rewritten line either — every candidate is `TS2305` — and a
  born-green guard the battery has to be told about is a decision of its own. What stands instead is
  the sentence in `tree.ts`'s header and the sweep in this record.
- **A second cycle anywhere in the folder.** The sweep is a command and not a suite; it is in this
  record so that anybody can take it again, and it says nothing about tomorrow.
- **The strong form becoming reddenable.** It is refused on being a self-comparison, not on the cycle.
  Something that reads what the component rules *ought* to be, independently of `components.ts`, would
  reopen it — and this repository has nothing that does.

## More Information

### What this unit got wrong on the way, which is worth more than the cut

**The first probe read prose as code.** `components.ts` carries the word `import` inside a doc comment,
and an unanchored pattern read the sentence after it as an import clause, inventing edges.

**The second probe checked itself with the pattern it was testing.** Its control counted sibling
imports with the same greedy expression that parsed them, so the two agreed by construction and the
control could not fail — the exact class this repository spent the preceding week closing, committed
inside the instrument that was hunting it. What caught it was giving the check a needle that shares
nothing with the parse: `from './` counted with no notion of where a clause begins or ends. Every
figure above comes from the third probe, whose control passes on all 53 modules.

### One thing found and not taken

`document.ts` carries a doc comment opening *A whole page: what it is called, what it is about, and
what it says* immediately above the comment for `StructuredData`, so the `Document` type's own
paragraph is orphaned two declarations away from it. It predates this unit and is left, because moving
it is a change to a file this unit is already rearranging for another reason and the two would be
unrecoverable from each other in the diff.

### The commands

```sh
# the graph, its cycles, and what each cut leaves
node <probe> packages/site

# the served sheet, one child process per entry module
node <probe>

# the sheet under the runner, entered through components.js first
node run-vitest.ts run --config packages/site/vitest.config.ts

# nothing a reader receives moved
pnpm run freeze
npm run anchors
```
