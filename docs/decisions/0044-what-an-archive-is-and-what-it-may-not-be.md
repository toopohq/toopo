---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packaging/build.ts
confirmed-by:
  - battery: packaging
    guard: no-part-of-the-instrument-or-of-the-suite-is-in-the-archive
  - battery: packaging
    guard: every-file-in-the-archive-is-loaded-by-a-command
  - battery: packaging
    guard: the-installed-archive-carries-the-version-this-code-declares
---

# What an archive is, and what it may not be

> **Half of this record has been superseded by
> [ADR-0092](0092-the-catalogue-leaves-the-archive.md), on the trigger this one named.** *What would
> reopen this* said: a server, because `packaged-source.ts` and a future `httpSource` are two
> implementations of one port. The entry point now names an origin, so the frozen artefact, its source
> and the walk that built it are gone, and with them three of the six guards below. What is kept is
> what is still true and still ruled here: the compilation, the whitelist and its two mechanisms, the
> `typescript` dependency, and the order in which a site and a package may be published.

## Context and Problem Statement

**Every contract page ends in `toopo add <name>`, and until this unit nobody could run that line.**
Three things stopped them, independently, and all three were invisible to 999 guards — because every one
of those guards measures the working tree, and the working tree is not the product.

## Considered Options

- Publish the TypeScript sources and let node strip them at run time.
- Compile to JavaScript, and carry a frozen artefact of what an installation needs.

## Decision Outcome

`npm pack` refused: *Invalid package, must have name and version*. A published `.ts` file cannot run:
node refuses to strip types under `node_modules` — `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` on
v24.15.0, for a `bin` entry point exactly as for an import. And the CLI's runtime graph reached
**vitest**: `toopo search slugify`, a command that installs nothing, loaded 147 modules including
vitest, the TypeScript compiler API and twelve of `mutation/`, through
`the-five.ts` → a contract module → `packages/catalogue/every-contract.ts`. Cutting `local-source.ts` out drops
it from 55 repository modules to 26 and removes vitest entirely.

**The archive carries a frozen artefact, and that was forced rather than chosen.** `the-five.ts` must
go on importing live modules — its own header refuses a transcription — so it cannot be in a published
graph; `packages/cli/source.ts` already said serialising this repository *is not a source of distribution and
must never become one*. What decides it beyond both is the supply chain: a `toopo` that serialised
whatever it found in its own `node_modules` would recompute the digests it writes into somebody's
lockfile, so a corrupted byte would be hashed rather than caught. **Digests fixed when the archive was
built are checkable; digests recomputed from whatever is on disk certify themselves and prove
nothing.** Permanent rule 3 calls what an installation is served from *the registry's immutable
snapshot*, and the artefact is that snapshot for as long as there is no server.

**It is a transcript, not a second description.** `freeze.ts` runs `heldAt` and `gatherHoldings` —
the installer's own walk, imported — against a source that records every answer. So an edge the
installer learns to follow tomorrow is carried tomorrow with nothing in `packaging/` being edited, and
the one failure this shape cannot have is an artefact missing exactly the answer a real install needs.

**`packaged-source.ts` is the second implementation of the port, and the first that is not a
stand-in.** `source.ts` argued that the day a server exists it implements this same type and nothing
above it changes; that was one implementation and a claim, and it is now two implementations and a
comparison. `command.ts` takes its registry as a parameter, so **which registry served an installation
is a fact about which entry point was run** — never a probe, which would be the second source of truth
the port exists to prevent.

**The harness is not in the archive.** `local-source.ts` gathers every file of a contract's harness
because an auditor asks for all of them; no command of `cli/` ever asks, so the artefact carries the
four `reference.ts` blobs and nothing else. That is not permanent rule 5 weakening — the contracts stay
public in this repository and on every contract page. What would change it is a command that serves
somebody the harness of what they installed, and on that day the walk widens.

## Consequences

**`typescript` becomes a runtime dependency, and the cost is stated rather than discovered.**
`packages/cli/rewrite.ts` repoints an import by parsing it, and parsing TypeScript with anything but a
TypeScript parser is what `validation/` exists to refuse. Measured: none of the five reference
implementations imports anything, so today's catalogue never exercises the repointing — and making the
import lazy would hide a dependency that is required for correctness the moment a feature has one. A
user therefore installs a pinned `typescript@7.0.2` whose `unstable/*` surface is explicitly unstable.

