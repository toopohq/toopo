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
the two-phase write that closes three of the four situations `cli/breakage.ts` declared as breaking
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

## What a pin on a re-drawn property may claim — settled

**A property that re-draws its generations has no determinism to offer, only a miss rate.** So the
rule `mutants.ts` states — *a pin names what is red on every run* — is unreachable as written for such
a guard, and pretending it is met is what produced `G-14`. The usable form: **a pin on a
property-based guard carries its measured miss rate, and is legitimate only when that rate is
unobservable over the lifetime of the project.** One green in 110 runs is met every fortnight, and a
pin met by a green every fortnight teaches its reader to ignore the red — the one known way to destroy
this instrument. A named figure beats an asserted determinism that does not exist.

**And the first step is not the rate. It is whether the guard polices the step the mutant breaks.**
`G-14` stops `keep` keeping marks, and it pinned P1, which `POLICED` declares for `unify` and `fold`.
P1's table of equivalent spellings is blind to it at **0 of 200 000 draws** and cannot stop being:
`unify` is NFKC, so a bare mark is composed onto its base before `keep` runs, and a mark that survives
composition is one the rule *keeps* rather than a second spelling of anything. Its 0.470% of catching
draws was the general-purpose alphabet having an accident. **Without this step, a rate is optimised for
an accident; with it, there is no rate to measure and only a pin to drop.** The pin is dropped on that
argument rather than on its 59-in-60.

**And before either: check that the thing is stochastic at all.** This is the sister of the rule above
and it was paid for outside this section. The drive-letter door presented itself as a rate — eight
invocations from mixed launchers gave two collapses, twenty from one shell gave none, and *two in
eight* was written down as though it were a frequency. Nothing about it was random. It is a predicate
on the invocation, **20 of 20 under one spelling of the entry point and 0 of 20 under the other**, and
what *two in eight* measured was how often the sampling happened to include the deciding input. **A
frequency measured over trials that differ in a hidden deterministic input is a number about the
sampling and not about the system** — and it is worse than no number, because it cannot be reproduced,
so every failure to reproduce it reads as evidence that the rate is low. That reading cost two replays
and about half an hour before anybody looked for a predicate instead of a probability.

The check is the same one either way and it is cheap: **vary one input at a time and look for a cell
that is 0 of *n* or *n* of *n*.** A stochastic phenomenon has no such cell; a hidden predicate is
nothing but such cells, and one of them ends the question without a confidence interval. `mutants.ts`
carries it as the third of a series, and they read together: a rate is worth measuring only if the
guard polices the step, only if the phenomenon is stochastic, and only against a trial count put
beside the rate being looked for. The third of those is the *0 in 30* lesson from the teardown, and
this is the first time all three are stated as one thing.

**The detour is recorded because it was expensive and it looked right.** Widening the spelling table
with a decomposed entry was proposed, built, and measured: 0 of 100 000 against `G-14`, unchanged, and
*fewer* catches on the two mutants P1 does police — 35 487 against 38 142, 80 700 against 83 995 —
because a tenth entry dilutes the nine. A symbol added to a frozen alphabet with no red in front of it
is decorative in this repository's exact sense. It was reverted, and the refusal now lives in the
table's own comment so the next reader does not repeat it.

**What separates a guard worth keeping from a symbol worth reverting, and it is measurable rather than
doctrinal: a guard whose failure has been observed on its real condition is kept, even when no battery
mutant can produce that condition; a guard with no red at all is not.** The partition of
`support-the-texts-reach-every-region` is the first case — it replaced a `.length` with the three kinds
the table holds, and it was seen red twice, on an entry silently changing kind and on a kind nobody
foresaw. No mutant produces either, and none can: a battery injects into `reference.ts` and cannot
reach a generator's coverage. A person editing that table produces both in one line. It is the census's
own argument, arriving on an arbitrary.

**The method survives and the script does not**, because the validation is what made it worth
anything. Inject the mutant, reproduce the generator beside it, **check the reproduction against a
series of real runs before believing it**, then read the rate. On `G-14` the reproduction predicted
0.89% and 60 real runs gave 1 green — agreeing, which is what earned the 200 000-draw figure the right
to be quoted. Three minutes for any pair of mutant and pin, and it is written in `mutants.ts` where
whoever is about to pin something will be reading.

## Make the omission impossible rather than forbidding it — settled, repository-wide

