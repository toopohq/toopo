---
status: accepted
date: 2026-08-17
governs:
  - packages/registry/against-what-was-published/vitest.config.ts
  - packages/registry/local-read-api.ts
  - mutation/decisions.ts
  - .github/workflows/suites.yml
confirmed-by:
  - battery: freeze
    guard: every-published-binding-still-hashes-to-what-it-was-published-as
  - battery: freeze
    guard: nothing-this-tree-binds-escapes-the-freeze-check
  - battery: registry-storage
    guard: every-binding-anchors-a-commit-and-the-check-reaches-all-of-them
---

# The freeze check lives where nothing replays it, and a green that is right by accident is a green that lies later

## Context and Problem Statement

[ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) published the catalogue and anchored every
binding at the commit that minted it. Until something reads that coordinate, permanent rule 6 is the
biggest `one-directional` declaration this repository carries: *a published version is frozen for life*,
with nothing making it hold for the four contracts it now holds for.

`rebindingFaults` and `bindingsAtRevision` have existed since ADR-0093 and were proved on fixtures, on a
built subject and with the past supplied. **Nothing asked the question about this catalogue at this
commit.** The only thing that had to be decided was where the guard that asks it may live.

## Considered Options

- `packages/registry/`, beside the eight guards that already prove the mechanism.
- A folder of its own with its own configuration, collected by no battery.

## Decision Outcome

Chosen: **`packages/registry/against-what-was-published/`, its own configuration, its own script, run
by CI and by no battery.**

### The measurement that made the first option look safe, and the reading that kills it

Measured before anything was written. A contract battery collects only its own contract folder —
`node run-vitest.ts run --typecheck contracts/typescript/string/slugify/` reports 4 files and 77 tests,
and `theFilesToCollect` is why — so no contract mutant can reach a guard in `packages/registry/` at all,
even though every contract mutant moves the frozen digest: injecting `G-01` moves
`typescript/string/slugify@1` from `855107da…` to `7b01a84e…`.

The battery that *does* collect that folder is `registry-storage`, and its mutants move every digest:
`I-05`, its own calibration mutant, moves all eight. **And the replay would survive it**, because
`agreesWith` requires only that a cell's pinned guards are among the reddened, and all fifty-nine cells
of that battery are pinned `killed` — zero `survived`, zero `killed-by-typecheck`.

So the first option is green today, and that is exactly the objection to it. `agreesWith` stops
tolerating an extra red the moment a cell is pinned `survived`. **The day `registry-storage` gains one —
an equivalent mutant, a region nothing covers, the ordinary fate of every battery that lives long
enough — a freeze guard reddening on it turns its verdict to `killed` and the replay reports a
disagreement nobody can attribute to a defect.** A green that is correct for a reason nobody chose is a
green that lies later, and this repository has taken three of those apart in one week.

### The second argument is a collision this repository has already paid for

The guards here check a past commit out and run a child process in it. The instrument checks arms out,
adds worktrees and refuses to start if one is left registered. [ADR-0102](0102-the-instrument-restores-gits-state-beside-the-files.md)
cost a whole unit to isolate one collision of that kind, and it broke replays for twenty commits with
nothing saying so. Putting a second git-manipulating mechanism *inside* the first, sixty times per
replay, is asking for it again in the most expensive place there is.

The wall-clock argument is real and is the least of the three: `registry-storage` makes sixty suite runs
at 8.53 s each today, and a rebuild is a checkout and a node process apiece.

### The price, stated in the same terms as the suite it copies

**No mutant of this repository ever reddens these two guards, so their detection power is not measured
by the instrument.** That is what a decision confirmed under `freeze` costs, it is the same price
`packaging/against-the-origin/` pays under `origin`, and `mutation/decisions.ts` now says so where the
three pseudo-suites are declared rather than leaving somebody to go looking for a cell that does not
exist.

What stands in its place is that they were seen red on their real conditions, more than one, each red
read rather than assumed.

## Consequences

**`the-five-anchor-nothing-and-the-check-says-which` reddened on the event its own comment had named**
and became `every-binding-anchors-a-commit-and-the-check-reaches-all-of-them`. The prediction is kept in
ADR-0093 word for word and the retirement is recorded there: a guard that writes down in advance what
will falsify it, and is then falsified by exactly that, is worth more than the assertion it carried.

The two halves are deliberately split by cost. The population statement — *every binding is anchored* —
is a comparison in memory and stays in the registry's own suite, where a battery may replay it sixty
times for nothing. The rebuild is here.

`npm run freeze` is a step of the first CI job, so a broken freeze stops the matrix rather than being
reported beside it, and `fetch-depth: 0` is what makes the rebuild possible at all.

## Confirmation

Three reds, taken on this working tree and read.

**One byte of a published contract.** One comment reworded in
`contracts/typescript/string/slugify/properties.test.ts` — the same line
[ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) measured on a commit already in
the history:

```
typescript/string/slugify@1 was published from d3a5166… bound to 855107da…, and this tree now
produces c6ca0bc0…. A published version is frozen for life, so the repair is not to update the
binding: it is to put back what moved, or to publish the change as a new major beside this one.
```

**A coordinate naming the wrong commit**, and it is the red that demonstrates ADR-0106's asymmetry
rather than merely failing. Pointed at `013f688`, the commit before the publication: the four contracts
produce **no fault at all** — that commit really does bind their digests — and the four implementations
produce one each, *records that it was published from 013f688…, and the registry at that commit binds
no such address*. Four faults, all of one half. That is the measurement the two-commit form rests on,
made by the guard itself.

**Every binding falling back to the null revision.** With forty zeros,
`every-published-binding-still-hashes-to-what-it-was-published-as` **passes** — over an empty set — and
`nothing-this-tree-binds-escapes-the-freeze-check` is the only thing that says so, naming all eight.
That is the silence the second guard exists to break, and the first guard's green beside it is the
demonstration that one of them without the other proves nothing.

A fourth red was taken by accident and is worth a line: a fabricated commit identifier produced
`ARevisionCannotBeRebuilt` rather than a fault, which is `rebuild.ts` refusing a coordinate it cannot
reach instead of skipping it.

## What would reopen this

- **A survivor in `registry-storage`.** It would make the rejected option actively wrong rather than
  merely fragile, and this record would become the explanation of a red somebody was chasing.
- **A second publication.** `PUBLISHED_FROM` is one constant because one commit minted eight bindings;
  a sixth contract published later makes it a map, and these guards would then rebuild more than one
  commit per run.
- **A registry that is not this repository.** ADR-0093's own entry, arriving here: `bindingsAtRevision`
  asks git, and a published service with its own store would need another way to be asked.

## More Information

- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — the mechanism this suite is
  the first real consumer of.
- [ADR-0104](0104-the-proof-against-the-origin-lives-where-nothing-replays-it.md) — the same shape on
  the other suite no battery replays, and where the price was first paid.
- [ADR-0102](0102-the-instrument-restores-gits-state-beside-the-files.md) — the collision this
  placement refuses to ask for a second time.
