---
status: accepted
date: 2026-08-26
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
  - mutation/instrument.test.ts
confirmed-by:
  - battery: meta
    guard: a-guard-collected-and-never-run-is-not-a-guard-that-passed
  - battery: meta
    guard: a-file-that-reddens-names-the-guard-that-reddened-it
  - battery: meta
    guard: a-suite-that-lost-a-guard-outright-is-refused-by-the-total
  - battery: meta
    guard: a-fixture-that-cannot-be-built-names-the-guards-it-took-with-it
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
* Bad: the meta suite gains four guards and about eight seconds, and the instrument gains two refusals
  a reader of `measureCell` has to hold in their head.
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
