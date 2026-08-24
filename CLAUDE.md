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
generator, ten static pages, four of them with a playground that runs this repository's own modules
with their types removed. The archive: compiled JavaScript and nothing else, whose size is no longer a
function of how many contracts exist. The emitted tree, which is every answer the read API can give,
written as files at the addresses a client asks. The instrument: a battery per folder anything injects into, their pinned
verdicts, one command that replays them, and two gates that replay them without being asked - the
batteries a push can be answered by on every push, and all of them before anything reaches npm. And permanent rule 6, executable: a binding records the
commit it was published from, and the frozen half is rebuilt at that commit and compared rather than
transcribed anywhere. What this repository says about its own history now resolves against what git
holds rather than against what somebody checked: a commit identifier in the prose names a commit of
this graph, no object of it carries an address the project refuses to publish, and the only checkout
registered here is its root.

**The gate now answers for the instrument as well as for what the instrument measures, and the exit
code it reads has a failing direction that is exercised.** A battery *measures* a folder and is *built
out of* the runner; the second half selected nothing, and ADR-0146 refused it on the price of a walk it
was not going to take - following what a *suite* imports selects everything, following what a *run*
reads closes on eight files and costs 5.2 % of wall clock. **The four names that entry gave were one
too many and three short**, `published.ts` being on no battery's execution path and `census.ts`,
`measure.ts` and `paths.ts` being read by every run: nothing had derived that list. What replaces it is
a declaration a walk refuses to disagree with, and a blind spot published rather than discovered - a
templated `import()` is invisible to the walk, so the declaration is what notices the walk going quiet.
`8b6aa89` goes from 0 batteries to 21 and `f465660` from 2 to 21. **And the foundation under all of it
was unproven**: both gates read an exit code whose only assertion was `toBe(0)` on a battery pinned
green, so dropping the guard-disagreement term printed every disagreement and exited 0 across
twenty-one batteries at once. Three exit codes, three guards, each seen red alone. ADR-0149.

**The site has a search, and it is the one the client has rather than a second one.** A page fetches
`contract-index` and `refusals` — the two answers it already serves — and runs `packages/registry/search.ts`
against them, so a reader typing into the masthead and a reader typing into a terminal get one answer by
construction. The site's own port had deferred it for three units, *until the catalogue stops fitting on
one screen*; **that condition is not met and the deferral is lifted anyway**, because the promise is that
somebody describes what they need, and a promise is not kept by a page a reader has to know how to read.
A deferral can be lifted by a promise rather than by a threshold, and the record says which of the two
did it. What is served is a slot and never a control: a reader without JavaScript meets a masthead with
nothing extra in it. The two answers cost 1 262 B more on the first query, and the playground — the
larger half — stays behind an `await import` that nine pages never make. **This line read *every page
loads 19 789 B in brotli before a reader acts* and that was ADR-0137's figure at `62f2474` restated
here with no coordinate**, which is ADR-0018's defect exactly: a dated number and a present-tense
clause, and it is the clause a reader believes. Measured at `018a2da`, neither reading of its
population reproduces it — 34 167 B for the page and the five modules a search needs, 22 443 B for
those modules alone. It is not restated with today's number, because the number moves whenever the
tree does; ADR-0137 holds the reading it was, with the commit it was taken at. Three examples are offered before anybody types and a guard runs the
catalogue's own search over each of them, because an example that finds nothing is the defect a visitor
met on the install command. ADR-0137.

**And that search stopped spending on a word a reader adds the allowance written for a word they
omit.** A query that sets a word aside now has to carry more than one word of the field it names,
because one word is not a name — which is `sort array` one floor down. **It was twelve requests and
not the one the corpus happened to hold**: a deliberate field whose telling words fall to one opens
its contract to anything typed beside it, and measured at `a705977` over this catalogue's six
publications those fields ran **0, 0, 0, 2, 15, 21**. **Eight of the twelve are requests this
catalogue holds nothing for** — `parse json`, `round robin`, `add to cart`, `float left`,
`fixed header` among them, answered **0, 1, 1, 1, 2, 8** — **and four are requests it could have
answered**, `slugify a blog post` among them, answered **0, 0, 0, 1, 4, 4**. Only the eight are in
the negative half of the trial, because that list says *the catalogue cannot answer this*: **the four
were written into it first and taken out**, which is the corpus rule holding against the person
applying it rather than a distinction the rule can make. **The rate is not monotone and this file said it
was**: the negative half had one query answered at one, two, three and four contracts, **none at
five**, and one again at six, because growth took `string` to three contracts, so it stopped telling
them apart and `remove accents from string` lost the field it had been naming. **The repair that
looked obvious is dead on a measurement**: refusing any query carrying a word the catalogue has never
heard breaks four of the thirty-two corpus queries, since `do`, `i` and `what` are as unheard-of here
as `yaml` and nothing derived from the catalogue separates a function word from a subject. What it
costs is stated rather than smoothed — over 198 queries, every alias with one word replaced by one the
catalogue does not know, **151 were answered before and 125 after with zero wrong answers either
side**, and the twenty-six lost are the same shape as the twelve closed. **And the reading nearly
published was the wrong population**: a second sweep of 198 queries with one word *left out* showed no
change at all, and **nought of them reach the branch the unit changed**. ADR-0154.

**And the registry can now learn a word about a contract it may no longer edit, which is the first
standing field a *mechanism* reads rather than a reader.** This line read *the first thing this
catalogue has ever been able to say about a published contract that the contract itself could not*,
and that was false on two counts already in the schema: `useCases` and `againstTheLanguage` are both
exactly that. What is true of this one and of neither of those is that it changes **what a query
reaches** rather than what a page says. `number/parse@1` declares `int` and not `integer`, `answers` lets a query shorten a word
and never extend one, and measured at `91b7314` over eight ordinary ways of asking for that
function - `read an integer from a string`, `how do I convert a string to an integer` - **written
with `int`, nought of the eight are silent; written with `integer`, all eight are.** One alias would
answer them and `contractSnapshot` freezes `identity` whole, so nobody may declare it. `alsoFoundBy`
is standing: three fields per phrase, the term read by the search as an alias, and **the six contract
digests identical to the byte** with `npm run freeze` green beside them. **The argument that was
given for freezing it was reversed by this repository's own week**: ADR-0154 measured
`slugify a blog post` at **0, 0, 0, 1, 4, 4** over six publications with no contract moving, so what
a query reaches is a fact about the whole catalogue and the frozen half was never the complete
account of what a contract answers. What the registry measures is not what the contract is held to,
which is `againstTheLanguage`'s argument arriving on retrieval. ADR-0155.

**The guard whose population it would have halved was repaired before it could, and the shrink was
seen green.** `every-declared-alias-finds-its-own-contract-first` swept `entry.searchAliases`, which
was every phrase there was; a second place to put one takes half its subject with nothing saying so,
hours after ADR-0152 closed that class - `f776a43`, the same day. The population is a declaration keyed by
`keyof ServedIndexEntry` now, so a field added to the answer does not compile until somebody classes
it - and **the compiler forces a row and cannot judge it**, so a second guard compares that
declaration with what `search.ts` really reads. Marking the new field `null` reddens the second guard
alone: **411 of 412 green, and the guard whose whole subject is the aliases reported nothing.** ADR-0155.

**What it does not buy is written where somebody reaching for it arrives.** Correcting or removing a
declared alias is still impossible - the eight aliases of the published contracts are inside four
digests - so ADR-0023's entry below closes by half and stays open. And the alias review is
ADR-0023's, it happens at publication, it caught eight liars, and a learned term arrives at a moment
nothing marks: two of the three fields exist to write that review down, a guard computes the half
that can be computed, and a third refuses a learned term on a contract whose `identity` is still
open. **The judgement itself is recovered by nothing**, and it is on the list below. ADR-0155.

**A reader receives the rules and not the argument for them, and the reason to link a stylesheet went
with the prose.** `style.ts` keeps its reasoning beside the declaration it explains and every word of it
was being downloaded by every visitor: 75 comments, 25 007 B of a 41 540 B sheet, inlined into fifteen
files of HTML. **The raw figure overstates by 3.1 and the decision survives it** — in brotli the sheet
is 11 236 B and 3 267 B stripped, and across the change the front page goes 11 724 → 3 805 and the tree
236 960 → 119 086, which is half the HTML weight of this site. The linked file was measured and
refused: it buys 3 264 B per page after the first, against a round trip, an address no listing names,
and a `.css` falling through to the host's four-hour default where pages are served `max-age=0` — a
stale script is a control that does nothing, a stale stylesheet is the page. **The argument for a file
was that the sheet is heavy; it is 3 267 B.** Not a pixel moved, and a browser is what says so, twice:
both sheets through `CSSStyleSheet.replaceSync` give **169 rules each and zero differing**, and the
heaviest page rendered at 1440 with the `style` element swapped between them gives **627 elements,
520 computed properties each, zero differing, 13 128px tall either way** — each probe perturbed twice
before it was believed. That is a
verification taken once and never a guard, and ADR-0141 says which of the two it is so nobody promotes
it. **The blind spot is published**: a removal taking one declaration out of the middle of a rule,
braces balanced, is invisible to all three guards, and the total form is the parser the browser lent.
ADR-0141.

**And it named a class this repository had not carried: a false-only region — a part of a guard's
population where no true verdict is reachable and a false one is.** `a-page-loads-nothing-and-runs-nothing`
refuses `url(` anywhere in a served page, comments included, so on the 25 007 B of comment it swept
**a true positive was impossible and a false positive was possible**: a `url(` inside a CSS comment
fetches nothing, so the guard could never have been right to fire there, and had anybody written one it
would have fired and been wrong. Measured over the seventy-five comments: zero `url(` and zero `http`.
**It never reddened because nobody wrote one, not because it had reason not to.** It is neither shape
already named here — a guard passing vacuously has *no* population, and a population that shrinks in
silence loses coverage; this one was carrying a region where only a false verdict was reachable, and
most of it was doing real work. **The repair removed it by accident**, for reasons about bytes, so the
repository is one region better off and no decision bought that — which is the shape that recurs
somewhere else unnoticed, nothing looking wrong on either side of it. ADR-0141.

**The debt one door along is paid, and the refusal named the wrong obstacle.** ADR-0141 wrote that
*the verification does not transfer* — `CSSStyleSheet.replaceSync` and a rule-by-rule comparison have no
JavaScript equivalent — and that is true of the form and inverted as a conclusion. **The CSS comparison
could never be a guard**, because it needs a browser, refused three times on the list below. **This one
needs a parser**, which is already a runtime dependency and which a suite here already spawns: seven
project loads in 0.645 s, against the 4.02 s the site suite took. So the second half is not the first
half without its check — it is the first half with a better one, and ADR-0141's own published blind spot
does not recur.

**What stands where `cssRules` stood is both syntax trees walked and compared on kind, child count and
leaf value.** Measured at `43db0c2` over **9 637 nodes: zero differing** — perturbed to 375 by a deleted
statement, 4 by a renamed identifier and 3 by the hazard planted. **The price is that the parser is not
the consumer**, which CSS did not pay: V8 exposes no tree, and no normal form at all — `Function.prototype.toString`
returns source text with the comments in it, `name` and `length` are equal for different bodies, a module
namespace carries no body and the code cache is not canonical. What makes a third party's reading
acceptable is that stage 1 already trusts this parser to decide what enters the catalogue; and it was
checked against V8 on automatic semicolon insertion, case for case.

**What a reader stops paying is 19 475 B in brotli on every page and 28 683 B on a contract page** —
2.46 and 3.62 times what taking the prose out of the stylesheet bought. The tree figure is 34 194 B and
**no reader pays it**, because nobody loads fourteen modules. **The five `reference.js` keep their
argument**, by a guard rather than by care: a contract page promises *that contract's own `reference.ts`
with its types stripped*, so the real seam was 92 562 B and not 107 979, and the refusal costs a reader
nothing because no reference is among the five modules a page loads.

**The reader is the compiler's scanner driven, and a measurement is why.** A bare scan loop finds **10
comments and 9 644 bytes in `address.js` where the parser finds 25 and 16 358** — it loses template
parity at line 204 and never resynchronises, because this prose is full of backticks. **It raised no
error and returned a plausible number.** A reader written from scratch is worse: one written for this
unit agreed with the parser on the six files it finished and looped for ever on the seventh. **And the
premise the old refusal rested on was false** — `browser.ts` claimed `typescript@7.0.2` ships no
JavaScript API, offering `lib/` as evidence; the API is under `dist/`, and `typescript-api.ts` had said so
correctly the whole time. Two files, one fact, and the wrong one was the file somebody opens to ask this
exact question. ADR-0156.

**Three things this unit could not buy are written down rather than smoothed.** The cell it most wanted
survives: on the fourteen real modules all three replacement rules leave every tree identical, because
no module here separates a `return` from its value with a comment spanning a line — so W-101 states an
intent and carries no behaviour, which is `number/round@1`'s shape three times over. A coverage reading
was attempted and failed — 1 027 scripts captured under `NODE_V8_COVERAGE`, two of them this
repository's, **none of the nine modules**, and a probe reporting *100 % executed* that was the absence
of data. And the figures in the commit are the simulated ones where the record's are the shipped ones,
which is ADR-0141's own lesson arriving one unit later: 6 090 predicted, 6 094 served.

**Two things it broke are worth more than what it built.** A stylesheet can be green and broken: the
first repair of the sticky bar used a spacing step the scale does not declare, which makes the whole
`calc()` invalid, so `--the-sticky-bar` resolved to **nothing at all** and the site suite stayed green
through it — found by reading the computed value in a browser. And moving the playground behind a
dynamic import took its edge out of `every-import-a-browser-module-keeps-is-a-module-the-site-writes`,
which matched `from '...'` and cannot see an `import()`: **an edit that changes how a dependency is
expressed can leave a guard's population without touching the guard**, and nothing reports a population
that has quietly shrunk.

**The only part of this product a visitor touches with a mouse stopped being the only part nothing
verified.** `start.ts` builds the copy control, the choice of package manager, the search field and the
playground's form; it exports no name, so nothing could import it and no mutant in it could be killed,
and `site.battery.ts` had declared `contractPath: 'packages/site'` since it was written without anybody
ever putting a cell there — an absence and never a refusal. **What was in the way was not the
document.** Measured at `17cc9bf` over its executable text, by the rule that a line is delivery as soon
as it names the document, the navigator or something that came from one: **50.8 % delivery, 40.2 %
decision, 9.0 % brackets** — where the decision half counts the eighteen lines written straight into an
element, a spelling at a time, as well as those standing free. Two fifths of that file was a claim about
what a visitor reads, expressed as an argument to `setAttribute`. It is `what-a-control-says.ts` now,
and the playground's own four claims went to `playground.ts` because nine of thirteen pages never fetch
that module. **`searching.ts` came with it and was in a worse state in one direction** — four exports,
no test importing it, reachable the whole time and simply not reached, with *a rejected promise is not
kept* declared in its own comment and nothing behind it. Twenty-four guards, the site suite 139 → 163,
the battery 746 → 765. **What a reader pays is stated rather than smoothed**: every page is **1 072 B
heavier in brotli**, 5.5 % given back of what ADR-0156 removed one unit before, and `start.ts` itself
*grew* by 286 served bytes. ADR-0157.

**The instrument refused a run in which every declared cell had done what it declared, which is the
finding of this unit.** Fourteen cells were written for twenty-four new guards on a judgement about
which defects were plausible; all fourteen killed exactly what they named, and the battery exited 1
anyway, because **five guards had nothing reddening them at all** and it named them one by one rather
than printing a total that looked healthy. Nothing beside it could have said so - the guards were
green, the cells were green, the suite was green, and the count was the count, which is what a guard
that cannot fail looks like to whoever reads it. One is instructive on its own:
`what-follows-the-invocation-is-what-the-page-already-asked-for` was believed covered by W-104, and is
not, because a typed word count and a derived one **agree on every input the function accepts** - so
that cell reddens the refusal and leaves the ordinary answer untouched. W-116 to W-120 are the five,
and a judgement about which defects are plausible is a judgement the accounting is what makes
answerable.

**The cell worth more than the nineteen is the one no reading of the output could have caught.** W-115
calls a contract's diagnostic before deciding whether to show it: **both printed lines are byte for byte
what the correct version prints**, and the only difference is that a diagnostic now runs on every
keystroke of every *successful* call, on somebody else's machine, invisibly. It dies because
`theAnswerShown` is handed something to call rather than something already called — **not calling it is
an observable, and calling it early is not**. Three smaller findings are in the record: a typed word
count that answers `toopo add x` for `yarn dlx toopo add x` and is derived now, with the derivation
itself published as unobservable; `LOADED_BEFORE_A_READER_ACTS` citing a guard **no suite collected for
the whole of its life**, which is ADR-0126's class found by adding a row and asking what would check it;
and ADR-0156's `7 532` and `42 530` reproducing under **none of four readings** of *executable text*
over files that did not move — both stamped, both left, and what replaces them carries its rule as well
as its commit. ADR-0157.

**And that freeze now covers what a contract's guards call, which until this unit it did not.** A
fingerprint covered the seven files of a folder and nothing they import, so emptying one shared guard
left all eight ledger digests identical to the byte while a contract the guard exists to refuse went
green — measured at `e8f68ca`, with the same defect red once the shared file was put back. `sharedHarness`
is the closure: the files a contract reaches outside its folder are declared, derived independently by a
walk over what the seven really import, refused on any disagreement, frozen with the contract and served
beside it — so a reader who fetches every file a snapshot names can now resolve every import those files
carry, which is the auditor's half of the same hole. The bill is stated rather than discovered: editing
either shared file rebinds every published address at once. ADR-0105.

**The catalogue is marked published, and that is the act this repository was built to be able to take.**
Four contracts carry `published`, their reference implementations are bound at `1.0.0`, the manifest is
`toopo@1.0.0` and `private: true` is gone. **Publishing and anchoring are two acts and no commit can do
both**, which is a fact about the mechanism rather than about this unit: `implementationSnapshot`
carries the version, so the commit that mints `reference@1.0.0` creates an address no earlier commit
binds and cannot name itself as the commit it was published from. So the publication is a commit and the
anchoring is the commit after it. `contractSnapshot` omits the lifecycle - measured, the four contract
digests are identical either side of the marking - which is what makes the second commit's coordinate
honest for the first four addresses. ADR-0106.

**And something now reads that coordinate.** `packages/registry/against-what-was-published/` rebuilds
every binding at the commit it records and compares, so permanent rule 6 stops being the biggest
`one-directional` declaration here and becomes a red. It is a suite no battery replays, for the reason
the origin proof is: `registry-storage` would pay for a checkout and a child process sixty times per
replay, inside an instrument that manages worktrees of its own - and the reading that says *the verdicts
would hold anyway* is true only while that battery has no surviving cell. **The price is the origin
proof's and is stated in the same place**: no mutant reddens those two guards, so nothing measures what
they are worth, and what stands in for it is that they were seen red on three real conditions with the
reds published. ADR-0107.

**The fixtures stood on nine addresses the catalogue could publish, and one of them is the sixth
contract.** `number/round`, `string/pad`, `number/clamp`, `number/sign`, `text/left`, `text/right`,
`string/titlecase`, `number/rond`, `toy/thing` — every one two kebab-case segments, which is exactly
what `CONTRACT_NAME` accepts. **The failure has no event**: nothing reddens, nothing drifts, and the
collision is met by whoever sets out to write the contract, at which point the choice is between
renaming forty files and publishing at a name nobody chose. `number/round@1` was decided while three
fixtures stood on it — the imagined graph's root, the record `the-sixth-contract.test.ts` writes to ask
whether the schema takes a sixth, and the address every guard of `packages/cli/` installs from. A domain
beginning with `imagined-` is now one no contract may be published at: `serialiseContract` refuses it,
`imaginedSource()` refuses anything else, and a pair of guards holds both halves — either alone would be
a convention with a test in front of it. **The prefix rather than a reserved domain is a measurement**:
the graph exists to exercise `../../<domain>/<name>/reference.js`, six fixtures in one domain would
write `../<name>/reference.js`, and the harder shape would stop being written anywhere. It shows in the
bytes — an install goes 794 → 821 B, and the 27 are three specifiers × nine characters. ADR-0142.

