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
in `catalogue/`, and the checklist a sixth contract is measured against is `contractAnatomy` in that
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
were already refused — under sentences naming causes no measurement establishes, which is this file's
own worst class — and **the sixth installed the right artefact for the wrong reason: an edge naming an
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

## Error convention — settled, catalogue-wide

A fallible function returns `T | null` and publishes a diagnostic export **beside** it:
`describe<X>Failure(...)`, returning a reason literal owned by that contract, or `null`. No type is
shared between features — each contract declares its own literals.

Every contract that publishes a diagnostic carries a **coupling property**: a call fails exactly
when it has a description. Without it the two exports can drift, and an implementation that
optimises the answering path while leaving the diagnostic one alone will diverge on any input the
named cases do not cover.

Three forms were built and measured across both prototype contracts. The union
`{ ok, value } | { ok, reason }` ties this one on detection, so the error convention is not a
verification question. Read that tie at the strength it was actually measured: on `date/add@1` it is
a full-battery tie, every mutant under both lenses; on `number/parse@1` it rests on four mutants
under one lens. What decided it is that this form is **additive**: a contract can ship
`name@1` with no diagnostic and gain one later without breaking anyone, whereas putting the reason
in the return type freezes it into the major version on day one. Known costs are recorded in the
project specification, together with what would invalidate the decision.

Those measurements are replayable, at three annotated tags whose messages say what each one proves:
`evidence/error-convention-round-1` (two forms, six call sites), `evidence/error-convention-round-2`
(three forms on both contracts, and the batteries the detection tie comes from) and
`evidence/error-convention-round-3` (the callers that need the value and the reason at once). They
are tags rather than branches because the conclusion is on `main` and nobody should be reading three
dead working states — but a published sentence with no replayable measurement behind it is an
opinion, which is the one thing this repository sells against.

**The reason set of a contract is frozen with its major version.** Adding a literal, removing one,
or splitting one all break a caller that switches exhaustively — so the partition is chosen once,
deliberately, and a later change costs `name@2`. The additivity that decided this convention covers
gaining a diagnostic, not reshaping one.

## Case identifiers — settled, catalogue-wide

Every case of block 4.4 carries an `id`: a **name**, in kebab-case, unique within the contract and
**frozen with its major version**. The guards that assert a case are addressed by it — see
*Guard identifiers* below, which generalised this rule to every guard in the catalogue.

A name, and not a rendering of the case's own data. `"1e400" -> overflow` restates the row it
addresses, so it can be wrong about it, and §4.4 makes every case one line of public documentation —
where false documentation is worse than none. The published line goes on being rendered from the
data; the identifier only addresses the case.

The measurement that forced it: the two fallible contracts titled their guards out of the very data a
specification battery injects into, so a mutant that changed an expectation reddened a guard under a
title the unmutated contract does not contain, and left the calibrated one silent — a hundred guards
of `number/parse@1` and eighty-six of `date/add@1` declared silent as an artefact of the apparatus.
`array/group-by@1` carried an explicit name and did not have the problem.

The reason that outlives the instrument is the registry's: an API response citing a case, a URL
anchor on a contract's page, a validation report naming the case a submission failed — each needs an
address, and an address that changes breaks links. Renaming one therefore costs `name@2`, exactly as
reshaping a reason set does.

## Guard identifiers — settled, catalogue-wide

Every guard carries an **identifier**: a name, in kebab-case, unique within its contract and **frozen
with its major version**. A guard's title is that identifier, then ` :: `, then a sentence for
whoever reads the runner's output — or the identifier alone, when it says everything. Batteries pin
identifiers, attribution reports identifiers, and `calibrate()` refuses a guard whose title carries
no well-formed one, or two guards of one contract answering to one.

A guard needs two things and they are not the same object. It needs an **address** — a battery pins
it, an attribution cites it, and a validation report will one day put it in front of a submitter. And
it needs a **sentence**, because test output is read by people. One string doing both means every
reword breaks a pin, and it means a title rendered from the contract's own data renames the guard a
specification mutant reddens.

That second failure was measured rather than argued. LS-13 of `string-levenshtein-spec` relabels the
`identical` benchmark profile as `far` — a profile that claims to time the fast path, published as
timing the worst case. Before this rule its guard reddened under `identical - every sample is far`, a
title the unmutated contract does not contain, so calibration never saw it and attribution had
nothing to attribute. The battery passed, reported thirteen of thirteen defects killed, and went on
calling that region one no mutant probes — while a mutant probed it. The refusal the instrument is
built around, *a declaration a mutant contradicts is stale*, could not fire. After the change it
fires, the declaration had to go, and `identical` left the unprobed list. **That is the one class of
defect these identifiers make detectable.** The other 466 guards are a tidying for the registry, and
it is recorded as one rather than dressed up.

**A name, never a rendering of the data the guard asserts over** — the rule block 4.4 already carries
for a case identifier, restated here because guard identifiers were created without it being reapplied
to them, and nine of them had drifted. The test is mechanical: *the identifier and the assertion carry
the same number, so the two can be edited apart.* `three-needs-are-answered-without-the-api` listed
four, and its own comment said that a fourth appearing silently would mean something had moved off the
API without anyone saying so. A fourth appeared, the list was updated, the name was not, and the guard
written to detect a silent change was blinded by its own name. Renaming is the repair rather than
correcting the number, because a name that has to be edited whenever the data moves is not an address.

**A count and a state are not the same thing, and this is what separates them: falsifying the name and
reddening the guard are the same event, or they are not.** An identifier that renders a *state*
disappears with the claim it carries — `nothing-is-measured-yet` asserts `toEqual([])` three times and
holds no number to drift from, so the day a figure is measured the guard is retired rather than
renumbered. An identifier that renders a *count* survives the data: the list grows, the assertion is
edited, the name stays, and it has become a lie. That is the rule to apply to the next case, and it
decides it without a second opinion.

What this does *not* forbid is a number that names the subject of a case rather than tallying a
collection — `two-decimal-points`, `p4-triangle-inequality`, `signature-accepts-two-strings`. An
identifier derived from a *frozen* address stays an address, which is what `${id}-described` and the
`eachContract` slug are.

**A benchmark profile's name is frozen with the major version**, for the reason a case identifier and
a guard identifier already are: the registry will cite it in a benchmark figure, the site will make it
a URL anchor, and a validation report will name the profile a submission failed. It was already an
address in fact — the five specification batteries pin `profile-<name>` identifiers and one of them
documents `profile-identical` as *the address* in as many words — and it was the only derived
identifier in the catalogue that nothing declared frozen. No guard was touched: the gap was the
missing declaration, not the names. That sentence used to publish a count of the guards left alone,
and the count was wrong by one before anybody read it back — a state does not drift where a tally
does, which is the rule this file already carries and had not applied to itself here.

**The freeze was a policy rather than a mechanism when this was written, and the pre-flight made it
one.** A mutant that renames a profile still renames the guard built from it: all five
`profiles.test.ts` construct the title in a loop over `benchmarkProfiles`, so no title is ever left
behind and **a guard resolving the record against those titles could not fail** — which is what
disqualifies the obvious mechanism rather than any argument about its worth. What is resolved instead
is what a *battery* names, and both spellings this paragraph once called unguarded — a pin that stops
matching, a silence declaration naming nothing — are refused in `calibrate()` before a verdict exists.
Measured at `277a637`: the five declare **27** profiles, the suite collects **27** guard titles
`profile-<name>`, and **27 of 27** are named by a battery, so every one resolves.
`benchmarks.profiles[].name` stays `one-directional` in `field-map.ts` for its **other** half — a name
makes a claim about its own samples that no guard reads — and that half is in the launch debts below.

**Uniqueness is per contract.** The instrument can only break inside a contract — a battery injects
into one folder, and attribution already filters guards to the contract under measurement — and the
registry will address a guard by the pair `(contract identity, guard identifier)`, exactly as it
addresses a case. A globally unique identifier would encode the contract into the name, duplicating
what the pair already carries and making a contract rename a rename of every guard. The cost is
stated so it is not discovered later: **the registry schema must always carry the pair, never the
identifier alone.** Fifteen identifier strings are held by more than one contract today.

**Four identifiers belong to the catalogue rather than to a contract**, and only four:
`every-case-is-addressed`, `every-case-is-justified`, `every-case-is-grouped` and
`universal-properties-answered`. Those are not five guards that resemble each other — the helper *is*
the guard, one function applied five times — so each is a constant exported from
`catalogue/every-contract.ts` and a contract cannot rename it locally. Renaming one costs a major on
the whole catalogue, the discipline everything in that file already carries. The other twelve shared
strings are five contracts asking the same question about different data: *resemblance is not
duplication*, the rule the catalogue already applies to `outputsAreEqual`, so each contract owns its
own and two may coincide.

**The separator is ` :: `, and it is ASCII on purpose.** It cannot occur inside an identifier,
because an identifier has no spaces, so the split cannot be wrong. An em dash reads better and would
have been the first non-ASCII code point in any title in the repository: measured over every `it(...)`
in every test file, none carries one, and `number/parse@1` is where the cost of a stray non-ASCII
character in a source file was paid once already.

**Three published counts of guards were dropped rather than corrected, and the reason generalises.**
This sentence, `run.ts` and `every-contract.ts` all read *467*, and 467 had stopped being the number
of guard titles some time before anybody noticed. Which of the three things 467 once counted is not
recoverable, so nothing was patched: a count in prose survives the data it counted and becomes the one
part of a true sentence that is false. What each claim is actually about — *none carries a non-ASCII
code point*, *no identifier is duplicated inside a contract* — does not drift, and `calibrate()` is
what holds the second. It is the rule about identifiers rendering a count, arriving on comments.

**And the remeasurement that replaced 467 did not survive its own paragraph, which is the third
instance and the one that settles the treatment.** This sentence went on to publish *501 `it(...)` call
sites* and *974 collected assertions*, and neither reproduces under any counting I can construct.
Measured at `2b90f96`, over every tracked `.test.ts` and `.test-d.ts`: **514 call sites — 479 written
`it(` and 35 arriving through `it.each` — and the census declared 998**, which was 472 + 288 + 27 +
146 + 62 + 3 across the six configurations and was what the six suites reported at that commit.
Restricting to `.test.ts` gave 486, and to `contracts/` gave 94; nothing gave 501, and nothing gave
974. A bare count replacing a bare count buys one cycle of being right.

So the pair is not dropped this time, it is **given its coordinates** — the commit and the population
counted — by the rule `registry/contract-record.ts` carries for a published size. A count with a commit
beside it is re-derivable and stops being a claim about today; a count without one is the part of a
true sentence that goes false while nobody is looking, three times now in this file alone.

**A stamp does not travel to the sentence beside it, and that is the fourth instance — the one that
cost a clause rather than a number.** *the census declared 998* carries its commit and is true of it
for ever. *and is exactly what the six suites report when they run* sat immediately after, in the
present tense, over the same quantity — and it went false at `277a637`, one commit later, when the
`cli` configuration went from 146 guards to 147 and the census total from 998 to **999**, measured at
`9bb3025`. The commit that falsified it is the one that added
`every-clean-refusal-resolves-to-the-guard-it-names` — so the sentence was broken by the very unit
that was closing this same class elsewhere in this file.

**A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
in one sentence, and it is the lie the reader believes, because it is the one written in the present.**
So: the clause carries the stamp, or it is stated at the commit, or it is not written. Nothing else is
available, and the middle one is what the paragraph above now does.

**And the cheapest of the three is to need no number at all.** *Twenty-eight guards were left alone*
became *No guard was touched* in the profile-name section for exactly this reason: a state does not
drift where a tally does, and both sentences make the same claim. **When a sentence can be true without
counting, it does not count.** That is the rule to reach for first; the coordinates are what the
remaining counts get.

**What this does not cover, and it is not an oversight.** `npm test` will never see a duplicate
identifier: a guard cannot enumerate the tests vitest collected, so the refusal lives in
`calibrate()`, where the identities are already gathered. A contributor who writes a duplicate learns
it from the first battery they run, not from the suite.

## What a property settles — settled, catalogue-wide

A property that pins an exact answer on a generated family settles **exactly the decisions its
alphabet represents, and no others**. So for every decision a contract publishes about what its
answer should *be* — rather than about the shape of that answer — a reviewer can check that one of
two things is true: a representative of the decision is in the arbitrary, or a named case of block
4.4 settles it. The battery has to carry a mutant that says which, because the two look identical
from the outside.

Measured on `string/slugify@1`, whose battery reads the whole of block 4.4 blind on a second lens.
Twenty-one of its twenty-two behaviour defects still die on that column: shape properties turn out to
carry far more of the content than the table was written expecting. The twenty-second transliterates
Cyrillic, and it answers a well-formed, lower-case, idempotent slug that retains a subsequence — so
every property is satisfied, every benchmark profile keeps its class, and one guard in the whole
suite kills it: a named case. The control is a mutant folding the sharp s, the same kind of curation
decision from the same table the ecosystem writes, which dies on both columns — because the arbitrary
that draws well-formed slugs carries a sharp s and carries no Cyrillic.

What this forbids is the reading that a property is strong and a case is bookkeeping. A property is
as wide as its alphabet. Widening that alphabet is how a decision becomes property-checkable, and it
is a deliberate act with a cost — every symbol added is a decision the contract can no longer change
without the property going red, which is exactly what freezing means.

## Replaying a divergence — settled, catalogue-wide

A contract that answers differently from what the ecosystem or the language answers carries a guard
that **replays** the divergence on the rows where it happens, rather than asserting it in prose. The
guard names the exact set of cases that diverge, so a specification drifting back towards the common
answer takes the measurement refusing that answer with it, and the drift is red instead of silent.

Three contracts carry one, in three shapes: `array/group-by@1` in a file of its own against
`Object.groupBy`, `string/levenshtein@1` by recoding its table into UTF-16 code units,
`string/slugify@1` by narrowing its alphabet to ASCII. The shapes differ because what is being
diverged from differs; what is identical is that the divergence is measured on the contract's own
table rather than described.

`number/parse@1` and `date/add@1` both diverge — from `Number` and from every library's fractional
month — and neither carries such a guard. That is recorded here as a debt against this rule rather
than as an exception to it.

## What separates two elements in a reading — settled

**A title is written as a title, and the separator table is about blocks.** Every entry of `SEPARATOR`
is a block-level element; `a` is phrasing content, and giving it one would state about a phrasing
element something false of every other phrasing element beside it. So a contract name on the front
page is `h3.call` — **the tag is the outline and the class is the look**, the rule this file already
carries, settling both halves at once.

**Both branches of that decision were measured, and only one of them exists.** Over the seven pages
there are 211 anchors: 197 are `aria-hidden` and leave the projection entirely, and of the 14 a reader
can see, **nine are already the sole child of an element that separates and five had siblings — the
five defects.** Not one anchor on this site is written inside a sentence, so the question of what an
inline link becomes in a projection never arose. The shape came from the site rather than from taste:
the refusals page already renders this exact pair — an address and the summary under it — as a heading
and a paragraph, and 121 of the 126 list items open with `.call`. **Two renderings of one thing drift
until one lies**, and the one that lied was the front page, whose outline held its four sections and
not one contract name, on the page that *is* this site's navigation.

