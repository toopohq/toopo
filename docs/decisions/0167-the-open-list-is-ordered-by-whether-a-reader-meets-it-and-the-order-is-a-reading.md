---
status: accepted
date: 2026-08-27
decision-makers: Mathis Perron
governs:
  - CLAUDE.md
confirmed-by: []
---

# The open list is ordered by whether a reader meets it, and the order is a reading

## Context and Problem Statement

`CLAUDE.md` opens by saying what decides the next unit:

> **What decides the next unit** is the list of what is still open, below, with what each entry costs.

And the section that list lives in says, of itself:

> what is below is the maintenance backlog of a running product and never a list of things blocking a
> release — the same entries, read at a different urgency, in an order that still says nothing about
> which one is taken next.

One sentence says the list decides; the other says its order decides nothing. That is a thing behaving
like a rule with nothing making it hold — which is the exact form this section is the catalogue of,
arriving on the section.

This record is the reading that supplies the missing half: for every open entry, whether a **reader**
meets it, and by which path. It is a reading and not a rule, and the decision that made it one is
below.

## The population, rebuilt rather than counted

The section runs from line 1012 to line 2591 of `CLAUDE.md` at `0986b70`. The rule:

> An **entry** is a top-level list item — a line matching `^- ` at column zero — inside that section.
> One list inside it records closures rather than entries: the contiguous run of list items following
> the paragraph opening `**Entries that closed are recorded`. That run is excluded. Everything else
> matching `^- ` is an open entry.

Applied at `0986b70`: **56 open entries**, 17 closure items excluded, 2 entries above the
`**Still open** ` subheading and 54 below it.

**Every line number below is `0986b70`'s**, and the commit that carries this record is the one after
it, so `git show 0986b70:CLAUDE.md` is where they resolve. They are a convenience and never the
identifier: what names an entry here is the declaration quoted beside the number, because these
entries have no address and ADR-0118 is why they are not given one.

**The obvious proxy is short by six, and both causes are structural.** Counting `^- \*\*` markers below
the subheading answers **50**. Four entries open with a backticked identifier instead of a bold
sentence — `contractAnatomy`, `CLOCK_DEPENDENCE_RULE`, `benchmarks.profiles[].name`, `outputAlphabet`,
written in the older form — and two entries stand above the subheading, where `CLAUDE.md` introduces
each in as many words: *One entry of this list is not of this list's class*, and *A second entry is not
of this list's class either*.

## The rule, written before it was applied

**THE READER.** Somebody who visits `toopo.dev`, runs `npx toopo`, installs the archive npm serves, or
fetches an answer from the declared origin. Never somebody who reads this repository.

**THE RULE.** An entry is **met** when the artefact whose declaration is unkept is itself something a
reader receives or acts on — the artefact and never the consequence. The chain stops at the first thing
a reader touches. A met entry names every path it arrives by.

An entry that is not met is **none**: the artefact is internal to this repository — a guard, a record, a
comment, a battery, a workflow, a fixture, a suite's configuration, or `CLAUDE.md` itself.

**Why the chain stops there**, which is the clause that makes the rule worth applying: a `none` entry may
permit a defect that one day reaches a reader, and it reaches them *through a further defect that has not
happened*. Counting that as met answers **met** for all 56, because the whole of this repository's
verification exists to protect the reader — and a classification that answers the same for every row
orders nothing.

Two cases the rule settles out loud, because both occur:

- **A prescription is not an artefact.** An entry saying a record tells somebody to do something the
  mechanism forbids is `none`, even where the prescribed repair would land on a reader's surface. What is
  unkept is the record.
- **An artefact nothing links to is still served.** A snapshot no reader has fetched is `origin`, because
  publishing is the act.

**THE SECOND AXIS**, which is what turns a partition into an order. A met entry is **realised** — a reader
receives something wrong today — or **latent** — what a reader receives is correct, and the entry names the
event that would change that. `realised` requires a named measurement: the command and what it answered.
Without one the entry is `latent`, or the classification is wrong. The axis does not apply to `none`.