**The count is the argument, not the repair.** Three successive sweeps of this repository counted
**six, then eight, then nine**, and nothing about the three that were missed looked different from the
six that were found. A sweep over the text cannot replace the declaration, measured rather than
assumed: matching `CONTRACT_NAME`'s shape against every quoted literal returns `lib/toopo`,
`packages/cli`, `application/json` and `vitest/config` beside the real answers, because the shape of an
address and the shape of a path are one shape. So the guard is total over a **declaration** and the
population is `imagined-addresses.ts`'s own exports. **What it does not reach is a bare literal typed
into a future test**, which is on the list below. `Math.clamp` at TC39 stage 2 is what made it urgent:
the language is coming for `number/clamp`, and a fixture in the way of a *decision* is worse than one
in the way of a contract.

**And the rename produced a rule this repository did not have.** Ten records name one of the nine.
Nine were renamed on the precedent of ADR-0095 and ADR-0124 — *both moved every identifier and neither
moved a single tree, which is what made the stamped measurements survive as renames*. One passage was
not, and applying the test is what showed the two directions: for text this repository's own fixture
produced, **renaming is what restores reproducibility**; for a probe taken outside it, on files the
probe itself named, renaming would make it a transcript of a run nobody performed. ADR-0110's reading of
node's resolver is left as taken, with the date beside it and what the address became. ADR-0142.

**The sixth contract is published, and it is the first time this repository grew a catalogue rather
than founded one.** `number/round@1` carries `published`, its reference is bound at `1.0.0`, and
`contracts/typescript/number/round/` is frozen whole — the seven files, `language.test.ts`, comments
and blank lines included. Two batteries name its folder: `number-round` injects into `reference.ts`
and `number-round-spec` into `contract.ts` and `edge-cases.ts`. **There was no intermediate state and
that is a mechanism rather than a preference**: `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns`
is bidirectional, so a battery cannot name the folder until the contract is in the catalogue, and
`local-read-api.ts` sends anything that is not `never-published` through `publishContract`, so
entering the catalogue *is* publishing. Two commits rather than one, for ADR-0106's reason arriving a
second time: `PUBLISHED_FROM` is now a map keyed by address, and the commit that mints a digest can
never name itself. ADR-0143, ADR-0144.

**Writing the batteries found two defects in `reference.ts` hours before it was frozen for life.** It
carried no licence marking. And it annotated its exports with the contract's own types, which
`states-its-own-signature` refuses in as many words: the compiler then enforces conformance at
authoring time and `signature.test-d.ts` becomes **unable to fail** — a guard that cannot fail, in the
file whose subject is proving things. The repair is measured rather than asserted: RS-03 widens
`failureReasons` and was accepted by the compiler before it and is rejected after. **Neither was found
by reading**; both were found by a guard that had never had an instance to fire on.

**Three cells of `number-round` survive, and each is inert for every input rather than unreached.**
They remove the `Object.is(value, -0)` disjunct from the sign, the leading-zero strip from the digit
string, and the explicit zero past its left edge — measured differentially over 2 000 001 values at
four place counts and twenty-five traps at twenty-one, zero disagreements, each with a structural
argument beside the measurement. They state an intent and carry no behaviour, in a file nothing may
edit again.

**The language moved under a published contract for the first time, and the catalogue can now say so.**
Temporal reached stage 4 in March 2026 and Node 26 ships it unflagged; `date/add@1` is frozen for life.
**The field a contract says this with is shut**: `identity.relationToTheLanguage` is inside the digest,
and so is the divergence replay, because a declared file enters `harness` — measured at `ee2d1c1`, both
move `date/add@1` off `94c5acc7…`. So the answer goes in the standing, as `againstTheLanguage`, which is
the **second of two candidates `CONTRACT_STANDING_FIELDS` named on paper before either existed** —
*anything a later measurement attaches to an artefact published without it*. Somebody wrote that sentence
in advance and what filled it was an event nobody here controls. **The contract stands, and a replay says
so rather than a reading of the news**: block 4.4 against Temporal, all forty-three cases of both tables,
**thirty-eight agree and five part for three causes** — and Temporal parts before it can be asked, since
the declared signature takes a `Date` and Temporal offers a replacement type instead. Every figure carries
its limit: the reading is V8 13.6's, which predates stage 4 and still exposes the `TimeZone` and `Calendar`
the specification removed, so the `NaN` cause is published as a suspicion. **`number/parse@1` owes the same
debt and does not get the field**, because ADR-0128 refuses a standing field that restates the frozen half
and its description already enumerates what `Number` and `parseFloat` do — so the test for the next contract
is *does its frozen half already say so*, never *has its language moved*. What the unit could not buy is on
the list below: the debt is unpayable by either symptom, in a sentence frozen with the contracts it
describes. ADR-0150.

**That answer is a section of its own now, and what put it in the wrong place was a reading of the code
rather than of the page.** ADR-0150 rendered the three statements at the tail of *What it does*, so a
reader met `ZonedDateTime.add` under `constrain`, V8 13.6 and a forty-three-case comparison before
*What it is for, and what it is not* — **2 584px of it at 320 and 713 at 1440**, measured. It is
`#against-the-language` now, last above the line, and the distance to the job falls by more than half at
every width: 2 584 → 1 099 at 320, 713 → 321 at 1440, for a page 1.2 % longer at all four. **The order
is what was noticed and the mixture is what was wrong**: `identity.description` is inside the digest and
a re-examination is standing, and one heading carried both as consecutive paragraphs of one weight with
nothing telling a reader which of the two is frozen for the life of the major — the sentence `In
practice` has carried since ADR-0118, missing from the second standing field. A guard refuses that now
over every contract page, seen red on `57afaa7`'s own shape, and
`a-re-examination-reaches-the-reader` stayed green through the red, which is the neighbour measured
rather than asserted. **Two sentences of ADR-0150 were false and one rendering found both**: it declared
the page had never been looked at, and it argued the placement from an adjacency to
`identity.relationToTheLanguage` that `date/add@1` does not declare — true of the code's shape, false of
every rendering of it. Six contract digests unmoved to the byte. ADR-0151.

**And the last known instance of the class this week was spent closing is closed: a guard that could
not see its own population shrink.** `every-source-that-holds-prose-yields-a-paragraph` built its
population by calling `trackedProse()`, the very function a defect would narrow - measured at
`879ac08`, reducing that filter to `.ts` takes the population **from 438 files to 284** and leaves the
guard green, with `tsc` green beside it. Thirty-five per cent gone and nothing said. **The comment
above it defends the other axis in as many words** and is right about it: the two byte-readers are
independent, and that sentence is about what they read rather than about what they are run over.
**The three obvious repairs are refused on measurement rather than on taste**, including the one that
looked strongest: sweeping every tracked file with the guard's own prose test answers true on
`LICENSE`, `wrangler.jsonc` and a `tsconfig.json`, and misses `suites.yml` whose comments are in `#` -
red on its first day for a reason that is not the defect. What replaces it is the reading's own five
**populations** as the expectation, with `trackedProse()` as the answer judged against them, which is
the way round the old guard has not got. **The pair is the evidence and not the red**: on `.md`
removed, the new guard names `records` and `prose` and the old one passes through it, which is what
says they are two claims. The compiler holds the other direction - a population returned and not
declared is `TS2322`. **Its own thinness is published**: it is total over five populations and never
over files, and the thinnest is `prose` at **three**. ADR-0152.

**The seventh contract is published, and the instrument caught its author and its reviewer in the same
sentence.** `object/deep-equal@1` publishes two rows as the witness of what a memoising comparison
does, with a rationale saying such an implementation answers `true` on them. **It answers `false`.**
Measured at `3ec621c` by injecting exactly that defect into the contract's own reference: over the four
forms of the witness the memoising walk parts from the sound one **once**, and only where the keys are
transposed *and* the right-hand `also` holds the very Set member the failed candidate tried - the
published witness holds a fresh object there, and the path is keyed by identity. The rows are right,
the specification is intact, nobody holds code that behaves wrongly; what a reader holds is a false
explanation, in a file inside the digest every lockfile carries.

**What found it was not a review.** That sentence was written by the assistant, read and approved by
the owner, and published - by two people who both knew the danger, on a row that exists *because* one of
them had got it wrong an hour earlier. Neither asked whether the witness witnessed. A mutant did, and a
battery that refuses to call a run healthy when nothing reddens. **That is this project's thesis tested
on the two people who hold it**, and it is better evidence than any argument either could write in its
place.

**No second major, and the price is why rather than the sentiment.** A second major costs a duplicate
the search does not tell apart, the install command on every page of the first ceasing to work, no
folder to live in, and two majors wanting one installed path. The freeze exists to protect what somebody
installed. So the frozen half keeps its sentence as a photograph and `correctionsToFrozenProse` - the
fifth standing field - says what the measurement found, rendered inside the case it corrects because a
reader who meets a correction three screens later has already believed the rationale. **It is not
`againstTheLanguage`**: that field's first term is `whatMoved`, and nothing moved. Two of its four
fields are `executable`, and the guard requiring the quotation to occur in the case's own rationale
**caught its own author on its first run**. `DE-01` survives under a class that did not exist -
`its-witness-is-frozen-out`, a real defect whose witness the contract may no longer carry, the one
survivor kind nothing closes short of a second major. ADR-0160, ADR-0161.

**What does not exist.** The publishing tool. Stages 2 to 7 of the validation pipeline. A second
language.

**What is broken, and it is the published package rather than anything in this tree: `yarn dlx toopo`
does not run.** Measured on 2026-08-19 against `toopo@1.0.4` as npm serves it, in an empty project
with a `packageManager` of `yarn@4.6.0` obtained through corepack: `yarn dlx toopo add
string/slugify` exits 1 with nothing written, and Yarn names its own cause — it applies its builtin
compatibility patch to `typescript`, `typescript@patch:…#optional!builtin<compat/typescript>`, and
the patch fails with `ENOENT … lstat '/node_modules/typescript/lib/_tsc.js'` because TypeScript 7
does not hold that file. **`typescript@7.0.2` is this package's one runtime dependency**, which is
what puts it in the way.

**The control is what makes the cause believable rather than plausible.** `yarn dlx cowsay` in the
same shell, the same minute, exits 0 and prints its cow — so Yarn works on this machine and fails on
this package. Without that reading the failure could have been Yarn's, and a cause named without it
would be the thing ADR-0042 refuses.

**The three that were measured all work and land the same byte.** `npx`, `pnpm dlx` and `bunx`
each exit 0 and write `lib/toopo/string/slugify.ts` hashing to `1a8ae9d1…`, which is the blob the
catalogue announces. `deno` was not measured, because it is not on this machine, and so it is not
published anywhere either. **The population of forms is four and one of them is red.**

It is not repaired here and it is not this list's class - nothing is unkept, something is broken -
so it is written where a session reads first rather than filed as a declaration nobody keeps. What
would close it is a decision about that runtime dependency, which is a unit of its own and touches
the archive rather than the site.

**`toopo@1.0.0` is on npm, and the way it got there is what the unit before this one replaced.** It was
published from a keyboard, and the registry's record says so: `maintainers` and `_npmUser` name a personal
account, and `dist` carries the registry's own signature and **no attestation at all** — so the archive a
reader installs could not be tied to the commit or the run that built it, which is the tie every other proof
here is about. A job of `suites.yml` publishes instead, after `needs: site` has reached both matrix
legs, the deployment and the proof against the origin; npm exchanges an identity token GitHub mints and
writes the attestation itself, so **nothing here stores a credential** and there is no ninety-day secret
to renew. ADR-0109. What that job used to wait for was a dispatch carrying a typed word, and ADR-0111 —
below, under its own heading — is why it no longer does.

**The manifest reads `1.0.4`, and it is the first release that corrects neither the program nor the
artefact.** `1.0.0` was published from a keyboard with no attestation and a personal address frozen into
it; `1.0.1` corrected that artefact and nothing else, its `dist/` byte for byte `1.0.0`'s; `1.0.2`
carried out a defect in the program and was the first whose compiled content differed; `1.0.3` carries
ADR-0110, a feature landing at `lib/toopo/string/slugify.ts` rather than at `…/slugify/slugify.ts`, and
was the first whose change a user meets on their own disk. **`1.0.4` repairs a chain of provenance this
repository broke itself**: ADR-0124 reissued all 506 commits of this graph, and an attestation is
addressing like everything else, so the four npm holds name commits of a history that no longer exists.
`npm view toopo@1.0.3 gitHead` prints one and nothing here resolves it. **The four are named by that
command and never written down**, because a citation of a dead commit inside the paragraph explaining
why they are dead is the defect that paragraph describes — the rule that withdrew `1.0.1`'s tree digest,
applied to an address rather than to a figure.

**What it leaves open cannot be closed, and that is the shape of the entry rather than a regret.** npm
does not republish a version, so those four attestations stay wrong for as long as npm holds them: the
chain is reattached forwards and never backwards. **The population is those four and nothing closes
it.** What *was* checkable was checked — **not one of the four commits they would name in this history
sits in a file a published contract freezes**, so the citation sweep reaches every one of them that is
written down rather than the rewrite's own pass being the only thing that ever held them. Three are
cited, in a record, in `packages/registry/address.ts` and in this file; the fourth is cited nowhere. The
frozen population carries two citations and both are the dead identifier this list already records.

**Measured before the rank was chosen, by the method `1.0.2` established** — `npm pack toopo@1.0.3`
unpacked and compared with what this tree builds — 35 modules either side, 434 251 bytes against
434 709, and **8 of the 35 differing**, which are exactly the eight sources that reach the archive and
moved since the publication. Six moved only inside documentation comments, four of them because the
rewrite replaced an identifier of seven characters by another of seven. **The two that carry code are
ADR-0118's `useCases`, and no command reaches them.** **PATCH is founded on one fact and confirmed by
the others**: the manifest declares a `bin` and no `exports`, so nothing here is importable and the
whole public surface is the grammar of the six commands, which has not moved.
`THE_PUBLISHED_IMPLEMENTATION_VERSION` stays at `1.0.0`: a version is half of an implementation's
address, nothing it addresses moved, and the publication is the event ADR-0106 cut that tie for.

**And the dispatch is gone: the number asks for the publication.** It was two gestures for one decision —
a version decided in a commit, a run asked for from a menu afterwards — and between them the tree was
corrected and the package was not, twice in two days, with nothing saying so. The third day it produced a
red: a dispatch of a tree declaring `1.0.2`, refused by npm because `1.0.2` was already published. A job
now reads the listing of versions npm holds, compares it with what this checkout declares, and the
publishing job fires on the difference. **The condition is deliberately not *did this commit move the
number***, which is a proxy: measured at `d8a25ae`, that comparison selects correctly on all five of the
440 commits `HEAD` reaches where the version differs from its parent's, and it would still miss a bump
pushed under a later commit, because GitHub runs a workflow once per push and on the tip. Asking the
registry has no such case, and it is asked as a **listing** rather than as `dist-tags.latest`, which is a
pointer that would go on looking right while meaning something else. **The finding worth carrying out of
this unit is elsewhere**: the line keeping a publication from being cancelled was keyed to
`github.event_name != 'workflow_dispatch'`, so moving the trigger onto a push would have quietly repealed
it — the sentence never became wrong, it stopped being attached to anything. Concurrency is evaluated
before any job runs and so cannot know whether a run will publish; `main` is therefore never cancelled.
ADR-0111.

**The tree digest `1.0.1` published here is withdrawn rather than carried forward.** It appeared twice,
both times in prose, and nothing in this repository computes it — so no reader could rebuild it and it
established nothing that the counts and the per-file digests beside it did not already establish. What
replaces it is the comparison any reader can take with `npm pack` and a digest tool.

**The declared origin serves this catalogue, and that is the half that changed.** `main` builds the
tree in CI and `wrangler` uploads it to Cloudflare Pages. Measured at `27d1dbb` over **all 76 addresses
the tree writes** — not a sample of them: every one answers, the 36 addressed by content carry the
year-long `Cache-Control` `cachePolicyFor` declares, `_headers` answers 404, and an address nothing was
ever served at answers 404 with the page that says exactly that. **`@` is served directly, with no
redirect**, which is what the move to Pages bought and what settles the question the previous host
opened. `X-Robots-Tag: noindex` is absent here and present on `toopo.pages.dev`: the host rule retires
itself as designed, and both halves were read in one sweep because either alone proves nothing.
ADR-0103 carries the table, the two headers on served addresses that this repository does not decide,
and the one shape the sweep could not reach.

**And an installed `toopo` has now been seen asking it.** A tarball built here, installed into a project
holding nothing, downloads a feature from the declared origin, and the bytes that land hash to the
digest the registry announced — measured end to end, in the one suite of this repository that reaches a
live host, kept out of every battery so that nothing which replays depends on one. It is the eighth
suite and the last proof before a package is published. ADR-0104.

**A feature now lands as a file, and this was the last unit that could take that decision.** The
installed path is `lib/toopo/string/slugify.ts` and no longer `…/slugify/slugify.ts`; a second file, if
one ever exists, lands in a folder of the same name **beside** the entry rather than around it. What
decided it is that the two layouts are identical while no feature has two files and this one is
strictly better on the day one does — so there was no trade to make. **The folder is a door and not a
feature**: `referenceImplementationOf` filters an implementation's files to `reference.ts`, so nothing
can put anything in that folder until a separate unit opens that filter. The window was closing because
an installed path lives in every user's lockfile, and today there is one. Measured against `tsc` 7.0.2
under all three module resolutions and against four bundlers covering three resolver implementations,
differentially — both layouts side by side, so that a failure of the probe's environment could not read
as a failure of the shape — with *resolved* meaning the helper's value found inside the produced bundle
rather than an exit code. Node's own standard library carries the shape 12 times in the 69 entries of
`lib/`. **One user-visible cost, accepted rather than smoothed:** a file the user has edited is kept
where it is and the new copy written beside it, so they hold two. ADR-0110.

**The site has a visual system, and the contract page is built on it — the page a stranger lands on
from a search, and 99 % of this site at a thousand entries.** Six type sizes and no seventh, one
spacing unit every length is a multiple of by construction, colour roles rather than colours, one
accent, dark by `prefers-color-scheme` with no button and nothing remembered. **The accent means *you
can act on this* or *you are here*, and never a verdict**: this catalogue publishes every mutant its
suite did not catch beside the ones it did, and a colour survives neither `toText` nor `toMarkdown`, so a page
that sorted its own evidence by colour would say what its reading does not. The page is a card — name,
sentence, command, four figures, signature — and then everything, with nothing behind a fold, which is
the shape a differential trial on `date/add@1` and its 50 cases settled. **Two greys and not three**:
the mock-ups' fourth answers 2.64:1 on light paper while carrying the case identifier, and the value
they draw `dim` at answers 4.24:1 on a case a reader has just followed a link to. Both readings are
arithmetic now rather than something somebody remembered to take. ADR-0115, ADR-0116.

**The web font is refused, and coverage is what refused it rather than weight.** Measured on
`@fontsource/ibm-plex-mono@5.3.0`: two weights of the Latin subset is 29 596 B and three is 45 216 B,
against an estimate of ~26 kB. What decides it is that Plex's `latin` range carries U+2191 and U+2193
and **not U+2192** — the arrow between every call and its answer, 157 times across the four pages — and
that `string/slugify@1` alone carries 59 distinct mono code points outside it, 57 outside `latin-ext`
too. Those are what that contract settles cases *about*. The system stack renders them because an
operating system composes fallbacks a page cannot ship. **What the refusal costs is named rather than
smoothed**: `ui-monospace` is a different face on every platform and no reading here covers more than
this machine; what survives is what was specified in units that travel, the case column in `ch` and
the scale in `rem`. ADR-0115.

**A contract page now says what the function is for in real life, and where that text lives was the
decision.** `string/slugify@1` carries four use cases — a call as somebody makes it, and the one thing
to know before relying on it. It is published, so both obvious homes were closed by permanent rule 6
and both were measured rather than reasoned about: a field in `identity` moves its digest from
`855107da…` to `bd256afd…`, and **one comment appended to `contract.ts` moves it to `84403f0c…`**,
because `contractSnapshot` freezes the seven files' digests too. So the field is **standing** — the
mechanism written for *may the registry change its mind about this after publication*, whose own
comment had named this field before it existed. Measured: the eight ledger digests are identical to
the byte with four use cases declared, and `npm run freeze` is green. The page's sentence *nothing here
is part of the contract* stops being an assertion. It carries no identifier, because nothing cites it
and an address on rewritable prose will one day name something else; the warning is a required field,
because that is what a use case is worth reading for. ADR-0118.

