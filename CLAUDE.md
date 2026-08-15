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

## Current stage

**The five hand-written prototype contracts are done, and with them the stage that produced the
format.** They were written with no shared abstraction so that the format would emerge from
repetition instead of being designed up front; what they turned out to repeat identically now lives
in `packages/catalogue/`, and the checklist a sixth contract is measured against is `contractAnatomy` in that
same file. The uncertainty of this project was in the contract format, and it has been spent.

The registry's first three pieces are written — data schema, immutable storage, read API — and beside
them the validation pipeline's first stage. Next to them now stands `toopo init` and `toopo add`, which
came **before** the rest of the pipeline and before the publishing tool, and the reason is recorded in
rule 1 below rather than left to look like impatience. Beside all of it the conformance controller,
which does **not** make `contractAnatomy` executable: the triage below says why — three of its eleven
entries are settled by a syntax tree, four need a module a stage has already vetted, and four are a
reader's for ever. Beside them now `toopo update`, the command permanent rule 4 is about, and with it
the two-phase write that closes three of the four situations `packages/cli/breakage.ts` declared as breaking
badly. Then `toopo search`, the only command that reads no project at all and the one that finally
makes `identity.searchAliases` executable — a field declared in the first session of this project and
validated by nothing until now. **The CLI is finished at six commands with `toopo remove`, and with it
the way out the client did not have**: before it, the only way to uninstall was to edit `toopo.lock` by
hand, and the tool put a deleted folder straight back. Beside it `toopo list`, the only command that
reads no *registry*, and the pair is the shape of the whole client — one question answered without a
project, one answered without a server. **And now `site/`, the generator, which is the half of the
product nobody had seen**: four contract pages, the catalogue, and the page that publishes what the
catalogue refused. No server exists and none is needed — what it writes is static HTML, and a contract
page that needs a line of JavaScript to be read is a page a crawler and a screen reader read
differently from a person. **And beside it the playground, which is the one thing on a contract page
that is computed rather than rendered**: four pages have one, the field holds a literal, and what a
browser runs is this repository's own modules with their types removed. **And now the playground calls
both halves of the surface** — the answer and the diagnostic beside it — which is what makes the two
spellings of `1 000` tell themselves apart on the page whose contract settles them; and beside it the
pre-flight refusal that had been set aside three times, which turns an address that has stopped
resolving from a silence into an error, and found one the day it existed. **And now the method page,
the only page that argues the thesis rather than demonstrating it** — the page where a project like this
one destroys itself, which publishes what the measurements did not catch beside what they did, and
whose figures are derived from the batteries rather than from a run nobody can replay from a clone. **And
beside it the sitemap and `robots.txt`**, which are small, are read by nobody, and are the difference
between a site that exists and a site that is found. **And now `packaging/`, the first thing here that
measures the product rather than the working tree**: every contract page told a reader to run
`toopo add`, and three independent things stopped them — no archive at all, a published `.ts` node
refuses to run, and a CLI whose runtime graph reached vitest. What ships is compiled JavaScript and one
frozen artefact, proved by packing it, installing it into an empty project, and running the six commands
out of somebody else's `node_modules`. **And now the nineteenth battery, which is the first to measure
guards over something that is not in the working tree**: `packaging/` had fifteen of them and nothing
replayable pinning their verdicts, and closing that found two sentences this repository had published
about its own build that are wider than what anything measures. **And now the first contact, which is
the first unit here aimed at somebody who has read nothing**: `toopo add` stops needing `toopo init`,
the project that friction was covering by accident is refused on purpose, and git is asked whether the
folder about to receive somebody's code will ever be committed — a question this repository had recorded
a decision against, reversed on a measurement that falsified its premise. **And now the folder that
moves, which is that same unit's advice followed to the hole it opened**: `toopo init --dir` changed the
setting and left the installed copy behind, claimed by nobody, inside the very folder git ignores — so
`toopo list` called it missing and `toopo update` wrote a second one. `init` is the only command that can
ever see both folders, so it moves the tree itself, and the two designs that would have refused or merely
reported are refuted below by measurement rather than by preference. **And now the sweep of what this
tool tells people, which is the first unit here aimed at a sentence rather than at a behaviour**: two
screens were known to name a cause nothing had measured, reading every string the CLI can print found
seven more, and one of the nine turned out to be a single word — *you*, on a comparison that establishes
that bytes moved and nothing about the hand that moved them. The worst of them was reproduced rather
than reasoned about: `toopo remove --apply` said *held back, nothing changed* while the lockfile went to
`askedFor: false`, and the invariant it broke was already written three lines away in the module that
broke it. **And now the control that was red with nothing injected, which is the first unit here whose
defect was in the apparatus and not in anything the apparatus measures**: the guard was reddening in its
teardown rather than in its assertion, and the reading it had been filed under — state leaking between
batteries — was refuted by reproducing it in isolation, where the thirty clean runs that had established
that reading turn out to happen half the time at the rate actually measured. The same defect was then
found one floor down on the install path, where a `finally` that throws replaces a rewrite that worked
with an install that failed. **And now the fourth door into a run that collects nothing, which is the
first one a guard of this repository found rather than a reader stumbled into**: a lower-case Windows
drive letter in the path the instrument hands vitest collapses every runtime file, and the two figures
that had stopped anybody naming it — 28 assertions and 0 — are that one door read through two
configurations. It looked like a rate because it is a predicate on the invocation, so the spelling is
now pinned rather than inherited, on the argument `Battery.timeZone` has been making since the first
battery. **And now the coordinate that was in the record and in none of the strings, which is the last
irreversible thing this repository can still fix for free**: `ContractAddress` has carried a language
since the day it was written, `sameContract` compares it, the lockfile writes it — and `renderContract`
dropped it, so the URL, the page path, the case anchor and the licence header frozen into every
installed file were built without it. What made it survivable is what made it invisible: each consumer
sees one rendering, and no consumer of one rendering can notice a coordinate missing from all of them.
The module that owns every address this project has had never been guarded directly. **And now the
first unit here that makes the instrument cheaper instead of stricter, and the first whose whole value
is in a slope**: every cell of a contract battery ran the entire contracts' suite, so the cost of a
replay grew with the product of the catalogue's cells and the catalogue's suite — seven minutes at
five contracts, eighteen hours at a hundred, and the page that hands `npm run mutation` to a stranger
stops being an invitation somewhere in between. **And now the answer to the question every visitor
arrives with, which is the last thing before the launch that is design work rather than a decision to
publish**: there was no `CONTRIBUTING.md` at all, and the README sent a stranger to *this file* and
called it the project specification — which is the one of its three jobs it does worst. What settles
the answer is arithmetic rather than a preference, and the arithmetic said something the first reading
of it did not. **And now the first screen, which is the third appearance of one class and the first
where the repair was in the page rather than in the projection**: the contract list read
`typescript/number/parse@1Convert a string to a finite number` five times, because an anchor is
phrasing content and the summary after it began mid-line. What decided where to repair it is a census
rather than a preference — of fourteen visible anchors on seven pages, not one is written inside a
sentence — and what fixed its shape is that this site already contained the right rendering of the
same pair on another page. Re-reading the other six afterwards found the page arguing for rigour
publishing its own asterisks, and a guard three lines from the new one undoing those marks by hand.
**And now the fourth appearance of that class, which is the first where the existing guard was measured
and found structurally blind rather than merely absent**: two defects filed as *a value written to be
embedded, rendered as though it stood alone*, both sitting in a paragraph whose only child is a text
node — so the guard that asks whether two elements run together has no pair to look at, 595 of them over
the seven pages and none colliding. Its subject is the boundary between two elements and these are
boundaries inside one string. What settles them is a register decided by census rather than by
preference, written beside the field, and two derived guards that partition the class: a value stands
alone or it is embedded. The predicate found a third instance nobody had filed, three lines from the
first in the same file; the mandated re-reading of the seven pages found two more on the method page,
one of which was not a fragment but a sentence denying the claim printed two lines above it. **And the
third guard was nearly excused by a price and refused by a required field of one word** — `nature`,
whose value would have been *claims detection*, which `run.ts` says is decorative until a mutant reaches
it, with no nuance. The cell exists, the nineteen batteries were replayed behind it, and the third
reading of the narrowed regime broke an ordering that two readings could only fail to establish. **And
now the edge that carries its own digest, which is the last irreversible thing this repository can still
do for free — and the first unit here whose own saving removed the only check it had.** A client walking
a dependency graph asked the registry which digest each edge resolved to, one named answer per contract
in the closure; carrying the digest inside the frozen snapshot takes `toopo add number/round` from eight
round trips to six and from five believed answers to one. That same lookup was what established that
what arrived was what the edge named, so the field and the hole are the same call, and the guard is the
unit rather than the field. Measured over the six substitutions the imagined graph can express, five
were already refused — under sentences naming causes no measurement establishes, which is this
repository's own worst class — and **the sixth installed the right artefact for the wrong reason: an edge naming an
address another edge had already resolved was skipped, digest and all, so the walk's order decided which
of two published combinations a project got.** The replay then found what no reading had: a fixture that
swapped an artefact's content under a fixed version stopped being expressible, because that is the
rebinding permanent rule 6 refuses and an edge now pins the snapshot rather than the name. **And now the
port that speaks over a wire, which is the first half of taking the catalogue out of this repository and
the first unit here whose acceptance criterion is a property rather than a behaviour.** A maquette had
measured that the property `command.ts` declares — everything this tool decides is reachable from a guard,
with no process, no working directory and no clock — survives a remote registry; it was reverted, so
nothing of it remained, and a measurement does not survive the session. The port is asynchronous now and
**all four** implementations are, because two shapes would have made `command.ts` branch and left the
fixpoint exercised by HTTP alone — so the day the local source leaves, the surviving path would be the
least tested one. What every decision holds is a second projection of the same declaration, and the
compiler priced it: making the port asynchronous and leaving the decisions reading it directly raises 25
product-side errors, **every one of them a missing `await`**, and under the projection all 25 are a type
name with no body changed. The guard is that the same decision, against the cache a networked run left
warm, with no network and no process, produces byte for byte the plan the network produced. **And the
addressing is the half that decides a supply chain**: with the spelling a client falls into, a registry
answering one blob address with another file's bytes installs them and nothing objects. The loop then made
two ambient inputs visible that nothing had to notice while a decision ran once — a clock inside the thing
being replayed, and a transcript that would have frozen the misses of a first round as an empty catalogue.
**And the replay found the sharpest thing in the unit, which was the unit's own arithmetic**: a cell three
folders away stopped being a defect because the count it wrote a literal for became that literal, and
following it found the rule about addresses being kept by one name where the data carried two. **And now
the tree a host serves, which is the first thing here that *is* the registry rather than a stand-in for
one**: a remote source existed and nothing served it, so the guards raised a server in their own process
out of the local catalogue. What is emitted is every answer the read API can give, at the address it is
asked at, deposited with the site — and the totality is a walk of the **questions** rather than of the
catalogue, because a walk of the catalogue is a list of what somebody remembered and an answer a client
can ask for that the emission did not write is a 404 in somebody else's project. The property that needs
no list at all is that the tree is **closed**, read back out of the served bytes rather than out of the
walk. The collision that decided every address was found before it could be shipped: under the prefix the
specification suggested, a contract's binding is a *file* at exactly the path its implementation list
needs to be a *directory*, and no filesystem holds both — so an answer about a contract lives inside that
contract's own folder, beside its page, and the address a reader opens is the address a client asks.
**And the arithmetic said something the brief did not**: eleven files per published contract rather than
two, which puts a twenty-thousand-file limit at 1 817 contracts instead of ten thousand.

