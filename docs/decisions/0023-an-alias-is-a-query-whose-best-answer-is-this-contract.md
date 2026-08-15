---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: cli-search
    guard: every-declared-alias-finds-its-own-contract-first
---

# An alias is a query whose best answer is this contract

## Context and Problem Statement

`identity.searchAliases` is the searchable surface of a contract: the description is not in the index,
so a query only a description could have answered is a missing alias. That makes the field the one
place where somebody can quietly promise something this catalogue does not do — and the guard that
looks like it would catch that is satisfied by exactly the phrases it ought to refuse.

## Considered Options

- An alias is any phrase that relates to this contract.
- An alias is a query whose best answer, in this catalogue, is this contract.

## Decision Outcome

**An alias is a query whose best answer is this contract — never a phrase that relates to it.** The
second reading admits everything, because a phrase relates to a contract whenever anybody can explain
the connection and an explanation is always available.

**The property that every alias retrieves its own contract first is satisfied by a lying alias**, and
that is the whole reason this is written down. The alias is in the index, so it matches the contract
that declares it by construction — which is what retrieval *means*. The trial establishes that the
ranking works and says nothing about whether the phrase should have been declared, and it looks exactly
like the opposite. It was green before and after eight aliases were removed.

Two filters, and they are not the same filter. **Mechanical:** read the contract's own exclusions —
every *it is not X* of the input domain, every *that is a different function* of the description — and
refuse any alias that names one. It found five. **A judgement, one alias at a time:** an alias nobody
would type costs weight, an alias promising what we do not do costs trust, and those are different
categories. It found three. The criterion that decides the next case without a second opinion is
**could a better answer exist in this catalogue** — for `string similarity` yes, and it is a different
function with a different output shape, so the alias is a lie whether or not that contract is ever
written; for `how similar are two strings` no, and vagueness is not the fault. *Naming something we are
not* is.

**Naming the built-in a contract is positioned against is deliberate, and the line is that the contract
names it too.** `parseFloat`, `parseInt`, `Object.groupBy`, `Map.groupBy` and `lodash groupBy` are all
argued against by name in their own contract's published prose, which is what lets `toopo search
Map.groupBy` answer *the language ships this now*. `atoi` went out under the same line, because no
contract names it.

## Consequences

**An alias is not frozen with the major**, and it is the only field of `identity` that is not. A case
identifier, a guard identifier, a reason literal and a benchmark profile name are addresses — an API
response cites one, a URL anchors on one — and an address that changes breaks a link. Nobody links to
an alias, no answer cites one, and correcting one breaks nobody's code. It is curation, so it is
repaired the day it is found and does not cost `name@2`.

That asymmetry is the reason an alias correction is one of the three contributions this project invites
while a contract is not: being wrong about an alias costs a revision, and being wrong about an address
costs a major.

## Confirmation

`every-declared-alias-finds-its-own-contract-first` in `packages/cli/search.test.ts` is named here for
what it does **not** establish, which is the finding this record exists to carry: it was green before
and after eight lying aliases were removed, because an alias matches its own contract by construction.
It keeps the ranking and says nothing about the curation.

The rule itself has no mechanism, and it was looked for and priced rather than dressed as one: the
executable form needs each contract to publish its exclusions as data, which is a new frozen field on
five contracts to buy a check that would still be matching words against prose. `CLAUDE.md` keeps that
in the list of what this repository declares and nothing keeps.

## What would reopen this

A second contract in a domain this catalogue already covers — the day `string similarity` exists, the
phrase that is a lie today becomes a legitimate alias of a different contract, and the criterion
*could a better answer exist in this catalogue* starts returning a different answer for phrases nobody
has revisited.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — the four fields that are
  addresses, and why this one is not.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