**And the page is read in two halves.** Measured at `f05951f`: 3 800 visible words over eight sections
of one weight, of which **2 482 — two thirds of everything under a heading — were the settled cases**.
The complaint was never the length. Above the line: what it does, a form, the jobs it is for — 754
words. Below: the signature, the cases, the properties, the profiles, what a reader can check — 3 262.
**Nothing is folded**, and the mock-up this cut came from proposed folding by group; ADR-0116 settled
that against a differential trial, and the line is written into the record so it does not return
through a later mock-up. `the-rail-of-a-page-names-every-section-of-it-and-only-those` needed no
change, which is what a derived table of contents buys. ADR-0119.

**A domain has a page, and every page now says where in the catalogue you are standing.** The level
between the catalogue and a contract was a 404: `/typescript/string/` is where a reader climbs to from
a search result, and it is the only unit a navigation can be built on at a thousand contracts. Three
pages and not four **on the day ADR-0121 landed** — `array` held one entry, refused before publication,
and a page carrying an empty list answered nothing the refusals page answered less well. **There are
four now**: ADR-0127 gave the refused contract an address, so `/typescript/array/` has something to
list and the tree writes 13 pages plus a 404, measured at `ab2765c` off the emission's own count. **Its
opening sentence is composed and never
written**: the mock-up's hand-written line would have been a fifth statement of what is in a domain,
beside the list under it, the index, the sitemap and each contract's summary, and it is the one a
reader believes. Every term is read off the registry, so a fifth contract lands in that sentence with
nobody editing it. The column is a *sibling* of the rail rather than a part of it, because
`the-rail-of-a-page-names-every-section-of-it-and-only-those` requires every link inside `.rail` to be
a section of the page — and it is placed by the grid rather than reordered, so the document a screen
reader announces is the one a sighted reader sees. ADR-0121.

**The measure was written in characters and reached every face, and the ceiling had never been held
before.** Measured at `81bf9bc` over 688 prose elements, one Range per character grouped by line box:
**255 lines over 75 characters, worst 169**. The rule existed — `body` laid its content out in a 74ch
column — and `.shell` spanned the whole width by declaration with nothing under it re-establishing one.
**The half worth keeping is the other one, and it survives the ceiling's removal**: `ch` is the advance
of `0`, so a container capped in `ch` under-constrains anything set smaller than it, and the
169-character line was small print in a wide box. The measure was therefore declared on the element
that carries the prose, and that declaration is gone — ADR-0134, below. The constant is a measurement
and not arithmetic, and it carries the method's own drift: density moves when the column moves, 1.339
before and 1.393 after, so 1.04 is applied on ADR-0077's rule rather than noted.

**It was re-taken when the columns moved, and ADR-0122 holds that reading rather than this line.**
What is worth carrying here is that the two readings are not the same population: the second sweeps
every element the rule names — `h1, h2, h3, h4, p, li` — over every page of the tree, and groups
characters into line boxes by vertical overlap rather than by a rounded `top`, so a `code` span set
smaller stays on the line a reader sees it on. **The `910` above is not reproducible by it**, it is
four to five times short of what that method counts, and nothing here says which population it was.

**A ceiling belongs to the block and never to the column, and the owner found that on his own screen
before any check here did.** Three container ceilings were in play and the smallest was the one named:
`main` at 45rem, `.shell` at 78rem — which named no question anywhere in this repository — and the
body's own grid track at a *measure*, which is a bound on a line applied to a box. Only the domain and
contract pages carry a `.shell`, so that third one bound the card, the code blocks and the lists of
the other four pages at every width. Measured at `456ee44` over all eleven files of HTML at four
widths: **17.5% of a 2 560px screen on the front page, 38.7% on a contract page**. Each block now says
what it is worth — a card and a code block as wide as their content, a case table one width for every
row — and the layout is derived from the widest of them, `2 * measure + gap`, which resolves within
3px of the 78rem it replaces. After: **46% on a contract page**, and the settled cases render their
157 calls in 223 lines instead of 325. **Three pages did not move at all, and that is the answer**:
every child of them is prose, prose is bounded on the line, and the container was never what bound
them. ADR-0122.

**A wide screen is now filled by a column, and the line did not move.** ADR-0122 named this unit in
its own reopening section — the front page's 19.8% was a page whose every element is prose, which is
evidence that no ceiling made it narrow and not evidence that the page was right. A contract page's
table of contents crosses to the right of the content, the front page gains a column carrying the
three sections it used to queue under the catalogue, and both lists of contracts go two abreast where
there is room. Measured over all eleven pages at 1440, 1920 and 2560, by ADR-0122's own definition of
the share: at 2 560 the front page **19.8% → 48.1%**, a contract page **45.9% → 55.9%**,
`/typescript/string/` **29.6% → 45.8%**. The measure held, which was the thing at risk: **0 of 11 964
prose lines over 75 characters, worst 70**, against 0 of 11 913, worst 70. **Not one word of the site
changed** — the three sections keep their `h2`, so the outline, the Markdown twin and the sitemap are
identical, and the only matter added is four figures derived from the batteries. **The domain page
keeps two columns**, because a third would have carried the four figures its opening sentence already
composes and ADR-0121 composed them precisely so they would not be stated a fifth time. ADR-0123.

**`--the-shortest-line: 45` is the shape to reach for, and it is worth more than the layout it
bought.** The column of secondary matter needed a width, and the stylesheet had declared the answer
for a year without deriving it: *45 to 75 characters is the span a line stays readable across*, of
which only the top was a length. **No number entered that file that was not already argued for in
it.** The same move settled the two-abreast list with no breakpoint at all — `auto-fit` over a floor
of one measure was two columns exactly where the column was two measures wide — so the value the owner
will flip is a length in the palette and never a grid to restructure. **The floor is untouched and that
arithmetic is not**: ADR-0134 took the column's width away, so the list now folds at five widths
instead of one and the floor keeps its value without keeping its reason.

**Three widths in that stylesheet are typed, and the language is why rather than the author.** `var()`
is not allowed in a media query's condition, in any browser. The three-column threshold is the
arithmetic of its own tracks taken on one machine and rounded up; it is written beside that arithmetic
and degrades by squeezing rather than overflowing. **This line read *one width* until ADR-0132, and so
did the comment above that threshold** — both of them saying, of the one condition that carries its
argument, that it was the only one. `52rem` and `64rem` carry no comment at all. All three are on the
list below as the thing nothing keeps.

**Four defects came out of a browser and out of no static check**, which is the third time this
repository has paid for that class. Two rules 13px apart where a list item and the heading inside it
each drew one; and section gaps of 0, 8 and 16 where the system declares one — every instance a
`margin` shorthand on a class silently outranking `h2 + p` on specificity. Measured after: 100 section
headings at 12px and nothing touching.

**A void is matter that is missing and never a ceiling to remove, and that sentence cost two refuted
repairs to reach.** The owner read a contract page at 1440 and saw the centre column half empty. His
three figures were exact and his sentence was not — `main` holds twelve case tables at 905 — and the
measurement that replaces it is worse: at 1440 **the median block of `number/parse@1` reaches 46% of
its column**, 12 of 71 blocks reach 90%, and on a refused contract and the one-contract family pages
**no block reaches 90% at all**. Nothing moved between 1280 and 2560. Both repairs he proposed were
built in a browser and both failed: tightening the column with `fit-content` **breaks the two-abreast
list**, because under an indefinite constraint `repeat(auto-fit, …)` repeats *once* and a track that
asks a list how wide it wants to be is told *one contract*; widening the card moves the void inside it,
which is ADR-0122's own recorded objection one floor down. What filled it instead was the page's own
matter — the card is the column's width and read across, the opening was its sections two abreast where
there was room. **The table of contents was measured for that job and refused**: a sticky rail and a
905px case row cannot share a column, so it would accompany 13.7% of a page instead of all of it. The
measure held at nine widths, 0 of 4 429 lines over 75, worst 69, and a contract page's prose was 447 in
933. **Every clause of that state has since been withdrawn by ADR-0134** — the ceiling, the two-abreast
opening and the column that did not move between 1280 and 2560 — and the card being the column's width
is the one that survives, now at every screen. ADR-0132.

**The divisor did not move, and the record says why instead of leaving it to look like an oversight.**
Re-measured over every file of HTML in the tree, the densest line at the measure was 1.3342 characters
per ch against the 1.393 declared, so the page rendered 69 where it allowed 75 — an 8.6% gap, not the
15% a one-page reading suggested. It could not be spent: at the density re-measured the worst line went
to 72 and the void beside the card *grew* from 353 to 368, and at the density with no margin at all one
line reached 77. **Density is not stationary and a column is two lines wide**, so widening prose to fill
a column widens the column by more than it fills. **The whole of that argument was about a ceiling and
ADR-0134 removed the ceiling**; the divisor still divides, and what it now sizes is a call column and
half a card.

**A page is long in lines, and the line count is the reading this repository had never taken.** The
owner read a contract page, judged *What lands in your project* useless two days after it was proposed,
and asked whether the length is the matter at all or *just the line breaks*. Cutting prose is not
available — 90% of the page is the frozen half of a contract — so the question was answered by
measurement instead. Every earlier reading counted lines to police a ceiling and answered with a worst
and a median; **none asked how many lines a reader is handed.** Measured at `00be46c` over the four
contract pages at 1440, by ADR-0122's own method: `number/parse@1` renders **594 lines of prose and 630
of every kind**, median 56, worst 69, 0 over 75. The removal is worth **9 lines of 594**. At the widest
column the declared 75 allows — measured in a browser rather than projected — it is **572, which is
3.7%**, and at a packing no line-breaker performs, `ceil(characters / 75)` block by block, **511, which
is 14%**. So the wrapping is not what makes the page long, and that is a negative worth as much as a
positive: it says the next unit is not a cut. **The two populations are declared in the record** because
one of them is new here — *prose* is `h1, h2, h3, h4, p, li`, the set the stylesheet bounded, and *every
rendered line* is what a reader scrolls past. They differ by 5 to 7%: a settled case renders as three
`p`s, so the case tables were already inside the measure's own population. **The next unit was not a cut
and was not a wrapping either**: ADR-0134 took the ceiling out instead of widening toward it, and the
same page fell from 580 rendered prose lines at 1440 to 397. The 3.7% is exact for a question that had
a ceiling in it. ADR-0133.

**And what a section costs in height is a row of a grid, never its own height.** The block removed was
**468px on all four pages and stood beside a taller sibling on all four**, so it occupied no height at
all: what the removal buys is whichever row the two-column opening drops when it re-packs. Three pages
lost 676 to 869px; **`string/slugify@1` lost exactly zero**, its rows re-packing without losing one.
That is ADR-0132's void one floor down — the block was not in the way — and it was measured because the
zero looked like a broken probe. **The figure worth more than either the cut or the wrapping is
elsewhere and is not acted on**: by union of vertical extents over `main`, **a quarter of a contract
page is the gap between one block and the next** — 4 161px of 16 461 on `number/parse@1`, stable within
1.7 points across four pages — against 707px for the section and 485px for reaching the declared line
length. The spacing scale is ADR-0115's and this unit was forbidden the layout, so it is written down
rather than spent.

**A width stated in characters and a layout that follows the screen are contradictory, and the owner
chose the screen.** He read the site in an inspector and decided twice, with the measurement in front
of him: no defined size, the size changes with the screen. `h1, h2, h3, h4, p, li { max-width:
var(--measure) }` is the rule that named it. **What the decision actually reached was four times
larger, and nobody had ever read it as the same limit**: `--two-columns` was `2 * --measure + gap` —
the same ceiling stated in characters, one floor up — and it bounded the body's middle track, all
three shell arrangements and the use-case grid. **A limit derived from a limit that is being removed is
an orphan**, and this one had survived three units that each added a consumer to it. The two-abreast
opening ADR-0132 built is gone with it, and the `div` and `section`s that existed only so a grid had
something to place are gone with that.

**Measured at nine widths over all fourteen files of HTML, in a browser, light and dark.** Before, the
tree rendered **4 188 prose lines, median 56, worst 69, at 1280 and at 1440 and at 1600 and at 1920 and
at 2560 and at 3840** — six widths, one reading, because the column was capped and the screen was not.
After, every width answers differently: at 3840 the tree renders **1 471 lines** and the method page
falls from 56 665px of height to **16 698**, its ink from 13.8% of the screen to **98.9%**. **Nothing
breaks**: zero pages scroll sideways and zero blocks overlap at any of the nine widths, and the single
element painted outside the viewport — the copy control at 390 — reads identically before and after and
is older than this unit. **What it costs is the line**: the method page's worst goes from 69 characters
to **663** at 3840 and its median from 57 to 226, and `45 to 75 characters is the span a line stays
readable across` is still declared in the stylesheet, still true, and now enforced by nothing. Whether
that wants a ceiling is the owner's to decide and the figures are in the record. ADR-0134.

**A box on a phone now gives up its content, and the rule that decides it is about the text rather
than about the element.** Four defects, one shape: the install command was cut off on three of the
four published contracts at 390 and on all four at 320, taking the copy control off the screen with
it; four to six code blocks per contract page scrolled sideways, worst **2.11× its own window**, so a
reader saw under half of a signature; every one of the nineteen destinations of two contract pages'
tables of contents landed **25px behind the sticky bar**; and the site introduced itself as `toop`
over `o` on every page below about 479. Measured warm on both sides over 14 pages × 21 widths × 2
themes: **2 541px of hidden command, 197 scrolling blocks, 142 broken wordmarks and 12 pages painting
outside the viewport, all to zero.** Above 736 the geometry does not move at all; below it the cost is
**+0.05% of page length at 390** and a bar shorter at every width.

**What the rule separates is what the argument here had never been tested against.** *A code block
scrolls rather than wraps* was written about a block wider than its content, never about a screen
narrower than a type declaration — so a `pre` now folds where the language allows and scrolls only
where it does not, which keeps the old sentence for the case it was right about. **And repairing the
wordmark made the sticky bar worse before anything made it better**: the bar's height is the menu's
and never the wordmark's, so giving the name its width back took it from the menu, which wrapped one
row further and paid the height straight back — 89.1px to 130.1px at 320, measured, which is why the
menu's own row gap is in that unit. ADR-0135.

**The page a reader arrives at is a door, and the catalogue took an address of its own.** `/` holds the
name, one line and two ways in - the catalogue, and what a contract is - and **no command at all**. The
shape of every command at once stood there as `add domain/function` so that no contract was privileged
on the page that stands for all of them; the constraint was right and the form is a template, which a
reader sees. A command belongs to a contract, so it is on every contract's page and on none of the pages
about the catalogue. The catalogue is at `/catalogue/` with all thirteen of its links; `/` goes on being
written and served, changing role and not existence, and the packaging suite is green on ADR-0125's eight
guards. `/contracts/` was refused because this project already spells the thing `catalogue` in five
places. **What the page does not say is recorded as a cost**: nothing on it is about how this catalogue
is verified, which is what the whole project rests on, and it is one link away in the masthead.
ADR-0140.

**The move broke every link on the catalogue and a rewritten guard is what said so.** Its six links were
`linkTo(page)` - correct at the root, broken one folder down.
`every-page-is-reachable-from-the-front-page` was one hop, which is right for a flat site and false of a
door, and rewriting it as a walk over the page graph reddened ten pages at once. **The walk also keeps a
claim the one-hop form kept by accident**: comparing the front page's hrefs against the list of pages
refused an address that left the site, and a walk that skipped what it could not resolve would have
dropped that silently - so it is now stated in its own right, over every page rather than over one.

**And two defects came out of a browser and out of no static check, in one unit.** `body` is a grid, and
a grid with vertical free space stretches its auto rows into it, so on any page shorter than the window
the masthead grows - **247px instead of 56 at 1440**, growing with the screen because a wider screen
makes a shorter page. Every page of this site had been taller than the window, so nothing had ever been
short enough to show it. Then the door, wrapped in a `.shell`, ran **edge to edge at 320, 390 and 768**:
a shell spans the body's gutters and re-establishes an inset out of its own tracks, and with one child
it has none to re-establish. It has no navigation column, so it has no shell - which is what the three
other pages without one already do. Both found by rendering the emitted tree; the eight suites were green
either side of both.

**A guard's regular expression had been silently narrowed, and a mutant is what said so.** The guard
written for the door refused a command on the front page and stayed green with
`npx toopo add string/slugify` printed on it: a `\b` edited into a source through a shell heredoc lands
as a literal backspace, `0x08`. The file compiles, the guard collects, it runs green for ever, and it
refuses less than it says. Swept over the tracked tree: **three, in one file, two of them committed** -
`/\bof\b|\//` in `every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown` had
been refusing a slash and nothing else for the whole of its life. Repaired and seen red with ` of ` in a
figure's own rendering. **What found it was the mutant and not the sweep**, and the sweep exists only
because a perturbation failed to redden something.

**Two figures this repository has published cannot be rebuilt, and both were found by trying.**
ADR-0133's prose-line counts reproduce to neither of the two populations its own table declares — 601
with navigation, 580 without, against 585 — while every one of its eight heights reproduces **to the
pixel** and its nine-line delta exactly, so the rendering agrees and the counting does not. And the
layout debt's *38 geometry declarations* counts three `@media` conditions as declarations. Neither is
corrected, both being stamped; what replaces them is that the new counts carry the rule they were taken
by, which is the thing neither of those two had.

**A guard of the site suite had been reddened by nothing since it was written, and the battery said so
to nobody.** `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` was reported
unaccounted for by `npm run battery site` at `81bf9bc` and at every commit before it — measured both
ways, by checking the base out and running the battery there. W-24 looks as though it covers it,
because it replaces the inline stylesheet with a link; it does not, because **with no style element the
guard finds no palette, its loop runs zero times and it passes**. A guard passing vacuously, in the one
folder whose subject is that a page can be read. W-24b closes it. **The finding to carry was that no
battery was replayed in CI**, so a battery's disagreement with itself waited for somebody to run it -
which is what ADR-0146 closed, on the push that touches the folder and on everything before a
publication.

**And the catalogue's own prose is parsed by the function that already parsed the method page's.**
ADR-0026 scoped that guard to one page and named the event that would reopen it — a second page taking
prose written for a reader of source. 220 literal backticks were reaching readers across the four
contract pages, 110 of them on `string/slugify@1` beside 51 `code` elements produced correctly on the
same page. What settled the register ADR-0026 said nothing mechanical could settle is that **every one
of the 220 is paired**, so there is nothing to guess at. ADR-0117.

**The catalogue is six contracts** — `number/parse@1`, `date/add@1`, `array/group-by@1`,
`string/levenshtein@1`, `string/slugify@1`, `number/round@1`. The sixth is the first published after
the founding four, the first whose call takes a number, and the first whose reference was caught
annotating itself with the contract's own types. The third is a format prototype that will not be published,
because ES2024 shipped `Map.groupBy` and it answers what the contract specifies; the refusal and the
rule it establishes are recorded. The fourth is the first whose properties are strong by nature — the
axioms of a metric — and its table is a third the size of the first's as a result. The fifth is the
first with no oracle of any kind: measured over fifty-seven samples, the four most used slug libraries
agree on seven, so nothing about its answers is true and every one of them has to be argued for.

**The seventh is decided and not written, and the search that decided it is a record rather than a
conversation.** It is `object/deep-equal`, and what carried it is that the ecosystem's disagreement is
a wrong answer rather than a taste: `Object.keys` of a `Set` is `[]`, so an implementation walking own
properties sees two empty objects, and `fast-deep-equal@3.1.3` and `dequal/lite` both answer `true`
for `new Set([1])` against `new Set([2])` — while the entry point you are told to use for collections
answers `false` for a `Set` of objects against its own `structuredClone`. **Ten refused candidates are
written down with the measurement that refused each**, because the research that chose the sixth cost
a session and survives nowhere: `string/truncate` is refused not for its four definitions of length —
a question `string/levenshtein@1` had already settled — but because with code points chosen the whole
function is `Array.from(text).slice(0, limit).join('')`, one expression over two built-ins.
**Two things bind the writing unit**: the cycle-detecting walk is written first and is a stopping
condition, so if it cannot hold `Map`, `Set`, typed arrays, `Error` and `ArrayBuffer` under this
repository's bars the decision is wrong and the unit says so; and `reference.ts` waits, because the
licence banner freezes with the contract, and the copyright is out of it since ADR-0159. ADR-0158.