**Before writing a rule in prose, look for the shape that makes breaking it not compile.** A sentence
in a header is a rule the next contributor never reads; a type that cannot be written the wrong way is
one they cannot get past. Three instances found independently, which is what turned a habit into a
rule:

- **`GuardAddress` carries no unpaired form.** Uniqueness is per contract, so a guard is addressed by
  the pair `(contract, guard)` — and `packages/registry/address.ts` publishes no type holding a guard identifier
  alone. The rule "the registry schema must always carry the pair" was written in prose first, in this
  file; making the unpaired form unrepresentable is what turned it into something the compiler keeps.
- **`VerificationStratum` has a member for deferring and none for omitting.** `stated-per-declaration`
  exists because the visibility guard found a path with no entry at all and a comment explaining why —
  and a comment is not a classification. *Deferring is a decision, omitting is a silence*, and the
  union is what makes the second one impossible to write.
- **`toopo.lock`'s version cannot go stale.** `cli/lockfile.ts` validates through records keyed by
  `keyof LockedFeature` and `keyof InstalledFile`, so a field added to either does not compile until a
  check for it is written — beside the number that has to move. Both shapes had already shipped under
  `"version": 1` before this existed, which is the measurement that motivated it.

The three have one form: **a total map over a type, or a union with no way to spell the absence.** The
question to ask of any new rule is whether that form exists for it. Where it does not, the rule is
written in prose *and* recorded in the list below, so that a declaration nothing keeps is at least
counted.

**It is not free, and the cost is stated so it is not discovered later.** Totality forces a decision at
the moment a type changes, which is the whole value, and it also means a field nobody has an opinion
about must still be given one. `FIELDS_OF` carries `files: Array.isArray` and delegates the elements
elsewhere — the totality guarantees no field goes *unconsidered*, never that every check is one
expression. Claiming more than that would be the decorative form of the same idea.

## Totality by the compiler beats a pass over the data — settled, repository-wide

**A pass over real data is accidental coverage; a total map over a union cannot fail to be complete.**
The instance that established it: `read` inverts `literal`, and the obvious guard was the round trip
over every case of block 4.4. Measured, that guard cannot exist in `site/` — `site/source.test.ts`
refuses every module of the folder but one, tests included and its own comment says *every other module
of this folder*, the right to reach `the-five` or `serialise`, so a guard there sees exactly what the
port serves. **157 of the 187 cases sit on contracts that have a page, and all 30 that print a word
with no JavaScript spelling sit on `array/group-by@1`, which has none.** One half of that partition
would have been empty by construction, which is the shape of a guard that quietly stops asking
anything.

What replaced it is stronger where it matters: `EVERY_ARM` is a record keyed by `EncodedValue['kind']`,
so an arm added to that union does not compile until a sample is written. Seen red by adding one — the
record *and* `literal`'s own switch both stop compiling, and a `killed-by-typecheck` is a death in
full. Real cases reach the arms they reach, nobody has ever checked which, and nothing reddens when one
is never touched.

The pass over the served cases stays, for what the table cannot say: that the literals this catalogue
actually publishes are among the ones that read back. And it carries the invariant a playground rests
on — *no case the registry serves is printed as a word with no spelling* — which reddens the day a
higher-order contract gains a page, which is the day somebody has to decide what its playground does
with a case whose input is a function. **A guard that fires at the right future moment is worth more
than one that covers the past.**

Both reds were seen, and which guard caught which is the argument for keeping the pair: a reader
answering `0` for `-0` reddens the arm table *and three real cases*, and a reader answering `undefined`
for `<hole>` reddens the arm table alone.

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
  moved to `catalogue/reference-implementation.ts` for a mechanical reason worth recording: production
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

**Closed by the two-phase write, which is where they said they would close.** `cli/write.ts` stages every
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
`cli/breakage.test.ts` is the second one's first instance — it reads this folder's test sources, resolves
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

## A control that is red with nothing injected — settled, and filed under the wrong cause

**A replay refused itself, and the refusal is the instrument working.** `cli-install`'s calibration
answered *the unmutated `C/as-committed` is red, so every verdict from this battery would be noise*,
naming `the-commands-that-reach-the-registry-are-these-and-no-others`. Sixty-three verdicts built on a
red control would have looked exactly like verdicts.

**One intermittent guard produced two failures that named anything but itself.** In another replay the
same guard reddened while a `cli-search` mutant was injected, and the attribution concluded *declared
silent and a mutant reddened it* — a stale declaration reported against a mutant with nothing to do
with it. Neither report can say *this guard is intermittent*, because neither is looking at that.

