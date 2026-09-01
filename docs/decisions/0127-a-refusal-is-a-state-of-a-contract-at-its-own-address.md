---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/site/site.ts
confirmed-by:
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
  - battery: site
    guard: nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed
  - battery: site
    guard: what-runs-in-your-browser-is-said-once-and-beside-the-playground
  - battery: site
    guard: the-opening-of-a-page-says-three-different-things
---

# A refusal is a state of a contract, at its own address

## Context and Problem Statement

The redesign moves a refusal off a page of its own and makes it the state of a contract, explained where
that contract lives and listed in the family above it. [ADR-0126](0126-a-domain-carries-what-it-turned-down.md)
took the family half. This is the rest, and it reverses the decision this site was built on:

> **A refused contract has no page.** `array/group-by@1` was decided against *before* publication, so
> `refuseContract` records an argument and binds no digest: there is no frozen definition, no snapshot,
> nothing a reader could check. A contract page with no digest behind it would be missing the only half
> that makes this registry worth anything.
>
> — [ADR-0027](0027-what-a-contract-page-publishes-and-what-it-leaves-out.md)

## Decision Outcome

**A contract the catalogue turned down has a page, at `pageOf` and never at a second spelling.** A
refusal is a *state* of a contract rather than a different kind of thing, so somebody who searches for
`group-by` lands where they would have landed had it been published, and is told what happened.

**ADR-0027's argument is answered rather than outgrown, and the difference is what the page is.** Its
objection is to a *contract page* with a hole where the digest goes — a document shaped like the four
others, inviting the same trust, missing the half that earns it. What is published instead is a page
about a **decision**: what it was turned down for, on what measurement, what it is kept as, and one
section named *What this page does not show* saying that the contract as written is absent, that nothing
here can be hashed and compared, and that every other page of this shape carries a digest.

That is ADR-0027's own rule about an empty section, applied to the page ADR-0027 refused: *a section
with no data is not rendered, and what is missing is said in a sentence where a reader would have looked
for it.*

**`/refused/` keeps its address and becomes the index.** One line per refusal, linking to the contract.
The measurement is not on it, for the reason ADR-0126 gives about the family mention: a measurement
quoted in a list is one without the comparison that gives it force. It is the relation a domain page
already has to a contract page, applied to refusals — and the address is kept because
[ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md) is what this whole unit was
opened by. **An address this tree has served goes on being written; what it says is free to change.**

**The catalogue's own list stops branching.** `catalogue-page.ts` sent a non-installable entry to
`/refused/` and now sends every entry to `pageOf(entry.address)`. One expression where there were two,
and the branch that survives is the one about the install command, which is a different question.

## Consequences

**The guard ADR-0027 was confirmed by had to be renamed**, and that is the cost this unit paid
knowingly. `every-installable-contract-has-a-page-and-a-refused-one-does-not` would have gone on
asserting the opposite of what the file does, which is the one thing a guard's address must never do. It
is `every-contract-the-index-lists-has-a-page-at-its-own-address`, and the `confirmed-by` of ADR-0027
and ADR-0121 moved with it. **ADR-0126 checked one unit ago that the name was still true and left it**;
that reading was right on its day and is recorded there beside what overturned it.

**What ADR-0027 keeps is held by a guard that was already there.**
`nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` was written for the
catalogue's list long before this page existed, and it arrived at the new page already holding the one
thing that page must never do. Nothing about it was widened.

**One guard changed what it classifies on, and it is a strengthening rather than an exemption.**
`what-runs-in-your-browser-is-said-once-and-beside-the-playground` asserted the sentence about stripped
types beside a playground for every path that is a contract's, and required its *absence* everywhere
else. A refused contract has no reference module to strip, so its page joined the second arm: the
discriminator is now whether the contract is installable, and the new page is required not to say it.

**The registry answers nothing new.** `ServedRefusal` and the index already carried every field on the
page. That is what kept this unit inside `packages/site/`, and the thing that would not — publishing the
contract as written, which needs a digest for an address nothing anchors — is priced in `CLAUDE.md` and
not taken.

## Confirmation

`every-contract-the-index-lists-has-a-page-at-its-own-address` asserts the whole key set of the tree
rather than one direction of it, so an extra page and a missing one are the same failure. Seen red on
the way in: eleven keys where it expected ten.

`the-opening-of-a-page-says-three-different-things` is what decided where the state is said. The first
draft titled the page `group-by — turned down, and why`; that guard requires a contract page's title to
carry the summary and its description not to, and it was red on it. So the title is the shape every
contract page takes and the state leads the description — which is better for the reader it was written
for, since a search result now shows both what the function was and that it is not available.

## What would reopen this

A second refusal. There is one, so every figure on that page is a figure about one contract and the
index above it is a list of one — and a list of one is a shape that reads as a page about that one
thing.

## More Information

- [ADR-0027](0027-what-a-contract-page-publishes-and-what-it-leaves-out.md) — the decision this
  reverses, and the half of it that stands.
- [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md) — why `/refused/` keeps its
  address while its content changes.
- [ADR-0126](0126-a-domain-carries-what-it-turned-down.md) — the family half, taken one unit earlier.
