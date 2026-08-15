---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: registry-storage
    guard: a-standing-cannot-be-set-on-something-unpublished
  - battery: registry-storage
    guard: a-standing-changes-and-the-digest-does-not
  - battery: registry-storage
    guard: every-standing-field-says-why-it-cannot-be-frozen
---

# A demoted implementation goes on being served

## Context and Problem Statement

Where an implementation stands in the registry. An implementation found wanting has to stop being the
one a new install receives, and the projects that already installed it have to go on working.

## Considered Options

- One retirement: remove the implementation.
- Two states: de-list it from the default position, and withdraw it.

## Decision Outcome

`demoted` is not `removed`, and the difference is permanent rule 6 applied one level down: a version
that was ever served goes on being served, so an implementation found wanting is de-listed from the
default position rather than withdrawn from under the projects that already installed it.

## Consequences

There is no state in this union that stops an artefact being fetched. That is the intended reading:
the standing decides what a *new* install receives and nothing else, which is why it sits outside the
digest — a standing that moved the digest would make every existing lockfile entry report a change
that never happened to any byte.

## Confirmation

`a-standing-changes-and-the-digest-does-not` establishes the separation directly;
`a-standing-cannot-be-set-on-something-unpublished` refuses the one combination that would make a
standing meaningless; and `every-standing-field-says-why-it-cannot-be-frozen` keeps the reason beside
each field rather than in this record alone.

## What would reopen this

A legal obligation to withdraw published bytes, which is the one thing permanent rule 6 does not get
to decide. What it would take is a state that is honest about being a withdrawal, not a
reinterpretation of `demoted`.

## More Information

- [ADR-0007](0007-four-lifecycle-states.md) — the same question about a contract rather than an
  implementation, where two retirements are also kept apart.
