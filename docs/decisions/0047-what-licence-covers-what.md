---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/licence.ts
confirmed-by:
  - battery: registry-storage
    guard: a-translation-is-addressed-to-a-reader
  - battery: site
    guard: the-url-a-licence-header-freezes-is-the-page-this-site-publishes
---

# What licence covers what, and why the perimeter is derived

## Context and Problem Statement

Before this there was no `LICENSE` at all, which under default copyright means everybody may read this
and nobody may use it — so the first thing this unit established is that publishing was impossible, not
merely unpolished.

## Considered Options

- One licence for everything, with a one-line header in each copied file.
- MIT for the tool, MIT-0 for what the installer copies, and a perimeter derived from the installer's
  own walk.

## Decision Outcome

**The repository is MIT and what the installer copies is MIT-0, and the asymmetry is the product's
rather than a preference.** A tool is a dependency you install; an implementation is source code that
becomes yours to read, edit and maintain. Before this there was no `LICENSE` at all, which under
default copyright means everybody may read this and nobody may use it — so the first thing this unit
established is that publishing was impossible, not merely unpolished.

**The one-line header the unit was commissioned to write does not satisfy MIT, and that is what the
measurement found.** MIT requires *the copyright notice and this permission notice* — the whole
paragraph — in every substantial portion. Measured: the full notice is **1 180 bytes**, against a
smallest published reference of **2 259** and **16 534** over the four, so literal compliance costs
**+52 %** on one file and **+28.5 %** on the catalogue — a third of the one figure a contract page
sells. The ordinary `SPDX-License-Identifier: MIT` one-liner is a convention and is not what the clause
asks for, which would leave every user quietly non-compliant for a function they now maintain
themselves. **The legal argument therefore carries either 1 180 bytes or nothing; what carries the
header is provenance**, which stands on its own. Checked against the closest comparable: shadcn/ui is
MIT, copies files into user projects, and its components carry no header, no SPDX and no copyright at
all.

MIT-0 removes the clause rather than answering it badly. It was chosen over 0BSD on reading rather than
on law — both are OSI-approved and both are recognised by the usual scanners, and *MIT without the
attribution clause* explains itself by its name to anybody who already knows MIT, where 0BSD sends a
reviewer into a second family to establish the same thing.

**The perimeter is derived from `referenceImplementationOf`, and that is the load-bearing half.** A
hand-written list of paths is a legal boundary kept by a declaration nothing enforces — and the day a
contract gains a second file, the installer copies a file this repository believes is MIT into somebody
else's repository under a header saying MIT-0. **Getting a licence wrong inside somebody else's
repository is the most expensive defect this project can produce and the only one that is invisible
from here.** Measured: the derivation is three lines against the installer's own function, **5 files
copied and 32 served and never copied**, so both directions of the guard have a populated population.
`nothing-the-installer-does-not-copy-is-marked` is the half that matters as the catalogue grows: a
missing header is loud, and a stray one is silent.

**Two lines, ASCII, no version.** The address rather than a slug, because `renderContract` is frozen
with the major and a slug would be a second name that can disagree with the first. No implementation
version, because `0.0.0-local` is minted by whatever serves the file and does not exist in the source —
writing one would be a second declaration of it, and false. ASCII because these are the only bytes of
this repository that land in a codebase whose encoding, editor and toolchain nobody here can see.

## Consequences

**`THE_ORIGIN` moved to `packages/registry/address.ts` for a reason the site alone never had.** It was declared
in `packages/site/paths.ts` and `the-origin-is-declared-once` held it inside that folder; a header freezes the
origin into a repository we will never see again, so the guard had to grow past `site/` and the
declaration had to move above both readers. The folder guard became
`no-file-of-this-folder-spells-the-origin` — the assertion went from one file to none, and a name
rendering a count outlives the data it counted. Its pin in `site.battery.ts` moved with it, which is
the pre-flight's resolution doing its job.

**What has no mechanism, priced rather than dressed as one.** The *repository* licence is a
transcription in `package.json` and in `LICENSE`, and `the-public-fields-npm-shows-are-the-ones-this-
code-declares` resolves the fields that are facts — two when this was written, four now, and
[ADR-0048](0048-what-the-manifest-states.md) says what closed the gap. A description and a keyword list
are prose about the tool, derivable from nothing, and a guard comparing prose against prose is a copy
of the prose — so they are written and unguarded, and it is recorded here rather than left to look like
an oversight.

## Confirmation

`a-translation-is-addressed-to-a-reader` holds the header's shape; the site's
`the-url-a-licence-header-freezes-is-the-page-this-site-publishes` holds the half that is irreversible,
because that URL is frozen into repositories nobody here will ever see again.

## What would reopen this

A contract gaining a second copied file, which is the event the derivation exists for; and a
jurisdiction question about MIT-0, which is the one part of this nobody here is qualified to settle.

## More Information

- [ADR-0031](0031-what-a-crawler-is-told.md) — the origin this header freezes.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
