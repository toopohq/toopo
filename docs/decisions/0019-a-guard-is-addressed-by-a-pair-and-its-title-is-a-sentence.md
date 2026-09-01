---
status: accepted
date: 2026-08-15
governs:
  - packages/catalogue/identifier.ts
  - packages/registry/address.ts
  - mutation/run.ts
confirmed-by: []
---

# A guard is addressed by a pair, and its title carries that address and a sentence

## Context and Problem Statement

A guard needs two things and they are not the same object. It needs an **address** — a battery pins
it, an attribution cites it, and a validation report will one day put it in front of a submitter. And
it needs a **sentence**, because test output is read by people. One string doing both means every
reword breaks a pin, and it means a title rendered from the contract's own data renames the guard a
specification mutant reddens.

## Considered Options

- One string, written for whoever reads the runner's output.
- An identifier and a sentence, separated inside the title.
- Two fields, which a test framework's `it(...)` does not offer.

## Decision Outcome

Every guard carries an **identifier**: a name, in kebab-case, unique within its contract and **frozen
with its major version**. A guard's title is that identifier, then ` :: `, then a sentence for
whoever reads the runner's output — or the identifier alone, when it says everything. Batteries pin
identifiers, attribution reports identifiers, and `calibrate()` refuses a guard whose title carries
no well-formed one, or two guards of one contract answering to one.

The naming rule the identifier obeys is
[ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md)'s, and it is the same rule block
4.4 already carried for a case.

### The one class of defect this makes detectable

That second failure was measured rather than argued. LS-13 of `string-levenshtein-spec` relabels the
`identical` benchmark profile as `far` — a profile that claims to time the fast path, published as
timing the worst case. Before this rule its guard reddened under `identical - every sample is far`, a
title the unmutated contract does not contain, so calibration never saw it and attribution had
nothing to attribute. The battery passed, reported thirteen of thirteen defects killed, and went on
calling that region one no mutant probes — while a mutant probed it. The refusal the instrument is
built around, *a declaration a mutant contradicts is stale*, could not fire. After the change it
fires, the declaration had to go, and `identical` left the unprobed list. **That is the one class of
defect these identifiers make detectable.** The other 466 guards are a tidying for the registry, and
it is recorded as one rather than dressed up.

### Uniqueness is per contract

**Uniqueness is per contract.** The instrument can only break inside a contract — a battery injects
into one folder, and attribution already filters guards to the contract under measurement — and the
registry will address a guard by the pair `(contract identity, guard identifier)`, exactly as it
addresses a case. A globally unique identifier would encode the contract into the name, duplicating
what the pair already carries and making a contract rename a rename of every guard. The cost is
stated so it is not discovered later: **the registry schema must always carry the pair, never the
identifier alone.** Fifteen identifier strings are held by more than one contract today.

**Four identifiers belong to the catalogue rather than to a contract**, and only four:
`every-case-is-addressed`, `every-case-is-justified`, `every-case-is-grouped` and
`universal-properties-answered`. Those are not five guards that resemble each other — the helper *is*
the guard, one function applied five times — so each is a constant exported from
`packages/catalogue/every-contract.ts` and a contract cannot rename it locally. Renaming one costs a major on
the whole catalogue, the discipline everything in that file already carries. The other twelve shared
strings are five contracts asking the same question about different data: *resemblance is not
duplication*, the rule the catalogue already applies to `outputsAreEqual`, so each contract owns its
own and two may coincide.

### The separator

**The separator is ` :: `, and it is ASCII on purpose.** It cannot occur inside an identifier,
because an identifier has no spaces, so the split cannot be wrong. An em dash reads better and would
have been the first non-ASCII code point in any title in the repository: measured over every `it(...)`
in every test file, none carries one, and `number/parse@1` is where the cost of a stray non-ASCII
character in a source file was paid once already.

## Consequences

**The unpaired form is unrepresentable rather than forbidden.** `packages/registry/address.ts`
publishes `GuardAddress` as the pair and publishes no type carrying a guard identifier alone, so the
rule above — *the registry schema must always carry the pair* — is kept by the compiler and not by this
sentence.

**What this does not cover, and it is not an oversight.** `npm test` will never see a duplicate
identifier: a guard cannot enumerate the tests vitest collected, so the refusal lives in
`calibrate()`, where the identities are already gathered. A contributor who writes a duplicate learns
it from the first battery they run, not from the suite.

## Confirmation

Nothing here is addressable under this record's own rule, and that is the honest answer rather than an
empty field. What keeps the decision is `calibrate()` in `mutation/run.ts`, whose refusals are held by
three guards in `mutation/instrument.test.ts` — *refuses a guard that carries no well-formed
identifier*, *refuses two guards of one contract that answer to one identifier*, *refuses a suite
declared silent under a title no suite carries*. Those titles are prose without a ` :: `, so their
whole title is their address, and an address with spaces in it is not one this format can name.

They are also in `mutation/`, where no battery injects, so their detection power is unmeasured either
way — the difference in strength [ADR-0001](0001-record-decisions-in-madr-format.md) records between a
guard addressed under a battery and one addressed under `meta`.

## What would reopen this

A runner that carries an identifier beside a title rather than inside it. The separator exists because
`it(...)` takes one string; a framework offering two fields would make the split data instead of a
convention, and `CaseGroup` in `packages/catalogue/identifier.ts` is what that already looks like where
the thing being addressed is data.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — why the identifier is a
  name.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