**The file that lands in somebody else's project no longer says it belongs to somebody else.** The
front page promises *the source lands in your repository and it is yours* and the second line of the
file that lands said `Copyright (c) 2026 <the author>`; MIT-0 required nothing of the reader, but
nobody reads a licence and everybody reads the first two lines of what they have just pasted. The
five published contracts keep theirs — their `reference.ts` is frozen by a digest other people's
lockfiles hold — so **two banner forms are permanent**, and the discriminator is a date, which
nothing in this repository's data derives. It is therefore a required declaration on
`ContractSource`, so a seventh contract that does not say which form it carries **does not compile**,
and the argument for setting aside `licence.ts`'s refusal of a hand-written perimeter is written
beside that refusal rather than only in the record: a wrong list of *paths* mislicenses a file, and a
wrong banner form cannot, because both forms are MIT-0 and a byte-for-byte guard already reads them.
**`array/group-by@1` moves to the new form today**, because the ledger binds it nothing — measured,
the ledger is byte-identical across the change — which is what gives the second branch an instance
instead of leaving it a branch nothing reaches. What it does not buy is on the list below: `README.md`
goes on showing a copyright line, correctly, because it demonstrates a published contract. ADR-0159.

**Project name: Toopo.** CLI command `toopo`, lockfile `toopo.lock`.

**What decides the next unit** is the list of what is still open, below, with what each entry costs.

## Where the reasoning lives

**A decision that has been taken is a record in `docs/decisions/`**, in MADR format, addressed by
number and cited as `ADR-0007` — never as a path. ADR-0001 settles the format, the two fields it adds
and the one section, and nine guards resolve what a record names in both directions. There is no index
here: the directory listing is the index, because the filenames carry the titles, and a second
statement of what the folder already says is one that drifts.

**A record exists for what will not fit beside the line.** Where the argument does fit — where the
reason a constant holds the value it holds is a comment on that constant — a record is an address for
something that did not need addressing, and the cost is not the file: it is that two places then carry
one piece of reasoning, and they wait to diverge. The move to `1.0.1` is where this was applied rather
than merely stated: the whole of it is why one string reads what it reads, ADR-0109 had already argued
the release, and the argument now sits in `publication.ts` above the line it explains, with no record
of its own.

**What happened and when is `git log`.** The commit messages carry the measurements at length. This
file carried a second, shorter copy of them for a year; ADR-0062 is why it no longer does.

**What is below is what a session needs before it writes a line**: what is still open, the rules of
this stage, the permanent rules, the conventions, and the verification discipline.

## What the repository declares and nothing keeps

One form, found four times in a single sweep and certain to be found again: **a thing that behaves
like a rule, with nothing making it hold.** The vocabulary for it already exists — `one-directional`
— and the list is kept here rather than scattered, because it is what the publishing tool has to
close. A published version is frozen for life, so a declaration that is decorative on the day a
version is published is decorative for ever.

**This heading read ` — closes before the launch` until ADR-0153, and the deadline in it passed
rather than being met.** There is no event left to wait for: the manifest declares a version npm
holds, the origin serves the catalogue and the client installs from it. So what is below is the
maintenance backlog of a running product and never a list of things blocking a release — the same
entries, read at a different urgency, in an order that still says nothing about which one is taken
next. **What replaces the deadline is no deadline**, and that is the decision rather than an
omission: ADR-0017's rule is that an address may not render the data it addresses, and a heading is
an address. A condition written into one expires with nothing noticing, which is what happened here,
in the first words of the section every session reads before it writes a line. Measured at `f776a43`
over the tracked tree: **nineteen citations of this list, in thirteen records and two sources, and
every one of them names what the list is; not one names when it closes.** The half that was doing
the work was never the conditional half. ADR-0153.

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
3. **An entry can be false without being stale, and that is the failure neither half above catches.**
   The two rules are written against *drift* — the code moves and the list does not. An entry written
   from an assumption about what the code holds, rather than from a reading of it, is wrong on the day
   it is published and stays exactly as wrong: nothing about it looks old, its mechanism is still
   unbuilt, and every remedy here is aimed at the version of it that used to be true. The alias entry
   above asked for a field that had existed since the first contract was written, and it was found by
   somebody setting out to build the field. **So an entry that describes what the code does not have
   names where it looked**, the way a count names its population — because the cheapest way to be wrong
   here is to describe a schema nobody opened. ADR-0128.

**Entries that closed are recorded with the mechanism that closed them, in that mechanism's own
decision record.** They are a list and not a sentence, and that is a repair rather than a layout:
this paragraph was a chain of nine clauses joined by semicolons, one unit having added each, and it
carried five hands at `2385fc2` — the joint-highest in the repository. A closure is one line, so
adding one cannot lengthen anything a reader has already read. ADR-0112.

- two closed by stage 1 of the validation pipeline — ADR-0005;
- three closed by the two-phase write — ADR-0039;
- the class of a declared address nobody resolved — ADR-0060;
- permanent rule 6, which was never on this list — ADR-0093;
- the three about what git holds, a citation that resolves, an address no commit carries and a
  checkout nothing leaves behind — ADR-0095, all three together because they are one walk over the
  same graph;
- the playground reading what a reader types — ADR-0096;
- a replay that could not finish — ADR-0102, which found a second entry for this list on its way out
  and put it there;
- the address a host serves — ADR-0103;
- an archive that really installs a feature — ADR-0104, on the event it had named, leaving two
  entries behind it: one for the third guard it did not bring back, one for the revision it reports
  without resolving;
- the address the emitted tree never loses — ADR-0125, over the pages a listing names, leaving behind
  it the addresses no listing names and the chain of runs the reading is inductive over.
- a battery's disagreement with itself, read on every push and before every publication — ADR-0146,
  leaving behind it the change no cheap selection answers for;
- the declaration of what an answer *is*, which no deployment read — ADR-0137, closed where the cache
  policy closed and for the reason a search gave it: the document every query fetches was the one
  paying for it;
- the end-to-end reading of what would be published against what git holds — ADR-0148, leaving behind
  it a witness that rests on three code points the catalogue happens to spell, and the half of a
  fourth guard that its own name is about;
- a guard that could not see its own population shrink — ADR-0152, leaving behind it a guard total
  over populations and never over files, and the reading half of the entry it closed;
- the allowance written for a word a query omits being spent on a word it adds — ADR-0154, leaving
  behind it the point at which a second word starts to be evidence.

**The address a host serves is where rule 2 above was broken, by the commit that built the
mechanism.** The entry
was closed in fact by `45f702f`, the move to Pages, which changed eight files and none of them this
one — so for three commits this list carried a live entry about a redirect that no longer happened,
and the paragraph above it described the host that had been left behind. Nobody was misled only
because nobody read it in that window. **A mechanism and its entry are one event and the rule already
said so**; what this instance adds is that the sweep is owed even when the mechanism looks like a
one-field configuration change, because it is the *entry* that names the fact, not the diff.

**The playground reading what a reader types is the only entry this list ever carried that no guard
could have caught**, because it was a decision taken in conversation and written nowhere — the repository held no half for the code to
disagree with. It is also the entry that paid for itself twice over on the way out: closing it found
*two* published sentences of this repository false, both in the record that had argued the opposite
position, and both of the class the entry was about. One clause asserted that a raw text field could
not express a lone surrogate, which a browser refuted. The other was worse and was invisible to every
reader for a year — the two rows ADR-0028 printed to *demonstrate* that a no-break space and an
ordinary space carry opposite answers were **identical, byte for byte**, having lost the no-break space
somewhere they were written. A block whose entire purpose was to show two things differing showed the
same string twice, with two different reasons beside it, and nothing could have caught that either.

**The finding this section has to keep is the one above, because it is about the section rather than
about any entry.** *A published version is frozen for life* is the biggest `one-directional`
declaration this repository has ever carried — it is the whole security argument, every lockfile in the
world would hold the digest it moved, and it is what the product is sold on. It has been in this file
since the first commit, 367 commits before `d75ac8f`. This list has existed for 271 of them, for exactly
this class of defect, and it never named it. Ten entries at that commit, none of them the one that
mattered most.

So the rule the list adds to itself is not another entry. **A list that believes itself exhaustive is
more dangerous than no list**, because it is read as coverage: every session that opened this file saw
ten entries and a section explaining what the form is, and concluded that the form had been swept for.
Nothing here says how many instances exist, and nothing can. What a reader may take from this section is
that each entry it names is real; that it is complete is a claim no version of it has ever been entitled
to make, and this paragraph is the correction that stays.

**It happened a second time, on the same declaration, and that is what makes the paragraph above a rule
rather than an apology.** ADR-0093 closed *a published version is frozen for life* and this section
recorded it as the biggest instance the list had ever missed. What ADR-0093 froze was the seven files a
contract declares. Four of those seven import `packages/catalogue/every-contract.ts`, no digest covered
it, and the verification of a frozen contract could therefore be emptied with no address moving — which
is the same declaration, unkept, one level in. Twelve commits and one whole record after the miss was
written up. **The list did not fail to be exhaustive here; the closure did.** A mechanism that closes an
entry is itself a declaration, and nothing swept it — so what this instance adds is that *closing* an
entry is the moment to ask what the closure does not reach, and to write that down beside it before the
entry is struck off.

**And the same shape arrived one level down, in a closure criterion rather than in this list.** Taking
the personal address out of the history was to be closed by *zero occurrences over the 374 commits* —
374 being what `git rev-list --count HEAD` answered. The rewrite had to reach **391**: three
`evidence/*` tags retain seventeen commits `main` does not reach, every one of them carrying the
address, and every one of them published by the first `push --tags`. The criterion would have gone
green over a branch
while the defect left by another door. What made 374 wrong is not a miscount but a population read off
whichever ref somebody was standing on, so: **a count that bounds a defect names the population it
swept**, and `--all` is the only spelling of *this repository* that a tag cannot fall out of.

**One entry of this list is not of this list's class, and it is first because of that.** Every other
entry says *nothing keeps this rule*. This one says **the mechanism does the opposite of what the
record declares**, which is a worse thing and has never been named here before.

- **That an alias is not frozen with the major.** ADR-0023 decides it in as many words — *nobody links
  to an alias, no answer cites one, and correcting one breaks nobody's code; being wrong about an
  alias costs a revision* and not a major. `searchAliases` is a field of `identity`,
  `contractSnapshot` freezes `identity` whole, and since ADR-0106 the four contracts are bound at
  `d3a5166`. Measured at `f05951f`: adding one alias to `string/slugify@1` moves its contract digest
  from `855107da…` to `5fe0ecfa…`, which `every-published-binding-still-hashes-to-what-it-was-published-as`
  refuses. **So the cheapest of the three contributions this project invites is the one that cannot be
  accepted**, and a reader of ADR-0023 leaves believing they can make it.

  **It was harmless for the whole of this repository's private life and became live at a publication**,
  which is why no sweep found it: nothing was anchored, so nothing could be broken. It is the same
  event as the two ADR-0093 misses recorded above, arriving on a record that had *argued* the field was
  unfrozen rather than on one that had forgotten to say so.

  **ADR-0118 built the mechanism and deliberately did not use it here.** A field of the standing is of
  a contract and outside the digest, which is exactly what ADR-0023 describes; moving `searchAliases`
  there would move four published digests, which is the change permanent rule 6 forbids. **The
  population is measured rather than remembered: at `62bdcc2` the six contracts declare 13, 13, 12,
  12, 12 and 10 aliases — 72 in all, of which the 60 on the five published contracts are frozen.**
  This sentence read *the eight aliases of the four published contracts* until ADR-0155 went and
  counted: *four* was true on the day it was written and *eight* reproduces under no rule this
  repository can state. What would close it is not a
  guard: it is a way for the registry to bind a *second* contract digest under one address — a
  revision, which is the word ADR-0023 already uses and which nothing implements. Priced as a unit of
  the publishing tool and not built. What is done instead is that both places a reader meets the claim
  now say it is not kept: the head of ADR-0023, and this entry.

  **Half of it closed, and the half that closed is the one ADR-0023 invites.** ADR-0155 gives the
  registry `alsoFoundBy`, a standing field carrying a phrase learned after a contract's aliases were
  frozen, so *here is a phrase you are missing* is a contribution the catalogue can accept on a
  published contract — measured, the six digests are identical to the byte with one declared.
  **Adding is not unfreezing**, and the entry is unchanged for everything else: correcting a declared
  alias still reddens `every-published-binding-still-hashes-to-what-it-was-published-as`, and removing
  one still cannot be done at all. The revision is still what would close it.

  **What the open half now costs is worse than it was, and that is worth reading twice.** Before
  ADR-0155 a lying alias was unfixable and so was everything else, so the entry read as one debt. Now
  the registry can add a phrase and cannot withdraw one, which means the only repair available for
  `remove accents from string` — the liar ADR-0023 removed before publication — would be to add a
  second phrase beside it. **A field that grows and never shrinks is a field whose defects
  accumulate**, and nothing here bounds that. It is the same closure, priced against a population
  that is now unbounded rather than eight.

**A second entry is not of this list's class either, and it is the same shape one floor down: a debt
this repository recorded, in a file it may no longer edit, naming two repairs it may no longer make.**

- **That the divergence debt `contractAnatomy` records can ever be paid.** It cannot, by either of the
  two symptoms it names, and the day it became unpayable is the day the catalogue was published.
  `packages/catalogue/every-contract.ts` calls it *one debt with two symptoms* — a missing
  `relationToTheLanguage`, and a missing divergence replay — on `date/add@1` and `number/parse@1`.
  Measured at `ee2d1c1`: the field is inside `identity` and moves `date/add@1` from `94c5acc7…` to
  `043afd7d…`; the replay is a file, a declared file enters `harness`, and `harness` is inside the
  snapshot, so declaring `language.test.ts` moves `date/add@1` to `ed7f8eeb…` and `number/parse@1`
  from `d5071a58…` to `c8ca3819…`. Both are permanent rule 6 firing correctly.

  **And the sentence describing the debt is frozen with the contracts it describes.**
  `every-contract.ts` is one of `THE_SHARED_FILES`, so a byte in it moves every contract digest at
  once — measured, all six. What saves it from being false is that it is stamped, at
  `THE_ANATOMY_WAS_MEASURED_AT`; what nothing can do is correct it. Today's reading of the field is
  **four of six** where the frozen sentence says three of five, and the set of contracts still owing
  it has not moved.

  **The population is the four founding contracts, and it will not grow.** `number/round@1` carries
  its `language.test.ts` because it declared it *before* it was published, and every contract
  published after it can do the same — so the window shut once, on the day of the first publication,
  rather than closing a little further with each contract. That is what makes this an entry to read
  and not one to act on.

  **What it costs is stated rather than smoothed: two published contracts, two levels of
  verifiability, for a reason of calendar.** An auditor fetching the snapshot of `number/round@1`
  receives a replay of what it claims about the language; one fetching `date/add@1` receives seven
  files and no replay.

  **What is done instead is the half that was reachable.** ADR-0150 puts the re-examination in the
  standing, where no digest moves, so the catalogue can at least say it looked — and the rule
  `array/group-by@1` established stops being one whose only expressible outcome is the rare one.
  What that does not buy is the executable replay, which is blocked on a runtime rather than on a
  decision: the matrix is `['22.18.0', '24']`, neither has Temporal, and a replay following
  `array/group-by@1`'s own rule — *a runtime without the function fails loudly instead of skipping* —
  reddens both legs today. It reopens the day the matrix reaches Node 26, and it will have to live
  outside the frozen folder. ADR-0150.

**Still open, and what each one now costs.**

- **That a contract's prose is true of the contract's own behaviour.** A case is data and a guard
  reads it; a rationale is prose beside that data and nothing reads it at all. `object/deep-equal@1`
  published *An implementation that memoises the pairs a failed candidate tried answers `true`* about
  two rows on which such an implementation answers `false` - measured at `3ec621c` by injecting the
  defect into the contract's own reference and watching nothing redden.

  **It is not the class of a stale sentence.** It was false on the day it was written, it passed a
  review by the two people who most knew the danger, and every check this repository holds was green
  through it: the rows are correct rows, so `every-case-is-justified` sees a rationale, the suite sees
  the right answers, and the freeze sees a digest that does not move.

  **Where this looked**: `serialise.ts`'s reading of a case, which carries `rationale` as a string and
  asks nothing of it; `field-map.ts`, where `caseTables[].cases[].rationale` is `documentary` - the
  schema's own vocabulary saying nothing reads it; and `against-the-catalogue.test.ts`, whose guards
  over the catalogue's prose are about presence and about stamps.

  **The population is every sentence of prose inside a published contract**, which is every
  `rationale`, every group note, every `reason` of a universal property and every `purpose` of a
  table - and the failure is silent by construction, because a rationale explaining a correct answer
  is green everywhere. **The only path that has ever found one is a replay**, and a replay finds it
  only where somebody wrote a cell aimed at the very defect the sentence names.

  **What would close it is not a guard over prose** - three entries here already price that and refuse
  it. What it needs is the discipline the finding produced: a rationale claiming *an implementation
  that does X answers Y* is a claim a cell can be written for, and the cell belongs in the same unit as
  the sentence. That is a convention with nothing under it, which is what this list is for. **What is
  cheap and is done instead** is `correctionsToFrozenProse`, which does not close the entry: it lets
  the catalogue say a sentence is wrong after the fact, and says nothing about finding the next one.
  ADR-0161.

- **That a cell's verdict is the verdict of a mutant that ran.** `runSuite` spawns vitest with
  `stdio: 'pipe'` and declares no `maxBuffer`, so node's default of **1 048 576 bytes** applies. A red
  run that prints more than that kills the child before vitest writes its JSON report;
  `reportedFiles()` returns `null`, `failedGuards` is empty, and `verdictOf` answers
  **`killed-by-typecheck`** — a mutant that ran and was caught, reported as one that did not compile.
  **`assertWholeSuiteRan` cannot see it**, because it returns early on `testsSeen === null`, which is
  exactly the value that path produces.

  **It is measured and not hypothetical.** `a-contract-not-yet-published-carries-the-current-banner`
  held `ContractSource` values in its expectation and a `ContractSource` carries `module` — the
  contract's whole namespace — so its red run printed **1 177 066 bytes**, 12% over the buffer. `I-69`
  read `killed-by-typecheck` on two consecutive replays. Reporting addresses instead took the same red
  run to **7 649 bytes**, a factor of 154, and the cell reads `killed`. The guard is repaired; the path
  that mis-verdicted it is not.

  **The population is every guard whose failure diff can cross that buffer**, which is every guard
  holding a rich value in an expectation rather than a rendering of one — and nothing bounds it,
  because the size is a property of the data a guard happens to hold. The failure is silent by
  construction: the cell disagrees, the battery names it, and what it names is the wrong cause.

  **Where this looked**: `runSuite` and `verdictOf` in `mutation/run.ts`, `assertWholeSuiteRan` beside
  them, and `reportedFiles()`'s `catch` returning `null` for a report that was never written as well as
  for one that cannot be parsed.

  What would close it is one line — `maxBuffer` raised to what `determinism.test.ts` already uses,
  `1 << 28` — and the price is that **it changes what every battery measures**: any cell currently
  reading `killed-by-typecheck` through this path would start reading its true verdict, so it wants a
  full `npm run mutation` to say what moves rather than a line slipped into a unit about a licence
  header. Priced as its own unit and not taken. ADR-0159.

- **That the banner a reader is shown is the banner a reader would receive.** ADR-0159 made that
  derived for `LICENSE`: the example must be of `THE_CURRENT_BANNER`, so the day a form is superseded
  `the-licence-file-shows-the-banner-a-reader-would-receive` reddens by itself. **The same guard
  cannot be written for `README.md`**, and the reason is not effort: the page demonstrates an
  *install*, `the-header-the-readme-shows-is-the-one-the-installer-writes` holds it to the real header
  of the contract it demonstrates, and the only contract carrying the current form is
  `array/group-by@1`, which is refused and which nobody can install. A front page demonstrating an
  uninstallable contract would trade one wrong lesson for a worse one.

  **So the surface a stranger reads first goes on showing a copyright line**, correctly, on a file
  whose header is frozen — and the lesson it teaches about the file a reader is about to receive is
  the one this repository has just stopped being true. It is not a drift: `string/slugify@1` really
  carries that header and always will.

  **The population is every surface that shows an example of an installed file**, which is `LICENSE`
  and `README.md` today, and one of the two is kept. What would close it is the demonstration moving
  to a contract published after ADR-0159 — which needs a seventh contract to exist and to be
  demonstrated, and neither is forced by anything. **Where this looked**: `mutation/readme.test.ts`'s
  own guard, `THE_SUITES[DEMONSTRATED]`, and the banner declarations of all six catalogue entries.
  ADR-0159.

