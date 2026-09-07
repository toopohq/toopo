---
status: accepted
date: 2026-09-07
governs:
  - CLAUDE.md
confirmed-by: []
---

# The flag is not a route, and the half that refuses is the user

## Context and Problem Statement

ADR-0220 left the eighth contract as *a decision about this repository's contributor floor*, on three
ways out of which it refused the third — *scope one contract's suite to one leg* — because
**per-contract runtime scoping is machinery that does not exist**. That was September. Two things
have been put to this unit since.

**The first is a measurement of the flag.** Node 24 under `--harmony-temporal` carries a `Temporal`,
so the obvious reading is that the flag is a route round the whole question. It is not, and the reason
is sharper than *the flag is a hack*.

**The second is that the refused premise may have moved.** This repository now carries eleven vitest
configurations, one of them built two days ago with its own census key, its own selection and its own
battery. If per-contract scoping is machinery, some of it now exists.

**Nothing is built here.** No leg, no configuration, no contract, no change to `suites.yml`, to
`engines` or to the floor. The ledger reads `18cc4e82…` on both sides.

## Decision Drivers

* **A reason measured this week, or no reason.** ADR-0220's verdict is copied forward at every
  reading; whatever this unit concludes has to rest on something taken now.
* **Three halves, costed separately**, because folding them is how a blocker in one gets paid for by
  the cheapness of another.
* **A blocker is named by which half refuses**, never by the sum.

## Considered Options

Not applicable: nothing is chosen. What is established is whether the flag is a route, what each of
the three halves costs, and which of them refuses.

## Decision Outcome

### 1. The flag is not a route, and it is worse than the absence it was offered against

**Measured on node v24.15.0 under `--harmony-temporal`: `Temporal` is present with *eleven* own
property names** — the specification's nine, plus `Calendar` and `TimeZone`. That is V8 13.6's
pre-erratum draft, the two members TC39 removed before stage 4 still in place.

**So the question is not *Temporal is absent on Node 24*. It is *the Temporal Node 24 can be made to
carry is the wrong one*** — and this repository already refuses that shape twice, in two places
written for other reasons:

* **ADR-0215's probe.** Every reading of that unit runs behind a guard that *refuses to print anything*
  unless `TimeZone` and `Calendar` are absent and the namespace is exactly the nine. *A reading taken
  on the draft is not a weaker reading of the language; it is a reading of something else.*
* **The compiler this repository pins.** Measured at `28adef0` on TypeScript 7.0.2 with
  `--lib ES2022,ESNext.Temporal`: `Temporal.TimeZone` and `Temporal.Calendar` are each **TS2339,
  `Property does not exist on type 'typeof Temporal'`**. The compiler describes the language and not
  the draft, so a contract compiled here and run under the flag would execute against a namespace
  wider than its own types admit.

**And the flag closes entirely one version later.** Measured this week on node **v25.6.0**: `Temporal`
is `undefined` bare, `undefined` under `--harmony-temporal`, and `undefined` under `--js-staging
--harmony`. V8 14.1 dropped the draft and had not yet shipped the language, so the flag is not a
narrowing route — it is a route that exists at exactly one version and yields the wrong object there.

### 2. What the compiler knows, and what widening it costs

**`Temporal` does not compile in this repository today, on any runtime.** `tsconfig.json` declares
`"lib": ["ES2022"]`, and under it the probe answers **TS2304 `Cannot find name 'Temporal'`** for the
value and **TS2503 `Cannot find namespace 'Temporal'`** for the type. That is a refusal at build time
and it is independent of which node is running.

**The compiler does ship the declarations, and in a fragment rather than in the whole of `esnext`.**
There is no `es2026` lib — `--lib es2026` answers TS6046 and enumerates what exists — and the
fragment is **`esnext.temporal`**. Measured: `--lib ES2022,ESNext.Temporal` compiles the probe, exit 0.

**And the whole tree compiles under it unchanged**: `tsc -p tsconfig.json --noEmit --lib
ES2022,ESNext.Temporal`, **exit 0**. So the widening costs nothing to what exists.

**What it costs is a claim, and the claim is global.** `lib` tells the compiler what the runtime
carries, and this repository's declared floor is `^22.15.0 || >=24.0.0`. Widening it says *Temporal is
here* to every file of every package, on a floor where it is not — so any module could name `Temporal`,
compile, and fail at run time on the floor, with nothing to catch it. **That is a new
`one-directional` declaration**, of exactly the class the open list exists for. It is closable by one
guard — no module outside the contract's own folder names `Temporal` — which would be born green and
which, since ADR-0246, is a guard a battery can redden.

### 3. Half one, the CI: the suite half exists and the battery half does not

**The premise ADR-0220 refused on is half refuted and half confirmed, and the two halves are not the
same machinery.**

