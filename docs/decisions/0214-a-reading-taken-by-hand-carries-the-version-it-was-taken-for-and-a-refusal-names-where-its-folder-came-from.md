---
status: accepted
date: 2026-09-04
governs:
  - packages/registry/address.ts
  - packages/cli/where-a-file-may-land.ts
  - packages/cli/configuration.ts
  - packages/cli/command.ts
confirmed-by:
  - battery: registry-storage
    guard: the-ways-to-run-it-were-read-for-the-version-this-package-declares
  - battery: cli-install
    guard: a-directory-a-reader-typed-is-shown-as-they-typed-it
  - battery: cli-install
    guard: a-refused-directory-is-named-by-where-it-came-from
  - battery: cli-install
    guard: the-folder-init-is-given-is-one-this-toopo-can-read
---

# A reading taken by hand carries the version it was taken for, and a refusal names where its folder came from

## Context and Problem Statement

[ADR-0213](0213-the-four-forms-hold-and-the-entry-that-was-to-keep-them-was-never-written.md) re-read
`THE_WAYS_TO_RUN_IT` against `toopo@1.2.0` and found the four forms holding. It also found that
nothing had looked across three releases, priced the guard that would notice, and refused to build it
in the unit that measured — *settling a design decision inside a unit whose subject is a measurement
is the move the open list exists to refuse*. It named three defects it would not repair for the same
reason.

This is that unit. The guard is built, and the three defects are repaired.

**What the guard is worth is fixed in advance and is not *`npx` runs*.** No offline check can establish
that, and the one placement where the claim and the artefact coincide is behind `npm publish` — a
verdict arriving after the irreversible act, which is what
[ADR-0109](0109-the-publication-holds-no-credential.md)'s job ordering exists to prevent. What it
establishes is that somebody read the table in the unit that declared this version, and **it would have
been red at `1.1.0`, at `1.1.1` and at `1.2.0`**, which is every occasion the entry is about.

## The decision of form, and the two readings that settled it

The stamp could be a constant beside the table or a field on `AWayToRunIt`. **What decides it is the
claim rather than the price**, and the price agrees.

**The claim is about the table and not about a spelling.** What the guard keeps is *this table is
current*. Over per-form stamps the only sound reduction to one verdict is the **oldest** — a table with
one fresh row and three stale ones is stale — so four values would be carried to compute one, and the
three fresher ones would be unreadable by any guard that keeps the claim. Worse, a row going stale
beside a fresh one would be **silent**, each stamp being true of its own row, which is the state the
guard exists to refuse.

**The case for a field is a future `deno` row measured at another version, and the discipline ADR-0213
declares answers it**: the table is re-read *whole* in the unit that moves `THE_PACKAGE_VERSION`. A
per-form stamp would license exactly the drift that discipline forbids.

**The price was measured rather than asserted, on the served pages.** `contract-page.ts` writes
`JSON.stringify(THE_WAYS_TO_RUN_IT)` into `data-ways`, so the whole table reaches every reader of a
contract page. Measured at `94458f4` over the emitted tree — **6 of the 7 pages written carry it**, the
shelf carrying none — one `"readFor"` field per entry costs **912 B raw and 161 B in brotli**, 152.0 and
26.8 per page, for a value nothing on the page reads. `start.ts` consumes `data-ways` to build the
manager control, and a version is not part of that.

**And the comparison could not live beside the table, which was measured rather than read off a
comment.** `THE_PACKAGE_NAME` records having been moved out of `publication.ts` precisely because
`packaging/reachable.ts` walks the published entry point. Measured at `94458f4`: the build writes **36
modules**, `dist/packages/registry/address.js` is one of them and `publication.js` is not — so importing
`THE_PACKAGE_VERSION` into `address.ts` would put the whole publication module into every install. The
stamp is a literal; `address.test.ts` holds the comparison, and a test file packs nothing.

### A correction to what ADR-0213 proposed

That record asks for *the version its readings were taken against*. **That is the one spelling that can
never be green.** A reading is taken against what npm serves, and npm does not hold the version this
tree declares until the push declaring it has published — so a stamp meaning *taken against* would be
behind by one release for the whole of every release unit, red on exactly the push whose ordering exists
to put every verdict in front of the irreversible act.

So the stamp is **the version this package declares when the table was last read**, moved in the same
commit as the bump, and the reading it records is of the outgoing release. That limit is written beside
the constant rather than smoothed: the guard says somebody looked, and never that they looked at the
artefact the tree is about to publish.