**The guard is the class, and the guard it stands beside is two of its instances.**
`a-label-and-the-sentence-under-it-are-two-lines` was written for the same failure on a contract page
and enumerates the two places somebody had already found — which is exactly why the third was found by
re-reading instead of by a red. `no-element-runs-into-the-one-beside-it` asks it of every element pair
on every page. **Both siblings must be elements, and that is measured rather than cautious**: with text
nodes admitted the predicate holds 53 pairs and 48 are ordinary inline markup, where the author writes
the spacing into the prose and is right to. It is also what keeps a link written inside a sentence
invisible to it, since its neighbours carry the spaces.

**A rule that is declared, implemented and reached by hand is the shape every failure of it takes.**
`methodology-page.ts` says the sentences from `mutation/` carry `**this**` and `` `that` ``, and that
printed as they are *a reader of the page sees the asterisks*. `inline` parses them and two call sites
reached for `line` instead, so the page whose whole subject is rigour published its own markup.
`no-mark-a-sentence-carries-reaches-the-reader-as-itself` is what was missing, and it is asked of that
page alone: a contract page publishes contract prose that writes `` `Intl` `` for a reader, which is a
separate question about the register of the catalogue's own text.

**Where a guard's cell goes is decided by where the guard is alone, not by where the defect happened.**
Every other sentence the method page takes from `mutation/` is also required by name somewhere, so the
same edit there reddens two guards and shows neither to be needed. At the silences it is the only red
in the folder — and it is the more robust anchor besides, since `THE_REPLAY.spread` carries one
asterisk pair where the page renders 64 silence reasons of which 48 carry a mark.

**And three guards over one page were undoing those marks three ways**, which is what looking for that
cell turned up: one stripped them by hand with `.replaceAll`, one compared the literal, and this unit
added a third spelling while arguing in its own commit message against the first. `asRead` is one
function now. **A copy of a parser is not a second opinion, it is the same statement written where
nobody will maintain it.**

**Two more the reading found, filed here as the neighbouring class and closed by the section below.**
`identity.relationToTheLanguage` published as a bare fragment, and `DETERMINISM_ORDERING_FINDING`
composed after a full stop on five contracts. **What that filing got wrong is worth keeping**: it said
the backticks a contract page publishes in its own prose *close with them*, and they did not. They are
a decision about the register of the catalogue's own text, where these two were a decision about where
a value may be printed — one predicate settles the second and nothing mechanical settles the first. A
prediction that two things close together is a claim like any other, and this one was made without
measuring either.

## A value written for one position, published in another — settled

**It is the neighbour of the class above, and neither guard there can see it.**
`no-element-runs-into-the-one-beside-it` asks whether two sibling *elements* run together. Both defects
filed against this unit sit in a `<p>` whose only child is a text node, so there is no pair inside it to
look at; one level up, the paragraph's own neighbours are a `<p>` ending `\n\n` and an `<h2>`, so the
predicate is false there too. Measured over the seven pages: **595 sibling pairs of elements, 0
colliding.** That guard's subject is the boundary *between two elements*; these are boundaries *inside
one string*, and no predicate over element pairs reaches them. **A declared limit rather than a hole** —
and the reason the class has been found three times by a reader and never by a guard.

**The register of a prose field is settled, by census rather than by taste: a string this record carries
that a page prints as a paragraph of its own opens like a sentence and ends in a full stop.**
`identity.relationToTheLanguage` had no register — three clauses and one sentence over its four declared
values — and the page prints it bare, so two contract pages published a fragment for as long as the
field has existed. Its siblings decide it: `summary`, `description` and `inputDomain` are sentences
**twelve times out of twelve** over the four contracts the registry serves, and the one value that is
already a sentence, `array/group-by@1`'s, agrees with all twelve. The alternative — declare the field a
clause and let the page frame it, as the page already frames `couplingRule` and a table's `purpose` — is
refused by that same census: `array/group-by@1`'s value is *two* sentences, so no frame fits it. The rule
is written beside the field in `contract-record.ts`. **Filling the two contracts that carry no such field
is a separate decision about content and is still owed.**

**Three instances in the catalogue and not two, and the third was found by the measurement rather than by
a reader.** `DETERMINISM_ORDERING_FINDING` is a clause all five contracts composed as `` `…own first
answer. ${it} - X is that mutant here.` ``. `NO_AMBIENT_OUTPUT_FINDING` is the same clause at the *head*
of a reason, opening a paragraph in lower case on four pages — three lines from the first in the same
file, and invisible to everybody who had read that file. Both are sentences now, and the ten composition
sites lost the joins that hid them.

**Two guards, and they are a partition rather than a pair: a value stands alone or it is embedded.**
`a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence` derives its population from the two things
that already exist — every string the record carries, and every paragraph of the page — so **no list of
prose fields exists anywhere to drift**. Measured: 212 paragraphs are a carried string and 6 were
fragments, which is every instance of the class and nothing else. What the derivation buys is the
exclusions: `couplingRule` and a table's `purpose` are punctuated *by the page*, so their paragraph is
not the carried string and they fall out on their own rather than being named.
`a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` takes the half no field-shaped guard
can reach, because a shared value is embedded and the string it lands in is a sentence whatever the seam
does. What the catalogue shares is whatever it exports; what is prose is whatever carries a space, which
is the one thing an identifier of this repository can never do — the argument ` :: ` was already chosen
on. Nine exported strings, five of them prose, two of the five in a record.

**The reading of the seven pages found two more, and one is not a fragment but a false sentence.**
`whyNotFrozen` was composed after a full stop, which is the catalogue defect verbatim on a value the page
composes rather than a contract. And `WHAT_A_SIGNATURE_DOES_NOT_PROVE`, a whole sentence, sat in the slot
where the page writes `This does not establish ${butNot}.` — publishing *This does not establish a
signature attests who published this snapshot and from what build*, which **denies the claim two lines
above it**. Every other `butNot` of that table is a complement. **No shape check could ever have caught
it: the composed sentence is well formed and false**, which is the half of this class that register
cannot reach, and `a-sentence-rendered-whole-is-not-also-a-complement` is what does.

**A guard that claims detection is not excused by a price, and a required field of one word is what said
so.** That third guard was first declared an unprobed region of `registry-storage`, with the cost of a
cell written out: a cell moves the published count, which `README.md` transcribes and `THE_REPLAY.spread`
describes as a population that has run, so it obliges a full replay to restamp. `UnprobedRegion` refused
the entry — `nature` is required, the value would have been `claims detection`, and `run.ts` says what
that means with no nuance: never having been red, such a guard is decorative until a mutant reaches it.
**The type turned a price into a decision**, which is *Make the omission impossible* arriving on the
instrument's own declarations. I-32 is the cell, and the replay behind it is what this section's figures
are stamped on.

**The five instances of the seam guard are out of reach, and the construction is the direction a damaged
string fails in.** The seam is composed in a contract folder; `serialise.ts` is the only module of
`registry/` the string passes through and it copies it. To redden the guard an edit would have to produce
a *misplaced* occurrence, and every edit that damages the string removes the occurrence instead. Measured
rather than argued: `reason: property.reason` replaced by `reason: ''` leaves the whole registry suite
green, those five included.

**Two neighbours are named and left, because their register is not this one's and neither is frozen.** A
table's `purpose` is rendered as a lower-case paragraph on the three contracts with one table — the page
supplies its full stop and not its capital — and it cannot simply become a sentence, because it is an
`h3` on the two contracts with two tables. The refusals page prints `decidedAgainst` and `keptAs` as bare
lower-case paragraphs, and there the `h3` directly above each one is its label, which is the shape a
clause is entitled to. Both are decisions about a rendering rather than about frozen prose, so the cost
of leaving them is a regeneration and not a repository somebody else owns.

## What a page is, and the two projections of it — settled

**A page is a value, and `toHtml` and `toText` are two projections of it.** Everything about the site
was decided by rendering a page in document order, stripped of markup, and reading it as a stranger —
which is at once what a search engine indexes, what a screen reader announces, and the closest thing
there is to *what somebody understands in ten seconds*. A generator that concatenated HTML could only
be measured by parsing its own output back, and a bug in the reader would read as a bug in the page.

So the reading stops being something somebody remembers to do and becomes something a guard holds. The
mutant it exists for is a text projection that quietly drops what the HTML shows: it produces a
*shorter and tidier* reading, which is exactly what somebody skimming a measurement hopes to see. It
is the only defect in that folder that could blind the instrument the unit was steered by, and two
guards catch it.

**What the reading found that no static check could.** Three defects, all invisible to a typechecker
and to every guard about presence. The first screen said the same sentence three times — title, meta
description and lede all carried the summary. The anchor beside a case was read aloud as a `#` that
means nothing, which `aria-hidden` now settles: the declaration that a screen reader skips an element
*is* the declaration that the text projection drops it, so the two answer to one statement rather than
to a rule about class names. And every universal property of every contract came out as
`not applicableThe signature takes a single string` — two blocks that had become one sentence, with
every word still present, so a projection guard was green and a person could not read it.

**Nothing is escaped that a reader can see, and everything else is.** Measured over the five: 36 of
438 string values carry a character that is invisible on its own or renders on top of its neighbour.
`number/parse@1`'s own source says why it matters — a no-break space and an ordinary one are the same
glyphs on screen and carry opposite answers in that table — so a page printing both as they are would
publish two cases a reader cannot tell apart, one saying the input parses and the other that it does
not. Cyrillic, Arabic, emoji, `é` and `€` are printed as themselves, because they are visible and
because `string/slugify@1`'s table is about them.

## What a contract page publishes, and what it leaves out — settled

**A refused contract has no page.** `array/group-by@1` was decided against *before* publication, so
`refuseContract` records an argument and binds no digest: there is no frozen definition, no snapshot,
nothing a reader could check. A contract page with no digest behind it would be missing the only half
that makes this registry worth anything. What the catalogue publishes about it is the refusal, on the
page written for refusals — which is where it belongs, and which is the most distinctive page this
project can publish on day one.

The cost is named rather than left to be found: that page cannot show the contract's own prose — the
comparison of lodash, Ramda, d3 and the two ES2024 built-ins that makes its case — because the registry
serves a refusal and not a definition of the thing refused.

**No implementation section.** The project specification describes a contract page for a mature
catalogue: implementations, benchmark figures, sizes, tags. There is one implementation per contract
and no reference machine, so a third of that page would be a table of nothing, and an empty section
tells a reader something is missing without telling them what. What survives is the one figure that is
measurable today and is the most immediate comparison against an npm package — **how many bytes land in
their project** — stated in the first screen and in exact bytes rather than rounded. `readableBytes`
stays in `cli/report.ts`, because a terminal line is read in passing and a page has room for the number.

**A page's address is the contract's address.** `/number/parse@1/`, anchored `#ordinary-integer`, which
is exactly what `renderCase` has rendered since `registry/address.ts` was written and nothing read.
That is the third time a field written for a consumer that did not exist yet turned out to be right,
after `identity.searchAliases` and `FIELD_MAP.verification`, and it is the argument for going on
writing the address before anything fills it.

## What a playground demonstrates, and what it refuses to show — settled

**It is not "expected against actual".** Both halves of that comparison would be ours, and the expected
half is already two centimetres higher, on the case's own line. What a static page cannot do is answer
**the input the reader typed**, so that is the whole of what a playground computes, and the settled
answer is deliberately not repeated beside it.

**It calls both exports, and the reason appears exactly when the answer is `null`.** A playground
calling only the answer shows half of any contract written to this repository's error convention — and
worse, it takes back the measurement the field's whole design rests on. `'1 000'` with a no-break space
and `'1 000'` with an ordinary one are the two rows that settled the literal, and against the answer
alone **both print `null`** and the distinction a reader came to see is invisible. Measured in a
browser, which is the only place it could be:

```
'1 000'   parseNumber(…) → null    describeParseFailure(…) → 'not-decimal'
'1 000'   parseNumber(…) → null    describeParseFailure(…) → 'separator'
```

Only when the answer is `null`, because the coupling property of both fallible contracts is that a call
fails exactly when it has a description — a `→ null` printed under every answered call would be a line
that is always the same.

**The diagnostic is called with the answer's own arguments, and the build refuses a contract where that
is not possible.** The form has one field per parameter of the answer, and nothing in the schema
requires the diagnostic to declare the same ones. Measured: they agree on two of two. A measurement is
not a rule, so it is checked.

**And the replay guard grew with it, which closed a real blindness rather than a supposed one.**
Measured by making the reference answer `'not-decimal'` where it answers `'separator'`: the guard as it
stood sees **0 of the 9 rows** that breaks, because every one of them still answers `null`, and the
reason comparison sees all nine.

**The order of the two refusals is written down, because leaving it implicit cost a regression.** W-37
of the site battery neuters the parameter-type refusal, and it went from killed to survived the moment
the diagnostic's signature was compared first: the second refusal fired in the first one's place, the
guard was green either way, and the battery is what caught it. A contract tripping both is told about
the parameter it declared, which is the more basic fact.

**The field holds a literal, and raw text was refused on a measurement rather than on taste.**
`contracts/number/parse/edge-cases.ts` says it in its own source: `'1 000'` with a no-break space and
`'1 000'` with an ordinary one are the same eight glyphs on screen and carry opposite answers in that
table — which is why that file names the character instead of pasting it. A raw text field
reintroduces, inside the playground, exactly the ambiguity the contract refuses to have in its own
bytes: somebody checking the no-break case types an ordinary space, gets the other reason, and has no
way to see why. The playground would contradict the page it lives on. It is also the only field that
covers the contract — `date/add@1` publishes four cases whose caller is untyped, `{ day: 1 }` among
them, and a form derived from the declared type cannot express one of them. Measured in a browser:
`'\uD83D'` is a lone surrogate a reader can type, and a raw field could not have expressed it at all.

**One table of types, whose only non-identity entry is `Date`.** Reading a literal gives the *declared*
value, which is what the registry models; turning that into an argument is a second step and exactly
one type of this catalogue needs it, because `registry/value.ts` refuses to model a Date and
`date/add@1` writes its instants as ISO strings. So `new Date(...)` in `site/playground.ts` is the only
place on the whole site where a Date comes into existence, and it is written on the line beside the
field. It falls *inside* the contract: a text that does not parse gives `invalid-date`, which is a
published case, so the added layer is not a hidden one.

**A parameter type the table does not know stops the build and names itself** — no fallback, no empty
field, no page rendered with a playground quietly missing. The shape `registry/value.ts` already takes
one floor down for a value it does not model.

**A field says what it is declared as before anything is called, and that was found in a real browser.**
Typing `42` into a field declared `string` used to answer `input.trim is not a function` — the
contract's own source reporting a failure in its own words to somebody who has never seen it. Every
type was satisfied and every guard was green; only opening the page and typing found it. It is the
measurement behind a rule this repository already states and had never paid for: **a static check
passing does not mean the interface works.**

**The answer is written by `literal(encode(…))`, never by `String`.** `parseNumber('-0')` answers a
negative zero and `String` prints it `0`, on the page where that contract settles a case on the two
being different. Measured: printing with `String` reddens 69 of the 157 served cases.

## What runs in a reader's browser — settled

**The `.js` specifiers this repository already writes are what make the playground free.** Every
relative import is written `./literal.js` for `literal.ts`, because `verbatimModuleSyntax` asks for it.
A browser resolves exactly that spelling natively, so a module graph written for a typechecker turns
out to be one a browser can load: no bundler, no rewriting, and the whole of the work is stripping the
types. The site's layout *is* the source's layout, and a reader who opens `/site/read-literal.js` sees
the file it came from rather than a bundle corresponding to nothing.

