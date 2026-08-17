---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - packages/registry/snapshot.ts
  - packages/registry/rebinding.ts
  - packages/registry/local-read-api.ts
confirmed-by:
  - battery: registry-storage
    guard: a-binding-whose-digest-moved-since-its-publication-is-refused
  - battery: registry-storage
    guard: a-binding-that-still-hashes-to-what-it-was-published-as-is-accepted
  - battery: registry-storage
    guard: a-standing-change-rebinds-nothing
  - battery: registry-storage
    guard: a-binding-published-from-a-commit-that-binds-no-such-address-is-refused
  - battery: registry-storage
    guard: a-binding-that-names-no-commit-is-not-asked-about
  - battery: registry-storage
    guard: the-past-is-read-once-per-commit-however-many-bindings-share-it
  - battery: registry-storage
    guard: the-five-anchor-a-commit-and-the-check-reaches-all-of-them
  - battery: registry-storage
    guard: two-bindings-that-render-alike-are-a-corrupt-ledger
---

# A binding records the commit it was published from, and the past is rebuilt rather than recorded

## Context and Problem Statement

Permanent rule 6 says a published version is frozen for life, and `AlreadyPublished` says it at length:
*rebinding an address is the one operation this storage exists to refuse — every lockfile that ever
recorded this digest would silently start resolving to other bytes.*

That refusal has no memory between two runs. Three callers build the ledger by walking the sources, at
every launch, and no tracked file carries a published digest. So somebody edits a published contract,
relaunches, the ledger is rebuilt with a new digest, and nothing anywhere notices: the registry does not
*rebind* the address, it forgets the address was ever bound.

It is the class `CLAUDE.md` names `one-directional` — a thing that behaves like a rule with nothing
making it hold — and it is harmless today because no contract is `published`, and unrecoverable the
first time one is.

### The reach of it, measured on a commit already in the history

`string/slugify@1`'s frozen digest moved between `03a468b` and `d116fe9`:

```
03a468b   8bea4012754af625ac35b2a1283dbbc2e54e276df9a107133d82cc3e7a9feadf
d116fe9   8753bb972e614de3bdb6a4c27cd227d0a6bdc617c5ba5c6c5eabb392a23a78a1
```

The whole of what moved is `5965079`, *docs: the threshold is reformulated, three rules leave their
files, and twenty-one citations are repaired*, on one line of one comment:

```diff
--- a/contracts/typescript/string/slugify/properties.test.ts
-  * `mutants.ts` records that a rate reproduced this way is good to an order of magnitude, so a repair
+  * ADR-0077 records that a rate reproduced this way is good to an order of magnitude, so a repair
```

`properties.test.ts` is one of `THE_SEVEN_FILES`, `harnessOf` hashes it, `FrozenContract.harness`
carries the hash, and the snapshot digest covers it. **Had that contract been published, a `docs:`
commit would have rebound its address.**

### What is legitimate, which is narrower than it reads

Measured in a checkout, one perturbation at a time, on `string/slugify@1` at `d116fe9`:

```
8753bb972e614de3…  untouched
8753bb972e614de3…  lifecycle -> published
c0f92cc42d8988cc…  one word in one comment of properties.test.ts
8753bb972e614de3…  restored
```

A standing change is free, because `lifecycle` is the one `CONTRACT_STANDING_FIELD` and the projection
omits it. Prose *outside* the seven declared files is free, because nothing outside them reaches the
digest. **Prose inside them is not free, and must not be**: a comment in a contract folder is not inert.
Thirteen `@ts-expect-error` directives live in the five contracts' `signature.test-d.ts`, and a snapshot
that excluded comments would let somebody weaken a signature guard on a published contract — add a
directive, let a case that had to fail pass — without moving a bit of the digest. An exclusion for
*directives only* would need a list of directives, and a list TypeScript can extend is one that will be
incomplete one day with nobody knowing.

## Considered Options

- A committed ledger file, compared against the ledger rebuilt from the sources.
- The publication commit recorded on `Lifecycle`, and the frozen half recomputed there.
- The publication commit recorded on the ledger binding, and the frozen half recomputed there.

## Decision Outcome

Chosen: **`publishedFrom` on `PublishedContract` and on `PublishedImplementation`, required, and the
past obtained by checking that commit out and asking it what it bound.**

### Why the ledger and not the lifecycle

`refuseRebinding` — *an address is bound to a digest exactly once, for ever* — lives in the ledger, so
the memory it lacks belongs there too. These two types exist only for what is published, so the field is
**required**: there is no shape in which a binding omits the coordinate that makes its own freeze
checkable, no fourth `Lifecycle` arm, and no `FIELD_MAP` entry to justify as unfilled.

It sits beside `publishedAt` because they answer two questions about one event — the clock says when
somebody decided, the commit says what they decided about — and neither may enter a snapshot, for the
reason `snapshot.ts` already gives about the clock: a digest that moved with either would make *the same
content produces the same digest* false by construction.

The field is written once for both units because `refuseRebinding` is. A memory built for contracts
alone would be half a mechanism under a rule written whole.

### Why it is not served

`ServedContractBinding` already carries a revision-shaped field — `servedFrom`,
[ADR-0090](0090-a-revision-belongs-to-the-named-half.md)'s, *a fact about an answer and never about an
artefact*. This one is the opposite: a fact about the artefact and not about the answer. Two of them on
one named answer, distinguished by nothing a reader can see, is a confusion worth more than the field is
worth to a client that does nothing with it. The freeze check asks `theLocalLedger` instead, which is the
only thing of `gather()` that leaves that module.

