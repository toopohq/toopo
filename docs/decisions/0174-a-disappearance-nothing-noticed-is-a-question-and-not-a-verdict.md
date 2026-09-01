---
status: accepted
date: 2026-08-28
governs:
  - packaging/reachable.ts
confirmed-by:
  - battery: site
    guard: every-address-a-page-links-to-is-composed-and-never-typed
---

# A disappearance nothing noticed is a question, and not a verdict

## The criterion, written before it was applied

This section is first because it is the only part of this unit that will still be doing work in two
years. The eighteen deletions below are its application; what a session needs when it next asks *what
here is dead* is the rule, not the list.

> **A thing is dead when nothing in this repository would notice its removal.**
>
> *Notice* has exactly three spellings here, because there are three ways of reaching something:
>
> 1. an `import`;
> 2. a **path** — a `node <file>` step in a workflow, a path handed to a spawner, a path handed to a
>    reader;
> 3. a **name in prose** that a guard resolves.
>
> **Only the first is walkable.**
>
> And the half that keeps this from being a purge:
>
> **An unnoticed removal is a question, not a verdict.** It has three answers, and only one of them
> is *delete*:
>
> | verdict | what it means | what to do |
> | --- | --- | --- |
> | **dead** | nothing was owed the noticing | remove it, with the reason in the commit |
> | **unwatched** | something *was* owed it — what has been found is a missing guard | write the guard, or the entry |
> | **declared silent** | this repository has already said it is unread, and where it says so | leave it, and make the saying reachable from the thing |

The second half is the whole of it. In a repository whose thesis is that a green guard over a broken
subject is a defect of the product, *nothing reacted* is precisely the reading that may not be taken
as a clearance. Every tool that answers this question answers only the first spelling, and every
tool reports its answer as a verdict.

## Context and Problem Statement

The owner asked for a purge:

> Il faudra purger tout ce qui ne sert pas/plus dans le projet. Beaucoup de choses ont été faites,
> mais beaucoup ne servent plus je pense.

He is right about the gap. Measured at `b1fcff6`: this repository has **no dead-code mechanism of any
kind**. No `knip`, no `ts-prune`, no `depcheck`. `tsconfig.json` carries `strict: true` and neither
`noUnusedLocals` nor `noUnusedParameters`. The only pruning that exists is `packaging/reachable.ts`,
and it decides what leaves in the npm archive rather than what lives in the tree.

So permanent convention 5 — *delete obsolete or dead code in the same change that touches its area* —
is a rule with nothing holding it, which is exactly the class this repository's own open list exists
to track.

**And the naïve answer is worse than none.** The manifest declares a `bin` and no `exports`, so
nothing here is importable from outside, and almost nothing is imported by production code: most of
`packages/registry/` is reached only by its suites and by the instrument. *Reachable only from a
test* is the normal state of this repository. A tool run without a criterion returns a list that is
enormous and almost entirely wrong, and deleting from that list breaks things no guard watches.

That is why the criterion is the deliverable and the deletions are not.

## Considered Options

**Run a dead-code tool and read its output.** Refused before it was run, on the paragraph above. It
answers spelling 1 and reports the answer as a verdict, which is the shape of the mistake rather than
a step towards avoiding it.

**The two compiler flags.** `noUnusedLocals` and `noUnusedParameters` are already installed — they
are flags of the compiler this repository pins as a runtime dependency — and all six project
configurations extend the root, so one line reaches every tracked `.ts`. Measured before proposing:
the tree is **not** clean under them.

**A rule for unused exports: *a name mentioned by the signature of an exported declaration stays
exported*.** Proposed because it is derivable, which is what a guard needs. Measured before adopting,
and refused on the measurement — below.

**Delete nothing.** Refused: four defects came out of these readings, three of them real and one of
them latent in code a reader is served.

## Decision Outcome

The criterion above, and the three populations it names, each measured at `b1fcff6` with the
population it was taken over.

### The two flags: 18

`tsc --noUnusedLocals --noUnusedParameters` over the six projects, distinct after the overlaps
between projects are removed: **18**. Nine residual imports left by units that moved something, seven
constants, one local variable, one parameter.

### The files: zero dead out of 302

