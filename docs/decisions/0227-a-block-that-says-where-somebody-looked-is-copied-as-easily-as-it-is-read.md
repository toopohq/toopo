---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A block that says where somebody looked is copied as easily as it is read

## Context and Problem Statement

ADR-0226:165 writes *`mutation/decisions.ts` has nine fault functions*. **It has eight.** The record
whose subject is figures that were published without being read published one, in the sentence pricing
the mechanism that would have caught its neighbour.

The owner found it, gave the eight line numbers, named the file's own corroboration and asked for the
count to be verified rather than repeated — *it is exactly the form of defect that has cost me several
errors on this project*.

### Why the figure is not a slip

It is written in **nine** places and it was **never true in any of them**. The file was created at
`ba78284` on 2026-08-15 with eight fault functions, and the set has not moved across the ten commits
that touch it — none added, none removed. So no reading of the code was ever behind the number.

## Decision Drivers

* **A figure is verified against what a file declares, not against what it mentions.** The two differ
  here by exactly one name, and the difference is the whole of the defect.
* **A repair chooses between correcting a figure and removing it, and this repository has already
  ruled**: *when a sentence can be true without counting, it does not count*. Correcting nine to eight
  leaves the same class of defect standing at eight places.
* **The distinction ADR-0226 drew decides where each occurrence goes**, and applying it entry by entry
  is what keeps the repair from being a series of local judgements.
* **Naming the class matters more than repairing the instances.** Whether this widens ADR-0226's open
  entry or opens another decides how the next one is recognised, and it must be settled explicitly
  rather than implicitly by how the repair is done.

## Considered Options

* **Correct nine to eight in every place.** Refused: it keeps a decorative count in eight blocks and
  buys nothing the sentence did not already say.
* **Correct and enumerate, as `CLAUDE.md`:3600 does.** Refused as a general treatment: it is right
  where a reader needs to recognise the eight by name, and it is duplication eight times over.
* **Remove the count where it does no work; note it where the document is stamped.** Retained.

## Decision Outcome

### The owner's count, verified and corrected in both directions

**His eight line numbers are exact** — 394, 410, 426, 440, 449, 467, 486, 502 — and so are both
corroborations: `decisions.ts:162` reads *`declarationFaults` is what keeps the other seven from being
vacuous*, and `decisions.test.ts` carries **eight** `it(…)`, one per function.

**His count of the occurrences is short by three.** The figure stands in **nine** places, not six:

| place | |
| --- | --- |
| `CLAUDE.md:1813` | **not in the open list** — the prose introducing `docs/decisions/` |
| `CLAUDE.md:2405` | entry ADR-0212 |
| `CLAUDE.md:3037` | entry ADR-0191, ADR-0192, ADR-0207 |
| `CLAUDE.md:3088` | entry ADR-0174 |
| `CLAUDE.md:3635` | entry ADR-0226 |
| `CLAUDE.md:4681` | entry ADR-0018, ADR-0189 |
| `CLAUDE.md:4765` | entry ADR-0163 — **written as *nine guards*, which his search could not match** |
| `CONTRIBUTING.md:234` | **a second file**, and the one a contributor is told to read first |
| `docs/decisions/0226:165` | this record's own |

So it is **six entries of the open list and not five**, and the wording varies: *nine fault functions*
seven times and *nine guards* twice. **His unrelated nine at `CLAUDE.md:4350` is unrelated** — it
counts faults a guard reported, as does ADR-0105:254 — and he is right about it.

**And the true figure was already in the file.** `CLAUDE.md:3600`, the entry ADR-0173 left, reads *the
eight fault functions of `mutation/decisions.ts`* and **enumerates all eight**. It sits **thirty-five
lines above** the copy written into the ADR-0226 entry. The file has carried the right answer and the
wrong one, in adjacent entries, for as long as the second has existed.

Two more places state it correctly: `decisions.ts:16`, *the eight guards it costs*, and ADR-0001:200,
*The eight guards are named in `confirmed-by` above* — whose front matter carries exactly eight.

### The origin, measured rather than presumed

The owner's presumption is that `guardAddressFaults` produced the nine. **It is confirmed, and it is
worth stating as a rule because it is reproducible.**

Nine identifiers ending in `Faults` are **visible** in `decisions.ts`; **eight** are **declared** there.
The ninth is `guardAddressFaults` — named in the header at line 64, imported from
`packages/registry/address.ts` at line 110, and called at line 452 inside `confirmationFaults`. So it
is not a stray mention: it is a real dependency doing real work, which is why nothing looks wrong.

> **A count over what a file mentions renders nine; a count over what it declares renders eight.**

That is a reading anybody can take twice and get the same wrong answer from, which is what separates it
from a typo and is why it survived nine copies.

### The class: neither ADR-0226's, nor a new one

**It is not ADR-0226's.** That class needs an **event** — a correction made in one record and not
propagated to another — with a source, a target and an address linking them. Here nothing was
corrected, nothing drifted, and there is no address: the figure was wrong at birth and stayed exactly
as wrong.

**And it is not new.** `CLAUDE.md` names it already, at rule 3 of the section on how an entry is
written: *an entry written from an assumption about what the code holds, rather than from a reading of
it, is wrong on the day it is published and stays exactly as wrong — nothing about it looks old.*