**Node's own stripper rather than a compiler**, and it is the only one available: `typescript@7.0.2`
ships a native compiler and no JavaScript API — `node_modules/typescript/lib/` holds `tsc.js` and a
version string — so a compiler here would mean a subprocess, and a subprocess would put a page's
content behind something no guard can reach. `stripTypeScriptTypes` refuses what it cannot erase rather
than guessing, which is the direction of failure this repository asks for.

**The replay guard imports the stripped artefact, not the TypeScript module it came from.** Importing
the module would measure something adjacent to what is shipped: it would establish that the arguments
are built correctly and leave unmeasured the one thing stripping can break — that the JavaScript
answers what the TypeScript did. So the reference is fetched by digest through the port, stripped by
the site's own function, and imported from a `data:` URL, which needs no disk because a reference
imports nothing. **That is what turns `stripTypeScriptTypes` being experimental from a declared risk
into a thing measured on every run**, which is the treatment `node:util.diff` already received.

**The one sentence about the gap lives beside the playground and nowhere else.** The JavaScript that
answers a reader is neither the file the registry serves nor the file the digest covers — both are
TypeScript. It is said where somebody is looking at an answer that transformation produced, and saying
it again under *What you can check yourself* would blur the section that is about the frozen
definition, where nothing has changed.

**A page is complete with no JavaScript, and the form is built by the script rather than served inert.**
A form in the HTML that does nothing without JavaScript is a control that lies about being one, and an
empty section tells a reader something is missing without telling them what. Without the script the
section is two paragraphs saying what a playground would do, which is prose rather than a hole. The
`script` node carries attributes and no children, so `document.ts`'s rule that no node holds raw markup
survives a script on the page.

**What the port had to gain, and the sentence that had to go.** `blob` was refused from the site's port
on the argument that *the site publishes no byte of anybody's source* — true of a page that only
renders, false of one that runs something, and a snapshot cannot stand in because it lists a file and
hashes it and a list of hashes does not execute. `needs.ts` had no need for it either. Three more
sentences fell in the same unit and were repaired in place rather than left to be found: *serves no
byte at all* in `site/local-source.ts`, *no script* in `document.ts`, and
`NOT_THIS_UNIT['pre-fill-the-playground']`, the debt this closes.

## What the method page may say — settled

**No figure on that page is written into a sentence.** Every one is computed at build time from the
two answers the page is built from, and a guard collects every run of digits a reader can see and
requires each to occur in that data. What it catches is not a wrong number but a *right* number that
goes wrong later — the failure this file has caught in its own prose four times and never once in
executable code. Its limit is declared rather than discovered: **a literal equal to today's value
passes today**, and goes red the day the data moves, which is the day it would otherwise start lying.

**And the set it matches against must hold figures and nothing else, which is the half that was wrong
and which W-47 found.** `THE_REPLAY.measuredAt` was stamped `0d8e41d`, whose digit runs are `0`, `8`
and **`41`** — and `41` occurs nowhere else in that data, so the commit stamp handed the pool a figure
nothing had derived, and the mutant that writes the literal `41` into a derived sentence stopped being
killed the moment the stamp landed. The guard went **quiet rather than red**, because the data moved
*towards* a stale literal instead of away from it, and that is the one direction its declared limit
does not cover. A commit identifier is an address, so it now comes off both sides — off the reading as
well, since the page renders it. What that repair does not have is a mechanism: it names the one
address this data carries, and a second would have to be named beside it.

**The rule that closes it for every future guard over published figures: an address is not a figure,
and it leaves the data by both sides or by neither.** That is what made the stamp silent rather than
red. A rendered address leaks into the comparison from both directions at once — it joins the pool as
though something had derived it, and it joins the reading as though the page had published it — and
either leak alone would be caught, since a figure with no derivation reddens and a derivation nothing
renders is unread. **It is the pair that is silent, because the two leaks cancel.** So every address
comes off both sides before anything is compared, and **it is the rendering that decides which strings
are addresses, never their shape**: a run of digits is not evidence of a figure. The frozen
identifiers this file spends its length on — a case, a guard, a reason literal, a profile name — are
the population this rule is written against, and a commit stamp is only the first of them to be
rendered on a page.

**An assertion and an observation are not one object, and the page says which it is showing.** Every
figure is read off pins in committed code; `measure.ts` exits non-zero on any cell that disagrees, so a
replay agrees with them or fails. The two therefore coincide — and a reader who has run nothing holds
what this repository *asserts*, while a reader who runs `npm run mutation` holds what happened on their
machine. The page publishes the command and what it costs beside the figures, because a page that
presents pins as observations is doing the thing it spends its length arguing against.

**The limit of the method is the second section, never a footnote.** *A high score does not say the
code is correct; it says the tests notice the defects that were tried.* A guard holds the **order** and
not the presence, because that sentence is worth nothing after the number: a reader who meets the
figure first has already read it as a claim about correctness. What makes the admission affordable is
the corollary almost nobody else can offer — the defects that were tried are committed files, each with
the exact edit it makes and the verdict it must produce.

**A survivor declares its kind, and the aggregate is never available without the split.** A count of
surviving cells published alone reads as a count of holes. Measured at `a381860` over the nineteen
batteries: **36 surviving defect cells — 12 equivalent, 7 outside what the contract specifies, 4
unreachable on this catalogue, 1 a declared open class, and 12 that live only where a lens blinded the
suite.** Exactly one is a debt. `survived` is a function requiring a `SurvivalNature`, so a survivor
whose kind nobody stated does not compile; the twelfth kind is not declarable, because a cell blinded
by its lens is a fact about the apparatus and `survivorFaults` establishes it structurally. Neither
`published.ts` nor the page exports or renders the total alone.

**Six survivors of `number/parse@1` carried no argument at all**, which is exactly what made them the
ones a hostile reader counts as holes. Each is now argued and measured differentially over a corpus of
300 067 inputs, seen once cold and once with a foreign call between, against a control that disagrees
on `1e400`. **P-16 is the one that is not an equivalence**: every answer is the reference's and it
leaves a counter on `globalThis`, so what the contract constrains — what the function *reads* — is
untouched and what it writes was never specified. That is the edge of the contract rather than a defect
the guards missed, and the two natures exist to keep them apart.

**The page's second upstream is a declared door, not a reach.** `registry/verifiability.ts` says the
instrument measures the catalogue and is not part of it, so no endpoint can carry how this catalogue's
own tests are measured. `mutation/published.ts` is the one module `site/` may import out of `mutation/`,
and a guard holds the folder to it — the shape the serialisation frontier already has, on a second
upstream.

**A deferral carries what would close it, in a field.** `DeferredNeed.until` is required, so an entry
without a trigger does not compile. The argument for it is the entry that has just left the list:
`render-the-methodology-page` said it was waiting for benchmark figures, validation reports and
attestations, and what it was actually waiting for was somebody noticing that eighteen batteries were
already sitting in another folder. **A deferral aimed at the wrong event is one nobody revisits**, and a
reason ages into a description of the past where a trigger stays checkable.

**Two guards of this unit could not fail as first written, and both were caught by measurement rather
than by review.** The partition guard over published survivors asserted `killed + surviving === cells`,
an identity every mis-classification preserves — counting only `killed` as a kill files the five
`killed-by-typecheck` cells as survivors, the sum stays right, and the page publishes thirty-nine
survivors with the guard green. It is now a second walk over the batteries. And W-52 emptied one line of
a three-line trigger and survived, correctly, because two lines of trigger were left; the battery
reported it, which is what a pinned verdict is for.

## What a crawler is told — settled

**The origin is an address, not a setting.** `THE_ORIGIN` is `https://toopo.dev`, declared once in
`paths.ts` beside the other addresses, and everything derives from it. Its cost is the cost every
frozen identifier here carries, one order of magnitude up: a case identifier moving breaks the links
into one page, and this moving breaks every URL the site has ever published. A guard refuses a second
spelling anywhere in the folder — including inside a comment, and including the second domain that
redirects, which is a fact about DNS that no module here has any business knowing.

**No `lastmod`, and it is omitted rather than filled.** The protocol makes it optional and it is the
field that invites a fabricated date: a file's mtime is a fact about a checkout and a clock is a fact
about the machine the build ran on, and **a published file carrying a machine-dependent value is the
immutability defect this repository has already found twice**. A `lastmod` that lies is worse than
none — a crawler told a page changed a year ago may not come back. The day a published snapshot carries
the instant it was published, that is a real and re-derivable date and the decision is worth taking
again.

**The URL a crawler is given and the URL a reader follows are one function.** `urlOf` is `linkTo` with
the origin in front, because a sitemap URL that differs from the served URL by one character gets a
redirect indexed instead of the page. Two guards over it, and the second exists because the first
cannot be independent: the set comparison rebuilds what it expects with the very function the sitemap
is built from, so a URL is also read **back** and required to name a page in the map. W-57 is what
separates them — `linkTo` stops stripping the file name, every reconstruction moves with the defect and
stays green, and only the decoding finds that every published URL now names nothing.

**Verified over HTTP rather than assumed**, which is the third unit running where a browser found what
no static check could. Measured at `0d8e41d`: the XML parses with no parser error, root `urlset` in
the sitemaps namespace, seven `loc`, zero `lastmod`, and all seven URLs answered 200 with no
redirect — the `@` addresses included.

**That sentence stood in the present tense and went false, which is the fifth instance of this file's
own class and the first found by measuring rather than by rereading.** Measured at `8d934cb`:
`toopo.dev` resolves to `216.24.57.7` and **every path answers 403**, with an identical 8 096-byte
body on `/`, `/number/parse@1/`, `/method/` and `/sitemap.xml`. Nothing is served. So the verification
above is stamped and stays true of its commit for ever, and the live state is a separate sentence with
its own — because *what a browser answered on the day somebody looked* and *what a browser answers*
are two claims, and only the first is ever settled. It is the rule two sections up arriving on this
file's oldest habit: a dated number followed by a present-tense clause about the same quantity
publishes a truth and a lie in one sentence, and it is the lie the reader believes.

**And a guard that could not be the only red on anything was deleted rather than kept.**
`every-url-a-crawler-is-given-is-absolute-and-on-the-published-origin` fired only where the set
comparison already fires, because that one pins each location as an exact string with the origin in
it. The attribution reported it alone on nothing, which is this repository's own criterion; its one
genuinely unguarded half — the `Sitemap:` line, which no comparison over the sitemap can see — moved
into the guard over the file it is about.

## What an archive is, and what it may not be — settled

**Every contract page ends in `toopo add <name>`, and until this unit nobody could run that line.**
Three things stopped them, independently, and all three were invisible to 999 guards — because every
one of those guards measures the working tree, and the working tree is not the product.

`npm pack` refused: *Invalid package, must have name and version*. A published `.ts` file cannot run:
node refuses to strip types under `node_modules` — `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` on
v24.15.0, for a `bin` entry point exactly as for an import. And the CLI's runtime graph reached
**vitest**: `toopo search slugify`, a command that installs nothing, loaded 147 modules including
vitest, the TypeScript compiler API and twelve of `mutation/`, through
`the-five.ts` → a contract module → `catalogue/every-contract.ts`. Cutting `local-source.ts` out drops
it from 55 repository modules to 26 and removes vitest entirely.

**The archive carries a frozen artefact, and that was forced rather than chosen.** `the-five.ts` must
go on importing live modules — its own header refuses a transcription — so it cannot be in a published
graph; `cli/source.ts` already said serialising this repository *is not a source of distribution and
must never become one*. What decides it beyond both is the supply chain: a `toopo` that serialised
whatever it found in its own `node_modules` would recompute the digests it writes into somebody's
lockfile, so a corrupted byte would be hashed rather than caught. **Digests fixed when the archive was
built are checkable; digests recomputed from whatever is on disk certify themselves and prove
nothing.** Permanent rule 3 calls what an installation is served from *the registry's immutable
snapshot*, and the artefact is that snapshot for as long as there is no server.

**It is a transcript, not a second description.** `freeze.ts` runs `heldAt` and `gatherHoldings` —
the installer's own walk, imported — against a source that records every answer. So an edge the
installer learns to follow tomorrow is carried tomorrow with nothing in `packaging/` being edited, and
the one failure this shape cannot have is an artefact missing exactly the answer a real install needs.

**`packaged-source.ts` is the second implementation of the port, and the first that is not a
stand-in.** `source.ts` argued that the day a server exists it implements this same type and nothing
above it changes; that was one implementation and a claim, and it is now two implementations and a
comparison. `command.ts` takes its registry as a parameter, so **which registry served an installation
is a fact about which entry point was run** — never a probe, which would be the second source of truth
the port exists to prevent.

**The harness is not in the archive.** `local-source.ts` gathers every file of a contract's harness
because an auditor asks for all of them; no command of `cli/` ever asks, so the artefact carries the
four `reference.ts` blobs and nothing else. That is not permanent rule 5 weakening — the contracts stay
public in this repository and on every contract page. What would change it is a command that serves
somebody the harness of what they installed, and on that day the walk widens.

**`typescript` becomes a runtime dependency, and the cost is stated rather than discovered.**
`cli/rewrite.ts` repoints an import by parsing it, and parsing TypeScript with anything but a
TypeScript parser is what `validation/` exists to refuse. Measured: none of the five reference
implementations imports anything, so today's catalogue never exercises the repointing — and making the
import lazy would hide a dependency that is required for correctness the moment a feature has one. A
user therefore installs a pinned `typescript@7.0.2` whose `unstable/*` surface is explicitly unstable.

**`private: true` stays.** Measured: `npm pack` works with it, so the archive is built and proven
without ever removing the thing that stops an accidental publication. The version is `0.0.0-local`,
the string `THE_UNPUBLISHED_VERSION` already carries, and a guard ties the two — so neither can be
quietly stamped `1.0.0` while the other says nothing was published.

**Two mechanisms over the whitelist, failing on opposite conditions.** `files` is a declaration, and
this repository has found eight things that behave like rules with nothing keeping them. *Nothing is
missing* is established by running the installed tool. *Nothing is extra* is established by loading:
every command runs under a recorder that writes down what node really loads, and every file in the
tarball must appear. The static walk `build.ts` prunes with is deliberately **not** the walk the guard
compares against — a walk wrong in either direction is caught rather than confirmed. It found six the
day it existed: `cli/source.js`, `registry/field-map.js` and four more, emitted because something is
*typed* against them, shipped because `files` said `dist`, loaded by nothing. 44 kB of 362 kB.

**And `build.ts` removes `dist/` before writing it**, because `tsc` does not clean and a source deleted
today leaves its JavaScript in the output. A stale module in an archive is the whitelist failing in the
one direction a whitelist cannot catch — **and the battery measured that the prune already catches it,
so the two are not independent.** A-13 removes the clean; a file no source produces is gone with it and
gone without it, because a stale module is one nothing imports and the prune drops whatever the entry
point cannot reach. The clean stays: it is one line, it makes the compiler write into an empty tree,
and the day the prune is the thing that is wrong it is what is left. What is not true is the sentence
that it catches something the prune does not, and the cell that says so is published as a survivor
rather than left in this paragraph.

**What is still not true, and no code here can make it true.** The archive works and nobody can obtain
it: nothing is published, `private: true` says so deliberately, and a reader who meets
`toopo add number/parse` on a contract page has no way to get `toopo`. The site does not claim
otherwise — it is silent — and silence in front of a command is the remaining gap. Closing it is a
publication decision, not a change to this repository.

