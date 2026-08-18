---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/style.ts
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: every-colour-the-stylesheet-paints-with-is-a-role-it-declared
  - battery: site
    guard: a-page-loads-nothing-and-runs-nothing
---

# Six sizes, one unit, and an accent that never says a status

## Context and Problem Statement

The site had no presentation. Measured at `a036396`: the whole stylesheet was 2 707 bytes, the type
was whatever the reader's browser defaults to, there was no dark mode, and a contract page was
35 191 bytes of good content in no system at all. That page is the one a stranger lands on from a
search, and it will be 99 % of this site when the catalogue holds a thousand entries.

The mock-ups Claude Design produced from the real pages carry a system. They are mock-ups and not a
specification: they contain invented functions and domain counts drawn from a fictional catalogue of a
thousand. What is taken from them is the system; none of the data is.

## Considered Options

- Take the mock-up's tokens as they stand.
- Derive a system from them and read every value against what a reader can actually see.

## Decision Outcome

**Six type sizes, one spacing unit, colour roles, one accent, dark by `prefers-color-scheme`.**

The scale is six steps and there is no seventh: a page needing one more size has stopped
distinguishing things and started decorating them. Every length that separates anything is
`calc(var(--s) * n)`, so the rhythm is a consequence of one number rather than a habit. The colours
are named for what they do — paper, wash, card, rule, edge, ink, body, dim — so the dark palette is
the same document with different values and never a second stylesheet. There is no toggle and nothing
is remembered: the reader's system already carries that preference and a second copy of it would be a
second statement to drift.

**The accent means *you can act on this* or *you are here*, and never *this is good* or *this is
bad*.** A link, a focus ring, a hover, the page you are on, the case you followed. This catalogue
publishes every mutant its suite did not catch beside the ones it did, and every contract page carries cases that
exist because a defect got past the suite. Colouring those would sort this repository's own evidence
into things a reader is meant to feel bad about, which is the opposite of why they are published — and
a colour survives neither `toText` nor `toMarkdown`, so the page and its reading would say different
things. Caught and surviving are told apart by the word.

### Two greys and not three, because the third could not be read

The mock-ups carry a `faint` below `dim`, and it was carrying the case identifier, the rail's label
and the page you are on. Read in a browser over the built pages: **2.64:1 on light paper, 3.37:1 on
dark, 2.37:1 on a case a reader has just followed a link to** — against the 4.5:1 that text under 24px
owes them. `dim` is 5.45:1, so there was no room underneath it for a fourth legible step. The role is
gone rather than retuned, because a colour that is only nearly legible is worse than one step fewer,
and what tells an identifier apart from the argument beside it is the size and the face.

`dim` itself is a shade lighter in the dark palette than the mock-ups draw it — `#918b83` rather than
`#8b857d` — on the same reading: the mock-up's value clears 4.5:1 on paper and on wash and answers
**4.24:1 on a targeted case**, which is the one row a reader is certain to be looking at. A ground that
lifts is a ground the ink has to lift with. With the two changes every ink-on-ground pair the palette
can produce clears 4.5:1 in both schemes, measured: 16 pairs light, 16 dark, no exceptions.

### The web font is refused, and not on price

Claude Design proposes IBM Plex Mono, self-hosted, Latin only, three weights, estimated at ~26 kB. The
estimate was not the reason to refuse it and neither was the estimate right.

**Measured** on `@fontsource/ibm-plex-mono@5.3.0`, exact bytes: `latin-400` 14 708 B, `latin-500`
14 888 B, `latin-600` 15 620 B. Two weights is 29 596 B and three is 45 216 B — 74 % above the
estimate for three, and about the weight of a whole contract page again.

**What refuses it is coverage, not weight.** Plex's `latin` subset is `U+0000-00FF` and a short tail
that includes U+2191 and U+2193 — and **not U+2192**. The arrow between a call and its answer is on
every settled case of every contract page: 50 occurrences on `number/parse@1`, 43 on `date/add@1`, 41
on `string/slugify@1`, 23 on `string/levenshtein@1`. Measured over the mono content of the built
pages, `string/slugify@1` carries **59 distinct code points outside `latin`, 57 outside `latin` and
`latin-ext` together**: Japanese, Cyrillic, Arabic, Devanagari, Greek, Gothic, Arabic-Indic digits,
emoji, the `ﬁ` ligature, a Roman numeral, fullwidth letters.

