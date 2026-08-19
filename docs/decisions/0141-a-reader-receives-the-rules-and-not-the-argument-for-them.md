---
status: accepted
date: 2026-08-20
decision-makers: Mathis Perron
governs:
  - packages/site/served-stylesheet.ts
  - packages/site/document.ts
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: the-stylesheet-a-reader-receives-carries-no-comment
  - battery: site
    guard: what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else
  - battery: site
    guard: what-this-reads-as-a-comment-is-what-a-browser-reads-as-one
---

# A reader receives the rules and not the argument for them

## Context and Problem Statement

`style.ts` carries the reason a length holds the value it holds beside that length, which is this
repository's own rule about where an argument lives. The stylesheet is inlined into every page. So the
whole of that reasoning was being downloaded by every visitor, on every page, for ever.

**Measured at `018a2da`, on the emitted tree**, over the fifteen files of HTML the build writes.
Comments are the runs a browser reads as one, counted by a scan that knows a string, so an apostrophe
in prose is prose and a delimiter in a value is a value:

| | bytes |
| --- | --- |
| the stylesheet, as served | 41 540 |
| its comments, 75 of them | 25 007 |
| what is left | 16 533 |

The front page carries 1 593 B of its own and 41 555 B of `<style>…</style>`: **twenty-six times more
stylesheet than page, of which three fifths is prose about the stylesheet.**

**The raw figure is not what a reader pays, and correcting for that is what made this decision
believable rather than merely obvious.** These pages are served `Content-Encoding: br`, read off the
origin at `501e32a`. In brotli at quality 11:

| | raw | brotli |
| --- | --- | --- |
| the stylesheet with its comments | 41 540 | 11 236 |
| the stylesheet without them | 16 533 | 3 267 |
| the prose | 25 007 | **7 969** |

So the raw count overstates by a factor of **3.1**, and what is left is still **68 % of what the front
page transfers** — 11 724 B to 3 781. Per page the saving runs from 7 697 B on the method page, the
heaviest, to 7 974 B on a domain page. Over the tree, **236 960 B against 118 759**: half the HTML
weight of this site was the commentary of one stylesheet.

**Nothing is removed from `style.ts`.** The prose is the reason the constants hold their values and it
is worth what it weighs where it is. What changed is what a reader downloads.

## Considered Options

### Refused: a linked stylesheet, one request for the whole site

The header of `style.ts` has argued since ADR-0115 that a file and one request becomes the cheaper
half at a catalogue of a thousand contracts, and is not cheaper today. That was argued and never
measured. It is measured here, on the front page, in brotli:

| | first page | every page after |
| --- | --- | --- |
| inline, comments in | 11 724 | 11 724 |
| inline, comments out | 3 781 | 3 781 |
| linked, comments out | 3 787 + one round trip | 541 |

Linking buys 3 240 B per additional page. It costs a render-blocking round trip before the first
paint; one more address that no listing names, which is an entry already on the list of what this
repository declares and nothing keeps; and **a cache policy this repository does not derive**.
`theHeaderRules` derives one rule per endpoint from `ENDPOINTS`, and a stylesheet is not an endpoint,
so a `.css` file would fall through to the host's default — measured at four hours on the nine modules,
against pages served `max-age=0`. That divergence is already recorded as a cost paid on `start.js`: a
reader returning inside four hours meets the repaired HTML and the stale script. **A stale script is a
control that does nothing; a stale stylesheet is the page.**

**The decisive point is that taking the prose out removes the reason to link.** The argument for a
file was that the sheet is heavy. It is 3 267 B. So this unit settles the question in the direction
ADR-0115 already pointed, rather than leaving it open, and it hands that deferral the number it never
had.

### Refused: the prose moved out of the string, as TypeScript comments between chunks

The removal would then not exist: `STYLE` would be a list of literals with the argument between the
items, nothing would be stripped at build time, and there would be no guard to write. It would also
kill a trap this file has already sprung — a backtick inside a CSS comment ends the template literal.

