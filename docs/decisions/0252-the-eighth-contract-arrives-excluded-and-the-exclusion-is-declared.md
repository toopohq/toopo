---
status: accepted
date: 2026-09-07
governs:
  - mutation/excluded-contracts.ts
  - CLAUDE.md
confirmed-by:
  - battery: meta
    guard: every-contract-the-suite-does-not-run-is-excluded-in-all-three-places
  - battery: meta
    guard: every-excluded-contract-is-a-folder-that-exists-and-says-what-would-lift-it
---

# The eighth contract arrives excluded, and the exclusion is declared

## Context and Problem Statement

`temporal/add@1` is written against `Temporal`, which neither leg of this repository's matrix carries.
The invariant is absolute — **at every commit pushed to `main`, `npm run test` is green on 22.18.0 and
on 24** — so the contract arrives already excluded from the contracts' own suite, and the exclusion,
the declaration that names it and the guard that keeps the three places in step land in the same push.

ADR-0251 measured what an exclusion has to be and refused the two orders that had been proposed. This
is the unit it left.

## Decision Drivers

* **No red window.** A contract landing before its exclusion reddens both legs for every contributor
  for as long as the next commit takes.
* **`requiresOfTheRuntime` can never arrive later.** `contractSnapshot` freezes it, so a contract
  published without it can never receive it — and this contract is exactly the one the field was
  built for.
* **A silent exclusion is what this repository refuses.** Three places, one of which no configuration
  can import, is the shape that goes half-done with nothing saying so.
* **Nothing here compiles or runs the contract**, so every claim about it has to be verified some
  other way or declared unverified.

## Considered Options

* The contract first, the exclusion after — refused by the invariant.
* The exclusion first — refused by ADR-0251: it excludes a folder that does not exist.
* Both in one push, with the declaration and its guard — taken.

## Decision Outcome

### The address, and where every decision of the contract comes from

**`temporal/add`**, ruled by the owner: the catalogue's families are named after the data they operate
on — `array/`, `date/`, `number/`, `object/`, `string/` — and `temporal/` follows that exactly. The
parallel with `date/add` is intended: same verb, another family of carriers.

| what | where it comes from |
| --- | --- |
| the sentence — *refuses a unit the carrier does not apply, instead of dropping it in silence* | ADR-0216, tested and upheld at ADR-0225 |
| the arity — three, `PlainTime`, `PlainYearMonth`, `Duration` | ADR-0223 corrected by ADR-0225, and **confirmed independently by the code**: `THE_CARRIERS_A_TYPE_PARAMETER_MAY_STAND_FOR` in `packages/site/playground.ts` |
| the matrix — 40 rows, `Duration` bimodal | ADR-0225 |
| the signature's bound | ADR-0239: `whatAnUnboundCarrierCosts` refuses to build the page unless the type-parameter list binds `T` to those three names |
| the playground key `T`, read as `a-literal` | ADR-0239, on the owner's ruling; ADR-0236 is why a carrier is named rather than parsed out of a string |
| `requiresOfTheRuntime: ['temporal']` | ADR-0249, in the first version of `contract.ts` |

**The arity being confirmed twice by independent paths is worth more than either.** The records
reasoned it out of `Temporal`'s behaviour; `playground.ts` had already hard-coded the same three
because a form field has to be built for them.

### What was found under-tested, and what it cost to find

**A reading of `PlainYearMonth` in ADR-0225 rests on magnitudes that never reach a month.** Its split
table classes the carrier's eight units *refused at every magnitude*, on splits whose largest sum is
far below 2 678 400 seconds — the same shortfall that record itself found for `PlainDate` and
corrected, one row up in its own table.

Measured under `--harmony-temporal` on V8 13.6, every one of `PlainYearMonth`'s ten units acts at a
whole month; the owner then measured Chrome 152, the published language, and it **throws at every
magnitude up to 2.6 × 10¹⁵**. So **ADR-0225's conclusion holds and its proof was short**, and what
the two readings expose is a divergence rather than a defect: the draft `Temporal` behind the flag is
not the language, and it disagrees on the carrier that decides the arity.

**The working rule that follows is written where the next unit will meet it**, in the declaration's own
`liftedBy`: no reading taken under `--harmony-temporal` may stand in for one taken on the published
runtime. It joins ADR-0251's measurement that `ESNext.Temporal` is a real lib fragment `tsc` honours
and vitest does not — same family, same conclusion: what this machine says about `Temporal` is not what
the contract will meet.