**Scoping a *suite* to a configuration exists, and the newest instance is two days old.** Measured:
eleven tracked `vitest.config` files. `mutation/under-measurement.vitest.config.ts` is a configuration
with an `include`, an `exclude`, its own key in `CENSUS`, and a battery that names it — and
`theFilesToCollect` answers `[]` for such a battery, so the configuration decides. The root
configuration is one glob, `include: ['contracts/**/*.test.ts']`, so taking one contract out of it is
an `exclude` of the shape that unit just wrote. And a *job* pinned to a runtime is not new either:
eight jobs of `suites.yml` already pin `node-version: '24'`.

So the suite half costs **one configuration, four to five census rows** — the contracts in the census
carry four rows each and `number/round@1` five — **one `exclude` on the root configuration, one npm
script and one job**. Its precedent paid one configuration and thirteen rows.

**Routing a *battery* to a runtime does not exist, and that half is confirmed.**
`every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` is bidirectional, so a
contract in the catalogue **must** have a battery; a battery runs the contract's own suite, which on a
runtime without `Temporal` is red at calibration. The `batteries` job pins `node-version: '24'`, and
the instrument's only routing axis is the platform: `PlatformFamily` is `'windows' | 'posix'`, a closed
union, and `onlyOn` takes one. There is no runtime axis anywhere in `run.ts`, `mutants.ts`,
`published.ts` or `selection.ts`.

**The shape of the repair is known and its precedent is ADR-0169's**: a field on the battery, a
derivation beside `batteriesWhereThePlatformDecides`, a second job whose matrix that derivation feeds,
and the entry point printing it. That is a unit, and it is priced rather than refused.

**Half one does not refuse.**

### 4. Half two, the contributor: it does not refuse, and it opens the hazard §2 names

**A runtime without `Temporal` fails loudly, and the failure is measured rather than reasoned.** On
node v24.15.0 bare — the *upper* of the two legs, which is the stronger reading — `typeof
globalThis.Temporal` is `undefined`; naming it at module level throws `ReferenceError: Temporal is not
defined`, and a function that names it in its body defines cleanly and throws the same on the first
call. So the failure lands at load for a file that names it at top level and at call for one that does
not, and this session measured the first shape on a real case: a module-level throw makes vitest
report the file as `(0 test)` and the suite as one failed file.

**So a Temporal contract left in the root configuration reddens `npm run test` for every contributor
on both legs** — which is the state this repository refuses, and which is precisely what §3's suite
half removes: excluded from that configuration, the contract is never collected there and the
contributor is green.

**What is left is the compile half, and it is the hazard rather than a blocker.** With `lib` widened,
the contract compiles on the floor and so does everything else — including a module naming `Temporal`
that has no business doing so. **Half two does not refuse**, and it hands §2's guard to whoever pays
it.

### 5. Half three, the user: the catalogue has never had to declare a runtime requirement, and cannot

**Measured, not assumed.**

* **`targetEnvironments` → `environments`.** It is `readonly string[]` with no union and no vocabulary
  type; `FIELD_MAP` classes `environments[]` as **`documentary`**; it is inside `contractSnapshot`, so
  it is frozen for the life of the major; **all seven contracts declare the identical
  `['node', 'browser', 'bun']`**; and outside the schema — `packages/site/`, `packages/cli/`,
  `packages/validation/` — **nothing reads it**. A field every contract answers the same way, that
  nothing reads, cannot be contradicted and cannot carry a requirement.
* **`THE_WAYS_TO_RUN_IT`** is four rows of `{ manager, spelling, refusedBecause }` about **npm, pnpm,
  bun and yarn** — how to run *the client*. It carries no runtime requirement and is not about the
  contract at all. It is the wrong surface, not an empty one.

**So the answer to *does the catalogue know how to say this* is no, and it is a first.** Every contract
published so far runs anywhere the language runs, so the question has never been posed; a contract that
needs a runtime the floor does not carry is the first thing this schema would have to say and has no
words for.

**What a user would receive is measurable and is the sharpest reading of the three.** An install writes
the reference implementation into the reader's own project as TypeScript. Under a `lib` of `ES2022` —
this repository's own setting, and an ordinary one — that file answers **TS2304**, and on Node 22 or 24
it answers **ReferenceError**. The install exits 0, the digest matches, the lockfile is written, and
**nothing in the answer the registry served says why it does not work.**

**Half three refuses.** Not on price and not on effort: on the catalogue having no way to make the
statement, and on the field that would carry it being inside the digest — so it must be settled before
publication or never, which is line 5 of what the next contract has to carry.

### 6. `array/group-by@1`'s rule does not transfer, and the cast is what says so

The rule is *a runtime without the function fails loudly instead of skipping*. Read in place, in
`language.test.ts`:

> **It measures the runtime, not `reference.ts`**, so no mutant of the battery can redden it. … A
> runtime without `Map.groupBy` fails here, loudly, instead of skipping. **The claim is about what the
> language does**; a runtime that cannot answer has not agreed.

