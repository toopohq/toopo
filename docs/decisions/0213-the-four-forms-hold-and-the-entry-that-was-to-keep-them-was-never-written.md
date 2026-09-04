---
status: accepted
date: 2026-09-04
governs:
  - packages/registry/address.ts
confirmed-by: []
---

# The four forms hold against `toopo@1.2.0`, and the entry that was to keep the reading was never written

## Context and Problem Statement

[ADR-0138](0138-a-reader-chooses-their-package-manager-and-every-form-was-measured.md) publishes four
invocations on every contract page, each carrying the measurement that admitted or refused it. It
opens by naming the risk in its own subject: *a form displayed and not measured is the defect a
visitor already met, on the first thing they tried.*

That measurement was taken on **2026-08-19 against `toopo@1.0.4`**. npm has served `1.1.0`, `1.1.1`
and `1.2.0` since, two of them on the same day, and eight modules of the install path moved across
them — `init` and the reading of a project's own configuration among them, which
[ADR-0208](0208-the-folder-a-project-chose-has-an-alphabet-of-its-own-and-the-tool-reads-what-it-writes.md)
repaired. **Nothing re-read the table across any of it.** A reading that survives three releases with
nothing looking at it is the definition this repository gives of a declaration nothing keeps.

**The remedy ADR-0138 named for exactly this does not exist, and never did.** That record writes:
*what no guard here reaches is whether a spelling in that table really runs … a guard implying
otherwise would be one this repository could not keep, and `CLAUDE.md` carries the entry rather than
this record pretending to cover it.* Read at `21279f6` — ADR-0138's own commit — `CLAUDE.md` carries
one passage on the subject, in *Where the project is*, about `yarn dlx` being **broken**; it names no
entry, and its closing sentence declines the job in as many words: *it is not this list's class —
nothing is unkept, something is broken — so it is written where a session reads first rather than
filed as a declaration nobody keeps.*

So the record named a filing location, the location refused the filing, and neither half knew about
the other. It is the shape this repository has already recorded once, in the entry that closed on
*written into that stage's requirements rather than built* over requirements that were never written:
**a sound description of a mechanism, beside a false claim about where it lives.** The description
was right — no guard reaches this — and it is the clause about the entry that a reader believes.

## The reading

**Taken on 2026-09-04 against `toopo@1.2.0` as npm serves it**, each form in its own empty project
holding nothing but a `package.json`. npm holds eight versions and `dist-tags.latest` answers
`1.2.0`, so the bare spelling the site publishes and the pinned one measured here are the same
package today.

**What the catalogue announces was read independently of the client**, which is what separates *it
runs* from *it lands the right thing*: `/typescript/string/slugify@1/implementation-bindings` on the
live origin answers a binding at digest `8c4af2c7…` and `servedFrom` `870354a8…`, and
`/snapshot/8c4af2c7…` names one file — `reference.ts`, **3 332 bytes, sha256 `1a8ae9d1…`**.

| form | exit | what landed | digest |
| --- | --- | --- | --- |
| `npx toopo add string/slugify` | 0 | `lib/toopo/string/slugify.ts`, 3 332 B | `1a8ae9d1…` |
| `pnpm dlx toopo add string/slugify` | 0 | the same file and size | `1a8ae9d1…` |
| `bunx toopo add string/slugify` | 0 | the same file and size | `1a8ae9d1…` |
| `yarn dlx toopo add string/slugify` | **1** | **nothing** | — |

`yarn dlx` fails on the cause ADR-0138 recorded, verbatim: Yarn applies its builtin compatibility
patch to `typescript` and the patch fails with
`ENOENT … lstat '/node_modules/typescript/lib/_tsc.js'`, because TypeScript 7 does not hold that
file. **So the published refusal is not stale**, which was the half most worth re-taking — a
refusal that had quietly become false would send a yarn reader away from a form that works.

**The control is what makes that a cause rather than a guess**, and it is retaken rather than
carried: `yarn dlx cowsay` in the same shell, the same minute, exits 0 and prints its cow. Yarn works
on this machine and fails on this package.

