---
status: accepted
date: 2026-08-17
governs:
  - .github/workflows/suites.yml
  - packaging/what-npm-holds.ts
  - packaging/print-whether-to-publish.ts
confirmed-by:
  - battery: meta
    guard: the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version
  - battery: packaging
    guard: the-versions-npm-holds-are-every-key-of-the-listing
  - battery: packaging
    guard: a-name-npm-has-never-heard-of-holds-no-versions
  - battery: packaging
    guard: the-address-asked-is-the-name-under-the-origin
  - battery: packaging
    guard: an-answer-that-lists-no-versions-is-refused
  - battery: packaging
    guard: a-status-that-is-not-an-answer-is-refused
  - battery: packaging
    guard: a-reader-that-could-not-read-is-refused-and-never-read-as-emptiness
---

# The number asks for the publication

## Context and Problem Statement

[ADR-0109](0109-the-publication-holds-no-credential.md) took the credential out of publishing and put
`npm publish` in a job of `suites.yml`, triggered by a dispatch of `main` carrying the typed word
`publish`. **That mechanism works and this record is not about a defect in it.** Measured at `2efc482`,
by reading npm's own record of the version it produced:

```
_npmUser           GitHub Actions <npm-oidc-no-reply@github.com>
maintainers        mathis-perron <hello@toopo.dev>
gitHead            a413615908a9b0bd209b3469b9c2516db4bdca00
dist.attestations  provenance, https://slsa.dev/provenance/v1
```

The publisher is an identity GitHub minted and npm exchanged, the attestation is written, and the commit
is named. Every sentence ADR-0109 could not check before a first dispatch is true.

**The commit it names is one this repository no longer has**, and the block is kept as npm spells it for
the reason [ADR-0124](0124-the-co-signature-leaves-the-history.md) gives: a transcript of another
registry's record is not this repository's to rename. The coordinate three lines above it is, and it moved.

**What is wrong is that one decision is carried by two gestures.** A version is decided in a commit; the
publication is asked for later, from a menu, by a person who has to remember. Between the two the
repository is in a state nothing describes: the tree is corrected and the package is not.

**It happened twice in two days, and neither time did anything say so.** `f065a7f` corrected the command
four surfaces printed, and the fix reached the site on its own push while npm went on serving a client
that told readers to run something answering `command not found`. `d8a25ae` moved the installed path from
`lib/toopo/string/slugify/slugify.ts` to `lib/toopo/string/slugify.ts`, and the package on npm still
writes the old shape. The gap closes when somebody remembers, and its width is however long that takes.

**The third day it produced a red.** A dispatch of `d8a25ae` — a tree declaring `1.0.2`, which had been
published from `2efc482` — reached npm and was refused:

```
npm notice version: 1.0.2
npm error You cannot publish over the previously published versions: 1.0.2.
```

The suites were green, the site deployed, the proof against the origin passed, and the last step failed
because the run had been asked for a publication that could not exist. **A gesture that can be made when
it means nothing is a gesture that will be**, and the cost here was a red run on a repository that is
about to be public.

### What the mechanism has to be, and the failure it must not have

The deliberate act does not disappear — it moves to the version number, which is a string nobody edits by
accident, in the file whose whole subject is what gets published.

**The condition cannot be *this commit is on `main`*.** Every push would then reach `npm publish` and be
refused on a version that already exists, so `main` would be permanently red for a state that is entirely
normal — a repository whose latest commit is not a release. That is the red everybody learns to scroll
past, and this repository has spent several units dismantling exactly that.

## Considered Options

- **Keep the dispatch.** What ADR-0109 built.
- **A tag.** The conventions of this repository forbid one, so it was never available.
- **Publish on every push of `main`.** The failure above.
- **Compare the version against the parent commit's**: publish when `package.json` at `HEAD` declares
  something different from `HEAD^`.
- **Compare the version against what npm holds**: publish when the registry does not already hold it.

## Decision Outcome

Chosen: **the version is compared against what npm holds.**

