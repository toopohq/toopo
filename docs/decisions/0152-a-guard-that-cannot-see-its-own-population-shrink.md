---
status: accepted
date: 2026-08-22
decision-makers: Mathis Perron
governs:
  - mutation/hands.ts
confirmed-by:
  - battery: meta
    guard: every-population-a-reading-can-name-is-one-it-really-sweeps
---

# A guard that cannot see its own population shrink

## Context and Problem Statement

`every-source-that-holds-prose-yields-a-paragraph` asks whether the hands reading extracted a
paragraph from every file it swept that holds prose. It builds its population by calling
`trackedProse()` — the very function a defect would narrow.

Measured at `879ac08`, by committing the narrowing: `trackedProse` reduced to `.ts`, which drops every
Markdown file this repository holds, takes the population from **438 files to 284** and leaves `missed`
empty. `npm run meta` is green and `tsc -p tsconfig.json` is green. **Thirty-five per cent of the
population disappears and the guard reports nothing**, because the sweep supplies the loop: narrowing
it removes cases rather than failing one.

That is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md) word for word,
in a guard whose subject is that a reading which silently saw nothing looks exactly like a clean tree.

**The guard's own comment defends the other axis and does not see this one.** It reads *the two sides
are independent by construction … a change that empties the first cannot empty the second*, which is
true, and is about `looksLikeProse` against `proseOf` — two ways of reading the bytes of a file that is
already in the population. It says nothing about what the loop runs over. The file argues against the
wrong defect, in as many words, on the line above the defect.

## Decision Drivers

- The population of a guard may not be the output of the thing under measurement.
- `mutation/paths.ts` refuses a second statement of what this repository contains, in the file that
  carries the defect: *the derived trees are exactly where a stale answer would hide*. So a pinned
  count and a typed list of paths are both closed before the design starts.
- A candidate that is red on the day it is written, for a reason that is not the defect, is worse than
  no candidate: it teaches a reader to widen it until it is green.
- The two claims — *the extractor answers* and *the sweep reaches* — must be legible as two, or the
  next reader folds them back into one.

## Considered Options

- Pin the population's size.
- Declare a total map from file extension to a verdict, and compare it against `trackedProse()`.
- Sweep `trackedFiles()` with `looksLikeProse`, declaring the formats it cannot speak for.
- Declare the reading's **populations**, and judge `trackedProse()`'s answer against them.

## Decision Outcome

**The fourth.** `THE_POPULATIONS` names the five bodies of prose this repository holds;
`populationOf` returns that type instead of `string`; and one guard requires every declared population
to be one the sweep really reports prose for.

The expectation comes from the five, and `trackedProse()` supplies the answer judged against them —
which is the way round the guard beside it has not got.

### Why the three refused options were refused

**A pinned count** is what `mutation/paths.ts` refuses on its own line 48, and it would reopen the
stamped-figure debt to close this one. Closed before the design started, not weighed.

**A total map from extension to verdict** catches the narrowing, and both of its sides are *does the
name end in X*. That is one method written twice rather than two statements — and removing the
duplication by deriving `trackedProse` from the map turns the comparison back into self-consistency,
which is ADR-0087 one level up. The option is a circle.

**Sweeping `trackedFiles()` with `looksLikeProse` was the strongest candidate and the measurement
killed it.** Over the 460 tracked files at `879ac08` it answers true for three outside `trackedProse`
— `LICENSE`, which *quotes* an installed header; `wrangler.jsonc`; and
`packages/validation/tsconfig.json` — and it misses `.github/workflows/suites.yml`, whose prose is in
`#` comments the predicate cannot see. So the predicate is decidable only on the two formats it was
written for, any exception list is the extension filter restated, and the guard is red on its first day
for a reason that is not the defect.

### Why the populations are a second statement rather than the same one

`populationOf` groups a path for the **report**, in `hands.ts`. `trackedProse` tests an extension for
the **sweep**, in `paths.ts`. Neither is derived from the other, they answer different questions, and
they were written for different callers. What makes the pair work is not that they disagree about
formats — it is that a narrowing expressed in any vocabulary at all empties a population.

Measured at `879ac08` over three narrowings, none of which mentions a population:

| `trackedProse` narrowed to | files | instrument | records | prose | guards | production | |
| --- | --- | --- | --- | --- | --- | --- | --- |
| nothing, as it stands | 438 | 54 | 151 | 3 | 91 | 139 | green |
| `.ts` | 284 | 54 | **0** | **0** | 91 | 139 | **red** |
| `.md` | 154 | **0** | 151 | 3 | **0** | **0** | **red** |
| `packages/` | 168 | **0** | **0** | **0** | 61 | 107 | **red** |

