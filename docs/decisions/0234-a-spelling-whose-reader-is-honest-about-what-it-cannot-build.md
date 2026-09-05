---
status: accepted
date: 2026-09-05
governs:
  - packages/site/literal.ts
  - packages/site/read-literal.ts
  - CLAUDE.md
confirmed-by:
  - battery: site
    guard: every-arm-of-an-encoded-value-is-read-back-or-refused-by-name
  - battery: site
    guard: a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime
---

# A spelling whose reader is honest about what it cannot build

## Context and Problem Statement

ADR-0233 re-costed ADR-0218's item 2 and stopped: the mechanical part is ten lines on `readDate`'s
shape, and the part that is not is that **a reader has to build a value where an encoder only reads
one**, with `Temporal` undefined on both runtimes this repository runs.

**The owner ruled: it refuses loudly, by name.** No skip, no runtime stand-in, no waiting. He gave three
reasons and asked for the third to be verified rather than believed — *if that guard demands the
reading and not the refusal, my reason 3 falls and I want to know*.

## Decision Drivers

* **A ruling verified is worth more than a ruling taken.** Two of the three reasons are rules this
  catalogue already holds; the third is a reading of a guard, and a guard is measurable.
* **The guard may not be widened to fit the work.** If a third category is needed it has to cost its arm
  *more* than the two beside it, or it is an exemption wearing a category's clothes.
* **The red comes before the arm, twice.** Once for the reader that does not know the form, once for the
  guard that does not accept the refusal — and the second is the measurement that settles reason 3.

## Considered Options

* **Leave `temporal` in `WITHOUT_A_SPELLING`.** Refused by the ruling: item 2 is the spelling.
* **Build a stand-in where the namespace is missing.** Refused, and the reason is ADR-0233's own: the
  construction is the axis that decides here, so a stand-in would make every guard exercise the
  substitute. Committing that in the unit after the one that recorded it would be the same fault twice.
* **Answer `undefined` and carry on.** Refused by `array/group-by@1`: *a runtime without the function
  fails loudly instead of skipping*.
* **Refuse by name, and teach the guard the category that refusal belongs to.** Retained.

## Decision Outcome

### Reason 3, measured — and it falls

The guard reads:

```ts
if (!withoutASpelling.has(kind)) return [kind, faultsOf(encoded)] as const
expect(() => read(text)).toThrow(WITHOUT_A_SPELLING[kind])
```

**Its two ways out are *read back* and *refused by the word `WITHOUT_A_SPELLING` holds*** — not *refused
by a message naming the carrier*. Take `temporal` out of that declaration and the guard demands
`faultsOf(encoded)` be empty, which is the reading. So a named refusal satisfies neither branch.

**Measured, in two reds.** With the spelling restored and no reader arm:

> ``UnreadableLiteral: `Temporal.PlainTime.from('12:30:00')` cannot be read as a value:
> `Temporal.Pla` begins no value this reader knows, at character 1.``

Then with `readCarrier` refusing by name, **the guard still reddens**:

> ``UnreadableLiteral: `Temporal.PlainTime.from('12:30:00')` cannot be read as a value:
> `Temporal.PlainTime.from(…)` names a carrier this runtime cannot build: `Temporal` is not defined
> here, so there is nothing to hand the value "12:30:00" to, at character 25.``

**The refusal is exactly what the ruling asks for and the guard refuses it anyway.** Reason 3 is wrong;
reasons 1 and 2 stand, so the ruling stands and the guard is what has to move.

### The third category, and why it is narrower than the two beside it

`READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT` declares, per arm, **two fragments the refusal owes**: the
carrier's own type name, and the reason the runtime cannot build it. Where `WITHOUT_A_SPELLING` asks
only that a word appear, this asks for both fragments on the same refusal — **so a message saying merely
*unreadable* passes the old shape and fails this one**. The category costs its arm more than the two it
sits beside, which is what keeps it from being an exemption.

