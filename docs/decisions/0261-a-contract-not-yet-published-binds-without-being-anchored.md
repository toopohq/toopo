---
status: accepted
date: 2026-09-08
governs:
  - packages/registry/local-read-api.ts
  - packages/registry/response.ts
confirmed-by: []
---

# A contract not yet published binds without being anchored

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

*Written after the probe, in the commit that carries the readings.*

## Consequences

*Written after the probe.*

## What would reopen this

*Written after the probe.*

## More Information

ADR-0260 is the ruling this record refutes and carries a note saying so. ADR-0106 is where the
coordinate of a contract binding was settled as the commit before the publication, which is the fact
form A collided with. ADR-0231 is where the ledger and the freeze were separated as two questions.
ADR-0007 settles the lifecycle union.