**So ADR-0226's entry does not widen and no second entry is opened.** What is new is smaller and worse:
**the defect is in rule 3's own remedy.** That rule prescribes that an entry *names where it looked*,
and a *Where this looked* block is prose — so the cheapest way to write one is to lift a neighbour's,
and **a copy is indistinguishable from a reading**. The remedy for describing a schema nobody opened is
itself copiable without opening anything.

### The two classes were living in one form, which is the measurement that settles it

The same sweep found `CLAUDE.md:4520` — *`mutation/workflows.test.ts`, whose nine guards read what that
file may hold*. That file's guard count over its six commits is **3, 7, 8, 9, 10, 12**: nine was true
from `9d75428` on 2026-08-21, and it is **twelve** since `aaf625f`, yesterday.

**So one block carries rule 3's failure and its neighbour carries rules 1 and 2's, and they read
identically.** Only counting separates them. That is the reason this record settles the class by
measurement rather than by argument, and the reason the entry is not widened: widening ADR-0226's would
have folded a drift and a birth defect into one mechanism that fits neither.

### The repair, decided by ADR-0226's own distinction rather than case by case

That record repaired one `CLAUDE.md` sentence and left two, and stated the rule: **a stamped record
takes a note; a living document's present-tense sentence that nothing following corrects is repaired.**
An open-list entry is not a dated narration — it is written in the present and nothing follows it that
says otherwise.

| place | branch | |
| --- | --- | --- |
| the eight in `CLAUDE.md` and `CONTRIBUTING.md` | **repaired** | present tense, nothing follows correcting them |
| `docs/decisions/0226:165` | **note** | stamped |

**And the repair removes the count rather than correcting it**, which is this repository's first rule
for publishing a figure: *when a sentence can be true without counting, it does not count.* In all
eight the number carries nothing — the claim is *every one resolves what a record names and not one
reads what a record says*, and it is exactly as true of eight as of nine. Correcting the digit would
have left eight decorative counts to go stale the day a ninth function is written.

`CLAUDE.md:3600` **keeps its eight**, because there the figure accompanies the enumeration and a reader
can check it on the spot. `decisions.ts:16` and ADR-0001:200 keep theirs for the same reason: both are
beside the thing counted.

**Why no note accompanies the eight repairs**, stated rather than assumed: a note exists so a reader
meeting a false sentence meets its correction. Removing the sentence removes the reader's exposure, and
`CLAUDE.md` is a living document whose present tense is its whole contract with a session. A note there
would preserve a wrong figure in order to explain it.

### What the sweep found beyond the figure

The population rule 3's remedy creates is measurable and it is larger than this: **37 *Where this
looked* blocks in `CLAUDE.md`, carrying 104 counted claims between them.** Nine of those claims are the
one this record repairs and one is `workflows.test.ts`'s; **the other ninety-four are unread here**, and
that is stated so the count is not mistaken for a clean bill.

## Consequences

**Eight occurrences are repaired by removing a count that did no work, and one stamped record takes a
note.** The figure is gone from `CLAUDE.md` and `CONTRIBUTING.md`.

**ADR-0226's open entry is unchanged and no new entry is opened.** The class is rule 3's, already named
in `CLAUDE.md`, and what is added there is that its remedy is copiable — with the measurement, the two
figures and the thirty-five-line distance.

**The origin is published as a rule rather than as an anecdote**: a count over what a file mentions and
a count over what it declares differ by the imports it uses, and only the second is a count of the file.

**No guard is added or changed**, including one that would catch this — asked for and refused by the
owner in the same breath as the unit, and the refusal is kept here rather than restated as a cost.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/` or
`packages/` moved, none of ADR-0218's three repairs was taken, `THE_PACKAGE_VERSION` stays at `1.2.0`,
`pnpm freeze` is green on 3 guards either side and the ledger is byte-identical at `18cc4e82…`.

## What would reopen this

* **A ninth fault function in `mutation/decisions.ts`.** `CLAUDE.md:3600` enumerates eight and would
  have to gain it; the eight repaired blocks would not, which is the point of removing the count.
* **A count of the other ninety-four claims in those blocks.** One of them being wrong in the same way
  would say the copying is systematic rather than twice, and would be an argument for the guard refused
  here.
* **A third instance where a *Where this looked* block was demonstrably copied**, which would take this
  from an observation on rule 3 to an entry of its own.
* **A reading that shows `guardAddressFaults` was never the origin** — it is a presumption confirmed by
  arithmetic and not by any record of what somebody typed.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `c62db7a`, on node v24.15.0, Windows. The declaration
count is `^export const …Faults` over `mutation/decisions.ts`; the history is `git log --follow` over
that file and over the two test files, reading each blob at each commit; the occurrence sweep is
`git grep` over the tracked tree for *nine fault*, *fault functions*, *nine guards* and `decisions.ts`,
which is what turned up the two occurrences worded *guards* and the one in `CONTRIBUTING.md`.

Nothing outside `CLAUDE.md`, `CONTRIBUTING.md` and `docs/decisions/` was edited.

### Why `confirmed-by` is empty

For ADR-0226's reason, unchanged, and sharpened by this record: the mechanism that would read a figure
in prose against what produced it is the one four entries of the open list already price and refuse.
