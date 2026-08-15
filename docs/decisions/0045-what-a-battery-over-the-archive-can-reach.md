---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/packaging.battery.ts
confirmed-by:
  - battery: packaging
    guard: no-part-of-the-instrument-or-of-the-suite-is-in-the-archive
  - battery: packaging
    guard: every-file-in-the-archive-is-loaded-by-a-command
  - battery: packaging
    guard: the-archive-reaches-no-network
---

# What a battery over the archive can reach

## Context and Problem Statement

Fifteen guards over `packaging/` had been seen red one at a time, by hand, and a hand-run does not
survive the session. The question is what a battery can pin when the thing being measured is a tarball
rather than a module in the working tree.

## Considered Options

- Leave the fifteen as hand-verified, on the argument that the archive is measured by running it.
- Write the nineteenth battery, and declare what it cannot reach.

## Decision Outcome

**The debt is closed: `packaging.battery.ts` is the nineteenth, and it is the first battery whose
guards measure something that does not exist in the working tree.** Fifteen guards had been seen red
one at a time, by hand, and a hand-run does not survive the session. Fourteen mutants now pin what each
one must produce: **eleven of the fifteen are witnessed, five are declared out of reach, one region is
declared unprobed.** It cost about a minute and a half of cells against the *roughly three minutes* the
debt was filed at, which is the one estimate in `CLAUDE.md` that turned out pessimistic.

**And the fourteenth exists because a guard was half blind, which the battery is what makes visible.**
`no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` reads six conditions, and two of them
named a folder anchored at the start of the path. `files` is `["dist"]`, so npm reports everything in
the tarball as `dist/…`, and `startsWith('site/')` could only see the generator shipping as *source* —
while the route the build can take is the compiled one. Measured on the tarball: shipping two modules
of `site/` that way reddened only the loading guard and left this one green; anchored at a path segment
instead, it reddens. **A-08 is not a substitute**, because it reaches the same guard through a
`.test.js`, so anchoring the two conditions back at the start would leave every battery green — A-14 is
the only cell that reddens on the folder condition alone, and therefore the only thing between the
repair and a silent revert.

**A third of the suite is out of reach, and the reason is the folder rather than the guards.** A
battery edits one folder, and `packaging/` is four modules; what its guards are written to catch lives
upstream of all four — `files` in the repository's own `package.json`, the reader in `packages/cli/artefact.ts`,
and the compiled closure of `packages/cli/published.ts`. That is a larger declared share than any other battery
carries, and it is filed guard by guard with the file its failure condition sits in, never because a
mutant was hard to write. **One of the five was measured rather than argued**: nothing an edit here can
do puts a networked module in the archive, because the only `fetch(` in this repository is in
`packages/validation/fixtures/refused.ts`, which no program compiles.

**The two survivors are what the unit found, and both narrow a sentence `packaging/` already
published.** A-12 removes the sort from the artefact's three lists: the archive is 29 606 bytes either
way and the two byte strings differ, so what the sort changes is which order that one string is in —
and the guard comparing two freezes stays green, because both take the same walk. A-13 is the clean,
recorded in [ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md). Neither is a hole and
neither is decorative; what they establish is that a mechanism can be worth keeping while the claim
written beside it is wider than what anything measures.

## Consequences

**And a defect in the archive is killed by no guard at all**, which is the shape this battery has and
no other does: a mutant that stops `npm pack` producing anything fails the suite's `beforeAll`, and
vitest reports the seven guards under it as *skipped* rather than failed. The instrument reads that
correctly — a red run with no failed guard is `killed-by-typecheck` — and the count check still holds,
because a skipped assertion is still an assertion in the report. It is worth writing down because the
verdict's name says compiler and the mechanism is a harness that could not start.

## Confirmation

The three guards named are the ones this record is about rather than the ones it measures: the
half-blind condition A-14 exists for, the loading whitelist that is its independent neighbour, and the
network reach whose out-of-reach status was measured rather than argued.

## What would reopen this

A fifth module in `packaging/`, or the artefact's reader moving into that folder. The out-of-reach
share is a fact about where the failure conditions sit, so it moves when they do.

## More Information

- [ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md) — what the battery measures.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