**It was never that guard's assertion.** All 169 assertions were collected and its seven booleans were
right. The failure was in its `finally`: `rmSync` answering `EPERM` on the temporary project it had
installed into. A teardown that throws reddens whichever guard happens to be running, and this
instrument reads a red guard as a verdict — so a removal failing in a `finally` produces a cell that
looks exactly like a kill. **That is the third member of the family `run.ts` names twice**, arriving
from the apparatus rather than from the contract, and none of the three guards written for that family
can see it: an edit that does not apply and a suite that half ran are both about what the *run*
collected, and this run collected everything.

**The reading this was filed under was wrong, and the arithmetic is what says so.** It was recorded as
state leaking between batteries on the strength of *0 red in 30 runs of the unmutated `cli` suite
alone*. Measured at `d0ee718`, over that same suite, alone, sequential, with nothing injected and no
battery anywhere: **3 reds in 139 runs — 2.16 per cent**, 95 per cent Clopper-Pearson [0.45, 6.18],
every one of them the same exception at the same line. At that rate thirty clean runs happen **52 per
cent** of the time. *Clean in isolation, faulty in sequence* was the sample size and not a signature.
**Nothing leaks between batteries, and the parallelisation this was said to stand in front of is not
blocked by it.**

**So the rule this produces is about the shape of the evidence, not about this defect.** A run of zero
over *n* trials bounds nothing until *n* is put beside the rate being looked for. Thirty was about a
thirtieth of what this question needed, and *0 red in 30* was true, was measured, and carried a
conclusion it could not support — which is this file's own diagnostics rule arriving on a measurement
instead of on a screen: an inference offered with its premise is argument, a conclusion offered alone
is assertion, and the premise here was a number nobody had compared with anything. It is `G-14`'s
lesson met from the other side. There a pin claimed a determinism the draws did not have; here a
silence claimed an absence the trials could not establish.

**Two readings were built and refuted rather than argued**, which is the whole reason the third one
could be believed. The working directory on its own — **0 failures in 400 rounds**. The `git`
subprocess an install spawns, which is the one thing this guard does that its forty-two neighbours do
not — **0 in 200, across four arms**. What *is* established is that a directory held as a process's
working directory answers exactly `EPERM` on exactly `rmSync`, and that `command.test.ts` is the only
one of this folder's 43 teardowns that ever makes a project the working directory. **What holds it
during the natural failures is not established**: 600 rounds outside vitest reproduced none, so nothing
here names one. The previous version of this section refused to name a cause for the same reason, and
that refusal is what left the question in a state somebody could still measure.

**`maxRetries` is not the mechanism, because it does not work.** Measured on node v24.15.0, three runs
alike, against a directory held as another process's working directory:

```
rmSync(root, { recursive: true, force: true })                        EPERM after 0ms
rmSync(root, { recursive: true, force: true, maxRetries: 10, ... })   EPERM after 0ms
await rm(root, { recursive: true, force: true, maxRetries: 10, ... }) removed after 634ms
```

Node documents that option as retrying exactly `EPERM` when `recursive` is true. The synchronous form
answers in zero milliseconds, which is the shape of an option read and dropped. Reaching the
asynchronous one would turn this folder's 43 teardowns, every helper above them, and `rewrite.ts`
through to `command.ts` into promises — and `command.ts` is the file whose whole property is that
everything it decides is reachable from a guard with no process. So the retry is written in
`remove-directory.ts` with the measurement beside it, which is the treatment `ignored.ts` already gives
`git check-ignore`'s exit codes.

**The sweep found the same defect on the install path, and there it is worse.** `rewrite.ts` removes
the folder it parsed a submission's imports in from a `finally`, and a `finally` that throws replaces
what was being returned — so an `EPERM` there turns a rewrite that worked into an install that failed,
on the one path that writes into somebody else's project. One module answers for both callers, because
there is one rule about an operating system and a copy in each would be two.

**The guard is seen red on the real condition rather than on a reconstitution.** A child process holds
the project as its working directory and writes a sentinel before anything is removed, so the guard
cannot pass by winning a race against a holder that never started. With the retry taken away it answers
the identical `EPERM` on the identical call; with it restored the directory goes.

