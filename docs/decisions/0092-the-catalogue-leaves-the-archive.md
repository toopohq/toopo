---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/published.ts
  - packages/cli/http-source.ts
  - packaging/build.ts
confirmed-by:
  - battery: packaging
    guard: nothing-the-archive-carries-is-produced-by-the-catalogue
  - battery: packaging
    guard: the-published-entry-point-names-one-origin-and-offers-no-way-to-change-it
  - battery: packaging
    guard: an-installed-toopo-runs-reads-a-project-and-writes-one
  - battery: packaging
    guard: the-archive-reaches-the-network-from-exactly-one-module
  - battery: cli-install
    guard: a-registry-that-does-not-answer-is-a-sentence-a-person-can-read
---

# The catalogue leaves the archive, and what stops being measured when it does

## Context and Problem Statement

The npm archive carried the whole catalogue. `dist/registry.json` held every contract the registry
serves — the index, the refusals, every binding, every implementation snapshot, and every
`reference.ts` base64 inside it — so an installed `toopo` needed nothing but the tarball.

Measured at `4a3bce5`, `npm pack --dry-run --json`:

```
packed      128 527 B
unpacked    413 368 B
registry.json  30 438 B unpacked, 12 652 B of the packed total
   of which  blobs 23 217 · index 2 969 · snapshots 2 077 · bindings 1 581 · refusals 520
```

Every one of those five parts is a function of how many contracts exist. Five index entries and four
installable contracts cost 30 438 bytes, which is about 6.1 kB each; at ten thousand contracts it is
roughly 61 MB of somebody's `node_modules`, and three quarters of it is source nobody asked for.

**That is the only property that matters here.** The size today is not the problem; the slope is.

## Considered Options

- Leave the catalogue in the archive and ship a `toopo` per catalogue.
- Ship the tool alone and have the published entry point ask the registry.
- Ship the tool alone, and give it a flag or an environment variable naming the registry.

## Decision Outcome

**The published entry point constructs `httpSource(THE_ORIGIN)`, and there is no override.**

`THE_ORIGIN` was already declared and reached by nothing executable. `published.ts` is now the only
module that names it, which is the shape the artefact already had: one file knows where the registry
is, and nothing under it can be handed a different one.

### The override was refused, and it is the one refusal here that costs something

Every package manager has a registry flag, because mirrors are a fact. This one does not, and the
reason is narrow: **everything a client receives is checked by arithmetic except which digest a name
resolves to.** The bytes hash to the address they were fetched by, a snapshot re-canonicalises to its
own digest, every edge below a root carries the digest of what it names. The single load-bearing
assertion is the binding — and an override is exactly the thing that would move it. Permanent rule 3
says installations are served only from the registry's immutable snapshot, and `source.ts` says a probe
would be a second source of truth.

It is also the reversible choice, which decided when rather than whether. An override added later is
additive; an override added now and removed later is a breaking change to a surface nobody has seen.
This unit is the last irreversible one, which is the wrong moment to invent a user-facing knob.

### What it cost, measured rather than estimated

At `7f68d31`, the same command:

```
                before        after      delta
packed          128 527      131 990    + 3 463   (+2.7 %)
unpacked        413 368      437 005    +23 637   (+5.7 %)
entries              37           38    +     1

arrives   endpoints.js 22 737 · needs.js 16 067 · http-source.js 10 983 · source.js 9 570  = 59 357
leaves    registry.json 30 438 · artefact.js 10 238 · packaged-source.js 2 203             = 42 879
```

The module swap is **+16 478**; the remaining **+7 159** is code the earlier steps of this unit added to
modules that were already there. **So the archive got bigger, by about 3.5 kB packed, and that is the
honest headline.** What it bought is that none of the 437 005 bytes is produced by the catalogue: a
sixth contract adds nothing, and a ten-thousandth adds nothing. The crossover against the old shape is
two or three more contracts.

### What `packaging/` stopped measuring, said where somebody will ask

