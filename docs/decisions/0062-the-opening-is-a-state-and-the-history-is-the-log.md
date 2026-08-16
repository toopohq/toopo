---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/decisions.ts
confirmed-by:
  - battery: meta
    guard: every-decision-a-file-cites-exists
---

# The opening of `CLAUDE.md` is a state, and the history is the commit log

## Context and Problem Statement

`CLAUDE.md` is the first thing every session reads. Its opening section was a journal: one sentence
added per unit, *And now… And now…*, 167 lines of it. A session arriving there found the history of the
project where it needed the situation of the project.

Measured over the four commits before this unit that touched the file, it gained between 47 and 135
lines each. It did not drift; it grew by construction, and a dozen units remain before the launch.

## Considered Options

- Keep the journal and add to it, as every unit had.
- Replace it with a state, and let the history live where history lives.

## Decision Outcome

**The opening is a state: what exists, what does not, and what decides the next unit.** A journal
answers *how did we get here*; a session needs *where are we*. The two questions have two readers and
only one of them opens this file.

**The journal was a second statement of `git log`, and a second statement drifts.** Every clause of it
summarised a unit whose commit message carries the same finding at length — 334 of them at the time
this was written — and the clauses had drifted: the section carried an address that no longer resolved,
`cli/breakage.ts`, at a line nobody had read in months.

**And the argument of every clause is now in a record.** The units the journal narrates are the units
whose decisions this folder holds: the five families moved by
[ADR-0001](0001-record-decisions-in-madr-format.md)'s format cover every one of them. A one-line
summary of a decision, standing beside the record that argues it, is the shape this repository has
removed from its own prose eleven times.

## Consequences

The history has two addresses and neither is this file: `git log` for what happened and when, and
`docs/decisions/` for why. `CLAUDE.md` keeps what a session needs before it writes a line — the state,
the rules of the stage, the permanent rules, the conventions, the verification discipline, and what is
still open with what each one costs.

**There is no index of the records in `CLAUDE.md`**, for the reason ADR-0001 refuses an index file in
`docs/decisions/`: the directory listing is the index, because the filenames carry the titles, and a
second statement of what the folder already says is one that drifts.

## The journal this replaced

It is kept here rather than deleted, because nothing this repository publishes is deleted and because
these clauses are the only one-sentence statement of what each unit found. They are a record of what
the file said, not a claim about what is true now: every address, count and present-tense clause in
them is of its own moment.

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
that is computed rather than rendered**: four pages have one, the field held a literal until
[ADR-0096](0096-a-field-is-typed-or-spelled-and-the-type-decides.md), and what a
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

## Confirmation

`every-decision-a-file-cites-exists` reads every tracked `.md`, `CLAUDE.md` included, and refuses an
`ADR-NNNN` that names no record. It is the one guard that reads this file, and it is what makes the
state's pointers to `docs/decisions/` resolvable rather than decorative.

Nothing guards that the state is a state rather than a journal. That is a judgement about prose, and it
is the class this repository prices and refuses — what stands instead is this record, and the shape of
the section it describes.

## What would reopen this

A session that cannot work from the state — something a unit needs that is in neither the state, the
rules, the open list, nor a record. That is the event, and it is checkable: it looks like somebody
opening `git log` to find out how the code works.

## More Information

- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
