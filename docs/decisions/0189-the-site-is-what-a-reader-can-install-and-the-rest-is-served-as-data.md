---
status: accepted
date: 2026-09-01
governs:
  - packages/site/site.ts
  - packages/site/paths.ts
  - packages/site/front-page.ts
  - packages/site/contract-page.ts
  - packages/site/components.ts
  - packages/site/chrome.ts
confirmed-by:
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
  - battery: site
    guard: nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed
  - battery: site
    guard: nothing-of-the-instrument-reaches-this-folder
  - battery: site
    guard: the-page-a-reader-arrives-at-is-every-contract-they-can-install
---

# The site is what a reader can install, and the rest is served as data

## Context and Problem Statement

The site had grown to seventeen pages: a shelf, a catalogue, a page about method, a page about what a
contract is, a page of refusals, one page per domain, one per contract, and one for the contract the
catalogue turned down. Five of those seventeen were about the catalogue rather than about anything a
reader can install, and four more existed because a domain is a segment of an address.

The owner's ruling is that the showcase is what somebody can use. **What the repository and the origin
carry is the proof; what the site sells is what installs.** Two of the retired pages were renderings of
documents the registry already serves — `methodology` and `refusals` — so retiring the *page* costs a
reader nothing they cannot fetch, and it is the layout that goes rather than the document.

## Decision Outcome

**Three page modules: the front page, the contract page, and the 404.**

Measured at `02f7192` before and by asking the page map after: the emission wrote **17 pages** and now
writes **7** — the shelf and one per installable contract. The tree goes from **130 addresses to 110**:
ten pages and their ten Markdown twins. **The 73 answers do not move**, and neither do the seventeen
browser modules, the five files found by convention or the font.

`array/group-by@1` leaves the site entirely. It keeps its mark and its reason in `toopo search`, which
is the ruling that decides it: on a shelf a refusal is noise, in a search it is an answer. It stays in
the repository as the only unpublished contract, which is the whole population of several guards.

### The breadcrumb needed a third state, and two would have lied

`CrumbStep` had `href: string | null`, where `null` meant *the page you are on* and rendered
`aria-current="page"`. A domain is a real segment of a contract's address with nothing served at it, so
its crumb is neither a link nor the current page — and reusing the same absence would have announced
**two current pages** to a screen reader on every contract page. The three states are separate now, and
`pageless` carries a reason rather than being a bare marker, on `holdsNoContract`'s argument one folder
over: a third state that costs nothing to reach is a shorter route past the second.

### The door to the instrument closed, and the guard got stronger rather than shorter

`theSite` reached `mutation/published.ts` because the method page's upstream is something no endpoint
can serve, and the front page's figures came through the same door. Both readers went with the pages.
`nothing-of-the-instrument-reaches-this-folder-but-the-published-derivation` kept an exemption for a
door nobody opens, which is a declaration nothing keeps — so it is
`nothing-of-the-instrument-reaches-this-folder`, with no exemption at all. **The population did not
shrink; the claim grew**, and `W-53` reddens it by adding the import to `site.ts`.

## Consequences

### The closing paragraph deleted itself, eight units after it was written

The front page carried a sentence pointing at the contracts it did not list. Its own comment said why:

> **It is not on the artboard and it is here for a constraint**: no page is removed in this unit, and a
> page nothing links to is one `every-page-is-reachable-from-the-front-page` refuses.

That constraint is gone, so the paragraph is gone, and the front page is the artboard's again. **A
workaround that had written down in advance what would kill it** — and nobody had to remember: the
comment revoked itself when the condition it named stopped holding. It is the best demonstration this
repository has produced of what a comment saying *why* is worth against one saying *what*.

### A record was governing the wrong file, and deleting the right one is what found it

ADR-0117 moved the mark parser out of the method page into `marks.ts`. **ADR-0026's `governs` did not
move with it**, so for one unit that record ruled a page instead of the parser its whole subject is.
Fifteen records govern a file this unit deletes and it is the only one left with nothing, which is what
made it visible. **A guard that checks a path exists does not check it is the right path** —
`every-path-a-decision-governs-exists` was green throughout.

### Two records lose their confirmation, and one of them matters

`confirmed-by` is `[]` on ADR-0139, whose three guards were the method page's and whose subject no
longer exists, and on **ADR-0018** — *a published count carries its coordinates* — whose only guard was
`every-figure-on-the-method-page-comes-from-what-it-was-built-from`.

**Re-anchoring ADR-0018 onto a surviving guard was considered and refused.** Making something green
that has just lost its keeper is the move this repository exists to refuse, and ADR-0018's own Context
had never claimed a mechanism: it says its four instances were *found by rereading rather than by any
guard*. It keeps `governs: mutation/published.ts` — it loses its confirmation, not its object — and
what a mechanism still holds of it is written as an entry of `CLAUDE.md`'s open list rather than as a
citation that would suggest more.

### A guard got stronger because something was removed

`nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` required a refusal to be
*findable* here and never offered. Findable is now false by decision, so what is asked is the stronger
half: **not named at all**, over every page, in the markup rather than in the reading — because a link
a reader cannot see is still a link.

### What it costs

Nine guards go with their subject — two about a domain page, seven about the method page — and the site
suite is **193 → 184**. Ten battery cells go with them, and the instrument declares **836 cells and 794
caught** where it declared 846 and 804; the survivor count is unmoved at 42, because every cell removed
was a `killed` one. Two cells were re-aimed rather than deleted, because the guard each pinned survives:
`W-53` at `site.ts` and `W-65` at the contract page's summary, which is where the catalogue's prose is
parsed now.

**No digest moves, nothing under `contracts/` is touched, and `THE_PACKAGE_VERSION` stays at `1.1.0`.**

## What would reopen this

- **A page about the catalogue that a reader needs.** The ruling is that the shelf is the catalogue;
  the day somebody has to be told something about the catalogue that is not a contract, this is the
  decision that has to move.
- **A second language, or a domain with enough contracts to be worth browsing.** A domain page was
  refused here because a domain of one or two is a list a reader already has. That argument is about
  the size of this catalogue and expires with it.
- **A reader who needs the methodology as prose rather than as data.** It is served at `/methodology`
  and it is JSON. Nothing measured says a visitor wants it; the day one does, what returns is a
  rendering and not the page that was retired.

## More Information

ADR-0188 is why a page of this site may be retired at all — the 404's promise cut back to what its own
argument covers, and the deployment gate narrowed to contract addresses in the same commit. ADR-0182 is
the paragraph that deleted itself. ADR-0127 gave a turned-down contract a page and is reversed here.
