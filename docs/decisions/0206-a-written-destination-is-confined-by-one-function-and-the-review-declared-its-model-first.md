---
status: accepted
date: 2026-09-03
governs:
  - packages/cli/where-a-file-may-land.ts
  - packages/cli/write.ts
  - packages/cli/lockfile.ts
  - packages/cli/reconcile.ts
  - packages/cli/relocate.ts
  - packages/cli/rewrite.ts
  - packages/cli/plan.ts
  - packages/cli/configuration.ts
  - packages/registry/publication.ts
  - CLAUDE.md
confirmed-by:
  - battery: cli-install
    guard: every-shape-that-is-not-a-place-inside-is-refused
  - battery: cli-install
    guard: every-shape-a-served-answer-really-carries-is-admitted
  - battery: cli-install
    guard: a-directory-that-leads-out-of-the-project-is-not-a-place-a-file-may-land
  - battery: cli-install
    guard: an-ordinary-directory-is-a-place-a-file-may-land
  - battery: cli-install
    guard: a-lockfile-naming-a-file-outside-the-configured-directory-is-unusable
  - battery: cli-install
    guard: a-write-that-leaves-the-directory-is-refused-with-nothing-staged
  - battery: cli-install
    guard: a-removal-that-leaves-the-directory-is-refused-before-anything-is-written
  - battery: cli-install
    guard: a-served-path-that-leaves-the-directory-is-refused-by-the-plan
  - battery: cli-install
    guard: a-served-path-that-leaves-the-parsing-project-is-refused-before-it-is-written
  - battery: cli-install
    guard: a-relocation-of-a-path-that-leaves-the-folder-is-refused
---

# A written destination is confined by one function, and the review declared its model first

## Context and Problem Statement

This repository's open list held sixty-five declared limits and not one of them was about somebody
attacking it. Swept before the review began: no occurrence of `secur`, `attack`, `malicious`, `hostile`
or `traversal` anywhere in it. In a repository whose whole practice is to write down what it promises
and does not keep, that is either complete coverage or the one place it had never turned its honesty on
itself.

**What existed pointed the other way.** ADR-0046 governs what enters the catalogue - a whitelist of what
a pure function may name. Nothing governed what happens when the client writes into somebody else's
project, which is the only thing this product does to a stranger's disk.

So the unit was a review of the outgoing path, and it was not a bug hunt: the instrument already
measures whether guards catch defects, over hundreds of injected cells across 23 batteries. What no
battery poses is whether the *design* refuses a hostile input.

## Decision Drivers

- **A model written after the findings bends to them.** So the threat model was committed at `9942756`,
  as the message of a commit touching no tree, before a line of `packages/cli/` had been read in the
  session. It declared the hostile set, the trusted set with the digest chain written out rather than
  waved at, the out-of-scope set, what counts as a finding, and - the half that is harder and is the
  reason a negative would have been believable - **what counts as a negative**: a class is answered
  negatively only by naming the code that refuses it, and a grep that found nothing is not a negative.
- **A review that always returns a list is a verification that cannot fail.** So is one that cannot
  return one. Both directions were publishable and the acceptance rule was fixed in advance.
- **The population is derived, not believed.** The brief that opened the unit named seven coordinates. A
  walk from the published entry point `dist/packages/cli/published.js` reaches **40 modules**, and it
  corrected the brief in both directions: `temporary-project.ts` is a test fixture the entry point does
  not reach, while `remove-directory.ts` does, and so does `ignored.ts`, which spawns the one subprocess
  an install makes.

## What the reading found, and why a digest cannot cover it

Six places composed a filesystem path out of the project root, the configured directory and a path that
arrived from somewhere else. None of them asked anything of the third part.

| where | what it does with it |
| --- | --- |
| `write.ts` | the destination of every file a command writes |
| `write.ts` | the path of every file a command removes |
| `lockfile.ts` | `digestOnDisk`, read by the install, the reconciliation and the relocation |
| `reconcile.ts` | `installedText`, whose answer goes into a diff a person is shown |
| `relocate.ts` | the read a folder move makes of every file the lockfile claims |
| `rewrite.ts` | the staging write into the parsing project, the first write an install makes |

Two fields feed them and both are somebody else's string. The **served** path, which reaches
`destinationOf` and is composed with the contract's name - so *both* halves of a destination are the
registry's, which is why the confinement is asked of the composed result rather than of either. And the
**recorded** path in `toopo.lock`, whose only check was `typeof value === 'string'`.

**The digest chain is a real mitigation and it cannot reach this.** `servedSnapshotFaults` recomputes
that a snapshot body canonicalises to the digest that was asked for, `servedBlobFaults` does the same for
bytes, and `declarationFaults` compares the three parts of an address. All three are checks about
*content* and about *identity*. A destination is neither: the path is a field *inside* the content the
digest attests, so an answer naming any path at all hashes to whatever it hashes to and passes every one
of them. That is not a hole in the chain. It is what a content address is for.