It is refused on readability, which the charter puts first. The comments sit **between declarations of
one block**, so a chunk boundary falls inside `:root { … }` and each literal carries unbalanced braces.
The CSS stops being readable as CSS in order that a build step may be avoided, and a maintainer adding
a rule has to decide which chunk it belongs to for ever.

### Refused: sweeping the blank line each comment leaves behind

Built and measured: **21 B in brotli**, 62 B raw, over the whole sheet. It would cost the one claim
the removal is checked by — that every run taken out is comment-delimited — in exchange for a figure
below the noise of a single word of prose. It survives as W-93, which is the cell that reddens that
claim and nothing else.

## Decision Outcome

`packages/site/served-stylesheet.ts` holds a one-pass reader that skips a comment before a string can
open, and `THE_SERVED_STYLESHEET` is `withoutComments(STYLE)`, computed once at load. `document.ts`
writes that into its `style` element and does not know the difference. `STYLE` stays exported and stays
annotated.

**A string ends at its quote or at a newline**, which is what CSS says, and is why a mistyped quote
cannot silently return the whole sheet with its comments still in.

**There is no arm for an unquoted `url()`, and that is a fact about this site rather than an
omission.** CSS reads a url token to its bracket and recognises no comment inside it, so
`url(a/*b*/c)` would be corrupted by any reader shaped like this one. It cannot arise:
`a-page-loads-nothing-and-runs-nothing` refuses `url(` anywhere in a served page. The day that guard is
relaxed, this reader needs a third arm, and the module says so where somebody will find it.

### Not a pixel moved, and it is a browser's own parser that says so

**The total check this repository does not have as a guard was taken once, by hand, as a
verification.** Both stylesheets were loaded into a `CSSStyleSheet` through `replaceSync` and their
`cssRules` walked and compared on serialised `cssText`, nested rules included: **169 rules each, zero
differing.** A browser's CSS parser reads exactly the same rules from the annotated sheet and from the
served one, which is stronger than any geometry sweep — the rendering cannot differ, rather than
having been observed not to.

**The probe was perturbed before it was believed**, because a comparison that cannot fail proves
nothing. With one declaration taken out of the middle of `:root` it reports one differing rule and
names `--the-shortest-line: 45;`; with `main.door` removed it reports 168 rules against 169 and eight
differing; restored, zero.

**It is a verification and never a guard, and the distinction is the point.** The suite has no browser
and stage rule 3 admits one only where the mechanism keeping a tool out of the product is executable.
A reading taken once says the change was sound; a guard says it stays sound, and nothing here can say
the second. Whoever is tempted to promote this into `packages/site/` is adding a headless browser as a
dev dependency, and that is a decision with its own record — not a consequence of this one.

### Three guards, and each was seen red on a condition that reddens no other

- `the-stylesheet-a-reader-receives-carries-no-comment` — the prose is gone, and the source is
  asserted to carry some, so the sweep cannot pass by having lost its population. Red with
  `THE_SERVED_STYLESHEET` bound to `STYLE`; **its two neighbours stay green.**
- `what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else` — a walk over the whole real
  sheet, anchored on the served text, requiring every divergence to begin at a comment. Red with the
  blank-line sweep above; **its two neighbours stay green.**
- `what-this-reads-as-a-comment-is-what-a-browser-reads-as-one` — four crafted rows, one per hazard.
  Red with the string arm dropped, which is the regular expression anybody reaches for first; **its
  two neighbours stay green, on the real sheet, to the byte.**

That last line is the argument for the third guard existing at all: a delimiter-only reader is correct
on today's stylesheet and wrong on the first value anybody writes a delimiter into.

**One of the four rows is live and three are not.** The sheet declares exactly one string outside its
comments — `'true'` in an attribute selector — and its comments carry **thirty-eight apostrophes**, so
a reader that looked for strings before comments would swallow this site today. The other three rows
are born green and justified by the event they would catch.

### Two forms of the second guard were written and refuted by measuring them

