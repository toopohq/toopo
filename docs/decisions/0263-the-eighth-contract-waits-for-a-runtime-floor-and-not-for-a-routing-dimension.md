---
status: accepted
date: 2026-09-09
governs:
  - mutation/excluded-contracts.ts
  - packages/registry/local-read-api.ts
  - tsconfig.json
  - CLAUDE.md
confirmed-by: []
---

# The eighth contract waits for a runtime floor, and not for a routing dimension

> **Nothing enters the catalogue here.** No battery, no routing job, no widening of the root `lib`,
> no change to `suites.yml`, to `engines`, to the floor or to any bound. `THE_PACKAGE_VERSION` stays
> at `1.2.0`, nothing reaches npm, no digest is minted and no tag is posted. The ledger is
> `18cc4e82…` at 1 206 bytes either side and `pnpm freeze` is 3 passed either side.

## Context and Problem Statement

`temporal/add@1` has been in the tree since ADR-0252: seven files under
`contracts/typescript/temporal/add/`, declared in `mutation/excluded-contracts.ts`, excluded from the
contracts' own suite in three places, and in no catalogue. ADR-0259 gave it a job so that something
executes it. What was left was the entry, which ADR-0143 and ADR-0144 make the same act as
publication for every contract before it and which ADR-0261 has since separated: a contract entering
as `not-yet-published` mints a binding and takes the stand-in revision, so nothing is frozen for
life.

That separation is what made the entry look takeable without an arbitration. **It is not, and the
reason is a chain rather than a preference.** This record is that chain, measured, and the ruling
taken on it.

## Decision Drivers

* **A commit is green or it does not exist.** The invariant admits no red commit, so every link of
  the chain has to be satisfied at once or the entry does not land at all.
* **A dimension added to the instrument is permanent.** `PlatformFamily` has been two values since
  ADR-0147 and the split is total by construction; a runtime is not a platform, so routing a battery
  to one is a new axis rather than a third value of that union.
* **A guard is not narrowed to fit a unit.** ADR-0017 forbids an address that over-reads, which is
  what decides how the four guards assuming `not-yet-published` uninhabited are repaired.
* **A pin is checked against the run that wrote it.** A cell whose verdict nobody has seen is a pin
  checked against nothing, which is the shape this repository exists not to publish.

## Considered Options

1. **Build the routing dimension and enter now.** A sibling job on node 26, a projection over the
   single declaration, a new field or a new axis on `Battery`.
2. **Enter without a battery.** Refused by construction rather than by taste, and the measurement is
   below: `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` is
   bidirectional.
3. **Wait for the runtime floor.** The exclusion, the routing and the entry are all downstream of
   one fact, which is that `batteries` pins `node-version: '24'`.

## The chain, measured rather than assumed

Every link was measured at `3e530f7` on node v24.15.0 with `tsc` 7.0.2.

| what forces | what is forced | the measurement |
| --- | --- | --- |
| the catalogue naming the folder | `ESNext.Temporal` in the root `lib` | the root project follows the import and answers **six `TS2503`**; with the fragment it is **exit 0** |
| the catalogue naming the folder | a battery injecting into the folder | the bidirectional guard forbids one before the entry and requires one at it |
| the battery | a runtime carrying `Temporal` | the folder's own suite on node 24 answers **106 failed of 122**, with `Type Errors no errors` |

**The link that had never been written down is the third row of the folder itself.** All three
non-test modules import cleanly on a runtime with no `Temporal`: `contract.ts` 11 exports,
`edge-cases.ts` 2, `reference.ts` 2. The global is named there only in type position, which is
erased, or inside strings. So the *catalogue* can hold this contract on both legs of the matrix, and
what needs the runtime is the folder's own four test files and nothing else. Had that gone the other
way the entry would have been impossible rather than merely blocked, and no record said which.

### `exclude` does not filter a dependency, which is the correction this unit owes

`tsconfig.json` carries the third place an exclusion lives, and ADR-0251 measured that without it the
suite is red at exit 1 with every test passing. **What that measurement establishes is narrower than
what it has been read as.** `exclude` filters the project's *root file set*; a file an included file
imports is pulled in as a dependency and typechecked whatever `exclude` says.

Measured by putting one throwaway import into `packages/registry/the-catalogue.ts` and running the
root project: **six `TS2503` inside `contracts/typescript/temporal/add/contract.ts`**, from a project
that excludes that folder by name. The reason it reaches there at all is that `mutation/census.test.ts`
and `mutation/root-documents.ts` both import `theCatalogue`, and `mutation` is in the root project's
`include` — so `npm test`'s own typechecker follows the import on both legs.

