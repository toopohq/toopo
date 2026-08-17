---
status: accepted
date: 2026-08-17
decision-makers: Mathis Perron
governs:
  - packages/cli/plan.ts
confirmed-by:
  - battery: cli-install
    guard: an-entry-file-is-named-after-its-feature
  - battery: cli-install
    guard: each-of-the-five-installs-one-file-named-after-itself
  - battery: cli-install
    guard: the-graph-lands-as-a-tree-of-features
  - battery: cli-install
    guard: an-entry-file-is-never-deduplicated
  - battery: cli-install
    guard: two-different-files-on-one-destination-are-refused
  - battery: cli-install
    guard: a-renamed-entry-file-is-repointed
  - battery: cli-install
    guard: an-unchanged-specifier-is-left-alone
  - battery: cli-install
    guard: an-installed-file-imports-what-was-installed
---

# A feature lands as a file, and its folder sits beside it

## Context and Problem Statement

[ADR-0032](0032-what-an-installation-looks-like-on-disk.md) put every feature in a folder from its
first file. What a reader then sees, in their own editor and in their own imports, is

```
lib/toopo/string/slugify/slugify.ts
import { slugify } from './lib/toopo/string/slugify/slugify.js'
```

The name is written twice. This was noticed by a reader looking at what an installation deposits, not
by a sweep — and the window to act on it is closing, because the installed path lives in every user's
lockfile and changing it later means moving files inside other people's repositories. Today there is
one such repository.

**The folder is paying for a case that does not exist, and the case cannot arrive by accident.**
Measured at `a413615`: four of the five contracts are installable — `array/group-by@1` is
`never-published` — and each installs exactly one file, which
`each-of-the-five-installs-one-file-named-after-itself` pins. That is not a coincidence of the
catalogue. `referenceImplementationOf` in `packages/registry/serialise.ts` filters a contract's harness
to `reference.ts` alone, so no contract *can* install a second file without an edit one floor above the
path. A contract declares seven files; six of them are the harness, which the registry serves for audit
and a project never receives.

## Considered Options

- Keep ADR-0032's folder: `<domain>/<name>/<name>.ts`, with any second file beside it.
- Flat everywhere: `<domain>/<name>.ts`, with a naming rule for any second file.
- Flat entry, with a folder of the same name beside it for any second file.

## Decision Outcome

**A feature's entry file lands at `<domain>/<name>.ts`. Any other file it carries lands at
`<domain>/<name>/<file>.ts`, in a folder that sits beside the entry rather than around it.**

```
lib/toopo/string/slugify.ts
lib/toopo/string/pad.ts
lib/toopo/string/pad/digits.ts
```

### It keeps ADR-0032's own requirement, and keeps it better

ADR-0032 was written on one requirement: **an entry file's path never moves.** A published source
writes its imports with the extension, so a feature whose path moved would break every dependent that
had already written one. ADR-0032 kept that by putting every feature in a folder from the start, paying
one level of nesting on every single-file feature to buy it.

This layout keeps the same requirement by never putting the entry in a folder at all. The folder
arrives *beside* the entry, so a feature gaining a second file **adds** a path and moves none. There is
no arbitration here: the two layouts are identical while no feature has two files, and this one is
strictly better on the day one does. ADR-0032's refused option — a flat file *promoted* to a folder —
is refused here too and for its own reason: promotion moves the entry.

### The measurement ADR-0032 did not have to take

ADR-0032 measured that `x.js` and `x/index.js` are not one specifier. What this layout needs is the
neighbouring fact, which nothing had measured: that a file and a folder of the same name can sit in one
directory. Taken on node v24.15.0 — the version ADR-0032's own reading was taken at — with `pad.ts` and
`pad/digits.ts` in one directory:

```
esm  ./string/pad.js  -> entry+helper
cjs  ./string/pad.cjs -> entry+helper
```

**They are not candidates for one specifier.** `./pad.js` names the file; the folder is reached only
through a path that says so. The one spelling where both are candidates is the extensionless `./pad`,
and it resolves to the file under both module systems — measured, and deterministic in both
directions. [ADR-0033](0033-one-import-spelling-and-it-is-not-the-users-to-choose.md) forbids that
spelling anyway: `./x` is TS2835 under `node16` and `nodenext`.

### The promise this repository prints is wider than Node, so the measurement is too

`renderImportLine` tells every reader that the spelling it prints is *the one TypeScript and every
bundler resolve*. That sentence is on screen at the end of every install, so the layout was measured
against it rather than against Node alone.

