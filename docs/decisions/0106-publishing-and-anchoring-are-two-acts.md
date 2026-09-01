---
status: accepted
date: 2026-08-17
governs:
  - packages/registry/publication.ts
  - packages/registry/the-catalogue.ts
  - packages/registry/local-read-api.ts
  - packages/cli/local-source.ts
  - packages/site/local-source.ts
confirmed-by:
  - battery: registry-storage
    guard: the-decision-to-publish-moves-no-digest
  - battery: registry-storage
    guard: a-comment-reworded-in-a-published-contract-is-refused
  - battery: registry-storage
    guard: the-public-fields-npm-shows-are-the-ones-this-code-declares
  - battery: registry-storage
    guard: the-manifest-carries-no-private-flag-and-the-catch-that-replaces-it-is-named
  - battery: registry-storage
    guard: the-readme-counts-the-catalogue-the-registry-declares
  - battery: cli-install
    guard: the-local-source-binds-the-version-the-registry-published
  - battery: site
    guard: both-stand-ins-bind-the-version-the-registry-published
  - battery: packaging
    guard: the-installed-archive-carries-the-version-this-code-declares
---

# Publishing and anchoring are two acts, and no commit can do both

## Context and Problem Statement

The catalogue is finished at five contracts and the client's interface at six commands. What was left
was the inventory a first publication settles for ever: the manifest's visibility and version, the
lifecycle of the four installable contracts, and the version and instant their reference
implementations are bound at.

[ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) requires every published binding
to record `publishedFrom`, the commit whose registry produced its digest, and it named this unit in
advance under *what would reopen this*: **a publication. Everything here is measured on a repository
where nothing is published.**

So the question is not whether to record the coordinate. It is which commit a binding may name, on a
commit that is being written.

### The two halves of the ledger do not behave alike, and only measurement says so

Measured on this working tree, one perturbation at a time, against `npm run ledger`:

```
                                    contracts            implementations
untouched                           d5071a58 …           reference@0.0.0-local 3e020cd9 …
lifecycle -> published              unchanged            unchanged
version   -> 1.0.0                  unchanged            reference@1.0.0       8c4af2c7 …
```

`contractSnapshot` omits `lifecycle` — it is the one `CONTRACT_STANDING_FIELD` — so **the marking moves
no contract digest**. `implementationSnapshot` carries `version`, so the same commit **creates** four
addresses: `typescript/number/parse@1/reference@1.0.0` and its three neighbours exist at no earlier
commit in this history.

That asymmetry is the whole problem. For the contracts, the commit before the marking already binds
every digest — measured over the last six commits, `HEAD`, `HEAD~1`, `HEAD~2` and `HEAD~3` each rebuild
all eight bindings of this tree, and `bc3c3cc` is the last commit that moved the four contract digests.
For the implementations, no past commit binds the address at all, and `faultFor` would say so in as many
words: *the registry at that commit binds no such address*.

## Considered Options

- One commit, naming the commit before it. True for the contracts, provably false for the
  implementations.
- One commit, leaving the implementations unanchored and named by `unanchoredBindings`.
- Two commits: one that publishes, one that records where the publication happened.

## Decision Outcome

Chosen: **two commits. The first marks the catalogue published and mints the versions; the second
records that first commit as `publishedFrom` for every binding.**

**The argument is a fact about the mechanism and not a convenience of this unit.** A binding's digest is
a function of the commit that produces it, and `publishedFrom` is a claim about a commit whose registry
already produced it. A commit cannot contain its own identifier, so no commit that mints a digest can
record where that digest was minted. Publishing and anchoring are two acts. The publishing tool this
repository has yet to write inherits that shape rather than choosing it.

The second commit moves no digest, and that is what makes it free: `publishedFrom` lives in
`local-read-api.ts`, which is in neither snapshot, so rebuilding the first commit produces exactly what
the second one produces, for all eight addresses.

**What this establishes**: every binding names a commit at which this repository really produced that
digest, checked by rebuilding rather than transcribed anywhere.

**What it does not establish**, said here rather than left to be assumed:

- that the commit is where the artefact was published *to npm*. Nothing has been. The provenance of a
  tarball is a fact npm holds and this repository does not.
- that the digest is the one the declared origin serves. That is
  [ADR-0104](0104-the-proof-against-the-origin-lives-where-nothing-replays-it.md)'s suite.
- that the bytes behind the digest are the catalogue's own. That is the entry `CLAUDE.md` prices and
  nobody has bought.

### Why the package's version and an implementation's version come apart here

They were one string until this commit, tied by `the-archive-is-visibly-unpublished`, and the tie was
right for exactly as long as both were stand-ins saying *nothing here was published*.