- The five are written: `number/parse@1`, `date/add@1`, `array/group-by@1`, `string/levenshtein@1`,
  `string/slugify@1`. The third is a format prototype that will not be published, because ES2024
  shipped `Map.groupBy` and it answers what the contract specifies. The project specification records
  that refusal and the rule it establishes. The fourth is the first whose properties are strong by
  nature — the axioms of a metric — and its table is a third the size of the first's as a result. The
  fifth is the first with no oracle of any kind: measured over fifty-seven samples, the four most used
  slug libraries agree on seven, so nothing about its answers is true and every one of them has to be
  argued for.
- Project name: Toopo. CLI command `toopo`, lockfile `toopo.lock`.

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

**Closed by stage 1 of the validation pipeline.**

- `staticAnalysisRequirements` of `date/add@1` — stage 1 reads the twenty forbidden local-time methods
  off the contract itself and refuses a submission that calls one. The record classifies the field
  `executable` and **carries the address of the guard**, which serialisation refuses if it does not
  resolve — the treatment `found-by-mutation` already had, applied to the other claim a record makes
  about its own verification.
- `referenceImplementationRules` — its first rule is what `states-its-own-signature` refuses, and the
  refusal a submitter reads is **that declaration's own sentence** rather than a retelling of it. It
  moved to `packages/catalogue/reference-implementation.ts` for a mechanical reason worth recording: production
  code cannot import a file that imports vitest, and `every-contract.ts` does because three of its
  exports *are* guards. Its second rule stays a reader's and `contractAnatomy` says why.

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

