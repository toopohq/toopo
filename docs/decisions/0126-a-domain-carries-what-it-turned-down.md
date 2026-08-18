---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/catalogue.ts
  - packages/site/domain-page.ts
  - packages/site/chrome.ts
confirmed-by:
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
  - battery: site
    guard: the-sentence-a-domain-page-opens-on-is-computed-from-what-it-lists
  - battery: site
    guard: a-domain-page-lists-every-contract-the-index-files-under-it
---

# A domain carries what it turned down, and the domain that publishes nothing has a page

## Context and Problem Statement

A redesign moves a refusal from a page of its own to the state of a contract, mentioned in the family it
belongs to. The family half is this record; the contract's own address is the unit after it.

Two decisions stood in the way and both were taken deliberately, so neither is outgrown by accident.

[ADR-0027](0027-what-a-contract-page-publishes-and-what-it-leaves-out.md) settled that a refused
contract has no page: `refuseContract` records an argument and binds no digest, so there is no frozen
definition and nothing a reader could check, and *a contract page with no digest behind it would be
missing the only half that makes this registry worth anything*. **That half is kept and this record does
not touch it.**

[ADR-0121](0121-a-domain-has-a-page-and-its-opening-sentence-is-composed.md) settled the other half one
level up, and its argument is what this reverses:

> A page for it would carry an empty list, a figure of zero and one line pointing at the refusals page —
> which answers no question that page does not answer better, and would put an address in the
> catalogue's navigation that a reader gains nothing by following.

## Decision Outcome

**A domain page exists for every domain the index files a contract under, and it carries what that
domain turned down.**

ADR-0121's sentence is true of a page that says nothing about the refusal. It is what makes this a
reversal rather than a growth: the two halves move together, because the reason `array` had no page was
that its list would be empty, and the reason its list was empty was that a refusal lived somewhere else.
Put the refusal on it and the page answers the question ADR-0121 said it could not — *what did this
corner of the catalogue decide against, and why*.

**`Domain` carries its own address instead of reaching into `held[0]`.** The tuple `[Held, ...Held[]]`
existed because a domain page is addressed by going up one level from a contract of it, so *this list has
a first element* was what made the address exist. A domain that publishes nothing has no held contract
and has a page, so what the address now depends on is that the domain exists at all — which is what
`domainsOf` establishes. Five call sites stopped asserting something a filter had already established.

**The opening sentence stays composed and gains one arm.** ADR-0121 refuses a hand-written line there,
and the composition applied to `array` produces *This domain publishes 0 contracts, settling 0 named edge
cases* — a sentence assembled correctly out of nothing, which is ADR-0027's own rule arriving on prose
rather than on a heading: *an empty section tells a reader something is missing without telling them
what.* So a domain that publishes nothing opens on what it turned down, which is the only figure it has.

**The column says what it counts rather than counting the wrong noun.** `array · 0 contracts` is
arithmetic that reads as *this corner is empty*, on the page whose subject is a contract written in full
and refused. `chrome.ts` already holds the rule that a bare digit does not survive `toText`; this is the
same rule one turn on, because a digit counting the wrong thing is false in every projection and not
only in the text one.

**The mention carries no measurement.** What makes a refusal worth publishing is the measurement it
rests on, and a measurement quoted in a list is one without the comparison that gives it force. So the
mention says what happened and the page written for it says why. **It pointed at `/refused/` on the day
this was written and points at the contract's own address since
[ADR-0127](0127-a-refusal-is-a-state-of-a-contract-at-its-own-address.md)** — the destination moved and
the rule did not, which is what makes the rule the part worth having stated.

## Consequences

**The catalogue gains an address and loses none**, which is what makes this unit cheap:
`/typescript/array/` is new, and ADR-0125's reading is what says so — the deployment before this one
lists ten addresses and this tree writes eleven, and only the other direction is a fault.

**`array` is in the navigation of every page.** The domain list in the column was every domain with a
page, so a reader had no way to reach a refusal except through the masthead. Four domains now, four
pages, and the list and the index agree by construction rather than by a filter.

**No registry answer changed.** `ServedRefusal` already carried the address, the decision, the
measurement and what the contract is kept as; `domainsOf` reads the answer that already existed. The
unit after this one is where the registry is asked for something it does not currently serve, and that
is priced in `CLAUDE.md` rather than taken here.

## Confirmation

`every-contract-the-index-lists-has-a-page-at-its-own-address` **kept its name through this record and
lost it to the next**, which is worth leaving here rather than smoothing. It was
`every-installable-contract-has-a-page-and-a-refused-one-does-not`, and this unit checked rather than
assumed: the domain side was never in the name, so what this record changed left it true.
[ADR-0127](0127-a-refusal-is-a-state-of-a-contract-at-its-own-address.md) gave a refused contract a page
one unit later, at which point the name asserted the opposite of what the file did and the rename
stopped being optional. **The cost that made it worth avoiding here is what it cost there**: the
`confirmed-by` of two other records had to move with it, which is the mechanism that found the missing
guard in the first place. What changed inside it is the source of the domain side — the index's domains
rather than its installable entries — and it was seen red on exactly that: `typescript/array/index.html`
present where the guard expected ten pages.

`the-sentence-a-domain-page-opens-on-is-computed-from-what-it-lists` gained the arm rather than a
weakening. It required the opening to carry three figures read off what is published; on a domain that
publishes nothing all three are `0`, and a guard requiring `0` is satisfied by the sentence this record
refuses. It now requires the figure that page actually states, and it was red on the composed sentence
before the arm existed.

## What would reopen this

A domain with something published **and** something turned down. There is none today, so the two lists
appearing on one page is a shape no page of this site is in — the branch is exercised, but only one of
its arms is exercised per page.

## More Information

- [ADR-0027](0027-what-a-contract-page-publishes-and-what-it-leaves-out.md) — why a refused contract has
  no page of its own. **It stood on the day this was written and was reversed one unit later** by
  [ADR-0127](0127-a-refusal-is-a-state-of-a-contract-at-its-own-address.md); what survives of it is that
  a page with no digest behind it must say so rather than look like the others.
- [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md) — why adding an address is
  free and removing one is not.
