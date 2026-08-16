# Toopo

A registry of utility functions verified against public, executable contracts, distributed as
source code copied into the user's codebase.

A **contract** is the complete, executable behavioural specification of one function: identity,
TypeScript signature, property-based invariants, named and settled edge cases, and benchmark
profiles. The contract is owned by the registry; implementations compete underneath it and are
interchangeable.

The product of this project is the contract, not the utility code. **If the verification is
decorative, the project has no reason to exist.** That sentence is the acceptance criterion for
every change made here.

## Where the project is

**What exists.** The registry's data schema, its immutable storage and its read API, where every named
answer declares the revision that produced it. Stage 1 of the validation pipeline, and the conformance
controller beside it. The client, finished at six commands — `init`, `add`, `update`, `remove`,
`search`, `list` — with a two-phase write, a lockfile carrying two digests per file and the revision
each feature was resolved against, and a port whose four implementations are asynchronous. The
generator, seven static pages, four of them with a playground that runs this repository's own modules
with their types removed. The archive: compiled JavaScript and nothing else, whose size is no longer a
function of how many contracts exist. The emitted tree, which is every answer the read API can give,
written as files at the addresses a client asks. The instrument: nineteen batteries, their pinned
verdicts, and one command that replays them. And permanent rule 6, executable: a binding records the
commit it was published from, and the frozen half is rebuilt at that commit and compared rather than
transcribed anywhere. What this repository says about its own history now resolves against what git
holds rather than against what somebody checked: a commit identifier in the prose names a commit of
this graph, no object of it carries an address the project refuses to publish, and the only checkout
registered here is its root.

**What does not exist.** The publishing tool. Stages 2 to 7 of the validation pipeline. A host — the
published entry point names `THE_ORIGIN` and every answer it would fetch is written by the emission,
but nothing serves that tree. A second language. And nothing is published: `private: true` holds, the
package is not on npm, and every path on `toopo.dev` answered 403 when it was last measured. A reader
who meets `toopo add number/parse` on a contract page has no way to get `toopo`, and an installed
`toopo` has nothing to ask.

**The catalogue is five contracts** — `number/parse@1`, `date/add@1`, `array/group-by@1`,
`string/levenshtein@1`, `string/slugify@1`. The third is a format prototype that will not be published,
because ES2024 shipped `Map.groupBy` and it answers what the contract specifies; the refusal and the
rule it establishes are recorded. The fourth is the first whose properties are strong by nature — the
axioms of a metric — and its table is a third the size of the first's as a result. The fifth is the
first with no oracle of any kind: measured over fifty-seven samples, the four most used slug libraries
agree on seven, so nothing about its answers is true and every one of them has to be argued for.

**Project name: Toopo.** CLI command `toopo`, lockfile `toopo.lock`.

**What decides the next unit** is the list of what is still open, below, with what each entry costs.

## Where the reasoning lives

**A decision that has been taken is a record in `docs/decisions/`**, in MADR format, addressed by
number and cited as `ADR-0007` — never as a path. ADR-0001 settles the format, the two fields it adds
and the one section, and nine guards resolve what a record names in both directions. There is no index
here: the directory listing is the index, because the filenames carry the titles, and a second
statement of what the folder already says is one that drifts.

**What happened and when is `git log`.** The commit messages carry the measurements at length. This
file carried a second, shorter copy of them for a year; ADR-0062 is why it no longer does.

**What is below is what a session needs before it writes a line**: what is still open, the rules of
this stage, the permanent rules, the conventions, and the verification discipline.

## What the repository declares and nothing keeps — closes before the launch

One form, found four times in a single sweep and certain to be found again: **a thing that behaves
like a rule, with nothing making it hold.** The vocabulary for it already exists — `one-directional`
— and the list is kept here rather than scattered, because it is what the publishing tool has to
close. A published version is frozen for life, so a declaration that is decorative at launch is
decorative for ever.

