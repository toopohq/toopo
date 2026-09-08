---
status: accepted
date: 2026-09-08
governs:
  - packages/registry/local-read-api.ts
confirmed-by:
  - battery: registry-storage
    guard: every-address-this-catalogue-published-is-one-the-ledger-still-binds
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

**The third path is written, it is inert on today's catalogue, and the control refuted half of its
own expectation — which is the finding.** Outcome 1 on the reading; the criteria said the control
must move the ledger *and* redden the freeze, and it moved the ledger with the freeze green.

**Q1 — the printed ledger.** Flat with the third path in place: `18cc4e82…` at **1 206 bytes**,
`pnpm freeze` 3 passed, `tsc` exit 0, the registry suite 25 files and 483 tests. Under the control it
**moves**: `object/deep-equal@1` set to `not-yet-published` takes the ledger to **998 bytes** and
`ef31c467a37b65e863fa85854768d82221ef8558461b4055d907e5c40788ea90`, both of that contract's bindings
gone. So the probe could answer otherwise and did not.

**Q2 — the freeze.** `pnpm freeze` is **3 passed on both trees**, the control's included. **The two
questions parted, in the direction that matters**: a published address left the ledger and the
mechanism whose whole subject is permanent rule 6 said nothing. The cause is one line —
`bindingsOf(ledger)` at `packages/registry/rebinding.ts:91` — so the freeze's population **is** the
ledger, and a binding that leaves it leaves the check rather than failing it. ADR-0231 measured the
two coupled because an encoder that changes its output makes the local ledger and the rebuilt one
disagree by construction; that argument holds for what a binding *says* and is silent about a binding
that stops existing.

**What answers it is a new guard whose population is `THE_PUBLICATIONS`**, the table that does not
shrink with the catalogue: `every-address-this-catalogue-published-is-one-the-ledger-still-binds`, in
`publication.test.ts`. Seen red on the control before it was green, and the message is the claim
rather than a diff:

```
× every-address-this-catalogue-published-is-one-the-ledger-still-binds
AssertionError: an address this repository published that this tree no longer binds. The freeze
cannot see this: its population is the ledger, so a binding that leaves it leaves the check.:
expected [ 'typescript/object/deep-equal@1' ] to deeply equal []
```

— beside `pnpm freeze` exit 0, 3 passed, on that same tree.

**Q3 — `installable`, untouched.** **False**, as predicted, and by membership rather than by a
lifecycle test: `response.ts` reads `ledger.contracts`, and under the third path the contract is in
neither list. No line was written for it.

**Q4 — the `playground.test.ts` hole.** **It closes for free.** `heldByTheRegistry` filters on
`installable`, so the contract drops out of the population before `playground.test.ts:159` imports
and calls its stripped `reference.js`. Measured on the control: `npm run site` exit 0, **18 files and
192 tests**, no `ReferenceError`. That is the hardest hole the catalogue-entry sweep found, closed by
this unit without being aimed at.

**Q5 — what the site builds.** Of the three shapes named in advance — a page as today, no page at
all, a throw at build time — it is **no page at all**, and the suite is green through it.

**Q6 — a second frozen half nothing guards.** **The prediction is refuted, and by an existing
guard.** The snapshot and the blobs *are* registered before the branch, so the read API can still
answer for such a contract in process — but the emitted tree does not write those addresses, and
`what-is-served-and-cannot-be-asked-for-is-the-refused-contract` is what says so, by reddening on the
control with the contract joining the unreachable set at **`files: 7`**:

```
- [ { "contract": "typescript/array/group-by@1", "files": 9 } ]
+ [ { "contract": "typescript/array/group-by@1", "files": 9 },
+   { "contract": "typescript/object/deep-equal@1", "files": 7 } ]
```

So there is no frozen half served at an address no binding names: the contract leaves the emission
whole, exactly as the refused one does. The class is guarded, by a guard nobody wrote for it.

**The cell is `I-181` of `registry-storage`**, and it is the control promoted into the instrument.
Three reds, at or below ADR-0076's line, so the pin names all three:
`every-address-this-catalogue-published-is-one-the-ledger-still-binds`,
`what-is-served-and-cannot-be-asked-for-is-the-refused-contract` and
`no-two-profiles-of-an-unpublished-contract-are-indistinguishable`. **A second control separates the
new guard from its two companions and it is disjoint**: the same edit on the contract this catalogue
*refused* — `array/group-by@1`, `never-published` to `not-yet-published` — reddens **eight** guards of
this folder and shares **none** of those three, the new one green among them. A refused contract mints
no binding and stands in `THE_PUBLICATIONS` nowhere, which is the discrimination the guard claims,
measured rather than read.

## Consequences

**The dispatch is total over the union.** `default` binds `record.lifecycle` to `never` and throws, so
a fifth lifecycle state fails to compile rather than falling into whichever arm the `else` was. What
this replaces published `absorbed-by-the-language` by accident; it is now named beside `published`,
with the reason written where the arm is.

**A word that had nothing behind it has a mechanism**, and the entry class this repository keeps a
list of is one instance shorter — on the field that decides whether a digest is frozen for life.

**The freeze's blind spot is named and is not closed.** `bindingsOf` is unchanged: widening it is a
different unit, and what stands in its place is a guard over the population that does not shrink.
That population is a hand-maintained table, so the guard inherits the table's own debt — an address
never added to `THE_PUBLICATIONS` is invisible to it, exactly as ADR-0177 left it.

**The eighth contract will pay one line for this path, and it is measured rather than predicted.**
`what-is-served-and-cannot-be-asked-for-is-the-refused-contract` asserts a literal list of one, so the
day a contract enters the catalogue as `not-yet-published` its snapshot joins the unreachable set and
that guard reddens — which is the same red this unit's control produced, arriving from the intended
use rather than from a defect. The catalogue-entry unit owes that guard a sentence about two states
rather than one.

**Nothing entered the catalogue and no digest moved.** The ledger is `18cc4e82…` at 1 206 bytes on
both sides, `pnpm freeze` is 3 passed on both, `npm run test` is 30 files and 718 tests, and the
census row for `publication.test.ts` moves 9 to 10 for the new guard.

## What would reopen this

**A binding this repository published that `THE_PUBLICATIONS` does not name.** The new guard's
population is that table, so a publication recorded nowhere is outside it — and the guard would be
green while the freeze was blind, which is the state this unit found. What would close *that* is the
second ledger ADR-0248's entry prices, of refused and unpublished digests bound at the commit each
decision was taken.

**`bindingsOf` gaining a population that is not the ledger.** The parting measured here is a property
of one line; widening the freeze to rebuild what the catalogue holds rather than what the ledger binds
would make this guard a restatement, and it would have to be withdrawn rather than kept beside it.

**A contract really entering `not-yet-published`.** Everything above is measured on a control and on a
path nothing takes. The first real inhabitant is what says whether `installable` answering false by
membership reads as a decision or as a coincidence to whoever meets it — and it is the moment the
closure guard's list of one has to become a list of two.

## More Information

ADR-0007 settles the lifecycle and names the two arms no contract fills. ADR-0231 is where the ledger
and the freeze were separated as two questions, and ADR-0248 is where they parted. ADR-0248's own
entry carries the frozen half a refusal leaves outside the freeze, which Q6 asks whether this path
widens.
