---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A record that announces a correction is not a record that posts one

> **A figure in this record is wrong, and it is of the class this record could not see.** *`mutation/
> decisions.ts` has nine fault functions* — **it has eight**, at lines 394, 410, 426, 440, 449, 467,
> 486 and 502, and it has never had nine: the file was created at `ba78284` with eight and the set has
> not moved across the ten commits that touch it. The file says so itself — *`declarationFaults` is
> what keeps the other seven from being vacuous* — and `decisions.test.ts` carries eight `it(…)`, one
> per function.
>
> **The ninth name is measured rather than guessed.** `guardAddressFaults` is the one identifier ending
> in `Faults` that the file *mentions* without *declaring* it: imported at line 110 from
> `packages/registry/address.ts` and called at line 452 inside `confirmationFaults`. **A count taken
> over what a file mentions renders nine; a count taken over what it declares renders eight** — which
> is reproducible, and is why it kept being written.
>
> **It is not this record's figure and it is not stale.** It was copied into nine places, seven of them
> `CLAUDE.md`, one `CONTRIBUTING.md` and this one, and it was **never true anywhere**. That is the
> class `CLAUDE.md` names at rule 3 of its open list — *false without being stale* — and not the class
> this record names, which needs an event to fail to propagate.
> [ADR-0227](0227-a-block-that-says-where-somebody-looked-is-copied-as-easily-as-it-is-read.md) measures
> it and repairs the eight live occurrences.
>
> **The sentence the figure sits in stands.** All eight functions were read: every one resolves what a
> record *names* and not one reads what a record *says*, so the mechanism named unbuilt below is
> unbuilt for the reason given.

## Context and Problem Statement

ADR-0225 closes with *ADR-0216, ADR-0223 and ADR-0224 are corrected and none is rewritten. They are
stamped, so the correction is here.* **No head note was posted on any of the three.** So a reader
landing on a stamped record met a sentence the repository had already measured to be false, with
nothing on its face saying so — and the record that knew it was three files away.

The owner found it by reading, reproduced ADR-0225's central measurement on his own machine before
answering, and named three readings to verify. This record repairs the debt, reports what the sweep
found beyond those three, and names the mechanism that let it happen twice.

### Why this is not a tidy-up

`CLAUDE.md` states the rule this violates, at the head of its own open list: **the change that builds a
mechanism sweeps for every entry naming it and closes them in the same commit**, because *separating
them is what leaves the false half of a true sentence lying where somebody will read it*. A head note
is that sweep for a stamped record. Announcing a correction and posting none is the one shape the rule
is written against, arriving on the record that announced it.

## Decision Drivers

* **A head note is for a claim that has stopped being true, never for one confirmed again.** A note on
  an unmoved claim is noise that trains a reader to skip notes, and it makes the next real one cheaper
  to miss.
* **An observation and the classification built on it are two claims and they fall separately.**
  `PlainDate.add({ hours: 5 })` answering the input unchanged is reproduced everywhere it appears; *
  `PlainDate` ignores its time units* is false. Four records carry the first and three carry the second,
  and a note that conflated them would either over-claim or under-claim on every one.
* **A note that contradicts a note must say so.** ADR-0216 carries three and ADR-0223 one; a new note
  that quietly sits beside an exemption clause it falsifies leaves the reader to notice the collision.

## Considered Options

* **Notes on the three ADR-0225 names.** Refused: the sweep found five records carrying a claim that
  has stopped being true, and a repair scoped to the announcement rather than to the population repeats
  the defect one level up.
* **Notes on every record mentioning `PlainDate`.** Refused on measurement: ten files mention it and
  four of them carry only claims that are reproduced.
* **Notes on the population the sweep returns, and a record for what the sweep itself found.**
  Retained.

## Decision Outcome

### The owner's three readings, verified

All three are exact, and one attribution is corrected.

* **ADR-0223's head note**, lines 14-15 and 19-20 — *the arity is four and unchanged* and *The case
  table figure of 40 rows is corrected to 50*. **Confirmed**; both are overturned by ADR-0225, and the
  note carried no pointer to it.