**Closed by the two-phase write, which is where they said they would close.** `packages/cli/write.ts` stages every
file beside its destination and renames, so the three situations the installer left throwing whatever
the operating system threw are refusals with a sentence. A folder that cannot be written to fails during
staging, where nothing has been committed — not a pre-flight writability check contradicted afterwards
by the write, which is the shape this repository refuses, but the write itself taken in a phase whose
whole property is that abandoning it costs nothing. A directory where a file must go is asked about by
*kind* before staging, because renaming onto one is `EPERM` on Windows and says nothing a caller can
act on. And a process killed between the first file and the lockfile resolves backwards, because a file
is renamed or it is not and the lockfile is renamed last — `already-written` finishes the job on the
next run, without a journal.

**What the guard for the first one measures is a file sitting where one of our folders must go**, and
that is said rather than glossed: a permission denial is the same catch on the same line, and is not
something a guard can arrange on every platform this runs on. Claiming it was measured would be claiming
more than was.

**Two remain, and both are declared rather than closed.** A rename that fails after staging succeeded —
a file held open by another process on Windows — throws, and closing it would mean every rename being
reversible, which is a journal. And node's own TypeScript runtime meeting a feature of more than one
file, which the section above measures and which is not ours to close.

**Four more instances were found by building the address rather than by looking for them, and that is
the argument for building mechanisms rather than lists.** Ten entries of `TYPESCRIPT_SURFACE` were
guarded and read by nothing, so the guard covered a dependency the analyser did not have.
`GuardAddress`, `renderGuard` and `guardAddressFaults` were declared in `address.ts` and used by
nothing — the address this unit needed already existed, unused. Four `ownDeclarations` claimed
`executable` and named no guard; one of them, `keyFunctionRules`, turned out to be `structural` — no
guard runs an implementation against it. And M-08 of `array/group-by@1` pinned one of the four guards
it reddens where the repository's own rule says name all of a set of five or fewer, which is how
`profileKeyFunctions` had no citable guard to point at.

