---
status: accepted
date: 2026-08-17
decision-makers: Mathis Perron
governs:
  - packages/cli/resolve.ts
  - .github/workflows/suites.yml
confirmed-by:
  - battery: origin
    guard: an-archive-installs-a-feature-into-a-project-that-was-never-configured
  - battery: origin
    guard: the-bytes-installed-are-the-bytes-the-digest-names
  - battery: origin
    guard: the-lockfile-an-archive-writes-records-the-digest-the-registry-served
  - battery: cli-install
    guard: two-named-answers-from-two-revisions-refuse-the-install
---

# The observation that decides is the client's, because the client is the thing being measured

## Context and Problem Statement

The proof against the origin is the last thing that runs before anything is published. It failed at
`70bb31c` on three of its four guards, with the installed client's own refusal:

```
the registry answered this from more than one revision - the catalogue index from
70bb31c…, the implementations 1a8e562…
```

`toopo add` is right to refuse that: a lockfile stamped with one revision while the other answer came
from somewhere else records a state that never served the install.
[ADR-0104](0104-the-proof-against-the-origin-lives-where-nothing-replays-it.md) already knew this
could happen and had a pre-flight against it — `anOriginThatAgreesWithItself`, which asked the origin
the same two questions and waited, bounded by `THE_PROPAGATION_BOUND`, until one revision came back.

**The pre-flight did not fire.** Its waiting line appears in neither of that commit's two run logs, so
the bound was never consumed: it read one revision on its first attempt and returned. Seconds later the
client read two.

## What was measured

**The failure is intermittent and it is not rare.** Two runs of the same commit, no change between
them: one red, one green.

**The cause is the alias and not a cache.** Cloudflare Pages gives every deployment an atomic
hash-based address and updates a *branch alias* to point at the newest one; `https://toopo.dev` is that
alias. Measured on the three addresses this suite reads: `CF-Cache-Status: DYNAMIC` on all of them, so
nothing was being served from an edge cache. What differs between two requests is which side of the
alias update answers them.

**The window is small and was measured rather than estimated.** The whole failing step ran in seven
seconds, so the reasoning that the gap was the pack-and-install is wrong; the gap is however long it
takes to make the next request.

## Considered Options

- Widen the pre-flight to the addresses the chain reads. **Refused: the population was already right.**
  The two addresses that disagreed are the two the pre-flight asks about. Nothing about coverage
  explains the failure.
- Force freshness with a request header. **Refused: nothing was cached.** `DYNAMIC` on every address
  says the responses came from the origin, so there is no cache to bypass.
- Pin the requests to an atomic per-deployment address. **Refused on what the proof is for.** The
  hash-based address is atomic and would remove the race, and it is not the address a user types. A
  proof against a URL nobody installs from proves the wrong thing.
- Require the pre-flight to observe agreement more than once. **Refused as a probability and not a
  mechanism.** It lowers the chance without changing the shape: still an observation here standing in
  for a reading made elsewhere.
- **Retry the chain itself, bounded, on the client's own refusal.**

## Decision Outcome

Chosen: **the pre-flight is deleted and the chain is retried, bounded, whenever the installed client
refuses because the origin answered from more than one revision.**

**An agreement observed on one reading says nothing about the next reading.** The two are separate
requests and a rollout can move between them. No wait written in this suite can fix that, because the
reads that decide are made by a *different process* — the installed `toopo` — and no observation taken
here is that observation. It is the same shape as `assertWholeSuiteRan` comparing a total against a
total: a condition derived from one reading, standing in for a property of another.

So the only observation that reports the state of the origin at the instant that matters is the
client's, and the client publishes it as a refusal. That refusal is what drives the retry.

**One mechanism and not two.** The pre-flight is removed rather than kept as a cheap filter: two
mechanisms over one fault have nothing to say on the day they disagree, and this one had already spent
a run saying nothing at all.

**The archive is packed and installed once.** A refusal writes nothing — the client's two-phase write
is what makes that true, and `two-named-answers-from-two-revisions-refuse-the-install` asserts that no
lockfile appears — so what a retry costs is one reading and one process spawn, not an install.

### Why the clause is imported and not matched by hand

`A_REGISTRY_PUBLISHING_BETWEEN_TWO_REQUESTS` is now exported by `packages/cli/resolve.ts`, which
authors the sentence. Two readers outside that module have to recognise the refusal by sight and both
were quoting it. **The one that would drift silently is this retry**: a reworded refusal would stop
matching, the retry would stop firing, and the suite would go back to failing intermittently with
nothing to say why. Importing makes that a build failure instead.

## Consequences

**A red on this suite means one of three things and the log says which**, as before — the origin never
answered, it went away mid-run, or the chain failed with the origin reachable. What changed is that the
third arm no longer swallows a rollout: a chain stopped by a mid-rollout origin is retried, and only a
chain still stopped after two minutes is reported as the product.

**A registry that is genuinely inconsistent is still a red, and that is what the bound is for.**

**What is deliberately not classified**, named rather than left to look covered: a rollout that makes
one of the two requests *this suite* makes answer 404 — a binding whose digest names a snapshot the
other side of the alias does not hold — arrives as a thrown error rather than as the client's refusal,
and is reported as the product. It has not been observed. The retry condition is where it belongs if it
ever is.

## Confirmation

Two perturbations at the boundary the classifier reads — the client's own output — with the live origin
and a real archive, and the bound left at its declared two minutes.

**A client that always refuses mid-rollout: waited, bounded, still red.** 21 waiting lines, 123 seconds
elapsed, three guards failed. A registry that never stops disagreeing does not become a green.

**A client that fails for any other reason: red at once.** 5 seconds elapsed, **zero** waiting lines,
the three guards failing with the client's own message. A real failure is not waited on, which is the
half that would be easy to lose.

**And the condition that produced the original red no longer produces it — stated as what it is.** The
transient cannot be summoned on demand, so what is offered is a count and not a proof: with the
pre-flight, two runs of `70bb31c` gave one red and one green; with the retry, the runs recorded in the
commit that carries this record were green. An intermittent fault is not demonstrated absent by any
number of green runs, and this record claims only that the mechanism which failed has been replaced by
one whose two failure modes were each seen.

## What would reopen this

- **A 404 during a rollout**, which is the arm named above as unclassified.
- **A rollout longer than two minutes**, which would make the bound the thing to measure — and the
  retry now holds the two timestamps that would measure it.
- **An origin that is not a Cloudflare Pages alias.** The mechanism here is that alias's update, and a
  different host makes the argument, not only the figure, something to re-take.

## More Information

- [ADR-0104](0104-the-proof-against-the-origin-lives-where-nothing-replays-it.md) — the suite this
  repairs, and why it lives where nothing replays it.
- [ADR-0091](0091-the-lockfile-records-the-revision-it-was-resolved-against.md) — why a client refuses
  two revisions at all.
