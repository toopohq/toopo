---
status: accepted
date: 2026-09-02
governs:
  - CLAUDE.md
confirmed-by: []
---

# A rewrite removes what it orphans, and the census closes at thirteen folders

## Context and Problem Statement

ADR-0199 measured that three batteries had thrown during calibration since `9158603` and that a
fourth disagreed on one cell, and it deliberately repaired none of it: a repair inside the unit that
takes a measurement makes the measurement unreproducible. Its census was therefore a reading of ten
folders, with the other three publishing `alone` as a floor and `never red` as a ceiling.

This is the repair, and the reading the repair makes possible. **The order below is the order a
reader needs**: three of the four causes were established by ADR-0199 and one was not, and what the
fourth turned out to be is why the second half of this record exists at all.

## Decision Drivers

- **Adjusting a pin to re-green a battery is the one gesture that would destroy the instrument.** A
  pin records what a defect really reddened. A pin that disagrees is a regression, a pin the work has
  legitimately moved, or a mutant that is wrong - and which of the three is a measurement.
- A mutant a battery injects is the defect it describes, and not a compile error. CLAUDE.md carries
  that as an open entry, and `number/parse@1`'s own battery header records the same hazard for its
  three cache mutants.
- **Two figures taken under two methods are no more one state than two figures taken at two
  commits.** ADR-0199 published a population keyed by `(folder, identifier)`; anything published
  beside it has to be keyed the same way or the difference between them is not a difference.
- A report may state what it observed and may not name a cause it did not measure. ADR-0042.
- `noUnusedLocals` is ADR-0174's decision and it holds. The flag is not the defect.

## Considered Options

**Relax the flag.** Refused without measuring: ADR-0174 turned it on after refuting the argument for
five of the names it removed, and it caught a real defect on the way in.

**Move `N-4`'s pin to `killed-by-typecheck`.** Refused on the measurement below. It would have
recorded the compiler in place of a measurement and destroyed the one sentence that cell exists to
make.

**Repair the contract sources.** Impossible rather than refused: `signature.test-d.ts` and
`edge-cases.test.ts` are two of `THE_SEVEN_FILES`, so both sit inside digests six contracts are bound
by.

**Repair the lens and the mutant, which are the things that were wrong.** Taken.

## Decision Outcome

### The four causes, each measured at `6d50188`

A blinding lens rewrites the suite; three of them removed the last use of a declaration and stopped
there. The flag then makes the orphan an error, and the **unmutated** control of the blinded column
stops compiling.

| battery | the orphan | what the run said |
| --- | --- | --- |
| `array-group-by` | `import type { GroupBy }` | `'GroupBy' is declared but never used` |
| `string-levenshtein` | `import type { Levenshtein }` | `'Levenshtein' is declared but never used` |
| `string-slugify` | `const DIVERGING_UNDER_AN_ASCII_ALPHABET` | nothing at all |
| `number-parse` `N-4` | `const withoutSeparators` | nothing at all |

Each battery was run on its own and each reproduced. The first two name their file and their message,
because `assertEveryRedFileNamesItsGuard` sees a red file. The other two say nothing, and that is a
second fault rather than a second cause.

### What the empty diagnostic was, established rather than inferred

ADR-0199 refused to attribute `string-slugify` to TS6133 for want of evidence, and it was right to.
The cause is the same family; **what differs is the report, and the report is the instrument's whole
input.** Measured by putting the lens back in its unrepaired shape and running the command
`runSuite` runs, with the json reporter written to a scratch path:

| | `success` | failed assertions | failed files | process |
| --- | --- | --- | --- | --- |
| `edge-cases.test.ts`, a runtime test | **true** | 0 | 0 | exit 1 |
| `signature.test-d.ts`, a type test | false | 0 | **1** | exit 1 |

The slugify report carries **81 `"status":"passed"` and not one `"failed"`** - 77 assertions and four
files - and four empty `"message"` fields. Vitest raises a type error in a runtime test file as an
*Unhandled Source Error*, which never enters the report; in a type test it fails the suite, and the
file's status carries it.

So `runSuite` reads a wholly green report from a red process: `green` is false because the child
exited non-zero, `failedGuards` is empty, no file reddened, and `calibrate` prints
`failedGuards.join()`, which is the empty string. **The empty diagnostic came from the report, not
from an anchor that stopped matching and not from a rewrite that failed to parse.**

**One cause and two faults.** The cause of the red control is the same in all four. The empty
diagnostic is an independent fault of the instrument that the flag merely revealed: *any* type error
in a runtime test file produces it, whatever put it there. This unit removes the instance and not the
class - it is an entry of the open list rather than something repaired here, because carrying the
child's own output into a `RunResult` is a change to `runSuite` and to what a report may say, which
is a unit of its own.

### What the lenses do now

Each lens removes what its first edit orphans: the `import type` on the two signatures, and the
divergence rows with the paragraph explaining them on slugify. That is the rewrite a person blinding
the suite by hand would produce rather than an allowance made for a compiler - a column blind to the
contract's declared type has no reason to name it, and one blind to block 4.4 has no reason to carry
its expectations.

