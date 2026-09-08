---
status: accepted
date: 2026-09-08
governs:
  - packages/registry/local-read-api.ts
confirmed-by: []
---

# A contract that is not published yet mints nothing

## Context and Problem Statement

`Lifecycle` has carried `{ state: 'not-yet-published' }` since ADR-0007 and **no code honours it.**
Measured at `f291220`, in three places:

* `local-read-api.ts:178` branches on `never-published` alone and sends everything else through
  `publishContract`.
* `publishContract` appends a binding carrying a digest, and `publishImplementation` a second.
* `response.ts:584` builds `published` from `ledger.contracts` membership and never from the
  lifecycle, so `installable` would answer **true** for a contract nobody published.

So the arm is a type with nothing behind it — the class this repository keeps a list of, arriving on
the field that decides whether a digest is frozen for life.

**The owner ruled for the third path**, and the reason is the permanent rule rather than economy:
*a published version is frozen for life*. Freezing what is not published does not strengthen that
rule, it empties it — if an unpublished contract is frozen like a published one, *published* stops
meaning anything in particular. A `not-yet-published` contract must be able to change; that is the
whole of what the state says. And a fact rather than an argument: `THE_UNPUBLISHED_PUBLICATION`
already exists as a fallback, so the code anticipated this state without holding it.

## Decision Drivers

* **A word and a mechanism in disagreement is what this repository refuses**, and this thread has
  spent a week measuring what one costs.
* **The dispatch should not be an `if`/`else`.** Today `absorbed-by-the-language` is published by
  falling through the `else`, silently. A total dispatch over the union makes a fifth state fail to
  compile rather than fall somewhere.
* **A zero is worth nothing without a control.** No contract carries this state, so *the ledger did
  not move* is a tautology unless the probe is shown able to answer otherwise.

## Considered Options

* Leave the state as a type and publish it, which is today.
* Mint an unanchored binding, so the contract is in the ledger and outside the freeze.
* **A third path: it enters no list of the ledger at all.**

## The criteria, committed before the probe

**This section and everything above it are committed before a figure of them is read.** The commit
that carries them touches no behaviour; the readings arrive in the commit after. What that buys is
that no outcome below can be chosen after the fact.

### The two questions are separated, because they have parted before

**Q1 — does the printed ledger move?** `npm run ledger` must hash to `18cc4e82…` at 1 206 bytes.

**Q2 — does `the-freeze.test.ts` redden?** Asked apart from Q1 rather than assumed to follow it.
ADR-0231 measured the two coupled by `bindingsAtRevision` spawning a worktree at the published commit;
ADR-0248 measured them parting, seven contract digests moving where the freeze named six, because a
refused contract mints no binding. **If one moves and the other does not, that is the finding.**

### What must be established rather than assumed

**Q3 — what does `installable` answer, with `response.ts:584` untouched?** Predicted **false**: it
reads `ledger.contracts` membership, and under the third path the contract is in neither list.

**Q4 — does `playground.test.ts:159` stop reaching it?** Predicted **yes**, because
`heldByTheRegistry` filters on `installable`. That guard imports and **calls** each held contract's
stripped `reference.js`, so an eighth contract naming `Temporal` would raise `ReferenceError` on both
legs — the hardest hole this unit's sweep found. If Q3 and Q4 hold it closes with no line written for
it; if either fails, the price is named here rather than met later.

**Q5 — what does the site build for a contract in this state?** *No prediction.* The three shapes it
could take are a page as today, no page at all, and a throw at build time, and which of them the code
takes is a measurement.

**Q6 — does the third path leave a second frozen half nothing guards?** Predicted **yes, and it is
the price**: the loop registers the snapshot and the blobs *before* the branch, so such a contract's
frozen half would be served at an address no binding names — ADR-0248's entry, one contract wider.
Named now so that it is recorded rather than discovered.

### The control, without which the reading is thrown away

No contract carries this state, so a path nothing takes moves nothing by construction. **The control
is a contract that really takes it**: one of the seven published contracts set to `not-yet-published`
with the third path in place. Under it the ledger *must* move and the freeze *must* redden, naming
that contract — and Q3, Q4 and Q5 are measured on it rather than reasoned about.

### Four outcomes, so that none can be read afterwards as a rescue

1. **The reading is flat and the control moves.** The third path is real and inert on today's
   catalogue. The unit lands.
2. **The reading is flat and the control is flat too.** The probe is blind; both readings are thrown
   away and nothing is believed about the branch.
3. **The reading moves.** The third path touches a published digest, which is a finding and stops the
   unit where it stands.
4. **Q3 answers true.** `installable` does not follow the ledger, the hole does not close for free,
   and this unit carries a second repair whose price is stated before it is paid.

**The bias is declared: towards the first outcome**, which is the one under which this is ordinary
work rather than the owner's decision a second time.

## Decision Outcome

*Written after the probe, in the commit that carries the readings.*

## Consequences

*Written after the probe.*

## What would reopen this

*Written after the probe.*

## More Information

ADR-0007 settles the lifecycle and names the two arms no contract fills. ADR-0231 is where the ledger
and the freeze were separated as two questions, and ADR-0248 is where they parted. ADR-0248's own
entry carries the frozen half a refusal leaves outside the freeze, which Q6 asks whether this path
widens.