A walk with `packaging/reachable.ts` — this repository's own walk, reused rather than restated —
seeded with 158 entry points: every test, every battery by name because `measure.ts` reaches them
through a templated `import()` no walk can see, every vitest configuration, and the six commands.

```
tracked .ts  302     reached  293     unreached  9
```

**All nine are alive**, each by a spelling the walk cannot follow: three `print-*.ts` run as `node
<path>` in `suites.yml`, `packages/cli/a-client-over-http.ts` spawned as a child process by
`how-a-command-ends.test.ts`, and five `packages/validation/fixtures/*.ts` handed to `readSources` as
paths. That is where spelling 2 of the criterion comes from: it was not reasoned about, it was what
the nine turned out to be.

### The exports: 1 065 declared, 135 that nothing else mentions

Exact inventory by the parser, through this repository's one door onto the compiler; conservative
usage, by occurrence of the name as a word in any other tracked file. The error is declared and
one-directional: this can miss a dead export and can never invent one.

Of the 135, **14 are frozen** — eight under `contracts/` and six in the two shared harness files —
and are out of reach for the life of their majors whatever they look like. **Thirteen occur exactly
once in their own file**, which is the declaration and nothing else.

### The rule for unused exports is refused, on its own measurement

The population is the **109** names that are not frozen and that their own file uses. The rule spares
**86** and reaches **23**.

| | spared | reached |
| --- | --- | --- |
| types | 86 | 1 |
| values | 0 | 22 |

**It spares 86 of the 87 types and none of the 22 values.** It therefore separates nothing that the
question *is this a type?* does not already separate — it is the type/value split with machinery in
front of it, which is a justification wearing the shape of a rule. Refused, and named here so that
the next session that reaches for it meets the measurement rather than the elegance.

What replaces it is not the other two options either. Removing all 109 `export` keywords is available
and is a unit of its own: it is 109 edits across six packages, it moves no behaviour, and landing it
beside eighteen deletions would make every change in the diff unrecoverable. It is written into the
open list with this measurement beside it.

## Consequences

**Eighteen deletions over two commits**, each with its reason in the commit that makes it, and the
eighteen are exactly the eighteen the flags name. Twelve first: nine residual imports, two test
constants, and `isAFile` — a one-line alias of `isSourceFile` that nothing reads, in a file where both
its neighbours carry a comment and it carries none. Six after, once turning the flags on had refuted
the argument for keeping five of them: the five battery constants below, and one leftover `reading` in
`pages.test.ts` whose guard had moved its check to `underEachHeading` three lines further down.

**The two flags are on.** `noUnusedLocals` and `noUnusedParameters` in the root configuration, which
all six projects extend, so one line reaches every tracked source and a seventh project inherits it by
existing. Seen biting before it was believed: a planted unused local reddens `tsc -p tsconfig.json`,
and every suite is green with the flags live — registry 459, validation 29, cli 181, site 180,
packaging 23, root 718.

**Two defects repaired**, and neither is tidying.

`packages/validation/fixtures/tsconfig.json` extended a path that does not exist, so the analyser read
its submissions under a compiler configured by nobody, silently, for the whole life of the file.

`packages/site/domain-page.ts` typed `../../` into one of two sibling link builders where the other
composed `rootFrom(own)`. The two agree today to the character, so every rendering was correct and
every guard was green; they part on the day a domain page changes depth. ADR-0059's rule was already
written and nothing held it. `every-address-a-page-links-to-is-composed-and-never-typed` holds it now,
reading the site's modules as syntax trees and telling a module specifier from a link — 72 of the
former against one of the latter, measured. W-136 is the defect restored as a cell, and it is the
rarest shape that battery carries: a mutant that changes no byte of the emitted site.

**A guard was taken and a guard was refused, and the difference is where it would live.** The link
guard is cheap: the site suite already imports `readSources`, the population is exact, and the defect
had survived every gate. A guard resolving every tsconfig's `extends` would have to live in the meta
suite, which no battery injects into — born unwitnessed, which this repository refuses without an
argument. Taking that trade inside a unit about dead code would be deciding what the meta suite is
worth as a side effect, so it is an entry with its price instead.

