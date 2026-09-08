---
status: accepted
date: 2026-09-08
governs:
  - mutation/registry-storage.battery.ts
  - mutation/selection.ts
confirmed-by:
  - battery: meta
    guard: every-file-a-run-of-a-battery-reads-is-declared
---

# The battery expects the catalogue, and the disk is a proxy that parted from it

## Context and Problem Statement

`registry-storage` has refused at calibration since `cced79f`, and nothing said so. ADR-0253 found it
by paying a full replay for another question, named the cause, bounded the damage to one battery of
twenty-four, and did not repair it - because the repair is a choice between two predicates and the
battery's own comment had already argued one of them.

**The defect is one sentence.** `THE_CONTRACTS` is derived from the tracked folders under
`contracts/typescript/`, `onEach` spells one guard address per slug, and the registry suite expands
`it.each(eachContract)` over `theCatalogue`. Those agreed until a contract entered the repository
without entering the catalogue. `temporal/add` is seven files on disk and no row of the suite, so the
battery names addresses that resolve to nothing and `assertGuardsAreAddressed` refuses the run.

## Decision Drivers

* **The expectation must not be movable by what the battery measures.** That is the comment's own
  argument and it is why the disk is read at all: a list imported from `packages/registry/` is one a
  mutant of this battery could edit, and the expectation and the subject would be one object.
* **A red nothing selects is a red nobody reads.** The push that created it selected `meta` alone, and
  the four pushes after it selected nothing, so the only thing that would have reported it before a
  publication is `every-battery`.
* **The rows the expectation predicts are the catalogue's**, and the disk was only ever a proxy for
  them.

## Considered Options

* **`theCatalogue`, exactly** - refused by the comment: `packages/registry/the-catalogue.ts` is inside
  this battery's edit surface.
* **`packages/catalogue/every-contract.ts`** - outside the surface, and **it does not enumerate the
  contracts**: measured, nought occurrences of any contract address in it, its exports being
  `contractAnatomy`, the shared rules and the expectation helpers. There is no third place.
* **The tracked folders minus what `mutation/excluded-contracts.ts` declares** - taken.

## Decision Outcome

### The reason the predicate rests on, measured rather than reasoned

**`mutation/` is outside everything this battery edits.** `applyEdits` composes
`THE_REPOSITORY / contractPath / edit.file`, this battery's `contractPath` is `packages/registry`, and
its declarations name **25 files, nought of which carry a `/` or a `..`**. So no cell of this battery
can reach the declaration it now reads, and the comment's argument survives the subtraction whole.

**The property is a convention and not a mechanism, which is worth one sentence rather than a guard.**
`applyEdits` refuses no `..`, so a future edit could escape the folder by writing one. That is a
different entry from this one and it is not opened here; what is measured is that no edit does today.

### The red before the green, in the words it refuses in

Run on the tree as `a66f9a0` left it:

    calibration R/as-committed       control green (482 tests)
    Error: R/as-committed: this battery names guards that no guard of this run carries, so those
    addresses resolve to nothing.
      24 pinned by a cell, which disagrees under "no longer caught by" and sends a reader after a
      regression that never happened: …
      5 declared silent, which nothing reports at all: …

### The control, exact in both directions

The battery's own declarations were read back off the battery, with and without the subtraction:

| | cells | pin entries | declared entries | distinct addresses |
| --- | --- | --- | --- | --- |
| without the subtraction | 235 | **508** | **51** | 464 |
| with it | 235 | **484** | **46** | 435 |

**24 pin entries and 5 declared entries go, which is exactly what the refusal named**, and 29 distinct
addresses with them. **28 of the 29 end in `-temporal-add` and one does not** -
`the-call-of-temporal-add-is-read-from-its-own-signature` carries the slug in the middle, because
`perContract` lets a caller spell it anywhere. A suffix test would have reported 28 and looked right;
the figure that matches the refusal is the count of what disappears.

**The probe that produced the table was wrong twice before it was right, and both were silent.** It
read `mutant.expected.by` where `expected` is a `Record` keyed by `arm/lens`, and reported **0 pin
entries over 235 cells** - a plausible smaller number rather than an error. It then read
`unprobedRegions` and not `unreachableGuards`. Neither threw. The figure above is from the third
version, and what says it is faithful is that its two deltas are the refusal's own two numbers.

### The bill nobody had costed, which the instrument sent before any reader did

The import puts `mutation/excluded-contracts.ts` on the execution path of every battery, so
`every-file-a-run-of-a-battery-reads-is-declared` reddened at once and
`WHAT_A_RUN_OF_ANY_BATTERY_READS` goes from eight files to nine. **That is ADR-0149's pair working**:
the walk noticed the instrument reaching somewhere new before the declaration did.

**What it costs is that editing the exclusion declaration now selects all twenty-four batteries**, and
that is defensible rather than merely accepted: the declaration decides what a battery expects to
find, so a change to it is a change to an expectation. It is also rare - a contract entering or leaving
the suite - where `census.ts`, the one file of that list that deliberately selects nothing, moves
whenever a guard is added anywhere.

## Consequences

**`registry-storage` is green**, replayed whole on this machine rather than inferred.

**What the predicate does not reach is declared.** A folder the exclusion declares that exists and is
not two segments under `contracts/typescript/` yields no slug and subtracts nothing, silently. The
declaration's own guards already refuse a folder that is not in the tree, so what is left is a real
folder somewhere else - and a guard for it costs a census row and a cell of `meta` to answer for a
shape nobody has written.

**The two predicates are not the same claim, and today they agree.** *Excluded from the contracts'
suite* and *not in the catalogue* coincide on one folder; ADR-0250's own reopening names the day they
part, which is a contract entering the catalogue while excluded.

## What would reopen this

* **A contract in the catalogue and excluded from the suite**, which makes the proxy subtract a row the
  registry suite still expands - the one state in which this predicate is wrong in the other
  direction.
* **A second folder under `contracts/` that the catalogue does not hold**, which would make the
  subtraction carry a list rather than a folder.
* **An edit of this battery naming a path outside `packages/registry`**, which would take the
  comment's argument with it.
* **`the-catalogue.ts` ceasing to be inside this battery's edit surface**, which would make the exact
  reading available and this proxy unnecessary.

## More Information

ADR-0253 is where the red was found and bounded; this record is the repair it deliberately did not
take. The replay that closes it is `npm run battery registry-storage` on this machine, and its verdict
is in the commit that carries this record.