## Seeing it red on the state this repository really lived in

The stamp put back to `'1.0.4'` — ADR-0138's own reading, and the state this repository was in for the
sixteen days from 19 August to 4 September:

```
❯ address.test.ts (4 tests | 1 failed)
    × the-ways-to-run-it-were-read-for-the-version-this-package-declares
AssertionError: expected '1.0.4' to be '1.2.0'
Test Files  1 failed | 23 passed (24)
     Tests  1 failed | 466 passed (467)
```

Red, alone, on the real condition rather than on a perturbation invented for the occasion.

## The three defects ADR-0213 published unrepaired

### The refusal named a file that did not exist

`toopo init --dir ../outside` was refused with *`toopo.json` carries "../outside" as its directory* — on
a path where no `toopo.json` exists, nothing is written, and the string arrived on the command line.
`command.ts` called `configurationFaults`, whose every sentence is written for a committed file.

**It is the class ADR-0208's own repair had closed one level up**, arriving on the repair: one message
written for one population and shown to another. The confinement was right in both cases — exit 1,
nothing written — so nothing anywhere was red.

**The repair is that the source travels with the value.** `WHERE_A_DIRECTORY_COMES_FROM` declares the
three branches `init` composes a folder out of, `theDirectoryToConfigure` chooses the value and its
source in one expression so the two cannot part, and `theDirectoryFaults` takes the source as a
parameter. The one clause that is about the committed file names it by what it does — *recorded in a
file that is committed with your project* — which is true whether the file is being read or is about to
be written, and which is what keeps `where-a-file-may-land.ts` from importing `configuration.ts`.

**`configurationFaults` is no longer asked on that path, and that is a repair rather than a narrowing.**
Its other arms — the object, the version, an unhonoured key — are all about a file this path has not
read, and the composed configuration satisfies all three by construction. Asking them bought nothing and
answered in the words of a file nobody had opened; had one ever fired it could only have been wrong,
which is the false-only region [ADR-0141](0141-a-reader-receives-the-rules-and-not-the-argument-for-them.md)
named.

Now, on both paths:

| | what a reader is shown |
| --- | --- |
| a committed `toopo.json` carrying `../outside` | `toopo.json names "../outside" as the folder to install in, and it leads out of your project. …` |
| `toopo init --dir ../outside` | `--dir names "../outside" as the folder to install in, and it leads out of your project. …` |

### The reader was shown a string they had not typed

Typed `C:\toopo`, rendered `"C:\\toopo"`. `JSON.stringify` renders for a machine and a refusal is a
sentence for a person, and **the character the two disagree about is the character the message exists
for**: a backslash is what somebody on Windows types, and two of the five arms of this refusal are about
exactly that.

`asTyped` keeps everything else `JSON.stringify` does, and the newline is why — a directory holding one
is refused too, and a refusal that broke its own line in half would be a worse sentence than one
spelling it `\n`. So the claim the guard keeps is exact rather than total, and its population says so.

### ADR-0138 and `CLAUDE.md` referred to each other

ADR-0138 wrote that `CLAUDE.md` carried the entry; it did not, until ADR-0213 wrote one. The record is
stamped, so what it gets is a head note and never a rewrite, and `CLAUDE.md` keeps the entry — which
this unit narrows rather than closes, because half of it is *the four forms still run* and no offline
guard reaches that half.

## The three doors, measured rather than argued

A refusal names the wrong source through three independent openings, and the cells prove they are three
rather than one written three times:

| put back | what reddened |
| --- | --- |
| `asTyped` → `JSON.stringify` | `a-directory-a-reader-typed-is-shown-as-they-typed-it`, **alone**, naming `C:\toopo` and `src\lib\toopo` |
| `theDirectoryRefusal(CONFIGURATION_FILE, …)` | `a-refused-directory-is-named-by-where-it-came-from` **and** `the-folder-init-is-given-is-one-this-toopo-can-read` |
| `theDirectoryFaults(CONFIGURATION_FILE, …)` at the call site | `the-folder-init-is-given-is-one-this-toopo-can-read`, **alone** |

**The third row is the one worth reading twice.** The pair in `configuration.test.ts` is green through
it: neither of them can see which source the entry point hands over, so that arm can only be kept where
a real process runs — which is `breakage.test.ts`, where the process was already being spawned and its
refusal already captured. A repair whose own defect can come back unseen is not finished, and reading
only the two cheap guards would have left that door open.

