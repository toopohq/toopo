---
status: accepted
date: 2026-08-30
governs:
  - packages/site/front-page.ts
  - packages/site/chrome.ts
  - packages/site/style.ts
  - packages/site/start.ts
  - packages/site/what-a-control-says.ts
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: every-command-a-page-shows-carries-its-own-copy-control
  - battery: site
    guard: the-chord-the-badge-names-is-the-one-that-reaches-the-search
  - battery: site
    guard: the-shortcut-is-spelled-the-way-the-readers-own-keyboard-spells-it
  - battery: site
    guard: the-press-that-reaches-the-search-is-the-letter-and-a-modifier
---

# The artboard is the specification, and a green suite was not a reading of the page

## Context and Problem Statement

[ADR-0181](0181-the-page-a-reader-arrives-at-is-a-shelf.md) built the front page from a brief that gave
constraints — six contracts, their signatures, their commands, readable with nothing running — and
never gave the artboard as a test. Every constraint was met, every guard was green, and the owner
opened `toopo.dev` in a browser and found a page that does not look like the design.

**The failure is in the acceptance criterion and not in the checks.** *The guards are green* was
treated as *the page is right*, and the two are different claims: `pages.test.ts` builds documents and
reads their text, and nothing in this repository lays a page out. That is an open entry of `CLAUDE.md`
— *that any layout this site declares is one somebody looked at* — and this unit is the sixth time it
has been paid.

## Decision Outcome

**The artboard is the specification. Where a size, a colour, a spacing, a word or an order is in
question, the answer is the file.** Three things outrank it and nothing else does:

1. the page is readable with no JavaScript;
2. every pair of inks clears the contrast floor the guard holds today;
3. the 73 addresses the origin serves do not move.

**And a design unit is not finished until the built page has been opened in a browser, photographed,
and compared with the artboard.** A gap that survives is named with its reason; *I did not notice* is
not a reason.

### The defect a reader would have met, found in a minute by looking at the page

`copyControl` read `document.querySelector('pre.install')`. That is exactly right for every page that
had ever carried an install line, and exactly wrong the day one carried six: **the shelf offered a copy
control on six cards and delivered it on one.**

**Nothing was red.** 718 tests over 30 files, the freeze, the meta suite and every one of the eight
suites were green over it, because the suite counted guards and never controls against commands — and
five cards missing a button read as cards whose design has none. It is a defect a reader meets on the
page a reader arrives at, and what found it was opening the page and looking at it.

That is the argument for the criterion this record sets, and it arrived on the day the criterion was
written rather than being offered as something that might one day happen.

`every-command-a-page-shows-carries-its-own-copy-control` compares the two populations rather than
asserting a number, and that is the repair rather than a detail of it: **a count does not say what it
has lost.** A guard asserting *six* would have to be edited by whoever publishes the seventh contract,
which is the person least likely to notice it had become wrong — the shape this repository has spent
the week naming. Measured: with the defect put back it is red **alone**.

### What else the browser found that the suite could not

Four more, none of them visible to any check this repository holds.

**Two stylesheets declared `.masthead` and both applied.** The old block and the new one coexisted, so
the bar drew twice. Nothing reads a stylesheet for a selector declared in two places.

**The card borrowed three class names from other pages** — `.why` from the domain page, `.shape` from
the catalogue, and `pre.install`'s accent frame — so a card inherited a look decided for a different
surface. The reading was correct throughout.

**A ceiling on a grid item shrank it instead of stretching it.** `.masthead` carried
`max-width: var(--the-page); margin: 0 auto` and was placed `grid-column: 1 / -1`; auto margins on both
sides make a grid item take its content's width, so the rule under the bar ran **355px across the
middle of a 1280 window** rather than edge to edge. The artboard draws two elements — a full-width
banner and a column inside it — and it draws them for exactly this reason. It is two elements here now.

**The signature grew a frame nobody drew.** `.offers .signature` set a font, a colour and a clip and
set no ground, border or padding, so the generic `pre` rule supplied all three. The card is the frame;
what is inside it is a line.

### The badge was written after the shortcut, and that order is the decision

The artboard draws `⌘K` beside the search field. **No such shortcut existed.** Drawing the badge would
have been a control lying about what it does — the class `chrome.ts` refuses in its own header, beside
an inert control and a link wearing a search field's clothes.

So the chord was written first and the badge says what it does. The spelling is read off the platform
rather than fixed, because `⌘K` on a machine whose key is `Ctrl` is a wrong instruction and not a
stylistic choice. Two guards hold it, and their false arms are the ones worth having: a listener keyed
on the letter alone would take every `k` a reader types anywhere on the page.

Measured at the commit this record lands on, by restoring each defect one at a time and reading
vitest's JSON report rather than its console text:

| what was put back | what reddened |
| --- | --- |
| the control is built for the first command only | the copy guard, alone |
| the letter alone reaches the search | the chord guard and the press guard |
| one spelling for every keyboard | the spelling guard, alone |

