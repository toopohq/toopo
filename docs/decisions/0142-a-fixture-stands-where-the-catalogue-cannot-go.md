---
status: accepted
date: 2026-08-20
decision-makers: Mathis Perron
governs:
  - packages/registry/address.ts
  - packages/registry/imagined-addresses.ts
  - packages/registry/serialise.ts
  - packages/cli/imagined-source.ts
confirmed-by:
  - battery: registry-storage
    guard: every-address-a-fixture-stands-at-is-one-the-catalogue-refuses
  - battery: registry-storage
    guard: the-catalogue-refuses-a-contract-offered-at-an-address-a-fixture-stands-at
---

# A fixture stands where the catalogue cannot go

## Context and Problem Statement

The fixtures of this repository stood at addresses the catalogue could publish. Nine of them, measured
at `db2d236`: `number/round`, `string/pad`, `number/clamp`, `number/sign`, `text/left`, `text/right`,
`string/titlecase`, `number/rond` and `toy/thing`. Every one is two kebab-case segments, which is
exactly what `CONTRACT_NAME` accepts, so every one was a name a submission could be offered at and a
name this catalogue could decide to take.

It decided to take one. `number/round@1` is the sixth contract, and at the moment that was settled
three fixtures stood on it: the root of the imagined graph, the record `the-sixth-contract.test.ts`
writes by hand to ask whether the schema would accept a sixth, and the address every guard of
`packages/cli/` installs from.

**Nothing reported it.** There is no state where a check fails, no red, no drift: the collision is
found by somebody setting out to write the contract, and at that moment the choice is between renaming
forty files and publishing the contract at a name nobody chose. The failure has no event, which is why
it is worth a mechanism rather than a note.

### The population, and why the count is the argument for the mechanism

**Three successive sweeps of this repository counted six, then eight, then nine.** The first was a
hand-written list. The second found `text/left` and `text/right`, which the imagined graph holds as its
two independent carriers and which no test names in isolation. The third found `toy/thing`, written as
an object literal inside `rebuild.test.ts` for a repository built in a temporary directory. Nothing
about the three that were missed looked different from the six that were found.

**A sweep over the sources cannot stand in for a declaration, and that was measured rather than
assumed.** Matching the shape `CONTRACT_NAME` accepts against every quoted literal of every `.ts` file
returns `lib/toopo`, `packages/cli`, `application/json`, `vitest/config`, `app/toopo`, `arm/lens` and
`refs/tags` beside the real answers. The shape of an address and the shape of a path are one shape.
There is no reading of the text that separates them, so the population has to be a declaration and the
guard has to be total over *it*.

The reach, at `db2d236`: **532 occurrences across 40 files, of which 10 are records.**

### What made it urgent rather than tidy

`Math.clamp` is at stage 2 of TC39, championed by Oliver Medhurst, last presented at the 108th meeting
in May 2025. So `number/clamp` is an address the *language* is coming for — and permanent rule 7 would
refuse the contract on the day it lands, which means the fixture would be sitting on a name this
catalogue has to be able to say something about. A fixture in the way of a decision is worse than a
fixture in the way of a contract.

## Considered Options

- Leave the addresses where they are and rename when a collision actually happens.
- Give the fixtures addresses the *shape* refuses, so that `CONTRACT_NAME` itself keeps them out.
- Reserve one domain — `imagined` — and put every fixture inside it.
- Reserve a prefix on the *name* segment: `number/imagined-round`.
- Reserve a prefix on the *domain*: `imagined-number/round`.

## Decision Outcome

**A domain beginning with `imagined-` is a domain no contract may be published at, and every fixture of
this repository stands in one.** `THE_IMAGINED_DOMAIN_PREFIX` declares it in `packages/registry/address.ts`,
beside the shape rule it does not touch; `serialiseContract` refuses a contract offered at one;
`imagined-addresses.ts` declares the nine; and `imaginedSource()` refuses to serve an address that is
not one.

```
imagined-number/round      imagined-string/pad
imagined-number/clamp      imagined-string/titlecase
imagined-number/sign       imagined-text/left
imagined-number/rond       imagined-text/right
imagined-toy/thing
```

### Why a prefix on the domain, which is a measurement rather than a preference