## The five surfaces, each established by a measurement

The 56 rows rest on these. They were measured rather than read, because a surface assumed is a surface
that can be wrong in a way nothing about it looks old.

### `installed` — the file the tool leaves in the reader's project

`node dist/packages/cli/published.js add string/slugify`, run in an empty directory against the live
origin, wrote `lib/toopo/string/slugify.ts`, `toopo.json` and `toopo.lock`; printed the import line
`import { slugify } from './lib/toopo/string/slugify.js'`; and recorded
`servedFrom: 0986b70ce4e1757c1be034d96bff28f5354c28bf` with `sha256: 1a8ae9d1…` over 3 332 bytes.

**The first probe measured the wrong surface, and the correction is the reason this section exists.**
`npm run toopo` runs `packages/cli/toopo.ts`, which names `localSource` — the working tree serialised —
and stamps `THE_UNPUBLISHED_REVISION`, which is `'0'.repeat(40)`. Its lockfile therefore recorded forty
zeros, which reads exactly like the invented revision one entry of the list is about. The file a reader
executes is `dist/packages/cli/published.js`, the only module that names an origin.

### `client` — what the tool prints, refuses and writes

`node dist/packages/cli/published.js` with no argument prints `usage: npx toopo <command>` and the six
commands. `… list` prints `Take one out with npx toopo remove <domain>/<name>`. `… search small-integers`
prints `Nothing in the catalogue answers "small-integers"`.

### `archive` — what npm serves

`npm pack toopo@1.0.4` and `tar -tzf`: **38 entries, three of them outside `dist/`** —
`package/LICENSE`, `package/package.json`, `package/README.md`. npm ships those whatever `files`
declares, and renders `README.md` on the package page. `npm pack --dry-run --json` over this working
tree answers 38 and the same three.

### `site` — what a person reads

`npm run site:build` at `0986b70` wrote **128 addresses**, of which the site's half is **55**: 18 files
of HTML, 17 Markdown twins, 16 modules a page loads, and 4 crawler files — `_headers`, `llms.txt`,
`robots.txt`, `sitemap.xml`.

### `origin` — what a program or an auditor fetches by address

The other **73**: 28 named answers — `contract-index`, `refusals`, `methodology`, 12 snapshots and 13
bindings — and 45 blobs. `curl https://toopo.dev/contract-index` answers
`servedFrom: 0986b70ce4e1757c1be034d96bff28f5354c28bf`, which is the commit this tree is at, so the local
emission and what the origin serves are one tree.

## The reading

**Measured at `0986b70` by the rule above: 27 entries are met and 29 are not; of the 27, five are
realised and 22 are latent.**

| | met | none |
| --- | --- | --- |
| realised | 5 | — |
| latent | 22 | — |
| — | — | 29 |

### The five a reader meets today

**1593 · That a citation inside a file a published contract freezes ever resolves again — `origin` ·
realised.** `https://toopo.dev/snapshot/855107da…` names its `sharedHarness` as
`packages/catalogue/every-contract.ts` at `651fcc16…`; fetching `https://toopo.dev/blob/651fcc16…`
returns 16 621 bytes that hash to that address and carry `3ec99c5…` and `7dc3b6a…`, while
`git cat-file -t` answers `fatal: Not a valid object name` for both and `commit` for `0986b70` — so an
auditor receives three citations, in two files, that resolve nowhere.

**1296 · That the banner a reader is shown is the banner a reader would receive — `archive`,
`installed` · realised.** `README.md` line 66 shows
`// Copyright (c) 2026 Mathis Perron. SPDX-License-Identifier: MIT-0` and ships in the tarball, while
`node dist/packages/cli/published.js add object/deep-equal` lands a file whose first two lines carry no
copyright at all — so the example a reader is shown and the file a reader receives disagree, on a
contract the origin marks `installable: true`.