- **That a second word of a query is one the contract has any business answering.** The entry this
  replaces was about a word the query *adds* being free, and it is closed: a query that sets a word
  aside now carries more than one word of the field it names, so a contract cannot be reached through
  a single word. What is not closed is where that line was drawn. **Two words the reader carried out
  of one field are two things the contract chose and the query spelled, and no reading here separates
  a second word that belongs from a second word that does not** — `edit distance zzq` answers
  `string/levenshtein@1`, deliberately.

  **The population is every query carrying two words of one field and something the catalogue cannot
  place**, and nothing keeps it. It is not the closed entry read again at a higher number: that one
  was about an allowance being spent on the wrong thing, and this is about the point at which the
  catalogue's own evidence starts. **No instance is recorded**, which is the honest state — the twelve
  requests that motivated ADR-0154 are all one-word, and a two-word one has not been met.

  **What would close it is a way to read what a contract is *not* for**, which the catalogue publishes
  and cannot use: `identity.inputDomain` says in as many words that `number/parse@1` is *not a
  locale-aware parser*, it is prose, it is inside the frozen half of five published contracts, and
  ADR-0128 is why it is not restated as a field. So the closure is the same one three entries here
  already name — something that reads this repository's own strings — and this is the first of them
  whose subject is a *contract's* prose rather than a source's or a record's. Priced and not taken.
  ADR-0154.

- **That a module a browser loads is one this repository's guards can see.** ADR-0156 takes the
  argument out of every module of `THE_BROWSER_GRAPH` and keeps the removal with four guards whose
  population is that list. The list is a declaration, and its keeper —
  `every-import-a-browser-module-keeps-is-a-module-the-site-writes` — **cannot see an `await import`**:
  it matches `from '...'` and a dynamic import carries no `from`, which is how it lost the playground's
  four edges in silence the day `start.ts` was written to defer them.

  **So a tenth module arriving through a dynamic import is served with its argument still in it and
  with none of the four guards looking at it**, and nothing reports either half. The failure is quiet
  by construction: the page works, the module works, and what is wrong is that a file a reader
  downloads left the population of every guard that has an opinion about it.

  **Where this looked**, because an entry describing what the code does not have names it: the guard
  itself, which already carries a comment saying it reads both spellings and was written after that
  hole was found; `THE_BROWSER_GRAPH` and `LOADED_BEFORE_A_READER_ACTS` in `packages/site/browser.ts`;
  and `packages/site/served-modules.test.ts`, whose four guards read the first of those two.

  **The population is one declaration and the guards that read it**, which is four today and grows with
  each guard written over the served modules. What would close it is a walk that follows what a page
  really fetches rather than what a list says — which is the emitted tree read as a graph, priced
  nowhere and not taken here. What is cheap and is done instead is that the guards derive their
  population from the declaration rather than restating it, so the day the declaration is repaired they
  are repaired with it. ADR-0156.

- **That the repair a record prescribes is one somebody can carry out.** ADR-0035 decides what a
  search may answer, and it names the repair for the case it cannot: *a query only a description could
  have answered is a **missing alias**, and the repair belongs in `identity.searchAliases`, where it is
  frozen, reviewed and served.* `contractSnapshot` freezes `identity` whole and every published contract of the
  contracts are published, so **that repair is available on `array/group-by@1` and on nothing else** —
  and `array/group-by@1` is the contract the catalogue refused. A prescription no published contract
  can follow is not a prescription.

  **It is the alias entry above arriving one level up, and that is why it is a separate entry rather
  than a clause of it.** That one says the *mechanism* contradicts ADR-0023. This one says a *second*
  record tells a reader to do something the mechanism forbids, and the two records were written
  eighteen apart by somebody who knew about the freeze in between. So the population is not
  `searchAliases`: it is **every repair any record prescribes**, and nothing resolves a prescription
  against what the freeze allows. `confirmationFaults` resolves the guards a record names and
  `citationFaults` resolves the records a file names; neither reads a sentence telling somebody what to
  edit.

  **It is measured rather than hypothetical, and the measurement is what made it visible.** ADR-0136
  repaired the matching rule and left four descriptions of these five functions answering nothing —
  `typo tolerance`, `spelling suggestion`, `date maths`, `validate a numeric input`. Every one of them
  is ADR-0035's own diagnosis.

  **They stopped being unfixable at ADR-0155 and they are not fixed**, and the two are worth keeping
  apart. `alsoFoundBy` is a standing field, so the phrase can be declared on a published contract with
  no digest moving — the prescription is carryable now, which is what this entry asked for. What it is
  not is carried out: each of the four needs an alias review of its own, and **one of them probably
  fails it**. Somebody typing `spelling suggestion` would be handed an edit-distance function, which
  is the shape of `remove accents from string` on `string/slugify@1` — the liar ADR-0023 removed
  because the result did not keep the promise. Making four judgements inside a unit whose subject was
  the mechanism is the move this list exists to refuse, so they are named here as **reachable and not
  taken** rather than struck off. ADR-0155.

  **A fifth instance was a family rather than a phrase, it was on the contract this catalogue is most
  asked for, and it is closed.** `number/parse@1` declares `int` and not `integer`, `answers` lets a
  query shorten a word and never extend one, so `integer` reached nothing. Measured at `643bf7e` over
  eight ordinary ways of asking for that function: written with `integer`, **five were silent before
  ADR-0154 and all eight were after**; written with `int`, **nought of the eight are silent**. It was
  separated from ADR-0154's own costs deliberately — that record silences four requests this catalogue
  could have answered and this was not one of them, the floor having moved three of these eight and
  *revealed* the other five. **`string to integer` is declared now**, as the first learned term this
  registry holds, and re-measured at `91b7314` the eight `integer` forms all answer `number/parse@1`
  first. They are in the corpus, so the claim is a guard rather than a reading. ADR-0154, ADR-0155.

  **What is cheap and is done instead is that both records now say so** — the head of ADR-0035, and
  this entry. What would close it is the validation stage reading this repository's own strings, named
  by several entries of this list already, already priced and already refused as a lint over prose —
  and this is the first of them whose subject is a *record* rather than a source, which is a widening
  of that stage rather than one more customer for it. ADR-0136.

- **That every phrase a contract is found by has been read against what the contract does.** ADR-0023's
  alias review happens at publication: somebody reads each phrase against the contract's own
  description and asks whether it promises something the contract refuses to do, and it caught eight
  that did. A learned term arrives at a moment **nothing marks** — no publication, no digest, no
  ceremony — so there is no occasion at which that review runs, and the field is where the cheapest
  contribution this project invites now lands.

  **No guard can stand in for it and this is not a gap somebody could close by writing one.**
  `search.test.ts` has said since it was written that `every-declared-alias-finds-its-own-contract-first`
  *reviews the search and never the aliases* — an alias is in the index, so it retrieves the contract
  that declares it by construction, and a phrase promising something the contract refuses passes as
  comfortably as a true one. That sentence is now true of a wider population by exactly one field.

  **Where this looked**, because an entry describing what the code does not have names it: the three
  guards ADR-0155 added, `identity.searchAliases`'s own review in ADR-0023, and `field-map.ts`, where
  `alsoFoundBy[].term` is `executable` and the two sentences beside it are `documentary` — which is the
  classification saying in the schema's own vocabulary that nothing reads them.

  **The population is every learned term the catalogue holds, which is one**, and it grows with each
  contribution accepted. What is done rather than declared is the half that is computable:
  `a-learned-term-is-one-the-contract-was-not-already-found-by` refuses a term the contract was already
  found by, and `a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare` refuses one on a
  contract whose `identity` is still open — so the cost is confined to where it is unavoidable rather
  than being a shorter route past a review that was on offer. **What would close it is a convention with
  a mechanism under it**: the next publication's alias review sweeping the learned terms of every
  contract as well as the frozen ones, which needs something marking when each was last read — and that
  is the validation stage reading this repository's own strings, which other entries here already
  name, already price and already refuse as a lint over prose. ADR-0155.

- **That a name the catalogue freezes is one a reader can ask for.** `ServedIndexEntry` carries the
  address, the summary, the aliases, the learned terms, the domain, whether it is installable and the
  export names — and `contract-index` is the only document a search reads. **Every other address the
  catalogue declares is invisible to it.** `small-integers` is `benchmarks.profiles[0].name` of
  `number/parse@1`, it is inside the frozen half, it is rendered on that contract's page, and
  `toopo search small-integers` answers nothing.

  **Measured at `91b7314`, by the rule that a name is counted once however many contracts declare it,
  over the six serialised records, each asked as its own words**:

  | what the catalogue declares | total | distinct | answered |
  | --- | --- | --- | --- |
  | settled case | 218 | 217 | 9 |
  | case group | 55 | 53 | 2 |
  | benchmark profile | 32 | 31 | 3 |
  | universal property | 24 | 4 | 0 |
  | own declaration | 22 | 22 | 0 |
  | profile class | 21 | 19 | 1 |
  | case table | 8 | 2 | 0 |
  | **all seven** | **380** | **348** | **15** |

  **The fifteen are coincidence and not coverage**, which is why the column is there rather than a
  round zero: a case identifier answers when its words happen to be words some contract's name or
  alias already carries, so what is answered is the *word* and never the address. Distinct rather than
  total, because two contracts naming a group the same way is one thing a reader can ask for.

  **It is true whether or not anything else on this list is done**, and it is not this list's usual
  class: nothing is unkept, something is unserved. **It is not taken here**, and the reason is one
  entry away — `benchmarks.profiles[].name` is on this list precisely because *no guard reads a
  declared name against what it describes*, so serving those names would put 348 addresses into the
  one document every query fetches on the strength of a field nothing verifies. What it would cost is
  measurable and is not measured: `contract-index` is 3 586 canonical bytes today, and the population
  above is larger than everything now in it. Priced as its own unit and not taken. ADR-0155.

- **That a comment naming a guard is naming one that exists.** A record may not: `confirmationFaults`
  resolves every pair a `confirmed-by` declares against the guards its suite collects, and
  `citationFaults` resolves the other direction. **A comment is resolved by nothing.** So citing a guard
  in a record is an act of *verification* and citing one in a comment is an assertion nothing holds —
  and the two look identical to a reader, because both are an identifier in backticks beside a sentence
  saying what it keeps.

  **It is not hypothetical.** `packages/site/catalogue.ts` published *what keeps them from disagreeing is
  that `a-domain-page-lists-every-contract-the-index-files-under-it` compares the two sides* for three
  units, and no suite collected any such guard. It came out when ADR-0126 put the name in a
  `confirmed-by`, where the meta suite does look. The guard is written now; the class is this entry.

  **The population is measured and it is not the defect count.** At `948678d`, over every tracked `.ts`,
  `.md` and `.yml`, matching a backticked kebab-case token of four words or more: 279 tokens, of which
  226 are guards some suite collects, and **50 of those are named in a comment and cited by no record**.
  That is the set where the mechanism above is not running. The remaining 53 are tokens no suite
  collects, and **counting them as defects would be false**: read one by one they are mostly case
  identifiers, `NEEDS` identifiers, a lifecycle state, sample names and one npm package — the form
  cannot tell a guard's address from a case's, because ADR-0017 gives them the same shape on purpose.

  **What would close it is not a wider sweep.** A guard over comments would have to decide which
  kebab-case token is meant as a guard, which is the judgement the shape deliberately does not carry. The
  executable form is the one three entries here already name — a validation stage reading this
  repository's own strings — and what it would need beyond those is a way for a comment to *declare* that
  it is citing a guard, which is a convention nothing here has. Priced and not taken. **What is cheap and
  is done instead is the convention**: a comment that says a guard keeps something is worth a record's
  `confirmed-by`, and the record is where the citation is resolved. ADR-0126.

- **That an address written as a bare literal is one the catalogue cannot publish.** ADR-0142 moved
  every fixture of this repository behind a reserved domain prefix and holds it there with two guards,
  and the guards read a **declaration** — the exports of `packages/registry/imagined-addresses.ts` — so
  an address added there enters their population with nobody editing them. **What nothing reaches is an
  address typed straight into a test**: a future expectation written as `'string/titlecase'` rather than
  taken from the constant is a fixture standing at an admissible address again, silently, and the
  failure has no event — it is met by whoever sets out to write that contract.

  **A wider sweep is refused and the refusal is a measurement rather than a price.** Matching
  `CONTRACT_NAME`'s own shape against every quoted literal of every tracked `.ts` file at `db2d236`
  returns `lib/toopo`, `packages/cli`, `application/json`, `vitest/config`, `app/toopo`, `arm/lens` and
  `refs/tags` beside the real answers. **The shape of an address and the shape of a path are one shape**,
  so no reading of the text separates them, and a guard that tried would need a list of exceptions —
  which is the convention this whole unit replaced.

  **The population is every user-facing and test-facing string of this repository that could hold an
  address**, and it is the same population three other entries here already name. What would close it is
  the validation stage reading this repository's own strings, already priced and already refused as a
  lint over prose; what is cheap and is done instead is that both never-held addresses are now taken
  from the declaration rather than typed, so writing a bare one is a deviation rather than the path of
  least resistance. ADR-0142.

- **That the text of a guard is the text somebody wrote.** A `\b` edited into a source through a shell
  heredoc lands in the file as a literal backspace, `0x08`. Nothing here reads a source for a control
  character: it compiles, the suite collects it, and the guard refuses less than its text says while
  looking exactly like a guard. **Measured at `ccc9cb3` over every tracked file: six control characters
  in three files.** Three were the collapse - two of them committed, in
  `every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown`, whose
  `/\bof\b|\//` had been refusing a slash and nothing else since it was written - and are repaired.
  The other three are `0x00` in `mutation/history.ts` and `packages/registry/round-trip.test.ts`, which
  are deliberate separators whose behaviour is exactly what `'\0'` means; they are named rather than
  changed, because changing them is what the closure below would require and this unit did not take it.

  **The population is every tracked source**, and the failure is quiet by construction - a narrowed
  guard is green, and the only thing that says otherwise is a mutant aimed at exactly what it stopped
  refusing. This one was found that way and not by anybody reading.

  **What would close it is one of the cheapest guards this repository could hold** - no tracked source
  carries a control character but tab and newline - and the price is where it would live. The subject is
  every source and so is nobody's folder; the natural home is the meta suite, which is `mutation/`, which
  **no battery injects into and the census does not count**. So the guard would be born unwitnessed by
  construction, which is the shape this repository refuses without an argument. Writing the three `0x00`
  as `'\0'` first makes the rule total, with no declared exception. Priced and not taken here, because a
  unit building a page is not where one decides what the meta suite is worth. ADR-0140.

- **That a value a guard looks for appears once on the surface it looks at.** A guard that asks
  whether a figure is *somewhere* on a page is satisfied by any occurrence of it, and a page that
  states one value twice hands it the copy. Measured at `8038113`:
  `the-cost-a-page-states-is-what-lands-and-not-what-is-served` requires the installed byte total to
  appear in a contract page's reading; a new section listed each installed file with its weight, and
  with one implementation file that weight *is* the total. **W-12 survived** - the cell that points
  the card's figure at the harness instead of at what lands - while the page read perfectly well.

  **The guard is not too broad and the page is not wrong; what is wrong is that they met.** The
  defect arrives from a change that does not touch the guard, does not touch what the guard is
  about, and adds a second true statement of one number somewhere else on the same surface. Nothing
  reads a page for repeated values, and nothing could sensibly forbid one.

  **It is not the class `assertWholeSuiteRan` is in**, which is a total blind to a composition: there
  the check is too coarse to see what changed, here the check is exact and a duplicate answers it.
  **The population is every guard that looks for a value anywhere on a surface where that value can
  appear more than once**, which today is the figure guards of `pages.test.ts`. What would close it
  is asking those guards *where* rather than *whether* - the card, not the page - and the price is
  that a guard about a claim starts naming a block, which is the coupling to a layout that
  `no-element-runs-into-the-one-beside-it` and its neighbours were written to avoid. Priced and not
  taken. ADR-0130.

- **That two things a reader sees side by side are told apart, where one of them is not an element.**
  `no-element-runs-into-the-one-beside-it` walks a node's children and skips any pair where either
  side is a text node — read in the guard: `if (left.child.kind !== 'element' || right.child.kind
  !== 'element') continue`. So a phrasing element followed by bare text is outside its reach by
  construction, and the separator between them is the author's and kept by nothing.

  **It was found by a surviving mutant and not by a reading**, which is the whole reason it is worth
  an entry rather than a note. W-64 was re-anchored onto the front page's turned-down mark — take the
  ` — ` off and the page reads `group-byturned down` — and the cell **survived**. Nothing was red. A
  guard whose subject is exactly that defect could not see it, and the instrument is what said so.

  **The population is every place this site writes text beside a phrasing element**, which today is
  one: the mark after a turned-down contract's name on the front page, one contract of five. That is
  what makes the price wrong rather than the defect small.

  **What would close it is one of two things and both cost more than they buy.** Widening the guard
  to element-against-text changes its population across every page of the tree, and a guard whose
  population moves is one whose green has to be re-earned everywhere at once. Or the mark becomes an
  element — and `Tag` has no `span`, deliberately, so it would mean either adding one to a union
  that is small on purpose or rendering the mark as a block, which puts it under the name instead of
  beside it and is a layout decision taken to satisfy a guard. Priced and refused, and the refusal is
  the entry.

- **That a citation inside a file a published contract freezes ever resolves again.** The two shared
  files carry three identifiers of a history that no longer exists — `3ec99c5…` twice in prose, and
  `THE_ANATOMY_WAS_MEASURED_AT` in `every-contract.ts`, which is a constant and not a comment. They
  cannot be repaired: the digest covers those files byte for byte, so the edit that would fix them
  rebinds four published addresses, and permanent rule 6 forbids it. **The population is every file a
  published contract freezes**, which today is `packages/catalogue/every-contract.ts` and
  `packages/catalogue/identifier.ts`, and it grows by seven files with each contract published.

  **The fact that makes this an entry rather than an internal untidiness is that those files are
  served.** An auditor who fetches a contract's snapshot receives the shared harness with it, so what
  arrives on their disk carries three identifiers that resolve nowhere — in the one artefact whose
  whole claim is that it can be checked without taking our word for anything.

  `theEditableSources` is the honest half: the citation guard sweeps what this repository may still
  edit, and says so rather than claiming a sweep one part of which is out of reach. **What nothing
  keeps is that the next frozen file carries a fourth.** What would close it is a validation stage
  refusing a commit identifier in a file a submission freezes — which is the same stage three entries
  below already name, priced there and refused there as a lint over prose. Written into that stage's
  requirements rather than built. ADR-0124.

- **That an identifier this repository writes bare is one somebody can follow.** `A_CITATION` matches
  seven hexadecimal digits closed by a backtick, and that form was measured rather than chosen — it
  separated 58 of 68 citations from all 29 benign runs on the day it was written. **What it does not
  match is an identifier written bare**, and `history.ts` claimed for three records that the ones it
  misses are quoted elsewhere in their own file and reached anyway. That claim is false: a `git log`
  excerpt in ADR-0111, the `npm run hands` table in ADR-0112, and two ordinary comments in `style.ts`
  write identifiers no backtick in those files repeats.

  **It was found by this rewrite and not by a guard**, which is the whole of why it is here: every one
  of those had to be translated by hand, and the guard would have been green with all of them dead —
  the exact morning ADR-0095 says this module exists to be red on. **No rank is published**, on the
  rule that a sentence which can be true without counting does not count, and the shape is what a
  reader needs: an identifier inside a fenced block or a comment.
  `git grep -nE '\b[0-9a-f]{7,40}\b' -- '*.ts' '*.md'` names the population at any commit.

  **What would close it is widening the form to every run that resolves**, and the reason that is a
  decision rather than a one-line change is what the narrow form was bought for: a truncated digest, a
  decimal constant and a deliberately fake identifier all have to stay benign, and resolution rather
  than shape would have to be shown to separate them. Priced as its own unit and not taken here,
  because a rewrite is the wrong place to widen the guard that reads it. ADR-0124.

