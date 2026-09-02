---
status: accepted
date: 2026-09-02
governs:
  - CLAUDE.md
confirmed-by: []
---

# Three calibrations were red for five days, and the census is what found them

## Context and Problem Statement

CLAUDE.md carries an open entry asking whether a guard declared applicable has ever been seen red on
its own failure condition, **alone**. It carried one figure, stamped at `9e41d44` off `npm run battery
site`: 191 guards attributed, 88 seen red alone, 103 not. Its own sentence said what that was worth —
*it is one battery of twenty-three and the other twenty-two are unread*.

Reading the other twenty-two needs the batteries to be run. Running them is what nobody had done since
2026-08-27, and that is why this record has two halves rather than one. **The order below is the order
a reader needs**: the breakage explains the census's perimeter, so it cannot come after it.

The two findings arrived together because they are the same gesture.

## Decision Drivers

- A total over artefacts written at different commits is not a reading of any commit. `pnpm tally`
  refuses exactly that, and a census that ignored the refusal would be the shape ADR-0018 forbids.
- A guard is addressed by the pair `(folder, identifier)`. An identifier is unique within its contract
  and not across the catalogue.
- A report may state what it observed and may not name a cause it did not measure. ADR-0042.
- Nothing is repaired here. A repair inside the unit that takes the measurement makes the measurement
  unreproducible, and the figures are the product.

## Considered Options

**Read the artefacts already on disk.** Free, and refused: 22 of the 23 predate the commit they would
describe, so the total would hold at no commit at all.

**Replay everything, then count.** Taken. Priced before it was run, and the price was wrong — see
*What the estimate cost* below.

**Replay only the cheap batteries.** Refused: the four heaviest hold 437 of the cells and the largest
guard populations, so the partial would omit precisely what the question is about.

## Decision Outcome

### The instrument had stopped running, and no gate could see it

`pnpm run mutation` at `05a193c`: **23 batteries in 60 min 14 s, exit 1, four disagreeing.** Three of
the four never measured a cell — they threw during calibration, because the **unmutated** control of a
lens was red.

| battery | what happened |
| --- | --- |
| `array-group-by` | `C/identity-blind` control RED — `signature.test-d.ts`, 9 guards collected, none failed, *'GroupBy' is declared but never used* |
| `string-levenshtein` | `C/identity-blind` control RED — `signature.test-d.ts`, 5 guards collected, none failed, *'Levenshtein' is declared but never used* |
| `string-slugify` | `S/table-blind` control RED, **and the diagnostic is empty** |
| `number-parse` | ran whole; `N-4` on `C/reason-blind`, *expected survived, measured killed-by-typecheck* |

*'X' is declared but never used* is **TS6133**, which `noUnusedLocals` raises. That flag arrived at
`9158603`, **2026-08-28T21:37**, the commit ADR-0174 records. A blinding lens removes a declaration;
the flag then makes what the lens orphaned an error; the unmutated control stops compiling. The lenses
were written before the flags existed.

**The chain is measured end to end, and it is the finding rather than the flag:**

1. The last run in which all 23 batteries were green is `1cf8ecd`, 2026-08-27 — the `1.1.0`
   publication. `git merge-base --is-ancestor 9158603 1cf8ecd` answers 1: the flags are **not** in it.
2. On `9158603` itself the push gate selected **ten** batteries and every one was green. The selection
   follows folders, and `tsconfig.json` is in no battery's folder, so the four batteries the commit
   breaks were not among the ten.
3. `every-battery` was `skipped` on that run, as on every run since: it fires only before a
   publication, and there has been none since `1.1.0`.
4. Nothing selected them again. **Five days and some fifty commits later, the first full replay finds
   them.**

This is not a guard that cannot fail. It is **the instrument unable to run**, and the only mechanism
that would have noticed is cadenced on publications. CLAUDE.md's own entry on the selection says so in
advance — *a guard reddened from a neighbouring folder is bounded by the second gate, which is to say
by the cadence of publication rather than by never*. That sentence has now fired, and **what the
cadence was worth is five days.** ADR-0146, ADR-0149.

Nothing is repaired. `pnpm freeze` is green either side, the ledger is byte-identical, the tree is
clean and one checkout is registered.

### What is left unestablished

