---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/registry/snapshot.ts
confirmed-by:
  - battery: freeze
    guard: every-published-binding-still-hashes-to-what-it-was-published-as
  - battery: registry-storage
    guard: every-standing-field-says-why-it-cannot-be-frozen
---

# What a contract refuses to be is published and frozen already

## Context and Problem Statement

The redesign draws a section on a family page, *What this family does not cover*, and the plan for it
was the mechanism [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) built: a
standing field on a contract, listing what it refuses to do, with the section composed from its
members. The `CLAUDE.md` entry about the alias rule pointed the same way — *the executable form needs
each contract to publish its exclusions as data, which is a new frozen field on five contracts.*

**Both were written without reading `identity`.** Measured at `5f152b1`:

```
number/parse@1    It is not a reader for JavaScript source literals, not a locale-aware parser,
                  and not an arbitrary precision parser.
date/add@1        That exclusion is deliberate rather than an oversight: reading the wall clock
                  of a particular place…
levenshtein@1     It is not a similarity ratio, not a phonetic match, not a locale-aware
                  comparison, and not an index… Damerau-Levenshtein… and weighted edit
                  distances… answer different questions and are separate contracts.
slugify@1         It is not written for a DNS label, a filename on a case-insensitive file
                  system, or an identifier in a language with an ASCII grammar…
```

That is `identity.inputDomain`. `identity` is inside `contractSnapshot`'s frozen half, the four are
published, and `contract-page.ts` renders it under a heading called **What it is for, and what it is
not**.

## Decision Outcome

**No standing field, and the reason is permanence rather than duplication.**

This repository holds duplications on purpose — a reference implementation restates its signature, a
battery pins the verdict it could read back, `publicContract` is written out field by field. Every one
of them is a second statement that *may be repaired* when the two disagree; the duplication is the test
precisely because either side can move.

This one could not be. `identity` is frozen and the four contracts are published, so permanent rule 6
forbids ever removing the `it is not…` clauses. A standing field saying the same thing would be a
second statement **one half of which is unremovable for the life of the majors**, free to drift and
impossible to reconcile. That is not the duplication this repository accepts; it is the one it exists
to refuse, made permanent.

**No domain object in the registry either, and this is written because the mock-up makes it easy to
reach for.** The section the mock-up draws carries two kinds of content under one title, and neither
gives such an object anything to hold.

The per-contract half — *transliteration to ASCII, which `slugify` exists to refuse* — is what
`inputDomain` already publishes, frozen, on the contract's own page.

What is left is a statement about **permanent rule 7** — *templating, formatting and escaping are not
one function each* — which is a sentence about what a contract is and never about `string`; and the
refusal of a contract **nobody ever wrote** — *case conversion, which the language already does* —
which the registry holds in no form and has no reason to.

So the field would have to have content invented for it, which is the order this repository does not
work in. [ADR-0121](0121-a-domain-has-a-page-and-its-opening-sentence-is-composed.md) refused the
hand-written version of this same content one section higher, on the same page, for the same reason: a
sentence about a domain is a further statement of what is in it, and nothing keeps it true.

**So the family page gains no section.** What a reader wanting to know what this corner of the
catalogue is not for does instead is open a contract and read the heading written for that question.

## Consequences

**The entry about the alias rule changes what it asks for.** It read *build a field*; the field exists.
What it asks now is nothing, and it says why: the exclusions are published and frozen and they are
**prose**, so a check over them is the word-matching that entry already refused — its own conclusion,
which turns out to have been more true than its premise. An entry that invites action and an entry that
explains why nobody should are different documents, and this one changed from the first to the second.

**One thing the debt list did not have a name for.** Its two-halves rule is written against *drift* —
*it is a list in prose describing what the code does, and the code moves while the list does not.* This
entry did not drift. The code never moved: `inputDomain` has carried those clauses since each contract
was written. **The entry was false the day it was published**, because it was written from an
assumption about what the schema held rather than from a reading of it. `CLAUDE.md` carries the rule
now, because a wrong entry that is not stale is invisible to every remedy the list had.

## Confirmation

`every-published-binding-still-hashes-to-what-it-was-published-as` is what makes the argument above a
fact rather than a reading of a type: the four bindings are rebuilt at the commit they were published
from and compared, so a clause removed from `inputDomain` reddens it. That is the guard the word
*unremovable* names.

`every-standing-field-says-why-it-cannot-be-frozen` is the other side, and it is why this record exists
rather than a comment: a field entering `CONTRACT_STANDING_FIELDS` must carry a reason it cannot be
frozen, and the reason this one would have carried is false — it *can* be frozen, and it is.

**The two guards that establish the point most directly could not be cited**, and that is this
repository's own open entry met for the third time.
`the-frozen-half-and-the-standing-half-partition-a-contract` and
`every-frozen-field-of-a-record-moves-the-digest` are written with `it.each` over the catalogue, so
`guardsCollectedIn` reads them as `…-%s` and `guardAddressFaults` refuses `%s` as an identifier. A
decision whose subject is per-contract still has no citable guard.

## What would reopen this

A contract published with no `it is not…` clause in its `inputDomain`, whose exclusions therefore exist
nowhere. Stage 1 of the validation pipeline is where that would be refused, and it does not read
`inputDomain` for content today.

## More Information

- [ADR-0118](0118-a-use-case-is-standing-and-never-part-of-the-contract.md) — the mechanism this
  deliberately does not use, and the measurement that put `useCases` in the standing.
- [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) — the rule whose entry this corrects.