**1441 · That a name the catalogue freezes is one a reader can ask for — `client`, `site` · realised.**
`number/parse@1`'s page renders `small-integers` once, and
`node dist/packages/cli/published.js search small-integers` answers
`Nothing in the catalogue answers "small-integers"` — so a reader can read a frozen name on a page and
cannot ask the catalogue for it.

**2348 · That every address this tree serves carries a cache policy this repository chose — `site` ·
realised.** `curl -D -` answers `public, max-age=0, must-revalidate` for `/` and `/contract-index` and
`public, max-age=14400, must-revalidate` for `/packages/site/start.js`, `/packages/registry/search.js`
and `/robots.txt` — a policy written in no file here, so a reader returning within four hours is served
the repaired page and a script up to four hours old.

**1214 · That the divergence debt `contractAnatomy` records can ever be paid — `origin` · realised.**
Fetching every installable contract's binding and then its snapshot returns **seven harness files and no
`language.test.ts` for six of them, and eight with one for `number/round@1`** — so an auditor fetching
`date/add@1` receives a claim about the language and no replay of it, and one fetching `number/round@1`
receives both.

### The twenty-two a reader would meet if a named event happened

| line | the declaration, in short | met by | why it is latent, in one sentence |
| --- | --- | --- | --- |
| 1168 | an alias is not frozen with the major | `origin` | `contract-index` carries `searchAliases` and the digest freezes them, but ADR-0023 removed the eight liars before publication, so no served phrase promises what its contract refuses. |
| 1252 | a contract's prose is true of its own behaviour | `site` | The served `object/deep-equal@1` page renders the false rationale and, in the same block, *Since this was published: … what does not stand is that these two rows witness it*, so no reader receives an uncorrected one. |
| 1317 | a second word of a query is one the contract answers | `client`, `site` | The entry records no instance, and the two-word queries the catalogue is asked are ones it means to answer. |
| 1339 | a module a browser loads is one the guards can see | `site` | `playground.js` and `start.js` are served with **0 block comments and 0 line comments**, so no module reaches a reader with its argument still in it. |
| 1412 | every phrase a contract is found by has been reviewed | `origin` | `contract-index` carries exactly one learned term, `string to integer` on `number/parse@1`, and nothing measured says it promises what that contract refuses. |
| 1570 | two things a reader sees side by side are told apart | `site` | `/catalogue/` renders `<li><a …>group-by</a> — turned down</li>`, so the separator the guard cannot see is present. |
| 1634 | a breakpoint is the arithmetic of the lengths it separates | `site` | The three typed widths are inlined into every page a reader loads and today every page renders, so what is missing is the check and not the layout. |
| 1719 | any layout this site declares is one somebody looked at | `site` | Thirty geometry declarations are kept by nothing that renders, and the last reading taken by hand — ADR-0135's, over 14 pages × 21 widths × 2 themes — found nothing outstanding. |
| 1766 | a linked-to element clears the bar above it | `site` | `--the-menu-at-its-tallest` is `1` and `theMenu` returns one entry, so the arithmetic and the data agree today. |
| 1807 | the spelling this product prints resolves | `installed`, `client` | The install printed `./lib/toopo/string/slugify.js` for a file written at `lib/toopo/string/slugify.ts`, and the claim now made is the TypeScript one, settled by a total reading of three module resolutions. |
| 1936 | a browser does what a document says it does | `site` | The copy control, the search field and the playground are what a reader acts on, and nothing measured says a real browser disagrees with happy-dom about them. |
| 1971 | every surface renders the invocation | `client` | `… list` prints `npx toopo remove <domain>/<name>`, and every user-facing string of `packages/cli/` is converted in this tree. |
| 2260 | a set of examples is not narrower than the contract | `site` | `string/slugify@1`'s page renders four `use-case` blocks under `what-it-is-for`, each verified on its own by a guard that replays the call. |
| 2276 | the revision an installed client records is a commit | `installed` | The lockfile recorded `0986b70…` and `git cat-file -t` answers `commit`, so today's value is real and only an invented one would pass unnoticed. |
| 2297 | the bytes an archive installs are the catalogue's own | `installed` | What the install wrote is byte-identical to `contracts/typescript/string/slugify/reference.ts` — 3 332 B, `1a8ae9d1…` both — so the announced digest does name the catalogue's own bytes at this commit. |
| 2494 | the manifest declares no dependency the product could reach | `archive` | The manifest declares one runtime dependency, `typescript@7.0.2`, and it is the one the published entry point's walk reaches, so the declaration and the walk agree. |
| 2520 | `benchmarks.profiles[].name` claims something about its samples | `site` | A profile's name and its samples are rendered side by side on a contract page, and the entry's disagreement was produced by a deliberate injection rather than found in the catalogue. |
| 2529 | `outputAlphabet` and `samples.producedBy` | `site`, `origin` | Both are fields of a published contract, rendered on its page and served inside its snapshot, and nothing measured says either is false today. |
| 2532 | an alias must not name what its contract refuses to be | `client`, `site`, `origin` | The aliases drive every query the catalogue answers and the eight that lied are gone, so what is missing is the rule's keeper rather than a liar. |
| 2549 | a report may not name a cause no measurement establishes | `client` | The fault sentences are authored across twelve modules of `packages/cli/` and `report.ts` writes the line a reader sees, and the nine instances the entry names are repaired. |
| 2559 | what files a contract's declaration may name | `origin` | A snapshot serves the harness its contract declares — seven files for `string/slugify@1`, eight for `number/round@1` — and nothing checks the declaration itself, though no contract names a file it should not. |
| 2386 | an address the emitted tree serves and no listing names | `site`, `origin` | The sitemap names 17 addresses and the tree writes 128, so 111 are covered by no listing — and all 128 were written at this commit, so what is missing is the check and not an address. |

