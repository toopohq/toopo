---
status: accepted
date: 2026-09-07
governs:
  - packages/registry/runtime-capability.ts
  - packages/cli/runtime-capability.ts
confirmed-by:
  - battery: registry-storage
    guard: a-runtime-capability-outside-the-vocabulary-is-refused-by-name
  - battery: registry-storage
    guard: a-runtime-requirement-is-absent-rather-than-empty
  - battery: registry-storage
    guard: a-contract-that-requires-nothing-freezes-no-such-field
  - battery: registry-storage
    guard: a-required-runtime-is-inside-the-digest-and-on-the-index
  - battery: cli-install
    guard: a-runtime-serving-the-withdrawn-names-does-not-carry-temporal
  - battery: cli-install
    guard: an-install-is-refused-when-this-runtime-lacks-what-a-contract-requires
---

# A contract says what it needs of the runtime, and two things refuse on it

## Context and Problem Statement

ADR-0247 established that what blocks the eighth contract is the schema rather than the runtime, and
ADR-0248 measured that giving the catalogue the word costs a published digest **nothing** in either
form it could take — a field of its own, or `environments` loaded with a second meaning. So the choice
was never a price, and it was made on meaning: **a field of its own**.

The reason it is not `environments` is the reason this unit had to build more than a field.
`environments` is `readonly string[]`, `documentary`, inside the digest, declared identically as
`['node', 'browser', 'bun']` by all seven contracts, and read by nothing outside the schema — so
nothing about it can be wrong, and a constant cannot be contradicted. **A field that landed in that
same state would refute the record that argued for it**: the catalogue would have built
`environments` twice.

**So the constraint that decides this unit is that something reads the field and refuses on it.**

## Decision Drivers

* **A second documentary field would be a worse outcome than doing nothing**, because it would be
  frozen into the eighth contract's digest while deciding as little as the field it was preferred to.
* **What the field expresses has to be measured and not assumed.** A version range is the obvious
  spelling and it is the one this repository has the readings to refuse.
* **The frozen half is settled before publication or never**, so anything the field needs to carry has
  to be right the first time.
* **The red comes before the green.** A refusal nobody has seen fall is a sentence.

## Considered Options

* **A version range**, spelled `node>=26` and compared against the runtime's own version.
* **A capability**, named from a closed vocabulary and looked for in the runtime.
* **Both**, a range for the runtimes that have one and a capability for the rest.

## Decision Outcome

### What the field expresses: a capability, and the measurement is what refuses the other two

**A version does not determine the capability, and it fails on one machine without leaving it.**
Measured at `7fcd444` on node v24.15.0, V8 13.6.233.17: plain, `Temporal` is `undefined`; under
`--harmony-temporal` it is an object of **eleven** own property names — `Calendar` and `TimeZone`
among them, the two the erratum removed. **One version, one machine, a flag apart, and the two answers
are *absent* and *present and not the language*.** No range separates them, because they are the same
version.

Across runtimes it is worse than imprecise, it is undefined: a browser carries Temporal and carries no
Node version at all, so a range is unaskable rather than merely wrong. The objection that a capability
might be the unverifiable one is answered the other way round — **a capability is checkable in the one
place that decides, which is the runtime that will run the code**, and it is one expression there.

**Both is refused for the reason `environments` was refused**: a field carrying two things is what
this unit exists instead of doing. If a future capability genuinely needs a version to be expressed,
that is a second member of the vocabulary and not a second shape of the field.

### Its stratum: `structural`, and the precedent is three blocks up in the same map

`FIELD_MAP` classes it `structural`, and the nearest precedent has the same mechanism:
`surface.exports[].parameters[].type` is structural because *a type it does not know stops the build by
name*. Here a capability the vocabulary does not know stops the **serialisation** by name, so a
contract carrying one cannot enter the catalogue at all. `environments[]` sits one line above at
`documentary` and cannot do that for any value whatsoever, which is the whole distance this unit
travelled.

**What the stratum does not reach is written into the map rather than smoothed.** Nothing checks that
a contract declaring nothing needs nothing — the omission is invisible, exactly as GS-11's is one axis
over. That claim is about a contract's own truthfulness, and what would refuse it is the contract's
harness failing on a runtime without the capability, which is `executable` and which no contract can
exercise today because none declares one.

### Who reads it, and what each of them refuses

**The registry refuses a word.** `requiredRuntimeOf` is called where `serialiseContract` reads the
export, and it refuses four things by name: a value that is not a list, an empty list, a word outside
the closed vocabulary, and a word named twice. `targetEnvironments` one line above is
`read<readonly string[]>(module, 'targetEnvironments')` — a cast, so no value is wrong.

**The client refuses a runtime.** `ServedIndexEntry` carries the field, so the installer reads it off
the document it already holds — the index is fetched before every query — and `prepareInstallation`
refuses before anything is fetched or written. **The refusal costs no round trip**, which is why the
field is projected onto the index rather than left for the contract's own snapshot, which nothing the
installer runs ever fetches.

