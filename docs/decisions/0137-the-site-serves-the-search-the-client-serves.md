---
status: accepted
date: 2026-08-19
governs:
  - packages/site/searching.ts
  - packages/site/chrome.ts
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: every-page-runs-the-one-module-and-serves-the-search-as-a-slot
  - battery: site
    guard: every-example-the-masthead-offers-is-answered-by-the-catalogue
  - battery: site
    guard: every-address-a-page-hands-its-search-is-one-the-tree-writes
  - battery: site
    guard: every-import-a-browser-module-keeps-is-a-module-the-site-writes
---

# The site serves the search the client serves

## Context and Problem Statement

The product's promise is that somebody describes what they need and is given the functions that come
closest. `toopo search` has done that since it was written. The site has had no search at all, and its
own port said why:

> search is a unit of its own, and at five contracts the catalogue page answers the same question
> better: a box asks somebody to guess a word for a list they could have read. **A ranking here would
> also be a second implementation of the one `packages/cli/search.ts` holds**, for five lines that fit
> on a screen.
> *until* — the catalogue stops fitting on one screen

**That deferral is lifted and its condition is not met.** Five contracts still fit on one screen. What
changed is not the size of the catalogue: it is that a promise cannot be kept by a page a reader has to
know how to read. **A deferral can be lifted by a promise rather than by a threshold, and a record has
to say which of the two did it** - otherwise the next reader takes the unmet condition for a mistake.

**The second half of that `because` is what decided the shape rather than what stood in the way.** A
ranking here *would* have been a second implementation. [ADR-0136](0136-a-rewording-answers-what-the-wording-it-rewords-answers.md)
repaired the matching rule and the module moved to `packages/registry/` on its own argument; what
follows from that is that the site does not need a search of its own, it needs a transport.

## Considered Options

- A search page, answered by the emitted tree.
- A field that runs the registry's own matching rule on the two answers it already serves.
- A field in the masthead served as HTML, made to work by a script.

## Decision Outcome

**The page fetches `contract-index` and `refusals` and runs `search` against them.** It is the same
function `toopo search` calls and the same two answers, so a reader typing on this site and a reader
typing into a terminal get one answer by construction. There is nothing to keep in step, which is the
whole of what the move bought.

**No new address.** A results page cannot be prose, and every page of this site is complete without
JavaScript; a page that was blank without it would be the one thing this site must not publish. It
would also be an address served for ever, which [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md)
makes a permanent commitment.

**What is served is a slot and never a control.** An empty element carrying two addresses, filled by
`start.ts`. The three ways of shipping a control that `chrome.ts` refused when search did not exist -
inert, disabled, or a link wearing a field's clothes - are all still refused, and none of them is what
this is: a reader without JavaScript meets a masthead with nothing extra in it.

**The addresses are handed over rather than computed in the browser.** `pathTo` stays the one statement
of where an answer lives. Reaching it from a browser module would pull `endpoints.ts` in, with
`needs.ts` and `response.ts` behind it, to read two strings - so the page resolves them against its own
depth, exactly as a contract page hands over the module its playground runs.

### What a page loads, published

Measured on the emitted tree at `62f2474`, stripped as a browser receives them, raw and in brotli:

| | raw | brotli |
| --- | --- | --- |
| every page, before a reader acts | 68 585 B | **19 789 B** |
| the two answers, on the first search | 3 601 B | 1 262 B |
| a contract page's playground, on first use | 58 661 B | 15 688 B |

**The brotli column is this machine's and the origin's is not the same number.** Read off a browser's
own resource timing against the declared origin at `c74cf6c`, after the deployment: `/contract-index`
transferred **1 145 B** and decoded to 3 025, `/refusals` transferred **377 B** and decoded to 576. So
a reader's first query costs **1 522 B on the wire** where it cost 3 601 the day before, and the
figure a host produces is what a reader pays - the column above is what a local compressor produces
and is kept as the comparison it is.

**The playground is reached through `await import` and that is what the figures are for.** Nine of the
thirteen pages carry no form, and every page runs this module now where four did - so a static import
would have put the larger half of the graph on every one of them. Measured in a browser:
`playground.js` is not among the front page's requests and is among a contract page's.

**One module of the 68 585 is fetched and never called.** `registry/search.ts` reaches `address.ts` for
`renderContract`, and `address.ts` imports `catalogue/identifier.ts` for a function the search never
runs - 9 777 B raw, 2 701 B in brotli. Splitting `address.ts` would remove it and is a decision about
the registry rather than about this unit, so the cost is published instead of paid down here.

### The examples

Three queries are offered before anybody types, and **a guard runs the catalogue's own search over each
of them**. An example that finds nothing is the defect a visitor met on the install command - found by
them, on the first thing they tried - and it is worse here, because the example is the demonstration
that describing a need finds a function. They are descriptions rather than identifiers, because
somebody who already knows `slugify` does not need a search, and each is required to reach a different
contract: three that all landed on one would show a reader the same thing three times.

## Consequences

**The bar grew and its arithmetic did not, which is the debt ADR-0135 left open arriving on schedule.**
`--the-sticky-bar` is derived from the menu's tallest row count, and the field takes width from the
menu, so the menu wraps further and pays the height back - the mechanism
[ADR-0135](0135-a-box-folds-where-the-language-allows-and-scrolls-only-where-it-does-not.md) recorded
about the wordmark, one element along. Measured in a browser before the repair: the bar at 320 went
from 106 to 128 while the sum still said 103, so **every address a page publishes landed 25px behind
it**.

