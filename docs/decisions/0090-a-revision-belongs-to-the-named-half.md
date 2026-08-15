---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/revision.ts
  - packages/registry/response.ts
  - packages/site/site.ts
  - packages/site/build.ts
confirmed-by:
  - battery: registry-storage
    guard: every-named-answer-names-the-revision-it-was-served-from
  - battery: registry-storage
    guard: a-content-addressed-answer-is-the-same-bytes-at-every-revision
  - battery: registry-storage
    guard: the-revision-is-not-published-as-an-opinion
  - battery: registry-storage
    guard: a-named-answer-moves-when-the-revision-does-and-the-policy-says-so
  - battery: registry-storage
    guard: the-revision-of-a-clean-tree-is-the-commit-git-names
  - battery: registry-storage
    guard: a-tree-that-does-not-agree-with-its-commit-names-no-revision
  - battery: site
    guard: every-named-answer-in-the-tree-names-the-revision-it-was-built-from
---

# A revision belongs to the named half, and the envelope is the half that passes

## Context and Problem Statement

Everything a client receives from this registry is checked by arithmetic except one thing. The bytes of
a file hash to the address they were fetched by; a snapshot re-canonicalises to its own digest; every
edge below a root carries the digest of what it names, so the whole closure hangs off one digest. What
is believed is that **the name a reader started from is bound to the digest this registry says it is** —
`RESOLUTION_IS_THE_CLIENTS` and [ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) both say so in
as many words, and no scheme makes a first resolution checkable offline.

A lockfile therefore records a belief and has no way to say *which registry, when*. That is the gap this
record closes: a named answer that names the revision it was produced from lets a reader rebuild the
registry at that revision and obtain the same answers, which is the only recourse there is if the host
stops answering.

The question is where the field may live. It is not a question of taste, because a published version is
frozen for life and every installation writes digests into somebody else's repository.

## Considered Options

- Inside the frozen half, on `Snapshot`.
- Inside the envelope of a content-addressed answer — `ServedSnapshot` and `ServedBlob`.
- On the named answers only, as one shared type.
- On one named answer of its own, at a new endpoint, fetched separately.

## Decision Outcome

Chosen: **on the named answers only, as one shared `NamedAnswer` type**, with a fourth `FieldNature`
member for it.

### The frozen half, refused for the reason already in the file

A snapshot's digest is taken over its canonical text, so a revision inside one makes the same content
produce a different digest per commit. `snapshot.ts` already refuses the publication timestamp in those
words — *a digest that moved with the clock would make "the same content produces the same digest" false
by construction, and republishing identical content would mint a second identity for one artefact* — and
a revision is a clock with better resolution. Nothing new is decided here; the existing sentence covers
it.

### The envelope, refused for a reason no digest guard would have found

**This is the half worth recording, because it trips nothing.** `ServedSnapshot` is
`{ addressing, addressedBy, canonicalText, formatVersion }` and the digest is taken over `canonicalText`,
not over the body carrying it. A `servedFrom` added there moves **no digest at all**: `servedSnapshotFaults`
re-canonicalises the text and compares, `snapshotFaults` hashes the frozen value, and both stay green.
Measured, by doing it — `servedSnapshot` was given the field and the whole `registry` suite was run:

```
a-snapshot-answer-hashes-to-its-address-*         green
the-body-served-is-already-canonical-*            green
a-snapshot-answer-that-was-altered-is-refused     green
every-field-a-snapshot-serves-is-classified-*     green
```

Sixteen of seventeen files green, and the one red was the guard written for this record.

What forbids it is one screen up, in `cachePolicyFor`. A content-addressed answer is served `immutable`
with `max-age` of a year, and its `staleWhen` reads *never. The address is the digest of the answer, so
different bytes are a different address and this entry is never wrong*. A revision in the envelope makes
the bytes at a fixed address move on every commit, so a cache honouring that promise serves a year-old
revision under a sentence saying it cannot be stale — and a reader who checked the digest would find it
correct, because the digest was never about the envelope.

So the guard is written as the promise rather than as the shape:
`a-content-addressed-answer-is-the-same-bytes-at-every-revision` builds two registries over one working
tree at two revisions and requires one digest to answer one byte string. Its last assertion is the
control — the named half *must* differ — because without it the guard would pass on a registry where the
revision reached nothing.

### A separate endpoint, refused because it cannot be paired with anything

A revision fetched on its own is a revision a client cannot tie to the answers it acted on: the index
could come from one deployment and the bindings from the next, and the lockfile would record a state
that served neither. An installation reads exactly two named answers — the index that turns a name into
an address, and the bindings that turn that address into a digest — so the pairing has to be carried by
the answers themselves. `oneRevisionBehind` is what compares the two and refuses when they disagree,
which happens for an ordinary reason rather than a hostile one: a deployment publishing between two
requests.