### And the replay found the one guard those three cells leave un-isolated

Three of the four new guards come out of the replay **alone** on a cell of their own — `C-84`, `C-86`
and `I-176`. `a-refused-directory-is-named-by-where-it-came-from` does not: it is red on `C-30` and
`C-85`, and `C-85` reddens the init guard with it, because the sentence the two read is one function.

**What separates them is a branch `init` does not take.** `--dir` is the typed branch, so a defect in
what the *committed* branch reports is invisible to a real `toopo init --dir` and is exactly what the
declaration guard exists for. Measured before it was written down: making that branch report the
proposal's source reddens the naming guard **alone**, 195 guards green beside it. `C-87` is that cell.

It aims at a choice rather than at the mechanism the two claims share, which is
[ADR-0203](0203-a-guard-is-isolated-by-aiming-at-a-choice-and-what-resists-reads-the-same-population.md)'s
rule and the reason `C-85` is not simply re-pinned. **A guard added to the *never alone* bucket in the
unit that created it would be this repository paying into a debt it is otherwise paying down**, and the
mutant was in hand: the replay named it by naming what `C-85` also reddened.

## Considered Options

### Refused: a fourth guard spawning its own process

The entry point's choice needs a real process, and `the-folder-init-is-given-is-one-this-toopo-can-read`
already runs two — replayed once per mutant cell across four batteries. A second guard would double that
for a claim the existing one is already positioned to make; what it gained is one field on an
expectation. Its own comment says which half lives where, so the two are not two statements of one fact:
*which cause* stays in `configuration.test.ts` where a row costs nothing, and *whose folder* is here
because nowhere else runs the command.

### Refused: validating only what `--dir` was given

It would have named the source truthfully with no declaration at all, and it removes the only place
`proposeDirectory`'s output ever meets the directory rule — `toopo add` does not ask it either. Narrower
code, less kept.

### Refused: a per-form stamp

Above. Refused on the claim, and the served bytes agree.

## Decision Outcome

Three guards, five cells, and one constant that a release unit has to move.

**What it cost in accounting is `CLAUDE.md`'s own recorded price, confirmed rather than rediscovered**:
one battery collects `packages/registry`, so the registry guard cost the census and one battery — two
files. Four batteries collect `packages/cli`, so the two client guards cost the census and four
batteries — five files, of which three are declared regions and one is cells. `npm run anchors` reported
**one** loose anchor, `C-81`'s, whose `find` quoted the sentence this unit rewrote; it is repaired and
the count goes **927 → 932**.

The census moves `packages/registry/address.test.ts` 3 → 4 and `packages/cli/configuration.test.ts`
11 → 13. The README moves **990 → 995 defects and 948 → 953 caught**, all five new cells being killed.

**The five batteries this change touches were replayed locally before it was pushed**, all five exiting
0 with every cell agreeing with its pin and nought unaccounted for: `cli-install`, `registry-storage`,
`cli-remove`, `cli-search` and `cli-update`, **3 834 s in all**. The durations are published as
intervals rather than as points, because [ADR-0200](0200-a-rewrite-removes-what-it-orphans-and-the-census-closes-at-thirteen-folders.md)
measured that one reading calibrates a battery no better than to about a sixth: `cli-install` **730–890
s**, `registry-storage` **2 100–2 700 s**, `cli-update` **340–420 s**, `cli-remove` **190–240 s**,
`cli-search` **40–55 s**. `C-87` was added after that replay and `cli-install` was replayed again for it.

Nothing under `contracts/` is touched, no digest moves, and `THE_PACKAGE_VERSION` stays at `1.2.0`.

## What would reopen this

**A publication reopens it by construction**: the guard is red on the push that declares a version the
table has not been read for, which is the whole of what it is for.

A machine carrying `deno` adds a fifth form. It does not reopen the form decision — the fifth row is
read in the same sitting as the other four, which is what the table-level stamp asserts — but a reading
in which one form is measurable and another is not would.

**A release unit that finds the stamp awkward to move reopens the semantics**, and the note beside the
constant is where the argument for them is. If a future unit re-reads the table *after* the push rather
than before it, the stamp is right either way and only the sentence describing it needs correcting.

And a reading in which one of the three working forms exits non-zero, or lands bytes that are not the
announced ones, reopens ADR-0213 rather than this: this guard cannot see it, and says so.