`diskStanding` is the mitigation that does bite, and its limit is worth stating exactly: it refuses to
overwrite a file the lockfile does not claim whose bytes are not the ones this install would write. So
replacing an existing file was already closed. Creating one that does not exist was not.

## The two probes, and the one that inverted the prediction

**The reading predicted that a served path reaches `write.ts`. It does not.** Driven end to end - the
real `run`, the real HTTP client, a real socket, and a registry answering a snapshot of its own making
whose digest is recomputed over the body it serves - the install **refused, exit code 1, printing
*Refused, and nothing was written***. The refusal came from an unrelated rule: `rewrite.ts` stages the
fetched sources into a temporary parsing project first, the path left that project, and `readSources`
refused a file outside the compiler's program under *a file that is not read passes every rule for the
wrong reason*.

**And a 3 332-byte file was on disk outside the project when it did.** `rewrite.ts` writes before any
install decision is taken, and its `finally` removes the directory it made rather than what was written
outside it. So the refusal a person reads and the bytes on their disk were two different facts. That is
the frontier the reading had counted as a writer without connecting to the served path, and only the
probe found it.

**The second probe decided the severity, and it needs no network at all.** A `toopo.lock` of the shape a
cloned repository can carry, and `toopo init --dir x`: **exit code 0, the success screen, `1 file
moved`**. A file of the user's outside the configured folder was read, written elsewhere, and the
original removed. `verdictOf` compares the file at the source against the file at the destination and
never against the digest the lockfile records, so nothing had to be known about the target.

## The four classes

**A symbolic link at the destination.** Found, and measured in one of its two halves. A **junction**
standing at `lib/toopo` made a write land outside the project while the report printed
`lib/toopo/ordinary.ts`, which reads as inside. The other half - a link standing where the file itself
goes - **is not measured on this platform**: `symlink` answers `EPERM` on Windows without the privilege,
and it is declared unmeasured rather than deduced from the reading that says `renameSync` replaces a link
rather than writing through it.

**A redirect, and a host other than the declared origin.** Answered by code. The authority of a request
URL cannot be steered by an address: `pathTo` always leads with `/`, so `${origin}${pathOf(...)}` stays
on the host the entry point named; and the address sent is never the string a user typed,
`chooseContract` matching it against the index first. What remains is that `fetch(url)` takes no options,
so redirects are followed to any host - and issuing one requires already being the origin, which is the
declared root of trust for exactly two answers. A robustness note, on the open list rather than repaired
here.

**The size and the type of an answer.** `response.json()` bounds nothing and asks nothing about the
content type. That is a denial of service, which the committed model placed out of scope - and it is
recorded that way rather than promoted after the fact, because a model that widens once the findings are
in is the thing this unit was built not to be.

**A leak in a refusal.** Found. `installedText` read the same unconfined composition and its answer went
into a diff that is **printed**. The verdict that prints one asks only that the lockfile claim the path
and that the digest it records not match what is there - both of which whoever wrote the lockfile
chooses. Closed by the confinement at both ends.

## Decision Outcome

**One function, and the six frontiers call it rather than each carrying a check.** Two controls written
separately diverge the day one of them is edited, which is the whole reason this is a composition and not
a validation.

**The rule is an alphabet and not a list of what is refused**, which is ADR-0046's shape one folder
along: a leading slash, a drive letter, a UNC prefix, a backslash, a colon, a control character and an
empty segment are all *outside* the alphabet rather than each being a clause somebody remembered. `..` is
the one sequence an alphabet cannot exclude, because it is spelled out of characters a filename needs, so
it is refused as a **segment** - `a..b` is a filename and `..` is not.

**It refuses rather than repairs, and this repository had already decided that.** `configuration.ts`
carried the argument before this unit existed, about the one field of the three that already had a rule:
*backslashes are refused rather than normalised... silently repairing it here would leave the committed
file saying something this tool does not mean.* The same sentence decides the other two and is stronger
there. A path is written into `toopo.lock` as the record of what landed, and the product rests on that
record describing the disk: a run that corrected a path would have to write down the correction, which is
a file nobody asked for under a name nobody chose, or write down the original, which is a lockfile that
lies. Refusing has neither branch. The asymmetry settles what the argument would leave as a preference -
a refusal costs one sentence somebody can act on.

That rule is now stated once. `configuration.ts` lost its own copy and reads this one, and
`a-directory-that-does-not-travel-is-refused` - older than this unit - reddens when the shared rule is
removed. That is what says they are one rule rather than two that agree today.

## Three things the measurement caught that reading did not

**Comparing against a resolved base accepts a linked directory.** The first `under` asked whether the
file stayed under the *directory*; a junction resolves, and the file is then faithfully inside a
directory standing somewhere else. It takes the root and the directory apart now, because the project
root is the one part of the composition this process chose and therefore the one thing an answer can be
measured against.

**The first refusal could answer nothing.** Written as the faults *about* a path, it re-derived the
verdict from the string - so a path refused because its directory led out of the project came back with
nothing to say, and the command wrote no file and gave no reason. **A silent confinement, committed
inside the repair that exists to prevent one**, and found by a probe rather than by a reread.
`theRefusal` answers unconditionally now, and its two arms are the two ways out of `under` because they
are two different things for a person to do something about.

