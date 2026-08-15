---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/published.ts
confirmed-by:
  - battery: site
    guard: every-figure-on-the-method-page-comes-from-what-it-was-built-from
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
Measured at `2b90f96`, over every tracked `.test.ts` and `.test-d.ts`: **514 call sites — 479 written
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
present tense, over the same quantity — and it went false at `277a637`, one commit later, when the
`cli` configuration went from 146 guards to 147 and the census total from 998 to **999**, measured at
`9bb3025`. The commit that falsified it is the one that added
`every-clean-refusal-resolves-to-the-guard-it-names` — so the sentence was broken by the very unit
that was closing this same class elsewhere in this file.

**A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
in one sentence, and it is the lie the reader believes, because it is the one written in the present.**
So: the clause carries the stamp, or it is stated at the commit, or it is not written. Nothing else is
available, and the middle one is what the paragraph above now does.

### The cheapest form is no number at all

**And the cheapest of the three is to need no number at all.** *Twenty-eight guards were left alone*
became *No guard was touched* in the profile-name section for exactly this reason: a state does not
drift where a tally does, and both sentences make the same claim. **When a sentence can be true without
counting, it does not count.** That is the rule to reach for first; the coordinates are what the
remaining counts get.

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
