---
status: accepted
date: 2026-08-15
governs:
  - packages/cli/relocate.ts
confirmed-by:
  - battery: cli-install
    guard: every-installed-file-moves-and-not-one-byte-changes
  - battery: cli-install
    guard: a-destination-already-holding-our-bytes-is-a-move-that-happened
  - battery: cli-install
    guard: a-destination-holding-something-else-refuses-the-whole-move
  - battery: cli-install
    guard: a-file-the-lockfile-claims-and-the-disk-has-not-got-moves-nothing
  - battery: cli-install
    guard: the-folder-that-was-left-goes-when-it-is-empty
  - battery: cli-install
    guard: a-folder-change-says-the-imports-are-the-users-to-change
---

# What a folder change moves, and the one part it leaves

## Context and Problem Statement

A user whose folder git ignores is told to pick one that is committed, with `toopo init --dir <path>`.
They obey, and `init` wrote the setting and stopped — leaving every installed file where it was, inside
the folder git ignores, claimed by nobody.

## Considered Options

- Refuse, and tell the user to remove and re-add.
- Report the orphan and let the user tidy up.
- Move the tree.

## Decision Outcome

**The unit before this one closed a hole by opening the next one a floor down, and it was found by
following this repository's own advice.** A user whose folder git ignores now reads *pick a folder that
is committed with `toopo init --dir <path>`*. They obey, and `init` used to write the setting and stop:
`toopo.lock` records each file's path relative to the configured directory and **never the directory
itself**, so the entry stayed valid and pointed somewhere else. Measured end to end, the old copy was
not merely stranded — it was unreachable:

```
toopo init --dir app/toopo   ->  toopo.json updated       (not a word about what is installed)
toopo list                   ->  app/toopo/.../slugify.ts  missing
toopo update --apply         ->  + app/toopo/.../slugify.ts   "it was gone, and this puts it back"
find                         ->  app/toopo/.../slugify.ts  and  lib/toopo/.../slugify.ts
```

The orphan lands inside the folder git ignores, so `git status` never shows it, `toopo list` never shows
it, and nothing mentions it again.

**`init` is the only command that can ever see both folders, and that decides the shape.** After it
writes, the old path is recoverable from nothing on disk — the sentence `configurationToInstallUnder`
already carries about a lockfile with no configuration beside it. So a relocation not taken there cannot
be taken later by anything, which is what disqualifies *report the orphan and let the user tidy up*:
there would be no command for them to run.

**Refusing was disqualified by measurement rather than by taste.** The way out a refusal would have to
name is remove-then-re-add, and permanent rule 4 stops it on the projects that need it most: `toopo
remove --apply` on an edited file answers *held back, nothing changed*, and the only route through is
*delete the file*. **A way out that costs the user their own work is not a way out** — and a wall in
front of the action the previous screen told them to take is the class `ignored.ts` had just closed. A
move has nothing to re-fetch, so it has nothing to lose: the edited file is carried across as it is, and
`toopo list` goes on reporting it `edited` at its new path.

**A relocation is a renaming, and that is structural rather than lucky.** Nothing that decides a byte can
see the configured directory — `plan.ts`, `rewrite.ts` and `resolve.ts` never read it, and every use in
`cli/` is a `join` to reach the disk, a line to print, or a `commit`. Measured at both ends: one contract
installed under two different folders leaves lockfiles identical byte for byte once `installedAt` is
pinned; and on the imagined graph — five files, six cross-feature specifiers including the repointed
`../../imagined-string/pad/digits.js` that deduplication produces — renaming the whole tree and changing nothing
else gives `toopo update`: **nothing moved, no file to write, no file to remove, every verdict
`unchanged`, lockfile identical.** No import is repointed, no digest recomputed, and **no registry is
asked** — which keeps `init` in the pair with `list`, the commands that need no server.

### Four answers about a file

**Four answers about a file, and the third is designed for the interruption rather than discovered by
it.** `commit` renames every staged file into place and only then removes the old copies, so a run killed
between the two leaves the files at *both* paths with `toopo.json` still naming the old folder. A
destination already holding exactly the bytes we were about to write is therefore **a move that
happened**, not a file to refuse — without it the retry meets an occupied destination and is refused by
the rule that exists to protect it, on a state this tool produced itself. It is `PlannedWrite.alreadyOnDisk`
and `update`'s `already-written` arriving at a third case. A destination holding anything *else* refuses
the **whole** relocation, because a project half in one folder and half in another is a state no command
afterwards could describe.

**A file the lockfile claims and the disk has not got is compared against nothing.** There is nothing to
carry across, so nothing is written and nothing is overwritten; whatever sits at the destination becomes
the project's business under the ordinary rules. Comparing it would need bytes this module does not
have — an edited file hashes to neither of the lockfile's two digests — and refusing on that would strand
exactly the project this unit exists for.

**What is compared and what is written are not the same bytes.** The comparison is over the served
normalisation, because `canonical.ts` imposes that on the whole folder; what is written is the source's
own bytes, carried across untouched. Normalising on the way would silently rewrite the line endings of
somebody who is only moving a folder, and **a move that edits a file is not a move**.

## Consequences

**`toopo init --dir` writes at once, and `THE_WRITE_DISCIPLINE` gains the argument rather than an
exception.** The rule separates *destroying* from *obeying*: somebody who types `--dir app/toopo` is
asking for their files to be in `app/toopo`, so moving them is doing what they wrote and a second word
would ask whether they meant what they had just typed. `update` and `remove` are not in that position —
what they do next is decided by the registry and the project, not by the words in the line. And a move
destroys nothing: no file's contents change, an occupied destination refuses, and it is **its own
inverse**, so a folder named by mistake is undone by naming the right one with nothing lost in between.

**The folder that was left goes when it is empty, and that is not `emptiedFolders`.** `remove` and
`update` must never delete the configured folder, because it goes on being the configured folder; here it
stops being one. **An abandoned folder is not an emptied folder**, so the two facts are decided apart. It
goes only when empty — a folder still holding something is one the user put something in — and then it is
left alone and *named*, because a folder this tool has stopped naming, still holding somebody's file, is
the orphan defect with the roles reversed. `Commit.leaving` carries it: required, `null` for not moving,
the shape `Commit.configuration` already takes.

**The screen names every file, and says the one part of the work that stays the user's.** After the move
their `import { slugify } from './lib/toopo/...'` names a path that no longer exists, and toopo never
reads or edits their sources, so nothing can repair it for them. Silence there leaves their build failing
on an import with nothing anywhere saying why — the exact trap `whatToCommit` is written for, one floor
up. **The one part of the work that stays theirs must not be the one part nobody mentions.**

## Confirmation

The six guards are the four answers about a file, the property that no byte changes, and the sentence
about the imports. That last one is a guard rather than prose because it is the one part of the work
this tool cannot do, and the failure mode is silence.

## What would reopen this

A tool that reads the user's sources, which nothing here does and which permanent rule 1's neighbours
argue against. It is the only thing that would let the imports be repaired rather than named.

## More Information

- [ADR-0036](0036-which-commands-ask-twice.md) — the discipline this command is the argued exception to.
- [ADR-0039](0039-what-the-first-contact-is.md) — the unit that opened this hole.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
