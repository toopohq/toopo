---
status: accepted
date: 2026-09-08
governs:
  - mutation/excluded-contracts.ts
  - CLAUDE.md
confirmed-by: []
---

# What a runtime carrying Temporal does to the suite

## Context and Problem Statement

`temporal/add@1` is in the tree and nothing here runs it. ADR-0252 excluded it in three places and
named what would lift the exclusion: a leg of the matrix carrying `Temporal` in the form the language
published. **A leg is a job, and a job is cheap to write and permanent to keep**, so the question that
decides whether to write one is asked before it is written rather than after.

**The unknown is one measurement and ADR-0251 is why it exists.** That record measured, on node 24,
that `ESNext.Temporal` is a real lib fragment `tsc` honours - exit 0 over the whole tree with a
Temporal probe under `contracts/` - and that the same widened lib **does not reach the suite**:
`npm run test` still reported `Cannot find namespace 'Temporal'`. Why vitest's typechecker did not
honour it was not established there, and is carried into `mutation/excluded-contracts.ts`'s own
`liftedBy` as the thing the leg unit would meet.

**If that holds on a runtime that carries Temporal, a Node 26 leg delivers nothing.** The contract's
`signature.test-d.ts` would not typecheck under the suite, the folder would stay as unmeasured as it is
today, and the repository would carry one more job for it. So the leg is not built until this is
measured.

## Decision Drivers

* **A green on an empty collection is not a green.** The exclusion is what stops the folder being
  collected, so a run that lifted it badly reports the same thirty files and 718 tests as one that
  did not lift it at all, and exits 0. The count is the reading.
* **The runtime has to be the language and not the draft.** ADR-0252 measured that the `Temporal`
  behind `--harmony-temporal` disagrees with the published language on `PlainYearMonth`, which is one
  of the three carriers this contract's arity rests on. A reading taken on a runtime carrying the
  draft would answer a different question.
* **`main` does not move for a measurement.** The job lives on a throwaway branch and the branch is
  deleted; what may reach `main` is this record.

## Considered Options

* **Build the leg and read the result** - refused: it makes the permanent change the way of asking
  whether the permanent change is worth making.
* **Reason it out of ADR-0251** - refused: that reading was taken on node 24, where the runtime half
  cannot be observed at all, and the typecheck half was published as measured rather than explained.
* **One job on a throwaway branch, node 26, lifting the exclusion for itself alone** - taken.

## Decision Outcome

### The criteria, written before the branch was pushed

The job runs on `ubuntu-latest` with `actions/setup-node` at node 26, lifts the exclusion in the three
places ADR-0251 named, widens `lib` with `ESNext.Temporal`, and runs `npm run test`. Each state is a
step of its own and prints its own exit code and vitest's own two summary lines, so that a reading is
never taken off a job's colour.

**The baseline this repository holds, and what the lift must move it to.** Measured at `cced79f`,
`npm run test` reports **30 test files and 718 tests** - 23 `.test.ts` collected by
`contracts/**/*.test.ts` and 7 `.test-d.ts` collected by the typecheck include, the folder of
`temporal/add` being excluded from both. Lifting the exclusion adds three `.test.ts` and one
`.test-d.ts`, so a run that really collected it reports **34 test files** and a test count **strictly
above 718**.

**What would make the whole reading void, checked first.** The job prints `process.version` and
`Object.getOwnPropertyNames(Temporal)`. The reading stands only if the runtime carries the
**published** shape: the specification's nine own names, with `Calendar` and `TimeZone` **absent** -
which is ADR-0215's own probe and the shape ADR-0220 read on 26.8.1. A runtime answering `undefined`,
or answering eleven names, answers a different question and the job says so rather than reporting a
verdict.

**Yes** - vitest typechecks and runs it. `npm run test` in the lifted, widened state exits **0**, the
summary reads **34 test files passed** with **more than 718 tests**, and vitest reports **no type
errors**. Any one of those three missing makes it a no, and the file count is the one that catches the
lift that did not take.

**No, it runs and does not typecheck.** The three `.test.ts` of the folder are collected and pass -
visible as **26 runtime files passing** - while type errors are reported against `signature.test-d.ts`
or arrive as *unhandled source errors* from `contract.ts` and `reference.ts`. This is the outcome
ADR-0251's reading predicts, and it is a finding rather than a failure: what it owes is the exact text
of the errors and a measurement of what would lift them.

**No, it does not run at all.** The runtime files fail - a `ReferenceError` naming the global would
mean the runtime is not what P0 said it was, and any other cause is reported as measured. Zero files
collected is this outcome and never the first.

### Two controls, so that neither answer can be an artefact of the harness