**Three placements were decided rather than fallen into.** It is not inside `installable`, whose
sentence is *this is installable, or it never will be* — a fact about the catalogue, where a runtime
that lacks a capability today is not a permanent state. It is on `add` and not on `update`, because
this is the moment the catalogue would hand somebody a file their runtime cannot run for the first
time, and refusing an update would strand a reader who already holds the file. And what the runtime
carries is a **parameter** of `InstallRequest`, beside the instant and for the reason the instant is
one: `command.ts` states that everything this tool decides is reachable from a guard with no process
and no clock, and a reading of `globalThis` is ambient input.

### The reading is a shape and not a presence

`typeof Temporal !== 'undefined'` answers **yes** on the runtime serving the draft, so the reading is
the absence of the two names the erratum withdrew. `THE_READING_FOR` is keyed by the vocabulary, so a
capability added to the registry's union **does not compile** in the client until somebody has said how
a runtime is asked for it — which is the join that stops the field becoming a word nothing looks for.

### The reds, each on its own condition, before any green

Measured by restoring each defect one at a time and running the guard's own file:

| the defect put back | what reddened |
| --- | --- |
| the vocabulary check accepts any string | `a-runtime-capability-outside-the-vocabulary-is-refused-by-name`, **alone** — *expected undefined to be an instance of UnknownRuntimeCapability* |
| the empty list is admitted | `a-runtime-requirement-is-absent-rather-than-empty`, **alone** — *expected function to throw an error, but it didn't* |
| the requirement is dropped from the frozen half | `a-required-runtime-is-inside-the-digest-and-on-the-index`, **alone** — *expected [ … ] to include 'requiresOfTheRuntime'* |
| the key is written unconditionally | the **seven** rows of `a-contract-that-requires-nothing-freezes-no-such-field`, plus the guard above — *expected [ … ] to not include 'requiresOfTheRuntime'* |
| the reading becomes a presence | `a-runtime-serving-the-withdrawn-names-does-not-carry-temporal`, **alone** — *expected true to be false* |
| the installer stops reading the field | `an-install-is-refused-when-this-runtime-lacks-what-a-contract-requires`, **alone** — *expected false to be true* |

**The last row is the one the unit is about.** A field the installer stops reading is a field in
exactly the state `environments` has been in since it was written, and that guard reddening alone is
what says the reading is load-bearing rather than decorative.

### The cells, and the one that had to be re-spelled

`registry-storage` gains I-177 to I-180 and `cli-install` gains C-89 and C-90 — **the pins are the
measurement above rather than a judgement about it**, each written from the reds it produced.
`cli-update`, `cli-remove` and `cli-search` collect the two client guards and have no cell for them, so
each declares the region and names which cell of `cli-install` carries it.

**I-180 was written twice and the first spelling would have measured nothing.** The short edit turns
the condition into an always-true expression, and the compiler refuses it — `TS2872`, *this kind of
expression is always truthy* — so the cell would have come back `killed-by-typecheck`, which reads as
caught and detects nothing. The anchor is the whole spread instead, verified to compile and then
verified to redden the eight guards above.

## Consequences

**Nothing is published and no contract is written.** The vocabulary has one member, no contract of the
catalogue declares the field, the six published digests are where they were — the ledger reads 1 206
bytes and `18cc4e82…` on both sides of this unit — and `pnpm freeze` is green either side. The eighth
contract can now be published with its requirement inside its digest, which is the one thing that
cannot be done later.

**A reader who cannot run it is told so rather than being handed it.** The refusal names the contract,
the capability, what that capability means, and the one thing to do about it. **What it is honest
about is which runtime it read**: the client cannot see the runtime the installed source will run on,
only the one it stands in — the same proxy `npm` uses for `engines`, and for `npx toopo add` the
project's own.

**The schema demanded four things and the compiler named one of them.** `search.test.ts`'s declaration
keyed by `keyof ServedIndexEntry` refused to compile until the field was classed for the search — the
mechanism ADR-0155 built after a guard's population silently halved — and it is classed `null`, because
a capability is the registry's word rather than a phrase anybody would type. The other three were
guards rather than the compiler: a `FIELD_MAP` row, its `unfilledBecause`, and the path added to the
list `the-unfilled-fields-are-the-ones-that-were-argued-for` holds.

## What would reopen this

* **A second member of the vocabulary.** One member is what one contract needs, and the moment there
  are two the question of whether either needs a version to be expressed is asked again — as a member
  and never as a second shape of the field.
* **A contract declaring the field.** Every guard here is over a stand-in record and a wrapped index,
  because the catalogue declares nothing; the day one does, `a-contract-that-requires-nothing-freezes-no-such-field`
  loses a row and the `unfilledBecause` beside the `FIELD_MAP` entry goes stale, which
  `every-unfilled-field-is-justified` reddens on rather than tolerating.
* **A guard over whether a contract that declares nothing needs nothing**, which is the direction the
  stratum does not reach and which is `executable` rather than `structural` — it needs a harness run on
  a runtime lacking the capability, and neither leg of this repository's matrix is one.
* **A refusal that has to be overridden.** If a reader whose project targets another runtime is
  blocked by a client standing in this one, the sentence is wrong and the answer is a way to say which
  runtime is meant — not a weaker refusal.

## More Information

`WHAT_A_CAPABILITY_NEEDS` is prose keyed by the union, so a member added with no sentence does not
compile. It is prose and is not what makes the field structural: the refusal is.
