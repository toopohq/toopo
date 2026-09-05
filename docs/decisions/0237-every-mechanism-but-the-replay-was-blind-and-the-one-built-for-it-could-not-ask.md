---
status: accepted
date: 2026-09-05
governs:
  - mutation/site.battery.ts
  - CLAUDE.md
confirmed-by:
  - battery: site
    guard: no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it
---

# Every mechanism but the replay was blind, and the one built for it could not ask

## Context and Problem Statement

ADR-0236 rerun a job an earlier push had cancelled, and `batteries (site)` came back **red**:
`never red, UNACCOUNTED FOR (1)`, naming
`no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it`. ADR-0234 wrote three
guards and accounted for two. `main` carried an unaccounted guard and nothing would have said so until
a push touched `packages/site`.

**Two questions, and the second is worth more than the first.** Closing the red is a cell. What is
worth a record is that **a guard with no witness passed a whole unit**, through a census that moved
correctly, a `confirmed-by` that resolved correctly, and a command written for exactly this that
answered *I cannot ask*.

**No price of ADR-0218 is taken here**, no contract is written, `THE_PACKAGE_VERSION` stays at `1.2.0`,
the ledger reads `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, and nothing under
`contracts/` moves.

## Decision Drivers

* **The red is seen before anything is written.** A cell written against a defect nobody has watched
  redden is a cell aimed at what its author imagined, and this repository's first rule is that a test
  which cannot fail is not a test.
* **The route is decided by the measurement and never forced.** A guard reddening alone takes a cell; a
  guard reddening only beside its neighbours takes a declared region, because a cell claiming to isolate
  what it does not isolate is worse than an honest declaration.
* **A repair does not get to be its own justification**, which is why ADR-0236 found this and did not
  fix it.

## Considered Options

Two, and the measurement chose: a cell pinned on the guard, or a declared region under
`unprobedRegions` or `unreachableGuards`. Both were named in advance of the reading.

## Decision Outcome

### 1. The red, seen first and alone

The candidate edit is the one that falsifies the guard's own sentence: file `temporal` under
`WITHOUT_A_SPELLING` in `literal.ts` while it stays in `READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT`.
Applied to the working tree and run through `npm run site`:

    Test Files  1 failed | 17 passed (18)
         Tests  1 failed | 188 passed (189)

    FAIL  read-literal.test.ts > no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it
    AssertionError: expected [ 'temporal' ] to deeply equal []

**One of a hundred and eighty-nine, and the assertion is the guard's own.** So the first branch obtains
and the route is a cell. Nothing else moves, and the reason is structural rather than lucky:
`hasASpelling` narrows only for a value some case actually holds, and **no case of this catalogue holds
a carrier** — the `temporal` kind exists in the encoder and in no contract.

**The type is widened in the same edit, and that is what makes the cell measure the claim.**
`WITHOUT_A_SPELLING` is a `Record` over a closed union of three, so filing a fourth arm under it alone
is `TS2353`; `npm run site` runs `tsc` before vitest, so the cell would read `killed-by-typecheck` and
would be measuring the compiler. Widening and filing are one act by whoever files an arm under both
declarations, which is the defect the sentence names. It is ADR-0234's own reason for neutering
`A_CARRIER_OPENS` rather than deleting it, arriving on the cell that record owed.

### 2. `W-180`, and what it pins

One cell, one guard: `killed(['no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it'])`.

**Replayed on an undisturbed tree**, `npm run battery -- site`, exit 0:

| | |
| --- | --- |
| column | `W/as-committed` **168/169**, surviving `W-101` |
| every cell | agrees with the verdict this battery pins for it |
| `UNACCOUNTED FOR` | **0**, where it was 1 |
| the guard | **red on `W-180`, alone on `W-180`** |

`W-101` is the survivor ADR-0156 published and argued — it states an intent and carries no behaviour —
so the column is unchanged but for the cell added. **The guard leaves the *never alone* bucket on its
first day**, which is the rare shape: a sole witness written the first time rather than found after a
slice.

**The first replay of this cell was discarded and the reason is the assistant's own fault.** A
`git stash push`/`pop` was run to check a selection **while the battery was injecting into the working
tree**, which momentarily returns the tree to `HEAD` and takes the mutant with it. It produced figures
identical to the ones above, and that is not evidence: *a disturbed replay does not throw, it lies*, so
a run that cannot be trusted is re-taken rather than argued for. The figures published here are the
second run's.

### 3. Why a guard with no witness passed a whole unit

**Three mechanisms could have caught it. Each is blind, and for its own reason.**

* **The census counted correctly.** `mutation/census.ts` went `10 → 12` with both guards, so calibration
  passed. A count cannot tell *two added* from *two answered*, and this is ADR-0206's entry — *a new
  guard is answered for as many times as it is collected* — firing on a unit whose own file carries that
  entry.
* **`confirmed-by` resolved correctly.** ADR-0234 names two guards; both exist and both are collected,
  so `confirmationFaults` is green. It resolves the guards a record **cites**, so a guard added and not
  cited is outside its population **by construction** — no wider sweep repairs that, because the
  mechanism's subject is a citation.
* **`npm run predict` is built for exactly this and could not ask.** ADR-0221 gave it three buckets and
  the third is *a guard silent that nothing accounts for*. Run on the tree as ADR-0234 left it, its
  answer for this battery was `1 question(s) this reading could not ask: this measurement carries no
  guard identities`. **Exit 2 means it could not read, never that it found nothing** — so even run in
  the unit it would have refused to answer rather than reported clean.

**So the answer is: something existed, it was the right thing, and it was disarmed by a debt already
published.** ADR-0221 wrote that debt down in as many words — twenty-two measurements predate the guard
identities and cannot answer the two silences until each battery is measured once — and this is its
**first measured instance**: the debt did not cost a reading, it cost a red gate a whole unit of
invisibility.

### 4. And the debt is lifted for one battery, measured

The replay above writes a measurement carrying guard identities. Re-run afterwards:

    site
      every cell of this measurement agrees with what the battery declares today

    23 battery(s) read: 0 fault(s) a replay would refuse on, 20 question(s) this reading could not ask

**21 → 20**, and `site` moves out of the bucket. **Which is what makes the finding actionable rather
than a lament**: with the measurement in place, the next unit that adds a guard to this folder and
forgets its cell is caught in **185 ms** by a command, instead of by a battery replay that a cancelled
run can swallow. The other twenty-two are one battery run apiece.

## Consequences

* The red is closed and `main` no longer carries an unaccounted guard. `batteries (site)` is the only
  proof of that and it is read on the jobs.
* **A guard added without a witness is caught by nothing cheap, on twenty-two of twenty-three
  batteries.** That is not a new debt; it is ADR-0221's, with its price now demonstrated rather than
  estimated.
* **ADR-0234 carries a head note** saying it wrote three guards and accounted for two, with the three
  blindnesses named, so a reader of that record meets the correction rather than the claim.
* **The instrument is unchanged.** No guard, no job, no new declaration — the repair is one cell, and
  what this record adds beside it is a reading of why the cell was owed for a whole unit without
  anybody being told.

## What would reopen this

* **A battery measured once, then a guard added and forgotten there.** If `npm run predict` names it,
  the mechanism works and the remaining debt is arithmetic. If it does not, the third bucket is weaker
  than ADR-0221 claims and that is a finding about the predictor rather than about a unit.
* **A guard whose witness is a cell that reddens it beside its neighbours.** This one reddened alone on
  its first candidate; the next may not, and the declared region refused here becomes the honest answer
  there.
* **A second unit shipping an unaccounted guard.** One is an accident and names a debt; a rate would
  say the convention is not enough and that the twenty-two measurements are owed before the next
  contract rather than when somebody thinks of it.

## More Information

* ADR-0234 wrote the three guards and is where the head note sits; ADR-0236 found the red by rerunning a
  cancelled job and is where the concurrency fault that hid it is measured.
* ADR-0206 is the entry about a guard being answered for as many times as it is collected; ADR-0221
  built the predictor and published the debt this record measures.
* ADR-0076 is the pin convention `W-180` is written under, and ADR-0156 is where `W-101`'s survival is
  argued.