So the entry forces the widening, and the widening is not a tidy-up that could land first: today the
root's `ES2022` is the only thing that would redden a *new* contract naming `Temporal` without being
excluded, and removing it before its user arrives is a loosening with nothing behind it. What would
replace it is a declared rule rather than a compiler's accident — every contract declaring
`requiresOfTheRuntime` is one the suite excludes, and every excluded folder is a contract that
declares one — and writing that first would be two mechanisms over one fault, which `mutation/run.ts`
already refuses in as many words.

## Decision Outcome

**The entry waits for the floor, and the routing is never built.**

The owner's ruling is that the routing is machinery that expires. It exists only because `batteries`
pins `node-version: '24'`; when the floor reaches Node 26 the exclusion has no subject, this contract
runs on the ordinary legs, and a battery over it is the twenty-fifth rather than a special case. A
permanent axis in the instrument is not built to cover a window.

**The sequence is what carries the ruling rather than contradicting it.** The chain above was
established before the ruling and it is what the ruling is taken on: the entry forces the battery,
the battery forces the routing, and the routing is the thing that expires. Nothing about the chain is
wrong; it is the chain that says wait.

## What the entry will cost when it is taken

Five bills, each priced here so that none is rediscovered.

**One, the battery.** Due at the instant of entry by the bidirectional guard, and inexecutable
without a runtime carrying `Temporal`. The folder collects **22 guards**, counted by
`guardsCollectedIn` rather than by a pattern.

**Two, `THE_CONTRACTS`.** `mutation/registry-storage.battery.ts` derives it from the tracked contract
folders minus what `mutation/excluded-contracts.ts` declares, and ADR-0254's subtraction was exact
for the window this entry closes. The correction is to remove it. What the entry adds to that suite
is **35 guard addresses**: `packages/registry` carries 35 `it.each(eachContract)` blocks and 35
titles ending in `-%s`, two readings agreeing. ADR-0254's **29** is a different population, being
what the battery *names* — 24 pin entries and 5 declarations — and not what the suite collects.

**Three, the four guards that assume the state uninhabited.** The bill is **21 and not 41**, which
`packages/registry/local-read-api.ts` already carries: only the anchoring pair encodes its claim in
its address, so ADR-0017 makes that repair a rename, where the two site guards are repaired inside
their own bodies and cost no address at all.

**Four, the census.** Eleven rows and the replay they demand.

**Five, the sentences.** Twenty-eight present-tense claims the eighth falsifies, named below.

## Why the freeze stays green, read rather than deduced

The ledger gains **two lines and not one**. The arm that mints for `not-yet-published` is
`publishImplementation(publishContract(...))`, so a contract binding at `typescript/temporal/add@1`
and an implementation binding at `typescript/temporal/add@1/reference@1.0.0`.

**The arithmetic is exact before any digest is known.** A line is its address, a tab, 64 hexadecimal
digits and a newline. The twelve of today are `414 + 12 × 66 = 1 206` bytes, where 414 is the sum of
the twelve addresses; the two new lines are `25 + 66 = 91` and `41 + 66 = 107`.

| | today | after the entry |
| --- | --- | --- |
| lines | 12 | 14 |
| bytes | 1 206 | **1 404** |

**Of the three guards of `against-what-was-published/the-freeze.test.ts`, exactly one reddens**, and
that is read off the two functions rather than inferred. `rebindingFaults` rebuilds and
`misdatedBindings` dates, and both open by filtering `everyBinding(ledger)` on `isAnchored`, which
puts the stand-in revision's forty zeros outside them. `nothing-this-tree-binds-escapes-the-freeze-check`
asserts that the same filter finds nothing, and it is the only one an unanchored binding falsifies.

So the freeze stays green on the rename of that one guard, and the rename makes it **stronger**
rather than weaker: the claim goes from *no binding is unanchored* to *every unanchored binding is
one this catalogue declares unpublished*, exact in both directions on ADR-0176's shape, so a binding
nobody declared cannot arrive in silence.

## The count of the catalogue, taken from the object

`theCatalogue.length` is **7**, six `published` and one `never-published`.

**The pattern is why the count had to come from the object.** A wide shape —
`\b(one|two|…)\s+contracts?\b` — answers **647 occurrences over 211 files**, and almost all of it is
`one contract` used as an article. Narrowed to a number the whole set could be, qualified as the set,
outside `docs/decisions/` because a record is stamped and sweeping one would falsify it: **90
occurrences over 30 files**, read one at a time.

* **28** are present-tense claims the eighth contract falsifies. They are not touched: correcting
  them today would make them false, and they belong to the commit that enters.
