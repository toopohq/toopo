---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/contract-page.ts
  - packages/site/refusals-page.ts
confirmed-by:
  - battery: site
    guard: every-contract-the-index-lists-has-a-page-at-its-own-address
  - battery: site
    guard: a-page-is-addressed-by-the-contract-it-is-about
  - battery: site
    guard: the-cost-a-page-states-is-what-lands-and-not-what-is-served
  - battery: site
    guard: nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed
---

# What a contract page publishes, and what it leaves out

## Context and Problem Statement

The project specification describes a contract page for a mature catalogue: implementations, benchmark
figures, sizes, tags. The catalogue has one implementation per contract, no reference machine, and one
contract that was refused before publication. A page written to the specification would be a third
empty.

## Considered Options

- Render the page the specification describes, with the sections that have no data left empty.
- Publish what exists, and name what is missing where a reader would look for it.

## Decision Outcome

**A refused contract has no page.** `array/group-by@1` was decided against *before* publication, so
`refuseContract` records an argument and binds no digest: there is no frozen definition, no snapshot,
nothing a reader could check. A contract page with no digest behind it would be missing the only half
that makes this registry worth anything. What the catalogue publishes about it is the refusal, on the
page written for refusals — which is where it belongs, and which is the most distinctive page this
project can publish on day one.

The cost is named rather than left to be found: that page cannot show the contract's own prose — the
comparison of lodash, Ramda, d3 and the two ES2024 built-ins that makes its case — because the registry
serves a refusal and not a definition of the thing refused.

**No implementation section.** The project specification describes a contract page for a mature
catalogue: implementations, benchmark figures, sizes, tags. There is one implementation per contract
and no reference machine, so a third of that page would be a table of nothing, and an empty section
tells a reader something is missing without telling them what. What survives is the one figure that is
measurable today and is the most immediate comparison against an npm package — **how many bytes land in
their project** — stated in the first screen and in exact bytes rather than rounded. `readableBytes`
stays in `packages/cli/report.ts`, because a terminal line is read in passing and a page has room for the number.

**A page's address is the contract's address.** `/number/parse@1/`, anchored `#ordinary-integer`, which
is exactly what `renderCase` has rendered since `packages/registry/address.ts` was written and nothing read.
That is the third time a field written for a consumer that did not exist yet turned out to be right,
after `identity.searchAliases` and `FIELD_MAP.verification`, and it is the argument for going on
writing the address before anything fills it.

## Consequences

An empty section never appears on this site, and the rule generalises past this page: *a section with no
data is not rendered, and what is missing is said in a sentence where a reader would have looked for it*.

The refusals page carries the argument the contract page cannot, which makes the pair the shape of the
whole site: one page per thing that exists, one page for the thing that was refused.

## Confirmation

`every-contract-the-index-lists-has-a-page-at-its-own-address` holds the whole key set, which is the
only form that can fail: a guard over one direction is satisfied by publishing every contract or by
publishing none. **It was `every-installable-contract-has-a-page-and-a-refused-one-does-not` until
[ADR-0127](0127-a-refusal-is-a-state-of-a-contract-at-its-own-address.md)**, which reversed the half of
this record that a refused contract has no page — so the name went on asserting the opposite of what
the file did and had to move with it. What this record decided and keeps is the other half, and
`nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed` is what holds it. `a-page-is-addressed-by-the-contract-it-is-about` resolves the
page path against `renderContract`, and `nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed`
is the half that would otherwise send a reader to a command that cannot work.
`the-cost-a-page-states-is-what-lands-and-not-what-is-served` keeps the one figure the page does
publish honest, since the bytes served and the bytes that land are not the same number.

## What would reopen this

A second implementation of any contract, which is the event that makes an implementation section carry
something. Benchmark figures need a reference machine as well, and that is a second decision.

## More Information

- [ADR-0007](0007-four-lifecycle-states.md) — what a refused contract is in the record.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
