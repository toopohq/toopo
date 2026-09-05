---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# The encoder the freeze fixes is asked whether a new kind moves a published digest

## Context and Problem Statement

ADR-0218 prices three repairs for an eighth contract and ADR-0223 sized the first of them: **one kind in
`value.ts`, at five sites, two of which the compiler names.** That is a cost in edits.

**The lock was never measured.** `value.ts` is the encoder whose output the freeze fixes, and six
published contracts are bound to digests taken over what it produces. If adding a kind moves any of
them, item 1 is not a repair anybody may take — it is permanent rule 6 firing, and the price stops
being work and becomes a decision the owner alone can make.

**This unit measures and repairs nothing.** No kind is added for good, no spelling in `literal.ts`, no
key in `AS_AN_ARGUMENT`, nothing under `contracts/`, and the ledger must read
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` when it ends.

### Two questions the word *moves* runs together

* **Does the digest move?** A property of the encoder: what `theLocalLedger()` produces from the working
  tree.
* **Does `the-freeze.test.ts` redden?** A property of the comparison: `rebindingFaults` holds the local
  ledger against `bindingsAtRevision`, which **spawns a worktree at the published commit and runs that
  commit's own entry point** — so the past is rebuilt by the *old* encoder, not the current one.

They are not the same thing, and **if one moves and the other does not, that is the finding.**

## Decision Drivers

* **The answer is measured, never read off the type.** A discriminated union gaining a member looks
  inert; whether it is depends on a dispatch, and `encodeAt` is a cascade of `if`s where a new arm's
  *position* decides what it intercepts.
* **A criterion written after the reading is a rescue.** Both verdicts are fixed below before the probe
  exists, on ADR-0225's discipline.
* **The probe must be the repair in miniature, or it measures nothing.** Adding an arm to `EncodedValue`
  alone cannot change an encoding, because nothing produces the new kind. The arm has to be wired into
  the dispatch where a real carrier's would go.

## Considered Options

* **Read `contractSnapshot` and reason about whether `value.ts` reaches it.** Refused: that is the
  reading this repository distrusts, and ADR-0218 already asserts the reach without measuring it.
* **Add the kind, keep it, and see.** Refused by the constraints and by sense: it takes the price before
  knowing it.
* **Add it in the working tree, measure both questions, and revert by counter-edit.** Retained, on
  ADR-0223's precedent — a throwaway arm on `EncodedValue`, removed by a counter-edit, with
  `git status --porcelain` empty either side.

## Decision Outcome

### The two criteria, committed before the probe

> **The digest moves** if `node packages/registry/print-ledger.ts`, hashed, differs from
> `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` with the kind present.
>
> **The freeze reddens** if `pnpm freeze` is anything other than **3 passed**, and the guard that fails
> is named rather than the count reported.

**Four outcomes, and each says something different about the price.**

* **A — neither moves.** Item 1 is ordinary work: a kind is addable and the freeze does not see it.
* **B — both move.** Item 1 is permanent rule 6. Not a repair; a decision, and one the owner cannot
  take without rebinding six addresses.
* **C — the digest moves and the freeze stays green.** The worst of the four: the encoder's output
  changed, six published bindings silently disagree with what this tree now produces, and the mechanism
  built to catch exactly that says nothing. It would mean the freeze compares two things that move
  together.
* **D — the freeze reddens and the digest does not.** The comparison is sensitive to something the
  ledger is not, which would say the two readings measure different objects.

### The prediction, with its bias declared

**A.** The reason: `encodeAt` dispatches on the value's own shape, a Temporal carrier's arm would test
`instanceof` against a type no value in this catalogue is an instance of, and an arm that intercepts
nothing changes nothing.

**The bias runs towards A and it is the convenient answer** — A is the outcome under which item 1 stays
work rather than becoming the owner's decision, and it is the outcome this record's author would prefer
to find. A reader should discount it exactly as far as the probe could have returned B, C or D, and the
probe can: it takes one byte of encoded output to move a digest.

### The protocol, written before it is played

**The kind.** `temporal`, carrying a type name and an ISO rendering — the shape ADR-0219 measured as
lossless on seven carriers of seven, so the probe is the repair in miniature rather than a token.

**Where the arm goes.** Immediately after the `Date` arm in `encodeAt`, which is the nearest precedent:
`Date` is a carrier keeping its state in an internal slot and is spelled by a kind of its own, which is
the argument ADR-0219 made for giving a Temporal carrier one.

**How far the edit goes.** As far as the compiler requires, and no further — `EncodedValue`, the arm in
`encodeAt`, and whatever `tsc -p packages/registry/tsconfig.json` refuses without. `literal.ts`,
`read-literal.ts` and `AS_AN_ARGUMENT` are **not** touched: they are items 1's other sites and items 2
and 3, and taking them is taking the price.

**The readings, in order**: the ledger before, the typecheck, the ledger after, `pnpm freeze` after,
then the counter-edit, then the ledger and `git status --porcelain` again. **The tree is clean at the
end or this record says it could not be measured without a trace.**

### What the measurement returned

**Outcome A. Neither moves.**

| reading | with the kind present |
| --- | --- |
| `tsc -p packages/registry/tsconfig.json` | **clean**, no further edit required |
| `node packages/registry/print-ledger.ts`, hashed | `18cc4e82…` — **the reference, byte for byte**, 1 206 bytes either side |
| `pnpm freeze` | **3 passed** |

The typecheck passing with only two edits reproduces ADR-0223's reading of the same seam: `decode`
returns `unknown` so a missing arm is assignable, and `everyValueIn` is a generator so a missing arm
yields nothing.

### The control, which is what makes the zero worth anything

**An arm that intercepts nothing changes nothing, and that is a tautology unless the probe can fail.**
So the same arm was re-aimed — one character of its predicate, `[object Temporal.` to `[object
Object]`, so that it catches the plain objects the catalogue is full of — and re-read:

| reading | with the arm intercepting |
| --- | --- |
| the ledger, hashed | **`2dbce1f30fd4fbe2971a517b0327fbbb6b67571458f214d081d2da1ea32c6866`** |
| `pnpm freeze` | **1 failed, 2 passed** — `every-published-binding-still-hashes-to-what-it-was-published-as`, **alone** |

**So the probe could return B, and returned A.**

### The two questions turn out to be coupled, and the mechanism says why

**Outcomes C and D have no instance**: the digest moved and the freeze reddened together, and they
stayed still together. That is not luck. `bindingsAtRevision` runs `git worktree add --detach` at the
published commit and spawns **that commit's own entry point**, so the past is produced by the *old*
encoder while `theLocalLedger()` is produced by the current one. **An encoder that changes what it
emits makes the two disagree by construction**, which is the shape ADR-0107 built and which nothing had
put under load until now.

### What this says about item 1

**It is ordinary work, under a condition that is measurable and guarded.**

`value.ts` is in no digest **by its content** — `THE_SHARED_FILES` is two files of
`packages/catalogue/` and names it nowhere. It is in every digest **by its output**. So a kind is
addable exactly while its arm intercepts nothing already encoded, and the control above is what that
costs when the condition is broken: six bindings adrift and a red guard naming it.

**The condition is not a hope; it is kept.** The mechanism that refuses a bad addition exists, is the
one guard that fires, and fires alone. **So item 1 is not the owner's decision** — it is work whose
correctness the freeze already checks, and the check was seen red on the real failure rather than
argued.

**What remains the owner's is unchanged and is elsewhere**: whether an eighth contract is published at
all. Nothing here touches that.

### Items 2 and 3 are not in this perimeter, and now that is measured rather than assumed

`literal.ts`, `read-literal.ts` and `AS_AN_ARGUMENT` are `packages/site`. **No digest reaches that
folder** — neither by content, `THE_SHARED_FILES` naming two files of `packages/catalogue/`, nor by
output, since what those modules produce is a page and not an encoding. **So ADR-0218's items 2 and 3
stand at what it priced them**, and the lock this record went looking for is item 1's alone — where it
turns out not to be a lock either.

## Consequences

**Adding a kind to `value.ts` moves no published digest**, and `the-freeze.test.ts` stays green:
`18cc4e82…` byte for byte, 3 passed. **Item 1 of ADR-0218's price is ordinary work**, not permanent
rule 6, and the condition it rests on — an arm that intercepts nothing already encoded — is kept by the
freeze, seen red on its real failure with the digest at `2dbce1f3…`.

**The two questions are coupled and the mechanism is named**: the past is rebuilt by the commit's own
entry point, so an encoder that changes its output makes the local ledger and the rebuilt one disagree.
Outcomes C and D — a silent divergence — have no instance.

**Items 2 and 3 are outside the perimeter**, measured on `THE_SHARED_FILES` and on what those modules
produce.

**Nothing is taken.** No kind is added for good, no spelling, no key, nothing under `contracts/`, no
contract written, no guard added or changed. `THE_PACKAGE_VERSION` stays at `1.2.0`. **The tree is
clean**: `git status --porcelain` and `git diff --stat` are both empty after the counter-edits, and the
ledger reads `18cc4e82…` again.

## What would reopen this

* **A kind whose arm intercepts something already encoded.** That is outcome B, it is what the control
  produced, and it is a decision rather than a repair — six addresses rebound.
* **A kind that has to be spelled to be published.** This probe added the type and the arm and stopped
  where the compiler stopped. If a future kind needs a `literal.ts` spelling *before* a contract can be
  published, the site's modules enter the path even though no digest reaches them.
* **The freeze ceasing to rebuild at the commit.** The coupling measured here rests entirely on
  `bindingsAtRevision` spawning the published commit's own entry point; a rebuild that used the current
  encoder on historical data would make outcome C reachable and silent.
* **A shared file gaining `value.ts`.** `THE_SHARED_FILES` names two files today; a third that reached
  the encoder would put its content inside every digest and make any edit to it a rebinding.

## More Information

### Coordinates

The two criteria, the four outcomes, the prediction and the protocol are committed at **`84a173f`**,
before the probe was written. Everything after them was measured on **2026-09-05** against that tree, on
node v24.15.0, Windows.

The probe is two edits to `packages/registry/value.ts` — an arm on `EncodedValue` and an arm in
`encodeAt` immediately after the `Date` one — reverted by counter-edit. **`git status --porcelain` and
`git diff --stat` are both empty after it**, and the ledger reads
`18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, which is what it read before.

### Why `confirmed-by` is empty

Nothing here is kept by a guard: the subject is what a guard would say if the tree were different, and
the tree is put back.