**And that decision now has an order, which is the one thing about publication this repository can
record.** Every file the installer copies carries `https://toopo.dev/<contract>/` in its first line,
and that line is frozen in somebody else's repository from the moment it lands: a redirect repairs a
site's own link for everybody at once and repairs this one for nobody, because we will never see those
files again. Measured at `8d934cb`, every path on that origin answers 403. **So the site answers 200
before the package is published, and never the other way round** — publishing first buys nothing that
waiting does not, and costs a dead link in every artefact written in between, permanently. The order is
free while nothing is published, which is exactly why it is written down now rather than met by luck
later.

## What a battery over the archive can reach — settled

**The debt is closed: `packaging.battery.ts` is the nineteenth, and it is the first battery whose
guards measure something that does not exist in the working tree.** Fifteen guards had been seen red
one at a time, by hand, and a hand-run does not survive the session. Fourteen mutants now pin what each
one must produce: **eleven of the fifteen are witnessed, five are declared out of reach, one region is
declared unprobed.** It cost about a minute and a half of cells against the *roughly three minutes* the
debt was filed at, which is the one estimate in this file that turned out pessimistic.

**And the fourteenth exists because a guard was half blind, which the battery is what makes visible.**
`no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` reads six conditions, and two of them
named a folder anchored at the start of the path. `files` is `["dist"]`, so npm reports everything in
the tarball as `dist/…`, and `startsWith('site/')` could only see the generator shipping as *source* —
while the route the build can take is the compiled one. Measured on the tarball: shipping two modules
of `site/` that way reddened only the loading guard and left this one green; anchored at a path segment
instead, it reddens. **A-08 is not a substitute**, because it reaches the same guard through a
`.test.js`, so anchoring the two conditions back at the start would leave every battery green — A-14 is
the only cell that reddens on the folder condition alone, and therefore the only thing between the
repair and a silent revert.

**A third of the suite is out of reach, and the reason is the folder rather than the guards.** A
battery edits one folder, and `packaging/` is four modules; what its guards are written to catch lives
upstream of all four — `files` in the repository's own `package.json`, the reader in `cli/artefact.ts`,
and the compiled closure of `cli/published.ts`. That is a larger declared share than any other battery
carries, and it is filed guard by guard with the file its failure condition sits in, never because a
mutant was hard to write. **One of the five was measured rather than argued**: nothing an edit here can
do puts a networked module in the archive, because the only `fetch(` in this repository is in
`validation/fixtures/refused.ts`, which no program compiles.

**The two survivors are what the unit found, and both narrow a sentence `packaging/` already
published.** A-12 removes the sort from the artefact's three lists: the archive is 29 606 bytes either
way and the two byte strings differ, so what the sort changes is which order that one string is in —
and the guard comparing two freezes stays green, because both take the same walk. A-13 is the clean,
recorded two sections up. Neither is a hole and neither is decorative; what they establish is that a
mechanism can be worth keeping while the claim written beside it is wider than what anything measures.

**And a defect in the archive is killed by no guard at all**, which is the shape this battery has and
no other does: a mutant that stops `npm pack` producing anything fails the suite's `beforeAll`, and
vitest reports the seven guards under it as *skipped* rather than failed. The instrument reads that
correctly — a red run with no failed guard is `killed-by-typecheck` — and the count check still holds,
because a skipped assertion is still an assertion in the report. It is worth writing down because the
verdict's name says compiler and the mechanism is a harness that could not start.

## What the first contact is, and the one project it refuses — settled

**`toopo add` no longer needs `toopo init`, and what that friction was covering by accident is now
covered on purpose.** `add` read `toopo.json` and stopped when there was none, so the first line
anybody types — the line every contract page ends in — answered *run `toopo init` first*. It stopped
somebody for nothing: the only thing an install needs to know is a folder, `proposeDirectory` already
deduces one, and nothing was at stake in asking. A project with nothing in it is now configured,
installed, and told about it.

**The report says a file appeared, and that is not politeness.** `toopo.json` is committed by the user,
so a run that writes one puts a file in front of their whole team. Unannounced it is a bad surprise;
announced it is a convenience, and the line names the folder so that changing it is one edit and one
re-run. `init` keeps every reason it had for whoever wants to choose in advance — what it loses is the
right to stand in front of the first command anybody types.

**Removing the friction revealed what it had been covering, which is the argument for removing
frictions rather than against.** `toopo.lock` records each file's path relative to the configured
directory and **never the directory itself** — `list.ts` and `write.ts` both join the two — so a project
holding installed features with no `toopo.json` is one where the folder is recoverable from nothing on
disk. Proposing one would install *beside* those files rather than over them, leaving two copies and a
lockfile describing one. That is the one project `add` still refuses, and the refusal names
`toopo init --dir` and says why only the user can answer it: **a refusal that explains is a door, one
that reports is a wall.**

**The configuration goes through the two-phase write rather than beside it**, renamed before the
lockfile — a lockfile with no configuration beside it is precisely the state the refusal above exists
for, so it must never be what a killed run leaves behind. `Commit` carries the field **required** rather
than optional, because a caller that could forget it is a caller that will, which is the sentence that
field's neighbour already carries. The cost is fourteen call sites stating `configuration: null`, which
is totality being paid for exactly as `FIELDS_OF` already pays for it.

**A guard was written for this and deleted, and the deletion is the finding.** It asserted that a
refused commit leaves no `toopo.json`, and measured, it could not fail: every fault `commit` raises is
raised while staging the *files*, and the block that writes the root files sits behind
`faults.length === 0`, so a refused commit never reaches that field at all. The property is structural
rather than kept, and `write.ts` records where the claim is really held —
`add-with-a-lockfile-and-no-configuration-writes-nothing`, where a refusal can arrive after something
was decided.

**The state a stranger arrives in was the one state `packaging/` could not reach.** Every guard there
shares one installed project and the first of them runs `toopo init --dir`, so *a project that was
never configured* was unreachable once any other had run. `intoAFreshProject` installs the same tarball
into a second empty project — the bytes are reused, so what is measured a second time is an install
into an empty folder rather than npm's determinism.

**And the three guards this left unprobed were probed rather than declared out of reach.**
`cli-install`'s first run after the unit reported them *unaccounted for*, and the two answers the
instrument offers — out of reach, or a debt — both fitted badly: what those guards keep is which
configuration an **install** runs under, and that is the battery about installing. Declaring a region
would have been the data arranged to suit the tool. C-48, C-49 and C-50 exist because the instrument
asked for them, and two of the three produce a load-bearing guard.

## What git is asked, and what asking may not change — settled

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

## What a folder change moves, and the one part it leaves — settled

**The unit before this one closed a hole by opening the next one a floor down, and it was found by
following this repository's own advice.** A user whose folder git ignores now reads *pick a folder that
is committed with `toopo init --dir <path>`*. They obey, and `init` used to write the setting and stop:
`toopo.lock` records each file's path relative to the configured directory and **never the directory
itself**, so the entry stayed valid and pointed somewhere else. Measured end to end, the old copy was
not merely stranded — it was unreachable:

```
toopo init --dir app/toopo   ->  toopo.json updated       (not a word about what is installed)
toopo list                   ->  app/toopo/.../slugify.ts  missing
toopo update --apply         ->  + app/toopo/.../slugify.ts   "it was gone, and this puts it back"
find                         ->  app/toopo/.../slugify.ts  and  lib/toopo/.../slugify.ts
```

The orphan lands inside the folder git ignores, so `git status` never shows it, `toopo list` never shows
it, and nothing mentions it again.

**`init` is the only command that can ever see both folders, and that decides the shape.** After it
writes, the old path is recoverable from nothing on disk — the sentence `configurationToInstallUnder`
already carries about a lockfile with no configuration beside it. So a relocation not taken there cannot
be taken later by anything, which is what disqualifies *report the orphan and let the user tidy up*:
there would be no command for them to run.

**Refusing was disqualified by measurement rather than by taste.** The way out a refusal would have to
name is remove-then-re-add, and permanent rule 4 stops it on the projects that need it most: `toopo
remove --apply` on an edited file answers *held back, nothing changed*, and the only route through is
*delete the file*. **A way out that costs the user their own work is not a way out** — and a wall in
front of the action the previous screen told them to take is the class `ignored.ts` had just closed. A
move has nothing to re-fetch, so it has nothing to lose: the edited file is carried across as it is, and
`toopo list` goes on reporting it `edited` at its new path.

**A relocation is a renaming, and that is structural rather than lucky.** Nothing that decides a byte can
see the configured directory — `plan.ts`, `rewrite.ts` and `resolve.ts` never read it, and every use in
`cli/` is a `join` to reach the disk, a line to print, or a `commit`. Measured at both ends: one contract
installed under two different folders leaves lockfiles identical byte for byte once `installedAt` is
pinned; and on the imagined graph — five files, six cross-feature specifiers including the repointed
`../../string/pad/digits.js` that deduplication produces — renaming the whole tree and changing nothing
else gives `toopo update`: **nothing moved, no file to write, no file to remove, every verdict
`unchanged`, lockfile identical.** No import is repointed, no digest recomputed, and **no registry is
asked** — which keeps `init` in the pair with `list`, the commands that need no server.

**Four answers about a file, and the third is designed for the interruption rather than discovered by
it.** `commit` renames every staged file into place and only then removes the old copies, so a run killed
between the two leaves the files at *both* paths with `toopo.json` still naming the old folder. A
destination already holding exactly the bytes we were about to write is therefore **a move that
happened**, not a file to refuse — without it the retry meets an occupied destination and is refused by
the rule that exists to protect it, on a state this tool produced itself. It is `PlannedWrite.alreadyOnDisk`
and `update`'s `already-written` arriving at a third case. A destination holding anything *else* refuses
the **whole** relocation, because a project half in one folder and half in another is a state no command
afterwards could describe.

**A file the lockfile claims and the disk has not got is compared against nothing.** There is nothing to
carry across, so nothing is written and nothing is overwritten; whatever sits at the destination becomes
the project's business under the ordinary rules. Comparing it would need bytes this module does not
have — an edited file hashes to neither of the lockfile's two digests — and refusing on that would strand
exactly the project this unit exists for.

**What is compared and what is written are not the same bytes.** The comparison is over the served
normalisation, because `canonical.ts` imposes that on the whole folder; what is written is the source's
own bytes, carried across untouched. Normalising on the way would silently rewrite the line endings of
somebody who is only moving a folder, and **a move that edits a file is not a move**.

**`toopo init --dir` writes at once, and `THE_WRITE_DISCIPLINE` gains the argument rather than an
exception.** The rule separates *destroying* from *obeying*: somebody who types `--dir app/toopo` is
asking for their files to be in `app/toopo`, so moving them is doing what they wrote and a second word
would ask whether they meant what they had just typed. `update` and `remove` are not in that position —
what they do next is decided by the registry and the project, not by the words in the line. And a move
destroys nothing: no file's contents change, an occupied destination refuses, and it is **its own
inverse**, so a folder named by mistake is undone by naming the right one with nothing lost in between.

**The folder that was left goes when it is empty, and that is not `emptiedFolders`.** `remove` and
`update` must never delete the configured folder, because it goes on being the configured folder; here it
stops being one. **An abandoned folder is not an emptied folder**, so the two facts are decided apart. It
goes only when empty — a folder still holding something is one the user put something in — and then it is
left alone and *named*, because a folder this tool has stopped naming, still holding somebody's file, is
the orphan defect with the roles reversed. `Commit.leaving` carries it: required, `null` for not moving,
the shape `Commit.configuration` already takes.

**The screen names every file, and says the one part of the work that stays the user's.** After the move
their `import { slugify } from './lib/toopo/...'` names a path that no longer exists, and toopo never
reads or edits their sources, so nothing can repair it for them. Silence there leaves their build failing
on an import with nothing anywhere saying why — the exact trap `whatToCommit` is written for, one floor
up. **The one part of the work that stays theirs must not be the one part nobody mentions.**

## A diagnostic that names a cause no measurement establishes — settled

**A report may state what it observed; it may not name a cause it did not measure.** It is the worst
class this repository has found in its own product, and the reason is not severity but asymmetry: a
false comment is read by somebody who can open the file beside it, and a false diagnostic is read by
somebody who has never seen this code, believes it on our word, and acts on it. An invented cause sends
them hunting for a problem that does not exist — which is exactly what the pre-flight measured on
`no longer caught by: <a name nothing carries>`, transposed onto the only screen a client ever sees.

**The corollary is as binding as the rule: an invented cause is not repaired by a list of candidates.**
*If this is a fresh checkout … Otherwise something removed it* was already that shape, and it is worse
than a single wrong cause rather than better — it looks like a diagnosis, it cannot be acted on, and it
launders a guess as completeness. Where the cause is not known, the report says what was seen and what
is worth looking at.

**The sweep is the deliverable, not the two instances that raised it.** Every string this tool can print
was read against one question — does this assert something the run established, or something it
inferred? The population is the 48 refusal sites across thirteen modules, the eleven renderers of
`report.ts`, and the held-back reasons `reconcile.ts` builds. **Nine assert.** Two were the filed
instances; seven were found by reading, which is the argument for sweeping a surface rather than fixing
what somebody tripped over.

**What separates a named cause from a stated inference, and it is the line the sweep was decided on.**
`bindingAt` says *a published version is served for life, so this is a registry that cannot answer right
now rather than an artefact that went away* — a cause, and it stays. It publishes its premise, that
premise is permanent rule 6, and a reader can check it. **An inference offered with its premise is
argument; a conclusion offered alone is assertion.** None of the nine published anything of the kind.

**Three of the nine were one word.** *You edited*, *your version*, *your changes*, *rather than anything
you did* — the measurement is that the bytes differ from what was written, and the hand that moved them
is not in that comparison. A formatter running on save, a merge, a colleague. Telling somebody whose
Prettier reindented a file that they edited it is naming an agent nothing designates, on the shortest
word in the sentence. `conflict` had been carrying the honest form since the day it was written:
*changed on both sides*.

**One was repaired by measuring instead, and it is the only one where that was the cheaper half.**
*what was just written will not be committed — and toopo.lock will be* is two claims about the user's
repository, and git had been consulted about one of them while the whole warning rests on the other: the
trap is a committed lockfile naming files that were not committed. `whatGitIgnores` asks, on the one
branch that mentions the lockfile. Measured on two real repositories at `d78c428` — `lib/` ignored gives
`0` for the folder and `1` for the lockfile and the trap sentence prints; `toopo.lock` ignored as well
gives `0` for both and the screen says nothing toopo wrote will be committed at all, which is the more
valuable sentence of the two because ignoring `toopo.lock` is the mistake this product argues against.

## Derive the sentence from the fact — settled, repository-wide

**The mechanism this class has, and it is not "no mechanism".** Where a sentence claims something
happened, it is computed from the thing that happened rather than asserted beside it. That is
*Make the omission impossible rather than forbidding it* applied to an assertion instead of to a field,
and it is the same move as `note` being required, as `INVOKED_BY` being total over the grammar, and as
the census.

Three instances, and the third is what proved the shape rather than illustrating it:

- **`theClosing`.** *Written, and recorded in toopo.lock* was printed whenever `--apply` had been typed,
  which is a fact about the command line. It is now `commitChangesSomething` and the two counts, so a
  run that changed nothing says so, and a run that only re-recorded stops announcing a write.