**The class is closed. An address a battery names is resolved in `calibrate()`, against the guards the
run really collected, before a single verdict exists.** It costs the seconds a control run costs rather
than the twenty-odd minutes a battery does.

**And it closed a listed entry, which is the first application of the rule at the head of this
section — applied late, which is how the rule was found.** `benchmarks.profiles[].name` sat in the
list reading *frozen by the section above, enforced by nothing* while this paragraph, two screens
down, said the class was closed: two statements of one fact in one file, and it is always the list
that lies. Measured at `277a637`: the five contracts declare **27** profiles, the suite collects **27**
guard titles `profile-<name>`, and **27 of 27** are named by a battery — so the address half resolves
for every one of them. The content half stayed in the list and now says what it is.

**Nothing was built on top of it, and the measurement is what refused it rather than a preference.**
The obvious guard — resolve a record's profile names against the guard titles the suite carries — is
structurally incapable of failing, because all five `profiles.test.ts` build the title in a loop over
`benchmarkProfiles`: renaming `long-inputs` in the record produced `profile-long-inputs-RENAMED` and
six green tests, with nothing left behind to catch. A second guard resolving what the **batteries**
name, at the suite's cadence instead of the pre-flight's, genuinely would fail — and it would catch
the same fault twenty-three minutes earlier, which is the one costume this repository cannot argue
with: two guards over one fault have no answer to *which of us is right* on the day they disagree. It
is the class this file spent months removing from its prose, and putting it into executable code would
be worse, because a comment that contradicts another is read by a person and two guards that
contradict each other are read by nobody until one goes red.

