---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/read-literal.ts
confirmed-by:
  - battery: site
    guard: every-arm-of-an-encoded-value-is-read-back-or-refused-by-name
  - battery: site
    guard: every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes
  - battery: site
    guard: a-case-printed-as-a-word-is-a-case-the-form-declines-to-open
---

# Totality by the compiler beats a pass over the data

## Context and Problem Statement

`read` inverts `literal`, and the obvious guard is the round trip over every case of block 4.4. That
guard is a pass over real data, and a pass over real data covers exactly what the data happens to
reach.

## Considered Options

- Round-trip every case the catalogue serves.
- A record keyed by the union of arms, so an arm added does not compile until a sample is written.

## Decision Outcome

**A pass over real data is accidental coverage; a total map over a union cannot fail to be complete.**
The instance that established it: `read` inverts `literal`, and the obvious guard was the round trip
over every case of block 4.4. Measured, that guard cannot exist in `site/` —
`packages/site/source.test.ts` refuses every module of the folder but one, tests included and its own comment says *every other module
of this folder*, the right to reach `the-catalogue` or `serialise`, so a guard there sees exactly what the
port serves. **157 of the 187 cases sit on contracts that have a page, and all 30 that print a word
with no JavaScript spelling sit on `array/group-by@1`, which has none.** One half of that partition
would have been empty by construction, which is the shape of a guard that quietly stops asking
anything.

What replaced it is stronger where it matters: `EVERY_ARM` is a record keyed by `EncodedValue['kind']`,
so an arm added to that union does not compile until a sample is written. Seen red by adding one — the
record *and* `literal`'s own switch both stop compiling, and a `killed-by-typecheck` is a death in
full. Real cases reach the arms they reach, nobody has ever checked which, and nothing reddens when one
is never touched.

## Consequences

The pass over the served cases stays, for what the table cannot say: that the literals this catalogue
actually publishes are among the ones that read back. And it carries the invariant a playground rests
on — *no case the registry serves is printed as a word with no spelling* — which reddens the day a
higher-order contract gains a page, which is the day somebody has to decide what its playground does
with a case whose input is a function. **A guard that fires at the right future moment is worth more
than one that covers the past.**

Both reds were seen, and which guard caught which is the argument for keeping the pair: a reader
answering `0` for `-0` reddens the arm table *and three real cases*, and a reader answering `undefined`
for `<hole>` reddens the arm table alone.

## Confirmation

The three guards are the pair this record is about plus the invariant that dates it: the arm table, the
pass over the served cases, and the one that fires on a future catalogue rather than on this one.

## What would reopen this

A higher-order contract gaining a page, which is what the third guard is waiting for. On that day the
pass over served cases stops being a subset of the arm table's population, and the two mechanisms have
something to say to each other.

## More Information

- [ADR-0054](0054-make-the-omission-impossible.md) — the same preference, one step earlier: before
  choosing between two mechanisms, look for the shape that needs none.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
