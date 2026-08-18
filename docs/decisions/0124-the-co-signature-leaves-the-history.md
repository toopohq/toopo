---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - mutation/history.ts
  - mutation/paths.ts
  - .claude/settings.json
confirmed-by:
  - battery: meta
    guard: every-commit-this-repository-cites-is-one-it-has
  - battery: meta
    guard: the-citation-sweep-reaches-the-prose-and-the-declaration
  - battery: freeze
    guard: every-published-binding-still-hashes-to-what-it-was-published-as
---

# The co-signature leaves the history, and a coordinate is translated where a quotation is not

## Context and Problem Statement

Every commit of this repository was co-signed by the assistant that helped write it. Measured at the
commit now named `f5386216`, over `git rev-list --all`: **473 of 506 commits carried
`Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`**, and the root commit is one of
them, so no commit of this graph is downstream of nothing that carried it.

The owner decided to take it out of the history and out of every future commit. The cost was presented
before the decision and the decision was reaffirmed after it, which is why this record argues the
mechanism rather than the intent.

**A rewrite of this repository's history is not a routine act**, and the reason is the thing this
repository sells. Two hundred and twenty-three identifiers in the tracked tree name commits of this
graph; four npm attestations name commits of it; three `evidence/*` tags retain seventeen commits that
`main` does not reach. All of that is addressing, and a rewrite renames every address at once.

**Second time, and the first is why this one was possible.** ADR-0095 records the rewrite of
2026-08-16, which took a personal address out of every commit and established that the trees survive a
rename. This one is the same shape on a different field.

## Decision

**The trailer is removed from all 506 commits by `git filter-repo`, changing messages and nothing
else, and every coordinate into this graph is translated to the new name of the same commit.**

### Why the trees are what make this honest

`filter-repo` runs with no path filter and no blob callback, so no tree is touched. That is not a
description of the intent, it is the measurement this whole unit rests on, and it was taken rather
than assumed:

```
for each of the 506 pairs in .git/filter-repo/commit-map:
    tree of <old> in the mirror  ==  tree of <new> in this repository
                                                       506 of 506 identical
```

**This is the acceptance test and everything else follows from it.** A stamped measurement is a claim
about a tree; the translated commit holds the same tree; so the measurement stays true under the
rename. ADR-0030 already stated it for the previous rewrite — *every measurement stayed true and every
stamp was translated to the same commit's new name* — and this record adds the arithmetic behind the
sentence rather than a second assertion of it.

### What is translated and what is not

The rule is applied **per occurrence and never per identifier**, and the test is one question:

> What would have to be re-read to check this sentence?

- **This repository at that commit** — the identifier is a coordinate, and it is translated.
- **Another system's record** — the identifier is a quotation, and it stays as that system spells it.

Measured over every tracked file, not only the ones the citation guard reads: **221 translated, 2
kept.** The two are `gitHead` lines inside fenced transcripts of npm's own record, in ADR-0109 and
ADR-0111.

**The finding worth carrying out of this is that one identifier fell on both sides.** `a413615`
occurred five times. In ADR-0111 it is transcribed from npm's record as `gitHead a413615908a9…` and it
stays; four lines above, *Measured at `a413615`, by reading npm's own record* is where the reading was
taken and it moved. Same seven digits, two natures, and no rule keyed to the identifier could have
separated them. The same split runs through ADR-0109, where the coordinate and the `gitHead` named one
commit when the record was written and now name two — which is the rule working and not a defect, so
both records say so where a reader meets them.

**A third class neither moves nor stays.** ADR-0018's seventh instance counted the trailers of a graph
this unit destroys. It carries no identifier, it is past tense, and it stays true; what it loses is
that anybody can re-take it. It gains a dated clause and keeps its figure, because writing a new
number into the record whose subject is *figures nobody took* would be committing there the failure it
records.

### The blocker, and the two options it left

**Two of the files a published contract freezes carry citations, and they cannot be repaired.**
`packages/catalogue/every-contract.ts` and `packages/catalogue/identifier.ts` are `THE_SHARED_FILES`;
`contractSnapshot.frozen` names `sharedHarness`, whose entries carry a `sha256` per file. So one
character changed in either rebinds all four published contract digests. Between them they hold three
dead identifiers: `3ec99c5` twice in prose, and `THE_ANATOMY_WAS_MEASURED_AT`, which is an exported
constant and not a comment.

Considered:

- **Rewrite only the commits after `3ec99c5`.** That identifier survives, the freeze holds, no guard
  moves — and 320 commits keep the trailer. Rejected: it does not do the thing that was asked.

- **Let the four published digests move, and republish the bindings as a revision**, which is the word
  ADR-0023 already uses and which the mechanism can express. **Rejected on the ratio, and it is
  recorded because it is the option a later reader will think of first.** It spends the promise the
  whole product rests on — a published digest never moves — to buy a correction of attribution.
  Somebody holding a lockfile would find an address had moved under them for a reason that has nothing
  to do with them, and no explanation makes that a good trade. The freeze is not a strong default
  here; it is permanent rule 6.

- **Chosen: the citation guard's population becomes the tracked sources this repository may still
  edit.** `theEditableSources` subtracts what a published contract freezes, derived from `theFive` and
  never typed, so a sixth published contract narrows it without anybody editing a list.

