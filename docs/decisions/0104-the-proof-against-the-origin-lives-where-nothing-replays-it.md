---
status: accepted
date: 2026-08-17
decision-makers: Mathis Perron
governs:
  - packaging/against-the-origin/vitest.config.ts
  - mutation/decisions.ts
  - .github/workflows/suites.yml
confirmed-by:
  - battery: origin
    guard: the-origin-answers-and-serves-this-catalogue
  - battery: origin
    guard: an-archive-installs-a-feature-into-a-project-that-was-never-configured
  - battery: origin
    guard: the-bytes-installed-are-the-bytes-the-digest-names
  - battery: origin
    guard: the-lockfile-an-archive-writes-records-the-digest-the-registry-served
---

# The proof against the origin lives where nothing replays it, and says which of two reds it is

## Context and Problem Statement

[ADR-0092](0092-the-catalogue-leaves-the-archive.md) took the catalogue out of the npm archive and
recorded, as a dated loss rather than as a decision about what is worth checking, that three guards
left `packaging/` with it. They installed a real feature out of a real tarball and compared the bytes
on disk with the bytes in `contracts/`. The entry named the event that would end the loss: **the first
deployment answering on `https://toopo.dev`**.

That deployment exists. Measured at `22083a5`, by packing, installing into an empty project and
running the installed binary against the declared origin:

```
pack 1 028 ms · install 1 346 ms · add 1 101 ms
tarball  133 318 B packed / 440 870 B unpacked

4 requests, 8 237 B
  200   3 025 B  /contract-index
  200     396 B  /typescript/number/parse@1/implementation-bindings
  200     517 B  /snapshot/d448f1dd…
  200   4 299 B  /blob/d1a5f60e…

toopo.lock: served.sha256 = sha256 = d1a5f60e… · bytes 4 299 · servedFrom 22083a53cf…
```

So the proof is available rather than hypothetical, and what this unit decides is not whether to take
it but **where a guard that depends on a live host may live, and what it must say when it is red.**

The difficulty is one this repository has already priced once. The nineteen batteries are deliberately
not run in continuous integration, on the argument that a red nobody can act on is a red people learn
to ignore. A guard over a network is exactly that shape — an outage reddens it with no defect anywhere.
And the opposite is worse: a green that declares itself unmeasurable is the green that lies, which is
the class this repository spent the previous week removing.

## Considered Options

- A guard in `packaging/archive.test.ts`, collected by `packaging/vitest.config.ts` with the seven
  suites.
- A suite of its own under `packaging/`, with its own configuration, its own script and its own step.
- A suite of its own, run by a person before publishing and never by continuous integration.

## Decision Outcome

Chosen: **a suite of its own at `packaging/against-the-origin/`, with its own configuration and its own
script `npm run origin`, run as the last step of the `site` job — after the deployment, and gating
nothing.**

### What decides it is the instrument, and it is measured rather than argued

`mutation/packaging.battery.ts` declares `vitestConfig: 'packaging/vitest.config.ts'`, six mutants and
one lens, so **that suite runs at least seven times per replay of that battery**. A guard reaching a
live host under that configuration puts the instrument behind an origin being up: calibration refuses a
red control, and a battery interrupted part-way leaves an injected mutant in the working tree. That is
the red nobody can act on, arriving in the most expensive place this repository has.

`packaging/vitest.config.ts` needs no exclusion to stay clear of the new folder. Its `include` is
`*.test.ts`, a single star does not descend, and the new suite sits one folder down — the shape
`mutation/fixture/` already has, for the same reason.

**The seventh suite's counts do not move.** `packaging/archive.test.ts` still collects 8, no entry of
`mutation/census.ts` changes, and no battery is touched. The new suite collects **4**, and it is
deliberately absent from `CENSUS`: that table is read only by `censusFor`, for the configuration a
battery names, and an entry nothing reads would be dead.

### Why it is a step of the `site` job and not a job or an eighth suite

An eighth step of the `suites` job would put it in front of `needs: suites`, so an origin that is down
would **stop the deployment of the fix for it**. A job of its own buys a clean signal and costs a second
checkout and a second installation, on a private repository where the minutes are metered.

The `site` job already holds both, and the placement is worth more than the saving: running after
`deploy` measures what this commit has just published rather than what the previous one did. It carries
no `if`, so on a branch — where `deploy` is skipped — it measures that branch's own archive against the
published registry, which is the more useful of the two questions.

**A deployment returns before it has propagated.** The revision answering may still be the previous one,
which is a valid proof of the chain and not of this commit. The suite therefore *reports* the revision
it measured against, in the log of a green run and not only of a red one, and never asserts it.

### How a red says which of the two it is

The origin is asked before anything is packed, and **asked again if the chain fails**. The second
question is what makes the classification a measurement taken at the moment of failure rather than a
guess taken before it — an origin that answered and then went away is told from one that was there
throughout. Both arms are red. The first line differs:

```
THE ORIGIN DID NOT ANSWER - nothing about the product is established by this run.
THE ORIGIN ANSWERED AND THE CHAIN FAILED - this is the product.
```

Anything that is not `200` on the index is the first arm, including a 5xx: no defect of the client can
produce it.

