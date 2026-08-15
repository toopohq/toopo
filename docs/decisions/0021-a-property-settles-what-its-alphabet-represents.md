---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# A property settles exactly what its alphabet represents, and no more

## Context and Problem Statement

A contract carries universal properties and a table of named cases, and the two look like a strong
mechanism and a weak one. A property is checked over thousands of generated inputs; a case is one row
somebody wrote down. The reading that follows — *a property is strong and a case is bookkeeping* —
decides what a reviewer looks at, and it is wrong.

## Considered Options

- Trust a property to cover what it is about, and read the table as documentation.
- Bound what a property establishes by the alphabet it draws from, and require a mutant to say which
  of the two settles each decision.

## Decision Outcome

A property that pins an exact answer on a generated family settles **exactly the decisions its
alphabet represents, and no others**. So for every decision a contract publishes about what its
answer should *be* — rather than about the shape of that answer — a reviewer can check that one of
two things is true: a representative of the decision is in the arbitrary, or a named case of block
4.4 settles it. The battery has to carry a mutant that says which, because the two look identical
from the outside.

Measured on `string/slugify@1`, whose battery reads the whole of block 4.4 blind on a second lens.
Twenty-one of its twenty-two behaviour defects still die on that column: shape properties turn out to
carry far more of the content than the table was written expecting. The twenty-second transliterates
Cyrillic, and it answers a well-formed, lower-case, idempotent slug that retains a subsequence — so
every property is satisfied, every benchmark profile keeps its class, and one guard in the whole
suite kills it: a named case. The control is a mutant folding the sharp s, the same kind of curation
decision from the same table the ecosystem writes, which dies on both columns — because the arbitrary
that draws well-formed slugs carries a sharp s and carries no Cyrillic.

## Consequences

What this forbids is the reading that a property is strong and a case is bookkeeping. A property is
as wide as its alphabet. Widening that alphabet is how a decision becomes property-checkable, and it
is a deliberate act with a cost — every symbol added is a decision the contract can no longer change
without the property going red, which is exactly what freezing means.

That cost has been paid deliberately once since: a second astral letter was added to
`string/slugify@1`'s alphabet to widen what one property catches, and the guard that partitions the
regions the texts reach reddened on the two counts it holds, which is that guard doing its job on a
foreseen change.

And it forbids the opposite move as well. A symbol added to a frozen alphabet with no red in front of
it is decorative in this repository's exact sense: a decomposed entry was proposed, built, measured at
0 of 100 000 against the mutant it was aimed at, and reverted —
[ADR-0015](0015-the-draw-count-is-a-floor.md) is where what a draw count may claim is settled.

## Confirmation

Nothing guards this, and there is nothing a guard could hold: the claim is about what a *reviewer*
concludes from a green property, and a guard that ran would be another green property.

What carries it instead is the pair of columns a specification battery runs — one lens with the case
table read, one with it blind — and the requirement that a battery carry a mutant saying which of the
two kills a given defect. That is a fact about how the batteries are written and is measured every time
one is replayed, rather than a declaration standing on its own.

## What would reopen this

A property whose alphabet is the whole input domain, where the distinction collapses because there is
nothing left for a case to add. `string/levenshtein@1` is the closest: its properties are the axioms of
a metric and its table is a third the size of `number/parse@1`'s, which is this rule already visible in
the shape of a contract.

## More Information

- [ADR-0015](0015-the-draw-count-is-a-floor.md) — what a draw count may claim, on the same properties.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
