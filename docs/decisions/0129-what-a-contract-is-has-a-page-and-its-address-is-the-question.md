---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/registry/the-seven-files.ts
  - packages/site/paths.ts
confirmed-by:
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
  - battery: site
    guard: the-opening-of-a-page-says-three-different-things
---

# What a contract is has a page, and its address is the reader's question

## Context and Problem Statement

The product of this project is the contract, and the site had no page saying what one is. The redesign
draws that page with five sections. Measured against what the site already carries, before writing any
of it:

**Three of the five were one paragraph**, in an aside of the front page — a contract is frozen for the
life of its major version, an implementation freezes nothing, a contribution is an implementation or an
input and never a contract. Not similar sentences: the same ones.

**One was already elsewhere.** *Not every field is checked the same way* is the method page's *Field by
field*, composed from `FIELD_MAP` — every field of a contract record with the stratum it is verified at.

**One was new, and nothing published it.** The seven files. `THE_SEVEN_FILES` was a private list of
names in `the-catalogue.ts`, and nothing anywhere said what any of them was.

## Decision Outcome

**The page moves matter rather than adding it, and one section is genuinely new.**

The three arguments become three sections. That is [ADR-0119](0119-the-page-is-read-in-two-halves.md)'s
cut applied to the front page rather than to a contract page: three arguments stacked in one paragraph
in a box beside a list, on the surface a stranger meets first, and what they gain by moving is room
rather than words.

**The seven files are one constant, and that is what makes the page safe to write.**
`packages/registry/the-seven-files.ts` carries the name and the meaning together; `the-catalogue.ts` reads
the names off it. So the list an installation is checked against and the list this page describes are
the same value, and there is nothing to drift. Writing the meanings on the page would have put them in
two folders.

**It is the seven *files* and never seven roles.** The mock-up lists the signature, the invariants, the
settled cases, the divergences, the profiles, the harness manifest and the reference implementation —
and two of those are not files: the divergence replay lives in a contract's own suite where it exists,
and a harness manifest is the snapshot rather than anything on disk. Writing the page from roles would
describe a shape the registry does not have, on the page whose subject is that shape.

**How each field is checked is not copied.** A link goes to the method page instead, which is the
relation ADR-0119 already settled between a summary and the thing it summarises. Copying it would have
been the second unremovable duplicate proposed in two days — [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md)
is the first.

### The address says the reader's question, and it is the first one chosen since choosing became permanent

`/what-a-contract-is/`.

**The choice is paid in advance.** [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md)
made *an address this tree has served goes on being written* executable, so changing our mind about this
word costs keeping it for ever beside whatever replaces it. `/method/` and `/refused/` were chosen
before that was true; this is the first that is not.

`/contracts/` is shorter and is refused: the registry uses that word for the thing itself, so a reader
looking for *what is a contract* would land on what reads as a list of them. The one-word habit of the
two existing pages is two instances rather than a rule, and this site already addresses
`typescript/string/slugify@1` without keeping it.

### The front page keeps a sentence rather than only a link

*Never a contract* is the answer a visitor came for. Deferring a paragraph by one click is a gain;
deferring five words is friction, and cutting the clicks is what this product is judged on.

## Consequences

**The masthead offers three destinations and this one is first**, because it is the question a reader
has before *how do you verify* means anything to them.

**`CONTRIBUTING.md` is named on the page that now carries the argument.** It was named and never linked
on the front page, and the reason survives the move:
`every-page-is-reachable-from-the-front-page` compares every `href` on that page against the set of
pages, so an address outside the site cannot be written there at all — and this repository has no public
remote to write.

**The file order of `THE_SEVEN_FILES` changed and no digest moved**, which was checked rather than
assumed: the list is now in the order the page reads them and was alphabetical before, and `npm run
freeze` is green — so the order does not enter a contract's digest. Had it, this would have rebound four
published addresses.

## Confirmation

`every-contract-the-index-lists-has-a-page-at-its-own-address` names the pages that are about no
contract, and it was the only guard that noticed a fourth had appeared — which is what that clause of it
exists for and is the second time it has done that job in two units.

`the-opening-of-a-page-says-three-different-things` holds the title, the description and the first block
apart on the new page as on every other, which is what stops a page whose subject is a definition from
saying the definition three times before the reader reaches it.

**No new guard**, and that is a decision rather than an omission. Everything this unit adds is either a
page the existing set-of-pages guard already covers, or prose composed from a constant that
`the-catalogue.ts` reads back — so a defect here is either a page appearing that nothing named, which
reddens, or a sentence read by a person, which no guard on this site has ever been able to check.

## What would reopen this

An eighth file required of a contract. `contractAnatomy` measures seven at five of five and requires
seven of a sixth contract; the day that changes, one constant changes and this page follows.

## More Information

- [ADR-0119](0119-the-page-is-read-in-two-halves.md) — the cut this applies to the front page.
- [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md) — why the address is chosen
  once.
- [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md) — the duplicate
  refused two days before this one.
