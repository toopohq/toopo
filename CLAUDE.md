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

**What exists.** The registry's data schema, its immutable storage and its read API. Stage 1 of the
validation pipeline, and the conformance controller beside it. The client, finished at six commands —
`init`, `add`, `update`, `remove`, `search`, `list` — with a two-phase write, a lockfile carrying two
digests per file, and a port whose four implementations are asynchronous. The generator, seven static
pages, four of them with a playground that runs this repository's own modules with their types
removed. The archive: compiled JavaScript and one frozen artefact, proved by packing it and installing
it into an empty project. The emitted tree, which is every answer the read API can give, written as
files at the addresses a client asks. The instrument: nineteen batteries, their pinned verdicts, and
one command that replays them.

**What does not exist.** The publishing tool. Stages 2 to 7 of the validation pipeline. A server —
nothing constructs an `httpSource`, and both entry points name a local registry. A second language.
And nothing is published: `private: true` holds, the package is not on npm, and every path on
`toopo.dev` answered 403 when it was last measured. A reader who meets `toopo add number/parse` on a
contract page has no way to get `toopo`.

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
ADR-0060.

**Still open, and what each one now costs.**

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
- **The rule that an alias must not name what its contract refuses to be**, argued in ADR-0023. The
  eight liars are gone and the criterion is in `packages/catalogue/every-contract.ts`, but nothing
  keeps it: the executable form
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
- **The rule that a pin names what is red on every run**, stated on L-05 in `mutants.ts`, whose
  *instance* closed and whose *class* stays open. The instance was `G-14` of `string-slugify` pinning
  `p1-two-spellings-one-slug`; that pin is gone and the section below says on what argument. What no
  mechanism keeps is the general case: a battery sees one draw, so any pin is still checked against
  the run that wrote it, and closing that would mean four runs of every cell — the 23-minute replay
  taken four times. Priced, declared, and not built.

  **And now observed, which it had not been before — and that observation settles the pin without any
  number.** A replay at `e6acff9` reported `G-02 on S/table-blind: expected killed, measured killed —
  no longer caught by: p6-a-letter-or-a-digit-answers`: two verdicts agreeing on a line announcing that
  they do not, which is the shape the pre-flight section below describes and the reason it costs more
  than a silence. **The rule says a pin on a property-based guard is legitimate only when its miss rate
  is unobservable over the lifetime of the project. It was observed, in the first months. That question
  is answered by the observation and not by a confidence interval**, so what the measurements below
  decide is *how* the pin changes — widen the alphabet on this class, raise the draw count, or take the
  property out of the pin — and never whether it does. Written down because a later reader would
  otherwise think a number was being waited for.

  Step 1 of the method is passed and was checked rather than assumed: `POLICED` declares
  `keep: ['P4', 'P6']` and G-02 replaces the `keep` loop, so the guard does police the step the mutant
  breaks. This is not `G-14`.

  **What the measurements say, and they do not agree with each other.** Real runs: **1 silent in 500**,
  and 573 controlled passes in all hold that single silence — about **0.18 %**. The model says
  otherwise, and both of its cheap failure modes were checked and eliminated *in situ*, by instrumenting
  the real predicate: the draw count is **exactly 1000**, and the catching count per run is binomial at
  **0.96 times** the binomial spread over 150 runs, at **0.87 %** per draw — slightly *higher* than the
  0.8226 % reproduced beside the mutant, which makes a silence rarer still. So the model is confirmed by
  the instrument and predicts **one silent run in about 6 100**, while direct observation says one in
  500. Pooled — two silences over roughly 1 093 trials — the model carries a likelihood of about
  **1.3 %**: unlikely, not excluded, and a single event cannot pin a rate whichever way it falls.
  Separating one-in-6 100 from one-in-500 needs some 5 000 real passes, about an hour and a half, and
  that is priced rather than spent.

  What the exercise did settle is bigger than the cell and lives in `mutants.ts` beside the method: the
  miss rate is a probability raised to the draw count, so a 25 % error on the input is a factor of seven
  on the answer, and **no rate obtained by reproducing a generator is trustworthy to better than an
  order of magnitude.**

  **Repaired, by widening the alphabet rather than by raising the draw count.** `propertyRuns` is shared
  by all eight properties of the contract, so raising it pays on the whole file to fix one pin; and
  taking P6 out of the pin would leave P7, re-drawn in the same way with a rate nobody has measured —
  moving the problem under a name that stops announcing it. A second astral letter, Old Italic beside
  the Gothic one, carries the same kinds and so adds probability without adding a region: measured in
  situ, catching draws go from 0.87 % to 1.686 %, still binomial at 1.08 times the binomial spread, and
  **the smallest count over a hundred runs goes from 2 to 8** — which is the margin visible without a
  rate at all. `support-the-texts-reach-every-region` reddened on the two counts it holds, which is that
  guard doing its job on a foreseen change; the partition was updated and nothing else moved.

  **The new rate is published as an order and not as a figure, which is this repository's own limit
  applied at its first use.** Better than **one silent run in 100 000 under both readings** — the model
  in situ gives one in tens of millions, the least favourable reading the measurements permit gives one
  in hundreds of thousands, and the two are a factor of seventy apart. Quoting six significant figures
  from a method good to one would be the fault this file records one paragraph up. Measured at the
  commit that carries this change; `mutants.ts` holds the method and the rule that a repair is chosen
  for its margin rather than its precision.

- **A reproduced miss rate that disagrees with what the runs show, by a factor nothing accounts for.**
  It is a fact about the *method* rather than about `G-02`, which is why it does not close with the pin
  that revealed it: the same reproduce-and-predict method justifies every other pin on a property-based
  guard, and `mutants.ts` prescribes it. Measured on the cell that raised it, both of the cheap
  explanations were eliminated **in situ** by instrumenting the real predicate — the draw count is
  exactly the 1000 the model raises to, and the catching count per run is binomial at 0.96 times the
  binomial spread over 150 runs. The model was thereby *confirmed* and predicts one silent run in about
  6 200; direct observation gave one in 500, and pooled over roughly 1 093 trials the model carries a
  likelihood near 1.3 %. **Unlikely, not excluded, and unexplained.** What would settle it is about
  5 000 real passes of the one cell — a factor of twelve is a ten-event question, and 500 passes buy
  one — costing roughly an hour and a half of machine time. **Priced and not spent, on the rule this
  gap itself produced: a measurement that enters no decision is not bought at any price.** It entered
  none, because every candidate repair cleared both readings by orders of magnitude. It will enter one
  the day a pin's repair is close enough that the factor decides between two of them.


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
3. Dev dependencies are limited to `typescript`, `vitest`, `fast-check`, and `@types/node`. The last
   one is types-only, has no runtime footprint and cannot reach distributed code; without it the
   mutation instrument would either sit outside the typechecker or be written in plain JavaScript,
   and an unchecked `.ts` file would claim a guarantee the repository does not give it. Feature code
   still has zero runtime dependencies of any kind.
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

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
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

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
