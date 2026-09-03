---
status: accepted
date: 2026-09-03
governs:
  - packages/cli/where-a-file-may-land.ts
  - packages/cli/configuration.ts
  - packages/cli/command.ts
  - packages/cli/breakage.ts
  - CLAUDE.md
confirmed-by:
  - battery: cli-install
    guard: a-directory-that-travels-is-accepted
  - battery: cli-install
    guard: a-directory-that-does-not-travel-is-refused
  - battery: cli-install
    guard: a-refused-directory-is-told-what-in-it-was-refused
  - battery: cli-install
    guard: the-folder-init-is-given-is-one-this-toopo-can-read
  - battery: cli-install
    guard: a-path-with-a-space-installs-normally
---

# The folder a project chose has an alphabet of its own, and the tool reads what it writes

## Context and Problem Statement

`CLAUDE.md` carried an entry saying that the directories this tool supports are not the directories it
accepts: `breakage.ts` declares `a-path-with-a-space-installs-normally` and the guard installs into
`src/my code/toopo`, while `configurationFaults` refused that same string when it read it back out of
`toopo.json`. It named two ways out — the alphabet widens for the directory, or `breakage.ts` stops
declaring it — and left the arbitration open.

The contradiction is older than ADR-0206 and was revealed by it rather than created: `configuration.ts`
declared `/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/` for itself before that unit, identical byte for
byte to the `A_PATH_INSIDE` it moved to. The rule changed address and did not change.

**Reading the code for the entry found two more defects, and the sharper one is not about the space.**
`command.ts` built the `Configuration` for `init` from `parsed.command.directory` and handed it to
`writeConfiguration` with nothing in between, so `--dir` reached a committed file unexamined. And the
refusal was false of the string it was shown for.

## Decision Drivers

- The published confinement may not be widened. `staysInside` and `under` are in a package published
  the same morning after a security review, and a served path's alphabet is a security boundary.
- A rule about what may be spelled is an allow-list, never an exception clause somebody remembers.
  ADR-0046 is the shape, and it holds because it does not enumerate.
- An entry closes on a measurement, and the intuition on the record — that a space is lost or refused
  at the edges of a segment depending on the platform — is a claim, not a reading.

## What the measurement found

**The three defects, with the real client, in temporary projects.** `packages/cli/toopo.ts`, node
v24.15.0, at `a2495c3`:

| `init --dir` | exit | `toopo.json` written | the next command |
| --- | --- | --- | --- |
| `src/my code/toopo` | 0 | yes | 1, refused |
| `C:\toopo` | 0 | yes | 1, refused |
| `../outside` | 0 | yes | 1, refused |
| `lib/toopo` | 0 | yes | 0 |

So this tool wrote a committed configuration it then refused to read, and one of those files named a
folder above the project — written by the tool whose whole rule is that it writes inside it. The
refusal it wrote them into is false as well: `src/my code/toopo` **is** a relative path inside the
project written with forward slashes, which is the whole of what the sentence named.

**The space, in three positions, on two platforms.** One script, NTFS on `C:` under node v24.15.0 and
ext4 on a disk-backed volume under node v24.20.0, nine spellings each — `code`, `my code`, ` code`,
`code `, `code.`, `.code`, `co..de`, `code-`, `Code`:

**nine of nine rendered back under the name they were asked for, on both, with the file under each read
at the path that asked for it.** On Windows `code ` and `code` are two directories and not one:
`existsSync` answers `false` for the trimmed name. **The intuition is refuted under node** — libuv does
not go through the Win32 path normalisation that drops a trailing space or dot.

**The published confinement, asked about the directories the configuration refused.** `under` composes
**the place that was asked for** for `src/my code/toopo`, `src/ code/toopo` and `src/code /toopo`, and
**refuses** `../outside`; `realpathSync.native` returns every one of them unchanged. And
`git check-ignore -q --` with `shell: false`, the one subprocess an install hands a user's own folder
to, answers `status=1`, `error=none`, empty `stderr` for a space, a leading space and a leading dash.

**The reading that cuts the other way.** `staysInside('src/code./toopo')` is **true** today. The
published alphabet already admits a segment ending in a dot, so refusing a space for anything about
where it sits in a segment would be refusing a character for a reason the alphabet does not apply to
itself.

## Decision Outcome

**The configured directory has an alphabet of its own, one character wider than the served path's.**
`A_DIRECTORY` is `A_PATH_INSIDE` and a space; `travels` is the predicate; `staysInside`, `under` and
`A_PATH_INSIDE` are untouched. The two are separate because the two fields answer two questions: a
served path describes what the catalogue holds, and a directory is the project's own decision about a
folder on its own disk, owing nothing but to mean the same folder on every machine that checks the
project out.

**An alphabet that refuses a character it cannot show a harm for is narrower than its own reason.**
That is the argument, and the measurement above is the whole of what carries it.

**`init` reads the folder it is about to write.** `configurationFaults` is asked of the configuration
before `writeConfiguration`, so the one command that names the folder is held to the rule that reads it
back.

**A refused directory is told what in it was refused.** `theDirectoryRefusal` has five arms, ordered so
that each sentence is true of the string it is shown for: empty, absolute, a backslash, a `..` segment,
and last the alphabet, which names the offending character by asking `A_DIRECTORY` about one character
at a time rather than restating it.

### What is admitted, and what is still refused

Admitted: the space, in every position. Nothing else moved.