A job reads the listing of published versions for this package, compares it with the version this
checkout declares, and answers one thing. The publishing job waits for it and fires only when the answer
is that npm does not hold it.

### Why not the parent commit, when the parent commit works

The comparison against `HEAD^` was measured before it was refused, over the whole population rather than
a sample of it. At `d8a25ae`, reading `package.json` at every commit `HEAD` reaches and at each one's
parent:

```
1.0.1 -> 1.0.2   2efc482 chore(publication): the first version whose compiled content differs…
1.0.0 -> 1.0.1   1048d89 chore(publication): the version moves and the code does not
0.0.0-local -> 1.0.0   d3a5166 feat(publication): the catalogue is marked published…
undefined -> 0.0.0-local   60ac800 feat(packaging): the archive somebody installs…
(no parent)      50e86d7 chore: initialise repository…

commits swept: 440
commits where the version differs from the parent's: 5
```

Three real publications, the commit that created the field, and the root. **It selects correctly on every
commit this repository has ever had**, and it would have prevented the red above.

It was refused because **it answers a different question**. *Did this commit move the number* is a proxy
for *is what we declare already out there*, and the two part company in a case that is not exotic: GitHub
runs a workflow once per push, on the tip. A push carrying a version bump with any commit on top of it
has a tip whose parent already declares the new version, so nothing publishes — and nothing is red,
because a job whose condition is false is skipped rather than failed. **A silent non-publication is the
same defect this record exists to remove**, arriving through a smaller door.

Comparing against the registry has no such case. It does not matter which commit moved the number, or
whether one did; what is asked is whether the thing this tree declares is a thing people can already get.

### Why a listing, and never `dist-tags.latest`

The question is one of existence, and this repository has already paid for asking that as a request. A
throwaway deployment was proved deleted by fetching a page, reading 404 and concluding absence; the
Worker was still there. **A request answers about content; only a listing answers about existence.**

So what is read is the document holding every version of the package, and the answer is its key set.
`GET /toopo/1.0.3` is a request about one address. `dist-tags.latest` is worse than either: it is a
*pointer*, and it would go on looking correct while meaning something else entirely the day a second
channel exists. Measured at `d8a25ae`, the two are separate keys of the same document and the listing is
independent of every tag:

```
dist-tags:       {"latest":"1.0.2"}
versions listed: ["1.0.0","1.0.1","1.0.2"]
```

### What this puts in the condition, and why it was not free

**It puts a network read in the decision**, on a repository that has spent a unit learning that a reading
taken once says nothing about the next. Three things were weighed and the third is the one that decided
it.

*The staleness fails in one direction only.* The reading is taken minutes before `publish` runs. If npm
gained the version in between, `npm publish` refuses it and the job is red — the same red as the one that
opened this record. What cannot happen is a version being published over, because npm will not accept
one. A stale reading costs a red run and never a wrong archive.

*It is not ADR-0108's failure.* That one was a deployment alias mid-rollout answering two addresses from
two commits, where the client's own refusal was the only observation that decided. Here there is one
address, one document, and one consumer.

*A registry that cannot be read makes the job red — and that state is not new.* The `packaging` step
already installs the built archive, which resolves its one dependency from npm on a runner whose cache is
empty; `packaging/the-archive.ts` names that dependency. So a run whose registry is unreachable is
already a red run, and this job adds no state that was green before. **That argument is conditional and
is written as such**: it holds while the step above needs the network, and the day it stops needing it,
this becomes a new red and somebody should meet this paragraph.

### The consequence nobody asked for, which is the one worth reading

**Moving the trigger onto the version would have quietly repealed the protection that keeps a publication
from being cancelled.** ADR-0109 wrote it into the concurrency block:

```yaml
cancel-in-progress: ${{ github.event_name != 'workflow_dispatch' }}
```

and the comment above it says why — *a cancelled publication is indistinguishable from one that never
happened, for anybody reading the run*. That line exempts the event that publishes. Once publishing
became something a **push** does, the exempt event and the publishing event were no longer the same one,
and a second push to `main` arriving during a publication would have cancelled it.

