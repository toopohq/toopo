---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/replay.ts
  - mutation/tally.ts
  - mutation/published.ts
confirmed-by:
  - battery: meta
    guard: every-battery-of-this-folder-is-published
---

# A replay is one command, and its figures carry their spread

## Context and Problem Statement

The method page hands `npm run mutation` to a stranger as *the* thing that turns an assertion into
something they have watched happen. It ran `measure.ts` with no argument and exited on
`usage: measure.ts <battery>`.

## Considered Options

- Document the loop each of us was writing by hand.
- Commit the loop as the command the page names.

## Decision Outcome

**A published name belongs to a committed thing, and `npm run mutation` was not one.** The method page
hands that command to a stranger as *the* thing that turns an assertion into something they have
watched happen — and it ran `measure.ts` with no argument and exited on `usage: measure.ts <battery>`.
Replaying everything was a loop each of us wrote by hand and nobody committed, which is the defect
underneath the broken command: **two definitions of *a replay*, either free to drift, and nothing that
would have said so.** That is also why it stayed invisible — everybody had their own. `mutation/replay.ts`
is now the command, and it composes the two entry points a reader could type rather than implementing a
third: `measure.ts` once per battery, then `tally.ts`. The by-name usage moved to `npm run battery`,
because that is the narrower question and it is asked by somebody already inside the work. **The two
lists of the batteries check each other**: the replay runs `THE_BATTERIES`, the total requires
`mutation/*.battery.ts`, so a battery written and left off the list writes no result and the total
refuses.

**The repository-wide figure has a derivation, and that closes the second half of this.** The replay
ends by running the total itself, because the artefacts it has just written are newer than the commit
they describe and a reader is owed one command and one answer. `npm run tally` keeps the half that is
not a measurement — printing that total again without re-running anything, and refusing a set that is
not one replay of the commit it would describe. **That refusal is only reachable from the second
command**, by construction, since a replay's results are always fresh by the time it counts them.
Measured at `57958fd`, one run of the nineteen took
**27 min 8 s** and gave **612 defect cells, 576 killed, 36 surviving, beside 26 probe cells of which 4
survive**, every cell agreeing with the verdict pinned for it; the largest single battery was
`cli-install` at 367 s. **A duration is published beside its
spread**, because a stamp stops a figure being stale and does not stop it being read as a period — and
**that reading was the first under a changed regime**, which the spread has to name rather than merely
signal: a cell of a contract battery now collects its own contract's suite instead of all five. Under
the whole-suite regime the same 612 cells ran at 31 min 25 s, the 610 before them at 29 min 13 s, the
606 before those from 28 min 19 s to 35 min 10 s, the 605 before those from 29 min 22 s to 37 min 0 s,
and the 592 before those from 25 min 8 s to 28 min 59 s — so a single number to ten seconds is a
precision the measurement has not got. **The count is what has always told these populations apart, and
here it did not move**: 612 either way, so nothing but the clause could have said that comparing the two
series is wrong. The old readings stay, labelled, because they are what makes the change visible. **And that regime now
carries a reading that needs no population at all, which is what every count of readings here was
standing in for.** Measured at `06e264b`: **618 cells in 27 min 22 s**, and the same 618 cells in
28 min 42 s on the run before it — identical work, on one machine, eighty seconds apart. Every earlier
reading compared populations and could always be answered with *the cells moved*; this one cannot,
because nothing moved. The cross-population readings agree with it and no longer have to carry the
claim alone: 615 in 27 min 34 s, 614 in 34 min 6 s, 612 in 27 min 8 s, so the smallest population is
the fastest run and the second smallest is the slowest by seven minutes. **The tally of readings is
gone from this sentence rather than incremented** — it read *three readings now*, a fourth was taken,
and this paragraph had already caught itself doing exactly that one sentence earlier. **The count in
that sentence was dropped rather than incremented**: it read *one of three
runs*, a fourth was taken and a tally that has to be edited on every replay is one that will be wrong
between two of them. The range only ever widens and needs no counting — which is why the runs of each
population are no longer counted at all, only bounded. **No share of that step is
attributed to anything, and this repository published an attribution once before withdrawing it**: six
minutes were once credited to `cli-install` gaining thirteen cells, and that same battery has since run
anywhere from 364 s to 459 s on identical work. **A quarter of its own duration between runs of
identical work is a machine too variable to support the account**, so the account went rather than being
qualified — and the list of its individual runs went with it, on the rule the sentence above states: a
range widens, a list of readings is a tally somebody has to edit.
`THE_REPLAY` carries both and the page renders both. The two populations
are printed together because they
collided once: *556 cells, 34 surviving* was published here while the artefacts behind it held *582 and
38*, and both were true — 556 is the defects, 582 is every cell including the probes. Each figure was
held by somebody who did not know the other population was there, and **no committed code produced
either**.

## Consequences

**The cost of the refusal is stated rather than discovered: committing anything after a replay makes
the tally refuse**, because the boundary is `HEAD`'s own timestamp and a docs commit moves it. The way
back is to replay. It is the conservative direction on purpose — the alternative is a definition of
which commits could have changed what a battery measures, which is a second statement that can be
wrong.

## Confirmation

`every-battery-of-this-folder-is-published` is the half that keeps the two lists honest: a battery
written and left off `THE_BATTERIES` writes no result, and the total refuses a set that is not one
replay of the commit it would describe.

## What would reopen this

A replay short enough to run on every commit, which would make the tally's timestamp boundary a cost
nobody notices rather than one that has to be stated.

## More Information

- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — the rule every figure above obeys.
- [ADR-0057](0057-what-one-cell-of-a-battery-collects.md) — the regime change the spread names.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