**Both halves were measured before the mechanism was written**, at `82d09a7`, by putting back the two
mistakes this repository had already made and corrected before measuring — and neither outcome is the
one the debt was filed expecting. A **pin** naming a guard no guard carries does redden, and the red
says the wrong thing:

```
1 cell(s) disagree with the battery:
  W-41 on W/as-committed: expected killed, measured killed
    no longer caught by: an-invisible-character-is-read-back-as-the-character-it-names
```

`expected killed, measured killed` is two verdicts agreeing on a line announcing that they do not, and
`no longer caught by` sends its reader into `read-literal.test.ts` after a guard that stopped catching
a defect it never caught. **A red that manufactures a regression costs more than a silence, because
somebody goes and looks for it.** A **guard declared silent** under a name nothing carries was not
reported at all: the name occurred zero times in that run's output, and the run finished on *every
guard of this contract is either witnessed or accounted for*.

**It found one the moment it existed.** `cli-search` declared
`a-feature-already-installed-is-not-installed-again` unprobed — a string occurring nowhere else in this
repository, sitting in the same list as `reinstalling-what-is-already-there-changes-nothing`, which is
the guard it was once the name of. Nothing had ever said so. Checked against the guards all six
configurations really collect: no other battery names an address that resolves to nothing.

**Each half resolves against the universe its own mechanism reads, which is why neither can refuse
wrongly.** `agreesWith` looks a pin up among every guard that reddened anywhere in the run;
`attributeColumn` only ever sees the guards of the contract under measurement. There are three guards
in `instrument.test.ts` and not one, because a declared *suite* is a third universe — a describe title
is prose and gets reworded, where a guard identifier is frozen, which makes it the half most likely to
break. All three were seen red together on one meta-mutant, each under its own claim.

**What it did not close was `Breakage.guard`, and the reason turned out to be the rule rather than the
gap.** This section used to say that entry closed "with the same mechanism as the others". That sentence
was written before anybody looked at what names `WHAT_BREAKS`, and the answer is *no battery*: the
pre-flight resolves the addresses a **battery** declares, against the guards a run really collected, and
the four batteries that collect the `cli` suite declare none of these twenty. Closing it here would have
meant picking one of the four arbitrarily to name them, or repeating the list in all four — a battery
declaring something it does not declare, in order to fit a mechanism. That is arranging the data to suit
the tool, which is the shape this repository refuses everywhere else.

**So the line is drawn instead, and it is a rule about where a resolution lives: the pre-flight resolves
what a battery names; a suite guard resolves what a module declares.** Two universes, two mechanisms,
each beside the declaration it keeps. `every-clean-refusal-resolves-to-the-guard-it-names` in
`packages/cli/breakage.test.ts` is the second one's first instance — it reads this folder's test sources, resolves
all twenty addresses, and **publishes the file each one is in** rather than asserting anything about
where they are.

What it reads is the source rather than what vitest collected, so a guard inside a skipped block would
still resolve — and that hole is already closed at another cadence, by `mutation/census.ts` declaring how
many guards each file of this suite collects. The division is deliberate: the suite guard catches the
frequent fault in seconds, an address renamed by somebody refactoring; the census catches the rare one, a
file that stops running. Neither repeats the other, which is what makes both affordable.

Both reds were seen. An address left behind by a rename resolves to `null` under its own name; and an
identifier carried by two files reads as `"list.test.ts, write.test.ts"`, which is a defect the first
draft of that guard could not see — written as a plain record it kept whichever file sorted last, so a
duplicate looked exactly like a resolution. A mechanism that silently picks one of two answers, inside
the guard written to refuse exactly that.

**And the sentence it replaced is gone rather than corrected.** `breakage.test.ts` opened by saying every
clean refusal was guarded *in that file*; eleven of the twenty were in five other files by the time
anybody checked. A sentence claiming they are all here and a guard publishing where each one is are two
statements of one fact, and it is always the sentence that ends up lying. The eleven did not move: a
refusal about the lockfile is tested where the lockfile is written, and gathering them to make a sentence
true would be the same error in the other direction.

