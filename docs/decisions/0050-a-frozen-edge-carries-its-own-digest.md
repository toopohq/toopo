---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/snapshot.ts
  - packages/cli/resolve.ts
confirmed-by:
  - battery: cli-install
    guard: an-edge-whose-digest-names-another-artefact-is-refused
  - battery: cli-install
    guard: an-edge-the-registry-does-not-hold-is-refused
  - battery: cli-install
    guard: two-edges-naming-one-address-at-two-digests-are-refused
  - battery: registry-storage
    guard: an-address-is-bound-once-and-for-ever
---

# A frozen edge carries the digest of what it names

## Context and Problem Statement

A client walking a dependency graph learned each edge's digest by asking `implementation-bindings` which
digest that address resolves to — a *named* answer, one per contract in the closure, believed rather
than checked.

## Considered Options

- Keep the edge as an address, and resolve it through the bindings.
- Carry the digest of the snapshot inside the edge.

## Decision Outcome

**An edge carries the digest of the snapshot it names, and the field is not the unit.** Before it, a
client walking a dependency graph learned each edge's digest by asking `implementation-bindings` which
digest that address resolves to — a *named* answer, one per contract in the closure, believed rather
than checked. The digest makes the step arithmetic. Measured on the imagined graph, which is **the only
thing in this repository that has edges** — the four published contracts have none, and no figure here
comes from them:

```
toopo add number/round, depth 2      before   after
  round trips                            8        6
  requests in all                       14       11
  named answers, which are believed      5        2
    of which implementationBindings      4        1
  content-addressed, checkable           9        9
  round trips spent on a binding         3        1
```

**And the unit is the guard, because the saving and the check were the same call.** `gatherHoldings`
found an edge's digest by looking its `id` and `version` up in the bindings, so *the identity of what
arrived fell out of that lookup* — and that lookup is exactly the round trip the digest removes.
Shipping the field without putting a check back would have moved the belief from a named answer onto an
edge and verified neither, in the unit whose own prose announces the opposite. That is the class this
project exists to prevent, introduced by the change meant to close it.

**One rule for both doors rather than one guard each.** `heldAt` compares every snapshot it fetches
against the address it was fetched *for*, through `declarationFaults` — root and edge alike. The root
half is older and was open before this unit: a binding names a digest, and nothing checked that the
artefact at it was the one asked for. It is *latent* rather than live, because `localSource` and
`packagedSource` look an answer up by its digest in a map keyed on that digest, so no local registry can
answer one address with another artefact. It goes live the day a source is remote — the distribution
unit — so this closes it before the door it would arrive through is opened.

**What the check buys was measured, and it is not what it was written believing.** Over the six
substitutions the imagined graph can express — three at a root binding, three at an edge — taking it out
leaves **five of six refused anyway**, downstream, under *typescript/string/pad@1/reference@1.0.0 cannot
be resolved, and the registry holds no such published implementation* and *typescript/number/sign@1
publishes no reference.ts*, of contracts this registry publishes and serves. **So the repair is a
refusal that names the fact instead of one that names a cause no measurement establishes**, which is
this repository's own worst class rather than a silent wrong install. The claim was corrected in the
guard's own comment before it was published, which is what a red is for.

**The sixth was silent, and it was found by running all six rather than by reading the loop.** An edge
naming an address another edge had already resolved was skipped, digest and all: with `number/sign@1`
published naming `string/pad@1` at `number/clamp@1`'s digest, the honest edge arrived first and the
install answered five correct files. **The right artefact landed because of the order the walk happened
to take.** It is not registry hygiene — `number/sign@1` had been published against code the project was
not getting, which is *a combination nobody published*, the thing `reconcile.ts` already refuses to
assemble one version at a time. `gatherHoldings` compares now, and roots arrive with the digest they
were fetched by so that an edge naming a root is compared like any other.

