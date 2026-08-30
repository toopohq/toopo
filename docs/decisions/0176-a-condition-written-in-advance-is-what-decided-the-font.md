---
status: accepted
date: 2026-08-30
decision-makers: Mathis Perron
governs:
  - packages/site/font.ts
  - packages/site/geist.ts
  - packages/site/theme.ts
  - packages/site/style.ts
  - packages/site/document.ts
  - packages/site/chrome.ts
  - packages/site/start.ts
  - packages/site/site.ts
confirmed-by:
  - battery: site
    guard: a-page-fetches-nothing-but-the-face-this-repository-serves
  - battery: site
    guard: every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible
---

# A condition written in advance is what decided the font

## Context and Problem Statement

The owner has redesigned the site. The design is his and it is decided; what this unit settles is how
it lands in this repository. It is the first of four — the chassis: palette, typography, header,
theme. Every existing page inherits it, none is removed, and at the end of it the site works exactly
as it did and wears the new head.

The design asks for Geist and Geist Mono. `document.ts` declared, since ADR-0115, that a page *names
nothing a browser has to go and fetch* — no stylesheet link, no font, no image — and
`a-page-loads-nothing-and-runs-nothing` held it. Any font, hosted here or anywhere, takes that.

The design also asks for a theme button. ADR-0115 refused one in as many words.

So the question was not *how do we add a font*. It was *what is that property worth, measured, and
what do we buy by giving it up* — because a property that has held for a year should not fall as a
side effect of a stylesheet.

## Decision Outcome

**The prose is set in Geist, self-hosted. The monospace is not. The theme button ships. The focus
ring is corrected and nothing else about the palette is.**

### ADR-0115 wrote a condition, and the condition is what decided this

ADR-0115 refused IBM Plex Mono, and **it refused it on coverage rather than on weight** — it says so
itself, and the estimate it was given was wrong in the direction that would have made weight the
easier argument. What it wrote down was this:

> The font half reopens on coverage: a monospace face that renders U+2192 and the scripts this
> catalogue settles cases on, measured, at a weight that does not double a page.

That is a condition somebody can run. It was run.

**Geist Mono fails it on the first term.** Measured on 2026-08-30 against the exact Google Fonts
request the artboard makes — 13 756 B of CSS, 38 `@font-face` blocks — the subsets served are
`latin`, `latin-ext`, `vietnamese`, `cyrillic`, `cyrillic-ext` and `symbols2`, and **U+2192 occurs in
none of their `unicode-range` declarations**. Geist Mono carries the same `latin` block Plex carried:
U+2191 and U+2193, and not the arrow between them. Twelve of fourteen probes fail for both families —
Japanese, Devanagari, Arabic, Arabic-Indic digits, Greek, Gothic, emoji, the `ﬁ` ligature, a Roman
numeral, fullwidth — and only Cyrillic and the combining acute pass.

**The population is this catalogue's own.** Measured over the emitted tree at `ac71b1e`, 17 pages:
**51 distinct code points above U+007F that no Geist Mono subset covers, over 373 occurrences**, of
which **U+2192 is 241** — 50 on `number/parse@1`, 49 on `object/deep-equal@1`, 45 on
`string/slugify@1`, 43 on `date/add@1`, 31 on `number/round@1`, 23 on `string/levenshtein@1`.

**The reading that decided the shape is that the two populations agree.** Swept over all text and
swept over `<code>` and `<pre>` alone, the uncovered count is the same: **51 and 373 either way**. So
every character Geist Mono cannot draw is served inside a monospace element, and none is in prose.
Shipping Geist Mono would set a monospace run in two faces at two advance widths, mid-line, on every
settled case of every contract page — which is ADR-0115's own objection, now measured against the
face the design asks for rather than the one it refused.

The weight is not the argument and is recorded because it would have been: **52 528 B** for the two
latin faces. A first reading said 186 984 B and was wrong — Google declares seven weights against
**two distinct addresses**, because both faces are variable over `font-weight: 100 900`. The correct
figure is 1.16 times the 45 216 B ADR-0115 refused, which settles nothing either way and is exactly
what that record predicted.

### So the prose gets a face and the monospace does not

The prose carries **three code points above U+007F across all seventeen pages** — U+2014 seventy-six
times, U+00B7 twenty-four, U+2019 twice — and Geist's `latin` subset covers all three. The face is
asked for nothing it cannot draw.

**One file, 29 400 B, variable over the whole weight axis**, so the four weights the artboard names
are four instances of one download.

**Self-hosted and not Google.** Two third-party origins on every visit is not available to a project
whose argument is that you need not take its word for anything.

