---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/published.ts
confirmed-by: []
---

# A published count carries its coordinates, or it is not written

## Context and Problem Statement

A count in prose is true on the day it is written and goes on being read for months. Nothing moves it
when the data moves, so it becomes the one part of a true sentence that is false — and it is the part a
reader believes, because a figure reads as evidence.

This is not a hypothetical. It happened four times in this repository's own prose, twice with the true
sentence and the false one in the same file, and every one of them was found by rereading rather than
by any guard.

## Considered Options

- Correct each count when it is found to have drifted.
- Give every count its coordinates — the commit it was measured at, and the population counted.
- Write the sentence so that it needs no count at all.

## Decision Outcome

The three are not alternatives but an order of preference, and the cheapest comes last only because it
is not always available.

**Three published counts of guards were dropped rather than corrected, and the reason generalises.**
This sentence, `run.ts` and `every-contract.ts` all read *467*, and 467 had stopped being the number
of guard titles some time before anybody noticed. Which of the three things 467 once counted is not
recoverable, so nothing was patched: a count in prose survives the data it counted and becomes the one
part of a true sentence that is false. What each claim is actually about — *none carries a non-ASCII
code point*, *no identifier is duplicated inside a contract* — does not drift, and `calibrate()` is
what holds the second. It is the rule about identifiers rendering a count, arriving on comments.

**And the remeasurement that replaced 467 did not survive its own paragraph, which is the third
instance and the one that settles the treatment.** This sentence went on to publish *501 `it(...)` call
sites* and *974 collected assertions*, and neither reproduces under any counting I can construct.
Measured at `f5e91ba`, over every tracked `.test.ts` and `.test-d.ts`: **514 call sites — 479 written
`it(` and 35 arriving through `it.each` — and the census declared 998**, which was 472 + 288 + 27 +
146 + 62 + 3 across the six configurations and was what the six suites reported at that commit.
Restricting to `.test.ts` gave 486, and to `contracts/` gave 94; nothing gave 501, and nothing gave
974. A bare count replacing a bare count buys one cycle of being right.

So the pair is not dropped this time, it is **given its coordinates** — the commit and the population
counted — by the rule `packages/registry/contract-record.ts` carries for a published size. A count with a commit
beside it is re-derivable and stops being a claim about today; a count without one is the part of a
true sentence that goes false while nobody is looking, three times now in `CLAUDE.md` alone.

### A stamp does not travel

**A stamp does not travel to the sentence beside it, and that is the fourth instance — the one that
cost a clause rather than a number.** *the census declared 998* carries its commit and is true of it
for ever. *and is exactly what the six suites report when they run* sat immediately after, in the
present tense, over the same quantity — and it went false at `bbbd0da`, one commit later, when the
`cli` configuration went from 146 guards to 147 and the census total from 998 to **999**, measured at
`cbc0d0a`. The commit that falsified it is the one that added
`every-clean-refusal-resolves-to-the-guard-it-names` — so the sentence was broken by the very unit
that was closing this same class elsewhere in this file.

**A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
in one sentence, and it is the lie the reader believes, because it is the one written in the present.**
So: the clause carries the stamp, or it is stated at the commit, or it is not written. Nothing else is
available, and the middle one is what the paragraph above now does.

### The fifth instance, and what it measures is this rule's own difficulty

**ADR-0001 published a table of five unstamped counts, and its first row was false one commit later —
in the commit that published it.** The table names the four files with the worst prose-to-code ratio,
and the whole point of the record that carries it is that those four were about to be moved. Every row
reproduces exactly at `8f43fb5^`; at `8f43fb5`, `contract-record.ts` had gone from 434 lines of prose to
30, and the row saying 434 was published in that same commit. The repository-wide figure beside it —
19 761 against 34 902 — reproduces at no commit: its ratio was right, its two counts are each 126 away
from what a classifier reproducing all four rows gives, no single tracked file accounts for the gap, and
the cause is not established. Both are stamped now.

**Two of the five instances are in the documents that carry this rule, and they are two units apart.**
The third above is this record's own remeasurement, which did not survive its own paragraph; the fifth
is ADR-0001's table. Neither was written by somebody who had not read the rule — both were written by
somebody who had just written it. That is a better measurement of how hard the rule is to keep than any
argument for it, and it is the reason the rule is stated as a *shape a sentence must take* rather than
as a thing to remember: **a count is written with its coordinates in the same keystroke, or the next
reader of that sentence is being lied to on a schedule nobody controls.**

### The cheapest form is no number at all

**And the cheapest of the three is to need no number at all.** *Twenty-eight guards were left alone*
became *No guard was touched* in the profile-name section for exactly this reason: a state does not
drift where a tally does, and both sentences make the same claim. **When a sentence can be true without
counting, it does not count.** That is the rule to reach for first; the coordinates are what the
remaining counts get.