**Three guards are gone**: `an-archive-installs-a-feature-whose-bytes-are-the-catalogues`,
`an-archive-installs-into-a-project-that-was-never-configured`, and
`the-lockfile-an-archive-writes-records-the-digest-the-registry-served`. They installed a real feature
out of a real tarball and compared the bytes on disk with the bytes in `contracts/`. They worked
because the catalogue was inside the archive; with `THE_ORIGIN` a constant and no override, there is no
way from a guard to point the installed binary at a registry the test process serves.

**This folder exists because three defects were invisible to every guard that measures the working
tree** — no archive at all, a `.ts` file node refuses to run under `node_modules`, and a runtime graph
that reached vitest. What still catches that class is that the installed CLI is *run*: it prints its
usage, writes a `toopo.json`, refuses a `list` in an empty project, and loads every module of the
tarball while doing it. What is no longer caught is anything that only shows up when a feature is
actually installed from an archive.

It is a **dated loss** rather than a decision about what is worth checking, and it closes on the first
deployment that answers on `https://toopo.dev`. It is on the open list in `CLAUDE.md` with that event
named, and in the header of `archive.test.ts` where somebody will ask why three guards disappeared.

### The refusal screen, which `source.ts` declared and refused to half-build

`http-source.ts` said the throw had no screen, that nothing constructed an `httpSource`, and that a
sentence written for a screen nobody could reach could not be seen red — *it closes with the entry
point that first names an origin*. This is that entry point.

`TheRegistryDidNotAnswer` is exported and `command.ts` catches it beside the other three refusals. A
failed `fetch` is caught too, and it is the common case: offline, behind a proxy, or at a host that
does not resolve, undici rejects rather than answering a status, so the first person to type
`toopo add` on a train would have met a stack trace where every other refusal of this tool is a
sentence.

**What it says is what the machine observed, and it stops there.** One sentence does not decide between
a registry that is down, a machine with no network, and something in between that refused — so the
screen says so and gives the reader the URL, which is the one thing here they can act on without us.
ADR-0042.

### The network guard inverted, and it is still permanent rule 3

`the-archive-reaches-no-network` was true while the snapshot travelled inside the archive. The snapshot
is at an origin now, so the archive reaches the network by design, and rule 3 is untouched: what it
forbids is being served from somewhere *else*. What replaces it is the narrower thing still true —
exactly one module opens a socket, and it is the one whose whole subject is the wire.

## Consequences

- `packages/cli/artefact.ts`, `packages/cli/packaged-source.ts`, `packaging/freeze.ts` and
  `packaging/freeze.test.ts` are deleted rather than left unreferenced. `packaging` goes from 16 guards
  to 8.
- `packaging/build.ts` compiles and prunes, and writes nothing beside the code.
- Half of [ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md) is superseded, on the trigger it
  named. It keeps the whitelist, the `typescript` dependency and the publication order.
- The order that record states is unchanged and now matters more: **the site answers 200 before the
  package is published, and never the other way round.** A published `toopo` that cannot reach its
  origin is a tool that does nothing at all, where before it was a tool that installed from what it
  carried.

## Confirmation

Five guards. One says nothing the archive carries is produced by the catalogue, read off the import
specifiers of every carried module rather than off their text — measured: a grep over the bytes matched
a *comment* in `address.js` and called it a module reaching the serialisation, which is the
lint-over-prose this repository refuses. One says the entry point names one origin and offers no way to
change it, asserting the absence of a knob as an absence: no `process.env` anywhere in the archive.
One runs the installed CLI three ways that need no socket. One says exactly one module reaches the
network. One is the refusal screen, which is in `packages/cli/` because that is where a registry that
does not answer can be produced on purpose.

**What no guard here establishes** is that an archive installs anything. That is the loss above, and it
is the reason this section names it twice.

## What would reopen this

- `https://toopo.dev` answering. It closes the dated loss, and it is the only thing that does.
- A mirror somebody other than this project runs, which is what an override would be for. It would need
  the binding to stop being the single believed step — a transparency log, or a signature policy a
  client checks — before a flag could be added without moving what nothing else keeps.

## More Information

- [ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md) — the archive this replaces half of.
- [ADR-0051](0051-what-a-registry-over-a-wire-costs.md) — the port `httpSource` implements, and the
  screen it declared and did not build.
- [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) — why the refusal
  says what it saw and not why.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why every figure above carries the
  commit it was measured at.