**The fifth form `CLAUDE.md` records is red and still red.** `bunx --bun` exits 1 on
`SyntaxError: Export named 'diff' not found in module 'node:util'` and writes nothing —
`packages/cli/diff.ts` imports `diff` from `node:util`, which Bun's runtime does not hold. It is not
a defect of this package and it is not in the table; it is measured because it is published.

**`deno` is still not measured and the refusal is unchanged.** It is not on this machine —
`deno: command not found` — and a fifth entry asserted from the shape of the other four is what that
table exists against.

The coordinates, because a manager's behaviour is its own to change: node **v24.15.0**, npm
**11.12.1**, pnpm **10.24.0**, bun **1.3.8**, yarn **4.6.0** through corepack **0.34.6**, on
`MINGW64_NT-10.0-22631`. **The five manager versions are ADR-0138's to the digit**, which is worth
more than the table: nothing on the manager side moved, so no row of this reading can be attributed
to a manager and every difference below is the package's.

## The journey, which nothing has ever run

`packaging/against-the-origin/` installs a tarball this repository builds. A tarball merely unpacked
dies on `ERR_MODULE_NOT_FOUND: typescript`, so only a real installation carries both halves — the
client and the one runtime dependency that puts it on disk — and that is the installation no guard
here performs. **The invocation was measured and the six commands behind it were not.**

Run from npm, in the projects above:

| step | exit | what it did |
| --- | --- | --- |
| `init` | 0 | wrote `{ "version": 1, "directory": "lib/toopo" }` |
| `add string/slugify` | 0 | landed `1a8ae9d1…` against that configuration |
| `list` | 0 | read the configuration back, one feature, one file |
| `search slugify` | 0 | answered `typescript/string/slugify@1` |
| `update` | 0 | *Every feature is at the version the registry serves*, nothing to do |
| `remove string/slugify` | 0 | showed one file, wrote nothing |
| `remove string/slugify --apply` | 0 | took it out |
| `init --dir src/toopo` → `add` → `list` | 0, 0, 0 | landed `1a8ae9d1…` under the chosen folder |
| `init --dir "src/my code/toopo"` → `add` → `list` | 0, 0, 0 | landed `1a8ae9d1…` under a folder holding a space |
| `init --dir ../outside` | **1** | refused, nothing written |
| `init --dir "C:\toopo"` | **1** | refused, nothing written |
| a committed `toopo.json` carrying `../outside`, then `list` and `add` | **1**, **1** | refused, nothing written |

**ADR-0208's own claim is confirmed from npm rather than from the tree**: a folder with a space
installs normally, and the file under `src/my code/toopo/` hashes to the announced blob.

## What moved since 19 August, in both directions

**One thing moved, and it is the path this unit was told to look at.** Measured on both sides, from
npm, in empty projects:

| | `toopo@1.0.4` | `toopo@1.2.0` |
| --- | --- | --- |
| `init --dir ../outside` | **exit 0**, writes `toopo.json` naming a folder *above* the project, and tells the reader to commit `../outside/` | **exit 1**, nothing written |
| every command after it | exit 1, *which is not a relative path inside the project written with forward slashes* | — |

That is ADR-0208 in one reading: `1.0.4` wrote a committed file the tool then refused, with a
sentence false of the string it was shown for; `1.2.0` refuses at the moment of writing and names its
cause. **It had never been run from npm**, by anything here.

**Three things did not move.** The three working forms, their exit codes and the bytes they land;
`yarn dlx`'s failure and its cause; and the announced blob itself — `1a8ae9d1…` at `1.0.4` and at
`1.2.0`, measured, the file `1.0.4` writes hashing to the same value.

**And one apparent change was not one, which is the reading that had to be taken to say so.** `add`
in a bare project writes `toopo.json` and announces it, where ADR-0138's table records only an exit
code and a digest. Read against `1.0.4` it does exactly the same. **A behaviour a record did not
record reads exactly like a behaviour that moved**, and nothing but running the old version tells
them apart — which is the whole argument for keeping the old versions measurable rather than
reasoning from a diff.

## Considered Options

### Refused: a guard that installs from npm on every push

It reddens on three things and this repository owns one of them — a change in npm, a change in a
package manager, or a change in this package's dependencies. **A red nobody here can repair is a
notification wearing a gate's clothes**, and this list has refused that shape three times already,
most recently on a zone setting where a blocking reading would have stopped fifteen pushes on a state
no commit reaches.