**Before and after, over the same loop at two commits.** 3 in 149 at `d0ee718`; **0 in 700** at
`0813211`. If the repair had changed nothing, P(0 in 700) = 6.6 × 10⁻⁷, and 0 in 700 bounds that class
under **0.427 per cent** against 2.01 — a margin of about five, which is what a repair is chosen on
rather than on the second decimal of either figure.

**And the after arm found a second cause of the same symptom, which is the whole argument for measuring
a repair instead of declaring one.** One run in 700 reddened
`only-what-the-removed-feature-alone-pulled-in-goes-with-it`, and it was not `EPERM` but
*Test timed out in 5000ms* — on a run that took **62.4 s against a 6.0 s median**, a stall of ten.
Measured over ten idle runs, the slowest guard of this folder is 2 688 ms, which is **1.9 times** that
default and 1.4 under load: a threshold that gives way at a stall of two, in the one folder whose guards
wait on a compiler, on `git` and on a disk. It was nobody's decision — no contract says an install
finishes in five seconds — so `cli/vitest.config.ts` now declares 60 000, twenty-two times the slowest
guard, and the sentence in `packaging/vitest.config.ts` claiming everything else here decides in memory
is narrowed, because it was already false of `cli/` when it was written.

**The third cause is closed, and it was the drive letter after all — the correlation the last unit was
right not to promote on the evidence it had.** Twice in eight battery invocations a run collected
**nothing at all**, and both times `assertTheCensusHolds` refused before a verdict existed, naming each
file and its declared count. What stopped a cause being named was arithmetic: 28 collected assertions
is not the 0 a lower-case drive had been separately measured to give. **Both figures are that one door,
read through two configurations.** The contracts' own declares five `.test-d.ts`, which tsc collects in
the parent process where no worker is involved, and 9 + 5 + 4 + 5 + 5 is 28; `cli/vitest.config.ts`
declares no typecheck files at all, so nothing survives and the run collects 0 of 170. Under the
lower-case spelling all sixteen runtime files fail with `TypeError: Cannot read properties of undefined
(reading 'config')`.

**It is not a rate, which is why nobody could reproduce it.** Measured over twenty runs of each
spelling: `c:\...\toopo` collapses **20 of 20**, `C:\...\toopo` collects 472 **20 of 20**. The spelling
is carried rather than produced — `realpath` does not normalise a Windows drive letter,
`import.meta.url` keeps whatever resolved the entry point, `join` carries it on — and both shells
measured normalise a typed `cd`, which is exactly why fifty invocations through npm and through node
had reproduced nothing. What does not normalise is a script named by a lower-case absolute path:
`node c:\...\mutation\measure.ts fixture` refuses at calibration from a shell whose own directory is
`C:`. Eight invocations from mixed launchers giving two collapses was never a probability — it was a
predicate on the invocation, counted as though it were one, which is this section's own lesson
arriving on the defect that closes it.

**And the two paths a run is given were separated rather than moved together.** `runSuite` hands the
child a working directory and an entry point, and the twenty-run measurement above varied both at
once. Split, on the same suite: `cwd C: entry c:` collects **28**, `cwd c: entry C:` collects **472**.
**The working directory is irrelevant; the path node is given for `vitest.mjs` decides.** A
configuration cannot defend itself either — canonicalising `root` inside `site/vitest.config.ts` and
running from a lower-case entry point still collects 0 of 78 — so the only place the spelling can be
fixed is where the path is built, which is why `vitest-entry-point.ts` is one constant and not one
per caller.

**The half of this that was not ours is closed, and what closed it is a reframing rather than a
measurement.** Every script that starts vitest reached it through `node_modules/.bin`, whose shim
derives `vitest.mjs` from wherever PATH found it — and an ordinary `npm run site` collapsed exactly
this way: seven files, no test, root `c:/...`, while node in that same shell answered `C:` for its
working directory moments later and the next `npm run site` collected all 78. What produced that
spelling was not isolated and is still not guessed at. It was priced and refused once, on the reading
that it is loud rather than dangerous — the run exits non-zero having collected nothing, so no verdict
is ever built on it. **That reading is true of the instrument and false of a stranger**: somebody who
clones this on the day it is published and types `npm run site` gets `TypeError: Cannot read
properties of undefined (reading 'config')` with no explanation and no relation to what they just did,
on the first project whose front page sells verifiability. `run-vitest.ts` is the entry point every
script now goes through, and `vitest-entry-point.ts` owns the rule both routes share.

