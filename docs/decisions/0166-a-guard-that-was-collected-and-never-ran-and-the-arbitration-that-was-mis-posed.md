---
status: accepted
date: 2026-08-26
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
  - mutation/registry-storage.battery.ts
confirmed-by:
  - battery: meta
    guard: a-guard-collected-and-never-run-is-not-a-guard-that-passed
  - battery: meta
    guard: a-file-that-reddens-names-the-guard-that-reddened-it
  - battery: meta
    guard: a-suite-that-lost-a-guard-outright-is-refused-by-the-total
  - battery: meta
    guard: a-fixture-that-cannot-be-built-names-the-guards-it-took-with-it
  - battery: meta
    guard: a-declaration-that-outlives-its-mutant-is-refused
---

# A guard that was collected and never ran, and the arbitration that was mis-posed

## Context and Problem Statement

`CLAUDE.md` has carried this entry since ADR-0102:

> **That a control which counts a suite has seen the suite it counted.** `assertWholeSuiteRan`
> compares a total against a total and never looks at the composition […] **The population is the
> files one cell's run reports**, and what would close it is the comparison `assertTheCensusHolds`
> already makes, read where `assertWholeSuiteRan` runs instead of only during calibration. It is not
> built with ADR-0102 because two controls over one reading have nothing to say on the day they
> disagree, and which of them owns the question is undecided.

Two things had to be settled: whether to move the census onto every mutant cell, and which of the two
controls owns the question when they disagree.

**Neither was the real problem. The entry's proposed closure is refuted by the entry's own figures.**

## The refutation, from the numbers already published

The entry publishes its measurement: with a checkout left registered,
`packages/registry/frozen-for-life.test.ts` cannot start, and the report reads **351 assertions, 347
passed, 4 skipped, 0 failed** — against a control of 351.

The four guards that left the suite are **counted**. `censusFaults` compares

```ts
.filter(([file, guards]) => (collected[file]?.guards ?? 0) !== guards)
```

where `CollectedFile.guards` is a `number`. A comparison of counts is green on a set of guards that
went from `passed` to `skipped`, because nothing about the count moved. **The census is a comparison
of counts.** So running it on every mutant cell would have been green on the very instance the entry
was written from.

The entry states the reason itself, one sentence before proposing the repair, without noticing:
*ignored is not failed, and the two are indistinguishable to anything that counts.*

No new measurement is needed for that argument, and it is written this way deliberately: a reader in
two years can check it against the entry and against `census.ts:519`, without re-running anything.

## What the class actually contains

The entry names the class as *anything that makes a test file unstartable — a `beforeAll` that throws,
an import that dies, a fixture that cannot be built*. Reproduced at `3eeaaae` on `mutation/fixture/`,
running the exact command line `runSuite` spawns, control = 2 files and 3 assertions:

| what breaks the file | assertions | the total sees | the census sees | a status reading sees |
| --- | --- | --- | --- | --- |
| a throw at module scope | 2 | **yes** | **yes** (declared 1, collected 0) | no |
| an import that dies | 2 | **yes** | **yes** | no |
| **a `beforeAll` that throws** | **3** | **no** | **no** | **yes** |

Two of the three already moved the total and were already refused. The third is the entry's own shape
— `frozen-for-life.test.ts` really does build its subject in a `beforeAll` — and it moves neither the
total nor any per-file count. Its file also carries **no message at all**, so the half of the census
that quotes the run would have printed nothing either.

## What the instrument answered before this change

Three cells whose suite did not answer, run through `calibrate` and `runBattery` at `3eeaaae`:

```
FX-P1  beforeAll throws   killed-by-typecheck  failedGuards=[]  DISAGREES
FX-P2  afterAll throws    killed-by-typecheck  failedGuards=[]  DISAGREES
FX-P3  it.skip            survived             failedGuards=[]  as expected
```

Not one was refused. The first two acquire a **name** — `killed-by-typecheck` is a verdict this
instrument counts apart and publishes on a page. The third is worse and is silent all the way to the
ledger: a guard left the suite, the run stayed green, the count stayed at three, and the cell agreed
with its own pin.

## Decision Drivers

