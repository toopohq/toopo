---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/contract-record.ts
  - packages/registry/address.ts
confirmed-by: []
---

# The shape of a record is language-neutral and its content is TypeScript

## Context and Problem Statement

`ContractAddress` carries a language coordinate, and it is tempting to read that as the schema being
language-neutral. It is not, and leaving the two unseparated would invite a later abstraction that no
contract fills.

## Considered Options

- Call the schema language-neutral, and abstract the fields whose content is TypeScript.
- Say where the frontier falls, and let the content be TypeScript.

## Decision Outcome

**Where the language sits.** The *shape* of this record is language-neutral and its *content* is
TypeScript: a declared type is TypeScript source, `environments` is a vocabulary of JavaScript
runtimes, and the encoded values of block 4.4 are JavaScript values. Nothing here pretends otherwise.
What is neutral is the address, which carries a language coordinate so that a second language never
has to rename the first one's addresses.

## Consequences

`ContractRecord.environments` is the field that carries the runtime half of that sentence:

The runtimes the contract is written for. Five of five carry the same three.

A Python catalogue would carry its own records of this shape, not translations of these. `CLAUDE.md`
measures why: 24 per cent of the named cases are not shareable, and on two of the five contracts it is
half, because their input domain *is* the language's type system.

The insurance the address carries was measured rather than trusted, and it is recorded in
`packages/registry/address.ts` rather than here, because it is a fact about the address and not about
the record: widening `Language` to `'typescript' | 'python'` and typechecking all six projects gives
exactly one error.

## Confirmation

Nothing guards this, and there is nothing here to guard: it is a statement about where a frontier
falls, not a rule a value could break. What is guarded is the address — `packages/registry/address.test.ts`
carries `COORDINATE`, keyed by `keyof ContractAddress`, so a coordinate added to an address does not
compile until somebody says what it looks like rendered.

## What would reopen this

A second language in the catalogue. That is the event that turns this from a statement into a
constraint, because it is the first time two records of this shape would hold content of two
languages.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