- **The demotion sentence.** *It is no longer something you asked for* is a claim about `toopo.lock`,
  and it is read off `askedFor` in the lockfile before and the lockfile after. The first draft branched
  on `heldBack`, which is a guess at *why* the entry did not move; the two lockfiles are the fact.
- **`promoted`,** which arrived before the rule had a name and is recorded under *What a contract page
  publishes*: one boolean was answering for two claims, and the repair was a second value rather than a
  better sentence.

**A sentence that cannot be false is worth more than a sentence somebody checked.** The nine repairs
above are prose, and prose drifts; the three derivations cannot drift, because falsifying them and
reddening a guard are the same event — which is the rule this file already applies to a count in an
identifier.

**What has no mechanism, priced rather than dressed as one.** A guard over the *class* would have to ask
whether a sentence names a cause the run established, and that is a judgement about prose. There is no
choke point to hang it on either: the sentences are authored in fourteen modules and only their
*presentation* is shared, so even a lint over string literals would be a lint over thirteen files with a
list of allowed verbs. It is the price the alias rule was refused at, and it is refused here on the same
argument. **What is affordable is the per-sentence derivation above, and the discipline of sweeping a
whole surface at once rather than repairing what somebody tripped over.** Recorded in the list below.

## A case of block 4.4 is a call — settled, catalogue-wide

**The fields of a case begin with the parameter names of the answer's signature, in the signature's
order, and what remains is the answer.** Measured over the five, on all seven of their case tables:
seven of seven, in order, no exception — and the imagined sixth contract, written before the rule
existed, already obeys it. `serialise.ts` refuses a contract where it stops being true.

The parameter names are **read off the declared type rather than declared beside it**, for the reason
`implementation-record.ts` refuses a declared depth and `serialise.ts` refuses a declared sample count:
a value read off what it describes has no second statement to disagree with. What checks the reading is
not a copy of it but a hundred and eighty-seven cases.

It is the first defect the site found in this schema, and the list of all of them is under rule 1
below. A second arrived in the same unit and is smaller: **no need in `needs.ts` covered listing the
catalogue.** Every `the-site` entry described rendering *one* contract, one refusal, one methodology,
or answering a query; the front page — the whole of the site's navigation at five contracts — had
nothing behind it, while the generator consumed `contract-index` anyway.

## A case of block 4.4 belongs to a group — settled, catalogue-wide

**A table declares its groups, every case names one, and the comment banners are gone.** Forty-eight
groups over seven tables and 187 cases: twelve on `number/parse@1`, twelve on `date/add@1`, ten on
`string/slugify@1`, eight on `array/group-by@1`, six on `string/levenshtein@1`. It is another of the
defects a consumer found in this schema — the judgement existed in the source and its shape as data did
not, which is the same failure as the parameter names one unit earlier.

**The partition was derived from the banners while they were still there, and read back before they
went.** Two of the seven tables carried no banner, and their groups were read off what their cases
already hold rather than invented: `reason` on `date/add@1`'s untyped table, `outcome.kind` on
`array/group-by@1`'s. The second corrected a guess — the distinction is *not iterable* against
*iterable but not an array*, not anything about the key function.

**The banners are gone with the field, and that is not tidying.** Two statements of one grouping drift,
and it is always the second that lies: one of the four banners carrying prose already read *these five
rows* over six cases. That prose now sits on the group declaration it describes.

**`id` is frozen, `title` is prose and corrigible** — the separation a guard's identifier and sentence
already carry, for the same reason, which is why `CaseGroup` lives in `catalogue/identifier.ts` beside
the shape of an address. Splitting a group, merging two or renaming an `id` costs `name@2`; adding a
case to an existing group costs nothing, and that is the common gesture.

**A group and a case share one space of addresses**, because a page renders both as `#id` and a
duplicate is a link that silently lands on the wrong element. `expectEveryCaseIsAddressed` widened to
cover both rather than gaining a sibling — it always asked whether these strings can address something,
and the grouping only added strings. It found two collisions the day it was widened: `exponent` on
`number/parse@1` and `normalisation-is-not-applied` on `string/levenshtein@1`, each a group named after
a case of its own table. The group is what moved, because the case identifier is the older statement.

**`every-case-is-grouped` is the fourth guard the catalogue owns.** `groupingFaults` has one
implementation and two callers, and the reason is not symmetry: `npm test` collects `contracts/` and
nothing else, so the serialiser's refusal is never reached by what a specification battery runs, and a
mutant moving a case between groups would have been a defect nothing probes. Five cells now probe it.

**What the partition check cannot see, and it is declared rather than closed.** A case moved into the
group *next to* it leaves a partition that is still well formed — contiguous, nothing empty, nothing
undeclared — so nothing objects and the page publishes the row under its neighbour's heading. LS-14 was
written that way by accident and survived; it now moves a case to a group that is not its neighbour.
Closing the class would need a guard claiming to check that a case *belongs* where it is filed, which
is a judgement about prose.

**A group carries a `note`, required and `string | null`.** Having nothing to add is written rather
than omitted — the shape `ImplementationRecord.version` already takes — and 44 of the 48 are `null`.
The split is what the sentence is addressed to: prose for whoever reads the page goes in the field,
prose for whoever maintains the table stays a comment. Four exist, and one of them says in as many
words that its rows are there so a declaration has *a demonstration on the contract's own page* — a
sentence that had been moved into a comment, which was a loss of content and not a tidying.

**The order of two cases inside one group is not an address either, and it is the cheapest thing on a
contract page to get right.** The order of the *groups* is frozen and declared; an `id` is an address
and a group membership is a partition; what is left — which of a group's rows comes first — is neither,
and moving one costs nothing. It matters because the playground opens on the first case of the first
table: `string/levenshtein@1` opened on two empty fields answering `0`, where a reader has nothing to
edit and has watched nothing happen. `identical-text` is the same claim with something in it, one
keystroke from moving the answer, and it is now first. Checked before moving rather than after: nothing
in this repository pins which case comes first, and the two cases whose own rationales are about being
a pair stayed adjacent.

**`note` is not frozen, and it is the only field of a group that is not.** `id` is the address and
freezes with the major; a title and a note are prose, corrected the day they read badly, exactly as a
`rationale` is. And a declared note is rendered: there is no state between carried and shown, which is
the class `coverage.test.ts` already refuses on the record.

**A table's purpose is a heading only when it separates two tables.** On the three contracts carrying
one, the purpose is a sentence in the lower case a sentence is written in, and a heading that is not a
title is a defect rather than an untidiness — it enters the document outline and a screen reader
announces it as a section, with nothing on the other side of it. So it is a paragraph there and the
groups take `h3`; where two tables separate typed callers from callers no type reaches, it keeps its
heading and the groups sit at `h4`. **The tag is the outline and the class is the look**, so a group
reads the same at either depth — `.group` and `.table`, never `h3` and `h4`.

**The page cost 8.2 per cent, in two steps.** Measured over the six pages: 120 181 bytes before the
grouping, 127 289 after it, 130 042 after the notes and the heading change. The 159 bytes the front
page and the refusals page each gained at the first step are the stylesheet, which is the whole of
their share. `h4` was added to the text projection's separator map in the same change — without it a
group title runs into the case beneath it, which is the exact shape of `not applicableThe signature
takes a single string`, caught before it existed.

## The security filter fails closed — settled

**A name a submission has not declared is refused unless it is permitted.** The rule that replaced a
list of twenty-three forbidden globals is a list of what a pure function may name, and everything
else — `fetch`, `document`, `crypto`, `require`, and the one nobody has thought of — is refused with
no entry anywhere. A list of the bad names fails open on the global nobody anticipated, and *nobody
anticipated it* is the failure mode that matters. On the mechanism the whole supply-chain argument
rests on, failing closed is the only defensible direction.

**What makes the closed form affordable is the catalogue's perimeter, and it was measured rather than
assumed.** The five reference implementations between them read seven free identifiers — `Array`,
`Date`, `Map`, `Math`, `Number`, `Object`, `undefined` — and every `.ts` file of `contracts/` adds
only seven more. The permitted list is drawn at the ECMAScript standard library minus what reaches
beyond the call, which a reader can check; `eval`, `Function`, `globalThis`, `Intl`, `WeakRef`,
`FinalizationRegistry`, `SharedArrayBuffer` and `Atomics` are the language's own names that stay out,
each with its reason. **`Intl` is the one I decided against the brief on**: every one of its
constructors falls back to the host's default locale when none is supplied, which is ambient input of
exactly the family `Date.now` is.

**The false-refusal cost is zero on the catalogue, and one existing false refusal was closed.** The
rule asks the compiler's binder where a name is bound rather than reading names, so a parameter
called `process` is a parameter. That is what makes the closed list strictly stronger than the open
one in both directions at once — without it, the same lexical reading either refuses the parameter or
lets a shadowed global through, and there is no third answer. The measured boundary moved from six
refused lines to eight: one evasion closed (`const evaluate = eval`, a capture with no call to read),
two new spellings caught (`{ fetch }`, and a free read of a name another scope binds), and the
over-refusal gone.

**Types are out of scope on purpose.** A type is erased and reaches nothing, so refusing one would buy
nothing and would cost the whole of `lib.*.d.ts` in the permitted list.

## What an installation looks like on disk — settled

**A feature lands in `<domain>/<name>/`, and its entry file is named after the feature.**
`src/lib/toopo/string/slugify/slugify.ts`. The domain stays a folder, so `number/parse` and
`string/parse` never collide and no artificial prefix is needed. The file is not called `reference.ts`:
that name says what the file was in *our* catalogue and nothing about what it holds, and in the user's
editor every installed feature would otherwise open a tab under one name. It is the same reasoning that
already stripped our internal rules out of the three references — the implementation file is the only
one that becomes somebody else's code, and it is written for them.

**A folder from the first file, rather than a flat file promoted to a folder later.** The promotion has
to be invisible to whoever wrote the import, and it is not. Measured on node v24.15.0, at the spelling a
published source writes:

```
cjs  ./x.js -> MODULE_NOT_FOUND       cjs  ./x -> x/index.js
esm  ./x.js -> ERR_MODULE_NOT_FOUND   esm  ./x -> ERR_UNSUPPORTED_DIR_IMPORT
```

Only the extensionless spelling collapses the two, and a published source writes the extension because
that is the only form that resolves under both module systems and under `node16`. So an implementation
gaining a second file would move the path every dependent had written. The folder costs one level of
nesting on a single-file feature and the import path never moves again.

**The cost, which is that every cross-feature import is rewritten.** The catalogue serves its entry file
as `reference.ts` — `contractAnatomy` requires that name at five of five — so a published `number/clamp`
names its dependency as `../../string/pad/reference.js`, and that specifier is wrong the moment the file
lands as `pad.ts`. *Naming the file after the feature and needing no rewriting between features are
incompatible*, and the first wins because it is the one argued from the user's editor. What softens it
is that the rewriting mechanism is needed anyway for a shared file, and that both jobs are one rule:
**a specifier is repointed when the file it names did not land where the specifier says it would.**

**A shared file is recognised by its digest and never by its path**, written once in the folder of
whichever carrier the resolution reaches first, with the other carriers repointed at it — and an entry
file is exempt, because a feature's entry file is its identity and collapsing two would leave a folder
with no file named after it.

**The lockfile carries two digests per file, and that is a finding rather than a field somebody
wanted.** A file whose import was repointed is not the bytes the registry served, so an entry holding
only the served digest would report every rewritten file as locally modified from the instant it was
written — the failure `canonical.ts` closes for line endings, arriving through a door the installer
itself opens. `served` is what a comparison with the registry is made against; `sha256` is what the
offline check — the one whose whole value is that it needs nothing from us — compares against.

**A version minted by the local stand-in is visibly false.** `0.0.0-local`, never `1.0.0`. A number that
looks published and is not turns the lockfile's own argument against it, since its whole value is that
it can be checked offline against a published fact; and the day publication exists these entries are
greppable in any lockfile in the world.

**No setting exists that has one possible value.** `toopo.json` carries `version` and `directory` and
nothing else. The alias import style is coming and is not here, so there is no `imports` field to accept
and ignore — a setting that is written and not honoured is a promise not kept, and `version: 1` is what
carries the migration when the second style arrives. `init` will detect the alias prefix once and record
it; `add` will go on consulting nothing but this file. We record what the user told us, we do not
inspect their build.

## One import spelling, and it is not the user's to choose — settled

**`toopo add` prints the import line, not the file path.** A path is not what anybody writes in an
import, and the defect was measured by committing it: `./src/lib/toopo/...` typed into a project where
`init` had chosen `lib/toopo`, by somebody with the installer's source in front of them. The line
carries the *configured* directory and says it is written from the project root — the specifier depends
on which file the import sits in, and this tool does not read the user's sources.

**The extension is `.js`, there is exactly one, and it is a property of what Toopo writes rather than of
the user's toolchain.** Our own installed files import each other with `.js`, so any other suggestion
would tell the user to spell one thing one way while our files spell it another. Measured on TypeScript
7.0.2 under `"type": "module"`, target ES2022:

```
./x.js   bundler OK      node16 OK      nodenext OK
./x.ts   bundler TS5097  node16 TS5097  nodenext TS5097   without allowImportingTsExtensions
./x      bundler OK      node16 TS2835  nodenext TS2835
moduleResolution node10 → TS5108, removed from TypeScript 7
```

**And what decides it is the measurement nobody had taken: the import *inside* our own file.** Node
v24.15.0, native type stripping, `"type": "module"`:

```
entry .ts → internal .ts   runs
entry .js                  ERR_MODULE_NOT_FOUND
entry .ts → internal .js   ERR_MODULE_NOT_FOUND, on the internal import
```

So `.ts` appears to work only because all five contracts are one file. **The first multi-file feature
breaks under node's own runtime whatever the user writes**, because our internal import is `.js` and
node does not remap it. That is a limit of node rather than of us, and it is declared in `breakage.ts`
with its measurement, because whoever meets it wants to know it is known. `cli/toopo.ts` had already
measured the same fact for this repository's own entry point, and shows what working around it costs:
fifteen lines of `node:module` we can register for ourselves and cannot register inside somebody else's
program.

**Nothing is detected and nothing is recorded.** There was no toolchain question to answer, so
`toopo.json` stays at `version: 1` with two fields and the rule above holds unchanged.

**The export names come from the contract, through `ServedIndexEntry`.** An export name is not derivable
from an address — `number/parse` exports `parseNumber` — it lives in `identity.exportName` and
`surface.exports`, and the installer's port deliberately carries no `contract-binding`, so nothing it
fetched held it. Reading the names off the installed source would have the installer publish an opinion
drawn from code rather than from the contract. Measured, because that type calls itself deliberately
small: the canonical index goes from 2 594 to 2 969 bytes over the five — 14.5 per cent of what is still
the smallest thing the registry serves.

## What an update is, and what it will not do — settled

**Acceptance is a second command, never a prompt.** `toopo update` shows and writes nothing;
`toopo update --apply` writes. What that protects had never been named and is the property this folder
would lose first: **everything this tool decides is reachable from a guard, with no process, no working
directory and no clock.** It is what keeps `command.ts` thin, and it is why `add` could be measured end
to end without a sandbox. The first interactive prompt written here takes it away, and takes it away
silently — so the sentence lives in `command.ts` and in `update.ts`, where whoever wants one will read
it.

**The whole project is planned every time, and there is no `toopo update <feature>`.** Deduplication is a
property of a plan and not of a feature — which carrier of a shared file keeps it depends on what else is
being installed — so a plan built for one feature in a project holding four would move files the other
three own. Planning everything and applying part of it is the only shape that cannot do that.