**The probe is differential, and that is what makes it readable.** Two trees were built side by side —
ADR-0032's shape and this one — in TypeScript and in JavaScript, each carrying the cross-feature edge
the imagined graph models. Without the pair, a failure of the probe's own environment would read as a
failure of the shape, which is exactly what happened twice and was diagnosed only because the other
column failed identically.

**`resolved` is the helper's value found inside the produced bundle, never an exit code.** A bundler
that silently externalised the import would exit 0 with nothing resolved, and the probe would have
called that a pass.

TypeScript, using this repository's own pinned `tsc` 7.0.2 — the version ADR-0033 measured the spelling
at — under each resolution the project targets:

```
                  bundler   node16   nodenext
ADR-0032's shape  clean     clean    clean
this shape        clean     clean    clean
control           TS2307    TS2307   TS2307
```

Four bundlers, chosen on weekly npm downloads read at the measurement — esbuild 227 093 545, vite
142 923 941, rollup 82 927 474, webpack 47 410 703, with webpack's resolver `enhanced-resolve` at
114 659 765 on its own — covering three distinct resolver implementations. **Twenty-four cells, every
one as expected**: both shapes resolved in both languages under all four, and both negative controls
red under all four.

**The control is what makes the greens worth reading**, and it exists in both languages on purpose: a
TypeScript-only control would be red at webpack for a loader reason rather than a resolution one, which
is a control passing for the wrong reason.

### Nothing in the ecosystem refuses the shape, and the runtime itself uses it

Consulted: `eslint-plugin-import` (its 15 static-analysis and 18 style rules, enumerated),
`eslint-plugin-check-file` (its 5 rules), `eslint-plugin-unicorn`'s naming rules, and two search
sweeps. **No rule anywhere forbids a file and a directory sharing a name.**

The precedent that settles it is Node's own standard library. Measured at `main`, over the 69 entries
of `lib/`: **12 are both a `.js` file and a folder** — `assert`, `dns`, `fs`, `inspector`, `net`,
`path`, `readline`, `stream`, `test`, `timers`, `util`, `zlib`. The runtime ships `fs`, `stream` and
`util` in exactly this shape.

### What decided against flat-everywhere is a measurement of somebody else's registry

The second option needs a naming rule for a feature's second file, and the only rule that keeps
promotion invisible is `<domain>/<name>-<file>.ts`. `CONTRACT_NAME` in `packages/registry/address.ts`
permits a hyphen in both segments — `array/group-by` is in the catalogue — so contract `array/group`
with a helper `by.ts` and contract `array/group-by` would both land at `array/group-by.ts`. **Two legal,
distinct addresses on one path**, which is impossible today and impossible under the option chosen.

shadcn/ui is the largest instance of this trade in the ecosystem and it took the flat road. Measured on
2026-08-17 against its served registry: `registry:ui` is flat, and **63 of 63 items carry exactly one
file** — `sidebar`, the heaviest component in the catalogue, included. Where multi-file items exist
they are blocks, and `resolveNestedFilePath` in its CLI lands them flat too. Comparing the two blocks
`dashboard-01` and `sidebar-07`:

```
components/app-sidebar.tsx  identical bytes: false   3646 vs 3271
components/nav-main.tsx     identical bytes: false   1696 vs 1983
components/nav-user.tsx     identical bytes: false   3350 vs 3430
app/dashboard/page.tsx      identical bytes: false   1212 vs 1935
```

**Four of the six paths `sidebar-07` writes collide, and not one pair holds the same bytes.** Its CLI
does not refuse: it asks, file by file, whether to overwrite. `planInstall` here refuses the whole
install and names both files. The predicted failure of the naming rule, observed at scale.

## Consequences

### The folder is a door, not a feature

**Nothing can put a second file in it today.** `referenceImplementationOf` filters an implementation's
files to `reference.ts`, so the folder beside an entry is a place that exists and stays empty. Opening
it is a separate and deliberate edit to that filter, in a unit of its own. This record does not make a
multi-file contract available and must not be read as doing so; what it does is make sure that when one
arrives, no installed path moves.

### A file the user has edited is kept, and the new copy is written beside it

An existing installation migrates on the next `toopo update`. `deduplicatedAway` in
`packages/cli/reconcile.ts` already answers the question this needs — for a feature that stays, every
file the lockfile claims that the new plan no longer writes — so the old path is removed when it still
hashes to what we wrote there, and `emptiedFolders` tidies the folder that leaves. **When the user has
edited that file it is `kept-orphan` instead: it stays where it is, and the new copy is written at the
new path. They then hold two.**

That is permanent rule 4 doing its job — nothing of theirs is taken silently — and it is reported on
screen rather than hidden. It is a real inconvenience and it is written here rather than in a footnote.
It was read and accepted before this unit was written, by the one person who holds an installation
today.

