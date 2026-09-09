---
status: accepted
date: 2026-09-08
governs:
  - packages/registry/local-read-api.ts
  - packages/registry/response.ts
confirmed-by:
  - battery: registry-storage
    guard: a-contract-not-yet-published-is-served-and-not-installable
  - battery: registry-storage
    guard: every-contract-this-catalogue-holds-is-one-the-ledger-binds-or-refuses
  - battery: registry-storage
    guard: a-contract-binding-is-anchored-exactly-where-this-repository-published-it
---

# A contract not yet published binds without being anchored

> **Two things below are corrected by
> [ADR-0262](0262-a-bound-re-derived-from-its-own-job-and-the-tax-a-guard-pays-per-cell.md), and the
> second is a red this record left on `main`.**
>
> **The address cost does not reproduce.** *Fourteen citations across six records, three in
> `confirmed-by` and five in the prose of stamped records* is re-measured at `db9e20d` by counting each
> address in the committed bytes of every tracked file: the anchoring pair stands **21 times in 9
> files, 16 of them in 6 records, with 5 `confirmed-by` entries across 3**. The six records are right
> if this one is counted; every other reading of the pair is 12, 16, 17 or 21, and no rule anybody can
> state gives fourteen. **And the four do not cost the same thing**: only the anchoring pair encodes
> its claim in its address, so only that pair costs a rename — the two site guards are repaired inside
> their own bodies and move no address, which makes the bill 21 rather than the four's 41.
>
> **`installable` following the lifecycle moved what a site cell reddens, and no selection said so.**
> `site · W-19` publishes the refused contract; while `installable` meant membership of the ledger that
> made it installable, so it gained a page and an install command and reddened three guards. It is
> bound and still not installable now, so it reddens one — measured, 1 failed of 192 — and
> `a-contract-the-catalogue-turned-down-is-marked-and-still-shown` was left reddened by nothing. This
> record's diff touched `packages/registry` alone, so the folder rule named no site battery and the red
> sat on `main` unselected. ADR-0262 re-pins W-19 and writes `W-184` for the orphaned guard.

## Context and Problem Statement

**ADR-0260 ruled that `not-yet-published` mints nothing, and the reconstruction refutes it.**
`bindingsAtRevision` runs the ledger script *of the commit it rebuilds*, so a binding exists at a
revision exactly when that revision's ledger holds an entry for it. And ADR-0106's coordinate is the
commit **before** the publication, at which the contract reads `not-yet-published` — measured, the
four founding contract bindings name `d3a5166`, whose own `local-read-api.ts` branches on
`never-published` alone and publishes everything else.

So a state that mints nothing does not break a guard. **It breaks the rebuild of the freeze for every
publication after it**, `temporal/add` first, because the commit a new binding would name is a commit
at which the contract is not yet published and would therefore bind nothing. The live catalogue was
never at risk — every existing binding rebuilds under its own commit's code — which is why every suite
except one stayed green and why the refutation arrived from `frozen-for-life.test.ts`, the one place
that clones at **today's** HEAD and runs today's dispatch over the three lifecycle states.

**The reasoning that produced form A was about what the state ought to mean rather than about what the
reconstruction reads.** The argument it rested on survives untouched: nothing `not-yet-published` is
frozen for life. What changes is which mechanism carries it.

## Decision Drivers

* **Three things the code confuses in one.** A **binding** makes an artefact reconstructible from a
  commit; **anchoring** freezes it for life; **installable** is what a reader may take. Today all
  three are read off one fact — membership of `ledger.contracts`.
* **The mechanism for the second already exists and is unused.** `isAnchored` partitions on
  `publishedFrom !== THE_UNPUBLISHED_REVISION`, `rebindingFaults` rebuilds only the anchored half, and
  `unanchoredBindings` names the rest *so that an empty check is never silent*. `THE_UNPUBLISHED_PUBLICATION`
  is already the fallback the coordinate lookup takes, and its own comment says *a stand-in anchors
  nothing and still dates its bindings correctly*.