**What is kept, written where the next tool run will meet it.** Four families look exactly like dead
code and are not: the fixtures, the `print-*.ts` scripts, `a-client-over-http.ts`, and the unread half
of `attestation.ts` — whose justification lives in `read-api.ts`, one file away, so that the module
itself said nothing about why half of it is unread. That link is repaired.

**Five battery constants were going to be kept, and turning the flags on is what refuted that.** This
paragraph is the reversal rather than a tidied version of it, because the reasoning that was wrong is
the part worth reading.

`DETERMINISTIC` and `CALL_HISTORY` in `number-round.battery.ts`, `SYMMETRIC` and `ORDER_IS_NOT_READ`
in `object-deep-equal.battery.ts`, and `THE_ORIGIN_IS_WRITTEN_ONCE` in `site.battery.ts` are four
guard addresses and one mutant's find text that no cell names. Git settles what the artefacts cannot —
`npm run tally` refuses all 22 as measured before the commit they would describe — and each occurs
**once** in its file at the commit that introduced it and once today, where used siblings occur 2, 3
and 6 times and have never moved. **They were never used, ever.**

From that the verdict *unwatched* was drawn, on `attribution.ts`'s own instruction that reading an
unaccounted guard *produces mutants instead of deletions*. **It was the wrong verdict, and what shows
it is an argument from the gate rather than a new measurement.** The four strings are real guard
identifiers — `properties.test.ts` declares `determinism` and `no-ambient-input-from-history` for
`number/round@1`, and `p2-symmetric` and `p5-order-of-declaration-is-not-read` for
`object/deep-equal@1`. A never-red guard that no battery declares under `unreachableGuards` or
`unprobedRegions` lands in the *unaccounted for* bucket and fails the run; `number-round`'s
`unprobedRegions` is empty and its `unreachableGuards` name neither. Every battery ran green before
`toopo@1.1.0` reached npm. **So those guards are red — they are simply never pinned**, which the
five-or-fewer convention makes ordinary, and which `attribution.ts` states about these two by name:
*red only on mutants that also redden everything else*.

They are therefore not addresses awaiting a cell. They are names prepared for pins that a convention
made unnecessary, which is the *dead* verdict, and they are removed with the other twelve.

**What survives the reversal is the finding underneath it**, and it is `attribution.ts`'s and not this
record's: two of those guards have never been seen red on their own failure condition. That is a real
gap, it is recorded where it was found, and a dangling constant was never what recorded it.

## Confirmation

`every-address-a-page-links-to-is-composed-and-never-typed` was seen red on the defect itself before
its green was believed, naming the file and the reason. The criterion is not confirmed by a guard and
cannot be: it is the rule by which a reading is classified, and this repository refuses a guard over
its own prose in four separate entries of the open list. What holds it instead is that every count
above carries the population it was taken over.

## What would reopen this

**A fourth spelling of *reached*.** Three are named because three is what the nine unreached files
turned out to need. A file reached by a fourth route — a dynamic specifier built from data, a path in
a configuration file nothing here parses — makes the criterion incomplete rather than wrong, and the
repair is to name it.

**A dead-code tool entering this repository.** The criterion is written for a reader; if one is ever
admitted as a dev dependency under stage rule 3, the question becomes which of its verdicts may be
believed, and this record is what that decision is argued against.

**The 109 exports being taken.** That unit would either adopt a rule this record refused, or remove
every `export` keyword in the population, and either outcome supersedes the measurement above.

**A guard becoming cheap in the meta suite.** The `extends` guard is refused on where it would live
and not on what it costs. A battery that injects into `mutation/` reopens it, and so does any decision
about what an unwitnessed guard is worth.

## More Information

The measurement of what the refused rule spares was taken with a probe written for it and kept out of
the repository, per stage rule 5. It reused `readSources` and `everyNode` rather than a second parser,
which is ADR-0026 applied to a reading rather than to shipped code.

ADR-0059 is the rule the link defect broke. ADR-0142 is the entry the unused `THE_IMAGINED_ROOT`
belongs to — a declaration written *so that a caller does not transcribe the name*, with eleven
callers transcribing it. ADR-0149 is the templated `import()` that made the batteries need seeding by
name.