- **That a breakpoint is the arithmetic of the lengths it separates.** Two guards now keep that every
  ceiling and every track of this site's layout is derived — `every-ceiling-on-a-box-is-derived-and-never-typed`
  and `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` — and **neither can read
  the one place a width is still typed**, because `var()` is not allowed in a media query's condition
  in any browser and never has been. **The population is the three conditions of `style.ts`**: `52rem`,
  `64rem` and `97rem`. **Not one of the three now carries the arithmetic it came from.** `52rem` and
  `64rem` never did, and this entry claimed each of them did until ADR-0132 went and read them;
  `97rem` did, and ADR-0134 removed the term it was summed from — the content column's ceiling, the
  933 in `240 + 933 + 268 + 96`. The column has no width to add up any more, so the one threshold here
  that could be checked against its own tracks is now a number with nothing behind it. It is left at
  its value, because moving it decides when a page gains a third column and that was not ADR-0134's
  decision. **The entry got worse without moving**, which is the shape rule 3 of this section is
  about: nothing compares a threshold with the tracks it separates, and the failure is quiet by
  construction — a threshold that no longer matches its own tracks does not break a page, it moves the
  width at which the page changes shape, and only a reading at exactly that width would say so.

  **What would close it is not a lint and the price is a browser.** Every one of those lengths
  resolves against `ch`, which is a property of the face the reader's own system supplies, so the
  arithmetic cannot be evaluated by anything that does not lay text out — the guard would be the
  eleven-page sweep this repository already takes by hand, made into a suite with a browser as a dev
  dependency. That is the trade stage rule 3 admits only where the mechanism keeping a tool out of the
  product is executable, and it would buy a check on three integers. **Refused knowingly, and it is
  the whole of what ADR-0123's third reopening trigger is about.**

  **That paragraph was the whole entry and it was incomplete in a way that changes what the entry is.**
  It announces a price, and a debt that announces a price invites somebody to pay it. Two of these three
  thresholds are not waiting on a browser: **no arrangement of today's CSS reaches them**, and that is a
  demonstration rather than an estimate.

  **`97rem` is closed to the language by counting.** The three-column shell wants `.where | main |
  .rail`; the document is `main, .where, .rail`, because ADR-0121 put the content first so a reader at
  390 does not meet sixteen lines of navigation before a word. Read in a browser at `7e9438c`, flexbox
  reaches exactly two orders from that document — `row` gives `main, .where, .rail` and `row-reverse`
  gives `.rail, .where, main`. **Three elements have six orders, a flex container reaches two, and
  neither is the one wanted.** `order` reaches it and is refused for a measured reason rather than a
  stylistic one: it applies at every width, so it restores at 390 exactly the defect ADR-0121 removed. A
  grid reaches it by placement, and placement is what needs the condition.

  **The corollary is why the third one is not closed to the language**, and it is the same count read
  the other way: a two-element shell has two orders and a flex container reaches **both**. So
  `flex-direction: row-reverse` derives the `64rem` threshold, measured on `/typescript/string/` at
  `7e9438c` — identical geometry at and above 1024, the fold moving down to about 760, and the document
  untouched, since a container's direction is not `order`. **It is available and it is not taken**: it
  would change what a reader sees between 760 and 1024 on five pages, for a layout the redesign is about
  to replace, and an entry that read *impossible* without reading *except here* would be false in the
  other direction.

  **`52rem` is closed by ADR-0122 rather than by the language.** A case row two abreast is a grid, and
  `minmax(0, var(--measure))` sizes the call column **on its content up to a ceiling** while a flex basis
  imposes that width even where the call is short — which takes the room from the argument beside it.
  Measured over the settled cases of `string/slugify@1`, as the height the rows occupy: the flex form
  wins at 1024, where the grid squeezes the argument to 211px and pays **11 853** against **9 412** — and
  loses where it matters, **8 548 against the grid's 6 897 at 1240**, which is the ordinary width. That
  is what ADR-0122 chose the grid for, one level down.

  **And the candidate before it was refused on its own principle.** Folding on two measures put the
  threshold at `2 * measure + gap`, which is what `--two-columns` *was* by definition — so the fold
  landed exactly on the container's own ceiling and sub-pixel rounding decided it. **A switch at the
  micron is not a derived threshold, it is a threshold nobody controls**, and it would have read as the
  closure of this entry. ADR-0134 deleted `--two-columns`, so that candidate no longer exists to be
  refused; the refusal is kept because the shape it names — a threshold landing on the length it is
  derived from — is what the next candidate will be.

  **It reopens on the structure and not on a better use of flexbox.** What blocks `97rem` is a property
  of *this* document order, not of CSS: the seven mock-ups of the redesign carry no width condition at
  all and fold on bases, because their pages are not built out of `main, .where, .rail`. **What is
  taken again on the day that order changes is the measurement and never this argument**, which is
  about one arrangement and expires with it.

  **That paragraph ended *which is planned*, and the event it was waiting for has happened otherwise.**
  ADR-0125 to ADR-0131 are the redesign; they remade the front page, the families, the refused contract
  and what a contract is, and not one of them touched `main, .where, .rail` — the unit that was to do
  it was abandoned once two of the three thresholds turned out to close by no flexbox arrangement at
  all. So the clause announced a future for an event that had already passed, which is precisely the
  form rule 3 of this section names: **an entry that is false without being stale**, because nothing
  about it looks old.

  **ADR-0132 then went at the third threshold from the other side and refused it with a measurement.**
  What would let `97rem` go is the rail standing beside the content column rather than in the shell;
  the rail is sticky over the whole page and a settled-case table is 905px wide, and the two cannot
  share a column, so the rail can only accompany the region holding no wide block. Measured by building
  that arrangement in a browser at `0cec957`: **13.7% of `number/parse@1` and 23.2% of
  `string/slugify@1`**, against 100% today. So the population is unchanged at three, and what this
  entry now knows that it did not is what the closure costs.

- **That any layout this site declares is one somebody looked at.** `pages.test.ts` builds documents
  and reads their text; **nothing in this repository lays a page out.** So every rule of
  `packages/site/style.ts` that decides a width, a track, a fold or a placement is kept by nothing that
  runs. The two guards that do read this stylesheet —
  `every-ceiling-on-a-box-is-derived-and-never-typed` and
  `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` — read its *text* and ask whether
  a length is derived from a declared one. Neither asks what it renders, and a rule that is derived and
  wrong satisfies both.

  **The population is measured, and the rule it was counted by is written down because the last count
  is not reproducible without it.** Inside the `STYLE` literal, CSS comments stripped, `@media`
  conditions excluded because a condition is not a declaration: **`ab2765c` had 40 and `7c15c69` has
  30** — 10 `grid-template-columns`, 4 `max-width`, 4 `min-width`, 6 `grid-area`, 2 `grid-column` and 4
  `width`. Every one of them is `one-directional`. The entry read **38 at `0cec957`** under a rule it did
  not state; that figure counts the three `@media (min-width: …)` conditions, which is why it cannot be
  rebuilt by the sweep above, and it is left where it is rather than corrected, being stamped.

  **ADR-0134 shrank the population by a quarter and did not touch the debt**, which is the thing to
  read twice: ten declarations went because a ceiling stated in characters went with them, and the
  thirty that remain are as unread as the forty were.

  **It is the class this repository has now paid for six times**, and ADR-0135 is the sixth: four
  defects a phone reader met on every visit, found by a sweep and repaired against readings taken by
  hand, with the eight suites green on both sides of the change. ADR-0134 was the fifth: the whole
  of it was decided in an inspector by the owner and settled by a browser sweep at nine widths, and the
  eight suites were green before the change, after the change, and would have been green had it broken
  every page in the tree. ADR-0132 was the fourth: five candidate arrangements were built in a browser
  and three were refused on readings no suite here could have taken — a `fit-content` column that
  answers *one contract* to a two-abreast list, a card whose void moves inside it, and a rail that would
  accompany 13.7% of a page. None of those is visible to a check that reads a string.

  **What would close it is a headless browser as a dev dependency**, which stage rule 3 admits only
  where the mechanism keeping a tool out of the product is executable — and both halves of that
  mechanism already exist, `files: ["dist"]` and `packaging/reachable.ts`. It is priced twice above, at
  the breakpoint entry and at the `start.ts` entry, and it is refused a third time here for a reason
  about *where* rather than about the price: **a unit repairing a layout is not where one decides to add
  a tool to the repository**, because the decision would be taken by whoever most wants the layout to
  land. ADR-0132.

  **It is demonstrated rather than predicted since `6aa90db`, and the demonstration corrected the
  claim.** Collapsing every page of the site to a twenty-pixel column *was* caught -
  `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` reddened, because the collapse
  was typed as a length. Rebuilt out of declared lengths, which that guard admits, the same collapse
  passed **122 of 122** with every page rendering one character per line. So the entry is not that
  nothing reads the stylesheet: two guards do, and they read its *text*. What nothing reads is what it
  renders.

- **That what a linked-to element clears is the bar that is really above it.** The masthead is
  sticky, so an element scrolled to under it is one a reader followed a link to and cannot see -
  which is what nineteen destinations of two contract pages did at every width a phone has until
  ADR-0135. The repair ties the clearance to the bar by sharing its terms: the padding the masthead
  declares, and its content at the tallest that content gets. **One term of that arithmetic is data
  and not a length.** `--the-menu-at-its-tallest: 3` is the most rows the menu wraps to between 280
  and 479, measured, and the menu's entry count lives in `theMenu` of `packages/site/chrome.ts` where
  nothing resolves it against the stylesheet. **A fourth destination in the masthead makes the
  clearance too short and no check says so**, and the failure is quiet by construction: the page is
  not broken, it is one row of navigation taller than the offset that was written for it, and only
  somebody following a link at a phone width would find out.

  **The population is that one declaration**, and what would close it is not a lint: CSS cannot read a
  rendered height, so the two can only be compared by laying a page out. It is the ninth suite, priced
  four times on this list already, and this is the first entry whose closure that suite would make
  *cheap* rather than merely possible - the check is one line, *every address a page publishes clears
  the bar above it*, with no number in it. ADR-0135.

- **That a paragraph of prose has been read whole by somebody.** ADR-0112 makes it measurable: a
  paragraph has an author when one commit's blame covers every one of its lines, `npm run hands`
  counts them, and at `2385fc2`, over all 362 tracked sources, **32 paragraphs of 8 046 carry three
  hands or more**. Of the 22 in the three populations that unit swept, **nine needed rewriting and
  thirteen did not** — so the reading designates a zone rather than measuring a defect, and it is
  worth taking again but never worth acting on unread. **The population is every paragraph of prose
  this repository holds**, and nothing keeps it between readings.

  **A guard is refused rather than unbuilt, and the argument is the reflow.** `git blame` attributes a
  line to the commit that last changed it, so a commit that rewraps a paragraph returns it to one hand
  with the prose untouched — a check whose cheapest satisfaction is a whitespace change, which is a
  ritual and would be read as coverage. Its red event is the wrong one too: *somebody edited prose
  twice*, not *prose is defective*. What stands in a guard's place is that the reading is a **command
  and not a number in prose**, which is the treatment the `1.0.1` tree digest was withdrawn for
  lacking. It closes the day a reading's repaired-to-healthy ratio approaches *n* of *n*, at which
  point a refusal becomes arguable — against the reflow, which does not go away.

  **Two instances are left standing and named rather than swept up.** `mutation/census.ts` carries *A
  twelfth on the licence* and *A thirteenth on the narrowing*; `packages/registry/local-read-api.ts`
  carries *The third reader of one source*, which is true today and states its own population one
  paragraph below. Both are the rank defect the four vitest configurations were repaired for, and
  neither is in a population that unit swept.

- **That the spelling this product prints resolves wherever it says it does.** `renderImportLine` ended
  *the one spelling TypeScript and every bundler resolve* until ADR-0110, and that clause was wider
  than anything ever measured. It now claims only the TypeScript half, which is settled by a **total**
  reading — TypeScript offers three module resolutions and all three were read at `tsc` 7.0.2 — so the
  surface a user meets at every install no longer over-claims. That is the cheap half and it is done.

  **What stays open is the half that was taken off the surface rather than closed.** ADR-0110 read the
  layout against four bundlers — esbuild, vite, rollup and webpack, three distinct resolver
  implementations, chosen on weekly npm downloads rather than on convenience — and all four resolved
  it. **Four is not every.** Unread: rspack, Parcel, Bun, Deno, and every version of the four but the
  one measured. **The population is every bundler and every version of one**, which is unbounded, and
  that is the whole shape of this entry: it is a claim no amount of measuring can keep, which is why
  the repair was to stop making it rather than to measure further.

  What would close the part that *can* be closed is a suite that bundles the emitted layout with each
  resolver the way `packaging/against-the-origin/` performs a real install — a guard that reddens the
  day a bundler changes its mind, rather than a reading somebody took once. The price is named: a
  bundler apiece as a dev dependency, which stage rule 3 admits only where the mechanism keeping it out
  of the product is executable, plus a ninth suite that no battery replays and that no other suite's
  verdicts may depend on. Not built, and not urgent while nothing published says more than was
  measured.

- **That the bound the origin proof waits is one somebody measured.** A deployment returns before it
  has propagated, and part-way through a rollout the origin answers the catalogue index from one commit
  and a contract's bindings from another — at which point `toopo add` refuses, correctly, and the proof
  against the origin reddens with the product working.

  **This entry predicted the wrong failure, and it was refuted by observation rather than by
  argument.** It read *the day propagation exceeds it, CI is red with nothing wrong, which is the exact
  failure the wait was written to remove*. Measured at `d739337`: the bound was **never consumed** —
  the waiting line the pre-flight prints appears in neither of that commit's two run logs — and CI was
  red anyway, once in two runs. The pre-flight read one revision and returned on its first attempt; the
  installed client, seconds later, read the index from `d739337` and the implementations from
  `013f688`. **An agreement observed on one reading says nothing about the next**, and no reading taken
  inside the suite can be the client's, because the client is another process. The cause is the alias
  and not a cache: Cloudflare Pages makes a hash-based deployment address atomic and updates a branch
  alias to point at it, `toopo.dev` is that alias, and `CF-Cache-Status: DYNAMIC` on all three
  addresses says nothing was served from an edge cache. ADR-0108 replaced the pre-flight with a bounded
  retry of the chain, driven by the client's own refusal. **A prediction that observation refutes is
  replaced by what was measured, never by a second prediction**, which is why nothing above says what
  will fail next.

  **What stays open is what this entry always meant, with the prediction removed.**
  `THE_PROPAGATION_BOUND` is two minutes chosen against the cost of the step and not against
  Cloudflare. **It has readings and it has no population**, and the two are not the same thing. Both
  readings so far are of the retry firing on the real condition — the index from the old deployment,
  the bindings from the new — and both are the span from the client's first refusal to a finished
  chain: about **10.8 seconds** at `206190d`, and about **5.5 seconds** at `1048d89`. Neither is within
  an order of magnitude of the 120 seconds the bound allows.

  **Two readings do not become a population by being written down, which is why they are written as
  the pair they are.** A line per deployment would be a list nobody rebuilds and a figure nobody can
  check; what would close this is the same span over enough deployments to say whether 120 seconds is
  generous or lucky, and the retry records both ends of it on every run that waits, so the runs hold
  what a later reading would be built from. Not built, and the next reading is worth adding here only
  if it approaches the bound — which is the event this entry is actually about.

  **The same run refuted the repair nobody wrote, which is worth more than the figure.** Five seconds
  after the first refusal the origin answered *one* revision to this suite and the client refused
  again. A wait that ran the chain once as soon as the suite saw agreement would have been red there —
  and that is the shape the pre-flight had.
- **That the two things a publication depends on outside this repository are what this repository thinks
  they are.** ADR-0109 put `npm publish` in `suites.yml`, and four guards keep what a file can hold: one
  job publishes, it is gated by the suites, the branch and an environment, only it may mint an identity
  token, and no workflow hands npm a credential. **None of them can see the other side.** npm's trusted
  publisher holds four strings — organisation, repository, workflow filename, environment — and **three of
  them are things this repository can rename on its own**, at which point publication stops working with
  every guard green. Worse in kind: **npm's configuration carries no branch**, so the environment is doing
  work that looks, in the file, as though the condition were doing it. And the environment's own branch
  policy is a GitHub setting no file here states.

  **The population is those four strings and that policy**, and what would close the npm half is an
  authenticated read of npm's API compared against `ENDPOINTS`-style declarations of the two names this
  repository owns — the price being a credential on a runner for a question whose whole subject is not
  needing one, which is the same trade the entry below about `servedFrom` refuses and for the same reason.
  The GitHub half is cheaper and is not free either: whether a run can read its own repository's
  environment protection with the token this workflow carries has not been measured. Not built.

  **The two sides do agree, and that half is now measured rather than awaited.** This entry read *the
  first dispatch is what will say whether the two sides agree at all*; the dispatch was made and it
  published. Read at `2efc482` off npm's own record: `_npmUser` is
  `GitHub Actions <npm-oidc-no-reply@github.com>`, `dist.attestations` carries a
  `https://slsa.dev/provenance/v1` provenance, and `gitHead` names the commit. An identity token was
  minted, npm exchanged it, and the attestation was written — so the four strings and the environment
  policy were the ones this file claimed, on that day. **What is not closed is anything about tomorrow**:
  three of the four are still strings this repository can rename on its own, npm's configuration still
  carries no branch, and one successful exchange is not a mechanism. ADR-0111 did not touch any of the
  four, which is worth stating because it moved the trigger and could have.

  **A second reading exists, it was taken across the event most likely to have broken it, and it is
  stronger than the first in one specific way.** ADR-0124 reissued all 506 commits of this graph. Read at
  `f95c4fa` off npm's own record and off the attestation behind it, for `1.0.4` — the first release
  published after the rewrite: `_npmUser` is unchanged, `gitHead` is `f95c4fa` and `git cat-file -t`
  resolves it here, and the provenance names `refs/heads/main`, `https://github.com/toopohq/toopo` and
  `.github/workflows/suites.yml`. So the four strings and the environment policy survived a rewrite of
  every identifier in the history, and `event_name` reads `push` — ADR-0111's trigger, confirmed from the
  side this repository does not write.

  **What is stronger is that the provenance carries two identifiers and not only names.**
  `repository_id: 1319617655` and `repository_owner_id: 280416883` are stamped by GitHub and a rename
  does not move them, so an attestation already published goes on naming the right repository whatever
  this side is called afterwards. **That is true of the attestation and false of the configuration**: npm's
  trusted publisher is keyed on the four strings, three of which this repository can still rename on its
  own, and a rename would stop the *next* publication with every guard here green. Both halves are written
  because the entry read blacker than it is with only the first.

  **Both sides were configured on 2026-08-17, and this paragraph is the entire record of it.** The
  trusted publisher on npmjs.com names `toopohq`, `toopo`, `suites.yml` and the `npm` environment, with
  `npm publish` as the permitted command and publishing access at its strictest setting; the GitHub
  environment exists and is restricted to `main`. **None of that was read from here and none of it can
  be** — it is reported by the person who typed it, which is precisely the shape of the one entry this
  list ever carried that no guard could have caught: a decision taken in conversation, with no half in
  the repository for the code to disagree with. So it is written down where the next session will meet
  it, and it does not make the entry above any less open. **The publication that followed is what turned
  that from a report into a reading**, and it is recorded one paragraph up rather than restated here —
  what a successful exchange establishes is that the four strings and the policy were the ones this
  paragraph claims, on the day it was written, which is exactly as much as one reading ever establishes.
- **That the gate on the publishing job is a conjunction.**
  `the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version` resolves both ends of the
  reference the gate makes — the `if` names a job's output, that job is waited for, and it exists — and
  it reads the condition's *content* and never its *shape*. **An `||` added to that expression leaves
  every guard green**, which is the plausible spelling of somebody widening the gate rather than of
  somebody attacking it. The population is the publishing job's condition. **It is priced low and
  refused on the price, not overlooked**: bypassing the version clause makes every push of `main` reach
  `npm publish` and be refused on a version that already exists, so the failure announces itself on the
  next push instead of publishing something wrong — which is the argument `CLAUDE.md` states for not
  writing a guard whose event is cheap. What would close it is reading the structure of the expression,
  and that means this file's YAML sweep learning what an operator is, on a repository that has no YAML
  parser and will not gain a dependency to hold one guard. ADR-0111.