**An entry is written in two halves, and the reason is that three times in one week a published
sentence of this repository was false — twice with the true sentence and the false one in the same
file.** That is not bad luck. It is a list in prose describing what the code does, and the code moves
while the list does not. The remedy costs two sentences, and this section is its own demonstration:
the record now at ADR-0017 named the pre-flight as the thing that would close
`benchmarks.profiles[].name`, the pre-flight was built, and nobody came back here.

1. **An entry names what would close it.** One that names no closing mechanism cannot be recognised on
   the day it closes, which is exactly how the entry below outlived its own closure.
2. **The change that builds such a mechanism sweeps this list for every entry naming it, and closes
   them in the same commit.** The mechanism and the entry are one event; separating them is what
   leaves the false half of a true sentence lying where somebody will read it.

**Entries that closed are recorded with the mechanism that closed them, in that mechanism's own
decision record.** Two closed by stage 1 of the validation pipeline and are in ADR-0005; three closed by
the two-phase write and are in ADR-0039; the class of a declared address nobody resolved closed in
ADR-0060; permanent rule 6 closed in ADR-0093, and it was never on this list; the three about what git
holds — a citation that resolves, an address no commit carries, a checkout nothing leaves behind —
closed together in ADR-0095, because all three are one walk over the same graph; and the playground
reading what a reader types closed in ADR-0096.

**That last one is the only entry this list ever carried that no guard could have caught**, because it
was a decision taken in conversation and written nowhere — the repository held no half for the code to
disagree with. It is also the entry that paid for itself twice over on the way out: closing it found
*two* published sentences of this repository false, both in the record that had argued the opposite
position, and both of the class the entry was about. One clause asserted that a raw text field could
not express a lone surrogate, which a browser refuted. The other was worse and was invisible to every
reader for a year — the two rows ADR-0028 printed to *demonstrate* that a no-break space and an
ordinary space carry opposite answers were **identical, byte for byte**, having lost the no-break space
somewhere they were written. A block whose entire purpose was to show two things differing showed the
same string twice, with two different reasons beside it, and nothing could have caught that either.

**That last one is the finding this section has to keep, because it is about the section rather than
about the entry.** *A published version is frozen for life* is the biggest `one-directional`
declaration this repository has ever carried — it is the whole security argument, every lockfile in the
world would hold the digest it moved, and it is what the product is sold on. It has been in this file
since the first commit, 367 commits before `74904ef`. This list has existed for 271 of them, for exactly
this class of defect, and it never named it. Ten entries at that commit, none of them the one that
mattered most.

So the rule the list adds to itself is not another entry. **A list that believes itself exhaustive is
more dangerous than no list**, because it is read as coverage: every session that opened this file saw
ten entries and a section explaining what the form is, and concluded that the form had been swept for.
Nothing here says how many instances exist, and nothing can. What a reader may take from this section is
that each entry it names is real; that it is complete is a claim no version of it has ever been entitled
to make, and this paragraph is the correction that stays.

**And the same shape arrived one level down, in a closure criterion rather than in this list.** Taking
the personal address out of the history was to be closed by *zero occurrences over the 374 commits* —
374 being what `git rev-list --count HEAD` answered. The rewrite had to reach **391**: three
`evidence/*` tags retain seventeen commits `main` does not reach, every one of them carrying the
address, and every one of them published by the first `push --tags`. The criterion would have gone
green over a branch
while the defect left by another door. What made 374 wrong is not a miscount but a population read off
whichever ref somebody was standing on, so: **a count that bounds a defect names the population it
swept**, and `--all` is the only spelling of *this repository* that a tag cannot fall out of.

**Still open, and what each one now costs.**

