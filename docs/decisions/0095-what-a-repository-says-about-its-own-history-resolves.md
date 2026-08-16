---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - mutation/history.ts
  - mutation/paths.ts
  - mutation/run.ts
confirmed-by:
  - battery: meta
    guard: every-commit-this-repository-cites-is-one-it-has
  - battery: meta
    guard: the-citation-sweep-reaches-the-prose-and-the-declaration
  - battery: meta
    guard: an-identifier-two-commits-answer-to-is-refused
  - battery: meta
    guard: no-object-of-the-graph-carries-a-refused-address
  - battery: meta
    guard: an-address-in-free-text-is-found-and-matched
  - battery: meta
    guard: the-address-sweep-reaches-the-commits-and-the-annotated-tags
  - battery: meta
    guard: a-refused-address-is-declared-as-a-well-formed-digest
  - battery: meta
    guard: an-address-is-digested-from-its-lowercased-self
  - battery: meta
    guard: no-worktree-is-registered-beside-this-repository
---

# What a repository says about its own history resolves against what git holds

## Context and Problem Statement

Three declarations of this repository behaved like rules with nothing making them hold, and all three
are about git rather than about the catalogue. A commit identifier written in the prose was resolved by
nobody. An address the project refuses to publish was kept out by a `user.email` in a local
`.git/config` that no clone carries. And a checkout registered by a run that never finished putting
itself away was detected by nothing, because it leaves the working tree clean.

The first is the one with a price already paid. Sixty-eight citations were translated from
`filter-repo`'s table when the history was reissued, each new identifier was verified by hand, and
**nothing in the repository would have noticed had they not been**. A dead citation was written two
commits after the thing it cited moved.

`THE_COMMITS_QUOTED` looked like the guard on exactly those identifiers and was not: it strips those
strings out of a comparison on the method page and never asks git whether any of them names anything.

## Considered Options

- Hand each identifier to `git rev-parse` and accept whatever resolves.
- Resolve each identifier against `git rev-list --all`, and require exactly one commit to answer.
- Judge, in prose, which runs of hexadecimal digits are citations and which are not.
- Declare the refused address in plain text beside the sweep that looks for it.

## Decision Outcome

### `git rev-parse` is not this guard, and that is measured rather than argued

The obvious spelling passes an identifier that has left the history, because a rewrite does not delete
the objects it replaces — they survive in the object database until a `gc` nobody schedules.

Measured at `e1d3aab`, over the three commits a rewrite and two amendments had just replaced. This
record cannot write the three identifiers in the form a citation takes, for the reason given below, so
what is transcribed is the two commands and what they answered:

```
git rev-parse --verify --quiet <identifier>^{commit}     resolved all three
git rev-list --all                                       held none of the three
```

**So a guard built on the first would have been green on all sixty-eight citations the morning after
`filter-repo` ran**, which is the one morning it existed to be red on. It would have gone red later,
at whatever `gc` eventually collected the objects, on a day nothing else was happening — which is
worse than never, because the failure would arrive detached from its cause.

The population is therefore `git rev-list --all`, and an identifier is live when **exactly one** commit
of that population begins with it. `--all` rather than `HEAD` because seventeen commits of this
repository are reached only by its `evidence/*` tags, and a sweep standing on a branch lets a defect
leave by that door — which is the correction the entry before this one had to make to its own closure
criterion. Exactly one rather than at least one, because an abbreviation matching two commits addresses
neither, and resolving it to the first would send a reader to a commit the sentence around it is not
about.

### What a citation looks like was measured, not chosen

Not every run of hexadecimal digits is a commit, and a guard that reddened on the rest would become a
list of exceptions nobody rereads — which is the shape ADR-0023's alias rule was refused at.

The distinction was already in the repository and nobody had noticed it. Measured at `e1d3aab`, over
every run of seven or more hexadecimal digits in the tracked files, classified by whether git could
resolve it at all:

| written as | citations | benign runs |
| --- | --- | --- |
| seven lowercase digits closed by a backtick | 58 of 68 | 0 of 29 |

A truncated digest is written with the ellipsis inside the quoting, so a closing backtick never follows
the digits. A decimal constant is not seven digits long. A deliberately fake identifier is a
single-quoted string in a test rather than prose. **Nothing is excluded by name**, and the rule reads
the convention this repository already wrote rather than one invented for it.

The ten citations spelled otherwise are reached without widening it: three carry a revision suffix
inside the same quoting, five are the values of `QUOTING` in `mutation/published.ts` — a declaration
that those strings are commit identifiers, and read as one — and the remaining two name identifiers
their own file also cites in the form above. Resolving distinct identifiers reaches them anyway. Sweep
and declaration together answer 35 identifiers against a ground truth of 35, with nothing missed and
nothing admitted that git cannot resolve.