- **That a control a visitor touches is one that was wired to what decides for it.** `start.ts` still
  exports no name, so nothing can import it and no mutant in it can be killed. What changed is what
  that costs: every decision the controls make is now in `what-a-control-says.ts` and in
  `playground.ts`, both reachable, both guarded, both carrying cells. **What is left unkept is the
  wiring** — appending, event handling, focus, `navigator.clipboard`, reading `dataset` — five
  behaviours rather than a file.

  **The half that is open is the half a split cannot buy, and it is stated rather than covered.** A
  guard over `theSpellingShownFor` is green on the day `managerControl` stops asking for it. A guard
  reading `start.ts`'s text for the names it calls was considered and refused: it would prove that an
  identifier appears in a file, not that a value reaches an element, and a weak guard standing where a
  real one is missing reads as coverage.

  **This entry was false on four counts and none of them made it look old, which is rule 3 of this
  section arriving on the list itself.** It said `start.ts` *builds the playground form and, since
  ADR-0116, the copy control* — it builds four things, ADR-0137 and ADR-0138 having added the search
  field and the choice of package manager without coming back here. It called it *one file of fifty
  lines*; it was 457, of which 229 executable. It gave the population as `packages/site/start.ts`; it
  was two files, `searching.ts` being reachable the whole time and reached by nobody. And it concluded
  that what would close it is *a document in the site suite* — measured at `17cc9bf`, **40.2 % of its
  executable text was a decision about what a visitor reads, needing no document at all**, and the
  entry's own subject was the reason. Every clause was written from an assumption about what the file
  held rather than from a reading of it, and every one was wrong on the day it was published.

  **What would close what remains is a tool that executes a module against a document**, and that is
  a different tool from the one three entries of this list already price and refuse: those wanted a
  page laid out and so wanted a rendering engine. It is the owner's decision and not a unit's means,
  and it is deliberately left open rather than taken inside a unit that would have used it.
  ADR-0157.
- **That every surface renders the invocation rather than the bare command name.** This one was met by
  a visitor rather than found by a sweep: the README and the four contract pages published
  `toopo add string/slugify`, which answers `command not found` for anybody who has installed nothing —
  the first thing a visitor does, and it failed. `THE_INVOCATION` is the one spelling measured to work
  in all three situations — nothing installed, installed globally, installed as a project dependency —
  and the README and the emitted pages now carry a guard apiece over their own surface.

  **The client's own screens carry none, and that is the open half.** Every one of those strings is
  converted in this tree; nothing stops the next one being written bare, and the reader it would fail
  is the one the `npx` path just made canonical. **The population is every user-facing string of
  `packages/cli/`.**

  **The half about the artefact closed, and the sentence that recorded it was false for four commits.**
  It read, measured at `f065a7f`, that `npx toopo list` answers `Take one out with toopo remove
  <domain>/<name>` because *npm serves `1.0.1`, which predates the conversion* — and it went on saying so
  after `2efc482` published `1.0.2`, which carries the conversion. That is this list's own recurring
  failure arriving on this list: a dated measurement with a present-tense clause beside it, where it is
  the clause a reader believes. **What made it a four-commit lie rather than a permanent one is that a
  publication now happens on a number rather than when somebody remembers**, which is the same event
  ADR-0111 was written for.

  What stays open is the population and nothing else: **every user-facing string of `packages/cli/`**.
  Every one is converted in this tree; nothing stops the next being written bare. What would close it is
  not a shape — no spelling of a string literal makes the bare form fail to compile, which is ADR-0054's
  other branch — but the validation stage reading this repository's own strings, already named twice on
  this list, already priced and already refused as a lint over prose.

  **What the two guards that do exist cost is worth recording, because both were narrowed by
  measurement rather than by taste.** Sweeping every occurrence of a command on the site went red on
  nine mentions, and sweeping every line beginning with one went red on four more — all thirteen mutant
  descriptions the method page publishes, where the command is the subject of a sentence and nobody is
  being told to run anything. So the site's guard is over the install command and recognises one by the
  fact that **it names a contract of this catalogue**, and the README's is over what sits inside a shell
  fence. Neither is a sweep for the word, and a rule that swept for the word would be wrong.

- **That a decision can name what confirms it, when what confirms it is a guard over every contract.**
  ADR-0001 requires `confirmed-by` present, and a guard is addressed by the pair `(suite, guard)`.
  **This entry read *present and non-empty* until ADR-0143 went and read the code**, which is rule 3
  of this section on the entry's own text: `declarationFaults` tests `governs` for emptiness and
  `confirmedBy` only for absence, ADR-0001 discusses an empty one as a legitimate state rather than
  forbidding it, and records carry `confirmed-by: []` legitimately. **The rank that stood here is
  gone rather than restated**: `nineteen` reproduces under no rule, and ADR-0158 read 21, 22 and 23
  depending on whether the literal is counted as a declaration in the front matter, as text anywhere
  in a record, or by occurrence — the loose readings counting ADR-0001, which discusses the empty
  form because it is the record that defines it. A number that moves whenever a record is added is
  one this sentence never needed, which is ADR-0018's first rule. Nothing about the sentence looked
  old; it was wrong on the day it was written, in the file whose subject is declarations that hold. `guardsCollectedIn` reads a guard's *written* title, so an `it.each` over the
  catalogue is collected as `…-%s`; `guardAddressFaults` requires a frozen identifier and `%s` is not
  one. **So a decision whose subject is per-contract has no citable guard at all**, and nothing says
  so — the author discovers it as nine faults from
  `every-guard-a-decision-names-is-one-its-suite-collects`, which reports that the suite collects no
  such identifier and not that the identifier could never have existed. Measured at `10abc40`: zero of
  the 105 records cite a parameterised guard, so the rule has been kept by accident rather than by
  anything. ADR-0105 folded four guards into one apiece and that was right on its own merits, which is
  exactly what makes this worth writing down: the collision was paid around rather than found. **The
  population is every guard written with `it.each`**, and what would close it is `guardsCollectedIn`
  expanding a parameterised title the way the run does — it already knows the folder, and `eachContract`
  is the only table the catalogue parameterises over. The price is that it stops being a plain read of
  the source and starts needing to know what a suite's rows are. Not built.
- **That a mutant a battery injects is the defect it describes, and not a compile error.**
  `mutation/check-anchors.ts` reads a cell's `find` text and requires it to occur once in its file; it
  never reads the `replace`. Found by ADR-0105 rather than reasoned about: `hashedFile` renamed two
  parameters, both affected anchors were updated, `npm run anchors` went to 0 loose — and I-01's
  replacement still read `readFileSync(join(directory, name))`, naming two identifiers that no longer
  exist. Injected, that cell does not typecheck, so it measures nothing and the anchor check says it is
  fine. **The population is every cell of every battery**, 586 anchors across 82 files at `e8f68ca`, and
  what makes it worth an entry rather than a note is that the failure is silent in exactly the tool
  built to prevent it. What would close it is not a second lint over the text: it is injecting each
  mutant and typechecking the tree, which the replay already does one cell at a time — so the cheap form
  is `check-anchors` learning to apply the replacement and refuse a result the compiler rejects, and the
  price is that it stops being a pure read of the working tree. Not built.

  **It is paid at every passage rather than one day, and two units in a row are what turned that from
  a prediction into a rate.** ADR-0127 moved a branching link expression out of `catalogue-page.ts`
  and `W-64`'s `replace` went on quoting it; ADR-0129 reformatted an import in the same file and
  `W-53`'s `replace` went on quoting the single line. Both were moved by hand, and in both cases what
  reported anything at all was the *other* half — the `find` — so neither would have been seen had
  the quoted text alone still matched.

  **What that changes is what a reader does with the entry and not whether it closes.** It was
  written as a possibility with a price beside it, which is the shape of an entry somebody acts on
  the day it fires. Two instances in two units make it a **cost every unit touching anchored prose
  pays**, and an entry that charges at each passage is treated before one that would charge once.
  The rate is two of two units and the population is unchanged: every cell of every battery.

  **A third unit paid the neighbouring cost and not this one, and the two are worth telling apart.**
  ADR-0130 moved two renderings into a module of their own and `W-49` and `W-54` stopped applying -
  reported by `npm run anchors`, because it was their `find` that no longer matched. Their `replace`
  halves were untouched and still apply. So four anchor failures in three units, of which **two are
  this entry** and two are the tool doing its job. A count that folded all four together would make
  this read as twice the rate it has, on an entry whose whole subject is a failure nothing reports.

- **That a change is answered by every battery that could say something about it.** The gates of
  ADR-0146 answer it for the folder a change touches and for the battery file it edits, and that is
  the only cheap rule there is. Measured at `66cdb3f` over every tracked `.ts`, folder by folder,
  source edges and test edges together: `packages/cli`, `packages/registry`, `packages/site`,
  `packages/validation`, `packaging` and `mutation` are **one strongly connected component**, each
  reaching every other transitively in both directions. **The transitive closure of any one of them is
  all of them**, so an import-following selection selects everything on every push, which is not a
  selection.

  **Two populations now, and they fail differently.** A guard reddened from a neighbouring folder is
  bounded by the second gate, which is to say by the cadence of publication rather than by *never*.
  And `packages/catalogue/every-contract.ts` is reached by every injection folder and injected into by
  none, so it is at once where the rule answers *no battery* and where an edit reaches furthest.

  **The third closed, and what it was is worth more than that it closed.** It read *the shared modules
  of `mutation/` - `run.ts`, `published.ts`, `mutants.ts`, `attribution.ts`*. One name too many and
  three missing: `published.ts` is on no battery's execution path, because `measure.ts` resolves its
  battery through a templated `import()` and never reads `THE_BATTERIES`; `census.ts`, `measure.ts` and
  `paths.ts` are read by every run and were named nowhere. **Nothing had derived that list** - it was
  written from a reading of what the instrument looked like, which is rule 3 of this section arriving
  on an entry of it. What replaces it is a declaration a walk refuses to disagree with. ADR-0149.

  **`packages/catalogue/` narrowed by one file at the same time.** `identifier.ts` is read by every run
  and is answered for; `every-contract.ts` is read by the contract suites and by no run, which is why
  the entry above names the file rather than the folder now.

  **It is not hypothetical and it arrived inside the closure's own demonstration**: replaying the push
  `bc88230..7c9906c`, seven of its twenty changed files selected no battery, and two of them are
  `mutation/census.ts` and `mutation/published.ts`.

  **What is done rather than declared is that the selection prints what it passed over**, and a guard
  keeps it printing - so the gap is in a reader's face on every run instead of being a paragraph here.
  What would close what remains is a selection that follows what a folder is *reached by* rather than
  what it contains, which `sharedHarnessOf` already does for one contract's harness and which is a unit
  of its own. Priced there and not taken.

  **One residue is declared rather than closed, with its measurement.** `mutation/census.ts` is read by
  every run and selects nothing, because it is a table keyed by suite file: a row of it moving is
  already addressed to a folder, and repairing that in the selection would put the correction in the
  mechanism beside the one that has the defect. Measured over the 43 pushes from `694a7a6` to
  `341f86c`: 13 touched it, 12 needed nothing, and `7c9906c` left `validation-stage-1` unselected. Its
  cause recurs - a guard written with `it.each` over the catalogue changes count when a contract is
  published, in files nobody edited - so it belongs to the entry above about a parameterised guard
  having no citable address. ADR-0149.

  **A cost rather than a hole, and it is new.** `seedsAreFrozen` is false by decision, so a pin is
  checked against one draw wherever it runs; twenty replays a day is twenty times the draws, and a thin
  pin will redden a healthy tree more often than it does today. **The asymmetry is what to plan for**:
  a draw on the first gate is a red somebody re-runs, and a draw on the second is a publication that
  waits. ADR-0146 carries the criterion that classifies one. **It is now two pushes in forty-three that
  pay a full replay rather than none**, which is where that cost first arrives in fact.