### The pair, seen rather than argued

The point of the change is that this repository now holds two claims where it held one, so the
evidence is a pair of verdicts and not a single red. With `|| path.endsWith('.md')` taken out of
`trackedProse`:

    hands.test.ts (3 tests | 1 failed)
      × every-population-a-reading-can-name-is-one-it-really-sweeps
    AssertionError: expected [ 'records', 'prose' ] to deeply equal []

`every-source-that-holds-prose-yields-a-paragraph` **passed through that red**. One guard fires and
its neighbour does not, on the same perturbation, which is what says they are two claims and not one
written twice.

Seen red in the other direction by declaring a sixth population nothing returns — `expected
[ 'archive' ]` — and the direction under it is the compiler's rather than a guard's: `populationOf`
returning a name `THE_POPULATIONS` does not carry is `TS2322`, measured. So one guard and one type
annotation hold both directions, and no staleness guard is owed.

### Good

- The defect is closed by a guard that runs in continuous integration on the day it is written:
  `hands.test.ts` is collected by `mutation/vitest.config.ts`, and `npm run meta` is a step of
  `suites.yml`. No workflow was edited.
- The declaration has five rows whatever the tree holds, so it is not the inventory `paths.ts` refuses.
  git still answers what this repository contains, once.
- `populationOf` was an export with no caller outside its own file. It now carries a claim.

### Bad, and named rather than smoothed

**The guard is total over populations and never over files.** A narrowing that keeps one file in each
of the five passes it. The thinnest population is `prose` at **three** — `CLAUDE.md`,
`CONTRIBUTING.md`, `README.md` — so a filter keeping those three and dropping the other 151 Markdown
files is invisible here. The number is written because *it does not see everything* is not a
measurement and **three** is.

**It is born without a witness.** The guard lives in `mutation/`, which no battery injects into, so
nothing measures what it is worth — the class
[ADR-0149](0149-a-change-to-the-instrument-selects-the-batteries-it-is-read-by.md) already names for
the same reason. What stands in its place is that it was seen red on three conditions, two of them
published above.

**The reading is still in no workflow, and that is a separate thing rather than the other half of
this one.** `npm run hands` appears in no job. Putting it in one would make the *reading* execute; it
would not have caught this defect, because the guard was green. And
[ADR-0112](0112-the-prose-that-no-commit-authored.md) refuses a guard over hands — its cheapest
satisfaction is a reflow — so a job running it is either a step nobody reads or the guard that record
refused, for 438 `git blame` child processes. Left where `CLAUDE.md` keeps it.

**Nothing executes `readHands` or `renderHands`.** The guards reach `proseOf` and `handsOn`;
`every-paragraph-a-reading-reports-is-attributed-to-a-commit` reads one file, so a blame that failed to
parse on a different file would surface only in the command.

**Three formats hold prose this reading does not sweep, and this unit did not widen it.** Measured at
`879ac08`: `wrangler.jsonc` and `packages/validation/tsconfig.json` carry argued prose in C-style
comments that `commentProse` would read today, and `.github/workflows/suites.yml` and the two `.yaml`
files carry theirs in `#` comments no reader here can read. `paths.ts` already tells this story about
the *citation* guards and closed it there by sweeping `trackedFiles`; the hands reading still narrows.
Widening it is a decision about what `npm run hands` reports, and the hash-comment half needs a reader
that does not exist.

## What would reopen this

- **A population reaching one file.** The guard's strength is the size of the thinnest population, and
  `prose` is three. If it reaches one, the guard is satisfied by a single file and the argument above
  stops holding; the answer then is a claim about files, not about populations.
- **A sixth population.** Adding one to `populationOf` is a type error until it is declared, which is
  the intended door — but a population declared for a folder that does not exist yet would sit red
  until it does, and this record does not say which way that should go.
- **A battery injecting into `mutation/`.** The guard would then have a witness, and what it is worth
  would be measured rather than asserted from three reds.
- **A reader for hash comments.** It would put `suites.yml` and the two `.yaml` files inside
  `trackedProse`, at which point the extension filter is no longer what decides the population and the
  pair above has to be re-taken.

## More Information

The population figures come from `git ls-files` at `879ac08`: 460 tracked files, of which 284 `.ts`
and 154 `.md` make the 438 `trackedProse` returns; the remainder are 15 `.json`, 3 extensionless, 2
`.yaml`, 1 `.yml` and 1 `.jsonc`.

[ADR-0055](0055-totality-by-the-compiler-beats-a-pass-over-the-data.md) is the rule the declaration
follows — a total map over a union cannot fail to be complete, where a pass over real data covers what
the data happens to reach. [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why every
number here carries the commit it was taken at.
