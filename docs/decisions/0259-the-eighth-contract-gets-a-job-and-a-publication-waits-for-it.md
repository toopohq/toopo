---
status: accepted
date: 2026-09-08
governs:
  - .github/workflows/suites.yml
  - excluded-contracts.vitest.config.ts
confirmed-by:
  - battery: meta
    guard: every-job-of-a-workflow-is-one-its-last-gate-waits-for
---

# The eighth contract gets a job, and a publication waits for it

## Context and Problem Statement

`contracts/typescript/temporal/add` has been in this repository since ADR-0252 and nothing has ever
executed it. It is excluded from `npm test` on both legs and from the typechecker's project, it is in
no catalogue so no battery may inject into it, and `files: ["dist"]` keeps it out of the archive.
ADR-0253 ran it once on a throwaway branch and deleted the branch.

**What separates a probe from a job is not that it runs.** A probe runs and goes; a job is answered
for, its exclusion is lifted from the declaration rather than beside it, and something decides whether
the irreversible act waits for it. Those three are this unit.

## Decision Drivers

* **`needs` waits for every leg of a matrix, and two jobs wait on `suites`.** Whatever this job costs,
  a matrix entry would charge it to every push.
* **An exclusion is declared once and derived everywhere**, which is the rule `vitest.config.ts` and
  `tsconfig.json` already live under. A second door that repeats the folder is a second door to
  forget.
* **A publication freezes a commit**, not only an archive: it mints a provenance naming
  `refs/heads/main` and a `gitHead`.

## Considered Options

* A third leg of the `suites` matrix at node 26.
* A sibling job, waited for by the last gate only.
* A sibling job, waited for by the publication as well.

## Decision Outcome

**A sibling job, and the publication waits for it.**

### Sibling and not a leg, for a measured reason and a structural one

`site` and `batteries` both wait for `suites`, and `needs` waits for **every** leg — so a third leg
puts its whole duration on the critical path of every push, including the prose pushes that select no
battery at all. **ADR-0169 measured that at 132 s** when the Windows suites were the candidate, and
took the sibling for exactly this reason.

**The second reason is this job's own and no matrix entry could carry it.** The legs run *one*
configuration on two runtimes. This runs a *different* configuration — `excluded-contracts.vitest.config.ts`,
which collects only what the root one excludes. A matrix entry would have run all eight suites on node
26 to reach one folder.

### The exclusion is lifted from the declaration, and the fourth place is a negation rather than a copy

`THE_FOLDERS_THIS_SUITE_DOES_NOT_RUN` is the source. The new configuration computes both its `include`
and its `typecheck.include` from it, so a second contract excluded tomorrow is collected here with
nobody editing that file — and a folder excluded from `npm test` and forgotten here would be a
contract that runs nowhere at all.

**The typechecker's project needed care, because `tsconfig.json` is the one place that repeats.**
Vitest typechecks the *project* and spawns `tsc` with `-p` only when `typecheck.tsconfig` is set —
ADR-0253's measurement — so without that field the compiler would read the root project, which
excludes these folders and whose `lib` has no `ESNext.Temporal`. `tsconfig.excluded-contracts.json`
**names no folder**: it extends the root, widens `lib`, and sets `exclude: []`. The declaration
reaches it by emptying the root's exclusion rather than by a fourth transcription, so it needs no
guard and cannot drift.

### The guard was seen red before it was seen green

With the job written and left out of the last gate's `needs`:

    every-job-of-a-workflow-is-one-its-last-gate-waits-for — 1 failed | 11 passed (12)
    suites.yml: every-job-answered does not wait for excluded-contracts

Named, not counted. With the job added to that list: **12 of 12**.

### A publication waits for it, and the resemblance is not the argument

`publish` already waits for `every-battery` and `every-battery-on-windows`, and its own comment gives
the reason: *a replay that runs somewhere no other job can measure is exactly the replay a publication
must not go without*. **That resemblance is not why this job is in the list**, and saying so is what
keeps the reason from being a copy.