### A fourth `FieldNature`, and why it is not `revisable`

`FieldNature` had three members, and all three answer *what may a reader do with this fact about the
artefact*: the question echoed back, bound for life, or the registry's opinion today. A revision is not
about the artefact at all. Filing it under `revisable` would put it in `revisableFieldsOf`, which is
rendered into what `implementation-bindings` publishes as *the registry's opinion, changeable without
anything being wrong* — beside a sentence telling a reader not to take an opinion for a fact about the
code. That is the wrong thing to say about the one field of a named answer that **is** a fact, and the
one a lockfile keeps in order to go back to it.

[ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) refused a third `AddressingClass` member on the
grounds that the class is per response and decides a cache policy. That argument is untouched: this is
per field, which is the level that record found was buildable.

### The cache policy said something that stopped being true

`cachePolicyFor('named').staleWhen` read *a publication binds a new address, a standing changes, or a
measurement arrives. All three are writes to the ledger, so a deployment purges on ledger writes and on
nothing else.* Carrying a revision makes the last clause false: a commit touching no ledger entry
changes every named body. Left as written, the field would have published a true sentence about what
makes an answer wrong and a false one about what makes it stale, in one string, and a deployment reading
it would have purged too rarely. It is rewritten in the same change, and
`a-named-answer-moves-when-the-revision-does-and-the-policy-says-so` derives the first half from two
indices over one ledger rather than asserting the wording.

### Where the revision comes from, and what refuses to name one

`theRevision` spawns git, so no module a user receives may import it, and none does. It refuses a
working tree that does not agree with its own commit — **both spellings**, because a tracked file edited
is the one anybody thinks of and an untracked file is the one that matters: a contract added and not
committed is exactly the change that would be served and then be unfindable.

The three stand-ins default to `THE_UNPUBLISHED_REVISION`, forty zeros, which is git's own spelling of
*no object*. That is the argument `THE_UNPUBLISHED_VERSION` makes about `0.0.0-local`: a plausible value
would name a state that exists nowhere and leave nobody able to tell it from one that does. Unlike that
constant it has one home rather than three, because *no object* is a fact about git and belongs beside
the function that asks git, where a minted version is an invention of a stand-in and belongs to each.

A default is a hole in exactly one place — a deployment — so the single arrangement that builds one now
takes the revision with no default. `thePublication` also removes a duplication that had been there
since the generator was written: `build.ts` composed the pages, the reference modules and the answers,
and `published-tree.test.ts` composed them again to ask a question about paths.

## Confirmation

Seven guards. Two say the revision reaches every named answer — one over the port, deriving the list of
named answers from `ENDPOINTS` rather than writing it out, and one over the tree a deployment is handed,
reading the bodies back out of the emitted bytes rather than off the port that produced them. One says
no content-addressed answer moves with it, which is the trap above. One says it is not published as an
opinion. One says the policy and the bodies agree. Two are over `theRevision` itself, in a temporary
repository built to be dirtied, because a shape assertion against *this* working tree could not have
seen the refusal red.

Both of the first two were seen red on their real failure condition rather than assumed:

```
servedSnapshot given the field        a-content-addressed-answer-is-the-same-bytes-at-every-revision
                                      expected '…"servedFrom":"aaaa…"' to be '…"servedFrom":"bbbb…"'

refusals() passing the constant       every-named-answer-names-the-revision-it-was-served-from
                                      expected [ [ 'refusals', '0000…' ] ] to deeply equal []

thePublication dropping it            every-named-answer-in-the-tree-names-the-revision-it-was-built-from
                                      expected [ Array(11) ] to deeply equal []
```

**What no guard here establishes** is that the revision a deployment stamps is the revision that
deployment was built from. `theRevision` refuses a dirty tree and `build.ts` is the only caller, so the
stamp is honest for anything this repository publishes — but a host serving last week's tree under this
week's answers is outside what any arithmetic reaches, and it is the same class as
`the-registry-serves-everyone-the-same-bytes`.

## What would reopen this

- A transparency log, which would make the revision checkable by a third party rather than merely
  recordable, and would change what `MUST_BE_BELIEVED` says about the first resolution.
- A registry that is not this repository. `theRevision` asks git because the registry *is* a git
  repository today; a published service with its own store would name its state some other way, and the
  field would stop being a commit while staying the same field.
- A second named answer an installation reads. `oneRevisionBehind` compares what an installation
  actually fetches, and a third would join it rather than replace the shape.

## More Information

- [ADR-0050](0050-a-frozen-edge-carries-its-own-digest.md) — the frozen/named cut, `FieldNature`, and
  why a third `AddressingClass` member cannot exist.
- [ADR-0051](0051-what-a-registry-over-a-wire-costs.md) — the port a remote registry implements, and
  what a client believes over a wire.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why the measurements above carry the
  command that produced them.