**One reserved domain was refused because it would have deleted a measurement.** The imagined graph
exists to exercise a specifier of the form `../../<domain>/<name>/reference.js`, which is how a
published feature names another one — relative to the folder every contract of the catalogue sits in,
and therefore always two levels up. Six fixtures inside one reserved domain write `../<name>/reference.js`
instead: a shorter path, one level up, and the harder of the two shapes stops being written anywhere in
this repository. `packages/cli/` exists to measure what the installer does to that specifier. A prefix
keeps three imagined domains — `imagined-number`, `imagined-string`, `imagined-text` — and so keeps the
edge that crosses one.

It is visible in the bytes. An install of `imagined-number/round` writes **821 B against 794 B**, and
the difference is exactly **27 = 3 × 9**: three specifiers cross a domain and each gained the nine
characters of the prefix. Under one reserved domain those three specifiers would not have crossed
anything.

**A prefix on the name was refused because the domain is what the site's navigation is built on.**
`number/imagined-round` puts a fiction inside a domain a reader browses and a domain page lists; a
reserved domain is a folder nothing walks into.

**A shape the address rule refuses was refused because it would have broken the one suite whose subject
is admissibility.** `the-sixth-contract.test.ts` asserts `contractAddressFaults` is empty for the record
it writes; a malformed address would be refused there for the wrong reason, and the suite would stop
measuring what it exists to measure. The reservation therefore leaves the shape alone, and the guard
below asserts that it does — every imagined address is well formed *and* refused.

### Three doors, and the reason the refusal is not a convention

| Door | What it refuses | Where |
| --- | --- | --- |
| `serialiseContract` | a contract offered at an imagined address | `packages/registry/serialise.ts` |
| `indexEntryOf` | a fixture served at an address that is not imagined | `packages/cli/imagined-source.ts` |
| the guard pair | either half stopping | `packages/registry/imagined-addresses.test.ts` |

`serialiseContract` is the single door a folder becomes a served record through: the client's local
source, the site's, `local-read-api.ts` and `mutation/root-documents.ts` all arrive at it. Refusing
there is refusing everywhere, and it is what makes *the catalogue cannot admit this address* a fact
about the code rather than a sentence about intentions.

### Two guards, because either alone is decorative

**A guard asking whether an address begins with `imagined-`, on its own, is a guard over a convention
with a test in front of it** — nothing would refuse the prefix, so standing behind it would buy
nothing. **A guard asking whether `serialiseContract` refuses that prefix, on its own, defends a space
nobody stands in** — born green and staying green for ever. The first says *this is where the fixtures
are*; the second says *this is where the catalogue cannot go*; the reservation is the pair.

Both were seen red before either was believed, each on a condition that reddens no other.

`every-address-a-fixture-stands-at-is-one-the-catalogue-refuses`, with `PAD` put back at `string/pad`:

```
AssertionError: expected [ 'typescript/string/pad@1' ] to deeply equal []
+   "typescript/string/pad@1",
```

`the-catalogue-refuses-a-contract-offered-at-an-address-a-fixture-stands-at`, with the refusal removed
from `serialiseContract`:

```
AssertionError: expected function to throw an error, but it didn't
```

I-63 and I-64 are the two cells that hold them. I-63 is the mutant this whole record is about — a
fixture putting itself back at an admissible address — and it is written on
`A_NAME_THE_CATALOGUE_DOES_NOT_HOLD` rather than on the graph so that it reddens exactly one guard: the
graph's own address reaches a dozen digests and would name a dozen reds for one claim.

### The population the pair reaches, and the one it does not

The guard reads the *exports* of `imagined-addresses.ts` and asks each address in turn, so an address
added to that module enters the guard's population with nobody editing the guard. What it does not
reach is an address written as a bare literal somewhere else — a future test typing `'string/titlecase'`
into an expectation instead of taking it from the declaration. Nothing here catches that, for the
reason the sweep above could not be a guard: no reading of a string literal separates an address from a
path. It is on `CLAUDE.md`'s list of what this repository declares and nothing keeps, with what would
close it.

What lowers it from likely to unlikely is that the two never-held addresses are now *taken from the
declaration* rather than typed: `install.test.ts` builds both the argument and the expected refusal out
of `A_NAME_THE_CATALOGUE_DOES_NOT_HOLD.name`, and `remove.test.ts` out of `A_MISSPELLING_OF_ROUND.name`.
Writing a bare one is now a deviation rather than the path of least resistance.

