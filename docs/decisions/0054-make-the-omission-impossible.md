---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/address.ts
  - packages/cli/lockfile.ts
  - packages/registry/verifiability.ts
confirmed-by:
  - battery: cli-install
    guard: a-field-this-toopo-does-not-honour-is-refused
  - battery: cli-install
    guard: a-version-this-toopo-does-not-write-is-refused
  - battery: registry-storage
    guard: every-standing-field-says-why-it-cannot-be-frozen
---

# Make the omission impossible rather than forbidding it

## Context and Problem Statement

A sentence in a header is a rule the next contributor never reads. This repository has found eight
things that behave like rules with nothing keeping them, and every one of them was a sentence somebody
had written and nobody had reread.

## Considered Options

- Write the rule where the next person will be working.
- Find the shape in which breaking it does not compile.

## Decision Outcome

**Before writing a rule in prose, look for the shape that makes breaking it not compile.** A sentence
in a header is a rule the next contributor never reads; a type that cannot be written the wrong way is
one they cannot get past. Three instances found independently, which is what turned a habit into a
rule:

- **`GuardAddress` carries no unpaired form.** Uniqueness is per contract, so a guard is addressed by
  the pair `(contract, guard)` — and `packages/registry/address.ts` publishes no type holding a guard identifier
  alone. The rule "the registry schema must always carry the pair" was written in prose first, in
  `CLAUDE.md`; making the unpaired form unrepresentable is what turned it into something the compiler keeps.
- **`VerificationStratum` has a member for deferring and none for omitting.** `stated-per-declaration`
  exists because the visibility guard found a path with no entry at all and a comment explaining why —
  and a comment is not a classification. *Deferring is a decision, omitting is a silence*, and the
  union is what makes the second one impossible to write.
- **`toopo.lock`'s version cannot go stale.** `packages/cli/lockfile.ts` validates through records keyed by
  `keyof LockedFeature` and `keyof InstalledFile`, so a field added to either does not compile until a
  check for it is written — beside the number that has to move. Both shapes had already shipped under
  `"version": 1` before this existed, which is the measurement that motivated it.

The three have one form: **a total map over a type, or a union with no way to spell the absence.** The
question to ask of any new rule is whether that form exists for it. Where it does not, the rule is
written in prose *and* recorded in the list of what this repository declares and nothing keeps, so that
a declaration nothing keeps is at least counted.

## Consequences

**It is not free, and the cost is stated so it is not discovered later.** Totality forces a decision at
the moment a type changes, which is the whole value, and it also means a field nobody has an opinion
about must still be given one. `FIELDS_OF` carries `files: Array.isArray` and delegates the elements
elsewhere — the totality guarantees no field goes *unconsidered*, never that every check is one
expression. Claiming more than that would be the decorative form of the same idea.

## Confirmation

The two lockfile guards are the shape at work: a field this `toopo` does not honour and a version it
does not write are both refused, and neither refusal is a sentence somebody remembered to write.
`every-standing-field-says-why-it-cannot-be-frozen` is the union half — an absence that has to be
declared with its reason rather than left out.

What none of them establishes is the rule itself, which is a habit about how a new rule is written. It
is kept by being applied, and the eight declarations with nothing keeping them are what it is measured
against.

## What would reopen this

Nothing about the rule; what changes is the list of places it has not reached. Each entry there is
either closed by finding the shape or priced and declared, and both are recorded when they happen.

## More Information

- [ADR-0055](0055-totality-by-the-compiler-beats-a-pass-over-the-data.md) — the same preference,
  between two mechanisms that both exist.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
