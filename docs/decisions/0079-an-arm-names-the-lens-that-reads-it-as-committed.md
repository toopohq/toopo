---
status: accepted
date: 2026-08-15
governs:
  - mutation/mutants.ts
confirmed-by:
  - battery: meta
    guard: a-contract-battery-is-compared-against-its-own-contract-alone
---

# An arm names the lens that reads it as committed

## Context and Problem Statement

The arm a battery declares its mutants against, and how its lenses read it. Which lens reads the
contract as its commit left it could be inferred from the lens list, or declared.

## Considered Options

- Infer it: the first lens, or the one whose name says so.
- Name it, and name the blinded ones beside it.

## Decision Outcome

Named rather than inferred from the lens list, because "which lens reads the contract as its commit
left it" is the axis every measurement in this repository is a difference along. A battery that got it
the wrong way round would report the detection a blinding *removes* as the detection it adds.

### The three forms a mutant takes on that axis

A defect no lens of this arm is blind to: every cell sees it, and sees it alike.

Named for the axis it is on rather than for the defects that happen to use it. Most of them are defects
of behaviour, and the seven signature defects of `number/parse@1` and `date/add@1` are not — a lens that
blinds the suite to which reason a refusal names cannot blind it to the declared type, so they belong
here too.

A defect only the unblinded lens can see. Every one of them answers every call with the value the
contract asks for, so a blinded column is what a contract without that half of its surface would have
seen: nothing.

A defect every lens sees and no two lenses see alike, pinned one lens at a time.

It is the form the signature defects take on a contract whose second lens blinds the type identity
assertion: both columns catch them, and the difference between what each column names is the
measurement the lens exists for. `array/group-by@1` wrote it first and kept it local because one
exemplar generalises nothing; `string/levenshtein@1` writes exactly the same thing, so it lives here
rather than in two batteries.

## Consequences

The three forms are named for the axis rather than for their contents, which is why a signature defect
and a behavioural defect can share one. The third arrived only when a second exemplar existed, which is
the bar this folder applies to everything it shares.

## Confirmation

`a-contract-battery-is-compared-against-its-own-contract-alone` establishes that an arm is measured
against the contract it belongs to, which is what makes the committed column mean what this record says
it means. That a battery has not swapped its committed lens for a blinded one is caught by the
calibration mutant rather than by a suite guard.

## What would reopen this

A battery with two unblinded lenses, or with none — a shape where "the lens that reads it as committed"
stops being a single answer.

## More Information

- [ADR-0075](0075-what-a-mutant-helper-shares-and-what-stays-in-the-battery.md) — the bar under which
  the third form moved into this file.
- [ADR-0078](0078-a-survivor-declares-its-nature-and-a-verdict-names-what-caught-it.md) — what the
  blinded column's survivor means.