## A rename may move a name; it may not move a reading

Ten records name one of the nine addresses. **Nine of them were renamed and one passage of the tenth
was not**, and the rule that separated them is worth more than the triage it settled:

> A rename can move a name. It cannot move a reading. The test is not *is this a record?* but **would
> replaying this produce this text?**

The precedent for the renaming half is this repository's own: ADR-0095 and ADR-0124 reissued 506
commits and defended it on the ground that *both moved every identifier and neither moved a single
tree, which is what made the stamped measurements survive as renames*. A measurement of a fixture
survives the fixture being renamed, because the thing measured is the same thing under a new name.

**Applying the test sharpened it, because it points in two directions.** For text this repository's own
fixture produced — ADR-0050's `toopo add imagined-number/round, depth 2` and the refusals quoted under
it, ADR-0037's reading of the carrier's lockfile entry, ADR-0069's edge naming one artefact and
carrying another's digest — *renaming is what restores reproducibility*. Replay them today and the
renamed text is what comes out; leave them and they name an address nothing holds.

For text produced by a probe **outside** this repository, it points the other way. ADR-0110's block

```
esm  ./string/pad.js  -> entry+helper
cjs  ./string/pad.cjs -> entry+helper
```

is node's answer about a scratch directory whose files the probe itself named, stamped *Taken on node
v24.15.0 … with `pad.ts` and `pad/digits.ts` in one directory*. Re-running it under any other pair of
names is a fresh reading, not this one. Renaming it would make it a transcript of a run nobody
performed. It is left as taken, with one paragraph beside it saying the date, what the address was then
and what it became — which is the danger this record is about, met on the far side: `string/pad` is
free now, and the day the catalogue publishes one, that block would read as though it were about it.

**The layout diagram in the same record went the other way, and the rename is a gain there rather than
a cost.** It showed `lib/toopo/string/slugify.ts` beside `lib/toopo/string/pad.ts`, one a published
contract and one a fixture, with nothing saying which was which. Renamed, it says.

## Two figures moved, and both were recomputed rather than transcribed

- The snapshot digest of `imagined-string/pad@1/reference@1.0.0` in `install.test.ts`, from
  `96474a49…` to `32dc2b46…`. An address is inside the snapshot it addresses, so renaming moves the
  digest. Recomputed by `digestOfSnapshot(implementationSnapshot(pad))` in a separate process before
  the suite was asked, so that the value written is not the value a failure printed.
- The installed cost in `report.test.ts`, from `794 B` to `821 B`, summed file by file independently
  and reconciled against the arithmetic above: 3 specifiers × 9 characters.

Both are transcriptions of the fixture's own arithmetic and both are left as transcriptions. Deriving
them in the test was considered and refused as outside this unit: a literal digest catches a change in
canonicalisation that a derived one cannot, and deciding what a guard pins is not a renaming's business.

## Consequences

Editing `imagined-addresses.ts` moves the address of a fixture, which moves the snapshot digests of
everything the graph publishes and therefore the two figures above. That is the bill for having one
declaration, and it is stated here rather than discovered.

`the-sixth-contract.test.ts` now writes its record at `imagined-number/round@1`, which is stronger than
what it had: the suite's own header says at length that the contract *does not exist and may never*,
and the address now says it too — at the exact moment the catalogue has decided to publish a contract
under the old name.

## What would reopen this

- **A fixture that genuinely needs an admissible address.** Nothing here does today: every one of the
  nine is a name over which nothing is claimed. A fixture whose subject *is* an address of the
  catalogue — a guard about a real contract's rendering, say — belongs at that address and outside this
  rule, and the rule would then need a declared exception rather than silence.
- **A second reserved space.** The prefix is one word. If a second kind of fixture ever wants a space
  of its own, the question is whether `isImagined` becomes a family or whether one word covers both,
  and the answer is not obvious from here.
- **A way to read this repository's own string literals.** The one hole the pair leaves is a bare
  address typed into a future test. The validation stage that four entries of `CLAUDE.md` already name
  is what would close it, and it would close this one on the way past.