**Six answers about a file, decided by two questions.** *Does this have to change* — the bytes we would
write are not the bytes the lockfile says we wrote. *Did the user change it* — the bytes on disk are not
the bytes the lockfile says we wrote. Both asked against `sha256`, which is the half of the lockfile's
two digests that exists for exactly this.

```
must change, untouched      updated          write it, with the diff
unchanged, edited           kept             leave it, and say so
must change, edited         conflict         hold the whole feature back
unchanged, untouched        unchanged        nothing at all
gone from disk              restored         put it back
already the new bytes       already-written  a run was interrupted here, not an edit
```

The last one is what closes the partial-write window without a journal.

**A conflict is diffed as the file is on disk against what would be written**, which states the
consequence of accepting rather than describing the upstream change in the abstract; `git diff` already
shows the user their own change better than this could. The other reading — reconstruct what we
originally wrote and isolate the upstream change — **cannot be built from the lockfile**, and finding
that out is worth recording: the lockfile records only the files that were *written*, so a shared blob's
second carrier is deduplicated away and has no entry, and the old relocation is not recoverable from it.

**A conflicted feature is held back whole**, and so is anything carrying one of its files or importing
it. A feature half at one version and half at another is a combination nobody published.

**Nothing is removed while anything is held back**, and that rule was found by reading the report rather
than the code: the second publication of the imagined graph has `number/round` drop `number/sign`, and a
held-back `number/round` runs the old code that imports it still — so removing it would break a build in
order to tidy a folder. The blunt form is deliberate; the exact one costs a fetch per held-back feature
and a fallback, to win one run of tidiness in a situation the user is already resolving.

**`LockedFeature.askedFor` is one of the defects a consumer found in this schema.** The lockfile did
not say which features the user had typed, and an update has two ways to guess, both wrong for different
reasons. Treating every entry as a root climbs a dependency to whatever its own binding names today
rather than to the one its dependent was published against — a combination nobody published. Deriving
the roots from the edges reads precisely what an update is trying to find out has moved, and gets the
ordinary case wrong anyway: a `string/pad` installed directly *and* pulled in by `number/round` would
never again be updated on its own. It is **sticky towards true**, and that case found a second defect in
`add`: asking by name for something already held as a dependency answered "nothing to do" and recorded
nothing, after which a later update would have removed what the user had asked for. It is smaller than
the ones the read API and `toopo add` found, and it is in the lockfile rather than in the served schema.

## What a search may answer, and what it must not — settled

**Every word of a query must be answered by something the contract carries.** It is the only rule
under which a search over this catalogue can answer *nothing*, and a search that always answers
something is the one nobody believes twice. Measured over twenty utilities the catalogue does not
hold — `debounce`, `deep clone`, `uuid`, `flatten nested array` — it answers nothing twenty times.
`sort array` is the case that decides the rule: `array` is half of a contract's own name.

**A word a contract cannot answer is set aside for that contract, and what remains must then name one
of its own names, exports or aliases in full.** Without it, `convert a string to a number in
javascript` answers nothing, because `in` occurs in one contract's summary and not in the one being
asked for. A list of words to ignore was refused: it decides invisibly which words carry meaning, and
`to`, `by` and `from` carry it here — twenty-seven of the sixty-two aliases hold one of them. That
figure used to read *fourteen*, and it was wrong: it was also the figure `cli/arguments.ts` published
for a different claim, the aliases carrying a space, where the true number was fifty-six of seventy.
Both are measured now rather than restated, which is the only thing that stops a number from migrating
onto a claim it was never about.

**A query may shorten a word the catalogue carries and may never extend one.** A symmetric prefix reads
better and was measured: it answers `stringify` with all three contracts carrying `string`, and
`datepicker` and `dateline` with `date/add@1`. The English plural is bought back explicitly and nothing
else about English is claimed. There is no typo tolerance, and calling `string/levenshtein@1` from the
CLI was refused twice over — it would buy the behaviour the first rule exists to refuse, and it would
take `cli/` across the frontier `source.ts` holds.

**The description is not in the index, and the aliases are its searchable surface.** Measured: the five
index to 2 969 bytes and their descriptions alone to 6 187, so carrying them would more than triple the
one document
every search pays for. A query only a description could have answered is a **missing alias**, and the
repair belongs in `identity.searchAliases` where it is frozen, reviewed and served.

**And the ranking has almost nothing to rank, which is a fact about the matching rather than a gap.**
Nought of the eighty-nine aliases and corpus queries answers more than one contract, so inverting the
comparator broke no trial at all. Of 161 distinct words in the index, 25 answer more than one contract
and 7 carry a score that tells them apart — four of those seven are `a`, `by`, `from`, `to`. Two are
real queries. Two constants died of it: an exactness multiplier that moved nothing at 2 or at 100, and
a full-query bonus that could not change an order because no full query has one. **A number that
cannot change an answer at any value is not a rule**, and speculative insurance no guard can reach is
what `field-map.ts` calls a speculative field and deletes.

## What an alias is, and the trap that hides a wrong one — settled, catalogue-wide

**An alias is a query whose best answer is this contract — never a phrase that relates to it.** The
second reading admits everything, because a phrase relates to a contract whenever anybody can explain
the connection and an explanation is always available.

**The property that every alias retrieves its own contract first is satisfied by a lying alias**, and
that is the whole reason this is written down. The alias is in the index, so it matches the contract
that declares it by construction — which is what retrieval *means*. The trial establishes that the
ranking works and says nothing about whether the phrase should have been declared, and it looks exactly
like the opposite. It was green before and after eight aliases were removed.

Two filters, and they are not the same filter. **Mechanical:** read the contract's own exclusions —
every *it is not X* of the input domain, every *that is a different function* of the description — and
refuse any alias that names one. It found five. **A judgement, one alias at a time:** an alias nobody
would type costs weight, an alias promising what we do not do costs trust, and those are different
categories. It found three. The criterion that decides the next case without a second opinion is
**could a better answer exist in this catalogue** — for `string similarity` yes, and it is a different
function with a different output shape, so the alias is a lie whether or not that contract is ever
written; for `how similar are two strings` no, and vagueness is not the fault. *Naming something we are
not* is.

**Naming the built-in a contract is positioned against is deliberate, and the line is that the contract
names it too.** `parseFloat`, `parseInt`, `Object.groupBy`, `Map.groupBy` and `lodash groupBy` are all
argued against by name in their own contract's published prose, which is what lets `toopo search
Map.groupBy` answer *the language ships this now*. `atoi` went out under the same line, because no
contract names it.

**An alias is not frozen with the major**, and it is the only field of `identity` that is not. A case
identifier, a guard identifier, a reason literal and a benchmark profile name are addresses — an API
response cites one, a URL anchors on one — and an address that changes breaks a link. Nobody links to
an alias, no answer cites one, and correcting one breaks nobody's code. It is curation, so it is
repaired the day it is found and does not cost `name@2`.

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

## Which commands ask twice — settled

**A command that can destroy or overwrite shows first and writes on a second word. A command that can
only refuse writes at once.** `update` and `remove` may replace or delete somebody's file; `add` never
touches a file it did not put there, so asking twice would buy nothing and cost a word.

It is written down — `THE_WRITE_DISCIPLINE` in `cli/arguments.ts` — because the CLI was applying it
without saying it, and an unsaid convention is one the next person breaks by trying to help. A
`toopo add --dry-run` reads as symmetry and would put the opposite default on the opposite half of one
tool, so that half the commands write unless told not to and half refuse unless told to. Nobody would
choose that deliberately, which is exactly why it has to be refusable by pointing at a sentence.

## What the lockfile does not describe — settled

Two claims about `toopo.lock` sound alike and only one is true.

**True: it lets anybody check, with nothing from us, that the bytes on disk are the bytes that were
served.** That is the supply-chain argument of the whole project and it holds entirely.

**False: that it describes the installed graph.** It records what was *written*, never what was
planned. A shared file is written once and the other carrier is repointed at it, so the second
carrier's entry does not name the file it imports — measured on the fixture graph, `number/clamp@1`
records one file and `number/clamp/clamp.ts` imports `../../string/pad/digits.js`. A removal decided
from the lockfile alone would delete `string/pad/digits.ts` while three files that stay import it: not
an incomplete answer, a wrong and silent one.

**And no field would fix it.** Recording the edges closes that instance and not the class:
deduplication is a property of the *plan*, a blob is recognised by its digest and never by a path, and
two roots that depend on nothing can still share a file. The only sufficient record is the plan itself,
which is a cache of something the registry recomputes — a second source of truth that can contradict
the first. So the plan is rebuilt every time, and **that is why a removal needs a registry**.

**The limit, bounded.** Measured over every non-empty root set on the catalogue and on the fixture
graph, 8 of 64 removals reach the registry not at all, and they are exactly the ones that leave no root
behind. A published version is served for life, so *the contract went away* is not a case that exists;
only a registry that cannot answer right now. The refusal explains rather than reports — *this needs to
know what the features that stay import, and only the registry knows* — and it degrades without
destroying: the files stay, nothing breaks, and the same command works when the registry answers.

## What a removal is — settled

**Asking for a feature to go is asking for it to stop being a root**, and everything else follows from
re-planning what remains. So a removal is a reconciliation with one feature demoted, sharing the whole
of its arithmetic with `update`; the measurement that says this is real rather than tidy is that
nineteen of the twenty-five guards that unit added redden on `cli-update`'s battery.

**Two differences, and both are load-bearing.** The roots that stay are bound at the version the
lockfile records, never at what the registry serves today — not merely so that a removal does not
update four other features, but because *which files leave* is decided from that plan, and a root
republished without a dependency would have it planned away while the version on disk still imports it.
And zero roots is an answer rather than an error, which is why the two refusals about a lockfile with
nothing in it stay in `update.ts`.

**Four answers, and the one that matters most is not a refusal.**

```
not in the lockfile         refused, with what the project does hold
held, never asked for       refused, naming the feature that imports it
asked for, still reached    it stays, it stops being a root, and the screen says both
asked for, reached by none  it goes, and so does what only it pulled in
```

The third is where trust is lost, because from outside it looks exactly like nothing happened. *I asked
to take it out and it is still there* is never left to be read off a report with nothing in it.

**Two holes in `update` were found by building it**, and both are closed. A copy deduplicated away was
left on disk claimed by nothing — `add` plans one root at a time, so two features carrying one file are
written twice and the first update afterwards drops one from its entry — and the next command refused
to write there, about a file this tool had written itself. And *nothing is removed while a feature is
held back* was asked of the features still in the plan, so an edited file that kept a **leaving**
feature let its dependencies be deleted underneath the code it left behind.

## Make the omission impossible rather than forbidding it — settled, repository-wide

**Before writing a rule in prose, look for the shape that makes breaking it not compile.** A sentence
in a header is a rule the next contributor never reads; a type that cannot be written the wrong way is
one they cannot get past. Three instances found independently, which is what turned a habit into a
rule:

- **`GuardAddress` carries no unpaired form.** Uniqueness is per contract, so a guard is addressed by
  the pair `(contract, guard)` — and `registry/address.ts` publishes no type holding a guard identifier
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
*Guard identifiers* above named the pre-flight as the thing that would close
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
- **The rule that an alias must not name what its contract refuses to be.** The eight liars are gone
  and the criterion is in `catalogue/every-contract.ts`, but nothing keeps it: the executable form
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

## What licence covers what, and why the perimeter is derived — settled

**The repository is MIT and what the installer copies is MIT-0, and the asymmetry is the product's
rather than a preference.** A tool is a dependency you install; an implementation is source code that
becomes yours to read, edit and maintain. Before this there was no `LICENSE` at all, which under
default copyright means everybody may read this and nobody may use it — so the first thing this unit
established is that publishing was impossible, not merely unpolished.

**The one-line header the unit was commissioned to write does not satisfy MIT, and that is what the
measurement found.** MIT requires *the copyright notice and this permission notice* — the whole
paragraph — in every substantial portion. Measured: the full notice is **1 180 bytes**, against a
smallest published reference of **2 259** and **16 534** over the four, so literal compliance costs
**+52 %** on one file and **+28.5 %** on the catalogue — a third of the one figure a contract page
sells. The ordinary `SPDX-License-Identifier: MIT` one-liner is a convention and is not what the clause
asks for, which would leave every user quietly non-compliant for a function they now maintain
themselves. **The legal argument therefore carries either 1 180 bytes or nothing; what carries the
header is provenance**, which stands on its own. Checked against the closest comparable: shadcn/ui is
MIT, copies files into user projects, and its components carry no header, no SPDX and no copyright at
all.

MIT-0 removes the clause rather than answering it badly. It was chosen over 0BSD on reading rather than
on law — both are OSI-approved and both are recognised by the usual scanners, and *MIT without the
attribution clause* explains itself by its name to anybody who already knows MIT, where 0BSD sends a
reviewer into a second family to establish the same thing.

**The perimeter is derived from `referenceImplementationOf`, and that is the load-bearing half.** A
hand-written list of paths is a legal boundary kept by a declaration nothing enforces — and the day a
contract gains a second file, the installer copies a file this repository believes is MIT into somebody
else's repository under a header saying MIT-0. **Getting a licence wrong inside somebody else's
repository is the most expensive defect this project can produce and the only one that is invisible
from here.** Measured: the derivation is three lines against the installer's own function, **5 files
copied and 32 served and never copied**, so both directions of the guard have a populated population.
`nothing-the-installer-does-not-copy-is-marked` is the half that matters as the catalogue grows: a
missing header is loud, and a stray one is silent.

**Two lines, ASCII, no version.** The address rather than a slug, because `renderContract` is frozen
with the major and a slug would be a second name that can disagree with the first. No implementation
version, because `0.0.0-local` is minted by whatever serves the file and does not exist in the source —
writing one would be a second declaration of it, and false. ASCII because these are the only bytes of
this repository that land in a codebase whose encoding, editor and toolchain nobody here can see.

**`THE_ORIGIN` moved to `registry/address.ts` for a reason the site alone never had.** It was declared
in `site/paths.ts` and `the-origin-is-declared-once` held it inside that folder; a header freezes the
origin into a repository we will never see again, so the guard had to grow past `site/` and the
declaration had to move above both readers. The folder guard became
`no-file-of-this-folder-spells-the-origin` — the assertion went from one file to none, and a name
rendering a count outlives the data it counted. Its pin in `site.battery.ts` moved with it, which is
the pre-flight's resolution doing its job.

**What has no mechanism, priced rather than dressed as one.** The *repository* licence is a
transcription in `package.json` and in `LICENSE`, and `the-public-fields-npm-shows-are-the-ones-this-
code-declares` resolves the fields that are facts — two when this was written, four now, and the
section below says what closed the gap. A description and a keyword list are prose about the tool,
derivable from nothing, and a guard comparing prose against prose is a copy of the prose — so they are
written and unguarded, and it is recorded here rather than left to look like an oversight.

## What the manifest states, and the order a publication takes — settled

**A guard that names a population and enumerates part of it fails on exactly the part nobody
enumerated.** `the-public-fields-npm-shows-are-the-ones-this-code-declares` read `license` and
`homepage`. The two fields it did not read were `repository`, absent, and `author`, carrying a name
with no address — so the guard whose subject is *what npm shows* was green over a page that would have
offered no link to the code. The repair is the population and not the two entries: every field of the
manifest that resolves to something declared in code is asserted, and a fifth belongs there the day it
is declared.

**`registry/publication.ts` exists because a declaration a battery cannot reach is an assertion nothing
measures.** The guard lives in `registry/`, a battery injects into one folder, and `cli/diff.ts` — where
the runtime floor's own sentence already sat — is in another. That is what decided the module, ahead of
any argument about where the fact belongs; the three values are then together because none of them is a
licence and none is a contract address.

**The runtime floor is derived from what the code calls, and two APIs agree.** `node:util`'s `diff`,
which `dist/cli/diff.js` imports, and `node:module`'s `registerHooks`, which every entry point of this
repository reaches through `typescript-imports.ts`, are both declared `@since v22.15.0` by
`@types/node@26.1.2` — read off the types this repository installs rather than off anybody's memory.
**The 23 line is refused rather than assumed**, because nothing readable here establishes either API
anywhere in it, and refusing a runtime that cannot be established is the closed direction the security
filter already takes. `engines` is what npm reads *before* installing, so it is the only place this
project can refuse a runtime instead of crashing on it: without it, an install on Node 18 succeeds and
`toopo` fails at import inside a node internal, in front of somebody who has just typed the line a
contract page gave them.

**One field, two populations, and the gap is declared rather than closed.** A consumer installs
compiled JavaScript and 22.15 is enough for them. A contributor runs `node run-vitest.ts`, which needs
a runtime that strips types with no flag — a later version, as `cli/diff.ts` says, and one no source
here names. It is not named because the only machine that could measure it runs v24.15.0, and what
would close it is a run on a 22.x runtime.

**`git+` is a prefix and not a second address.** npm's own documentation gives that spelling for
`repository.url`, the rendering of the field belongs to a page nothing here can reach, and where a
measurement is unavailable the convention belongs to whoever owns the format. The address itself
survives inside it word for word.

**The order is the site's order, arriving on a second artefact: the repository answers before the
package is published.** A `repository` npm cannot resolve produces a page with no link to the code and
nothing saying a link was meant — on a package whose whole argument is *go and check*. It is harmless
while `private: true` holds and frozen into every published version afterwards, exactly as a licence
header is frozen into somebody else's repository. **This costs nothing to obey while nothing is
published, which is why it is written down now rather than met by luck later** — the sentence the
archive section already carries, on the field instead of on the site.

**A transcript is redacted of what is not its subject and never of its subject.** `vitest-entry-point.ts`
published one machine's home directory inside a measurement whose subject is the *case* of a path
segment. The case of every segment shown is the spelling that was really run; the home directory the
measurement never depended on is elided. A measurement missing its subject is worth nothing, and one
missing the rest is worth what it always was. It will be asked again of every transcript this
repository publishes, which is why it is a rule and not a repair.

**What could not be measured from here, named with what would settle it.** How npmjs.com renders a
README — specifically whether it rewrites `[LICENSE](LICENSE)` and `[CONTRIBUTING.md](CONTRIBUTING.md)`
against `repository`, which is the documented behaviour and the reason neither file needs adding to the
tarball. And whether GitHub detects this repository as MIT: `LICENSE` carries the MIT text followed by
an MIT-0 appendix, and licence detection wants a close match to a known text, so the plausible outcome
is *View license* rather than *MIT*. Both are answered in thirty seconds by somebody looking at the two
pages on the day they go public, and neither is worth a mechanism before then.

## The language is part of an address, and of every rendering of one — settled

**Catalogues of different languages carry different contracts.** A Python `number/parse` is not the
TypeScript one: there will be resemblances, nothing can guarantee them, and each language settles its
own traps. The measurement that decided it is that 24 per cent of the named cases are not shareable,
and on two of the five contracts it is half — because their input domain *is* the language's type
system. A contract half of whose cases do not apply to half the languages is not shared, it is vague.

So the language is a coordinate of a contract's identity, and the question was never whether to add it
to the address: `ContractAddress` has carried `language` since the day it was written, `sameContract`
compares it, the lockfile writes it, and `THE_WORDS_FOR` is total over it. **What dropped it was
`renderContract`** — so the URL, the page path, the case anchor and the licence header of every
installed file were built without it. The deadline was the first installation and not publication: a
header is frozen into a repository nobody here will ever see again, and a redirect repairs a site's own
links for everybody at once and repairs those for nobody.

**One rendering, one spelling, and the abbreviation was refused on a measurement.** `typescript/` costs
22 bytes per copied file against 6 for `ts/` — 0.94 per cent of the smallest one, 110 bytes over the
five — so the full spelling costs 16 bytes a file more and buys the absence of a correspondence table
between two spellings of one value. `licence.ts` refused the literal MIT notice at +52 per cent on that
same figure; there is no arbitration at 0.68.

**The schema was ready, and that is the field's own promise met rather than asserted.** Widening
`Language` to `'typescript' | 'python'` and typechecking all six projects gives **exactly one error**:
`THE_WORDS_FOR` in `cli/search.ts`, which is total over it by construction and says so. One site, in a
repository of fifty-odd modules that pass an address around, is what a coordinate written before it had
a second value buys.

**There is no short form anywhere, and the argument is a measured defect rather than consistency.** A
language-less rendering for local use reads as an economy — a screen line is not frozen, and every
address inside one client carries one language. It is refused because that form has already produced a
defect, in a *key* rather than on a screen. `planInstall` keys the features of one plan by this string;
with the language dropped, two contracts of two languages carrying one name collide there, and the
refusal is false:

```
before   number/parse@1 is asked for at two versions in one install -
         number/parse@1/reference@1.0.0 and number/parse@1/reference@1.0.0.