`string-slugify`'s `S/table-blind` control is red and **the run named no file**: the error reads *the
unmutated S/table-blind is red, so every verdict from this battery would be noise:* and then nothing.
It is a different arm and a different lens from the other two, and **no measurement here attributes it
to TS6133**. It is written as a hole rather than as a plausible cause, which is what ADR-0042 asks of a
report.

### The census

**The perimeter, declared rather than sampled.** 20 of the 23 artefacts describe `05a193c`; the three
excluded are the three that threw. That is **699 of 873 cells**. The three excluded folders keep the
reading of their `-spec` battery, so for them `alone` is a **floor** and `never red` a **ceiling**.

**Over the ten folders read whole, at `05a193c`:**

| | |
| --- | --- |
| guards collected | **1 379** |
| carrying an attribution | **1 060** |
| — seen red **alone** | **259** |
| — **never alone** | **801** |
| **never red** | **319** |

So **801 of the 1 060 guards that redden at all have never carried a defect by themselves** — the
generalisation of the entry's *88 and 103* from one battery to ten folders.

| folder | reading | guards | alone | never alone | never red |
| --- | --- | --- | --- | --- | --- |
| `packages/registry` | whole | 466 | 44 | 149 | 273 |
| `packages/site` | whole | 187 | 84 | 99 | 4 |
| `packages/cli` | whole | 181 | 65 | 114 | 2 |
| `object/deep-equal` | whole | 127 | 5 | 116 | 6 |
| `number/parse` | whole | 122 | 12 | 110 | 0 |
| `date/add` | whole | 121 | 20 | 94 | 7 |
| `number/round` | whole | 119 | 8 | 87 | 24 |
| `packages/validation` | whole | 29 | 7 | 22 | 0 |
| `packaging` | whole | 24 | 14 | 8 | 2 |
| `mutation/fixture` | whole | 3 | 0 | 2 | 1 |
| `array/group-by` | partial | 97 | ≥ 8 | 5 | ≤ 84 |
| `string/slugify` | partial | 77 | ≥ 8 | 5 | ≤ 64 |
| `string/levenshtein` | partial | 55 | ≥ 9 | 5 | ≤ 41 |

Across all thirteen, perimeter mixed: 1 608 collected, 284 alone, 816 never alone, 508 never red.
**Nought unaccounted for**, in every battery that ran.

**The composed key is a result and not a note of method.** Keyed by `(folder, identifier)` the
population is **1 608**; keyed by the bare identifier it is **1 539**. **Sixty-nine identifiers collide
across folders** — `determinism` exists on several contracts and is not one guard there. A union over
bare identifiers publishes a total that is wrong by that much, with a method that looks clean.

**The hole is measured rather than described.** No battery injects into `mutation/`, so the meta suite
— **115 guards over 10 files** — is outside this population by construction.

### What replaces the distinction that was asked for

The question put was to separate *nobody has written the cell* from *alone is unreachable by any
plausible mutant*. **The second is not measurable from a run**: it is a claim about mutants nobody
wrote. Two measurements answer the question the distinction was about, and they name what a total
cannot:

**Shadowing.** Of the 801 never alone, **501 sit in an inseparable class** — a set of guards reddening
on exactly the same cells everywhere they are collected, so **no existing cell tells them apart**. 113
such classes over the ten folders. It is where *alone is unreachable* actually lives, and it names the
pairs; that every guard in a class is never alone is a tautology, and it stands as the consistency
check it is rather than as a finding. Sixty-three of the classes are pairs, and reading them separates
two shapes the count cannot: `the-key-function-receives-the-element-and-its-index` beside its
`-in-the-language` twin is a pair no plausible cell parts, while `a-blank-string` beside
`the-empty-string` on `number/parse` is two different inputs that no mutant has happened to separate.

**Distance to isolation.** The remaining **300** have a red pattern of their own, and **152 of them are
one companion away** — there is a cell on which they redden beside exactly one other guard. Forty in
`packages/cli`, 29 in `packages/site`, 22 in `packages/registry`. These are the cheapest to isolate,
and they are what says what is left to do.

The deepest are the other end: 43 guards of `object/deep-equal` redden on exactly one cell, with 101
companions each.