The slugify anchor keeps the blank line that follows `] as const`, so the rewritten file has one gap
where it had one. The filter that computes `differing` still runs the implementation over the whole
table, so the column stays blind to what the answers are and not to whether there are any - which is
what `outputsAreEqual(actual, actual)` does one edit up. Widening the anchor to the whole declaration
was chosen over keeping the constant alive by comparing it with itself: a declaration nothing reads is
dead in the blinded suite, and asserting that it equals itself would be a use invented for the
compiler.

**The declaration's own paragraph is now false and cannot be corrected.** It reads *named rather than
inlined so that the mutation battery can blind this guard in one edit*, and it is two edits. The file
is inside `string/slugify@1`'s digest, `correctionsToFrozenProse` resolves its `about` against case
identifiers, and this is a comment - which is that field's first known limit, already recorded in
CLAUDE.md.

### `N-4` was not a pin the week had moved, and the differential is what says so

`N-4` drops the second look that tells a separator mistake from text that is not a number, and
`withoutSeparators` is read on that line and nowhere else. Measured at `00b8cbd` by applying the
`reason-blind` edit and `N-4` by hand:

| | helper kept | helper removed |
| --- | --- | --- |
| `C/reason-blind` | 122 passed, **0 failed**, 1 `TypeCheckError` | 122 passed, no type errors |
| `C/as-committed` | - | killed, **9 reason guards red**, no type error |

**No guard sees anything either way on the blinded column.** The defect survives there exactly as
`onlySeenUnblinded` says, and what disagreed with the pin was a compile error the mutant introduces.
`killed-by-typecheck` looked like a detection and was the absence of one. The pin is untouched; the
mutant now removes the helper it was the only reader of, and the nine reds on the unblinded column are
a superset of the three the pin names, which is what `agreesWith` checks and what the five-or-fewer
convention allows above five.

### The replay

`pnpm run mutation` at `257425c`: **23 batteries in 63 min 4 s, exit 0, every cell of every battery
agreed with the verdict pinned for it.** 843 defect cells, 801 killed and 42 surviving; 30 probes, 25
killed and 5 surviving. Twenty-eight columns, every one reporting nought unaccounted for.

**Not one pin moved**, which is the result rather than a relief: the repair restored exactly the
columns the pins were written against, so there was no regression in the eight days and nothing the
week had legitimately displaced.

`pnpm run tally` accepts, where ADR-0199 recorded it refusing because three artefacts predated the
commit they would describe. That is a kept command and not a reading anybody took.

### The census, at `257425c`, over thirteen folders read whole

| folder | guards | alone | never alone | never red |
| --- | --- | --- | --- | --- |
| `packages/registry` | 466 | 44 | 149 | 273 |
| `packages/site` | 187 | 84 | 99 | 4 |
| `packages/cli` | 181 | 65 | 114 | 2 |
| `object/deep-equal` | 127 | 5 | 116 | 6 |
| `number/parse` | 122 | 12 | 110 | 0 |
| `date/add` | 121 | 20 | 94 | 7 |
| `number/round` | 119 | 8 | 87 | 24 |
| `array/group-by` | 97 | 11 | 50 | 36 |
| `string/slugify` | 77 | 11 | 62 | 4 |
| `string/levenshtein` | 55 | 12 | 41 | 2 |
| `packages/validation` | 29 | 7 | 22 | 0 |
| `packaging` | 24 | 14 | 8 | 2 |
| `mutation/fixture` | 3 | 0 | 2 | 1 |
| **total** | **1 608** | **293** | **954** | **361** |

**1 247 guards carry an attribution, and 954 of them have never carried a defect by themselves.**
Nought unaccounted for. The perimeter is 23 of 23 artefacts and **873 of 873 cells**, where ADR-0199
had 20 and 699.

**The écart against ADR-0199, which stays stamped at `05a193c` and is not rewritten.** Against its
mixed-perimeter thirteen - 1 608, 284, 816, 508 - the collected population does not move at all,
because whether a battery runs does not change how many guards it collects; `alone` goes **+9**,
`never alone` **+138**, and `never red` **−147**. The −147 is exactly the three ceilings falling:
`array/group-by` 84 → 36, `string/slugify` 64 → 4, `string/levenshtein` 41 → 2. Every floor held -
≥ 8 against 11, ≥ 8 against 11, ≥ 9 against 12 - and so did every ceiling.

**The ten folders ADR-0199 read whole come back identical, row for row.** That is the control that
makes the rest believable: a reader written from scratch, at another commit, reproduces 466/44/149/273,
187/84/99/4, 181/65/114/2 and the other seven exactly. It also settles what `N-4`'s repair cost the
reading - `number/parse` is unmoved at 122/12/110/0.

**Keyed by `(folder, identifier)` the population is 1 608; keyed by the bare identifier it is 1 539,
so 69 collide across folders** - unchanged, as it must be.

