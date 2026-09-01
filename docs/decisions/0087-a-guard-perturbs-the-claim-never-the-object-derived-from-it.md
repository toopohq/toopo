---
status: accepted
date: 2026-08-15
governs:
  - packages/catalogue/every-contract.ts
confirmed-by: []
---

# A guard perturbs the claim, never the object derived from it

## Context and Problem Statement

A guard perturbs the claim, never the object derived from it. The two instances are ten units apart and
share no subject, which is what makes this a rule rather than an anecdote.

## Considered Options

- Treat each instance as a local mistake in the guard that had it.
- State it as a rule, on the evidence that two unrelated units produced the same shape.

## Decision Outcome

`number/parse@1` wrote a property over `!result.ok`. The value it perturbed was the one the answer had
already been derived into, so the property held for any implementation that derived it consistently —
including a wrong one. It tested that a projection was a projection.

The registry's storage wrote a guard that perturbed a *snapshot* field and required the digest to move.
That establishes only that the digest covers what the projection already holds, which is true of every
projection including one with a hole in it. Measured: a mutant that dropped the harness digests out of
the projection passed it. Perturbing the *record* asks the question the guard exists for — can this
contract change without its digest changing — and the mutant dies.

The shape is the same both times. Something is derived, and a guard is written over the derived thing
because that is what the code has to hand. What it then proves is that the derivation is
self-consistent, which no defect this catalogue cares about would violate. The claim is always upstream
of the derivation, and that is where a perturbation has to go in.

`expectUniversalPropertiesAnswered` is the same rule, applied once, to one guard: the inapplicable list
is passed in rather than computed, because deriving it from the array it checks would compare that array
with itself. This is that sentence generalised, after it was needed twice more.

## Consequences

This is a rule about how a guard is written rather than a decision about one guard, so it is stated in
`CLAUDE.md` under *Verification discipline* and argued here. It is the cheapest test in this repository
for a guard that cannot fail: find what the guard perturbs, and ask whether that thing is the claim or
something computed from it.

## Confirmation

Nothing guards it, and the reason is the rule's own shape: a guard that perturbs the wrong thing passes,
which is exactly why no assertion can catch one. What found both instances was a mutant surviving, and
what keeps the rule is that it is now written where a guard is being written.

## What would reopen this

A third instance whose claim and derivation cannot be told apart — where the thing the code has to hand
*is* the claim. Neither of the two was like that, and a third that was would narrow the rule rather than
break it.

## More Information

- [ADR-0021](0021-a-property-settles-what-its-alphabet-represents.md) — what a property settles, which
  is what a perturbation has to reach.
- [ADR-0043](0043-derive-the-sentence-from-the-fact.md) — the same distinction between a claim and
  something computed beside it, on prose rather than on a guard.
