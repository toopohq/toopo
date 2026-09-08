---
status: accepted
date: 2026-09-07
governs:
  - CLAUDE.md
confirmed-by: []
---

# The exclusion is three places, and the order that holds is one commit

> **One clause of this record is refuted, and it is *what it does not reach is the suite*.** Vitest
> **does** honour the project's `lib`. What does not survive a widening is the incremental cache its
> typechecker keeps: it spawns
> `tsc --noEmit --pretty false --incremental --tsBuildInfoFile <its own dist>/tsconfig.tmp.tsbuildinfo`,
> so a `lib` widened against a file written under the narrower one is read as though it had not been.
> Measured three times on node v24.15.0 and reproduced on `ubuntu-latest` at node v26.8.1 — narrow and
> cold gives 40 errors, widened with the cache kept gives the same 40, and the same widened `lib` with
> the file removed gives none.
> [ADR-0253](0253-what-a-runtime-carrying-temporal-does-to-the-suite.md) is the reading, and it is what
> the reopening trigger below named.
>
> **Nothing else here is retracted, and the third place stands.** The four states, the control, and the
> conclusion that an exclusion is three places are all unaffected: `tsconfig.json`'s `exclude` is what
> keeps the folder out of the typechecker's project, and no widening of `lib` replaces it.

## Context and Problem Statement

The eighth contract needs Temporal, which neither leg of this repository's matrix carries, and the
ruling is that it arrives already excluded from the contracts' own suite under one invariant: **at
every commit on `main`, `npm run test` is green on 22.18.0 and on 24.** No red window.

`vitest.config.ts` carries two globs — `include` for `*.test.ts` and `typecheck.include` for
`*.test-d.ts` — and a contract carries seven files, one of which is a `.test-d.ts`. **Whether excluding
on those two globs suffices had been reasoned about and never measured**, which is what this record
does before a line of the contract is written.

## Decision Drivers

* **The invariant admits no red commit**, so the order the work lands in is part of the design rather
  than a convenience.
* **An exclusion that lands before its subject excludes nothing**, and a mechanism with no subject is
  the shape this repository refuses.
* **ADR-0250's guard ranges over `theCatalogue`.** A contract that enters the repository without
  entering the catalogue is outside its population, so what was built one unit ago does not answer
  for this one.

## Considered Options

* Exclude on the two globs of `vitest.config.ts`.
* Widen `lib` so the contract typechecks, and exclude only what cannot run.
* Exclude on the two globs and on the typechecker's own project.

## Decision Outcome

### The two globs are not sufficient, and the measurement says so in one figure

A probe was placed under `contracts/typescript/date/plus/` — a `.test.ts` naming `Temporal` at runtime
and a `.test-d.ts` naming it as a type — and `npm run test` was run at each state, at `eaf24a6`.

| state | result |
| --- | --- |
| the probe, no exclusion | **exit 1** — 2 test files failed of 32, 1 test failed, 1 unhandled error: a `ReferenceError` at runtime, two `TypeCheckError`s on the `.test-d.ts`, and one on the `.test.ts` |
| the probe, both globs excluding it | **exit 1** — 30 files and 718 tests pass, and **3 errors** remain, every one of the three arriving as an *Unhandled Source Error* |
| the probe, both globs **and** the root `tsconfig.json` excluding it | **exit 0** — 30 files, 718 tests, no type errors |
| no probe, nothing excluded | **exit 0** — 30 files, 718 tests, no type errors |

**So an exclusion is three places and not two.** The third is `tsconfig.json`'s `exclude`, and the
reason is that vitest's typechecker typechecks the *project* rather than the collected set and reports
what it finds outside that set as a source error — `typecheck.ignoreSourceErrors` defaults to false,
and turning it on would silence every real source error in `contract.ts` and `reference.ts` across the
whole catalogue to serve one contract.

**The last row is the control.** The excluded state and the untouched state answer identically — 30
files, 718 tests — so the exclusion is exactly neutral on what remains, and the green in row three is
not a green bought by collecting less of something else.

### Two side measurements, one of which contradicts what a record implies

**`tsc` really does see the folder**, which had to be established before the third place could be
believed: with `lib: ["ES2022"]` and the probe present, `npx tsc -p tsconfig.json` is **exit 1** with
exactly the three errors, and `--listFiles` names both probe files.

**And `ESNext.Temporal` is a real lib fragment for `typescript@7.0.2`.** With it added, the same
command is **exit 0** with the probe still present — although no file named for it exists under
`node_modules/typescript/lib/` or `dist/`. **What it does not reach is the suite**: with the widened
lib in place, `npm run test` still reported `Cannot find namespace 'Temporal'`. Why vitest's
typechecker does not honour it was not established, and is published as measured rather than explained.
That closes the second option: the lib route does not make the type half of a Temporal contract pass
here, so it buys nothing the third place does not.

### The order that holds is one commit, and neither of the two proposed orders is it

**Exclusion first** excludes a folder that does not exist — a configuration change with no observable
effect, and nothing that could fail. **Contract first** puts `npm run test` red on both legs for one
commit, which the invariant forbids outright. **So the contract and its exclusion are one commit**,
and that is a third order rather than a choice between the two.

### What answers for it, and what does not

**Nothing does, and ADR-0250's guard is the near miss.** That guard requires every contract *of the
catalogue* to be collected by a configuration a battery reads; this contract enters the repository and
not the catalogue, so it is outside the population by construction. **The exclusion is therefore
unwatched by everything this repository currently holds**, and a declaration with a guard keeping the
three places in step with what is excluded is owed by the commit that excludes — not before it, where
it would range over nothing.

## Consequences

**Nothing was taken.** No contract is written, no glob is narrowed, `vitest.config.ts` and
`tsconfig.json` are byte for byte what they were, the ledger reads 1 206 bytes and `18cc4e82…` and
`pnpm freeze` is green. The probe was removed and `npm run test` is exit 0 at 30 files and 718 tests.

**What the next unit owes, in one commit**: the contract's seven files, `requiresOfTheRuntime:
['temporal']` in the first version of `contract.ts` because `contractSnapshot` freezes it and a
published contract can never receive it, the exclusion in its three places, and the declaration that
says what is excluded, why, and what would lift it.

**What would lift it is a runtime**, and that is ADR-0250's finding unchanged: the instrument's only
routing axis is `PlatformFamily`, the closed union `'windows' | 'posix'`, and the `batteries` job pins
`node-version: '24'`.

## What would reopen this

* **A second contract needing exclusion**, which would turn a folder path in three places into a list
  and make the declaration the only place it is written once.
* **`typecheck.ignoreSourceErrors` becoming acceptable**, which it is not while a source error in a
  `contract.ts` is something this suite catches.
* **Vitest honouring the project's `lib`**, which would make the type half of such a contract pass and
  reduce the exclusion to the runtime glob alone — the outcome the second option was measured for and
  did not reach.
* **A contract entering the catalogue while excluded**, which would put it inside ADR-0250's guard and
  make that guard, rather than a new declaration, the thing that answers for it.

## More Information

The four states above are one command each and cost about a minute apiece, which is why they were
measured rather than argued: the reasoning that said two globs would do was correct about collection
and silent about the typechecker, and no amount of reading `vitest.config.ts` would have said so.