**The count in that paragraph was wrong before anybody read it back, and it is dropped rather than
corrected.** It said *the five `npm run <suite>` scripts*; seven start vitest — `test`, `meta`,
`registry`, `validation`, `cli`, `site`, `packaging` — and `npm test` was the one missing from a
sentence about what a stranger types. It is the fourth count retired in this file, on the rule the
others established: a state does not drift where a tally does, so the sentence now says *every script
that starts vitest* and has no number to go stale.

**What the repair costs, measured rather than asserted, because a cost paid on every commit by every
contributor for ever is a design question and not a footnote.** One node process per suite: median
**134 ms** through the launcher against **76 ms** direct, over ten invocations of `--version` each.
Bare `node -e ""` is **54 ms** on the same machine, so the 58 ms is the process itself and about 4 ms
is stripping the two modules — irreducible short of not having the process, and a plain `.mjs`
launcher would buy those 4 ms at the price of a file the typechecker never sees. Across the seven
suites that is **0.41 s**. Against a full pass — **34 s** on the machine this repair was asked from,
**38 s and 49 s** on two runs of the machine it was built on, which are two machines and are said to be
two — it is below the noise rather than a share of it: those two runs of identical work differed by
**11 s**, and `packaging` alone moved **7.7 s** between them, nineteen times the whole cost of the
change.

**What is shared is the rule and not the launching**, and that is written in `run-vitest.ts` because
it is what somebody will undo. `mutation/run.ts` goes on building its own child command — it needs
pipes to read a report back, a pinned `TZ`, a json reporter named beside the default one and an output
file it chooses, none of which a forwarded command line can express. Both import
`THE_VITEST_ENTRY_POINT`; neither restates it.

**Three guards, and the third was measured on its own.** `mutation/instrument.test.ts` holds them
together because there is one door and two routes into it. On the edit that makes
`withCanonicalDriveLetter` the identity all three redden — 3 failed, 29 passed. On an edit that leaves
the rule alone and has `run-vitest.ts` build its own path, **only the third reddens** — 1 failed, 31
passed — and its assertion prints the door verbatim under both of the fixture's files. No edit was
found that reddens the second alone, and that is recorded rather than left to be assumed from the
symmetry.

**And it is the drive letter and nothing else.** `C:\users\...`, `C:\...\toopo\toopo` and both mistakes
at once each collect 472 — so the repair upper-cases the drive letter and touches no other segment,
because the rest of a path is a claim about spellings that live on the disk rather than in a function.
The elisions are a redaction of one machine's home directory, taken when this repository was swept for
publication; the case of every segment shown is the spelling that was really run, which is what this
measurement is about.

**Pinned rather than refused, on the argument `Battery.timeZone` already makes.** That field pins the
process time zone because a verdict measured under whatever zone the operator's machine carries is not
one anybody else can reproduce; a drive letter is the same ambient input reaching the same apparatus,
so `vitest-entry-point.ts` chooses one spelling and every child process started here is given it.
Refusing would have cost a replay and taught an operator to relaunch, and the two spellings name one
directory. **The census stays the backstop, and it is why this was ever a door rather than a mystery**:
the red-control refusal prints `control.failedGuards`, and no guard failed — *a red control with no
failed guard says only that something did*. What said which sixteen files, twice, is the census.

**And the census now quotes the run instead of only counting it**, which is the filed remedy built
rather than dropped once the door was named. It listed the empty files and threw away the one sentence
saying why they were empty: vitest reports it per file in `testResults[].message`, `runSuite` read past
it, and that silence is what cost two replays. A fault line now carries `the run said: <what it said>`,
and the refusal names the entry point it ran — the spelling the isolation above shows is the deciding
input. Under this door the two lines read `Cannot read properties of undefined (reading 'config')` and
a path beginning `c:`, which is the whole diagnosis on one screen.

**Seen red on the real condition rather than on a reconstitution**, by a guard that invokes the
instrument exactly as a launcher that does not normalise invokes it. With the rule made the identity
the child answers `control RED (0 tests)` and calibration refuses on the census; with it restored the
fixture battery agrees with every verdict pinned for it. A second guard beside it pins that only the
drive letter moves — a function upper-casing the whole path would keep every replay green, since
`C:\users\...` collects all 472. `paths.ts` also ends four copies of the same two lines: `run.ts`,
`replay.ts`, `tally.ts` and `instrument.test.ts` each derived the folder and the root from their own
module URL, and a rule about one of them held in four places is held in none.