- **That an archive somebody installs really installs a feature**, which three guards kept until the
  catalogue left the archive and now nothing does. They compared the bytes a real `toopo add` wrote out
  of a real tarball against the bytes in `contracts/`, and they worked because the catalogue travelled
  inside the archive. It does not, so an installed `toopo` asks `https://toopo.dev`, and `THE_ORIGIN`
  is a constant with no override — deliberately, because the one thing a client cannot check by
  arithmetic is which digest a name resolves to, and an override is exactly what would move it. What
  `packaging/` still keeps is that the installed CLI runs, reads a project, writes one, names the
  published origin, and carries nothing the catalogue produces. **It closes on the first deployment
  that answers on `https://toopo.dev`**: on that day a guard there installs from the archive against
  the real origin, and the end-to-end proof comes back. It is written here rather than only in
  `packaging/` because this list is what a session reads, and because a regression presented as a
  choice is one nobody returns to. ADR-0092.
- **That no file of the tracked tree names the machine it was written on.** The sweep before the first
  push established it and nothing keeps it. **The population is the tracked tree and never the graph**,
  and that is the whole shape of this entry rather than a detail of it: measured at `2640b5d` over
  `git rev-list --objects --all`, seventeen blobs and one commit message carry a developer's home path —
  fourteen of the blobs `CLAUDE.md`, two `mutation/paths.ts`, one `vitest-entry-point.ts` — while HEAD
  carries none, every occurrence having been elided by hand as it was noticed. So a reading over the
  graph would be red the day it was written, and **those seventeen are what this entry will never
  cover.** Taking them out costs a second `filter-repo` over four hundred commits, and that was priced
  and refused knowingly: a folder path is not harvestable the way the address ADR-0095 removed is, and
  the given name it reveals is already published by the manifest, by `LICENSE`, by every installed
  header and by the `decision-makers` of every record in `docs/decisions/`. **What is worth keeping is
  the recurrence and not the frozen seventeen** — a stack trace pasted into a comment, a path copied out
  of an error message — and that arrives in the working tree, where a reading is green today and red on
  the day it happens. **It closes on that reading**, beside `refusedAddressFaults` in
  `mutation/history.ts`, whose halves are already this shape: a declaration of what is refused, a sweep
  over a named population, and a fault that reports where without reprinting what.
- **That the manifest declares no dependency the product could reach**, which stage rule 3 now states
  as a criterion and nothing reads. The two mechanisms that rule names are real and are about *files*:
  `no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` and
  `every-file-in-the-archive-is-loaded-by-a-command` ask what the tarball holds. Measured at the commit
  that added `wrangler`: no module of `packaging/` reads `dependencies` or `devDependencies` at all, so
  **a package moved from the dev list to the runtime one would be installed by every consumer and no
  guard would notice** — `dependencies` is the field `npm install` walks, and `files: ["dist"]` does not
  bound it. It closes on a guard over the manifest: the runtime `dependencies` are exactly the packages
  the published entry point imports, which `reachable.ts` already computes and nothing compares against
  the manifest. One file, and it is the cheapest entry on this list.
- `contractAnatomy` — triaged entry by entry against stage 1's own constraint, *readable in the source
  alone, without evaluating the module*: **three of the eleven are settled by the source alone, four
  need the module, four are a reader's and no stage will ever take them.** So the conformance
  controller is not "`contractAnatomy` made executable"; it is three entries, and a fourth stage that
  evaluates a vetted module takes four more. The triage is data on each entry and one guard keeps the
  half that can be kept — a new entry with no verdict is refused.
- `CLOCK_DEPENDENCE_RULE` — declared, cited in prose, imported by nothing executable. It is one of the
  four a reader keeps: which guards *can* depend on elapsed time is a judgement about what a defect
  could do to a guard.
- `benchmarks.profiles[].name`, **the content half of it and no longer the address half.** The
  address is closed and is recorded below with the mechanism that closed it. What stays open is that a
  profile's name makes a claim about its own samples that no guard reads: measured by leaving
  `small-integers` named `small-integers` and classed `accepted` while its samples became
  `['1e308', '0.000000000000001', '-1e-300']`, not one of them a small integer — 472 of 472 green in
  `contracts/`, and the one red in `registry/` was `the-served-bytes-are-the-committed-bytes` noticing
  that bytes had moved at all. It is GS-11's shape on a second field, so it closes where the two below
  close: the validation pipeline, the only thing that will ever read a declared name against what it
  describes.
