---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: no-element-runs-into-the-one-beside-it
  - battery: site
    guard: a-label-and-the-sentence-under-it-are-two-lines
  - battery: site
    guard: nesting-does-not-widen-the-gap-between-two-blocks
  - battery: site
    guard: every-anchor-on-a-page-is-held-by-one-element
---

# What separates two elements in a reading, and what a title is written as

## Context and Problem Statement

`not applicableThe signature takes a single string` was on every contract page: two blocks that had
become one sentence in the text projection, with every word still present. A guard about presence is
green on it and a person cannot read it. So the projection needs a rule about what goes *between* two
elements, and the rule has to say which elements get one.

## Considered Options

- Give every element a separator, including phrasing content.
- Give block-level elements a separator, and write a title as a title.

## Decision Outcome

**A title is written as a title, and the separator table is about blocks.** Every entry of `SEPARATOR`
is a block-level element; `a` is phrasing content, and giving it one would state about a phrasing
element something false of every other phrasing element beside it. So a contract name on the front
page is `h3.call` — **the tag is the outline and the class is the look**, the rule this repository
already carries, settling both halves at once.

**Both branches of that decision were measured, and only one of them exists.** Over the seven pages
there are 211 anchors: 197 are `aria-hidden` and leave the projection entirely, and of the 14 a reader
can see, **nine are already the sole child of an element that separates and five had siblings — the
five defects.** Not one anchor on this site is written inside a sentence, so the question of what an
inline link becomes in a projection never arose. The shape came from the site rather than from taste:
the refusals page already renders this exact pair — an address and the summary under it — as a heading
and a paragraph, and 121 of the 126 list items open with `.call`. **Two renderings of one thing drift
until one lies**, and the one that lied was the front page, whose outline held its four sections and
not one contract name, on the page that *is* this site's navigation.

## Consequences

**The guard is the class, and the guard it stands beside is two of its instances.**
`a-label-and-the-sentence-under-it-are-two-lines` was written for the same failure on a contract page
and enumerates the two places somebody had already found — which is exactly why the third was found by
re-reading instead of by a red. `no-element-runs-into-the-one-beside-it` asks it of every element pair
on every page. **Both siblings must be elements, and that is measured rather than cautious**: with text
nodes admitted the predicate holds 53 pairs and 48 are ordinary inline markup, where the author writes
the spacing into the prose and is right to. It is also what keeps a link written inside a sentence
invisible to it, since its neighbours carry the spaces.

**Two more the reading found, filed here as the neighbouring class and closed by
[ADR-0008](0008-a-prose-field-rendered-as-a-paragraph-is-a-sentence.md).**
`identity.relationToTheLanguage` published as a bare fragment, and `DETERMINISM_ORDERING_FINDING`
composed after a full stop on five contracts. **What that filing got wrong is worth keeping**: it said
the backticks a contract page publishes in its own prose *close with them*, and they did not. They are
a decision about the register of the catalogue's own text, where these two were a decision about where
a value may be printed — one predicate settles the second and nothing mechanical settles the first. A
prediction that two things close together is a claim like any other, and this one was made without
measuring either.

## Confirmation

`no-element-runs-into-the-one-beside-it` is the class over every element pair of every page;
`a-label-and-the-sentence-under-it-are-two-lines` is two of its instances, kept because it names the
shape a reader met rather than the predicate. `every-anchor-on-a-page-is-held-by-one-element` is what
makes the anchor census above a property rather than a reading, and
`nesting-does-not-widen-the-gap-between-two-blocks` holds the half a separator table invites: a rule
per element that composes into a growing gap as blocks nest.

## What would reopen this

A link written inside a sentence. The decision rests on a census in which none exists, and the
predicate is deliberately blind to one — its neighbours carry the spaces. The day a page wants an
inline link, what has to be decided is what a projection puts around it, and the census is what would
have to be taken again.

## More Information

- [ADR-0024](0024-a-page-is-a-value-with-two-projections.md) — the projection this rule is about.
- [ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) — the neighbouring rule about what a
  carried sentence's own marks become.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