### It is base64 in TypeScript, and that is a measurement

All **503 files this repository tracks are text**; `.gitattributes` declares `* text=auto eol=lf`
over every one of them. Two sweeps read each tracked file as UTF-8 — `citationFaults`, which matches
`ADR-NNNN` in every one, and `nothing-the-installer-does-not-copy-is-marked`, which asks each whether
it carries a licence header. **A binary would have reddened neither.** It would have joined the
population of both in silence, which is the class this repository keeps an open entry about.

Encoding costs 33.3 % — 39 200 characters against 29 400 bytes — paid in the repository and not by a
reader. The module round-trips to the original file byte for byte: `wOF2`, 29 400 B, sha256
`19f9c925…`, identical.

### The address carries the digest, which is where the cache policy comes from

`cachePolicyFor` derives a policy from the addressing class alone, and a font is the clearest
`content-addressed` answer this tree has: different bytes are a different digest and therefore a
different address. Served at `font/<sha256>.woff2`, it gets `public, max-age=31536000, immutable`.
Named, it would have been `max-age=0, must-revalidate` — a round trip on every page load for a file
that has never differed from itself.

**`build.ts` classes it, and that is not tidiness.** The breakdown is computed by subtraction — the
answers are what is left once everything classified is removed — so a file nobody classed is reported
as an answer. The tree goes **128 files to 129, and the 73 answers do not move**.

### Which half of the guard fell, measured rather than argued

The guard made three assertions. Only one of them was about the font, and the one that matters was
untouched:

| assertion | what it refused | after this unit |
| --- | --- | --- |
| no absolute address, no `@import`, no `url(` | third parties, and any fetch from CSS | the first two stand; `url(` becomes an equality |
| exactly one `<link>`, the Markdown twin | **W-24 — the stylesheet moved out into a file** | **untouched** |
| no `<script>` | anything of the page's own running | falls to the theme |

ADR-0115 set the criterion for reopening this guard in advance: *the mutant it existed for stays red*.
W-24 dies on the **link list**, because `/site.css` is relative and no absolute address appears — so
admitting the face never went near the assertion that was load-bearing. That is a property of where
the edit landed rather than luck, and it is why the font is declared inside the stylesheet and why
there is deliberately **no `<link rel="preload">`**: preloading would buy one round trip and give up
the guard that keeps the sheet in the page.

**The name went false on both halves, so it is two guards now.** `a-page-loads-nothing-and-runs-nothing`
became `a-page-fetches-nothing-but-the-face-this-repository-serves` and
`nothing-a-page-runs-was-fetched-to-run-it`. ADR-0017 asks that falsifying a name and reddening the
guard be the same event, and a name that has quietly stopped describing its own assertion breaks that.

**The `url(` arm got stronger in the trade.** It said *no url() anywhere*; it says *exactly this
`url()`, and no other*. A second face, an image, a background or a cursor each reddens it, where
before only the class of them did.

### The theme, and why nothing is needed to read

The palette is **dark by declaration and light under `prefers-color-scheme: light`**, both in CSS. A
reader running no JavaScript gets their own system's theme and every word of the page. The button is
an override for the reader whose system says one thing and who wants the other, and it is served as an
empty slot — the arrangement ADR-0137 established for the search field — so a reader without
JavaScript meets a masthead with nothing extra in it rather than a control that does nothing.

**One script is inline, in the head, blocking.** A deferred module runs after the first paint, so a
reader who chose light on a dark system would watch the page turn on every navigation — their own
choice arriving late and visibly. That is the whole of what it does: read one key, check it against
two values, set one attribute, swallow any failure.

**The overruling is recorded as an overruling.** ADR-0115 wrote *there is no toggle and nothing is
remembered: the reader's system already carries that preference and a second copy of it would be a
second statement to drift.* Unlike the font half, that named no condition that would reopen it, so
nothing was met and the owner decided. What the drift argument was right about is answered rather
than dismissed: the stored value means *the reader asked for this* and never *the reader's system is
this*, so a reader who has never pressed the button has nothing stored and nothing that can go stale.

### `light-dark()` was measured and refused, and the duplication it would have removed is guarded

Light applies under two independent conditions — the system says light, or the button was pressed —
and a selector list cannot cross a media query, so no arrangement of plain CSS states those twelve
values once. `light-dark()` does. It was refused on a measurement:

| | Chrome | Firefox | Safari |
| --- | --- | --- | --- |
| `:has()`, already used ten times | 105 | **121** | 15.4 |
| `@container`, already used | 105 | 110 | 16 |
| `light-dark()` | **123** | 120 | **17.5** |

