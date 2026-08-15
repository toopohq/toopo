---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: cli-update
    guard: the-lockfile-holds-what-was-served-and-what-was-written
  - battery: cli-update
    guard: a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk
---

# An installed file carries two digests

## Context and Problem Statement

One file of an installed feature, as `toopo.lock` records it. This type used to be `HarnessFile`, on
the reading that what was written is what was served.

## Considered Options

- One digest: the file as served, on the reading that it is also the file as written.
- Two digests: what the registry served, and what landed on disk.

## Decision Outcome

**Two digests and not one, and that is a finding of the unit that wrote the installer rather than a
field somebody wanted.** This type used to be `HarnessFile`, on the reading that what was written is
what was served. It is not: a file whose import had to be pointed at a shared copy is written with
different bytes from the ones the registry served, so a lockfile holding only the served digest would
report every rewritten file as locally modified from the instant it was written — which is the failure
`canonical.ts` closes for line endings, arriving through a door the installer itself opens.

`served` is the registry's fact, carried whole: the file as an implementation record addresses it,
under the name it has inside the contract folder. It is what a comparison with the registry is made
against. `path` is where it went, relative to the configured folder, and it differs from `served.path`
whenever the installer renamed or relocated the file. `sha256` and `bytes` describe what is on disk,
and they are what the offline check — the one whose whole value is that it needs nothing from us —
compares against.

## Consequences

The two digests answer two different questions, and collapsing them would answer neither: *has the
registry changed this file* is asked of `served`, and *have you changed this file* is asked of
`sha256`. This is one of the findings `CLAUDE.md` lists under a schema defect never being found by
reading the schema — `toopo add` found it.

## Confirmation

`the-lockfile-holds-what-was-served-and-what-was-written` establishes that both are recorded;
`a-kept-file-keeps-the-digest-we-wrote-and-not-the-one-on-disk` establishes that the two do not
collapse into each other on the path where they legitimately differ.

## What would reopen this

An installer that never rewrote an import, which would make the two digests equal by construction —
and would mean the shared-file case had been solved some other way.

## More Information

- [ADR-0064](0064-the-hash-is-what-makes-never-update-silently-checkable.md) — the served digest, and
  what it is for.
- [ADR-0037](0037-what-the-lockfile-does-not-describe.md) — what this file does not claim to record.