### The first violation is this record's own commit

**Measured here first, on the commit that publishes this rule.** Its message stated the size of
`CLAUDE.md` after the change as *2 887 lines, 233 245 B*; the measured figures are **2 897 lines,
233 471 B**, and the difference is that the message was written before the last two edits rather than
after them. The commit had to be amended.

It is kept here for the reason the six survivors of `number/parse@1` are argued rather than counted:
a rule whose first offender is its own author, in the act of writing it, says something about the
rule's difficulty that a flat statement of it cannot. An hour of work on this exact class did not stop
the class. Four more figures published in this project were wrong in the same way.

### The sixth, and it is a unit of measure rather than a stamp

**The archive was briefed as *121,6 kB empaquetés dont 30,4 kB de catalogue*.** Measured at `3844729`,
the packed archive was 128 527 B and the catalogue inside it was 30 438 B **unpacked** — 12 652 B of
the packed total. The sentence put a compressed whole beside an uncompressed part and read as one
figure with a share of itself; the share it implied, 25 per cent, is neither of the two true ones,
9.8 and 7.4.

**It is the sixth instance of this rule produced by the author of the project**, and that is why it is
recorded rather than quietly corrected in the brief it came from. The other five are about a figure
going stale. This one never was true: no commit would have made it right, because the two numbers were
never of the same kind. So the rule gains a clause it did not have — **a count carries the unit it was
counted in**, and a ratio of two counts is only a ratio when both were.

### The seventh, and it is the first that was never taken at all

**A commit was said to be *the only one of 392* carrying a `Co-Authored-By` trailer.** Measured over
the graph as it then stood: **363 of its 393 commits carried one**, 349 of the 374 on `main`. The line
was not an exception, it was the convention, and the sentence was wrong by the whole population.

**That measurement became unverifiable on 2026-08-18, and it is left standing rather than corrected.**
[ADR-0124](0124-the-co-signature-leaves-the-history.md) took the trailer out of every commit, so the
graph it counted no longer exists and nobody can re-take the reading. The sentence stays true — it is
past tense and it says which graph it counted — and the honest repair is this clause and not a new
number. **Rewriting the figure would be committing, in the record whose subject is figures nobody
took, the failure the record was written about**: there is no population left to count, so any digit
put here would be one somebody decided rather than measured. The rule this instance produced is what
survives, and it does not depend on the count.

**What is new is not the error but how it survived.** It was written in a report, and the instruction
that answered it adopted the figure and reasoned from it — *one in 392 is an inconsistency, remove it*
— which is a sound argument from a false premise, and it removed the line from the two commits that
were following the convention. Neither party counted. The first six instances of this rule are a
figure that went stale or a figure whose two halves were of different kinds; every one of them was
true when it was taken. This one was never taken.

So the rule gains the clause its first six could not reach. **Coordinates answer *is this still true*;
they do not answer *was this ever measured*, and a figure that decides something needs both.** The
failure mode is specific and worth naming, because it is invisible from inside: agreement looks exactly
like corroboration. A second reader who accepts a number adds confidence to it and no evidence, and the
number is then load-bearing in a decision that neither party can trace to a measurement.

**What makes it catchable is the grammar rather than the subject.** *The only*, *the first*, *the
exception*, *none of them* — each is a count wearing the clothes of an observation, and each is
refutable by one command. The repair is not more care; it is treating those four phrases as figures,
which is what this record already requires of anything spelled with digits.

## Consequences

`mutation/published.ts` is where this decision is paid rather than argued: `THE_REPLAY` carries a
`measuredAt` beside its `duration`, a `spread` that says what the runs of one population were, and
`THE_COMMITS_QUOTED`, so that a commit cannot be quoted in the prose of that module without being
declared in it.

The cost is that a figure worth publishing is a figure worth stamping, and a stamp is a commit
somebody has to have. A measurement taken on a dirty tree therefore cannot be published here at all,
which is the closed direction.

## Confirmation

`every-figure-on-the-method-page-comes-from-what-it-was-built-from` in `packages/site/pages.test.ts`
collects every run of digits a reader can see on the method page and requires each to occur in the data
the page was built from. It keeps the *derivation* and not the coordinates: a figure that stops being
derived reddens, and a figure carrying no stamp does not.

That gap is declared rather than glossed. Nothing mechanical can ask whether a count in prose is a
count of what its sentence claims, which is why this record's mechanism is an order of preference a
writer applies and not a guard.

## What would reopen this

A figure that is genuinely stable — a constant of the language, a byte width — where a stamp would
suggest a measurement that could move. None exists here today: every count this repository publishes is
a count of its own growing catalogue.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — the same drift on an
  identifier, where the repair is a name rather than a stamp.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
