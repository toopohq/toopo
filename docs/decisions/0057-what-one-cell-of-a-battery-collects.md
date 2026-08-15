---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
  - mutation/census.ts
confirmed-by:
  - battery: meta
    guard: a-contract-battery-is-compared-against-its-own-contract-alone
---

# What one cell of a battery collects

## Context and Problem Statement

Every cell of a contract battery ran the entire contracts' suite, so the cost of a replay grew with the
product of the catalogue's cells and the catalogue's suite — seven minutes at five contracts, eighteen
hours at a hundred. The page that hands `npm run mutation` to a stranger stops being an invitation
somewhere in between.

## Considered Options

- Leave the cell collecting the whole suite, and accept the quadratic.
- Narrow a contract battery's cell to its own contract's suite.

## Decision Outcome

**A contract battery's cell now collects its own contract's suite, and the whole of the value is a
slope.** Measured over one to five contracts, three runs of each, a suite run costs `705 + 78·N` ms;
the 74 cells a contract carries turn that into `52·N + 5.8·N²` seconds, which is the quadratic the
method page's invitation dies of. Narrowed, a run costs 743 ms whatever N is and the same cells cost
`55·N`.

**At five contracts it is worth two minutes nineteen, and that figure invites the wrong conclusion.**
Measured on the ten contract batteries alone, before and after: **10 min 9 s → 7 min 50 s**. The
comparison is deliberately those ten and not two full replays, because two replays of identical work on
this machine differ by more than this change does — `cli-install` alone has moved 95 s between runs of
the same cells. There is no saving to sell today; there is a term that grew and is now flat.

**Which configuration can be narrowed is a measurement, not a choice, and that is what makes the design
unarguable.** A vitest filter ending in `/` is resolved against the configuration's own root; a filter
without one is a substring of the whole path. Six of the seven configurations set `root` to their own
folder, so a filter naming that folder resolves *under* it and names nothing. Measured on vitest 4.1.10:

```
--config registry/vitest.config.ts   registry/                 0 files, exit 1
--config registry/vitest.config.ts   registry                 16 files - a no-op
(the contracts' configuration)       contracts/number/parse/   4 files, 122 assertions
```

The two filters in that transcript are the strings that were really typed, at the paths of the day, and
they are left as they were run: a transcript is redacted of what is not its subject and never rewritten
to match a tree that has moved since. What it establishes is how vitest resolves a trailing slash.

So the narrowing is expressible under the contracts' configuration, whose root is the repository, and
under no other — nobody can generalise it to the six, because vitest does not permit it. The six need
none: their own `root` and `include` already collect exactly the folder their battery injects into. The
trailing slash is also what makes the filter precise, since `contracts/number/parse` without it would
match a future `contracts/number/parse-int`.

**The census is selected, never redeclared, and that is the premise this unit removed rather than
paid.** A narrowed run collects a fraction of its configuration, so it cannot be compared against the
whole table — and the obvious repair, *a census per battery*, multiplies every integer in a file that
already grows with the catalogue. What a run collects is instead selected from the same table by the
folder the battery injects into: a field it already holds, and already the predicate `run.ts` used to
decide which guards were its own. **No integer is new and none moved.** For the six own-root
configurations the selection is the whole table, so it is one rule with no branch — which is what makes
its refusal cover every battery rather than only the narrowed ones.

## Consequences

**The wall this does not move, said rather than left to look addressed.** Four to five hand-written
counts per contract, twenty-one for the five, ~2 100 at five hundred. Deriving them was measured and
refused: over the five, an `edge-cases.test.ts` collects `cases + 1`, `cases + 4`, `2 × cases + 1`,
`2 × cases + 6` and `cases + 4` — the constant differs per contract, so a derivation needs a
hand-written integer *and* a formula, where the formula is a second statement about the shape of a test
file. The counting is its own demonstration: reading `id:` off the five case tables gives 194 where the
catalogue publishes 187 cases, because a group carries one too.

**`ownGuards` went with the difference it expressed.** A pin resolved against every guard the run
collected and a declared silence against the guards of this contract, because the run collected all
five and the two sets differed. A narrowed run makes them one set, so the parameter that expressed the
difference is gone — two mechanisms over one scope have nothing to say on the day they disagree, which
is the argument that already refused a second guard over profile names. The cost is that a pin may no
longer name a guard outside its own contract, which is a tightening: measured over the ten contract
batteries before any of this was written, **220 pins, 409 declared silent guards and 8 declared silent
suites, and not one needed the wider universe.**

**Two refusals, each seen red alone.** A configuration nobody has counted was already refused; a folder
no counted file lies under is the new half, and it fails on the opposite condition — an empty census
agrees with a run that collected nothing. What it buys was measured by removing it: calibration walks
on and dies on `Command failed: git checkout HEAD -- mutation/fixture-renamed`, naming no census, no
configuration and no count, in front of somebody who has just renamed a folder.

**And the mechanism that saves the time carries no guard of its own, deliberately.** A filter dropped
makes the run collect the whole configuration and the census refuses it by naming every file it did not
declare; a filter added to one of the six collapses the run and the same refusal names every file that
collected nothing. Both directions were already held by the mechanism that was there.

## Confirmation

**The acceptance criterion was the 370 verdicts, and what it bought was the eight cells it did not
excuse.** Every contract-owned cell was measured under both regimes and compared on its verdict *and*
on `failedGuards`: **0 verdicts differ, 0 cells absent on either side.** Eight cells moved a guard, so
the question was settled by a control rather than by the structural argument — two runs under the *same*
regime move **ten**, and every guard that moves in either comparison lives in `properties.test.ts`,
none in a case table, a profile or a signature. **The re-drawing is louder than the change**, which is
the only form in which that comparison could have been believed.

## What would reopen this

A seventh configuration whose root is the repository, which would make the narrowing expressible
somewhere it is not today. The measurement above is about vitest's filter resolution and would have to
be taken again.

## More Information

- [ADR-0056](0056-a-control-that-is-red-with-nothing-injected.md) — the census this record selects
  from, and the door it is the backstop for.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