### The twenty-nine a reader does not meet

Each is real, and each is about something internal to this repository.

| line | the declaration, in short | why it is `none` |
| --- | --- | --- |
| 1363 | the repair a record prescribes is one somebody can carry out | What is unkept is ADR-0035's prescription, and a prescription is not an artefact. |
| 1475 | a comment naming a guard is naming one that exists | The artefact is a comment in a source of this repository. |
| 1503 | an address written as a bare literal | The artefact is an expectation typed into a test. |
| 1525 | the text of a guard is the text somebody wrote | The artefact is a guard's own source. |
| 1548 | a value a guard looks for appears once on the surface | The artefact is the method of `pages.test.ts`'s figure guards. |
| 1613 | an identifier written bare is one somebody can follow | The artefact is this repository's records and comments. |
| 1784 | a paragraph of prose has been read whole | The artefact is every paragraph of prose this repository holds. |
| 1829 | the bound the origin proof waits is one somebody measured | The artefact is a constant of a CI suite. |
| 1868 | the two things a publication depends on outside | The artefacts are npm's trusted-publisher strings and a GitHub environment policy. |
| 1924 | the gate on the publishing job is a conjunction | The artefact is a condition in `suites.yml`. |
| 2006 | a decision can name what confirms it | The artefact is a record's `confirmed-by` and `guardsCollectedIn`. |
| 2030 | a mutant is the defect it describes, not a compile error | The artefact is a battery cell. |
| 2063 | a change is answered by every battery | The artefact is the selection the gates make. |
| 2115 | the bound a battery runs under | The artefact is `timeout-minutes` in a workflow. |
| 2146 | the reading of who has read this prose is one anything executes | The artefacts are `readHands` and `renderHands`. |
| 2165 | a guard total over a declaration is total over its subject | The artefact is the guard's declared populations. |
| 2183 | the witness the end-to-end claim has | The artefact is a mutant's teeth. |
| 2215 | a count of this site's own pages | The served front page carries no `/*` at all and not the stylesheet's prose, so every statement of a page count lives only in this repository. |
| 2232 | the catalogue this file names is the one the registry holds | The artefact is `CLAUDE.md`'s own roster. |
| 2311 | no file of the tracked tree names the machine | The declaration is over the tracked tree, which is this repository; the 35 modules that reach `dist/` are a subset it does not distinguish, and a leak inside one of those would be met. |
| 2327 | nothing published names the machine — a run log | A run log is kept by the forge and read by somebody reading this repository. |
| 2338 | a deletion that reports failure has failed | The artefact is a deployment operation. |
| 2407 | a declared absence carries the date it was true | The artefact is a record's prose. |
| 2432 | a test file goes on answering when the code is wrong | The artefact is a `beforeAll` in seven test files. |
| 2459 | the composition of a mutant cell's run | The artefact is the instrument's own accounting. |
| 2511 | `contractAnatomy`'s eleven entries | The artefact is stage 1's constraint and the triage data beside it. |
| 2517 | `CLOCK_DEPENDENCE_RULE` | The artefact is a declaration imported by nothing executable. |
| 2573 | a pin names what is red on every run | The artefact is a battery pin. |
| 2580 | a reproduced miss rate disagreeing with the runs | The artefact is the method a pin is chosen by. |