* **A guard over this state cannot range over the catalogue.** The precedent,
  `a-contract-not-yet-published-carries-the-current-banner`, filters `theCatalogue` and asserts its
  population is non-empty — so a guard filtered on `not-yet-published` would be **red today**, no
  contract carrying it. What is available is a guard **total over the catalogue** or one over a
  **constructed** subject.

## Considered Options

* Form A: the state mints nothing. **Refuted above.**
* An unconditional stand-in coordinate for the state, so that anything carrying it is unanchored.
  **Refused before the probe**: permanent rule 6 is about a published *version*, the lifecycle is
  standing and outside the digest, so flipping the field must not unfreeze what was really published.
  `THE_PUBLICATIONS` is the record of what was, and it does not shrink.
* **The state mints as `published` does, and the coordinate lookup already decides the anchoring.**

## The criteria, committed before the probe

**This section and everything above it are committed before a figure of them is read.** The commit
carrying them touches no behaviour: what it adds to `local-read-api.ts` and `response.ts` is a comment
stating what is there today.

### The two questions are separated, as they were and for the same reason

**Q1 — does the printed ledger move?** Predicted **flat**, `18cc4e82…` at 1 206 bytes: no contract
carries the state, so a path nothing takes mints nothing extra.

**Q2 — does `the-freeze.test.ts` redden?** Predicted **no**, and asked apart from Q1 rather than
assumed to follow it. ADR-0260 measured the two parting in the sharper direction and that finding
stands whatever this unit does.

### What must be established rather than assumed

**Q3 — what does `installable` read, and what does the change move?** It must read the lifecycle off
`entry.standing.lifecycle`, which travels with the binding — `servedRefusals` already reads exactly
that, twelve lines below. Predicted: **`contract-index` is byte-identical on today's catalogue**, six
published answering true and the refused one having no entry either way. If the served document moves,
a client's document moves, and that is a cost this unit would owe rather than a detail.

**Q4 — does the `playground.test.ts:159` hole close?** Predicted **yes**, on the control:
`heldByTheRegistry` filters on `installable`, so a contract in this state leaves the population before
line 159 imports and calls its stripped `reference.js`.

**Q5 — what does `isAnchored` separate today, and does an unanchored binding create a frozen half
nothing guards?** Predicted: it **grows a declared entry rather than creating a class** — the open
list already carries *every contract this catalogue holds and does not publish*, one today — **and it
is strictly better than the refused contract's silence**, because a refusal leaves no binding at all
where an unanchored binding is in `bindingsOf` and is named by `unanchoredBindings`. To be measured
rather than argued.

**Q6 — does `frozen-for-life.test.ts` go green without being narrowed?** Predicted **yes, unchanged**:
under form B its three lifecycle states each mint a binding, so its third line is true as written. **If
it still has to move, that is the finding and the reason is owed**, not a repair to be made quietly.

### The controls, without which the readings are thrown away

**C1 — a contract that *was* published, put back.** `object/deep-equal@1` to `not-yet-published`.
Predicted: the binding survives with its **real** coordinate, so it stays anchored, the freeze goes on
checking it, the digest does not move — and `installable` answers **false**. That is permanent rule 6
holding while the reader-facing half follows the field.

**C2 — a contract that was *never* published, which is the state's real subject and the eighth
contract's future.** `array/group-by@1` to `not-yet-published`. It stands in `THE_PUBLICATIONS`
nowhere, so it takes `THE_UNPUBLISHED_PUBLICATION`. Predicted: the ledger **moves**, a binding appears,
`unanchoredBindings` names it for the first time in this repository's history, the freeze stays green
because an unanchored binding is never rebuilt, and `installable` answers false. **C2 is what says the
probe could answer otherwise**, and Q3 to Q5 are measured on the two controls rather than reasoned
about.

### Four outcomes, so that none can be read afterwards as a rescue

1. **The reading is flat, C2 moves the ledger and names an unanchored binding, C1 stays anchored.**
   Form B is real and inert on today's catalogue. The unit lands.
2. **C2 is flat too.** The probe is blind; both readings are thrown away.
3. **C1 loses its anchor**, which would mean flipping a standing field unfreezes a published version.
   That stops the unit where it stands.