The repair is the masthead wrapping and the field taking its own row where the bar is tallest, with the
field's row entering the sum. Measured after, over 5 pages × 12 widths from 280 to 2560: **0 readings
where an anchor lands behind the bar, 0 pages scrolling sideways**, and the bar at 130 / 101 / 56 where
it was 128 / 107 / 78 - shorter at every width above 360 than the state this unit started from.

**A stylesheet can be green and broken, and this unit is the demonstration.** The first version of the
repair used `var(--s1)`, which the spacing scale does not declare - it starts at `--s2`. An undeclared
variable makes the whole `calc()` invalid, so `--the-sticky-bar` resolved to **nothing at all** and the
field lost its vertical padding. **The site suite was green through all of it**, and what found it was
reading the computed value in a browser. That is `CLAUDE.md`'s open entry - *that any layout this site
declares is one somebody looked at* - paid for the seventh time.

**And a guard lost its subject to an edit made for another reason.**
`every-import-a-browser-module-keeps-is-a-module-the-site-writes` matched `from '...'`, and a dynamic
import carries no `from` - so the moment the playground moved behind `await import`, the edge it adds
was invisible to the guard that exists to close that graph. It reads both spellings now, and was seen
red on a dynamic import of a module the site does not write. **The lesson is not about regular
expressions**: an edit that changes *how* a dependency is expressed can take it out of a guard's
population without touching the guard, and nothing reports a population that has quietly shrunk.

**The catalogue page's own header is no longer the whole answer.** It says a catalogue of five needs to
be *read* rather than searched, and that remains true of a catalogue of five; what the field adds is
the reader who arrives knowing what they need and not what it is called.

**An open entry closed with this unit, and it closed here because a search is what made it cost
something.** `contentTypeOf` had declared since the read API was designed what each answer travels as,
and no deployment read it: measured against the declared origin at `501e32a`, **every answer of the
read API arrived `application/octet-stream` and none of them compressed**, while the pages, the modules
and `llms.txt` arrived `Content-Encoding: br`. A file with no extension is one a host has no opinion
about. The document a search fetches was 3 601 B where it is 1 262 B in brotli, which is what turned a
tidy declaration into a cost a reader pays.

`packages/site/served-headers.ts` carries the whole argument beside the rule that makes it, and this
paragraph is deliberately not a second copy of it: what belongs to a record is that the entry closed
and with which unit. **What no guard reaches is whether a declared type is compressed** - that is
somebody else's software, and it is settled by a request against the deployment, exactly as the host
rule beside it is.

**That request was made and the answer is yes.** Measured at `c74cf6c` against the declared origin,
on one address of each class:

| | before | after |
| --- | --- | --- |
| `/contract-index` | 3 025 B, `application/octet-stream`, no encoding | **1 145 B**, `application/json`, encoded |
| `/refusals` | 576 B | **377 B** |
| `/methodology` | 11 889 B | **3 770 B** |
| a `/snapshot/…` | 48 976 B | **12 252 B** |
| a `/blob/…` | 3 332 B | 3 332 B, `application/octet-stream`, **no encoding** |

The blob is the reading that makes the other four mean something: it is the one endpoint whose arm
says octets, it still says octets, and it is still uncompressed - so what moved is what
`contentTypeOf` says moved, and not everything at once.

## Confirmation

`every-page-runs-the-one-module-and-serves-the-search-as-a-slot` was seen red with the append removed,
on eleven pages at once. `every-address-a-page-hands-its-search-is-one-the-tree-writes` resolves the
address the way a browser does - against the folder of the page that declared it - rather than asking
whether `pathTo` agrees with itself, which is the perturbation [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)
refuses; it was seen red with the depth replaced by a constant, naming each page and the file it would
have fetched. `every-example-the-masthead-offers-is-answered-by-the-catalogue` was seen red on
`typo tolerance`, a query this catalogue genuinely cannot answer.

**What no guard here reaches is what a browser does with any of it**, and this unit was measured in one
rather than argued: the field built on all thirteen pages, the three examples offered, a rewording
answering the contract its partner answers, a bare `a` returning one result where it returned four, a
refusal naming the word no contract carries, a result's link resolving from three levels down, no
script error on any page, and in dark mode 14 pages with the worst ink-on-ground contrast at 9.99.

## What would reopen this

A catalogue where fetching the whole index before answering stops being reasonable. Both answers are
one request each and 1 262 B in brotli over five contracts; the index grows with the catalogue, and at
the size where a reader waits for it, the search stops being a function over an answer and becomes an
endpoint - which is the first thing `endpoints.ts` has ever been asked to gain for a reason other than
a consumer's need.

A second surface asking for the same thing also reopens the shape rather than the decision:
`searching.ts` holds the transport and `start.ts` holds the control, and the two are one file's worth
of separation that only matters once something else runs a query.

## More Information

- [ADR-0136](0136-a-rewording-answers-what-the-wording-it-rewords-answers.md) — the matching rule this
  serves, and why it lives where both surfaces can reach it.
- [ADR-0035](0035-what-a-search-may-answer-and-what-it-must-not.md) — what a search may answer, and the
  one rule under which it answers nothing.
- [ADR-0135](0135-a-box-folds-where-the-language-allows-and-scrolls-only-where-it-does-not.md) — the
  sticky bar's terms, and the debt this unit paid.
- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — why the masthead is what it
  is, and the control it did not carry.