## Four entries were found false, and none of them looked old

Rule 3 of the section says an entry can be false without being stale. Four were, and every one was found
by measuring rather than by rereading.

**1214 — two clauses.** *Today's reading of the field is four of six* is now five of seven:
`relationToTheLanguage` is declared in `array/group-by`, `number/round`, `object/deep-equal`,
`string/levenshtein` and `string/slugify`, and missing from `date/add` and `number/parse`. And *the
population is the four founding contracts, and it will not grow* is refuted by the seventh contract:
`object/deep-equal@1` was published after `number/round@1`, serves seven harness files with no
`language.test.ts`, and is frozen — so **five published contracts can never carry a divergence replay,
not four**, and the population grows with every contract published without one.

**1297.** *The only contract carrying the current form is `array/group-by@1`, which is refused and which
nobody can install* is false on both halves: `object/deep-equal@1` also declares `the-marking-alone`, the
origin marks it `installable: true`, and installing it lands a banner with no copyright line. The
closure the entry names — the demonstration moving to a contract published after ADR-0159 — is
**reachable now and not taken**, which is a different state from the one it describes.

**1571.** *The mark after a turned-down contract's name on the front page* is on `/catalogue/`: ADR-0140
moved the catalogue to an address of its own, and the front page carries no such mark.

**1767.** *`--the-menu-at-its-tallest: 3`* is `1`, and *a fourth destination in the masthead* is a second:
`theMenu` returns one entry, `How we verify`.

All four are corrected in place, which is the form `CLAUDE.md` already carries for this.

## Decision Drivers

- The list is what decides the next unit, and its order decides nothing.
- A classification whose rule is not written is an opinion dressed as a measurement.
- A ranking written in prose that nothing reddens would be one more entry in the list it organises.

## Considered Options

1. **A declaration keyed by entry, with a guard over its coverage** — ADR-0155's shape.
2. **A classification derived from each entry's text** — matching the files an entry names against the
   set of reader-facing artefacts.
3. **A dated reading carrying its commit and its rule.**

## Decision Outcome

**Option 3. The order is not made executable, and the reason is a recorded decision of this repository
rather than a price.**

