---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: every-word-of-every-page-survives-both-projections
  - battery: site
    guard: the-text-projection-keeps-the-words-and-drops-the-markup
  - battery: site
    guard: chrome-marked-as-hidden-is-in-the-html-and-not-in-the-reading
  - battery: site
    guard: a-visible-character-is-printed-as-itself
  - battery: site
    guard: an-invisible-character-is-written-as-its-code-point
---

# A page is a value, and `toHtml` and `toText` are two projections of it

## Context and Problem Statement

A generator has to be steered by something. The question a page has to answer is not *does it contain
the right fields* — a typechecker settles that — but *what does a stranger understand in ten seconds*,
and no static check reaches it.

## Considered Options

- Concatenate HTML, and read the output back with a parser to check it.
- Build a page as a value, and project it two ways.

## Decision Outcome

**A page is a value, and `toHtml` and `toText` are two projections of it.** Everything about the site
was decided by rendering a page in document order, stripped of markup, and reading it as a stranger —
which is at once what a search engine indexes, what a screen reader announces, and the closest thing
there is to *what somebody understands in ten seconds*. A generator that concatenated HTML could only
be measured by parsing its own output back, and a bug in the reader would read as a bug in the page.

So the reading stops being something somebody remembers to do and becomes something a guard holds. The
mutant it exists for is a text projection that quietly drops what the HTML shows: it produces a
*shorter and tidier* reading, which is exactly what somebody skimming a measurement hopes to see. It
is the only defect in that folder that could blind the instrument the unit was steered by, and two
guards catch it.

### What the reading found

**What the reading found that no static check could.** Three defects, all invisible to a typechecker
and to every guard about presence. The first screen said the same sentence three times — title, meta
description and lede all carried the summary. The anchor beside a case was read aloud as a `#` that
means nothing, which `aria-hidden` now settles: the declaration that a screen reader skips an element
*is* the declaration that the text projection drops it, so the two answer to one statement rather than
to a rule about class names. And every universal property of every contract came out as
`not applicableThe signature takes a single string` — two blocks that had become one sentence, with
every word still present, so a projection guard was green and a person could not read it.

That last one is what [ADR-0025](0025-what-separates-two-elements-in-a-reading.md) is about, and it
was found here, by reading.

### What is escaped

**Nothing is escaped that a reader can see, and everything else is.** Measured over the five: 36 of
438 string values carry a character that is invisible on its own or renders on top of its neighbour.
`number/parse@1`'s own source says why it matters — a no-break space and an ordinary one are the same
glyphs on screen and carry opposite answers in that table — so a page printing both as they are would
publish two cases a reader cannot tell apart, one saying the input parses and the other that it does
not. Cyrillic, Arabic, emoji, `é` and `€` are printed as themselves, because they are visible and
because `string/slugify@1`'s table is about them.

## Consequences

Every question about this site is asked of a value rather than of a string of markup, which is what
makes the guards below possible at all: *does an element run into the one beside it*, *is every word in
both projections*, *is a mark printed as itself* are all predicates over a tree.

The rule that no node holds raw markup follows from the same shape, and it survives a `script` on the
page because a script node carries attributes and no children.

## Confirmation

`every-word-of-every-page-survives-both-projections` and
`the-text-projection-keeps-the-words-and-drops-the-markup` are the pair written against the mutant
above: one requires nothing to be lost, the other requires the markup to be gone.
`chrome-marked-as-hidden-is-in-the-html-and-not-in-the-reading` holds the `aria-hidden` half.
`a-visible-character-is-printed-as-itself` and `an-invisible-character-is-written-as-its-code-point`
hold the escaping rule in both directions, which is the only form in which it can be kept: a guard over
one direction alone is satisfied by escaping everything or by escaping nothing.

## What would reopen this

A page that has to carry something the value cannot express — an embedded document, a third-party
widget. Every one of them would arrive as raw markup, which is the one thing this shape refuses, so the
decision to reopen would be taken at the moment such a thing is wanted rather than discovered when it
does not fit.

## More Information

- [ADR-0025](0025-what-separates-two-elements-in-a-reading.md) — what a projection puts between two
  elements.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