* **ADR-0216:92 and :100** — the row `| PlainDate | 4 | **6** — every time unit | 0 |` and the
  *two-swallow-three-refuse* reading. **Confirmed.** **The attribution is corrected**: the head note
  declaring that reading unaffected is the **ADR-0224** note, whose closing clause is *the second
  residue decision, the two-swallow-three-refuse reading and every other row are unaffected*, and not
  the ADR-0217 note, which says only *what stands unchanged is everything measured here*. The new note
  narrows the ADR-0224 one and names the clause.
* **ADR-0224 at 98, 118, 131, 147 and 154** — `PlainDate` 6, 6, 6; the structural row; 50 rows; the
  arity is four, twice. **Confirmed**, and it carried no head note at all.

### What the sweep found beyond them

**Two more records carry a claim that has stopped being true.**

* **ADR-0217:182** — *`PlainYearMonth` and `Instant` refuse where `PlainDate` and `PlainTime` ignore*.
  One term of four is false; the sentence it serves — the language still contests itself on the second
  decision, the ecosystem does not — is untouched. **And the sweep found a limit in that record nobody
  had named**: its library rows were read at **one magnitude**, `CalendarDate.add({ hours: 5 })`
  answering the input unchanged, which is the method that misread `PlainDate` for three records.
  Whether `@internationalized/date` also truncates at a whole day is unmeasured here and by ADR-0225.
* **ADR-0219:87-89** — *the ambiguity lands on the row the contract exists to publish*, argued on
  `2026-01-15` being accepted by `PlainDate` and `PlainYearMonth` alike. Two of the three carriers in
  that ambiguity are outside the contract.

**And ADR-0223 carries the same debt this record repairs.** Its Consequences read *Two records are
corrected and neither is rewritten … ADR-0220's classification of `Instant` is refuted … All three are
stamped, so the correction is here*, and **no note was posted on ADR-0220**, which still publishes
*`Instant` and `ZonedDateTime` are the two that are not zone-free* and *the zone-free subset is at most
five*. Both are false — `Instant` is zone-free for `add`, measured with a positive control, so the
subset is six. **The defect is therefore a recurrence and not a lapse**, which is what makes it worth a
record rather than a commit message.

### ADR-0219's own reopening trigger, examined — and it does not fire

That record names *a retained form over fewer carriers … whose ISO strings are mutually exclusive* as
what would reopen it, and ADR-0225's arity of three is exactly that condition to test. Re-measured by
its own method — each string offered to each carrier's `from` — over twelve strings on Chrome 152:

| | strings |
| --- | --- |
| ambiguous among the seven carriers | **5** |
| ambiguous among the three retained | **3** |
| retained carriers with an unambiguous string of their own | **3 of 3** — `12:30:00`, `2026-01`, `P1D` |

The three that still collide are `2026-01-15T12:30:00`, `2026-01-15T12:30` and
`2026-01-15T12:30:00-05:00[America/New_York]`, and **all three are taken by `PlainTime` and
`PlainYearMonth`** — precisely the two carriers whose verdicts differ. **So the trigger is examined and
does not fire**: the retained carriers are not mutually exclusive, a narrower form is not a way round
form A, and ADR-0219's conclusion stands.

**Its illustration does not.** Among the retained three, `2026-01-15` is taken by `PlainYearMonth`
**alone**. The ambiguity survives on a different pair and a different string, which is a stronger
result than the record's own example and a different one.

### The six notes, and what each says stopped being true

