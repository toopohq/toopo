---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/site/front-page.ts
  - packages/site/catalogue-page.ts
  - packages/site/paths.ts
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: the-page-a-reader-arrives-at-is-a-name-and-two-doors
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
---

# The page a reader arrives at is a door, and the catalogue took an address of its own

## Context and Problem Statement

The front page was the catalogue. It carried the name, a lede, the list of every contract, an aside of
secondary matter, and — above all of it — the shape of every command at once:
`npx toopo add domain/function`.

**It was rejected twice, in the owner's own words, and the second rejection is the one that decided
this.** The first: *je pense qu'elle pourrait être revue de zéro car ce n'est vraiment pas joli. De
plus, le `npx toopo add domain/function`, je trouve ça moche.* A search-first page was built to
replace it and was rejected harder: *je déteste. C'est encore pire qu'avant.* A page whose principal
act is a field to fill asks for effort before it gives anything.

What he asked for third, and what is built: **un élément statique qui met juste le nom et un bouton
pour voir la liste et un autre pour voir la doc.**

**The generic command was not a slip.** It was there for a real constraint: no contract may be
privileged on the page that stands for all of them. The constraint is right and the form was a
template, which is a thing a reader sees. The resolution is that a command belongs to a *contract*, so
it belongs on every contract's page and on none of the pages that are about the catalogue.

## Considered Options

### Refused: a page that opens on a search field

Built and thrown away rather than argued over. It puts the burden on the visitor before they know what
they are looking for, and it makes the catalogue's own worst case — a query that finds nothing — the
first thing a stranger meets.

### Refused: the second door leads to a page marked *under construction*

Proposed for the documentation door. **Nothing new is created here in order to stand empty.** The door
leads to `/what-a-contract-is/`, which exists, is written, is served, and answers the question
somebody clicking a door called *documentation* is actually asking: what is the thing this catalogue
publishes, and what does it guarantee.

### Refused: `/contracts/` for the catalogue's new address

It has a real argument behind it and
[ADR-0129](0129-what-a-contract-is-has-a-page-and-its-address-is-the-question.md) is where it was
first refused — *a reader looking for what a contract is would land on what reads as a list of them.*
This **is** a list of them, so that refusal points here rather than away.

What decides against it is one floor up: this project already has a word for this thing and uses it
everywhere — `catalogue.ts`, `catalogue-page.ts`, the link every page carries back, every record. A
second spelling of one thing is drift that waits to diverge.

## Decision Outcome

**`/` holds the name, one line, and two doors. The catalogue is at `/catalogue/`.**

The page is three blocks and nothing else. No command, no list, no aside. The line behind the
catalogue door is **composed and never written** — the contracts, the domains they are filed under and
how many were turned down are read off the index, so a sixth contract lands in that sentence with
nobody editing it, which is the treatment
[ADR-0121](0121-a-domain-has-a-page-and-every-page-says-where-you-are.md) already gave a domain page's
opening.

**Every address this tree has served goes on being served.** `/` is written, served and listed exactly
as before; it changes role and not existence, which is what
[ADR-0125](0125-an-address-the-emitted-tree-has-served-goes-on-being-written.md) requires of it.
`/catalogue/` is new, so it is free. The packaging suite is green on all eight of the guards that
record it.

### What this page does not say, and it is a cost rather than an oversight

Nothing on it is about how this catalogue is verified, which is what the whole project rests on. It is
one link away, in the masthead of this and every other page. That was raised and arbitrated: the door
stays three blocks. It is written here so the next reader meets the cost rather than discovering it.

### The move broke every link on the catalogue and one guard is why we know

The catalogue's six links were `linkTo(page)` — correct at the root, broken one folder down. They
climb now, through one local `upTo`, for the reason `rootFrom` exists: a depth is a consequence of an
address, and six repetitions of the climb would be six places to correct.

**Nothing about that was found by reading.** The reachability guard was `the front page links every
other page` — one hop, which is right for a flat site and false of a door. Rewriting it as a walk over
the page graph reddened it immediately on ten pages, which is the whole catalogue and everything below
it.

**The walk keeps a claim the one-hop form kept by accident.** Comparing the front page's hrefs against
the list of pages refused an address that left the site, because such an address was in the first list
and not in the second. A walk that skipped what it could not resolve would have dropped that silently,
so it is now stated in its own right: every href of every page, and not only of the one being walked
from, resolves to a page of this site.

Both halves were seen red before they were believed — a page registered with nothing pointing at it,
and `https://example.com/method` written onto the catalogue.

## A latent defect of the stylesheet, and this is the first page short enough to show it

`body` is a grid, and a grid with vertical free space stretches its auto rows into it. On any page
shorter than the window the masthead therefore grows: measured at 1440 before the repair, the bar is
**247px instead of 56**, and it grows with the screen, because a wider screen makes a shorter page.

**Nothing had seen it because nothing could.** Every page of this site had been taller than the
window at every width anybody looked at, so the free space the rule needs had never existed. It was
found by looking at the door in a browser — the class
[CLAUDE.md](../../CLAUDE.md) records as having been paid for six times, arriving a seventh.

`align-content: start` on `body` is the whole repair, and it is a no-op wherever there is no free
space, which is every other page.

**What would see it again is a browser and nothing else.** The two guards that read this stylesheet
read its *text* and ask whether a length is derived; a rule that is derived and wrong satisfies both.
The debt is on the list in `CLAUDE.md`, priced there at a headless browser as a dev dependency, and
this unit does not pay it.

## A guard's regular expression was silently narrowed, and a mutant is what said so

The guard written for this door refused a command on the front page and stayed **green with
`npx toopo add string/slugify` printed on it**. The cause: `\b` edited into a source through a shell
heredoc lands in the file as a literal backspace character, `0x08`. The file compiles, the guard
collects, it runs green for ever, and it refuses less than it says.

Swept over the tracked tree: **three, in one file, two of them committed** — the third being this
unit's own. The two committed ones are in
`every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown`, whose
`/\bof\b|\//` had been refusing a slash and nothing else for the whole of its life. Repaired, and seen
red with ` of ` put into a figure's rendering. Three `0x00` remain in the tree, in `mutation/history.ts`
and `packages/registry/round-trip.test.ts`; those are deliberate separators whose behaviour is exactly
what `'\0'` means, and they are named rather than changed.

**What found it was the mutant and not the sweep.** Nothing here reads a source for a control
character, and a guard whose text has been quietly narrowed does not look narrowed — it looks like a
guard. The sweep exists now because a perturbation failed to redden something.

## What would reopen this

A catalogue large enough that a reader needs to be given a way to search before they are given a way
to browse. The doors are the answer while a stranger can be told what is here in one line; the
sentence behind the catalogue door composes itself from the index, so the day that line stops being
readable is the day this is worth taking again.

The masthead carries one destination and the front page two. A third door is the fourth version of
this page, and the owner said he would not look at one.
