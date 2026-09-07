---
status: accepted
date: 2026-09-07
governs:
  - mutation/census.ts
  - CLAUDE.md
confirmed-by:
  - battery: meta
    guard: every-contract-of-the-catalogue-is-collected-by-a-configuration-a-battery-reads
  - battery: meta
    guard: every-contract-file-the-census-names-is-one-the-catalogue-declares
---

# What answers for a contract, and why no double could carry the exclusion

## Context and Problem Statement

ADR-0249 gave a contract a word for what it needs of the runtime. The next question is what happens to
`npm test` when a contract needing a runtime this repository does not run on is in the tree:
`vitest.config.ts` collects `contracts/**/*.test.ts` as one glob, so such a contract reddens the
contracts' own suite on both legs of the matrix, for every contributor, on every supported runtime.

The obvious answer is to take it out of that glob and give it a configuration and a battery of its
own — machinery the instrument already has. **The unit was proposed as building that scope, with a
double standing in for the contract that does not exist yet.** This record tests that proposal before
building anything on it.

## Decision Drivers

* **A double is admissible only on the axis that decides the path**, which is ADR-0233's rule, written
  after a stand-in reproduced the property being reasoned about and not the property that decided.
* **A contract that leaves the glob and that nothing claims is the shape this repository refuses**
  everywhere else, and it had no keeper here.
* **An exclusion is a pair**: out of one glob, and into something that runs it. Half of a pair is not
  a smaller version of the pair.

## Considered Options

* Build the scope now, with a double naming a global neither leg carries.
* Build the accounting now, and leave the exclusion to the unit that has something to exclude.
* Build nothing and wait for the eighth contract.

## Decision Outcome

### The double is unnecessary for one half and insufficient for the other

**Two paths were separated before either was measured**, because *the scope* names both and they have
different deciders.

**The accounting** — *a contract's test files are collected by a configuration, and a battery reads
that configuration.* What decides it is three strings: the glob, a census key, and a battery's
`vitestConfig`. **No runtime appears anywhere in it.** So a double is not merely insufficient here, it
is **unnecessary**: the population is the catalogue itself, and the red is produced by perturbing the
census. That is the stronger of the two findings, because it is what makes the takeable half takeable.

**The exclusion being sound** — *a contract outside the contracts glob is one something actually runs.*
A double naming an absent global reproduces *outside the glob* and **cannot** reproduce *and something
runs it*, because by construction nothing can run it. Applied to ADR-0233's rule: the double is
faithful on the property being reasoned about and unfaithful on the property that decides.

**And the tell that record names is present.** A battery over such a double would report its suite
failing with a `ReferenceError` naming the global, the file and the line — a red that looks exactly
right, and that carries no sign that the mechanism under test was never shown to have a destination.
**A double excluded and run by nothing is the silent exclusion, built on purpose and then exempted**,
and the exemption is the list of things excused from having a subject that ADR-0197 refused to start.

### The pattern the proposal would have built already exists

`mutation/fixture` is a contract-shaped folder outside `contracts/**`, with its own
`vitest.config.ts`, its own census key and its own battery; `meta` is a second instance since
ADR-0246. So *a folder collected by a configuration of its own and measured by a battery of its own*
is not the thing to build — it is machinery in use, twice.

### What answers for a contract, and what reddens when nothing does

`mutation/census.test.ts` holds two guards, and their population is the catalogue rather than a
fixture.

**Every contract of the catalogue is collected by a configuration a battery reads.** Measured at
`eee980f`: **seven contracts, thirty declared test files, nought named by no census key, nought named
by more than one, and every census key read by at least one battery** — the contracts' own suite by
fourteen batteries, and each of the other seven configurations by between one and four.

**And every contract file the census names is one the catalogue declares**, which is the direction that
fails *open*: a row outliving its contract makes `assertTheCensusHolds` report `declared 8, collected
0`, and that reads as a suite that broke rather than as a row nobody removed.

**The two are a comparison and not a restatement.** The catalogue declares what a contract is made of,
`census.ts` declares what each configuration collects, `published.ts` declares which battery reads
which configuration, and nothing derives any of the three from the others — the shape
`visibility.test.ts` runs on one folder over. **No count is asserted**: `census.ts` argues at length
why its per-file integers are hand-written, and restating one here would be a second copy of an
integer that grows with the catalogue.

### The reds, before the green

| the defect | what reddened, and what it said |
| --- | --- |
| a census row deleted | `every-contract-of-the-catalogue-is-collected-by-a-configuration-a-battery-reads` — *…/profiles.test.ts: no configuration collects it* |
| a contract moved into a configuration of its own, with no battery reading it | the same guard — *…/profiles.test.ts: collected by `contracts/typescript/number/round/vitest.config.ts`, which no battery reads* |
| a row naming a file the catalogue does not declare | `every-contract-file-the-census-names-is-one-the-catalogue-declares` — *a census row that outlived the contract it counts* |

**The second row is the event this unit exists for**, and it is the one a deliberate exclusion
produces: the glob is narrowed, a configuration is written, and the battery is forgotten.

## Consequences

**The proposed decomposition is refuted in its second half and confirmed in a half it did not name.**
There was a separable, runtime-independent unit here, and it was the accounting rather than the scope;
what it needed was not a double but the catalogue.

**The exclusion is not takeable without the leg, and three facts say so rather than one.** An exclusion
whose destination is a configuration nothing runs is a permanently red column or a permanently excused
one — and the instrument has no way to route a battery to a runtime: `PlatformFamily` is the closed
union `'windows' | 'posix'`, the `batteries` job pins `node-version: '24'`, and *not measured on this
platform* is a bucket ADR-0169 emptied to nought. **So the exclusion and the leg are one thing.**

**And both are downstream of a contract that does not exist.** Nothing under `contracts/typescript/`
may pretend to be a contract of the catalogue, so there is nothing to exclude; the unit that excludes
is the unit that writes the eighth contract, or the one immediately after it.

**Nothing was excluded, no glob was narrowed and no configuration was added.** The ledger reads 1 206
bytes and `18cc4e82…` on both sides, `pnpm freeze` is green either side, and `vitest.config.ts` is
untouched.

## What would reopen this

* **The eighth contract.** The day one exists, the exclusion has a subject and the leg has a reason,
  and the guard added here is what refuses the half-done version of it.
* **A second configuration collecting `contracts/**`.** The first guard reports a file collected by
  more than one configuration, which is today unreachable and becomes reachable the moment the glob
  is split.
* **A routing axis wider than `PlatformFamily`.** The union is `'windows' | 'posix'`; a battery that
  could name a runtime is what makes an excluded contract measurable, and it would reopen the half of
  this record that says the two are one thing.
* **A contract file that is not a test file needing to be collected.** The guards range over
  `.test.ts` and `.test-d.ts` because those are what a configuration collects; a contract whose
  verification lived anywhere else would leave their population without moving them.

## More Information

The measurement that refuted the proposal cost no build: reading `theCatalogue`, `CENSUS` and
`THE_BATTERIES` against each other answers in under a second, and it is the same reading the first
guard now takes on every run.
