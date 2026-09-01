---
status: accepted
date: 2026-08-15
governs:
  - packages/catalogue/every-contract.ts
confirmed-by:
  - battery: registry-storage
    guard: every-file-a-published-contract-freezes-is-served
---

# A contract is the folder, and its executable halves agree on two conventions

## Context and Problem Statement

A contract is the folder, not one file. Which file carries what, and which conventions of the
executable halves belong to the catalogue rather than to one contract.

## Considered Options

- One file per contract, with every block inside it.
- A folder, cut along the block boundary, with each block's executable half beside its declaration.

## Decision Outcome

A contract is the folder, not one file. `contract.ts` carries identity, signature, universal-property
applicability and benchmark profiles; block 4.4, the named and settled edge cases, has its own file
because it is the only block that grows.
All of that declares behaviour and executes nothing: the reference implementation lives in
`reference.ts`, and the executable half of each block lives beside it — `signature.test-d.ts` for 4.2,
`properties.test.ts` for 4.3, `edge-cases.ts` and `edge-cases.test.ts` for 4.4, `profiles.test.ts` for
4.5.

Two conventions of the executable halves are catalogue-wide because all three contracts reached them
independently.

Block 4.2 is checked with `toEqualTypeOf` rather than `toMatchTypeOf`: a signature that merely
satisfies the contract's shape is not conformant, it has to be identical.

Block 4.5 is declared as data and nothing in it is executed or measured in this repository. There is no
reference machine yet, and a number produced on a developer laptop would be dishonest. What
`profiles.test.ts` does check is that a profile's name is true of its samples: the name is a claim, and
`number/parse@1` shipped a profile named for one path whose samples took the other with nothing to say
so.

Block 4.3 declares its own number of draws, as contract data rather than a runner setting. The harness
is public and executable by anyone, so the number of draws is part of the strength of what the contract
claims, and leaving it to whoever types the command would make two runs of the same contract mean
different things. It is a floor, not a value: official validation may draw more, nothing may draw
fewer. The figure itself stays in each contract, with the measurement that chose it.

### Where block 4.4 lives, and why it is cut out

Block 4.4 lives in its own `edge-cases.ts`, beside the `edge-cases.test.ts` that executes it, in every
contract. The other four blocks declare a fixed number of things — an identity, a signature, a list of
universal properties, a set of benchmark profiles — while this one gains an entry every time a defect
is found that no existing case caught. Cutting along the block boundary keeps the contract's own
numbering as the map: a reader looking for 4.4 finds a file named for it.

Each entry is simultaneously an exact test and one line of public documentation. `rationale` is the
published sentence, and it states a measured fact rather than an opinion.

The tables themselves are not shared and were measured not to be shareable: three contracts produced
three entry shapes with no field in common beyond `id`, `provenance` and `rationale`, which are the
three that live here.

## Consequences

The folder is the unit of freezing and of serving, which is what `harnessOf` enforces in both
directions. What is *not* kept is one level up: the declaration is checked against the folder, and
nothing checks the declaration — recorded in `CLAUDE.md` among what nothing keeps, and closed by a
validation stage rather than by this record.

## Confirmation

`every-file-a-published-contract-freezes-is-served` establishes the folder half — that no file a
contract declares is missing from what a client can obtain. The two conventions of the executable
halves are established by each contract's own suite, which a decision cannot cite: a contract's guard
titles are built in a loop, and `mutation/decisions.ts` declares that limit rather than working around
it.

## What would reopen this

A block that grows the way 4.4 does, which would earn a file of its own on the same argument. Nothing
in the five suggests one today.

## More Information

- [ADR-0015](0015-the-draw-count-is-a-floor.md) — why block 4.3 declares its own draw count.
- [ADR-0012](0012-block-4-4-is-several-tables-and-a-case-has-a-group.md) — what block 4.4 grew into.
- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — why a profile's name is a
  claim about its samples.