The old line never became wrong. **It stopped being attached to anything**, which is a failure no reading
of that line can catch, because the line still says what it always said. It is the same shape as an entry
on `CLAUDE.md`'s list outliving its own closure: what moved is not the sentence but the world the
sentence was about.

What replaces it is `github.ref != 'refs/heads/main'`, and the branch is not a preference — it is the
only condition available. **Concurrency is evaluated before any job runs**, so nothing there can know
whether this run will publish: the version has not been read, and the job that reads it has not started.
So every run of `main` is protected, which is a superset of the ones that publish, and the bill is a
duplicated run on the rare second push.

## Consequences

- A publication is a push, and the deliberate act is the version number.
- The failure that opened this record cannot recur: a publication cannot be asked for without the number
  having moved, because the number is what asks.
- The manifest and the registry cannot drift apart unnoticed. The first push of `main` after a version
  moves is the publication, so *what this repository declares* and *what people receive* are the same
  string or a run is in flight.
- `main` is no longer cancellable. Two pushes in quick succession now cost two full runs.
- Publishing is one job further from a person: a green matrix, a branch policy, and a number.
- Re-running a run whose publication failed for a transient reason now works and publishes. Re-running
  one whose publication succeeded is red on the version, which is the correct answer to that request.

## Confirmation

**Two suites, and they are not of the same strength.**

`the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version` is under `meta`, which by
ADR-0001's own division makes it a guard that *runs* rather than one shown to catch something — no
battery injects into `mutation/`. It resolves the gate in both directions, and both ends are checked
because either alone is green on a repository that publishes on nothing: an `if` naming a job that does
not exist evaluates to an empty string, and a `needs` no condition reads is an answer thrown away.

The six in `packaging/what-npm-holds.test.ts` are under a battery and are measured. **None of them opens
a socket**, which is the whole shape of that file: a guard reaching the live registry could not be
replayed and would put another suite's verdicts behind somebody else's uptime, which is why
`packaging/against-the-origin/` is a folder of its own. The refusals are where the module can be wrong,
so an answer is handed to it instead of a network. Every one was seen red on its own condition before
this record was written, and the one that matters is
`a-reader-that-could-not-read-is-refused-and-never-read-as-emptiness`: not knowing what npm holds and
knowing it holds nothing are the same value if a refusal is read as an empty set, and they decide
opposite things.

**What none of them establishes.** That npm's answer is true. That the condition in the file is the only
arm — an `||` added to that expression would bypass the version and every guard here would stay green,
which is the class ADR-0109 already argues about a gate living in a file a branch may rewrite. And that
the five identical readings taken while writing this are a population: they are five reads from one
machine at one moment, and ADR-0108's lesson applies to them exactly as it applies to anything else.

## What would reopen this

- **A second channel.** Publishing a prerelease under a tag other than `latest` is still one version in
  the listing, so the mechanism holds — but *which* version a push should publish stops being *the one in
  the manifest*, and that is a question this has no answer for.
- **The `packaging` step ceasing to need the network**, which would make an unreachable registry a new
  red rather than an existing one, and would owe the paragraph above a fresh argument.
- **A second person who can push to `main`.** The gap between deciding a version and it being live is now
  one push; with two people it is also one push, made by somebody who may not have decided it.
- **npm allowing a version to be republished**, which would make *not held* stop implying *safe to
  publish*.
- **A publication that must be made from a tree that is not `main`**, which is what would send this back
  to a trigger somebody operates.

## More Information

- [ADR-0109](0109-the-publication-holds-no-credential.md) — the credential, the environment, and the
  dispatch this replaces.
- [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) — why the manifest's version and an
  implementation's version are separate strings.
- [ADR-0108](0108-the-observation-that-decides-is-the-clients.md) — the reading that decides, and why one
  agreement says nothing about the next.
- [npm registry API](https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md) —
  the two documents served at one address, and the header that chooses between them.