* **The unlifted state, on the same runner and the same node 26**: `npm run test` untouched must
  answer exactly **30 files and 718 tests, exit 0**. That is what says the harness works there at all,
  and it is also the second reading anybody has taken of this repository's own suite on node 26 -
  ADR-0220 took the first, on 26.8.1.
* **The lifted state with `lib` left at `ES2022`**: the run must report type errors naming `Temporal`.
  A state that typechecks clean there would mean the folder never entered the typechecker's project,
  and the widened-lib reading after it would be measuring nothing.

### The reading, and it is none of the three as they were written

Run `34201284476` on `d8a75da`, job `the-temporal-reading`, `ubuntu-latest`, **node v26.8.1**.

| | what it answered |
| --- | --- |
| **P0** the runtime | `typeof Temporal is object`; **nine** own names - `Duration Instant Now PlainDate PlainDateTime PlainMonthDay PlainTime PlainYearMonth ZonedDateTime` - `Calendar` and `TimeZone` **absent**. The published language. |
| **P1** control, nothing lifted | **exit 0**, `30 passed (30)` files, `718 passed (718)` tests, `no errors` |
| **P2** control, lifted, `lib` at ES2022 | exit 1, **34** files of which 2 failed, **831** tests of which 2 failed, `Type Errors 1 failed`, **40 errors** naming `Temporal` |
| **P3** the reading, lifted with `ESNext.Temporal` | exit 1, **34** files of which **1 failed**, **831** tests of which **1 failed**, **`Type Errors  no errors`** |
| **P4** `tsc -p tsconfig.json`, same state | **exit 0** |

**Both criteria for a lift that took are met**: 34 files where the baseline is 30, and 831 tests where
it is 718. And what the folder's own four files did is read off the run rather than off the totals:

    edge-cases.test.ts      96 tests   all pass
    profiles.test.ts         5 tests   all pass
    signature.test-d.ts      5 tests   all pass, typechecked
    properties.test.ts       7 tests   1 failed

**So vitest typechecks it and runs it.** `signature.test-d.ts` is collected as a type test and passes,
`Type Errors` reads `no errors`, and 112 of the folder's 113 tests are green on the language. The leg
delivers what a leg is for.

**And the criteria are not met on the letter, which is said here rather than rounded away.** *Yes* was
written as **exit 0** with 34 files, more than 718 tests and no type errors, and *any one of those
three missing makes it a no*. The exit code is **1**. The other three terms are all met, and both noes
are refuted by the same run - it typechecks, and it runs.

**What the criteria did not anticipate is a fourth state: the suite does its work and the contract
fails one of its own properties.** The three outcomes were written about vitest and about the runtime,
and every one of their subjects came back positive; the exit code that makes this run red is the
contract's and not the suite's. **Read against the question the leg unit has to answer - does vitest
typecheck and run this folder on a runtime carrying `Temporal` - the answer is yes**, and the honest
statement of it is that the criteria were about three ways of failing and the run found a fourth thing
that is not a failure of any of them.

### ADR-0251's clause is refuted, and the cause is measured rather than explained

That record published *vitest does not honour the project's `lib`*. It does. What does not survive a
widening is the **incremental cache its typechecker keeps**: vitest spawns
`tsc --noEmit --pretty false --incremental --tsBuildInfoFile <its own dist>/tsconfig.tmp.tsbuildinfo`,
read in the function that spawns the checker, so every run leaves that file behind and a `lib` widened
against one written under the narrower one is not honoured.

Measured on node v24.15.0 at `dc6d6f2`, three runs, nothing else moving:

| state | `Type Errors` |
| --- | --- |
| `lib: ["ES2022"]`, cold cache | 40 errors |
| `lib: ["ES2022", "ESNext.Temporal"]`, **cache kept** | 40 errors |
| the same widened `lib`, cache removed | **no errors** |

**And it reproduces on the runner**, which is P5 of the job: 40, 40, none, on ubuntu at node 26. Two
machines, two operating systems, two runtimes.

**What is not established is the mechanism inside TypeScript.** Going the other way - narrowing the
`lib` against a cache written under the wider one - *does* re-check, and so does adding files; only the
widening is missed. Why is not measured here and is not guessed at.

### What the leg found on its first run, which is worth more than the answer

`p5-a-unit-the-carrier-does-not-apply-is-refused` fails, on

    [() => Temporal.PlainTime.from("12:30:00"), {"milliseconds":-1,"hours":1}]
    AssertionError: expected 'out-of-range' to be null

**The property's own comment says *the bags drawn here never reach the range*, and that is false** -
not by magnitude but by **sign**. `aBag` draws each unit's count independently from
`fc.integer({ min: -3, max: 3 })`, so a bag of two or three units can carry mixed signs, and a
mixed-sign duration is not representable at all: `Temporal.Duration` requires one sign for every field.
`describeAddFailure` reaches its total `catch` around `carrier.add(...)` and calls that `out-of-range`.