**It is a category and not an exemption, which is the whole of why it is acceptable.** A citation goes
stale and is repaired; that is the loop this guard drives. Inside a frozen file there is no repair,
because the repair is the edit permanent rule 6 forbids — so sweeping it asserts something no action
can satisfy, and a guard whose red has no green is a permanent red rather than a guard. A repository
cannot answer for what it no longer has the right to modify, and naming the population for what it is
beats claiming a sweep one part of which is out of reach.

### The freeze, which is the check that had to be reasoned about before acting

`PUBLISHED_FROM` in `packages/registry/local-read-api.ts` is a forty-digit constant that no guard
resolves — `A_CITATION` wants seven digits closed by a backtick. What resolves it is `freeze` itself,
which checks the commit out under `.rebuilt/` and runs that commit's own `ledger` script.

1. **It must be translated**, or `bindingsAtRevision` cannot check anything out and the suite is red on
   `ARevisionCannotBeRebuilt`.
2. **Translating it moves no digest.** `local-read-api.ts` is in neither `THE_SEVEN_FILES` nor
   `THE_SHARED_FILES`, and `contractSnapshot.frozen` names `harness` and `sharedHarness` and nothing
   else from the tree.
3. **The rebuilt commit's own stale copy never enters the comparison**, because `renderBindings` writes
   two fields — the address and the digest — and `publishedFrom` is not one of them.
4. **The digests are equal because the tree is**, which is the measurement above and not an argument.

### The trailer stops being added, in the repository rather than on one machine

`.claude/settings.json` carries `includeCoAuthoredBy: false`. It is tracked, so a contributor who
clones inherits the convention without reading a line of prose — the difference between a mechanism and
a sentence, which is the distinction this repository applies everywhere else.

**It is a default and not a prohibition.** Crediting somebody who worked on a change is what a trailer
is for, and anybody may write one by hand. What it refuses is a trailer nobody decided to add.

## Consequences

**The four npm attestations name commits that no longer exist.** `1.0.0` through `1.0.3` each froze a
`gitHead`, and nothing can move them. The repair is forward and not backward: the next version
published carries an attestation naming a commit of this history. **That publication is a separate
unit**, deliberately — the version is what triggers `npm publish` since ADR-0111, so moving it inside a
rewrite would publish from the middle of one.

**Every paragraph carrying a translated identifier returns to one hand.** Read before this unit, at the
commit now named `f5386216`: **8 826 paragraphs across 383 tracked sources, 25 at three hands or more**.
The translation touches 73 files, so `npm run hands` will read cleaner afterwards with no prose having
improved. This is the reflow objection `CLAUDE.md` already records as the reason no guard is written
over that reading, arriving by a door nobody had predicted — and it is why the figure is published here
with its coordinate rather than left for a later reading to misinterpret as progress.

**Commit messages had their coordinates translated wholesale, by the tool and not by the rule.**
`filter-repo` rewrites resolvable identifiers inside messages unless told not to, and it cannot know
which of them quote npm. Measured: 102 messages carry 175 resolvable runs, four of which name a
`gitHead` npm still holds. Turning the feature off would have broken 171 correct translations to
protect 4, in text no mechanism here reads. Taken knowingly.

**A guard's own claim of coverage was found false on the way through.** `history.ts` said the
identifiers its narrow form misses are quoted elsewhere in their own file and reached anyway. Records
written since made that untrue: a `git log` excerpt in ADR-0111, the `npm run hands` table in ADR-0112
and two comments in `style.ts` write identifiers no backtick repeats. Every one had to be translated by
hand, and the guard would have been green with all of them dead. The paragraph is corrected and the gap
is on `CLAUDE.md`'s list with what would close it.

**A convention that forbade this is rewritten rather than quietly broken.** `CLAUDE.md` said *no force,
no tag, no rewriting of history*. Two of those three have now been done twice, on the owner's decision
both times, and the line says so with the dates. What stays forbidden is a rewrite that is not one of
these — an amendment to tidy a message, a rebase to linearise — because those buy nothing a new commit
does not and cost every citation in the tree at once.

## What would reopen this

A third rewrite, which is a decision and not a convenience: it would have to be argued here, and it
would arrive with more frozen files than this one did, since each publication adds seven.

A sixth contract published, which narrows `theEditableSources` by seven more files. That is the
mechanism working, and it is worth a reading rather than a change: the day a frozen file carries a
citation nobody noticed, the entry on `CLAUDE.md`'s list gains an instance.

Widening `A_CITATION` to every hexadecimal run that resolves, which would close the bare-identifier
gap. It was refused here rather than overlooked: a rewrite is the wrong unit in which to widen the
guard that reads it.

## More Information

- [ADR-0095](0095-what-a-repository-says-about-its-own-history-resolves.md) — the first rewrite, and
  the guard that makes a citation resolvable in both directions.
- [ADR-0030](0030-what-the-method-page-may-say.md) — that a stamp is translated and stays, and the one
  shape that does not survive translation: an identifier quoted for its spelling.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — a count carries its coordinates, and
  the instance this unit made unverifiable.
- [ADR-0105](0105-a-contract-freezes-what-its-guards-call.md) — why the two shared files are frozen
  with every contract, which is what made the blocker.
- [ADR-0107](0107-the-freeze-check-lives-where-nothing-replays-it.md) — the check that rebuilds a
  binding at the commit it records.
- [ADR-0111](0111-the-number-asks-for-the-publication.md) — why nothing is published in this unit.
