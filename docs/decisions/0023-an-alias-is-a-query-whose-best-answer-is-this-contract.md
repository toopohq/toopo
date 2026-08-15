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

**An alias is a query whose best answer is this contract - not a phrase that relates to it.**

The distinction is the whole content of the rule, because the second reading admits everything: a
phrase relates to a contract whenever anybody can explain the connection, and an explanation is always
available. What `identity.searchAliases` declares is the set of things somebody could type and be right
to be sent here, and every entry that is merely *about* the feature is a promise the result does not
keep.

### The trap, and it is the reason this is written down at all

**A property that checks that every alias retrieves its own contract first is satisfied by a lying
alias.** The alias is in the index, so it matches the contract that declares it by construction — which
is what retrieval *means*. `every-declared-alias-finds-its-own-contract-first` therefore establishes
that the ranking works and says nothing whatever about whether the phrase should have been declared.
Somebody will read that guard as a review of the aliases, because it looks like one; it is a review of
the search.

Measured: `string/levenshtein@1` declared `string similarity` while its own input domain says *it is not
a similarity ratio*, and `string/slugify@1` declared `remove accents from string` while its own
description sends that reader to a different function. Both retrieved their own contract first. Eight
aliases were removed across the five and the trial was green before and after.

### The review that does catch them, in two filters that are not the same filter

**Mechanical.** Read the contract's own exclusions - every *it is not X* of the input domain, every
*that is a different function* of the description - and refuse any alias that names one. It needs no
judgement and it found five of the eight: `string similarity`, `damerau levenshtein`, `remove accents
from string`, `strip diacritics`, and `offset date`, whose contract refuses time zones and whose word is
what a zone offset is called.

**A judgement, one alias at a time.** The rest are not contradicted by anything the contract wrote, and
they are not one category: *an alias nobody would type costs weight, an alias that promises what we do
not do costs trust*. `atoi` is the first - a C function name nobody types looking for JavaScript. `index
by` and `array to map` are the second - `indexBy` returns one element per key and a map conversion is
one-to-one, and this contract returns groups.

**The criterion that decides the next one without a second opinion: could a better answer exist in this
catalogue?** For `string similarity` yes, and it is a different function with a different output shape -
so the alias is a lie whether or not that contract is ever written. For `how similar are two strings`
no: it is a layperson's phrasing of exactly this question, it names no function and no output shape, and
nothing better could answer it. Vagueness is not the fault; *naming something we are not* is.

**What this does not forbid is naming the built-in or the library a contract is positioned against**,
and the line is that the contract must name it too. `parseFloat`, `parseInt`, `Object.groupBy`,
`Map.groupBy` and `lodash groupBy` are all argued against by name in their own contract's published
prose, which is what makes the alias a service rather than a bait: somebody typing `Map.groupBy` is best
answered by *the language ships this now*, and only the contract that declares the alias can say so.
`atoi` is out under the same line, because no contract names it.

## Consequences

### An alias is not frozen with the major, and that is what makes the repair cheap

A case identifier, a guard identifier, a reason literal and a benchmark profile name are all frozen,
because each of them is an *address*: an API response cites one, a URL anchors on one, a validation
report names one, and an address that changes breaks a link. An alias is none of those. Nobody links to
an alias, no answer cites one, and correcting one breaks nobody's code - it is curation, not addressing.
So a lying alias is repaired the day it is found, and it does not cost `name@2`.

That asymmetry is the reason an alias correction is one of the three contributions this project invites
while a contract is not: being wrong about an alias costs a revision, and being wrong about an address
costs a major.

## Confirmation

`every-declared-alias-finds-its-own-contract-first` in `packages/cli/search.test.ts` is named here for
what it does **not** establish, which is the finding this record exists to carry: it was green before
and after eight lying aliases were removed, because an alias matches its own contract by construction.
It keeps the ranking and says nothing about the curation.

Nothing enforces the rule above, and it is written here in prose rather than dressed as a mechanism. The
executable form was looked for: it needs each contract to publish its exclusions as data, which is a new
frozen field on five contracts to buy a check that would still refuse the wrong phrases by matching
words. It is recorded among the declarations this repository keeps by hand.

## What would reopen this

A second contract in a domain this catalogue already covers — the day `string similarity` exists, the
phrase that is a lie today becomes a legitimate alias of a different contract, and the criterion
*could a better answer exist in this catalogue* starts returning a different answer for phrases nobody
has revisited.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — the four fields that are
  addresses, and why this one is not.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