* A verdict derived from an absence cannot tell one absence from another. ADR-0162.
* A guard perturbing an object derived from the claim establishes only that the derivation is
  self-consistent. `GUARD_PERTURBATION_RULE`.
* Two mechanisms over one fault have nothing to say on the day they disagree. `run.ts`.
* A guard no condition reddens by itself is a guard another one already makes. `census.ts`.

## Considered Options

* Move `assertTheCensusHolds` onto every mutant cell, as the entry proposes.
* One reading of the report's statuses, replacing the entry's proposal.
* Two readings, if and only if each is red on a condition the other is green on.

## Decision Outcome

**Chosen: two readings, and the census does not move.**

### The two, and the measurement that says they are two

`assertEveryGuardAnswered` — every guard the run collected gave an answer.
`assertEveryRedFileNamesItsGuard` — every file the run reddened holds a guard that failed.

Measured at `3eeaaae` on the fixture, over five shapes:

| shape | run green | a guard never answered | a red file owning nothing |
| --- | --- | --- | --- |
| control | yes | 0 | 0 |
| a `beforeAll` that throws | no | **1** | **1** |
| an `afterAll` that throws | no | 0 | **1** |
| a guard set aside with `it.skip` | **yes** | **1** | 0 |
| a guard that really fails | no | 0 | 0 |
| `NP-5`, a legitimate `killed-by-typecheck` | no | 0 | 0 |

Each has a condition the other is green on, so neither is the other written twice. The last row is the
one that had to be checked rather than assumed: `NP-5` of `number-parse-spec` puts a provenance outside
the declared vocabulary, and read at `3eeaaae` on the real contract its run reddens while writing a
report **identical in composition to the control** — four files, 122 assertions, every one `passed`,
not one file marked failed. A source error is not a test file, so it enters neither reading.

### `AN_ANSWER` names the answers, not the states

`JsonAssertionResult['status']` is a closed union of six. Restating those six here would look like the
total map over a union this repository prefers, and it would be the wrong shape: the report is parsed
out of JSON, so a seventh state added by a runner upgrade would arrive as a string nothing here had
heard of and be **read as healthy**. Naming the two that mean *this guard spoke* refuses the seventh by
construction.

**The set of legitimate exemptions is empty, and it is written empty with its coordinate.** Measured at
`3eeaaae` across every `*.test.ts` and `*.test-d.ts` of this repository: zero occurrences of `skip`,
`skipIf`, `runIf`, `todo`, `fails` or `concurrent` on `it`, `test` or `describe`. A platform family is
decided one floor up by `expectedHere`, never by asking vitest to stand a guard down. That is a
condition which expires with nobody noticing — ADR-0153's own class — so it carries a date rather than
a claim about today, and the day somebody writes a conditional test the refusal reddens and the
exemption becomes a decision instead of an omission.

### The arbitration: the question was mis-posed

The entry asks which of two controls owns the question. **They were never over one question**, and the
third reading is what makes that visible. Measured at `3eeaaae`, each of the five terms has a shape it
is the only one to see:

1. **nothing measured at all** — `notMeasured`. ADR-0162.
2. **nothing collected** — `assertTheCensusHolds`. A door open for the control *as well as* the
   mutant: narrowing the collection glob by one character leaves the suite green with 120 guards gone.
3. **collected and never answered** — `assertEveryGuardAnswered`. A guard set aside leaves the run
   green and the count whole.
4. **answered, and a redness nobody owns** — `assertEveryRedFileNamesItsGuard`. A teardown that throws
   leaves every guard `passed`.
5. **answered, by fewer guards than this arm's control had** — `assertWholeSuiteRan`. A guard deleted
   outright from a green file.

**The order is `verdictOf`'s own argument one floor up**: every term below reads an absence as
evidence, so the larger absence is asked about first. 3 before 4 is cause before symptom, and it
decides which sentence a reader meets on the one shape both see — a `beforeAll` that throws leaves
guards unrun *and* a file red, and the guards are why.

So there is no priority rule to write between two rivals. There is an ordering over five terms, and it
is derived from a rule this repository had already recorded.

### The census is not moved, and that is refused on the argument rather than on the price