The mechanism was not built for this and its name says so. What stands behind it is two guards that run
on a real condition, `a-copy-deduplicated-away-is-taken-with-the-entry-that-stops-claiming-it` and
`a-deduplicated-copy-the-user-edited-is-kept-rather-than-taken` — both on the deduplication case rather
than on a shape change, which is what this paragraph is careful not to overstate.

### Every specifier an entry file writes is now repointed

The entry lands one level above the folder it was served in, so even a feature's import of its own
file moves: `./digits.js` becomes `./pad/digits.js`. **The only specifier left alone is one file of a
feature's folder naming another**, which is what `an-unchanged-specifier-is-left-alone` now measures.
Nothing new was built for this — `rewrite.ts` derives every specifier with `posix.relative` and knows
no path shape — but the rewriting is exercised on more files than before, and the report says
`import repointed` on a line that used to say nothing.

### Two collisions changed places, and one guard lost a case it used to cover

`placedByPath` can no longer be reached by one implementation carrying a file named after its own
feature: an entry lands at `<domain>/<name>.ts` and any other file of that feature a segment deeper,
whatever it is called. The case that does reach it is two majors of one feature — `seenContracts` is
keyed on a rendering that carries the major and the path deliberately is not — and `name@2` beside
`name@1` is permanent rule 6's own repair, which makes it the collision the design actually admits.
`two-different-files-on-one-destination-are-refused` was moved onto it rather than kept alive with a
contrivance.

**And one assertion quietly stopped covering what it was written for.** `a-line-says-what-was-done-to-that-file`
ends by requiring that no line of the screen carries trailing whitespace, which was written for a file
line with nothing after the path. Every one of the fixture's five lines now carries a note, so the
padding is no longer exercised there. It is kept as a whole-screen invariant and the loss is recorded
beside it, rather than left for somebody to discover as coverage that was never there.

### What the change cost, and what it did not touch

One function of four lines, and `actionOf` deleted with it. 137 entry-path literals across 20 files, 49
guards, and one battery anchor — C-01's, whose text is that function's body. Untouched, and measured
rather than assumed: `rewrite.ts`, which derives specifiers; `write.ts`, whose `emptiedFolders` walks up
with `dirname` and stops at the first `rmdir` refused; the lockfile, which carries `PlannedFile.path`
through; and every module of `packages/site/`, which renders no landed path at all.

**No digest moved.** `packages/cli/plan.ts` is in neither `THE_SEVEN_FILES` nor `THE_SHARED_FILES`, so
no contract snapshot, no implementation snapshot and no ledger binding changed. This is a client
change, not a catalogue one, and permanent rule 6 is not in question.

Two measurement transcripts in older records were deliberately **not** rewritten to match the new
layout: [ADR-0040](0040-what-git-is-asked.md)'s reading on git 2.49.0, and the `before` half of
[ADR-0049](0049-the-language-is-part-of-an-address.md)'s diagnostic comparison. Editing a past
measurement to agree with today's code fabricates a measurement nobody took. What was corrected in
those records is only the sentences written in the present tense.

## Confirmation

The eight guards above hold the layout from three directions: `plan.test.ts` on the destinations and
the two refusals, `install.test.ts` on what a real install leaves on disk against the imagined graph and
against the catalogue, and `rewrite.test.ts` on which specifiers move and which do not.

**What they do not establish** is that the shape resolves in somebody's toolchain. No guard of this
repository runs a bundler, and the measurements above are a person's, taken once, published here. That
is the same standing the `origin` and `freeze` suites have and it is weaker than a battery; writing the
figures down is the difference between that and nothing.

## What would reopen this

- A tool that refuses a file and a folder of one name in one directory. None was found, and the sweep
  that found none is named above rather than described.
- The filter in `referenceImplementationOf` opening, which is what makes the folder beside an entry
  hold anything. It reopens nothing about the shape; it makes the folder exercised rather than merely
  correct.
- A bundler outside the four measured turning out to resolve the shape differently. The population is
  the gap `CLAUDE.md` now carries under what this repository declares and nothing keeps.
- A second language in the catalogue, which is the case where two contracts of one name land on one
  path and `placedByPath` is the only thing between them.

## More Information

- [ADR-0032](0032-what-an-installation-looks-like-on-disk.md) — the layout this replaces, and the
  requirement both are written on.
- [ADR-0033](0033-one-import-spelling-and-it-is-not-the-users-to-choose.md) — the specifier written
  into the file that lands, and the promise this shape was measured against.
- [ADR-0049](0049-the-language-is-part-of-an-address.md) — why the path carries neither the language
  nor the major, and what refuses the collision instead.