**Shadowing and distance.** Of the 954 never alone, **548 sit in an inseparable class** - 136 classes
whose members redden on exactly the same cells, so no existing cell tells them apart - against 501 in
113 over ten folders, the difference being 47 members in 23 classes and all of it in the three folders
that had not run. The remaining **406** have a red pattern of their own, against 300.

### One of ADR-0199's figures does not reproduce, and it is named rather than corrected

Its *152 one companion away* comes out **150** under the rule its own sentence gives - a guard that
reddens beside exactly one other guard on some cell - swept over the same ten folders. Everything
around it reproduces exactly: 501 in 113 classes, the 300 with a pattern of their own, and the three
per-folder figures it names, **40 in `packages/cli`, 29 in `packages/site`, 22 in `packages/registry`**.
Those three match only under the rule read over *every* never-alone guard; read over the 300 alone they
are 28, 27 and 20, which is the narrower sentence the record puts beside them. So the figure is
published here as 150 over ten and **177 over thirteen**, with the rule stated, and ADR-0199's 152
stays where it is: a stamped reading is not corrected, and the two guards between them are not
recoverable without the reader that produced it, which no longer exists.

### What this census costs, declared rather than discovered

**Nobody can retake it without rewriting the reader.** It lives outside the repository, as ADR-0199's
did, because `mutation/results/` is ignored and CLAUDE.md rule 5 keeps working notes out of the tree.
The method is in *More Information* below in enough detail to rebuild it, and the three checks that
make it a reading rather than an assertion are part of that method: the three classes must partition
the collected population, every guard that reddens must be one the attribution collected, and no
column may name a guard in two buckets. A disagreement exits non-zero.

**Making it cheap is a unit of its own and is not taken here.** A kept `pnpm census` would be code in
`mutation/`, which no battery injects into, so it would arrive unwitnessed - the trade this repository
refuses without an argument, and one nobody should take as a side effect of a unit about four
calibrations.

### What a single reading of a battery is worth

Four batteries have now been timed twice on this machine, at `05a193c` and at `257425c`, on work that
did not change:

| battery | ADR-0199 | here | |
| --- | --- | --- | --- |
| `validation-stage-1` | 55.4 s | 55.6 s | +0.4 % |
| `registry-storage` | 1 141.5 s | 1 109.7 s | −2.8 % |
| `site` | 635.4 s | 686.4 s | +8.0 % |
| `cli-install` | 729.4 s | 622.6 s | **−14.6 %** |

**Two runs of one battery on one machine differ by up to 15 %**, and the spread is on the heavy ones
where the light one is stable to a half of one per cent. It is the floor under every bound derived
from a reading, and it was written nowhere. ADR-0199 established that a light battery does not
calibrate a heavy one; this adds that one reading of the *same* battery does not calibrate itself
better than to about a sixth.

## What would reopen this

**A replay at a later commit reopens every figure above**, and none of them is stated in the present
tense for that reason. The census is a reading of `257425c` and of nothing else.

**The shadowing and distance figures move whenever a cell is added.** A class of two dissolves the
moment one mutant reddens one of its members without the other; a rise in the 406 is the population
separating, and a rise in the 177 is a debt getting cheaper to pay.

**The empty diagnostic reopens the day anything reads the child's own output.** Until then, a control
that reddens on a type error in a runtime test file says nothing, and the next reader pays the same
hand investigation this one did.

**A fifth lens or mutant that orphans a declaration reopens the repair.** Nothing here typechecks a
mutant before it is measured - `check-anchors` reads the `find` and never the `replace` - so the
class stays exactly where CLAUDE.md already has it.

**The timing floor reopens on a third reading of any of those four batteries**, which would say
whether 15 % is the spread or the widest of two draws.

## More Information

The census is a reading over what a replay leaves under `mutation/results/`, which `.gitignore` keeps
out of this repository - so the figures above are its only durable product, and each carries the
commit it was taken at.

The reader imports `THE_BATTERIES` to take each battery's own `contractPath`, so the folder is derived
rather than transcribed and the two batteries of one folder are one population. It reads only the
complete `<battery>.json` artefacts and refuses if one is missing, since a total over a subset is a
number that looks exactly like a total. A guard is *collected* when any attribution bucket of any
column of the folder names it; *alone* when some cell's `failedGuards` holds it and nothing else;
*never alone* when it reddens and never by itself; *never red* when no cell's `failedGuards` names it.
A cell is addressed by `(battery, mutant, arm, lens)`, because two batteries of one folder do not share
a mutant namespace. `alone` is read off `failedGuards` and never off the battery's own `loadBearing`,
so the reading does not restate the thing it is checking.

```sh
pnpm run battery array-group-by   # each of the four, on its own, before and after
pnpm run mutation                 # 23 batteries, 63 min 4 s, exit 0, nothing disagreeing
pnpm run tally                    # accepts: 23 artefacts, all of them 257425c
pnpm run freeze                   # green either side, no digest moved
pnpm run ledger                   # byte-identical either side, sha256 a1eea462…
pnpm run anchors                  # every quotation resolves, the three new ones included
```
