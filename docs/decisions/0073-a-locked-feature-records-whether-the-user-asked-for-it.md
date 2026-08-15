---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/implementation-record.ts
confirmed-by:
  - battery: cli-update
    guard: only-the-feature-that-was-asked-for-is-a-root
  - battery: cli-update
    guard: a-feature-pulled-in-and-then-asked-for-becomes-a-root
  - battery: cli-update
    guard: a-root-stays-one-when-something-else-pulls-it-in
  - battery: cli-update
    guard: every-installed-feature-is-named-with-whether-it-was-asked-for
---

# A locked feature records whether the user asked for it

## Context and Problem Statement

True when the user typed this feature's name, false when it arrived through an edge. Without it the
lockfile is a flat set of features with no root, and an update has two ways to guess which of them to
resolve from — both of which are wrong, each for its own reason.

## Considered Options

- Treat every locked entry as a root.
- Derive the roots from what no other locked feature depends on.
- Record what the user asked for, at the moment they ask.

## Decision Outcome

**The second finding this file owes to a consumer, and it is `toopo update`'s.** Without it the
lockfile is a flat set of features with no root, and an update has two ways to guess which of them to
resolve from — both of which are wrong, each for its own reason.

Treating every entry as a root resolves a *dependency* independently, so it climbs to whatever version
its own binding names today rather than to the one its dependent was published against — and the
project ends up holding a combination nobody ever published. Deriving the roots instead from "what no
other locked feature depends on" reads the edges as they are *now*, which is precisely what an update
is trying to find out has moved; and it gets the ordinary case wrong anyway, because a `string/pad`
that was installed directly *and* is pulled in by `number/round` would never again be updated on its
own.

So it is not derivable, and an absent field would produce an unpublished combination rather than a
missing convenience. It is **sticky towards true**: a feature that arrived as a dependency and is later
asked for by name becomes a root and stays one, because the user has said they want it, and nothing an
upstream graph does afterwards unsays that.

## Consequences

It is a fact about an intention, which is why nothing can derive it: the graph records what imports
what, and no arrangement of edges records what a person typed. Adding it moved the lockfile's own
version, which is [ADR-0074](0074-the-lockfile-version-moves-when-its-shape-moves.md).

## Confirmation

`only-the-feature-that-was-asked-for-is-a-root` establishes the ordinary case;
`a-feature-pulled-in-and-then-asked-for-becomes-a-root` and
`a-root-stays-one-when-something-else-pulls-it-in` establish stickiness in both directions; and
`every-installed-feature-is-named-with-whether-it-was-asked-for` establishes that no entry is written
without it.

## What would reopen this

A command that removes a root without removing the feature, which would make *sticky towards true*
into a state a user cannot get out of. `toopo remove` answers that today by removing the entry.

## More Information

- [ADR-0034](0034-what-an-update-is-and-what-it-will-not-do.md) — the command this field was found by.
- [ADR-0072](0072-the-lockfile-is-a-projection-of-the-registry-vocabulary.md) — the record this field
  belongs to.
