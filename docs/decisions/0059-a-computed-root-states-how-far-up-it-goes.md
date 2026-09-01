---
status: accepted
date: 2026-08-15
governs:
  - mutation/paths.ts
  - packages/registry/serialise.ts
confirmed-by: []
---

# A computed root states how far up it goes, and what it goes up from

## Context and Problem Statement

A repository root written `join(import.meta.dirname, '..')` contains no path literal. A folder that
gains a level breaks it, and nothing that greps for paths, imports or globs can see it coming.

It was found by `packages/validation`'s two guards failing on a `tsconfig.json` one directory out of
reach — seven reds, after the same class had already been foreseen and repaired one commit earlier in
`serialise.ts`, which is what made it a class rather than a repair.

## Considered Options

- Repair each site as it breaks.
- Sweep the class, and require a computed root to state its own arithmetic.

## Decision Outcome

**It is a class and not a list of sites, and it is invisible to every search a move is planned with.**
A repository root written `join(import.meta.dirname, '..')` or `dirname(import.meta.dirname)` contains
no path literal, so a folder that gains a level breaks it and nothing that greps for paths, imports or
globs can see it coming. It was found by `packages/validation`'s two guards failing on a
`tsconfig.json` one directory out of reach — seven reds, after the same class had already been
foreseen and repaired one commit earlier in `serialise.ts`, which is what made it a class rather than
a repair.

**Ten sites, with the verdict each one got**, because a swept class is worth what its enumeration is
worth. Correct untouched, the folder having stayed at the root: `packaging/the-archive.ts`,
`packaging/build.ts`, `packaging/archive.test.ts`, and `mutation/paths.ts`. Repaired to two levels:
`packages/registry/serialise.ts`, `packages/validation/source.test.ts`,
`packages/validation/the-catalogue.test.ts`, `packages/site/build.ts`, `packages/site/playground.test.ts`.
And one that was correct *because it was not about the source tree at all*:
`packages/cli/published.ts` resolved the archive's artefact at
`join(import.meta.dirname, '..', ARTEFACT_FILE)`, which is a fact about the compiled layout under
`dist/` — it survived because `packaging/tsconfig.dist.json` moved its `rootDir` to `../packages` and
kept `dist/packages/cli/published.js` where it was.

**The rule the eleventh needs: a computed root states how far up it is going, and what it is going up
from.** The distinction `published.ts` embodied is the one that matters — a walk over the *source* tree
and a walk over the *emitted* tree are two different facts that look identical, and only one of them
moves when a folder does.

**That tenth site no longer exists**, and it is kept here as the clearest example the sweep produced
rather than edited out. [ADR-0092](0092-the-catalogue-leaves-the-archive.md) took the artefact out of
the archive, so `published.ts` computes no root at all now — it names an origin — and this record
stopped governing it in the same change.

## Consequences

**Two neighbouring forms were found in the same sweep and neither is this one.** A path held as
segments — `join(REPOSITORY_ROOT, 'contracts', 'date', 'add', 'reference.ts')` — is invisible to a
path-shaped search for the same reason and is repaired the same way. And a dynamic
`await import('../registry/emit.ts')` is not a `from` clause, so a rule anchored on `from '` walks
past it; `packaging/build.ts` holds three and `packages/site/build.ts` held two, all written dynamically
because the hook that translates a `.js` specifier cannot be used before it is registered.

## Confirmation

Nothing guards this, and the honest statement is that the class was found by seven reds rather than by
a mechanism. What a guard could hold — that every computed root resolves to a directory that exists —
is true of a broken one too, since `join(dirname, '..')` from two levels down is a real directory that
is simply the wrong one.

What is kept instead is the arithmetic being written down at each site, so that a reader moving a
folder can check it by reading rather than by running.

## What would reopen this

A third kind of tree — a published tree, a cache — whose walk looks identical to the other two. The
distinction this record is built on is between the source tree and the emitted tree, and a third would
have to be named beside them.

## More Information

- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