**`private: true` stays.** Measured: `npm pack` works with it, so the archive is built and proven
without ever removing the thing that stops an accidental publication. The version is `0.0.0-local`,
the string `THE_UNPUBLISHED_VERSION` already carries, and a guard ties the two — so neither can be
quietly stamped `1.0.0` while the other says nothing was published.

**Two mechanisms over the whitelist, failing on opposite conditions.** `files` is a declaration, and
this repository has found eight things that behave like rules with nothing keeping them. *Nothing is
missing* is established by running the installed tool. *Nothing is extra* is established by loading:
every command runs under a recorder that writes down what node really loads, and every file in the
tarball must appear. The static walk `build.ts` prunes with is deliberately **not** the walk the guard
compares against — a walk wrong in either direction is caught rather than confirmed. It found six the
day it existed: `packages/cli/source.js`, `packages/registry/field-map.js` and four more, emitted because something is
*typed* against them, shipped because `files` said `dist`, loaded by nothing. 44 kB of 362 kB.

**And `build.ts` removes `dist/` before writing it**, because `tsc` does not clean and a source deleted
today leaves its JavaScript in the output. A stale module in an archive is the whitelist failing in the
one direction a whitelist cannot catch — **and the battery measured that the prune already catches it,
so the two are not independent.** A-13 removes the clean; a file no source produces is gone with it and
gone without it, because a stale module is one nothing imports and the prune drops whatever the entry
point cannot reach. The clean stays: it is one line, it makes the compiler write into an empty tree,
and the day the prune is the thing that is wrong it is what is left. What is not true is the sentence
that it catches something the prune does not, and the cell that says so is published as a survivor
rather than left in this paragraph.

**What is still not true, and no code here can make it true.** The archive works and nobody can obtain
it: nothing is published, `private: true` says so deliberately, and a reader who meets
`toopo add number/parse` on a contract page has no way to get `toopo`. The site does not claim
otherwise — it is silent — and silence in front of a command is the remaining gap. Closing it is a
publication decision, not a change to this repository.

**And that decision now has an order, which is the one thing about publication this repository can
record.** Every file the installer copies carries `https://toopo.dev/<contract>/` in its first line,
and that line is frozen in somebody else's repository from the moment it lands: a redirect repairs a
site's own link for everybody at once and repairs this one for nobody, because we will never see those
files again. Measured at `b79a364`, every path on that origin answers 403. **So the site answers 200
before the package is published, and never the other way round** — publishing first buys nothing that
waiting does not, and costs a dead link in every artefact written in between, permanently. The order is
free while nothing is published, which is exactly why it is written down now rather than met by luck
later.

**The first half of that order has been met.** Measured at `27d1dbb`, all 76 addresses the tree writes
answer at `https://toopo.dev`, and nothing is on npm; the order held, and it held because it was
written down while it was still free rather than recalled on the day it mattered.
[ADR-0103](0103-the-declared-origin-serves-this-catalogue.md) carries the sweep.

## Confirmation

**Three guards, where there were six, and the three that went are named rather than dropped quietly.**
`an-archive-installs-a-feature-whose-bytes-are-the-catalogues`,
`every-file-an-installation-needs-is-served-as-the-bytes-it-was-frozen-from` and
`two-freezes-of-one-working-tree-are-one-byte-string` were about a frozen artefact, and there is none.
[ADR-0092](0092-the-catalogue-leaves-the-archive.md) carries what replaced them and what it does not
replace.

What is left is three of the things an archive can still get wrong: something of the instrument is in
it, something in it is loaded by nothing, and the version reads as published.

## What would reopen this

**It was reopened, on this trigger, and this is what that looks like from inside a record.** The
trigger read *a server, which is what the artefact stands in for* — and it fired at the entry point
naming an origin rather than at a server existing, which is one step earlier than it was aimed. That is
the trigger being useful anyway: it named the right event class, and the event that came was a member
of it.

What would reopen the half that is left: `files` becoming something other than `["dist"]`, which is the
one declaration both whitelist mechanisms are about; or a runtime dependency beyond `typescript`, which
is priced in the consequences above and has never been paid twice.

## More Information

- [ADR-0092](0092-the-catalogue-leaves-the-archive.md) — what the archive stopped carrying, and what
  `packaging/` stopped measuring.
- [ADR-0045](0045-what-a-battery-over-the-archive-can-reach.md) — what a battery over this can and
  cannot measure.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