**And a leak the sweep found beside it.** `withNoGit` made an empty directory per call and removed
none — one per run of this suite, 1 933 of them under the operating system's temporary directory on the
machine where this was found. It is now made once and removed with the file, and what is checked is the
delta per run rather than a total anybody would have to trust: `1, 2, 3` before, **0 on every one of
700 runs** after.

**A fourth event of this family is recorded and not diagnosed, which is the whole of what one event
supports.** The first of the two replays taken at `06e264b` reported *`cli-search`:
`every-shape-of-import-is-repointed-and-not-only-the-obvious-one` is declared silent and a mutant
reddened it*. Rerun alone, immediately afterwards, that battery agreed on all twenty of its cells and
the guard was silent again; the second full replay was clean throughout. So the event is not
deterministic, and the two things it is not are worth writing down: it is not that battery's cells,
which reproduce, and it is not the unit that was running, which edits nothing under `cli/`.

The guard reaches `rewrite.ts`, which is one of the two callers of `removeDirectory` — the module this
section exists for, whose retry gives up after 2 750 ms. That is a *candidate* and it is left as one.
**Nothing here establishes it, because the instrument cannot say why a guard failed**: a reddened
silence declaration is reported as a stale declaration and the exception behind it is not carried, which
is the limit this section already names — neither report is looking at whether a guard is intermittent.

**What forbids going further is this section's own lesson rather than a shortage of time.** *0 red in
30* was true, was measured, and carried a conclusion it could not support; *1 red in 2* is the same
shape with the sign reversed. A rate needs a trial count put beside the rate being looked for, and two
replays is not that at any price — the cheap form is the isolated loop that settled the `EPERM` case,
and it is not this unit's to run. What is owed is that the observation exists with its date, so the
next occurrence is a second event rather than a first one.

## What one cell of a battery collects — settled

**A contract battery's cell now collects its own contract's suite, and the whole of the value is a
slope.** Measured over one to five contracts, three runs of each, a suite run costs `705 + 78·N` ms;
the 74 cells a contract carries turn that into `52·N + 5.8·N²` seconds, which is the quadratic the
method page's invitation dies of. Narrowed, a run costs 743 ms whatever N is and the same cells cost
`55·N`.

**At five contracts it is worth two minutes nineteen, and that figure invites the wrong conclusion.**
Measured on the ten contract batteries alone, before and after: **10 min 9 s → 7 min 50 s**. The
comparison is deliberately those ten and not two full replays, because two replays of identical work on
this machine differ by more than this change does — `cli-install` alone has moved 95 s between runs of
the same cells. There is no saving to sell today; there is a term that grew and is now flat.

**Which configuration can be narrowed is a measurement, not a choice, and that is what makes the design
unarguable.** A vitest filter ending in `/` is resolved against the configuration's own root; a filter
without one is a substring of the whole path. Six of the seven configurations set `root` to their own
folder, so a filter naming that folder resolves *under* it and names nothing. Measured on vitest 4.1.10:

```
--config registry/vitest.config.ts   registry/                 0 files, exit 1
--config registry/vitest.config.ts   registry                 16 files - a no-op
(the contracts' configuration)       contracts/number/parse/   4 files, 122 assertions
```

So the narrowing is expressible under the contracts' configuration, whose root is the repository, and
under no other — nobody can generalise it to the six, because vitest does not permit it. The six need
none: their own `root` and `include` already collect exactly the folder their battery injects into. The
trailing slash is also what makes the filter precise, since `contracts/number/parse` without it would
match a future `contracts/number/parse-int`.

**The census is selected, never redeclared, and that is the premise this unit removed rather than
paid.** A narrowed run collects a fraction of its configuration, so it cannot be compared against the
whole table — and the obvious repair, *a census per battery*, multiplies every integer in a file that
already grows with the catalogue. What a run collects is instead selected from the same table by the
folder the battery injects into: a field it already holds, and already the predicate `run.ts` used to
decide which guards were its own. **No integer is new and none moved.** For the six own-root
configurations the selection is the whole table, so it is one rule with no branch — which is what makes
its refusal cover every battery rather than only the narrowed ones.

**The wall this does not move, said rather than left to look addressed.** Four to five hand-written
counts per contract, twenty-one for the five, ~2 100 at five hundred. Deriving them was measured and
refused: over the five, an `edge-cases.test.ts` collects `cases + 1`, `cases + 4`, `2 × cases + 1`,
`2 × cases + 6` and `cases + 4` — the constant differs per contract, so a derivation needs a
hand-written integer *and* a formula, where the formula is a second statement about the shape of a test
file. The counting is its own demonstration: reading `id:` off the five case tables gives 194 where the
catalogue publishes 187 cases, because a group carries one too.