**Its subject is a divergence replay and never the contract.** The file reaches `Map.groupBy` *through
a cast* — `(Map as unknown as { readonly groupBy?: LanguageGroupBy }).groupBy` — with the comment
*because `Map.groupBy` is ES2024 and this repository compiles to ES2022*. So the contract's own
`reference.ts` never names it, the reference runs everywhere, and what fails on an old runtime is one
file whose whole job is to ask the language a question.

**Transposed to Temporal the population changes and the claim changes with it.** The absent thing is
not a function a replay compares against; it is the type of the contract's own parameter. There is no
cast that keeps it out of `reference.ts`, ADR-0219 measured both string transpositions and refused
them, and ADR-0225 fixed the arity at three carriers whose values the case table has to construct. So
*fails loudly instead of skipping* would stop meaning *this runtime cannot answer the question* and
start meaning *this contract does not run here* — a different proposition, about a different thing, on
a population the rule was never written over.

**It is a transposition and not a transfer**, and this record says so rather than letting a sentence
from one contract's `language.test.ts` decide the eighth.

### 7. Now or October, and the answer is neither

**The calendar is not what refuses.** October is when Node 26 becomes LTS and the floor can rise, and
raising the floor is what half one and half two are about — it deletes the `22.18.0` leg, removes the
need for §3's configuration, and makes §2's widening true rather than aspirational. **It does nothing
whatever for half three.** A user on a runtime without `Temporal` is a user on a runtime without
`Temporal` in October as in September, and the field that would warn them is a constant nobody reads
either month.

**So the answer is not *wait*.** It is that one prerequisite stands in front of the eighth contract
and it is a schema decision rather than a date: **can the catalogue declare that a contract needs a
runtime, and does it want to publish one that some readers cannot run?** The first is a unit — a
vocabulary on `environments`, or a new standing field, and it must land *before* the contract because
the field is inside the digest. The second is not a unit; it is the owner's, and §8 puts it.

**What is measured this week and did not exist in September**: the flag's two readings, the compiler's
three, the tree green under the fragment, the eleven configurations, the closed `PlatformFamily` union,
and the seven identical `targetEnvironments`. **What is not measured this week is Node 26** — this
machine holds 20.12.1, 23.11.0, 24.15.0 and 25.6.0 and no 26 — so every figure ADR-0220 took there is
September's and is cited as such rather than repeated.

### 8. The arbitration, put rather than taken

**Is publishing a contract some readers cannot run acceptable at all?** The catalogue's promise is that
the source lands in your repository and is yours; a file that does not compile under an ordinary `lib`
and throws on the declared floor is a file that is not yet yours in the sense the front page means.

Three shapes, with what each costs:

* **Declare it and publish.** A vocabulary on `environments` or a new standing field, settled before
  the digest is minted, plus §3's configuration and §2's guard. The user is warned and the contract
  ships.
* **Raise the floor first and publish after.** Half one and half two dissolve, half three still needs
  the declaration — a reader on Node 24 is still a reader the catalogue cannot warn.
* **Do not publish a contract the floor cannot run.** The catalogue stays uniform, and the eighth
  contract waits on the floor rather than on a schema.

This record takes none of them.

## Consequences

* **The flag is closed as a route**, and closed twice: the wrong object on 24, no object on 25.
* **The compiler's refusal is a second witness against the draft**, independent of ADR-0215's probe.
* **ADR-0220's third exit is half refuted**: the suite half is machinery that now exists, and the
  battery half is machinery that still does not.
* **The blocker moves from the contributor floor to the schema**, which is a different owner and a
  different unit.
* **`environments` gains a second consequence**, after ADR-0220's: it was measured to refuse nothing,
  and it is now measured to be unable to carry the one requirement a contract has ever needed.
* **Widening `lib` is priced and its hazard is named**, so whoever pays it knows what it opens.

## What would reopen this

* **A runtime requirement the catalogue can state.** §5 is the whole refusal; a vocabulary or a
  standing field that carries it turns this record's *neither* into *now*.
* **A runtime axis in the instrument.** §3's second half is the only piece of ADR-0220's third exit
  still missing, and its shape is ADR-0169's.
* **Node 26 on a machine this repository can measure.** Every figure about that runtime here is
  September's, and the rule of this file is that a reading is dated.
* **A `Temporal` reachable without naming it.** ADR-0219 refused both string transpositions and
  ADR-0225 fixed the arity; a shape neither reached would put the contract back inside the language the
  compiler already describes.

## More Information

* ADR-0220 named the three ways out and refused the third; ADR-0215 built the draft guard §1 leans on;
  ADR-0219 and ADR-0225 are why §6's cast has no analogue here.
* ADR-0246 is the machinery §3 measures: a configuration, a census key and a battery that names it.
* ADR-0006 is the only place `environments`' vocabulary is described, and it describes it in prose.
