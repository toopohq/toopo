---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
confirmed-by:
  - battery: registry-storage
    guard: every-anatomy-requirement-is-triaged
---

# An executable own declaration names the guard that makes it so

## Context and Problem Statement

An own declaration may claim that something executable keeps it. That claim is exactly the kind this
repository refuses to take on trust, and `CLAUDE.md` records four declarations that claimed
`executable` and named no guard — one of which turned out to be `structural`, with no guard running an
implementation against it at all.

## Considered Options

- Let the stratum stand alone, as a word describing how strongly the declaration is kept.
- Require the `executable` stratum to carry the address of the guard that makes it so.

## Decision Outcome

### `OwnDeclaration.verification`

What refuses a wrong value here. It is on the declaration rather than in `field-map.ts` because this is
the one place in the schema where the meaning of a field genuinely depends on the contract that holds
it: `metricAxioms` is refused by a guard that requires every axiom to be answered by a property,
`outputAlphabet` is the one-directional case GS-11 measures, and `ecosystem` is prose about four
libraries this repository does not depend on.

### `OwnDeclaration.executableBy`

The guard that makes an `executable` declaration executable, resolvable rather than asserted.

Optional because only `executable` carries one: the weaker strata name what *cannot* be established,
and pointing at a guard would be claiming the opposite. `serialise.ts` refuses the two ways that could
go wrong - an `executable` declaration with no guard, and an address naming a guard no battery holds.

## Consequences

A claim of executability now costs an address, and an address that does not resolve is refused at
serialisation rather than believed. The weaker strata stay cheap, which is what keeps the field
honest: `stated-per-declaration` exists so that deferring is a decision and omitting is not
representable.

## Confirmation

`serialise.ts` refuses both failures. `every-anatomy-requirement-is-triaged` in
`packages/registry/the-sixth-contract.test.ts` keeps the half that can be kept — a new anatomy entry
with no verdict is refused.

## What would reopen this

The conformance controller. `CLAUDE.md` triages `contractAnatomy` as three entries settled by the
source alone, four needing a vetted module, and four that are a reader's for ever; a fourth validation
stage that evaluates a module would move four declarations from a weaker stratum to `executable`, and
each would then owe an address.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
The declaration this guards is the one [ADR-0004](0004-what-the-schema-does-not-name-is-encoded.md)
carries as an opaque value.