**`ownGuards` went with the difference it expressed.** A pin resolved against every guard the run
collected and a declared silence against the guards of this contract, because the run collected all
five and the two sets differed. A narrowed run makes them one set, so the parameter that expressed the
difference is gone — two mechanisms over one scope have nothing to say on the day they disagree, which
is the argument that already refused a second guard over profile names. The cost is that a pin may no
longer name a guard outside its own contract, which is a tightening: measured over the ten contract
batteries before any of this was written, **220 pins, 409 declared silent guards and 8 declared silent
suites, and not one needed the wider universe.**

**The acceptance criterion was the 370 verdicts, and what it bought was the eight cells it did not
excuse.** Every contract-owned cell was measured under both regimes and compared on its verdict *and*
on `failedGuards`: **0 verdicts differ, 0 cells absent on either side.** Eight cells moved a guard, so
the question was settled by a control rather than by the structural argument — two runs under the *same*
regime move **ten**, and every guard that moves in either comparison lives in `properties.test.ts`,
none in a case table, a profile or a signature. **The re-drawing is louder than the change**, which is
the only form in which that comparison could have been believed.

**Two refusals, each seen red alone.** A configuration nobody has counted was already refused; a folder
no counted file lies under is the new half, and it fails on the opposite condition — an empty census
agrees with a run that collected nothing. What it buys was measured by removing it: calibration walks
on and dies on `Command failed: git checkout HEAD -- mutation/fixture-renamed`, naming no census, no
configuration and no count, in front of somebody who has just renamed a folder.

**And the mechanism that saves the time carries no guard of its own, deliberately.** A filter dropped
makes the run collect the whole configuration and the census refuses it by naming every file it did not
declare; a filter added to one of the six collapses the run and the same refusal names every file that
collected nothing. Both directions were already held by the mechanism that was there.

## What contribution this project invites — settled

**An implementation, a counter-example, an alias correction — and never a contract.** It is not a
policy about who is trusted. Counted over the five, the values a contract freezes for the life of its
major outnumber the ones that can be put right by more than three to one, so reviewing a contract means
being right once and for ever about several hundred addresses a later correction cannot reach.
Nobody can do that at the speed a queue arrives at, and a queue reviewed at that speed would freeze its
mistakes into the one thing this registry sells. An implementation freezes nothing: it competes under a
contract that already exists, is judged by running it, and being wrong costs a revision.

**No figure from that census is restated here, and that is this file's own rule applied at its first
opportunity.** `mutation/contributing.test.ts` derives every one of them from the five records and
requires `CONTRIBUTING.md` to publish it, so a case added tomorrow reddens the document rather than
ageing it. A count copied into this file would be the part of a true sentence that goes false while
nobody is looking, which is the failure recorded four times above. **When the figure is held by a
guard, the journal names the guard.**

**The corrigible column was right for the wrong reason, and that is the finding.** The obvious split is
the aliases and the twenty universal-property answers — and an *answer* is not corrigible. Declaring an
applicable property inapplicable narrows what the contract claims and breaks nobody; the other
direction turns a conformant implementation into a non-conformant one, which is exactly what permanent
rule 6 forbids. What is corrigible is the **reason** beside each verdict, which is prose. There are as
many reasons as verdicts, so the total never moved — **an error that leaves the arithmetic intact is one
nothing but reading the column can catch**, and the verdict now sits in neither column with the
asymmetry stated.

**The cheapest contribution is the one nobody has ever made.** Adding a case to a group that already
exists costs nothing — no address moves, no caller breaks — and the schema has carried
`found-in-the-wild` beside `specified` and `found-by-mutation` since the day it was written. Measured
over the whole of block 4.4: **183 `specified`, 4 `found-by-mutation`, 0 `found-in-the-wild`.** Every
edge case here was found by writing a contract or by mutating an implementation, and not one came from
somebody using the thing. That is why the counter-example leads the document rather than the
implementation.

