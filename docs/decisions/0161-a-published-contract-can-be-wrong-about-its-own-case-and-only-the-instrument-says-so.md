---
status: accepted
date: 2026-08-24
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/snapshot.ts
  - packages/registry/the-catalogue.ts
  - packages/site/contract-page.ts
  - mutation/run.ts
confirmed-by:
  - battery: registry-storage
    guard: a-correction-names-a-case-the-contract-settles-and-quotes-what-it-says
  - battery: registry-storage
    guard: a-correction-carries-the-commit-it-was-taken-at
  - battery: site
    guard: a-correction-reaches-the-reader-beside-the-sentence-it-corrects
---

# A published contract can be wrong about its own case, and only the instrument says so

## Context and Problem Statement

`object/deep-equal@1` was published at `3ec621c`. Its central clause is that the pairs under
comparison are a **path** and not a memo — entered on the way down, left on the way up — and it
publishes two rows as the witness of what a memo would do, with a rationale saying in as many words:

> An implementation that memoises the pairs a failed candidate tried answers `true`, because the
> failed attempt left `({v:1}, {v:2})` marked as assumed equal.

The battery injects exactly that defect: `DE-01` replaces the line that takes a pair back off the path
with a no-op. **It survived.**

Measured at `3ec621c`, the memoising walk against the sound one over the four forms of the witness:

| form | sound | memoising |
| --- | --- | --- |
| as published, keys as declared | `false` | `false` |
| **as published, keys transposed** | `false` | **`false`** |
| one object shared, keys as declared | `false` | `false` |
| one object shared, keys transposed | `false` | **`true`** |

**Neither published row separates the defect.** One form does, and it needs two things at once: the
keys transposed *and* the right-hand `also` holding the very Set member the failed candidate tried.
The published witness holds a fresh object there, and the path is keyed by identity — so the pair the
failed candidate left behind is never asked for again. Instrumented, the mutant leaves three pairs on
the path and finds none of them.

The rows are **correct rows**: `false` is the answer, every shipped implementation measured gives it,
the specification is intact and nobody holds code that behaves wrongly. What is wrong is the
explanation printed beside them, and `edge-cases.ts` is inside the digest every lockfile holds.

## Decision Drivers

* A reader holding a false explanation is a real cost and is not the cost a second major is for.
* The freeze exists to protect what somebody has already installed.
* A rationale is prose beside a correct answer, and nothing in this repository reads prose.

## Considered Options

* Publish `object/deep-equal@2` with the rationale repaired.
* Leave the survivor unexplained, or borrow a neighbouring survivor class for it.
* Keep the frozen half as it stands and correct it in the revisable half.

## Decision Outcome

**Chosen: no second major. `DE-01` survives under a class that did not exist, and the correction goes
into the standing.**

### Why not a second major, priced rather than felt

A second major of a contract this catalogue already serves costs: a duplicate the search does not tell
apart, the install command printed on every page of the first one ceasing to work, no folder for the
second to live in, and two majors wanting the same installed path. That was costed a week before this
and none of it has moved. **Republishing for an explanatory sentence, when the specification is
correct, is disproportionate** — and the freeze exists precisely to protect what somebody has already
installed from being moved for the catalogue's convenience.

### `its-witness-is-frozen-out`, and why neither neighbour fits

`DE-01` is not `equivalent`: an input tells the two apart and it is measured, not imagined. It is not
`unreachable-on-this-catalogue`: a larger catalogue does not reach it, because what is missing is not a
value somebody has yet to publish but a **row inside a contract that may no longer take one**.

So it is named rather than borrowed. It is the sixth kind of survivor and the only one that cannot be
closed: the other five end when somebody writes a test, specifies a behaviour, publishes a contract or
takes a lens away, and this one ends at the next major of the contract that owns the case, or never.
The README publishes it as a count beside the other five, because a survivor total without its split
reads as a count of holes and **this one really is a hole**.

`F-15` is the second instance on the day the class was written. It caches the last pair and its
verdict, which answers correctly until a graph is mutated between calls. `no-ambient-input-from-history`
was written for exactly that implementation — the contract names it in the reason for `no ambient
input` — and it asks the same pair before and after an arbitrary *history*, which moves the cached
references, so the cache misses and recomputes correctly. What separates them is a call, a mutation,
and a second call through the same references. That probe belongs in `properties.test.ts`.