`run.ts` already states the rule for this exact shape, about a neighbouring pair: *two mechanisms over
one fault have nothing to say on the day they disagree*. On a mutant cell the census's only catch that
`assertWholeSuiteRan` has not got is a guard moving between files at constant total — and that has
**zero reachable instances**. Swept at `3eeaaae`: 685 mutant-arm pairs, **2** editing more than one
file (`packaging` A-08 and A-14), and neither of those two files is a test file.

**The price is published so nobody re-refuses it on that ground.** Over the largest real report this
repository produces — `packages/registry/`, 24 files, 464 assertions — the census composition costs
**54–102 µs per cell** and the status reading **4.4 µs**, which over the **837 cells** the instrument
declares is 45–85 ms and 3.8 ms, against a replay of some forty minutes. A battery's wall clock cannot
resolve either: two runs of identical work on `site` differ by three minutes.

### The one live instance, and why its silence is declared

Replaying with the refusals in place found the defect in the catalogue rather than in the fixture.
**`registry-storage · I-30`** renders an address without its language;
`packages/registry/frozen-for-life.test.ts` builds its subject by cloning this repository at committed
`HEAD` and looking the published binding up under `WHAT = renderContract(SLUGIFY.address)`. The clone
holds the unmutated spelling and the process holds the mutated one, so the key misses, `rebuild()`
throws inside `beforeAll`, and four guards are reported `skipped`. The assertion count does not move.

It is the file and the four addresses `CLAUDE.md` named at `c21865e`, found live on a pinned cell.

**The population is one, out of 224.** Replayed whole over every battery whose folder holds a test file
that builds something in a setup or tears something down — which is six and not four, because
`packages/cli/ignored.test.ts` puts all four `cli-*` batteries in that population and only
`cli-install` reaches `remove-directory.ts` from it:

```
registry-storage   R/as-committed   89/94   surviving I-01, I-08, S-11, S-12, S-14   b0748d6
packaging          A/as-committed   18/19   surviving A-13                           b0748d6
cli-install        C/as-committed   72/72   -                                        b0748d6
cli-update         U/as-committed   35/35   -                                        b0748d6
cli-search         S/as-committed    3/3    -                                        ffd7682
cli-remove         R/as-committed   21/21   -                                        ffd7682
```

Six times *every cell agrees with the verdict this battery pins for it*, and `I-30` goes on reddening
`every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract`, alone on `I-31` — so the
declaration silenced the four addresses it names and nothing else.

**Two coordinates and one state, shown rather than asserted**: `git diff b0748d6..ffd7682 --
mutation/run.ts mutation/instrument.test.ts` is empty, so the instrument that took the last two
readings is the instrument that took the first four. The figures are the batteries' own rather than a
probe's, because `npm run battery <name>` reproduces them and a probe written for one afternoon does
not.

`packaging` returned zero **for a reason and not by luck**, which is worth as much as the one: its
`beforeAll` builds the archive through `npm pack`, which fails loudly, so the file loses its assertions
and the total moves — the shape that was already refused before this record.

For the batteries not swept cell by cell the shape is unreachable by construction, and that is measured
rather than assumed. A guard that does not answer needs a `skip`, `skipIf`, `runIf`, `todo`, `fails` or
`concurrent` — **zero occurrences at `3eeaaae` across every `*.test.ts` and `*.test-d.ts`** — or a
`beforeAll` that throws, and only seven test files of this repository declare a setup or a teardown at
all. A red file owning no failed guard needs a teardown that throws, a throw at module scope or a dead
import; the last two move the total, so no pinned cell could have been in that state without its
battery already being red. **That argument expires the day somebody writes a `skipIf`**, which is why
it carries a coordinate rather than a claim about today.

**Three options, and the two that were refused.** Refusing `I-30` outright throws a correct measurement
away to punish an unrelated silence, and no rewrite avoids the desynchronisation — the desynchronisation
*is* the defect. Repairing the fixture so its `beforeAll` cannot throw makes those four guards redden
for a defect in address rendering when their subject is the freeze, which is the misattribution `run.ts`
already records against `array/group-by@1`'s `language.test.ts`; it is also a decision about the design
of a registry fixture taken inside a unit whose subject is the instrument, so it is written as an entry
of the open list instead of made here.