### Forty rows are the matrix; the table is forty-four

ADR-0225 publishes *the case table is 40 rows*. That is the **matrix** — one row per carrier and unit,
`PlainTime` and `PlainYearMonth` ten each and `Duration` twenty for its two modes — and a table of only
those forty could not name a case for every reason the contract declares, which the catalogue's own
`edge-cases.test.ts` requires in both directions. Two rows settle a bag that is not a duration and two
settle the range. The forty are unchanged, a guard asserts them as a matrix rather than as a length,
and the record's figure is the matrix's.

**The range is a reason of its own because an overflow is not an inapplicability** — the distinction
ADR-0225 named, and the one a measurement confused this week. Both range rows are on units the carrier
applies at every reachable magnitude.

### What was verified, and how, since nothing here runs it

* **All seven files typecheck** against `ESNext.Temporal` — `tsc` exit 0, out of band, on a
  configuration that lives outside the tree.
* **All forty-four cases were replayed against the reference** under `--harmony-temporal`: **0 faults**,
  15 answered, 29 refused, reasons produced equal to reasons declared, identifiers and calls unique,
  every case in a declared group. **That replay is sound on a draft engine and says why**: the
  reference decides applicability from its own declared sets and never asks the engine, so the
  twenty-five refusals are engine-independent, and the fifteen applied answers and two range rows were
  measured to agree between the draft and the language.
* **The fifteen applied answers were measured**, not transcribed.

### The exclusion, and the guard that keeps its three places in step

The folders are declared once in `mutation/excluded-contracts.ts`; `vitest.config.ts` derives both of
its exclusions from that declaration; `tsconfig.json` repeats it because JSON can import nothing. Two
guards, seen red before green:

| the defect | what reddened |
| --- | --- |
| the suite collects it again | *vitest.config.ts does not exclude it from what the suite collects* |
| the type tests collect it again | *vitest.config.ts does not exclude it from the type tests* |
| the typechecker reads the folder again | *tsconfig.json does not exclude it, so the typechecker still reads the folder* |
| a declared folder that is not in the tree | both guards, naming the folder and the orphaned exclusion |
| an exclusion nothing declares | *excluded by tsconfig.json and named by no declaration* |

**A perturbation that did not redden is what improved the guard.** The first version searched
`vitest.config.ts` for the name of the declaration, and a perturbation renaming the import left the
identifier in the body — green on a configuration that had stopped using it. What replaced it reads the
configuration's **produced arrays** rather than its text, so the only way to satisfy it is to actually
exclude the folder. And `asAGlob`, the one derivation both sides share, has its shape pinned beside the
comparison: without that the guard would be reading one map against itself.

## Consequences

**Nothing is published.** No digest is minted, `THE_PACKAGE_VERSION` is 1.2.0, the ledger reads 1 206
bytes and `18cc4e82…` on both sides and `pnpm freeze` is green. The contract is in the repository and
not in the catalogue: `theCatalogue` does not name it, so it serialises to nothing and binds nothing.

**Nothing measures it, and that is declared rather than hidden.** Its suite does not run, its types are
not checked by anything this repository runs, and ADR-0250's guard does not reach it — that one
requires every contract *of the catalogue* to be collected by a configuration a battery reads, and this
one is outside that population by construction. The selection prints it on every push, under *changed
file(s) no battery answers for*.

**`requiresOfTheRuntime: ['temporal']` is in the first version of `contract.ts`**, which is the one
thing here that could never have been added later.

## What would reopen this

* **A leg carrying `Temporal`.** The declaration's `liftedBy` names what it needs beyond the runtime:
  a way to route a battery to one, which `PlatformFamily` — the closed union `'windows' | 'posix'` —
  does not have.
* **A second excluded contract**, which would turn the guard's population from one into a list and is
  the first thing that would test whether the declaration's shape survives more than one instance.
* **Publication.** Every figure this contract declares that a measurement would ordinarily fix —
  `propertyRuns` above all — is adopted rather than measured, because no runtime here can time it. It
  is stated in the file, and it is owed before an address is minted.
* **A reading of `PlainYearMonth` on a third engine.** Two disagree today, and what makes the contract
  correct is the published one; a third that agreed with the draft would reopen the arity itself.

## More Information

The contract's own suite was never run. What stands in its place is written in the Decision Outcome
above and is deliberately not called a replay of the suite: a typecheck out of band, and a replay of
the case table against the reference by a probe that lives outside the tree.
