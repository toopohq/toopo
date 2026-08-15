---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/arguments.ts
confirmed-by:
  - battery: cli-update
    guard: update-writes-only-when-it-is-asked-to
  - battery: cli-remove
    guard: remove-writes-only-when-it-is-asked-to
  - battery: cli-remove
    guard: a-removal-shows-and-writes-nothing-until-it-is-applied
---

# Which commands ask twice

## Context and Problem Statement

Half this CLI writes into somebody's repository and half only reads. An unsaid convention about which
half asks first is one the next person breaks by trying to help — most obviously by adding a
`--dry-run` to the commands that do not have one.

## Considered Options

- Every writing command takes `--dry-run`, and writes by default.
- Every command that can destroy shows first and writes on a second word.

## Decision Outcome

**A command that can destroy or overwrite shows first and writes on a second word. A command that can
only refuse writes at once.** `update` and `remove` may replace or delete somebody's file; `add` never
touches a file it did not put there, so asking twice would buy nothing and cost a word.

It is written down — `THE_WRITE_DISCIPLINE` in `packages/cli/arguments.ts` — because the CLI was applying it
without saying it, and an unsaid convention is one the next person breaks by trying to help. A
`toopo add --dry-run` reads as symmetry and would put the opposite default on the opposite half of one
tool, so that half the commands write unless told not to and half refuse unless told to. Nobody would
choose that deliberately, which is exactly why it has to be refusable by pointing at a sentence.

## Consequences

`toopo init --dir` writes at once and gains the argument rather than an exception, which is
[ADR-0041](0041-what-a-folder-change-moves.md): somebody who types a folder is asking for their files to
be in that folder, so moving them is obeying rather than destroying, and a second word would ask whether
they meant what they had just typed.

## Confirmation

`update-writes-only-when-it-is-asked-to` and `remove-writes-only-when-it-is-asked-to` are the two halves
of the rule as behaviour; `a-removal-shows-and-writes-nothing-until-it-is-applied` is the showing half,
which is the one a mutant can satisfy by writing nothing at all — so it is asserted over what the screen
says as well as over what the disk holds.

## What would reopen this

A destructive command whose showing half is useless — one where what would be written cannot be
described before it is decided. Nothing here is in that position: every plan is computed before a byte
moves, which is the property `command.ts` exists to keep.

## More Information

- [ADR-0034](0034-what-an-update-is-and-what-it-will-not-do.md) — the command this discipline was
  extracted from.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
