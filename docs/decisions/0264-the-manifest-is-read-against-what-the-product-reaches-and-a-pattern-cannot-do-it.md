---
status: accepted
date: 2026-09-09
governs:
  - packaging/what-the-product-imports.ts
  - mutation/packaging.battery.ts
  - CLAUDE.md
confirmed-by:
  - battery: packaging
    guard: the-runtime-dependencies-are-the-packages-the-product-reaches
---

# The manifest is read against what the product reaches, and a pattern cannot do it

> **Nothing is published and nothing is corrected.** `dependencies` and `files` are read and left
> exactly as they were; `THE_PACKAGE_VERSION` stays at `1.2.0`, nothing reaches npm, no digest is
> minted and no tag is posted. The ledger is `18cc4e82…` at 1 206 bytes either side and `pnpm freeze`
> is 3 passed either side.

## Context and Problem Statement

`dependencies` is the field `npm install` walks. `files: ["dist"]` bounds what a tarball *carries* and
bounds that field not at all, so a package moved from the dev list to the runtime one is installed
into every consumer's project by the next release. The two mechanisms stage rule 3 names are real and
are about files: `no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` asks what the tarball
holds and `every-file-in-the-archive-is-loaded-by-a-command` asks whether a command loads it. **Neither
reads either dependency list**, and no module of `packaging/` did.

So the criterion stage rule 3 states was kept by care. The reader it protects is somebody who typed
`npx toopo add …`, which is what separates this from hygiene.

## Decision Drivers

* **A guard born green is justified by the event it would catch and by what that event costs**, never
  by what it finds now. Both have to be named for the guard to be written at all.
* **A guard with no witness is not a guard here.** Four entries of the open list are refused on that
  alone, and a fifth would have to say so rather than be built.
* **The count an object prints beats the count a pattern derives**, which this repository has now
  been corrected on twice in a week.
* **A parser is written once and reached** — ADR-0026 — so a second reader has to be a different
  reading rather than a second copy.

## Considered Options

1. **A pattern over bare specifiers**, reusing `specifiersIn`'s anchors. Cheapest, and refused on the
   measurement below.
2. **A parse**, through `typescript/unstable/sync`. Exact and spawns the compiler.
3. **The scanner this repository already drives**, in process, with comments excluded because the
   language names them.

## The witness, which is what made the unit takeable

`mutation/packaging.battery.ts` declares `contractPath: 'packaging'`, so a guard in that folder is
injected into by an existing battery. That question was answered before a line was written, because
the answer decides whether the unit exists: the same guard in the meta suite would have been the
**sixth** refused on the witness, and the honest outcome would have been to say so.

**The tax is the one this repository wrote down two units ago.** A guard's own duration is multiplied
by the cell count of the folder it lands in, and `packaging` is 20 cells. The guard is 42 ms of test
time, so the replay pays about a second.

## The measurement that decided the reader

**The population is stated before any figure.** The files are every one `closureFrom` reaches from
`packages/cli/published.ts` under `sourceNamedBy` — **43**, where the entry that opened this record
said 41 and asked for a re-measurement. The specifiers are those in the three spellings `specifiersIn`
recognises, in each of those files.

**Option 1 was refused by trying it.** With `specifiersIn`'s own anchors, a pattern over bare
specifiers answers **five packages, of which four do not exist**:

| what the pattern answered | where it came from |
| --- | --- |
| `typescript` | real, and also a line of prose |
| `did the lockfile change at all` | a sentence in `install.ts` and in `report.ts` |
| `we changed this underneath you` | a sentence in `needs.ts` |
| `the registry lost it` | a sentence in `value.ts` |
| ` +\n  ` | a sentence in `endpoints.ts`, spanning a line |

Every one is prose in which the word `from` precedes a quoted phrase. It also over-counts the relative
specifiers by two and the `node:` ones by two, from the same cause. **A guard built the cheap way is
red on its first run, naming four packages that are not there.**

### Why `specifiersIn` is sound anyway, which is the finding

The walk is not saved by its pattern. It is saved by its own shape: a phantom relative specifier names
a file that does not exist, and `closureFrom` ends that branch. **A phantom file is discarded by the
filesystem; a phantom package has nothing to discard it.**

Measured rather than argued: the pattern's closure and a scanner-driven one both answer **43**, file
for file identical. So the cheap reader stays where a wrong answer is discarded and the exact one is
written where a wrong answer would be published, with the reason beside each. This is not ADR-0026's
second copy of a parser; it is the reading that parser cannot make.