Those are not decoration. They are what `string/slugify@1` settles cases about — the contract's whole
argument is that other people's writing systems survive — and the package holds no subset for most of
them. Shipping the font sets a monospace run in two faces at two advance widths, mid-line, on the page
this unit exists to rebuild. The system stack renders all of it, because the operating system composes
fallbacks that a page cannot ship.

Two costs were priced and did not decide it, and are recorded because they would have. A self-hosted
face needs `url(` in the stylesheet, and `a-page-loads-nothing-and-runs-nothing` refuses exactly that
under a header reading *no external request, no font* — reopening it would have had to keep W-24, the
stylesheet moved into a file, refused. And the font would be a file in the emitted tree at an address
`theHeaderRules` derives no cache policy for, since a font is not an endpoint.

### What the refusal costs, and what would reverse it

`ui-monospace` resolves to SF Mono, to Cascadia or Consolas, to DejaVu Sans Mono — different x-heights,
different advance widths, different weights available. **The page does not look the same on three
machines, and no reading here says it does.** What survives the substitution is what was specified in
units that travel: the case column is `minmax(0, 34ch)`, and `ch` is the width of a `0` in the
element's own font, so the column holds the same number of characters whatever renders it. The scale
is in `rem`, so it follows the reader's own root size. What is genuinely given up is the voice — the
mock-ups' exact texture exists on no machine, including this one.

**It reverses on coverage and not on taste**: a monospace face that renders the arrow and the scripts
this catalogue settles cases on, at a weight that does not double a page. That is a different font
from the one proposed, and it is not one this unit found.

### The stylesheet stays in the page, and the arithmetic that will overturn that is written down

The constraint for this unit is that the CSS is hand-written and served in the page. Measured,
`a036396` against `7f76d8f`: the stylesheet is **2 707 B before and 8 538 B after**, and it is
repeated in every page — **18 949 B before, 59 766 B after** across seven. At a thousand contracts it is 8.5 MB of one repeated text, at
which point a file and one request is cheaper by orders of magnitude. It is not acted on here because
seven copies is not a problem and because a file would be a second address carrying a cache policy
nothing in this repository derives — which is an open entry of its own.

## Consequences

The system lands on all seven pages, because there is one stylesheet. The six pages this unit does not
rebuild keep their structure and take the new tokens; read in a browser, in both schemes and at both
widths, none of them is worse for it. Two defects that only a browser could show were found that way
and are repaired: a paragraph carrying a 64-character digest pushed the whole document sideways at
390px, and the title of a page whose `h1` is a direct child of the body sat against the masthead at a
gap of 0.

The mono face is restricted to what the registry addresses — a contract's name, a command, a value —
and never to a sentence. `What we refuse, and why` was being set in it because the rule was on the tag
rather than on what the tag carried.

## Confirmation

`every-colour-the-stylesheet-paints-with-is-a-role-it-declared` in `packages/site/document.test.ts`
holds that a colour arrives on this site by being named as a role, in one of the two palette blocks;
it is red on `.why { color: #c0392b }`, which is the edit *tint the survivors* would be. What it does
not keep is stated beside it: a `--danger` may still be declared in the palette, and what changes is
that declaring one is an act somebody takes rather than one they slip into.

`a-page-loads-nothing-and-runs-nothing` in the same file is what the font would have had to reopen,
and it is cited here as the thing that stands rather than as a thing this record built.

The contrast readings are a measurement and not a guard, and nothing keeps them. They were taken in a
browser over the built pages with the WCAG relative-luminance formula, in both schemes, over every ink
against every ground.

## What would reopen this

A role the vocabulary cannot name. The eight colour roles cover a reader's page, a card, a wash, two
rules and three inks; a surface that genuinely needs a ninth — a form's error state is the likely one —
reopens the palette, and reopens the accent rule with it, because the first thing such a surface asks
for is a second hue.

The font half reopens on coverage: a monospace face that renders U+2192 and the scripts this catalogue
settles cases on, measured, at a weight that does not double a page.

## More Information

- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — the page this system was
  derived to dress, and the trial that settled its shape.
- [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md) — why one of the two guards here says what it cannot
  establish.
- [ADR-0028](0028-what-a-playground-demonstrates-and-what-it-refuses-to-show.md) — the record this
  repository has twice paid the lesson of: a static check passing does not mean the interface works.
