---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/methodology-page.ts
  - mutation/published.ts
confirmed-by:
  - battery: site
    guard: every-figure-on-the-method-page-comes-from-what-it-was-built-from
  - battery: site
    guard: what-the-score-does-not-prove-is-read-before-the-score
  - battery: site
    guard: a-count-of-survivors-is-never-shown-without-its-breakdown
  - battery: site
    guard: the-page-separates-what-is-asserted-from-what-a-run-would-observe
  - battery: site
    guard: every-surviving-cell-is-published-with-its-own-battery-sentence
  - battery: site
    guard: nothing-of-the-instrument-reaches-this-folder-but-the-published-derivation
  - battery: site
    guard: every-deferred-need-names-what-would-close-it
---

# What the method page may say

## Context and Problem Statement

The method page is the one page that argues the thesis rather than demonstrating it, and it is the page
where a project like this one destroys itself: a figure written into a sentence, a score published
without its limit, a count of survivors that reads as a count of holes.

## Considered Options

- Write the figures into the prose and check them by reading.
- Compute every figure at build time from the data the page is built from.

## Decision Outcome

**No figure on that page is written into a sentence.** Every one is computed at build time from the
two answers the page is built from, and a guard collects every run of digits a reader can see and
requires each to occur in that data. What it catches is not a wrong number but a *right* number that
goes wrong later — the failure `CLAUDE.md` has caught in its own prose four times and never once in
executable code. Its limit is declared rather than discovered: **a literal equal to today's value
passes today**, and goes red the day the data moves, which is the day it would otherwise start lying.

**And the set it matches against must hold figures and nothing else, which is the half that was wrong
and which W-47 found.** `THE_REPLAY.measuredAt` was stamped `0d8e41d`, whose digit runs are `0`, `8`
and **`41`** — and `41` occurs nowhere else in that data, so the commit stamp handed the pool a figure
nothing had derived, and the mutant that writes the literal `41` into a derived sentence stopped being
killed the moment the stamp landed. The guard went **quiet rather than red**, because the data moved
*towards* a stale literal instead of away from it, and that is the one direction its declared limit
does not cover. A commit identifier is an address, so it now comes off both sides — off the reading as
well, since the page renders it. What that repair does not have is a mechanism: it names the one
address this data carries, and a second would have to be named beside it.

**The rule that closes it for every future guard over published figures: an address is not a figure,
and it leaves the data by both sides or by neither.** That is what made the stamp silent rather than
red. A rendered address leaks into the comparison from both directions at once — it joins the pool as
though something had derived it, and it joins the reading as though the page had published it — and
either leak alone would be caught, since a figure with no derivation reddens and a derivation nothing
renders is unread. **It is the pair that is silent, because the two leaks cancel.** So every address
comes off both sides before anything is compared, and **it is the rendering that decides which strings
are addresses, never their shape**: a run of digits is not evidence of a figure. The frozen
identifiers this repository spends its length on — a case, a guard, a reason literal, a profile name — are
the population this rule is written against, and a commit stamp is only the first of them to be
rendered on a page.

### An assertion and an observation

**An assertion and an observation are not one object, and the page says which it is showing.** Every
figure is read off pins in committed code; `measure.ts` exits non-zero on any cell that disagrees, so a
replay agrees with them or fails. The two therefore coincide — and a reader who has run nothing holds
what this repository *asserts*, while a reader who runs `npm run mutation` holds what happened on their
machine. The page publishes the command and what it costs beside the figures, because a page that
presents pins as observations is doing the thing it spends its length arguing against.

**The limit of the method is the second section, never a footnote.** *A high score does not say the
code is correct; it says the tests notice the defects that were tried.* A guard holds the **order** and
not the presence, because that sentence is worth nothing after the number: a reader who meets the
figure first has already read it as a claim about correctness. What makes the admission affordable is
the corollary almost nobody else can offer — the defects that were tried are committed files, each with
the exact edit it makes and the verdict it must produce.

### A survivor declares its kind

**A survivor declares its kind, and the aggregate is never available without the split.** A count of
surviving cells published alone reads as a count of holes. Measured at `a381860` over the nineteen
batteries: **36 surviving defect cells — 12 equivalent, 7 outside what the contract specifies, 4
unreachable on this catalogue, 1 a declared open class, and 12 that live only where a lens blinded the
suite.** Exactly one is a debt. `survived` is a function requiring a `SurvivalNature`, so a survivor
whose kind nobody stated does not compile; the twelfth kind is not declarable, because a cell blinded
by its lens is a fact about the apparatus and `survivorFaults` establishes it structurally. Neither
`published.ts` nor the page exports or renders the total alone.

**Six survivors of `number/parse@1` carried no argument at all**, which is exactly what made them the
ones a hostile reader counts as holes. Each is now argued and measured differentially over a corpus of
300 067 inputs, seen once cold and once with a foreign call between, against a control that disagrees
on `1e400`. **P-16 is the one that is not an equivalence**: every answer is the reference's and it
leaves a counter on `globalThis`, so what the contract constrains — what the function *reads* — is
untouched and what it writes was never specified. That is the edge of the contract rather than a defect
the guards missed, and the two natures exist to keep them apart.

## Consequences

**The page's second upstream is a declared door, not a reach.** `packages/registry/verifiability.ts` says the
instrument measures the catalogue and is not part of it, so no endpoint can carry how this catalogue's
own tests are measured. `mutation/published.ts` is the one module `site/` may import out of `mutation/`,
and a guard holds the folder to it — the shape the serialisation frontier already has, on a second
upstream.

**A deferral carries what would close it, in a field.** `DeferredNeed.until` is required, so an entry
without a trigger does not compile. The argument for it is the entry that has just left the list:
`render-the-methodology-page` said it was waiting for benchmark figures, validation reports and
attestations, and what it was actually waiting for was somebody noticing that eighteen batteries were
already sitting in another folder. **A deferral aimed at the wrong event is one nobody revisits**, and a
reason ages into a description of the past where a trigger stays checkable.

## Confirmation

**Two guards of this unit could not fail as first written, and both were caught by measurement rather
than by review.** The partition guard over published survivors asserted `killed + surviving === cells`,
an identity every mis-classification preserves — counting only `killed` as a kill files the five
`killed-by-typecheck` cells as survivors, the sum stays right, and the page publishes thirty-nine
survivors with the guard green. It is now a second walk over the batteries. And W-52 emptied one line of
a three-line trigger and survived, correctly, because two lines of trigger were left; the battery
reported it, which is what a pinned verdict is for.

## What would reopen this

A second address rendered on this page. The repair to the figure guard names the one address the data
carries, and a second would have to be named beside it — which is a mechanism this record prices and
does not build.

## More Information

- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — the same discipline on prose that no
  guard computes.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
