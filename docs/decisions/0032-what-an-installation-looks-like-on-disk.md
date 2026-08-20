---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/plan.ts
confirmed-by:
  - battery: cli-install
    guard: an-entry-file-is-named-after-its-feature
  - battery: cli-install
    guard: every-contract-of-the-catalogue-installs-one-file-named-after-itself
  - battery: cli-install
    guard: the-graph-lands-as-a-tree-of-features
  - battery: cli-install
    guard: an-entry-file-is-never-deduplicated
---

# What an installation looks like on disk

> **The layout decided here has been superseded by
> [ADR-0110](0110-a-feature-lands-as-a-file-and-its-folder-sits-beside-it.md), and not on the trigger
> this record named.** *What would reopen this* said: a second file in any reference implementation.
> Nothing produced one — a reader saw the name written twice in `string/slugify/slugify.ts` instead. An
> entry file now lands at `<domain>/<name>.ts` with its folder beside it rather than around it, which
> keeps this record's own requirement — *an entry file's path never moves* — on the day a feature gains
> a second file, where this layout kept it by paying a level of nesting on every feature that never
> will.
>
> **The reasoning below is left as it was written**, because it is the argument the replacement is
> built on rather than one that turned out wrong: the two measured lines about `x.js` and `x/index.js`
> are still true, and it is what they were used to conclude that moved. What is still decided here and
> still ruled: the entry file named after its feature rather than `reference.ts`, the shared file
> recognised by digest with the entry exempt, the two digests in the lockfile, and the refusal of a
> setting with one possible value. The `0.0.0-local` paragraph is separately dead —
> [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) is where that version became `1.0.0`.

## Context and Problem Statement

The registry serves a contract's entry file as `reference.ts`, because `contractAnatomy` requires that
name at five of five. What lands in somebody's repository is the only file of this project that becomes
their code, and it is opened in their editor, beside their own files, for years.

## Considered Options

- A flat file per feature, promoted to a folder if a second file ever arrives.
- A folder per feature from the first file, with the entry file named after the feature.

## Decision Outcome

**A feature lands in `<domain>/<name>/`, and its entry file is named after the feature.**
`src/lib/toopo/string/slugify/slugify.ts`. The domain stays a folder, so `number/parse` and
`string/parse` never collide and no artificial prefix is needed. The file is not called `reference.ts`:
that name says what the file was in *our* catalogue and nothing about what it holds, and in the user's
editor every installed feature would otherwise open a tab under one name. It is the same reasoning that
already stripped our internal rules out of the three references — the implementation file is the only
one that becomes somebody else's code, and it is written for them.

**A folder from the first file, rather than a flat file promoted to a folder later.** The promotion has
to be invisible to whoever wrote the import, and it is not. Measured on node v24.15.0, at the spelling a
published source writes:

```
cjs  ./x.js -> MODULE_NOT_FOUND       cjs  ./x -> x/index.js
esm  ./x.js -> ERR_MODULE_NOT_FOUND   esm  ./x -> ERR_UNSUPPORTED_DIR_IMPORT
```

Only the extensionless spelling collapses the two, and a published source writes the extension because
that is the only form that resolves under both module systems and under `node16`. So an implementation
gaining a second file would move the path every dependent had written. The folder costs one level of
nesting on a single-file feature and the import path never moves again.

## Consequences

**The cost, which is that every cross-feature import is rewritten.** The catalogue serves its entry file
as `reference.ts` — `contractAnatomy` requires that name at five of five — so a published `imagined-number/clamp`
names its dependency as `../../imagined-string/pad/reference.js`, and that specifier is wrong the moment the file
lands as `pad.ts`. *Naming the file after the feature and needing no rewriting between features are
incompatible*, and the first wins because it is the one argued from the user's editor. What softens it
is that the rewriting mechanism is needed anyway for a shared file, and that both jobs are one rule:
**a specifier is repointed when the file it names did not land where the specifier says it would.**

**A shared file is recognised by its digest and never by its path**, written once in the folder of
whichever carrier the resolution reaches first, with the other carriers repointed at it — and an entry
file is exempt, because a feature's entry file is its identity and collapsing two would leave a folder
with no file named after it.

**The lockfile carries two digests per file, and that is a finding rather than a field somebody
wanted.** A file whose import was repointed is not the bytes the registry served, so an entry holding
only the served digest would report every rewritten file as locally modified from the instant it was
written — the failure `canonical.ts` closes for line endings, arriving through a door the installer
itself opens. `served` is what a comparison with the registry is made against; `sha256` is what the
offline check — the one whose whole value is that it needs nothing from us — compares against.

**A version minted by the local stand-in is visibly false.** `0.0.0-local`, never `1.0.0`. A number that
looks published and is not turns the lockfile's own argument against it, since its whole value is that
it can be checked offline against a published fact; and the day publication exists these entries are
greppable in any lockfile in the world.

**No setting exists that has one possible value.** `toopo.json` carries `version` and `directory` and
nothing else. The alias import style is coming and is not here, so there is no `imports` field to accept
and ignore — a setting that is written and not honoured is a promise not kept, and `version: 1` is what
carries the migration when the second style arrives. `init` will detect the alias prefix once and record
it; `add` will go on consulting nothing but this file. We record what the user told us, we do not
inspect their build.

## Confirmation

`an-entry-file-is-named-after-its-feature` and `every-contract-of-the-catalogue-installs-one-file-named-after-itself`
hold the naming over the catalogue as it is; `the-graph-lands-as-a-tree-of-features` holds the shape on
the imagined graph, which is the only thing in this repository with cross-feature edges.
`an-entry-file-is-never-deduplicated` holds the exemption, which is the half a deduplication by digest
would otherwise break silently.

## What would reopen this

A second file in any reference implementation, which is the event the folder exists for and which
nothing in the catalogue has yet produced. It reopens nothing about the shape; it makes the rewriting
above exercised rather than merely correct.

## More Information

- [ADR-0033](0033-one-import-spelling-and-it-is-not-the-users-to-choose.md) — the specifier written into
  the file that lands.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