It costs nothing on Firefox, where this sheet's floor is already higher, and **moves the Chrome and
Safari floor to May 2024** — where a reader below it gets a page with no colours at all rather than
one that degrades. Twelve declarations are not worth that.

So the light palette is written twice and
`the-palette-a-reader-gets-from-the-button-is-the-palette-their-system-would-have-given-them`
compares the two, character for character with whitespace collapsed. The duplication stopped being
something anybody has to remember.

### The focus ring is the one correction made to the design

The artboard declares two accent tokens — a vivid one for buttons and rings, a darkened one for
accent text — and leaves the vivid one unchanged in light. This sheet has had **one** accent role
since ADR-0115, and it carries both jobs: `a { color: var(--accent) }` and
`:focus-visible { outline: 2px solid var(--accent) }`.

Left vivid, the ring measures **1.76:1** on light paper where WCAG 1.4.11 owes a non-text indicator
3:1. **Keyboard focus invisible on a light system.** The value taken is the artboard's own darkened
accent, so the correction introduces no colour the owner did not choose: the ring is **4.76:1**.

### What is not corrected, with its figures

The owner has not ruled on these and nothing here changes them.

| | ratio | owed |
| --- | --- | --- |
| `--faint` on `--bg`, dark | 3.51:1 | 4.5:1 |
| `--faint` on `--bg2`, dark | 3.36:1 | 4.5:1 |
| `--faint` on `--bg3`, dark | 3.12:1 | 4.5:1 |
| `--faint` on `--bg`, light | 2.81:1 | 4.5:1 |
| `--faint` on `--bg2`, light | 2.64:1 | 4.5:1 |
| `--faint` on `--bg3`, light | 2.49:1 | 4.5:1 |
| `--tk-c` on `--bg`, dark | 3.46:1 | 4.5:1 |
| `--tk-c` on `--bg3`, light | 2.49:1 | 4.5:1 |
| `--accent-text` on `--bg2`, light | 4.47:1 | 4.5:1 |
| `--accent-text` on `--bg3`, light | 4.22:1 | 4.5:1 |

**`--tk-c` is the comment colour, and in the artboard the examples are entirely comments.** Every
example is written `parse("1,234.5")   // 1234.5` — the call, then the answer as a comment. So the
half of each example that says what the function *returns* is the half below the floor, in both
themes. The six syntax tokens are not declared in this unit at all: nothing paints with them yet, and
a declared role nothing uses is dead code. They arrive with the contract page.

**The pair the brief expected to fail does not.** `--muted` on `--bg2` in light is **5.42:1** and
clears comfortably. What fails is elsewhere, and the sweep is what said so.

### The irony, which is the finding rather than an aside

**ADR-0115 removed a role called `faint` because it measured 2.64:1 on light paper.** The redesign
reintroduces it, and it measures **2.64:1 on light wash**. The same figure, eight months apart, in a
repository that exists so that figures do not drift.

Nothing connected the two. ADR-0115's argument is in a comment in `style.ts`, the artboard was drawn
from a different starting point, and the collision was found by running the arithmetic rather than by
anybody remembering. It is written into `style.ts` beside the palette, in the paragraph that carries
the original argument, because that is the file somebody opens when they ask why the number is
allowed.

### The guard that said so had to change, and what that costs is stated

`every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` refuses exactly this, and it was
red on the artboard's values. Its claim cannot survive a palette that fails it, and nobody here may
retune a colour the owner chose.

It became `every-pair-below-the-legible-floor-is-one-this-repository-declared`: **eleven rows, each
naming a pair and the ratio it measures, exact in both directions.**

- **Given up:** the guard no longer refuses an illegible ink.
- **Bought:** it refuses a *new* one, and it refuses a *stale* declaration. A pair that drifts by a
  hundredth reddens, a pair that appears reddens, and a pair repaired without its row being removed
  reddens.

The debt is counted rather than carried, which is the shape `unreachableGuards` and `leavesUnanswered`
already have one folder over. **This is the owner's to ratify or overturn**, and it is the one thing
in this unit taken on the assistant's judgement rather than on his.

**He overturned it, and the guard carries its old name again.**
[ADR-0178](0178-every-ink-clears-the-floor-and-an-asymmetry-is-what-decided-the-last-one.md) raised both inks, took the
eleven rows out and put the strong claim back, so the trade above lasted one unit. The paragraph stays
as it was written because it is the account of a decision that was really taken, and because what it
gave up is exactly what the next unit had to buy back.

## Consequences

