---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/lockfile.ts
  - packages/cli/remove.ts
confirmed-by:
  - battery: cli-remove
    guard: a-removal-that-cannot-reach-the-registry-refuses-and-explains
  - battery: cli-remove
    guard: taking-out-the-last-root-asks-the-registry-nothing
  - battery: cli-install
    guard: the-lockfile-holds-what-was-served-and-what-was-written
---

# What the lockfile does not describe

## Context and Problem Statement

Two claims about `toopo.lock` sound alike and only one is true, and the difference decides whether a
removal can be computed offline.

## Considered Options

- Record the installed graph in the lockfile, so a removal needs nothing from the registry.
- Record only what was written, and rebuild the plan from the registry every time.

## Decision Outcome

**True: it lets anybody check, with nothing from us, that the bytes on disk are the bytes that were
served.** That is the supply-chain argument of the whole project and it holds entirely.

**False: that it describes the installed graph.** It records what was *written*, never what was
planned. A shared file is written once and the other carrier is repointed at it, so the second
carrier's entry does not name the file it imports — measured on the fixture graph, `number/clamp@1`
records one file and `number/clamp/clamp.ts` imports `../../string/pad/digits.js`. A removal decided
from the lockfile alone would delete `string/pad/digits.ts` while three files that stay import it: not
an incomplete answer, a wrong and silent one.

**And no field would fix it.** Recording the edges closes that instance and not the class:
deduplication is a property of the *plan*, a blob is recognised by its digest and never by a path, and
two roots that depend on nothing can still share a file. The only sufficient record is the plan itself,
which is a cache of something the registry recomputes — a second source of truth that can contradict
the first. So the plan is rebuilt every time, and **that is why a removal needs a registry**.

## Consequences

**The limit, bounded.** Measured over every non-empty root set on the catalogue and on the fixture
graph, 8 of 64 removals reach the registry not at all, and they are exactly the ones that leave no root
behind. A published version is served for life, so *the contract went away* is not a case that exists;
only a registry that cannot answer right now. The refusal explains rather than reports — *this needs to
know what the features that stay import, and only the registry knows* — and it degrades without
destroying: the files stay, nothing breaks, and the same command works when the registry answers.

## Confirmation

`a-removal-that-cannot-reach-the-registry-refuses-and-explains` holds the refusal and the sentence that
makes it a door; `taking-out-the-last-root-asks-the-registry-nothing` holds the 8 of 64 that need no
registry at all, which is the half that would otherwise be a claim in prose.
`the-lockfile-holds-what-was-served-and-what-was-written` holds the part that *is* true — the two
digests — because the record's whole argument is that this file supports one claim and not the other.

## What would reopen this

A registry that can be relied upon offline — a local mirror, or an artefact of the kind `packaging/`
already builds. That does not change what the lockfile describes; it changes what *needing a registry*
costs, which is the only thing this decision is uncomfortable about.

## More Information

- [ADR-0038](0038-what-a-removal-is.md) — the command this limit is about.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