**A type of its own, and the byte figure is what decided it.** `ImplementationAddress` is also
`ServedImplementationBinding.address`, where a `digest` field already sits beside it, so widening it
would write one fact twice into a served body. The wrapper costs **95 bytes per edge** against the 76 a
flattened form would cost: 76 is `"digest":"<64 hex>"` and its comma, and the remaining 19 are
`"implementation":` and the braces round the nested address. Measured: **+20.2 % over the graph, +26.0 %
over the three snapshots that carry an edge, and +0.0 % over the five.** It is the arbitration
`renderContract` already took at 0.68 % and `licence.ts` refused at +52 %, landing on the paying side of
both.

**`edgeTo` is the only way to build one, and it reads the digest off the artefact it points at.** There
is no shape that lets a caller supply a digest, so a lying edge is unconstructible here rather than
forbidden by a sentence — *make the omission impossible*, on the field whose being wrong installs
another feature under the right name. `referenceAt` went with it: it was the way to write an edge by
hand, and leaving it would have left the door beside the lock.

## Consequences

**And that closed a fixture rather than only a hole, which the replay found and no reading had.**
`sourceWithTwoVersionsOfPad` swapped one record into `HOLDINGS` and served the rest unchanged. That
worked while an edge named only an address — `number/round@1` resolved `number/clamp@1` by name whatever
that clamp had become. An edge pins the snapshot, so a clamp carrying a different dependency is a
different artefact with a different digest, and the round naming the old one names something the source
no longer serves. **Replacing what an address resolves to while keeping its version is the rebinding
permanent rule 6 refuses, and it stopped being expressible in a fixture on the day edges became
verifiable.** What replaces it is what a registry would really publish: a clamp against the newer pad,
and a round published against that clamp. The instrument said so in the one line it has for it —
`C-04: expected killed, measured killed — no longer caught by …` — which is the shape this repository
already records as costing more than a silence, saying something true for once.

**Two published sentences were false and are repaired.** `endpoints.ts` said of implementation bindings
that *nothing here is checkable, and every field of it is an opinion*; the (contract, implementation,
version) → digest association is bound for life by `refuseRebinding`. And `RESOLUTION_IS_THE_CLIENTS`
promised a client *can verify every step*, which the edge → digest step made false for as long as the
field has existed. It now names the one belief that remains rather than counting it — that the name a
reader started from is bound to the digest this registry says it is — which makes the closure **a Merkle
tree with one root of trust**, the shape an OCI manifest and Go's module graph already have.

**The obvious repair for the first was refused by measurement, and the one that replaced it has a
precedent.** A third member of `AddressingClass` cannot exist: the class is per *response*, it decides
the cache policy, and **two of the five named answers carry frozen and revisable fields in one body** —
a `digest` and a `publishedAt` beside a `lifecycle`, a `status`, a set of benchmarks and a tag list. A
body carrying one revisable field must be revalidated whatever else it carries, so `named` is right
about both bindings and would stay right if a third member existed. What is buildable is per *field*:
13 entries over 2 types, keyed by `keyof`, so a field added does not compile until somebody says which
of the three it is. `StandingField` is the same mechanism one floor down, on records, and
`snapshot.test.ts` already requires it to partition one exactly. The repaired sentence reads the
revisable half off the map rather than listing it.

**`LOCKFILE_VERSION` does not move, and it was checked rather than assumed.** `FIELDS_OF` is total over
`keyof LockedFeature`, no field of it carries an edge, and `InstalledFile.served` is an unchanged
`HarnessFile`. A lockfile format that moves is a decision, not a consequence.

**This is the last irreversible thing.** Every installation writes digests into somebody else's
`toopo.lock`, and a snapshot's canonical text is what its published digest covers — so adding a field to
a frozen edge after publication changes every digest, which the storage refuses by construction, and the
only way out would be two formats served for ever. Nothing after this unit is unrecoverable.

## Confirmation

Three guards over the edge — an edge whose digest names another artefact, an edge the registry does not
hold, and two edges naming one address at two digests — and one over the root half, which is the
binding that is bound once and for ever.

## What would reopen this

A remote source, which is what makes the latent half live. That is
[ADR-0051](0051-what-a-registry-over-a-wire-costs.md), and the check was put in before the door was
opened rather than after.

## More Information

- [ADR-0051](0051-what-a-registry-over-a-wire-costs.md) — the port these edges are walked over.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