The tree writes **129 files** where it wrote 128; the **73 answers are unchanged**, and so is every
address a client asks for. `_headers` gains one block, `/font/*`, carrying a year and `immutable`.

The site suite goes **180 tests to 183**. Two guards were renamed, one had its claim replaced, and
three are new.

`packages/site/theme.ts` joins `THE_BROWSER_GRAPH` and `LOADED_BEFORE_A_READER_ACTS`, so a reader
downloads the theme constants as well as the head script's copy of them — about 140 B, paid for the
coherence of one fact having one spelling.

**The repository now redistributes something under a licence that is not its own.** Geist is SIL OFL
1.1. Its copyright line declares no Reserved Font Name, so subsetting and keeping the name are both
permitted; the notice travels in `geist.ts`'s header because the licence requires it to travel with
any copy, and the full text is `packages/site/geist-ofl.md`. Nothing of it reaches npm: `files:
["dist"]` and `reachable.ts` keep `packages/site/` out of the archive entirely.

## Confirmation

Every guard this unit wrote or moved was put in front of the defect it exists for, one at a time, with
the tree restored between each. Verdicts read from vitest's JSON reporter rather than scraped from a
console. Control: **183 passed, 0 failed**.

| the defect | what reddened |
| --- | --- |
| W-24, the stylesheet moved out into a file | `a-page-fetches-nothing-but-the-face-this-repository-serves` |
| the face fetched from a third party | the same, and `the-generator-knows-of-no-domain-but-the-one-it-publishes-on` |
| a second thing fetched by the sheet | the same, **alone** |
| the theme script fetched instead of carried | `nothing-a-page-runs-was-fetched-to-run-it` |
| the script writes an attribute the sheet does not read | `the-script-that-sets-the-theme-agrees-with-the-stylesheet-that-reads-it`, **alone** |
| the button and the system hand out different light palettes | `the-palette-a-reader-gets-from-the-button-…`, **alone** |
| a twelfth pair falls below the floor undeclared | `every-pair-below-the-legible-floor-is-one-this-repository-declared` |
| a declared pair repaired without its row removed | the same, the other direction |
| the face served at an address that is not its digest | `only-what-is-addressed-by-its-content-is-cached-for-a-year`, **alone** |

**One perturbation came back green and that is the finding of the confirmation.** With
`[data-theme='light']` mistyped on the palette block, the count stayed at three, the two light blocks
stayed identical, and every guard passed — while the button set an attribute no palette answered to.
The button would have done nothing, on every page, silently. `palettesIn` carries the selector now
and the palette guard asserts all three, seen red on the same edit.

**Two guards caught their own author.** `the-generator-knows-of-no-domain-but-the-one-it-publishes-on`
reddened on the comment written to exempt `geist.ts` from it, because that comment quoted the
copyright notice in full. And the first draft of the stylesheet would not compile: the sheet is one
template literal, and the backticks in the new CSS comments ended it.

## What would reopen this

**The monospace half reopens on coverage, and the condition is unchanged from ADR-0115**: a monospace
face that renders U+2192 and the scripts this catalogue settles cases on, measured, at a weight that
does not double a page. Geist Mono is not it and no re-release of it will be — the subsets are
Google's and the arrow is not in them.

**The legibility exemption reopens the day the owner rules on `--faint`.** Eleven rows, of which seven
are one ink. If that ink lifts — `#606a6e` to `#7c868a` on dark, `#8f999d` to `#636d71` on light, each
measured — the rows go with it and the guard can say what it used to say.

**`light-dark()` reopens when Safari 17.5 and Chrome 123 are older than this sheet's own floor**,
which is a date and not a judgement: the moment `:has()` on Firefox 121 is the binding constraint on
every engine, the duplication and the guard that keeps it can both go.

**The count of served addresses reopens the cache question.** A second face, or a module addressed by
its content, makes `/font/*` a family rather than a file — and the second of those is the closure
ADR-0170's open entry already names for the browser modules.

## More Information

- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — the record this one
  answers: the system, the accent rule, the refusal of a web font and the condition that reopened it.
- [ADR-0137](0137-the-site-serves-the-search-the-client-serves.md) — the empty-slot
  arrangement the theme button reuses, and the promise it keeps for a reader with no JavaScript.
- [ADR-0141](0141-a-reader-receives-the-rules-and-not-the-argument-for-them.md) — why the stylesheet
  reaches a reader with its prose stripped, and the byte comparison a linked file was refused on.
- [ADR-0170](0170-every-address-this-tree-serves-carries-a-policy-this-repository-chose.md) — the
  cache rules the font's space joins, and the entry that names content-addressing as its closure.
