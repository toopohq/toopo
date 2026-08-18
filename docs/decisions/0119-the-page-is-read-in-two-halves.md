---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/contract-page.ts
confirmed-by:
  - battery: site
    guard: the-rail-of-a-page-names-every-section-of-it-and-only-those
---

# The page is read in two halves

## Context and Problem Statement

[ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) settled the shape of a
contract page: a card, and then everything, with nothing behind a fold. It is right about the fold and
it left a page a reader cannot navigate. The criticism was *too big, too long, slow to understand* —
and the measurement says where all of it is.

Measured at `f05951f` on `string/slugify@1`, over the text projection, words being runs of
non-whitespace:

| words | section |
| ---: | --- |
| 191 | What it does |
| 97 | What it is for, and what it is not |
| 10 | Signature |
| **2 482** | **41 settled cases** |
| 131 | Try it on your own input |
| 344 | Properties |
| 312 | Benchmark profiles |
| 61 | What you can check yourself |
| 3 628 | under a heading; 172 outside, in the title, masthead, rail and card |

**Two thirds of everything under a heading is one section.** A reader who says the page is long is
reading the settled cases, and eight `h2`s of equal weight give them no way to know that. The problem
was never the length.

## Considered Options

- Shorten the prose.
- Fold the settled cases by group, opening on demand.
- Cut the page in two halves at one line, and fold nothing.

## Decision Outcome

**Two halves, at one line, with nothing folded.**

Everything above the line answers *is this the function I want*: what it does, a form to try it, and
the jobs it is written for. Everything below is *what it is bound to do, in full*: the signature, the
settled cases, the properties, the profiles, and what a reader can check without us. The length does
not go down — measured after, the page is **4 176 words** — but a reader now knows which part they are
in and what they may skip.

Shortening the prose is refused because there is nothing to shorten: the 2 482 words are 41 named
cases and their arguments, and a case removed is a decision the catalogue stops publishing.

**Folding is refused, and the mock-up this cut came from proposed it.** Its Reference lede read *it
opens by group and every group states its size before you open it.* ADR-0116 settled that on a
differential trial and the reason has not changed: a case behind a fold is a case a reader cannot find
with their browser's own search, on a page whose entire argument is that every case is there. The line
is written down here so that it does not arrive again through a later mock-up.

### Signature moves below the line rather than disappearing

The mock-up shows no Signature section at all, and it is drawn on `string/slugify@1` — a total
contract with one export, whose whole signature is the one line the card already carries. On
`number/parse@1` that section carries a second export, the supporting types, the frozen set of failure
reasons and the coupling rule. So it moves under Reference, which is where the mock-up's own sentence
puts it: a signature with a frozen failure-reason set is exactly *what it is bound to do, in full*.

### What it is for merges upward

*What it is for, and what it is not* becomes an `h3` under *What it does*. The two answer one
question and a reader deciding whether to install reads them together. **It keeps its own address**, so
every link written to `#what-it-is-for` still resolves; what it loses is a line in the rail, and a rail
entry is not an address.

### The divider is a section like any other

`Reference` is an `h2` carrying an id, listed in the rail, indistinguishable to every existing guard
from the sections around it. The reference entries are marked in the rail with a class rather than
nested in a second list: those sections are `h2`s *beside* the divider and not under it, so a nested
list would claim a nesting the document does not have — [ADR-0025](0025-what-separates-two-elements-in-a-reading.md),
the tag is the outline and the class is the look.

## Consequences

Measured after, same method and same projection:

| words | section |
| ---: | --- |
| 297 | What it does |
| 131 | Try it on your own input |
| 326 | In practice |
| 53 | Reference |
| 10 | Signature |
| 2 482 | 41 settled cases |
| 344 | Properties |
| 312 | Benchmark profiles |
| 61 | What you can check yourself |

**754 words before the line and 3 262 after it.** The page grew by 376 words, all of them in the half
a reader is being invited to read; the half they may skip is unchanged to the word.

**The other three pages grew by 46 words each** — 3 305 → 3 351, 3 962 → 4 008, 2 697 → 2 743 — which
is the divider and its sentence, and nothing else. The cut is structure and applies to all four; the
use cases are content and are on one contract by design.

**The method page grew by four words**, and the cause was found rather than assumed: it publishes every
field of a contract record with the stratum it is verified at, read from `FIELD_MAP`, and
[ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) added four paths. The
derivation working is what that figure is.

## Confirmation

`the-rail-of-a-page-names-every-section-of-it-and-only-those` is the guard, and it did not need
changing: it walks the rail's links and the page's addressed `h2`s and requires the two lists to be
equal *in order*. The divider is in both, in the same place, because it is derived from the shape both
are derived from.

**That is what the guard was written for and it is why the cut cost so little.** A page carrying its
table of contents as a second, hand-written list would have needed both halves edited here, and the
rail is the half that does not move — the class this repository spends its length removing.

## What would reopen this

A contract whose Reference half is short. The whole argument is that one section is two thirds of the
page; on a contract with eight cases the divider would separate a long half from a short one and be
noise. Nothing in the catalogue is close — the smallest is `string/levenshtein@1` at 2 743 words — and
the day a contract lands under a thousand, the cut is worth measuring again rather than kept out of
consistency.

## More Information

- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — the shape this refines, and
  the record whose no-fold decision this one is bound by.
- [ADR-0115](0115-six-sizes-one-unit-and-an-accent-that-never-says-a-status.md) — the visual system the
  divider and the cards are built in.
- [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) — where the new section's
  content lives.