| record | what stopped being true | narrows |
| --- | --- | --- |
| ADR-0216 | the `PlainDate` row, and *two carriers swallow* | its ADR-0224 note, on the clause exempting that reading |
| ADR-0223 | the arity of four; 50 rows | its ADR-0224 note, on both clauses, named |
| ADR-0224 | `PlainDate` 6, 6, 6; the structural row; 50 rows; arity four | — (its first note) |
| ADR-0217 | one term of the language-side sentence | — |
| ADR-0219 | the ambiguity's population and its illustration | — |
| ADR-0220 | `Instant` is not zone-free; the subset is at most five | — (ADR-0223's debt, repaired here) |

### What is deliberately left without a note

* **ADR-0215.** Every `PlainDate` in it is the **unknown key** — `add({days: 1, dayz: 9})` answering
  `2026-01-16`, 24 of 24 — which ADR-0223 reproduced and ADR-0225 leaves alone, plus the namespace
  enumeration and `PlainDate.from` on non-ISO text. Nothing moved.
* **ADR-0218.** Its `PlainDate` occurrences are a refused signature and a case-table rendering, and
  ADR-0225 measures both of its prices unmoved.
* **`PlainDate.add({ hours: 5 })` answers the input unchanged**, wherever it appears — ADR-0216:101,
  ADR-0219:88, ADR-0220:135. Reproduced. It is the classification, not the observation, that fell, and
  saying otherwise in a note would teach a reader to distrust a correct reading.
* **ADR-0219's table row `PlainDate` + `{hours: 5}` → *ignored***, true of the value it names.
* **ADR-0224's refusal of the structural reading**, four of six carriers disagreeing. `PlainDate` moves
  from 7-against-6 to 7-against-0, which leaves its *no* verdict intact and widens the gap.
* **`CLAUDE.md`'s ADR-0223 and ADR-0224 paragraphs**, which state the arity of four and 50 rows. They
  are dated narrations of what each record found, and the ADR-0225 paragraph that follows them names
  both as falling. That is how the file already treats ADR-0219 and ADR-0220 being corrected by
  ADR-0223, and adding a note to a living document would be the treatment a stamped one needs.

**One `CLAUDE.md` sentence was repaired rather than left**, and the distinction is the distance:
*`PlainDate` ignores all six time units and `PlainTime` all four date units, silently* stood in the
present tense **300 lines** below its correction, in the open list rather than in the narration, where
no reader meets the paragraph that answers it.

## Consequences

**Six head notes are posted**, five owed by ADR-0225 and one owed by ADR-0223. Two of them name the
earlier note they narrow and the clause they narrow it on.

**ADR-0219's reopening trigger is answered negatively**, with the measurement in this record rather
than only in the note, because it is a reading somebody may want to rebuild.

**Nothing is reopened.** The rule ADR-0223 committed stays as committed, ADR-0225's arity of three
stands, and the `PlainDate` truncation defect stays a separate candidate rather than a repair of this
one — the owner's ruling, recorded in `CLAUDE.md` and not re-argued here.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/` or
`packages/` moved, none of ADR-0218's three repairs was taken, `THE_PACKAGE_VERSION` stays at `1.2.0`,
`pnpm freeze` is green on 3 guards either side and the ledger is byte-identical at `18cc4e82…`.

**And the mechanism is named rather than built.** Nothing in this repository reads *ADR-XXXX is
corrected* in one record against a head note on ADR-XXXX. `mutation/decisions.ts` has nine fault
functions and every one resolves what a record **names** — a path, a guard, a record, a link, the
presence of a section — and not one reads what a record **says**. It is the shape several entries of
the open list already price and refuse, and this one is narrower than a lint over prose: the announcing
sentence is formulaic, the target is an address, and the check is *does the target cite this record
back*. It is an entry of that list now, priced and not taken, because building it inside the unit that
repairs its instances would make the instances the argument for it.

## What would reopen this

* **A third record announcing a correction without posting one.** Two is a recurrence; three with the
  entry standing would say the convention cannot be kept by prose and the guard is owed.
* **A record whose corrected claim is not a sentence but a figure**, which the proposed check cannot
  see: it resolves an address, and a superseded number carries none.
* **A reading that shows `@internationalized/date` truncates at a whole day**, which would take
  ADR-0217's ecosystem row from *agrees* to something else and reopen the narrow reading of R5.
* **A carrier leaving or entering the arity**, which moves ADR-0219's ISO population again and would
  need that measurement retaken.

## More Information

### Where the probe lives

Outside this repository, on stage rule 5, alongside ADR-0225's.

### Coordinates

Measured on **2026-09-05** against the tree at `be647a5`. The ISO reading is Chrome
**152.0.7977.77** headless, reduced user agent `HeadlessChrome/152.0.0.0`, host zone `Europe/Paris`,
the draft guard passing — the same build ADR-0216, ADR-0219, ADR-0223, ADR-0224 and ADR-0225 used. The
record sweep is `git grep` over the tracked tree; the population it read is the **ten** files
mentioning `PlainDate`, plus every occurrence of *arity is four*, *50 rows*, *40 rows*, *swallow* and
*ignored in silence*.

Nothing in the tree was edited to take the reading, and `git status --porcelain` was empty across it.

### Why `confirmed-by` is empty

For ADR-0225's reason, unchanged: nothing here reads a record's reasoning, and the mechanism that would
is named above as unbuilt.
