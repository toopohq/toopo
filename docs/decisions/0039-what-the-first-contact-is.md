---
status: accepted
date: 2026-08-15
governs:
  - packages/cli/install.ts
  - packages/cli/configuration.ts
  - packages/cli/write.ts
confirmed-by:
  - battery: cli-install
    guard: a-project-with-nothing-in-it-is-configured-rather-than-refused
  - battery: cli-install
    guard: add-with-no-configuration-writes-one-and-says-so
  - battery: cli-install
    guard: add-with-a-lockfile-and-no-configuration-writes-nothing
  - battery: cli-install
    guard: an-init-says-what-has-to-be-committed
---

# What the first contact is, and the one project it refuses

## Context and Problem Statement

Every contract page ends in `toopo add <name>`, and that line answered *run `toopo init` first*. The
first thing anybody types was a refusal, and it refused for nothing: the only thing an install needs to
know is a folder.

## Considered Options

- Keep `init` in front, so that the configuration is always deliberate.
- Configure on the first `add`, and say so.

## Decision Outcome

**`toopo add` no longer needs `toopo init`, and what that friction was covering by accident is now
covered on purpose.** `add` read `toopo.json` and stopped when there was none, so the first line
anybody types — the line every contract page ends in — answered *run `toopo init` first*. It stopped
somebody for nothing: the only thing an install needs to know is a folder, `proposeDirectory` already
deduces one, and nothing was at stake in asking. A project with nothing in it is now configured,
installed, and told about it.

**The report says a file appeared, and that is not politeness.** `toopo.json` is committed by the user,
so a run that writes one puts a file in front of their whole team. Unannounced it is a bad surprise;
announced it is a convenience, and the line names the folder so that changing it is one edit and one
re-run. `init` keeps every reason it had for whoever wants to choose in advance — what it loses is the
right to stand in front of the first command anybody types.

**Removing the friction revealed what it had been covering, which is the argument for removing
frictions rather than against.** `toopo.lock` records each file's path relative to the configured
directory and **never the directory itself** — `list.ts` and `write.ts` both join the two — so a project
holding installed features with no `toopo.json` is one where the folder is recoverable from nothing on
disk. Proposing one would install *beside* those files rather than over them, leaving two copies and a
lockfile describing one. That is the one project `add` still refuses, and the refusal names
`toopo init --dir` and says why only the user can answer it: **a refusal that explains is a door, one
that reports is a wall.**

**The configuration goes through the two-phase write rather than beside it**, renamed before the
lockfile — a lockfile with no configuration beside it is precisely the state the refusal above exists
for, so it must never be what a killed run leaves behind. `Commit` carries the field **required** rather
than optional, because a caller that could forget it is a caller that will, which is the sentence that
field's neighbour already carries. The cost is fourteen call sites stating `configuration: null`, which
is totality being paid for exactly as `FIELDS_OF` already pays for it.

## Consequences

**A guard was written for this and deleted, and the deletion is the finding.** It asserted that a
refused commit leaves no `toopo.json`, and measured, it could not fail: every fault `commit` raises is
raised while staging the *files*, and the block that writes the root files sits behind
`faults.length === 0`, so a refused commit never reaches that field at all. The property is structural
rather than kept, and `write.ts` records where the claim is really held —
`add-with-a-lockfile-and-no-configuration-writes-nothing`, where a refusal can arrive after something
was decided.

**The state a stranger arrives in was the one state `packaging/` could not reach.** Every guard there
shares one installed project and the first of them runs `toopo init --dir`, so *a project that was
never configured* was unreachable once any other had run. `intoAFreshProject` installs the same tarball
into a second empty project — the bytes are reused, so what is measured a second time is an install
into an empty folder rather than npm's determinism.

**And the three guards this left unprobed were probed rather than declared out of reach.**
`cli-install`'s first run after the unit reported them *unaccounted for*, and the two answers the
instrument offers — out of reach, or a debt — both fitted badly: what those guards keep is which
configuration an **install** runs under, and that is the battery about installing. Declaring a region
would have been the data arranged to suit the tool. C-48, C-49 and C-50 exist because the instrument
asked for them, and two of the three produce a load-bearing guard.

### What the two-phase write closed

**Closed by the two-phase write, which is where they said they would close.** `packages/cli/write.ts` stages every
file beside its destination and renames, so the three situations the installer left throwing whatever
the operating system threw are refusals with a sentence. A folder that cannot be written to fails during
staging, where nothing has been committed — not a pre-flight writability check contradicted afterwards
by the write, which is the shape this repository refuses, but the write itself taken in a phase whose
whole property is that abandoning it costs nothing. A directory where a file must go is asked about by
*kind* before staging, because renaming onto one is `EPERM` on Windows and says nothing a caller can
act on. And a process killed between the first file and the lockfile resolves backwards, because a file
is renamed or it is not and the lockfile is renamed last — `already-written` finishes the job on the
next run, without a journal.

**What the guard for the first one measures is a file sitting where one of our folders must go**, and
that is said rather than glossed: a permission denial is the same catch on the same line, and is not
something a guard can arrange on every platform this runs on. Claiming it was measured would be claiming
more than was.

**Two remain, and both are declared rather than closed.** A rename that fails after staging succeeded —
a file held open by another process on Windows — throws, and closing it would mean every rename being
reversible, which is a journal. And node's own TypeScript runtime meeting a feature of more than one
file, which [ADR-0033](0033-one-import-spelling-and-it-is-not-the-users-to-choose.md) measures and
which is not ours to close.

## Confirmation

The three `add` guards are the three states a project can be in — nothing at all, a configuration
already there, and the one refused state — and the fourth holds what `init` says about committing.

## What would reopen this

A second setting that an install genuinely needs and cannot deduce. The argument rests on there being
exactly one thing to know, and `toopo.json` carrying two fields of which one is a format version.

## More Information

- [ADR-0040](0040-what-git-is-asked.md) — the sentence printed beside the folder this writes.
- [ADR-0041](0041-what-a-folder-change-moves.md) — the hole this opened one floor down, and its repair.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
