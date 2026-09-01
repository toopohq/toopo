---
status: accepted
date: 2026-08-15
governs:
  - packages/registry/emit.ts
  - packages/registry/endpoints.ts
  - packages/registry/local-read-api.ts
confirmed-by:
  - battery: site
    guard: the-tree-carries-pages-modules-crawler-files-and-answers
  - battery: site
    guard: no-path-is-both-a-file-and-a-directory
  - battery: registry-storage
    guard: a-page-and-the-answers-about-that-contract-share-one-address
  - battery: cli-install
    guard: add-decides-the-same-thing-against-the-emitted-tree
---

# What an emitted tree is, and the collision that decided its addresses

## Context and Problem Statement

A remote source existed and nothing served it, so the guards raised a server in their own process out of
the local catalogue. What a static host can serve is a tree of files, and the question is which files —
and at which paths.

## Considered Options

- Walk the catalogue and write two files per contract.
- Walk the *questions* a client can ask, and follow what each answer names.

## Decision Outcome

**The totality is a walk of the questions and not of the catalogue.** The obvious emission goes through
the contracts and writes two files each; that produces a tree nobody can prove anything about, because a
walk of the catalogue is a list of what somebody remembered — and **an answer a client can ask for that
the emission did not write is a 404 at the moment somebody installs something, in somebody else's
project**. So the closure starts from the three questions a client can ask having read nothing and
follows what each answer *names*: an index names contract addresses, a binding names a digest, a contract
snapshot names the digests of its harness, an implementation snapshot names its own files and the edges
it depends on. `WHAT_AN_ANSWER_NAMES` is keyed by `keyof ReadApi`, so a method added to the port does not
compile until somebody has said what its answer lets a reader ask next.

**And the property that needs no list at all: the tree is closed.** Every address a served answer names
is an address it serves — read back out of the bytes with a regular expression, and never by asking the
record the walk is built on. A closure that asked itself what it names is green for exactly the arm
nobody wrote, which is `GUARD_PERTURBATION_RULE` arriving on a closure. Seen red by stopping the snapshot
arm naming the files it freezes: 32 addresses served nowhere and 28 harness files missing.

**A digest is a whole JSON value and never a substring**, which that guard was measured into rather than
designed with: `string/levenshtein@1` carries a benchmark sample of a hundred and twenty alternating
letters, and `abab…` for sixty-four characters is a digest to any reader that matches inside strings. The
one digest that is *not* an address is a produced profile's `sha256` — checked by regenerating the corpus
rather than by fetching it — and it is subtracted by name.

**It is not the installer's walk, and the difference is the harness.** `packaging/freeze.ts` records what
an installation asks for and is right to; this answers what a *client* can ask. A contract snapshot names
every file of its suite, no command of `cli/` fetches one, and permanent rule 5 says they are public in
full — so a tree built from the installer's walk serves a contract page's own digests as 404s. That is
I-37, and under it `toopo add` still works and the whole of `cli/` stays green, which is what makes it
worth a cell rather than an argument.

### The collision that decided every address

**Where an answer lives is derived from what it is about, and a collision decided it.** `Endpoint.path`
was a hand-written string read by nothing, and the client built `/<endpoint>/<address, percent-encoded>`
out of its own head — two statements of one address, neither of which could ever be a file, since `%2F`
is not a name a filesystem holds. Under the prefix §6.2 suggested, `/contracts/<address>` is a *file* at
exactly the path `/contracts/<address>/implementations` needs to be a *directory*. **That is the one
class a static emission finds and a dynamic server never meets.**

So an endpoint says what its answer is *about* and `pathTo` is total over three arms: the catalogue at
the root, a contract inside its own directory, content in a flat space of its own — flat because the same
bytes are named by several contracts and a shared thing cannot live under one of its owners. The prefix
dissolves, the collision with it, and what the collision was hiding is bought: **the address a reader
opens and the address a client asks are the same address.** `/typescript/number/parse@1/` is the page and
every answer about that contract is a leaf beside it.

**The leaf is the endpoint's own identifier and not a name chosen to read well.** That field is already
declared *the address a report or a deployment cites this endpoint by*, so a second spelling would be one
thing with two names — the slug `packages/site/paths.ts` refuses for a page, arriving on an endpoint. The price is
`/snapshot/{digest}` where English would write the plural, and the return is that no table of routes
exists anywhere in this repository to drift from these identifiers. **The whole translation between a URL
and a file is dropping the leading slash**, and that is asserted rather than left to be true.

**What is served and cannot be asked for is said out loud.** A refused contract has no binding, so
nothing names the digest of its contract snapshot and nothing names the harness files that snapshot is
the only place to learn about — two snapshots and nine files of `array/group-by@1`. Emitting them would
publish artefacts nothing can reach; omitting them in silence would look exactly like a hole in the
closure. The guard names both numbers.

