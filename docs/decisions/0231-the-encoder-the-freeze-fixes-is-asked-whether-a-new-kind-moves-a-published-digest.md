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

## Consequences

To be completed after the measurement, which is the point of committing this half first.

## What would reopen this

To be completed with the measurement.

## More Information

### Coordinates

The two criteria, the four outcomes, the prediction and the protocol are committed before the probe is
written, against the tree at `d7edf3c`.

### Why `confirmed-by` is empty

Nothing here is kept by a guard: the subject is what a guard would say if the tree were different, and
the tree is put back.