**The case this does not separate, declared rather than left to look covered.** An origin that answers
and serves a wrong body — a truncated blob, a corrupted index — arrives as a failure with the origin
reachable on both sides, and is classed as the product. That is right about the action, since the
deployment is ours, and wrong about the place: the repair would be in the emission.

### Nothing throws out of a hook, and that is a finding applied before it bit

`beforeAll` captures what happened and never rethrows. A hook that throws makes a file unstartable and
its guards are reported *skipped*, which `assertWholeSuiteRan` cannot tell from guards that passed
because it compares a total against a total — measured at `c21865e` on this repository, and open in
`CLAUDE.md`. A network-dependent hook is the most likely thing in this repository ever to throw, so the
open entry is a constraint on this file's construction rather than a remark about another's.

### The address needed a coordinate, and the design is what removed it

A guard is addressed by the pair `(suite, guard)`, and `THE_SUITES` is the batteries plus `meta`. The
whole point of the decision above is that no battery replays this suite, so its four guards had no
first coordinate at all. `origin` is added beside `meta`, which is the same correction on a second
folder: a coordinate completed when a real guard turned out to be uncitable.
[ADR-0001](0001-record-decisions-in-madr-format.md) carries what the three kinds are worth, and these
four are of the weaker kind — guards that run, with nothing measuring what they catch.

### What comes back, and the third that does not

| lost guard | here |
| --- | --- |
| `an-archive-installs-into-a-project-that-was-never-configured` | back, whole |
| `the-lockfile-an-archive-writes-records-the-digest-the-registry-served` | back, and stronger: the digest crossed a wire |
| `an-archive-installs-a-feature-whose-bytes-are-the-catalogues` | **not replaced** |

The third compared the installed bytes against `contracts/` on disk. The origin serves the last
*deployed* commit, which is not this working tree during any unit that touches a contract, so that
comparison would be red with nothing wrong. What stands in its place is the arithmetic half: the bytes
are compared against the digest the registry announces, read here by asking the registry independently
of the client that installed them — because comparing the disk against the lockfile's own
`served.sha256` would check the client against itself.

**Two limits of what four guards over one install can say, both measured rather than assumed.**

Every published implementation of this catalogue is depth 0 with one file and no edges — measured over
the four bindings the origin serves; `array/group-by@1` has none. So the chain is proved at depth 0, and
repointing, sharing and the dependency walk stay where they already are, in `packages/cli/` against a
tree this process serves.

`servedFrom` is asserted in shape and reported by value. Resolving it against this clone's graph would
be red whenever the clone is behind the deployment, which is an ordinary state; what it leaves open —
an invented revision passes — is on the open list with the resolution that would close it.

## Consequences

- The seven suites become the seven suites and one proof against the origin. `CLAUDE.md` and the
  workflow header say so. Measured at `e40a9a0`, in the order the workflow runs them: **472, 65, 351,
  27, 187, 111, 8**, and **4** against the origin. Only the last is new — no count above it moved, which
  is the whole of what keeping this suite out of `packaging/vitest.config.ts` was for.
- **Cost, measured on this machine at `22083a5`:** ~3.5 s of work and **5 requests, ~11.3 kB** to the
  origin per run — the probe, the two that read what is announced, and the four the install makes; six
  requests when it fails and re-probes. In continuous integration it is one step in a job that already
  exists, so no checkout and no installation are added. The 23-minute replay does not move, which is
  the whole of what the placement bought.
- The instrument reaches no host that is not this machine, exactly as before.
- Nothing is published by this unit. `private: true` and `0.0.0-local` are unchanged.

## Confirmation

Four guards, in a suite addressed as `origin`. One says the origin answers and that the index it serves
is this catalogue. One installs a feature into a project holding nothing but a `package.json`, with
`toopo init` never run — the state no other guard here can reach, because every one of them starts from
a registry the test process serves. One recomputes the digest of every file that landed and compares it
against what the registry announced. One reads the lockfile back: the implementation, the served digest
per file, the shape of the revision, and the on-disk digest the lockfile claims.

Each was seen red on its real condition before this record was written, and the two reds were compared
side by side rather than described: one produced by breaking the client, one by pointing `THE_ORIGIN`
at a host that cannot resolve.

**What no guard here establishes** is that the announced digest names the catalogue's own bytes. That is
the registry's single believed step, and closing it means rebuilding `contracts/` at the commit
`servedFrom` declares — the shape `packages/registry/rebuild.ts` already has for a binding.

## What would reopen this

- A published implementation with a dependency, which would make the depth-0 limit above worth removing
  and would give this suite a repointed file to compare.
- A second origin — a mirror, or a staging deployment — which would make `THE_ORIGIN` a parameter here
  and reopen the override [ADR-0092](0092-the-catalogue-leaves-the-archive.md) refused.
- Continuous integration minutes stopping being metered, which is half of why this is a step rather
  than a job.
- An outage frequent enough that the step is read as noise. The classification is what is supposed to
  prevent that, and if it does not, the placement is what changes — not the proof.

## More Information

- [ADR-0092](0092-the-catalogue-leaves-the-archive.md) — the loss this closes, and the event it named.
- [ADR-0097](0097-the-deployment-is-configured-in-this-repository.md) — the deployment this measures.
- [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) — why a probe says
  what it saw and never why.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why every figure above carries the
  commit it was measured at.
