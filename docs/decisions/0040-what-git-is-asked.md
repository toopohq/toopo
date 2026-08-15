---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/ignored.ts
confirmed-by:
  - battery: cli-install
    guard: git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot
  - battery: cli-install
    guard: an-installation-is-the-same-with-git-and-without
  - battery: cli-install
    guard: an-ignored-folder-is-told-about-instead-of-being-told-to-commit-it
---

# What git is asked, and what asking may not change

## Context and Problem Statement

`toopo add` prints *Commit toopo.json, toopo.lock and `<directory>`/*. In a project whose `.gitignore`
holds `lib/`, that instruction cannot be followed: the lockfile is committed and the source is not, so
the next clone gets a lockfile naming files that are not there — the trap happening while the sentence
telling them to commit that folder is on screen.

## Considered Options

- Say nothing, and let the sentence stand.
- Read `.gitignore` and decide for ourselves.
- Ask git.

## Decision Outcome

**A decision recorded in this repository was reversed, in the change that deviated, on the measurement
that falsified it.** `report.ts` said that reading a `.gitignore` would mean spawning git inside
somebody else's repository to answer a question one sentence answers better, and it printed that
sentence: *Commit toopo.json, toopo.lock and `<directory>`/*. Its description of the trap was exactly
right and is kept. Its remedy was measured, on git 2.49.0, in a project whose `.gitignore` holds `lib/`:

```
toopo add string/slugify         ->  + lib/toopo/string/slugify/slugify.ts
git check-ignore -v <that file>  ->  .gitignore:2:lib/  lib/toopo/.../slugify.ts
git add -A ; git ls-tree -r HEAD ->  .gitignore package.json toopo.json toopo.lock
```

The lockfile is committed and the source is not, so the next clone gets a lockfile naming files that
are not there — the trap happening while the sentence telling them to commit that folder is on screen.
**An instruction the project makes impossible to follow is worse than silence.** And `lib/` with no
leading slash matches a directory of that name at any depth, so `src/lib/toopo` is ignored by it too:
both branches of `proposeDirectory` are exposed, not only the one that looked exposed.

**Reading `.gitignore` ourselves was refused rather than attempted.** Negations, `**`, anchoring, nested
files, `.git/info/exclude` and global excludes are a semantics this repository does not own, and a
second statement of what git means by *ignored* drifts from the first. A false *your folder is ignored*
teaches its reader to ignore what this tool says, which costs more than never having spoken.

**Three outcomes and no fourth.** git absent, or a folder in no repository, is **silence** — never a
claim, because this is the one thing on the screen a reader cannot check for themselves.

### Two conventions of an external tool, pinned

**Two conventions of an external tool are pinned rather than assumed**, the treatment `node:util.diff`'s
operation codes already have. The exit codes — `0` ignored, `1` not ignored, anything else an error. And
the flag whose name reads right and is wrong: `check-ignore` consults the index, so a folder holding a
tracked file is **not** reported ignored however well a pattern matches it, and `--no-index` would turn
a project that force-added its folder into a false warning. Measured over a file committed with
`git add -f`: `-q` alone answers `1`, `-q --no-index` answers `0`.

**Two things were found by measuring rather than by reading the manual page, and the first is this
module's own failure mode arriving through its front door.** `-q` refuses more than one pathname —
`fatal: --quiet is only valid with a single pathname`, exit **128** — so asking about every written file
in one call would have answered *git cannot say* and printed nothing. And git answers for a *directory*
out of the index too, so one path is enough and it is the configured folder: measured in one repository
holding `lib/`, `check-ignore -q lib/a` answers `1` after a file under it was force-added, while
`lib/c` answers `0`.

## Consequences

**`command.ts` says everything this tool *decides* is reachable from a guard with no process, and that
reading is now a measurement.** Asking git is not a decision, and
`an-installation-is-the-same-with-git-and-without` runs the same install in two identical projects — one
where git answers, one where `git` cannot be found at all — comparing every installed byte, the lockfile
and `toopo.json`. Only the advice differs. Seen red by letting the answer reach one lockfile field.
`installedAt` is named and dropped from the comparison, because it is a clock and not a git effect.

**The sentence replaces the other rather than sitting beside it.** *Commit this folder* and *git will
not let you* on one screen is a tool arguing with itself, and the reader believes neither. It is printed
where something was written — `add`, `init`, `update --apply` — and never on the showing half of an
update, where the past tense would describe files that do not exist yet.

## Confirmation

The three guards are the three things this could get wrong: the answer itself with its silence,
the property that asking changes nothing, and the sentence that replaces the other one. The second is
the one that keeps the decision honest as the tool grows, because a process is the easiest thing in the
world to let leak into a decision.

## What would reopen this

A project layout where the configured folder is committed and a file inside it is not, which
`check-ignore` on the folder cannot see. It is the one shape this question is asked at a granularity
too coarse for, and it is a real project rather than a hypothesis — a `.gitignore` naming a file
pattern rather than a directory.

## More Information

- [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) — the sweep this
  screen's sentence was repaired in.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