**What the document may not do is promise a pipeline that is not there**, on the page that invites
people in. Stage 1 exists and stages 2 to 7 do not; `analyseImplementation` has no caller outside its
own folder's tests, measured rather than assumed. So the five rules are named by their frozen
identifiers and resolved **in both directions** — every rule the modules export occurs in the document,
and every rule-shaped identifier the document's own stage-1 section quotes is one of them. The second
is the dangerous direction: a document naming a filter nobody wrote sends a contributor looking for it,
which is *a diagnostic that names a cause no measurement establishes* arriving on a Markdown file.
**What no mechanism keeps is a sixth rule**, added to that composition and named nowhere — enumerating
them would be a second statement of what `analyseImplementation` composes. It is declared, and it fails
in the safe direction.

**The guard lives in `mutation/` and the placement is an argument rather than a convenience.** Both
folders that own its upstreams are injected into by a battery, and a battery measures whether the
catalogue's own tests catch defects in the catalogue. A guard over a Markdown file is not that, so
putting it in `registry/` would have made `registry-storage` declare a document as an unprobed region
of the registry — the data arranged to suit the tool. `mutation/` is the one folder no battery injects
into, which is `verifiability.ts`'s line and not an escape from a cost.

**The site's section carries no link, and the page's own guard is what makes that structural.**
`every-page-is-reachable-from-the-front-page` compares every `href` on the front page against the set
of pages, so an address outside the site cannot be written there at all — and there is none to write,
because this repository has no public remote and inventing a URL to fill the gap is the class this
project spends its length removing. The file is named and not linked. It carries no figure either: the
ratio is held by a guard one folder away, and restating it would be a second statement of one
measurement on the surface that cannot compute it. **The heading is *What a contribution can be* and
not *What we accept*,** because the front page already carries *What we refuse* two screens up and that
one is about contracts the catalogue turned down.

**And a defect was found by reading the front page in document order and deliberately not repaired.**
The contract list reads `typescript/number/parse@1Convert a string to a finite number…` — the anchor and
the summary under it are one sentence with every word present, which is `not applicableThe signature
takes a single string` on a second page. It is **not** a one-line repair: `a` has no entry in
`document.ts`'s `SEPARATOR`, and giving it one changes the text projection of every anchor on six pages
including the ones inside a sentence. What would close it is a decision about which anchors are labels
and which are inline, and the site battery replayed after it. That is a unit; folding it into a
documentation change would have been the silent widening this file refuses in the other direction.

## A root computed by walking up a fixed number of levels — settled, repository-wide

**It is a class and not a list of sites, and it is invisible to every search a move is planned with.**
A repository root written `join(import.meta.dirname, '..')` or `dirname(import.meta.dirname)` contains
no path literal, so a folder that gains a level breaks it and nothing that greps for paths, imports or
globs can see it coming. It was found by `packages/validation`'s two guards failing on a
`tsconfig.json` one directory out of reach — seven reds, after the same class had already been
foreseen and repaired one commit earlier in `serialise.ts`, which is what made it a class rather than
a repair.

**Ten sites, with the verdict each one got**, because a swept class is worth what its enumeration is
worth. Correct untouched, the folder having stayed at the root: `packaging/the-archive.ts`,
`packaging/build.ts`, `packaging/archive.test.ts`, and `mutation/paths.ts`. Repaired to two levels:
`packages/registry/serialise.ts`, `packages/validation/source.test.ts`,
`packages/validation/the-five.test.ts`, `packages/site/build.ts`, `packages/site/playground.test.ts`.
And one that is correct *because it is not about the source tree at all*:
`packages/cli/published.ts` resolves the artefact at `join(import.meta.dirname, '..', ARTEFACT_FILE)`,
which is a fact about the compiled layout under `dist/` — it survived because
`packaging/tsconfig.dist.json` moved its `rootDir` to `../packages` and kept `dist/cli/published.js`
where it was.

**The rule the eleventh needs: a computed root states how far up it is going, and what it is going up
from.** The distinction `published.ts` embodies is the one that matters — a walk over the *source*
tree and a walk over the *emitted* tree are two different facts that look identical, and only one of
them moves when a folder does.

**Two neighbouring forms were found in the same sweep and neither is this one.** A path held as
segments — `join(REPOSITORY_ROOT, 'contracts', 'date', 'add', 'reference.ts')` — is invisible to a
path-shaped search for the same reason and is repaired the same way. And a dynamic
`await import('../registry/emit.ts')` is not a `from` clause, so a rule anchored on `from '` walks
past it; `packaging/build.ts` holds three and `site/build.ts` held two, all written dynamically
because the hook that translates a `.js` specifier cannot be used before it is registered.

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

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
