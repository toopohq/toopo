---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/marks.ts
confirmed-by:
  - battery: site
    guard: no-mark-a-sentence-carries-reaches-the-reader-as-itself
---

# A mark a carried sentence holds is parsed once, by one function

## Context and Problem Statement

The method page prints sentences written in `mutation/`, and those sentences are written for a reader
of source: they carry `**this**` and `` `that` ``. Printed as they are, a reader of the page sees the
asterisks — on the page whose whole subject is rigour.

## Considered Options

- Strip the marks where each page needs them stripped.
- Parse them once, in one function, and have every call site reach it.

## Decision Outcome

**A rule that is declared, implemented and reached by hand is the shape every failure of it takes.**
`methodology-page.ts` says the sentences from `mutation/` carry `**this**` and `` `that` ``, and that
printed as they are *a reader of the page sees the asterisks*. `inline` parses them and two call sites
reached for `line` instead, so the page whose whole subject is rigour published its own markup.
`no-mark-a-sentence-carries-reaches-the-reader-as-itself` is what was missing, and it is asked of that
page alone: a contract page publishes contract prose that writes `` `Intl` `` for a reader, which is a
separate question about the register of the catalogue's own text.

**And three guards over one page were undoing those marks three ways**, which is what looking for that
cell turned up: one stripped them by hand with `.replaceAll`, one compared the literal, and this unit
added a third spelling while arguing in its own commit message against the first. `asRead` is one
function now. **A copy of a parser is not a second opinion, it is the same statement written where
nobody will maintain it.**

## Consequences

**Where a guard's cell goes is decided by where the guard is alone, not by where the defect happened.**
Every other sentence the method page takes from `mutation/` is also required by name somewhere, so the
same edit there reddens two guards and shows neither to be needed. At the silences it is the only red
in the folder — and it is the more robust anchor besides, since `THE_REPLAY.spread` carries one
asterisk pair where the page renders 64 silence reasons of which 48 carry a mark.

The rule is asked of the method page and of no other, which is a scope and not an oversight: what a
contract's own prose does with a backtick is a question about the register of the catalogue's text, and
nothing mechanical settles it.

## Confirmation

`no-mark-a-sentence-carries-reaches-the-reader-as-itself` in `packages/site/pages.test.ts` reads the
method page and requires that no sentence it takes from `mutation/` arrives carrying its own markup.
Its cell is at the silences, where it is the only red in the folder — a guard that is never alone on
anything is one nothing establishes, which is the criterion this repository applies to a guard it was
about to delete.

## What would reopen this

A second page taking prose written for a reader of source. The rule would then be about two pages, and
the question of where its cell goes would be asked again, because the argument above is that the
silences are where this guard is alone.

## More Information

- [ADR-0025](0025-what-separates-two-elements-in-a-reading.md) — the neighbouring rule, about the seam
  between two elements rather than the marks inside one string.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