Two of the four have been seen red alone. The chord guard and the press guard are two statements about
one predicate — one asked of a document, one asked of the function — and that cell reddens both; **the
chord guard has not been seen red alone**, and its own condition is the listener being absent rather
than the predicate being wrong.

### The accounting refused a run, and that is the second thing this unit bought

Re-aiming a cell left a guard with nothing behind it. `W-127` used to redden
`a-page-with-no-slots-on-it-has-nothing-built-into-it` by making `copyControl` assume an install block;
the walk over every block makes that defect **unexpressible**, so the cell was aimed at the clipboard
instead and the guard was left orphaned.

**No suite could have said so.** The guard was green, the cell was green, the site suite was green, and
the total was the total. What said so is the battery, which refuses to call a run healthy when a guard
has nothing reddening it and names the guard rather than printing a figure. `W-150` is the answer — a
control that silences the compiler's null instead of branching on it — and it was **measured before it
was declared**: it reddens that guard and its neighbour, and is alone on neither.

### Five tags entered the node model and the compiler is what admitted them

`header`, `footer`, `span`, `svg`, `rect` and `path`. The union's own rule is what let them in: a tag
belongs when a page writes it, and the compiler refuses one until **both** projections have said what
they do with it. Two of them — `header` and `footer` — had been removed once for having no call site,
and they came back because the artboard draws a banner and a contentinfo. `document.ts`'s comment says
so rather than going on claiming they are gone.

### What departs from the artboard, and why

Each of these is a departure the owner has not ruled on, written here so he rules on it rather than
finds it.

**`ALL FUNCTIONS` where the artboard says `POPULAR FUNCTIONS`.** Nothing in this registry records how
often a contract is installed, so *popular* would be a claim with nothing behind it — and the list is
every contract either way.

**The signature is the record's own form, `type ParseNumber = (input: string) => number | null`, where
the artboard writes the call, `parse(input: string): number | null`.** `ExportRecord.parameters` gives
the parameter list as data and **the return type exists only inside `text`, after an arrow**.
`array/group-by@1`'s text is `<T, K extends string>(items: T[], key: (item: T) => K) => Record<K, T[]>`,
which no naive split answers, so composing the call form means parsing — and
[ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) refuses a second parser in as many words. It
is one string on every surface, which is what let the card be built with no field added to
`contract-index`.

**The domain chips are links and the artboard's filter the grid.** A chip that narrows the page needs
JavaScript, and a domain already has a page listing exactly what a filtered grid would show — so a
reader with nothing running gets the same answer as a reader with everything. The chip for the list a
reader is already on is marked rather than linked, which is the artboard's selected state and the
treatment the masthead already gives the page you are standing on.

**`How we verify` where the artboard says `Docs`.** There is no documentation section; the page that
exists is the method page, and [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md)
argued that name. Naming it `Docs` would send a reader to something this site does not have.

**A closing line the artboard does not draw.** `every-page-is-reachable-from-the-front-page` refuses a
page nothing links to, and no page is removed in this unit, so the turned-down count and the way to the
whole catalogue are stated above the foot. It is composed from the index, so a second refusal lands in
it with nobody editing anything.

**The footer is this page's and not the site's.** The artboard draws one page. Putting a footer on the
other twelve moves `the-rail-of-a-page-names-every-section-of-it-and-only-those` and the reachability
walk on all of them at once, which is a decision about the site rather than about this page.

**The page is dark under a system that asks for dark and light under one that asks for light**, where
the artboard is dark by declaration. That is [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md)
and the owner ruled it; the theme control overrides either way.

### What this does not buy

**The comparison is a photograph and never a guard.** Two screenshots were taken at 1280 in one browser
and read by a person. Nothing here lays a page out, so nothing can hold this — which is the open entry
this unit paid for the sixth time, and the price of closing it is a headless browser as a dev
dependency, priced and refused four times on that list already.

**One host name entered this folder and the guard is what said so.**
`the-generator-knows-of-no-domain-but-the-one-it-publishes-on` reddened on `www.w3.org`, which
`createElementNS` requires to build an SVG element at all. It joins the two vocabularies already
exempted — names a machine reads as identifiers and never fetches — rather than gaining an exemption of
its own kind.

## What would reopen this

- The owner ruling on any of the seven departures above, in which case that departure closes and this
  record says which.
- A registry field recording how often a contract is installed, which would let the list be *popular*
  rather than *all*.
- A published contract whose signature the record holds in a form a card can render as a call, which
  would remove the parser constraint without adding a parser.
- Units 3 and 4 of the redesign reaching the other twelve pages, at which point the footer becomes
  furniture and this record's reason for it being one page's expires.
- A headless browser entering this repository, at which point the comparison this unit performed by
  hand becomes a check and the departures above become guards rather than sentences.