**And a guard caught the third.** The first shape asked the alphabet of the configured directory as well
as of the path, and `a-path-with-a-space-installs-normally` refused it: a project at `src/my code/toopo`
is one this tool supports. The directory is the project's own decision, read once by
`configurationFaults`; what it still cannot do is lead out of the project, and that is the comparison
rather than the alphabet.

## What keeps it

Ten guards. With the rule removed, **9 of 191 red across 6 files** - eight of the ten, plus the older
configuration guard. The two that stay green under that perturbation are the two that must: they assert
what is *admitted*, which is what stops the refusing guards from being satisfied by a rule that refuses
everything. The link guard builds a real junction rather than mocking one, and fails rather than passing
where the platform will not make one.

`packages/cli` goes 181 guards to 191, and seven cells were written to witness the ten: C-76 to C-79 in
`cli-install`, whose surface holds six of the seven callers, and U-36 to U-38 in `cli-update`, whose
surface holds three of them. `cli-remove` and `cli-search` declare the region instead, on a search rather
than on a judgement - measured by what each of the ten guards' five test files imports, which is none of
their modules.

## The release, and why PATCH is structural

`1.1.1` is `f64fe7f`, and the rank turns on an argument rather than on a sample. Every destination this
registry can compose is `${contract.name}.ts`: `referenceImplementationOf` filters an implementation's
files to the literal `reference.ts`, and `destinationOf` maps the entry file to the contract's own name.
`CONTRACT_NAME` is `[a-z0-9]` segments joined by `-` with one `/`, a strict subset of the alphabet, and no
segment of it can begin with a dot - so `..` is not spellable. **A `toopo.lock` written by any earlier
release therefore carries paths this rule admits, for every contract that could have been published.**

Measured beside that rather than instead of it: over the published catalogue 6 of 6 composed destinations
and 6 of 6 served paths; over the imagined graph, the only multi-file shape this repository holds, 6 of 6.
No digest moved - the ledger's twelve bindings are identical to the byte either side of the version, and
`npm run freeze` was green on both.

It published from run `33739832802`, 35 jobs green: `+ toopo@1.1.1` at `10:18:55Z` with a signed
provenance statement, and npm served it at `10:21:45Z`. `gitHead` is `5fb2d86` and resolves here;
`_npmUser` is `GitHub Actions`, so no keyboard touched it.

## What the release cost, which is a finding of its own

**The first attempt failed, and it failed twice for the same class in two different mechanisms.** Ten new
guards move `mutation/census.ts`, and nothing but a battery's calibration reads it: `pnpm run cli` was
green on 191 tests and said nothing, and nine CI jobs stopped at calibration having injected no cell.
Repairing the census then revealed the second half - the same ten guards had nothing reddening them, which
the batteries refuse a run on - because the first failure had hidden it.

**Four replays of `cli-install` were needed for one correct pin**, and each refused something different: a
pin written from a prediction, then a pin written from my own correction of it, then six declarations that
new cells had made false. Not one was found by reading a diff. Both halves are entries of the open list,
with the figure that makes the local step defensible: the calibration reproduces a runner's refusal line
for line in **twenty seconds**, against an hour of CI.

## Consequences

A path arriving from a served answer or from a `toopo.lock` is refused with a sentence naming it, and the
refusal happens before anything is staged - including for removals, which is why their confinement moved
ahead of the writes rather than sitting beside the `rmSync` that performs them.

The disclosure was held. The repair was committed at `24b2108`, the release at `f64fe7f`, and this record
- the only artefact that describes what the repair closed - was written after npm served `1.1.1`. Its
commits say what they do and never what they opened, which is responsible disclosure applied to a
repository's own history.

Three things the review named and did not take, and one class it could not measure, are entries of the
open list rather than clauses here, because a reader arriving at them needs the price and not the verdict.

## What would reopen this

**An implementation serving a second file.** The second half of the structural argument holds only while
`referenceImplementationOf` filters to a literal. The day a folder arrives beside the entry - the unit
`plan.ts` already names - the served spelling becomes whatever a contract folder holds, because
`harnessOf` reads the folder, and nothing keeps that alphabet and this one in agreement.

**A platform that will make a file link.** The half-class this unit could not measure is measurable on a
runner with the privilege, or on any POSIX machine, and the reading is one probe.

**A path this catalogue legitimately serves that the rule refuses.** That would not be a reopening of the
shape but of the rank: it would say `1.1.1` was not a PATCH. Nothing produces one today and the argument
above says why, structurally.

## More Information

ADR-0046 is the whitelist this rule takes its shape from. ADR-0039 is why a refusal explains rather than
reports. ADR-0111 is why a push declaring a version npm does not hold is what publishes. ADR-0203 is the
rule the seven cells were written under - aim at a choice and never at a shared mechanism. The threat
model is the message of `9942756` and is not restated here: it was committed before the reading, and
rewriting it afterwards would be the thing it exists to prevent.