4. **`contract-index` moves on today's catalogue**, or `frozen-for-life.test.ts` still needs
   narrowing. Either is a cost stated before it is paid rather than after.

**The bias is declared: towards the first**, which is the outcome under which this is the repair of a
ruling rather than a second ruling.

## Decision Outcome

**Outcome 1, with one prediction of my own refuted — and the refutation is the answer to Q5.**

**Q1 — the ledger.** Flat: `18cc4e82…` at **1 206 bytes**. No contract carries the state, so the arm
that now mints is an arm nothing takes.

**Q2 — the freeze.** `pnpm freeze` 3 passed.

**Q3 — `installable`.** It reads `entry.standing.lifecycle.state` through `A_READER_MAY_INSTALL`, a map
total over the union so a fifth state is classed rather than defaulted. **The served index does not
move on today's catalogue** — not by a byte comparison, and it does not need one: `installable` is the
only field the change reaches, and `a-refused-contract-is-findable-and-not-installable` pins the
complete list of entries answering false, green on both sides.

**Q4 — the `playground.test.ts` hole closes.** Under C1 `npm run site` is **190 passed of 192**, and
`playground.test.ts` is not among the two failures: `heldByTheRegistry` drops the contract before line
159 imports and calls its stripped `reference.js`. That half of ADR-0260's finding survives the change
of mechanism intact.

**Q6 — `frozen-for-life.test.ts` is green and not one byte of it moved.** `25 passed (25)`,
`486 passed (486)`. Its three lifecycle states each mint a binding again, so its third line is true as
written — which is what the whole ruling was about, arriving as a suite that collects.

**C1 — a published contract put back.** `object/deep-equal@1` to `not-yet-published`: the ledger is
**1 206 bytes and `18cc4e82…`, unmoved**, and `pnpm freeze` is **3 passed**. The binding keeps its real
coordinate, stays anchored, and the freeze goes on checking it. **So flipping a standing field does not
unfreeze a published version** — where under ADR-0260's ruling the same edit took the ledger to 998
bytes with both bindings gone and the freeze silent. Outcome 3 is refused by measurement.

**C2 — a contract nobody published, which is the eighth contract's future.** `array/group-by@1` to
`not-yet-published`: the ledger **moves**, 1 206 → **1 408 bytes**, `18cc4e82…` → `1939c5d8…`, gaining
`typescript/array/group-by@1 → caf4e401…` and its reference at `38fe32f1…`. **`caf4e401…` is the digest
ADR-0248's entry names as the one that could move with nothing able to say so**, and under this ruling
it is in the ledger and named. So the probe could answer otherwise, and did.

### Q5, where my own prediction was wrong

**Predicted: the freeze stays green, an unanchored binding never being rebuilt. Measured: the freeze
reddens.** `rebindingFaults` does ignore it — that half held — but the suite carries a second guard
about its own *population*:

```
× nothing-this-tree-binds-escapes-the-freeze-check :: the population is every binding
AssertionError: expected [ 'typescript/array/group-by@1', …(1) ] to deeply equal []
```

with `every-published-binding-still-hashes-to-what-it-was-published-as` green beside it. And a second
guard says the same thing in the registry's own suite,
`every-binding-anchors-a-commit-and-the-check-reaches-all-of-them`.

**So the answer to *does an unanchored binding create a frozen half nothing guards* is no, and it is
the opposite of what the entry it grows would suggest.** A refused contract leaves *no binding*, so it
is outside `bindingsOf` and invisible — that is ADR-0248's silence. An unanchored binding is inside
`bindingsOf`, named by `unanchoredBindings`, and **refused twice**. The state is over-guarded rather
than unguarded.

**What that costs is measured and is not paid here.** Four guards assume the state has no inhabitant
and each reddens the day one really carries it:

| | what it assumes |
| --- | --- |
| `nothing-this-tree-binds-escapes-the-freeze-check` | no binding is unanchored |
| `every-binding-anchors-a-commit-and-the-check-reaches-all-of-them` | the same, in memory |
| `a-refused-contract-is-in-the-index-and-resolves-to-no-binding` | not installable implies no binding |
| `every-contract-the-index-lists-has-a-page-at-its-own-address` | exactly one entry is not installable |

