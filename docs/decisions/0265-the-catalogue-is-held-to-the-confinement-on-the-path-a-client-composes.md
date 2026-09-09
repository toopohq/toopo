---
status: accepted
date: 2026-09-09
governs:
  - packages/cli/plan.ts
  - mutation/registry-storage.battery.ts
  - CLAUDE.md
confirmed-by: []
---

# The catalogue is held to the confinement on the path a client composes, and no cell can witness it

> **Nothing is widened and nothing is published.** `A_PATH_INSIDE`, `A_DIRECTORY` and `staysInside`
> are read and left exactly as they were. `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing reaches npm,
> no digest is minted and no tag is posted. The ledger is `18cc4e82…` at 1 206 bytes either side and
> `pnpm freeze` is 3 passed either side.

## Context and Problem Statement

ADR-0206 states one alphabet for a path this tool writes, reads or removes. The catalogue states
another for what a contract folder may be called, and the second one is `readdirSync`. They agree
today by a literal: `referenceImplementationOf` filters an implementation's files to `reference.ts`,
so one spelling per contract reaches an install. **Nothing kept the agreement.**

The failure has no event and it is the expensive direction. A contract whose folder holds
`edge cases.ts` is served correctly, hashes correctly, and is refused at the moment somebody installs
it, with a sentence about a path being outside a directory which is true and is not the cause.

## Decision Drivers

* **The confinement sees what the client composes.** A guard reading the wrong population is green on
  a population that does not count, which is the class that let the disk and the catalogue diverge
  once already.
* **A floor is not repaired by lowering it.** A path this rule refuses is a finding, never a reason to
  widen the rule.
* **A guard needs a witness**, and where none exists that has to be said rather than manufactured.
* **A candidate whose plainest description names a neighbour has witnessed the neighbour** — A2, which
  is what decides the cell here.

## Declared or composed, measured

**Composed, and the code already said so.** `plan.ts` calls `staysInside(destinationOf(name, path))`
and carries the reason at the call site: *both halves of that composition are the registry's, so the
confinement is asked of the result rather than of either — a contract whose name left the directory
would satisfy a check written about the file name beside it.*

So the two populations are two different things, and only one of them counts:

| | count | refused by the confinement |
| --- | --- | --- |
| distinct file names the catalogue declares | 9 | 0 |
| shared harness files | 2 | 0 |
| **the two together, which is the entry's eleven** | **11** | 0 |
| **composed destinations, which is what the client writes** | **52** | **0** |

Eleven is a count of *names*. Fifty-two is the population. The guard reads the composed one, and it
composes with `destinationOf` imported from `plan.ts` rather than restated — a second expression here
would establish that two statements agree rather than that the catalogue's paths are writable.

**What reaches an install today is one spelling per contract**, `referenceImplementationOf` filtering
to `reference.ts`, so the guard reads the wider population deliberately: it is the one the day the
filter opens, which `plan.ts` already names as a unit of its own.

## Where it lives, and why the layering is not inverted

`packages/registry/against-the-catalogue.test.ts`, importing `staysInside` and `destinationOf` from
`packages/cli`.

**The product's layering is one-directional and stays so**: measured, `packages/registry` carries
**nought** imports of `packages/cli`. A *test* file is not the product — it is in nothing
`reachable.ts` walks — and this suite already imports `packages/validation` and the instrument, while
`packages/registry/shared-surface.test.ts` reaches `packaging/reachable.js` the same way.

The alternative was `packages/cli`, where the confinement lives. It was refused on the witness: a
guard there is collected by four batteries and owes four answers, and none of those batteries can edit
the catalogue, which is where the guard's own failure condition lives.

## The red, before the green

**Both conditions of the claim, each restored to the byte.**

| perturbation | what the guard said |
| --- | --- |
| `hashedFile` returning `path.replace('-', ' ')` | `typescript/number/parse@1 serves a path that would land at number/parse/edge cases.test.ts` |
| `destinationOf` composing `${name}/../${file}` | `… would land at number/parse/../contract.ts` |

The first is the entry's own example, arriving in the guard's own sentence. Then green: the registry
suite answers **487 of 487** where it answered 486.

## The cell, and why there is not one

**Three candidates were measured and all three fail A2.**

| candidate | reds | its plainest description |
| --- | --- | --- |
| `hashedFile` renaming a served path | **39 of 487** | *the registry announces a file under a name it does not have* |
| `destinationOf` leaving the folder | **78 of 199** | *an installed file lands outside the folder it was planned into* |
| `the-catalogue.ts` declaring `out come.ts` | **79 of 487** | *a contract declares a file its folder does not hold* |

The first names `a-blob-answer-hashes-to-its-address`'s claim, the second the plan's and the third
`harnessOf`'s, so each has witnessed a neighbour rather than this guard. All three are shared
mechanisms, which `mutation/mutants.ts` forbids aiming at, and the second is outside
`registry-storage`'s folder anyway.

**The asymmetry that makes a narrow aim impossible is structural.** `CONTRACT_NAME` is a strict subset
of `A_PATH_INSIDE`, so no contract *name* a mutant could write is refused; the only other input is a
file name, and it is either resolved through every digest or checked against the folder before
anything reads it. What would witness the guard is the event it exists for — a contract folder really
holding a refused name, declared **and** present — which is a rename on disk that no battery performs.

So the guard is declared under `unprobedRegions` on `registry-storage`, with the three figures and the
A2 reading beside it. **That is a measured declaration and not a shrug**: it names what would witness
it and why nothing here does.

### The instrument refuted this declaration once, and that is what shaped the guard

The declaration was written on two candidates I had thought of, and the battery answered with three I
had not: **`registry-storage` refused the run with *declared silent and a mutant reddened it***,
naming `I-125`, `I-126` and `I-127`.

**None of the three is about a path.** The guard read `serialiseContract(…).harness` in its first
shape, so it carried a dependency on the whole serialiser: `I-125` removes an empty-part filter in
`signature.ts`, `parametersOf` throws `UnreadableSignature`, and the guard went red on a stack trace
rather than on its own claim — with ten others, none of them about a path either. That is ADR-0168's
class, *a guard reddening on a mutant with no causal path to it*, and the accounting is what found it
where a reading had not.

**The repair is that the guard asks the declaration.** `harnessOf` returns `[...source.files].sort()`
hashed, so `record.harness`'s paths *are* the declaration sorted — the same fifty-two strings without
the serialiser behind them. Measured after: the same eleven-red tree gives ten, and this guard is not
among them.

**What that changes about the entry's own reasoning is worth keeping**: *no cell can reach it* was a
statement about the candidates somebody thought of, and the instrument answered with the population.

## Consequences

**The entry closes and its own arithmetic is corrected twice.** Its eleven is a count of names where
the population is fifty-two, and its *one expression over `theCatalogue`* is two, the composition
being the client's.

**What the guard does not cover is in its own header rather than smoothed.** The shared harness is
outside it, being what an auditor fetches and never what an install writes. It reads the contract's
harness rather than an implementation's, the two coinciding today. It is about a string and never
about a disk, so the link standing where a file goes — the half ADR-0206 measured and left open — is
invisible to it. And a path it refuses is a contract to rename or a finding to pose, never a rule to
widen.

**And `destinationOf` is exported**, which is one name leaving a module for one reader. The open list
carries an entry about an exported name nothing outside wants; this one is wanted by exactly one test
file and the alternative was a second copy of the composition.

## What would reopen this

* **A contract whose folder holds a file this refuses.** That is the event, and on that day the answer
  is a rename or a finding put to whoever owns the alphabet — never a widening.
* **The filter opening.** `referenceImplementationOf` filters to `reference.ts`; a folder arriving
  beside the entry makes the fifty-two the population an install really writes rather than the one it
  could.
* **A battery able to rename a file on disk.** That is what would witness this guard, and no battery
  does; one that could would take it out of the declared bucket.
* **`A_PATH_INSIDE` moving.** It is a floor and this guard reads it; a change there changes what the
  catalogue is held to, and the reading above would have to be taken again.

## More Information

ADR-0206 is the confinement and the two alphabets. ADR-0110 is the layout `destinationOf` composes.
ADR-0203 is *aim at a choice and never at a shared mechanism*. ADR-0211 is where candidates were
thrown away on A2. ADR-0076 is the line above which a pin names only what a mutant was written to
exercise.