- `outputAlphabet` of `string/slugify@1` and `benchmarks.profiles[].samples.producedBy`, the two
  `one-directional` fields the schema already carried, with GS-11 as the measurement. Closed by the
  validation pipeline, for the reason the entry above closes there.
- **The rule that an alias must not name what its contract refuses to be**, argued in ADR-0023, which
  also carries the criterion. The eight liars are gone, but nothing keeps it: the executable form
  needs each contract to publish its exclusions as data, which is a new frozen field on five contracts
  to buy a check that would still be matching words against prose. Looked for, priced, and declared
  rather than dressed as a mechanism — which is the treatment this list exists to give.
- **The rule that a report may not name a cause no measurement establishes**, whose nine instances are
  repaired and whose class nothing keeps. It closes **one sentence at a time**, and what closes a
  sentence is naming it in *Derive the sentence from the fact* above: three are there, so those three
  cannot drift and the rest are prose that can. That is the recognisable event this list asks an entry
  to carry — a sentence leaves this rule's reach on the day it is computed from what it claims, not on
  the day somebody rereads it. The class-wide form is the one that is refused: the sentences are
  authored in fourteen modules and only their presentation is shared, so a guard would be a lint over
  thirteen files judging prose, at the price the alias rule above was refused at. What would close
  *that* is a validation stage reading this repository's own strings the way stage 1 reads a
  submission's — named so it can be recognised, and not built.
- **What files a contract's declaration may name**, which is narrower than it first looked and is
  recorded with the measurement that closed the wider reading. *A contract is the folder and not a
  file* is kept, in both directions: `harnessOf` refuses any disagreement between a contract's
  declared `files` and what is on disk, and a stray file dropped into `contracts/typescript/date/add`
  reddens **50 guards** under `UndeclaredHarness: … present and not served: stray.ts`. The five are
  not the same list — four carry seven files and `array/group-by@1` carries nine — and that is
  declared rather than drifted: `THE_SEVEN_FILES` is spread into all five, the two extras are written
  beside it as `[...THE_SEVEN_FILES, 'language.test.ts', 'outcome.ts']`, and the constant's own comment
  says they are its own. What nothing keeps is one level up: **the declaration is checked against the
  folder, and nothing checks the declaration.** A sixth contract may name a tenth file and put it
  there, and both halves will agree. Closed by the same thing the entry above it closes by — a
  validation stage reading a submission's folder against what `contractAnatomy` requires of one —
  because the judgement is whether an extra file is a contract's own or somebody's leftover, and that
  is not a shape.
- **The rule that a pin names what is red on every run**, argued in ADR-0076, whose *instance* closed
  and whose *class* stays open. The instance was `G-14` of `string-slugify` pinning
  `p1-two-spellings-one-slug`; that pin is gone, and `G-02`’s was repaired by widening an alphabet
  rather than raising a draw count, with the new rate published as an order and not as a figure — both
  arguments are in ADR-0053. What no mechanism keeps is the general case: a battery sees one draw, so
  any pin is still checked against the run that wrote it, and closing that would mean four runs of
  every cell — the 23-minute replay taken four times. Priced, declared, and not built.
- **A reproduced miss rate that disagrees with what the runs show, by a factor nothing accounts for.**
  It is a fact about the *method* rather than about the cell that revealed it, which is why it does not
  close with that cell’s pin: the same reproduce-and-predict method justifies every pin on a
  property-based guard. Both cheap explanations were eliminated in situ and the model was thereby
  *confirmed*, predicting one silent run in about 6 200 where direct observation gave one in 500;
  pooled over roughly 1 093 trials the model carries a likelihood near 1.3 %. **Unlikely, not excluded,
  and unexplained.** Settling it needs about 5 000 real passes of one cell, roughly an hour and a half.
  **Priced and not spent, on the rule this gap itself produced: a measurement that enters no decision
  is not bought at any price.** ADR-0077 carries the method’s limit and the rule that a repair is
  chosen for its margin rather than its precision; it will enter a decision the day a repair is close
  enough that the factor decides between two candidates.