**So the silence is declared, and the declaration names guards and never a file.** A declaration naming
`frozen-for-life.test.ts` would take a fifth guard added to that file into the silence with nobody
deciding — a total absorbing what it lost, rebuilt one floor down inside the repair written to remove
it. Named addresses leave a fifth one undeclared, and `assertEveryGuardAnswered` sees it. It is the
granularity `census.ts` already works at: *a guard identifier is frozen with its contract's major
version*.

`Mutant.leavesUnanswered` is the third kind of declared silence here and the only one that is per
mutant: `unreachableGuards` says no mutant of a battery reddens a guard, `unprobedRegions` says none
does yet, and this says one mutant stops a guard from speaking at all — which is neither, because
**the guard is not silent, it is absent, and nothing in this instrument could tell those two apart.**

**That is this record's own subject arriving one floor up, inside the repair written for it.** What
closed above is that a guard which stopped answering was counted exactly like one that passed. The
vocabulary for *declaring* a silence carried the same hole one level of abstraction higher: a battery
could say *nothing reddens this guard*, and had no way at all to say *this cell never asked it*. The
field is the small half. The finding is that the distinction did not exist, in the folder whose whole
subject is telling absences apart.

`assertNoDeclaredGuardAnswered` is what keeps that from being a licence to hide, and it is
`attribution.ts`'s shape one floor over: that file refuses a silence nobody accounts for **and** a
declaration a mutant contradicts. It is total over the declaration rather than over the run, so a guard
renamed out from under a name is a red rather than a line nobody reads. `FX-M14` is it seen red alone —
a cell standing one guard down and declaring two, where the first refusal is silent because the real
one is declared, the second because no file reddens, and the third names the guard that answered.

### One witness moved rather than being added to

`FX-M2` — a file that throws while being collected — used to be `assertWholeSuiteRan`'s only witness in
the meta suite. That shape is now reached first by `assertEveryRedFileNamesItsGuard`, which names the
file and quotes the run, so `FX-M2` stopped witnessing the total. **A population that shrinks in
silence is the defect this repository keeps finding**, so `FX-M10` is a replacement and not an
addition: a guard deleted outright from a green file, measured green with 2 assertions, no file red and
none unanswered, so the total is the only one of the three that speaks.

## Consequences

* Good: the defect the entry describes is refused, on the shape the entry measured.
* Good: a guard stood down can no longer pass for a guard that passed, in an instrument whose whole
  subject is that a guard which cannot fail is not a guard.
* Good: at a mutant cell, a file that gave way is now named and the run quoted — the census's own
  lesson arriving where the census does not run.
* Good: `runSuite` reads a file's verdict and the first line of its error once, where the report is
  read, instead of `assertTheCensusHolds` re-deriving the second at its own end.
* Good: the defect was found in the catalogue and not only in the fixture — `I-30` had been reporting
  a correct verdict over four guards that had left the suite, for as long as it has existed.
* Bad: the meta suite gains five guards and about ten seconds, and the instrument gains three refusals
  a reader of `measureCell` has to hold in their head.
* Bad: a battery may now declare a guard silent on a cell, which is a door that did not exist. It is
  narrowed by being per mutant, by naming addresses rather than files, and by a refusal on the other
  direction — but it is a door, and the population it is open for is one cell today.
* Bad: a battery that legitimately wanted a guard stood down now cannot have one. Nothing wants that
  today — the exemption set is measured empty — and the day something does, this refusal is where the
  decision gets taken rather than where it gets skipped.
* Neutral: no published figure moves. `theMeasurement()` reads 807 defect cells and 30 probe cells
  either side, because the four new mutants are declared inline in the meta suite and never enter
  `THE_BATTERIES`.

## What would reopen this

* A shape that makes a test file unstartable and reaches none of the five terms. The list above is
  what was measured, not what exists.
* A legitimate reason for a guard of this repository not to answer, at which point `AN_ANSWER`'s empty
  exemption set stops being empty and has to be declared rather than assumed.
* A mutant that edits two test files, which would give the per-cell census the reachable instance it
  does not have today and reopen the refusal above on its own terms.
* A second `leavesUnanswered`. One declaration is a fact about one mutant; a handful would be a
  pattern, and the question would stop being *may this cell declare it* and become *why do fixtures of
  this repository stop answering when the code under them is wrong*.
