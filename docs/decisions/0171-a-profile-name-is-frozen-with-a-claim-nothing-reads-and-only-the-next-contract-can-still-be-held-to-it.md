---
status: accepted
date: 2026-08-28
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/field-map.ts
confirmed-by:
  - battery: registry-storage
    guard: every-produced-expression-is-the-one-its-own-profile-declares
  - battery: registry-storage
    guard: no-two-profiles-of-an-unpublished-contract-are-indistinguishable
---

# A profile's name is frozen with a claim nothing reads, and only the next contract can still be held to it

## Context and Problem Statement

Three entries of the open list closed on one mechanism: `benchmarks.profiles[].name`,
`outputAlphabet` and `benchmarks.profiles[].samples.producedBy`, each naming *the validation
pipeline, the only thing that will ever read a declared name against what it describes*. A fourth
entry — the 348 declared names a reader cannot ask for — is explicitly held back on the first,
because serving them would put 348 addresses into the one document every query fetches on the
strength of a field nothing verifies.

The motivating measurement is `field-map.ts`'s own: `small-integers` was left named `small-integers`
and classed `accepted` while its samples became `['1e308', '0.000000000000001', '-1e-300']`, and
nothing in the catalogue noticed.

## Considered Options

- Build the mechanism the three entries name.
- Establish what that mechanism is, and write down what it turns out it cannot do.

## Decision Outcome

**The three entries were wrong, in three different ways, and none of them closes where it says.**

### The pipeline is not a mechanism, it is a library and an ordinal

`analyseImplementation` has no caller outside its own folder's tests — seven occurrences, all under
`packages/validation/`, which [ADR-0058](0058-what-contribution-this-project-invites.md) had already
measured and said. And *stages 2 to 7* is a rank with no list: swept over the whole tree, the number
seven appears in `CLAUDE.md`, in ADR-0058 and in the README, and **nowhere does anything say what
stage 2, 3, 4, 5, 6 or 7 would be.** [ADR-0082](0082-what-a-reviewer-can-establish-without-running-a-contract.md)
speaks of *a fourth stage that evaluates a vetted module* and the four has nothing behind it either.

That is this repository's own rule about a rank — *a list is checked line by line; a rank is checked
only by rebuilding the whole list, which is what nobody did* — arriving on the list that wrote it.

**And evaluation was never the obstacle**, which is the part that inverts the entries' reasoning.
Stage 1 never imports what it *analyses*, and it already imports what it *checks against*:
`requirementsOf(source.module)` is handed the evaluated contract module, and `analyse.ts` says so in
as many words — *reading a declaration is not reading an implementation*. A profile's samples are
within reach of stage 1 as it is written today.

### What is missing is not a stage

It is a machine-readable statement of what the name claims. Neither reading source nor evaluating a
module produces one, so no stage of anything produces one, and *the validation pipeline closes this*
was never a prediction about a tool that does not exist — it was a category error about what the
tool would be for.

Reading the name itself is word-matching on prose, which this repository refuses in four separate
entries, and it would fail on its own population: `two-renders-of-one-view`,
`a-row-that-changed-at-the-end` and `money-to-the-cent` are metaphors. A mechanism that read
`small-integers` and not those would be a guard whose population shrinks in silence, which is the
class [ADR-0152](0152-a-guard-that-cannot-see-its-own-population-shrink.md) spent a unit closing.

## The price of the freeze, which is the finding

**The repair exists, it is written down in this catalogue, and six contracts can never take it.**

A profile's *class* is verifiable because it names something the contract's own function computes:
`profiles.test.ts` runs the reference over every sample and refuses a class that is not true of them.
A profile's *name* is a second, finer statement the class does not cover. Measured at `286ca34` over
the catalogue's thirty-six profiles:

| what the class can say | profiles |
| --- | --- |
| share their class with a sibling of the same contract | 19 of 36 |
| indistinguishable from a sibling in **everything** a guard reads | 17 of 36 |

The two differ by `array/group-by@1`, and that difference is the whole answer. Its
`few-large-groups` and `string-keys` share a shape and are separated by `keyFunction`, which its
`profiles.test.ts` *executes* through `profileKeyFunctions`. **It is the only contract here where no
two profiles are one thing**, 0 of 6, and its own comment states the defect better than the schema
did: *without it, a profile called `many-small-groups` could quietly be measuring sixteen groups over
fifty thousand elements.*

It carries that because it has never been published. Measured at `286ca34`, `small-integers`
re-perturbed exactly as `field-map.ts` describes:

```
$ npm test
 Test Files  30 passed (30)
      Tests  718 passed (718)
 Type Errors  no errors

$ npm run freeze
typescript/number/parse@1 was published from d3a5166… bound to d5071a58…,
and this tree now produces 4992b93f…
 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
```

Seven hundred and eighteen guards green, and the only red is a digest. The repair would be a field of
`contract.ts`, every byte of that file is inside the digest six published contracts are bound by, and
so **the seventeen cannot be repaired by anyone, ever, for the life of those majors.**

**That is not a defect of the freeze. It is the freeze keeping its promise, and this is the first time
its price has been counted.** The entry's figure was `472 of 472`, taken when the catalogue was
smaller; what it never carried was how much of the catalogue the silence covers.

## What can still be decided: the next contract

The debt cannot be paid and it can stop growing. `PROFILE_SEPARATION_RULE` is declared in
`contract-record.ts`, beside `ProfileRecord`, where somebody writing an eighth contract reads what a
profile is:

> no two benchmark profiles of one contract are indistinguishable to the guards that read them: where
> two profiles share a class, some further declared field separates them and the contract's own
> `profiles.test.ts` executes it

