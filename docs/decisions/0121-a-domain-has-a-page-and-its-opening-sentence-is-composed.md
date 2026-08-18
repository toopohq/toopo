---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/domain-page.ts
  - packages/site/catalogue.ts
  - packages/site/chrome.ts
confirmed-by:
  - battery: site
    guard: every-installable-contract-has-a-page-and-a-refused-one-does-not
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
---

# A domain has a page, and its opening sentence is composed

## Context and Problem Statement

The site had two kinds of page. A contract sits at `/typescript/string/slugify@1/`, the catalogue at
`/`, and **the level between them was a 404**. That level is not decoration: it is where a reader who
arrived at one contract from a search goes to find out what else is near it, and it is the only unit a
navigation can be built on that survives the catalogue growing.

Beside it, the column that names where you are had been left out of
[ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) for want of a domain page to
point at.

## Considered Options

For the page's opening line:

- A hand-written sentence per domain, as the mock-up draws it.
- No prose: the four figures as a row, and the contract list under them.
- A sentence composed from what the registry answers.

## Decision Outcome

**A domain page for every domain with something published in it, and an opening sentence composed from
the registry.**

`string` reads: *2 contracts here, and 64 settled edge cases between them. Taking all of them puts
5 748 bytes of TypeScript in your project, and it imports nothing.*

### Why the sentence is composed and not written

The mock-up carries *four contracts over text held in memory, every one of them counting in Unicode
code points*, and marks it as a placeholder. Written for real it would be a **fifth** statement of what
is in a domain, beside the list under it, the served index, the sitemap and each contract's own
summary. Nothing keeps it true, and it is the one a reader believes, because it is at the top of the
page and the list is below the fold.

[ADR-0043](0043-derive-the-sentence-from-the-fact.md) is the rule, arriving on prose rather than on a
report: **a sentence that cannot be false is worth more than a sentence somebody checked.** The
consequence is the point — a fifth contract lands in that sentence with nobody editing it.

**The row of figures is refused for the opposite reason.** Its four numbers are the four in the
sentence, so a page carrying both states one measurement twice. A sentence is what a reader who is not
scanning can use, and it is what survives `toText` and `toMarkdown` as something other than four
numbers in a row.

### Three domain pages and not four

`array` holds one entry, `array/group-by@1`, refused before publication. A page for it would carry an
empty list, a figure of zero and a line pointing at the refusals page — which answers nothing that page
answers less well, and puts an address in the navigation a reader gains nothing by following.

So `domainsOf` drops a domain with nothing published in it, and
`every-installable-contract-has-a-page-and-a-refused-one-does-not` asserts the domain side from the
**installable** entries rather than from the index's domains, so the two differing is a red.

### The column is a sibling of the rail, and it is placed rather than ordered

`the-rail-of-a-page-names-every-section-of-it-and-only-those` walks everything inside `.rail` and
requires each link to be a section of the page. These links go to other pages. Putting them inside
would have meant widening that guard to ignore what somebody wanted to add, which is a guard being
narrowed to fit — so they are a second element in the same column, and the rail means what it meant.

**The column follows `main` in the document and sits to the left of it above 64rem**, by grid
placement and never by `order`. A reader at 390 was meeting sixteen lines of navigation before a word
of the page. Placement keeps the document order — which is what a screen reader announces and what
`toText` reads — agreeing with what a sighted reader gets, and `order` is exactly what would have
broken that.

### No count beside a domain in the column

The mock-up draws `array 97 · date 156 · util 136`, from a catalogue of a thousand that does not exist.
The system is a magnitude beside a name; the data is fiction. Applied to what is really published every
line reads `1`, `1`, `2` — which makes the catalogue look empty in the navigation of every page.

A bare digit is also the one thing here that does not survive a projection: `string` and `2` come out
of `toText` as `string 2`, with nothing saying what the 2 counts. So the figure is in the label of the
domain you are standing in, where there is room for the word, and the list is names.

### Two casts written and removed

`Domain.held` is `readonly [Held, ...Held[]]`. A domain page is addressed by going up one level from a
contract of it, so *this list has a first element* is what makes that address exist at all; as
`readonly Held[]` every caller has to assert what the filter already established. And a contract page
takes its domain as a parameter rather than searching for it, because `site.ts` builds those pages by
walking the domains — so the contract being in the domain it renders under is the loop and not a claim.

`Domain.refused` was written and deleted in the same change. No domain with a page has a refusal, so
the section that would render one is a branch nothing exercises, on the surface where an unexercised
branch is a section a reader may one day meet in a state nobody has seen.

## Consequences

**Ten pages where there were seven**, and the front page links to all nine others, which is what
`every-page-is-reachable-from-the-front-page` requires and what the domain chips there are for.

**Four defects came out of a browser and out of no static check**, which is this repository paying for
that class a third time: two rules 13px apart where a list item and the heading inside it each drew
one, and four heading gaps of 0, 8 and 16 where the system declares one. All four were a `margin`
shorthand on a class silently outranking `h2 + p` on specificity. Measured after: 100 section headings
at 12px and nothing touching.

## What would reopen this

A second language. `domainPageOf` derives its address by going up one level from a contract page, which
is right while a contract address is `language/domain/name@major`; a language that renders differently
moves both.

And a domain large enough that its page is a wall. The list here is every contract of the domain with
its summary, which is readable at four and is the shape this record refuses for the *catalogue* at a
thousand. The day a domain has fifty, this page needs what the front page needed — and the sentence at
the top of it does not, because it is composed.