### The correction goes into the standing, and it is a fifth field rather than a fourth reused

`againstTheLanguage` was measured against this and refused. The two carry the same three statements
and they are about different things: a re-examination is a reading against **a specification this
repository does not own**, and its first field is `whatMoved`. Here nothing moved. The prose was false
on the day it was published and what changed is that somebody measured it, so `whatMoved` would have to
be filled with a non-event — which is what a field being borrowed rather than fitted looks like.

`correctionsToFrozenProse` carries the address of what it corrects, the frozen sentence quoted, the
reading that refuses it, and what that reading establishes. Measured: with both corrections declared,
`every-published-binding-still-hashes-to-what-it-was-published-as` is green and no published digest
moves.

**Two of its four fields are `executable` and that is not a formality.** `about` resolves against the
contract's own case identifiers. `published` has to occur in the rationale of that case, compared with
runs of whitespace collapsed — and that guard **caught its own author on its first run**: the second
correction quoted a sentence I had paraphrased rather than one the contract carries. A quotation nobody
checks is free to soften, and a reader meeting the two side by side is entitled to believe the
left-hand one is what the contract says.

**The correction is rendered inside the case it corrects.** A reader who reads a rationale and meets
its correction three screens down has already believed the rationale. The frozen sentence stays exactly
where it is — it is what this catalogue published, and an auditor fetching the snapshot receives it —
and the correction stands beside it rather than over it.

## Consequences

* Good: the catalogue can now say that something it published is wrong, which it could not before, and
  a reader meets that where they meet the claim.
* Good: a survivor this repository would have had to leave unexplained is classed by what it is.
* Bad: the two rows go on being the witness of nothing for the life of this major, and no guard can be
  added to catch `DE-01`. The seven files are the contract's whole surface and all seven are frozen.
* Bad: a fifth standing field is a fifth thing a consumer can ignore. It travels in the binding and not
  in the snapshot, so an auditor who reads only the snapshot reads the false sentence with nothing
  beside it — which is the cost of the freeze and not of this field.

## What would reopen this

**A second contract needing a correction reopens the shape rather than the decision.** One is a
sentence measured false; a pattern would say something about how this catalogue writes rationales, and
the field is what makes the pattern countable.

**A correction that cannot be written as a quotation reopens the type.** Both here quote a sentence.
A rationale wrong by omission — true in every clause and misleading whole — has nothing to quote, and
`published` would have to become something looser, at which point the guard that caught its own author
stops working.

**And the survivor class reopens if a second one is ever closable.** It is written as the kind nothing
closes; a mechanism that let a published contract gain a row without moving its digest would make that
false, and no such mechanism is in sight.

## More Information

### What this demonstrates, and it is worth more than the defect costs

This rationale was written by the assistant, read and approved by the owner, and published. Two people
who both knew the danger of cycle detection — the row exists *because* one of them got it wrong an hour
earlier — read a witness for the fault and neither asked whether it witnessed.

**Only the instrument said so.** Not a review, not a reread, not the suite: a mutant that injected the
exact defect the sentence describes and a battery that refused to call the run healthy when nothing
reddened. That is this repository's whole thesis, tested on the two people who wrote it, and it is
better evidence than any argument either of them could put in its place.

### The same shape twice in two days, and both were the owner's

The acceptance criterion for the unit that widened `packages/registry/value.ts` was *ninety-eight
sides, zero refusals* — a criterion that counts refusals, called fidelity, which could not see a symbol
key being dropped silently. The next day, *write the witness with its provenance* — a criterion that
checks the reasoning of a case and never asks whether the case distinguishes the defect it names.

**Both are controls that look in one direction only**, and both were written by whoever was checking
rather than by whoever was building. That is not a coincidence and it is not a failure of care: a
checker asks *is this argument sound*, and the question that catches these is *what would this be
unable to see*.

### What nothing keeps

A rationale is prose and a case is data. Nothing in this repository reads a contract's own prose
against its own behaviour, and the entry for that is in `CLAUDE.md` under what the repository declares
and nothing keeps. The population is every sentence of every published contract; the only path that has
ever found one is a replay.