### The refused address is declared as a digest

*Every commit carries the project address* cannot hold: an outside contributor legitimately commits
under their own, and a rule refusing that refuses contribution. What is checkable is the negative, and
the negative needs the address named.

Naming it in plain text takes the address out of the history and puts it into the source, which is the
same address published for the same length of time by a different door. **The decisive argument is
harvesting rather than secrecy: a robot reads, it does not guess.** So the declaration is a sha-256
digest of the lowercased address, every address git holds is digested and compared, and a fault names
the digest and never the address — so a red run does not print the thing the declaration exists to keep
out.

The limit is stated here and in the module rather than left for a reader to assume away: **a digest of a
guessable string is not a secret. It stops the address being republished; it does not stop anybody who
already suspects it from confirming it.**

What the digest is of is a statement and not a measurement. Nothing in this repository still carries the
address — measured at `e1d3aab`, `git log --walk-reflogs --format='%ae %ce' --all` answers one distinct
value and `git count-objects -v` reports no garbage — so nothing here can confirm which address it is.
The declaration is the author's; only the mechanism is the repository's.

### The worktree, and what is deliberately not claimed about it

`bindingsAtRevision` removes its checkout in a `finally`, and that path is sound rather than assumed:
`git worktree remove --force` deregisters a worktree even when the directory it names has already gone.
So the missing mechanism was never a `finally`. What was missing is that nothing detects a registration
left by a run that never reached one — it leaves `git status --porcelain` empty, so it walks straight
past `theRevision`, the refusal written for its neighbour.

**What it cost is not measured and is not claimed.** `git filter-repo` was reproduced against a
repository carrying one and completed normally, so the reason to refuse the state is the state, and no
failure anybody has seen is named for it.

## Consequences

`mutation/history.ts` holds the three readings; `mutation/paths.ts` holds the one shared with
`mutation/run.ts`, which refuses to start a replay from a repository carrying a stray checkout.
`trackedSources` is factored out of the two guards that resolve a citation, so `decisions.ts` and
`history.ts` cannot come to disagree about which files carry this repository's own text.

The cost is that this repository can no longer quote a commit it does not have, including as an example.

## Confirmation

The nine guards named in `confirmed-by` above. Three resolve a reference, four keep the readings that
feed them from going quietly empty — which is the failure this whole record is about, a resolver whose
sweep reaches nothing being green for ever and saying nothing — and two fire a refusal this repository
cannot produce.

Those last two hand their reading a population of their own, because the real one cannot exhibit the
case: seven hexadecimal digits do not collide over three hundred and ninety-four commits, and the
declaration cannot be exercised with the address it declares without writing that address into a test.
What each perturbs is the claim — an identifier two commits answer to, an address written where a
person writes one — and never something computed from it, which is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)'s line.
The second of them found a defect on the run that introduced it: distinctness had been taken over the
text of an address rather than over its digest, so two spellings of one address were two faults.

**What no mechanism here keeps is a sentence about an identifier that does not write it.** *The commit
whose whole subject is one word of one comment* is a claim about a commit and goes stale exactly as a
citation does. Those sentences were reformulated by hand in the unit before this one and nothing keeps
them reformulated. It is half the field, and it is declared rather than glossed — the alternative is a
lint judging prose, at the price ADR-0023 and ADR-0042 were both refused at.

**And this record cannot exhibit a dead identifier, only describe one.** A citation is a citation
wherever it is written, so an example of a broken one written in the citation form would redden the
guard reading it — correctly. That asymmetry is the guard working rather than a hole in it, and
ADR-0001's own module paid the same cost first, on an invented record number.

## What would reopen this

- A commit identifier written at some length other than seven digits, which would make the sweep
  narrower than the convention it reads. What it takes is remeasuring the table above, not widening the
  rule on the strength of one sentence.
- An outside contributor, which is the case the address rule is written round and which nothing here
  has yet seen. A second entry in the declaration is the shape it takes; a rule about who may commit is
  the shape it must not.
- A `gc` that collects the replaced objects, which would make `git rev-parse` and `git rev-list --all`
  agree again on this repository and hide the reason the second was chosen. The measurement above is
  stamped for that day.

## More Information

- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why every figure above carries the
  commit it was measured at, and why none of them is an observation wearing a count's clothes.
- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) — the freeze check whose
  checkout is the worktree this refuses to find left behind.
- [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) — why the worktree
  entry names a state and no failure.
- [ADR-0001](0001-record-decisions-in-madr-format.md) — the format, and the module whose citation guard
  this one is the twin of.