Two guards keep it honest. `no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it`
holds the declarations disjoint, so nothing is filed under both and quietly takes the weaker test. And
`a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime` separates the two refusals — **which
the first guard cannot do**: without the reader's arm the refusal still throws and still carries the
type name, the type name being in the text somebody typed, so the fragment test would go on passing on
a message that names the wrong culprit.

### What a reader sees

    Temporal.PlainTime.from('12:30:00')

and, where the runtime has no namespace:

> ``Temporal.PlainTime.from(…)` names a carrier this runtime cannot build: `Temporal` is not defined
> here, so there is nothing to hand the value "12:30:00" to`

It names **which carrier**, **which value** and **why**, on `theDirectoryRefusal`'s pattern in
`packages/cli/where-a-file-may-land.ts` — a reason somebody can act on rather than one derived from a
grammar. A second arm answers the neighbouring case, a namespace that is present without the carrier in
it.

### The cell, and what it pins

**`W-179`** neuters `A_CARRIER_OPENS` rather than removing the dispatch, so `readCarrier` and its arm
stay referenced and `noUnusedLocals` does not turn the cell into a `killed-by-typecheck` measuring the
compiler instead of the claim. What is left is the state before this record: the spelling is printed and
the reader does not know it.

Measured by injecting it: **2 failed, 10 passed** —
`every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` and
`a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime`, exactly the two it pins and nothing
else.

### The readings

| | |
| --- | --- |
| ledger | `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11`, either side |
| `pnpm freeze` | 3 passed, either side |
| `packages/site` | 187 → **189** passed |
| `packages/registry` | 472 passed |
| `tsc -p tsconfig.json` | clean |
| `pnpm anchors` | 934 → **935**, none loose |
| census | `read-literal.test.ts` 10 → **12** |

`hasASpelling` now answers **true** for a carrier, because `temporal` has left
`WITHOUT_A_SPELLING` — which is the whole of what item 2 buys, and the site suite is green across it.

## Consequences

**Item 2 of ADR-0218 is paid.** The case table prints `Temporal.PlainTime.from('12:30:00')` instead of a
word, `hasASpelling` answers true, and a row holding a carrier is no longer kept out of the form by its
own value.

**Reason 3 of the ruling is refuted and the ruling stands**, on reasons 1 and 2. The guard gained a
category rather than losing a requirement.

**The limit is written where it is read, not only here**: in `readCarrier`'s own comment, in the
declaration the guard is built on, and in `literal.ts`'s arm. **The refusal is exercised and the
construction is not.** Every guard over this runs where `Temporal` is absent, so the branch that builds
a carrier is written and unread.

**Nothing else moved.** No contract is written, nothing under `contracts/` moved, no digest moved,
`engines`, `suites.yml` and the contributor floor are unchanged, item 3 is untouched, and
`THE_PACKAGE_VERSION` stays at `1.2.0`.

## What would reopen this

* **A runtime carrying `Temporal` on the matrix.** It deletes the third category — the arm moves into
  the reading half — retires the doubles of ADR-0232, and exercises the branch this record leaves
  unread. It is the same trigger item 1 carries, and it now lifts two things rather than one.
* **A second arm entering the third category.** One row is a category by declaration; a second would say
  whether the two fragments are the right thing to ask of every such refusal or only of this one.
* **A carrier whose `from` refuses its own rendering.** The reader hands back whatever `from` returns
  and asks nothing of it; ADR-0219 measured the pair lossless on seven of seven, and a carrier that
  parted would fail in the reader rather than in the encoder.
* **`read-literal.ts` ceasing to be a browser module.** The refusal is written for a runtime that may
  have the namespace; if this only ever ran on node, the honest arm would be a word again.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `98aba43`, node v24.15.0, Windows. The two reds were
taken in order, each before the change that answers it; the cell was injected and reverted by
counter-edit, with the suite back to 12 passed after it.

### Why `confirmed-by` names two guards

The third — `no-arm-is-both-without-a-spelling-and-read-only-where-a-runtime-carries-it` — is a claim
about two declarations and no cell reddens it: with one row in each and the rows disjoint by
construction, a mutant that made them overlap would be an edit to a test's own table. It is declared
here rather than counted as confirmed.