## Rules for this stage

1. **The registry is being designed one piece at a time, and the order changed once, deliberately.**
   It was data schema, then immutable storage, then the read API, then the publishing tool, with the
   CLI and the website after all four. The first three are written. **The CLI then moved ahead of the
   publishing tool and of stages 2 to 7 of the validation pipeline**, and the argument is the one the
   decision to launch at five rests on: every remaining uncertainty is on the user's side, and none of
   them is answerable in private. Continuing the pipeline first would have been acting against the
   reason that decision was taken — the pipeline judges submissions, in a closed phase there are none,
   and the five contracts are already measured by their own batteries.

   A second argument decided it, and it is a lesson from this repository rather than a preference:
   **a defect in this schema has never once been found by looking at the schema.** Every one was found
   by a consumer trying to use it. The list is here, named, and it is the whole of it — see below for
   why it is a list and not a number:

   - `dependencyDepth`, reduced to a summary no caller could walk — the read API
   - `ProfileSamples`, summarised where a caller needs them whole — the read API
   - `DependencyNode`, because the walk demanded a record no client holds — `toopo add`
   - the two digests of an installed file, `served` and `sha256` — `toopo add`
   - `LockedFeature.askedFor`, so an update could know what had been asked for — `toopo update`
   - the export names in the served index, so a client could say what it installed — `toopo update`
   - `ExportRecord.parameters`, because a case of block 4.4 is a call — the site
   - `CaseTableRecord.groups`, because a case belongs to a group — the site
   - `ParameterRecord.type`, because a form field has to know what it is — the site
   - `list-the-whole-catalogue`, a page with no need behind it — the site
   - `run-the-implementation-on-what-a-reader-types` — the playground

   **This was a numbered series, and the numbers had stopped being true.** Two things were called *the
   seventh*, two *the eighth*, two *the ninth*, and one field was published as both the fifth and the
   seventh in two files. The cause is recoverable and worth recording, because it is the argument: two
   places re-derived the rank from a list they wrote out from memory, both dropped `DependencyNode`,
   and both compensated by counting the lockfile's two digests as two findings instead of one. Each
   list was internally consistent and neither matched the other.

   So the ordinals are gone rather than corrected, by the rule 467 established. **A list is checked
   line by line; a rank is checked only by rebuilding the whole list, which is what nobody did.** What
   the series is about — a schema defect is never found by reading the schema — does not drift, and it
   is the sentence that survives.

   Only the piece currently under way exists; the others do not, because each one constrains the next.
   Everything lives in this one repository, in folders — releases are independent, the history is not.

   **The catalogue ships at five contracts.** The showcase domain moves to after the launch: every
   remaining uncertainty is on the user's side — whether `toopo add` feels good, whether search
   finds something in ten seconds, whether a contract page convinces — and none of them is
   answerable in private. Anything published freezes for life, so the known debts close before the
   launch, not after.
2. **The no-abstraction suspension has ended**, having done its job: three contracts were written by
   hand with no shared code, and what they turned out to repeat *identically* now lives in
   `packages/catalogue/`, under the freeze discipline stated at the top of that file. The bar for adding
   anything there is not "the contracts repeat it" but "the contracts repeat it identically, and
   what it says belongs to the registry rather than to any one feature". Resemblance is not
   duplication: three functions that answer the same question about different data stay apart.