**It is not a divergence between the draft and the language.** Measured on node v24.15.0 under
`--harmony-temporal`: the draft **throws `RangeError`** on `{hours: 1, milliseconds: -1}` and answers
`13:30:00.001` on `{hours: 1, milliseconds: 1}`. Both engines refuse mixed signs.

**What it is, is that the six properties had never been executed on any engine.** ADR-0252 says so in
its own words - the forty-**four cases** were replayed against the reference - and a property needs a
`Temporal` global, which no runtime here had. This run is their first execution, and it is the one
thing a leg buys that nothing else could.

**Two decisions it opens, both the owner's, both inside files a publication freezes.** Whether the
generator should refuse a mixed-sign bag, which is a statement about the property's population; and
whether the reference should answer `duration-not-read` - the reason the contract already declares for
a bag that is not a duration - where it now answers `out-of-range`. **The case table settles neither**:
no case is mixed-sign, and all ninety-six edge-case tests pass.

**And one sentence of ADR-0252 is narrowed rather than refuted.** *The reference decides applicability
from its own declared sets and never asks the engine* is exactly true of applicability, and the third
reason is the one that asks: `out-of-range` is reached by attempting the arithmetic. The forty-four
cases stand; what rested on the engine was never applicability.

### And a red on `main` that this branch's first push found by accident

**The first push of a branch selects every battery**, which is ADR-0169's own reading of the selection.
**The damage is bounded by that same run rather than estimated**: all twenty-four batteries were
selected and **twenty-three are green**, so `registry-storage` is the only one the eighth folder
reaches — and this is the full replay nobody had paid for since `cced79f`, arriving as the by-product
of a branch that existed to ask about a runtime. ADR-0169's *6 690 runner-seconds nobody wanted* is
the same replay wanted, once.

`batteries (registry-storage)` **failed at calibration in 21 seconds**, and it is `main`'s red rather
than the branch's - reproduced locally in the same words, in seconds, at this branch's tip:

> `R/as-committed`: this battery names guards that no guard of this run carries, so those addresses
> resolve to nothing. **24 pinned by a cell** … **5 declared silent**

**Every one of the twenty-nine names ends in `-temporal-add`.** `THE_CONTRACTS` in
`mutation/registry-storage.battery.ts` is derived from the **tracked folders** under
`contracts/typescript/`, and deliberately: its own comment argues that a list imported from
`packages/registry` would be one a mutant of this battery could move, so the expectation and the
subject would be one object. `temporal/add` is a folder on disk the catalogue does not hold, so
`onEach` spells eight names per family where the suite collects seven rows.

**ADR-0252 wrote that a contract in the tree and not in the catalogue is outside every population by
construction, and this is the population that is not.** It is read off the disk, which is what makes it
un-perturbable and what makes it see a folder the catalogue does not.

**That it is `main`'s and not the branch's is a diff rather than an argument**: between `cced79f` and
this branch's tip, `git diff --name-only` names six files, of which none is under `contracts/` and none
is under `packages/`, and `mutation/registry-storage.battery.ts` is byte-identical. `THE_CONTRACTS` is
therefore the same set on both, and the folder it sees was tracked at `cced79f`.

**Nothing said so, and the selection is what says why**: the push of `cced79f` selected **1 of 24** -
`meta` - and printed **12 changed file(s) no battery answers for**. The gap was printed, and this is
what it was worth. **It is an interval rather than a breach**: `every-battery` is gated on
`unpublished == 'true'` and `publish` waits for it, so the next publication refuses before
`npm publish`.

**The reading that would have caught it in 185 ms exists, and it was not taken.** `npm run predict` is
what ADR-0221 built for exactly this - *would a replay refuse* - and run on this working copy it
answers **22 fault(s) a replay would refuse on, 0 question(s) this reading could not ask**, every one
of them `R/as-committed` and every one naming a `-temporal-add` address. It has answered that since
`cced79f`.

**It is not a job and cannot become one as things stand**, which is the half worth writing down:
`mutation/results/` is gitignored - `.gitignore` carries the reason, that keeping the measurement as
well would put one claim in two places that can drift - so a runner reads nothing and `predict` on a
fresh clone answers *no measurement of this battery is on disk* twenty-four times, correctly. ADR-0238
says so. What is missing is therefore a **convention** and not a mechanism: a unit that moves a
battery's population runs it before pushing, and this one moved a battery's population without touching
that battery's folder.

**It is not repaired here.** This unit's constraint is that `main` carries the record and nothing else,
and the repair is a choice between two predicates that the battery's own comment already argued -
subtract `mutation/excluded-contracts.ts`'s declared folders from the disk walk, which is outside this
battery's edit surface so the argument survives, or read the catalogue from a module outside
`packages/registry`. One import and one filter either way; what is undecided is which predicate the
expectation is about, and ADR-0250's own reopening names the day *excluded from the suite* and *not in
the catalogue* part.