Published, they answer different questions. `THE_PACKAGE_VERSION` moves on the next release of the
client — the plan is already a correction published from CI. `THE_PUBLISHED_IMPLEMENTATION_VERSION` is
half of a frozen address, and rebinding one is what permanent rule 6 exists to refuse. **A tie kept
across the publication would rebind four addresses on the first bug fix.** So it is cut deliberately,
and what would report a future attempt to re-tie them is not a comparison in a test file but the freeze
check itself.

### A redundancy nothing keeps is deleted; a redundancy that is a mechanism is completed

Three modules declared the version and three declared the publication instant, and the two cases were
not the same case. **The distinction is worth more than the two constants, and it is the rule this
record leaves behind.**

The **instant** was declared three times, exported nowhere, asserted by no guard and injected into by no
mutant. Three statements with nothing between them is not redundancy, it is three places for one fact to
be wrong. It collapses to one declaration in `publication.ts`, imported by all three — closed by the
shape rather than by a guard, which is [ADR-0054](0054-make-the-omission-impossible.md)'s rule.

The **version** was declared three times and two of those declarations are a mechanism: a client may not
import another client, so the installer and the generator each state it and `source.test.ts` reads the
disagreement — and `C-18` and `W-18` are the mutants that measure the reading. Deleting that would be
tidying away a working guard. What was actually wrong was the **third** leg: the registry's own copy was
tied to nothing at all, and it is the one the emission reads, so a drift there would have announced a
version this repository never published inside somebody's `toopo.lock`. `local-read-api.ts` now imports
the declaration rather than restating it, and both stand-ins resolve against it.

**So: a redundancy no mechanism keeps is removed, and a redundancy that is a mechanism is completed.**
Telling them apart is a question about what reads each statement, and it is answerable by looking.

### The catch that is gone, and what is not standing in for it

`private: true` was stage rule 4 for this repository's whole private life. Removing it is the act, not
an oversight, and no second flag replaces it. What stops a publication nobody decided is that nothing
here runs `npm publish`: the workflow's token is `contents: read`, no runner holds an npm credential,
and `prepack` builds. A guard asserts the field's *absence*, so putting it back reddens — and putting it
back would make every publication fail.

## Consequences

**Four contracts are frozen from this commit.** Every byte of their declared files, comments included,
plus the two shared files [ADR-0105](0105-a-contract-freezes-what-its-guards-call.md) added. A repair is
`name@2` beside them rather than in place of them. The sentence lives on `publishContract` and on
`PUBLISHED` in `the-catalogue.ts`, where somebody is about to take the decision.

**`frozen-for-life.test.ts` stopped building its subject and started finding it.** It marked a contract
published in a clone because a freeze check over a catalogue where nothing was published computes every
answer over an empty set. The clone's own head is now the published subject, and what is committed into
it is only what can happen to a published contract afterwards.

**And `the-decision-to-publish-moves-no-digest` gained a job rather than losing one.** It used to keep
the measurements around it honest. It now carries the claim that lets a binding name a commit taken
before the publication, asserted over all three lifecycle states a contract of this catalogue can hold.

## Confirmation

The eight guards above. Three of them were reworded rather than written, and the rewording is the
measurement: `C-18` and `W-18` used to stamp `'1.0.0'` into a stand-in on the argument that a version
which looks published and is not turns the lockfile's own value against it. That string is now the
truth, so both mutants would have injected nothing — an edit that does not apply, which `run.ts` refuses
as loudly as it refuses anything. Both now write a version the registry never published, which is the
worse defect and the one that survives the publication.

**One failure was seen rather than reasoned about, and it is recorded because the class is.** The whole
registry suite ran green — 22 files, 356 guards — over a working tree carrying this unit's changes,
while `frozen-for-life.test.ts` was already unable to start at the commit those changes were about to
make. Its subject is a clone of `HEAD`, so it measured the previous unit. **A guard whose subject comes
from the last commit says nothing about the work in hand**, and it is the third control in one week
found green for a reason other than the one a reader takes from it.

## What would reopen this

- **A second publication.** The first is one commit naming one predecessor; a catalogue publishing a
  sixth contract later has bindings anchored at different commits, and `publishedFrom` becomes per
  binding rather than one constant.
- **A publishing tool.** It would perform both acts, and the two-commit shape stops being something a
  person sequences by hand.
- **An implementation republished.** Nothing here mints a second version of one, and the day something
  does, `THE_PUBLISHED_IMPLEMENTATION_VERSION` stops being a single string.

## More Information

- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — the coordinate this unit is
  the first to fill, and the record that named this unit as what would reopen it.
- [ADR-0048](0048-what-the-manifest-states.md) — what the manifest states and the order a publication
  takes.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why the README's sentence about npm
  carries a date.
