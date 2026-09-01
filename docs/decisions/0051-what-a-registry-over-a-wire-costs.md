---
status: accepted
date: 2026-08-15
governs:
  - packages/cli/fixpoint.ts
  - packages/cli/http-source.ts
  - packages/cli/source.ts
confirmed-by:
  - battery: cli-install
    guard: the-same-decision-against-a-warm-cache-and-no-network-is-the-same-plan
  - battery: cli-install
    guard: an-install-over-http-plans-exactly-what-the-same-registry-plans-in-process
  - battery: cli-install
    guard: the-walk-costs-one-round-trip-per-level-and-fetches-each-frontier-at-once
  - battery: cli-install
    guard: bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that
  - battery: cli-install
    guard: a-status-that-is-neither-the-answer-nor-a-404-is-an-error-and-not-an-absence
---

# What a registry over a wire costs the decision under it

## Context and Problem Statement

`command.ts` declares that everything this tool decides is reachable from a guard, with no process, no
working directory and no clock. A registry that answers over a network is the first thing that could
take that away, and it would take it away silently.

## Considered Options

- Two shapes: promises for a server, plain answers for the registries that need no network.
- One asynchronous port, and a second projection of it that the decisions read.

## Decision Outcome

**The port is asynchronous and all four implementations are, which is a decision about testing rather
than about transports.** Two shapes — promises for a server, plain answers for the three registries that
need no network — would have cost nothing to write and would have made `command.ts` branch on which kind
of registry it was handed. Almost every guard in `cli/` builds a local source, so almost every guard
would have exercised the path with no loop, and the fixpoint would have been exercised by HTTP alone.
**The day the catalogue moves out of this repository the local source goes with it, and the surviving
path would be the one least tested.** Two paths of which exactly one survives means the survivor is the
unproven one.

**`HeldRegistry` is the second projection of one declaration, and the compiler measured what it buys.**
It is derived from `RegistrySource` by a mapped type, so a method added to the port is in the view
without anybody writing it — the totality `THE_ENDPOINT_BEHIND`, `FIELD_MAP` and `EVERY_ARM` already
carry, and the shape `toHtml` and `toText` have one folder along. Measured by making the port
asynchronous and leaving the decisions reading it directly: **67 errors in `cli` and 44 in `packaging`**,
of which the product-side ones are 19 in `resolve.ts`, 6 in `search.ts` and 3 in `command.ts` — and
**every one of the 25 is an `await` that is missing**. Under the held projection all 25 are a type name
and not one body changes, which is the property under test rather than a hope about it. `install.ts`,
`reconcile.ts`, `remove.ts` and `update.ts` reported none at all, because they pass a source through and
never call it. `site/` declares its own port and was untouched.

**The `await` is in a loop around a decision, never inside one.** There is no list of what an
installation needs — `resolve.ts` walks the edges each snapshot carries and `plan.ts` deduplicates by
digest, so a prefetch that knew the list in advance would be a second statement of that walk, which is
what `packaging/freeze.ts` already refuses to write. The shape is *decide, note what was missing, fetch
all of it, decide again from nothing*. It terminates because a round writes every missing key into the
cache, **which is why a cache must tell *not asked* from *asked, and the registry holds no such thing*
apart**: collapsing the two makes a genuinely absent answer missing for ever.

**The acceptance criterion is not that an install works over HTTP.** It is that the same decision,
against the cache a networked run left warm, with no network and no process, produces byte for byte the
plan the networked run produced — **and that the second pass asked for nothing**, without which the
comparison is against the very answers it had just been given. Seen red by having the loop return an
empty cache: the offline pass asks for `contractIndex` and the two plans stop being comparable.

**Addressing by the question is the half that decides a supply chain, and the unsafe spelling does not
ship.** `localSource` and `packagedSource` look an answer up *by* its digest in a map keyed on that
digest, so the pairing of an answer with the address it was asked at is held by a data structure; on a
wire it is held by whatever the server chooses to send. Measured by writing the other spelling: with
`servedBlob(whatArrived)`, a registry answering one blob address with another file's bytes installs them
and **nothing objects** — `'faults' in outcome` is false. The maquette carried that as a parameter so
corruption could be watched going through; a parameter selecting it is a hole with a name on it, so C-68
is the cell instead and it has to come back killed.

## Consequences

**The loop made two ambient inputs visible that nothing had to notice while a decision ran once.** `at`
was read inside the decision, so it would be read again on every round and the decision would stop being
a function of its arguments; it is read once in `command.ts` now. And `freeze.ts` cannot record during
the loop — a miss is answered as an empty binding list, so a transcript of a partial cache would freeze
an artefact whose bindings are the misses of a first round, which is *the catalogue is empty because
nobody looked* arriving as a build product. It warms, then records one synchronous pass, and asserts that
pass asked for nothing. That makes it the first production consumer of the acceptance shape rather than a
port of an old one.

**Round trips are `4 + depth`, counted at the wire rather than by the client**, because a client counting
its own requests counts its intentions. Measured over two depths so the shape is not fitted to one point:
**four round trips and five requests** for a contract that depends on nothing, **six and eleven** for the
imagined graph at depth two, with rounds `[1, 1, 1, 2, 1, 5]` — two edges arriving together and five
files arriving together, which is what tells a batched frontier from a walked one. That is exactly what
`be085c4` published when the edge gained its digest, so the product agrees with the maquette rather than
replacing it.

**A guard of this unit was measuring something other than its own name, and the instrument is what
asked.** `cli-install`'s first replay reported one of the five new guards unaccounted for; reading it to
answer found that *a status that is neither the answer nor a 404* pointed the client at a dead port, so
`fetch` rejected before any status existed. Both halves are on one method now — a 404 answers `null`, a
500 throws. **The instrument asked a question about coverage and the answer was a defect in the
assertion.**

**What has no screen yet, declared rather than half-built.** A registry that is down arrives as a throw,
and `command.ts` turns three named errors into refusals a person can read. Nothing here constructs an
`httpSource` — both entry points name a local registry — so the path is unreachable in the product and a
sentence written for it now could be seen red by nothing. It closes with the entry point that first names
an origin, which is the change that makes the failure reachable.

**What the sweep found, and it is the deliverable rather than the two sentences that raised it.**
`command.ts` published round trips as `3 + 2·depth + 1`, eight at depth two — written at `dc6e9ca`
against a maquette, falsified by `be085c4` one commit later, and never revisited.
`local-source.ts` called itself the only implementation of the port, false since `packaged-source.ts` was
written. `remove-directory.ts` argued for staying synchronous because going asynchronous would reach
`command.ts`, which is asynchronous now — the half that carried the weight is that `rewrite.ts` is
reached from a decision the loop replays. And `census.ts` published `0 of 170` for this suite, whose
denominator moved the day this unit added a file; both its figures lost the populations they were
fractions of, because what that sentence is about is 28 and zero being one door read through two
configurations.

## Confirmation

The five guards are the acceptance criterion itself — the same plan against a warm cache with no
network, and against HTTP — plus the round-trip shape, the addressing that decides a supply chain, and
the status handling the instrument found a defect in.

## What would reopen this

An entry point that names an origin, which is the change that makes the unreachable failure path
reachable and the missing screen worth writing.

## More Information

- [ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) — the edges this port walks.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