after    two different files would both be written to number/parse/parse.ts: the one served as
         number/parse/reference.ts and another with a different digest.
```

It names a cause no measurement establishes — *two versions* — and prints one string twice as the
evidence that two things differ, which is *a diagnostic that names a cause no measurement establishes*
reached through a map key. **A form that lives on a screen reaches a bug report, then an issue, then a
key.** The cost is real and is the only one in this unit paid continuously — eleven characters on every
line of `toopo list` and `toopo search` — and the way out, the day it is worth taking, is a *layout*: a
column states a value once for a whole screen and is still one spelling. Never a second string.

**The disk path is the one rendered thing that does not carry it, and not because no collision exists.**
`destinationOf` builds `number/parse/parse.ts` from `contract.name` alone, so the path carries neither
the language nor the major: what governs it is *one feature is one folder*, and adding the language
alone would put half an address into a string that deliberately is not one. The collision was measured
and something else already refuses it — `placedByPath` finds two digests at one path and refuses by name
with nothing written — and that refusal is *true* only because the address carries the language. So the
protection is in the refusal rather than in the path, and putting it in both would be two mechanisms
over one fault with nothing to say for themselves on the day they disagree. The argument lives in
`cli/plan.ts`, where somebody would go to remove the asymmetry.

**The command takes no prefix, and that is `command.ts`'s own shape on a second subject.** `toopo add
number/parse` is unchanged: `chooseContract` filters on `entry.address.name` and never reads a language
from what the user typed. *Which registry an installation came from is a static fact about which file
was run* — `toopo` is the TypeScript client and a future Python one is another program, so the language
is a property of the entry point rather than of the project, exactly as the registry already is.

**A rendered address is what code emits; prose names a contract with the coordinates its reader needs.**
That line had to be drawn, because a mechanical prefix swept 50 comments, two guard-title sentences and
one case rationale before anybody looked. It is the same line the command sits on: a person writes the
coordinates they mean and the machine supplies the rest, because a machine cannot choose. What is not
covered by it is a comment making a factual claim about the value — `search.ts` saying *the name is the
rendered address, `number/parse@1`* became false and was repaired.

**The guards are the first this repository has ever pointed directly at `registry/address.ts`.** The
module that owns every address the project has — a case, a guard, a contract, an implementation, a
mutant — was covered the way a road is covered by the traffic on it: `site/pages.test.ts` resolved
`pageOf` against `renderContract`, `indexing.test.ts` resolved `contractUrl` against the sitemap,
`publication.test.ts` compared `licenceHeaderOf` with five real files. Each is a guard over its own
consumer that happens to travel through here, and **no consumer of one rendering is in a position to
notice a coordinate missing from all of them.** That is what let the omission live for as long as the
address has existed.

Two mechanisms, both total by the compiler. `COORDINATE` is keyed by `keyof ContractAddress`, so a
coordinate added to the address does not compile until somebody says what it looks like rendered; the
record of renderings is keyed by `keyof typeof ADDRESS`, so an export added to the module does not
compile until it is either rendered or declared to carry no contract, with a reason. A pass over real
addresses could not do either job: every address in this catalogue carries one language, so it would
confirm that the renderings agree with each other about a coordinate none of them prints.

**I-31 is what makes the guard worth having over the family rather than over one function, and its
width is the measurement.** A rendering that interpolates the contract's parts instead of calling
`renderContract` reddens **exactly one guard** in `registry/`, against I-30's five — because everything
that resolves a rendering resolves it against `renderContract`, so a form that stops going through it
stops being compared with anything. The abbreviation was built and refused as a third cell: rendering
`ts/` reddens exactly I-30's five, so it establishes nothing that cell does not, and the refusal is
recorded in I-30 rather than left for somebody to propose again.

**And the closing control is the half a mechanical replacement always needs.** 73 literal addresses were
rewritten across eight test files, and a mechanical replacement over expected strings is exactly what
makes a suite green for the wrong reason. So `renderContract` was broken one last time, after
everything else, against the whole suite: **30 guards redden, of which 2 are this unit's and 28 existed
before it**, across `registry/`, `cli/`, `site/` and `packaging/`. Had only the new file caught it, 71
assertions would have quietly stopped saying anything about addresses. The contracts' own suite stays
green at 472, correctly — nothing in `contracts/` renders an address.

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

## What a frozen edge names, and the check its own saving took away — settled

**An edge carries the digest of the snapshot it names, and the field is not the unit.** Before it, a
client walking a dependency graph learned each edge's digest by asking `implementation-bindings` which
digest that address resolves to — a *named* answer, one per contract in the closure, believed rather
than checked. The digest makes the step arithmetic. Measured on the imagined graph, which is **the only
thing in this repository that has edges** — the four published contracts have none, and no figure here
comes from them:

```
toopo add number/round, depth 2      before   after
  round trips                            8        6
  requests in all                       14       11
  named answers, which are believed      5        2
    of which implementationBindings      4        1
  content-addressed, checkable           9        9
  round trips spent on a binding         3        1