`no-two-profiles-of-an-unpublished-contract-are-indistinguishable` holds it, and **the population is
derived rather than declared**, which is what keeps it from being a list of exceptions that grows.
A contract is held to the rule while `THE_FROZEN_HALF_IS_STILL_OPEN` answers for its lifecycle, and
it leaves the population by being published — which is precisely the moment the rule has already been
met. Nobody can add a name to the exemption; the six that are outside are outside because a digest
other people hold says so.

**It is not born on an empty population.** `array/group-by@1` is inside it today and passes.

## What `producedBy` turned out to be, which was not this at all

The third entry swept `benchmarks.profiles[].samples.producedBy` in with the name *for the reason the
entry above closes there*, and [ADR-0013](0013-samples-are-carried-or-pointed-at.md) reached for the
same sentence — *the only thing that will ever read a **declared name** against what it describes*.
`producedBy` is not a name. It is a transcribed expression, and what was unread about it was
arithmetic rather than prose.

The old guard asked whether the text occurred in `contract.ts` **anywhere**, and `the-catalogue.ts`
published the hole that leaves: `one-group-per-element` and `single-group` transcribe the same three
ranges, so either could become literal while the other kept the text alive. That is the class
`CLAUDE.md` records one entry along — *a value a guard looks for appears once on the surface it looks
at* — and a duplicate is what answers it.

`every-produced-expression-is-the-one-its-own-profile-declares` asks the profile instead of the file.
Measured at `286ca34`, with `one-group-per-element`'s samples made literal in the contract that is not
frozen:

```
+ "typescript/array/group-by@1 one-group-per-element: the record transcribes
   \"[range(10), range(1_000), range(50_000)]\" and the profile writes \"[[0, 1, 2]]\""

$ grep -c "range(10), range(1_000), range(50_000)" .../array/group-by/contract.ts
1
```

The twin still holds the text once, so `contract.includes(expression)` was **true** and the old guard
was green on this. That control is what makes the replacement a repair rather than a coincidence.

The seven `it.each` guards become one guard total over the catalogue, byte equality rather than the
flattened comparison the type transcriptions use — the two sides are one string with one provenance,
and measured at `286ca34` all six transcriptions are identical to the byte to what their profiles
write. The field is `structural` now: a catalogue guard refuses a wrong value by reading the
contract's own source, and no implementation is involved.

**`every-produced-profile-exists` survives, and writing the two side by side is what said why.** The
new guard reads `contract.ts`; that one reads the record `serialiseContract` built, so a serialiser
that dropped a profile reddens there and is invisible here — and `registry-storage` is the battery
whose whole subject is mutating that serialiser.

## What it costs

A compiler. `readSources` spawns one, so the contracts that point are read in a single call rather
than one apiece, and the guard declares its own timeout under the catalogue's clock rule — measured,
the registry suite goes to 459 guards in 10.43 s.

**Deriving `producedBy` at serialisation was measured and refused.** `serialiseContract` has dozens of
callers, several of them parameterised over seven contracts, and one of them is
`packages/cli/local-source.ts` — so a parser there would put a compiler spawn inside the client.
Measured, one spawn is 138 ms and the walk over all six pointing profiles is 7 ms. So `producedBy`
stays a declaration in `the-catalogue.ts` and stops being one-directional; it is not derived, and this
record says so rather than claiming the stronger word.

`isObjectLiteralExpression` and `isPropertyAssignment` join `TYPESCRIPT_SURFACE`, which now has three
readers. The converse is kept by hand as that file requires: both are read by the new guard.

## Consequences

Four entries of the open list change. The three that named the pipeline become one entry that names
the impasse and carries the 17 of 36; `producedBy` is closed; and the entry about the 348 unaskable
names loses the reason it was waiting — it was deferred on a field nothing verifies, and the field is
still unverified, so the deferral holds on its own arithmetic rather than on a promise about a
pipeline.

`outputAlphabet` stays open and is re-priced rather than carried: its missing direction is not about
prose at all — a declared character class with no witness in the generated outputs is arithmetic over
code points. It is not bought here, because the trigger has not been measured: whether `\p{M}` has a
real witness in `string/slugify@1`'s outputs. A guard red on a legitimate declaration is worse than
none, and that measurement is what decides it.

## Confirmation

`every-produced-expression-is-the-one-its-own-profile-declares`, seen red on the exact instance
`the-catalogue.ts` publishes, with the control showing the old guard green on the same perturbation.
`no-two-profiles-of-an-unpublished-contract-are-indistinguishable`, seen red with `string-keys` given
its sibling's key function. `I-72` and `I-73` are the cells.

Nothing establishes that a profile's *name* is true of its samples, and this record's whole subject is
that nothing ever will for the six contracts that are frozen.

## What would reopen this

A second major of a published contract, which is the only thing that could give one of the seventeen a
`contract.ts` it is allowed to edit — and [ADR-0161](0161-a-published-contract-can-be-wrong-about-its-own-case-and-only-the-instrument-says-so.md)
prices that and refuses it.

For `PROFILE_SEPARATION_RULE`, an eighth contract: the rule is held by a guard whose population it
will enter, and the day it is published is the day the rule stops applying to it.

## More Information

- [ADR-0013](0013-samples-are-carried-or-pointed-at.md) — the pointing arm, whose *what would reopen
  this* named the pipeline for a field that is not a name.
- [ADR-0082](0082-what-a-reviewer-can-establish-without-running-a-contract.md) — the triage this
  record's argument is built on, and the source of the fourth stage that has nothing behind it.
- [ADR-0058](0058-what-contribution-this-project-invites.md) — a contribution is never a contract, and
  stage 1 has no caller.