**Option 1 fails on the key.** To key a classification to an entry, an entry needs an identifier, and
`CLAUDE.md` records ADR-0118's refusal in as many words: *It carries no identifier, because nothing cites
it and an address on rewritable prose will one day name something else.* These entries are rewritable
prose by design — this very unit corrects four of them in place. Keying by the opening sentence moves the
key whenever an entry is corrected; keying by ordinal is refused by the rule 467 established, quoted in
that same file — *a rank is checked only by rebuilding the whole list, which is what nobody did*; keying
by the ADR an entry cites is not total, several entries citing none.

**And its red event would be the wrong one.** ADR-0112 refused a guard over the hands reading on exactly
this ground: *Its red event is the wrong one too: somebody edited prose, not prose is defective.* A guard
keyed to entry text reddens when an entry is rewritten — which this file does constantly and correctly —
and its cheapest satisfaction is transcribing the new text into the declaration, which is a ritual read as
coverage.

**Option 2 is wrong here rather than merely refused.** A lint over prose is refused in five separate
entries of the list already; what settles it for this reading is that it gets an answer backwards. The
banner entry names `LICENSE`, `README.md`, `ContractSource` and `mutation/readme.test.ts`, and what puts
it on a reader's surface is that npm ships `README.md` whatever `files` declares — a fact no word of the
entry carries and no match over its text could recover.

**What Option 1 would have kept is not the reading.** ADR-0155 built that shape and published its limit:
*the compiler forces a row and cannot judge it.* Here a declaration would keep the classification's
coverage and say nothing about whether a row is true, and the row is the whole of the reading.

## Consequences

**What this buys.** The list has an order for the first time, and the order is derived from something
outside anybody's taste: five entries are met by a reader today, twenty-two would be met if a named event
happened, and twenty-nine are about this repository's own machinery. A session asking what to take next
reads the five first.

**What it does not keep, stated rather than left to be discovered.** Nothing holds this reading to the
list. Entries will be rewritten, closed and opened, and no mechanism will notice that the reading has
stopped describing them. It is a photograph at `0986b70`, taken by the rule written above, and it is worth
exactly what a photograph is worth: it says what was true when it was taken and nothing about tomorrow.
That is why `CLAUDE.md` carries it as a stamped reading and never as a present-tense rule — the second
would be entry 57 of the list, and the list is the catalogue of exactly that mistake.

**A blind spot in the reading itself.** The `none` verdict for *no file of the tracked tree names the
machine it was written on* is the rule applied honestly to an entry whose population straddles the line:
the declaration is over the tracked tree, and a subset of that tree reaches readers as `dist/` and as the
sixteen served modules. The rule answers `none` because the declaration does; a leak inside that subset
would be met, and nothing in the entry or in this reading separates the two.

**A cost that is not this reading's and is recorded here because it was found by taking it.** Measuring
the `client` surface produced a defect on the published package that no entry of the list covers:
`npx toopo@1.0.4 add nonsense/nothing` prints its refusal correctly and then exits **127** with
`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76`. It reproduced
three times out of three through `dist/packages/cli/published.js` and once through `npx` against the
published package, on `win32` and node `v24.15.0`. It is isolated to one shape and no cause is named
here, because none was measured: `list` exits 0, `remove nonsense/nothing` refuses and exits 1,
`search zzzzqqq` reaches the origin and exits 0, `add string/slugify` succeeds and exits 0, and only
`add` with a name the registry does not hold — a refusal after the origin has been reached — aborts. No
reading was taken on another platform or another runtime, so whether a reader who is not on Windows meets
it is unmeasured.

## What would reopen this

- **A reading taken at another commit**, which is what supersedes a photograph. This one is `0986b70`'s.
- **An entry gaining an address.** Option 1 becomes available the day these entries are addressable
  without an address on rewritable prose, and nothing here proposes how.
- **A surface changing.** The five are measured at one commit; a sixth surface, or a change to what npm
  ships, or a client that reads a different origin, moves rows rather than the rule.
- **A `realised` row being repaired**, which moves it to `latent` and never off the list, because what
  the entry declares stays unkept either way.