```

**And the unit is the guard, because the saving and the check were the same call.** `gatherHoldings`
found an edge's digest by looking its `id` and `version` up in the bindings, so *the identity of what
arrived fell out of that lookup* — and that lookup is exactly the round trip the digest removes.
Shipping the field without putting a check back would have moved the belief from a named answer onto an
edge and verified neither, in the unit whose own prose announces the opposite. That is the class this
project exists to prevent, introduced by the change meant to close it.

**One rule for both doors rather than one guard each.** `heldAt` compares every snapshot it fetches
against the address it was fetched *for*, through `declarationFaults` — root and edge alike. The root
half is older and was open before this unit: a binding names a digest, and nothing checked that the
artefact at it was the one asked for. It is *latent* rather than live, because `localSource` and
`packagedSource` look an answer up by its digest in a map keyed on that digest, so no local registry can
answer one address with another artefact. It goes live the day a source is remote — the distribution
unit — so this closes it before the door it would arrive through is opened.

**What the check buys was measured, and it is not what it was written believing.** Over the six
substitutions the imagined graph can express — three at a root binding, three at an edge — taking it out
leaves **five of six refused anyway**, downstream, under *typescript/string/pad@1/reference@1.0.0 cannot
be resolved, and the registry holds no such published implementation* and *typescript/number/sign@1
publishes no reference.ts*, of contracts this registry publishes and serves. **So the repair is a
refusal that names the fact instead of one that names a cause no measurement establishes**, which is
this file's own worst class rather than a silent wrong install. The claim was corrected in the guard's
own comment before it was published, which is what a red is for.

**The sixth was silent, and it was found by running all six rather than by reading the loop.** An edge
naming an address another edge had already resolved was skipped, digest and all: with `number/sign@1`
published naming `string/pad@1` at `number/clamp@1`'s digest, the honest edge arrived first and the
install answered five correct files. **The right artefact landed because of the order the walk happened
to take.** It is not registry hygiene — `number/sign@1` had been published against code the project was
not getting, which is *a combination nobody published*, the thing `reconcile.ts` already refuses to
assemble one version at a time. `gatherHoldings` compares now, and roots arrive with the digest they
were fetched by so that an edge naming a root is compared like any other.

**A type of its own, and the byte figure is what decided it.** `ImplementationAddress` is also
`ServedImplementationBinding.address`, where a `digest` field already sits beside it, so widening it
would write one fact twice into a served body. The wrapper costs **95 bytes per edge** against the 76 a
flattened form would cost: 76 is `"digest":"<64 hex>"` and its comma, and the remaining 19 are
`"implementation":` and the braces round the nested address. Measured: **+20.2 % over the graph, +26.0 %
over the three snapshots that carry an edge, and +0.0 % over the five.** It is the arbitration
`renderContract` already took at 0.68 % and `licence.ts` refused at +52 %, landing on the paying side of
both.

**`edgeTo` is the only way to build one, and it reads the digest off the artefact it points at.** There
is no shape that lets a caller supply a digest, so a lying edge is unconstructible here rather than
forbidden by a sentence — *make the omission impossible*, on the field whose being wrong installs
another feature under the right name. `referenceAt` went with it: it was the way to write an edge by
hand, and leaving it would have left the door beside the lock.

**And that closed a fixture rather than only a hole, which the replay found and no reading had.**
`sourceWithTwoVersionsOfPad` swapped one record into `HOLDINGS` and served the rest unchanged. That
worked while an edge named only an address — `number/round@1` resolved `number/clamp@1` by name whatever
that clamp had become. An edge pins the snapshot, so a clamp carrying a different dependency is a
different artefact with a different digest, and the round naming the old one names something the source
no longer serves. **Replacing what an address resolves to while keeping its version is the rebinding
permanent rule 6 refuses, and it stopped being expressible in a fixture on the day edges became
verifiable.** What replaces it is what a registry would really publish: a clamp against the newer pad,
and a round published against that clamp. The instrument said so in the one line it has for it —
`C-04: expected killed, measured killed — no longer caught by …` — which is the shape this file already
records as costing more than a silence, saying something true for once.

**Two published sentences were false and are repaired.** `endpoints.ts` said of implementation bindings
that *nothing here is checkable, and every field of it is an opinion*; the (contract, implementation,
version) → digest association is bound for life by `refuseRebinding`. And `RESOLUTION_IS_THE_CLIENTS`
promised a client *can verify every step*, which the edge → digest step made false for as long as the
field has existed. It now names the one belief that remains rather than counting it — that the name a
reader started from is bound to the digest this registry says it is — which makes the closure **a Merkle
tree with one root of trust**, the shape an OCI manifest and Go's module graph already have.

**The obvious repair for the first was refused by measurement, and the one that replaced it has a
precedent.** A third member of `AddressingClass` cannot exist: the class is per *response*, it decides
the cache policy, and **two of the five named answers carry frozen and revisable fields in one body** —
a `digest` and a `publishedAt` beside a `lifecycle`, a `status`, a set of benchmarks and a tag list. A
body carrying one revisable field must be revalidated whatever else it carries, so `named` is right
about both bindings and would stay right if a third member existed. What is buildable is per *field*:
13 entries over 2 types, keyed by `keyof`, so a field added does not compile until somebody says which
of the three it is. `StandingField` is the same mechanism one floor down, on records, and
`snapshot.test.ts` already requires it to partition one exactly. The repaired sentence reads the
revisable half off the map rather than listing it.

**`LOCKFILE_VERSION` does not move, and it was checked rather than assumed.** `FIELDS_OF` is total over
`keyof LockedFeature`, no field of it carries an edge, and `InstalledFile.served` is an unchanged
`HarnessFile`. A lockfile format that moves is a decision, not a consequence.

**This is the last irreversible thing.** Every installation writes digests into somebody else's
`toopo.lock`, and a snapshot's canonical text is what its published digest covers — so adding a field to
a frozen edge after publication changes every digest, which the storage refuses by construction, and the
only way out would be two formats served for ever. Nothing after this unit is unrecoverable.

## What a registry over a wire costs the decision under it — settled

**The port is asynchronous and all four implementations are, which is a decision about testing rather
than about transports.** Two shapes — promises for a server, plain answers for the three registries that
need no network — would have cost nothing to write and would have made `command.ts` branch on which kind
of registry it was handed. Almost every guard in `cli/` builds a local source, so almost every guard
would have exercised the path with no loop, and the fixpoint would have been exercised by HTTP alone.
**The day the catalogue moves out of this repository the local source goes with it, and the surviving
path would be the one least tested.** Two paths of which exactly one survives means the survivor is the
unproven one.

**`HeldRegistry` is the second projection of one declaration, and the compiler measured what it buys.**
It is derived from `RegistrySource` by a mapped type, so a method added to the port is in the view
without anybody writing it — the totality `THE_ENDPOINT_BEHIND`, `FIELD_MAP` and `EVERY_ARM` already
carry, and the shape `toHtml` and `toText` have one folder along. Measured by making the port
asynchronous and leaving the decisions reading it directly: **67 errors in `cli` and 44 in `packaging`**,
of which the product-side ones are 19 in `resolve.ts`, 6 in `search.ts` and 3 in `command.ts` — and
**every one of the 25 is an `await` that is missing**. Under the held projection all 25 are a type name
and not one body changes, which is the property under test rather than a hope about it. `install.ts`,
`reconcile.ts`, `remove.ts` and `update.ts` reported none at all, because they pass a source through and
never call it. `site/` declares its own port and was untouched.

**The `await` is in a loop around a decision, never inside one.** There is no list of what an
installation needs — `resolve.ts` walks the edges each snapshot carries and `plan.ts` deduplicates by
digest, so a prefetch that knew the list in advance would be a second statement of that walk, which is
what `packaging/freeze.ts` already refuses to write. The shape is *decide, note what was missing, fetch
all of it, decide again from nothing*. It terminates because a round writes every missing key into the
cache, **which is why a cache must tell *not asked* from *asked, and the registry holds no such thing*
apart**: collapsing the two makes a genuinely absent answer missing for ever.

**The acceptance criterion is not that an install works over HTTP.** It is that the same decision,
against the cache a networked run left warm, with no network and no process, produces byte for byte the
plan the networked run produced — **and that the second pass asked for nothing**, without which the
comparison is against the very answers it had just been given. Seen red by having the loop return an
empty cache: the offline pass asks for `contractIndex` and the two plans stop being comparable.

**Addressing by the question is the half that decides a supply chain, and the unsafe spelling does not
ship.** `localSource` and `packagedSource` look an answer up *by* its digest in a map keyed on that
digest, so the pairing of an answer with the address it was asked at is held by a data structure; on a
wire it is held by whatever the server chooses to send. Measured by writing the other spelling: with
`servedBlob(whatArrived)`, a registry answering one blob address with another file's bytes installs them
and **nothing objects** — `'faults' in outcome` is false. The maquette carried that as a parameter so
corruption could be watched going through; a parameter selecting it is a hole with a name on it, so C-68
is the cell instead and it has to come back killed.

**The loop made two ambient inputs visible that nothing had to notice while a decision ran once.** `at`
was read inside the decision, so it would be read again on every round and the decision would stop being
a function of its arguments; it is read once in `command.ts` now. And `freeze.ts` cannot record during
the loop — a miss is answered as an empty binding list, so a transcript of a partial cache would freeze
an artefact whose bindings are the misses of a first round, which is *the catalogue is empty because
nobody looked* arriving as a build product. It warms, then records one synchronous pass, and asserts that
pass asked for nothing. That makes it the first production consumer of the acceptance shape rather than a
port of an old one.

**Round trips are `4 + depth`, counted at the wire rather than by the client**, because a client counting
its own requests counts its intentions. Measured over two depths so the shape is not fitted to one point:
**four round trips and five requests** for a contract that depends on nothing, **six and eleven** for the
imagined graph at depth two, with rounds `[1, 1, 1, 2, 1, 5]` — two edges arriving together and five
files arriving together, which is what tells a batched frontier from a walked one. That is exactly what
`9f11770` published when the edge gained its digest, so the product agrees with the maquette rather than
replacing it.

**A guard of this unit was measuring something other than its own name, and the instrument is what
asked.** `cli-install`'s first replay reported one of the five new guards unaccounted for; reading it to
answer found that *a status that is neither the answer nor a 404* pointed the client at a dead port, so
`fetch` rejected before any status existed. Both halves are on one method now — a 404 answers `null`, a
500 throws. **The instrument asked a question about coverage and the answer was a defect in the
assertion.**

**What has no screen yet, declared rather than half-built.** A registry that is down arrives as a throw,
and `command.ts` turns three named errors into refusals a person can read. Nothing here constructs an
`httpSource` — both entry points name a local registry — so the path is unreachable in the product and a
sentence written for it now could be seen red by nothing. It closes with the entry point that first names
an origin, which is the change that makes the failure reachable.

**And the replay found what no reading had, in a guard three folders away and about this unit's own
arithmetic.** W-47 writes a literal into a sentence the method page derives, and it is pinned killed by
the guard requiring every figure a reader can see to occur in the data it was built from. It survived —
because `measured.unprobed.length` **became exactly 41**, the literal it wrote, when three batteries
declared the transport they cannot reach.

**It is the second collision on that literal and the two are different classes.** The first was an
address, `THE_REPLAY.measuredAt` stamped `0d8e41d`, and the repair was the rule that an address leaves
the data by both sides or by neither. This one is a real derived count, which no rule about addresses
reaches.

**What it exposes is a limit of that guard, wider than the one declared beside it.** The declared limit is
that a literal equal to *today's value of the figure it replaces* passes today. The true limit is larger:
the guard asks whether a figure occurs **somewhere** in the data and cannot ask whether it is the figure
*that sentence* derives — so a page reading *41 such readings* passes while the lenses number 24, and the
pool of excusable literals grows with the catalogue. Closing it means every rendered figure carrying its
provenance and the guard comparing the pair, which is a change to how that page emits every number it
has. **Priced and not bought**; what stands instead is a literal chosen to be underivable rather than
merely absent.

**And the rule about addresses was itself being kept by one name where the data carried two.**
`THE_REPLAY.spread` quotes the commit of every reading it compares, and only `measuredAt` was ever
stripped; the others leaked into both sides and cancelled — which is the mechanism that paragraph
describes, happening to the guard that describes it. They went unnoticed because their digit runs occur
elsewhere in the data, which is luck. `THE_COMMITS_QUOTED` is the repair and the prose interpolates it,
so a commit cannot be quoted without being in it. **What the stripping is load-bearing for is the pool
and not the honest page**, measured both ways: removing it entirely leaves the guard green, because a
rendered address is in the pool *and* in the reading and the two cancel; on a page publishing `9269`, a
run occurring nowhere but inside a stamp, it is green without the stripping and red with it.

**What the sweep found, and it is the deliverable rather than the two sentences that raised it.**
`command.ts` published round trips as `3 + 2·depth + 1`, eight at depth two — written at `0ce32d6`
against a maquette, falsified by `9f11770` one commit later, and never revisited. `local-source.ts`
called itself the only implementation of the port, false since `packaged-source.ts` was written.
`remove-directory.ts` argued for staying synchronous because going asynchronous would reach `command.ts`,
which is asynchronous now — the half that carried the weight is that `rewrite.ts` is reached from a
decision the loop replays. And `census.ts` published `0 of 170` for this suite, whose denominator moved
the day this unit added a file; both its figures lost the populations they were fractions of, because
what that sentence is about is 28 and zero being one door read through two configurations.

## What an emitted tree is, and the collision that decided its addresses — settled

**The totality is a walk of the questions and not of the catalogue.** The obvious emission goes through
the contracts and writes two files each; that produces a tree nobody can prove anything about, because a
walk of the catalogue is a list of what somebody remembered — and **an answer a client can ask for that
the emission did not write is a 404 at the moment somebody installs something, in somebody else's
project**. So the closure starts from the three questions a client can ask having read nothing and
follows what each answer *names*: an index names contract addresses, a binding names a digest, a contract
snapshot names the digests of its harness, an implementation snapshot names its own files and the edges
it depends on. `WHAT_AN_ANSWER_NAMES` is keyed by `keyof ReadApi`, so a method added to the port does not
compile until somebody has said what its answer lets a reader ask next.

**And the property that needs no list at all: the tree is closed.** Every address a served answer names
is an address it serves — read back out of the bytes with a regular expression, and never by asking the
record the walk is built on. A closure that asked itself what it names is green for exactly the arm
nobody wrote, which is `GUARD_PERTURBATION_RULE` arriving on a closure. Seen red by stopping the snapshot
arm naming the files it freezes: 32 addresses served nowhere and 28 harness files missing.

**A digest is a whole JSON value and never a substring**, which that guard was measured into rather than
designed with: `string/levenshtein@1` carries a benchmark sample of a hundred and twenty alternating
letters, and `abab…` for sixty-four characters is a digest to any reader that matches inside strings. The
one digest that is *not* an address is a produced profile's `sha256` — checked by regenerating the corpus
rather than by fetching it — and it is subtracted by name.

**It is not the installer's walk, and the difference is the harness.** `packaging/freeze.ts` records what
an installation asks for and is right to; this answers what a *client* can ask. A contract snapshot names
every file of its suite, no command of `cli/` fetches one, and permanent rule 5 says they are public in
full — so a tree built from the installer's walk serves a contract page's own digests as 404s. That is
I-37, and under it `toopo add` still works and the whole of `cli/` stays green, which is what makes it
worth a cell rather than an argument.

**Where an answer lives is derived from what it is about, and a collision decided it.** `Endpoint.path`
was a hand-written string read by nothing, and the client built `/<endpoint>/<address, percent-encoded>`
out of its own head — two statements of one address, neither of which could ever be a file, since `%2F`
is not a name a filesystem holds. Under the prefix §6.2 suggested, `/contracts/<address>` is a *file* at
exactly the path `/contracts/<address>/implementations` needs to be a *directory*. **That is the one
class a static emission finds and a dynamic server never meets.**

So an endpoint says what its answer is *about* and `pathTo` is total over three arms: the catalogue at
the root, a contract inside its own directory, content in a flat space of its own — flat because the same
bytes are named by several contracts and a shared thing cannot live under one of its owners. The prefix
dissolves, the collision with it, and what the collision was hiding is bought: **the address a reader
opens and the address a client asks are the same address.** `/typescript/number/parse@1/` is the page and
every answer about that contract is a leaf beside it.

**The leaf is the endpoint's own identifier and not a name chosen to read well.** That field is already
declared *the address a report or a deployment cites this endpoint by*, so a second spelling would be one
thing with two names — the slug `site/paths.ts` refuses for a page, arriving on an endpoint. The price is
`/snapshot/{digest}` where English would write the plural, and the return is that no table of routes
exists anywhere in this repository to drift from these identifiers. **The whole translation between a URL
and a file is dropping the leading slash**, and that is asserted rather than left to be true.

**What is served and cannot be asked for is said out loud.** A refused contract has no binding, so
nothing names the digest of its contract snapshot and nothing names the harness files that snapshot is
the only place to learn about — two snapshots and nine files of `array/group-by@1`. Emitting them would
publish artefacts nothing can reach; omitting them in silence would look exactly like a hole in the
closure. The guard names both numbers.

**`ReadApi` is the first port here that is the whole read API, which makes the totality an equality.** A
client's port can only ever be checked for naming endpoints that exist; this one is checked for naming
all of them, and `attestations` — the one nothing answers — carries the event that would close it rather
than a reason that ages. `registry/local-read-api.ts` is the third reader of `the-five.ts` and is neither
client's stand-in: the installer's serves the harness and carries no binding, the generator's carries the
binding and serves one file per contract, and the emission needs both halves. The frontier is unchanged
and this is the side of it the frontier is about — no client may serialise this working tree, and the
registry serialising *itself* is what publishing is until a publishing tool exists.

**Measured at `643dce6`, over five contracts of which four are published: 48 files, 517 287 B.** Per
published contract eleven files — one contract binding, one implementation list, two snapshots and seven
harness blobs — and 126 kB; the fixed part is three files, the index, the refusals and the methodology.
So the shape is `11N + 3` files, which gives **5 503 files and 63 MB at 500 contracts, 55 003 and 631 MB
at 5 000, 220 003 and 2.5 GB at 20 000** — and a twenty-thousand-file limit at **1 817 contracts**, not
the ten thousand that two files per contract would have given. The harness dominates and is what varies:
seven files here, one blob per test file anywhere else.

**What the generator pays is a second serialisation and not the emission.** Measured over five runs each,
808 ms with the tree against 532 ms without; split in process, `localReadApi()` is 258–287 ms, **the walk
itself is 2 ms**, and the rest is writing 48 more files. The curve is one extra serialisation of the
catalogue plus a linear term in files — so the day it matters, what is worth sharing is the
serialisation and not the emission.

**Nothing is deployed.** The tree is written into the site's output and served in a guard by a file
server with nothing in front of it, which is the whole of what a static host does. Every request it
answers is recorded with whether a file was there, so a 404 is *counted* rather than inferred from a
command having refused. **The acceptance is not that an install works over HTTP**: it is that `add`,
`search`, `update` and `remove` decide against that tree exactly what they decide against the catalogue
this repository holds, compared with every buffer replaced by the digest of its bytes.

**And what the two sides of that comparison actually differ in was read off the attribution rather than
reasoned about.** They share every decision and differ in one thing — which registry they read — so a
defect in a *decision* changes both identically and the comparison is green on it. What separates them is
a defect in the installer's stand-in, and the mutants that redden these guards are C-17, C-18, C-22 and
C-42, every one an edit to `local-source.ts`. The first draft of that declaration named the transport,
which nothing measured; it is the class this file spends its length removing, caught by reading the
report instead of the code.

**Two things the replay found that no reading had.** `registry-storage` declared `I-35` twice — the edge
that reads its digest off the artefact, and the runtime floor — since the publication unit, and nothing
refused a duplicate mutant identifier where `calibrate()` refuses a duplicate guard one. And all three
new guard files built their subject at the top of the module, so `I-01` made one of them collect 303
tests where the unmutated arm reports 314: a file that collects nothing is read as a run that measured
part of the suite. It is the lesson `site/pages.test.ts` records against W-20, relearned in three folders
at once.

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
   `catalogue/`, under the freeze discipline stated at the top of that file. The bar for adding
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

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