Refused, and by not being in the alphabet rather than by a clause: an absolute path and a drive letter,
a backslash — a separator on Windows and an ordinary character in a name everywhere else, so one
committed string naming two places — the characters Windows reserves, every control character, an empty
segment, and a `..` segment.

**And everything outside ASCII, refused because it is unmeasured rather than because it was decided.**
macOS normalises a name to NFD where Linux keeps the bytes it was handed, so a directory committed as
`é` in NFC would come back spelled otherwise, which is exactly the failure the rule exists to prevent.
No macOS reading was taken. It is an absence with a date on it.

### Three shapes refused

**A rule about position.** *A segment may not end with a space or a dot* was the shape to reach for if
the intuition had held. It did not hold, and `src/code./toopo` is admitted by the published alphabet
today, so the rule would have been narrower than the one beside it for a hazard neither platform shows.

**`within` holding whatever a folder is called**, which is what `under`'s own comment claimed. A folder
may be called anything a filesystem accepts, including a name with a newline in it, and this string is
printed on a screen and written into a committed file. The comment overstated and is corrected.

**Factoring the `..` clause out of `staysInside` and `travels`.** The two predicates now differ by one
character and share a shape, and one function serving both would be one edit reddening the served path
and the configured directory at once — which is ADR-0203's rule that a cell aims at a choice and never
at a mechanism two claims share. `C-76` is the cell that would have been blunted.

## What keeps it

Three guards were added and one was rewritten as a declaration. `a-directory-that-does-not-travel-is-refused`
is now a table keyed by what each row is *about*, in the shape `where-a-file-may-land.test.ts` already
uses, and it asserts that each row is refused **exactly once** — two faults for one directory is a rule
answering twice. `a-directory-that-travels-is-accepted` is the other direction, so the first cannot be
satisfied by a rule that refuses everything. `a-refused-directory-is-told-what-in-it-was-refused` reads
the cause and never the sentence. `the-folder-init-is-given-is-one-this-toopo-can-read` runs the real
entry point.

**Each was seen red, alone, on the whole suite, before it was written down.** Four cells were written
from those four readings — `C-80` takes the dot out of `A_DIRECTORY`, `C-81` stops a field that is not
text being a fault, `C-82` calls a path absolute only where both platforms agree, and `C-83` is the
`init` defect put back:

| cell | red | control |
| --- | --- | --- |
| `C-80` | `a-directory-that-travels-is-accepted`, alone | green |
| `C-81` | `a-directory-that-does-not-travel-is-refused`, alone | green |
| `C-82` | `a-refused-directory-is-told-what-in-it-was-refused`, alone | green |
| `C-83` | `the-folder-init-is-given-is-one-this-toopo-can-read`, alone | green |

`C-80` drops the dot rather than the space, and that is what keeps it alone: the space is the row the
`init` guard installs into, so taking it out would redden two guards and the cell would stop aiming at
one thing.

**`C-30`'s anchor moved with the rule and its pin was re-measured rather than re-reasoned.** It reddened
one guard and now reddens three, because it stops the rule being asked at all. Its replacement asks
`travels` about a folder it made up instead of deleting the call, so both imported names stay read: a
mutant the compiler refuses comes back `killed-by-typecheck` and witnesses nothing, which is `C-79`'s
note one cell along.

**The accounting cost twelve answers for three guards.** `packages/cli` is collected by four batteries.
`cli-install` answers with `C-30` and the four new cells; `cli-update`, `cli-remove` and `cli-search`
each declare the three in the region they already declare the configuration's other guards in — and
none of their surfaces was widened to reach them, which is the trap ADR-0206 recorded.

## Consequences

**Two behaviours of the published package move, and neither is the confinement.** `configurationFaults`
accepts a `toopo.json` that `1.1.1` refuses, and `init` refuses a `--dir` that `1.1.1` wrote. The call
graph is what says the security boundary does not move: `staysInside` has five callers — `lockfile.ts`
twice, `plan.ts`, `configuration.ts` and `under` — and only the configuration's changed, which is not
on the path from a served string to the filesystem. `under` recomposes and re-compares every write
whatever the configuration said.

**The rank is MINOR and it is the owner's.** The `init` repair alone is PATCH. Accepting a directory
that was refused gives a reader something they did not have, which is what `publication.ts` calls
MINOR. `THE_PACKAGE_VERSION` is not moved here.

**No digest moves**, measured: `npm run freeze` is green either side.

**The alphabet is now a thing that grows.** It grew by one character because one character was measured.
Nothing anticipates the next, and the module says so where somebody would reach for it.

## What would reopen this

- **A macOS reading of the nine spellings**, which is the one absence this record declares. If a name
  survives NFC there, the ASCII bound is a decision rather than an absence and has to be argued as one.
- **A character somebody asks for and can show does no harm.** The alphabet grows by measurement, and
  the form of the measurement is in this record.
- **A published path whose alphabet the catalogue widens.** `CLAUDE.md` carries the open entry that
  nothing keeps the catalogue's own file names inside `A_PATH_INSIDE`; the day that filter opens, the
  two alphabets are asked a question this unit did not ask.
- **A second reader of `travels`.** It has one caller. A second would make it a boundary rather than a
  field's own rule, and the argument for two alphabets would have to be taken again.

## More Information

ADR-0206 is where the alphabet moved and where the threat model that scopes this one was committed.
ADR-0046 is the allow-list shape. ADR-0203 is the rule that a cell aims at a choice, which decided
against factoring the two predicates. ADR-0039 is *a refusal that explains is a door*, which the five
arms are for.