**The first two were restated and the restatement was withdrawn on its price.** Both names encode
*every binding is anchored*, so ADR-0017 makes the repair a **rename**: narrowing a claim under an
address that then over-reads is the one thing that record forbids. Swept, the two addresses are cited
**fourteen times across six records**, three of them in `confirmed-by` blocks the meta suite resolves
and five in the prose of stamped records, which nothing resolves and which would go stale in silence —
this list's own class. Paying an address cost of that size for a state no contract carries, in a unit
whose brief is that nothing enters the catalogue, would be paying it where the red can only be produced
by a control. **They are named here and they belong to the unit that adds the first inhabitant**, which
sees all four red for real.

### What the guards are, and why each has the shape it has

**`a-contract-not-yet-published-is-served-and-not-installable`** is the only one of the three that can
be red on this tree, and it was: *expected true to be false*, on the sentence *a contract the catalogue
has not published, offered for installation*. It is written over a **constructed** ledger with one
entry's lifecycle moved and its digest, coordinate and instant left alone, because a guard filtered on
this state over `theCatalogue` would assert an empty population — the trap
`a-contract-not-yet-published-carries-the-current-banner` avoids by asserting its own is not empty. Its
control is the same entry left `published`.

**`every-contract-this-catalogue-holds-is-one-the-ledger-binds-or-refuses`** is total over the
catalogue and is the guard whose absence let ADR-0260's ruling through. It is deliberately silent about
*which* list.

**`a-contract-binding-is-anchored-exactly-where-this-repository-published-it`** holds both directions,
and the second is why the unconditional stand-in was refused before the probe: unpublished and anchored
is a coordinate for a publication that never happened, published and unanchored is permanent rule 6
stopping without a word.

**Four cells, one per new guard and one re-aimed.** `I-182` reads `installable` off ledger membership
again — the expression this repair replaced, which was the code for a year and which no reading of the
real catalogue can see is wrong. `I-183` makes the coordinate lookup unconditional, which is the
refused option built: nothing anchored, the freeze comparing an empty set. `I-184` drops the assignment
on the refusal arm, an immutable update discarded, which is the one edit that still leaves a contract
answered by neither list. And **`I-181` is re-aimed**: under this ruling its old edit reddens one guard
about profiles and says nothing about the ledger, so it now records a published contract as refused —
seven reds, above ADR-0076's line, pinning the one it was written for, with
`every-contract-this-catalogue-holds-is-one-the-ledger-binds-or-refuses` **green** through it, which is
the two guards measured apart rather than argued apart.

## Consequences

**Three things the ledger confounded are three things.** A binding is minted by three of the four
lifecycle states and says only that the artefact can be rebuilt at a commit. An anchor is the
coordinate, and `isAnchored` has a second side for the first time. `installable` is the lifecycle, read
off the binding's own `standing`.

**Nothing was built for the anchoring**: `THE_UNPUBLISHED_PUBLICATION`, `isAnchored`,
`rebindingFaults`' filter and `unanchoredBindings` all existed and were unused, and
`THE_UNPUBLISHED_PUBLICATION`'s own comment already said *a stand-in anchors nothing and still dates its
bindings correctly*. The ruling gave a mechanism its first inhabitant rather than adding one.

**ADR-0106's coordinate is safe and it is safe by construction.** The four founding bindings name
`d3a5166`, at which the contracts read `not-yet-published`; `bindingsAtRevision` runs *that commit's
own* entry point, whose dispatch branches on `never-published` alone. That is why every existing
binding rebuilt correctly under ADR-0260's ruling and why the refutation arrived from the one suite
that runs today's dispatch over the three states.

**The catalogue-entry unit inherits four reds, measured and named above**, and two of them cost a rename
priced at fourteen citations.