**A greedy *is the served sheet a subsequence of the source* walk.** Allowed to resynchronise on any
coincidental character match, it reported **322 deleted runs where the sheet has 75 comments**, because
comment prose shares characters with the CSS that follows it. A walk that finds *a* subsequence
embedding establishes nothing about the intended one. What replaced it prefers the comment over the
match, which is load-bearing in both directions: where a comment is followed by `/`, matching first
consumes the opener and reports a fault on sound work; where the served sheet legitimately carries
`/*` inside a string, both sides open one and the walk matches.

**A cross-check against the naive regular expression.** It agrees on this sheet, so it counts for
nothing today, and its red event is *somebody wrote valid CSS* — a guard whose correct response to red
is to delete the guard.

### The blind spot, published rather than left to be found

**A removal that takes one declaration out of the middle of a rule, leaves the braces balanced, and
replaces it with nothing a comment could not have covered is invisible to all three guards.** The walk
only requires a divergence to *begin* at `/*`; the crafted rows are four short inputs; and no count
over the raw source can separate a declaration from prose without reading the CSS.

The total form is a CSS parser comparing two rule lists — exactly what the browser did once, above.
Priced and refused: it is a headless browser as a dev dependency to keep a claim about one file, on a
repository whose eight suites read strings. **The verification exists and the guard does not, and this
paragraph is so that a reader knows which of the two they have.**

## The population of a guard beside this one shrank, and the loss is nil

`a-page-loads-nothing-and-runs-nothing` refuses `url(`, `@import` and an absolute address anywhere in
the served page, comments included. Taking the comments out removes 25 007 B from what it sweeps.

**It is recorded as decided rather than discovered**, because this repository has already paid for a
population that shrank while nothing said so — `every-import-a-browser-module-keeps-is-a-module-the-site-writes`
lost its edge to an `await import` and stayed green. Here the loss is nil, and the reason is what the
guard claims rather than what it matches: *this page goes and fetches nothing*, and a comment fetches
nothing. A real `url()` is CSS, it survives the removal, and it is refused exactly as before. What
would make this wrong is a served page carrying prose that is not CSS, and there is none.

## What this unit measured and did not take: the modules carry more than the stylesheet did

**The served browser modules carry 80 752 B of comments out of 137 081 — 59 %**, measured at `018a2da`
by a scan that respects strings, template literals and comments. `search.js` is 76 % comment and
`address.js` 77 %. That is **three times the raw volume this unit removed**, one door along, and it is
the same defect: this repository's prose downloaded by a reader who cannot use it.

It is not taken here, and the reason is not scope.

**A CSS comment is whitespace-equivalent and a JavaScript comment is not.** A comment spanning a line
break acts as a line terminator for automatic semicolon insertion, so removing one can change what
runs. `stripTypeScriptTypes` offers no option for it — node's API takes `mode` and a source map and
nothing else — so it would mean a JavaScript reader handling strings, template literals and regular
expression literals, whose mis-reading costs executed code rather than bytes.

**And the verification above does not transfer**, which is what settles it: `CSSStyleSheet.replaceSync`
and a rule-by-rule comparison have no JavaScript equivalent. The second half would land without the
check that makes this half defensible. What it would need is a way to establish that two modules mean
the same thing — parsing both to an AST and comparing, which is a dependency, or running the site's own
playground suite against the stripped modules, which measures four functions and not nine files.
Priced and not taken.

## What would reopen this

- **A catalogue where the pages outnumber a reader's session by enough.** The linked-file arithmetic is
  in *Considered Options* with both columns; it turns on 3 240 B per additional page against one round
  trip, and it changes if a reader starts visiting many pages or if the sheet grows again.
- **A cache policy for the addresses no endpoint names.** That entry is on the list of what this
  repository declares and nothing keeps; the day it closes, the strongest objection to a linked
  stylesheet closes with it and the trade is worth re-taking.
- **A headless browser in the suite.** It is priced in three places on that list already. The day it
  arrives, the rule-by-rule comparison above stops being a reading somebody took and becomes the guard
  that closes this record's blind spot.
- **`a-page-loads-nothing-and-runs-nothing` admitting a `url()`.** The reader would then need an arm
  for the unquoted url token, and today it has none by argument rather than by oversight.