### Why the past is rebuilt rather than recorded

A committed ledger file was the cheaper option and is refused. It is not the transcription this
repository usually refuses — it would be *the ledger*, two independent statements whose disagreement is
the guard, which is the shape `FIELD_MAP` and `publicContract` already take. What decides against it is
that a recorded digest is repaired by the same hand and in the same commit as the change it was meant to
refuse, and nothing about the file would look wrong afterwards. A recomputed digest cannot be edited into
agreement: to silence it somebody has to move the coordinate forward, which is a re-publication with the
timestamp and the binding moving too. [ADR-0043](0043-derive-the-sentence-from-the-fact.md)'s rule, on
the one claim in this repository that is frozen for life.

It buys a second thing for nothing. ADR-0090's durability promise is that a reader who kept a revision
can rebuild the registry at it; a check that rebuilds is a check that notices the day that stops being
true.

### The commit answers for itself, because a path does not survive

Measured: `packages/registry/serialise.ts` does not exist at `HEAD~60`, where the folder was `registry/`.
A probe written today addresses nothing in a tree from before that move, so *recomputable at any time* is
false for this repository's own history if the reader reaches in by path.

So what is asked for is a **script name** in the commit's own `package.json` — `npm run ledger` — and
where that commit keeps its registry is its own business. The debt this leaves is that the mechanism
reaches back only to the commit introducing it, and it costs nothing: nothing is published, so no
publication can predate the check.

The remaining coupling is the line format the two processes agree on, decided by the *older* commit. It
is an address, a tab and a digest, chosen to be the least a format can be; a reader that cannot parse a
line refuses it rather than interpreting it.

## Consequences

**Publishing becomes a deliberate act, and the consequence is written where somebody is about to take
it.** A published contract is finished: every byte of its seven declared files is frozen, comments
included, and a repair costs `name@2` beside it rather than in place of it. That sentence lives on
`publishContract` itself, not only here, because a record nobody opens at the right moment is one that
was not read.

**The list of what this repository declares and nothing keeps had never named this.** Ten entries, the
oldest of them older than three hundred commits, and the section exists for exactly this class — yet the
biggest `one-directional` declaration in the repository, the one permanent rule 6 states, was not on it.
A list that believes itself exhaustive is more dangerous than no list, because it is read as coverage.
That is the finding this unit leaves to whoever keeps the list next, and it is recorded in `CLAUDE.md`
beside the list rather than only here.

## Confirmation

The eight guards above are over the rule with the past supplied, so that the comparison and the
rebuilding fail apart: a guard covering both would have nothing to say the day they disagree. Two of
them are the pair that keeps the rule honest in both directions — a moved digest is refused, an unmoved
one is accepted — and inverting one comparison in `faultFor` reddens four:

```
faultFor comparing !== instead of ===
  a-binding-whose-digest-moved-since-its-publication-is-refused      expected [] to have a length of 1
  a-binding-that-still-hashes-to-what-it-was-published-as-is-accepted expected [ Array(1) ] to equal []
  a-standing-change-rebinds-nothing                                   expected [ Array(1) ] to equal []
  the-past-is-read-once-per-commit-however-many-bindings-share-it     expected [ …(2) ] to equal []
```

`the-five-anchor-nothing-and-the-check-says-which` is the one that matters most and it is not a
convenience. No contract of the five is published, so every fault list above is computed over nothing in
this repository — which is the shape of a check that goes green for ever and is read by nobody until the
day it was needed. So the emptiness is asserted from the other side: every binding this working tree
mints is named as one the check cannot reach. It reddens the day somebody publishes, which is the day
the other eight stop being vacuous and the day the sentence on `publishContract` has to be read.

**That day was 2026-08-17, and the paragraph above is left exactly as it was written.**
[ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) published the catalogue, the guard reddened
on the event its own comment had named, and the pair above now cites its successor —
`the-five-anchor-a-commit-and-the-check-reaches-all-of-them`, which asserts the inverse over the same
population. Nothing here is corrected, because nothing here was wrong: a guard that writes down in
advance the event which will falsify it, and is then falsified by exactly that event, is the strongest
thing this repository can show about its own discipline, and rewriting the prediction after the fact
would be throwing away the only copy of it.

## What would reopen this

- **A publication.** Everything here is measured on a repository where nothing is published; the first
  real binding is the first time the reader is asked about a commit somebody else made.
- **A registry that is not this repository.** `bindingsAtRevision` asks git because the registry *is* a
  git repository today; a published service with its own store would name its published state some other
  way, and `publishedFrom` would stop being a commit while staying the same field.
- **A client with a use for the coordinate.** The field is unserved because nothing consumes it. A
  reader who wanted to rebuild the registry a lockfile was resolved against would be the argument for
  putting it on the named answer, and the confusion with `servedFrom` would then have to be settled in
  public rather than avoided.
- **A second entry point.** `npm run ledger` is the only coordinate a past commit is reached through, and
  a second one would have to be shown to arrive through the same refusal rather than beside it.

## More Information

- [ADR-0007](0007-four-lifecycle-states.md) — why `absorbed-by-the-language` is a state entered after
  publication, which is what makes a standing change something the check must let through.
- [ADR-0043](0043-derive-the-sentence-from-the-fact.md) — a sentence that cannot be false is worth more
  than a sentence somebody checked.
- [ADR-0090](0090-a-revision-belongs-to-the-named-half.md) — the other revision-shaped field, and why
  this one is not it.