**The replay refused the run, on a declaration that had predicted the day it would go stale.**
`registry-storage` calibrated green over 486 tests, all four cells came back *killed as expected*, and
the battery exited on one disagreement:
`the-readme-counts-the-catalogue-the-registry-declares` *is declared silent and a mutant reddened it*.
That guard's `unprobedRegions` entry argued no mutant of this battery could name it rather than a
dozen, and closed with *a sixth contract, or a second refused one, makes the count movable* — and
`I-181` is a second refused one. So the region is removed, witnessed by a cell whose pin does not name
it, which is ADR-0076 above the line working as written: the attribution reads the reds a cell really
produced and never its pin. **The re-verification is `npm run predict` and not a second replay**, which
is the case ADR-0221 built it for exactly — a declaration drifting against a measurement already
taken — and it answers *every cell of this measurement agrees with what the battery declares today*,
0 faults and 0 questions over 24 batteries, in about 185 ms against 65 minutes.

**The push made `main` red, and what it cost is a guard's wall clock rather than a verdict.**
`batteries (registry-storage)` was killed at **79 min 21 s** against its 79-minute bound, `cancelled`
rather than `failure`, and `every-job-answered` — ADR-0222's gate — turned that into a red job exactly
as written. **The previous completion of that battery on `main` was 67 min 26 s**, run `34211210792`,
so the margin was 11 min 34 s and this unit spent all of it.

**The cause is measured and it is not the three cells.** A cell replays the whole registry suite, so a
guard's own duration is multiplied by 238. Read per guard: `every-address-…-still-binds` **809 ms**,
`every-contract-…-binds-or-refuses` **707 ms**, `a-contract-binding-is-anchored-…` **508 ms** —
because each calls `theLocalLedger()` and **`gather()` is not memoised**, the sentence *built lazily
and once* one screen below it belonging to `theLocalReadApi`. Three calls, three full serialisations of
the catalogue with every declared file hashed. **The first hypothesis was wrong and the measurement
said so**: `theIdentities()` rebuilt four times inside the fourth guard looked like the cost, was
repaired, and the suite did not move — 46.76 s against 46.58.

Shared through one lazy build in the file, the two later guards fall to **0 ms** and the suite's tests
go **46.76 s → 42.27 s**, which is the reading it had before these guards existed. The build is lazy
rather than at module scope, because a throw at collection takes every guard of the file with it and
reports them `skipped` — which is the shape this unit found `frozen-for-life.test.ts` in.

**What follows is a projection and is published as one.** At 238 cells and ~1.1 s per cell of added
suite time, the job should return to about **72 minutes** against the 79-minute bound: under it, with
roughly six minutes of margin where this morning had eleven and a half. Only the runner can settle it,
which is what the bound is about — and the bound was not touched.

**Nothing entered the catalogue and no digest moved.** Ledger `18cc4e82…` at 1 206 bytes on both sides,
`pnpm freeze` 3 passed on both, `npm run test` 30 files and 718 tests, the site 18 and 192, the registry
25 and 486. Census: `publication.test.ts` 10 → 12, `response.test.ts` 67 → 68.

## What would reopen this

**A contract really entering `not-yet-published`.** Everything above is measured on two controls and on
a path nothing takes. The first inhabitant is what turns four named reds into four seen ones, and it is
the moment the anchoring partition stops being a mechanism with one side.

**A binding this repository published that `THE_PUBLICATIONS` does not name.** Both new guards keyed to
it inherit that table's debt: a publication recorded nowhere is outside their population, and they
would be green while the freeze was blind. ADR-0248's second ledger is what closes it.

**A fifth lifecycle state.** `A_READER_MAY_INSTALL` and the dispatch are both total over the union, so
one does not compile until it is classed twice — but *which* answer it takes is a decision neither map
can make, and a state that mints no binding is now known to cost the rebuild of every publication after
it rather than nothing.

## More Information

ADR-0260 is the ruling this record refutes and carries a note saying so. ADR-0106 is where the
coordinate of a contract binding was settled as the commit before the publication, which is the fact
form A collided with. ADR-0231 is where the ledger and the freeze were separated as two questions.
ADR-0007 settles the lifecycle union.