* **3 were false already**, having expired at `object/deep-equal@1`'s publication with nothing
  pointing at them. They are repaired at `7461080`, which is this unit's only change to the tree.

The three are `packages/registry/contract-record.ts` reading *Five of the six contracts are
published*, `packages/registry/snapshot.ts` reading *which is five of its six contracts*, and
`CLAUDE.md` reading *would refuse all seven published contracts*. Two carried a count their argument
never needed and lost it; one carries the measured pair with a note saying which unit falsified it.

## The red the full replay found, which is ADR-0261's bill on a second battery

Editing `mutation/excluded-contracts.ts` puts it on every battery's execution path, so this record's
own commit selects **24 of 24** — ADR-0254's consequence working as written. That replay took **94
min 58 s** and came back with **one battery disagreeing: `cli-install`**.

**The red is on `main` and nothing had selected it**, which is measured rather than argued:
`packages/cli/` and `mutation/cli-install.battery.ts` are byte-identical since `07a60e7`, and that
commit moved `packages/registry/response.ts` alone. So this is exactly ADR-0262's `site` finding on a
second battery, and **ADR-0261's bill was two batteries rather than one** — the earlier unit reached
only `site` because that is what its own diff selected.

**`C-17` publishes the contract the catalogue refused, and that no longer offers it.** The cell takes
the refusal arm out and publishes with `record.lifecycle`, which reads `never-published`; since
`installable` follows the lifecycle, a binding carrying that standing is not installable whoever
minted it. So two of its pinned guards stopped reddening and three guards were left witnessed by
nothing: `the-catalogue-lists-every-contract-and-marks-the-one-it-refuses`,
`a-refused-contract-is-offered-no-install-line` and
`a-refused-contract-is-in-the-index-and-is-not-installable`.

**The repair is a re-aiming of the reading and an addition.** `C-17` keeps its edit and is pinned to
the one guard it reddens, `search-decides-the-same-thing-against-the-emitted-tree`, which it is alone
on. `C-91` is written for the rest, and it is **not `C-17` rewritten**: that cell removes the
refusal, this one keeps it and publishes beside it with a standing that says `published`. Before
ADR-0261 those were one defect; after it they are two, which is the finding stated as a cell.

**Measured by hand before either pin was written**, the edit applied to `packages/cli/local-source.ts`
and the suite run the way the battery runs it: **5 failed of 199** over 23 files, naming the three
guards nothing was reddening plus the two `C-17` stopped reddening. Five is ADR-0076's line exactly,
so the pin names all five. **The refusal is kept rather than replaced for a measured reason**:
`refuseContract` is called once in that file, so removing the call orphans its import and
`noUnusedLocals` turns the cell into a `killed-by-typecheck`, which is the compiler detecting where a
guard should.

The cell moves what the instrument declares about itself, so the README's three figures go **1028 →
1029** cells and **986 → 987** caught, named by
`every-figure-in-the-readme-is-the-one-the-instrument-declares` rather than by anybody remembering.

## Consequences

**What is bought is a dossier and a repair.** The chain is written where somebody meets it, the four
prices are stated with their populations, and three sentences a reader could have believed are
correct. What is not bought is the eighth contract, and the record says so rather than implying
progress.

**What it costs is a window in which the tree holds a contract nothing publishes.** That was already
true and this record does not change it; what changes is that the reason is one fact — the floor —
rather than four open questions.

**And a claim of ADR-0251 is narrowed rather than refuted.** That record's three places are all real
and all needed; what is corrected is a reading of the third, which stops a folder being a *root file*
and never stops it being typechecked as a dependency. The distinction has no instance while nothing
imports the folder, and it has one the moment the catalogue does.

## What would reopen this

* **The floor reaching a runtime that carries `Temporal` in the form the language published.** That
  is the event this record waits for, and on that day the exclusion has no subject, the routing has
  no reason to exist, and the chain above collapses to an ordinary entry.
* **A second contract needing a capability the floor does not carry.** Two inhabitants make the
  exclusion a population rather than a case, and the trade between waiting and routing is taken again
  against a different arithmetic.
* **The bidirectional guard changing shape.** The chain's second link is that guard; anything that
  moves it moves the sequence, and the sequence is what this ruling rests on.

## More Information

ADR-0251 is the exclusion in three places and the order that holds. ADR-0252 is the contract in the
tree. ADR-0253 is the leg read before anybody built one. ADR-0254 is the subtraction this entry
removes. ADR-0259 is the job that runs the folder. ADR-0260 and ADR-0261 are the third lifecycle path
and the binding without an anchor. ADR-0262 is where the four guards' real bill of 21 was measured.