### What a permanent leg would meet, costed and not taken

**Routing a battery to a runtime is not owed today and cannot be paid today.**
`every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` is bidirectional over
the batteries whose `contractPath` is under `contracts/`: a battery naming a folder no contract of the
**catalogue** owns reddens its first arm. So a `temporal-add` battery is **forbidden** while the
contract is outside the catalogue, and **required** the moment it enters - both arms flip at
publication, which is ADR-0143's mechanism arriving on the eighth contract.

**What makes the routing load-bearing rather than cosmetic is calibration.** A battery calibrates
against its own suite's control on its own machine, and measured at node v24.15.0 the lifted contracts
suite is **98 failed of 831** on `ReferenceError: Temporal is not defined`. A `temporal-add` battery in
today's `batteries` job would come back with a red control, which is the instrument unable to run
rather than a verdict - ADR-0199's class.

**What the axis would cost, read off what exists.** The instrument's only axis is
`OnlyOnePlatform { family: 'windows' | 'posix' }`, **per cell**, and its own comment says the split is
total by construction and that a third value would be a family nobody has a rule for. A runtime is not
a family, and what a Temporal battery needs is per **battery** rather than per cell - every cell of it
needs the runtime. The pipeline to copy exists and is four steps: a field, a projection beside
`whereThePlatformDecides` in `published.ts`, a selector beside `batteriesWhereThePlatformDecides` in
`selection.ts`, and a matrix. **A sibling job and not a leg of the matrix**, for ADR-0169's measured
reason: `needs` waits for every leg, so a leg puts its whole duration on the critical path of every
push. And the runtime is typed **nine times** as `node-version: '24'` in `suites.yml` beside the one
matrix term, so the number of places that would learn a second runtime is read rather than guessed.

### What a new job of `suites.yml` meets, measured

`mutation/workflows.test.ts` carries twelve guards. A new job meets **four**, and three demanded
something:

| guard | what it demanded |
| --- | --- |
| `every-job-of-a-workflow-is-one-its-last-gate-waits-for` | the job in `every-job-answered`'s `needs` |
| `every-action-a-workflow-uses-is-pinned-to-a-digest` | the three `uses:` as 40-hex digests |
| `every-pinned-action-says-which-version-it-was-pinned-at` | a version comment beside each digest |
| `there-is-a-workflow-to-sweep-and-it-uses-something` | nothing; it stays green |

**The first was seen red rather than reasoned about**: with the job removed from that `needs` line and
nothing else changed, the file reports **1 failed of 12**, naming
`suites.yml: every-job-answered does not wait for the-temporal-reading`, and 12 of 12 with it back.

**The other eight are not met, and the reason is their populations rather than luck.** Five are built
by looking for a job whose text matches `npm publish`; one sweeps whole files for an identity token and
would fire the moment a new job granted itself one; one sweeps for a long-lived npm credential; and one
is about the gate rather than about any job beside it.

## Consequences

**The leg is worth building and this record does not build it.** What it buys is measured: the type
half passes whole - five type tests and no type errors - and the runtime half runs **107 of its 108
tests**, failing the one that had never been executed anywhere.

**ADR-0251 carries a head note**, `mutation/excluded-contracts.ts`'s `liftedBy` is rewritten from this
reading, and `CLAUDE.md`'s clause is corrected in place. **The record opened declaring that it ruled no
code**, on the ground that a reading changes no line either way; it rules two files, because the
reading refuted a published sentence rather than only answering a question.

**`main` carries a red battery**, named above, with its cause measured and its two repairs costed.

**Nothing is published.** `THE_PACKAGE_VERSION` is 1.2.0, the ledger reads 1 206 bytes and
`18cc4e82…`, `pnpm freeze` is green, and `theCatalogue` still does not name the contract.

## What would reopen this

* **A vitest release changing how its typechecker is spawned.** The measurement is of one version's
  behaviour, and `package.json` pins the major rather than the release. The cache above is the term
  that would move first.
* **A third engine disagreeing about `PlainYearMonth`**, which would reopen the contract's arity
  before it reopened anything about a leg.
* **The contract entering the catalogue**, at which point what answers for it stops being a leg and
  becomes ADR-0250's guard - and a battery stops being forbidden and starts being owed.
* **A ruling on the mixed-sign bag**, which is a decision inside `contract.ts` and `reference.ts` and
  therefore has to be taken before a digest is minted or never.
* **A second folder under `contracts/` that the catalogue does not hold**, which would make the red
  above a class rather than an instance.

## More Information

The branch carrying the job is a throwaway and is deleted once the run is read. `main` carries no job
for this reading and never did.