### The guards that are inert, named and not repaired

The 319 never red over the ten folders are each accounted for by their battery:

| bucket | count | where |
| --- | --- | --- |
| `unprobedClaims` — claims detection, decorative until a mutant reaches it | 275 | **262 in `packages/registry`** |
| `unprobedDecisions` — documents a decision, which stands anyway | 142 | 65 `array/group-by`, 45 `string/slugify` |
| `outOfReach` — unreachable by construction | 91 | 24 `number/round`, 17 `array/group-by` |

**Two hundred and sixty-two of the 466 guards of `packages/registry` are declared decorative until a
mutant reaches them.** Every one of those declarations was written deliberately and none is silent —
what had never been done is to read them as a proportion. More than half of that suite is a region its
battery does not probe, and no reader of the individual declarations would have known it.

### What the estimate cost, as a rule

The replay was priced at 1 h 45 to 2 h 30 and took **60 min 14 s**. The estimate was calibrated on one
battery, `validation-stage-1`, whose local time is 0.92 of the runner's, and that ratio was applied to
all of them. It does not hold:

| battery | local | runner, setup removed | ratio |
| --- | --- | --- | --- |
| `validation-stage-1` | 55.4 s | ~60 s | 0.92 |
| `registry-storage` | 1 141.5 s | ~1 142 s | 1.00 |
| `cli-install` | 729.4 s | ~1 525 s | 0.48 |
| `site` | 635.4 s | ~1 317 s | 0.48 |

**A light battery does not calibrate a heavy one.** The ratio runs from 0.48 to 1.00 depending on what
throttles a cell, and a single calibration point taken on the cheapest battery mispriced the total by a
factor of two. It is the same shape as the Windows bound of ADR-0169, which is derived from six
readings rather than from one, and it generalises: **a bound extrapolated from one member of a
population states the cost of that member.**

**And an exit code is read off the thing being asked about.** This replay was launched as a background
command ending in a second statement, so the harness reported the exit code of the wrapper — nought —
while the replay had exited 1 with four batteries disagreeing. The existing rule about masked exit
codes covers a pipe and did not cover this.

### The reconciliation carried out on the way

`theMeasurement()` answers **843 defects and 30 probes**, which sum to the **873** cells the batteries
declare. The README publishes the 843, and the two are not a discrepancy: `published.ts` refuses to
hand out the aggregate without its split, so the population a reader meets is the defects alone.

## What would reopen this

**A replay at a later commit reopens every figure above**, and none of them is stated in the present
tense for that reason. The census is a reading of `05a193c` and of nothing else.

**The three partial folders close it the day their batteries run.** Their `alone` counts are floors;
the reading is completed by four minutes of machine time once the calibrations are green, and that
repair is a unit of its own.

**The shadowing figure moves whenever a cell is added**, because a class of two dissolves the moment
one mutant reddens one of its members without the other. A rise in the 152 is a debt growing; a fall
is somebody paying it.

**`packages/registry`'s 262 reopens on any mutant that reaches one of those regions**, which is what
its own `unprobedRegions` declarations exist to invite.

**The gap in the gate reopens the day a battery matrix runs on something other than a publication.**
What was measured here is that a change to a root file selects no battery and that the full matrix is
publication-cadenced; either half moving changes what five days was worth.

## More Information

The census is a reading of what a replay leaves under `mutation/results/`, which `.gitignore` keeps out
of this repository — so the figures above are the only durable product of the run, and each carries the
commit it was taken at. Rebuilding them means running the replay again, which is ADR-0061's whole
subject.

The reading keys guards by `(folder, identifier)`, taking the folder from each battery's own
`contractPath`; it counts a guard as *alone* when some cell reddens it and no other guard, addressing a
cell by `(battery, mutant, arm, lens)` because two batteries of one folder do not share a mutant
namespace. It is a probe rather than a guard and is described rather than kept, for the reason rule 5
gives.

```sh
pnpm run mutation      # 23 batteries, 60 min 14 s, exit 1, four disagreeing
pnpm run tally         # refuses: three artefacts predate the commit they would describe
pnpm run freeze        # green either side, no digest moved
pnpm run ledger        # byte-identical either side
pnpm run meta          # 115 guards over 10 files, which no battery injects into
```