## Decision Outcome

**Option 3.** `packaging/what-the-product-imports.ts` drives `everyTokenIn` and reads three tokens at
a time: a string literal whose preceding token of substance is `from` or `import`, or whose two
preceding ones are `import` and `(`. Trivia is excluded by the enum's own `FirstTriviaToken` to
`LastTriviaToken` range rather than by a list kept here, so a new trivia kind cannot arrive as a token
of substance. **A comment is a token the language names, so prose cannot reach the reading at all** —
structural, and not a better expression. It costs a lexing of 43 files and no child process.

ADR-0156 is the precedent: a hand-rolled scan of these same sources lost template parity at line 204
of one file, never resynchronised, raised no error and returned a plausible number.

**It lives under `packaging/` and not beside the walk**, measured rather than preferred:
`packaging/reachable.ts` is imported by `packages/registry/serialise.ts` and by
`mutation/selection.test.ts`, so a scanner import added there would put the lexer on both their graphs
to serve one guard. Neither `reachable.ts` nor `packages/site/scanning.ts` is inside what the
published entry point reaches, so nothing here changes what an install downloads — which is the one
way this unit could have defeated its own subject.

## The guard, red before green

`the-runtime-dependencies-are-the-packages-the-product-reaches` asserts one object with two lists,
whole rather than counted, for the reason the freeze's faults are: they are different defects wearing
each other's clothes and a count is satisfied by either.

**Both directions were seen red, each on its own condition and each restored to the byte.**

| perturbation | what the guard said |
| --- | --- |
| `wrangler` added to `dependencies` | `declaredAndNotReached: ['wrangler']` |
| `import 'happy-dom'` in `packages/cli/list.ts` | `reachedAndNotDeclared: ['happy-dom']` |

Then green: 1 test, 42 ms, and the manifest and the walk agree on `typescript` alone.

**Then the cell, measured before it was pinned.** `A-29` neuters the clause recognising `from`, and
the suite answers **1 failed of 25** over four files — this guard alone, naming
`declaredAndNotReached: ['typescript']`. The clause is neutered rather than removed for `W-179`'s
reason: `before` is read by the two clauses below it, so deleting the binding would be a
`killed-by-typecheck`, which is the compiler detecting where the point is a guard detecting.

The direction the cell injects is **under-reading**, which is the one that matters: a reader that
misses an import makes a declared package look unreached, where a reader that invents one is what the
pattern does and is why the scanner is here at all.

## Consequences

**Stage rule 3 has a third mechanism and it is the first that reads a list rather than a file.** The
criterion is now kept in the place a reader of that rule arrives.

**What it does not cover is in the guard's own header rather than smoothed.** It reads sources and not
`dist/`; it reads one entry point, `bin.toopo`; it says nothing about a version, ADR-0097 being where
the pinning is argued; it says nothing about what a declared dependency itself depends on;
`optionalDependencies` and `peerDependencies` are not read and neither exists today, so the guard
would be silent about one added tomorrow rather than refusing it; and a specifier composed at run
time is invisible, which is ADR-0149's own published blind spot arriving on a second reader.

**And a cell moved a fourth surface, which is the cost this repository already counts.** `A-29` took
the instrument to 1 030 cells and 988 caught, and
`every-figure-in-the-readme-is-the-one-the-instrument-declares` reddened the `meta` battery at
calibration and named all three README figures. It could not have been written into the same commit:
what the instrument declares is derived from the pins, so the figure does not exist until the cell
does.

## What would reopen this

* **A second `bin` entry.** The reading is one closure from one entry point, so a second binary is a
  second closure this guard does not walk.
* **A build step that injects an import.** Compilation adds none today, which is what makes reading
  sources equivalent to reading `dist/`; a step that did would put the two out of step silently.
* **A specifier composed at run time inside the closure.** Nothing writes one today and the guard
  would not see it.
* **`optionalDependencies` or `peerDependencies` appearing in the manifest.** Neither is read, and the
  day one exists this guard is silent about a field that reaches a consumer.

## More Information

ADR-0026 is why a parser is written once and reached. ADR-0097 is the dev-dependency criterion and the
pinning. ADR-0149 is the templated-`import()` blind spot. ADR-0156 is the precedent for choosing the
compiler's own reader over a hand-rolled one. ADR-0206 is where the tax a guard pays per cell is
written. ADR-0246 is the battery that made a guard in `mutation/` witnessed, and the reason this one
did not need it.