3. **A dev dependency is admitted when it cannot reach the product, and when the mechanism that stops
   it is executable.** Five today — `typescript`, `vitest`, `fast-check`, `@types/node`, `wrangler` —
   and it is the criterion that decides the sixth, not the list: a rule written as four names plus an
   exception grows an exception per tool, where a rule that states its test survives its first case.
   Two mechanisms answer it and both are measured: `files: ["dist"]` decides what `npm pack` ships,
   and `packaging/reachable.ts` prunes `dist` to what the published entry point can reach — so a tool
   no published module imports is absent from the archive twice over, by a declaration and by a walk.
   `@types/node` is types-only and has no runtime footprint at all; without it the mutation instrument
   would either sit outside the typechecker or be written in plain JavaScript, and an unchecked `.ts`
   file would claim a guarantee the repository does not give it. `wrangler` deploys and is imported by
   nothing. ADR-0097 carries the argument, including why a floating `npx wrangler` was refused: a
   repository whose product is that a published version is frozen for life cannot deploy with whatever
   was newest that morning. Feature code still has zero runtime dependencies of any kind.
4. The root `package.json` carries `"private": true`, so nothing can be published by accident.
5. Working notes, planning documents and status reports do not belong in this repository. Only
   contracts, implementations, tests, the evidence produced by running them, the instrument that
   produces that evidence — including its own fixtures — and the decision records under
   `docs/decisions/`, whose format, address and required sections ADR-0001 settles. A decision record
   is none of the three things this rule refuses: it is not a note, it carries no status, and it is
   what a line of code cites when the reason it exists will not fit beside it.
6. **Fixtures for the instrument live under `mutation/`, never under `contracts/`.** `contracts/` is
   the catalogue and nothing else. A fixture is a toy shaped like a contract so that the instrument
   can be mutation-tested in seconds rather than minutes; a meta-test nobody runs is a decorative
   guard, and the cost of running one is what decides whether it gets run. A fixture is deliberately
   minimal, is never a template for a real contract, and says so in its own header.

## Permanent rules

These outlive the current stage and are not open to trade-off.

1. **No runtime indirection.** No dynamic resolution, no wrapper component, no network call at
   execution time. The only indirection is the user's import path, resolved at install time.
2. **No external npm dependency inside a feature.** A feature depends only on other registry
   features and on native language and runtime APIs. Wrapping an existing library is rejected on
   principle.
3. **No distribution from an external source.** Installations are served only from the registry's
   immutable snapshot, never from a third-party repository.
4. **Never update user code silently.** Notification, readable diff, explicit acceptance.
5. **Never hide a contract's tests.** Contracts are public in full; security by obscurity on them
   is forbidden. Auditability is the product.
6. **No breaking change to a published contract major.** A published version is frozen for life;
   an incompatible evolution creates `name@2` alongside `name@1`.
7. **Nothing trivial in the catalogue.** A contract exists only if it provides something the
   language does not give trivially — non-obvious behaviour, real edge cases, an algorithm, or the
   correction of a language trap.
8. **No validation bypass**, including for the founder's own submissions.

## Conventions

- English everywhere: code, identifiers, comments, tests, commit messages, documentation.
- Conventional commits, atomic. Never push and never create a remote.
- TypeScript `strict: true`.

**How the catalogue is written.** Each rule below is stated once here and argued once in the record
beside it. Where the two ever disagree, the record holds the measurement and this line holds nothing.

- An address — a case, a guard, a group, a reason literal, a benchmark profile — is a name in
  kebab-case, unique within its contract, frozen with the contract's major, and **never a rendering of
  the data it addresses**. The test that decides the next one: falsifying the name and reddening the
  guard are the same event, or they are not. ADR-0017.
- A guard's title is that address, then ` :: `, then a sentence. The registry addresses a guard by the
  pair `(contract, identifier)` and never by the identifier alone. ADR-0019.
- A fallible function answers `T | null` and publishes `describe<X>Failure(...)` beside it, with a
  coupling property tying the two. The reason set is frozen with the major. ADR-0020.
- A contract that answers differently from the language or the ecosystem carries a guard that
  **replays** the divergence on the rows where it happens. ADR-0022.
- An alias is a query whose best answer is this contract, never a phrase that relates to it. It is the
  one field of `identity` that is not frozen. ADR-0023.
- On a page, **the tag is the outline and the class is the look**. A separator belongs to a block; a
  phrasing element gets none. ADR-0025.