It also costs a network dependency on a registry that is not the declared origin. `CLAUDE.md` keeps
`packaging/against-the-origin/` out of every battery precisely *so that nothing which replays depends
on one*, and that suite at least reaches a host this project deploys. And it wants bun, pnpm and
corepack-yarn installed on both runners, which is neither a dev dependency nor anything stage rule 3
has an opinion about.

### Refused: a guard after the publication

This is the one placement where the claim and the artefact coincide, because npm does not hold the
new version until `publish` has run. It is refused on the ordering rather than on the price: a red
would arrive **after** the irreversible act, and the whole of
[ADR-0109](0109-the-publication-holds-no-credential.md)'s job ordering exists to keep every reading
in front of it. A verdict that cannot stop what it judges is a monitor.

### Refused: nothing, on the grounds that the paragraph in *Where the project is* covers it

It is the state this unit found and it is what let three releases pass. That passage is about a form
being **broken**, it says so, and it declines to be a declaration anybody keeps.

## Decision Outcome

**The reading is re-taken, and what keeps it is a cadence attached to the only event that can
falsify it from this side.**

Every reading that has gone stale here went stale across a publication — `1.0.4` to `1.1.0` to
`1.1.1` to `1.2.0` — and between publications no change in this tree can move what npm serves. So
the table is re-read in the unit that moves `THE_PACKAGE_VERSION`, which is a deliberate act somebody
performs by hand exactly once per release and which `CLAUDE.md` already marks as the moment of
publication. That is cheap, it is attached to the event, and it is not a job.

**A convention with nothing under it is what the open list is for**, so the entry is written — the
entry ADR-0138 believed existed. It names what would close it, which is the half neither record had.

### What would close it, priced and not taken here

A guard cannot install from npm; it can refuse a reading older than the package. `THE_WAYS_TO_RUN_IT`
would carry the version its readings were taken against, and a guard would compare that with
`THE_PACKAGE_VERSION` — offline, with no network and no package manager. It does not establish that
`npx` runs, which nothing here can. It establishes that somebody looked since the last release, and
**it would have been red at `1.1.0`, at `1.1.1` and at `1.2.0`**, which is every occasion this entry
is about.

It is not taken in this unit. It adds a field to `AWayToRunIt` and decides what that table carries,
which is a design decision, and settling one inside a unit whose subject is a measurement is the move
the open list exists to refuse. Its own entry names it.

### What this unit found and did not repair

**The refusal on the `init --dir` path is false of where it says the value came from.** Both refusals
open *`toopo.json` carries "…" as its directory* — and on that path no `toopo.json` exists, nothing
is written, and the string arrived on the command line. The same sentence is **exactly true** on the
reading path: a committed `toopo.json` carrying `../outside` produces it verbatim, measured. So it is
one message written for one population and reused on another, which is this repository's own
recurring class arriving on the repair that closed the previous instance of it. The confinement is
correct in both cases — exit 1, nothing written — so what is wrong is the sentence and not the guard
behind it.

**The same sentence shows a string the reader did not type.** Typed `C:\toopo`, rendered
`"C:\\toopo"`.

**And one observation is published with its limit rather than as a finding.** The import line offered
for a folder holding a space is `import { slugify } from './src/my code/toopo/string/slugify.js'`.
Whether a resolver takes a raw space in a relative specifier **was not measured here** — these
projects hold no TypeScript and no bundler — and a sentence about it either way would be the thing
[ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) refuses.

None of the three is repaired. A repair inside the unit that measured would make it impossible to say
afterwards what was broken.

## What would reopen this

A publication reopens it by construction: the cadence above *is* the reopening, and a version reaching
npm with this reading uncorrected is the event the entry names.

A machine carrying `deno` makes a fifth entry measurable, and the table is still written to take one.

The whole yarn row disappears the day this package stops declaring `typescript` as a runtime
dependency, which is a decision about the archive and is its own unit.

And a reading in which one of the three working forms exits non-zero, or lands bytes that are not the
announced ones, is a defect on a surface a visitor meets first — it reopens this record and the
repair belongs in the same unit as the reading that found it.