**`ReadApi` is the first port here that is the whole read API, which makes the totality an equality.** A
client's port can only ever be checked for naming endpoints that exist; this one is checked for naming
all of them, and `attestations` — the one nothing answers — carries the event that would close it rather
than a reason that ages. `packages/registry/local-read-api.ts` is the third reader of `the-catalogue.ts` and is neither
client's stand-in: the installer's serves the harness and carries no binding, the generator's carries the
binding and serves one file per contract, and the emission needs both halves. The frontier is unchanged
and this is the side of it the frontier is about — no client may serialise this working tree, and the
registry serialising *itself* is what publishing is until a publishing tool exists.

## Consequences

**Measured at `56c052c`, over five contracts of which four are published: 48 files, 517 287 B.** Per
published contract eleven files — one contract binding, one implementation list, two snapshots and seven
harness blobs — and 126 kB. The harness dominates and is what varies: seven files here, one blob per
test file anywhere else.

**The fixed part was published as three files and is four**, and the correction is worth more than the
digit: `11 × 4 + 3` is 47 against the 48 this record measured, and what is in neither term is the
`implementation-bindings` of the *refused* contract. So the answers are `11P + R + 3` with `P` published
and `R` refused — the measurement was right and the shape written beside it was short by one, which is
exactly the class [ADR-0018](0018-a-published-count-carries-its-coordinates.md) exists for, arriving on
a formula rather than on a figure.

**And the wall this published at 1 817 contracts is not the wall.** These are the emitted *answers*; a
static host counts every file it serves, which is also the pages, the modules a browser loads and the
files found by convention at the root. Measured at `fc36162` over the same five contracts: **66 files
deployed, `13P + R + 13`**, and a twenty-thousand-file limit at **1 537 contracts**. The figure above
described a subtree and was cited as a deadline, here and elsewhere, until somebody counted the tree.

**Measured again after the Markdown twin, the index and the payload arrived**
([ADR-0094](0094-what-a-machine-is-told-and-what-that-is-worth.md)): **74 files, `14P + R + 17`, and the
limit at 1 427 contracts.** One `.md` beside every page, three of them fixed, and one `llms.txt`. The
migration that removes this wall entirely — an object store with no directory limit — changes no URL,
which is what makes the number a fact to state rather than a constraint to design against.

**What the generator pays is a second serialisation and not the emission.** Measured over five runs each,
808 ms with the tree against 532 ms without; split in process, `localReadApi()` is 258–287 ms, **the walk
itself is 2 ms**, and the rest is writing 48 more files. The curve is one extra serialisation of the
catalogue plus a linear term in files — so the day it matters, what is worth sharing is the
serialisation and not the emission.

**Nothing is deployed.** The tree is written into the site's output and served in a guard by a file
server with nothing in front of it, which is the whole of what a static host does. Every request it
answers is recorded with whether a file was there, so a 404 is *counted* rather than inferred from a
command having refused. **The acceptance is not that an install works over HTTP**: it is that `add`,
`search`, `update` and `remove` decide against that tree exactly what they decide against the catalogue
this repository holds, compared with every buffer replaced by the digest of its bytes.

**And what the two sides of that comparison actually differ in was read off the attribution rather than
reasoned about.** They share every decision and differ in one thing — which registry they read — so a
defect in a *decision* changes both identically and the comparison is green on it. What separates them is
a defect in the installer's stand-in, and the mutants that redden these guards are C-17, C-18, C-22 and
C-42, every one an edit to `local-source.ts`. The first draft of that declaration named the transport,
which nothing measured; it is the class this repository spends its length removing, caught by reading the
report instead of the code.

**Two things the replay found that no reading had.** `registry-storage` declared `I-35` twice — the edge
that reads its digest off the artefact, and the runtime floor — since the publication unit, and nothing
refused a duplicate mutant identifier where `calibrate()` refuses a duplicate guard one. And all three
new guard files built their subject at the top of the module, so `I-01` made one of them collect 303
tests where the unmutated arm reports 314: a file that collects nothing is read as a run that measured
part of the suite. It is the lesson `packages/site/pages.test.ts` records against W-20, relearned in three folders
at once.

## Confirmation

`the-tree-carries-pages-modules-crawler-files-and-answers` and `no-path-is-both-a-file-and-a-directory`
hold the emission and the collision; `a-page-and-the-answers-about-that-contract-share-one-address` holds
what the collision bought. `add-decides-the-same-thing-against-the-emitted-tree` is the acceptance
criterion, and its three siblings do the same for `search`, `update` and `remove`.

## What would reopen this

A host that is not a filesystem — an object store with no directories, where the collision this record
is built around does not exist. The addresses would still be right; the argument for them would be
weaker.

## More Information

- [ADR-0051](0051-what-a-registry-over-a-wire-costs.md) — the port a client reads this tree through.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