- A parser is written once and reached, never copied. **A copy of a parser is not a second opinion, it
  is the same statement written where nobody will maintain it.** ADR-0026.
- A command that can destroy or overwrite shows first and writes on a second word; a command that can
  only refuse writes at once. `THE_WRITE_DISCIPLINE`. ADR-0036.
- **A refusal that explains is a door, one that reports is a wall.** ADR-0039.
- Before writing a rule in prose, look for the shape that makes breaking it not compile — a total map
  over a type, or a union with no way to spell the absence. Where no such shape exists, the rule is
  written in prose *and* recorded below among what nothing keeps. ADR-0054.
- A computed root states how far up it is going, and what it is going up from. A walk over the source
  tree and a walk over the emitted tree look identical and only one moves when a folder does. ADR-0059.
- A pin naming five or fewer red guards names all of them; above five it names only the guards the
  mutant was written to exercise. **Five is a convention and reads as though it were derived**, so the
  distribution it was cut from is published beside it and remeasured when a contract moves it. ADR-0076.

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
- **A guard perturbs the claim, never the object derived from it.** Perturbing the derived object
  establishes that the derivation is self-consistent, which is true of a derivation with a hole in it —
  measured twice, ten units apart, on subjects sharing nothing. It is the cheapest test for a guard
  that cannot fail: ask whether what the guard perturbs is the claim or something computed from it.
  ADR-0087.
- Distinguish what you **measured** (quote the command and its output) from what you **assume**.
  A coherent explanation is not a measurement.
- Report what you left out. Never narrow the scope silently.

**How a figure is published.** The same discipline, on prose rather than on guards. Each is argued in
the record beside it.

- When a sentence can be true without counting, it does not count. That is the form to reach for
  first. ADR-0018.
- A count that survives carries its coordinates: the commit it was measured at, and the population
  counted. ADR-0018.
- A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
  in one sentence, and it is the lie the reader believes. The clause carries the stamp, or it is
  stated at the commit, or it is not written. ADR-0018.
- A property settles exactly the decisions its alphabet represents, and no others. A named case is not
  bookkeeping beside it, and a battery mutant is what says which of the two settles a decision.
  ADR-0021.
- **An address is not a figure**, and it leaves a comparison by both sides or by neither. A run of
  digits is not evidence of a figure; what decides is the rendering. ADR-0030.
- **A static check passing does not mean the interface works.** A whole class of defect is only visible
  in a real browser, and this repository has paid for that class twice. ADR-0028.
- **A report may state what it observed; it may not name a cause it did not measure**, and an invented
  cause is not repaired by a list of candidates. **An inference offered with its premise is argument; a
  conclusion offered alone is assertion.** ADR-0042.
- Where a sentence claims something happened, compute it from the thing that happened rather than
  asserting it beside. **A sentence that cannot be false is worth more than a sentence somebody
  checked.** ADR-0043.
- A total map over a union beats a pass over real data: the first cannot fail to be complete, the
  second covers what the data happens to reach. **A guard that fires at the right future moment is
  worth more than one that covers the past.** ADR-0055.
- Before measuring a rate, ask whether the guard polices the step the mutant breaks, and whether the
  thing is stochastic at all. **Vary one input at a time and look for a cell that is 0 of *n* or *n* of
  *n*.** ADR-0053.
- **A run of zero over *n* trials bounds nothing until *n* is put beside the rate being looked for.**
  ADR-0056.
- **No rate obtained by reproducing a generator is trustworthy to better than an order of magnitude.**
  The miss rate is a per-draw probability raised to the draw count, so a 25 % error on the input is a
  factor of seven on the answer. Quote the order, name the draw count it was raised to, and let real
  runs decide anything finer. ADR-0077.
- **A repair is chosen for its margin, never for its precision**: take the one whose margin swallows
  the known uncertainty of the method. A repair improving a rate by the factor that method may be wrong
  by has bought nothing that survives its own error bar. ADR-0077.

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