- **That the reading of who has read this repository's prose is one anything executes.** `npm run
  hands` is in no workflow, and this is the half of the entry ADR-0152 did not close. It is not the
  guard's half: `hands.test.ts` is collected by `mutation/vitest.config.ts` and `npm run meta` is a
  step of `suites.yml`, so the guard over the reading runs on every push. **The two were one entry
  until the closure separated them**, and the sentence that joined them - *the narrowing is seen by no
  suite, no gate and no battery* - was a true measurement with a conclusion about another population
  beside it, which is exactly what this section's rule 3 is for.

  **What nothing executes is `readHands` and `renderHands`.** The guards reach `proseOf` and `handsOn`;
  `every-paragraph-a-reading-reports-is-attributed-to-a-commit` reads one file, so a blame that failed
  to parse on a different file would surface only in the command. **The population is those two
  exports.**

  **It is priced and refused rather than unbuilt.** ADR-0112 refuses a guard over hands, its cheapest
  satisfaction being a reflow, so a job running the reading is either a step nobody reads or the guard
  that record refused - for 438 `git blame` child processes per run. What would close it is a decision
  about whether a reading nobody runs is worth a job, which is the question the entry about `npm run
  hands` being a command and not a number already asks one floor up. ADR-0152.

- **That a guard total over a declaration is total over what the declaration is about.** The guard
  that closed the entry above it is total over the reading's five **populations** and never over its
  files, so a narrowing of `trackedProse` that keeps one file in each of the five passes. **The
  thinnest is `prose` at three** - `CLAUDE.md`, `CONTRIBUTING.md`, `README.md` - measured at
  `879ac08`, so dropping the other 151 Markdown files while keeping those three is invisible to it.
  The number is here rather than *it does not see everything*, because the second is not a
  measurement.

  **The failure is quiet by construction and the shape recurs**: a declaration is a good expectation
  exactly insofar as its rows are hard to satisfy by accident, and nothing here reads how thin a row
  has become. `THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS` one folder over has the same property and has
  never been asked it either.

  **What would close it is a claim about files rather than about populations**, which is the thing
  this repository has no second statement for - the three candidates ADR-0152 refused are refused for
  the same reason at any granularity, and a fourth is not in sight. Written down rather than priced,
  because there is nothing yet to price. ADR-0152.

- **That the witness the end-to-end claim now has is one the code earns rather than the catalogue.**
  The entry this replaces asked for a mutant and ADR-0148 wrote it: `I-65` re-encodes a source in
  Latin-1 after reading it as UTF-8, `the-served-bytes-are-the-committed-bytes` reddens on seven
  files, and the three unit guards stay green - measured at `8b6aa89` on a checkout `git ls-files
  --eol` reports as 454 files `i/lf w/lf`, with the control green at 407 tests. **What nothing keeps
  is the ground it stands on.** Its teeth are the files carrying a code point in **U+0080-U+00FF**,
  and this catalogue has three of them across two contracts: the `±` of `date/add@1`'s summary and
  nine of `string/slugify@1`'s fifty-eight. `string/levenshtein@1`'s single `U+1F600` is above U+00FF
  and is already a `?` after one pass, so it survives the second unchanged and witnesses nothing.

  **The population is those three code points**, and the failure is quiet by construction: a contract
  whose harness lost its last Latin-1 supplement character would take a pin with it, nothing would
  look wrong, and only a replay would say so. **If the catalogue were pure ASCII the mutant survives
  and the guard is back where ADR-0145 left it** - so what was bought is a witness resting on what the
  catalogue happens to contain rather than on a property of `servedBytes`.

  **A second half, narrower and named rather than folded in.** `a-blob-answer-hashes-to-its-address`
  has two halves and the guard is named after the dead one: `addressedBy === file.sha256` compares two
  evaluations of one expression on one file, so **no edit to `servedBytes` can separate them** - 0 of
  47 files, measured. What has teeth is `servedBlobFaults` beside it, which applies that expression
  twice and therefore reads idempotence. Whether the named half is dead under *everything* reachable
  is a different sentence and it is open: it can only differ if the record's path-to-digest
  association is wrong, and **I looked at `harnessOf`'s single `map` and found no plausible mutant,
  which is not the same as none existing.** Four blob addresses stay in the region for the same
  arithmetic - the four contracts carrying no code point in that range.

  **What would close the first half is not a guard**: nothing can require a catalogue to keep a
  character. What would close it is a mutant whose teeth are independent of what the contracts spell,
  and the search that produced `I-65` says where it is not - the three unit guards constrain
  `servedBytes` completely on ASCII, so any such mutant must break something other than the bytes.
  Priced as its own unit and not taken. ADR-0148.

- **That a count of this site's own pages is one somebody took.** The stylesheet's header said *seven
  pages served once each*; at `81bf9bc` the generator wrote **ten** and the tree held **eleven** files
  of HTML with the 404. It had been wrong since ADR-0121 added three domain pages, and it did real
  work: it is where the figure that opened that unit came from, and the session that read it planned
  against eleven and then twelve before counting. **It has drifted again since, in the same direction**
  — at `ab2765c` the emission reports **13 pages** and the tree holds **14** files of HTML — which is
  what an entry about a number nobody keeps is for. **The population is every statement of a page count in this
  repository**, and it is not small — `seven pages` occurs fourteen times across ten files, `eight
  pages` once in the stylesheet's own measure paragraph, `ten pages` once here. Most are stamped
  measurements inside records, which do not drift by rule; the two that made a present-tense claim
  are repaired, and the rest are named here rather than swept, because sweeping a record's dated
  reading would falsify it. **What closes it is the form and not a number**: a sentence that can be
  true without counting does not count, which is what the stylesheet's header now does. What nothing
  keeps is that the next one written will reach for a number again, and the executable form is the
  validation stage reading this repository's own strings — already on this list, already priced,
  already refused as a lint over prose.

- **That a set of examples is not narrower than what the contract it illustrates settles.** ADR-0120
  states the rule and refuses the guard in the same breath, and the refusal is the part worth
  re-reading before somebody writes the guard anyway: the proposal was to sweep Unicode ranges, which
  is mechanical and cheap, and **it would have been green on the defect that motivated it**. Two of
  `string/slugify@1`'s four use cases were French; the set already carried `日本語テキスト`, so a sweep
  over writing systems sees three Latins and one Han and has no opinion. Three languages in one script
  are three languages. The stronger form — one example per language — is the heuristic the script
  proposal existed to avoid.

  **The population is every set of examples the catalogue publishes**, which today is four use cases on
  one contract and is four per contract on five when the other three are written. Each example on its
  own is verified: `every-use-case-replays-through-the-stripped-artefact-a-browser-runs` executes the
  call and compares the answer. **What nothing reads is the set as a set.** It closes where two entries
  above it close, in a validation stage reading a submission's own strings, already priced and already
  refused as a lint over prose.

- **That the revision an installed client records is a commit this repository holds.** A lockfile
  carries `servedFrom`, and the proof against the origin asserts its *shape* — forty hexadecimal
  digits — and reports its value without resolving it. That is deliberate and it is the cheaper half of
  a real trade: a clone legitimately behind the deployment does not hold a commit the origin already
  serves, so resolving against the local graph would be red on an ordinary state. **What it leaves open
  is that an invented revision passes** — an origin serving `0000…0000`, or a commit of somebody else's
  repository, is indistinguishable here from one serving the truth. The population is every revision a
  served answer declares. **What would close it is a resolution against the remote rather than against
  the clone** — `git ls-remote`, or the forge's API — and the price is named rather than waved at: one
  more network dependency inside the single guard whose whole difficulty is already that it has one, and
  a private repository, which means a credential on a runner for a question that stops being private the
  day the repository is public. That is the event to write it against, and it is why it is not written
  now. ADR-0104.

  **That event has happened and this paragraph did not notice, which is rule 3 of this section on an
  entry that names its own trigger.** `gh repo view --json visibility` answers `PUBLIC`, read at
  `341f86c`. So the half of the price that was a credential is gone, and what remains of the refusal is
  the network dependency alone. It is written here rather than acted on - the entry is somebody's to
  take with the reading in front of them, and this is not that unit. **It also moves an argument two
  entries up**, where the npm trusted-publisher entry refuses its own reading *for the same reason*:
  that reason is now one reason rather than two, in both places.
- **That the bytes an archive installs are the catalogue's own bytes**, which is the third of the three
  guards ADR-0092 lost and the one ADR-0104 did not bring back. The other two returned, one of them
  stronger; this one was refused rather than approximated, because comparing what a real install wrote
  against `contracts/` on disk would be red with nothing wrong — the origin serves the last *deployed*
  commit and the working tree is HEAD, and the two differ on every unit that touches a contract. What
  stands in its place is the arithmetic half: the installed bytes are compared against the digest the
  registry announces, read independently of the client that installed them. **So what nothing keeps is
  that the digest names the catalogue's own bytes**, which is the registry's single believed step
  arriving one floor down. **It closes by rebuilding `contracts/` at the commit `servedFrom` declares**
  and hashing the file the announcement names — the shape `packages/registry/rebuild.ts` already has for
  a binding, applied to one file instead of a ledger. **Priced as an order and not as a figure**, which
  is all the method supports: that module checks a commit out under `.rebuilt/` and runs that commit's
  own `ledger` script, so it is minutes where the whole proof beside it is seconds. It is the one entry
  here whose closure would cost more than everything it sits next to, and it is not built.
- **That no file of the tracked tree names the machine it was written on.** The sweep before the first
  push established it and nothing keeps it. **The population is the tracked tree and never the graph**,
  and that is the whole shape of this entry rather than a detail of it: measured at `efb26d1` over
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
- **That nothing this repository publishes names the machine or the account it was built on — on the
  fourth surface, which no sweep has ever covered.** The sweep before the first push, and the one
  ADR-0095 built, read the tracked tree, the reachable objects, the commit messages and the tags. **A
  run log is none of those.** It is written by a workflow, kept by the forge, and published with the
  repository the day it becomes public — measured: a failed `wrangler delete` printed the account
  identifier into an Actions log, in an error message nobody wrote. That run was deleted by hand; the
  class stays open, and its population is *every log of every run ever kept*, which is the one
  population none of the existing sweeps can reach because it is not in git. What would close it is not
  a sweep at all — a log cannot be edited, only deleted — but a rule about what a step may print, and
  the mechanism for that is the same validation stage over this repository's own strings that three
  entries here already name.
- **That a deletion that reports failure has failed.** Measured on the throwaway of ADR-0099:
  `wrangler delete` removed the Worker's script, then asked for a KV namespace list its token had no
  permission for, and exited non-zero. **A partial deletion that exits non-zero is indistinguishable
  from one that did nothing, for anybody reading the exit code** — and the check written to tell them
  apart could not either: it asked the deployment for a page, read 404, and concluded absence. The
  Worker was still there. *A request answers about content; only a listing answers about existence.*
  The repair is in the probe that followed — it ends by listing what exists and fails if the name is
  still among them — and what is **not** closed is the general case: nothing in this repository requires
  a deletion to be proved by a listing, and the next one written will be as free to ask a question that
  cannot answer.
- **That every address this tree serves carries a cache policy this repository chose.** Measured at
  `27d1dbb` over the 76 addresses: **ten of them do not.** The nine modules and `robots.txt` answer
  `public, max-age=14400, must-revalidate`, a policy written in no file here. `theHeaderRules` derives
  one rule per endpoint from `ENDPOINTS`, and a module is not an endpoint, so those ten match nothing
  and fall through to whatever the host does that morning.

  **What the ten do not share is the whole of what makes this an entry rather than a curiosity.** Not an
  extension — nine are `.js` and one is `.txt`. Not a content type, not a depth, not a folder. And
  `llms.txt`, a root-level `text/plain` file beside `robots.txt`, answers `max-age=0`: two files of the
  same format, in the same place, with different answers. **No cause is named, because none was
  measured** — three passes say only that it is stable, and a plausible explanation written here would
  be worth less than the gap it filled.

  **It closes by declaration and not by explanation**, which is why the missing cause does not block it:
  a second family of rules in `packages/site/served-headers.ts`, covering the addresses the emission
  writes that no endpoint names, derived the way the first family is — from `browser.ts`'s module map
  and the three convention constants in `paths.ts`, never from a list somebody types. The one thing that
  repair has to answer is ordering: `_headers` is itself written into the tree it describes, so a
  derivation reading the finished tree is circular and the rules have to come from the same declarations
  the emission does. **Declaring it does not explain the split and does not need to** — it makes the
  split stop deciding anything. Today those ten land on a default; the day the default moves, nothing
  here says so, and that is the failure, not the four hours. ADR-0103.

  **The four hours were dismissed in the line above, and a reading has since cost them.** Measured at
  `755322f`, over five addresses of the origin: the pages and `contract-index` answer `max-age=0,
  must-revalidate`, and `start.js` and `search.js` answer `max-age=14400`. So **a reader returning
  inside four hours is served the repaired HTML and the broken script.** `must-revalidate` does not
  save them - it forces revalidation once the freshness lifetime has run out, never during it - and the
  mixture was met rather than predicted: a browser holding the module from earlier in the session went
  on running it while `curl` showed the origin serving the new one, which read for several minutes as a
  deployment that had not happened.

  **What it costs is not only a visitor, and that is the half worth carrying.** This site is judged by
  looking at it just after a deployment, which is precisely the window in which its two halves disagree
  - so what a reviewer sees can be a mixture of two commits, with neither the page nor the module
  saying which. A defect read there is attributed to the change that was just made, and a defect
  repaired there can go on being visible. The entry above is about a default that could move one day;
  this is the same declaration costing something on the day it was written.
- **That an address the emitted tree serves and no listing names goes on being written.** The pages are
  kept, by a mechanism and at a price the closed entry never considered: it costed a rebuild of the tree
  at every commit an address was first served from, and what does the work is one fetch of the origin's
  own `sitemap.xml`, compared against the sitemap the deployment is about to upload. **What that reaches
  is what a sitemap carries**, and this entry is the rest: the named answers, the nine modules and the
  five files found by convention are served at addresses no listing names, so nothing would say if one
  of them stopped being written.

  **The population is the emitted tree minus its sitemap**, and it is the larger half by count: the
  sitemap names **10** addresses, measured at `15f4edf` off the origin and off this tree, both. The 76
  beside it is `27d1dbb`'s and the two are not subtracted here, because a difference taken across two
  coordinates is a figure nobody can rebuild. What makes it an entry rather than the same entry again is
  that the two halves fail differently: a page is what a reader arrives at from a
  search and can have linked, and an answer is what a client fetches under a digest it holds. The second
  is covered for the frozen ones by permanent rule 6 and by nothing at all for the rest.

  **A second thing nothing keeps, and it is about the mechanism rather than about the population.** The
  coverage is inductive — each run compares one deployment against the one before it — so it holds only
  while every push of `main` runs. A push whose workflow never ran, or a job made non-required, is a link
  missing from that chain, and nothing in a later run can see one. What would close *that* is a reading
  over more than one predecessor, which needs a listing this repository does not keep. ADR-0125.
- **That a declared absence carries the date it was true**, which nothing keeps and which was found on
  this repository's own prose one day after it was written. ADR-0098 published *whether a runner's
  checkout satisfies that has not been measured* in the present tense; the job ran on the next commit
  and the sentence was false. **The class is a sentence asserting, with no stamp, that a specific thing
  has not been measured, where measuring it is possible and would falsify the sentence.** It is
  ADR-0018's rule about a dated number arriving on a declared absence, and it is harder to see there
  because there is no figure to date — nothing looks like a count, so nothing invites a coordinate.
  Swept over the ninety-eight records at `ed1abfd`, and **written as a list rather than as a number,
  because a rank is checked only by rebuilding the whole list**:
  - ADR-0001, *the cause is not established*, of a 126-line gap between two classifiers;
  - ADR-0055, *nobody has ever checked which* arms real cases reach;
  - ADR-0058, *the cheapest contribution is the one nobody has ever made*;
  - ADR-0092, *a surface nobody has seen*;
  - ADR-0094, *presents no measurements at all*, about a page somebody else can change;
  - ADR-0095, *what it cost is not measured and is not claimed*;
  - and ADR-0094 again, *was opened and carries no measurement of any kind* — counted as borderline
    and not as a seventh, because its verb is past and only its claim is present.

  Six become false the day somebody does the thing; the fifth can become false with nobody here acting
  at all, which is the one worth reading twice. **What is deliberately not claimed is that the list is
  complete** — the sweep matched thirteen phrasings and a declared absence has no fixed spelling, so
  what a reader may take is that each entry is real. **It closes on a convention rather than a guard**:
  a declared absence carries the commit at which it was true, exactly as a count does. The executable
  form is the validation stage reading this repository's own strings, which is already on this list,
  already priced, and already refused as a lint over prose.
- **That a control which counts a suite has seen the suite it counted.** `assertWholeSuiteRan` compares
  a total against a total and never looks at the composition, so a guard that stops answering is
  invisible to it as long as something else answers in its place. Measured at `c21865e`, on the state
  ADR-0102 was closing: with a checkout left registered, `packages/registry/frozen-for-life.test.ts`
  cannot start, and the report reads **351 assertions, 347 passed, 4 skipped, 0 failed** — 351 against
  the control's 351, so the check is silent while four guards of the contract under measurement have
  quietly left the suite. **What makes it possible is that ignored is not failed**, and the two are
  indistinguishable to anything that counts. The class is not that cell and not that mutant: it is
  anything that makes a test file unstartable — a `beforeAll` that throws, an import that dies, a
  fixture that cannot be built — and every one of them leaves a cell that reads exactly like a result.
  **The population is the files one cell's run reports**, and what would close it is the comparison
  `assertTheCensusHolds` already makes, read where `assertWholeSuiteRan` runs instead of only during
  calibration. It is not built with ADR-0102 because two controls over one reading have nothing to say
  on the day they disagree, and which of them owns the question is undecided.
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

  **That guard would be green the day it is written, and it was measured rather than assumed.** At
  `27d1dbb` the manifest declares one runtime dependency, `typescript`, and
  `dist/packages/validation/typescript-api.js` imports `typescript/unstable/sync` — so the declaration
  and the walk already agree, and the guard finds nothing. It is written anyway on the rule below about
  a guard born green: what it buys is not today's defect but the day somebody moves a package from one
  list to the other, and on that day the package is installed into every consumer's project.
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
  also carries the criterion. The eight liars are gone and nothing keeps it.

  **This entry used to ask for something and the thing it asked for already existed.** It read *the
  executable form needs each contract to publish its exclusions as data, which is a new frozen field on
  five contracts.* Measured at `5f152b1`: every contract publishes its exclusions in
  `identity.inputDomain` — *not a locale-aware parser*, *not a similarity ratio, not a phonetic match*,
  *not written for a DNS label* — `identity` is inside the frozen half, and a contract page renders it
  under a heading called **What it is for, and what it is not**. There is no field to add, and adding
  one would be a second statement of a frozen half that permanent rule 6 makes unremovable for the life
  of the majors. ADR-0128.

  **So the entry asks for nothing, and what it now says is why.** The exclusions are published and they
  are **prose**, so a check over them is the word-matching this entry already refused — its own
  conclusion, which was more true than its premise. What would close it is a way to read that prose that
  is not word-matching, and nothing here has one. Declared rather than dressed as a mechanism, which is
  the treatment this list exists to give.
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
  reddens **50 guards** under `UndeclaredHarness: … present and not served: stray.ts`. They are not
  all the same list — most carry the seven, `array/group-by@1` carries nine and `number/round@1`
  eight — and that is declared rather than drifted: `THE_SEVEN_FILES` is spread into every entry, the
  extras are written beside it as `[...THE_SEVEN_FILES, 'language.test.ts']`, and the constant's own
  comment says they are its own. What nothing keeps is one level up: **the declaration is checked against the
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
   and every contract of the catalogue is already measured by its own batteries.

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

   **The catalogue ships at five contracts, and it holds six.** The fifth installable one is
   `number/round@1`, published after that line was written, and what the line settles is that the
   *showcase domain* waits rather than that the catalogue is closed. **What it was waiting for is
   behind it and not ahead.** The deferral was to *after the launch*, on the argument that the
   uncertainties left are the user's — whether `toopo add` feels good, whether search finds something
   in ten seconds, whether a contract page convinces — and that none of them is answerable in
   private. The product is in front of users, so all three are answerable now. **The clause was wrong
   about its own order as well**: `number/round@1` was published on 2026-08-20 and `toopo@1.0.0`
   reached npm on 2026-08-17, so the contract it placed before the launch arrived three days after
   it. Whether the showcase domain is built is a decision nobody has taken, and what is settled is
   only that nothing stands in front of it. ADR-0153.
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
4. **The root `package.json` no longer carries `"private": true`, and what replaced it is not a second
   flag.** That rule held for this repository's whole private life and removing it is the deliberate act
   of the unit that published the catalogue. `prepack` builds, and one job now runs `npm publish` — the
   workflow's token is still `contents: read`, exactly one job widens it by `id-token: write`, and **no
   runner holds an npm credential**, which is a guard rather than this sentence. A guard asserts the
   field's *absence* rather than its value, so putting it back reddens - and putting it back would make
   every publication fail. ADR-0106, ADR-0109.
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
- Conventional commits, atomic. **`main` is pushed at the end of a unit, and a unit is not finished
  until the run it triggers is green** — every suite on two runtimes, the deployment behind them,
  and the one proof that reaches it. Nothing else: no force and no rewriting of history.

  **That clause has been broken twice, both times deliberately, both times by the owner's decision,
  and it is written here rather than kept as a rule nobody honours.** The history was reissued on
  2026-08-16 to take a personal address out of every commit, and on 2026-08-18 to take the assistant's
  co-signature out of every commit. Both moved every identifier and neither moved a single tree, which
  is what made the stamped measurements survive as renames. **What stays forbidden is a rewrite that
  is not one of these**: an amendment to tidy a message, a rebase to linearise, a force-push that
  repairs a mistake. Those buy nothing that a new commit does not buy, and they cost every citation in
  the tree at once. A third rewrite is a decision with a record, not a convenience. ADR-0095, ADR-0124.

  Three clauses this line used to carry are gone. It counted the suites, struck by the rule 467
  established one section up — a rank is checked only by rebuilding the whole list, and what the
  sentence is about does not need one. It read *never push and never create a remote*, which held
  until the CI existed, at which point keeping the two apart stopped protecting anything and only
  delayed the reading that says the unit worked. And it read *no tag*, which the two rewrites both
  refuted: the three `evidence/*` tags are annotated, they are reissued with the commits they name,
  and a convention forbidding what the mechanism requires is one that reads as false the first time
  somebody checks it.
- **A commit is signed by whoever wrote it, and the assistant is not a whoever.** `.claude/settings.json`
  turns the co-signature off for anybody who clones this repository, so the convention is a mechanism
  rather than a sentence a contributor has to read. **It is a default and not a prohibition**: crediting
  a person who worked on a change is what a trailer is for, and anybody may write one by hand. What it
  refuses is a trailer nobody decided to add. ADR-0124.
- **Nothing publishes to npm from a keyboard, and nothing asks for a publication either.** This line read
  *nothing to npm ever* until `1.0.0` was published by hand, and then named a dispatch carrying a typed
  word until that turned one decision into two gestures. A publication is a **push of `main` declaring a
  version npm does not hold**, after the run it depends on is green. The deliberate act did not disappear;
  it moved onto the number, which nobody writes by accident, and no credential exists here to make a
  publication any other way. ADR-0109, ADR-0111.
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
- **An example is chosen for what it shows.** Where two examples in one set would show the same thing,
  they do not show it in the same language. The test that decides the next one: could this example make
  its point in another language? If it could, and something else in the set is already in this one, it
  changes. ADR-0120.

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
- **A guard that can find no defect on the day it is written is justified by the event it would catch
  and by what that event would cost**, never by what it finds now. Born green is not the same as
  decorative: the decorative guard is the one that *cannot* fail, and this one fails the day a named
  thing happens. So the entry that proposes it says which event, and what that event costs if nothing
  is watching — and where the cost is small, that is the argument for not writing it. This is the other
  side of *a test that cannot fail is not a test*, and it is easy to invoke as an excuse: a guard whose
  event nobody can name is not born green, it is aimed at nothing.
- **A check that depends on where a line wraps depends on something nobody can see.** Read the text
  with runs of whitespace collapsed, so an expectation is the sentence rather than the sentence plus
  its column width. The alternative is a guard about the instrument going red on a re-flow, repaired by
  transcribing a layout into an expectation, which is one more place the layout is now declared.
- **A guard perturbs the claim, never the object derived from it.** Perturbing the derived object
  establishes that the derivation is self-consistent, which is true of a derivation with a hole in it —
  measured twice, ten units apart, on subjects sharing nothing. It is the cheapest test for a guard
  that cannot fail: ask whether what the guard perturbs is the claim or something computed from it.
  ADR-0087.
- **Checking that a change does not move what you feared says nothing about what it moves.**
  ADR-0129 reordered a shared list of seven filenames and checked `npm run freeze`, because the
  order could have entered a published digest. It had not. What the order *was* load-bearing for was
  a pin one folder away - `array/group-by@1` had been the only contract whose list was not already
  sorted, and the reorder made a sort load-bearing for all five - and that declaration went stale
  with nothing saying so. **What would have caught it is a replay and not a closer reading**, and
  the replay that did catch it was run a unit later for another reason. So a change that moves a
  shared declaration replays the batteries of every folder that reads it, and the check that was
  taken is named beside the one that was not. ADR-0130.
- **Write the guard beside it.** After ADR-0087's test, this is the cheapest way to find a guard that
  cannot fail, and it is a gesture rather than a rule: naming a *neighbouring* guard forces the first
  one's claim to be said out loud — *this one is about the order, so that one is about something else* —
  and the gap shows in that sentence. A reread asks whether a guard looks right, which it does; the
  neighbour asks what it establishes that the neighbour does not, which is the question a decorative
  guard cannot answer. **Four were found this way in one day**, three of them on guards written the same
  hour: a round-trip fixture whose five characters could not disagree, a document check its own
  counter-examples were refused by for another reason, and a page check the column already satisfied.
  ADR-0125, ADR-0126.
- **Write the sentence that explains the decision, for somebody who may disagree with it.** The same
  gesture on a second axis: the neighbour makes a guard's claim explicit by naming what it is *not*
  about, and this makes it explicit by owing a reader an argument. It is what found the false-only
  region of ADR-0141 — *this population shrank and the loss is nil* had to be defended, and defending
  it forced *could the guard ever have been right there?*, where a reread of the guard answers **yes,
  it looks correct**, which it does. **No count is published**, on the rule below that a sentence which
  can be true without counting does not count: what is claimed is that the gesture works and that it
  has fired here. ADR-0141.
- **A guard that is green while its subject is broken is not one form, and the five instances this
  repository has found are five mechanisms.** The list was rebuilt rather than remembered, because it
  reads at a glance like one shape and is not:
  - `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` derives its population from the
    served `<style>`, so **no style element means no iterations**. Still true of the guard today; what
    closes it is the battery cell W-24b and not the guard's shape.
  - `a-first-push-selects-every-battery-rather-than-none` asserted an **outcome two causes reach**.
    Repaired by asserting the cause.
  - a `\b` written through a shell heredoc landed as `0x08`, so the **predicate matched less than its
    text said**. Re-swept at `9b48c5a` over every tracked file: two carry a control character other than
    tab and newline, both the deliberate `0x00` separators this file already names, and no backspace.
  - `expect(done.status).toBe(0)` on a battery pinned green: **the failing input class was never
    supplied**. ADR-0149.
  - and its neighbour, found by the first two of that pair not reddening a perturbation of the filtered
    exit code: **a third claim mistaken for a restatement of one already guarded**.

  **No rank is published and no entry is opened**, because there is no form here to sweep for: an empty
  population, a weak assertion, a narrowed predicate, a missing direction and an unnoticed third branch
  are five different defects. What they share is not a mechanism but a discovery: **a reread of every
  one of them says it looks correct**, and not one was found by rereading - they were found by a mutant,
  by a neighbouring guard naming its own cause, by a character sweep, and twice by perturbing a module
  to see what noticed. That is evidence for the two gestures above rather than a sixth rule.
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
- **A rename may move a name; it may not move a reading.** The test is not *is this a record?* but
  **would replaying this produce this text?** It points in two directions, which is what makes it a
  test rather than a preference: for text this repository's own fixture produced, renaming is what
  restores reproducibility; for a probe taken outside it, on inputs the probe itself named and stamped,
  renaming makes it a transcript of a run nobody performed. ADR-0142.
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