Those two carry `publish`'s own condition, so waiting on them costs nothing and they are skipped
together; this one has no condition and runs on every push. And they replay over code that reaches the
archive, where this folder reaches none: no catalogue, so no snapshot, no binding, no served address,
and `files: ["dist"]` keeps `contracts/` out of the tarball.

**The argument is the chain and the hole in it.** `publish → site → suites` already puts every suite
this repository runs in front of the irreversible act. This job runs the one suite that chain does not
reach. A publication mints a provenance naming `refs/heads/main` and a `gitHead`, so it freezes what a
commit says about itself — and leaving one contract folder of that commit unmeasured in front of the
act is the single gap in an ordering that is otherwise total.

**It is named in `publish`'s `needs` and not in `site`'s, where the Windows leg is, and the difference
is exact.** That line exists because *nothing is deployed from a tree whose Windows suites are red* —
a claim about what the deployment runs. This folder is in no catalogue, so the deployment does not
carry it and that claim does not reach it. What does reach it is that a publication freezes a commit.

The cost is nil: the job runs beside `every-battery`, which is forty minutes where this is about one.

### The bound is typed and says so

`timeout-minutes: 15`, a hang detector and not a budget. There is no reading of this job to derive one
from — the run carrying the line is the first — and it is said out loud so the number is not read as
measured. `suites-on-windows` holds the same stance one job up for the same reason.

### What is not kept, priced rather than left to be discovered

**Nothing requires that any job run this configuration.** The configuration derives its population
from the declaration and cannot drift from it; what nothing keeps is that a job exists to run the
configuration at all, so deleting the job leaves the eighth contract exactly where it was — excluded
everywhere, executed nowhere, with every suite green.

A guard is expressible from helpers `workflows.test.ts` already has: some job of this workflow runs the
script that names this configuration. **It is not self-comparing** — the workflow is text and the
configuration is a value — which is what separates it from a guard over the derived `include`, and
that one is refused as `GUARD_PERTURBATION_RULE`. **Priced at one guard, one census row and the meta
battery's `unreachableGuards` entry, and not taken**, because a unit that adds a job is not where one
decides what else the workflow must be answerable for.

## Consequences

* `suites.yml` gains one job and two `needs` entries. Nothing else in it moves: not the floor, not
  `engines`, not a bound, not `cancel-in-progress`.
* `package.json` gains `excluded-contracts`; two files arrive at the root, one derived and one a
  negation.
* **`npm test` is unchanged at 30 files and 718 tests with no type errors**, which is the neutrality a
  contributor is owed and is asserted rather than assumed.
* Run on this machine under `--harmony-temporal`: **4 test files, 122 tests, `Type Errors no errors`,
  exit 0** — the first time this contract's whole suite, `signature.test-d.ts` included, has been green
  anywhere with its properties repaired. **It is the draft and not the language**; the first green on
  the published runtime is this job's own first run.
* **The ledger is `18cc4e82…` at 1 206 bytes and `pnpm freeze` is 3 passed**, unmoved. Nothing enters
  the catalogue, no digest is minted, no battery is written.

## What would reopen this

* **A second excluded contract needing a different runtime.** The configuration collects it
  automatically and this job would run it on node 26, which may be the wrong runtime for it — at which
  point the declaration needs a runtime per folder and this job needs a matrix after all.
* **The contributor floor rising to a runtime that carries `Temporal`.** Then the exclusion lifts for
  real, the folder returns to `npm test`, and this job has nothing left to run.
* **The eighth contract entering the catalogue.** A battery becomes owed the instant it does —
  `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` is bidirectional —
  and what this job measures stops being the only thing that does.

## More Information

ADR-0251 is the exclusion and its three places; ADR-0252 is the contract; ADR-0253 is the branch that
read the leg before anybody built one and measured how vitest spawns its typechecker. ADR-0169 is the
132 s that decides sibling against matrix, and ADR-0243 is the arbitration that put the instrument in
front of the deployment, whose shape this decision follows one act along.