**A published name belongs to a committed thing, and `npm run mutation` was not one.** The method page
hands that command to a stranger as *the* thing that turns an assertion into something they have
watched happen — and it ran `measure.ts` with no argument and exited on `usage: measure.ts <battery>`.
Replaying everything was a loop each of us wrote by hand and nobody committed, which is the defect
underneath the broken command: **two definitions of *a replay*, either free to drift, and nothing that
would have said so.** That is also why it stayed invisible — everybody had their own. `mutation/replay.ts`
is now the command, and it composes the two entry points a reader could type rather than implementing a
third: `measure.ts` once per battery, then `tally.ts`. The by-name usage moved to `npm run battery`,
because that is the narrower question and it is asked by somebody already inside the work. **The two
lists of the batteries check each other**: the replay runs `THE_BATTERIES`, the total requires
`mutation/*.battery.ts`, so a battery written and left off the list writes no result and the total
refuses.

**The repository-wide figure has a derivation, and that closes the second half of this.** The replay
ends by running the total itself, because the artefacts it has just written are newer than the commit
they describe and a reader is owed one command and one answer. `npm run tally` keeps the half that is
not a measurement — printing that total again without re-running anything, and refusing a set that is
not one replay of the commit it would describe. **That refusal is only reachable from the second
command**, by construction, since a replay's results are always fresh by the time it counts them.
Measured at `57958fd`, one run of the nineteen took
**27 min 8 s** and gave **612 defect cells, 576 killed, 36 surviving, beside 26 probe cells of which 4
survive**, every cell agreeing with the verdict pinned for it; the largest single battery was
`cli-install` at 367 s. **A duration is published beside its
spread**, because a stamp stops a figure being stale and does not stop it being read as a period — and
**that reading was the first under a changed regime**, which the spread has to name rather than merely
signal: a cell of a contract battery now collects its own contract's suite instead of all five. Under
the whole-suite regime the same 612 cells ran at 31 min 25 s, the 610 before them at 29 min 13 s, the
606 before those from 28 min 19 s to 35 min 10 s, the 605 before those from 29 min 22 s to 37 min 0 s,
and the 592 before those from 25 min 8 s to 28 min 59 s — so a single number to ten seconds is a
precision the measurement has not got. **The count is what has always told these populations apart, and
here it did not move**: 612 either way, so nothing but the clause could have said that comparing the two
series is wrong. The old readings stay, labelled, because they are what makes the change visible. **And that regime now
carries a reading that needs no population at all, which is what every count of readings here was
standing in for.** Measured at `06e264b`: **618 cells in 27 min 22 s**, and the same 618 cells in
28 min 42 s on the run before it — identical work, on one machine, eighty seconds apart. Every earlier
reading compared populations and could always be answered with *the cells moved*; this one cannot,
because nothing moved. The cross-population readings agree with it and no longer have to carry the
claim alone: 615 in 27 min 34 s, 614 in 34 min 6 s, 612 in 27 min 8 s, so the smallest population is
the fastest run and the second smallest is the slowest by seven minutes. **The tally of readings is
gone from this sentence rather than incremented** — it read *three readings now*, a fourth was taken,
and this paragraph had already caught itself doing exactly that one sentence earlier. **The count in
that sentence was dropped rather than incremented**: it read *one of three
runs*, a fourth was taken and a tally that has to be edited on every replay is one that will be wrong
between two of them. The range only ever widens and needs no counting — which is why the runs of each
population are no longer counted at all, only bounded. **No share of that step is
attributed to anything, and this repository published an attribution once before withdrawing it**: six
minutes were once credited to `cli-install` gaining thirteen cells, and that same battery has since run
anywhere from 364 s to 459 s on identical work. **A quarter of its own duration between runs of
identical work is a machine too variable to support the account**, so the account went rather than being
qualified — and the list of its individual runs went with it, on the rule the sentence above states: a
range widens, a list of readings is a tally somebody has to edit.
`THE_REPLAY` carries both and the page renders both. The two populations
are printed together because they
collided once: *556 cells, 34 surviving* was published here while the artefacts behind it held *582 and
38*, and both were true — 556 is the defects, 582 is every cell including the probes. Each figure was
held by somebody who did not know the other population was there, and **no committed code produced
either**.

**The cost of the refusal is stated rather than discovered: committing anything after a replay makes
the tally refuse**, because the boundary is `HEAD`'s own timestamp and a docs commit moves it. The way
back is to replay. It is the conservative direction on purpose — the alternative is a definition of
which commits could have changed what a battery measures, which is a second statement that can be
wrong.

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
